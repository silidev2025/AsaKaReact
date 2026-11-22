// Moves the map to follow the search:
//
//   a building is picked ....... fly to it and slowly circle it
//   a room is picked ........... the same, for the room's building
//   the search is cleared ...... fly back to the campus start view
//   the user starts typing ..... stop circling
//
// CampusMap calls this hook and hands it the camera functions from
// useCameraOrbit, because the camera belongs to the map.

import { useEffect } from "react";
import { MAP_CONFIG } from "../../config/map";
import type { LngLat } from "../../lib/geo";
import { findResultBuilding } from "../../lib/search";
import { useMapStore } from "../../store/mapStore";
import { useQueryStore } from "../../store/queryStore";

type CameraControls = {
  flyToAndOrbit: (center: LngLat, zoom: number, durationMs: number) => void;
  flyToStartView: (durationMs: number) => void;
  stopOrbit: () => void;
};

export function useFlyToResult({
  flyToAndOrbit,
  flyToStartView,
  stopOrbit,
}: CameraControls) {
  const category = useQueryStore((state) => state.category);
  const type = useQueryStore((state) => state.type);
  const value = useQueryStore((state) => state.value);
  const setActiveBuildingName = useMapStore(
    (state) => state.setActiveBuildingName,
  );

  // This effect runs again whenever one of the values in the list at the
  // end changes. Typing only changes the text in the box, which isn't in
  // the list, so the map doesn't jump around on every key press.
  useEffect(() => {
    // Nothing picked: back to where the app started.
    if (category === null) {
      setActiveBuildingName(null);
      flyToStartView(MAP_CONFIG.resultFlyDurationMs);
      return;
    }

    // The user is typing a new search: stop circling, stay put.
    if (type !== "result") {
      stopOrbit();
      return;
    }

    const building = findResultBuilding({ category, value });
    if (!building) return; // nothing on the map to show for this result

    setActiveBuildingName(building.name);
    flyToAndOrbit(
      building.coords,
      MAP_CONFIG.buildingFocusZoom,
      MAP_CONFIG.resultFlyDurationMs,
    );
  }, [
    category,
    type,
    value,
    flyToAndOrbit,
    flyToStartView,
    stopOrbit,
    setActiveBuildingName,
  ]);
}
