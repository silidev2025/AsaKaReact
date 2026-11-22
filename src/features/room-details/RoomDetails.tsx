// The side panel for a picked room:
//
//   GLE 201                                  room code
//   [Gregorio L. Escario Building]           the building it's in
//   directions inside the building           (or a Contribute link)
//   ┃ How to get to the building             (or a Contribute link)
//   [Open in Google Maps]
//
// The room comes from src/data/campus-rooms.json and its building from
// src/data/buildings.json. Directions are optional "directions" fields in
// those two files.
//
// Shown by the side panel (src/features/search-results/SidePanel.tsx)
// whenever the search result is a room.

import { findBuildingOfRoom, findRoom, getBuildingDisplayName } from "../../lib/campus";
import { googleMapsUrl } from "../../lib/links";
import Directions from "./Directions";
import s from "./RoomDetails.module.css";

type RoomDetailsProps = {
  /** The room code, as picked in the search, like "GLE 201". */
  value: string;
};

export default function RoomDetails({ value }: RoomDetailsProps) {
  const room = findRoom(value);
  if (!room) {
    return <p className={s.notFound}>Room not found.</p>;
  }

  const building = findBuildingOfRoom(room);
  // Use the building's full name when it's known; otherwise the short name
  // written next to the room in the data.
  const buildingName = building ? getBuildingDisplayName(building) : room.building;

  return (
    <div className={s.container}>
      <header className={s.header}>
        <h2 className={s.title}>{room.code}</h2>
        <div className={s.badge}>
          <p>{buildingName}</p>
        </div>
      </header>

      <Directions text={room.directions} />

      {/* The rest needs the building's data, so it only shows when the
          building is in src/data/buildings.json. */}
      {building && (
        <>
          <div className={s.buildingNote}>
            <h3 className={s.buildingNoteTitle}>How to get to {buildingName}</h3>
            <Directions text={building.directions} />
          </div>

          <div className={s.mapLinks}>
            <a
              className={s.mapLink}
              href={googleMapsUrl(building.coords)}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </>
      )}
    </div>
  );
}
