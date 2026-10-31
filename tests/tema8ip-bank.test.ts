import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { seedItemsTema8IP } from '../server/seedDataTema8IP.ts';
import { seedTopics, seedClusters, seedConfusionPairs } from '../server/seedData.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

describe('Tema 8 (II) — Incapacidad permanente bank integrity', () => {
  const items = seedItemsTema8IP;

  test('is 52 uniquely identified MCQ items', () => {
    assert.equal(items.length, 52);
    assert.equal(new Set(items.map((i) => i.id)).size, 52);
    items.forEach((item, index) => {
      assert.equal(item.id, `item-t8ip-${index + 1}`, 'IDs must be sequential from item-t8ip-1');
    });
  });

  test('every item has four options and exactly one keyed answer', () => {
    for (const item of items) {
      const opts = item.options ?? [];
      assert.equal(opts.length, 4, `${item.id} must have 4 options`);
      assert.deepEqual(opts.map((o) => o.id), ['A', 'B', 'C', 'D'], `${item.id} option IDs must be A-D in order`);
      const correct = opts.filter((o) => o.is_correct);
      assert.equal(correct.length, 1, `${item.id} must have exactly one correct option`);
      assert.equal(item.correct_answer, correct[0].id, `${item.id} key must match the flagged option`);
    }
  });

  test('every item states a rule, an application and a cue', () => {
    for (const item of items) {
      assert.ok(item.rule_statement?.trim(), `${item.id} needs rule_statement`);
      assert.ok(item.why_correct?.trim(), `${item.id} needs why_correct`);
      assert.ok(item.corrective_rule?.trim(), `${item.id} needs corrective_rule`);
      assert.ok(item.legal_basis?.trim(), `${item.id} needs legal_basis`);
    }
  });

  test('no stem leaks its own keyed answer', () => {
    for (const item of items) {
      const leak = detectAnswerInStem(item as Partial<Item>);
      assert.equal(
        leak.detected,
        false,
        `${item.id} leaks ${JSON.stringify(leak.leakedPhrases)} into the stem`
      );
    }
  });

  test('no stem or option carries stray non-Latin characters', () => {
    const stray = /[\u3040-\u30ff\u4e00-\u9fff\uf900-\ufaff]/;
    for (const item of items) {
      const texts = [item.stem, item.rule_statement, item.why_correct, item.corrective_rule];
      for (const opt of item.options ?? []) {
        texts.push(opt.text, opt.explanation ?? '', opt.condition_if_correct ?? '');
      }
      for (const text of texts) {
        assert.ok(!stray.test(text), `${item.id} contains a stray character: ${text.slice(0, 60)}`);
      }
    }
  });

  test('every distractor carries an explanation and a trap type', () => {
    for (const item of items) {
      const distractors = (item.options ?? []).filter((o) => !o.is_correct);
      assert.equal(distractors.length, 3, `${item.id} must have 3 distractors`);
      for (const opt of distractors) {
        assert.ok(opt.explanation?.trim(), `${item.id} option ${opt.id} needs an explanation`);
        assert.ok(opt.trap_type, `${item.id} option ${opt.id} needs a trap_type`);
      }
      assert.equal(
        Object.keys(item.distractor_analysis ?? {}).length,
        3,
        `${item.id} distractor_analysis must cover the 3 distractors`
      );
      assert.equal((item.trap_types ?? []).length, 3, `${item.id} trap_types must list the 3 distractors`);
    }
  });

  test('keys are balanced 10/10/10/10 with no run longer than two', () => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const item of items) counts[item.correct_answer!] += 1;
    assert.deepEqual(counts, { A: 13, B: 13, C: 13, D: 13 });

    let run = 1;
    for (let i = 1; i < items.length; i += 1) {
      if (items[i].correct_answer === items[i - 1].correct_answer) {
        run += 1;
        assert.ok(run <= 2, `run of ${run} identical keys ending at ${items[i].id}`);
      } else {
        run = 1;
      }
    }
  });

  test('no correct option exceeds 1.25x the mean distractor length', () => {
    const failures: string[] = [];
    for (const item of items) {
      const opts = item.options ?? [];
      const correct = opts.find((o) => o.is_correct)!;
      const distractors = opts.filter((o) => !o.is_correct);
      const mean = distractors.reduce((sum, o) => sum + o.text.trim().length, 0) / distractors.length;
      if (correct.text.trim().length > mean * 1.25) {
        failures.push(
          `${item.id}: ${correct.text.trim().length} > ${mean * 1.25} (${mean.toFixed(1)} mean)`
        );
      }
    }
    assert.deepEqual(failures, [], `Correct options exceed the length threshold:\n${failures.join('\n')}`);
  });

  test('cluster and confusion-pair references resolve', () => {
    const clusterIds = new Set(seedClusters.map((c) => c.id));
    const pairIds = new Set(seedConfusionPairs.map((p) => p.id));
    const topicIds = new Set(seedTopics.map((t) => t.id));

    const failures: string[] = [];
    for (const item of items) {
      if (!topicIds.has(item.topic_id)) failures.push(`${item.id} -> topic ${item.topic_id}`);
      if (!item.cluster_id || !clusterIds.has(item.cluster_id)) {
        failures.push(`${item.id} -> cluster ${item.cluster_id ?? '(none)'}`);
      }
      if (item.confusion_pair_id && !pairIds.has(item.confusion_pair_id)) {
        failures.push(`${item.id} -> pair ${item.confusion_pair_id}`);
      }
    }
    assert.deepEqual(failures, [], `Dangling references:\n${failures.join('\n')}`);
  });

  test('every item belongs to the dedicated IP topic and is practice-eligible', () => {
    for (const item of items) {
      assert.equal(item.topic_id, 'topic_seguridad_social_tema_8_ip', `${item.id} wrong topic`);
      assert.equal(item.status, 'validated', `${item.id} must be validated`);
      assert.equal(item.source, 'manual', `${item.id} must be manually authored`);
      assert.equal(item.item_type, 'cover_and_generate_mcq', `${item.id} must be a standard MCQ`);
    }
    const topic = seedTopics.find((t) => t.id === 'topic_seguridad_social_tema_8_ip');
    assert.ok(topic, 'IP topic must be registered in seedTopics');
    assert.equal(topic.status, 'active');
  });

  test('no stem or option carries a year-linked figure without a figure status', () => {
    const yearLinked = (text: string) =>
      /\b20\d{2}\b/.test(text) && /\d[\d.,]*\s*(?:€|euros?|%|por ciento)/i.test(text);

    const failures = items
      .filter((item) => {
        const text = [item.stem, item.rule_statement, ...(item.options ?? []).map((o) => o.text)]
          .filter(Boolean)
          .join(' ');
        return yearLinked(text);
      })
      .map((item) => item.id);

    assert.deepEqual(
      failures,
      [],
      `Year-linked figures need a figure_status (F7 would fail): ${failures.join(', ')}`
    );
  });
});
