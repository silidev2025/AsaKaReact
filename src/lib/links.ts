// Builds links to outside services. The base addresses are in
// src/config/links.ts.

import { EXTERNAL_LINKS } from "../config/links";
import type { LngLat } from "./geo";

/**
 * A Google Maps link with a pin on the given spot. Google wants latitude
 * first, while this app stores [longitude, latitude], so they are swapped.
 */
export function googleMapsUrl([lng, lat]: LngLat) {
  return `${EXTERNAL_LINKS.googleMaps}?q=${lat},${lng}`;
}
