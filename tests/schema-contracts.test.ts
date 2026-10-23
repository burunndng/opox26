import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  interleavedBlockInput,
  savedSessionStateInput,
  aiExtractSetInput,
  aiExtractAtomsInput,
  aiDraftItemInput,
  aiChatInput,
  jevDecisionsInput,
  jevAuditItemInput,
  jevDiagnoseAttemptInput,
  jevClassifyAtomInput,
  jevVerifyCascadeInput,
  jevCompareInput,
  backupInput,
} from '../src/schemas/index.ts';

/**
 * Schema contract tests (audit 2026-10-23, FIX 5).
 * Payload shapes mirror what src/api.ts actually sends, so valid UI traffic
 * must keep passing while garbage is rejected with a 400-able issue list.
 */

describe('Schema contracts — interleaved block', () => {
  test('accepts the UI payload and preserves unknown keys', () => {
    const payload = {
      blockSize: 10,
      topicId: 'topic-1',
      includeNew: true,
      includeMaintenance: false,
      focusConfusionPairs: true,
      activityTypes: ['cloze', 'cover_and_generate_mcq'],
      uiExtra: 'kept',
    };
    const parsed = interleavedBlockInput.safeParse(payload);
    assert.equal(parsed.success, true);
    assert.equal((parsed.data as any).uiExtra, 'kept');
  });

  test('rejects out-of-range or mistyped blockSize', () => {
    assert.equal(interleavedBlockInput.safeParse({ blockSize: 0 }).success, false);
    assert.equal(interleavedBlockInput.safeParse({ blockSize: 101 }).success, false);
    assert.equal(interleavedBlockInput.safeParse({ blockSize: '10' }).success, false);
  });
});

describe('Schema contracts — session state', () => {
  test('accepts any plain object, rejects arrays and primitives', () => {
    assert.equal(savedSessionStateInput.safeParse({ title: 'Bloque', currentIndex: 3 }).success, true);
    assert.equal(savedSessionStateInput.safeParse([1, 2]).success, false);
    assert.equal(savedSessionStateInput.safeParse('state').success, false);
  });
});

describe('Schema contracts — AI routes', () => {
  test('extract-set requires non-empty text; articleRef optional', () => {
    assert.equal(aiExtractSetInput.safeParse({ text: 'Art. 53 TRLGSS' }).success, true);
    assert.equal(aiExtractSetInput.safeParse({ text: 'Art. 53', articleRef: 'art-53' }).success, true);
    assert.equal(aiExtractSetInput.safeParse({}).success, false);
    assert.equal(aiExtractSetInput.safeParse({ text: '' }).success, false);
  });

  test('extract-atoms requires text', () => {
    assert.equal(aiExtractAtomsInput.safeParse({ text: 'texto' }).success, true);
    assert.equal(aiExtractAtomsInput.safeParse({ text: 42 }).success, false);
  });

  test('draft-item requires atom object and itemType', () => {
    assert.equal(aiDraftItemInput.safeParse({ atom: { text: 'a' }, itemType: 'cloze' }).success, true);
    assert.equal(aiDraftItemInput.safeParse({ atom: { text: 'a' } }).success, false);
    assert.equal(aiDraftItemInput.safeParse({ atom: 'atom', itemType: 'cloze' }).success, false);
  });

  test('chat validates the message envelope', () => {
    const uiMessage = { id: 'm1', role: 'user', content: 'hola', timestamp: new Date().toISOString() };
    assert.equal(aiChatInput.safeParse({ messages: [uiMessage], provider: 'gemini' }).success, true);
    assert.equal(aiChatInput.safeParse({ messages: [] }).success, false);
    assert.equal(aiChatInput.safeParse({ messages: 'no' }).success, false);
    assert.equal(aiChatInput.safeParse({ messages: [uiMessage], provider: 'other' }).success, false);
  });
});

describe('Schema contracts — Jev routes', () => {
  test('decisions accepts object or string state, requires record questions', () => {
    assert.equal(jevDecisionsInput.safeParse({ state: { a: 1 }, questions: { q1: { type: 'noul' } } }).success, true);
    assert.equal(jevDecisionsInput.safeParse({ state: 'raw text state', questions: { q1: { type: 'score' } } }).success, true);
    assert.equal(jevDecisionsInput.safeParse({ questions: { q1: {} } }).success, false);
    assert.equal(jevDecisionsInput.safeParse({ state: {}, questions: [1, 2] }).success, false);
    assert.equal(jevDecisionsInput.safeParse({ state: {}, questions: { q1: { type: 'bad-type' } } }).success, false);
  });

  test('audit-item requires the item object', () => {
    assert.equal(jevAuditItemInput.safeParse({ item: { stem: 's' } }).success, true);
    assert.equal(jevAuditItemInput.safeParse({}).success, false);
  });

  test('diagnose-attempt enforces the triage contract', () => {
    const uiPayload = {
      item_stem: '¿Plazo de prescripción?',
      item_rule: 'Art. 53 TRLGSS',
      item_correct_answer: '5 años',
      generated_answer_before_options: '5 años',
      selected_option: 'B',
      is_correct: false,
      confidence: 2,
    };
    assert.equal(jevDiagnoseAttemptInput.safeParse(uiPayload).success, true);
    assert.equal(jevDiagnoseAttemptInput.safeParse({ ...uiPayload, is_correct: 'no' }).success, false);
    assert.equal(jevDiagnoseAttemptInput.safeParse({ ...uiPayload, confidence: 4 }).success, false);
    const { is_correct: _drop, ...missing } = uiPayload;
    assert.equal(jevDiagnoseAttemptInput.safeParse(missing).success, false);
  });

  test('classify-atom requires text', () => {
    assert.equal(jevClassifyAtomInput.safeParse({ text: 'proposición', legal_basis: 'Art. 53' }).success, true);
    assert.equal(jevClassifyAtomInput.safeParse({}).success, false);
  });

  test('verify-cascade requires draftItem and sourceText', () => {
    assert.equal(jevVerifyCascadeInput.safeParse({ draftItem: { stem: 's' }, sourceText: 'texto' }).success, true);
    assert.equal(jevVerifyCascadeInput.safeParse({ draftItem: { stem: 's' } }).success, false);
    assert.equal(jevVerifyCascadeInput.safeParse({ sourceText: 'texto' }).success, false);
  });

  test('compare enforces models as an array of strings', () => {
    assert.equal(jevCompareInput.safeParse({ state: {}, questions: { q1: {} }, models: ['a', 'b'] }).success, true);
    assert.equal(jevCompareInput.safeParse({ state: {}, questions: { q1: {} }, models: 'a' }).success, false);
    assert.equal(jevCompareInput.safeParse({ state: {}, questions: { q1: {} }, models: [1] }).success, false);
  });
});

describe('Schema contracts — backup import', () => {
  test('mirrors restoreData structural contract', () => {
    assert.equal(backupInput.safeParse({ topics: [], items: [], sessions: [] }).success, true);
    assert.equal(backupInput.safeParse({ items: [] }).success, false, 'missing topics must fail');
    assert.equal(backupInput.safeParse({ topics: 'nope', items: [] }).success, false);
    assert.equal(backupInput.safeParse([]).success, false);
    assert.equal(backupInput.safeParse(null).success, false);
  });
});
