// MapLibre draws the map in two parts: the page, and a background "worker"
// that turns downloaded tile data into shapes without freezing the page.
//
// MapLibre 6 ships that worker as its own file. The "?worker&url" ending
// tells Vite to bundle the worker and give back its final address, and
// setWorkerUrl tells MapLibre where to find it. main.tsx imports this file
// once, before any map is created. Without it the map stays blank.

import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);
