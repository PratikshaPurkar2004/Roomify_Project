import React from "react";
import "./Welcome.css";
import { Link } from "react-router-dom";


const Welcome = () => {
  return (
    <div className="hero">
      
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Welcome to Roomify <span className="dot">.</span>
          </h1>
          <h3>Connect match,live together!</h3>
          <p>
            Connect with people who are looking for roommates.
            Whether you have a room to offer or need a place to stay,
            find your perfect match here.
          </p>
          <Link to="/Login" className="hero-btn">
            Login
          </Link>
        </div>
      </div>
    </div>

  );
};

export default Welcome;
