import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store.js";

// import { positions, transitions, Provider as AlertProvider } from "react-alert";
// import AlertTemplate from "react-alert-template-basic";

// const options = {
//   timeout: 5000,
//   positions: positions.BOTTOM_CENTER,
//   transitions: transitions.SCALE,
// };

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <AlertProvider template={AlertTemplate} {...options}> */}
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 5000,
      }}
    />
    {/* </AlertProvider> */}
  </Provider>
);
