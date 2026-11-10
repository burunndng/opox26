import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsTema15Extra, seedItemsTema16Extra2 } from '../server/seedDataTema15Extra.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

/**
 * Tema 15/16 general (bloque general) bank integrity.
 *
 * The official "Tema 15 general" temario (acto administrativo, validez,
 * órganos) is split internally into two topics: `topic_tema15` (Ley 40/2015)
 * and `topic_tema16` (Ley 39/2015). Both are audited against the source
 * folder `GENERAL/Tema  15  general` plus the 28-10 pt1 / pt2 class
 * summaries. This suite guards the two banks against regressions.
 */

const TEMA15 = 'topic_tema15';
const TEMA16 = 'topic_tema16';

const tema15 = seedItems.filter((item) => item.topic_id === TEMA15);
const tema16 = seedItems.filter((item) => item.topic_id === TEMA16);
const combined = [...tema15, ...tema16];

const standardMcqTypes = new Set<Item['item_type']>(['cover_and_generate_mcq', 'pretest_item']);
const isMcq = (item: Item) => standardMcqTypes.has(item.item_type) && (item.options?.length ?? 0) > 0;

function keyCounts(items: Item[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item.correct_answer ?? '?';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function longestKeyRun(items: Item[]): { key: string; length: number; at: string } {
  let best = { key: '', length: 0, at: '' };
  let run = 0;
  let previous = '';
  for (const item of items) {
    const key = item.correct_answer ?? '';
    run = key === previous ? run + 1 : 1;
    previous = key;
    if (run > best.length) best = { key, length: run, at: item.id };
  }
  return best;
}

describe('Tema 15/16 general bank integrity', () => {
  test('B1: both régimen jurídico topics are populated with the audited counts', () => {
    assert.equal(tema15.length, 76, 'Tema 15 (Ley 40/2015) must hold 76 items');
    assert.equal(tema16.length, 69, 'Tema 16 (Ley 39/2015) must hold 69 items');
  });

  test('B2: every item of both banks is uniquely identified with a contiguous id series', () => {
    const ids = combined.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate item ids');

    const numbers = ids
      .map((id) => Number(id.split('-').pop()))
      .sort((a, b) => a - b);
    assert.equal(numbers[0], 1, 'the series must start at item-t15-1');
    assert.equal(numbers[numbers.length - 1], combined.length, 'the series must be contiguous');
    numbers.forEach((value, index) => {
      assert.equal(value, index + 1, `gap in the item id series at position ${index + 1}`);
    });
  });

  test('B3: every item has four options and exactly one keyed answer', () => {
    for (const item of combined) {
      const options = item.options ?? [];
      assert.equal(options.length, 4, `${item.id} must have 4 options`);
      const correct = options.filter((option) => option.is_correct);
      assert.equal(correct.length, 1, `${item.id} must have exactly one correct option`);
      assert.equal(item.correct_answer, correct[0].id, `${item.id} key must match the flagged option`);
    }
  });

  test('B4: every item states a rule, an application and a legal anchor', () => {
    for (const item of combined) {
      assert.ok(item.stem?.trim(), `${item.id} needs a stem`);
      assert.ok(item.rule_statement?.trim(), `${item.id} needs rule_statement`);
      assert.ok(item.legal_basis?.trim(), `${item.id} needs legal_basis`);
    }
  });

  test('B5: no stem leaks its own keyed answer', () => {
    for (const item of combined) {
      const leak = detectAnswerInStem(item as Partial<Item>);
      assert.equal(
        leak.detected,
        false,
        `${item.id} leaks ${JSON.stringify(leak.leakedPhrases)} into the stem`,
      );
    }
  });

  test('B6: no option text carries stray non-Latin characters', () => {
    const stray = /[\u3040-\u30ff\u4e00-\u9fff\uf900-\ufaff]/;
    for (const item of combined) {
      const texts = [item.stem, item.rule_statement, item.why_correct, item.corrective_rule];
      for (const option of item.options ?? []) {
        texts.push(option.text, option.explanation ?? '', option.condition_if_correct ?? '');
      }
      for (const text of texts) {
        if (!text) continue;
        assert.ok(!stray.test(text), `${item.id} contains a stray character: ${text.slice(0, 60)}`);
      }
    }
  });

  test('B7: every distractor carries an explanation and a trap type', () => {
    for (const item of combined) {
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      for (const option of distractors) {
        assert.ok(option.explanation?.trim(), `${item.id} option ${option.id} needs an explanation`);
        assert.ok(option.trap_type, `${item.id} option ${option.id} needs a trap_type`);
      }
    }
  });

  test('B7b: the new batches use a distinct trap type per distractor', () => {
    for (const item of [...seedItemsTema15Extra, ...seedItemsTema16Extra2]) {
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      const trapTypes = new Set(distractors.map((option) => option.trap_type));
      assert.equal(
        trapTypes.size,
        distractors.length,
        `${item.id} must use a distinct trap type per distractor`,
      );
    }
  });

  test('B8: no keyed answer is over 1.25x the mean distractor length', () => {
    for (const item of combined) {
      const options = item.options ?? [];
      const correct = options.filter((option) => option.is_correct);
      const distractors = options.filter((option) => !option.is_correct);
      if (correct.length !== 1 || distractors.length === 0) continue;

      const correctLength = correct[0].text.trim().length;
      const meanDistractorLength =
        distractors.reduce((total, option) => total + option.text.trim().length, 0) /
        distractors.length;
      assert.ok(
        correctLength <= meanDistractorLength * 1.25,
        `${item.id} correct option is ${correctLength} chars vs mean distractor ${meanDistractorLength.toFixed(1)}`,
      );
    }
  });

  test('B9: the answered key stays balanced across the two banks', () => {
    const counts = keyCounts(combined);
    const total = combined.length;
    for (const [key, count] of Object.entries(counts)) {
      assert.ok(
        count <= total * 0.4,
        `key ${key} is over-represented in the combined bank: ${count}/${total}`,
      );
    }

    const newCounts = keyCounts([...seedItemsTema15Extra, ...seedItemsTema16Extra2]);
    assert.deepEqual(newCounts, { A: 13, B: 13, C: 13, D: 12 });
  });

  test('B10: no run of three identical keys inside the new batches', () => {
    for (const batch of [seedItemsTema15Extra, seedItemsTema16Extra2]) {
      const run = longestKeyRun(batch);
      assert.ok(run.length <= 2, `run of ${run.length} key ${run.key} starting at ${run.at}`);
    }
  });

  test('B11: each item is anchored to the law of its own topic', () => {
    for (const item of tema15) {
      const legal = item.legal_basis ?? '';
      assert.ok(
        !/39\/2015|203\/2021/.test(legal),
        `${item.id} [${legal}] belongs to Tema 16, not Tema 15`,
      );
    }
    for (const item of tema16) {
      const legal = item.legal_basis ?? '';
      assert.ok(
        /39\/2015|203\/2021/.test(legal),
        `${item.id} [${legal}] should be anchored to Ley 39/2015 or RD 203/2021`,
      );
    }
  });

  test('B12: the new batches keep the documented ids and topic placement', () => {
    assert.equal(seedItemsTema15Extra.length, 40);
    assert.equal(seedItemsTema16Extra2.length, 11);
    assert.equal(
      seedItemsTema15Extra[0].id,
      'item-t15-95',
      'the new Tema 15 batch must continue the id series',
    );
    assert.equal(
      seedItemsTema16Extra2[seedItemsTema16Extra2.length - 1].id,
      'item-t15-145',
      'the new Tema 16 batch must close the id series',
    );
    for (const item of seedItemsTema15Extra) {
      assert.equal(item.topic_id, TEMA15, `${item.id} must live in topic_tema15`);
    }
    for (const item of seedItemsTema16Extra2) {
      assert.equal(item.topic_id, TEMA16, `${item.id} must live in topic_tema16`);
    }
  });
});
