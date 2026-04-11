import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Login = () => {
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

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back!</h1>
        <h1 className="logo">🏠 Roomify</h1>
        <p className="subtitle">Login to your account</p>
       {error && (<p className="login-error">
        {typeof error === "string" ? error : "Login failed"}
      </p>)}

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label><b>Email :</b></label>
            <input type="email" name="email" placeholder="Enter your email"  value={formData.email} onChange={handleChange} />
            {formError.email && (
              <p className="field-error">{formError.email}</p>
            )}
          </div>

          <div className="input-group">
            <label><b>Password :</b></label>

            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}  placeholder="Enter your password" />
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
