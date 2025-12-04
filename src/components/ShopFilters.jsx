import React, { useState } from "react";

const ShopFilters = ({ selectedFilters, onFilterChange }) => {
  const [tabState, setTabState] = useState({
    "build-type": true,
    category: false,
    color: false,
    "rent-buy": false,
  });

  const handleTabToggle = (tab) => {
    setTabState((prevState) => ({
      ...prevState,
      [tab]: !prevState[tab],
    }));
  };

  const filterData = {
    "build-type": ["Skinny", "Athletic", "Slim", "Regular"],
    category: ["Suits", "Tuxedos", "Jackets", "Pants"],
    color: [
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Grey", hex: "#808080" },
    ],
    "rent-buy": ["Buy", "Rent"],
  };

  return (
    <div className="filters-wrapper">
      <h3>FILTER</h3>

      {/* Build Type */}
      <div className={`filter-tab ${tabState["build-type"] ? "open" : ""}`}>
        <div className="filter-heading" onClick={() => handleTabToggle("build-type")}>
          <h4>Build Type</h4>
          <i className={`fa-solid fa-angle-down arrow-icon ${tabState["build-type"] ? "rotate" : ""}`}></i>
        </div>

        {tabState["build-type"] && (
          <div className="filter-options">
            {filterData["build-type"].map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedFilters["build-type"].includes(option)}
                  onChange={() => onFilterChange("build-type", option)}
                />
                <span></span>
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className={`filter-tab ${tabState["category"] ? "open" : ""}`}>
        <div className="filter-heading" onClick={() => handleTabToggle("category")}>
          <h4>Category</h4>
          <i className={`fa-solid fa-angle-down arrow-icon ${tabState["category"] ? "rotate" : ""}`}></i>
        </div>

        {tabState["category"] && (
          <div className="filter-options">
            {filterData.category.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedFilters.category.includes(option)}
                  onChange={() => onFilterChange("category", option)}
                />
                <span></span>
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className={`filter-tab ${tabState["color"] ? "open" : ""} color-filter-tab`}>
        <div className="filter-heading" onClick={() => handleTabToggle("color")}>
          <h4>Color</h4>
          <i className={`fa-solid fa-angle-down arrow-icon ${tabState["color"] ? "rotate" : ""}`}></i>
        </div>

        {tabState["color"] && (
          <div className="filter-options">
            {filterData.color.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedFilters.color.includes(option.name)}
                  onChange={() => onFilterChange("color", option.name)}
                />
                <span className="color-swatch" style={{ borderColor: option.hex }}>
                  <div className="dot" style={{ backgroundColor: option.hex }}></div>
                </span>
                {option.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rent / Buy */}
      <div className={`filter-tab ${tabState["rent-buy"] ? "open" : ""}`}>
        <div className="filter-heading" onClick={() => handleTabToggle("rent-buy")}>
          <h4>Rent or Buy</h4>
          <i className={`fa-solid fa-angle-down arrow-icon ${tabState["rent-buy"] ? "rotate" : ""}`}></i>
        </div>

        {tabState["rent-buy"] && (
          <div className="filter-options">
            {filterData["rent-buy"].map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedFilters["rent-buy"].includes(option)}
                  onChange={() => onFilterChange("rent-buy", option)}
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