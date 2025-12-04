import React from "react";

const info = [
  {
    icon: "/Images/CallIcon.png",
    title: "CALL NOW",
    desc: "000 000 0000",
    linkType: "tel",
  },
  {
    icon: "/Images/EmailIcon.png",
    title: "EMAIL",
    desc: "info@suitsync.com",
    linkType: "email"
  },
  {
    icon: "/Images/MapIcon.png",
    title: "Address",
    desc: "480 Madison Avenue, New York, NY 10022, USA",
    linkType: "none",
  },
];

const ContactInfo = () => {
  return (
    <section className="steps-wrapper">
      <h2>Contact Info</h2>
      <p className="info-content">This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed. This is dummy copy. </p>
      <div className="container">
        <div className="steps-row row">
          {info.map((item, index) => {
            let content;

            if (item.linkType === "tel") {
              content = (
                <a href={`tel:${item.desc}`} className="info-link">
                  {item.desc}
                </a>
              );
            } 
            else if (item.linkType === "email") {
              content = (
                <a href={`mailto:${item.desc}`} className="info-link">
                  {item.desc}
                </a>
              );
            } 
            else {
              content = <p>{item.desc}</p>;
            }

            return (
              <div className="step col-md-4" key={index}>
                <div className="step-icon">
                  <img src={item.icon} alt={item.title} />
                </div>

                <h3>{item.title}</h3>

                {item.linkType === "none" ? (
                  <p>{item.desc}</p>
                ) : (
                  <p>
                    <a href={item.linkType === "tel" ? `tel:${item.desc}` : `mailto:${item.desc}`}
                       className="info-link">
                      {item.desc}
                    </a>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;