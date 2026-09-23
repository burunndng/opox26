# OposiLab MCQ Trainer — Criterios de Aceptación (spec §18)

Estado verificado en la última revisión. "Test" = prueba automatizada en `tests/`;
"Manual" = comprobación con pasos concretos. Nada se declara funcionando sin evidencia.

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | Arrancar la app con un comando | ✅ | `npm install --legacy-peer-deps && npm run dev` → http://localhost:3000 (`server.ts`) |
| 2 | Base de datos se inicializa sola | ✅ | `db.init()` (module load) crea `data/oposilab.db` vía `server/sqlite/connection.ts`; `tests/sqlite.test.ts` A3 (DB vacía → null → seed) |
| 3 | Importar PDF o pegar texto | ✅ | `POST /api/import/pdf` (pdfjs-dist, offline), `POST /api/import/chunk`; UI Content Studio con fallback de pegado — `tests/pipeline.test.ts` B8–B10; error 422 + `fallback:'paste'` |
| 4 | Crear topics, chunks, átomos, clusters, pares | ✅ | CRUD `server.ts` (topics/source-chunks/atoms/clusters/confusion-pairs) validado con Zod; `tests/sqlite.test.ts` A1, A10 |
| 5 | Crear o draftar (IA) todos los tipos de actividad | ✅ | 10 `ItemType` en `src/types.ts`; TODOS los tipos del seed; drafter IA en `server/ai.ts` (opcional, siempre borrador) |
| 6 | Validar ítems antes de activarlos | ✅ | `status: draft → validated → active`; validación en Content Studio + Item Bank; `/api/items/validation-warnings`; `src/utils/learningDesignValidator.ts` |
| 7 | Cover-and-generate: opciones ocultas, generación libre, confianza, feedback completo, scheduling | ✅ | `ActivityRunner.tsx` (etapas cover/answer/feedback), `server/db.ts:recordAttempt`, scorer en `src/scoring/evaluateItem.ts` — test 5 (cuadrantes) |
| 8 | Cloze con exact/sinónimos y feedback near-miss | ✅ | `src/scoring/evaluateItem.ts` + `cloze_data.synonyms/near_misses` — test 3 |
| 9 | Contrast cards con criterio discriminante y tabla A/B | ✅ | `contrast_data`, runner contrast_card — seed 15 tarjetas |
| 10 | Number-sorting con drag-and-drop y alternativa de teclado | ✅ | Chips `draggable` + drop sobre el supuesto + `<select>` por fila (teclado/lector) — `ActivityRunner.tsx` bloque number_sort |
| 11 | Spot-the-error con span erróneo clicable y corrección | ✅ | `spot_error_data.error_spans`, corrector de corrección — test 7 |
| 12 | Two-tier con los 4 cuadrantes | ✅ | `two_tier_data`, clasificación de cuadrante — test 6 |
| 13 | Exception-tree (enrutamiento de casos) | ✅ | `exception_tree_data` (nodos + casos), runner — seed 6 |
| 14 | Fact-variant labs | ✅ | `fact_variant_data` (base + variantes), runner — seed 6 |
| 15 | Bloque intercalado con restricciones | ✅ | `InterleavingEngine.generateBlock` (≤2 consecutivos mismo clúster, mezcla de formatos) — test 10 |
| 16 | SRS con reaprendizaje sucesivo y graduación | ✅ | `server/db.ts:recordAttempt` + `server/scheduler.ts` (3 aciertos, 2 formatos, intercalado, conf ≥2, sin pista) — test 9, test 13 |
| 17 | Errores auto-registrados y reparables | ✅ | Creación de `ErrorLog` en `recordAttempt`; Repair Studio con transiciones de estado — test 11 |
| 18 | Calibración de confianza medida y mostrada | ✅ | `src/utils/analytics.ts` + `AnalyticsStrip` embebido en el Dashboard; alertas textuales — `tests/analytics.test.ts` D1–D4 |
| 19 | Analítica: clústeres débiles, pares, confident-wrong, errores numéricos | ✅ | Motor de analítica (heat maps, matrices, alertas) + `SessionHeatMap` — `tests/analytics.test.ts` D5–D10 |
| 20 | Exportar a Anki y CSV | ✅ | `/api/export/anki`, `/api/export/csv-items`, `/api/export/csv-errors`, Quizlet, backup JSON — test 12; muestra real en `examples/anki_sample.tsv` |
| 21 | Seed Tema 7 carga correctamente | ✅ | `server/seedData.ts` (100 ítems: 25/20/15/10/10/8/6/6) + `seedDataTema1.ts` + 6 de retrieval/pretest — test 1 |
| 22 | Tests unitarios de scheduling, interleaving, validación, cloze, errores | ✅ | `tests/oposilab.test.ts` (1–19), `sqlite` (A1–A10), `pipeline` (B1–B10), `retrieval` (C11–C16), `analytics` (D1–D10) — **55/55** |
| 23 | README explica el uso | ✅ | `README.md` (español): instalación, base de datos, Content Studio, estudios, atajos, exportación, IA opcional, tests |

## Pendientes declarados (fuera de alcance o diferido)

- **Playwright E2E**: no implementado (no requerido como bloqueante; las 55 pruebas son unitarias/integración).
- **Ejercicios de comprobación manual sin cobertura automática**: caminar por cada tipo de actividad en la UI (criterios 7–14 se validan por código + tests del scorer, no por E2E).
- **`package.json` conserva el nombre `react-example`** (herencia del scaffold; sin efecto funcional).
- **La suite original (`tests/oposilab.test.ts`) opera sobre la base real**; aíslala con `OPOSILAB_DATA_DIR` si conv practice en paralelo (recomendación del plan, fase de mantenimiento).
