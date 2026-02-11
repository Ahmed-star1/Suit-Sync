import { fetchApi } from "../Utils/helper";
import { API_ENDPOINTS } from "../Constants/endpoints";

// Register
export const registerService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.REGISTER,
    token: false,
    data: payload,
  });
};

// Verify OTP
export const verifyOtpService = (data) => {
  return fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.VERIFY_OTP,
    token: false,
    data,
  });
};

// Login 
export const loginService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.LOGIN,
    token: false,
    data: payload,
  });
};

// Forget Password 
export const forgetPasswordService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.FORGET_PASSWORD,
    token: false,
    data: payload,
  });
};

// Verify Token 
export const verifyTokenService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.VERIFY_TOKEN,
    token: false,
    data: payload,
  });
};

// Reset Password
export const resetPasswordService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.RESET_PASSWORD,
    token: false,
    data: payload,
  });
};

// LOGOUT
export const logoutService = async () => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.LOGOUT,
    token: true,
  });
};

// GET USER PROFILE
export const getProfileService = async () => {
  return await fetchApi({
    method: "GET",
    endPoint: API_ENDPOINTS.GET_PROFILE,
    token: true,
  });
};

// Update Profile
export const updateProfileService = async (payload) => {
  return await fetchApi({
    method: "POST",
    endPoint: API_ENDPOINTS.UPDATE_PROFILE,
    token: true,
    data: payload,
    formData: payload instanceof FormData, // image ke liye
  });
};