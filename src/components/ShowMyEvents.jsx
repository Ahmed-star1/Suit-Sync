import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NoEventsTabBody from "./NoEvents";
import { getEvents } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";

const ShowMyEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleCardClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  const handleAddMember = (event, e) => {
    e.stopPropagation();
    navigate(`/add-new-members/${event.id}`);
  };

  const handleDeleteEvent = (eventId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this event?")) {
      console.log("Delete event:", eventId);
    }
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    navigate(`/edit-event/${event.id}`, {
      state: { event },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  if (loading) {
    return <Loader />;
  }

  if (events.length === 0) {
    return (
      <NoEventsTabBody
        bodyClass="my-events"
        title="You Haven't Created Any Events Yet"
        description="Start by creating your first event to begin managing your bookings and invitations."
        buttonText="Create an Event"
        icon="/Images/calender.png"
      />
    );
  }

  return (
    <div className="invited-events">
      <div className="row">
        {events.map((event, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="invited-event-card"
              onClick={() => handleCardClick(event)}
              style={{ cursor: "pointer" }}
            >
              <div className="event-image">
                <img src={event.image_url} alt={event.name} />
              </div>

              <div className="event-content">
                <h3>{event.name}</h3>
                <p className="event-address">{event.location}</p>

                <div className="event-date">
                  <span>Date</span>
                  <p>{formatDate(event.date)}</p>
                </div>

                <div className="event-icons">
                  <button
                    className="icon-btn add-btn"
                    onClick={(e) => handleAddMember(event, e)}
                    title="Add Member"
                  >
                    <i className="fa-solid fa-user-plus"></i>
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    onClick={(e) => handleDeleteEvent(event.id, e)}
                    title="Delete Event"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>

                  <button
                    className="icon-btn edit-btn"
                    onClick={(e) => handleEditEvent(event, e)}
                    title="Edit Event"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowMyEvents;