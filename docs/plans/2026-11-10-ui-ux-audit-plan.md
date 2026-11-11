# UI/UX Audit & Simplification Plan — 2026-11-10

> Status: **PLAN ONLY** (approved scope = plan; no UI changes until the backlog below is approved).
> Precedent: `docs/AUDIT-UX-LEARNING.md` (2026-10-31) — its Top-10 is fully implemented, so this
> audit does not repeat it; it builds on it. Evidence base: source as of `2881ea8` + live server
> `:3000`.

---

## 0. Goal

Make OposiLab look and behave like a **professional 2026 educational app**: one clear path per job,
no duplicated menus/options, every number on screen true, visually calm and deliberate — **no AI
slop** (emoji-as-icons, cluttered dashboards, six ways to do the same thing).

Success criteria (all measurable):

1. **No duplicated controls.** Every user-facing action has exactly one primary entry point
   (contextual badges may *link* to it, but not re-implement it).
2. **No phantom zeros.** Every count rendered in the UI is derived from the full dataset or an
   explicitly scoped one — never from an accidentally filtered one.
3. **Reduced surface.** The daily path is ≤ 3 top-level destinations; admin/authoring tools sit
   behind one clearly named area; visible practice modes drop from 7 to ≤ 4.
4. **Visual coherence.** Zero emoji used as UI icons; one typographic hierarchy; consistent card,
   button and empty-state patterns; the existing token trio (`#0c0f17` / `#121722` / `#20293a`) and
   indigo/emerald semantics preserved.
5. **Gates stay green.** `npm run lint` (tsc), `npm test` (incl. `modal-a11y`, `form-labeling`,
   `doc-freshness` X1–X3), `npm run build`.

## 1. Constraints (non-negotiable)

- `docs/SPEC.md` is authoritative for *behavior*; stack stays Vite + React 19 + Express +
  `node:sqlite` + `node:test`.
- No full mock exams; AI content stays `draft`; all UI text Spanish, code/identifiers English.
- Every form control keeps an accessible name; every overlay keeps the dialog a11y contract
  (`role="dialog"`, `aria-modal`, focus trap) — `tests/modal-a11y.test.ts` and
  `tests/form-labeling.test.ts` must pass.
- CTAs stay on indigo; emerald only for approval/status; no new colors.
- If remediation adds/removes test files or count claims, `tests/doc-freshness.test.ts` (X1–X3)
  forces README/ACCEPTANCE/guardian sync **in the same commit**.

## 2. Pre-audit reconnaissance — known findings (verified at `2881ea8`)

These are already confirmed in code; the audit's job is to complete the inventory and get approval
on the fixes, not to rediscover them.

### F1 — Phantom "0 preguntas" is a scoping bug, not stale data (user-reported)

The user believes the zero counts are stale data. They are not — they are computed from a
**topic-filtered** array while rendering **all** topics:

- `src/App.tsx:150` — `loadData()` passes `filterTopic = selectedTopicId` to
  `api.getItems({ topic_id })`, and `src/App.tsx:201-203` re-runs it on every topic change.
- `src/components/Dashboard.tsx:146` — `getTopicStats()` computes `total = tItems.length` from
  that filtered `items`, then `Dashboard.tsx:326` renders `{stats.total} preguntas` **for every
  topic card** → every non-selected topic shows `0 preguntas`.
- `Dashboard.tsx:254` — header `Total preguntas: {items.length}` shows the filtered subset, not
  the bank total (534 rows live).
- `src/components/ItemBank.tsx:192` — topic tab counts `{t.name} ({…length})` have the same defect.
- `src/components/ContentStudio.tsx:1058` — `Auditoría de Calidad del Banco Activo ({items.length})`
  likewise shows the subset.

*Fix direction (for approval):* fetch `items` unfiltered once (534 rows is trivial) and apply topic
scoping only where study logic needs it; audit every consumer of `items` first
(`handleStartSniper` scope, `ItemBank` filters, `Dashboard` stats) so scope semantics don't change.
Add a regression test over a pure count helper.

