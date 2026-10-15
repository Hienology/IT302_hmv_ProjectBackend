/**
 * Name: Hien Vo
 * Date: 2026-10-14
 * Course: IT-302  Section: 001
 * Assignment: Phase 3 Backend API
 * Email: hmv@njit.edu
 */
const CommentsDAO = require("../dao/commentsDAO");

class CommentsController {
  static async apiPostComment(req, res) {
    try {
      const stationId = req.body.stationId;
      const text = req.body.text;
      const userName = req.body.userName;
      const userId = req.body.userId;

      if (!stationId || !text || !userName || !userId) {
        return res.status(400).json({
          status: "failure",
          error: "stationId, text, userName, and userId are required",
        });
      }

      const lastModified = new Date();
      const response = await CommentsDAO.addComment(
        stationId, text, userName, userId, lastModified
      );
      res.json({ status: "success", insertedId: response.insertedId });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }

  static async apiUpdateComment(req, res) {
    try {
      const commentId = req.body.commentId;
      const text = req.body.text;
      const userId = req.body.userId;

      if (!commentId || !text || !userId) {
        return res.status(400).json({
          status: "failure",
          error: "commentId, text, and userId are required",
        });
      }

      const lastModified = new Date();
      const response = await CommentsDAO.updateComment(
        commentId, userId, text, lastModified
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
      const commentId = req.body.commentId;
      const userId = req.body.userId;

      if (!commentId || !userId) {
        return res.status(400).json({
          status: "failure",
          error: "commentId and userId are required",
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
      const stationId = req.query.stationId;
      const comments = await CommentsDAO.getComments(stationId);
      res.json({ comments, total_results: comments.length });
    } catch (e) {
      res.status(500).json({ status: "failure", error: e.message });
    }
  }
}

module.exports = CommentsController;