import React from "react";
import { useNavigate } from "react-router-dom";

const NoEventsTab = ({ bodyClass, title, description, buttonText, icon }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-event");
  };

  return (
    <div className={`noevents-tab-body ${bodyClass}`}>
      <div className="event-icon">
        <img src={icon} alt="icon" />
      </div>
      <h3 className="noevents-title">{title}</h3>
      <p className="noevents-dis">{description}</p>
      <button className="designBtn2" onClick={handleClick}>{buttonText}</button>
    </div>
  );
};

export default NoEventsTab;
