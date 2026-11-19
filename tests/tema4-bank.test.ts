import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsTema4 } from '../server/seedDataTema4.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

/**
 * Tema 4 específico ("La cotización a la Seguridad Social") bank integrity.
 * Batch authored from the 2026-11-16 class summary (transcript + deck +
 * NORMATIVA) plus BOE-verified anchors. 48 standard MCQs: 38 from the
 * substantive pools + 10 from the class test (tema 3) resolved in session.
 */
const TOPIC = 'topic_seguridad_social_tema_4';
const tema4 = seedItems.filter((item) => item.topic_id === TOPIC);
const batchIds = new Set(seedItemsTema4.map((item) => item.id));
const batch = seedItems.filter((item) => batchIds.has(item.id));

const isMcq = (item: Item) =>
  item.item_type === 'cover_and_generate_mcq' && (item.options?.length ?? 0) > 0;
function positionOf(item: Item): number {
  return (item.options ?? []).findIndex((option) => option.is_correct);
}
function positionCounts(items: Item[]): Record<number, number> {
  return items.reduce<Record<number, number>>((acc, item) => {
    const pos = positionOf(item);
    acc[pos] = (acc[pos] ?? 0) + 1;
    return acc;
  }, {});
}
function longestPositionRun(items: Item[]): { position: number; length: number; at: string } {
  let best = { position: -1, length: 0, at: '' };
  let run = 0;
  let previous = -2;
  for (const item of items) {
    const pos = positionOf(item);
    run = pos === previous ? run + 1 : 1;
    previous = pos;
    if (run > best.length) best = { position: pos, length: run, at: item.id };
  }
  return best;
}

describe('Tema 4 específico bank integrity', () => {
  test('T1: the bank holds the audited 48 items', () => {
    assert.equal(tema4.length, 48, 'Tema 4 must hold 48 items');
    assert.equal(batch.length, 48, 'seedItemsTema4 must export 48 items');
  });

  test('T2: unique contiguous id series item-t4-1..48', () => {
    const ids = tema4.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate ids');
    const numbers = ids.map((id) => Number(id.split('-').pop())).sort((a, b) => a - b);
    assert.equal(numbers[0], 1);
    assert.equal(numbers[numbers.length - 1], 48);
    numbers.forEach((value, i) => assert.equal(value, i + 1, `gap at ${i + 1}`));
  });

  test('T3: every item has four options, one key, rule statement and legal anchor', () => {
    for (const item of tema4) {
      assert.equal(isMcq(item), true, `${item.id} must be a standard MCQ`);
      assert.equal((item.options ?? []).length, 4, `${item.id} needs 4 options`);
      const correct = (item.options ?? []).filter((option) => option.is_correct);
      assert.equal(correct.length, 1, `${item.id} needs one correct`);
      assert.equal(item.correct_answer, correct[0].id, `${item.id} key mismatch`);
      assert.ok(item.rule_statement?.trim(), `${item.id} needs rule_statement`);
      assert.ok(item.legal_basis?.trim(), `${item.id} needs legal_basis`);
    }
  });

  test('T4: no stem leaks its own correct answer', () => {
    const failures = tema4.flatMap((item) => {
      const leak = detectAnswerInStem(item as Partial<Item>);
      return leak.detected ? [`${item.id}: ${JSON.stringify(leak.leakedPhrases)}`] : [];
    });
    assert.deepEqual(failures, [], `Leaks:\n${failures.join('\n')}`);
  });

  test('T5: no stray non-Latin characters in authored text', () => {
    const stray = /[\u3040-\u30ff\u4e00-\u9fff\uf900-\ufaff]/;
    for (const item of tema4) {
      const texts = [item.stem, item.rule_statement, item.why_correct, item.corrective_rule];
      for (const option of item.options ?? []) {
        texts.push(option.text, option.explanation ?? '', option.condition_if_correct ?? '');
      }
      for (const text of texts) {
        if (text) assert.ok(!stray.test(text), `${item.id} stray: ${text.slice(0, 60)}`);
      }
    }
  });

  test('T6: every distractor has an explanation and a distinct trap type', () => {
    const failures: string[] = [];
    for (const item of tema4) {
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      for (const option of distractors) {
        if (!option.explanation?.trim()) failures.push(`${item.id}/${option.id} missing explanation`);
        if (!option.trap_type) failures.push(`${item.id}/${option.id} missing trap_type`);
      }
      if (new Set(distractors.map((option) => option.trap_type)).size !== distractors.length) {
        failures.push(`${item.id}: duplicate trap types [${distractors.map((d) => d.trap_type).join(', ')}]`);
      }
    }
    assert.deepEqual(failures, [], `Trap/explanation failures:\n${failures.join('\n')}`);
  });

  test('T7: keyed answer is never over 1.25x the mean distractor length', () => {
    const failures = tema4.flatMap((item) => {
      const correct = (item.options ?? []).find((option) => option.is_correct)!;
      const distractors = (item.options ?? []).filter((option) => !option.is_correct);
      const mean = distractors.reduce((sum, d) => sum + d.text.trim().length, 0) / distractors.length;
      return correct.text.trim().length > mean * 1.25
        ? [`${item.id}: correct ${correct.text.trim().length} vs mean ${mean.toFixed(1)}`]
        : [];
    });
    assert.deepEqual(failures, [], `Length failures:\n${failures.join('\n')}`);
  });

  test('T8: canonical display positions stay balanced with no run of three', () => {
    const counts = positionCounts(batch);
    for (const [pos, count] of Object.entries(counts)) {
      assert.ok(count <= batch.length * 0.4, `position ${pos} over-represented: ${count}/${batch.length}`);
    }
    const run = longestPositionRun(batch);
    assert.ok(run.length <= 2, `run of ${run.length} at ${run.at}`);
  });

  test('T9: every item is validated, anchored to a Tema 4 cluster and appended last', () => {
    for (const item of tema4) {
      assert.equal(item.topic_id, TOPIC, `${item.id} wrong topic`);
      assert.equal(item.status, 'validated', `${item.id} must be practice-eligible`);
      assert.ok(item.cluster_id?.startsWith('cluster_'), `${item.id} needs a cluster`);
    }
    const tail = seedItems.slice(-batch.length).map((item) => item.id);
    assert.deepEqual(tail, batch.map((item) => item.id), 'Tema 4 batch must be appended last');
  });

  test('T10: figure-bearing items declare a figure status', () => {
    const withFigure = /20\d{2}/;
    const withAmount = /\d[\d.,]*\s*(?:€|euros?|%|por ciento)/i;
    for (const item of tema4) {
      const text = [item.stem, item.rule_statement, item.correct_answer,
        ...(item.options ?? []).map((option) => option.text)].filter(Boolean).join(' ');
      if (withFigure.test(text) && withAmount.test(text)) {
        assert.ok(
          item.figure_status === 'BOE_VERIFIED' || item.figure_status === 'ESTIMATED_LPGE',
          `${item.id} needs figure_status for a year-linked amount`,
        );
      }
    }
  });
});
