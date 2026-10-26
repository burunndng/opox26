import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  seedItems,
  seedAtoms,
  seedClusters,
  seedConfusionPairs,
  seedTopics,
} from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';
import type { Item } from '../src/types.ts';

const allSeedItems = [...seedItems, ...seedItemsRetrieval];
const standardMcqTypes = new Set<Item['item_type']>(['cover_and_generate_mcq', 'pretest_item']);

function standardMcqItems(): Item[] {
  return allSeedItems.filter((item) => standardMcqTypes.has(item.item_type));
}

function normalizedStem(stem: string): string {
  return stem
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function contentStemForDuplicateCheck(item: Item): string {
  if (item.item_type === 'spot_error') {
    return `${item.stem} ${item.spot_error_data?.full_statement ?? item.spot_error_data?.statement ?? ''}`;
  }

  if (item.item_type === 'two_tier') {
    const tier1Prompt =
      item.two_tier_data?.tier1?.prompt ?? item.two_tier_data?.tier1_question ?? '';
    return `${item.stem} ${tier1Prompt}`;
  }

  return item.stem;
}

function hasYearLinkedAmountOrPercentage(item: Item): boolean {
  const text = [
    item.stem,
    item.rule_statement,
    item.correct_answer,
    ...(item.options ?? []).map((option) => option.text),
  ]
    .filter(Boolean)
    .join(' ');

  return /\b20\d{2}\b/.test(text) && /\d[\d.,]*\s*(?:€|euros?|%|por ciento)/i.test(text);
}

describe('Seed-bank integrity', () => {
  test('F1: each standard MCQ and two-tier tier has one correct option and unique stable IDs', () => {
    const failures: string[] = [];

    for (const item of allSeedItems) {
      const choiceSets: Array<{ name: string; options: Array<{ id: string; is_correct: boolean }> }> = [];

      if (standardMcqTypes.has(item.item_type) && item.options?.length) {
        choiceSets.push({ name: 'options', options: item.options ?? [] });
      }

      if (item.item_type === 'two_tier') {
        const tier1 =
          item.two_tier_data?.tier1?.options ??
          item.two_tier_data?.tier1_options ??
          item.options ??
          [];
        const tier2 =
          item.two_tier_data?.tier2?.options ??
          item.two_tier_data?.tier2_options ??
          [];
        if (tier1.length) choiceSets.push({ name: 'tier1', options: tier1 });
        if (tier2.length) choiceSets.push({ name: 'tier2', options: tier2 });
      }

      for (const { name, options } of choiceSets) {
        const ids = options.map((option) => option.id);
        const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
        const correctCount = options.filter((option) => option.is_correct).length;
        if (correctCount !== 1 || ids.some((id) => !id) || duplicateIds.length > 0) {
          failures.push(
            `${item.id} ${name}: correct=${correctCount}, duplicate IDs=${duplicateIds.join(',') || 'none'}`,
          );
        }
      }
    }

    assert.deepEqual(failures, [], `Invalid choice sets:\n${failures.join('\n')}`);
  });

  test('F2: canonical correct-option positions stay at or below 40%', () => {
    const items = standardMcqItems().filter((item) => item.options?.length);
    const positions = Array.from({ length: Math.max(...items.map((item) => item.options!.length)) }, () => [] as string[]);
    const canonicalCycle = [0, 1, 3, 2, 0, 2, 1, 3];
    const incorrectCycleItems: string[] = [];

    for (const [index, item] of items.entries()) {
      const correctPosition = item.options!.findIndex((option) => option.is_correct);
      if (correctPosition >= 0) positions[correctPosition].push(item.id);
      if (correctPosition !== canonicalCycle[index % canonicalCycle.length]) {
        incorrectCycleItems.push(item.id);
      }
    }

    const maxPerPosition = Math.floor(items.length * 0.4 + Number.EPSILON);
    const failures = positions
      .map((ids, index) => ({ ids, index }))
      .filter(({ ids }) => ids.length > maxPerPosition)
      .map(
        ({ ids, index }) =>
          `position ${String.fromCharCode(65 + index)}: ${ids.length}/${items.length} [${ids.join(', ')}]`,
      );

    assert.deepEqual(
      failures,
      [],
      `Overrepresented correct positions:\n${failures.join('\n')}\nCanonical cycle mismatches: ${incorrectCycleItems.join(', ')}`,
    );
    assert.deepEqual(incorrectCycleItems, [], `Canonical position cycle mismatches: ${incorrectCycleItems.join(', ')}`);
  });

  test('F3: no standard MCQ correct answer is over 1.25x the mean distractor length', () => {
    const failures = standardMcqItems().flatMap((item) => {
      const options = item.options ?? [];
      const correctOptions = options.filter((option) => option.is_correct);
      const distractors = options.filter((option) => !option.is_correct);
      if (correctOptions.length !== 1 || distractors.length === 0) return [];

      const correctLength = correctOptions[0].text.trim().length;
      const meanDistractorLength =
        distractors.reduce((total, option) => total + option.text.trim().length, 0) / distractors.length;
      return correctLength > meanDistractorLength * 1.25 ? [item.id] : [];
    });

    assert.deepEqual(failures, [], `Correct options exceed the length threshold: ${failures.join(', ')}`);
  });

  test('F4: every standard MCQ distractor has an explanation and trap type', () => {
    const failures = standardMcqItems().flatMap((item) =>
      (item.options ?? [])
        .filter((option) => !option.is_correct && (!option.explanation?.trim() || !option.trap_type))
        .map((option) => `${item.id}/${option.id}`),
    );

    assert.deepEqual(failures, [], `Distractors missing diagnostics: ${failures.join(', ')}`);
  });

  test('F5: every seed item has a non-empty legal basis', () => {
    const failures = allSeedItems
      .filter((item) => !item.legal_basis?.trim())
      .map((item) => item.id);

    assert.deepEqual(failures, [], `Missing legal basis: ${failures.join(', ')}`);
  });

  test('F6: normalized full stems are unique within each item type', () => {
    const seen = new Map<string, Item>();
    const failures: string[] = [];

    for (const item of allSeedItems) {
      const key = `${item.item_type}:${normalizedStem(contentStemForDuplicateCheck(item))}`;
      const previous = seen.get(key);
      if (previous) failures.push(`${previous.id} and ${item.id} (${item.item_type})`);
      else seen.set(key, item);
    }

    assert.deepEqual(failures, [], `Duplicate normalized stems:\n${failures.join('\n')}`);
  });

  test('F7: every year-linked figure and every 2026-amount item has a figure status', () => {
    const failures = allSeedItems
      .filter(
        (item) =>
          (item.cluster_id === 'cluster_importes_2026' || hasYearLinkedAmountOrPercentage(item)) &&
          item.figure_status !== 'BOE_VERIFIED' &&
          item.figure_status !== 'ESTIMATED_LPGE',
      )
      .map((item) => item.id);

    assert.deepEqual(failures, [], `Missing figure status: ${failures.join(', ')}`);
  });

  test('F8: every cluster_id referenced in seed items and atoms exists in seedClusters', () => {
    const clusterIds = new Set(seedClusters.map((cluster) => cluster.id));
    const failures: string[] = [];

    for (const item of allSeedItems) {
      if (item.cluster_id && !clusterIds.has(item.cluster_id)) {
        failures.push(`item ${item.id} -> ${item.cluster_id}`);
      }
    }
    for (const atom of seedAtoms) {
      const clusterId = atom.cluster_id ?? atom.cluster;
      if (clusterId && !clusterIds.has(clusterId)) {
        failures.push(`atom ${atom.id} -> ${clusterId}`);
      }
    }

    assert.deepEqual(failures, [], `Dangling cluster references:\n${failures.join('\n')}`);
  });

  test('F9: every confusion_pair_id referenced in seed items and atoms exists in seedConfusionPairs', () => {
    const pairIds = new Set(seedConfusionPairs.map((pair) => pair.id));
    const failures: string[] = [];

    for (const item of allSeedItems) {
      if (item.confusion_pair_id && !pairIds.has(item.confusion_pair_id)) {
        failures.push(`item ${item.id} -> ${item.confusion_pair_id}`);
      }
    }
    for (const atom of seedAtoms) {
      const pairId = atom.confusion_pair_id ?? atom.pair;
      if (pairId && !pairIds.has(pairId)) {
        failures.push(`atom ${atom.id} -> ${pairId}`);
      }
    }

    assert.deepEqual(failures, [], `Dangling confusion-pair references:\n${failures.join('\n')}`);
  });

  test('F10: every seed atom has a known topic_id and a numeric difficulty', () => {
    const topicIds = new Set(seedTopics.map((topic) => topic.id));
    const failures = seedAtoms
      .filter(
        (atom) =>
          !atom.topic_id ||
          !topicIds.has(atom.topic_id) ||
          typeof (atom.difficulty ?? atom.diff) !== 'number',
      )
      .map((atom) => atom.id);

    assert.deepEqual(failures, [], `Atoms failing provenance/difficulty checks: ${failures.join(', ')}`);
  });
});
