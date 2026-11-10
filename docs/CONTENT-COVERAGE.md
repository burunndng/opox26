# Content coverage — what's audited and what's deferred

Tracks, per topic, which class summaries have been gap-audited against the seed bank and which
content decisions are still deferred. Companion to `docs/ACCEPTANCE.md` (acceptance evidence)
and `implementation_plan.md` §1.3–§1.12 (audit diary). Counts below are from the committed
baseline; after each content batch, refresh the affected row here in the same commit.

## Matrix

| Tema | Fuente (clase/resumen) | Ítems | Última auditoría | Estado |
|---|---|---|---|---|
| Tema 7 (Régimen General) | legacy seed | 100 | — | no recent audit entry |
| Tema 1 (CE) | legacy seed | 13 | — | no recent audit entry |
| Tema 3 específico (afiliación) | clase 9-11 T3&T4 (`ESPECIFICO/Tema 3/resumen gemini.txt`, outside repo) | 61 | 2026-11-10 (§1.12) | auditado |
| Tema 8 específico (IT) | legacy bank, test-guarded (`tema8-bank.test.ts`) | 70 | — | no §1.x gap audit |
| Tema 8 II (IP) | clase 21-10 (§1.3) | 52 | 2026-10-31 | auditado |
| Tema 15 (Ley 40/2015) | clase 28-10 pt1 (§1.4) + gap audit carpeta "Tema 15 general" (§1.14) | 76 | 2026-11-10 (§1.14) | auditado |
| Tema 16 (Ley 39/2015) | clase 28-10 pt2 (§1.5, §1.8) + gap audit carpeta "Tema 15 general" (§1.14) | 69 | 2026-11-10 (§1.14) | auditado |
| Tema 3 General (TC) | clase 26-10 (§1.7) | 24 | 2026-11-03 | auditado (new bank) |
| Tema 9 (nacimiento y cuidado) | clase 4-11 + parte 2 + supuesto (§1.10, §1.11) | 61 | 2026-11-09 | auditado |
| retrieval/pretest | — | 6 | — | n/a |

## Tier B (deferred follow-up batches)

- [ ] **Afiliación indebida + devolución de cuotas** (Tema 3) — strongest follow-up candidate, §1.12
- [ ] Cuotas 28/30 % y MEI, cifras 2027 (Tema 4) — outside Tema 3 scope, §1.12
- [ ] Sucesión solidaria (Tema 5), §1.12
- [ ] Intervalo 9–12 meses de carencia (Tema 9), §1.11 (G15)
- [ ] Tabla RG/TREBEP del §3.6 del resumen parte 2 (Tema 9), §1.11
- [ ] Reconcile professor contradictions: 360/180 days, 50 % wording, SMI figures,
      "Victoria 4× SMI" (Tema 9), §1.11
- [ ] **Firmeza del acto administrativo** (Tema 16) — el test de la academia lo pregunta, pero el
      concepto solo aparece en la Ley 39/2015 dentro del bloque de recursos (art. 122), no en los
      artículos del tema; sin anclaje propio, §1.14
- [ ] **Ámbito subjetivo de la Ley 39/2015** (arts. 1–12) — la clase 28-10 pt2 entra por los
      arts. 13–33; representation, REA y poderes A/B/C quedan fuera de los dos bancos actuales, §1.14
- [ ] **Técnicas de organización del Título III de la Ley 40/2015** (arts. 54–139) y potestad
      sancionadora (arts. 25–52) — otros temas del temario, §1.14

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
