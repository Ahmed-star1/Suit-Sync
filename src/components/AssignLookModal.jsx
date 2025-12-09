import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AssignLookModal = ({ isOpen, onClose, order }) => {
  const eventOptions = [
    { value: "wedding", label: "Wedding Day" },
    { value: "reception", label: "Reception" },
    { value: "engagement", label: "Engagement" },
  ];

  const categoryOptions = [
    { value: "suit", label: "Suit" },
    { value: "shirt", label: "Shirt" },
    { value: "shoes", label: "Shoes" },
  ];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="assign-modal-wrapper">
          <motion.div
            className="assign-modal"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="row">
                <div className="modal-left col-md-5">
              <img src={order?.image} alt="Look" />
            </div>
            <div className="modal-right col-md-7">
              <h2>Assign Look</h2>
              <p>
                Choose an event from the dropdown below to assign this look.
              </p>

              <label>Select Event</label>
              <div className="select-field">
                <select>
                  <option>Select Event</option>
                  {eventOptions.map((ev) => (
                    <option key={ev.value} value={ev.value}>
                      {ev.label}
                    </option>
                  ))}
                </select>
              </div>

              <label>Look Category</label>
              <div className="select-field">
                <select>
                  <option>Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-buttons">
                <button className="designBtn2" onClick={onClose}>
                  Cancel
                </button>
                <button className="designBtn2" onClick={onClose}>
                  Assign
                </button>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssignLookModal;
