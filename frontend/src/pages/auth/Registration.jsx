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

  const validate = () => {

    let newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Name is required";

    if (!formData.email)
      newErrors.email = "Email is required";

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid Email";

   const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!strongPasswordRegex.test(formData.password)) {
  newErrors.password ="Password must include uppercase, lowercase, number & special character";
}

    // Trim whitespace for comparison so users don't get a false mismatch
    const password = (formData.password || "").trim();
    const confirmPassword = (formData.confirmPassword || "").trim();
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.gender)
      newErrors.gender = "Select gender";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleGender = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));

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
      navigate("/preferences");
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
             
             {/* Creative Elements */}
             <div className="floating-cards-container">
               <div className="floating-card fc-2">
                 <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" alt="user" />
                 <div>
                   <p>Mike T.</p>
                   <span>Listed a room 🏠</span>
                 </div>
               </div>
             </div>

             <div className="glass-overlay">
               <h2>Find your people.</h2>
               <p>Create your account in seconds and unlock smart matching, verified profiles, and seamless direct messaging.</p>
             </div>
          </div>
          
          <div className="register-form-side">
            <div className="logo auth-brand">Roomify</div>
            <h1>Create Account</h1>
            <p className="subtitle">Join our community and start exploring.</p>
            
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
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
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
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

              <button type="submit" className="register-btn">
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
