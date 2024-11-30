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
          // Clearing the cart after a successful order
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

  // Function to show/hide the cart overlay
  toggleCartOverlay = () => {
    this.setState((prevState) => ({
      showCartOverlay: !prevState.showCartOverlay,
    }));
  };
  // Function to calculate the total number of items in the cart
  getTotalItemsCount = () => {
    return this.state.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };
  showMessage = (message) => {
    this.setState({ message });

    // Automatically hide the message after 3 seconds
    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };
  // Adding a product to the cart
  addToCart = (product, selectedAttributes) => {
    this.setState((prevState) => {
      const updatedCartItems = [...prevState.cartItems];

      // Find the index of the product with the same attributes
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

  // Function for deep comparison of attributes
  areAttributesEqual = (attributes1, attributes2) => {
    const keys1 = Object.keys(attributes1);
    const keys2 = Object.keys(attributes2);

    // If the number of keys is not the same, attributes are not equal
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

  // Removing a product from the cart
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

  // Updating the quantity of a product
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

  // Updating the attributes of a product in the cart
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
