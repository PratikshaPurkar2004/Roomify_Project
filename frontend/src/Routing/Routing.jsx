// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";

// // import Welcome from "../Component/Welcome";
// // import Login from "../Component/Login";
// // import Forgot from "../Component/Forgot";
// // import Registration from "../Component/Registration";

// // function Routing() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Welcome />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/forgot-password" element={<Forgot />} />
// //       <Route path="/signup" element={<Registration />} />

// //       <Route path="*" element={<Navigate to="/" />} />
// //     </Routes>
// //   );
// // }

// // export default Routing;


import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Auth Pages
import Welcome from "../pages/auth/Welcome";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Registration from "../pages/auth/Registration";



// Layout Components
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import Footer from "../Component/Footer";

// User Pages
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Requests from "../pages/user/Requests";
import FindRoommates from "../pages/user/FindRoommates";
import Preference from "../pages/user/Preference";

/* Dashboard Layout */
function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

function Routing() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/preferences" element={<Preference />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<Requests />} />
        <Route path="find-roommates" element={<FindRoommates />} />
        
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default Routing;