import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="about-choose">
      <div className="container-fluid">
        <div className="row">
          <div class="col-md-6">
            <h2>Why Choose Us </h2>
            <p>
             This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed.
            </p>
           <ul>
            <li>
                <img src="/Images/Guaranteed.png" />
                <div>
                    <h4>Guaranteed Purchase</h4>
                    <p>This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. </p>
                </div>
               </li>
               <li>
                <img src="/Images/NoCost.png" />
                <div>
                    <h4>No Cost. No Obligation</h4>
                    <p>This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. </p>
                </div>
               </li>
               <li>
                <img src="/Images/Quick.png" />
                <div>
                    <h4>Quick & Easy</h4>
                    <p>This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. </p>
                </div>
               </li>
               <li>
                <img src="/Images/Secure.png" />
                <div>
                    <h4>Fast & Secure</h4>
                    <p>This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. </p>
                </div>
               </li>
           </ul>
          </div>
          <div className="col-md-6">
            <img src="/Images/choose.png" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
