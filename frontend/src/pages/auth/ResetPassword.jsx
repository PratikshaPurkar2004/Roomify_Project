import React, { useState,useEffect } from "react";
import axios from "axios";
import{useDispatch,useSelector}from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {resetPassword}from "../../redux/authSlice";
import "../../styles/Login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading,message,error}=useSelector((state)=>state.auth);
  const [password, setPassword] = useState("");
  const [validationError ,setValidationError]=useState("");

  const validatePassword=()=>{
    if(!password)
    {
      return "password is required";
    }

    if(password.length<6)
    {
      return "password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg=validatePassword();
    if(errorMsg)
    {
      setValidationError(errorMsg);
      return;
    }
    setValidationError("");
    dispatch(resetPassword({token,password}));
  };

  useEffect(() => {
  if (message === "Password updated successfully") {
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }
}, [message, navigate]);
    


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Set New Password 🔑</h2>
        {validationError && (<p className="error-msg">{validationError}</p>)}
        {error && (<p className="error-msg">{error}</p>)}
        {message && (<p className="success-msg">{message}</p>)}

        <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "updating.....":"Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;