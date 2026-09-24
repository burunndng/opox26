import type { ActivityAttempt, Item, ReviewSchedule } from '../src/types.ts';

interface ScoredCandidate {
  item: Item;
  score: number;
}

interface ScheduledCandidate extends ScoredCandidate {
  schedule: ReviewSchedule;
}

function runLength<T>(ordered: T[], key: (entry: T) => string | undefined): number {
  if (ordered.length === 0) return 0;
  const lastValue = key(ordered[ordered.length - 1]);
  if (!lastValue) return 0;

  let length = 1;
  for (let index = ordered.length - 2; index >= 0; index--) {
    if (key(ordered[index]) !== lastValue) break;
    length++;
  }
  return length;
}

/**
 * Reorders scored candidates to avoid runs longer than the configured limits,
 * taking the highest-ranked candidate that does not violate a constraint at each
 * step. Input must be in score order. Missing `cluster_id` is treated as unique
 * per item. When no candidate can satisfy both constraints, the highest-ranked
 * remaining candidate is chosen deterministically.
 */
export function interleaveByType<T extends { item: Item; score: number }>(
  items: T[],
  maxRunPerType = 2,
  maxRunPerCluster = 2,
): T[] {
  const remaining = [...items];
  const ordered: T[] = [];

  while (remaining.length > 0) {
    let chosenIndex = -1;

    for (let index = 0; index < remaining.length; index++) {
      const candidate = remaining[index];
      if (runLength(ordered, (entry) => entry.item.item_type) >= maxRunPerType) {
        if (candidate.item.item_type === ordered[ordered.length - 1].item.item_type) continue;
      }
      const cluster = candidate.item.cluster_id;
      if (
        cluster &&
        runLength(ordered, (entry) => entry.item.cluster_id) >= maxRunPerCluster &&
        cluster === ordered[ordered.length - 1].item.cluster_id
      ) {
        continue;
      }
      chosenIndex = index;
      break;
    }

    if (chosenIndex === -1) chosenIndex = 0;

    ordered.push(remaining[chosenIndex]);
    remaining.splice(chosenIndex, 1);
  }

  return ordered;
}

/**
 * Counts distinct item IDs whose earliest recorded attempt happened on the
 * current local calendar date. Uses attempts only, so an item whose schedule
 * already advanced from `new` to `review` still counts.
 */
export function countNewItemsSeenToday(
  attempts: ActivityAttempt[],
  now: Date = new Date(),
): number {
  const earliestByItem = new Map<string, number>();

  for (const attempt of attempts) {
    if (!attempt.item_id) continue;
    const time = new Date(attempt.created_at).getTime();
    if (Number.isNaN(time)) continue;
    const current = earliestByItem.get(attempt.item_id);
    if (current === undefined || time < current) earliestByItem.set(attempt.item_id, time);
  }

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();

  let count = 0;
  for (const time of earliestByItem.values()) {
    if (time >= dayStart && time < dayEnd) count++;
  }
  return count;
}

/**
 * Caps the number of `new`-state candidates to the remaining daily allowance
 * while preserving the relative order of every retained candidate.
 */
export function capNewItems<T extends { item: Item; schedule: ReviewSchedule; score: number }>(
  items: T[],
  newSeenToday: number,
  maxNew: number,
): T[] {
  const allowedNew = Math.max(0, maxNew - newSeenToday);
  let usedNew = 0;
  const retained: T[] = [];

  for (const candidate of items) {
    if (candidate.schedule.state === 'new') {
      if (usedNew >= allowedNew) continue;
      usedNew++;
    }
    retained.push(candidate);
  }

  return retained;
}

export type { ScoredCandidate, ScheduledCandidate };
