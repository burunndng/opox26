# OposiLab Exhaustive Audit — Report

**Date:** 2026-10-23
**Freeze revision:** `71935c2` (+ uncommitted mercury-decide WIP, 8 tracked files — see §6)
**Trigger:** user directive to remediate audit findings in priority order (S1 → S2 → S3)
**Status:** FIX 1–9 applied and verified; close-out complete

## Final verification

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` (tsc --noEmit) | clean, 0 errors |
| Tests | `npm test` | **183/183**, 40 suites, 0 fail |
| Build | `npm run build` | OK → `dist/server.cjs` |
| Smoke runtime | `PORT=3210`, dev + dist boots | all probes OK — `evidence/smoke-transcript-fixed.txt` |

Smoke probes (V1–V9): `POST /api/attempts {}` → 400 Zod; save-state junk object → 200 (opaque-by-design schema); save-state array → 400; interleaved-block garbage → 400; import/backup invalid → 400; ai/chat bad messages → 400; jev/compare `{}` → 400; backup export → import round trip preserves all 299 items; production bundle rejects garbage with 400.

## Findings remediated

| ID | Sev | Finding | Evidence | Status | Fixed by |
| --- | --- | --- | --- | --- | --- |
| F-001 | S1 | Scorer: cloze fragment accepted as full match; spot_error empty/trivial selection counted correct; number_sort raw (unnormalized) comparison; errorCode persisted after success | `evidence/scorer-probes.txt` | FIXED | FIX 1 |
| F-002 | S1 | ActivityRunner digit-key fallback fabricates selections for formats without positional hotkeys | `evidence/scorer-probes.txt` | FIXED | FIX 2 |
| F-003 | S2 | Exporter MCQ labels not positional (A/B/C/D); cloze/spot fields mismatched against live schema | schema cross-check, seed data | FIXED | FIX 3 |
| F-004 | S2 | SRS: formats credited on failed attempts; three graduation settings flags dead; maintenance unreachable | `tests/oposilab.test.ts` test 9 | FIXED | FIX 4 |
| F-005 | S2 | 13 POST routes trusted `req.body` → junk persisted / 500s | `evidence/route-matrix.md` | FIXED | FIX 5 |
| F-006 | S2 | Scheduler non-deterministic (`Math.random`); no limit on format runs | `tests/oposilab.test.ts` test 10 | FIXED | FIX 6 |
| F-007 | S2 | Schema evolution: `CREATE TABLE IF NOT EXISTS` only; no ALTER path → silent column drift on legacy DBs | `evidence/schema-drift-live-db.txt` | FIXED | FIX 7 |
| F-008 | S3 | `PORT` hardcoded to 3000; no `engines` floor (Node < 22.5 misruns) | smoke contamination on port 3000 | FIXED | FIX 8 |
| F-009 | S3 | Docs drift: test counts 95/58/148 stale; ACCEPTANCE #2 claimed module-load init; ADR-3 false | `README.md` / `docs/ACCEPTANCE.md` / `implementation_plan.md` | FIXED | FIX 9 |

### Fix detail

- **FIX 1 (S1)** `src/scoring/evaluateItem.ts` — cloze exact-match on both paths; spot_error rejects empty/absent/trivial (<3 char) selections; number_sort normalizes both inputs plus empty-value guard; errorCode cleared on success. `tests/scorer-hardening.test.ts` (11 tests).
- **FIX 2 (S1)** `src/components/ActivityRunner.tsx` — digit shortcut restricted to `contrast_card` at position ≤ 1.
- **FIX 3 (S2)** `server/exporter.ts` — positional A/B/C labels + `correctDisplay`; cloze `template_text` fallback; spot `full_statement`/`erroneous_span`/`corrected_text` with legacy `error_spans` fallback.
- **FIX 4 (S2)** `server/db.ts` — formats credited only on successful attempts; graduation honors `confidence_required_for_graduation`, `require_two_formats_for_graduation`, `require_interleaved_success_for_graduation` (via attempt-history `was_interleaved`), `graduating_interval`. `tests/srs-graduation.test.ts` (G1–G4); `tests/oposilab.test.ts` test 9 updated.
- **FIX 5 (S2)** `src/schemas/index.ts` — 13 Zod schemas added; all 13 previously unguarded routes wired through `validateBody` in `server.ts`. `tests/schema-contracts.test.ts` (14 tests).
- **FIX 6 (S2)** `server/scheduler.ts` — deterministic weighted sort (weight desc, id tiebreak) replacing `Math.random`; no 3rd consecutive same-format run in both passes. `tests/interleaving-hardening.test.ts` (I1–I2).
- **FIX 7 (S2)** `server/sqlite/connection.ts` — parses `SCHEMA_SQL` (table/column level), diffs against `PRAGMA table_info`, adds missing columns via `ALTER TABLE ... ADD COLUMN` with safe constraint downgrade (PRIMARY KEY/UNIQUE dropped; NOT NULL dropped unless DEFAULT present). Tables → migrations → indexes ordering so legacy tables never fail index creation before columns exist. `tests/sqlite-migrations.test.ts` (M1–M4).
- **FIX 8 (S3)** `server.ts` `const PORT = Number(process.env.PORT) || 3000;`, `package.json` engines `>=22.5.0`.
- **FIX 9 (S3)** docs: README (3 counts → 183 pruebas); ACCEPTANCE (hardening banner; #2 lazy Proxy init + migrations; #15 I1–I2; #16 graduation flags G1–G4; #22 183/183); implementation_plan (§1 → 183 tests / 40 suites + §1.1 addendum; ADR-3 marked DONE); fixed smoke transcript archived to evidence.

## Open items

| ID | Sev | Item | Status |
| --- | --- | --- | --- |
| F-010 | S3 | Content metadata gaps: 61 items missing explanation, 67 missing trap (seed bank stats) | backlog |
| F-013 | S3 | E4 independent reproduction of S1 scorer findings (background scouts returned empty) | optional |

**Resolved outside FIX 1–9:** F-011 repo hygiene — six stray one-off patch scripts deleted from repo root (`fix_types.cjs`, `patch_docs.cjs`, `patch_jev.cjs`, `patch_modal.cjs`, `patch_server.cjs`, `patch_src.cjs`). F-012 smoke contamination — port 3000 belongs to an unrelated project (`multi-agent-harness-studio`); smoke now runs on PORT=3210 with a clean transcript.

## Pre-existing work not part of this series

The working tree also holds uncommitted mercury-decide WIP from earlier sessions: `server/jev.ts`, `src/types.ts`, `src/components/JevLabModal.tsx`, `src/api.ts`, parts of `server.ts`, `.env.example`, `server/decisionsCompare.ts`, `tests/decisions-compare.test.ts`, plus plans `docs/plans/2026-09-audit-hardening.md` and `docs/plans/2026-10-10-mercury-decide-integration.md`, and the new `AGENTS.md` agent guide. These are excluded from the audit-fix commit series; user decision requested.

## Evidence index

- `docs/audit/2026-10-23/evidence/route-matrix.md`, `secrets-scan.txt`, `schema-drift-live-db.txt`, `scorer-probes.txt`, `bank-stats-run{1,2,3}.json`, `smoke-transcript-fixed.txt`
- `docs/audit/2026-10-23/logs/freeze-snapshot.txt`, `live-db-copy-hashes.txt`, `baseline-lint.txt`, `baseline-test.txt`, `baseline-build.txt`, `final-verification.txt`

## Commit proposal

One conventional commit per fix batch, then one docs/audit commit:

1. `fix(scoring): harden cloze/spot/number_sort scorers; clear errorCode on success` — `src/scoring/evaluateItem.ts`, `tests/scorer-hardening.test.ts`
2. `fix(ui): restrict positional digit shortcuts to contrast_card` — `src/components/ActivityRunner.tsx`
3. `fix(export): positional MCQ labels; schema-aligned cloze/spot field fallbacks` — `server/exporter.ts`
4. `fix(srs): credit formats only on success; honor graduation settings flags` — `server/db.ts`, `tests/srs-graduation.test.ts`, `tests/oposilab.test.ts`
5. `fix(scheduler): deterministic interleaving; format-run limit` — `server/scheduler.ts`, `tests/interleaving-hardening.test.ts`
6. `feat(sqlite): additive schema migrations via ALTER TABLE` — `server/sqlite/connection.ts`, `tests/sqlite-migrations.test.ts`
7. `feat(api): Zod validation for 13 previously unguarded routes; PORT env override; engines >=22.5` — `src/schemas/index.ts`, `server.ts` (zod + PORT hunks — hunk-level staging), `tests/schema-contracts.test.ts`, `package.json`
8. `docs(audit): close-out — test counts 183/183, acceptance evidence, migration addendum, audit report` — `README.md`, `docs/ACCEPTANCE.md`, `implementation_plan.md`, `docs/audit/`, `docs/plans/2026-10-23-exhaustive-audit.md`, `AGENTS.md`

Note: `server.ts`, `README.md` and `implementation_plan.md` contain small pre-existing mercury-decide hunks; commits 7–8 will use hunk-level staging to avoid entangling that WIP.

**Say the word and I will stage and commit the series in order, or adjust the grouping first.**
