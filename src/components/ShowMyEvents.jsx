import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NoEventsTabBody from "./NoEvents";
import { getEvents, deleteEvent } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";

const ShowMyEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading } = useSelector((state) => state.events);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowDeleteModal(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setIsDeleting(false);
    setTimeout(() => {
      setShowDeleteModal(false);
      setSelectedEvent(null);
      document.body.style.overflow = "";
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteEvent(selectedEvent.id)).unwrap();
      closeModal();
    } catch (error) {
      setIsDeleting(false);
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
    <>
      <div className="invited-events">
        <div className="row">
          {events.map((event, index) => (
            <div className="col-md-4" key={event.id || index}>
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
                      onClick={(e) => handleDeleteClick(event, e)}
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

      {showDeleteModal && selectedEvent && (
        <div
          className={`rent-modal-overlay delete-event-modal ${
            animateModal ? "show" : ""
          }`}
          onClick={closeModal}
        >
          <div
            className={`rent-modal ${animateModal ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon">
              <i class="fa-solid fa-trash-can"></i>
            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{selectedEvent.name}"</strong>?
            </p>

            <div className="modal-actions">
              <button className="designBtn2 outline" onClick={closeModal} disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="designBtn2 delete-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowMyEvents;
