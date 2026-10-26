import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateItem } from '../src/scoring/evaluateItem.ts';
import type { Item } from '../src/types.ts';

/**
 * Scorer hardening regression suite (audit 2026-10-23).
 *
 * Encodes the spec §9.4 / §18 semantics: cloze accepts exact answers and
 * synonyms after normalization — NOT arbitrary substrings; spot-the-error
 * requires an actual selection; number-sort comparisons are accent/case
 * insensitive like the rest of the scorer.
 */

const base = {
  id: 'probe',
  topic_id: 'topic-audit',
  stem: 'Probe',
  legal_basis: '',
  rule_statement: '',
  why_correct: '',
  status: 'active',
  source: 'manual',
  created_at: '',
  updated_at: '',
} as unknown as Item;

describe('Scorer hardening — cloze', () => {
  const multiBlanks = {
    ...base,
    item_type: 'cloze',
    cloze_data: {
      template_text: 'La {{c1::prescripción}} opera a los {{c2::5 años}}.',
      blanks: [
        { id: 'c1', correct_answer: 'prescripción', synonyms: ['caducidad'] },
        { id: 'c2', correct_answer: '5 años', synonyms: [] },
      ],
    },
  } as unknown as Item;

  test('rejects a 3-char fragment of the expected answer', () => {
    const result = evaluateItem(multiBlanks, { clozeInputs: { c1: 'presc', c2: '5 años' } }, 1);
    assert.equal(result.correct, false, '"presc" must not satisfy "prescripción"');
  });

  test('accepts the exact answer and synonym, accent/case insensitive', () => {
    assert.equal(evaluateItem(multiBlanks, { clozeInputs: { c1: 'PRESCRIPCION', c2: '5 AÑOS' } }, 1).correct, true);
    assert.equal(evaluateItem(multiBlanks, { clozeInputs: { c1: 'caducidad', c2: '5 años' } }, 1).correct, true);
  });

  test('requires every blank to be correct (no partial credit)', () => {
    const result = evaluateItem(multiBlanks, { clozeInputs: { c1: 'prescripción', c2: '4 años' } }, 1);
    assert.equal(result.correct, false);
  });

  test('legacy single-input path also rejects fragments', () => {
    const legacy = { ...base, item_type: 'cloze', correct_answer: 'retroactividad' } as unknown as Item;
    assert.equal(evaluateItem(legacy, { clozeInput: 'retro' }, 1).correct, false, '"retro" must not satisfy "retroactividad"');
    assert.equal(evaluateItem(legacy, { clozeInput: 'Retroactividad' }, 1).correct, true);
  });
});

describe('Scorer hardening — spot_the_error', () => {
  const spot = {
    ...base,
    item_type: 'spot_error',
    spot_error_data: { erroneous_span: 'plazo de 10 días', corrected_text: 'plazo de 30 días' },
  } as unknown as Item;

  test('empty or absent selection must NOT be correct', () => {
    assert.equal(evaluateItem(spot, {}, 2).correct, false);
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: null }, 2).correct, false);
    assert.equal(evaluateItem(spot, { selectedOption: 'A' }, 2).correct, false, 'keyboard-only selection must not pass');
  });

  test('trivial 1-char selection must NOT be correct', () => {
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: 'a' }, 2).correct, false);
  });

  test('correct span, span chunk, or sub-span is correct', () => {
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: 'plazo de 10 días' }, 2).correct, true);
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: 'ver plazo de 10 días ahora' }, 2).correct, true);
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: 'de 10 días' }, 2).correct, true);
  });

  test('wrong span is incorrect', () => {
    assert.equal(evaluateItem(spot, { spotSelectedSpanId: 'retroactividad plena' }, 2).correct, false);
  });
});

describe('Scorer hardening — number_sort', () => {
  const sort = {
    ...base,
    item_type: 'number_sort',
    number_sort_data: { items: [{ id: 'i1', concept: 'Plazo', correct_value: '30 días' }] },
  } as unknown as Item;

  test('accepts accent-insensitive input and rejects wrong values', () => {
    assert.equal(evaluateItem(sort, { numberSortMatches: { i1: '30 dias' } }, 1).correct, true);
    assert.equal(evaluateItem(sort, { numberSortMatches: { i1: '30 días' } }, 1).correct, true);
    assert.equal(evaluateItem(sort, { numberSortMatches: { i1: '31 dias' } }, 1).correct, false);
    assert.equal(evaluateItem(sort, { numberSortMatches: {} }, 1).correct, false);
  });
});

describe('Scorer hardening — errorCode hygiene', () => {
  test('successful attempts must not carry a failure error code', () => {
    const mcq = { ...base, item_type: 'cover_and_generate_mcq', correct_answer: 'B', options: [{ id: 'B', text: 'ok', is_correct: true }, { id: 'A', text: 'no', is_correct: false }] } as unknown as Item;
    const ok = evaluateItem(mcq, { selectedOption: 'B' }, 1);
    assert.equal(ok.correct, true);
    assert.equal(ok.errorCode, undefined, 'correct answers must not be tagged E1/E8');

    const cloze = { ...base, item_type: 'cloze', correct_answer: 'retroactividad' } as unknown as Item;
    assert.equal(evaluateItem(cloze, { clozeInput: 'retroactividad' }, 3).errorCode, undefined);
  });

  test('failure codes keep their semantics', () => {
    const mcq = { ...base, item_type: 'cover_and_generate_mcq', correct_answer: 'B', options: [{ id: 'B', text: 'ok', is_correct: true }] } as unknown as Item;
    assert.equal(evaluateItem(mcq, { selectedOption: 'A' }, 1).errorCode, 'E1');
    assert.equal(evaluateItem(mcq, { selectedOption: 'A' }, 3).errorCode, 'E8');
    assert.equal(evaluateItem(mcq, { blank: true }, 0).errorCode, 'E9');
  });
});
