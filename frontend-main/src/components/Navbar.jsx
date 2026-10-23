import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";
import { useAuth } from "../authContext";

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  return (
    <nav className="gh-navbar">
      <div className="gh-navbar-left">
        <Link to="/" className="gh-brand">
          <img src={logo} alt="GitHub" className="gh-logo" />
          <span className="gh-brand-name">GitHub</span>
        </Link>
        <div className="gh-nav-links">
          <Link
            to="/"
            className={`gh-nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className={`gh-nav-link ${location.pathname === "/create" ? "active" : ""}`}
          >
            New Repository
          </Link>
        </div>
      </div>

      <div className="gh-navbar-right">
        <Link to="/create" className="gh-btn-new">
          <span className="plus-icon">+</span> New
        </Link>
        <Link
          to="/profile"
          className={`gh-nav-link ${location.pathname === "/profile" ? "active" : ""}`}
        >
          Profile
        </Link>
        {currentUser && (
          <button onClick={logout} className="gh-btn-logout" title="Sign out">
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
