import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function MyPartners() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );
    //   let address = "0xc56eCBBf7A3C63cF659c87355fD548e9b78b30c0";

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadPartners();
    }
  }, [address, contracts]);

  const getNRX = async (main) => {
    try {
      const oneToken = ethers.parseUnits("1", 18);
      const price = await main.getTokenToUSDT(
        oneToken
      );
      return Number(
        ethers.formatUnits(price, 18)
      );
    } catch {
      return 1;
    }
  };

  const loadPartners = async () => {
    try {
      setLoading(true);

      const main =
        await getMainContract(
          contracts.MAIN_CONTRACT
        );

      const exists =
        await main.isUserExists(address);

      if (!exists) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      const partnerAddresses =
        await main.partners(address);

      if (partnerAddresses.length === 0) {
        setPartners([]);
        setLoading(false);
        return;
      }

      const nrxValue = await getNRX(main);

      let finalData = [];

      for (let i = 0; i < partnerAddresses.length; i++) {
        const user =
          await main.users(
            partnerAddresses[i]
          );

        const totalStaked = Number(
          ethers.formatUnits(
            user.totalStaked,
            18
          )
        );

        const amountNRX =
          totalStaked / nrxValue;

        finalData.push({
          index: i + 1,
          id: user.id,
          referralCode:
            user.referralCode,
          amount: totalStaked,
          amountNRX,
          address:
            partnerAddresses[i],
          status:
            totalStaked > 0
              ? "Active"
              : "In Active",
        });
      }

      setPartners(finalData);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error loading direct partners:",
        error
      );
      toast.error(
        "Error loading partners"
      );
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <h2>My Partners</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>S/No.</th>
            <th>Partner ID.</th>
            <th>Referral ID</th>
            <th>Total Staked</th>
            <th>Wallet Address</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
          ) : partners.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No partners found.
              </td>
            </tr>
          ) : (
            partners.map((p) => (
              <tr key={p.index}>
                <td>{p.index}</td>

                <td>{p.id}</td>

                <td>{p.referralCode}</td>

                <td>
                  $ {p.amount.toFixed(4)}
                  ( NRXN{" "}
                  {p.amountNRX.toFixed(4)} )
                </td>

                <td>
                  <a
                    href={`https://bscscan.com/address/${p.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.address.substring(0, 5)}
                    ...
                    {p.address.substring(
                      p.address.length - 4
                    )}
                  </a>
                </td>

                <td>
                  <span
                    style={{
                      color:
                        p.status ===
                        "Active"
                          ? "#ffffff"
                          : "red",
                    }}
                    className="bg history0 nonSelect"
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPartners;