// Prepared in scratch (2026-11-10) — copy to tests/doc-freshness.test.ts ONCE the
// concurrent Tema 15 general batch is committed (otherwise staging the count-sync
// edits would sweep that batch's uncommitted WIP into this commit).
// Adapted from docs/plans/2026-11-10-handoff-implementation.md:
//  * R1 numbers are now 532 (not 481); counts 331/44 (not 318/43), 29 test files.
//  * ACCEPTANCE says "532 elegibles" (no "ítems") — regex relaxed.
//  * t15all = ids in seedDataTema15.ts (94) + seedDataTema15Extra.ts (51) = 145.
//  * AFTER copying: run npm test, then sync all live claims to the measured
//    totals (expected 334/45, 30 files) in the SAME commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('..', import.meta.url);

function read(rel: string): string {
  return readFileSync(new URL(rel, rootUrl), 'utf8');
}

function firstNumber(re: RegExp, text: string, what: string): number {
  const m = re.exec(text);
  assert.ok(m, `doc-freshness: could not parse ${what}`);
  return Number(m[1]);
}

function distinctValues(re: RegExp, text: string): number {
  const matches = text.match(re);
  return matches ? new Set(matches).size : 0;
}

function stemCount(text: string): number {
  const matches = text.match(/stem: '/g);
  return matches ? matches.length : 0;
}

test('X1: seeded/eligible counts agree across README, ACCEPTANCE and R1 source', () => {
  const readme = read('README.md');
  const acceptance = read('docs/ACCEPTANCE.md');
  const r1src = read('tests/seed-reconcile.test.ts');

  const seeded = firstNumber(/(\d+) ítems sembrados/, readme, 'README sembrados');
  const eligible = firstNumber(/(\d+) ítems elegibles/, readme, 'README elegibles');
  const seededAcc = firstNumber(/(\d+) ítems sembrados/, acceptance, 'ACCEPTANCE sembrados');
  const eligibleAcc = firstNumber(/(\d+) elegibles/, acceptance, 'ACCEPTANCE elegibles');
  const r1Seed = firstNumber(/assert\.equal\(state\.seedCount, (\d+)/, r1src, 'R1 seedCount');
  const r1Eligible = firstNumber(/assert\.equal\(state\.eligibleCount, (\d+)/, r1src, 'R1 eligibleCount');

  assert.equal(seededAcc, seeded, 'README/ACCEPTANCE seeded counts disagree');
  assert.equal(eligibleAcc, eligible, 'README/ACCEPTANCE eligible counts disagree');
  assert.equal(r1Eligible, eligible, 'R1 eligibleCount disagrees with docs');
  assert.equal(r1Seed, r1Eligible, 'R1 seedCount != eligibleCount');
});

test('X2: test-count claims agree AND match the physical test-file count (guardian included)', () => {
  const readme = read('README.md');
  const acceptance = read('docs/ACCEPTANCE.md');
  const guardian = read('.opencode/agent/oposilab-guardian.md');

  const n = firstNumber(/(\d+) pruebas \/ \d+ suites/, readme, 'README pruebas');
  const m = firstNumber(/\d+ pruebas \/ (\d+) suites/, readme, 'README suites');
  const nAcc = firstNumber(/\*\*(\d+)\/\d+ en \d+ suites\*\*/, acceptance, 'ACCEPTANCE tests');
  const mAcc = firstNumber(/\*\*\d+\/\d+ en (\d+) suites\*\*/, acceptance, 'ACCEPTANCE suites');
  const nG = firstNumber(/\*\*(\d+) tests \/ \d+ suites\*\*/, guardian, 'guardian tests');
  const mG = firstNumber(/\*\*\d+ tests \/ (\d+) suites\*\*/, guardian, 'guardian suites');

  assert.equal(nAcc, n, 'ACCEPTANCE/README test counts disagree');
  assert.equal(nG, n, 'guardian/README test counts disagree');
  assert.equal(mAcc, m, 'ACCEPTANCE/README suite counts disagree');
  assert.equal(mG, m, 'guardian/README suite counts disagree');

  const physical = readdirSync(fileURLToPath(new URL('tests/', rootUrl)))
    .filter((f: string) => f.endsWith('.test.ts')).length;
  const gFiles = firstNumber(/(\d+) `\*\.test\.ts` files/, guardian, 'guardian file count');
  const accFiles = firstNumber(/(\d+) archivos en/, acceptance, 'ACCEPTANCE file count');
  assert.equal(gFiles, physical, 'guardian file count is stale');
  assert.equal(accFiles, physical, 'ACCEPTANCE file count is stale');
});

test('X3: matrix rows equal re-derived per-topic item counts (and sum to the seeded total)', () => {
  const matrix = read('docs/CONTENT-COVERAGE.md');
  const acceptance = read('docs/ACCEPTANCE.md');

  const t3 = distinctValues(/item-t3-\d+/g, read('server/seedDataTema3.ts'));
  const t15all = distinctValues(
    /item-t15-\d+/g,
    read('server/seedDataTema15.ts') + '\n' + read('server/seedDataTema15Extra.ts'),
  );
  const t9 = stemCount(read('server/seedDataTema9.ts'));
  const t8ip = stemCount(read('server/seedDataTema8IP.ts'));
  const t3g = stemCount(read('server/seedDataTema3General.ts'));
  const t8 = stemCount(read('server/seedDataTema8Items.ts'));
  const t1 = stemCount(read('server/seedDataTema1.ts'));
  const t7 = firstNumber(/seedData\.ts` \((\d+) ítems/, acceptance, 'ACCEPTANCE Tema 7 count');
  const retrieval = firstNumber(/\+ (\d+) de retrieval\/pretest/, acceptance, 'ACCEPTANCE retrieval count');

  const cell = (rowName: string): number => {
    const line = matrix.split('\n').find((l) => l.startsWith(`| ${rowName} `));
    assert.ok(line, `matrix row missing: ${rowName}`);
    return Number(line.split('|').map((c) => c.trim())[3]);
  };

  assert.equal(cell('Tema 7'), t7);
  assert.equal(cell('Tema 1'), t1);
  assert.equal(cell('Tema 3 específico'), t3);
  assert.equal(cell('Tema 8 específico'), t8);
  assert.equal(cell('Tema 8 II'), t8ip);
  assert.equal(cell('Tema 15') + cell('Tema 16'), t15all, 'T15+T16 split sum');
  assert.equal(cell('Tema 3 General'), t3g);
  assert.equal(cell('Tema 9'), t9);
  assert.equal(cell('retrieval/pretest'), retrieval);

  const seeded = firstNumber(/(\d+) ítems sembrados/, read('README.md'), 'README sembrados');
  assert.equal(t7 + t1 + t3 + t8 + t8ip + t15all + t3g + t9, seeded, 'matrix topics sum != README seeded');
});
