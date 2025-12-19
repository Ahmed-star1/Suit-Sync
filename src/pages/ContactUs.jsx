import React, { useEffect } from "react";
import AboutImage from "/Images/ContactBanner.png";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerBanner from "../components/InnerBanner";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  useEffect(() => {
      AOS.init({ duration: 1000, once: true });
    }, []);
  return (
    <>
    <div class="contact-page">
      <Header />

      <InnerBanner title="Step Into Elegance Rent or Buy Your Dream Suit Today" background={AboutImage} />
      <ContactForm />
      <ContactInfo />

      <Footer />
    </div>
    </>
  );
};

export default Contact;