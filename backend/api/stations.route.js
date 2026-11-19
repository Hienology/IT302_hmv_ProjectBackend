
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const express = require("express");

const StationsCtrl = require(
  "./stations.controller"
);

const CommentsCtrl = require(
  "./comments.controller"
);

const requireAuth = require("./requireAuth");

const router = express.Router();

// Public station data
router.route("/")
  .get(StationsCtrl.apiGetStations);

router.route("/id/:id")
  .get(StationsCtrl.apiGetStationById);

// Public comment listing
router.route("/comments")
  .get(CommentsCtrl.apiGetComments);

// Authenticated comment modifications
router.route("/comment")
  .post(
    requireAuth,
    CommentsCtrl.apiPostComment
  )
  .put(
    requireAuth,
    CommentsCtrl.apiUpdateComment
  )
  .delete(
    requireAuth,
    CommentsCtrl.apiDeleteComment
  );

module.exports = router;
