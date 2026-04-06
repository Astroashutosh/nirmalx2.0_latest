import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "/images/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `navbarDesign nav-link navcolor ${isActive ? "active" : ""}`;

  return (
    <nav
      className="navbar navbg navbar-expand-lg"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      <div className="container-xl">

        {/* LOGO */}
    <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} style={{ width: "48px", borderRadius: "40px" }} />
          <span style={{ fontSize: "20px", color: "black" }}>
            NirmalX Nova
          </span>
        </Link>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="fa fa-bars"></span>
        </button>

        {/* MENU */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink to="/" className={navClass} onClick={() => setIsOpen(false)}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/login" className={navClass} onClick={() => setIsOpen(false)}>
                Sign In
              </NavLink>
            </li>

            <li className="nav-item">
              <Link to="#" className="navbarDesign nav-link navcolor">
                Staking
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/#" className="navbarDesign nav-link navcolor">
                Governance
              </Link>
            </li>

       <li className="nav-item">
  <a
    className="navbarDesign nav-link navcolor"
    href={`${import.meta.env.BASE_URL}files/NirmalXPresentation.pdf`}
    download="NirmalX_Whitepaper.pdf"
  >
    Whitepaper
  </a>
</li>

            <li className="nav-item">
              <Link to="/#" className="navbarDesign nav-link navcolor">
                Community
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;





// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import logo from "/images/logo.png";

// function Navbar() {

//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav
//       className="navbar navbg navbar-expand-lg"
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 10px",
//       }}
//     >
//       <div className="container-xl">

        // <Link className="navbar-brand d-flex align-items-center" to="/">
        //   <img src={logo} style={{ width: "48px", borderRadius: "40px" }} />
        //   <span style={{ fontSize: "20px", color: "black" }}>
        //     NirmalX
        //   </span>
        // </Link>

//         {/* TOGGLE BUTTON */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span className="fa fa-bars"></span>
//         </button>

//         {/* COLLAPSE DIV SAME CLASS */}
//         <div
//           className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
//           id="navbarSupportedContent"
//         >
//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

//             <li className="nav-item">
//               <Link
//                 className="navbarDesign nav-link navcolor"
//                 to="/"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Home
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link
//                 className="navbarDesign nav-link navcolor"
//                 to="/login"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Sign In
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="navbarDesign nav-link navcolor" to="#">
//                 Staking
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="navbarDesign nav-link navcolor" to="#">
//                 Governance
//               </Link>
//             </li>

//             <li className="nav-item">
//               <a
//                 className="navbarDesign nav-link navcolor"
//                 href="/nirmalx/front/files/NirmalXPresentation.pdf"
//                 download
//               >
//                 Whitepaper
//               </a>
//             </li>

//             <li className="nav-item">
//               <Link className="navbarDesign nav-link navcolor" to="#">
//                 Community
//               </Link>
//             </li>

//           </ul>
//         </div>

//       </div>
//     </nav>
//   );
// }

// export default Navbar;