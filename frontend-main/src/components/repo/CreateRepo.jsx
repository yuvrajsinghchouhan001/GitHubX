import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";
import "./createRepo.css";

const CreateRepo = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRepo = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide a repository name.");
      return;
    }

    const userId = currentUser || localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to create a repository.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3002/repo/create", {
        owner: userId,
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description.trim(),
        visibility: visibility,
      });

      if (res.status === 201) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create repository. Make sure the name is unique."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-container">
        <div className="create-repo-header">
          <h1>Create a new repository</h1>
          <p className="create-repo-subtitle">
            A repository contains all project files, revision history, and collaborative discussions.
          </p>
        </div>

        {error && <div className="create-repo-error">{error}</div>}

        <form onSubmit={handleCreateRepo} className="create-repo-form">
          <div className="form-group">
            <label htmlFor="repo-name">
              Repository name <span className="required-star">*</span>
            </label>
            <input
              id="repo-name"
              type="text"
              className="gh-input"
              value={name}
              placeholder="e.g. my-project"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="field-hint">
              Great repository names are short and memorable.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="repo-desc">
              Description <span className="optional-tag">(optional)</span>
            </label>
            <input
              id="repo-desc"
              type="text"
              className="gh-input"
              value={description}
              placeholder="Short description of your project..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="visibility-options">
            <label
              className={`visibility-card ${visibility ? "selected" : ""}`}
              onClick={() => setVisibility(true)}
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility}
                onChange={() => setVisibility(true)}
              />
              <div className="visibility-info">
                <strong>Public</strong>
                <span>Anyone on the internet can see this repository.</span>
              </div>
            </label>

            <label
              className={`visibility-card ${!visibility ? "selected" : ""}`}
              onClick={() => setVisibility(false)}
            >
              <input
                type="radio"
                name="visibility"
                checked={!visibility}
                onChange={() => setVisibility(false)}
              />
              <div className="visibility-info">
                <strong>Private</strong>
                <span>You choose who can see and commit to this repository.</span>
              </div>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="gh-btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
            <button
              type="button"
              className="gh-btn-cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRepo;
