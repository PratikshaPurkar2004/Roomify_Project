import React, { useState } from "react";
import "./Registration.css";
import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    gender: "",
    city: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGender = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      alert("User Registered Successfully!");
      console.log(res.data);
    } catch (err) {
      alert("Error registering user");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>You are Almost Done!</h2>
        <p className="subtext">Please fill below details to continue.</p>

        <form onSubmit={handleSubmit}>
          <label>Your Name*</label>
          <input
            type="text"
            name="name"
            placeholder="Please enter your name"
            onChange={handleChange}
          />

          <label>Email*</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />

          <label>Password*</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
          />

          <label>Who You Are*</label>
          <select name="role" onChange={handleChange} defaultValue="">
            <option value="" disabled>
              Select Role
            </option>
            <option value="Host">Host</option>
            <option value="Finder">Finder</option>
          </select>

          <label>Your Gender*</label>
          <div className="gender">
            <button
              type="button"
              className={formData.gender === "Male" ? "active" : ""}
              onClick={() => handleGender("Male")}
            >
              Male
            </button>
            <button
              type="button"
              className={formData.gender === "Female" ? "active" : ""}
              onClick={() => handleGender("Female")}
            >
              Female
            </button>
          </div>

          <label>Select City*</label>
          <select name="city" onChange={handleChange} defaultValue="">
            <option value="" disabled>
              Select City
            </option>
            <option>Pune</option>
            <option>Mumbai</option>
            <option>Nagpur</option>
          </select>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
