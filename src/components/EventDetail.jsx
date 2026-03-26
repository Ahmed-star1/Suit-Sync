import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEventDetails, deleteLook } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

const EventDetails = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isInvitedEvent = location.state?.from === "invited";

  const { user } = useSelector((state) => state.auth);

  const { eventData, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEventDetails(eventId));
    AOS.init({ duration: 1000, once: true });
  }, [dispatch, eventId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "UTC",
    }).format(new Date(dateString));
  };

  // Check if current user is the event creator
  const isEventCreator = () => {
    if (!eventData?.event || !user) return false;
    return eventData.event.user_id === user.id;
  };

  const getLookImage = (look) => {
    if (look.image && look.image !== null) {
      return look.image;
    }
    return "/Images/suit1.png";
  };

  const handleLookClick = (look) => {
    if (look.id) {
      navigate(`/shop/product/${look.id}`);
    }
  };

  const handleDeleteLook = async (lookId, e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Delete Look?',
      text: "Are you sure you want to delete this look?",
      icon: 'warning',
      confirmButtonColor: '#000',
      cancelButtonColor: '#000',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteLook({ 
          eventId: eventId, 
          lookId: lookId 
        })).unwrap();
        
        Swal.fire(
          'Deleted!',
          'Look has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to delete look.',
          'error'
        );
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!eventData || !eventData.event) return null;

  const members = eventData.members || [];
  const looks = eventData.looks || [];
  const event = eventData.event;
  const isCreator = isEventCreator();

  return (
    <div className="event-details-container">
      <div
        data-aos="fade-up"
        className="event-banner"
        style={{ backgroundImage: `url(${event.image_url})` }}
      >
        {isInvitedEvent && (
          <div className="invited-name">
            <img src={event.organizer?.image_url} alt="Creator" />
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
            <p>{formatDate(event.date)}</p>
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
                      <div className="progress-step">
                        <span>Invite Accept</span>
                        <div
                          className={`step-circle ${
                            member.status === "accepted"
                              ? "completed"
                              : member.status === "declined"
                                ? "declined"
                                : "pending"
                          }`}
                        >
                          {member.status === "accepted" && (
                            <i className="fa-solid fa-check"></i>
                          )}
                          {member.status === "declined" && (
                            <i className="fa-solid fa-xmark"></i>
                          )}
                        </div>
                      </div>
                      <div className="progress-step">
                        <span>Order Placed</span>
                        <div className="step-circle pending">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      </div>
                      <div className="progress-step">
                        <span>Suit Delivered</span>
                        <div className="step-circle pending">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No members available</p>
            )}
          </div>

          <div className="event-look col-md-6" data-aos="fade-left">
            <h3>Event Look</h3>

            {looks && looks.length > 0 ? (
              <div className="look-items row">
                {looks.map((look, index) => (
                  <div key={index} className="look-item col-md-4" onClick={() => handleLookClick(look)} style={{ cursor: "pointer" }}>
                    <img 
                      src={getLookImage(look)} 
                      alt={look.name}
                      onError={(e) => {
                        e.target.src = "/Images/suit1.png";
                      }}
                    />
                    <i 
                      className="fa-solid fa-trash-can delete-look-icon"
                      onClick={(e) => handleDeleteLook(look.id, e)}
                    ></i>
                    <p>{look.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-look">
                {isInvitedEvent ? (
                  <div className="empty-look-content">
                    <p>
                      The event organizer hasn't assigned a look for this event
                      yet. Please check back later.
                    </p>
                  </div>
                ) : (
                  <div className="empty-look-content">
                    <p>
                      You haven't assigned any look for this event. Start by
                      assigning a look from your orders.{" "}
                    </p>
                    <button
                      className="designBtn2 assign-link"
                      onClick={() => navigate("/my-orders")}
                    >
                      Assign Look
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;