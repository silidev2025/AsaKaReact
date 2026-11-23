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
| Add a CIT-U room (searchable, listed under its building) | `src/data/campus-rooms.json`: its code and the short name of its building |
| Show more or fewer rooms per page in a building's list | `roomsPerPage` in `src/config/search.ts` |
| Make the fly-to after a search faster or slower | `resultFlyDurationMs` in `src/config/map.ts` |
| Make the phone bottom sheet taller or shorter | `phoneSheetHeightPercent` in `src/config/layout.ts` |
| Write directions for a room | add `"directions": "..."` to the room in `src/data/campus-rooms.json` |
| Write directions to a building | add `"directions": "..."` to the building in `src/data/buildings.json` |
| Change the Contribute form link | `contributeUrl` in `src/data/app-info.json` |
| Change the timetable's hours, days or class colors | `src/config/schedule.ts` |
| Change the timetable's header, time column or line colors | `--color-timetable-...` in `src/styles/theme.css` |
| Add a building or room to the Directory | nothing extra: it lists everything in `src/data/buildings.json` and `src/data/campus-rooms.json` |
| Change the trending searches | `trending` in `src/data/search.json` |
| Change the search box hint text | `placeholder` in `src/data/search.json` |
| Show more or fewer suggestions or recent searches | `src/config/search.ts` |
| Change the search box width on computers | `sidePanelWidthRem` in `src/config/layout.ts` |

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
| Ref to an element | `useRef` pointing at a page element, to call `.focus()` on it | `Search.tsx` |
| Listening to the keyboard | `window.addEventListener` in a `useEffect`, removed in the cleanup | `Search.tsx` |
| Reading a store outside rendering | `useQueryStore.getState()` inside an event listener | `Search.tsx` |
| Derived values | Values worked out from state on each render instead of kept in their own state | `Suggestions.tsx` |
| Lookup table | An object that maps a value to what to use for it, instead of if/else | `SuggestionItem.tsx` |
| Component in a variable | `const Icon = ...; <Icon />` (must start with a capital letter) | `SuggestionItem.tsx` |
| Type guard | `value is SearchItem`, checking data that comes from outside the code | `src/lib/search.ts` |
| A table of components | Picking which component to show from an object, by a value | `SidePanel.tsx` |
| `key` to start fresh | A new `key` makes React throw away a component's state and build it again | `SidePanel.tsx` |
| Effect that follows state | `useEffect` that moves the map whenever the picked result changes | `useFlyToResult.ts` |
| Returning early | Showing something simpler (like "Room not found.") before the main JSX | `RoomDetails.tsx` |
| Reusing a small component | One `Directions` component used twice with different text | `Directions.tsx` |
| Loading data in an effect | Start loading in `useEffect`, store the result in state, ignore answers that arrive too late | `useRoomClasses.ts` |
| Loading a file only when needed | `import("...")` written like a function, which Vite turns into a separate download | `src/lib/catalog.ts` |
| Promise, `async` and `await` | A value that arrives later, and waiting for it | `src/lib/catalog.ts` |
| Rules of hooks | Hooks run on every render in the same order, never inside an `if` | `ScheduleWindow.tsx` |
| `disabled` button | A button that is greyed out and ignores clicks | `ClassesSection.tsx` |
| Inline style from data | `style={{ top: ..., height: ... }}` worked out per item | `Timetable.tsx` |
| State that belongs to one component | The filter text lives in `useState` in the window, not in a store | `DirectoryWindow.tsx` |
| Passing a function down | The window hands `onPick` to each card; the card calls it when tapped | `BuildingCard.tsx` |

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

### Search (`src/features/search/`)

The search box at the top of the home screen and its dropdown.

| File | Job |
| --- | --- |
| `Search.tsx` | The box itself: typing, the X button, Escape to empty it |
| `Suggestions.tsx` | Picks what the dropdown shows: recent, trending, matches, or "no match" |
| `SuggestionItem.tsx` | One row: icon, name with the typed letters in bold, arrow |
| `Search.module.css` | Styles, including when the dropdown is visible |

Shared pieces it uses:

| File | Job |
| --- | --- |
| `src/lib/search.ts` | The search logic as plain functions: finding matches, bolding, checking saved data |
| `src/store/queryStore.ts` | What is typed, what was picked, and the recent searches (saved in the browser) |
| `src/data/search.json` | Trending searches and the hint text |
| `src/data/campus-rooms.json` | The CIT-U rooms the search can find, each with its building |
| `src/config/search.ts` | How many suggestions and recent searches |

How a search flows:

1. A key press in the box calls `setInputValue` in the query store.
2. `Suggestions` re-renders and asks `getSuggestions(text)` for matches.
3. Clicking a row calls `selectResult(item)`: the box shows the name, the type becomes `"result"`, and the item goes to the front of the recent searches.
4. The side panel and the map react to the result (see SearchResults below).

Why the dropdown is sometimes visible without focus: when the box is empty it always shows recent or trending searches, as the original app does. While typing it only shows when the box has focus, and it hides once a result is picked.

