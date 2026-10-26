# OposiLab MCQ Trainer — Implementation Plan v3

> **For agentic workers:** Execute the priorities in order, use the listed verification commands, and stop at each acceptance gate before starting the next priority.

**Date:** 2026-09-23 (rev 3)
**Scope:** Complete the existing app against the AGENTS.md specification (§1–§22).
**North star:** cognitive training for MCQ discrimination (NOT a generic quiz app; NO full mock exams).

> **Rev 3 changes:** remaining work re-ordered by user priority (§6): security
> work is **explicitly deferred**; active priorities are (a) restart data loss,
> (b) test isolation, (c) validation/seed integrity, (d) core activity
> correctness, (e) SRS/interleaving/repair, (f) import/export/UX/docs. The v2
> phase history is consolidated into the Completed baseline. Architecture
> decisions (§2) are unchanged. Status ✅ is only claimed where the listed
> verify command was actually run.

> The previous plan (Modo A/B batch learning flow) is archived at
> `docs/plans/2026-09-modo-ab-batch-learning.md` and is **already implemented** (tests 18–19).

---

## 1. Current State (verified 2026-09-23 · refreshed 2026-10-23)

The app is a broad local-first prototype. The table distinguishes verified behavior from surfaces that still need focused verification; historical phase notes are not acceptance evidence.

| Area | Current status | Evidence / next focus |
|---|---|---|
| Stack | Vite 8 + React 19 + Express 4 + TypeScript, `npm run dev` = `tsx server.ts` | `package.json` |
| Persistence | SQLite exists; restart behavior now covered by an isolated two-boot regression test | `server/db.ts`, `tests/persistence.test.ts` |
| Tests | Full suite green and fully isolated — **172 tests / 37 suites** (2026-10-26; la auditoría FIX 1–9 midió 183/40 con un WIP descartado después, ver §1.2); `npm test` provably never touches the live DB | `npm test`, `tests/helpers/isolation.ts`, P2.3 regression guard |
| Data model | Core types and SQLite tables exist; tag/join behavior and seed relationships need an audit | `src/types.ts`, `server/sqlite/connection.ts` |
| Activity surfaces | Runner branches exist for the required formats; production scoring parity is the active P4 work | `src/components/ActivityRunner.tsx`, `src/scoring/evaluateItem.ts` |
| Content pipeline | Text/PDF import and heuristic atom suggestions exist; validation eligibility and provenance need enforcement | `server/pdfImport.ts`, `server/heuristics.ts`, `ContentStudio.tsx` |
| Scheduler | SRS and interleaving modules exist; due filters, format graduation, maintenance, and constraints need tests | `server/scheduler.ts`, `server/db.ts` |
| Seed | Seed inventory exists; topic/source/status/link integrity is pending P3 | `server/seedData.ts`, `server/seedDataRetrieval.ts` |
| Export/import | Exporters exist; structured import and exact note-field compatibility remain pending P6 | `server/exporter.ts`, `server.ts` |

### 1.1 Hardening de auditoría — 2026-10-23

Auditoría exhaustiva (freeze `71935c2`) + remediación FIX 1–9, verificada con `npm run lint`
(limpio) y `npm test` (**183/183**, 40 suites). Informe: `docs/audit/2026-10-23/REPORT.md`.

- **FIX 1–2 (S1)**: scorer endurecido (cloze exacto, spot_error sin selecciones triviales,
  number_sort normalizado, errorCode limpio en aciertos) y guarda de teclado del runner
  (dígitos solo en `contrast_card`).
- **FIX 3–8 (S2)**: exportador Anki posicional (A/B/C/D) con fallbacks de campos; graduación SRS
  con flags efectivos y crédito de formato solo en acierto; Zod en las 13 rutas antes sin validar;
  scheduler determinista con límite de runs de formato; migraciones aditivas `ALTER TABLE` en
  `server/sqlite/connection.ts`; `PORT` configurable y `engines >=22.5`.
