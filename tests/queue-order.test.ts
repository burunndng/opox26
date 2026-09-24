import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  interleaveByType,
  countNewItemsSeenToday,
  capNewItems,
} from '../server/queueOrder.ts';
import { db } from '../server/db.ts';
import { SchedulingEngine } from '../server/scheduler.ts';
import { isolateDataDir } from './helpers/isolation.ts';
import type { Item, ReviewSchedule, ActivityAttempt } from '../src/types.ts';

const isolatedDir = isolateDataDir();

function makeItem(id: string, overrides: Partial<Item> = {}): Item {
  return {
    id,
    topic_id: 'topic-queue-test',
    item_type: 'cover_and_generate_mcq',
    stem: `Pregunta ${id}`,
    legal_basis: 'Art. 1',
    rule_statement: 'Regla de prueba.',
    why_correct: 'Explicación de prueba.',
    corrective_rule: 'Corrección de prueba.',
    difficulty: 1,
    cognitive_operations: ['micro_discrimination'],
    status: 'validated',
    source: 'manual',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeSchedule(itemId: string, overrides: Partial<ReviewSchedule> = {}): ReviewSchedule {
  return {
    id: `sched-${itemId}`,
    item_id: itemId,
    state: 'review',
    due_date: '2026-09-24T00:00:00.000Z',
    interval_days: 1,
    ease_factor: 2.5,
    stability: 1,
    difficulty: 1,
    lapses: 0,
    consecutive_correct_sessions: 0,
    formats_completed: [],
    priority_score: 0,
    ...overrides,
  };
}

function candidate(
  id: string,
  score: number,
  itemOverrides: Partial<Item> = {},
  scheduleOverrides: Partial<ReviewSchedule> = {},
) {
  return { item: makeItem(id, itemOverrides), schedule: makeSchedule(id, scheduleOverrides), score };
}

function makeAttempt(itemId: string, createdAt: Date): ActivityAttempt {
  return {
    id: `attempt-${itemId}-${createdAt.getTime()}`,
    item_id: itemId,
    activity_type: 'cover_and_generate_mcq',
    confidence: 1,
    correct: true,
    created_at: createdAt.toISOString(),
  };
}

function hasRunOfThree<T>(items: T[], key: (entry: T) => string | undefined): boolean {
  for (let index = 2; index < items.length; index++) {
    const value = key(items[index]);
    if (value && value === key(items[index - 1]) && value === key(items[index - 2])) return true;
  }
  return false;
}

describe('Daily queue ordering', () => {
  before(() => {
    assert.equal(process.env.OPOSILAB_DATA_DIR, isolatedDir);
    assert.equal(process.env.OPOSILAB_OFFLINE, '1');
    db.init();
  });

  test('G1: avoids three consecutive same item types when a valid ordering exists', () => {
    const candidates = [
      candidate('type-a1', 60, { item_type: 'cover_and_generate_mcq' }),
      candidate('type-a2', 50, { item_type: 'cover_and_generate_mcq' }),
      candidate('type-a3', 40, { item_type: 'cover_and_generate_mcq' }),
      candidate('type-b1', 30, { item_type: 'two_tier' }),
      candidate('type-b2', 20, { item_type: 'two_tier' }),
    ];

    const ordered = interleaveByType(candidates);

    assert.equal(ordered.length, candidates.length);
    assert.equal(hasRunOfThree(ordered, (entry) => entry.item.item_type), false);
    assert.deepEqual(
      [...ordered].map((entry) => entry.item.id).sort(),
      [...candidates].map((entry) => entry.item.id).sort(),
    );
  });

  test('G2: the highest-scored candidate remains first', () => {
    const candidates = [
      candidate('top-1', 90, { item_type: 'cover_and_generate_mcq' }),
      candidate('top-2', 80, { item_type: 'cover_and_generate_mcq' }),
      candidate('top-3', 70, { item_type: 'cloze' }),
    ];

    const ordered = interleaveByType(candidates);

    assert.equal(ordered[0].item.id, 'top-1');
  });

  test('G3: avoids three consecutive same clusters and treats missing clusters as unique', () => {
    const candidates = [
      candidate('cluster-a1', 50, { cluster_id: 'cluster-a', item_type: 'cover_and_generate_mcq' }),
      candidate('cluster-a2', 40, { cluster_id: 'cluster-a', item_type: 'cloze' }),
      candidate('cluster-a3', 30, { cluster_id: 'cluster-a', item_type: 'cover_and_generate_mcq' }),
      candidate('cluster-b1', 20, { cluster_id: 'cluster-b', item_type: 'cover_and_generate_mcq' }),
      candidate('cluster-b2', 10, { cluster_id: 'cluster-b', item_type: 'cloze' }),
    ];

    const ordered = interleaveByType(candidates);
    assert.equal(hasRunOfThree(ordered, (entry) => entry.item.cluster_id), false);

    const noCluster = [
      candidate('no-cluster-1', 50),
      candidate('no-cluster-2', 40),
      candidate('no-cluster-3', 30),
    ];
    const orderedNoCluster = interleaveByType(noCluster);
    assert.equal(hasRunOfThree(orderedNoCluster, (entry) => entry.item.cluster_id), false);
    assert.deepEqual(orderedNoCluster.map((entry) => entry.item.id), ['no-cluster-1', 'no-cluster-2', 'no-cluster-3']);
  });

  test('G4: unsatisfiable constraints terminate with the deterministic highest-ranked fallback', () => {
    const candidates = [
      candidate('impossible-1', 40, { item_type: 'two_tier', cluster_id: 'cluster-only' }),
      candidate('impossible-2', 30, { item_type: 'two_tier', cluster_id: 'cluster-only' }),
      candidate('impossible-3', 20, { item_type: 'two_tier', cluster_id: 'cluster-only' }),
      candidate('impossible-4', 10, { item_type: 'two_tier', cluster_id: 'cluster-only' }),
    ];

    const first = interleaveByType(candidates);
    const second = interleaveByType(candidates);

    assert.deepEqual(first.map((entry) => entry.item.id), candidates.map((entry) => entry.item.id));
    assert.deepEqual(first.map((entry) => entry.item.id), second.map((entry) => entry.item.id));
  });

  test('G5: new-item cap retains at most the remaining allowance and preserves non-new order', () => {
    const candidates = [
      candidate('cap-a', 50, {}, { state: 'review' }),
      candidate('cap-b', 40, {}, { state: 'new' }),
      candidate('cap-c', 30, {}, { state: 'learning' }),
      candidate('cap-d', 20, {}, { state: 'new' }),
      candidate('cap-e', 10, {}, { state: 'new' }),
    ];

    const capped = capNewItems(candidates, 1, 2);

    assert.deepEqual(capped.map((entry) => entry.item.id), ['cap-a', 'cap-b', 'cap-c']);
  });

  test('G6: only first-ever attempts from today count as new items seen today', () => {
    const now = new Date(2026, 8, 24, 12, 0, 0);
    const attempts = [
      makeAttempt('seen-yesterday', new Date(2026, 8, 23, 10, 0, 0)),
      makeAttempt('seen-yesterday', new Date(2026, 8, 24, 8, 0, 0)),
      makeAttempt('seen-today-twice', new Date(2026, 8, 24, 9, 0, 0)),
      makeAttempt('seen-today-twice', new Date(2026, 8, 24, 10, 0, 0)),
      makeAttempt('seen-last-week', new Date(2026, 8, 17, 9, 0, 0)),
    ];

    assert.equal(countNewItemsSeenToday(attempts, now), 1);

    const withSecondToday = [...attempts, makeAttempt('seen-today-once', new Date(2026, 8, 24, 11, 0, 0))];
    assert.equal(countNewItemsSeenToday(withSecondToday, now), 2);
  });

  test('G7: the day-1 seeded due queue avoids triple same-format runs where feasible', () => {
    const queue = SchedulingEngine.getDueQueue(20);
    assert.ok(queue.length > 0, 'expected a non-empty day-1 queue');

    assert.equal(
      hasRunOfThree(queue, (item) => item.item_type),
      false,
      `day-1 queue has three consecutive same formats: ${queue.map((item) => item.item_type).join(', ')}`,
    );

    const twoTierRun = queue
      .map((item) => item.item_type)
      .join(',')
      .includes('two_tier,two_tier,two_tier');
    assert.equal(twoTierRun, false, 'two-tier triple run regression');
  });
});
