import React, { Component } from "react";
import { groupAttributes } from "../../hoc/groupAttributes";

class AttributesSelector extends Component {
  render() {
    const {
      attributes = [],
      selectedAttributes,
      onAttributeChange,
      itemId,
      mode = "product",
    } = this.props;
    const groupedAttributes = groupAttributes(attributes);

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
