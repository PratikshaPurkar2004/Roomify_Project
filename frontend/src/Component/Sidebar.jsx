
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../redux/authSlice";
import { io } from "socket.io-client"; // Added for real-time badges
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
import { API_URL } from "../api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [counts, setCounts] = useState({ requestsCount: 0, chatCount: 0 });
  const isOnChatPage = location.pathname === '/dashboard/chat';
  useEffect(() => {
    // Force sidebar width for layout stability
    document.documentElement.style.setProperty('--sidebar-width', '280px');
  }, []);

  useEffect(() => {
    const userId = user?.user_id || localStorage.getItem("userId");
    if (!userId) return;

    const fetchCounts = () => {
      axios.get(`${API_URL}/api/notifications/sidebar-counts/${userId}`)
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
    // If user is on chat page, mark all messages as read and reset count
    if (location.pathname === '/dashboard/chat') {
      setCounts(prev => ({ ...prev, chatCount: 0 }));
    }
    const interval = setInterval(fetchCounts, 30000); // Poll less frequently as backup

    // REAL-TIME SOCKET UPDATES FOR BADGES
    const socket = io(API_URL);
    socket.emit("join_room", { userid: userId }); // Join personal global room

    socket.on("receive_message", (message) => {
      // If message is for us, increment the chat count instantly
      if (String(message.receiver_id) === String(userId)) {
        setCounts(prev => ({ ...prev, chatCount: prev.chatCount + 1 }));
      }
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user, location.pathname]);

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
          {!isOnChatPage && counts.chatCount > 0 && <span className="sidebar-badge chat-badge-wp">{counts.chatCount}</span>}
        </NavLink>

      </div>

    </div>
  );
}

export default Sidebar;
