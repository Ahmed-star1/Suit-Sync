import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="about-choose">
      <div className="container-fluid">
        <div className="row">
          <div class="col-md-6" data-aos="fade-right">
            <h2>Keep your wedding Party Synced! </h2>
           <ul>
            <li>
                <img src="/Images/Guaranteed.png" />
                <div>
                    <h4>Wedding Party Tracking</h4>
                    <p>See exactly who has ordered, what they selected, and who still needs to complete their purchase.</p>
                </div>
               </li>
               <li>
                <img src="/Images/NoCost.png" />
                <div>
                    <h4>All-in-One Coordination</h4>
                    <p>Create events, assign looks, invite groomsmen, and manage everything from one dashboard.</p>
                </div>
               </li>
               <li>
                <img src="/Images/Quick.png" />
                <div>
                    <h4>Premium Suit Quality</h4>
                    <p>Modern styles backed by trusted manufacturing partners for reliable quality, fit, and delivery.</p>
                </div>
               </li>
               <li>
                <img src="/Images/Secure.png" />
                <div>
                    <h4>Stress-Free Experience</h4>
                    <p>Easy sizing with step-by-step videos, photo guidance, and real-time customer support whenever you need help.</p>
                </div>
               </li>
           </ul>
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <img src="/Images/choose.png" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
