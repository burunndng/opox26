import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import type {
  DatabaseSchema,
  Topic,
  SourceChunk,
  Atom,
  Cluster,
  ConfusionPair,
  Item,
  ActivityAttempt,
  ReviewSchedule,
  ErrorLog,
  Session,
} from '../../src/types.ts';
import { defaultSettings } from './defaults.ts';

/**
 * Row mappers between the in-memory DatabaseSchema (src/types.ts) and the
 * SQLite tables (schema in connection.ts).
 *
 * Strategy: the app keeps working on the in-memory object (db.ts API is
 * unchanged). persistAll() syncs the full in-memory state into SQLite inside a
 * single transaction on every save (previously: full-JSON-file rewrite).
 * loadAll() rebuilds the in-memory state at boot.
 */

type SqlRow = Record<string, unknown>;

// Bind helpers: node:sqlite rejects `undefined` and `boolean`.
const nul = (v: unknown): unknown => (v === undefined ? null : v);
const bool = (v: boolean | undefined): number => (v ? 1 : 0);
const unb = (v: unknown): boolean => v === 1 || v === true;
const j = (v: unknown): string | null => (v === undefined || v === null ? null : JSON.stringify(v));
function pj<T>(v: unknown): T | undefined;
function pj<T>(v: unknown, fallback: T): T;
function pj<T>(v: unknown, fallback?: T): T | undefined {
  if (v === null || v === undefined) return fallback;
  try {
    return JSON.parse(String(v)) as T;
  } catch {
    return fallback;
  }
}
const str = (v: unknown): string | undefined => (v === null || v === undefined ? undefined : String(v));
const num = (v: unknown): number | undefined => (v === null || v === undefined ? undefined : Number(v));

interface TableMapper<T> {
  name: string;
  columns: string[];
  toRow: (e: T) => unknown[];
  fromRow: (r: SqlRow) => T;
  list: (d: DatabaseSchema) => T[];
}

const topicMapper: TableMapper<Topic> = {
  name: 'topics',
  columns: ['id', 'name', 'description', 'source_file', 'status', 'created_at', 'updated_at'],
  toRow: (t) => [t.id, t.name, t.description ?? '', nul(t.source_file), t.status ?? 'draft', t.created_at, t.updated_at],
  fromRow: (r) => ({
    id: String(r.id), name: String(r.name), description: str(r.description) ?? '',
    source_file: str(r.source_file), status: (str(r.status) ?? 'draft') as Topic['status'],
    created_at: String(r.created_at), updated_at: String(r.updated_at),
  }),
  list: (d) => d.topics,
};

const chunkMapper: TableMapper<SourceChunk> = {
  name: 'source_chunks',
  columns: ['id', 'topic_id', 'page_number', 'article_reference', 'raw_text', 'summary', 'order_index'],
  toRow: (c) => [c.id, nul(c.topic_id), nul(c.page_number), nul(c.article_reference), c.raw_text, nul(c.summary), c.order_index ?? 0],
  fromRow: (r) => ({
    id: String(r.id), topic_id: str(r.topic_id) ?? '', page_number: num(r.page_number),
    article_reference: str(r.article_reference), raw_text: String(r.raw_text),
    summary: str(r.summary), order_index: Number(r.order_index ?? 0),
  }),
  list: (d) => d.sourceChunks,
};

const atomMapper: TableMapper<Atom> = {
  name: 'atoms',
  columns: ['id', 'topic_id', 'source_chunk_id', 'text', 'atom_type', 'legal_basis', 'cluster_id', 'confusion_pair_id', 'tags', 'difficulty', 'figure_status', 'status', 'created_at', 'updated_at'],
  toRow: (a) => [a.id, nul(a.topic_id), nul(a.source_chunk_id), a.text, nul(a.atom_type ?? a.type), nul(a.legal_basis ?? a.legal), nul(a.cluster_id ?? a.cluster), nul(a.confusion_pair_id ?? a.pair), j(a.tags ?? []), nul(a.difficulty), nul(a.figure_status), a.status ?? 'draft', nul(a.created_at), nul(a.updated_at)],
  fromRow: (r) => ({
    id: String(r.id), topic_id: str(r.topic_id), source_chunk_id: str(r.source_chunk_id),
    text: String(r.text), atom_type: str(r.atom_type) as Atom['atom_type'],
    legal_basis: str(r.legal_basis), cluster_id: str(r.cluster_id),
    confusion_pair_id: str(r.confusion_pair_id), tags: pj<string[]>(r.tags, []),
    difficulty: num(r.difficulty), figure_status: str(r.figure_status) as Atom['figure_status'],
    status: (str(r.status) ?? 'draft') as Atom['status'],
    created_at: str(r.created_at), updated_at: str(r.updated_at),
  }),
  list: (d) => d.atoms,
};

