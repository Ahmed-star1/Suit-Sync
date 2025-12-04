import React from 'react';
import { NavLink } from 'react-router-dom';

const LeftColumnTabs = () => {
  return (
    <div className="left-column col-md-3">
      <ul className="sidebar-drawer">
        <li>
          <NavLink to="/my-account" className="sidebar-item">
            <img src="/Images/account.png" /> My Account
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/my-events" className="sidebar-item" >
            <img src="/Images/events.png" /> My Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/measurement" className="sidebar-item">
            <img src="/Images/measurement.png" /> Measurement
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/look" className="sidebar-item">
            <img src="/Images/look.png" /> Look
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/my-orders" className="sidebar-item">
            <img src="/Images/orders.png" /> My Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/support" className="sidebar-item">
            <img src="/Images/support.png" /> Support
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/privacy-policy" className="sidebar-item">
            <img src="/Images/policy.png" /> Privacy Policy
          </NavLink>
        </li>
        <li>
          <NavLink to="/account/logout" className="sidebar-item">
            <img src="/Images/logout.png" /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default LeftColumnTabs;