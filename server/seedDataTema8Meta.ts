import type { Topic, SourceChunk, Cluster, ConfusionPair } from '../src/types.ts';

const TOPIC = 'topic_seguridad_social_tema_8';
const now = '2026-03-01T10:00:00Z';

export const seedTopicTema8: Topic = {
  id: TOPIC,
  name: 'Tema 8 Especifico - Incapacidad temporal',
  description:
    'BLOQUE ESPECIFICO (ES). Incapacidad temporal: concepto y situaciones especiales, base reguladora y nacimiento del derecho, competencias y control medico, extincion y determinacion de contingencia.',
  source_file: 'Tema 8 - Incapacidad temporal - Guía visual de estudio.md',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema8: SourceChunk[] = [
  {
    id: 'chunk_tema8_1', topic_id: TOPIC, article_reference: 'Art. 169 TRLGSS', order_index: 1,
    raw_text: 'La IT ordinaria protege enfermedad común o profesional y accidente, sea o no de trabajo, con asistencia sanitaria de la Seguridad Social e impedimento laboral. Dura 365 días y puede prorrogarse 180 más si se presume alta por curación; máximo 545 días naturales.',
    summary: 'Concepto y duración ordinaria: 365 + 180 = 545 días naturales.',
  },
  {
    id: 'chunk_tema8_2', topic_id: TOPIC, article_reference: 'Art. 169 TRLGSS (observación por EP)', order_index: 2,
    raw_text: 'El periodo de observación por enfermedad profesional con baja prescrita dura hasta 180 días, prorrogables por otros 180 cuando se estime necesario para estudio y diagnóstico.',
    summary: 'Observación por enfermedad profesional: máximo de 360 días.',
  },
  {
    id: 'chunk_tema8_3', topic_id: TOPIC, article_reference: 'Arts. 169, 172 y 173 TRLGSS', order_index: 3,
    raw_text: 'Situaciones especiales: menstruación incapacitante secundaria, interrupción del embarazo, gestación desde la semana 39 y donación de órganos o tejidos. Varían la carencia exigible, el día de nacimiento del subsidio y la cuantía; la donación incluye preparación, ingreso y recuperación hasta el alta por curación.',
    summary: 'Situaciones especiales de IT por contingencias comunes y sus reglas específicas.',
  },
  {
    id: 'chunk_tema8_4', topic_id: TOPIC, article_reference: 'Arts. 172 y 249 bis TRLGSS', order_index: 4,
    raw_text: 'Enfermedad común exige 180 días cotizados en los cinco años anteriores; accidente y enfermedad profesional no exigen carencia. Contrato temporal de hasta cinco días: cada día computa 1,4, con límite mensual; se excluyen tiempo parcial, relevo parcial y fijos discontinuos.',
    summary: 'Carencia y coeficiente de cómputo en contratos de hasta cinco días.',
  },
  {
    id: 'chunk_tema8_5', topic_id: TOPIC, article_reference: 'Art. 173 TRLGSS', order_index: 5,
    raw_text: 'En enfermedad común el subsidio nace el cuarto día; del cuarto al decimoquinto paga la empresa y la entidad asume desde el decimosexto. En AT/EP nace al día siguiente y el empresario paga íntegro el día de baja. La base de tiempo parcial atiende a bases acreditadas y días naturales; en pluriempleo opera el tope máximo.',
    summary: 'Nacimiento, cuantía, bases reguladoras y pagos iniciales.',
  },
  {
    id: 'chunk_tema8_6', topic_id: TOPIC, article_reference: 'Art. 170 TRLGSS', order_index: 6,
    raw_text: 'Agotados 365 días, el INSS es competente para el alta, la propuesta de IP y nueva baja similar en los 180 días siguientes. Disconformidad: 4-7-7 días naturales; durante el trámite se considera prorrogada la IT. Alta con propuesta de IP extingue IT y abre prolongación de efectos económicos.',
    summary: 'Competencias tras 365 días, disconformidad y efectos del alta con propuesta de IP.',
  },
  {
    id: 'chunk_tema8_7', topic_id: TOPIC, article_reference: 'Art. 174 TRLGSS', order_index: 7,
    raw_text: 'Agotados 545 días se extingue el subsidio; nuevo derecho por similar patología normalmente exige 180 días, con excepción de proceso iniciado por el INSS una vez si aprecia recuperación. Examen y calificación de IP, demora y límite total de 730 días.',
    summary: 'Extinción, recaída, demora de calificación y prolongación económica.',
  },
  {
    id: 'chunk_tema8_8', topic_id: TOPIC, article_reference: 'Art. 6 RD 1430/2009', order_index: 8,
    raw_text: 'Determinación de contingencia: el INSS pide antecedentes a entidades en 4 días hábiles improrrogables; la persona trabajadora dispone de 10 días hábiles para alegar cuando no inició el procedimiento; la resolución se dicta en 15 días hábiles.',
    summary: 'Plazos hábiles 4-10-15 para determinar contingencia.',
  },
  {
    id: 'chunk_tema8_9', topic_id: TOPIC, article_reference: 'RD 625/2014; art. 82 TRLGSS; RD 1403/2009', order_index: 9,
    raw_text: 'Partes de confirmación en días naturales: menos de 5 (mismo acto o revisión a 3); 5-30 (7/14); 31-60 (7/28); 61 o más (14/35). Las mutuas proponen altas en contingencias comunes, sin sustituir el control sanitario del servicio público de salud. Pago delegado y colaboración empresarial se rigen por sus reglas específicas.',
    summary: 'Partes, propuestas de alta, cobertura de mutuas y pago delegado.',
  },
];

export const seedClustersTema8: Cluster[] = [
  { id: 'cluster_it_situaciones_especiales', topic_id: TOPIC, name: 'Concepto, observación y situaciones especiales', description: 'Situaciones determinantes, observación por EP y situaciones especiales de IT común.', type: 'conceptual', priority: 'critical' },
  { id: 'cluster_it_cuantia_nacimiento', topic_id: TOPIC, name: 'Cotización, base reguladora y nacimiento del derecho', description: 'Carencia, contratos cortos, cálculo de base, cuantía e inicio del subsidio.', type: 'numeric', priority: 'critical' },
  { id: 'cluster_it_competencias_control', topic_id: TOPIC, name: 'Competencias, control médico y pago', description: 'INSS, disconformidad, partes, contingencia, mutuas y pago delegado.', type: 'procedural', priority: 'critical' },
  { id: 'cluster_it_extincion_efectos', topic_id: TOPIC, name: 'Extinción, demora y efectos económicos', description: 'Agotamiento, demora de IP, prolongación de efectos y nuevos procesos.', type: 'procedural', priority: 'high' },
];

export const seedConfusionPairsTema8: ConfusionPair[] = [
  {
    id: 'pair_it_dia_baja_vs_dia_siguiente', topic_id: TOPIC,
    concept_a: 'Subsidio desde el día de la baja: menstruación incapacitante y donación de órganos.',
    concept_b: 'Subsidio desde el día siguiente: interrupción, gestación semana 39 y AT/EP; salario empresarial íntegro el día de baja cuando proceda.',
    discriminating_cue: 'Distinguir nacimiento del subsidio en el mismo día frente al día siguiente.',
    common_trap: 'Extender el mismo día de inicio a todas las situaciones especiales.',
    legal_basis_a: 'Arts. 169 y 172 TRLGSS', legal_basis_b: 'Art. 173 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_it_naturales_vs_habiles', topic_id: TOPIC,
    concept_a: 'Días naturales: disconformidad 4-7-7 y confirmaciones RD 625/2014.',
    concept_b: 'Días hábiles: determinación de contingencia 4-10-15 y propuesta de alta 5-4.',
    discriminating_cue: 'Identificar el procedimiento antes de computar días naturales o hábiles.',
    common_trap: 'Confundir los plazos naturales del control con los plazos hábiles de determinación.',
    legal_basis_a: 'Art. 170 TRLGSS; RD 625/2014', legal_basis_b: 'Art. 6 RD 1430/2009', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_it_recaida_vs_proceso_nuevo', topic_id: TOPIC,
    concept_a: 'Regla general: recaída por misma o similar patología en 180 días naturales tras el alta.',
    concept_b: 'Menstruación incapacitante secundaria: cada proceso es nuevo y no consume máximo ni genera recaída.',
    discriminating_cue: 'Comprobar si aplica la excepción específica de menstruación antes de usar los 180 días.',
    common_trap: 'Aplicar la regla general de recaída a la excepción expresa.',
    legal_basis_a: 'Art. 174 TRLGSS', legal_basis_b: 'Art. 170.4 TRLGSS', status: 'validated', severity: 'high',
  },
];
