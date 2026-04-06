
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";

import "./assets/css/animate.css";
import "./assets/css/flaticon.css";
import "./assets/css/tiny-slider.css";
import "./assets/css/glightbox.min.css";
import "./assets/css/aos.css";
import "./assets/css/style.css";
import "./assets/style.css";

import "./assets/user/css/bootstrap.min.css";
import "./assets/user/css/doogle.css";
import "./assets/user/css/magnific-popup.css";
import "./assets/user/css/modal_popupe209e209.css?v=1.0.0";
import "./assets/user/css/stylee209e209.css?v=1.0.0";
import "./assets/user/css/mye209e209.css?v=1.0.0";
import "./assets/css/singleLeg.css";
 

import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <BrowserRouter basename="/nrx_imported_data"> */}
      <BrowserRouter >
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);