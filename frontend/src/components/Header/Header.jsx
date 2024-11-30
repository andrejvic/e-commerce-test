import React, { Component } from "react";
import { ApolloConsumer } from "@apollo/client";
import { GET_CATEGORIES } from "../../graphql/queries";
import CartOverlay from "./CartOverlay";
import CategoryMenu from "./CategoryMenu"; // Import CategoryMenu
import CartButton from "./CartButton"; // Import CartButton
import CartContext from "../../context/CartContext";
import { withNavigation } from "../../hoc/withNavigation";

import brand_icon from "../../assets/icons/brand_icon.png";

import "./Header.css";

class Header extends Component {
  static contextType = CartContext;

  state = {
    categories: [],
    loading: true,
    error: null,
    // showCartOverlay: false,
  };

  fetchCategories = async (client) => {
    try {
      const { data } = await client.query({
        query: GET_CATEGORIES,
      });
      this.setState({ categories: data.categories, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  handleNavigation = () => {
    this.props.navigate("/");
  };

  render() {
    const { toggleCartOverlay, showCartOverlay } = this.context;
    return (
      <ApolloConsumer>
        {(client) => {
          if (this.state.loading) {
            this.fetchCategories(client);
            return (
              <header className="header">
                <h1>Product Store</h1>
                <CartButton toggleCartOverlay={toggleCartOverlay} />
                <p>Loading categories...</p>
              </header>
            );
          }

          if (this.state.error) {
            return (
              <header className="header">
                <h1>Product Store</h1>
                <CartButton toggleCartOverlay={toggleCartOverlay} />
                <p>Error: {this.state.error.message}</p>
              </header>
            );
          }

          return (
            <header className="header">
              <CategoryMenu
                categories={this.state.categories}
                onCategoryChange={this.handleNavigation}
              />
              <img
                src={brand_icon}
                alt="Brand Icon"
                className="header-brand-icon"
              />

              <CartButton toggleCartOverlay={toggleCartOverlay} />
              {showCartOverlay && (
                <CartOverlay
                  onPlaceOrder={() => console.log("Place Order clicked!")}
                />
              )}
            </header>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default withNavigation(Header);
