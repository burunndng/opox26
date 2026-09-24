import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  optionIdAtPosition,
  optionOrderSeed,
  orderOptions,
} from '../src/utils/optionOrder.ts';
import { evaluateItem } from '../src/scoring/evaluateItem.ts';
import type { Item, MCQOption } from '../src/types.ts';

const options: MCQOption[] = [
  { id: 'stable-a', text: 'Distractor uno', is_correct: false },
  { id: 'stable-b', text: 'Respuesta correcta', is_correct: true },
  { id: 'stable-c', text: 'Distractor dos', is_correct: false },
  { id: 'stable-d', text: 'Distractor tres', is_correct: false },
];

const item: Item = {
  id: 'item-option-order-test',
  topic_id: 'topic-option-order-test',
  item_type: 'cover_and_generate_mcq',
  stem: '¿Cuál es la respuesta correcta?',
  options,
  correct_answer: 'stable-b',
  legal_basis: 'Art. 1',
  rule_statement: 'Regla de prueba.',
  why_correct: 'Explicación de prueba.',
  corrective_rule: 'Regla correctiva.',
  difficulty: 1,
  cognitive_operations: ['micro_discrimination'],
  status: 'validated',
  source: 'manual',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('Deterministic option ordering', () => {
  test('O1: same seed gives the same order without mutating the source options', () => {
    const originalIds = options.map((option) => option.id);
    const first = orderOptions(options, 42);
    const second = orderOptions(options, 42);

    assert.deepEqual(first, second);
    assert.deepEqual(options.map((option) => option.id), originalIds);
  });

  test('O2: encounter seeds produce multiple orders for one four-option item', () => {
    const orders = new Set(
      Array.from({ length: 10 }, (_, encounter) =>
        orderOptions(options, optionOrderSeed(item.id, encounter))
          .map((option) => option.id)
          .join(','),
      ),
    );

    assert.ok(orders.size >= 3, `expected at least 3 orders, received ${orders.size}`);
  });

  test('O3: scoring still finds the correct option by stable ID after reordering', () => {
    const ordered = orderOptions(options, optionOrderSeed(item.id, 7));
    const result = evaluateItem({ ...item, options: ordered }, { selectedOption: 'stable-b' }, 2);

    assert.equal(result.correct, true);
  });

  test('O4: the correct option is not always displayed first', () => {
    const correctPositions = Array.from({ length: 100 }, (_, encounter) => {
      const ordered = orderOptions(options, optionOrderSeed(item.id, encounter));
      return ordered.findIndex((option) => option.is_correct);
    });

    assert.ok(correctPositions.some((position) => position > 0));
  });

  test('O5: each visible shortcut position maps to that position’s stable option ID', () => {
    const ordered = orderOptions(options, optionOrderSeed(item.id, 3));

    for (let position = 0; position < ordered.length; position++) {
      assert.equal(optionIdAtPosition(ordered, position), ordered[position].id);
    }
    assert.equal(optionIdAtPosition(ordered, -1), undefined);
    assert.equal(optionIdAtPosition(ordered, ordered.length), undefined);
  });
});
