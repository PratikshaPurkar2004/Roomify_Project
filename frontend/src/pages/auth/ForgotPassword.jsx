import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/authSlice";
import {useNavigate} from "react-router-dom";
import "../../styles/Login.css";

function ForgotPassword() {
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { loading, message, error,resetToken } = useSelector((state) => state.auth);

  useEffect(()=>{
    if(resetToken)
    {
      setTimeout(()=>{
        navigate(`/reset-password/${resetToken}`);
      },1500)
    }
  },[resetToken,navigate]);

  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateEmail = () => {

    if (!email) {
      return "Email is required";
    }

    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email address";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateEmail();

    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }
    setValidationError("");
    dispatch(forgotPassword(email));
  };

 

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Reset Password 🔐</h2>

        {validationError && (<p className="error-msg">{validationError}</p>)}
        {error && (<p className="error-msg">{error}</p>)}
        {message && (<p className="success-msg">{message}</p>)}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <button type="submit" className="login-btn" disabled={loading} >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;
