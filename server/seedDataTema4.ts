/**
 * Seed data for Seguridad Social Tema 4 (Bloque Especifico):
 * "La cotizacion a la Seguridad Social".
 *
 * SOURCE OF TRUTH: the class of 2026-11-16 (groups 473/475) summary produced
 * from the transcript + the professor's `TEMA 4 especi.pdf` deck and
 * `NORMATIVA.pdf`, plus BOE-verified anchors:
 *   - TRLGSS (RDLeg 8/2015): arts. 40 CE, 109, 141-150, 19 bis, 127 bis,
 *     DT 42a (solidaridad), DT 43a (MEI), arts. 144, 146, 147, 152, 153, 249 ter
 *   - Orden PJC/297/2026, de 30 de marzo (BOE-A-2026-7296): bases/topos, tipos
 *   - RD 126/2026 (BOE-A-2026-3815): SMI 2026 (1.221 EUR/mes, 14 pagas)
 *   - RDL 2/2023 (BOE-A-2023-6967): MEI 2023-2050 y solidaridad 2025-2045
 *   - RDL 3/2026 (BOE-A-2026-2548): topes 2026 y tarifa de primas CNAE-2025
 *   - RD 2064/1995: Reglamento General sobre Cotizacion
 *   - RD 84/1996 (RIA): altas/bajas (Remision del test de clase del tema 3)
 *
 * NOTE ON THE CLASS-TEST ITEMS: questions 1-10 of the 2026-11-16 class are the
 * Tema 3 test (afiliacion/altas/bajas), resolved in class. They live in this
 * batch because they were resolved in the Tema 4 session and are anchored to
 * the birth/extinction of the cotizacion obligation; items 39-48 below.
 */

import type {
  Item, MCQOption, TrapType, CognitiveOperation, Topic, Cluster, ConfusionPair,
} from '../src/types.ts';

const TOPIC = 'topic_seguridad_social_tema_4';
const now = '2026-11-19T00:00:00Z';

