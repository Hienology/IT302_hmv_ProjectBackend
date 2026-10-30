/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import StationsList from "./components/StationsList";
import Station from "./components/Stations.js";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  function login(user) {
    setUser(user);
  }

  function logout() {
    setUser(null);
  }

  return (
    <div>
      <NavBar user={user} logout={logout} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<StationsList />} />
          <Route path="/hmv_stations" element={<StationsList />} />
          <Route path="/hmv_stations/:id" element={<Station user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;