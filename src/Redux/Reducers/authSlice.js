import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  verifyOtpService,
  registerService,
  loginService,
  forgetPasswordService,
  verifyTokenService,
  resetPasswordService,
  updateProfileService,
  getProfileService,
  logoutService,
} from "../Services/authServices";
import { setAccessToken, clearStorage } from "../Utils/localStore";

// REGISTER USER THUNK
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// VERIFY OTP THUNK
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyOtpService(payload);

      const token = response?.data?.access_token;

      if (token) {
        setAccessToken(token);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// LOGIN THUNK
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Forget Password Thunk
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await forgetPasswordService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// VERIFY TOKEN THUNK
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyTokenService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// RESET PASSWORD THUNK
export const resetPassword = createAsyncThunk(
  "auth/reset",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await resetPasswordService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutService();
      clearStorage(); 
      return response;
    } catch (error) {
      clearStorage(); 
      return rejectWithValue(error?.response?.data);
    }
  }
);

// GET PROFILE THUNK
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileService();
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// UPDATE PROFILE THUNK
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateProfileService(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    loading: false,
    error: null,
    registerSuccess: false,
    registerData: null,
    registeredEmail: null,
    forgetEmail: null,
    user: null,
  },

  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.registerSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------- REGISTER CASES ----------------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        state.registerData = action.payload;
        state.registeredEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- VERIFY OTP CASES ----------------
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const token = action.payload?.access_token;

        if (token) {
          state.token = token;
          setAccessToken(token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- LOGIN CASES ----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const token = action.payload?.data?.access_token;
        if (token) {
          setAccessToken(token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- FORGET PASSWORD --------
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.forgetEmail = action.meta.arg.email;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- VERIFY FORGET OTP --------

      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- RESET PASSWORD --------

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- LOGOUT --------
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // -------- GET PROFILE --------
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload?.data) {
          state.user = action.payload.data;
        }
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthState, setTempUserData } = authSlice.actions;
export default authSlice.reducer;
