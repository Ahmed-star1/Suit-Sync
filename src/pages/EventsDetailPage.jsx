import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import EventDetails from "../components/EventDetail";

const EventsDetailPage = () => {
  return (
    <div className="main-page">
      <Header />
      <section className="event-detail-Page">
        <EventDetails />
      </section>
      <Footer />
    </div>
  );
};

export default EventsDetailPage;