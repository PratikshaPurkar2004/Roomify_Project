// import React, { useState } from "react";
// import axios from "axios";
// import { Link,useNavigate } from "react-router-dom";
// import "./Login.css";

// function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const[message,setMessage]=useState("");
//   const[formData,setFormData]=useState({
//     email:"",
//     password:"",
//   });
//   const navigate=useNavigate();

//   const handleChange=(e)=>{
//     setFormData({
//       ...formData,
//       [e.target.name]:e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try{
//       const res=await axios.post("http://localhost:5000/api/auth/login",formData);
//       setMessage("Login successful!");
//       setTimeout(()=>{
//         navigate("/dashboard");
//       },1000);
    
//   } catch(err){
//     setMessage("❌ Login failed.");
//   }   
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2>Welcome Back 👋</h2>
//         {message && <p className="login-message">{message}</p>}
//         <form onSubmit={handleSubmit}>
          
//           <div className="input-group">
//             <label>Email</label>
//             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
//           </div>

//           <div className="input-group">
//             <label>Password</label>
//             <div className="password-wrapper">
//               <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
//               <span
//                 className="toggle-password"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 👁
//               </span>
//             </div>
//           </div>

//           <div className="forgot">
//             <Link to="/forgot-password">Forgot Password?</Link>
//           </div>

//           <button type="submit" className="login-btn">
//             Login
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React,{useState} from 'react'
import{useDispatch,useSelector}from "react-redux";
import {loginUser} from "../../redux/authSlice";
import {Link,useNavigate}from "react-router-dom";
import"../../styles/Login.css";

const Login = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const{loading,error,user}=useSelector((state)=>state.auth);
  const[showPassword,setShowPassword]=useState(false);
  const [formData,setFormData]=useState(
    {
      email:"",
      password:"",
    }
  );

  const[formError,setFormError]=useState({});
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });
  };

  const validate=()=>{
    let errors={};
    if(!formData.email){
      errors.email="Email is required";
    }
    else if(!/\S+@\S+\.\S+/.test(formData.email)){
      errors.email="Invalid email format";
    }

    if(!formData.password){
      errors.password="Password is required";
    }
    else if(formData.password.length<6){
      errors.password="Password must be at least 6 digit";
    }
    return errors;
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const errors=validate();
    setFormError(errors);

    if(Object.keys(errors).length===0){
      const result=await dispatch(loginUser(formData));

      if(result.meta.requestStatus==="fulfilled"){
        navigate("/dashboard");
      }
    }
  }
  return (
    <div className='login-container'>
      <div className='login-card'>
        <h1>Welcome Back!</h1>
        {error && <p className='login-error'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label> <b>Email :</b></label>
            <input type="email" name="email" placeholder="enter your email" value={formData.email} onChange={handleChange} />
            {formError.email && (<p className='Field-error'>{formError.email}</p>)}
          </div>

          <div className='input-group'>
            <label><b>Password :</b></label>
            <div className='password-wrapper'>
              <input type={showPassword ? "text":"password"} name="password" value={formData.password} onChange={handleChange} placeholder="enter your password" />
              <span className="toggle-password" onClick={()=>setShowPassword(!showPassword)}>👁</span>
            </div>
            {formError && (<p className="field-error">{formError.password}</p>)}
          </div>
          <div className='forgot'>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className='login-btn' disabled={loading}>{loading?"loding in.....":"Login"}</button>
        </form>
      </div>
      
    </div>
  )
}

export default Login;