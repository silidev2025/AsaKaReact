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

  setMap: (map: MapLibreMap | null) => void;
  setActiveBuildingName: (name: string | null) => void;
};

export const useMapStore = create<MapState>()((set) => ({
  map: null,
  activeBuildingName: null,

  setMap: (map) => set({ map }),
  setActiveBuildingName: (name) => set({ activeBuildingName: name }),
}));
