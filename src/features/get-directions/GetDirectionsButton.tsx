// The "Get Directions" button on the building and room panels. It switches
// the GPS on and sets the destination; once the user's position is known,
// the walking route appears on the map (RouteLine.tsx).
//
// Each panel gives it its own look through "className", because the two
// panels style it slightly differently, as in the original app.

import { CornerRightUp } from "lucide-react";
import type { LngLat } from "../../lib/geo";
import { useLocationStore } from "../../store/locationStore";

type GetDirectionsButtonProps = {
  /** Where to walk to: the building's position. */
  destination: LngLat;
  /** The look, from the panel's own CSS file. */
  className?: string;
};

export default function GetDirectionsButton({ destination, className }: GetDirectionsButtonProps) {
  function handleClick() {
    const { requestLocation, setDestination } = useLocationStore.getState();
    requestLocation();
    setDestination(destination);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      Get Directions
      <CornerRightUp size={18} aria-hidden />
    </button>
  );
}
