import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/signup`, {
        email: email.trim(),
        password: password,
        username: username.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message === "Network Error" || !err.response) {
        setError(
          "Cannot connect to the backend server. If you are using the live GitHub Pages link, the backend must be deployed online with HTTPS, or run locally at http://localhost:5173."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Signup failed. Username or email may already be in use."
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <Link to="/auth">
          <img className="logo-login" src={logo} alt="GitHub" />
        </Link>
      </div>

      <div className="login-box-wrapper">
        <h1 className="auth-title">Sign up to GitHub</h1>

        {error && <div className="auth-error-banner">{error}</div>}

        <form className="login-box" onSubmit={handleSignup}>
          <div className="auth-field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              type="text"
              value={username}
              placeholder="e.g. devhero"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="gh-btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Sign in &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
