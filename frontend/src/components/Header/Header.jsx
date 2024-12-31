import React, { Component } from "react";
import CartOverlay from "./Cart/CartOverlay";
import CategoryMenu from "./CategoryMenu";
import CartButton from "./Cart/CartButton";
import CartContext from "../../context/CartContext";
import { withNavigation } from "../../hoc/withNavigation";
import withQuery from "../../hoc/withQuery";
import { GET_CATEGORIES } from "../../graphql/queries";

import brand_icon from "../../assets/icons/brand_icon.png";

import "./Header.css";

class Header extends Component {
  static contextType = CartContext;

  handleNavigation = () => {
    this.props.navigate("/");
  };

  render() {
    const { toggleCartOverlay, showCartOverlay } = this.context;
    const { data, loading, error } = this.props;

    if (loading) {
      return (
        <header className="header">
          <h1>Product Store</h1>
          <CartButton toggleCartOverlay={toggleCartOverlay} />
          <p>Loading categories...</p>
        </header>
      );
    }

    if (error) {
      return (
        <header className="header">
          <h1>Product Store</h1>
          <CartButton toggleCartOverlay={toggleCartOverlay} />
          <p>Error: {error.message}</p>
        </header>
      );
    }

    return (
      <header className="header">
        <CategoryMenu
          categories={data.categories}
          onCategoryChange={this.handleNavigation}
        />
        <img src={brand_icon} alt="Brand Icon" className="header-brand-icon" />

        <CartButton toggleCartOverlay={toggleCartOverlay} />
        {showCartOverlay && (
          <CartOverlay
            onPlaceOrder={() => console.log("Place Order clicked!")}
          />
        )}
      </header>
    );
  }
}

export default withNavigation(withQuery(Header, GET_CATEGORIES));
