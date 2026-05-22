import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeBanner from "../components/homeBanner";
import HomeAbout from "../components/homeAbout";
import HomeSteps from "../components/homeSteps";
import ProductsCarousel from "../components/ProductsCarousel";
import HomeGallery from "../components/homeGallery";

const Home = () => {
  return (
    <div className="home">
      <Header />
      
      <HomeBanner />
      <HomeAbout />
      <HomeSteps />
      <ProductsCarousel />
      {/* <HomeGallery /> */}

      <Footer />
    </div>
  );
};

export default Home;
