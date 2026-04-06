// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Header from "../components/user/Header";
// import { ethers } from "ethers";
// import {
//   getMainContract,
//   getTokenContract,
//   getLockContract,
//   getUSDTContract,
// } from "../utils/contract";

// function Dashboard() {
//   const { userId } = useParams(); // 🔥 get id from URL
//   const { contracts } = useSelector((state) => state.wallet);

//   useEffect(() => {
//     if (!userId) return;
//     loadDashboard();
//   }, [userId]);

//   const loadDashboard = async () => {
//     try {
//       const main = await getMainContract(contracts.MAIN_CONTRACT);
//       const token = await getTokenContract(contracts.TOKEN_CONTRACT);
//       const lock = await getLockContract(contracts.LOCK_CONTRACT);

//       // ✅ PHP jaisa: id → address
//       const userAddress = await main.idToAddress(userId);

//       if (
//         !userAddress ||
//         userAddress === "0x0000000000000000000000000000000000000000"
//       ) {
//         alert("Invalid User");
//         return;
//       }

//       // ✅ Now load data using THAT address
//       const user = await main.users(userAddress);
//       const userDetails = await main.user_details(userAddress);
//       const balance = await token.balanceOf(userAddress);

//       document.querySelector(".available_balance").innerText =
//         ethers.formatUnits(user.balance, 18);

//       document.querySelector(".available_balance_nrx").innerText =
//         ethers.formatUnits(balance, 18) + " NRX";

//       document.querySelector(".totalbalance").innerText =
//         ethers.formatUnits(user.totalbalance, 18);

//       document.querySelector(".totalMiningLevelIncome").innerText =
//         ethers.formatUnits(user.totalMiningLevelIncome, 18);

//       document.querySelector(".totalDirectIncome").innerText =
//         ethers.formatUnits(user.totalDirectIncome, 18);

//       document.querySelector(".totalRankIncome").innerText =
//         ethers.formatUnits(user.totalRankIncome, 18);

//       document.querySelector(".staking_tokens").innerText =
//         // ethers.formatUnits(user.totalStaked, 18);
// ethers.formatUnits(user[5], 18)

//       document.querySelector(".partnerCount").innerText =
//         user.partnercount.toString();

//       document.querySelector(".my_id").innerText =
//         user.id.toString();

//       document.querySelector(".DirectStaked").innerText =
//         ethers.formatUnits(userDetails.DirectStaked, 18);

//       document.querySelector(".myTeamCount").innerText =
//         userDetails.myTeamCount.toString();

//       document.querySelector(".totalTeambuisness").innerText =
//         ethers.formatUnits(userDetails.totalTeambuisness, 18);

//       document.querySelector(".currentBusiness").innerText =
//         ethers.formatUnits(userDetails.myTeambuisness, 18);

//       document.querySelector(".totalLeaderIncome").innerText =
//         ethers.formatUnits(userDetails.totalLeaderIncome, 18);

//       document.querySelector(".totalLeaderRewardIncome").innerText =
//         ethers.formatUnits(userDetails.totalLeaderRewardIncome, 18);

//       document.querySelector(".totalCapitalReturn").innerText =
//         ethers.formatUnits(userDetails.totalCapitalReturn, 18);

//       const locked = await lock.totalLockedForToken(
//         contracts.TOKEN_CONTRACT
//       );
// console.log("User:", user);
// console.log("UserDetails:", userDetails);

//       document.querySelector(".locked_nrx").innerText =
//         ethers.formatUnits(locked, 18) + " NRX";

//       const active = await main.hasActivated(userAddress);

//       document.getElementById("status").innerHTML = active
//         ? 'Account Status: <span style="color:green">Active</span>'
//         : 'Account Status: <span style="color:red">Inactive</span>';

//       const referralLink =
//         window.location.origin + "/register?ref=" + user.referralCode;

//       document.querySelector(".referral-link").value = referralLink;

//       document.querySelector(".copy_ref").onclick = () => {
//         navigator.clipboard.writeText(referralLink);
//         alert("Copied!");
//       };

//     } catch (err) {
//       console.error("Dashboard Error:", err);
//     }
//   };







// const handleStake = async () => {
//   try {
//     const main = await getMainContract(contracts.MAIN_CONTRACT);
//     const usdt = await getUSDTContract(contracts.USDT_CONTRACT);

//     const stakeAmount = document.getElementById("stake_amt").value;
//     const tokenType = document.getElementById("stake_token").value;

//     if (!stakeAmount || stakeAmount <= 0) {
//       alert("Invalid amount");
//       return;
//     }

