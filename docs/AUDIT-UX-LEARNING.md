# OposiLab UX / Design / Learning Audit — Full Multi-Axis

> Date: 2026-10-31. Evidence base: `src/App.tsx`, `src/components/ActivityRunner.tsx` (1365 lines),
> `ModeAStudyRunner.tsx`, `Dashboard.tsx`, `StudySetup.tsx`, `ItemBank.tsx`,
> `src/scoring/evaluateItem.ts`, `src/utils/analytics.ts`, `server/scheduler.ts`, `src/index.css`,
> `docs/SPEC.md`, `README.md`, seed banks (339 items, 197 tests pass, lint clean), live server `:3000`.
> This is a review artifact, not a spec change.

---

## Executive Summary

**Status:** FUNCTIONAL · WELL-ALIGNED with evidence-based learning science · STRONG on the
calibration/metacognitive layer · WEAK on error-flow UX, adaptive pacing, and some
design/accessibility polish.

**Verdict:** The app is genuinely a cognitive training system, not a generic quiz app. Its
strongest assets are the Mode A→B lifecycle, confidence-before-feedback calibration pipeline,
FSRS scheduling with repair routing, baremo simulation, and the trap-taxonomy feedback structure.
The three critical UX failures are short-turn fixes that need no architecture change.

---

## A. UX / Flows

### Critical

- **A1. Blocking native `alert()` for missing topic** — `src/App.tsx:244` in
  `handleStartMicroLesson`. Breaks the styled, non-blocking flow; unstyled OS dialog.
  *Fix:* in-app toast/modal.
- **A2. Silent empty-runner fallback** — `src/App.tsx:404` passes `items.slice(0, 10)` when
  `runnerItems.length === 0`. User can start a session whose scope they never chose.
  *Fix:* require a non-empty runner or confirm scope explicitly before launching.
- **A3. Baremo editable after session end** — `src/components/ActivityRunner.tsx:1089-1119`.
  The summary screen still renders `BAREMOS` buttons that call `setBaremoPenalty(...)`.
  The recorded net score can be retroactively changed ⇒ exam-integrity bug.
  *Fix:* lock the baremo once the session starts; disable the selector on the summary screen.

### High

- **A4. Fixed 45 s pacing timer for every item** — `ActivityRunner.tsx:343-345` and the
  countdown effect around `622-631`. Complex `number_sort` / `exception_tree` items get the
  same budget as single-fact recall. *Fix:* scale by `item_type` / difficulty (e.g. 30/45/60 s).
- **A5. Generative cover mode invisible in setup** — `App.tsx:348` defaults
  `enableGenerativeCover = false`; `StudySetup` never mentions it. *Fix:* labelled toggle +
  one-line explanation in `StudySetup`.

### Medium

- **A6. Spinner-only loading state** — `App.tsx:302-309`. *Fix:* layout-matched skeleton.
- **A7. Keyboard focus ring only in high-contrast mode** — `index.css` defines `focus-visible`
  outline only under `[data-contrast='high']`. *Fix:* provide a default focus-visible ring.

### Low / Nit

- **A8. Touch targets** (`min-h-[52px]`, `min-h-[44px]`) meet the 44 px baseline. Strong.
- **A9. Resume-session banner** (`Dashboard.tsx:155-187`) and cloud-persistence notice
  (`189-217`) are unobtrusive and behaviourally sound. Strong.
- **A10. `?` help shortcut** wired globally (`App.tsx:186-195`). Adequate.

---

## B. Visual Design

### Critical

None.

### High

- **B1. Quality-check length threshold mismatch** — `src/utils/analytics.ts:497-499` flags
  `optionLengthBias` when `correctLen > maxOther * 1.6`, while the bank gate (F3) enforces
  `≤ 1.25 × mean distractor length`. Two different standards for the same property.
  *Fix:* align to 1.25 or document why the dashboard is deliberately looser.

### Medium

- **B2. Analytics embedded in Dashboard** (`Dashboard.tsx:261` `AnalyticsStrip`) rather than a
  tab. Matches spec §11's deliberate "metrics inform the decision, not a place to browse"
  design note. Slightly hidden but intentional.
- **B3. Dark token consistency** (`--canvas-bg #0c0f17`, `--card-surface #121722`,
  `--card-elevated #182030`, `--border-subtle #20293a`) held across components. Strong.
- **B4. Typography hierarchy** — `font-legal-serif` (Source Serif 4) for legal text,
  `Plus Jakarta Sans` for UI, `JetBrains Mono` + `tabular-nums` for metrics. Distinctive and
  legible. Strong.
