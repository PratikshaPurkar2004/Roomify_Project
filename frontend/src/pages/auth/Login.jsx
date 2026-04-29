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
  const [currentImage, setCurrentImage] = useState(0);

  const authImages = [
    {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1500&auto=format&fit=crop",
      title: "Find your perfect shared space.",
      desc: "Join thousands of verified users finding their ideal flatmates safely and smartly."
    },
    {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1500&auto=format&fit=crop",
      title: "Discover beautiful rooms.",
      desc: "Browse through hundreds of premium listings."
    },
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1500&auto=format&fit=crop",
      title: "Connect with great flatmates.",
      desc: "Find people who match your vibe and lifestyle."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % authImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [authImages.length]);

  useEffect(() => {
    // Clear any previous error messages when the component mounts
    setFormData({ email: "", password: "" });
    setFormError({});
  }, []);

  useEffect(() => {
    // Only auto-redirect on the standalone /login route, not when opened as a modal
    if (user && !onClose) {
      const prefs = user.preferences;
      if (!prefs || prefs === "" || prefs === "null" || prefs === "[]") {
        navigate("/preferences");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate, onClose]);

  const validate = (data = formData) => {
    let errors = {};

    // Strict Email Validation (RFC Standards)
    if (!data.email) {
      errors.email = "Email is required";
    } else {
      const emailValue = data.email.trim();
      const parts = emailValue.split("@");
      
      if (emailValue.length > 320) {
        errors.email = "Email cannot exceed 320 characters";
      } else if (emailValue.includes(" ")) {
        errors.email = "Email cannot contain spaces";
      } else if (parts.length !== 2) {
        errors.email = "Email must contain exactly one @ symbol";
      } else {
        const [localPart, domainPart] = parts;
        
        if (localPart.length > 64) {
          errors.email = "Local part cannot exceed 64 characters";
        } else if (domainPart.length > 255) {
          errors.email = "Domain part cannot exceed 255 characters";
        } else if (localPart.startsWith(".") || localPart.endsWith(".")) {
          errors.email = "Local part cannot start or end with a dot";
        } else if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
          errors.email = "Domain part cannot start or end with a dot";
        } else if (emailValue.includes("..")) {
          errors.email = "Email cannot contain consecutive dots";
        } else if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailValue)) {
          errors.email = "Invalid email format";
        }
      }
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    
    // Real-time Validation
    const errors = validate(updatedData);
    setFormError(prev => ({
      ...prev,
      [name]: errors[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      dispatch(loginUser(formData))
        .unwrap()
        .then((res) => {
          const p = res.user.preferences;
          const noPrefs = !p || p === "" || p === "null" || p === "[]";
          if (noPrefs) {
            navigate("/preferences");
          } else {
            navigate("/dashboard");
          }
          if (onClose) {
            setTimeout(() => onClose(), 100);
          }
        })
        .catch(() => {
          // Backend rejection handled by authslice
        });
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
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                autoComplete="chrome-off"
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
                  autoComplete="new-password"
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

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="signup-link">
              Don't have an account? <span style={{color: '#6366F1', fontWeight: 600, cursor: 'pointer'}} onClick={handleSwitchToSignup}>Sign Up</span>
            </p>
          </form>
        </div>

        <div className="login-image-side">
          {authImages.map((img, index) => (
            <div 
              key={index} 
              className={`auth-slide ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img.url})` }}
            >
              <div className="glass-overlay">
                <h2>{img.title}</h2>
                <p>{img.desc}</p>
              </div>
            </div>
          ))}

          <div className="auth-slider-dots">
            {authImages.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;