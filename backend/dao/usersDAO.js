
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

let users;

class UsersDAO {
  static async injectDB(client) {
    if (users) return;

    const dbName =
      process.env.STATIONS_NS || "it302";

    const collection = client
      .db(dbName)
      .collection("users_hmv");

    await collection.createIndex(
      { username: 1 },
      { unique: true }
    );

    await collection.createIndex(
      { userId: 1 },
      { unique: true }
    );

    users = collection;
  }

  static async findByUsername(username) {
    return users.findOne({ username });
  }

  static async findByUserId(userId) {
    return users.findOne({ userId });
  }

  static async insert(user) {
    return users.insertOne(user);
  }
}

module.exports = UsersDAO;
