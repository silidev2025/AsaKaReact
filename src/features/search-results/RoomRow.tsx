// One room in a room list: an arrow, the room code, and how many classes
// are held there.

import { ArrowUpRight } from "lucide-react";
import { countClassesInRoom } from "../../lib/catalog";
import s from "./RoomList.module.css";

type RoomRowProps = {
  roomCode: string;
  onSelect: () => void;
};

/** "1 class" or "3 classes". */
function formatClassCount(count: number) {
  return count === 1 ? "1 class" : `${count} classes`;
}

export default function RoomRow({ roomCode, onSelect }: RoomRowProps) {
  return (
    <button type="button" className={s.row} onClick={onSelect}>
      <ArrowUpRight size={20} className={s.rowIcon} aria-hidden />
      <span className={s.roomCode}>{roomCode}</span>
      <span className={s.classCount}>
        {formatClassCount(countClassesInRoom(roomCode))}
      </span>
    </button>
  );
}
