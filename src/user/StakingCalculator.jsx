import React, { useState } from "react";
import Header from "../components/user/Header";
import { toast } from "react-toastify";

function StakingCalculator() {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [dailyCapital, setDailyCapital] = useState(0);
  const [totalReturn, setTotalReturn] = useState(null);

  const calculate = () => {
    const investAmount = parseFloat(amount);
    const totalDays = parseInt(days);

    if (isNaN(investAmount) || investAmount <= 0) {
      toast.error("Please enter a valid invest amount.");
      return;
    }

    if (isNaN(totalDays) || totalDays <= 0 || totalDays > 365) {
      toast.error("Please enter valid number of days (1-365).");
      return;
    }

    let principal = investAmount;
    let totalROI = 0;

    const singleDayPrincipal = investAmount / 365;
    setDailyCapital(singleDayPrincipal);

    for (let i = 1; i <= totalDays; i++) {
      let dailyROI = principal * 0.015 + singleDayPrincipal;
      totalROI += dailyROI;

      principal -= singleDayPrincipal;
      if (principal < 0) principal = 0;
    }

    setTotalReturn(totalROI);
  };

  return (
    <>
      <Header />

      <div className="markets-capital pt20 pb40">
        <div className="container">
          <h2 align="center" style={{ fontFamily: "Aquire" }}>
            <b>STAKING CALCULATOR</b>
          </h2>

          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-4">
              <div className="farms-single-section gradient-border stakeBg">
                <div className="row mb-5">
                  <div className="col-md-6 col-6" align="left">
                    <i>
                      Daily Capital : $
                      {dailyCapital.toFixed(2)}
                    </i>
                  </div>
                  <div className="col-md-6 col-6" align="right">
                    <i>ROI : 1.5%</i>
                  </div>
                </div>

                <label>Invest Amount*</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <label className="mt-4">No of days*</label>
                <input
                  type="number"
                  max="365"
                  min="1"
                  placeholder="Enter No of days"
                  className="form-control"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />

                {totalReturn !== null && (
                  <h6 className="text mt-3 text-center">
                    <br />
                    <b>Total Return: $</b>
                    {totalReturn.toFixed(4)}
                  </h6>
                )}

                <div className="unlocks mt-3">
                  <button
                    className="connect_btn unlockWallet w-100"
                    onClick={calculate}
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StakingCalculator;