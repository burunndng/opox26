import type { Topic, SourceChunk, Cluster, ConfusionPair } from '../src/types.ts';

/**
 * Tema 9 Específico — Nacimiento y cuidado de menor y prestaciones familiares.
 * Fuente: notas y diapositivas de ESPECIFICO/T9/ (clase 4-11), resumen y
 * "Supuesto repaso t. 9 especif,.pdf.md". Cifras internas (no BOE-verificadas
 * para importes específicos de la LPGE); anclas normativas del resumen.
 */
const TOPIC = 'topic_seguridad_social_tema_9';
const now = '2026-11-04T10:00:00Z';

export const seedTopicTema9: Topic = {
  id: TOPIC,
  name: 'Tema 9 Específico — Nacimiento y cuidado de menor y prestaciones familiares',
  description:
    'Subsidio contributivo de nacimiento y cuidado de menor, no contributivo, corresponsable del lactante, riesgos durante embarazo y lactancia, asignación por hijo con discapacidad, pagos únicos (numerosa/monoparental, múltiple) y cuidado de menores con cáncer o enfermedad grave.',
  source_file: 'RESUMEN Y NOTAS TEMA 9 especifico 4-11.txt / RESUMEN Y NOTAS TTEMA 9 especifico 4-11 parte 2.txt / Diaposiivas tema 9 ss.md / Supuesto repaso t. 9 especif,.pdf.md',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema9: SourceChunk[] = [
  { id: 'chunk_tema9_1', topic_id: TOPIC, page_number: 1, article_reference: 'Art. 177 TRLGSS', raw_text: 'Hecho causante y situaciones protegidas (nacimiento, adopción, guarda, acogimiento). Requisitos materiales del causante (≤6 años; 6-18 si ≥33% o dificultades).', summary: 'Situaciones protegidas y requisitos del adoptado/acogido.', order_index: 1 },
  { id: 'chunk_tema9_2', topic_id: TOPIC, page_number: 2, article_reference: 'Art. 178 TRLGSS', raw_text: 'Requisitos beneficiarios: alta/asimilada. Carencia graduada por edad (<21=0; 21-25: 90/180; ≥26: 180/360). Edad a fecha del hecho causante; carencia verificada a fecha del parto.', summary: 'Carencia por edad y referencia temporal.', order_index: 2 },
  { id: 'chunk_tema9_3', topic_id: TOPIC, page_number: 2, article_reference: 'Art. 179 y 248 TRLGSS', raw_text: 'BR por nacimiento: mes anterior al mes previo al hecho causante (÷30 mensual); tiempo parcial <12 meses: suma bases ÷ días naturales (12 meses: ÷365).', summary: 'Base reguladora general, reciente y a tiempo parcial.', order_index: 3 },
  { id: 'chunk_tema9_4', topic_id: TOPIC, page_number: 3, article_reference: 'Art. 8 RD 295/2009; Art. 48 ET', raw_text: 'Duración y distribución: 6 semanas obligatorias; 11/22 voluntarias; 2/4 semanas parentales hasta los 8 años. Anticipación 4 semanas; monoparental 32 semanas.', summary: 'Distribución del descanso y supuestos singulares.', order_index: 4 },
  { id: 'chunk_tema9_5', topic_id: TOPIC, page_number: 4, article_reference: 'Art. 12 RD 295/2009; Art. 180 TRLGSS', raw_text: 'Sin pago delegado: INSS/ISM paga directamente; empresa solo cuota patronal; INSS retiene cuota obrera. Suspensión/extinción (fraude, trabajo incompatible, artistas/taurinos con descubierto).', summary: 'Gestión, pago y suspensión del subsidio.', order_index: 5 },
  { id: 'chunk_tema9_6', topic_id: TOPIC, page_number: 4, article_reference: 'Art. 284 TRLGSS', raw_text: 'Interacción con desempleo: se agota nacimiento y luego desempleo sin descuento; durante desempleo se suspende y luego se reanuda por duración pendiente.', summary: 'Nacimiento y desempleo.', order_index: 6 },
  { id: 'chunk_tema9_7', topic_id: TOPIC, page_number: 5, article_reference: 'Arts. 181-182 TRLGSS', raw_text: 'No contributivo: alta/asimilada sin carencia; 100% IPREM salvo BR inferior; 42 días naturales +14 tasados no acumulables (máx. 56). 4 supuestos: numerosa, monoparental, múltiple, discapacidad ≥65%.', summary: 'Subsidio no contributivo.', order_index: 7 },
  { id: 'chunk_tema9_8', topic_id: TOPIC, page_number: 5, article_reference: 'Arts. 183-185 TRLGSS; Art. 37.4 ET', raw_text: 'Ejercicio corresponsable del lactante: ambos reducen media hora (9-12 meses); solo un beneficiario del subsidio; 100% BR IT comunes, proporcional; exclusión funcionarios (48.f TREBEP).', summary: 'Corresponsable del lactante.', order_index: 8 },
  { id: 'chunk_tema9_9', topic_id: TOPIC, page_number: 6, article_reference: 'Arts. 186-189 TRLGSS; Art. 26 LPRL', raw_text: 'Riesgo embarazo: profesional, 100% BR IT profesional, INSS/Mutua, sin carencia, adaptación/reubicación no posible. Lactancia: mismo régimen; límite 9 meses; reincorporación previa → extinción día anterior.', summary: 'Riesgos durante embarazo y lactancia.', order_index: 9 },
  { id: 'chunk_tema9_10', topic_id: TOPIC, page_number: 7, article_reference: 'Arts. 351-353 TRLGSS; RD 1335/2005', raw_text: 'Asignación por hijo con discapacidad: <18 ≥33% / >18 ≥65% / >18 ≥75% + concurso 3ª persona; 100% SMI anual límite ingresos; valoración CCAA/IMSERSO; INSS reconoce/paga.', summary: 'Asignación por discapacidad.', order_index: 10 },
  { id: 'chunk_tema9_11', topic_id: TOPIC, page_number: 8, article_reference: 'Art. 357 TRLGSS; Ley 40/2003', raw_text: 'Pago único 1.000 €: familias numerosas, monoparentales, progenitor con discapacidad ≥65%. Residencia legal; límite ingresos LPGE (+15% desde 2º hijo).', summary: 'Pago único (numerosa/monoparental/discapacidad).', order_index: 11 },
  { id: 'chunk_tema9_12', topic_id: TOPIC, page_number: 8, article_reference: 'Arts. 359-360 TRLGSS', raw_text: 'Pago único por parto/adopción múltiple: 4 / 8 / 12 veces SMI (2, 3, 4+ hijos). Residencia legal; sin límite de rentas; sin carencia.', summary: 'Parto/adopción múltiple.', order_index: 12 },
  { id: 'chunk_tema9_13', topic_id: TOPIC, page_number: 8, article_reference: 'Arts. 190-192 TRLGSS; Art. 37.6 ET', raw_text: 'Cuidado menores con cáncer/enfermedad grave: reducción ≥50% y ≤99%; trabajo conjunto (excepciones: nulidad, separación, violencia de género); informe SPS; límite 18→23→26 (+ indefinida con ≥65% o Grado III).', summary: 'Cuidado de menores con cáncer/enfermedad grave.', order_index: 13 },
];

export const seedClustersTema9: Cluster[] = [
  { id: 'cluster_nacimiento_br', topic_id: TOPIC, name: 'Base reguladora y cuantía de nacimiento', description: 'Reglas de cálculo de BR (general, reciente, parcial) y cuantía 100% exenta de IRPF.', type: 'numeric', priority: 'critical' },
  { id: 'cluster_nacimiento_duracion', topic_id: TOPIC, name: 'Duración y distribución del descanso', description: '6 obligatorias; 11/22 voluntarias; 2/4 parentales; preaviso 15 días; anticipación 4 semanas.', type: 'procedural', priority: 'critical' },
  { id: 'cluster_nacimiento_carencia', topic_id: TOPIC, name: 'Carencia por edad y referencia temporal', description: '<21 (0), 21-25 (90/180), ≥26 (180/360); referencia al hecho causante y fecha probable de parto.', type: 'numeric', priority: 'critical' },
  { id: 'cluster_nacimiento_no_delegado', topic_id: TOPIC, name: 'Pago directo y cotización', description: 'Sin pago delegado; INSS retiene cuota obrera; empresa mantiene cuota patronal; cotización con horas extras para profesional.', type: 'institutional', priority: 'high' },
  { id: 'cluster_nacimiento_desempleo', topic_id: TOPIC, name: 'Interacción con desempleo', description: 'Despido en descanso: agota nacimiento sin descuento; nacimiento durante paro: suspende paro sin consumo.', type: 'procedural', priority: 'high' },
  { id: 'cluster_nacimiento_casos', topic_id: TOPIC, name: 'Casos singulares (parto múltiple, hospitalización, fallecimiento)', description: 'Subsidio 6 semanas adicionales por cada hijo ≥2 (único pago tras 6 semanas); hospitalización >7 días (máx. 13 semanas); fallecimiento del menor/progenitor.', type: 'procedural', priority: 'high' },
  { id: 'cluster_subsidio_nc', topic_id: TOPIC, name: 'Subsidio no contributivo y ampliaciones', description: '42 días naturales; +14 no acumulables (numerosa, monoparental, múltiple, discapacidad ≥65%).', type: 'numeric', priority: 'high' },
  { id: 'cluster_lactante', topic_id: TOPIC, name: 'Ejercicio corresponsable del lactante', description: '9-12 meses; media hora; ambos trabajan; solo un beneficiario; 100% BR comunes; exclusión funcionarios (TREBEP).', type: 'procedural', priority: 'high' },
  { id: 'cluster_riesgos', topic_id: TOPIC, name: 'Riesgos embarazo y lactancia', description: 'Profesional; 100% BR profesional; INSS/Mutua; sin carencia; lactancia límite 9 meses.', type: 'institutional', priority: 'critical' },
  { id: 'cluster_asignacion_discapacidad', topic_id: TOPIC, name: 'Asignación por hijo con discapacidad', description: 'Tramos 33% (<18) / 65% (>18) / 75% + concurso 3ª; 100% SMI límite; CCAA/IMSERSO valora; INSS paga.', type: 'numeric', priority: 'high' },
  { id: 'cluster_pagos_unicos', topic_id: TOPIC, name: 'Prestaciones de pago único', description: '1.000 € (numerosa/monoparental/discapacidad); múltiple: 4/8/12 × SMI.', type: 'numeric', priority: 'high' },
  { id: 'cluster_cuidado_cancer', topic_id: TOPIC, name: 'Cuidado menores con cáncer/enfermedad grave', description: 'Reducción ≥50%≤99%; trabajo conjunto; informe SPS; límite 18/23/26; simultáneo 50%.', type: 'procedural', priority: 'high' },
  { id: 'cluster_br_it_vs_nacimiento', topic_id: TOPIC, name: 'Distinción BR nacimiento vs IT', description: 'Nacimiento: mes anterior al mes previo; IT: mes inmediatamente anterior al hecho causante.', type: 'conceptual', priority: 'high' },
];

export const seedConfusionPairsTema9: ConfusionPair[] = [
  {
    id: 'pair_br_nacimiento_it',
    topic_id: TOPIC,
    concept_a: 'BR nacimiento (mes previo al mes del hecho causante, ÷30 o ÷365 parcial)',
    concept_b: 'BR IT (mes inmediatamente anterior al hecho causante, ÷30)',
    discriminating_cue: 'Si el hecho es nacimiento, se retrocede dos meses; si es baja IT, se toma el mes anterior inmediato.',
    common_trap: 'Aplicar la regla de la IT (un mes antes) al nacimiento, o confundir el divisor (30/365).',
    legal_basis_a: 'Art. 179 TRLGSS; Art. 248', legal_basis_b: 'Art. 173 TRLGSS', status: 'validated', severity: 'critical',
  },
  {
    id: 'pair_subsidio_nc_14',
    topic_id: TOPIC,
    concept_a: 'Subsidio no contributivo: 42 días naturales + 14 no acumulables (máx. 56)',
    concept_b: 'Subsidio por nacimiento contributivo ordinario (19 o 32 semanas)',
    discriminating_cue: 'No contributivo solo cubre las 6 semanas obligatorias; 14 son adicionales y no se acumulan.',
    common_trap: 'Creer que el no contributivo cubre las 19 semanas o que los 14 días son acumulables.',
    legal_basis_a: 'Arts. 181-182 TRLGSS', legal_basis_b: 'Arts. 177 y 48 ET', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_lactante_titularidad',
    topic_id: TOPIC,
    concept_a: 'Ambos progenitores reducen jornada (media hora, 9-12 meses)',
    concept_b: 'El subsidio solo se reconoce a UNO de ellos (no a ambos simultáneos)',
    discriminating_cue: 'El derecho laboral (reducir) es de ambos; el derecho económico es de uno solo.',
    common_trap: 'Pensar que el subsidio se reparte a ambos, como en IT conjunta.',
    legal_basis_a: 'Art. 183 TRLGSS', legal_basis_b: 'Art. 184 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_asignacion_discapacidad_tramos',
    topic_id: TOPIC,
    concept_a: 'Acceso: <18 ≥33% / >18 ≥65%',
    concept_b: 'Cuantías: tres tramos (33%, 65%, 75% + concurso 3ª persona) con importes distintos',
    discriminating_cue: 'Para el acceso hay dos requisitos (edad/discapacidad); para la cuantía hay tres tramos.',
    common_trap: 'Confundir el 75% (cuantía) con un requisito de acceso, o exigir solo 33% a los mayores.',
    legal_basis_a: 'Arts. 351-352', legal_basis_b: 'Art. 353 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_riesgo_embarazo_lactancia',
    topic_id: TOPIC,
    concept_a: 'Riesgo embarazo: suspensión por riesgo; profesional; 100% BR profesional',
    concept_b: 'Riesgo lactancia: mismo régimen; límite 9 meses; reincorporación previa → extinción día anterior',
    discriminating_cue: 'El embarazo no tiene límite temporal (fin al nacer); la lactancia se extingue a los 9 meses del menor.',
    common_trap: 'Aplicar el límite de 9 meses al embarazo o suponer duración indefinida en lactancia.',
    legal_basis_a: 'Arts. 186-187', legal_basis_b: 'Art. 189', status: 'validated', severity: 'high',
  },
];
