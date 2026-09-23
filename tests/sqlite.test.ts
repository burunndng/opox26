/**
 * Phase A (Foundation) tests — SQLite persistence layer + Zod validation.
 * Fully isolated: uses temp directories, never touches ./data.
 */
import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { openDatabase } from '../server/sqlite/connection.ts';
import { loadAll, persistAll, migrateJsonToSqlite } from '../server/sqlite/persist.ts';
import { DatabaseSchema, Item } from '../src/types.ts';
import {
  topicInput,
  atomInput,
  itemInput,
  attemptInput,
} from '../src/schemas/index.ts';

let tmpDir: string;

function freshDb() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oposilab-test-'));
  return openDatabase(path.join(tmpDir, 'oposilab.db'));
}

function sampleSchema(): DatabaseSchema {
  const now = new Date().toISOString();
  const item: Item = {
    id: 'item_rt_1',
    topic_id: 'topic_rt',
    cluster_id: 'cluster_rt',
    confusion_pair_id: 'pair_rt',
    item_type: 'cover_and_generate_mcq',
    stem: '¿A qué plazo prescribe el derecho al reconocimiento?',
    options: [
      { id: 'A', text: '5 años', is_correct: true, explanation: 'Art. 53 TRLGSS' },
      { id: 'B', text: '1 año', is_correct: false, trap_type: 'conceptual_merger', explanation: 'Ese es el plazo de caducidad del percibo.' },
    ],
    correct_answer: 'A',
    legal_basis: 'Art. 53 TRLGSS',
    rule_statement: 'Prescripción de reconocimiento: 5 años desde el hecho causante.',
    why_correct: 'El art. 53 TRLGSS fija 5 años.',
    corrective_rule: 'No confundir con caducidad (1 año, art. 54).',
    difficulty: 3,
    cognitive_operations: ['micro_discrimination'],
    status: 'validated',
    source: 'manual',
    cloze_data: { text_with_clozes: 'Prescribirá a los {{c1::5 años}}' },
    created_at: now,
    updated_at: now,
  };
  return {
    version: 1,
    settings: {
      ai_provider: 'none',
      ai_model: 'test',
      default_language: 'es',
      srs_algorithm: 'successive_relearning',
      graduating_interval: 21,
      max_new_items_per_day: 15,
      confidence_required_for_graduation: 2,
      require_two_formats_for_graduation: true,
      require_interleaved_success_for_graduation: true,
    },
    topics: [
      { id: 'topic_rt', name: 'Tema Roundtrip', description: '', status: 'active', created_at: now, updated_at: now },
    ],
    sourceChunks: [
      { id: 'chunk_rt', topic_id: 'topic_rt', page_number: 3, article_reference: 'Art. 53', raw_text: 'raw', order_index: 1 },
    ],
    atoms: [
      { id: 'atom_rt', topic_id: 'topic_rt', text: 'Prescripción: 5 años', atom_type: 'deadline', legal_basis: 'Art. 53 TRLGSS', tags: ['prescripción'], status: 'validated', created_at: now, updated_at: now },
    ],
    clusters: [
      { id: 'cluster_rt', topic_id: 'topic_rt', name: 'Prescripción', description: '', type: 'conceptual', priority: 'critical' },
    ],
    confusionPairs: [
      { id: 'pair_rt', topic_id: 'topic_rt', concept_a: 'Prescripción', concept_b: 'Caducidad', discriminating_cue: 'Objeto: reconocimiento vs percibo', common_trap: 'Aplicar 5 años al cobro', legal_basis_a: 'Art. 53', legal_basis_b: 'Art. 54', status: 'validated', severity: 'critical' },
    ],
    items: [item],
    activityAttempts: [
      { id: 'attempt_rt', item_id: 'item_rt_1', activity_type: 'cover_and_generate_mcq', confidence: 3, correct: false, used_hint: true, error_type_code: 'E8', was_interleaved: false, was_timed: false, created_at: now },
    ],
    reviewSchedules: [
      { id: 'sched_rt', item_id: 'item_rt_1', state: 'learning', due_date: now, interval_days: 0, ease_factor: 2.5, stability: 1, difficulty: 5, lapses: 1, consecutive_correct_sessions: 0, formats_completed: ['cover_and_generate_mcq'], priority_score: 100 },
    ],
    errorLogs: [
      { id: 'err_rt', attempt_id: 'attempt_rt', item_id: 'item_rt_1', topic_id: 'topic_rt', error_type_code: 'E8', confidence: 3, corrective_rule: 'rule', legal_basis: 'Art. 53', status: 'open', next_review_date: now, created_at: now, updated_at: now },
    ],
    sessions: [],
    savedSessionState: { version: 1, id: 'ses_rt', saved_at: now, mode: 'srs', title: 'T', currentIndex: 0, items: [item], sessionResults: { correct: 0, total: 1, confidences: [] } },
  };
}

