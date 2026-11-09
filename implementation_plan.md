# OposiLab MCQ Trainer — Implementation Plan v4

> **For agentic workers:** Execute the priorities in order, use the listed verification commands, and stop at each acceptance gate before starting the next priority.

**Date:** 2026-11-03 (rev 4)
**Scope:** Complete the existing app against `docs/SPEC.md` (§1–§22).
**North star:** cognitive training for MCQ discrimination (NOT a generic quiz app; NO full mock exams).

> **Rev 4 changes (2026-11-03):** P4, P5 and P6 are marked complete with
> current evidence; the verified baseline is **210/210 tests in 40 suites**,
> `tsc --noEmit` clean and `npm run build` OK. New §1.9 records the
> UX/accessibility pass (onboarding, focus trap, distilled study setup and
> collapsible runner controls). Content is now eight seed topics / 402 seeded
> items / 408 practice-eligible items. The rev 3 priorities and historical
> counts below are kept as an audit trail; §1.8's note about blocked lint/build
> is superseded by §1.9.

> **Rev 3 changes:** remaining work re-ordered by user priority (§6): security
> work is **explicitly deferred**; active priorities are (a) restart data loss,
> (b) test isolation, (c) validation/seed integrity, (d) core activity
> correctness, (e) SRS/interleaving/repair, (f) import/export/UX/docs. The v2
> phase history is consolidated into the Completed baseline. Architecture
> decisions (§2) are unchanged. Status ✅ is only claimed where the listed
> verify command was actually run.

> The previous plan (Modo A/B batch learning flow) is archived at
> `docs/plans/2026-09-modo-ab-batch-learning.md` and is **already implemented** (tests 18–19).

---

## 1. Current State (verified 2026-09-23 · refreshed 2026-11-03)

The app is a complete local-first implementation: P1–P6 are closed and the table below records verified behavior with its evidence. Historical phase notes are audit trail, not acceptance evidence.

| Area | Current status | Evidence / next focus |
|---|---|---|
| Stack | Vite 8 + React 19 + Express 4 + TypeScript, `npm run dev` = `tsx server.ts` | `package.json` |
| Persistence | SQLite exists; restart behavior now covered by an isolated two-boot regression test | `server/db.ts`, `tests/persistence.test.ts` |
| Tests | Full suite green and fully isolated — **210 tests / 40 suites** (2026-11-03; `npm test` provably never touches the live DB) | `npm test`, `tests/helpers/isolation.ts`, P2.3 regression guard |
| Data model | Core types and SQLite tables stable; seed relationships are guarded by the integrity/reconcile suites | `src/types.ts`, `server/sqlite/connection.ts`, `tests/seed-integrity.test.ts` F1–F12, `tests/seed-reconcile.test.ts` R1–R18 |
| Activity surfaces | All required formats wired to production scorers; cognitive-state / near-miss / quadrant evaluation complete (P4) | `src/components/ActivityRunner.tsx`, `src/scoring/evaluateItem.ts`, `tests/non-mcq-evaluation.test.ts`, `tests/scorer-hardening.test.ts` |
| Content pipeline | Text/PDF import, offline atom suggestions, eligibility filter and quality-gated promotion enforced (P3) | `server/pdfImport.ts`, `server/heuristics.ts`, `server/validationWarnings.ts`, `ContentStudio.tsx`, `tests/validation-gate.test.ts` |
| Scheduler | Due filter, daily new-item cap, graduation flags, maintenance and deterministic interleaving covered (P5) | `server/scheduler.ts`, `server/queueOrder.ts`, `tests/queue-order.test.ts` G1–G7, `tests/srs-graduation.test.ts`, `tests/interleaving-hardening.test.ts` |
| Seed | Eight topics / 402 seeded items / 408 practice-eligible; topic split and legacy re-homing guarded | `server/seedData*.ts`, `tests/seed-integrity.test.ts` F11–F12, `tests/seed-reconcile.test.ts` R18 |
| Export/import | Anki/CSV/Quizlet/Markdown/backup plus validated JSON/CSV item import (P6) | `server/exporter.ts`, `server/importItems.ts`, `tests/oposilab.test.ts` 12, 15–15d |

### 1.3 Content — Tema 8 (II) IP gap audit vs. class 21-10 (2026-10-31)

Audit of resúmenes 21-10 pt1/pt2 against `topic_seguridad_social_tema_8_ip` (40 validated MCQs). Gaps closed by adding 12 manually authored, validated items (`item-t8ip-41…52`): días restantes de IT como cotizados para la carencia; HC sin alta = fecha de solicitud; transformación EC→jubilación vs profesional continúa; 15 años = requisito de alta (no carencia); cualificada 55↔75 % al trabajar/perder empleo; IPT compatible con desempleo involuntario; dictamen-propuesta complementario tras alegaciones; plazos 15 (alegaciones) / 180 (observación EP); ponente facultativo médico del INSS; IPA incompatible salvo art. 128 LGSS; resolución fija plazo de revisión encadenado; reclamación previa → Juzgado de lo Social vs. Ley 39 para afiliación/alta/baja. Defered: esquema comparativo (awaits temas 9-11) y las cinco grandes preguntas (solving framework, no MCQ). Bank now 52 items, keys 13/13/13/13; `npm run lint` clean; `npm test` 197/197 across 39 suites.

### 1.4 Content — Tema 15 (Ley 40/2015) gap audit vs. class 28-10 pt1 (2026-10-31)

