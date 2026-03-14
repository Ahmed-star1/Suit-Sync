import React, { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "../Redux/Utils/localStore";

const nav_items = [
  { name: "Home", to: "/", key: "home" },
  { name: "About us", to: "/about-us", key: "about" },
  { name: "Shop", to: "/shop", key: "shop" },
  { name: "How it Works", to: "#", key: "howitworks" },
  { name: "Contact us", to: "/contact-us", key: "contact" },
];

const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(getAccessToken());

  useEffect(() => {
    const currentPath = window.location.pathname;

    const currentItem = nav_items.find((item) => {
      if (currentPath === "/" && item.to === "/") return true;
      if (currentPath !== "/" && item.to !== "/") {
        return currentPath.startsWith(item.to);
      }
      return false;
    });

    if (currentItem) {
      setActiveLink(currentItem.key);
    }
  }, []);

  useEffect(() => {
    const checkToken = () => {
      setToken(getAccessToken());
    };

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const getLinkClassName = (key) => {
    return `menu-link ${activeLink === key ? "active" : ""}`;
  };

  const handleChange = () => {
    navigate("/cart");
  };

  const handleWishlistChange = () => {
    navigate("/wishlist");
  };

  const handleSearchButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="topbar-contact">
                <span>
                  <a href="tel: 000-000-0000">Call Now: 000 000 0000</a>
                </span>
                <span className="separator">|</span>
                <span>
                  <a href="mailto:info@suitsync.com">
                    Email Now: info@suitsync.com
                  </a>
                </span>
              </div>
            </div>
            <div className="col-md-6 h-icons">
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
            <div className="col-6 col-md-2 h-logo">
              <Link to="/">
                <img src="/Images/suitsynclogo.svg" alt="SuitSync Logo" />
              </Link>
            </div>
            
            {/* Desktop Menu - Hidden on mobile */}
            <div className="col-md-6 desktop-menu">
              <nav className="navbar-menu">
                <ul className="menu-list">
                  {nav_items.map((item) => (
                    <li className="menu-item" key={item.key}>
                      <Link to={item.to} className={getLinkClassName(item.key)}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="col-6 col-md-4">
              <div className="navbar-actions">
                <button onClick={handleWishlistChange}>
                  <i className="fa-solid fa-heart"></i>
                </button>
                <button className="search" onClick={handleSearchButtonClick}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button onClick={handleChange}>
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
                
                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                  <i class="fa-solid fa-bars"></i>
                </button>
                
                {token ? (
                  <Link to="/events" className="designBtn desktop-only">
                    My Events
                  </Link>
                ) : (
                  <Link to="/login" className="designBtn desktop-only">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/Images/suitsynclogo.svg" alt="SuitSync Logo" />
            </Link>
            <button className="close-mobile-menu" onClick={closeMobileMenu}>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <nav className="mobile-nav-menu">
            <ul className="mobile-menu-list">
              {nav_items.map((item) => (
                <li className="mobile-menu-item" key={item.key}>
                  <Link 
                    to={item.to} 
                    className={`mobile-menu-link ${activeLink === item.key ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mobile-menu-footer">
            {token ? (
              <Link to="/events" className="mobile-menu-btn" onClick={closeMobileMenu}>
                My Events
              </Link>
            ) : (
              <Link to="/login" className="mobile-menu-btn" onClick={closeMobileMenu}>
                Login
              </Link>
            )}
            
            <div className="navbar-actions">
              <button onClick={handleWishlistChange}>
                <i className="fa-solid fa-heart"></i>
              </button>
              <button className="search" onClick={handleSearchButtonClick}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button onClick={handleChange}>
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="search-modal">
          <div className="search-modal-content">
            <button className="close-modal" onClick={handleModalClose}>
              <i className="fa-solid fa-times"></i>
            </button>
            <h2>Search</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button className="designBtn">Search</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;  