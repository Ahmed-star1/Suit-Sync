import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const steps = [
  {
    icon: "/Images/style.png",
    title: "SET UP YOUR EVENT",
    desc: "Create your wedding party or group event. Invite others, assign styles, and keep everything on track with our event tracker.",
  },
  {
    icon: "/Images/event.png",
    title: "SELECT YOUR STYLE",
    desc: "Browse modern suits and tuxedos curated for wedding and special events. Choose your look in just a few clicks – rental or purchase",
  },
  {
    icon: "/Images/perfect-fit.png",
    title: "FIND YOUR PERFECT FIT",
    desc: "Get measured without the mess. We’ll send a tailor’s tape and offer 1:1 fit support – virtually, from our team – on your schedule.",
  },
  {
    icon: "/Images/order.png",
    title: "DELIVERED TO YOUR DOOR",
    desc: "Your suit arrives right on schedule. We handle the logistics – so you don’t have to.",
  },
];

const StyleJourney = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <section className="steps-wrapper" data-aos="fade-up">
      <h2>
        YOUR EVENT, Fully
        <br />
        synced
      </h2>
      <div class="container">
        <div className="steps-row row">
          {steps.map((step, index) => (
            <div className="step col-md-3" key={index}>
              <div className="step-icon">
                <img src={step.icon} alt={step.title} />
              </div>

              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleJourney;
