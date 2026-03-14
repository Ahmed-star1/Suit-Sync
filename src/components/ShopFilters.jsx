import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ShopFilters = ({ selectedFilters, onFilterChange }) => {
  const [tabState, setTabState] = useState({
    category: false,
    "rent-buy": false,
  });

  const { filters } = useSelector((state) => state.products);
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (filters?.categories && filters.categories.length > 0) {
      setCategories(filters.categories);
    }
  }, [filters]);

  const handleTabToggle = (tab) => {
    setTabState((prevState) => ({
      ...prevState,
      [tab]: !prevState[tab],
    }));
  };

  const rentBuyOptions = ["Buy", "Rent"];

  const handleCategoryChange = (categoryId) => {
    onFilterChange("category", categoryId.toString());
  };

  const handleRentBuyChange = (option) => {
    onFilterChange("rent-buy", option);
  };

  return (
    <div className="filters-wrapper">
      <h3>FILTER</h3>
      
      <div className={`filter-tab ${tabState["category"] ? "open" : ""}`}>
        <div
          className="filter-heading"
          onClick={() => handleTabToggle("category")}
        >
          <h4>Category</h4>
          <i
            className={`fa-solid fa-angle-down arrow-icon ${
              tabState["category"] ? "rotate" : ""
            }`}
          ></i>
        </div>

        {tabState["category"] && (
          <div className="filter-options">
            {categories.length > 0 ? (
              categories.map((category) => (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.category.includes(category.id.toString())}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span></span>
                  {category.name}
                </label>
              ))
            ) : (
              <p className="no-categories">Loading categories...</p>
            )}
          </div>
        )}
      </div>

      <div className={`filter-tab ${tabState["rent-buy"] ? "open" : ""}`}>
        <div
          className="filter-heading"
          onClick={() => handleTabToggle("rent-buy")}
        >
          <h4>Rent or Buy</h4>
          <i
            className={`fa-solid fa-angle-down arrow-icon ${
              tabState["rent-buy"] ? "rotate" : ""
            }`}
          ></i>
        </div>

        {tabState["rent-buy"] && (
          <div className="filter-options">
            {rentBuyOptions.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedFilters["rent-buy"].includes(option)}
                  onChange={() => handleRentBuyChange(option)}
                />
                <span></span>
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopFilters;