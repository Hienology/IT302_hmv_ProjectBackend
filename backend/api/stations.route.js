/**
 * Name: Hien Vo
 * Date: 2026-10-14
 * Course: IT-302  Section: 001
 * Assignment: Phase 3 Backend API
 * Email: hmv@njit.edu
 */
const express = require("express");
const StationsCtrl = require("./stations.controller");
const CommentsCtrl = require("./comments.controller");

const router = express.Router();

router.route("/").get(StationsCtrl.apiGetStations);
router.route("/id/:id").get(StationsCtrl.apiGetStationById);
router.route("/comments").get(CommentsCtrl.apiGetComments);
router
  .route("/comment")
  .post(CommentsCtrl.apiPostComment)
  .put(CommentsCtrl.apiUpdateComment)
  .delete(CommentsCtrl.apiDeleteComment);

module.exports = router;
