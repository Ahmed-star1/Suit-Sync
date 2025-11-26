import React from "react";
import AboutImage from "/Images/AboutBanner.png";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerBanner from "../components/InnerBanner";
import AboutInfo from "../components/AboutInfo";
import WhyChooseUs from "../components/WhyChooseUs";

const About = () => {
  return (
    <>
    <div class="about-page">
      <Header />

      <InnerBanner title="Tailored Elegance for Every Occasion" background={AboutImage} />
      <AboutInfo />
      <WhyChooseUs />

      <Footer />
    </div>
    </>
  );
};

export default About;