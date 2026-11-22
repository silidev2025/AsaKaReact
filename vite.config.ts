// Settings for Vite, the tool that runs the app in development and builds
// it for release. This file runs in Node, not in the browser.

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { CACHE_NAMES } from "./src/config/cacheNames.ts";

/** Sites allowed to reach the dev server, for testing through a tunnel. */
const TUNNEL_HOSTS = [".trycloudflare.com", ".loca.lt"];

/** Hosts the map loads tiles, icons and fonts from (see the map style). */
const MAP_ASSET_HOSTS =
  /^https:\/\/(api\.maptiler\.com|klokantech\.github\.io|maputnik\.github\.io|orangemug\.github\.io)\//;

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export default defineConfig(({ mode }) => {
  // Read .env so the install prompt uses the same name as the page.
  const env = loadEnv(mode, ".");

  return {
    plugins: [
      react(),

      // Makes the app installable and work offline. It creates a "service
      // worker", a small script the browser keeps running in the background
      // that answers requests from saved copies when there's no internet.
      VitePWA({
        registerType: "autoUpdate",
        // The app registers the service worker itself, in
        // src/features/pwa/UpdatePrompt.tsx, so it can show the
        // "ready to work offline" and "new content" messages.
        injectRegister: false,
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        workbox: {
          // Files saved when the app is first opened.
          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,webmanifest,json,jpg,ttf,wasm}",
          ],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          navigateFallback: "index.html",
          clientsClaim: true,
          skipWaiting: true,
          // Files saved the first time they are used. "CacheFirst" means use
          // the saved copy if there is one, otherwise download and save it.
          runtimeCaching: [
            {
              urlPattern: /\/assets\/.*\.(?:js|css)$/,
              handler: "CacheFirst",
              options: {
                cacheName: CACHE_NAMES.appShell,
                expiration: { maxEntries: 80, maxAgeSeconds: ONE_YEAR_SECONDS },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern:
                /\/(?:manifest\.webmanifest|favicon\.ico|favicon\.svg|apple-touch-icon\.png|pwa-\d+x\d+\.png|InterVariable(?:-Italic)?\.ttf)$/,
              handler: "CacheFirst",
              options: {
                cacheName: CACHE_NAMES.appStatic,
                expiration: { maxEntries: 40, maxAgeSeconds: ONE_YEAR_SECONDS },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: MAP_ASSET_HOSTS,
              handler: "CacheFirst",
              options: {
                cacheName: CACHE_NAMES.mapAssets,
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: THIRTY_DAYS_SECONDS,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        // What phones show when the app is installed to the home screen.
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          description: env.VITE_APP_DESCRIPTION,
          theme_color: env.VITE_THEME_COLOR,
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          ],
          display_override: ["standalone"],
        },
      }),
    ],

    css: {
      modules: {
        // Lets .module.css files use dashes (.pin-label) while code uses
        // camelCase (s.pinLabel).
        localsConvention: "camelCaseOnly",
      },
    },

    // MapLibre's worker is an ES module (see src/lib/maplibreWorker.ts).
    worker: { format: "es" },

    build: {
      // MapLibre alone is over 1 MB. That is normal for a map app.
      chunkSizeWarningLimit: 1500,
    },

    server: { host: true, allowedHosts: TUNNEL_HOSTS },
    preview: { host: true, allowedHosts: TUNNEL_HOSTS },
  };
});