Audit of `resumen 28-10 pt1` (Tema 15, §§3–5) against `topic_tema15` (61 items). Confirmed gaps G1–G9: desconcentración art. 8.2 (no item); delegación scope art. 9.1 (only irrenunciabilidad covered); revocación art. 9.3/9.6 (no item); encomienda formalización art. 11.3 (no item); avocación impugnación art. 10.2 (only notification covered by item 50); suplencia prelación art. 13.2 (only causes by item 54); secretario elegibilidad art. 16.1 (only functions by item 61); sesiones a distancia art. 17.1 (no item); instrucciones publicación art. 6.1 (only incumplimiento by item 44). Also fixed item-t15-45 `legal_basis`: `Art. 8.1` (was `9.1`). Added 9 validated items (`item-t15-62…70`): G1 desconcentración, G2 delegación scope, G3 revocación, G4 encomienda formalización, G5 avocación recurso, G6 suplencia prelación, G7 secretario elegibilidad, G8 sesiones a distancia, G9 instrucciones publicación. Bank now 70 items (keys A16/B18/C18/D18, ≤40% per position, no exact-balance test for Tema 15); `npm run lint` clean; `seed-integrity` 10/10; `seed-reconcile` 360/360; `npm test` passes.

### 1.5 Content — Tema 15 (Ley 39/2015 procedimental) gap audit vs. class 28-10 pt2 + remaining pt1 (2026-11-01, combined batch)

Audit of `resumen 28-10 pt2` (Ley 39/2015: registro, archivo, silencio, plazos, urgencia, comparecencia) combined with unresolved pt1 gaps. Added 6 validated items (`item-t15-71…76`) to `topic_tema15`: delegación/delegación-firma (C); órganos-colegiados-quórum (D); silencio-administrativo (A); cómputo-plazos/días-inhábiles (B); urgencia-plazos (C); comparecencia-obligatoria (D). Keys: C,D,A,B,C,D (no exact-balance test; no run >2). Legal anchors: Arts. 9.1/12, 17.2, 24.1, 30.2, 33.2, 19.1/14.2 (Ley 40/39). Deferred: dedicated `tema16` topic + bank for full Ley 39 separation (requires new topic + `seedData.ts` wiring). Bank now 76 items; `npm run lint` clean; `seed-reconcile` 366/366; validation-gate W1–W7 pass; `npm test` passes.

### 1.6 Content — Tema 16 separation: Ley 39/2015 gets its own topic (2026-11-03)

Closes the §1.5 deferral. New `topic_tema16` ("Tema 16 (bloque general) — Procedimiento administrativo común (Ley 39/2015)") registered in `seedTopics`; `seedDataTema15.ts` now derives topic placement from the item's legal anchor (`39/2015`/`203/2021` → Tema 16, else Tema 15), moving 40 items (acto administrativo concepto/clases/elementos, invalidez arts. 47-52, eficacia/motivación arts. 35/39/50, notificación/publicación arts. 40-46, silencio art. 24, plazos art. 30, urgencia art. 33, comparecencia art. 19 + RD 203/2021) and leaving 36 Ley 40/2015 items in Tema 15 (órganos, competencia, delegación/desconcentración/avocación/encomienda/suplencia, abstención/recusación, colegiados). Boot merge syncs seed topic placement for existing DBs — including attempted items (atom-style seed ownership) — and syncs seed topic name/description renames. `topicBadge` labels both as "Derecho Administrativo". Guards: seed-integrity F11 (every seed item resolves to a registered topic), F12 (split follows the legal anchor), seed-reconcile R18 (legacy `topic_tema15` + attempt is re-homed to `topic_tema16` on boot, attempt preserved); total unchanged at 366 (36 + 40).

### 1.7 Content — Tema 3 General (Tribunal Constitucional) new bank from class 26-10 (2026-11-03)

New topic `topic_constitucion_tema_3` ("Constitución Española - Tema 3: Bloque General - El Tribunal Constitucional") with a new bank file `server/seedDataTema3General.ts` (source of truth: resumen/clase 26-10 pt1 + `GENERAL/tema 3 general/TEMA 3.pdf` + `TEST 3.1.pdf`, preparador MAM). 24 manually authored, validated items (`item-t3g-1…24`) covering the 8 sections of the class: regulación (Título IX CE, LO 2/1979); composición y nombramiento (12 magistrados, 4+4+2+2, 3/5, ≥40 % paridad, juristas >15 años, incompatibilidades); requisitos e incompatibilidades; elección del Presidente (absoluta → 2ª votación → mayor antigüedad → mayor edad) y Vicepresidente; competencias (recurso de inconstitucionalidad 3 meses; cuestión sin plazo propio; amparo legitimados y plazos 20/30 días hábiles; conflictos de competencia y de protección de autonomía local; disposiciones sin fuerza de ley; tratados internacionales); organización interna (Pleno/Salas/Secciones, quórums, sentencias y recursos); efectos de las sentencias. Clusters `cluster_tc_*` (6), confusion pairs `pair_tc_*` (5), atoms `atom-t3g-*` (valid `AtomType` values only). New clusters/pairs/atoms wired into `seedClusters`/`seedConfusionPairs`/`seedAtoms`; `seedItemsTema3General` appended **last** in `seedItems` so `rebalanceCanonicalMcqOptions` does not reshuffle existing topics. Key balance 6/6/6/6, no run >2. Totals: seed-reconcile R1 366→**390** practice-eligible. `npm run lint` clean; `npm test` 210/210 across 40 suites. Note: no `tests/tema3-general-bank.test.ts` yet (per-bank integrity guard optional, cf. `tema8-bank.test.ts` / `tema8ip-bank.test.ts`).

### 1.8 Content — Tema 16 gap audit vs. class 28-10 pt2 (2026-11-03)

