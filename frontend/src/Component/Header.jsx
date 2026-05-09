import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { UserCheck, UserPlus, Eye, Send, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "../styles/Header.css";

import axios from "axios";
import { API_URL } from "../api";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastSeenTime, setLastSeenTime] = useState(0);

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Home Dashboard";
    if (path === "/dashboard/profile") return "My Profile";
    if (path === "/dashboard/find-rooms") return "Find Perfect Rooms";
    if (path === "/dashboard/find-roommates") return "Meet Your Perfect Roommate";
    if (path === "/dashboard/requests") return "Connection Requests";
    if (path === "/dashboard/chat") return "Messages";
    if (path === "/dashboard/subscription") return "";
    if (path === "/dashboard/my-rooms") return "My Rooms";
    if (path.startsWith("/dashboard/room-details/")) return "Room Details";
    if (path.startsWith("/dashboard/roommate/")) return "Roommate Profile";
    return "Roomify";
  };

  // Redux state guarantees immediate updates upon login
  const { user } = useSelector(state => state.auth);

  const [userState, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    // Listen to custom local storage event emitted by Profile.jsx
    const handleStorageChange = () => {
      try {
        setUserState(JSON.parse(localStorage.getItem("user")));
      } catch (e) {
        setUserState(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const activeUser = user || userState;
  const activeUserId = activeUser?.user_id || localStorage.getItem('userId');

  React.useEffect(() => {
    if (!activeUserId) return;

    const fetchNotifications = () => {
      axios.get(`${API_URL}/api/notifications/${activeUserId}`)
        .then(res => {
          if (res.data.success) {
            setNotifications(res.data.notifications);
          }
        })
        .catch(err => console.error("Error fetching notifications", err));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    // Load last seen time
    const storedSeen = localStorage.getItem(`last_seen_notif_${activeUserId}`);
    if (storedSeen) setLastSeenTime(parseInt(storedSeen));

    return () => clearInterval(interval);
  }, [activeUserId]);

  const handleToggleNotifications = () => {
    const willShow = !showNotifications;
    setShowNotifications(willShow);
    if (willShow) {
      const now = Date.now();
      setLastSeenTime(now);
      localStorage.setItem(`last_seen_notif_${activeUserId}`, now.toString());
    }
  };

  const processedNotifications = notifications.map(n => {
    if (!n.created_at) return n;
    const notifTime = new Date(n.created_at).getTime();
    if (notifTime <= lastSeenTime) {
      return { ...n, unread: false };
    }
    return n;
  });

  const unreadCount = processedNotifications.filter(n => n.unread).length;

  let userName = "User";
  let profileImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // default

  if (activeUser) {
    userName = activeUser.name || activeUser.fullname || activeUser.username || "User";
    if (activeUser.profile_image) {
      profileImage = `${API_URL}${activeUser.profile_image}`;
    } else if (activeUser.gender) {
      const gender = activeUser.gender.toLowerCase();
      if (gender === "male" || gender === "m") {
        profileImage = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"; // distinct male avatar
      } else if (gender === "female" || gender === "f") {
        profileImage = "https://cdn-icons-png.flaticon.com/512/2922/2922561.png"; // distinct female avatar
      } else {
        profileImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // default
      }
    }
  }

  const handleLogout = () => {
    // remove only authentication-related keys
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="header">

      {/* LEFT */}
      <div className="header-left">
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <div className="notification" onClick={handleToggleNotifications}>
            <FaBell />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </div>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-header">
                Notifications
                <span className="badge">{unreadCount > 0 ? `${unreadCount} New` : 'All caught up!'}</span>
              </div>
              <div className="notif-list">
                {processedNotifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    No notifications yet 🔔
                  </div>
                ) : processedNotifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className={`notif-icon ${n.type}`}>
                      {n.type === 'request' && <UserPlus size={18} />}
                      {n.type === 'sent' && <Send size={18} />}
                      {n.type === 'accept' && <UserCheck size={18} />}
                      {n.type === 'view' && <Eye size={18} />}
                    </div>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-section" onClick={() => setOpen(!open)}>

          <span className="user-name">
            Hi {userName} 👋
          </span>

          <img 
            src={profileImage} 
            alt="profile" 
            className="avatar"
            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          />

          {open && (
            <div className="dropdown">
              <div
                className="dropdown-item"
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile
              </div>

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Header;
