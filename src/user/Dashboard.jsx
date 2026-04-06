
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/user/Header";
import { ethers } from "ethers";
import { getMainContract, getTokenContract } from "../utils/contract";
import Cards from "./Cards";

function Dashboard() {

  // const { userId: paramUserId } = useParams();
  const { contracts, userId: reduxUserId, address } =
    useSelector((state) => state.wallet);
  const navigate = useNavigate();
  // const userId = paramUserId || reduxUserId;

  /* ================= STATE ================= */

  const [nrxPrice, setNrxPrice] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState({
    usd: "0.0000",
    nrx: "0.0000"
  });
  const [available, setAvailable] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [totalEarn, setTotalEarn] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [levelIncome, setLevelIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [directIncome, setDirectIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [rankIncome, setRankIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [leaderIncome, setLeaderIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [leaderRewardIncome, setLeaderRewardIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [totalMiningSingleLegLevelIncome, settotalMiningSingleLegLevelIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [leaderRewardRankPercent, setLeaderRewardRankPercent] = useState("-");
  const [staking, setStaking] = useState({ usd: "0.0000", nrx: "0.0000" });

  const [partnerCount, setPartnerCount] = useState("0");
  const [teamCount, setTeamCount] = useState("0");
  const [myId, setMyId] = useState("");
  const [refAddress, setRefAddress] = useState("");

  const [directBusiness, setDirectBusiness] = useState({ usd: "0.00", nrx: "0.00" });
  const [teamBusiness, setTeamBusiness] = useState({ usd: "0.00", nrx: "0.00" });
  const [currentBusiness, setCurrentBusiness] = useState({ usd: "0.00", nrx: "0.00" });

  const [capitalReturn, setCapitalReturn] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [lockedNRX, setLockedNRX] = useState("0");

  const [rank, setRank] = useState("");
  const [leaderRank, setLeaderRank] = useState("");
  const [leaderRewardLeft, setLeaderRewardLeft] = useState("");

  const [status, setStatus] = useState("Inactive");


  const [withdrawCheck, setWithdrawCheck] = useState({
    success: false,
    amount: 0
  });

  /* ================= HELPERS ================= */

  const f4 = (v) => Number(v).toFixed(4);
  const f2 = (v) => Number(v).toFixed(2);

  const shortenAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

  const getNRXPrice = async (main) => {
    const one = ethers.parseUnits("1", 18);
    const price = await main.getTokenToUSDT(one);
    return Number(ethers.formatUnits(price, 18));
  };

  const getUserRank = (r) => [
    "", "NRX1", "NRX2", "NRX3", "NRX4",
    "NRX5", "NRX6", "NRX7", "NRX8", "NRX9"
  ][Number(r)];

  const getLeaderRank = (r) => [
    "", "Pearl", "Sapphire", "Emerald",
    "Ruby", "Diamond", "Double Diamond"
  ][Number(r)];

  const getLeaderReward = (registrationTime) => {
    if (!registrationTime) return "";
    const start = new Date(Number(registrationTime) * 1000);
    const future = new Date(start);
    future.setDate(future.getDate() + 15);
    const diff = future - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} Days Left` : "Completed";
  };

  /* ================= LOAD ================= */


  // useEffect(() => {
  //   if (address)
  //     loadDashboard();
  //   checkWithdrawStake();
  // }, [address]);


  useEffect(() => {
    if (address) {
      loadDashboard();

      // const stakeDone = sessionStorage.getItem("stake_done");

      // if (stakeDone) {

      //   sessionStorage.removeItem("stake_done");
      // } else {
      //   checkWithdrawStake();
      // }
    }
  }, [address]);


  const loadDashboard = async () => {
    try {
      if (!address) return;

      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const token = await getTokenContract(contracts.TOKEN_CONTRACT);
      /* ========= PARALLEL CALLS ========= */
      const one = ethers.parseUnits("1", 18);

      const [
        exists,
        user,
        details,
        priceRaw,
        lockedRaw,
        withdrawnRaw,
        registrationTimeRaw
      ] = await Promise.all([
        main.isUserExists(address),
        main.users(address),
        main.user_details(address),
        main.getTokenToUSDT(one),
        // token.balanceOf(contracts.LOCK_CONTRACT),
        0,
        // main._amountWithdrawn(address),
        0,
        main.registrationTime(address)
      ]);

      if (!exists) {
        toast.error("Invalid User");
        return;
      }

      const price = Number(ethers.formatUnits(priceRaw, 18));
      setNrxPrice(price);

      const f4 = (v) => Number(v).toFixed(4);
      const f2 = (v) => Number(v).toFixed(2);
      const toNRX = (usd) => price > 0 ? usd / price : 0;

      /* ========= USER DATA ========= */

      const availableUSD = Number(ethers.formatUnits(user.balance, 18));
      const totalUSD = Number(ethers.formatUnits(user.totalbalance, 18));
      const levelUSD = Number(ethers.formatUnits(user.totalMiningLevelIncome, 18));
      const directUSD = Number(ethers.formatUnits(user.totalDirectIncome, 18));
      const rankUSD = Number(ethers.formatUnits(user.totalRankIncome, 18));
      const totalStaked = Number(ethers.formatUnits(user.totalStaked, 18));

      const leaderUSD = Number(ethers.formatUnits(details.totalLeaderIncome, 18));
      // const leaderRewardUSD = Number(ethers.formatUnits(details.totalLeaderRewardIncome, 18));
      const leaderRewardUSD = Number(ethers.formatUnits(1, 18));
      const totalMiningSingleLegLevelIncome = Number(ethers.formatUnits(details.totalMiningSingleLegLevelIncome, 18));
      const directBiz = Number(ethers.formatUnits(details.DirectStaked, 18));
      const teamBiz = Number(ethers.formatUnits(details.totalTeambuisness, 18));
      const currentBiz = Number(ethers.formatUnits(details.myTeambuisness, 18));
      const capital = Number(ethers.formatUnits(details.totalCapitalReturn, 18));

      // Withdraw amount
      const withdrawnUSD = Number(
        ethers.formatUnits(withdrawnRaw, 18)
      );

      setTotalWithdraw({
        usd: f4(withdrawnUSD),
        nrx: f4(toNRX(withdrawnUSD))
      });



      /* ========= STATE SET ========= */

      setAvailable({ usd: f4(availableUSD), nrx: f4(toNRX(availableUSD)) });
      setTotalEarn({ usd: f4(totalUSD), nrx: f4(toNRX(totalUSD)) });
      setLevelIncome({ usd: f4(levelUSD), nrx: f4(toNRX(levelUSD)) });
      setDirectIncome({ usd: f4(directUSD), nrx: f4(toNRX(directUSD)) });
      setRankIncome({ usd: f4(rankUSD), nrx: f4(toNRX(rankUSD)) });

      setLeaderIncome({ usd: f4(leaderUSD), nrx: f4(toNRX(leaderUSD)) });
      setLeaderRewardIncome({ usd: f4(leaderRewardUSD), nrx: f4(toNRX(leaderRewardUSD)) });
      settotalMiningSingleLegLevelIncome({ usd: f4(totalMiningSingleLegLevelIncome), nrx: f4(toNRX(totalMiningSingleLegLevelIncome)) });

      setDirectBusiness({ usd: f2(directBiz), nrx: f2(toNRX(directBiz)) });
      setTeamBusiness({ usd: f2(teamBiz), nrx: f2(toNRX(teamBiz)) });
      setCurrentBusiness({ usd: f2(currentBiz), nrx: f2(toNRX(currentBiz)) });

      setCapitalReturn({ usd: f4(capital), nrx: f4(toNRX(capital)) });
      setStaking({ usd: f4(totalStaked), nrx: f4(toNRX(totalStaked)) });

      // setRank(["","NRX1","NRX2","NRX3","NRX4","NRX5","NRX6","NRX7","NRX8","NRX9"][Number(user.rank)] || "-");
      const rankValue = Number(details.rank);

      if (rankValue > 0) {
        setRank(
          ["", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8", "X9"][rankValue]
        );
      } else {
        setRank("No Rank");
      }
      // setLeaderRank(["","Pearl","Sapphire","Emerald","Ruby","Diamond","Double Diamond"][Number(details.leaderRank)] || "-");
      const leaderRankValue = Number(details.leaderRank);

      if (leaderRankValue > 0) {
        setLeaderRank(
          ["", "Pearl", "Sapphire", "Emerald", "Ruby", "Diamond", "Double Diamond"][leaderRankValue] + " Leader"
        );
      } else {
        setLeaderRank("No Leader Rank");
      }
      // setLeaderRewardLeft(
      //   Number(details.leaderRewardRank) > 0
      //     ? `${Number(details.leaderRewardRank)} %`
      //     : "-"
      // );
      const rewardPercent = Number(details.leaderRewardRank);

      if (rewardPercent > 0) {
        setLeaderRewardRankPercent(`${rewardPercent} %`);
      } else {
        setLeaderRewardRankPercent("-");
      }
      // new calculation of leaders

      if (registrationTimeRaw && Number(registrationTimeRaw) > 0) {
        const start = new Date(Number(registrationTimeRaw) * 1000);
        const future = new Date(start);
        future.setDate(future.getDate() + 15);

        const today = new Date();
        const diff = future - today;

        const remainingDays = Math.floor(
          diff / (1000 * 60 * 60 * 24)
        );

        if (remainingDays > 0) {
          // setLeaderRewardLeft(`${remainingDays} Days Left`);
          setLeaderRewardLeft(`No Reward Left`);
        } else {
          setLeaderRewardLeft(""); // PHP jaisa blank after complete
        }
      } else {
        setLeaderRewardLeft("");
      }

      setPartnerCount(user.partnercount.toString());
      setTeamCount(details.myTeamCount.toString());
      setMyId(user.referralCode);
      setRefAddress(user.referrer);
      // console.log("referrer address is ",user.referrer);
      setStatus(totalStaked >= 10 ? "Active" : "Inactive");

      setLockedNRX(
        Number(ethers.formatUnits(lockedRaw, 18)).toLocaleString()
      );

    } catch (err) {
      console.error(err);
      toast.error("Dashboard Load Failed");
    }
  };



  const referralLink = `${window.location.origin}/register?ref=${myId}`;


  // const checkWithdrawStake = async () => {
  //   try {

  //     const main = await getMainContract(contracts.MAIN_CONTRACT);
  //     const userDetail = await main.users(address);

  //     const userId = userDetail.id.toString();

  //     const formData = new FormData();
  //     formData.append("action", "check_withdraw_stake");
  //     formData.append("userid", userId);

  //     const res = await fetch(
  //       "https://nirmalx.io/old/user/user_action.php",
  //       {
  //         method: "POST",
  //         body: formData
  //       }
  //     );

  //     const data = await res.json();
  // // console.log("data is :",data);
  //     if (data) {

  //       setWithdrawCheck({
  //         success: data.success,
  //         amount: data.amount
  //       });

  //       if (data.success === false) {
  //         //  alert(data.amount);
  //         const halfAmount = data.amount / 2;
  //          const referralAddress=refAddress;
  //        console.log("referral address is:",referralAddress);
  //         toast.info("Please stake first to continue");
  // console.log(data)
  //         navigate("/staking", {
  //           state: {
  //             amount: halfAmount,
  //             wd_id: data.wd_id,
  //              referrarAddress:referralAddress,
  //           }
  //         });

  //       }

  //     }

  //   } catch (error) {
  //     console.error("Withdraw check error:", error);
  //   }
  // };

  const checkWithdrawStake = async () => {
    try {

      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const userDetail = await main.users(address);

      const userId = userDetail.id.toString();

      // ✅ DIRECT REFERRAL ADDRESS
      const referralAddress = userDetail.referrer;

      const formData = new FormData();
      formData.append("action", "check_withdraw_stake");
      formData.append("userid", userId);

      const res = await fetch(
        "https://nirmalx.io/old/user/user_action.php",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (data) {

        setWithdrawCheck({
          success: data.success,
          amount: data.amount
        });

        if (data.success === false) {

          const halfAmount = data.amount / 2;

          toast.info("Please stake first to continue");

          navigate("/staking", {
            state: {
              amount: halfAmount,
              wd_id: data.wd_id,
              referrarAddress: referralAddress
            }
          });

        }
      }

    } catch (error) {
      console.error("Withdraw check error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="markets-capital pt20 pb40">
        <div className="container">
          <div className="wrapedStat gradient-border">
            <div className="row">
              <div className="col-md-6">
                <div className="grid-container">

                  <div className="grid-item">
                    <span>Current Balance</span><br />
                    <b className="fs-20 available_balance">
                      $ {available.usd}
                    </b><br />
                    <b className="fs-10 available_balance_nrx">
                      ( NRXN {available.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Total Earning</span><br />
                    <b className="fs-20 totalbalance">
                      $ {totalEarn.usd}
                    </b><br />
                    <b className="fs-10 totalbalance_nrx">
                      ( NRXN {totalEarn.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Level Income</span><br />
                    <b className="fs-20 totalMiningLevelIncome">
                      $ {levelIncome.usd}
                    </b><br />
                    <b className="fs-10 totalMiningLevelIncome_nrx">
                      ( NRXN {levelIncome.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Direct Income</span><br />
                    <b className="fs-20 totalDirectIncome">
                      $ {directIncome.usd}
                    </b><br />
                    <b className="fs-10 totalDirectIncome_nrx">
                      ( NRXN {directIncome.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Rank Income</span><br />
                    <b className="fs-20 totalRankIncome">
                      $ {rankIncome.usd}
                    </b><br />
                    <b className="fs-10 totalRankIncome_nrx">
                      ( NRXN {rankIncome.nrx} )
                    </b>
                  </div>

                  <div className="grid-item rankDetails">
                    <span>Current Rank</span><br />
                    <b className="fs-20 myRank">{rank}</b>
                  </div>

                  <div className="grid-item">
                    <span>Leader Income</span><br />
                    <b className="fs-20 totalLeaderIncome">
                      $ {leaderIncome.usd}
                    </b><br />
                    <b className="fs-10 totalLeaderIncome_nrx">
                      ( NRXN {leaderIncome.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Leadership Rank</span><br />
                    <b className="fs-20 myLeaderRank">
                      {leaderRank}
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Leadership Reward Income</span><br />
                    <b className="fs-20 totalLeaderRewardIncome">
                      $ {leaderRewardIncome.usd}
                    </b><br />
                    <b className="fs-10 totalLeaderRewardIncome_nrx">
                      ( NRXN {leaderRewardIncome.nrx} )
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Leadership Reward Rank</span><br />
                    <b className="fs-20 leaderRewardRank">
                      {leaderRewardRankPercent}
                    </b>
                  </div>

                  <div className="grid-item">
                    <span>Total Staking Tokens</span><br />
                    <b className="fs-20 staking_tokens">
                      $ {staking.usd}
                    </b><br />
                    <b className="fs-10 staking_nrx">
                      ( NRXN {staking.nrx} )
                    </b>
                  </div>
                  <div className="grid-item">
                    <span>Global Income</span><br />
                    <b className="fs-20 staking_tokens">
                      $ {totalMiningSingleLegLevelIncome.usd}
                    </b><br />
                    <b className="fs-10 staking_nrx">
                      ( NRXN {settotalMiningSingleLegLevelIncome.nrx} )
                    </b>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}

              <div className="col-md-6">

                <h3 className="newFont">
                  Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth
                </h3>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="spaceBetween">
                      <div className="attr_text">
                        Total Direct Referral
                        <Link to="/myPartners" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
                          View
                        </Link> :
                      </div>
                      <div className="attr_text partnerCount">
                        {partnerCount}
                      </div>
                    </div>

                    <div className="spaceBetween">
                      <div className="attr_text">Total Direct Business :</div>
                      <div className="attr_text DirectStaked">
                        $ {directBusiness.usd} ( NRXN {directBusiness.nrx} )
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="spaceBetween">
                      <div className="attr_text">
                        Total Team Size
                        <Link to="/level" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
                          View
                        </Link> :
                      </div>
                      <div className="attr_text myTeamCount">
                        {teamCount}
                      </div>
                    </div>

                    <div className="spaceBetween">
                      <div className="attr_text">Total Team Business :</div>
                      <div className="attr_text totalTeambuisness">
                        $ {teamBusiness.usd} ( NRXN {teamBusiness.nrx} )
                      </div>
                    </div>

                    <div className="spaceBetween">
                      <div className="attr_text">My ID :</div>
                      <div className="attr_text my_id">
                        {myId}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-7">
                    <div className="spaceBetween">
                      <div className="attr_text" style={{ fontSize: "12px" }}>
                        Current Business :
                      </div>
                      <div className="attr_text currentBusiness" style={{ fontSize: "12px" }}>
                        $ {currentBusiness.usd} ( NRXN {currentBusiness.nrx} )
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* ===== REFERRAL LINK (PHP SAME) ===== */}

                <div className="spaceBetween">
                  {/* <input
              className="baseInput referral-link refWidth"
              readOnly
              value={`https://nirmalx.io/signup.php?ref=${myId}`}
            /> */}

                  <input
                    className="baseInput referral-link refWidth"
                    readOnly
                    // value={`https://nirmalx.io/register?ref=${myId}`}
                    value={referralLink}
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      opacity: 1,
                      WebkitTextFillColor: "#000"
                    }}
                  />

                  <span
                    className="base_btn copy_ref"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        // `https://nirmalx.io/register?ref=${myId}`
                        referralLink
                      );
                      toast.success("Copied!");
                    }}
                  >
                    Copy
                  </span>
                </div>

                <hr />

                {/* ===== LEADER REWARD ===== */}

                <div className="col-sm-12 d-flex justify-content-center">
                  <div className="grid-item">
                    <span className="fw-bold fs-5">
                      <i className="fas fa-crown text-warning"></i> Leader's Reward
                    </span><br />
                    <b className="fs-20" id="leaders_reward">
                      {leaderRewardLeft}
                    </b>
                  </div>
                </div>

                {/* ===== NRX LOCKER ===== */}

                {/* <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
                  <h3 className="newFont">
                    <i className="fas fa-lock locker-icon"></i> NRX Locker
                  </h3>

                  <div className="d-flex align-items-center gap-4">
                    <h6>Total NRX Locked :</h6>
                    <h6 className="locked_nrx">
                      {lockedNRX} NRX
                    </h6>
                  </div>

                  <div className="d-flex align-items-center gap-4">
                    <h6>Contract Link:</h6>
                    <Link
                      className="contract_link"
                      target="_blank"
                      to={`https://bscscan.com/address/${contracts?.LOCK_CONTRACT}`}
                    >
                      {contracts?.LOCK_CONTRACT
                        ? contracts.LOCK_CONTRACT.slice(0, 6) +
                        "..." +
                        contracts.LOCK_CONTRACT.slice(-4)
                        : ""}
                    </Link>
                  </div>

                  <div className="unlocks">
                    <Link className="connect_btn unlockWallet" to="/lockHistory">
                      View
                    </Link>
                  </div>

                </div> */}
              </div>
            </div>
          </div>

          <Cards
            // userData={userData}
            totalWithdraw={totalWithdraw}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;