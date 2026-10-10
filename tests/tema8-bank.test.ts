import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getModeAOptions, buildModeAFeedback } from '../src/components/ModeAStudyRunner.tsx';
import { seedItemsTema8 } from '../server/seedDataTema8Items.ts';
import { detectAnswerInStem } from '../src/utils/learningDesignValidator.ts';
import type { Item } from '../src/types.ts';

const sample = (over: Partial<Item>): Item =>
  ({
    id: 'x',
    topic_id: 't',
    item_type: 'cover_and_generate_mcq',
    stem: '¿Cuál es el plazo?',
    legal_basis: 'Art. 169 TRLGSS',
    rule_statement: 'Regla completa.',
    why_correct: 'Aplicación al supuesto.',
    corrective_rule: 'Pista breve.',
    difficulty: 3,
    cognitive_operations: [],
    status: 'validated',
    source: 'manual',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...over,
  }) as Item;

describe('Mode A feedback (attempt-first)', () => {
  test('keeps every option in original order', () => {
    const item = sample({
      correct_answer: 'C',
      options: [
        { id: 'A', text: 'a', is_correct: false },
        { id: 'B', text: 'b', is_correct: false },
        { id: 'C', text: 'c', is_correct: true },
        { id: 'D', text: 'd', is_correct: false },
      ],
    });
    const opts = getModeAOptions(item);
    assert.equal(opts.length, 4);
    assert.deepEqual(opts.map((o) => o.id), ['A', 'B', 'C', 'D']);
  });

  test('separates rule, application and cue instead of repeating one field', () => {
    const item = sample({
      correct_answer: 'A',
      options: [
        { id: 'A', text: 'correcta', is_correct: true },
        { id: 'B', text: 'falsa', is_correct: false },
      ],
      distractor_analysis: { B: 'Porque cambia el sujeto obligado.' },
    });
    const fb = buildModeAFeedback(item, 'B');
    assert.equal(fb.isCorrect, false);
    assert.equal(fb.rule, 'Regla completa.');
    assert.equal(fb.application, 'Aplicación al supuesto.');
    assert.equal(fb.cue, 'Pista breve.');
    assert.equal(fb.correctOption?.id, 'A');
    assert.equal(fb.selectedOptionExplanation, 'Porque cambia el sujeto obligado.');
  });

  test('never presents a distractor explanation as the application', () => {
    const item = sample({
      correct_answer: 'A',
      options: [
        { id: 'A', text: 'correcta', is_correct: true },
        { id: 'B', text: 'falsa', is_correct: false },
      ],
      distractor_analysis: { B: 'Incorrecto. Something.' },
    });
    const fb = buildModeAFeedback(item, 'B');
    assert.notEqual(fb.application, fb.selectedOptionExplanation);
    assert.ok(!fb.application.startsWith('Incorrecto'));
  });

  test('has no feedback before a choice is made', () => {
    const item = sample({
      correct_answer: 'A',
      options: [
        { id: 'A', text: 'correcta', is_correct: true },
        { id: 'B', text: 'falsa', is_correct: false },
      ],
    });
    const fb = buildModeAFeedback(item, null);
    assert.equal(fb.isCorrect, false);
    assert.equal(fb.selectedOption, undefined);
    assert.equal(fb.selectedOptionExplanation, undefined);
  });
});

describe('Tema 8 bank integrity', () => {
  const items = seedItemsTema8;

  test('is 70 uniquely identified MCQ items', () => {
    assert.equal(items.length, 70);
    assert.equal(new Set(items.map((i) => i.id)).size, 70);
  });

  test('every item has four options and exactly one keyed answer', () => {
    for (const item of items) {
      const opts = item.options ?? [];
      assert.equal(opts.length, 4, `${item.id} must have 4 options`);
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

  test('no option text carries stray non-Latin characters', () => {
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
      for (const opt of (item.options ?? []).filter((o) => !o.is_correct)) {
        assert.ok(opt.explanation?.trim(), `${item.id} option ${opt.id} needs an explanation`);
        assert.ok(opt.trap_type, `${item.id} option ${opt.id} needs a trap_type`);
      }
    }
  });
});