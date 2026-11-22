# YourRoute (React)

A web app to help CIT-U students find rooms on campus. "Asa sa CIT ang \_\_\_?" Finally answered.

This is the React version of the Astro/Svelte YourRoute app. It is being rebuilt one feature at a time.

New to the code? Start with [docs/GUIDE.md](docs/GUIDE.md). It explains where everything lives and how to change common things.

## Features

- [x] CampusMap: 3D campus map with the CIT-U building labels, fly-to and slow circling on tap, offline caching, and a drawn sketch when offline
- [x] Home: welcome window, status bar, install and update prompts, changelog page
- [x] Search: search box with suggestions for buildings and rooms, trending and recent searches
- [x] SearchResults: side panel for the picked building with its rooms, and the map flying to the result
- [x] RoomDetails: room panel with its building, directions, Contribute links and Open in Google Maps
- [x] Schedule: classes held in a room, and a weekly timetable window

## Room data

Rooms and classes live in `data/info.db` (SQLite). The app reads JSON copies of it in `src/data/catalog/`. After changing the database, run:

```sh
npm run data:export
```

## Running it

Needs [Node.js](https://nodejs.org/) 20 or newer.

```sh
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

To test on a phone on the same Wi-Fi, run `npm run dev:mobile` and open `http://YOUR_IPV4_ADDRESS:5173` on the phone (find the address with `ipconfig`).

Offline mode only works in a production build, because the service worker is not used in dev mode:

```sh
npm run build
npm run preview
```

## Settings

Settings that differ per site live in `.env` (app name, description, theme color, map key). To change one only on your computer, put it in `.env.local`, which git ignores.

### Map key

The map tiles come from MapTiler. MapTiler only accepts a key from the sites listed in that key's settings. If the map shows up grey with "403" errors in the browser console, the key doesn't allow the site you're on. Add the site (and `http://localhost:5173`) to the key in your MapTiler account, or put your own key in `.env.local` as `VITE_MAPTILER_KEY=...`.

## License

[MIT License](LICENSE)
