import React, { Component } from "react";
import CartContext from "../../context/CartContext";
import "./CartMessage.css";

class CartMessage extends Component {
  static contextType = CartContext;

  render() {
    const { message } = this.context;
    if (!message) return null;

    return (
      <div className="cart-message">
        {message}
        <div className="message-timer"></div>
      </div>
    );
  }
}

export default CartMessage;
