import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function WithdrawHistory() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [transactions, setTransactions] =
    useState([]);
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadWithdrawHistory();
    }
  }, [address]);

  /* ================= NRX PRICE ================= */

  const getNRX = async (main) => {
    try {
      const oneToken = ethers.parseUnits(
        "1",
        18
      );
      const price =
        await main.getTokenToUSDT(
          oneToken
        );
      return Number(
        ethers.formatUnits(price, 18)
      );
    } catch {
      return 1;
    }
  };

  /* ================= LOAD DATA ================= */

  const loadWithdrawHistory =
    async () => {
      try {
        setLoading(true);

        const main =
          await getMainContract(
            contracts.MAIN_CONTRACT
          );

        const exists =
          await main.isUserExists(
            address
          );

        if (!exists) {
          toast.error(
            "User not found"
          );
          setLoading(false);
          return;
        }

        // const result =
        //   await main.getTransactionLogByType(
        //     address,
        //     "withdraw"
        //   );
        const result = [];
        const transactionsRaw =
          result[1]; // second return value

        if (
          !transactionsRaw ||
          transactionsRaw.length === 0
        ) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const nrxValue =
          await getNRX(main);

        const formatted =
          Object.values(
            transactionsRaw
          )
            .sort(
              (a, b) =>
                Number(b.timestamp) -
                Number(a.timestamp)
            )
            .map((tx, index) => {
              const amount = Number(
                ethers.formatUnits(
                  tx.amount,
                  18
                )
              );

              const amountNRX =
                amount / nrxValue;

              const date =
                new Date(
                  Number(tx.timestamp) *
                    1000
                ).toLocaleString();

              const shortAddress =
                tx.fromAddress.substring(
                  0,
                  5
                ) +
                "..." +
                tx.fromAddress.substring(
                tx.fromAddress.length -
                    4
                );

              const description =
                tx.txType == 0
                  ? "NRX"
                  : "USDT";

              return {
                id: index + 1,
                date,
                shortAddress,
                amount,
                amountNRX,
                description,
              };
            });

        setTransactions(formatted);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching withdraw history:",
          error
        );
        toast.error(
          "Error loading withdraw history"
        );
        setLoading(false);
      }
    };

  /* ================= UI ================= */

  return (
    <div className="transaction-container">
      <h2>Withdraw History</h2>

      <table
        className="transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>From Address</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No withdraw history available.
              </td>
            </tr>
          ) : (
            transactions.map(
              (tx, index) => (
                <tr key={index}>
                  <td>{tx.id}</td>
                  <td>{tx.date}</td>
                  <td>
                    {tx.shortAddress}
                  </td>
                  <td>
                    $ {tx.amount.toFixed(4)} (
                    NRXN{" "}
                    {tx.amountNRX.toFixed(
                      4
                    )}
                    )
                  </td>
                  <td>
                    {tx.description}
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WithdrawHistory;