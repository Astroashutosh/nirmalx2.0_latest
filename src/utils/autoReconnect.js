
import { setWallet } from "../redux/slice/walletSlice";
import { appKit } from "./reownWallet";
import { ethers } from "ethers";
import { setGlobalProvider } from "./contract";

export const autoReconnect = async (dispatch, requiredChainId) => {
  try {
 

   const isLoggedIn = localStorage.getItem("userId");
    if (!isLoggedIn) {
      return;
    }
 

    let account = null;
    let provider = null;
 
    // 🔥 WAIT LOOP (VERY IMPORTANT)
    for (let i = 0; i < 20; i++) {
 
      account = appKit.getAccount();
      provider = appKit.getWalletProvider();
 
      if (account?.address && provider) break;
 
      await new Promise(r => setTimeout(r, 300));
    }
 
    if (!account?.address || !provider) {
      console.log("Reconnect failed");
      return;
    }
 
    /* SET PROVIDER */
    setGlobalProvider(provider);
 
    const ethersProvider = new ethers.BrowserProvider(provider);
 
    let network = await ethersProvider.getNetwork();
 
    /* 🔥 NETWORK SWITCH */
    // if (Number(network.chainId) !== requiredChainId) {
    //   try {
    //     await provider.request({
    //       method: "wallet_switchEthereumChain",
    //       // params: [{ chainId: "0x61" }]
    //       params: [{ chainId: "0x38" }]
    //     });
 
    //     // 🔥 refresh network
    //     network = await ethersProvider.getNetwork();
 
    //   } catch (e) {
    //     console.log("Auto switch failed");
    //   }
    // }
 
    dispatch(
      setWallet({
        address: account.address,
        chainId: Number(network.chainId)
      })
    );
 
  } catch (err) {
    console.log("Auto reconnect failed");
  }
};