const clusterMapper: TableMapper<Cluster> = {
  name: 'clusters',
  columns: ['id', 'topic_id', 'name', 'description', 'type', 'priority'],
  toRow: (c) => [c.id, nul(c.topic_id), c.name, c.description ?? '', c.type, c.priority ?? 'medium'],
  fromRow: (r) => ({
    id: String(r.id), topic_id: str(r.topic_id), name: String(r.name),
    description: str(r.description) ?? '', type: str(r.type) as Cluster['type'],
    priority: (str(r.priority) ?? 'medium') as Cluster['priority'],
  }),
  list: (d) => d.clusters,
};

const pairMapper: TableMapper<ConfusionPair> = {
  name: 'confusion_pairs',
  columns: ['id', 'topic_id', 'concept_a', 'concept_b', 'discriminating_cue', 'common_trap', 'legal_basis_a', 'legal_basis_b', 'example_case', 'status', 'severity'],
  toRow: (p) => [p.id, nul(p.topic_id), p.concept_a, p.concept_b, p.discriminating_cue, p.common_trap, nul(p.legal_basis_a), nul(p.legal_basis_b), nul(p.example_case), p.status, p.severity],
  fromRow: (r) => ({
    id: String(r.id), topic_id: str(r.topic_id), concept_a: String(r.concept_a),
    concept_b: String(r.concept_b), discriminating_cue: String(r.discriminating_cue),
    common_trap: String(r.common_trap), legal_basis_a: str(r.legal_basis_a) ?? '',
    legal_basis_b: str(r.legal_basis_b) ?? '', example_case: str(r.example_case),
    status: (str(r.status) ?? 'draft') as ConfusionPair['status'],
    severity: (str(r.severity) ?? 'medium') as ConfusionPair['severity'],
  }),
  list: (d) => d.confusionPairs,
};

const itemMapper: TableMapper<Item> = {
  name: 'items',
  columns: ['id', 'topic_id', 'cluster_id', 'confusion_pair_id', 'item_type', 'stem', 'prompt_before_options', 'options', 'correct_answer', 'legal_basis', 'rule_statement', 'why_correct', 'distractor_analysis', 'trap_types', 'corrective_rule', 'condition_if_distractor_correct', 'difficulty', 'cognitive_operations', 'status', 'source', 'cloze_data', 'contrast_data', 'number_sort_data', 'spot_error_data', 'two_tier_data', 'exception_tree_data', 'fact_variant_data', 'fsrs_info', 'figure_status', 'created_at', 'updated_at'],
  toRow: (i) => [
    i.id, i.topic_id, nul(i.cluster_id), nul(i.confusion_pair_id), i.item_type, i.stem,
    nul(i.prompt_before_options), j(i.options), nul(i.correct_answer), nul(i.legal_basis),
    nul(i.rule_statement), nul(i.why_correct), j(i.distractor_analysis), j(i.trap_types),
    nul(i.corrective_rule), j(i.condition_if_distractor_correct), nul(i.difficulty),
    j(i.cognitive_operations), i.status, i.source ?? 'manual',
    j(i.cloze_data), j(i.contrast_data), j(i.number_sort_data), j(i.spot_error_data),
    j(i.two_tier_data), j(i.exception_tree_data), j(i.fact_variant_data), j(i.fsrs_info),
    nul(i.figure_status), i.created_at, i.updated_at,
  ],
  fromRow: (r) => ({
    id: String(r.id), topic_id: String(r.topic_id), cluster_id: str(r.cluster_id),
    confusion_pair_id: str(r.confusion_pair_id), item_type: str(r.item_type) as Item['item_type'],
    stem: String(r.stem), prompt_before_options: str(r.prompt_before_options),
    options: pj<Item['options']>(r.options), correct_answer: str(r.correct_answer),
    legal_basis: str(r.legal_basis) ?? '', rule_statement: str(r.rule_statement) ?? '',
    why_correct: str(r.why_correct) ?? '',
    distractor_analysis: pj<Record<string, string>>(r.distractor_analysis),
    trap_types: pj<Item['trap_types']>(r.trap_types),
    corrective_rule: str(r.corrective_rule) ?? '',
    condition_if_distractor_correct: pj<Record<string, string>>(r.condition_if_distractor_correct),
    difficulty: num(r.difficulty) ?? 3,
    cognitive_operations: pj<Item['cognitive_operations']>(r.cognitive_operations, []),
    status: (str(r.status) ?? 'draft') as Item['status'],
    source: (str(r.source) ?? 'manual') as Item['source'],
    cloze_data: pj<Item['cloze_data']>(r.cloze_data),
    contrast_data: pj<Item['contrast_data']>(r.contrast_data),
    number_sort_data: pj<Item['number_sort_data']>(r.number_sort_data),
    spot_error_data: pj<Item['spot_error_data']>(r.spot_error_data),
    two_tier_data: pj<Item['two_tier_data']>(r.two_tier_data),
    exception_tree_data: pj<Item['exception_tree_data']>(r.exception_tree_data),
    fact_variant_data: pj<Item['fact_variant_data']>(r.fact_variant_data),
    fsrs_info: pj<Item['fsrs_info']>(r.fsrs_info),
    figure_status: str(r.figure_status) as Item['figure_status'],
    created_at: String(r.created_at), updated_at: String(r.updated_at),
  }),
  list: (d) => d.items,
};

