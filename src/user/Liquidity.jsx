

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import logo from '/images/logo.png';

import {
  getLiquidityContract
} from "../utils/contract";

function Liquidity({ totalWithdraw }) {

  const { address, contracts } = useSelector((state) => state.wallet);
  //  const address="0x7eAeb66a1601836dF019ED08cf188427F62f5bA5";
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userData, setUserData] = useState(null);
  const [txLogs, setTxLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [stakeHistory, setStakeHistory] = useState([]);
  const [nrxPrice, setNrxPrice] = useState(1);

  const liquidityAddress =
    contracts?.LIQUIDITY_CONTRACT;

  const [topStats, setTopStats] = useState(null);

  const getRankName = (r) => {
    return ["-", "X1", "X2", "X3", "X4", "X5"][r] || "-";
  };

  const loadData = async () => {
    try {
      const liquidity = await getLiquidityContract(liquidityAddress);
      const user = await liquidity.users(address);
      const stakes = await liquidity.getUserStakes(address);
      const approvedStakes = stakes.filter((s) => s.isApproved);

      const tx = await liquidity.getUserTx(address);

      const filteredTx = tx.filter((t) => {
        const txTime = Number(t.timestamp);

        const match = approvedStakes.some((s) => {
          return (
            s.isApproved === true &&
            Number(s.timestamp) === txTime
          );
        });

        return !match;
      });

      const price = await liquidity.getNRXToUSDT(
        ethers.parseUnits("1", 18)
      );
      const nrx_value = Number(ethers.formatUnits(price, 18));
      setNrxPrice(nrx_value);

      setUserData({
        totalStaked: Number(ethers.formatUnits(user.totalStaked, 18)),
        totalROI: Number(ethers.formatUnits(user.totalROI, 18)),
        withdrawable: Number(ethers.formatUnits(user.balance, 18)),
      });

      setTopStats({
        totalBalance: Number(ethers.formatUnits(user.totalbalance, 18)),
        totalRankIncome: Number(ethers.formatUnits(user.totalRankIncome, 18)),
        totalTeamCount: Number(user.totalTeamCount),
        activePartner: Number(user.activePartnercount),
        rank: Number(user.rank)
      });


      setTxLogs(filteredTx);

    } catch (err) {
      console.log(err);
      toast.error("Wallet not connected");
    }
  };
  useEffect(() => {
    if (address && liquidityAddress) {
      loadData();
    }
  }, [address]);

  const handleROI = async () => {
    try {
      const liquidity = await getLiquidityContract(liquidityAddress);
      const tx = await liquidity.calculateROI(address);
      await tx.wait();
      toast.success("Executed Successfully");
      loadData();

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  /* ================= WITHDRAW ================= */

  const handleWithdraw = async () => {
    try {
      const amountValue = Number(withdrawAmount);
      if (!amountValue || amountValue <= 0) {
        toast.error("Invalid amount.");
        return;
      }
      const liquidity = await getLiquidityContract(liquidityAddress);
      const amountWei = ethers.parseUnits(amountValue.toString(), 18);
      const tx = await liquidity.withdraw(amountWei);
      await tx.wait();
      toast.success("Withdrawal successful");
      setWithdrawAmount("");
      loadData();

    } catch (error) {
      console.log(error);
      toast.error("Withdraw failed");
    }
  };


  const loadStakeHistory = async () => {
    try {
      const liquidity = await getLiquidityContract(liquidityAddress);
      const stakes = await liquidity.getUserStakes(address);
      // format data
      const formatted = stakes.map((s) => ({
        id: Number(s.id),
        amount: Number(ethers.formatUnits(s.amount, 18)),
        tokenAmount: Number(ethers.formatUnits(s.tokenAmount, 18)),
        roi: Number(ethers.formatUnits(s.totalRoi, 18)),
        date: new Date(Number(s.timestamp) * 1000).toLocaleString(),
        status: s.isApproved ? "Approved" : "Pending"
      }));

      setStakeHistory(formatted);
      setShowModal(true);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load history");
    }
  };


  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="token-title newFont">
            <h2 className="gradient-text">Liquidity</h2>
          </div>
        </div>
      </div>


      <div className="container  mt-4">
        <div className="wrapedStat gradient-border ">


          <div className="row">

            <div className="col-md-4 mb-3">
              <div className="grid-item text-center">
                <span>Total Balance</span><br />
                <b className="fs-20 ">{topStats ? `NRXN ${topStats.totalBalance.toFixed(4)}` : "Loading..."}</b>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="grid-item text-center">
                <span>Total Rank Income</span><br />
                <b className="fs-20 ">{topStats ? `NRXN ${topStats.totalRankIncome.toFixed(4)}` : "Loading..."}</b>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="grid-item text-center">
                <span>Total Team Count</span><br />
                <b className="fs-20 ">{topStats ? topStats.totalTeamCount : "Loading..."}</b>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="grid-item text-center">
                <span>Active Partner</span><br />
                <b className="fs-20 ">{topStats ? topStats.activePartner : "Loading..."}</b>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="grid-item text-center">
                <span>Rank</span><br />
                <b className="fs-20 ">{topStats ? getRankName(topStats.rank) : "Loading..."}</b>
              </div>
            </div>

          </div>
        </div>

        <div className="row mt-4">

          <div className="col-md-6 mb-3">
            <div className="farms-single-section gradient-border stakeBg h-100">
              {/* <div className="farms-single-section gradient-border stakeBg"> */}
              <div className="coin-desc">
                <div className="coin-desc-left">
                  <img src={logo} alt="NirmalX" />
                </div>
                <div className="coin-desc-right newFont">
                  <h4><b>Staking</b></h4>
               
                      <span
                        className="bg history0 nonSelect"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={loadStakeHistory}
                      >
                        View History
                      </span>
               
                </div>
              </div>

              <div className="calculat">
                <div className="calculat-left">
                  <h6>Total Stake :</h6>
                  <h6>Total ROI :</h6>
                </div>
                <div className="calculat-right">
                  <h6>
                    {userData
                      ? `$ ${userData.totalStaked.toFixed(4)} ( NRXN ${(userData.totalStaked / nrxPrice).toFixed(4)} )`
                      : "Loading.."}
                  </h6>
                  <h6>
                    {userData
                      ? `NRXN ${userData.totalROI.toFixed(4)}`
                      : "Loading.."}
                  </h6>
                </div>
              </div>

              <div className="unlocks" style={{ marginTop: "9.9rem" }}>
                <a className='connect_btn unlockWallet' onClick={handleROI}>
                  Calculate ROI
                </a>
              </div>
              {/* </div> */}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            {/* <div className="farms-single-section gradient-border stakeBg "> */}
            <div className="farms-single-section gradient-border stakeBg h-100">
              <div className="coin-desc">
                <div className="coin-desc-left">
                  <img src={logo} alt="NirmalX" />
                </div>
                <div className="coin-desc-right newFont">
                  <h4><b>Withdraw</b></h4>
                </div>
              </div>

              <div className="calculat">
                <div className="calculat-left">
                  <h6>Withdrawable Amount:</h6>
                </div>
                <div className="calculat-right">
                  <h6>
                    {userData
                      ? `NRXN ${userData.withdrawable.toFixed(4)}`
                      : "Loading.."}
                  </h6>
                </div>
              </div>

              <label style={{ marginTop: "7rem" }}>Amount*</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

              <div className="unlocks">
                <a className='connect_btn unlockWallet' onClick={handleWithdraw}>
                  Submit
                </a>
              </div>
              {/* </div> */}
            </div>
          </div>

        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="transaction-container">
              <h4>Transaction Log</h4>
              <table className="table transaction-table" style={{ color: "#ffffff" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount (NRXN)</th>
                    <th>Type</th>
                    <th>DateTime</th>
                  </tr>
                </thead>

                <tbody>
                  {txLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No records
                      </td>
                    </tr>
                  ) : (
                    txLogs.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id.toString()}</td>
                        <td>{ethers.formatUnits(row.amount, 18)}</td>
                        <td>{row.txType}</td>
                        <td>
                          {new Date(Number(row.timestamp) * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>


{/* Modal Stake history */}
{showModal && (
  <div className="custom-modal-overlay">

    <div className="custom-modal">

      {/* HEADER */}
      <div className="modal-header-custom">
        <h3>📊 Staking History</h3>
        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="modal-body-custom">

        <table className="table custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount ($)</th>
              <th>Token Amount (NRXN)</th>
              <th>ROI</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {stakeHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              stakeHistory.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>${row.amount.toFixed(4)}</td>
                  <td>NRXN {row.tokenAmount.toFixed(4)}</td>
                  <td>${row.roi.toFixed(4)}</td>
                  <td>
                    <span className={
                      row.status === "Approved"
                        ? "status approved"
                        : "status pending"
                    }>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

    </div>

  </div>
)}

    </>
  );
}

export default Liquidity;
