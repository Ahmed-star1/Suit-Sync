import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEventDetails, deleteLook, resendInvite } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";
import FreeTapeModal from "../components/FreeTapeModal";
import Swal from "sweetalert2";

const DEFAULT_EVENT_IMAGE = "/Images/events-detail-image.png";

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

  const handleResendInvite = async (memberId, email, e) => {
  e.stopPropagation();
  
  const result = await Swal.fire({
    title: 'Resend Invitation?',
    text: `Are you sure you want to resend invitation to ${email}?`,
    icon: 'question',
    confirmButtonColor: '#000',
    confirmButtonText: 'Yes, Resend',
  });

  if (result.isConfirmed) {
    try {
      await dispatch(resendInvite({ 
        eventId: eventId, 
        email: email 
      })).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Invitation Resent!',
        text: `Invitation has been resent to ${email}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: error || 'Failed to resend invitation',
        confirmButtonColor: '#000'
      });
    }
  }
};

  const getLookImage = (look) => {
    if (look.image_url) {
      return look.image_url;
    }
    return "/Images/suit1.png";
  };

  const handleLookClick = (look) => {
    const productId = look.product_id || look.product?.id || look.id;

    if (productId) {
      const lookColor = look.color || look.product?.color || "";
      const colorParam = lookColor
        ? `?color=${encodeURIComponent(lookColor)}`
        : "";

      navigate(`/shop/product/${productId}${colorParam}`);
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
  const eventImage = event.image_url || event.image || DEFAULT_EVENT_IMAGE;

  return (
    <div className="event-details-container">
      <div
        data-aos="fade-up"
        className="event-banner"
        style={{ backgroundImage: `url(${eventImage})` }}
      >
        {isInvitedEvent && (
          <div className="invited-name">
            <img src={event.organizer?.image_url || "/Images/camera.png"} alt="Creator" />
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
                        <img src={member.image_url || "/Images/camera.png"} alt={member.name} />
                      </div>
                      <div className="member-center">
                        <div className="member-name">
                          <h4>{member.name}</h4>
                          <p>{member.role}</p>
                        </div>
                        {!isInvitedEvent && member.status === "invited" && (
                          <button 
                            className="designBtn" 
                            onClick={(e) => handleResendInvite(member.id, member.email, e)}
                          >
                            Resend Invite
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div className="progress-step">
                        <span>Invite Accepted</span>
                        <div
                          className={`step-circle ${
                            member.status === "accepted" ||
                            member.status === "order_purchased" ||
                            member.status === "delivered"
                              ? "completed"
                              : member.status === "declined"
                                ? "declined"
                                : "pending"
                          }`}
                        >
                          {(member.status === "accepted" ||
                            member.status === "order_purchased" ||
                            member.status === "delivered") && (
                            <i className="fa-solid fa-check"></i>
                          )}
                          {member.status === "declined" && (
                            <i className="fa-solid fa-xmark"></i>
                          )}
                        </div>
                      </div>
                      <div className="progress-step">
                        <span>Order Placed</span>
                        <div
                          className={`step-circle ${(
                            member.status === "order_purchased" ||
                            member.status === "delivered"
                          ) ? "completed" : "pending"}`}
                        >
                          {(
                            member.status === "order_purchased" ||
                            member.status === "delivered"
                          ) && (
                            <i className="fa-solid fa-check"></i>
                          )}
                        </div>
                      </div>
                      <div className="progress-step">
                        <span>Suit Shipped</span>
                        <div
                          className={`step-circle ${
                            member.status === "delivered"
                              ? "completed"
                              : "pending"
                          }`}
                        >
                          {member.status === "delivered" && (
                            <i className="fa-solid fa-check"></i>
                          )}
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
                {!isInvitedEvent && (
                  <div 
                    className="look-item-add col-md-4"
                    onClick={() => navigate("/shop")}
                    style={{ cursor: "pointer" }}
                  >
                      <i className="fa-solid fa-plus"></i>
                  </div>
                )}
                {looks.map((look, index) => (
                  <div key={index} className="look-item col-md-4" onClick={() => handleLookClick(look)} style={{ cursor: "pointer" }}>
                    <img 
                      src={getLookImage(look)}
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
                      onClick={() => navigate("/shop")}
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
      <FreeTapeModal shouldShow={isInvitedEvent} />
    </div>
  );
};

export default EventDetails;
