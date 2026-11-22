// How the search box behaves. The words and lists it shows (placeholder,
// room codes, trending searches) are in src/data/search.json.

export const SEARCH_CONFIG = {
  /** Most suggestions shown while typing. */
  maxSuggestions: 5,
  /** How many recent searches are remembered. The oldest drops off. */
  maxRecentSearches: 5,
  /** Matching letters are bolded only once at least this many are typed. */
  highlightMinLength: 2,
  /** Rooms per page in a building's room list (Previous / Next pages). */
  roomsPerPage: 12,
};
