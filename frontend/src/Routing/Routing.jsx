
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Auth Pages
import Home from "../pages/Home";
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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
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
