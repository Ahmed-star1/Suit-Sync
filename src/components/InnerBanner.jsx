import React, { useEffect } from "react";

const InnerBanner = ({ title, background }) => {
  return (
    <section
      className="inner-banner"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="container">
        <div className="row" data-aos="fade-up">
          <div className="col-md-9 banner-content">
            <h1 className="text-center">{title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerBanner;