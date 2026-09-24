import { Item, isPracticeEligible } from '../types.ts';

/** Keep only items whose status permits practice (validated / active). */
export function eligibleForPractice(items: Item[]): Item[] {
  return items.filter(isPracticeEligible);
}

function shuffleWithin<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

/**
 * Build a diagnostic pretest pool: eligible-only, `pretest_item` first, then a
 * round-robin across clusters (shuffled within each cluster) with a hard cap.
 */
export function buildPretestPool(items: Item[], count = 10): Item[] {
  const eligible = eligibleForPractice(items);
  const pretestItems = shuffleWithin(
    eligible.filter((item) => item.item_type === 'pretest_item'),
  );
  const remainder = eligible.filter((item) => item.item_type !== 'pretest_item');

  const buckets = new Map<string, Item[]>();
  for (const item of remainder) {
    const key = item.cluster_id || `item:${item.id}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }

  const orderedBuckets = shuffleWithin([...buckets.values()]).map((bucket) => shuffleWithin(bucket));
  const roundRobin: Item[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const bucket of orderedBuckets) {
      const next = bucket.shift();
      if (next) {
        roundRobin.push(next);
        added = true;
      }
    }
  }

  return [...pretestItems, ...roundRobin].slice(0, count);
}
