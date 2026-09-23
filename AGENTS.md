You are a senior full-stack engineer, instructional designer, psychometrician, and Spanish administrative-law study-tool architect.

Your job is to build me a local-first, free, open-source “super tool” for preparing for a Spanish oposición multiple-choice exam, specifically Seguridad Social, based on the learning-science principles and activity types described below.

The tool must NOT be a generic quiz app. It must be a cognitive training system for MCQ discrimination, retrieval, spacing, interleaving, distractor analysis, error repair, and metacognitive calibration.

IMPORTANT: Do NOT implement full mock exams. Mock exams are explicitly out of scope. Timed micro-drills are allowed, but no full-length simulated exam module.

==================================================
1. MISSION
==================================================

Build a local web application called:

OposiLab MCQ Trainer

Its purpose is to help me study legal/administrative content for a multiple-choice civil service exam by transforming raw topic material into:

- testable atoms
- confusion pairs
- competitive MCQ items
- cloze drills
- contrast cards
- number/deadline sorting drills
- spot-the-error exercises
- two-tier diagnostic items
- exception trees
- fact-variant case labs
- retrieval-first micro-lessons
- diagnostic pretests
- interleaved practice blocks
- spaced successive-relearning queues
- error logs and repair studios
- calibration dashboards

The app should make the following study loop effortless:

1. Import a topic text or PDF.
2. Atomize the content into legal propositions.
3. Identify confusable concepts and numeric clusters.
4. Generate or manually create high-quality MCQ-oriented activities.
5. Practice using evidence-based activity types.
6. Capture errors, confidence, trap types, and confusion pairs.
7. Schedule spaced relearning and interleaved review.
8. Analyze weaknesses and repair them.
9. Export items to Anki or other platforms if needed.

==================================================
2. CONTEXT: WHAT I AM PREPARING FOR
==================================================

I am preparing for a Spanish oposición, specifically Seguridad Social, where the first exam is tipo test / multiple choice.

The content is legal/administrative and includes many high-interference facts:

- deadlines
- amounts
- percentages
- coefficients
- exceptions
- competent bodies
- legal effects
- classifications
- incompatibilities
- responsibility regimes
- benefit types
- contribution periods
- procedural rules

The exam does not reward vague familiarity. It rewards precise discrimination among similar legal propositions.

The tool must therefore train:

- generative retrieval
- micro-discrimination
- response inhibition
- exception detection
- calibrated decision-making

It must help me avoid:

- passive rereading
- highlighting as primary study
- illusion of fluency
- lucky recognition without understanding
- learning distractors as true facts
- blocked study that feels easy but does not transfer
- uncorrected misconceptions

==================================================
3. EVIDENCE-BASED DESIGN PRINCIPLES
==================================================

The app must be built around these principles:

1. Retrieval practice is superior to rereading.
2. Spacing is superior to cramming.
3. Successive relearning is superior to one-time mastery.
4. Interleaving improves discrimination among confusable concepts.
5. MCQs are not passive recognition tests; good MCQs are competitive retrieval and discrimination events.
6. Distractors must be analyzed, not merely avoided.
7. Feedback must be explanatory, not just correct/incorrect.
8. Confidence calibration is essential, especially for exams with penalties.
9. Errors must be classified by type and repaired differently.
10. Legal content must be atomized into testable propositions.
11. Confusion pairs are more important than isolated facts.
12. The system must prevent passive review from becoming the default “study” behavior.
13. All AI-generated legal items must be treated as drafts until human-validated.
14. The tool must be local-first and privacy-respecting.
15. The tool must be usable by a non-programmer.

==================================================
4. PRODUCT SCOPE
==================================================

Build a local-first web application with the following major modules:

A. Dashboard
B. Content Studio
C. Item Bank
D. Activity Runner
E. Error Log / Repair Studio
F. Analytics / Calibration
G. Settings / Export / Import
H. Optional AI Assistant Panel

The app should run locally with minimal setup.

Primary UI language: Spanish.
Codebase language: English.
Content domain: Spanish Seguridad Social law, but architecture must be reusable for other legal/administrative MCQ topics.

==================================================
5. NON-GOALS
==================================================

Do NOT build:

- full mock exam simulator
- leaderboard
- social network
- payment system
- cloud account system
- video conferencing
- proctoring
- mobile-native app
- heavy backend infrastructure
- proprietary paid dependencies
- black-box AI item generation without human review

Timed practice sprints are allowed, but no full mock exam module.

==================================================
6. TECH STACK
==================================================

Use a modern, free, open-source stack. Preferred:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- SQLite via better-sqlite3
- Zod for validation
- Vitest for unit tests
- Playwright optional for E2E tests
- Lucide icons
- Recharts or Chart.js for analytics
- dnd-kit for drag-and-drop activities
- pdf-parse or pdfjs-dist for PDF import, with fallback to pasted text
- optional LLM integration via environment variables, but the app must work without AI

Architecture:

- Local-first.
- Database stored in ./data/oposilab.db.
- No authentication for MVP.
- All data remains on the user’s machine.
- API routes for CRUD.
- Server actions or route handlers for mutations.
- Clean separation between:
  - data layer
  - scheduling engine
  - interleaving engine
  - activity components
  - analytics
  - AI helpers

Provide a README with:

- installation
- startup command
- database initialization
- seed data
- how to import PDF/text
- how to create atoms/items
- how to export to Anki
- how to run tests

==================================================
7. CORE DATA MODEL
==================================================

Design a robust relational schema. At minimum, include these entities:

1. Topic
   - id
   - name
   - description
   - source_file
   - status: draft | active | archived
   - created_at
   - updated_at

