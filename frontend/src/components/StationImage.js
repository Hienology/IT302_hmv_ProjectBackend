/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

import React from "react";
import Card from "react-bootstrap/Card";

const PLACEHOLDER = `${process.env.PUBLIC_URL}/station-placeholder.svg`;

// Some stored image URLs point at hosts that no longer exist
// (e.g. staticmap.openstreetmap.de), so swap in a local placeholder on error.
const StationImage = ({ station }) => (
  <Card.Img
    src={station.image || PLACEHOLDER}
    alt={station.title}
    onError={(e) => {
      if (!e.currentTarget.src.endsWith(PLACEHOLDER)) {
        e.currentTarget.src = PLACEHOLDER;
      }
    }}
  />
);

export default StationImage;
