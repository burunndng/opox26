/**
 * Phase D tests — analytics engine (spec §10–§11).
 * Pure functions over synthetic fixtures; no DB, no UI.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calibrationAlerts,
  calibrationLevels,
  contentQuality,
  buildHeatmap,
  buildConfusionMatrices,
  srsStats,
  activityEffectiveness,
  fragileIndices,
  buildAnalyticsSnapshot,
} from '../src/utils/analytics.ts';
import { ActivityAttempt, Cluster, ConfusionPair, ErrorLog, Item, ReviewSchedule } from '../src/types.ts';

const cluster: Cluster = {
  id: 'c1', name: 'Prescripción vs caducidad', description: '', type: 'conceptual', priority: 'critical',
};
const pair: ConfusionPair = {
  id: 'p1', concept_a: 'Prescripción', concept_b: 'Caducidad', discriminating_cue: 'objeto',
  common_trap: 'plazos', legal_basis_a: '53', legal_basis_b: '54', status: 'validated', severity: 'critical',
};

function mkItem(id: string, over: Partial<Item> = {}): Item {
  const now = '2026-01-01T00:00:00.000Z';
  return {
    id, topic_id: 't1', cluster_id: 'c1', confusion_pair_id: 'p1',
    item_type: 'cover_and_generate_mcq', stem: `Enunciado ${id}`,
    legal_basis: 'Art. 53 TRLGSS', rule_statement: 'r', why_correct: 'w', corrective_rule: 'c',
    difficulty: 3, cognitive_operations: ['micro_discrimination'], status: 'validated', source: 'manual',
    created_at: now, updated_at: now, ...over,
  };
}

function mkAttempt(id: string, over: Partial<ActivityAttempt> = {}): ActivityAttempt {
  return {
    id, item_id: 'i1', activity_type: 'cover_and_generate_mcq', confidence: 2, correct: true,
    created_at: '2026-02-01T10:00:00.000Z', ...over,
  };
}

describe('Phase D: calibration', () => {
  test('D1. calibrationLevels bins accuracy per confidence level', () => {
    const levels = calibrationLevels([
      mkAttempt('a', { confidence: 3, correct: true }),
      mkAttempt('b', { confidence: 3, correct: true }),
      mkAttempt('c', { confidence: 3, correct: false }),
      mkAttempt('d', { confidence: 0, correct: true }),
    ]);
    assert.equal(levels[3].total, 3);
    assert.equal(levels[3].accuracy, 67);
    assert.equal(levels[0].total, 1);
  });

  test('D2. Overcalibration alert fires when conf-3 accuracy collapses', () => {
    const attempts = [
      ...Array.from({ length: 4 }, (_, i) => mkAttempt(`x${i}`, { confidence: 3, correct: false })),
      ...Array.from({ length: 4 }, (_, i) => mkAttempt(`y${i}`, { confidence: 1, correct: true })),
    ];
    const levels = calibrationLevels(attempts);
    const indices = fragileIndices(attempts);
    const alerts = calibrationAlerts(levels, indices, { byCluster: [], byPair: [], byTopic: [], byLegalBasis: [], byAtomType: [] }, []);
    const over = alerts.find((a) => a.code === 'overconfident_global');
    assert.ok(over, 'expected overcalibration alert');
    assert.equal(over?.severity, 'critical');
    assert.match(over!.message, /sobrecalibrado/i);
  });

  test('D3. Lucky-guessing alert fires with many low-confidence hits', () => {
    const attempts = Array.from({ length: 6 }, (_, i) => mkAttempt(`l${i}`, { confidence: 1, correct: true }));
    const levels = calibrationLevels(attempts);
    const indices = fragileIndices(attempts);
    assert.equal(indices.luckyCorrect, 6);
    const alerts = calibrationAlerts(levels, indices, { byCluster: [], byPair: [], byTopic: [], byLegalBasis: [], byAtomType: [] }, []);
    assert.ok(alerts.some((a) => a.code === 'lucky_guessing'));
  });

  test('D4. Fragile vs misconception indices are complementary', () => {
    const attempts = [
      mkAttempt('a', { confidence: 0, correct: true }),  // lucky
      mkAttempt('b', { confidence: 3, correct: false }), // misconception
      mkAttempt('c', { confidence: 2, correct: true }),
      mkAttempt('d', { confidence: 2, correct: true }),
    ];
    const idx = fragileIndices(attempts);
    assert.equal(idx.luckyCorrect, 1);
    assert.equal(idx.confidentWrong, 1);
    assert.ok(idx.fragileKnowledgeIndex > 0 && idx.misconceptionIndex > 0);
    assert.ok(idx.calibrationDelta > 0, 'conf-3 miss among 4 attempts => overconfident overall');
  });
});

describe('Phase D: heat maps & matrices', () => {
  test('D5. buildHeatmap aggregates by key and sorts weakest first', () => {
    const items = [mkItem('i1'), mkItem('i2', { cluster_id: 'c2' })];
    const attempts = [
      mkAttempt('a', { item_id: 'i1', correct: true }),
      mkAttempt('b', { item_id: 'i1', correct: false }),
      mkAttempt('c', { item_id: 'i2', correct: false }),
    ];
    const heat = buildHeatmap(items, attempts, (i) => i.cluster_id, (k) => k);
    assert.equal(heat.length, 2);
    assert.equal(heat[0].key, 'c2');
    assert.equal(heat[0].accuracy, 0);
    assert.equal(heat[1].accuracy, 50);
  });

  test('D6. Confusion matrices split numeric / institutional / temporal errors', () => {
    const now = '2026-02-01T10:00:00.000Z';
    const errors: ErrorLog[] = [
      { id: 'e1', attempt_id: 'a1', item_id: 'i1', topic_id: 't1', cluster_id: 'c1', error_type_code: 'E6', confidence: 2, corrective_rule: '', legal_basis: '', status: 'open', next_review_date: now, created_at: now, updated_at: now },
      { id: 'e2', attempt_id: 'a2', item_id: 'i1', topic_id: 't1', cluster_id: 'c1', error_type_code: 'E17', confidence: 2, corrective_rule: '', legal_basis: '', status: 'open', next_review_date: now, created_at: now, updated_at: now },
      { id: 'e3', attempt_id: 'a3', item_id: 'i1', topic_id: 't1', cluster_id: 'c1', error_type_code: 'E16', confidence: 2, corrective_rule: '', legal_basis: '', status: 'open', next_review_date: now, created_at: now, updated_at: now },
    ];
    const m = buildConfusionMatrices(errors, [mkItem('i1')], []);
    assert.equal(m.numeric.length, 1);
    assert.equal(m.institutional.length, 1);
    assert.equal(m.temporal.length, 1);
  });
});

describe('Phase D: SRS, effectiveness, quality', () => {
  test('D7. srsStats counts due/overdue/graduated from schedules', () => {
    const past = new Date(Date.now() - 10 * 86400000).toISOString();
    const future = new Date(Date.now() + 5 * 86400000).toISOString();
    const schedules: ReviewSchedule[] = [
      { id: 's1', item_id: 'i1', state: 'new', due_date: past, interval_days: 0, ease_factor: 2.5, stability: 1, difficulty: 5, lapses: 0, consecutive_correct_sessions: 0, formats_completed: [], priority_score: 10 },
      { id: 's2', item_id: 'i2', state: 'graduated', due_date: future, interval_days: 30, ease_factor: 2.5, stability: 5, difficulty: 4, lapses: 1, consecutive_correct_sessions: 5, formats_completed: ['cloze'], priority_score: 5 },
    ];
    const stats = srsStats([mkItem('i1'), mkItem('i2')], [], schedules);
    assert.equal(stats.overdue, 1);
    assert.equal(stats.graduated, 1);
    assert.equal(stats.newItems, 1);
    assert.equal(stats.avgIntervalDays, 15);
  });

  test('D8. activityEffectiveness separates interleaved vs blocked accuracy', () => {
    const attempts = [
      mkAttempt('a', { was_interleaved: true, correct: true }),
      mkAttempt('b', { was_interleaved: true, correct: false }),
      mkAttempt('c', { was_interleaved: false, correct: true }),
    ];
    const rows = activityEffectiveness(attempts);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].interleavedAccuracy, 50);
    assert.equal(rows[0].blockedAccuracy, 100);
  });

  test('D9. contentQuality counts missing metadata, duplicates, negative stems, length bias', () => {
    const items = [
      mkItem('dup1', { stem: 'Mismo enunciado' }),
      mkItem('dup2', { stem: 'Mismo enunciado' }),
      mkItem('noleg', { legal_basis: '' }),
      mkItem('neg', { stem: 'Siempre es cierto que todas las opciones' }),
      mkItem('bias', {
        options: [
          { id: 'A', text: 'Correcta', is_correct: true },
          { id: 'B', text: 'x', is_correct: false },
          { id: 'C', text: 'y', is_correct: false, trap_type: 'numeric_substitution', explanation: 'e' },
        ],
      }),
      mkItem('nodist', {
        options: [
          { id: 'A', text: 'Correcta', is_correct: true },
          { id: 'B', text: 'falsa', is_correct: false },
        ],
      }),
      mkItem('negopt', {
        options: [
          { id: 'A', text: 'La regla general', is_correct: true },
          { id: 'B', text: 'Siempre todas las anteriores', is_correct: false, trap_type: 'overbroad_statement', explanation: 'e' },
        ],
      }),
    ];
    const q = contentQuality(items);
    assert.equal(q.duplicateStems, 1);
    assert.equal(q.missingLegalBasis, 1);
    assert.equal(q.negativeStems, 1);
    assert.equal(q.negativeOptions, 1);
    assert.equal(q.optionLengthBias, 2);
    assert.equal(q.missingDistractorExplanation, 2);
    assert.equal(q.missingTrapType, 2);
  });

  test('D10. buildAnalyticsSnapshot assembles every section', () => {
    const snap = buildAnalyticsSnapshot({
      items: [mkItem('i1'), mkItem('i2')],
      clusters: [cluster],
      confusionPairs: [pair],
      attempts: [mkAttempt('a'), mkAttempt('b', { correct: false, confidence: 3 })],
      errors: [],
    });
    assert.ok(snap.heatmaps.byCluster.length >= 1);
    assert.equal(snap.calibration.levels.length, 4);
    assert.ok(Array.isArray(snap.calibration.alerts));
    assert.ok(snap.matrices && snap.srs && snap.effectiveness && snap.quality);
  });
});