### SearchResults (`src/features/search-results/`)

What happens after a result is picked: the side panel shows it, and the map flies to it.

| File | Job |
| --- | --- |
| `SidePanel.tsx` | The panel under the search box (a bottom sheet on phones). Picks which result panel to show from the `RESULT_PANELS` table |
| `BuildingResult.tsx` | The panel for a building: its name and the rooms inside it |
| `RoomList.tsx` | A list of rooms, a page at a time, with Previous and Next |
| `RoomRow.tsx` | One room: arrow, room code, number of classes. Tapping it picks that room |
| `useFlyToResult.ts` | Flies the map to the picked building (or a room's building), and back to the start when the search is cleared. Called from `CampusMap.tsx` |
| `*.module.css` | Styles for the above |

Where the data comes from:

- **Which rooms a building has:** `src/data/campus-rooms.json`. Each room names its building.
- **Class counts:** the database. `npm run data:export` counts the classes in each room and saves the count on the room (`classCount` in `src/data/catalog/rooms.json`), so the app doesn't have to load all 4,351 classes just to count them.

To add a panel for another kind of result, write its component and add it to `RESULT_PANELS` in `SidePanel.tsx`.

### RoomDetails (`src/features/room-details/`)

The side panel for a picked room. `SidePanel.tsx` shows it through the `room` entry in its `RESULT_PANELS` table.

| File | Job |
| --- | --- |
| `RoomDetails.tsx` | Room code, its building, the room's directions, "How to get to (building)", Open in Google Maps |
| `Directions.tsx` | A paragraph of directions, or "No directions? Contribute to YourRoute" when there are none |
| `RoomDetails.module.css` | Styles for both |

Where the data comes from:

- **The room and the building it's in:** `src/data/campus-rooms.json`
- **The building's full name, position and directions:** `src/data/buildings.json`
- **The Google Maps link:** made by `googleMapsUrl()` in `src/lib/links.ts` from the building's position (base address in `src/config/links.ts`)

### Schedule (`src/features/schedule/`)

"Classes in this room" at the bottom of the room panel, and the weekly timetable window.

| File | Job |
| --- | --- |
| `ClassesSection.tsx` | The heading, the Open schedule button, and the class list (or "No classes added yet.") |
| `ClassList.tsx` | One card per class: code and type, title, section, meeting times |
| `ScheduleWindow.tsx` | The schedule window's content, for the room picked in the search |
| `Timetable.tsx` | The weekly grid: days across, hours down, one colored block per meeting |
| `useRoomClasses.ts` | Loads a room's classes and gives `null` while they are still loading |
| `*.module.css` | Styles |

Shared pieces it uses:

| File | Job |
| --- | --- |
| `src/lib/schedule.ts` | Reads schedules like `TTh 01:00PM-02:30PM` into days and hours, picks each course's color, makes the timetable blocks |
| `loadClassesForRoom` in `src/lib/catalog.ts` | Downloads the classes file the first time a room with classes is opened, then filters it |
| `src/config/schedule.ts` | Hours, days and class colors of the timetable |

How the timetable places a block: hours are numbers on a 24-hour clock (1:30 PM is 13.5). A block's `top` is how far its start is from the first hour, and its `height` is how long it lasts, both as a percentage of the whole day. For example, 8:00 to 9:30 on a 7:00 to 20:00 grid is `top: 7.7%`, `height: 11.5%`.

Why the classes load separately: the classes file is about 730 KB. Rooms without classes never download it, and the app opens faster without it.

The window is the "schedule" entry in `src/store/modalStore.ts` and `src/features/home/ModalHost.tsx`.

### Directory (`src/features/directory/`)

Not in the original app. A window listing every CIT-U building, A to Z, with its rooms. It opens from "Browse all buildings" at the bottom of the search dropdown (shown when the search box is empty).

| File | Job |
| --- | --- |
| `OpenDirectoryButton.tsx` | The "Browse all buildings" row in the search dropdown |
| `DirectoryWindow.tsx` | The window: title, counts, filter box, and the building cards |
| `BuildingCard.tsx` | One building (tap to pick it) and a button per room (tap to pick the room) |
| `Directory.module.css` | Styles |

`src/lib/directory.ts` sorts the buildings and does the filtering, as plain functions. Picking something calls the same `selectResult` as the search, so the side panel and the map react exactly as they do for a search. The window is the "directory" entry in `src/store/modalStore.ts` and `src/features/home/ModalHost.tsx`.

### App prompts (`src/features/pwa/`)

| File | Job |
| --- | --- |
| `UpdatePrompt.tsx` | "App ready to work offline" and "New content available" card; registers the service worker |
| `InstallPrompt.tsx` | The "Install YourRoute" bar |
| `useInstallPrompt.ts` | Decides when and how to offer installing |

### Changelog page (`src/features/changelog/`)

`ChangelogPage.tsx` shows `CHANGELOG.md` at `/changelog`, one card per version.
