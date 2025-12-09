import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import CreateEventForm from "../components/CreateEventForm";

const CreatEventPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <CreateEventForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CreatEventPage;