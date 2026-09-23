# OposiLab MCQ Trainer — Implementation Plan v2

**Date:** 2026-09-23
**Scope:** Complete the existing app against the AGENTS.md specification (§1–§22).
**North star:** cognitive training for MCQ discrimination (NOT a generic quiz app; NO full mock exams).

> The previous plan (Modo A/B batch learning flow) is archived at
> `docs/plans/2026-09-modo-ab-batch-learning.md` and is **already implemented** (tests 18–19).

---

## 1. Current State (verified 2026-09-23)

The app is **substantially built**. Facts verified by direct inspection:

| Area | Status | Evidence |
|---|---|---|
| Stack | Vite 8 + React 19 + Express 4 + TS, `npm run dev` = `tsx server.ts` | `package.json` |
| Tests | **19/19 pass** | `npx tsx --test tests/oposilab.test.ts` |
| Data model | Fully spec-aligned: all 10 `ItemType`, E1–E20, 16 `TrapType`, `MCQOption{trap_type,explanation,condition_if_correct}`, `ReviewSchedule{formats_completed,stability,priority_score}`, confidence 0–3, baremos, Modo A/B lifecycle, `QualityWarning` | `src/types.ts` (656 ln) |
| API | 54 routes: CRUD ×6 entities, due-queue, interleaved-block, attempts, errors, sessions + saved-state, AI extract/draft/chat, Jev ×5, exports ×6, backup import/export | `server.ts` |
| Activity Runner | Renders **every** item type (cloze, contrast, C&G, number_sort, spot_error, two_tier, exception_tree, fact_variant), keyboard listener, confidence input, hint system | `src/components/ActivityRunner.tsx` (2,303 ln) |
| Content Studio | Paste + file upload (.txt/.md/.pdf), AI "Generar Set Completo en 1 clic" with **human validation workflow** before commit | `ContentStudio.tsx` (1,810 ln) |
| Scheduler | Successive relearning: E8→priority 100, E5/E6→85, graduation = ≥3 consecutive correct ∧ ≥2 formats ∧ confidence ≥2 ∧ unassisted; hint resets streak | `server/scheduler.ts` + `db.ts:506–617` |
| Interleaving | ≤2 consecutive same-cluster constraint, confusion-pair partners, maintenance weighting | `server/scheduler.ts:209+` |
| Seed | **Tema 7 SS** exact spec distribution: 25 C&G + 20 cloze + 15 contrast + 10 number + 10 spot-error + 8 two-tier + 6 exception-tree + 6 fact-variant = **100 items**; plus Tema 1 (CE 1978) | `server/seedData.ts`, `seedDataTema1.ts` |
| Exports | Anki TSV, CSV items, CSV errors, Quizlet, analytics-MD, JSON backup import/export | `server/exporter.ts` |
| Method page | Covers: why cover-and-generate, why distractor analysis, why confidence 0–3, why no mock exams (4/6 required topics) | `ExportSettingsMethodModal.tsx:316–352` |
| AI | Gemini/OpenRouter, **always draft + human validation**; local Jev heuristic fallback when no API key/credits (verified in test run) | `server/ai.ts`, `server/jev.ts` |

---

## 2. Architecture Decisions (ADR)

### ADR-1: Keep Vite + React + Express. Do NOT migrate to Next.js.
- Spec §6 *prefers* Next.js, but the app is complete, local-first, single-command, and framework migration is pure churn with zero pedagogical value.
- **Deviation documented here; accepted unless the user veto.**

### ADR-2: Migrate storage JSON → **SQLite** at `./data/oposilab.db`. ✅ DONE (Phase A)
- Spec §6 requires SQLite. The old `data/oposilab.db.json` was a full-state read/rewrite file: fragile under crash and unbounded growth as attempts accumulate.
- **Driver: `node:sqlite` (Node built-in), not better-sqlite3.** better-sqlite3 install was blocked by a *pre-existing* npm peer conflict (vite 8 ↔ esbuild 0.25). `node:sqlite` ships with Node ≥ 22.5: zero native deps, zero install risk, synchronous API nearly identical to better-sqlite3. Documented in `server/sqlite/connection.ts`.
- **FK enforcement intentionally OFF** (SQLite default): the JSON store never cascaded deletes; enabling cascades would silently change app behavior (deleting a topic would vanish its items). REFERENCES clauses remain as documentation.
- Architecture: in-memory working set unchanged (`db.ts` public API identical) + `persistAll()` syncing all tables in **one WAL transaction per mutation** (delete-stale + upsert-current). Settings as key/value rows; polymorphic payloads (options, cloze_data, contrast_data, …) as JSON columns.
- **Auto-migration:** on boot, if SQLite is empty and legacy JSON exists → `migrateJsonToSqlite()` imports it and renames the JSON to `*.migrated.bak` (never deletes). Standalone CLI: `npx tsx scripts/migrate-json-to-sqlite.ts`. Tests override the data dir via `OPOSILAB_DATA_DIR` (used by `tests/sqlite.test.ts`).
- Drizzle ORM: **not adopted** (spec lists it as preferred, not required). Thin hand-rolled mappers + Zod validation cover the need.
- Verified: 29/29 tests, `tsc --noEmit` clean, real store migrated intact (114 items), `env -i` boot OK.

