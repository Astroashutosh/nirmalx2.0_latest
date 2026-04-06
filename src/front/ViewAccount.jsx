import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { getMainContract } from "../utils/ether";
import { getMainContract } from "../utils/contract";
import { setWallet } from "../redux/slice/walletSlice";
import { useDispatch, useSelector } from "react-redux";
// import { connectWallet } from "../utils/connectWallet";

function ViewAccount() {
  const { contracts } = useSelector((state) => state.wallet);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewAccount = async () => {
    try {
      if (!userId.trim()) {
        return toast.error("Enter ID number.");
      }

      setLoading(true);
//  await connectWallet(dispatch,56);
      const contract = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      const userAddress = await contract.idToAddress(userId);

      if (
        !userAddress ||
        userAddress ===
          "0x0000000000000000000000000000000000000000"
      ) {
        setLoading(false);
        return toast.error("Invalid user or user does not exist");
      }
dispatch(
 setWallet({
   address: userAddress,
   chainId: null
 })
);

      // Navigate to dashboard with userId
      // navigate(`/dashboard/${userId}`);
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Loader */}
      {loading && (
        <div
          className="loader-container main_loader content"
          style={{
            height: "100%",
            width: "100%",
            position: "fixed",
          }}
        >
          <div className="loader"></div>
          <p className="loader-text">Please Wait...</p>
        </div>
      )}

      {/* Background Video */}
      <video
        className="video-background"
        autoPlay
        loop
        muted
      >
        <source
          src="/network_background_hd.mp4"
          type="video/mp4"
        />
      </video>

      <section className="e ca ci di">
        <h2
          style={{
            fontFamily: "Kanit, sans-serif",
            color: "#fff",
            fontWeight: 700,
            fontSize: "65px",
            marginTop: "-5rem",
            textAlign: "center",
          }}
          className="heading gradient-text"
        >
          View Account
        </h2>

        <h5
          style={{
            fontSize: "1.25rem",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Efforts are our rewards are yours!
        </h5>

        <br />

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
                  View Account
                </h3>

                <div className="xa">
                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) =>
                      setUserId(e.target.value)
                    }
                    style={{
                      borderRadius: "9px",
                      backgroundColor: "#00800033",
                    }}
                    className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
                  />
                </div>

                <div className="ta">
                  <button
                    className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
                    style={{
                      borderRadius: "9px",
                      backgroundColor: "#d0ab56",
                    }}
                    onClick={handleViewAccount}
                  >
                    View
                  </button>
                </div>

                <p className="fi ii qi xi ul">
                  Already Member?
                  <span
                    className="bj mk"
                    style={{
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Login Here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ViewAccount;
