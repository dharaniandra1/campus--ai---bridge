import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      navigate(res.data.role === "admin" ? "/admin-dashboard" : "/dashboard");
    } catch (err) {
      setError(err.displayMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Placement readiness platform</p>
        <h1>Campus AI Bridge</h1>
        <p>
          A focused workspace for students and admins to track skills, tasks, placement
          readiness, resume quality, and AI-assisted interview preparation.
        </p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control mb-4"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center muted mt-3 mb-0">
          Need a new admin account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
