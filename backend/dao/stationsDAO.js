/**
 * Name: Hien Vo
 * Date: 2026-09-30
 * Course: IT-302  Section: 001
 * Assignment: Phase 2 Backend API
 * Email: hmv@njit.edu
 */

let stations;

class StationsDAO {
  static async injectDB(conn) {
    if (stations) return;
    try {
      const dbName = process.env.STATIONS_NS || "it302";
      const collName = process.env.STATIONS_COLLECTION || "district_line_stations_hmv";
      stations = await conn.db(dbName).collection(collName);
    } catch (e) {
      console.error(`Unable to establish collection handle in StationsDAO: ${e}`);
    }
  }

  static async getStations({
    filters = {},
    pageNumber = 0,
    itemsPerPage = 20,
  } = {}) {
    const query = {};
    if (filters.title) {
      query.title = { $regex: filters.title, $options: "i" };
    }
    if (filters.zone) {
      query.zone = { $regex: `^${filters.zone}$`, $options: "i" };
    }
    if (filters.line) {
      query.$or = [
        { line: { $regex: filters.line, $options: "i" } },
        { lines: { $regex: filters.line, $options: "i" } },
      ];
    }

    try {
      const cursor = await stations
        .find(query)
        .limit(itemsPerPage)
        .skip(itemsPerPage * pageNumber);
      const stationsList = await cursor.toArray();
      const totalNumStations = await stations.countDocuments(query);
      return { stationsList, totalNumStations };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { stationsList: [], totalNumStations: 0 };
    }
  }
}

module.exports = StationsDAO;