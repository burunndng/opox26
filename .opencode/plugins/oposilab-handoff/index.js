// Session-start briefing + /handoff for the oposilab-mcq-trainer repo.
// Design: docs/design/2026-11-10-handoff-briefing-design.md (A+B bundle, approved 2026-11-10).
// Plain JS on purpose: the repo tsconfig includes every **/*.ts, and @opencode/plugin is
// not installed; a .js plugin stays lint-inert (allowJs, checkJs off) with no new deps.
// Never throws: any failure logs one line and skips the briefing for that prompt.
import { Plugin } from "@opencode/plugin";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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
    });
    const lines = out.replace(/\n$/, "").split("\n").filter(Boolean).map((l) => l.slice(3));
    if (!lines.length) return null;
    const shown = lines.slice(0, 3).join(", ");
    return `${lines.length} changed (${shown}${lines.length > 3 ? ", …" : ""})`;
  } catch {
    return null;
  }
}

// "Latest" = the diary named in the maintained §1 "Próximos pasos" pointer, NOT the
// alphabetically last filename: two same-day diaries (…tema15-general.md vs
// …tema3-parte2.md) do not sort chronologically by name. Fall back to newest mtime.
function latestDiary(dir) {
  const plan = readText(dir, "implementation_plan.md") || "";
  const pointed = /latest session diary `(?:docs\/sessions\/)?([^`]+\.md)`/.exec(plan);
  if (pointed && existsSync(join(dir, "docs", "sessions", pointed[1]))) return pointed[1];
  const d = join(dir, "docs", "sessions");
  if (!existsSync(d)) return null;
  const files = readdirSync(d).filter((f) => f.endsWith(".md"));
  if (!files.length) return null;
  return files
    .map((f) => ({ f, t: statSync(join(d, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t || b.f.localeCompare(a.f))[0].f;
}

function nextStepLine(dir, file) {
  const text = readText(dir, join("docs", "sessions", file));
  if (!text) return "(no Siguiente paso line)";
  const line = text.split("\n").find((l) => l.includes("Siguiente paso:"));
  if (!line) return "(no Siguiente paso line)";
  return line.replace(/^\s*-\s*\*\*.*?\*\*:?\s*/, "").trim().slice(0, 110);
}

// The numbers that used to drift: README / ACCEPTANCE / guardian claims vs the R1 source.
function counts(dir) {
  const readme = readText(dir, "README.md") || "";
  const acceptance = readText(dir, "docs/ACCEPTANCE.md") || "";
  const guardian = readText(dir, ".opencode/agent/oposilab-guardian.md") || "";
  const r1src = readText(dir, "tests/seed-reconcile.test.ts") || "";
  return {
    readmeSeeded: num(/(\d+) ítems sembrados/, readme),
    readmeEligible: num(/(\d+) ítems elegibles/, readme),
    readmeTests: num(/(\d+) pruebas \/ \d+ suites/, readme),
    readmeSuites: num(/\d+ pruebas \/ (\d+) suites/, readme),
    accSeeded: num(/(\d+) ítems sembrados/, acceptance),
    accEligible: num(/(\d+) elegibles/, acceptance),
    accTests: num(/\*\*(\d+)\/\d+ en \d+ suites\*\*/, acceptance),
    accSuites: num(/\*\*\d+\/\d+ en (\d+) suites\*\*/, acceptance),
    guardTests: num(/\*\*(\d+) tests \/ \d+ suites\*\*/, guardian),
    guardSuites: num(/\*\*\d+ tests \/ (\d+) suites\*\*/, guardian),
    r1Seed: num(/assert\.equal\(state\.seedCount, (\d+)/, r1src),
    r1Eligible: num(/assert\.equal\(state\.eligibleCount, (\d+)/, r1src),
  };
}

function countLine(c) {
  const pairs = [
    ["seeded", c.readmeSeeded, c.accSeeded],
    ["eligible", c.readmeEligible, c.accEligible],
    ["tests", c.readmeTests, c.guardTests],
    ["suites", c.readmeSuites, c.guardSuites],
    ["acc-tests", c.readmeTests, c.accTests],
    ["acc-suites", c.readmeSuites, c.accSuites],
  ];
  const bad = pairs.filter(([, a, b]) => a != null && b != null && a !== b);
  if (c.r1Eligible != null && c.readmeEligible != null && c.r1Eligible !== c.readmeEligible) {
    bad.push(["R1 vs README eligible", c.r1Eligible, c.readmeEligible]);
  }
  if (bad.length) {
    return `⚠️ count mismatch ${bad.map(([n, a, b]) => `${n}=${a}/${b}`).join(" ")}`;
  }
  return "counts agree";
}

function briefing(dir) {
  const head = headLine(dir);
  const dirty = dirtyTree(dir);
  const diary = latestDiary(dir);
  const nxt = diary ? nextStepLine(dir, diary) : "(none yet — /handoff will create one)";
  const lines = [
    `Repo: oposilab-mcq-trainer @ ${head}`,
    dirty ? `⚠️ dirty tree: ${dirty} — treat other agents' WIP as foreign` : "Tree: clean",
    `Latest diary: docs/sessions/${diary || "—"} (Siguiente paso: ${nxt})`,
    "Coverage: docs/CONTENT-COVERAGE.md (Tier B headliner: afiliación indebida + devolución de cuotas)",
    `Counts: ${countLine(counts(dir))}`,
    "Close-out when done: /handoff",
  ];
  return lines.join("\n");
}

const CLOSE_OUT = `Close out this session per the oposilab diary convention, IN ORDER:
1. Append docs/sessions/<today>-<slug>.md (template: Objetivo / Hecho / Verificado / Siguiente paso / Notas, max ~15 lines, commit hashes required).
2. Refresh docs/CONTENT-COVERAGE.md (matrix row + Tier B) if content changed; verify per-topic counts from git show HEAD:<file> (never from the dirty tree).
3. Update the "Próximos pasos" pointer in implementation_plan.md §1 (same commit as the diary entry).
4. Verify counts from HEAD (npm run lint + npm test; copy the total into every live count claim if they moved).
5. Stage docs-only paths explicitly (never -A/-a; foreign WIP must remain uncommitted), commit with a conventional message, push.`;

export default Plugin.define({
  id: "oposilab-handoff",
  async setup(ctx) {
    const dir = (ctx.location && ctx.location.directory) || process.cwd();
    if (!existsSync(join(dir, "docs", "sessions"))) return; // inert outside this repo

    await ctx.session.hook("prompt", async (event) => {
      try {
        const sid = event.sessionID || event.messageID || "default";
        const briefedKey = `briefed:${sid}`;
        const hashKey = `hash:${sid}`;
        const first = !(await ctx.storage.get(briefedKey));
        const body = briefing(dir);
        const hash = sha1(body + "|" + sid);
        if (first || (await ctx.storage.get(hashKey)) !== hash) {
          await ctx.session.instructions.entry.put({
            sessionID: sid,
            key: ENTRY_KEY,
            value: body,
          });
          await ctx.storage.set(hashKey, hash);
          await ctx.storage.set(briefedKey, { at: Date.now() });
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
