// What the schedule pop-up window shows: the weekly timetable of the room
// that is picked in the search. Opened by "Open schedule" in the room panel
// (ClassesSection.tsx), and listed in src/features/home/ModalHost.tsx.

import { useQueryStore } from "../../store/queryStore";
import Timetable from "./Timetable";
import { useRoomClasses } from "./useRoomClasses";
import s from "./Schedule.module.css";

export default function ScheduleWindow() {
  const category = useQueryStore((state) => state.category);
  const type = useQueryStore((state) => state.type);
  const value = useQueryStore((state) => state.value);

  const isRoomPicked = category === "room" && type === "result";

  // Hooks must run on every render, in the same order, so this can't sit
  // inside an "if". With no room picked it asks for "" and gets no classes.
  const classes = useRoomClasses(isRoomPicked ? value : "");

  if (!isRoomPicked) return null;
  if (classes === null) return <p className={s.message}>Loading schedule...</p>;
  return <Timetable classes={classes} />;
}
