import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import { API_BASE_URL } from "../../config";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId || userId === "null" || userId === "undefined") {
        setRepositories([]);
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(Array.isArray(data?.repositories) ? data.repositories : []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error while fetching all repositories: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(repositories || []);
    } else {
      const filteredRepo = (repositories || []).filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Left Sidebar: User's Repositories */}
        <aside className="dashboard-sidebar-left">
          <div className="sidebar-header">
            <h3>Top Repositories</h3>
            <Link to="/create" className="gh-btn-sidebar-new">
              + New
            </Link>
          </div>

          <div className="repo-search-box">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find a repository..."
              className="gh-input search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="user-repos-list">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((repo) => (
                <Link
                  to={`/repo/${repo._id}`}
                  key={repo._id}
                  className="user-repo-item"
                >
                  <span className="repo-icon">📘</span>
                  <div className="repo-meta-col">
                    <span className="repo-item-name">{repo.name}</span>
                    {repo.description && (
                      <span className="repo-item-desc">{repo.description}</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-repos-box">
                <p>No repositories found.</p>
                <Link to="/create" className="gh-link-create">
                  Create your first repository
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Feed: Explore Repositories */}
        <main className="dashboard-main-feed">
          <div className="feed-banner">
            <h2>Welcome to GitHub</h2>
            <p>
              Explore open repositories, collaborate on issues, or manage your
              own projects with custom version control.
            </p>
          </div>

          <div className="feed-section">
            <div className="feed-section-header">
              <h3>Explore Public Repositories</h3>
              <span className="feed-count">
                {suggestedRepositories.length} available
              </span>
            </div>

            <div className="suggested-repos-grid">
              {suggestedRepositories && suggestedRepositories.length > 0 ? (
                suggestedRepositories.map((repo) => (
                  <div key={repo._id} className="suggested-repo-card">
                    <div className="card-top">
                      <Link
                        to={`/repo/${repo._id}`}
                        className="suggested-repo-name"
                      >
                        <span className="repo-icon">📕</span>
                        <span>{repo.name}</span>
                      </Link>
                      <span className="badge-visibility">
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                    </div>

                    <p className="suggested-repo-desc">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="card-footer">
                      <span className="owner-tag">
                        Owner: <strong>{repo.owner?.username || "Developer"}</strong>
                      </span>
                      <Link to={`/repo/${repo._id}`} className="view-btn">
                        View Code &amp; Issues &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="feed-empty-card">
                  <h4>No public repositories yet</h4>
                  <p>Be the first to publish a project on the platform!</p>
                  <Link to="/create" className="gh-btn-primary">
                    Create Repository
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar: CLI & Events */}
        <aside className="dashboard-sidebar-right">
          <div className="sidebar-card">
            <h4>CLI Version Control</h4>
            <p className="sidebar-card-subtitle">
              Manage your repositories from the terminal:
            </p>
            <div className="cli-commands-list">
              <div className="cli-item">
                <code>node index.js init</code>
                <span>Initialise repo</span>
              </div>
              <div className="cli-item">
                <code>node index.js add &lt;file&gt;</code>
                <span>Stage file</span>
              </div>
              <div className="cli-item">
                <code>node index.js commit &lt;msg&gt;</code>
                <span>Commit changes</span>
              </div>
              <div className="cli-item">
                <code>node index.js push</code>
                <span>Push commits</span>
              </div>
              <div className="cli-item">
                <code>node index.js pull</code>
                <span>Pull commits</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Upcoming Events</h4>
            <ul className="events-list">
              <li>
                <span className="event-date">Dec 15</span>
                <span className="event-title">Tech Conference 2026</span>
              </li>
              <li>
                <span className="event-date">Dec 25</span>
                <span className="event-title">Developer Meetup</span>
              </li>
              <li>
                <span className="event-date">Jan 05</span>
                <span className="event-title">React &amp; Node Summit</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Dashboard;