//     const amount = ethers.parseUnits(stakeAmount, 18);

//     // 1️⃣ Approve USDT
//     const approveTx = await usdt.approve(
//       contracts.MAIN_CONTRACT,
//       amount
//     );
//     await approveTx.wait();

//     // 2️⃣ Stake
//     const stakeTx = await main.stakeTokens(amount, tokenType);
//     await stakeTx.wait();

//     alert("Stake Successful ✅");

//     loadDashboard(); // reload data
//   } catch (err) {
//     console.error(err);
//     alert("Stake Failed");
//   }
// };


// const handleCalculateROI = async () => {
//   try {
//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     const tx = await main.calculateStakingBalance(
//       await main.signer.getAddress()
//     );

//     await tx.wait();

//     alert("ROI Calculated ✅");
//     loadDashboard();

//   } catch (err) {
//     console.error(err);
//     alert("ROI Failed");
//   }
// };


// const handleWithdraw = async () => {
//   try {
//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     const withdrawAmount =
//       document.getElementById("withdraw_amt").value;

//     if (!withdrawAmount || withdrawAmount <= 0) {
//       alert("Invalid amount");
//       return;
//     }

//     const amount = ethers.parseUnits(withdrawAmount, 18);

//     const tx = await main.withdraw(amount, 0);
//     await tx.wait();

//     alert("Withdraw Successful ✅");
//     loadDashboard();

//   } catch (err) {
//     console.error(err);
//     alert("Withdraw Failed");
//   }
// };

//   return (
//   <>
  
// <Header/>

//     <div className="markets-capital pt20 pb40">
//         <div className="container">
            
//             <div className="wrapedStat gradient-border">
//                 <div className="row">
//                     <div className="col-md-6">
//                         <div className="grid-container">   
//                             <div className="grid-item">
//                                 <span>Current Balance</span>
//                                 <br/>
//                                 <b className="fs-20 available_balance">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 available_balance_nrx">Loading..</b>
//                             </div>                         
//                             <div className="grid-item">
//                                 <span>Total Earning</span>
//                                 <br/>
//                                 <b className="fs-20 totalbalance">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalbalance_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Level Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalMiningLevelIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalMiningLevelIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Direct Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalDirectIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalDirectIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Rank Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalRankIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalRankIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item rankDetails">
//                                 <span>Current Rank</span>
//                                 <br/>
//                                 <b className="fs-20 myRank">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leader Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalLeaderIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalLeaderIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Rank</span>
//                                 <br/>
//                                 <b className="fs-20 myLeaderRank">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Reward Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalLeaderRewardIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalLeaderRewardIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Reward Rank</span>
//                                 <br/>
//                                 <b className="fs-20 leaderRewardRank">Loading..</b>
//                             </div>
                       
//                             <div className="grid-item">
//                                 <span>Total Staking Tokens</span>
//                                 <br/>
//                                 <b className="fs-20 staking_tokens">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 staking_nrx">Loading..</b>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <h3 className=" newFont">Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth</h3>
//                         <div className="row">
//                          <div className="col-sm-6">
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Direct Referral <a href="partners.html" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</a>:</div>
                                
//                                 <div className="attr_text partnerCount">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Direct Business :</div>
//                                 <div className="attr_text DirectStaked">-
                                    
//                                 </div>
                                
                               
//                             </div>
                    
                            
//                          </div>

//                          <div className="col-sm-6">
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Team Size <a href="all_level.html" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</a>:</div>
//                                 <div className="attr_text myTeamCount">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Team Business :</div>
//                                 <div className="attr_text totalTeambuisness">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">My ID :</div>
//                                 <div className="attr_text my_id">Loading..</div>
//                             </div>
                           
//                          </div>
//                          <div className="col-sm-7">
//                               <div className="spaceBetween">
//                                 <div className="attr_text" style={{fontSize: "12px"}}>Current Business :</div>
//                                 <div className="attr_text currentBusiness" style={{fontSize: "12px"}}>-</div>
//                               </div>
//                           </div>
//                         </div>
                        
                         

//                         <hr/>
//                         <div className="spaceBetween">
//                             <input className="baseInput referral-link refWidth " readonly=""/>
//                             <span className="base_btn copy_ref">Copy</span>
//                         </div>
                      
//                         <div className="row">
//                          <div className="col-sm-7">
//                             <div className="coin-desc">
                                
                        
//                             </div>
//                          </div>
//                         </div>

//                         <hr/>
//                         <div className="col-sm-12 d-flex justify-content-center">
//                             <div className="coin-desc">
//                                 <div className="grid-container">   
//                                     <div className="grid-item">
                                        

