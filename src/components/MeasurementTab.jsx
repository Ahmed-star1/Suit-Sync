// MeasurementTabsBar.js
import React, { useState } from "react";
import MeasurementForm from "../components/MeasurementForm";
import { AnimatePresence, motion } from "framer-motion";

const MeasurementTabsBar = () => {
  const [activeTab, setActiveTab] = useState("shirt");

  const measurementData = {
    shirt: {
      title: "Shirt Measurement",
      fields: ["Shirt Size"],
      type: "shirt",
    },
    pant: {
      title: "Pant Measurement",
      fields: ["Pant Size", "Pant Length"],
      type: "pant",
    },
    coat: {
      title: "Coat Measurement",
      fields: ["Coat Size", "Coat Length"],
      type: "coat",
    },
    shoes: {
      title: "Shoes Measurement",
      fields: ["Shoes Size"],
      type: "shoes",
    },
  };

  return (
    <div className="col-md-9 right-column measurement-right">
      <div className="right-column-content">
        <div className="header-row">
          <h2>Measurement</h2>
          <button className="designBtn2">How To Measure</button>
        </div>

        <div className="main-tabs">
          {["shirt", "pant", "coat", "shoes"].map((item) => (
            <button
              key={item}
              className={`tab-btn ${activeTab === item ? "active" : ""}`}
              onClick={() => setActiveTab(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <MeasurementForm
              title={measurementData[activeTab].title}
              fields={measurementData[activeTab].fields}
              options={measurementData[activeTab].type}
            />
          </motion.div>
        </AnimatePresence>

        <div className="buttons-row">
          <button className="designBtn2">Back</button>
          <button className="designBtn2">Save</button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementTabsBar;