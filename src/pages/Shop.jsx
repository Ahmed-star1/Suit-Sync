import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ShopFilters from "../components/ShopFilters";
import ShopProducts from "../components/ShopProducts";

const Shop = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    "build-type": [],
    category: [],
    color: [],
    "rent-buy": [],
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter((item) => item !== value);
      } else {
        newFilters[filterType].push(value);
      }
      return newFilters;
    });
  };

  return (
    <div className="shop-page">
      <Header />
      <section className="shop-container container">
        <div className="row">
          <div className="shop-left-column col-md-3">
            <ShopFilters selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
          </div>
          <div className="shop-right-column col-md-9">
            <h3>Featured Products</h3>
            <ShopProducts selectedFilters={selectedFilters} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Shop;