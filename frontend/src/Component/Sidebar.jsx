// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaUser,
//   FaSearch,
//   FaEnvelope,
//   FaComments,
//   FaSignOutAlt,
// } from "react-icons/fa";

// import "../styles/Sidebar.css";

// function Sidebar() {
//   const navigate = useNavigate();

//   // Logout Function
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/"); // Go to Welcome/Login
//   };

//   return (
//     <div className="sidebar">

//       {/* Logo */}
//       <div className="sidebar-logo">🏠 Roomify</div>

//       {/* Menu */}
//       <div className="sidebar-menu">

//         {/* Dashboard */}
//         <NavLink
//           to="/dashboard"
//           className={({ isActive }) =>
//             isActive ? "menu-item active" : "menu-item"
//           }
//         >
//           <FaHome /> <span>Dashboard</span>
//         </NavLink>

//         {/* Profile */}
//         <NavLink
//           to="/dashboard/profile"
//           className={({ isActive }) =>
//             isActive ? "menu-item active" : "menu-item"
//           }
//         >
//           <FaUser /> <span>Profile</span>
//         </NavLink>

//         {/* Find Roommate */}
//         <NavLink
//           to="/dashboard/find-roommates"
//           className={({ isActive }) =>
//             isActive ? "menu-item active" : "menu-item"
//           }
//         >
//           <FaSearch /> <span>Find Roommate</span>
//         </NavLink>

//         {/* Requests */}
//         <NavLink
//           to="/dashboard/requests"
//           className={({ isActive }) =>
//             isActive ? "menu-item active" : "menu-item"
//           }
//         >
//           <FaEnvelope /> <span>Requests</span>
//         </NavLink>

//         {/* Chat */}
//         <NavLink
//           to="/dashboard/subscription"
//           className={({ isActive }) =>
//             isActive ? "menu-item active" : "menu-item"
//           }
//         >
//           <FaComments /> <span>Chat</span>
//         </NavLink>

//       </div>

//       {/* Logout */}
//       <div className="sidebar-footer">
//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt /> Logout
//         </button>
//       </div>

//     </div>
//   );
// }

// export default Sidebar;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSearch,
  FaEnvelope,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-box">R</div>
        <span className="logo-text">Roomify</span>
      </div>

      <div className="sidebar-menu">

        <NavLink to="/dashboard" end className="menu-item">
          <FaHome /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/profile" className="menu-item">
          <FaUser /> <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/find-roommates" className="menu-item">
          <FaSearch /> <span>Find Roommate</span>
        </NavLink>

        <NavLink to="/dashboard/requests" className="menu-item">
          <FaEnvelope /> <span>Requests</span>
        </NavLink>

        <NavLink to="/dashboard/subscription" className="menu-item">
          <FaComments /> <span>Chat</span>
        </NavLink>

      </div>

    

    </div>
  );
}

export default Sidebar;
