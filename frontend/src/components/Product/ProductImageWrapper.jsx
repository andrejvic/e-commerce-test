import React, { Component } from "react";

class ProductImageWrapper extends Component {
  render() {
    const { imageUrl, inStock, productName } = this.props;

    return (
      <div className="product-image-wrapper">
        <img src={imageUrl} alt={productName} className="product-image-card" />
        {!inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
    );
  }
}

export default ProductImageWrapper;
