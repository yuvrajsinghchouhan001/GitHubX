import React, { useEffect } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rawUserId = localStorage.getItem("userId");
    const userIdFromStorage =
      rawUserId && rawUserId !== "null" && rawUserId !== "undefined"
        ? rawUserId
        : null;

    if (!userIdFromStorage) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      if (!["/auth", "/signup"].includes(window.location.pathname)) {
        navigate("/auth");
      }
    } else {
      if (!currentUser) {
        setCurrentUser(userIdFromStorage);
      }
      if (
        window.location.pathname === "/auth" ||
        window.location.pathname === "/signup"
      ) {
        navigate("/");
      }
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/create",
      element: <CreateRepo />,
    },
    {
      path: "/repo/:id",
      element: <RepoDetail />,
    },
    {
      path: "/repo",
      element: <Navigate to="/" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return element;
};

export default ProjectRoutes;