Audit of `resumen 28-10 pt2` (Ley 39/2015: arts. 13-14, 19, 21-25, 30-33 y 53) against `topic_tema16` (40 items). Closed 18 gaps with manually authored, validated items (`item-t15-77…94`) in `server/seedDataTema15.ts` (`seedItemsTema16Extra`, appended last in `seedItems`): plazo supletorio de 3 meses (21.3); dies a quo de oficio = fecha del acuerdo (21.3.a, caso 10/4→10/8); dies a quo a solicitud = entrada en registro competente (21.3.b, caso 10/4→12/4); excepciones de silencio desestimatorio (24.1); silencio estimatorio = acto finalizador y resolución posterior confirmatoria (24.2-24.3); certificado de silencio a petición = 15 días desde el día siguiente a la entrada en registro competente (24.4, caso 24/29-10); caducidad y archivo en procedimientos de gravamen (25.1.b); suspensión obligatoria por recusación/actuaciones complementarias (22.2); tope de 3 meses del informe preceptivo (22.1.d); ampliación del art. 23 limitada al plazo de tramitación y sin recurso; ampliación del art. 32 = mitad del plazo y antes del vencimiento; inimpugnabilidad del acuerdo de urgencia (33.2); días hábiles salvo ley/UE (30.2); último día inhábil → primer día hábil siguiente (30.5); presentación en registro electrónico inhábil → primera hora del primer día hábil (31.2.b); art. 14.2.c limitado al ejercicio de la actividad profesional; art. 13 vs. 53.1.f (trampa recurrente); art. 14.3 basta reglamento. BOE-verified anchors (Ley 39/2015, arts. 21-25, 30-33, 53). Totals: seed-reconcile R1 390→**408** (36 Tema 15 + 58 Tema 16). `npm test` 210/210 across 40 suites and the targeted seed suites 42/42 pass; at commit time `npm run lint` and `npm run build` were blocked only by unrelated uncommitted component work from a parallel workstream (`OnboardingModal.tsx`, `StudySetup.tsx`), not by this batch. **Resuelto el 2026-11-03:** lint, build y 210/210 verdes con ese trabajo integrado (ver §1.9).

### 1.10 Content — Tema 9 (Nacimiento y cuidado) gap audit vs. clase 4-11 + supuesto de repaso + parte 2 (2026-11-04)

Banco `seedDataTema9.ts` + meta `seedDataTema9Meta.ts` + registro en `seedData.ts`. **56 MCQs (`item-t9-1…56`)** cubriendo cobertura completa verificada contra el resumen/notas (`RESUMEN Y NOTAS TEMA 9 especifico 4-11.txt` §§1-5 + parte 2 11-04), las diapositivas (`Diaposiivas tema 9 ss.md`) y el supuesto oficial (`Supuesto repaso t. 9 especif,.pdf.md`): lote inicial1-24 (BR A1-2, anticipación A3, distribución A4, hospitalización A5, sin pago delegado A6, desempleo A7, fallecimiento menor A8, no contributivo B1-2, lactante C1-2, riesgos D1-3, asignación E1-3, pagos únicos F1-2, cáncer G1-4) + ampliación 25-32 (situaciones protegidas, hecho causante internacional/nacional, cuantía exenta IRPF, IPREM inferior, no acumulación 56 días, lactante 100% BR comunes, reubicación 7 meses) + cierre 33-56: requisitos del menor adoptado/acogido <6/6-18 ≥33% o dificultades (33), alta inexcusable (34), carencia 21-25 90/180 y 26+ 180/360 con regla del doble (35-36), resolución provisional→definitiva 3 meses (37), monoparental 32=6+22+4 (38), reglas de disfrute 15 días/semanas completas/intransferible/limitación (39), subsidio especial múltiple contributivo 6 semanas pago único tras 6 solo uno (40), diferimiento desde el alta excluidas 6 (41), fallecimiento progenitor acumulación (42), cotización patronal/obrera (43), desempleo 2ª dirección suspende/reanuda (44), no contributivo beneficiarios alta sin carencia (45), lactante requisitos/certificación/exclusión funcionarios (46), riesgo embarazo inicio/extinción/gestión (47), asignación competencias CCAA/IMSERSO vs INSS (48), efectos trimestrales/pago semestral-mensual/30 días (49), pago único requisitos contrast 1.000€ vs múltiple (50), cáncer matrimonio/novedades residencia/escolarización (51), BR ingreso reciente mes anterior/mismo mes (52), cáncer cuantía individual 100% proporcional/gestión Mutua/extinción SPS (53), TREBEP vs general semana 37 (54), asignación beneficiarios adicionales huérfanos/custodia/acuerdo (55), extinción nacimiento art. 8.12 (56). Clusters `cluster_*` (13), confusion pairs `pair_*` (5) registrados; topic `topic_seguridad_social_tema_9`. Key balance exacto 14/14/14/14, sin runs >2; duplicados eliminados (F6) y longitud ≤1,25× (F3). `npm run lint` limpio; `npm test` con R1 actualizado (432→464). BOE-verified anchors: arts. 177-192, 248, 284, 351-360 TRLGSS; RD 295/2009 arts. 7-8,12; RD 1335/2005 arts. 9-11; arts. 37.4/37.6 ET; TREBEP arts. 48.f/49.a/49.e. **No BOE-verificados independientemente**: importes LPGE (IPREM/SMI/1.000 €) como referencia normativa; anclas nuevas `art. 7 RD 295/2009` y `art. 49.a TREBEP` marcadas como fuente interna. Definidos como `validated` manual; nada en `draft`. Diferido (baja prioridad docente, no MCQ): fraude/pérdida-suspensión procesal y mecánica de liquidación patronal, artistas/taurinos con descubierto, transitoria de permisos parentales, esquema comparativo completo (espera temas 10-11) y 5 grandes preguntas (marco, no MCQ). **Nota técnica**: inserción al final de `seedItems` para preservar `rebalanceCanonicalMcqOptions`; actualizados `seed-reconcile` R1 (408→464), `README.md` (458/464), `docs/ACCEPTANCE.md` (458/464).

> **Actualizado:** `tests/seed-reconcile.test.ts` R1 (432→464); `implementation_plan.md` §1.10; `server/seedDataTema9.ts` (56, duplicados depurados); `README.md` y `docs/ACCEPTANCE.md` sincronizados.

### 1.11 Content — Tema 9 parte-2 gap audit vs. resumen parte 2 (2026-11-09)

