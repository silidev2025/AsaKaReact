// The room catalog: rooms, buildings, colleges, divisions and classes.
//
// The data comes from src/data/catalog/*.json, which scripts/export-data.mjs
// creates from data/info.db. Don't edit those JSON files by hand; change the
// database and run "npm run data:export" instead.
//
// Only what the built features need is loaded here. More is added as
// features like RoomDetails arrive.
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

/** How many classes are held in the room with this code (0 if unknown). */
export function countClassesInRoom(roomCode: string) {
  const room = ROOMS.find((row) => row.roomCode === roomCode);
  return room ? room.classCount : 0;
}
