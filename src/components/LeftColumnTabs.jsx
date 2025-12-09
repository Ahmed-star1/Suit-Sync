import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutModal from "../components/LogoutModal";

const LeftColumnTabs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true); 
  };

  return (
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
          <NavLink to="/event-look" className="sidebar-item">
            <img src="/Images/look.png" /> Look
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

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LeftColumnTabs;