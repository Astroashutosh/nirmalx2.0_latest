import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { getLiquidityContract,getNRXContract } from "../utils/contract";

function LiquidityRequest() {

  const { contracts, address } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(null);
  const liquidityAddress =
    contracts?.LIQUIDITY_CONTRACT;

  useEffect(() => {
    if (liquidityAddress) {
      loadData();
    }
  }, [liquidityAddress]);

  const loadData = async () => {
    try {
      const liquidity = await getLiquidityContract(liquidityAddress);

      const result = await liquidity.getAllApprovedStakes();
      const stakes = result[0];
      const users = result[1];

      let formatted = [];

      for (let i = 0; i < stakes.length; i++) {
        const s = stakes[i];
        const user = users[i];

        const userStakes = await liquidity.getUserStakes(user);
        let correctIndex = -1;

        for (let j = 0; j < userStakes.length; j++) {
          if (
            userStakes[j].id.toString() === s.id.toString() &&
            userStakes[j].timestamp.toString() === s.timestamp.toString()
          ) {
            correctIndex = j;
            break;
          }
        }

        if (correctIndex === -1) {
          console.warn("Index not found for stake", s.id);
          continue;
        }

        formatted.push({
          id: s.id.toString(),
          amount: Number(ethers.formatUnits(s.amount, 18)),
          timestamp: s.timestamp,
          user: user,
          index: correctIndex,
        });
      }

      console.log("FINAL DATA:", formatted);

      setData(formatted);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data");
    }

    setLoading(false);
  };

  /* ================= APPROVE ================= */

const handleApprove = async (row) => {
  try {
    const { user, index, id } = row;

    const liquidity = await getLiquidityContract(
      contracts.LIQUIDITY_CONTRACT
    );

    const owner = await liquidity.owner();
    if (owner.toLowerCase() !== address.toLowerCase()) {
      toast.error("Only contract owner can approve!");
      return;
    }
    const shortUser = `${user.slice(0, 6)}...${user.slice(-4)}`;

    const confirmBox = window.confirm(
      `Approve this stake?\n\nUser: ${shortUser}\nStake ID: ${id}\nIndex: ${index}`
    );
    if (!confirmBox) return;

    setProcessingIndex(`${user}-${index}`);

    const nrx = await getNRXContract(contracts.TOKEN_CONTRACT);
    await nrx.approve(contracts.LIQUIDITY_CONTRACT,ethers.MaxUint256);
    const tx = await liquidity.approveStake(user, index);
    await tx.wait();

    toast.success("Stake Approved");

    loadData();
  } catch (err) {
    console.log(err);
    toast.error("Approve failed (Only owner allowed)");
  } finally {
    setProcessingIndex(null);
  }
};


  return (
    <>
      <div className="transaction-container">
        <h2>Liquidity Request</h2>

        <table
          className="table transaction-table"
          style={{ color: "#ffffff" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>DateTime</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-warning">
                  No Pending Stakes
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  <td>{row.id}</td>

                  <td>
                    $ {row.amount.toFixed(4)}
                  </td>

                  <td>
                    {new Date(Number(row.timestamp) * 1000).toLocaleString()}
                  </td>

                  <td>
                    <button
  className="btn btn-success btn-sm"
  onClick={() => handleApprove(row)}
  disabled={processingIndex === `${row.user}-${row.index}`}
>
  {processingIndex === `${row.user}-${row.index}` ? "Processing..." : "Approve"}
</button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LiquidityRequest;