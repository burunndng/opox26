import fs from 'fs';
import path from 'path';
import {
  Topic,
  SourceChunk,
  Atom,
  Cluster,
  ConfusionPair,
  Item,
  ActivityAttempt,
  ReviewSchedule,
  ErrorLog,
  Session,
  AppSettings,
  QualityWarning,
  DatabaseSchema,
} from '../src/types.ts';

// Re-export for backwards compatibility (DatabaseSchema now lives in src/types.ts)
export type { DatabaseSchema };
import {
  seedTopics,
  seedSourceChunks,
  seedClusters,
  seedConfusionPairs,
  seedAtoms,
  seedItems,
} from './seedData.ts';
import { seedItemsRetrieval } from './seedDataRetrieval.ts';
import { defaultDbPath, legacyJsonPath, openDatabase } from './sqlite/connection.ts';
import { loadAll, migrateJsonToSqlite, persistAll } from './sqlite/persist.ts';
import { defaultSettings } from './sqlite/defaults.ts';
import { DatabaseSync } from 'node:sqlite';

// Resolved lazily (at init/connect time, NOT at import time) so that tests can
// point OPOSILAB_DATA_DIR at a temp directory after importing this module.
const dataDir = () => process.env.OPOSILAB_DATA_DIR || path.join(process.cwd(), 'data');
const dbFile = () => defaultDbPath();
const legacyJson = () => legacyJsonPath();

class LocalDatabase {
  private data: DatabaseSchema;
  /** Internal readiness flag (public only for the lazy-init proxy below). */
  public initialized = false;
  private conn: DatabaseSync | null = null;

  constructor() {
    this.data = {
      version: 1,
      settings: defaultSettings,
      topics: [],
      sourceChunks: [],
      atoms: [],
      clusters: [],
      confusionPairs: [],
      items: [],
      activityAttempts: [],
      reviewSchedules: [],
      errorLogs: [],
      sessions: [],
    };
  }

