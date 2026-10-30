/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import axios from "axios";

class StationsDataService {
  getAll(page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/hmv/stations?pageNumber=${page}`
    );
  }

  get(id) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/hmv/stations/id/${id}`
    );
  }

  // filters can hold title, zone, or both, e.g. { title: "park", zone: "3" }.
  // axios URL-encodes params, so input like "&" or "#" is sent safely.
  find(filters = {}, page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/hmv/stations`,
      { params: { ...filters, pageNumber: page } }
    );
  }
}

export default new StationsDataService();