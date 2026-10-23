# GitHubX 🚀

> A full-stack MERN-based GitHub replica with custom version control built from scratch.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge&logo=github)](https://yuvrajsinghchouhan001.github.io/GitHubX/)

🌐 **Live Application Link**: [https://yuvrajsinghchouhan001.github.io/GitHubX/](https://yuvrajsinghchouhan001.github.io/GitHubX/)

---

## 🌟 Features

- **User Authentication**: Secure JWT-based Signup and Login.
- **Repository Management**: Create public/private repositories, view repository files, and delete repositories.
- **Issue Tracking**: Create, list, and manage issues per repository.
- **GitHub Profile & Heatmap**: Interactive profile heatmap visualizing activity.
- **Custom Version Control System**:
  - `init`: Initialize a new local repository.
  - `add`: Stage files for commit.
  - `commit`: Commit staged snapshots.
  - `push` / `pull`: Remote synchronization.
  - `revert`: Revert repository state to any commit hash.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Primer CSS, Axios, React Router (HashRouter)
- **Backend**: Node.js, Express, Socket.IO, Mongoose, JWT, Yargs CLI
- **Database**: MongoDB

---

## 💻 Local Development

### 1. Start the Backend
```bash
cd backend-main
npm install
npm start
```

### 2. Start the Frontend
```bash
cd frontend-main
npm install
npm run dev
```

Visit `http://localhost:5173` to test locally!