//                                         <span className="fw-bold fs-5">
//                                           <i className="fas fa-crown text-warning"></i> Leader's Reward
//                                         </span>
//                                         <br/>
//                                         <b className="fs-20" id="leaders_reward">Loading...</b>
//                                     </div>
//                                 </div>
                                
//                             </div>
//                         </div>
//                         <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
//                             <h3 className=" newFont"><i className="fas fa-lock locker-icon"></i> NRX Locker</h3>
//                             <div className="d-flex align-items-center gap-4">
//                                 <h6 className="mb-0 p-2">Total NRX Locked :</h6>
//                                 <h6 className="mb-0 p-2 locked_nrx">Loading..</h6>
//                             </div>
//                             <div className="d-flex align-items-center gap-4">
//                                 <h6 className="mb-0 newFont">Contract Link:</h6>
//                                 <a className="mb-0 contract_link" target="_blank">Loading..</a>
//                             </div>
                            
//                             <div className="unlocks "  >
//                                 <a className='connect_btn unlockWallet' href="lock-history.html" style={{ textAlign: "center" }}>View</a>
//                             </div>
//                         </div>

//                     </div>

//                 </div>
               
//             </div>
//             <div className="row"  style={{ marginTop: "45px" }}>
//                 <div className="col-lg-4 col-md-4">
//                     <div className="farms-single-section gradient-border stakeBg" >
//                         <div className="coin-desc">
//                             <div className="coin-desc-left">
//                                 <img src="/images/logo.png" alt="NirmalX"/>
//                             </div>
//                             <div className="coin-desc-right newFont">
//                                 <h4><b id="duration0">Stake Now </b></h4>
//                                 <ul>
//                                     <li className="bg history0 nonSelect" style={{float: "right"}}><a href="stake.html" style={{color:"#ffffff"}}>View History</a></li>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="calculat">
//                          <div className="calculat-left">
//                             <h6>Minimum :</h6>
//                             <h6>Maximum :</h6>
//                             <h6>Current Stake :</h6>
//                          </div>
//                          <div className="calculat-right">
//                             <h6>$ 10</h6>
//                             <h6>Unlimted</h6>
//                             <h6 className="currentStake">Loading..</h6>
//                          </div>                          
//                         </div>
//                         <label for="amount"style={{ marginTop: "0.5rem" }}>Select Package*</label>
//                         <select id="stake_token" className="form-control" >
//                             <option value="1">Staking Package</option>
                           
//                         </select>
//                         <label for="amount"style={{ marginTop: "0.5rem" }}>Amount*</label>
//                         <input type="text" id="stake_amt"placeholder="Enter amount" className="form-control stakeAmount"/>
//                         <h6 id="total_mtx" className="text mt-3"></h6>
//                         <div className="unlocks" >
//                             <a className="connect_btn unlockWallet"  onClick={handleStake}>Submit</a>
//                         </div>
                        
//                     </div>
//                 </div>


//                 <div className="col-lg-4 col-md-4">
//                     <div className="farms-single-section gradient-border stakeBg" >
//                         <div className="coin-desc">
//                             <div className="coin-desc-left">
//                                 <img src="/images/logo.png" alt="NirmalX"/>
//                             </div>
//                             <div className="coin-desc-right newFont">
//                                 <h4><b id="duration0">ROI</b></h4>
//                                 <ul>
//                                     <li className="bg history0 nonSelect" style={{float: "right"}}><a href="staking_calu.html" style={{color:"#ffffff"}}>View History</a></li>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="calculat">
//                          <div className="calculat-left">
//                             <h6>Total ROI :</h6>
//                             <h6>Total Capital Return :</h6>
//                          </div>
//                          <div className="calculat-right">
//                             <h6 className="totalROI">Loading..</h6>
//                             <h6 className="totalCapitalReturn">Loading..</h6>
//                          </div>  
                         
                         
//                         </div>
                       
//                         <div className="form-control stakeAmount" style={{ background: "none", border: "none" }}></div>
                      
//                         <div className="unlocks "  style={{ marginTop: "9.9rem" }} id="mine_now">
//                             <a className='connect_btn unlockWallet' id="calculate_roi_btn"  onClick={handleCalculateROI} style={{textAalign: "center"}}>Calculate ROI</a>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-4 col-md-4">
//                     <div className="farms-single-section gradient-border stakeBg" >
//                         <div className="coin-desc">
//                             <div className="coin-desc-left">
//                                 <img src="/images/logo.png" alt="NirmalX"/>
//                             </div>
//                             <div className="coin-desc-right newFont">
//                                 <h4><b id="duration0">Withdraw</b></h4>
//                                 <ul>
//                                     <li className="bg history0 nonSelect" style={{float: "right"}}><a href="withdraw.html" style={{color:"#ffffff"}}>View History</a></li>
//                                 </ul>
//                             </div>
//                         </div>
                        
