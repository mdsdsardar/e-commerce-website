import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUser = createAsyncThunk(
  "user/updateUser", // action type prefix
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.put("/api/v1/me/update", userData, config);

      // Log the response to debug
      console.log("API Response:", data);

      return data.success; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // rejectWithValue allows us to return a custom error payload
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword", // action type prefix
  async (passwords, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.put(
        "/api/v1/password/update",
        passwords,
        config
      );

      // Log the response to debug
      console.log("API Response:", data);

      return data.success; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // rejectWithValue allows us to return a custom error payload
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword", // action type prefix
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.post(
        "/api/v1/password/forgot",
        email,
        config
      );

      // Log the response to debug
      console.log("API Response:", data);

      return data.message; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // rejectWithValue allows us to return a custom error payload
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword", // action type prefix
  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.put(
        `/api/v1/password/reset/${token}`,
        passwords,
        config
      );

      // Log the response to debug
      console.log("API Response:", data);

      return data.success; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // rejectWithValue allows us to return a custom error payload
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
    message: null,
    success: null,
    users: [],
  },
  reducers: {
    resetUpdate: (state) => {
      state.isUpdated = false; // ✅ Add this to reset after showing success
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== Update User ==========
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdated = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUpdated = false;
      })
      // ========== Update Password ==========
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdated = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUpdated = false;
      })
      // ========== Forget Password ==========
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== Reset Password ==========
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetUpdate } = userSlice.actions;
export const userReducer = userSlice.reducer;
