import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import CreateEventForm from "../components/CreateEventForm";

const CreatEventPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setFadeIn(true), 100);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleConfirm = () => {
    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address");
      return;
    }

    alert(
      `Thank you! Your tailor's tape will be shipped to: ${shippingAddress}`,
    );
    closeModal();
  };

  const closeModal = () => {
    setFadeIn(false);
    setTimeout(() => {
      setShowModal(false);
      document.body.style.overflow = "auto";
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("rent-modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div className="main-page">
      <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <CreateEventForm />
          </div>
        </div>
      </section>
      <Footer />

      {showModal && (
        <div
          className={`rent-modal-overlay shiping-modal ${fadeIn ? "fade-in" : "fade-out"}`}
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
                />
              </div>
              <div className="modal-footer">
                <button className="designBtn2" onClick={handleConfirm}>
                  CONFIRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatEventPage;