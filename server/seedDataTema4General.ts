/**
 * Seed data for Constitución Española de 1978 - Tema 4 (Bloque General):
 * "La Corona".
 *
 * FUENTE DE VERDAD:
 *  - Constitución Española de 1978, Título II (arts. 56 a 65), Ref. BOE-A-1978-31229.
 *  - Real Decreto 1368/1987, de 6 de noviembre, sobre régimen de títulos,
 *    tratamientos y honores de la Familia Real y de los Regentes
 *    (Ref. BOE-A-1987-25284).
 *  - Real Decreto 434/1988, de 6 de mayo, sobre reestructuración de la Casa de
 *    S. M. el Rey (Ref. BOE-A-1988-11386), incluida la modificación del art. 13.1
 *    por el RD 139/2026, de 25 de febrero (Ref. BOE-A-2026-4514).
 *  - Clase del 23 de noviembre de 2026 (grupo 473) y resumen SOLO-del-pdf de la
 *    carpeta "Tema 4 General".
 *
 * AVISOS DE RIGOR (§7 del resumen de clase), incorporados al banco:
 *  - El art. 56.3 CE remite expresamente, como excepción al refrendo, solo al
 *    art. 65.2 CE (nombramiento y relevo de los miembros civiles y militares de
 *    la Casa). La distribución libre de la partida de los PGE está en el
 *    art. 65.1 CE, aunque el material la presente junto a la anterior.
 *  - El art. 64.1 CE atribuye al Presidente del Congreso el refrendo de la
 *    propuesta y nombramiento del Presidente del Gobierno y de la disolución
 *    prevista en el art. 99 CE, no de la disolución ordinaria del art. 115 CE.
 *  - El art. 57.5 CE incluye expresamente las abdicaciones y renuncias en la
 *    reserva de ley orgánica.
 *  - El aforamiento de la Reina consorte, del heredero y su consorte y del Rey
 *    o Reina abdicado y su consorte no figura en el art. 58 CE, que solo prohíbe
 *    al consorte asumir funciones constitucionales salvo la Regencia, sino en el
 *    art. 55 bis LOPJ (LO 6/1985), añadido por la LO 4/2014. El material de clase
 *    lo asocia al art. 58; el banco se ancla al texto consolidado del BOE.
 *  - El art. 13.1 del RD 434/1988, tras el RD 139/2026, atribuye al Ministerio
 *    de Defensa las capacidades TIC de la Jefatura del Estado. El profesor no
 *    lo citó en clase; se incorpora un único ítem con anclaje BOE.
 *  - Las unidades de la Casa Real se codifican según el material (tres), no
 *    según la enumeración oral del profesor (cuatro elementos).
 *
 * No se codifican como clave: la interpretación del profesor sobre "español de
 * nacimiento" como nacionalidad actualmente mantenida, la definición de consorte
 * ligada a la estirpe, las valoraciones personales ni la numeración en caliente
 * del orden sucesorio práctico.
 *
 * Autoría: 47 ítems MCQ estándar (46 del plan aprobado + 1 ítem de refrendo del
 * Presidente del Congreso que ejercita el cuarto par de confusión). El banco se
 * añade al final de `seedItems` para que `rebalanceCanonicalMcqOptions` asigne la
 * posición canónica sin alterar los bancos anteriores.
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

const TOPIC = 'topic_constitucion_tema_4';
const now = '2026-11-25T10:00:00Z';

export const seedTopicTema4General: Topic = {
  id: TOPIC,
  name: 'Constitución Española - Tema 4: Bloque General - La Corona',
  description:
    'BLOQUE GENERAL (CE). La Corona: Jefatura del Estado, inviolabilidad y refrendo; sucesión y ley orgánica; consorte y aforamiento; regencia y tutela; juramento y funciones constitucionales; títulos, tratamientos y honores (RD 1368/1987); y estructura, personal, retribuciones, control y regalos de la Casa de S. M. el Rey (RD 434/1988).',
  source_file: 'resumen clase 23 nov - T4 general (Corona).md',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema4General: SourceChunk[] = [
  {
    id: 'chunk_tema4g_1',
    topic_id: TOPIC,
    page_number: 1,
    article_reference: 'Arts. 56 y 64 CE',
    raw_text:
      'El Rey es el Jefe del Estado, símbolo de su unidad y permanencia, arbitra y modera el funcionamiento regular de las instituciones y asume la más alta representación del Estado español en las relaciones internacionales. Es inviolable y no está sujeto a responsabilidad. Sus actos están siempre refrendados, salvo lo dispuesto en el art. 65.2 CE, y carecen de validez sin refrendo; de ellos responden quienes los refrendan. Regla general: Presidente del Gobierno y, en su caso, Ministros competentes. Presidente del Congreso: propuesta y nombramiento del Presidente del Gobierno y disolución del art. 99 CE.',
    summary: 'Jefatura del Estado, inviolabilidad, irresponsabilidad, regla general de refrendo y refrendo del Presidente del Congreso.',
    order_index: 1,
  },
  {
    id: 'chunk_tema4g_2',
    topic_id: TOPIC,
    page_number: 2,
    article_reference: 'Art. 57 CE',
    raw_text:
      'La Corona es hereditaria en los sucesores de S. M. Don Juan Carlos I de Borbón. Orden regular de primogenitura y representación: línea anterior a las posteriores; grado más próximo al más remoto; varón a la mujer; persona de más edad a la de menos. El heredero tiene la dignidad de Príncipe o Princesa de Asturias desde su nacimiento o desde el hecho que origine el llamamiento. Extinguidas las líneas, las Cortes Generales proveen a la sucesión. El matrimonio contra la expresa prohibición del Rey y de las Cortes excluye por sí y por sus descendientes. Las abdicaciones, renuncias y dudas de hecho o de derecho se resuelven por ley orgánica.',
    summary: 'Orden sucesorio, dignidad del heredero, extinción de líneas, matrimonio prohibido y reserva de ley orgánica del art. 57.5 CE.',
    order_index: 2,
  },
  {
    id: 'chunk_tema4g_3',
    topic_id: TOPIC,
    page_number: 3,
    article_reference: 'Art. 58 CE y art. 55 bis LOPJ',
    raw_text:
      'La Reina consorte o el consorte de la Reina no podrán asumir funciones constitucionales, salvo lo dispuesto para la Regencia. Las Salas de lo Civil y de lo Penal del Tribunal Supremo conocen, respectivamente, de las acciones civiles y penales dirigidas contra la Reina consorte o el consorte de la Reina, la Princesa o Príncipe de Asturias y su consorte, y el Rey o Reina que hubiere abdicado y su consorte.',
    summary: 'Prohibición de funciones constitucionales del consorte, salvo la Regencia, y aforamiento ante las Salas Civil y Penal del Tribunal Supremo.',
    order_index: 3,
  },
  {
    id: 'chunk_tema4g_4',
    topic_id: TOPIC,
    page_number: 4,
    article_reference: 'Arts. 59 y 60 CE',
    raw_text:
      'Regencia por minoría de edad: padre o madre del Rey y, en su defecto, el pariente mayor de edad más próximo a suceder. Regencia por inhabilitación reconocida por las Cortes Generales: el Príncipe heredero si es mayor de edad; si no, la regla anterior. Si no hubiere persona a quien corresponda, las Cortes Generales nombran la Regencia, compuesta de una, tres o cinco personas. Requisitos: español y mayor de edad; se ejerce por mandato constitucional y en nombre del Rey. Tutor del Rey menor: persona nombrada en testamento por el Rey difunto, mayor de edad y español de nacimiento; en su defecto, el padre o la madre mientras permanezcan viudos; en su defecto, las Cortes Generales. La tutela es incompatible con todo cargo o representación política. Regente y tutor solo se acumulan en el padre, la madre o los ascendientes directos.',
    summary: 'Supuestos, orden, composición y requisitos de la Regencia; prelación, unidad e incompatibilidad de la tutela; acumulación excepcional.',
    order_index: 4,
  },
  {
    id: 'chunk_tema4g_5',
    topic_id: TOPIC,
    page_number: 5,
    article_reference: 'Arts. 61, 62 y 63 CE',
    raw_text:
      'El Rey, al ser proclamado ante las Cortes Generales, jura desempeñar fielmente sus funciones, guardar y hacer guardar la Constitución y las leyes y respetar los derechos de los ciudadanos y de las Comunidades Autónomas. El Príncipe heredero, al alcanzar la mayoría de edad, y el Regente o Regentes, al hacerse cargo de sus funciones, prestan el mismo juramento y el de fidelidad al Rey. Funciones del art. 62 CE: sancionar y promulgar las leyes; convocar y disolver las Cortes y convocar elecciones; convocar referéndum; proponer, nombrar y cesar al Presidente del Gobierno; nombrar y separar a los Ministros a propuesta del Presidente; expedir decretos, conferir empleos y conceder honores; ser informado y presidir el Consejo de Ministros a petición del Presidente; mando supremo de las Fuerzas Armadas; derecho de gracia sin indultos generales; Alto Patronazgo de las Reales Academias; acreditar embajadores; manifestar el consentimiento del Estado en tratados; declarar la guerra y hacer la paz con previa autorización de las Cortes Generales; nombrar altos cargos del Poder Judicial y del Tribunal Constitucional; distribuir libremente la partida de su Familia y Casa y nombrar y relevar a los miembros civiles y militares de su Casa.',
    summary: 'Juramento del Rey, juramento adicional de heredero y Regentes y catálogo de funciones constitucionales.',
    order_index: 5,
  },
  {
    id: 'chunk_tema4g_6',
    topic_id: TOPIC,
    page_number: 6,
    article_reference: 'RD 1368/1987, arts. 1 a 5 y disposición transitoria cuarta',
    raw_text:
      'Titular de la Corona: Rey o Reina de España, tratamiento de Majestad. Consorte del Rey: denominación de Reina y Majestad mientras lo sea o permanezca viuda. Consorte de la Reina: dignidad de Príncipe y Alteza Real mientras lo sea o permanezca viudo. Heredero y su consorte: Príncipe o Princesa de Asturias, Alteza Real, desde el nacimiento o el hecho que origine el llamamiento. Hijos del Rey no herederos e hijos del heredero: Infantes de España, Alteza Real; sus consortes reciben lo que el Rey conceda por gracia. Agraciados por circunstancias excepcionales: dignidad de Infante y tratamiento de Alteza. Hijos de los Infantes: Grandes de España y tratamiento de Excelencia. Regentes: Alteza y honores del Príncipe de Asturias, salvo otros de mayor rango. Don Juan Carlos: título honorífico vitalicio de Rey, Majestad y honores análogos a los del Heredero. Doña Sofía: título honorífico vitalicio de Reina, Majestad y honores análogos a los de la Princesa o Príncipe de Asturias consortes. Títulos de nobleza de la Casa Real: uso autorizado por el Titular, graciable, personal y vitalicio.',
    summary: 'Denominaciones, dignidades y tratamientos de la Familia Real y de los Regentes conforme al RD 1368/1987.',
    order_index: 6,
  },
  {
    id: 'chunk_tema4g_7',
    topic_id: TOPIC,
    page_number: 7,
    article_reference: 'RD 434/1988, arts. 1 a 12',
    raw_text:
      'La Casa de S. M. el Rey es el organismo bajo dependencia directa del Rey que le apoya en el ejercicio de sus funciones como Jefe del Estado. Unidades: Jefatura; Secretaría General; Cuarto Militar y Guardia Real. Clases de personal: alta dirección, dirección, funcionarios de carrera del Estado, CCAA o EELL, funcionarios eventuales y personal laboral. Alta dirección (solo): Jefe de la Casa (Ministros), Secretario General (Secretarios de Estado) y Jefe del Cuarto Militar (Subsecretarios). Dirección: Consejero Diplomático, Jefes titulares de las Unidades e Interventor. Retribuciones con cargo a la dotación de los PGE: alta dirección, dirección y personal laboral. Por el Ministerio de la Presidencia: funcionarios de carrera y funcionarios eventuales.',
    summary: 'Naturaleza, unidades, clases de personal, alta dirección, asimilaciones y régimen retributivo de la Casa Real.',
    order_index: 7,
  },
  {
    id: 'chunk_tema4g_8',
    topic_id: TOPIC,
    page_number: 8,
    article_reference: 'RD 434/1988, arts. 13 a 17 y D. A. única',
    raw_text:
      'La Casa puede utilizar medios de Patrimonio Nacional, del Parque Móvil del Estado u otros organismos. El Ministerio de Defensa proporciona las capacidades TIC necesarias para la Jefatura del Estado (art. 13.1, tras el RD 139/2026). Asistencia jurídica: Servicio Jurídico del Estado (Abogacía General del Estado-Dirección del Servicio Jurídico). Auditoría externa de las cuentas anuales: Tribunal de Cuentas. Contratación: publicidad, concurrencia, transparencia, igualdad y no discriminación. Información periódica en la web (art. 17, once apartados). Regalos: la Casa registra, custodia y valora; los de carácter institucional se incorporan en todo caso al Patrimonio Nacional; los demás pueden proponerse al Consejo de Administración de Patrimonio Nacional o donarse a una entidad sin ánimo de lucro de fines de interés general.',
    summary: 'Apoyo TIC del Ministerio de Defensa, asistencia jurídica, auditoría, contratación, publicidad y régimen de regalos.',
    order_index: 8,
  },
];

export const seedClustersTema4General: Cluster[] = [
  {
    id: 'cluster_t4g_jefatura_inviolabilidad',
    topic_id: TOPIC,
    name: 'Jefatura del Estado, inviolabilidad y actos libres',
    type: 'conceptual',
    priority: 'critical',
    description:
      'El Rey como Jefe del Estado (art. 56.1 CE), inviolabilidad e irresponsabilidad, título de Rey de España y las dos actuaciones libres del art. 65 CE. Distinción fina entre la excepción literal del art. 56.3 (solo 65.2) y la partida presupuestaria del art. 65.1.',
  },
  {
    id: 'cluster_t4g_sucesion',
    topic_id: TOPIC,
    name: 'Sucesión a la Corona',
    type: 'procedural',
    priority: 'critical',
    description:
      'Orden regular de primogenitura y representación (línea, grado, sexo y edad), dignidad de Príncipe o Princesa de Asturias, extinción de líneas y provisión por las Cortes Generales, matrimonio contra prohibición expresa y reserva de ley orgánica del art. 57.5 CE.',
  },
  {
    id: 'cluster_t4g_consorte_aforamiento',
    topic_id: TOPIC,
    name: 'Consorte y aforamiento',
    type: 'institutional',
    priority: 'critical',
    description:
      'Prohibición de asumir funciones constitucionales por la Reina consorte o el consorte de la Reina, salvo la Regencia (art. 58 CE), y aforamiento ante las Salas de lo Civil y de lo Penal del Tribunal Supremo (art. 55 bis LOPJ) de los consortes, el heredero y su consorte y el Rey o Reina abdicado y su consorte.',
  },
  {
    id: 'cluster_t4g_regencia_tutela',
    topic_id: TOPIC,
    name: 'Regencia y tutela del Rey menor',
    type: 'procedural',
    priority: 'critical',
    description:
      'Regencia por minoría o inhabilitación, orden de llamamiento, composición de una, tres o cinco personas, requisitos de español y mayor de edad. Tutela testamentaria, legítima y dativa; español de nacimiento; una sola persona; incompatibilidad con cargo político; acumulación solo en padre, madre o ascendientes directos.',
  },
  {
    id: 'cluster_t4g_juramento_funciones',
    topic_id: TOPIC,
    name: 'Juramento y funciones constitucionales',
    type: 'classification',
    priority: 'critical',
    description:
      'Juramento del Rey ante las Cortes Generales, juramento adicional de fidelidad al Rey del heredero y de los Regentes y funciones del art. 62 CE: sanción y promulgación, disolución, referéndum, declaración de guerra, derecho de gracia, presidencia del Consejo de Ministros y mando supremo de las Fuerzas Armadas.',
  },
  {
    id: 'cluster_t4g_tratamientos',
    topic_id: TOPIC,
    name: 'Títulos, tratamientos y honores (RD 1368/1987)',
    type: 'classification',
    priority: 'critical',
    description:
      'Majestad del titular y de la Reina consorte; Alteza Real del consorte de la Reina, del heredero y su consorte y de los Infantes por derecho; Alteza de los Infantes por merced y de los Regentes; Excelencia de los hijos de los Infantes; honores de Don Juan Carlos y Doña Sofía; títulos de nobleza de la Casa Real.',
  },
  {
    id: 'cluster_t4g_casa_real_estructura',
    topic_id: TOPIC,
    name: 'Casa de S. M. el Rey: estructura y personal',
    type: 'institutional',
    priority: 'high',
    description:
      'Unidades de la Casa (Jefatura, Secretaría General y Cuarto Militar y Guardia Real), cinco clases de personal, personal de alta dirección y sus asimilaciones, personal de dirección y régimen retributivo (PGE frente a Ministerio de la Presidencia).',
  },
  {
    id: 'cluster_t4g_casa_real_control',
    topic_id: TOPIC,
    name: 'Casa de S. M. el Rey: control, servicios y regalos',
    type: 'institutional',
    priority: 'high',
    description:
      'Apoyo TIC del Ministerio de Defensa (art. 13.1 RD 434/1988 tras el RD 139/2026), asistencia jurídica del Servicio Jurídico del Estado, auditoría externa del Tribunal de Cuentas, principios de contratación y destino de los regalos institucionales al Patrimonio Nacional.',
  },
];

export const seedConfusionPairsTema4General: ConfusionPair[] = [
  {
    id: 'pair_t4g_regente_vs_tutor',
    topic_id: TOPIC,
    concept_a: 'Regente',
    concept_b: 'Tutor del Rey menor',
    discriminating_cue:
      'El Regente ejerce la Jefatura del Estado por minoría o inhabilitación, requiere ser español y mayor de edad y, si lo nombran las Cortes, puede ser una, tres o cinco personas. El tutor solo actúa durante la minoría, requiere español de nacimiento y mayor de edad, es una sola persona y es incompatible con todo cargo o representación política.',
    common_trap:
      'Intercambiar los requisitos (español frente a español de nacimiento), la composición (1, 3 o 5 frente a una sola persona) o el ámbito (minoría e inhabilitación frente a solo minoría).',
    legal_basis_a: 'Arts. 59 y 60 CE',
    legal_basis_b: 'Art. 60 CE',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t4g_alteza_real_vs_alteza',
    topic_id: TOPIC,
    concept_a: 'Tratamiento de Alteza Real',
    concept_b: 'Tratamiento de Alteza',
    discriminating_cue:
      'Reciben Alteza Real el consorte de la Reina, el Príncipe o Princesa de Asturias y su consorte y los Infantes de España por derecho. Reciben Alteza, no Alteza Real, los Infantes agraciados por circunstancias excepcionales y quienes ejercen la Regencia.',
    common_trap:
      'Atribuir Alteza Real a los Regentes o a los Infantes por merced, o degradar a Alteza a los Infantes por derecho.',
    legal_basis_a: 'RD 1368/1987, arts. 1.3, 2 y 3.1',
    legal_basis_b: 'RD 1368/1987, arts. 3.2 y 5',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t4g_refrendo_pg_vs_congreso',
    topic_id: TOPIC,
    concept_a: 'Refrendo del Presidente del Gobierno',
    concept_b: 'Refrendo del Presidente del Congreso',
    discriminating_cue:
      'El Presidente del Gobierno refrenda la regla general de los actos del Rey y, en su caso, los Ministros competentes. El Presidente del Congreso refrenda la propuesta y nombramiento del Presidente del Gobierno y la disolución prevista en el art. 99 CE.',
    common_trap:
      'Atribuir al Presidente del Congreso toda disolución de las Cámaras, incluida la ordinaria del art. 115 CE, o hacerle refrendar los actos ordinarios del Rey.',
    legal_basis_a: 'Art. 64.1 CE',
    legal_basis_b: 'Art. 64.1 CE',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_t4g_actos_libres_vs_refrendados',
    topic_id: TOPIC,
    concept_a: 'Actos del Rey sujetos a refrendo',
    concept_b: 'Actos libres del Rey',
    discriminating_cue:
      'Están sujetos a refrendo los actos del art. 62 CE y, en general, todos salvo los del art. 65 CE. Son libres la distribución de la cantidad de los PGE para su Familia y Casa (65.1) y el nombramiento y relevo de los miembros civiles y militares de su Casa (65.2); el art. 56.3 solo exceptúa expresamente el 65.2.',
    common_trap:
      'Afirmar que todos los actos del Rey se refrendan o que la sanción de las leyes y la convocatoria de referéndum son actos libres.',
    legal_basis_a: 'Arts. 56.3 y 64 CE',
    legal_basis_b: 'Art. 65 CE',
    severity: 'high',
    status: 'validated',
  },
];

export const seedAtomsTema4General: Atom[] = [
  {
    id: 'atom-t4g-1',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'El Rey es el Jefe del Estado, símbolo de su unidad y permanencia, arbitra y modera el funcionamiento regular de las instituciones y asume la más alta representación del Estado español en las relaciones internacionales.',
    legal_basis: 'Art. 56.1 CE',
    cluster_id: 'cluster_t4g_jefatura_inviolabilidad',
    tags: ['jefatura_estado', 'simbolo_unidad', 'arbitra_modera', 'representacion_internacional'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t4g-2',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'El Rey es inviolable y no está sujeto a responsabilidad; sus actos están siempre refrendados, salvo lo dispuesto en el art. 65.2 CE, y de ellos responden las personas que los refrendan.',
    legal_basis: 'Art. 56.3 CE',
    cluster_id: 'cluster_t4g_jefatura_inviolabilidad',
    confusion_pair_id: 'pair_t4g_actos_libres_vs_refrendados',
    tags: ['inviolabilidad', 'irresponsabilidad', 'refrendo', 'responsabilidad'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-3',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'El art. 56.3 CE exceptúa del refrendo únicamente lo dispuesto en el art. 65.2 CE (nombramiento y relevo de los miembros civiles y militares de la Casa); la distribución libre de la cantidad global de los PGE para la Familia y la Casa figura en el art. 65.1 CE.',
    legal_basis: 'Arts. 56.3 y 65 CE',
    cluster_id: 'cluster_t4g_jefatura_inviolabilidad',
    confusion_pair_id: 'pair_t4g_actos_libres_vs_refrendados',
    tags: ['excepcion_refrendo', 'articulo_65_2', 'articulo_65_1', 'rigor_boe'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t4g-4',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'La sucesión sigue el orden regular de primogenitura y representación: línea anterior a las posteriores, grado más próximo al más remoto, varón a la mujer y persona de más edad a la de menos.',
    legal_basis: 'Art. 57.1 CE',
    cluster_id: 'cluster_t4g_sucesion',
    tags: ['orden_sucesorio', 'linea', 'grado', 'sexo', 'edad'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t4g-5',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'El heredero tiene la dignidad de Príncipe o Princesa de Asturias desde su nacimiento o desde que se produzca el hecho que origine el llamamiento, y su consorte participa de igual dignidad y tratamiento.',
    legal_basis: 'Art. 57.2 CE y RD 1368/1987, art. 2',
    cluster_id: 'cluster_t4g_sucesion',
    tags: ['principe_asturias', 'nacimiento', 'llamamiento', 'consorte'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-6',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Quien teniendo derecho a la sucesión contrae matrimonio contra la expresa prohibición del Rey y de las Cortes Generales queda excluido de la sucesión por sí y por sus descendientes.',
    legal_basis: 'Art. 57.4 CE',
    cluster_id: 'cluster_t4g_sucesion',
    tags: ['matrimonio', 'prohibicion_expresa', 'exclusion', 'descendientes'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-7',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Las abdicaciones, las renuncias y cualquier duda de hecho o de derecho que ocurra en el orden de sucesión a la Corona se resuelven por ley orgánica.',
    legal_basis: 'Art. 57.5 CE',
    cluster_id: 'cluster_t4g_sucesion',
    tags: ['ley_organica', 'abdicaciones', 'renuncias', 'dudas_sucesorias'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-8',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'La Reina consorte o el consorte de la Reina no pueden asumir funciones constitucionales, salvo lo dispuesto para la Regencia.',
    legal_basis: 'Art. 58 CE',
    cluster_id: 'cluster_t4g_consorte_aforamiento',
    tags: ['consorte', 'funciones_constitucionales', 'regencia', 'excepcion'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-9',
    topic_id: TOPIC,
    atom_type: 'competent_body',
    text: 'Las Salas de lo Civil y de lo Penal del Tribunal Supremo conocen, respectivamente, de las acciones civiles y penales contra la Reina consorte o el consorte de la Reina, la Princesa o Príncipe de Asturias y su consorte y el Rey o Reina que hubiere abdicado y su consorte.',
    legal_basis: 'Art. 55 bis LOPJ (LO 6/1985, añadido por LO 4/2014)',
    cluster_id: 'cluster_t4g_consorte_aforamiento',
    tags: ['aforamiento', 'tribunal_supremo', 'salas_civil_penal', 'familia_real'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-10',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'La Regencia procede por minoría de edad del Rey o por su inhabilitación reconocida por las Cortes Generales; se ejerce por mandato constitucional y siempre en nombre del Rey.',
    legal_basis: 'Art. 59 CE',
    cluster_id: 'cluster_t4g_regencia_tutela',
    confusion_pair_id: 'pair_t4g_regente_vs_tutor',
    tags: ['regencia', 'minoría_edad', 'inhabilitacion', 'cortes_generales'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-11',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'Por minoría de edad del Rey ejerce la Regencia el padre o la madre y, en su defecto, el pariente mayor de edad más próximo a suceder; por inhabilitación, entra inmediatamente el Príncipe heredero si es mayor de edad.',
    legal_basis: 'Art. 59 CE',
    cluster_id: 'cluster_t4g_regencia_tutela',
    confusion_pair_id: 'pair_t4g_regente_vs_tutor',
    tags: ['orden_regencia', 'padre_madre', 'principe_heredero', 'inhabilitacion'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-12',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'Si no hubiere persona a quien corresponda la Regencia, la nombran las Cortes Generales y se compone de una, tres o cinco personas; para ejercerla se exige ser español y mayor de edad.',
    legal_basis: 'Art. 59 CE',
    cluster_id: 'cluster_t4g_regencia_tutela',
    confusion_pair_id: 'pair_t4g_regente_vs_tutor',
    tags: ['regencia_subsidiaria', '1_3_5', 'espanol', 'mayor_edad'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t4g-13',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'La tutela del Rey menor corresponde, por este orden, a la persona nombrada en testamento por el Rey difunto (mayor de edad y español de nacimiento), al padre o la madre mientras permanezcan viudos y, en su defecto, a quien nombren las Cortes Generales.',
    legal_basis: 'Art. 60 CE',
    cluster_id: 'cluster_t4g_regencia_tutela',
    confusion_pair_id: 'pair_t4g_regente_vs_tutor',
    tags: ['tutela', 'testamento', 'padre_madre_viudos', 'cortes_generales'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-14',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'Los cargos de Regente y de tutor solo pueden acumularse en el padre, la madre o los ascendientes directos del Rey; el ejercicio de la tutela es incompatible con todo cargo o representación política.',
    legal_basis: 'Art. 60 CE',
    cluster_id: 'cluster_t4g_regencia_tutela',
    confusion_pair_id: 'pair_t4g_regente_vs_tutor',
    tags: ['acumulacion', 'ascendientes_directos', 'incompatibilidad', 'cargo_politico'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-15',
    topic_id: TOPIC,
    atom_type: 'duty',
    text: 'El Rey jura al ser proclamado ante las Cortes Generales desempeñar fielmente sus funciones, guardar y hacer guardar la Constitución y las leyes y respetar los derechos de los ciudadanos y de las Comunidades Autónomas.',
    legal_basis: 'Art. 61.1 CE',
    cluster_id: 'cluster_t4g_juramento_funciones',
    tags: ['juramento', 'rey', 'constitucion', 'derechos'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t4g-16',
    topic_id: TOPIC,
    atom_type: 'duty',
    text: 'El Príncipe heredero, al alcanzar la mayoría de edad, y el Regente o Regentes, al hacerse cargo de sus funciones, prestan el mismo juramento que el Rey y además el de fidelidad al Rey.',
    legal_basis: 'Art. 61.2 CE',
    cluster_id: 'cluster_t4g_juramento_funciones',
    tags: ['juramento', 'principe_heredero', 'regentes', 'fidelidad_rey'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-17',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'Corresponde al Rey sancionar y promulgar las leyes, convocar y disolver las Cortes Generales y convocar elecciones, convocar referéndum, proponer, nombrar y cesar al Presidente del Gobierno y nombrar y separar a los Ministros a propuesta de este.',
    legal_basis: 'Art. 62 CE',
    cluster_id: 'cluster_t4g_juramento_funciones',
    tags: ['funciones_rey', 'sancion', 'promulgacion', 'disolucion', 'presidente_gobierno'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-18',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'El Rey declara la guerra y hace la paz con previa autorización de las Cortes Generales y ejerce el derecho de gracia con arreglo a la ley, sin poder autorizar indultos generales.',
    legal_basis: 'Arts. 62 y 63 CE',
    cluster_id: 'cluster_t4g_juramento_funciones',
    tags: ['guerra', 'paz', 'autorizacion_cortes', 'derecho_gracia', 'indultos'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-19',
    topic_id: TOPIC,
    atom_type: 'classification',
    text: 'Reciben tratamiento de Majestad el titular de la Corona y la Reina consorte; de Alteza Real, el consorte de la Reina, el heredero y su consorte y los Infantes por derecho; de Alteza, los Infantes por merced y los Regentes; y de Excelencia, los hijos de los Infantes.',
    legal_basis: 'RD 1368/1987, arts. 1 a 5 y disposición transitoria cuarta',
    cluster_id: 'cluster_t4g_tratamientos',
    confusion_pair_id: 'pair_t4g_alteza_real_vs_alteza',
    tags: ['tratamientos', 'majestad', 'alteza_real', 'alteza', 'excelencia'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-20',
    topic_id: TOPIC,
    atom_type: 'classification',
    text: 'La Casa de S. M. el Rey se estructura en Jefatura, Secretaría General y Cuarto Militar y Guardia Real, y distingue cinco clases de personal: alta dirección, dirección, funcionarios de carrera, funcionarios eventuales y personal laboral.',
    legal_basis: 'RD 434/1988, arts. 2 y 8',
    cluster_id: 'cluster_t4g_casa_real_estructura',
    tags: ['casa_real', 'unidades', 'clases_personal'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-21',
    topic_id: TOPIC,
    atom_type: 'classification',
    text: 'El personal de alta dirección se limita al Jefe de la Casa (asimilado a Ministros), el Secretario General (a Secretarios de Estado) y el Jefe del Cuarto Militar (a Subsecretarios).',
    legal_basis: 'RD 434/1988, art. 9.1',
    cluster_id: 'cluster_t4g_casa_real_estructura',
    tags: ['alta_direccion', 'jefe_casa', 'secretario_general', 'cuarto_militar', 'asimilaciones'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-22',
    topic_id: TOPIC,
    atom_type: 'competent_body',
    text: 'Perciben retribuciones con cargo a la dotación de los PGE el personal de alta dirección, de dirección y laboral; las perciben por el Ministerio de la Presidencia los funcionarios de carrera y los funcionarios eventuales.',
    legal_basis: 'RD 434/1988, art. 12',
    cluster_id: 'cluster_t4g_casa_real_estructura',
    tags: ['retribuciones', 'pge', 'ministerio_presidencia', 'funcionarios'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t4g-23',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Los regalos de carácter institucional recibidos por la Familia Real se incorporan en todo caso al Patrimonio Nacional; la Casa registra, custodia y valora los regalos y puede proponer su incorporación o donación a una entidad sin ánimo de lucro de fines de interés general.',
    legal_basis: 'RD 434/1988, disposición adicional única',
    cluster_id: 'cluster_t4g_casa_real_control',
    tags: ['regalos', 'patrimonio_nacional', 'institucional', 'donacion'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t4g-24',
    topic_id: TOPIC,
    atom_type: 'competent_body',
    text: 'La auditoría externa de las cuentas anuales de la Casa corresponde al Tribunal de Cuentas y la asistencia jurídica al Servicio Jurídico del Estado; el Ministerio de Defensa proporciona las capacidades TIC de la Jefatura del Estado tras el RD 139/2026.',
    legal_basis: 'RD 434/1988, arts. 13.1, 13.4 y 13.5; RD 139/2026',
    cluster_id: 'cluster_t4g_casa_real_control',
    tags: ['auditoria', 'tribunal_cuentas', 'servicio_juridico', 'tic', 'defensa'],
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
    stem: 'Conforme al artículo 56.1 CE, ¿cómo define la Constitución la posición del Rey como Jefe del Estado?',
    prompt: 'Recuerda las tres funciones que el art. 56.1 CE atribuye al Rey como Jefe del Estado.',
    key: 'A',
    correct: {
      text: 'Es símbolo de la unidad y permanencia del Estado, arbitra y modera las instituciones y asume la más alta representación internacional.',
      rule: 'El art. 56.1 CE define al Rey como Jefe del Estado, símbolo de su unidad y permanencia, que arbitra y modera el funcionamiento regular de las instituciones y asume la más alta representación del Estado español en las relaciones internacionales.',
    },
    distractors: [
      {
        text: 'Es garante de la soberanía nacional, dirige la política general del Estado y preside el Consejo de Ministros con voz y voto.',
        trap: 'conceptual_merger',
        why: 'Confunde al Jefe del Estado con el Gobierno: la dirección política y la presidencia ordinaria del Consejo corresponden al Presidente del Gobierno.',
      },
      {
        text: 'Es custodio del orden constitucional, disuelve las Cámaras sin límite alguno y nombra libremente a los ministros del Gobierno.',
        trap: 'overbroad_statement',
        why: 'La disolución y el nombramiento de ministros están sometidos a la Constitución y, en el segundo caso, a propuesta del Presidente del Gobierno.',
      },
      {
        text: 'Es órgano supremo del Poder Judicial, ejerce la potestad legislativa y controla la constitucionalidad de las leyes.',
        trap: 'wrong_competent_body',
        why: 'El Poder Judicial, la potestad legislativa y el control de constitucionalidad corresponden a otros órganos constitucionales, no al Rey.',
      },
    ],
    legal: 'Art. 56.1 CE',
    cluster: 'cluster_t4g_jefatura_inviolabilidad',
    difficulty: 1,
  },
  {
    stem: '¿Qué consecuencia jurídica se deriva de la inviolabilidad y la irresponsabilidad del Rey?',
    prompt: 'Distingue la posición del Rey de la de las personas que autorizan sus actos.',
    key: 'A',
    correct: {
      text: 'Sus actos requieren el refrendo de otra persona y de ellos responden quienes los refrendan, no el propio Rey.',
      rule: 'El art. 56.3 CE declara inviolable e irresponsable al Rey, somete sus actos a refrendo y atribuye la responsabilidad a quienes los refrendan.',
    },
    distractors: [
      {
        text: 'Sus actos son nulos de pleno derecho cuando carecen de la autorización previa del Congreso de los Diputados.',
        trap: 'wrong_competent_body',
        why: 'El refrendo no corresponde en general al Congreso, sino al Presidente del Gobierno, a los Ministros competentes o al Presidente del Congreso en los supuestos del art. 64.1 CE.',
      },
      {
        text: 'Sus actos solo pueden ser enjuiciados por la Sala de lo Penal del Tribunal Supremo, previa autorización del Congreso.',
        trap: 'factual_misapplication',
        why: 'La inviolabilidad impide someter al Rey a responsabilidad; no existe un procedimiento de enjuiciamiento ante la Sala de lo Penal del Tribunal Supremo.',
      },
      {
        text: 'Sus actos obligan personalmente al Rey, que responde civil y penalmente de las decisiones que adopta en el ejercicio del cargo.',
        trap: 'overbroad_statement',
        why: 'La irresponsabilidad del Rey es precisamente la regla contraria: responden las personas que refrendan sus actos.',
      },
    ],
    legal: 'Art. 56.3 CE',
    cluster: 'cluster_t4g_jefatura_inviolabilidad',
    pair: 'pair_t4g_actos_libres_vs_refrendados',
    difficulty: 2,
  },
  {
    stem: '¿Cuál de las siguientes actuaciones del Rey se ejerce libremente, sin refrendo?',
    prompt: 'Recuerda las dos actuaciones que el art. 65 CE reserva al Rey sin refrendo.',
    key: 'A',
    correct: {
      text: 'Distribuir la partida de los PGE destinada al sostenimiento de su Familia y de su Casa.',
      rule: 'El art. 65.1 CE permite al Rey distribuir libremente la cantidad que recibe de los Presupuestos Generales del Estado para el sostenimiento de su Familia y Casa; el art. 65.2 le permite nombrar y relevar libremente a los miembros civiles y militares de su Casa.',
    },
    distractors: [
      {
        text: 'Sancionar y promulgar las leyes aprobadas previamente por las Cortes Generales.',
        trap: 'partial_rule_accuracy',
        why: 'Es una función del art. 62 CE sujeta a refrendo, no una actuación libre del art. 65 CE.',
      },
      {
        text: 'Convocar a referéndum en los supuestos expresamente previstos en la Constitución.',
        trap: 'true_but_irrelevant',
        why: 'Es una función constitucional del Rey, pero sometida a refrendo; no figura entre las excepciones del art. 65 CE.',
      },
      {
        text: 'Declarar la guerra y hacer la paz con la previa autorización de las Cortes Generales.',
        trap: 'conceptual_merger',
        why: 'La intervención de las Cortes no convierte el acto en libre: sigue sujeto a refrendo.',
      },
    ],
    legal: 'Arts. 62 y 65 CE',
    cluster: 'cluster_t4g_jefatura_inviolabilidad',
    pair: 'pair_t4g_actos_libres_vs_refrendados',
    difficulty: 2,
  },
  {
    stem: '¿A qué precepto constitucional remite expresamente el artículo 56.3 CE al establecer la excepción al refrendo?',
    prompt: 'Fíjate en la remisión literal del art. 56.3 CE, no en la enumeración del material.',
    key: 'A',
    correct: {
      text: 'Al artículo 65.2, relativo al nombramiento y relevo de los miembros civiles y militares de la Casa.',
      rule: 'El art. 56.3 CE exceptúa del refrendo «lo dispuesto en el artículo 65.2», es decir, el nombramiento y relevo libre de los miembros civiles y militares de la Casa del Rey.',
    },
    distractors: [
      {
        text: 'Al artículo 65.1, relativo a la distribución de la cantidad asignada para su Familia y su Casa.',
        trap: 'partial_rule_accuracy',
        why: 'El art. 65.1 regula la distribución libre de la partida presupuestaria, pero el art. 56.3 no lo menciona en su remisión literal.',
      },
      {
        text: 'Al artículo 64.1, relativo al refrendo del Presidente del Gobierno y de los Ministros competentes.',
        trap: 'conceptual_merger',
        why: 'El art. 64.1 establece la regla general del refrendo; no es la excepción a la que remite el art. 56.3.',
      },
      {
        text: 'Al artículo 62, relativo a las funciones constitucionales que corresponden al Rey.',
        trap: 'factual_misapplication',
        why: 'El art. 62 enumera las funciones del Rey, pero no contiene la excepción al refrendo.',
      },
    ],
    legal: 'Arts. 56.3 y 65.2 CE',
    cluster: 'cluster_t4g_jefatura_inviolabilidad',
    pair: 'pair_t4g_actos_libres_vs_refrendados',
    difficulty: 3,
  },
  {
    stem: 'Según el artículo 57.1 CE, ¿cuál es el orden exacto de preferencia en la sucesión a la Corona?',
    prompt: 'Memoriza la secuencia línea, grado, sexo y edad, sin invertir sus pasos.',
    key: 'A',
    correct: {
      text: 'Línea anterior, grado más próximo, varón a la mujer y persona de más edad a la de menos.',
      rule: 'El art. 57.1 CE ordena la preferencia así: línea anterior a las posteriores; en la misma línea, grado más próximo al más remoto; en el mismo grado, varón a la mujer; y en el mismo sexo, persona de más edad a la de menos.',
    },
    distractors: [
      {
        text: 'El grado más próximo, la línea anterior, la persona de más edad y el varón a la mujer.',
        trap: 'conceptual_merger',
        why: 'Invierte los dos primeros criterios: la línea precede siempre al grado.',
      },
      {
        text: 'La línea anterior, el grado más próximo, la persona de más edad y el varón a la mujer.',
        trap: 'partial_rule_accuracy',
        why: 'Alteran el tercer y cuarto criterio: el sexo precede a la edad.',
      },
      {
        text: 'El varón a la mujer, la línea anterior, el grado más próximo y la persona de más edad.',
        trap: 'factual_misapplication',
        why: 'Coloca el sexo en primer lugar, cuando es el tercer criterio del precepto.',
      },
    ],
    legal: 'Art. 57.1 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 2,
  },
  {
    stem: 'En la línea sucesoria actual, ¿por qué la Princesa Leonor precede a su hermana Sofía?',
    prompt: 'Aplica los cuatro criterios del art. 57.1 CE a dos hermanas.',
    key: 'A',
    correct: {
      text: 'Porque, a igualdad de línea, grado y sexo, se prefiere a la persona de más edad.',
      rule: 'Aplicando el art. 57.1 CE, ambas pertenecen a la misma línea y grado y son mujeres; decide el cuarto criterio, la edad, y Leonor nació antes.',
    },
    distractors: [
      {
        text: 'Porque la Corona se transmite por la línea femenina cuando no hay varón en la misma línea.',
        trap: 'factual_misapplication',
        why: 'La Constitución no establece una preferencia femenina; el tercer criterio prefiere al varón, pero aquí ambas son mujeres.',
      },
      {
        text: 'Porque ostenta la dignidad de Princesa de Asturias desde que alcanzó la mayoría de edad.',
        trap: 'temporal_confusion',
        why: 'La dignidad se ostenta desde el nacimiento o desde el hecho que origine el llamamiento, no desde la mayoría de edad.',
      },
      {
        text: 'Porque así lo decidió el Rey mediante real decreto ratificado por las Cortes Generales.',
        trap: 'wrong_competent_body',
        why: 'El orden sucesorio deriva de la Constitución y no de una decisión discrecional del Rey ratificada por las Cámaras.',
      },
    ],
    legal: 'Art. 57.1 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 3,
  },
  {
    stem: '¿Desde qué momento ostenta el heredero la dignidad de Príncipe o Princesa de Asturias?',
    prompt: 'Distingue el nacimiento o llamamiento de los actos formales posteriores.',
    key: 'A',
    correct: {
      text: 'Desde su nacimiento o desde que se produzca el hecho que origine el llamamiento.',
      rule: 'El art. 57.2 CE atribuye la dignidad de Príncipe o Princesa de Asturias desde el nacimiento o desde el hecho que origine el llamamiento, junto con los demás títulos vinculados tradicionalmente al sucesor.',
    },
    distractors: [
      {
        text: 'Desde que el Rey lo designa mediante real decreto publicado en el Boletín Oficial del Estado.',
        trap: 'wrong_competent_body',
        why: 'La dignidad no depende de una designación regia: se adquiere por nacimiento o por el hecho que origina el llamamiento.',
      },
      {
        text: 'Desde que alcanza la mayoría de edad y presta juramento de fidelidad al Rey.',
        trap: 'temporal_confusion',
        why: 'La mayoría de edad y el juramento son requisitos para el ejercicio de funciones, no para ostentar la dignidad.',
      },
      {
        text: 'Desde el fallecimiento del titular de la Corona, con efectos meramente declarativos.',
        trap: 'factual_misapplication',
        why: 'El llamamiento puede producirse antes del fallecimiento y la dignidad se ostenta desde el nacimiento o el hecho que lo origina.',
      },
    ],
    legal: 'Art. 57.2 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 2,
  },
  {
    stem: 'Extinguidas todas las líneas llamadas en Derecho, ¿a quién corresponde proveer a la sucesión en la Corona?',
    prompt: 'Identifica el órgano que decide cuando se agotan las líneas sucesorias.',
    key: 'A',
    correct: {
      text: 'A las Cortes Generales, en la forma que más convenga a los intereses de España.',
      rule: 'El art. 57.3 CE dispone que, extinguidas todas las líneas llamadas en Derecho, las Cortes Generales proveerán a la sucesión en la Corona en la forma que más convenga a los intereses de España.',
    },
    distractors: [
      {
        text: 'Al Consejo de Ministros, mediante real decreto-ley aprobado en el plazo de un mes.',
        trap: 'wrong_competent_body',
        why: 'El Gobierno no puede proveer la sucesión; la Constitución atribuye esa función a las Cortes Generales.',
      },
      {
        text: 'Al Tribunal Constitucional, mediante sentencia vinculante para todos los poderes públicos.',
        trap: 'conceptual_merger',
        why: 'El Tribunal Constitucional controla la constitucionalidad, pero no es el órgano llamado a proveer la sucesión.',
      },
      {
        text: 'A la Casa de S.M. el Rey, conforme a la tradición histórica de la dinastía.',
        trap: 'familiar_wording_trap',
        why: 'La referencia a la tradición dinástica suena al art. 57.1, pero la extinción de líneas se resuelve por las Cortes Generales.',
      },
    ],
    legal: 'Art. 57.3 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 2,
  },
  {
    stem: '¿Qué efecto produce el matrimonio contraído contra la expresa prohibición del Rey y de las Cortes Generales?',
    prompt: 'Recuerda el alcance subjetivo de la exclusión sucesoria.',
    key: 'A',
    correct: {
      text: 'La exclusión de la sucesión por sí y por sus descendientes.',
      rule: 'El art. 57.4 CE excluye de la sucesión a quien contrae matrimonio contra la expresa prohibición del Rey y de las Cortes Generales, y extiende la exclusión a sus descendientes.',
    },
    distractors: [
      {
        text: 'La suspensión del derecho sucesorio hasta el fallecimiento del Rey.',
        trap: 'temporal_confusion',
        why: 'La norma no suspende temporalmente el derecho: excluye de la sucesión.',
      },
      {
        text: 'La pérdida del título de Príncipe de Asturias, pero no de la línea sucesoria.',
        trap: 'partial_rule_accuracy',
        why: 'La consecuencia afecta a la sucesión misma y alcanza también a los descendientes.',
      },
      {
        text: 'La nulidad del matrimonio y la pérdida de la nacionalidad española.',
        trap: 'overbroad_statement',
        why: 'La Constitución no anula el matrimonio ni priva de la nacionalidad; solo excluye de la sucesión.',
      },
    ],
    legal: 'Art. 57.4 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 2,
  },
  {
    stem: '¿Qué materias relacionadas con la Corona exigen ley orgánica conforme al artículo 57.5 CE?',
    prompt: 'Incluye todo lo que el precepto somete a ley orgánica, no solo las dudas sucesorias.',
    key: 'A',
    correct: {
      text: 'Las abdicaciones, las renuncias y cualquier duda de hecho o de derecho en el orden sucesorio.',
      rule: 'El art. 57.5 CE somete a ley orgánica las abdicaciones, las renuncias y cualquier duda de hecho o de derecho que ocurra en el orden de sucesión a la Corona.',
    },
    distractors: [
      {
        text: 'Solo las abdicaciones y renuncias, quedando las dudas sucesorias al reglamento del Rey.',
        trap: 'partial_rule_accuracy',
        why: 'El precepto incluye también las dudas de hecho o de derecho y no las remite a un reglamento.',
      },
      {
        text: 'Las cuestiones sucesorias, pero no las abdicaciones ni las renuncias del titular.',
        trap: 'hyper_narrow_statement',
        why: 'Las abdicaciones y renuncias están expresamente mencionadas en el art. 57.5 CE.',
      },
      {
        text: 'Cualquier modificación del Título II, incluida la regencia y la tutela del Rey menor.',
        trap: 'overbroad_statement',
        why: 'El art. 57.5 CE se refiere a la sucesión, no a todo el Título II ni a la regencia y la tutela.',
      },
    ],
    legal: 'Art. 57.5 CE',
    cluster: 'cluster_t4g_sucesion',
    difficulty: 3,
  },
  {
    stem: '¿Puede la Reina consorte asumir funciones constitucionales?',
    prompt: 'Recuerda la salvedad expresa del art. 58 CE.',
    key: 'A',
    correct: {
      text: 'No, salvo lo dispuesto para la Regencia.',
      rule: 'El art. 58 CE prohíbe a la Reina consorte o al consorte de la Reina asumir funciones constitucionales, salvo lo dispuesto para la Regencia.',
    },
    distractors: [
      {
        text: 'Sí, siempre que preste juramento ante las Cortes Generales.',
        trap: 'overbroad_statement',
        why: 'El juramento no habilita a la consorte para asumir funciones constitucionales fuera de la Regencia.',
      },
      {
        text: 'Sí, cuando el Rey se encuentre fuera del territorio nacional.',
        trap: 'factual_misapplication',
        why: 'La ausencia del Rey no altera la prohibición del art. 58 CE.',
      },
      {
        text: 'No, en ningún caso, ni siquiera durante la Regencia.',
        trap: 'absolute_relative_confusion',
        why: 'La prohibición tiene una excepción expresa: lo dispuesto para la Regencia.',
      },
    ],
    legal: 'Art. 58 CE',
    cluster: 'cluster_t4g_consorte_aforamiento',
    difficulty: 1,
  },
  {
    stem: '¿Qué órgano conoce de las acciones civiles y penales dirigidas contra la Reina consorte?',
    prompt: 'Distingue las dos Salas del Tribunal Supremo y descarta el Tribunal Constitucional.',
    key: 'A',
    correct: {
      text: 'Las Salas de lo Civil y de lo Penal del Tribunal Supremo, respectivamente.',
      rule: 'El art. 55 bis LOPJ atribuye a la Sala de lo Civil las acciones civiles y a la Sala de lo Penal las acciones penales dirigidas contra la Reina consorte o el consorte de la Reina.',
    },
    distractors: [
      {
        text: 'La Sala Segunda del Tribunal Supremo y el Tribunal Constitucional, respectivamente.',
        trap: 'partial_rule_accuracy',
        why: 'Mezcla una Sala del Tribunal Supremo con el Tribunal Constitucional, que no conoce de este aforamiento.',
      },
      {
        text: 'El Tribunal Constitucional, en única instancia y sin posibilidad de recurso.',
        trap: 'wrong_competent_body',
        why: 'El aforamiento de la Familia Real corresponde al Tribunal Supremo, no al Tribunal Constitucional.',
      },
      {
        text: 'La Audiencia Nacional, a través de su Sala de lo Penal y de lo Civil.',
        trap: 'conceptual_merger',
        why: 'La Audiencia Nacional no es el órgano previsto por el art. 55 bis LOPJ para este aforamiento.',
      },
    ],
    legal: 'Art. 55 bis LOPJ (LO 6/1985, añadido por LO 4/2014)',
    cluster: 'cluster_t4g_consorte_aforamiento',
    difficulty: 2,
  },
  {
    stem: 'Además de la Reina consorte y del Príncipe o Princesa de Asturias con su consorte, ¿quién está aforado ante el Tribunal Supremo conforme a la Ley Orgánica del Poder Judicial?',
    prompt: 'Completa el círculo de personas aforadas por el art. 55 bis LOPJ.',
    key: 'A',
    correct: {
      text: 'El Rey o Reina que hubiere abdicado y su consorte.',
      rule: 'El art. 55 bis LOPJ extiende el aforamiento ante las Salas de lo Civil y de lo Penal del Tribunal Supremo al Rey o Reina que hubiere abdicado y a su consorte.',
    },
    distractors: [
      {
        text: 'Los Infantes de España por derecho y sus respectivos consortes.',
        trap: 'conceptual_merger',
        why: 'Los Infantes no figuran en la enumeración del art. 55 bis LOPJ, que se limita a los consortes, al heredero y su consorte y al Rey o Reina abdicado y su consorte.',
      },
      {
        text: 'Los Regentes nombrados por las Cortes Generales y sus cónyuges.',
        trap: 'factual_misapplication',
        why: 'La Regencia no aparece en el art. 55 bis LOPJ como supuesto de aforamiento ante el Tribunal Supremo.',
      },
      {
        text: 'Los hijos de los Infantes de España y sus descendientes directos.',
        trap: 'overbroad_statement',
        why: 'Los hijos de los Infantes son Grandes de España, pero no están incluidos en el aforamiento del art. 55 bis LOPJ.',
      },
    ],
    legal: 'Art. 55 bis LOPJ (LO 6/1985, añadido por LO 4/2014)',
    cluster: 'cluster_t4g_consorte_aforamiento',
    difficulty: 3,
  },
  {
    stem: '¿En qué supuestos procede la Regencia según la Constitución?',
    prompt: 'Distingue las dos causas constitucionales de la Regencia.',
    key: 'A',
    correct: {
      text: 'Cuando el Rey sea menor de edad o se inhabilitare, reconocida la imposibilidad por las Cortes Generales.',
      rule: 'El art. 59 CE prevé la Regencia por minoría de edad del Rey y por su inhabilitación para el ejercicio de la autoridad, cuando la imposibilidad sea reconocida por las Cortes Generales.',
    },
    distractors: [
      {
        text: 'Cuando el Rey se ausente del territorio nacional durante más de tres meses o disuelva las Cortes.',
        trap: 'factual_misapplication',
        why: 'La ausencia o la disolución no son causas de Regencia; la disolución es una función regia sujeta a la Constitución.',
      },
      {
        text: 'Cuando el Rey padezca una enfermedad temporal que le impida despachar los asuntos de Estado.',
        trap: 'partial_rule_accuracy',
        why: 'La enfermedad temporal no basta: la Constitución exige inhabilitación reconocida por las Cortes Generales.',
      },
      {
        text: 'Cuando el Rey abdique o fallezca sin que exista heredero llamado en Derecho a sucederle.',
        trap: 'conceptual_merger',
        why: 'La abdicación y la falta de heredero se resuelven por las reglas sucesorias y la ley orgánica, no mediante la Regencia.',
      },
    ],
    legal: 'Art. 59 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: 'Si el Rey es menor de edad, ¿quién ejerce la Regencia en primer lugar?',
    prompt: 'Recuerda el orden de llamamiento del art. 59.1 CE.',
    key: 'A',
    correct: {
      text: 'El padre o la madre del Rey y, en su defecto, el pariente mayor de edad más próximo.',
      rule: 'El art. 59.1 CE llama en primer lugar al padre o la madre del Rey menor y, en su defecto, al pariente mayor de edad más próximo a suceder en la Corona.',
    },
    distractors: [
      {
        text: 'El pariente mayor de edad más próximo a suceder y, en su defecto, el padre o la madre.',
        trap: 'conceptual_merger',
        why: 'Invierte el orden legal: el padre o la madre preceden al pariente más próximo.',
      },
      {
        text: 'El Príncipe heredero y, en su defecto, el Presidente del Gobierno en funciones.',
        trap: 'wrong_competent_body',
        why: 'El Príncipe heredero solo entra en la Regencia por inhabilitación si es mayor de edad; el Presidente del Gobierno no es llamado por la Constitución.',
      },
      {
        text: 'Las Cortes Generales y, en su defecto, el Consejo de Ministros de la Nación.',
        trap: 'factual_misapplication',
        why: 'Las Cortes solo nombran Regente cuando no hay persona a quien corresponda; el Consejo de Ministros no interviene.',
      },
    ],
    legal: 'Art. 59.1 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: 'Si el Rey se inhabilita y las Cortes Generales reconocen la imposibilidad, ¿quién asume inmediatamente la Regencia?',
    prompt: 'Piensa en el llamamiento preferente del heredero, con su condición de edad.',
    key: 'A',
    correct: {
      text: 'El Príncipe heredero de la Corona, si fuere mayor de edad.',
      rule: 'El art. 59.2 CE dispone que, reconocida la imposibilidad por las Cortes Generales, entra a ejercer inmediatamente la Regencia el Príncipe heredero de la Corona si fuere mayor de edad; si no, se aplica la regla del apartado anterior.',
    },
    distractors: [
      {
        text: 'El Presidente del Gobierno en funciones, hasta la celebración de elecciones.',
        trap: 'wrong_competent_body',
        why: 'El Presidente del Gobierno no sustituye al Rey en la Jefatura del Estado; la Regencia tiene un orden constitucional propio.',
      },
      {
        text: 'El Presidente del Congreso de los Diputados, como autoridad supletoria.',
        trap: 'conceptual_merger',
        why: 'El Presidente del Congreso refrenda determinados actos, pero no asume la Regencia.',
      },
      {
        text: 'El pariente de mayor edad del Rey, con independencia de su grado.',
        trap: 'partial_rule_accuracy',
        why: 'Ese criterio solo opera en defecto del heredero mayor de edad y exige ser el pariente más próximo a suceder.',
      },
    ],
    legal: 'Art. 59.2 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 3,
  },
  {
    stem: 'Si no hubiere persona a quien corresponda la Regencia, ¿quién la nombra y cómo se compone?',
    prompt: 'Recuerda el número impar que caracteriza la Regencia subsidiaria.',
    key: 'A',
    correct: {
      text: 'Las Cortes Generales, y se compondrá de una, tres o cinco personas.',
      rule: 'El art. 59.3 CE atribuye a las Cortes Generales el nombramiento de la Regencia cuando no haya persona a quien corresponda, y fija su composición en una, tres o cinco personas.',
    },
    distractors: [
      {
        text: 'El Rey, y se compondrá de una o tres personas como máximo.',
        trap: 'wrong_competent_body',
        why: 'La Regencia subsidiaria la nombran las Cortes Generales, no el Rey.',
      },
      {
        text: 'El Consejo de Ministros, y se compondrá de tres o cinco personas.',
        trap: 'conceptual_merger',
        why: 'El Gobierno no nombra la Regencia y la composición legal incluye también la posibilidad de una sola persona.',
      },
      {
        text: 'El Tribunal Constitucional, y se compondrá de una sola persona.',
        trap: 'numeric_substitution',
        why: 'El Tribunal Constitucional no interviene y la norma permite una, tres o cinco personas.',
      },
    ],
    legal: 'Art. 59.3 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: '¿Qué requisitos se exigen para ejercer la Regencia?',
    prompt: 'Contrasta los requisitos del Regente con los del tutor testamentario.',
    key: 'A',
    correct: {
      text: 'Ser español y mayor de edad.',
      rule: 'El art. 59.4 CE exige para ejercer la Regencia ser español y mayor de edad.',
    },
    distractors: [
      {
        text: 'Ser español de nacimiento y mayor de edad.',
        trap: 'partial_rule_accuracy',
        why: 'La exigencia de español de nacimiento corresponde al tutor testamentario, no al Regente.',
      },
      {
        text: 'Ser español, mayor de edad y no tener cargo político.',
        trap: 'overbroad_statement',
        why: 'La incompatibilidad con todo cargo o representación política se predica de la tutela, no de la Regencia.',
      },
      {
        text: 'Ser español de nacimiento, mayor de edad y residir en España.',
        trap: 'hyper_narrow_statement',
        why: 'La Constitución no exige nacimiento ni residencia para ser Regente.',
      },
    ],
    legal: 'Art. 59.4 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: '¿Quién es tutor del Rey menor en primer lugar, conforme al artículo 60 CE?',
    prompt: 'Recuerda la prelación entre tutela testamentaria, legítima y dativa.',
    key: 'A',
    correct: {
      text: 'La persona nombrada en testamento por el Rey difunto, si es mayor de edad y español de nacimiento.',
      rule: 'El art. 60.1 CE llama en primer lugar al tutor nombrado en testamento por el Rey difunto, siempre que sea mayor de edad y español de nacimiento.',
    },
    distractors: [
      {
        text: 'El padre o la madre del Rey menor, siempre que permanezcan viudos y no contraigan nuevas nupcias.',
        trap: 'conceptual_merger',
        why: 'La tutela legítima del padre o la madre solo procede si no existe tutor testamentario.',
      },
      {
        text: 'El pariente mayor de edad más próximo a suceder en la Corona, previa autorización de las Cortes.',
        trap: 'partial_rule_accuracy',
        why: 'Ese criterio pertenece a la Regencia por minoría, no a la prelación de la tutela.',
      },
      {
        text: 'La persona designada por las Cortes Generales mediante ley orgánica y con informe del Consejo de Estado.',
        trap: 'wrong_competent_body',
        why: 'La tutela dativa de las Cortes es la última en el orden de prelación y no exige ley orgánica ni dictamen del Consejo de Estado.',
      },
    ],
    legal: 'Art. 60.1 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: '¿En qué personas pueden acumularse los cargos de Regente y de tutor del Rey menor?',
    prompt: 'Localiza la excepción expresa a la prohibición de acumulación.',
    key: 'A',
    correct: {
      text: 'Solo en el padre, la madre o los ascendientes directos del Rey.',
      rule: 'El art. 60.1 CE permite acumular los cargos de Regente y tutor únicamente en el padre, la madre o los ascendientes directos del Rey.',
    },
    distractors: [
      {
        text: 'Solo en el padre y la madre del Rey, con exclusión de los abuelos.',
        trap: 'hyper_narrow_statement',
        why: 'La norma incluye también a los ascendientes directos, no solo a los progenitores.',
      },
      {
        text: 'En cualquier pariente hasta el cuarto grado de consanguinidad.',
        trap: 'overbroad_statement',
        why: 'La acumulación se limita al padre, la madre o los ascendientes directos, no a cualquier pariente.',
      },
      {
        text: 'En el cónyuge del Rey o en la persona que este designe en testamento.',
        trap: 'factual_misapplication',
        why: 'Ni el cónyuge ni el designado en testamento son los supuestos de acumulación previstos.',
      },
    ],
    legal: 'Art. 60.1 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: '¿Cuántas personas pueden ejercer la tutela del Rey menor?',
    prompt: 'Contrasta la composición de la tutela con la de la Regencia subsidiaria.',
    key: 'A',
    correct: {
      text: 'Solamente una persona.',
      rule: 'El art. 60.1 CE configura la tutela como un cargo unipersonal: será tutor del Rey menor solamente una persona.',
    },
    distractors: [
      {
        text: 'Una, tres o cinco personas, siempre en número impar.',
        trap: 'numeric_substitution',
        why: 'Esa composición corresponde a la Regencia nombrada por las Cortes Generales, no a la tutela.',
      },
      {
        text: 'Dos personas: el padre y la madre conjuntamente.',
        trap: 'conceptual_merger',
        why: 'La tutela legítima corresponde al padre o a la madre, no a ambos conjuntamente como regla.',
      },
      {
        text: 'Tres personas designadas por las Cortes Generales.',
        trap: 'wrong_competent_body',
        why: 'Las Cortes solo nombran tutor en defecto de las personas llamadas antes, y la tutela sigue siendo unipersonal.',
      },
    ],
    legal: 'Art. 60.1 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 1,
  },
  {
    stem: '¿Con qué es incompatible el ejercicio de la tutela del Rey menor?',
    prompt: 'Recuerda la incompatibilidad que evita condicionar políticamente al Rey menor.',
    key: 'A',
    correct: {
      text: 'Con todo cargo o representación política.',
      rule: 'El art. 60.1 CE declara incompatible el ejercicio de la tutela con todo cargo o representación política.',
    },
    distractors: [
      {
        text: 'Con la condición de funcionario de carrera del Estado.',
        trap: 'factual_misapplication',
        why: 'La incompatibilidad se refiere a cargos o representaciones políticas, no a la condición de funcionario.',
      },
      {
        text: 'Con el ejercicio de la Regencia en cualquier supuesto.',
        trap: 'overbroad_statement',
        why: 'La acumulación con la Regencia se permite en el padre, la madre o los ascendientes directos.',
      },
      {
        text: 'Con la pertenencia a la Casa de S.M. el Rey.',
        trap: 'conceptual_merger',
        why: 'La norma no establece esa incompatibilidad; se centra en los cargos y representaciones políticas.',
      },
    ],
    legal: 'Art. 60.1 CE',
    cluster: 'cluster_t4g_regencia_tutela',
    pair: 'pair_t4g_regente_vs_tutor',
    difficulty: 2,
  },
  {
    stem: '¿Qué juramento presta el Rey al ser proclamado ante las Cortes Generales?',
    prompt: 'Recuerda los tres compromisos del art. 61.1 CE.',
    key: 'A',
    correct: {
      text: 'Desempeñar fielmente sus funciones, guardar y hacer guardar la Constitución y las leyes y respetar los derechos de los ciudadanos y de las CCAA.',
      rule: 'El art. 61.1 CE exige al Rey jurar desempeñar fielmente sus funciones, guardar y hacer guardar la Constitución y las leyes y respetar los derechos de los ciudadanos y de las Comunidades Autónomas.',
    },
    distractors: [
      {
        text: 'Guardar fidelidad al Rey anterior, cumplir las leyes y respetar la unidad de España y su integridad territorial en todo momento.',
        trap: 'conceptual_merger',
        why: 'El juramento de fidelidad al Rey corresponde al heredero y a los Regentes, no al Rey proclamado.',
      },
      {
        text: 'Desempeñar sus funciones, acatar las sentencias del Tribunal Constitucional y disolver las Cortes cuando proceda conforme a la ley.',
        trap: 'partial_rule_accuracy',
        why: 'Sustituye la defensa de la Constitución y las leyes y los derechos por compromisos que no figuran en el art. 61.1 CE.',
      },
      {
        text: 'Cumplir la Constitución, respetar los estatutos de autonomía y mantener la integridad del territorio nacional y la unidad de la Nación.',
        trap: 'factual_misapplication',
        why: 'El juramento constitucional no menciona los estatutos ni la integridad territorial en esos términos.',
      },
    ],
    legal: 'Art. 61.1 CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: 'Además del mismo juramento que el Rey, ¿qué otro juramento prestan el Príncipe heredero y los Regentes?',
    prompt: 'Identifica el compromiso adicional del art. 61.2 CE.',
    key: 'A',
    correct: {
      text: 'El de fidelidad al Rey.',
      rule: 'El art. 61.2 CE exige al Príncipe heredero, al alcanzar la mayoría de edad, y al Regente o Regentes, al hacerse cargo de sus funciones, el mismo juramento que el Rey y además el de fidelidad al Rey.',
    },
    distractors: [
      {
        text: 'El de fidelidad a las Cortes Generales.',
        trap: 'wrong_competent_body',
        why: 'El juramento adicional se presta al Rey, no a las Cortes Generales.',
      },
      {
        text: 'El de fidelidad al Gobierno de la Nación.',
        trap: 'conceptual_merger',
        why: 'El Gobierno no es el destinatario del juramento de fidelidad previsto en el art. 61.2 CE.',
      },
      {
        text: 'El de fidelidad a la Constitución y a las leyes.',
        trap: 'partial_rule_accuracy',
        why: 'La fidelidad a la Constitución ya forma parte del juramento común; el adicional es al Rey.',
      },
    ],
    legal: 'Art. 61.2 CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Qué corresponde al Rey respecto de las leyes aprobadas por las Cortes Generales?',
    prompt: 'Distingue sanción y promulgación de ejecución.',
    key: 'A',
    correct: {
      text: 'Sancionarlas y promulgarlas, sin poder ejecutarlas por sí mismo.',
      rule: 'El art. 62.a CE atribuye al Rey sancionar y promulgar las leyes; no le corresponde ejecutarlas, función que desarrolla el Gobierno conforme a la Constitución y las leyes.',
    },
    distractors: [
      {
        text: 'Ejecutarlas y desarrollarlas mediante los reglamentos que estime oportunos.',
        trap: 'conceptual_merger',
        why: 'La ejecución y el desarrollo reglamentario corresponden al Gobierno, no al Rey.',
      },
      {
        text: 'Promulgar solo las leyes orgánicas, correspondiendo las ordinarias al Gobierno.',
        trap: 'partial_rule_accuracy',
        why: 'El Rey sanciona y promulga tanto las leyes orgánicas como las ordinarias.',
      },
      {
        text: 'Sancionarlas con carácter previo a su aprobación por las Cámaras.',
        trap: 'temporal_confusion',
        why: 'La sanción es posterior a la aprobación parlamentaria; no se produce antes.',
      },
    ],
    legal: 'Art. 62.a CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Cómo ejerce el Rey la facultad de disolución de las Cámaras?',
    prompt: 'Recuerda que la disolución no es un acto libre ni discrecional.',
    key: 'A',
    correct: {
      text: 'Convocar y disolver las Cortes y convocar elecciones conforme a la Constitución.',
      rule: 'El art. 62.b CE atribuye al Rey convocar y disolver las Cortes Generales y convocar elecciones en los términos previstos en la Constitución.',
    },
    distractors: [
      {
        text: 'Disolverlas libremente cuando lo estime oportuno para el interés general del Estado.',
        trap: 'overbroad_statement',
        why: 'La disolución está sometida a los supuestos y límites constitucionales; no es una facultad libre.',
      },
      {
        text: 'Proponer su disolución al Presidente del Gobierno, que es quien la acuerda.',
        trap: 'wrong_competent_body',
        why: 'El Rey disuelve conforme a la Constitución; no se limita a proponer la disolución al Presidente del Gobierno.',
      },
      {
        text: 'Disolver solo el Congreso de los Diputados, manteniendo el Senado en funciones.',
        trap: 'partial_rule_accuracy',
        why: 'La disolución prevista constitucionalmente afecta a las Cortes Generales, no solo a una Cámara.',
      },
    ],
    legal: 'Art. 62.b CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Qué requisito constitucional exige la declaración de guerra por el Rey?',
    prompt: 'Recuerda la intervención parlamentaria previa que exige el art. 63 CE.',
    key: 'A',
    correct: {
      text: 'La previa autorización de las Cortes Generales.',
      rule: 'El art. 63.3 CE exige que el Rey declare la guerra y haga la paz previa autorización de las Cortes Generales.',
    },
    distractors: [
      {
        text: 'La previa autorización del Consejo de Ministros.',
        trap: 'wrong_competent_body',
        why: 'La autorización corresponde a las Cortes Generales, no al Consejo de Ministros.',
      },
      {
        text: 'La previa autorización del Tribunal Constitucional.',
        trap: 'conceptual_merger',
        why: 'El Tribunal Constitucional no autoriza actos políticos de este tipo.',
      },
      {
        text: 'La mayoría absoluta del Congreso y del Senado en sesión conjunta.',
        trap: 'partial_rule_accuracy',
        why: 'La Constitución exige autorización de las Cortes Generales, sin imponer esa mayoría ni la sesión conjunta.',
      },
    ],
    legal: 'Art. 63.3 CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Qué límite tiene el derecho de gracia que corresponde al Rey?',
    prompt: 'Recuerda la prohibición expresa del art. 62.i CE.',
    key: 'A',
    correct: {
      text: 'No podrá autorizar indultos generales.',
      rule: 'El art. 62.i CE permite al Rey ejercer el derecho de gracia con arreglo a la ley, pero le prohíbe autorizar indultos generales.',
    },
    distractors: [
      {
        text: 'No podrá indultar delitos de terrorismo en ningún caso.',
        trap: 'overbroad_statement',
        why: 'La Constitución no contiene esa prohibición absoluta; el límite expreso son los indultos generales.',
      },
      {
        text: 'No podrá conceder indultos sin informe previo del Tribunal Supremo.',
        trap: 'factual_misapplication',
        why: 'La Constitución no establece ese informe como condición del derecho de gracia.',
      },
      {
        text: 'No podrá indultar a los miembros del Gobierno condenados por el Senado.',
        trap: 'wrong_competent_body',
        why: 'La norma no contiene esa limitación subjetiva; el límite es la prohibición de indultos generales.',
      },
    ],
    legal: 'Art. 62.i CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿En qué condiciones puede el Rey presidir las sesiones del Consejo de Ministros?',
    prompt: 'Recuerda quién toma la iniciativa y con qué finalidad.',
    key: 'A',
    correct: {
      text: 'Cuando lo estime oportuno y a petición del Presidente del Gobierno.',
      rule: 'El art. 62.g CE permite al Rey ser informado de los asuntos de Estado y presidir las sesiones del Consejo de Ministros cuando lo estime oportuno, a petición del Presidente del Gobierno.',
    },
    distractors: [
      {
        text: 'Cuando lo solicite la mayoría absoluta del Congreso de los Diputados.',
        trap: 'wrong_competent_body',
        why: 'La iniciativa corresponde al Presidente del Gobierno, no al Congreso.',
      },
      {
        text: 'Siempre que se trate de asuntos de política exterior o de defensa nacional.',
        trap: 'partial_rule_accuracy',
        why: 'La Constitución no limita la presidencia a esas materias; exige la petición del Presidente del Gobierno.',
      },
      {
        text: 'Cuando el Presidente del Gobierno se encuentre ausente del territorio nacional.',
        trap: 'factual_misapplication',
        why: 'La ausencia del Presidente no es el supuesto previsto por el art. 62.g CE.',
      },
    ],
    legal: 'Art. 62.g CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 2,
  },
  {
    stem: '¿Qué competencia militar corresponde al Rey según la Constitución?',
    prompt: 'Descarta la trampa que atribuye al Rey el mando de órganos constitucionales.',
    key: 'A',
    correct: {
      text: 'El mando supremo de las Fuerzas Armadas.',
      rule: 'El art. 62.h CE atribuye al Rey el mando supremo de las Fuerzas Armadas.',
    },
    distractors: [
      {
        text: 'El mando supremo del Tribunal Constitucional.',
        trap: 'conceptual_merger',
        why: 'El Tribunal Constitucional no tiene mando militar; la competencia regia se refiere a las Fuerzas Armadas.',
      },
      {
        text: 'La jefatura directa del Estado Mayor de la Defensa.',
        trap: 'wrong_competent_body',
        why: 'El mando supremo es una posición constitucional; la jefatura directa del Estado Mayor corresponde a su titular.',
      },
      {
        text: 'La potestad de declarar la guerra sin autorización parlamentaria.',
        trap: 'overbroad_statement',
        why: 'La declaración de guerra exige la previa autorización de las Cortes Generales.',
      },
    ],
    legal: 'Art. 62.h CE',
    cluster: 'cluster_t4g_juramento_funciones',
    difficulty: 1,
  },
  {
    stem: '¿Qué tratamiento corresponde al Rey o Reina de España como titular de la Corona?',
    prompt: 'Recuerda el tratamiento del titular según el RD 1368/1987.',
    key: 'A',
    correct: {
      text: 'El de Majestad.',
      rule: 'El art. 1 del RD 1368/1987 atribuye al titular de la Corona la denominación de Rey o Reina de España y el tratamiento de Majestad.',
    },
    distractors: [
      {
        text: 'El de Alteza Real.',
        trap: 'conceptual_merger',
        why: 'Alteza Real corresponde al consorte de la Reina, al heredero y su consorte y a los Infantes por derecho.',
      },
      {
        text: 'El de Alteza.',
        trap: 'partial_rule_accuracy',
        why: 'Alteza corresponde a los Regentes y a los Infantes agraciados por circunstancias excepcionales.',
      },
      {
        text: 'El de Excelencia.',
        trap: 'familiar_wording_trap',
        why: 'Excelencia es el tratamiento de los hijos de los Infantes de España, no del titular de la Corona.',
      },
    ],
    legal: 'RD 1368/1987, art. 1',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 1,
  },
  {
    stem: '¿Qué denominación y tratamiento corresponden al consorte del Rey de España?',
    prompt: 'Distingue el consorte del Rey del consorte de la Reina.',
    key: 'A',
    correct: {
      text: 'La denominación de Reina y el tratamiento de Majestad.',
      rule: 'El art. 1.2 del RD 1368/1987 atribuye al consorte del Rey la denominación de Reina y el tratamiento de Majestad mientras lo sea o permanezca viuda.',
    },
    distractors: [
      {
        text: 'La dignidad de Príncipe y el tratamiento de Alteza Real.',
        trap: 'conceptual_merger',
        why: 'Esa es la condición del consorte de la Reina, no la del consorte del Rey.',
      },
      {
        text: 'La dignidad de Infante y el tratamiento de Alteza.',
        trap: 'partial_rule_accuracy',
        why: 'La dignidad de Infante y el tratamiento de Alteza corresponden a otras figuras del RD 1368/1987.',
      },
      {
        text: 'La consideración de Grande de España y el tratamiento de Excelencia.',
        trap: 'wrong_legal_object',
        why: 'Grande de España y Excelencia es la condición de los hijos de los Infantes.',
      },
    ],
    legal: 'RD 1368/1987, art. 1.2',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué dignidad y tratamiento corresponden al consorte de la Reina de España?',
    prompt: 'Aplica la regla del consorte varón de una Reina.',
    key: 'A',
    correct: {
      text: 'La dignidad de Príncipe y el tratamiento de Alteza Real.',
      rule: 'El art. 1.3 del RD 1368/1987 atribuye al consorte de la Reina la dignidad de Príncipe y el tratamiento de Alteza Real mientras lo sea o permanezca viudo.',
    },
    distractors: [
      {
        text: 'La dignidad de Príncipe y el tratamiento de Majestad.',
        trap: 'partial_rule_accuracy',
        why: 'La dignidad es correcta, pero el tratamiento de Majestad corresponde al consorte del Rey.',
      },
      {
        text: 'La dignidad de Infante y el tratamiento de Alteza.',
        trap: 'conceptual_merger',
        why: 'La dignidad de Infante no corresponde al consorte de la Reina.',
      },
      {
        text: 'La consideración de Grande de España y el tratamiento de Excelencia.',
        trap: 'wrong_legal_object',
        why: 'Grande de España y Excelencia es la condición de los hijos de los Infantes.',
      },
    ],
    legal: 'RD 1368/1987, art. 1.3',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué tratamiento corresponde al Príncipe o Princesa de Asturias y a su consorte?',
    prompt: 'Recuerda si el consorte del heredero participa o no de la dignidad.',
    key: 'A',
    correct: {
      text: 'Alteza Real, participando el consorte de igual dignidad y tratamiento.',
      rule: 'El art. 2 del RD 1368/1987 atribuye al heredero la dignidad de Príncipe o Princesa de Asturias y el tratamiento de Alteza Real, del que participa igualmente su consorte.',
    },
    distractors: [
      {
        text: 'Alteza, sin que el consorte participe de la dignidad del heredero.',
        trap: 'partial_rule_accuracy',
        why: 'El heredero recibe Alteza Real, no Alteza, y su consorte sí participa de la dignidad.',
      },
      {
        text: 'Majestad, con honores análogos a los que corresponden al Rey.',
        trap: 'conceptual_merger',
        why: 'Majestad corresponde al titular y a la Reina consorte, no al heredero.',
      },
      {
        text: 'Excelencia, como Grandes de España y consortes de la Corona.',
        trap: 'wrong_legal_object',
        why: 'Excelencia es el tratamiento de los hijos de los Infantes, no del heredero.',
      },
    ],
    legal: 'RD 1368/1987, art. 2',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué tratamiento corresponde a los hijos del Rey que no tienen la condición de Príncipe o Princesa de Asturias?',
    prompt: 'Distingue a los Infantes por derecho de los agraciados por merced.',
    key: 'A',
    correct: {
      text: 'El de Alteza Real, como Infantes de España por derecho propio.',
      rule: 'El art. 3.1 del RD 1368/1987 atribuye a los hijos del Rey que no sean Príncipe o Princesa de Asturias la condición de Infantes de España y el tratamiento de Alteza Real.',
    },
    distractors: [
      {
        text: 'El de Alteza, como Infantes agraciados por circunstancias excepcionales.',
        trap: 'conceptual_merger',
        why: 'Alteza corresponde a los Infantes por merced, no a los Infantes por derecho.',
      },
      {
        text: 'El de Excelencia, como Grandes de España por su nacimiento.',
        trap: 'partial_rule_accuracy',
        why: 'Excelencia corresponde a los hijos de los Infantes, no a los hijos del Rey.',
      },
      {
        text: 'El de Majestad, mientras no contraigan matrimonio con autorización real.',
        trap: 'factual_misapplication',
        why: 'Los hijos del Rey no reciben el tratamiento de Majestad.',
      },
    ],
    legal: 'RD 1368/1987, art. 3.1',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué tratamiento corresponde a quien el Rey agracia con la dignidad de Infante por circunstancias excepcionales?',
    prompt: 'Recuerda la diferencia entre Alteza y Alteza Real.',
    key: 'A',
    correct: {
      text: 'El de Alteza, no el de Alteza Real.',
      rule: 'El art. 3.2 del RD 1368/1987 permite al Rey agraciar con la dignidad de Infante y el tratamiento de Alteza a quienes concurran circunstancias excepcionales.',
    },
    distractors: [
      {
        text: 'El de Alteza Real, con igualdad respecto de los Infantes por derecho.',
        trap: 'conceptual_merger',
        why: 'El tratamiento de Alteza Real se reserva a los Infantes por derecho; el agraciado recibe Alteza.',
      },
      {
        text: 'El de Excelencia, como Grande de España.',
        trap: 'partial_rule_accuracy',
        why: 'Excelencia corresponde a los hijos de los Infantes, no al Infante agraciado.',
      },
      {
        text: 'El de Majestad, con carácter honorífico y vitalicio.',
        trap: 'overbroad_statement',
        why: 'La merced excepcional no confiere el tratamiento de Majestad.',
      },
    ],
    legal: 'RD 1368/1987, art. 3.2',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué consideración y tratamiento corresponden a los hijos de los Infantes de España?',
    prompt: 'Identifica la figura que recibe Excelencia.',
    key: 'A',
    correct: {
      text: 'La de Grandes de España, con tratamiento de Excelencia.',
      rule: 'El art. 4 del RD 1368/1987 otorga a los hijos de los Infantes de España la consideración de Grandes de España, sin tratamiento especial distinto del de Excelencia.',
    },
    distractors: [
      {
        text: 'La de Infantes de España, con tratamiento de Alteza Real.',
        trap: 'conceptual_merger',
        why: 'La condición de Infante no se transmite a los hijos de los Infantes.',
      },
      {
        text: 'La de Príncipes de Asturias, con tratamiento de Alteza Real.',
        trap: 'partial_rule_accuracy',
        why: 'La dignidad de Príncipe o Princesa de Asturias corresponde al heredero, no a los hijos de los Infantes.',
      },
      {
        text: 'La de nobles de la Casa Real, con tratamiento de Señoría.',
        trap: 'familiar_wording_trap',
        why: 'El RD 1368/1987 no les atribuye esa condición ni el tratamiento de Señoría.',
      },
    ],
    legal: 'RD 1368/1987, art. 4',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué tratamiento corresponde a quienes ejerzan la Regencia?',
    prompt: 'No confundas el tratamiento del Regente con el del heredero.',
    key: 'A',
    correct: {
      text: 'Alteza, con honores iguales a los del Príncipe de Asturias.',
      rule: 'El art. 5 del RD 1368/1987 atribuye a quienes ejerzan la Regencia el tratamiento de Alteza y los mismos honores que el Príncipe de Asturias, salvo que les correspondan otros de mayor rango.',
    },
    distractors: [
      {
        text: 'Alteza Real, con los mismos honores que el heredero de la Corona.',
        trap: 'conceptual_merger',
        why: 'El Regente recibe Alteza, no Alteza Real, aunque sus honores se equiparen a los del heredero.',
      },
      {
        text: 'Majestad, mientras dure el ejercicio de la Regencia del Reino.',
        trap: 'partial_rule_accuracy',
        why: 'La Regencia no confiere el tratamiento de Majestad.',
      },
      {
        text: 'Excelencia, como Grandes de España durante el tiempo de la Regencia.',
        trap: 'wrong_legal_object',
        why: 'Excelencia corresponde a los hijos de los Infantes, no a los Regentes.',
      },
    ],
    legal: 'RD 1368/1987, art. 5',
    cluster: 'cluster_t4g_tratamientos',
    pair: 'pair_t4g_alteza_real_vs_alteza',
    difficulty: 2,
  },
  {
    stem: '¿Qué honores corresponden a Don Juan Carlos de Borbón como Rey honorífico?',
    prompt: 'Distingue sus honores de los de Doña Sofía.',
    key: 'A',
    correct: {
      text: 'Honores análogos a los del Heredero de la Corona, Príncipe o Princesa de Asturias.',
      rule: 'La disposición transitoria cuarta del RD 1368/1987 reconoce a Don Juan Carlos el uso honorífico y vitalicio del título de Rey, con tratamiento de Majestad y honores análogos a los del Heredero de la Corona.',
    },
    distractors: [
      {
        text: 'Honores análogos a los de la Princesa o Príncipe de Asturias consortes.',
        trap: 'conceptual_merger',
        why: 'Esos son los honores de Doña Sofía, no los de Don Juan Carlos.',
      },
      {
        text: 'Honores análogos a los de quien ejerce la Regencia del Reino durante la minoría del Rey.',
        trap: 'partial_rule_accuracy',
        why: 'Los Regentes reciben honores de Alteza; el Rey honorífico tiene honores de heredero.',
      },
      {
        text: 'Honores análogos a los de los Infantes de España por derecho propio y sus consortes.',
        trap: 'wrong_legal_object',
        why: 'Los honores del Rey honorífico se asimilan a los del heredero, no a los de los Infantes.',
      },
    ],
    legal: 'RD 1368/1987, disposición transitoria cuarta',
    cluster: 'cluster_t4g_tratamientos',
    difficulty: 3,
  },
  {
    stem: '¿En qué unidades se estructura la Casa de S.M. el Rey según el Real Decreto 434/1988?',
    prompt: 'Agrupa correctamente el Cuarto Militar y la Guardia Real.',
    key: 'A',
    correct: {
      text: 'Jefatura, Secretaría General y Cuarto Militar y Guardia Real.',
      rule: 'El RD 434/1988 estructura la Casa de S.M. el Rey en tres unidades: Jefatura, Secretaría General y Cuarto Militar y Guardia Real.',
    },
    distractors: [
      {
        text: 'Jefatura, Secretaría General y Consejo de Administración.',
        trap: 'partial_rule_accuracy',
        why: 'El Consejo de Administración de Patrimonio Nacional no es una unidad de la Casa Real.',
      },
      {
        text: 'Presidencia, Secretaría General y Cuarto Militar.',
        trap: 'conceptual_merger',
        why: 'La Casa no se organiza en una Presidencia; la unidad superior es la Jefatura.',
      },
      {
        text: 'Jefatura, Intervención General y Guardia Real.',
        trap: 'factual_misapplication',
        why: 'La Intervención es un órgano de la Casa, pero no una de las tres unidades del RD 434/1988.',
      },
    ],
    legal: 'RD 434/1988, art. 2',
    cluster: 'cluster_t4g_casa_real_estructura',
    difficulty: 2,
  },
  {
    stem: '¿Cuántas clases de personal distingue el Real Decreto 434/1988 en la Casa de S.M. el Rey?',
    prompt: 'Recuerda las cinco categorías, incluidos los funcionarios eventuales.',
    key: 'A',
    correct: {
      text: 'Cinco: alta dirección, dirección, funcionarios de carrera, funcionarios eventuales y personal laboral.',
      rule: 'El RD 434/1988 distingue cinco clases de personal: de alta dirección, de dirección, funcionarios de carrera del Estado, CCAA o EELL, funcionarios eventuales y personal laboral.',
    },
    distractors: [
      {
        text: 'Cuatro: alta dirección, dirección, funcionarios de carrera y personal laboral de la Casa.',
        trap: 'numeric_substitution',
        why: 'Omite los funcionarios eventuales, que constituyen una clase diferenciada.',
      },
      {
        text: 'Tres: alta dirección, funcionarios de carrera y personal laboral de la Casa.',
        trap: 'hyper_narrow_statement',
        why: 'La norma distingue también el personal de dirección y los funcionarios eventuales.',
      },
      {
        text: 'Seis: alta dirección, dirección, funcionarios de carrera, eventuales, laborales y militares.',
        trap: 'overbroad_statement',
        why: 'El personal militar no forma una clase adicional de las enumeradas en el RD 434/1988.',
      },
    ],
    legal: 'RD 434/1988, art. 8',
    cluster: 'cluster_t4g_casa_real_estructura',
    difficulty: 2,
  },
  {
    stem: '¿Qué cargos integran el personal de alta dirección de la Casa Real y a qué órganos se asimilan?',
    prompt: 'Recuerda la lista cerrada de tres cargos y sus asimilaciones.',
    key: 'A',
    correct: {
      text: 'Jefe de la Casa a Ministros, Secretario General a Secretarios de Estado y Jefe del Cuarto Militar a Subsecretarios.',
      rule: 'El RD 434/1988 considera personal de alta dirección únicamente al Jefe de la Casa, asimilado a Ministros; al Secretario General, asimilado a Secretarios de Estado; y al Jefe del Cuarto Militar, asimilado a Subsecretarios.',
    },
    distractors: [
      {
        text: 'Jefe de la Casa a Secretarios de Estado, Secretario General a Subsecretarios e Interventor a Ministros.',
        trap: 'conceptual_merger',
        why: 'Altera las asimilaciones e incluye al Interventor, que es personal de dirección.',
      },
      {
        text: 'Jefe de la Casa a Ministros, Secretario General a Subsecretarios y Consejero Diplomático a Secretarios de Estado.',
        trap: 'partial_rule_accuracy',
        why: 'El Secretario General se asimila a Secretarios de Estado y el Consejero Diplomático es personal de dirección.',
      },
      {
        text: 'Jefe de la Casa a Subsecretarios, Secretario General a Ministros y Jefe del Cuarto Militar a Secretarios de Estado.',
        trap: 'rule_exception_swap',
        why: 'Invierte por completo las asimilaciones legalmente previstas.',
      },
    ],
    legal: 'RD 434/1988, art. 9.1',
    cluster: 'cluster_t4g_casa_real_estructura',
    difficulty: 3,
  },
  {
    stem: '¿Qué personal de la Casa Real percibe sus retribuciones por el Ministerio de la Presidencia?',
    prompt: 'Separa a los funcionarios del personal de confianza y laboral.',
    key: 'A',
    correct: {
      text: 'Los funcionarios de carrera y los funcionarios eventuales.',
      rule: 'El RD 434/1988 atribuye al Ministerio de la Presidencia el pago de las retribuciones de los funcionarios de carrera del Estado, CCAA o EELL y de los funcionarios eventuales.',
    },
    distractors: [
      {
        text: 'El personal de alta dirección y el personal laboral.',
        trap: 'conceptual_merger',
        why: 'Esos perciben sus retribuciones con cargo a la dotación de los PGE para la Casa.',
      },
      {
        text: 'El personal de dirección y el personal laboral de la Casa.',
        trap: 'partial_rule_accuracy',
        why: 'El personal de dirección y el laboral se retribuyen con cargo a los PGE, no por el Ministerio de la Presidencia.',
      },
      {
        text: 'Todos los empleados públicos destinados en la Casa de S.M. el Rey.',
        trap: 'overbroad_statement',
        why: 'El régimen se divide entre la dotación de los PGE y el Ministerio de la Presidencia.',
      },
    ],
    legal: 'RD 434/1988, art. 12.2',
    cluster: 'cluster_t4g_casa_real_estructura',
    difficulty: 3,
  },
  {
    stem: '¿A qué órgano corresponde la auditoría externa de las cuentas anuales de la Casa Real y a cuál el asesoramiento jurídico?',
    prompt: 'Distingue el control externo de la defensa jurídica del Estado.',
    key: 'A',
    correct: {
      text: 'La auditoría al Tribunal de Cuentas y la asistencia jurídica al Servicio Jurídico del Estado.',
      rule: 'El RD 434/1988 atribuye la auditoría externa de las cuentas anuales al Tribunal de Cuentas y la asistencia jurídica al Servicio Jurídico del Estado, cuyo centro directivo es la Abogacía General del Estado-Dirección del Servicio Jurídico.',
    },
    distractors: [
      {
        text: 'La auditoría a la Intervención General del Estado y la asistencia jurídica al Consejo de Estado.',
        trap: 'wrong_competent_body',
        why: 'La Intervención General y el Consejo de Estado no son los órganos previstos para esas funciones.',
      },
      {
        text: 'La auditoría al Tribunal de Cuentas y la asistencia jurídica al Ministerio de Justicia.',
        trap: 'partial_rule_accuracy',
        why: 'La auditoría es correcta, pero la asistencia jurídica corresponde al Servicio Jurídico del Estado.',
      },
      {
        text: 'La auditoría a la Abogacía General del Estado y la asistencia jurídica al Tribunal Supremo.',
        trap: 'conceptual_merger',
        why: 'Invierte las funciones y atribuye la auditoría a un órgano de asistencia jurídica.',
      },
    ],
    legal: 'RD 434/1988, arts. 13.4 y 13.5',
    cluster: 'cluster_t4g_casa_real_control',
    difficulty: 3,
  },
  {
    stem: '¿Qué destino tienen en todo caso los regalos de carácter institucional recibidos por la Familia Real?',
    prompt: 'Distingue los regalos institucionales de los recibidos a título personal.',
    key: 'A',
    correct: {
      text: 'Se incorporan al Patrimonio Nacional.',
      rule: 'El RD 434/1988 dispone que los regalos de carácter institucional se incorporarán en todo caso al Patrimonio Nacional; los demás se registran, custodian y valoran por la Casa, que puede proponer su incorporación o donación a una entidad sin ánimo de lucro de fines de interés general.',
    },
    distractors: [
      {
        text: 'Se incorporan al patrimonio personal del Rey.',
        trap: 'wrong_legal_object',
        why: 'Los regalos institucionales no pasan al patrimonio personal del Rey.',
      },
      {
        text: 'Se donan a una entidad sin ánimo de lucro de interés general.',
        trap: 'conceptual_merger',
        why: 'La donación es una posibilidad para los regalos no institucionales; los institucionales van en todo caso a Patrimonio Nacional.',
      },
      {
        text: 'Se subastan y su importe se ingresa en el Tesoro Público.',
        trap: 'factual_misapplication',
        why: 'El RD 434/1988 no prevé la subasta ni el ingreso en el Tesoro para estos regalos.',
      },
    ],
    legal: 'RD 434/1988, disposición adicional única',
    cluster: 'cluster_t4g_casa_real_control',
    difficulty: 2,
  },
  {
    stem: 'Tras la reforma del Real Decreto 434/1988 en 2026, ¿qué Ministerio proporciona las capacidades TIC necesarias para la Jefatura del Estado?',
    prompt: 'Recuerda la reforma del art. 13.1 introducida por el RD 139/2026.',
    key: 'A',
    correct: {
      text: 'El Ministerio de Defensa.',
      rule: 'El art. 13.1 del RD 434/1988, en la redacción dada por el RD 139/2026, de 25 de febrero (BOE-A-2026-4514), atribuye al Ministerio de Defensa proporcionar las capacidades en el ámbito de las tecnologías de la información y de las comunicaciones necesarias para la Jefatura del Estado.',
    },
    distractors: [
      {
        text: 'El Ministerio de la Presidencia.',
        trap: 'wrong_competent_body',
        why: 'El Ministerio de la Presidencia interviene en el régimen retributivo de determinados funcionarios, no en las capacidades TIC de la Jefatura del Estado.',
      },
      {
        text: 'El Ministerio para la Transformación Digital.',
        trap: 'conceptual_merger',
        why: 'La reforma atribuye expresamente la función al Ministerio de Defensa.',
      },
      {
        text: 'El Ministerio del Interior.',
        trap: 'factual_misapplication',
        why: 'El Ministerio del Interior no es el órgano previsto por el art. 13.1 del RD 434/1988.',
      },
    ],
    legal: 'Art. 13.1 RD 434/1988, modificado por RD 139/2026 (BOE-A-2026-4514)',
    cluster: 'cluster_t4g_casa_real_control',
    difficulty: 3,
  },
  {
    stem: '¿Quién refrenda la propuesta y el nombramiento del Presidente del Gobierno y la disolución prevista en el artículo 99 CE?',
    prompt: 'Recuerda la excepción al refrendo ordinario del Presidente del Gobierno.',
    key: 'A',
    correct: {
      text: 'El Presidente del Congreso de los Diputados.',
      rule: 'El art. 64.1 CE atribuye al Presidente del Congreso el refrendo de la propuesta y el nombramiento del Presidente del Gobierno y de la disolución prevista en el artículo 99 CE.',
    },
    distractors: [
      {
        text: 'El Presidente del Gobierno en funciones, hasta que se celebre la investidura.',
        trap: 'conceptual_merger',
        why: 'El Presidente del Gobierno no puede refrendar su propia propuesta y nombramiento; para esos actos la Constitución llama al Presidente del Congreso.',
      },
      {
        text: 'El Ministro de la Presidencia, en su calidad de refrendante ordinario.',
        trap: 'wrong_competent_body',
        why: 'El refrendo ordinario corresponde al Presidente del Gobierno y, en su caso, a los Ministros competentes; este supuesto tiene un refrendante específico.',
      },
      {
        text: 'El Presidente del Senado, como representante de la Cámara territorial.',
        trap: 'factual_misapplication',
        why: 'La Constitución atribuye el refrendo al Presidente del Congreso, no al del Senado.',
      },
    ],
    legal: 'Art. 64.1 CE',
    cluster: 'cluster_t4g_jefatura_inviolabilidad',
    pair: 'pair_t4g_refrendo_pg_vs_congreso',
    difficulty: 2,
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
    id: `item-t4g-${index + 1}`,
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

export const seedItemsTema4General: Item[] = questionBank.map(makeItem);
