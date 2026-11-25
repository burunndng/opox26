# Content coverage — what's audited and what's deferred

Tracks, per topic, which class summaries have been gap-audited against the seed bank and which
content decisions are still deferred. Companion to `docs/ACCEPTANCE.md` (acceptance evidence)
and `implementation_plan.md` §1.3–§1.15 (audit diary). Counts below are from the committed
baseline; after each content batch, refresh the affected row here in the same commit.

## Matrix

| Tema | Fuente (clase/resumen) | Ítems | Última auditoría | Estado |
|---|---|---|---|---|
| Tema 7 (Régimen General) | legacy seed | 100 | — | no recent audit entry |
| Tema 1 (CE) | legacy seed | 13 | — | no recent audit entry |
| Tema 3 específico (afiliación) | clase 9-11 T3&T4 (`ESPECIFICO/Tema 3/resumen gemini.txt`, outside repo) | 69 | 2026-11-11 (§1.15) | auditado |
| Tema 8 específico (IT) | legacy bank, test-guarded (`tema8-bank.test.ts`) | 70 | — | no §1.x gap audit |
| Tema 8 II (IP) | clase 21-10 (§1.3) | 52 | 2026-10-31 | auditado |
| Tema 15 (Ley 40/2015) | clase 28-10 pt1 (§1.4) + gap audit carpeta "Tema 15 general" (§1.14) | 76 | 2026-11-10 (§1.14) | auditado |
| Tema 16 (Ley 39/2015) | clase 28-10 pt2 (§1.5, §1.8) + gap audit carpeta "Tema 15 general" (§1.14) + fin de vía/firmeza (§1.16) + ámbito subjetivo arts. 1-12 (§1.17) | 77 | 2026-11-19 (§1.17) | auditado |
| Tema 3 General (TC) | clase 26-10 (§1.7) | 24 | 2026-11-03 | auditado (new bank) |
| Tema 9 (nacimiento y cuidado) | clase 4-11 + parte 2 + supuesto (§1.10, §1.11) | 61 | 2026-11-09 | auditado |
| Tema 4 específico (cotización) | clase 16-11 (grupos 473/475) — resumen de transcript + deck + NORMATIVA | 48 | 2026-11-19 | auditado |
| Tema 10 específico (jubilación) | clase 18-11 — transcript + `Diaposiivas tema 10ss.pdf` (resumen en `ESPECIFICO/T10/`) | 50 | 2026-11-20 | auditado (49–50 vs digest Tipos jubilación.md) |
| Tema 4 General (La Corona) | clase 23-11 — resumen de clase + `Resumen T4g (resumen SOLO del pdf).txt` (CE arts. 56–65, RD 1368/1987, RD 434/1988) | 47 | 2026-11-25 (§1.21) | auditado (new bank) |
| retrieval/pretest | — | 6 | — | n/a |

## Tier B (deferred follow-up batches)

- [ ] Revisión de oficio por la TGSS (rectificación de errores materiales en actos de
      encuadramiento) — sin anclaje BOE verificado en el batch de actos indebidos, §1.15
- [ ] Cuotas 28/30 % y MEI, cifras 2027 (Tema 4) — outside Tema 3 scope, §1.12
- [ ] Sucesión solidaria (Tema 5), §1.12
- [x] G15: etiqueta ambigua resuelta (2026-11-19) — «9–12 meses» es el intervalo del lactante
      (art. 183 TRLGSS, BOE-A-2015-11724: cuidado del lactante desde los 9 hasta los 12 meses),
      NO un periodo de carencia. La carencia del subsidio corresponsable se exige por remisión
      (art. 184 TRLGSS: mismos requisitos y términos que la prestación por nacimiento/cuidado,
      art. 178 TRLGSS: <21 sin carencia; 21–<26: 90/180 días; ≥26: 180/360 días). Contenido ya
      cubierto en el banco (cluster_lactante, item-t9-57 y bloque agrupado de carencia). No se
      generan items nuevos: no hay hueco de contenido real. Anclas verificadas: BOE-A-2015-11724
      arts. 183, 184, 178 (consultado 2026-11-19).
