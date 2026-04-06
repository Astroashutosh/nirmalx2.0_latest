import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FeatureSlider() {

  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: slidesToShow,   // only this one
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  adaptiveHeight: true
};
  return (
    <section
      className="ftco-section testimony-section"
      style={{ background: "linear-gradient(45deg, #103514, #1a3216)" }}
    >
      <div className="container-xl">
        <div className="row justify-content-center pb-4">
          <div className="col-md-7 text-center heading-section">
            <h2 className="mb-3" style={{ color: "white" }}>
              Our Features
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">

            {/* KEY PROP FIX */}
        <Slider {...settings} key={slidesToShow}>

  {/* Passive Income */}
  <div className="item">
    <div className="testimony-wrap">
      <div className="text">
        <div className="ps-3 tx">
          <p className="name">Passive Income & Ecosystem Flow</p>
        </div>

        <ul style={{ color: "white", listStyle: "square", paddingLeft: "20px", marginTop: "15px" }}>
          <li>Rewards distributed automatically via verified smart contract.</li>
          <li>100% decentralized — no admin or backend control.</li>
          <li>Liquidity, burn, and treasury mechanisms keep circulation balanced.</li>
        </ul>

        <p style={{ color: "#222222", marginTop: "10px" }}>
          “Earnings shouldn’t depend on chance — they should depend on code.”
        </p>
      </div>
    </div>
  </div>

  {/* Security & Audit */}
  <div className="item">
    <div className="testimony-wrap">
      <div className="text">
        <div className="ps-3 tx">
          <p className="name">Security & Audit</p>
        </div>

        <ul style={{ color: "white", listStyle: "square", paddingLeft: "20px", marginTop: "15px" }}>
          <li>Smart contract audited by independent third-party.</li>
          <li>Liquidity lock verified publicly via Unicrypt link.</li>
          <li>Multi-sig admin wallets for any project updates.</li>
          <li>DAO governance planned for community control.</li>
        </ul>

        <p style={{ color: "#222222", marginTop: "10px" }}>
          “Your investment, your visibility — always on blockchain.”
        </p>
      </div>
    </div>
  </div>

  {/* Community & Transparency */}
  <div className="item">
    <div className="testimony-wrap">
      <div className="text">
        <div className="ps-3 tx">
          <p className="name">Community & Transparency</p>
        </div>

        <ul style={{ color: "white", listStyle: "square", paddingLeft: "20px", marginTop: "15px" }}>
          <li>Fully open smart contracts & verifiable liquidity.</li>
          <li>Every update shared publicly through our channels.</li>
          <li>24/7 active global community.</li>
          <li>DAO voting system ensures investor participation.</li>
        </ul>

        <p style={{ color: "#222222", marginTop: "10px" }}>
          “We don’t build investors; we build believers.”
        </p>
      </div>
    </div>
  </div>

  {/* Team & Governance */}
  <div className="item">
    <div className="testimony-wrap">
      <div className="text">
        <div className="ps-3 tx">
          <p className="name">Team & Governance</p>
        </div>

        <ul style={{ color: "white", listStyle: "square", paddingLeft: "20px", marginTop: "15px" }}>
          <li>Experienced blockchain developers & transparent leadership.</li>
          <li>Team wallets locked and publicly visible.</li>
          <li>Governance model: community proposals & voting.</li>
          <li>Focused on creating ethical, real-world crypto impact.</li>
        </ul>

        <p style={{ color: "#222222", marginTop: "10px" }}>
          “True leadership in crypto means accountability written in code.”
        </p>
      </div>
    </div>
  </div>

</Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSlider;