import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsService } from "../Services/productServices";

// Get Products Thunk
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductsService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch products");
    }
  }
);



const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductsState: (state) => {
      state.loading = false;
      state.error = null;
      state.products = [];
      state.selectedProduct = null;
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
        const products = action.payload?.data?.products || action.payload?.data || [];
        state.products = products;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
  },
});

export const { clearProductsState } = productSlice.actions;
export default productSlice.reducer;