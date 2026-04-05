// Keys for localStorage
const ACCESS_TOKEN_KEY = "access_token";

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