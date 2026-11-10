# Handoff-Briefing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. NOTE (adaptation): those named superpowers skills are not in this environment's toolset. If Subagent-Driven is chosen, dispatch the `general` subagent per task (or `oposilab-editor` for the file-writing parts) with the task text verbatim. If Inline Execution is chosen, run the tasks in this session with review checkpoints between tasks. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved handoff-briefing bundle per `docs/design/2026-11-10-handoff-briefing-design.md`: a repo-local opencode plugin (session-start briefing + `/handoff` command) and a `doc-freshness` test (X1–X3 count/matrix consistency), so the doc system cannot rot silently again.

**Architecture:** Two surfaces — (1) `.opencode/plugins/oposilab-handoff/index.js`, loaded automatically by opencode (source is **plain JS**: the repo's tsconfig has no include/exclude, so a `.ts` plugin importing `@opencode/plugin` would fail `npm run lint` since that SDK is not installed; JS sidesteps this with `allowJs` + no `checkJs`); (2) `tests/doc-freshness.test.ts`, a pure-`fs` test (no `server/db.ts` import, so no `isolateDataDir()` needed) that derives counts from the working tree and fails on cross-doc drift. Close-out happens via the plugin's `/handoff` command ( there is no session-end event in OpenCode V2 to automate it).

**Tech Stack:** OpenCode V2 plugin API (`Plugin.define`, `ctx.session.hook("prompt")`, `ctx.session.instructions.entry`, `ctx.command.transform`, `ctx.storage`) — verified against https://opencode.ai/v2/docs/build/plugins/server (this session); Node built-ins only (`node:fs`, `node:path`, `node:url`, `node:child_process`, `node:crypto`); `node:test` via `tsx`.

## Global Constraints

- The plugin lives repo-local only (single-session opencode runs `v2.2.5`): no global install; no `opencode.json` edit (`$schema` untouched); if the plugin fails to load, sessions must still start (try/catch → no-op + one log line, never throw).
- Per-prompt discipline: the diary file is attached on the FIRST prompt per `sessionID` only; the briefing entry re-puts only when its content hash changes (dirty tree / HEAD / diary / count claims). Never attach per prompt.
- Counts: the test compares cross-doc equality (README ↔ ACCEPTANCE ↔ guardian ↔ R1 source), not absolute pins — except R1's values, which the test reads from its own test-file source. After adding the suite, the build re-syncs all live count claims in the same commit (self-fulfilling TDD loop: write test → it fails on stale claims → update claims to measured totals → green).
- The count-sync commit also resolves the R1 message drive-by (493 ≠ 481 narrative) **by editing the message, never the asserted values** (values may move with the parallel agent's Tema 15 batch — always re-snapshot `tests/seed-reconcile.test.ts` line ~71 at build time; mirror their current numbers).
- Commit = docs + test + plugin only; NEVER stage the parallel agent's `server/seedData*` / `tests/seed-reconcile.test.ts` value changes (only the message string). Pre-flight `git status`/`git log` first; if that file was edited by the parallel batch, update the plan's old/new strings to their current text (same intent).
- The plugin must be plain `.js` (see Architecture) — if the live opencode load smoke (Task 3, manual) shows the SDK unresolvable, STOP rather than inventing import shapes; report and decide with the user.
- Everything lands in ONE `docs(structure): ...` commit + push; green lint/test required except the documented parallel-WIP branch (record the reason, never relax silently).

---

## File Structure

| Action | Path | Responsible for |
|---|---|---|
| Create | `.opencode/plugins/oposilab-handoff/index.js` | Briefing hook + `/handoff` (plain JS; no deps) — Task 1 |
| Modify | `AGENTS.md` | Pointer bullet (plugin + `/handoff` discoverable) — Task 1 |
| Create | `tests/doc-freshness.test.ts` | X1–X3 consistency tests (fs-only) — Task 2 |
| Modify | `tests/seed-reconcile.test.ts` | R1 assertion message (string only, drive-by) — Task 2 |
| Modify | `README.md`, `docs/ACCEPTANCE.md`, `.opencode/agent/oposilab-guardian.md`, `AGENTS.md` | Live count sync (measured totals) — Task 2 |

---

### Task 1: The `.opencode/plugins/oposilab-handoff/index.js` plugin

**Files:**
- Create: `.opencode/plugins/oposilab-handoff/index.js`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: opencode V2 SDK shapes verified at plan time (`Plugin.define` default export; `ctx.session.hook("prompt")`; `ctx.session.instructions.entry.put({sessionID,key,value})`; `ctx.command.transform`; `ctx.storage.get/set`; `ctx.location.directory`). No external data beyond the repo working tree.
- Produces: repo-local plugin auto-loaded by opencode in this project; briefing key `oposilab-briefing`; command name `handoff`. Task 3 smoke-tests it live.

- [ ] **Step 1: Write the plugin file**

Create `.opencode/plugins/oposilab-handoff/index.js` with exactly this content:

```js
// Session-start briefing + /handoff for the oposilab-mcq-trainer repo.
// Design: docs/design/2026-11-10-handoff-briefing-design.md (A+B bundle, approved 2026-11-10).
// Plain JS on purpose: the repo tsconfig includes every **/*.ts, and @opencode/plugin is
// not installed; a .js plugin stays lint-inert (allowJs, checkJs off) with no new deps.
// Never throws: any failure logs one line and disables the briefing for that prompt.
import { Plugin } from "@opencode/plugin";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ENTRY_KEY = "oposilab-briefing";

function sha1(s) {
  return createHash("sha1").update(s).digest("hex").slice(0, 8);
}

function readText(dir, rel) {
  try {
    const p = join(dir, rel);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  } catch {
    return null;
  }
}

function num(re, text) {
  const m = re.exec(text || "");
  return m ? Number(m[1]) : null;
}

function headLine(dir) {
  try {
    const sha = execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    const subject = execFileSync("git", ["log", "-1", "--format=%s"], {
      cwd: dir,
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    return `${sha} ${subject}`.slice(0, 80);
  } catch {
    return "(git unavailable)";
  }
}

function dirtyTree(dir) {
  try {
    const out = execFileSync("git", ["status", "--porcelain"], {
      cwd: dir,
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    if (!out) return null;
    const lines = out.split("\n").map((l) => l.slice(3));
    const shown = lines.slice(0, 3).join(", ");
    return `${lines.length} changed (${shown}${lines.length > 3 ? ", …" : ""})`;
  } catch {
    return null;
  }
}

function latestDiary(dir) {
  const d = join(dir, "docs", "sessions");
  if (!existsSync(d)) return null;
  const files = readdirSync(d).filter((f) => f.endsWith(".md")).sort();
  return files.length ? files[files.length - 1] : null;
}

function nextStepLine(dir, file) {
  const text = readText(dir, join("docs", "sessions", file));
  if (!text) return "(no Siguiente paso line)";
  const line = text.split("\n").find((l) => l.includes("Siguiente paso:"));
  if (!line) return "(no Siguiente paso line)";
  return line.replace(/^\s*-\s*\*\*(Siguiente paso)\*\*:\s*/, "").trim().slice(0, 110);
}

// The four numbers the whole repo used to drift on: docs (README/ACCEPTANCE/guardian)
// vs truth (R1 source at this working tree).
function counts(dir) {
  const readme = readText(dir, "README.md") || "";
  const acceptance = readText(dir, "docs/ACCEPTANCE.md") || "";
  const guardian = readText(dir, ".opencode/agent/oposilab-guardian.md") || "";
  const r1src = readText(dir, "tests/seed-reconcile.test.ts") || "";
  return {
    readme: [
      num(/(\d+) ítems sembrados/, readme),
      num(/(\d+) ítems elegibles/, readme),
      num(/(\d+) pruebas \/ (\d+) suites/, readme),
      num(/\d+ pruebas \/ (\d+) suites/, readme),
    ],
    acceptance: [
      num(/(\d+) ítems sembrados/, acceptance),
      num(/(\d+) ítems elegibles/, acceptance),
      num(/(\d+)\/\d+ en (\d+) suites/, acceptance),
      num(/\d+\/\d+ en (\d+) suites/, acceptance),
    ],
    guardian: [
      num(/\*\*(\d+) tests \/ (\d+) suites\*\*/, guardian),
      num(/\*\*(\d+) tests \/ \d+ suites\*\*/, guardian),
      num(/\*\*(\d+) tests \/ (\d+) suites\*\*/, guardian),
      num(/\*\*(\d+) test files?\*\*/, guardian),
    ],
    r1: [
      num(/assert\.equal\(state\.seedCount, (\d+)/, r1src),
      num(/assert\.equal\(state\.eligibleCount, (\d+)/, r1src),
    ],
  };
}

function countLine(c) {
  const ok =
    c.readme[0] != null &&
    c.acceptance[0] === c.readme[0] &&
    c.acceptance[1] === c.readme[1] &&
    c.r1[1] === c.readme[1] &&
    c.guardian[0] != null &&
    Number(c.readme[2]) === Number(c.guardian[0]);
  return ok
    ? "counts agree"
    : `⚠️ count mismatch README=${c.readme.join("/")} ACC=${c.acceptance.join("/")} GUARD=${c.guardian.join("/")} R1=${c.r1.join("/")}`;
}

function briefing(dir) {
  const head = headLine(dir);
  const dirty = dirtyTree(dir);
  const diary = latestDiary(dir);
  const nxt = diary ? nextStepLine(dir, diary) : "(none yet — /handoff will create one)";
  const c = counts(dir);
  const lines = [
    `Repo: oposilab-mcq-trainer @ ${head}`,
    dirty ? `⚠️ dirty tree: ${dirty} — treat other agents' WIP as foreign` : "Tree: clean",
    `Latest diary: docs/sessions/${diary || "—"} (Siguiente paso: ${nxt})`,
    "Coverage: docs/CONTENT-COVERAGE.md (Tier B headliner: afiliación indebida + devolución de cuotas)",
    `Counts: ${countLine(c)}`,
    "Close-out when done: /handoff",
  ];
  return lines.join("\n");
}

