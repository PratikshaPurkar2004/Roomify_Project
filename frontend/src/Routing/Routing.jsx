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

<<<<<<< Updated upstream
import Login from "../Component/Login";
import ForgotPassword from "../Component/ForgotPassword";
import ResetPassword from "../Component/ResetPassword";
import Registration from "../Component/Registration";
=======
import Welcome from "../pages/auth/Welcome";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Registration from "../pages/auth/Registration";
>>>>>>> Stashed changes

import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import Footer from "../Component/Footer";

// Pages
<<<<<<< Updated upstream
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Requests from "../pages/Requests";
import Home from "../pages/Home";


/* Dashboard Layout Component */
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
=======
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Requests from "../pages/user/Requests";
>>>>>>> Stashed changes

function Routing() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup" element={<Registration />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<Requests />} />
        <Route path="home" element={<Home />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default Routing;