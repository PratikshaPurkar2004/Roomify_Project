import React from "react";
import "./Welcome.css";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="hero">
<<<<<<< HEAD

=======
>>>>>>> 86ab62e674e0df28f6e6155d24bc36f5b9d10bc3
      <div className="hero-overlay">
        <div className="hero-content">

          <h1>
            Welcome to <span className="brand">Roomify</span>
          </h1>
<<<<<<< HEAD

          <h3>Connect match, live together!</h3>

=======
          
>>>>>>> 86ab62e674e0df28f6e6155d24bc36f5b9d10bc3
          <p>
            Connect,Match And Live Together!.<br/>
            Find your perfect roommate or a place to stay.
            Roomify helps you connect safely and easily.
          </p>

<<<<<<< HEAD
          <Link to="/login" className="hero-btn">
            Login
          </Link>
=======
          <div className="btn-group">
            <Link to="/Login" className="hero-btn">
              Login
            </Link>
           
            <Link to="/signup" className="hero-btn secondary">Signup</Link>
          </div>
>>>>>>> 86ab62e674e0df28f6e6155d24bc36f5b9d10bc3

        </div>
      </div>
    </div>
  );
};

export default Welcome;
