import React from "react";

const ShowEvents = ({ events, onEventClick }) => {
  return (
    <div className="show-events">
      {events.map((event, index) => (
        <div key={index} className="event-card" onClick={() => onEventClick(event)}>
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
              <button><i class="fa-solid fa-eye"></i></button>
              <button><i class="fa-solid fa-trash"></i></button>
              <button><i class="fa-solid fa-pencil"></i></button>
            </div>
          </div>

          <div className="event-details row">
            <div className="event-members col-md-4">
              <div className="members-header">
                <h4>Members</h4>
                <a href="/add-event-member">+ Add More Member</a>
              </div>
              <div className="members-list">
                {event.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <img src={member.image} alt={member.name} />
                    <div>
                      <p>{member.name}</p>
                      <p>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="event-look col-md-8">
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