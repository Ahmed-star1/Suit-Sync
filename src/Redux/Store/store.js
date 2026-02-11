import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Reducers/authSlice";
import eventReducer from "../Reducers/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  }
});