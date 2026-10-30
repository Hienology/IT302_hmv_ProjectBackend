/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = (props) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const login = () => {
    props.login({ name, id });
  };

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={login}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;