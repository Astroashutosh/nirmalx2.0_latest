// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { getLockContract } from "../utils/contract";
// import { useSelector } from "react-redux";

// function LockHistory() {
//   const { contracts } = useSelector((state) => state.wallet);

//   const [locks, setLocks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (contracts?.LOCK_CONTRACT) {
//       getLocks();
//     }
//   }, [contracts]);

//   const getLocks = async () => {
//     try {
//       setLoading(true);

//       const lockContract = await getLockContract(
//         contracts.LOCK_CONTRACT
//       );

//       const latestLockId =
//         await lockContract.latestLockId();

//       let allLocks = [];

//       for (let i = 1; i <= Number(latestLockId); i++) {
//         const lock = await lockContract.locks(i);

//         const amount = Number(
//           ethers.formatUnits(lock.amount, 18)
//         );

//         const releaseTime =
//           Number(lock.releaseTime) * 1000;

//         allLocks.push({
//           id: i,
//           amount,
//           locker: lock.locker,
//           releaseTime,
//           withdrawn: lock.withdrawn,
//           description: lock.meta || "-",
//         });
//       }

//       setLocks(allLocks);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching locked history:", error);
//       setLoading(false);
//     }
//   };

//   /* ================= COUNTDOWN ================= */

//   const getRemainingTime = (releaseTime) => {
//     const now = Date.now();
//     const diff = releaseTime - now;

//     if (diff <= 0) return "Unlocked";

//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (diff / (1000 * 60 * 60)) % 24
//     );
//     const minutes = Math.floor(
//       (diff / (1000 * 60)) % 60
//     );
//     const seconds = Math.floor(
//       (diff / 1000) % 60
//     );

//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   };

//   /* auto refresh every second */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLocks((prev) => [...prev]);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="transaction-container">
//       <div className="float-left">
//         <h2>Locked History</h2>
//       </div>

//       <div className="table-responsive">
//         <table
//           className="table transaction-table"
//           style={{ color: "#ffffff" }}
//         >
//           <thead>
//             <tr>
//               <th>S/No.</th>
//               <th>Amount</th>
//               <th>Locker</th>
//               <th>Release Time</th>
//               <th>Withdrawn</th>
//               <th>Description</th>
//               <th>Unlock Time</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="7">
//                   Loading locked history...
//                 </td>
//               </tr>
//             ) : locks.length === 0 ? (
//               <tr>
//                 <td colSpan="7">
//                   No locks found
//                 </td>
//               </tr>
//             ) : (
//               locks.map((lock) => (
//                 <tr key={lock.id}>
//                   <td>{lock.id}</td>

//                   <td>
//                     {lock.amount.toLocaleString()} NRX
//                   </td>

//                   <td>
//                     <a
//                       href={`https://bscscan.com/address/${lock.locker}`}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {lock.locker.substring(0, 6)}
//                       ...
//                       {lock.locker.substring(
//                         lock.locker.length - 4
//                       )}
//                     </a>
//                   </td>

//                   <td>
//                     {new Date(
//                       lock.releaseTime
//                     ).toLocaleString()}
//                   </td>

//                   <td>
//                     {lock.withdrawn ? "Yes" : "No"}
//                   </td>

//                   <td>{lock.description}</td>

//                   <td>
//                     {getRemainingTime(
//                       lock.releaseTime
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default LockHistory;






import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { getLockContract } from "../utils/contract";
import { useSelector } from "react-redux";

function LockHistory() {
  const { contracts } = useSelector((state) => state.wallet);

  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  /* ================= FETCH LOCKS ================= */

  const fetchLocks = useCallback(async () => {
    try {
      setLoading(true);

      const lockContract = await getLockContract(
        contracts.LOCK_CONTRACT
      );

      const latestLockId =
        Number(await lockContract.latestLockId());

      if (!latestLockId) {
        setLocks([]);
        setLoading(false);
        return;
      }

      /* 🔥 PARALLEL FETCH (Much Faster than PHP loop) */
      const lockPromises = [];

      for (let i = 1; i <= latestLockId; i++) {
        lockPromises.push(lockContract.locks(i));
      }

      const lockResults = await Promise.all(lockPromises);

      const formattedLocks = lockResults.map((lock, index) => ({
        id: index + 1,
        amount: Number(ethers.formatUnits(lock.amount, 18)),
        locker: lock.locker,
        releaseTime: Number(lock.releaseTime) * 1000,
        withdrawn: lock.withdrawn,
        description: lock.meta || "-",
      }));

      setLocks(formattedLocks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locked history:", error);
      setLoading(false);
    }
  }, [contracts]);

  useEffect(() => {
    if (contracts?.LOCK_CONTRACT) {
      fetchLocks();
    }
  }, [contracts, fetchLocks]);

  /* ================= GLOBAL TIMER (PHP EXACT) ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getCountdown = (endTime) => {
    let distance = endTime - currentTime;

    if (distance <= 0) return "Unlocked";

    let seconds = Math.floor(distance / 1000);

    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds -= years * 365 * 24 * 60 * 60;

    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds -= months * 30 * 24 * 60 * 60;

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;

    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="transaction-container">
      <div className="float-left">
        <h2>Locked History</h2>
      </div>

      <div className="table-responsive">
        <table
          className="table transaction-table"
          style={{ color: "#ffffff" }}
        >
          <thead>
            <tr>
              <th>S/No.</th>
              <th>Amount</th>
              <th>Locker</th>
              <th>Release Time</th>
              <th>Withdrawn</th>
              <th>Description</th>
              <th>Unlock Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : locks.length === 0 ? (
              <tr>
                <td colSpan="7">No locks found</td>
              </tr>
            ) : (
              locks.map((lock) => (
                <tr key={lock.id}>
                  <td>{lock.id}</td>

                  <td>
                    {lock.amount.toLocaleString()} NRX
                  </td>

                  <td>
                    <a
                      href={`https://bscscan.com/address/${lock.locker}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#0b06fa" }}
                    >
                      {lock.locker.substring(0, 6)}
                      ...
                      {lock.locker.substring(
                        lock.locker.length - 4
                      )}
                    </a>
                  </td>

                  <td>
                    {new Date(lock.releaseTime).toLocaleString()}
                  </td>

                  <td>{lock.withdrawn ? "Yes" : "No"}</td>

                  <td>{lock.description}</td>

                  <td>{getCountdown(lock.releaseTime)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LockHistory;