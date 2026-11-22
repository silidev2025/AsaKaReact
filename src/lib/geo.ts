// Small helpers for map coordinates. No React here, just math.

/**
 * A point as [longitude, latitude]. MapLibre always wants longitude first,
 * which is the opposite of how people usually say "lat, long".
 */
export type LngLat = [number, number];

/** A point the way the JSON data files write it. */
export type Coordinates = { lng: number; lat: number };

/** A rectangle on the map, given by its four edges. */
export type Bounds = { west: number; south: number; east: number; north: number };

export function toLngLat(point: Coordinates): LngLat {
  return [point.lng, point.lat];
}

export function isInsideBounds([lng, lat]: LngLat, bounds: Bounds) {
  return (
    lng >= bounds.west &&
    lng <= bounds.east &&
    lat >= bounds.south &&
    lat <= bounds.north
  );
}

/** Bounds in the [west, south, east, north] array form MapLibre accepts. */
export function boundsToArray(bounds: Bounds): [number, number, number, number] {
  return [bounds.west, bounds.south, bounds.east, bounds.north];
}

/**
 * Map tiles are square images numbered by column (x) and row (y). At zoom z
 * the whole world is 2^z tiles wide and 2^z tiles tall. These two functions
 * find which column and row a coordinate falls in (the standard "slippy map"
 * formula used by OpenStreetMap).
 */
export function lngToTileX(lng: number, zoom: number) {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom);
}

export function latToTileY(lat: number, zoom: number) {
  const latRadians = (lat * Math.PI) / 180;
  const mercatorY =
    Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI;
  return Math.floor(((1 - mercatorY) / 2) * 2 ** zoom);
}

/** Every tile at the given zoom that covers part of the bounds. */
export function tilesCovering(bounds: Bounds, zoom: number) {
  const tiles: { z: number; x: number; y: number }[] = [];
  // Rows count downward from the north, so north gives the smaller y.
  for (let x = lngToTileX(bounds.west, zoom); x <= lngToTileX(bounds.east, zoom); x++) {
    for (let y = latToTileY(bounds.north, zoom); y <= latToTileY(bounds.south, zoom); y++) {
      tiles.push({ z: zoom, x, y });
    }
  }
  return tiles;
}
