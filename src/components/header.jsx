import React, { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook, Search } from "lucide-react";

const nav_items = [
  { name: "Home", href: "/", key: "home" },
  { name: "About us", href: "/about-us", key: "about" },
  { name: "Suits", href: "/suits", key: "suits" },
  { name: "How it Works", href: "#", key: "howitworks" },
  { name: "Contact us", href: "/contact-us", key: "contact" },
];

const Header = () => {
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const currentPath = window.location.pathname;
    
    const currentItem = nav_items.find(item => {
      if (currentPath === "/" && item.href === "/") return true;
      if (currentPath !== "/" && item.href !== "/") {
        return currentPath.startsWith(item.href);
      }
      return false;
    });
    
    if (currentItem) {
      setActiveLink(currentItem.key);
    }
  }, []);

  const getLinkClassName = (key) => {
    return `menu-link ${activeLink === key ? "active" : ""}`;
  };

  const handleLinkClick = (key) => {
    setActiveLink(key);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="topbar-contact">
                <span>
                  <a href="#">Call Now: 000 000 0000</a>
                </span>
                <span className="separator">|</span>
                <span>
                  <a href="#">Email Now: info@suitsync.com</a>
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="topbar-social d-flex justify-content-md-end">
                <a href="#">
                  <Instagram size={18} />
                </a>
                <a href="#">
                  <Twitter size={18} />
                </a>
                <a href="#">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-2 h-logo">
              <a href="/" onClick={() => handleLinkClick("home")}>
                <img
                  src="/Images/suitsynclogo.svg"
                  alt="SuitSync Logo"
                />
              </a>
            </div>
            <div className="col-md-7">
              <nav className="navbar-menu">
                <ul className="menu-list">
                  {nav_items.map((item) => (
                    <li className="menu-item" key={item.key}>
                      <a
                        href={item.href}
                        className={getLinkClassName(item.key)}
                        onClick={() => handleLinkClick(item.key)}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="col-md-3">
              <div className="navbar-actions">
                <button>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button>
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
                <a href="#" className="designBtn">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;