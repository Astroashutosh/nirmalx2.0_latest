// import { createAppKit } from "@reown/appkit";
// import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// export const appKit = createAppKit({

//  adapters: [
//   new EthersAdapter()
//  ],

//  networks: ["bsc"],

//  projectId:"ff769897212e881cc95e493ad6441a09",

//  metadata:{

//   name:"NirmalX",

//   description:"NirmalX Dapp",

//   url:"https://nirmalx.io",

//   icons:[
//    "https://nirmalx.io/logo.png"
//   ]

//  }

// });


// import { createAppKit } from "@reown/appkit";
// import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// /* CUSTOM BSC NETWORK (STABLE RPC) */

// const bscCustom = {

//   id: 56,

//   name: "BNB Smart Chain",

//   chainNamespace: "eip155",

//   caipNetworkId: "eip155:56",

//   nativeCurrency: {
//     name: "BNB",
//     symbol: "BNB",
//     decimals: 18
//   },

//   rpcUrls: {
//     default: {
//       http: [

//         "https://bsc-dataseed.binance.org/",

//         "https://rpc.ankr.com/bsc",

//         "https://bsc.publicnode.com"

//       ]
//     }
//   },

//   blockExplorers: {
//     default: {
//       name: "BscScan",
//       url: "https://bscscan.com"
//     }
//   }

// };



// /* CREATE REOWN */

// export const appKit = createAppKit({

//  adapters: [
//   new EthersAdapter()
//  ],

//  networks: [bscCustom],

//  projectId: "ff769897212e881cc95e493ad6441a09",

//  metadata: {

//   name: "NirmalX",

//   description: "NirmalX Dapp",

//   url: window.location.origin,

//   icons: ["https://nirmalx.io/logo.png"]

//  }

// });


// /* GLOBAL ACCESS (IMPORTANT) */

// window.appKit = appKit;

import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
 
 
 
 
 
// bsc testnet code start
 
// const bscTestnet = {
//   id: 97,
//   name: "BSC Testnet",
//   chainNamespace: "eip155",
//   caipNetworkId: "eip155:97",
 
//   nativeCurrency: {
//     name: "tBNB",
//     symbol: "tBNB",
//     decimals: 18
//   },
 
//   rpcUrls: {
//     default: {
//       http: [
//         "https://data-seed-prebsc-1-s1.binance.org:8545",
//         "https://bsc-testnet.publicnode.com"
//       ]
//     }
//   },
 
//   blockExplorers: {
//     default: {
//       name: "BscScan Testnet",
//       url: "https://testnet.bscscan.com"
//     }
//   }
// };
 
// bsc testnet code end
 
 
 
 
 
/* CUSTOM BSC NETWORK (STABLE RPC) */
 
const bscCustom = {
 
  id: 56,
 
  name: "BNB Smart Chain",
 
  chainNamespace: "eip155",
 
  caipNetworkId: "eip155:56",
 
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
 
  rpcUrls: {
    default: {
      http: [
 
        "https://bsc-dataseed.binance.org/",
 
        "https://rpc.ankr.com/bsc",
 
        "https://bsc.publicnode.com"
 
      ]
    }
  },
 
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://bscscan.com"
    }
  }
 
};
 
 
 
/* CREATE REOWN */
 
export const appKit = createAppKit({
 
  adapters: [
    new EthersAdapter()
  ],
 
   networks: [bscCustom],
  // networks: [bscTestnet],
  projectId: "ff769897212e881cc95e493ad6441a09",
 
  metadata: {
 
    name: "NirmalX",
 
    description: "NirmalX Dapp",
 
    url: window.location.origin,
 
    icons: ["https://nirmalx.io/logo.png"]
 
  }
 
});
 
 
/* GLOBAL ACCESS (IMPORTANT) */
 
window.appKit = appKit;