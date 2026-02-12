import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "12345") {
      alert("✅ Login Successful");
    } else {
      alert("❌ Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input  type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input  type="password"  placeholder="Password"  value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {message && <p className="message">{message}</p>}

        <h4 className="text">
          Don't have an account? <span><Link to="/signup">Signup</Link></span>
        </h4>
      </form>
    </div>
  );
};

export default Login;
