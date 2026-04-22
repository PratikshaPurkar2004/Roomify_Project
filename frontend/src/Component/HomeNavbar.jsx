import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./HomeNavbar.css";

const HomeNavbar = ({ onLoginClick, onRegisterClick, isSimple = false }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <nav className="home-navbar">
      <div className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>Roomify</div>
      {!isSimple && (
        <div className="nav-buttons">
          <button onClick={onLoginClick} className="login">Login</button>
          <button onClick={onRegisterClick} className="signup">Get Started</button>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
