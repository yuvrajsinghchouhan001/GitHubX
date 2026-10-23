import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { API_BASE_URL } from "../../config";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [userDetails, setUserDetails] = useState({ username: "Developer" });
  const [userRepos, setUserRepos] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'repositories' | 'starred'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = currentUser || localStorage.getItem("userId");

      if (userId && userId !== "null" && userId !== "undefined") {
        try {
          // Fetch user details
          const response = await axios.get(
            `${API_BASE_URL}/userProfile/${userId}`
          );
          if (response.data) {
            setUserDetails(response.data);
          }
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }

        try {
          // Fetch user's repositories
          const repoRes = await axios.get(
            `${API_BASE_URL}/repo/user/${userId}`
          );
          if (repoRes.data && Array.isArray(repoRes.data.repositories)) {
            setUserRepos(repoRes.data.repositories);
          }
        } catch (repoErr) {
          console.error("Cannot fetch user repos: ", repoErr);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <>
      <Navbar />

      <div className="profile-container">
        {/* Profile Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <span className="avatar-initial">
              {userDetails.username ? userDetails.username[0].toUpperCase() : "U"}
            </span>
          </div>

          <div className="profile-names">
            <h2 className="profile-username">{userDetails.username || "User"}</h2>
            {userDetails.email && (
              <span className="profile-email">{userDetails.email}</span>
            )}
          </div>

          <button className="profile-edit-btn">Edit profile</button>

          <div className="profile-stats">
            <span className="stat-item">
              👥 <strong>10</strong> followers
            </span>
            <span>·</span>
            <span className="stat-item">
              <strong>3</strong> following
            </span>
          </div>

          <div className="profile-extra-info">
            <div className="info-row">
              <span>📦</span>
              <span>
                <strong>{userRepos.length}</strong> Repositories
              </span>
            </div>
            <div className="info-row">
              <span>📍</span>
              <span>Earth</span>
            </div>
          </div>

          <button onClick={logout} className="profile-logout-btn">
            Sign out of account
          </button>
        </aside>

        {/* Profile Main Content */}
        <main className="profile-main-content">
          {/* Sub Navigation Bar */}
          <div className="profile-nav-tabs">
            <button
              className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📖 Overview
            </button>
            <button
              className={`nav-tab ${activeTab === "repositories" ? "active" : ""}`}
              onClick={() => setActiveTab("repositories")}
            >
              📁 Repositories{" "}
              <span className="tab-pill">{userRepos.length}</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "starred" ? "active" : ""}`}
              onClick={() => setActiveTab("starred")}
            >
              ★ Starred <span className="tab-pill">0</span>
            </button>
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="tab-pane">
              <div className="profile-section-card">
                <h3>Popular Repositories</h3>
                <div className="profile-repos-grid">
                  {userRepos && userRepos.length > 0 ? (
                    userRepos.slice(0, 4).map((repo) => (
                      <div key={repo._id} className="profile-repo-card">
                        <div className="repo-card-header">
                          <Link to={`/repo/${repo._id}`} className="repo-link">
                            {repo.name}
                          </Link>
                          <span className="repo-badge-pill">
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <p className="repo-card-desc">
                          {repo.description || "No description provided."}
                        </p>
                        <div className="repo-card-meta">
                          <span className="lang-indicator">
                            <span className="lang-color"></span> JavaScript
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-items-card">
                      <p>You haven't created any repositories yet.</p>
                      <Link to="/create" className="gh-btn-primary">
                        Create repository
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Heat Map Section */}
              <div className="profile-section-card">
                <div className="heat-map-wrapper">
                  <HeatMapProfile />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Repositories */}
          {activeTab === "repositories" && (
            <div className="tab-pane">
              <div className="repos-tab-header">
                <h3>All Repositories</h3>
                <Link to="/create" className="gh-btn-primary">
                  + New Repository
                </Link>
              </div>

              <div className="repos-full-list">
                {userRepos && userRepos.length > 0 ? (
                  userRepos.map((repo) => (
                    <div key={repo._id} className="repo-full-row">
                      <div className="repo-row-main">
                        <div className="repo-row-top">
                          <Link to={`/repo/${repo._id}`} className="repo-link-lg">
                            {repo.name}
                          </Link>
                          <span className="repo-badge-pill">
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <p className="repo-row-desc">
                          {repo.description || "No description provided."}
                        </p>
                      </div>
                      <Link to={`/repo/${repo._id}`} className="gh-btn-sm">
                        View Code &rarr;
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="no-items-card">
                    <p>No repositories to display.</p>
                    <Link to="/create" className="gh-btn-primary">
                      Create a Repository
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Starred */}
          {activeTab === "starred" && (
            <div className="tab-pane">
              <div className="no-items-card">
                <h3>No starred repositories yet</h3>
                <p>
                  Star repositories you want to keep track of or show
                  appreciation for.
                </p>
                <Link to="/" className="gh-btn-primary">
                  Explore Repositories
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Profile;
