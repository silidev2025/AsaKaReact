// When a new walking route appears, zooms the map out (or in) so the whole
// route fits on screen, from the user to the building, clear of the side
// panel. Called by CampusMap.tsx.

import { useEffect } from "react";
import { LngLatBounds, type Map as MapLibreMap } from "maplibre-gl";
import { DIRECTIONS_CONFIG } from "../../config/directions";
import { getCameraPadding } from "../campus-map/cameraPadding";
import type { WalkingRoute } from "./useWalkingRoute";

export function useFitToRoute(
  map: MapLibreMap | null,
  route: WalkingRoute | null,
  isMobile: boolean,
  stopOrbit: () => void,
) {
  useEffect(() => {
    const firstPoint = route?.points[0];
    if (!map || !route || !firstPoint) return;

    // The smallest box that holds every point of the route.
    const bounds = new LngLatBounds(firstPoint, firstPoint);
    for (const point of route.points) bounds.extend(point);

    // Keep the route clear of the panel, plus some space on every side.
    const panel = getCameraPadding(isMobile);
    const extra = DIRECTIONS_CONFIG.routeFitPaddingPx;

    stopOrbit(); // circling would cancel the zoom
    map.fitBounds(bounds, {
      padding: {
        top: panel.top + extra,
        right: panel.right + extra,
        bottom: panel.bottom + extra,
        left: panel.left + extra,
      },
      duration: DIRECTIONS_CONFIG.routeFitDurationMs,
    });
    // Runs again for a new route, or when the screen switches between the
    // phone and computer layouts (the panel moves, so the space changes).
  }, [map, route, isMobile, stopOrbit]);
}
