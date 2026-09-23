/**
 * Restart-persistence tests — priority (a): prevent restart data loss.
 *
 * Boots the real server/db.ts singleton in child processes against an isolated
 * OPOSILAB_DATA_DIR (mkdtemp under os.tmpdir()). The live ./data/oposilab.db
 * is never touched.
 *
 * Regression: db.init() used to call seedInitialData() on BOTH branches of its
 * boot check, wiping user topics, attempts, error logs, settings and review
 * schedules on every restart. Seeding must be idempotent: a full seed only on
 * a genuinely empty database; otherwise an additive merge of missing seeds.
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'node:url';

const FIXTURE = fileURLToPath(new URL('./fixtures/restart-probe.ts', import.meta.url));
const STATE_MARKER = '###STATE###';

interface ProbeState {
  topics: number;
  items: number;
  attempts: number;
  errorLogs: number;
  reviewSchedules: number;
  hasUserTopic: boolean;
  hasTema7: boolean;
  scheduleLapsePreserved: boolean;
  sentinel: string;
}

let tmpDir = '';
let first: ProbeState;
let second: ProbeState;

/** Runs the boot-probe fixture in a child process with an isolated data dir. */
function runProbe(mode: 'mutate' | 'verify'): ProbeState {
  const stdout = execFileSync(process.execPath, ['--import', 'tsx', FIXTURE, mode], {
    env: { ...process.env, OPOSILAB_DATA_DIR: tmpDir },
    encoding: 'utf-8',
  });
  const idx = stdout.lastIndexOf(STATE_MARKER);
  assert.ok(idx !== -1, `probe did not report state. stdout:\n${stdout}`);
  return JSON.parse(stdout.slice(idx + STATE_MARKER.length).trim()) as ProbeState;
}

describe('Restart persistence (seeding is idempotent, isolated)', () => {
  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oposilab-restart-'));
    first = runProbe('mutate'); // boot #1: fresh DB -> seed, then create user data
    second = runProbe('verify'); // boot #2: the restart that used to wipe everything
  });

  after(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('P2.3 Importing server/db.ts never touches the filesystem', () => {
    // Regression: db.ts used to call db.init() at module scope, seeding the
    // default-path database on mere import (before env overrides applied).
    // Uses its own FRESH temp dir: the suite dir already contains a seeded db.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oposilab-import-'));
    try {
      const stdout = execFileSync(
        process.execPath,
        ['--import', 'tsx', FIXTURE, 'import-only'],
        { env: { ...process.env, OPOSILAB_DATA_DIR: dir }, encoding: 'utf-8' }
      );
      const idx = stdout.lastIndexOf(STATE_MARKER);
      assert.ok(idx !== -1, `probe did not report state. stdout:\n${stdout}`);
      const probe = JSON.parse(stdout.slice(idx + STATE_MARKER.length).trim()) as {
        importCreatedDb: boolean;
      };
      assert.equal(
        probe.importCreatedDb,
        false,
        'importing server/db.ts must not open or create any database file'
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('P1.1 First boot seeds a fresh database exactly once', () => {
    assert.ok(first.hasTema7, 'Tema 7 seed topic must exist after first boot');
    assert.ok(first.items >= 70, `seed items expected >= 70, got ${first.items}`);
    assert.equal(
      first.items,
      first.reviewSchedules,
      'every seeded item must get exactly one review schedule'
    );
    assert.equal(first.attempts, 1, 'user attempt recorded after first boot');
    assert.equal(first.errorLogs, 1, 'E8 confident-wrong error log auto-created');
    assert.equal(first.sentinel, 'restart-sentinel', 'settings update applied');
  });

  test('P1.2 Second initialization preserves user data without duplicating seeds', () => {
    assert.ok(second.hasUserTopic, 'user topic must survive the restart');
    assert.ok(second.hasTema7, 'seed topics must remain after the restart');
    assert.equal(second.attempts, first.attempts, 'activity attempts must survive the restart');
    assert.equal(second.errorLogs, first.errorLogs, 'error logs must survive the restart');
    assert.equal(
      second.items,
      first.items,
      'seed merge must be additive: no items lost or duplicated on restart'
    );
    assert.equal(
      second.reviewSchedules,
      first.reviewSchedules,
      'review schedules must survive the restart'
    );
    assert.ok(
      second.scheduleLapsePreserved,
      'E8 lapse/priority state on the schedule must survive the restart'
    );
    assert.equal(
      second.sentinel,
      'restart-sentinel',
      'user settings must survive the restart (no reset to defaults)'
    );
  });
});
