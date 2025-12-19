import React from "react";

const ContactSection = () => {
  return (
    <section className="contact-wrapper" data-aos="fade-up">
      <div className="container text-center">
        <h2>HAVE QUESTIONS? LET’S CONNECT.</h2>

        <p>
          This Is Dummy Copy. It Is Not Meant To Be Read. It Has Been Placed Here
          Solely To Demonstrate The Look And Feel Of Finished, Typeset Text. Only
          For Show. He Who Searches For Meaning Here Will Be Sorely Disappointed.
          This Is Dummy Copy.
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