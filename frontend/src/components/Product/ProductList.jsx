import React, { Component } from "react";
import { GET_PRODUCTS } from "../../graphql/queries";
import CategoryContext from "../../context/CategoryContext";
import ProductCard from "./ProductCard";
import withQuery from "../../hoc/withQuery";
import "./ProductList.css";

class ProductList extends Component {
  render() {
    const { data, loading, error } = this.props;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    return (
      <CategoryContext.Consumer>
        {({ activeCategory }) => {
          const filteredProducts = data.products.filter((product) => {
            if (activeCategory.name.toLowerCase() === "all") {
              return true;
            }

            return (
              product.category_name &&
              product.category_name.toLowerCase() ===
                activeCategory.name.toLowerCase()
            );
          });

          return (
            <div className="product-list">
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

// Wrap the ProductList component with the withQuery HOC
export default withQuery(ProductList, GET_PRODUCTS);