### ADR-3: Add Zod for all API input validation (spec §6).
- Server routes currently trust `req.body`. Zod schemas in `src/schemas/` shared by client & server; 400 responses with issue details.

### ADR-4: node:test via tsx stays (not Vitest).
- 19 passing tests, zero config. Migration cost > value. Documented deviation.

### ADR-5: Firebase stays **optional and lazy**.
- Spec forbids cloud accounts as a dependency. Verify the app boots and runs 100% with no Firebase env vars; `AuthProvider` must degrade to anonymous/local-only. If it hard-fails, gate behind lazy init.

---

## 3. Target File Structure (Δ = new in this plan)

```
oposilab-mcq-trainer/
├── server.ts                        # Express routes (add Zod validation middleware)
├── server/
│   ├── db.ts                        # Public API unchanged; backend swapped to SQLite
│   ├── sqlite/
│   │   ├── Δ schema.sql             # DDL: 14 tables (§4)
│   │   └── Δ connection.ts          # Singleton better-sqlite3 instance + WAL
│   ├── scheduler.ts                 # SRS + interleaving (unchanged)
│   ├── exporter.ts                  # Anki/CSV/Quizlet/MD (unchanged)
│   ├── ai.ts, jev.ts                # Optional AI + local fallback (unchanged)
│   ├── Δ heuristics.ts              # Offline regex atom-suggestion engine (§8.2 of spec)
│   └── Δ pdfImport.ts               # pdf-parse wrapper w/ graceful failure
├── src/
│   ├── types.ts                     # Unchanged (already aligned)
│   ├── Δ schemas/                   # Zod schemas: topic, chunk, atom, cluster,
│   │                                #   confusionPair, item, attempt, settings
│   ├── components/                  # Existing UI; deltas in Phase C–E
│   ├── scoring/evaluateItem.ts      # Existing
│   └── utils/learningDesignValidator.ts
├── Δ scripts/migrate-json-to-sqlite.ts
├── data/                            # oposilab.db (SQLite) — already gitignored dir
├── tests/oposilab.test.ts           # Extended per phase
└── docs/plans/                      # Archived plans
```

---

## 4. SQLite Schema (DDL plan)

Maps the existing TS interfaces 1:1 (no data-model changes). JSON columns for polymorphic payloads keep queries simple; indexes on hot filters.

