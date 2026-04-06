
import { setWallet } from "../redux/slice/walletSlice";
import { appKit } from "./reownWallet";
import { ethers } from "ethers";
import { setGlobalProvider } from "./contract";

export const connectWallet = async (
 dispatch,
//  requiredChainId
) => {

try{

/* OPEN WALLET MODAL */

await appKit.open();

/* WAIT UNTIL CONNECTED */

let account=null;

for(let i=0;i<20;i++){

 account=appKit.getAccount();

 if(account?.address)
 break;

 await new Promise(r=>setTimeout(r,400));

}

if(!account?.address){

console.log("Wallet not connected");

return null;

}


/* GET PROVIDER (IMPORTANT FIX) */

const provider =
appKit.getWalletProvider();


if(!provider){

console.log("Provider not found");

return null;

}
// try {
//   await provider.request({
//     method: "wallet_switchEthereumChain",
//     params: [{ chainId: "0x61" }], // 97
//   });
// } catch (err) {
//   console.log("Chain switch failed", err);
// }


/* SAVE PROVIDER */

setGlobalProvider(provider);


/* ETHERS */

const ethersProvider =
new ethers.BrowserProvider(provider);


const network =
await ethersProvider.getNetwork();

dispatch(

setWallet({

 address:account.address,
 chainId:Number(network.chainId)

})

);


return account.address;

}catch(err){

console.log(err);

return null;

}

};