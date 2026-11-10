# Session — 2026-11-10 Tema 15 general gap audit

- **Objetivo:** Expandir los dos bancos del temario general "Tema 15 general" (acto administrativo,
  validez y órganos) partiendo de la carpeta `GENERAL/Tema  15  general` y las clases 28-10 pt1/pt2.
- **Hecho:** 51 ítems validados authored — 40 de Ley 40/2015 (`item-t15-95…134`, `topic_tema15`) y
  11 de Ley 39/2015 (`item-t15-135…145`, `topic_tema16`) en `server/seedDataTema15Extra.ts`
  (exports `seedItemsTema15Extra` y `seedItemsTema16Extra2`, añadidos al final de `seedItems`);
  nuevo guardián `tests/tema15-bank.test.ts` (B1–B12); bookkeeping sincronizado
  (`seed-reconcile` R1 481→532, README/ACCEPTANCE 526/532). Commiteado en **`19144ff`**
  (`feat(content): 51 Tema 15/16 general gap-audit MCQs`), agrupado con el fix del plugin
  `oposilab-handoff` de la sesión paralela; detalle en `implementation_plan.md` §1.14 y en
  `tests/tema15-bank.test.ts`.
- **Verificado:** `npm run lint` limpio; `npm test` 331/331 en 44 suites; `npm run build` OK.
  Anclas contrastadas contra el texto consolidado del BOE (Ley 40/2015 BOE-A-2015-10566, última
  actualización 02/08/2024; Ley 39/2015 BOE-A-2015-10565, 06/11/2024).
- **Siguiente paso:** Tier B follow-up batch — headliner: **afiliación indebida + devolución de
  cuotas** (Tema 3), `docs/CONTENT-COVERAGE.md` §Tier B; para el bloque general, el ámbito
  subjetivo de la Ley 39/2015 (arts. 1–12).
- **Notas:**
  - Numeración consolidada vigente: **competencia = art. 8 L40/2015** (las diapositivas la rotulan
    "Art. 9") y **delegación = art. 9 L40/2015** (la diapositiva 30 rotula "Art. 9 Ley 39/2015").
    Los ítems usan la numeración consolidada; el banco ya lo hacía desde §1.4.
  - Los arts. **18 y 19 L40/2015** (actas; régimen de los colegiados de la AGE) no están en las
    diapositivas, pero el profesor los declara "materia oficial de examen" (resumen 28-10 pt1).
    De ahí el bloque nuevo de colegiados.
  - `rebalanceCanonicalMcqOptions` (F2) reordena por índice: **añadir siempre al final** de
    `seedItems`; el test propio no gestiona claves a mano.
  - Los ítems heredados de Tema 16 concentran la clave A (28/58 antes de este lote): no se
    rebalancean porque `correct_answer` es el *id* estable de la opción, no su posición; la
    distribución por posición la impone el ciclo canónico global.
