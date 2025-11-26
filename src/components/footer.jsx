import React from "react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Suits", href: "#suits" },
    { name: "How It Works", href: "#how-it-works" },
  ];

  const supportLinks = [
    { name: "Terms & Conditions", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <footer className="site-footer">
      <div className="container">

        <div className="f-newsletter row align-items-center">
          <div className="col-md-6 f-subscribe">
            <h3>SUBSCRIBE OUR NEWSLETTER</h3>
            <p>
              Subscribe our newsletter and get updated our latest discount and news
            </p>
          </div>

          <div className="col-md-6 f-search">
            <div className="row">
              <div className="col-md-8">
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="w-100"
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="w-100">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-main-content row">
          <div className="col-md-5 f-logo">
              <a href="/">
                <img src= "/Images/suitsyncfooter.svg" alt="SuitSync Logo" />
              </a>
            <p>
              This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed. This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate.
            </p>
            <div className="f-social">
              <a href="#" target="_blank">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank">
                <i class="fa-brands fa-twitter"></i>
              </a>

              <a href="#" target="_blank">
                <i class="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2">
            <h4>Quick Links</h4>
            <ul className="footer-list">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3">
            <h4>Support</h4>
            <ul className="footer-list">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-2">
            <h4>Contact Info</h4>
            <p>
              Call Now:
              <br />
              <a href="#">000 000 0000</a>
            </p>
            <p>
              Email Now:
              <br />
              <a href="#">info@suitsync.com</a>
            </p>
          </div>
        </div>

        <div className="f-copyright">
          <p>
            © SuitSync 2025. All Rights Reserved. Designed & Developed by
            Koderpedia.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;