//                         <div className="calculat">
//                          <div className="calculat-left">
                            
//                             <h6>Withdrawable Amount:</h6>
//                             <h6>Total Withdraw :</h6>

//                          </div>
//                          <div className="calculat-right">
                            
//                             <h6 className="withdrawable_amount">Loading..</h6>
//                             <h6 className="total_withdraw">Loading..</h6>
//                          </div>
//                         </div>
                     
//                         <label for="amount" style={{marginTop:"7rem"}}>Amount*</label>
//                         <input type="text" id="withdraw_amt"placeholder="Enter amount" className="form-control withdrawAmount" onkeyup="show_price('withdraw',this)"/>
//                         <h6 id="total_bbt" className="text mt-3"></h6>
                       
//                         <div className="unlocks " >
//                             <a className='connect_btn unlockWallet' id="withdraw_btn"   onClick={handleWithdraw} style={{ textAlign: "center" }}> Withdraw </a>
//                         </div>
//                     </div>
//                 </div>
              
                    
//                 </div>
//             </div>
//         </div>


//         {/* </div> */}
//     {/* </div> */}

//       <div id="Error" className="zoom-anim-dialog mfp-hide modal textBlack">
//         <button className="modal__close" type="button" >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path
//                     d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z">
//                 </path>
//             </svg>
//         </button>
//         <span className="modal__text" id="val_err"></span>
//     </div>



//   </>
//   )
// }

// export default Dashboard






































import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/user/Header";
import { ethers } from "ethers";
import {
  getMainContract,
  getTokenContract,
  getLockContract,
  getUSDTContract,
  getSigner
} from "../utils/contract";

