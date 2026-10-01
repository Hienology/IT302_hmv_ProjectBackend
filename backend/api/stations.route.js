/**
 * Name: Hien Vo
 * Date: 2026-09-30
 * Course: IT-302  Section: 001
 * Assignment: Phase 2 Backend API
 * Email: hmv@njit.edu
 */

const express = require("express");
const StationsCtrl = require("./stations.controller");

const router = express.Router();
router.route("/").get(StationsCtrl.apiGetStations);

module.exports = router;