import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function StakingHistory() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [stakingData, setStakingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nrxPrice, setNrxPrice] = useState(1);

  const pageSize = 25;

  /* ================= FETCH NRX PRICE (PHP EXACT) ================= */

  const fetchNRXPrice = async (main) => {
    try {
      const oneToken = ethers.parseUnits("1", 18);
      const priceRaw = await main.getTokenToUSDT(oneToken);
      const scaled = Number(
        ethers.formatUnits(priceRaw, 18)
      );
      setNrxPrice(scaled);
      return scaled;
    } catch {
      return 1;
    }
  };

  /* ================= LOAD STAKING ================= */

  const loadStaking = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);

      const main = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      /* ---- Parallel Calls ---- */
      const [exists, stakeList, price] =
        await Promise.all([
          main.isUserExists(address),
          main.getUserStakingTransactions(address),
          fetchNRXPrice(main),
        ]);

      if (!exists) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      if (!stakeList.length) {
        setStakingData([]);
        setLoading(false);
        return;
      }

      const startIndex =
        (currentPage - 1) * pageSize;
      const endIndex =
        startIndex + pageSize;

      const paginated = stakeList.slice(
        startIndex,
        endIndex
      );

      const formatted = paginated.map((item) => {
        /* ==== EXACT PHP STYLE CALC ==== */
        const amount =
          Number(item.amount) / 1e18;

        const totalRoi =
          Number(item.totalRoi) / 1e18;

        const totalCapitalReturn =
          Number(item.totalCapitalReturn) /
          1e18;

        const amountNRX =
          amount / price;

        const roiNRX =
          totalRoi / price;

        const capitalNRX =
          totalCapitalReturn / price;

        const date = new Date(
          Number(item.timestamp) * 1000
        );

        const formattedDate =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}:${String(
            date.getSeconds()
          ).padStart(2, "0")}`;

        /* ==== EXACT PHP STATUS ==== */
        const status =
          amount === 0
            ? "Capital Withdraw"
            : "On Going.";

        const stakeType =
          Number(item.stakeType);

        let packageName =
          stakeType === 1
            ? "Staking Package"
            : "--";

        return {
          id: Number(item.id),
          amount,
          amountNRX,
          totalRoi,
          roiNRX,
          totalCapitalReturn,
          capitalNRX,
          date: formattedDate,
          status,
          packageName,
          // action,
        };
      });

      setStakingData(formatted);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Error loading staking history"
      );
      setLoading(false);
    }
  }, [address, currentPage, contracts]);

  useEffect(() => {
    loadStaking();
  }, [loadStaking]);

  /* ================= WITHDRAW ================= */

  

  /* ================= UI ================= */

  return (
    <div className="transaction-container">
      <h2>Staking History</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>Stake ID</th>
            <th>Amount(USDT)</th>
            <th>Total ROI</th>
            <th>Total Capital Return</th>
            <th>Stake DateTime</th>
            <th>Status</th>
            <th>Package</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : stakingData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-warning">
                No records found.
              </td>
            </tr>
          ) : (
            stakingData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>

                <td>
                  $ {row.amount.toFixed(4)} (
                  NRXN {row.amountNRX.toFixed(4)})
                </td>

                <td>
                  $ {row.totalRoi.toFixed(4)} (
                  NRXN {row.roiNRX.toFixed(4)})
                </td>

                <td>
                  $ {row.totalCapitalReturn.toFixed(
                    4
                  )}{" "}
                  ( NRXN{" "}
                  {row.capitalNRX.toFixed(4)})
                </td>

                <td>{row.date}</td>

                <td>
                  <div className="badge badge-outline-warning">
                    {row.status}
                  </div>
                </td>

                <td>
                  <div className="badge badge-outline-warning">
                    {row.packageName}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="connect_btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
        >
          Prev
        </button>

        <button
          className="connect_btn"
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StakingHistory;