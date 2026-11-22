// The room catalog: rooms, buildings, colleges, divisions and classes.
//
// The data comes from src/data/catalog/*.json, which scripts/export-data.mjs
// creates from data/info.db. Don't edit those JSON files by hand; change the
// database and run "npm run data:export" instead.
//
// The rooms load with the app. The classes are much bigger (thousands of
// rows), so they load only when a room that has classes is opened (see
// loadClassesForRoom below).
//
// Note: the database currently holds another campus's rooms, so none of the
// CIT-U room codes are in it yet, and their class counts come out as 0.

import roomRows from "../data/catalog/rooms.json";

export type Room = {
  id: number;
  roomCode: string;
  /** How to find the room once inside its building, if anyone wrote it down. */
  directions: string | null;
  buildingId: number | null;
  collegeId: number | null;
  divisionId: number | null;
  /** How many classes are held in the room (counted by the export script). */
  classCount: number;
};

export const ROOMS: Room[] = roomRows;

/** Numbers for the "Rooms with directions" bar. */
export const ROOM_STATS = {
  total: ROOMS.length,
  withDirections: ROOMS.filter((room) => room.directions !== null).length,
};

/** Finds a room in the database by its code, like "PSLH A". */
function findCatalogRoom(roomCode: string) {
  return ROOMS.find((row) => row.roomCode === roomCode);
}

/** How many classes are held in the room with this code (0 if unknown). */
export function countClassesInRoom(roomCode: string) {
  return findCatalogRoom(roomCode)?.classCount ?? 0;
}

/** One class (one section of a course) from the database. */
export type ClassRow = {
  id: number;
  courseCode: string;
  section: string;
  /** "LEC", "LAB" and so on. Can be empty. */
  type: string;
  /** When it meets, like "TTh 01:00PM-02:30PM", several joined by commas. */
  schedule: string;
  roomId: number;
  courseTitle: string;
  termId: number;
};

/** The classes file once it has started loading, so it only loads once. */
let allClassesPromise: Promise<ClassRow[]> | null = null;

function loadAllClasses() {
  if (allClassesPromise === null) {
    // import() written like a function loads a file later, the first time
    // it is needed, instead of together with the rest of the app. Vite puts
    // the file in its own download. It gives back a Promise: a value that
    // arrives later.
    allClassesPromise = import("../data/catalog/classes.json")
      .then((file) => file.default)
      .catch(() => {
        // Couldn't download it (for example offline). Forget the failed
        // try so the next room can try again, and show no classes for now.
        allClassesPromise = null;
        return [];
      });
  }
  return allClassesPromise;
}

/**
 * The classes held in a room. Rooms without classes answer straight away
 * without downloading the classes file at all.
 *
 * "async" lets the function use "await": wait for a Promise, then go on.
 */
export async function loadClassesForRoom(roomCode: string): Promise<ClassRow[]> {
  const room = findCatalogRoom(roomCode);
  if (!room || room.classCount === 0) return [];

  const allClasses = await loadAllClasses();
  return allClasses.filter((classRow) => classRow.roomId === room.id);
}
