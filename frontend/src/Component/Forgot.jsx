import React from "react";
import "./Login.css";


function Forgot() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent!");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password 🔐</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your registered email"
              required
            />
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