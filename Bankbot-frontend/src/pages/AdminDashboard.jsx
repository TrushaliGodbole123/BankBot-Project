import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(""); // what box is opened
  const [logs, setLogs] = useState([]);
  const [intents, setIntents] = useState([]);
  const [users, setUsers] = useState([]);

  // API URLS
  const API_LOGS = "http://localhost:5001/admin/logs";
  const API_INTENTS = "http://localhost:5001/admin/intents";
  const API_USERS = "http://localhost:5001/admin/users";

  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  // Load data when section opens
  const loadData = async (type) => {
    setActiveSection(type);

    if (type === "logs") {
      const res = await fetch(API_LOGS);
      setLogs(await res.json());
    }

    if (type === "intents") {
      const res = await fetch(API_INTENTS);
      setIntents(await res.json());
    }

    if (type === "users") {
      const res = await fetch(API_USERS);
      setUsers(await res.json());
    }
  };

  return (
    <div className="admin-container">
      
      <header className="admin-header">
        <h1>Trust Bank – Admin Dashboard</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <div className="dashboard-boxes">

        {/* Box 1 - Logs */}
        <div className="box" onClick={() => loadData("logs")}>
          <h2>📜 Last 24 Hours Logs</h2>
          <p>View all user chat interactions</p>
        </div>

        {/* Box 2 - Intent Management */}
        <div className="box" onClick={() => loadData("intents")}>
          <h2>🤖 Intent Management</h2>
          <p>Add, Edit or Delete Intents</p>
        </div>

        {/* Box 3 - User Management */}
        <div className="box" onClick={() => loadData("users")}>
          <h2>👤 User Management</h2>
          <p>View & Manage Users</p>
        </div>

      </div>

      {/* SECTIONS CONTENT */}
      <div className="section-content">

        {activeSection === "logs" && (
          <div>
            <h2>📜 User Chat Logs (Last 24 Hours)</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Message</th>
                  <th>User Email</th>
                  <th>Bot Reply</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.user_message}</td>
                    <td>{log.user_email}</td>
                    <td>{log.bot_reply}</td>
                    <td>{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "intents" && (
          <div>
            <h2>🤖 Intent List</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Intent Name</th>
                  <th>Examples</th>
                </tr>
              </thead>
              <tbody>
                {intents.map((item, i) => (
                  <tr key={i}>
                    <td>{item.intent_name}</td>
                    <td>{item.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "users" && (
  <div>
    <h2>👤 Registered Users</h2>
    <table className="data-table">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Signup Time</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={i}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.created_at}</td>
          </tr>
        ))}
      </tbody>
     </table>
    </div>
     )}

      </div>
    </div>
  );
}
