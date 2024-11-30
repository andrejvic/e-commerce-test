// App.js
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ProductList from "./components/Product/ProductList";
import CartContext from "./context/CartContext"; // Import CartContext
import ProductDetails from "./pages/ProductDetails";
import Header from "./components/Header/Header";
import CartMessage from "./components/Header/CartMessage";

class App extends Component {
  static contextType = CartContext;

  render() {
    const { showCartOverlay, toggleCartOverlay } = this.context;

    return (
      <Router>
        <Header />
        <CartMessage />
        <div className="App">
          {showCartOverlay && (
            <div className="gray-overlay" onClick={toggleCartOverlay}></div>
          )}
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
