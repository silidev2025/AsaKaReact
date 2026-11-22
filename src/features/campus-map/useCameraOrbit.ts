// After the map flies to a building, the camera slowly circles it (an
// "orbit") until the user touches, clicks or scrolls the map.
//
// Usage inside a component:
//   const { flyToAndOrbit } = useCameraOrbit(map, isMobile);
//   flyToAndOrbit(building.coords, 18, 1200);

import { useCallback, useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { MAP_CONFIG } from "../../config/map";
import type { LngLat } from "../../lib/geo";
import { getCameraPadding } from "./cameraPadding";

export function useCameraOrbit(map: MapLibreMap | null, isMobile: boolean) {
  // useRef keeps a value between renders, like a variable that remembers.
  // Unlike useState, changing it does NOT re-render the component. The
  // animation updates 60 times a second, so refs are the right fit.
  const frameId = useRef<number | null>(null);
  const isMobileRef = useRef(isMobile);

  // useEffect runs code after React has drawn the component. The list at the
  // end ([isMobile]) says "run again whenever isMobile changes".
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // useCallback keeps the same function between renders. That matters here
  // because MapLibre's map.off() only removes a listener if it gets the
  // exact same function that was passed to map.on().
  const stopOrbit = useCallback(() => {
    if (frameId.current !== null) {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
  }, []);

  const startOrbit = useCallback(() => {
    if (!map) return;
    stopOrbit();

    const degreesPerMs = 360 / (MAP_CONFIG.orbitSecondsPerTurn * 1000);
    let bearing = map.getBearing();
    let lastTime: number | null = null;

    // requestAnimationFrame calls step() right before the browser draws the
    // next frame. step() turns the camera a little, then asks for the next
    // frame, which makes a smooth loop until stopOrbit() cancels it.
    const step = (time: number) => {
      if (lastTime !== null) {
        bearing = (bearing + (time - lastTime) * degreesPerMs) % 360;
        map.rotateTo(bearing, {
          duration: 0,
          padding: getCameraPadding(isMobileRef.current),
        });
      }
      lastTime = time;
      frameId.current = requestAnimationFrame(step);
    };
    frameId.current = requestAnimationFrame(step);
  }, [map, stopOrbit]);

  /** Flies the camera to a spot, then starts orbiting once it arrives. */
  const flyToAndOrbit = useCallback(
    (center: LngLat, zoom: number, durationMs: number) => {
      if (!map) return;
      stopOrbit();
      map.off("moveend", startOrbit); // forget an orbit from an earlier flight
      map.flyTo({
        center,
        zoom,
        pitch: MAP_CONFIG.startView.pitch,
        bearing: MAP_CONFIG.startView.bearing,
        padding: getCameraPadding(isMobileRef.current),
        duration: durationMs,
      });
      map.once("moveend", startOrbit); // "once": run one time, then forget
    },
    [map, startOrbit, stopOrbit],
  );

  // Stop orbiting as soon as the user takes over the map. The function
  // returned at the end is the "cleanup": React runs it when the component
  // goes away, so no listeners are left behind.
  useEffect(() => {
    if (!map) return;
    map.on("mousedown", stopOrbit);
    map.on("touchstart", stopOrbit);
    map.on("wheel", stopOrbit);
    return () => {
      map.off("mousedown", stopOrbit);
      map.off("touchstart", stopOrbit);
      map.off("wheel", stopOrbit);
      map.off("moveend", startOrbit);
      stopOrbit();
    };
  }, [map, startOrbit, stopOrbit]);

  return { flyToAndOrbit, stopOrbit };
}
