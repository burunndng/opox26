/**
 * Seed data for Seguridad Social Tema 3 (Bloque Especifico):
 * "La afiliacion y la inscripcion a la Seguridad Social".
 *
 * SOURCE OF TRUTH: slides `TEMA 3 ESPECIFICO.pdf` (D. Miguel Angel Munoz Ariza),
 * plus the normative instruments cited on those slides:
 *   - RD 84/1996 (RIA), incl. art. 32.3.2 as amended by RD 643/2026, de 29 de julio
 *   - RDLeg 8/2015 (TRLGSS)
 *   - Orden TAS/2865/2003 (Convenio Especial)
 *   - Ley 39/2015 (LPAC), Title V
 *
 * NOTE ON THE 3-DAY / 6-DAY CONFLICT:
 * The slides carry two different deadlines that are easy to merge. They are scoped
 * to different articles and both are reproduced here as separate items so the
 * distinction is testable:
 *   - Art. 28 RIA  -> variation of AFILIATION data (employer/worker, as filed) = 3 natural days.
 *   - Art. 32.3 RIA -> BOTH bajas and variations of data of TRABAJADORES = 6 natural days
 *                      after RD 643/2026 widened the former 3-day term.
 *
 * Options are deliberately not pre-lettered here: seedData.ts runs every standard
 * MCQ through `rebalanceCanonicalMcqOptions`, and grading resolves the answer via
 * `is_correct` (src/scoring/evaluateItem.ts), which travels with the option.
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

const TOPIC = 'topic_seguridad_social_tema_3';
const now = '2026-03-01T10:00:00Z';

export const seedTopicTema3: Topic = {
  id: TOPIC,
  name: 'Tema 3 Específico - La afiliación y la inscripción a la Seguridad Social',
  description:
    'BLOQUE ESPECÍFICO (ES). Afiliación e inscripción: caracteres de la afiliación, NUSS/CCC, altas, bajas y variaciones de datos, convenio especial, clases de alta, particularidades, actos indebidos e impugnaciones.',
  source_file: 'TEMA 3 ESPECIFICO.pdf',
  status: 'active',
  created_at: now,
  updated_at: now,
};

export const seedSourceChunksTema3: SourceChunk[] = [
  {
    id: 'chunk_tema3_1',
    topic_id: TOPIC,
    page_number: 6,
    article_reference: 'Arts. 7 y 15 TRLGSS',
    raw_text:
      'La afiliacion a la Seguridad Social es obligatoria y unica para toda su vida y para todo el sistema, sin perjuicio de las altas y bajas en los distintos regimenes. A peticion o de oficio. Resultado: obtencion del Numero de la Seguridad Social (NUSS) / Numero de Afiliacion (NAF).',
    summary: 'Obligatoriedad y unicidad vitalicia de la afiliacion; la afiliacion produce el NUSS/NAF.',
    order_index: 1,
  },
  {
    id: 'chunk_tema3_2',
    topic_id: TOPIC,
    page_number: 7,
    article_reference: 'Art. 138 TRLGSS',
    raw_text:
      'Los empresarios, como requisito previo e indispensable a la iniciacion de sus actividades, solicitaran su inscripcion en el Regimen General de la Seguridad Social. Resultado: obtencion del Codigo de Cuenta de Cotizacion (CCC).',
    summary: 'La inscripcion del empresario es previa e indispensable y produce el CCC.',
    order_index: 2,
  },
  {
    id: 'chunk_tema3_3',
    topic_id: TOPIC,
    page_number: 9,
    article_reference: 'Art. 6 RIA',
    raw_text:
      'La afiliacion al sistema de la Seguridad Social es obligatoria para todas las personas comprendidas en el campo de aplicacion; es unica y general para todos los Regimenes; se extiende a toda la vida; es exclusiva; y constituye titulo juridico para la adquisicion de derechos y el nacimiento de obligaciones.',
    summary: 'Los cinco caracteres de la afiliacion: obligatoria, unica y general, vitalicia, exclusiva y titulo juridico.',
    order_index: 3,
  },
  {
    id: 'chunk_tema3_4',
    topic_id: TOPIC,
    page_number: 12,
    article_reference: 'Arts. 24 a 28 RIA',
    raw_text:
      'Los datos facilitados al practicarse la afiliacion que experimenten variacion seran comunicados por el empresario y, en su caso, por el trabajador a cualquier direccion provincial de la TGSS dentro de los tres dias naturales siguientes a aquel en que la variacion se produzca.',
    summary: 'Variacion de datos de la AFILIACION: 3 dias naturales (art. 28 RIA).',
    order_index: 4,
  },
  {
    id: 'chunk_tema3_5',
    topic_id: TOPIC,
    page_number: 14,
    article_reference: 'Art. 7 RIA',
    raw_text:
      'Se considerara pluriactividad la situacion cuyas actividades den lugar a alta obligatoria en dos o mas Regimenes distintos. Se entendera por pluriempleo la situacion del trabajador por cuenta ajena que preste servicios profesionales a dos o mas empresas distintas y en actividades que den lugar al alta en un mismo Regimen.',
    summary: 'Pluriactividad = dos o mas Regimenes distintos. Pluriempleo = dos o mas empresas en un mismo Regimen.',
    order_index: 5,
  },
  {
    id: 'chunk_tema3_6',
    topic_id: TOPIC,
    page_number: 16,
    article_reference: 'Clases de alta',
    raw_text:
      'Alta real, alta asimilada (no total, solo respecto de las contingencias señaladas), alta presunta o de pleno derecho (presuncion iuris et de iure ante incumplimiento en AT/EP, desempleo, riesgo durante embarazo y lactancia, asistencia sanitaria) y alta especial (huelga y cierre patronal: el contrato esta suspendido y no hay obligacion de cotizar, generando derechos salvo incapacidad temporal y desempleo).',
    summary: 'Cuatro clases de alta y el alcance de cada una; la presuncion de alta es iuris et de iure.',
    order_index: 6,
  },
  {
    id: 'chunk_tema3_7',
    topic_id: TOPIC,
    page_number: 19,
    article_reference: 'Arts. 32.3 y 34.2 RIA (RD 643/2026)',
    raw_text:
      'Las solicitudes de alta deberan presentarse con caracter previo al comienzo de la prestacion de servicios, sin que en ningun caso puedan serlo antes de los 60 dias naturales anteriores al previsto para el inicio. Las solicitudes de baja y de variaciones de datos de los trabajadores deberan presentarse dentro del plazo de los seis dias naturales siguientes al del cese o a aquel en que la variacion se produzca.',
    summary: 'Alta: previa, nunca antes de 60 dias naturales. Baja y variacion de datos de trabajadores: 6 dias naturales.',
    order_index: 7,
  },
  {
    id: 'chunk_tema3_8',
    topic_id: TOPIC,
    page_number: 20,
    article_reference: 'Art. 35 RIA',
    raw_text:
      'Altas en plazo: efectos desde el dia en que se inicie la actividad. Altas fuera de plazo: efectos desde el dia en que se formule la solicitud, salvo que con autoliquidacion se haya ingresado en plazo reglamentario, en cuyo caso retrotra sus efectos a la fecha de ingreso de las primeras cuotas. Las solicitudes defectuosas surtiran efectos cuando se subsanen en el plazo de 10 dias. Las altas de oficio de la ITSS retrotraen a la fecha de la actuacion inspectora, salvo orden superior, entidades gestoras, denuncia, queja o peticion expresa, en cuyo caso retrotraen a la fecha en que se produjeron.',
    summary: 'Reglas de efectos del alta: en plazo, fuera de plazo con y sin autoliquidacion, defectuosa y de oficio.',
    order_index: 8,
  },
  {
    id: 'chunk_tema3_9',
    topic_id: TOPIC,
    page_number: 21,
    article_reference: 'Art. 36 RIA',
    raw_text:
      'Baja en plazo: efectos desde el cese en la prestacion de trabajo. Baja fuera de plazo: no se extinguira la obligacion de cotizar hasta el dia en que la TGSS conozca el cese; el interesado puede probar por medios admitidos en derecho que el cese ocurrio en otra fecha.',
    summary: 'Baja fuera de plazo: la obligacion de cotizar subsiste hasta que la TGSS conoce el cese.',
    order_index: 9,
  },
  {
    id: 'chunk_tema3_10',
    topic_id: TOPIC,
    page_number: 22,
    article_reference: 'Art. 37 RIA',
    raw_text:
      'Las variaciones comunicadas en tiempo y forma surtiran efectos desde el momento en que se producen. Fuera de plazo, desde el dia de la comunicacion, salvo que la variación tenga repercuscion en la cotizacion, en cuyo caso retrotra sus efectos al dia en que hubiera tenido lugar, procediendo reclamacion o devolucion de cuotas siempre que unas y otras no sean anteriores a los ultimos 4 anos.',
    summary: 'Variaciones de datos: efectos desde su produccion; con repercusion en cotizacion, retroaccion limitada a 4 anos.',
    order_index: 10,
  },
  {
    id: 'chunk_tema3_11',
    topic_id: TOPIC,
    page_number: 23,
    article_reference: 'Orden TAS/2865/2003, arts. 4 y 5',
    raw_text:
      'Para suscribir el convenio especial es necesario solicitarlo ante la direccion provincial de la TGSS en el plazo de 1 ano, y tener cubierto en la fecha de solicitud un periodo de 1.080 dias de cotizacion en los 12 anos inmediatamente anteriores a la baja (carencia).',
    summary: 'Convenio especial: plazo de solicitud de 1 ano y carencia de 1.080 dias en los 12 anos anteriores a la baja.',
    order_index: 11,
  },
  {
    id: 'chunk_tema3_12',
    topic_id: TOPIC,
    page_number: 24,
    article_reference: 'Orden TAS/2865/2003, art. 6',
    raw_text:
      'La notificacion sobre la procedencia de celebrar el convenio especial debera producirse dentro de los 3 meses siguientes a la entrada de la solicitud, considerandose la falta de resolucion expresa como estimacion por silencio administrativo positivo. El convenio se entendera suscrito si el interesado da su conformidad expresa o no se opene antes del ultimo dia del mes siguiente a la notificacion.',
    summary: 'Silencio positivo del convenio especial a los 3 meses; conformidad en el mes siguiente a la notificacion.',
    order_index: 12,
  },
  {
    id: 'chunk_tema3_13',
    topic_id: TOPIC,
    page_number: 25,
    article_reference: 'Orden TAS/2865/2003, art. 14',
    raw_text:
      'Si la solicitud se presenta dentro de los 90 dias naturales siguientes a la fecha del cese, el convenio especial surte efectos desde el dia siguiente a aquel en que produjo efectos la baja, pudiendo el suscriptor optar por la fecha de presentacion de la solicitud. Fuera de ese plazo, surte efectos desde el dia de la presentacion.',
    summary: 'Efectos del convenio especial: dia siguiente a la baja dentro de 90 dias naturales (con opcion), o desde la presentacion fuera de plazo.',
    order_index: 13,
  },
  {
    id: 'chunk_tema3_14',
    topic_id: TOPIC,
    page_number: 25,
    article_reference: 'Orden TAS/2865/2003, art. 15',
    raw_text:
      'La cotizacion del convenio especial cubre jubilación, incapacidad permanente derivada de enfermedad comun o accidente no laboral, y muerte y supervivencia derivada de enfermedad comun o accidente no laboral. Quedan excluidos los subsidios por incapacidad temporal, nacimiento y cuidado del menor, riesgo durante el embarazo y lactancia, asi como la proteccion por el desempleo, el FOGASA y la formacion profesional.',
    summary: 'Coberturas y exclusiones del convenio especial.',
    order_index: 14,
  },
  {
    id: 'chunk_tema3_15',
    topic_id: TOPIC,
    page_number: 26,
    article_reference: 'Orden TAS/2865/2003, arts. 18 y 19',
    raw_text:
      'El convenio especial queda suspendido durante los periodos de actividad que determinen encuadramiento en un Regimen cuya base sea inferior a la del convenio, salvo que el suscriptor manifieste expresamente que se extinga o siga vigente. Notificado dentro de los 10 dias naturales siguientes a la reanudacion, produce efectos desde el dia anterior a la incorporacion; fuera de plazo, desde la comunicacion. Se extingue por alta con base igual o superior (salvo pluriempleo o pluriactividad), pension de jubilacion o incapacidad permanente, falta de abono de 3 mensualidades consecutivas o 5 alternativas, fallecimiento o decision del interesado. El desplazamiento al extranjero no lo extingue.',
    summary: 'Suspension por base inferior y extincion del convenio especial; el extranjero no extingue.',
    order_index: 15,
  },
  {
    id: 'chunk_tema3_16',
    topic_id: TOPIC,
    page_number: 24,
    article_reference: 'Orden TAS/2865/2003, art. 12',
    raw_text:
      'Los cambios de bases de cotizacion posteriores a la suscripcion del convenio deberan efectuarse antes del dia 1 de octubre de cada ano y tendran efectos desde el dia 1 de enero del ano siguiente.',
    summary: 'Cambio de base de cotizacion del convenio: solicitud antes del 1 de octubre, efectos el 1 de enero siguiente.',
    order_index: 16,
  },
  {
    id: 'chunk_tema3_17',
    topic_id: TOPIC,
    page_number: 29,
    article_reference: 'Art. 16 RIA',
    raw_text:
      'Los documentos de asociacion y de cobertura de contingencias formalizados surtiran efectos desde el inicio de la actividad y mantendran su vigencia por el periodo de 1 ano, debiendo coincidir su vencimiento con el ultimo dia del mes; se entendran prorrogados automaticamente salvo denuncia en contrario por periodos de igual duracion o hasta el cese de la empresa si este tiene una duracion minima de 5 dias habiles.',
    summary: 'Vigencia 1 ano, vencimiento el ultimo dia del mes y prorroga automatica salvo denuncia; cese de 5 dias habiles.',
    order_index: 17,
  },
  {
    id: 'chunk_tema3_18',
    topic_id: TOPIC,
    page_number: 31,
    article_reference: 'Art. 17 RIA',
    raw_text:
      'La comunicacion de variaciones en los datos de la inscripcion se efectua en modelo oficial dentro del plazo de 3 dias naturales contados desde la fecha en que se produzcan, salvo que la variacion afecte a la entity gestora o colaboradora, en cuyo caso el documento acreditativo de la nueva opcion y la comunicacion del cese de la anterior se presentaran con una antelacion de 10 dias naturales a su efectividad.',
    summary: 'Variacion de datos de la empresa: 3 dias naturales; cambio de entidad gestora o colaboradora: 10 dias de antelacion.',
    order_index: 18,
  },
  {
    id: 'chunk_tema3_19',
    topic_id: TOPIC,
    page_number: 32,
    article_reference: 'Arts. 18 y 19 RIA',
    raw_text:
      'Los empresarios comunican la extincion de la empresa o el cese temporal o definitivo de su actividad dentro de los 3 dias naturales siguientes. En la sucesion en la titularidad o en la actividad de su centro de trabajo, la inscripcion de la sucesora y la anotacion en el Registro de Empresarios se solicitan dentro de los 6 dias naturales siguientes a aquel en que la sucesion se produzca. Sin sucesion formal, responsabilidad solidaria de la sucedida a la sucesora.',
    summary: 'Extincion o cese: 3 dias naturales. Sucesion: 6 dias naturales, con responsabilidad solidaria.',
    order_index: 19,
  },
  {
    id: 'chunk_tema3_20',
    topic_id: TOPIC,
    page_number: 38,
    article_reference: 'Art. 50 RIA',
    raw_text:
      'Respecto de los funcionarios publicos incluidos en el campo de aplicacion del Regimen General, en los casos de cambio de destino las altas surtiran efectos desde el dia primero del mes siguiente a aquel en que se produzca el cese y las bajas desde el ultimo dia del mes en que se produzca dicho cese.',
    summary: 'Funcionarios con cambio de destino: alta el dia 1 del mes siguiente y baja el ultimo dia del mes del cese.',
    order_index: 20,
  },
  {
    id: 'chunk_tema3_21',
    topic_id: TOPIC,
    page_number: 39,
    article_reference: 'Art. 51 RIA',
    raw_text:
      'En la contratacion de trabajadores agrarios por cuenta ajena eventuales o fijos discontinuos, el mismo dia en que comiencen su prestacion de servicios podran presentarse las solicitudes de alta hasta las 12 horas de dicho dia, cuando no haya sido posible formalizarse con anterioridad al inicio de la jornada.',
    summary: 'Agrarios eventuales y fijos discontinuos: alta admisible hasta las 12 horas del dia de inicio.',
    order_index: 21,
  },
  {
    id: 'chunk_tema3_22',
    topic_id: TOPIC,
    page_number: 43,
    article_reference: 'Art. 61 RIA',
    raw_text:
      'Cuando la baja sea declarada indebida por lesionar derechos fundamentales,.Reference: ser acordada por organo incompetente, ser de imposible contenido, ser constitutiva de infraccion penal, haberse dictado prescindiendo del procedimiento o ser contraria al ordenamiento por carecer de requisitos esenciales, el trabajador sera considerado en alta desde que concurriese dicha causa, subsistiendo la obligacion de cotizar. Por cualquier otra causa, sera considerado en alta desde que se iniciase el procedimiento administrativo que declaro indebida la baja.',
    summary: 'Baja indebida: alta retroactiva desde la causa grave, o desde el inicio del procedimiento en los demas casos.',
    order_index: 22,
  },
  {
    id: 'chunk_tema3_23',
    topic_id: TOPIC,
    page_number: 42,
    article_reference: 'Art. 60 RIA',
    raw_text:
      'El alta indebida en un Regimen de personas incluidas en el campo de aplicacion de otro Regimen distinto sera valida hasta la fecha que se fije en la resolucion que la declare indebida y, en su defecto, hasta el ultimo dia del mes de su notificacion; las cotizaciones efectuadas se computaran reciprocamente con las del Regimen de inclusion procedente. Si la persona no debe figurar en ninguno, se repone la situacion anterior y las cotizaciones no surtiren efecto.',
    summary: 'Alta indebida: computo reciproco si procede otro Regimen; reposicion sin efecto si no procede ninguno.',
    order_index: 23,
  },
  {
    id: 'chunk_tema3_24',
    topic_id: TOPIC,
    page_number: 45,
    article_reference: 'Art. 63 RIA y Ley 39/2015',
    raw_text:
      'En estas materias la TGSS tiene que dictar resolucion en el plazo maximo de 45 dias. Estos actos podran ser impugnados en la forma, plazos y demas condiciones establecidos en la legislacion comun: recurso de alzada (un mes, resolucion en tres meses, desestimacion por silencio), recurso potestativo de reposicion (un mes, resolucion en un mes) y recurso extraordinario de revision.',
    summary: 'Resolucion de la TGSS en 45 dias; recursos de alzada, reposicion y extraordinario de revision de la LPAC.',
    order_index: 24,
  },
];

export const seedClustersTema3: Cluster[] = [
  {
    id: 'cluster_afiliacion_caracteres',
    topic_id: TOPIC,
    name: 'Afiliación: caracteres, NUSS y formas de promover',
    type: 'conceptual',
    priority: 'critical',
    description:
      'Art. 6 RIA: obligatoria, unica y general, vitalicia, exclusiva y titulo juridico. Resultado: NUSS/NAF. Formas: a instancia del empresario, a peticion del trabajador o de oficio.',
  },
  {
    id: 'cluster_inscripcion_empresa',
    topic_id: TOPIC,
    name: 'Inscripción de empresas: CCC, documentos y plazos',
    type: 'procedural',
    priority: 'critical',
    description:
      'Inscripcion previa e indispensable (art. 138 TRLGSS), CCC principal y secundarios, documentos de asociacion y cobertura, y plazos de variacion, extincion y sucesion (arts. 16 a 19 RIA).',
  },
  {
    id: 'cluster_plazos_efectos_altas',
    topic_id: TOPIC,
    name: 'Altas y bajas: plazos de presentacion y fecha de efectos',
    type: 'numeric',
    priority: 'critical',
    description:
      'Ventana de 60 dias para el alta, 6 dias naturales para baja y variacion de datos de trabajadores, subsanacion en 10 dias y reglas de efecto retroactivo (arts. 32 a 37 RIA).',
  },
  {
    id: 'cluster_convenio_especial',
    topic_id: TOPIC,
    name: 'Convenio especial: requisitos, efectos, coberturas y extinción',
    type: 'exception',
    priority: 'critical',
    description:
      'Orden TAS/2865/2003: carencia de 1.080 dias en 12 anos, solicitud en 1 ano, silencio positivo a 3 meses, efectos en 90 dias, coberturas excluidas, suspension y extincion por impago de 3/5.',
  },
  {
    id: 'cluster_clases_alta',
    topic_id: TOPIC,
    name: 'Clases de alta y encuadramientos multiples',
    type: 'classification',
    priority: 'high',
    description:
      'Alta real, asimilada, presunta iuris et de iure y especial (huelga y cierre patronal). Pluriempleo vs pluriactividad.',
  },
  {
    id: 'cluster_particularidades',
    topic_id: TOPIC,
    name: 'Particularidades: funcionarios, agrarios, cooperativas y taurinos',
    type: 'procedural',
    priority: 'medium',
    description:
      'Cambio de destino de funcionarios (efectos a fin y principio de mes), ventana de 12 horas para agrarios eventuales, encuadramento de socios de cooperativas y censura de activos taurinos.',
  },
  {
    id: 'cluster_actos_indebidos_impugnaciones',
    topic_id: TOPIC,
    name: 'Actos indebidos y vias de impugnacion',
    type: 'exception',
    priority: 'high',
    description:
      'Efectos de afiliacion, alta, baja, formalizacion y variacion indebidas (arts. 57 a 62 RIA) y recursos de alzada, reposicion y extraordinario de revision.',
  },
];

export const seedConfusionPairsTema3: ConfusionPair[] = [
  {
    id: 'pair_nuss_vs_ccc',
    topic_id: TOPIC,
    concept_a: 'Afiliacion del trabajador -> NUSS / NAF',
    concept_b: 'Inscripcion de la empresa -> CCC',
    discriminating_cue:
      'La afiliacion identifica a la persona fisica en el sistema con caracter vitalicio (NUSS/NAF); la inscripcion individualiza al empresario con un numero unico que constituye su primer y principal CCC.',
    common_trap:
      'Invertir ambos identificadores: afirmar que la afiliacion produce el CCC o que la inscripcion produce el NUSS.',
    legal_basis_a: 'Arts. 7 y 15 TRLGSS; arts. 21 a 28 RIA',
    legal_basis_b: 'Art. 138 TRLGSS; art. 16 RIA',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_variacion_afiliacion_3d_vs_baja_variacion_6d',
    topic_id: TOPIC,
    concept_a: 'Variacion de datos de la AFILIACION: 3 dias naturales (art. 28 RIA)',
    concept_b: 'Baja y variacion de datos de los TRABAJADORES: 6 dias naturales (art. 32.3 RIA, RD 643/2026)',
    discriminating_cue:
      'El art. 28 regula los datos facilitados al practicarse la afiliacion (3 dias). El art. 32.3 regula las solicitudes de alta, baja y variacion de datos de los trabajadores en el Regimen (6 dias tras RD 643/2026).',
    common_trap:
      'Aplicar un unico plazo a ambos supuestos, especialmente responder 3 dias a la baja o 6 dias a la variacion de afiliacion.',
    legal_basis_a: 'Art. 28 RIA',
    legal_basis_b: 'Art. 32.3.2 RIA, modificado por RD 643/2026',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_pluriempleo_vs_pluriactividad',
    topic_id: TOPIC,
    concept_a: 'Pluriempleo',
    concept_b: 'Pluriactividad',
    discriminating_cue:
      'Pluriempleo: trabajador por cuenta ajena, dos o mas empresas distintas, alta en un mismo Regimen. Pluriactividad: actividades que dan lugar a alta obligatoria en dos o mas Regimenes distintos.',
    common_trap:
      'Confundir el numero de empresas con el numero de Regimenes: llamar pluriactividad al pluriempleo.',
    legal_basis_a: 'Art. 7 RIA',
    legal_basis_b: 'Art. 7 RIA',
    severity: 'high',
    status: 'validated',
  },
  {
    id: 'pair_alta_presunta_vs_presuncion_laboralidad',
    topic_id: TOPIC,
    concept_a: 'Presuncion de alta (iuris et de iure)',
    concept_b: 'Presuncion de laboralidad (iuris tantum)',
    discriminating_cue:
      'La falta de alta se presume iuris et de iure y no admite prueba en contra para las contingencias señaladas; en cambio, la presuncion de laboralidad es iuris tantum y admite prueba en contrario.',
    common_trap:
      'Afirmar que ambas presunciones son iuris tantum o que la presuncion de alta admite prueba en contrario.',
    legal_basis_a: 'Art. 166 TRLGSS y doctrina del alta de pleno derecho',
    legal_basis_b: 'Art. 1.1 ET',
    severity: 'high',
    status: 'validated',
  },
  {
    id: 'pair_convenio_suspension_vs_extincion',
    topic_id: TOPIC,
    concept_a: 'Convenio especial suspendido (base inferior)',
    concept_b: 'Convenio especial extinguido (base igual o superior)',
    discriminating_cue:
      'Si la base del nuevo alta es INFERIOR a la del convenio, este queda suspendido; si es IGUAL o SUPERIOR, se extingue, salvo pluriempleo o pluriactividad.',
    common_trap:
      'Invertir el criterio de la base, o afirmar que cualquier alta extingue el convenio.',
    legal_basis_a: 'Orden TAS/2865/2003, art. 18',
    legal_basis_b: 'Orden TAS/2865/2003, art. 19.1',
    severity: 'critical',
    status: 'validated',
  },
  {
    id: 'pair_baja_indeada_causa_grave_vs_ordinaria',
    topic_id: TOPIC,
    concept_a: 'Baja indebida por causa grave (vicios del acto)',
    concept_b: 'Baja indebida por causa ordinaria',
    discriminating_cue:
      'En los supuestos graves (lesion de derechos fundamentales, organo incompetente, imposible contenido, infraccion penal, ausencia de procedimiento o falta de requisitos esenciales) el alta se retrotrae a la fecha en que concurrio la causa; en los demas casos el alta es desde el inicio del procedimiento.',
    common_trap:
      'Aplicar a toda baja indebida la fecha del inicio del procedimiento, ignorando la retroaccion a la causa grave.',
    legal_basis_a: 'Art. 61.1 RIA',
    legal_basis_b: 'Art. 61.2 RIA',
    severity: 'high',
    status: 'validated',
  },
];

export const seedAtomsTema3: Atom[] = [
  {
    id: 'atom-t3-1',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'La afiliacion a la Seguridad Social es obligatoria, unica y general para todos los Regimenes, se extiende a toda la vida, es exclusiva y constituye titulo juridico para la adquisicion de derechos y el nacimiento de obligaciones.',
    legal_basis: 'Art. 6 RIA',
    cluster_id: 'cluster_afiliacion_caracteres',
    tags: ['afiliacion', 'caracteres', 'obligatoria', 'unica', 'vitalicia', 'exclusiva', 'titulo_juridico'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-2',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'La afiliacion tiene por resultado la obtencion del Numero de la Seguridad Social (NUSS) o Numero de Afiliacion (NAF), de caracter vitalicio y valido para todo el territorio nacional.',
    legal_basis: 'Arts. 7 y 15 TRLGSS; arts. 21 a 28 RIA',
    cluster_id: 'cluster_afiliacion_caracteres',
    tags: ['NUSS', 'NAF', 'identificador', 'vitalicio'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t3-3',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'La inscripcion del empresario en el Regimen General es un requisito previo e indispensable a la iniciacion de sus actividades y produce un numero unico de inscripcion que constituye su primer y principal Codigo de Cuenta de Cotizacion (CCC).',
    legal_basis: 'Art. 138 TRLGSS; art. 16 RIA',
    cluster_id: 'cluster_inscripcion_empresa',
    tags: ['inscripcion', 'empresario', 'CCC', 'requisito_previo'],
    difficulty: 1,
    status: 'validated',
  },
  {
    id: 'atom-t3-4',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'Las solicitudes de alta se presentan con caracter previo al comienzo de la prestacion de servicios, sin que puedan serlo antes de los 60 dias naturales anteriores al previsto inicio.',
    legal_basis: 'Art. 32.3.1 RIA',
    cluster_id: 'cluster_plazos_efectos_altas',
    tags: ['alta', 'plazo', '60_dias', 'previo'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-5',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'Las solicitudes de baja y de variaciones de datos de los trabajadores se presentan dentro de los seis dias naturales siguientes al del cese en el trabajo o a aquel en que la variacion se produzca.',
    legal_basis: 'Art. 32.3.2 RIA, modificado por RD 643/2026',
    cluster_id: 'cluster_plazos_efectos_altas',
    tags: ['baja', 'variacion', 'plazo', '6_dias'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-6',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'La comunicacion de variaciones en los datos de la inscripcion del empresario se efectua en modelo oficial dentro de los tres dias naturales contados desde la fecha en que se produzcan.',
    legal_basis: 'Art. 17 RIA',
    cluster_id: 'cluster_inscripcion_empresa',
    tags: ['variacion_empresa', '3_dias', 'modelo_oficial'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-7',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'Cuando la variacion de datos de la empresa afecte a la entidad gestora o colaboradora, el documento acreditativo de la nueva opcion y la comunicacion del cese de la anterior se presentan con una antelacion de 10 dias naturales a su efectividad.',
    legal_basis: 'Art. 17 RIA',
    cluster_id: 'cluster_inscripcion_empresa',
    tags: ['mutua', 'gestora', 'colaboradora', '10_dias', 'antelacion'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-8',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Las altas fuera de plazo surtiran efectos desde el dia en que se formule la solicitud, salvo que, por aplicarse la autoliquidacion, se hayan ingresado las cuotas en plazo reglamentario, en cuyo caso retrotra sus efectos a la fecha de ingreso de las primeras cuotas.',
    legal_basis: 'Art. 35 RIA',
    cluster_id: 'cluster_plazos_efectos_altas',
    tags: ['alta_fuera_plazo', 'autoliquidacion', 'efectos', 'retroaccion'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-9',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'La baja fuera de plazo no extingue la obligacion de cotizar hasta el dia en que la TGSS conozca el cese en el trabajo o la terminacion de la situacion determinante de la inclusion.',
    legal_basis: 'Art. 36 RIA',
    cluster_id: 'cluster_plazos_efectos_altas',
    tags: ['baja_fuera_plazo', 'cotizacion', 'TGSS', 'conocimiento'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-10',
    topic_id: TOPIC,
    atom_type: 'number',
    text: 'Las variaciones queno se comunican en tiempo y forma surtiran efectos desde el dia de la comunicacion; si ademas la variacion tiene repercusion en la cotizacion, retrotra sus efectos al dia en que hubiera tenido lugar, siempre que las cuotas no sean anteriores a los ultimos 4 anos.',
    legal_basis: 'Art. 37 RIA',
    cluster_id: 'cluster_plazos_efectos_altas',
    tags: ['variacion', 'cotizacion', 'retroaccion', '4_anos'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-11',
    topic_id: TOPIC,
    atom_type: 'condition',
    text: 'Para suscribir el convenio especial es necesario tener cubierto, en la fecha de solicitud, un periodo de 1.080 dias de cotizacion en los 12 anos inmediatamente anteriores a la baja en el Regimen de que se trate.',
    legal_basis: 'Orden TAS/2865/2003',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', 'carencia', '1080_dias', '12_anos'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-12',
    topic_id: TOPIC,
    atom_type: 'procedure',
    text: 'La solicitud del convenio especial se presenta ante la direccion provincial de la TGSS en el plazo de 1 ano; la TGSS notifica sobre su procedencia dentro de los 3 meses siguientes, y la falta de resolucion se entiende como estimacion por silencio administrativo positivo.',
    legal_basis: 'Orden TAS/2865/2003, arts. 5 y 6',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', '1_ano', '3_meses', 'silencio_positivo'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-13',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Presentada la solicitud del convenio especial dentro de los 90 dias naturales siguientes a la fecha del cese, surte efectos desde el dia siguiente a aquel en que produjo efectos la baja, pudiendo el suscriptor optar por la fecha de presentacion.',
    legal_basis: 'Orden TAS/2865/2003, art. 14',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', '90_dias', 'efectos', 'dia_siguiente'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-14',
    topic_id: TOPIC,
    atom_type: 'right',
    text: 'El convenio especial cubre jubilacion, incapacidad permanente por enfermedad comun o accidente no laboral y muerte y supervivencia por enfermedad comun o accidente no laboral; excluye incapacidad temporal, nacimiento y cuidado del menor, riesgo durante embarazo y lactancia, desempleo, FOGASA y formacion profesional.',
    legal_basis: 'Orden TAS/2865/2003, art. 15',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', 'coberturas', 'exclusiones', 'FOGASA'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-15',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'El convenio especial queda suspendido durante los periodos de actividad que determinen un encuadramiento con base inferior a la del convenio; notificado dentro de los 10 dias naturales siguientes a la reanudacion, produce efectos desde el dia anterior a la incorporacion.',
    legal_basis: 'Orden TAS/2865/2003, art. 18',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', 'suspension', 'base_inferior', '10_dias'],
    difficulty: 4,
    status: 'validated',
  },
  {
    id: 'atom-t3-16',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'El convenio especial se extingue por alta con base de cotizacion igual o superior a la del convenio (salvo pluriempleo o pluriactividad), por.condition de pensionista de jubilacion o incapacidad permanente, por falta de abono de 3 mensualidades consecutivas o 5 alternativas, por fallecimiento o por decision del interesado; no se extingue por desplazamiento al extranjero.',
    legal_basis: 'Orden TAS/2865/2003, art. 19',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', 'extincion', '3_5_mensualidades', 'extranjero'],
    difficulty: 4,
    status: 'validated',
  },
  {
    id: 'atom-t3-17',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'Los cambios de bases de cotizacion posteriores a la suscripcion del convenio especial deberan efectuarse antes del dia 1 de octubre de cada ano y tendran efectos desde el dia 1 de enero del ano siguiente.',
    legal_basis: 'Orden TAS/2865/2003, art. 12',
    cluster_id: 'cluster_convenio_especial',
    tags: ['convenio_especial', 'base', '1_octubre', '1_enero'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-18',
    topic_id: TOPIC,
    atom_type: 'definition',
    text: 'Se considerara pluriactividad la situacion cuyas actividades den lugar a alta obligatoria en dos o mas Regimenes distintos, y pluriempleo la del trabajador por cuenta ajena que preste servicios a dos o mas empresas distintas con alta en un mismo Regimen.',
    legal_basis: 'Art. 7 RIA',
    cluster_id: 'cluster_clases_alta',
    tags: ['pluriactividad', 'pluriempleo', 'encuadramiento_multiple'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-19',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Ante el incumplimiento del alta, la ley presume iuris et de iure la existencia efectiva del alta a efectos de accidentes de trabajo y enfermedades profesionales, desempleo, riesgo durante embarazo y lactancia y asistencia sanitaria, aplicandose el principio de automaticidad de las prestaciones.',
    legal_basis: 'Art. 166 TRLGSS y alta de pleno derecho',
    cluster_id: 'cluster_clases_alta',
    tags: ['alta_presunta', 'iuris_et_de_iure', 'automaticidad', 'AT_EP', 'desempleo'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-20',
    topic_id: TOPIC,
    atom_type: 'exception',
    text: 'En los casos legales de huelga y cierre patronal se genera alta especial, equiparable a la asimilada: el contrato esta suspendido y no hay obligacion de cotizar, pero se generan derechos a prestaciones salvo incapacidad temporal y desempleo.',
    legal_basis: 'Doctrina del alta especial; TRLGSS',
    cluster_id: 'cluster_clases_alta',
    tags: ['alta_especial', 'huelga', 'cierre_patronal', 'IT', 'desempleo'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-21',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'En el cambio de destino de los funcionarios incluidos en el Regimen General, el alta surte efectos desde el dia primero del mes siguiente al cese y la baja desde el ultimo dia del mes en que se produce el cese.',
    legal_basis: 'Art. 50 RIA',
    cluster_id: 'cluster_particularidades',
    tags: ['funcionarios', 'cambio_destino', 'efectos', 'mes'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-22',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'En la contratacion de trabajadores agrarios por cuenta ajena eventuales o fijos discontinuos, el mismo dia en que comiencen la prestacion de servicios pueden presentarse las solicitudes de alta hasta las 12 horas de dicho dia, si no fue posible formalizarlas antes.',
    legal_basis: 'Art. 51 RIA',
    cluster_id: 'cluster_particularidades',
    tags: ['agrarios', 'eventual', 'fijo_discontinuo', '12_horas'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-23',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'La resolucion que declara indebida una baja por causa grave (derechos fundamentales, organo incompetente, imposible contenido, infraccion penal, ausencia de procedimiento o falta de requisitos esenciales) retrotrae el alta desde que concurrio la causa; por cualquier otra causa, el alta se situa desde el inicio del procedimiento.',
    legal_basis: 'Art. 61 RIA',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    tags: ['baja_indeada', 'causa_grave', 'retroaccion', 'procedimiento'],
    difficulty: 4,
    status: 'validated',
  },
  {
    id: 'atom-t3-24',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'El alta indebida en un Regimen de persona incluida en otro Regimen distinto es valida hasta la fecha de la resolucion que la declara indebida y, en su defecto, hasta el ultimo dia del mes de su notificacion, computandose reciprocamente las cotizaciones con las del Regimen procedente.',
    legal_basis: 'Art. 60 RIA',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    tags: ['alta_indeada', 'otro_regimen', 'cómputo_reciproco'],
    difficulty: 4,
    status: 'validated',
  },
  {
    id: 'atom-t3-25',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'En las materias de afiliacion, altas, bajas y variaciones, la TGSS debe dictar resolucion en el plazo maximo de 45 dias; los actos son impugnables conforme a la legislacion comun.',
    legal_basis: 'Art. 63 RIA; Ley 39/2015',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    tags: ['resolucion', '45_dias', 'impugnacion', 'LPAC'],
    difficulty: 2,
    status: 'validated',
  },
  {
    id: 'atom-t3-26',
    topic_id: TOPIC,
    atom_type: 'legal_effect',
    text: 'Los documentos de asociacion y de cobertura de contingencias de la empresa mantienen vigencia de 1 ano, con vencimiento el ultimo dia del mes, y se prorrogan automaticamente salvo denuncia en contrario.',
    legal_basis: 'Art. 16 RIA',
    cluster_id: 'cluster_inscripcion_empresa',
    tags: ['documentos', 'asociacion', 'cobertura', '1_ano', 'prorroga'],
    difficulty: 3,
    status: 'validated',
  },
  {
    id: 'atom-t3-27',
    topic_id: TOPIC,
    atom_type: 'deadline',
    text: 'La extincion de la empresa o el cese temporal o definitivo de su actividad se comunica dentro de los 3 dias naturales siguientes; en la sucesion de titularidad, la inscripcion de la sucesora se solicita dentro de los 6 dias naturales siguientes.',
    legal_basis: 'Arts. 18 y 19 RIA',
    cluster_id: 'cluster_inscripcion_empresa',
    tags: ['extincion_empresa', '3_dias', 'sucesion', '6_dias', 'solidaridad'],
    difficulty: 3,
    status: 'validated',
  },
];

/**
 * Terse builder so every MCQ stays uniform and reviewable.
 * `correct` carries the single right option; each distractor must explain both
 * why it is wrong and under what (counterfactual) condition it would be right.
 */
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
}

