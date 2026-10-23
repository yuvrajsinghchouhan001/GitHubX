// In-browser mock backend service for GitHub Pages / static hosting
// Allows full interactive demo (Signup, Login, Repos, Issues, Profile) directly in the browser

const INITIAL_REPOS = [
  {
    _id: "repo_default_1",
    name: "github-clone-mern",
    description: "A complete GitHub replica with custom version control built in React & Node.",
    visibility: true,
    owner: "system",
    content: ["README.md", "src/", "package.json"],
    issues: ["issue_1", "issue_2"]
  },
  {
    _id: "repo_default_2",
    name: "algorithm-visualizer",
    description: "Interactive visualizer for sorting, pathfinding, and graph algorithms.",
    visibility: true,
    owner: "system",
    content: ["index.html", "script.js", "style.css"],
    issues: ["issue_3"]
  },
  {
    _id: "repo_default_3",
    name: "react-ui-components",
    description: "A sleek modern dark-mode component library inspired by Primer CSS.",
    visibility: true,
    owner: "system",
    content: ["Button.jsx", "Modal.jsx", "Navbar.jsx"],
    issues: []
  }
];

const INITIAL_ISSUES = [
  {
    _id: "issue_1",
    title: "Feature: Add dark/light mode toggle",
    description: "Support system preference theme detection and manual toggle.",
    repository: "repo_default_1",
    status: "open"
  },
  {
    _id: "issue_2",
    title: "Optimize heat map rendering for mobile",
    description: "Heatmap grid overflows horizontally on screens smaller than 600px.",
    repository: "repo_default_1",
    status: "closed"
  },
  {
    _id: "issue_3",
    title: "Add Dijkstra shortest path algorithm",
    description: "Implement step-by-step visual exploration of visited nodes.",
    repository: "repo_default_2",
    status: "open"
  }
];

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Initialize seed data if not present
if (!localStorage.getItem("mock_repos")) {
  setStorage("mock_repos", INITIAL_REPOS);
}
if (!localStorage.getItem("mock_issues")) {
  setStorage("mock_issues", INITIAL_ISSUES);
}
if (!localStorage.getItem("mock_users")) {
  setStorage("mock_users", [
    {
      _id: "user_yuvraj",
      username: "yuvrajsinghchouhan001",
      email: "yuvraj@example.com",
      password: "password123"
    }
  ]);
}