### F2 — Duplicated menus/options (user-reported)

| Action | Entry points found | Evidence |
|---|---|---|
| Topic scope `<select>` | **2 visible at once**: navbar zone 3 + StudySetup "Ámbito del test" (same state, so synced but duplicated) | `Navbar.tsx:317-330`, `StudySetup.tsx:118-130` |
| "Repasar fallos / Mis fallos" | **5**: navbar badge, dashboard header link, topic-card button, StudySetup button, ErrorRepairStudio itself | `Navbar.tsx:119`, `Dashboard.tsx:260,383`, `StudySetup.tsx:154` |
| Create topic | **12 call sites** of `onOpenCreateTopic` / `setIsCreateTopicModalOpen(true)` | grep count across `src/` |
| Top-level navigation | desktop nav (3) + "Más" drawer (3) + export entry + mobile bottom nav + mobile drawer = up to **5 rendered nav surfaces** | `Navbar.tsx:99-310, 432-500` |
| Start a session | **7 modes** on Estudiar (Empezar test, Repasar fallos, Simulacro, Mezclar temas, Test de nivel, Plazos, Duelo, Estudio guiado) + dashboard topic-card CTA | `StudySetup.tsx:103-265`, `Dashboard.tsx:373` |
| Help/methodology | `?` navbar button + `HelpShortcutsModal` + `OnboardingModal` + methodology copy in modals | `Navbar.tsx:359`, `HelpShortcutsModal.tsx` |

### F3 — Dead / vestigial UI code

- `CalibrationAnalytics` imported in `src/App.tsx:8` but **never rendered** anywhere.
- `ActiveTab` includes `'help'` (`Navbar.tsx:33`) that is never set — help is a modal, not a tab.
- `export` lives both as a tab id and as a standalone navbar button (`Navbar.tsx:275`).

### F4 — AI-slop signals

- **21 emoji occurrences** in UI strings (`📦 ⚡ ⚖️ 💡 ⚠️ 🎯 …`), mostly `ContentStudio.tsx`
  (`1563-1569`) and `AiChatbot.tsx` (`366`) — emoji standing in for iconography/copy tone.
- Component surface is large and uneven: `ActivityRunner` 3 420 lines, `ContentStudio` 1 994,
  `AiChatbot` 1 157, `JevLabModal` 903 — density and visual patterns drift between them.
- 9 files render `role="dialog"` overlays; patterns must be audited for consistency.

### F5 — Carry-over polish items from the 2026-10-31 audit (still open)

- A6: spinner-only loading state (skeleton instead).
- A7: `focus-visible` ring exists only under high-contrast mode — default ring needed.
- B1: analytics `optionLengthBias` threshold (1.6×) ≠ bank gate F3 (1.25×) — pick one.

## 3. Audit procedure (the work to run)

**Output artifact:** `docs/UX-AUDIT-2026-11.md` — findings + prioritized backlog (P0/P1/P2),
each finding with file:line evidence, screenshot reference and proposed fix. Nothing else changes
during the audit.

### Pass A — Screen inventory & duplication matrix
Walk every tab (`dashboard`, `runner`, `errors`, `content`, `items`, `chat`, `export`) plus every
modal on `http://localhost:3000`, desktop + narrow viewport. For each screen record: rendered
controls, which are reachable elsewhere, and which are dead. Extend the F2 table to *every*
duplicated control. Rule of thumb: **if two controls do the same thing, one stays and the other
becomes a contextual link or is deleted.**

### Pass B — Number-truth audit
Enumerate **every count rendered** (grep `{…length}`, `{stats.…}`, `{dueStats.…}`, `({N})`
patterns across `src/components/`). For each: source array → is it filtered? → correct under topic
scope? Expected classes: F1 (topic-filtered), legitimate scoped counts (must be labelled as such),
and genuinely empty states (must use the empty-state pattern, not a bare `0`). Output: a table in
the audit doc; F1 items become P0.

