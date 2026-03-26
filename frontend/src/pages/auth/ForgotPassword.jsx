import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearMessage } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      navigate("/verify-otp", { state: { email } });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔒</div>
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your registered email address and we'll send you a 6-digit OTP
          to reset your password.
        </p>

        {error && <p className="auth-error">⚠️ {error}</p>}
        {message && <p className="auth-success">✅ {message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label><b>Email Address</b></label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <Link to="/login" className="auth-back-link">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;