describe('Phase A: SQLite Persistence (isolated)', () => {
  beforeEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });
  after(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('A1. Round-trip: persist → load preserves entities, JSON columns and booleans', () => {
    const conn = freshDb();
    const schema = sampleSchema();
    persistAll(conn, schema);

    const loaded = loadAll(conn);
    assert.ok(loaded, 'DB with data must load');
    assert.equal(loaded.topics.length, 1);
    assert.equal(loaded.items.length, 1);

    const item = loaded.items[0];
    assert.equal(item.id, 'item_rt_1');
    assert.equal(item.options?.length, 2);
    assert.equal(item.options?.[1]?.trap_type, 'conceptual_merger', 'nested JSON column must survive');
    assert.deepEqual(item.cognitive_operations, ['micro_discrimination']);
    assert.ok(item.cloze_data?.text_with_clozes?.includes('{{c1::5 años}}'));
    assert.equal(loaded.atoms[0]?.tags?.[0], 'prescripción');

    const attempt = loaded.activityAttempts[0];
    assert.equal(attempt.correct, false, 'boolean false must round-trip');
    assert.equal(attempt.used_hint, true, 'boolean true must round-trip');

    const sched = loaded.reviewSchedules[0];
    assert.deepEqual(sched.formats_completed, ['cover_and_generate_mcq']);
    assert.equal(sched.lapses, 1);

    assert.equal(loaded.settings.ai_provider, 'none');
    assert.ok(loaded.savedSessionState, 'saved session state must persist');
    assert.equal(loaded.savedSessionState.mode, 'srs');
  });

  test('A2. Deletion sync: rows removed from memory are removed from SQLite', () => {
    const conn = freshDb();
    const schema = sampleSchema();
    persistAll(conn, schema);

    schema.items = [];
    schema.atoms = [];
    schema.activityAttempts = [];
    persistAll(conn, schema);

    const loaded = loadAll(conn)!;
    assert.equal(loaded.items.length, 0, 'deleted item must disappear from SQLite');
    assert.equal(loaded.atoms.length, 0);
    assert.equal(loaded.activityAttempts.length, 0);
    assert.equal(loaded.topics.length, 1, 'untouched table must remain');
  });

  test('A3. loadAll returns null for a brand-new empty DB (triggers seeding)', () => {
    const conn = freshDb();
    assert.equal(loadAll(conn), null);
  });

  test('A4. persistAll is idempotent (double save does not duplicate)', () => {
    const conn = freshDb();
    const schema = sampleSchema();
    persistAll(conn, schema);
    persistAll(conn, schema);
    const loaded = loadAll(conn)!;
    assert.equal(loaded.items.length, 1);
    assert.equal(loaded.topics.length, 1);
    assert.equal(loaded.reviewSchedules.length, 1);
  });

  test('A5. Legacy JSON migration: imports, preserves data, refuses re-run', () => {
    const conn = freshDb();
    const jsonPath = path.join(tmpDir, 'legacy.json');
    fs.writeFileSync(jsonPath, JSON.stringify(sampleSchema()), 'utf-8');

    const first = migrateJsonToSqlite(conn, jsonPath);
    assert.equal(first.migrated, true);
    assert.equal(first.counts?.items, 1);
    assert.equal(first.counts?.topics, 1);

    const loaded = loadAll(conn)!;
    assert.equal(loaded.items[0].stem, '¿A qué plazo prescribe el derecho al reconocimiento?');
    assert.equal(loaded.errorLogs[0].error_type_code, 'E8');

    const second = migrateJsonToSqlite(conn, jsonPath);
    assert.equal(second.migrated, false, 'must refuse to double-migrate');
    assert.equal(loadAll(conn)!.items.length, 1, 'no duplicates after refused re-run');
  });

  test('A6. Migration rejects invalid backup JSON', () => {
    const conn = freshDb();
    const jsonPath = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ foo: 'bar' }), 'utf-8');
    assert.throws(() => migrateJsonToSqlite(conn, jsonPath), /not a valid OposiLab backup/);
  });
});

describe('Phase A: Zod API Validation', () => {
  test('A7. itemInput rejects a missing stem and a bad item_type', () => {
    const bad1 = itemInput.safeParse({ topic_id: 't1', item_type: 'cloze' });
    assert.equal(bad1.success, false);
    const bad2 = itemInput.safeParse({ topic_id: 't1', item_type: 'mock_exam_full', stem: 'x' });
    assert.equal(bad2.success, false, 'unknown item_type must be rejected');
  });

  test('A8. itemInput accepts a valid MCQ and preserves extra keys (passthrough)', () => {
    const ok = itemInput.safeParse({
      topic_id: 't1',
      item_type: 'cover_and_generate_mcq',
      stem: '¿Plazo?',
      figure_status: 'BOE_VERIFIED',
      options: [{ id: 'A', text: '5 años', is_correct: true }],
    });
    assert.equal(ok.success, true);
    if (ok.success) {
      assert.equal((ok.data as any).figure_status, 'BOE_VERIFIED', 'extra key must survive');
    }
  });

  test('A9. attemptInput rejects confidence out of 0-3 and missing item_id', () => {
    assert.equal(attemptInput.safeParse({ item_id: 'i', activity_type: 'cloze', confidence: 4, correct: true }).success, false);
    assert.equal(attemptInput.safeParse({ activity_type: 'cloze', confidence: 2, correct: true }).success, false);
    assert.equal(attemptInput.safeParse({ item_id: 'i', activity_type: 'cloze', confidence: 3, correct: true }).success, true);
  });

  test('A10. atomInput rejects empty text; topicInput requires name', () => {
    assert.equal(atomInput.safeParse({ text: '' }).success, false);
    assert.equal(topicInput.safeParse({ description: 'no name' }).success, false);
    assert.equal(topicInput.safeParse({ name: 'Tema 8' }).success, true);
  });
});
