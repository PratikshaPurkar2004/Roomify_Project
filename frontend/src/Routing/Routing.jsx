
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Auth Pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
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
import FindRooms from "../pages/user/FindRooms";
import Preference from "../pages/user/Preference";
import Subscription from "../pages/Subscription";
import Chat from "../pages/user/Chat";
import MyRooms from "../pages/user/MyRooms";


/* Auth & Preference Guard */
function AuthGuard() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("AuthGuard: Error parsing user from localStorage", e);
  }
  
  if (!user) return <Navigate to="/" />;

  const p = user.preferences;
  const noPreferences = !p || 
                        p === "" || 
                        p === "null" || 
                        p === "[]" || 
                        p === "None" ||
                        (Array.isArray(p) && p.length === 0);

  if (noPreferences) return <Navigate to="/preferences" />;

  return <Outlet />;
}


/* Dashboard Layout */
function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <div className="content">
          <AuthGuard />
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
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/preferences" element={<Preference />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<Requests />} />
        <Route path="find-rooms" element={<FindRooms />} />
        <Route path="find-roommates" element={<FindRoommates />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="chat" element={<Chat />} />
        <Route path="my-rooms" element={<MyRooms />} />


      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default Routing;
