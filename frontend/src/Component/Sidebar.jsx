
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
  const [clearedCounts, setClearedCounts] = useState(() => {
    try {
      const userId = user?.user_id || localStorage.getItem("userId");
      const stored = localStorage.getItem(`sidebar_cleared_/${userId}`);
      return stored ? JSON.parse(stored) : { requestsCount: 0, chatCount: 0 };
    } catch {
      return { requestsCount: 0, chatCount: 0 };
    }
  });

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
              chatCount: res.data.chatCount
            });

            // If the server count drops (e.g. user accepted a request), lower our baseline so future new requests trigger the badge again
            setClearedCounts(prev => {
              let updated = { ...prev };
              let changed = false;
              if (res.data.requestsCount < prev.requestsCount) { updated.requestsCount = res.data.requestsCount; changed = true; }
              if (res.data.chatCount < prev.chatCount) { updated.chatCount = res.data.chatCount; changed = true; }
              if (changed) localStorage.setItem(`sidebar_cleared_/${userId}`, JSON.stringify(updated));
              return changed ? updated : prev;
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

  const syncClearedCount = (key, value) => {
    const userId = user?.user_id || localStorage.getItem("userId");
    setClearedCounts(prev => {
      const updated = { ...prev, [key]: value };
      if (userId) localStorage.setItem(`sidebar_cleared_/${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleRequestsClick = () => {
    syncClearedCount('requestsCount', counts.requestsCount);
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    syncClearedCount('chatCount', counts.chatCount);
    navigate("/dashboard/chat");
  };

  const displayRequestsCount = counts.requestsCount > clearedCounts.requestsCount ? counts.requestsCount - clearedCounts.requestsCount : 0;
  const displayChatCount = counts.chatCount > clearedCounts.chatCount ? counts.chatCount - clearedCounts.chatCount : 0;

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

        <NavLink to="/dashboard/requests" className="menu-item" onClick={handleRequestsClick}>
          <FaEnvelope /> <span>Requests</span>
          {displayRequestsCount > 0 && <span className="sidebar-badge">{displayRequestsCount}</span>}
        </NavLink>

        <a href="#" className="menu-item" onClick={handleChatClick}>
          <FaRegCommentDots /> <span>Chat</span>
          {displayChatCount > 0 && <span className="sidebar-badge">{displayChatCount}</span>}
        </a>

      </div>

    </div>
  );
}

export default Sidebar;
