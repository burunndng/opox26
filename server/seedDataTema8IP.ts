import type { Item, MCQOption, TrapType, CognitiveOperation } from '../src/types.ts';

/**
 * Tema 8 Específico (II) — Incapacidad permanente.
 *
 * Ítems de elaboración propia redactados sobre:
 *  - "Diaposiivas Tema 8 (ii) SS.pdf" (mazo de la academia),
 *  - "Supuesto Repaso T. 8 espec (II)" (casos de examen de la academia),
 *  - notas del profesor (algoritmo de resolución, BR ≠ importe, redondeo,
 *    contratos ≤5 días, superposición de 15 años, atrasos y art. 48.2 ET),
 *  - resúmenes de clase 21-10 pt1 y pt2 (incapacidad permanente): días
 *    restantes de IT como cotizados para la carencia, HC sin alta en la
 *    solicitud, transformación EC en jubilación vs profesional, 15 años como
 *    requisito de alta (no carencia), cualificada 55/75 %, IPT + desempleo,
 *    dictamen complementario, plazos 15/180, ponente INSS, IPA y art. 128,
 *    plazo de revisión encadenado, reclamación previa vs Ley 39.
 *
 * Las cifras proceden de material de academia y de los resúmenes de clase,
 * no del BOE: figuran como "⚠️ fuente interna". No se usan importes anuales
 * (p. ej. la base mínima 2025 de la garantía de cuantía) para no arrastrar
 * cifras caducables a los enunciados.
 */

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

const TOPIC = 'topic_seguridad_social_tema_8_ip';
const now = '2026-10-27T10:00:00Z';

