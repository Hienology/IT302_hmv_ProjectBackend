
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import apiClient from "./apiClient";

const BASE = "/api/v1/hmv/stations";

class StationsDataService {
  getAll(page = 0) {
    return apiClient.get(BASE, {
      params: { pageNumber: page }
    });
  }

  get(id) {
    return apiClient.get(
      `${BASE}/id/${encodeURIComponent(id)}`
    );
  }

  find(filters = {}, page = 0) {
    return apiClient.get(BASE, {
      params: {
        ...filters,
        pageNumber: page
      }
    });
  }

  getComments(stationId) {
    return apiClient.get(`${BASE}/comments`, {
      params: { stationId }
    });
  }

  createComment(stationId, text) {
    return apiClient.post(`${BASE}/comment`, {
      stationId,
      text
    });
  }

  updateComment(commentId, text) {
    return apiClient.put(`${BASE}/comment`, {
      commentId,
      text
    });
  }

  deleteComment(commentId) {
    return apiClient.delete(`${BASE}/comment`, {
      data: { commentId }
    });
  }
}

export default new StationsDataService();
