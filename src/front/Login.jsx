

import { setWallet } from "../redux/slice/walletSlice";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { connectWallet } from "../utils/connectWallet";
// import { getMainContract } from "../utils/ether";
import { getMainContract } from "../utils/contract";
import { appKit } from "../utils/reownWallet";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { address, isConnected, contracts, network} =
    useSelector((state) => state.wallet);

  const [loading, setLoading] = useState(false);


const handleLogin = async () => {

try{

setLoading(true);

let userAddress = address;
const latestAccount = appKit.getAccount();
if (latestAccount?.address) {
userAddress = latestAccount.address;
}

/* CONNECT WALLET */

if(!isConnected){

 userAddress =
 await connectWallet(
 dispatch,
 network.CHAIN_ID
 );

 if(!userAddress){

 setLoading(false);
 return;

 }

}


/* CONTRACT */

const contract =
await getMainContract(
contracts.MAIN_CONTRACT
);


/* USER EXISTS */

const exists =
await contract.isUserExists(
userAddress
);

if(!exists){

toast.warning(
"Wallet not registered"
);

setTimeout(()=>{

navigate("/register");

},1500);

setLoading(false);
return;

}


/* USER DATA */

const userData =
await contract.users(
userAddress
);

const userID =
userData.id.toString();


dispatch(

setWallet({

 address:userAddress,
 chainId:network.CHAIN_ID,
 userId:userID,
 userData:userData

})

);


/* LOCAL STORAGE */

localStorage.setItem(
"userId",
userID
);


localStorage.setItem(
"walletAddress",
userAddress
);


toast.success(
"Login Successful ✅"
);


/* REDIRECT */

navigate("/dashboard");


}catch(error){

console.log(error);

toast.error(
"Login Failed ❌"
);

}

setLoading(false);

};



  return (
    <section className="e ca ci di">
      <div className="a">
        <div className="ja qb _d">
          <div className="jc ng">
            <div
              className="wow fadeInUp la cd pe re gf kf mg yk gl vm"
              style={{
                fontFamily: "math",
                letterSpacing: "1px",
                background:
                  "linear-gradient(45deg, #103514, #1a3216)",
              }}
            >
              <h3 className="va fi mi pi yi vl gn">
                Login to your account
              </h3>

              <div className="ta">
                <button
                  className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
                  style={{
                    borderRadius: "9px",
                    backgroundColor: "#d0ab56",
                  }}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : "WALLET AUTHORIZATION"}
                </button>
              </div>

              <p className="fi ii qi xi ul">
                Don't have an account?
                <Link to="/register" className="bj mk">
                  Create Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
