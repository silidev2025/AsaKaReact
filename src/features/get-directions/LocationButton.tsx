// The round "My Location" button beside the side panel.
//   First tap: switches the GPS on.
//   Once the position is known: flies the map to the user's blue dot.

import { useState } from "react";
import { Locate, LocateFixed } from "lucide-react";
import { DIRECTIONS_CONFIG } from "../../config/directions";
import { useLocationStore } from "../../store/locationStore";
import { useMapStore } from "../../store/mapStore";
import { showToast } from "../../store/toastStore";
import s from "./GetDirections.module.css";

export default function LocationButton() {
  // Shows the filled-in icon once the map has been centered on the user.
  const [hasCentered, setHasCentered] = useState(false);

  function handleClick() {
    // getState() reads the latest values at the moment of the tap.
    const { coords, heading, requestLocation } = useLocationStore.getState();
    if (!coords) {
      requestLocation();
      return;
    }

    const { map, stopOrbit } = useMapStore.getState();
    setHasCentered(true);
    if (!map) {
      // The real map never loaded (offline): the dot is on the sketch.
      showToast("GPS is active on the offline map.", "success");
      return;
    }

    stopOrbit();
    map.flyTo({
      center: coords,
      zoom: DIRECTIONS_CONFIG.locateZoom,
      offset: DIRECTIONS_CONFIG.locateOffsetPx,
      bearing: heading ?? 0, // face the way the user walks, or north
      duration: DIRECTIONS_CONFIG.locateFlyDurationMs,
    });
  }

  const Icon = hasCentered ? LocateFixed : Locate;
  return (
    <button
      type="button"
      className={s.locationButton}
      onClick={handleClick}
      title="My Location"
      aria-label="My Location"
    >
      <Icon />
    </button>
  );
}
