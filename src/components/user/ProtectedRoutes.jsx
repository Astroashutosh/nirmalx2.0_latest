// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Footer from "./Footer";
// import Common from "./Common";

// function ProtectedRoute() {
//   const { isConnected } = useSelector(
//     (state) => state.wallet
//   );

//   return isConnected ? (
//     <>
//       <Common />
//       <Outlet />
//       <Footer />
//     </>
//   ) : (
//     <Navigate to="/login" replace />
//   );
// }

// export default ProtectedRoute;


import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import Common from "./Common";
import { useState, useEffect } from "react";

function ProtectedRoute() {

 const { isConnected,address } =
 useSelector(
 (state)=>state.wallet
 );

 const [ready,setReady]=
 useState(false);


 /* WAIT REDUX RESTORE */

 useEffect(()=>{

 setTimeout(()=>{

  setReady(true);

 },800);

 },[]);


 /* LOADING */

 if(!ready){

 return null;

 }


 /* AUTH CHECK */

 if(!address){

 return <Navigate to="/login" replace />;

 }


 return(

 <>
 <Common />
 <Outlet />
 <Footer />
 </>

 );

}

export default ProtectedRoute;