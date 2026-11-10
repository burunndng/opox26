# Design: opencode handoff briefing + doc-count freshness guard

**Date:** 2026-11-10
**Status:** approved by user (mechanism + owner + scope confirmed in session; "Approve, write design doc")
**Context:** The fresh session diary + coverage tracker + surgical-repair system
(`docs/design/2026-11-10-doc-system-design.md`, built same day) fixed the drift *instances* seen
this morning. This design makes the *classes* of problem mechanical instead of remembered:
cold-start amnesia, foreign-tree-WIP surprises, numeric drift across docs, session-end amnesia.

---

## 1. Why now (evidence from today's session)

| Failure mode, observed live | Evidence |
|---|---|
| Design bundle A+B approved: session-start briefing + handoff command + count-freshness test | user decision, this session |
| Next-step lived only in conversation | 2026-11-10 I arrived with a "next move" that existed in no committed doc until the diary was written |
| Foreign WIP red lint/test mid-session | `server/seedData.ts` + `server/seedDataTema15Extra.ts` (parallel Tema 15 batch): lint TS2741, R1 `actual 532 expected 481` |
| Count drift in committed artifacts | guardian agent "210/40" stale vs 318/43; R1 assertion message (seed-reconcile:71) sums to 493 ≠ 481 (double-counts +12) |
| Dangling cross-references | missing `### 1.9` heading; duplicate `## 2.`; 2 phantom plan files |
| (Bonus, found while grounding the numbers) | CONTENT-COVERAGE matrix cell for Tema 1 CE was unverifiable-as-written ("—"); actual = **13** items (stem count; total 475 closes) — fixed in a companion micro-commit |

The common thread: **every failure happened at a lifecycle boundary** (session start / verification boundary
/ session end / commit). Conventions (`AGENTS.md` bullets) failed precisely because nobody's *task* matches
"open a session" or "close a session" — skills load on task-match, so they don't fire at boundaries either.
Hooks do.

---

## 2. Verified mechanism (OpenCode V2 docs, fetched this session)

From `https://opencode.ai/v2/docs/build/plugins/server`:

- Plugins auto-load from `.opencode/plugins/` (local directory, no `opencode.json` edit; `$schema` stays as-is).
- `ctx.session.hook("prompt", (event) => { event.prompt.files?.push({ uri }) ... })` — runs per user prompt,
  can attach files into the session context.
- `ctx.session.instructions.entry.put({ sessionID, key, value })` — keyed persistent briefing,
  announced at the next step boundary without queuing a message turn.
- `ctx.vcs.status()` / `ctx.vcs.branch.list()` — working-copy dirtiness (foreign-WIP detection for free).
- `ctx.command.transform` — registers a slash command (the `/handoff` exporter).
- `ctx.storage` (prefix-scanned durable JSON) — per-session flags / hash dedup state.
- `ctx.worktree.create({ projectID, name })` — worktree creation exists programmatically (see §7, rejected for now).
- **No session-end/idle hook exists** (confirmed: prompt, model-request, permissions, shell, tools only).
  => A hook cannot reliably write/close a session. Auto-drafting the diary entry would be fake machinery;
  the close-out stays an agent action, named by `/handoff`.

## 3. Design (approved bundle A+B)

### 3.1 The plugin — `.opencode/plugins/oposilab-handoff/index.ts`

One file, id `oposilab-handoff`, no options (no `opencode.json` change). Three capabilities + a safe-degradation rule.

**a) Session-start briefing (prompt hook, first prompt per sessionID).**
On the first `session.hook("prompt")` for a session (flag in `ctx.storage` under `briefed:<sessionID>`):
1. `ctx.vcs.status()` → list dirty files; if any, prefix with `⚠️ foreign/changed tree:` (names only, capped).
2. Compute a compact briefing: repo HEAD one-liner (`git log -1`), latest diary entry path +
   its `Siguiente paso` line, one-line pointer to `docs/CONTENT-COVERAGE.md`, and the count triple
   (`README` claims vs R1 source vs guardian claim) — all read via `fs` on the project dir.
3. `instructions.entry.put(key="oposilab-briefing")` with that text (short, deduped).
4. Attach the latest diary entry file via `event.prompt.files.push({ uri })` (verbatim, first prompt only).

On later prompts: recompute a cheap hash (vcs status + HEAD + diary filename); re-put the entry ONLY if
changed. No per-prompt file attachment (avoid per-prompt token bleed).

**b) `/handoff` command (close-out, named).**
Registered via `ctx.command.transform`; executes a `session.prompt` directing the agent to, IN ORDER:
diary entry → matrix/tracker refresh → "Próximos pasos" pointer → verify counts from `HEAD` → docs-only
conventional commit (`git status`/`git log` re-checked, explicit path staging) → push. This is the same
checklist this session executed by hand, made invokable by command (and by habit).

**c) Safe-degradation.**
If `@opencode/plugin` can't resolve, or briefing computation throws, the plugin disables itself (logs one
line, returns early downstream) — sessions never block on the plugin. This is verified at build time against
the installed opencode version (log smoke test), not assumed.

### 3.2 The count-freshness test — `tests/doc-freshness.test.ts` (suites X1–X3)

