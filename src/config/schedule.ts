// How the weekly timetable in the schedule window looks. Its grid colors are
// in src/styles/theme.css (--color-timetable-...).

export const SCHEDULE_CONFIG = {
  /** The timetable starts at this hour (24-hour clock: 7 is 7:00 AM). */
  firstHour: 7,
  /** ...and ends at this hour (20 is 8:00 PM). */
  lastHour: 20,

  /**
   * The day columns, in order. Each code is how the day is written in the
   * class data: "TTh" means Tuesday and Thursday.
   */
  days: ["M", "T", "W", "Th", "F", "S"],

  /**
   * Colors for the class blocks. Each course always gets the same color
   * (see getCourseColor in src/lib/schedule.ts).
   */
  courseColors: [
    "#2E7D32",
    "#1565C0",
    "#6A1B9A",
    "#C62828",
    "#EF6C00",
    "#00838F",
    "#4527A0",
    "#AD1457",
    "#00695C",
    "#5D4037",
    "#37474F",
    "#1B5E20",
    "#0D47A1",
    "#4A148C",
    "#B71C1C",
  ],
};
