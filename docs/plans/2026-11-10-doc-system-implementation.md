# Doc-System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. NOTE (adaptation): those named superpowers skills are not in this environment's toolset. If Subagent-Driven is chosen, dispatch the `general` subagent per task (or `oposilab-editor` for the file-writing parts) with the task text verbatim. If Inline Execution is chosen, run the tasks in this session with review checkpoints between tasks. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved documentation system (session diary + content-coverage tracker) and repair the verified structural defects in `implementation_plan.md` and surrounding docs, exactly per `docs/design/2026-11-10-doc-system-design.md` (D1–D4).

**Architecture:** Docs-only change set: 2 new files, 5 edited files, 1 git rename. Tasks group by file and each ends with its own grep/count verification. One single commit + push at the end (design D4.3), NOT per-task commits: the files cross-reference each other (pointer block ↔ diary filename ↔ § headings), so intermediate commits would leave the doc set internally inconsistent; the final commit is the atomic unit.

**Tech Stack:** Markdown + git; verification via `grep` cross-reference checks, `tsc --noEmit`, `node:test` (`tsx`).

## Global Constraints

- Docs-only: no code, test, or seed files change behavior. NEVER touch `server/seedData*.ts` — a parallel agent has uncommitted work there (`M server/seedData.ts`, `?? server/seedDataTema15Extra.ts` observed at plan time); stage only the paths this plan creates/modifies/moves.
- Additive only: no restructuring, no reordering of §1.1/§1.2, no rewriting historical sections (rev-4 note keeps its stale "210/210" — it is a dated record).
- Counts (318/318 in 43 suites; 475 seeded / 481 eligible) come from the committed baseline (`7ddd20b`), never from the dirty working tree. If counts are re-derived, derive from `git show HEAD:<file>`.
- Single conventional commit at the end: `docs(structure): add session diary, coverage tracker, repair doc cross-references`, then push. Re-check `git status` / `git log` immediately before staging.
- Spanish field names in the diary (`Objetivo/Hecho/Verificado/Siguiente paso/Notas`); plan and other docs in English. Every cross-reference must resolve after the change (D4 ref check).

---

## File Structure

| Action | Path | Responsible for |
|---|---|---|
| Create | `docs/sessions/2026-11-10-tema3-parte2.md` | Seed diary entry (work example + continuity pointer) — Task 1 |
| Create | `docs/CONTENT-COVERAGE.md` | Topic matrix + Tier B checklist + how-to — Task 1 |
| Modify | `implementation_plan.md` | rev 5 bump, §1 heading date, "Próximos pasos" pointer, `## 2.`→`### 1.13`, `### 1.9` heading — Task 2 |
| Modify | `docs/SPEC.md` | Staleness banner (3 lines) — Task 3 |
| Modify | `docs/plans/2026-10-23-exhaustive-audit.md` | Annotation for the 2 non-existent refs — Task 3 |
| Modify | `AGENTS.md` | 3 key-doc bullets — Task 3 |
| Modify | `.opencode/agent/oposilab-guardian.md` | sessions pointer + stale baseline refresh (planning discovery, see Task 3) — Task 3 |
| Rename | `docs/superpowers/specs/2026-10-10-tema-8-mcq-learning-review-design.md` → `docs/design/2026-10-10-tema-8-mcq-learning-review-design.md` | Canonical design-doc home — Task 3 |
| This file | `docs/plans/2026-11-10-doc-system-implementation.md` | This plan (user preference overrides the writing-plans default `docs/superpowers/plans/`) |

---

### Task 1: Create the diary seed entry and the coverage tracker

**Files:**
- Create: `docs/sessions/2026-11-10-tema3-parte2.md`
- Create: `docs/CONTENT-COVERAGE.md`

**Interfaces:**
- Consumes: nothing (first task). Depends on design D1/D2 (`docs/design/2026-11-10-doc-system-design.md`).
- Produces: `docs/sessions/2026-11-10-tema3-parte2.md` (filename consumed verbatim by Task 2 Edit C and Task 3 Edit H); `docs/CONTENT-COVERAGE.md` with heading `## Tier B (deferred follow-up batches)` (the `§Tier B` pointer target referenced by Task 2 Edit C and the diary).

