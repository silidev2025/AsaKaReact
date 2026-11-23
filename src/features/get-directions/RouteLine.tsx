// Draws the walking route on the map: a thick white line underneath (so the
// route stands out on any background) and the maroon line on top. A
// straight-line fallback is dashed, so it doesn't look like a real path.
//
// In MapLibre, a "source" holds the data (here, one line) and each "layer"
// says how to paint it. Drawn inside the map by CampusMap.tsx.

import { Layer, Source } from "react-map-gl/maplibre";
import { readThemeColor } from "../../lib/theme";
import type { WalkingRoute } from "./useWalkingRoute";

/** Line widths in pixels. */
const CASING_WIDTH = 10;
const LINE_WIDTH = 5;
/** Dash and gap lengths, in line widths, for the straight-line fallback. */
const DASHES = [1.5, 1.5];

type RouteLineProps = {
  route: WalkingRoute;
};

export default function RouteLine({ route }: RouteLineProps) {
  // GeoJSON is the standard format for shapes on a map. This is one line
  // through all the route's points. "as const" tells TypeScript these are
  // the exact words GeoJSON expects, not just any text.
  const line = {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: route.points },
  };

  return (
    <Source id="walking-route" type="geojson" data={line}>
      <Layer
        id="walking-route-casing"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": readThemeColor("--color-surface"),
          "line-width": CASING_WIDTH,
          "line-opacity": 0.9,
        }}
      />
      <Layer
        id="walking-route-line"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": readThemeColor("--color-primary"),
          "line-width": LINE_WIDTH,
          "line-opacity": 0.96,
          // "..." adds the dash setting only for the straight line.
          ...(route.isStraightLine ? { "line-dasharray": DASHES } : {}),
        }}
      />
    </Source>
  );
}
