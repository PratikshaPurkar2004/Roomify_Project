import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const[message,setMessage]=useState("");
  const[formData,setFormData]=useState({
    email:"",
    password:"",
  });
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:5000/api/auth/login",formData);
      setMessage("Login successful!");
      setTimeout(()=>{
        navigate("/dashboard");
      },1000);
    
  } catch(err){
    setMessage("❌ Login failed.");
  }   
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        {message && <p className="login-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <div className="forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;