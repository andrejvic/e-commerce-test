import React, { Component } from "react";

class CartItemAttributes extends Component {
  render() {
    const { attributes, selectedAttributes } = this.props;

    const groupedAttributes = attributes.reduce((acc, attr) => {
      if (!acc[attr.name]) {
        acc[attr.name] = [];
      }
      acc[attr.name].push(attr.value);
      return acc;
    }, {});

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
                // onClick={() => updateAttribute(itemId, attributeName, value)}
                style={{
                  border:
                    selectedAttributes[attributeName] === value
                      ? "1px solid #000"
                      : "1px solid transparent",
                  padding: "10px",
                  margin: "5px",
                }}
                data-testid={`cart-item-attribute-${attributeName.toLowerCase()}-${value.toLowerCase()}${
                  selectedAttributes[attributeName] === value ? "-selected" : ""
                }`}
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
