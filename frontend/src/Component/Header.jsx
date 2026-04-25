import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Home Dashboard";
    if (path === "/dashboard/profile") return "My Profile";
    if (path === "/dashboard/find-rooms") return "Find Perfect Rooms";
    if (path === "/dashboard/find-roommates") return "Meet Your Perfect Roommate";
    if (path === "/dashboard/requests") return "Connection Requests";
    if (path === "/dashboard/chat") return "Messages";
    if (path === "/dashboard/subscription") return "Premium Subscription";
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

  let userName = "User";
  let profileImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // default
  
  const activeUser = user || userState;

  if (activeUser) {
    userName = activeUser.name || activeUser.fullname || activeUser.username || "User";
    if (activeUser.profile_image) {
      profileImage = `http://localhost:5000${activeUser.profile_image}`;
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

        <div className="notification">
          <FaBell />
          <span className="notification-dot"></span>
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