2. SourceChunk
   - id
   - topic_id
   - page_number
   - article_reference
   - raw_text
   - summary
   - order_index

3. Atom
   - id
   - topic_id
   - source_chunk_id
   - text
   - atom_type:
       definition | number | deadline | amount | percentage |
       coefficient | condition | exception | competent_body |
       legal_effect | classification | procedure | right | duty
   - legal_basis
   - cluster_id
   - tags
   - difficulty
   - status: draft | validated | deprecated
   - created_at
   - updated_at

4. Cluster
   - id
   - topic_id
   - name
   - description
   - type:
       numeric | conceptual | procedural | institutional |
       exception | classification
   - priority: low | medium | high | critical

5. ConfusionPair
   - id
   - topic_id
   - concept_a
   - concept_b
   - discriminating_cue
   - common_trap
   - legal_basis_a
   - legal_basis_b
   - example_case
   - status: draft | validated
   - severity: low | medium | high | critical

6. Item
   - id
   - topic_id
   - cluster_id
   - confusion_pair_id
   - item_type:
       cover_and_generate_mcq |
       cloze |
       contrast_card |
       number_sort |
       spot_error |
       two_tier |
       exception_tree |
       fact_variant |
       retrieval_prompt |
       pretest_item
   - stem
   - prompt_before_options
   - options JSON
   - correct_answer
   - legal_basis
   - rule_statement
   - why_correct
   - distractor_analysis JSON
   - trap_types JSON
   - corrective_rule
   - condition_if_distractor_correct JSON
   - difficulty
   - cognitive_operation tags:
       generative_retrieval | micro_discrimination |
       response_inhibition | exception_detection |
       calibrated_decision | numeric_precision |
       institutional_discrimination | application
   - status: draft | validated | active | retired
   - source: manual | ai_draft | imported
   - created_at
   - updated_at

7. ActivityAttempt
   - id
   - item_id
   - session_id
   - activity_type
   - user_response
   - generated_answer_before_options
   - selected_option
   - reasoning_response
   - confidence: 0 | 1 | 2 | 3
   - correct: boolean
   - error_type_code
   - trap_selected_by_user
   - time_to_generate_ms
   - time_to_answer_ms
   - was_interleaved
   - was_timed
   - format_version
   - created_at

8. ReviewSchedule
   - id
   - item_id
   - state:
       new | learning | review | graduated | maintenance | suspended
   - due_date
   - interval_days
   - ease_factor
   - stability
   - difficulty
   - lapses
   - consecutive_correct_sessions
   - formats_completed JSON
   - last_confidence
   - last_error_type
   - priority_score
   - graduated_at
   - suspended_reason

9. ErrorLog
   - id
   - attempt_id
   - item_id
   - topic_id
   - cluster_id
   - confusion_pair_id
   - error_type_code
   - confidence
   - user_explanation
   - corrective_rule
   - legal_basis
   - trap_type
   - status:
       open | repairing | repaired | mastered | graduated
   - next_review_date
   - created_at
   - updated_at

10. Session
   - id
   - name
   - type:
       pretest | micro_lesson | cover_generate | cloze |
       contrast | number_sort | spot_error | two_tier |
       exception_tree | fact_variant | interleaved_block |
       repair_session | maintenance
   - started_at
   - ended_at
   - item_count
   - accuracy
   - avg_confidence
   - calibration_delta
   - notes

11. Tag
   - id
   - name
   - type:
       topic | cluster | confusion | trap | legal_basis |
       activity | status | priority

12. ItemTag join table

13. AtomTag join table

14. Settings
   - ai_provider
   - ai_model
   - default_language
   - srs_algorithm
   - graduating_interval
   - max_new_items_per_day
   - confidence_required_for_graduation
   - require_two_formats_for_graduation
   - require_interleaved_success_for_graduation

==================================================
8. CONTENT PIPELINE
==================================================

The app must support a content pipeline from raw legal text to practice-ready items.

Step 1: Import source material.

- Allow upload of PDF.
- Allow paste of raw text.
- Allow import of JSON/CSV.
- If PDF parsing fails, show a clear fallback UI for pasted text.
- Store source chunks with page/article references.

Step 2: Atomization.

Provide a Content Studio screen where I can:

- view source text on the left
- create atoms on the right
- tag atom type
- assign legal basis
- assign cluster
- assign confusion pair
- mark status draft/validated
- search atoms by article, number, concept, trap type

The app should suggest atoms from source text using simple heuristics:

- sentences containing “plazo”, “años”, “meses”, “días”, “porcentaje”, “coeficiente”, “será”, “caducará”, “prescribirá”, “se computará”, “será responsable”, “se entenderá”, “tendrá la consideración”
- numeric patterns
- article references
- exception markers: “salvo”, “excepto”, “no obstante”, “sin perjuicio”
- institutional markers: “INSS”, “TGSS”, “mutua”, “empresario”, “entidad gestora”

Also provide optional AI-assisted atom extraction, but always require human approval.

Step 3: Cluster and confusion-pair mapping.

Allow me to create clusters and confusion pairs.

Examples for Seguridad Social Tema 7:

Clusters:
- prescripcion_caducidad_retroactividad
- automaticidad_absoluta_relativa
- coeficientes_computo_cotizacion
- responsabilidad_empresarial
- capital_coste_anticipo
- revalorizacion_importes_2026
- intangibilidad_embargo_tributacion
- periodos_asimilados_cotizacion

Confusion pairs:
- prescripción vs caducidad
- prescripción vs retroactividad
- caducidad tanto alzado vs caducidad periódicas
- automaticidad absoluta vs relativa
- fijo-discontinuo vs contrato temporal ≤ 5 días
- contrato corto vs tiempo parcial
- recargo por falta de aseguramiento vs recargo por falta de medidas de seguridad y salud
- intangibilidad vs embargabilidad vs exención IRPF
- INSS vs TGSS vs mutua vs empresario
- falta de afiliación/alta vs falta de cotización
- responsabilidad directa vs subsidiaria vs solidaria

