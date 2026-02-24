import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setIsError(false);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Invalid or expired token"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Set New Password 🔑</h2>

        {message && (
          <p className={isError ? "error-msg" : "success-msg"}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;