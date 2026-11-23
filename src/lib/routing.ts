// Asks the walking-route service for the path between two points.
// The service and its address are in src/config/directions.ts.
//
// The request looks like:
//   .../route/v1/foot/123.8810,10.2948;123.8811,10.2953?overview=full&geometries=geojson
// "overview=full" asks for every bend of the path, and "geometries=geojson"
// asks for the points as [longitude, latitude] pairs, the same as this app.

import { DIRECTIONS_CONFIG } from "../config/directions";
import type { LngLat } from "./geo";

/** True if the value is a [number, number] pair. */
function isLngLat(value: unknown): value is LngLat {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/**
 * Takes the path's points out of the service's answer. The answer comes
 * from outside the app, so its shape is checked instead of trusted.
 */
function readRoutePoints(answer: unknown): LngLat[] | null {
  // The part of the answer we need: { routes: [ { geometry: { coordinates } } ] }
  type RouteAnswer = { routes?: { geometry?: { coordinates?: unknown } }[] };
  const coordinates = (answer as RouteAnswer).routes?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coordinates)) return null;
  const points = coordinates.filter(isLngLat);
  return points.length >= 2 ? points : null;
}

/**
 * The walking path from one point to another, as a list of points.
 * Throws an error if the service can't be reached or finds no path.
 */
export async function fetchWalkingRoute(from: LngLat, to: LngLat): Promise<LngLat[]> {
  const { routingUrl, routingProfile } = DIRECTIONS_CONFIG;
  const points = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const response = await fetch(
    `${routingUrl}/${routingProfile}/${points}?overview=full&geometries=geojson`,
  );
  if (!response.ok) throw new Error(`The route service answered ${response.status}`);

  const path = readRoutePoints(await response.json());
  if (!path) throw new Error("The route service found no path");

  // The service starts and ends the path on the nearest walkway, not exactly
  // where the user stands or at the building's pin. Adding both real ends
  // makes the line touch them.
  return [from, ...path, to];
}
