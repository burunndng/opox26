import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { selectPlazosDrillItems, selectDuelDrillItems } from '../src/utils/drillSelectors.ts';
import { isPracticeEligible } from '../src/types.ts';
import type { Item, ItemStatus, ErrorLog, ConfusionPair } from '../src/types.ts';

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

function makeError(itemId: string, overrides: Partial<ErrorLog> = {}): ErrorLog {
  return {
    id: `err-${itemId}`,
    attempt_id: `att-${itemId}`,
    item_id: itemId,
    topic_id: 'topic-test',
    error_type_code: 'E6',
    confidence: 2,
    corrective_rule: 'Regla correctiva.',
    legal_basis: 'Art. 1',
    status: 'open',
    next_review_date: '2026-02-01T00:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makePair(id: string, overrides: Partial<ConfusionPair> = {}): ConfusionPair {
  return {
    id,
    concept_a: 'Prescripción',
    concept_b: 'Caducidad',
    discriminating_cue: 'El plazo depende de la actuación de oficio.',
    common_trap: 'Aplicar el plazo general al percibo.',
    legal_basis_a: 'Art. 50 LGSS',
    legal_basis_b: 'Art. 54 LGSS',
    status: 'validated',
    severity: 'high',
    ...overrides,
  };
}

const numericItem = (id: string, overrides: Partial<Item> = {}) =>
  makeItem(id, { cognitive_operations: ['numeric_precision'], ...overrides });

describe('Drill selectors', () => {
  test('D1: plazos drill returns only numeric, practice-eligible items', () => {
    const pool = [
      numericItem('num-ok'),
      makeItem('plain-1'),
      withStatus('num-draft', 'draft', { cognitive_operations: ['numeric_precision'] }),
      withStatus('num-retired', 'retired', { cognitive_operations: ['numeric_precision'] }),
    ];

    const selected = selectPlazosDrillItems(pool);

    assert.deepEqual(selected.map((i) => i.id), ['num-ok']);
    for (const item of selected) {
      assert.ok(isPracticeEligible(item), `ineligible item leaked: ${item.id}`);
    }
  });

  test('D2: plazos drill puts the user own E6 errors first', () => {
    const pool = [
      numericItem('num-clean-1'),
      numericItem('num-clean-2'),
      numericItem('num-missed'),
      numericItem('num-clean-3'),
    ];
    const errors = [makeError('num-missed', { error_type_code: 'E6' })];

    const selected = selectPlazosDrillItems(pool, errors, { count: 4 });

    assert.equal(selected.length, 4);
    assert.equal(selected[0].id, 'num-missed', 'E6 error item must lead the drill');
  });

  test('D3: plazos drill respects count and topic scope', () => {
    const pool = [
      numericItem('scope-a', { topic_id: 'topic-a' }),
      numericItem('scope-b', { topic_id: 'topic-b' }),
      numericItem('scope-a-2', { topic_id: 'topic-a' }),
    ];

    const scoped = selectPlazosDrillItems(pool, [], { count: 5, topicScope: 'topic-a' });
    assert.ok(scoped.every((i) => i.topic_id === 'topic-a'));
    assert.equal(scoped.length, 2);

    const capped = selectPlazosDrillItems(pool, [], { count: 1 });
    assert.equal(capped.length, 1);
  });

  test('D4: plazos drill returns empty when the scope has no numeric candidates', () => {
    const pool = [makeItem('plain-only-1'), makeItem('plain-only-2')];
    assert.deepEqual(selectPlazosDrillItems(pool), []);
  });

  test('D5: duel drill returns only linked, practice-eligible items', () => {
    const pool = [
      makeItem('pair-a1', { confusion_pair_id: 'pair-a' }),
      makeItem('pair-b1', { confusion_pair_id: 'pair-b' }),
      makeItem('unlinked'),
      withStatus('pair-draft', 'draft', { confusion_pair_id: 'pair-a' }),
      withStatus('pair-retired', 'retired', { confusion_pair_id: 'pair-b' }),
    ];

    const selected = selectDuelDrillItems(pool);

    assert.ok(selected.length >= 2, 'expected both linked candidates');
    assert.ok(selected.every((i) => i.confusion_pair_id), 'unlinked item leaked');
    for (const item of selected) {
      assert.ok(isPracticeEligible(item), `ineligible item leaked: ${item.id}`);
    }
  });

  test('D6: duel drill leads with the live-error pair and keeps each pair contiguous', () => {
    const pool = [
      makeItem('cold-a1', { confusion_pair_id: 'pair-cold' }),
      makeItem('cold-a2', { confusion_pair_id: 'pair-cold' }),
      makeItem('live-b1', { confusion_pair_id: 'pair-live' }),
      makeItem('live-b2', { confusion_pair_id: 'pair-live' }),
    ];
    const pairs = [
      makePair('pair-cold', { severity: 'critical' }),
      makePair('pair-live', { severity: 'high' }),
    ];
    const errors = [makeError('live-b1', { error_type_code: 'E5' })];

    const selected = selectDuelDrillItems(pool, errors, pairs, { count: 4 });

    assert.equal(selected.length, 4);
    assert.ok(
      selected.slice(0, 2).every((i) => i.confusion_pair_id === 'pair-live'),
      'pair with the open error must lead the duel',
    );

    const coldIndices = selected
      .map((item, index) => (item.confusion_pair_id === 'pair-cold' ? index : -1))
      .filter((index) => index >= 0);
    const span = Math.max(...coldIndices) - Math.min(...coldIndices);
    assert.equal(span, coldIndices.length - 1, 'same-pair items must be adjacent');
  });

  test('D7: duel drill respects count and topic scope', () => {
    const pool = [
      makeItem('duel-scope-a1', { topic_id: 'topic-a', confusion_pair_id: 'pair-x' }),
      makeItem('duel-scope-a2', { topic_id: 'topic-a', confusion_pair_id: 'pair-x' }),
      makeItem('duel-scope-b1', { topic_id: 'topic-b', confusion_pair_id: 'pair-y' }),
    ];

    const scoped = selectDuelDrillItems(pool, [], [], { count: 10, topicScope: 'topic-a' });
    assert.ok(scoped.every((i) => i.topic_id === 'topic-a'));
    assert.equal(scoped.length, 2);

    assert.equal(selectDuelDrillItems(pool, [], [], { count: 1 }).length, 1);
  });

  test('D8: duel drill returns empty when no item carries a confusion pair', () => {
    assert.deepEqual(selectDuelDrillItems([makeItem('lone-1'), makeItem('lone-2')]), []);
  });

  test('D9: duel drill tops up with concept-confusion traps, never with ineligible items', () => {
    const pool = [
      makeItem('linked-only', { confusion_pair_id: 'pair-solo' }),
      makeItem('trap-topup', { trap_types: ['conceptual_merger'] }),
      withStatus('trap-draft', 'draft', { trap_types: ['conceptual_merger'] }),
    ];

    const selected = selectDuelDrillItems(pool, [], [makePair('pair-solo')], { count: 5 });

    assert.ok(selected.some((i) => i.id === 'linked-only'), 'linked item must come first');
    assert.ok(selected.some((i) => i.id === 'trap-topup'), 'trap-flavoured top-up expected');
    assert.ok(
      selected.every((i) => isPracticeEligible(i)),
      'ineligible item leaked in top-up',
    );
    assert.ok(
      !selected.some((i) => i.id === 'trap-draft'),
      'draft trap item must never be selected',
    );
  });

  test('D10: an over-represented pair cannot swallow the whole drill', () => {
    const floodA = Array.from({ length: 10 }, (_, i) =>
      makeItem(`flood-a${i}`, { confusion_pair_id: 'pair-flood-a' }),
    );
    const floodB = Array.from({ length: 4 }, (_, i) =>
      makeItem(`flood-b${i}`, { confusion_pair_id: 'pair-flood-b' }),
    );
    const pairs = [makePair('pair-flood-a'), makePair('pair-flood-b')];
    // Pair A carries the live error → deterministic leader regardless of tie shuffling.
    const errors = [makeError('flood-a0', { error_type_code: 'E5' })];

    const selected = selectDuelDrillItems([...floodA, ...floodB], errors, pairs, { count: 8 });

    assert.equal(selected.length, 8);
    // Pass 1 caps each pair at max(2, ceil(8/3)) = 3 → A,A,A,B,B,B…
    assert.ok(
      selected.slice(0, 3).every((i) => i.confusion_pair_id === 'pair-flood-a'),
      'first round must come from the leading pair only, up to its cap',
    );
    assert.ok(
      selected.slice(3, 6).every((i) => i.confusion_pair_id === 'pair-flood-b'),
      'the second pair must get its own contiguous round before any overflow',
    );
    // Pass 2 fills the remaining 2 slots from the best pair again.
    assert.ok(
      selected.slice(6).every((i) => i.confusion_pair_id === 'pair-flood-a'),
      'overflow may only happen after every pair was sampled',
    );
    assert.equal(
      selected.filter((i) => i.confusion_pair_id === 'pair-flood-a').length,
      5,
      'the leading pair must not monopolise the session beyond cap + overflow',
    );
  });
});
