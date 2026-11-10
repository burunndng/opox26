# Design: OposiLab documentation system (diary, coverage tracker, surgical repairs)

**Date:** 2026-11-10
**Status:** approved by user (approaches / design / spec folder confirmed in session)
**Context:** GOAL — every *useful* document is present, current, and discoverable; the missing
pieces (agent session diary, content-coverage tracker) are added so a fresh agent can resume
work in ≤5 minutes from committed docs alone.

---

## 1. Background and problem

### 1.1 What exists (all committed, verified 2026-11-10)

| Path | Role today | Fresh? |
|---|---|---|
| `README.md` | User-facing guide (Spanish) | ✅ counts current (475/481, 318/318 in 43 suites) |
| `docs/ACCEPTANCE.md` | 35 criteria → evidence mapping | ✅ current; honest about 🟡 criterion 32 |
| `docs/SPEC.md` | Original product spec (§1–§22) | ⚠️ behavior-authoritative, stack stale; warns only *externally* |
| `AGENTS.md` | Agent quick-start | ✅ fresh, 64 lines |
| `implementation_plan.md` | Plan + baseline + ADRs + audit diary (497 lines) | ⚠️ does 4 jobs; structural bugs (below) |
| `docs/AUDIT-UX-LEARNING.md` | Dated design audit (2026-10-31) | ✅ self-flags counts as historical |
| `docs/audit/2026-10-23/` | Exhaustive-audit REPORT + 14 evidence/log files | ✅ coherent historical record |
| `docs/plans/` | 2 archived execution plans | ✅ |
| `docs/superpowers/specs/` | 1 design spec (`2026-10-10-tema-8-...`) | ⚠️ plugin-named folder; dead-end for discovery |
| `.opencode/agent/` | editor + guardian sub-agents | ✅ |
| `.impeccable/critique/` | 5 tracked UX-critique artifacts (2026-11-03) | ➖ historical process output, kept as-is |

No code or tests read any `.md` file (verified by grep; the only inbound refs are two comments
in `server/seedDataTema15.ts` citing `§1.6`/`§1.8`, which this design does not touch).

### 1.2 Verified problems

1. **Dangling section heading:** `§1.9` has no heading. Its body (the 2026-11-03 UX/accessibility
   pass) sits orphaned inside the "Verification Evidence" section, yet `AGENTS.md:7`, the
   guardian agent (`line 28`), and 6 internal refs (`implementation_plan.md` lines 11, 16, 69,
   308, 353, 477) all point at §1.9.
2. **Duplicate numbering:** two `## 2.` sections — "Verification Evidence" (line 91) and
   "Architecture Decisions (ADR)" (line 143). Line 23 (`Architecture decisions (§2)`) proves
   §2 refers to the **ADR** section, so the duplicate must be fixed on the Verification
   Evidence side.
3. **Stale rev/date:** header says `2026-11-03 (rev 4)` and §1 says `refreshed 2026-11-03`,
   although §1.11 (2026-11-09) and §1.12 (2026-11-10) were appended without a rev bump.
4. **Dangling file references:** `docs/plans/2026-10-23-exhaustive-audit.md` cites
   `docs/plans/2026-09-audit-hardening.md` and `docs/plans/2026-10-10-mercury-decide-integration.md`
   — neither exists in the repo (untracked WIP at audit time).
5. **Deferred content is scattered prose:** Tier B follow-up candidates live inside §1.11/§1.12
   paragraphs. No checklist; the "next batch" decision is easy to lose between sessions.
6. **No session handoff:** continuity relies on git log + §1.x diary + chat memory. A fresh
   agent session cannot answer "what was the last session's next step?" from the repo alone.
7. **No doc map:** README names only 4 of the docs; design docs have no canonical home.

### 1.3 Out of scope (explicit non-goals)

- Full restructure of `implementation_plan.md` (ruled out: cross-reference risk, breaks the
  "additive only" constraint set in session).
- Moving `### 1.1` / `### 1.2` into chronological order (cosmetic; heading-only fix).
- A CHANGELOG generated from conventional commits; a RUNBOOK duplicating README/AGENTS.md.
- Converting historical files (audit REPORT, archived plans) — annotate, never rewrite.

