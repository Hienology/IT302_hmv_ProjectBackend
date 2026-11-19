
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const AuthController = require("./auth.controller");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many attempts. Try again later."
  }
});

router.post(
  "/register",
  authLimiter,
  AuthController.register
);

router.post(
  "/login",
  authLimiter,
  AuthController.login
);

router.get(
  "/me",
  AuthController.currentUser
);

router.post(
  "/logout",
  AuthController.logout
);

module.exports = router;