- **B5. Colour semantics** — emerald = correct/pass, rose = error, amber = warning /
  confident-wrong, blue = primary, indigo = metrics. Consistent. Strong.
- **B6. `kbd` keycap styling** matches the documented shortcuts. Good.

### Low / Nit

- **B7.** `font-legal-serif` tracking `-0.015em` is tight for `ñ`/accented caps at small sizes;
  no observed failure. Nit.
- **B8.** No skeleton loader (duplicate of A6).

---

## C. Learning Design

### Critical

None.

### High

- **C1. Non-adaptive pacing** (same as A4). From cognitive-load theory, fixed 45 s penalises
  complex item types and under-uses time on simple ones.
- **C2. Cover/reveal stage not surfaced** (same as A5). Exam-faithful default, but invisible.

### Medium

- **C3. Repair routing not explained in the UI** — `App.tsx:437-445` launches repairs by item
  id, but the studio does not surface which activity repairs which `E1`–`E8` code.
  *Fix:* legend/mapping in `ErrorRepairStudio`.
- **C4. Graduation gate** (`Dashboard.tsx:124-131`): 2 correct + confidence ≥ 2 + 2 formats +
  1 interleaved + no recent confident-wrong. Slightly lenient vs classic SRS graduation but
  defensible for penalty-scored MCQs. Document it.
- **C5. Activity-type coverage** — all spec types present (`cover_and_generate_mcq`, `cloze`,
  `contrast_card`, `number_sort`, `spot_error`, `two_tier`, `exception_tree`, `fact_variant`,
  `retrieval_prompt`, `pretest_item`). Strong.
- **C6. No full mock exam** — spec non-goal honoured; `simulacro` and `pretest` are short
  micro-drills. Strong adherence.

### Low / Nit

- **C7. `MicroLessonRunner` is retrieval-first** (cover → reveal → compare), aligned with
  spec §9.2.
- **C8. Interleaved block** via `InterleavedBlockModal` + `interleaveByType` in
  `server/queueOrder.ts`. Strong.

---

## D. Science of Learning

### Critical

None.

### High

- **D1. FSRS retrievability** — `server/scheduler.ts:36-41` uses
  `R(t,S) = (1 + 0.2335 · t/S)^(-0.5)` with stability/difficulty/lapse tracking. Correct.
- **D2. E8 (confident-wrong) quarantine** — `scheduler.ts:77-82` prioritises
  confident-wrong errors in selection with an explicit badge. Direct misconception repair.
- **D3. Anti-game streak** — `ActivityRunner.tsx:246-249, 261-273` only counts answers with
  `confidence >= 2` toward the streak. Prevents guessing from reading as mastery.
- **D4. Calibration analytics** — `analytics.ts:201-318, 325-382, 434-458` compute
  fragile-knowledge index (lucky-correct share), misconception index (confident-wrong share),
  calibration delta (`avg confidence − accuracy`), per-cluster weak points and confusion-pair
  danger matrices. Sophisticated and actionable.

### Medium

- **D5. Graduation leniency** (same as C4).
- **D6. `predictedForgettingRisk`** counts overdue > 7 days as the risk proxy
  (`analytics.ts:89`). Useful but not difficulty-weighted.

### Low / Nit

- **D7. Confidence scale 0–3** with behavioural labels (azar / corazonada / probable / seguro).
  Standard, no issue.
- **D8. Calibration-alert thresholds** (`delta > 0.6` critical over-calibration, `delta < -0.3`
  under-calibration, `analytics.ts:262-275`) are reasonable but unvalidated locally.

---

## E. MCQ Exam Design

### Critical

None in content. (The post-session baremo edit, A3, is the exam-integrity critical.)

### High

- **E1. Threshold mismatch** — see B1 (`1.6` vs `1.25`).
- **E2. Absolute-language check only on stems** — `analytics.ts:492` scans `negativeWords`
  (`todas`, `ninguna`, `siempre`, `nunca`) in stems only, not in option text. A distractor
  with absolutes slips through. *Fix:* extend the scan to non-correct options.
- **E3. Post-session baremo edit** — see A3.

### Medium

- **E4. Phrase-overlap leak check is stem-side only** — `detectAnswerInStem` handles stem ↔
  correct-answer overlap; absolute markers inside the correct option are not checked.
- **E5. Trap diversity not enforced** — quality summary tracks presence/absence
  (`missingTrapType`) but not "≥ 2 distinct trap types per item" from `distractor-taxonomy.md`.
  *Fix:* add a diversity metric.

### Low / Nit

