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
  ASSIGN_LOOK: "events/assign-looks",

  GET_PRODUCTS: "products",
  GET_FEATURED_PRODUCTS: "products/featured",
  GET_RELATED_PRODUCTS: (productId) => `products/related/detail/${productId}`,
  GET_PRODUCT_BY_ID: (id) => `products/${id}`,
  GET_WISHLIST: "user/wishlist",
  ADD_WISHLIST: (productId) => `user/wishlist/${productId}`,

  ADD_TO_CART: "cart/add",
  GET_CART: "cart",
  REMOVE_CART_ITEM: (itemId) => `cart/subtract/${itemId}`,
  GET_CART_RELATED_PRODUCTS: "products/related",

  SUBMIT_CHECKOUT: "checkout/process",
  GET_ORDER_SUMMARY: "checkout/summary",

  SAVE_MEASUREMENTS: (category) => `measurements/store/${category}`,
  GET_MEASUREMENTS: "measurements",
  GET_CATEGORIES: "categories",
});