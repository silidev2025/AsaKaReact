// One building label on the map: a maroon name tag above a round icon.
//
// "Props" are the inputs a component receives, like arguments to a function.
// CampusMap renders one <BuildingLabel /> per building and passes in which
// building it is, whether it's the active one, and what to do on a tap.

import type { MouseEvent } from "react";
import { Marker } from "react-map-gl/maplibre";
import { Building2 } from "lucide-react";
import type { CampusBuilding } from "../../lib/campus";
import { cx } from "../../lib/cx";
import s from "./CampusMap.module.css";

type BuildingLabelProps = {
  building: CampusBuilding;
  isActive: boolean;
  onSelect: (building: CampusBuilding, event: MouseEvent) => void;
};

export default function BuildingLabel({
  building,
  isActive,
  onSelect,
}: BuildingLabelProps) {
  const [lng, lat] = building.coords;

  return (
    // <Marker> places normal HTML on the map at a coordinate and keeps it
    // there while the map moves.
    <Marker longitude={lng} latitude={lat}>
      <div className={s.labelAnchor}>
        <button
          type="button"
          className={cx(s.buildingPin, isActive && s.active)}
          title={building.fullName ?? building.name}
          onClick={(event) => onSelect(building, event)}
        >
          <div className={s.buildingName}>
            <strong>{building.name}</strong>
          </div>
          <span className={s.buildingIcon}>
            <Building2 size={18} />
          </span>
        </button>
      </div>
    </Marker>
  );
}
