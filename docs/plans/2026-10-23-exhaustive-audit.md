# OposiLab Exhaustive Audit — Plan

> **Status:** proposed — execution starts only on explicit instruction.
> **Date:** 2026-10-23
> **Frozen revision (to pin at P0):** `71935c2` + uncommitted mercury-decide WIP (8 tracked files) + untracked
> `docs/plans/2026-10-10-mercury-decide-integration.md`, `AGENTS.md`, `fix_types.cjs`, `patch_*.cjs`.
> **Relation to prior work:** executes and supersedes the audit *method* of `docs/plans/2026-09-audit-hardening.md`
> (whose critical-path fixes shipped); does not re-open closed findings without evidence.

---

## 1. Purpose

Answer, with reproducible evidence on a frozen revision, six questions:

1. Does the app do what `docs/SPEC.md`, `README.md`, `docs/ACCEPTANCE.md`, and the plans claim — provably?
2. Can a learner be blocked, misled, or lose study data through normal use (restart, migration, backup, crash)?
3. Can a learner *game* the app (position/length/format cues) instead of learning?
4. Are the learning engines (scoring, SRS, interleaving, eligibility) correct on edges, not just happy paths?
5. Does optional AI stay optional, offline-safe, draft-only, and cost-safe?
6. Do docs, numbers, and acceptance claims match the code that exists?

