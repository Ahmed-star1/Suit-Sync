import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "../components/ProductDetail";
import ProductsCarousel from "../components/ProductsCarousel";

const ShopDetailPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const product = {
    id: 2,
    name: "Tan Performance Wedding Suit",
    description:
      "This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text.",

    pantSizes: [
      { label: "Short", values: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"] },
      { label: "Regular", values: ["28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"] },
      { label: "Long", values: ["28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"] },
    ],

    coatSizes: [
      { label: "Short", values: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"] },
      { label: "Regular", values: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66"] },
      { label: "Long", values: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66"] },
      { label: "XL", values: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"] },
    ],

    shirtSizes: ["Small", "Medium", "Large", "XL", "2XL", "3XL"],

    addons: {
      tie: { label: "Tie", sizes: ["Regular", "Long"] }, 
      bow: { label: "Bow", sizes: ["Small", "Medium", "Large"] },
      shoes: { label: "Shoes", sizes: ["7", "8", "9", "10", "11", "12", "13", "14"] }, 
    },

    colors: [
      { name: "ROYAL BLUE", hex: "#4169E1" },
      { name: "BLACK", hex: "#000000" },
    ],

    buyPrice: "$479.00",
    rentPrice: "$190.00",

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