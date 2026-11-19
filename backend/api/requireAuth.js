
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const UsersDAO = require("../dao/usersDAO");

async function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({
      error: "Log in to manage comments."
    });
  }

  try {
    const user = await UsersDAO.findByUserId(
      req.session.userId
    );

    if (!user) {
      return res.status(401).json({
        error: "User account not found."
      });
    }

    req.authUser = {
      id: user.userId,
      name: user.name,
      username: user.username
    };

    next();
  } catch (error) {
    console.error(
      "Authentication check error",
      error
    );

    return res.status(500).json({
      error: "Unable to check login."
    });
  }
}

module.exports = requireAuth;
