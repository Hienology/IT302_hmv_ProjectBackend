/**
 * Name: Hien Vo
 * Date: 2026-10-29
 * Course: IT-302  Section: 001
 * Assignment: Phase 4 Frontend
 * Email: hmv@njit.edu
 */

// ["A"] -> "A", ["A", "B"] -> "A and B", ["A", "B", "C"] -> "A, B, and C"
const joinWithAnd = (items) => {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

// Boundary stations are stored as "1+2" or "2/3", so "2/3" -> "Zones 2 and 3".
const zoneText = (zone) => {
  const zones = String(zone).split(/[+/]/);
  return `${zones.length > 1 ? "Zones" : "Zone"} ${joinWithAnd(zones)}`;
};

// The stored details field is a sentence fragment, so build a full sentence
// from the zone and lines instead, e.g. "This station is in Zone 3 and is
// served by the District and Piccadilly lines."
export const describeStation = (station) => {
  const lines = station.lines?.length ? station.lines : [station.line];
  const lineWord = lines.length > 1 ? "lines" : "line";
  return `This station is in ${zoneText(station.zone)} and is served by the ${joinWithAnd(lines)} ${lineWord}.`;
};
