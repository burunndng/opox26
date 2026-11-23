# CODEBASE.md — OposiLab MCQ Trainer

> Resumen de descubrimiento actualizado el 2026-11-23 desde HEAD `97f3143`. Fuentes: `README.md`, `AGENTS.md`, `package.json`, `opencode.json`, `.opencode/agent/*`, `server.ts`, `implementation_plan.md`, `docs/SPEC.md`, `docs/ACCEPTANCE.md`, `docs/CONTENT-COVERAGE.md`, `docs/sessions/`, árbol de `src/`, `server/`, `tests/`, `scripts/`, `docs/design/` y `git log`.
>
> No sustituye a `docs/SPEC.md` (comportamiento), `docs/ACCEPTANCE.md` (evidencia) ni `docs/CONTENT-COVERAGE.md` (cobertura). Ante contradicción de stack, manda el código y `AGENTS.md`.

## 1. Propósito y alcance

- **App:** OposiLab MCQ Trainer, repo local `oposilab-mcq-trainer`. Entrenador cognitivo local-first para MCQs de oposiciones de Seguridad Social (C1, código 1616, turno libre), no un quiz genérico.
- **Foco:** discriminación, recuperación, espaciado, intercalado, análisis de distractores, reparación de errores y calibración metacognitiva. **Sin simulacros completos**, decisión metodológica explícita.
- **Idioma:** UI y contenido en español; identificadores y código en inglés.
- **Aprendiz:** una persona candidata adulta (owner). Los intentos reales siguen sin registrarse como datos del candidato; las pruebas usan directorios aislados. Las prioridades temáticas son hipótesis, no debilidades medidas.
- **LO1–LO5:** práctica MCQ; precisión de cifras/plazos/órganos; distinción de conceptos confusibles; calibración de confianza 0–3; trazabilidad a fuente oficial (`legal_basis`/`source`/`figure_status`).

## 2. Stack y comandos documentados

| Área | Realidad |
|---|---|
| Stack | Vite 8 + React 19 + Express 4 + TypeScript + `node:sqlite` + Zod + `node:test` |
| Spec | `docs/SPEC.md` manda para comportamiento; su stack Next.js/Drizzle/better-sqlite3/Vitest está obsoleto |
| Node | `>=22.5.0` |
| Instalar / dev | `npm install --legacy-peer-deps`; `npm run dev` → `http://localhost:3000` |
| Verificar | `npm run lint` (= `tsc --noEmit`), `npm test`, `npm run build`; `npm start` sirve `dist/` sin `NODE_ENV` |
| Aislamiento | `OPOSILAB_DATA_DIR`, `OPOSILAB_OFFLINE=1`, `isolateDataDir()` en tests que tocan `server/db.ts` |

**Verificado en HEAD `97f3143`:** lint limpio; `npm test` **384/384 en 51 suites**, 35 ficheros `*.test.ts`; build OK con aviso no bloqueante de chunk >500 kB. Smoke aislado: PDF válido 200 y corrupto 422 con `fallback:'paste'`.

## 3. Mapa de módulos

### Servidor
- `server.ts`: rutas Express y validación Zod; incluye `/api/content-sets` para guardado atómico, además de CRUD, cola/SRS, export/import, IA/Jev, PDF y avisos de validación.
- `server/db.ts`: repositorios, `recordAttempt` idempotente con rollback ante fallo SQLite, `createContentSet`, reconciliación de semillas, init perezoso vía Proxy.
- `server/sqlite/`: `connection.ts` (WAL y migraciones aditivas), `persist.ts` (transacción y registro de operaciones de set), `defaults.ts`.
- `server/scheduler.ts`, `server/queueOrder.ts`, `server/validationWarnings.ts`, `server/importItems.ts`, `server/heuristics.ts`, `server/pdfImport.ts`, `server/exporter.ts`, `server/ai.ts`, `server/jev.ts`.
- Semillas: `seedData.ts` y los bancos Tema 1, 3, 3 General, 4, 8, 8 IP, 9, 10, 15/16 y retrieval/pretest.

