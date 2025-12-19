import React, { useEffect } from "react";
import AboutImage from "/Images/AboutBanner.png";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerBanner from "../components/InnerBanner";
import AboutInfo from "../components/AboutInfo";
import WhyChooseUs from "../components/WhyChooseUs";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
      AOS.init({ duration: 1000, once: true });
    }, []);
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