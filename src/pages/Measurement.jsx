import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import MeasurementTab from "../components/MeasurementTab";

const MeasurementPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <MeasurementTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MeasurementPage;