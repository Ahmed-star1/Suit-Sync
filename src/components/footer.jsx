import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about-us" },
    { name: "Shop", to: "/shop" },
    { name: "How to Measure", to: "/measurement" },
  ];

  const supportLinks = [
    { name: "Terms & Conditions", to: "/terms-and-conditions" },
    { name: "Return & Exchange Policy", to: "/return-exchange-policy" },
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Contact Us", to: "/contact-us" },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        {/* <div className="f-newsletter row align-items-center">
          <div className="col-md-6 f-subscribe">
            <h3>SUBSCRIBE OUR NEWSLETTER</h3>
            <p>
              Subscribe to our newsletter and get updated on our latest discounts and news
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
        </div> */}

        <div className="footer-main-content row">
          <div className="col-md-5 f-logo">
            <Link to="/">
              <img src="/Images/suitsyncfooter.svg" alt="SuitSync Logo" />
            </Link>
            <p>
              Create a cohesive style for your crew, manage every event detail, and assign looks seamlessly. With SuitSync, from classic tuxedos to contemporary suits, coordination has never been easier
            </p>
            <div className="f-social">
              <a href="#" target="_blank">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" target="_blank">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2">
            <h4>Quick Links</h4>
            <ul className="footer-list">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.to}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3">
            <h4>Support</h4>
            <ul className="footer-list">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.to}>{link.name}</Link> {/* Using Link here */}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-2 footer-info">
            <h4>Contact Info</h4>
            {/* <p>
              Call Now:
              <br />
              <a href="tel: 000-000-0000">000 000 0000</a>
            </p> */}
            <p>
              Email Now:
              <br />
              <a href="mailto: contact@suit-sync.com">contact@suit-sync.com</a>
            </p>
          </div>
        </div>

        <div className="f-copyright">
          <p>
            © <Link to={`/`}>SuitSync</Link> 2025. All Rights Reserved. Designed & Developed by <a href="https://koderspedia.com/" target="blanck">Koderpedia</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
