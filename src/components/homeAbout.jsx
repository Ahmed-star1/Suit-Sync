import React from "react";

const HomeAbout = () => {
  return (
    <section className="home-about">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src="/Images/about.png" />
          </div>
          <div className="col-md-6">
            <div className="content-box">
              <h2>Crafted with<br/> Care, Delivered<br/> with Trust</h2>
              <p>
                This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed.
              </p>
              <a href="#" className="designBtn">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
