/**
 * Name: Hien Vo
 * Date: 2026-09-30 (no need to update for Phase 3)
 * Course: IT-302  Section: 001
 * Assignment: Phase 2 Backend API
 * Email: hmv@njit.edu
 */

const StationsDAO = require("../dao/stationsDAO");

// Falls back when the value is missing, not a number, or below min (e.g. ?pageNumber=-1).
const parseIntOr = (value, fallback, min) => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n >= min ? n : fallback;
};

class StationsController {
  static async apiGetStations(req, res) {
    const itemsPerPage = parseIntOr(req.query.itemsPerPage, 20, 1);
    const pageNumber = parseIntOr(req.query.pageNumber, 0, 0);

    const filters = {};
    if (req.query.title) filters.title = req.query.title;
    else if (req.query.name) filters.title = req.query.name;
    if (req.query.zone) filters.zone = req.query.zone;
    if (req.query.line) filters.line = req.query.line;

    try {
      const { stationsList, totalNumStations } = await StationsDAO.getStations({
        filters,
        pageNumber,
        itemsPerPage,
      });
      res.json({
        stations: stationsList,
        pageNumber,
        itemsPerPage,
        filters,
        total_results: totalNumStations,
      });
    } catch (e) {
      console.error(`apiGetStations: ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetStationById(req, res) {
    try {
      const station = await StationsDAO.getStationById(req.params.id);
      if (!station) return res.status(404).json({ error: "not found" });
      res.json(station);
    } catch (e) {
      console.error(`apiGetStationById: ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = StationsController;
