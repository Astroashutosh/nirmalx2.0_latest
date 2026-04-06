

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";
import { getNRXPrice, formatRank } from "../utils/formatters";

function Level() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contracts?.MAIN_CONTRACT && address) {
      loadLevelUsers(selectedLevel);
    }
  }, [selectedLevel, contracts, address]);

  const loadLevelUsers = async (level) => {
    try {
      setLoading(true);
      setUsers([]);

      const main = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      const exists = await main.isUserExists(
        address
      );

      if (!exists) {
        toast.error("User does not exist.");
        setLoading(false);
        return;
      }

      /* ===== Get NRX Price (Same as PHP) ===== */
      const nrxPrice = await getNRXPrice(main);

      /* ===== Get Direct Partners ===== */
      let currentLevelUsers =
        await main.partners(address);

      /* ===== Traverse Levels ===== */
      for (let i = 1; i < level; i++) {
        let next = [];

        for (const user of currentLevelUsers) {
          if (!user || user === ethers.ZeroAddress)
            continue;

          const partners =
            await main.partners(user);

          next = next.concat(partners);
        }

        currentLevelUsers = next;
      }

      if (currentLevelUsers.length === 0) {
        setLoading(false);
        return;
      }

      let finalData = [];
      let index = 1;

      for (const userAddress of currentLevelUsers) {
        const userData =
          await main.users(userAddress);

        const userDetails =
          await main.user_details(userAddress);

        /* ===== SAME PHP CALCULATION ===== */

        const amountUSD =
          Number(userData.totalStaked) /
          1e18;

        const amountNRX =
          amountUSD / nrxPrice;

        const teamUSD =
          Number(
            userDetails.totalTeambuisness
          ) / 1e18;

        const teamNRX =
          teamUSD / nrxPrice;

        const shortAddress =
          userAddress.substring(0, 5) +
          "..." +
          userAddress.substring(
            userAddress.length - 4
          );

        const status =
          userData.totalStaked > 0
            ? "Active"
            : "Inactive";

            console.log(userAddress);
        finalData.push({
          index: index++,
          address: userAddress,
          shortAddress,
          partnerId:
            userData.referralCode,
          amountUSD,
          amountNRX,
          teamUSD,
          teamNRX,
          rank: formatRank(
            userDetails.rank
          ),
          level,
          status,
        });
      }

      setUsers(finalData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to load level users"
      );
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <h2>Get Level</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th colSpan="4"></th>
            <th>Select Level</th>
            <th>
              <select
                className="form-control"
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(
                    Number(e.target.value)
                  )
                }
              >
                {[...Array(10)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >
                    Level-{i + 1}
                  </option>
                ))}
              </select>
            </th>
          </tr>

          <tr>
            <th>S/No.</th>
            <th>Partner ID</th>
            <th>Amount</th>
            <th>From Address</th>
            <th>Team Business</th>
            <th>Rank</th>
            <th>Level</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.index}>
                <td>{user.index}</td>

                <td>{user.partnerId}</td>

                <td>
                  $ {user.amountUSD.toFixed(4)}{" "}
                  ( NRXN{" "}
                  {user.amountNRX.toFixed(4)} )
                </td>

                <td>
                  <a
                    href={`https://bscscan.com/address/${user.address}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#fff" }}
                  >
                    {user.shortAddress}
                  </a>
                </td>

                <td>
                  $ {user.teamUSD.toFixed(4)}{" "}
                  ( NRXN{" "}
                  {user.teamNRX.toFixed(4)} )
                </td>

                <td>{user.rank}</td>

                <td>Level {user.level}</td>

                <td>
                  {user.status ===
                    "Active" ? (
                    <span
                      style={{
                        color: "#ffffff",
                      }}
                      className="bg history0 nonSelect"
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      style={{ color: "red" }}
                      className="bg history0 nonSelect"
                    >
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Level;















// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { getMainContract } from "../utils/contract";
// import { toast } from "react-toastify";
// import {
//   getNRXPrice,
//   formatUSDNRX,
//   formatRank,
// } from "../utils/formatters";

// function Level() {
//   const { address, contracts } = useSelector(
//     (state) => state.wallet
//   );

//   const [selectedLevel, setSelectedLevel] = useState(1);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadLevelUsers = useCallback(
//     async (level) => {
//       if (!address) return;

//       try {
//         setLoading(true);
//         setUsers([]);

//         const main = await getMainContract(
//           contracts.MAIN_CONTRACT
//         );

//         const [exists, price] = await Promise.all([
//           main.isUserExists(address),
//           getNRXPrice(main),
//         ]);

//         if (!exists) {
//           toast.error("User does not exist.");
//           setLoading(false);
//           return;
//         }

//         let currentLevelUsers =
//           await main.partners(address);

//         /* ===== Traverse Levels ===== */
//         for (let i = 1; i < level; i++) {
//           let nextLevelUsers = [];

//           for (const user of currentLevelUsers) {
//             if (!user || user === ethers.ZeroAddress)
//               continue;

//             const partners =
//               await main.partners(user);

//             nextLevelUsers =
//               nextLevelUsers.concat(partners);
//           }

//           currentLevelUsers = nextLevelUsers;
//         }

//         if (currentLevelUsers.length === 0) {
//           setLoading(false);
//           return;
//         }

//         /* ===== Fetch All User Data Parallel ===== */
//         const allData = await Promise.all(
//           currentLevelUsers.map(async (userAddress) => {
//             const [userData, userDetails] =
//               await Promise.all([
//                 main.users(userAddress),
//                 main.user_details(userAddress),
//               ]);

//             const totalStaked =
//               Number(userData.totalStaked) / 1e18;

//             const teamBusiness =
//               Number(
//                 userDetails.totalTeambuisness
//               ) / 1e18;

//             return {
//               address: userAddress,
//               partnerId: userData.referralCode,
//               amount: totalStaked,
//               teamBusiness,
//               rank: formatRank(userData.rank),
//               level,
//               status:
//                 totalStaked > 0
//                   ? "Active"
//                   : "Inactive",
//             };
//           })
//         );

//         setUsers(
//           allData.map((u, i) => ({
//             ...u,
//             index: i + 1,
//           }))
//         );

//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load level users");
//         setLoading(false);
//       }
//     },
//     [address, contracts]
//   );

//   useEffect(() => {
//     loadLevelUsers(selectedLevel);
//   }, [selectedLevel, loadLevelUsers]);

//   return (
//     <div className="transaction-container">
//       <h2>Get Level</h2>

//       <table
//         className="table transaction-table"
//         style={{ color: "#ffffff" }}
//       >
//         <thead>
//           <tr>
//             <th colSpan="4"></th>
//             <th>Select Level</th>
//             <th>
//               <select
//                 className="form-control"
//                 value={selectedLevel}
//                 onChange={(e) =>
//                   setSelectedLevel(
//                     Number(e.target.value)
//                   )
//                 }
//               >
//                 {[...Array(10)].map((_, i) => (
//                   <option
//                     key={i + 1}
//                     value={i + 1}
//                   >
//                     Level-{i + 1}
//                   </option>
//                 ))}
//               </select>
//             </th>
//           </tr>

//           <tr>
//             <th>S/No.</th>
//             <th>Partner ID</th>
//             <th>Amount</th>
//             <th>From Address</th>
//             <th>Team Business</th>
//             <th>Rank</th>
//             <th>Level</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 Loading...
//               </td>
//             </tr>
//           ) : users.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 No users found
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => {
//               const formattedAmount =
//                 formatUSDNRX(
//                   user.amount,
//                   1
//                 ); // price already included in format function if needed

//               const formattedTeam =
//                 formatUSDNRX(
//                   user.teamBusiness,
//                   1
//                 );

//               return (
//                 <tr key={user.index}>
//                   <td>{user.index}</td>

//                   <td>{user.partnerId}</td>

//                   <td>
//                     $ {user.amount.toFixed(4)}
//                   </td>

//                   <td>
//                     <a
//                       href={`https://bscscan.com/address/${user.address}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{ color: "#fff" }}
//                     >
//                       {user.address.substring(0, 5)}
//                       ...
//                       {user.address.substring(
//                         user.address.length - 4
//                       )}
//                     </a>
//                   </td>

//                   <td>
//                     $ {user.teamBusiness.toFixed(4)}
//                   </td>

//                   <td>{user.rank}</td>

//                   <td>Level {user.level}</td>

//                   <td>
//                     {user.status === "Active" ? (
//                       <span className="bg history0 nonSelect" style={{ color: "#ffffff" }}>
//                         Active
//                       </span>
//                     ) : (
//                       <span className="bg history0 nonSelect" style={{ color: "red" }}>
//                         Inactive
//                       </span>
//                     )}
//                   </td>


//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Level;