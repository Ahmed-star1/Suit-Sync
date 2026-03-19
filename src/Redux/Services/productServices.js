import { fetchApi } from "../Utils/helper";
import { API_ENDPOINTS } from "../Constants/endpoints";

// Get All Products
export const getProductsService = async (page = 1, perPage = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('per_page', perPage);
    
    // Category filter
    if (filters.category && filters.category.length > 0) {
      filters.category.forEach(catId => {
        queryParams.append('category', catId);
      });
    }
    
    // Rent/Buy filter - use buy_type parameter
    if (filters['rent-buy'] && filters['rent-buy'].length > 0) {
      filters['rent-buy'].forEach(type => {
        const typeValue = type.toLowerCase();
        queryParams.append('buy_type', typeValue);
      });
    }
    
    const url = `${API_ENDPOINTS.GET_PRODUCTS}?${queryParams.toString()}`;
    
    const response = await fetchApi({
      method: "GET",
      endPoint: url,
      token: false,
    });
    
    return response;
  } catch (error) {
    console.error("getProductsService error", error);
    throw error;
  }
};

// Get Wishlist Products
export const getWishlistService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_WISHLIST,
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("getWishlistService error", error);
    throw error;
  }
};

// Add to Wishlist Service
export const addToWishlistService = async (productId) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.ADD_WISHLIST(productId),
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("addToWishlistService error", error);
    throw error;
  }
};

// Get Featured Products
export const getFeaturedProductsService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_FEATURED_PRODUCTS,
      token: false,
    });
    
    return response;
  } catch (error) {
    console.error("getFeaturedProductsService error", error);
    throw error;
  }
};

// Get Single Product by ID
export const getProductByIdService = async (productId) => {
  try {
    const url = `${API_ENDPOINTS.GET_PRODUCT_BY_ID(productId)}`;
    
    const response = await fetchApi({
      method: "GET",
      endPoint: url,
      token: false,
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Add to Cart Service
export const addToCartService = async (cartData) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.ADD_TO_CART,
      token: true,
      data: cartData,
    });
    
    return response;
  } catch (error) {
    console.error("addToCartService error", error);
    throw error;
  }
};

// Get Cart Service
export const getCartService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_CART,
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("getCartService error", error);
    throw error;
  }
};

// Remove Cart Item Service
export const removeCartItemService = async (itemId) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.REMOVE_CART_ITEM(itemId),
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("removeCartItemService error", error);
    throw error;
  }
};

// Update Cart Item Quantity Service
export const updateCartItemQuantityService = async (itemId, quantity) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.UPDATE_CART_ITEM(itemId),
      token: true,
      data: { quantity },
    });
    
    return response;
  } catch (error) {
    console.error("updateCartItemQuantityService error", error);
    throw error;
  }
};

// Get Cart Related Products Service
export const getCartRelatedProductsService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_CART_RELATED_PRODUCTS,
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("getCartRelatedProductsService error", error);
    throw error;
  }
};

// Checkout Service
export const submitCheckoutService = async (formData) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.SUBMIT_CHECKOUT,
      token: true,
      data: formData,
    });
    
    return response;
  } catch (error) {
    console.error("submitCheckoutService error", error);
    throw error;
  }
};

// Order Summary Service
export const getOrderSummaryService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_ORDER_SUMMARY,
      token: true, 
    });
    
    return response;
  } catch (error) {
    console.error("getOrderSummaryService error", error);
    throw error;
  }
};

// Get Related Products Service
export const getRelatedProductsService = async (productId) => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_RELATED_PRODUCTS(productId),
      token: false,
    });
    
    return response;
  } catch (error) {
    console.error("getRelatedProductsService error", error);
    throw error;
  }
};

// Store Measurement Service
export const storeMeasurementService = async (category, measurementData) => {
  try {
    const response = await fetchApi({
      method: "POST",
      endPoint: API_ENDPOINTS.SAVE_MEASUREMENTS(category),
      token: true,
      data: measurementData,
    });
    
    return response;
  } catch (error) {
    console.error("storeMeasurementService error", error);
    throw error;
  }
};

// Get Measurements Service
export const getMeasurementsService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_MEASUREMENTS,
      token: true,
    });
    
    return response;
  } catch (error) {
    console.error("getMeasurementsService error", error);
    throw error;
  }
};

// Get Categories Service
export const getCategoriesService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_CATEGORIES,
      token: false,
    });
    
    return response;
  } catch (error) {
    console.error("getCategoriesService error", error);
    throw error;
  }
};