---

## 2. Goals and success criteria

1. A fresh agent answers **what is verified now / what is next / what is deferred and why**
   in ≤5 minutes from committed docs alone.
2. **Zero dangling `§` references** and zero dangling file references among committed docs.
3. Counts (475 seeded / 481 eligible, 318/318 in 43 suites) unchanged and consistent everywhere.
4. Docs-only change: no code or test behavior changes (`npm run lint` + `npm test` stay green).

---

## 3. Design (Approach B, approved)

### D1 — Session diary (`docs/sessions/`)

**Convention.** One lowercase file per working cycle:
`docs/sessions/YYYY-MM-DD-<slug>.md` (slug: short kebab-case of the cycle's topic).
Mirroring `docs/plans/` and `docs/audit/` naming. Contents: one short paragraph + the template
below. Spanish field names match the §1.x audit-entry style; bodies may be in any language used
by the cycle.

**Template (max ~15 lines):**

```markdown
# Session — YYYY-MM-DD <topic>

- **Objetivo:** <one line>
- **Hecho:** <what changed, with commit hashes>
- **Verificado:** <lint/tests/build results, verbatim counts>
- **Siguiente paso:** <single next action; link to CONTENT-COVERAGE §Tier B if content>
- **Notas:** <pitfalls/gotchas, optional>
```

**Seed entry:** `docs/sessions/2026-11-10-tema3-parte2.md` — the Tema 3 gap-audit batch just
shipped (commit `7ddd20b`, 12 MCQs `item-t3-50…61`, 318/318, 475/481; **Siguiente paso:**
Tier B batch, headliner = afiliación indebida / devolución de cuotas, see `docs/CONTENT-COVERAGE.md`).
It also serves as the worked example future entries copy.

**Pointers (so the diary is actually read):**
- `AGENTS.md`, "Key documents" list, add two bullets:
  - `` `docs/sessions/` — session diary; read the latest entry before starting work (continuity) ``
  - `` `docs/CONTENT-COVERAGE.md` — per-topic coverage + Tier B deferred-content checklist ``
- `.opencode/agent/oposilab-guardian.md` (line ~28): append ", plus the latest `docs/sessions/`
  entry" to the mirror-parity sentence.
- `implementation_plan.md` §1: add a 2-line pointer block **before** the status table:
  `> **Próximos pasos:** latest session diary `docs/sessions/2026-11-10-tema3-parte2.md`
  (next-up: Tier B afiliación indebida — `docs/CONTENT-COVERAGE.md` §Tier B).`
  **Drift rule (recorded here):** the diary entry is the source of truth; this block is
  pointer-only and is updated in the same commit as the next diary entry.

### D2 — Content coverage tracker (`docs/CONTENT-COVERAGE.md`)

A single table + Tier B checklist. It replaces searching §1.3–§1.12 prose to answer
"what has been audited, what is pending".

**Matrix columns:** `Tema` · `Fuente (clase/resumen)` · `Ítems` · `Última auditoría` · `Estado`
(auditado / pendiente / n/a legacy).

**Rows (verify item counts against seed files at build time):**

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

**Tier B checklist** (checkboxes; each item: origin § ref + one-line why deferred):

- [ ] **Afiliación indebida + devolución de cuotas** (Tema 3) — strongest follow-up candidate, §1.12
- [ ] Cuotas 28/30 % y MEI, cifras 2027 (Tema 4) — outside Tema 3 scope, §1.12
- [ ] Sucesión solidaria (Tema 5), §1.12
- [ ] Intervalo 9–12 meses de carencia (Tema 9), §1.11 (G15)
- [ ] Tabla RG/TREBEP del §3.6 del resumen parte 2 (Tema 9), §1.11
- [ ] Reconcile professor contradictions: 360/180 days, 50 % wording, SMI figures,
      "Victoria 4× SMI" (Tema 9), §1.11

**How-to paragraph** (≤4 lines in the file): after each gap audit (1) append a diary entry (D1),
(2) check off/adjust this tracker, (3) update the §1 "Próximos pasos" pointer. Nothing else.

### D3 — Surgical repairs (additive only)

Exact edits; nothing else in these files changes:

1. `implementation_plan.md`: insert before the orphaned text beginning "Pasada de diseño/UX
   sobre `src/App.tsx`…" (line ~101) the heading:
   `### 1.9 Content/UX — onboarding, diálogos accesibles y Estudio destilado (2026-11-03)`
   (matches the rev-4 note: "New §1.9 records the UX/accessibility pass (onboarding, focus
   trap, distilled study setup and collapsible runner controls)"). All 8 §1.9 refs then resolve.
2. `implementation_plan.md`: `## 2. Verification Evidence (current verified baseline)`
   → `### 1.13 Verification Evidence (current verified baseline)`.
   The ADR section keeps `## 2.`; line 23's "(§2)" stays valid; no other refs break
   (verified §2 appears only at lines 23, 91, 143).
3. `implementation_plan.md`: header `**Date:** 2026-11-03 (rev 4)` → `**Date:** 2026-11-10 (rev 5)`;
   add a rev-5 note in the same style as the rev-4 note (one line: documentation-system pass;
   §1.9 heading restored; Verification Evidence → §1.13 with ADRs keeping §2; diary +
   coverage tracker added). §1 heading: `refreshed 2026-11-03` → `refreshed 2026-11-10`.
4. `docs/SPEC.md`: 3-line staleness banner at the very top, pointing at `AGENTS.md` /
   `README.md` for the real stack (Vite + React 19 + Express + `node:sqlite` + Zod +
   `node:test`; spec §6's Next.js/Drizzle/better-sqlite3/Vitest deliberately not adopted).
   Behavior sections untouched.
5. `docs/plans/2026-10-23-exhaustive-audit.md`: directly below the "Frozen revision"
   paragraph, add this annotation (history preserved, dead end acknowledged):

   > `**Nota (2026-11-10):** the referenced files `docs/plans/2026-09-audit-hardening.md` and
   > `docs/plans/2026-10-10-mercury-decide-integration.md` were untracked WIP at audit time and
   > are not in this repository; this plan is kept as a historical record.`
6. Git rename (no text change): `git mv
   docs/superpowers/specs/2026-10-10-tema-8-mcq-learning-review-design.md
   docs/design/2026-10-10-tema-8-mcq-learning-review-design.md`
   → `docs/design/` becomes the canonical design-doc home (this spec lives there too).
   Verified: zero inbound references to the old path. `docs/superpowers/specs/` empties out
   (git drops empty dirs automatically).

### D4 — Verification and commit

1. Ref check: grep `§` cross-refs in touched `.md` files — every cited section/file must exist.
2. `npm run lint` (tsc clean) + `npm test` (318/318 in 43 suites) — docs-only change; run to
   hold the repo convention "every phase ends with lint + tests".
3. Single conventional commit: `docs(structure): add session diary, coverage tracker, repair
   doc cross-references` (touched files only; re-check `git status`/`git log` first — a
   parallel agent may be working in the repo), then push.

---

## 4. Decisions recorded (from session)

| # | Decision | Rationale |
|---|---|---|
| 1 | Balanced audience (agent-parseable fields, scannable by user) | user choice, session Q1 |
| 2 | Additive-only plan surgery | user choice, session Q2 — no restructure, no §1.1/§1.2 reorder |
| 3 | Specs live in `docs/design/` | user choice on folder; completes the taxonomy (design → plan → sessions → audit); single home via the git-mv |
| 4 | Diary field names in Spanish; spec in English | matches §1.x audit-entry style; AGENTS.md is English |
| 5 | Approaches A/C rejected | A leaves the diary gap unaddressed; C violates constraint #2 / cross-ref risk |

## 5. Risks and mitigations

- **Diary discipline decay** (entries stop being written) → template capped at ~15 lines;
  "Próximos pasos" pointer + AGENTS.md bullet make it part of the pre-flight checklist.
- **Tracer drift** (counts in the matrix rot) → matrix keeps only slowly-changing fields
  (item counts per topic change on content batches, which already update README/ACCEPTANCE/
  seed-reconcile in the same commit; the build step re-verifies counts against seed files).
- **Pointer drift** (Próximos-pasos block stale) → drift rule in D1: updated in the same
  commit as each new diary entry.
