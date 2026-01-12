import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addItemToCart = createAsyncThunk(
  "cart/addToCart", // action type prefix
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      console.log("Custom Payload:", data);

      // ✅ Return custom object directly
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      // Log error for debugging
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

// ✅ Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const loadShippingFromStorage = () => {
  try {
    const shippingInfo = localStorage.getItem("shippingInfo");
    return shippingInfo ? JSON.parse(shippingInfo) : {};
  } catch (error) {
    console.error("Error loading shipping info:", error);
    return {};
  }
};

// ✅ Helper function to save cart to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const saveShippingToStorage = (shippingInfo) => {
  try {
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
  } catch (error) {
    console.error("Error saving shipping info:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(), // ✅ Load on initialization
    shippingInfo: loadShippingFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    removeFromCart: (state, action) => {
      console.log("🗑️ Removing from cart:", action.payload); // ✅ Debug log
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      saveCartToStorage(state.cartItems);
    },
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === productId);
      if (item) {
        item.quantity = quantity;
        saveCartToStorage(state.cartItems); // ✅ Save after updating
      }
    },
    clearCart: (state) => {
      console.log("🧹 Clearing entire cart"); // ✅ Debug log
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    // Shipping info actions
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveShippingToStorage(action.payload);
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = {};
      localStorage.removeItem("shippingInfo");
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;

        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          // Update existing item
          state.cartItems = state.cartItems.map((i) =>
            i.product === item.product ? item : i
          );
        } else {
          // Add new item
          state.cartItems.push(item);
        }

        saveCartToStorage(state.cartItems); // ✅ Save to localStorage
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateCartQuantity,
  removeFromCart,
  clearCart,
  saveShippingInfo,
  clearShippingInfo,
  clearError,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
