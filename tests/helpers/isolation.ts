/**
 * Shared test isolation bootstrap.
 *
 * Call isolateDataDir() at the TOP of any test module that (directly or
 * transitively) touches server/db.ts, BEFORE db.init() runs. It:
 *   1. Points OPOSILAB_DATA_DIR at a fresh temp dir, so the live
 *      ./data/oposilab.db is never read or written.
 *   2. Sets OPOSILAB_OFFLINE=1 so AI/Jev clients use their local deterministic
 *      fallbacks and never spend network credits.
 *
 * server/db.ts resolves its paths lazily (at init time), so setting the env
 * var after import but before init() is sufficient.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

export function isolateDataDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oposilab-test-'));
  process.env.OPOSILAB_DATA_DIR = dir;
  process.env.OPOSILAB_OFFLINE = '1';
  return dir;
}
