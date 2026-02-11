import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setEventData, getEventData, clearEventData } from "../Utils/localStore";
import { createEventService, getEventsService, getInvitedEventsService, acceptEventInviteService, addNewMemberService, updateEventService, getEventDetailsService  } from "../Services/eventService";

// Async thunk to create an event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await createEventService(eventData);
      if (response && response.data) {
        setEventData([response.data]);
        return response.data;
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Async thunk to save events in localStorage
export const setEvents = createAsyncThunk(
  "events/setEvents",
  async (events, { rejectWithValue }) => {
    try {
      setEventData(events); 
      return events; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Async thunk to add a member to an event
export const setMembers = createAsyncThunk(
  "events/setMembers",
  async (member, { rejectWithValue, getState }) => {
    try {
      const { events } = getState().events;
      const updatedEvents = events.map(event => {
        if (event.id === member.eventId) {
          event.members = [...event.members, member];
        }
        return event;
      });
      setEventData(updatedEvents); 
      return updatedEvents;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// Get Event Thunk
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEventsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch events");
    }
  }
);

// Get Invited Events Thunk
export const getInvitedEvents = createAsyncThunk(
  "events/getInvitedEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInvitedEventsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch invited events");
    }
  }
);

// ACCEPT Event INVITE THUNK
export const acceptInvite = createAsyncThunk(
  "events/acceptInvite",
  async ({ eventId, token }, { rejectWithValue }) => {
    try {
      const response = await acceptEventInviteService(eventId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Invite accept failed");
    }
  }
);

// ADD NEW MEMBER THUNK
export const addNewMember = createAsyncThunk(
  "events/addNewMember",
  async ({ eventId, memberData }, { rejectWithValue }) => {
    try {
      const response = await addNewMemberService(eventId, memberData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add member");
    }
  }
);

// Update Event Thunk
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await updateEventService(eventId, eventData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Event update failed");
    }
  }
);

// Get event details Thunk
export const getEventDetails = createAsyncThunk(
  "events/getEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await getEventDetailsService(eventId); 
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: getEventData(),
    loading: false,
    error: null,
  },
  reducers: {
    clearEventsState: (state) => {
      state.loading = false;
      state.error = null;
      state.events = [];
      clearEventData(); 
    },
  },
  extraReducers: (builder) => {
    builder

      // Set Event 
      .addCase(setEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(setEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(setEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set Members
      .addCase(setMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(setMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(setMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = [action.payload]; 
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Event 
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data;

        if (Array.isArray(data)) {
          state.events = data;
        } else if (Array.isArray(data?.events)) {
          state.events = data.events;
        } else {
          state.events = [];
        }
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Invited Events
      .addCase(getInvitedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvitedEvents.fulfilled, (state, action) => {
        state.loading = false;

        const invitedEvents = action.payload?.data?.invited_events;

        if (Array.isArray(invitedEvents)) {
          state.events = invitedEvents;
        } else {
          state.events = [];
        }
      })
      .addCase(getInvitedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Accept Event Invite
      .addCase(acceptInvite.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptInvite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD EVENT MEMBER
      .addCase(addNewMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewMember.fulfilled, (state, action) => {
        state.loading = false;

        const addedMembers = action.payload?.data?.members;

        if (Array.isArray(addedMembers) && state.events?.length) {
          const lastEventIndex = state.events.length - 1;

          state.events[lastEventIndex] = {
            ...state.events[lastEventIndex],
            event_member: [
              ...(state.events[lastEventIndex].event_member || []),
              ...addedMembers,
            ],
          };
        }
      })
      .addCase(addNewMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Updte Event 
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Event Details
      .addCase(getEventDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.eventData = action.payload;
      })
      .addCase(getEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    },
});

export const { clearEventsState } = eventSlice.actions;
export default eventSlice.reducer;