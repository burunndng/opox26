# Session — 2026-11-25 verificación y cierre Tema 4 General (La Corona)

- **Objetivo:** pasada de verificación pre-handoff del banco T4G (registro vivo, claves, distractores, anclajes BOE, cues/prompts).
- **Hecho:** auditoría del lote `item-t4g-1…47` (`topic_constitucion_tema_4`); se confirmaron registro en `seedData.ts`, 8 clústeres/4 pares/24 átomos y append final. Se detectaron y corrigieron 8 `prompt_before_options` con fuga de pista (secuencia, salas nombradas, Alteza/Alteza Real literal, agrupación CM/GR, “cinco categorías”, funcionarios). Commits: `484db9e` (banco + bookkeeping), `059a0ef` (tighten cues).
- **Verificado:** anclajes BOE revalidados (CE 56-65; aforamiento art. 55 bis LOPJ, no 58 CE; RD 1368/1987 arts. 1-5+DT4ª; RD 434/1988 arts. 2,8,9.1,12.2,13.4-5,DA única,13.1 por RD 139/2026 BOE-A-2026-4514). `npm run lint` limpio; `npm test` **395/395 en 52 suites**; `npm run build` OK. Reconcile R1 693 elegibles/0 drafts; doc-freshness 3/3; banco T4G 11/11. Conteos verificados desde HEAD.
- **Siguiente paso:** smoke visual manual en navegador cuando el owner pueda; después reanudar Tier B. Matiz «español de nacimiento» (tutela testamentaria, art. 60.1 CE) sigue diferido sin anclaje BOE.
- **Notas:** sin cambios de producto/datos de estudio; árbol limpio tras el commit de contenido. Cierre docs-only en este commit.
