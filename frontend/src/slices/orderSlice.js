import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/newOrder", // action type prefix
  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.post("/api/v1/order/new", order, config);

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

export const myOrder = createAsyncThunk(
  "order/myOrder", // action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get("/api/v1/orders/me");
      // Log the response to debug
      console.log("API Response:", data);

      return data.orders; // This becomes action.payload on success
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

export const orderDetails = createAsyncThunk(
  "order/orderDetails", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(`/api/v1/order/${id}`);
      // Log the response to debug
      console.log("API Response:", data);

      return data.order; // This becomes action.payload on success
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

export const allOrders = createAsyncThunk(
  "order/allOrders", // action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(`/api/v1/admin/orders`);
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

export const updateOrder = createAsyncThunk(
  "order/updateOrder", // action type prefix
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make API call to fetch products
      const { data } = await axios.put(
        `/api/v1/admin/orders/${id}`,
        orderData,
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

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.delete(`/api/v1/admin/orders/${id}`);

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

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    order: [],
    allOrder: [],
    totalAmount: [],
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateOrderReset: (state) => {
      state.isUpdated = false;
    },
    deleteOrderReset: (state) => {
      state.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== New Order ==========
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== My Order ==========
      .addCase(myOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(myOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== Order Details==========
      .addCase(orderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(orderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== All Orders Admin Only==========
      .addCase(allOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrder = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
        state.error = null;
      })
      .addCase(allOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== Update Orders Admin Only==========
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ========== Delete Orders Admin Only==========
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, deleteOrderReset, updateOrderReset } =
  orderSlice.actions;
export const orderReducer = orderSlice.reducer;
