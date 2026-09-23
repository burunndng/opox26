import { Item, ErrorLog, ConfusionPair, TrapType } from '../types.ts';

export type SniperModeType = 'numeric' | 'confident_wrong' | 'mixed';

export interface SniperSelectionOptions {
  subType?: SniperModeType;
  count?: number;
  topicScope?: string | 'all';
  confusionPairs?: ConfusionPair[];
}

/**
 * Safely extracts all trap types from an item regardless of format (array or dictionary)
 */
export function getItemTrapTypes(item: Item): string[] {
  if (!item.trap_types) return [];
  if (Array.isArray(item.trap_types)) {
    return item.trap_types as string[];
  }
  return Object.values(item.trap_types) as string[];
}

/**
 * Checks if an item belongs to numeric/deadline interference clusters or contains numeric cues
 */
export function isNumericInterferenceItem(item: Item): boolean {
  if (item.item_type === 'number_sort') return true;
  if (item.cognitive_operations?.includes('numeric_precision')) return true;

  const clusterId = (item.cluster_id || '').toLowerCase();
  if (
    clusterId.includes('revalorizacion') ||
    clusterId.includes('coeficiente') ||
    clusterId.includes('prescripcion') ||
    clusterId.includes('embargo') ||
    clusterId.includes('numero') ||
    clusterId.includes('plazo')
  ) {
    return true;
  }

  // Check trap types safely
  const trapTypes = getItemTrapTypes(item);
  if (trapTypes.includes('numeric_substitution') || trapTypes.includes('temporal_confusion')) {
    return true;
  }

  // Check text cues in stem or answers
  const textCues = [
    '1,4',
    '1,5',
    '5 años',
    '1 año',
    '3 meses',
    '30 días',
    '2,7%',
    '8.803,20',
    '9.442',
    '11.013',
    '3.359,60',
    '47.034,40',
    '30%',
    '50%',
    '60%',
    '75%',
    '90%',
    '112 días',
    '14 días',
    'plazo',
    'coeficiente',
    'porcentaje',
    'cuantía',
    'días naturales',
  ];

  const fullText = `${item.stem} ${item.correct_answer || ''} ${item.why_correct || ''} ${JSON.stringify(
    item.options || []
  )}`.toLowerCase();

  return textCues.some((cue) => fullText.includes(cue.toLowerCase()));
}

/**
 * Selects items for the high-intensity Drill Sniper sprints
 */
export function selectSniperItems(
  allItems: Item[],
  openErrors: ErrorLog[] = [],
  confusionPairsOrOptions?: ConfusionPair[] | SniperSelectionOptions,
  typeArg?: SniperModeType,
  countArg?: number,
  topicScopeArg?: string | 'all'
): Item[] {
  let confusionPairs: ConfusionPair[] = [];
  let type: SniperModeType = 'mixed';
  let count = 10;
  let topicScope: string | 'all' = 'all';

  if (confusionPairsOrOptions && !Array.isArray(confusionPairsOrOptions)) {
    const opts = confusionPairsOrOptions as SniperSelectionOptions;
    type = opts.subType || 'mixed';
    count = opts.count || 10;
    topicScope = opts.topicScope || 'all';
    confusionPairs = opts.confusionPairs || [];
  } else {
    confusionPairs = (confusionPairsOrOptions as ConfusionPair[]) || [];
    type = typeArg || 'mixed';
    count = countArg || 10;
    topicScope = topicScopeArg || 'all';
  }

  const pool =
    topicScope && topicScope !== 'all'
      ? allItems.filter((i) => i.topic_id === topicScope)
      : allItems;

  if (pool.length === 0) return [];

  // Shuffle helper
  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

  if (type === 'numeric') {
    const numericItems = pool.filter(isNumericInterferenceItem);
    const candidatePool = numericItems.length >= count ? numericItems : pool;
    return shuffle(candidatePool).slice(0, count);
  }

  if (type === 'confident_wrong') {
    // 1. Look for user errors recorded with confidence 3 (E8)
    const confidentWrongErrorIds = new Set(
      openErrors.filter((e) => e.confidence === 3 || e.error_type_code === 'E8').map((e) => e.item_id)
    );

    const userConfidentWrongItems = pool.filter((i) => confidentWrongErrorIds.has(i.id));

    // 2. Supplement with errors with confidence 2
    const conf2ErrorIds = new Set(
      openErrors.filter((e) => e.confidence === 2).map((e) => e.item_id)
    );
    const userConf2Items = pool.filter(
      (i) => conf2ErrorIds.has(i.id) && !confidentWrongErrorIds.has(i.id)
    );

    // 3. Supplement with items engineered around critical confusion pairs / high-trap distractors
    const criticalPairIds = new Set(
      confusionPairs.filter((cp) => cp.severity === 'critical').map((cp) => cp.id)
    );

    const criticalItems = pool.filter(
      (i) =>
        i.confusion_pair_id &&
        criticalPairIds.has(i.confusion_pair_id) &&
        !confidentWrongErrorIds.has(i.id) &&
        !conf2ErrorIds.has(i.id)
    );

    // Fallback: items with subtle traps (familiar_wording, conceptual_merger)
    const subtleTrapItems = pool.filter((i) => {
      const traps = getItemTrapTypes(i);
      return (
        traps.includes('familiar_wording_trap') ||
        traps.includes('conceptual_merger') ||
        traps.includes('rule_exception_swap')
      );
    });

    const combined = [
      ...shuffle(userConfidentWrongItems),
      ...shuffle(userConf2Items),
      ...shuffle(criticalItems),
      ...shuffle(subtleTrapItems),
      ...shuffle(pool),
    ];

    // Remove duplicates preserving priority order
    const seen = new Set<string>();
    const result: Item[] = [];
    for (const itm of combined) {
      if (!seen.has(itm.id)) {
        seen.add(itm.id);
        result.push(itm);
        if (result.length >= count) break;
      }
    }
    return result;
  }

  // Type: 'mixed'
  const numItems = selectSniperItems(pool, openErrors, confusionPairs, 'numeric', count, topicScope);
  const confItems = selectSniperItems(pool, openErrors, confusionPairs, 'confident_wrong', count, topicScope);

  const mixed: Item[] = [];
  const seenIds = new Set<string>();

  let nIdx = 0;
  let cIdx = 0;

  while (mixed.length < count && (nIdx < numItems.length || cIdx < confItems.length)) {
    if (nIdx < numItems.length && !seenIds.has(numItems[nIdx].id)) {
      seenIds.add(numItems[nIdx].id);
      mixed.push(numItems[nIdx]);
    }
    nIdx++;

    if (mixed.length < count && cIdx < confItems.length && !seenIds.has(confItems[cIdx].id)) {
      seenIds.add(confItems[cIdx].id);
      mixed.push(confItems[cIdx]);
    }
    cIdx++;
  }

  if (mixed.length < count) {
    for (const itm of shuffle(pool)) {
      if (!seenIds.has(itm.id)) {
        seenIds.add(itm.id);
        mixed.push(itm);
        if (mixed.length >= count) break;
      }
    }
  }

  return mixed.slice(0, count);
}
