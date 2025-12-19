import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShowEvents = ({ events, onEventClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [members, setMembers] = useState(
    events.flatMap((event) => event.members)
  );

  const handleRemoveMember = (eventIndex, memberId) => {
    const updatedEvents = events.map((event, idx) => {
      if (idx === eventIndex) {
        return {
          ...event,
          members: event.members.filter((member) => member.id !== memberId),
        };
      }
      return event;
    });

    setMembers((prev) => prev.filter((member) => member.id !== memberId));
    setActiveDropdown(null);
  };

  const toggleDropdown = (e, memberId) => {
    e.stopPropagation(); 
    setActiveDropdown(activeDropdown === memberId ? null : memberId);
  };

  return (
    <div className="show-events">
      {events.map((event, eventIndex) => (
        <div
          key={eventIndex}
          className="event-card"
          onClick={() => onEventClick(event)}
        >
          <div className="event-header">
            <div className="event-image col-md-2">
              <img src={event.eventImage} alt="Event" />
            </div>
            <div className="event-name-address col-md-4">
              <h3>{event.eventName}</h3>
              <p>{event.eventAddress}</p>
            </div>
            <div className="event-date col-md-3">
              <h6>Date</h6>
              <p>{event.eventDate}</p>
            </div>
            <div className="event-buttons col-md-3">
              <Link to={`/event/${event.eventName.toLowerCase().replace(/\s+/g, '-')}`}>
                <i className="fa-solid fa-eye"></i>
              </Link>
              <button>
                <i className="fa-solid fa-trash"></i>
              </button>
              <button>
                <i className="fa-solid fa-pencil"></i>
              </button>
            </div>
          </div>

          <div className="event-details">
            <div className="event-members col-md-5">
              <div className="members-header">
                <h4>Members</h4>
                <Link to={'/add-event-member'}>+ Add More Member</Link>
              </div>
              <div className="members-list">
                {event.members.map((member) => (
                  <div key={member.id} className="member-row">
                    <div className="member-left">
                      <img src={member.image} alt={member.name} />
                    </div>
                    <div className="member-center">
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                    <div className="member-right">
                      <div className="dropdown-container">
                        <button
                          className="dots-btn"
                          onClick={(e) => toggleDropdown(e, member.id)}
                        >
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        {activeDropdown === member.id && (
                          <div className="dropdown-menu">
                            <button
                              className="dropdown-item remove-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMember(eventIndex, member.id);
                              }}
                            >
                              Remove Member
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="event-look col-md-7">
              <h4>Event Look</h4>
              <div className="look-items">
                {event.eventLook.map((look, index) => (
                  <div key={index} className="look-item">
                    <img src={look.image} alt={look.name} />
                    <p>{look.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowEvents;