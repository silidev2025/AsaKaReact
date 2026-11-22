// Settings for the campus map: how it looks and how it moves.
//
// Components read these values instead of having numbers written inside
// them, so to change the map's behavior you only edit this file.
// Facts about the campus itself (names, coordinates) live in src/data/.

import { CACHE_NAMES } from "./cacheNames";

export const MAP_CONFIG = {
  /** Map style file in public/: colors, fonts and layers (based on OSM Liberty). */
  styleUrl: "/liberty-customized.json",

  /** MapTiler key, read from .env (VITE_MAPTILER_KEY). */
  mapTilerKey: import.meta.env.VITE_MAPTILER_KEY ?? "",

  /**
   * Camera when the app opens.
   * zoom: bigger is closer. pitch: tilt in degrees (0 looks straight down).
   * bearing: turn in degrees (0 means north is up).
   */
  startView: { zoom: 17.2, pitch: 55, bearing: -28 },

  /** The furthest the user can zoom out. */
  minZoom: 15,

  /** Building labels appear once the user zooms in this far. */
  buildingLabelsMinZoom: 16.4,

  /** Zoom used when the map flies to a single building. */
  buildingFocusZoom: 18,

  /** How long the fly-to animation takes after tapping a building label. */
  buildingFlyDurationMs: 1200,

  /** Seconds for one full slow turn around a building after flying to it. */
  orbitSecondsPerTurn: 54,

  /** The grey 3D blocks drawn for every building. */
  buildingBlocks: {
    color: "#aaaaaa",
    opacity: 0.6,
    /** Height used when the map data doesn't say how tall a building is. */
    defaultHeightMeters: 12,
  },

  /** Where the building shapes are inside the style's tile data. */
  tileSourceId: "openmaptiles",
  buildingLayerName: "building",

  /** The drawn sketch shown when the real map can't load offline. */
  offlineSketch: {
    /** Extra space drawn around the campus, in degrees. */
    marginLng: 0.00045,
    marginLat: 0.00035,
    /** Pins never get closer to the screen edge than this, in percent. */
    edgePaddingPercent: 4,
  },
};

export const OFFLINE_CACHE_CONFIG = {
  cacheName: CACHE_NAMES.mapAssets,
  /** Saved in localStorage once every map file is cached, to skip redoing it. */
  readyFlagKey: "yourroute:citu-map-cache:v1",
  /** Tile zoom levels to save. Tiles stop at 14; closer zooms enlarge those. */
  tileZooms: [12, 13, 14],
  /** Character ranges of the map fonts to save (0-511 covers English text). */
  glyphRanges: ["0-255", "256-511"],
};
