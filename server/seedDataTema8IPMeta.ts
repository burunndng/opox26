import type { Topic, SourceChunk, Cluster, ConfusionPair } from '../src/types.ts';

/**
 * Tema 8 Específico (II) — Incapacidad permanente.
 * Contenido tomado del mazo de diapositivas "Diaposiivas Tema 8 (ii) SS.pdf",
 * del supuesto de repaso "Supuesto Repaso T. 8 espec (II)" y de las notas del
 * profesor aportadas por el usuario. Todo el material es de elaboración propia
 * sobre esas fuentes; las cifras son internas (fuente secundaria), no BOE.
 */
const TOPIC = 'topic_seguridad_social_tema_8_ip';
const now = '2026-10-27T10:00:00Z';

export const seedTopicTema8IP: Topic = {
  id: TOPIC,
  name: 'Tema 8 Específico (II) — Incapacidad permanente',
  description:
    'BLOQUE ESPECÍFICO (ES). Incapacidad permanente: concepto y grados, base reguladora y cuantía, beneficiarios y carencias, nacimiento, extinción y compatibilidad, lesiones permanentes no invalidantes y procedimiento del INSS/EVI.',
  source_file: 'Diaposiivas Tema 8 (ii) SS.pdf',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema8IP: SourceChunk[] = [
  {
    id: 'chunk_tema8ip_1', topic_id: TOPIC, article_reference: 'Arts. 193 y 194 y DT 26ª TRLGSS', order_index: 1,
    raw_text: 'La IP contributiva exige reducciones anatómicas o funcionales graves, de determinación objetiva y previsiblemente definitivas, que disminuyan o anulen la capacidad laboral tras el tratamiento prescrito. Cuatro grados: parcial (≥33 % de reducción sin impedir las tareas fundamentales), total (no puede realizar todas o las fundamentales de su profesión habitual, pero sí otra distinta), absoluta (no puede dedicarse a ninguna profesión u oficio) y gran invalidez (absoluta más necesidad de asistencia de otra persona para los actos esenciales de la vida).',
    summary: 'Concepto, los cuatro grados y profesión habitual.',
  },
  {
    id: 'chunk_tema8ip_2', topic_id: TOPIC, article_reference: 'Arts. 196 y 197 TRLGSS', order_index: 2,
    raw_text: 'Enfermedad común con periodo mínimo ≥8 años: BR = bases de los 96 meses anteriores al mes previo al hecho causante divididas entre 112, nominales las 24 últimas y actualizadas por IPC las anteriores. Con periodo mínimo <8 años se computan bases en número igual a los meses del periodo mínimo, sin fracciones de mes y sin actualizar las 24 últimas. Accidente no laboral en alta: suma de 24 bases ininterrumpidas elegidas por el interesado en los 7 años previos dividida entre 28. Sin alta (absoluta o gran invalidez por comunes): 112 divisor sobre 96 meses. Accidente de trabajo o EP: salario real.',
    summary: 'Fórmulas de base reguladora según contingencia y situación de alta.',
  },
  {
    id: 'chunk_tema8ip_3', topic_id: TOPIC, article_reference: 'Art. 195 TRLGSS', order_index: 3,
    raw_text: 'No se exige cotización previa cuando la IP deriva de accidente, sea o no de trabajo, o de EP. Parcial: 1.800 días en los 10 años anteriores a la extinción de la IT. Total, absoluta y gran invalidez: menores de 31 años, 1/3 del tiempo entre los 16 años y el hecho causante; de 31 o más, 1/4 entre los 20 años y el hecho causante, mínimo 5 años, y al menos 1/5 del periodo exigible dentro de los 10 años anteriores. Sin alta: 15 años, 3 de ellos en los 10 anteriores; para doble pensión con otro régimen las cotizaciones deben superponerse 15 años.',
    summary: 'Beneficiarios, carencias genéricas por edad y acceso sin alta.',
  },
  {
    id: 'chunk_tema8ip_4', topic_id: TOPIC, article_reference: 'Arts. 195, 247 y 249 bis TRLGSS', order_index: 4,
    raw_text: 'Cotización asimilada por parto: 112 días por hijo único y 14 días más por cada hijo a partir del segundo, computables en IP y en jubilación. Trabajadores a tiempo parcial: los periodos de alta computan con independencia de la duración de la jornada. Contratos de hasta 5 días: cada día trabajado computa como 1,4 días, con límite mensual.',
    summary: 'Reglas particulares de cómputo de cotización.',
  },
  {
    id: 'chunk_tema8ip_5', topic_id: TOPIC, article_reference: 'Orden de 18 de enero de 1996, art. 13', order_index: 5,
    raw_text: 'Parcial: hecho causante en la extinción de la IT (agotamiento o alta con propuesta); sin IT previa, en el dictamen-propuesta del EVI; efectos económicos desde la resolución. Total y cualificada: hecho causante en la extinción de la IT; efectos en la fecha de calificación, retrotrayéndose al día siguiente a la extinción de la IT si la pensión supera al subsidio; la cualificada surte efectos desde la solicitud con 3 meses máximo de retroactividad. Absoluta y gran invalidez: mismos efectos pero sin retroacción si la persona estuvo en demora de calificación; sin IT previa, hecho causante en la fecha de la solicitud.',
    summary: 'Hecho causante y efectos económicos de cada grado.',
  },
  {
    id: 'chunk_tema8ip_6', topic_id: TOPIC, article_reference: 'Arts. 198 y 200 TRLGSS', order_index: 6,
    raw_text: 'La pensión es vitalicia salvo revisión, y se extingue por revisión, fallecimiento o derecho a la pensión de jubilación. La IP total es compatible con el salario si las funciones no coinciden con las que la originaron; el incremento del 20 % de la cualificada es incompatible con el trabajo. La IP absoluta y la gran invalidez son compatibles con actividades que no supongan cambio de capacidad de trabajo. Al cumplir 67 años las pensiones de IP pasan a denominarse de jubilación sin modificar sus condiciones. El INSS puede revisar en cualquier momento cuando el beneficiario trabaja o ejerce actividad, y por error de diagnóstico antes de la edad de jubilación.',
    summary: 'Duración, extinción, compatibilidades y revisión de oficio.',
  },
  {
    id: 'chunk_tema8ip_7', topic_id: TOPIC, article_reference: 'Arts. 201 a 203 TRLGSS; Orden ISM 450/2023', order_index: 7,
    raw_text: 'Las lesiones permanentes no invalidantes son lesiones, mutilaciones o deformidades definitivas causadas por AT o EP que, sin alcanzar la IP, disminuyen o alteran la integridad física y están previstas en el baremo; se indemnizan por una sola vez, a tanto alzado, por la entidad obligada a satisfacer la IP. Son incompatibles con las prestaciones económicas de IP, salvo que las lesiones sean totalmente independientes. Las verifica y reconoce el INSS a propuesta del EVI; el pago lo asume la entidad gestora o la mutua con la que se cubran las contingencias profesionales.',
    summary: 'Lesiones permanentes no invalidantes: definición, incompatibilidad y pago.',
  },
  {
    id: 'chunk_tema8ip_8', topic_id: TOPIC, article_reference: 'RD 1300/1995; art. 48.2 ET', order_index: 8,
    raw_text: 'El INSS es el único competente para declarar, calificar y revisar la IP, cualquiera que sea la entidad gestora o colaboradora. El EVI de cada dirección provincial se compone de presidente y cuatro vocales y emite dictámenes preceptivos y no vinculantes. La resolución es expresa, inmediatamente ejecutiva y fija el plazo de revisión; el silencio a los 135 días deniega la solicitud. La suspensión del contrato con reserva de puesto solo procede si la resolución prevé un plazo de revisión igual o inferior a 2 años; si es superior, el contrato se extingue.',
    summary: 'Competencia, EVI, resolución, silencio y efectos laborales del art. 48.2 ET.',
  },
];

export const seedClustersTema8IP: Cluster[] = [
  { id: 'cluster_ip_concepto_grados', topic_id: TOPIC, name: 'Concepto, grados y profesión habitual', description: 'Definición legal, los cuatro grados, profesión habitual y excepciones al requisito de IT previa.', type: 'conceptual', priority: 'critical' },
  { id: 'cluster_ip_base_reguladora_cuantia', topic_id: TOPIC, name: 'Base reguladora y cuantía', description: 'Fórmulas de BR por contingencia, porcentajes por grado y edad, complemento e indemnización.', type: 'numeric', priority: 'critical' },
  { id: 'cluster_ip_carencia_beneficiarios', topic_id: TOPIC, name: 'Beneficiarios y carencias', description: 'Periodos mínimos de cotización, reglas por edad, acceso sin alta y reglas particulares de cómputo.', type: 'numeric', priority: 'critical' },
  { id: 'cluster_ip_nacimiento_revision_extincion', topic_id: TOPIC, name: 'Nacimiento, extinción y compatibilidad', description: 'Hecho causante, efectos económicos, retroacción, causas de extinción y compatibilidades.', type: 'procedural', priority: 'critical' },
  { id: 'cluster_ip_lpni_procedimiento', topic_id: TOPIC, name: 'Lesiones no invalidantes y procedimiento', description: 'LPNI, EVI, resolución y silencio, y efectos laborales de la revisión del grado.', type: 'procedural', priority: 'high' },
];

export const seedConfusionPairsTema8IP: ConfusionPair[] = [
  {
    id: 'pair_ip_parcial_vs_total', topic_id: TOPIC,
    concept_a: 'Parcial: reducción ≥33 % que no impide las tareas fundamentales; prestación única de 24 mensualidades.',
    concept_b: 'Total: inhabilitación para las tareas fundamentales de la profesión habitual, con pensión vitalicia al 55 %.',
    discriminating_cue: 'Preguntar primero si se impiden las tareas fundamentales y después la forma de pago.',
    common_trap: 'Dar pensión vitalicia al grado parcial o exigir para la parcial las tareas fundamentales.',
    legal_basis_a: 'DT 26ª TRLGSS', legal_basis_b: 'Arts. 194 y 196 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_total_vs_absoluta', topic_id: TOPIC,
    concept_a: 'Total: no puede realizar las tareas fundamentales de su profesión habitual, pero sí dedicarse a otra distinta.',
    concept_b: 'Absoluta: no puede dedicarse a ninguna profesión u oficio.',
    discriminating_cue: 'La clave es si cabe dedicarse a otra profesión distinta.',
    common_trap: 'Tratar la absoluta como la total agravada por la edad o por la duración de la IT.',
    legal_basis_a: 'Art. 194 TRLGSS', legal_basis_b: 'Art. 194 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_absoluta_vs_gi', topic_id: TOPIC,
    concept_a: 'Absoluta: cualquier profesión u oficio, pensión del 100 % de la BR.',
    concept_b: 'Gran invalidez: absoluta más necesidad de asistencia de otra persona para vestirse, desplazarse o comer; añade complemento del 45 % de la base mínima más el 30 % de la última base.',
    discriminating_cue: 'Preguntar si necesita asistencia de otra persona para los actos esenciales de la vida.',
    common_trap: 'Otorgar el complemento de gran invalidez a toda pensión de IP absoluta.',
    legal_basis_a: 'Arts. 194 y 196 TRLGSS', legal_basis_b: 'Arts. 194 y 196 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_br_vs_importe', topic_id: TOPIC,
    concept_a: 'Base reguladora: magnitud de cálculo que resulta de aplicar la fórmula del art. 197 o del salario real.',
    concept_b: 'Importe de la pensión: producto de aplicar a la base reguladora el porcentaje del grado (55 %, 75 % o 100 %) más el complemento si procede.',
    discriminating_cue: 'Leer si la pregunta pide la base reguladora o el importe de la pensión.',
    common_trap: 'Elegir la base reguladora como importe de la pensión: fallo seguro en el examen.',
    legal_basis_a: 'Art. 197 TRLGSS', legal_basis_b: 'Art. 196 TRLGSS', status: 'validated', severity: 'critical',
  },
  {
    id: 'pair_ip_carencia_edad', topic_id: TOPIC,
    concept_a: 'Menores de 31 años: 1/3 del tiempo entre los 16 años y el hecho causante.',
    concept_b: 'De 31 años o más: 1/4 del tiempo entre los 20 años y el hecho causante, mínimo 5 años y 1/5 dentro de los 10 años anteriores.',
    discriminating_cue: 'Situar la edad en el hecho causante antes de elegir divisor y año de cómputo.',
    common_trap: 'Aplicar la tercera parte a partir de los 20 años o la cuarta parte a partir de los 16.',
    legal_basis_a: 'Art. 195.3 TRLGSS', legal_basis_b: 'Art. 195.3 TRLGSS', status: 'validated', severity: 'critical',
  },
  {
    id: 'pair_ip_hc_vs_efectos', topic_id: TOPIC,
    concept_a: 'Hecho causante: fecha de extinción de la IT o, sin IT previa, dictamen del EVI o fecha de la solicitud.',
    concept_b: 'Efectos económicos: fecha de la calificación, con retroacción a la extinción de la IT solo si la pensión supera al subsidio.',
    discriminating_cue: 'Distinguir siempre la fecha del hecho causante de la fecha de efectos económicos.',
    common_trap: 'Confundir el hecho causante con el reconocimiento económico o retrotraer en demora de calificación.',
    legal_basis_a: 'Art. 13 Orden 18/1996', legal_basis_b: 'Art. 13 Orden 18/1996', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_declaracion_vs_pago', topic_id: TOPIC,
    concept_a: 'Declaración: el INSS verifica, califica y reconoce, cualquiera que sea la entidad gestora o colaboradora.',
    concept_b: 'Pago: lo asume la entidad gestora o la mutua con la que se cubran las contingencias profesionales.',
    discriminating_cue: 'Separar siempre quién declora de quién paga antes de elegir.',
    common_trap: 'Hacer que la mutua declare o que la empresa pague definitivamente la prestación.',
    legal_basis_a: 'Arts. 201 y 204 TRLGSS; RD 1300/1995', legal_basis_b: 'Art. 201 TRLGSS', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_suspension_vs_extincion', topic_id: TOPIC,
    concept_a: 'Plazo de revisión igual o inferior a 2 años: el contrato se suspende con reserva de puesto.',
    concept_b: 'Plazo de revisión superior a 2 años: el contrato de trabajo se extingue.',
    discriminating_cue: 'Localizar el plazo de revisión que fija la resolución inicial.',
    common_trap: 'Aplicar siempre la suspensión, o extinguir el contrato con revisión a dos años.',
    legal_basis_a: 'Art. 7 RD 1300/1995; art. 48.2 ET', legal_basis_b: 'Art. 48.2 ET y art. 49.1.n) ET', status: 'validated', severity: 'high',
  },
  {
    id: 'pair_ip_lpni_vs_ip', topic_id: TOPIC,
    concept_a: 'Lesiones permanentes no invalidantes: integridad física disminuida sin impide el trabajo; indemnización única a tanto alzado.',
    concept_b: 'Incapacidad permanente parcial: reducción ≥33 % del rendimiento normal que sí afecta al desempeño profesional; 24 mensualidades.',
    discriminating_cue: 'Preguntar si la lesión impide o no el trabajo y si está baremada.',
    common_trap: 'Tratar las LPNI como una incapacidad permanente parcial encubierta.',
    legal_basis_a: 'Arts. 201 a 203 TRLGSS', legal_basis_b: 'DT 26ª TRLGSS', status: 'validated', severity: 'high',
  },
];
