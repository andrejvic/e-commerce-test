import React, { createContext, Component } from "react";

const CategoryContext = createContext();

export class CategoryProvider extends Component {
  state = {
    categories: {
      all: "All",
      2: "Clothes",
      3: "Tech",
    },
    activeCategory: {
      id: "all",
      name: "All",
    },
  };

  setActiveCategory = (categoryId) => {
    this.setState({
      activeCategory: {
        id: categoryId,
        name: this.state.categories[categoryId],
      },
    });
  };

  render() {
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
