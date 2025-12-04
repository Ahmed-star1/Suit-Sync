import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "../components/ProductDetail";
import ProductsCarousel from "../components/ProductsCarousel";

const ShopDetailPage = () => {
  const product = {
    id: 2,
    name: "BLACK TUXEDO SUIT",
    description: "This is Dummy Copy. It is Not Never To Be Bloed If Hole Save/ Priced Here Sadly, To Downtowns? The Lode And No Off Inside, I swear! You Dove you to the Sacrifice for Kwoning Have We Be Sadly Dashboard",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "ROYAL BLUE", hex: "#4169E1" },
      { name: "BLACK", hex: "#000000" },
    ],
    buyPrice: "$500.00",
    rentPrice: "$50.00",
    images: [
      "/Images/suit1.png",
      "/Images/suit2.png",
      "/Images/suit3.png",
      "/Images/suit4.png",
    ],
  };

  return (
    <div className="product-detail-page">
      <Header />
      <ProductDetail product={product} />
      <ProductsCarousel type="related" />
      <Footer />
    </div>
  );
};

export default ShopDetailPage;