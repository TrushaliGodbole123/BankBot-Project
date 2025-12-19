
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/admin/login";

  const loginAdmin = async () => {
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
        localStorage.setItem("admin_logged_in", "true");

        alert("Admin Login Successful!");
        navigate("/admin/dashboard");   // open admin dashboard
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="bank-title">Trust Bank</h2>
        <h3 className="login-title">Admin Login</h3>

        <input
          className="login-input"
          type="email"
          placeholder="Enter Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={loginAdmin}>
          Login
        </button>

        <p className="small-text">
          User? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}
