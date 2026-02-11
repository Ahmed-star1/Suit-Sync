import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/Reducers/authSlice";
import { clearEventData } from "../Redux/Utils/localStore";

const LogoutModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  if (!isOpen) return null;

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    await dispatch(logoutUser());
    clearEventData();

    document.body.style.overflow = "auto";

    onClose();  
    navigate("/login");   
  };

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
                <button
                  className="designBtn2"
                  onClick={handleLogout}
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Logging out..." : "Yes, Please Proceed"}
                </button>

                <button
                  className="designBtn2"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;