- [ ] **Step 1: Re-derive topic counts from committed HEAD (deterministic, WIP-immune)**

The seed banks use two construction styles, so count them differently. Banks with literal IDs
(T3, T15) are counted by distinct full IDs; `questionBank`-style files (T8/T8IP/T9/T3G) by
`stem:` occurrences (item IDs are index-generated, not literals, so literal-ID greps see
nothing there). All reads are from `git show HEAD:<file>`, so the parallel agent's
working-tree WIP cannot skew them.

```bash
cd /var/home/ansimistrator/Documents/OPOSICIONES/oposilab-mcq-trainer
git show HEAD:server/seedDataTema3.ts          | grep -oE 'item-t3-[0-9]+'  | sort -u | wc -l   # T3, literal ids -> 61
git show HEAD:server/seedDataTema15.ts         | grep -oE 'item-t15-[0-9]+' | sort -u | wc -l   # T15+T16, literal ids -> 94 (36 T15 + 58 T16; split guarded by F12)
git show HEAD:server/seedDataTema9.ts          | grep -c "stem: '"                                    # questionBank -> 61
git show HEAD:server/seedDataTema8IP.ts        | grep -c "stem: '"                                    # questionBank -> 52
git show HEAD:server/seedDataTema3General.ts   | grep -c "stem: '"                                    # questionBank -> 24
git show HEAD:server/seedDataTema8Items.ts     | grep -c "stem: '"                                    # questionBank -> 70
```

Expected: T3 **61**, T15+T16 **94** (36 + 58), T9 **61**, T8 II **52**, T3 General **24**, T8 **70**.
Tema 7 (**100** = 25/20/15/10/10/8/6/6) and retrieval/pretest (**6** = 481−475) come from
`docs/ACCEPTANCE.md` criterion 21 (legacy files, not re-derived); Tema 1 CE stays "**—**" (no
clean count source). If any counted number differs from the matrix in Step 3, STOP: the matrix
must carry the HEAD-derived number (asserted equal in Step 4).

- [ ] **Step 2: Write the seed diary entry**

Create `docs/sessions/2026-11-10-tema3-parte2.md` with exactly this content:

```markdown
# Session — 2026-11-10 Tema 3 parte-2 gap audit

- **Objetivo:** Close the Tema 3 content gaps raised by class 9-11 (resumen T3&T4) against the seed bank.
- **Hecho:** 12 validated MCQs authored (`item-t3-50…61`, `server/seedDataTema3.ts` export `seedItemsTema3Parte2` appended last in `seedItems`); bookkeeping synced (`seed-reconcile` R1 469→481, README/ACCEPTANCE 475/481); committed and pushed as `7ddd20b`.
- **Verificado:** `npm run lint` clean; `npm test` 318/318 in 43 suites; `npm run build` OK.
- **Siguiente paso:** Tier B follow-up batch — headliner: afiliación indebida + devolución de cuotas (`docs/CONTENT-COVERAGE.md` §Tier B).
- **Notas:** Always append new seed exports to the END of `seedItems`; `rebalanceCanonicalMcqOptions` (F2) reshuffles on mid-bank inserts. `buildMcq` assigns option keys — never hand-manage `key`.
```

- [ ] **Step 3: Write the coverage tracker**

Create `docs/CONTENT-COVERAGE.md` with exactly this content (matrix numbers as asserted in Step 1; if Step 1 disagreed, the table carries the Step-1 numbers):

