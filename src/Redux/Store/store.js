import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Reducers/authSlice";
import eventReducer from "../Reducers/eventSlice";
import productReducer from "../Reducers/productSlice";
import tapeReducer from "../Reducers/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    products: productReducer,
    tape: tapeReducer,
  }
});