// Saves the map files that cover the campus into the browser's cache, so the
// map still draws with no internet. The service worker (set up in
// vite.config.ts) serves them from that cache when the network is down.
//
// Nothing here is typed out by hand. Every address is worked out from the
// map style file and the campus bounds, so changing the style or moving the
// campus keeps this correct:
//   1. read the style file to find the tile list, map icons and map fonts
//   2. work out which tiles cover the campus (see tilesCovering in geo.ts)
//   3. download each file once and store it

import type { StyleSpecification } from "maplibre-gl";
import { MAP_CONFIG, OFFLINE_CACHE_CONFIG } from "../config/map";
import { CAMPUS } from "./campus";
import { tilesCovering } from "./geo";
import { withMapTilerKey } from "./mapTiler";
import { readStorage, removeStorage, writeStorage } from "./storage";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return (await response.json()) as T;
}

/** Every font combination the style's text layers use, like "Roboto Medium". */
function getFontStacks(style: StyleSpecification) {
  const stacks = new Set<string>();
  for (const layer of style.layers) {
    if (layer.type !== "symbol") continue;
    const fonts = layer.layout?.["text-font"];
    // Only plain lists of names; fonts picked by an expression are skipped.
    if (Array.isArray(fonts) && fonts.every((font) => typeof font === "string")) {
      stacks.add(fonts.join(","));
    }
  }
  return [...stacks];
}

/** Builds the full list of files the map needs for the campus. */
async function getMapAssetUrls() {
  const style = await fetchJson<StyleSpecification>(MAP_CONFIG.styleUrl);
  const urls: string[] = [];

  // 1. Tiles: the style points to a "TileJSON" file that lists the tile
  //    address pattern, like ".../{z}/{x}/{y}.pbf?key=...".
  const source = style.sources[MAP_CONFIG.tileSourceId];
  if (source?.type === "vector" && source.url) {
    const tileJsonUrl = withMapTilerKey(source.url);
    urls.push(tileJsonUrl);

    const tileJson = await fetchJson<{ tiles: string[] }>(tileJsonUrl);
    const pattern = tileJson.tiles[0];
    if (pattern) {
      for (const zoom of OFFLINE_CACHE_CONFIG.tileZooms) {
        for (const { z, x, y } of tilesCovering(CAMPUS.mapBounds, zoom)) {
          const tileUrl = pattern
            .replace("{z}", String(z))
            .replace("{x}", String(x))
            .replace("{y}", String(y));
          urls.push(withMapTilerKey(tileUrl));
        }
      }
    }
  }

  // 2. Map icons ("sprites"): a picture sheet plus a list of where each icon
  //    sits on it, in normal and double resolution for sharp screens.
  if (typeof style.sprite === "string") {
    for (const suffix of [".json", ".png", "@2x.json", "@2x.png"]) {
      urls.push(`${style.sprite}${suffix}`);
    }
  }

  // 3. Map fonts ("glyphs"): one file per font and character range.
  if (style.glyphs) {
    for (const fontStack of getFontStacks(style)) {
      for (const range of OFFLINE_CACHE_CONFIG.glyphRanges) {
        urls.push(
          style.glyphs
            .replace("{fontstack}", encodeURIComponent(fontStack))
            .replace("{range}", range),
        );
      }
    }
  }

  return urls;
}

function isAlreadyCached() {
  return readStorage(OFFLINE_CACHE_CONFIG.readyFlagKey) === "ready";
}

function setCachedFlag(ready: boolean) {
  if (ready) writeStorage(OFFLINE_CACHE_CONFIG.readyFlagKey, "ready");
  else removeStorage(OFFLINE_CACHE_CONFIG.readyFlagKey);
}

export async function preloadOfflineMapAssets() {
  if (!navigator.onLine || !("caches" in window) || isAlreadyCached()) return;

  try {
    const urls = await getMapAssetUrls();
    const cache = await caches.open(OFFLINE_CACHE_CONFIG.cacheName);

    // Download every file at the same time. allSettled waits for all of
    // them, even if some fail, instead of stopping at the first error.
    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const request = new Request(url, { mode: "cors" });
        if (await cache.match(request)) return; // already saved

        const response = await fetch(request);
        if (!response.ok && response.type !== "opaque") {
          throw new Error(`Could not cache ${url}`);
        }
        await cache.put(request, response);
      }),
    );

    const allSaved = results.every((result) => result.status === "fulfilled");
    setCachedFlag(allSaved);
  } catch {
    setCachedFlag(false);
  }
}