```markdown
# Content coverage — what's audited and what's deferred

Tracks, per topic, which class summaries have been gap-audited against the seed bank and which
content decisions are still deferred. Companion to `docs/ACCEPTANCE.md` (acceptance evidence)
and `implementation_plan.md` §1.3–§1.12 (audit diary). Counts below are from the committed
baseline; after each content batch, refresh the affected row here in the same commit.

## Matrix

| Tema | Fuente (clase/resumen) | Ítems | Última auditoría | Estado |
|---|---|---|---|---|
| Tema 7 (Régimen General) | legacy seed | 100 | — | no recent audit entry |
| Tema 1 (CE) | legacy seed | — | — | no recent audit entry |
| Tema 3 específico (afiliación) | clase 9-11 T3&T4 (`ESPECIFICO/Tema 3/resumen gemini.txt`, outside repo) | 61 | 2026-11-10 (§1.12) | auditado |
| Tema 8 específico (IT) | legacy bank, test-guarded (`tema8-bank.test.ts`) | 70 | — | no §1.x gap audit |
| Tema 8 II (IP) | clase 21-10 (§1.3) | 52 | 2026-10-31 | auditado |
| Tema 15 (Ley 40/2015) | clase 28-10 pt1 (§1.4) | 36 | 2026-10-31 | auditado |
| Tema 16 (Ley 39/2015) | clase 28-10 pt2 (§1.5, §1.8) | 58 | 2026-11-03 | auditado |
| Tema 3 General (TC) | clase 26-10 (§1.7) | 24 | 2026-11-03 | auditado (new bank) |
| Tema 9 (nacimiento y cuidado) | clase 4-11 + parte 2 + supuesto (§1.10, §1.11) | 61 | 2026-11-09 | auditado |
| retrieval/pretest | — | 6 | — | n/a |

## Tier B (deferred follow-up batches)

- [ ] **Afiliación indebida + devolución de cuotas** (Tema 3) — strongest follow-up candidate, §1.12
- [ ] Cuotas 28/30 % y MEI, cifras 2027 (Tema 4) — outside Tema 3 scope, §1.12
- [ ] Sucesión solidaria (Tema 5), §1.12
- [ ] Intervalo 9–12 meses de carencia (Tema 9), §1.11 (G15)
- [ ] Tabla RG/TREBEP del §3.6 del resumen parte 2 (Tema 9), §1.11
- [ ] Reconcile professor contradictions: 360/180 days, 50 % wording, SMI figures,
      "Victoria 4× SMI" (Tema 9), §1.11

## How to maintain this tracker

After each class gap audit: (1) add a `docs/sessions/` diary entry, (2) check off or add Tier B items here and refresh the matrix row, (3) update the §1 "Próximos pasos" pointer in `implementation_plan.md`. Nothing else.
```

- [ ] **Step 4: Verify Task 1**

```bash
ls -la docs/sessions/2026-11-10-tema3-parte2.md docs/CONTENT-COVERAGE.md
grep -c '^- \[ \]' docs/CONTENT-COVERAGE.md
```

Expected: both files exist; Tier B checklist grep = **6**.

---

### Task 2: Surgical `implementation_plan.md` edits

**Files:**
- Modify: `implementation_plan.md` (Edits A–E; nothing else)

**Interfaces:**
- Consumes: Task 1's diary filename (exact string `docs/sessions/2026-11-10-tema3-parte2.md`) and Task 1's heading `## Tier B (deferred follow-up batches)` (referred to as `§Tier B`).
- Produces: headings `### 1.9` / `### 1.13` and the rev-5 state that Task 4's ref check greps for.

- [ ] **Step 1: Edit A — rev bump (header + rev-5 note)**

Replace:
```
**Date:** 2026-11-03 (rev 4)
```
with:
```
**Date:** 2026-11-10 (rev 5)
```

Replace:
```
> **Rev 4 changes (2026-11-03):** P4, P5 and P6 are marked complete with
```
with:
```
> **Rev 5 changes (2026-11-10):** Documentation-system pass — §1.9 heading restored; Verification Evidence renumbered §1.13 (ADRs keep §2); session diary (`docs/sessions/`) + content-coverage tracker (`docs/CONTENT-COVERAGE.md`) added; header dates refreshed. Design: `docs/design/2026-11-10-doc-system-design.md`.
>
> **Rev 4 changes (2026-11-03):** P4, P5 and P6 are marked complete with
```

- [ ] **Step 2: Edit B — §1 heading date**

Replace:
```
## 1. Current State (verified 2026-09-23 · refreshed 2026-11-03)
```
with:
```
## 1. Current State (verified 2026-09-23 · refreshed 2026-11-10)
```