Auditoría de `RESUMEN Y NOTAS TTEMA 9 especifico 4-11 parte 2.txt` contra el banco de 56 ítems (baseline `7a2605b`), re-audito ítem a ítem antes de escribir: de los 12 gaps aprobados, 7 los cerró ya la ampliación `7a2605b` (parto múltiple, tramos de carencia, pago único, lactante, asignación, custodia/huérfanos, escolarización). Añadidos 5 ítems validados (`item-t9-57…61`): **57 (A)** carencia agrupada — IT semana 39 (art. 172.a remite al art. 178.1), corresponsable del lactante (art. 184, «mismos requisitos») y CUME (art. 191.1) comparten los tramos del art. 178 con exención <21 años; **58 (B)** ventana de bases con antigüedad <12 meses — alta 8-ene → hecho causante 8-nov → [8 ene, 30 sep], con distractor-trampa «de septiembre a septiembre = 13 meses» (art. 248.1.b); **59 (C)** informe del CUME = facultativo de atención primaria **o especializada** del SPS de la CA (art. 190.2); la versión más estrecha del profesor («solo primaria») va como distractor `hyper_narrow_statement`; **60 (D)** modos del art. 191.2 — a favor de una o de ambas de forma alternativa o simultánea; el requisito de «personas distintas» solo concurre con más de una persona a cargo; **61 (A)** secuencia del art. 186 + art. 26.3 LPRL — deber de cambio propuesto → imposibilidad o no exigibilidad razonable (incluye el segundo supuesto, ausente en `item-t9-13`). Anclas verificadas una sola vez contra BOE-A-2015-11724 (arts. 172/178/184/186/190.2/191.2/192/248.1.b) y art. 26.3 LPRL; slips del profesor codificados como distractores, nunca como clave. Keys A16/B15/C15/D15, sin runs >2; F3 ≤1,25× comprobado a mano. Totals: R1 464→**469**; `README.md`/`docs/ACCEPTANCE.md` 458/464→463/469. Diferido (acordado): G13 cónyuge si se casa (cubierto por `item-t9-51`), G14 CCAA/IMSERSO (`item-t9-48`), G15 intervalo 9-12 meses, tabla RG/TREBEP del §3.6 y contradicciones del profesor (360/180, redacción del 50 %, cifras del SMI, Victoria 4× SMI).

> **Actualizado:** `server/seedDataTema9.ts` (61; clave A16/B15/C15/D15); `server/seedDataTema9Meta.ts` (`source_file` con la parte 2); `tests/seed-reconcile.test.ts` R1 (464→469); `implementation_plan.md` §1.11; `README.md` y `docs/ACCEPTANCE.md` (463/469).

---

## 2. Verification Evidence (current verified baseline)

- `npm run lint`: `tsc --noEmit` limpio (última pasada 2026-11-03, ver §1.9).
- `npm test`: **210/210 en 40 suites** (2026-11-03); con el lote Tema 9 la suite pasa (el R1 actualizado confirma 464).
- `tests/seed-integrity.test.ts`: F1–F12 verdes; F7 (figura/estimación) pasa porque ningún ítem de Tema 9 lleva cifras anuales vinculadas a años específicos.
- `tests/tema8ip-bank.test.ts`: 52 ítems, claves 13/13/13/13; `tests/tema8-bank.test.ts`: 70 ítems, verde.
- `tests/seed-reconcile.test.ts`: R1 actualizado a 464; los nuevos ítems se registran como `validated` con `source: 'manual'` y `item_type: 'cover_and_generate_mcq'`.

> **Documentación sincronizada:** `README.md` (458/464) y `docs/ACCEPTANCE.md` (criterios 21/35, 458/464) actualizados en esta pasada.

Pasada de diseño/UX sobre `src/App.tsx` y los componentes compuestos. Cambios verificados en el árbol (sin commit al cierre de esta revisión):

- **Onboarding de primer arranque:** `OnboardingModal.tsx` (4 pasos: bienvenida, baremo +1/−0,25, confianza 0–3 y arranque del primer test) disparado desde `StudySetup.tsx` y recordado en `localStorage` (`oposilab_onboarding_completed`); se puede saltar.
- **Accesibilidad de diálogos:** `src/utils/useFocusTrap.ts` (focus-in, ciclo Tab/Shift+Tab, Esc y restauración de foco) cableado en `CreateTopicModal`, `HelpShortcutsModal`, `InterleavedBlockModal` y `JevLabModal`, con `role="dialog"`, `aria-modal` y `aria-labelledby`. Pendiente: `OnboardingModal` y los overlays antiguos de `ItemBank`/`ErrorRepairStudio`.
- **Punto de decisión destilado:** `StudySetup` muestra cuatro formas principales; Plazos/Cuantías y Duelo se revelan bajo "Más formas de practicar". El runner colapsa ritmo/exportar/guardar/progreso en "Más opciones" y sustituye el selector de baremo por una pill de solo lectura cuando queda bloqueado.
- **Navegación y feedback:** atajos `Alt+1/2/3` a Panel/Test/Reparación; confirmación antes de descartar una sesión; foco visible y etiquetas de contraste ajustadas en controles.
- **Contenido:** sin cambios de ítems en esta pasada.

Verificación: `npm run lint` limpio, `npm test` **210/210 en 40 suites**, `npm run build` OK. `docs/ACCEPTANCE.md` criterios 31–35 recogen la evidencia; el criterio 32 queda 🟡 por la cobertura parcial de diálogos.

### 1.1 Hardening de auditoría — 2026-10-23

Auditoría exhaustiva (freeze `71935c2`) + remediación FIX 1–9, verificada con `npm run lint`
(limpio) y `npm test` (**183/183**, 40 suites). Informe: `docs/audit/2026-10-23/REPORT.md`.

- **FIX 1–2 (S1)**: scorer endurecido (cloze exacto, spot_error sin selecciones triviales,
  number_sort normalizado, errorCode limpio en aciertos) y guarda de teclado del runner
  (dígitos solo en `contrast_card`).
