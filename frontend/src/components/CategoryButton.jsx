import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CategoryButton.css";

const CategoryButton = ({ categoryName, icon, onClick, isSelected }) => {
  return (
    <button
      className={`category-button ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(categoryName)}
    >
      <span className="icon-container">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span>{categoryName}</span>
    </button>
  );
};

export default CategoryButton;
