import React, { Component } from "react";
import { groupAttributes } from "../../../hoc/groupAttributes";

class CartItemAttributes extends Component {
  render() {
    const { attributes, selectedAttributes } = this.props;

    const groupedAttributes = groupAttributes(attributes);

    return (
      <>
        {Object.keys(groupedAttributes).map((attributeName) => (
          <div
            key={attributeName}
            className={`attribute-selector`}
            data-testid={`cart-item-attribute-${attributeName.toLowerCase()}`}
          >
            <label>{attributeName}:</label>
            <br />
            {groupedAttributes[attributeName].map((value, valueIndex) => (
              <button
                key={valueIndex}
                className={`attribute-button ${
                  selectedAttributes[attributeName] === value ? "selected" : ""
                } ${attributeName === "Color" ? "color-attribute" : ""} `}
                style={{
                  border:
                    selectedAttributes[attributeName] === value
                      ? "1px solid #000"
                      : "1px solid transparent",
                  padding: "10px",
                  margin: "5px",
                }}
                data-testid={`product-attribute-${attributeName.toLowerCase()}-${value.toUpperCase()}`}
              >
                {attributeName === "Color" ? (
                  <span
                    className="color-box"
                    style={{ backgroundColor: value }}
                  />
                ) : (
                  value
                )}
              </button>
            ))}
          </div>
        ))}
      </>
    );
  }
}

export default CartItemAttributes;
