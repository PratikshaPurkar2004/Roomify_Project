import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./Component/Welcome";
import Login from "./Component/Login";
import Registration from "./Component/Registration";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FindRoommates from "./pages/FindRoommates";
import Requests from "./pages/Requests";
import Subscription from "./pages/Subscription";

import Header from "./Component/Header";
import Sidebar from "./Component/Sidebar";
import Footer from "./Component/Footer";

import "./App.css";

export default function App() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />


      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <>
            <Header />
            <div className="layout">
              <Sidebar />
              <div className="content">
                <Dashboard />
              </div>
            </div>
            <Footer />
          </>
        }
      />


      {/* Profile */}
      <Route
        path="/profile"
        element={
          <>
            <Header />
            <div className="layout">
              <Sidebar />
              <div className="content">
                <Profile />
              </div>
            </div>
            <Footer />
          </>
        }
      />


      {/* Find Roommates */}
      <Route
        path="/find"
        element={
          <>
            <Header />
            <div className="layout">
              <Sidebar />
              <div className="content">
                <FindRoommates />
              </div>
            </div>
            <Footer />
          </>
        }
      />


      {/* Requests */}
      <Route
        path="/requests"
        element={
          <>
            <Header />
            <div className="layout">
              <Sidebar />
              <div className="content">
                <Requests />
              </div>
            </div>
            <Footer />
          </>
        }
      />


      {/* Subscription */}
      <Route
        path="/subscribe"
        element={
          <>
            <Header />
            <div className="layout">
              <Sidebar />
              <div className="content">
                <Subscription />
              </div>
            </div>
            <Footer />
          </>
        }
      />


      {/* Redirect Unknown Pages */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
