import React from "react";

const ContactSection = () => {
  return (
    <section className="contact-wrapper" data-aos="fade-up">
      <div className="container text-center">
        <h2>HAVE QUESTIONS? LET’S CONNECT.</h2>

        <p>
          Need help
          keeping your wedding party in sync? Our support team is here for everything
          from event setup and party management to suit sizing, ordering, and delivery
          questions.
        </p>

        <form className="contact-form">

          <div className="input-row">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="text" placeholder="Phone" />
            <input type="email" placeholder="Email" />
          </div>

          <textarea placeholder="Write message here..."></textarea>

          <button type="submit" className="designBtn">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;