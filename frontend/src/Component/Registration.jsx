import React, { useState } from "react";
import axios from "axios";


import "../pages/Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    //DOB: "",
    email: "",
    occupation: "",
    password: "",
    user_type: "",
    area: "",
    gender: "",
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
      gender: value,``
    });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();

    try {
      const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData);
      alert("✅ User Registered Successfully!");
      console.log(res.data);
    } catch (err) {
      alert("❌ Error registering user");
      console.log(err);
    }
  };

  return (
    <div className="overlay">
      <div className="card">
        <h2>Create Account </h2>
        <p className="subtext">Please fill details to continue</p>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" onChange={handleChange}
            required
          />

          <input type="email" name="email" placeholder="Email Address" onChange={handleChange}
            required
          />

          <input type="password" name="password" placeholder="Password" onChange={handleChange}
            required
          />

          {/* <input
            type="date"
            name="DOB"
            onChange={handleChange}
            required
          /> */}

          <input type="text" name="occupation" placeholder="Your Occupation"onChange={handleChange}
            required
          />

          <select name="user_type" onChange={handleChange} defaultValue="" required>
            <option value="" disabled>Select Role</option>
            <option value="Host">Host</option>
            <option value="Finder">Finder</option>
          </select>

          <div className="gender">
            <button
              type="button" className={formData.gender === "Male" ? "active" : ""}
              onClick={() => handleGender("Male")}
            > Male</button>

            <button
              type="button"
              className={formData.gender === "Female" ? "active" : ""}
              onClick={() => handleGender("Female")}
            >Female</button>
          </div>

          <select name="area" onChange={handleChange} defaultValue="" required>
            <option value="" disabled>Select City</option>
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
