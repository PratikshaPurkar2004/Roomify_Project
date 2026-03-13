import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  let userName = "User";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (user.name || user.fullname || user.username)) {
      userName = user.name || user.fullname || user.username;
    }
  } catch (e) {
    // ignore JSON parse errors and keep default
  }

  const handleLogout = () => {
    // remove only authentication-related keys
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="header">

      {/* LEFT */}
      <div className="header-left">
        <h1 className="page-title">Dashboard</h1>
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
