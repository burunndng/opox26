import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  RUNNER_COVERAGE_CHECK,
  RUNNER_RENDERED_ITEM_TYPES,
} from '../src/utils/runnerRenderCoverage.ts';
import { seedItems } from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';

const runnerSource = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/components/ActivityRunner.tsx'),
  'utf8',
);

describe('ActivityRunner renderer coverage', () => {
  test('compile-time coverage sanity guard holds at runtime', () => {
    assert.equal(RUNNER_COVERAGE_CHECK, true);
  });

  test('every seeded item type has a registered runner renderer', () => {
    const covered = RUNNER_RENDERED_ITEM_TYPES as readonly string[];
    for (const item of [...seedItems, ...seedItemsRetrieval]) {
      assert.ok(
        covered.includes(item.item_type),
        `${item.id}: item type ${item.item_type} has no registered renderer`
      );
    }
  });

  test('every registered type has a render condition in ActivityRunner source', () => {
    for (const itemType of RUNNER_RENDERED_ITEM_TYPES) {
      assert.ok(
        runnerSource.includes(`item_type === '${itemType}'`),
        `no render condition found for ${itemType} in ActivityRunner.tsx`
      );
    }
  });

  test('unsupported-type fallback guard is present in the runner', () => {
    assert.ok(
      runnerSource.includes('RUNNER_RENDERED_ITEM_TYPES.includes'),
      'runtime fallback guard for unrendered types is missing'
    );
  });

  test('handoff attempt records the free-text retrieval answer', () => {
    // Covers the P0 regression where generatedAnswer was never passed through
    // ActivityRunner, so retrieval_prompt/pretest_item scored as empty text.
    const passesGeneratedAnswer = runnerSource.includes(
      'userReasoning,\n        generatedAnswer,'
    );
    const hasFreeTextPath = runnerSource.includes('isFreeTextRetrieval');
    assert.ok(passesGeneratedAnswer, 'generatedAnswer must be passed to evaluateItem');
    assert.ok(hasFreeTextPath, 'isFreeTextRetrieval path missing from ActivityRunner');
  });
});
