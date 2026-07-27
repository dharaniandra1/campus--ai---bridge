import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", formData);
      setMessage("Account created. You can login now.");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err.displayMessage || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Create access</p>
        <h1>Start with a clean account</h1>
        <p>
          Register a student or admin user for Campus AI Bridge. Admins can manage
          students and tasks; students can work through AI placement tools.
        </p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <label className="form-label">Name</label>
        <input name="name" className="form-control mb-3" value={formData.name} onChange={handleChange} required />

        <label className="form-label">Email</label>
        <input type="email" name="email" className="form-control mb-3" value={formData.email} onChange={handleChange} required />

        <label className="form-label">Password</label>
        <input type="password" name="password" className="form-control mb-3" value={formData.password} onChange={handleChange} required />

        <label className="form-label">Role</label>
        <select name="role" className="form-select mb-4" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center muted mt-3 mb-0">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
