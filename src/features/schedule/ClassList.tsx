// The classes in a room as cards: course code and type, course title and
// section on the left, when it meets on the right.

import type { ClassRow } from "../../lib/catalog";
import { getClassLabel, splitSchedule } from "../../lib/schedule";
import s from "./Schedule.module.css";

type ClassListProps = {
  classes: ClassRow[];
};

export default function ClassList({ classes }: ClassListProps) {
  return (
    <ul className={s.classList}>
      {classes.map((classRow) => (
        // The database id is unique and never changes: a good key.
        <li key={classRow.id} className={s.classCard}>
          <div className={s.classInfo}>
            <div className={s.classCode}>{getClassLabel(classRow)}</div>
            <div className={s.classTitle}>{classRow.courseTitle}</div>
            <div className={s.classSection}>{classRow.section}</div>
          </div>
          <div className={s.classTimes}>
            {/* This short list never changes order, so its position is a
                safe key (two meetings could have the same text). */}
            {splitSchedule(classRow.schedule).map((meeting, index) => (
              <div key={index}>{meeting}</div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
