/**
 * Name: Hien Vo
 * Date: 2026-10-14
 * Course: IT-302  Section: 001
 * Assignment: Phase 3 Backend API
 * Email: hmv@njit.edu
 */
const { ObjectId } = require("mongodb");
const CommentsDAO = require("../dao/commentsDAO");

// Only plain strings are allowed. An object like {"$ne": null} would otherwise
// reach MongoDB as a query operator and skip the userId ownership check.
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

class CommentsController {
  static async apiPostComment(req, res) {
    try {
      const { stationId, text, userName, userId } = req.body;

      if (![stationId, text, userName, userId].every(isNonEmptyString)) {
        return res.status(400).json({
          status: "failure",
          error: "stationId, text, userName, and userId are required",
        });
      }

      const lastModified = new Date();
      const response = await CommentsDAO.addComment(
        stationId,
        text,
        userName,
        userId,
        lastModified,
      );
      res.json({ status: "success", insertedId: response.insertedId });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }

  static async apiUpdateComment(req, res) {
    try {
      const { commentId, text, userId } = req.body;

      if (![commentId, text, userId].every(isNonEmptyString)) {
        return res.status(400).json({
          status: "failure",
          error: "commentId, text, and userId are required",
        });
      }
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({
          status: "failure",
          error: "commentId is not a valid id",
        });
      }

      const lastModified = new Date();
      const response = await CommentsDAO.updateComment(
        commentId,
        userId,
        text,
        lastModified,
      );
      if (response.modifiedCount === 0) {
        return res.status(404).json({
          status: "failure",
          error: "comment not found, or user is not the original poster",
        });
      }
      res.json({ status: "success", modifiedCount: response.modifiedCount });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }

  static async apiDeleteComment(req, res) {
    try {
      const { commentId, userId } = req.body;

      if (![commentId, userId].every(isNonEmptyString)) {
        return res.status(400).json({
          status: "failure",
          error: "commentId and userId are required",
        });
      }
      if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({
          status: "failure",
          error: "commentId is not a valid id",
        });
      }

      const response = await CommentsDAO.deleteComment(commentId, userId);
      if (response.deletedCount === 0) {
        return res.status(404).json({
          status: "failure",
          error: "comment not found, or user is not the original poster",
        });
      }
      res.json({ status: "success", deletedCount: response.deletedCount });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }

  static async apiGetComments(req, res) {
    try {
      const { stationId } = req.query;
      const comments = await CommentsDAO.getComments(
        isNonEmptyString(stationId) ? stationId : undefined,
      );
      res.json({ comments, total_results: comments.length });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }
}

module.exports = CommentsController;
