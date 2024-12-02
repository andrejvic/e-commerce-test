import React, { Component } from "react";
import CartContext from "../../../context/CartContext";

import cart_icon from "../../../assets/icons/cart.png";
import "../Header.css";

class CartButton extends Component {
  static contextType = CartContext;

  render() {
    const { toggleCartOverlay } = this.props;
    const { getTotalItemsCount } = this.context;
    const totalItems = getTotalItemsCount();

    return (
      <button
        data-testid="cart-btn"
        className="cart-button"
        onClick={toggleCartOverlay}
      >
        <img src={cart_icon} alt="" />
        {totalItems > 0 && <span className="cart-bubble">{totalItems}</span>}
      </button>
    );
  }
}

export default CartButton;
