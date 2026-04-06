
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoReconnect } from "./utils/autoReconnect";

import MainLayout from "./components/layout/MainLayout";
import Home from "./front/Home";
import Login from "./front/Login";
import Dashboard from "./user/Dashboard";
import ProtectedRoute from "./components/user/ProtectedRoutes";
import Level from "./user/Level";
import Transaction from "./user/Transaction";
import StakingCalculator from "./user/StakingCalculator";
import Register from "./front/Register";
import ViewAccount from "./front/ViewAccount";
import LockHistory from "./user/LockHistory";
import MyPartners from "./user/MyPartners";
import MiningHistory from "./user/MiningHistory";
import StakingHistory from "./user/StakingHistory";
import WithdrawHistory from "./user/WithdrawHistory";
import Staking from "./user/Staking";
import Liquidity from "./user/Liquidity";
import LiquidityRequest from "./user/LiquidityRequest";
import SingleLeg from "./user/SingleLeg";
import SingleLegTree from "./user/SingleLegTree";

function App() {

 const dispatch = useDispatch();

 const { network } =
 useSelector(
 (state)=>state.wallet
 );

 /* IMPORTANT */

 const [ready,setReady] =
 useState(false);

 /* AUTO RECONNECT */

 useEffect(()=>{
   if (!network?.CHAIN_ID) return;
 const init=async()=>{

 await autoReconnect(dispatch,network.CHAIN_ID);

 setReady(true);

 };

 init();

 },[]);

 /* METAMASK EVENTS */

 useEffect(()=>{

 if(!window.ethereum)
 return;

 window.ethereum.on(
 "accountsChanged",
 ()=>window.location.reload()
 );

 window.ethereum.on(
 "chainChanged",
 ()=>window.location.reload()
 );

 },[]);


 /* WAIT UNTIL READY */

 if(!ready){

 return null;

 }


 return(

 <Routes>

 <Route element={<MainLayout />}>

 <Route path="/" element={<Home />} />

 <Route path="/login" element={<Login />} />

 <Route path="/register" element={<Register />} />

 <Route path="/view-account" element={<ViewAccount />} />
 <Route path="/single-leg" element={<SingleLeg />} />

 </Route>


 <Route element={<ProtectedRoute />}>

 <Route path="/dashboard" element={<Dashboard />} />

 <Route path="/level" element={<Level />} />

 <Route path="/transaction" element={<Transaction />} />

 <Route path="/roiCalculator" element={<StakingCalculator />} />

 <Route path="/dashboard/:userId" element={<Dashboard />} />

 <Route path="/lockHistory" element={<LockHistory />} />

 <Route path="/myPartners" element={<MyPartners />} />

 <Route path="/miningHistory" element={<MiningHistory />} />

 <Route path="/stakingHistory" element={<StakingHistory />} />
 <Route path="/staking" element={<Staking />} />

 <Route path="/withdrawHistory" element={<WithdrawHistory />} />
 <Route path="/liquidity" element={<Liquidity />} />
 <Route path="/liquidityRequest" element={<LiquidityRequest />} />
    <Route path="/singleLeg" element={<SingleLegTree />} />

 </Route>

 </Routes>

 );

}

export default App;