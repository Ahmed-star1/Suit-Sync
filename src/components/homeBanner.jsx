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
          <div className="col-md-9 banner-content" data-aos="fade-right">
            <h1>
              KEEP YOUR
              <br /> WEDDING PARTY
              <br /> IN SYNC
            </h1>
            <p>
              Managing suits for your groomsmen shouldn’t be a hassle. SuitSync
              gives you full visibility<br/> into every member of your wedding party
              — who's measured, who’s ordered, and what’s<br/> left to do — all in
              one place.
            </p>
            <Link to={`/events`} className="designBtn">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
