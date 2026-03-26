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
  if (userState) {
    userName = userState.name || userState.fullname || userState.username || "User";
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
            src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
            alt="profile" 
            className="avatar" 
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
