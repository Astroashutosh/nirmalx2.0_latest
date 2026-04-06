

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function Transaction() {
  const {address, contracts } = useSelector((state) => state.wallet);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contracts?.MAIN_CONTRACT) {
      loadTransactions();
    }
  }, [contracts]);

  /* ================= FORMAT TX TYPE ================= */

  const formatTxType = (type) => {
    if (!type) return "-";

    return type
      .toString()
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  };

  /* ================= GET NRX PRICE ================= */

  const getNRX = async () => {
    const main = await getMainContract(
      contracts.MAIN_CONTRACT
    );

    const one = ethers.parseUnits("1", 18);

    const price =
      await main.getTokenToUSDT(one);

    return Number(
      ethers.formatUnits(price, 18)
    );
  };

  /* ================= LOAD TRANSACTIONS ================= */

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // const signer = await getSigner();
      // const account = await signer.getAddress();
      const account = address;
//  const account = "0xc56eCBBf7A3C63cF659c87355fD548e9b78b30c0";

      const main = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      const exists =
        await main.isUserExists(account);

      if (!exists) {
        toast.error("User does not exist");
        setLoading(false);
        return;
      }

      const rawTransactions =
        await main.getTransactionLog(account);

      const txArray = Array.from(rawTransactions);

      if (txArray.length === 0) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const nrxPrice = await getNRX();

      /* ===== SORT LATEST FIRST ===== */
      txArray.sort((a, b) => {
        const tsA = Number(a.timestamp ?? a[5]);
        const tsB = Number(b.timestamp ?? b[5]);
        return tsB - tsA;
      });

      const formatted = txArray.map((tx, i) => {
        const fromAddress =
          tx.fromAddress ?? tx[2];

        const shortAddress =
          fromAddress.substring(0, 5) +
          "..." +
          fromAddress.substring(
            fromAddress.length - 4
          );

        const amountWei =
          tx.amount ?? tx[4];

        const amountUSD =
          Number(
            ethers.formatUnits(amountWei, 18)
          );

        const amountNRX =
          amountUSD / nrxPrice;

        const timestamp =
          Number(tx.timestamp ?? tx[5]);

        const date = new Date(
          timestamp * 1000
        ).toLocaleString();

        const txType =
          tx.txType ?? tx[3];

        return {
          index: i + 1,
          amountUSD,
          amountNRX,
          shortAddress,
          date,
          type: formatTxType(txType),
        };
      });

      setTransactions(formatted);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error
      );
      toast.error(
        "Failed to load transactions"
      );
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="transaction-container">
      <div className="float-left">
        <h2>All Transactions</h2>
      </div>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>S/No.</th>
            <th>Amount</th>
            <th>From Address</th>
            <th>Date Time</th>
            <th>Type</th>
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
                No data available
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.index}>
                <td>{tx.index}</td>

                <td>
                  $
                  {tx.amountUSD.toFixed(4)}{" "}
                  ( NRXN{" "}
                  {tx.amountNRX.toFixed(4)} )
                </td>

                <td>{tx.shortAddress}</td>

                <td>{tx.date}</td>

                <td>{tx.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transaction;