function buildMcq(spec: McqSpec): Item {
  const letters = ['A', 'B', 'C', 'D'];
  const options: MCQOption[] = [
    {
      id: letters[0],
      text: spec.correct.text,
      is_correct: true,
      trap_type: 'partial_rule_accuracy',
      explanation: spec.correct.explanation,
      condition_if_correct: 'Correcto con arreglo a la norma vigente.',
    },
    ...spec.distractors.map((d, i) => ({
      id: letters[i + 1],
      text: d.text,
      is_correct: false,
      trap_type: d.trap_type,
      explanation: d.explanation,
      condition_if_correct: d.condition_if_correct,
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
    created_at: now,
    updated_at: now,
  };
}

export const seedItemsTema3: Item[] = [
  buildMcq({
    id: 'item-t3-1',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'La solicitud de alta de un trabajador por cuenta ajena se tramita con carácter previo a la actividad, pero nunca con una antelación superior a:',
    prompt_before_options: 'Reproduce la ventana temporal exacta antes de mirar las opciones.',
    correct: {
      text: '60 días naturales anteriores al inicio previsto.',
      explanation:
        'El art. 32.3 RIA establece que las solicitudes de alta se presentan con carácter previo al comienzo de la prestación, sin que en ningún caso puedan serlo antes de los 60 días naturales anteriores al previsto inicio.',
    },
    distractors: [
      {
        text: '30 días naturales anteriores al inicio previsto.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. La ventana es de 60 días naturales, no de 30.',
        condition_if_correct: 'Si el plazo refundido fuera de 30 días naturales.',
      },
      {
        text: '90 días naturales anteriores al inicio previsto.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. Los 90 días naturales son la ventana de efectos retroactivos del convenio especial, no la antelación máxima del alta.',
        condition_if_correct: 'Si se preguntara por la ventana de solicitud del convenio especial.',
      },
      {
        text: '15 días hábiles anteriores al inicio previsto.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. El plazo se mide en días naturales, no hábiles.',
        condition_if_correct: 'Si el cómputo estuviera expresado en días hábiles.',
      },
    ],
    legal_basis: 'Art. 32.3.1 RIA (RD 84/1996)',
    rule_statement: 'El alta se presenta antes del inicio, pero nunca antes de los 60 días naturales previos.',
    corrective_rule:
      'Mnemotecnia: "Previa, nunca anticipada": alta antes del inicio, con tope de 60 días naturales de antelación.',
    difficulty: 2,
    cognitive_operations: ['generative_retrieval', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-2',
    cluster_id: 'cluster_plazos_efectos_altas',
    confusion_pair_id: 'pair_variacion_afiliacion_3d_vs_baja_variacion_6d',
    stem: 'Las solicitudes de baja y de variaciones de datos de los trabajadores en el Régimen de Seguridad Social deben presentarse dentro del plazo de:',
    prompt_before_options: 'Distingue primero el artículo: ¿art. 28 o art. 32.3 del Reglamento?',
    correct: {
      text: 'Seis días naturales siguientes al cese en el trabajo o a la variación producida.',
      explanation:
        'El art. 32.3.2 RIA, modificado por el RD 643/2026, de 29 de julio, amplía a seis días naturales el plazo para las solicitudes de baja y de variaciones de datos de los trabajadores.',
    },
    distractors: [
      {
        text: 'Tres días naturales siguientes al cese en el trabajo o a la variación producida.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. Fue el plazo anterior (pre-RD 643/2026) y sigue siendo el de la variación de datos de la AFILIACIÓN (art. 28 RIA), no el de baja y variación de datos del trabajador.',
        condition_if_correct: 'Si se preguntara por la variación de datos de la afiliación (art. 28 RIA) o por el régimen anterior al RD 643/2026.',
      },
      {
        text: 'Diez días naturales siguientes al cese en el trabajo o a la variación producida.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. Los diez días naturales son la antelación para cambiar de entidad gestora o colaboradora (art. 17 RIA) y el plazo de subsanación.',
        condition_if_correct: 'Si se preguntara por el cambio de entidad gestora o por la subsanación.',
      },
      {
        text: 'Quince días hábiles siguientes al cese en el trabajo o a la variación producida.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. El plazo es en días naturales y de seis días.',
        condition_if_correct: 'Si el cómputo estuviera en días hábiles y el plazo fuera de quince.',
      },
    ],
    legal_basis: 'Art. 32.3.2 RIA, modificado por RD 643/2026',
    rule_statement: 'Baja y variación de datos de trabajadores: 6 días naturales tras el RD 643/2026.',
    corrective_rule:
      'Regla de desambiguación: si el enunciado habla de BAJA o de variación de datos de TRABAJADORES en alta -> 6 días (art. 32.3). Si habla de variación de datos de la AFILIACIÓN -> 3 días (art. 28).',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'micro_discrimination', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-3',
    cluster_id: 'cluster_inscripcion_empresa',
    stem: 'El empresario comunica a la TGSS la variación de los datos consignados en su inscripción de empresa:',
    correct: {
      text: 'En modelo oficial, dentro de los 3 días naturales contados desde su producción.',
      explanation:
        'Conforme al art. 17 RIA, la comunicación de variaciones en los datos de la inscripción se efectúa en modelo oficial dentro de los tres días naturales desde que se produzcan.',
    },
    distractors: [
      {
        text: 'En los 6 días naturales siguientes, por ser el plazo general de toda comunicación.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. Los seis días son el plazo de baja y variación de datos de los trabajadores (art. 32.3), no de los datos de la inscripción del empresario.',
        condition_if_correct: 'Si se preguntara por la variación de datos de un trabajador.',
      },
      {
        text: 'Con una antelación de 10 días naturales respecto de su efectividad.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. La antelación de diez días se reserva al cambio de entidad gestora o colaboradora.',
        condition_if_correct: 'Si la variación afectase a la entidad gestora o colaboradora.',
      },
      {
        text: 'Dentro del mes natural siguiente al de la variación producida.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo es de tres días naturales.',
        condition_if_correct: 'Si el plazo legal fuera de un mes.',
      },
    ],
    legal_basis: 'Art. 17 RIA',
    rule_statement: 'Variación de datos de la inscripción del empresario: modelo oficial en 3 días naturales.',
    corrective_rule:
      'Tres datos de empresa (variación 3 días; gestoras 10 días de antelación; extinción/cese 3 días).',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-4',
    cluster_id: 'cluster_inscripcion_empresa',
    stem: 'El cambio de entidad gestora o colaboradora para la protección de contingencias profesionales exige presentar el documento acreditativo de la nueva opción y la comunicación del cese de la anterior:',
    correct: {
      text: 'Con una antelación de 10 días naturales a la fecha de su efectividad.',
      explanation:
        'El art. 17 RIA exige presentar el documento y la comunicación del cese de la anterior con diez días naturales de antelación a la efectividad del cambio de entidad gestora o colaboradora.',
    },
    distractors: [
      {
        text: 'En los 3 días naturales siguientes al que se produzca el cambio.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Ese es el plazo general de variación, pero aquí se exige antelación, no plazo posterior.',
        condition_if_correct: 'Si no se tratara de un cambio de entidad gestoras o colaboradora.',
      },
      {
        text: 'En los 6 días naturales siguientes al que se produzca el cambio.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Los seis días son de baja y variación de datos de trabajadores.',
        condition_if_correct: 'Si se preguntara por baja o variación de datos del trabajador.',
      },
      {
        text: 'Con un plazo de un mes de antelación a su efectividad.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. La antelación exigida es de diez días naturales.',
        condition_if_correct: 'Si la antelación legal fuera de un mes.',
      },
    ],
    legal_basis: 'Art. 17 RIA',
    rule_statement: 'Cambio de entidad gestora o colaboradora: 10 días naturales de antelación.',
    corrective_rule:
      'Regla: el cambio de gestoras/colaboradoras es el ÚNICO supuesto de la inscripción de empresa que se presenta ANTES (antelación), no después.',
    difficulty: 3,
    cognitive_operations: ['micro_discrimination', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t3-5',
    cluster_id: 'cluster_inscripcion_empresa',
    stem: 'La extinción de la empresa o el cese temporal o definitivo de su actividad se comunica a la TGSS:',
    correct: {
      text: 'Dentro de los 3 días naturales siguientes a aquel en que se produzca.',
      explanation:
        'El art. 18 RIA obliga a comunicar la extinción de la empresa o el cese de su actividad en modelo oficial dentro de los tres días naturales siguientes.',
    },
    distractors: [
      {
        text: 'Dentro de los 6 días naturales siguientes a aquel en que se produzca.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. Los seis días son de baja de trabajadores y de sucesión de titularidad, no del cese de la actividad de la empresa.',
        condition_if_correct: 'Si se preguntara por baja de trabajador o sucesión de titularidad.',
      },
      {
        text: 'Dentro de los 10 días naturales siguientes a aquel en que se produzca.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo de cese de empresa es de tres días naturales.',
        condition_if_correct: 'Si el plazo legal fuera de diez días.',
      },
      {
        text: 'En los 5 días hábiles siguientes a aquel en que se produzca.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. Los cinco días hábiles son la duración mínima del cese para que se extinga la cobertura de los documentos de asociación, no el plazo de comunicación.',
        condition_if_correct: 'Si se preguntara por la duración mínima del cese para cortar la prórroga.',
      },
    ],
    legal_basis: 'Art. 18 RIA',
    rule_statement: 'Extinción o cese de la actividad de la empresa: 3 días naturales.',
    corrective_rule: 'No confundas plazo de comunicación (3 días) con condición de cese para prorroga (5 días hábiles).',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-6',
    cluster_id: 'cluster_inscripcion_empresa',
    stem: 'Cambia la titularidad de una empresa sin formalizar el cambio. La inscripción de la sucesora y su anotación en el Registro de Empresarios deben efectuarse en el plazo de:',
    correct: {
      text: 'Seis días naturales siguientes a aquel en que se produzca la sucesión.',
      explanation:
        'El art. 19 RIA establece que la inscripción de la sucesora y la anotación en el Registro de Empresarios deben solicitarse dentro de los seis días naturales siguientes a la sucesión.',
    },
    distractors: [
      {
        text: 'Tres días naturales siguientes a aquel en que se produzca la sucesión.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. Tres días son para el cese de la actividad, no para la sucesión de titularidad.',
        condition_if_correct: 'Si se preguntara por cese o extinción de la actividad.',
      },
      {
        text: 'Diez días naturales siguientes a aquel en que se produzca la sucesión.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo de sucesión es de seis días naturales.',
        condition_if_correct: 'Si el plazo legal fuera de diez días.',
      },
      {
        text: 'Un mes siguiente a aquel en que se produzca la sucesión de titularidad.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo es de seis días naturales.',
        condition_if_correct: 'Si el plazo legal fuera de un mes.',
      },
    ],
    legal_basis: 'Art. 19 RIA',
    rule_statement: 'Sucesión de titularidad: 6 días naturales; sin sucesión formal, responsabilidad solidaria.',
    corrective_rule: 'Cesе = 3 días. Sucesión = 6 días. No intercambies los plazos.',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-7',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'Si la solicitud de alta (o de inscripción) es defectuosa, los efectos surviven cuando se subsanan los datos omitidos en el plazo de:',
    correct: {
      text: '10 días.',
      explanation:
        'Las solicitudes defectuosas surtirán efectos cuando se subsanen dentro del plazo de diez días los datos o documentos omitidos y requeridos.',
    },
    distractors: [
      {
        text: '5 días.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo de subsanación es de diez días.',
        condition_if_correct: 'Si el plazo de subsanación fuera de cinco días.',
      },
      {
        text: '15 días.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo es de diez días.',
        condition_if_correct: 'Si el plazo legal fuera de quince días.',
      },
      {
        text: '3 días.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. Tres días es el plazo de variación de datos de la inscripción del empresario o de la afiliación, no de subsanación.',
        condition_if_correct: 'Si se preguntara por variación de datos de empresa o de afiliación.',
      },
    ],
    legal_basis: 'Art. 35 RIA; art. 16 RIA (inscripción)',
    rule_statement: 'Solicitud defectuosa: subsanación en 10 días para que surta efectos.',
    corrective_rule: 'Diez días = subsanación de solicitud defectuosa (y también antelación de cambio de gestoras).',
    difficulty: 2,
    cognitive_operations: ['numeric_precision', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-8',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    stem: 'En las materias de afiliación, altas, bajas e inscripción, la TGSS debe dictar resolución expresa en el plazo máximo de:',
    correct: {
      text: '45 días.',
      explanation: 'En estas materias la TGSS tiene que dictar resolución en el plazo máximo de 45 días.',
    },
    distractors: [
      {
        text: '30 días.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo máximo es de 45 días.',
        condition_if_correct: 'Si el plazo legal fuera de treinta días.',
      },
      {
        text: '3 meses.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. Tres meses es el plazo de notificación del convenio especial y de resolución del recurso de alzada, no de estos actos.',
        condition_if_correct: 'Si se preguntara por el convenio especial o por un recurso de alzada.',
      },
      {
        text: '10 días.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El plazo es de 45 días.',
        condition_if_correct: 'Si el plazo legal fuera de diez días.',
      },
    ],
    legal_basis: 'Art. 63 RIA',
    rule_statement: 'Resolución de la TGSS en estas materias: 45 días.',
    corrective_rule: '45 días = resolución TGSS (afiliación/altas/bajas). 3 meses = convenio especial.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-9',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'Una variación de datos del trabajador, comunicada fuera de plazo, que tuvo repercusión en la cotización, retrotrae sus efectos al día en que se produjo, siempre que las cuotas no sean anteriores a:',
    correct: {
      text: 'Los últimos 4 años.',
      explanation:
        'Cuando la variación producida en fecha anterior tuvo repercusión en la cotización, retrotrae sus efectos al día en que hubiera tenido lugar, procediendo la reclamación o devolución de cuotas siempre que no sean anteriores a los últimos cuatro años.',
    },
    distractors: [
      {
        text: 'Los últimos 2 años.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El límite de retroacción y devolución es de cuatro años.',
        condition_if_correct: 'Si el límite legal fuera de dos años.',
      },
      {
        text: 'Los últimos 5 años.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. Son cuatro años, no cinco.',
        condition_if_correct: 'Si el límite legal fuera de cinco años.',
      },
      {
        text: 'El último año.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El último año es el plazo de caducidad de una prestación a tanto alzado, no el de estas cuotas.',
        condition_if_correct: 'Si se preguntara por la caducidad del percibo de una prestación.',
      },
    ],
    legal_basis: 'Art. 37 RIA',
    rule_statement: 'Variación con repercusión en cotización y comunicada tarde: retroacción limitada a los últimos 4 años.',
    corrective_rule: 'Cuatro años = límite de variación retroactiva con cotización (y devolución en afiliación indebida).',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t3-10',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'Un alta solicitada fuera de plazo, en la que no se ingresaron las cuotas en plazo reglamentario por autoliquidación, surtirá efectos desde:',
    correct: {
      text: 'El día en que se formule la solicitud.',
      explanation:
        'Las altas solicitadas fuera de plazo surtirán efectos desde el día en que se formule la solicitud, salvo que, por aplicarse la autoliquidación, se haya producido su ingreso dentro de plazo, en cuyo caso retrotra.',
    },
    distractors: [
      {
        text: 'El día en que se inició la actividad.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. Esa fecha de efectos corresponde al alta en plazo; fuera de plazo, salvo autoliquidación pagada en plazo, los efectos van desde la solicitud.',
        condition_if_correct: 'Si el alta se hubiera presentado en plazo o se hubieran pagado las cuotas en plazo.',
      },
      {
        text: 'El día siguiente al de la solicitud.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Los efectos son desde el mismo día de la solicitud, no desde el siguiente.',
        condition_if_correct: 'Si los efectos se desplazaran un día.',
      },
      {
        text: 'La fecha de ingreso de las primeras cuotas.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. Esa retroacción solo opera si, por autoliquidación, las cuotas se ingresaron dentro del plazo reglamentario, supuesto que el enunciado descarta.',
        condition_if_correct: 'Si se hubieran ingresado las cuotas en plazo reglamentario.',
      },
    ],
    legal_basis: 'Art. 35 RIA',
    rule_statement: 'Alta fuera de plazo: efectos desde la solicitud; si cuotas pagadas en plazo por autoliquidación, retroacción a su ingreso.',
    corrective_rule: 'Alta en plazo = día del inicio. Alta fuera de plazo = día de la solicitud (salvo cuotas en plazo).',
    difficulty: 3,
    cognitive_operations: ['calibrated_decision', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t3-11',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'Una baja presentada fuera de plazo: la obligación de cotizar no se extingue hasta el día en que:',
    correct: {
      text: 'La TGSS conozca el cese en el trabajo.',
      explanation:
        'En las bajas fuera de plazo no se extingue la obligación de cotizar hasta el día en que la TGSS conozca el cese en el trabajo o la terminación de la situación determinante de la inclusión.',
    },
    distractors: [
      {
        text: 'Se presentase la solicitud de baja ante la TGSS.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. Ni la mera solicitud ni el reconocimiento de la baja extinguen la obligación de cotizar mientras continúe la prestación.',
        condition_if_correct: 'Si la baja se hubiera presentado en plazo.',
      },
      {
        text: 'Se hubiera producido el cese real del trabajo.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. El.game cesa real es la fecha de efectos de la baja EN PLAZO; fuera de plazo la cotización subsiste hasta que la TGSS conoce el cese, y el interesado puede probarlo.',
        condition_if_correct: 'Si la baja se hubiera presentado en plazo.',
      },
      {
        text: 'Termine el mes natural en que se produzca el cese.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. No hay un corte mensual; rige el conocimiento del cese por la TGSS.',
        condition_if_correct: 'Si la norma estableciera un corte al cierre de mes.',
      },
    ],
    legal_basis: 'Art. 36 RIA',
    rule_statement: 'Baja fuera de plazo: obligación de cotizar hasta que la TGSS conoce el cese.',
    corrective_rule: 'Baja fuera de plazo = "no se extingue la cotización hasta el conocimiento por la TGSS".',
    difficulty: 3,
    cognitive_operations: ['calibrated_decision', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-12',
    cluster_id: 'cluster_plazos_efectos_altas',
    stem: 'Tras una actuación de la ITSS promovida a instancia de un tercero o por un requerimiento expreso de una entidad, el alta de oficio practicada retrotrae sus efectos a:',
    correct: {
      text: 'La fecha en que se produjo la denuncia, queja o petición expresa.',
      explanation:
        'Cuando el alta de oficio deriva de actuación de la ITSS, los efectos se retrotraen a la fecha de la actuación inspectora, salvo que ésta hubiera sido promovida por orden superior, a instancia de las entidades gestoras o como consecuencia de denuncia, queja o petición expresa, en cuyo caso retrotraen a la fecha en que se produjeron.',
    },
    distractors: [
      {
        text: 'La fecha en que se llevó a cabo la actuación inspectora de la TGSS.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. Esa es la regla general, pero el enunciado activa la excepción de denuncia, queja o petición expresa.',
        condition_if_correct: 'Si la actuación inspectora no se hubiera promovido por denuncia, queja o petición expresa.',
      },
      {
        text: 'La fecha de inicio de la actividad laboral del trabajador.',
        trap_type: 'partial_rule_accuracy',
        explanation: 'Incorrecto. Es la fecha de efectos del alta en plazo, no de la de oficio.',
        condition_if_correct: 'Si se tratara de un alta presentada en plazo.',
      },
      {
        text: 'El día siguiente al de la resolución que la declara indebida.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Los efectos se retrotraen, no se desplazan al día siguiente.',
        condition_if_correct: 'Si los efectos fueran desde el día siguiente a la resolución.',
      },
    ],
    legal_basis: 'Art. 35 RIA',
    rule_statement: 'Alta de oficio por ITSS: regla general = fecha de la actuación; excepción por denuncia/queja/petición = fecha de estas.',
    corrective_rule: 'Excepción clave: si el alta de oficio nace de denuncia, queja o petición → retroacción a la fecha de la denuncia, no de la inspección.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-13',
    cluster_id: 'cluster_convenio_especial',
    stem: 'Para suscribir el convenio especial se requiere, en la fecha de solicitud, haber cubierto un período de cotización de:',
    correct: {
      text: '1.080 días cotizados en los 12 años inmediatamente anteriores a la baja.',
      explanation:
        'Es necesario tener cubierto, en la fecha de solicitud, un período de 1.080 días de cotización al Sistema de la Seguridad Social en los 12 años inmediatamente anteriores a la baja en el Régimen de que se trate.',
    },
    distractors: [
      {
        text: '720 días cotizados en los 10 años inmediatamente anteriores a la baja.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. La carencia es de 1.080 días en 12 años.',
        condition_if_correct: 'Si la carencia fuera de 720 días en 10 años.',
      },
      {
        text: '1.080 días cotizados en los 15 años inmediatamente anteriores a la baja.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. La ventana es de 12 años, no de 15.',
        condition_if_correct: 'Si la ventana legal fuera de 15 años.',
      },
      {
        text: '1.800 días cotizados en los 12 años inmediatamente anteriores a la baja.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. La carencia es de 1.080 días, no de 1.800.',
        condition_if_correct: 'Si la carencia fuera de 1.800 días.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003',
    rule_statement: 'Carencia del convenio especial: 1.080 días cotizados en los 12 años anteriores a la baja.',
    corrective_rule: 'Cifra ancla del convenio especial: 1.080 días / 12 años.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-14',
    cluster_id: 'cluster_convenio_especial',
    stem: 'El convenio especial, si su solicitud se presenta dentro de los 90 días naturales siguientes al cese, surtirá efectos desde:',
    correct: {
      text: 'El día siguiente a aquel en que produjo efectos la baja en el Régimen.',
      explanation:
        'Dentro de los 90 días naturales siguientes a la fecha del cese, el convenio especial surtirá efectos desde el día siguiente a aquel en que haya producido efectos la baja, pudiendo el suscriptor optar por la fecha de presentación.',
    },
    distractors: [
      {
        text: 'La fecha de presentación de la solicitud ante la TGSS correspondiente.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. Dentro de los 90 días la fecha de efectos por defecto es el día siguiente a la baja; la fecha de presentación solo opera si el suscriptor opta expresamente por ella.',
        condition_if_correct: 'Si el suscriptor hubiera optado expresamente por la fecha de solicitud.',
      },
      {
        text: 'El día siguiente al de la presentación de la solicitud ante la TGSS.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. El dies a quo es el día siguiente a la BAJA, no a la solicitud.',
        condition_if_correct: 'Si los efectos comenzaran al día siguiente de la solicitud.',
      },
      {
        text: 'La fecha en que se produjo el cese en la actividad laboral.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. El convenio comienza el día siguiente a la baja, no el mismo día del cese.',
        condition_if_correct: 'Si los efectos coincidieran con el día del cese.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 14',
    rule_statement: 'Convenio especial dentro de 90 días: efectos desde el día siguiente a la baja (con opción a la solicitud).',
    corrective_rule: '90 días = ventana de efectos completos. 1 año = plazo para solicitar el convenio.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-15',
    cluster_id: 'cluster_convenio_especial',
    stem: 'Si la TGSS no dicta resolución sobre la solicitud de convenio especial en el plazo de 3 meses, se entiende:',
    correct: {
      text: 'Estimada por silencio administrativo positivo.',
      explanation:
        'La notificación sobre la procedencia de celebrar el convenio especial debe producirse dentro de los 3 meses siguientes, considerándose la falta de resolución expresa como estimación por silencio administrativo positivo.',
    },
    distractors: [
      {
        text: 'Desestimada por silencio administrativo negativo.',
        trap_type: 'rule_exception_swap',
        explanation: 'Incorrecto. En el convenio especial el silencio es POSITIVO.',
        condition_if_correct: 'Si el procedimiento previera silencio negativo.',
      },
      {
        text: 'Estimada automáticamente al cumplirse los 45 días.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. Los 45 días son el plazo de resolución en otras materias de la TGSS; el convenio especial tiene plazo propio de 3 meses.',
        condition_if_correct: 'Si se aplicara el plazo general de 45 días de la TGSS.',
      },
      {
        text: 'Necesita la iniciación de un nuevo procedimiento.',
        trap_type: 'overbroad_statement',
        explanation: 'Incorrecto. El silencio positivo no obliga a reiniciar nada.',
        condition_if_correct: 'Si el silencio fuera negativo y hubiera que volver a solicitarlo.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 6',
    rule_statement: 'Convenio especial: silencio POSITIVO a los 3 meses.',
    corrective_rule: 'Silencio del convenio especial = positivo (a diferencia de otros procedimientos administrativos).',
    difficulty: 3,
    cognitive_operations: ['micro_discrimination', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t3-16',
    cluster_id: 'cluster_convenio_especial',
    stem: 'El convenio especial se extingue por falta de abono de las cuotas correspondientes a (salvo causa justificada de fuerza mayor):',
    correct: {
      text: '3 mensualidades consecutivas o 5 alternativas.',
      explanation:
        'El convenio especial se extingue por falta de abono de las cuotas correspondientes a tres mensualidades consecutivas o a cinco alternativas, salvo causa justificada de fuerza mayor.',
    },
    distractors: [
      {
        text: '2 mensualidades consecutivas o 4 alternativas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El umbral legal es 3 consecutivas o 5 alternas.',
        condition_if_correct: 'Si el umbral fuera de dos y cuatro.',
      },
      {
        text: '3 mensualidades consecutivas o 6 alternativas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. Son cinco alternas, no seis.',
        condition_if_correct: 'Si el umbral de alternas fuera de seis.',
      },
      {
        text: '6 mensualidades consecutivas o 9 alternativas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El umbral es bastante menor: 3/5.',
        condition_if_correct: 'Si el umbral fuera de seis y nueve.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 19',
    rule_statement: 'Extinción del convenio especial por impago: 3 mensualidades consecutivas o 5 alternas (salvo fuerza mayor).',
    corrective_rule: '3/5 = umbral de impago del convenio especial. Es un par de cifras que debes automatizar.',
    difficulty: 3,
    cognitive_operations: ['generative_retrieval', 'numeric_precision'],
  }),
  buildMcq({
    id: 'item-t3-17',
    cluster_id: 'cluster_convenio_especial',
    stem: '¿Cuál de las siguientes contingencias NO está cubierta por el convenio especial?',
    correct: {
      text: 'Riesgo durante el embarazo.',
      explanation:
        'El convenio especial excluye los subsidios por incapacidad temporal, nacimiento y cuidado del menor, riesgo durante el embarazo y lactancia, así como la protección por el desempleo, el FOGASA y la formación profesional.',
    },
    distractors: [
      {
        text: 'Jubilación.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la jubilación SÍ está cubierta por el convenio especial.',
        condition_if_correct: 'Si el enunciado pidiera una contingencia cubierta.',
      },
      {
        text: 'Incapacidad permanente por enfermedad común.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la incapacidad permanente SÍ está cubierta por el convenio especial.',
        condition_if_correct: 'Si el enunciado pidiera una contingencia cubierta.',
      },
      {
        text: 'Muerte y supervivencia por accidente no laboral.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la muerte y supervivencia SÍ están cubiertas por el convenio especial.',
        condition_if_correct: 'Si el enunciado pidiera una contingencia cubierta.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 15',
    rule_statement: 'El convenio especial NO cubre: IT, nacimiento/cuidado, riesgo embarazo/lactancia, desempleo, FOGASA, FP.',
    corrective_rule: 'Lista de exclusiones del convenio: IT + nacimiento/cuidado + embarazo/lactancia + desempleo + FOGASA + FP.',
    difficulty: 3,
    cognitive_operations: ['exception_detection', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-18',
    cluster_id: 'cluster_convenio_especial',
    confusion_pair_id: 'pair_convenio_suspension_vs_extincion',
    stem: 'Quien suscribe el convenio especial inicia una actividad que le da de alta en un régimen cuya base de cotización es INFERIOR a la del convenio. El convenio:',
    correct: {
      text: 'Queda suspendido, salvo que el suscriptor manifieste expresamente otra voluntad.',
      explanation:
        'El convenio especial queda suspendido durante los períodos de actividad que determinen un encuadramiento con base inferior a la del convenio, salvo que el suscriptor manifieste expresamente su voluntad de que se extinga o de que siga vigente.',
    },
    distractors: [
      {
        text: 'Se extingue de inmediato, sin posibilidad de manifestación del suscriptor.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. La extinción automática opera con base IGUAL o SUPERIOR; con base inferior el convenio se suspende.',
        condition_if_correct: 'Si la base del nuevo alta fuera igual o superior a la del convenio.',
      },
      {
        text: 'Continúa sin cambios y el trabajador cotiza en ambos regímenes a la vez.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. Con base inferior el convenio se suspende (salvo voluntad expresa), no se mantiene inalterado.',
        condition_if_correct: 'Si el convenio especial siguiera vigente por decisión expresa del suscriptor.',
      },
      {
        text: 'Se extingue solo cuando concurra pluriempleo o pluriactividad.',
        trap_type: 'wrong_legal_object',
        explanation:
          'Incorrecto. El pluriempleo es justamente el supuesto en que NO se extingue por alta con base igual o superior.',
        condition_if_correct: 'Si la causa de extinción estuviera en el pluriempleo.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, arts. 18 y 19',
    rule_statement: 'Base inferior = suspensión del convenio; base igual o superior = extinción (salvo pluriempleo/pluriactividad).',
    corrective_rule: 'Compara la base: INFERIOR suspende, IGUAL o SUPERIOR extingue (salvo pluriempleo/pluriactividad).',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-19',
    cluster_id: 'cluster_convenio_especial',
    stem: 'La suspensión del convenio especial por inicio de actividad con base inferior, notificada a la TGSS dentro del plazo de 10 días naturales siguientes a la reanudación, produce efectos desde:',
    correct: {
      text: 'El día anterior al de la incorporación al trabajo.',
      explanation:
        'Si estas circunstancias de suspensión se notifican a la TGSS dentro del plazo de los 10 días naturales siguientes a la reanudación de la actividad, producirán efectos desde el día anterior al de la incorporación al trabajo.',
    },
    distractors: [
      {
        text: 'La fecha en que se efectuó la comunicación a la TGSS.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. Esa fecha solo opera si se notificara FUERA del plazo de 10 días; dentro de plazo los efectos van al día anterior a la incorporación.',
        condition_if_correct: 'Si la notificación se efectuara fuera del plazo de 10 días naturales.',
      },
      {
        text: 'El día siguiente al de la incorporación al trabajo.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Es el día ANTERIOR a la incorporación, no el siguiente.',
        condition_if_correct: 'Si los efectos fueran desde el día siguiente a la incorporación.',
      },
      {
        text: 'El día en que se produjo la incorporación al trabajo.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. Los efectos se adelantan un día: el anterior a la incorporación.',
        condition_if_correct: 'Si los efectos coincidieran con el día de la incorporación.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 18',
    rule_statement: 'Suspensión notificada en plazo: efectos desde el día anterior a la incorporación; fuera de plazo, desde la comunicación.',
    corrective_rule: 'Dentro de plazo = día anterior a la incorporación. Fuera de plazo = día de la comunicación.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-20',
    cluster_id: 'cluster_convenio_especial',
    stem: 'Los cambios de bases de cotización del convenio especial posteriores a su suscripción deben efectuarse:',
    correct: {
      text: 'Antes del día 1 de octubre, con efectos desde el 1 de enero siguiente.',
      explanation:
        'Los cambios de bases de cotización posteriores a la suscripción del convenio deberán efectuarse antes del día 1 de octubre de cada año y tendrán efectos desde el día 1 de enero del año siguiente.',
    },
    distractors: [
      {
        text: 'Antes del día 1 de julio, con efectos desde el 1 de octubre siguiente.',
        trap_type: 'temporal_confusion',
        explanation: 'Incorrecto. El corte es el 1 de octubre y los efectos el 1 de enero siguiente.',
        condition_if_correct: 'Si el corte fuera el 1 de julio con efectos el 1 de octubre.',
      },
      {
        text: 'En cualquier momento del año, con efectos desde el mes siguiente.',
        trap_type: 'overbroad_statement',
        explanation: 'Incorrecto. El cambio está sujeto a una ventana anual concreta.',
        condition_if_correct: 'Si el cambio pudiera hacerse en cualquier momento.',
      },
      {
        text: 'Solo en el momento exacto de suscribir el convenio especial.',
        trap_type: 'overbroad_statement',
        explanation: 'Incorrecto. El cambio de base es posible también con posterioridad, dentro de la ventana anual.',
        condition_if_correct: 'Si el cambio solo fuera posible al suscribir.',
      },
    ],
    legal_basis: 'Orden TAS/2865/2003, art. 12',
    rule_statement: 'Cambio de base del convenio especial: solicitud antes del 1 de octubre, efectos el 1 de enero siguiente.',
    corrective_rule: 'Ventana anual del convenio: pedir antes del 1 de octubre, se aplica el 1 de enero.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-21',
    cluster_id: 'cluster_clases_alta',
    confusion_pair_id: 'pair_pluriempleo_vs_pluriactividad',
    stem: 'Un trabajador por cuenta ajena presta servicios profesionales a dos empresas distintas y queda de alta en el MISMO régimen de la Seguridad Social. Esta situación es:',
    correct: {
      text: 'Pluriempleo.',
      explanation:
        'Se entenderá por pluriempleo la situación del trabajador por cuenta ajena que preste sus servicios profesionales a dos o más empresas distintas y en actividades que den lugar al alta en un mismo régimen de la Seguridad Social.',
    },
    distractors: [
      {
        text: 'Pluriactividad.',
        trap_type: 'conceptual_merger',
        explanation:
          'Incorrecto. La pluriactividad exige alta en dos o más REGÍMENES distintos; aquí hay un solo régimen.',
        condition_if_correct: 'Si el trabajador estuviera de alta en dos o más regímenes distintos.',
      },
      {
        text: 'Encuadramiento único en el sistema.',
        trap_type: 'wrong_legal_object',
        explanation: 'Incorrecto. Prestar servicios a dos empresas es encuadramiento múltiple (pluriempleo).',
        condition_if_correct: 'Si prestara servicios a una sola empresa.',
      },
      {
        text: 'Alta presunta.',
        trap_type: 'wrong_legal_object',
        explanation: 'Incorrecto. El alta es real y distinta del alta presunta; aquí hay alta real en dos empresas.',
        condition_if_correct: 'Si faltara el alta en alguna de las empresas.',
      },
    ],
    legal_basis: 'Art. 7 RIA',
    rule_statement: 'Pluriempleo = dos o más empresas en un mismo régimen. Pluriactividad = dos o más regímenes.',
    corrective_rule: 'Regla: "más empresas = pluriempleo; más regímenes = pluriactividad".',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'application'],
  }),
  buildMcq({
    id: 'item-t3-22',
    cluster_id: 'cluster_clases_alta',
    confusion_pair_id: 'pair_alta_presunta_vs_presuncion_laboralidad',
    stem: 'La presunción de alta en contingencias como accidentes de trabajo y enfermedades profesionales o desempleo, cuando el alta no se ha tramitado, es una presunción:',
    correct: {
      text: 'Iuris et de iure, que no admite prueba en contra.',
      explanation:
        'Frente al incumplimiento del alta, la ley establece la presunción iuris et de iure (de pleno derecho) de la existencia efectiva del alta a efectos de las contingencias señaladas, aplicándose el principio de automaticidad de las prestaciones.',
    },
    distractors: [
      {
        text: 'Iuris tantum, que admite prueba en contrario por el empresario.',
        trap_type: 'absolute_relative_confusion',
        explanation:
          'Incorrecto. La presunción de alta es iuris et de iure; la iuris tantum es la presunción de laboralidad del ET.',
        condition_if_correct: 'Si se tratara de la presunción de laboralidad.',
      },
      {
        text: 'Una ficción jurídica carente de efectos sobre las prestaciones.',
        trap_type: 'conceptual_merger',
        explanation:
          'Incorrecto. La presunción de alta produce automaticidad de las prestaciones; no es una ficción sin efectos.',
        condition_if_correct: 'Si la presunción no tuviera efectos prestacionales.',
      },
      {
        text: 'Iuris tantum, salvo respecto de la contingencia de desempleo.',
        trap_type: 'absolute_relative_confusion',
        explanation: 'Incorrecto. La categoría iuris tantum no corresponde a la presunción de alta en ninguna contingencia.',
        condition_if_correct: 'Si la presunción fuera iuris tantum con una excepción en desempleo.',
      },
    ],
    legal_basis: 'Art. 166 TRLGSS y alta de pleno derecho',
    rule_statement: 'Presunción de alta = iuris et de iure (no admite prueba en contra), con automaticidad.',
    corrective_rule: 'Alta = iuris et de iure. Laboralidad = iuris tantum. No los intercambies.',
    difficulty: 3,
    cognitive_operations: ['institutional_discrimination', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-23',
    cluster_id: 'cluster_clases_alta',
    stem: 'En los casos legales de huelga y cierre patronal (alta especial), pese a que el contrato está suspendido y no hay obligación de cotizar, se generan derechos a prestaciones de la Seguridad Social SALVO:',
    correct: {
      text: 'La incapacidad temporal y el desempleo.',
      explanation:
        'En los casos de huelga y cierre patronal, aunque el contrato esté suspendido y no exista obligación de cotizar, se considera en situación de alta especial a efectos de generar derechos a prestaciones salvo las prestaciones económicas de incapacidad temporal y desempleo.',
    },
    distractors: [
      {
        text: 'La jubilación y la incapacidad permanente.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la alta especial SÍ genera derechos a jubilación e incapacidad permanente.',
        condition_if_correct: 'Si el enunciado pidiera prestaciones no excluidas.',
      },
      {
        text: 'El desempleo y la muerte y supervivencia.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. El desempleo SÍ está excluido, pero la muerte y supervivencia NO; al ser la respuesta mixta, no es la correcta.',
        condition_if_correct: 'Si tanto desempleo como muerte y supervivencia estuvieran excluidos.',
      },
      {
        text: 'La IT y el nacimiento y cuidado del menor.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. La IT SÍ está excluida, pero el nacimiento y cuidado del menor NO lo están; respuesta mixta.',
        condition_if_correct: 'Si tanto la IT como nacimiento y cuidado estuvieran excluidos.',
      },
    ],
    legal_basis: 'Doctrina del alta especial; TRLGSS',
    rule_statement: 'Alta especial (huelga/cierre patronal): genera prestaciones salvo incapacidad temporal y desempleo.',
    corrective_rule: 'Las dos exclusiones del alta especial son IT y desempleo. Exactamente dos.',
    difficulty: 3,
    cognitive_operations: ['exception_detection', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-24',
    cluster_id: 'cluster_afiliacion_caracteres',
    stem: '¿Cuál de las siguientes NO es una característica de la afiliación a la Seguridad Social (art. 6 RIA)?',
    correct: {
      text: 'Es temporal y renovable en cada régimen.',
      explanation:
        'La afiliación es obligatoria, única y general, se extiende a toda la vida, es exclusiva y constituye título jurídico. Es vitalicia, NO temporal ni renovable por regímenes.',
    },
    distractors: [
      {
        text: 'Es obligatoria para todos los incluidos.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la afiliación ES obligatoria.',
        condition_if_correct: 'Si el enunciado pidiera un carácter que no tiene.',
      },
      {
        text: 'Es única y general para todo el Sistema.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la afiliación ES única y general.',
        condition_if_correct: 'Si el enunciado pidiera un carácter que no tiene.',
      },
      {
        text: 'Es exclusiva frente a otros regímenes.',
        trap_type: 'true_but_irrelevant',
        explanation: 'Incorrecto como respuesta: la afiliación ES exclusiva.',
        condition_if_correct: 'Si el enunciado pidiera un carácter que no tiene.',
      },
    ],
    legal_basis: 'Art. 6 RIA',
    rule_statement: 'Los cinco caracteres: obligatoria, única y general, vitalicia, exclusiva y título jurídico.',
    corrective_rule: 'Afiliación = VITALICIA (de por vida), nunca temporal. Si te la ofrecen como temporal, es falsa.',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'response_inhibition'],
  }),
  buildMcq({
    id: 'item-t3-25',
    cluster_id: 'cluster_afiliacion_caracteres',
    confusion_pair_id: 'pair_nuss_vs_ccc',
    stem: 'La inscripción del empresario en el Régimen General, como requisito previo e indispensable a iniciar sus actividades, produce la obtención de:',
    correct: {
      text: 'El Código de Cuenta de Cotización (CCC).',
      explanation:
        'La TGSS asigna al empresario un número único de inscripción para su individualización, que se considera su primer y principal Código de Cuenta de Cotización (CCC), sin perjuicio de CCC secundarios.',
    },
    distractors: [
      {
        text: 'El Número de la Seguridad Social (NUSS).',
        trap_type: 'conceptual_merger',
        explanation:
          'Incorrecto. El NUSS/NAF es el identificador que produce la AFILIACIÓN del trabajador, no la inscripción de la empresa.',
        condition_if_correct: 'Si se preguntara por el resultado de la afiliación.',
      },
      {
        text: 'Un número de afiliación vitalicio.',
        trap_type: 'conceptual_merger',
        explanation:
          'Incorrecto. El número vitalicio es el NUSS del trabajador; el empresario recibe el CCC (con posible número de inscripción único).',
        condition_if_correct: 'Si se preguntara por el identificador vitalicio del trabajador.',
      },
      {
        text: 'El alta en el Régimen Especial de Autónomos (RETA).',
        trap_type: 'wrong_legal_object',
        explanation: 'Incorrecto. La inscripción es en el Régimen General; el alta en el RETA es para autónomos.',
        condition_if_correct: 'Si se inscribiera una empresa en el RETA.',
      },
    ],
    legal_basis: 'Art. 138 TRLGSS; art. 16 RIA',
    rule_statement: 'Inscripción del empresario = CCC. Afiliación del trabajador = NUSS/NAF.',
    corrective_rule: 'Regla: "Empresa → CCC; Persona → NUSS/NAF". No los cruces.',
    difficulty: 2,
    cognitive_operations: ['micro_discrimination', 'application'],
  }),
  buildMcq({
    id: 'item-t3-26',
    cluster_id: 'cluster_inscripcion_empresa',
    stem: 'Los documentos de asociación y de cobertura de contingencias de la empresa, una vez formalizados:',
    correct: {
      text: 'Vigencia de 1 año, vencimiento el último día del mes y prórroga automática.',
      explanation:
        'Los documentos formalizados mantienen su vigencia por el período de 1 año, debiendo coincidir su vencimiento con el último día del mes, y se entienden prorrogados automáticamente salvo denuncia en contrario.',
    },
    distractors: [
      {
        text: 'Vigencia de 1 año, vencimiento el 31 de diciembre de cada año.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. El vencimiento coincide con el último día del MES en que se formalizaron, no necesariamente el 31 de diciembre.',
        condition_if_correct: 'Si el documento se hubiera formalizado en diciembre.',
      },
      {
        text: 'Vigencia de 2 años, vencimiento a fin de año y prórroga automática.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. La vigencia es de 1 año y la prórroga es automática salvo denuncia.',
        condition_if_correct: 'Si la vigencia fuera de 2 años con prórroga expresa.',
      },
      {
        text: 'Vigencia indefinida mientras la empresa exista y no se extinga.',
        trap_type: 'overbroad_statement',
        explanation:
          'Incorrecto. Rige el sistema de vigencia de 1 año con prórroga automática.',
        condition_if_correct: 'Si los documentos fueran de duración indefinida.',
      },
    ],
    legal_basis: 'Art. 16 RIA',
    rule_statement: 'Documentos de asociación/cobertura: 1 año, vencimiento al último día del mes, prórroga automática salvo denuncia.',
    corrective_rule: 'Documentos empresa = 1 año + último día del mes + prórroga automática salvo denuncia.',
    difficulty: 3,
    cognitive_operations: ['numeric_precision', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-27',
    cluster_id: 'cluster_particularidades',
    stem: 'En el cambio de destino de un funcionario incluido en el campo de aplicación del Régimen General, las altas y bajas surtirán efectos, respectivamente:',
    correct: {
      text: 'El alta el día 1 del mes siguiente al cese y la baja el último día del mes del cese.',
      explanation:
        'En los casos de cambio de destino, las altas surtirán efectos desde el día primero del mes siguiente al cese y las bajas desde el último día del mes en que se produzca el cese.',
    },
    distractors: [
      {
        text: 'Ambas, el alta y la baja, desde el día 1 del mes siguiente al del cese.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. La baja va desde el último día del mes del cese, no desde el día 1 del mes siguiente.',
        condition_if_correct: 'Si ambas fechas coincidieran con el día 1 del mes siguiente.',
      },
      {
        text: 'El alta desde el día mismo del cese y la baja desde el día siguiente al mismo.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. Los efectos se sitúan en los bordes del mes (fin de mes / inicio de mes), no en días consecutivos.',
        condition_if_correct: 'Si los efectos fueran en días consecutivos al cese.',
      },
      {
        text: 'El alta el día siguiente al cese y la baja el mismo día en que aquél.',
        trap_type: 'partial_rule_accuracy',
        explanation:
          'Incorrecto. Ni el alta es el día siguiente ni la baja el día del cese; van al cierre y apertura de mes.',
        condition_if_correct: 'Si alta y baja fueran en días consecutivos al cese.',
      },
    ],
    legal_basis: 'Art. 50 RIA',
    rule_statement: 'Funcionarios (cambio de destino): alta al día 1 del mes siguiente; baja al último día del mes del cese.',
    corrective_rule: 'Sin hueco ni solape: baja cierra el mes del cese; alta abre el mes siguiente.',
    difficulty: 3,
    cognitive_operations: ['calibrated_decision', 'micro_discrimination'],
  }),
  buildMcq({
    id: 'item-t3-28',
    cluster_id: 'cluster_particularidades',
    stem: 'En la contratación de trabajadores agrarios por cuenta ajena eventuales o fijos discontinuos, si no ha sido posible formalizar el alta antes del inicio de la jornada, las solicitudes de alta pueden presentarse el mismo día hasta las:',
    correct: {
      text: '12 horas.',
      explanation:
        'El mismo día en que comiencen su prestación de servicios podrán presentarse las solicitudes de alta hasta las 12 horas de dicho día, cuando no haya sido posible formalizarse con anterioridad al inicio de la jornada.',
    },
    distractors: [
      {
        text: '24 horas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El límite es a las 12 horas del día de inicio; 24 horas lo ampliaría indebidamente.',
        condition_if_correct: 'Si la ventana fuera de 24 horas.',
      },
      {
        text: '18 horas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El límite es a las 12 horas del día de inicio; 18 horas no está previsto.',
        condition_if_correct: 'Si la ventana fuera de 18 horas.',
      },
      {
        text: '8 horas.',
        trap_type: 'numeric_substitution',
        explanation: 'Incorrecto. El límite es a las 12 horas del día de inicio; 8 horas no está previsto.',
        condition_if_correct: 'Si la ventana fuera de 8 horas.',
      },
    ],
    legal_basis: 'Art. 51 RIA',
    rule_statement: 'Agrarios eventuales/fijos discontinuos: alta hasta las 12:00 del día de inicio si no se pudo antes.',
    corrective_rule: 'Ventana del día = 12 horas (mediodía). Es una excepción al alta estrictamente previa.',
    difficulty: 2,
    cognitive_operations: ['numeric_precision', 'exception_detection'],
  }),
  buildMcq({
    id: 'item-t3-29',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    confusion_pair_id: 'pair_baja_indeada_causa_grave_vs_ordinaria',
    stem: 'Una baja es declarada indebida por una causa distinta de las estrictamente graves (no lesiona derechos fundamentales, no hay incompetencia, etc.). El trabajador se considera en alta desde:',
    correct: {
      text: 'El inicio del procedimiento administrativo que declaró indebida la baja, subsistiendo la cotización.',
      explanation:
        'Cuando la baja sea declarada indebida por cualquier otra causa distinta de las expresamente enumeradas, el trabajador será considerado en alta desde que se iniciase el procedimiento administrativo que la declaró indebida, subsistiendo la obligación de cotizar durante dicho período.',
    },
    distractors: [
      {
        text: 'La fecha en que concurrió la causa grave que motivó la declaración, con obligación de cotizar.',
        trap_type: 'rule_exception_swap',
        explanation:
          'Incorrecto. Esa fecha corresponde a las bajas declaradas indebidas por causa GRAVE; el enunciado excluye expresamente esos supuestos.',
        condition_if_correct: 'Si la baja se hubiera declarado indebida por causa grave.',
      },
      {
        text: 'La fecha de la resolución que declaró indebida la baja, con obligación de cotizar.',
        trap_type: 'temporal_confusion',
        explanation:
          'Incorrecto. El alta se retrotrae al inicio del procedimiento, no a la fecha de la resolución.',
        condition_if_correct: 'Si el alta comenzara con la resolución.',
      },
      {
        text: 'La fecha de la baja originaria, una vez que la resolución ha devenido firme.',
        trap_type: 'partial_rule_accuracy',
        explanation: 'Incorrecto. Esa es la fecha en que se produjo el cese, no la del alta retroactiva.',
        condition_if_correct: 'Si el alta se retrotrajera a la fecha de la baja.',
      },
    ],
    legal_basis: 'Art. 61.2 RIA',
    rule_statement: 'Baja indebida ordinaria: alta desde el inicio del procedimiento. Causa grave: alta desde que concurrió la causa.',
    corrective_rule: 'Dos ramas: causa grave → desde la causa; causa ordinaria → desde el inicio del procedimiento.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
  buildMcq({
    id: 'item-t3-30',
    cluster_id: 'cluster_actos_indebidos_impugnaciones',
    stem: 'Se practica un alta indebida en un régimen, existiendo otro distinto en cuyo campo de aplicación está incluida la persona afectada. Ese alta:',
    correct: {
      text: 'Es válida hasta la resolución o, en su defecto, hasta el último día del mes de su notificación, con cómputo recíproco.',
      explanation:
        'El alta indebida en un Régimen de personas incluidas en el campo de aplicación de otro Régimen distinto será válida hasta la fecha que se fije en la resolución que la declare indebida y, en su defecto, hasta el último día del mes de su notificación; las cotizaciones se computan recíprocamente con las del Régimen de inclusión procedente.',
    },
    distractors: [
      {
        text: 'Se repone la situación existente anterior al alta y las cotizaciones no surtiren efecto alguno en el sistema.',
        trap_type: 'wrong_legal_object',
        explanation:
          'Incorrecto. Eso es lo que ocurre cuando la persona NO debe figurar en ningún régimen; aquí sí existe otro régimen de inclusión y hay cómputo recíproco.',
        condition_if_correct: 'Si la persona no debiera estar de alta en ningún régimen.',
      },
      {
        text: 'Es nula desde el propio origen y se devuelven íntegramente todas las cuotas ingresadas por ella.',
        trap_type: 'overbroad_statement',
        explanation:
          'Incorrecto. Aquí el alta no es nula desde el origen: es válida hasta el límite indicado y computa recíprocamente.',
        condition_if_correct: 'Si el alta fuera nula de pleno derecho.',
      },
      {
        text: 'Es válida únicamente durante un período de 3 meses, tras el cual queda automáticamente sin efecto.',
        trap_type: 'numeric_substitution',
        explanation:
          'Incorrecto. No hay un plazo de tres meses; el límite es la fecha de la resolución o el último día del mes de notificación.',
        condition_if_correct: 'Si la validez se limitara a tres meses.',
      },
    ],
    legal_basis: 'Art. 60 RIA',
    rule_statement: 'Alta indebida con otro régimen aplicable: válida hasta resolución (o último día del mes), con cómputo recíproco.',
    corrective_rule: 'Alta indebida: si hay otro régimen → cómputo recíproco; si no hay ningún régimen → reposición y cuotas sin efecto.',
    difficulty: 4,
    cognitive_operations: ['exception_detection', 'calibrated_decision'],
  }),
];