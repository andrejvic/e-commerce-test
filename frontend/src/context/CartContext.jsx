import React, { createContext, Component } from "react";
import { CREATE_ORDER_MUTATION } from "../graphql/queries";
import { getApolloContext } from "@apollo/client";

const CartContext = createContext();

export class CartProvider extends Component {
  static contextType = getApolloContext();

  state = {
    cartItems: [],
    showCartOverlay: false,
    message: null,
  };

  createOrder = (customerName) => {
    console.log("createOrder called");
    const { cartItems } = this.state;
    const client = this.context.client;

    if (cartItems.length === 0) {
      this.showMessage(
        "Your cart is empty. Add items before placing an order."
      );
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.prices[0].amount,
      attributes: JSON.stringify(item.selectedAttributes),
    }));

    console.log("Order details:", { customerName, items });

    client
      .mutate({
        mutation: CREATE_ORDER_MUTATION,
        variables: {
          customerName,
          items,
        },
      })
      .then((result) => {
        console.log("Order successfully created:", result.data.createOrder);
        if (result.data.createOrder.successMessage) {
          this.showMessage(result.data.createOrder.successMessage);
          this.setState({ cartItems: [] });
        } else if (
          result.data.createOrder.unavailableProducts &&
          result.data.createOrder.unavailableProducts.length > 0
        ) {
          this.showMessage(
            `Some products are unavailable: ${result.data.createOrder.unavailableProducts.join(
              ", "
            )}`
          );
        }
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        this.showMessage("Failed to create order, please try again.");
      });
  };

  toggleCartOverlay = () => {
    this.setState((prevState) => ({
      showCartOverlay: !prevState.showCartOverlay,
    }));
  };

  getTotalItemsCount = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };
  showMessage = (message) => {
    this.setState({ message });
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };

  addToCart = (product, selectedAttributes) => {
    this.setState((prevState) => {
      const updatedCartItems = [...prevState.cartItems];

      const existingProductIndex = updatedCartItems.findIndex(
        (item) =>
          item.id === product.id &&
          this.areAttributesEqual(item.selectedAttributes, selectedAttributes)
      );

      if (existingProductIndex > -1) {
        // If a product with the same attributes already exists, increase the quantity
        updatedCartItems[existingProductIndex] = {
          ...updatedCartItems[existingProductIndex],
          quantity: updatedCartItems[existingProductIndex].quantity + 1,
        };
      } else {
        // If it doesn't exist, add a new product to the cart
        updatedCartItems.push({
          ...product,
          selectedAttributes: selectedAttributes,
          quantity: 1,
        });
      }

      return { cartItems: updatedCartItems };
    });
  };

  areAttributesEqual = (attributes1, attributes2) => {
    const keys1 = Object.keys(attributes1);
    const keys2 = Object.keys(attributes2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check if all attributes are the same
    for (let key of keys1) {
      if (attributes1[key] !== attributes2[key]) {
        return false;
      }
    }

    return true;
  };

  removeFromCart = (productId, selectedAttributes) => {
    this.setState((prevState) => {
      return {
        cartItems: prevState.cartItems.filter(
          (item) =>
            !(
              item.id === productId &&
              this.areAttributesEqual(
                item.selectedAttributes,
                selectedAttributes
              )
            )
        ),
      };
    });
  };

  updateQuantity = (productId, selectedAttributes, quantity) => {
    if (quantity === 0) {
      this.removeFromCart(productId, selectedAttributes);
    } else {
      this.setState((prevState) => {
        const updatedCartItems = prevState.cartItems.map((item) =>
          item.id === productId &&
          this.areAttributesEqual(item.selectedAttributes, selectedAttributes)
            ? { ...item, quantity }
            : item
        );
        return { cartItems: updatedCartItems };
      });
    }
  };

  updateAttribute = (productId, attributeName, value) => {
    this.setState((prevState) => {
      const updatedCartItems = prevState.cartItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              selectedAttributes: {
                ...item.selectedAttributes,
                [attributeName]: value,
              },
            }
          : item
      );
      return { cartItems: updatedCartItems };
    });
  };

  render() {
    return (
      <CartContext.Provider
        value={{
          ...this.state,
          cartItems: this.state.cartItems,
          showCartOverlay: this.state.showCartOverlay,
          toggleCartOverlay: this.toggleCartOverlay,
          addToCart: this.addToCart,
          removeFromCart: this.removeFromCart,
          updateQuantity: this.updateQuantity,
          updateAttribute: this.updateAttribute,
          getTotalItemsCount: this.getTotalItemsCount,
          showMessage: this.showMessage,
          createOrder: this.createOrder,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
export const CartConsumer = CartContext.Consumer;
export default CartContext;
