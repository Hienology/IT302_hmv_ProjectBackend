
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import StationsDataService from "../service/StationsDataService";

const AddComment = ({ user }) => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const location = useLocation();

  const [text, setText] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(
    Boolean(editId)
  );
  const [editingError, setEditingError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const backPath =
    `/hmv_stations/${encodeURIComponent(id)}`;

  useEffect(() => {
    let ignore = false;

    setText("");
    setError("");
    setSuccess("");
    setEditingError("");
    setLoadingEdit(Boolean(editId));

    if (!editId || !user) {
      setLoadingEdit(false);

      return () => {
        ignore = true;
      };
    }

    // Loading by URL supports direct links and refreshes.
    StationsDataService.getComments(id)
      .then(({ data }) => {
        if (ignore) return;

        const existing = (data.comments || []).find(
          (item) => item._id === editId
        );

        if (!existing || existing.userId !== user.id) {
          setEditingError(
            "This comment cannot be edited by your account."
          );
        } else {
          setText(existing.text || "");
        }
      })
      .catch(() => {
        if (!ignore) {
          setEditingError(
            "Unable to load the comment for editing."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoadingEdit(false);
      });

    return () => {
      ignore = true;
    };
  }, [editId, id, user]);

  const submit = async (event) => {
    event.preventDefault();

    if (!text.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editId) {
        await StationsDataService.updateComment(
          editId,
          text.trim()
        );

        setSuccess(
          "Your comment was updated successfully."
        );
      } else {
        await StationsDataService.createComment(
          id,
          text.trim()
        );

        setSuccess(
          "Your comment was created successfully."
        );

        setText("");
      }
    } catch (e) {
      setError(
        e.response?.data?.error ||
        "Could not save the comment. Please retry."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Navigate
        to="/hmv_login"
        replace
        state={{
          from: location.pathname + location.search
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h2>
        {editId ? "Edit Comment" : "Add Comment"}
      </h2>

      <p>
        Commenting as <strong>{user.name}</strong>.
        {" "}
        <Link to={backPath}>Back to Station</Link>
      </p>

      {loadingEdit ? (
        <p role="status">Loading comment...</p>
      ) : editingError ? (
        <Alert variant="danger">
          {editingError}
        </Alert>
      ) : (
        <>
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" role="status">
              {success}
              {" "}
              <Link to={backPath}>
                See all comments
              </Link>.
            </Alert>
          )}

          <Form onSubmit={submit}>
            <Form.Group
              className="mb-3"
              controlId="commentText"
            >
              <Form.Label>Your comment</Form.Label>

              <Form.Control
                as="textarea"
                rows={5}
                required
                minLength={1}
                maxLength={2000}
                value={text}
                onChange={(event) =>
                  setText(event.target.value)
                }
                placeholder="Write a helpful, realistic comment about this station."
              />

              <Form.Text>
                Use complete sentences.
                Maximum 2,000 characters.
              </Form.Text>
            </Form.Group>

            <Button
              type="submit"
              disabled={saving || !text.trim()}
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Save Changes"
                  : "Add Comment"}
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default AddComment;
