import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import { getMainContract,getLiquidityContract } from "../../utils/contract";
import { disconnectWallet } from "../../redux/slice/walletSlice";
import { persistor } from "../../redux/store";
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOwner, setIsOwner] = useState(false);
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );
// const address="0xc56eCBBf7A3C63cF659c87355fD548e9b78b30c0";
  const [shortAddress, setShortAddress] =
    useState("Loading..");
  const [isActive, setIsActive] =
    useState(false);

  useEffect(() => {
    if (address) {
      setShortAddress(
        `${address.slice(0, 6)}...${address.slice(
          -4
        )}`
      );
      checkStatus();
      checkOwner();
    } else {
      setShortAddress("Not Connected");
      setIsActive(false);
      setIsOwner(false);
    }
  }, [address]);

  const checkStatus = async () => {
    try {
      if (!contracts?.MAIN_CONTRACT)
        return;

      const main =
        await getMainContract(
          contracts.MAIN_CONTRACT
        );

      const exists =
        await main.isUserExists(address);

      if (!exists) {
        setIsActive(false);
        return;
      }

      const user =
        await main.users(address);

      const totalStaked = Number(
        ethers.formatUnits(
          user.totalStaked,
          18
        )
      );

      setIsActive(totalStaked >= 10);
    } catch (err) {
      console.log(err);
      setIsActive(false);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(disconnectWallet());
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
 
      if (window.appKit) {
        await window.appKit.disconnect();
      }
      navigate("/login");
 
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const checkOwner = async () => {
    try {
      if (!contracts?.LIQUIDITY_CONTRACT) return;

      const liquidity = await getLiquidityContract(
        contracts.LIQUIDITY_CONTRACT
      );

      const owner = await liquidity.owner();
      // const owner ="0xc56eCBBf7A3C63cF659c87355fD548e9b78b30c0";

      // console.log("owner is :", owner);
      setIsOwner(
        owner.toLowerCase() === address.toLowerCase()
      );

    } catch (err) {
      console.log(err);
      setIsOwner(false);
    }
  };

  return (
    <>
      <div className="header-middle">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="token-title newFont">
                <h2 className="gradient-text">
                  NirmalX Nova
                </h2>
                <h5>
                  Efforts are our rewards are
                  yours!
                </h5>

                <div className="row justify-content-center">
                  <div className="col-xl-8 col-md-8 col-sm-6 ">
                    <div className="row justify-content-center">
                      <div className="col-xl-6 col-md-6 col-sm-12 mb-2">
                        <span className="connect_btn d-inline-block">
                          Connected Wallet:
                          <br />
                          <span id="connected_wallet">
                            {shortAddress}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-12 col-md-12 col-sm-6">
                    <div className="row d-flex flex-wrap justify-content-center">

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <span
                          className="connect_btn d-inline-block"
                          id="status"
                        >
                          Account Status:{" "}
                          <span
                            style={{
                              color:
                                isActive
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </span>
                      </div>

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <Link
                          to="/level"
                          className="connect_btn d-inline-block"
                        >
                          All Level{" "}
                          <i className="fas fa-users"></i>
                        </Link>
                      </div>

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <Link
                          to="/transaction"
                          className="connect_btn d-inline-block"
                        >
                          All Transaction{" "}
                          <i className="fas fa-list"></i>
                        </Link>
                      </div>

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <Link
                          to="/roiCalculator"
                          className="connect_btn d-inline-block"
                        >
                          Staking Calculator{" "}
                          <i className="fas fa-list"></i>
                        </Link>
                      </div>

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <Link
                          to="/liquidity"
                          className="connect_btn d-inline-block"
                        >
                          Liquidity{" "}
                          <i className="fas fa-list"></i>
                        </Link>
                      </div>

                      {/* {isOwner && (
                        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                          <Link
                            to="/liquidityRequest"
                            className="connect_btn d-inline-block"
                          >
                            Liquidity Request
                            <i className="fas fa-list"></i>
                          </Link>
                        </div>
                      )} */}

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <Link
                          to="/singleLeg"
                          className="connect_btn d-inline-block"
                        >
                          Single Leg{" "}
                          <i className="fas fa-users"></i>
                        </Link>
                      </div>

                      <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
                        <button
                          onClick={handleLogout}
                          className="connect_btn d-inline-block"
                          style={{
                            border: "none",
                          }}
                        >
                          LOGOUT{" "}
                          <i className="fas fa-sign-out-alt"></i>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                <br />
                <br />

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;