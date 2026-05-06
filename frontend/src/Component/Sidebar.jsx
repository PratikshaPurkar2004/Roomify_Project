
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaHome,
  FaUser,
  FaSearch,
  FaEnvelope,
  FaComments,
  FaDoorOpen,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    navigate("/dashboard/chat");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <div className="logo-box">R</div>
        <span className="logo-text">Roomify</span>
      </div>

      <div className="sidebar-menu">

        <NavLink to="/dashboard" end className="menu-item">
          <FaHome /> <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard/profile" className="menu-item">
          <FaUser /> <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/find-rooms" className="menu-item">
          <FaDoorOpen /> <span>Find Rooms</span>
        </NavLink>

        <NavLink to="/dashboard/my-rooms" className="menu-item">
          <FaDoorOpen style={{ color: '#6366f1' }} /> <span>My Rooms</span>
        </NavLink>

        <NavLink to="/dashboard/find-roommates" className="menu-item">
          <FaSearch /> <span>Find Roommates</span>
        </NavLink>

        <NavLink to="/dashboard/requests" className="menu-item">
          <FaEnvelope /> <span>Requests</span>
        </NavLink>

        <a href="#" className="menu-item" onClick={handleChatClick}>
          <FaComments /> <span>Chat</span>
        </a>

      </div>

    </div>
  );
}

export default Sidebar;
