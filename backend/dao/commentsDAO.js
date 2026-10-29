/**
 * Name: Hien Vo
 * Date: 2026-10-14
 * Course: IT-302  Section: 001
 * Assignment: Phase 3 Backend API
 * Email: hmv@njit.edu
 */
const { ObjectId } = require("mongodb");

let comments;

class CommentsDAO {
  static async injectDB(conn) {
    if (comments) return;
    try {
      const dbName = process.env.STATIONS_NS || "it302";
      comments = await conn.db(dbName).collection("comments_hmv");
    } catch (e) {
      console.error(`unable to connect in CommentsDAO: ${e}`);
    }
  }

  static async addComment(stationId, text, userName, userId, lastModified) {
    return await comments.insertOne({
      stationId,
      text,
      userName,
      userId,
      lastModified,
    });
  }

  static async updateComment(commentId, userId, text, lastModified) {
    return await comments.updateOne(
      { _id: new ObjectId(commentId), userId },
      { $set: { text, lastModified } },
    );
  }

  static async deleteComment(commentId, userId) {
    return await comments.deleteOne({
      _id: new ObjectId(commentId),
      userId,
    });
  }

  static async getComments(stationId) {
    const query = stationId ? { stationId } : {};
    return await comments.find(query).sort({ lastModified: -1 }).toArray();
  }
}

module.exports = CommentsDAO;
