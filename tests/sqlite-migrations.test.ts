import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import {
  SCHEMA_SQL,
  openDatabase,
  applyAdditiveMigrations,
  parseSchemaTables,
} from '../server/sqlite/connection.ts';

/**
 * Additive migration tests (audit 2026-10-23, FIX 7).
 * These use explicit temp paths (never OPOSILAB_DATA_DIR), so no isolation
 * helper is needed: importing connection.ts touches no filesystem.
 */

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'oposilab-migrations-'));

function pragmaColumns(db: DatabaseSync, table: string): string[] {
  return (db.prepare('SELECT name FROM pragma_table_info(?);').all(table) as Array<{ name: string }>).map(
    (row) => row.name
  );
}

describe('Additive schema migrations', () => {
  after(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  test('M1: schema parser finds columns and skips table-level constraints', () => {
    const tables = parseSchemaTables(SCHEMA_SQL);

    const items = tables.get('items');
    assert.ok(items, 'items table must be parsed');
    assert.ok(items!.some((c) => c.name === 'figure_status'), 'figure_status must be a parsed column');
    assert.ok(items!.some((c) => c.name === 'cloze_data'));

    const itemTags = tables.get('item_tags');
    assert.deepEqual(
      itemTags!.map((c) => c.name),
      ['item_id', 'tag_id'],
      'PRIMARY KEY (item_id, tag_id) constraint line must be skipped'
    );

    for (const cols of tables.values()) {
      for (const col of cols) {
        assert.notEqual(col.name.toUpperCase(), 'PRIMARY', 'constraint keywords must never be columns');
      }
    }
  });

  test('M2: a fresh database needs no migrations', () => {
    const db = openDatabase(path.join(tmpRoot, 'fresh.db'));
    try {
      assert.deepEqual(applyAdditiveMigrations(db), [], 'fresh DB must be fully migrated');
      assert.ok(pragmaColumns(db, 'items').includes('figure_status'));
    } finally {
      db.close();
    }
  });

  test('M3: legacy table missing columns gets them added, data preserved', () => {
    const dbPath = path.join(tmpRoot, 'legacy.db');
    const legacy = new DatabaseSync(dbPath);
    legacy.exec(`CREATE TABLE topics (id TEXT PRIMARY KEY, name TEXT NOT NULL);`);
    legacy.exec(`INSERT INTO topics (id, name) VALUES ('t1', 'Tema');`);
    legacy.close();

    const db = openDatabase(dbPath);
    try {
      const cols = pragmaColumns(db, 'topics');
      for (const expected of ['description', 'source_file', 'status', 'created_at', 'updated_at']) {
        assert.ok(cols.includes(expected), `topics.${expected} must be added`);
      }
      const row = db.prepare(`SELECT name FROM topics WHERE id = ?;`).get('t1') as { name: string };
      assert.equal(row.name, 'Tema', 'existing data must survive the migration');
      assert.deepEqual(applyAdditiveMigrations(db), [], 'migrations must be idempotent');
    } finally {
      db.close();
    }
  });

  test('M4: NOT NULL without default is downgraded so ALTER succeeds; defaults are kept', () => {
    const dbPath = path.join(tmpRoot, 'legacy-attempts.db');
    const legacy = new DatabaseSync(dbPath);
    legacy.exec(`CREATE TABLE activity_attempts (id TEXT PRIMARY KEY);`);
    legacy.close();

    const db = openDatabase(dbPath);
    try {
      const cols = pragmaColumns(db, 'activity_attempts');
      assert.ok(cols.includes('correct'), 'correct (NOT NULL DEFAULT 0) must be added');
      assert.ok(cols.includes('created_at'), 'created_at (NOT NULL without default) must be added as nullable');

      // created_at was added without NOT NULL → inserting without it must work.
      db.exec(`INSERT INTO activity_attempts (id, item_id) VALUES ('a1', 'i1');`);
      const row = db.prepare(`SELECT correct FROM activity_attempts WHERE id = 'a1';`).get() as {
        correct: number;
      };
      assert.equal(row.correct, 0, 'DEFAULT 0 must apply to the migrated column');
    } finally {
      db.close();
    }
  });
});
