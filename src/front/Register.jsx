import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { connectWallet } from "../utils/connectWallet";
import { getMainContract } from "../utils/contract";
import { useNavigate } from "react-router-dom";
import { setGlobalProvider } from "../utils/contract";
import { appKit } from "../utils/reownWallet";
function Register() {

 const dispatch = useDispatch();
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const { address, contracts, network } = useSelector((state) => state.wallet);

 const [refId,setRefId]=useState("");
 const [loading,setLoading]=useState(false);
 const [isReadOnly,setIsReadOnly]=useState(false);


 /* AUTO REF */

 useEffect(()=>{

  const refFromURL =
  searchParams.get("ref");

  if(refFromURL){

   setRefId(refFromURL);
   setIsReadOnly(true);

  }

 },[searchParams]);



 /* ERROR PARSER */

 const parseError=(error)=>{

  console.log("Blockchain Error:",error);

  if(error?.code===4001)
   return "Transaction rejected";

  if(error?.reason)
   return error.reason;

  if(error?.shortMessage)
   return error.shortMessage;

  if(error?.info?.error?.message)
   return error.info.error.message;

  return "Transaction Failed";

 };



 /* REGISTER */

 const handleRegister = async () => {
  try {
    if (!refId.trim()) {
      return toast.error("Enter Sponsor ID");
    }
 
    setLoading(true);
 
    let userAddress = address;
 
    /* 🔥 ALWAYS GET LATEST ACCOUNT */
    const latestAccount = appKit.getAccount();
    if (latestAccount?.address) {
      userAddress = latestAccount.address;
    }
 
    /* 🔥 ENSURE WALLET CONNECTED (FIXED) */
    let provider = appKit.getWalletProvider();
 
    if (!provider || !userAddress) {
      userAddress = await connectWallet(
        dispatch,
        network.CHAIN_ID
      );
 
      if (!userAddress) {
        setLoading(false);
        return;
      }
 
      provider = appKit.getWalletProvider();
    }
 
    /* 🔥 SET GLOBAL PROVIDER (MOST IMPORTANT FIX) */
    if (!provider) {
      throw new Error("Wallet not connected properly");
    }
 
    setGlobalProvider(provider);
 
    /* CONTRACT */
    const contract = await getMainContract(
      contracts.MAIN_CONTRACT
    );
 
    /* SPONSOR CHECK */
    console.log(refId);
 
    const referAddress =
      await contract.referralCodeToAddress(refId);
 
    console.log("Refer Address:", referAddress);
 
    if (
      !referAddress ||
      referAddress === ethers.ZeroAddress
    ) {
      setLoading(false);
      return toast.error("Invalid Sponsor ID");
    }
 
    /* SELF REF */
    if (
      referAddress.toLowerCase() ===
      userAddress.toLowerCase()
    ) {
      setLoading(false);
      return toast.error("Self referral not allowed");
    }
 
    /* USER EXISTS */
    const exists =
      await contract.isUserExists(userAddress);
 
    console.log("User Exists:", exists);
 
    if (exists) {
      setLoading(false);
      return toast.warning("Already Registered");
    }
 
    /* 🔥 REMOVE STATIC CALL (BUG FIX) */
    console.log("Sending transaction...");
 
    const tx =
      await contract.registerUser(referAddress);
 
    toast.info("Transaction sent...");
 
    await tx.wait(1);
 
    toast.success("Registration Successful ✅");
 
    setTimeout(() => {
      navigate("/login");
    }, 2000);
 
  } catch (error) {
    console.log(error);
    toast.error(parseError(error));
  }
 
  setLoading(false);
};



 return(

<>

{loading &&(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.7)",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"#fff",
fontSize:"20px",
zIndex:9999
}}>

Please Wait...

</div>

)}


<section className="e ca ci di">

<div className="a">

<div className="ja qb _d">

<div className="jc ng">

<div
className="la cd pe re gf kf mg yk gl vm"
style={{
fontFamily:"math",
letterSpacing:"1px",
background:
"linear-gradient(45deg,#103514,#1a3216)"
}}>

<h3 className="va fi mi pi yi vl gn">

Create your account

</h3>


<div className="xa">

<input
type="text"
placeholder="Enter Sponsor ID"
value={refId}
readOnly={isReadOnly}
onChange={(e)=>
setRefId(e.target.value)
}
style={{
borderRadius:"9px",
backgroundColor:
isReadOnly
?"#cccccc55"
:"#00800033"
}}
className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
/>

</div>


<div className="ta">

<button
className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
style={{
borderRadius:"9px",
backgroundColor:"#d0ab56"
}}
onClick={handleRegister}
disabled={loading}
>

{loading?
"Processing..."
:"SUBMIT"}

</button>

</div>


<p className="fi ii qi xi ul">

Already Member?

<Link to="/login" className="bj mk">

Login Here

</Link>

</p>


</div>

</div>

</div>

</div>

</section>

</>

);

}

export default Register;