// Keys for localStorage
const ACCESS_TOKEN_KEY = "access_token";
const EVENTS_KEY = "eventsData";
const IN_PROGRESS_EVENT_KEY = "inProgressEvent"; 

// Save token
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Get token
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Remove token
export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// Clear all auth related data (Logout)
export const clearStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};


// Event Data 

// Save event data to localStorage (with members inside each event)
export const setEventData = (events) => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
  }
};

// Get event data from localStorage (to include members)
export const getEventData = () => {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

// Clear all event data from localStorage
export const clearEventData = () => {
  try {
    localStorage.removeItem(EVENTS_KEY);
  } catch (error) {
  }
};

// Update specific event in localStorage
export const updateEventInStorage = (eventId, updatedEvent) => {
  try {
    const events = getEventData();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1) {
      events[eventIndex] = { 
        ...events[eventIndex], 
        ...updatedEvent,
        members: updatedEvent.members || events[eventIndex].members || []
      };
    } else {
      events.push({ 
        id: eventId, 
        ...updatedEvent,
        members: updatedEvent.members || []
      });
    }
    
    setEventData(events);
    console.log("Event updated in localStorage:", events);
    return events;
  } catch (error) {
    console.error("Error updating event in localStorage:", error);
    return [];
  }
};

// Add member to specific event
export const addMemberToEvent = (eventId, member) => {
  try {
    const events = getEventData();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1) {
      if (!events[eventIndex].members) {
        events[eventIndex].members = [];
      }
      
      // Check if member already exists
      const memberExists = events[eventIndex].members.some(
        existingMember => existingMember.id === member.id
      );
      
      if (!memberExists) {
        events[eventIndex].members.push(member);
        setEventData(events);
      }
    }
    
    return events;
  } catch (error) {
    return [];
  }
};

// Remove member from specific event
export const removeMemberFromEvent = (eventId, memberId) => {
  try {
    const events = getEventData();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1 && events[eventIndex].members) {
      events[eventIndex].members = events[eventIndex].members.filter(
        member => member.id !== memberId
      );
      setEventData(events);
    }
    
    return events;
  } catch (error) {
    return [];
  }
};

// Get specific event by ID
export const getEventById = (eventId) => {
  try {
    const events = getEventData();
    return events.find(event => event.id === eventId) || null;
  } catch (error) {
    return null;
  }
};

// Get latest event (most recent)
export const getLatestEvent = () => {
  try {
    const events = getEventData();
    if (events.length === 0) return null;
    return events[events.length - 1];
  } catch (error) {
    return null;
  }
};

// Create new event and return its ID
export const createNewEvent = (eventData) => {
  try {
    const events = getEventData();
    const newEvent = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      members: [],
      ...eventData
    };
    
    events.push(newEvent);
    setEventData(events);
    
    return newEvent.id;
  } catch (error) {
    return null;
  }
};

// Backup all events data
export const backupEventsData = () => {
  try {
    const events = getEventData();
    const backupKey = `${EVENTS_KEY}_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(events));
    return backupKey;
  } catch (error) {
    return null;
  }
};

// Clear event data (for when event is created or when you need to reset)
export const clearEventDataAfterCreate = () => {
  try {
    const events = getEventData();
    if (events && events.length > 0) {
      events.forEach(event => {
        event.members = []; 
      });
      setEventData(events); 
    }
  } catch (error) {
  }
};

// Save event data during creation/editing (incomplete)
export const setInProgressEvent = (eventData) => {
  try {
    localStorage.setItem(IN_PROGRESS_EVENT_KEY, JSON.stringify(eventData));
  } catch (error) {
  }
};

// Get in-progress event data
export const getInProgressEvent = () => {
  try {
    const data = localStorage.getItem(IN_PROGRESS_EVENT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

// Clear in-progress event (when user navigates away or completes the action)
export const clearInProgressEvent = () => {
  try {
    localStorage.removeItem(IN_PROGRESS_EVENT_KEY);
  } catch (error) {
  }
};

// Clear incomplete event from main events array
export const clearIncompleteEvent = (eventId) => {
  try {
    const events = getEventData();
    const filteredEvents = events.filter(event => event.id !== eventId);
    setEventData(filteredEvents);
  } catch (error) {
  }
};