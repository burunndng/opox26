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

interface SeedState {
  seedCount: number;
  eligibleCount: number;
  draftIds: string[];
  targetStatus: string | null;
  targetFigureStatus: string | null;
  targetAttemptCount: number;
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
});