**In scope:** everything in the repository — `server.ts`, `server/`, `src/`, `tests/`, seeds, scripts, config, docs.
**Out of scope (declare, don't fix):** remediation of findings (separate backlog), external security hardening beyond
documentation (user-deferred), full mock exams (product non-goal), load testing at scale (smoke perf only).

---

## 2. Evidence standard (non-negotiable)

| Tier | Meaning |
|---|---|
| E0 | Claim only — no supporting evidence |
| E1 | Static reading / grep |
| E2 | Reproducible automated run (test, script, command output saved as artifact) |
| E3 | Live runtime probe (server/browser), two independent methods |
| E4 | Adversarial reproduction from clean state by a *different agent than the finder* |

- A **finding** requires ≥E2. A **pass** requires ≥E2. **S0/S1 findings require E4** before severity is final.
- Every claim in the docs is adjudicated to *confirmed / refuted / unverifiable*, never left implicit.
- Finder and falsifier are separated: beru/igris/tusk/tank produce candidates; **shadow-sovereign independently
  attempts refutation** before anything is written into the report.

**Severity rubric**

| Sev | Definition |
|---|---|
| S0 | Silent data loss/corruption; study data exposes; practice systematically exploitable |
| S1 | Acceptance criterion fails on realistic use; engine wrong on plausible input; AI/heuristic content reaches practice without validation |
| S2 | Doc/NUMERIC drift, error-path gaps, blocking UX friction, a11y failures |
| S3 | Cosmetic / doc nits |

**Finding template** (one file per finding under `docs/audit/2026-10-23/findings/`):

```
F-### — title
Severity: S0..S3 | Workstream: W# | Status: open/refuted/duplicate/downgraded
Claim:            what is believed broken and why it matters
Evidence:         artifact paths + exact commands + observed output
Reproduction:     smallest step list from the frozen revision
Counter-check:    who attempted refutation, how, result
Disposition:      confirmed / refuted / downgraded
Remediation:      proposal only (no fixes during the audit)
```

---

## 3. Coverage obligations ("exhaustive" means these all get a row)

1. **29/29** acceptance criteria in `docs/ACCEPTANCE.md` re-verified on the frozen revision.
2. **100% of HTTP routes** in a route matrix: method, path, Zod schema (or *gap*), side effects, eligibility filter, error codes.
3. **10/10 ItemTypes** exercised through the production scorer (`src/scoring/evaluateItem.ts`) with valid, invalid, boundary inputs.
4. **E1–E20 error codes**: each routed to a repair activity; status transitions persisted and tested.
5. Every **seed bank** inventoried and reconciled: counts, unique IDs, links, status, provenance, option balance, distractor metadata.
6. Every **env var** in `.env.example` verified to have a real effect or marked inert.
7. Every **numeric/behavioral claim** in README / ACCEPTANCE / implementation_plan adjudicated.
8. Every **npm script** exercised on a clean checkout.
9. Every **keyboard shortcut** works, and `number_sort` is fully operable by keyboard alone.
10. **Test-harness credibility**: isolation, offline guarantee, determinism (3 consecutive runs), no logic duplicated from production modules.

---

## 4. Workstreams

### W0 — Baseline & freeze
- Decide the WIP: commit/stash mercury-decide changes or require they land first; record `git rev-parse HEAD` + `git diff | sha256sum`.
- `cp data/oposilab.db*` to a tmp dir; **all runtime probes use `OPOSILAB_DATA_DIR` to a copy — never the live DB**.
- Record environment: `node --version`, npm, OS; baseline `npm run lint`, `npm test`, `npm run build`, `npm start` smoke.
- Create `docs/audit/2026-10-23/{findings,evidence,logs}/`.
- **Gate:** frozen revision + saved baseline artifacts; nothing else runs before this.

### W1 — Claims & documentation drift
- Build a claim ledger: every assertion in README / ACCEPTANCE / implementation_plan, with a column for *verified / refuted / stale*.
- Verify test/suite numbers, "95 pruebas", acceptance ✅ without runnable evidence, spec-vs-implementation ADR list.
- Check docs/SPEC stack warning is consistently honored (no Next.js/Drizzle/better-sqlite3/Vitest creep).
- Check the non-goals hold: no mock-exam module, AI content draft-only, local-first without keys.
- **Exit:** every numeric claim either reproduced or filed as S2/S3 drift; ACCEPTANCE evidence column refreshed.

### W2 — Persistence & data lifecycle
- Read `server/db.ts` + `server/sqlite/persist.ts` + `connection.ts`: in-memory set vs per-mutation `persistAll` WAL txn; FK-off consequences; delete-stale semantics.
- Tests/probes: two-boot restart (`tests/persistence.test.ts`); idempotent seeding; legacy JSON auto-migration + `.migrated.bak`; `OPOSILAB_DATA_DIR` redirect; backup → import round-trip preserves IDs/links/status/metadata/settings/schedules; schema-evolution behavior on an *old* DB (new columns/tables with `CREATE TABLE IF NOT EXISTS` — verify no ALTER gap).
- Fault injection: kill process around a mutation; verify no partial table loss; corrupt-DB boot behavior.
- **Exit:** data-loss surface documented with worst-case windows; round-trip proof artifact.

### W3 — Scoring & activity correctness
- Inventory all 10 ItemTypes → production scorer path → UI runner branch. Find any test-only reimplementation still standing in for production logic.
- Adversarial input table per scorer: empty strings, whitespace, case, accents NFC/NFD, punctuation, synonyms empty/dup, near-miss boundaries, multi-blank cloze (per-blank state), repeated submit, out-of-range confidence, unknown option IDs.
- Verify ID-based scoring under `src/utils/optionOrder.ts` shuffling: labels/shortcuts positional, scoring stable, state never keyed to array index.
- Number-sort and exception-tree correctness (order-based → exempt from shuffle) verified both by drag and keyboard.
- **Exit:** per-scorer matrix with edge rows; any mismatch UI↔production = S1.

### W4 — Scheduling, SRS, interleaving
- Freeze/inject clock; verify due-queue excludes future-due (except `new`), omits suspended, honors `max_new_items_per_day`, overdue prioritization, maintenance state.
- Graduation invariants: 3 correct, ≥2 formats, 1 interleaved, confidence ≥2, no recent confident-wrong; verify with real activity formats, not synthetic inputs.
- Interleaving: ≤2 consecutive same cluster, format diversity, confusion-pair partners, topic mix; deterministic fallback path when constraints are infeasible.
- Date/DST/timezone: tests around Europe/Madrid DST boundary (2026-10-25) and day rollover; no UTC/local mixing bugs.
- **Exit:** invariant tests for each rule + documented fallback.

### W5 — Eligibility & content gating
- Confirm single predicate `isPracticeEligible` (`src/types.ts`) is the *only* gate across: due queue, interleaved blocks, pretest pool, sniper filter, repair launch, micro-lesson, Mode A/B, client pools.
- Draft-leak probe: insert a draft/needs_review/retired item and attempt to reach it through **every** entry point (API directly + UI), including seed-reconcile promotion boundaries (untouched seeds only).
- **Exit:** zero draft leaks, or S1 filed; each entry point has a test row.

### W6 — Content bank quality & psychometrics
- Inventory **all** banks (Tema 1, 3, 7, 8, 15, retrieval, general): counts, IDs, topic/source links, status, `figure_status`.
- Re-run and extend automated integrity: one correct option, canonical position distribution ≤40%, correct option ≤1.25× distractor mean length, explanation + trap per distractor, legal basis, unique stems per format, no non-Latin/mojibake.
- **Gaming ablations** (script over the bank): pick-by-position, pick-longest, pick-shortest, pick-first-A; target ≈ chance (25%). Any scorer above chance by a margin = S0 (practice is exploitable).
- Legal-content spot-check: `figure_status` items vs BOE 2026 sources (tank fetches; human confirms 2,7 % / 3.359,60 € / 47.034,40 € / PNC 8.803,20 €).
- Near-duplicate stems (normalized-token similarity) → human adjudication list.
- **Exit:** bank ledger + ablation numbers + BOE evidence.

### W7 — API surface, validation, security posture
- Generate the route matrix mechanically from `server.ts`; map each `POST/PUT` to a Zod schema. **16 `validateBody` call sites vs ~58 routes is a lead — enumerate the gaps.**
- Fuzz invalid bodies per route (wrong types, unknown enum, oversize `10mb` payload) → expect 400 with issues, no stack traces.
- Search/filter params: SQL injection attempts, regex injection, `limit` abuse (negative/huge/NaN).
- Error surface: no secrets/keys/paths leaked in 500 messages; AI error passthrough review.
- Secrets: scan full git history for `AIza`, `sk-or-`, `sk-`, tokens; confirm `.env*` ignored and only `.env.example` tracked; check `firebase-applet-config.json` key is a public-by-design web key and documented as such.
- Record the accepted risk register verbatim: CORS `*`, bind `0.0.0.0`, no auth, no rate limiting (user-deferred; must remain documented, not accidentally worsened).
- **Exit:** route matrix with zero unclassified rows.

### W8 — AI/Jev optionality & safety
- No-key boot and exercise: everything works, deterministic local fallbacks (`OPOSILAB_OFFLINE=1` enforced in tests).
- Draft-only end-to-end: AI/heuristic output → `draft` → human promotion only; attempt to induce auto-activation.
- Prompt injection: feed adversarial instructions inside imported PDF/text; verify they cannot alter schema/actions beyond content being drafted.
- Cost safety: offline guard covers every network call site; compare endpoint (`/api/jev/compare`) and `DECISIONS_MODEL` env parsing; timeouts/failure surfaces.
- **Exit:** optionality proof with no network; injection probes filed.

### W9 — UI/UX & accessibility
- Manual matrix: each activity type × states (empty, loading, error, correct, incorrect, near-miss, resume) — executed in a browser, screenshots as evidence.
- Keyboard-only run of every flow; shortcuts `Espacio H 1–4 0–3 Esc ?`; focus order; aria labels; high-contrast toggle persisted.
- Spanish copy scan (UI text Spanish, identifiers English); empty/error states every list; abort/resume session integrity vs server state.
- Analytics numbers cross-checked against raw attempts for a scripted session (UI disagreeing with DB = S1).
- **Exit:** per-flow checklist with pass/fail + screenshots.

### W10 — Build, ops, performance
- Clean checkout in a temp dir: `npm install --legacy-peer-deps` → `npm run dev`, `npm run build`, `npm start`; Node ≥22.5 guard (note: no `engines` field today).
- Seed/startup timing, DB size growth, seed idempotency on second boot, `scripts/migrate-json-to-sqlite.ts` CLI smoke.
- Schema of the 10mb JSON limit vs PDF/text import paths; graceful failure on oversized input.
- **Exit:** reproducible build/run transcript from a clean clone.

### W11 — Test-harness credibility
- Verify isolation helper usage: every test transitively touching `server/db.ts` calls `isolateDataDir()` first; boot-import regression guard exists.
- Run suite 3×: zero flakes; run single-file and full-file orders; coverage report (`tsx --test --experimental-test-coverage`) with a floor recorded, not gated.
- Grep for re-implemented logic inside tests (cloze/scorer/quadrant/streak) → replace-or-file list.
- **Exit:** harness trust memo; any test scoring differently from production = S1.

---

## 5. Phases, gates, and roles

| Phase | Content | Gate to pass |
|---|---|---|
| **P0 Freeze & instrument** | W0 | Revision pinned, live-DB copy taken, baseline commands green, evidence dirs exist |
| **P1 Static & claim audit** | W1, static halves of W7/W10 | Claim ledger complete; route matrix drafted; secret history scan done |
| **P2 Automated deep verification** | W2–W6, W11 (audit-only test scripts allowed) | Every coverage obligation §3 has at least E2 evidence |
| **P3 Runtime & E2E** | W7 dynamic, W9, W10, backup round-trip, crash probes | E3 evidence for every acceptance criterion |
| **P4 Adversarial reproduction** | all S0/S1 candidates | Each finding E4-reproduced or downgraded by shadow-sovereign |
| **P5 Report & triage** | Findings ledger, severity, remediation proposals, ACCEPTANCE refresh | Exit criteria §7 met |

**Roles:** beru = recon/inventory; igris = harness execution + evidence capture; tank = BOE/legal + model docs;
tusk = UI/a11y walkthrough; shadow-sovereign = independent refutation/severity; bellion = sequencing if scope deforms;
monarch = ledger, gates, final report.

---

## 6. Baseline observations (2026-10-23 recon — leads, not verdicts)

Unadjudicated; each becomes a row in W1/W7/W11.

1. **Test-count drift:** `npm test` today = **148 tests / 28 suites**, all pass; README & ACCEPTANCE say **95**, implementation_plan says **58**. Docs numbers are stale (S2 unless shown otherwise).
2. **Route validation coverage:** 16 `validateBody` sites vs ~58 routes — enumerate unvalidated bodies (W7).
3. **Working tree dirty:** mercury-decide WIP uncommitted (8 files), plus root-level `patch_*.cjs`/`fix_types.cjs` artifacts and untracked plans. Freeze decision required at P0.
4. **Security posture as documented:** CORS `*`, `app.listen(..., '0.0.0.0')`, no auth/rate-limit → deferred by user; audit records and prevents accidental worsening.
5. **Secrets:** history contains commits `71935c2 fix(security): source API keys from environment` and `df28ac6`; verify those *removed* rather than added key material, and scan for other patterns.
6. **`package.json`:** name `react-example` (known cosmetic), **no `engines` field** despite Node ≥22.5 requirement; `bun.lock` present while npm is the documented flow.
7. **Seed mass:** `server/seedData.ts` (6.5k lines) + Tema banks (~5k lines) dominate the repo; W6 is the heaviest workstream.

---

## 7. Exit criteria (audit is done when)

1. §3 coverage obligations are all satisfied with linked artifacts.
2. Every S0/S1 finding independently reproduced (E4) or downgraded with written rationale.
3. Every doc claim adjudicated; README/ACCEPTANCE numbers re-synced or filed as drift.
4. One consolidated report: `docs/audit/2026-10-23/REPORT.md` (findings by severity, coverage ledger, residual accepted risks).
5. A ranked remediation backlog proposed into `implementation_plan.md` (no fixes performed during the audit).
6. Zero unclassified rows in the route matrix and zero unverified acceptance criteria.

---

## 8. Guardrails

- Audit-only branch; no application-code fixes during the audit (tests/scripts for evidence are allowed).
- Never point probes at the live DB; copy first via `OPOSILAB_DATA_DIR`.
- No destructive git operations; no history rewriting even if secrets are found (rotate + document instead).
- Do not commit study data; do not touch `DISABLE_HMR` or AI-Studio artifacts.
- Severity disputes resolve toward whichever side holds the E4 reproduction.
