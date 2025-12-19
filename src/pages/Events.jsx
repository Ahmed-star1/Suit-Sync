import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import NoEventsTabBody from "../components/NoEvents";
import ShowEvents from "../components/ShowEvents";

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("my-events");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const myEventsData = [
    {
      eventName: "Alex Doe Wedding",
      eventDate: "December 25, 2025",
      eventAddress: "5678 Maple Avenue, New York, NY 10001, USA",
      eventImage: "/Images/suit1.png",
      members: [
        {
          id: 1,
          name: "James Doe",
          role: "Groomsman 1",
          image: "/Images/suit2.png",
        },
      ],
      eventLook: [
        { name: "Black Tuxedo Suit", image: "/Images/suit1.png" },
        { name: "Shirt", image: "/Images/suit3.png" },
        { name: "Black Shoes", image: "/Images/suit2.png" },
      ],
    },
    {
      eventName: "James Wedding",
      eventDate: "January 10, 2026",
      eventAddress: "1234 Elm Avenue, New York, NY 10002, USA",
      eventImage: "/Images/suit4.png",
      members: [
        {
          id: 1,
          name: "John Doe",
          role: "Groomsman",
          image: "/Images/suit3.png",
        },
      ],
      eventLook: [
        { name: "Blue Tuxedo", image: "/Images/suit3.png" },
        { name: "White Shirt", image: "/Images/suit4.png" },
        { name: "Black Shoes", image: "/Images/suit1.png" },
      ],
    },
  ];

  const invitedEventsData = [
    {
      eventName: "Steve Wedding",
      eventDate: "February 20, 2026",
      eventAddress: "7890 Oak Avenue, New York, NY 10003, USA",
      eventImage: "/Images/suit2.png",
      members: [
        {
          id: 1,
          name: "Steve Doe",
          role: "Groomsman",
          image: "/Images/suit1.png",
        },
      ],
      eventLook: [
        { name: "Green Tuxedo", image: "/Images/suit3.png" },
        { name: "Grey Shirt", image: "/Images/suit4.png" },
        { name: "Brown Shoes", image: "/Images/suit2.png" },
      ],
    },
  ];

  useEffect(() => {
    if (activeTab === "my-events" && myEventsData.length > 0) {
      setSelectedEvent(myEventsData[0]);
    }
    if (activeTab === "invited-events" && invitedEventsData.length > 0) {
      setSelectedEvent(invitedEventsData[0]);
    }
  }, [activeTab]);

  const handleEventSelection = (eventName) => {
    const eventData =
      activeTab === "my-events" ? myEventsData : invitedEventsData;
    const event = eventData.find((e) => e.eventName === eventName);
    setSelectedEvent(event);
  };

  return (
    <div className="main-page">
      <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <div className="col-md-9 right-column my-events">
              <div className="right-column-content">
                <div className="tabs-design">
                  <div className="events-tabs">
                    <div className="tabs">
                      <button
                      className={activeTab === "my-events" ? "active" : ""}
                      onClick={() => {
                        setActiveTab("my-events");
                        setSelectedEvent(myEventsData[0]);
                      }}>My Events
                    </button>
                    <button
                      className={activeTab === "invited-events" ? "active" : ""}
                      onClick={() => {
                        setActiveTab("invited-events");
                        setSelectedEvent(invitedEventsData[0]);
                      }}
                    >Invited Events</button>
                    </div>
                    <div className="more-button">
                      {activeTab === "my-events" && myEventsData.length > 0 && (
                      <Link to={'/create-event'} className="add-more-events-btn">
                        <i className="fa-solid fa-plus"></i> Add More Events
                      </Link>
                    )}
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {activeTab === "my-events" ? (
                        myEventsData.length === 0 ? (
                          <NoEventsTabBody
                            bodyClass="my-events"
                            title="You Haven't Created Any Events Yet"
                            description="Start by creating your first event to begin managing your bookings and invitations."
                            buttonText="Create an Event"
                            icon="/Images/calender.png"
                          />
                        ) : (
                          <>
                            <div className="event-name-tabs">
                              {myEventsData.map((event) => (
                                <button
                                  key={event.eventName}
                                  className={
                                    selectedEvent?.eventName === event.eventName
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    handleEventSelection(event.eventName)
                                  }
                                >
                                  {event.eventName}
                                </button>
                              ))}
                            </div>
                            {selectedEvent && (
                              <ShowEvents events={[selectedEvent]} />
                            )}
                          </>
                        )
                      ) : invitedEventsData.length === 0 ? (
                        <NoEventsTabBody
                          bodyClass="invited-events"
                          title="You Haven't Been Invited to Any Events Yet"
                          description="You'll see events here when someone invites you."
                          icon="/Images/calender.png"
                        />
                      ) : (
                        <>
                          <div className="event-name-tabs">
                            {invitedEventsData.map((event) => (
                              <button
                                key={event.eventName}
                                className={
                                  selectedEvent?.eventName === event.eventName
                                    ? "active"
                                    : ""
                                }
                                onClick={() =>
                                  handleEventSelection(event.eventName)
                                }
                              >
                                {event.eventName}
                              </button>
                            ))}
                          </div>
                          {selectedEvent && (
                            <ShowEvents events={[selectedEvent]} />
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EventsPage;