const attemptMapper: TableMapper<ActivityAttempt> = {
  name: 'activity_attempts',
  columns: ['id', 'item_id', 'session_id', 'activity_type', 'user_response', 'generated_answer_before_options', 'selected_option', 'reasoning_response', 'confidence', 'correct', 'used_hint', 'hints_revealed', 'error_type_code', 'trap_selected_by_user', 'time_to_generate_ms', 'time_to_answer_ms', 'was_interleaved', 'was_timed', 'format_version', 'created_at'],
  toRow: (a) => [
    a.id, a.item_id, nul(a.session_id), a.activity_type, nul(a.user_response),
    nul(a.generated_answer_before_options), nul(a.selected_option), nul(a.reasoning_response),
    a.confidence, bool(a.correct), bool(a.used_hint), j(a.hints_revealed),
    nul(a.error_type_code), nul(a.trap_selected_by_user), nul(a.time_to_generate_ms),
    nul(a.time_to_answer_ms), bool(a.was_interleaved), bool(a.was_timed),
    nul(a.format_version), a.created_at,
  ],
  fromRow: (r) => ({
    id: String(r.id), item_id: String(r.item_id), session_id: str(r.session_id),
    activity_type: str(r.activity_type) as ActivityAttempt['activity_type'],
    user_response: str(r.user_response),
    generated_answer_before_options: str(r.generated_answer_before_options),
    selected_option: str(r.selected_option), reasoning_response: str(r.reasoning_response),
    confidence: (num(r.confidence) ?? 0) as ActivityAttempt['confidence'],
    correct: unb(r.correct), used_hint: unb(r.used_hint),
    hints_revealed: pj<ActivityAttempt['hints_revealed']>(r.hints_revealed),
    error_type_code: str(r.error_type_code),
    trap_selected_by_user: str(r.trap_selected_by_user) as ActivityAttempt['trap_selected_by_user'],
    time_to_generate_ms: num(r.time_to_generate_ms), time_to_answer_ms: num(r.time_to_answer_ms),
    was_interleaved: unb(r.was_interleaved), was_timed: unb(r.was_timed),
    format_version: num(r.format_version), created_at: String(r.created_at),
  }),
  list: (d) => d.activityAttempts,
};

const scheduleMapper: TableMapper<ReviewSchedule> = {
  name: 'review_schedules',
  columns: ['id', 'item_id', 'state', 'due_date', 'interval_days', 'ease_factor', 'stability', 'difficulty', 'lapses', 'consecutive_correct_sessions', 'formats_completed', 'last_confidence', 'last_error_type', 'priority_score', 'graduated_at', 'suspended_reason'],
  toRow: (s) => [
    s.id, s.item_id, s.state, s.due_date, s.interval_days ?? 0, s.ease_factor ?? 2.5,
    s.stability ?? 1.0, s.difficulty ?? 5.0, s.lapses ?? 0,
    s.consecutive_correct_sessions ?? 0, j(s.formats_completed ?? []),
    nul(s.last_confidence), nul(s.last_error_type), s.priority_score ?? 10,
    nul(s.graduated_at), nul(s.suspended_reason),
  ],
  fromRow: (r) => ({
    id: String(r.id), item_id: String(r.item_id), state: (str(r.state) ?? 'new') as ReviewSchedule['state'],
    due_date: String(r.due_date), interval_days: num(r.interval_days) ?? 0,
    ease_factor: num(r.ease_factor) ?? 2.5, stability: num(r.stability) ?? 1.0,
    difficulty: num(r.difficulty) ?? 5.0, lapses: num(r.lapses) ?? 0,
    consecutive_correct_sessions: num(r.consecutive_correct_sessions) ?? 0,
    formats_completed: pj<ReviewSchedule['formats_completed']>(r.formats_completed, []),
    last_confidence: num(r.last_confidence) as ReviewSchedule['last_confidence'],
    last_error_type: str(r.last_error_type), priority_score: num(r.priority_score) ?? 10,
    graduated_at: str(r.graduated_at), suspended_reason: str(r.suspended_reason),
  }),
  list: (d) => d.reviewSchedules,
};

