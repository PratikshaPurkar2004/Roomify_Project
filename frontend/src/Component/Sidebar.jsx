import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { 
  Home, 
  User, 
  Search as SearchIcon, 
  Mail, 
  MessageSquare, 
  LogOut, 
  Layout, 
  Building 
} from "lucide-react";
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
    const subscribed = localStorage.getItem("subscribed");
    if (subscribed === "true") {
      navigate("/dashboard/chat");
    } else {
      navigate("/dashboard/subscription");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">R</div>
        <span className="logo-text">Roomify</span>
      </div>

      <div className="sidebar-menu">
        <div className="menu-group">
          <p className="menu-label">Main Menu</p>
          <NavLink to="/dashboard" end className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <Home size={20} /> <span>Home</span>
          </NavLink>

          <NavLink to="/dashboard/profile" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <User size={20} /> <span>Profile</span>
          </NavLink>
        </div>

        <div className="menu-group">
          <p className="menu-label">Discovery</p>
          <NavLink to="/dashboard/find-rooms" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <Building size={20} /> <span>Find Rooms</span>
          </NavLink>

          <NavLink to="/dashboard/find-roommates" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <SearchIcon size={20} /> <span>Find Roommates</span>
          </NavLink>
        </div>

        <div className="menu-group">
          <p className="menu-label">Activity</p>
          <NavLink to="/dashboard/requests" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <Mail size={20} /> <span>Requests</span>
          </NavLink>

          <a href="#" className="menu-item" onClick={handleChatClick}>
            <MessageSquare size={20} /> <span>Chat</span>
          </a>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn-premium" onClick={handleLogout}>
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
