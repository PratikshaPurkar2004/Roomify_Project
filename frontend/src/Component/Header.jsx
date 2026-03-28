import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import "../styles/Header.css";

function Header() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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
  if (userState) {
    userName = userState.name || userState.fullname || userState.username || "User";
    if (userState.profile_image) {
      profileImage = `http://localhost:5000${userState.profile_image}`;
    } else if (userState.gender) {
      const gender = userState.gender.toLowerCase();
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
                className="dropdown-item"
                onClick={() => navigate("/dashboard/preferences")}
              >
                Preferences
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
