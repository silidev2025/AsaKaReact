// Reads class schedules like "TTh 01:00PM-02:30PM" and turns them into
// blocks for the weekly timetable. Plain functions, no React.
//
// Times are stored as hours with decimals on a 24-hour clock, because that
// makes the math simple: 1:30 PM is 13.5, and a class from 13.5 to 15 is
// 1.5 hours long.

import { SCHEDULE_CONFIG } from "../config/schedule";
import type { ClassRow } from "./catalog";

/** One meeting of a class: which days, from when to when. */
export type Meeting = {
  /** Positions in SCHEDULE_CONFIG.days: 0 is Monday, 3 is Thursday. */
  dayIndexes: number[];
  startHour: number;
  endHour: number;
};

/** One colored box on the timetable. */
export type TimetableBlock = {
  key: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  /** Course code and type, like "CS 101 (LEC)". */
  label: string;
  section: string;
  color: string;
};

/**
 * Splits a day code into days: "TTh" gives "T" and "Th", "MWF" gives
 * "M", "W", "F". "Th" is checked first so it isn't read as "T" plus "h".
 */
function parseDays(dayCodes: string): number[] {
  const dayIndexes: number[] = [];
  let position = 0;
  while (position < dayCodes.length) {
    const code = dayCodes.startsWith("Th", position) ? "Th" : dayCodes[position];
    const dayIndex = SCHEDULE_CONFIG.days.indexOf(code ?? "");
    if (dayIndex !== -1) dayIndexes.push(dayIndex);
    position += code?.length ?? 1;
  }
  return dayIndexes;
}

/** 1:30 PM gives 13.5. 12:00 PM is noon (12), 12:00 AM is midnight (0). */
function to24Hour(hour: number, minutes: number, period: string) {
  let hour24 = hour % 12; // 12 becomes 0, the rest stay the same
  if (period.toUpperCase() === "PM") hour24 += 12;
  return hour24 + minutes / 60;
}

/**
 * The shape of one meeting, like "TTh 01:00PM-02:30PM". Piece by piece:
 *   ([A-Za-z]+)                  the days, like "TTh"
 *   \s+                          a space
 *   (\d{1,2}):(\d{2})\s*(AM|PM)  start hour, minutes, AM or PM (a space
 *                                before AM/PM is allowed)
 *   \s*-\s*                      a dash
 *   (\d{1,2}):(\d{2})\s*(AM|PM)  the end time, the same way
 * ^ and $ mean the whole text must match. "i" ignores capital letters.
 */
const MEETING_PATTERN =
  /^([A-Za-z]+)\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

/**
 * Reads one meeting, like "TTh 01:00PM-02:30PM". Gives null for anything
 * else, like an empty schedule or "TBA".
 */
export function parseMeeting(text: string): Meeting | null {
  const match = MEETING_PATTERN.exec(text.trim());
  if (!match) return null;

  // match[0] is the whole text; match[1] to match[7] are the pieces in
  // brackets above, in order. The "= ''" only keeps TypeScript happy: the
  // pattern requires every piece, so they are always there.
  const [, days = "", startHour = "", startMinutes = "", startPeriod = "",
    endHour = "", endMinutes = "", endPeriod = ""] = match;

  return {
    dayIndexes: parseDays(days),
    startHour: to24Hour(Number(startHour), Number(startMinutes), startPeriod),
    endHour: to24Hour(Number(endHour), Number(endMinutes), endPeriod),
  };
}

/** A class can meet more than once a week: "M 08:00AM-09:00AM,W 10:00AM-11:00AM". */
export function splitSchedule(schedule: string) {
  return schedule
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "");
}

/**
 * The same course always gets the same color. The course code is turned
 * into a number (a "hash"), and that number picks a color from the list.
 */
export function getCourseColor(courseCode: string) {
  const colors = SCHEDULE_CONFIG.courseColors;
  let hash = 0;
  for (const character of courseCode) {
    // "<< 5" multiplies by 32; this mixes each letter into the number.
    // "| 0" keeps it a whole 32-bit number so it can't grow forever.
    hash = (character.charCodeAt(0) + ((hash << 5) - hash)) | 0;
  }
  // The remainder after dividing by the list's length is always a position
  // inside the list. The maroon fallback is only used if the list in
  // src/config/schedule.ts is ever left empty.
  return colors[Math.abs(hash) % colors.length] ?? "var(--color-primary)";
}

/** "CS 101 (LEC)", or just "CS 101" when the type is missing. */
export function getClassLabel(classRow: ClassRow) {
  return classRow.type ? `${classRow.courseCode} (${classRow.type})` : classRow.courseCode;
}

/** Turns a room's classes into timetable blocks: one per class, meeting and day. */
export function toTimetableBlocks(classes: ClassRow[]): TimetableBlock[] {
  const blocks: TimetableBlock[] = [];
  for (const classRow of classes) {
    splitSchedule(classRow.schedule).forEach((meetingText, meetingNumber) => {
      const meeting = parseMeeting(meetingText);
      if (!meeting || meeting.endHour <= meeting.startHour) return; // skip what can't be drawn
      for (const dayIndex of meeting.dayIndexes) {
        blocks.push({
          key: `${classRow.id}-${meetingNumber}-${dayIndex}`,
          dayIndex,
          startHour: meeting.startHour,
          endHour: meeting.endHour,
          label: getClassLabel(classRow),
          section: classRow.section,
          color: getCourseColor(classRow.courseCode),
        });
      }
    });
  }
  return blocks;
}

/** The label beside each timetable row: 7 gives "7:00", 13 gives "1:00". */
export function formatHourLabel(hour24: number) {
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:00`;
}
