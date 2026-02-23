import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "../Component/Welcome";
import Login from "../Component/Login";
import Forgot from "../Component/Forgot";
import Registration from "../Component/Registration";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/signup" element={<Registration />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Routing;