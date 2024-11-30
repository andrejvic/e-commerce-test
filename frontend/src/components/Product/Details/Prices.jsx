import React, { Component } from "react";

class Prices extends Component {
  render() {
    const { prices } = this.props;

    return (
      <>
        <h3>Price:</h3>
        {prices?.map((price, index) => (
          <p key={index}>
            {price.currency_symbol}
            {price.amount.toFixed(2)}
          </p>
        ))}
      </>
    );
  }
}

export default Prices;