export const seedTopicTema4: Topic = {
  id: TOPIC,
  name: 'Tema 4 Especifico - La cotizacion a la Seguridad Social',
  description:
    'BLOQUE ESPECIFICO (ES). Sujetos de la cotizacion, caja única, base de cotizacion, ' +
    'tipos (CC/CP, MEI, solidaridad, desempleo/FOGASA/FP), beneficios, dinamica de la ' +
    'obligacion, liquidacion de cuotas, otros supuestos y liquidacion de otras deudas.',
  source_file: 'TEMA 4 especi.pdf',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedClustersTema4: Cluster[] = [
  {
    id: 'cluster_cotizacion_sujetos_caja',
    topic_id: TOPIC,
    name: 'Sujetos de la cotizacion, acreedor y caja unica',
    type: 'institutional',
    priority: 'high',
    description:
      'Empresario como sujeto responsable del pago, TGSS como sujeto acreedor, art. 40 CE ' +
      'y recursos del art. 109 TRLGSS (caja unica).',
  },
  {
    id: 'cluster_base_cotizacion_conceptos',
    topic_id: TOPIC,
    name: 'Base de cotizacion: inclusion, retribuciones en especie y exclusiones',
    type: 'conceptual',
    priority: 'critical',
    description:
      'Remuneracion total (dinero/especie, descanso y vacaciones), coste medio, coste marginal, ' +
      'préstamos a tipo inferior al legal, vivienda/vehiculovaloracion tributaria, locomocion y manutencion.',
  },
  {
    id: 'cluster_tipos_cotizacion',
    topic_id: TOPIC,
    name: 'Tipos de cotizacion: contingencias comunes, profesionales, MEI y solidaridad',
    type: 'numeric',
    priority: 'critical',
    description:
      '28,30% CC; tarifa de primas CNAE-2025; desempleo 7,05/8,30, FOGASA 0,20, FP 0,70; ' +
      'MEI 0,90 (2023-2050) y cotizacion adicional de solidaridad (2025-2045).',
  },
  {
    id: 'cluster_dinamica_obligacion',
    topic_id: TOPIC,
    name: 'Dinamica de la obligacion de cotizar: nacimiento, duracion, extincion y suspension',
    type: 'procedural',
    priority: 'critical',
    description:
      'Inicio de la prestacion (incluido periodo de prueba), situaciones que subsisten, ' +
      'extincion por cese comunicado, actuacion de oficio y suspension por huelga/cierre patronal.',
  },
  {
    id: 'cluster_liquidacion_sistemas',
    topic_id: TOPIC,
    name: 'Liquidacion de cuotas: autoliquidacion, SLD y simplificada',
    type: 'procedural',
    priority: 'critical',
    description:
      'Quien calcula, solicitud de datos, dia natural frente a dia habil y pago; ' +
      'complementarias por prorrateo retroactivo.',
  },
  {
    id: 'cluster_cotizacion_supuestos',
    topic_id: TOPIC,
    name: 'Otros supuestos: pluriempleo, formativos, practicas, jubilacion y coeficientes',
    type: 'exception',
    priority: 'high',
    description:
      'Art. 10 pluriempleo, art. 38 tiempo parcial, art. 46 formativos, art. 47 practicas, ' +
      'art. 28 contratos <30 dias, arts. 152/153 jubilacion, art. 146 coeficientes.',
  },
  {
    id: 'cluster_beneficios_cotizacion',
    topic_id: TOPIC,
    name: 'Beneficios en la cotizacion: reducciones, exenciones y bonificaciones',
    type: 'classification',
    priority: 'high',
    description:
      'Art. 20 TRLGSS; fondos de la SS frente al SEPE; requisitos indispensables.',
  },
  {
    id: 'cluster_otras_deudas_competencias',
    topic_id: TOPIC,
    name: 'Liquidacion de otras deudas y reparto de competencias',
    type: 'institutional',
    priority: 'high',
    description:
      'Capital coste (TGSS), sanciones (ITSS), recargo de prestaciones (INSS) y ' +
      'ayudas a jubilaciones anticipadas (Ministerio/CCAA).',
  },
  {
    id: 'cluster_efectos_altas_bajas',
    topic_id: TOPIC,
    name: 'Efectos de altas y bajas (test de clase del tema 3)',
    type: 'numeric',
    priority: 'critical',
    description:
      'Arts. 32, 35 y 36 RIA: alta previa y 60 dias naturales, alta en plazo/fuera de plazo/de oficio, ' +
      'baja comunicada en plazo y prueba del cese real.',
  },
];

export const seedConfusionPairsTema4: ConfusionPair[] = [
  {
    id: 'pair_cc_vs_cp',
    topic_id: TOPIC,
    concept_a: 'Base de cotizacion por contingencias comunes (BCxCC)',
    concept_b: 'Base de cotizacion por contingencias profesionales (BCxCP)',
    discriminating_cue:
      'BCxCP = BCxCC + horas extraordinarias; la primera excluye las horas extra, la segunda las incluye.',
    common_trap: 'Sumar las horas extra a la BCxCC o afirmar que ambas bases coinciden siempre.',
    legal_basis_a: 'Art. 147 TRLGSS',
    legal_basis_b: 'Art. 148 TRLGSS',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_base_minima_vs_tope',
    topic_id: TOPIC,
    concept_a: 'Base minima / base maxima (contingencias comunes)',
    concept_b: 'Tope minimo / tope maximo (contingencias profesionales)',
    discriminating_cue:
      'Las bases son limites relativos por grupo de cotizacion; los topes son absolutos para todo el sistema.',
    common_trap: 'Aplicar un limite relativo a las contingencias profesionales o viceversa.',
    legal_basis_a: 'Arts. 2 y 3 Orden PJC/297/2026',
    legal_basis_b: 'Art. 148 TRLGSS; arts. 2 y 3 Orden PJC/297/2026',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_retribucion_vs_compensacion_gastos',
    topic_id: TOPIC,
    concept_a: 'Retribucion en especie computable',
    concept_b: 'Asignacion por gastos (locomocion, manutencion y estancia)',
    discriminating_cue:
      'La retribucion se disfruta para fines particulares; la asignacion compensa un gasto adelantado por el trabajador.',
    common_trap: 'Sumar a la base el vehiculo del repartidor o la factura de hotel justificada.',
    legal_basis_a: 'Art. 147 TRLGSS',
    legal_basis_b: 'Art. 147 TRLGSS; art. 28.3 TRLGSS',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_efectos_comunicacion_vs_inicio',
    topic_id: TOPIC,
    concept_a: 'Fecha de efectos del alta en plazo = inicio de la relacion laboral',
    concept_b: 'Fecha de efectos del alta fuera de plazo = fecha de la solicitud',
    discriminating_cue:
      'Solo el alta presentada en tiempo y forma retrotrae efectos al inicio de la prestacion.',
    common_trap: 'Dar efectos desde el inicio de la relacion a un alta presentada fuera de plazo.',
    legal_basis_a: 'Art. 35.1.1 RIA',
    legal_basis_b: 'Art. 35.1.1 RIA (fuera de plazo)',
    severity: 'critical',
    status: 'validated',
  },
];

interface McqSpec {
  id: string;
  cluster_id: string;
  confusion_pair_id?: string;
  stem: string;
  prompt_before_options?: string;
  correct: { text: string; explanation: string };
  distractors: Array<{ text: string; trap_type: TrapType; explanation: string; condition_if_correct: string }>;
  legal_basis: string;
  rule_statement: string;
  corrective_rule: string;
  difficulty: number;
  cognitive_operations: CognitiveOperation[];
  figure_status?: 'BOE_VERIFIED' | 'ESTIMATED_LPGE';
}

function buildMcq(spec: McqSpec): Item {
  const letters = ['A', 'B', 'C', 'D'];
  const options: MCQOption[] = [
    {
      id: letters[0], text: spec.correct.text, is_correct: true,
      trap_type: 'partial_rule_accuracy', explanation: spec.correct.explanation,
      condition_if_correct: 'Correcto con arreglo a la norma vigente.',
    },
    ...spec.distractors.map((d, i) => ({
      id: letters[i + 1], text: d.text, is_correct: false, trap_type: d.trap_type,
      explanation: d.explanation, condition_if_correct: d.condition_if_correct,
    })),
  ];
  return {
    id: spec.id,
    topic_id: TOPIC,
    cluster_id: spec.cluster_id,
    ...(spec.confusion_pair_id ? { confusion_pair_id: spec.confusion_pair_id } : {}),
    item_type: 'cover_and_generate_mcq',
    stem: spec.stem,
    ...(spec.prompt_before_options ? { prompt_before_options: spec.prompt_before_options } : {}),
    options,
    correct_answer: letters[0],
    legal_basis: spec.legal_basis,
    rule_statement: spec.rule_statement,
    why_correct: spec.correct.explanation,
    distractor_analysis: Object.fromEntries(spec.distractors.map((d, i) => [letters[i + 1], d.explanation])),
    trap_types: spec.distractors.map((d) => d.trap_type),
    corrective_rule: spec.corrective_rule,
    difficulty: spec.difficulty,
    cognitive_operations: spec.cognitive_operations,
    status: 'validated',
    source: 'manual',
    ...(spec.figure_status ? { figure_status: spec.figure_status } : {}),
    created_at: now,
    updated_at: now,
  };
}

/** Gap list -> item ids (see docs/CONTENT-COVERAGE.md): see the batch summary. */
export const seedItemsTema4: Item[] = [
  // ---------------------------------------------------------------------
  // 1-3. Sujetos, acreedor y caja unica (pool A)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-1',
    cluster_id: 'cluster_cotizacion_sujetos_caja',
    stem: 'En una deuda de Seguridad Social, tanto en la via voluntaria como en la ejecutiva, el sujeto acreedor es:',
    prompt_before_options: 'Separe siempre al titular del credito del responsable del ingreso.',
    correct: {
      text: 'La Tesoreria General de la Seguridad Social.',
      explanation: 'La TGSS es el sujeto acreedor con independencia de la via de recaudacion; el sujeto deudor varia segun el ambito de la deuda.',
    },
    distractors: [
      { text: 'El empleador responsable del pago.', trap_type: 'conceptual_merger', explanation: 'El empleador es el sujeto responsable del pago, no el acreedor.', condition_if_correct: 'Si se preguntara por el responsable del ingreso.' },
      { text: 'El Instituto Nacional de la Seguridad Social.', trap_type: 'true_but_irrelevant', explanation: 'El INSS es entidad gestora de prestaciones; no es el acreedor de la cuota.', condition_if_correct: 'Si se preguntara por la gestion de prestaciones economicas.' },
      { text: 'La Inspeccion de Trabajo y Seguridad Social.', trap_type: 'wrong_competent_body', explanation: 'La ITSS vigilancia y sanciona; no es titular del credito.', condition_if_correct: 'Si se preguntara por el organo de control.' },
    ],
    legal_basis: 'Arts. 141 y 142 TRLGSS',
    rule_statement: 'La TGSS es el sujeto acreedor en toda deuda de Seguridad Social, en via voluntaria y en via ejecutiva.',
    corrective_rule: 'Acreedor = TGSS; responsable del pago = empresario (en el Regimen General).',
    difficulty: 2,
    cognitive_operations: ['generative_retrieval', 'institutional_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-2',
    cluster_id: 'cluster_cotizacion_sujetos_caja',
    stem: 'Dentro de los recursos de la caja unica del sistema, NO se incluye:',
    prompt_before_options: 'Contraste los cuatro conceptos del articulo 109 TRLGSS.',
    correct: {
      text: 'Las multas por infracciones de trafico.',
      explanation: 'El art. 109 TRLGSS enumera aportaciones del Estado, cuotas, recargos/sanciones de naturaleza social y productos patrimoniales; las multas de trafico son ajenas al sistema.',
    },
    distractors: [
      { text: 'Las aportaciones progresivas del Estado.', trap_type: 'true_but_irrelevant', explanation: 'Son recurso del sistema conforme al art. 109 TRLGSS.', condition_if_correct: 'Si se preguntara por un recurso incluido.' },
      { text: 'Los recargos y sanciones recaudados por la TGSS.', trap_type: 'conceptual_merger', explanation: 'Los recargos y sanciones de naturaleza social si van a la caja unica, aunque los imponga la ITSS.', condition_if_correct: 'Si se preguntara por sanciones de orden social.' },
      { text: 'Los frutos, rentas o intereses de bienes patrimoniales.', trap_type: 'factual_misapplication', explanation: 'Estan expresamente incluidos en el art. 109 TRLGSS.', condition_if_correct: 'Si se preguntara por un recurso incluido.' },
    ],
    legal_basis: 'Art. 109 TRLGSS',
    rule_statement: 'La caja unica se nutre de aportaciones del Estado, cuotas, recargos/sanciones anologas y productos del patrimonio; no de sanciones ajenas al orden social.',
    corrective_rule: 'Mnemotecnia A-C-R-P: Aportaciones, Cuotas, Recargos, Productos patrimoniales.',
    difficulty: 2,
    cognitive_operations: ['generative_retrieval', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-3',
    cluster_id: 'cluster_cotizacion_sujetos_caja',
    stem: 'Un empresario que NO entrega el EPI al trabajador soporta la prestacion por su mal hacer y ademas una sancion. Ambas cantidades:',
    prompt_before_options: 'Piense en el destino de lo recaudado, no en quien impone la sancion.',
    correct: {
      text: 'Son recursos del sistema y se recaudan por la TGSS.',
      explanation: 'Tanto el recargo/prestacion por el mal hacer como la sancion por falta de prevencion son recurso del sistema; la TGSS recauda las sanciones impuestas por la ITSS.',
    },
    distractors: [
      { text: 'Van a la caja general de impuestos.', trap_type: 'factual_misapplication', explanation: 'Pertenece al ambito social, no a la caja general de impuestos.', condition_if_correct: 'Si se tratara de un tributo no social.' },
      { text: 'Las recauda exclusivamente la Inspeccion de Trabajo.', trap_type: 'wrong_competent_body', explanation: 'La ITSS impone la sancion, pero en la practica la recauda la TGSS.', condition_if_correct: 'Si se preguntara por quien impone la sancion.' },
      { text: 'Solo la sancion es recurso del sistema.', trap_type: 'partial_rule_accuracy', explanation: 'Tambien lo es la prestacion económica financiada por el empresario.', condition_if_correct: 'Si solo hubiera sancion y no prestacion.' },
    ],
    legal_basis: 'Art. 109 TRLGSS; LISOS',
    rule_statement: 'Recargos, sanciones y cantidades análogas del orden social son recursos de la caja unica recaudados por la TGSS.',
    corrective_rule: 'Impone la ITSS, recauda la TGSS, destino caja unica.',
    difficulty: 3,
    cognitive_operations: ['institutional_discrimination', 'application'],
  }),
  // ---------------------------------------------------------------------
  // 4-6. Formula de la cuota y bases normalizadas (pool A)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-4',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'La cuota de Seguridad Social se calcula aplicando la siguiente operacion:',
    prompt_before_options: 'Recuerde que los beneficios solo se descuentan si proceden.',
    correct: {
      text: 'Base por tipos menos bonificaciones (si aplica).',
      explanation: 'La cuota es base de cotizacion por tipos de cotizacion, menos las bonificaciones o deducciones que procedan.',
    },
    distractors: [
      { text: 'Base x tipos + recargos por mora.', trap_type: 'conceptual_merger', explanation: 'Los recargos no forman parte de la formula de la cuota ordinaria.', condition_if_correct: 'Si se liquidara una deuda en via ejecutiva.' },
      { text: 'Salario bruto x tipos, sin deducciones.', trap_type: 'partial_rule_accuracy', explanation: 'Se parte de la base de cotizacion, no necesariamente del salario bruto, y se restan los beneficios.', condition_if_correct: 'Si la base coincidiera con el bruto y no hubiera beneficios.' },
      { text: 'Base minima x tipos, con independencia de la retribucion.', trap_type: 'factual_misapplication', explanation: 'Se aplica la base efectiva dentro de los limites, no siempre la minima.', condition_if_correct: 'Si la retribucion no alcanzara la base minima.' },
    ],
    legal_basis: 'Arts. 141 y 147 TRLGSS; arts. 18 y 19 TRLGSS',
    rule_statement: 'Cuota SS = base de cotizacion x tipos - bonificaciones/deducciones procedentes.',
    corrective_rule: 'Base por tipo; restar solo si hay beneficio aplicable.',
    difficulty: 2,
    cognitive_operations: ['generative_retrieval'],
  }),
  buildMcq({
    id: 'item-t4-5',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'En el ejemplo del pescador de faen en Malaga con palangre de superficie y grupo 1, la base de cotizacion aplicable:',
    prompt_before_options: 'Distinga entre una base fijada por el legislador y una base calculada.',
    correct: {
      text: 'La fija la orden de cotizacion; no memorizar.',
      explanation: 'Es una base normalizada: la fija previamente el legislador atendiendo a ambito geografico, funciones y grupo de cotizacion, y cambia anualmente.',
    },
    distractors: [
      { text: 'Se calcula sumando todos los complementos del mes.', trap_type: 'conceptual_merger', explanation: 'Eso corresponde a la remuneración variable, no a la base normalizada.', condition_if_correct: 'Si se tratara del Regimen General.' },
      { text: 'Es la base minima del grupo 7 en todo caso.', trap_type: 'true_but_irrelevant', explanation: 'El grupo indicado en el ejemplo es el 1 y la cuantía la da la orden.', condition_if_correct: 'Si el trabajador estuviera en el grupo 7.' },
      { text: 'Se obtiene del valor catastral de la vivienda.', trap_type: 'factual_misapplication', explanation: 'El valor catastral sirve para valorar retribuciones en especie, no la base del mar.', condition_if_correct: 'Si se valorara la vivienda.' },
    ],
    legal_basis: 'Art. 147 TRLGSS; Orden PJC/297/2026',
    rule_statement: 'Las bases normalizadas son fijadas previamente por el legislador para colectivos concretos y se actualizan anualmente.',
    corrective_rule: 'Normalizada = la dice la orden; variable = se calcula concepto por concepto.',
    difficulty: 2,
    cognitive_operations: ['generative_retrieval'],
  }),
  buildMcq({
    id: 'item-t4-6',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'La regla general de inclusion en la base de cotizacion comprende la remuneracion total percibida por el desempeno por cuenta ajena. Se incluyen expresamente:',
    prompt_before_options: 'No olvide los periodos de descanso y vacaciones.',
    correct: {
      text: 'Los tiempos de descanso y vacaciones.',
      explanation: 'El art. 147 TRLGSS incluye los tiempos de descanso y vacaciones en la remuneracion computable.',
    },
    distractors: [
      { text: 'Solo las percepciones en dinero, con exclusion de la especie.', trap_type: 'overbroad_statement', explanation: 'Se incluyen percepciones en dinero y en especie.', condition_if_correct: 'Si se tratara exclusivamente del SMI.' },
      { text: 'Unicamente el salario base del contrato.', trap_type: 'hyper_narrow_statement', explanation: 'Se computan todos los conceptos retributivos, no solo el salario base.', condition_if_correct: 'Si no existieran complementos.' },
      { text: 'Las vacaciones solo si se disfrutan dentro del año.', trap_type: 'temporal_confusion', explanation: 'El devengo del derecho a vacaciones genera cotizacion aunque el disfrute se produce despues.', condition_if_correct: 'Si se preguntara por el disfrute material.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'La base comprende la remuneracion total, en dinero o en especie, incluidos descanso y vacaciones.',
    corrective_rule: 'Todo lo que tenga naturaleza retributiva se suma a la base.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'exception_detection'],
  }),
  // ---------------------------------------------------------------------
  // 7-13. Reglas temporales y conceptos computables (pool B)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-7',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Una paga extra de 1.200 EUR se abona en diciembre. Como regla general, su imputacion a la base de cotizacion:',
    prompt_before_options: 'Piense en el devengo, no en el momento del cobro.',
    correct: {
      text: 'Se prorratea en los doce meses.',
      explanation: 'Las percepciones de vencimiento superior al mensual se prorratean a lo largo de los doce meses del año.',
    },
    distractors: [
      { text: 'Se imputa integramente al mes de diciembre.', trap_type: 'wrong_start_date', explanation: 'Eso duplicaria artificialmente la base del mes de pago.', condition_if_correct: 'Si se Permitiera la imputacion al pago.' },
      { text: 'Se imputa al mes siguiente al del pago.', trap_type: 'temporal_confusion', explanation: 'El mes siguiente se usa para las liquidaciones complementarias de cantidades retroactivas.', condition_if_correct: 'Si la cuantía no se conociera de antemano.' },
      { text: 'No computa hasta que se disfruta.', trap_type: 'factual_misapplication', explanation: 'La paga extra es retribucion devengada y computable.', condition_if_correct: 'Si se tratara de vacaciones no disfrutadas.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las percepciones de vencimiento superior al mensual se prorratean en los doce meses del año.',
    corrective_rule: 'Paga extra = prorrateo anual.',
    difficulty: 2,
    cognitive_operations: ['application', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-8',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un complemento de productividad se paga en mayo, pero se genero durante los seis meses anteriores. La actuacion correcta es:',
    prompt_before_options: 'Distinga entre el pago material y el periodo de generacion.',
    correct: {
      text: 'Liquidacion complementaria separada en cada uno de esos meses.',
      explanation: 'El abono retroactivo se imputa a los meses en que se genero, mediante liquidacion complementaria separada, sin intereses ni recargos.',
    },
    distractors: [
      { text: 'Incluir el importe integro en la base de mayo.', trap_type: 'temporal_confusion', explanation: 'La base de mayo no varia: se imputa al periodo de generacion.', condition_if_correct: 'Si el plus se pagara en el mes devengado.' },
      { text: 'Liquidacion complementaria de los doce meses del ejercicio.', trap_type: 'numeric_substitution', explanation: 'Solo se liquidan los meses en que se genero el plus, en el ejemplo seis.', condition_if_correct: 'Si se generara durante todo el año.' },
      { text: 'Liquidacion complementaria con intereses de demora.', trap_type: 'factual_misapplication', explanation: 'No hay intereses ni recargos: no se hace nada fuera de la legalidad.', condition_if_correct: 'Si se presentara fuera de plazo reglamentario.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Los salarios de abono retroactivo se liquidan separadamente en cada mes al que correspondan, sin intereses ni recargos.',
    corrective_rule: 'Retroactivo = una complementaria por mes generado; la base del mes de pago no cambia.',
    difficulty: 4,
    cognitive_operations: ['application', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-9',
    cluster_id: 'cluster_dinamica_obligacion',
    stem: 'Al extinguirse un contrato, el trabajador tiene 20 dias de vacaciones devengadas y solo disfruto 15. Los cinco dias pendientes:',
    prompt_before_options: 'Separe el devengo del derecho de su disfrute material.',
    correct: {
      text: 'Cotizan con liquidacion complementaria del mes de extincion.',
      explanation: 'Las vacaciones anuales devengadas y no disfrutadas retribuidas a la finalizacion del contrato son objeto de liquidacion y cotizacion complementaria al mes de la extincion.',
    },
    distractors: [
      { text: 'No cotizan porque no hubo prestacion de servicios.', trap_type: 'exception_ignored', explanation: 'Si cotizan: el devengo del derecho genera la obligacion.', condition_if_correct: 'Si no se retribuyeran en el finiquito.' },
      { text: 'Cotizan en el mes en que se hubieran disfrutado.', trap_type: 'temporal_confusion', explanation: 'Se liquidan en el mes de extincion, no en el hypothetical disfrute.', condition_if_correct: 'Si se disfrutaran antes del cese.' },
      { text: 'Se suman a la base ordinaria de noviembre sin complementaria.', trap_type: 'partial_rule_accuracy', explanation: 'Requieren liquidacion y cotizacion complementaria.', condition_if_correct: 'Si ya estuvieran incluidos en la nómina ordinaria.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las vacaciones devengadas y no disfrutadas retribuidas al cese se liquidan y cotizan complementariamente en el mes de extincion.',
    corrective_rule: 'Devengo si, disfrute no: 5 dias cotizan en el mes de extincion.',
    difficulty: 3,
    cognitive_operations: ['application', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-10',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Entre los conceptos que se computan en su totalidad en la base se encuentra:',
    prompt_before_options: 'Una mejora voluntaria de prestaciones es computable, salvo una excepcion.',
    correct: {
      text: 'La aportacion de la empresa a planes de pensiones.',
      explanation: 'Las aportaciones empresariales a planes de pensiones se integran integramente en la base de cotizacion.',
    },
    distractors: [
      { text: 'El copago que el trabajador abona al especialista.', trap_type: 'conceptual_merger', explanation: 'El copago lo paga el trabajador; no hay retribución de la empresa.', condition_if_correct: 'Si la empresa abonara el copago.' },
      { text: 'La póliza contratada directamente por el trabajador.', trap_type: 'factual_misapplication', explanation: 'No hay intervencion de la empresa: no es retribución.', condition_if_correct: 'Si la empresa concertara y financiara la póliza.' },
      { text: 'La mejora voluntaria de incapacidad temporal pagada por la empresa.', trap_type: 'exception_ignored', explanation: 'Es la excepcion: la mejora de IT no computa.', condition_if_correct: 'Si se mejorara otra prestación distinta de la IT.' },
    ],
    legal_basis: 'Arts. 147 TRLGSS; art. 43 TRLGSS',
    rule_statement: 'Se computan integramente las aportaciones empresariales a planes de pensiones; no el copago ni la mejora voluntaria de IT.',
    corrective_rule: 'Paga la empresa = computa (salvo mejora de IT).',
    difficulty: 3,
    cognitive_operations: ['exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-11',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un trabajador recibe 10 participaciones valoradas en 200 EUR en noviembre, cuando se le conceden, y en 250 EUR en diciembre, cuando se liquida la cuota. El valor computable es:',
    prompt_before_options: 'El mercado puede cambiar; la norma fija un momento concreto.',
    correct: {
      text: '200 EUR, los del momento de la concesion.',
      explanation: 'Las acciones, participaciones y planes de pensiones se valoran por el valor que tienen en el momento de su concesion.',
    },
    distractors: [
      { text: '250 EUR, los del momento de la liquidacion.', trap_type: 'temporal_confusion', explanation: 'El valor posterior es irrelevante para la cotizacion.', condition_if_correct: 'Si la norma valorara al momento del pago.' },
      { text: 'La media entre 200 EUR y 250 EUR.', trap_type: 'numeric_substitution', explanation: 'No se promedian valores de dos momentos distintos.', condition_if_correct: 'Si se aplicara un criterio de promedio.' },
      { text: 'Ninguno: hasta que se vendan no hay retribución.', trap_type: 'factual_misapplication', explanation: 'La concesion ya genera retribución computable.', condition_if_correct: 'Si se exigiera la enajenación.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las acciones, participaciones y mejoras se valoran conforme al valor que tienen en el momento de su concesion.',
    corrective_rule: 'Concesion, no liquidacion.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-12',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Una empresa paga 50 EUR por una poliza de asistencia sanitaria concertada para sus trabajadores. El trabajador paga ademas 15 EUR de copago. Que cantidad se suma a la base?',
    prompt_before_options: 'Quien paga cada cantidad es determinante.',
    correct: {
      text: '50 EUR; el copago no computa.',
      explanation: 'Se suma la cuantía abonada por la empresa; el copago satisfecho por el trabajador no tiene concepto de retribución.',
    },
    distractors: [
      { text: '65 EUR, la suma de ambas cantidades.', trap_type: 'conceptual_merger', explanation: 'El copago lo paga el trabajador, no la empresa.', condition_if_correct: 'Si la empresa abonara tambien el copago.' },
      { text: '15 EUR, solo el copago.', trap_type: 'factual_misapplication', explanation: 'Es al reves: computable es lo que paga la empresa.', condition_if_correct: 'Si solo se valorara el desembolso del trabajador.' },
      { text: 'Ninguna: las polizas sanitarias quedan fuera de la base.', trap_type: 'overbroad_statement', explanation: 'Las concertadas o financiadas por la empresa si computan.', condition_if_correct: 'Si la póliza fuera privada del trabajador.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las polizas de aseguramiento privado concertadas o financiadas por la empresa computan por su importe; el copago del trabajador no.',
    corrective_rule: 'Paga empresa = suma; paga trabajador = no suma.',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'application'],
  }),
  buildMcq({
    id: 'item-t4-13',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'La mejora voluntaria de la prestacion por incapacidad comun que pagan algunos convenios durante los tres primeros dias de baja:',
    prompt_before_options: 'Es la excepcion dentro de las mejoras de prestaciones.',
    correct: {
      text: 'No computa en la base de cotizacion.',
      explanation: 'Las mejoras de prestaciones de la Seguridad Social computan en su totalidad, salvo la mejora voluntaria de incapacidad temporal.',
    },
    distractors: [
      { text: 'Computa integramente como las demas mejoras.', trap_type: 'rule_exception_swap', explanation: 'La mejora de IT es precisamente la excepcion a la regla general.', condition_if_correct: 'Si la mejora afectara a jubilacion o viudedad.' },
      { text: 'Computa solo los dias 4 a 15.', trap_type: 'numeric_substitution', explanation: 'Los dias 4 a 15 responden al abono empresarial ordinario en IT comun.', condition_if_correct: 'Si se preguntara por el abono de salario en IT.' },
      { text: 'Computa solo si lo aprueba el INSS.', trap_type: 'wrong_competent_body', explanation: 'No depende de aprobacion del INSS.', condition_if_correct: 'Si se tratara de una prestación publica.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las mejoras de prestaciones son computables, con la excepcion de la mejora voluntaria de incapacidad temporal.',
    corrective_rule: 'Mejora de IT = excepcion excluida.',
    difficulty: 3,
    cognitive_operations: ['exception_detection'],
  }),
  // ---------------------------------------------------------------------
  // 14-17. Valoracion de retribuciones en especie (pool C)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-14',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Una empresa con 10 trabajadores gasta 1.000 EUR en entradas de concierto para todos ellos. La valoracion por trabajador es:',
    prompt_before_options: 'Aplique la regla del coste medio.',
    correct: {
      text: '100 EUR por trabajador.',
      explanation: 'Coste total 1.000 EUR dividido entre 10 perceptores = 100 EUR de retribución en especie por trabajador.',
    },
    distractors: [
      { text: '1.000 EUR para cada trabajador.', trap_type: 'numeric_precision', explanation: 'No se imputa el coste total a cada perceptor.', condition_if_correct: 'Si solo hubiera un perceptor.' },
      { text: '10 EUR, el resultado de dividir 100 entre 10.', trap_type: 'numeric_substitution', explanation: 'Invierte los términos de la division.', condition_if_correct: 'Si el coste total fuera 100 EUR.' },
      { text: 'Cero, porque NO supone un gasto real para la empresa.', trap_type: 'factual_misapplication', explanation: 'Si hay gasto; la regla de coste cero es la excepcion del servicio de educacion.', condition_if_correct: 'Si se tratara de la guarderia del ejemplo.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'Las retribuciones en especie se cuantifican por el coste medio: coste total dividido por el numero de trabajadores perceptores.',
    corrective_rule: 'Coste medio = total / perceptores.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision', 'application'],
  }),
  buildMcq({
    id: 'item-t4-15',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Una guarderia ofrece plaza a los hijos de sus 10 empleados. Pasar de 20 a 21 alumnos NO incrementa el coste. La retribucion en especie resultante:',
    prompt_before_options: 'Recuerde la excepcion al coste medio.',
    correct: {
      text: 'Es cero y no es susceptible de cotizacion.',
      explanation: 'En el servicio de educacion se atiende al coste marginal; si el incremento de coste es cero, la percepcion no cotiza.',
    },
    distractors: [
      { text: 'Es el coste medio del servicio entre los 10 empleados.', trap_type: 'rule_exception_swap', explanation: 'En educacion se aplica el coste marginal, no el coste medio.', condition_if_correct: 'Si se tratara de entradas de concierto.' },
      { text: 'Es el precio de mercado de la plaza.', trap_type: 'true_but_irrelevant', explanation: 'Se atiende al coste marginal para la empresa, no al precio de mercado.', condition_if_correct: 'Si la norma aplicara valoracion de mercado.' },
      { text: 'Es el 20 % anual del coste de adquisicion.', trap_type: 'factual_misapplication', explanation: 'Esa regla corresponde al uso de vehiculo propiedad del pagador.', condition_if_correct: 'Si se valorara un vehiculo.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'En la prestacion del servicio de educacion la valoracion atiende al coste marginal; si es cero, no hay base de cotizacion.',
    corrective_rule: 'Guarderia = coste marginal; si da cero, no cotiza.',
    difficulty: 3,
    cognitive_operations: ['exception_detection', 'application'],
  }),
  buildMcq({
    id: 'item-t4-16',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    confusion_pair_id: 'pair_retribucion_vs_compensacion_gastos',
    stem: 'La empresa presta un vehiculo a un repartidor que lo usa exclusivamente dentro de la jornada para repartir paquetes, sin uso particular. Su valoracion como retribucion en especie:',
    prompt_before_options: 'Haga la pregunta filtro: ¿disfrute para fines particulares?',
    correct: {
      text: 'Cero: es herramienta de trabajo, no retribucion.',
      explanation: 'El vehiculo usado solo en horario laboral y para las funciones no es retribucion en especie; no se suma a la base.',
    },
    distractors: [
      { text: 'El 20 % anual del coste de adquisicion.', trap_type: 'conceptual_merger', explanation: 'Esa regla exige uso particular de un vehiculo propiedad del pagador.', condition_if_correct: 'Si el trabajador usara el coche los fines de semana.' },
      { text: 'El 20 % del valor de mercado del vehiculo nuevo.', trap_type: 'true_but_irrelevant', explanation: 'Corresponde al uso de vehiculo ajeno con disfrute particular.', condition_if_correct: 'Si hubiera uso particular de un coche de renting.' },
      { text: 'El coste de adquisicion íntegro, incluidos tributos.', trap_type: 'factual_misapplication', explanation: 'Es la regla de la entrega (titularidad y uso) con disfrute particular.', condition_if_correct: 'Si se entregara la propiedad del vehiculo.' },
    ],
    legal_basis: 'Art. 147 TRLGSS',
    rule_statement: 'El bien utilizado exclusivamente en la jornada y para las funciones laborales no constituye retribucion en especie.',
    corrective_rule: 'Pregunte si el sabado es de barbacoa o de playa: si no, no computa.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'application'],
  }),
  buildMcq({
    id: 'item-t4-17',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un prestamo de 10.000 EUR concedido por la empresa devenga un 2 % de interes, cuando el legal vigente es 3,25 % y el de mercado 7 %. El porcentaje computable como retribucion en especie es:',
    prompt_before_options: 'El tipo de mercado es un señuelo: piense en la norma.',
    correct: {
      text: '1,25 %: legal menos pagado.',
      explanation: 'Se valora la diferencia entre el interes pagado (2 %) y el legal vigente en el ejercicio (3,25 %): 1,25 %. El tipo de mercado es irrelevante.',
    },
    distractors: [
      { text: '5 %, diferencia con el tipo de mercado.', trap_type: 'numeric_substitution', explanation: 'El tipo de mercado no es la referencia legal.', condition_if_correct: 'Si la norma tomara el tipo de mercado.' },
      { text: '3,25 %, el tipo legal del dinero.', trap_type: 'partial_rule_accuracy', explanation: 'No se computa el tipo legal íntegro, sino la diferencia.', condition_if_correct: 'Si el prestamo fuera gratuito.' },
      { text: '2 %, el interes pagado por el trabajador.', trap_type: 'factual_misapplication', explanation: 'Es el interes satisfecho, no la retribución en especie.', condition_if_correct: 'Si se valorara el desembolso del trabajador.' },
    ],
    legal_basis: 'Art. 147 TRLGSS; Ley 31/2022 (interes legal del dinero)',
    rule_statement: 'Los prestamos a tipo inferior al legal del dinero se valoran por la diferencia entre el interes pagado y el legal vigente en el ejercicio.',
    corrective_rule: 'Legal menos pagado; nunca mercado menos pagado.',
    difficulty: 4,
    cognitive_operations: ['numeric_precision', 'application'],
    figure_status: 'BOE_VERIFIED',
  }),
  // ---------------------------------------------------------------------
  // 18-20. Vivienda y vehiculo (pool C)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-18',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'La empresa abona 900 EUR de alquiler de la vivienda de un trabajador y 50 EUR mensuales de IBI prorrateado, que corresponden al pagador. La retribucion en especie es:',
    prompt_before_options: 'Incluya los tributos que soporta el pagador.',
    correct: {
      text: '950 EUR.',
      explanation: 'Si la vivienda no es propiedad del pagador, se valora al coste para el empleador, incluidos los tributos: 900 + 50 = 950 EUR.',
    },
    distractors: [
      { text: '900 EUR, sin el IBI.', trap_type: 'partial_rule_accuracy', explanation: 'Los tributos a cargo del pagador se incluyen.', condition_if_correct: 'Si el IBI lo pagara el trabajador.' },
      { text: '50 EUR, solo los tributos.', trap_type: 'factual_misapplication', explanation: 'Se incluye tambien la renta abonada por la empresa.', condition_if_correct: 'Si la empresa solo pagara tributos.' },
      { text: '95 EUR, el 10 % de la renta.', trap_type: 'numeric_substitution', explanation: 'El 10 % del valor catastral se aplica a viviendas propiedad del pagador.', condition_if_correct: 'Si la vivienda fuera de la empresa.' },
    ],
    legal_basis: 'Art. 43 Ley 35/2006; art. 147 TRLGSS',
    rule_statement: 'A la vivienda no propiedad del pagador se le aplica el coste para el pagador, incluidos tributos.',
    corrective_rule: 'Alquiler = renta + tributos del pagador.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
  }),
  buildMcq({
    id: 'item-t4-19',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un trabajador con 2.000 EUR de otros conceptos retributivos disfruta de una vivienda propiedad de la empresa. Cual es la valoracion maxima computable por la vivienda?',
    prompt_before_options: 'Existe un limite absoluto comun a alquiler y propiedad.',
    correct: {
      text: '200 EUR, el 10 % del resto de conceptos.',
      explanation: 'La valoracion de la vivienda no puede exceder del 10 % del resto de conceptos retributivos: 10 % de 2.000 = 200 EUR.',
    },
    distractors: [
      { text: '1.424,40 EUR, el tope mínimo de cotizacion.', trap_type: 'conceptual_merger', explanation: 'El tope mínimo no es el limite de valoracion de la vivienda.', condition_if_correct: 'Si se preguntara por el tope de contingencias profesionales.' },
      { text: '100 EUR, el 5 % del resto de conceptos.', trap_type: 'numeric_precision', explanation: 'El 5 % se aplica al valor catastral revisado, no al resto retributivo.', condition_if_correct: 'Si el VC se hubiera revisado en 10 años.' },
      { text: '2.000 EUR, el total de los demas conceptos.', trap_type: 'numeric_substitution', explanation: 'El limite es el 10 %, no el 100 %.', condition_if_correct: 'Si no existiera limite.' },
    ],
    legal_basis: 'Art. 43 Ley 35/2006',
    rule_statement: 'La valoracion de la vivienda no excedera del 10 % del resto de los conceptos retributivos, tanto en alquiler como en propiedad.',
    corrective_rule: 'Tope vivienda = 10 % del resto de la nómina.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-20',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un trabajador usa para fines particulares un vehiculo propiedad de la empresa, adquirido por 5.000 EUR. La retribucion en especie anual es:',
    prompt_before_options: 'No confunda el uso con la entrega de la titularidad.',
    correct: {
      text: 'El 20 % anual del coste de adquisicion: 1.000 EUR.',
      explanation: 'El uso de vehiculo propiedad del pagador se valora al 20 % anual del coste de adquisicion; 20 % de 5.000 = 1.000 EUR.',
    },
    distractors: [
      { text: '5.000 EUR, el coste de adquisicion íntegro.', trap_type: 'rule_exception_swap', explanation: 'Es la regla de la entrega (titularidad y uso), no del mero uso.', condition_if_correct: 'Si se entregara el coche en propiedad.' },
      { text: 'El 20 % del valor de mercado del vehiculo nuevo.', trap_type: 'conceptual_merger', explanation: 'Esa regla se aplica cuando el vehiculo no es propiedad del pagador.', condition_if_correct: 'Si el coche fuera de renting.' },
      { text: 'Cero, porque es un bien de la empresa.', trap_type: 'factual_misapplication', explanation: 'El uso particular genera retribucion en especie.', condition_if_correct: 'Si el uso fuera exclusivamente laboral.' },
    ],
    legal_basis: 'Art. 43 Ley 35/2006; art. 147 TRLGSS',
    rule_statement: 'El uso de vehiculo propiedad del pagador con fines particulares se valora al 20 % anual del coste de adquisicion.',
    corrective_rule: 'Uyo propio = 20 % coste; uso ajeno = 20 % mercado; entrega = coste total.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
  }),
  // ---------------------------------------------------------------------
  // 21-23. Conceptos no computables: locomocion y manutencion (pool C)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-21',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un trabajador se desplaza 10 km en vehiculo particular desde su centro de trabajo a Campillos por una gestion extraordinaria. Que parte del importe abonado por la empresa NO cotiza?',
    prompt_before_options: 'La cuantía actual sustituyo a la antigua de 0,19 EUR/km.',
    correct: {
      text: 'Hasta 0,26 EUR por kilometro: 2,60 EUR.',
      explanation: 'No cotiza lo abonado hasta 0,26 EUR/km; 10 x 0,26 = 2,60 EUR. El exceso se incluiria en la base.',
    },
    distractors: [
      { text: 'Hasta 0,19 EUR por kilometro: 1,90 EUR.', trap_type: 'numeric_substitution', explanation: 'Es la cuantía anterior, actualizada por la orden de 2023.', condition_if_correct: 'Si se aplicara la normativa anterior.' },
      { text: 'La totalidad del importe abonado, sea cual sea.', trap_type: 'overbroad_statement', explanation: 'El exceso sobre 0,26 EUR/km se incluye en la base.', condition_if_correct: 'Si no existiera limite.' },
      { text: 'Solo si se justifica con billete de transporte publico.', trap_type: 'factual_misapplication', explanation: 'El kilometraje se aplica al vehiculo particular; el transporte publico se justifica con ticket.', condition_if_correct: 'Si el desplazamiento fuera en autobus.' },
    ],
    legal_basis: 'Art. 147 TRLGSS; Orden PJC/297/2026',
    rule_statement: 'En vehiculo particular no cotiza lo abonado hasta 0,26 EUR por kilometro; el exceso se incluye en la base.',
    corrective_rule: 'Km x 0,26; el exceso si computa.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-22',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'Un trabajador con domicilio en Malaga y centro de trabajo en Antequera es enviado a Madrid. Presenta una factura de hotel de 60 EUR. Esa cantidad:',
    prompt_before_options: 'Distinga estancia de manutencion.',
    correct: {
      text: 'No computa: estancia justificada.',
      explanation: 'La estancia no computa en todo lo que se justifique, siempre que el municipio sea distinto del centro de trabajo y del domicilio habitual.',
    },
    distractors: [
      { text: 'Computa integramente por ser un gasto de la empresa.', trap_type: 'conceptual_merger', explanation: 'Es una compensacion de gasto, no retribución.', condition_if_correct: 'Si se tratara de un parametro salarial.' },
      { text: 'Solo computa el exceso sobre 53,34 EUR.', trap_type: 'partial_rule_accuracy', explanation: 'El limite de 53,34 EUR es de manutencion, no de estancia.', condition_if_correct: 'Si se preguntara por manutencion con pernocta.' },
      { text: 'Computa porque el centro de trabajo es Antequera.', trap_type: 'factual_misapplication', explanation: 'Madrid es municipio distinto de Antequera y de Malaga: procede la exclusion.', condition_if_correct: 'Si el hotel estuviera en Antequera.' },
    ],
    legal_basis: 'Art. 147 TRLGSS; art. 28.3 TRLGSS',
    rule_statement: 'Los gastos de estancia justificados en municipio distinto del centro de trabajo y del domicilio no se incluyen en la base.',
    corrective_rule: 'Estancia justificada = excluida; manutencion = limites sin justificante.',
    difficulty: 3,
    cognitive_operations: ['exception_detection', 'application'],
  }),
  buildMcq({
    id: 'item-t4-23',
    cluster_id: 'cluster_base_cotizacion_conceptos',
    stem: 'En un viaje con pernocta por Espana, la empresa abona 55 EUR de manutencion. La cantidad que se incluye en la base de cotizacion es:',
    prompt_before_options: 'La manutencion no exige justificante, pero tiene limite.',
    correct: {
      text: '1,66 EUR, el exceso sobre 53,34 EUR.',
      explanation: 'El limite con pernocta en Espana es 53,34 EUR/dia; el exceso de 1,66 EUR se incluye en la base.',
    },
    distractors: [
      { text: '55 EUR, la totalidad abonada.', trap_type: 'factual_misapplication', explanation: 'Hasta el limite no computa.', condition_if_correct: 'Si no existiera limite.' },
      { text: '26,67 EUR, el limite sin pernocta.', trap_type: 'numeric_substitution', explanation: 'Hay pernocta, por lo que se aplica el limite superior.', condition_if_correct: 'Si el viaje fuera exprés sin noche.' },
      { text: 'Cero, porque no se exige justificante.', trap_type: 'partial_rule_accuracy', explanation: 'No exige justificante, pero el exceso sobre el limite si computa.', condition_if_correct: 'Si el abono no superara el limite.' },
    ],
    legal_basis: 'Art. 147 TRLGSS; art. 28.3 TRLGSS',
    rule_statement: 'Sin necesidad de justificante, la manutencion excluye hasta el limite diario; el exceso se incluye en la base.',
    corrective_rule: 'Con pernocta Espana: 53,34; exceso a la base.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'application'],
    figure_status: 'BOE_VERIFIED',
  }),
  // ---------------------------------------------------------------------
  // 24-27. BCxCC vs BCxCP y limites (pool B, pair)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-24',
    cluster_id: 'cluster_tipos_cotizacion',
    confusion_pair_id: 'pair_cc_vs_cp',
    stem: 'Una trabajadora percibe 2.000 EUR de retribuciones ordinarias y 80 EUR de horas extraordinarias en noviembre. Las bases de cotizacion de ese mes son:',
    prompt_before_options: 'Las horas extra separan ambas bases.',
    correct: {
      text: 'BCxCC 2.000 EUR y BCxCP 2.080 EUR.',
      explanation: 'Las horas extraordinarias quedan excluidas de la base por contingencias comunes y se suman a la de contingencias profesionales.',
    },
    distractors: [
      { text: 'BCxCC 2.080 EUR y BCxCP 2.000 EUR.', trap_type: 'rule_exception_swap', explanation: 'Invierte la regla: las horas extra se suman a la CP, no a la CC.', condition_if_correct: 'Si la norma excluyera las horas extra de la CP.' },
      { text: 'Ambas bases de 2.000 EUR.', trap_type: 'conceptual_merger', explanation: 'Solo coinciden cuando no hay horas extraordinarias.', condition_if_correct: 'Si no se realizaran horas extra.' },
      { text: 'Ambas bases de 2.080 EUR.', trap_type: 'overbroad_statement', explanation: 'La base CC no incluye las horas extra.', condition_if_correct: 'Si las horas extra computaran en ambas.' },
    ],
    legal_basis: 'Arts. 147 y 148 TRLGSS',
    rule_statement: 'BCxCP = BCxCC + horas extraordinarias, sin perjuicio de la cotizacion adicional de estas.',
    corrective_rule: '80 EUR de horas extra: CC 2.000, CP 2.080.',
    difficulty: 3,
    cognitive_operations: ['application', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-25',
    cluster_id: 'cluster_tipos_cotizacion',
    confusion_pair_id: 'pair_base_minima_vs_tope',
    stem: 'En el régimen general de 2026, los limites de la base por contingencias comunes se denominan y operan asi:',
    prompt_before_options: 'Una cosa son las bases y otra los topes.',
    correct: {
      text: 'Base minima y base maxima, limites relativos por grupo de cotizacion.',
      explanation: 'Las bases minima y maxima de CC se fijan para cada grupo de categorias profesionales; el tope minimo y maximo son absolutos y propios de contingencias profesionales.',
    },
    distractors: [
      { text: 'Tope minimo y tope maximo, limites relativos por grupo.', trap_type: 'wrong_legal_object', explanation: 'Los topes son absolutos y no dependen del grupo.', condition_if_correct: 'Si se preguntara por contingencias profesionales.' },
      { text: 'Base minima y base maxima, limites absolutos para todo el sistema.', trap_type: 'absolute_relative_confusion', explanation: 'Las bases de CC son relativas al grupo de cotizacion.', condition_if_correct: 'Si se preguntara por contingencias profesionales.' },
      { text: 'Tope minimo y tope maximo, fijados por el SMI y el IPREM.', trap_type: 'conceptual_merger', explanation: 'El SMI fija el tope minimo de CP; el IPREM opera en prestaciones, no en cotizacion.', condition_if_correct: 'Si se preguntara por limites de prestaciones.' },
    ],
    legal_basis: 'Arts. 2 y 3 Orden PJC/297/2026; art. 148 TRLGSS',
    rule_statement: 'Las bases minima/maxima son limites relativos de contingencias comunes por grupo; los topes minimo/maximo son absolutos de contingencias profesionales.',
    corrective_rule: 'Bases = CC y relativas; topes = CP y absolutos.',
    difficulty: 4,
    cognitive_operations: ['micro_discrimination'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-26',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'El tope minimo de cotizacion por contingencias profesionales en 2026 se determina:',
    prompt_before_options: 'El SMI es la referencia, no el IPREM.',
    correct: {
      text: 'SMI mas una sexta parte de paga extra.',
      explanation: 'El tope minimo de CP equivale al SMI vigente incrementado en un sexto, sin ser inferior a 1.424,40 EUR en 2026.',
    },
    distractors: [
      { text: 'IPREM vigente mas una sexta parte.', trap_type: 'wrong_legal_object', explanation: 'El IPREM se usa en limites de prestaciones, no en cotizacion.', condition_if_correct: 'Si se preguntara por prestaciones economicas.' },
      { text: 'La base minima del grupo de cotizacion del trabajador.', trap_type: 'absolute_relative_confusion', explanation: 'Esa es la base minima de contingencias comunes, relativa al grupo.', condition_if_correct: 'Si se preguntara por contingencias comunes.' },
      { text: 'El 28,30 % aplicado al salario minimo.', trap_type: 'factual_misapplication', explanation: 'El 28,30 % es el tipo de contingencias comunes, no un tope.', condition_if_correct: 'Si se calculara la cuota por CC.' },
    ],
    legal_basis: 'Art. 2.2 Orden PJC/297/2026; art. 148 TRLGSS',
    rule_statement: 'El tope minimo de cotizacion por contingencias profesionales es el SMI vigente incrementado en un sexto.',
    corrective_rule: 'SMI + 1/6 = tope minimo CP; IPREM queda fuera de la cotizacion.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-27',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'El tipo de cotizacion por contingencias comunes en 2026 es:',
    prompt_before_options: 'Desglose empresa y trabajador.',
    correct: {
      text: '28,30 %: 23,60 % empresa y 4,70 % trabajador.',
      explanation: 'El art. 4.a de la Orden PJC/297/2026 fija el 28,30 % para contingencias comunes, con 23,60 % a cargo de la empresa y 4,70 % del trabajador.',
    },
    distractors: [
      { text: '25,90 %: 21,20 % empresa y 4,70 % trabajador.', trap_type: 'numeric_precision', explanation: 'Es el tipo efectivo de algunos grupos del régimen de autónomos.', condition_if_correct: 'Si se tratara del RETA.' },
      { text: '30,30 %: 25,60 % empresa y 4,70 % trabajador.', trap_type: 'numeric_substitution', explanation: 'Cuantía inexistente; la empresa aporta 23,60 %.', condition_if_correct: 'Si el desglose empresarial fuera otro.' },
      { text: '28,30 %: 4,70 % empresa y 23,60 % trabajador.', trap_type: 'conceptual_merger', explanation: 'Invierte el desglose: la mayor parte corresponde a la empresa.', condition_if_correct: 'Si se invirtiera la carga.' },
    ],
    legal_basis: 'Art. 4.a Orden PJC/297/2026',
    rule_statement: 'En 2026 el tipo por contingencias comunes es 28,30 %, del que 23,60 % es empresarial y 4,70 % del trabajador.',
    corrective_rule: '28,30 = 23,60 E + 4,70 T.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision'],
    figure_status: 'BOE_VERIFIED',
  }),
  // ---------------------------------------------------------------------
  // 28-32. MEI, solidaridad y recaudacion conjunta (pool A/C)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-28',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'Sobre el Mecanismo de Equidad Intergeneracional (MEI) en 2026, es correcto afirmar:',
    prompt_before_options: 'Es una cotizacion finalista: no genera derechos de prestacion.',
    correct: {
      text: '0,90 % sobre BCxCC: 0,75 E y 0,15 T.',
      explanation: 'El MEI se aplica del 1 de enero de 2023 al 31 de diciembre de 2050; en 2026 es 0,90 % (0,75 empresa y 0,15 trabajador) sobre BCxCC y no es computable a efectos de prestaciones.',
    },
    distractors: [
      { text: '0,90 % sobre la base de contingencias profesionales.', trap_type: 'wrong_legal_object', explanation: 'Se aplica sobre la base de contingencias comunes.', condition_if_correct: 'Si se aplicara sobre la BCxCP.' },
      { text: '1,15 % sobre el exceso de base maxima.', trap_type: 'numeric_substitution', explanation: 'Es el primer tramo de la cotizacion adicional de solidaridad en 2026.', condition_if_correct: 'Si se preguntara por solidaridad.' },
      { text: '0,90 %, computable para la futura pension.', trap_type: 'factual_misapplication', explanation: 'Es finalista: no computa a efectos de prestaciones.', condition_if_correct: 'Si se tratara de cotizacion ordinaria.' },
    ],
    legal_basis: 'Art. 127 bis TRLGSS; DT 43a TRLGSS; art. 3.2 RDL 3/2026',
    rule_statement: 'El MEI (2023-2050) es una cotizacion finalista sobre BCxCC, de 0,90 % en 2026, no computable a efectos de prestaciones.',
    corrective_rule: 'MEI = caja única, no pension futura.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'numeric_precision'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-29',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'La cotizacion adicional de solidaridad en 2026 grava el exceso sobre la base maxima. Su tipo para retribuciones que superan el 50 % de dicha base es:',
    prompt_before_options: 'Tres tramos progresivos: hasta 10 %, de 10 % a 50 % y mas de 50 %.',
    correct: {
      text: '1,46 %, con 1,22 % empresa y 0,24 % trabajador.',
      explanation: 'El art. 3.3.c del RDL 3/2026 fija el 1,46 % para el tramo superior al 50 % de increase sobre la base maxima, con desglose 1,22/0,24.',
    },
    distractors: [
      { text: '1,15 %, con 0,96 % empresa y 0,19 % trabajador.', trap_type: 'numeric_precision', explanation: 'Es el tipo del primer tramo (hasta 10 % de increase).', condition_if_correct: 'Si se preguntara por el primer tramo.' },
      { text: '1,25 %, con 1,04 % empresa y 0,21 % trabajador.', trap_type: 'numeric_substitution', explanation: 'Es el tipo del tramo intermedio (10 % a 50 %).', condition_if_correct: 'Si se preguntara por el tramo intermedio.' },
      { text: '0,90 %, con 0,75 % empresa y 0,15 % trabajador.', trap_type: 'conceptual_merger', explanation: 'Es el tipo del MEI, no de solidaridad.', condition_if_correct: 'Si se preguntara por el MEI.' },
    ],
    legal_basis: 'Art. 19 bis TRLGSS; DT 42a TRLGSS; art. 3.3 RDL 3/2026',
    rule_statement: 'En 2026 los tramos de solidaridad son 1,15 %, 1,25 % y 1,46 % segun el exceso sobre la base maxima.',
    corrective_rule: 'Tercer tramo = 1,46 % (1,22 E + 0,24 T).',
    difficulty: 4,
    cognitive_operations: ['numeric_precision'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-30',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'La cotizacion adicional de solidaridad se aplica:',
    prompt_before_options: 'No confunda el colectivo afectado con el MEI.',
    correct: {
      text: 'Solo cuenta ajena; autonomos excluidos.',
      explanation: 'Grava el exceso de retribuciones de los trabajadores por cuenta ajena sobre la base maxima; no se aplica a los autonomos.',
    },
    distractors: [
      { text: 'A todos los cotizantes, incluidos los autonomos.', trap_type: 'overbroad_statement', explanation: 'El art. 19 bis TRLGSS se refiere a retribuciones de trabajadores por cuenta ajena.', condition_if_correct: 'Si se tratara del MEI, comun a todos los regimenes.' },
      { text: 'Solo a los trabajadores autonomos.', trap_type: 'rule_exception_swap', explanation: 'Es al reves: los autonomos estan excluidos.', condition_if_correct: 'Si se invirtiera el colectivo.' },
      { text: 'Solo en los contratos de duracion determinada.', trap_type: 'hyper_narrow_statement', explanation: 'La indole del contrato no es el criterio; lo es el exceso de retribuciones.', condition_if_correct: 'Si se limitara por tipo de contrato.' },
    ],
    legal_basis: 'Art. 19 bis TRLGSS',
    rule_statement: 'La cotizacion adicional de solidaridad afecta solo a trabajadores por cuenta ajena y no computa a efectos de prestaciones.',
    corrective_rule: 'Solidaridad = cuenta ajena; autonomos excluidos.',
    difficulty: 3,
    cognitive_operations: ['exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-31',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'En la tarifa de primas para contingencias profesionales aplicable desde 2026, el personal que trabaja exclusivamente en oficina:',
    prompt_before_options: 'Existen dos cuadros: actividades y ocupaciones.',
    correct: {
      text: 'Se le aplica el cuadro 2, aunque la empresa sea ganadera.',
      explanation: 'El cuadro 2 de la tarifa de primas (ocupaciones) prevalece sobre el cuadro 1 de actividades: al personal exclusivo de oficina se le aplica aquel.',
    },
    distractors: [
      { text: 'Se le aplica el cuadro 1 de la actividad de la empresa.', trap_type: 'rule_exception_swap', explanation: 'Predomina el cuadro 2 para el personal exclusivo de oficina.', condition_if_correct: 'Si no existiera ocupacion singular.' },
      { text: 'No cotiza por contingencias profesionales.', trap_type: 'factual_misapplication', explanation: 'Sí cotiza, con el tipo del cuadro 2.', condition_if_correct: 'Si estuviera excluido.' },
      { text: 'Cotiza al tipo mas alto de toda la tarifa.', trap_type: 'overbroad_statement', explanation: 'El tipo mas alto se aplica a quienes no comunican el codigo CNAE-2025.', condition_if_correct: 'Si la empresa no hubiera comunicado el codigo.' },
    ],
    legal_basis: 'DA 61a TRLGSS (RDL 3/2026); tarifa de primas CNAE-2025',
    rule_statement: 'En la tarifa de primas, el cuadro 2 de ocupaciones predomina sobre el cuadro 1 de actividades para el personal exclusivo de oficina.',
    corrective_rule: 'Oficina = cuadro 2 aunque la empresa sea ganadera.',
    difficulty: 4,
    cognitive_operations: ['application', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-32',
    cluster_id: 'cluster_tipos_cotizacion',
    stem: 'La cuota por desempleo de un contrato de duracion determinada en 2026, desglosada entre empresa y trabajador, es:',
    prompt_before_options: 'Compare con la contratacion indefinida (7,05 %).',
    correct: {
      text: '8,30 %: 6,70 % empresa y 1,60 % trabajador.',
      explanation: 'El tipo de desempleo para contratacion de duracion determinada es 8,30 %, con 6,70 % a cargo de la empresa y 1,60 % del trabajador.',
    },
    distractors: [
      { text: '7,05 %: 5,50 % empresa y 1,55 % trabajador.', trap_type: 'temporal_confusion', explanation: 'Es el tipo de la contratacion indefinida.', condition_if_correct: 'Si el contrato fuera indefinido.' },
      { text: '8,30 %: 5,50 % empresa y 2,80 % trabajador.', trap_type: 'numeric_substitution', explanation: 'El desglose correcto es 6,70/1,60.', condition_if_correct: 'Si se repartiera de otra forma.' },
      { text: '0,20 %: 0,20 % empresa.', trap_type: 'factual_misapplication', explanation: 'Es el tipo del FOGASA, no del desempleo.', condition_if_correct: 'Si se preguntara por FOGASA.' },
    ],
    legal_basis: 'Art. 33 Orden PJC/297/2026',
    rule_statement: 'En 2026, desempleo: 7,05 % en contratacion indefinida y 8,30 % en duracion determinada.',
    corrective_rule: 'Indefinido 5,50/1,55; temporal 6,70/1,60.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision'],
    figure_status: 'BOE_VERIFIED',
  }),
  // ---------------------------------------------------------------------
  // 33-34. Beneficios en la cotizacion (pool B)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-33',
    cluster_id: 'cluster_beneficios_cotizacion',
    stem: 'De los tres beneficios en la cotizacion, los que salen de las partidas presupuestarias del SEPE son:',
    prompt_before_options: 'Unos salen de la casa y otros del saco del SEPE.',
    correct: {
      text: 'Las bonificaciones.',
      explanation: 'Reducciones y exenciones salen del patrimonio de la Seguridad Social; las bonificaciones se financian con cargo al presupuesto del SEPE.',
    },
    distractors: [
      { text: 'Las reducciones.', trap_type: 'conceptual_merger', explanation: 'Las reducciones salen del patrimonio de la Seguridad Social.', condition_if_correct: 'Si se financiaran por el SEPE.' },
      { text: 'Las exenciones de cuotas.', trap_type: 'wrong_competent_body', explanation: 'Las exenciones salen del patrimonio de la Seguridad Social.', condition_if_correct: 'Si se financiaran por el SEPE.' },
      { text: 'Todos los beneficios por igual.', trap_type: 'overbroad_statement', explanation: 'Hay dos fuentes de financiacion distintas.', condition_if_correct: 'Si existiera una sola bolsa.' },
    ],
    legal_basis: 'Art. 20 TRLGSS',
    rule_statement: 'Reducciones y exenciones se financian con cargo a la Seguridad Social; las bonificaciones, con cargo al SEPE.',
    corrective_rule: 'Dos primeros en casa; bonificaciones del SEPE.',
    difficulty: 2,
    cognitive_operations: ['institutional_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-34',
    cluster_id: 'cluster_beneficios_cotizacion',
    stem: 'Para ser beneficiario de una reduccion, exencion o bonificacion en la cotizacion NO es requisito indispensable:',
    prompt_before_options: 'Distinguir los requisitos de los colectivos.',
    correct: {
      text: 'Estar percibiendo prestacion por desempleo.',
      explanation: 'Los requisitos indispensables son mantenimiento del empleo, estar al corriente, cumplir en tiempo y forma las obligaciones de liquidacion, ingresar en plazo reglamentario y no estar inhabilitado para ayudas publicas.',
    },
    distractors: [
      { text: 'Mantener las obligaciones de empleo.', trap_type: 'true_but_irrelevant', explanation: 'Es requisito indispensable segun el art. 20 TRLGSS.', condition_if_correct: 'Si se preguntara por un requisito.' },
      { text: 'Estar al corriente con la Seguridad Social.', trap_type: 'partial_rule_accuracy', explanation: 'Es requisito indispensable.', condition_if_correct: 'Si se preguntara por un requisito.' },
      { text: 'No estar inhabilitado para subvenciones publicas.', trap_type: 'exception_ignored', explanation: 'Es requisito indispensable.', condition_if_correct: 'Si se preguntara por un requisito.' },
    ],
    legal_basis: 'Art. 20 TRLGSS',
    rule_statement: 'Los requisitos indispensables de los beneficios son mantenimiento del empleo, estar al corriente, cumplimiento en tiempo y forma, ingreso en plazo y no inhabilitacion para ayudas publicas.',
    corrective_rule: 'Empleo + corriente + plazo + liquidacion + no inhabilitado.',
    difficulty: 3,
    cognitive_operations: ['exception_detection'],
  }),
  // ---------------------------------------------------------------------
  // 35-38. Dinamica, liquidacion y supuestos (pool D/E)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-35',
    cluster_id: 'cluster_dinamica_obligacion',
    stem: 'La obligacion de cotizar se extingue, con carácter general:',
    prompt_before_options: 'El origen de la obligacion es el trabajo, no la comunicacion.',
    correct: {
      text: 'Con el cese comunicado en tiempo y forma.',
      explanation: 'La extincion se vincula al cese de la prestacion de trabajo o a la terminacion de la situacion determinante, comunicada en tiempo y forma, salvo prueba admitida en derecho.',
    },
    distractors: [
      { text: 'Con la mera solicitud de baja, aunque se siga trabajando.', trap_type: 'factual_misapplication', explanation: 'La mera solicitud no extingue la obligacion si continua la prestacion.', condition_if_correct: 'Si el cese fuera real.' },
      { text: 'Con el ultimo dia del mes natural del cese.', trap_type: 'temporal_confusion', explanation: 'El cierre del periodo de liquidacion no determina la extincion de la obligacion.', condition_if_correct: 'Si se tratara del periodo de liquidacion.' },
      { text: 'Solo con resolucion expresa de la Inspeccion de Trabajo.', trap_type: 'hyper_narrow_statement', explanation: 'La TGSS tambien puede conocer el cese por datos obrantes o por la comunicacion del interesado.', condition_if_correct: 'Si solo actuara la ITSS.' },
    ],
    legal_basis: 'Art. 144 TRLGSS; arts. 35 y 36 RIA',
    rule_statement: 'La obligacion de cotizar se extingue con el cese real comunicado en plazo; la mera comunicacion sin cese no produce el efecto.',
    corrective_rule: 'Manda el trabajo, no el papel.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-36',
    cluster_id: 'cluster_dinamica_obligacion',
    stem: 'Un trabajador que secunda una huelga se encuentra en alta especial. Respecto de su obligacion de cotizar:',
    prompt_before_options: 'Se suspende el contrato y, con el, la obligacion.',
    correct: {
      text: 'Queda suspendida la situacion de cotizacion.',
      explanation: 'En huelga y cierre patronal hay alta especial: al suspenderse el contrato y no percibirse salario, se suspende la obligacion de cotizar.',
    },
    distractors: [
      { text: 'Subsiste la obligacion de cotizar con cargo a la empresa.', trap_type: 'conceptual_merger', explanation: 'En alta especial no hay obligacion de cotizar durante la suspension.', condition_if_correct: 'Si estuviera en IT o de permiso.' },
      { text: 'Se extingue definitivamente la obligacion.', trap_type: 'rule_exception_swap', explanation: 'Es una suspension, no una extincion.', condition_if_correct: 'Si se produjera el cese del contrato.' },
      { text: 'Solo cotiza por contingencias profesionales.', trap_type: 'partial_rule_accuracy', explanation: 'No cotiza por ninguna contingencia en la suspension.', condition_if_correct: 'Si se tratara de jubilacion activa.' },
    ],
    legal_basis: 'Art. 6 y art. 144 TRLGSS; RDL 17/1977',
    rule_statement: 'En alta especial por huelga o cierre patronal se suspende la situacion de cotizacion.',
    corrective_rule: 'Quien secunda la huelga no cotiza; quien no la secunda, si.',
    difficulty: 3,
    cognitive_operations: ['exception_detection'],
  }),
  buildMcq({
    id: 'item-t4-37',
    cluster_id: 'cluster_liquidacion_sistemas',
    stem: 'En el sistema de liquidacion directa (SLD), la presentacion de datos y el pago material tienen estos plazos:',
    prompt_before_options: 'No confunda cumplimiento de obligaciones con pago.',
    correct: {
      text: 'Penultimo natural: datos; ultimo: pago.',
      explanation: 'En el SLD el sujeto responsable facilita los datos hasta el penultimo dia natural del plazo reglamentario, y el pago se realiza hasta el ultimo dia natural.',
    },
    distractors: [
      { text: 'Ultimo dia natural para presentar y pagar.', trap_type: 'absolute_relative_confusion', explanation: 'Es la regla de la autoliquidacion, no del SLD.', condition_if_correct: 'Si se tratara de autoliquidacion.' },
      { text: 'Penultimo dia habil para presentar y ultimo dia habil para pagar.', trap_type: 'true_but_irrelevant', explanation: 'En el SLD se computan dias naturales, no habiles.', condition_if_correct: 'Si se tratara de la simplificada.' },
      { text: 'Ultimo dia habil del mismo mes para pagar.', trap_type: 'temporal_confusion', explanation: 'Es la regla del sistema de liquidacion simplificada.', condition_if_correct: 'Si se tratara de la simplificada.' },
    ],
    legal_basis: 'Art. 22 TRLGSS; Orden PJC/297/2026',
    rule_statement: 'En el SLD: datos hasta el penultimo dia natural y pago hasta el ultimo dia natural del plazo reglamentario.',
    corrective_rule: 'SLD: 29 presentar / 30 pagar en noviembre.',
    difficulty: 4,
    cognitive_operations: ['micro_discrimination', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-38',
    cluster_id: 'cluster_liquidacion_sistemas',
    stem: 'En el sistema de liquidacion simplificada, si el trabajador NO comunica ninguna variacion de datos, la cuota a pagar:',
    prompt_before_options: 'El profesor lo compara con una tarifa plana de Internet.',
    correct: {
      text: 'Se repite la del mes anterior, salvo comunicacion de variaciones.',
      explanation: 'La TGSS determinara la liquidacion sin exigir solicitud ni aportacion de datos; si no se comunica nada, se parte de los datos del mes anterior.',
    },
    distractors: [
      { text: 'Se calcula con los datos que facilite la empresa cada mes.', trap_type: 'conceptual_merger', explanation: 'Eso es propio del SLD, no de la simplificada.', condition_if_correct: 'Si se tratara del SLD.' },
      { text: 'Se fija en cero hasta que se comunique una variacion.', trap_type: 'factual_misapplication', explanation: 'Se mantiene la cuota anterior, no se elimina.', condition_if_correct: 'Si no existiera obligacion de pago.' },
      { text: 'Se paga hasta el ultimo dia natural del plazo reglamentario.', trap_type: 'temporal_confusion', explanation: 'En la simplificada el plazo es el ultimo dia habil del mismo mes.', condition_if_correct: 'Si se aplicara el SLD.' },
    ],
    legal_basis: 'Art. 22 TRLGSS',
    rule_statement: 'En la liquidacion simplificada no se exige solicitud de datos; sin variaciones, se repite la cuota del mes anterior y se paga hasta el ultimo dia habil.',
    corrective_rule: 'Tarifa plana: igual cuota si no hay cambios.',
    difficulty: 3,
    cognitive_operations: ['application'],
  }),
  // ---------------------------------------------------------------------
  // 39-48. Test de clase del tema 3, resuelto en la sesion (pool B1/B3)
  // ---------------------------------------------------------------------
  buildMcq({
    id: 'item-t4-39',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'Sobre la situacion de alta, la afirmacion mas correcta es:',
    prompt_before_options: 'Busque la consecuencia jurídica del incumplimiento.',
    correct: {
      text: 'Su incumplimiento constituye una infraccion administrativa.',
      explanation: 'La no solicitud del alta en plazo constituye infraccion administrativa, sin perjuicio de que la obligacion de cotizar nazca con la prestacion de servicios.',
    },
    distractors: [
      { text: 'Solo puede realizarse a instancia de parte.', trap_type: 'overbroad_statement', explanation: 'Tambien cabe actuacion de oficio de la ITSS y la TGSS.', condition_if_correct: 'Si no existiera la via de oficio.' },
      { text: 'La no solicitud impide el nacimiento de la cotizacion.', trap_type: 'exception_ignored', explanation: 'Existe el alta de pleno derecho o presunta, que genera derechos económicos.', condition_if_correct: 'Si no existiera la presuncion de alta.' },
      { text: 'Se solicita en la provincia del domicilio habitual del trabajador por cuenta ajena.', trap_type: 'factual_misapplication', explanation: 'El domicilio habitual opera para el trabajador por cuenta propia y en defecto del establecimiento.', condition_if_correct: 'Si se tratara de un autonomo.' },
    ],
    legal_basis: 'Arts. 22 y 23 LISOS; art. 32 RIA; art. 166 TRLGSS',
    rule_statement: 'El incumplimiento de la obligacion de solicitar el alta constituye infraccion administrativa; la obligacion de cotizar nace con el trabajo.',
    corrective_rule: 'Infraccion si, pero la cotizacion nace igual.',
    difficulty: 3,
    cognitive_operations: ['micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-40',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'En cuanto al lugar y plazo de solicitud del alta, la opcion correcta es:',
    prompt_before_options: 'El alta se solicita siempre con caracter previo.',
    correct: {
      text: 'Cuenta propia: establecimiento o domicilio, con caracter previo.',
      explanation: 'Los trabajadores por cuenta propia solicitan el alta en la provincia del establecimiento y, en su defecto, la del domicilio, con caracter previo al inicio de la actividad.',
    },
    distractors: [
      { text: 'Asimilados a cuenta ajena: provincia de su residencia, con caracter posterior.', trap_type: 'temporal_confusion', explanation: 'El alta es previa, nunca posterior a la prestacion.', condition_if_correct: 'Si se admitiera la alta posterior.' },
      { text: 'Cuenta ajena: provincia del domicilio social, con simultaneidad al inicio.', trap_type: 'factual_misapplication', explanation: 'La solicitud debe ser previa; ademas el criterio es el centro de trabajo/domicilio de la empresa, no el domicilio social.', condition_if_correct: 'Si la alta pudiera presentarse el mismo dia.' },
      { text: 'Todas las respuestas son correctas.', trap_type: 'overbroad_statement', explanation: 'A y B son incorrectas, luego D no puede serlo.', condition_if_correct: 'Si A y B fueran correctas.' },
    ],
    legal_basis: 'Art. 32.2 RIA',
    rule_statement: 'El alta se solicita con caracter previo; para cuenta propia rige la provincia del establecimiento y, en su defecto, la del domicilio.',
    corrective_rule: 'Excepcion: agrarios por cuenta ajena, alta hasta las 12 horas del dia de inicio.',
    difficulty: 3,
    cognitive_operations: ['micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-41',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'Las solicitudes de alta de los sujetos obligados deben presentarse:',
    prompt_before_options: 'La cifra necesita el apellido completo: naturales o habiles.',
    correct: {
      text: 'Previo, con tope de 60 dias naturales de antelacion.',
      explanation: 'El art. 32.3.1 RIA exige alta previa, sin que pueda presentarse antes de los 60 dias naturales anteriores al inicio previsto.',
    },
    distractors: [
      { text: 'Con caracter previo, con tope de 60 dias habiles anteriores.', trap_type: 'temporal_confusion', explanation: 'Se computan dias naturales, no habiles.', condition_if_correct: 'Si el plazo fuera en dias habiles.' },
      { text: 'Con caracter previo, con tope de 45 dias naturales anteriores.', trap_type: 'numeric_precision', explanation: 'La cifra correcta es 60 dias naturales.', condition_if_correct: 'Si la ventana fuera de 45 dias.' },
      { text: 'Con caracter previo, con tope de tres meses anteriores.', trap_type: 'numeric_substitution', explanation: 'Tres meses no es el plazo del reglamento.', condition_if_correct: 'Si se ampliara la antelacion.' },
    ],
    legal_basis: 'Art. 32.3.1 RIA',
    rule_statement: 'El alta se presenta con caracter previo al inicio, con un tope de 60 dias naturales de antelacion.',
    corrective_rule: '60 dias naturales, apellido completo.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-42',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'El plazo para comunicar la baja a la administracion competente es:',
    prompt_before_options: 'Recuerde la modificacion normativa del ultimo verano.',
    correct: {
      text: 'Seis dias naturales desde el cese, en la TGSS del alta.',
      explanation: 'Tras el RD 643/2026, el art. 32.3.2 RIA fija seis dias naturales siguientes al cese para bajas y variaciones de datos de los trabajadores.',
    },
    distractors: [
      { text: 'Cinco dias primeros del mes siguiente, en modelos oficiales al INSS.', trap_type: 'wrong_competent_body', explanation: 'El INSS no es la administracion competente para la baja; ademas el plazo no es ese.', condition_if_correct: 'Si se comunicara al INSS.' },
      { text: 'Tres dias naturales siguientes, a cualquier administracion de la TGSS.', trap_type: 'temporal_confusion', explanation: 'Es el plazo anterior a la reforma; ademas debe dirigirse a la administracion donde se dio de alta.', condition_if_correct: 'Si se aplicara la normativa anterior.' },
      { text: 'Tres dias siguientes, a la administracion de la Seguridad Social competente.', trap_type: 'numeric_substitution', explanation: 'La cifra actual es seis dias naturales.', condition_if_correct: 'Si el plazo no se hubiera ampliado.' },
    ],
    legal_basis: 'Art. 32.3.2 RIA, modificado por RD 643/2026',
    rule_statement: 'Bajas y variaciones de datos de trabajadores: seis dias naturales siguientes al cese, ante la TGSS donde se dio de alta.',
    corrective_rule: 'De 3 a 6 dias naturales desde el 1 de agosto de 2026.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'institutional_discrimination'],
    figure_status: 'BOE_VERIFIED',
  }),
  buildMcq({
    id: 'item-t4-43',
    cluster_id: 'cluster_efectos_altas_bajas',
    confusion_pair_id: 'pair_efectos_comunicacion_vs_inicio',
    stem: 'Federica inicia su relacion laboral el 5 de junio y su solicitud de alta se formaliza el 5 de mayo. Los efectos del alta son:',
    prompt_before_options: 'No confunda la fecha de la comunicacion con la de efectos.',
    correct: {
      text: 'Efectos desde el inicio de la relacion laboral.',
      explanation: 'Al presentarse en tiempo y forma, el alta surte efectos desde el dia en que se inicia la actividad, no desde la fecha de la solicitud.',
    },
    distractors: [
      { text: 'El 5 de mayo, fecha de la solicitud.', trap_type: 'factual_misapplication', explanation: 'Es la fecha de comunicacion; los efectos se retrotraen al inicio.', condition_if_correct: 'Si el alta se presentara fuera de plazo.' },
      { text: 'El 1 de junio, primer dia del mes de inicio.', trap_type: 'numeric_substitution', explanation: 'No existe esa regla general para el alta en plazo.', condition_if_correct: 'Si se aplicara la regla de funcionarios.' },
      { text: 'El 5 de julio, un mes despues de la solicitud.', trap_type: 'temporal_confusion', explanation: 'No hay plazo de espera de un mes.', condition_if_correct: 'Si la norma lo estableciera.' },
    ],
    legal_basis: 'Art. 35.1.1 RIA',
    rule_statement: 'Las altas solicitadas con caracter previo surten efectos desde el dia en que se inicia la actividad.',
    corrective_rule: 'En plazo = efectos desde el inicio del trabajo.',
    difficulty: 3,
    cognitive_operations: ['application', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-44',
    cluster_id: 'cluster_efectos_altas_bajas',
    confusion_pair_id: 'pair_efectos_comunicacion_vs_inicio',
    stem: 'Eufrasio inicia su relacion laboral el 10 de noviembre y solicita el alta el 11 de diciembre. En principio, los efectos del alta son:',
    prompt_before_options: 'Distinga este caso del de Federica: aqui hay alta fuera de plazo.',
    correct: {
      text: 'Efectos desde la fecha de la solicitud.',
      explanation: 'Las altas presentadas fuera de plazo surten efectos desde el dia de la solicitud, sin perjuicio de la actuacion inspectora y de la sancion que corresponda.',
    },
    distractors: [
      { text: 'El 10 de noviembre, inicio de la relacion laboral.', trap_type: 'rule_exception_swap', explanation: 'Aplica la regla del alta en plazo a un alta tardia.', condition_if_correct: 'Si la solicitud se hubiera presentado en tiempo.' },
      { text: 'El 1 de noviembre, primer dia del mes de inicio.', trap_type: 'numeric_substitution', explanation: 'No existe regla general de efectos al primer dia del mes para el alta fuera de plazo.', condition_if_correct: 'Si se aplicara la regla de funcionarios.' },
      { text: 'El 1 de diciembre, primer dia del mes de la solicitud.', trap_type: 'temporal_confusion', explanation: 'Los efectos se fijan en el dia de la solicitud.', condition_if_correct: 'Si se aplicara la regla de funcionarios.' },
    ],
    legal_basis: 'Art. 35.1.1 RIA',
    rule_statement: 'Las altas fuera de plazo surten efectos desde el dia en que se formula la solicitud, salvo ingreso en plazo de cuotas en autoliquidacion.',
    corrective_rule: 'Fuera de plazo = efectos desde la instancia.',
    difficulty: 4,
    cognitive_operations: ['application', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-45',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'Una actuacion inspectora de 9 de diciembre se promueve por una denuncia con entrada el 20 de noviembre. Los efectos del alta de oficio se fijan, en principio:',
    prompt_before_options: 'Vaya al origen de la actuacion inspectora.',
    correct: {
      text: 'Efectos desde la fecha de entrada de la denuncia.',
      explanation: 'En las altas de oficio promovidas por denuncia, queja o peticion expresa, los efectos se retrotraen a la fecha en que tuvieron entrada.',
    },
    distractors: [
      { text: 'El 9 de diciembre, fecha de la personacion inspectora.', trap_type: 'factual_misapplication', explanation: 'Es la regla general, pero se desplaza por la denuncia previa.', condition_if_correct: 'Si no existiera denuncia, queja o peticion previa.' },
      { text: 'El 10 de noviembre, inicio de la relacion.', trap_type: 'temporal_confusion', explanation: 'No es la fecha de la actuacion ni de su origen.', condition_if_correct: 'Si se tratara de un alta en plazo.' },
      { text: 'El 1 de diciembre, primer dia del mes de la actuacion.', trap_type: 'numeric_substitution', explanation: 'No hay regla de primer dia del mes en el alta de oficio.', condition_if_correct: 'Si se aplicara la regla de funcionarios.' },
    ],
    legal_basis: 'Art. 35.1.2 RIA',
    rule_statement: 'En el alta de oficio por denuncia, queja o peticion expresa, los efectos se retrotraen a la fecha de entrada de estas.',
    corrective_rule: 'Siempre con el conocimiento de origen.',
    difficulty: 4,
    cognitive_operations: ['application', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-46',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'Carmen cesa el 5 de septiembre y formaliza su baja el 7 del mismo mes. La fecha de efectos de la baja es:',
    prompt_before_options: 'Compruebe primero si la comunicacion se presento en plazo.',
    correct: {
      text: 'Efectos desde el cese en la prestacion de trabajo.',
      explanation: 'La baja comunicada dentro de plazo (hasta el 11 de septiembre) surte efectos desde el cese en la prestacion de trabajo.',
    },
    distractors: [
      { text: 'El 7 de septiembre, fecha de la comunicacion.', trap_type: 'factual_misapplication', explanation: 'Es la fecha de formalizacion; en plazo, los efectos son los del cese.', condition_if_correct: 'Si la baja se presentara fuera de plazo.' },
      { text: 'El 8 de septiembre, dia siguiente a la comunicacion.', trap_type: 'numeric_substitution', explanation: 'No responde a ninguna regla de efectos.', condition_if_correct: 'Si la norma aplicara el dia siguiente.' },
      { text: 'El 30 de septiembre, ultimo dia del mes.', trap_type: 'temporal_confusion', explanation: 'Confunde los efectos de la baja con el cierre del periodo de liquidacion.', condition_if_correct: 'Si se tratara del periodo de liquidacion.' },
    ],
    legal_basis: 'Art. 35.2.1 RIA; art. 36 RIA',
    rule_statement: 'La baja comunicada en tiempo y forma extingue la obligacion de cotizar desde la fecha del cese en el trabajo.',
    corrective_rule: 'En plazo = efectos desde el cese.',
    difficulty: 3,
    cognitive_operations: ['application', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t4-47',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'El empleador comunica la baja de Benito el 8 de marzo, aunque este sigue trabajando hasta el 28. La inspeccion se persona el 4 de abril y el trabajador prueba que el cese real fue el 28 de marzo. Los efectos son:',
    prompt_before_options: 'La prueba admitida en derecho prevalece.',
    correct: {
      text: 'Efectos del cese real acreditado.',
      explanation: 'Los interesados pueden probar por cualquier medio admitido en derecho que el cese se produjo en otra fecha; esa fecha prevalece sobre la comunicacion y la actuacion inspectora.',
    },
    distractors: [
      { text: 'El 8 de marzo, fecha de la comunicacion.', trap_type: 'factual_misapplication', explanation: 'La baja se comunico mientras se seguia trabajando: no hay cese real.', condition_if_correct: 'Si el cese real coincidiera con la comunicacion.' },
      { text: 'El 4 de abril, fecha de la personacion inspectora.', trap_type: 'rule_exception_swap', explanation: 'La fecha de la actuacion inspectora cede ante la prueba del cese real.', condition_if_correct: 'Si no hubiera prueba en contrario.' },
      { text: 'El 21 de marzo, fecha intermedia sin apoyo en el enunciado.', trap_type: 'numeric_substitution', explanation: 'No responde a ninguna fecha juridicamente relevante del supuesto.', condition_if_correct: 'Si se acreditara esa fecha.' },
    ],
    legal_basis: 'Arts. 35.2.4 y 36 RIA',
    rule_statement: 'La prueba admitida en derecho del cese real prevalece sobre la fecha de comunicacion de la baja y sobre la actuacion inspectora.',
    corrective_rule: 'Manda la prueba del cese real.',
    difficulty: 4,
    cognitive_operations: ['application', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t4-48',
    cluster_id: 'cluster_efectos_altas_bajas',
    stem: 'Los requisitos formales para formalizar el alta comprenden, entre otros:',
    prompt_before_options: 'El articulo 30 del reglamento de afiliacion enumera requisitos acumulativos.',
    correct: {
      text: 'Firma de ambos, codigo de convenio y rendimientos del autonomo.',
      explanation: 'El art. 30 RIA exige la firma de ambos en el alta por cuenta ajena, el codigo de convenio coincidente con el de la cuenta de cotizacion y, para el autonomo, la declaracion de rendimientos netos previstos.',
    },
    distractors: [
      { text: 'Solo la firma del empresario, sin intervencion del trabajador.', trap_type: 'hyper_narrow_statement', explanation: 'El alta por cuenta ajena debe ir firmada en todo caso por el trabajador.', condition_if_correct: 'Si se tratara del alta de autonomos.' },
      { text: 'El codigo de convenio, sin relacion con la cuenta de cotizacion.', trap_type: 'partial_rule_accuracy', explanation: 'Debe coincidir con el correspondiente al codigo de cuenta de cotizacion.', condition_if_correct: 'Si no existiera obligacion de coincidencia.' },
      { text: 'La declaracion de rendimientos solo para los trabajadores por cuenta ajena.', trap_type: 'rule_exception_swap', explanation: 'La declaracion de rendimientos netos previstos corresponde al alta del trabajador autonomo.', condition_if_correct: 'Si se tratara de cuenta ajena.' },
    ],
    legal_basis: 'Art. 30 RIA (RD 84/1996)',
    rule_statement: 'El art. 30 RIA exige cumulativamente firma empresarial y del trabajador, codigo de convenio acorde con la cuenta de cotizacion y declaracion de rendimientos previstos del autonomo.',
    corrective_rule: 'Todas las respuestas son correctas en el test del profesor.',
    difficulty: 4,
    cognitive_operations: ['generative_retrieval', 'exception_detection'],
  }),
];
