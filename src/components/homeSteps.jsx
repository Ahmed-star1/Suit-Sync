import React from "react";

const steps = [
  {
    icon: "/Images/style.png",
    title: "SELECT YOUR STYLE",
    desc: "This Is Dummy Copy. It Is Not Meant To Be Read. It Has Been Placed Here Solely To Demonstrate.",
  },
  {
    icon: "/Images/event.png",
    title: "SET UP YOUR EVENT",
    desc: "This Is Dummy Copy. It Is Not Meant To Be Read. It Has Been Placed Here Solely To Demonstrate.",
  },
  {
    icon: "/Images/perfect-fit.png",
    title: "FIND YOUR PERFECT FIT",
    desc: "This Is Dummy Copy. It Is Not Meant To Be Read. It Has Been Placed Here Solely To Demonstrate.",
  },
  {
    icon: "/Images/order.png",
    title: "RECEIVE YOUR ORDER",
    desc: "This Is Dummy Copy. It Is Not Meant To Be Read. It Has Been Placed Here Solely To Demonstrate.",
  },
];

const StyleJourney = () => {
  return (
    <section className="steps-wrapper">
      <h2>
        YOUR SEAMLESS STYLE
        <br />
        JOURNEY
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
