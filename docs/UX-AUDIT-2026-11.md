# OposiLab UI/UX Audit — Findings (Pass A–D) — 2026-11-11

> Evidence base: source @ `d17c64c` + live server `:3000` (`GET /api/items` = **534** rows).
> Companion: `docs/plans/2026-11-10-ui-ux-audit-plan.md` (method + decisions).
> Predecessor: `docs/AUDIT-UX-LEARNING.md` (2026-10-31) — **its Top-10 and A1–A7/B1 are all
> closed in current code** (verified below); this audit supersedes it for UI/UX matters.

## 0. Approved decisions (user, 2026-11-11)

| # | Decision |
|---|---|
| D1 | Remove the navbar topic-scope `<select>`; keep the single scope control in StudySetup (navbar shows a passive scope label instead). |
| D2 | Practice modes capped at **1 default CTA + ≤ 3 visible**; the rest behind "Más formas de practicar". |
| D3 | **Consultor (AI chatbot) moves into "Herramientas"** — no longer a top-level destination. |
| D4 | Tools split **admin vs user**: user-facing (Export) separate from authoring/admin (Contenidos, Preguntas, Consultor, JevLab). |
| D5 | This audit lives at `docs/UX-AUDIT-2026-11.md`. |

## 1. Prior-audit status (2026-10-31) — all closed

| ID | Was | Status now (evidence) |
|---|---|---|
| A1 | native `alert()` | ✅ replaced by in-app toast (`App.tsx:641`) |
| A2 | silent empty-runner fallback | ✅ `handleStartSniper` toasts and aborts on 0 selected (`App.tsx:303-308`); same guard for plazos/duel (`App.tsx:339`, `:366`) |
| A3 | baremo editable after session end | ✅ `baremoLocked` → read-only pill (`ActivityRunner.tsx:1665-1674`) |
| A4 | fixed 45 s pacing | ✅ `pacingSecondsForItem()` per `item_type` (`ActivityRunner.tsx:136-137`) |
| A5 | generative cover invisible | ✅ explained in StudySetup explainer (`StudySetup.tsx:134-141`) |
| A6 | spinner-only loading | ✅ layout-matched skeleton with `aria-busy` (`App.tsx:382-403`) |
| A7 | no default focus ring | ✅ default `:focus-visible` outline (`index.css:58-61`) |
| B1 | 1.6× vs 1.25× length threshold | ✅ analytics now uses `meanOther * 1.25` (`analytics.ts:505`), matching gate F3 |

Dialog contract is solid across the board: **all 9** `role="dialog"` components have
`aria-labelledby`, `useFocusTrap`, and Escape handled centrally (`src/utils/useFocusTrap.ts:36`).

## 2. Pass A — duplication matrix (confirmed)

| Duplicated control | Count | Evidence |
|---|---|---|
| Topic scope `<select>` | **2 rendered simultaneously** on the Estudiar tab, both bound to `selectedTopicId` | `Navbar.tsx:317-330` (desktop header Zone 3) + `StudySetup.tsx:118-130` ("Ámbito del test") |
| "Mis fallos / Repasar fallos" entrances | **6** (5 entrances + destination) | `Navbar.tsx:119,214` (tab+badge), `Dashboard.tsx:260` (header), `Dashboard.tsx:383` (topic card), `AnalyticsStrip.tsx:66-70` ("Reparar"), `StudySetup.tsx:154` → `ErrorRepairStudio.tsx:162` |
| Create-topic entrances | 12 call sites → **3 visible at once** on Temario | `Navbar.tsx:339` (＋ button), `Dashboard.tsx:291` (header link), `Dashboard.tsx:405` (empty-state card) |
| Nav surfaces | desktop primary nav (3) + "Más" drawer (3 + Export + JevLab) + mobile bottom bar + mobile drawer + JevLab listed **twice** in Navbar | `Navbar.tsx:99-310`, `:432-500`, JevLab at `:290` (desktop) and `:504` (mobile) |
| Practice modes | default visible **1+2** (Empezar test, Repasar fallos, Simulacro); expanded **1+7** (＋ Mezclar temas, Test de nivel, Plazos, Duelo, Estudio guiado) | `StudySetup.tsx:103,154,174,189-270` |
| Session start from Temario | topic-card "Empezar" duplicates the Estudiar CTA | `Dashboard.tsx:373` |

