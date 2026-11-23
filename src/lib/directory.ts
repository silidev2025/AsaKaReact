// The campus directory: every building, A to Z, with the rooms inside it.
// Plain functions, no React. The data comes from src/data/buildings.json
// and src/data/campus-rooms.json, through src/lib/campus.ts.

import {
  BUILDINGS,
  CAMPUS_ROOMS,
  getBuildingDisplayName,
  getBuildingSearchValues,
  getRoomsInBuilding,
  type CampusBuilding,
  type CampusRoom,
} from "./campus";

/** One building in the directory, with the rooms to list under it. */
export type DirectoryEntry = {
  building: CampusBuilding;
  rooms: CampusRoom[];
};

/**
 * Every building, sorted A to Z by the name people see.
 *
 * [...BUILDINGS] makes a copy first, because sort() reorders the array it
 * is given, and other parts of the app use BUILDINGS in its original order.
 * localeCompare compares two texts the way a dictionary would.
 */
const ALL_ENTRIES: DirectoryEntry[] = [...BUILDINGS]
  .sort((a, b) => getBuildingDisplayName(a).localeCompare(getBuildingDisplayName(b)))
  .map((building) => ({ building, rooms: getRoomsInBuilding(building) }));

/** How many buildings and rooms the directory knows about. */
export const DIRECTORY_COUNTS = {
  buildings: BUILDINGS.length,
  rooms: CAMPUS_ROOMS.length,
};

/**
 * The directory, narrowed down by what the user typed in its filter box:
 *   - a building whose name matches is shown with all its rooms
 *   - otherwise, a building is shown with just the rooms that match
 *   - buildings with no match at all are left out
 * Capital letters and spaces around the text are ignored.
 */
export function filterDirectory(filterText: string): DirectoryEntry[] {
  const wanted = filterText.trim().toLowerCase();
  if (wanted === "") return ALL_ENTRIES;

  const results: DirectoryEntry[] = [];
  for (const entry of ALL_ENTRIES) {
    const buildingMatches = getBuildingSearchValues(entry.building).some((name) =>
      name.toLowerCase().includes(wanted),
    );
    if (buildingMatches) {
      results.push(entry);
      continue; // go on to the next building
    }

    const matchingRooms = entry.rooms.filter((room) =>
      room.code.toLowerCase().includes(wanted),
    );
    if (matchingRooms.length > 0) {
      results.push({ building: entry.building, rooms: matchingRooms });
    }
  }
  return results;
}
