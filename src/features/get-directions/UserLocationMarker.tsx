// The "you are here" dot on the map: blue with a pulsing ring for real GPS,
// orange for a pretend test position (which can be dragged around).
// Drawn inside the map by CampusMap.tsx.

import { Marker } from "react-map-gl/maplibre";
import { cx } from "../../lib/cx";
import { useLocationStore } from "../../store/locationStore";
import s from "./GetDirections.module.css";

export default function UserLocationMarker() {
  const coords = useLocationStore((state) => state.coords);
  const isMock = useLocationStore((state) => state.isMock);
  const moveMockLocation = useLocationStore((state) => state.moveMockLocation);

  if (!coords) return null; // no position yet: no dot
  const [longitude, latitude] = coords;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      draggable={isMock}
      onDragEnd={(event) => moveMockLocation([event.lngLat.lng, event.lngLat.lat])}
    >
      <div
        className={cx(s.userDot, isMock && s.mock)}
        title={isMock ? "Demo position" : "Your location"}
      />
    </Marker>
  );
}
