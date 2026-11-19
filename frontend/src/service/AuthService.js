
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import apiClient from "./apiClient";

class AuthService {
  login(username, password) {
    return apiClient.post(
      "/api/v1/hmv/auth/login",
      { username, password }
    );
  }

  register(name, username, password) {
    return apiClient.post(
      "/api/v1/hmv/auth/register",
      { name, username, password }
    );
  }

  currentUser() {
    return apiClient.get(
      "/api/v1/hmv/auth/me"
    );
  }

  logout() {
    return apiClient.post(
      "/api/v1/hmv/auth/logout"
    );
  }
}

export default new AuthService();
