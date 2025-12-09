import React, { useState, useRef } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateEventForm = () => {
  const [eventImage, setEventImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEventImage(preview);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/add-event-member");
  };

  return (
    <div className="col-md-9 right-column create-event">
      <div className="right-column-content">
        <h2>Create An Event</h2>
        <div className="create-event-form">
          <div className="row">
            <div className="input-group">
              <label>Event Name</label>
              <input
                className="input"
                type="text"
                placeholder="Enter Event Name"
              />
            </div>
            <div className="input-group">
              <label>Select Event Type</label>
              <div className="select-field">
                <select>
                  <option>Select Event Type</option>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate Event</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Event Date</label>
              <input className="input" type="date" />
            </div>
            <div className="input-group">
              <label>Event Location</label>
              <input
                className="input"
                type="text"
                placeholder="Enter Location"
              />
              <i class="fa-solid fa-location-crosshairs"></i>
            </div>
          </div>

          <div className="text-field">
            <label>Event Description</label>
            <textarea
              className="textarea-input"
              placeholder="Write Event Description Here..."
            ></textarea>
          </div>

          <div className="profile-image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />

            {eventImage ? (
              <div className="image-container" style={{ position: "relative" }}>
                <img src={eventImage} alt="Event" />
                <button
                  type="button"
                  className="image-edit-btn"
                  onClick={handleContainerClick}
                >
                  <FaPen size={16} />
                </button>
              </div>
            ) : (
              <div className="placeholder-box" onClick={handlePlusClick}>
                <FaPlus />
              </div>
            )}
          </div>

          <div className="buttons-row">
            <button className="designBtn2">Back</button>
            <button className="designBtn2" onClick={handleClick}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
