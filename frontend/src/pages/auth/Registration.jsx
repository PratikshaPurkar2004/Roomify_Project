import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessage } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Registration.css";

<<<<<<< HEAD
const Registration = ({ onClose, onSwitch }) => {
=======
const Registration = ({ onClose, onSwitchToLogin }) => {
>>>>>>> 230cb70 (update home page and preferences page)
  const dispatch = useDispatch();
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
<<<<<<< HEAD
    },
    {
      url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1500&auto=format&fit=crop",
      title: "Safe & verified.",
      desc: "Every profile undergoes verification to ensure your peace of mind."
    }
  ];

  useEffect(() => {
    dispatch(clearMessage());
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
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(data.name)) {
      newErrors.name = "Numbers are not allowed in name";
    }

    if (!data.email) {
      newErrors.email = "Email is required";
    } else {
      const emailValue = data.email.trim();
      const atCount = (emailValue.match(/@/g) || []).length;
      if (atCount !== 1) {
        newErrors.email = "Email must contain exactly one @ symbol";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        newErrors.email = "Invalid email format";
      }
    }

    const password = data.password || "";
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (data.confirmPassword && password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!data.gender) newErrors.gender = "Select gender";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    const validationErrors = validate(updatedData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };

  const handleGender = (value) => {
    setFormData({ ...formData, gender: value });
    setErrors((prev) => ({ ...prev, gender: undefined }));
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
=======
    }
  ];

  useEffect(() => {
    dispatch(clearMessage());
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % registerImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [dispatch, registerImages.length]);
>>>>>>> 230cb70 (update home page and preferences page)

  useEffect(() => {
    if (success) {
      localStorage.removeItem("user");
      dispatch(clearMessage());
<<<<<<< HEAD
      navigate("/login");
=======
      navigate("/dashboard/profile");
      if (onClose) onClose();
>>>>>>> 230cb70 (update home page and preferences page)
    }
  }, [success, navigate, dispatch, onClose]);

  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(data.name)) {
      newErrors.name = "Numbers are not allowed in name";
    }
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!data.user_type) newErrors.user_type = "Select Role";
    if (!data.gender) newErrors.gender = "Select Gender";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/");
  };

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
<<<<<<< HEAD
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
                <div className="glass-overlay">
                  <h2>{img.title}</h2>
                  <p>{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="register-form-side">
            <div className="logo auth-brand">Roomify</div>
            <h1>Create Account</h1>
            <p className="subtitle">Join our community and start exploring.</p>
            
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Password</label>
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                  {errors.password && <p className="field-error">{errors.password}</p>}
                </div>

                <div className="input-group">
                  <label>Confirm</label>
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
                </div>
=======
    <div className={onClose ? "modal-overlay" : "register-page"} onClick={handleClose}>
      <div className="register-container" onClick={(e) => e.stopPropagation()}>
        <div className="register-card">
          {onClose && <span className="close-btn" onClick={handleClose}>×</span>}
          <h1>Create Account</h1>
          <h1 className="logo">🏠 Roomify</h1>
          <p className="subtitle">Join the community</p>

          <form onSubmit={handleSubmit} className="register-form-premium">
            <div className="form-grid-premium">
              <div className="input-group">
                <label>Full Name</label>
                <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="input-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="input-group">
                <label>Birth Date</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Occupation</label>
                <input name="occupation" placeholder="Your Occupation" value={formData.occupation} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
              </div>

              <div className="input-group">
                <label>Select Role</label>
                <select name="user_type" value={formData.user_type} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="Host">Host</option>
                  <option value="Finder">Finder</option>
                </select>
                {errors.user_type && <p className="field-error">{errors.user_type}</p>}
>>>>>>> 230cb70 (update home page and preferences page)
              </div>

              <div className="input-group">
                <label>Gender</label>
<<<<<<< HEAD
                <div className="gender">
                  <button type="button" className={formData.gender === "Male" ? "active" : ""} onClick={() => handleGender("Male")}>Male</button>
                  <button type="button" className={formData.gender === "Female" ? "active" : ""} onClick={() => handleGender("Female")}>Female</button>
                </div>
                {errors.gender && <p className="field-error">{errors.gender}</p>}
              </div>

              <button type="submit" className="register-btn">
                {loading ? "Registering..." : "Create Account"}
              </button>

              <p className="login-link">
                Already have an account? <span style={{color: '#6366F1', fontWeight: 600, cursor: 'pointer'}} onClick={handleSwitchToLogin}>Sign In</span>
              </p>
            </form>
          </div>
=======
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="field-error">{errors.gender}</p>}
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="login-link">
              Already have an account? <span className="switch-link" onClick={onSwitchToLogin || (() => navigate("/login"))}>Login</span>
            </p>
          </form>
        </div>

        <div className="register-image-side">
          {registerImages.map((img, index) => (
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
>>>>>>> 230cb70 (update home page and preferences page)
        </div>
      </div>
    </div>
  );
};

export default Registration;
