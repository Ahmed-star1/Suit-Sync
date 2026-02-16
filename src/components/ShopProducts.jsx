import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Reducers/productSlice";

const ShopProducts = ({ selectedFilters }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const formatPrice = (price) => {
    return `$${price}`;
  };
  
  const getPrimaryImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return "/Images/suit1.png";
    }
    const primaryImage = product.images.find(img => img.is_primary === true);
    if (primaryImage) {
      return primaryImage.image_url;
    } else {
      return product.images[0].image_url;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedFilters.category.length === 0 ||
      selectedFilters.category.includes(product.category?.name || product.category);

    // const matchColor =
    //   selectedFilters.color.length === 0 ||
    //   selectedFilters.color.includes(product.color);

    const matchRentBuy = true; 

    return matchCategory && matchRentBuy;
  });

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`); 
  };

   //  if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="products-grid">
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div 
            className="product-card" 
            key={product.id} 
            onClick={() => handleProductClick(product.id)} 
            style={{ cursor: "pointer" }}
          >
            <img  
              src={getPrimaryImageUrl(product)} 
              alt={product.name} 
            />
            <div className="product-content">
              <h5>{product.name}</h5>
              <div className="product-price">
                <p className="text">Starting At</p>
                <div className="price">
                  <span>Buy: {formatPrice(product.buy_price)}</span>{" "}
                  <span>Rent: {formatPrice(product.rent_price)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ShopProducts;