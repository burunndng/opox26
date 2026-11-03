import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';
import { evaluateItem } from '../src/scoring/evaluateItem.ts';
import type { Item } from '../src/types.ts';

function findItem(id: string): Item {
  const item = seedItems.find((candidate) => candidate.id === id);
  assert.ok(item, `missing seed item ${id}`);
  return item;
}

describe('Non-MCQ feedback and evaluation', () => {
  test('cloze requires every blank to be correct (not just one)', () => {
    const item = findItem('item-ce-cloze-1');
    const allCorrect = evaluateItem(
      item,
      { clozeInputs: { c1: '3/5', c2: '1/10', c3: '15 días naturales' } },
      2
    );
    const oneWrong = evaluateItem(
      item,
      { clozeInputs: { c1: '2/3', c2: '1/10', c3: '15 días naturales' } },
      2
    );
    assert.equal(allCorrect.correct, true);
    assert.equal(oneWrong.correct, false);
  });

  test('cloze accepts declared synonyms per blank', () => {
    const item = findItem('item-ce-cloze-1');
    const result = evaluateItem(
      item,
      { clozeInputs: { c1: 'tres quintos', c2: 'una décima parte', c3: 'quince días naturales' } },
      2
    );
    assert.equal(result.correct, true);
  });

  test('cloze data keys match every template marker', () => {
    const clozeItems = seedItems.filter((item) => item.item_type === 'cloze');
    for (const item of clozeItems) {
      const template =
        item.cloze_data?.template_text || item.cloze_data?.text_with_clozes || '';
      const markerIds = [...template.matchAll(/\{\{(c\d+)::/g)].map((match) => match[1]);
      const blankIds = (item.cloze_data?.blanks ?? []).map(
        (blank, index) => blank.id ?? `c${(blank.index ?? index) + 1}`
      );
      assert.deepEqual(
        blankIds,
        markerIds,
        `${item.id}: blank ids must match template markers`
      );
    }
  });

  test('contrast cards are keyed to a concept and evaluate both branches', () => {
    const item = findItem('item-ce-contrast-1');
    assert.equal(item.correct_answer, 'A');
    assert.equal(evaluateItem(item, { selectedOption: 'A' }, 2).correct, true);
    assert.equal(evaluateItem(item, { selectedOption: 'B' }, 2).correct, false);

    const t7 = findItem('item-contrast-1');
    assert.equal(t7.contrast_data?.mini_case_answer, 'B');
    assert.equal(evaluateItem(t7, { selectedOption: 'B' }, 2).correct, true);
  });

  test('number sort requires every pair to match', () => {
    const item = findItem('item-ce-sort-1');
    const matches = Object.fromEntries(
      (item.number_sort_data?.items ?? []).map((pair) => [pair.id, pair.correct_value])
    );
    assert.equal(evaluateItem(item, { numberSortMatches: matches }, 2).correct, true);
    assert.equal(
      evaluateItem(item, { numberSortMatches: { ...matches, '1': '1834' } }, 2).correct,
      false
    );
  });

  test('spot-error items expose and evaluate the planted erroneous span', () => {
    const item = findItem('item-ce-spot-1');
    const span = item.spot_error_data?.erroneous_span;
    assert.ok(span);
    assert.equal(evaluateItem(item, { spotSelectedSpanId: span }, 2).correct, true);
  });

  test('two-tier items require the tier-2 justification', () => {
    const item = findItem('item-ce-twotier-1');
    assert.equal(evaluateItem(item, { selectedOption: 'A', userReasoning: 'A' }, 2).correct, true);
    const luckyGuess = evaluateItem(item, { selectedOption: 'A', userReasoning: 'C' }, 2);
    assert.equal(luckyGuess.correct, false);
    assert.equal(luckyGuess.errorCode, 'E7');
  });

  test('fact-variant items evaluate the changed-fact outcome', () => {
    const item = findItem('item-ce-variant-1');
    assert.equal(item.correct_answer, 'A');
    assert.equal(evaluateItem(item, { selectedOption: 'A' }, 2).correct, true);
    assert.equal(evaluateItem(item, { selectedOption: 'B' }, 2).correct, false);
  });

  test('free-text retrieval_prompt scores generatedAnswer via generative match', () => {
    const item = seedItemsRetrieval.find((candidate) => candidate.item_type === 'retrieval_prompt');
    assert.ok(item, 'no free-text retrieval_prompt in seed');
    const target = item.rule_statement;
    assert.ok(target, 'seed retrieval item lacks rule_statement');
    assert.equal(evaluateItem(item, { generatedAnswer: target }, 2).correct, true);
    assert.equal(
      evaluateItem(item, { generatedAnswer: target }, 2).generativeMatch,
      true
    );
    assert.equal(
      evaluateItem(item, { generatedAnswer: 'zzzz qqqq' }, 2).correct,
      false
    );
  });

  test('free-text retrieval with confidence 3 and a miss is E8 confident-wrong', () => {
    const item = seedItemsRetrieval.find((candidate) => candidate.item_type === 'retrieval_prompt');
    assert.ok(item);
    const wrong = evaluateItem(item, { generatedAnswer: 'zzzz qqqq' }, 3);
    assert.equal(wrong.correct, false);
    assert.equal(wrong.errorCode, 'E8');
    assert.equal(wrong.cognitiveState, 'confident_misconception');
  });

  test('free-text pretest_item scores generatedAnswer', () => {
    const item = seedItemsRetrieval.find((candidate) => candidate.item_type === 'pretest_item');
    assert.ok(item, 'no free-text pretest_item in seed');
    const target = item.rule_statement;
    assert.ok(target);
    assert.equal(evaluateItem(item, { generatedAnswer: target }, 2).correct, true);
    assert.equal(
      evaluateItem(item, { generatedAnswer: 'zzzz qqqq' }, 1).correct,
      false
    );
    assert.equal(
      evaluateItem(item, { generatedAnswer: 'zzzz qqqq' }, 1).expectedDisplay,
      item.correct_answer || item.rule_statement
    );
  });

  test('cover-and-generate receives generatedAnswer for the pre-reveal match', () => {
    // Regression: the runner records generated_answer_before_options but never
    // passed it to evaluateItem, so generativeMatch was always false.
    const item = findItem('item-mcq-1');
    const correctText = item.options?.find((option) => option.is_correct)?.text;
    assert.ok(correctText, 'item-mcq-1 lacks a correct option text');
    assert.equal(
      evaluateItem(item, { selectedOption: 'A', generatedAnswer: correctText! }, 2)
        .cognitiveState,
      'mastered'
    );
    // No generative text -> lucky_recognition (unchanged legacy behavior).
    assert.equal(
      evaluateItem(item, { selectedOption: 'A' }, 2).cognitiveState,
      'lucky_recognition'
    );
    assert.equal(
      evaluateItem(item, { selectedOption: 'A', generatedAnswer: 'zzzz qqqq' }, 2)
        .cognitiveState,
      'lucky_recognition'
    );
  });
});