- [ ] **Step 3: Edit C — "Próximos pasos" pointer block (before the §1 status table)**

Replace:
```
| Area | Current status | Evidence / next focus |
```
with:
```
> **Próximos pasos:** latest session diary `docs/sessions/2026-11-10-tema3-parte2.md`
> (next-up: Tier B afiliación indebida — `docs/CONTENT-COVERAGE.md` §Tier B). Diary entry = source of truth; update this pointer in the same commit as the next diary entry.

| Area | Current status | Evidence / next focus |
```

- [ ] **Step 4: Edit D — duplicate `## 2.` → `### 1.13`**

Replace:
```
## 2. Verification Evidence (current verified baseline)
```
with:
```
### 1.13 Verification Evidence (current verified baseline)
```

(The ADR section keeps `## 2.`; the "Architecture decisions (§2)" ref at line 23 stays valid.)

- [ ] **Step 5: Edit E — insert the missing `### 1.9` heading**

Replace:
```
Pasada de diseño/UX sobre `src/App.tsx` y los componentes compuestos. Cambios verificados en el árbol (sin commit al cierre de esta revisión):
```
with:
```
### 1.9 Content/UX — onboarding, diálogos accesibles y StudySetup destilado (2026-11-03)

Pasada de diseño/UX sobre `src/App.tsx` y los componentes compuestos. Cambios verificados en el árbol (sin commit al cierre de esta revisión):
```

- [ ] **Step 6: Verify Task 2**

```bash
grep -n '^## 2\.' implementation_plan.md        # expected: exactly 1 line (ADR D2 section)
grep -n '^### 1\.9' implementation_plan.md      # expected: exactly 1 line
grep -n '^### 1\.13' implementation_plan.md     # expected: exactly 1 line
grep -n '## 2\. Verification' implementation_plan.md  # expected: 0 lines
grep -n 'rev 5' implementation_plan.md          # expected: header line + rev-5 note
grep -c 'Próximos pasos' implementation_plan.md      # expected: 1
grep -n 'Architecture decisions (§2)' implementation_plan.md  # expected: 1 line, untouched
```

---

### Task 3: Outer-surface edits + git rename

**Files:**
- Modify: `docs/SPEC.md`, `docs/plans/2026-10-23-exhaustive-audit.md`, `AGENTS.md`, `.opencode/agent/oposilab-guardian.md`
- Rename: `docs/superpowers/specs/2026-10-10-tema-8-mcq-learning-review-design.md` → `docs/design/2026-10-10-tema-8-mcq-learning-review-design.md`

**Interfaces:**
- Consumes: Task 1's `docs/sessions/` + `docs/CONTENT-COVERAGE.md` paths (AGENTS.md bullets); Task 2/this task's heading facts are untouched here.
- Produces: the canonical `docs/design/` home (Task 4 ref checks read these files).

Planning-time discoveries (not in the approved design; included because they are the same class of freshness defect and touch files this task already edits — flag for reviewer):
- The guardian agent's baseline is stale: "210 tests / 40 suites" and a 25-file test list (Edits I1/I2).
- `AGENTS.md` gains a `docs/design/` bullet so the new canonical folder is discoverable (Edit H).

- [ ] **Step 1: Edit F — SPEC.md staleness banner**

Replace:
```
You are a senior full-stack engineer, instructional designer, psychometrician, and Spanish administrative-law study-tool architect.
```
with:
```
> **Staleness notice (2026-11-10):** this spec is authoritative for *behavior* (§1–§22), **not** for the stack. §6's Next.js / Drizzle / better-sqlite3 / Vitest were deliberately not adopted; the implementation uses Vite + React 19 + Express + `node:sqlite` + Zod + `node:test`. See `AGENTS.md` ("Hard constraints") and `README.md` ("Arquitectura").
> For anything stack-shaped, AGENTS.md wins; this document fixes behavior only.

You are a senior full-stack engineer, instructional designer, psychometrician, and Spanish administrative-law study-tool architect.
```

- [ ] **Step 2: Edit G — audit-plan annotation for the 2 non-existent refs**

