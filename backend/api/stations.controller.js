/**
 * Name: Hien Vo
 * Date: 2026-09-30 (no need to update for Phase 3)
 * Course: IT-302  Section: 001
 * Assignment: Phase 2 Backend API
 * Email: hmv@njit.edu
 */

const StationsDAO = require("../dao/stationsDAO");

class StationsController {
  static async apiGetStations(req, res) {
    const itemsPerPage = req.query.itemsPerPage
      ? parseInt(req.query.itemsPerPage, 10)
      : 20;
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber, 10)
      : 0;

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
}

module.exports = StationsController;