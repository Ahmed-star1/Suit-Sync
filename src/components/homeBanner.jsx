import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroImage = "/Images/homeBanner.png";

const HomeBanner = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <section
      className="home-banner"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-7 banner-content" data-aos="fade-right">
            <h1>FIND YOUR SIGNATURE SUIT OR TUXEDO</h1>
            <p>
              Look Your Best On Your Big Day With Perfectly Tailored Suits{" "}
              <br /> And Tuxedos Available For Rent Or Purchase.
            </p>
            <Link to={`/suits`} className="designBtn">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
