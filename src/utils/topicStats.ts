import type { ActivityAttempt, ErrorLog, Item } from '../types.ts';

/**
 * Per-topic study statistics for the Temario cards.
 *
 * Extracted from `Dashboard` so the numbers can be unit-tested without a DOM:
 * the dashboard renders one card per topic, so a topic whose items are missing
 * from the input array renders `0 preguntas` — the exact phantom-zero symptom
 * reported in docs/UX-AUDIT-2026-11.md §3 (F1).
 *
 * `items` must therefore be the FULL bank, not a topic-filtered subset.
 */
export interface TopicStats {
  /** Items of this topic in the supplied array. */
  total: number;
  /** Open errors linked to this topic, directly or through one of its items. */
  errorsCount: number;
  /** Distinct items of this topic that have at least one attempt. */
  completed: number;
  /** Items answered correctly at least twice, with at least one confident answer. */
  graduated: number;
  /** 0-100 share of graduated items. */
  progressPct: number;
  /** 0-100 share of attempted items. */
  completedPct: number;
}

export function computeTopicStats(
  items: Item[],
  openErrors: ErrorLog[],
  attempts: ActivityAttempt[],
  topicId: string,
): TopicStats {
  const tItems = items.filter((i) => i.topic_id === topicId);
  const tErrors = openErrors.filter(
    (e) => e.topic_id === topicId || tItems.some((i) => i.id === e.item_id)
  );

  const tItemIds = new Set(tItems.map((i) => i.id));
  const tAttempts = attempts.filter((a) => tItemIds.has(a.item_id));
  const attemptedIds = new Set(tAttempts.map((a) => a.item_id));

  // Mastered items: at least 2 correct attempts with high confidence.
  const masteredIds = new Set<string>();
  for (const item of tItems) {
    const atts = tAttempts.filter((a) => a.item_id === item.id);
    const correctCount = atts.filter((a) => a.correct).length;
    if (correctCount >= 2 && atts.some((a) => a.confidence >= 2)) {
      masteredIds.add(item.id);
    }
  }

  const completed = attemptedIds.size;
  const graduated = masteredIds.size;
  const total = tItems.length;

  return {
    total,
    errorsCount: tErrors.length,
    completed,
    graduated,
    progressPct: total > 0 ? Math.round((graduated / total) * 100) : 0,
    completedPct: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
