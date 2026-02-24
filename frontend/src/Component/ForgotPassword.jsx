import React from "react";
import { useState } from "react";
import axios from "axios";
import "./Login.css";


function Forgot() {

  const[email,setEmail]=useState("");
  const[message,setMessage]=useState("");
  const[isError,setIsError]=useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:5000/api/auth/forgot-password",{email});

      Navigate(`/reset-password/${res.data.token}`);
      setIsError(false);
      setMessage(res.data.message);
    }
    catch(err){
      setIsError(true);
      setMessage(err.response?.data?.message || "somthing went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password 🔐</h2>
        {message && (<p className={isError? "error-msg":"success-msg"}>{message}</p>)}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your registered email" required />
          </div>

          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forgot;