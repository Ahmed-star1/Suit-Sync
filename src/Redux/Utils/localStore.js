// Keys for localStorage
const ACCESS_TOKEN_KEY = "access_token";
const CHECKOUT_BILLING_DETAILS_KEY = "checkout_billing_details";
const CHECKOUT_TAX_DETAILS_KEY = "checkout_tax_details";

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

const parseStoredJson = (key, fallback = null) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.error(`Unable to parse localStorage key: ${key}`, error);
    return fallback;
  }
};

export const setCheckoutBillingDetails = (details) => {
  localStorage.setItem(CHECKOUT_BILLING_DETAILS_KEY, JSON.stringify(details));
};

export const getCheckoutBillingDetails = () =>
  parseStoredJson(CHECKOUT_BILLING_DETAILS_KEY);

export const setCheckoutTaxDetails = (details) => {
  localStorage.setItem(CHECKOUT_TAX_DETAILS_KEY, JSON.stringify(details));
};

export const getCheckoutTaxDetails = () =>
  parseStoredJson(CHECKOUT_TAX_DETAILS_KEY);

export const clearCheckoutDetails = () => {
  localStorage.removeItem(CHECKOUT_BILLING_DETAILS_KEY);
  localStorage.removeItem(CHECKOUT_TAX_DETAILS_KEY);
};
