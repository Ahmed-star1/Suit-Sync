import { fetchApi } from "../Utils/helper";
import { API_ENDPOINTS } from "../Constants/endpoints";

// Get All Products
export const getProductsService = async () => {
  try {
    const response = await fetchApi({
      method: "GET",
      endPoint: API_ENDPOINTS.GET_PRODUCTS,
      token: false,
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};