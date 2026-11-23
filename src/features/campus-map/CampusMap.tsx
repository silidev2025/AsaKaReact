// The campus map: a tilted 3D map of CIT-U with a label on every building.
// Tapping a label flies the camera to that building and slowly circles it.
// With no internet and no saved map, it shows a drawn sketch instead.
//
// A React "component" is a function that returns what to show on screen,
// written in JSX (the HTML-like syntax). React calls it again whenever its
// state or props change, and updates the page to match.
//
// Styling: classes come from CampusMap.module.css. A ".module.css" file is
// private to the components that import it, so a class named "pin" here
// can't clash with a "pin" somewhere else. Use it as s.className.
//
// What you can change without touching this file:
//   zoom, tilt, speeds, label zoom ......... src/config/map.ts
//   building names and positions ........... src/data/buildings.json
//   campus name, center, bounds ............ src/data/campus.json
//   colors .................................. src/styles/theme.css

import { useEffect, useState, type MouseEvent } from "react";
import Map, { Layer, Marker, type LayerProps } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { University } from "lucide-react";
import { MOBILE_MEDIA_QUERY } from "../../config/layout";
import { MAP_CONFIG } from "../../config/map";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { BUILDINGS, CAMPUS, type CampusBuilding } from "../../lib/campus";
import { cx } from "../../lib/cx";
import { boundsToArray } from "../../lib/geo";
import { withMapTilerKey } from "../../lib/mapTiler";
import { preloadOfflineMapAssets } from "../../lib/offlineMapCache";
import { useMapStore } from "../../store/mapStore";
import RouteLine from "../get-directions/RouteLine";
import UserLocationMarker from "../get-directions/UserLocationMarker";
import { useFitToRoute } from "../get-directions/useFitToRoute";
import { useWalkingRoute } from "../get-directions/useWalkingRoute";
import { useFlyToResult } from "../search-results/useFlyToResult";
import BuildingLabel from "./BuildingLabel";
import OfflineMap from "./OfflineMap";
import { useCameraOrbit } from "./useCameraOrbit";
import s from "./CampusMap.module.css";

// Grey 3D blocks for every building in the map data. Each building's height
// comes from the data; buildings without one get the default height.
const { buildingBlocks } = MAP_CONFIG;
const BUILDING_BLOCKS_LAYER: LayerProps = {
  id: "campus-building-blocks",
  type: "fill-extrusion",
  source: MAP_CONFIG.tileSourceId,
  "source-layer": MAP_CONFIG.buildingLayerName,
  paint: {
    "fill-extrusion-color": buildingBlocks.color,
    "fill-extrusion-opacity": buildingBlocks.opacity,
    // "coalesce" picks the first value that exists.
    "fill-extrusion-height": [
      "coalesce",
      ["to-number", ["get", "render_height"]],
      ["to-number", ["get", "height"]],
      buildingBlocks.defaultHeightMeters,
    ],
    "fill-extrusion-base": [
      "coalesce",
      ["to-number", ["get", "render_min_height"]],
      ["to-number", ["get", "min_height"]],
      0,
    ],
  },
};

export default function CampusMap() {
  // Shared state from the store (see src/store/mapStore.ts).
  const map = useMapStore((state) => state.map);
  const setMap = useMapStore((state) => state.setMap);
  const activeBuildingName = useMapStore((state) => state.activeBuildingName);
  const setActiveBuildingName = useMapStore(
    (state) => state.setActiveBuildingName,
  );

  // Values that follow the browser.
  const isOnline = useOnlineStatus();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  // useState gives this component its own memory. It returns the current
  // value and a function to change it. Changing it re-renders the component.
  const [mapHasLoaded, setMapHasLoaded] = useState(false);
  const [mapHasErrored, setMapHasErrored] = useState(false);
  const [showBuildingLabels, setShowBuildingLabels] = useState(
    MAP_CONFIG.startView.zoom >= MAP_CONFIG.buildingLabelsMinZoom,
  );

  const { flyToAndOrbit, flyToStartView, stopOrbit } = useCameraOrbit(
    map,
    isMobile,
  );

  // Fly to whatever the user picks in the search (see that file).
  useFlyToResult({ flyToAndOrbit, flyToStartView, stopOrbit });

  // Let other features (like the "my location" button) stop the circling.
  const setStopOrbit = useMapStore((state) => state.setStopOrbit);
  useEffect(() => {
    setStopOrbit(stopOrbit);
  }, [setStopOrbit, stopOrbit]);

  // The walking route after "Get Directions", and zooming to show all of it.
  const route = useWalkingRoute();
  useFitToRoute(map, route, isMobile, stopOrbit);

  // Each time the app is online: save the campus map for offline use, and
  // clear an old error so the real map gets another try.
  useEffect(() => {
    if (!isOnline) return;
    setMapHasErrored(false);
    void preloadOfflineMapAssets(); // "void": start it, don't wait for it
  }, [isOnline]);

  // When this component goes away, remove the map from the store too.
  useEffect(() => {
    return () => setMap(null);
  }, [setMap]);

  function handleBuildingSelect(building: CampusBuilding, event: MouseEvent) {
    event.stopPropagation(); // the tap is for the label, not the map below it
    setActiveBuildingName(building.name);
    if (!map) return;
    flyToAndOrbit(
      building.coords,
      Math.max(map.getZoom(), MAP_CONFIG.buildingFocusZoom),
      MAP_CONFIG.buildingFlyDurationMs,
    );
  }

  // The sketch only appears when offline AND the real map couldn't draw.
  const showOfflineMap = !isOnline && (mapHasErrored || !mapHasLoaded);
  const [centerLng, centerLat] = CAMPUS.center;

  return (
    <div className={s.mapContainer}>
      <Map
        mapStyle={MAP_CONFIG.styleUrl}
        transformRequest={(url) => ({ url: withMapTilerKey(url) })}
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          ...MAP_CONFIG.startView,
        }}
        maxBounds={boundsToArray(CAMPUS.mapBounds)}
        minZoom={MAP_CONFIG.minZoom}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
        onLoad={(event) => {
          setMap(event.target);
          setMapHasLoaded(true);
          setMapHasErrored(false);
        }}
        onError={() => setMapHasErrored(true)}
        onZoom={(event) =>
          setShowBuildingLabels(
            event.viewState.zoom >= MAP_CONFIG.buildingLabelsMinZoom,
          )
        }
      >
        <Layer {...BUILDING_BLOCKS_LAYER} />

        {/* The walking route, drawn above the buildings. */}
        {route && <RouteLine route={route} />}

        {/* The campus pin in the middle of the map. */}
        <Marker longitude={centerLng} latitude={centerLat}>
          <div className={cx(s.pin, s.active)} title={CAMPUS.name}>
            <University size={20} />
            <div className={s.pinLabel}>{CAMPUS.shortName}</div>
          </div>
        </Marker>

        {/* One label per building. "&&" means: only show them when zoomed
            in far enough. map() turns each building into a <BuildingLabel>,
            and "key" helps React tell the labels apart. */}
        {showBuildingLabels &&
          BUILDINGS.map((building) => (
            <BuildingLabel
              key={building.name}
              building={building}
              isActive={activeBuildingName === building.name}
              onSelect={handleBuildingSelect}
            />
          ))}

        {/* The user's position, on top of everything else. */}
        <UserLocationMarker />
      </Map>

      {showOfflineMap && (
        <OfflineMap
          activeBuildingName={activeBuildingName}
          onBuildingSelect={handleBuildingSelect}
          route={route}
        />
      )}
    </div>
  );
}
