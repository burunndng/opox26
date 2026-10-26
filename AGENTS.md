# OposiLab MCQ Trainer — Agent Guide

Local-first cognitive trainer for Spanish oposición MCQs (Seguridad Social). Not a generic quiz app. UI text is Spanish; code and identifiers are English.

Key documents (read before planning work):
- `docs/SPEC.md` — full product specification (§1–§22). Authoritative for *behavior*, **not** for stack (see warning below).
- `implementation_plan.md` — working plan (P1–P6 priorities, current state, ADRs). Check §1 before starting any task.
- `docs/ACCEPTANCE.md` — acceptance criteria → evidence mapping. Update it when acceptance status changes.
- `README.md` — user-facing docs in Spanish.

## Commands

```bash
npm install --legacy-peer-deps   # peer-dep conflicts otherwise; npm is the documented flow
npm run dev                      # tsx server.ts → http://localhost:3000
npm run lint                     # despite the name: ONLY tsc --noEmit. No ESLint exists. 0 errors expected
npm test                         # node:test via tsx, ~2s
npm run build                    # vite build + esbuild server bundle → dist/server.cjs; npm start serves it
```

- Dev server is a single process: Express API + Vite middleware (server.ts). No separate frontend port.
- Verification order: `npm run lint` → `npm test`.
- Single test file: `npx tsx --test tests/sqlite.test.ts`. Filter by name: add `--test-name-pattern="<pattern>"`.
- Node ≥ 22.5 required (uses built-in `node:sqlite`).

## Hard constraints

- **The spec's stack is stale.** `docs/SPEC.md` says Next.js/Drizzle/better-sqlite3/Vitest. The implementation deliberately uses **Vite + React 19 + Express + `node:sqlite` + Zod + `node:test`** (rationale in README *Arquitectura*). Never migrate frameworks or add those deps "to match the spec".
- **No full mock exams.** Deliberate methodological decision; do not add a mock-exam module.
- **AI is optional.** Everything must work with no API keys. Keys (`GEMINI_API_KEY` / `OPENROUTER_API_KEY`) go in `.env` (see `.env.example`). `OPOSILAB_OFFLINE=1` forces local deterministic fallbacks for AI/Jev clients (tests use this to avoid network).
- **AI/heuristic-generated content always lands as `draft`**; only human validation promotes items to `active`.
- Firebase Google sign-in sync is optional and opt-in; local SQLite stays the source of truth.

## Data & persistence gotchas

- SQLite lives at `data/oposilab.db` (WAL) — gitignored. **Never commit study data.**
- `OPOSILAB_DATA_DIR` env var redirects the DB location (lazy-resolved at init, not at import).
- Any test touching `server/db.ts` (directly or transitively) MUST call `isolateDataDir()` from `tests/helpers/isolation.ts` first — it sets a temp data dir + `OPOSILAB_OFFLINE=1`. A regression guard test (P2.3) enforces that imports alone never seed the default-path DB.
- `server/db.ts` auto-initializes lazily via a Proxy on first access. Boot seeding is idempotent.
- Legacy JSON databases auto-migrate on first boot (backup kept as `*.json.migrated.bak`); manual: `npx tsx scripts/migrate-json-to-sqlite.ts`.

## Architecture map

- `server.ts` (root) — all Express routes + Zod validation (schemas in `src/schemas/`) + Vite middleware.
- `server/` — `db.ts` (repositories, `recordAttempt`, SRS state updates), `sqlite/` (connection, persist), `scheduler.ts` (`SchedulingEngine`, `InterleavingEngine`), `heuristics.ts` (offline atom suggestions), `pdfImport.ts`, `exporter.ts`, `ai.ts`, `jev.ts`, `seedData*.ts` (idempotent seeds).
- `src/` — React app. `components/ActivityRunner.tsx` is the unified runner for all item formats; scoring lives in `src/scoring/evaluateItem.ts` (cloze, spot-error, two-tier, number-sort…), analytics in `src/utils/analytics.ts`.
- **Domain types are shared**: `src/types.ts` holds the data model and is imported by both server and client.
- Path alias `@/` → repo root (tsconfig + vite).
- `scripts/` = one-off seed-generation utilities (several in Python). Not part of runtime or tests.

## Conventions

- Conventional commits with scope (`feat(persistence): …`, `fix(ui): …`).
- Keep scoring/scheduling logic in the pure, tested modules — not inline in components.
- Repo originated as a Google AI Studio applet scaffold: `metadata.json`, `firebase-*.json`, and the `DISABLE_HMR` block in `vite.config.ts` are AI Studio artifacts. Don't modify the HMR block; `package.json` name `react-example` is a known cosmetic leftover.
