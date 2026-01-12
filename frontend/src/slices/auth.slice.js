import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// createAsyncThunk automatically generates pending/fulfilled/rejected action types
// and dispatches them based on the promise lifecycle
export const getAuth = createAsyncThunk(
  "auth/getAuth", // action type prefix
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // Make API call to fetch products
      const { data } = await axios.post(
        "/api/v1/login",
        { email, password },
        config
      );

      // Log the response to debug
      console.log("API Response:", data);

      return data.user; // This becomes action.payload on success
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

export const createUser = createAsyncThunk(
  "user/createUser", // action type prefix
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.post("/api/v1/register", userData, config);

      // Log the response to debug
      console.log("API Response:", data);

      return data; // This becomes action.payload on success
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

export const loadUser = createAsyncThunk(
  "user/loadUser", // action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get("/api/v1/me");

      // Log the response to debug
      console.log("API Response:", data);

      return data.user; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // ✅ Don't treat "not logged in" as an error
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Silent fail for unauthorized
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const allUsers = createAsyncThunk(
  "user/allUsers", // action type prefix
  async ({ resPerPage = 5, currentPage = 1 } = {}, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(
        `/api/v1/admin/users?resperpage=${resPerPage}&page=${currentPage}`
      );

      // Log the response to debug
      console.log("API Response:", data);

      return data; // This becomes action.payload on success
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);

      // ✅ Don't treat "not logged in" as an error
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Silent fail for unauthorized
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser", // action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get("/api/v1/logout");

      // Log the response to debug
      console.log("API Response:", data);

      return data; // This becomes action.payload on success
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

export const updateUser = createAsyncThunk(
  "user/updateUser", // action type prefix
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.put(
        `/api/v1/admin/user/${id}`,
        formData,
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

export const getUser = createAsyncThunk(
  "user/getUser", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);

      // Log the response to debug
      console.log("API Response:", data);

      return data.user; // This becomes action.payload on success
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

export const deleteUser = createAsyncThunk(
  "user/deleteUser", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.delete(`/api/v1/admin/user/${id}`);

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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    allUser: [],
    totalUsers: [],
    userLoaded: false,
    usersLoading: false,
    isUpdated: false,
    isDeleted: false,
    fetchedUser: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserReset: (state) => {
      state.isUpdated = false;
    },
    deleteUserReset: (state) => {
      state.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(getAuth.pending, (state) => {
        state.loading = true;
        // state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(getAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.userLoaded = true;
      })
      .addCase(getAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.userLoaded = false;
      })

      // ========== REGISTER ==========
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        // state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // ✅ User is authenticated after signup
        state.user = action.payload;
        state.error = null;
        state.userLoaded = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.userLoaded = false;
      })

      // ========== LOAD USER ==========
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        // state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.userLoaded = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.userLoaded = false;
      })

      // ========== LOGOUT ==========
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.userLoaded = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== All User - Admin Only ==========
      .addCase(allUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(allUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.allUser = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      // ========== Update User - Admin Only ==========
      .addCase(updateUser.pending, (state) => {
        state.usersLoading = true;
        state.isUpdated = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.isUpdated = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
        state.isUpdated = false;
      })
      // ========== Get USER - Admin ==========
      .addCase(getUser.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.fetchedUser = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.fetchedUser = null;
        state.error = action.payload;
      })
      // ========== Delete User - Admin Only ==========
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
        state.isDeleted = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.isDeleted = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
        state.isDeleted = false;
      });
  },
});

export const { deleteUserReset, updateUserReset, clearError } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
