import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsService, getProductByIdService, getFeaturedProductsService, getWishlistService, addToCartService, getCartService, removeCartItemService, updateCartItemQuantityService, submitCheckoutService, getOrderSummaryService, getRelatedProductsService, getCartRelatedProductsService, storeMeasurementService, getMeasurementsService, getCategoriesService, addToWishlistService } from "../Services/productServices";

// Get Products Thunk
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ page = 1, perPage = 12, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const response = await getProductsService(page, perPage, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch products");
    }
  }
);

// Get Featured Products Thunk
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeaturedProductsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch featured products");
    }
  }
);

// Get Single Product by ID
export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductByIdService(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch product");
    }
  }
);

// Get Related Products Thunk
export const getRelatedProducts = createAsyncThunk(
  "products/getRelatedProducts",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRelatedProductsService(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch related products");
    }
  }
);

// Get Wishlist Thunk
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlistService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch wishlist");
    }
  }
);

// Wishlist Thunk
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await addToWishlistService(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add to wishlist");
    }
  }
);

// Add to Cart Thunk
export const addToCart = createAsyncThunk(
  "products/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await addToCartService(cartData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add to cart");
    }
  }
);

// Get Cart Thunk
export const getCart = createAsyncThunk(
  "products/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCartService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch cart");
    }
  }
);

// Remove Cart Item Thunk
export const removeCartItem = createAsyncThunk(
  "products/removeCartItem",
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      const response = await removeCartItemService(itemId);
      return { itemId, response }
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to remove item from cart");
    }
  }
);

// Update Cart Item Quantity Thunk
export const updateCartItemQuantity = createAsyncThunk(
  "products/updateCartItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateCartItemQuantityService(itemId, quantity);
      return { itemId, quantity, response };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update quantity");
    }
  }
);

// Get Cart Related Products Thunk
export const getCartRelatedProducts = createAsyncThunk(
  "products/getCartRelatedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCartRelatedProductsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch cart related products");
    }
  }
);

// Checkout Thunk
export const submitCheckout = createAsyncThunk(
  "checkout/submitCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await submitCheckoutService(checkoutData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Checkout submission failed");
    }
  }
);

// Order Summary Thunk
export const getOrderSummary = createAsyncThunk(
  "products/getOrderSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrderSummaryService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch order summary");
    }
  }
);

// Store Measurement Thunk
export const storeMeasurement = createAsyncThunk(
  "measurements/store",
  async ({ category, measurements }, { rejectWithValue }) => {
    try {
      const response = await storeMeasurementService(category, measurements);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to store measurements");
    }
  }
);

// Get Measurements Thunk
export const getMeasurements = createAsyncThunk(
  "measurements/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMeasurementsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch measurements");
    }
  }
);

