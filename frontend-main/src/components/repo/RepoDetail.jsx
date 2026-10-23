import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";
import { API_BASE_URL } from "../../config";
import "./repoDetail.css";

const RepoDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code"); // 'code' | 'issues'
  const [error, setError] = useState("");

  // New Issue Form state
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDesc, setNewIssueDesc] = useState("");
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => {
    fetchRepoData();
  }, [id]);

  const fetchRepoData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/repo/${id}`);
      // res.data can be array of 1 or object
      const repoData = Array.isArray(res.data) ? res.data[0] : res.data;
      setRepo(repoData);

      if (repoData && repoData._id) {
        try {
          const issuesRes = await axios.get(
            `${API_BASE_URL}/issue/all/${repoData._id}`
          );
          setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
        } catch (issueErr) {
          console.error("Could not fetch issues:", issueErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Repository not found or error loading repository.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;

    try {
      setIssueLoading(true);
      const res = await axios.post(`${API_BASE_URL}/issue/create/${id}`, {
        title: newIssueTitle.trim(),
        description: newIssueDesc.trim(),
        repository: id,
      });

      if (res.data) {
        setIssues((prev) => [res.data, ...prev]);
        setNewIssueTitle("");
        setNewIssueDesc("");
        setShowNewIssue(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create issue.");
    } finally {
      setIssueLoading(false);
    }
  };

  const handleDeleteRepo = async () => {
    if (!window.confirm("Are you sure you want to delete this repository?")) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/repo/delete/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete repository.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-loading">Loading repository...</div>
      </>
    );
  }

  if (error || !repo) {
    return (
      <>
        <Navbar />
        <div className="repo-error-container">
          <h2>Repository Not Found</h2>
          <p>{error || "The repository you requested does not exist."}</p>
          <Link to="/" className="gh-btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </>
    );
  }

  const isOwner =
    currentUser &&
    (repo.owner?._id === currentUser || repo.owner === currentUser);

  return (
    <>
      <Navbar />
      <div className="repo-detail-page">
        {/* Repo Header */}
        <div className="repo-header">
          <div className="repo-header-main">
            <span className="repo-path">
              <span className="repo-owner-name">
                {repo.owner?.username || "user"}
              </span>{" "}
              / <strong className="repo-title">{repo.name}</strong>
            </span>
            <span className="repo-badge">
              {repo.visibility ? "Public" : "Private"}
            </span>
          </div>

          <div className="repo-header-actions">
            {isOwner && (
              <button onClick={handleDeleteRepo} className="gh-btn-danger">
                Delete repository
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="repo-tabs">
          <button
            className={`repo-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            &lt;&gt; Code
          </button>
          <button
            className={`repo-tab ${activeTab === "issues" ? "active" : ""}`}
            onClick={() => setActiveTab("issues")}
          >
            ⊙ Issues <span className="tab-count">{issues.length}</span>
          </button>
        </div>

        {/* Tab: Code */}
        {activeTab === "code" && (
          <div className="repo-content-area">
            {repo.description && (
              <p className="repo-desc-box">{repo.description}</p>
            )}

            <div className="clone-box">
              <span className="clone-label">Clone repository:</span>
              <code className="clone-cmd">
                node index.js init &amp;&amp; node index.js pull
              </code>
            </div>

            <div className="repo-files-card">
              <div className="files-header">
                <span>Files</span>
                <span className="commit-info">Latest commit: initial commit</span>
              </div>
              <div className="files-list">
                {repo.content && repo.content.length > 0 ? (
                  repo.content.map((item, idx) => (
                    <div key={idx} className="file-row">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{item}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="file-row">
                      <span className="file-icon">📄</span>
                      <span className="file-name">README.md</span>
                      <span className="file-msg">Initial repository setup</span>
                    </div>
                    <div className="file-row">
                      <span className="file-icon">📁</span>
                      <span className="file-name">src/</span>
                      <span className="file-msg">Source files</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="readme-box">
              <div className="readme-header">
                <span>📖 README.md</span>
              </div>
              <div className="readme-body">
                <h2>{repo.name}</h2>
                <p>
                  {repo.description ||
                    "Welcome to this project! This repository was created on GitHub Clone."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Issues */}
        {activeTab === "issues" && (
          <div className="repo-issues-area">
            <div className="issues-header-bar">
              <span className="issues-count-text">
                {issues.length} {issues.length === 1 ? "Issue" : "Issues"}
              </span>
              <button
                className="gh-btn-primary"
                onClick={() => setShowNewIssue(!showNewIssue)}
              >
                {showNewIssue ? "Close form" : "New Issue"}
              </button>
            </div>

            {showNewIssue && (
              <form onSubmit={handleCreateIssue} className="new-issue-form">
                <h3>Open a new issue</h3>
                <input
                  type="text"
                  placeholder="Title"
                  className="gh-input"
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Leave a comment / description"
                  className="gh-input"
                  rows={4}
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                />
                <div className="form-actions">
                  <button
                    type="submit"
                    className="gh-btn-primary"
                    disabled={issueLoading}
                  >
                    {issueLoading ? "Submitting..." : "Submit new issue"}
                  </button>
                  <button
                    type="button"
                    className="gh-btn-cancel"
                    onClick={() => setShowNewIssue(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="issues-list">
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <div key={issue._id} className="issue-item">
                    <span className="issue-icon-open">⊙</span>
                    <div className="issue-info">
                      <h4 className="issue-title">{issue.title}</h4>
                      {issue.description && (
                        <p className="issue-desc">{issue.description}</p>
                      )}
                      <span className="issue-meta">
                        Status: <strong>{issue.status || "open"}</strong>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-issues">
                  <h3>There aren’t any open issues.</h3>
                  <p>
                    Issues are used to track todos, bugs, feature requests, and
                    more.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RepoDetail;
