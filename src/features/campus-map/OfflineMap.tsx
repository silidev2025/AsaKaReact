// A hand-drawn style sketch of the campus, shown when there is no internet
// and the real map couldn't load. The building pins still sit at their real
// positions, so the user can still find their way.
//
// The roads, lawns and building shapes come from src/data/offline-sketch.json.
// Their numbers are positions in percent of the screen: x 0 is the left
// edge, x 100 the right edge, y 0 the top and y 100 the bottom.

import type { MouseEvent } from "react";
import { Building2, Route, University, UserRound } from "lucide-react";
import { MAP_CONFIG } from "../../config/map";
import sketch from "../../data/offline-sketch.json";
import { BUILDINGS, CAMPUS, type CampusBuilding } from "../../lib/campus";
import { cx } from "../../lib/cx";
import type { LngLat } from "../../lib/geo";
import { useLocationStore } from "../../store/locationStore";
import type { WalkingRoute } from "../get-directions/useWalkingRoute";
import s from "./OfflineMap.module.css";

type OfflineMapProps = {
  activeBuildingName: string | null;
  onBuildingSelect: (building: CampusBuilding, event: MouseEvent) => void;
  /** The walking route to draw, if "Get Directions" was pressed. */
  route: WalkingRoute | null;
};

/** The area the sketch covers: the campus plus a margin around it. */
const { marginLng, marginLat, edgePaddingPercent } = MAP_CONFIG.offlineSketch;
const SKETCH_AREA = {
  west: CAMPUS.locationBounds.west - marginLng,
  east: CAMPUS.locationBounds.east + marginLng,
  south: CAMPUS.locationBounds.south - marginLat,
  north: CAMPUS.locationBounds.north + marginLat,
};

/** Turns a coordinate into a point on the sketch, from 0 to 100 each way. */
function toSketchPoint([lng, lat]: LngLat) {
  const x = ((lng - SKETCH_AREA.west) / (SKETCH_AREA.east - SKETCH_AREA.west)) * 100;
  // Screen y grows downward but latitude grows northward (up), so flip it.
  const y = (1 - (lat - SKETCH_AREA.south) / (SKETCH_AREA.north - SKETCH_AREA.south)) * 100;
  // Keep pins a little away from the edges so they stay fully visible.
  const min = edgePaddingPercent;
  const max = 100 - edgePaddingPercent;
  return {
    x: Math.min(max, Math.max(min, x)),
    y: Math.min(max, Math.max(min, y)),
  };
}

/** The same point as CSS, to place a pin with style={...}. */
function toSketchPosition(coords: LngLat) {
  const { x, y } = toSketchPoint(coords);
  return { left: `${x}%`, top: `${y}%` };
}

export default function OfflineMap({
  activeBuildingName,
  onBuildingSelect,
  route,
}: OfflineMapProps) {
  const userCoords = useLocationStore((state) => state.coords);
  const isMock = useLocationStore((state) => state.isMock);
  const destination = useLocationStore((state) => state.destination);

  // The route as SVG polyline points: "x1,y1 x2,y2 ...".
  const routePoints = route?.points
    .map((point) => {
      const { x, y } = toSketchPoint(point);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={s.offlineMap} aria-label="Offline campus map">
      <div className={s.grid} />

      {/* viewBox="0 0 100 100" makes the drawing use the same 0 to 100
          numbers as the JSON file. preserveAspectRatio="none" stretches it
          to fill the screen. */}
      <svg
        className={s.drawing}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {sketch.roads.map((road) => (
          <path
            key={road.path}
            className={cx(s.road, road.major && s.majorRoad)}
            d={road.path}
          />
        ))}
        {sketch.walkways.map((path) => (
          <path key={path} className={s.walkway} d={path} />
        ))}
        {sketch.greenAreas.map((area) => (
          <rect key={`${area.x},${area.y}`} className={s.greenArea} rx="2" {...area} />
        ))}
        {sketch.buildingShapes.map((shape) => (
          <rect key={`${shape.x},${shape.y}`} className={s.buildingShape} rx="1" {...shape} />
        ))}
        {/* The walking route: a white line under a maroon one. */}
        {routePoints && (
          <>
            <polyline className={s.routeCasing} points={routePoints} />
            <polyline className={s.routeLine} points={routePoints} />
          </>
        )}
      </svg>

      <div className={s.campusLabel}>
        <University size={20} />
        <span>{CAMPUS.shortName}</span>
      </div>
      <div className={s.status}>Offline map</div>

      {destination && (
        <div className={s.destinationPin} style={toSketchPosition(destination)} title="Destination">
          <Route size={16} />
        </div>
      )}
      {userCoords && (
        <div
          className={cx(s.userPin, isMock && s.mock)}
          style={toSketchPosition(userCoords)}
          title={isMock ? "Demo position" : "Your location"}
        >
          <UserRound size={16} />
        </div>
      )}

      {BUILDINGS.map((building) => (
        <button
          key={building.name}
          type="button"
          className={cx(
            s.buildingPin,
            activeBuildingName === building.name && s.active,
          )}
          style={toSketchPosition(building.coords)}
          title={building.fullName ?? building.name}
          onClick={(event) => onBuildingSelect(building, event)}
        >
          <span className={s.buildingDot}>
            <Building2 size={16} />
          </span>
          <span className={s.buildingName}>
            <strong>{building.name}</strong>
          </span>
        </button>
      ))}
    </div>
  );
}
