// import { ethers } from "ethers";
// import mainABI from "../contracts/mainAbi";

// export const getMainContract = async (contractAddress) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const signer = await provider.getSigner();

//   return new ethers.Contract(
//     contractAddress,
//     mainABI,
//     signer
//   );
// };


import { ethers } from "ethers";
import mainABI from "../contracts/mainAbi";

export const getMainContract = async (contractAddress) => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
// const net = await provider.getNetwork();
// console.log(net.chainId);

  const accounts = await provider.send("eth_accounts", []);
  if (!accounts.length) {
    throw new Error("Wallet not connected");
  }

  const signer = await provider.getSigner();

  return new ethers.Contract(
    contractAddress,
    mainABI,
    signer
  );
};
