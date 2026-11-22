// Names the app uses to save small things in the browser (localStorage).
// Keeping them in one list makes it easy to see everything the app
// remembers, and avoids two features picking the same name by accident.

export const STORAGE_KEYS = {
  /** "true" once the user ticks "Don't show again" on the welcome window. */
  hideWelcome: "hideLandingModal",
  /** The last few search results the user picked, as a JSON list. */
  recentSearches: "recent-search",
  /** Time the user last closed the install prompt, in milliseconds. */
  installPromptDismissedAt: "yourroute:pwa-install-dismissed-at",
  /** "ready" once every offline map file is saved. */
  mapCacheReady: "yourroute:citu-map-cache:v1",
};
