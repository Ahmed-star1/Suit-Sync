import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import SupportTab from "../components/SupportTab";

const SupportPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <SupportTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SupportPage;