const errorLogMapper: TableMapper<ErrorLog> = {
  name: 'error_logs',
  columns: ['id', 'attempt_id', 'item_id', 'topic_id', 'cluster_id', 'confusion_pair_id', 'error_type_code', 'confidence', 'user_explanation', 'corrective_rule', 'legal_basis', 'trap_type', 'status', 'next_review_date', 'created_at', 'updated_at'],
  toRow: (e) => [
    e.id, nul(e.attempt_id), e.item_id, e.topic_id, nul(e.cluster_id),
    nul(e.confusion_pair_id), e.error_type_code, e.confidence, nul(e.user_explanation),
    nul(e.corrective_rule), nul(e.legal_basis), nul(e.trap_type), e.status,
    nul(e.next_review_date), e.created_at, e.updated_at,
  ],
  fromRow: (r) => ({
    id: String(r.id), attempt_id: str(r.attempt_id) ?? '', item_id: String(r.item_id),
    topic_id: String(r.topic_id), cluster_id: str(r.cluster_id),
    confusion_pair_id: str(r.confusion_pair_id),
    error_type_code: str(r.error_type_code) ?? 'E1',
    confidence: (num(r.confidence) ?? 0) as ErrorLog['confidence'],
    user_explanation: str(r.user_explanation), corrective_rule: str(r.corrective_rule) ?? '',
    legal_basis: str(r.legal_basis) ?? '', trap_type: str(r.trap_type) as ErrorLog['trap_type'],
    status: (str(r.status) ?? 'open') as ErrorLog['status'],
    next_review_date: str(r.next_review_date) ?? new Date().toISOString(),
    created_at: String(r.created_at), updated_at: String(r.updated_at),
  }),
  list: (d) => d.errorLogs,
};

const sessionMapper: TableMapper<Session> = {
  name: 'sessions',
  columns: ['id', 'name', 'type', 'started_at', 'ended_at', 'item_count', 'accuracy', 'avg_confidence', 'calibration_delta', 'notes'],
  toRow: (s) => [s.id, s.name, s.type, s.started_at, nul(s.ended_at), s.item_count ?? 0, nul(s.accuracy), nul(s.avg_confidence), nul(s.calibration_delta), nul(s.notes)],
  fromRow: (r) => ({
    id: String(r.id), name: String(r.name), type: str(r.type) as Session['type'],
    started_at: String(r.started_at), ended_at: str(r.ended_at),
    item_count: num(r.item_count) ?? 0, accuracy: num(r.accuracy),
    avg_confidence: num(r.avg_confidence), calibration_delta: num(r.calibration_delta),
    notes: str(r.notes),
  }),
  list: (d) => d.sessions,
};

// `any` here is deliberate: mappers are heterogeneous concrete types
// (TableMapper<Topic> etc.); a shared array can't be covariant in T.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const MAPPERS: TableMapper<any>[] = [
  topicMapper, chunkMapper, clusterMapper, pairMapper, atomMapper, itemMapper,
  attemptMapper, scheduleMapper, errorLogMapper, sessionMapper,
];