The app should visualize confusion pairs and link them to items, atoms, and error logs.

Step 4: Item generation.

Provide item templates for each activity type.

The app should allow:

- manual creation
- AI-assisted drafting
- bulk generation from atoms/confusion pairs
- validation workflow
- duplication
- versioning
- preview
- quality checks

Every MCQ item must include:

- stem
- hidden generated-answer prompt
- options
- correct option
- legal basis
- rule statement
- why correct option is correct
- why each distractor is wrong
- trap type for each distractor
- condition under which each distractor would be correct
- corrective rule
- cluster
- confusion pair
- difficulty
- cognitive operation tags

==================================================
9. ACTIVITY TYPES TO IMPLEMENT
==================================================

Implement the following activity types. Do not implement full mock exams.

--------------------------------------------------
9.1 Diagnostic Pretest
--------------------------------------------------

Purpose:
Activate prior knowledge and reveal gaps before studying a topic.

Features:
- Select 8–15 items from a topic.
- Shuffle order.
- Allow guessing.
- Do not show full explanations immediately.
- At the end, show a diagnostic map:
  - strong clusters
  - weak clusters
  - likely confusion pairs
  - recommended focus areas
- Seed the review queue with weak items.
- Store pretest results for later gain analysis.

UI:
- “Pretest diagnóstico”
- progress bar
- no topic labels during questions
- final diagnostic summary

--------------------------------------------------
9.2 Retrieval-First Micro-Lesson
--------------------------------------------------

Purpose:
Replace passive reading with structured retrieval.

Features:
- Display source chunks in small segments.
- After each chunk, pause and ask:
  - “Escribe la regla de memoria”
  - “¿Qué plazo/importe/órgano aparece?”
  - “¿Qué excepción puede confundirse?”
  - “¿Con qué concepto similar se confunde?”
- Allow free-text answer.
- Reveal correct chunk after response.
- Compare user answer with key atoms using simple keyword/semantic matching.
- Create atoms directly from missed elements.
- Add missed elements to review queue.

UI:
- Reader pane with embedded retrieval prompts.
- “Intenta recordar antes de continuar”
- “Mostrar regla correcta”
- “Crear átoma de error”

--------------------------------------------------
9.3 Cover-and-Generate MCQ
--------------------------------------------------

This is the core MCQ training activity.

Purpose:
Force generative retrieval before recognition/discrimination.

Flow:
1. Show stem only.
2. Hide options.
3. Prompt:
   “Antes de ver las opciones, escribe la regla, plazo, importe, órgano o resultado esperado.”
4. User types answer.
5. User clicks “Revelar opciones”.
6. User selects one option.
7. User rates confidence 0–3.
8. System shows:
   - correct/incorrect
   - legal basis
   - rule
   - why correct option is correct
   - why each distractor is wrong
   - trap type of each distractor
   - condition under which distractor would be correct
   - corrective rule
9. System asks user to classify the trap they fell for, if incorrect.
10. Schedule next review.

Required metadata per option:
- text
- correct boolean
- trap_type
- explanation
- condition_if_correct

Trap types to support:
- numeric_substitution
- partial_rule_accuracy
- conceptual_merger
- temporal_confusion
- wrong_competent_body
- exception_ignored
- overbroad_statement
- hyper_narrow_statement
- factual_misapplication
- true_but_irrelevant
- familiar_wording_trap
- absolute_relative_confusion
- rule_exception_swap
- wrong_start_date
- wrong_legal_object

Validation:
- If generated answer is semantically correct but selected option is wrong, flag as “recognition failure / misreading”.
- If generated answer is wrong but selected option is correct, flag as “lucky recognition”.
- If confidence is 3 and answer is wrong, flag as “confident-wrong misconception”.

--------------------------------------------------
9.4 Cloze / Atomic Recall Drill
--------------------------------------------------

Purpose:
Train precision on numbers, deadlines, institutions, conditions, and exceptions.

Features:
- Support cloze syntax: {{c1::5 años}}, {{c2::hecho causante}}, etc.
- One card per blank for spaced repetition.
- Also support multi-blank integration cards.
- Accept exact match and configured synonyms.
- Show near-miss feedback:
  - if user writes “5 meses” instead of “5 años”, flag numeric confusion
  - if user writes “notificación” instead of “hecho causante”, flag temporal confusion
- Link cloze cards to atoms and confusion pairs.
- Allow cloze with dropdown options for bridge to MCQ discrimination.

Example:
“El derecho al reconocimiento de las prestaciones prescribirá a los {{c1::5 años}}, contados desde el día siguiente a aquel en que tenga lugar el {{c2::hecho causante}}, sin perjuicio de que los efectos se produzcan a partir de los {{c3::3 meses}} anteriores a la fecha en que se presente la correspondiente solicitud.”

--------------------------------------------------
9.5 Contrast Card / Discrimination Matrix
--------------------------------------------------

Purpose:
Train micro-discrimination between confusable concepts.

Features:
- Side-by-side display of Concept A and Concept B.
- Prompt: “¿Qué criterio distingue A de B?”
- User types or selects discriminating cue.
- Reveal full contrast table.
- Include:
  - legal object
  - deadline
  - start date
  - exception
  - competent body
  - legal effect
  - common trap
  - mini-case
- Support multiple interaction modes:
  1. Identify difference
  2. Apply to facts
  3. Spot merger
  4. Complete table
  5. Flip card
