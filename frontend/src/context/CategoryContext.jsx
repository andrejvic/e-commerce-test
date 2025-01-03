import React, { createContext, Component } from "react";
import { GET_CATEGORIES } from "../graphql/queries";
import client from "../apolloClient";

const CategoryContext = createContext();

export class CategoryProvider extends Component {
  state = {
    categories: [],
    activeCategory: { name: "all" },
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const { data } = await client.query({ query: GET_CATEGORIES });
      const categories = [{ id: "all", name: "all" }, ...data.categories];
      this.setState({ categories, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
      console.error("Failed to fetch categories:", error);
    }
  };

  setActiveCategory = (categoryName) => {
    console.log("Setting active category:", categoryName);
    this.setState({
      activeCategory: { name: categoryName },
    });
  };

  render() {
    if (this.state.loading) {
      return <p>Loading categories...</p>;
    }

    if (this.state.error) {
      return <p>Error loading categories: {this.state.error.message}</p>;
    }

    return (
      <CategoryContext.Provider
        value={{
          activeCategory: this.state.activeCategory,
          setActiveCategory: this.setActiveCategory,
        }}
      >
        {this.props.children}
      </CategoryContext.Provider>
    );
  }
}

export const CategoryConsumer = CategoryContext.Consumer;
export default CategoryContext;
