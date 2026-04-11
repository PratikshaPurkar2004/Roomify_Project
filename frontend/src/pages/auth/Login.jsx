import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Login = ({ onClose, onSwitch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (user) {
      const prefs = user.preferences;
      if (!prefs || prefs === "" || prefs === "null" || prefs === "[]" || prefs === "skipped") {
        navigate("/preferences");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
     setFormError({});
  };

  const validate = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } 
    const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

if (!strongPasswordRegex.test(formData.password)) {
  errors.password =
    "Password must include uppercase, lowercase, number & special character";
}
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      dispatch(loginUser(formData));
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  const handleSwitchToSignup = (e) => {
    e.preventDefault();
    if (onSwitch) onSwitch();
    else navigate("/signup");
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="login-card modal-login"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={handleClose}>
          ×
        </span>
        
        <div className="login-form-side">
          <div className="logo auth-brand">Roomify</div>
          <h1>Welcome Back</h1>
          <p className="subtitle">Please enter your details to sign in.</p>

          {error && (
            <p className="login-error">
              {typeof error === "string" ? error : "Login failed"}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {formError.email && (
                 <p className="field-error">{formError.email}</p>
              )}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </span>
              </div>
              {formError.password && (
                <p className="field-error">{formError.password}</p>
              )}
            </div>

            <div className="forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="signup-link">
              Don't have an account? <span style={{color: '#6366F1', fontWeight: 600, cursor: 'pointer'}} onClick={handleSwitchToSignup}>Sign Up</span>
            </p>
          </form>
        </div>

        <div className="login-image-side">
          <div className="glass-overlay">
            <h2>Find your perfect<br/>shared space.</h2>
            <p>Join thousands of verified users finding their ideal flatmates safely and smartly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;