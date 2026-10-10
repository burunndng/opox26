# Tema 8 MCQ Learning and Review — Design

**Status:** Approved and implemented  
**Scope:** Tema 8's 70 seeded items, Mode A learning flow, and non-destructive seed synchronization.  
**Content authority:** `/var/home/ansimistrator/Downloads/T8especifico-COLECTIVOS ESPECIALES.md` (supersedes the earlier visual guide where they differ).

## Objective

Make Tema 8 useful for learning and reviewing exam-style Seguridad Social MCQs: each item should test a defensible distinction, preserve the complete rule and its conditions, and teach the learner why the keyed answer fits and why a tempting alternative does not. Use the supplied Tema 8 guide as the content authority. Where that guide flags ambiguity or missing detail, do not resolve it by inference or present it as settled law.

## Learner flow

1. **Attempt first:** Mode A presents the complete four-option MCQ without showing its answer or rationale beforehand. It remains untimed and low-pressure; its options retain exam-style content.
2. **Explain after the choice:** feedback identifies the keyed answer, cites the supplied legal basis, states the applicable rule, applies it to the facts in the stem, and explains the learner's selected distractor where applicable. A concise discriminating cue should be distinct from the full explanation.
3. **Remediate by retrieval:** an incorrect item returns later in the existing batch loop. The retry must not be preceded by the answer or a purported worked example that gives it away.
4. **No fake examples:** remove the current “Worked Example” fallback that selects the first distractor explanation. Use “Aplicación al supuesto” for the item's reasoned solution; reserve “ejemplo práctico” for a separately authored example that actually demonstrates a different case.

## Content semantics and audit corrections

Retain the existing item shape where practical, with consistent field meaning: `rule_statement` is the complete rule being tested; `why_correct` explains its application to the stem; `corrective_rule` is a short, distinct retrieval cue; `distractor_analysis` explains each wrong option rather than repeating a generic correction. Keep the question bank at 70 records unless an item must be held from practice for source uncertainty.

Audit findings to address before release:

- Clarify item 2 so “ordinary duration” cannot be confused with the 545-day maximum including extension.
- Correct item 8's contradictory explanation of the start date for the subsidy.
- Restore omitted scope in item 33's shortened correct option, including collaborating employers where the guide includes them.
- Complete item 66 with the continued-treatment prerequisite stated in the guide.
- Rewrite item 70 to identify the permanent-disability situation and incompatible adapted/alternative post precisely.
- Remove or rebalance the shortened correct-option overrides where they omit qualifications or create a style/length clue; make alternatives parallel without making distractors ambiguous.
- Rework compound questions where multiple independent rules are bundled, especially items 16, 33–35, 39, 50, 53, 55–59, and 66. Preserve useful contrast/repetition only when the tested distinction is clear.
- Item 22 may state the part-time base rule directly. The earlier guide flagged the wording as ambiguous, but `T8especifico-COLECTIVOS ESPECIALES.md` (now the content authority) states it plainly: bases accredited since the last alta, up to three months immediately prior to the month before the hecho causante, divided by the natural days of that period, and paid for every natural day of incapacity.
- Item 68 may state the resolution-date and retroaction rule directly. The same source states it cleanly in art. 174.6; the earlier guide's warning concerned a separate 180-day rule for a new process and does not apply here.
- Keep item 13 categorical; do not invent age-specific contribution periods that the supplied guide does not give.

## Live data and preservation

Extend boot reconciliation for **unattempted** seed items to synchronize all seed-owned question content needed by the runner, including `stem`, `distractor_analysis`, and `trap_types` (options are already synchronized). Preserve content for attempted items under the existing ownership rule. Do not reset, recreate, or delete the SQLite database, attempts, schedules, or user-authored content. The observed local database had 70 Tema 8 rows and zero Tema 8 attempts, but implementation must still respect the attempted-item guard.

## Verification and acceptance

- Audit all 70 IDs against the supplied guide; every active item has one correct answer, four exam-style options, a complete applicable rule, a correct rationale, and option-specific feedback. Explicit source uncertainties are held or narrowly reframed.
- Mode A does not reveal the key/rationale before a response, uses all four choices, does not label distractor feedback as a worked example, and gives feedback tied to the learner's selected option.
- Regression tests prove stale unattempted seed content is synchronized and attempted item content is preserved; add focused tests for Mode A option count/feedback behavior and Tema 8 bank integrity.
- Run `npm run lint` followed by `npm test`. Verify against isolated test data; do not reset the user's database or restart an in-use server without asking.

## Non-goals

- No framework migration, new AI-generated legal claims, external-law assumptions, full mock-exam module, or database reset.
- No broad redesign of other topics or Mode B unless a shared change is required to keep the MCQ runner consistent.
