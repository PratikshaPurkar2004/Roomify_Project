import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessage } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Registration.css";

const Registration = ({ onClose, onSwitch }) => {  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occupation: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });

  const [currentImage, setCurrentImage] = useState(0);

  const registerImages = [
    {
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1469&auto=format&fit=crop",
      title: "Find your people.",
      desc: "Create your account in seconds and unlock smart matching, verified profiles, and seamless direct messaging."
    },
    {
      url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1500&auto=format&fit=crop",
      title: "Share experiences.",
      desc: "Connect with roommates who share your lifestyle and hobbies."
    },
    {
      url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1500&auto=format&fit=crop",
      title: "Safe & verified.",
      desc: "Every profile undergoes verification to ensure your peace of mind."
    }
  ];

  useEffect(() => {
    // Clear any previous error messages when the component mounts
    dispatch(clearMessage());
    
    // Reset local form data explicitly just in case
    setFormData({
      name: "",
      email: "",
      occupation: "",
      password: "",
      confirmPassword: "",
      gender: ""
    });
    setErrors({});

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % registerImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [dispatch, registerImages.length]);

  const validate = (data = formData) => {
    let newErrors = {};

    // Name Validation: No numbers or special characters allowed
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(data.name)) {
      newErrors.name = "Numbers are not allowed in name";
    } else if (/[^a-zA-Z\s]/.test(data.name)) {
      newErrors.name = "Special characters are not allowed in name";
    }

    // Strict Email Validation (RFC Standards)
    if (!data.email) {
      newErrors.email = "Email is required";
    } else {
      const emailValue = data.email;
      const parts = emailValue.split("@");
      
      if (emailValue.length > 320) {
        newErrors.email = "Email cannot exceed 320 characters";
      } else if (emailValue.includes(" ")) {
        newErrors.email = "Email cannot contain spaces";
      } else if (parts.length !== 2) {
        newErrors.email = "Email must contain exactly one @ symbol";
      } else {
        const [localPart, domainPart] = parts;
        
        if (localPart.length > 64) {
          newErrors.email = "Local part cannot exceed 64 characters";
        } else if (domainPart.length > 255) {
          newErrors.email = "Domain part cannot exceed 255 characters";
        } else if (localPart.startsWith(".") || localPart.endsWith(".")) {
          newErrors.email = "Local part cannot start or end with a dot";
        } else if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
          newErrors.email = "Domain part cannot start or end with a dot";
        } else if (emailValue.includes("..")) {
          newErrors.email = "Email cannot contain consecutive dots";
        } else if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailValue)) {
          newErrors.email = "Invalid email format";
        }
      }
    }

    // Password Validation: At least one uppercase, one lowercase, one digit, and one special character
    const password = data.password || "";
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!(hasLowercase && hasUppercase && hasDigit && hasSpecial)) {
      newErrors.password = "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    // Confirm Password
    if (data.confirmPassword && password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!data.gender && data.gender !== undefined)
      newErrors.gender = "Select gender";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    
    setFormData(updatedData);

    // Real-time Validation
    const validationErrors = validate(updatedData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
    
    // If confirmation changes, also re-validate confirmPassword if it exists
    if (name === "password" && updatedData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: updatedData.password !== updatedData.confirmPassword ? "Passwords do not match" : undefined
      }));
    }
  };

  const handleGender = (value) => {
    const updatedData = { ...formData, gender: value };
    setFormData(updatedData);

    setErrors((prev) => ({
      ...prev,
      gender: undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (success) {
      localStorage.removeItem("user");
      dispatch(clearMessage());
      navigate("/login");
    }
  }, [success, navigate, dispatch]);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    if (onSwitch) onSwitch();
    else navigate("/login");
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="register-container" onClick={(e) => e.stopPropagation()} style={{ background: 'transparent', minHeight: 'auto', padding: 0 }}>
        <div className="register-card modal-login">
          <span className="close-btn" onClick={handleClose}>×</span>
          
          <div className="register-image-side">
            {registerImages.map((img, index) => (
              <div 
                key={index} 
                className={`auth-slide ${index === currentImage ? 'active' : ''}`}
                style={{ backgroundImage: `url(${img.url})` }}
              >
                {/* Floating Card (Only on first slide for effect) */}

                
                <div className="glass-overlay">
                  <h2>{img.title}</h2>
                  <p>{img.desc}</p>
                </div>
              </div>
            ))}

            <div className="auth-slider-dots">
              {registerImages.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                ></span>
              ))}
            </div>
          </div>
          
          <div className="register-form-side">
            <div className="logo auth-brand">Roomify</div>
            <h1>Create Account</h1>
            <p className="subtitle">Join our community and start exploring.</p>
            
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="chrome-off"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="chrome-off"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      👁
                    </span>
                  </div>
                  {errors.password && <p className="field-error">{errors.password}</p>}
                </div>

                <div className="input-group">
                  <label>Confirm</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      👁
                    </span>
                  </div>
                  
                  {errors.confirmPassword && (
                    <p className="field-error">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Your Occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="input-group">
                  <label>Gender</label>
                  <div className="gender">
                    <button
                      type="button"
                      className={formData.gender === "Male" ? "active" : ""}
                      onClick={() => handleGender("Male")}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      className={formData.gender === "Female" ? "active" : ""}
                      onClick={() => handleGender("Female")}
                    >
                      Female
                    </button>
                  </div>
                  {errors.gender && <p className="field-error">{errors.gender}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Account"}
              </button>

              <p className="login-link">
                Already have an account? <span style={{color: '#6366F1', fontWeight: 600, cursor: 'pointer'}} onClick={handleSwitchToLogin}>Sign In</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
