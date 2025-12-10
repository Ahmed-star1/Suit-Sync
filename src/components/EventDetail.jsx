import React from "react";
import { useParams } from "react-router-dom";

const EventDetails = ({ eventData }) => {
  const { eventName } = useParams();

  return (
    <div className="event-details-container">
      <div
        className="event-banner"
        style={{ backgroundImage: `url(${eventData.eventImage})` }}
      ></div>
      <div className="event-details container">
        <div className="event-info row">
          <div className="event-name col-md-6">
            <h2>{eventData.eventName}</h2>
          </div>
          <div className="event-location col-md-4">
            <h4>Location</h4>
            <p>{eventData.eventLocation}</p>
          </div>
          <div className="event-date col-md-2">
            <h4>Date</h4>
            <p>{eventData.eventDate}</p>
          </div>
        </div>
        <div className="event-description">
          <h4>Event Description</h4>
          <p>{eventData.eventDescription}</p>
        </div>
        <div className="row detail">
          <div className="event-members col-md-6">
            <h3>Members</h3>
            {eventData.members.map((member) => (
              <div key={member.id} className="member">
                <div className="member-row">
                  <div className="member-info">
                    <div className="member-image">
                      <img src={member.image} />
                    </div>
                    <div className="member-center">
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    {member.progressSteps.map((step, index) => (
                      <div className="progress-step" key={index}>
                        <span>{step.label}</span>
                        <div
                          className={`step-circle ${
                            step.completed ? "completed" : "in-progress"
                          }`}
                        >
                          {step.completed ? (
                            <i class="fa-solid fa-check"></i>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="event-look col-md-6">
            <h3>Event Look</h3>
            <div className="look-items">
              {eventData.eventLook.map((look, index) => (
                <div key={index} className="look-item">
                  <img src={look.image} alt={look.name} />
                  <p>{look.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
