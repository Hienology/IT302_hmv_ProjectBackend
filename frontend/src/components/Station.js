
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import React, { useState, useEffect } from "react";
import StationsDataService from "../service/StationsDataService";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import StationImage from "./StationImage";
import { describeStation } from "../utils/stationText";

const Station = ({ user }) => {
  const [station, setStation] = useState(null);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    let ignore = false;

    setStation(null);
    setError("");

    StationsDataService.get(id)
      .then(({ data }) => {
        if (!ignore) setStation(data);
      })
      .catch((e) => {
        if (ignore) return;

        setError(
          e.response?.status === 404
            ? "This station could not be found."
            : "The station could not be loaded from the server."
        );
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;

    setComments([]);
    setCommentsError("");
    setCommentsLoading(true);

    StationsDataService.getComments(id)
      .then(({ data }) => {
        if (!ignore) {
          setComments(data.comments || []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCommentsError(
            "Comments could not be loaded. Refresh to try again."
          );
        }
      })
      .finally(() => {
        if (!ignore) setCommentsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const deleteComment = async (comment) => {
    if (!window.confirm("Delete your comment permanently?")) {
      return;
    }

    setBusyId(comment._id);
    setCommentsError("");

    try {
      await StationsDataService.deleteComment(
        comment._id
      );

      setComments((previous) =>
        previous.filter(
          (item) => item._id !== comment._id
        )
      );
    } catch (e) {
      setCommentsError(
        e.response?.data?.error ||
        "The comment could not be deleted."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!station) {
    return (
      <Container>
        <p className="text-muted">
          The station is loading.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <StationImage station={station} />

        <Card.Body>
          <Card.Title>{station.title}</Card.Title>

          <Card.Text>
            {describeStation(station)}
            {" "}Its station ID is {station.naptanId}.
          </Card.Text>

          {user ? (
            <Link
              to={`/hmv_stations/${encodeURIComponent(id)}/comment`}
            >
              Add Comment
            </Link>
          ) : (
            <Link
              to="/hmv_login"
              state={{
                from: `/hmv_stations/${encodeURIComponent(id)}/comment`
              }}
            >
              Log in to add a comment
            </Link>
          )}
        </Card.Body>
      </Card>

      <h2 className="mt-4">Station Comments</h2>

      {commentsLoading && (
        <p role="status">Loading comments...</p>
      )}

      {commentsError && (
        <Alert variant="danger">
          {commentsError}
        </Alert>
      )}

      {!commentsLoading &&
        !commentsError &&
        comments.length === 0 && (
          <p>
            There are no comments for this station yet.
          </p>
        )}

      {comments.map((comment) => {
        const isAuthor = Boolean(
          user && user.id === comment.userId
        );

        const date = new Date(comment.lastModified);

        const dateLabel = Number.isNaN(date.getTime())
          ? "an unknown date"
          : date.toLocaleString();

        return (
          <Card
            className="mb-3"
            key={comment._id}
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                {comment.userName || "Station visitor"}
                {" "}commented on {dateLabel}
              </Card.Subtitle>

              <Card.Text
                style={{ whiteSpace: "pre-wrap" }}
              >
                {comment.text}
              </Card.Text>

              {isAuthor && (
                <div className="d-flex gap-2">
                  <Link
                    className="btn btn-outline-primary btn-sm"
                    to={`/hmv_stations/${encodeURIComponent(id)}/comment?edit=${encodeURIComponent(comment._id)}`}
                  >
                    Edit
                  </Link>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={busyId === comment._id}
                    onClick={() => deleteComment(comment)}
                  >
                    {busyId === comment._id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default Station;
