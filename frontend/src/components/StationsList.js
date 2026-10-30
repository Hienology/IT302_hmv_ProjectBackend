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
import Alert from "react-bootstrap/Alert";
import StationImage from "./StationImage";

const StationsList = () => {
  const [stations, setStations] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchZone, setSearchZone] = useState("");
  // Filters from the last Search click, kept apart from the inputs so paging
  // doesn't pick up text that was typed but not searched yet.
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ignore responses from an earlier page or search that arrive late.
    let ignore = false;
    setLoading(true);
    setError("");
    StationsDataService.find(filters, currentPage)
      .then((response) => {
        if (ignore) return;
        setStations(response.data.stations);
        setItemsPerPage(response.data.itemsPerPage);
        setTotalResults(response.data.total_results);
      })
      .catch((e) => {
        if (ignore) return;
        console.log(e);
        setStations([]);
        setTotalResults(0);
        setError(
          "Couldn't load stations from the server. Press Search to try again."
        );
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [filters, currentPage]);

  const search = (e) => {
    e.preventDefault();
    const nextFilters = {};
    if (searchTitle.trim()) nextFilters.title = searchTitle.trim();
    if (searchZone) nextFilters.zone = searchZone;
    setFilters(nextFilters);
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const firstShown = currentPage * itemsPerPage + 1;
  const lastShown = currentPage * itemsPerPage + stations.length;

  let status;
  if (loading) status = "Loading stations…";
  else if (totalResults === 0) status = "No stations match your search.";
  else status = `Showing ${firstShown}–${lastShown} of ${totalResults} stations`;

  return (
    <Container>
      <Form onSubmit={search}>
        <Row className="g-2">
          <Col md>
            <Form.Control
              type="text"
              placeholder="Search by title"
              aria-label="Search by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </Col>
          <Col md>
            <Form.Select
              aria-label="Zone"
              value={searchZone}
              onChange={(e) => setSearchZone(e.target.value)}
            >
              <option value="">All zones</option>
              <option value="1">Zone 1</option>
              <option value="2">Zone 2</option>
              <option value="3">Zone 3</option>
              <option value="4">Zone 4</option>
              <option value="5">Zone 5</option>
              <option value="6">Zone 6</option>
            </Form.Select>
          </Col>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {error ? (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      ) : (
        <p className="mt-3 text-muted">{status}</p>
      )}

      <Row>
        {stations.map((station) => (
          <Col key={station.naptanId} className="mb-3">
            <Card style={{ width: "18rem" }}>
              <StationImage station={station} />
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

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 my-3">
          <Button
            variant="outline-primary"
            disabled={loading || currentPage === 0}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={loading || currentPage >= totalPages - 1}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
};

export default StationsList;
