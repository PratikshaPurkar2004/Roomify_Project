import React, { useState } from "react";
import "./Registration.css";

const Registration = () => {
  const [gender, setGender] = useState("");

  return (
    <div className="container">
      <div className="card">
        <h2>You are Almost Done!</h2>
        <p className="subtext">Please fill below details to continue.</p>

        <label>Your Name*</label>
        <input type="text" placeholder="Please enter your name" />

        <label>Who You Are*</label>
        <select>
          <option selected disabled>You are looking for a Host/Finder</option>
          <option>Host</option>
          <option>Finder</option>
        </select>

        <label>Your Gender*</label>
        <div className="gender">
          <button
            className={gender === "Male" ? "active" : ""}
            onClick={() => setGender("Male")}
          >
            Male
          </button>
          <button
            className={gender === "Female" ? "active" : ""}
            onClick={() => setGender("Female")}
          >
            Female
          </button>
        </div>

        <label>Select City*</label>
        <select>
          <option selected disabled>Select City</option>
          <option>Pune</option>
          <option>Mumbai</option>
          <option>Nagpur</option>
        </select>

        <label>Upload Image*</label>
        <input type="file" />

        <button className="register-btn">Register</button>
      </div>
    </div>
  );
};

export default Registration;
