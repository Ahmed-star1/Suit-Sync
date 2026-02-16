import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NoEventsTabBody from "./NoEvents";
import Loader from "../components/Loader";
import {
  getInvitedEvents,
  acceptInvite,
  declineInvite,
} from "../Redux/Reducers/eventSlice";

const ShowInvitedEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading } = useSelector((state) => state.events);

  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    dispatch(getInvitedEvents());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "UTC",
    }).format(new Date(dateString));
  };

  const handleCardClick = (invite) => {
    if (!invite || !invite.event) return;

    const status = invite.invitation?.status;

    if (status === "invited") {
      setSelectedInvite(invite);
      setShowModal(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setAnimateModal(true), 10);
    }

    if (status === "accepted") {
      navigate(`/event/${invite.event.id}`, {
        state: { from: "invited", eventId: invite.event.id },
      });
    }
  };

  const closeModal = () => {
    setAnimateModal(false);
    setIsDeclining(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedInvite(null);
      document.body.style.overflow = "";
    }, 300);
  };

  const handleAccept = async () => {
    if (!selectedInvite) return;

    const eventId = selectedInvite.event.id;
    const token = selectedInvite.invitation.invitation_token;

    try {
      await dispatch(acceptInvite({ eventId, token })).unwrap();

      closeModal();

      navigate(`/event/${eventId}`, {
        state: { from: "invited", eventId },
      });
    } catch (error) {
      console.error("Accept invite failed:", error);
    }
  };

  const handleDecline = async () => {
    if (!selectedInvite) return;
    const eventId = selectedInvite.event.id;
    const token = selectedInvite.invitation.invitation_token;
    try {
      setIsDeclining(true);
      await dispatch(declineInvite({ eventId, token })).unwrap();
      closeModal(); 
    } catch (error) {
      console.error("Decline invite failed:", error);
      setIsDeclining(false);
    }
  };

  if (loading) return <Loader />;

  if (!events || events.length === 0) {
    return (
      <NoEventsTabBody
        bodyClass="invited-events"
        title="You Haven't Been Invited to Any Events Yet"
        description="You'll see events here when someone invites you."
        icon="/Images/calender.png"
      />
    );
  }

  return (
    <>
      <div className="invited-events">
        <div className="row">
          {events
            .filter((invite) => invite?.event) 
            .map((invite, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="invited-event-card"
                  onClick={() => handleCardClick(invite)}
                >
                  <div className="event-image">
                    <img
                      src={
                        invite.event.image_url ||
                        "/Images/default-event.png"
                      }
                      alt={invite.event.name || "Event"}
                    />
                  </div>

                  <div className="event-content">
                    <h3>{invite.event.name}</h3>
                    <p className="event-address">
                      {invite.event.location}
                    </p>

                    <div className="event-date">
                      <span>Date</span>
                      <p>{formatDate(invite.event.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && selectedInvite && (
        <div
          className={`rent-modal-overlay accept-invite ${
            animateModal ? "show" : ""
          }`}
        >
          <div className={`rent-modal ${animateModal ? "show" : ""}`}>
            <h3>You’ve been invited</h3>

            <p>
              You have been invited to{" "}
              <strong>{selectedInvite.event.name}</strong>.
              Would you like to accept this invitation?
            </p>

            <div className="modal-actions">
              <button
                className="designBtn2 outline"
                onClick={handleDecline}
                disabled={isDeclining}
              >
                Deny
              </button>
              <button
                className="designBtn2"
                onClick={handleAccept}
                disabled={isDeclining}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowInvitedEvents;