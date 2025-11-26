import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeBanner from "../components/homeBanner";
import HomeAbout from "../components/homeAbout";
import HomeSteps from "../components/homeSteps";
import HomeTrendingStyles from "../components/homeTrendingStyles";
import HomeGallery from "../components/homeGallery";

const Home = () => {
  return (
    <>
      <Header />
      
      <HomeBanner />
      <HomeAbout />
      <HomeSteps />
      <HomeTrendingStyles />
      <HomeGallery />

      <Footer />
    </>
  );
};

export default Home;