- **FIX 9**: smoke runtime en `PORT=3210` (dev + dist) con evidencia en
  `docs/audit/2026-10-23/evidence/smoke-transcript-fixed.txt`; conteos de pruebas actualizados
  en README y ACCEPTANCE.

### 1.2 Re-medición tras descartar el WIP mercury-decide — 2026-10-26

La medición del close-out (183/183, 40 suites) se hizo con un WIP no commiteado en el árbol
(mercury-decide, ver `docs/audit/2026-10-23/REPORT.md` §«Pre-existing work»); ese WIP se
descartó a posteriori y 11 pruebas en 3 suites nunca fueron parte del repo. Además, `c755ce3`
(FIX 5) había commiteado las 4 rutas Jev de `server.ts` llamando a `JevClient` con un parámetro
`model` que nunca llegó a `server/jev.ts` (era parte del WIP): `npm run lint` quedó con 4 errores
TS2554 en HEAD. Las llamadas se restauraron a las firmas 1–2 argumentos de `JevClient`
(`/api/jev/audit-item`, `diagnose-attempt`, `classify-atom`, `verify-cascade`).

Recuento vigente: **172/172 en 37 suites**, `npm run lint` limpio. `REPORT.md` y sus logs se
conservan como registro histórico (medidos con el WIP presente).

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
- Verified in this revision: focused restart tests pass 2/2 and `tsc --noEmit` is clean; the full suite remains pending safe isolation.

### ADR-3: Add Zod for all API input validation (spec §6). ✅ DONE (2026-10-23)
- All body routes validate via a shared `validateBody` helper; the 13 routes that previously trusted `req.body` were wired with dedicated schemas (audit FIX 5, `tests/schema-contracts.test.ts`). Zod schemas in `src/schemas/` shared by client & server; 400 responses with issue details.

### ADR-4: node:test via tsx stays (not Vitest).
- The test runner remains `node:test` through `tsx`; all suites must use isolated data directories before full-suite execution is trusted.

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

## 5. Verified baseline and constraints

The app is a broad Vite + React + Express + TypeScript local-first application using SQLite. Existing content, activity, analytics, export, and seed surfaces are useful foundations, but prior implementation notes are historical evidence—not proof of acceptance. The current plan treats behavior and data integrity as the source of truth.

Confirmed in this work session:

- `npm run lint` passes after the boot fix.
- `tests/persistence.test.ts` passes 2/2 using a child-process probe and an isolated `OPOSILAB_DATA_DIR`; the live `data/oposilab.db` is not used.
- `server/db.ts:112-190` now performs a full seed only when both topics and items are empty; existing data follows the additive merge path.
- P2 complete: the full suite (58 tests *en esa revisión*; hoy **172** — ver §1.2) runs green in isolated temp databases with `OPOSILAB_OFFLINE=1` (no AI/Jev network); md5 of the live `data/oposilab.db` is unchanged across `npm test`. Two isolation bugs were found and fixed en route: (1) `server/db.ts` captured its DB path at import time, defeating env overrides, and (2) `server/db.ts` ran `db.init()` at module scope, seeding the default-path DB on mere import. Both are regression-guarded (P2.3) and the module now auto-initializes lazily on first access via a Proxy.
- Deferred with their fixes: replacing inline scorer/SRS test reimplementations lands with the P4 production scorers; due-filter, daily-limit, and seed-integrity assertions land with the P3/P5 fixes they verify (kept green intentionally).

Global constraints:

- Keep the existing Vite/React/Express/TypeScript stack; do not migrate to Next.js or Drizzle during this plan.
- Keep the product local-first and do not add full mock exams.
- AI and heuristic content remains draft until human validation.
- Security work is explicitly deferred by user decision; it is not an acceptance gate for this iteration.
- Every phase must finish with a focused test, `npm run lint`, and a clean diff review.

---

## 6. Active roadmap

### P1 — Preserve user data across restarts ✅ DONE

