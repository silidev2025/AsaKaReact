// What the user is searching for. Shared by the search box (Search), and
// later by the side panel and the map, which show and fly to the result.
//
// Two moments matter:
//   typing ........ inputValue changes and type is "query" (suggestions show)
//   picking ....... type becomes "result", with the picked category and
//                   value (the side panel and map react to this)
//
// The last few picked results are kept in recentSearches and saved in the
// browser, so they are still there after a reload.

import { create } from "zustand";
import { SEARCH_CONFIG } from "../config/search";
import { STORAGE_KEYS } from "../config/storageKeys";
import {
  isKnownSearchItem,
  isSameSearchItem,
  isSearchItem,
  type SearchCategory,
  type SearchItem,
} from "../lib/search";
import { readStorage, writeStorage } from "../lib/storage";

type QueryState = {
  /** The text in the search box right now. */
  inputValue: string;
  /** "query" while typing, "result" once something is picked. */
  type: "query" | "result";
  /** What kind of thing was picked, or null if nothing is. */
  category: SearchCategory | null;
  /** The name of the picked thing, like "GLE 201". */
  value: string;
  /** Picked results, newest first. */
  recentSearches: SearchItem[];

  /** Called on every key press in the search box. */
  setInputValue: (text: string) => void;
  /** Called when the user picks a suggestion. */
  selectResult: (item: SearchItem) => void;
  /** Empties the search box and forgets the picked result. */
  clearQuery: () => void;
};

/** Reads the saved recent searches, keeping only valid, findable ones. */
function loadRecentSearches(): SearchItem[] {
  try {
    const saved: unknown = JSON.parse(
      readStorage(STORAGE_KEYS.recentSearches) ?? "[]",
    );
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(isSearchItem)
      .filter(isKnownSearchItem)
      .slice(0, SEARCH_CONFIG.maxRecentSearches);
  } catch {
    return []; // the saved text wasn't valid JSON
  }
}

/** Puts the item first, removes any older copy of it, and keeps the newest few. */
function addToRecent(recent: SearchItem[], item: SearchItem) {
  const withoutItem = recent.filter((old) => !isSameSearchItem(old, item));
  return [item, ...withoutItem].slice(0, SEARCH_CONFIG.maxRecentSearches);
}

// "set" changes the state; "get" reads the current state from inside.
export const useQueryStore = create<QueryState>()((set, get) => ({
  inputValue: "",
  type: "query",
  category: null,
  value: "",
  recentSearches: loadRecentSearches(),

  setInputValue: (text) => set({ inputValue: text, type: "query" }),

  selectResult: (item) => {
    const recentSearches = addToRecent(get().recentSearches, item);
    writeStorage(STORAGE_KEYS.recentSearches, JSON.stringify(recentSearches));
    set({
      inputValue: item.value,
      type: "result",
      category: item.category,
      value: item.value,
      recentSearches,
    });
  },

  clearQuery: () =>
    set({ inputValue: "", type: "query", category: null, value: "" }),
}));
