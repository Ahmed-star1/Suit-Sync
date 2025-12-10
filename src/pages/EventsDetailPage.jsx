import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import EventDetails from "../components/EventDetail";

const EventsDetailPage = () => {
  const eventData = {
    eventName: "Alex Doe Wedding",
    eventLocation: "5678 Maple Avenue, New York, NY 10001, USA",
    eventImage: "/Images/events-detail-image.png",
    eventDate: "December 25, 2025",
    eventDescription: "This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed. This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. ",
    members: [
      {
        id: 1,
        image: "/Images/suit1.png",
        name: "James Doe",
        role: "Groomsman 1",
        progressSteps: [
            { label: "Invite Sent", completed: true },
            { label: "Order Placed", completed: true },
            { label: "Suit Delivered", completed: false }
        ],
      },
      {
        id: 2,
        image: "/Images/suit2.png",
        name: "Richard Doe",
        role: "Groomsman 2",
        progressSteps: [
            { label: "Invite Sent", completed: true },
            { label: "Order Placed", completed: true },
            { label: "Suit Delivered", completed: true }
        ],
      },
      {
        id: 3,
        image: "/Images/suit3.png",
        name: "Mathew Doe",
        role: "Groomsman 3",
        progressSteps: [
            { label: "Invite Sent", completed: true },
            { label: "Order Placed", completed: false },
            { label: "Suit Delivered", completed: false }
        ],
      },
    ],
    eventLook: [
      { name: "Black Tuxedo Suit", image: "/Images/suit1.png" },
      { name: "Shirt", image: "/Images/suit2.png" },
      { name: "Black Shoes", image: "/Images/suit3.png" },
    ],
  };

  return (
    <div className="main-page">
      <Header />

      <section className="event-detail-Page">
        <EventDetails eventData={eventData} />
      </section>
      <Footer />
    </div>
  );
};

export default EventsDetailPage;