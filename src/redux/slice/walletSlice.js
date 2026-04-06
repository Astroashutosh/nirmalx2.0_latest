import { createSlice } from "@reduxjs/toolkit";
import Liquidity from "../../user/Liquidity";

const initialState = {
  address: null,
  isConnected: false,
  chainId: null,
  userId: null,
  userData: null,

  contracts: {
    MAIN_CONTRACT: "0xA0a8F7B2E23798157db9C756003946A38573c76f",
    TOKEN_CONTRACT: "0x36A418091b4916580B5b9068015f28E9C56AC6Cc",
    USDT_CONTRACT: "0x55d398326f99059ff775485246999027b3197955",
    // LOCK_CONTRACT: "0xa6aF428140c2C6397f1A8589C1778BE599d31CB6",
    ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    LIQUIDITY_CONTRACT: "0x320C53F32ca0bE3Ebb5a4F0ff4A6B6074F55A1a8",
  },

  network: {
    CHAIN_ID: 56,
    name: "BSC Mainnet",
  },
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
   
    setWallet(state, action) {

      state.address = action.payload.address ?? state.address;
      state.chainId = action.payload.chainId ?? state.chainId;
      state.userId = action.payload.userId ?? state.userId;
      state.userData = action.payload.userData ?? state.userData;

      state.isConnected =
        action.payload.chainId ? true : false;

    },


    disconnectWallet(state) {
      state.address = null;
      state.chainId = null;
      state.userId = null;
      state.userData = null;
      state.isConnected = false;
    },
  },
});

export const { setWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;