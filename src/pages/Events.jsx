import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import ShowMyEvents from "../components/ShowMyEvents";
import ShowInvitedEvents from "../components/ShowInvitedEvents";

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("my-events");

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
                        onClick={() => setActiveTab("my-events")}
                      >
                        My Events
                      </button>

                      <button
                        className={activeTab === "invited-events" ? "active" : ""}
                        onClick={() => setActiveTab("invited-events")}
                      >
                        Invited Events
                      </button>
                    </div>

                    {activeTab === "my-events" && (
                      <div className="more-button">
                        <Link to="/create-event" className="add-more-events-btn">
                          <i className="fa-solid fa-plus"></i> Create New Event
                        </Link>
                      </div>
                    )}
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
                        <ShowMyEvents />
                      ) : (
                        <ShowInvitedEvents />
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