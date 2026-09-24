import { db } from '../../server/db.ts';
import { seedItems } from '../../server/seedData.ts';
import { seedItemsRetrieval } from '../../server/seedDataRetrieval.ts';
import { isPracticeEligible } from '../../src/types.ts';

const [mode = 'snapshot', targetId = ''] = process.argv.slice(2);
const seeds = [...seedItems, ...seedItemsRetrieval];

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

const updatedData = db.getAllData();
const seedIds = new Set(seeds.map((item) => item.id));
const seedRecords = updatedData.items.filter((item) => seedIds.has(item.id));
const target = targetId ? updatedData.items.find((item) => item.id === targetId) : undefined;
const state = {
  seedCount: seedRecords.length,
  eligibleCount: seedRecords.filter(isPracticeEligible).length,
  draftIds: seedRecords.filter((item) => item.status === 'draft').map((item) => item.id),
  targetStatus: target?.status ?? null,
  targetFigureStatus: target?.figure_status ?? null,
  targetAttemptCount: updatedData.activityAttempts.filter((attempt) => attempt.item_id === targetId).length,
};

console.log(`###SEED_STATE###${JSON.stringify(state)}`);