```sql
CREATE TABLE topics (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '',
  source_file TEXT, status TEXT CHECK(status IN ('draft','active','archived')) DEFAULT 'draft',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE source_chunks (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  page_number INTEGER, article_reference TEXT,
  raw_text TEXT NOT NULL, summary TEXT, order_index INTEGER NOT NULL
);
CREATE TABLE atoms (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
  source_chunk_id TEXT REFERENCES source_chunks(id) ON DELETE SET NULL,
  text TEXT NOT NULL, atom_type TEXT, legal_basis TEXT, cluster_id TEXT,
  confusion_pair_id TEXT, tags TEXT /* JSON array */, difficulty INTEGER DEFAULT 3,
  figure_status TEXT, status TEXT CHECK(status IN ('draft','validated','deprecated')) DEFAULT 'draft',
  created_at TEXT, updated_at TEXT
);
CREATE TABLE clusters (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT DEFAULT '', type TEXT, priority TEXT DEFAULT 'medium'
);
CREATE TABLE confusion_pairs (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  concept_a TEXT NOT NULL, concept_b TEXT NOT NULL,
  discriminating_cue TEXT NOT NULL, common_trap TEXT NOT NULL,
  legal_basis_a TEXT, legal_basis_b TEXT, example_case TEXT,
  status TEXT DEFAULT 'draft', severity TEXT DEFAULT 'medium'
);
CREATE TABLE items (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  cluster_id TEXT, confusion_pair_id TEXT, item_type TEXT NOT NULL,
  stem TEXT NOT NULL, prompt_before_options TEXT,
  options TEXT /* JSON MCQOption[] */, correct_answer TEXT,
  legal_basis TEXT, rule_statement TEXT, why_correct TEXT,
  distractor_analysis TEXT /* JSON */, trap_types TEXT /* JSON */,
  corrective_rule TEXT, condition_if_distractor_correct TEXT /* JSON */,
  difficulty INTEGER DEFAULT 3, cognitive_operations TEXT /* JSON */,
  status TEXT DEFAULT 'draft', source TEXT DEFAULT 'manual',
  cloze_data TEXT, contrast_data TEXT, number_sort_data TEXT, spot_error_data TEXT,
  two_tier_data TEXT, exception_tree_data TEXT, fact_variant_data TEXT, fsrs_info TEXT,
  figure_status TEXT, created_at TEXT, updated_at TEXT
);
CREATE INDEX idx_items_topic ON items(topic_id, item_type, status);
CREATE INDEX idx_items_pair  ON items(confusion_pair_id);
CREATE INDEX idx_items_cluster ON items(cluster_id);

CREATE TABLE activity_attempts (
  id TEXT PRIMARY KEY, item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  session_id TEXT, activity_type TEXT, user_response TEXT,
  generated_answer_before_options TEXT, selected_option TEXT, reasoning_response TEXT,
  confidence INTEGER CHECK(confidence BETWEEN 0 AND 3), correct INTEGER NOT NULL,
  used_hint INTEGER DEFAULT 0, hints_revealed TEXT, error_type_code TEXT,
  trap_selected_by_user TEXT, time_to_generate_ms INTEGER, time_to_answer_ms INTEGER,
  was_interleaved INTEGER DEFAULT 0, was_timed INTEGER DEFAULT 0,
  format_version INTEGER, created_at TEXT NOT NULL
);
CREATE INDEX idx_attempts_item ON activity_attempts(item_id, created_at);

CREATE TABLE review_schedules (
  id TEXT PRIMARY KEY, item_id TEXT UNIQUE NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  state TEXT DEFAULT 'new', due_date TEXT NOT NULL, interval_days INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5, stability REAL DEFAULT 1.0, difficulty REAL DEFAULT 5.0,
  lapses INTEGER DEFAULT 0, consecutive_correct_sessions INTEGER DEFAULT 0,
  formats_completed TEXT /* JSON ItemType[] */, last_confidence INTEGER,
  last_error_type TEXT, priority_score REAL DEFAULT 10,
  graduated_at TEXT, suspended_reason TEXT
);
CREATE INDEX idx_sched_due ON review_schedules(due_date, state);

CREATE TABLE error_logs (
  id TEXT PRIMARY KEY, attempt_id TEXT, item_id TEXT NOT NULL, topic_id TEXT,
  cluster_id TEXT, confusion_pair_id TEXT, error_type_code TEXT,
  confidence INTEGER, user_explanation TEXT, corrective_rule TEXT, legal_basis TEXT,
  trap_type TEXT, status TEXT DEFAULT 'open', next_review_date TEXT,
  created_at TEXT, updated_at TEXT
);
CREATE INDEX idx_errors_status ON error_logs(status, error_type_code);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY, name TEXT, type TEXT, started_at TEXT, ended_at TEXT,
  item_count INTEGER DEFAULT 0, accuracy REAL, avg_confidence REAL,
  calibration_delta REAL, notes TEXT
);
CREATE TABLE saved_session_state (id TEXT PRIMARY KEY, payload TEXT NOT NULL, saved_at TEXT);

CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, type TEXT);
CREATE TABLE item_tags (item_id TEXT REFERENCES items(id) ON DELETE CASCADE, tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY(item_id, tag_id));
CREATE TABLE atom_tags (atom_id TEXT REFERENCES atoms(id) ON DELETE CASCADE, tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY(atom_id, tag_id));

CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT /* JSON */);
```

---

## 5. Gap Analysis Matrix (spec § → status → phase)