**Verdict:** the Estudiar screen shows the same scope selector twice, the same "fallos" goal has
five front doors, and create-topic has three. This is the "menus/options duplicated" the user felt.

## 3. Pass B — number truth ("0 preguntas")

### F1 (root cause, P0): topic-filtered `items` rendered as global counts

`loadData()` re-fetches **filtered** data whenever the scope changes, but several screens render
those numbers as if they were global:

1. `App.tsx:150` — `filterTopic = selectedTopicId !== 'all' ? … : undefined`
2. `App.tsx:167` — `api.getItems(filterTopic ? { topic_id: filterTopic } : undefined)`
3. `App.tsx:201-203` — `useEffect(() => loadData(selectedTopicId), [selectedTopicId])`
4. `Dashboard.tsx:146` — `getTopicStats()` computes `total` from that filtered array, then
   `Dashboard.tsx:326` renders `{stats.total} preguntas` **for every topic card** → any topic
   other than the selected one shows **0 preguntas** (its items were never fetched).
5. `Dashboard.tsx:254` — header "Total preguntas: {items.length}" shows the scoped subset, not 534.
6. `ItemBank.tsx:192` — per-topic tab counts `{t.name} ({…filter…})` → 0 for unscoped topics.
7. `ContentStudio.tsx:1058` — "Auditoría de Calidad del Banco Activo ({items.length} Ítems)".

**Mixed scoping makes it worse:** `errors`, `attempts`, `warnings` are fetched **unfiltered**
(`App.tsx:168-170`) while `items` is filtered — so the same screen mixes global and scoped
numbers with no label. And `dueStats` is scope-filtered (`App.tsx:171` → `scheduler.ts:116`), so
the navbar "Estudiar (N)" badge silently changes with scope too.

**Live ground truth** (`GET /api/topics` × `GET /api/items`, 534 total):
`tema7 106 · t15 76 · t8 70 · t16 69 · t3 61 · t9 61 · t8ip 52 · CE-t3 24 · CE-t1 13` — no topic
has 0 items. The zeros are purely client-side filtering.

**Fix (P0):** fetch `items` unfiltered (534 rows is trivial); keep scoping only where the user
explicitly chose a scope (StudySetup text, drill selection). Navbar badge → global.
Regression test: pure count helper asserted against unfiltered data.

### Pass B summary of remaining counts

| Screen | Count | Source | Verdict |
|---|---|---|---|
| Dashboard topic cards | `{stats.total}` | filtered `items` | ❌ F1 |
| Dashboard header | `{items.length}` | filtered `items` | ❌ F1 |
| ItemBank topic tabs | `{…length}` | filtered `items` | ❌ F1 |
| ContentStudio audit header | `{items.length}` | filtered `items` | ❌ F1 |
| Navbar badges | `dueStats` | scope-filtered | ⚠️ unlabelled scope (fix with F1) |
| ErrorRepairStudio tabs | `errors.*` | global | ✅ but scope differs from Dashboard topic-card error counts (unlabelled) |
| StudySetup "N pendientes" | `dueCount` | scoped, labelled "en {scopeName}" | ✅ |
| ActivityRunner / MicroLesson | session-local | n/a | ✅ |
| Empty states | only ~6 exist app-wide | — | ⚠️ phantom zeros render as bare "0" instead of an empty state |

## 4. Pass C — visual / "no AI slop"

- **Emoji as icons: 26 occurrences** across UI strings — `ContentStudio.tsx` (12: 🎯🧠⚠️✅📦⚡⚖️💡),
  `ActivityRunner.tsx` (7: 🎯⚠️🔥💡), `AiChatbot.tsx` (3: ⚠️💡), `JevLabModal.tsx` (1: 💡),
  `MicroLessonRunner.tsx` (1: ⚠️), `ErrorRepairStudio.tsx` (1, inside exported markdown — OK to keep),
  `OnboardingModal`/`PretestDiagnosticMap` (1 each). → replace with lucide icons or plain text.
