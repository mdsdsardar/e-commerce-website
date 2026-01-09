// productSlice.js
// Redux Toolkit uses "slices" which combine actions, action creators, and reducers in one file

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// createAsyncThunk automatically generates pending/fulfilled/rejected action types
// and dispatches them based on the promise lifecycle
export const getProducts = createAsyncThunk(
  "getProducts", // action type prefix
  async (
    { keyword = "", currentPage = 1, price, category, rating = 0 },
    { rejectWithValue }
  ) => {
    try {
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;
      if (category) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
      }
      // Make API call to fetch products
      const { data } = await axios.get(link);

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

export const getAdminProducts = createAsyncThunk(
  "getAdminProducts", // action type prefix
  async ({ resPerPage, currentPage }, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(
        // `/api/v1/admin/products`
        `/api/v1/admin/products?resperpage=${resPerPage}&page=${currentPage}`
      );
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

// createSlice automatically generates action creators and action types
const productSlice = createSlice({
  name: "products", // used as prefix for action types
  initialState: {
    products: [],
    loading: false,
    error: null,
    productsCount: 0,
    resPerPage: 0,
    totalProducts: [],
  },
  reducers: {
    // Regular synchronous actions go here
    clearErrors: (state) => {
      // Redux Toolkit uses Immer library, so we can "mutate" state directly
      // It's actually creating a new immutable state behind the scenes
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions here
    builder
      // When getProducts is called, it's in pending state
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        // Don't reset products array while loading to avoid undefined errors
      })
      // When API call succeeds, it's in fulfilled state
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
        state.resPerPage = action.payload.resPerPage;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Admin product fetch.
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getProductDetails = createAsyncThunk(
  "getProductDetails", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(`/api/v1/product/${id}`);
      // Log the response to debug
      console.log("API Response:", data);
      return data.product; // This becomes action.payload on success
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

export const newReview = createAsyncThunk(
  "review/newReview", // action type prefix
  async (reviewData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // Make API call to fetch products
      const { data } = await axios.put(`/api/v1/review`, reviewData, config);
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

export const newProduct = createAsyncThunk(
  "product/newProduct", // action type prefix
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // Make API call to fetch products
      const { data } = await axios.post(
        `/api/v1/product/new`,
        productData,
        config
      );
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

export const updateProduct = createAsyncThunk(
  "product/updateProduct", // action type prefix
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // Make API call to fetch products
      const { data } = await axios.put(
        `/api/v1/product/update/${id}`,
        productData,
        config
      );
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

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.delete(`/api/v1/product/delete/${id}`);
      // Log the response to debug
      console.log("API Response:", data);
      return data.isDeleted; // This becomes action.payload on success
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

export const productReviews = createAsyncThunk(
  "product/productReviews", // action type prefix
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch products
      const { data } = await axios.get(`/api/v1/review?id=${id}`);
      // Log the response to debug
      console.log("API Response:", data);
      return data.reviews; // This becomes action.payload on success
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

export const deleteReview = createAsyncThunk(
  "product/deleteRseview", // action type prefix
  async ({ productId, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/review?productId=${productId}&id=${id}`
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

// createSlice automatically generates action creators and action types
const productDetailsSlice = createSlice({
  name: "products", // used as prefix for action types
  initialState: {
    productDetails: [],
    loading: false,
    error: null,
    success: false,
    isDeleted: false,
    isUpdated: false,
    reviews: [],
  },
  reducers: {
    // Regular synchronous actions go here
    resetReview: (state) => {
      state.success = false;
    },
    resetDeleteProduct: (state) => {
      state.isDeleted = false;
    },
    resetUpdateProduct: (state) => {
      state.isUpdated = false;
    },
    clearErrors: (state) => {
      // Redux Toolkit uses Immer library, so we can "mutate" state directly
      // It's actually creating a new immutable state behind the scenes
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions here
    builder
      // When getProducts is called, it's in pending state
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        // Don't reset products array while loading to avoid undefined errors
      })
      // When API call succeeds, it's in fulfilled state
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Review reducer.
      .addCase(newReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(newReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(newReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //New Product create reducer.
      .addCase(newProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(newProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.success = true;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(newProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Delete Product reducer.
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Update Product reducer.
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Fetch Review reducer.
      .addCase(productReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(productReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(productReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Delete Review reducer.
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
        state.error = null;
      })
      // When API call fails, it's in rejected state
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// From productSlice
export const { clearErrors: clearProductErrors } = productSlice.actions;
export const productReducer = productSlice.reducer;

// From productDetailsSlice
export const {
  resetDeleteProduct,
  resetUpdateProduct,
  resetReview,
  clearErrors: clearProductDetailsErrors,
} = productDetailsSlice.actions;
export const productDetailsReducer = productDetailsSlice.reducer;
