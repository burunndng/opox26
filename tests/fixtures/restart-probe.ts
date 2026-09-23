/**
 * Fixture for tests/persistence.test.ts — boots the real server/db.ts singleton
 * inside a child process, with OPOSILAB_DATA_DIR isolated by the parent test
 * (the live ./data/oposilab.db is never touched).
 *
 * Usage: node --import tsx tests/fixtures/restart-probe.ts <mode>
 *   mutate : first boot (seeds a fresh database), then create user data
 *   verify : second boot; print the resulting state as one JSON line
 *
 * The parent test parses the ###STATE### line and asserts that the second
 * initialization preserved everything the old seeding logic used to wipe.
 */
import { db } from '../../server/db.ts';
import fs from 'fs';

const mode = process.argv[2] ?? 'verify';

// P2 regression guard mode: importing server/db.ts must be side-effect free.
// The module used to run db.init() at import time, seeding the DEFAULT-path
// database before any OPOSILAB_DATA_DIR override could apply.
if (mode === 'import-only') {
  const { defaultDbPath } = await import('../../server/sqlite/connection.ts');
  // Give any latent async init a chance to fire before checking.
  await new Promise((resolve) => setTimeout(resolve, 50));
  const state = { importCreatedDb: fs.existsSync(defaultDbPath()) };
  console.log(`###STATE###${JSON.stringify(state)}`);
  process.exit(0);
}

if (mode === 'mutate') {
  // User content created AFTER the first boot; must survive every restart.
  db.createTopic({
    id: 'topic-restart-user',
    name: 'User topic (restart persistence test)',
    description: 'Created by tests/fixtures/restart-probe.ts',
  });

  // Wrong answer with confidence 3 on a seed item -> E8 confident-wrong error
  // log + schedule lapse/priority bump: exactly the state a restart used to wipe.
  const seedItem = db.getItems()[0];
  db.recordAttempt({
    item_id: seedItem.id,
    activity_type: 'cover_and_generate_mcq',
    confidence: 3,
    correct: false,
    used_hint: false,
    was_interleaved: false,
    was_timed: false,
  });

  // Settings sentinel: proves updateSettings() state survives the restart.
  db.updateSettings({ ai_model: 'restart-sentinel' });
}

const data = db.getAllData();
const state = {
  topics: data.topics.length,
  items: data.items.length,
  attempts: data.activityAttempts.length,
  errorLogs: data.errorLogs.length,
  reviewSchedules: data.reviewSchedules.length,
  hasUserTopic: data.topics.some((t) => t.id === 'topic-restart-user'),
  hasTema7: data.topics.some((t) => t.id === 'topic_seguridad_social_tema_7'),
  scheduleLapsePreserved: data.reviewSchedules.some(
    (s) => s.lapses >= 1 && s.priority_score >= 85
  ),
  sentinel: data.settings.ai_model,
};
console.log(`###STATE###${JSON.stringify(state)}`);