- **Typography is already coherent**: `font-legal-serif` display + `font-mono` numerals +
  uppercase mono section labels — keep as the backbone.
- **Empty states sparse**: ~6 app-wide; most zero conditions render a bare number (see F1).
- **Dialogs**: ✅ contract consistent (see §1).
- **Naming**: `ExportSettingsMethodModal` is a *page* rendered in the `export` tab
  (`App.tsx:602-603`), not a modal — rename to `…Page`/`…Panel` to stop confusing contributors.

## 5. Pass D — journey walk-throughs (code-traced)

1. **First run:** loads → skeleton → Temario. Onboarding only fires when StudySetup mounts
   (`StudySetup.tsx:60-66`), i.e. **one click late** — the welcome appears after "Estudiar", not
   at first sight. *Fix:* trigger on app start (P2).
2. **Daily study:** Temario → Estudiar (or Alt+2) → "Empezar test" — clean, 1 decision. But the
   Estudiar screen presents **two identical scope selects** (D1) and, once a scope is chosen, the
   Temario cards behind it start showing 0 preguntas (F1).
3. **Error repair:** five entrances to the same screen (Pass A), with counts that are global on
   the destination but topic-scoped on the Temario cards that link to it — same-looking numbers,
   two different scopes, no labels.

## 6. Remediation backlog (decisions applied)

**P0 — truth & dead code**
1. F1: unfiltered `items` fetch + scoped derivation only where labelled; navbar badge global;
   regression test. (`App.tsx`, `Dashboard.tsx`, `ItemBank.tsx`, `ContentStudio.tsx`)
2. Remove dead code: unused `CalibrationAnalytics` import (`App.tsx:8`), `'help'` `ActiveTab`
   member (`Navbar.tsx:33`), duplicate JevLab opener (`Navbar.tsx:504` keeps mobile; `:290` keeps
   desktop — keep both only if they render in mutually exclusive breakpoints, else dedupe).

**P1 — "less stuff" (D1–D4)**
3. D1: drop navbar Zone-3 select → passive scope label; StudySetup keeps the only select.
4. D2: keep default 1+2 and cap the expanded list at 1+3 visible total (currently 1+7 →
   promote at most 1 more, rest stay behind "Más"); demote "Repasar fallos" out of the mode grid
   (it is navigation, not a mode → covered by #5).
5. Consolidate "Mis fallos": keep navbar tab+badge as primary; Temario header link stays as the
   contextual one; remove the topic-card button, AnalyticsStrip "Reparar" becomes a link to the
   same destination, StudySetup card removed (D2 cap absorbs it).
6. Consolidate create-topic: navbar ＋ removed (D1 area already thins the header); Temario header
   link + empty state remain (empty state only when list is empty → never two at once).
7. D3+D4: new structure — primary nav: **Temario · Estudiar · Mis fallos**; one **"Herramientas"**
   drawer split into two labelled groups: *Usuario* (Export, Consultor) and *Gestión de contenido*
   (Contenidos, Preguntas, JevLab). Tab ids unchanged so study logic is untouched.

**P2 — look & feel**
8. Replace the 26 emoji (except inside exported markdown) with lucide icons/plain text.
9. Empty-state pattern for zero conditions (topic card with no items → "Sin preguntas aún ·
   Añadir" instead of `0 preguntas`).
10. Move onboarding trigger to app start.
11. Rename `ExportSettingsMethodModal` → `SettingsPage` (or similar) — no behavior change.
12. Label every scoped count ("en este tema") once F1 lands, so scope is never implicit.

## 7. Verification (per batch, per plan §6)

`npm run lint` → `npm test` (incl. `doc-freshness` X1–X3; sync README/ACCEPTANCE/guardian counts
in the same commit if test files change) → `npm run build` → manual smoke on `:3000` walking the
three journeys above → a11y spot-check on any touched overlay.
