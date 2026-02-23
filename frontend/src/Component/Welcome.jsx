import React from "react";
import "./Welcome.css";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

          <h1>
            Welcome to <span className="brand">Roomify</span>
          </h1>
          
          <p>
            Connect,Match And Live Together!.<br/>
            Find your perfect roommate or a place to stay.
            Roomify helps you connect safely and easily.
          </p>

          <div className="btn-group">
            <Link to="/Login" className="hero-btn">
              Login
            </Link>
           
            <Link to="/signup" className="hero-btn secondary">Signup</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Welcome;
