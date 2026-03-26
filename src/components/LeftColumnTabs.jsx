import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LogoutModal from "../components/LogoutModal";
import { motion, AnimatePresence } from "framer-motion";

const LeftColumnTabs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { path: "/my-account", icon: "/Images/account.png", label: "My Account" },
    { path: "/events", icon: "/Images/events.png", label: "My Events" },
    { path: "/measurement", icon: "/Images/measurement.png", label: "Measurement" },
    { path: "/my-orders", icon: "/Images/orders.png", label: "My Orders" },
    { path: "/support", icon: "/Images/support.png", label: "Support" },
    { path: "/privacy-policy", icon: "/Images/policy.png", label: "Privacy Policy" },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="mobile-left-menu-btn">
        <button 
          className="mobile-left-menu-icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Desktop Sidebar - Unchanged */}
      <div className="left-column col-md-3">
        <ul className="sidebar-drawer">
          <li>
            <NavLink to="/my-account" className="sidebar-item">
              <img src="/Images/account.png" /> My Account
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className="sidebar-item">
              <img src="/Images/events.png" /> My Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/measurement" className="sidebar-item">
              <img src="/Images/measurement.png" /> Measurement
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-orders" className="sidebar-item">
              <img src="/Images/orders.png" /> My Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className="sidebar-item">
              <img src="/Images/support.png" /> Support
            </NavLink>
          </li>
          <li>
            <NavLink to="/privacy-policy" className="sidebar-item">
              <img src="/Images/policy.png" /> Privacy Policy
            </NavLink>
          </li>
          <li>
            <a className="sidebar-item" onClick={handleLogoutClick}>
              <img src="/Images/logout.png" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Sidebar - Only shows on mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="mobile-left-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div 
              className="mobile-left-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="mobile-left-header">
                <h3>Menu</h3>
                <button 
                  className="mobile-left-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              <div className="mobile-left-content">
                <ul className="mobile-left-drawer">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <NavLink 
                        to={item.path} 
                        className="mobile-left-item"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <img src={item.icon} alt={item.label} /> 
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <a 
                      className="mobile-left-item" 
                      onClick={handleLogoutClick}
                    >
                      <img src="/Images/logout.png" alt="Logout" /> 
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LeftColumnTabs;