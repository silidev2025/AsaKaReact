// A "store" holds state that many components need, so it doesn't have to be
// passed down through every component in between. This app uses zustand.
//
// Reading from a store inside a component:
//   const map = useMapStore((state) => state.map);
// The component re-renders only when the piece it picked (state.map) changes.
//
// Changing it, from anywhere:
//   useMapStore.getState().setMap(newMap);

import type { Map as MapLibreMap } from "maplibre-gl";
import { create } from "zustand";

type MapState = {
  /** The MapLibre map, once it has loaded. Other features use it to move the camera. */
  map: MapLibreMap | null;
  /** Short name of the building label the user tapped last, like "GLE". */
  activeBuildingName: string | null;

  /**
   * Stops the slow circling around a building. The circling keeps turning
   * the camera every frame, so anything else that moves the camera (like
   * the "my location" button) must call this first, or the circling would
   * cancel its move. CampusMap puts the real function here once it loads.
   */
  stopOrbit: () => void;

  setMap: (map: MapLibreMap | null) => void;
  setActiveBuildingName: (name: string | null) => void;
  setStopOrbit: (stopOrbit: () => void) => void;
};

export const useMapStore = create<MapState>()((set) => ({
  map: null,
  activeBuildingName: null,
  stopOrbit: () => {}, // does nothing until CampusMap sets the real one

  setMap: (map) => set({ map }),
  setActiveBuildingName: (name) => set({ activeBuildingName: name }),
  setStopOrbit: (stopOrbit) => set({ stopOrbit }),
}));
