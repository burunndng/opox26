import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import * as domainTypes from '../src/types.ts';
import type { Item, ItemStatus } from '../src/types.ts';
import { db } from '../server/db.ts';
import { InterleavingEngine, SchedulingEngine } from '../server/scheduler.ts';
import { isolateDataDir } from './helpers/isolation.ts';

const isolatedDir = isolateDataDir();
const excludedStatuses: ItemStatus[] = ['draft', 'needs_review', 'retired'];

function addItem(status: ItemStatus, topicId: string, marker: string): Item {
  const source = db.getItems().find((item) => item.item_type === 'cover_and_generate_mcq');
  assert.ok(source, 'seed bank must contain an MCQ template');

  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, fsrs_info: _fsrsInfo, ...data } = source;
  const item = db.createItem({
    ...data,
    topic_id: topicId,
    stem: `${source.stem} (${marker})`,
    status,
  });
  db.updateReviewSchedule(item.id, {
    state: 'new',
    due_date: new Date(Date.now() - 60_000).toISOString(),
  });
  return item;
}

describe('Practice eligibility', () => {
  before(() => {
    assert.equal(process.env.OPOSILAB_DATA_DIR, isolatedDir);
    assert.equal(process.env.OPOSILAB_OFFLINE, '1');
    db.init();
  });

  test('E1: due queue excludes draft, needs-review, and retired items', () => {
    const topicId = 'topic-eligibility-due';
    const ineligible = excludedStatuses.map((status) => addItem(status, topicId, `due-${status}`));
    const eligible = addItem('validated', topicId, 'due-validated');

    const queue = SchedulingEngine.getDueQueue(20, topicId);
    const queueIds = new Set(queue.map((item) => item.id));

    for (const item of ineligible) assert.equal(queueIds.has(item.id), false, `${item.status} leaked into due queue`);
    assert.equal(queueIds.has(eligible.id), true, 'validated control item should remain in due queue');
  });

  test('E2: interleaved block excludes draft, needs-review, and retired items', () => {
    const topicId = 'topic-eligibility-interleaved';
    const ineligible = excludedStatuses.map((status) => addItem(status, topicId, `block-${status}`));
    const eligible = addItem('active', topicId, 'block-active');

    const block = InterleavingEngine.generateBlock({ blockSize: 10, topicId });
    const blockIds = new Set(block.map((item) => item.id));

    for (const item of ineligible) assert.equal(blockIds.has(item.id), false, `${item.status} leaked into block`);
    assert.equal(blockIds.has(eligible.id), true, 'active control item should remain in interleaved block');
  });

  test('E3: due stats ignore schedules for ineligible items', () => {
    const topicId = 'topic-eligibility-stats';
    for (const status of excludedStatuses) addItem(status, topicId, `stats-${status}`);

    const stats = SchedulingEngine.getDueStats(topicId);
    assert.equal(stats.dueToday, 0);
    assert.equal(stats.newItems, 0);
    assert.equal(stats.learning, 0);
    assert.equal(stats.graduated, 0);
    assert.equal(stats.maintenance, 0);
  });

  test('E4: only validated and active statuses are practice-eligible', () => {
    const predicate = (domainTypes as unknown as {
      isPracticeEligible?: (item: Pick<Item, 'status'>) => boolean;
    }).isPracticeEligible;
    assert.equal(typeof predicate, 'function', 'shared eligibility predicate must be exported');

    assert.equal(predicate!({ status: 'validated' }), true);
    assert.equal(predicate!({ status: 'active' }), true);
    for (const status of excludedStatuses) {
      assert.equal(predicate!({ status }), false, `${status} must not be practice-eligible`);
    }
  });
});
