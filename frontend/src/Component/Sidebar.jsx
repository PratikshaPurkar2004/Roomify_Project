import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <NavLink to="/dashboard" className="menu-item">
        Dashboard
      </NavLink>

      <NavLink to="/profile" className="menu-item">
        Profile
      </NavLink>

      <NavLink to="/find" className="menu-item">
        Find Roommate
      </NavLink>

      <NavLink to="/requests" className="menu-item">
        Requests
      </NavLink>

      <NavLink to="/chat" className="menu-item">
        Chat
      </NavLink>

    </div>
  );
}

export default Sidebar;
