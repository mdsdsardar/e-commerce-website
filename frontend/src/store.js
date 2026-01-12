import { configureStore } from "@reduxjs/toolkit";
import { productDetailsReducer, productReducer } from "./slices/product.slice";
import { authReducer } from "./slices/auth.slice";
import { userReducer } from "./slices/user.slice";
import { cartReducer } from "./slices/cart.slice";
import { orderReducer } from "./slices/order.slice";

const store = configureStore({
  reducer: {
    products: productReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