- Link to confusion pair registry.
- Schedule repeated contrast practice under interleaving.

Example required:
Prescripción vs Caducidad.

Prescripción:
- objeto: derecho al reconocimiento
- plazo: 5 años
- inicio: día siguiente al hecho causante
- base: art. 53 TRLGSS

Caducidad:
- objeto: derecho al percibo
- plazo: 1 año
- inicio:
  - tanto alzado: día siguiente a la notificación del reconocimiento
  - periódicas: vencimiento de cada mensualidad
- base: art. 54 TRLGSS

Common trap:
- aplicar 5 años al cobro
- aplicar 1 año al reconocimiento
- confundir hecho causante con notificación

--------------------------------------------------
9.6 Number / Deadline Sorting Drill
--------------------------------------------------

Purpose:
Reduce interference among numbers, deadlines, amounts, percentages, and coefficients.

Features:
- Drag-and-drop matching:
  - concept → number
  - number → bucket
  - item → category
- Timed sprint mode optional.
- Error feedback must show the correct rule and the confusion partner.
- Support variants:
  1. Match concept to number
  2. Sort numbers into buckets
  3. Find the intruder
  4. Order by magnitude
  5. Complete a grid
  6. Error-only drill from personal weak numbers
- Store numeric confusion matrix.

Required Tema 7 number clusters:

Prescripción / caducidad / retroactividad:
- prescripción reconocimiento: 5 años
- caducidad percibo: 1 año
- retroactividad efectos reconocimiento: 3 meses
- retroactividad revisión: 3 meses
- invitación al pago: 30 días naturales

Coeficientes / cómputo:
- fijo-discontinuo: 1,5
- contrato temporal ≤ 5 días: 1,4
- parto simple reducción madres: 112 días
- parto múltiple desde segundo hijo: +14 días por hijo

Importes / revalorización 2026:
- revalorización contributiva: 2,7%
- pensiones no contributivas jubilación/incapacidad: 8.803,20 €/año
- límite ingresos complementos por mínimos sin cónyuge: 9.442,00 €/año
- límite ingresos complementos por mínimos con cónyuge: 11.013,00 €/año
- máximo pensiones mensuales 2026 hasta aprobación PGE: 3.359,60 €/mes
- máximo pensiones anuales 2026 hasta aprobación PGE: 47.034,40 €/año
- anticipo límite: 2,5 veces IPREM

Embargo escala:
- 30% hasta doble SMI
- 50% hasta tercer SMI
- 60% hasta cuarto SMI
- 75% hasta quinto SMI
- 90% al exceso

--------------------------------------------------
9.7 Spot-the-Error / False-Statement Repair
--------------------------------------------------

Purpose:
Train response inhibition and detection of subtly false legal statements.

Features:
- Present a statement containing one or more errors.
- User must:
  1. mark true/false
  2. click/select the erroneous phrase
  3. type correction
- Support error levels:
  1. wrong number
  2. wrong start date
  3. wrong institution
  4. missing exception
  5. overbroad quantifier
  6. conceptual merger
  7. true but irrelevant
  8. factual misapplication
- Provide feedback explaining why the statement is false and what rule is correct.
- Link to confusion pair and trap type.
- Add errors to error log.

Example:
False statement:
“El derecho al percibo de las prestaciones a tanto alzado caducará a los cinco años, contados desde el día siguiente al hecho causante.”

Expected:
- error 1: “cinco años” → should be “un año”
- error 2: “hecho causante” → should be “notificación del reconocimiento”
- trap: conceptual merger prescripción/caducidad + temporal confusion

--------------------------------------------------
9.8 Two-Tier Diagnostic Item
--------------------------------------------------

Purpose:
Distinguish true mastery from lucky recognition.

Structure:
Tier 1: content MCQ.
Tier 2: reasoning justification.

Tier 2 can be:
- multiple-choice reasoning options
- free-text justification
- both

Quadrants:
1. Correct answer + correct reasoning = mastery
2. Correct answer + wrong reasoning = lucky guess / fragile model
3. Wrong answer + correct reasoning = misread/application failure
4. Wrong answer + wrong reasoning = misconception

Features:
- Show quadrant after feedback.
- Route each quadrant to different repair action.
- Prioritize “correct answer + wrong reasoning” and “wrong answer + wrong reasoning”.
- Store fragile-knowledge index and misconception index.

Example:
Tier 1:
“El subsidio de incapacidad temporal derivado de contingencias comunes se rige por:
A) Automaticidad absoluta.
B) Automaticidad relativa condicionada al requisito de alta.
C) No está sujeto a automaticidad.
D) Automaticidad absoluta solo si el empresario está al corriente.”

Correct: B.

Tier 2:
“¿Por qué?”
A) Porque requiere estar en alta o asimilado al alta al sobrevenir la contingencia.
B) Porque todas las prestaciones tienen automaticidad absoluta.
C) Porque la IT siempre la paga la mutua.
D) Porque el Decreto de 21 de abril de 1966 solo menciona contingencias profesionales.

Correct reasoning: A.

--------------------------------------------------
9.9 Exception Tree / Conditional Rule Mapper
--------------------------------------------------

Purpose:
Train exception detection.

Features:
- Represent rules as decision trees.
- Nodes:
  - general rule
  - condition
  - exception
  - legal effect
  - competent body
  - deadline
- User tasks:
  1. place exceptions into correct branch
  2. route mini-cases through tree
  3. identify missing condition
  4. detect overbroad/hyper-narrow statements
- Support visual tree editor.
- Support image-based trees later, but MVP can be JSON-based.
- Link nodes to atoms and legal basis.