### Cliente
- Entrada: `main.tsx`, `App.tsx`, `api.ts` (incluye `saveContentSet`), `types.ts`, `schemas/index.ts`, `index.css`.
- Componentes: `ActivityRunner`, `StudySetup`, `Dashboard`, `ContentStudio`, `ItemBank`, `ErrorRepairStudio`, `MicroLessonRunner`, `ModeAStudyRunner`, `PretestDiagnosticMap`, `AnalyticsStrip`, `SessionHeatMap`, `Navbar`, `OnboardingModal` y modales. `CalibrationAnalytics.tsx` fue eliminado.
- Lógica pura: `scoring/evaluateItem.ts`; `utils/analytics.ts`, `retrievalMatch.ts`, `learningDesignValidator.ts`, `drillSelectors.ts`, `repairRouting.ts`, `optionOrder.ts`, `practicePools.ts`, `sniperFilter.ts`, `topicScope.ts`, `topicStats.ts`, `topicBadge.ts`, `trapLabels.ts`, `runnerRenderCoverage.ts`, `useFocusTrap.ts`.
- Sync Firebase opcional y opt-in; SQLite local sigue siendo la fuente de verdad.

### Tests y tooling
- 35 ficheros: `oposilab`, `sqlite`, `sqlite-migrations`, `pipeline` (smoke de producción), `content-set-save`, `srs-graduation`, `seed-*`, `topic-counts`, `doc-freshness`, `modal-a11y`, `form-labeling`, `renderer-coverage`, `tema*-bank`, etc.
- `opencode.json` define `default_agent: oposilab-pm` y los agentes `oposilab-pm`, `oposilab-guardian` y `oposilab-editor`; plugin local `.opencode/plugins/oposilab-handoff` y comando `/handoff`.

## 4. Datos y persistencia

- BD principal: `data/oposilab.db` (SQLite, WAL), gitignored. No commitear datos de estudio ni backups.
- Las escrituras usan una transacción por mutación; los sets completos registran una clave de idempotencia para reintentos seguros.
- `OPOSILAB_DATA_DIR` redirige la BD con resolución perezosa; los tests aíslan datos y fuerzan modo offline.

## 5. Estado funcional y de contenido

- **Contenido:** 640 ítems sembrados / 646 elegibles en 11 temas + retrieval/pretest.
- **Último diario:** `docs/sessions/2026-11-20-cierre-fiabilidad.md`.
- **Pendiente inmediato:** smoke visual del owner; después Tier B (`docs/CONTENT-COVERAGE.md`) y verificación manual de los criterios 7–14.
- **Reglas de producto:** sin mock exams; baremo +1/−0,25/0; confianza 0–3 antes del feedback; explicaciones solo en feedback; figuras con `figure_status`; intercalado ≤2 consecutivos por clúster; contenido generado siempre `draft` hasta validación humana.

## 6. Mismatches, pendientes e incertidumbres

- `docs/SPEC.md` es behavior-authoritative pero su stack está obsoleto; no migrar.
- `package.json` conserva `react-example` y `vite.config.ts` el bloque `DISABLE_HMR`: herencia de AI Studio, no tocar.
- `tests/modal-a11y.test.ts` es una guarda estática: no prueba `aria-labelledby` ni el comportamiento real del foco.
- Queda el aviso de tamaño del bundle; no hay evidencia de impacto perceptible.
- Adaptar roadmap UX solo tras el smoke; `docs/UX-AUDIT-2026-11.md` documenta decisiones ya aplicadas.

## 7. Referencias clave

Comportamiento: `docs/SPEC.md`. Evidencia: `docs/ACCEPTANCE.md`. Cobertura: `docs/CONTENT-COVERAGE.md`. Plan/ADRs: `implementation_plan.md`. Continuidad: `docs/sessions/`. Diseño: `docs/design/`. Guía de agentes: `AGENTS.md`, `.opencode/agent/*.md`.
