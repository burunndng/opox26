# OposiLab MCQ Trainer — Criterios de Aceptación (spec §18)

Estado verificado en la última revisión. "Test" = prueba automatizada en `tests/`;
"Manual" = comprobación con pasos concretos. Nada se declara funcionando sin evidencia.

> Hardening de auditoría aplicado el 2026-10-23 (FIX 1–9): **183/183** pruebas en 40 suites;
> validación Zod en las 13 rutas que no la tenían; migraciones aditivas de esquema; scorer,
> SRS, scheduler y exportador endurecidos. Detalle en `docs/audit/2026-10-23/REPORT.md`.

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | Arrancar la app con un comando | ✅ | `npm install --legacy-peer-deps && npm run dev` → http://localhost:3000 (`server.ts`) |
| 2 | Base de datos se inicializa sola | ✅ | Inicialización perezosa (`Proxy` en primer acceso) de `data/oposilab.db` vía `server/sqlite/connection.ts`, con migraciones aditivas al arrancar; `tests/sqlite.test.ts` A3 (DB vacía → null → seed), `tests/sqlite-migrations.test.ts` M1–M4, guarda de aislamiento P2.3 |
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
| 15 | Bloque intercalado con restricciones | ✅ | `InterleavingEngine.generateBlock` (≤2 consecutivos mismo clúster, mezcla de formatos) — test 10; `tests/interleaving-hardening.test.ts` I1 (determinismo con estado idéntico) e I2 (sin 3er formato consecutivo) |
| 16 | SRS con reaprendizaje sucesivo y graduación | ✅ | `server/db.ts:recordAttempt` — crédito de formato solo con acierto; la graduación honra los ajustes (`require_two_formats_for_graduation`, `require_interleaved_success_for_graduation`, `confidence_required_for_graduation`, `graduating_interval`) — test 9, test 13, `tests/srs-graduation.test.ts` G1–G4 |
| 17 | Errores auto-registrados y reparables | ✅ | Creación de `ErrorLog` en `recordAttempt`; Repair Studio con transiciones de estado — test 11 |
| 18 | Calibración de confianza medida y mostrada | ✅ | `src/utils/analytics.ts` + `AnalyticsStrip` embebido en el Dashboard; alertas textuales — `tests/analytics.test.ts` D1–D4 |
| 19 | Analítica: clústeres débiles, pares, confident-wrong, errores numéricos | ✅ | Motor de analítica (heat maps, matrices, alertas) + `SessionHeatMap` — `tests/analytics.test.ts` D5–D10 |
| 20 | Exportar a Anki y CSV | ✅ | `/api/export/anki`, `/api/export/csv-items`, `/api/export/csv-errors`, Quizlet, backup JSON — test 12; muestra real en `examples/anki_sample.tsv` |
| 21 | Seed Tema 7 carga correctamente | ✅ | `server/seedData.ts` (100 ítems: 25/20/15/10/10/8/6/6) + `seedDataTema1.ts` + 6 de retrieval/pretest — test 1 |
| 22 | Tests unitarios de scheduling, interleaving, validación, cloze, errores | ✅ | `tests/oposilab.test.ts` (1–19), `sqlite` (A1–A10), `pipeline` (B1–B10), `retrieval` (C11–C16), `analytics` (D1–D10), `eligibility` (E1–E4), `seed-integrity` (F1–F7), `queue-order` (G1–G7), `option-order` (O1–O5), `practice-pools` (P1–P6), `seed-reconcile` (R1–R4), `validation-warnings` (V1–V4), `scorer-hardening` (11), `srs-graduation` (G1–G4), `interleaving-hardening` (I1–I2), `schema-contracts` (14), `sqlite-migrations` (M1–M4) — **183/183** (2026-10-23) |
| 23 | README explica el uso | ✅ | `README.md` (español): instalación, base de datos, Content Studio, estudios, atajos, exportación, IA opcional, tests |
| 24 | Cuantías 2026 verificadas en fuente oficial | ✅ | [BOE-A-2026-2548](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-2548) (RDL 3/2026, 3-feb): revalorización 2,7 %; tope 3.359,60 €/mes · 47.034,40 €/año; PNC 8.803,20 €/año en 14 pagas (RD 357/1991 art. 14.1); límites de ingresos 9.442,00 €/11.013,00 €. `figure_status` en 13 ítems del clúster `importes_2026` — `tests/seed-integrity.test.ts` F7 |
| 25 | Práctica solo con contenido elegible y reconciliación de seeds | ✅ | Predicado compartido `isPracticeEligible` aplicado en `server/scheduler.ts` (due stats/cola/bloques) y en pools de cliente (`src/utils/practicePools.ts`, `src/utils/sniperFilter.ts`); metadatos de seeds sin intentos se reconcilian al arrancar — `tests/eligibility.test.ts` E1–E4, `tests/seed-reconcile.test.ts` R1–R4, `tests/practice-pools.test.ts` P1–P6 |
| 26 | Orden de opciones por encuentro con atajos posicionales | ✅ | `src/utils/optionOrder.ts` (FNV-1a + mulberry32) conserva IDs estables; etiquetas A/B/C/D y teclas 1–4 siguen la posición mostrada (MCQ, cloze con opciones, two-tier, fact-variant) — `tests/option-order.test.ts` O1–O5 |
| 27 | Integridad del banco de seeds | ✅ | `tests/seed-integrity.test.ts` F1–F6: una sola correcta e IDs únicos, distribución canónica ≤40 %, correcta ≤1,25× media de distractores, explicación y trampa por distractor, base legal y stems únicos por formato |
| 28 | Endpoint de avisos de validación completo | ✅ | `server/validationWarnings.ts` compone chequeos inline ∪ pedagógicos, deduplica por `(item_id, rule)` y añade aviso no crítico de cuantía estimada; `server.ts` sirve el helper — `tests/validation-warnings.test.ts` V1–V4 + smoke API |
| 29 | Cola diaria intercalada con tope de nuevos | ✅ | `server/queueOrder.ts` + `getDueQueue` (excluye vencidas futuras salvo `new`, omite suspendidas, cap `max_new_items_per_day`) — `tests/queue-order.test.ts` G1–G7; día 1 sobre seeds reales: 15 ítems sin triplete de formato |

## Pendientes declarados (fuera de alcance o diferido)

- **Playwright E2E**: no implementado (no requerido como bloqueante; las 183 pruebas son unitarias/integración).
- **Ejercicios de comprobación manual sin cobertura automática**: caminar por cada tipo de actividad en la UI (criterios 7–14 se validan por código + tests del scorer, no por E2E).
- **`package.json` conserva el nombre `react-example`** (herencia del scaffold; sin efecto funcional).
- **La suite original (`tests/oposilab.test.ts`) opera sobre la base real**; aíslala con `OPOSILAB_DATA_DIR` si conv practice en paralelo (recomendación del plan, fase de mantenimiento).
