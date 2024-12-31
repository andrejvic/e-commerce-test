import React, { Component } from "react";

class ProductAttributes extends Component {
  render() {
    const {
      groupedAttributes,
      selectedAttributes,
      handleAttributeChange,
      product,
    } = this.props;

    return (
      <>
        <h2>{product.name}</h2>
        {Object.keys(groupedAttributes).map((attributeName) => (
          <div
            key={attributeName}
            className="attribute-selector"
            data-testid={`product-attribute-${attributeName.toLowerCase()}`}
          >
            <label>{attributeName}:</label>
            {groupedAttributes[attributeName].map((value, valueIndex) => {
              const isColorAttribute = attributeName.toLowerCase() === "color";

              return (
                <button
                  key={valueIndex}
                  onClick={() => handleAttributeChange(attributeName, value)}
                  className={`attribute-button ${
                    selectedAttributes[attributeName] === value
                      ? isColorAttribute
                        ? "selected-color"
                        : "selected"
                      : ""
                  }`}
                  style={{
                    borderColor: isColorAttribute ? value : "black",

                    padding: isColorAttribute ? "2px" : "10px",
                    margin: "5px",
                    width: isColorAttribute ? "32px" : "auto",
                    height: isColorAttribute ? "32px" : "auto",
                    backgroundColor: isColorAttribute ? value : "white",
                  }}
                  data-testid={`product-attribute-${attributeName.toLowerCase()}-${value.toUpperCase()}`}
                >
                  {!isColorAttribute && value}
                </button>
              );
            })}
          </div>
        ))}
      </>
    );
  }
}

export default ProductAttributes;
