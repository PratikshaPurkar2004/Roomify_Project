import React, { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {registerUser,clearMessage} from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Registration.css";

const Registration = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const {loading,error,success}=useSelector((state)=>state.auth);
  const[errors,setErrors]=useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occupation: "",
    password: "",
    user_type: "",
    gender: "",
  });

  const validate=()=>{
    let newErrors={};
    if(!formData.name.trim())newErrors.name="Name is Reqiured";
    if(!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))newErrors.email="Invalid Email";
    if(formData.password.length<6)newErrors.password="password must be 6+ didgit";
    if(!formData.user_type)newErrors.user_type="Select Role";
    if(!formData.gender)newErrors.gender="Select gender";
    return newErrors;
  }

 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGender = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    const validationErrors=validate();
    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(registerUser(formData));
  };

  useEffect(()=>{
    if(success){
      setTimeout(()=>{
        dispatch(clearMessage());
        navigate("/login");
      },1500);
    }
  },[success,navigate,dispatch]);
   
  return (
    <div className="overlay">
      <div className="card">
        <h2>Create Account</h2>
        <p className="subtext">Please fill details to continue</p>

        {error && <p className="error">{error}</p>}
        {success && (<p className="success">Registered Successfully!</p>)}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" onChange={handleChange}/>
          {errors.name && (<p className="field-error">{errors.name}</p>)}

          <input type="email" name="email" placeholder="Email Address" onChange={handleChange}/>
          {errors.email && (<p className="field-error">{errors.email}</p>)}

          <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
          {errors.password && (<p className="field-error">{errors.password}</p>)}

          <input type="text" name="occupation" placeholder="Your Occupation" onChange={handleChange}/>

          <select name="user_type" onChange={handleChange} defaultValue="">
            <option value="" disabled>
              Select Role
            </option>
            <option value="Host">Host</option>
            <option value="Finder">Finder</option>
          </select>
          {errors.user_type && (<p className="field-error">{errors.user_type}</p>)}

          <div className="gender">
            <button type="button"
              className={formData.gender === "Male" ? "active" : ""}
              onClick={() => handleGender("Male")}>
              Male
            </button>

            <button type="button"
              className={formData.gender === "Female" ? "active" : ""}
              onClick={() => handleGender("Female")}>
              Female
            </button>
          </div>
          {errors.gender && (<p className="field-error">{errors.gender}</p>)}
         
          <button type="submit" className="register-btn">
           {loading ?"Registering...": "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;