- **FIX 3–8 (S2)**: exportador Anki posicional (A/B/C/D) con fallbacks de campos; graduación SRS
  con flags efectivos y crédito de formato solo en acierto; Zod en las 13 rutas antes sin validar;
  scheduler determinista con límite de runs de formato; migraciones aditivas `ALTER TABLE` en
  `server/sqlite/connection.ts`; `PORT` configurable y `engines >=22.5`.
- **FIX 9**: smoke runtime en `PORT=3210` (dev + dist) con evidencia en
  `docs/audit/2026-10-23/evidence/smoke-transcript-fixed.txt`; conteos de pruebas actualizados
  en README y ACCEPTANCE.

### 1.2 Re-medición tras descartar el WIP mercury-decide — 2026-10-26

La medición del close-out (183/183, 40 suites) se hizo con un WIP no commiteado en el árbol
(mercury-decide, ver `docs/audit/2026-10-23/REPORT.md` §«Pre-existing work»); ese WIP se
descartó a posteriori y 11 pruebas en 3 suites nunca fueron parte del repo. Además, `c755ce3`
(FIX 5) había commiteado las 4 rutas Jev de `server.ts` llamando a `JevClient` con un parámetro
`model` que nunca llegó a `server/jev.ts` (era parte del WIP): `npm run lint` quedó con 4 errores
TS2554 en HEAD. Las llamadas se restauraron a las firmas 1–2 argumentos de `JevClient`
(`/api/jev/audit-item`, `diagnose-attempt`, `classify-atom`, `verify-cascade`).

Recuento de esa revisión: **172/172 en 37 suites**, `npm run lint` limpio. Recuento actual:
**210/210 en 40 suites** (2026-11-03, §1.9). `REPORT.md` y sus logs se conservan como registro
histórico (medidos con el WIP presente).

---

## 2. Architecture Decisions (ADR)

### ADR-1: Keep Vite + React + Express. Do NOT migrate to Next.js.
- Spec §6 *prefers* Next.js, but the app is complete, local-first, single-command, and framework migration is pure churn with zero pedagogical value.
- **Deviation documented here; accepted unless the user veto.**

### ADR-2: Migrate storage JSON → **SQLite** at `./data/oposilab.db`. ✅ DONE (Phase A)
- Spec §6 requires SQLite. The old `data/oposilab.db.json` was a full-state read/rewrite file: fragile under crash and unbounded growth as attempts accumulate.
- **Driver: `node:sqlite` (Node built-in), not better-sqlite3.** better-sqlite3 install was blocked by a *pre-existing* npm peer conflict (vite 8 ↔ esbuild 0.25). `node:sqlite` ships with Node ≥ 22.5: zero native deps, zero install risk, synchronous API nearly identical to better-sqlite3. Documented in `server/sqlite/connection.ts`.
- **FK enforcement intentionally OFF** (SQLite default): the JSON store never cascaded deletes; enabling cascades would silently change app behavior (deleting a topic would vanish its items). REFERENCES clauses remain as documentation.
- Architecture: in-memory working set unchanged (`db.ts` public API identical) + `persistAll()` syncing all tables in **one WAL transaction per mutation** (delete-stale + upsert-current). Settings as key/value rows; polymorphic payloads (options, cloze_data, contrast_data, …) as JSON columns.
- **Auto-migration:** on boot, if SQLite is empty and legacy JSON exists → `migrateJsonToSqlite()` imports it and renames the JSON to `*.migrated.bak` (never deletes). Standalone CLI: `npx tsx scripts/migrate-json-to-sqlite.ts`. Tests override the data dir via `OPOSILAB_DATA_DIR` (used by `tests/sqlite.test.ts`).
- Drizzle ORM: **not adopted** (spec lists it as preferred, not required). Thin hand-rolled mappers + Zod validation cover the need.
- Verified in this revision: focused restart tests pass 2/2 and `tsc --noEmit` is clean; the full suite remains pending safe isolation.

### ADR-3: Add Zod for all API input validation (spec §6). ✅ DONE (2026-10-23)
- All body routes validate via a shared `validateBody` helper; the 13 routes that previously trusted `req.body` were wired with dedicated schemas (audit FIX 5, `tests/schema-contracts.test.ts`). Zod schemas in `src/schemas/` shared by client & server; 400 responses with issue details.

### ADR-4: node:test via tsx stays (not Vitest).
- The test runner remains `node:test` through `tsx`; all suites must use isolated data directories before full-suite execution is trusted.

### ADR-5: Firebase stays **optional and lazy**.
- Spec forbids cloud accounts as a dependency. Verify the app boots and runs 100% with no Firebase env vars; `AuthProvider` must degrade to anonymous/local-only. If it hard-fails, gate behind lazy init.

---

## 3. Target File Structure (Δ = new in this plan)

```
oposilab-mcq-trainer/
├── server.ts                        # Express routes (add Zod validation middleware)
├── server/
│   ├── db.ts                        # Public API unchanged; backend swapped to SQLite
│   ├── sqlite/
│   │   ├── Δ schema.sql             # DDL: 14 tables (§4)
│   │   └── Δ connection.ts          # Singleton better-sqlite3 instance + WAL
│   ├── scheduler.ts                 # SRS + interleaving (unchanged)
│   ├── exporter.ts                  # Anki/CSV/Quizlet/MD (unchanged)
│   ├── ai.ts, jev.ts                # Optional AI + local fallback (unchanged)
│   ├── Δ heuristics.ts              # Offline regex atom-suggestion engine (§8.2 of spec)
│   └── Δ pdfImport.ts               # pdf-parse wrapper w/ graceful failure
├── src/
│   ├── types.ts                     # Unchanged (already aligned)
│   ├── Δ schemas/                   # Zod schemas: topic, chunk, atom, cluster,
│   │                                #   confusionPair, item, attempt, settings
│   ├── components/                  # Existing UI; deltas in Phase C–E
│   ├── scoring/evaluateItem.ts      # Existing
│   └── utils/learningDesignValidator.ts
├── Δ scripts/migrate-json-to-sqlite.ts
├── data/                            # oposilab.db (SQLite) — already gitignored dir
├── tests/oposilab.test.ts           # Extended per phase
└── docs/plans/                      # Archived plans
```

