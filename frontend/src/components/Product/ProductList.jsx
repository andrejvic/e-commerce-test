import React, { Component } from "react";
import { withApollo } from "@apollo/client/react/hoc";
import { GET_PRODUCTS } from "../../graphql/queries";
import CartContext from "../../context/CartContext";
import CategoryContext from "../../context/CategoryContext";
import ProductCard from "./ProductCard";
import CartMessage from "../Header/CartMessage";

import "./ProductList.css";
// import "./ProductList.css"; // Dodaj stilove

class ProductList extends Component {
  state = {
    products: [],
    loading: true,
    error: null,
  };

  async componentDidMount() {
    const client = this.props.client;
    await this.fetchProducts(client);
  }

  fetchProducts = async (client) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCTS,
      });

      this.setState({ products: data.products, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    if (this.state.error) {
      return <p>Error: {this.state.error.message}</p>;
    }

    return (
      <CategoryContext.Consumer>
        {({ activeCategory }) => {
          // Filter products based on the active category
          const filteredProducts = this.state.products.filter((product) => {
            if (activeCategory.id === "all") {
              return true; // If "all", display all products
            }

            if (!product.category_id) {
              console.warn(`Product ${product.name} is missing a category_id!`);
              return false; // Exclude products without category_id from the display
            }

            return product.category_id === parseInt(activeCategory.id);
          }); // Connect App to CartContext

          return (
            <div className="product-list">
              <CartMessage />
              <h2>{activeCategory.name}</h2>
              <ul className="product-list-ul">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ul>
            </div>
          );
        }}
      </CategoryContext.Consumer>
    );
  }
}

export default withApollo(ProductList);