**Files:**
- `server/db.ts:112-190`
- `tests/persistence.test.ts`
- `tests/fixtures/restart-probe.ts`

**Done:**
- Remove the duplicated destructive `seedInitialData()` branches.
- Seed fully only on a genuinely empty database.
- Preserve existing topics, items, attempts, error logs, settings, sessions, and review schedules.
- Verify a second boot in an isolated temporary database.

**Verification:**
- `npx tsx --test tests/persistence.test.ts`
- `npm run lint`

### P2 — Isolate and strengthen the test harness ✅ DONE (isolation scope)

**Files:**
- `package.json:6-13`
- `tests/*.test.ts`
- `tests/helpers/isolation.ts`
- `server/db.ts` (lazy paths + lazy auto-init)
- `server/ai.ts`, `server/jev.ts` (`OPOSILAB_OFFLINE` guard)

**Done:**
- Every suite now runs against a fresh temp `OPOSILAB_DATA_DIR`; verified by md5-checksumming the live DB across a full `npm test` run.
- `server/db.ts` resolves its DB path lazily and no longer runs `db.init()` at module scope (the import-time seeding bug is guarded by test P2.3).
- AI/Jev clients honor `OPOSILAB_OFFLINE=1` and use deterministic local fallbacks; no test can spend network credits.
- Full suite green: 58 tests / 11 suites *(rev 2026-09; hoy 172/37 — ver §1.2)*.

**Verification:**
- `npm test` (live `data/oposilab.db` md5 unchanged before/after)
- `npm run lint`

**Deferred into P3/P4/P5 (with their fixes, to keep the suite green):**
- Replacing inline cloze/scorer/quadrant/streak test reimplementations with production-function calls (P4 scorers).
- Due-date filtering, daily new-item limit, and seed-integrity assertions (P3/P5).

### P3 — Enforce content validation and seed integrity

**Files:**
- `server/scheduler.ts:149-337`
- `server/db.ts` item/schedule creation and status transitions
- `src/components/ItemBank.tsx`
- `src/components/ContentStudio.tsx`
- `src/utils/learningDesignValidator.ts`
- `server/seedData.ts`
- `server/seedDataRetrieval.ts`

**Work:**
- Restrict practice queues to eligible validated/active content; exclude draft, needs-review, and retired items.
- Make validation quality-gated and preserve explicit human approval.
- Add topic, source-chunk, status, and provenance links to seed atoms/clusters/pairs.
- Repair broken seed references and remove predictable correct-option patterns.
- Keep all seed items draft until validated, with a small explicitly validated demo set only if needed.

**Acceptance:**
- A draft AI item cannot appear in due, pretest, repair, or interleaved practice.
- Topic-specific content and micro-lessons find their linked atoms, clusters, and pairs.
- Seed audits verify counts, links, status, option balance, and distractor metadata.

**Completed slices (audit hardening, 2026-09):**

- ✅ **P3-a — práctica solo con contenido elegible + reconciliación de seeds intactos:** predicado
  compartido `isPracticeEligible` aplicado en las colas SRS/intercalado (`server/scheduler.ts`) y en
  los pools de cliente (`src/utils/practicePools.ts`, `src/utils/sniperFilter.ts`); metadatos de seeds
  sin intentos se reconcilian al arrancar (`server/db.ts`). Evidencia:
  `tests/eligibility.test.ts` E1–E4, `tests/seed-reconcile.test.ts` R1–R4,
  `tests/practice-pools.test.ts` P1–P6.
- ✅ **P3-b — integridad de opciones/seeds del alcance auditado:** rebalanceo posicional determinista
  (ciclo A/B/D/C) preservando IDs estables, orden de opciones por encuentro con etiquetas posicionales,
  diagnóstico pedagógico del banco completo en el endpoint de avisos y `figure_status` verificado
  contra BOE. Evidencia: `tests/option-order.test.ts` O1–O5, `tests/seed-integrity.test.ts` F1–F7,
  `tests/validation-warnings.test.ts` V1–V4.

