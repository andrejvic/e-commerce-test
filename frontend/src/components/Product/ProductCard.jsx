import React, { Component } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/CartContext";
import ProductImageWrapper from "./ProductImageWrapper";

import cart_icon from "../../assets/icons/cart_white.png";

class ProductCard extends Component {
  static contextType = CartContext;

  handleQuickAdd = () => {
    const { toggleCartOverlay } = this.context;
    const { product } = this.props;

    const defaultAttributes = product.attributes.reduce((acc, attr) => {
      if (!acc[attr.name]) {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});

    this.context.showMessage("Successfully added to the cart.");
    this.context.addToCart(product, defaultAttributes);
    toggleCartOverlay();
  };

  render() {
    const { product } = this.props;

    return (
      <li
        data-testid={`product-${product.name.toLowerCase().replace(/ /g, "-")}`}
        className={`product-card`}
      >
        <Link to={`/product/${product.id}`} className="product-link">
          <ProductImageWrapper
            imageUrl={product.gallery[0]}
            inStock={product.inStock}
            productName={product.name}
          />
          <h3>{product.name}</h3>
          <p>
            {product.prices[0].currency_symbol}
            {product.prices[0].amount.toFixed(2)}
          </p>
        </Link>
        {product.inStock && (
          <button className="quick-add-button" onClick={this.handleQuickAdd}>
            <img src={cart_icon} alt="" />
          </button>
        )}
      </li>
    );
  }
}

export default ProductCard;
