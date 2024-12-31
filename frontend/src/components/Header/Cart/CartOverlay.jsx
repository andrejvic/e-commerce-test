// CartOverlay.jsx
import React, { Component } from "react";
import CartContext from "../../../context/CartContext";
import CartItemAttributes from "./CartItemAttributes";
import "./CartOverlay.css";

class CartOverlay extends Component {
  static contextType = CartContext;
  handlePlaceOrder = () => {
    const { createOrder } = this.context;
    createOrder("Jovan Neki");
  };
  render() {
    const { cartItems, updateQuantity, updateAttribute } = this.context;
    const { getTotalItemsCount } = this.context;
    const totalItems = getTotalItemsCount();
    return (
      <div className="cart-overlay" data-testid="cart-overlay">
        <h2 className="cart-title">
          My Bag, {totalItems} {totalItems <= 1 ? "item" : "items"}
        </h2>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty</p>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li
                key={`${item.id}-${JSON.stringify(item.selectedAttributes)}`}
                className="cart-item"
              >
                <div className="product-details">
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <p className="product-price">
                      {item.prices[0].currency_symbol}
                      {(item.prices[0].amount * item.quantity).toFixed(2)}
                    </p>
                    <CartItemAttributes
                      attributes={item.attributes}
                      selectedAttributes={item.selectedAttributes}
                      updateAttribute={updateAttribute}
                      itemId={item.id}
                    />
                  </div>

                  <div className="quantity-control">
                    <button
                      className="quantity-decrease"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedAttributes,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-increase"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedAttributes,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <img
                    src={item.gallery[0]}
                    alt={item.name}
                    className="product-image"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <div>Total: {cartItems[0].prices[0].currency_symbol}</div>
              <div>
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + item.prices[0].amount * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </div>
            </div>
            <button
              className="place-order-button"
              onClick={this.handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default CartOverlay;