Replace:
```
> `docs/plans/2026-10-10-mercury-decide-integration.md`, `AGENTS.md`, `fix_types.cjs`, `patch_*.cjs`.
> **Relation to prior work:** executes and supersedes the audit *method* of `docs/plans/2026-09-audit-hardening.md`
```
with:
```
> `docs/plans/2026-10-10-mercury-decide-integration.md`, `AGENTS.md`, `fix_types.cjs`, `patch_*.cjs`.
> **Nota (2026-11-10):** the referenced files `docs/plans/2026-09-audit-hardening.md` and
> `docs/plans/2026-10-10-mercury-decide-integration.md` were untracked WIP at audit time and
> are not in this repository; this plan is kept as a historical record.
> **Relation to prior work:** executes and supersedes the audit *method* of `docs/plans/2026-09-audit-hardening.md`
```

- [ ] **Step 3: Edit H — AGENTS.md key-docs bullets**

Replace:
```
- `docs/SPEC.md` — full product specification (§1–§22). Authoritative for *behavior*, **not** for stack (see warning below).
- `implementation_plan.md` — working plan (P1–P6 priorities, current state, ADRs). P1–P6 are complete; check §1 and §1.9 for the current verified baseline.
- `docs/ACCEPTANCE.md` — acceptance criteria → evidence mapping (35 criteria). Update it when acceptance status changes.
```
with:
```
- `docs/SPEC.md` — full product specification (§1–§22). Authoritative for *behavior*, **not** for stack (see warning below).
- `implementation_plan.md` — working plan (P1–P6 priorities, current state, ADRs). P1–P6 are complete; check §1 and §1.9 for the current verified baseline.
- `docs/sessions/` — session diary (one file per working cycle, newest first); read the latest entry before starting work for continuity.
- `docs/CONTENT-COVERAGE.md` — per-topic audit coverage matrix + Tier B deferred-content checklist.
- `docs/design/` — design specs (canonical home; newest: `docs/design/2026-11-10-doc-system-design.md`).
- `docs/ACCEPTANCE.md` — acceptance criteria → evidence mapping (35 criteria). Update it when acceptance status changes.
```

- [ ] **Step 4: Edit I — guardian agent (pointer + stale-baseline refresh)**

I1. Replace:
```
- `npm test` = `node:test` via `tsx`; current baseline **210 tests / 40 suites** (~5 s). Do not assume Vitest or Jest patterns.
```
with:
```
- `npm test` = `node:test` via `tsx`; current baseline **318 tests / 43 suites** (~9 s). Do not assume Vitest or Jest patterns.
```

I2. Replace:
```
- `tests/` has 25 `*.test.ts` files: `sqlite`, `sqlite-migrations`, `persistence`, `pipeline`, `oposilab`, `validation-gate`, `validation-warnings`, `seed-integrity`, `seed-reconcile`, `seed-sync-content`, `interleaving-hardening`, `queue-order`, `option-order`, `srs-graduation`, `scorer-hardening`, `non-mcq-evaluation`, `analytics`, `eligibility`, `practice-pools`, `retrieval`, `schema-contracts`, `drill-selectors`, `jev-normalize`, `tema8-bank`, `tema8ip-bank`.
```
with:
```
- `tests/` has 28 `*.test.ts` files: `sqlite`, `sqlite-migrations`, `persistence`, `pipeline`, `oposilab`, `validation-gate`, `validation-warnings`, `seed-integrity`, `seed-reconcile`, `seed-sync-content`, `interleaving-hardening`, `queue-order`, `option-order`, `srs-graduation`, `scorer-hardening`, `non-mcq-evaluation`, `analytics`, `eligibility`, `practice-pools`, `retrieval`, `schema-contracts`, `drill-selectors`, `jev-normalize`, `tema8-bank`, `tema8ip-bank`, `modal-a11y`, `form-labeling`, `renderer-coverage`.
```

I3. Replace:
```
- `implementation_plan.md` priorities P1–P6 (complete; §1 and §1.9 hold the current baseline)
```
with:
```
- `implementation_plan.md` priorities P1–P6 (complete; §1 and §1.9 hold the current baseline), plus the latest `docs/sessions/` entry
```

