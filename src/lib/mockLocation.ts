// For testing away from campus: reads a pretend position from the web
// address, like ?mockLocation=123.881021,10.29485 (longitude, latitude).
// The parameter names are in DIRECTIONS_CONFIG.mockLocationParams.

import { DIRECTIONS_CONFIG } from "../config/directions";
import type { LngLat } from "./geo";

/** "123.88,10.29" gives [123.88, 10.29]. Anything else gives null. */
function parseLngLat(text: string): LngLat | null {
  const parts = text.split(/[,\s]+/); // split on commas or spaces
  if (parts.length !== 2) return null;
  const [lng, lat] = parts.map(Number);
  // Number("abc") is NaN, which isFinite rejects.
  if (lng === undefined || lat === undefined) return null;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return [lng, lat];
}

/** The pretend position from the address, or null if there isn't one. */
export function readMockLocation(): LngLat | null {
  const params = new URLSearchParams(window.location.search);
  for (const name of DIRECTIONS_CONFIG.mockLocationParams) {
    const value = params.get(name);
    if (value) return parseLngLat(value);
  }
  return null;
}
