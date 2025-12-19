import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventLookTab = () => {
  const [activeTab, setActiveTab] = useState("suit");

  const lookData = {
    suit: [
      { title: "Black Tuxedo Suit", image: "/Images/suit1.png" },
      { title: "Blue Tuxedo Suit", image: "/Images/suit2.png" },
      { title: "Grey Tuxedo Suit", image: "/Images/suit3.png" },
      { title: "Classic Tuxedo Suit", image: "/Images/suit4.png" },
    ],
    shirt: [
      { title: "White Shirt", image: "/Images/suit1.png" },
      { title: "Cream Shirt", image: "/Images/suit3.png" },
    ],
    pant: [
      { title: "Black Pants", image: "/Images/suit4.png" },
      { title: "Grey Pants", image: "/Images/suit3.png" },
    ],
    shoes: [
      { title: "Oxford Shoes", image: "/Images/suit3.png" },
      { title: "Brown Shoes", image: "/Images/suit4.png" },
    ],
    accessories: [
      { title: "Bow Tie", image: "/Images/suit2.png" },
      { title: "Pocket Square", image: "/Images/suit4.png" },
    ],
  };

  const tabs = Object.keys(lookData);

  return (
    <div className="col-md-9 right-column">
      <div className="right-column-content events-look">
        <h2>Event Look</h2>
        <div className="main-tabs events-tab">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="look-grid">
              {lookData[activeTab].map((item, index) => (
                <div className="look-card" key={index}>
                  <img src={item.image} alt={item.title} />
                  <h4>{item.title}</h4>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <button className="designBtn2">Back</button>
      </div>
    </div>
  );
};

export default EventLookTab;