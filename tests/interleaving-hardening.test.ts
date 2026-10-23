import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { InterleavingEngine } from '../server/scheduler.ts';
import { db } from '../server/db.ts';
import { isolateDataDir } from './helpers/isolation.ts';

/**
 * Interleaving hardening (audit 2026-10-23):
 *  - generateBlock is deterministic for identical state (no Math.random ordering)
 *  - no 3rd consecutive item of the same cluster or format when avoidable
 */

const isolatedDir = isolateDataDir();

describe('Interleaving hardening', () => {
  before(() => {
    assert.equal(process.env.OPOSILAB_DATA_DIR, isolatedDir);
    assert.equal(process.env.OPOSILAB_OFFLINE, '1');
    db.init();
  });

  test('I1: generateBlock is deterministic for identical state', () => {
    const first = InterleavingEngine.generateBlock({ blockSize: 12, includeNew: true });
    const second = InterleavingEngine.generateBlock({ blockSize: 12, includeNew: true });

    assert.ok(first.length > 0, 'block must not be empty');
    assert.deepEqual(
      first.map((item) => item.id),
      second.map((item) => item.id),
      'identical inputs must produce an identical block order'
    );
  });

  test('I2: avoids 3 consecutive items of the same format when alternatives exist', () => {
    const block = InterleavingEngine.generateBlock({ blockSize: 20 });
    const types = block.map((item) => item.item_type);

    let run = 1;
    for (let i = 1; i < types.length; i++) {
      run = types[i] === types[i - 1] ? run + 1 : 1;
      assert.ok(run < 3, `block contains ${run} consecutive "${types[i]}" items at index ${i}`);
    }
  });
});