Required Tema 7 examples:
- Intangibilidad / embargo / tributación exceptions.
- Automaticidad absoluta vs relativa.
- Responsabilidad empresarial by type of breach.
- Capital coste / anticipo inclusions and exclusions.
- Periodos asimilados de cotización.

--------------------------------------------------
9.10 Fact-Variant Case Lab
--------------------------------------------------

Purpose:
Train flexible rule application by changing one fact at a time.

Features:
- Present base case.
- User answers.
- System presents variants changing one fact.
- User predicts whether answer changes and why.
- System reveals correct variant outcome.
- Track:
  - overgeneralization
  - undergeneralization
  - missed cap/limit
  - missed exception
  - wrong institution
  - wrong coefficient
- Link to confusion pairs.

Required Tema 7 example:
Base:
“Trabajador fijo-discontinuo, 200 días en alta. ¿Cuántos días computan?”

Answer:
“200 × 1,5 = 300 días, sin superar días naturales del año.”

Variants:
1. Contrato temporal de 4 días → 4 × 1,4, monthly cap.
2. Contrato a tiempo parcial → 1,4 does not apply.
3. Fijo-discontinuo 250 días → 250 × 1,5 = 375, capped at natural days.
4. Contrato de relevo a tiempo parcial → 1,4 does not apply.

--------------------------------------------------
9.11 Interleaved Mixed Block
--------------------------------------------------

Purpose:
Train discrimination under realistic mixed-topic conditions.

Features:
- Build blocks of 10–30 items.
- No topic labels.
- Mix:
  - current topic
  - recent topics
  - confusion pairs
  - older maintenance items
  - different activity types
- Default composition:
  - 35–45% current topic
  - 25–30% recent topics
  - 15–20% confusion-pair targeted
  - 10% older maintenance
- Constraints:
  - no more than 2 consecutive items from same cluster
  - include both members of a confusion pair when possible
  - mix MCQ, cloze, contrast, spot-error, number sort
  - avoid predictable ordering
- Optional timer per block, but not full mock exam.
- After block, show heat map by cluster, confusion pair, trap type, error type.

--------------------------------------------------
9.12 Successive Relearning Queue
--------------------------------------------------

Purpose:
Convert short-term performance into long-term retention.

Features:
- Implement spaced repetition with criterion-based relearning.
- Use FSRS if a suitable open-source library is available; otherwise implement a simplified SM-2/FSRS-like scheduler.
- Track:
  - due date
  - interval
  - stability
  - difficulty
  - lapses
  - consecutive correct sessions
  - formats completed
  - confidence history
- Graduation criteria:
  - correct on at least 3 separate scheduled reviews
  - completed in at least 2 different activity formats
  - at least 1 successful interleaved retrieval
  - final confidence >= 2
  - no confident-wrong in last 2 reviews
- Lapse behavior:
  - immediate repair
  - reset to shorter interval
  - add to error queue
  - if confident-wrong, set priority critical
- Maintenance:
  - graduated items move to long-interval maintenance queue
  - reviewed every 30–60 days depending on settings

--------------------------------------------------
9.13 Error Log / Repair Studio
--------------------------------------------------

Purpose:
Turn errors into targeted repair work.

Features:
Auto-create error entries from attempts when:
- answer incorrect
- confidence low but correct
- generated answer wrong but option correct
- trap classification failed
- two-tier reasoning wrong
- spot-the-error missed
- number sort confused

Error log fields:
- date
- item
- topic
- cluster
- confusion pair
- my answer
- correct answer
- confidence
- error type
- trap type
- legal basis
- corrective rule
- user-written explanation
- next review
- status
- linked repair activities

Error taxonomy:
E1 Did not know rule
E2 Knew but forgot under pressure
E3 Misread stem
E4 Missed exception/qualifier
E5 Confused two concepts
E6 Wrong number/deadline/amount
E7 Guessed correctly
E8 Confidently wrong
E9 Careless selection
E10 Time pressure
E11 Fell for familiar wording
E12 Changed answer without justification
E13 Generated answer wrong but selected correct option
E14 Generated answer correct but selected wrong option
E15 Wrong legal object
E16 Wrong start date
E17 Wrong competent body
E18 Overbroad statement
E19 Hyper-narrow statement
E20 True but irrelevant

Repair actions by error type:
- E1: create atom + cloze + contrast card
- E2: timed retrieval + interleaved block
- E3: stem-reading protocol + spot-the-error
- E4: exception tree
- E5: contrast card + confusion-pair drill
- E6: number sorting drill
- E7: convert lucky recognition into explicit rule
- E8: priority misconception repair + two-tier item
- E9: answer discipline / review protocol
- E10: pacing sprint
- E11: cover-and-generate + spot-the-error
- E12: first-instinct rule unless new evidence
- E13/E14: generate-before-options training
- E15/E16/E17: legal object/date/body discrimination cards
- E18/E19: overbroad/hyper-narrow detector drills
- E20: relevance discrimination drills

UI:
- “Errores abiertos”
- “Confident-wrong”
- “Fragile knowledge”
- “Reparar hoy”
- “Convertir error en tarjeta”
- “Crear contraste”
- “Crear cloze”
- “Añadir a bloque intercalado”

==================================================
10. CALIBRATION AND METACOGNITION
==================================================

Implement confidence tracking everywhere.

Confidence scale:
0 = puro azar
1 = corazonada débil
2 = probablemente lo sé
3 = seguro

Calibration dashboard:
- When I rate 3, how often am I correct?
- When I rate 2, how often am I correct?
- When I rate 1, how often am I correct?
- When I rate 0, how often am I correct?
- Confident-wrong count by topic/cluster/confusion pair.
- Lucky-correct count.
- Fragile-knowledge index.
- Misconception index.
- Calibration trend over time.