| Spec § | Requirement | Status | Phase |
|---|---|---|---|
| §6 | SQLite via better-sqlite3, `./data/oposilab.db` | ❌ JSON file | **A** |
| §6 | Zod validation | ❌ absent | **A** |
| §7 | Data model (14 entities incl. tags) | ✅ types done; tags table unused | A (DDL) |
| §8.1 | PDF import with paste fallback | ⚠️ paste ✅; PDF only via AI-multimodal or readAsText | **B** |
| §8.2 | Offline atom-suggestion heuristics (plazo/salvo/INSS regexes) | ❌ AI-only | **B** |
| §8.3–8.4 | Clusters, confusion pairs, item generation + validation | ✅ | — |
| §9.1 | Pretest: 8–15 items, shuffled, no labels, **diagnostic map at end**, seed weak items | ⚠️ pretest mode exists; diagnostic map screen unverified | **C** |
| §9.2 | Retrieval-first micro-lesson (chunk reader + prompts + missed→atoms) | ⚠️ `retrieval_prompt` type exists; reader loop + auto-atom-from-miss unverified | **C** |
| §9.3–9.10 | All core/advanced activity types | ✅ runner branches for all 10 | — |
| §9.11 | Interleaved blocks + heat map after block | ✅ blocks; ⚠️ per-block heat map unverified | C/D |
| §9.12 | Successive relearning queue | ✅ | — |
| §9.13 | Error log + repair studio + E1–E20 taxonomy | ✅ | — |
| §10 | Calibration dashboard + **textual alerts** ("sobrecalibrado…") + fragile/misconception indices | ⚠️ dashboard exists; alerts ❌ | **D** |
| §11 | Analytics: heat maps ×5, error matrices (numeric/institutional/temporal), SRS analytics, activity effectiveness, content quality | ⚠️ partial (CalibrationAnalytics 271 ln; exporter MD summary) | **D** |
| §12 | Item quality validation | ✅ `learningDesignValidator` + `/items/validation-warnings`; duplicate-detection unverified | D (verify) |
| §13 | AI panel, draft-only, citations, prompt templates | ✅ + local fallback | — |
| §14 | Keyboard shortcuts, a11y (no color-alone, DnD alt, high contrast) | ⚠️ shortcuts ✅ (HelpShortcutsModal); number-sort uses `<select>` (a11y ✅, dnd nicety ❌); high-contrast ❌; color-alone audit pending | **E** |
| §15 | Seed Tema 7 | ✅ 100 items exact distribution + Tema 1 | — |
| §16 | Export/import (Anki A–E, CSV, Quizlet, JSON) | ✅ (test 12 green) | — |
| §17 | Scheduling + interleaving engines as separate modules | ✅ | — |
| §21/§23 | README accuracy, method page 6/6 topics | ⚠️ method 4/6 verified; README says "react-example" | **F** |
| §19 | Tests for all engines | ✅ 19 suites; add A/B/D coverage | each |
| — | App boots with zero env vars / no Firebase | ❓ unverified | **A** |

---

## 6. Phased Roadmap

### Phase A — Foundation: SQLite + Zod + boot independence  ← START HERE
1. `server/sqlite/schema.sql` + `connection.ts` (better-sqlite3, WAL, foreign_keys=ON).
2. Refactor `server/db.ts` internals to SQLite; **keep public method signatures** so scheduler, routes, exporter and all 19 tests pass unchanged.
3. `scripts/migrate-json-to-sqlite.ts`: one-time import of existing `data/oposilab.db.json`; JSON renamed `.bak`; idempotent.
4. Zod schemas in `src/schemas/`; wire into mutating routes (400 + issue list on failure).
5. Verify boot with empty env: `env -i PATH=$PATH npm run dev` → app functional, Firebase degrades gracefully (fix AuthProvider lazy-init if not).
   - **Tests:** repo layer round-trip; migration script on fixture JSON; Zod rejects malformed item/atom payloads; all 19 existing suites green.
   - **Accept:** AC §18.1, §18.2 (one command; auto-init), spec §6 storage.

