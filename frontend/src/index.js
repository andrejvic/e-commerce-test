import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient.js";
import { CategoryProvider } from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
