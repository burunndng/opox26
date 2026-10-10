import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isolateDataDir } from './helpers/isolation.ts';

const isolatedRoot = isolateDataDir();

/**
 * Boot reconciliation must reach every seed-owned field the runners read.
 * `stem`, `distractor_analysis` and `trap_types` were previously missing from
 * the sync list, which left live databases holding superseded question text.
 */

function runIn(dir: string, script: string): string {
  return execFileSync(process.execPath, ['--import', 'tsx', '-e', script], {
    env: { ...process.env, OPOSILAB_DATA_DIR: dir, OPOSILAB_OFFLINE: '1' },
    encoding: 'utf-8',
  });
}

function freshDir(name: string): string {
  const dir = path.join(isolatedRoot, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const STALE_SCRIPT = `
import { db } from './server/db.ts';
import { seedItemsTema8 } from './server/seedDataTema8Items.ts';

const byId = new Map(seedItemsTema8.map((i) => [i.id, i]));

// Unattempted seed: stale text must be reverted on the next boot.
db.updateItem('item-t8-1', {
  stem: 'STALE stem',
  distractor_analysis: { B: 'STALE analysis' },
  trap_types: ['overbroad_statement'],
});

// Attempted seed: content is user-owned and must survive untouched.
db.updateItem('item-t8-2', {
  stem: 'STALE stem attempted',
  distractor_analysis: { B: 'STALE analysis attempted' },
});
db.recordAttempt({
  item_id: 'item-t8-2',
  activity_type: byId.get('item-t8-2').item_type,
  confidence: 1,
  correct: true,
  used_hint: false,
  was_interleaved: false,
  was_timed: false,
});
`;

const SNAPSHOT_SCRIPT = `
import { db } from './server/db.ts';
import { seedItemsTema8 } from './server/seedDataTema8Items.ts';
const byId = new Map(seedItemsTema8.map((i) => [i.id, i]));
const snap = (id) => {
  const live = db.getItem(id);
  const seed = byId.get(id);
  return {
    stem: live.stem,
    distractor_analysis: live.distractor_analysis,
    trap_types: live.trap_types,
    seed_stem: seed.stem,
    seed_distractor_analysis: seed.distractor_analysis,
    seed_trap_types: seed.trap_types,
  };
};
process.stdout.write('###STATE###' + JSON.stringify({ a: snap('item-t8-1'), b: snap('item-t8-2') }));
`;

function readState(stdout: string): { a: any; b: any } {
  const idx = stdout.lastIndexOf('###STATE###');
  assert.notEqual(idx, -1, `probe did not report state. stdout:\n${stdout}`);
  return JSON.parse(stdout.slice(idx + '###STATE###'.length));
}

describe('Seed content reconciliation beyond citation fields (isolated)', () => {
  after(() => fs.rmSync(isolatedRoot, { recursive: true, force: true }));

  test('boot restores stem, distractor_analysis and trap_types on an unattempted seed', () => {
    const dir = freshDir('content-sync');
    runIn(dir, STALE_SCRIPT);

    const state = readState(runIn(dir, SNAPSHOT_SCRIPT)).a;
    assert.equal(state.stem, state.seed_stem, 'stem must be restored from the seed');
    assert.deepEqual(state.distractor_analysis, state.seed_distractor_analysis);
    assert.deepEqual(state.trap_types, state.seed_trap_types);
  });

  test('boot preserves stale stem and analysis for a seed with an attempt', () => {
    const dir = freshDir('content-sync-attempted');
    runIn(dir, STALE_SCRIPT);

    const state = readState(runIn(dir, SNAPSHOT_SCRIPT)).b;
    assert.equal(state.stem, 'STALE stem attempted', 'attempted items stay user-owned');
    assert.deepEqual(state.distractor_analysis, { B: 'STALE analysis attempted' });
  });
});