### Phase B — Local-first content pipeline ✅ DONE (2026-09-23)
1. ✅ `server/pdfImport.ts`: **pdfjs-dist v6** legacy build (offline, no AI); route `POST /api/import/pdf` (base64 JSON transport); friendly Spanish errors for password/corrupt/**scanned** PDFs (422 + `fallback:'paste'`)
2. ✅ `server/heuristics.ts`: offline regex engine — 13-category marker lexicon (deadlines, %, coefficients, amounts, exceptions *salvo/excepto/no obstante/sin perjuicio*, institutions INSS/TGSS/mutua…), abbreviation-safe sentence splitter, article-ref legal-basis guesser, competence-precedence typing; button **"Sugerir átomos (sin IA)"** in ContentStudio feeding the existing draft-approval list
3. ✅ Chunk splitter: page boundaries + *Artículo N* headings + sentence-boundary hard-split at 2,500 chars → `source_chunks` with page/article refs; **"Crear fragmentos"** button
   - **Tests:** 10/10 (`tests/pipeline.test.ts`): typing precision on the prescripción cluster, legal-basis capture, dedup, abbreviation safety, chunker (headings/pages/oversized), PDF fixture extraction, corrupt + text-less PDF fallbacks
   - **Accept:** AC §18.3 + §18.4 offline with zero API keys ✔ (39/39 total tests, lint clean, boot smoke green)

### Phase C — Pretest diagnostic map + retrieval micro-lesson
1. Pretest end-screen **mapa diagnóstico**: strong/weak clusters, likely confusion pairs, recommended focus; auto-seed review queue with weak items; store pretest session for gain analysis. (Verify what exists in ActivityRunner pretest flow; build missing end-screen + queue-seeding.)
2. Retrieval-first micro-lesson runner: chunk-by-chunk reader, embedded prompts ("Escribe la regla de memoria…"), reveal, keyword-match scoring vs atoms, "Crear átoma de error" → auto-creates draft atom + queue entry.
3. Per-block heat map after interleaved blocks (reuse D1 components).
4. Seed: add ≥4 `retrieval_prompt` + `pretest_item` examples.
   - **Tests:** pretest seeding logic; keyword matcher hits/misses; micro-lesson miss → atom creation.
   - **Accept:** AC §18.12 partial (two-tier already ✅), §9.1, §9.2.

### Phase D — Analytics & calibration depth
1. Heat maps: accuracy by topic / cluster / confusion pair / legal basis / atom type (Recharts, existing dep).
2. Calibration: confidence×accuracy curve per level 0–3, over/under-calibration **alerts** ("Estás sobrecalibrado en automaticidad relativa"), fragile-knowledge index, misconception index, trend over time.
3. Confusion matrices: numeric (E6 pairs), institutional (E17), temporal (E16) from error history.
4. SRS analytics: due/overdue, lapse rate, graduation rate, maintenance load, avg interval.
5. Activity effectiveness: accuracy & retention by `activity_type`, interleaved vs not.
6. Content-quality dashboard on top of existing QualityWarning engine + duplicate detection (normalized stem hash).
   - **Tests:** synthetic attempts fixture → expected alert strings, matrix counts, heat-map aggregates.
   - **Accept:** AC §18.19, spec §10 alerts, §11.1–11.7.

### Phase E — Accessibility & UX polish
1. High-contrast mode (toggle, persisted in settings).
2. Correct/incorrect never color-alone: always icon + label (audit all runners).
3. Number sort: add dnd-kit visual mode, keep `<select>` as keyboard path (both a11y-safe).
4. Shortcut audit vs spec set (Space/1–4/0–3/E/R/N/F/?); add missing.
5. Method page: add missing 2/6 topics (why interleaving, why errors repaired differently — verify, add if absent).
   - **Tests:** shortcut registry unit test; contrast-mode class application.
   - **Accept:** spec §14 fully; AC §18.10 keyboard alternative.

### Phase F — Docs, tests, acceptance sweep
1. README rewrite: real stack, install/run/db-init/seeds/import/atoms/Anki export/tests; drop "react-example" name in package.json.
2. Ship `examples/anki_export_sample.tsv` + `examples/error_log_report.md` (generated from seed DB).
3. Full §18 acceptance checklist run, each item traced to a test or manual step in `docs/ACCEPTANCE.md`.
   - **Accept:** AC §18.1–23 all green.

---

## 7. Risk Register

| Risk | Mitigation |
|---|---|
| better-sqlite3 native build fails on user machine | Swap to `node:sqlite` (Node 24 built-in) behind the same `connection.ts` interface |
| SQLite refactor breaks 19 green tests | Keep `db.ts` API; run suite after every internal step; JSON backup retained |
| Migration loses Modo A/B saved-session state | `saved_session_state` table + round-trip test on real `data/oposilab.db.json` |
| Firebase hard-couples boot | Phase A gate: `env -i` boot test before any feature work merges |
| Scope creep into mock-exam territory | Standing rule: §5 non-goals; timed sprints only |

## 8. Explicit Non-Goals (restated, spec §5)

No mock-exam simulator · no leaderboards · no cloud accounts · no payments · no mobile-native · no black-box AI without human validation.

---

**Execution order:** A → B → C → D → E → F, app runnable and test-green after every phase.
**Next action on approval:** Phase A step 1 (`server/sqlite/`).
