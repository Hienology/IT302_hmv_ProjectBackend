
/**
 * Name: Hien Vo
 * Date: 2026-11-19
 * Course: IT-302  Section: 001
 * Assignment: Phase 5 Frontend and Persistent Login
 * Email: hmv@njit.edu
 */

import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import AuthService from "../service/AuthService";

const Login = ({ user, onAuthenticated }) => {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = registering
        ? await AuthService.register(
            name.trim(),
            username.trim(),
            password
          )
        : await AuthService.login(
            username.trim(),
            password
          );

      onAuthenticated(response.data.user);

      // Return to the requested station/comment form.
      const requestedPath = location.state?.from;

      navigate(
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/hmv_")
          ? requestedPath
          : "/hmv_stations",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Unable to authenticate. Check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return (
      <Alert variant="success">
        You are logged in as {user.name}.{" "}
        <Link to="/hmv_stations">
          Browse stations
        </Link>.
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>
        {registering ? "Create an account" : "Login"}
      </h2>

      <p className="text-muted">
        Account verification is performed by the server.
      </p>

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      <Form onSubmit={submit}>
        {registering && (
          <Form.Group
            className="mb-3"
            controlId="registerName"
          >
            <Form.Label>Full name</Form.Label>

            <Form.Control
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Form.Group>
        )}

        <Form.Group
          className="mb-3"
          controlId="username"
        >
          <Form.Label>Username</Form.Label>

          <Form.Control
            required
            minLength={3}
            maxLength={32}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="password"
        >
          <Form.Label>Password</Form.Label>

          <Form.Control
            required
            type="password"
            minLength={registering ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              registering
                ? "new-password"
                : "current-password"
            }
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={
            submitting ||
            !username.trim() ||
            !password ||
            (registering && !name.trim())
          }
        >
          {submitting
            ? "Please wait..."
            : registering
              ? "Register and log in"
              : "Log in"}
        </Button>

        <Button
          type="button"
          className="ms-2"
          variant="link"
          disabled={submitting}
          onClick={() => {
            setRegistering((current) => !current);
            setError("");
            setPassword("");
          }}
        >
          {registering
            ? "Already registered? Log in"
            : "Need an account? Register"}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
