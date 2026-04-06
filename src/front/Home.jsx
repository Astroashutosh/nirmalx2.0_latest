
import Hero from "../components/layout/Hero";
import Slider from '../components/layout/FeatureSlider';
import React, { useEffect, useState } from "react";
function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>


      <Hero />
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-card">
            <h2>About NirmalX (NRX)</h2>
            <p className="highlight-text">“To create a transparent and decentralised ecosystem for future finance.”</p>
            <div className="overview">
              <p><strong>NRX</strong> is a fully decentralized <strong>BEP-20</strong> token designed for trust, transparency, and long-term growth.</p>
              <p>A project built to protect investors from manipulation and uncertainty.</p>
              <p><strong>No central control</strong> – only smart contract logic.</p>
              <p>Our ecosystem is built to prove that genuine crypto can create real wealth.</p>
            </div>
            <div className="content">
              <p><strong>Vision:</strong> To build a transparent, community-owned digital ecosystem. To promote long-term token sustainability and value stability. To create a benchmark model of ethical crypto governance.</p>
              <p><strong>Mission:</strong> Empowering community with secure, scalable, and transparent crypto solutions.</p>
            </div>
          </div>
        </div>
      </section>


      <Slider />

      {showModal && (
        <div className="nrxModal">
          <div className="nrxModalContent">
            <span className="nrxClose" onClick={closeModal}>
              &times;
            </span>

            <h2>🚨 NRX Withdrawal Update</h2>

            <p>
              To maintain a strong and stable NRX price, a new withdrawal system has been implemented:
            </p>

            <ul>
              <li><strong>Daily Withdrawal Limit:</strong> Max $500 per ID</li>
              <li><strong>Target Rate Protection:</strong> $10 Zone</li>
              <li>After rate stability: Withdrawal up to $1000/day</li>
            </ul>

            <p>
              This step is designed to control sudden selling pressure and secure long-term income for all holders.
            </p>

            <p>
              <strong>Controlled Supply = Strong Price = Stable Income</strong>
            </p>

            <p>
              Thank you for supporting the NRX ecosystem.<br />
              Hold Strong • Grow Together 🚀
            </p>
          </div>
        </div>
      )}


    </>
  )
}

export default Home