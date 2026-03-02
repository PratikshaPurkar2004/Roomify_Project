// import React from "react";
// import "../styles/Header.css";

// function Header() {
//   return (
//     <div className="header">

//       <div className="header-left">
//         <h2>🏠 Roomify</h2>
//       </div>

//       <div className="header-right">
//         <img
//           src="https://i.pravatar.cc/40"
//           alt="user"
//           className="header-avatar"
//         />
//       </div>

//     </div>
//   );
// }

// export default Header;
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
          <span className="user-name">{userName}</span>
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="avatar"
          />

          {open && (
            <div className="dropdown">
              <div className="dropdown-item" onClick={() => navigate("/dashboard/profile")}>
                Profile
              </div>
              <div className="dropdown-item logout" onClick={handleLogout}>
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