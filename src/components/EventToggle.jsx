import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HIDDEN_ROUTE_PREFIXES = [
  "/login",
  "/register",
  "/verify-otp",
  "/forget-password",
  "/verify-code",
  "/reset-password",
  "/my-account",
  "/change-password",
  "/events",
  "/measurement",
  "/my-orders",
  "/support",
  "/privacy-policy",
  "/create-event",
  "/edit-event",
  "/add-event-member",
  "/edit-event-members",
  "/add-new-members",
  "/event",
];

const EventToggle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const shouldHideToggle = HIDDEN_ROUTE_PREFIXES.some((routePrefix) =>
    location.pathname.startsWith(routePrefix)
  );

  if (shouldHideToggle) {
    return null;
  }

  return (
    <button
      type="button"
      className="event-toggle"
      onClick={() => navigate("/events")}
      aria-label="Go to events page"
    >
      <div className="event-toggle-text"><img src="/Images/events.png" /></div>
      
    </button>
  );
};

export default EventToggle;
