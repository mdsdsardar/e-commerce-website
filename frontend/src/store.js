// import { createStore, combineReducers, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";

// const reducer = combineReducers({});

// let initialState = {};

// const middleware = [thunk];
// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

import { configureStore } from "@reduxjs/toolkit";
// import { productsReducer } from "./No Use/reducers (No USE)/productReducers";
// Import the reducer from the slice (not the old reducer file)
import { productDetailsReducer, productReducer } from "./slices/productSlice";
import { authReducer } from "./slices/authSlice";
import { userReducer } from "./slices/userSlice";
import { cartReducer } from "./slices/cartSlices";
import { orderReducer } from "./slices/orderSlice";
// import { productDetailsReducer } from "./No Use/reducers (No USE)/productReducers";

const store = configureStore({
  reducer: {
    products: productReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    // createUser: createUserReducer,
  }, // add reducers later
});

export default store;
