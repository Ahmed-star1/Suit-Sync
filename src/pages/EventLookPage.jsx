import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import EventLookTab from "../components/EventLookTab";

const EventLookPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <EventLookTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EventLookPage;