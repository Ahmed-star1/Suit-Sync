import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import EditEventForm from "../components/EditEventForm";

const EditEventPage = () => {
  return (
    <div className="main-page">
      <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <EditEventForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EditEventPage;