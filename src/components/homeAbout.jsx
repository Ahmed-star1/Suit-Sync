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
                Crafted with
                <br /> Care, Delivered
                <br /> with Trust
              </h2>
              <p>
                This is dummy copy. It is not meant to be read. It has been
                placed here solely to demonstrate the look and feel of finished,
                typeset text. Only for show. He who searches for meaning here
                will be sorely disappointed.
              </p>
              <Link to={`/about-us`} className="designBtn">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
