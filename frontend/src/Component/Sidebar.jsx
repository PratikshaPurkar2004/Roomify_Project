
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../redux/authSlice";
import {
  FaHome,
  FaUser,
  FaSearch,
  FaEnvelope,
  FaComments,
  FaDoorOpen,
  FaBars,
  FaChevronLeft,
  FaBuilding,
  FaAddressCard,
  FaUsers,
  FaRegCommentDots,
  FaBriefcase,
  FaUserCircle,

} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [counts, setCounts] = useState({ requestsCount: 0, chatCount: 0 });
  useEffect(() => {
    // Force sidebar width for layout stability
    document.documentElement.style.setProperty('--sidebar-width', '280px');
  }, []);

  useEffect(() => {
    const userId = user?.user_id || localStorage.getItem("userId");
    if (!userId) return;

    const fetchCounts = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/sidebar-counts/${userId}`)
        .then(res => {
          if (res.data.success) {
            setCounts({
              requestsCount: res.data.requestsCount,
              chatCount: res.data.chatCount,
              sentMessagesCount: res.data.sentMessagesCount,
              sentRequestsCount: res.data.sentRequestsCount
            });
          }
        })
        .catch(err => console.error("Sidebar count fetch error:", err));
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/");
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
          <FaUserCircle /> <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/find-rooms" className="menu-item">
          <FaBuilding /> <span>Find Rooms</span>
        </NavLink>

        <NavLink to="/dashboard/my-rooms" className="menu-item">
          <FaDoorOpen /> <span>My Rooms</span>
        </NavLink>

        <NavLink to="/dashboard/find-roommates" className="menu-item">
          <FaUsers /> <span>Find Roommates</span>
        </NavLink>

        <NavLink to="/dashboard/requests" className="menu-item">
          <FaEnvelope /> <span>Requests</span>
          {counts.requestsCount > 0 && <span className="sidebar-badge">{counts.requestsCount}</span>}
        </NavLink>

        <NavLink to="/dashboard/chat" className="menu-item">
          <FaComments /> <span>Chat</span>
          {counts.chatCount > 0 && <span className="sidebar-badge">{counts.chatCount}</span>}
        </NavLink>

      </div>

    </div>
  );
}

export default Sidebar;