---

## 4. SQLite Schema (DDL plan)

Maps the existing TS interfaces 1:1 (no data-model changes). JSON columns for polymorphic payloads keep queries simple; indexes on hot filters.

```sql
CREATE TABLE topics (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '',
  source_file TEXT, status TEXT CHECK(status IN ('draft','active','archived')) DEFAULT 'draft',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE source_chunks (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  page_number INTEGER, article_reference TEXT,
  raw_text TEXT NOT NULL, summary TEXT, order_index INTEGER NOT NULL
);
CREATE TABLE atoms (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
  source_chunk_id TEXT REFERENCES source_chunks(id) ON DELETE SET NULL,
  text TEXT NOT NULL, atom_type TEXT, legal_basis TEXT, cluster_id TEXT,
  confusion_pair_id TEXT, tags TEXT /* JSON array */, difficulty INTEGER DEFAULT 3,
  figure_status TEXT, status TEXT CHECK(status IN ('draft','validated','deprecated')) DEFAULT 'draft',
  created_at TEXT, updated_at TEXT
);
CREATE TABLE clusters (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT DEFAULT '', type TEXT, priority TEXT DEFAULT 'medium'
);
CREATE TABLE confusion_pairs (
  id TEXT PRIMARY KEY, topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
  concept_a TEXT NOT NULL, concept_b TEXT NOT NULL,
  discriminating_cue TEXT NOT NULL, common_trap TEXT NOT NULL,
  legal_basis_a TEXT, legal_basis_b TEXT, example_case TEXT,
  status TEXT DEFAULT 'draft', severity TEXT DEFAULT 'medium'
);
CREATE TABLE items (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  cluster_id TEXT, confusion_pair_id TEXT, item_type TEXT NOT NULL,
  stem TEXT NOT NULL, prompt_before_options TEXT,
  options TEXT /* JSON MCQOption[] */, correct_answer TEXT,
  legal_basis TEXT, rule_statement TEXT, why_correct TEXT,
  distractor_analysis TEXT /* JSON */, trap_types TEXT /* JSON */,
  corrective_rule TEXT, condition_if_distractor_correct TEXT /* JSON */,
  difficulty INTEGER DEFAULT 3, cognitive_operations TEXT /* JSON */,
  status TEXT DEFAULT 'draft', source TEXT DEFAULT 'manual',
  cloze_data TEXT, contrast_data TEXT, number_sort_data TEXT, spot_error_data TEXT,
  two_tier_data TEXT, exception_tree_data TEXT, fact_variant_data TEXT, fsrs_info TEXT,
  figure_status TEXT, created_at TEXT, updated_at TEXT
);
CREATE INDEX idx_items_topic ON items(topic_id, item_type, status);
CREATE INDEX idx_items_pair  ON items(confusion_pair_id);
CREATE INDEX idx_items_cluster ON items(cluster_id);

CREATE TABLE activity_attempts (
  id TEXT PRIMARY KEY, item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  session_id TEXT, activity_type TEXT, user_response TEXT,
  generated_answer_before_options TEXT, selected_option TEXT, reasoning_response TEXT,
  confidence INTEGER CHECK(confidence BETWEEN 0 AND 3), correct INTEGER NOT NULL,
  used_hint INTEGER DEFAULT 0, hints_revealed TEXT, error_type_code TEXT,
  trap_selected_by_user TEXT, time_to_generate_ms INTEGER, time_to_answer_ms INTEGER,
  was_interleaved INTEGER DEFAULT 0, was_timed INTEGER DEFAULT 0,
  format_version INTEGER, created_at TEXT NOT NULL
);
CREATE INDEX idx_attempts_item ON activity_attempts(item_id, created_at);

CREATE TABLE review_schedules (
  id TEXT PRIMARY KEY, item_id TEXT UNIQUE NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  state TEXT DEFAULT 'new', due_date TEXT NOT NULL, interval_days INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5, stability REAL DEFAULT 1.0, difficulty REAL DEFAULT 5.0,
  lapses INTEGER DEFAULT 0, consecutive_correct_sessions INTEGER DEFAULT 0,
  formats_completed TEXT /* JSON ItemType[] */, last_confidence INTEGER,
  last_error_type TEXT, priority_score REAL DEFAULT 10,
  graduated_at TEXT, suspended_reason TEXT
);
CREATE INDEX idx_sched_due ON review_schedules(due_date, state);

CREATE TABLE error_logs (
  id TEXT PRIMARY KEY, attempt_id TEXT, item_id TEXT NOT NULL, topic_id TEXT,
  cluster_id TEXT, confusion_pair_id TEXT, error_type_code TEXT,
  confidence INTEGER, user_explanation TEXT, corrective_rule TEXT, legal_basis TEXT,
  trap_type TEXT, status TEXT DEFAULT 'open', next_review_date TEXT,
  created_at TEXT, updated_at TEXT
);
CREATE INDEX idx_errors_status ON error_logs(status, error_type_code);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY, name TEXT, type TEXT, started_at TEXT, ended_at TEXT,
  item_count INTEGER DEFAULT 0, accuracy REAL, avg_confidence REAL,
  calibration_delta REAL, notes TEXT
);
CREATE TABLE saved_session_state (id TEXT PRIMARY KEY, payload TEXT NOT NULL, saved_at TEXT);

CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, type TEXT);
CREATE TABLE item_tags (item_id TEXT REFERENCES items(id) ON DELETE CASCADE, tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY(item_id, tag_id));
CREATE TABLE atom_tags (atom_id TEXT REFERENCES atoms(id) ON DELETE CASCADE, tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY(atom_id, tag_id));

CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT /* JSON */);
```

---

## 5. Verified baseline and constraints

The app is a broad Vite + React + Express + TypeScript local-first application using SQLite. Existing content, activity, analytics, export, and seed surfaces are useful foundations, but prior implementation notes are historical evidence—not proof of acceptance. The current plan treats behavior and data integrity as the source of truth.