export function handleMockRequest(method, urlStr, bodyData) {
  const normMethod = (method || "GET").toUpperCase();
  // Strip protocol and host
  let path = urlStr.replace(/^https?:\/\/[^/]+/, "");
  if (!path.startsWith("/")) path = "/" + path;

  // 1. POST /signup
  if (normMethod === "POST" && path === "/signup") {
    const { username, email, password } = bodyData || {};
    const users = getStorage("mock_users", []);
    
    // Check if user already exists
    let existing = users.find(u => u.username === username || u.email === email);
    if (existing) {
      // Allow re-login directly or return user
      return {
        status: 200,
        data: {
          token: "mock_jwt_" + existing._id,
          userId: existing._id,
          message: "Welcome back!"
        }
      };
    }

    const newUser = {
      _id: "user_" + Date.now(),
      username: username || "Developer",
      email: email || "dev@example.com",
      password: password || "password"
    };
    users.push(newUser);
    setStorage("mock_users", users);

    return {
      status: 200,
      data: {
        token: "mock_jwt_" + newUser._id,
        userId: newUser._id
      }
    };
  }

  // 2. POST /login
  if (normMethod === "POST" && path === "/login") {
    const { email, password } = bodyData || {};
    const users = getStorage("mock_users", []);
    let user = users.find(u => u.email === email);

    if (!user) {
      // Auto-register demo user so they are never blocked
      user = {
        _id: "user_" + Date.now(),
        username: email ? email.split("@")[0] : "Developer",
        email: email || "dev@example.com",
        password: password || "password"
      };
      users.push(user);
      setStorage("mock_users", users);
    }

    return {
      status: 200,
      data: {
        token: "mock_jwt_" + user._id,
        userId: user._id
      }
    };
  }

  // 3. GET /userProfile/:userId
  const userProfileMatch = path.match(/^\/userProfile\/(.+)$/);
  if (normMethod === "GET" && userProfileMatch) {
    const userId = userProfileMatch[1];
    const users = getStorage("mock_users", []);
    const user = users.find(u => u._id === userId) || {
      _id: userId,
      username: "yuvrajsinghchouhan001",
      email: "yuvraj@example.com"
    };
    return {
      status: 200,
      data: user
    };
  }

  // 4. GET /repo/user/:userId
  const repoUserMatch = path.match(/^\/repo\/user\/(.+)$/);
  if (normMethod === "GET" && repoUserMatch) {
    const userId = repoUserMatch[1];
    const repos = getStorage("mock_repos", []);
    const userRepos = repos.filter(r => r.owner === userId || r.owner === "system");
    return {
      status: 200,
      data: {
        repositories: userRepos
      }
    };
  }

  // 5. GET /repo/all
  if (normMethod === "GET" && path === "/repo/all") {
    const repos = getStorage("mock_repos", []);
    return {
      status: 200,
      data: repos
    };
  }

  // 6. POST /repo/create
  if (normMethod === "POST" && path === "/repo/create") {
    const { owner, name, description, visibility } = bodyData || {};
    const repos = getStorage("mock_repos", []);
    const newRepo = {
      _id: "repo_" + Date.now(),
      name: name || "new-repository",
      description: description || "Created via GitHubX",
      visibility: visibility !== undefined ? visibility : true,
      owner: owner || localStorage.getItem("userId") || "user_current",
      content: ["README.md"],
      issues: []
    };
    repos.unshift(newRepo);
    setStorage("mock_repos", repos);

    return {
      status: 201,
      data: newRepo
    };
  }

  // 7. GET /repo/:id
  const repoDetailMatch = path.match(/^\/repo\/([^/]+)$/);
  if (normMethod === "GET" && repoDetailMatch) {
    const id = repoDetailMatch[1];
    const repos = getStorage("mock_repos", []);
    const repo = repos.find(r => r._id === id) || repos[0];
    return {
      status: 200,
      data: repo
    };
  }

  // 8. DELETE /repo/delete/:id
  const repoDeleteMatch = path.match(/^\/repo\/delete\/(.+)$/);
  if (normMethod === "DELETE" && repoDeleteMatch) {
    const id = repoDeleteMatch[1];
    let repos = getStorage("mock_repos", []);
    repos = repos.filter(r => r._id !== id);
    setStorage("mock_repos", repos);
    return {
      status: 200,
      data: { message: "Repository deleted successfully" }
    };
  }

  // 9. GET /issue/all/:repoId
  const issueAllMatch = path.match(/^\/issue\/all\/(.+)$/);
  if (normMethod === "GET" && issueAllMatch) {
    const repoId = issueAllMatch[1];
    const issues = getStorage("mock_issues", []);
    const repoIssues = issues.filter(i => i.repository === repoId);
    return {
      status: 200,
      data: repoIssues
    };
  }

  // 10. POST /issue/create/:repoId
  const issueCreateMatch = path.match(/^\/issue\/create\/(.+)$/);
  if (normMethod === "POST" && issueCreateMatch) {
    const repoId = issueCreateMatch[1];
    const { title, description } = bodyData || {};
    const issues = getStorage("mock_issues", []);
    const newIssue = {
      _id: "issue_" + Date.now(),
      title: title || "New Issue",
      description: description || "",
      repository: repoId,
      status: "open",
      createdAt: new Date().toISOString()
    };
    issues.unshift(newIssue);
    setStorage("mock_issues", issues);
    return {
      status: 200,
      data: newIssue
    };
  }

  return null;
}
