import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { eligibleForPractice, buildPretestPool } from '../src/utils/practicePools.ts';
import { selectSniperItems } from '../src/utils/sniperFilter.ts';
import { isPracticeEligible } from '../src/types.ts';
import type { Item, ItemStatus } from '../src/types.ts';

function makeItem(id: string, overrides: Partial<Item> = {}): Item {
  return {
    id,
    topic_id: 'topic-test',
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

function withStatus(id: string, status: ItemStatus, overrides: Partial<Item> = {}): Item {
  return makeItem(id, { status, ...overrides });
}

describe('Practice pools', () => {
  test('P1: drafts, needs-review, and retired items are excluded', () => {
    const pool = [
      makeItem('eligible-validated', { status: 'validated' }),
      makeItem('eligible-active', { status: 'active' }),
      withStatus('draft-item', 'draft'),
      withStatus('needs-review-item', 'needs_review'),
      withStatus('retired-item', 'retired'),
    ];

    const eligible = eligibleForPractice(pool);
    assert.deepEqual(
      eligible.map((item) => item.id),
      ['eligible-validated', 'eligible-active'],
    );

    const pretestPool = buildPretestPool(pool);
    for (const item of pretestPool) {
      assert.ok(isPracticeEligible(item), `ineligible item leaked: ${item.id}`);
    }
  });

  test('P2: pretest items come first', () => {
    const pool = [
      makeItem('normal-1', { cluster_id: 'cluster-1' }),
      makeItem('normal-2', { cluster_id: 'cluster-2' }),
      makeItem('pretest-1', { item_type: 'pretest_item', cluster_id: 'cluster-1' }),
      makeItem('pretest-2', { item_type: 'pretest_item', cluster_id: 'cluster-2' }),
    ];

    const result = buildPretestPool(pool, 10);
    const firstNonPretest = result.findIndex((item) => item.item_type !== 'pretest_item');
    const pretestCount = result.filter((item) => item.item_type === 'pretest_item').length;

    assert.equal(pretestCount, 2);
    if (firstNonPretest >= 0) {
      assert.ok(
        firstNonPretest >= pretestCount,
        `pretest items must precede others, got order: ${result.map((item) => item.id).join(', ')}`,
      );
    }
    assert.deepEqual(result.slice(0, 2).map((item) => item.id).sort(), ['pretest-1', 'pretest-2']);
  });

  test('P3: cluster spread covers at least min(4, distinct clusters)', () => {
    const pool = Array.from({ length: 8 }, (_, index) =>
      makeItem(`spread-${index}`, { cluster_id: `cluster-${index % 5}` }),
    );

    const result = buildPretestPool(pool, 8);
    const distinctClusters = new Set(result.map((item) => item.cluster_id)).size;

    assert.ok(result.length >= 4, `expected at least 4 items, received ${result.length}`);
    assert.ok(
      distinctClusters >= Math.min(4, 5),
      `expected >= 4 clusters, received ${distinctClusters}`,
    );
  });

  test('P4: the pool never exceeds the requested count', () => {
    const pool = Array.from({ length: 20 }, (_, index) =>
      makeItem(`cap-${index}`, { cluster_id: `cluster-${index % 4}` }),
    );

    assert.equal(buildPretestPool(pool, 7).length, 7);
    assert.equal(buildPretestPool(pool, 0).length, 0);
  });

  test('P5: sniper selection never returns ineligible items', () => {
    const pool = [
      makeItem('sniper-eligible', { cognitive_operations: ['numeric_precision'] }),
      withStatus('sniper-draft', 'draft', { cognitive_operations: ['numeric_precision'] }),
      withStatus('sniper-retired', 'retired', { cognitive_operations: ['numeric_precision'] }),
      withStatus('sniper-review', 'needs_review', { cognitive_operations: ['numeric_precision'] }),
    ];

    const selected = selectSniperItems(pool, [], { subType: 'mixed', count: 10 });

    assert.ok(selected.length > 0, 'expected the eligible sniper candidate');
    for (const item of selected) {
      assert.ok(isPracticeEligible(item), `ineligible sniper item leaked: ${item.id}`);
    }
  });

  test('P6: repair selection filtered through eligibleForPractice never returns ineligible items', () => {
    const pool = [
      makeItem('repair-eligible', { status: 'active' }),
      withStatus('repair-draft', 'draft'),
      withStatus('repair-review', 'needs_review'),
    ];
    const requestedIds = ['repair-eligible', 'repair-draft', 'repair-review'];

    const repairItems = eligibleForPractice(pool).filter((item) => requestedIds.includes(item.id));

    assert.deepEqual(
      repairItems.map((item) => item.id),
      ['repair-eligible'],
    );
    for (const item of repairItems) {
      assert.ok(isPracticeEligible(item), `ineligible repair item leaked: ${item.id}`);
    }
  });
});
