import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsTema3Parte3 } from '../server/seedDataTema3.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

/**
 * Tema 3 específico ("La afiliación y la inscripción a la Seguridad Social")
 * bank integrity.
 *
 * The bank was built in three batches: the legacy seed (items 1-49), the
 * 9-11 class gap audit (`seedItemsTema3Extras` + `seedItemsTema3Parte2`,
 * items 50-61) and the 2026-11-11 "actos indebidos + devolución de cuotas"
 * gap audit (`seedItemsTema3Parte3`, items 62-69, arts. 57-62 RIA), which
 * closed the Tier B headliner in `docs/CONTENT-COVERAGE.md`.
 *
 * NOTE: `correct_answer` is the stable option id, and `buildMcq` gives every
 * Tema 3 item the id `A` for its correct option — the *display position* is
 * assigned by `rebalanceCanonicalMcqOptions`'s canonical cycle. Balance
 * guards here therefore assert on positions, not on key letters.
 */

const TOPIC = 'topic_seguridad_social_tema_3';

const tema3 = seedItems.filter((item) => item.topic_id === TOPIC);

// Read the batch from `seedItems`, not from the raw export: the export holds the
// pre-rebalance order (every correct option first), while `seedItems` holds the
// canonical display order this suite must guard.
const batchIds = new Set(seedItemsTema3Parte3.map((item) => item.id));
const batch = seedItems.filter((item) => batchIds.has(item.id));

const standardMcqTypes = new Set<Item['item_type']>(['cover_and_generate_mcq', 'pretest_item']);
const isMcq = (item: Item) => standardMcqTypes.has(item.item_type) && (item.options?.length ?? 0) > 0;

function positionOf(item: Item): number {
  return (item.options ?? []).findIndex((option) => option.is_correct);
}

function positionCounts(items: Item[]): Record<number, number> {
  return items.reduce<Record<number, number>>((acc, item) => {
    const position = positionOf(item);
    acc[position] = (acc[position] ?? 0) + 1;
    return acc;
  }, {});
}

function longestPositionRun(items: Item[]): { position: number; length: number; at: string } {
  let best = { position: -1, length: 0, at: '' };
  let run = 0;
  let previous = -2;
  for (const item of items) {
    const position = positionOf(item);
    run = position === previous ? run + 1 : 1;
    previous = position;
    if (run > best.length) best = { position, length: run, at: item.id };
  }
  return best;
}

describe('Tema 3 específico bank integrity', () => {
  test('T1: the bank holds the audited 69 items and the Parte 3 batch the documented 8', () => {
    assert.equal(tema3.length, 69, 'Tema 3 must hold 69 items after the actos-indebidos batch');
    assert.equal(batch.length, 8, 'seedItemsTema3Parte3 must hold 8 items');
  });

  test('T2: every item is uniquely identified with a contiguous id series 1-69', () => {
    const ids = tema3.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate item ids');

    const numbers = ids
      .map((id) => Number(id.split('-').pop()))
      .sort((a, b) => a - b);
    assert.equal(numbers[0], 1, 'the series must start at item-t3-1');
    assert.equal(numbers[numbers.length - 1], 69, 'the series must end at item-t3-69');
    numbers.forEach((value, index) => {
      assert.equal(value, index + 1, `gap in the item id series at position ${index + 1}`);
    });
  });

  test('T3: every item has four options and exactly one keyed answer', () => {
    for (const item of tema3) {
      const options = item.options ?? [];
      assert.equal(options.length, 4, `${item.id} must have 4 options`);
      const correct = options.filter((option) => option.is_correct);
      assert.equal(correct.length, 1, `${item.id} must have exactly one correct option`);
      assert.equal(item.correct_answer, correct[0].id, `${item.id} key must match the flagged option`);
    }
  });

  test('T4: every item states a rule, an application and a legal anchor', () => {
    for (const item of tema3) {
      assert.ok(item.stem?.trim(), `${item.id} needs a stem`);
      assert.ok(item.rule_statement?.trim(), `${item.id} needs rule_statement`);
      assert.ok(item.legal_basis?.trim(), `${item.id} needs legal_basis`);
    }
  });

  test('T5: no stem leaks its own keyed answer', () => {
    for (const item of tema3) {
      const leak = detectAnswerInStem(item as Partial<Item>);
      assert.equal(
        leak.detected,
        false,
        `${item.id} leaks ${JSON.stringify(leak.leakedPhrases)} into the stem`,
      );
    }
  });

  test('T6: no stem or option carries stray non-Latin characters', () => {
    const stray = /[\u3040-\u30ff\u4e00-\u9fff\uf900-\ufaff]/;
    for (const item of tema3) {
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

  test('T7: every distractor carries an explanation and a trap type', () => {
    for (const item of tema3) {
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      for (const option of distractors) {
        assert.ok(option.explanation?.trim(), `${item.id} option ${option.id} needs an explanation`);
        assert.ok(option.trap_type, `${item.id} option ${option.id} needs a trap_type`);
      }
    }
  });

  test('T7b: the Parte 3 batch uses a distinct trap type per distractor', () => {
    for (const item of batch) {
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      const trapTypes = new Set(distractors.map((option) => option.trap_type));
      assert.equal(
        trapTypes.size,
        distractors.length,
        `${item.id} must use a distinct trap type per distractor`,
      );
    }
  });

  test('T8: no keyed answer is over 1.25x the mean distractor length', () => {
    for (const item of tema3) {
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

  test('T9: the canonical display position stays balanced across the bank and the batch', () => {
    const counts = positionCounts(tema3);
    for (const [position, count] of Object.entries(counts)) {
      assert.ok(
        count <= tema3.length * 0.4,
        `display position ${position} is over-represented: ${count}/${tema3.length}`,
      );
    }

    // The canonical cycle is deterministic for an append-only bank: the 8 new
    // MCQs must land on positions 2,0,2,1,3,0,1,3 (cycle slice), two per slot.
    const batchCounts = positionCounts(batch);
    assert.deepEqual(batchCounts, { 0: 2, 1: 2, 2: 2, 3: 2 });
  });

  test('T10: no run of three identical display positions inside the Parte 3 batch', () => {
    const run = longestPositionRun(batch);
    assert.ok(
      run.length <= 2,
      `run of ${run.length} display position ${run.position} starting at ${run.at}`,
    );
  });

  test('T11: the Parte 3 batch is anchored to the RIA effects articles and its own cluster', () => {
    for (const item of batch) {
      assert.equal(item.topic_id, TOPIC, `${item.id} must live in the Tema 3 topic`);
      assert.equal(
        item.cluster_id,
        'cluster_actos_indebidos_impugnaciones',
        `${item.id} must belong to the actos indebidos cluster`,
      );
      assert.ok(
        /Art\. (5[7-9]|6[0-3])/.test(item.legal_basis ?? ''),
        `${item.id} [${item.legal_basis}] must anchor to RIA arts. 57-63`,
      );
      assert.equal(item.status, 'validated', `${item.id} must be practice-eligible`);
      assert.equal(isMcq(item), true, `${item.id} must be a standard MCQ`);
    }
  });

  test('T12: the Parte 3 batch continues the id series and is appended last in seedItems', () => {
    assert.equal(batch[0].id, 'item-t3-62', 'the batch must continue the id series at 62');
    assert.equal(batch[batch.length - 1].id, 'item-t3-69', 'the batch must close the id series at 69');

    const tail = seedItems.slice(-batch.length).map((item) => item.id);
    assert.deepEqual(
      tail,
      batch.map((item) => item.id),
      'seedItemsTema3Parte3 must be appended last (canonical-position contract)',
    );
  });
});
