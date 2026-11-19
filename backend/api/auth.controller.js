
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const UsersDAO = require("../dao/usersDAO");

const publicUser = (user) => ({
  id: user.userId,
  name: user.name,
  username: user.username
});

const normalizedUsername = (value) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";

// Regenerate the session ID on login to avoid
// accepting a preexisting session identifier.
const beginSession = (request, userId) =>
  new Promise((resolve, reject) => {
    request.session.regenerate((error) => {
      if (error) {
        return reject(error);
      }

      request.session.userId = userId;

      return request.session.save((saveError) => {
        if (saveError) {
          return reject(saveError);
        }

        resolve();
      });
    });
  });

class AuthController {
  static async register(req, res) {
    const username = normalizedUsername(
      req.body.username
    );

    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const password = req.body.password;

    if (
      !/^[a-z0-9._-]{3,32}$/.test(username) ||
      name.length < 2 ||
      name.length > 80 ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        error:
          "Enter a username (3–32 characters), " +
          "name (2–80 characters), and password " +
          "(8–72 characters)."
      });
    }

    try {
      const existingUser =
        await UsersDAO.findByUsername(username);

      if (existingUser) {
        return res.status(409).json({
          error: "Username already exists."
        });
      }

      // Never store a plaintext password.
      const passwordHash = await bcrypt.hash(
        password,
        12
      );

      const user = {
        username,
        name,
        passwordHash,
        userId: randomUUID(),
        createdAt: new Date()
      };

      await UsersDAO.insert(user);

      // Automatically log in after registration.
      await beginSession(req, user.userId);

      return res.status(201).json({
        user: publicUser(user)
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Username already exists."
        });
      }

      console.error("Registration error", error);

      return res.status(500).json({
        error: "Unable to register."
      });
    }
  }

  static async login(req, res) {
    const username = normalizedUsername(
      req.body.username
    );

    const password = req.body.password;

    if (
      !username ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Username and password are required."
      });
    }

    try {
      const user =
        await UsersDAO.findByUsername(username);

      // Compare the supplied password against
      // the hash stored in the database.
      if (
        !user ||
        !(await bcrypt.compare(
          password,
          user.passwordHash
        ))
      ) {
        return res.status(401).json({
          error: "Invalid username or password."
        });
      }

      await beginSession(req, user.userId);

      return res.json({
        user: publicUser(user)
      });
    } catch (error) {
      console.error("Login error", error);

      return res.status(500).json({
        error: "Unable to log in."
      });
    }
  }

  static async currentUser(req, res) {
    if (!req.session?.userId) {
      return res.status(401).json({
        error: "Not authenticated."
      });
    }

    try {
      const user = await UsersDAO.findByUserId(
        req.session.userId
      );

      if (!user) {
        return res.status(401).json({
          error: "Session user not found."
        });
      }

      return res.json({
        user: publicUser(user)
      });
    } catch (error) {
      console.error("Session lookup error", error);

      return res.status(500).json({
        error: "Unable to restore session."
      });
    }
  }

  static async logout(req, res) {
    if (!req.session) {
      return res.status(500).json({
        error: "Session unavailable."
      });
    }

    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({
          error: "Unable to log out."
        });
      }

      res.clearCookie("hmv.sid", {
        path: "/"
      });

      return res.json({
        status: "success"
      });
    });
  }
}

module.exports = AuthController;