Confirmed in this work session:

- `npm run lint` passes after the boot fix.
- `tests/persistence.test.ts` passes 2/2 using a child-process probe and an isolated `OPOSILAB_DATA_DIR`; the live `data/oposilab.db` is not used.
- `server/db.ts:112-190` now performs a full seed only when both topics and items are empty; existing data follows the additive merge path.
- P2 complete: the full suite (58 tests *en esa revisión*; hoy **210** — ver §1.9) runs green in isolated temp databases with `OPOSILAB_OFFLINE=1` (no AI/Jev network); md5 of the live `data/oposilab.db` is unchanged across `npm test`. Two isolation bugs were found and fixed en route: (1) `server/db.ts` captured its DB path at import time, defeating env overrides, and (2) `server/db.ts` ran `db.init()` at module scope, seeding the default-path DB on mere import. Both are regression-guarded (P2.3) and the module now auto-initializes lazily on first access via a Proxy.
- Deferred with their fixes: replacing inline scorer/SRS test reimplementations lands with the P4 production scorers; due-filter, daily-limit, and seed-integrity assertions land with the P3/P5 fixes they verify (kept green intentionally).

Global constraints:

- Keep the existing Vite/React/Express/TypeScript stack; do not migrate to Next.js or Drizzle during this plan.
- Keep the product local-first and do not add full mock exams.
- AI and heuristic content remains draft until human validation.
- Security work is explicitly deferred by user decision; it is not an acceptance gate for this iteration.
- Every phase must finish with a focused test, `npm run lint`, and a clean diff review.

---

## 6. Active roadmap

### P1 — Preserve user data across restarts ✅ DONE

**Files:**
- `server/db.ts:112-190`
- `tests/persistence.test.ts`
- `tests/fixtures/restart-probe.ts`

**Done:**
- Remove the duplicated destructive `seedInitialData()` branches.
- Seed fully only on a genuinely empty database.
- Preserve existing topics, items, attempts, error logs, settings, sessions, and review schedules.
- Verify a second boot in an isolated temporary database.

**Verification:**
- `npx tsx --test tests/persistence.test.ts`
- `npm run lint`

### P2 — Isolate and strengthen the test harness ✅ DONE (isolation scope)

**Files:**
- `package.json:6-13`
- `tests/*.test.ts`
- `tests/helpers/isolation.ts`
- `server/db.ts` (lazy paths + lazy auto-init)
- `server/ai.ts`, `server/jev.ts` (`OPOSILAB_OFFLINE` guard)

**Done:**
- Every suite now runs against a fresh temp `OPOSILAB_DATA_DIR`; verified by md5-checksumming the live DB across a full `npm test` run.
- `server/db.ts` resolves its DB path lazily and no longer runs `db.init()` at module scope (the import-time seeding bug is guarded by test P2.3).
- AI/Jev clients honor `OPOSILAB_OFFLINE=1` and use deterministic local fallbacks; no test can spend network credits.
- Full suite green: 58 tests / 11 suites *(rev 2026-09; hoy 210/40 — ver §1.9)*.

**Verification:**
- `npm test` (live `data/oposilab.db` md5 unchanged before/after)
- `npm run lint`

**Deferred into P3/P4/P5 (with their fixes, to keep the suite green):**
- Replacing inline cloze/scorer/quadrant/streak test reimplementations with production-function calls (P4 scorers).
- Due-date filtering, daily new-item limit, and seed-integrity assertions (P3/P5).

### P3 — Enforce content validation and seed integrity

**Files:**
- `server/scheduler.ts:149-337`
- `server/db.ts` item/schedule creation and status transitions
- `src/components/ItemBank.tsx`
- `src/components/ContentStudio.tsx`
- `src/utils/learningDesignValidator.ts`
- `server/seedData.ts`
- `server/seedDataRetrieval.ts`

**Work:**
- Restrict practice queues to eligible validated/active content; exclude draft, needs-review, and retired items.
- Make validation quality-gated and preserve explicit human approval.
- Add topic, source-chunk, status, and provenance links to seed atoms/clusters/pairs.
- Repair broken seed references and remove predictable correct-option patterns.
- Keep all seed items draft until validated, with a small explicitly validated demo set only if needed.

**Acceptance:**
- A draft AI item cannot appear in due, pretest, repair, or interleaved practice.
- Topic-specific content and micro-lessons find their linked atoms, clusters, and pairs.
- Seed audits verify counts, links, status, option balance, and distractor metadata.

**Completed slices:**

- ✅ **P3-a — práctica solo con contenido elegible + reconciliación de seeds intactos:** predicado
  compartido `isPracticeEligible` aplicado en las colas SRS/intercalado (`server/scheduler.ts`) y en
  los pools de cliente (`src/utils/practicePools.ts`, `src/utils/sniperFilter.ts`); metadatos de seeds
  sin intentos se reconcilian al arrancar (`server/db.ts`). Evidencia:
  `tests/eligibility.test.ts` E1–E4, `tests/seed-reconcile.test.ts` R1–R4,
  `tests/practice-pools.test.ts` P1–P6.
- ✅ **P3-b — integridad de opciones/seeds del alcance auditado:** rebalanceo posicional determinista
  (ciclo A/B/D/C) preservando IDs estables, orden de opciones por encuentro con etiquetas posicionales,
  diagnóstico pedagógico del banco completo en el endpoint de avisos y `figure_status` verificado
  contra BOE. Evidencia: `tests/option-order.test.ts` O1–O5, `tests/seed-integrity.test.ts` F1–F7,
  `tests/validation-warnings.test.ts` V1–V4.
