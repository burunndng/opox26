import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

/**
 * SQLite persistence layer (node:sqlite — built into Node >= 22.5, zero native deps).
 *
 * ADR-2 note: the plan originally called for better-sqlite3. We use `node:sqlite`
 * instead because:
 *  1. The project has a pre-existing npm peer-dependency conflict (vite 8 vs esbuild 0.25),
 *     making native-module installs fragile.
 *  2. Zero native compilation keeps the "one command, no toolchain" promise for
 *     non-programmer users (spec §3.15).
 *  3. The synchronous API matches better-sqlite3 almost 1:1.
 *
 * FK enforcement is intentionally left OFF (SQLite default): the JSON store this
 * replaces never cascaded deletes, and enabling cascades would silently change
 * app behavior (e.g. deleting a topic would vanish its items). The REFERENCES
 * clauses below are documentation only.
 */

const SCHEMA_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '',
  source_file TEXT, status TEXT DEFAULT 'draft',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS source_chunks (
  id TEXT PRIMARY KEY, topic_id TEXT, page_number INTEGER, article_reference TEXT,
  raw_text TEXT NOT NULL, summary TEXT, order_index INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS atoms (
  id TEXT PRIMARY KEY, topic_id TEXT, source_chunk_id TEXT,
  text TEXT NOT NULL, atom_type TEXT, legal_basis TEXT, cluster_id TEXT,
  confusion_pair_id TEXT, tags TEXT, difficulty INTEGER, figure_status TEXT,
  status TEXT DEFAULT 'draft', created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS clusters (
  id TEXT PRIMARY KEY, topic_id TEXT, name TEXT NOT NULL,
  description TEXT DEFAULT '', type TEXT, priority TEXT DEFAULT 'medium'
);
CREATE TABLE IF NOT EXISTS confusion_pairs (
  id TEXT PRIMARY KEY, topic_id TEXT, concept_a TEXT NOT NULL, concept_b TEXT NOT NULL,
  discriminating_cue TEXT NOT NULL, common_trap TEXT NOT NULL,
  legal_basis_a TEXT, legal_basis_b TEXT, example_case TEXT,
  status TEXT DEFAULT 'draft', severity TEXT DEFAULT 'medium'
);
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL, cluster_id TEXT, confusion_pair_id TEXT,
  item_type TEXT NOT NULL, stem TEXT NOT NULL, prompt_before_options TEXT,
  options TEXT, correct_answer TEXT, legal_basis TEXT, rule_statement TEXT,
  why_correct TEXT, distractor_analysis TEXT, trap_types TEXT, corrective_rule TEXT,
  condition_if_distractor_correct TEXT, difficulty INTEGER, cognitive_operations TEXT,
  status TEXT DEFAULT 'draft', source TEXT DEFAULT 'manual',
  cloze_data TEXT, contrast_data TEXT, number_sort_data TEXT, spot_error_data TEXT,
  two_tier_data TEXT, exception_tree_data TEXT, fact_variant_data TEXT, fsrs_info TEXT,
  figure_status TEXT, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS activity_attempts (
  id TEXT PRIMARY KEY, item_id TEXT NOT NULL, session_id TEXT, activity_type TEXT,
  user_response TEXT, generated_answer_before_options TEXT, selected_option TEXT,
  reasoning_response TEXT, confidence INTEGER, correct INTEGER NOT NULL DEFAULT 0,
  used_hint INTEGER DEFAULT 0, hints_revealed TEXT, error_type_code TEXT,
  trap_selected_by_user TEXT, time_to_generate_ms INTEGER, time_to_answer_ms INTEGER,
  was_interleaved INTEGER DEFAULT 0, was_timed INTEGER DEFAULT 0,
  format_version INTEGER, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS review_schedules (
  id TEXT PRIMARY KEY, item_id UNIQUE NOT NULL, state TEXT DEFAULT 'new',
  due_date TEXT NOT NULL, interval_days INTEGER DEFAULT 0, ease_factor REAL DEFAULT 2.5,
  stability REAL DEFAULT 1.0, difficulty REAL DEFAULT 5.0, lapses INTEGER DEFAULT 0,
  consecutive_correct_sessions INTEGER DEFAULT 0, formats_completed TEXT,
  last_confidence INTEGER, last_error_type TEXT, priority_score REAL DEFAULT 10,
  graduated_at TEXT, suspended_reason TEXT
);
CREATE TABLE IF NOT EXISTS error_logs (
  id TEXT PRIMARY KEY, attempt_id TEXT, item_id TEXT NOT NULL, topic_id TEXT,
  cluster_id TEXT, confusion_pair_id TEXT, error_type_code TEXT, confidence INTEGER,
  user_explanation TEXT, corrective_rule TEXT, legal_basis TEXT, trap_type TEXT,
  status TEXT DEFAULT 'open', next_review_date TEXT, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, name TEXT, type TEXT, started_at TEXT, ended_at TEXT,
  item_count INTEGER DEFAULT 0, accuracy REAL, avg_confidence REAL,
  calibration_delta REAL, notes TEXT
);
CREATE TABLE IF NOT EXISTS saved_session_state (
  id TEXT PRIMARY KEY, payload TEXT NOT NULL, saved_at TEXT
);
CREATE TABLE IF NOT EXISTS tags (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, type TEXT);
CREATE TABLE IF NOT EXISTS item_tags (
  item_id TEXT, tag_id TEXT, PRIMARY KEY (item_id, tag_id)
);
CREATE TABLE IF NOT EXISTS atom_tags (
  atom_id TEXT, tag_id TEXT, PRIMARY KEY (atom_id, tag_id)
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`;

/**
 * Indexes are created *after* additive migrations so a legacy table missing a
 * column does not fail index creation before that column is added.
 */
const SCHEMA_INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_items_topic   ON items(topic_id, item_type, status);
CREATE INDEX IF NOT EXISTS idx_items_pair    ON items(confusion_pair_id);
CREATE INDEX IF NOT EXISTS idx_items_cluster ON items(cluster_id);
CREATE INDEX IF NOT EXISTS idx_attempts_item ON activity_attempts(item_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sched_due ON review_schedules(due_date, state);
CREATE INDEX IF NOT EXISTS idx_errors_status ON error_logs(status, error_type_code);
`;

/** Full schema: tables + indexes concatenated (kept for tooling/tests). */
export const SCHEMA_SQL = SCHEMA_TABLES_SQL + SCHEMA_INDEXES_SQL;

/**
 * Additive schema migrations (audit 2026-10-23).
 *
 * `CREATE TABLE IF NOT EXISTS` never adds columns to a table that already
 * exists, so a column added to SCHEMA_SQL would silently be missing on legacy
 * databases (drift). To prevent that, SCHEMA_SQL is parsed into per-table
 * column lists and any missing column is added with `ALTER TABLE ... ADD COLUMN`.
 *
 * SQLite refuses PRIMARY KEY / UNIQUE columns and NOT NULL without a default in
 * ALTER TABLE, so those constraints are dropped on migrated databases (fresh
 * databases keep the stricter SCHEMA_SQL definition). This only ever *adds*
 * columns; destructive changes stay a manual, reviewed migration.
 */

export interface SchemaColumn {
  name: string;
  /** Full definition as written in SCHEMA_SQL (e.g. `status TEXT DEFAULT 'draft'`). */
  definition: string;
}

export interface AppliedMigration {
  table: string;
  column: string;
  ddl: string;
}

/** Splits a CREATE TABLE body into segments at top-level commas (paren/quote aware). */
function splitTopLevel(body: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inQuote = false;
  let current = '';
  for (const ch of body) {
    if (inQuote) {
      current += ch;
      if (ch === "'") inQuote = false;
      continue;
    }
    if (ch === "'") {
      inQuote = true;
      current += ch;
      continue;
    }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

/** Parses SCHEMA_SQL into a table → column list map. Table-level constraints are skipped. */
export function parseSchemaTables(sql: string): Map<string, SchemaColumn[]> {
  const tables = new Map<string, SchemaColumn[]>();
  const tableRe = /CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\(([\s\S]*?)\)\s*;/g;
  let match: RegExpExecArray | null;
  while ((match = tableRe.exec(sql)) !== null) {
    const [, table, body] = match;
    const columns: SchemaColumn[] = [];
    for (const segment of splitTopLevel(body)) {
      const trimmed = segment.trim();
      if (!trimmed) continue;
      if (/^(PRIMARY\s+KEY|UNIQUE|FOREIGN\s+KEY|CHECK|CONSTRAINT)\b/i.test(trimmed)) continue;
      const nameMatch = trimmed.match(/^(\w+)([\s\S]*)$/);
      if (!nameMatch) continue;
      columns.push({ name: nameMatch[1], definition: trimmed });
    }
    tables.set(table, columns);
  }
  return tables;
}

/** Converts a SCHEMA_SQL column definition into a safe ADD COLUMN definition. */
function toAdditiveDdl(column: SchemaColumn): string {
  const rest = column.definition.slice(column.name.length).trim();
  let ddl = rest
    .replace(/\bPRIMARY\s+KEY\b/gi, '')
    .replace(/\bUNIQUE\b/gi, '');
  const hasDefault = /\bDEFAULT\b/i.test(ddl);
  if (!hasDefault) ddl = ddl.replace(/\bNOT\s+NULL\b/gi, '');
  ddl = ddl.replace(/\s+/g, ' ').trim();
  return `${column.name}${ddl ? ` ${ddl}` : ' TEXT'}`;
}

/** Adds every column present in SCHEMA_SQL but missing from the live database. */
export function applyAdditiveMigrations(conn: DatabaseSync): AppliedMigration[] {
  const applied: AppliedMigration[] = [];
  for (const [table, columns] of parseSchemaTables(SCHEMA_SQL)) {
    const tableExists = conn
      .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?;`)
      .get(table);
    if (!tableExists) continue;

    const existing = new Set(
      (conn.prepare(`SELECT name FROM pragma_table_info(?);`).all(table) as Array<{ name: string }>).map(
        (row) => row.name
      )
    );

    for (const column of columns) {
      if (existing.has(column.name)) continue;
      const ddl = toAdditiveDdl(column);
      try {
        conn.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl};`);
      } catch (err: any) {
        throw new Error(
          `Additive migration failed for ${table}.${column.name} ("${ddl}"): ${err?.message ?? err}`
        );
      }
      applied.push({ table, column: column.name, ddl });
    }
  }
  return applied;
}

/** Resolves the app DB path. Override the folder with OPOSILAB_DATA_DIR (used by tests). */
export function defaultDbPath(): string {
  const dir = process.env.OPOSILAB_DATA_DIR || path.join(process.cwd(), 'data');
  return path.join(dir, 'oposilab.db');
}

export function legacyJsonPath(): string {
  const dir = process.env.OPOSILAB_DATA_DIR || path.join(process.cwd(), 'data');
  return path.join(dir, 'oposilab.db.json');
}

export function openDatabase(dbPath: string): DatabaseSync {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const conn = new DatabaseSync(dbPath);
  // WAL gives crash safety + readers don't block the writer.
  conn.exec('PRAGMA journal_mode = WAL;');
  conn.exec('PRAGMA synchronous = NORMAL;');
  conn.exec(SCHEMA_TABLES_SQL);
  const migrations = applyAdditiveMigrations(conn);
  if (migrations.length > 0) {
    console.log(
      `[sqlite] Applied ${migrations.length} additive migration(s): ` +
        migrations.map((m) => `${m.table}.${m.column}`).join(', ')
    );
  }
  conn.exec(SCHEMA_INDEXES_SQL);
  return conn;
}
