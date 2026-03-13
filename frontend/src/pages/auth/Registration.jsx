import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessage } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Registration.css";

const Registration = () => {

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
    user_type: "",
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

    if ((formData.password || "").length < 6)
      newErrors.password = "Password must be at least 6 characters";

    // Trim whitespace for comparison so users don't get a false mismatch
    const password = (formData.password || "").trim();
    const confirmPassword = (formData.confirmPassword || "").trim();
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.user_type)
      newErrors.user_type = "Select Role";

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

    const { confirmPassword, ...data } = formData;

    dispatch(registerUser(data));

  };

  useEffect(() => {
    if (success) {
      // Clear any existing user session to prevent auto-redirect to dashboard
      localStorage.removeItem("user");

      dispatch(clearMessage());
      navigate("/login");
    }
  }, [success, navigate, dispatch]);

  return (

    <div className="register-container">

      <div className="register-card">
        <p className="logo-subtitle">Create Your Account</p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && <p className="field-error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && <p className="field-error">{errors.email}</p>}

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

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {errors.confirmPassword &&
            <p className="field-error">{errors.confirmPassword}</p>
          }

          <input
            type="text"
            name="occupation"
            placeholder="Your Occupation"
            value={formData.occupation}
            onChange={handleChange}
          />

          <select name="user_type" value={formData.user_type} onChange={handleChange}>
            <option value="" disabled>Select Role</option>
            <option value="Host">Host</option>
            <option value="Finder">Finder</option>
          </select>

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

          <button type="submit" className="register-btn">
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Registration;