// The map style file has "key=MAPTILER_KEY" as a placeholder in its tile
// address. Every request MapLibre makes passes through withMapTilerKey(), which
// puts in the real key from .env. That way the key lives in one place.

import { MAP_CONFIG } from "../config/map";

const MAPTILER_HOST = "https://api.maptiler.com/";
const KEY_PARAMETER = /([?&]key=)[^&]*/;

export function withMapTilerKey(url: string) {
  if (!url.startsWith(MAPTILER_HOST)) return url;
  return url.replace(KEY_PARAMETER, `$1${MAP_CONFIG.mapTilerKey}`);
}

if (!MAP_CONFIG.mapTilerKey) {
  console.warn(
    "VITE_MAPTILER_KEY is not set in .env, so the map tiles will not load.",
  );
}
