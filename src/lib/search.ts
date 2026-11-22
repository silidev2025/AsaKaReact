// The search logic, as plain functions with no React in them. Given what the
// user typed, they work out which buildings and rooms to suggest, and which
// letters to show in bold. Because they only take values in and give values
// back, they are easy to test and to reason about.
//
// What can be found:
//   buildings ...... src/data/buildings.json (by short or full name)
//   rooms .......... "roomCodes" in src/data/search.json

import { SEARCH_CONFIG } from "../config/search";
import searchData from "../data/search.json";
import {
  BUILDINGS,
  findBuilding,
  getBuildingDisplayName,
  getBuildingSearchValues,
} from "./campus";

/** Every kind of thing a search result can be. */
export const SEARCH_CATEGORIES = [
  "building",
  "college",
  "division",
  "room",
  "class",
] as const;

// "typeof SEARCH_CATEGORIES[number]" turns the list above into the type
// "building" | "college" | "division" | "room" | "class", so the list and the
// type can never disagree.
export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];

/** One thing the user can pick: a suggestion, a trending or recent search. */
export type SearchItem = {
  category: SearchCategory;
  /** The text shown and searched for, like "GLE 201". */
  value: string;
};

/** Room codes the search knows about, from src/data/search.json. */
export const ROOM_CODES: string[] = searchData.roomCodes;

/** Suggestions shown before anything is typed, when there are no recent ones. */
export const TRENDING_SEARCHES: SearchItem[] = searchData.trending.filter(isSearchItem);

/** Lower case with spaces trimmed, so "  Gle " and "gle" compare equal. */
function normalize(text: string) {
  return text.trim().toLowerCase();
}

/**
 * The buildings and rooms whose names contain the typed text, buildings
 * first, at most SEARCH_CONFIG.maxSuggestions of them.
 */
export function getSuggestions(typedText: string): SearchItem[] {
  const wanted = normalize(typedText);
  if (wanted === "") return [];

  const buildingMatches: SearchItem[] = BUILDINGS.filter((building) =>
    getBuildingSearchValues(building).some((name) =>
      name.toLowerCase().includes(wanted),
    ),
  ).map((building) => ({
    category: "building",
    value: getBuildingDisplayName(building),
  }));

  const roomMatches: SearchItem[] = ROOM_CODES.filter((roomCode) =>
    roomCode.toLowerCase().includes(wanted),
  ).map((roomCode) => ({ category: "room", value: roomCode }));

  return [...buildingMatches, ...roomMatches].slice(
    0,
    SEARCH_CONFIG.maxSuggestions,
  );
}

/**
 * True if the app can still find this item. A saved recent search may point
 * at something that was renamed or removed since; those are dropped.
 */
export function isKnownSearchItem(item: SearchItem) {
  if (item.category === "building") return findBuilding(item.value) !== undefined;
  if (item.category === "room") return ROOM_CODES.includes(item.value);
  return false; // colleges, divisions and classes aren't searchable yet
}

/**
 * Checks that a value read from storage really is a SearchItem. Saved data
 * can be old or edited by hand, so it is never trusted blindly.
 *
 * The return type "value is SearchItem" tells TypeScript: when this returns
 * true, treat the value as a SearchItem from then on.
 */
export function isSearchItem(value: unknown): value is SearchItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.value === "string" &&
    SEARCH_CATEGORIES.includes(item.category as SearchCategory)
  );
}

/** True if both items are the same thing. */
export function isSameSearchItem(a: SearchItem, b: SearchItem) {
  return a.category === b.category && a.value === b.value;
}

/** A piece of text, and whether it matches what the user typed. */
export type TextPart = { text: string; isMatch: boolean };

/**
 * Cuts a name into pieces so the parts that match the typed text can be
 * shown in bold. For example, with "le" typed:
 *   "GLE 201"  gives  "G", "LE" (match), " 201"
 * Capital letters are ignored when matching. Nothing is bolded until at
 * least SEARCH_CONFIG.highlightMinLength letters are typed.
 */
export function splitByMatch(text: string, typedText: string): TextPart[] {
  const wanted = normalize(typedText);
  if (wanted.length < SEARCH_CONFIG.highlightMinLength) {
    return [{ text, isMatch: false }];
  }

  const lowerText = text.toLowerCase();
  const parts: TextPart[] = [];
  let position = 0; // where the next unprocessed letter is
  let matchStart = lowerText.indexOf(wanted); // -1 means "not found"

  while (matchStart !== -1) {
    // The plain text before this match, if any.
    if (matchStart > position) {
      parts.push({ text: text.slice(position, matchStart), isMatch: false });
    }
    // The match itself, keeping the name's own capital letters.
    const matchEnd = matchStart + wanted.length;
    parts.push({ text: text.slice(matchStart, matchEnd), isMatch: true });

    position = matchEnd;
    matchStart = lowerText.indexOf(wanted, position);
  }

  // The plain text after the last match.
  if (position < text.length) {
    parts.push({ text: text.slice(position), isMatch: false });
  }
  return parts;
}
