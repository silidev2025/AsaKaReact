# How this app is put together

A short guide to finding your way around the code. It grows with each feature.

## How the app starts

1. The browser opens `index.html`. It has an empty `<div id="root">` and loads `src/main.tsx`.
2. `src/main.tsx` puts the `<App />` component into that div.
3. `src/App.tsx` looks at the web address. For `/changelog` it shows the changelog page; otherwise the map (`<CampusMap />`) with the home screen on top (`<Home />`). The install and update prompts appear on both.
4. Each feature lives in its own folder in `src/features/`.

## Where things live

| Folder or file | What goes there | Example |
| --- | --- | --- |
| `.env` | Settings that change per site or computer: app name, map key | `VITE_MAPTILER_KEY=...` |
| `src/data/` | Facts about the campus and the app, as JSON. No code. | building names, contact link, developers |
| `src/data/catalog/` | Rooms, buildings, colleges, divisions and classes, made from the database. Don't edit by hand. | `rooms.json` |
| `data/info.db` | The room database (SQLite). The source of the catalog. | |
| `scripts/` | Tools you run by hand, not part of the app | `export-data.mjs` |
| `src/components/` | UI pieces shared by several features | `Modal.tsx` |
| `CHANGELOG.md` | Release notes shown on the changelog page | |
| `src/config/` | How the app looks and behaves: numbers, speeds, sizes | map zoom, fly-to speed |
| `src/styles/theme.css` | Colors, shadows and rounded corners | `--color-primary` |
| `src/lib/` | Helper functions that aren't React components | coordinate math, loading data |
| `src/hooks/` | Reusable React hooks | `useOnlineStatus()` |
| `src/store/` | State shared by several features | the map, the active building |
| `src/features/<name>/` | One feature: its components, its CSS, its own hooks | `campus-map/` |
| `public/` | Files served as they are: icons, fonts, the map style | `liberty-customized.json` |

The rule: **no hardcoded values inside components.** A number, color, text or address that someone might want to change goes in `.env`, `src/data/`, `src/config/` or `theme.css`, and the component reads it from there.

## How to change common things

| I want to... | Edit |
| --- | --- |
| Add, rename or move a building label | `src/data/buildings.json` |
| Change the campus center or how far the map can pan | `src/data/campus.json` |
| Change the starting zoom, tilt or turn of the map | `startView` in `src/config/map.ts` |
| Make the fly-to faster or slower | `buildingFlyDurationMs` in `src/config/map.ts` |
| Make the slow circling faster or slower | `orbitSecondsPerTurn` in `src/config/map.ts` |
| Show building labels from further out | `buildingLabelsMinZoom` in `src/config/map.ts` |
| Change the maroon or any other color | `src/styles/theme.css` |
| Change the app name or description | `.env` |
| Use a different map key | `.env.local` (your own computer) or `.env` (everyone) |
| Change the offline sketch's roads or lawns | `src/data/offline-sketch.json` |
| Update room or class data | Edit `data/info.db` (for example with DB Browser for SQLite), then run `npm run data:export` |
| Change the "Last updated" date, contact link, tagline or banner photo | `src/data/app-info.json` |
| Add or change a developer on the welcome window | `src/data/developers.json` (photos go in `public/developers/`) |
| Add release notes | `CHANGELOG.md` (start each version with `## version - date`) |
| Change the version number | `version` in `package.json` |
| Make windows open or close faster | `MODAL_ANIMATION` in `src/config/ui.ts` |
| Show the install prompt on your real site | add it to `showOnHosts` in `src/config/ui.ts` |
| Add a new pop-up window | add its name in `src/store/modalStore.ts`, its content in `src/features/home/ModalHost.tsx` |

## React ideas used so far

Each one is explained in a comment where it first appears in the code.

| Idea | What it means | First seen in |
| --- | --- | --- |
| Component | A function that returns what to show (JSX) | `src/App.tsx` |
| Props | Inputs passed to a component, like function arguments | `BuildingLabel.tsx` |
| `useState` | A component's own memory; changing it re-renders | `CampusMap.tsx` |
| `useEffect` | Code that runs after drawing, with optional cleanup | `CampusMap.tsx`, `useCameraOrbit.ts` |
| `useRef` | Memory that does not cause a re-render | `useCameraOrbit.ts` |
| `useCallback` | Keeps the same function between renders | `useCameraOrbit.ts` |
| Custom hook | Your own `use...` function that bundles hooks | `useCameraOrbit.ts`, `src/hooks/` |
| Store (zustand) | State shared across components | `src/store/mapStore.ts` |
| CSS modules | CSS that only applies to the component that imports it | `CampusMap.module.css` |
| Rendering a list | `array.map()` with a `key` on each item | `CampusMap.tsx` |
| Showing something conditionally | `{condition && <Thing />}` | `CampusMap.tsx` |
| Showing nothing | `return null` | `Modal.tsx` |
| `children` | Whatever is placed between a component's tags | `Modal.tsx` |
| Fragment | `<>...</>` groups elements without an extra box | `Home.tsx` |
| Controlled input | A checkbox or text box whose value lives in state | `WelcomeModal.tsx` |
| Updater function | `setValue((current) => ...)` when the new value depends on the old | `useInstallPrompt.ts` |
| Animating out | Keeping something on screen until its closing animation ends | `usePresence.ts` |
| Raw HTML | `dangerouslySetInnerHTML`, only for trusted text | `ChangelogPage.tsx` |

## Features

### CampusMap (`src/features/campus-map/`)

| File | Job |
| --- | --- |
| `CampusMap.tsx` | The map itself: 3D buildings, the campus pin, building labels, offline switch |
| `BuildingLabel.tsx` | One building label (name tag and icon) |
| `OfflineMap.tsx` | The drawn sketch shown offline when the real map can't load |
| `useCameraOrbit.ts` | Flies the camera to a building and slowly circles it |
| `cameraPadding.ts` | Keeps the focused building clear of the side panel or bottom sheet |
| `*.module.css` | Styles for the above |

It also uses `src/lib/offlineMapCache.ts`. That file saves the map files for offline use, working out which files from the map style and the campus bounds.

### Home (`src/features/home/`)

The interface over the map, plus the pop-up windows.

| File | Job |
| --- | --- |
| `Home.tsx` | The see-through layer over the map; opens the welcome window on a first visit |
| `StatusBar.tsx` | Rooms-with-directions progress, last updated date, Contact, Developer, version |
| `WelcomeModal.tsx` | The welcome window: banner, description, developers, Get Started, Don't show again |
| `ModalHost.tsx` | Shows whichever window `src/store/modalStore.ts` says is open |

Shared pieces it uses: `src/components/Modal.tsx` (the window frame), `src/hooks/usePresence.ts` (closing animation), `src/lib/catalog.ts` (room counts), `src/lib/storage.ts` (remembering "Don't show again").

### App prompts (`src/features/pwa/`)

| File | Job |
| --- | --- |
| `UpdatePrompt.tsx` | "App ready to work offline" and "New content available" card; registers the service worker |
| `InstallPrompt.tsx` | The "Install YourRoute" bar |
| `useInstallPrompt.ts` | Decides when and how to offer installing |

### Changelog page (`src/features/changelog/`)

`ChangelogPage.tsx` shows `CHANGELOG.md` at `/changelog`, one card per version.
