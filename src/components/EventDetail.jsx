import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEventDetails } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";

const EventDetails = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const isInvitedEvent = location.state?.from === "invited";

  const { eventData, loading } = useSelector((state) => state.events);
  useEffect(() => {
    dispatch(getEventDetails(eventId));
    AOS.init({ duration: 1000, once: true });
  }, [dispatch, eventId]);

  if (loading) {
    return <Loader />;
  }

  if (!eventData || !eventData.event) return;
  const members = eventData.members || [];

  const event = eventData.event;
  return (
    <div className="event-details-container">
      <div
        data-aos="fade-up"
        className="event-banner"
        style={{ backgroundImage: `url(${event.image_url})` }}
      >
        {isInvitedEvent && (
          <div className="invited-name">
            <img src="/Images/suit2.png" alt="Creator" />
            <div>
              Created By
              <h4>{event.organizer?.name}</h4> 
            </div>
          </div>
        )}
      </div>

      <div className="event-details container">
        <div className="event-info row" data-aos="fade-up">
          <div className="event-name col-md-6">
            <h2>{event.name}</h2>
          </div>

          <div className="event-location col-md-4">
            <h4>Location</h4>
            <p>{event.location}</p>
          </div>

          <div className="event-date col-md-2">
            <h4>Date</h4>
            <p>{new Date(event.date).toLocaleString()}</p>
          </div>
        </div>

        <div className="event-description" data-aos="fade-up">
          <h4>Event Description</h4>
          <p>{event.description}</p>
        </div>

        <div className="row detail">
          <div className="event-members col-md-6" data-aos="fade-right">
            <h3>Members</h3>
            {members && members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="member">
                  <div className="member-row">
                    <div className="member-info">
                      <div className="member-image">
                        <img src={member.image_url} alt={member.name} />
                      </div>
                      <div className="member-center">
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                      </div>
                    </div>

                    <div className="progress-bar">
                      {member.progressSteps?.map((step, index) => (
                        <div className="progress-step" key={index}>
                          <span>{step.label}</span>
                          <div
                            className={`step-circle ${
                              step.completed ? "completed" : "in-progress"
                            }`}
                          >
                            {step.completed && (
                              <i className="fa-solid fa-check"></i>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No members available</p> // This will show if there are no members
            )}
          </div>

          <div className="event-look col-md-6" data-aos="fade-left">
            <h3>Event Look</h3>
            <div className="look-items">
              {event.looks?.map((look, index) => (
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
