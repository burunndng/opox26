import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../server/seedData.ts';
import { seedItemsTema5General } from '../server/seedDataTema5General.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

/**
 * Tema 5 General parte 1 ("Poder Legislativo y Defensor del Pueblo") bank integrity.
 * Batch authored from the 2026-11-23 class transcript (signal 100.000 onward),
 * the class resumen and the SOLO-del-pdf resumen, plus the BOE anchors documented
 * in the file header: CE Title III (arts. 66-80) and art. 134, LOREG and the
 * 2026 reforms of art. 69.3 CE and the Congreso Reglamento art. 23.1.
 * 50 standard MCQs; no item encodes a deferred or unverified teacher claim.
 */
const TOPIC = 'topic_constitucion_tema_5';
const tema5g = seedItems.filter((item) => item.topic_id === TOPIC);
const batchIds = new Set(seedItemsTema5General.map((item) => item.id));
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

describe('Tema 5 General (Poder Legislativo) bank integrity', () => {
  test('T1: the bank holds the audited 50 items', () => {
    assert.equal(tema5g.length, 50, 'Tema 5 General must hold 50 items');
    assert.equal(batch.length, 50, 'seedItemsTema5General must export 50 items');
  });

  test('T2: unique contiguous id series item-t5g-1..50', () => {
    const ids = tema5g.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate ids');
    const numbers = ids.map((id) => Number(id.split('-').pop())).sort((a, b) => a - b);
    assert.equal(numbers[0], 1);
    assert.equal(numbers[numbers.length - 1], 50);
    numbers.forEach((value, i) => assert.equal(value, i + 1, `gap at ${i + 1}`));
  });

  test('T3: every item has four options, one key, rule statement and legal anchor', () => {
    for (const item of tema5g) {
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
    const failures = tema5g.flatMap((item) => {
      const leak = detectAnswerInStem(item as Partial<Item>);
      return leak.detected ? [`${item.id}: ${JSON.stringify(leak.leakedPhrases)}`] : [];
    });
    assert.deepEqual(failures, [], `Leaks:\n${failures.join('\n')}`);
  });

  test('T5: no stray non-Latin characters in authored text', () => {
    const stray = /[\u3040-\u30ff\u4e00-\u9fff\uf900-\ufaff\u0400-\u04ff]/;
    for (const item of tema5g) {
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
    for (const item of tema5g) {
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
    const failures = tema5g.flatMap((item) => {
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

  test('T9: every item is validated, anchored to a Tema 5 General cluster and appended last', () => {
    for (const item of tema5g) {
      assert.equal(item.topic_id, TOPIC, `${item.id} wrong topic`);
      assert.equal(item.status, 'validated', `${item.id} must be practice-eligible`);
      assert.ok(item.cluster_id?.startsWith('cluster_t5g_'), `${item.id} needs a Tema 5 General cluster`);
    }
    const tail = seedItems.slice(-batch.length).map((item) => item.id);
    assert.deepEqual(tail, batch.map((item) => item.id), 'Tema 5 General batch must be appended last');
  });

  test('T10: the batch covers the eight clusters and the five confusion pairs', () => {
    const clusters = new Set(tema5g.map((item) => item.cluster_id));
    assert.equal(clusters.size, 8, `expected 8 clusters, found ${[...clusters].join(', ')}`);
    const pairs = new Set(tema5g.map((item) => item.confusion_pair_id).filter(Boolean));
    assert.deepEqual(
      [...pairs].sort(),
      [
        'pair_t5g_autonomica_congreso_vs_senado',
        'pair_t5g_delegacion_vs_decreto_ley',
        'pair_t5g_grupos_antes_vs_despues',
        'pair_t5g_mocion_vs_confianza',
        'pair_t5g_perdida_diputado_vs_senador',
      ],
      'the five audited confusion pairs must be exercised',
    );
  });

  test('T11: the rigor-sensitive items keep their BOE anchors', () => {
    const byId = new Map(tema5g.map((item) => [item.id, item]));
    const extraordinarias = byId.get('item-t5g-36')!;
    assert.match(extraordinarias.legal_basis ?? '', /73\.2 CE/, 'extraordinary sessions must anchor art. 73.2 CE');
    assert.match(extraordinarias.legal_basis ?? '', /BOE-A-1978-31229/, 'must cite the consolidated BOE text');
    assert.match(
      extraordinarias.rule_statement ?? '',
      /cualquiera/,
      'the key must preserve the BOE wording "cualquiera de las Cámaras"',
    );
    const altosCargos = byId.get('item-t5g-24')!;
    assert.match(altosCargos.legal_basis ?? '', /6\.1\.f/, 'ineligibility must anchor LOREG art. 6.1.f');
    const islas = byId.get('item-t5g-19')!;
    assert.match(islas.legal_basis ?? '', /BOE-A-2026-10881/, 'Ibiza/Formentera must cite the 2026 reform');
    const grupos = byId.get('item-t5g-50')!;
    assert.match(grupos.legal_basis ?? '', /BOE-A-2026-16353/, 'group thresholds must cite the 2026 Reglamento reform');
    const decretoLey = byId.get('item-t5g-43')!;
    assert.match(decretoLey.legal_basis ?? '', /Art\. 86 CE/, 'decree-law control must anchor art. 86 CE');
  });
});
