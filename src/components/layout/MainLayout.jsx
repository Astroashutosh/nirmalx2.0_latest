import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
// import Hero from "./Hero";
import Footer from "./Footer";

function MainLayout() {
  return (
    <>
   <div className="fixed-bg"></div>

    <Navbar/>
        <Outlet />
    <Footer/>
    </>
  );
}

export default MainLayout;
