import React, { useState } from "react";
import "./Login.css"; // custom styles

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Login successful!");
        localStorage.setItem("token", data.token); // ✅ Store token
        localStorage.setItem("user", JSON.stringify(data.user));  
        window.location.href = "/dashboard";
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center min-vh-100">
      <div className="overlay"></div>
      <div className="login-card text-center p-4 p-md-5">
        <img src="/logo-wt.svg" alt="logo" className="mb-3 mx-auto d-block logo-img" />
        <h1 className="h4 mb-2 text-white">Welcome to Fivepluz</h1>
        <p className="text-white-75 mb-4">Please login to continue dev</p>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control custom-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control custom-input"
            required
          />
          <button type="submit" className="btn btn-custom mt-2">
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-3 ${message.includes("❌") ? "text-danger" : "text-success"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
