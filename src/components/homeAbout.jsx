import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const HomeAbout = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <section className="home-about">
      <div className="container">
        <div className="row">
          <div className="col-md-6" data-aos="fade-up">
            <img src="/Images/about.png" />
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <div className="content-box">
              <h2>
                Find your
                <br /> SIGNATURE SUIT
                <br /> OR TUXEDO
              </h2>
              <p>
                Find your signature look, set your event details, as assign
                outfits with ease. From sleek tuxedos to modern suits, SuitSync
                makes it easy to coordinate your crew in style.
              </p>
              <Link to={`/shop`} className="designBtn">
                Shop Now 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