const CLOSE_OUT = `Close out this session per the oposilab diary convention, IN ORDER:
1. Append docs/sessions/<today>-<slug>.md (template: Objetivo / Hecho / Verificado / Siguiente paso / Notas, max ~15 lines, commit hashes required).
2. Refresh docs/CONTENT-COVERAGE.md (matrix row + Tier B) if content changed; verify per-topic counts from git show HEAD:<file> (never from the dirty tree).
3. Update the "Próximos pasos" pointer in implementation_plan.md §1 (same commit as the diary entry).
4. Verify counts from HEAD (npm run lint + npm test; docs-copy total in all live claims if they moved).
5. Stage docs-only paths explicitly (never -A/-a; foreign WIP must remain uncommitted), commit with a conventional message, push.`;

export default Plugin.define({
  id: "oposilab-handoff",
  async setup(ctx) {
    const dir = (ctx.location && ctx.location.directory) || process.cwd();
    const isRepo = existsSync(join(dir, "docs", "sessions"));
    if (!isRepo) return; // inert outside the monorepo root

    await ctx.session.hook("prompt", async (event) => {
      try {
        const first = !(await ctx.storage.get(`briefed:${event.sessionID}`));
        const body = briefing(dir);
        const hash = sha1(body + "|" + event.sessionID);
        if (first || (await ctx.storage.get(`hash:${event.sessionID}`)) !== hash) {
          await ctx.session.instructions.entry.put({
            sessionID: event.sessionID,
            key: ENTRY_KEY,
            value: body,
          });
          await ctx.storage.set(`hash:${event.sessionID}`, hash);
          await ctx.storage.set(`briefed:${event.sessionID}`, { at: Date.now() });
        }
        if (first) {
          const diary = latestDiary(dir);
          event.prompt.files ??= [];
          if (diary) {
            event.prompt.files.push({ uri: pathToFileURL(join(dir, "docs", "sessions", diary)).href });
          }
        }
      } catch (err) {
        console.error("[oposilab-handoff] briefing missed:", err && err.message);
      }
    });

    await ctx.command.transform((editor) => {
      editor.add({
        name: "handoff",
        description: "Close out this session: diary entry, tracker, pointer, verify, commit + push",
        execute: async ({ sessionID, prompt, delivery }) => {
          await ctx.session.prompt({
            ...prompt,
            sessionID,
            text: CLOSE_OUT,
            delivery,
          });
        },
      });
    });
  },
});
```

(`.js` is deliberate: repo tsconfig has no include list, so any `.ts` file would be type-checked by
`npm run lint`; with `allowJs` + `checkJs` off, a `.js` plugin is lint-inert. Runtime `@opencode/plugin`
resolution for local plugins is verified at the Task-3 smoke test; if the import fails to resolve there,
STOP — do not invent shapes, report and decide with the user. The smoke test's command check is simply
that `/handoff` appears in the command list — no debug command exists.)

- [ ] **Step 2: Verify Task 1 (static)**

```bash
node --check .opencode/plugins/oposilab-handoff/index.js
grep -c 'oposilab-briefing\|CLOSE_OUT\|name: "handoff"' .opencode/plugins/oposilab-handoff/index.js
npm run lint   # must stay clean: plugin is .js (not type-checked), tsc only flags .ts
```

Expected: `node --check` silent (exit 0); greps hit; `npm run lint` clean (other than unrelated parallel-WIP errors — record any pre-existing foreign errors and do not fix them).

- [ ] **Step 3: Add the AGENTS.md discoverability bullet**

In `AGENTS.md`, replace:
```
- `docs/design/` — design specs (canonical home; newest: `docs/design/2026-11-10-handoff-briefing-design.md`).
- `docs/ACCEPTANCE.md` — acceptance criteria → evidence mapping (35 criteria). Update it when acceptance status changes.
```
with:
```
- `docs/design/` — design specs (canonical home; newest: `docs/design/2026-11-10-handoff-briefing-design.md`).
- The oposilab-handoff plugin auto-briefs each session (latest diary entry + dirty-tree warning); `/handoff` closes a session.
- `docs/ACCEPTANCE.md` — acceptance criteria → evidence mapping (35 criteria). Update it when acceptance status changes.
```

---

### Task 2: `doc-freshness` test (X1–X3), R1 message drive-by, count sync

**Files:**
- Create: `tests/doc-freshness.test.ts`
- Modify: `tests/seed-reconcile.test.ts` (message string only)
- Modify: `README.md`, `docs/ACCEPTANCE.md`, `.opencode/agent/oposilab-guardian.md`, `AGENTS.md` (count claims only)

**Interfaces:**
- Consumes: nothing from Task 1 (independent).
- Produces: the X1–X3 consistency gate that Task 3 runs; Task 3 syncs live claims to the measured totals.

- [ ] **Step 1: Write the test file**

Create `tests/doc-freshness.test.ts` with exactly this content:

```ts
// Doc-freshness gate (X1-X3): cross-doc number consistency + matrix vs re-derived counts.
// Pure node:fs text reads (no server/db.ts import -> no isolateDataDir needed).
// Mirrors the counting methods proven 2026-11-10 (literal full ids for T3/T15, `stem: '` counts
// for questionBank banks; ACCEPTANCE c21 literals for T7/retrieval).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(rel: string): string {
  const p = new URL(rel, new URL('..', import.meta.url));
  return readFileSync(p, 'utf8');
}

