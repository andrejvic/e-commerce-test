import React, { Component } from "react";
import CategoryContext from "../../context/CategoryContext";
import "./Header.css";

class CategoryMenu extends Component {
  static contextType = CategoryContext;

  handleCategoryClick = (category, index) => {
    const { setActiveCategory } = this.context;

    // Use string IDs for consistency
    const newCategoryId = index === 0 ? "all" : (index + 1).toString();
    setActiveCategory(newCategoryId);

    // Call navigation function if it exists
    if (this.props.onCategoryChange) {
      this.props.onCategoryChange(newCategoryId);
    }
  };

  render() {
    const { categories } = this.props;
    const { activeCategory } = this.context;

    return (
      <nav className="menu">
        <ul className="menu-list">
          {categories.map((category, index) => (
            <li
              key={`${category}-${index}`}
              className={`menu-item ${
                (activeCategory.id === "all" && index === 0) ||
                activeCategory.id === (index + 1).toString()
                  ? "active-category"
                  : ""
              }`}
              data-testid={
                (activeCategory.id === "all" && index === 0) ||
                activeCategory.id === (index + 1).toString()
                  ? "active-category-link"
                  : "category-link"
              }
              onClick={() => this.handleCategoryClick(category, index)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default CategoryMenu;