- ✅ **P3-c — puerta de calidad de validación y resolución de referencias de seeds:**
  puerta estricta en `POST/PUT /api/items` que responde 422 si se intenta promocionar un ítem a
  `validated` o `active` con avisos críticos (sin base legal, sin opción correcta, opciones duplicadas
  o insuficientes); bloqueo y aviso visual en `ItemBank.tsx`; reparación de referencias de seeds
  (reorientación de `cluster_ce_antecedentes` a `cluster_ce_historia_antecedentes`; definición de
  `pair_carencia_cotizacion` y `pair_beneficios_parto` en Tema 7); normalización de `topic_id`,
  `difficulty` y `status` en átomos legacy; soporte de `diff` en el mapper SQLite. Evidencia:
  `tests/validation-gate.test.ts` W1–W7, `tests/seed-integrity.test.ts` F8–F10.

**Status de P3:** ✅ COMPLETO.

### P4 — Correct the core activity loop ✅ DONE (2026-10-26)

**Files:**
- `src/scoring/evaluateItem.ts`
- `src/components/ActivityRunner.tsx`
- `src/components/ItemBank.tsx`
- `src/types.ts`
- Activity-specific tests under `tests/`

**Work:**
- Score cover-and-generate free-text answers and classify lucky recognition, recognition failure, and confident-wrong states.
- Implement per-blank cloze state, exact/synonym acceptance, and near-miss diagnostics.
- Normalize contrast-card fields and render the cue/table/mini-case consistently.
- Add answer controls for retrieval and pretest items.
- Complete spot-error correction matching, two-tier quadrants, exception-tree routing, fact-variant sequences, and number-sort variants.

**Acceptance:**
- Production scorers cover every required item type.
- Feedback distinguishes exact, near-miss, lucky, fragile, and misconception outcomes.
- Activity tests exercise the same functions used by the UI.

**Verificación (2026-11-03):** `src/scoring/evaluateItem.ts` cubre los 10 `ItemType`; la evaluación de estado cognitivo, near-miss, cuadrantes two-tier, retrieval y spot-guard está implementada (commit `353a42b`). Evidencia: `tests/non-mcq-evaluation.test.ts`, `tests/scorer-hardening.test.ts`, `tests/oposilab.test.ts` (5–7), `src/utils/retrievalMatch.ts`. `npm test` 210/210; lint limpio.

### P5 — Complete SRS, interleaving, errors, and repair ✅ DONE (2026-10-26)

**Files:**
- `server/scheduler.ts`
- `server/db.ts:506-623`
- `src/components/ErrorRepairStudio.tsx`
- `src/components/ActivityRunner.tsx`
- `tests/oposilab.test.ts` and new focused engine tests

**Work:**
- Filter future-due schedules and enforce new-item limits.
- Require real distinct successful sessions, formats, and interleaved retrieval for graduation.
- Implement maintenance state and overdue prioritization.
- Enforce interleaving toggles, topic mix, confusion-pair partners, format diversity, and the two-cluster consecutive limit.
- Auto-log low-confidence correct attempts and generated/selection mismatches.
- Route E1–E20 errors to their prescribed repair activities and block graduation while critical confident-wrong errors remain unresolved.

**Acceptance:**
- Due queues never present future items.
- Graduation is reachable through actual UI activity formats, not synthetic test inputs.
- Error status transitions and repair completion are persisted and tested.
- Verificación P5 (actualizada 2026-11-03): `npm run lint` limpio, `npm test` 210/210 en 40 suites, WP1–WP6 implementados (filtro de vencidos/tope de nuevos en `getDueQueue`, bloqueo de graduación en `confident-wrong` abierto del mismo ítem, auto-log de aciertos con baja confianza sin cambio de programación, enrutamiento de reparación E1–E9 vía `src/utils/repairRouting.ts`).

### P6 — Finish import/export, UX, and evidence ✅ DONE (import/export 2026-10-27 · UX 2026-11-03)

**Files:**
- `server/exporter.ts`
- `server.ts` import/export routes
- `src/components/ExportSettingsMethodModal.tsx`
- `src/components/ContentStudio.tsx`
- `docs/ACCEPTANCE.md`
- `README.md`
- `examples/`

**Work:**
- Add working JSON/CSV item import with validation and duplicate reporting.
- Align Anki/Quizlet/CSV field layouts with the specification.
- Complete remaining accessibility, empty-state, and error-state work without adding a mock-exam module.
- Replace unverified acceptance claims with test or manual evidence.

**Acceptance:**
- Import/export round trips preserve item IDs, links, status, and feedback metadata.
- A browser smoke flow covers import → validate → practice → feedback → restart persistence.
- `npm run lint`, `npm test`, and `npm run build` pass from a clean checkout.
- Verificación P6 (actualizada 2026-11-03): import JSON/CSV de ítems implementado en `POST /api/import/items` (`server/importItems.ts` + `makeImportItemsHandler`) con validación por ítem (`itemInput`), detección de duplicados (id o stem+tema) y reporte de errores; 4 pruebas en `tests/oposilab.test.ts` (15, 15b, 15c, 15d). Pasada UX/accesibilidad en §1.9. `npm run lint` limpio, `npm test` **210/210 en 40 suites**, `npm run build` OK.

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Existing tests mutate the live database | Make `OPOSILAB_DATA_DIR` isolation a prerequisite for every suite. |
| Additive seed merge masks incomplete legacy data | Add explicit seed-integrity checks before accepting seed counts as complete. |
| UI practice diverges from scheduler eligibility | Centralize eligibility filtering and test every queue path. |
| Activity runners pass tests without matching runtime behavior | Test production scorers and add a browser smoke path. |
| Scope expands into a generic quiz or full mock exam | Keep the cognitive-training scope and §5 non-goals in the acceptance checklist. |

## 8. Deferred and explicit non-goals

**Deferred by user decision:** server network hardening, CORS/bind changes, authentication, and credential cleanup. These are not part of the current acceptance gate, but remain a later maintenance concern.

**Non-goals:** no full mock exams, leaderboards, cloud-account dependency, payments, mobile-native app, or black-box AI content without human validation.

**Execution order:** P1 → P2 → P3 → P4 → P5 → P6 — all complete as of 2026-11-03. Future work should keep the app runnable and the working tree reviewable after each change.
