// "Classes in this room", at the bottom of the room panel: the list of
// classes held in the room, and an "Open schedule" button that shows them
// as a weekly timetable in a pop-up window (ScheduleWindow.tsx).

import { ArrowUpRight } from "lucide-react";
import { useModalStore } from "../../store/modalStore";
import ClassList from "./ClassList";
import { useRoomClasses } from "./useRoomClasses";
import s from "./Schedule.module.css";

type ClassesSectionProps = {
  roomCode: string;
};

export default function ClassesSection({ roomCode }: ClassesSectionProps) {
  const classes = useRoomClasses(roomCode); // null while loading
  const openModal = useModalStore((state) => state.openModal);

  const hasClasses = classes !== null && classes.length > 0;

  function renderBody() {
    if (classes === null) return <p className={s.message}>Loading classes...</p>;
    if (classes.length === 0) return <p className={s.message}>No classes added yet.</p>;
    return <ClassList classes={classes} />;
  }

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h3 className={s.sectionTitle}>Classes in this room</h3>
        {/* "disabled" greys the button out and ignores clicks: there is
            no timetable to show for a room without classes. */}
        <button
          type="button"
          className={s.openButton}
          disabled={!hasClasses}
          onClick={() => openModal("schedule")}
        >
          Open schedule
          <ArrowUpRight size={20} aria-hidden />
        </button>
      </div>
      {renderBody()}
    </section>
  );
}
