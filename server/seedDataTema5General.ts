/**
 * Seed data for Constitución Española de 1978 - Tema 5 (Bloque General):
 * "Poder Legislativo y Defensor del Pueblo" — PARTE 1 (clase 23-11-2026).
 *
 * FUENTE DE VERDAD:
 *  - Constitución Española, Título III, Cap. I (arts. 66-80) y art. 134, Ref.
 *    BOE-A-1978-31229 (texto consolidado consultado 2026-11-25).
 *  - Ley Orgánica 5/1985, del Régimen Electoral General (LOREG), Ref.
 *    BOE-A-1985-11672: arts. 3, 4, 5, 6, 51, 44 bis, 162 y 163 (texto
 *    consolidado consultado 2026-11-25).
 *  - Reforma constitucional de 19-05-2026, BOE-A-2026-10881, y LO 2/2026,
 *    BOE-A-2026-14329 (art. 69.3 CE: Ibiza y Formentera, con D.T. única).
 *  - Reforma del Reglamento del Congreso de 23-07-2026, BOE-A-2026-16353
 *    (art. 23.1: grupos parlamentarios, entrada en vigor en la XVI legislatura).
 *  - Clase del 23 de noviembre de 2026 (transcript, desde la señal 100.000) y
 *    sus dos resúmenes: "resumen clase 23 nov - T5 general parte 1" y
 *    "t5g resumen (SOLO del pdf).txt".
 *
 * ALCANCE: el profesor cerró la clase en el punto 1.14 (diapositiva 26) y
 * anunció que retomaría desde la diapositiva 22 el 30 de noviembre. Por tanto
 * este lote cubre solo 1.1-1.14. Quedan para un segundo batch, con transcript
 * nuevo: resto de 1.13 (Corona, CCAA, otras instituciones e internacional),
 * art. 135 CE desarrollado, 1.15 Comisiones Permanentes, 1.16 Tribunal de
 * Cuentas, Bloque 2 (elaboración de leyes), Bloque 3 (tratados) y Bloque 4
 * (Defensor del Pueblo). El nombre del topic anticipa el tema completo.
 *
 * AVISOS DE RIGOR (§7 de los resúmenes), incorporados al banco:
 *  - Sesiones extraordinarias: el art. 73.2 CE exige mayoría absoluta de los
 *    miembros de CUALQUIERA de las Cámaras; el profesor y el PDF dijeron
 *    "cada Cámara". El banco sigue el texto consolidado del BOE.
 *  - Inelegibilidad de altos cargos: el art. 6.1.f LOREG comprende
 *    Subsecretarios, Secretarios generales y Directores generales, NO a los
 *    Ministros ni a los Secretarios de Estado (coherente con el art. 70.1.b CE).
 *  - Senadores de Ibiza y Formentera: la reforma de 2026 les reconoce uno
 *    propio, pero su D.T. única pospone la eficacia a las primeras elecciones
 *    al Senado convocadas tras la entrada en vigor.
 *  - Grupos parlamentarios del Congreso: el régimen de media del 10% / 3%
 *    sustituye al de 15% / 5% a partir de la XVI legislatura (BOE-A-2026-16353).
 *  - "Días naturales por defecto" es una regla metodológica de clase para el
 *    bloque general, no una cita normativa autónoma.
 *
 * No se codifican como clave: el método D'Hondt (ilustrativo, no examinable),
 * la cifra de "2 años" de privación (no contrastada), las valoraciones
 * personales del profesor ni la numeración práctica de escaños en caliente.
 *
 * Autoría: 50 ítems MCQ estándar. El banco se añade al final de `seedItems`
 * para que `rebalanceCanonicalMcqOptions` asigne la posición canónica sin
 * alterar los bancos anteriores.
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

const TOPIC = 'topic_constitucion_tema_5';
const now = '2026-11-25T11:00:00Z';

export const seedTopicTema5General: Topic = {
  id: TOPIC,
  name: 'Constitución Española - Tema 5: Bloque General - Poder Legislativo y Defensor del Pueblo',
  description:
    'BLOQUE GENERAL (CE), parte 1: Cortes Generales y mandato parlamentario; Congreso y Senado; sufragio, inelegibilidad e incompatibilidad; prerrogativas; funcionamiento de las Cámaras; funciones legislativas, de control y presupuestarias; y órganos internos y grupos parlamentarios. El Defensor del Pueblo se incorporará con el transcript de la clase siguiente.',
  source_file: 'resumen clase 23 nov - T5 general parte 1 (Poder Legislativo, inicio).md',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema5General: SourceChunk[] = [
  {
    id: 'chunk_tema5g_1',
    topic_id: TOPIC,
    page_number: 1,
    article_reference: 'Arts. 66 y 67 CE',
    raw_text:
      'Las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado. Ejercen la potestad legislativa del Estado, aprueban sus Presupuestos, controlan la acción del Gobierno y son inviolables. Nadie puede ser miembro de las dos Cámaras simultáneamente ni acumular el acta de una Asamblea de Comunidad Autónoma con la de Diputado al Congreso. Los miembros no están ligados por mandato imperativo; las reuniones sin convocatoria reglamentaria no vinculan a las Cámaras.',
    summary: 'Composición, competencias, inviolabilidad y régimen del mandato parlamentario.',
    order_index: 1,
  },
  {
    id: 'chunk_tema5g_2',
    topic_id: TOPIC,
    page_number: 2,
    article_reference: 'Art. 68 CE y LOREG, arts. 51, 44 bis, 162 y 163',
    raw_text:
      'El Congreso se compone de entre 300 y 400 Diputados, fijados en 350 por la LOREG; la circunscripción es la provincia, con un Diputado para Ceuta y para Melilla. Es elegido por cuatro años; el mandato termina a los cuatro años o el día de la disolución. Las elecciones se celebran entre 30 y 60 días desde la terminación del mandato y el Congreso electo se convoca dentro de los 25 días siguientes. La campaña empieza el día 38.º posterior a la convocatoria, dura 15 días y termina a las cero horas del día anterior a la votación. Las candidaturas son paritarias y alternas; las que no alcancen el 3 % de los votos válidos de la circunscripción no se tienen en cuenta.',
    summary: 'Composición, elección, plazos, campaña, paridad y barrera electoral del Congreso.',
    order_index: 2,
  },
  {
    id: 'chunk_tema5g_3',
    topic_id: TOPIC,
    page_number: 3,
    article_reference: 'Art. 69 CE; BOE-A-2026-10881 y BOE-A-2026-14329',
    raw_text:
      'El Senado es la Cámara de representación territorial. Se eligen cuatro Senadores por provincia; tres en cada isla mayor (Gran Canaria, Mallorca y Tenerife) y uno en cada isla menor (Ibiza, Formentera, Menorca, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma). Ceuta y Melilla eligen dos cada una. Las Comunidades Autónomas designan un Senador y otro más por cada millón de habitantes, por su Asamblea legislativa o, en su defecto, órgano colegiado superior. El mandato dura cuatro años. La reforma de 2026 reconoce circunscripción propia a Ibiza y a Formentera, con eficacia diferida a las primeras elecciones al Senado convocadas tras su entrada en vigor.',
    summary: 'Representación territorial del Senado, reparto insular y la reforma de Ibiza y Formentera.',
    order_index: 3,
  },
  {
    id: 'chunk_tema5g_4',
    topic_id: TOPIC,
    page_number: 4,
    article_reference: 'LOREG, arts. 3, 4, 5, 6 y 7; art. 70 CE',
    raw_text:
      'Carecen de sufragio los condenados por sentencia judicial firme a privación del derecho de sufragio mientras dure su cumplimiento. El voto se ejerce personalmente en la sección y Mesa correspondientes; nadie puede votar más de una vez ni ser coaccionado o obligado a revelar su voto. La ley electoral determina las causas de inelegibilidad e incompatibilidad, comprendiendo a los componentes del Tribunal Constitucional, altos cargos de la Administración con excepción de los miembros del Gobierno, Defensor del Pueblo, Jueces y Fiscales en activo, militares y miembros de las Juntas Electorales. La LOREG añade la Familia Real, presidentes de altos órganos, Fiscal General, Subsecretarios y Directores generales, entidades gestoras de la Seguridad Social y otros. Son inelegibles los condenados por sentencia firme a pena privativa de libertad y, aunque la sentencia no sea firme, los condenados por rebelión, terrorismo, contra la Administración Pública o las Instituciones del Estado con inhabilitación o suspensión. Las causas de inelegibilidad lo son también de incompatibilidad.',
    summary: 'Sufragio, reserva constitucional, catálogo de inelegibilidades y regla de conversión.',
    order_index: 4,
  },
  {
    id: 'chunk_tema5g_5',
    topic_id: TOPIC,
    page_number: 5,
    article_reference: 'Arts. 71 y 72 CE',
    raw_text:
      'Diputados y Senadores gozan de inviolabilidad por las opiniones manifestadas en el ejercicio de sus funciones, de inmunidad durante el mandato —solo pueden ser detenidos en flagrante delito— y no pueden ser inculpados ni procesados sin previa autorización de la Cámara respectiva (suplicatorio). En las causas contra ellos es competente la Sala de lo Penal del Tribunal Supremo. Cada Cámara establece sus Reglamentos, aprueba sus presupuestos y, de común acuerdo, regula el Estatuto del Personal de las Cortes; la reforma reglamentaria exige votación final sobre el total por mayoría absoluta. Las sesiones conjuntas las preside el Presidente del Congreso y se rigen por un Reglamento aprobado por mayoría absoluta de cada Cámara.',
    summary: 'Prerrogativas parlamentarias, suplicatorio, fuero y autonomía reglamentaria.',
    order_index: 5,
  },
  {
    id: 'chunk_tema5g_6',
    topic_id: TOPIC,
    page_number: 6,
    article_reference: 'Arts. 73, 74, 75, 77, 78, 79 y 80 CE',
    raw_text:
      'Períodos ordinarios: septiembre-diciembre y febrero-junio. Sesiones extraordinarias a petición del Gobierno, de la Diputación Permanente o por mayoría absoluta de los miembros de cualquiera de las Cámaras. Las decisiones de los arts. 94.1, 145.2 y 158.2 se adoptan por mayoría de cada Cámara; se inician por el Congreso las de tratados y por el Senado los convenios entre Comunidades Autónomas y el Fondo de Compensación Interterritorial; sin acuerdo, Comisión Mixta paritaria y, si no se aprueba, decide el Congreso por mayoría absoluta. Las Cámaras funcionan en Pleno y Comisiones; no se delegable en Comisiones Legislativas Permanentes la reforma constitucional, las cuestiones internacionales, las leyes orgánicas y de bases ni los Presupuestos Generales del Estado. Las peticiones son siempre escritas; el Gobierno está obligado a explicarse, no a cumplirlas. Cada Cámara tiene una Diputación Permanente de al menos 21 miembros que continúa hasta la constitución de las nuevas Cortes. Los acuerdos requieren asistencia de la mayoría de los miembros y se aprueban por mayoría de los presentes; el voto es personal e indelegable. El Pleno es público salvo acuerdo en contrario por mayoría absoluta o según el Reglamento.',
    summary: 'Régimen de sesiones, decisiones del art. 74.2, peticiones, Diputación Permanente y acuerdos.',
    order_index: 6,
  },
  {
    id: 'chunk_tema5g_7',
    topic_id: TOPIC,
    page_number: 7,
    article_reference: 'Arts. 62, 66, 97, 116 y 134 CE',
    raw_text:
      'Corresponde al Congreso elegir al Presidente del Gobierno; el Rey solo materializa lo ya decidido. La moción de censura la presenta la oposición y la cuestión de confianza el propio Presidente. El Congreso autoriza la prórroga del estado de alarma, autoriza el estado de excepción o su prórroga y declara el estado de sitio. Las Cortes Generales pueden delegar en el Gobierno la potestad de dictar normas con rango de ley: por ley de bases se forman textos articulados y por ley ordinaria se refunden textos legales en uno solo. Los decretos-leyes los dicta el Gobierno por extraordinaria y urgente necesidad y el Congreso se pronuncia sobre su convalidación o derogación. Los Presupuestos Generales los elabora el Gobierno y las Cortes los examinan, enmiendan y aprueban; son anuales, incluyen la totalidad del sector público estatal, no pueden crear tributos pero pueden modificarlos si una ley sustantiva lo prevé, y se prorrogan automáticamente si no se aprueban a tiempo.',
    summary: 'Potestad legislativa, delegación, control del Gobierno y régimen presupuestario.',
    order_index: 7,
  },
  {
    id: 'chunk_tema5g_8',
    topic_id: TOPIC,
    page_number: 8,
    article_reference: 'Reglamento del Congreso, art. 23.1; BOE-A-2026-16353',
    raw_text:
      'La Mesa del Congreso la integran un Presidente, cuatro Vicepresidencias y cuatro Secretarías; la del Senado, un Presidente, dos Vicepresidencias y cuatro Secretarías. En el Congreso pueden constituir grupo parlamentario al menos 15 diputados, o diputados de una o varias formaciones con no menos de 5 escaños que además alcancen el 15 % de los votos de las circunscripciones en que se presentaron o el 5 % de los votos emitidos en el conjunto de la Nación hasta el final de la legislatura actual. Desde la XVI legislatura, la alternativa pasa a ser una media del 10 % de los votos válidos emitidos en las circunscripciones donde se obtuvo representación o el 3 % de los votos válidos nacionales. En ningún caso pueden constituir grupo separado quienes pertenezcan a un mismo partido. En el Senado se requieren al menos 10 Senadores. La Junta de Portavoces se reúne bajo la presidencia del Presidente de la Cámara.',
    summary: 'Mesa, umbrales de los grupos parlamentarios y su reforma de 2026, y Junta de Portavoces.',
    order_index: 8,
  },
];

export const seedClustersTema5General: Cluster[] = [
  {
    id: 'cluster_t5g_cortes_mandato',
    topic_id: TOPIC,
    name: 'Cortes Generales y mandato parlamentario',
    type: 'institutional',
    priority: 'critical',
    description:
      'Composición y competencias del art. 66 CE, inviolabilidad, prohibición de pertenencia simultánea a ambas Cámaras, incompatibilidad del acta autonómica con el escaño de diputado, prohibición de mandato imperativo, voto personal e indelegable y reuniones sin convocatoria reglamentaria.',
  },
  {
    id: 'cluster_t5g_congreso',
    topic_id: TOPIC,
    name: 'Congreso de los Diputados: composición y elección',
    type: 'procedural',
    priority: 'critical',
    description:
      'Marco constitucional de 300 a 400 Diputados y cifra legal de 350, circunscripción provincial, Ceuta y Melilla, duración y terminación del mandato, plazos electorales, campaña, paridad de las candidaturas y barrera del 3 %.',
  },
  {
    id: 'cluster_t5g_senado',
    topic_id: TOPIC,
    name: 'Senado: representación territorial',
    type: 'institutional',
    priority: 'critical',
    description:
      'Cuatro Senadores por provincia, tres en islas mayores y uno en menores, dos en Ceuta y Melilla, designación autonómica de uno más por millón de habitantes y matiz de eficacia diferida de la reforma de Ibiza y Formentera de 2026.',
  },
  {
    id: 'cluster_t5g_sufragio_inelegibilidad',
    topic_id: TOPIC,
    name: 'Sufragio, inelegibilidad e incompatibilidad',
    type: 'classification',
    priority: 'critical',
    description:
      'Privación del sufragio por sentencia firme, ejercicio personal y prohibición de doble voto, reserva del art. 70 CE, catálogo del art. 6 LOREG —con el matiz de los Ministros y Secretarios de Estado—, condenas con sentencia no firme y conversión de inelegibilidad en incompatibilidad.',
  },
  {
    id: 'cluster_t5g_perdida_prerrogativas',
    topic_id: TOPIC,
    name: 'Pérdida de la condición y prerrogativas',
    type: 'classification',
    priority: 'critical',
    description:
      'Causas de pérdida de la condición de Diputado y Senador e inviolabilidad, inmunidad, suplicatorio y fuero del art. 71 CE.',
  },
  {
    id: 'cluster_t5g_funcionamiento',
    topic_id: TOPIC,
    name: 'Funcionamiento de las Cámaras',
    type: 'procedural',
    priority: 'critical',
    description:
      'Autonomía reglamentaria, sesiones ordinarias y extraordinarias, decisiones del art. 74.2 CE, Pleno y Comisiones, materias no delegables, peticiones, Diputación Permanente y régimen de acuerdos.',
  },
  {
    id: 'cluster_t5g_funciones',
    topic_id: TOPIC,
    name: 'Funciones legislativas, de control y presupuestarias',
    type: 'procedural',
    priority: 'critical',
    description:
      'Delegación legislativa en el Gobierno, control parlamentario de los decretos-leyes, elección del Presidente del Gobierno, moción de censura y cuestión de confianza, estados de excepción y régimen de los Presupuestos Generales del Estado.',
  },
  {
    id: 'cluster_t5g_organos_grupos',
    topic_id: TOPIC,
    name: 'Órganos internos y grupos parlamentarios',
    type: 'institutional',
    priority: 'high',
    description:
      'Composición de las Mesas y umbrales de constitución de los grupos parlamentarios en el Congreso, con el antes y el después de la reforma del Reglamento de 2026, y Junta de Portavoces.',
  },
];

export const seedConfusionPairsTema5General: ConfusionPair[] = [
  {
    id: 'pair_t5g_autonomica_congreso_vs_senado',
    topic_id: TOPIC,
    concept_a: 'Acta de Asamblea autonómica + Diputado al Congreso',
    concept_b: 'Acta de Asamblea autonómica + Senador',
    discriminating_cue:
      'El art. 67.1 CE prohíbe expresamente acumular el acta de una Asamblea de Comunidad Autónoma con la de Diputado al Congreso; no prohíbe la acumulación con la de Senador.',
    common_trap:
      'Generalizar la prohibición a las dos Cámaras o invertirla y permitirla solo en el Congreso.',
    legal_basis_a: 'Art. 67.1 CE',
    legal_basis_b: 'Art. 67.1 CE',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t5g_perdida_diputado_vs_senador',
    topic_id: TOPIC,
    concept_a: 'Pérdida de la condición de Diputado',
    concept_b: 'Pérdida de la condición de Senador',
    discriminating_cue:
      'La pérdida de Diputado comprende cuatro causas; la de Senador añade la condena a inhabilitación absoluta o especial, la pérdida de los requisitos generales de elegibilidad y las causas de incompatibilidad.',
    common_trap:
      'Atribuir al Congreso las causas propias del Senado o afirmar que ambas listas son idénticas sin matiz.',
    legal_basis_a: 'Reglamento del Congreso y arts. 66-68 CE',
    legal_basis_b: 'Reglamento del Senado, art. 18, y arts. 66-69 CE',
    severity: 'high',
    status: 'validated',
  },
  {
    id: 'pair_t5g_delegacion_vs_decreto_ley',
    topic_id: TOPIC,
    concept_a: 'Delegación legislativa en el Gobierno',
    concept_b: 'Decreto-ley del Gobierno',
    discriminating_cue:
      'En la delegación son las Cortes Generales, en plural, las que ceden su potestad por ley de bases o ley ordinaria; en el decreto-ley es el Gobierno quien actúa por urgencia y el Congreso quien después controla la convalidación o derogación.',
    common_trap:
      'Decir que el decreto-ley es una delegación de las Cortes o que el Senado convalida los decretos-leyes.',
    legal_basis_a: 'Arts. 82 y 134 CE',
    legal_basis_b: 'Art. 86 CE',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t5g_mocion_vs_confianza',
    topic_id: TOPIC,
    concept_a: 'Moción de censura',
    concept_b: 'Cuestión de confianza',
    discriminating_cue:
      'La moción de censura la presentan los diputados de la oposición para hacer caer al Gobierno; la cuestión de confianza la plantea el Presidente del Gobierno para verificar que conserva el apoyo suficiente.',
    common_trap: 'Intercambiar quién toma la iniciativa en una y otra figura.',
    legal_basis_a: 'Art. 100 CE',
    legal_basis_b: 'Art. 101 CE',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t5g_grupos_antes_vs_despues',
    topic_id: TOPIC,
    concept_a: 'Régimen de grupos parlamentarios hasta el fin de la legislatura actual',
    concept_b: 'Régimen desde la XVI legislatura',
    discriminating_cue:
      'Se mantienen los 15 diputados y los 5 escaños, pero el 15 % de los votos de las circunscripciones presentadas o el 5 % nacional pasa a ser una media del 10 % en las circunscripciones con representación o el 3 % nacional.',
    common_trap:
      'Aplicar el régimen nuevo a la legislatura en curso o creer que solo cambia el número mínimo de diputados.',
    legal_basis_a: 'Reglamento del Congreso, art. 23.1 (redacción anterior)',
    legal_basis_b: 'Reforma del Reglamento del Congreso de 23-07-2026, BOE-A-2026-16353',
    severity: 'critical',
    status: 'validated',
  },
];

export const seedAtomsTema5General: Atom[] = [
  {
    id: 'atom-t5g-1',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'Las Cortes Generales representan al pueblo español, están formadas por el Congreso y el Senado, ejercen la potestad legislativa, aprueban sus Presupuestos, controlan la acción del Gobierno y son inviolables.',
    legal_basis: 'Art. 66 CE',
    cluster_id: 'cluster_t5g_cortes_mandato',
    tags: ['cortes_generales', 'inviolabilidad', 'potestad_legislativa'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t5g-2',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Nadie puede ser miembro de las dos Cámaras simultáneamente ni acumular el acta de una Asamblea de Comunidad Autónoma con la de Diputado al Congreso; esta última acumulación sí es posible con la de Senador.',
    legal_basis: 'Art. 67.1 CE',
    cluster_id: 'cluster_t5g_cortes_mandato',
    confusion_pair_id: 'pair_t5g_autonomica_congreso_vs_senado',
    tags: ['doble_escaño', 'acta_autonomica', 'congreso', 'senado'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-3',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'Los miembros de las Cortes no están ligados por mandato imperativo, su voto es personal e indelegable y las reuniones sin convocatoria reglamentaria no vinculan a las Cámaras.',
    legal_basis: 'Arts. 67.2, 67.3 y 79.3 CE',
    cluster_id: 'cluster_t5g_cortes_mandato',
    tags: ['mandato_imperativo', 'voto_personal', 'convocatoria'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-4',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'El Congreso se compone de entre 300 y 400 Diputados; la LOREG fija 350, con un mínimo inicial de dos por provincia y uno para Ceuta y para Melilla.',
    legal_basis: 'Art. 68.1 y 68.2 CE; LOREG, art. 162',
    cluster_id: 'cluster_t5g_congreso',
    tags: ['350', 'circunscripcion', 'ceuta_melilla'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t5g-5',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Las elecciones al Congreso se celebran entre 30 y 60 días desde la terminación del mandato y el Congreso electo debe convocarse dentro de los 25 días siguientes a los comicios.',
    legal_basis: 'Art. 68.6 CE',
    cluster_id: 'cluster_t5g_congreso',
    tags: ['plazos', 'dias_naturales', 'convocatoria'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-6',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'La campaña electoral comienza el día 38.º posterior a la convocatoria, dura 15 días y termina a las cero horas del día inmediatamente anterior a la votación.',
    legal_basis: 'LOREG, art. 51',
    cluster_id: 'cluster_t5g_congreso',
    tags: ['campaña', 'dia_38', 'reflexion'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-7',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Las candidaturas al Congreso deben tener composición paritaria y alternancia por sexo; no se tienen en cuenta las que no alcancen el 3 % de los votos válidos emitidos en la circunscripción.',
    legal_basis: 'LOREG, arts. 44 bis y 163.1.a',
    cluster_id: 'cluster_t5g_congreso',
    tags: ['paridad', 'barrera_3_por_ciento'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-8',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'El Senado es la Cámara de representación territorial: cuatro Senadores por provincia, tres en cada isla mayor, uno en cada isla menor y dos en Ceuta y en Melilla.',
    legal_basis: 'Art. 69.1 a 69.4 CE',
    cluster_id: 'cluster_t5g_senado',
    tags: ['territorialidad', 'islas', 'ceuta_melilla'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t5g-9',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Las Comunidades Autónomas designan un Senador y otro más por cada millón de habitantes, por su Asamblea legislativa o, en su defecto, por el órgano colegiado superior.',
    legal_basis: 'Art. 69.5 CE',
    cluster_id: 'cluster_t5g_senado',
    tags: ['designacion_autonomica', 'millon_habitantes'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-10',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'La reforma del art. 69.3 CE de 2026 reconoce una circunscripción propia a Ibiza y otra a Formentera, pero su disposición transitoria única difiere la eficacia a las primeras elecciones al Senado convocadas tras su entrada en vigor.',
    legal_basis: 'BOE-A-2026-10881 y BOE-A-2026-14329',
    cluster_id: 'cluster_t5g_senado',
    tags: ['ibiza', 'formentera', 'rigor_boe'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t5g-11',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Carecen de sufragio los condenados por sentencia judicial firme a privación del derecho de sufragio durante el tiempo de su cumplimiento; el voto se ejerce personalmente y nadie puede votar más de una vez ni revelar su voto.',
    legal_basis: 'LOREG, arts. 3.1.a, 4 y 5',
    cluster_id: 'cluster_t5g_sufragio_inelegibilidad',
    tags: ['sufragio_pasivo', 'voto_personal', 'sentencia_firme'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-12',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'La ley electoral determina las inelegibilidades e incompatibilidades de Diputados y Senadores, comprendiendo a los componentes del Tribunal Constitucional, altos cargos —excepto los miembros del Gobierno—, Defensor del Pueblo, Jueces y Fiscales en activo, militares y miembros de las Juntas Electorales.',
    legal_basis: 'Art. 70 CE',
    cluster_id: 'cluster_t5g_sufragio_inelegibilidad',
    tags: ['reserva_constitucional', 'control_judicial'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-13',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'El art. 6.1.f LOREG declara inelegibles a los Subsecretarios, Secretarios generales y Directores generales de los Departamentos Ministeriales y equiparados, pero no a los Ministros ni a los Secretarios de Estado.',
    legal_basis: 'LOREG, art. 6.1.f; art. 70.1.b CE',
    cluster_id: 'cluster_t5g_sufragio_inelegibilidad',
    tags: ['altos_cargos', 'ministros', 'rigor_boe'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t5g-14',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Son inelegibles los condenados por sentencia firme a pena privativa de libertad y, aunque la sentencia no sea firme, los condenados por rebelión, terrorismo, contra la Administración Pública o contra las Instituciones del Estado con inhabilitación o suspensión; las causas de inelegibilidad lo son también de incompatibilidad.',
    legal_basis: 'LOREG, arts. 6.2 y 6.4',
    cluster_id: 'cluster_t5g_sufragio_inelegibilidad',
    tags: ['condena', 'rebelion', 'conversion'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t5g-15',
    topic_id: TOPIC,
    atom_type: 'classification',
    text: 'La pérdida de la condición de Diputado comprende la decisión judicial firme que anule la elección, el fallecimiento o incapacitación judicial firme, la extinción del mandato y la renuncia ante la Mesa del Congreso; la de Senador añade la inhabilitación, la pérdida de requisitos y la incompatibilidad.',
    legal_basis: 'Reglamento del Congreso y Reglamento del Senado, art. 18',
    cluster_id: 'cluster_t5g_perdida_prerrogativas',
    confusion_pair_id: 'pair_t5g_perdida_diputado_vs_senador',
    tags: ['perdida_escaño', 'renuncia', 'incompatibilidad'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-16',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'Diputados y Senadores gozan de inviolabilidad por sus opiniones, de inmunidad durante el mandato con detención solo en flagrante delito, de suplicatorio para ser inculpados o procesados y de fuero ante la Sala de lo Penal del Tribunal Supremo.',
    legal_basis: 'Art. 71 CE',
    cluster_id: 'cluster_t5g_perdida_prerrogativas',
    tags: ['inviolabilidad', 'inmunidad', 'suplicatorio', 'fuero'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-17',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Cada Cámara aprueba su Reglamento por votación final sobre el total con mayoría absoluta; las sesiones conjuntas las preside el Presidente del Congreso y se rigen por un Reglamento aprobado por mayoría absoluta de cada Cámara.',
    legal_basis: 'Art. 72 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['autonomia_reglamentaria', 'sesiones_conjuntas'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-18',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'Los períodos ordinarios de sesiones son septiembre-diciembre y febrero-junio; las extraordinarias se convocan a petición del Gobierno, de la Diputación Permanente o por mayoría absoluta de los miembros de cualquiera de las Cámaras.',
    legal_basis: 'Art. 73 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['sesiones', 'cualquiera_camara', 'rigor_boe'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-19',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Las decisiones de los arts. 94.1, 145.2 y 158.2 CE se adoptan por mayoría de cada Cámara; se inician por el Congreso los tratados y por el Senado los convenios autonómicos y el Fondo de Compensación Interterritorial, con Comisión Mixta y decisión final del Congreso por mayoría absoluta.',
    legal_basis: 'Art. 74.2 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['comision_mixta', 'mayoria', 'fci'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t5g-20',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'No pueden delegarse en Comisiones Legislativas Permanentes la reforma constitucional, las cuestiones internacionales, las leyes orgánicas y de bases ni los Presupuestos Generales del Estado.',
    legal_basis: 'Art. 75.3 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['pleno', 'comisiones', 'materias_excluidas'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-21',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Las peticiones a las Cámaras son siempre escritas y el Gobierno está obligado a explicarse sobre su contenido, no a cumplir lo solicitado; la Diputación Permanente tiene al menos 21 miembros y continúa hasta la constitución de las nuevas Cortes.',
    legal_basis: 'Arts. 77 y 78 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['peticiones', 'diputacion_permanente'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-22',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Los acuerdos de las Cámaras requieren asistencia de la mayoría de sus miembros y se aprueban por mayoría de los presentes; el voto es personal e indelegable y el Pleno es público salvo acuerdo en contrario por mayoría absoluta o según el Reglamento.',
    legal_basis: 'Arts. 79 y 80 CE',
    cluster_id: 'cluster_t5g_funcionamiento',
    tags: ['quorum', 'publicidad', 'voto'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-23',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'La delegación legislativa la otorgan las Cortes Generales por ley de bases para textos articulados o por ley ordinaria para textos refundidos; el decreto-ley lo dicta el Gobierno y el Congreso se pronuncia sobre su convalidación o derogación.',
    legal_basis: 'Arts. 82, 86 y 134 CE',
    cluster_id: 'cluster_t5g_funciones',
    confusion_pair_id: 'pair_t5g_delegacion_vs_decreto_ley',
    tags: ['ley_de_bases', 'texto_refundido', 'decreto_ley'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t5g-24',
    topic_id: TOPIC,
    atom_type: 'classification',
    text: 'Corresponde al Congreso elegir al Presidente del Gobierno; la moción de censura la presentan los diputados de la oposición y la cuestión de confianza la plantea el propio Presidente.',
    legal_basis: 'Arts. 99, 100 y 101 CE',
    cluster_id: 'cluster_t5g_funciones',
    confusion_pair_id: 'pair_t5g_mocion_vs_confianza',
    tags: ['investidura', 'mocion', 'confianza'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-25',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Los Presupuestos Generales los elabora el Gobierno y las Cortes los examinan, enmiendan y aprueban; son anuales, no pueden crear tributos, pueden modificarlos si una ley sustantiva lo prevé y se prorrogan automáticamente si no se aprueban antes del ejercicio.',
    legal_basis: 'Art. 134 CE',
    cluster_id: 'cluster_t5g_funciones',
    tags: ['pge', 'tributos', 'prorroga'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t5g-26',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'En el Congreso se requieren al menos 15 diputados para grupo parlamentario, o 5 escaños más el 15 % de los votos de las circunscripciones presentadas o el 5 % nacional hasta el fin de la legislatura actual; desde la XVI legislatura la alternativa es una media del 10 % o el 3 % nacional.',
    legal_basis: 'Reglamento del Congreso, art. 23.1; BOE-A-2026-16353',
    cluster_id: 'cluster_t5g_organos_grupos',
    confusion_pair_id: 'pair_t5g_grupos_antes_vs_despues',
    tags: ['grupos', '15_5', '10_3', 'rigor_boe'],
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
  // 1-4 — Cortes Generales y mandato
  {
    stem: 'Conforme al artículo 66 CE, ¿cómo se configuran las Cortes Generales y qué competencias se les atribuyen?',
    prompt: 'Atiende a la composición y a las competencias que el precepto atribuye al conjunto de las Cámaras.',
    key: 'A',
    correct: {
      text: 'Son Congreso y Senado, representan al pueblo y ejercen la potestad legislativa, los Presupuestos y el control del Gobierno.',
      rule: 'El art. 66 CE configura las Cortes Generales como representantes del pueblo español, integradas por el Congreso de los Diputados y el Senado, y les atribuye la potestad legislativa del Estado, la aprobación de sus Presupuestos, el control de la acción del Gobierno y las demás competencias que la Constitución les reconoce.',
    },
    distractors: [
      {
        text: 'Son un órgano consultivo del Rey, formado por el Congreso y el Tribunal de Cuentas, con funciones de propuesta legislativa.',
        trap: 'conceptual_merger',
        why: 'El Tribunal de Cuentas no es una de las dos Cámaras y las Cortes no son un órgano consultivo, sino el titular de la potestad legislativa.',
      },
      {
        text: 'Representan a las Comunidades Autónomas y las integran el Senado y la Diputación Permanente, limitándose a aprobar los Presupuestos.',
        trap: 'wrong_competent_body',
        why: 'La Diputación Permanente es un órgano de cada Cámara, no una Cámara, y las Cortes representan al pueblo español, no solo a las Comunidades Autónomas.',
      },
      {
        text: 'Ejercen la potestad ejecutiva junto al Consejo de Ministros y controlan la actuación del Poder Judicial y del Tribunal Constitucional.',
        trap: 'factual_misapplication',
        why: 'La potestad ejecutiva corresponde al Gobierno y el control de la constitucionalidad al Tribunal Constitucional, no a las Cortes.',
      },
    ],
    legal: 'Art. 66 CE',
    cluster: 'cluster_t5g_cortes_mandato',
    difficulty: 1,
  },
  {
    stem: '¿Qué limitación impone el artículo 67.1 CE a quien ya es miembro de una de las Cámaras?',
    prompt: 'Piensa en la pertenencia simultánea a los dos órganos que integran las Cortes.',
    key: 'A',
    correct: {
      text: 'No puede ser miembro del Congreso y del Senado al mismo tiempo.',
      rule: 'El art. 67.1 CE dispone que nadie podrá ser miembro de las dos Cámaras simultáneamente; la condición de congresista y la de senador son incompatibles entre sí.',
    },
    distractors: [
      {
        text: 'Puede pertenecer a ambas si los grupos parlamentarios a los que se incorpora son distintos.',
        trap: 'overbroad_statement',
        why: 'La prohibición es absoluta y no se modera por la pertenencia a grupos parlamentarios diferentes.',
      },
      {
        text: 'Solo está prohibida la simultaneidad durante la legislatura constituyente, no en las ordinarias.',
        trap: 'temporal_confusion',
        why: 'El precepto no distingue entre legislaturas: rige de manera permanente desde la entrada en vigor de la Constitución.',
      },
      {
        text: 'La restricción se aplica únicamente a los senadores designados por las Asambleas de las Comunidades Autónomas.',
        trap: 'hyper_narrow_statement',
        why: 'La regla comprende a todos los miembros de las dos Cámaras, con independencia de cómo hayan sido elegidos o designados.',
      },
    ],
    legal: 'Art. 67.1 CE',
    cluster: 'cluster_t5g_cortes_mandato',
    difficulty: 1,
  },
  {
    stem: 'Un parlamentario autonómico quiere compatibilizar su escaño con las Cortes Generales. ¿Qué combinación le permite el artículo 67.1 CE?',
    prompt: 'La respuesta cambia según la Cámara; contrasta con cuidado las dos situaciones.',
    key: 'A',
    correct: {
      text: 'Puede ser senador, pero no diputado al Congreso.',
      rule: 'El art. 67.1 CE prohíbe acumular el acta de una Asamblea de Comunidad Autónoma con la de Diputado al Congreso, pero no extiende la prohibición a la condición de Senador.',
    },
    distractors: [
      {
        text: 'Puede ser diputado al Congreso, pero no senador, porque la Cámara Alta es la representación territorial.',
        trap: 'rule_exception_swap',
        why: 'Invierte la regla: el precepto prohíbe expresamente la acumulación con el acta de Diputado al Congreso, no con la de Senador.',
      },
      {
        text: 'No puede compatibilizar su condición con ninguna de las dos Cámaras en ningún supuesto.',
        trap: 'absolute_relative_confusion',
        why: 'La prohibición constitucional se refiere solo al Congreso; afirmar que alcanza también al Senado es generalizar indebidamente el precepto.',
      },
      {
        text: 'Puede ser diputado si la Asamblea autonómica de la que forma parte autoriza expresamente la acumulación.',
        trap: 'factual_misapplication',
        why: 'La Constitución no prevé autorización autonómica alguna que permita la acumulación con el escaño de Diputado al Congreso.',
      },
    ],
    legal: 'Art. 67.1 CE',
    cluster: 'cluster_t5g_cortes_mandato',
    pair: 'pair_t5g_autonomica_congreso_vs_senado',
    difficulty: 2,
  },
  {
    stem: '¿Qué dos reglas sobre el mandato y el ejercicio del sufragio interior de las Cámaras establecen los artículos 67.2 y 79.3 CE?',
    prompt: 'Separa la vinculación del representante de la naturaleza del voto que emite en la Cámara.',
    key: 'A',
    correct: {
      text: 'Los miembros no están ligados por mandato imperativo y el voto es personal e indelegable.',
      rule: 'El art. 67.2 CE prohíbe el mandato imperativo de los miembros de las Cortes Generales, y el art. 79.3 CE declara que el voto de Senadores y Diputados es personal e indelegable.',
    },
    distractors: [
      {
        text: 'Los miembros siguen las instrucciones de su grupo y pueden delegar el voto en otro compañero de Cámara.',
        trap: 'conceptual_merger',
        why: 'El mandato imperativo está prohibido y el voto no puede delegarse, de modo que ninguna de las dos afirmaciones es conforme a la Constitución.',
      },
      {
        text: 'El mandato imperativo solo se admite en el Senado y el voto de los diputados puede delegarse por escrito.',
        trap: 'partial_rule_accuracy',
        why: 'La prohibición del mandato imperativo comprende a todas las Cortes Generales y el carácter personal del voto no admite delegación escrita.',
      },
      {
        text: 'El mandato imperativo lo fija el Reglamento de cada Cámara y el voto se emite por el grupo parlamentario mayoritario.',
        trap: 'wrong_competent_body',
        why: 'Ni los Reglamentos pueden establecer un mandato imperativo ni el voto corresponde al grupo, sino a cada parlamentario individualmente.',
      },
    ],
    legal: 'Arts. 67.2 y 79.3 CE',
    cluster: 'cluster_t5g_cortes_mandato',
    difficulty: 2,
  },

  // 5-13 — Congreso
  {
    stem: '¿Entre qué límites constitucionales se mueve el número de diputados y qué cifra ha fijado la ley electoral?',
    prompt: 'Separa el marco que marca la Constitución del desarrollo que hace la ley orgánica.',
    key: 'A',
    correct: {
      text: 'Entre 300 y 400; la LOREG fija 350 diputados.',
      rule: 'El art. 68.1 CE establece un mínimo de 300 y un máximo de 400 Diputados; en desarrollo de ese marco, el art. 162 LOREG fija la cifra de 350.',
    },
    distractors: [
      {
        text: 'Entre 200 y 300; la ley electoral ha fijado definitivamente 250 diputados.',
        trap: 'numeric_substitution',
        why: 'Sustituye tanto los límites constitucionales como la cifra legal por valores que no figuran en la Constitución ni en la LOREG.',
      },
      {
        text: 'Entre 350 y 450; la ley electoral ha fijado 400 diputados, el máximo constitucional.',
        trap: 'numeric_precision',
        why: 'Confunde el máximo constitucional con la cifra legal efectivamente fijada y desplaza el mínimo por encima del permitido.',
      },
      {
        text: 'Entre 300 y 400; la ley electoral ha fijado 300, es decir, el mínimo constitucional.',
        trap: 'partial_rule_accuracy',
        why: 'Acierta el marco constitucional pero erra el desarrollo legal: la LOREG no elige el mínimo, sino 350 Diputados.',
      },
    ],
    legal: 'Art. 68.1 CE; LOREG, art. 162.1',
    cluster: 'cluster_t5g_congreso',
    difficulty: 1,
  },
  {
    stem: '¿Cuál es la circunscripción electoral para el Congreso y qué representación tienen Ceuta y Melilla?',
    prompt: 'Piensa en el ámbito territorial del reparto y en la situación singular de las ciudades autónomas.',
    key: 'A',
    correct: {
      text: 'La provincia; cada una de las dos ciudades tiene un diputado.',
      rule: 'El art. 68.2 CE establece que la circunscripción electoral es la provincia y que las poblaciones de Ceuta y Melilla están representadas cada una por un Diputado.',
    },
    distractors: [
      {
        text: 'La Comunidad Autónoma; cada una de las ciudades autónomas elige dos diputados.',
        trap: 'conceptual_merger',
        why: 'La circunscripción del Congreso es provincial, no autonómica, y Ceuta y Melilla eligen un Diputado cada una, no dos.',
      },
      {
        text: 'El municipio; ambas ciudades comparten un único diputado en una circunscripción conjunta.',
        trap: 'wrong_competent_body',
        why: 'Ni el municipio es la circunscripción ni las dos ciudades comparten representación: cada una tiene su propio Diputado.',
      },
      {
        text: 'La provincia; Ceuta y Melilla carecen de representación propia y dependen de la provincia vecina.',
        trap: 'absolute_relative_confusion',
        why: 'La Constitución reconoce expresamente un Diputado a cada una de las dos ciudades, por lo que no carecen de representación.',
      },
    ],
    legal: 'Art. 68.2 CE',
    cluster: 'cluster_t5g_congreso',
    difficulty: 1,
  },
  {
    stem: '¿Qué notas tiene el sufragio para elegir el Congreso y quiénes son electores y elegibles?',
    prompt: 'Atiende por separado a las cualidades del voto y a la condición exigida a los españoles.',
    key: 'A',
    correct: {
      text: 'Universal, libre, igual, directo y secreto; todos los españoles en pleno uso de sus derechos políticos.',
      rule: 'El art. 68.1 CE exige sufragio universal, libre, igual, directo y secreto, y el art. 68.5 reconoce la condición de electores y elegibles a todos los españoles que estén en pleno uso de sus derechos políticos.',
    },
    distractors: [
      {
        text: 'Universal, libre, igual, indirecto y público; únicamente los españoles avecindados en la capital de provincia pueden votar.',
        trap: 'factual_misapplication',
        why: 'El sufragio es directo y secreto, y la condición de elector no depende de la residencia en la capital provincial.',
      },
      {
        text: 'Restringido, libre, desigual, directo y secreto; solo los españoles con ingresos superiores a una cuantía determinada son elegibles.',
        trap: 'overbroad_statement',
        why: 'La Constitución no establece restricciones económicas ni censitarias para el sufragio en las elecciones al Congreso.',
      },
      {
        text: 'Universal, libre, igual, directo y secreto; también lo son los extranjeros residentes en España desde hace cinco años.',
        trap: 'partial_rule_accuracy',
        why: 'La regla constitucional se refiere a los españoles; los extranjeros solo pueden votar en elecciones municipales en los términos legales.',
      },
    ],
    legal: 'Arts. 68.1 y 68.5 CE',
    cluster: 'cluster_t5g_congreso',
    difficulty: 1,
  },
  {
    stem: '¿Cuánto dura el mandato de los diputados y en qué momento termina conforme al artículo 68.4 CE?',
    prompt: 'Distingue el plazo ordinario del hecho que puede cortarlo anticipadamente.',
    key: 'A',
    correct: {
      text: 'Cuatro años, o el día en que se disuelve la Cámara.',
      rule: 'El art. 68.4 CE dispone que el Congreso es elegido por cuatro años y que el mandato de los Diputados termina cuatro años después de su elección o el día de la disolución de la Cámara.',
    },
    distractors: [
      {
        text: 'Cinco años, o el día en que se disuelve la Cámara, sin que la renuncia individual afecte al mandato.',
        trap: 'numeric_substitution',
        why: 'El plazo constitucional es de cuatro años, no de cinco; la renuncia es una de las causas de pérdida de la condición de diputado.',
      },
      {
        text: 'Cuatro años, y solo termina por la renuncia voluntaria de cada diputado ante la Mesa del Congreso.',
        trap: 'absolute_relative_confusion',
        why: 'Además del transcurso del plazo, la disolución de la Cámara pone fin al mandato de todos los diputados.',
      },
      {
        text: 'Tres años, o cuando se constituyen las nuevas Cortes Generales tras las elecciones generales.',
        trap: 'temporal_confusion',
        why: 'Ni el plazo es de tres años ni la constitución de las nuevas Cortes es el hecho que la Constitución señala como término del mandato.',
      },
    ],
    legal: 'Art. 68.4 CE',
    cluster: 'cluster_t5g_congreso',
    difficulty: 1,
  },
  {
    stem: '¿En qué plazo han de celebrarse las elecciones al Congreso desde la terminación del mandato?',
    prompt: 'Recuerda que en este bloque los plazos se cuentan en días naturales salvo indicación en contrario.',
    key: 'A',
    correct: {
      text: 'Entre los 30 y los 60 días naturales siguientes.',
      rule: 'El art. 68.6 CE establece que las elecciones tendrán lugar entre los treinta y los sesenta días desde la terminación del mandato; en el bloque general se cuentan como días naturales.',
    },
    distractors: [
      {
        text: 'Entre los 60 y los 90 días naturales siguientes a la terminación del mandato.',
        trap: 'numeric_substitution',
        why: 'Sustituye los límites constitucionales por otros que no corresponden al art. 68.6 CE.',
      },
      {
        text: 'Antes de los 30 días naturales, sin que quepa prórroga ni cómputo distinto.',
        trap: 'absolute_relative_confusion',
        why: 'La Constitución fija una horquilla de treinta a sesenta días, no un plazo máximo de treinta.',
      },
      {
        text: 'Entre los 30 y los 60 días hábiles, descontando sábados, domingos y festivos.',
        trap: 'factual_misapplication',
        why: 'La regla del bloque general es días naturales; los días hábiles son la regla de la parte específica de Seguridad Social.',
      },
    ],
    legal: 'Art. 68.6 CE',
    cluster: 'cluster_t5g_congreso',
    difficulty: 2,
  },
  {
    stem: '¿Dentro de qué plazo debe convocarse el Congreso electo después de celebradas las elecciones?',
    prompt: 'No mezcles este plazo con el que media hasta la celebración de los comicios.',
    key: 'A',
    correct: {
      text: 'Dentro de los 25 días naturales siguientes a los comicios.',
      rule: 'El art. 68.6 CE ordena que el Congreso electo sea convocado dentro de los veinticinco días siguientes a la celebración de las elecciones.',
    },
    distractors: [
      {
        text: 'Dentro de los 60 días naturales siguientes a los comicios, junto con la constitución del Senado.',
        trap: 'numeric_substitution',
        why: ' sesenta días es el límite superior del plazo electoral, no el de convocatoria del Congreso electo.',
      },
      {
        text: 'Dentro de los 15 días hábiles posteriores a la proclamación de los resultados por la Junta Electoral.',
        trap: 'wrong_start_date',
        why: 'El cómputo se cuenta en días naturales desde la celebración de las elecciones, no en días hábiles desde la proclamación.',
      },
      {
        text: 'Dentro de los 25 días naturales, pero solo si el Gobierno lo solicita al Presidente del Congreso.',
        trap: 'rule_exception_swap',
        why: 'La convocatoria es un mandato constitucional directo, no una actuación condicionada a petición del Gobierno.',
      },
    ],
    legal: 'Art. 68.6 CE',
    cluster: 'cluster_t5g_congreso',
    difficulty: 2,
  },
  {
    stem: '¿Cómo se inicia y cuándo termina la campaña electoral conforme a la LOREG?',
    prompt: 'Atiende al día de comienzo, a la duración y al instante exacto del cierre.',
    key: 'A',
    correct: {
      text: 'Empieza el día 38.º tras la convocatoria, dura 15 días y acaba a las 00:00 del día anterior a votar.',
      rule: 'El art. 51 LOREG dispone que la campaña electoral comienza el día trigésimo octavo posterior a la convocatoria, que su duración será de quince días y que termina en todo caso a las cero horas del día inmediatamente anterior a la votación.',
    },
    distractors: [
      {
        text: 'Empieza el día 30.º tras la convocatoria, dura 15 días y acaba al medianoche del mismo día de la votación.',
        trap: 'numeric_substitution',
        why: 'El día de inicio es el 38.º y el cierre se produce antes de la votación, no durante ella.',
      },
      {
        text: 'Empieza el día 38.º tras la convocatoria, dura 30 días y termina a las cero horas del día de reflexión.',
        trap: 'numeric_precision',
        why: 'La duración legal es de quince días; el día de reflexión es el inmediatamente anterior a la votación, en el que ya ha cesado la campaña.',
      },
      {
        text: 'Empieza el día de la convocatoria, dura 15 días hábiles y se prolonga hasta la proclamación de los electos.',
        trap: 'wrong_start_date',
        why: 'Ni el inicio coincide con la convocatoria ni el cómputo es de días hábiles ni la campaña se extiende hasta la proclamación.',
      },
    ],
    legal: 'LOREG, art. 51',
    cluster: 'cluster_t5g_congreso',
    difficulty: 2,
  },
  {
    stem: '¿Qué exigencia establece la LOREG sobre la composición de las candidaturas al Congreso?',
    prompt: 'Piensa en el criterio de género y en el orden en que se integran las listas.',
    key: 'A',
    correct: {
      text: 'Deben ser paritarias, con mujeres y hombres alternados en la lista.',
      rule: 'El art. 44 bis LOREG impone a las candidaturas al Congreso una composición paritaria de mujeres y hombres, integrándose las listas por personas de uno y otro sexo ordenadas de forma alternativa.',
    },
    distractors: [
      {
        text: 'Deben reservar un tercio de los puestos a cada sexo, sin exigir alternancia en la ordenación de la lista.',
        trap: 'numeric_substitution',
        why: 'La ley no habla de un tercio, sino de paridad, y exige expresamente la alternancia de sexos en la lista.',
      },
      {
        text: 'Deben incluir paridad solo en las listas de las Comunidades Autónomas, no en las candidaturas al Congreso.',
        trap: 'wrong_legal_object',
        why: 'El art. 44 bis LOREG se refiere de forma expresa a las candidaturas para las elecciones de Diputados al Congreso.',
      },
      {
        text: 'Deben ser paritarias únicamente cuando lo acuerde la Junta Electoral Central antes de proclamarlas.',
        trap: 'factual_misapplication',
        why: 'La paridad es una exigencia legal directa, no una facultad dejada a la decisión de la Junta Electoral Central.',
      },
    ],
    legal: 'LOREG, art. 44 bis.1',
    cluster: 'cluster_t5g_congreso',
    difficulty: 2,
  },
  {
    stem: '¿Qué consecuencia tiene para una candidatura no alcanzar el mínimo de votos válidos exigido en la circunscripción?',
    prompt: 'Recuerda el umbral aplicable en el reparto de escaños del Congreso.',
    key: 'A',
    correct: {
      text: 'No se tiene en cuenta a la hora de atribuir los escaños de esa circunscripción.',
      rule: 'El art. 163.1.a LOREG excluye del reparto a las candidaturas que no hubieran obtenido al menos el 3 % de los votos válidos emitidos en la circunscripción.',
    },
    distractors: [
      {
        text: 'Conserva un escaño por el resto más alto de la circunscripción, aunque no alcance el umbral exigido.',
        trap: 'rule_exception_swap',
        why: 'Quien no supera el 3 % queda fuera del reparto, por lo que no puede recibir escaño algún por restos.',
      },
      {
        text: 'Se le atribuyen tantos escaños como votos válidos haya obtenido, sin aplicar ningún divisor.',
        trap: 'numeric_precision',
        why: 'La atribución sigue el sistema de divisores del art. 163 LOREG y solo interviene después de superar el umbral.',
      },
      {
        text: 'Puede participar en el reparto si la Junta Electoral Provincial autoriza una excepción motivada.',
        trap: 'factual_misapplication',
        why: 'El umbral del 3 % es una regla legal imperativa que no admite excepción por decisión de la Junta Electoral.',
      },
    ],
    legal: 'LOREG, art. 163.1.a',
    cluster: 'cluster_t5g_congreso',
    difficulty: 2,
  },

  // 14-19 — Senado
  {
    stem: '¿Qué tipo de representación encarna el Senado según el artículo 69 CE?',
    prompt: 'Contrasta el fundamento de la Cámara Alta con el de la Cámara Baja.',
    key: 'A',
    correct: {
      text: 'La representación territorial de los territorios del Estado.',
      rule: 'El art. 69.1 CE declara que el Senado es la Cámara de representación territorial, frente al Congreso, que representa al pueblo español.',
    },
    distractors: [
      {
        text: 'La representación corporativa de los grupos económicos y sindicales con implantación nacional.',
        trap: 'conceptual_merger',
        why: 'El Senado no representa intereses económicos o sindicales, sino el territorio de provincias, islas y Comunidades Autónomas.',
      },
      {
        text: 'La representación directa del pueblo español, igual que el Congreso, sin ningún matiz territorial.',
        trap: 'partial_rule_accuracy',
        why: 'La representación directa del pueblo es propia de las Cortes en su conjunto y del Congreso; el rasgo definitorio del Senado es la territorialidad.',
      },
      {
        text: 'La representación exclusiva de las Comunidades Autónomas, sin intervención de los electores de las provincias.',
        trap: 'wrong_competent_body',
        why: 'La mayoría de los senadores se elige por sufragio en las provincias e islas; solo una parte es designada por las Comunidades Autónomas.',
      },
    ],
    legal: 'Art. 69.1 CE',
    cluster: 'cluster_t5g_senado',
    difficulty: 1,
  },
  {
    stem: '¿Cuántos senadores se eligen en cada provincia y mediante qué sistema de sufragio?',
    prompt: 'Piensa en el reparto provincial y en las notas que acompañan a la elección.',
    key: 'A',
    correct: {
      text: 'Cuatro por provincia, por sufragio universal, libre, igual, directo y secreto.',
      rule: 'El art. 69.2 CE establece que en cada provincia se elegirán cuatro Senadores por sufragio universal, libre, igual, directo y secreto por los votantes de cada una de ellas.',
    },
    distractors: [
      {
        text: 'Tres por provincia, por sufragio universal, libre, igual, indirecto y secreto.',
        trap: 'numeric_substitution',
        why: 'El número es cuatro y el sufragio es directo, no indirecto.',
      },
      {
        text: 'Cuatro por provincia, pero designados por las Asambleas autonómicas y no elegidos por los ciudadanos.',
        trap: 'wrong_competent_body',
        why: 'Los cuatro senadores provinciales se eligen por los votantes; la designación autonómica se añade además, con otro criterio.',
      },
      {
        text: 'Dos por provincia, por sufragio restringido a los electores con residencia permanente en la capital.',
        trap: 'overbroad_statement',
        why: 'Ni el número ni el sistema de sufragio se corresponden con el art. 69.2 CE.',
      },
    ],
    legal: 'Art. 69.2 CE',
    cluster: 'cluster_t5g_senado',
    difficulty: 1,
  },
  {
    stem: '¿Cómo se reparte el número de senadores entre los dos grupos de circunscripciones insulares?',
    prompt: 'Separa los dos grupos de circunscripciones insulares y recuerda los ejemplos que se citan.',
    key: 'A',
    correct: {
      text: 'Tres en cada isla mayor; uno en cada una de las islas menores.',
      rule: 'El art. 69.3 CE atribuye tres Senadores a cada una de las islas mayores —Gran Canaria, Mallorca y Tenerife— y uno a cada una de las islas menores enumeradas, entre ellas Ibiza, Formentera, Menorca, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma.',
    },
    distractors: [
      {
        text: 'Cuatro en cada isla mayor y dos en cada isla menor, con independencia del Cabildo o Consejo Insular.',
        trap: 'numeric_substitution',
        why: 'La Constitución distingue tres para las mayores y uno para las menores, no cuatro y dos.',
      },
      {
        text: 'Tres en cada isla mayor y uno en las menores, pero solo mientras el Gobierno no declare la excepción insular.',
        trap: 'factual_misapplication',
        why: 'El reparto es constitucional y no está sujeto a una declaración gubernamental de excepción.',
      },
      {
        text: 'Un senador por cada isla, sin distinción entre mayores y menores, más uno por cada millón de habitantes.',
        trap: 'conceptual_merger',
        why: 'Existe una diferencia clara entre islas mayores y menores, y el criterio del millón de habitantes se aplica a las Comunidades Autónomas.',
      },
    ],
    legal: 'Art. 69.3 CE',
    cluster: 'cluster_t5g_senado',
    difficulty: 2,
  },
  {
    stem: '¿Cuántos senadores eligen Ceuta y Melilla en cada caso?',
    prompt: 'No confundas la representación de estas ciudades en el Congreso con la que tienen en el Senado.',
    key: 'A',
    correct: {
      text: 'Dos senadores cada una.',
      rule: 'El art. 69.4 CE dispone que las poblaciones de Ceuta y Melilla elegirán cada una de ellas dos Senadores, frente al Diputado único que les corresponde en el Congreso.',
    },
    distractors: [
      {
        text: 'Un senador cada una, igual que el número de diputados que les corresponde en la Cámara Baja.',
        trap: 'numeric_substitution',
        why: 'En el Senado son dos por ciudad; el Diputado único es la cifra del Congreso.',
      },
      {
        text: 'Tres senadores cada una, por tratarse de circunscripciones insulares asimiladas a las islas mayores.',
        trap: 'wrong_legal_object',
        why: 'Ceuta y Melilla no son circunscripciones insulares y su representación senatorial es de dos, no de tres.',
      },
      {
        text: 'Cuatro senadores en total, repartidos entre ambas ciudades según la población de cada una.',
        trap: 'partial_rule_accuracy',
        why: 'Cada ciudad elige dos senadores, de modo que el total es cuatro, pero no se reparten entre ambas según su población.',
      },
    ],
    legal: 'Art. 69.4 CE',
    cluster: 'cluster_t5g_senado',
    difficulty: 1,
  },
  {
    stem: '¿Qué senadores designan las Comunidades Autónomas además de los elegidos en provincias e islas?',
    prompt: 'Atiende al número y a qué órgano autonómico hace la designación en defecto del legislativo.',
    key: 'A',
    correct: {
      text: 'Uno más por cada millón de habitantes, por su Asamblea legislativa o, en su defecto, órgano colegiado superior.',
      rule: 'El art. 69.5 CE atribuye a las Comunidades Autónomas la designación de un Senador y otro más por cada millón de habitantes de su territorio, correspondiendo la designación a la Asamblea legislativa o, en su defecto, al órgano colegiado superior.',
    },
    distractors: [
      {
        text: 'Dos por cada millón de habitantes, designados por el Presidente de la Comunidad Autónoma sin intervención de la Asamblea.',
        trap: 'numeric_substitution',
        why: 'La regla es un Senador más por cada millón y la designación no corresponde en exclusiva al Presidente autonómico.',
      },
      {
        text: 'Uno por cada medio millón de habitantes, elegido directamente por los ciudadanos de la Comunidad Autónoma.',
        trap: 'factual_misapplication',
        why: 'El criterio es un millón de habitantes y la designación es autonómica, no una elección directa separada.',
      },
      {
        text: 'Uno por cada millón de habitantes, pero solo si el Tribunal Constitucional autoriza la designación previa.',
        trap: 'wrong_competent_body',
        why: 'La Constitución no somete la designación autonómica a autorización previa del Tribunal Constitucional.',
      },
    ],
    legal: 'Art. 69.5 CE',
    cluster: 'cluster_t5g_senado',
    difficulty: 2,
  },
  {
    stem: '¿Qué efecto tiene sobre Ibiza y Formentera la reforma del artículo 69.3 CE de mayo de 2026?',
    prompt: 'No confundas el reconocimiento de la circunscripción propia con el momento en que empieza a surtir efecto.',
    key: 'A',
    correct: {
      text: 'Les reconoce un senador propio, pero su eficacia se difiere a las primeras elecciones al Senado posteriores.',
      rule: 'La Reforma constitucional de 19 de mayo de 2026 (BOE-A-2026-10881), adaptada por la LO 2/2026 (BOE-A-2026-14329), reconoce una circunscripción propia a Ibiza y otra a Formentera, si bien su disposición transitoria única pospone la eficacia hasta las primeras elecciones al Senado convocadas tras su entrada en vigor.',
    },
    distractors: [
      {
        text: 'Les atribuye tres senadores a cada una desde el mismo día de la publicación de la reforma en el BOE.',
        trap: 'temporal_confusion',
        why: 'Ni el número es tres ni la eficacia es inmediata: la disposición transitoria única la difiere a las primeras elecciones al Senado.',
      },
      {
        text: 'Las integra en la circunscripción de Mallorca, suprimiendo su representación separada hasta nueva ley orgánica.',
        trap: 'conceptual_merger',
        why: 'La reforma hace lo contrario: reconoce circunscripciones separadas para Ibiza y para Formentera.',
      },
      {
        text: 'No altera su representación, porque el único cambio de la reforma afectó al Congreso y a la barrera electoral.',
        trap: 'wrong_legal_object',
        why: 'La reforma de mayo de 2026 modificó expresamente el art. 69.3 CE, referido al Senado y a las circunscripciones insulares.',
      },
    ],
    legal: 'Art. 69.3 CE; BOE-A-2026-10881 y BOE-A-2026-14329',
    cluster: 'cluster_t5g_senado',
    difficulty: 3,
  },

  // 20-26 — Sufragio, inelegibilidad e incompatibilidad
  {
    stem: '¿Quiénes carecen de derecho de sufragio activo conforme al artículo 3 LOREG?',
    prompt: 'Fíjate en la condición de la resolución penal que produce la privación.',
    key: 'A',
    correct: {
      text: 'Los condenados por sentencia firme a privación del sufragio, mientras se cumple la pena.',
      rule: 'El art. 3.1.a LOREG priva del derecho de sufragio a los condenados por sentencia judicial firme a la pena principal o accesoria de privación del derecho de sufragio, durante el tiempo de su cumplimiento.',
    },
    distractors: [
      {
        text: 'Los condenados por sentencia no firme a cualquier pena, desde el auto de procesamiento.',
        trap: 'absolute_relative_confusion',
        why: 'La privación del sufragio exige sentencia judicial firme, no un auto de procesamiento ni una resolución no firme.',
      },
      {
        text: 'Los investigados por delitos electorales, aunque no hayan sido enjuiciados ni condenados.',
        trap: 'factual_misapplication',
        why: 'La mera investigación no priva del derecho de sufragio; hace falta condena firme con la pena prevista.',
      },
      {
        text: 'Todos los presos, con independencia del delito y de la pena que se les haya impuesto.',
        trap: 'overbroad_statement',
        why: 'No basta la situación de prisión: se requiere una sentencia firme que imponga la pena de privación del sufragio.',
      },
    ],
    legal: 'LOREG, art. 3.1.a',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 2,
  },
  {
    stem: '¿Dónde y cómo debe ejercerse el derecho de sufragio según los artículos 4 y 5 LOREG?',
    prompt: 'Piensa en la sección censal, en la Mesa y en lo que nadie puede hacer en las elecciones.',
    key: 'A',
    correct: {
      text: 'Personalmente en la sección y Mesa correspondientes; nadie puede votar dos veces ni revelar su voto.',
      rule: 'Los arts. 4 y 5 LOREG disponen que el sufragio se ejerce personalmente en la sección censal y en la Mesa Electoral correspondiente, que nadie puede votar más de una vez en las mismas elecciones y que nadie puede ser obligado o coaccionado ni a revelar su voto.',
    },
    distractors: [
      {
        text: 'En cualquier Mesa del país, tantas veces como se quiera, y el voto puede hacerse público voluntariamente.',
        trap: 'overbroad_statement',
        why: 'El elector vota en la Mesa que le corresponde por el censo, una sola vez, y la ley protege el secreto del voto.',
      },
      {
        text: 'Personalmente en la Mesa que elija el elector, sin atender al censo, aunque vaya acompañado de otra persona.',
        trap: 'wrong_competent_body',
        why: 'La Mesa no es libre elección del votante: viene determinada por la inscripción censal en una sección.',
      },
      {
        text: 'En la sección censal, pero el voto puede delegarse por escrito a un interventor designado por el partido.',
        trap: 'factual_misapplication',
        why: 'El sufragio es personal; la ley solo admite el voto por correspondencia y el de los interventores en sus propias Mesas.',
      },
    ],
    legal: 'LOREG, arts. 4 y 5',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 2,
  },
  {
    stem: '¿Qué materias comprende “en todo caso” la reserva del artículo 70 CE sobre inelegibilidades?',
    prompt: 'Recuerda que la Constitución fija un núcleo mínimo y deja el resto a la ley electoral.',
    key: 'A',
    correct: {
      text: 'Componentes del TC, altos cargos salvo miembros del Gobierno, Defensor, Jueces y Fiscales activos, militares y Juntas Electorales.',
      rule: 'El art. 70.1 CE comprende en todo caso a los componentes del Tribunal Constitucional, los altos cargos de la Administración del Estado que determine la ley con excepción de los miembros del Gobierno, el Defensor del Pueblo, los Magistrados, Jueces y Fiscales en activo, los militares profesionales y miembros de las Fuerzas y Cuerpos de Seguridad y Policía en activo, y los miembros de las Juntas Electorales.',
    },
    distractors: [
      {
        text: 'Solo a los miembros del Gobierno y a los Presidentes de las Comunidades Autónomas, por ser cargos de elección popular.',
        trap: 'wrong_legal_object',
        why: 'Los miembros del Gobierno están expresamente exceptuados y los Presidentes autonómicos no figuran en el núcleo constitucional.',
      },
      {
        text: 'A todos los funcionarios públicos, con independencia de su cuerpo, situación administrativa o rango.',
        trap: 'overbroad_statement',
        why: 'La reserva no comprende a todos los funcionarios, sino a los altos cargos que determine la ley y a los colectivos enumerados.',
      },
      {
        text: 'A los componentes del TC, al Defensor y a los Jueces en activo, pero no a los militares ni a las Juntas Electorales.',
        trap: 'partial_rule_accuracy',
        why: 'La enumeración constitucional incluye también a los militares profesionales y a los miembros de las Juntas Electorales.',
      },
    ],
    legal: 'Art. 70 CE',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 3,
  },
  {
    stem: '¿Qué papel tienen la ley electoral y el poder judicial en el régimen de las credenciales parlamentarias?',
    prompt: 'No desplaces a los órganos que intervienen en la calificación de las credenciales.',
    key: 'A',
    correct: {
      text: 'La ley electoral las determina; la validez de las actas está sometida al control judicial.',
      rule: 'El art. 70 CE remite a la ley electoral la determinación de las causas de inelegibilidad e incompatibilidad de Diputados y Senadores y somete la validez de sus actas y credenciales al control judicial.',
    },
    distractors: [
      {
        text: 'El propio Reglamento de cada Cámara las determina y la Mesa correspondiente controla la validez de las credenciales sin recurso.',
        trap: 'wrong_competent_body',
        why: 'La reserva de la materia es de ley electoral y el control de la validez de las actas es judicial, no exclusivamente de la Mesa.',
      },
      {
        text: 'El Tribunal Constitucional las fija por vía interpretativa y controla de oficio todas las actas electorales.',
        trap: 'conceptual_merger',
        why: 'El Tribunal Constitucional no determina las causas de inelegibilidad: la Constitución las reserva a la ley electoral.',
      },
      {
        text: 'La ley orgánica las determina, pero la validez de las actas solo puede revisarla el Pleno de las Cortes Generales.',
        trap: 'factual_misapplication',
        why: 'El art. 70.2 CE somete la validez de las actas y credenciales al control judicial, no al Pleno.',
      },
    ],
    legal: 'Art. 70 CE',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 2,
  },
  {
    stem: 'Según el artículo 6.1.f LOREG, ¿qué puestos de la Administración son inelegibles por razón de su rango?',
    prompt: 'Distinguir los órganos directivos de los órganos superiores del Ministerio.',
    key: 'A',
    correct: {
      text: 'Subsecretarios, Secretarios generales y Directores generales, no Ministros ni Secretarios de Estado.',
      rule: 'El art. 6.1.f LOREG declara inelegibles a los Subsecretarios, Secretarios generales y Directores generales de los Departamentos Ministeriales y equiparados, en particular los Directores de Gabinetes de Ministros y Secretarios de Estado. Los Ministros y los Secretarios de Estado son órganos superiores y no se incluyen en esta causa, en coherencia con el art. 70.1.b CE.',
    },
    distractors: [
      {
        text: 'Los Ministros y los Secretarios de Estado, por ser órganos superiores, quedando excluidos los Subsecretarios.',
        trap: 'rule_exception_swap',
        why: 'La excepción constitucional se refiere a los miembros del Gobierno y el precepto legal enumeró a los Subsecretarios y Directores generales.',
      },
      {
        text: 'Todos los empleados públicos de la Administración General del Estado, sin distinción de cuerpo o puesto.',
        trap: 'overbroad_statement',
        why: 'La inelegibilidad se limita a los puestos determinados por la ley, no a todo el personal de la Administración.',
      },
      {
        text: 'Solo los Directores generales, sin incluir a los Subsecretarios ni a los Secretarios generales de los Departamentos.',
        trap: 'hyper_narrow_statement',
        why: 'La enumeración legal comprende expresamente a los tres niveles: Subsecretarios, Secretarios generales y Directores generales.',
      },
    ],
    legal: 'LOREG, art. 6.1.f; art. 70.1.b CE',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 3,
  },
  {
    stem: '¿En qué supuesto basta una sentencia penal que aún no sea firme para declarar la inelegibilidad?',
    prompt: 'Piensa en el contexto delictivo especial que la ley distingue del resto de condenas.',
    key: 'A',
    correct: {
      text: 'En los delitos de rebelión, terrorismo, contra la Administración Pública o las Instituciones del Estado.',
      rule: 'El art. 6.2.b LOREG declara inelegibles, aunque la sentencia no sea firme, a los condenados por rebelión, terrorismo, contra la Administración Pública o contra las Instituciones del Estado cuando se imponga inhabilitación para el sufragio pasivo, inhabilitación absoluta o especial o suspensión para empleo o cargo público.',
    },
    distractors: [
      {
        text: 'En cualquier delito, porque toda sentencia condenatoria produce inelegibilidad aunque pueda recurrirse.',
        trap: 'overbroad_statement',
        why: 'La regla general exige sentencia firme; la excepción se limita a los delitos expresamente enumerados.',
      },
      {
        text: 'En los delitos electorales y contra la seguridad vial, con independencia de la pena impuesta en la sentencia.',
        trap: 'wrong_legal_object',
        why: 'La ley no incluye esos delitos en el supuesto de sentencia no firme y exige además una pena de inhabilitación o suspensión.',
      },
      {
        text: 'En los delitos de terrorismo, pero solo si la sentencia impone una pena privativa de libertad.',
        trap: 'partial_rule_accuracy',
        why: 'No basta cualquier pena: se requiere inhabilitación para el sufragio pasivo, inhabilitación absoluta o especial o suspensión para empleo o cargo público.',
      },
    ],
    legal: 'LOREG, art. 6.2',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 3,
  },
  {
    stem: '¿Qué conexión hay en la LOREG entre los dos regímenes que impiden o privan la condición de representante?',
    prompt: 'Recuerda la regla de conversión que el profesor destacó al explicar el catálogo.',
    key: 'A',
    correct: {
      text: 'Las causas de inelegibilidad lo son también de incompatibilidad.',
      rule: 'El art. 6.4 LOREG establece que las causas de inelegibilidad lo son también de incompatibilidad, remitiendo el régimen de estas a lo dispuesto para cada tipo de proceso electoral.',
    },
    distractors: [
      {
        text: 'Son categorías independientes: una causa de inelegibilidad nunca puede operar como incompatibilidad.',
        trap: 'absolute_relative_confusion',
        why: 'La ley establece expresamente la conversión de unas en otras, por lo que no son categorías separadas.',
      },
      {
        text: 'Solo las causas relativas a los miembros de las Juntas Electorales se convierten en incompatibilidad.',
        trap: 'hyper_narrow_statement',
        why: 'La regla de conversión es general y no se limita a un colectivo concreto.',
      },
      {
        text: 'La incompatibilidad se rige por el Reglamento de cada Cámara, sin que la ley electoral establezca regla común alguna.',
        trap: 'wrong_competent_body',
        why: 'La LOREG sí contiene la regla común de conversión, sin perjuicio de las particularidades de cada proceso electoral.',
      },
    ],
    legal: 'LOREG, art. 6.4',
    cluster: 'cluster_t5g_sufragio_inelegibilidad',
    difficulty: 2,
  },

  // 27-32 — Pérdida y prerrogativas
  {
    stem: '¿Cuáles son las causas de pérdida de la condición de diputado que destacó el profesor en clase?',
    prompt: 'Contrasta la lista del Congreso con la de la Cámara Alta; no las des por idénticas.',
    key: 'A',
    correct: {
      text: 'Anulación judicial firme, fallecimiento o incapacitación, extinción del mandato y renuncia ante la Mesa.',
      rule: 'Son causas de pérdida de la condición de Diputado la decisión judicial firme que anule la elección o la proclamación, el fallecimiento o la incapacitación declarada por decisión judicial firme, la extinción del mandato por expiración del plazo o disolución de la Cámara y la renuncia presentada ante la Mesa del Congreso.',
    },
    distractors: [
      {
        text: 'Anulación judicial firme, condena a inhabilitación, fallecimiento, extinción, renuncia e incompatibilidad sobrevenida.',
        trap: 'conceptual_merger',
        why: 'La condena a inhabilitación y la incompatibilidad son causas propias de la pérdida de la condición de Senador, no del Diputado.',
      },
      {
        text: 'Únicamente la renuncia y el fallecimiento; las demás causas solo se aplican a los senadores designados.',
        trap: 'hyper_narrow_statement',
        why: 'La lista del Congreso comprende también la anulación judicial, la incapacitación y la extinción del mandato.',
      },
      {
        text: 'La disolución de la Cámara, la renuncia ante el Presidente del Gobierno y la pérdida de la condición de elector.',
        trap: 'wrong_competent_body',
        why: 'La renuncia se presenta ante la Mesa del Congreso, no ante el Presidente del Gobierno, y la pérdida de requisitos es propia del Senado.',
      },
    ],
    legal: 'Reglamento del Congreso; arts. 66 a 68 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    difficulty: 2,
  },
  {
    stem: '¿Qué causas se añaden en la pérdida de la condición de senador respecto de la de diputado?',
    prompt: 'Piensa en lo que el profesor resumió diciendo que unas y otras eran “primas o hermanas”.',
    key: 'A',
    correct: {
      text: 'Condena a inhabilitación, pérdida de requisitos de elegibilidad e incompatibilidad.',
      rule: 'La pérdida de la condición de Senador añade a las comunes la condena a inhabilitación absoluta o especial para cargo público, la pérdida de los requisitos generales de elegibilidad y las causas de incompatibilidad, conforme al art. 18 del Reglamento del Senado.',
    },
    distractors: [
      {
        text: 'La renuncia ante la Mesa del Congreso y la expiración del plazo de cuatro años, que no figuran entre las causas comunes.',
        trap: 'rule_exception_swap',
        why: 'Renuncia y extinción del mandato son causas comunes; lo específico del Senado son la inhabilitación, los requisitos y la incompatibilidad.',
      },
      {
        text: 'La disolución de la Cámara y la decisión judicial firme que anule la elección, exclusivas de la Cámara Alta.',
        trap: 'partial_rule_accuracy',
        why: 'Ambas figuran también entre las causas de pérdida de la condición de Diputado.',
      },
      {
        text: 'La incapacitación judicial firme y el fallecimiento, que la Constitución no reconoce en el Congreso.',
        trap: 'factual_misapplication',
        why: 'Fallecimiento e incapacitación judicial firme son causas comunes a las dos Cámaras.',
      },
    ],
    legal: 'Reglamento del Senado, art. 18; arts. 66 a 69 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    pair: 'pair_t5g_perdida_diputado_vs_senador',
    difficulty: 2,
  },
  {
    stem: '¿Por qué manifestaciones gozan de inviolabilidad los diputados y senadores?',
    prompt: 'Atiende al ámbito material y funcional de la prerrogativa.',
    key: 'A',
    correct: {
      text: 'Por las opiniones manifestadas en el ejercicio de sus funciones.',
      rule: 'El art. 71.1 CE reconoce la inviolabilidad de Diputados y Senadores por las opiniones manifestadas en el ejercicio de sus funciones, sin que puedan ser juzgados por ellas.',
    },
    distractors: [
      {
        text: 'Por cualquier opinión que expresen, incluso fuera del ejercicio de su cargo y en el ámbito estrictamente privado.',
        trap: 'overbroad_statement',
        why: 'La inviolabilidad no cubre todas las manifestaciones, sino solo las realizadas en el ejercicio de las funciones parlamentarias.',
      },
      {
        text: 'Por los votos que emitan en el Pleno, pero no por las opiniones expresadas en las Comisiones.',
        trap: 'hyper_narrow_statement',
        why: 'La prerrogativa comprende las opiniones en el ejercicio de las funciones, sin limitarla al Pleno ni excluir las Comisiones.',
      },
      {
        text: 'Por los escritos que presenten a la Mesa, siempre que hayan sido aprobados por el grupo parlamentario.',
        trap: 'factual_misapplication',
        why: 'La inviolabilidad no depende de la aprobación del grupo parlamentario ni se limita a los escritos dirigidos a la Mesa.',
      },
    ],
    legal: 'Art. 71.1 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    difficulty: 1,
  },
  {
    stem: '¿Qué permite la inmunidad de los parlamentarios durante el período de su mandato?',
    prompt: 'Piensa en el único supuesto en que la detención es posible y en su duración.',
    key: 'A',
    correct: {
      text: 'Solo pueden ser detenidos en caso de flagrante delito mientras dure el mandato.',
      rule: 'El art. 71.2 CE establece que, durante el período del mandato, Diputados y Senadores gozan de inmunidad y solo pueden ser detenidos en caso de flagrante delito.',
    },
    distractors: [
      {
        text: 'Pueden ser detenidos libremente en cualquier momento, pues la inmunidad solo opera después del mandato.',
        trap: 'rule_exception_swap',
        why: 'La inmunidad opera precisamente durante el mandato y solo se exceptúa la detención en flagrante delito.',
      },
      {
        text: 'No pueden ser detenidos ni en flagrante delito, salvo autorización del Tribunal Constitucional.',
        trap: 'absolute_relative_confusion',
        why: 'El propio art. 71.2 CE prevé la excepción de flagrante delito sin exigir autorización del Tribunal Constitucional.',
      },
      {
        text: 'Solo pueden ser detenidos en flagrante delito si el delito se comete dentro del recinto de la Cámara.',
        trap: 'hyper_narrow_statement',
        why: 'La Constitución no limita la excepción al interior de la sede parlamentaria.',
      },
    ],
    legal: 'Art. 71.2 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    difficulty: 2,
  },
  {
    stem: '¿Cómo se denomina la previa autorización de la Cámara para inculpar o procesar a uno de sus miembros?',
    prompt: 'El profesor recalcó en clase el término técnico que una alumna preguntó por el chat.',
    key: 'A',
    correct: {
      text: 'Suplicatorio.',
      rule: 'La previa autorización de la Cámara respectiva para inculpar o procesar a un Diputado o Senador se denomina técnicamente suplicatorio, y está prevista en el art. 71.2 CE.',
    },
    distractors: [
      {
        text: 'Exequátur, que es la autorización que el Rey da a los cónsules extranjeros para ejercer en España.',
        trap: 'wrong_legal_object',
        why: 'El exequátur es una figura del derecho consular, no una autorización parlamentaria para procesar a un miembro de las Cortes.',
      },
      {
        text: 'Placet, que es el consentimiento que el Gobierno presta para la instalación de un embajador extranjero.',
        trap: 'familiar_wording_trap',
        why: 'El placet pertenece al ámbito diplomático y no guarda relación con la inmunidad parlamentaria.',
      },
      {
        text: 'Suplicio procesal, que exige además el informe previo del Fiscal General del Estado.',
        trap: 'conceptual_merger',
        why: 'El término correcto es suplicatorio y la Constitución no exige informe previo del Fiscal General para esta autorización.',
      },
    ],
    legal: 'Art. 71.2 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    difficulty: 2,
  },
  {
    stem: '¿Qué órgano es competente en las causas judiciales contra diputados y senadores?',
    prompt: 'El profesor lo presentaba como factor común de casi toda la clase de Constitución.',
    key: 'A',
    correct: {
      text: 'La Sala de lo Penal del Tribunal Supremo.',
      rule: 'El art. 71.3 CE atribuye a la Sala de lo Penal del Tribunal Supremo la competencia en las causas contra Diputados y Senadores.',
    },
    distractors: [
      {
        text: 'La Sala de lo Contencioso-Administrativo de la Audiencia Nacional, por tratarse de cargo público.',
        trap: 'wrong_competent_body',
        why: 'La competencia no corresponde a la Audiencia Nacional ni a la jurisdicción contencioso-administrativa.',
      },
      {
        text: 'El Tribunal Constitucional, en única instancia, por afectar a las funciones representativas.',
        trap: 'conceptual_merger',
        why: 'El Tribunal Constitucional no conoce de las causas penales contra parlamentarios; las reserva el art. 71.3 al Tribunal Supremo.',
      },
      {
        text: 'La Sala de lo Civil del Tribunal Supremo, con independencia de la naturaleza de la causa.',
        trap: 'partial_rule_accuracy',
        why: 'La Sala competente es la de lo Penal, no la de lo Civil, y la regla se refiere a las causas en general.',
      },
    ],
    legal: 'Art. 71.3 CE',
    cluster: 'cluster_t5g_perdida_prerrogativas',
    difficulty: 1,
  },

  // 33-41 — Funcionamiento
  {
    stem: '¿Qué mayoría exige la Constitución para la reforma del Reglamento de cada Cámara?',
    prompt: 'No lo confundas con la mayoría que basta para los acuerdos ordinarios de cada Cámara.',
    key: 'A',
    correct: {
      text: 'Mayoría absoluta, en votación final sobre la totalidad.',
      rule: 'El art. 72.1 CE somete los Reglamentos y su reforma a una votación final sobre su totalidad que requiere mayoría absoluta.',
    },
    distractors: [
      {
        text: 'Mayoría simple de los miembros presentes, como cualquier otro acuerdo de la Cámara.',
        trap: 'absolute_relative_confusion',
        why: 'La reforma reglamentaria está sujeta a una mayoría especial: la absoluta, con votación final sobre el total.',
      },
      {
        text: 'Mayoría de dos tercios de los grupos parlamentarios, con informe previo de la Junta de Portavoces.',
        trap: 'numeric_substitution',
        why: 'La Constitución no exige dos tercios ni un informe de la Junta de Portavoces para reformar el Reglamento.',
      },
      {
        text: 'Mayoría absoluta de cada Cámara reunida en sesión conjunta, bajo la presidencia del Presidente del Congreso.',
        trap: 'wrong_competent_body',
        why: 'Cada Cámara reforma su propio Reglamento por separado; la sesión conjunta es un órgano distinto con su propio Reglamento.',
      },
    ],
    legal: 'Art. 72.1 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },
  {
    stem: '¿Quién preside las sesiones conjuntas de las Cortes Generales y por qué reglamento se rigen?',
    prompt: 'Piensa en la Cámara cuyo Presidente asume la dirección y en el texto que regula esa reunión.',
    key: 'A',
    correct: {
      text: 'El Presidente del Congreso, con un Reglamento de las Cortes aprobado por mayoría absoluta de cada Cámara.',
      rule: 'El art. 72.2 CE atribuye la presidencia de las sesiones conjuntas al Presidente del Congreso y las somete a un Reglamento de las Cortes Generales aprobado por mayoría absoluta de cada Cámara.',
    },
    distractors: [
      {
        text: 'El Presidente del Senado, con el Reglamento del Senado aprobado por mayoría simple de los presentes.',
        trap: 'wrong_competent_body',
        why: 'La presidencia corresponde al Presidente del Congreso y el Reglamento aplicable es el de las Cortes Generales, no el del Senado.',
      },
      {
        text: 'Los Presidentes de ambas Cámaras, alternativamente, con el Reglamento que cada una apruebe por separado.',
        trap: 'conceptual_merger',
        why: 'La presidencia no es alterna ni compartida: la Constitución la atribuye en exclusiva al Presidente del Congreso.',
      },
      {
        text: 'El Presidente del Congreso, con el Reglamento del Congreso aprobado por mayoría absoluta de esa Cámara.',
        trap: 'partial_rule_accuracy',
        why: 'Acierta la presidencia, pero el Reglamento es el común de las Cortes Generales y requiere mayoría absoluta de las dos Cámaras.',
      },
    ],
    legal: 'Art. 72.2 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },
  {
    stem: '¿Cuáles son los dos períodos ordinarios de sesiones de las Cámaras?',
    prompt: 'El profesor advirtió que esta pregunta ya cayó en un examen anterior.',
    key: 'A',
    correct: {
      text: 'Septiembre a diciembre y febrero a junio.',
      rule: 'El art. 73.1 CE establece dos períodos ordinarios anuales: el primero de septiembre a diciembre y el segundo de febrero a junio.',
    },
    distractors: [
      {
        text: 'Enero a abril y julio a octubre, con una interrupción en el período estival.',
        trap: 'temporal_confusion',
        why: 'Los períodos constitucionales son septiembre-diciembre y febrero-junio, no los que se indican.',
      },
      {
        text: 'Septiembre a diciembre y enero a junio, incluyendo el mes de enero en el segundo período.',
        trap: 'numeric_substitution',
        why: 'El segundo período comienza en febrero; enero queda fuera de los períodos ordinarios.',
      },
      {
        text: 'Un único período continuo de septiembre a junio, sin subdivisiones ni recesos parlamentarios.',
        trap: 'overbroad_statement',
        why: 'La Constitución establece expresamente dos períodos ordinarios diferenciados.',
      },
    ],
    legal: 'Art. 73.1 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 1,
  },
  {
    stem: '¿Quiénes pueden pedir la convocatoria de sesiones extraordinarias según el texto consolidado del BOE?',
    prompt: 'Aquí el profesor y el PDF dijeron una cosa y el precepto dice otra; quédate con el precepto.',
    key: 'A',
    correct: {
      text: 'El Gobierno, la Diputación Permanente o la mayoría absoluta de los miembros de cualquiera de las Cámaras.',
      rule: 'El art. 73.2 CE permite reunir las Cámaras en sesiones extraordinarias a petición del Gobierno, de la Diputación Permanente o de la mayoría absoluta de los miembros de cualquiera de las Cámaras. Basta, por tanto, la mayoría absoluta de una sola de ellas; no se exige petición conjunta de ambas.',
    },
    distractors: [
      {
        text: 'El Gobierno, la Diputación Permanente o la mayoría absoluta de cada una de las Cámaras de forma conjunta.',
        trap: 'partial_rule_accuracy',
        why: 'El texto consolidado dice «cualquiera de las Cámaras», no «cada Cámara»: basta la mayoría absoluta de una sola.',
      },
      {
        text: 'Solo el Gobierno y el Presidente del Congreso, sin intervención de la Diputación Permanente.',
        trap: 'wrong_competent_body',
        why: 'La Diputación Permanente es uno de los tres actores legitimados por el art. 73.2 CE.',
      },
      {
        text: 'Cualquier grupo parlamentario, con independencia de su tamaño, mediante solicitud dirigida a la Mesa.',
        trap: 'overbroad_statement',
        why: 'No basta la iniciativa de un grupo: se requiere mayoría absoluta de los miembros de una Cámara o petición de los otros dos actores.',
      },
    ],
    legal: 'Art. 73.2 CE (BOE-A-1978-31229, texto consolidado)',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 3,
  },
  {
    stem: '¿Cómo se adoptan las decisiones de las Cortes previstas en los artículos 94.1, 145.2 y 158.2 CE y quién las inicia?',
    prompt: 'Separa el régimen de mayoría del órgano que empieza el procedimiento en cada supuesto.',
    key: 'A',
    correct: {
      text: 'Por mayoría de cada Cámara; los tratados los inicia el Congreso y los convenios y el Fondo, el Senado.',
      rule: 'El art. 74.2 CE dispone que esas decisiones se adoptan por mayoría de cada una de las Cámaras; el procedimiento se inicia por el Congreso en el primer caso y por el Senado en los otros dos, con Comisión Mixta paritaria en caso de desacuerdo y decisión final del Congreso por mayoría absoluta.',
    },
    distractors: [
      {
        text: 'Por mayoría absoluta de cada Cámara; todos los procedimientos se inician por el Senado y decide el Congreso por mayoría simple.',
        trap: 'rule_exception_swap',
        why: 'El texto no exige mayoría absoluta en cada Cámara, los tratados los inicia el Congreso y el desempate exige mayoría absoluta del Congreso.',
      },
      {
        text: 'Por mayoría de cada Cámara; los convenios entre Comunidades Autónomas los inicia el Congreso y los tratados el Senado.',
        trap: 'conceptual_merger',
        why: 'Invierte los órganos de iniciación: los tratados corresponden al Congreso y los convenios y el Fondo al Senado.',
      },
      {
        text: 'Por mayoría simple conjunta en sesión de las dos Cámaras, sin Comisión Mixta ni intervención posterior del Congreso.',
        trap: 'factual_misapplication',
        why: 'La decisión se adopta por cada Cámara, se prevé una Comisión Mixta y el Congreso decide en último término por mayoría absoluta.',
      },
    ],
    legal: 'Art. 74.2 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 3,
  },
  {
    stem: '¿Qué materias no pueden delegarse en las Comisiones Legislativas Permanentes?',
    prompt: 'Piensa en las materias reservadas al Pleno por su importancia y por su régimen especial.',
    key: 'A',
    correct: {
      text: 'Reforma constitucional, cuestiones internacionales, leyes orgánicas y de bases y Presupuestos Generales del Estado.',
      rule: 'El art. 75.3 CE exceptúa de la delegación en Comisiones Legislativas Permanentes la reforma constitucional, las cuestiones internacionales, las leyes orgánicas y de bases y los Presupuestos Generales del Estado.',
    },
    distractors: [
      {
        text: 'Solo la reforma constitucional y los Presupuestos Generales del Estado; el resto puede delegarse libremente.',
        trap: 'hyper_narrow_statement',
        why: 'La lista constitucional comprende también las cuestiones internacionales y las leyes orgánicas y de bases.',
      },
      {
        text: 'Todas las proposiciones de ley, sin excepción, porque el Pleno no puede delegar ninguna aprobación normativa.',
        trap: 'absolute_relative_confusion',
        why: 'El art. 75.2 CE admite la delegación de proyectos y proposiciones de ley; solo excluye las materias del apartado 3.',
      },
      {
        text: 'Las leyes ordinarias y los decretos-leyes, pero no las cuestiones internacionales ni las leyes de bases.',
        trap: 'wrong_legal_object',
        why: 'Las leyes ordinarias sí pueden delegarse y los decretos-leyes no son objeto de delegación parlamentaria, mientras que sí lo están las materias citadas.',
      },
    ],
    legal: 'Art. 75 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },
  {
    stem: '¿Cómo pueden presentarse las peticiones a las Cámaras y qué obligación tiene el Gobierno al recibirlas?',
    prompt: 'Fíjate en el verbo que el profesor subrayó al explicar este punto.',
    key: 'A',
    correct: {
      text: 'Solo por escrito; el Gobierno está obligado a explicarse sobre su contenido.',
      rule: 'El art. 77 CE admite peticiones individuales y colectivas siempre por escrito, prohíbe la presentación directa por manifestaciones ciudadanas y obliga al Gobierno a explicarse sobre el contenido de las que las Cámaras le remitan.',
    },
    distractors: [
      {
        text: 'Pueden presentarse en manifestación ciudadana y el Gobierno está obligado a cumplir lo solicitado en el plazo de un mes.',
        trap: 'rule_exception_swap',
        why: 'La presentación directa por manifestaciones está prohibida y el Gobierno se limita a explicarse, no a cumplir la petición.',
      },
      {
        text: 'Solo por escrito, pero el Gobierno puede responder que no dará explicación alguna si la petición no viene firmada por un diputado.',
        trap: 'factual_misapplication',
        why: 'La obligación de explicarse se activa cuando las Cámaras lo exigen, sin que se requiera firma de un diputado.',
      },
      {
        text: 'Solo por vía telemática y el Gobierno debe ejecutar la petición en el siguiente período ordinario de sesiones.',
        trap: 'overbroad_statement',
        why: 'La Constitución exige forma escrita, no necesariamente telemática, y no impone al Gobierno una obligación de ejecución.',
      },
    ],
    legal: 'Art. 77 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },
  {
    stem: '¿Hasta cuándo ejerce sus funciones la Diputación Permanente si se disuelven las Cámaras?',
    prompt: 'El profesor insistió en que no se disuelve el día de las elecciones, sino en otro momento posterior.',
    key: 'A',
    correct: {
      text: 'Hasta que se constituyen las nuevas Cortes Generales.',
      rule: 'El art. 78.3 CE dispone que, expirado el mandato o en caso de disolución, las Diputaciones Permanentes siguen ejerciendo sus funciones hasta la constitución de las nuevas Cortes Generales.',
    },
    distractors: [
      {
        text: 'Hasta el día mismo de la celebración de las elecciones generales.',
        trap: 'temporal_confusion',
        why: 'La Constitución fija como término la constitución de las nuevas Cortes, no la fecha de los comicios.',
      },
      {
        text: 'Hasta que el Rey nombra al Presidente del Gobierno, sin esperar a la constitución de las Cortes.',
        trap: 'wrong_competent_body',
        why: 'El nombramiento del Presidente no es el momento señalado por el art. 78.3 CE.',
      },
      {
        text: 'Hasta que la Junta Electoral Central proclama los resultados definitivos de las elecciones.',
        trap: 'factual_misapplication',
        why: 'La proclamación de resultados no sustituye al hecho constitucionalmente previsto: la constitución de las nuevas Cortes.',
      },
    ],
    legal: 'Art. 78 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },
  {
    stem: '¿Qué mayorías exige el artículo 79 CE para reunir y aprobar acuerdos en las Cámaras?',
    prompt: 'Separa el quórum de constitución de la mayoría necesaria para aprobar, sin olvidar el carácter del voto.',
    key: 'A',
    correct: {
      text: 'Asistencia de la mayoría de los miembros y aprobación por mayoría de los presentes; el voto es personal.',
      rule: 'El art. 79 CE exige reunión reglamentaria con asistencia de la mayoría de los miembros para adoptar acuerdos y su aprobación por mayoría de los miembros presentes, sin perjuicio de las mayorías especiales; el voto de Senadores y Diputados es personal e indelegable.',
    },
    distractors: [
      {
        text: 'Asistencia de la mayoría de los presentes y aprobación por mayoría absoluta de todos los miembros, con voto delegable.',
        trap: 'rule_exception_swap',
        why: 'Invierte los términos: el quórum se refiere a la mayoría de los miembros y la aprobación a la de los presentes; además, el voto no es delegable.',
      },
      {
        text: 'Asistencia de un tercio de los miembros y aprobación por mayoría simple de ese tercio, salvo en las Comisiones.',
        trap: 'numeric_substitution',
        why: 'El quórum constitucional es la mayoría de los miembros, no un tercio, y la regla se aplica a las Cámaras.',
      },
      {
        text: 'No se exige quórum alguno y basta la mayoría de los votos emitidos, pudiendo delegar el voto en otro parlamentario.',
        trap: 'absolute_relative_confusion',
        why: 'La Constitución impone un quórum de asistencia y declara el voto personal e indelegable.',
      },
    ],
    legal: 'Art. 79 CE',
    cluster: 'cluster_t5g_funcionamiento',
    difficulty: 2,
  },

  // 42-48 — Funciones
  {
    stem: '¿Cómo pueden delegar las Cortes Generales en el Gobierno la potestad de dictar normas con rango de ley para formar textos articulados?',
    prompt: 'Contrasta las dos formas de delegación según el tipo de texto que se pretende obtener.',
    key: 'A',
    correct: {
      text: 'Mediante ley de bases; la ley ordinaria se reserva para refundir textos.',
      rule: 'El art. 82 CE permite la delegación por ley de bases para la formación de textos articulados y por ley ordinaria para refundir varios textos legales en uno solo; la delegación la otorgan las Cortes Generales, no el Congreso en solitario.',
    },
    distractors: [
      {
        text: 'Mediante ley ordinaria; la ley de bases se reserva para la refundición de textos legales.',
        trap: 'rule_exception_swap',
        why: 'Invierte los instrumentos: la ley de bases produce textos articulados y la ley ordinaria, textos refundidos.',
      },
      {
        text: 'Mediante resolución de la Mesa del Congreso, sin intervención del Senado ni ley habilitante alguna.',
        trap: 'wrong_competent_body',
        why: 'La delegación legislativa exige una ley; no puede hacerla la Mesa de una Cámara por resolución.',
      },
      {
        text: 'Mediante ley orgánica, por tratarse de una materia reservada a mayoría absoluta en las dos Cámaras.',
        trap: 'wrong_legal_object',
        why: 'La Constitución no exige ley orgánica para delegar: distingue entre ley de bases y ley ordinaria.',
      },
    ],
    legal: 'Art. 82 CE',
    cluster: 'cluster_t5g_funciones',
    pair: 'pair_t5g_delegacion_vs_decreto_ley',
    difficulty: 2,
  },
  {
    stem: '¿Quién dicta un decreto-ley y qué Cámara ejerce el control parlamentario posterior sobre esa norma?',
    prompt: 'Separa el contexto de la delegación del contexto de la urgencia unilateral del Ejecutivo.',
    key: 'A',
    correct: {
      text: 'Lo dicta el Gobierno y lo controla el Congreso, pronunciándose sobre su convalidación o derogación.',
      rule: 'El art. 86 CE faculta al Gobierno para dictar decretos-leyes por extraordinaria y urgente necesidad y exige que sean sometidos a debate y votación de la totalidad del Congreso, que se pronuncia expresamente sobre su convalidación o derogación.',
    },
    distractors: [
      {
        text: 'Lo dictan las Cortes Generales por delegación y lo convalida el Senado en el plazo de dos meses.',
        trap: 'conceptual_merger',
        why: 'El decreto-ley no es una delegación de las Cortes: lo dicta el Gobierno y su control corresponde al Congreso.',
      },
      {
        text: 'Lo dicta el Gobierno y lo convalida el Tribunal Constitucional a petición del Presidente del Congreso.',
        trap: 'wrong_competent_body',
        why: 'El control parlamentario del decreto-ley corresponde al Congreso, no al Tribunal Constitucional.',
      },
      {
        text: 'Lo dicta el Rey a propuesta del Gobierno y lo deroga la Diputación Permanente si las Cámaras están disueltas.',
        trap: 'factual_misapplication',
        why: 'El decreto-ley es una disposición del Gobierno; la Diputación Permanente solo asume las facultades del art. 86 en caso de disolución.',
      },
    ],
    legal: 'Art. 86 CE',
    cluster: 'cluster_t5g_funciones',
    pair: 'pair_t5g_delegacion_vs_decreto_ley',
    difficulty: 3,
  },
  {
    stem: '¿A quién corresponde elegir al Presidente del Gobierno según la función de control que vimos en clase?',
    prompt: 'Recuerda la distinción entre quien decide políticamente y quien da forma jurídica a la decisión.',
    key: 'A',
    correct: {
      text: 'Al Congreso de los Diputados; el Rey solo materializa lo ya decidido.',
      rule: 'El art. 99 CE atribuye al Congreso la elección del Presidente del Gobierno; el Rey propone al candidato en el procedimiento constitucional, pero no elige libremente, sino que da forma a lo decidido por la Cámara.',
    },
    distractors: [
      {
        text: 'Al Rey, que designa libremente al candidato sin necesidad de la ratificación del Congreso.',
        trap: 'wrong_competent_body',
        why: 'El Rey no elige al Presidente: el art. 99 CE atribuye la elección al Congreso y el refrendo de la propuesta y nombramiento al Presidente del Congreso.',
      },
      {
        text: 'A las Cortes Generales en sesión conjunta, por mayoría absoluta de cada Cámara.',
        trap: 'conceptual_merger',
        why: 'La investidura es competencia del Congreso, no de una sesión conjunta de las dos Cámaras.',
      },
      {
        text: 'Al Tribunal Constitucional, que designa al candidato con mayor apoyo parlamentario tras un incidente de filtración.',
        trap: 'factual_misapplication',
        why: 'Ninguna función de investidura corresponde al Tribunal Constitucional.',
      },
    ],
    legal: 'Art. 99 CE',
    cluster: 'cluster_t5g_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Quién toma la iniciativa en la moción de censura y quién en la cuestión de confianza?',
    prompt: 'El profesor lo resumió diciendo que lo que cambiaba era quién presentaba cada figura.',
    key: 'A',
    correct: {
      text: 'La moción la presentan los diputados de la oposición; la confianza la plantea el propio Presidente del Gobierno.',
      rule: 'El art. 100 CE atribuye la iniciativa de la moción de censura a los diputados, mientras que el art. 101 CE permite al Presidente del Gobierno plantear la cuestión de confianza sobre su programa o una decisión política.',
    },
    distractors: [
      {
        text: 'La moción la presenta el Presidente del Gobierno y la confianza la oposición, invirtiendo los papeles.',
        trap: 'rule_exception_swap',
        why: 'Es exactamente al revés: la oposición presenta la moción y el Presidente plantea la cuestión de confianza.',
      },
      {
        text: 'Ambas figuras las presenta el Presidente del Congreso, previo acuerdo de la Junta de Portavoces.',
        trap: 'wrong_competent_body',
        why: 'Ni el Presidente del Congreso ni la Junta de Portavoces toman la iniciativa de estas figuras de control.',
      },
      {
        text: 'La moción la presenta el Grupo Parlamentario mayoritario y la confianza cualquier diputado con el apoyo de diez miembros.',
        trap: 'conceptual_merger',
        why: 'La moción es una iniciativa de los diputados opositor y la confianza es exclusivamente del Presidente del Gobierno.',
      },
    ],
    legal: 'Arts. 100 y 101 CE',
    cluster: 'cluster_t5g_funciones',
    pair: 'pair_t5g_mocion_vs_confianza',
    difficulty: 2,
  },
  {
    stem: '¿Qué facultad tiene el Congreso en materia de estados de alarma, excepción y sitio?',
    prompt: 'No mezcles los tres estados ni el papel del Gobierno con el de la Cámara.',
    key: 'A',
    correct: {
      text: 'Autoriza la prórroga del alarma, autoriza el excepción o su prórroga y declara el sitio.',
      rule: 'El art. 116 CE atribuye al Congreso la autorización de la prórroga del estado de alarma, la autorización del estado de excepción o su prórroga y la declaración del estado de sitio; el Gobierno declara el alarma y propone los otros dos.',
    },
    distractors: [
      {
        text: 'Declara los tres estados y el Gobierno solo ejecuta las medidas que el Congreso le ordene.',
        trap: 'overbroad_statement',
        why: 'El Gobierno declara el estado de alarma y propone la excepción; el Congreso no declara los tres estados.',
      },
      {
        text: 'Autoriza la declaración del alarma y declara el excepción, pero no interviene en el sitio.',
        trap: 'rule_exception_swap',
        why: 'Es al revés: el Gobierno declara el alarma, el Congreso autoriza la excepción y declara el sitio.',
      },
      {
        text: 'Solo recibe información del Gobierno, sin poder de autorización ni declaración en ninguno de los tres estados.',
        trap: 'absolute_relative_confusion',
        why: 'El art. 116 CE reconoce al Congreso facultades decisivas de autorización y declaración en los estados de excepción y sitio.',
      },
    ],
    legal: 'Art. 116 CE',
    cluster: 'cluster_t5g_funciones',
    difficulty: 3,
  },
  {
    stem: '¿Qué órgano elabora los Presupuestos Generales del Estado y cuál es la función de las Cortes sobre ellos?',
    prompt: 'Separar la iniciativa presupuestaria del examen y aprobación parlamentarios.',
    key: 'A',
    correct: {
      text: 'Los elabora el Gobierno; las Cortes los examinan, enmiendan y aprueban.',
      rule: 'El art. 134.1 CE atribuye al Gobierno la elaboración de los Presupuestos Generales del Estado y a las Cortes Generales su examen, enmienda y aprobación; el art. 134.3 exige presentarlos al menos tres meses antes de la expiración de los del año anterior.',
    },
    distractors: [
      {
        text: 'Los elabora el Congreso y el Gobierno se limita a ejecutarlos sin poder de enmienda ni observación.',
        trap: 'wrong_competent_body',
        why: 'La iniciativa presupuestaria es del Gobierno y el control parlamentario corresponde a las Cortes Generales.',
      },
      {
        text: 'Los elabora el Ministerio de Hacienda y las Cortes solo pueden aprobarlos o rechazarlos en bloque, sin enmiendas.',
        trap: 'hyper_narrow_statement',
        why: 'Las Cortes pueden examinarlos y enmendarlos, no solo votarlos en bloque.',
      },
      {
        text: 'Los elabora el Gobierno y los aprueba el Senado en solitario, con el informe previo del Tribunal de Cuentas.',
        trap: 'conceptual_merger',
        why: 'La aprobación corresponde a las Cortes Generales, no al Senado en solitario, y no se exige informe previo del Tribunal de Cuentas.',
      },
    ],
    legal: 'Art. 134.1 y 134.3 CE',
    cluster: 'cluster_t5g_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Qué regla establece el artículo 134 CE sobre los tributos en la ley de Presupuestos y sobre su prórroga?',
    prompt: 'Piensa en la diferencia entre crear y modificar, y en lo que ocurre si no se aprueban a tiempo.',
    key: 'A',
    correct: {
      text: 'No puede crear tributos; sí puede modificarlos si una ley sustantiva lo prevé, y se prorrogan automáticamente.',
      rule: 'El art. 134.7 CE prohíbe a la Ley de Presupuestos crear tributos y le permite modificarlos cuando una ley tributaria sustantiva así lo prevea; el art. 134.4 establece la prórroga automática de los presupuestos anteriores si no se aprueban los nuevos antes del primer día del ejercicio.',
    },
    distractors: [
      {
        text: 'Puede crear tributos, pero no modificarlos, y los presupuestos caducan si no se aprueban en el plazo legal.',
        trap: 'rule_exception_swap',
        why: 'Invierte la regla: no puede crear tributos, sí modificarlos con habilitación legal, y los anteriores se prorrogan automáticamente.',
      },
      {
        text: 'No puede crear ni modificar tributos en ningún supuesto, y el Gobierno debe dictar un decreto-ley de prórroga.',
        trap: 'absolute_relative_confusion',
        why: 'Sí se admiten modificaciones previstas por ley sustantiva y la prórroga es automática, sin decreto-ley.',
      },
      {
        text: 'Puede crear tributos de carácter anual y la prórroga requiere mayoría absoluta del Congreso para cada ejercicio.',
        trap: 'factual_misapplication',
        why: 'La Constitución prohíbe crear tributos en la ley de presupuestos y la prórroga no exige una votación específica.',
      },
    ],
    legal: 'Art. 134.4 y 134.7 CE',
    cluster: 'cluster_t5g_funciones',
    difficulty: 3,
  },

  // 49-50 — Órganos internos y grupos parlamentarios
  {
    stem: '¿Cómo se compone la Mesa del Congreso y en qué se diferencia de la del Senado?',
    prompt: 'Recuerda los cargos y el número de Vicepresidencias de cada Cámara.',
    key: 'A',
    correct: {
      text: 'Congreso: un Presidente, cuatro Vicepresidencias y cuatro Secretarías; Senado: dos Vicepresidencias.',
      rule: 'La Mesa del Congreso se compone de un Presidente, cuatro Vicepresidentes y cuatro Secretarios, mientras que la del Senado tiene un Presidente, dos Vicepresidentes y cuatro Secretarios.',
    },
    distractors: [
      {
        text: 'Congreso: un Presidente, dos Vicepresidencias y cuatro Secretarías; Senado: cuatro Vicepresidencias.',
        trap: 'numeric_substitution',
        why: 'Invierte el número de Vicepresidencias: el Congreso tiene cuatro y el Senado dos.',
      },
      {
        text: 'Ambas Mesas tienen un Presidente, tres Vicepresidencias y tres Secretarías, con idéntica composición.',
        trap: 'conceptual_merger',
        why: 'Las composiciones no son idénticas: difieren en el número de Vicepresidencias y coinciden en las Secretarías.',
      },
      {
        text: 'Congreso: un Presidente y cuatro Vicepresidencias, sin Secretarías; Senado: dos Vicepresidencias y seis Secretarías.',
        trap: 'partial_rule_accuracy',
        why: 'Ambas Mesas incluyen cuatro Secretarías; la diferencia está en las Vicepresidencias.',
      },
    ],
    legal: 'Reglamento del Congreso y Reglamento del Senado',
    cluster: 'cluster_t5g_organos_grupos',
    difficulty: 2,
  },
  {
    stem: '¿Qué umbrales alternativos permiten constituir grupo parlamentario en el Congreso desde la próxima legislatura?',
    prompt: 'El profesor advirtió que los tribunales suelen preguntar lo modificado hace poco; compara el antes y el después.',
    key: 'A',
    correct: {
      text: 'Cinco escaños y una media del 10 % en circunscripciones con representación o el 3 % nacional.',
      rule: 'La reforma del art. 23.1 del Reglamento del Congreso de 23 de julio de 2026 (BOE-A-2026-16353), con entrada en vigor en la XVI legislatura, mantiene el mínimo de 15 diputados y de 5 escaños, pero sustituye el 15 % de los votos de las circunscripciones presentadas o el 5 % nacional por una media del 10 % en las circunscripciones donde se obtuvo representación o el 3 % de los votos válidos del conjunto de la Nación.',
    },
    distractors: [
      {
        text: 'Cinco escaños y el 15 % de los votos de las circunscripciones presentadas o el 5 % de los emitidos en la Nación.',
        trap: 'temporal_confusion',
        why: 'Es el régimen aplicable hasta el final de la legislatura actual; desde la próxima se aplican la media del 10 % y el 3 %.',
      },
      {
        text: 'Quince diputados y una media del 10 % en todas las circunscripciones, sin alternativa nacional alguna.',
        trap: 'partial_rule_accuracy',
        why: 'El umbral del 10 % es una media de las circunscripciones donde se obtuvo representación y existe la alternativa del 3 % nacional.',
      },
      {
        text: 'Cinco escaños y el 3 % de los votos de cada provincia en la que se haya presentado la formación política.',
        trap: 'numeric_precision',
        why: 'El 3 % se refiere al conjunto de la Nación; en las circunscripciones con representación se exige una media del 10 %.',
      },
    ],
    legal: 'Reglamento del Congreso, art. 23.1; BOE-A-2026-16353',
    cluster: 'cluster_t5g_organos_grupos',
    pair: 'pair_t5g_grupos_antes_vs_despues',
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
    id: `item-t5g-${index + 1}`,
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

export const seedItemsTema5General: Item[] = questionBank.map(makeItem);