- [ ] Matiz del profesor sobre «español de nacimiento» en la tutela testamentaria del Rey menor
      (Tema 4 General, clase 23-11): el art. 60.1 CE exige literalmente «español de nacimiento»;
      la exigencia adicional de mantener actualmente la nacionalidad española no tiene anclaje
      BOE verificado y no se codificó como clave (§7 del resumen, §1.21)
- [x] **Aforamiento de la Familia Real** (Tema 4 General) — el material de clase lo asocia al
      art. 58 CE, que en realidad solo prohíbe asumir funciones constitucionales al consorte
      salvo la Regencia; el aforamiento ante las Salas de lo Civil y de lo Penal del Tribunal
      Supremo se rige por el art. 55 bis LOPJ (LO 6/1985, añadido por LO 4/2014). Corregido en
      `item-t4g-12` y `item-t4g-13` tras verificar el texto consolidado del BOE (2026-11-25).
- [ ] Tabla coeficientes reductores del Deck Tema 10 (7,5 % para 30–34 años) — no coincide con los tramos vigentes del art. 207; suelo 56 para el 45 % e hipótesis del profesor sobre el cálculo del 45 % también diferidos (§7 del resumen Tema 10)
- [ ] Tabla RG/TREBEP del §3.6 del resumen parte 2 (Tema 9), §1.11
- [ ] Reconcile professor contradictions: 360/180 days, 50 % wording, SMI figures,
      "Victoria 4× SMI" (Tema 9), §1.11
- [x] **Firmeza del acto administrativo y fin de vía** (Tema 16) — cerrado en §1.16 con 3 ítems
      (`item-t15-146…148`, BOE-A-2015-10565 arts. 114.1.c/114.2 y 121.1/122.1, fin de vía y
      firmeza por no interponer alzada en plazo). Condición de cierre: contraste literal BOE y
      validación en banco; sin solape con `item-t15-26` ni con recursos de Tema 3.
- [x] **Ámbito subjetivo de la Ley 39/2015** (arts. 1–12) — cerrado en §1.17 con 5 ítems
      (`item-t15-149…153`, BOE-A-2015-10565 arts. 1, 3, 4, 5.3 y 7: objeto, capacidad de
      obrar, concepto de interesado, representación y pluralidad de interesados). Anclas
      verificadas contra el texto consolidado del BOE (consultado 2026-11-19).
- [ ] **Técnicas de organización del Título III de la Ley 40/2015** (arts. 54–139) y potestad
      sancionadora (arts. 25–52) — otros temas del temario, §1.14

### Closed in the Tema 3 actos-indebidos gap audit (§1.15)

- [x] **Afiliación indebida + devolución de cuotas** (Tema 3) — arts. 57–62 RIA: reposición y
      cuotas sin efecto (art. 59.1), devolución salvo ingreso malicioso con tope de 4 años
      (art. 59.2), compra de prestaciones sin devolución, inscripción indebida y derivación a la
      ITSS (art. 57), alta indebida sin régimen vs. con otro régimen (arts. 60.1 vs 60.2),
      variación de datos indebida (art. 62), tarifación con error de la TGSS (art. 58.1) y baja
      indebida con actividad continuada (art. 61.3.º)

### Closed in the "Tema 15 general" gap audit (§1.14)

- [x] Órganos consultivos (art. 7 L40/2015), ausente en los dos bancos
- [x] Decisiones sobre competencia (art. 14 L40/2015), ausente en los dos bancos
- [x] Cifras de abstención: 4.º grado de consanguinidad, 2.º de afinidad, servicios profesionales
      en los dos últimos años (art. 23.2.b y .e)
- [x] Arts. 18 y 19 L40/2015 (actas; régimen de los colegiados de la AGE): sin cobertura en las
      diapositivas ni en el banco — voto dirimente del Presidente, convocatoria con dos días de
      antelación, miembros natos que no pueden abstenerse
- [x] Acto de trámite cualificado (art. 112.1 L39/2015), marcado como "tipo de examen clave" en la
      guía de estudio y ausente del banco
- [x] Límites a la extensión de la nulidad (arts. 49–51 L39/2015) y ejecutividad (art. 38)

## How to maintain this tracker

After each class gap audit: (1) add a `docs/sessions/` diary entry, (2) check off or add Tier B items here and refresh the matrix row, (3) update the §1 "Próximos pasos" pointer in `implementation_plan.md`. Nothing else.
