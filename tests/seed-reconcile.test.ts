import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isolateDataDir } from './helpers/isolation.ts';

const isolatedRoot = isolateDataDir();
const fixture = fileURLToPath(new URL('./fixtures/seed-reconcile-probe.ts', import.meta.url));
const STATE_MARKER = '###SEED_STATE###';

interface CitationContent {
  legal_basis: string | null;
  rule_statement: string | null;
  why_correct: string | null;
  corrective_rule: string | null;
  explanation: string | null;
}

interface AtomContent {
  text: string | null;
  legal_basis: string | null;
}

interface SeedState {
  seedCount: number;
  eligibleCount: number;
  draftIds: string[];
  targetStatus: string | null;
  targetFigureStatus: string | null;
  targetAttemptCount: number;
  targetContent: CitationContent | null;
  seedContent: CitationContent | null;
  targetAtom: AtomContent | null;
  seedAtom: AtomContent | null;
}

function freshCaseDir(name: string): string {
  const dir = path.join(isolatedRoot, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function runProbe(dir: string, mode: string, itemId?: string): SeedState {
  const args = ['--import', 'tsx', fixture, mode];
  if (itemId) args.push(itemId);
  const stdout = execFileSync(process.execPath, args, {
    env: { ...process.env, OPOSILAB_DATA_DIR: dir, OPOSILAB_OFFLINE: '1' },
    encoding: 'utf-8',
  });
  const markerIndex = stdout.lastIndexOf(STATE_MARKER);
  assert.notEqual(markerIndex, -1, `probe did not report state. stdout:\n${stdout}`);
  return JSON.parse(stdout.slice(markerIndex + STATE_MARKER.length).trim()) as SeedState;
}

describe('Boot reconciliation for untouched seed items (isolated)', () => {
  after(() => fs.rmSync(isolatedRoot, { recursive: true, force: true }));

  test('R1: fresh database seeds 119 practice-eligible items and no drafts', () => {
    const state = runProbe(freshCaseDir('fresh'), 'snapshot');
    assert.equal(state.seedCount, 119, '113 core items plus 6 retrieval/pretest items are seeded');
    assert.equal(state.eligibleCount, 119);
    assert.deepEqual(state.draftIds, []);
  });

  test('R2: boot promotes an untouched draft and syncs its figure metadata', () => {
    const dir = freshCaseDir('untouched');
    runProbe(dir, 'set-draft', 'item-retr-1');

    const state = runProbe(dir, 'snapshot', 'item-retr-1');
    assert.equal(state.targetStatus, 'validated');
    assert.equal(state.targetFigureStatus, null);
    assert.equal(state.targetAttemptCount, 0);
  });

  test('R3: boot preserves status and figure metadata for a seed with an attempt', () => {
    const dir = freshCaseDir('attempted');
    runProbe(dir, 'set-draft-with-attempt', 'item-retr-2');

    const state = runProbe(dir, 'snapshot', 'item-retr-2');
    assert.equal(state.targetStatus, 'draft');
    assert.equal(state.targetFigureStatus, 'ESTIMATED_LPGE');
    assert.equal(state.targetAttemptCount, 1);
  });

  test('R4: reconciliation is idempotent on the following boot', () => {
    const dir = freshCaseDir('idempotent');
    runProbe(dir, 'set-draft', 'item-retr-3');

    const reconciled = runProbe(dir, 'snapshot', 'item-retr-3');
    const secondBoot = runProbe(dir, 'snapshot', 'item-retr-3');
    assert.equal(reconciled.targetStatus, 'validated');
    assert.deepEqual(secondBoot, reconciled);
  });

  test('R5: boot restores citation content on an unattempted seed (nested explanation included)', () => {
    const dir = freshCaseDir('stale-citation');
    runProbe(dir, 'set-stale-citation', 'item-spot-9');

    const state = runProbe(dir, 'snapshot', 'item-spot-9');
    assert.equal(state.targetAttemptCount, 0);
    assert.deepEqual(state.targetContent, state.seedContent);
    assert.equal(state.targetContent?.legal_basis, 'D.T. 39.ª TRLGSS');
    assert.equal(state.targetContent?.explanation, 'El tope legal mensual para 2026 asciende exactamente a 3.359,60 € (D.T. 39.ª TRLGSS).');
  });

  test('R6: boot preserves stale citation content for a seed with an attempt', () => {
    const dir = freshCaseDir('stale-citation-attempted');
    runProbe(dir, 'set-stale-citation-with-attempt', 'item-cloze-12');

    const state = runProbe(dir, 'snapshot', 'item-cloze-12');
    assert.equal(state.targetAttemptCount, 1);
    assert.equal(state.targetContent?.legal_basis, 'Art. 000 STALE');
    assert.equal(state.targetContent?.rule_statement, 'STALE rule');
    assert.equal(state.targetContent?.explanation, 'STALE explanation');
    assert.notDeepEqual(state.targetContent, state.seedContent);
  });

  test('R7: boot restores cloze citation content on an unattempted seed', () => {
    const dir = freshCaseDir('stale-cloze');
    runProbe(dir, 'set-stale-citation', 'item-cloze-12');

    const state = runProbe(dir, 'snapshot', 'item-cloze-12');
    assert.equal(state.targetAttemptCount, 0);
    assert.deepEqual(state.targetContent, state.seedContent);
    assert.equal(state.targetContent?.explanation, 'El valor exacto según los arts. 364 y 370 TRLGSS es 8.803,20 €.');
  });

  test('R8: boot restores stale citation content on a seed atom', () => {
    const dir = freshCaseDir('stale-atom');
    runProbe(dir, 'set-stale-atom', 'atom-14');

    const state = runProbe(dir, 'snapshot', 'atom-14');
    assert.deepEqual(state.targetAtom, state.seedAtom);
    assert.equal(state.targetAtom?.legal_basis, 'Arts. 364 y 370 TRLGSS');
    assert.ok(state.targetAtom?.text?.includes('8.803,20'));
  });
});
