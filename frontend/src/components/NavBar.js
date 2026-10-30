/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ user, logout }) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to="/hmv_stations" className="navbar-brand">
        District Stations
      </Link>
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/hmv_stations" className="nav-link">
            Stations
          </Link>
        </li>
        <li className="nav-item">
          {user ? (
            <Link to="/hmv_stations" onClick={logout} className="nav-link">
              Logout {user.name}
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </li>
      </div>
    </nav>
  );
};

export default NavBar;