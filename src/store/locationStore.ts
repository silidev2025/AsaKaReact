// Where the user is (from the phone's GPS), and where they want to go.
//
//   coords ........... the user's position, or null until the GPS answers
//   destination ...... where "Get Directions" was pressed for
//   routeOrigin ...... where the user stood when the route was asked for;
//                      the walking route goes from here to destination
//
// The browser's Geolocation API gives the position. It asks the user for
// permission the first time. watchPosition keeps sending new positions as
// the user moves, until clearWatch stops it.
//
// Location only works on campus (CAMPUS.locationBounds in src/data/campus.json).
// For testing elsewhere, see readMockLocation in src/lib/mockLocation.ts.

import { create } from "zustand";
import { DIRECTIONS_CONFIG } from "../config/directions";
import { CAMPUS } from "../lib/campus";
import { isInsideBounds, type LngLat } from "../lib/geo";
import { showToast } from "./toastStore";

/** Every message this file shows, in one place. */
const MESSAGES = {
  unsupported: "Geolocation is not supported by your browser.",
  requesting: "Requesting location access...",
  stillLocating: "Still getting your location...",
  found: "Location found!",
  outsideCampus: `You appear to be outside the ${CAMPUS.name} campus. Location features are limited to the campus area.`,
  denied: "Location access denied. Please enable it in your settings.",
  unavailable: "Location information is unavailable.",
  timedOut: "Location request timed out.",
  unknownError: "An unknown error occurred while getting location.",
  mockActive: "Mock location active (dev mode)",
};

type LocationState = {
  coords: LngLat | null;
  /** Which way the user is moving, in degrees (0 is north), if known. */
  heading: number | null;
  /** True while the GPS is switched on (even before the first answer). */
  isTracking: boolean;
  /** True when the position is pretend (from the web address), not GPS. */
  isMock: boolean;
  destination: LngLat | null;
  routeOrigin: LngLat | null;

  /** Switches the GPS on (asking permission the first time). */
  requestLocation: () => void;
  /** Sets where to go; the route starts from wherever the user is now. */
  setDestination: (destination: LngLat) => void;
  /** Removes the route. */
  clearDestination: () => void;
  /** Uses a pretend position instead of the GPS. */
  startMockLocation: (coords: LngLat) => void;
  /** Moves the pretend position (when its dot is dragged on the map). */
  moveMockLocation: (coords: LngLat) => void;
};

/**
 * The id of the running GPS watch, needed to stop it. It is kept outside
 * the store because no component needs to show it.
 */
let watchId: number | null = null;

export const useLocationStore = create<LocationState>()((set, get) => {
  /** Switches the GPS off and forgets the position. */
  function stopTracking() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    set({ isTracking: false, coords: null, routeOrigin: null });
  }

  /** Called by the browser every time a new position arrives. */
  function handlePosition(position: GeolocationPosition) {
    const here: LngLat = [position.coords.longitude, position.coords.latitude];

    if (!isInsideBounds(here, CAMPUS.locationBounds)) {
      showToast(MESSAGES.outsideCampus, "error");
      stopTracking();
      return;
    }

    const isFirstPosition = get().coords === null;
    set((state) => ({
      coords: here,
      heading: position.coords.heading,
      // A route was asked for before the GPS answered: start it from here.
      routeOrigin: state.destination && !state.routeOrigin ? here : state.routeOrigin,
    }));
    if (isFirstPosition) showToast(MESSAGES.found, "success");
  }

  /** Called by the browser when it can't get a position. */
  function handleError(error: GeolocationPositionError) {
    const messagesByCode: Record<number, string> = {
      [error.PERMISSION_DENIED]: MESSAGES.denied,
      [error.POSITION_UNAVAILABLE]: MESSAGES.unavailable,
      [error.TIMEOUT]: MESSAGES.timedOut,
    };
    showToast(messagesByCode[error.code] ?? MESSAGES.unknownError, "error");
    stopTracking();
  }

  return {
    coords: null,
    heading: null,
    isTracking: false,
    isMock: false,
    destination: null,
    routeOrigin: null,

    requestLocation: () => {
      const { isMock, isTracking, coords } = get();
      if (isMock) return; // the position comes from the address, not GPS

      if (!("geolocation" in navigator)) {
        showToast(MESSAGES.unsupported, "error");
        return;
      }
      if (isTracking) {
        if (!coords) showToast(MESSAGES.stillLocating, "info");
        return;
      }

      set({ isTracking: true });
      showToast(MESSAGES.requesting, "info");
      const { gps } = DIRECTIONS_CONFIG;
      watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: gps.enableHighAccuracy,
        maximumAge: gps.maximumAgeMs,
        timeout: gps.timeoutMs,
      });
    },

    setDestination: (destination) => set({ destination, routeOrigin: get().coords }),

    clearDestination: () => set({ destination: null, routeOrigin: null }),

    startMockLocation: (coords) => {
      set({ isMock: true, isTracking: true, coords, heading: null });
      showToast(MESSAGES.mockActive, "info");
    },

    moveMockLocation: (coords) => {
      if (!get().isMock) return;
      set((state) => ({
        coords,
        routeOrigin: state.destination && !state.routeOrigin ? coords : state.routeOrigin,
      }));
    },
  };
});
