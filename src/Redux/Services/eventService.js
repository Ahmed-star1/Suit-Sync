import { fetchApi } from "../Utils/helper";
import { API_ENDPOINTS } from "../Constants/endpoints"; 


// Create Event
export const createEventService = async (eventData) => {
  try {
    const formData = new FormData();

    formData.append("name", eventData.name || "");
    formData.append("type", eventData.type || "");
    formData.append("date", eventData.date || "");
    formData.append("location", eventData.location || "");
    formData.append("description", eventData.description || "");

    if (eventData.image) {
      
      if (eventData.image instanceof File) {
        formData.append("image", eventData.image);
      } else if (typeof eventData.image === 'string' && eventData.image.startsWith('data:')) {
        try {
          const base64Data = eventData.image.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          
          const mimeType = eventData.image.substring(
            eventData.image.indexOf(":") + 1,
            eventData.image.indexOf(";")
          );

          const extension = mimeType.split("/")[1];

          const blob = new Blob(byteArrays, { type: mimeType });
          const file = new File(
            [blob],
            `event-image.${extension}`,
            { type: mimeType }
          );

          formData.append("image", file);
        } catch (error) {
          throw new Error("Failed to process image");
        }
      } else {
        throw new Error("Invalid image format");
      }
    } else {
      throw new Error("Event image is required");
    }

    const members = eventData.members || eventData.event_member || [];

    if (Array.isArray(members) && members.length > 0) {
      
      members.forEach((member, index) => {
        if (member.image && typeof member.image === 'string' && member.image.startsWith('data:')) {
          try {
            const base64Data = member.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            
            const blob = new Blob(byteArrays, { type: 'image/png' });
            const file = new File([blob], `member-${index}-image.png`, { 
              type: 'image/png',
              lastModified: new Date().getTime()
            });
            
            formData.append(`event_member[${index}][role]`, member.role || "");
            formData.append(`event_member[${index}][name]`, member.name || "");
            formData.append(`event_member[${index}][phone]`, member.phone || "");
            formData.append(`event_member[${index}][email]`, member.email || "");
            formData.append(`event_member[${index}][image]`, file);
            
          } catch (error) {
            formData.append(`event_member[${index}][role]`, member.role || "");
            formData.append(`event_member[${index}][name]`, member.name || "");
            formData.append(`event_member[${index}][phone]`, member.phone || "");
            formData.append(`event_member[${index}][email]`, member.email || "");
          }
        } else {
          formData.append(`event_member[${index}][role]`, member.role || "");
          formData.append(`event_member[${index}][name]`, member.name || "");
          formData.append(`event_member[${index}][phone]`, member.phone || "");
          formData.append(`event_member[${index}][email]`, member.email || "");
        }
      });
    } else {
    }

    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0] + ': File -', pair[1].name, `(${pair[1].size} bytes)`);
      } else {
        console.log(pair[0] + ': ', pair[1]);
      }
    }

    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.CREATE_EVENT,
      token: true,
      data: formData,
      formData: true,
    });
    
    
    if (response && response.success) {
      return response;
    } else {
      throw new Error(response?.message || "Failed to create event");
    }
    
  } catch (error) {
    
    if (error.response) {
      
      if (error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          console.error(`${key}:`, errors[key]);
        });
      }
    }
    
    throw error;
  }
};

// Get Event 
export const getEventsService = async () => {
  return await fetchApi({
    method: "GET",
    endPoint: API_ENDPOINTS.GET_EVENTS,
    token: true,
  });
};

// Invited Events
export const getInvitedEventsService = async () => {
  return await fetchApi({
    method: "GET",
    endPoint: API_ENDPOINTS.GET_INVITED_EVENTS,
    token: true,
  });
};

// Accept Event Invite 
export const acceptEventInviteService = async (eventId, token) => {
  return await fetchApi({
    method: "GET",
    endPoint: API_ENDPOINTS.ACCEPT_INVITE(eventId, token),
    token: true,
  });
};

// Decline Event Invite 
export const declineEventInviteService = async (eventId, token) => {
  return await fetchApi({
    method: "GET",
    endPoint: API_ENDPOINTS.DECLINE_INVITE(eventId, token),
    token: true,
  });
};

// Add New Members
export const addNewMemberService = async (eventId, memberData) => {
  const formData = new FormData();

  formData.append("members[0][name]", memberData.name);
  formData.append("members[0][email]", memberData.email);
  formData.append("members[0][phone]", memberData.phone);
  formData.append("members[0][role]", memberData.role);
  if (memberData.image != null && memberData.image !== undefined) {
    formData.append("members[0][image]", memberData.image);
    
  }

  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.ADD_NEW_MEMBER(eventId),
    token: true,
    data: formData,
    formData: true,
  });
};

// Update Event
export const updateEventService = async (eventId, eventData) => {
  const formData = new FormData();
  formData.append("name", eventData.name || "");
  formData.append("type", eventData.type || "");
  formData.append("date", eventData.date || "");
  formData.append("location", eventData.location || "");
  formData.append("description", eventData.description || "");

  // EVENT IMAGE
  if (eventData.image instanceof File) {
    formData.append("image", eventData.image);
  }  

  const members = eventData.event_member || [];

  members.forEach((member, index) => {
     if (member.id) {
      formData.append(`event_member[${index}][id]`, member.id);
    }
    formData.append(`event_member[${index}][name]`, member.name);
    formData.append(`event_member[${index}][email]`, member.email);
    formData.append(`event_member[${index}][phone]`, member.phone);
    formData.append(`event_member[${index}][role]`, member.role);

    // Handle member image
    if (member.image instanceof File) {
      formData.append(`event_member[${index}][image]`, member.image);
    }
    console.log(member, "memberImage");
    
  });

  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.UPDATE_EVENT(eventId),
    token: true,
    data: formData,
    formData: true,
  });
};

// Fetch Event Details by eventId
export const getEventDetailsService = async (eventId) => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_EVENT_DETAILS(eventId),
      token: true,  
    });
    
    if (response && response.success) {
      return response.data; 
    } else {
      throw new Error("Failed to fetch event details");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching event details");
  }
};

// Delete Event
export const deleteEventService = async (eventId) => {
  return await fetchApi({
    method: "DELETE",
    endPoint: API_ENDPOINTS.DELETE_EVENT(eventId),
    token: true,
  });
};

// Assign Look to Event Service
export const assignLookToEventService = async (lookData) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.ASSIGN_LOOK,
      token: true,
      data: lookData,
    });
    
    return response;
  } catch (error) {
    console.error("assignLookToEventService error", error);
    throw error;
  }
};

// Get Event Looks Service
export const getEventLooksService = async (eventId) => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_EVENT_LOOKS(eventId),
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("getEventLooksService error", error);
    throw error;
  }
};

// Delete Look Service
export const deleteLookService = async (eventId, lookId) => {
  try {
    const response = await fetchApi({
      method: "DELETE",
      endPoint: API_ENDPOINTS.DELETE_LOOK(eventId, lookId),
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("deleteLookService error", error);
    throw error;
  }
};

// Free Tailor's Tape Service
export const sendFreeTapeService = async (addressData) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.SEND_FREE_TAPE,
      token: true,
      data: addressData,
    });
    
    return response;
  } catch (error) {
    console.error("sendFreeTapeService error", error);
    throw error;
  }
};

// Check if user has already requested free tape
export const checkTapeStatusService = async () => {
  try {
    return localStorage.getItem('free_tape_requested') === 'true';
  } catch (error) {
    console.error("checkTapeStatusService error", error);
    return false;
  }
};
