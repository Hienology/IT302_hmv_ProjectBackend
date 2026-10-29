/**
 * Name: Hien Vo
 * Date: 2026-09-30
 * Course: IT-302  Section: 001
 * Assignment: Phase 2 Backend API
 * Email: hmv@njit.edu
 */

require("dotenv").config();
const app = require("./index");
const { connectToMongo } = require("./index");

const port = process.env.PORT || 8000;

connectToMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
      console.log(`GET http://localhost:${port}/api/v1/hmv/stations`);
    });
  })
  .catch((err) => {
    console.error("unable to connect to MongoDB", err);
    process.exit(1);
  });
