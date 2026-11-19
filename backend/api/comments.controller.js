
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

const { ObjectId } = require("mongodb");

const CommentsDAO = require("../dao/commentsDAO");
const StationsDAO = require("../dao/stationsDAO");

const validText = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= 2000;

const validId = (value) =>
  typeof value === "string" &&
  ObjectId.isValid(value) &&
  String(new ObjectId(value)) === value.toLowerCase();

class CommentsController {
  static async apiPostComment(req, res) {
    const { stationId, text } = req.body;

    if (
      typeof stationId !== "string" ||
      !stationId.trim() ||
      !validText(text)
    ) {
      return res.status(400).json({
        error:
          "A station and comment of " +
          "1–2000 characters are required."
      });
    }

    try {
      const station =
        await StationsDAO.getStationById(stationId);

      if (!station) {
        return res.status(404).json({
          error: "Station not found."
        });
      }

      const response =
        await CommentsDAO.addComment(
          stationId,
          text.trim(),
          req.authUser.name,
          req.authUser.id,
          new Date()
        );

      return res.status(201).json({
        status: "success",
        insertedId: response.insertedId
      });
    } catch (error) {
      console.error("Create comment error", error);

      return res.status(500).json({
        error: "Unable to create comment."
      });
    }
  }

  static async apiUpdateComment(req, res) {
    const { commentId, text } = req.body;

    if (
      !validId(commentId) ||
      !validText(text)
    ) {
      return res.status(400).json({
        error:
          "A valid comment ID and text of " +
          "1–2000 characters are required."
      });
    }

    try {
      const response =
        await CommentsDAO.updateComment(
          commentId,
          req.authUser.id,
          text.trim(),
          new Date()
        );

      if (response.matchedCount === 0) {
        return res.status(404).json({
          error:
            "Comment not found or " +
            "you are not its author."
        });
      }

      return res.json({
        status: "success",
        matchedCount: response.matchedCount
      });
    } catch (error) {
      console.error("Update comment error", error);

      return res.status(500).json({
        error: "Unable to update comment."
      });
    }
  }

  static async apiDeleteComment(req, res) {
    const { commentId } = req.body || {};

    if (!validId(commentId)) {
      return res.status(400).json({
        error: "A valid comment ID is required."
      });
    }

    try {
      const response =
        await CommentsDAO.deleteComment(
          commentId,
          req.authUser.id
        );

      if (!response.deletedCount) {
        return res.status(404).json({
          error:
            "Comment not found or " +
            "you are not its author."
        });
      }

      return res.json({
        status: "success",
        deletedCount: response.deletedCount
      });
    } catch (error) {
      console.error("Delete comment error", error);

      return res.status(500).json({
        error: "Unable to delete comment."
      });
    }
  }

  static async apiGetComments(req, res) {
    const stationId = req.query.stationId;

    if (
      stationId !== undefined &&
      (
        typeof stationId !== "string" ||
        !stationId.trim()
      )
    ) {
      return res.status(400).json({
        error: "stationId must be a nonempty string."
      });
    }

    try {
      const comments =
        await CommentsDAO.getComments(stationId);

      return res.json({
        comments,
        total_results: comments.length
      });
    } catch (error) {
      console.error("List comments error", error);

      return res.status(500).json({
        error: "Unable to load comments."
      });
    }
  }
}

module.exports = CommentsController;
