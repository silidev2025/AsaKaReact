// Loads the campus, building and room data from src/data/ and gives it
// proper types. Everything else imports CAMPUS, BUILDINGS and CAMPUS_ROOMS
// from here instead of reading the JSON files directly.
//
// To add or move a building, edit src/data/buildings.json.
// To add a room, edit src/data/campus-rooms.json. No code changes.

import campusData from "../data/campus.json";
import buildingData from "../data/buildings.json";
import campusRoomData from "../data/campus-rooms.json";
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
  /** How to get to the building, if anyone wrote it down. */
  directions?: string;
};

export const CAMPUS: Campus = {
  ...campusData,
  center: toLngLat(campusData.center),
};

export const BUILDINGS: CampusBuilding[] = buildingData.map((building) => ({
  name: building.name,
  fullName: building.fullName,
  coords: toLngLat(building),
  directions: building.directions,
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

export type CampusRoom = {
  /** The room code people use, like "GLE 201". */
  code: string;
  /** Short name of the building the room is in, like "GLE". */
  building: string;
  /** How to find the room once inside the building, if anyone wrote it down. */
  directions?: string;
};

/**
 * The CIT-U rooms the app knows about, from src/data/campus-rooms.json.
 * These are what the search finds and what a building's room list shows.
 */
export const CAMPUS_ROOMS: CampusRoom[] = campusRoomData;

/** Finds a room by its exact code, like "GLE 201". */
export function findRoom(code: string) {
  return CAMPUS_ROOMS.find((room) => room.code === code);
}

/** The building a room is in, or undefined if its building isn't in the data. */
export function findBuildingOfRoom(room: CampusRoom) {
  return findBuilding(room.building);
}

/** The rooms inside a building, in the order they appear in the data. */
export function getRoomsInBuilding(building: CampusBuilding) {
  return CAMPUS_ROOMS.filter((room) => room.building === building.name);
}
