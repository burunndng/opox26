/**
 * Metadata for Seguridad Social Tema 10 (Bloque Específico):
 * "Protección por jubilación" (arts. 165, 205–215 TRLGSS).
 *
 * Source of truth: class of 2026-11-18 (transcript + Diaposiivas tema 10ss.pdf)
 * and the BOE consolidated text verified 2026-11-19/20:
 *   - RDLeg 8/2015 (BOE-A-2015-11724): arts. 60, 153, 165, 205–210, 213–215,
 *     DT 40 y DT 41.
 *   - RD 453/2022 (BOE-A-2022-9850): arts. 3 y 4 (hecho causante y efectos).
 *   - RDL 3/2026 (BOE-A-2026-2548): arts. 1–2 (tope y brecha de género 2026).
 *   - RD 1539/2003 (BOE-A-2003-23401): coeficientes 0,25 y 0,50.
 *
 * Deliberately deferred (see §7 of the class resumen): the deck's 7,5% table,
 * the 56-year floor for 45% disability, the professor's own hypothesis on the
 * 45% calculation, the 2025 TJUE judgment and the 1,4-day rule for ≤5-day
 * contracts. None of those is encoded as a key.
 */

import type { Topic, Cluster, ConfusionPair } from '../src/types.ts';

const TOPIC = 'topic_seguridad_social_tema_10';
const now = '2026-11-20T00:00:00Z';

