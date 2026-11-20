import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StudySetup } from '../src/components/StudySetup.tsx';
import {
  seedItems,
  seedAtoms,
  seedClusters,
  seedConfusionPairs,
  seedTopics,
} from '../server/seedData.ts';
import { seedItemsRetrieval } from '../server/seedDataRetrieval.ts';
import type { Item } from '../src/types.ts';
import { computeTopicStats } from '../src/utils/topicStats.ts';
import { scopeItems, scopeTopicId } from '../src/utils/topicScope.ts';

const allSeedItems: Item[] = [...seedItems, ...seedItemsRetrieval];

describe('Topic count truth (P0 regression for phantom zeros)', () => {
  test('every seeded topic has at least one item in the full bank', () => {
    // The phantom-zero bug rendered "0 preguntas" for any topic whose items
    // were filtered out of the array the UI counted from. The bank itself must
    // never be empty for a seeded topic, so a "0" on screen is never legitimate.
    for (const topic of seedTopics) {
      const count = allSeedItems.filter((i) => i.topic_id === topic.id).length;
      assert.ok(
        count > 0,
        `seeded topic ${topic.id} (${topic.name}) has zero items in the bank`,
      );
    }
  });

  test('per-topic counts sum to the total bank size', () => {
    const byTopic = new Map<string, number>();
    for (const item of allSeedItems) {
      byTopic.set(item.topic_id, (byTopic.get(item.topic_id) ?? 0) + 1);
    }
    const sum = [...byTopic.values()].reduce((a, b) => a + b, 0);
    assert.equal(sum, allSeedItems.length, 'per-topic counts must sum to the bank total');
  });

  test('computeTopicStats reports the true per-topic total from the full bank', () => {
    // With the full bank, every seeded topic gets its real count — never 0.
    for (const topic of seedTopics) {
      const stats = computeTopicStats(allSeedItems, [], [], topic.id);
      const expected = allSeedItems.filter((i) => i.topic_id === topic.id).length;
      assert.equal(
        stats.total,
        expected,
        `computeTopicStats for ${topic.id} should count all of its items, not a subset`,
      );
      assert.ok(stats.total > 0, `${topic.id} must not render "0 preguntas"`);
    }
  });

  test('a topic-filtered array is what causes the phantom zero (regression guard)', () => {
    // Documenting the bug's mechanism: counting from a filtered array yields
    // zero for every topic but the selected one. The fix is to count from the
    // full bank — the helper above must never be fed a scoped subset.
    const topic = seedTopics[0];
    const scoped = allSeedItems.filter((i) => i.topic_id === topic.id);
    const stats = computeTopicStats(scoped, [], [], seedTopics[1].id);
    assert.equal(stats.total, 0, 'a scoped array must not be used to render global counts');
  });
});

describe('Study scope helpers (P0 regression for scope preservation)', () => {
  test('an empty topic shows a content action and disables starting the default test', () => {
    const noop = () => {};
    const html = renderToStaticMarkup(React.createElement(StudySetup, {
      topics: [{ id: 'empty', name: 'Tema vacío' } as any],
      selectedTopicId: 'empty',
      onSelectTopic: noop,
      dueCount: 0,
      eligibleCount: 0,
      onGoToContent: noop,
      openErrorsCount: 0,
      onStartDue: noop,
      onGoToErrors: noop,
      onStartSimulacro: noop,
      onOpenInterleaved: noop,
      onStartPretest: noop,
      onStartPlazosDrill: noop,
      onStartDuel: noop,
      onStartGuided: noop,
    }));
    assert.match(html, /No hay preguntas disponibles para practicar en Tema vacío/);
    assert.match(html, /Ir a Contenidos/);
    assert.match(html, /<button[^>]*disabled=""[^>]*>.*?Empezar test/);
  });
  test('scopeTopicId returns undefined for the whole syllabus', () => {
    assert.equal(scopeTopicId('all'), undefined);
  });

  test('scopeTopicId returns the topic id for a scoped selection', () => {
    assert.equal(scopeTopicId('topic-42'), 'topic-42');
  });

  test('scopeItems returns the whole bank when unscoped', () => {
    assert.equal(scopeItems(allSeedItems, 'all').length, allSeedItems.length);
  });

  test('scopeItems narrows to exactly one topic', () => {
    const topic = seedTopics[0].id;
    const scoped = scopeItems(allSeedItems, topic);
    assert.ok(scoped.length > 0);
    assert.ok(scoped.every((i) => i.topic_id === topic));
    assert.equal(scoped.length, allSeedItems.filter((i) => i.topic_id === topic).length);
  });

  test('drill selectors still honor topicScope over the global bank', async () => {
    const { selectSniperItems } = await import('../src/utils/sniperFilter.ts');
    const { selectPlazosDrillItems, selectDuelDrillItems } = await import(
      '../src/utils/drillSelectors.ts'
    );
    const topic = seedTopics[0].id;
    const pool = allSeedItems.filter((i) => i.topic_id === topic).slice(0, 40);
    const mixedPool = [...allSeedItems].slice(0, 60);
    const sniper = selectSniperItems(mixedPool, [], {
      subType: 'mixed',
      count: 5,
      topicScope: topic,
    });
    assert.ok(sniper.length > 0);
    assert.ok(sniper.every((i) => i.topic_id === topic));
    const plazos = selectPlazosDrillItems(mixedPool, [], { count: 5, topicScope: topic });
    assert.ok(plazos.every((i) => i.topic_id === topic));
    const duel = selectDuelDrillItems(mixedPool, [], [], { count: 5, topicScope: topic });
    assert.ok(duel.every((i) => i.topic_id === topic));
  });
});

describe('UI count truth — wiring guard (P0 regression)', () => {
  test('App.tsx fetches the item bank unfiltered', () => {
    const appSource = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/App.tsx'),
      'utf8',
    );
    // The bank must be fetched whole: a topic-filtered fetch is what made
    // every non-selected topic render "0 preguntas".
    assert.ok(
      /api\.getItems\(\)/.test(appSource),
      'App.tsx must call api.getItems() without a topic filter so counts stay true',
    );
    assert.ok(
      !/getItems\([^)]*topic_id/.test(appSource),
      'App.tsx must not pass a topic_id filter to getItems()',
    );
  });

  test('App.tsx applies topic scope explicitly to the sniper drill', () => {
    const appSource = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/App.tsx'),
      'utf8',
    );
    assert.ok(
      /selectSniperItems\([\s\S]*topicScope/.test(appSource),
      'handleStartSniper must pass topicScope now that items is the global bank',
    );
  });

  test('Dashboard derives per-topic counts from the shared helper (not an inline filter)', () => {
    const dashboardSource = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/components/Dashboard.tsx'),
      'utf8',
    );
    assert.ok(
      /computeTopicStats/.test(dashboardSource),
      'Dashboard must use computeTopicStats so per-topic counts are tested and truthful',
    );
  });
});
