import { db } from '../../server/db.ts';
import { seedItems, seedAtoms } from '../../server/seedData.ts';
import { seedItemsRetrieval } from '../../server/seedDataRetrieval.ts';
import { isPracticeEligible } from '../../src/types.ts';

const [mode = 'snapshot', targetId = ''] = process.argv.slice(2);
const seeds = [...seedItems, ...seedItemsRetrieval];

const FORMAT_FIELDS = [
  'options',
  'number_sort_data',
  'contrast_data',
  'exception_tree_data',
  'two_tier_data',
  'fact_variant_data',
] as const;

// The parent test sets OPOSILAB_DATA_DIR before this child process imports db.ts.
const data = db.getAllData();

if (mode === 'set-draft' || mode === 'set-draft-with-attempt') {
  const seed = data.items.find((item) => item.id === targetId);
  if (!seed) throw new Error(`Missing seed item ${targetId}`);
  db.updateItem(targetId, { status: 'draft', figure_status: 'ESTIMATED_LPGE' });

  if (mode === 'set-draft-with-attempt') {
    db.recordAttempt({
      item_id: targetId,
      activity_type: seed.item_type,
      confidence: 1,
      correct: true,
      used_hint: false,
      was_interleaved: false,
      was_timed: false,
    });
  }
}

if (mode === 'set-stale-citation' || mode === 'set-stale-citation-with-attempt') {
  const seed = data.items.find((item) => item.id === targetId);
  if (!seed) throw new Error(`Missing seed item ${targetId}`);
  const seedAny = seed as any;
  db.updateItem(targetId, {
    legal_basis: 'Art. 000 STALE',
    rule_statement: 'STALE rule',
    why_correct: 'STALE why',
    corrective_rule: 'STALE corrective',
    ...(seedAny.cloze_data
      ? {
          cloze_data: {
            ...seedAny.cloze_data,
            blanks: seedAny.cloze_data.blanks.map((b: any) => ({
              ...b,
              explanation: 'STALE explanation',
            })),
          },
        }
      : {}),
    ...(seedAny.spot_error_data
      ? {
          spot_error_data: {
            ...seedAny.spot_error_data,
            explanation: 'STALE explanation',
          },
        }
      : {}),
  });

  if (mode === 'set-stale-citation-with-attempt') {
    db.recordAttempt({
      item_id: targetId,
      activity_type: seed.item_type,
      confidence: 1,
      correct: true,
      used_hint: false,
      was_interleaved: false,
      was_timed: false,
    });
  }
}

if (mode === 'set-stale-atom') {
  const seed = data.atoms.find((atom) => atom.id === targetId);
  if (!seed) throw new Error(`Missing seed atom ${targetId}`);
  db.updateAtom(targetId, {
    text: 'STALE atom text',
    legal: 'Art. 000 STALE',
    legal_basis: 'Art. 000 STALE',
  });
}

if (mode === 'set-stale-format-data' || mode === 'set-stale-format-data-with-attempt') {
  const seed = data.items.find((item) => item.id === targetId);
  if (!seed) throw new Error(`Missing seed item ${targetId}`);
  const seedAny = seed as any;
  const stale = (value: any): any => {
    if (typeof value === 'string') return 'STALE format data';
    if (Array.isArray(value)) return value.map(stale);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stale(v)]));
    }
    return value;
  };
  const field = FORMAT_FIELDS.find((candidate) => seedAny[candidate]);
  if (!field) throw new Error(`Item ${targetId} has no nested format data field`);
  db.updateItem(targetId, { [field]: stale(seedAny[field]) } as any);

  if (mode === 'set-stale-format-data-with-attempt') {
    db.recordAttempt({
      item_id: targetId,
      activity_type: seed.item_type,
      confidence: 1,
      correct: true,
      used_hint: false,
      was_interleaved: false,
      was_timed: false,
    });
  }
}

const updatedData = db.getAllData();
const seedIds = new Set(seeds.map((item) => item.id));
const seedRecords = updatedData.items.filter((item) => seedIds.has(item.id));
const target = targetId ? updatedData.items.find((item) => item.id === targetId) : undefined;
const seedDef = targetId ? seeds.find((item) => item.id === targetId) : undefined;

function citationContent(item: any) {
  if (!item) return null;
  const itemAny = item as any;
  return {
    legal_basis: itemAny.legal_basis ?? null,
    rule_statement: itemAny.rule_statement ?? null,
    why_correct: itemAny.why_correct ?? null,
    corrective_rule: itemAny.corrective_rule ?? null,
    explanation:
      itemAny.cloze_data?.blanks?.[0]?.explanation ??
      itemAny.spot_error_data?.explanation ??
      null,
  };
}

function formatData(item: any) {
  if (!item) return null;
  const field = FORMAT_FIELDS.find((candidate) => (item as any)[candidate]);
  return field ? { field, value: (item as any)[field] } : null;
}

function atomContent(atom: any) {
  if (!atom) return null;
  return {
    text: atom.text ?? null,
    legal_basis: atom.legal_basis ?? atom.legal ?? null,
  };
}

const seedAtomDef = targetId ? seedAtoms.find((atom) => atom.id === targetId) : undefined;

const state = {
  seedCount: seedRecords.length,
  eligibleCount: seedRecords.filter(isPracticeEligible).length,
  draftIds: seedRecords.filter((item) => item.status === 'draft').map((item) => item.id),
  targetStatus: target?.status ?? null,
  targetFigureStatus: target?.figure_status ?? null,
  targetAttemptCount: updatedData.activityAttempts.filter((attempt) => attempt.item_id === targetId).length,
  targetContent: citationContent(target),
  seedContent: citationContent(seedDef),
  targetFormatData: formatData(target),
  seedFormatData: formatData(seedDef),
  targetAtom: atomContent(
    targetId ? updatedData.atoms.find((atom) => atom.id === targetId) : undefined
  ),
  seedAtom: atomContent(seedAtomDef),
};

console.log(`###SEED_STATE###${JSON.stringify(state)}`);
