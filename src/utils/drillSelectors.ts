import { Item, ErrorLog, ConfusionPair, isPracticeEligible } from '../types.ts';
import { isNumericInterferenceItem } from './sniperFilter.ts';

export interface DrillSelectionOptions {
  /** Maximum number of items to return (default 12). */
  count?: number;
  /** Restrict to a single topic id; 'all'/undefined means the whole syllabus. */
  topicScope?: string | 'all';
}

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

/** Practice-eligible items, optionally scoped to one topic. */
function scopedPool(allItems: Item[], topicScope?: string | 'all'): Item[] {
  return allItems.filter(
    (item) =>
      isPracticeEligible(item) &&
      (!topicScope || topicScope === 'all' || item.topic_id === topicScope),
  );
}

/**
 * "Plazos y Cuantías" drill: practice-eligible items whose content is
 * numeric/deadline interference (same detector as the numeric sniper mode),
 * with the user's own E6 errors (wrong number/deadline/amount) first.
 *
 * Returns an empty array when the scope holds no numeric candidates, so the
 * caller can say so instead of silently serving unrelated questions under a
 * numeric-drill title.
 */
export function selectPlazosDrillItems(
  allItems: Item[],
  openErrors: ErrorLog[] = [],
  options: DrillSelectionOptions = {},
): Item[] {
  const { count = 12, topicScope } = options;
  const numeric = scopedPool(allItems, topicScope).filter(isNumericInterferenceItem);
  if (numeric.length === 0) return [];

  const numericErrorIds = new Set(
    openErrors.filter((e) => e.error_type_code === 'E6').map((e) => e.item_id),
  );
  const missed = shuffle(numeric.filter((i) => numericErrorIds.has(i.id)));
  const rest = shuffle(numeric.filter((i) => !numericErrorIds.has(i.id)));

  return [...missed, ...rest].slice(0, count);
}

/**
 * "Duelo de Conceptos" drill: items linked to a confusion pair, grouped so
 * that both sides of a pair land back to back (the duel round), with pairs
 * that carry open errors first — the live misconceptions — followed by
 * critical-severity pairs. Pairs are never interleaved with other pairs.
 *
 * Selection runs in two passes so one over-represented pair cannot swallow
 * the session: first every pair contributes a capped round (~a third of the
 * count, min 2 so a round is a real duel), then the best pairs are drained to
 * fill the remaining slots.
 *
 * If the linked pool cannot fill the requested count, the remainder is topped
 * up with concept-confusion-trap items (still duel-flavoured) rather than
 * unrelated filler; a short session is better than a diluted one.
 */
export function selectDuelDrillItems(
  allItems: Item[],
  openErrors: ErrorLog[] = [],
  confusionPairs: ConfusionPair[] = [],
  options: DrillSelectionOptions = {},
): Item[] {
  const { count = 12, topicScope } = options;
  const pool = scopedPool(allItems, topicScope).filter((i) => i.confusion_pair_id);
  if (pool.length === 0) return [];

  const errorsByItem = new Map<string, number>();
  for (const e of openErrors) {
    errorsByItem.set(e.item_id, (errorsByItem.get(e.item_id) ?? 0) + 1);
  }
  const severityByPair = new Map(confusionPairs.map((cp) => [cp.id, cp.severity]));

  const groups = new Map<string, Item[]>();
  for (const item of pool) {
    const key = item.confusion_pair_id as string;
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }

  const scored = shuffle(
    [...groups.entries()].map(([pairId, groupItems]) => {
      const liveErrors = groupItems.reduce((sum, i) => sum + (errorsByItem.get(i.id) ?? 0), 0);
      const critical = severityByPair.get(pairId) === 'critical' ? 1 : 0;
      return { groupItems, score: liveErrors * 10 + critical };
    }),
  );
  // Live misconceptions first, then critical pairs; the stable sort keeps the
  // shuffled order within each score tier so repeated sessions lead with a
  // different pair instead of always the same one.
  scored.sort((a, b) => b.score - a.score);

  const selected: Item[] = [];
  const seen = new Set<string>();
  const perPairCap = Math.max(2, Math.ceil(count / 3));

  // Pass 1: a capped round per pair, best pairs first (rotation).
  for (const { groupItems } of scored) {
    let takenFromPair = 0;
    for (const item of shuffle(groupItems)) {
      if (selected.length >= count || takenFromPair >= perPairCap) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      selected.push(item);
      takenFromPair++;
    }
    if (selected.length >= count) break;
  }

  // Pass 2: every pair has been sampled — drain the best pairs for the rest.
  if (selected.length < count) {
    for (const { groupItems } of scored) {
      for (const item of shuffle(groupItems)) {
        if (selected.length >= count) break;
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        selected.push(item);
      }
      if (selected.length >= count) break;
    }
  }

  if (selected.length < count) {
    const trapFlavoured = shuffle(
      scopedPool(allItems, topicScope).filter((i) => {
        if (seen.has(i.id)) return false;
        const traps = Array.isArray(i.trap_types)
          ? i.trap_types
          : i.trap_types
            ? Object.values(i.trap_types)
            : [];
        return (
          traps.includes('conceptual_merger') ||
          traps.includes('familiar_wording_trap') ||
          traps.includes('rule_exception_swap')
        );
      }),
    );
    for (const item of trapFlavoured) {
      if (selected.length >= count) break;
      seen.add(item.id);
      selected.push(item);
    }
  }

  return selected;
}