export const seedTopicTema10: Topic = {
  id: TOPIC,
  name: 'Tema 10 Específico — Protección por jubilación',
  description:
    'BLOQUE ESPECÍFICO (ES). Requisitos de edad y cotización, hecho causante y efectos ' +
    'económicos, base reguladora (art. 209 y DT 40), cuantía, jubilación anticipada ' +
    '(causa no imputable, voluntad, actividad y discapacidad), jubilación parcial, flexible ' +
    'y activa, y complemento por brecha de género.',
  source_file: 'Diaposiivas tema 10ss.pdf',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedClustersTema10: Cluster[] = [
  {
    id: 'cluster_t10_hecho_causante_efectos',
    topic_id: TOPIC,
    name: 'Hecho causante y efectos económicos de la jubilación',
    type: 'procedural',
    priority: 'critical',
    description:
      'Elección de fecha por el interesado (±3 meses), especialidades del art. 3.2 RD 453/2022, ' +
      'imprescriptibilidad y límites de retroactividad del art. 4.',
  },
  {
    id: 'cluster_t10_requisitos_edad_cotizacion',
    topic_id: TOPIC,
    name: 'Requisitos: edad ordinaria y períodos de cotización',
    type: 'numeric',
    priority: 'critical',
    description:
      'Art. 205 TRLGSS: 67 años, 65 con 38 años y 6 meses; 15 años cotizados, 2 dentro ' +
      'de los 15 anteriores; acceso sin alta del art. 205.3.',
  },
  {
    id: 'cluster_t10_base_reguladora',
    topic_id: TOPIC,
    name: 'Base reguladora: art. 209 y disposición transitoria cuadragésima',
    type: 'numeric',
    priority: 'critical',
    description:
      'Cálculo general (348 → 324 → ÷378), integración de lagunas, valor nominal e IPC, ' +
      'y régimen transitorio 2026–2037 (2027: 308 → 304 → ÷354,67).',
  },
  {
    id: 'cluster_t10_cuantia_demora',
    topic_id: TOPIC,
    name: 'Cuantía de la pensión y complemento por demora',
    type: 'numeric',
    priority: 'critical',
    description:
      'Art. 210 TRLGSS: 50 % por 15 años, 0,19 % y 0,18 % por mes adicional, tope 100 %, ' +
      'demora +4 %/año y +2 % por fracciones, y límite de la pensión inicial de 2026.',
  },
  {
    id: 'cluster_t10_anticipada_no_imputable',
    topic_id: TOPIC,
    name: 'Jubilación anticipada por causa no imputable al trabajador',
    type: 'exception',
    priority: 'critical',
    description:
      'Art. 207 TRLGSS: adelanto de 4 años, 33 años cotizados, 6 meses de demandante, ' +
      'causas tasadas y acreditación de la indemnización o demanda judicial.',
  },
  {
    id: 'cluster_t10_anticipada_otras',
    topic_id: TOPIC,
    name: 'Anticipación por voluntad, actividad y discapacidad',
    type: 'conceptual',
    priority: 'critical',
    description:
      'Arts. 206, 206 bis y 208 TRLGSS; RD 1539/2003: 2 años/35 años, 0,25 y 0,50, ' +
      'suelo de 52 años y requisitos de la discapacidad ≥45 %.',
  },
  {
    id: 'cluster_t10_parcial_flexible_activa',
    topic_id: TOPIC,
    name: 'Jubilación parcial, flexible y activa',
    type: 'conceptual',
    priority: 'high',
    description:
      'Arts. 213–215 y 153 TRLGSS: reducción de jornada 25–75 %, contrato de relevo, ' +
      'escala de la jubilación activa y cotización especial de solidaridad del 9 %.',
  },
  {
    id: 'cluster_t10_brecha_genero',
    topic_id: TOPIC,
    name: 'Complemento para la reducción de la brecha de género',
    type: 'institutional',
    priority: 'medium',
    description:
      'Art. 60 TRLGSS: requisitos diferenciados por progenitor, cuantía de 2026, ' +
      '14 pagas y reglas de incompatibilidad.',
  },
];

export const seedConfusionPairsTema10: ConfusionPair[] = [
  {
    id: 'pair_t10_hecho_causante_vs_efectos',
    topic_id: TOPIC,
    concept_a: 'Fecha del hecho causante de la pensión de jubilación',
    concept_b: 'Fecha de efectos económicos del reconocimiento',
    discriminating_cue:
      'El hecho causante lo elige el interesado (dentro de ±3 meses) o deriva de las reglas ' +
      'del art. 3.2; los efectos económicos arrancan el día siguiente, salto el límite de ' +
      'retroactividad de tres meses del art. 4.',
    common_trap: 'Confundir la fecha indicada en la solicitud con el primer día de cobro.',
    legal_basis_a: 'Art. 3 RD 453/2022',
    legal_basis_b: 'Art. 4 RD 453/2022',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t10_33_vs_35',
    topic_id: TOPIC,
    concept_a: 'Cotización exigida para la jubilación anticipada no imputable (33 años)',
    concept_b: 'Cotización exigida para la jubilación anticipada voluntaria (35 años)',
    discriminating_cue:
      'Causa ajena a la voluntad → 33 años; voluntad del interesado → 35 años; ambos sin ' +
      'computar la parte proporcional de pagas extraordinarias.',
    common_trap: 'Intercambiar 33 y 35 años entre las dos modalidades.',
    legal_basis_a: 'Art. 207.1.c TRLGSS',
    legal_basis_b: 'Art. 208.1.b TRLGSS',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t10_4_2_3_anos',
    topic_id: TOPIC,
    concept_a: 'Adelanto de cuatro años (causa no imputable)',
    concept_b: 'Adelanto de dos años (voluntad) y de tres (parcial con relevo)',
    discriminating_cue:
      'El adelanto se cuenta hacia atrás desde la edad ordinaria que corresponde a esa ' +
      'persona concreta, no desde los 65 ni desde los 67 genéricos.',
    common_trap: 'Aplicar el adelanto desde una edad fija o confundir los tres topes.',
    legal_basis_a: 'Art. 207.1.a TRLGSS',
    legal_basis_b: 'Arts. 208.1.a y 215.2.a TRLGSS',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t10_art209_vs_dt40',
    topic_id: TOPIC,
    concept_a: 'Base reguladora según el art. 209.1 TRLGSS (teoría)',
    concept_b: 'Base reguladora según la DT cuadragésima (supuestos prácticos desde 2026)',
    discriminating_cue:
      'Art. 209: 348 meses, 324 mejores bases, ÷378. DT 40 en 2027: 308 meses, ' +
      '304 bases, ÷354,67; en 2037 se aplica íntegramente el art. 209.',
    common_trap: 'Usar 348/324/378 en un supuesto práctico fechado en 2027.',
    legal_basis_a: 'Art. 209.1 TRLGSS',
    legal_basis_b: 'DT cuadragésima TRLGSS',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t10_0_25_vs_0_50',
    topic_id: TOPIC,
    concept_a: 'Coeficiente reductor 0,25 por año trabajado con discapacidad ≥65 %',
    concept_b: 'Coeficiente reductor 0,50 con necesidad de concurso de otra persona',
    discriminating_cue:
      'El 0,50 exige, además del grado ≥65 %, la necesidad de asistencia de tercera ' +
      'persona para actos esenciales de la vida ordinaria.',
    common_trap: 'Aplicar 0,50 por el mero hecho de acreditar el 65 %.',
    legal_basis_a: 'Art. 3.a RD 1539/2003',
    legal_basis_b: 'Art. 3.b RD 1539/2003',
    severity: 'critical',
    status: 'validated',
  },
];