A pure `fs` text test (no `server/db.ts` import → `isolateDataDir()` not required; reads committed-repo text
through `node:fs`, mirroring the Task-1 counting logic in TypeScript per topic-file prefixes):

- **X1 — seeded/eligible consistency:** `README.md`'s "N ítems sembrados y M ítems elegibles" ==
  `docs/ACCEPTANCE.md`'s "N sembrados / M elegibles" == R1 source values parsed from
  `tests/seed-reconcile.test.ts` (the `assert.equal(state.seedCount, N)` / `eligibleCount, M` literals).
- **X2 — test-count consistency:** `README` ("N pruebas / M suites"), `ACCEPTANCE` ("N/N en M suites"),
  guardian (line 17 `**N tests / M suites**`) + the physical count of `tests/*.test.ts`.
- **X3 — matrix consistency:** each `docs/CONTENT-COVERAGE.md` item count == re-derived counts from the
  per-topic seed files at the working tree (literal-full-ID regex for T3/T15, `stem: '` count for
  questionBank banks T8/T8IP/T9/T3G/T1 — the exact methods proven this session).

**Rollout constraint (must land in one commit):** adding the test *raises* the count (43 → 44 suites;
318+N tests where N = number of tests in the new file — with X1–X3, N = 3, so 321/44). The same commit must sync all live count claims:
`README.md` (2 spots), `docs/ACCEPTANCE.md` (criterion 22 file list + count mentions), guardian (line 17
+ "28 test files" → 29). `implementation_plan.md` §1.13 stays a dated evidence record and is NOT updated
(mirrors how the rev-4 "210/210" note was left historical).

**Drive-by (test narrative only):** rewrite the R1 assertion message at `tests/seed-reconcile.test.ts:71`
whose breakdown sums to 493 ≠ 481 (double-counts the +12 T3 parte-2 item; the "61" already includes it).
Replacement message points at `docs/CONTENT-COVERAGE.md` instead of a hand-rolled breakdown (numbers live in
one place). Behavior-identical (message string only).

## 4. Rejected alternatives (with reasons)

- **New skill (session protocol / doc-freshness):** skills load on task-match; there is no user task
  "start a session" to match. Boundaries are hook territory, not skill territory.
- **Auto-writing the diary entry from a hook:** no session-end event exists (§2); a generated "draft"
  injected mid-session would be stale and untrusted. `/handoff` + diary template is the honest form.
- **Shell-hook interception of `git commit`:** modifying shell commands is powerful but brittle (argv
  parsing, non-git flows), and git already has a native boundary for this. A test guard at `npm test`
  covers the same edge with the repo's existing gate.
- **Git `.githooks/pre-commit`:** overlaps the test guard's edge but needs `core.hooksPath` setup per clone;
  the test guard needs nothing and runs in the mandatory loop. Chosen instead.
- **Tool hooks (per-tool-call noise):** every tool call is the wrong granularity for boundary problems.
- **Worktree-discipline skill:** real future value (unused `tools.opencode.worktree_*`), but the unit
  problem is shared-tree hygiene, not docs; deferred until a second live collision demonstrates it.

## 5. Success criteria

1. A new opencode session in this repo sees the `<context key="oposilab-briefing">` entry (first prompt)
   including a correct foreign-WIP line when applicable.
2. `/handoff` exists and drives a complete close-out (diary → tracker → pointer → verify → commit+push).
3. Count drift fails `npm test` in the new X1–X3 tests (README/ACCEPTANCE/guardian/R1/matrix mutually agree).
4. The R1 assertion message no longer sums incorrectly.
5. Plugin inert outside this repo (repo-local `.opencode/plugins/`), inert on failure, zero edits to
   `opencode.json` (besides the prior agent registrations), `npm run lint` + `npm test` green accounting for
   suite +1.

## 6. Risks and mitigations

- **Per-prompt cost/annoyance** — briefing hash-deduped; full diary attached once per session only.
- **Loader/SDK resolution differences** across opencode versions — build-time smoke test; plugin noops with
  a log line if it can't load, never blocks sessions.
- **Briefing counts at first prompt vs mid-session content commits** — re-put on vcs/HEAD hash change
  re-derives the counts; entries are ≤15 lines by template.
- **Counts in test exceeding "suite owns them" growth** — X2/X3 tolerate by matching cross-pair equality,
  not pinning absolute values (only the R1 source is authoritative; test parses it so a parallel batch's
  R1 bump flows automatically).

## 7. Files touched (build scope, for the later plan)

| Action | Path |
|---|---|
| Create | `.opencode/plugins/oposilab-handoff/index.ts` |
| Create | `tests/doc-freshness.test.ts` |
| Modify | `tests/seed-reconcile.test.ts` (message only) |
| Modify | `README.md`, `docs/ACCEPTANCE.md` (criterion 22 + counts), `.opencode/agent/oposilab-guardian.md` (counts) |
| Modify | `AGENTS.md` (one "Key documents" bullet: the plugin + `/handoff`) |

Out of scope: `opencode.json`, git hooks, tools/shell hooks, auto-writing, worktree skill.
