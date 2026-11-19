
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import axios from "axios";

// Same-origin /api calls are proxied in local CRA development and on Netlify.
// Cookies stay in the browser's cookie jar; user data is not stored there.

const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 60000,
  headers: {
    Accept: "application/json"
  }
});

export default apiClient;