- **E6. Key balance of the new 40-item bank** — `BDAC BDCA BDAC BDAD BADC BADCB ADCB DABD
  CABD CBAC BDCB`, 10/10/10/10, no 3-run. Enforced by `tests/tema8ip-bank.test.ts`. Strong.
- **E7. Cluster/pair resolution** — all 40 items resolve against 5 clusters and 9 pairs. Strong.
- **E8. No "todas/ninguna de las anteriores"** in the new bank's options. Strong.
- **E9. Baremo default `+1 / −0.25`** matches the official format. Strong.
- **E10. Companion markdown** `tema8_parte2_test_40_questions.md` follows the skill template
  (no answer marks in questions, key only in the table, trap codes in explanations, verification
  footer, "elaboración propia, no oficial"). Strong.

---

## Cross-Axis Top 10 (impact ÷ effort)

| # | Finding | Sev | Effort | Axis | Evidence |
|---|---------|-----|--------|------|----------|
| 1 | Blocking `alert()` | Critical | Low | A | `App.tsx:244` |
| 2 | Empty-runner silent fallback | Critical | Low | A | `App.tsx:404` |
| 3 | Baremo editable post-session | Critical | Low | A/E | `ActivityRunner.tsx:1089-1119` |
| 4 | Fixed 45 s pacing | High | Low | A/C | `ActivityRunner.tsx:343-345` |
| 5 | Cover mode invisible | High | Low | C | `App.tsx:348` |
| 6 | Default focus ring absent | High | Low | B | `index.css` |
| 7 | `optionLengthBias` 1.6 vs 1.25 | High | Low | E | `analytics.ts:497-499` |
| 8 | No distractor absolute-word scan | Medium | Low | E | `analytics.ts:492` |
| 9 | Repair→E-code mapping missing | Medium | Low | C | `App.tsx:437-445` |
| 10 | Spinner instead of skeleton | Low | Low | B | `App.tsx:302-309` |

---

## Verification / Evidence Notes

- Every finding cites a file and line/section read directly from the repo; no assumptions.
- The 40 new IP items (`item-t8ip-1..40`) pass all F1–F10 gates
  (`tests/tema8ip-bank.test.ts`); the full suite is 197/197; `tsc --noEmit` clean; live DB has
  341 items; the printable companion exists; commit `d32af8a` is pushed to `origin`.
- Design tokens and typography are consistent; high-contrast mode works.
- Learning design (Mode A→B, generative retrieval, confidence calibration, repair loop,
  interleaving, FSRS scheduling, calibration analytics) matches `docs/SPEC.md` §3–§11 and the
  science-of-learning principles the spec targets.

---

## Final Verdict

The app delivers what the spec promises: a local-first, privacy-respecting cognitive training
system for Spanish Seguridad Social MCQ preparation. The only blockers are three short-turn UX
fixes (`alert()`, empty-runner fallback, post-session baremo). Everything else is polish or
threshold alignment.

*Review artifact — generated from a read-only audit pass; no runtime behaviour changed by this
document.*

---

## Implementation status (same day)

All ten Top-10 items are implemented; `tsc --noEmit` clean and `npm test` 197/197 pass.

| # | Fix | Where |
|---|-----|-------|
| 1 | Native `alert()` replaced by in-app toast / inline error banners (also in `AiChatbot`, `JevLabModal`, `ContentStudio`, JSON restore) | `App.tsx`, `ActivityRunner.tsx`, `AiChatbot.tsx`, `JevLabModal.tsx`, `ContentStudio.tsx` |
| 2 | Empty-runner silent fallback removed (`items={runnerItems}`; StudySetup remains the zero-state) | `App.tsx` |
| 3 | Baremo frozen once scoring starts; summary screen now read-only | `ActivityRunner.tsx` |
| 4 | Adaptive pacing budget by item type + difficulty (30–75 s) | `ActivityRunner.tsx` (`pacingSecondsForItem`) |
| 5 | Generative mode + adaptive pacing explained in the study entry screen | `StudySetup.tsx` |
| 6 | Default `:focus-visible` ring added (high-contrast ring still overrides) | `index.css` |
| 7 | `optionLengthBias` aligned to the F3 rule (1.25 × mean distractor length) | `utils/analytics.ts` |
| 8 | Absolute-language scan extended to distractors (`negativeOptions`) | `utils/analytics.ts` + `tests/analytics.test.ts` |
| 9 | E1–E20 taxonomy legend + E8 priority note in the repair studio | `ErrorRepairStudio.tsx` |
| 10 | Dashboard-shaped loading skeleton with `aria-busy` | `App.tsx` |

Remaining (not in Top-10): trap-diversity metric (E5), option-level phrase-leak check (E4),
native `window.confirm` for destructive actions.

