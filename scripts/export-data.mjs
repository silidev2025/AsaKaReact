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

/** Each output file, and the SQL query that fills it. */
const TABLES = [
  { table: "buildings", query: "SELECT * FROM buildings ORDER BY id" },
  { table: "colleges", query: "SELECT * FROM colleges ORDER BY id" },
  { table: "divisions", query: "SELECT * FROM divisions ORDER BY id" },
  {
    table: "rooms",
    // Each room also gets class_count: how many classes are held in it.
    // Counting here means the app can show "3 classes" without loading
    // the whole classes file.
    query: `
      SELECT rooms.*,
        (SELECT COUNT(*) FROM classes WHERE classes.room_id = rooms.id)
          AS class_count
      FROM rooms
      ORDER BY rooms.id`,
  },
  { table: "classes", query: "SELECT * FROM classes ORDER BY id" },
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

for (const { table, query } of TABLES) {
  const rows = database.prepare(query).all().map(renameColumns);

  const file = `${OUTPUT_FOLDER}/${table}.json`;
  writeFileSync(file, JSON.stringify(rows, null, 1) + "\n");
  console.log(`${file}: ${rows.length} rows`);
}

database.close();
