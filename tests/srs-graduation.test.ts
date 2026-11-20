import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import type { Item } from '../src/types.ts';
import { db } from '../server/db.ts';
import { isolateDataDir } from './helpers/isolation.ts';

/**
 * SRS graduation hardening (audit 2026-10-23):
 *  - failed attempts must not earn format credit
 *  - graduation honors the settings flags that were previously dead config:
 *    require_interleaved_success_for_graduation, confidence_required_for_graduation
 */

const isolatedDir = isolateDataDir();

function makeItem(marker: string): Item {
  const source = db.getItems().find((item) => item.item_type === 'cover_and_generate_mcq');
  assert.ok(source, 'seed bank must contain an MCQ template');

  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, fsrs_info: _fsrsInfo, ...data } = source;
  const item = db.createItem({
    ...data,
    topic_id: 'topic-srs-hardening',
    stem: `${source.stem} (${marker})`,
    status: 'validated',
  });
  db.updateReviewSchedule(item.id, {
    state: 'new',
    due_date: new Date(Date.now() - 60_000).toISOString(),
  });
  return item;
}

describe('SRS graduation hardening', () => {
  before(() => {
    assert.equal(process.env.OPOSILAB_DATA_DIR, isolatedDir);
    assert.equal(process.env.OPOSILAB_OFFLINE, '1');
    db.init();
  });

  test('G1: failed attempts do not earn format credit', () => {
    const item = makeItem('g1');
    db.recordAttempt({
      item_id: item.id,
      activity_type: 'spot_error',
      correct: false,
      confidence: 1,
    });
    const sched = db.getReviewSchedule(item.id);
    assert.ok(sched, 'schedule must exist after an attempt');
    assert.equal(
      sched.formats_completed.includes('spot_error'),
      false,
      'a failed attempt must not count as a completed format'
    );
  });

  test('retrying an identified attempt does not duplicate its SRS effects or error log', () => {
    const item = makeItem('idempotent-retry');
    const attempt = {
      id: 'attempt-idempotency-test',
      item_id: item.id,
      activity_type: 'cover_and_generate_mcq' as const,
      correct: false,
      confidence: 3 as const,
      user_response: 'B',
    };
    const first = db.recordAttempt(attempt);
    const lapses = first.schedule.lapses;
    const second = db.recordAttempt(attempt);
    assert.equal(second.attempt.id, first.attempt.id);
    assert.equal(second.schedule.lapses, lapses);
    assert.equal(db.getAttempts().filter((a) => a.id === attempt.id).length, 1);
    assert.equal(db.getErrorLogs({ item_id: item.id }).length, 1);
    assert.throws(() => db.recordAttempt({ ...attempt, user_response: 'A' }));
  });

  test('a SQLite write failure is reported and rolls back attempt, schedule, and error log in memory', () => {
    const item = makeItem('attempt-write-failure');
    const conn = (db as unknown as {
      conn: {
        exec(sql: string): void;
        prepare(sql: string): { get(...values: string[]): { count: number } };
      };
    }).conn;
    assert.ok(conn, 'isolated SQLite connection must be open');
    const beforeSchedule = structuredClone(db.getReviewSchedule(item.id));
    const beforeAttempts = db.getAttempts().length;
    const attempt = {
      id: 'attempt-persistence-failure',
      item_id: item.id,
      activity_type: 'cover_and_generate_mcq' as const,
      user_response: 'respuesta',
      confidence: 3 as const,
      correct: false,
    };

    conn.exec(`
      CREATE TRIGGER fail_one_attempt_insert
      BEFORE INSERT ON activity_attempts
      WHEN NEW.id = '${attempt.id}'
      BEGIN SELECT RAISE(ABORT, 'forced persistence failure'); END;
    `);
    try {
      const originalConsoleError = console.error;
      console.error = () => {};
      try {
        assert.throws(() => db.recordAttempt(attempt), /forced persistence failure/);
      } finally {
        console.error = originalConsoleError;
      }
      assert.equal(db.getAttempts().length, beforeAttempts);
      assert.deepEqual(db.getReviewSchedule(item.id), beforeSchedule);
      assert.equal(db.getErrorLogs({ item_id: item.id }).length, 0);
      assert.equal(
        conn.prepare('SELECT COUNT(*) AS count FROM activity_attempts WHERE id = ?').get(attempt.id)?.count,
        0,
      );
      assert.equal(
        conn.prepare('SELECT lapses AS count FROM review_schedules WHERE item_id = ?').get(item.id)?.count,
        beforeSchedule?.lapses,
      );
      assert.equal(
        conn.prepare('SELECT COUNT(*) AS count FROM error_logs WHERE item_id = ?').get(item.id)?.count,
        0,
      );
    } finally {
      conn.exec('DROP TRIGGER fail_one_attempt_insert');
    }

    const saved = db.recordAttempt(attempt);
    assert.equal(saved.attempt.id, attempt.id);
    assert.equal(db.getAttempts().filter((entry) => entry.id === attempt.id).length, 1);
    assert.equal(db.getErrorLogs({ item_id: item.id }).length, 1);
    assert.equal(
      conn.prepare('SELECT COUNT(*) AS count FROM activity_attempts WHERE id = ?').get(attempt.id)?.count,
      1,
    );
  });

  test('G2: graduation is blocked until a successful interleaved attempt exists', () => {
    const item = makeItem('g2');
    db.recordAttempt({ item_id: item.id, activity_type: 'cover_and_generate_mcq', correct: true, confidence: 2 });
    db.recordAttempt({ item_id: item.id, activity_type: 'cloze', correct: true, confidence: 3 });
    const res3 = db.recordAttempt({ item_id: item.id, activity_type: 'contrast_card', correct: true, confidence: 3 });

    assert.equal(res3.schedule.consecutive_correct_sessions, 3);
    assert.notEqual(res3.schedule.state, 'graduated', 'no interleaved success yet → must not graduate');

    const res4 = db.recordAttempt({
      item_id: item.id,
      activity_type: 'cover_and_generate_mcq',
      correct: true,
      confidence: 3,
      was_interleaved: true,
    });
    assert.equal(res4.schedule.state, 'graduated', 'interleaved success unblocks graduation');
  });

  test('G3: interleaved requirement can be disabled via settings', () => {
    db.updateSettings({ require_interleaved_success_for_graduation: false });
    try {
      const item = makeItem('g3');
      db.recordAttempt({ item_id: item.id, activity_type: 'cover_and_generate_mcq', correct: true, confidence: 2 });
      db.recordAttempt({ item_id: item.id, activity_type: 'cloze', correct: true, confidence: 3 });
      const res3 = db.recordAttempt({ item_id: item.id, activity_type: 'contrast_card', correct: true, confidence: 3 });
      assert.equal(res3.schedule.state, 'graduated', 'flag disabled → interleaved success not required');
    } finally {
      db.updateSettings({ require_interleaved_success_for_graduation: true });
    }
  });

  test('G4: confidence threshold comes from settings', () => {
    db.updateSettings({ confidence_required_for_graduation: 3 });
    try {
      const item = makeItem('g4');
      db.recordAttempt({ item_id: item.id, activity_type: 'cover_and_generate_mcq', correct: true, confidence: 1 });
      db.recordAttempt({ item_id: item.id, activity_type: 'cloze', correct: true, confidence: 1, was_interleaved: true });
      const res3 = db.recordAttempt({ item_id: item.id, activity_type: 'contrast_card', correct: true, confidence: 1, was_interleaved: true });

      assert.equal(res3.schedule.consecutive_correct_sessions, 3);
      assert.notEqual(res3.schedule.state, 'graduated', 'confidence 1 below configured threshold 3');

      const res4 = db.recordAttempt({
        item_id: item.id,
        activity_type: 'cover_and_generate_mcq',
        correct: true,
        confidence: 3,
        was_interleaved: true,
      });
      assert.equal(res4.schedule.state, 'graduated', 'confidence 3 meets configured threshold');
    } finally {
      db.updateSettings({ confidence_required_for_graduation: 2 });
    }
  });
});
