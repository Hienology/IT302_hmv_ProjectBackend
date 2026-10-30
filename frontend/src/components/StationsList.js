/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React, { useState, useEffect } from "react";
import StationsDataService from "../service/StationsDataService";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const StationsList = () => {
  const [stations, setStations] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchZone, setSearchZone] = useState("");

  useEffect(() => {
    retrieveStations();
  }, []);

  const retrieveStations = () => {
    StationsDataService.getAll()
      .then((response) => setStations(response.data.stations))
      .catch((e) => console.log(e));
  };

  const findByTitle = () => {
    StationsDataService.find(searchTitle, "title")
      .then((response) => setStations(response.data.stations))
      .catch((e) => console.log(e));
  };

  const findByZone = () => {
    StationsDataService.find(searchZone, "zone")
      .then((response) => setStations(response.data.stations))
      .catch((e) => console.log(e));
  };

  return (
    <Container>
      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search by title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="button" onClick={findByTitle}>
              Search
            </Button>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={(e) => setSearchZone(e.target.value)}
              >
                <option value="">All zones</option>
                <option value="1">Zone 1</option>
                <option value="2">Zone 2</option>
                <option value="3">Zone 3</option>
                <option value="4">Zone 4</option>
                <option value="5">Zone 5</option>
                <option value="6">Zone 6</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="button" onClick={findByZone}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="mt-3">
        {stations.map((station) => (
          <Col key={station.naptanId} className="mb-3">
            <Card style={{ width: "18rem" }}>
              <Card.Img src={station.image} alt={station.title} />
              <Card.Body>
                <Card.Title>{station.title}</Card.Title>
                <Card.Text>
                  Zone {station.zone}. {station.details}
                </Card.Text>
                <Link to={"/hmv_stations/" + station.naptanId}>
                  View Station
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StationsList;