import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFreeTapeStatus,
  sendFreeTape,
} from "../Redux/Reducers/eventSlice";
import Swal from "sweetalert2";

const FreeTapeModal = ({ shouldShow = true }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

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
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Free tailor's tape request sent successfully.",
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: "#000",
      });
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
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      });
      document.body.style.overflow = "auto";
    }, 300);
  };

  const handleConfirm = async () => {
    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.zip.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await dispatch(sendFreeTape(formData)).unwrap();
    } catch (error) {
      alert(error || "Failed to send request. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      className={`rent-modal-overlay shiping-modal ${fadeIn ? "fade-in" : "fade-out"
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
              name="address"
              className="input"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              type="text"
              disabled={tapeLoading}
            />
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <input
                name="state"
                className="input"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                type="text"
                disabled={tapeLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <input
                name="city"
                className="input"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                type="text"
                disabled={tapeLoading}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <input
                name="zip"
                className="input"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Enter your zip code"
                type="text"
                disabled={tapeLoading}
              />
            </div>
            <div className="form-group col-md-6">
              <input
                name="name"
                className="input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                type="text"
                disabled={tapeLoading}
              />
            </div>
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