function firstNumber(re: RegExp, text: string, what: string): number {
  const m = re.exec(text);
  assert.ok(m, `doc-freshness: could not parse ${what}`);
  return Number(m[1]);
}

function distinctValues(re: RegExp, text: string): number {
  const matches = text.match(re);
  return matches ? new Set(matches).size : 0;
}

function stemCount(text: string): number {
  const matches = text.match(/stem: '/g);
  return matches ? matches.length : 0;
}

test('X1: seeded/eligible counts agree across README, ACCEPTANCE and R1 source', () => {
  const readme = read('README.md');
  const acceptance = read('docs/ACCEPTANCE.md');
  const r1src = read('tests/seed-reconcile.test.ts');

  const seeded = firstNumber(/(\d+) ítems sembrados/, readme, 'README sembrados');
  const eligible = firstNumber(/(\d+) ítems elegibles/, readme, 'README elegibles');
  const seededAcc = firstNumber(/(\d+) ítems sembrados/, acceptance, 'ACCEPTANCE sembrados');
  const eligibleAcc = firstNumber(/(\d+) ítems elegibles/, acceptance, 'ACCEPTANCE elegibles');
  const r1Seed = firstNumber(/assert\.equal\(state\.seedCount, (\d+)/, r1src, 'R1 seedCount');
  const r1Eligible = firstNumber(/assert\.equal\(state\.eligibleCount, (\d+)/, r1src, 'R1 eligibleCount');

  assert.equal(seededAcc, seeded, 'README/ACCEPTANCE seeded counts disagree');
  assert.equal(eligibleAcc, eligible, 'README/ACCEPTANCE eligible counts disagree');
  assert.equal(r1Eligible, eligible, 'R1 eligibleCount disagrees with docs');
  assert.equal(r1Seed, r1Eligible, 'R1 seedCount != eligibleCount at head (6 retrieval/pretest items: seeded-vs-eligible semantics changed?)');
});

test('X2: test-count claims agree AND match the physical test-file count (guardian included)', () => {
  const readme = read('README.md');
  const acceptance = read('docs/ACCEPTANCE.md');
  const guardian = read('.opencode/agent/oposilab-guardian.md');

  const n = firstNumber(/(\d+) pruebas \/ \d+ suites/, readme, 'README pruebas');
  const m = firstNumber(/\d+ pruebas \/ (\d+) suites/, readme, 'README suites');
  const nAcc = firstNumber(/\*\*(\d+)\/\d+ en \d+ suites\*\*/, acceptance, 'ACCEPTANCE tests');
  const mAcc = firstNumber(/\*\*\d+\/\d+ en (\d+) suites\*\*/, acceptance, 'ACCEPTANCE suites');
  const nG = firstNumber(/\*\*(\d+) tests \/ \d+ suites\*\*/, guardian, 'guardian tests');
  const mG = firstNumber(/\*\*\d+ tests \/ (\d+) suites\*\*/, guardian, 'guardian suites');

  assert.equal(nAcc, n, 'ACCEPTANCE/README test counts disagree');
  assert.equal(nG, n, 'guardian/README test counts disagree');
  assert.equal(mAcc, m, 'ACCEPTANCE/README suite counts disagree');
  assert.equal(mG, m, 'guardian/README suite counts disagree');

  const physical = readdirSync(new URL('.', new URL('tests/', new URL('..', import.meta.url))))
    .filter((f: string) => f.endsWith('.test.ts')).length;
  const gFiles = firstNumber(/(\d+) `\*\.test\.ts` files/, guardian, 'guardian file count');
  const accFiles = firstNumber(/(\d+) archivos en `tests\/?`/, acceptance, 'ACCEPTANCE file count');
  assert.equal(gFiles, physical, 'guardian file count is stale');
  assert.equal(accFiles, physical, 'ACCEPTANCE file count is stale');
});

test('X3: matrix rows equal re-derived per-topic item counts (and sum to the seeded total)', () => {
  const matrix = read('docs/CONTENT-COVERAGE.md');
  const acceptance = read('docs/ACCEPTANCE.md');

  const t3 = distinctValues(/item-t3-\d+/g, read('server/seedDataTema3.ts'));
  const t15all = distinctValues(/item-t15-\d+/g, read('server/seedDataTema15.ts'));
  const t9 = stemCount(read('server/seedDataTema9.ts'));
  const t8ip = stemCount(read('server/seedDataTema8IP.ts'));
  const t3g = stemCount(read('server/seedDataTema3General.ts'));
  const t8 = stemCount(read('server/seedDataTema8Items.ts'));
  const t1 = stemCount(read('server/seedDataTema1.ts'));
  const t7 = firstNumber(/server\/seedData\.ts` \((\d+) ítems/, acceptance, 'ACCEPTANCE Tema 7 count');
  const retrieval = firstNumber(/\+ (\d+) de retrieval\/pretest/, acceptance, 'ACCEPTANCE retrieval count');

  const cell = (rowName: string): number | null => {
    const line = matrix.split('\n').find((l) => l.startsWith(`| ${rowName} `));
    assert.ok(line, `matrix row missing: ${rowName}`);
    const cols = line.split('|').map((c) => c.trim());
    return Number(cols[3]);
  };

  assert.equal(cell('Tema 7'), t7);
  assert.equal(cell('Tema 1'), t1);
  assert.equal(cell('Tema 3 específico'), t3);
  assert.equal(cell('Tema 8 específico'), t8);
  assert.equal(cell('Tema 8 II'), t8ip);
  assert.equal((cell('Tema 15') || 0) + (cell('Tema 16') || 0), t15all, 'T15+T16 split sum');
  assert.equal(cell('Tema 3 General'), t3g);
  assert.equal(cell('Tema 9'), t9);
  assert.equal(cell('retrieval/pretest'), retrieval);

  const seeded = firstNumber(/(\d+) ítems sembrados/, read('README.md'), 'README sembrados');
  const seededFromMatrix = t7 + t1 + t3 + t8 + t8ip + t15all + t3g + t9;
  assert.equal(seededFromMatrix, seeded, 'matrix topics sum != README seeded');
});
```

- [ ] **Step 2: R1 message drive-by (string only — never the values)**

Re-snapshot the CURRENT line first (parallel bookkeeping may already have moved its values):

```bash
git show HEAD:tests/seed-reconcile.test.ts | grep -n "assert.equal(state.seedCount"
grep -n "assert.equal(state.seedCount" tests/seed-reconcile.test.ts
```

Then, if `HEAD` line text still matches the one below, replace it; otherwise replace the message
portion of the CURRENT line with the same intent (keep that line's current numbers!):

Replace (current HEAD text, verified 2026-11-10):
```ts
    assert.equal(state.seedCount, 481, '113 core items plus 61 Tema 3 items plus 70 Tema 8 items plus 52 Tema 8 (II) items plus 76 Tema 15/16 items plus 6 retrieval/pretest items plus 24 Tema 3 General (TC) items plus 18 Tema 16 gap-audit items plus 56 Tema 9 (nacimiento y cuidado) items plus 5 Tema 9 parte-2 gap-audit items plus 12 Tema 3 parte-2 gap-audit items are seeded');
```
with:
```ts
    assert.equal(state.seedCount, 481, 'The committed seed recomposes to 481 items (see docs/CONTENT-COVERAGE.md for the per-topic matrix)');
```

If the parallel agent's commit landed first and the line already reads `assert.equal(state.seedCount, <N>, ...)`, replace ONLY its message argument with the same CONTENT-COVERAGE pointer (number = their current N).

- [ ] **Step 3: Run the new test standalone (TDD loop — it MUST fail on stale counts now)**

```bash
npx tsx --test tests/doc-freshness.test.ts 2>&1 | grep -E '^(not )?ok|# (fail|pass)'
```

Expected now: X2 FAILS (README/ACCEPTANCE/guardian still claim 318/43 while the tree now contains 321 tests / 44+ files: +1 file `doc-freshness.test.ts` made it 29 files → X1 passes, X3 passes, X2 fails on the suite/file numbers). This failure is the intended drift signal — do NOT "fix" the test; sync the claims (Step 4).

- [ ] **Step 4: Sync live count claims (to measured numbers)**

Run the full suite once to measure reality:
```bash
npm test 2>&1 | grep -E '# (pass|fail)|suites' | tail -5
```
Record `TOTAL` tests and `SUITES` (expected 321 tests / 44 suites; if the parallel batch raised them, use the actuals). Then rewrite every live claim to `TOTAL`/`SUITES`:
- `README.md` (2 spots): `npm test         # 318 pruebas / 43 suites` → `${TOTAL} pruebas / ${SUITES} suites`; the Estructura summary line `tests/ 318 pruebas en 43 suites` likewise. (README's 475/481 lines stay — R1 numbers unchanged at HEAD.)
- `docs/ACCEPTANCE.md`: the revision header (`**318/318 en 43 suites**`), criterion 21's tail if it names test totals, and criterion 22's file list — insert `doc-freshness` into the enumerated suites, flip "28 archivos" to 29, and its `318/318 en 43 suites` to the measured `${TOTAL}/${TOTAL} en ${SUITES} suites`.
- `.opencode/agent/oposilab-guardian.md`: line 17 `**318 tests / 43 suites**` → measured; line 26 "28 `*.test.ts` files" → 29 + add `doc-freshness` to the list.
- `AGENTS.md` line 18: `318 tests / 43 suites` → measured pair.
Leave `implementation_plan.md` untouched (dated evidence records keep their historical numbers — same rule as the rev-4 "210/210" note).

- [ ] **Step 5: Re-run the new test standalone (must be green now)**

```bash
npx tsx --test tests/doc-freshness.test.ts 2>&1 | grep -E '^(not )?ok|# (fail|pass)'
```

Expected: all X1–X3 pass. Then run `npm run lint` (expected clean for THIS change set: test files and a `.js` plugin don't affect tsc beyond `import.meta`'s pre-existing warning).

---

### Task 3: Verification, single commit, push (manual smoke + WIP gates)

**Files:** none modified (verification + git only). Stages exactly what Tasks 1–2 created/modified.

**Interfaces:**
- Consumes: all outputs of Tasks 1–2.
- Produces: commit `docs(structure): ...` + push. (Ships with the two unpushed design commits: `7ee1748`, `6490c2b` ... actually those already shipped — at build time the base is `cf957a7` `docs(tracker)` and this commit stacks on top.)

- [ ] **Step 1: Pre-flight `git status` (parallel-agent gate)**

```bash
git status --porcelain && git log --oneline -3
```

Expected: only this plan's docs/test/plugin paths changed. The parallel agent's `M server/seedData.ts`, `M tests/seed-reconcile.test.ts`, `?? server/seedDataTema15Extra.ts`, `?? tests/tema15-bank.test.ts` must remain untouched by us (including Step 2 of Task 2: if their committed R1 already bumped numbers, adapt the drive-by — never re-stash or checkout their files).

- [ ] **Step 2: Isolated verification (per-file, foreign-WIP-proof)**

```bash
npx tsx --test tests/doc-freshness.test.ts/ --test-name-pattern='X1|X2|X3' 2>&1 | grep -E '^(not )?ok|# (fail|pass)'
npm run lint
```

Expected: X1–X3 green standalone; `npm run lint` clean OR red only from the parallel file (`server/seedDataTema15Extra.ts`) with the error recorded. Do not block the commit on foreign red (design §6 records this branch), but DO record the exact error lines in the commit message.

- [ ] **Step 3: Manual opencode load smoke (interactive — cannot be automated in this env)**

In a real opencode session against this repo (same machine): send any prompt and confirm (a) a `<context key="oposilab-briefing">` block is present in context; (b) `/handoff` appears in the command list; (c) `~/.local/share/opencode/log/opencode.log` has no plugin loader errors for `oposilab-handoff`. If (a) or (b) is absent, STOP and report — do not commit a plugin that never loads.

- [ ] **Step 4: Stage docs/test/plugin-only paths, commit, push**

```bash
git add .opencode/plugins/oposilab-handoff/index.js AGENTS.md tests/doc-freshness.test.ts tests/seed-reconcile.test.ts README.md docs/ACCEPTANCE.md .opencode/agent/oposilab-guardian.md
git status --porcelain   # verify the staged set is exactly these 7 + rename (if any docs/design moved)
git commit -m "docs(structure): add handoff briefing plugin and doc-freshness gate

Parallel-agent WIP note: <paste exact foreign errors recorded in Step 2; drop the note if suite is green>"
git push
```

Expected: `git status` ends empty except the parallel agent's files; push succeeds.
