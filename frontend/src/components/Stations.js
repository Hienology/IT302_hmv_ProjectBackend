/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React, { useState, useEffect } from "react";
import StationsDataService from "../service/StationsDataService";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const Station = (props) => {
  const [station, setStation] = useState({
    title: "",
    zone: "",
    line: "",
    details: "",
    image: "",
    naptanId: "",
  });
  const { id } = useParams();

  useEffect(() => {
    StationsDataService.get(id)
      .then((response) => setStation(response.data))
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <Container>
      <Card>
        <Card.Img src={station.image} alt={station.title} />
        <Card.Body>
          <Card.Title>{station.title}</Card.Title>
          <Card.Text>
            {station.details}
            <br />
            Zone: {station.zone}
            <br />
            Line: {station.line}
            <br />
            Id: {station.naptanId}
          </Card.Text>
          {props.user && <p>Signed in as {props.user.name}.</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Station;