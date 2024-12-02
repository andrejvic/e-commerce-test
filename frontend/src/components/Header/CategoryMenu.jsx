import React, { Component } from "react";
import { Link } from "react-router-dom";
import CategoryContext from "../../context/CategoryContext";
import "./Header.css";

class CategoryMenu extends Component {
  static contextType = CategoryContext;

  handleCategoryClick = (category) => {
    const { setActiveCategory } = this.context;
    setActiveCategory(category.name);
  };

  render() {
    const { categories } = this.props;
    const { activeCategory } = this.context;

    return (
      <nav className="menu">
        <ul className="menu-list">
          {categories.map((category) => (
            <li
              key={category.name}
              className={`menu-item ${
                activeCategory.name.toLowerCase() ===
                category.name.toLowerCase()
                  ? "active-category"
                  : ""
              }`}
            >
              <Link
                to={`/${category.name.toLowerCase()}`}
                onClick={() => this.handleCategoryClick(category)}
                data-testid={
                  activeCategory.name.toLowerCase() ===
                  category.name.toLowerCase()
                    ? "active-category-link"
                    : "category-link"
                }
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default CategoryMenu;