**Still open in P3 (not completed):** quality-gating beyond the warnings endpoint, provenance/topic
and source-chunk links for seeds, seed-reference repairs, and explicit human validation of generated
content.

### P4 — Correct the core activity loop

**Files:**
- `src/scoring/evaluateItem.ts`
- `src/components/ActivityRunner.tsx`
- `src/components/ItemBank.tsx`
- `src/types.ts`
- Activity-specific tests under `tests/`

**Work:**
- Score cover-and-generate free-text answers and classify lucky recognition, recognition failure, and confident-wrong states.
- Implement per-blank cloze state, exact/synonym acceptance, and near-miss diagnostics.
- Normalize contrast-card fields and render the cue/table/mini-case consistently.
- Add answer controls for retrieval and pretest items.
- Complete spot-error correction matching, two-tier quadrants, exception-tree routing, fact-variant sequences, and number-sort variants.

**Acceptance:**
- Production scorers cover every required item type.
- Feedback distinguishes exact, near-miss, lucky, fragile, and misconception outcomes.
- Activity tests exercise the same functions used by the UI.

### P5 — Complete SRS, interleaving, errors, and repair

**Files:**
- `server/scheduler.ts`
- `server/db.ts:506-623`
- `src/components/ErrorRepairStudio.tsx`
- `src/components/ActivityRunner.tsx`
- `tests/oposilab.test.ts` and new focused engine tests

**Work:**
- Filter future-due schedules and enforce new-item limits.
- Require real distinct successful sessions, formats, and interleaved retrieval for graduation.
- Implement maintenance state and overdue prioritization.
- Enforce interleaving toggles, topic mix, confusion-pair partners, format diversity, and the two-cluster consecutive limit.
- Auto-log low-confidence correct attempts and generated/selection mismatches.
- Route E1–E20 errors to their prescribed repair activities and block graduation while critical confident-wrong errors remain unresolved.

**Acceptance:**
- Due queues never present future items.
- Graduation is reachable through actual UI activity formats, not synthetic test inputs.
- Error status transitions and repair completion are persisted and tested.

### P6 — Finish import/export, UX, and evidence

**Files:**
- `server/exporter.ts`
- `server.ts` import/export routes
- `src/components/ExportSettingsMethodModal.tsx`
- `src/components/ContentStudio.tsx`
- `docs/ACCEPTANCE.md`
- `README.md`
- `examples/`

**Work:**
- Add working JSON/CSV item import with validation and duplicate reporting.
- Align Anki/Quizlet/CSV field layouts with the specification.
- Complete remaining accessibility, empty-state, and error-state work without adding a mock-exam module.
- Replace unverified acceptance claims with test or manual evidence.

**Acceptance:**
- Import/export round trips preserve item IDs, links, status, and feedback metadata.
- A browser smoke flow covers import → validate → practice → feedback → restart persistence.
- `npm run lint`, `npm test`, and `npm run build` pass from a clean checkout.

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Existing tests mutate the live database | Make `OPOSILAB_DATA_DIR` isolation a prerequisite for every suite. |
| Additive seed merge masks incomplete legacy data | Add explicit seed-integrity checks before accepting seed counts as complete. |
| UI practice diverges from scheduler eligibility | Centralize eligibility filtering and test every queue path. |
| Activity runners pass tests without matching runtime behavior | Test production scorers and add a browser smoke path. |
| Scope expands into a generic quiz or full mock exam | Keep the cognitive-training scope and §5 non-goals in the acceptance checklist. |

## 8. Deferred and explicit non-goals

**Deferred by user decision:** server network hardening, CORS/bind changes, authentication, and credential cleanup. These are not part of the current acceptance gate, but remain a later maintenance concern.

**Non-goals:** no full mock exams, leaderboards, cloud-account dependency, payments, mobile-native app, or black-box AI content without human validation.

**Execution order:** P1 → P2 → P3 → P4 → P5 → P6. Keep the app runnable and the working tree reviewable after each priority.
