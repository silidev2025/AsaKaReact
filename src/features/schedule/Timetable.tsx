// A weekly timetable: days across the top, hours down the side, and a
// colored block for every class meeting.
//
//   ┌────┬─────┬─────┬─────┬─────┬─────┬─────┐
//   │    │  M  │  T  │  W  │ Th  │  F  │  S  │   day header
//   ├────┼─────┼─────┼─────┼─────┼─────┼─────┤
//   │7:00│     │█████│     │█████│     │     │   one row per hour
//   │8:00│     │█████│     │█████│     │     │
//   └────┴─────┴─────┴─────┴─────┴─────┴─────┘
//
// Each block is placed with CSS: its "top" and "height" are percentages of
// the day column, worked out from the class's start and end hours.
// Hours, days and colors are in src/config/schedule.ts.

import type { CSSProperties } from "react";
import { SCHEDULE_CONFIG } from "../../config/schedule";
import type { ClassRow } from "../../lib/catalog";
import { formatHourLabel, toTimetableBlocks, type TimetableBlock } from "../../lib/schedule";
import s from "./Timetable.module.css";

const { firstHour, lastHour, days } = SCHEDULE_CONFIG;
const HOUR_COUNT = lastHour - firstHour;

/** [7, 8, 9, ..., 19]: the hours that get a row. */
const HOURS = Array.from({ length: HOUR_COUNT }, (_, index) => firstHour + index);

/** Tells the CSS how many day columns to make. */
const GRID_STYLE = { "--day-count": days.length } as CSSProperties;

/**
 * Where a block sits in its day column. A class from 8:00 to 9:30 on a
 * 7:00 to 20:00 timetable starts 1/13 of the way down and is 1.5/13 tall.
 */
function getBlockStyle(block: TimetableBlock): CSSProperties {
  return {
    top: `${((block.startHour - firstHour) / HOUR_COUNT) * 100}%`,
    height: `${((block.endHour - block.startHour) / HOUR_COUNT) * 100}%`,
    backgroundColor: block.color,
  };
}

type TimetableProps = {
  classes: ClassRow[];
};

export default function Timetable({ classes }: TimetableProps) {
  const blocks = toTimetableBlocks(classes);

  return (
    // The scroller lets the timetable scroll sideways on narrow phones
    // instead of squeezing the blocks too thin to read.
    <div className={s.scroller}>
      <div className={s.timetable} style={GRID_STYLE} aria-label="Weekly schedule">
        <div className={s.corner} />

        <div className={s.dayHeader}>
          {days.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className={s.timeColumn}>
          {HOURS.map((hour) => (
            <div key={hour} className={s.timeLabel}>
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>

        <div className={s.grid}>
          {/* The grid lines: one row per hour. */}
          {HOURS.map((hour) => (
            <div key={hour} className={s.hourRow} />
          ))}

          {/* The day columns sit on top of the lines and hold the blocks. */}
          <div className={s.dayColumns}>
            {days.map((day, dayIndex) => (
              <div key={day} className={s.dayColumn}>
                {blocks
                  .filter((block) => block.dayIndex === dayIndex)
                  .map((block) => (
                    <div
                      key={block.key}
                      className={s.block}
                      style={getBlockStyle(block)}
                      title={`${block.label} ${block.section}`}
                    >
                      <span className={s.blockLabel}>{block.label}</span>
                      <span className={s.blockSection}>{block.section}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
