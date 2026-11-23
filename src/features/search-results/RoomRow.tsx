// One room in a room list: an arrow, the room code, and how many classes
// are held there.

import { ArrowUpRight } from "lucide-react";
import { countClassesInRoom } from "../../lib/catalog";
import { countLabel } from "../../lib/format";
import s from "./RoomList.module.css";

type RoomRowProps = {
  roomCode: string;
  onSelect: () => void;
};

export default function RoomRow({ roomCode, onSelect }: RoomRowProps) {
  return (
    <button type="button" className={s.row} onClick={onSelect}>
      <ArrowUpRight size={20} className={s.rowIcon} aria-hidden />
      <span className={s.roomCode}>{roomCode}</span>
      <span className={s.classCount}>
        {countLabel(countClassesInRoom(roomCode), "class", "classes")}
      </span>
    </button>
  );
}
