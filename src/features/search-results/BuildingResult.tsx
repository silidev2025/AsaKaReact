// The side panel for a picked building: its name, then the rooms inside it.
//
// The rooms come from src/data/campus-rooms.json (each room says which
// building it's in).

import {
  findBuilding,
  getBuildingDisplayName,
  getRoomsInBuilding,
} from "../../lib/campus";
import RoomList from "./RoomList";
import s from "./BuildingResult.module.css";

type BuildingResultProps = {
  /** The building's name, as picked in the search. */
  value: string;
};

export default function BuildingResult({ value }: BuildingResultProps) {
  const building = findBuilding(value);
  const rooms = building ? getRoomsInBuilding(building) : [];

  return (
    <div className={s.wrapper}>
      {building && (
        <header className={s.header}>
          <h2 className={s.title}>{getBuildingDisplayName(building)}</h2>
        </header>
      )}

      <RoomList
        title="Rooms in the building"
        rooms={rooms}
        emptyText="No rooms found for this building."
      />
    </div>
  );
}