Alerts:
- “Estás sobrecalibrado en automaticidad relativa.”
- “Tus errores más peligrosos están en prescripción/caducidad.”
- “Confundes frecuentemente 1,4 y 1,5.”
- “Muchos aciertos con confianza baja indican reconocimiento afortunado.”

Decision support:
- For low-confidence items, suggest skip/repair rather than guess, but do not build full mock exam strategy.
- For confident-wrong items, force repair before allowing item to graduate.

==================================================
11. ANALYTICS DASHBOARDS
==================================================

Build dashboards for:

1. Readiness snapshot
   - due items
   - new items
   - graduated items
   - maintenance items
   - open errors
   - confident-wrong items
   - weakest clusters
   - calibration score

2. Topic heat map
   - accuracy by topic
   - accuracy by cluster
   - accuracy by confusion pair
   - accuracy by legal basis
   - accuracy by atom type

3. Error analytics
   - error type distribution
   - trap type distribution
   - repeated confusion pairs
   - numeric error matrix
   - institutional confusion matrix
   - temporal confusion matrix

4. Calibration analytics
   - confidence vs accuracy curve
   - confident-wrong list
   - lucky-correct list
   - fragile knowledge list
   - misconception list

5. SRS analytics
   - items due today
   - items overdue
   - graduation rate
   - lapse rate
   - average interval
   - maintenance load
   - predicted forgetting risk

6. Activity effectiveness
   - which activity types improve retention for which clusters
   - cover-and-generate vs cloze vs contrast vs spot-error performance
   - interleaved vs non-interleaved performance, without full mock exam

7. Content quality
   - draft vs validated atoms/items
   - items missing legal basis
   - items missing distractor explanations
   - items with nonfunctional distractors
   - duplicate items
   - items with negative stems
   - items with option-length imbalance

==================================================
12. ITEM QUALITY VALIDATION
==================================================

Implement automated item-quality checks.

For every MCQ item, warn if:
- legal basis missing
- correct answer missing
- fewer than 2 distractors
- more than 4 distractors unless explicitly allowed
- any distractor lacks explanation
- any distractor lacks trap type
- any distractor lacks condition_if_correct
- stem contains “todas”, “ninguna”, “siempre”, “nunca” without justification
- correct option is significantly longer than distractors
- options are not grammatically parallel
- item is marked AI-generated but not human-validated
- item duplicates an existing item
- item tests more than one main decision without clear structure
- negative stem is used without tag
- “todos/ninguna de las anteriores” is used without explicit pedagogical reason

Quality statuses:
- draft
- needs_review
- validated
- active
- retired

Only validated items should enter active practice by default.

==================================================
13. AI ASSISTANT PANEL
==================================================

Include an optional AI assistant panel, but the app must work without it.

The AI assistant can help:

1. Extract atoms from source text.
2. Suggest confusion pairs.
3. Draft cover-and-generate MCQs.
4. Draft cloze sentences.
5. Draft contrast cards.
6. Draft spot-the-error statements.
7. Draft fact-variant cases.
8. Suggest trap types.
9. Explain why a distractor is plausible.
10. Generate corrective rules.
11. Propose repair activities from error logs.

Critical rules:
- AI output is always draft.
- AI must cite source chunk or atom.
- AI must not invent legal facts.
- AI must flag uncertainty.
- Human must validate before item becomes active.
- Store prompt, model, response, and validation status.

Provide built-in prompt templates inside the app, for example:

“From the following legal text, extract atomic propositions. For each atom, identify type, legal basis, possible confusion partner, and likely MCQ trap.”

“Create one cover-and-generate MCQ from this atom. Use only real numbers/concepts from the same topic as distractors. For each distractor, provide trap type, explanation, and condition under which it would be correct.”

“Create a spot-the-error statement that contains exactly one subtle legal error from this atom. Identify the error, correction, trap type, and confusion pair.”

“Create a fact-variant case lab from this rule. Base case plus 4 variants changing one fact each.”

==================================================
14. UI/UX REQUIREMENTS
==================================================

The app should be fast, keyboard-friendly, and distraction-light.

Main screens:

1. Dashboard
   - “Reparar hoy”
   - “Nuevos items”
   - “Repaso espaciado”
   - “Bloque intercalado”
   - “Confusion pairs débiles”
   - “Confident-wrong”
   - “Calibración”
   - “Contenido pendiente de validar”

2. Content Studio
   - source viewer
   - atom creator
   - cluster manager
   - confusion pair manager
   - AI suggestion panel
   - validation workflow

3. Item Bank
   - filters by topic, cluster, confusion pair, item type, trap type, legal basis, status, difficulty
   - bulk actions
   - preview
   - duplicate
   - archive
   - export

4. Activity Runner
   - unified runner for all activity types
   - progress bar
   - confidence input
   - feedback pane
   - distractor analysis pane
   - error logging pane
   - keyboard shortcuts

5. Error Log / Repair Studio
   - open errors
   - confident-wrong
   - fragile knowledge
   - repair queue
   - convert error to new item
   - schedule repair

6. Analytics
   - charts and tables
   - exportable reports

7. Settings
   - SRS parameters
   - AI provider
   - data import/export
   - theme
   - language

Keyboard shortcuts:
- Space: reveal / continue
- 1–4: select option
- 0–3: confidence
- E: log error
- R: repair
- N: new atom
- F: full feedback
- ?: shortcut help

Accessibility:
- Do not use color alone to indicate correct/incorrect.
- Ensure drag-and-drop has keyboard alternative.
- Ensure cloze and spot-the-error are usable with screen readers where possible.
- Provide high-contrast mode.

