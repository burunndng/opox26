/**
 * One-time migration CLI: legacy JSON store → SQLite.
 *
 * Usage:
 *   npx tsx scripts/migrate-json-to-sqlite.ts [path/to/oposilab.db.json]
 *
 * Defaults to ./data/oposilab.db.json → ./data/oposilab.db
 * Idempotent: refuses to run if SQLite already contains data.
 * On success, the JSON file is renamed to *.migrated.bak (never deleted).
 */
import fs from 'fs';
import path from 'path';
import { defaultDbPath, legacyJsonPath, openDatabase } from '../server/sqlite/connection.ts';
import { migrateJsonToSqlite } from '../server/sqlite/persist.ts';

function main() {
  const jsonPath = process.argv[2] ? path.resolve(process.argv[2]) : legacyJsonPath();
  const dbPath = defaultDbPath();

  console.log(`[OposiLab] Legacy JSON : ${jsonPath}`);
  console.log(`[OposiLab] SQLite target: ${dbPath}`);

  const conn = openDatabase(dbPath);
  const result = migrateJsonToSqlite(conn, jsonPath);

  if (!result.migrated) {
    console.log(`[OposiLab] Nothing to do: ${result.reason}`);
    process.exit(0);
  }

  console.log('[OposiLab] Migration complete:', result.counts);

  const backupPath = `${jsonPath}.migrated.bak`;
  try {
    fs.renameSync(jsonPath, backupPath);
    console.log(`[OposiLab] Legacy JSON preserved as: ${backupPath}`);
  } catch (err) {
    console.warn(`[OposiLab] WARNING: could not rename legacy JSON (${err}). It was migrated but left in place.`);
  }
}

main();