function Dashboard() {
  const { userId } = useParams();
  const { contracts } = useSelector((state) => state.wallet);
  const [dashboard, setDashboard] = useState({});
const [accountData, setAccountData] = useState({
  currentStake: 0,
  currentStakeNRX: 0,
  totalROI: 0,
  totalROINRX: 0,
  totalCapitalReturn: 0,
  totalCapitalReturnNRX: 0,
  withdrawable: 0,
  withdrawableNRX: 0,
  totalWithdraw: 0,
  totalWithdrawNRX: 0,
});
  useEffect(() => {
    if (!userId) return;
    loadDashboard();
  }, [userId]);

  /* ================= NRX PRICE ================= */

  const getNRXPrice = async () => {
    const main = await getMainContract(contracts.MAIN_CONTRACT);
    const one = ethers.parseUnits("1", 18);
    const price = await main.getTokenToUSDT(one);
    return Number(ethers.formatUnits(price, 18));
  };

  /* ================= TEAM STAKING ================= */


  const getTotalStakingByTeam = async (account) => {
    const main = await getMainContract(contracts.MAIN_CONTRACT);

    const isUserExists = await main.isUserExists(account);
    if (!isUserExists) {
      toast.error("User does not exist");
      return 0n;
    }

    const partners = await main.partners(account);
    let totalType2 = 0n;

    for (let partner of partners) {
      const stakingArray =
        await main.getUserStakingTransactions(partner);

      if (!Array.isArray(stakingArray)) continue;

      for (let staking of stakingArray) {
        const amount =
          staking.tokenAmount ?? staking[3] ?? 0n;

        const type =
          staking.stakeType ?? staking[4] ?? 0;

        if (Number(type) === 2) {
          totalType2 += amount;
        }
      }
    }

    return totalType2;
  };




// const getTotalStakingByTeam = async (account) => {
//   const main = await getMainContract(contracts.MAIN_CONTRACT);

//   const allPartners = await getAllPartnersRecursive(account, main);

//   let totalType2 = 0n;

//   for (let partner of allPartners) {
//     const stakingArray =
//       await main.getUserStakingTransactions(partner);

//     for (let staking of stakingArray) {
//       const amount =
//         staking.tokenAmount ?? staking[3] ?? 0n;

//       const type =
//         staking.stakeType ?? staking[4] ?? 0;

//       if (Number(type) === 2) {
//         totalType2 += amount;
//       }
//     }
//   }

//   return totalType2;
// };







  /* ================= LOAD DASHBOARD ================= */

  const loadDashboard = async () => {
    try {
      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const token = await getTokenContract(contracts.TOKEN_CONTRACT);
      const lock = await getLockContract(contracts.LOCK_CONTRACT);

      const userAddress = await main.idToAddress(userId);

      if (!userAddress || userAddress === ethers.ZeroAddress) {
        toast.error("Invalid User");
        return;
      }

      const user = await main.users(userAddress);
      const userDetails = await main.user_details(userAddress);

      const nrx_value = await getNRXPrice();


      /* ===== AVAILABLE BALANCE ===== */
      const available_balance =
        Number(ethers.formatUnits(user.balance, 18));

      const available_balance_nrx =
        available_balance / nrx_value;

      document.querySelector(".available_balance").innerText =
        "$ " + available_balance.toFixed(4);

      document.querySelector(".available_balance_nrx").innerText =
        "( NRX " + available_balance_nrx.toFixed(4) + " )";

      /* ===== TOTAL EARNING ===== */
      const totalbalance =
        Number(ethers.formatUnits(user.totalbalance, 18));

      const totalbalance_nrx =
        totalbalance / nrx_value;

      document.querySelector(".totalbalance").innerText =
        "$ " + totalbalance.toFixed(4);

      document.querySelector(".totalbalance_nrx").innerText =
        "( NRX " + totalbalance_nrx.toFixed(4) + " )";

      /* ===== INCOME ===== */
      const totalMiningLevelIncome =
        Number(
          ethers.formatUnits(
            user.totalMiningLevelIncome,
            18
          )
        );

      document.querySelector(".totalMiningLevelIncome").innerText =
        "$ " + totalMiningLevelIncome.toFixed(4);

      const totalDirectIncome =
        Number(
          ethers.formatUnits(
            user.totalDirectIncome,
            18
          )
        );

      document.querySelector(".totalDirectIncome").innerText =
        "$ " + totalDirectIncome.toFixed(4);

      const totalRankIncome =
        Number(
          ethers.formatUnits(
            user.totalRankIncome,
            18
          )
        );

      document.querySelector(".totalRankIncome").innerText =
        "$ " + totalRankIncome.toFixed(4);

      /* ===== TEAM STAKING (IMPORTANT) ===== */
      const teamStakingRaw =
        await getTotalStakingByTeam(userAddress);

      const stakingUSD =
        Number(
          ethers.formatUnits(teamStakingRaw, 18)
        );

      const stakingNRX =
        stakingUSD / nrx_value;

      document.querySelector(".staking_tokens").innerText =
        "$ " + stakingUSD.toFixed(4);

      document.querySelector(".staking_nrx").innerText =
        "( NRX " + stakingNRX.toFixed(4) + " )";

      /* ===== TEAM INFO ===== */
      document.querySelector(".partnerCount").innerText =
        user.partnercount.toString();

      document.querySelector(".my_id").innerText =
        user.referralCode;

      document.querySelector(".DirectStaked").innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.DirectStaked,
            18
          )
        ).toFixed(4);

      document.querySelector(".myTeamCount").innerText =
        userDetails.myTeamCount.toString();

      document.querySelector(".totalTeambuisness").innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.totalTeambuisness,
            18
          )
        ).toFixed(4);

      document.querySelector(".currentBusiness").innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.myTeambuisness,
            18
          )
        ).toFixed(4);

      /* ===== LEADER INCOME ===== */
      document.querySelector(".totalLeaderIncome").innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.totalLeaderIncome,
            18
          )
        ).toFixed(4);

      document.querySelector(
        ".totalLeaderRewardIncome"
      ).innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.totalLeaderRewardIncome,
            18
          )
        ).toFixed(4);

      document.querySelector(".totalCapitalReturn").innerText =
        "$ " +
        Number(
          ethers.formatUnits(
            userDetails.totalCapitalReturn,
            18
          )
        ).toFixed(4);

      /* ===== LOCKED NRX ===== */
      const locked =
        await lock.totalLockedForToken(
          contracts.TOKEN_CONTRACT
        );

      document.querySelector(".locked_nrx").innerText =
        ethers.formatUnits(locked, 18) +
        " NRX";

      /* ===== ACCOUNT STATUS ===== */
      const totalStaked =
        Number(
          ethers.formatUnits(
            user.totalStaked,
            18
          )
        );

      document.getElementById("status").innerHTML =
        totalStaked >= 125
          ? 'Account Status: <span style="color:green">Active</span>'
          : 'Account Status: <span style="color:red">Inactive</span>';





// new code 
// ===== STAKE DATA =====

const currentStake =
  Number(ethers.formatUnits(user.totalCurrentStaked, 18));

const currentStakeNRX = currentStake / nrx_value;

