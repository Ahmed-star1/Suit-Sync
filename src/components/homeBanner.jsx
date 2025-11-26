import React from "react";

const HeroImage = "/Images/homeBanner.png";

const HomeBanner = () => {
  return (
    <section
      className="home-banner"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-7 banner-content">
            <h1>FIND YOUR SIGNATURE SUIT OR TUXEDO</h1>
            <p>
              Look Your Best On Your Big Day With Perfectly Tailored Suits <br/> And
              Tuxedos Available For Rent Or Purchase.
            </p>
            <a href="#" className="designBtn">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
