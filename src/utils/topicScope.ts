import type { Item } from '../types.ts';

/**
 * Topic scope helpers.
 *
 * The bank (items, atoms, clusters, confusion pairs) is GLOBAL truth: it is
 * fetched unfiltered so that every topic card, bank filter and audit counter
 * shows real numbers. The scope is then applied EXPLICITLY at the points
 * where the user asked for a narrower session (drills, pretest, repair).
 *
 * Why this module exists: `App.tsx` used to fetch the bank already filtered
 * by the selected topic and then render per-topic counters from that
 * subset, so every other topic displayed "0 preguntas"
 * (docs/UX-AUDIT-2026-11.md §3, F1). Scoping now lives here, where it can
 * be unit-tested.
 */

/** A topic id, or 'all' for the whole syllabus. */
export type TopicScope = string | 'all';

/** True when the scope narrows the syllabus to a single topic. */
export function isScoped(scope: TopicScope | undefined): boolean {
  return !!scope && scope !== 'all';
}

/**
 * The topic id a scope points at, or `undefined` when the scope is the whole
 * syllabus. `undefined` is what the API and the selectors expect for "no
 * narrowing".
 */
export function scopeTopicId(scope: TopicScope | undefined): string | undefined {
  return isScoped(scope) ? (scope as string) : undefined;
}

/**
 * Records narrowed to the scope topic. Records without a `topic_id` are kept:
 * they are global by nature (e.g. the retrieval/pretest pool).
 */
export function scopeByTopic<T extends { topic_id?: string }>(
  records: T[],
  scope: TopicScope | undefined,
): T[] {
  const topicId = scopeTopicId(scope);
  if (!topicId) return records;
  return records.filter((r) => !r.topic_id || r.topic_id === topicId);
}

/** Items narrowed to the scope topic. */
export function scopeItems(items: Item[], scope: TopicScope | undefined): Item[] {
  return scopeByTopic(items, scope);
}
