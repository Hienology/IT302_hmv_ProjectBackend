
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ user, logout, authLoading }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setBusy(true);
    setError("");

    try {
      await logout();
      navigate("/hmv_stations");
    } catch (_) {
      setError(
        "Could not end your session. Please retry."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link
          to="/hmv_stations"
          className="navbar-brand"
        >
          District Stations
        </Link>

        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link
              to="/hmv_stations"
              className="nav-link"
            >
              Stations
            </Link>
          </li>

          {!authLoading && (
            <li className="nav-item">
              {user ? (
                <button
                  type="button"
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                  disabled={busy}
                >
                  {busy
                    ? "Logging out..."
                    : `Logout ${user.name}`}
                </button>
              ) : (
                <Link
                  to="/hmv_login"
                  className="nav-link"
                >
                  Login
                </Link>
              )}
            </li>
          )}
        </ul>
      </nav>

      {error && (
        <p
          role="alert"
          className="text-danger container mt-2"
        >
          {error}
        </p>
      )}
    </>
  );
};

export default NavBar;
