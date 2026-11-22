// Loads the campus and building data from src/data/ and gives it proper
// types. Everything else imports CAMPUS and BUILDINGS from here instead of
// reading the JSON files directly.
//
// To add or move a building, edit src/data/buildings.json. No code changes.

import campusData from "../data/campus.json";
import buildingData from "../data/buildings.json";
import { toLngLat, type Bounds, type LngLat } from "./geo";

export type Campus = {
  name: string;
  shortName: string;
  center: LngLat;
  /** The user can't pan the map outside this area. */
  mapBounds: Bounds;
  /** The campus grounds. Location features only work inside this area. */
  locationBounds: Bounds;
};

export type CampusBuilding = {
  /** Short name shown on the map label, like "GLE". */
  name: string;
  /** Full name, like "Gregorio L. Escario Building", if it has one. */
  fullName?: string;
  coords: LngLat;
};

export const CAMPUS: Campus = {
  ...campusData,
  center: toLngLat(campusData.center),
};

export const BUILDINGS: CampusBuilding[] = buildingData.map((building) => ({
  name: building.name,
  fullName: building.fullName,
  coords: toLngLat(building),
}));

/** All the names a building can be searched by. */
export function getBuildingSearchValues(building: CampusBuilding) {
  return building.fullName ? [building.name, building.fullName] : [building.name];
}

/** The name to show in lists: the full name if there is one. */
export function getBuildingDisplayName(building: CampusBuilding) {
  return building.fullName ?? building.name;
}

/** Finds a building by its short or full name, ignoring capital letters. */
export function findBuilding(name: string) {
  const wanted = name.trim().toLowerCase();
  return BUILDINGS.find((building) =>
    getBuildingSearchValues(building).some(
      (value) => value.toLowerCase() === wanted,
    ),
  );
}