/** Syncs the whole in-memory state into SQLite in one transaction (delete-stale + upsert-current). */
export function persistAll(conn: DatabaseSync, data: DatabaseSchema): void {
  conn.exec('BEGIN');
  try {
    for (const mapper of MAPPERS) {
      const entities = mapper.list(data) as Array<{ id: string }>;
      const currentIds = new Set(entities.map((e) => e.id));
      const existing = conn.prepare(`SELECT id FROM ${mapper.name}`).all();
      const deleteStmt = conn.prepare(`DELETE FROM ${mapper.name} WHERE id = ?`);
      for (const row of existing) {
        if (!currentIds.has(String(row.id))) deleteStmt.run(String(row.id));
      }
      const placeholders = mapper.columns.map(() => '?').join(', ');
      const upsert = conn.prepare(
        `INSERT OR REPLACE INTO ${mapper.name} (${mapper.columns.join(', ')}) VALUES (${placeholders})`
      );
      for (const entity of entities) {
        upsert.run(...(mapper.toRow as (e: any) => any[])(entity));
      }
    }

    // Settings as key/value rows
    const setSetting = conn.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(data.settings ?? {})) {
      setSetting.run(key, JSON.stringify(value));
    }

    // Saved session state: single row or absent
    if (data.savedSessionState) {
      conn.prepare('INSERT OR REPLACE INTO saved_session_state (id, payload, saved_at) VALUES (?, ?, ?)')
        .run('current', JSON.stringify(data.savedSessionState), new Date().toISOString());
    } else {
      conn.prepare('DELETE FROM saved_session_state WHERE id = ?').run('current');
    }

    conn.exec('COMMIT');
  } catch (err) {
    try { conn.exec('ROLLBACK'); } catch { /* ignore */ }
    throw err;
  }
}

/** Rebuilds the in-memory schema from SQLite. Returns null when the DB is brand-new/empty. */
export function loadAll(conn: DatabaseSync): DatabaseSchema | null {
  const topicCount = conn.prepare('SELECT COUNT(*) AS c FROM topics').get() as { c: number };
  const settingCount = conn.prepare('SELECT COUNT(*) AS c FROM settings').get() as { c: number };
  if (Number(topicCount.c) === 0 && Number(settingCount.c) === 0) return null;

  const load = <T,>(m: TableMapper<T>): T[] =>
    (conn.prepare(`SELECT * FROM ${m.name}`).all() as SqlRow[]).map(m.fromRow);

  const settingsRows = conn.prepare('SELECT key, value FROM settings').all() as SqlRow[];
  const settings: Record<string, unknown> = { ...defaultSettings };
  for (const row of settingsRows) {
    try {
      settings[String(row.key)] = JSON.parse(String(row.value));
    } catch {
      settings[String(row.key)] = row.value;
    }
  }

  const savedRow = conn.prepare('SELECT payload FROM saved_session_state WHERE id = ?').get('current') as SqlRow | undefined;

  return {
    version: 1,
    settings: settings as unknown as DatabaseSchema['settings'],
    topics: load(topicMapper),
    sourceChunks: load(chunkMapper),
    atoms: load(atomMapper),
    clusters: load(clusterMapper),
    confusionPairs: load(pairMapper),
    items: load(itemMapper),
    activityAttempts: load(attemptMapper),
    reviewSchedules: load(scheduleMapper),
    errorLogs: load(errorLogMapper),
    sessions: load(sessionMapper),
    savedSessionState: savedRow ? pj(savedRow.payload) : undefined,
  };
}

export interface MigrationResult {
  migrated: boolean;
  reason?: string;
  counts?: Record<string, number>;
}

/**
 * One-time import of the legacy JSON store into SQLite. Idempotent: refuses to
 * run when SQLite already holds data. Caller is responsible for renaming the
 * JSON file afterwards.
 */
export function migrateJsonToSqlite(conn: DatabaseSync, jsonPath: string): MigrationResult {
  const existing = loadAll(conn);
  if (existing && (existing.topics.length > 0 || existing.items.length > 0)) {
    return { migrated: false, reason: 'SQLite already contains data' };
  }
  if (!fs.existsSync(jsonPath)) {
    return { migrated: false, reason: `Legacy JSON not found at ${jsonPath}` };
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const parsed = JSON.parse(raw) as DatabaseSchema;
  if (!parsed || !Array.isArray(parsed.topics) || !Array.isArray(parsed.items)) {
    throw new Error('Legacy JSON is not a valid OposiLab backup (missing topics/items arrays)');
  }
  persistAll(conn, parsed);
  return {
    migrated: true,
    counts: {
      topics: parsed.topics.length,
      sourceChunks: parsed.sourceChunks?.length ?? 0,
      atoms: parsed.atoms?.length ?? 0,
      clusters: parsed.clusters?.length ?? 0,
      confusionPairs: parsed.confusionPairs?.length ?? 0,
      items: parsed.items.length,
      attempts: parsed.activityAttempts?.length ?? 0,
      reviewSchedules: parsed.reviewSchedules?.length ?? 0,
      errorLogs: parsed.errorLogs?.length ?? 0,
      sessions: parsed.sessions?.length ?? 0,
    },
  };
}
