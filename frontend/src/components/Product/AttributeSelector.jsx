import React, { Component } from "react";

class AttributesSelector extends Component {
  render() {
    const {
      attributes = [], // Default to empty array if attributes is undefined
      selectedAttributes,
      onAttributeChange,
      itemId,
      mode = "product", // "product" or "cart"
    } = this.props;

    // Ensure attributes is an array
    const groupedAttributes = Array.isArray(attributes)
      ? attributes.reduce((acc, attr) => {
          if (!acc[attr.name]) {
            acc[attr.name] = [];
          }
          acc[attr.name].push(attr.value);
          return acc;
        }, {})
      : {}; // Default to empty object if attributes is not an array

    return (
      <div className={`attributes-selector ${mode}-attributes`}>
        {Object.keys(groupedAttributes).map((attributeName) => (
          <div
            key={attributeName}
            className="attribute-group"
            data-testid={`${mode}-attribute-${attributeName.toLowerCase()}`}
          >
            <label>{attributeName}:</label>
            <div className="attribute-buttons">
              {groupedAttributes[attributeName].map((value, valueIndex) => {
                const isColorAttribute =
                  attributeName.toLowerCase() === "color";

                return (
                  <button
                    key={valueIndex}
                    onClick={() =>
                      onAttributeChange(attributeName, value, itemId)
                    }
                    className={`attribute-button ${
                      selectedAttributes[attributeName] === value
                        ? isColorAttribute
                          ? "selected-color"
                          : "selected"
                        : ""
                    } ${isColorAttribute ? "color-attribute" : ""}`}
                    style={{
                      border:
                        selectedAttributes[attributeName] === value
                          ? isColorAttribute
                            ? "1px solid yellow"
                            : "1px solid #000"
                          : "1px solid transparent",
                      padding: isColorAttribute ? "0" : "10px",
                      margin: "5px",
                      width: isColorAttribute ? "32px" : "auto",
                      height: isColorAttribute ? "32px" : "auto",
                      backgroundColor: isColorAttribute ? value : "white",
                    }}
                    data-testid={`${mode}-attribute-${attributeName.toLowerCase()}-${value.toLowerCase()}${
                      selectedAttributes[attributeName] === value
                        ? "-selected"
                        : ""
                    }`}
                  >
                    {isColorAttribute ? (
                      <span
                        className="color-box"
                        style={{ backgroundColor: value }}
                      />
                    ) : (
                      value
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default AttributesSelector;
