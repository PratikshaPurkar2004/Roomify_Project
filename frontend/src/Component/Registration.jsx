import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/Registration.css";

const Registration = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const[cities,setCities]=useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occupation: "",
    password: "",
    user_type: "",
    area: "",
    gender: "",
  });

  useEffect(()=>{
    const fetchCities=async()=>{
      try{
        const res=await axios.get("http://localhost:5000/api/cities");
        setCities(res.data);
      }
      catch(err)
      {
        console.log("Error fetching cities",err);
      }
    };
    fetchCities();
  },[]);

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
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage("✅ User Registered Successfully!");

      setTimeout(() => {
        navigate("/login");  
      }, 1500);

      console.log(res.data);

    } catch (err) {
      setMessage("❌ Registration Failed");
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="overlay">
      <div className="card">
        <h2>Create Account</h2>
        <p className="subtext">Please fill details to continue</p>

        {message && <p className="signup-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="occupation"
            placeholder="Your Occupation"
            onChange={handleChange}
            required
          />

          <select
            name="user_type"
            onChange={handleChange}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Host">Host</option>
            <option value="Finder">Finder</option>
          </select>

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

         <select
            name="area"
            onChange={handleChange}
            defaultValue=""
            required
          >
            <option value="" disabled>Select City</option>

            {cities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name}
              </option>
            ))}
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