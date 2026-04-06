import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/userDetails";
import showModalReducer from "./slice/modalSlice";
import walletReducer from "./slice/walletSlice";

const rootReducer = combineReducers({
  user: userReducer,
  showModal: showModalReducer,
  wallet: walletReducer,
});

export default rootReducer;
