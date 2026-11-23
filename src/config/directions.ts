// Settings for finding the user's location and drawing a walking route.

export const DIRECTIONS_CONFIG = {
  /**
   * The walking-route service (OSRM, run by openstreetmap.de, free to use).
   * The app asks it for the path between two points.
   */
  routingUrl: "https://routing.openstreetmap.de/routed-foot/route/v1",
  routingProfile: "foot",

  /** How the phone's GPS is asked for the position. */
  gps: {
    /** Use real GPS instead of a rough guess from Wi-Fi, when available. */
    enableHighAccuracy: true,
    /** A position up to this old (in milliseconds) is good enough. */
    maximumAgeMs: 10000,
    /** Give up waiting for a position after this long. */
    timeoutMs: 10000,
  },

  /** The "my location" button: how close the map flies, and how fast. */
  locateZoom: 17,
  locateFlyDurationMs: 1500,
  /** Moves the dot this many pixels up from the exact center when flying to it. */
  locateOffsetPx: [0, -24] as [number, number],

  /** Space in pixels kept around a route when the map zooms to show all of it. */
  routeFitPaddingPx: 60,
  routeFitDurationMs: 1200,

  /**
   * For testing away from campus: adding ?mockLocation=lng,lat to the
   * address pretends the user stands there. The dot turns orange and can be
   * dragged. Example: ?mockLocation=123.881021,10.29485
   */
  mockLocationParams: ["mockLocation", "mock"],
};
