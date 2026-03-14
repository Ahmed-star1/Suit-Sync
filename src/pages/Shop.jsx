import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ShopFilters from "../components/ShopFilters";
import ShopProducts from "../components/ShopProducts";
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";

const Shop = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const { loading, products } = useSelector((state) => state.products);

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    "rent-buy": [],
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        newFilters[filterType].push(value);
      }
      return newFilters;
    });
  };

  if (loading && products.length === 0) {
    return (
      <div>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="shop-page">
      <Header />
      <section className="shop-container container">
        <div className="row">
          <div className="shop-left-column col-md-3" data-aos="fade-right">
            <ShopFilters
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="shop-right-column col-md-9" data-aos="fade-left">
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