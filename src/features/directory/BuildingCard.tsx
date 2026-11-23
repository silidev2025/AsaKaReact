// One building in the Directory window: its name (tap to pick the
// building), then a button for each of its rooms (tap to pick the room).

import { ArrowUpRight, DoorClosed, University } from "lucide-react";
import { getBuildingDisplayName } from "../../lib/campus";
import type { DirectoryEntry } from "../../lib/directory";
import type { SearchItem } from "../../lib/search";
import s from "./Directory.module.css";

type BuildingCardProps = {
  entry: DirectoryEntry;
  /** Called with the building or room the user tapped. */
  onPick: (item: SearchItem) => void;
};

export default function BuildingCard({ entry, onPick }: BuildingCardProps) {
  const { building, rooms } = entry;
  const displayName = getBuildingDisplayName(building);

  return (
    <li className={s.card}>
      <button
        type="button"
        className={s.buildingButton}
        onClick={() => onPick({ category: "building", value: displayName })}
      >
        <University size={20} className={s.icon} aria-hidden />
        <span className={s.buildingText}>
          <span className={s.buildingName}>{displayName}</span>
          {/* The short name, like "GLE", when it differs from the full one. */}
          {building.fullName && <span className={s.shortName}>{building.name}</span>}
        </span>
        <ArrowUpRight size={18} className={s.arrow} aria-hidden />
      </button>

      {rooms.length > 0 ? (
        <div className={s.rooms}>
          {rooms.map((room) => (
            <button
              key={room.code}
              type="button"
              className={s.roomButton}
              onClick={() => onPick({ category: "room", value: room.code })}
            >
              <DoorClosed size={16} aria-hidden />
              {room.code}
            </button>
          ))}
        </div>
      ) : (
        <p className={s.noRooms}>No rooms listed yet.</p>
      )}
    </li>
  );
}
