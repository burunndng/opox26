import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getCriticalItemErrors, promotionGatePayload } from '../server/validationWarnings.ts';
import { seedItems } from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';
import type { Item, MCQOption } from '../src/types.ts';

/**
 * Promotion quality gate (P3-c).
 *
 * `getCriticalItemErrors` is the pure core of the POST/PUT /api/items gate:
 * routes respond 422 `{ error, warnings }` when a `validated`/`active`
 * promotion arrives with any listed critical failure, and pass through for
 * draft/dead statuses or clean items. The ItemBank UI likewise blocks its
 * "Validar" button using the critical-severity subset of the
 * validation-warnings payload, so both sides read the same rule set.
 */

const mcq = seedItems.find(
  (item) => item.item_type === 'cover_and_generate_mcq' && item.options?.length === 4,
)!;

function rulesFor(item: Item): string[] {
  return getCriticalItemErrors(item).map((warning) => warning.rule);
}

function stripCorrectness(options: MCQOption[]): MCQOption[] {
  return options.map((option) => ({ ...option, is_correct: false }));
}

describe('Item promotion quality gate', () => {
  test('W1: a validated/active item without legal basis is blocked with missing_legal_basis', () => {
    const item: Item = { ...mcq, id: 'gate-no-legal', legal_basis: ' ' };

    assert.ok(rulesFor(item).includes('missing_legal_basis'));
  });

  test('W2: an MCQ with zero correct options and one with too few options are both blocked', () => {
    const noCorrect: Item = { ...mcq, id: 'gate-no-correct', options: stripCorrectness(mcq.options!) };
    assert.ok(rulesFor(noCorrect).includes('missing_correct_answer'));

    const fewOptions: Item = { ...mcq, id: 'gate-few-options', options: mcq.options!.slice(0, 2) };
    const fewRules = rulesFor(fewOptions);
    assert.ok(fewRules.includes('insufficient_options'));
    assert.ok(!fewRules.includes('missing_correct_answer'), 'two correct options remain present');
  });

  test('W3: multiple correct options and duplicated option ids are blocked', () => {
    const multiCorrect: Item = {
      ...mcq,
      id: 'gate-multi-correct',
      options: mcq.options!.map((option, index) => ({
        ...option,
        is_correct: index === 0 || index === 2,
      })),
    };
    assert.ok(rulesFor(multiCorrect).includes('multiple_correct_options'));

    const duplicated: Item = {
      ...mcq,
      id: 'gate-duplicate-ids',
      options: mcq.options!.map((option, index) =>
        index === 0 ? { ...option, id: mcq.options![1].id } : option,
      ),
    };
    assert.ok(rulesFor(duplicated).includes('duplicate_option_ids'));
  });

  test('W4: a clean seed item has zero critical errors (passes the gate)', () => {
    assert.deepEqual(getCriticalItemErrors(mcq), []);
  });

  test('W5: the whole seed bank stays under zero critical errors', () => {
    // Guards the promotion gate against banks whose seeds could never leave
    // draft; complements seed-integrity F1–F10 with the full validation view.
    const critical = [...seedItems, ...seedItemsRetrieval].flatMap((item) =>
      getCriticalItemErrors(item).map((warning) => `${item.id}/${warning.rule}`),
    );

    assert.deepEqual(critical, [], `Seed items with critical warnings:\n${critical.join('\n')}`);
  });

  test('W6: promotionGatePayload blocks active/validated promotions with critical warnings, but passes draft/retired', () => {
    const invalidItem: Item = { ...mcq, id: 'gate-invalid-draft', legal_basis: '' };

    // With status 'draft' or 'retired', gate returns null (not blocked)
    assert.equal(promotionGatePayload({ ...invalidItem, status: 'draft' }), null);
    assert.equal(promotionGatePayload({ ...invalidItem, status: 'retired' as any }), null);
    assert.equal(promotionGatePayload({ ...invalidItem, status: undefined }), null);

    // With status 'active' or 'validated', gate returns error payload
    const activeGate = promotionGatePayload({ ...invalidItem, status: 'active' });
    assert.notEqual(activeGate, null);
    assert.ok(activeGate!.warnings.some((w) => w.rule === 'missing_legal_basis'));

    const validatedGate = promotionGatePayload({ ...invalidItem, status: 'validated' });
    assert.notEqual(validatedGate, null);
    assert.ok(validatedGate!.warnings.some((w) => w.rule === 'missing_legal_basis'));
  });

  test('W7: promotionGatePayload permits valid items to become active or validated', () => {
    assert.equal(promotionGatePayload({ ...mcq, status: 'active' }), null);
    assert.equal(promotionGatePayload({ ...mcq, status: 'validated' }), null);
  });
});
