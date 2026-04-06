import { ethers } from "ethers";
import {
    MAIN_ABI,
    TOKEN_ABI,
    USDT_ABI,
    LOCK_ABI, Liquidity_ABI
} from "../contracts/abi";

/* ============================================
   CONFIG
============================================ */

// const BSC_RPC = "https://rpc.ankr.com/bsc";
const BSC_RPC = "https://bsc-dataseed.binance.org/";
// const BSC_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
let globalWalletProvider = null;

export const setGlobalProvider = (provider) => {
    globalWalletProvider = provider;
};

/* ============================================
   PROVIDERS
============================================ */

// 🔥 Direct RPC (for READ)
const readProvider = new ethers.JsonRpcProvider(BSC_RPC);

// 🔥 Wallet Provider (for WRITE)
const getWriteProvider = () => {
    if (!globalWalletProvider) {
        throw new Error("Wallet not connected");
    }
    return new ethers.BrowserProvider(globalWalletProvider);
};

const getSigner = async () => {
    const provider = getWriteProvider();
    return await provider.getSigner();
};

/* ============================================
   AUTO SMART CONTRACT WRAPPER
============================================ */

const createAutoContract = async (address, abi) => {
    const readContract = new ethers.Contract(
        address,
        abi,
        readProvider
    );

    const signer = globalWalletProvider
        ? await getSigner()
        : null;

    const writeContract = signer
        ? new ethers.Contract(address, abi, signer)
        : null;

    return new Proxy(readContract, {
        get(target, prop) {
            const fragment = target.interface.getFunction?.(prop);

            if (!fragment) {
                return target[prop];
            }

            // 🔥 If function is view/pure → READ
            if (
                fragment.stateMutability === "view" ||
                fragment.stateMutability === "pure"
            ) {
                return target[prop];
            }

            // 🔥 Otherwise → WRITE
            if (!writeContract) {
                throw new Error("Wallet not connected");
            }

            return writeContract[prop];
        }
    });
};

// const createAutoContract = async (address, abi) => {
//     const readContract = new ethers.Contract(
//         address,
//         abi,
//         readProvider
//     );
 
// return new Proxy(readContract, {
//         get(target, prop) {
 
//             const fragment = target.interface.getFunction?.(prop);
 
//             if (!fragment) return target[prop];
 
//             // ✅ READ
//             if (
//                 fragment.stateMutability === "view" ||
//                 fragment.stateMutability === "pure"
//             ) {
//                 return target[prop];
//             }
 
//             // ✅ WRITE (IMPORTANT FIX)
//             return new Proxy(() => { }, {
//                 apply: async (_, __, args) => {
 
//                     if (!globalWalletProvider) {
//                         throw new Error("Wallet not connected");
//                     }
 
//                     const signer = await getSigner();
 
//                     const writeContract = new ethers.Contract(
//                         address,
//                         abi,
//                         signer
//                     );
 
//                     return writeContract[prop](...args);
//                 },
 
//                 get: (_, method) => {
 
//                     return async (...args) => {
 
//                         const signer = await getSigner();
 
//                         const writeContract = new ethers.Contract(
//                             address,
//                             abi,
//                             signer
//                         );
 
//                         // 🔥 support staticCall / estimateGas / etc
//                         return writeContract[prop][method](...args);
//                     };
//                 }
//             });
//         }
//     });
 
 
   
// };

/* ============================================
   EXPORT CONTRACTS (NO PROJECT CHANGE NEEDED)
============================================ */

export const getMainContract = async (address) =>
    createAutoContract(address, MAIN_ABI);

export const getTokenContract = async (address) =>
    createAutoContract(address, TOKEN_ABI);

export const getUSDTContract = async (address) =>
    createAutoContract(address, USDT_ABI);

export const getLockContract = async (address) =>
    createAutoContract(address, LOCK_ABI);

export const getLiquidityContract = async (address) =>
    createAutoContract(address, Liquidity_ABI);

export const getNRXContract = async (address) =>
    createAutoContract(address, TOKEN_ABI);