export const API_ENDPOINTS = Object.freeze({
  
  REGISTER: "auth/register",
  VERIFY_OTP: "auth/verify-otp",
  LOGIN: "auth/login",
  FORGET_PASSWORD: "password/send-token",
  VERIFY_TOKEN: "password/verify-token",
  RESET_PASSWORD: "password/reset",
  LOGOUT: "auth/logout",

  UPDATE_PROFILE: "user/update/profile",
  GET_PROFILE: "user",
   
  CREATE_EVENT: "events/store",
  GET_EVENTS: "events",
  GET_INVITED_EVENTS: "events/invited",
  ACCEPT_INVITE: (eventId, token) => `events/${eventId}/invite/accept/${token}`,
  DECLINE_INVITE: (eventId, token) => `events/${eventId}/invite/decline/${token}`,
  ADD_NEW_MEMBER: (eventId) => `events/${eventId}/add-members`,
  UPDATE_EVENT: (eventId) => `events/update/${eventId}`,
  GET_EVENT_DETAILS: (eventId) => `events/${eventId}/details`,
  DELETE_EVENT: (eventId) => `events/delete/${eventId}`,

  GET_PRODUCTS: "products",
});