==================================================
15. SEED CONTENT: SEGURIDAD SOCIAL TEMA 7
==================================================

Use the attached PDF “Diaposiivas Tema 7 SS.pdf” as seed content if available.

If PDF parsing is not possible during development, create a seed JSON file with representative content from Tema 7.

The seed must include at least:

- 50 atoms
- 15 clusters
- 20 confusion pairs
- 100 items across activity types:
  - 25 cover-and-generate MCQs
  - 20 cloze cards
  - 15 contrast cards
  - 10 number-sorting sets
  - 10 spot-the-error items
  - 8 two-tier items
  - 6 exception-tree cases
  - 6 fact-variant labs

Required seed clusters:

1. Revalorización e importes 2026
2. Prescripción, caducidad y retroactividad
3. Intangibilidad, embargo y tributación
4. Automaticidad absoluta y relativa
5. Requisitos generales: alta, asimilada, al corriente, cotización
6. Periodos asimilados y coeficientes de cómputo
7. Responsabilidad empresarial
8. Capital coste y anticipo
9. Contingencias comunes y profesionales
10. Accidente de trabajo y enfermedad profesional

Required seed confusion pairs:

1. Prescripción vs caducidad
2. Prescripción vs retroactividad
3. Caducidad tanto alzado vs caducidad periódicas
4. Automaticidad absoluta vs relativa
5. Fijo-discontinuo vs contrato temporal ≤ 5 días
6. Contrato corto vs tiempo parcial
7. Intangibilidad vs embargabilidad vs exención IRPF
8. Recargo por falta de aseguramiento vs recargo por falta de medidas de seguridad y salud
9. INSS vs TGSS vs mutua vs empresario
10. Falta de afiliación/alta vs falta de cotización
11. Responsabilidad directa vs subsidiaria vs solidaria
12. Hecho causante vs solicitud vs notificación vs vencimiento
13. Prestación contributiva vs no contributiva
14. Prestación económica vs prestación en especie
15. Contingencia común vs contingencia profesional
16. Incapacidad temporal vs incapacidad permanente
17. Complemento por mínimos vs pensión máxima
18. Inembargabilidad hasta SMI vs escala de embargo
19. Aplazamiento como estar al corriente vs incumplimiento de aplazamiento
20. Cotización ingresada fuera de plazo antes del hecho causante vs descubiertos dilatados

Required seed legal bases:
- Art. 2 TRLGSS
- Art. 3 TRLGSS
- Art. 44 TRLGSS
- Art. 47 TRLGSS
- Art. 53 TRLGSS
- Art. 54 TRLGSS
- Art. 57 TRLGSS
- Art. 58 TRLGSS
- Art. 59 TRLGSS
- Art. 62 TRLGSS
- Art. 162 TRLGSS
- Art. 163 TRLGSS
- Art. 165 TRLGSS
- Art. 167 TRLGSS
- Art. 247 TRLGSS
- Art. 249 bis TRLGSS
- Art. 242 TRLGSS
- Art. 244.2 TRLGSS
- Art. 156 RDL 8/2015
- Art. 157 RDL 8/2015
- Decreto 21 de abril de 1966
- Art. 7 Ley 35/2006
- Art. 1973 Código Civil
- Art. 32 ET
- Art. 42 ET
- Art. 16.3 Ley 14/1994
- R.D. 1415/2004, art. 69

The seed should mark all items as draft until validated.

==================================================
16. EXPORT / IMPORT
==================================================

Implement:

1. Export all data to JSON.
2. Import JSON.
3. Export items to CSV.
4. Export to Anki-compatible TSV/CSV.
5. Export plain-text format for Quizlet import.
6. Export error log to CSV.
7. Export analytics summary to CSV/Markdown.

Anki export should include note types:

A. Cover-and-Generate MCQ
Fields:
- Stem
- Generated Answer Prompt
- Options
- Correct Option
- Legal Basis
- Why Correct
- Distractor A Explanation
- Distractor B Explanation
- Distractor C Explanation
- Distractor D Explanation
- Trap Types
- Corrective Rule
- Cluster
- Confusion Pair
- Confidence Required

B. Cloze
Fields:
- Text
- Legal Basis
- Cluster
- Confusion Pair
- Trap Type

C. Contrast Card
Fields:
- Concept A
- Concept B
- Discriminating Cue
- Common Trap
- Legal Basis A
- Legal Basis B
- Mini-case

D. Number Sort
Fields:
- Prompt
- Items
- Answers
- Cluster
- Confusion Pair

E. Spot-the-Error
Fields:
- Statement
- Error Location
- Correction
- Trap Type
- Legal Basis

==================================================
17. SCHEDULING AND INTERLEAVING ALGORITHMS
==================================================

Implement a scheduling engine and an interleaving engine as separate modules.

Scheduling engine:
- Calculate due items.
- Limit new items per day.
- Prioritize:
  1. confident-wrong errors
  2. repeated confusion-pair errors
  3. overdue maintenance items
  4. critical clusters
  5. new items from active topic
- Adjust intervals based on:
  - correctness
  - confidence
  - latency
  - error type
  - trap type
  - whether generated answer was correct
  - whether item was interleaved
  - whether item was in multiple formats

Interleaving engine:
- Given a requested block size, select items.
- Constraints:
  - avoid more than 2 consecutive items from same cluster
  - include confusion-pair partners
  - mix activity types
  - include old maintenance items
  - include current topic items
  - include weak clusters
  - avoid predictable topic order
- Score candidate items by:
  - due urgency
  - weakness
  - confusion-pair severity
  - novelty
  - maintenance need
  - format diversity

Provide a “Generate interleaved block” button with parameters:
- block size
- topic scope
- include new items yes/no
- include maintenance yes/no
- focus confusion pairs yes/no
- time limit optional

