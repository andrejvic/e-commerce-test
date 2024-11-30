import React, { Component } from "react";
import { withApollo } from "@apollo/client/react/hoc";
import { GET_PRODUCT_DETAILS } from "../graphql/queries";
import CartContext from "../context/CartContext";
import ImageGallery from "../components/Product/Details/ImageGallery";
import ProductAttributes from "../components/Product/Details/ProductAttributes";
import Prices from "../components/Product/Details/Prices";
import parse from "html-react-parser";
import "./ProductDetails.css";
import { withParams } from "../hoc/withParams"; // Import withParams HOC

class ProductDetails extends Component {
  static contextType = CartContext;

  state = {
    product: null,
    loading: true,
    error: null,
    selectedAttributes: {},
    groupedAttributes: {},
    currentImageIndex: 0,
  };

  async componentDidMount() {
    const client = this.props.client;
    await this.fetchProductDetails(client);
  }

  fetchProductDetails = async (client) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_DETAILS,
        variables: { id: this.props.params.productId }, // Koristimo params iz HOC-a
      });

      if (data && data.product) {
        const attributes = data.product.attributes.reduce((acc, attr) => {
          if (!acc[attr.name]) {
            acc[attr.name] = [];
          }
          acc[attr.name].push(attr.value);
          return acc;
        }, {});

        const defaultAttributes = Object.keys(attributes).reduce((acc, key) => {
          acc[key] = attributes[key][0]; // Prva vrednost za svaki atribut
          return acc;
        }, {});

        this.setState({
          product: data.product,
          groupedAttributes: attributes,
          selectedAttributes: defaultAttributes,
          loading: false,
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  handleAttributeChange = (attributeName, value) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: value,
      },
    }));
  };

  handleImageChange = (index) => {
    this.setState({ currentImageIndex: index });
  };

  addToCart = () => {
    const { product, selectedAttributes } = this.state;
    if (product) {
      this.context.showMessage("Successfully added to the cart.");
      this.context.addToCart(product, selectedAttributes);
    }
  };

  render() {
    const {
      product,
      loading,
      error,
      groupedAttributes,
      selectedAttributes,
      currentImageIndex,
    } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (!product) {
      return <p>Product not found.</p>;
    }

    const allAttributesSelected =
      Object.keys(groupedAttributes).length ===
      Object.keys(selectedAttributes).length;

    return (
      <div className="product-details-page">
        <ImageGallery
          gallery={product.gallery}
          currentImageIndex={currentImageIndex}
          handleImageChange={this.handleImageChange}
        />
        <div className="product-details-info">
          <ProductAttributes
            product={product}
            groupedAttributes={groupedAttributes}
            selectedAttributes={selectedAttributes}
            handleAttributeChange={this.handleAttributeChange}
          />

          <Prices prices={product.prices} />

          <button
            onClick={this.addToCart}
            data-testid="add-to-cart"
            disabled={!product.inStock || !allAttributesSelected}
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </button>

          <div
            className="product-description"
            data-testid="product-description"
          >
            {parse(product.description)}
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(withParams(ProductDetails));
