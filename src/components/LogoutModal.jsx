import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LogoutModal = ({ isOpen, onClose }) => {
  if (isOpen) {
    document.body.style.overflow = "hidden"; 
  } else {
    document.body.style.overflow = "auto"; 
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="assign-modal-wrapper">
          <motion.div
            className="assign-modal logout-modal"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.25 }}
          >
            <div className="modal-body">
              <img src="/Images/LogoutModal.png" alt="Logout Icon" />
              <h2>Ready to Log Out?</h2>
              <p>
                You're about to leave your Suit Sync account. Don't worry your
                progress and preferences are safely saved.
              </p>
              <div className="logout-modal-buttons">
                <button className="designBtn2">Yes, Please Proceed</button>
                <button className="designBtn2" onClick={onClose}>Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;