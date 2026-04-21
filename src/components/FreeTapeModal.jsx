import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFreeTapeStatus,
  sendFreeTape,
} from "../Redux/Reducers/eventSlice";

const FreeTapeModal = ({ shouldShow = true }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const { tapeLoading, success } = useSelector((state) => state.tape);

  useEffect(() => {
    if (!shouldShow) {
      setShowModal(false);
      setFadeIn(false);
      return;
    }

    const checkFreeTapeStatus = async () => {
      try {
        const result = await dispatch(getFreeTapeStatus()).unwrap();

        if (result?.data?.is_sent === false) {
          setShowModal(true);
          setTimeout(() => setFadeIn(true), 10);
        }
      } catch (error) {
        console.error("Failed to check tape status:", error);
      }
    };

    checkFreeTapeStatus();
  }, [dispatch, shouldShow]);

  useEffect(() => {
    if (success) {
      closeModal();
    }
  }, [success]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const closeModal = () => {
    setFadeIn(false);
    setTimeout(() => {
      setShowModal(false);
      setShippingAddress("");
      document.body.style.overflow = "auto";
    }, 300);
  };

  const handleConfirm = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address");
      return;
    }

    try {
      await dispatch(
        sendFreeTape({
          address: shippingAddress,
        })
      ).unwrap();
    } catch (error) {
      alert(error || "Failed to send request. Please try again.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("rent-modal-overlay")) {
      closeModal();
    }
  };

  if (!shouldShow || !showModal) {
    return null;
  }

  return (
    <div
      className={`rent-modal-overlay shiping-modal ${
        fadeIn ? "fade-in" : "fade-out"
      }`}
      onClick={handleOverlayClick}
    >
      <div className={`rent-modal ${fadeIn ? "modal-in" : "modal-out"}`}>
        <button className="close-btn" onClick={closeModal}>
          <i className="fa-solid fa-times"></i>
        </button>

        <h3>Send Me a Free Tailor's Tape</h3>
        <p>Enter your shipping address to receive a free tailor's tape.</p>
        <img src="/Images/tailorTape.png" alt="Tailor's Tape" />

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <input
              id="shippingAddress"
              className="input"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address"
              type="text"
              disabled={tapeLoading}
            />
          </div>
          <div className="modal-footer">
            <button
              className="designBtn2"
              onClick={handleConfirm}
              disabled={tapeLoading}
            >
              {tapeLoading ? "SENDING..." : "CONFIRM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreeTapeModal;
