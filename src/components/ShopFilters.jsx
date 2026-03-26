import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const ShopFilters = ({ selectedFilters, onFilterChange }) => {
  const [tabState, setTabState] = useState({
    category: false,
    "rent-buy": false,
  });
  const [mobileTabState, setMobileTabState] = useState({
    category: true,  // Open by default on mobile
    "rent-buy": true, // Open by default on mobile
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { filters } = useSelector((state) => state.products);
  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (filters?.categories && filters.categories.length > 0) {
      setCategories(filters.categories);
    }
  }, [filters]);

  // Prevent body scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup function to ensure body scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileFilterOpen]);

  const handleTabToggle = (tab, isMobile = false) => {
    if (isMobile) {
      setMobileTabState((prevState) => ({
        ...prevState,
        [tab]: !prevState[tab],
      }));
    } else {
      setTabState((prevState) => ({
        ...prevState,
        [tab]: !prevState[tab],
      }));
    }
  };

  const rentBuyOptions = ["Buy", "Rent"];

  const handleCategoryChange = (categoryId) => {
    onFilterChange("category", categoryId.toString());
  };

  const handleRentBuyChange = (option) => {
    onFilterChange("rent-buy", option);
  };

  return (
    <>
      <div className="mobile-filter-btn-container">
         <button 
          className="mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Filters</span>
          {/* {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )} */}
        </button>
      </div>

      <div className="filters-wrapper">
        <h3>FILTER</h3>
        
        <div className={`filter-tab ${tabState["category"] ? "open" : ""}`}>
          <div
            className="filter-heading"
            onClick={() => handleTabToggle("category", false)}
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
            onClick={() => handleTabToggle("rent-buy", false)}
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
      
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              className="mobile-filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <motion.div 
              className="mobile-filter-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="mobile-filter-header">
                <h3>Filters</h3>
                <button 
                  className="mobile-filter-close"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              <div className="mobile-filter-content">
                <div className="filters-wrapper">
                  <div className={`filter-tab ${mobileTabState["category"] ? "open" : ""}`}>
                    <div
                      className="filter-heading"
                      onClick={() => handleTabToggle("category", true)}
                    >
                      <h4>Category</h4>
                      <i
                        className={`fa-solid fa-angle-down arrow-icon ${
                          mobileTabState["category"] ? "rotate" : ""
                        }`}
                      ></i>
                    </div>

                    {mobileTabState["category"] && (
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

                  <div className={`filter-tab ${mobileTabState["rent-buy"] ? "open" : ""}`}>
                    <div
                      className="filter-heading"
                      onClick={() => handleTabToggle("rent-buy", true)}
                    >
                      <h4>Rent or Buy</h4>
                      <i
                        className={`fa-solid fa-angle-down arrow-icon ${
                          mobileTabState["rent-buy"] ? "rotate" : ""
                        }`}
                      ></i>
                    </div>

                    {mobileTabState["rent-buy"] && (
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
              </div>

              <div className="mobile-filter-footer">
                <button 
                  className="designBtn2"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopFilters;