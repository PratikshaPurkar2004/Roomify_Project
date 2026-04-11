import React from "react";
import "./HomeNavbar.css";

const HomeNavbar = ({ onLoginClick, onRegisterClick, isSimple = false }) => {
  return (
    <nav className="home-navbar">
      <div className="logo">Roomify</div>
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
