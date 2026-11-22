// Names of the browser caches the app uses for offline mode.
//
// Both the app (src/lib/offlineMapCache.ts) and the service worker settings
// (vite.config.ts) import these, so the two always agree on the names.
// This file must stay plain TypeScript with no imports, because
// vite.config.ts runs in Node, not in the browser.

export const CACHE_NAMES = {
  /** The app's own JavaScript and CSS files. */
  appShell: "app-shell-assets",
  /** Icons, fonts and the web app manifest. */
  appStatic: "app-static-assets",
  /** Map tiles, map icons (sprites) and map fonts (glyphs). */
  mapAssets: "map-assets",
};
