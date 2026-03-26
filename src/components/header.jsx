import React, { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../Redux/Utils/localStore";
import { getWishlistCount, getCartCount } from "../Redux/Reducers/productSlice";
import SearchModal from "./SearchModal";

const nav_items = [
  { name: "Home", to: "/", key: "home" },
  { name: "About us", to: "/about-us", key: "about" },
  { name: "Shop", to: "/shop", key: "shop" },
  { name: "Contact us", to: "/contact-us", key: "contact" },
];

const NON_NAVIGATION_ROUTES = [
  "/cart",
  "/checkout",
  "/thankyou",
  "/wishlist",
  "/login",
  "/register",
  "/events",
  "/product/",
];

const Header = () => {
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 
  const [token, setToken] = useState(getAccessToken());

  const { wishlistCount, cartCount } = useSelector((state) => state.products || {});

  useEffect(() => {
    if (token) {
      dispatch(getWishlistCount());
      dispatch(getCartCount());
    }
  }, [dispatch, token]);

  const isNavigationRoute = (pathname) => {
    const exactMatch = nav_items.some(item => item.to === pathname);
    if (exactMatch) return true;
    
    const startsWithMatch = nav_items.some(item => {
      if (item.to === "/") return false; 
      return pathname.startsWith(item.to);
    });
    if (startsWithMatch) return true;
    
    const isNonNavRoute = NON_NAVIGATION_ROUTES.some(route => {
      if (route.endsWith("/")) {
        return pathname.startsWith(route);
      }
      return pathname === route || pathname.startsWith(route);
    });
    
    return !isNonNavRoute;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (isNavigationRoute(currentPath)) {
      const currentItem = nav_items.find((item) => {
        if (currentPath === "/" && item.to === "/") return true;
        if (currentPath !== "/" && item.to !== "/") {
          return currentPath.startsWith(item.to);
        }
        return false;
      });
      if (currentItem) {
        setActiveLink(currentItem.key);
      } else {
        setActiveLink(null);
      }
    } else {
      setActiveLink(null); 
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkToken = () => setToken(getAccessToken());
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen || isMobileMenuOpen ? "hidden" : "auto";
  }, [isModalOpen, isMobileMenuOpen]);

  const getLinkClassName = (key) => {
    return `menu-link ${activeLink === key && activeLink !== null ? "active" : ""}`;
  };

  const handleChange = () => navigate("/cart");
  const handleWishlistChange = () => navigate("/wishlist");
  const handleSearchButtonClick = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };
  const handleSearchInputChange = (value) => setSearchQuery(value);
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    handleModalClose();
  };
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="topbar-contact">
                <span><a href="tel: 000-000-0000">Call Now: 000 000 0000</a></span>
                <span className="separator">|</span>
                <span><a href="mailto:info@suitsync.com">Email Now: info@suitsync.com</a></span>
              </div>
            </div>
            <div className="col-md-6 h-icons">
              <div className="topbar-social d-flex justify-content-md-end">
                <a href="#"><Instagram size={18} /></a>
                <a href="#"><Twitter size={18} /></a>
                <a href="#"><Facebook size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="navbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6 col-md-2 h-logo">
              <Link to="/"><img src="/Images/suitsynclogo.svg" alt="SuitSync Logo" /></Link>
            </div>
            
            <div className="col-md-6 desktop-menu">
              <nav className="navbar-menu">
                <ul className="menu-list">
                  {nav_items.map((item) => (
                    <li className="menu-item" key={item.key}>
                      <Link to={item.to} className={getLinkClassName(item.key)}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="col-6 col-md-4">
              <div className="navbar-actions">
                <button onClick={handleWishlistChange} className="wishlist-btn">
                  <i className="fa-solid fa-heart"></i>
                  {wishlistCount > 0 && (
                    <span className="wishlist-count">{wishlistCount}</span>
                  )}
                </button>
                <button className="search" onClick={handleSearchButtonClick}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button onClick={handleChange}>
                  <i className="fa-solid fa-cart-shopping"></i>
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </button>
                
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                  <i className="fa-solid fa-bars"></i>
                </button>
                
                {token ? (
                  <Link to="/events" className="designBtn desktop-only">My Events</Link>
                ) : (
                  <Link to="/login" className="designBtn desktop-only">Login</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/Images/suitsynclogo.svg" alt="SuitSync Logo" />
            </Link>
            <button className="close-mobile-menu" onClick={closeMobileMenu}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <nav className="mobile-nav-menu">
            <ul className="mobile-menu-list">
              {nav_items.map((item) => (
                <li className="mobile-menu-item" key={item.key}>
                  <Link 
                    to={item.to} 
                    className={`mobile-menu-link ${activeLink === item.key && activeLink !== null ? 'active' : ''}`}
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
              <Link to="/events" className="mobile-menu-btn" onClick={closeMobileMenu}>My Events</Link>
            ) : (
              <Link to="/login" className="mobile-menu-btn" onClick={closeMobileMenu}>Login</Link>
            )}
            
            <div className="navbar-actions">
              <button onClick={handleWishlistChange} className="wishlist-btn">
                <i className="fa-solid fa-heart"></i>
                {wishlistCount > 0 && (
                  <span className="wishlist-count">{wishlistCount}</span>
                )}
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

      <SearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        searchQuery={searchQuery}
        onSearchChange={handleSearchInputChange}
        onSearch={handleSearch}
      />
    </header>
  );
};

export default Header;