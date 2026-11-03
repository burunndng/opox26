/**
 * Seed data for Constitución Española de 1978 - Tema 3 (Bloque General):
 * "El Tribunal Constitucional. Composición, organización y competencias. Los procedimientos constitucionales."
 *
 * FUENTE DE VERDAD:
 *  - Constitución Española de 1978 (Título IX, arts. 159 a 165; arts. 53.2, 95 y 161.2)
 *  - Ley Orgánica 2/1979, de 3 de octubre, del Tribunal Constitucional (LOTC)
 *  - Ley Orgánica 2/2024, de 1 de agosto, de representación paritaria y presencia equilibrada
 *  - Clase del 26 de octubre (preparador D. Miguel Ángel Muñoz Ariza, Grupo 473):
 *    transcripción "26-10 pt1.txt" y resumen de clase "resumen 26-10 pt1.txt".
 */

import {
  Topic,
  SourceChunk,
  Atom,
  Cluster,
  ConfusionPair,
  Item,
  MCQOption,
  TrapType,
  CognitiveOperation,
} from '../src/types.ts';

const TOPIC = 'topic_constitucion_tema_3';
const now = '2026-03-01T10:00:00Z';

export const seedTopicTema3General: Topic = {
  id: TOPIC,
  name: 'Constitución Española - Tema 3: Bloque General - El Tribunal Constitucional',
  description:
    'BLOQUE GENERAL (CE). El Tribunal Constitucional: naturaleza, composición, estatuto de sus miembros, causas de cese, organización interna (Pleno, Salas, Secciones), competencias y procesos constitucionales (recurso de inconstitucionalidad, cuestión de inconstitucionalidad, recurso de amparo, conflictos de competencia, conflictos entre órganos constitucionales, defensa de la autonomía local, impugnación art. 161.2 CE y control previo de tratados) y resoluciones (sentencias, autos y providencias). Título IX CE y LOTC 2/1979.',
  source_file: 'resumen 26-10 pt1.txt',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema3General: SourceChunk[] = [
  {
    id: 'chunk_tema3g_1',
    topic_id: TOPIC,
    page_number: 1,
    article_reference: 'Arts. 159 CE y 16 a 19 LOTC',
    raw_text:
      'El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey: 4 a propuesta del Congreso por mayoría de 3/5, 4 a propuesta del Senado por mayoría de 3/5 entre candidatos presentados por las Asambleas Legislativas de las CCAA, 2 a propuesta del Gobierno y 2 a propuesta del CGPJ. Requisitos: juristas de reconocida competencia con más de 15 años de ejercicio profesional. Mandato de 9 años con renovación por tercios cada 3 años; sin reelección inmediata salvo mandato no superior a 3 años. Paridad mínima del 40% por sexo en cada renovación parcial (LO 2/2024).',
    summary: 'Composición de 12 miembros, propuesta por órganos constitucionales, requisitos de 15 años, mandato de 9 años por tercios y paridad.',
    order_index: 1,
  },
  {
    id: 'chunk_tema3g_2',
    topic_id: TOPIC,
    page_number: 2,
    article_reference: 'Arts. 159.4-5 CE, 19, 23 y 26 LOTC',
    raw_text:
      'Incompatibilidades: mandato representativo, cargos políticos o administrativos, funciones directivas en partidos o sindicatos, carreras judicial y fiscal, y actividad profesional o mercantil. Miembros independientes e inamovibles. Fuero criminal exclusivo ante la Sala de lo Penal del Tribunal Supremo. Causas de cese (art. 23 LOTC): renuncia, expiración del plazo, incapacidad judicial, incompatibilidad sobrevenida, desatención/violación de reserva, responsabilidad penal dolosa o culpa grave. El transcurso de 3 años no es causa de cese.',
    summary: 'Incompatibilidades, estatuto, fuero ante la Sala 2ª del TS y causas tasadas de cese.',
    order_index: 2,
  },
  {
    id: 'chunk_tema3g_3',
    topic_id: TOPIC,
    page_number: 3,
    article_reference: 'Arts. 9, 10 y 14 LOTC',
    raw_text:
      'Elección de Presidencia y Vicepresidencia: nombrado por el Rey a propuesta del Pleno por votación secreta, mandato de 3 años, reelegible una sola vez. Votaciones: 1ª absoluta, 2ª simple; en caso de empate persiste: 1º mayor antigüedad en el cargo, 2º mayor edad. Organización interna: Pleno (12 magistrados), 2 Salas (6 magistrados cada una: Sala 1ª presidida por Presidente, Sala 2ª por Vicepresidente), Secciones (Presidente y 2 magistrados). Quórum de acuerdos: 2/3 de miembros en Pleno y Salas; 2 miembros en Secciones.',
    summary: 'Elección de Presidencia con regla de desempate antigüedad-edad, organización interna y quórum de dos tercios.',
    order_index: 3,
  },
  {
    id: 'chunk_tema3g_4',
    topic_id: TOPIC,
    page_number: 4,
    article_reference: 'Arts. 161, 162.1.a y 163 CE; arts. 31 a 37 y 79 LOTC',
    raw_text:
      'Recurso de inconstitucionalidad: legitimados Presidente del Gobierno, Defensor del Pueblo, 50 Diputados, 50 Senadores, Gobiernos y Asambleas autonómicas. Plazo general de 3 meses naturales (9 meses con Comisión Bilateral). No suspende la norma. Recurso previo contra proyectos de Estatuto de Autonomía: 3 días hábiles tras aprobación en Cortes, suspende automáticamente trámites y referéndum, resolución en 6 meses. Cuestión de inconstitucionalidad: exclusiva de jueces y tribunales ordinarios, concluso el proceso y en plazo de sentencia; suspende el proceso judicial.',
    summary: 'Recurso ordinario y previo de inconstitucionalidad frente a cuestión judicial de inconstitucionalidad.',
    order_index: 4,
  },
  {
    id: 'chunk_tema3g_5',
    topic_id: TOPIC,
    page_number: 5,
    article_reference: 'Arts. 53.2 y 162.1.b CE; arts. 41 a 46 y 81 LOTC',
    raw_text:
      'Recurso de amparo: protege derechos de los arts. 14, 15 a 29 y 30.2 CE (la vivienda digna del art. 47 CE no goza de amparo). Legitimación: personas físicas o jurídicas con interés legítimo (incluidas SL y SA), Defensor del Pueblo y Ministerio Fiscal. Postulación: abogado y procurador, salvo licenciados o graduados en Derecho que pueden comparecer por sí mismos. Plazos: 3 meses parlamentarios, 20 días hábiles actos administrativos, 30 días hábiles resoluciones judiciales. Regla general: no suspende.',
    summary: 'Recurso de amparo, ámbito de tutela, legitimación de personas jurídicas, postulación y plazos de 20 y 30 días.',
    order_index: 5,
  },
  {
    id: 'chunk_tema3g_6',
    topic_id: TOPIC,
    page_number: 6,
    article_reference: 'Arts. 161.1.c y 161.2 CE; arts. 59 a 78 LOTC',
    raw_text:
      'Conflictos de competencia positivos: órganos ejecutivos de Estado o CCAA en 2 meses (requerimiento potestativo para Estado, preceptivo CCAA). Negativos: tras silencio o negativa de Estado y CCAA en 1 mes. Conflictos entre órganos constitucionales (Gobierno, Congreso, Senado, CGPJ): acuerdo pleno + aviso en 1 mes + formalización en 1 mes. Autonomía local: 1 municipio/provincia destinatario único, o 1/7 municipios con 1/6 población censada, o 50% provincias con 50% población; acuerdo pleno por mayoría absoluta y dictamen preceptivo no vinculante del Consejo de Estado. Impugnación art. 161.2 CE: suspensión automática, ratificar o levantar en 5 meses.',
    summary: 'Conflictos de competencia, conflictos entre órganos, defensa de la autonomía local y suspensión del art. 161.2 CE.',
    order_index: 6,
  },
  {
    id: 'chunk_tema3g_7',
    topic_id: TOPIC,
    page_number: 7,
    article_reference: 'Arts. 164 CE; arts. 86 a 94 LOTC',
    raw_text:
      'Sentencias del TC: publicadas en el BOE, adquieren valor de cosa juzgada desde el día siguiente a su publicación, efectos generales erga omnes, son irrecurribles; solicitud de aclaración en 2 días hábiles siguientes a la notificación. Autos y providencias: cabe recurso de súplica en 3 días hábiles (no suspensivo), resuelto en los 2 días hábiles siguientes.',
    summary: 'Sentencias publicadas en BOE con cosa juzgada y aclaración en 2 días; autos con recurso de súplica en 3 días.',
    order_index: 7,
  },
];

export const seedClustersTema3General: Cluster[] = [
  {
    id: 'cluster_tc_composicion_requisitos',
    topic_id: TOPIC,
    name: 'Composición, designación, requisitos profesionales y paridad del TC',
    type: 'conceptual',
    priority: 'critical',
    description:
      'Doce miembros nombrados por el Rey a propuesta del Congreso (4 por 3/5), Senado (4 por 3/5 entre CCAA), Gobierno (2) y CGPJ (2). Juristas de reconocida competencia con más de 15 años. Mandato 9 años por tercios cada 3 años sin reelección inmediata. Paridad del 40% (LO 2/2024). Incompatibilidades y fuero en Sala 2ª del TS.',
  },
  {
    id: 'cluster_tc_organizacion_cese',
    topic_id: TOPIC,
    name: 'Causas de cese, estatuto, órganos internos (Presidencia, Salas y Secciones) y quórum',
    type: 'procedural',
    priority: 'critical',
    description:
      'Causas tasadas de cese del art. 23 LOTC (el transcurso de 3 años no es cese). Elección de Presidente y Vicepresidente (3 años, 1 reelección; desempate por antigüedad en el cargo y edad). Organización en Pleno (12), 2 Salas (6) y Secciones (3). Quórum de 2/3 en Pleno y Salas.',
  },
  {
    id: 'cluster_tc_inconstitucionalidad',
    topic_id: TOPIC,
    name: 'Control de constitucionalidad: Recurso y Cuestión de Inconstitucionalidad',
    type: 'classification',
    priority: 'critical',
    description:
      'Recurso de inconstitucionalidad (Presidente, Defensor, 50 Diputados, 50 Senadores, CCAA; 3 o 9 meses; no suspende). Recurso previo contra Estatutos (3 días hábiles; suspende automáticamente; 6 meses para resolver). Cuestión de inconstitucionalidad exclusiva de jueces al dictar sentencia (suspende proceso judicial).',
  },
  {
    id: 'cluster_tc_amparo',
    topic_id: TOPIC,
    name: 'Recurso de amparo constitucional: ámbito, legitimación, postulación y plazos',
    type: 'procedural',
    priority: 'critical',
    description:
      'Protección de arts. 14, 15 a 29 y 30.2 CE (exclusión de principios rectores como el art. 47 vivienda). Legitimación de personas físicas y jurídicas (SL/SA), Defensor y Fiscal. Postulación con abogado y procurador (autodefensa para titulados en Derecho). Plazos: 3 meses, 20 días hábiles y 30 días hábiles.',
  },
  {
    id: 'cluster_tc_conflictos',
    topic_id: TOPIC,
    name: 'Conflictos de competencia, órganos constitucionales, autonomía local y art. 161.2 CE',
    type: 'exception',
    priority: 'high',
    description:
      'Conflictos de competencia positivos (2 meses) y negativos. Conflictos entre órganos constitucionales (aviso de 1 mes). Defensa de autonomía local (destinatario único, o 1/7 municipios con 1/6 población; dictamen Consejo de Estado). Impugnación art. 161.2 CE (suspensión automática de 5 meses) y control de tratados (art. 95 CE).',
  },
  {
    id: 'cluster_tc_resoluciones',
    topic_id: TOPIC,
    name: 'Resoluciones del Tribunal Constitucional: sentencias, autos y recursos',
    type: 'procedural',
    priority: 'high',
    description:
      'Sentencias: publicadas en BOE, cosa juzgada al día siguiente, erga omnes, irrecurribles y aclaración en 2 días hábiles. Autos y providencias: recurso de súplica en 3 días hábiles (no suspensivo) con resolución en 2 días hábiles siguientes.',
  },
];

export const seedConfusionPairsTema3General: ConfusionPair[] = [
  {
    id: 'pair_tc_vs_cgpj',
    topic_id: TOPIC,
    concept_a: 'Tribunal Constitucional (Tema 3 General)',
    concept_b: 'Consejo General del Poder Judicial (Tema 6 General)',
    discriminating_cue:
      'TC: 12 miembros, más de 15 años de ejercicio para juristas, mandato de 9 años con renovación por tercios cada 3 años. CGPJ: 20 vocales + Presidente, más de 25 años para juristas de reconocida competencia, mandato de 5 años con renovación global.',
    common_trap:
      'Confundir los requisitos y mandatos: aplicar 25 años o mandato de 5 años al Tribunal Constitucional, o afirmar que el TC forma parte del Poder Judicial.',
    legal_basis_a: 'Arts. 159 CE y 16 LOTC',
    legal_basis_b: 'Art. 122 CE y LOPJ',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_recurso_vs_cuestion_inconstitucionalidad',
    topic_id: TOPIC,
    concept_a: 'Recurso de inconstitucionalidad (vía directa institucional)',
    concept_b: 'Cuestión de inconstitucionalidad (vía prejudicial judicial)',
    discriminating_cue:
      'Recurso: promovido por órganos políticos (Pte. Gobierno, 50 Dip, 50 Sen, Defensor, CCAA) en 3 o 9 meses; por regla general no suspende. Cuestión: planteada exclusivamente por un juez ordinario cuando el proceso está concluso para sentencia; suspende el pleito judicial.',
    common_trap:
      'Atribuir legitimación a los ciudadanos o jueces para el recurso directo, o creer que los particulares pueden interponer directamente la cuestión.',
    legal_basis_a: 'Art. 162.1.a CE y arts. 31 a 34 LOTC',
    legal_basis_b: 'Art. 163 CE y arts. 35 a 37 LOTC',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_desempate_antiguedad_vs_edad',
    topic_id: TOPIC,
    concept_a: '1º Criterio de desempate en Presidencia: mayor antigüedad en el cargo',
    concept_b: '2º Criterio de desempate en Presidencia: mayor edad biológica',
    discriminating_cue:
      'En caso de empate persistente en la elección de Presidente o Vicepresidente del TC, prevalece en primer lugar la experiencia (antigüedad en el cargo de magistrado del TC) y solo a igualdad de antigüedad se acude a la mayor edad.',
    common_trap:
      'Invertir los términos afirmando que se elige en primer término al magistrado de mayor edad cronológica.',
    legal_basis_a: 'Art. 9.2 LOTC',
    legal_basis_b: 'Art. 9.2 LOTC',
    severity: 'high',
    status: 'validated',
  },
  {
    id: 'pair_plazos_amparo_admin_vs_judicial',
    topic_id: TOPIC,
    concept_a: 'Amparo contra actos del Gobierno o Administración: 20 días hábiles (art. 43 LOTC)',
    concept_b: 'Amparo contra resoluciones judiciales: 30 días hábiles (art. 44 LOTC)',
    discriminating_cue:
      'Los actos u omisiones de Administraciones Públicas tienen un plazo de 20 días hábiles tras agotar la vía judicial previa; las lesiones causadas directamente por órganos judiciales tienen un plazo de 30 días hábiles desde la notificación.',
    common_trap:
      'Aplicar 20 días a las resoluciones judiciales o 30 días a los actos de la Administración, o confundirlos con los 3 meses de actos parlamentarios.',
    legal_basis_a: 'Art. 43.2 LOTC',
    legal_basis_b: 'Art. 44.2 LOTC',
    severity: 'high',
    status: 'validated',
  },
  {
    id: 'pair_suspension_recurso_vs_cuestion',
    topic_id: TOPIC,
    concept_a: 'Regla general de no suspensión en recurso de inconstitucionalidad y amparo',
    concept_b: 'Suspensión preceptiva del pleito en la cuestión de inconstitucionalidad',
    discriminating_cue:
      'El recurso directo y el amparo no suspenden con carácter general el acto o ley recurrida (salvo medidas cautelares excepcionales o art. 161.2 CE); la cuestión de inconstitucionalidad suspende preceptivamente el dictado de la sentencia ordinaria.',
    common_trap:
      'Creer que el recurso de inconstitucionalidad paraliza de inmediato la eficacia general de las leyes aprobadas en las Cortes.',
    legal_basis_a: 'Arts. 30 y 56 LOTC',
    legal_basis_b: 'Art. 35.3 LOTC',
    severity: 'high',
    status: 'validated',
  },
];

export const seedAtomsTema3General: Atom[] = [
  {
    id: 'atom-t3g-1',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey: 4 a propuesta del Congreso por 3/5, 4 del Senado por 3/5 entre candidatos de Asambleas autonómicas, 2 del Gobierno y 2 del CGPJ.',
    legal_basis: 'Art. 159.1 CE',
    cluster_id: 'cluster_tc_composicion_requisitos',
    tags: ['composicion', 'nombramiento', 'congreso', 'senado', 'cgpj', 'gobierno'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t3g-2',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Los miembros del Tribunal Constitucional deben ser juristas de reconocida competencia con más de 15 años de ejercicio profesional entre magistrados, fiscales, profesores de universidad, funcionarios y abogados.',
    legal_basis: 'Art. 159.2 CE',
    cluster_id: 'cluster_tc_composicion_requisitos',
    confusion_pair_id: 'pair_tc_vs_cgpj',
    tags: ['requisitos', 'juristas', '15_anos', 'experiencia'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-3',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'El cargo de magistrado del Tribunal Constitucional es incompatible con mandatos representativos, cargos políticos o administrativos, dirección de partidos o sindicatos, carreras judicial y fiscal, y actividad mercantil.',
    legal_basis: 'Art. 159.4 CE y Art. 19 LOTC',
    cluster_id: 'cluster_tc_composicion_requisitos',
    tags: ['incompatibilidades', 'defensor_del_pueblo', 'fiscal_general', 'diputado'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-4',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'Las causas de cese del magistrado están tasadas en el artículo 23 LOTC; el transcurso de un período de 3 años no extingue su mandato individual, que se extiende a 9 años.',
    legal_basis: 'Art. 23 LOTC',
    cluster_id: 'cluster_tc_organizacion_cese',
    tags: ['cese', 'causas_tasadas', '3_anos_trampa', 'mandato'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-5',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Los magistrados del Tribunal Constitucional son designados por un período de 9 años y se renuevan por terceras partes (4 miembros) cada 3 años, sin posibilidad de reelección inmediata salvo mandato anterior no superior a 3 años.',
    legal_basis: 'Art. 159.3 CE y Art. 16 LOTC',
    cluster_id: 'cluster_tc_composicion_requisitos',
    confusion_pair_id: 'pair_tc_vs_cgpj',
    tags: ['mandato', '9_anos', 'renovacion_tercios', '3_anos'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t3g-6',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'En la elección de Presidente y Vicepresidente del TC, si persiste el empate en última votación, se propone al de mayor antigüedad en el cargo y, a igualdad de antigüedad, al de mayor edad.',
    legal_basis: 'Art. 9.2 LOTC',
    cluster_id: 'cluster_tc_organizacion_cese',
    confusion_pair_id: 'pair_desempate_antiguedad_vs_edad',
    tags: ['presidencia', 'desempate', 'antiguedad', 'edad'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-7',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'Están legitimados para el recurso de inconstitucionalidad el Presidente del Gobierno, el Defensor del Pueblo, 50 Diputados, 50 Senadores y los órganos ejecutivos y Asambleas de las Comunidades Autónomas.',
    legal_basis: 'Art. 162.1.a CE y Art. 32 LOTC',
    cluster_id: 'cluster_tc_inconstitucionalidad',
    confusion_pair_id: 'pair_recurso_vs_cuestion_inconstitucionalidad',
    tags: ['legitimacion', 'recurso_inconstitucionalidad', 'defensor_del_pueblo', '50_diputados'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-8',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'La cuestión de inconstitucionalidad sólo puede ser planteada ante el Tribunal Constitucional por un juez o tribunal ordinario, de oficio o a instancia de parte, una vez concluso el procedimiento y dentro del plazo para dictar sentencia.',
    legal_basis: 'Art. 163 CE y Art. 35 LOTC',
    cluster_id: 'cluster_tc_inconstitucionalidad',
    confusion_pair_id: 'pair_recurso_vs_cuestion_inconstitucionalidad',
    tags: ['cuestion_inconstitucionalidad', 'juez', 'tribunal', 'momento_procesal'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-9',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'Las personas jurídicas privadas (incluidas sociedades de responsabilidad limitada y anónimas) ostentan legitimación activa para interponer recurso de amparo constitucional si invocan un interés legítimo.',
    legal_basis: 'Art. 162.1.b CE y Art. 46.1.b LOTC',
    cluster_id: 'cluster_tc_amparo',
    tags: ['amparo', 'personas_juridicas', 'sociedad_limitada', 'interes_legitimo'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-10',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'En los conflictos de competencia positivos entre el Estado y una Comunidad Autónoma, la legitimación corresponde exclusivamente al Gobierno de la Nación y al órgano colegiado ejecutivo (Consejo de Gobierno) de la CCAA afectada.',
    legal_basis: 'Arts. 62 y 63 LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['conflictos_competencia', 'consejo_de_gobierno', 'legitimacion_ejecutiva'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3g-11',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'La exigencia de paridad y presencia equilibrada (al menos un 40% de cada sexo) impuesta por la LO 2/2024 resulta plenamente exigible y aplicable en cada renovación parcial trienal del Tribunal Constitucional.',
    legal_basis: 'Art. 159 CE y LO 2/2024',
    cluster_id: 'cluster_tc_composicion_requisitos',
    tags: ['paridad', '40_por_ciento', 'presencia_equilibrada', 'renovacion_parcial'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-12',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Para la adopción válida de acuerdos en el Pleno y en las Salas del Tribunal Constitucional se requiere la presencia preceptiva de al menos dos tercios de los miembros que los integran.',
    legal_basis: 'Art. 14 LOTC',
    cluster_id: 'cluster_tc_organizacion_cese',
    tags: ['quorum', 'dos_tercios', 'pleno', 'salas'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3g-13',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'El recurso previo contra proyectos de Estatuto de Autonomía se interpone en el plazo de 3 días hábiles desde su aprobación en Cortes, suspende automáticamente todos los trámites y debe resolverse en plazo improrrogable de 6 meses.',
    legal_basis: 'Art. 79 LOTC',
    cluster_id: 'cluster_tc_inconstitucionalidad',
    tags: ['recurso_previo', 'estatuto_autonomia', '3_dias_habiles', 'suspension_automatica'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3g-14',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'El recurso de amparo constitucional tutela únicamente los derechos proclamados en los artículos 14, 15 a 29 y 30.2 de la Constitución; el derecho a la vivienda digna del art. 47 CE queda fuera de esta vía.',
    legal_basis: 'Art. 53.2 CE y Art. 41 LOTC',
    cluster_id: 'cluster_tc_amparo',
    tags: ['amparo', 'derechos_fundamentales', 'exclusion_art_47', 'vivienda'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t3g-15',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'El plazo para interponer recurso de amparo constitucional contra resoluciones judiciales firmes es de 30 días hábiles desde la notificación, mientras que contra actos administrativos es de 20 días hábiles.',
    legal_basis: 'Arts. 43.2 y 44.2 LOTC',
    cluster_id: 'cluster_tc_amparo',
    confusion_pair_id: 'pair_plazos_amparo_admin_vs_judicial',
    tags: ['plazos_amparo', '30_dias_habiles', '20_dias_habiles', 'resoluciones_judiciales'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-16',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'La comparecencia en recurso de amparo requiere procurador y abogado colegiado, pero quienes posean el título de graduado o licenciado en Derecho pueden comparecer y defenderse por sí mismos.',
    legal_basis: 'Art. 81 LOTC',
    cluster_id: 'cluster_tc_amparo',
    tags: ['postulacion', 'abogado', 'procurador', 'autodefensa_licenciado'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-17',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'A diferencia de los recursos directos de inconstitucionalidad y de amparo, el planteamiento de una cuestión de inconstitucionalidad suspende preceptivamente las actuaciones judiciales del proceso a quo.',
    legal_basis: 'Art. 35.3 LOTC',
    cluster_id: 'cluster_tc_inconstitucionalidad',
    confusion_pair_id: 'pair_suspension_recurso_vs_cuestion',
    tags: ['suspension', 'cuestion_inconstitucionalidad', 'proceso_a_quo'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-18',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Para interponer conflicto en defensa de la autonomía local frente a leyes que afecten a varios municipios se requiere acuerdo de al menos 1/7 de los municipios que representen 1/6 de la población oficial censada.',
    legal_basis: 'Art. 75 ter.1.b LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['autonomia_local', 'umbrales', '1_7_municipios', '1_6_poblacion'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3g-19',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'El conflicto en defensa de la autonomía local requiere solicitar con carácter previo el dictamen preceptivo pero no vinculante del Consejo de Estado u órgano consultivo autonómico equivalente.',
    legal_basis: 'Art. 75 ter.3 LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['autonomia_local', 'dictamen_preceptivo', 'consejo_de_estado', 'no_vinculante'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-20',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'La impugnación de disposiciones autonómicas sin fuerza de ley por el Gobierno al amparo del art. 161.2 CE produce su suspensión automática, debiendo el TC ratificarla o levantarla en plazo no superior a 5 meses.',
    legal_basis: 'Art. 161.2 CE y Art. 67 LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['impugnacion_161_2', 'suspension_automatica', '5_meses', 'disposiciones_autonomicas'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-21',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Las sentencias del Tribunal Constitucional tienen valor de cosa juzgada a partir del día siguiente al de su publicación en el BOE, vinculan con efectos erga omnes y no admiten recurso alguno salvo aclaración en 2 días hábiles.',
    legal_basis: 'Art. 164.1 CE y Arts. 86 y 93 LOTC',
    cluster_id: 'cluster_tc_resoluciones',
    tags: ['sentencias_tc', 'cosa_juzgada', 'publicacion_boe', 'aclaracion_2_dias'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-22',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Contra los autos y providencias del Tribunal Constitucional cabe interponer recurso de súplica en el plazo de 3 días hábiles (sin efectos suspensivos), que se resolverá en los 2 días hábiles siguientes mediante auto.',
    legal_basis: 'Art. 93 LOTC',
    cluster_id: 'cluster_tc_resoluciones',
    tags: ['recurso_suplica', 'autos_providencias', '3_dias_habiles', '2_dias_resolucion'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3g-23',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Si el Tribunal Constitucional declara que las estipulaciones de un tratado internacional pendiente de ratificación son contrarias a la Constitución, dicho tratado no podrá ratificarse sin previa reforma constitucional.',
    legal_basis: 'Art. 95 CE y Art. 78 LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['tratados_internacionales', 'control_previo', 'art_95_ce', 'reforma_constitucional'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3g-24',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'En los conflictos de atribuciones entre órganos constitucionales del Estado, el órgano promotor debe notificar en el plazo de 1 mes al órgano infractor solicitando la revocación antes de formalizar la demanda ante el TC.',
    legal_basis: 'Arts. 73 a 75 LOTC',
    cluster_id: 'cluster_tc_conflictos',
    tags: ['conflictos_organos', 'aviso_1_mes', 'gobierno_vs_cgpj', 'tramite_previo'],
    difficulty: 3,
    status: 'validated',
  },
];

type OptionSpec = { text: string; trap: TrapType; why: string };

type Question = {
  stem: string;
  prompt: string;
  key: 'A' | 'B' | 'C' | 'D';
  correct: { text: string; rule: string };
  distractors: [OptionSpec, OptionSpec, OptionSpec];
  legal: string;
  cluster: string;
  pair?: string;
  difficulty: number;
};

const questionBank: Question[] = [
  {
    stem: '¿Cómo se articula constitucionalmente la composición y propuesta de nombramiento de los miembros del Tribunal Constitucional?',
    prompt: 'Doce miembros nombrados por el Rey: 4 Congreso (3/5), 4 Senado (3/5), 2 Gobierno y 2 CGPJ.',
    key: 'D',
    correct: {
      text: 'Doce magistrados propuestos por las Cortes (cuatro por cada Cámara por tres quintos), dos por el Gobierno y dos por el CGPJ.',
      rule: 'El art. 159.1 CE establece 12 miembros nombrados por el Rey: 4 a propuesta del Congreso por mayoría de 3/5, 4 a propuesta del Senado por mayoría de 3/5 elegidos entre candidatos de las Asambleas Legislativas autonómicas, 2 por el Gobierno y 2 por el Consejo General del Poder Judicial.',
    },
    distractors: [
      {
        text: 'Diez miembros propuestos por el Presidente del Gobierno y ratificados por mayoría absoluta de las Cortes Generales.',
        trap: 'wrong_competent_body',
        why: 'El TC consta de 12 miembros y el Presidente del Gobierno no propone directamente a sus integrantes.',
      },
      {
        text: 'Doce miembros propuestos por el Pleno del Consejo General del Poder Judicial y designados por Real Decreto.',
        trap: 'conceptual_merger',
        why: 'El CGPJ únicamente propone a 2 de los 12 magistrados, no a la totalidad del Tribunal.',
      },
      {
        text: 'Doce miembros propuestos por mitades iguales entre el Congreso y el Senado por mayoría absoluta de sus Cámaras.',
        trap: 'numeric_substitution',
        why: 'Las Cámaras proponen 4 cada una (no 6) y se exige mayoría cualificada de 3/5, no mayoría absoluta.',
      },
    ],
    legal: 'Art. 159.1 CE',
    cluster: 'cluster_tc_composicion_requisitos',
    pair: 'pair_tc_vs_cgpj',
    difficulty: 1,
  },
  {
    stem: 'Para ser propuesto como miembro del Tribunal Constitucional, ¿qué exigencia profesional y temporal prevé la Constitución?',
    prompt: 'Juristas de reconocida competencia con más de 15 años de ejercicio profesional (no 10 ni 25).',
    key: 'C',
    correct: {
      text: 'Juristas de reconocida competencia con más de quince años de ejercicio profesional.',
      rule: 'El art. 159.2 CE exige ser jurista de reconocida competencia con más de 15 años de ejercicio profesional (entre magistrados, fiscales, profesores de universidad, funcionarios públicos o abogados).',
    },
    distractors: [
      {
        text: 'Magistrados y jueces de carrera con al menos diez años ininterrumpidos en la categoría de magistrado.',
        trap: 'hyper_narrow_statement',
        why: 'No se restringe solo a la carrera judicial y el plazo mínimo constitucional son más de 15 años.',
      },
      {
        text: 'Licenciados en Derecho con experiencia acreditada en la función pública durante un mínimo de veinte años.',
        trap: 'numeric_substitution',
        why: 'El requisito constitucional no es de 20 años ni se limita en exclusiva a funcionarios públicos.',
      },
      {
        text: 'Juristas de contrastado prestigio con más de veinticinco años de ejercicio profesional continuado.',
        trap: 'numeric_substitution',
        why: '25 años es la exigencia para los juristas de reconocida competencia del CGPJ, no del TC (que son más de 15 años).',
      },
    ],
    legal: 'Art. 159.2 CE',
    cluster: 'cluster_tc_composicion_requisitos',
    pair: 'pair_tc_vs_cgpj',
    difficulty: 2,
  },
  {
    stem: 'En relación con el régimen de incompatibilidades de los magistrados del Tribunal Constitucional, ¿cuál de los siguientes cargos resulta incompatible con su ejercicio?',
    prompt: 'El cargo de magistrado es incompatible con defensor del pueblo, fiscal general, diputado, senador y cargos políticos.',
    key: 'D',
    correct: {
      text: 'El ejercicio del mandato de Defensor del Pueblo, el de Fiscal General del Estado y el de Diputado al Congreso.',
      rule: 'El art. 159.4 CE y el art. 19 LOTC disponen que el cargo de magistrado del TC es incompatible con todo mandato representativo, con cargos políticos o administrativos, con funciones directivas en partidos o sindicatos, con el Defensor del Pueblo y con el ejercicio de las carreras judicial y fiscal.',
    },
    distractors: [
      {
        text: 'Únicamente el mandato de parlamentario en Cortes Generales, siendo admisible la jefatura de un partido político.',
        trap: 'overbroad_statement',
        why: 'La incompatibilidad abarca tanto mandatos representativos como cualquier función directiva en partidos políticos.',
      },
      {
        text: 'La condición de funcionario en excedencia activa, permitiéndose compatibilizar la abogacía mercantil privada.',
        trap: 'exception_ignored',
        why: 'El ejercicio de cualquier actividad profesional o mercantil está taxativamente vetado a los magistrados del TC.',
      },
      {
        text: 'El desempeño simultáneo de un juzgado de instrucción ordinario cuando se actúe en comisión de servicios.',
        trap: 'conceptual_merger',
        why: 'El ejercicio de la carrera judicial en activo es absolutamente incompatible con formar parte del TC.',
      },
    ],
    legal: 'Art. 159.4 CE y Art. 19 LOTC',
    cluster: 'cluster_tc_composicion_requisitos',
    difficulty: 2,
  },
  {
    stem: 'Atendiendo a las causas legalmente tasadas en la LOTC, ¿cuál de las siguientes circunstancias NO extingue el mandato de un magistrado del Tribunal Constitucional?',
    prompt: 'El transcurso de 3 años no extingue el mandato: el nombramiento dura 9 años.',
    key: 'B',
    correct: {
      text: 'El transcurso de un período continuado de tres años en el ejercicio de su función.',
      rule: 'El art. 23 LOTC establece que el mandato individual es de 9 años. Los 3 años constituyen el ciclo de renovación parcial de la Cámara o de la Presidencia, pero en ningún caso extinguen por sí mismos el nombramiento del magistrado.',
    },
    distractors: [
      {
        text: 'La declaración de incompatibilidad sobrevenida acordada por el Pleno del Tribunal Constitucional.',
        trap: 'true_but_irrelevant',
        why: 'La incompatibilidad sobrevenida sí es causa tasada de cese según el artículo 23.1 LOTC.',
      },
      {
        text: 'La renuncia formalizada por escrito y aceptada por la persona titular de la Presidencia del Tribunal.',
        trap: 'true_but_irrelevant',
        why: 'La renuncia aceptada por el Presidente del TC es una causa legal de cese.',
      },
      {
        text: 'La condena firme derivada de responsabilidad civil por dolo en el desempeño de sus tareas.',
        trap: 'true_but_irrelevant',
        why: 'La responsabilidad civil por dolo o condena penal dolosa determina el cese del magistrado.',
      },
    ],
    legal: 'Art. 23 LOTC',
    cluster: 'cluster_tc_organizacion_cese',
    difficulty: 2,
  },
  {
    stem: 'Respecto a la duración del mandato y el sistema de sustitución de los magistrados del Tribunal Constitucional, la Constitución dispone que:',
    prompt: 'Nueve años de mandato, renovación por tercios cada tres años y prohibición de reelección inmediata.',
    key: 'A',
    correct: {
      text: 'Serán designados por un período de nueve años y se renovarán por terceras partes cada tres.',
      rule: 'El art. 159.3 CE fija un mandato de 9 años con renovación de 4 miembros (un tercio) cada 3 años, prohibiendo la reelección inmediata con la salvedad de quien hubiera ejercido el cargo por tiempo no superior a 3 años.',
    },
    distractors: [
      {
        text: 'Serán designados por cinco años renovándose de forma simultánea en su totalidad al expirar dicho lapso.',
        trap: 'conceptual_merger',
        why: 'Cinco años con renovación global es el régimen propio del Consejo General del Poder Judicial.',
      },
      {
        text: 'Ejercerán sus funciones con carácter vitalicio hasta alcanzar la edad legal de jubilación forzosa.',
        trap: 'overbroad_statement',
        why: 'Los magistrados del TC tienen mandato temporal tasado de 9 años, no vitalicio.',
      },
      {
        text: 'Serán nombrados por seis años con posibilidad de prórroga sucesiva inmediata por un segundo período.',
        trap: 'numeric_substitution',
        why: 'El mandato es de 9 años y la reelección inmediata está prohibida con carácter general.',
      },
    ],
    legal: 'Art. 159.3 CE y Art. 16 LOTC',
    cluster: 'cluster_tc_composicion_requisitos',
    pair: 'pair_tc_vs_cgpj',
    difficulty: 1,
  },
  {
    stem: 'En el procedimiento de elección de la Presidencia del Tribunal Constitucional, si tras las sucesivas votaciones se mantuviera una situación de empate entre dos candidaturas, ¿qué regla de desempate establece la LOTC?',
    prompt: 'En caso de empate persiste: primero mayor antigüedad en el cargo; si coincide, mayor edad.',
    key: 'B',
    correct: {
      text: 'Se propondrá a quien ostente mayor antigüedad en el cargo y, en caso de igualdad, al de mayor edad.',
      rule: 'El art. 9.2 LOTC establece que en caso de persistir el empate en una última votación, se propondrá al de mayor antigüedad en el cargo y, en caso de igualdad, al de mayor edad (la experiencia prima sobre la edad cronológica).',
    },
    distractors: [
      {
        text: 'Se propondrá inmediatamente al de mayor edad cronológica y, a igual fecha de nacimiento, al de más antigüedad.',
        trap: 'rule_exception_swap',
        why: 'Invierte el orden legal: la antigüedad en el cargo prevalece sobre la edad biológica.',
      },
      {
        text: 'El empate se solventa otorgando voto de calidad dirimente al magistrado propuesto por el Gobierno.',
        trap: 'factual_misapplication',
        why: 'No existe voto de calidad del Ejecutivo; la ley establece criterios objetivos de antigüedad y edad.',
      },
      {
        text: 'La designación se remite al Pleno del Congreso de los Diputados para su resolución por mayoría cualificada.',
        trap: 'wrong_competent_body',
        why: 'La elección corresponde al Pleno del propio Tribunal Constitucional, sin intervención posterior de las Cámaras.',
      },
    ],
    legal: 'Art. 9.2 LOTC',
    cluster: 'cluster_tc_organizacion_cese',
    pair: 'pair_desempate_antiguedad_vs_edad',
    difficulty: 2,
  },
  {
    stem: '¿Quién ostenta legitimación activa para interponer un recurso de inconstitucionalidad contra una ley estatal ante el Tribunal Constitucional?',
    prompt: 'Presidente del Gobierno, Defensor del Pueblo, 50 Diputados, 50 Senadores y órganos de las CCAA.',
    key: 'A',
    correct: {
      text: 'El Defensor del Pueblo, cincuenta Diputados o cincuenta Senadores.',
      rule: 'El art. 162.1.a CE confiere legitimación activa para el recurso de inconstitucionalidad al Presidente del Gobierno, al Defensor del Pueblo, a 50 Diputados, a 50 Senadores, y a los Gobiernos y Parlamentos autonómicos en su ámbito.',
    },
    distractors: [
      {
        text: 'El Ministerio Fiscal a través de la persona titular de la Fiscalía General del Estado.',
        trap: 'wrong_competent_body',
        why: 'El Ministerio Fiscal no está legitimado para el recurso de inconstitucionalidad (sí para amparo o en cuestiones).',
      },
      {
        text: 'Cualquier persona física o jurídica que invoque un derecho subjetivo lesionado por la norma.',
        trap: 'conceptual_merger',
        why: 'Los ciudadanos particulares no pueden interponer recurso de inconstitucionalidad, reservado a instituciones públicas.',
      },
      {
        text: 'El Pleno del Consejo de Estado actuando a instancia de una asociación ciudadana representativa.',
        trap: 'wrong_competent_body',
        why: 'El Consejo de Estado es un órgano consultivo sin legitimación procesal activa ante el TC.',
      },
    ],
    legal: 'Art. 162.1.a CE y Art. 32 LOTC',
    cluster: 'cluster_tc_inconstitucionalidad',
    pair: 'pair_recurso_vs_cuestion_inconstitucionalidad',
    difficulty: 2,
  },
  {
    stem: 'La cuestión de inconstitucionalidad sobre una norma con rango de ley de cuya validez dependa el fallo sólo puede ser planteada ante el Tribunal Constitucional por:',
    prompt: 'Exclusivamente un órgano judicial ordinario (juez o tribunal), una vez concluso el procedimiento y dentro del plazo para dictar sentencia.',
    key: 'C',
    correct: {
      text: 'Un juez o tribunal de la jurisdicción ordinaria, una vez concluso el procedimiento judicial.',
      rule: 'El art. 163 CE y el art. 35 LOTC reservan la cuestión de inconstitucionalidad en exclusiva a jueces y tribunales ordinarios, de oficio o a instancia de parte, cuando el proceso está concluso y dentro del plazo para dictar sentencia.',
    },
    distractors: [
      {
        text: 'Las partes personadas en el litigio mediante escrito directo presentado en el registro del Tribunal Constitucional.',
        trap: 'conceptual_merger',
        why: 'Las partes solo pueden instar al juez para que la plantee; carecen de legitimación directa ante el TC.',
      },
      {
        text: 'El Presidente de la Audiencia Nacional tras recibir informe favorable del Ministerio Fiscal.',
        trap: 'wrong_competent_body',
        why: 'Corresponde al órgano judicial que conoce concretamente del litigio, no a la presidencia gubernativa del tribunal.',
      },
      {
        text: 'El Defensor del Pueblo en cualquier fase de la tramitación de las diligencias previas judiciales.',
        trap: 'factual_misapplication',
        why: 'El Defensor del Pueblo tiene legitimación para el recurso de inconstitucionalidad y de amparo, pero no para la cuestión judicial.',
      },
    ],
    legal: 'Art. 163 CE y Art. 35 LOTC',
    cluster: 'cluster_tc_inconstitucionalidad',
    pair: 'pair_recurso_vs_cuestion_inconstitucionalidad',
    difficulty: 2,
  },
  {
    stem: 'En un procedimiento donde se alega la vulneración del derecho a la tutela judicial efectiva (artículo 24 de la CE), ¿está legitimada una Sociedad de Responsabilidad Limitada para acudir en amparo ante el Tribunal Constitucional?',
    prompt: 'Sí: las personas jurídicas privadas tienen plena legitimación en amparo si ostentan interés legítimo.',
    key: 'D',
    correct: {
      text: 'Sí, porque las personas jurídicas con interés legítimo ostentan legitimación activa directa.',
      rule: 'El art. 162.1.b CE y el art. 46.1.b LOTC legitiman para el recurso de amparo a toda persona física o jurídica que invoque un interés legítimo, lo que incluye plenamente a sociedades mercantiles como las SL o SA.',
    },
    distractors: [
      {
        text: 'No, puesto que el recurso de amparo constitucional queda reservado a las personas físicas a título individual.',
        trap: 'hyper_narrow_statement',
        why: 'El art. 162.1.b CE otorga expresamente legitimación a personas jurídicas en la defensa de sus derechos constitucionales.',
      },
      {
        text: 'Únicamente si el Ministerio Fiscal asume su representación procesal y formaliza la demanda correspondiente.',
        trap: 'factual_misapplication',
        why: 'La persona jurídica comparece con su propia representación (procurador y abogado) de forma autónoma.',
      },
      {
        text: 'Solo cuando cuente con la autorización expresa y preceptiva del Defensor del Pueblo mediante informe vinculante.',
        trap: 'wrong_competent_body',
        why: 'No precisa aval ni intervención alguna del Defensor del Pueblo para ejercitar su derecho de acción.',
      },
    ],
    legal: 'Art. 162.1.b CE y Art. 46 LOTC',
    cluster: 'cluster_tc_amparo',
    difficulty: 2,
  },
  {
    stem: 'Frente a una resolución de la Administración General del Estado que pudiera invadir competencias estatutarias, ¿quién se encuentra legitimado para trabar un conflicto positivo de competencia ante el Tribunal Constitucional?',
    prompt: 'El órgano colegiado ejecutivo (Consejo de Gobierno) de la Comunidad Autónoma afectada.',
    key: 'B',
    correct: {
      text: 'El Consejo de Gobierno de la Comunidad Autónoma directamente afectada por la disposición.',
      rule: 'El art. 62 LOTC atribuye legitimación para promover el conflicto positivo de competencia al Gobierno del Estado y a los órganos colegiados ejecutivos de las Comunidades Autónomas directamente afectadas.',
    },
    distractors: [
      {
        text: 'Cualquier Ayuntamiento de una capital provincial perteneciente a la respectiva demarcación territorial.',
        trap: 'overbroad_statement',
        why: 'Los conflictos de competencia oponen al Estado y a las CCAA; las entidades locales no intervienen en este proceso ordinario.',
      },
      {
        text: 'La Asamblea Legislativa autonómica reunida en sesión extraordinaria previa votación por mayoría simple.',
        trap: 'wrong_competent_body',
        why: 'La legitimación en conflictos de competencia corresponde al órgano ejecutivo (Consejo de Gobierno), no al Parlamento autonómico.',
      },
      {
        text: 'El Pleno de la Diputación Provincial que acredite una afectación indirecta en su ámbito de actuación.',
        trap: 'factual_misapplication',
        why: 'Las diputaciones provinciales carecen de legitimación en los conflictos constitucionales de competencia entre Estado y CCAA.',
      },
    ],
    legal: 'Arts. 62 y 63 LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 3,
  },
  {
    stem: 'Conforme a la legislación sobre representación paritaria y presencia equilibrada, ¿cómo se proyecta la exigencia de paridad sobre el Tribunal Constitucional?',
    prompt: 'Mínimo del 40% de cada sexo aplicable en cada renovación parcial trienal.',
    key: 'A',
    correct: {
      text: 'Debe asegurarse un mínimo del cuarenta por ciento de cada sexo en cada renovación parcial.',
      rule: 'La LO 2/2024 exige el principio de presencia equilibrada (al menos un 40% de cada sexo) y se aplica directamente en cada renovación de 4 miembros cada 3 años por los órganos proponentes.',
    },
    distractors: [
      {
        text: 'Se computa de manera agregada cada nueve años al renovarse de modo íntegro el conjunto del Tribunal.',
        trap: 'temporal_confusion',
        why: 'La paridad opera en cada renovación parcial de 3 años, no de forma diferida cada 9 años.',
      },
      {
        text: 'Rige exclusivamente para las designaciones que efectúan el Congreso y el Senado en sesión conjunta.',
        trap: 'hyper_narrow_statement',
        why: 'Afecta a todos los órganos proponentes institucionales del Tribunal Constitucional.',
      },
      {
        text: 'Exige una alternancia estricta del cincuenta por ciento en la elección sucesiva de Presidente y Vicepresidente.',
        trap: 'overbroad_statement',
        why: 'La ley fija un suelo del 40% por sexo en la composición del Tribunal, no un 50% rotatorio en la presidencia.',
      },
    ],
    legal: 'Art. 159 CE y LO 2/2024 de representación paritaria',
    cluster: 'cluster_tc_composicion_requisitos',
    difficulty: 2,
  },
  {
    stem: 'Para la adopción válida de acuerdos y deliberaciones en el Pleno y en las Salas del Tribunal Constitucional, ¿qué quórum de asistencia preceptiva exige la LOTC?',
    prompt: 'Presencia de al menos dos tercios (2/3) de los miembros que las componen.',
    key: 'C',
    correct: {
      text: 'La presencia de al menos dos tercios de los miembros que los integran en cada caso.',
      rule: 'El art. 14 LOTC establece que el Tribunal en Pleno y en Salas puede adoptar acuerdos cuando estén presentes al menos dos tercios de los miembros que en cada momento deban componerlos.',
    },
    distractors: [
      {
        text: 'La presencia de la mayoría absoluta de los componentes en primera convocatoria de la sesión.',
        trap: 'numeric_substitution',
        why: 'La ley exige una presencia cualificada de dos tercios, no una mera mayoría absoluta.',
      },
      {
        text: 'La totalidad de sus doce integrantes, sin que quepa deliberar válidamente ante ninguna vacante.',
        trap: 'overbroad_statement',
        why: 'No se exige unanimidad de asistencia; el quórum legal es de dos tercios.',
      },
      {
        text: 'La mitad más uno de los integrantes efectivos, siempre que concurra preceptivamente la Presidencia.',
        trap: 'familiar_wording_trap',
        why: 'El quórum funcional de Pleno y Salas está legalmente fijado en dos tercios de sus componentes.',
      },
    ],
    legal: 'Art. 14 LOTC',
    cluster: 'cluster_tc_organizacion_cese',
    difficulty: 3,
  },
  {
    stem: 'En relación con el recurso previo de inconstitucionalidad contra proyectos de Estatutos de Autonomía, ¿cuál es el plazo de interposición y qué efecto produce?',
    prompt: 'Tres días hábiles desde la aprobación definitiva en Cortes; suspende automáticamente todos los trámites.',
    key: 'A',
    correct: {
      text: 'Tres días hábiles tras su aprobación definitiva, suspendiendo automáticamente la tramitación.',
      rule: 'El art. 79 LOTC dispone que el recurso previo contra proyectos de Estatuto de Autonomía se interpone en el plazo de 3 días hábiles y produce la suspensión automática de todos los trámites (incluido el referéndum), debiendo resolverse en 6 meses.',
    },
    distractors: [
      {
        text: 'Veinte días hábiles desde el visto bueno parlamentario, sin que en ningún caso opere suspensión cautelar.',
        trap: 'numeric_substitution',
        why: 'El plazo es de 3 días hábiles y la suspensión de trámites es automática y preceptiva.',
      },
      {
        text: 'Tres meses desde la votación final de la Cámara, con suspensión facultativa supeditada a fianza.',
        trap: 'temporal_confusion',
        why: 'Confunde el plazo general del recurso de inconstitucionalidad (3 meses) con el recurso previo (3 días hábiles).',
      },
      {
        text: 'Diez días naturales desde su remisión oficial, continuando la convocatoria del referéndum consultivo.',
        trap: 'exception_ignored',
        why: 'El recurso previo suspende de forma directa y vinculante la celebración del referéndum.',
      },
    ],
    legal: 'Art. 79 LOTC',
    cluster: 'cluster_tc_inconstitucionalidad',
    difficulty: 3,
  },
  {
    stem: '¿Cuál de las siguientes situaciones sustantivas carece de protección mediante el recurso de amparo constitucional ante el Tribunal Constitucional?',
    prompt: 'El derecho a una vivienda digna (art. 47 CE) es un principio rector y no goza de amparo.',
    key: 'D',
    correct: {
      text: 'La supuesta lesión del derecho a disfrutar de una vivienda digna y adecuada del artículo 47.',
      rule: 'El art. 53.2 CE y el art. 41.1 LOTC limitan el amparo a los arts. 14 a 29 y 30.2 CE. El art. 47 CE es un principio rector del Capítulo III del Título I, que no puede hacerse valer en amparo.',
    },
    distractors: [
      {
        text: 'La vulneración del principio de igualdad y no discriminación proclamado en el artículo 14 de la Carta Magna.',
        trap: 'true_but_irrelevant',
        why: 'El art. 14 CE goza de amparo constitucional pleno ante el Tribunal Constitucional.',
      },
      {
        text: 'El menoscabo de la libertad sindical o del ejercicio del derecho de huelga regulados en el artículo 28.',
        trap: 'true_but_irrelevant',
        why: 'El art. 28 CE forma parte de la Sección 1ª del Capítulo II y está plenamente tutelado por el amparo.',
      },
      {
        text: 'La infracción del derecho fundamental a la tutela judicial efectiva sin indefensión recogido en el artículo 24.',
        trap: 'true_but_irrelevant',
        why: 'El art. 24 CE es uno de los derechos nucleares protegidos por el recurso de amparo.',
      },
    ],
    legal: 'Art. 53.2 CE y Art. 41 LOTC',
    cluster: 'cluster_tc_amparo',
    difficulty: 1,
  },
  {
    stem: 'Una vez notificada la resolución judicial firme que agota la vía previa, ¿de qué plazo se dispone para formalizar el recurso de amparo contra una resolución judicial?',
    prompt: 'Treinta días hábiles contados a partir de la notificación de la resolución judicial firme.',
    key: 'C',
    correct: {
      text: 'Treinta días hábiles contados desde la notificación de la resolución recaída en el proceso.',
      rule: 'El art. 44.2 LOTC establece un plazo de 30 días hábiles a partir de la notificación de la resolución judicial que pone fin a la vía ordinaria previa. (En contraste con los 20 días hábiles para actos administrativos del art. 43.2 LOTC).',
    },
    distractors: [
      {
        text: 'Veinte días hábiles a partir del día siguiente a la práctica de la notificación de firmeza.',
        trap: 'numeric_substitution',
        why: 'Veinte días hábiles es el plazo para recursos de amparo contra actos administrativos (art. 43 LOTC), no judiciales.',
      },
      {
        text: 'Tres meses naturales ininterrumpidos desde que el órgano de instancia declaró formalmente el archivo.',
        trap: 'temporal_confusion',
        why: 'Tres meses es el plazo para actos parlamentarios sin rango de ley (art. 42 LOTC).',
      },
      {
        text: 'Quince días naturales a contar desde que concluyó el plazo ordinario de aclaración procesal.',
        trap: 'numeric_substitution',
        why: 'El plazo legal son 30 días hábiles según el artículo 44.2 LOTC.',
      },
    ],
    legal: 'Art. 44.2 LOTC',
    cluster: 'cluster_tc_amparo',
    pair: 'pair_plazos_amparo_admin_vs_judicial',
    difficulty: 2,
  },
  {
    stem: '¿Cómo se articula la comparecencia y postulación técnica de los recurrentes en el recurso de amparo constitucional?',
    prompt: 'Procurador y abogado, pero quien tenga título de licenciado o graduado en Derecho puede defenderse por sí mismo.',
    key: 'B',
    correct: {
      text: 'Requiere abogado y procurador, pudiendo quien posea título en Derecho comparecer por sí mismo.',
      rule: 'El art. 81.1 LOTC exige comparecer por medio de Procurador y con dirección de Abogado, pero el art. 81.2 LOTC añade que quienes tengan título de Licenciado o Graduado en Derecho podrán comparecer y defenderse por sí mismos.',
    },
    distractors: [
      {
        text: 'Se exige en todos los casos procurador y letrado, sin excepción profesional posible para juristas.',
        trap: 'exception_ignored',
        why: 'El art. 81.2 LOTC exime expresamente de representación y defensa a licenciados o graduados en Derecho.',
      },
      {
        text: 'Es libre la comparecencia directa del interesado sin asistencia técnica cuando la cuantía sea menor.',
        trap: 'factual_misapplication',
        why: 'El amparo no tiene cuantía y requiere postulación preceptiva salvo la excepción técnica de juristas.',
      },
      {
        text: 'Requiere exclusivamente la firma de letrado del Ilustre Colegio, estando vetada la figura del procurador.',
        trap: 'hyper_narrow_statement',
        why: 'La regla general exige ambas figuras: Procurador y Abogado colegiado.',
      },
    ],
    legal: 'Art. 81 LOTC',
    cluster: 'cluster_tc_amparo',
    difficulty: 2,
  },
  {
    stem: 'En relación con la suspensión del acto o norma impugnada ante el Tribunal Constitucional, ¿en cuál de los siguientes supuestos opera la suspensión del proceso judicial?',
    prompt: 'La cuestión de inconstitucionalidad suspende provisionalmente las actuaciones judiciales del proceso a quo.',
    key: 'A',
    correct: {
      text: 'En la cuestión de inconstitucionalidad promovida por el juez que conoce del asunto.',
      rule: 'El art. 35.3 LOTC dispone que el planteamiento de la cuestión de inconstitucionalidad suspende provisionalmente las actuaciones en el proceso judicial hasta que el Tribunal Constitucional se pronuncie. En el recurso y en el amparo la regla general es la no suspensión.',
    },
    distractors: [
      {
        text: 'En la interposición ordinaria de un recurso de amparo contra una sanción administrativa.',
        trap: 'rule_exception_swap',
        why: 'La regla general en el recurso de amparo es que no suspende los efectos del acto recurrido (art. 56.1 LOTC).',
      },
      {
        text: 'En el recurso de inconstitucionalidad deducido por cincuenta senadores contra una ley orgánica.',
        trap: 'rule_exception_swap',
        why: 'El recurso de inconstitucionalidad promovido por parlamentarios no suspende la vigencia de la ley.',
      },
      {
        text: 'En el conflicto de competencia promovido por una Comunidad Autónoma contra el Estado.',
        trap: 'exception_ignored',
        why: 'El conflicto autonómico no suspende de forma automática la disposición estatal impugnada.',
      },
    ],
    legal: 'Art. 35.3 LOTC y Art. 56 LOTC',
    cluster: 'cluster_tc_inconstitucionalidad',
    pair: 'pair_suspension_recurso_vs_cuestion',
    difficulty: 2,
  },
  {
    stem: 'Para promover un conflicto en defensa de la autonomía local cuando una ley estatal afecte a un conjunto plural de municipios, ¿qué umbrales de legitimación exige la LOTC?',
    prompt: 'Al menos 1/7 de los municipios del ámbito territorial que representen al menos 1/6 de la población censada.',
    key: 'C',
    correct: {
      text: 'Al menos un séptimo de los municipios que representen un sexto de la población oficial censada.',
      rule: 'El art. 75 ter.1.b LOTC exige el acuerdo de un número de municipios que suponga al menos 1/7 de los del ámbito territorial y represente al menos 1/6 de la población oficial del ámbito de aplicación de la norma.',
    },
    distractors: [
      {
        text: 'Un tercio de los municipios de la provincia que sumen al menos la mitad del censo de electores.',
        trap: 'numeric_substitution',
        why: 'Los umbrales legales son un séptimo de los municipios y un sexto de la población oficial censada.',
      },
      {
        text: 'La cuarta parte de los entes afectados que concentren el veinte por ciento de los residentes locales.',
        trap: 'numeric_precision',
        why: 'La fracción exigida por el art. 75 ter LOTC es 1/7 de municipios y 1/6 de población.',
      },
      {
        text: 'La mitad de las entidades locales del territorio que reúnan al menos un tercio del censo municipal.',
        trap: 'numeric_substitution',
        why: 'El 50% rige cuando se trate de un conflicto entablado por provincias, no por municipios.',
      },
    ],
    legal: 'Art. 75 ter LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 3,
  },
  {
    stem: 'Con carácter previo a la formalización del conflicto en defensa de la autonomía local, ¿qué requisito consultivo debe cumplimentar preceptivamente la entidad local?',
    prompt: 'Solicitar dictamen preceptivo pero no vinculante del Consejo de Estado u órgano autonómico.',
    key: 'D',
    correct: {
      text: 'Solicitar el dictamen preceptivo pero no vinculante del Consejo de Estado u órgano consultivo autonómico.',
      rule: 'El art. 75 ter.3 LOTC exige que con carácter previo se recabe dictamen del Consejo de Estado (o del órgano consultivo autonómico equivalente); dicho dictamen es preceptivo (obligatorio de pedir) pero no vinculante para los entes promotores.',
    },
    distractors: [
      {
        text: 'Obtener la autorización vinculante de la Comisión Bilateral de Cooperación Estado-Comunidad Autónoma.',
        trap: 'wrong_competent_body',
        why: 'La Comisión Bilateral opera en el recurso de inconstitucionalidad, no en el conflicto de autonomía local.',
      },
      {
        text: 'Someter la iniciativa a dictamen vinculante del Tribunal de Cuentas para avalar la solvencia económica.',
        trap: 'wrong_legal_object',
        why: 'El Tribunal de Cuentas no emite dictámenes de constitucionalidad ni interviene en este proceso.',
      },
      {
        text: 'Evacuar consulta facultativa ante la Federación Española de Municipios y Provincias en asamblea.',
        trap: 'factual_misapplication',
        why: 'La consulta a la FEMP no es un trámite procesal regulado en la LOTC.',
      },
    ],
    legal: 'Art. 75 ter.3 LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 2,
  },
  {
    stem: 'Cuando el Gobierno de la Nación recurre al mecanismo previsto en el artículo 161.2 de la Constitución para impugnar una disposición autonómica:',
    prompt: 'Produce la suspensión automática de la disposición autonómica; el TC debe ratificarla o levantarla en no más de 5 meses.',
    key: 'B',
    correct: {
      text: 'Se produce la suspensión automática, debiendo el Tribunal ratificarla o levantarla en no más de cinco meses.',
      rule: 'El art. 161.2 CE dispone que la impugnación por el Gobierno produce la suspensión automática de la disposición autonómica recurrida, y el Tribunal Constitucional debe ratificarla o levantarla en un plazo no superior a 5 meses.',
    },
    distractors: [
      {
        text: 'Queda en suspenso la norma de forma provisional hasta que recaiga sentencia definitiva sobre el fondo.',
        trap: 'exception_ignored',
        why: 'El TC debe resolver necesariamente sobre la medida en un plazo no superior a 5 meses, no demorarlo al fallo.',
      },
      {
        text: 'Requiere que el Tribunal Constitucional dicte auto motivado de suspensión cautelar previa audiencia.',
        trap: 'rule_exception_swap',
        why: 'La suspensión es automática e inmediata por el hecho de la invocación gubernamental del art. 161.2 CE.',
      },
      {
        text: 'Se exige el depósito previo de garantía financiera por parte de la Abogacía General del Estado.',
        trap: 'factual_misapplication',
        why: 'La invocación constitucional del Gobierno no precisa caución ni garantía económica.',
      },
    ],
    legal: 'Art. 161.2 CE y Art. 67 LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 2,
  },
  {
    stem: 'Respecto a la eficacia y régimen de firmeza de las sentencias dictadas por el Tribunal Constitucional, ¿cuál de las siguientes afirmaciones es correcta?',
    prompt: 'Tienen valor de cosa juzgada desde el día siguiente a su publicación en el BOE y contra ellas no cabe recurso alguno.',
    key: 'A',
    correct: {
      text: 'Tienen el valor de cosa juzgada a partir del día siguiente al de su publicación en el Boletín Oficial del Estado.',
      rule: 'El art. 164.1 CE y el art. 86.1 LOTC disponen que las sentencias del TC tienen el valor de cosa juzgada a partir del día siguiente de su publicación en el BOE y contra ellas no cabe recurso alguno (salvo aclaración en 2 días hábiles).',
    },
    distractors: [
      {
        text: 'Despliegan plenos efectos de cosa juzgada el mismo día en que se notifica el fallo a las partes en litigio.',
        trap: 'wrong_start_date',
        why: 'La eficacia de cosa juzgada nace a partir del día siguiente a su publicación oficial en el BOE.',
      },
      {
        text: 'Son susceptibles de recurso extraordinario de casación ante la Sala de Gobierno del Tribunal Supremo.',
        trap: 'wrong_competent_body',
        why: 'Contra las sentencias del Tribunal Constitucional no cabe recurso alguno ante ningún otro tribunal.',
      },
      {
        text: 'Permiten la interposición de recurso de súplica en el plazo improrrogable de diez días hábiles siguientes.',
        trap: 'conceptual_merger',
        why: 'El recurso de súplica cabe contra autos y providencias, nunca contra las sentencias definitivas del TC.',
      },
    ],
    legal: 'Art. 164.1 CE y Art. 86 LOTC',
    cluster: 'cluster_tc_resoluciones',
    difficulty: 2,
  },
  {
    stem: 'Contra los autos y las providencias dictados por el Tribunal Constitucional, ¿qué cauce de impugnación y plazo de interposición establece la LOTC?',
    prompt: 'Recurso de súplica en el plazo de 3 días hábiles (no suspensivo), resolviéndose en 2 días hábiles.',
    key: 'B',
    correct: {
      text: 'Recurso de súplica en el plazo de tres días hábiles, resolviéndose en los dos días hábiles siguientes.',
      rule: 'El art. 93.1 y 2 LOTC establece que contra las providencias y autos cabe recurso de súplica en el plazo de 3 días hábiles, que se resolverá en los 2 días hábiles siguientes mediante auto sin efecto suspensivo.',
    },
    distractors: [
      {
        text: 'Recurso de reposición potestativo en el plazo de un mes, con efectos suspensivos del procedimiento.',
        trap: 'conceptual_merger',
        why: 'El recurso de reposición de 1 mes es del procedimiento administrativo común (Ley 39), no de la LOTC.',
      },
      {
        text: 'Recurso de alzada impropio ante el Pleno en el término de diez días desde la práctica de la notificación.',
        trap: 'wrong_competent_body',
        why: 'En el Tribunal Constitucional no existe recurso de alzada; el cauce es la súplica en 3 días hábiles.',
      },
      {
        text: 'Recurso directo de queja ante la Presidencia en un plazo improrrogable de cinco días hábiles.',
        trap: 'wrong_legal_object',
        why: 'La LOTC no prevé recurso de queja; el recurso aplicable es la súplica.',
      },
    ],
    legal: 'Art. 93 LOTC',
    cluster: 'cluster_tc_resoluciones',
    difficulty: 3,
  },
  {
    stem: 'Si el Tribunal Constitucional declara la existencia de contradicción entre la Constitución y las estipulaciones de un tratado internacional pendiente de ratificación:',
    prompt: 'El tratado no puede ser ratificado por España sin una previa revisión o reforma de la Constitución.',
    key: 'C',
    correct: {
      text: 'No podrá ratificarse el tratado salvo que se proceda previamente a la reforma de la Constitución.',
      rule: 'El art. 95.1 CE establece que la celebración de un tratado internacional que contenga estipulaciones contrarias a la Constitución exigirá la previa revisión constitucional.',
    },
    distractors: [
      {
        text: 'El tratado queda ratificado automáticamente con reserva expresa formulada por el Consejo de Ministros.',
        trap: 'exception_ignored',
        why: 'El art. 95.1 CE prohíbe ratificar tratados incompatibles sin abordar antes la reforma de la propia Carta Magna.',
      },
      {
        text: 'Se someterá el texto directamente a referéndum popular vinculante para convalidar la contradicción legal.',
        trap: 'factual_misapplication',
        why: 'El referéndum no elude la necesidad imperativa de reforma previa de la Constitución.',
      },
      {
        text: 'El texto queda derogado ipso iure sin posibilidad de subsanación posterior por las Cortes Generales.',
        trap: 'wrong_legal_object',
        why: 'El tratado no es derogado por el Estado; simplemente no puede ratificarse sin reformar la Constitución.',
      },
    ],
    legal: 'Art. 95 CE y Art. 78 LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 2,
  },
  {
    stem: 'En un conflicto de atribuciones entre el Gobierno y el Consejo General del Poder Judicial promovido al amparo de la LOTC, ¿qué trámite previo resulta imperativo antes de formalizar la demanda ante el Tribunal Constitucional?',
    prompt: 'Notificar al órgano infractor en 1 mes solicitando revocación; si declina o calla en 1 mes, se acude al TC en el mes siguiente.',
    key: 'D',
    correct: {
      text: 'Notificar en el plazo de un mes la solicitud de revocación al órgano que dictó la decisión cuestionada.',
      rule: 'El art. 73.2 LOTC exige que, acordado por el Pleno del órgano, se notifique al órgano invasor en el plazo de 1 mes solicitando la revocación; si este mantiene su criterio o no responde en 1 mes, se formaliza el conflicto en el mes siguiente.',
    },
    distractors: [
      {
        text: 'Elevar solicitud de dictamen pericial vinculante al Consejo de Estado con carácter previo indispensable.',
        trap: 'wrong_competent_body',
        why: 'El Consejo de Estado no emite dictamen preceptivo en los conflictos entre órganos constitucionales.',
      },
      {
        text: 'Plantear una cuestión prejudicial urgente de competencia ante la Sala de lo Contencioso del Tribunal Supremo.',
        trap: 'wrong_competent_body',
        why: 'El Tribunal Supremo no tiene competencia en los conflictos de atribuciones entre órganos constitucionales.',
      },
      {
        text: 'Convocar la comisión mixta paritaria de conciliación en el plazo de quince días desde la aprobación del acto.',
        trap: 'factual_misapplication',
        why: 'No existe tal comisión de conciliación; el procedimiento exige notificación y requerimiento directo en 1 mes.',
      },
    ],
    legal: 'Arts. 73 a 75 LOTC',
    cluster: 'cluster_tc_conflictos',
    difficulty: 3,
  },
];

function buildOptions(question: Question): MCQOption[] {
  const correctIndex = question.key.charCodeAt(0) - 65;
  const distractorQueue = [...question.distractors];
  const options: MCQOption[] = [];

  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    const id = String.fromCharCode(65 + optionIndex);
    if (optionIndex === correctIndex) {
      options.push({
        id,
        text: question.correct.text,
        is_correct: true,
        trap_type: 'partial_rule_accuracy',
        explanation: question.correct.rule,
        condition_if_correct: 'Correcta conforme a la regla sintetizada en la explicación.',
      });
      continue;
    }

    const spec = distractorQueue.shift()!;
    options.push({
      id,
      text: spec.text,
      is_correct: false,
      trap_type: spec.trap,
      explanation: `Incorrecta (${spec.trap}): ${spec.why}`,
      condition_if_correct: `Solo sería correcta si la norma aplicable estableciera: «${spec.text}».`,
    });
  }

  return options;
}

function makeItem(question: Question, index: number): Item {
  const options = buildOptions(question);
  const numeric = /\d|%|€/.test(question.stem) || /\d|%|€/.test(question.correct.text);
  const cognitive: CognitiveOperation[] = numeric
    ? ['generative_retrieval', 'numeric_precision', 'micro_discrimination']
    : ['generative_retrieval', 'micro_discrimination', 'application'];

  return {
    id: `item-t3g-${index + 1}`,
    topic_id: TOPIC,
    cluster_id: question.cluster,
    ...(question.pair ? { confusion_pair_id: question.pair } : {}),
    item_type: 'cover_and_generate_mcq',
    stem: question.stem,
    prompt_before_options: question.prompt,
    options,
    correct_answer: question.key,
    legal_basis: question.legal,
    rule_statement: question.correct.text,
    why_correct: question.correct.rule,
    distractor_analysis: Object.fromEntries(
      options.filter((option) => !option.is_correct).map((option) => [option.id, option.explanation!]),
    ),
    trap_types: options.filter((option) => !option.is_correct).map((option) => option.trap_type!),
    corrective_rule: question.prompt,
    difficulty: question.difficulty,
    cognitive_operations: cognitive,
    status: 'validated',
    source: 'manual',
    created_at: now,
    updated_at: now,
  };
}

export const seedItemsTema3General: Item[] = questionBank.map(makeItem);
