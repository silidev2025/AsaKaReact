// Gives the walking route from routeOrigin to destination (both in the
// location store), or null when there is no route to show.
//
// The route comes from the walking-route service (src/lib/routing.ts). If
// the service can't be reached (offline, or it's down), a straight line is
// used instead, drawn dashed, and the user is told.

import { useEffect, useState } from "react";
import type { LngLat } from "../../lib/geo";
import { fetchWalkingRoute } from "../../lib/routing";
import { useLocationStore } from "../../store/locationStore";
import { showToast } from "../../store/toastStore";

export type WalkingRoute = {
  points: LngLat[];
  /** True when the service couldn't help and this is just a straight line. */
  isStraightLine: boolean;
};

/** A text that is the same for the same two ends, to tell routes apart. */
function routeKey(origin: LngLat, destination: LngLat) {
  return `${origin.join(",")};${destination.join(",")}`;
}

export function useWalkingRoute(): WalkingRoute | null {
  const origin = useLocationStore((state) => state.routeOrigin);
  const destination = useLocationStore((state) => state.destination);
  const [loaded, setLoaded] = useState<{ key: string; route: WalkingRoute } | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    // Same idea as in useRoomClasses: if the ends change before the answer
    // arrives, the cleanup marks this answer as no longer wanted.
    let isStillWanted = true;
    const key = routeKey(origin, destination);

    fetchWalkingRoute(origin, destination)
      .then((points): WalkingRoute => ({ points, isStraightLine: false }))
      .catch((): WalkingRoute => {
        if (isStillWanted) {
          showToast("Couldn't get a walking route. Showing a straight line instead.", "error");
        }
        return { points: [origin, destination], isStraightLine: true };
      })
      .then((route) => {
        if (isStillWanted) setLoaded({ key, route });
      });

    return () => {
      isStillWanted = false;
    };
  }, [origin, destination]);

  // Only show a route that belongs to the current two ends.
  if (!origin || !destination) return null;
  return loaded?.key === routeKey(origin, destination) ? loaded.route : null;
}