==================================================
18. ACCEPTANCE CRITERIA
==================================================

The app is not complete until the following are true:

1. I can start the app locally with one command.
2. The database initializes automatically.
3. I can import a PDF or paste text.
4. I can create topics, source chunks, atoms, clusters, and confusion pairs.
5. I can create or AI-draft all required activity types.
6. I can validate items before they become active.
7. I can run a cover-and-generate MCQ with hidden options, free-text generation, confidence, full distractor feedback, and scheduling.
8. I can run cloze drills with exact/synonym validation and near-miss feedback.
9. I can run contrast cards with discriminating-cue prompts and side-by-side tables.
10. I can run number-sorting drills with drag-and-drop and keyboard alternative.
11. I can run spot-the-error items with clickable error spans and correction.
12. I can run two-tier items and see the four-quadrant interpretation.
13. I can run exception-tree routing exercises.
14. I can run fact-variant case labs.
15. I can generate an interleaved mixed block respecting constraints.
16. The SRS schedules items using successive relearning and graduation criteria.
17. Errors are auto-logged and can be repaired.
18. Confidence calibration is tracked and displayed.
19. Analytics dashboards show weak clusters, confusion pairs, confident-wrong items, and numeric errors.
20. I can export to Anki and CSV.
21. Seed Tema 7 content loads successfully.
22. Unit tests cover scheduling, interleaving, item validation, cloze parsing, and error logging.
23. README explains how to use the app.

==================================================
19. TESTING REQUIREMENTS
==================================================

Write tests for:

1. Atom creation and validation.
2. Cloze parsing:
   - {{c1::...}}
   - multiple clozes
   - synonym acceptance
   - near-miss detection
3. MCQ item validation:
   - missing legal basis
   - missing distractor explanation
   - missing trap type
   - too many/few options
   - duplicate detection
4. Cover-and-generate attempt scoring:
   - generated correct + selected correct
   - generated wrong + selected correct
   - generated correct + selected wrong
   - confidence 3 + wrong = confident-wrong
5. Two-tier quadrant classification.
6. Spot-the-error correction matching.
7. Number-sorting answer validation.
8. SRS scheduling:
   - new item
   - correct review
   - lapse
   - confident-wrong lapse
   - graduation criteria
9. Interleaving:
   - no more than 2 consecutive same cluster
   - includes confusion-pair partners
   - includes maintenance items
10. Error log creation and repair status transitions.
11. Export to Anki CSV/TSV format.
12. Seed data loading.

==================================================
20. IMPLEMENTATION PLAN
==================================================

Work in phases. After each phase, ensure the app runs.

Phase 0: Scaffold
- Initialize Next.js TypeScript app.
- Add Tailwind, shadcn/ui, Drizzle, SQLite.
- Create basic layout and routing.
- Create database schema and migrations.
- Add README.

Phase 1: Data layer
- Implement entities and repositories.
- Implement Zod schemas.
- Implement CRUD API/routes.
- Add seed script structure.

Phase 2: Content Studio
- Source import UI.
- Atom creation UI.
- Cluster and confusion-pair management.
- Validation workflow.
- Search and filters.

Phase 3: Item Bank
- Item creation UI.
- Item templates for all activity types.
- Quality checks.
- Bulk actions.
- Preview.

Phase 4: Core activities MVP
Implement first:
- cover-and-generate MCQ
- cloze
- contrast card
- number sort
- spot-the-error

Phase 5: Advanced activities
Implement:
- two-tier
- exception tree
- fact-variant
- retrieval-first micro-lesson
- diagnostic pretest

Phase 6: SRS and interleaving
- Review schedule engine.
- Successive relearning logic.
- Interleaved block generator.
- Due queue.
- Maintenance queue.

Phase 7: Error log and calibration
- Auto error logging.
- Repair studio.
- Confidence tracking.
- Calibration dashboard.

Phase 8: Analytics
- Heat maps.
- Trends.
- Item quality dashboard.
- Activity effectiveness dashboard.

Phase 9: Export/import
- JSON backup.
- CSV export.
- Anki export.
- Quizlet plain-text export.

Phase 10: Seed Tema 7
- Load required atoms, clusters, confusion pairs, and items.
- Mark items draft until validated.
- Provide sample validated items for key confusion pairs.

Phase 11: Polish
- Keyboard shortcuts.
- Empty states.
- Error states.
- Loading states.
- Accessibility improvements.
- Documentation.

==================================================
21. CODING AGENT BEHAVIOR
==================================================

When implementing:

- Prefer simple, maintainable code over clever abstractions.
- Keep the app local-first.
- Do not require external services for core functionality.
- Do not invent legal content.
- If using AI, always require human validation.
- If a feature is ambiguous, choose the option that better supports MCQ discrimination training.
- If token/context limits are reached, complete the current phase cleanly and tell me exactly what remains.
- After each major phase, provide a short summary of:
  - what was built
  - how to run it
  - what tests pass
  - what remains

==================================================
22. FINAL DELIVERABLES
==================================================

Deliver:

1. A working local web app.
2. Complete source code.
3. Database schema and migrations.
4. Seed data for Seguridad Social Tema 7.
5. README with setup and usage.
6. Tests.
7. Example exported Anki file.
8. Example error log report.
9. A short in-app “Help / Method” page explaining:
   - why cover-and-generate is used
   - why distractors are analyzed
   - why confidence is tracked
   - why interleaving is used
   - why errors are repaired differently
   - why mock exams are intentionally not included in this version

Start by proposing the file structure and database schema, then implement Phase 0 and Phase 1. Do not stop at planning only; build the app incrementally and make it runnable.
