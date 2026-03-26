import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearMessage } from "../../redux/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/ForgotPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, message } = useSelector((state) => state.auth);

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    const result = await dispatch(resetPassword({ email, newPassword: password }));

    if (resetPassword.fulfilled.match(result)) {
      navigate("/login");
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
        <div className="auth-icon">🔑</div>
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Create a new strong password for your account.
        </p>

        {error && <p className="auth-error">⚠️ {error}</p>}
        {message && <p className="auth-success">✅ {message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label><b>New Password</b></label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="auth-form-group">
            <label><b>Confirm Password</b></label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="auth-error" style={{ marginTop: '8px' }}>
                ⚠️ Passwords do not match
              </p>
            )}
          </div>

          <div className="password-requirements">
            💡 Password must be at least 6 characters long
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || password !== confirmPassword || password.length < 6}
            style={{ marginTop: '16px' }}
          >
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Resetting...
              </>
            ) : (
              "Reset Password"
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

export default ResetPassword;