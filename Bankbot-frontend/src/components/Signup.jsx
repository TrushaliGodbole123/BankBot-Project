
// import React, { useState } from "react";
// import "./Login.css";

// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const signup = async () => {
//     const res = await fetch("http://localhost:5001/user/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, password }),
//     });

//     const data = await res.json();
//     if (data.success) {
//       alert("Register successful! Now login.");
//       window.location.href = "/";
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2 className="bank-title">Trust Bank</h2>
//         <h3 className="login-title">Create an Account</h3>

//         <input
//           className="login-input"
//           placeholder="Full Name"
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           className="login-input"
//           type="email"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="login-input"
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="login-btn" onClick={signup}>Sign Up</button>

//         <p className="small-text">
//           Already a user? <a href="/">Login here</a>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "./Login.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration successful! Please login now.");

        // Save user name locally (optional)
        localStorage.setItem("user_name", username);

        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="bank-title">Trust Bank</h2>
        <h3 className="login-title">Create an Account</h3>

        <input
          className="login-input"
          placeholder="Full Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={signup}>
          Sign Up
        </button>

        <p className="small-text">
          Already a user? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}