// Get Categories Thunk
export const getCategories = createAsyncThunk(
  "categories/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch categories");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    featuredProducts: [],
    relatedProducts: [],
    cartRelatedProducts: [],
    wishlist: [],
    cart: [],
    measurements: {},
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    selectedProduct: null,
    loading: false,
    featuredLoading: false,
    wishlistLoading: false,
    cartLoading: false,
    checkoutLoading: false,
    checkoutSuccess: false,
    orderSummaryLoading: false,
    relatedProductsLoading: false,
    cartRelatedProductsLoading: false,
    measurementsLoading: false,
    measurementsSuccess: false,
    measurementsError: null,
    measurementLoading: false,
    measurementSuccess: false,
    measurementError: null,
    measurementResponse: null,
    checkoutResponse: null,
    orderSummary: null,
    selectedProductForLook: null,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 12,
      total_items: 0,
      total_pages: 1,
    },
    filters: {
      categories: [],
    },
  },
  reducers: {
    clearProductsState: (state) => {
      state.loading = false;
      state.featuredLoading = false;
      state.wishlistLoading = false; 
      state.cartLoading = false;
      state.checkoutLoading = false;
      state.checkoutSuccess = false;
      state.checkoutResponse = null;
      state.error = null;
      state.products = [];
      state.featuredProducts = [];
      state.wishlist = [];
      state.cart = [];
      state.selectedProduct = null;
      state.pagination = {
        current_page: 1,
        per_page: 12,
        total_items: 0,
        total_pages: 1,
      };
      state.filters = {
        categories: [],
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.current_page = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.wishlistLoading = false;
      state.error = null;
    },
    resetCheckoutState: (state) => {
      state.checkoutLoading = false;
      state.checkoutSuccess = false;
      state.checkoutResponse = null;
      state.error = null;
    },
    clearOrderSummary: (state) => {
      state.orderSummary = null;
      state.orderSummaryLoading = false;
      state.error = null;
    },
    setSelectedProductForLook: (state, action) => {
    state.selectedProductForLook = action.payload;
    },
    clearSelectedProductForLook: (state) => {
      state.selectedProductForLook = null;
    },
    clearCartRelatedProducts: (state) => {
      state.cartRelatedProducts = [];
      state.cartRelatedProductsLoading = false;
    },
    resetMeasurementState: (state) => {
      state.measurementLoading = false;
      state.measurementSuccess = false;
      state.measurementError = null;
      state.measurementResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data || action.payload;
        
        const products = responseData?.products || [];
        state.products = products;
        
        if (responseData?.pagination) {
          state.pagination = responseData.pagination;
        }
        
        if (responseData?.filters) {
          state.filters = responseData.filters;
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })

      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        const responseData = action.payload?.data || action.payload;
        const products = responseData?.products || responseData || [];
        state.featuredProducts = products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload;
        state.featuredProducts = [];
      })

      // Get Single Product
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data || action.payload;
        const product = responseData?.product || responseData;
        state.selectedProduct = product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProduct = null;
      })

      // Get Related Products
      .addCase(getRelatedProducts.pending, (state) => {
        state.relatedProductsLoading = true;
        state.error = null;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedProductsLoading = false;
        const responseData = action.payload?.data || action.payload;
        state.relatedProducts = responseData?.products || responseData || [];
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.relatedProductsLoading = false;
        state.error = action.payload;
        state.relatedProducts = [];
      })

      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        const responseData = action.payload?.data || action.payload;
        const products = responseData?.products || responseData || [];
        state.wishlist = products;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload;
        state.wishlist = [];
      })

      // Add to Wishlist cases
      .addCase(addToWishlist.pending, (state) => {
        state.wishlistLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        console.log("Added to wishlist successfully:", action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.cartLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        console.log("Added to cart successfully:", action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })

      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.cartLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        const responseData = action.payload?.data || action.payload;
        const cart = responseData?.items || responseData || [];
        state.cart = cart;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
        state.cart = [];
      })

      // Remove from Cart
      .addCase(removeCartItem.pending, (state) => {
      state.removeLoading = true;
      state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removeLoading = false;

        const itemId = action.payload.itemId;
        const apiResponse = action.payload.response;

        const decrementItemList = (items) => {
          return items.map((item) => {
            const matches = item.product_variant_id === itemId || item.id === itemId;
            if (!matches) return item;

            // prefer API-provided quantity if available
            if (apiResponse?.data?.quantity !== undefined && apiResponse?.data?.id === itemId) {
              return { ...item, quantity: apiResponse.data.quantity };
            }

            const currentQty = item.quantity || 1;
            if (currentQty > 1) {
              return { ...item, quantity: currentQty - 1 };
            }
            return null;
          }).filter(Boolean);
        };

        if (Array.isArray(state.cart)) {
          state.cart = decrementItemList(state.cart);
        } else if (state.cart?.cart_items) {
          state.cart.cart_items = decrementItemList(state.cart.cart_items);
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removeLoading = false;
        state.error = action.payload;
      })

      // Get Cart Related Products (NEW)
      .addCase(getCartRelatedProducts.pending, (state) => {
        state.cartRelatedProductsLoading = true;
        state.error = null;
      })
      .addCase(getCartRelatedProducts.fulfilled, (state, action) => {
        state.cartRelatedProductsLoading = false;
        const responseData = action.payload?.data || action.payload;
        state.cartRelatedProducts = responseData?.products || responseData || [];
      })
      .addCase(getCartRelatedProducts.rejected, (state, action) => {
        state.cartRelatedProductsLoading = false;
        state.error = action.payload;
        state.cartRelatedProducts = [];
      })

      // Checkout cases
      .addCase(submitCheckout.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutSuccess = false;
        state.checkoutResponse = null;
        state.error = null;
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutSuccess = true;
        state.checkoutResponse = action.payload;
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutSuccess = false;
        state.error = action.payload;
      })

      // Get Order Summary
      .addCase(getOrderSummary.pending, (state) => {
        state.orderSummaryLoading = true;
        state.error = null;
      })
      .addCase(getOrderSummary.fulfilled, (state, action) => {
        state.orderSummaryLoading = false;
        state.orderSummary = action.payload?.data || action.payload;
      })
      .addCase(getOrderSummary.rejected, (state, action) => {
        state.orderSummaryLoading = false;
        state.error = action.payload;
      })

      // Store Measurement cases
      .addCase(storeMeasurement.pending, (state) => {
        state.measurementLoading = true;
        state.measurementSuccess = false;
        state.measurementError = null;
      })
      .addCase(storeMeasurement.fulfilled, (state, action) => {
        state.measurementLoading = false;
        state.measurementSuccess = true;
        state.measurementResponse = action.payload;
      })
      .addCase(storeMeasurement.rejected, (state, action) => {
        state.measurementLoading = false;
        state.measurementSuccess = false;
        state.measurementError = action.payload;
      })

      // Get Measurements cases
      .addCase(getMeasurements.pending, (state) => {
        state.measurementsLoading = true;
        state.measurementsError = null;
      })
      .addCase(getMeasurements.fulfilled, (state, action) => {
        state.measurementsLoading = false;
        state.measurementsSuccess = true;
        state.measurements = action.payload?.data || {};
      })
      .addCase(getMeasurements.rejected, (state, action) => {
        state.measurementsLoading = false;
        state.measurementsSuccess = false;
        state.measurementsError = action.payload;
      })

      // Get Categories cases
      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        const responseData = action.payload?.data || action.payload;
        state.categories = responseData?.categories || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
  },
});

export const { clearProductsState, setCurrentPage, clearSelectedProduct, clearWishlist, resetCheckoutState, clearOrderSummary, setSelectedProductForLook, clearSelectedProductForLook, clearCartRelatedProducts } = productSlice.actions;
export default productSlice.reducer;