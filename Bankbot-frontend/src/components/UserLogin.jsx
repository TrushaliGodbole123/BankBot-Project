
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/user/login";

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Save user token or ID
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_email", email); // save email for chat logs
        

        alert("Login Successful!");

        navigate("/chat"); // redirect to chatbot
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="bank-title">Trust Bank</h2>
        <h3 className="login-title">User Login</h3>

        <input
          className="login-input"
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={loginUser}>
          Login
        </button>

        <p className="small-text">
          Are you an Admin? <a href="/admin/login">Login here</a>
        </p>

        <p className="small-text">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