// ===== ROI DATA =====

const totalROI =
  Number(ethers.formatUnits(user.totalROI, 18));

const totalROINRX = totalROI / nrx_value;

// ===== CAPITAL RETURN =====

const totalCapitalReturn =
  Number(
    ethers.formatUnits(
      userDetails.totalCapitalReturn,
      18
    )
  );

const totalCapitalReturnNRX =
  totalCapitalReturn / nrx_value;

// ===== WITHDRAW =====

const totalWithdrawRaw =
  await main._amountWithdrawn(userAddress);

const totalWithdraw =
  Number(ethers.formatUnits(totalWithdrawRaw, 18));

const totalWithdrawNRX =
  totalWithdraw / nrx_value;

const withdrawable = available_balance;
const withdrawableNRX = available_balance_nrx;

setAccountData({
  currentStake,
  currentStakeNRX,
  totalROI,
  totalROINRX,
  totalCapitalReturn,
  totalCapitalReturnNRX,
  withdrawable,
  withdrawableNRX,
  totalWithdraw,
  totalWithdrawNRX
});
/* ===== REFERRAL LINK ===== */

const referralLink =
  window.location.origin +
  "/register?ref=" +
  user.referralCode;

const refInput =
  document.querySelector(".referral-link");

if (refInput) {
  refInput.value = referralLink;
}

const copyBtn =
  document.querySelector(".copy_ref");

if (copyBtn) {
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied Successfully");
  };
}
/* ===== CONTRACT LINK ===== */

const contractLink =
  "https://bscscan.com/address/" +
  contracts.LOCK_CONTRACT;

const contractEl =
  document.querySelector(".contract_link");

if (contractEl) {
  contractEl.href = contractLink;
  contractEl.innerText =
    contracts.LOCK_CONTRACT.slice(0, 6) +
    "..." +
    contracts.LOCK_CONTRACT.slice(-4);
}


// end 





    } catch (err) {
      console.error(err);
      toast.error("Dashboard Load Failed");
    }
  };




const handleStake = async () => {
  try {
    const signer = await getSigner();
    const main = await getMainContract(contracts.MAIN_CONTRACT);

    const amountInput =
      document.getElementById("stake_amt").value;

    const amount = ethers.parseUnits(amountInput, 18);

    const tx = await main
      .connect(signer)
      .stakeTokens(amount, 1);

    await tx.wait();

    toast.success("Stake Successful");
    loadDashboard();
  } catch (err) {
    console.error(err);
    toast.error("Stake Failed");
  }
};



