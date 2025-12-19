import React from "react";

const AboutInfo = () => {
  return (
    <section className="about-info">
      <div className="container">
        <div className="row">
          <div className="col-md-6" data-aos="fade-up">
            <img src="/Images/aboutImage.png" />
          </div>
          <div class="col-md-6" data-aos="fade-left">
            <h2>Look Sharp. Feel Confident. Own the Moment.</h2>
            <p>
              This is dummy copy. It is not meant to be read. It has been placed
              here solely to demonstrate the look and feel of finished, typeset
              text. Only for show. He who searches for meaning here will be
              sorely disappointed. This is dummy copy. It is not meant to be
              read. It has been placed here solely to demonstrate the look and
              feel of finished, typeset text. Only for show. He who searches for
              meaning here will be sorely disappointed.
            </p>
            <p>This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. </p>
            <a href="#" className="designBtn">Get Started</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