- [ ] **Step 5: Edit J — git rename of the tema-8 design spec**

```bash
cd /var/home/ansimistrator/Documents/OPOSICIONES/oposilab-mcq-trainer
git mv docs/superpowers/specs/2026-10-10-tema-8-mcq-learning-review-design.md docs/design/2026-10-10-tema-8-mcq-learning-review-design.md
git ls-files docs/superpowers/   # expected: empty
git ls-files docs/design/        # expected: 2026-11-10-doc-system-design.md + 2026-10-10-tema-8-mcq-learning-review-design.md
```

NOTE: text mentions of the old path inside the already-committed design spec (`docs/design/2026-11-10-doc-system-design.md`, D3.6) and this plan remain — they document the rename; this is NOT a failure.

- [ ] **Step 6: Verify Task 3**

```bash
head -2 docs/SPEC.md
grep -n 'Nota (2026-11-10)' docs/plans/2026-10-23-exhaustive-audit.md
grep -n 'docs/sessions/\|CONTENT-COVERAGE\|docs/design/' AGENTS.md
grep -n '318 tests / 43 suites\|28 \`' .opencode/agent/oposilab-guardian.md
```

Expected: banner is the first lines of SPEC.md; annotation present once; 3 new AGENTS.md bullets; guardian shows the refreshed baseline + pointer.

---

### Task 4: Verification, single commit, push

**Files:** none modified (verification + git only). Stages exactly what Tasks 1–3 created/modified/moved.

**Interfaces:**
- Consumes: all outputs of Tasks 1–3.
- Produces: commits `docs(structure): ...` (this build) pushed to `origin/main`. Note: the **design spec** commit (`7ee1748`, local) and **this plan's** commit (made immediately after this plan is saved) ship in the same push — the build commit stacks on top.

- [ ] **Step 1: Pre-flight `git status` (parallel-agent gate)**

```bash
git status --porcelain
git log --oneline -3
```

Expected: ONLY this plan's docs paths are modified/untracked (untracked: `docs/sessions/`, `docs/CONTENT-COVERAGE.md`) plus the plan's own staged state. The parallel agent's `M server/seedData.ts` / `?? server/seedDataTema15Extra.ts` must still be untouched by us — if they've landed, re-check `git log --oneline -3` and work on the then-HEAD counts for the Task-1 matrix (still derived from `HEAD`, so no matrix change needed unless a content commit landed with new counts — if one did, flag it and correct the matrix row in this same commit).

- [ ] **Step 2: Cross-reference check**

```bash
grep -n '§1\.9' implementation_plan.md AGENTS.md .opencode/agent/oposilab-guardian.md
grep -n '§1\.13' implementation_plan.md
grep -n '^### 1\.9\|^### 1\.13\|^## 2\.' implementation_plan.md
```

Expected: `§1.9` resolves to the new heading; exactly one `## 2.`; `§1.13` exists; AGENTS.md + guardian §1.9 cites now have a target. No dangling `§` refs among touched files.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: `tsc --noEmit` clean, 0 errors.

- [ ] **Step 4: Full test suite**

```bash
npm test
```

Expected: **318/318 in 43 suites**. Parallel-WIP gate: if failures trace to seed files modified by the other agent (see Step 1), do NOT relax the gate silently — record the failing suites, note "suite red due to parallel WIP, not to docs changes", and either wait for their commit or commit the docs with the red-suite reason written in the commit message. (Docs cannot break tests — no code reads `.md` files.)

- [ ] **Step 5: Stage docs-only paths, commit, push**

```bash
git add docs/CONTENT-COVERAGE.md docs/sessions/2026-11-10-tema3-parte2.md implementation_plan.md docs/SPEC.md docs/plans/2026-10-23-exhaustive-audit.md AGENTS.md .opencode/agent/oposilab-guardian.md docs/design/2026-10-10-tema-8-mcq-learning-review-design.md
git status --porcelain   # verify the staged set is exactly these paths (+ the rename pairing)
git commit -m "docs(structure): add session diary, coverage tracker, repair doc cross-references"
git push
```

Expected: push succeeds; `git status --porcelain` ends empty except any parallel-agent files.