const handleWithdraw = async () => {
  try {
    const signer = await getSigner();
    const main = await getMainContract(contracts.MAIN_CONTRACT);

    const amountInput =
      document.getElementById("withdraw_amt").value;

    const amount = ethers.parseUnits(amountInput, 18);

    const tx = await main
      .connect(signer)
      .withdraw(amount, 0);

    await tx.wait();

    toast.success("Withdraw Successful");
    loadDashboard();
  } catch (err) {
    console.error(err);
    toast.error("Withdraw Failed");
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
                                <span>Current Balance</span>
                                <br/>
                                <b className="fs-20 available_balance">Loading..</b>
                                <br/>
                                <b className="fs-10 available_balance_nrx">Loading..</b>
                            </div>                         
                            <div className="grid-item">
                                <span>Total Earning</span>
                                <br/>
                                <b className="fs-20 totalbalance">Loading..</b>
                                <br/>
                                <b className="fs-10 totalbalance_nrx">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Level Income</span>
                                <br/>
                                <b className="fs-20 totalMiningLevelIncome">Loading..</b>
                                <br/>
                                <b className="fs-10 totalMiningLevelIncome_nrx">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Direct Income</span>
                                <br/>
                                <b className="fs-20 totalDirectIncome">Loading..</b>
                                <br/>
                                <b className="fs-10 totalDirectIncome_nrx">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Rank Income</span>
                                <br/>
                                <b className="fs-20 totalRankIncome">Loading..</b>
                                <br/>
                                <b className="fs-10 totalRankIncome_nrx">Loading..</b>
                            </div>
                            <div className="grid-item rankDetails">
                                <span>Current Rank</span>
                                <br/>
                                <b className="fs-20 myRank">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Leader Income</span>
                                <br/>
                                <b className="fs-20 totalLeaderIncome">Loading..</b>
                                <br/>
                                <b className="fs-10 totalLeaderIncome_nrx">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Leadership Rank</span>
                                <br/>
                                <b className="fs-20 myLeaderRank">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Leadership Reward Income</span>
                                <br/>
                                <b className="fs-20 totalLeaderRewardIncome">Loading..</b>
                                <br/>
                                <b className="fs-10 totalLeaderRewardIncome_nrx">Loading..</b>
                            </div>
                            <div className="grid-item">
                                <span>Leadership Reward Rank</span>
                                <br/>
                                <b className="fs-20 leaderRewardRank">Loading..</b>
                            </div>
                       
                            <div className="grid-item">
                                <span>Total Staking Tokens</span>
                                <br/>
                                <b className="fs-20 staking_tokens">Loading..</b>
                                <br/>
                                <b className="fs-10 staking_nrx">Loading..</b>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h3 className=" newFont">Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth</h3>
                        <div className="row">
                         <div className="col-sm-6">
                            <div className="spaceBetween">
                                <div className="attr_text">Total Direct Referral <a href="partners.html" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</a>:</div>
                                
                                <div className="attr_text partnerCount">-</div>
                            </div>
                            <div className="spaceBetween">
                                <div className="attr_text">Total Direct Business :</div>
                                <div className="attr_text DirectStaked">-
                                    
                                </div>
                                
                               
                            </div>
                    
                            
                         </div>

                         <div className="col-sm-6">
                            <div className="spaceBetween">
                                <div className="attr_text">Total Team Size <a href="all_level.html" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</a>:</div>
                                <div className="attr_text myTeamCount">-</div>
                            </div>
                            <div className="spaceBetween">
                                <div className="attr_text">Total Team Business :</div>
                                <div className="attr_text totalTeambuisness">-</div>
                            </div>
                            <div className="spaceBetween">
                                <div className="attr_text">My ID :</div>
                                <div className="attr_text my_id">Loading..</div>
                            </div>
                           
                         </div>
                         <div className="col-sm-7">
                              <div className="spaceBetween">
                                <div className="attr_text" style={{fontSize: "12px"}}>Current Business :</div>
                                <div className="attr_text currentBusiness" style={{fontSize: "12px"}}>-</div>
                              </div>
                          </div>
                        </div>
                        
                         

                        <hr/>
                        <div className="spaceBetween">
                            <input className="baseInput referral-link refWidth" readOnly />
                            <span className="base_btn copy_ref">Copy</span>
                        </div>
                      
                        <div className="row">
                         <div className="col-sm-7">
                            <div className="coin-desc">
                                
                        
                            </div>
                         </div>
                        </div>

                        <hr/>
                        <div className="col-sm-12 d-flex justify-content-center">
                            <div className="coin-desc">
                                <div className="grid-container">   
                                    <div className="grid-item">
                                        

                                        <span className="fw-bold fs-5">
                                          <i className="fas fa-crown text-warning"></i> Leader's Reward
                                        </span>
                                        <br/>
                                        <b className="fs-20" id="leaders_reward">Loading...</b>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
                            <h3 className=" newFont"><i className="fas fa-lock locker-icon"></i> NRX Locker</h3>
                            <div className="d-flex align-items-center gap-4">
                                <h6 className="mb-0 p-2">Total NRX Locked :</h6>
                                <h6 className="mb-0 p-2 locked_nrx">Loading..</h6>
                            </div>
                            <div className="d-flex align-items-center gap-4">
                                <h6 className="mb-0 newFont">Contract Link:</h6>
                                <a className="mb-0 contract_link" target="_blank">Loading..</a>
                            </div>
                            
                            <div className="unlocks "  >
                                <a className='connect_btn unlockWallet' href="lock-history.html" style={{ textAlign: "center" }}>View</a>
                            </div>
                        </div>

                    </div>

                </div>
               
            </div>
            <div className="row"  style={{ marginTop: "45px" }}>
                <div className="col-lg-4 col-md-4">
                    <div className="farms-single-section gradient-border stakeBg" >
                        <div className="coin-desc">
                            <div className="coin-desc-left">
                                <img src="/images/logo.png" alt="NirmalX"/>
                            </div>
                            <div className="coin-desc-right newFont">
                                <h4><b id="duration0">Stake Now </b></h4>
                                <ul>
                                    <li className="bg history0 nonSelect" style={{float: "right"}}><a href="stake.html" style={{color:"#ffffff"}}>View History</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="calculat">
                         <div className="calculat-left">
                            <h6>Minimum :</h6>
                            <h6>Maximum :</h6>
                            <h6>Current Stake :</h6>
                         </div>
                         <div className="calculat-right">
                            <h6>$ 10</h6>
                            <h6>Unlimted</h6>
                            <h6>
  $ {accountData.currentStake.toFixed(4)}
  <span style={{ fontSize: "11px" }}>
    {" "}
    ( NRX {accountData.currentStakeNRX.toFixed(4)} )
  </span>
</h6>
                         </div>                          
                        </div>
                        <label for="amount"style={{ marginTop: "0.5rem" }}>Select Package*</label>
                        <select id="stake_token" className="form-control" >
                            <option value="1">Staking Package</option>
                           
                        </select>
                        <label for="amount"style={{ marginTop: "0.5rem" }}>Amount*</label>
                        <input type="text" id="stake_amt"placeholder="Enter amount" className="form-control stakeAmount"/>
                        <h6 id="total_mtx" className="text mt-3"></h6>
                        <div className="unlocks" >
                            <a className="connect_btn unlockWallet" onClick={handleStake} >Submit</a>
                        </div>
                        
                    </div>
                </div>


                <div className="col-lg-4 col-md-4">
                    <div className="farms-single-section gradient-border stakeBg" >
                        <div className="coin-desc">
                            <div className="coin-desc-left">
                                <img src="/images/logo.png" alt="NirmalX"/>
                            </div>
                            <div className="coin-desc-right newFont">
                                <h4><b id="duration0">ROI</b></h4>
                                <ul>
                                    <li className="bg history0 nonSelect" style={{float: "right"}}><a href="staking_calu.html" style={{color:"#ffffff"}}>View History</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="calculat">
                         <div className="calculat-left">
                            <h6>Total ROI :</h6>
                            <h6>Total Capital Return :</h6>
                         </div>
                         <div className="calculat-right">
                            <h6>
  $ {accountData.totalROI.toFixed(4)}
  <span style={{ fontSize: "11px" }}>
    {" "}
    ( NRX {accountData.totalROINRX.toFixed(4)} )
  </span>
</h6>
                            <h6>
  $ {accountData.totalCapitalReturn.toFixed(4)}
  <span style={{ fontSize: "11px" }}>
    {" "}
    ( NRX {accountData.totalCapitalReturnNRX.toFixed(4)} )
  </span>
</h6>
                         </div>  
                         
                         
                        </div>
                       
                        <div className="form-control stakeAmount" style={{ background: "none", border: "none" }}></div>
                      
                        <div className="unlocks "  style={{ marginTop: "9.9rem" }} id="mine_now">
                            <a className='connect_btn unlockWallet' id="calculate_roi_btn"  style={{textAalign: "center"}}>Calculate ROI</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4">
                    <div className="farms-single-section gradient-border stakeBg" >
                        <div className="coin-desc">
                            <div className="coin-desc-left">
                                <img src="/images/logo.png" alt="NirmalX"/>
                            </div>
                            <div className="coin-desc-right newFont">
                                <h4><b id="duration0">Withdraw</b></h4>
                                <ul>
                                    <li className="bg history0 nonSelect" style={{float: "right"}}><a href="withdraw.html" style={{color:"#ffffff"}}>View History</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="calculat">
                         <div className="calculat-left">
                            
                            <h6>Withdrawable Amount:</h6>
                            <h6>Total Withdraw :</h6>

                         </div>
                         <div className="calculat-right">
                            
                            <h6>
  $ {accountData.withdrawable.toFixed(4)}
  <span style={{ fontSize: "11px" }}>
    {" "}
    ( NRX {accountData.withdrawableNRX.toFixed(4)} )
  </span>
</h6>
                            <h6>
  $ {accountData.totalWithdraw.toFixed(4)}
  <span style={{ fontSize: "11px" }}>
    {" "}
    ( NRX {accountData.totalWithdrawNRX.toFixed(4)} )
  </span>
</h6>
                         </div>
                        </div>
                     
                        <label for="amount" style={{marginTop:"7rem"}}>Amount*</label>
                        <input type="text" id="withdraw_amt"placeholder="Enter amount" className="form-control withdrawAmount" onkeyup="show_price('withdraw',this)"/>
                        <h6 id="total_bbt" className="text mt-3"></h6>
                       
                        <div className="unlocks " >
                            <a className='connect_btn unlockWallet' id="withdraw_btn"   onClick={handleWithdraw}  style={{ textAlign: "center" }}> Withdraw </a>
                        </div>
                    </div>
                </div>
              
                    
                </div>
            </div>
        </div>


        {/* </div> */}
    {/* </div> */}

      <div id="Error" className="zoom-anim-dialog mfp-hide modal textBlack">
        <button className="modal__close" type="button" >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z">
                </path>
            </svg>
        </button>
        <span className="modal__text" id="val_err"></span>
    </div>



    </>
  );
}

export default Dashboard;