/**
 * Name: Hien Vo
 * Date: 2026-10-14
 * Course: IT-302  Section: 001
 * Assignment: Phase 3 Backend API
 * Email: hmv@njit.edu
 */
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const stations = require("./api/stations.route");
const StationsDAO = require("./dao/stationsDAO");
const CommentsDAO = require("./dao/commentsDAO");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/hmv/stations", stations);

app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

async function connectToMongo() {
  const uri = process.env.STATIONS_DB_URI;
  if (!uri) throw new Error("STATIONS_DB_URI is missing from .env");
  const client = new MongoClient(uri);
  await client.connect();
  await StationsDAO.injectDB(client);
  await CommentsDAO.injectDB(client);
  console.log("connected to Atlas");
  return client;
}

module.exports = app;
module.exports.connectToMongo = connectToMongo;