const questionBank: Question[] = [
  // ── A. Concepto, grados y profesión habitual ──────────────────────────────
  {
    stem: '¿Cuál es el concepto legal de incapacidad permanente contributiva (art. 193 TRLGSS)?',
    prompt: 'Separa tres elementos: gravedad, objetivación y carácter definitivo.',
    key: 'B',
    correct: {
      text: 'Reducciones anatómicas o funcionales graves, de determinación objetiva y previsiblemente definitivas, que disminuyan o anulen la capacidad laboral',
      rule: 'El art. 193 TRLGSS exige reducciones graves, susceptibles de determinación objetiva y previsiblemente definitivas. La posibilidad de recuperación no impide la calificación si se estima médicamente incierta o a largo plazo.',
    },
    distractors: [
      { text: 'Reducciones anatómicas o funcionales de intensidad leve o moderada que impidan temporalmente el trabajo mientras dure el tratamiento prescrito', trap: 'hyper_narrow_statement', why: 'La regla no admite reducciones leves, y el impedimento temporal es propio de la IT, no de la IP.' },
      { text: 'Pérdida total e irreversible de la capacidad laboral, calificable solo cuando el equipo médico descarta por completo la recuperación', trap: 'absolute_relative_confusion', why: 'La ley no exige imposibilidad de recuperación ni descarte absoluto; basta que se estime incierta o a largo plazo.' },
      { text: 'Daños anatómicos o funcionales derivados exclusivamente de accidente de trabajo o enfermedad profesional, cualquiera que sea su intensidad', trap: 'overbroad_statement', why: 'El concepto no se limita a contingencias profesionales ni prescinde de la gravedad de la reducción.' },
    ],
    legal: 'Art. 193 TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    difficulty: 3,
  },
  {
    stem: 'Cuando la reducción anatómica o funcional disminuye el rendimiento normal en un 33 % o más, sin impedir las tareas fundamentales de la profesión, ¿qué grado corresponde y con qué prestación?',
    prompt: 'Sitúe el grado y, después, la prestación que le corresponde.',
    key: 'D',
    correct: {
      text: 'Incapacidad permanente parcial, con prestación de 24 mensualidades de la base reguladora',
      rule: 'La parcial exige una disminución no inferior al 33 % que no impide las tareas fundamentales, y se satisface con 24 mensualidades de la base reguladora que hubiera servido para la IT.',
    },
    distractors: [
      { text: 'Incapacidad permanente parcial, con pensión vitalicia equivalente al 55 % de la base reguladora', trap: 'conceptual_merger', why: 'Mezcla el grado parcial con la prestación de la total: la parcial no genera pensión vitalicia.' },
      { text: 'Incapacidad permanente total, con prestación de 24 mensualidades de la base reguladora', trap: 'conceptual_merger', why: 'La total impide las tareas fundamentales y da lugar a pensión vitalicia, no a una prestación única.' },
      { text: 'Incapacidad permanente total, con pensión vitalicia equivalente al 55 % de la base reguladora', trap: 'partial_rule_accuracy', why: 'La prestación sí corresponde a la total, pero el supuesto descrito es de parcialidad por no impedir las tareas fundamentales.' },
    ],
    legal: 'Arts. 194 y 196 y DT 26ª TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    pair: 'pair_ip_parcial_vs_total',
    difficulty: 4,
  },
  {
    stem: '¿En qué se diferencia la incapacidad permanente total de la absoluta?',
    prompt: 'La clave está en si cabe dedicarse a otra profesión distinta.',
    key: 'A',
    correct: {
      text: 'La total inhabilita para las tareas fundamentales de la profesión habitual, pero permite dedicarse a otra distinta',
      rule: 'La total inhabilita para realizar todas o las fundamentales tareas de la profesión habitual, siempre que pueda dedicarse a otra distinta; la absoluta imposibilita para toda profesión u oficio.',
    },
    distractors: [
      { text: 'La total exige haber agotado la incapacidad temporal, mientras que la absoluta puede declararse sin proceso previo de IT', trap: 'factual_misapplication', why: 'Ambos grados siguen exigiendo derivar de la IT, salvo las excepciones del art. 193, que no distinguen entre total y absoluta.' },
      { text: 'La total otorga pensión vitalicia y la absoluta se satisface mediante indemnización a tanto alzado', trap: 'wrong_legal_object', why: 'La indemnización a tanto alzado no es propia de la absoluta: es una sustitución opcional de la pensión.' },
      { text: 'La total solo cabe en accidentes de trabajo y la absoluta únicamente en contingencias comunes', trap: 'factual_misapplication', why: 'Los dos grados pueden causarse por cualquier contingencia, común o profesional.' },
    ],
    legal: 'Art. 194 TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    pair: 'pair_ip_total_vs_absoluta',
    difficulty: 3,
  },
  {
    stem: '¿Cuándo se declara el grado de gran invalidez?',
    prompt: 'Acumule dos requisitos, no uno solo.',
    key: 'C',
    correct: {
      text: 'Cuando la persona necesita asistencia de otra persona para los actos esenciales de la vida y, además, está inhabilitada para cualquier profesión',
      rule: 'La gran invalidez requiere la imposibilidad de dedicarse a toda profesión u oficio más la necesidad de asistencia de otra persona para los actos más esenciales de la vida, como vestirse, desplazarse o comer.',
    },
    distractors: [
      { text: 'Cuando la persona necesita asistencia de otra persona para desplazarse, aunque conserve la capacidad para las restantes profesiones', trap: 'partial_rule_accuracy', why: 'Cae el segundo requisito, pero falta la imposibilidad de dedicarse a cualquier profesión u oficio.' },
      { text: 'Cuando la incapacidad absoluta se declara a partir de los 55 años y la persona no puede reincorporarse a su puesto habitual', trap: 'conceptual_merger', why: 'La edad no define la gran invalidez: los 55 años se vinculan al porcentaje cualificado, no al grado.' },
      { text: 'Cuando las lesiones superan el 33 % de reducción y se acumulan dos procesos de incapacidad temporal en el mismo año', trap: 'conceptual_merger', why: 'Mezcla el umbral de la parcialidad con una recaída de IT; la gran invalidez no se mide en porcentajes ni en acumulación de bajas.' },
    ],
    legal: 'Art. 194 TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    pair: 'pair_ip_absoluta_vs_gi',
    difficulty: 3,
  },
  {
    stem: '¿Cómo se determina la profesión habitual a efectos de calificar la incapacidad permanente?',
    prompt: 'La norma da dos criterios distintos según la contingencia.',
    key: 'B',
    correct: {
      text: 'En accidente, sea o no de trabajo, la que se desempeñaba normalmente al tiempo de sufrirlo; en enfermedad, la de actividad fundamental previa',
      rule: 'En accidente, sea o no de trabajo, se toma la profesión que el trabajador desempeñaba normalmente al tiempo de sufrirlo; en enfermedad común o profesional, la actividad fundamental a la que se dedicaba en el periodo anterior a la incapacidad que reglamentariamente se determine.',
    },
    distractors: [
      { text: 'Siempre la última profesión declarada en el alta ante la Seguridad Social, con independencia del tiempo de su ejercicio', trap: 'overbroad_statement', why: 'El criterio no es la declaración de alta, sino el ejercicio efectivo, y difiere entre accidente y enfermedad.' },
      { text: 'En accidente, la actividad fundamental de los tres años anteriores; en enfermedad, la profesión de la empresa en la que se tramita la baja', trap: 'numeric_substitution', why: 'No existe un periodo de tres años ni un criterio por empresa: la enfermedad atiende a la actividad fundamental previa.' },
      { text: 'La profesión que conste en el convenio colectivo aplicable en la fecha del hecho causante, aunque no se hubiera ejercido', trap: 'factual_misapplication', why: 'El convenio no determina la profesión habitual; se exige ejercicio efectivo.' },
    ],
    legal: 'Art. 194.2 TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    difficulty: 4,
  },
  {
    stem: 'Con carácter general, la incapacidad permanente debe derivar de un proceso de IT. ¿Cuál de estos supuestos es una excepción a ese requisito?',
    prompt: 'Busque la excepción expresa, no un supuesto ordinario.',
    key: 'D',
    correct: {
      text: 'El acceso a la pensión desde una situación de alta o asimilada al alta sin obligación de cotizar (art. 195.4 TRLGSS)',
      rule: 'El art. 193 TRLGSS permite acceder a la IP sin IT previa cuando no hay protección por IT en el supuesto de asimilada al alta, en la asimilación a trabajador por cuenta ajena del art. 155.2 o al acceder desde una situación de no alta.',
    },
    distractors: [
      { text: 'El reconocimiento de una incapacidad permanente parcial tras agotar los 545 días naturales de subsidio', trap: 'true_but_irrelevant', why: 'Es el supuesto ordinario: la parcial se causa tras la extinción de la IT, no excepciona nada.' },
      { text: 'La declaración de incapacidad permanente total a propuesta del equipo de valoración de incapacidades', trap: 'wrong_competent_body', why: 'El EVI propone dictamen; la proposición no suprime el requisito de IT previa.' },
      { text: 'La prórroga de la incapacidad temporal por expectativa de recuperación con vistas a la reincorporación', trap: 'temporal_confusion', why: 'La prórroga alarga la IT en curso; no es un acceso a la IP sin proceso previo.' },
    ],
    legal: 'Arts. 193 y 195.4 TRLGSS',
    cluster: 'cluster_ip_concepto_grados',
    difficulty: 4,
  },

  // ── B. Base reguladora y cuantía ──────────────────────────────────────────
  {
    stem: '¿Cuál es la prestación económica que corresponde en el grado de incapacidad permanente parcial?',
    prompt: 'Distinta forma de pago según el grado.',
    key: 'C',
    correct: {
      text: 'Una cantidad a tanto alzado equivalente a 24 mensualidades de la base reguladora que hubiera servido para la IT',
      rule: 'La parcial se satisface con una cantidad a tanto alzado de 24 mensualidades de la base reguladora que hubiera servido para determinar la prestación económica de IT.',
    },
    distractors: [
      { text: 'Una pensión vitalicia del 55 % de la base reguladora, elevada al 75 % cuando la persona tenga 55 años o más', trap: 'conceptual_merger', why: 'Ese porcentaje corresponde a la total y su modalidad cualificada, no a la parcial.' },
      { text: 'Una cantidad a tanto alzado equivalente a 84 mensualidades de la base reguladora, en todo caso', trap: 'numeric_substitution', why: 'Las 84 mensualidades son la indemnización a tanto alzado que sustituye a la pensión, no la prestación de la parcial.' },
      { text: 'Una pensión vitalicia del 100 % de la base reguladora mientras no se revise el grado', trap: 'wrong_legal_object', why: 'El 100 % corresponde a la absoluta y a la gran invalidez, no a la parcial.' },
    ],
    legal: 'DT 26ª TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_parcial_vs_total',
    difficulty: 3,
  },
  {
    stem: '¿Con qué forma de pago se satisfacen los grados de incapacidad permanente total, absoluta y gran invalidez?',
    prompt: 'Distinga pensión, prestación única e indemnización.',
    key: 'A',
    correct: {
      text: 'Con pensión vitalicia, salvo que se acuerde revisión del grado por previsión de mejoría',
      rule: 'Los grados de total, absoluta y gran invalidez se reconocen como pensión vitalicia de la Seguridad Social, que no tiene vencimiento prefijado salvo revisión del grado.',
    },
    distractors: [
      { text: 'Con pensión vitalicia desde la resolución y con indemnización a tanto alzado desde los 60 años', trap: 'exception_ignored', why: 'La sustitución por indemnización no opera automáticamente a los 60 años: es opcional y solo mientras se dan sus requisitos.' },
      { text: 'Con prestación temporal de 24 mensualidades prorrogables por otros 180 días', trap: 'wrong_legal_object', why: 'Las 24 mensualidades son de la parcial, y los 180 días son prórroga de la IT, no de la IP.' },
      { text: 'Con pensión vitalicia siempre compatible con cualquier trabajo por cuenta propia o ajena', trap: 'overbroad_statement', why: 'La compatibilidad tiene condiciones: la absoluta y la gran invalidez solo con actividades que no supongan cambio de capacidad.' },
    ],
    legal: 'Arts. 194 y 196 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_total_vs_absoluta',
    difficulty: 3,
  },
  {
    stem: '¿Cómo se calcula la base reguladora de una incapacidad permanente por enfermedad común cuando el periodo mínimo de cotización exigido es igual o superior a ocho años?',
    prompt: 'Recuerde el divisor, el periodo y cuáles bases van nominales.',
    key: 'B',
    correct: {
      text: 'Dividiendo por 112 las bases de los 96 meses anteriores al mes previo al hecho causante, nominales las 24 últimas y actualizadas por IPC las anteriores',
      rule: 'Con periodo mínimo de ocho años o más se divide por 112 la suma de las bases de los 96 meses anteriores al mes previo al hecho causante: las 24 primeras se computan en valor nominal y las restantes se actualizan por IPC.',
    },
    distractors: [
      { text: 'Dividiendo por 96 las bases de los 112 meses anteriores al hecho causante, nominales las 24 últimas y actualizadas por IPC las anteriores', trap: 'numeric_substitution', why: 'Intercambia divisor y periodo: el divisor es 112 y el periodo 96 meses.' },
      { text: 'Sumando las 24 bases anteriores al mes del hecho causante y dividiendo el resultado entre 28, con actualización por IPC', trap: 'factual_misapplication', why: 'Esa fórmula corresponde al accidente no laboral en situación de alta, no a la enfermedad común.' },
      { text: 'Dividiendo por 112 las bases de los 96 meses anteriores al mes del hecho causante, todas ellas actualizadas por IPC', trap: 'wrong_start_date', why: 'El cómputo arranca en el mes previo al del hecho causante, excluyendo el mes propio, y las 24 últimas bases no se actualizan.' },
    ],
    legal: 'Art. 197 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_br_vs_importe',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se calcula la base reguladora de una incapacidad permanente por enfermedad común cuando el periodo mínimo de cotización exigido es inferior a ocho años?',
    prompt: 'El periodo mínimo manda; no se fija siempre en 96 meses.',
    key: 'D',
    correct: {
      text: 'Bases mensuales en número igual a los meses del periodo mínimo exigible, sin fracciones de mes y sin actualizar las 24 últimas',
      rule: 'Con periodo mínimo inferior a ocho años se computan bases mensuales en número igual a los meses de ese periodo, sin tener en cuenta fracciones de mes, y se excluye la actualización de las bases de los 24 meses inmediatamente anteriores al mes previo al hecho causante.',
    },
    distractors: [
      { text: 'Siempre 96 meses de cotización, con fracción de mes incluida y actualización por IPC de todas las bases comprendidas', trap: 'numeric_substitution', why: 'Impone el periodo de la regla general y admite fracciones de mes, que la norma excluye expresamente.' },
      { text: 'Las 24 bases inmediatamente anteriores al mes del hecho causante, actualizadas íntegramente por IPC desde su origen', trap: 'rule_exception_swap', why: 'Invierte la regla: esas 24 bases se computan nominales, precisamente porque no se actualizan.' },
      { text: 'División entre 28 de la suma de 24 bases elegidas libremente por la persona trabajadora en los siete años previos', trap: 'factual_misapplication', why: 'Esa es la fórmula del accidente no laboral en alta, no la de la enfermedad común.' },
    ],
    legal: 'Art. 197 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_br_vs_importe',
    difficulty: 4,
  },
  {
    stem: '¿Cuál es la base reguladora de la incapacidad permanente por accidente no laboral de una persona en situación de alta?',
    prompt: 'Divisor, número de bases, elección y periodo: los cuatro elementos.',
    key: 'A',
    correct: {
      text: 'El cociente de dividir entre 28 la suma de 24 bases de cotización ininterrumpidas elegidas por la persona trabajadora en los 7 años anteriores al hecho causante',
      rule: 'En accidente no laboral de personas en alta, la base reguladora es el cociente de dividir por 28 la suma de 24 bases de cotización ininterrumpidas elegidas por el interesado en los 7 años inmediatamente anteriores al hecho causante.',
    },
    distractors: [
      { text: 'El cociente de dividir entre 30 la suma de 24 bases de cotización ininterrumpidas, las más altas del periodo, en los 7 años anteriores', trap: 'numeric_substitution', why: 'El divisor es 28 y las bases no son las más altas, sino las elegidas libremente.' },
      { text: 'El cociente de dividir entre 112 las bases de los 96 meses anteriores al mes previo al hecho causante, con actualización por IPC', trap: 'wrong_legal_object', why: 'Esa es la fórmula de la enfermedad común con ocho años o más, no la del accidente no laboral.' },
      { text: 'El cociente de dividir entre 28 las 24 bases anteriores al hecho causante, aunque no sean ininterrumpidas ni elegidas por la persona', trap: 'partial_rule_accuracy', why: 'Repite el divisor correcto pero elimina los requisitos de ininterrumpidez y de elección libre.' },
    ],
    legal: 'Art. 197.3 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_br_vs_importe',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se calcula la base reguladora cuando la incapacidad permanente absoluta o de gran invalidez por contingencias comunes se causa sin estar en situación de alta?',
    prompt: 'Sin alta, se vuelve al divisor largo.',
    key: 'C',
    correct: {
      text: 'Dividiendo por 112 las bases de los 96 meses anteriores al mes previo al hecho causante, con actualización igual que en la enfermedad común',
      rule: 'En el acceso desde una situación de no alta por contingencias comunes, la base reguladora se obtiene dividiendo por 112 las bases de los 96 meses anteriores al mes previo al hecho causante, aplicando las mismas reglas de nominalidad e IPC que en la enfermedad común.',
    },
    distractors: [
      { text: 'Dividiendo por 28 la suma de 24 bases ininterrumpidas elegidas por la persona trabajadora en los siete años anteriores', trap: 'wrong_legal_object', why: 'Esa fórmula exige situación de alta y se reserva al accidente no laboral.' },
      { text: 'Aplicando la última base de cotización del periodo de alta más prolongado, sin divisor ni actualización de IPC', trap: 'factual_misapplication', why: 'La última base es referencia para la IT, no para la IP, y aquí ni siquiera existe situación de alta.' },
      { text: 'Dividiendo por 112 las bases de los 96 meses inmediatamente posteriores al hecho causante, actualizadas por IPC', trap: 'wrong_start_date', why: 'El cómputo va hacia atrás desde el mes previo al hecho causante, nunca hacia adelante.' },
    ],
    legal: 'Art. 197 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_br_vs_importe',
    difficulty: 4,
  },
  {
    stem: 'Una persona con base reguladora de 1.200 € al mes es calificada en grado de incapacidad permanente total ordinaria por enfermedad común. ¿Cuál es el importe mensual de su pensión?',
    prompt: 'La pregunta pide importe, no base reguladora.',
    key: 'B',
    correct: {
      text: '55 % de 1.200 € = 660 €',
      rule: 'La base reguladora es la magnitud de cálculo: 1.200 €. El importe de la pensión es el resultado de aplicar el porcentaje del grado, 55 % en la total ordinaria, lo que da 660 € mensuales.',
    },
    distractors: [
      { text: '100 % de 1.200 € = 1.200 €', trap: 'partial_rule_accuracy', why: 'Responde con la base reguladora como si fuera el importe; el 100 % corresponde a la absoluta y a la gran invalidez.' },
      { text: '75 % de 1.200 € = 900 €', trap: 'exception_ignored', why: 'El 75 % exige la modalidad cualificada, que requiere 55 años y las circunstancias legales.' },
      { text: '60 % de 1.200 € = 720 €', trap: 'conceptual_merger', why: 'El 60 % es el porcentaje del subsidio de IT del cuarto al vigésimo día, no el de la pensión de IP.' },
    ],
    legal: 'Art. 196 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_br_vs_importe',
    difficulty: 3,
  },
  {
    stem: '¿En qué condiciones corresponde el porcentaje del 75 % en la incapacidad permanente total derivada de contingencias comunes?',
    prompt: 'Acumule edad, falta de preparación y circunstancias del mercado.',
    key: 'D',
    correct: {
      text: 'Cuando la persona tenga 55 años o más, carezca de preparación general o especializada y concurran circunstancias que dificulten encontrar otro empleo',
      rule: 'La total cualificada aplica el 75 % cuando la persona tenga 55 años o más, carezca de preparación general o especializada y concurran circunstancias sociales y laborales del lugar de residencia que presuman dificultad para encontrar otro empleo.',
    },
    distractors: [
      { text: 'Cuando la persona tenga 55 años o más y el puesto resulte incompatible con el resto de vacantes de la misma empresa o de la ocupación habitual', trap: 'partial_rule_accuracy', why: 'La edad por sí sola no basta: se exige falta de preparación y circunstancias sociales y laborales generales.' },
      { text: 'Cuando la persona sea mayor de 67 años y no reúna los requisitos exigidos para acceder a la pensión de jubilación contributiva', trap: 'conceptual_merger', why: 'Esa es la vía de acceso a la IP a partir de los 67 años, no el supuesto del porcentaje cualificado.' },
      { text: 'Cuando la incapacidad derive de enfermedad profesional, haya existido incapacidad temporal previa y se mantenga la relación laboral', trap: 'factual_misapplication', why: 'La contingencia y la IT previa no son requisitos del incremento del 20 %.' },
    ],
    legal: 'Art. 196.2 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_total_vs_absoluta',
    difficulty: 4,
  },
  {
    stem: '¿En qué consiste el complemento de gran invalidez?',
    prompt: 'Dos componentes y un suelo.',
    key: 'A',
    correct: {
      text: 'Se suma a la pensión el 45 % de la base mínima de cotización del grupo de alta más el 30 % de la última base de cotización',
      rule: 'El complemento añade a la pensión el 45 % de la base mínima de cotización del grupo en que se esté dado de alta más el 30 % de la última base de cotización, y en ningún caso puede ser inferior al 45 % de la pensión que se viniera percibiendo sin complemento.',
    },
    distractors: [
      { text: 'Se suma a la pensión el 30 % de la base mínima de cotización del grupo de alta más el 45 % de la última base de cotización', trap: 'numeric_substitution', why: 'Intercambia los porcentajes entre la base mínima y la última base cotizada.' },
      { text: 'Se incrementa la pensión en un 45 % del importe de la incapacidad permanente absoluta, sin límite mínimo', trap: 'conceptual_merger', why: 'El complemento no se calcula sobre el importe de otra pensión sino sobre bases de cotización, y sí tiene suelo.' },
      { text: 'Se abonan 24 mensualidades adicionales de la base reguladora, revisables cada vez que se revalore el complemento', trap: 'wrong_legal_object', why: 'Las 24 mensualidades pertenecen al grado parcial; el complemento es un porcentaje añadido a la pensión.' },
    ],
    legal: 'Art. 196.2 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_absoluta_vs_gi',
    difficulty: 4,
  },
  {
    stem: '¿En qué supuesto puede sustituirse la pensión de incapacidad permanente por indemnización a tanto alzado y por cuántas mensualidades se abona?',
    prompt: 'Reúna edad de solicitud, irreversibilidad, actividad y edad al pedirla.',
    key: 'D',
    correct: {
      text: 'A petición de la persona menor de 60 años con lesiones irreversibles y actividad laboral, si tiene menos de 54 años: 84 mensualidades',
      rule: 'La sustitución puede pedirse en los tres años siguientes a la concesión si la persona tiene menos de 60 años, las lesiones se presumen irreversibles y se está dado de alta o se invierte el capital; si al solicitarla tiene menos de 54 años abona 84 mensualidades, y si es mayor la cuantía escala con la edad.',
    },
    distractors: [
      { text: 'A petición de la persona menor de 60 años con lesiones irreversibles y actividad laboral, si tiene menos de 54 años: 24 mensualidades', trap: 'numeric_substitution', why: 'El umbral de 84 mensualidades es el de las menores de 54 años; 24 es la prestación de la parcial.' },
      { text: 'De oficio cuando el grado declarado sea gran invalidez, con 120 mensualidades de la base reguladora', trap: 'factual_misapplication', why: 'La sustitución nunca es de oficio y no hay 120 mensualidades en el baremo legal.' },
      { text: 'A petición de la persona menor de 60 años con lesiones irreversibles, aunque no trabaje ni invierta el capital: 112 mensualidades', trap: 'exception_ignored', why: 'Exige estar de alta o invertir el capital, y el número de mensualidades no es 112 en ningún tramo.' },
    ],
    legal: 'DT 26ª TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    difficulty: 4,
  },

  // ── C. Beneficiarios y carencias ─────────────────────────────────────────
  {
    stem: '¿En qué supuestos no se exige período previo de cotización para causar pensión de incapacidad permanente?',
    prompt: 'Identifique la excepción a la carencia genérica.',
    key: 'B',
    correct: {
      text: 'Cuando la incapacidad derive de accidente, sea o no de trabajo, o de enfermedad profesional',
      rule: 'No se exige período previo de cotización cuando la incapacidad permanente sea debida a accidente, sea o no de trabajo, o a enfermedad profesional.',
    },
    distractors: [
      { text: 'Cuando la incapacidad derive de enfermedad común con baja por contingencias comunes', trap: 'exception_ignored', why: 'La enfermedad común sí exige carencia: 180 días para la IT y los periodos propios de la IP.' },
      { text: 'Cuando la persona esté en situación de alta asimilada sin obligación de cotizar', trap: 'overbroad_statement', why: 'La asimilada sin obligación de cotizar modifica el hecho causante y la ventana de diez años, pero no suprime la carencia.' },
      { text: 'Cuando la incapacidad permanente sea de grado parcial, cualquiera que sea la contingencia', trap: 'partial_rule_accuracy', why: 'La parcial sí exige carencia propia: 1.800 días en los diez años anteriores a la extinción de la IT.' },
    ],
    legal: 'Art. 195.1 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    difficulty: 3,
  },
  {
    stem: '¿Qué carencia exige la incapacidad permanente parcial derivada de contingencias comunes?',
    prompt: 'Días y ventana temporal.',
    key: 'A',
    correct: {
      text: '1.800 días de cotización dentro de los 10 años inmediatamente anteriores a la extinción de la IT',
      rule: 'La parcial exige 1.800 días de cotización dentro de los diez años inmediatamente anteriores a la fecha de extinción de la incapacidad temporal de la que derive.',
    },
    distractors: [
      { text: '1.800 días de cotización dentro de los 5 años inmediatamente anteriores al hecho causante', trap: 'wrong_start_date', why: 'Repite los días pero acorta la ventana y la ancla al hecho causante en lugar de a la extinción de la IT.' },
      { text: '180 días de cotización dentro de los 3 años anteriores a la extinción de la IT de la que derive', trap: 'numeric_substitution', why: 'Los 180 días son la carencia de la IT por enfermedad común, no la de la IP parcial.' },
      { text: '1.080 días de cotización dentro de los 10 años anteriores a la fecha de la solicitud', trap: 'numeric_substitution', why: 'Ni los días ni el anclaje a la solicitud corresponden a la regla de la parcial.' },
    ],
    legal: 'Art. 195.2 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_parcial_vs_total',
    difficulty: 4,
  },
  {
    stem: '¿Qué carencia genérica exige la IP total, absoluta o gran invalidez por enfermedad común en una persona menor de 31 años que esté de alta?',
    prompt: 'Divisor y punto de partida del cómputo.',
    key: 'D',
    correct: {
      text: 'La tercera parte del tiempo transcurrido entre la fecha en que cumplió 16 años y el hecho causante',
      rule: 'Para menores de 31 años en situación de alta, la carencia genérica es la tercera parte del tiempo transcurrido entre la fecha en que cumplió 16 años y la del hecho causante.',
    },
    distractors: [
      { text: 'La cuarta parte del tiempo transcurrido entre la fecha en que cumplió 20 años y el hecho causante', trap: 'conceptual_merger', why: 'Es la regla de los 31 años o más, no la aplicable a quien no ha alcanzado esa edad.' },
      { text: 'El tiempo transcurrido entre los 16 años y el hecho causante, sin dividirlo en fracciones', trap: 'rule_exception_swap', why: 'Suprime la división en tercera parte, que es el contenido mismo de la regla.' },
      { text: 'La tercera parte del tiempo transcurrido entre los 20 años y el hecho causante, con mínimo de 5 años', trap: 'factual_misapplication', why: 'Combina mal el divisor de los menores de 31 con el cómputo a partir de los 20 años y el mínimo propio de otra franja.' },
    ],
    legal: 'Art. 195.3 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: 'Un trabajador de 50 años causa incapacidad permanente por enfermedad común estando de alta. ¿Qué carencia genérica debe acreditar?',
    prompt: 'Edad menos 20 años, dividido entre cuatro y redondeo.',
    key: 'C',
    correct: {
      text: '8 años: la cuarta parte de los 30 años transcurridos desde los 20 años, con redondeo al alza',
      rule: 'Con 31 años o más la carencia es la cuarta parte del tiempo entre los 20 años y el hecho causante: 50 − 20 = 30; 30 ÷ 4 = 7,5, que se redondea por exceso a 8 años de cotización.',
    },
    distractors: [
      { text: '7 años: la cuarta parte de los 30 años transcurridos desde los 20 años, con redondeo a la baja', trap: 'numeric_precision', why: 'El cociente es correcto pero el redondeo debe ser siempre al alza, no a la baja ni por corte.' },
      { text: '5 años: carencia mínima legal, que prevalece siempre sobre el cómputo', trap: 'exception_ignored', why: 'El mínimo de cinco años opera cuando el cómputo arroja menos, no cuando arroja más.' },
      { text: '3 años: la tercera parte de los 9 años transcurridos desde los 16 años', trap: 'conceptual_merger', why: 'Aplica la regla de los menores de 31 años a una persona de 50.' },
    ],
    legal: 'Art. 195.3 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: '¿Qué exige la regla de la quinta parte en la carencia de la incapacidad permanente por enfermedad común?',
    prompt: 'Es una regla de distribución temporal, no un divisor nuevo.',
    key: 'B',
    correct: {
      text: 'Que al menos una quinta parte del periodo exigible esté comprendida en los 10 años inmediatamente anteriores al hecho causante',
      rule: 'De la carencia exigible, al menos una quinta parte debe estar comprendida dentro de los diez años inmediatamente anteriores al hecho causante.',
    },
    distractors: [
      { text: 'Que al menos una quinta parte de la carencia se acredite con cotizaciones superpuestas en dos regímenes distintos', trap: 'conceptual_merger', why: 'Mezcla la regla de la quinta parte con el requisito de superposición de la doble pensión por régimen.' },
      { text: 'Que la cuarta parte del periodo exigible se compute dentro de los 5 años inmediatamente anteriores a la solicitud', trap: 'numeric_substitution', why: 'Ni la fracción ni la ventana temporal ni el punto de anclaje coinciden con la regla.' },
      { text: 'Que la quinta parte del subsidio de IT se abone a cargo de la entidad gestora correspondiente', trap: 'true_but_irrelevant', why: 'Introduce el reparto de pago del subsidio, que no guarda relación con la carencia de la IP.' },
    ],
    legal: 'Art. 195.3 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: '¿Qué carencia exige la IP total, absoluta o gran invalidez por contingencias comunes causada sin estar en situación de alta o asimilada?',
    prompt: 'Periodo total y tramo reciente.',
    key: 'A',
    correct: {
      text: '15 años de cotización, de los cuales al menos 3 deben estar comprendidos en los 10 años anteriores al hecho causante',
      rule: 'Sin alta o asimilada, la carencia es de quince años de cotización, de los cuales al menos tres deben estar comprendidos dentro de los diez años inmediatamente anteriores al hecho causante.',
    },
    distractors: [
      { text: '15 años de cotización consecutivos e ininterrumpidos, sin exigir ningún requisito en los 10 años anteriores al hecho causante', trap: 'partial_rule_accuracy', why: 'La norma no exige continuidad, pero sí que tres años caigan en la ventana de los diez anteriores.' },
      { text: '10 años de cotización, de los cuales al menos 5 deben ser posteriores a la fecha de la solicitud', trap: 'numeric_substitution', why: 'Ni el total de quince años ni el tramo reciente de tres años se corresponden con la regla.' },
      { text: 'El mismo periodo que exige la enfermedad común en situación de alta, sin mínimo absoluto alguno', trap: 'true_but_irrelevant', why: 'La carencia en alta se calcula por fracción de la edad; el acceso sin alta tiene un mínimo propio de quince años.' },
    ],
    legal: 'Art. 195.5 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: 'Para causar pensión de incapacidad permanente en el Régimen General y en otro régimen del sistema sin acumular bases, ¿qué requisito temporal se exige?',
    prompt: 'Distinga suma, continuidad y superposición.',
    key: 'D',
    correct: {
      text: 'Que las cotizaciones de ambos regímenes se superpongan en el tiempo al menos durante 15 años',
      rule: 'Para causar la pensión en el Régimen General y en otro u otros regímenes del sistema es necesario que las cotizaciones acreditadas en cada uno se superpongan, al menos, durante quince años.',
    },
    distractors: [
      { text: 'Que las cotizaciones de ambos regímenes sumen 15 años, aunque no se superpongan en el tiempo', trap: 'absolute_relative_confusion', why: 'Se exige coincidencia simultánea, no mera suma de periodos alternos.' },
      { text: 'Que las cotizaciones de ambos regímenes sean consecutivas durante 15 años en un único régimen', trap: 'exception_ignored', why: 'Prescinde del segundo régimen, que es precisamente el objeto de la regla.' },
      { text: 'Que las cotizaciones de ambos regímenes se superpongan 3 años dentro de los 10 anteriores al hecho causante', trap: 'numeric_substitution', why: 'Esos tres años en diez son el tramo reciente de la carencia sin alta, no el requisito de doble pensión.' },
    ],
    legal: 'Art. 195.5 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    difficulty: 4,
  },
  {
    stem: '¿Qué cotización asimilada por parto se computa a la madre trabajadora a efectos de incapacidad permanente y de jubilación?',
    prompt: 'Hijo único y hijos a partir del segundo.',
    key: 'C',
    correct: {
      text: '112 días por el parto de un solo hijo y 14 días más por cada hijo a partir del segundo',
      rule: 'A la madre trabajadora se le asimilan a efectos de cotización 112 días por el parto de un solo hijo y 14 días más por cada hijo a partir del segundo, computables tanto para la incapacidad permanente como para la jubilación.',
    },
    distractors: [
      { text: '100 días por el parto de un solo hijo y 14 días más por cada hijo a partir del segundo', trap: 'numeric_substitution', why: 'El cómputo por hijo único es de 112 días, no de 100.' },
      { text: '112 días por el parto de un solo hijo y 7 días más por cada hijo a partir del segundo', trap: 'numeric_substitution', why: 'El complemento por hijo adicional es de 14 días, no de 7.' },
      { text: '112 días totales por el parto, repartidos entre todos los hijos nacidos simultáneamente', trap: 'rule_exception_swap', why: 'Los 112 días corresponden al hijo único; los siguientes añaden días, no reparten los mismos.' },
    ],
    legal: 'Art. 195 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    difficulty: 3,
  },
  {
    stem: '¿Cuántos días computan para la Seguridad Social los 4 días trabajados bajo un contrato de corta duración de hasta 5 días?',
    prompt: 'Aplique el 1,4 y luego redondee de forma estándar.',
    key: 'B',
    correct: {
      text: '6 días, por aplicación del coeficiente 1,4 y redondeo al alza',
      rule: 'En los contratos de hasta cinco días cada día trabajado computa como 1,4: 4 × 1,4 = 5,6 y, al ser el decimal igual o superior a 0,5, se redondea al alza a 6 días cotizados.',
    },
    distractors: [
      { text: '5 días, por aplicación del coeficiente 1,4 y redondeo a la baja', trap: 'numeric_precision', why: 'El resultado es 5,6 y el redondeo de 0,6 debe ser al alza; cortar o redondear a la baja deja 5.' },
      { text: '4 días, porque el coeficiente solo se aplica a partir del quinto día', trap: 'rule_exception_swap', why: 'El coeficiente se aplica precisamente a los días trabajados en contratos de hasta cinco días.' },
      { text: '6 días, por aplicación del coeficiente 1,5 a los 4 días trabajados', trap: 'numeric_substitution', why: 'Acierda en el resultado pero altera el coeficiente legal, que es 1,4.' },
    ],
    legal: 'Art. 249 bis TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    difficulty: 4,
  },

  // ── D. Nacimiento, extinción y compatibilidad ────────────────────────────
  {
    stem: '¿Cuándo se entiende producido el hecho causante de una incapacidad permanente parcial derivada de un proceso de IT?',
    prompt: 'Localice la extinción de la IT, no la resolución.',
    key: 'D',
    correct: {
      text: 'En la fecha de extinción de la IT, sea por agotamiento del subsidio o por alta médica con propuesta de IP',
      rule: 'En la parcial, el hecho causante se produce en la fecha de extinción de la incapacidad temporal, bien por agotamiento de la situación de protección o por alta médica con propuesta de IP; si no hay IT previa, en el dictamen-propuesta del EVI. Los efectos económicos inician con la resolución.',
    },
    distractors: [
      { text: 'En la fecha de la resolución del Director Provincial del INSS que califica la incapacidad permanente', trap: 'temporal_confusion', why: 'La resolución fija los efectos económicos, no el hecho causante.' },
      { text: 'En la fecha del dictamen-propuesta del equipo de valoración de incapacidades, aunque exista IT previa', trap: 'exception_ignored', why: 'El dictamen solo determina el hecho causante cuando no existe IT previa o esta no se ha extinguido.' },
      { text: 'En la fecha del alta médica que extingue la incapacidad temporal, aunque no haya propuesta de IP', trap: 'partial_rule_accuracy', why: 'El alta por curación o mejoría sin propuesta no sienta hecho causante de IP.' },
    ],
    legal: 'Art. 13 Orden de 18 de enero de 1996',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_hc_vs_efectos',
    difficulty: 4,
  },
  {
    stem: 'En la IP total derivada de un proceso de IT con subsidio de inferior cuantía, ¿desde qué fecha se reconocen efectos económicos?',
    prompt: 'Efectos y, después, retroacción.',
    key: 'A',
    correct: {
      text: 'Desde la calificación, retrotrayéndose al día siguiente a la extinción de la IT, porque la pensión supera al subsidio',
      rule: 'La total produce efectos económicos en la fecha de calificación, pudiendo retrotraerse al día siguiente al de la extinción de la IT cuando la pensión reconocida sea superior al subsidio que venía percibiéndose.',
    },
    distractors: [
      { text: 'Desde la calificación, sin posibilidad de retroacción alguna, porque la pensión reconocida no supera al subsidio de IT', trap: 'rule_exception_swap', why: 'Da por sentado que la pensión no supera al subsidio, que es justo la condición de la retroacción.' },
      { text: 'Desde la propia extinción de la IT, en todo caso y con independencia de la cuantía reconocida en cada resolución', trap: 'overbroad_statement', why: 'La retroacción depende de que la pensión sea superior al subsidio, no opera siempre.' },
      { text: 'Desde la notificación del dictamen-propuesta del equipo de valoración de incapacidades, aunque exista subsidio', trap: 'wrong_competent_body', why: 'El EVI emite dictamen no vinculante; los efectos se fijan en la resolución del INSS.' },
    ],
    legal: 'Art. 13 Orden de 18 de enero de 1996',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_hc_vs_efectos',
    difficulty: 4,
  },
  {
    stem: '¿En qué supuesto no procede la retroacción de efectos económicos de la IP absoluta o de gran invalidez?',
    prompt: 'Es una excepción concreta de la demora administrativa.',
    key: 'B',
    correct: {
      text: 'Cuando la persona estuvo en demora de calificación de la incapacidad permanente',
      rule: 'La absoluta y la gran invalidez producen efectos en la fecha de calificación y pueden retrotraerse si la pensión supera al subsidio, salvo cuando la persona hubiera estado en demora de calificación, en que no procede retrotraer.',
    },
    distractors: [
      { text: 'Cuando la pensión reconocida es superior al subsidio de IT que venía percibiendo', trap: 'rule_exception_swap', why: 'Esa es la condición que hace procedente la retroacción, no la que la excluye.' },
      { text: 'Cuando la incapacidad permanente se causa sin estar en situación de alta', trap: 'true_but_irrelevant', why: 'Sin IT previa el hecho causante se sitúa en la solicitud; la regla de la demora sigue aplicándose.' },
      { text: 'Cuando la persona trabajadora solicitó la revisión del grado antes de la resolución', trap: 'factual_misapplication', why: 'La solicitud de revisión no altera los efectos económicos del reconocimiento inicial.' },
    ],
    legal: 'Art. 13 Orden de 18 de enero de 1996',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_hc_vs_efectos',
    difficulty: 4,
  },
  {
    stem: '¿Desde cuándo se reconocen los efectos del incremento del 20 % de la incapacidad permanente total cualificada?',
    prompt: 'Fecha de origen y límite de retroactividad.',
    key: 'D',
    correct: {
      text: 'Desde la fecha de la solicitud, con un máximo de retroactividad de 3 meses',
      rule: 'El incremento del 20 % de la total cualificada produce efectos desde la fecha de solicitud de la incapacidad permanente, con un máximo de retroactividad de tres meses.',
    },
    distractors: [
      { text: 'Desde la fecha de la resolución, sin límite de retroactividad alguno', trap: 'temporal_confusion', why: 'Confunde los efectos de la cuantía con la fecha de resolución, y la norma fija un tope de tres meses.' },
      { text: 'Desde el hecho causante, que coincide con la extinción de la incapacidad temporal', trap: 'wrong_start_date', why: 'El incremento no se ancla al hecho causante sino a la solicitud.' },
      { text: 'Desde la fecha en que se cumplan 55 años, exigibles para el porcentaje del 75 %', trap: 'exception_ignored', why: 'La edad es requisito de la modalidad cualificada, no punto de inicio de los efectos.' },
    ],
    legal: 'Art. 196.2 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_hc_vs_efectos',
    difficulty: 4,
  },
  {
    stem: '¿Cuáles son las causas de extinción de la pensión de incapacidad permanente?',
    prompt: 'Son causas legales tasadas.',
    key: 'C',
    correct: {
      text: 'La revisión del grado, el fallecimiento de la persona beneficiaria y el derecho a la pensión de jubilación',
      rule: 'La pensión se extingue por revisión, por fallecimiento y por reconocimiento de la pensión de jubilación cuando se opte por esta, que procede en todo caso a partir de los 67 años.',
    },
    distractors: [
      { text: 'La revisión del grado y el fallecimiento, pero no la jubilación, que puede compatibilizarse con la pensión', trap: 'exception_ignored', why: 'El derecho a la jubilación extingue la IP de forma automática, sin compatibilizar ambas prestaciones.' },
      { text: 'El fallecimiento, la declaración de curación y la renuncia voluntaria presentada ante la entidad gestora', trap: 'factual_misapplication', why: 'La curación se produce en la revisión, y no existe renuncia voluntaria como causa legal.' },
      { text: 'El cumplimiento de 67 años, la modificación de la relación laboral y la pérdida del puesto de reserva', trap: 'conceptual_merger', why: 'La edad no extingue la pensión per se, y las incidencias laborales afectan a la relación, no al derecho.' },
    ],
    legal: 'Art. 200 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_suspension_vs_extincion',
    difficulty: 3,
  },
  {
    stem: '¿Por qué es incorrecto afirmar que una pensión de incapacidad permanente «vitalicia» dura obligatoriamente hasta el fallecimiento?',
    prompt: 'Vitalicia no equivale a irrevocable.',
    key: 'A',
    correct: {
      text: 'Porque puede extinguirse antes por curación o mejoría en un proceso de revisión o por reconocimiento de la jubilación',
      rule: 'La pensión es vitalicia porque no tiene vencimiento prefijado, pero está legalmente condicionada: se extingue por curación o mejoría apreciada en la revisión del grado o por reconocimiento de la jubilación cuando se opte por esta.',
    },
    distractors: [
      { text: 'Porque el carácter vitalicio se refiere solo a la cuantía, que puede suspenderse por ejercicio de actividad laboral', trap: 'conceptual_merger', why: 'La suspensión por actividad opera en la compatibilidad, no es el significado del carácter vitalicio.' },
      { text: 'Porque la pensión vitalicia queda condicionada a que la persona no alcance la edad ordinaria de jubilación', trap: 'partial_rule_accuracy', why: 'La jubilación no anula la IP: extingue la pensión y la sustituye, que no es lo mismo.' },
      { text: 'Porque el reconocimiento de la jubilación la transforma en pensión de jubilación compatible con el trabajo', trap: 'factual_misapplication', why: 'A los 67 años cambia la denominación, pero la extinción por jubilación optada no da lugar a compatibilidad.' },
    ],
    legal: 'Art. 200 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_suspension_vs_extincion',
    difficulty: 3,
  },
  {
    stem: '¿Cuál de estas afirmaciones sobre la compatibilidad de las pensiones de IP con la actividad laboral es correcta?',
    prompt: 'Examine cada grado por separado antes de elegir.',
    key: 'C',
    correct: {
      text: 'La de total es compatible con el salario si las funciones no coinciden con las que dieron lugar a la pensión',
      rule: 'La pensión de total es compatible con la percepción de salarios, incluso de otra empresa, cuando las funciones no coincidan con las que determinaron la pensión; el incremento del 20 % de la cualificada es incompatible con el trabajo, y la absoluta y la gran invalidez solo son compatibles con actividades que no supongan cambio de capacidad de trabajo.',
    },
    distractors: [
      { text: 'La de total es compatible con el salario, y la de total cualificada lo es también con el 20 % incluido', trap: 'exception_ignored', why: 'El incremento del 20 % es incompatible con el trabajo, aunque la propia pensión siga siendo compatible.' },
      { text: 'La de absoluta es compatible con todo trabajo por cuenta propia o ajena, sin condición alguna', trap: 'overbroad_statement', why: 'Solo cabe el trabajo que no suponga un cambio de la capacidad de trabajo para la revisión.' },
      { text: 'La de gran invalidez es incompatible con cualquier actividad incompatible con el complemento', trap: 'partial_rule_accuracy', why: 'El complemento de gran invalidez no se suspende por el desempeño de actividades incompatibles.' },
    ],
    legal: 'Art. 198 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    difficulty: 4,
  },

  // ── E. Lesiones no invalidantes y procedimiento ─────────────────────────
  {
    stem: '¿Qué son las lesiones permanentes no invalidantes a efectos de la acción protectora?',
    prompt: 'Definitivas, baremadas y sin impedir el trabajo.',
    key: 'D',
    correct: {
      text: 'Lesiones, mutilaciones o deformidades definitivas por AT o EP, baremadas y sin impedir el trabajo',
      rule: 'Son lesiones, mutilaciones o deformidades definitivas causadas por accidente de trabajo o enfermedad profesional que, sin alcanzar la incapacidad permanente, disminuyen o alteran la integridad física del trabajador y están previstas en el baremo; se indemnizan por una sola vez a tanto alzado por la entidad obligada a satisfacer la IP.',
    },
    distractors: [
      { text: 'Lesiones temporales causadas por accidente de trabajo que impiden el trabajo habitual pero se curan antes de un año', trap: 'partial_rule_accuracy', why: 'La definición exige carácter definitivo y, además, que no impidan el trabajo.' },
      { text: 'Secuelas de enfermedad común que impiden las tareas fundamentales de la profesión habitual', trap: 'wrong_legal_object', why: 'Las LPNI solo derivan de contingencias profesionales; las secuelas de enfermedad común conducen a la IP.' },
      { text: 'Lesiones producidas por accidente no laboral que, siendo definitivas, impiden el desempeño de cualquier profesión', trap: 'conceptual_merger', why: 'Se refiere a una incapacidad permanente absoluta por accidente no laboral, no a lesiones no invalidantes.' },
    ],
    legal: 'Art. 201 TRLGSS',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_lpni_vs_ip',
    difficulty: 3,
  },
  {
    stem: '¿Es compatible la indemnización por lesiones permanentes no invalidantes con una pensión de incapacidad permanente?',
    prompt: 'La regla tiene una única excepción.',
    key: 'C',
    correct: {
      text: 'No, salvo que las lesiones sean totalmente independientes de las que determinaron la pensión',
      rule: 'Las lesiones permanentes no invalidantes son incompatibles con la percepción de prestaciones económicas de incapacidad permanente, salvo que las lesiones que las determinen sean totalmente independientes de las que originaron aquellas.',
    },
    distractors: [
      { text: 'Sí, siempre que la lesión se bareme en un epígrafe distinto del que originó la pensión', trap: 'familiar_wording_trap', why: 'El baremo se organiza en epígrafes, pero la excepción legal no se juega en el epígrafe sino en la independencia de las lesiones.' },
      { text: 'No, en ningún supuesto, aunque las lesiones sean totalmente ajenas a la pensión', trap: 'exception_ignored', why: 'Ignora la excepción expresa de independencia total de las lesiones.' },
      { text: 'Sí, pero solo mientras la persona se mantenga en situación de alta en la empresa', trap: 'conceptual_merger', why: 'La compatibilidad no se vincula al alta en la empresa sino a la independencia de las lesiones.' },
    ],
    legal: 'Art. 203 TRLGSS',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_lpni_vs_ip',
    difficulty: 3,
  },
  {
    stem: '¿Qué regla de gestión y de pago se aplica a las indemnizaciones por lesiones permanentes no invalidantes?',
    prompt: 'Separe quién declara de quién paga.',
    key: 'B',
    correct: {
      text: 'Las verifica y reconoce el INSS; el pago lo asume la mutua o la entidad gestora correspondiente',
      rule: 'Corresponde al INSS verificar la existencia de las lesiones y reconocer el derecho a la indemnización, a propuesta del EVI; las cantidades se satisfacen por la entidad gestora o por la mutua colaboradora con la que se tenga concertada la cobertura de las contingencias profesionales.',
    },
    distractors: [
      { text: 'Las verifica y reconoce la mutua colaboradora, y el pago corresponde siempre al INSS o a la entidad gestora', trap: 'wrong_competent_body', why: 'Invierte ambos sujetos: la mutua no declara y el pago corresponde a la mutua cuando cubre la contingencia profesional.' },
      { text: 'Las verifica el equipo de valoración de incapacidades de forma vinculante y las paga la empresa', trap: 'wrong_competent_body', why: 'El EVI formula dictamen preceptivo pero no vinculante, y la empresa no asume definitivamente el pago.' },
      { text: 'Las gestiona la inspección de trabajo, que además fija la cuantía y ordena el pago a la mutua', trap: 'wrong_competent_body', why: 'La inspección no gestiona ni reconoce la indemnización; esa competencia es del INSS.' },
    ],
    legal: 'Arts. 201 y 204 TRLGSS; RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_declaracion_vs_pago',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se compone el equipo de valoración de incapacidades (EVI)?',
    prompt: 'Composición y carácter del dictamen.',
    key: 'A',
    correct: {
      text: 'Presidente y cuatro vocales, con encuadramiento orgánico y funcional en la dirección provincial del INSS',
      rule: 'El EVI de cada dirección provincial se integra por un presidente y cuatro vocales, con encuadramiento orgánico y funcional en la Dirección Provincial del INSS; el Ministerio de Trabajo puede crear más de un equipo en provincias con elevado volumen.',
    },
    distractors: [
      { text: 'Presidente y tres vocales, dependientes funcionalmente del Instituto Social de la Marina', trap: 'numeric_substitution', why: 'El EVI se compone de cuatro vocales y su encuadramiento es en la dirección provincial del INSS.' },
      { text: 'Presidente y cuatro vocales, pero con carácter vinculante para la resolución del INSS', trap: 'partial_rule_accuracy', why: 'La composición es correcta, pero los dictámenes del EVI son preceptivos y no vinculantes.' },
      { text: 'Presidente y seis vocales, con designación directa de la mutua colaboradora correspondiente', trap: 'numeric_substitution', why: 'Ni el número de vocales ni el órgano de designación se corresponden con la ley.' },
    ],
    legal: 'Art. 2 RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 3,
  },
  {
    stem: '¿Qué carácter tienen los dictámenes del equipo de valoración de incapacidades?',
    prompt: 'Preceptivo frente a vinculante.',
    key: 'C',
    correct: {
      text: 'Preceptivos y no vinculantes para el INSS, que puede resolver incluso reconociendo grado superior o inferior',
      rule: 'Los dictámenes del EVI son preceptivos y no vinculantes, por lo que la resolución puede no seguirlos y reconocer un grado superior o inferior al propuesto.',
    },
    distractors: [
      { text: 'Preceptivos y vinculantes, por lo que la resolución no puede apartarse del dictamen propuesto', trap: 'partial_rule_accuracy', why: 'Son preceptivos, pero no vinculantes: el INSS puede apartarse motivadamente.' },
      { text: 'Facultativos y no vinculantes, exigibles únicamente en el procedimiento de lesiones no invalidantes', trap: 'rule_exception_swap', why: 'Son preceptivos en todo el procedimiento, no solo en las lesiones no invalidantes.' },
      { text: 'Preceptivos y vinculantes solo cuando la persona impugna el alta médica expedida por el INSS', trap: 'factual_misapplication', why: 'La impugnación del alta es un procedimiento de IT distinto de la calificación de IP.' },
    ],
    legal: 'Art. 3 RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_declaracion_vs_pago',
    difficulty: 3,
  },
  {
    stem: '¿Qué efectos produce el silencio administrativo transcurridos 135 días en el procedimiento de incapacidad permanente?',
    prompt: 'Plazo, efecto y vía de impugnación.',
    key: 'A',
    correct: {
      text: 'Se entiende denegada la solicitud y procede reclamación previa ante la vía judicial social',
      rule: 'La resolución debe dictarse y notificarse en el plazo máximo de 135 días; transcurrido ese plazo sin resolución expresa, la solicitud se entiende denegada y procede reclamación previa a la vía judicial social.',
    },
    distractors: [
      { text: 'Se estima la solicitud con efectos económicos retroactivos desde el hecho causante', trap: 'rule_exception_swap', why: 'El silencio es desestimatorio por expresa previsión legal, no estimatorio.' },
      { text: 'Se prorroga el procedimiento hasta un máximo de 180 días naturales adicionales', trap: 'numeric_substitution', why: 'Los 180 días son la prórroga del subsidio de IT, no la del procedimiento de IP.' },
      { text: 'Se mantiene el grado de incapacidad temporal reconocido hasta la resolución expresa', trap: 'factual_misapplication', why: 'El silencio deniega la IP; no implica mantener ni prorrogar la IT.' },
    ],
    legal: 'Art. 6 RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 4,
  },
  {
    stem: '¿Qué efecto laboral produce la declaración de IP cuando la resolución inicial prevé un plazo de revisión por mejoría?',
    prompt: 'El plazo de revisión decide entre suspensión y extinción.',
    key: 'C',
    correct: {
      text: 'Si es igual o inferior a 2 años, se suspende el contrato con reserva de puesto; si es superior, se extingue',
      rule: 'La suspensión del contrato con reserva de puesto solo procede cuando la resolución inicial hace constar un plazo igual o inferior a dos años para la revisión por mejoría; si el plazo es superior, se extingue la relación laboral.',
    },
    distractors: [
      { text: 'Siempre se suspende el contrato con reserva de puesto, mientras dure el plazo de revisión previsto', trap: 'exception_ignored', why: 'La suspensión está condicionada a que el plazo de revisión no supere los dos años.' },
      { text: 'Siempre se extingue el contrato de trabajo, con derecho a indemnización por antigüedad', trap: 'overbroad_statement', why: 'Con plazo de revisión igual o inferior a dos años el contrato se suspende, no se extingue.' },
      { text: 'Si el plazo es inferior a 2 años se extingue el contrato; si es superior, se suspende con reserva', trap: 'rule_exception_swap', why: 'Invierte los dos supuestos: la suspensión es para el plazo igual o inferior a dos años.' },
    ],
    legal: 'Art. 7 RD 1300/1995; art. 48.2 ET',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_suspension_vs_extincion',
    difficulty: 4,
  },
  {
    stem: '¿Cuándo puede revisarse de oficio la pensión de IP de una persona que esté trabajando o ejerciendo una actividad por cuenta propia?',
    prompt: 'La actividad laboral desbloquea la revisión.',
    key: 'B',
    correct: {
      text: 'En cualquier momento, con independencia del plazo de revisión que fijara la resolución inicial',
      rule: 'Cuando el beneficiario de la IP esté trabajando por cuenta propia o ajena o ejerza otra actividad, el INSS puede revisar de oficio la pensión en cualquier momento y con independencia del plazo de revisión; también cabe la revisión por error de diagnóstico antes de la edad de jubilación.',
    },
    distractors: [
      { text: 'Solo cuando se cumpla el plazo de revisión fijado en la resolución inicial que reconoció la pensión', trap: 'exception_ignored', why: 'Es la regla general de la revisión; el trabajo es la excepción que la habilita en cualquier momento.' },
      { text: 'Únicamente si la persona solicita expresamente la revisión ante la entidad gestora', trap: 'conceptual_merger', why: 'La revisión de oficio no requiere solicitud del interesado.' },
      { text: 'Exclusivamente mientras la persona mantenga la relación laboral con la misma empresa', trap: 'hyper_narrow_statement', why: 'La regla habilita revisión con cualquier actividad por cuenta propia o ajena, no solo con la misma empresa.' },
    ],
    legal: 'Art. 200 TRLGSS',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 4,
  },
  {
    stem: 'Una persona causa incapacidad permanente tras extinguirse la IT antes del agotamiento (p. ej. día 400 de 545) con propuesta de IP. ¿Qué ocurre con los días de IT no consumidos?',
    prompt: 'Relacione días restantes de IT con carencia de la IP.',
    key: 'A',
    correct: {
      text: 'Se asimilan al alta y computan como cotizados para alcanzar la carencia exigible de la IP',
      rule: 'Si la IT se extingue anticipadamente con propuesta de IP, los días restantes de IT se consideran asimilados al alta y computan como cotizados para la carencia exigible de la IP.',
    },
    distractors: [
      { text: 'No computan: se pierden al extinguirse la IT y no cuentan para ningún requisito', trap: 'exception_ignored', why: 'Ignora que los días restantes de IT con propuesta de IP se asimilan al alta y computan para la carencia.' },
      { text: 'Solo computan si el equipo de valoración de incapacidades lo propone expresamente', trap: 'conceptual_merger', why: 'El cómputo de los días restantes no depende de una propuesta del EVI, sino de la extinción de la IT con propuesta de IP.' },
      { text: 'Solo cuentan si finalmente se reconoce la incapacidad permanente', trap: 'true_but_irrelevant', why: 'Los días computan para la elegibilidad (carencia) de la IP, independientemente del reconocimiento posterior.' },
    ],
    legal: 'Art. 195 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: 'Una persona causa incapacidad permanente absoluta sin estar en alta ni asimilada y sin IT previa. ¿Cuándo se entiende producido el hecho causante?',
    prompt: 'Sin IT previa y sin alta, el hecho causante se ancla a la solicitud.',
    key: 'C',
    correct: {
      text: 'En la fecha de la solicitud de la incapacidad permanente',
      rule: 'Cuando no existe IT previa ni situación de alta, el hecho causante de la incapacidad absoluta o gran invalidez se sitúa en la fecha de la solicitud.',
    },
    distractors: [
      { text: 'En la fecha del dictamen-propuesta del equipo de valoración de incapacidades', trap: 'wrong_start_date', why: 'El dictamen del EVI fija el hecho causante cuando no existe IT previa, pero con acceso desde no alta el anclaje es la solicitud.' },
      { text: 'En la fecha de la resolución del director provincial del INSS', trap: 'temporal_confusion', why: 'La resolución fija los efectos económicos, no el hecho causante.' },
      { text: 'En la fecha del reconocimiento médico inicial', trap: 'partial_rule_accuracy', why: 'No es un momento jurídicamente relevante para el hecho causante de la IP.' },
    ],
    legal: 'Art. 208 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    pair: 'pair_ip_hc_vs_efectos',
    difficulty: 4,
  },
  {
    stem: 'Al alcanzar la edad de jubilación, ¿qué ocurre con la pensión de incapacidad permanente según la contingencia de origen?',
    prompt: 'Distinga enfermedad común de contingencia profesional.',
    key: 'D',
    correct: {
      text: 'Enfermedad común se transforma en jubilación; profesional (AT/EP) continúa como IP',
      rule: 'La IP derivada de enfermedad común se transforma en pensión de jubilación al alcanzar la edad; la derivada de contingencia profesional (accidente de trabajo o enfermedad profesional) continúa como pensión de incapacidad permanente.',
    },
    distractors: [
      { text: 'Siempre se transforma en jubilación, con independencia de la contingencia de origen', trap: 'overbroad_statement', why: 'Solo la contingencia común se transforma; la profesional continúa como IP.' },
      { text: 'Nunca se transforma; continúa como incapacidad permanente en todos los casos', trap: 'conceptual_merger', why: 'Confunde ambas contingencias; la de enfermedad común sí se transforma.' },
      { text: 'Solo se transforma si la persona acredita el período de carencia exigido', trap: 'exception_ignored', why: 'La transformación depende de la contingencia de origen, no de la carencia.' },
    ],
    legal: 'Art. 208 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    difficulty: 4,
  },
  {
    stem: 'Sin alta ni asimilada, una persona de incapacidad absoluta o gran invalidez acredita 15 años cotizados. ¿Para qué requisito sirven esos 15 años?',
    prompt: 'Separe el cajón del alta del cajón de la carencia.',
    key: 'B',
    correct: {
      text: 'Completan el requisito de alta, no el de carencia',
      rule: 'Los quince años de cotización sustituyen el requisito de estar en alta o asimilada al alta, pero no sustituyen el requisito de carencia propio de la enfermedad común.',
    },
    distractors: [
      { text: 'Sustituyen la carencia de 180 días exigida para la incapacidad temporal', trap: 'exception_ignored', why: 'Los 15 años completan el alta, no la carencia; son cajones distintos.' },
      { text: 'Exigen acreditar al menos 10 años cotizados antes del hecho causante', trap: 'numeric_substitution', why: 'Ni el cómputo de 10 años ni la referencia al hecho causante corresponden a esta regla.' },
      { text: 'Son un requisito solo para la incapacidad permanente parcial', trap: 'partial_rule_accuracy', why: 'Los 15 años operan para la absoluta y gran invalidez sin alta, no para la parcial.' },
    ],
    legal: 'Art. 195.5 TRLGSS',
    cluster: 'cluster_ip_carencia_beneficiarios',
    pair: 'pair_ip_carencia_edad',
    difficulty: 4,
  },
  {
    stem: 'Una persona con IP total cualificada (75 %) encuentra empleo. ¿Qué ocurre con el porcentaje aplicado a su pensión?',
    prompt: 'El porcentaje puede bajar al 55 % y volver al 75 %.',
    key: 'A',
    correct: {
      text: 'Al trabajar vuelve al 55 %; si pierde el empleo y cumple requisitos, vuelve al 75 %',
      rule: 'Mientras trabaja, la total cualificada se percibe al 55 %; si pierde el empleo y sigue cumpliendo los requisitos legales (55 años o más, falta de preparación y circunstancias del mercado), vuelve al 75 %.',
    },
    distractors: [
      { text: 'Queda fijado en el 75 % de forma permanente, aunque la persona trabaje', trap: 'overbroad_statement', why: 'Mientras trabaje, el porcentaje es el 55 %, no el 75 %.' },
      { text: 'Queda reducido al 55 % de forma definitiva, sin posibilidad de volver al 75 %', trap: 'partial_rule_accuracy', why: 'Si pierde el empleo y sigue cumpliendo requisitos, vuelve al 75 %.' },
      { text: 'Baja al 100 % de la base reguladora mientras dure el nuevo empleo', trap: 'wrong_legal_object', why: 'El 100 % corresponde a la absoluta y gran invalidez, no a la total cualificada.' },
    ],
    legal: 'Art. 196.2 TRLGSS',
    cluster: 'cluster_ip_base_reguladora_cuantia',
    pair: 'pair_ip_total_vs_absoluta',
    difficulty: 4,
  },
  {
    stem: '¿Es compatible la pensión de incapacidad permanente total con el desempleo?',
    prompt: 'Examine el supuesto de pérdida involuntaria del nuevo empleo.',
    key: 'C',
    correct: {
      text: 'Sí, si la persona pierde el nuevo empleo de forma involuntaria',
      rule: 'La pensión de incapacidad permanente total es compatible con el desempleo si la persona pierde ese nuevo empleo de forma involuntaria.',
    },
    distractors: [
      { text: 'Nunca es compatible con ninguna prestación de desempleo', trap: 'overbroad_statement', why: 'Es compatible cuando se pierde el nuevo empleo de forma involuntaria.' },
      { text: 'Solo si la persona tiene al menos 55 años y cesó voluntariamente', trap: 'exception_ignored', why: 'La edad y la voluntariedad no son requisitos de esta compatibilidad.' },
      { text: 'Solo cuando se mantiene el porcentaje del 75 %', trap: 'partial_rule_accuracy', why: 'La compatibilidad con el desempleo no depende del porcentaje aplicado a la pensión.' },
    ],
    legal: 'Art. 198 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    difficulty: 4,
  },
  {
    stem: 'Si el INSS considera que debe cambiarse el dictamen, ¿qué documento complementario se emite tras evaluar las alegaciones?',
    prompt: 'Secuencia: dictamen, alegaciones, posible dictamen complementario, resolución.',
    key: 'D',
    correct: {
      text: 'Emite un dictamen-propuesta complementario tras las alegaciones',
      rule: 'Si tras las alegaciones la Dirección Provincial entiende que debe cambiarse el dictamen-propuesta, se elabora un dictamen-propuesta complementario que absorba y tenga en cuenta esas alegaciones.',
    },
    distractors: [
      { text: 'Resuelve directamente sin necesidad de un nuevo dictamen', trap: 'exception_ignored', why: 'No puede apartarse del dictamen sin emitir el complementario correspondiente.' },
      { text: 'Desestima las alegaciones y mantiene el dictamen inicial sin cambios', trap: 'factual_misapplication', why: 'Ignora la posibilidad de modificar el dictamen tras las alegaciones.' },
      { text: 'Devuelve el expediente al EVI sin posibilidad de modificación', trap: 'hyper_narrow_statement', why: 'El INSS no está obligado a devolverlo al EVI; puede emitir el dictamen complementario.' },
    ],
    legal: 'Arts. 195 y RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 4,
  },
  {
    stem: '¿Cuáles son los plazos de alegaciones del interesado y de observación por enfermedad profesional en el procedimiento de incapacidad permanente?',
    prompt: 'Dos plazos diferentes: 15 y 180 días.',
    key: 'B',
    correct: {
      text: '15 días para alegaciones y 180 días de observación médica',
      rule: 'El interesado dispone de 15 días para alegar; en enfermedad profesional el periodo de observación médica es de 180 días.',
    },
    distractors: [
      { text: '10 días para alegaciones y 90 días de observación', trap: 'numeric_substitution', why: 'Intercambia plazos: son 15 y 180, no 10 y 90.' },
      { text: '30 días para alegaciones y 180 días de observación', trap: 'numeric_substitution', why: 'El plazo de alegaciones es de 15 días, no de 30.' },
      { text: '15 días para alegaciones y 90 días de observación', trap: 'numeric_substitution', why: 'El plazo de observación médica en enfermedad profesional es de 180 días, no de 90.' },
    ],
    legal: 'Art. 6 RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 4,
  },
  {
    stem: '¿Quién es el ponente del dictamen-propuesta del equipo de valoración de incapacidades (EVI)?',
    prompt: 'Separe el facultativo que informa de la mutua y del servicio de salud de la comunidad autónoma.',
    key: 'A',
    correct: {
      text: 'Un facultativo médico del INSS',
      rule: 'El ponente del dictamen-propuesta es un facultativo médico del INSS, no el médico de la mutua ni el del servicio de salud de la comunidad autónoma.',
    },
    distractors: [
      { text: 'El médico de la mutua colaboradora', trap: 'wrong_competent_body', why: 'La mutua gestiona el pago, pero no elabora el dictamen-propuesta del EVI.' },
      { text: 'El médico del servicio de salud de la comunidad autónoma', trap: 'wrong_competent_body', why: 'El servicio de salud no es competente para el dictamen-propuesta de incapacidad permanente.' },
      { text: 'El médico de la empresa del interesado', trap: 'wrong_competent_body', why: 'La empresa no interviene en la valoración médica de la incapacidad permanente.' },
    ],
    legal: 'RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_declaracion_vs_pago',
    difficulty: 3,
  },
  {
    stem: '¿Es compatible la incapacidad permanente absoluta con una actividad lucrativa?',
    prompt: 'Con carácter general no, salvo la excepción del art. 128 LGSS.',
    key: 'D',
    correct: {
      text: 'Con carácter general no, salvo el art. 128 LGSS',
      rule: 'La incapacidad permanente absoluta es incompatible con carácter general, pero el art. 128 LGSS admite actividad lucrativa compatible si no cambia la situación de incapacidad.',
    },
    distractors: [
      { text: 'Siempre es compatible con cualquier actividad lucrativa', trap: 'overbroad_statement', why: 'Es incompatible en principio; solo cabe la excepción del art. 128 LGSS.' },
      { text: 'Nunca es compatible con actividad lucrativa alguna', trap: 'overbroad_statement', why: 'Ignora la excepción expresa del art. 128 LGSS.' },
      { text: 'Solo si la actividad es por cuenta ajena', trap: 'partial_rule_accuracy', why: 'La excepción no se limita al trabajo por cuenta ajena.' },
    ],
    legal: 'Arts. 198 y 128 TRLGSS',
    cluster: 'cluster_ip_nacimiento_revision_extincion',
    difficulty: 4,
  },
  {
    stem: '¿Qué establece siempre la resolución que reconoce una incapacidad permanente respecto del plazo de revisión?',
    prompt: 'La resolución fija la fecha de revisión y, si persiste la incapacidad, se renueva.',
    key: 'C',
    correct: {
      text: 'Fija una fecha de revisión, renovada si persiste',
      rule: 'Cada resolución fija una fecha de revisión; si en la revisión persiste la incapacidad, se fija un nuevo plazo de revisión.',
    },
    distractors: [
      { text: 'Nunca fija plazo de revisión en la resolución', trap: 'overbroad_statement', why: 'La resolución siempre fija una fecha de revisión.' },
      { text: 'Solo fija plazo si hay expectativa de mejoría laboral', trap: 'exception_ignored', why: 'El plazo de revisión se fija en toda resolución, no solo ante expectativa de mejoría.' },
      { text: 'Solo fija plazo a petición del interesado', trap: 'partial_rule_accuracy', why: 'No requiere solicitud del interesado; lo fija la resolución de oficio.' },
    ],
    legal: 'RD 1300/1995',
    cluster: 'cluster_ip_lpni_procedimiento',
    pair: 'pair_ip_suspension_vs_extincion',
    difficulty: 3,
  },
  {
    stem: '¿Cuál es la vía de impugnación de una resolución que deniega una pensión de incapacidad permanente?',
    prompt: 'Prestaciones: reclamación previa y luego lo social; afiliación y alta: Ley 39.',
    key: 'B',
    correct: {
      text: 'Reclamación previa y luego Juzgado de lo Social',
      rule: 'Las prestaciones de incapacidad permanente se impugnan mediante reclamación previa a la vía judicial y, tras ella, ante el Juzgado de lo Social.',
    },
    distractors: [
      { text: 'Recurso de alzada ante el mismo INSS que denegó la pensión', trap: 'wrong_competent_body', why: 'La alzada es propia de afiliación, alta y baja (Tema 3), no de prestaciones de incapacidad permanente.' },
      { text: 'Contencioso-administrativo directo, sin reclamación previa', trap: 'rule_exception_swap', why: 'Falta el trámite preceptivo de reclamación previa.' },
      { text: 'Recurso de reposición ante la mutua colaboradora', trap: 'factual_misapplication', why: 'La mutua no conoce de recursos contra resoluciones de reconocimiento de pensión.' },
    ],
    legal: 'Art. 73 LGSS y Ley 39/2015',
    cluster: 'cluster_ip_lpni_procedimiento',
    difficulty: 4,
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
      condition_if_correct: `Solo sería correcta si la regla aplicable estableciera: «${spec.text}».`,
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
    id: `item-t8ip-${index + 1}`,
    topic_id: TOPIC,
    cluster_id: question.cluster,
    confusion_pair_id: question.pair,
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

export const seedItemsTema8IP: Item[] = questionBank.map(makeItem);