  public init() {
    if (this.initialized) return;

    if (!fs.existsSync(dataDir())) {
      fs.mkdirSync(dataDir(), { recursive: true });
    }

    // Open (and ensure schema of) the SQLite store at ./data/oposilab.db
    this.conn = openDatabase(dbFile());
    const loaded = loadAll(this.conn);

    if (loaded) {
      this.data = loaded;
    } else if (fs.existsSync(legacyJson())) {
      // One-time automatic migration from the legacy JSON store (data/oposilab.db.json)
      try {
        const result = migrateJsonToSqlite(this.conn, legacyJson());
        if (result.migrated) {
          this.data = loadAll(this.conn)!;
          // Preserve the JSON as a backup (never silently destroy user data)
          try {
            fs.renameSync(legacyJson(), `${legacyJson()}.migrated.bak`);
          } catch (renameErr) {
            console.warn('Migrated to SQLite but could not rename legacy JSON backup:', renameErr);
          }
          console.log(`[OposiLab] Migrated legacy JSON store to SQLite: ${dbFile()}`, result.counts);
        } else {
          console.warn(`[OposiLab] Legacy JSON migration skipped: ${result.reason}`);
          this.seedInitialData();
        }
      } catch (err) {
        console.error('Legacy JSON migration failed, initializing fresh seed data:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }

    // Ensure defaults if any missing keys
    if (!this.data.settings) this.data.settings = defaultSettings;
    if (!this.data.topics) this.data.topics = [];
    if (!this.data.sourceChunks) this.data.sourceChunks = [];
    if (!this.data.atoms) this.data.atoms = [];
    if (!this.data.clusters) this.data.clusters = [];
    if (!this.data.confusionPairs) this.data.confusionPairs = [];
    if (!this.data.items) this.data.items = [];
    if (!this.data.activityAttempts) this.data.activityAttempts = [];
    if (!this.data.reviewSchedules) this.data.reviewSchedules = [];
    if (!this.data.errorLogs) this.data.errorLogs = [];
    if (!this.data.sessions) this.data.sessions = [];

    // Idempotent, non-destructive boot seeding (restart data-loss fix):
    // a full seed runs ONLY when the database is genuinely empty (fresh
    // install). Any existing database takes the additive merge path below,
    // which preserves user topics, attempts, settings, review schedules and
    // error logs across restarts.
    if (this.data.topics.length === 0 && this.data.items.length === 0) {
      this.seedInitialData();
    } else {
      // Merge any missing seed topics, chunks, clusters, confusion pairs, atoms, and items (e.g. Tema 1)
      let hasNewSeeds = false;
      for (const t of seedTopics) {
        if (!this.data.topics.some((existing) => existing.id === t.id)) {
          this.data.topics.push(t);
          hasNewSeeds = true;
        }
      }
      for (const sc of seedSourceChunks) {
        if (!this.data.sourceChunks.some((existing) => existing.id === sc.id)) {
          this.data.sourceChunks.push(sc);
          hasNewSeeds = true;
        }
      }
      for (const c of seedClusters) {
        const existingIdx = this.data.clusters.findIndex((existing) => existing.id === c.id);
        if (existingIdx === -1) {
          this.data.clusters.push(c);
          hasNewSeeds = true;
        } else if (!this.data.clusters[existingIdx].topic_id && c.topic_id) {
          this.data.clusters[existingIdx].topic_id = c.topic_id;
          hasNewSeeds = true;
        }
      }
      for (const cp of seedConfusionPairs) {
        const existingIdx = this.data.confusionPairs.findIndex((existing) => existing.id === cp.id);
        if (existingIdx === -1) {
          this.data.confusionPairs.push(cp);
          hasNewSeeds = true;
        } else if (!this.data.confusionPairs[existingIdx].topic_id && cp.topic_id) {
          this.data.confusionPairs[existingIdx].topic_id = cp.topic_id;
          hasNewSeeds = true;
        }
      }
      for (const a of seedAtoms) {
        const existingIdx = this.data.atoms.findIndex((existing) => existing.id === a.id);
        if (existingIdx === -1) {
          this.data.atoms.push(a);
          hasNewSeeds = true;
        } else {
          const existing = this.data.atoms[existingIdx];
          let changed = false;
          // Seed atoms have no attempt state, so seed-owned citation content
          // (text + legal, alias keys legal/legal_basis map to one column on
          // persist) always wins for seed atoms on boot.
          if (existing.text !== a.text) {
            existing.text = a.text;
            changed = true;
          }
          const seedLegal = a.legal_basis ?? a.legal;
          if ((existing.legal_basis ?? existing.legal) !== seedLegal) {
            existing.legal_basis = seedLegal;
            existing.legal = seedLegal;
            changed = true;
          }
          if (!existing.topic_id && a.topic_id) {
            existing.topic_id = a.topic_id;
            changed = true;
          }
          if (changed) hasNewSeeds = true;
        }
      }
      const now = new Date();
      // Untouched seeds are seed-owned: boot sync reverts manual edits to
      // status/figure metadata AND citation/statement content (including
      // nested explanation blocks) so corrected seed definitions reach the
      // live database. The first recorded attempt freezes the item as
      // user-owned; attempted items are never touched again.
      const contentSyncFields = [
        'legal_basis',
        'rule_statement',
        'why_correct',
        'corrective_rule',
        'cloze_data',
        'spot_error_data',
      ] as const;
      for (const it of [...seedItems, ...seedItemsRetrieval]) {
        const existingIdx = this.data.items.findIndex((existing) => existing.id === it.id);
        if (existingIdx === -1) {
          this.data.items.push(it);
          if (!this.data.reviewSchedules.some((s) => s.item_id === it.id)) {
            this.data.reviewSchedules.push({
              id: `sched-${it.id}`,
              item_id: it.id,
              state: 'new',
              due_date: new Date(now.getTime()).toISOString(),
              interval_days: 0,
              ease_factor: 2.5,
              stability: 1.0,
              difficulty: it.difficulty,
              lapses: 0,
              consecutive_correct_sessions: 0,
              formats_completed: [],
              priority_score: it.difficulty * 10,
            });
          }
          hasNewSeeds = true;
        } else if (!this.data.activityAttempts.some((attempt) => attempt.item_id === it.id)) {
          const existing = this.data.items[existingIdx];
          let changed = false;
          for (const field of contentSyncFields) {
            if (!(field in it)) continue;
            const seedValue = (it as any)[field];
            if (JSON.stringify((existing as any)[field]) !== JSON.stringify(seedValue)) {
              (existing as any)[field] = seedValue;
              changed = true;
            }
          }
          if (existing.status !== it.status || existing.figure_status !== it.figure_status) {
            existing.status = it.status;
            existing.figure_status = it.figure_status;
            changed = true;
          }
          if (changed) hasNewSeeds = true;
        }
      }
      if (hasNewSeeds) {
        this.saveSync();
      }
    }

    this.initialized = true;
  }

  private seedInitialData() {
    this.data.topics = [...seedTopics];
    this.data.sourceChunks = [...seedSourceChunks];
    this.data.clusters = [...seedClusters];
    this.data.confusionPairs = [...seedConfusionPairs];
    this.data.atoms = [...seedAtoms];
    this.data.items = [...seedItems, ...seedItemsRetrieval];
    this.data.activityAttempts = [];
    this.data.errorLogs = [];
    this.data.sessions = [];
    this.data.settings = { ...defaultSettings };

    // Initialize ReviewSchedule for each seed item
    const now = new Date();
    this.data.reviewSchedules = this.data.items.map((item, idx) => ({
      id: `sched-${item.id}`,
      item_id: item.id,
      state: 'new',
      due_date: new Date(now.getTime() + idx * 60000).toISOString(),
      interval_days: 0,
      ease_factor: 2.5,
      stability: 1.0,
      difficulty: item.difficulty,
      lapses: 0,
      consecutive_correct_sessions: 0,
      formats_completed: [],
      priority_score: item.difficulty * 10,
    }));

    this.saveSync();
  }

  private saveSync() {
    try {
      if (!this.conn) this.conn = openDatabase(dbFile());
      persistAll(this.conn, this.data);
    } catch (err) {
      console.error('Failed to persist database (SQLite):', err);
    }
  }

  // Getters
  public getSettings(): AppSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<AppSettings>): AppSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveSync();
    return this.data.settings;
  }

  public getTopics(): Topic[] {
    return this.data.topics;
  }

  public getTopic(id: string): Topic | undefined {
    return this.data.topics.find((t) => t.id === id);
  }

  public createTopic(topic: Partial<Topic> & { name: string }): Topic {
    const newTopic: Topic = {
      description: topic.description || '',
      source_file: topic.source_file,
      status: topic.status || 'active',
      ...topic,
      name: topic.name,
      id: topic.id || `topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.topics.push(newTopic);
    this.saveSync();
    return newTopic;
  }

  public updateTopic(id: string, updates: Partial<Topic>): Topic | undefined {
    const idx = this.data.topics.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    this.data.topics[idx] = {
      ...this.data.topics[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveSync();
    return this.data.topics[idx];
  }

  public deleteTopic(id: string): boolean {
    const prev = this.data.topics.length;
    this.data.topics = this.data.topics.filter((t) => t.id !== id);
    if (this.data.topics.length !== prev) {
      this.saveSync();
      return true;
    }
    return false;
  }

  public getSourceChunks(topicId?: string): SourceChunk[] {
    if (topicId) {
      return this.data.sourceChunks.filter((c) => c.topic_id === topicId);
    }
    return this.data.sourceChunks;
  }

  public createSourceChunk(chunk: Omit<SourceChunk, 'id'>): SourceChunk {
    const newChunk: SourceChunk = {
      ...chunk,
      id: `chunk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    this.data.sourceChunks.push(newChunk);
    this.saveSync();
    return newChunk;
  }

  public getAtoms(filter?: { topic_id?: string; cluster_id?: string; status?: string }): Atom[] {
    let result = this.data.atoms;
    if (filter?.topic_id) result = result.filter((a) => a.topic_id === filter.topic_id);
    if (filter?.cluster_id) result = result.filter((a) => a.cluster_id === filter.cluster_id);
    if (filter?.status) result = result.filter((a) => a.status === filter.status);
    return result;
  }

  public createAtom(atom: Omit<Atom, 'id' | 'created_at' | 'updated_at'>): Atom {
    const newAtom: Atom = {
      ...atom,
      id: `atom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.atoms.push(newAtom);
    this.saveSync();
    return newAtom;
  }

  public updateAtom(id: string, updates: Partial<Atom>): Atom | undefined {
    const idx = this.data.atoms.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.data.atoms[idx] = {
      ...this.data.atoms[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveSync();
    return this.data.atoms[idx];
  }

  public deleteAtom(id: string): boolean {
    const prevLen = this.data.atoms.length;
    this.data.atoms = this.data.atoms.filter((a) => a.id !== id);
    if (this.data.atoms.length !== prevLen) {
      this.saveSync();
      return true;
    }
    return false;
  }

  public getClusters(topicId?: string): Cluster[] {
    if (topicId) return this.data.clusters.filter((c) => c.topic_id === topicId);
    return this.data.clusters;
  }

  public createCluster(cluster: Omit<Cluster, 'id'>): Cluster {
    const newCluster: Cluster = {
      ...cluster,
      id: `cluster-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    this.data.clusters.push(newCluster);
    this.saveSync();
    return newCluster;
  }

  public getConfusionPairs(topicId?: string): ConfusionPair[] {
    if (topicId) return this.data.confusionPairs.filter((cp) => cp.topic_id === topicId);
    return this.data.confusionPairs;
  }

  public createConfusionPair(pair: Omit<ConfusionPair, 'id'>): ConfusionPair {
    const newPair: ConfusionPair = {
      ...pair,
      id: `pair-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    this.data.confusionPairs.push(newPair);
    this.saveSync();
    return newPair;
  }

  public getItems(filter?: {
    topic_id?: string;
    cluster_id?: string;
    item_type?: string;
    status?: string;
    confusion_pair_id?: string;
  }): Item[] {
    let result = this.data.items;
    if (filter?.topic_id) result = result.filter((i) => i.topic_id === filter.topic_id);
    if (filter?.cluster_id) result = result.filter((i) => i.cluster_id === filter.cluster_id);
    if (filter?.item_type) result = result.filter((i) => i.item_type === filter.item_type);
    if (filter?.status) result = result.filter((i) => i.status === filter.status);
    if (filter?.confusion_pair_id)
      result = result.filter((i) => i.confusion_pair_id === filter.confusion_pair_id);
    return result;
  }

  public getItem(id: string): Item | undefined {
    return this.data.items.find((i) => i.id === id);
  }

  public createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Item {
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.items.push(newItem);

    // Create default review schedule
    this.data.reviewSchedules.push({
      id: `sched-${newItem.id}`,
      item_id: newItem.id,
      state: 'new',
      due_date: new Date().toISOString(),
      interval_days: 0,
      ease_factor: 2.5,
      stability: 1.0,
      difficulty: newItem.difficulty,
      lapses: 0,
      consecutive_correct_sessions: 0,
      formats_completed: [],
      priority_score: newItem.difficulty * 10,
    });

    this.saveSync();
    return newItem;
  }

  public updateItem(id: string, updates: Partial<Item>): Item | undefined {
    const idx = this.data.items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    this.data.items[idx] = {
      ...this.data.items[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveSync();
    return this.data.items[idx];
  }

  public deleteItem(id: string): boolean {
    const prev = this.data.items.length;
    this.data.items = this.data.items.filter((i) => i.id !== id);
    this.data.reviewSchedules = this.data.reviewSchedules.filter((s) => s.item_id !== id);
    this.data.errorLogs = this.data.errorLogs.filter((e) => e.item_id !== id);
    if (this.data.items.length !== prev) {
      this.saveSync();
      return true;
    }
    return false;
  }

  public getReviewSchedules(): ReviewSchedule[] {
    return this.data.reviewSchedules;
  }

  public getReviewSchedule(itemId: string): ReviewSchedule | undefined {
    return this.data.reviewSchedules.find((s) => s.item_id === itemId);
  }

  public updateReviewSchedule(
    itemId: string,
    updates: Partial<ReviewSchedule>
  ): ReviewSchedule | undefined {
    let sched = this.data.reviewSchedules.find((s) => s.item_id === itemId);
    if (!sched) {
      const item = this.getItem(itemId);
      sched = {
        id: `sched-${itemId}`,
        item_id: itemId,
        state: 'new',
        due_date: new Date().toISOString(),
        interval_days: 0,
        ease_factor: 2.5,
        stability: 1.0,
        difficulty: item?.difficulty ?? 2,
        lapses: 0,
        consecutive_correct_sessions: 0,
        formats_completed: [],
        priority_score: 10,
      };
      this.data.reviewSchedules.push(sched);
    }
    Object.assign(sched, updates);
    this.saveSync();
    return sched;
  }

  public recordAttempt(attempt: Omit<ActivityAttempt, 'id' | 'created_at'>): {
    attempt: ActivityAttempt;
    schedule: ReviewSchedule;
    errorLog?: ErrorLog;
  } {
    const newAttempt: ActivityAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    this.data.activityAttempts.push(newAttempt);

    const item = this.getItem(attempt.item_id);
    let sched = this.getReviewSchedule(attempt.item_id);
    if (!sched) {
      sched = this.updateReviewSchedule(attempt.item_id, {})!;
    }

    // Successive Relearning & Spaced Repetition logic
    const isCorrect = attempt.correct;
    const confidence = attempt.confidence;
    const activityType = attempt.activity_type;
    const usedHint = !!attempt.used_hint;

    if (!sched.formats_completed.includes(activityType)) {
      sched.formats_completed.push(activityType);
    }
    sched.last_confidence = confidence;

    let errorLog: ErrorLog | undefined;

    if (!isCorrect) {
      // Error handling & FSRS Error Taxonomy Integration
      sched.lapses += 1;
      sched.consecutive_correct_sessions = 0;
      sched.interval_days = 0; // Immediate repair queue (due today)
      sched.due_date = new Date().toISOString();
      sched.state = 'learning';

      const determinedErrorCode = confidence === 3 ? 'E8' : (attempt.error_type_code ?? 'E1');
      sched.last_error_type = determinedErrorCode;

      // Tailored FSRS penalty based on error taxonomy severity
      if (determinedErrorCode === 'E8') {
        // Confident-wrong: severe priority, maximum difficulty increase, steep stability collapse
        sched.priority_score = 100;
        sched.difficulty = Math.min(10, (sched.difficulty || 5) + 2.5);
        sched.stability = Math.max(0.3, (sched.stability || 1.0) * 0.2);
      } else if (determinedErrorCode === 'E5' || determinedErrorCode === 'E6') {
        // Conceptual merger (E5) or Numeric/Deadline confusion (E6): high priority and penalty
        sched.priority_score = 85;
        sched.difficulty = Math.min(10, (sched.difficulty || 5) + 2.0);
        sched.stability = Math.max(0.4, (sched.stability || 1.0) * 0.25);
      } else {
        sched.priority_score = 70 + sched.lapses * 5;
        sched.difficulty = Math.min(10, (sched.difficulty || 5) + 1.2);
        sched.stability = Math.max(0.5, (sched.stability || 1.0) * 0.35);
      }

      // Create Error Log with explicit taxonomy linkage and repair queue assignment
      errorLog = {
        id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        attempt_id: newAttempt.id,
        item_id: attempt.item_id,
        topic_id: item?.topic_id ?? 'topic-tema7',
        cluster_id: item?.cluster_id,
        confusion_pair_id: item?.confusion_pair_id,
        error_type_code: determinedErrorCode,
        confidence: confidence,
        corrective_rule: item?.corrective_rule ?? item?.rule_statement ?? 'Revisar la regla legal aplicable.',
        legal_basis: item?.legal_basis ?? 'TRLGSS',
        trap_type: attempt.trap_selected_by_user,
        status: 'open',
        next_review_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.data.errorLogs.push(errorLog);
    } else {
      // Success logic
      if (!usedHint) {
        sched.consecutive_correct_sessions += 1;
      } else {
        // Hint was used: reset consecutive unassisted streak so graduation is not unearned
        sched.consecutive_correct_sessions = 0;
      }

      // Adjust difficulty (FSRS formula)
      if (confidence === 3) {
        sched.difficulty = Math.max(1.0, (sched.difficulty || 5) - 0.4);
      } else if (confidence === 0 || confidence === 1) {
        sched.difficulty = Math.min(10.0, (sched.difficulty || 5) + 0.3);
      }

      // Adjust ease & stability
      let bonus = confidence === 3 ? 1.35 : confidence === 2 ? 1.15 : 1.0;
      if (usedHint) {
        // If assisted by hint, dampen stability gain so unassisted memory is verified soon
        bonus = 1.05;
      }
      sched.stability = Math.max(1.0, (sched.stability || 1.0) * bonus);

      // Interval calculation
      if (usedHint) {
        // With hint, keep interval short (1 to 2 days)
        sched.interval_days = 2;
        if (sched.state === 'new') sched.state = 'learning';
      } else if (sched.state === 'new' || sched.state === 'learning') {
        sched.interval_days = sched.consecutive_correct_sessions === 1 ? 1 : 3;
        sched.state = 'review';
      } else if (sched.state === 'review') {
        sched.interval_days = Math.max(4, Math.round(sched.interval_days * 2.2 * sched.stability));
      } else if (sched.state === 'graduated' || sched.state === 'maintenance') {
        sched.interval_days = Math.max(30, Math.round(sched.interval_days * 1.8));
      }

      // Check Graduation Criteria
      // Criteria: >= 3 consecutive correct, >= 2 formats, confidence >= 2, unassisted attempt
      const meetsGraduation =
        !usedHint &&
        sched.consecutive_correct_sessions >= 3 &&
        sched.formats_completed.length >= 2 &&
        confidence >= 2;

      if (meetsGraduation && sched.state !== 'graduated' && sched.state !== 'maintenance') {
        sched.state = 'graduated';
        sched.graduated_at = new Date().toISOString();
        sched.interval_days = Math.max(21, sched.interval_days);
      }

      sched.due_date = new Date(Date.now() + sched.interval_days * 24 * 3600 * 1000).toISOString();
      sched.priority_score = Math.max(5, sched.priority_score - 15);

      // If user had an open error log for this item, mark it repairing or repaired
      const openErr = this.data.errorLogs.find(
        (e) => e.item_id === attempt.item_id && e.status === 'open'
      );
      if (openErr) {
        openErr.status = sched.consecutive_correct_sessions >= 2 ? 'repaired' : 'repairing';
        openErr.updated_at = new Date().toISOString();
      }
    }

    this.saveSync();
    return { attempt: newAttempt, schedule: sched, errorLog };
  }

  public getErrorLogs(filter?: { status?: string; item_id?: string }): ErrorLog[] {
    let result = this.data.errorLogs;
    if (filter?.status) result = result.filter((e) => e.status === filter.status);
    if (filter?.item_id) result = result.filter((e) => e.item_id === filter.item_id);
    return result;
  }

  public updateErrorLog(id: string, updates: Partial<ErrorLog>): ErrorLog | undefined {
    const err = this.data.errorLogs.find((e) => e.id === id);
    if (!err) return undefined;
    Object.assign(err, { ...updates, updated_at: new Date().toISOString() });
    this.saveSync();
    return err;
  }

  public getAttempts(): ActivityAttempt[] {
    return this.data.activityAttempts;
  }

  public getSessions(): Session[] {
    return this.data.sessions;
  }

  public createSession(session: Omit<Session, 'id'>): Session {
    const newSession: Session = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    this.data.sessions.push(newSession);
    this.saveSync();
    return newSession;
  }

  public getSavedSessionState(): any {
    return this.data.savedSessionState || null;
  }

  public setSavedSessionState(state: any): void {
    this.data.savedSessionState = state;
    this.saveSync();
  }

  public clearSavedSessionState(): void {
    this.data.savedSessionState = null;
    this.saveSync();
  }

  public validateItemQuality(item: Item): QualityWarning[] {
    const warnings: QualityWarning[] = [];
    if (!item.legal_basis || item.legal_basis.trim() === '') {
      warnings.push({
        item_id: item.id,
        severity: 'critical',
        rule: 'legal_basis_required',
        message: 'Falta la base legal o artículo del TRLGSS / CE aplicable.',
        pedagogical_rationale: 'Impide verificar la autenticidad normativa del reactivo.',
        remediation: 'Añadir la cita legal correspondiente.',
      });
    }

    // 1. Detector de respuesta incluida en el enunciado (Answer in stem)
    const stem = (item.stem || '').toLowerCase();
    let correctAnswerText = '';
    if (item.options && item.options.length > 0) {
      const correctOpt = item.options.find((o) => o.is_correct || o.id === item.correct_answer);
      if (correctOpt) correctAnswerText = (correctOpt.text || '').toLowerCase().trim();
    } else if (item.correct_answer) {
      correctAnswerText = item.correct_answer.toLowerCase().trim();
    }

    if (correctAnswerText && correctAnswerText.length >= 4) {
      // Check verbatim leakage
      const stopWords = ['para', 'como', 'sobre', 'entre', 'cual', 'esta', 'este', 'otro', 'caso'];
      if (!stopWords.includes(correctAnswerText) && stem.includes(correctAnswerText)) {
        warnings.push({
          item_id: item.id,
          severity: 'critical',
          rule: 'answer_in_stem',
          message: 'Pista en el enunciado: la respuesta correcta aparece revelada en el texto de la pregunta.',
          pedagogical_rationale: 'Permite al opositor acertar por simple reconocimiento superficial sin activar la recuperación generativa de la regla.',
          remediation: 'Reescribe el enunciado eliminando la referencia explícita a la respuesta.',
        });
      }
    }

    // 2. Detector de sobrecarga conceptual (Overloaded concepts)
    const dimensionsFound: string[] = [];
    if (/\b(plazo|días|dias|meses|años|anos|porcentaje|cuantía|cuantia|euros|coeficiente|límite|limite)\b/i.test(stem)) {
      dimensionsFound.push('Magnitud / Plazo');
    }
    if (/\b(tgss|inss|mutua|empresario|órgano|organo|entidad gestora|tesorería|tesoreria)\b/i.test(stem)) {
      dimensionsFound.push('Atribución Orgánica');
    }
    if (/\b(salvo|excepto|a condición|a condicion|siempre que|requisito|incompatibilidad)\b/i.test(stem)) {
      dimensionsFound.push('Excepciones / Condiciones');
    }
    if (/\b(prescribirá|prescribira|caducará|caducara|responsabilidad directa|subsidiaria|solidaria|recargo)\b/i.test(stem)) {
      dimensionsFound.push('Efecto Jurídico');
    }
    const questionMarks = (stem.match(/\?/g) || []).length;
    if (dimensionsFound.length >= 3 || (dimensionsFound.length >= 2 && questionMarks > 1)) {
      warnings.push({
        item_id: item.id,
        severity: 'warning',
        rule: 'overloaded_concepts',
        message: `Sobrecarga conceptual: el reactivo evalúa ${dimensionsFound.length} dimensiones normativas simultáneas (${dimensionsFound.join(', ')}).`,
        pedagogical_rationale: 'Los ítems sobrecargados aumentan la carga cognitiva ajena e impiden diagnosticar con precisión qué regla específica desconoce el alumno.',
        remediation: 'Descompón la pregunta en ítems atómicos de una sola decisión normativa.',
      });
    }

    if (item.item_type === 'cover_and_generate_mcq' || (!item.item_type && item.options)) {
      if (!item.options || item.options.length < 3) {
        warnings.push({
          item_id: item.id,
          severity: 'warning',
          rule: 'options_count',
          message: 'Debe contener entre 3 y 4 opciones para una discriminación competitiva.',
        });
      }

      if (item.options) {
        for (const opt of item.options) {
          if (!opt.is_correct) {
            if (!opt.explanation) {
              warnings.push({
                item_id: item.id,
                severity: 'warning',
                rule: 'distractor_explanation_missing',
                message: `El distractor "${opt.id}" carece de explicación de por qué es falso.`,
              });
            }
            if (!opt.trap_type) {
              warnings.push({
                item_id: item.id,
                severity: 'warning',
                rule: 'distractor_trap_type_missing',
                message: `El distractor "${opt.id}" no tiene asignada tipología de trampa.`,
              });
            }
          }
        }
      }
    }
    return warnings;
  }

  public getAllData(): DatabaseSchema {
    return this.data;
  }

  public restoreData(backup: DatabaseSchema): boolean {
    if (!backup || !Array.isArray(backup.items) || !Array.isArray(backup.topics)) {
      throw new Error('Invalid backup format');
    }
    this.data = backup;
    this.saveSync();
    return true;
  }
}

// NOTE: no eager db.init() here. Importing this module must never touch the
// filesystem: tests set OPOSILAB_DATA_DIR AFTER import (see
// tests/helpers/isolation.ts), and an import-time init would seed the live
// ./data/oposilab.db before that override applies. Instead, the exported
// singleton auto-initializes on first property access, by which point env
// overrides are in place. db.init() stays available and idempotent.
const rawDb = new LocalDatabase();
export const db = new Proxy(rawDb, {
  get(target, prop, receiver) {
    if (
      !target.initialized &&
      typeof prop !== 'symbol' &&
      prop !== 'init' &&
      prop !== 'initialized'
    ) {
      target.init();
    }
    return Reflect.get(target, prop, receiver);
  },
}) as LocalDatabase;