### Pass C — Visual / "no AI slop" pass
Checklist per screen: emoji-as-icon (F4), typographic hierarchy (one display/serif + one mono for
numerals, already established — enforce it), spacing rhythm, card/border consistency, empty states,
loading states (A6), focus rings (A7), copy tone (Spanish, no hype, no emoji), icon set = lucide
only. Benchmark language: *Brilliant / Duolingo / Coursera* — calm, structured, typographically
confident; explicitly not "AI-generated dashboard".

### Pass D — Flow walk-throughs
Three real journeys, logged step-by-step: **first run** (onboarding → first test), **daily study**
(open → Estudiar → Empezar test → review), **error repair** (fallos → reparar). Each journey scored
on: clicks to core action, decisions required, moments of "what is this number?".

## 4. Remediation backlog (proposed — for approval after the audit doc lands)

**P0 — Truth & breakage**
1. Fix F1 phantom zeros (unfiltered fetch + scoped derivation + regression test).
2. Remove dead code F3 (unused import, `'help'` tab member, redundant export entry).

**P1 — "Less stuff" (each needs a decision, see §5)**
3. Consolidate navigation: 3 primary (Temario / Estudiar / Mis fallos) + **one** "Herramientas"
   area holding Contenidos, Preguntas, Consultor, Export, JevLab. Single nav implementation for
   desktop + mobile (mobile keeps its bottom bar but renders from the same source).
4. Single topic-scope control (recommend: keep the StudySetup one, drop the navbar select — the
   navbar keeps a passive scope *label* instead).
5. Single "Repasar fallos" primary entry (recommend: navbar badge + ErrorRepairStudio; the other
   three become contextual links or are removed).
6. Session modes: 1 default CTA + ≤ 3 visible (recommend Simulacro, Test de nivel, rest behind
   "Más formas de practicar", already half-built at `StudySetup.tsx:279`).
7. Group create-topic to one entry per context (dashboard header **or** empty state, not both).

**P2 — Look & feel**
8. Remove all 21 emoji from UI strings; lucide icons or plain text.
9. Empty-state + loading-skeleton patterns (fixes A6 + phantom-zero presentation).
10. Default `focus-visible` ring (A7); align option-length thresholds (B1).
11. Consistency sweep of the 9 dialog components (title/close/focus/spacing contract).

**Batching:** P0 → P1 → P2, one commit series per batch, each independently verifiable
(lint + test + build + manual smoke), so review stays easy and the parallel agent's content work
is never blocked for long.

## 5. Decision points (need user approval before P1 implementation)

- **D1 — Navbar topic selector:** remove (recommended) or keep and remove the StudySetup one?
- **D2 — Practice modes:** cap visible modes at 1+3 (recommended) or 1+2?
- **D3 — Consultor (AI chatbot):** move into "Herramientas" (recommended) or hide entirely when
  no API key is configured?
- **D4 — ContentStudio / JevLab / Export:** all three into "Herramientas" (recommended), or split
  authoring tools (admin) from export (user) into two areas?
- **D5 — Audit doc location:** `docs/UX-AUDIT-2026-11.md` (recommended, next to
  `docs/AUDIT-UX-LEARNING.md`).

## 6. Verification plan (per batch)

1. `npm run lint` → 0 errors.
2. `npm test` → all green; if test files/count claims changed, sync README / ACCEPTANCE criterion
   22 / AGENTS / guardian **in the same commit** (enforced by `tests/doc-freshness.test.ts`).
3. `npm run build` → OK (known `import.meta` esbuild warning only).
4. Manual smoke on `:3000`: the three §3 Pass-D journeys + confirm every count matches
   `curl /api/items` totals (534 rows / per-topic counts verified live during reconnaissance).
5. a11y spot-check: keyboard path + `role="dialog"` contract on any touched overlay.

## 7. Out of scope

- Any change to scoring, scheduling, item formats or seed content (content pipeline is untouched).
- New features, restyles of ActivityRunner's runner logic, dark/light theme toggle.
- Framework or dependency changes; E2E/Playwright introduction.
