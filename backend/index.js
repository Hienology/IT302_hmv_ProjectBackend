
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient } = require("mongodb");

const stations = require("./api/stations.route");
const auth = require("./api/auth.route");

const StationsDAO = require("./dao/stationsDAO");
const CommentsDAO = require("./dao/commentsDAO");
const UsersDAO = require("./dao/usersDAO");

const app = express();

// Render is behind an HTTPS reverse proxy.
// This permits Express to issue secure cookies.
app.set("trust proxy", 1);

const approvedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Browsers using the Netlify /api proxy
      // do not need cross-origin requests.
      if (
        !origin ||
        approvedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));

// Session middleware is initialized with the
// MongoDB client after database connection.

let sessionMiddleware;

app.use((req, res, next) => {
  if (!sessionMiddleware) {
    return res.status(503).json({
      error: "Database session store not ready"
    });
  }

  return sessionMiddleware(req, res, next);
});

// Authentication routes
app.use("/api/v1/hmv/auth", auth);

// Existing station and comment routes
app.use("/api/v1/hmv/stations", stations);

// Unrecognized requests
app.use((req, res) => {
  return res.status(404).json({
    error: "not found"
  });
});

async function connectToMongo() {
  const uri = process.env.STATIONS_DB_URI;
  const secret = process.env.SESSION_SECRET;

  if (!uri) {
    throw new Error("STATIONS_DB_URI is missing");
  }

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must contain at least 32 characters"
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Initialize data-access classes.
    await StationsDAO.injectDB(client);
    await CommentsDAO.injectDB(client);
    await UsersDAO.injectDB(client);

    const databaseName =
      process.env.STATIONS_NS || "it302";

    const isProduction =
      process.env.NODE_ENV === "production";

    const oneDay = 24 * 60 * 60 * 1000;

    sessionMiddleware = session({
      name: "hmv.sid",
      secret,
      resave: false,
      saveUninitialized: false,
      rolling: true,

      store: MongoStore.create({
        client,
        dbName: databaseName,
        collectionName: "sessions_hmv",
        ttl: 24 * 60 * 60
      }),

      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: oneDay,
        path: "/"
      }
    });

    console.log(
      "connected to Atlas with MongoDB-backed sessions"
    );

    return client;
  } catch (err) {
    await client.close();
    throw err;
  }
}

module.exports = app;
module.exports.connectToMongo = connectToMongo;
