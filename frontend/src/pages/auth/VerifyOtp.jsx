import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, clearMessage } from "../../redux/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/ForgotPassword.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, message } = useSelector((state) => state.auth);

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    const result = await dispatch(verifyOtp({ email, otp }));

    if (verifyOtp.fulfilled.match(result)) {
      navigate("/reset-password", { state: { email } });
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon">⚠️</div>
          <h2>Session Expired</h2>
          <p className="auth-subtitle">
            Please start the forgot password process again.
          </p>
          <Link to="/forgot-password" className="auth-btn" style={{ textDecoration: 'none', display: 'flex' }}>
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">📧</div>
        <h2>Verify OTP</h2>
        <p className="auth-subtitle">
          We've sent a 6-digit OTP to <strong>{email}</strong>. Enter it below to verify your identity.
        </p>

        {error && <p className="auth-error">⚠️ {error}</p>}
        {message && <p className="auth-success">✅ {message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label><b>Enter OTP</b></label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              style={{ textAlign: 'center', fontSize: '20px', fontWeight: '700', letterSpacing: '8px' }}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <Link to="/forgot-password" className="auth-back-link">
          ← Resend OTP
        </Link>
      </div>
    </div>
  );
};

export default VerifyOtp;