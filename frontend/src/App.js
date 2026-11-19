
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import StationsList from "./components/StationsList";
import Station from "./components/Station";
import Login from "./components/Login";
import AddComment from "./components/AddComment";
import AuthService from "./service/AuthService";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setAuthLoading(true);
    setAuthError("");

    AuthService.currentUser()
      .then(({ data }) => {
        if (active) setUser(data.user);
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          setAuthError(
            "Could not check your login session. Check the server and retry."
          );
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <div>
      <NavBar
        user={user}
        logout={logout}
        authLoading={authLoading}
      />

      <div className="container mt-3">
        {authLoading ? (
          <p role="status">Checking your login session...</p>
        ) : authError ? (
          <Alert variant="warning">
            {authError}{" "}
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => setRetryKey((n) => n + 1)}
            >
              Retry
            </Button>
          </Alert>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/hmv_stations" replace />}
            />

            <Route
              path="/hmv_stations"
              element={<StationsList />}
            />

            <Route
              path="/hmv_stations/:id"
              element={<Station user={user} />}
            />

            <Route
              path="/hmv_stations/:id/comment"
              element={<AddComment user={user} />}
            />

            <Route
              path="/hmv_login"
              element={
                <Login
                  user={user}
                  onAuthenticated={setUser}
                />
              }
            />

            <Route
              path="*"
              element={<Navigate to="/hmv_stations" replace />}
            />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
