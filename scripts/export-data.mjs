// Turns the room database (data/info.db) into JSON files the app can load.
//
// Run it after the database changes:
//   npm run data:export
//
// Each table becomes one file in src/data/catalog/, with column names changed
// from snake_case (room_code) to camelCase (roomCode), the usual style in
// JavaScript. The app never reads the database directly, only these files.
//
// It uses Node's built-in SQLite (node:sqlite), so no extra package is needed.

import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";

const DATABASE_FILE = "data/info.db";
const OUTPUT_FOLDER = "src/data/catalog";

/** Tables to export, and the order to sort their rows in. */
const TABLES = [
  { table: "buildings", orderBy: "id" },
  { table: "colleges", orderBy: "id" },
  { table: "divisions", orderBy: "id" },
  { table: "rooms", orderBy: "id" },
  { table: "classes", orderBy: "id" },
];

/** "room_code" becomes "roomCode". */
function toCamelCase(name) {
  return name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function renameColumns(row) {
  return Object.fromEntries(
    Object.entries(row).map(([column, value]) => [toCamelCase(column), value]),
  );
}

const database = new DatabaseSync(DATABASE_FILE, { readOnly: true });
mkdirSync(OUTPUT_FOLDER, { recursive: true });

for (const { table, orderBy } of TABLES) {
  const rows = database
    .prepare(`SELECT * FROM ${table} ORDER BY ${orderBy}`)
    .all()
    .map(renameColumns);

  const file = `${OUTPUT_FOLDER}/${table}.json`;
  writeFileSync(file, JSON.stringify(rows, null, 1) + "\n");
  console.log(`${file}: ${rows.length} rows`);
}

database.close();
