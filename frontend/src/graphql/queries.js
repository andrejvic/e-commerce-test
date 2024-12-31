import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      inStock
      category_id
      category_name
      attributes {
        name
        value
      }
      gallery
      prices {
        amount
        currency_label
        currency_symbol
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($customerName: String!, $items: [OrderItemInput!]!) {
    createOrder(customerName: $customerName, items: $items) {
      successMessage
      unavailableProducts
    }
  }
`;
export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: String!) {
    product(id: $id) {
      id
      name
      description
      gallery
      inStock
      prices {
        amount
        currency_label
        currency_symbol
      }
      attributes {
        name
        value
      }
    }
  }
`;
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;
export const GET_PRODUCT_ATTRIBUTES = gql`
  query GetProductAttributes($productId: String!) {
    productAttributes(productId: $productId) {
      attribute_name
      value
    }
  }
`;
