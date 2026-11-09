import type { Item, MCQOption, TrapType, CognitiveOperation } from '../src/types.ts';

/**
 * Tema 9 Específico — Nacimiento y cuidado de menor y prestaciones familiares.
 * 56 items (2026-11-04 gap audit + ampliación a cobertura completa). Source: resumen/notas de clase (4-11) §§1-5,
 * "Supuesto repaso t. 9 especif,.pdf.md" (preguntas oficiales adaptadas),
 * diapositivas T9 y parte 2 (11-04). Clusters/pairs registered in seedDataTema9Meta.ts.
 * Key balance: A=14 / B=14 / C=14 / D=14; no runs >2 (cycle matches global).
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

const TOPIC = 'topic_seguridad_social_tema_9';
const now = '2026-11-04T10:00:00Z';

const questionBank: Question[] = [
  // ── A. Nacimiento contributivo ─────────────────────────────────────────
  {
    stem: '¿Cuál es la regla general para calcular la base reguladora diaria de la prestación por nacimiento y cuidado de menor?',
    prompt: 'Separa la referencia temporal de la división numérica.',
    key: 'A',
    correct: {
      text: 'BR = base de cotización comunes del mes anterior al mes previo; ÷30 (mensual) o ÷365 (parcial 12 meses)',
      rule: 'El art. 179 TRLGSS fija la base reguladora como la base de cotización por contingencias comunes del mes inmediatamente anterior al mes previo al del hecho causante. Si es mensual con alta todo el mes, se divide entre 30 (regla general) o, a tiempo parcial con 12 meses anteriores al mes previo, entre 365 (art. 248).',
    },
    distractors: [
      { text: 'Base del mes inmediatamente anterior al hecho causante, dividida entre 30, sin excepción a tiempo parcial', trap: 'wrong_legal_object', why: 'Omite la regla especial de parcialidad (÷365 con 12 meses) y confunde nacimiento con IT.' },
      { text: 'Base del mes anterior al hecho causante, dividida entre 30 para todo contrato, con horas extraordinarias incluidas', trap: 'conceptual_merger', why: 'La base profesional (IT profesional) incluye horas extraordinarias; la de nacimiento es por contingencias comunes y toma el mes anterior al mes previo.' },
      { text: 'Suma de las bases del mes del hecho causante dividida entre los días transcurridos, siempre que la antigüedad sea inferior a un mes', trap: 'numeric_substitution', why: 'El ingreso en el mismo mes tiene su regla (base del mes ÷ días), pero la regla general es otra; no es la única vía.' },
    ],
    legal: 'Arts. 179 y 248 TRLGSS',
    cluster: 'cluster_nacimiento_br',
    pair: 'pair_br_nacimiento_it',
    difficulty: 3,
  },
  {
    stem: 'Una trabajadora con contrato a tiempo parcial tiene una antigüedad inferior a un año en la empresa. ¿Cómo se calcula la base reguladora diaria para su prestación por nacimiento?',
    prompt: 'Aplica la excepción de tiempo parcial con antigüedad inferior a 12 meses.',
    key: 'B',
    correct: {
      text: 'Suma bases acreditadas en el período <12 meses, ÷ días naturales del período',
      rule: 'El art. 248.b TRLGSS establece que si las bases con anterioridad al mes previo se refieren a un período inferior a 12 meses, la base reguladora diaria es la suma de las bases acreditadas dividida entre los días naturales correspondientes (no entre 365).',
    },
    distractors: [
      { text: 'Suma de las bases de los 12 meses naturales anteriores al mes previo, dividida entre 365', trap: 'rule_exception_swap', why: 'Esa es la regla para 12 meses completos; con 10 meses se divide entre los días naturales del período.' },
      { text: 'Base del mes anterior al mes previo, dividida entre 30, igual que si fuera a tiempo completo', trap: 'partial_rule_accuracy', why: 'El tiempo parcial siempre aplica la suma de bases sobre período; nunca el mes único con ÷30.' },
      { text: 'Suma de bases de los 7 años anteriores, dividida entre 2.555 días naturales', trap: 'numeric_substitution', why: 'No existe esa fórmula; mezcla el cómputo de la carencia con la base reguladora.' },
    ],
    legal: 'Art. 248.b TRLGSS',
    cluster: 'cluster_nacimiento_br',
    pair: 'pair_br_nacimiento_it',
    difficulty: 4,
  },
  {
    stem: 'Una trabajadora adelanta su descanso antes del nacimiento esperado para la fecha prevista. ¿Qué referencia temporal rige para verificar si acredita el período mínimo de cotización?',
    prompt: 'Separa la edad (inicio del descanso) de la carencia (fecha probable del parto).',
    key: 'C',
    correct: {
      text: 'A la fecha probable del parto (20/06/2025), no a la fecha real de inicio del descanso',
      rule: 'El art. 178 TRLGSS exige que la edad se verifique al inicio del descanso, pero que la carencia se acredite con referencia a la fecha probable del parto, computándose como cotizados los días intermedios.',
    },
    distractors: [
      { text: 'A la fecha real de inicio del descanso (10/06/2025) tanto para la edad como para la carencia', trap: 'wrong_start_date', why: 'El descanso anticipado fija la edad al inicio, pero la carencia se referencia a la fecha probable del parto.' },
      { text: 'A la fecha del nacimiento efectivo, con independencia de la fecha probable', trap: 'temporal_confusion', why: 'Si el descanso se anticipa, la norma proyecta la carencia a la fecha probable, no al nacimiento real.' },
      { text: 'A la fecha de la solicitud de la prestación', trap: 'factual_misapplication', why: 'La carencia se verifica al inicio del descanso o a la fecha probable, no a la solicitud.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    pair: 'pair_br_nacimiento_it',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se distribuye el período de suspensión por nacimiento en una familia biparental según el art. 48 ET y el art. 8 RD 295/2009?',
    prompt: 'Identifica los tres tramos: obligatorio, voluntario y parental.',
    key: 'D',
    correct: {
      text: '6 obligatorias + 11 voluntarias + 2 parentales (hasta 8 años)',
      rule: 'El art. 48 ET y el art. 8 RD 295/2009 establecen: 6 semanas obligatorias inmediatamente posteriores; 11 voluntarias a distribuir en los 12 meses siguientes; y 2 semanas parentales (aplicable a hechos causantes a partir del 2/08/2024) a disfrutar en períodos semanales hasta los 8 años.',
    },
    distractors: [
      { text: '16 semanas obligatorias y 3 de cuidado, sin tramos interrumpidos', trap: 'conceptual_merger', why: 'Esa es la estructura anterior; la actual separa 6 obligatorias, 11 voluntarias y 2 parentales.' },
      { text: '19 semanas continuas sin posibilidad de interrupción ni de disfrute hasta los 8 años', trap: 'overbroad_statement', why: 'Las 11 voluntarias pueden ser interrumpidas y acumuladas; y las 2 parentales se extienden hasta los 8 años.' },
      { text: '6 semanas obligatorias + 13 voluntarias + 0 parentales, con un límite total de 16 semanas', trap: 'numeric_precision', why: 'Los números de semanas voluntarias (11) y parentales (2) son distintos; el límite total es 19.' },
    ],
    legal: 'Art. 48 ET; Art. 8 RD 295/2009',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 3,
  },
  {
    stem: 'Un neonato requiere hospitalización clínica de 10 días tras un parto normal. ¿Cómo afecta esta situación al período de suspensión?',
    prompt: 'Aplica la ampliación por hospitalización neonatal y su límite.',
    key: 'A',
    correct: {
      text: 'Se amplía en tantos días de hospitalización, con un máximo de 13 semanas adicionales',
      rule: 'El art. 8 RD 295/2009 establece que si el neonato precisa hospitalización por período superior a siete días, la suspensión se amplía en tantos días como esté hospitalizado, con un máximo de 13 semanas adicionales.',
    },
    distractors: [
      { text: 'Se amplía solo si la hospitalización supera los 14 días, con tope de 16 semanas', trap: 'numeric_precision', why: 'El umbral es superior a 7 días (no 14) y el tope es de 13 semanas adicionales (no 16).' },
      { text: 'Se amplía en 7 días adicionales, independientemente de la duración real de la hospitalización', trap: 'exception_ignored', why: 'Se amplía en tantos días como esté hospitalizado; los 7 días son el umbral de activación, no el límite.' },
      { text: 'No afecta porque la ampliación solo opera en partos prematuros con falta de peso', trap: 'rule_exception_swap', why: 'El art. 8 cubre tanto el parto prematuro con falta de peso como cualquier otra condición clínica que requiera hospitalización.' },
    ],
    legal: 'Art. 8 RD 295/2009',
    cluster: 'cluster_nacimiento_casos',
    difficulty: 3,
  },
  {
    stem: '¿Cuál de estas afirmaciones describe correctamente la gestión y el pago del subsidio por nacimiento?',
    prompt: 'Contrasta con el pago delegado de la incapacidad temporal.',
    key: 'B',
    correct: {
      text: 'El INSS o ISM lo abona directamente; la empresa no colabora en la gestión ni realiza pago delegado',
      rule: 'El art. 12 RD 295/2009 establece que el pago lo realiza directamente la entidad gestora, sin que quepa fórmula alguna de colaboración (pago delegado) por parte de las empresas.',
    },
    distractors: [
      { text: 'La empresa realiza el pago delegado a partir del día 16, como en la IT ordinaria', trap: 'factual_misapplication', why: 'En nacimiento no existe pago delegado; es siempre directo de INSS/ISM.' },
      { text: 'La mutua colaboradora asume el pago completo desde el primer día, con retención de la cuota obrera', trap: 'wrong_competent_body', why: 'La mutua no interviene en nacimiento (es gestión exclusiva del INSS/ISM); la retención es del INSS.' },
      { text: 'El empresario ingresa la cuota patronal y la cuota obrera, y después la entidad gestora reembolsa', trap: 'overbroad_statement', why: 'La empresa ingresa solo la cuota patronal; la cuota obrera la retiene y abona directamente el INSS.' },
    ],
    legal: 'Art. 12 RD 295/2009; Art. 180 TRLGSS',
    cluster: 'cluster_nacimiento_no_delegado',
    difficulty: 3,
  },
  {
    stem: 'Durante el descanso por nacimiento, la relación laboral se extingue. ¿Qué ocurre con la prestación?',
    prompt: 'Aplica la interacción entre nacimiento y desempleo según el art. 284.',
    key: 'C',
    correct: {
      text: 'Agota nacimiento completo; luego desempleo sin consumo de días',
      rule: 'El art. 284 TRLGSS establece que si durante el nacimiento se extingue el contrato (situación legal de desempleo), la persona continúa percibiendo el nacimiento hasta agotar su duración máxima y luego pasa al desempleo sin descuento del período de percepción contributiva.',
    },
    distractors: [
      { text: 'Se interrumpe inmediatamente y se pasa al desempleo desde el día siguiente al despido', trap: 'temporal_confusion', why: 'No se interrumpe: se agota primero el descanso completo.' },
      { text: 'El período de nacimiento se descuenta del período de desempleo a razón de un día por cada semana de descanso', trap: 'numeric_substitution', why: 'No se descuenta ningún día; la norma dice expresamente "sin que se descuente ni consuma un solo día".' },
      { text: 'Se suspende el nacimiento y se reanuda tras el desempleo, con un límite de 365 días totales', trap: 'conceptual_merger', why: 'No hay suspensión y reanudación; hay continuidad hasta agotar el descanso y transición sin consumo.' },
    ],
    legal: 'Art. 284 TRLGSS',
    cluster: 'cluster_nacimiento_desempleo',
    pair: 'pair_subsidio_nc_14',
    difficulty: 3,
  },
  // ── A. Nacimiento contributivo — caso singular (1) ────────────────────
  {
    stem: 'Durante el descanso por nacimiento fallece el recién nacido. ¿Cuál es el efecto sobre la duración del permiso y sobre la prestación económica?',
    prompt: 'Separa el efecto del fallecimiento del menor del efecto del fallecimiento del progenitor.',
    key: 'B',
    correct: {
      text: 'No se reduce el descanso (19/32 semanas); reincorporación voluntaria tras 6 obligatorias',
      rule: 'El art. 8 RD 295/2009 establece que en caso de fallecimiento del menor, el período de suspensión no se verá reducido, salvo que una vez concluidas las 6 semanas obligatorias se solicite la reincorporación. El art. 48 ET confirma que el período completo se mantiene y que, si fallece un progenitor, el supérstite puede hacer uso de la parte restante.',
    },
    distractors: [
      { text: 'Se reduce proporcionalmente al tiempo transcurrido hasta el fallecimiento, con devolución del subsidio percibido', trap: 'factual_misapplication', why: 'No hay reducción ni devolución; el descanso se mantiene completo.' },
      { text: 'El período se extingue inmediatamente con devolución de lo percibido, salvo que el otro progenitor solicite la parte restante', trap: 'rule_exception_swap', why: 'No se extingue inmediatamente; se mantiene completo, y el otro progenitor puede usar la parte restante solo si fallece un progenitor (no el menor).' },
      { text: 'Se suspende el período de descanso y se reanuda si nace otro menor en los 12 meses siguientes', trap: 'conceptual_merger', why: 'No existe suspensión ni reanudación; el derecho es individual e intransferible y no depende de un nuevo nacimiento.' },
    ],
    legal: 'Art. 8 RD 295/2009; Art. 48 ET',
    cluster: 'cluster_nacimiento_casos',
    difficulty: 3,
  },
  // ── B. Subsidio no contributivo (2) ──────────────────────────────────
  {
    stem: '¿Cuál es la duración del subsidio no contributivo por nacimiento y cuidado de menor en su situación ordinaria?',
    prompt: 'Se refiere al descanso obligatorio únicamente.',
    key: 'A',
    correct: {
      text: '42 días naturales (6 semanas ininterrumpidas tras el parto)',
      rule: 'El art. 182 TRLGSS fija que la duración coincide con el período de descanso obligatorio: 42 días naturales (6 semanas) a jornada completa inmediatamente tras el parto o resolución de adopción/acogimiento.',
    },
    distractors: [
      { text: '56 días naturales, que es el máximo con ampliación incluida', trap: 'numeric_precision', why: '56 es el tope con los 14 días adicionales; la duración base es 42.' },
      { text: '19 semanas, igual que la prestación contributiva ordinaria', trap: 'conceptual_merger', why: 'La contributiva cubre 19 semanas; la no contributiva solo el descanso obligatorio (42 días).' },
      { text: '30 días naturales, equivalentes al mes natural posterior al hecho causante', trap: 'numeric_substitution', why: 'No existe ese período; el descanso obligatorio es 6 semanas (42 días naturales).' },
    ],
    legal: 'Art. 182 TRLGSS',
    cluster: 'cluster_subsidio_nc',
    pair: 'pair_subsidio_nc_14',
    difficulty: 2,
  },
  {
    stem: '¿En qué supuestos y con qué límite se incrementa la duración del subsidio no contributivo?',
    prompt: 'Identifica los 4 supuestos y la regla de no acumulación.',
    key: 'D',
    correct: {
      text: '+14 días naturales no acumulables (numerosa, monoparental, múltiple, disc. ≥65%)',
      rule: 'El art. 182 TRLGSS establece un incremento de 14 días naturales en 4 supuestos tasados (numerosa, monoparental, múltiple, discapacidad ≥65%). La ampliación solo procede una vez, con independencia de que concurran varias situaciones simultáneamente (máx. 56 días).',
    },
    distractors: [
      { text: '14 días por cada supuesto concurrente, con máximo de 42 días adicionales', trap: 'rule_exception_swap', why: 'Los 14 días no se acumulan; solo se aplica una vez, aunque concurran varias causas.' },
      { text: '21 días naturales adicionales si concurren al menos dos supuestos, con tope de 63 días totales', trap: 'numeric_substitution', why: 'No existe ese cómputo; la norma fija 14 días adicionales únicos.' },
      { text: '7 días naturales por cada hijo a partir del segundo, acumulables hasta 28 días', trap: 'partial_rule_accuracy', why: 'Los 7 días corresponden al umbral de hospitalización neonatal (art. 8 RD 295/2009), no a la ampliación del no contributivo.' },
    ],
    legal: 'Art. 182 TRLGSS',
    cluster: 'cluster_subsidio_nc',
    difficulty: 3,
  },
  // ── C. Ejercicio corresponsable del lactante (2) ────────────────────────
  {
    stem: 'Según los arts. 183-184 TRLGSS, ¿quién puede ser beneficiario económico del subsidio por ejercicio corresponsable del cuidado del lactante?',
    prompt: 'Separa el derecho laboral (reducir) del económico (cobrar).',
    key: 'B',
    correct: {
      text: 'Solo uno de los progenitores, aunque ambos reduzcan la jornada en media hora',
      rule: 'El art. 184 TRLGSS establece que cuando concurran en ambos progenitores las circunstancias para ser beneficiarios, el derecho a percibirla solo podrá ser reconocido a favor de uno de ellos.',
    },
    distractors: [
      { text: 'Ambos progenitores, siempre que acrediten los requisitos, dividiendo la cuantía por mitades iguales', trap: 'factual_misapplication', why: 'Ambos pueden reducir, pero solo uno percibe el subsidio; no hay división automática por mitades.' },
      { text: 'Solo la madre biológica, dado que el lactante es menor de 12 meses', trap: 'wrong_legal_object', why: 'El subsidio puede reconocerse al padre o a la madre; no hay reserva por género.' },
      { text: 'Ninguno, porque el cuidado del lactante es un permiso retribuido por la empresa', trap: 'conceptual_merger', why: 'No es pago de empresa: es subsidio del INSS equivalente al 100% de la BR de IT comunes.' },
    ],
    legal: 'Arts. 183-184 TRLGSS',
    cluster: 'cluster_lactante',
    pair: 'pair_lactante_titularidad',
    difficulty: 3,
  },
  {
    stem: '¿Cuál es la naturaleza de la prestación económica por ejercicio corresponsable del lactante y cuándo se extingue?',
    prompt: 'Contrasta con la base reguladora de nacimiento.',
    key: 'C',
    correct: {
      text: '100% BR IT comunes, proporcional a media hora; extinción a los 12 meses',
      rule: 'El art. 185 TRLGSS fija el subsidio como 100% de la base reguladora de IT por contingencias comunes, en proporción a la reducción de jornada (media hora), y establece que se extingue cuando el menor cumpla 12 meses.',
    },
    distractors: [
      { text: 'Subsidio del 75% de la BR de IT por contingencias profesionales, proporcional, hasta los 18 meses', trap: 'wrong_legal_object', why: 'Es el 100% de contingencias comunes (no 75% ni profesional), y el límite es 12 meses (no 18).' },
      { text: 'Subsidio del 50% de la BR de nacimiento, en proporción a la reducción, hasta los 8 años', trap: 'conceptual_merger', why: 'Mezcla la base reguladora de nacimiento con la de IT comunes y confunde el límite con el del permiso parental (8 años).' },
      { text: 'Subsidio equivalente al 100% del IPREM diario, sin referencia a la base reguladora', trap: 'numeric_substitution', why: 'Esa es la regla del subsidio no contributivo (IPREM); el corresponsable toma la BR de IT comunes.' },
    ],
    legal: 'Arts. 184-185 TRLGSS; Art. 48.f TREBEP',
    cluster: 'cluster_lactante',
    pair: 'pair_lactante_titularidad',
    difficulty: 3,
  },
  // ── D. Riesgos embarazo / lactancia (3) ─────────────────────────────────
  {
    stem: 'Según los arts. 186-187 TRLGSS, ¿qué requisitos y cuantía corresponde a la prestación por riesgo durante el embarazo?',
    prompt: 'Separa los requisitos de acceso (adaptación/reubicación) de la cuantía.',
    key: 'A',
    correct: {
      text: 'Profesional; 100% BR IT profesional; sin carencia; adaptación/reubicación imposible',
      rule: 'El art. 186 TRLGSS define la situación protegida como la suspensión cuando la adaptación o cambio a puesto compatible no resulte técnica u objetivamente posible. El art. 187 establece la cuantía como 100% de la BR de IT por contingencias profesionales, sin carencia previa.',
    },
    distractors: [
      { text: 'Contingencia común; 75% de la BR de IT común; carencia de 180 días en los 5 años anteriores', trap: 'conceptual_merger', why: 'Confunde con IT por enfermedad común; el riesgo embarazo es profesional (sin carencia, 100%).' },
      { text: 'Contingencia profesional; 100% de la BR, pero sin requisito de imposibilidad de adaptación', trap: 'partial_rule_accuracy', why: 'Falta el requisito esencial: debe ser técnica u objetivamente imposible la adaptación o recolocación.' },
      { text: 'Contingencia profesional; 100% de la BR de IT por contingencias comunes, con horas extraordinarias', trap: 'wrong_legal_object', why: 'El 100% es sobre la BR profesional (que incluye horas extraordinarias), no la común.' },
    ],
    legal: 'Arts. 186-187 TRLGSS; Art. 26.3 LPRL',
    cluster: 'cluster_riesgos',
    pair: 'pair_riesgo_embarazo_lactancia',
    difficulty: 4,
  },
  {
    stem: '¿Cuál es la regla de extinción de la prestación por riesgo durante la lactancia natural según el art. 189 TRLGSS?',
    prompt: 'Identifica el límite temporal y la excepción por reincorporación.',
    key: 'B',
    correct: {
      text: 'Se extingue cuando el hijo cumple 9 meses, salvo reincorporación anterior, en cuyo caso se extingue el día anterior',
      rule: 'El art. 189 TRLGSS establece que la prestación por riesgo durante la lactancia natural se extingue en el momento en que el hijo cumpla nueve meses, salvo que la beneficiaria se haya reincorporado con anterioridad a su puesto anterior o a otro compatible, en cuyo caso se extingue el día anterior a dicha reincorporación.',
    },
    distractors: [
      { text: 'Se extingue a los 12 meses, salvo reincorporación anterior, en cuyo caso se extingue el mismo día del reingreso', trap: 'numeric_precision', why: 'El límite es 9 meses (no 12) y la extinción es el día anterior (no el mismo día).' },
      { text: 'Se extingue en el momento en que la trabajadora deja la lactancia natural, sin límite de edad del menor', trap: 'rule_exception_swap', why: 'Aunque cesa la lactancia, la ley fija el límite preclusivo de 9 meses; no es indefinido.' },
      { text: 'Se mantiene mientras subsistan las condiciones de riesgo en el puesto, sin límite temporal preclusivo', trap: 'overbroad_statement', why: 'Aunque subsista el riesgo, la ley impone el límite ineludible de 9 meses.' },
    ],
    legal: 'Art. 189 TRLGSS',
    cluster: 'cluster_riesgos',
    pair: 'pair_riesgo_embarazo_lactancia',
    difficulty: 3,
  },
  {
    stem: '¿Qué diferencia existe entre la base reguladora del riesgo durante el embarazo y la del nacimiento y cuidado de menor?',
    prompt: 'Compara la referencia a la base de IT (profesional vs. comunes) y el divisor.',
    key: 'D',
    correct: {
      text: 'BR riesgo: profesional (incluye horas extras); BR nacimiento: comunes (mes anterior al mes previo, ÷30 o ÷365 parcial)',
      rule: 'El art. 187 TRLGSS remite a la BR de IT por contingencias profesionales (que computa horas extraordinarias). El art. 179 TRLGSS remite a la base de cotización por contingencias comunes del mes anterior al mes previo, sin horas extraordinarias.',
    },
    distractors: [
      { text: 'Ambas toman la misma referencia temporal (mes anterior al mes previo) y el mismo divisor (30)', trap: 'factual_misapplication', why: 'El riesgo embarazo toma la BR profesional (no el mes anterior al mes previo con ÷30 como regla general).' },
      { text: 'Riesgo embarazo toma la base de contingencias comunes sin horas extraordinarias; nacimiento incluye horas extraordinarias', trap: 'conceptual_merger', why: 'Es al revés: el riesgo (profesional) incluye horas extraordinarias; el nacimiento (común) no.' },
      { text: 'Ambas exigen carencia previa de 180 días en los 5 años anteriores, con la misma base de cálculo', trap: 'numeric_substitution', why: 'El riesgo embarazo no exige carencia (contingencia profesional); y la base de cálculo es distinta.' },
    ],
    legal: 'Arts. 179, 187 TRLGSS',
    cluster: 'cluster_riesgos',
    pair: 'pair_br_nacimiento_it',
    difficulty: 4,
  },
  // ── E. Asignación por hijo con discapacidad (3) ──────────────────────
  {
    stem: 'Según los arts. 351-352 TRLGSS, ¿cuáles son los requisitos de acceso para la asignación económica por hijo con discapacidad?',
    prompt: 'Separa el requisito del menor (<18 o >18) del requisito de convivencia y del límite de ingresos.',
    key: 'A',
    correct: {
      text: 'Acceso: <18 ≥33% / >18 ≥65%; convivencia; ingresos trabajo ≤100% SMI anual',
      rule: 'El art. 351 TRLGSS establece: hijo menor de 18 años con discapacidad ≥33%, o mayor con ≥65%. El art. 352 y art. 9 RD 1335/2005 exigen convivencia, dependencia económica y que los rendimientos del trabajo no superen el 100% del SMI anual.',
    },
    distractors: [
      { text: 'Cualquier hijo mayor de 18 años con discapacidad ≥33%, sin límite de ingresos por trabajo', trap: 'numeric_precision', why: 'A partir de los 18 años se exige ≥65% (no 33%) y sigue operando el límite del 100% del SMI.' },
      { text: 'Solo hijos menores de edad (≤17 años) con cualquier grado de discapacidad acreditado', trap: 'overbroad_statement', why: 'El acceso cubre también a mayores de 18 con ≥65%, y al menor de 18 se le exige ≥33% (no cualquier grado).' },
      { text: 'No es necesario que el hijo conviva con el beneficiario, siempre que exista filiación biológica o adoptiva', trap: 'factual_misapplication', why: 'La convivencia es requisito esencial; la separación transitoria (estudios, tratamiento) no rompe la convivencia.' },
    ],
    legal: 'Arts. 351-353 TRLGSS; Art. 9 RD 1335/2005',
    cluster: 'cluster_asignacion_discapacidad',
    pair: 'pair_asignacion_discapacidad_tramos',
    difficulty: 3,
  },
  {
    stem: 'Un hijo de 30 años con discapacidad del 67% recibe una prestación contributiva por incapacidad permanente. ¿Tiene el progenitor derecho a la asignación económica por hijo a cargo?',
    prompt: 'Aplica las incompatibilidades con pensiones contributivas.',
    key: 'C',
    correct: {
      text: 'No, porque el hijo percibe una pensión contributiva distinta de la orfandad o favor de familiares',
      rule: 'El art. 9 RD 1335/2005 establece que el hijo no se considera a cargo si percibe una pensión contributiva distinta de la pensión de orfandad o de la pensión en favor de familiares.',
    },
    distractors: [
      { text: 'Sí, porque la discapacidad del 67% supera el umbral del 65% para mayores de 18 años', trap: 'exception_ignored', why: 'Aunque el porcentaje supera el umbral, la percepción de pensión contributiva (no exceptuada) lo excluye.' },
      { text: 'Sí, siempre que sus ingresos anuales no superen el 100% del SMI, con independencia de la pensión', trap: 'partial_rule_accuracy', why: 'La regla del límite del SMI opera cuando no hay pensión contributiva incompatible; aquí hay una pensión que lo excluye.' },
      { text: 'Sí, porque la incapacidad absoluta es una prestación no contributiva', trap: 'conceptual_merger', why: 'La incapacidad absoluta es contributiva (no es la excepción de orfandad/favor de familiares); por tanto, es incompatible.' },
    ],
    legal: 'Arts. 351-353 TRLGSS; Art. 9 RD 1335/2005',
    cluster: 'cluster_asignacion_discapacidad',
    pair: 'pair_asignacion_discapacidad_tramos',
    difficulty: 3,
  },
  {
    stem: 'En la asignación por hijo con discapacidad, ¿existe un tramo de cuantía vinculado al 75%?',
    prompt: 'Distingue los requisitos de acceso (2 tramos) de las cuantías económicas (3 tramos).',
    key: 'D',
    correct: {
      text: 'Cuantía: 3 tramos (33%, 65%, 75% + concurso 3ª persona) en la LPGE',
      rule: 'El art. 353 TRLGSS fija tres cuantías en la LPGE: menor <18 con ≥33%, mayor con ≥65%, y mayor con ≥75% que requiera concurso de tercera persona para actos esenciales. El acceso tiene dos requisitos (edad/discapacidad); la cuantía tiene tres tramos.',
    },
    distractors: [
      { text: 'No: el 75% es un requisito de acceso adicional al 65%, que aumenta la cuantía en un 15% fijo', trap: 'conceptual_merger', why: 'El 75% no es un requisito de acceso adicional; es un tramo de cuantía con la condición del concurso de tercera persona.' },
      { text: 'Sí, pero solo para menores de 18 años con discapacidad igual o superior al 75%', trap: 'rule_exception_swap', why: 'El tramo del 75% opera para mayores de 18 años con necesidad de tercera persona.' },
      { text: 'No existe ningún tramo vinculado al 75%; solo hay dos cuantías: 33% y 65%', trap: 'factual_misapplication', why: 'La ley reconoce tres cuantías; la tercera es la del 75% con concurso de tercera persona.' },
    ],
    legal: 'Arts. 351-353 TRLGSS',
    cluster: 'cluster_asignacion_discapacidad',
    pair: 'pair_asignacion_discapacidad_tramos',
    difficulty: 3,
  },
  // ── F. Prestaciones de pago único (2) ──────────────────────────────────
  {
    stem: 'Según el art. 357 TRLGSS, ¿cuáles son los supuestos que permiten acceder al pago único de 1.000 €?',
    prompt: 'Identifica los 3 supuestos causantes.',
    key: 'A',
    correct: {
      text: 'Nacimiento o adopción en familia numerosa, monoparental o con progenitor con discapacidad ≥65%',
      rule: 'El art. 357 TRLGSS establece el derecho a una prestación de 1.000 € en los casos de nacimiento o adopción en España cuando concurra: familia numerosa (o que adquiera tal condición), familia monoparental (un solo progenitor que actúe como sustentador único), o progenitor con discapacidad reconocida ≥65%.',
    },
    distractors: [
      { text: 'Solo en familias monoparentales con progenitor con discapacidad ≥65% y con al menos dos hijos nacidos', trap: 'conceptual_merger', why: 'Cada supuesto opera de forma independiente; no exigen concurrencia.' },
      { text: 'Solo cuando el progenitor tenga discapacidad ≥65% y la familia tenga al menos tres hijos', trap: 'overbroad_statement', why: 'La numerosa opera con independencia de la discapacidad del progenitor; el límite de ingreso es distinto.' },
      { text: 'En cualquier nacimiento o adopción con residencia legal, sin límite de ingresos y sin exclusión por otros regímenes', trap: 'exception_ignored', why: 'Se exige límite de ingresos (LPGE, +15% por hijo desde el 2º) y no tener prestaciones análogas en otros regímenes.' },
    ],
    legal: 'Art. 357 TRLGSS; Ley 40/2003',
    cluster: 'cluster_pagos_unicos',
    difficulty: 2,
  },
  {
    stem: 'Según los arts. 359-360 TRLGSS, ¿cuál es la cuantía del pago único por parto o adopción múltiple?',
    prompt: 'Asocia el número de hijos con el multiplicador del SMI mensual.',
    key: 'B',
    correct: {
      text: '2 hijos → 4 veces SMI; 3 hijos → 8 veces SMI; 4 o más → 12 veces SMI',
      rule: 'El art. 360 TRLGSS fija: 2 nacidos/adoptados = 4 × SMI mensual; 3 = 8 × SMI; 4 o más = 12 × SMI. No exige límite de rentas ni carencia de cotización.',
    },
    distractors: [
      { text: '2 hijos → 4 veces; 3 hijos → 6 veces; 4 o más → 8 veces', trap: 'numeric_substitution', why: 'Los multiplicadores son 4, 8 y 12; no existe el valor intermedio de 6.' },
      { text: 'El pago es proporcional al número de hijos, a razón de 2 veces el SMI por cada hijo a partir del primero', trap: 'partial_rule_accuracy', why: 'No es proporcional lineal; opera por escalones fijos (4, 8, 12).' },
      { text: 'Se aplica el mismo límite de ingresos que al pago único por numerosa o monoparental', trap: 'wrong_legal_object', why: 'El pago por múltiple no exige límite de rentas (art. 359); el de numerosa/monoparental sí (art. 357).' },
    ],
    legal: 'Arts. 359-360 TRLGSS',
    cluster: 'cluster_pagos_unicos',
    difficulty: 2,
  },
  // ── G. Cuidado menores con cáncer/enfermedad grave (4) ────────────────
  {
    stem: 'Según el art. 190 TRLGSS, ¿qué requisitos y límites se exigen para la reducción de jornada por cuidado de menor afectado por cáncer?',
    prompt: 'Contrasta "al menos el 50%" con "hasta el 50%" y el requisito de trabajo conjunto.',
    key: 'C',
    correct: {
      text: 'Reducción ≥50% y ≤99%; trabajo conjunto o monoparental; informe SPS; hospitalización o tratamiento continuado',
      rule: 'El art. 190 TRLGSS y art. 37.6 ET exigen una reducción de jornada de al menos el 50% y hasta el 99%, llevada a cabo por los progenitores cuando ambos trabajen (o monoparental/excepciones: nulidad, separación, violencia de género), para el cuidado directo y permanente del menor afectado por cáncer u otra enfermedad grave que requiera hospitalización o tratamiento continuado.',
    },
    distractors: [
      { text: 'Reducción de hasta el 50%, con trabajo conjunto obligatorio y límite de edad de 18 años', trap: 'rule_exception_swap', why: 'La ley exige "al menos el 50%" (suelo mínimo, no tope máximo de 50%). El límite de edad puede extenderse (23, 26, indefinida).' },
      { text: 'Reducción entre el 50% y el 75%, con informe de la empresa, y solo para menores de 14 años', trap: 'factual_misapplication', why: 'El límite superior es 99% (no 75%); el informe es del SPS (no de la empresa); el límite ordinario es 18 años.' },
      { text: 'No es necesario que ambos progenitores trabajen; basta con que el menor esté hospitalizado', trap: 'partial_rule_accuracy', why: 'Aunque hay excepciones (monoparental, violencia, etc.), la regla general exige trabajo conjunto de ambos.' },
    ],
    legal: 'Arts. 190 TRLGSS; Art. 37.6 ET',
    cluster: 'cluster_cuidado_cancer',
    pair: 'pair_lactante_titularidad',
    difficulty: 4,
  },
  {
    stem: 'Según los arts. 190-191 TRLGSS, ¿cuáles son los límites de edad y las prórrogas para el cuidado de menores con cáncer o enfermedad grave?',
    prompt: 'Identifica los tres cortes de edad y la prórroga extraordinaria.',
    key: 'D',
    correct: {
      text: 'Límites: 18 años; extensión 23 (diagnóstico <18); 26 con ≥65% (<23); indefinida con ≥65% o Grado III',
      rule: 'El art. 190.3 TRLGSS fija: regla ordinaria hasta 18 años; extensión a 23 años si la enfermedad fue diagnosticada antes de los 18; hasta 26 si antes de los 23 se acredita discapacidad ≥65%; y prórroga extraordinaria indefinida si mantiene ≥65% o Grado III de dependencia, con convivencia y cuidado continuado.',
    },
    distractors: [
      { text: 'Hasta 18 años con extensión a 23 siempre, sin condición del momento del diagnóstico', trap: 'exception_ignored', why: 'La extensión a 23 requiere que el diagnóstico se hubiera realizado antes de cumplir los 18 años.' },
      { text: 'Hasta 26 años con discapacidad ≥33%, y luego indefinida si persiste el tratamiento hospitalario', trap: 'numeric_precision', why: 'A los 26 años se exige discapacidad ≥65% (no 33%); y para la prórroga indefinida se requiere ≥65% o Grado III, no solo tratamiento.' },
      { text: 'No existe límite de edad si persiste la hospitalización, con independencia de la edad y la discapacidad', trap: 'overbroad_statement', why: 'El límite ordinario es 18 años; la extensión a 23 requiere diagnóstico previo; a 26 requiere discapacidad y diagnóstico previo.' },
    ],
    legal: 'Arts. 190-191 TRLGSS',
    cluster: 'cluster_cuidado_cancer',
    pair: 'pair_riesgo_embarazo_lactancia',
    difficulty: 3,
  },
  {
    stem: 'Según el art. 192 TRLGSS, ¿cuál es la cuantía de la prestación por cuidado simultáneo de la misma persona por ambos progenitores?',
    prompt: 'Contrasta con la cuantía individual del 100%.',
    key: 'A',
    correct: {
      text: 'Simultáneo: cada progenitor percibe 50% de su BR profesional',
      rule: 'El art. 192 TRLGSS establece que en disfrute simultáneo por ambas personas, cada una percibe un subsidio equivalente al 50% de su respectiva base reguladora de IT por contingencias profesionales, al margen del porcentaje de reducción horaria individual.',
    },
    distractors: [
      { text: 'Ambos perciben el 100% de su base, repartido al 50% entre ellos, con el mismo porcentaje de reducción', trap: 'factual_misapplication', why: 'Cada uno percibe el 50% de su propia base; no hay reparto conjunto ni exigencia de igual reducción.' },
      { text: 'Cada uno percibe el 100% de su base si su reducción es igual o superior al 99%, con límite total del 150%', trap: 'numeric_substitution', why: 'No existe ese límite; siempre es 50% de la base individual, con independencia de la reducción.' },
      { text: 'Ninguno percibe subsidio porque el cuidado simultáneo no está permitido por la ley', trap: 'conceptual_merger', why: 'El art. 192 permite expresamente el disfrute simultáneo con el 50% cada uno.' },
    ],
    legal: 'Art. 192 TRLGSS',
    cluster: 'cluster_cuidado_cancer',
    difficulty: 4,
  },
  {
    stem: 'Respecto al cuidado de menores con enfermedad grave, ¿qué régimen normativo aplica al personal incluido en un estatuto de empleo público?',
    prompt: 'Contrasta con el régimen general (subsidio de la Seguridad Social).',
    key: 'B',
    correct: {
      text: 'Funcionarios: licencia retribuida art. 49.e TREBEP (reserva puesto, retribuciones completas)',
      rule: 'El art. 190.5 TRLGSS establece que las previsiones de este capítulo no son aplicables a los funcionarios públicos, que se rigen por el art. 49.e TREBEP y su normativa de desarrollo: licencia retribuida con reserva de puesto y retribuciones completas.',
    },
    distractors: [
      { text: 'Genera el mismo subsidio (100% BR profesional) con gestión por la mutua, sin exclusión', trap: 'wrong_legal_object', why: 'El TREBEP regula su propio régimen; los funcionarios no reciben el subsidio del art. 192.' },
      { text: 'No genera ningún tipo de permiso ni licencia, ni retribuido ni no retribuido', trap: 'overbroad_statement', why: 'Sí genera la licencia retribuida del art. 49.e TREBEP; lo que no genera es el subsidio de la SS.' },
      { text: 'El subsidio se reduce al 50% de la base reguladora, gestionado por el INSS', trap: 'partial_rule_accuracy', why: 'No hay subsidio de la SS para funcionarios; la licencia es retribuida al 100% por el empleador público.' },
    ],
    legal: 'Art. 49.e TREBEP; Art. 190 TRLGSS',
    cluster: 'cluster_cuidado_cancer',
    difficulty: 3,
  },
  {
    stem: '¿Cuáles son las situaciones protegidas por la prestación contributiva por nacimiento según el art. 177 TRLGSS y el art. 48 ET?',
    prompt: 'Enumera las cuatro situaciones: nacimiento, adopción, guarda y acogimiento.',
    key: 'C',
    correct: {
      text: 'Nacimiento (incluido gestación trans), adopción, guarda con fines de adopción y acogimiento familiar',
      rule: 'El art. 177 TRLGSS y art. 48 ET protegen los descansos por nacimiento (incluidas personas trans gestantes), adopción, guarda con fines de adopción y acogimiento familiar conforme al Código Civil o leyes autonómicas, durante los períodos de suspensión del art. 48 ET.',
    },
    distractors: [
      { text: 'Solo nacimiento por parto biológico y adopción plena, excluyendo la guarda y el acogimiento', trap: 'overbroad_statement', why: 'La guarda con fines de adopción y el acogimiento familiar también están protegidos.' },
      { text: 'Nacimiento, adopción, guarda y acogimiento, pero solo si el menor tiene menos de 4 años', trap: 'numeric_substitution', why: 'El límite general es 6 años; la regla especial llega hasta los 18 con discapacidad o dificultades.' },
      { text: 'Nacimiento y adopción únicamente, dado que la guarda y el acogimiento son temporales', trap: 'wrong_legal_object', why: 'La norma cubre expresamente las cuatro situaciones, con requisitos diferenciados para cada una.' },
    ],
    legal: 'Art. 177 TRLGSS; Art. 48 ET',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 2,
  },
  {
    stem: '¿Cómo se acredita la fecha del hecho causante en los supuestos de adopción o acogimiento de carácter internacional con desplazamiento previo?',
    prompt: 'Contrasta con la regla de adopción nacional.',
    key: 'D',
    correct: {
      text: 'Entre inicio del viaje y resolución, a elección del trabajador',
      rule: 'El art. 178 TRLGSS establece que en adopción o acogimiento internacional con desplazamiento previo al país de origen, el trabajador puede fijar la fecha del hecho causante entre el inicio del viaje y la resolución judicial de constitución, con suspensión anticipable hasta 4 semanas antes.',
    },
    distractors: [
      { text: 'Siempre es la fecha de la resolución judicial final de constitución, sin ninguna margen de elección por parte del trabajador', trap: 'wrong_start_date', why: 'En internacional con desplazamiento previo puede elegirse una fecha entre el viaje y la resolución.' },
      { text: 'Siempre es la fecha de la primera resolución administrativa provisional dictada en el país de origen, con independencia del traslado', trap: 'temporal_confusion', why: 'La fecha se fija entre el inicio del viaje y la resolución judicial de constitución, no la primera administrativa.' },
      { text: 'Es la fecha de nacimiento del menor adoptado en su país de origen, con independencia de la fecha de la resolución judicial', trap: 'factual_misapplication', why: 'El hecho causante sigue vinculado a la resolución en la adopción/acogimiento.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    difficulty: 3,
  },
  {
    stem: '¿Cuál es el único supuesto en el que el hecho causante de una prestación de nacimiento se computa a la fecha de la decisión administrativa de acogimiento o de la resolución judicial de adopción?',
    prompt: 'Separa el nacimiento por parto de los supuestos de adopción/acogimiento.',
    key: 'A',
    correct: {
      text: 'En adopción o acogimiento, porque no hay parto al que referirse',
      rule: 'El art. 178 TRLGSS fija el hecho causante en la fecha de la decisión administrativa/judicial de adopción o acogimiento; solo en el parto se produce en la fecha del parto.',
    },
    distractors: [
      { text: 'En cualquier situación, incluida el nacimiento biológico por parto', trap: 'overbroad_statement', why: 'En el parto el hecho causante es la fecha del parto, no la resolución administrativa.' },
      { text: 'Solo cuando el trabajador ha superado los 26 años de edad', trap: 'exception_ignored', why: 'No depende de la edad; el referente temporal cambia por la naturaleza del hecho.' },
      { text: 'Solo en los casos de jornada parcial', trap: 'wrong_legal_object', why: 'La jornada parcial afecta a la BR, no a la fecha del hecho causante.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    difficulty: 3,
  },
  {
    stem: '¿Cuál es la cuantía del subsidio por nacimiento y cuidado de menor y qué tratamiento recibe en el IRPF?',
    prompt: 'Separa el porcentaje sobre la BR de la exención fiscal.',
    key: 'B',
    correct: {
      text: 'Equivalente al 100% de la base reguladora y exenta de retenciones en el IRPF',
      rule: 'El art. 179 TRLGSS fija el subsidio como 100% de la BR; el art. 7 LIRPF lo declara exento de IRPF, sin retenciones a cuenta.',
    },
    distractors: [
      { text: 'Equivalente al 75% de la base reguladora, con la exención fiscal aplicable solo al tramo exento de IT', trap: 'numeric_substitution', why: 'El 75% es el porcentaje ordinario de IT común; el nacimiento es 100% y exento.' },
      { text: 'Equivalente al 100% de la base reguladora, pero sujeto a retención del 15% en el IRPF', trap: 'factual_misapplication', why: 'No se practica retención: la prestación está exenta en el IRPF.' },
      { text: 'Equivalente al 100% de la base de contingencias profesionales, con retención ordinaria', trap: 'conceptual_merger', why: 'La BR es de contingencias comunes, no profesionales, y está exenta.' },
    ],
    legal: 'Art. 179 TRLGSS; Art. 7 LIRPF',
    cluster: 'cluster_nacimiento_br',
    difficulty: 2,
  },
  {
    stem: 'Si la base reguladora del subsidio no contributivo queda por debajo del indicador diario, ¿qué regla de cuantía se aplica al periodo obligatorio?',
    prompt: 'Contrasta con la regla de tope del IPREM.',
    key: 'C',
    correct: {
      text: 'Se abona la base inferior (no el IPREM); por tanto en 42 días se paga 42 × BR diaria, no 42 × IPREM',
      rule: 'El art. 182 TRLGSS establece que la cuantía del subsidio no contributivo es el 100% del IPREM, salvo que la base reguladora calculada conforme al art. 179 fuese inferior, en cuyo caso se estará a esta base inferior.',
    },
    distractors: [
      { text: 'Se abona siempre el IPREM completo, con lo que el importe es 42 × IPREM, con independencia de la base', trap: 'overbroad_statement', why: 'La norma declara la base inferior como límite alternativo; no se abona el IPREM si la BR es menor.' },
      { text: 'Se abona el promedio entre el IPREM y la base reguladora, con reducción del 50% en el descuento de la TGSS', trap: 'numeric_substitution', why: 'No existe promedio ni reducción del 50%; es el menor entre IPREM y BR.' },
      { text: 'Se abona el IPREM reducido en un 25% por compensación con el salario, con independencia del nivel de la base', trap: 'factual_misapplication', why: 'No existe esa reducción; la cuantía es el IPREM o la BR inferior, sin ajustes.' },
    ],
    legal: 'Art. 182 TRLGSS',
    cluster: 'cluster_subsidio_nc',
    pair: 'pair_subsidio_nc_14',
    difficulty: 3,
  },
  {
    stem: 'Si concurren a la vez dos supuestos tasados de ampliación (por ejemplo, numerosa y múltiple), ¿cuál es la duración máxima del subsidio no contributivo?',
    prompt: 'Aplica la regla de no acumulación.',
    key: 'D',
    correct: {
      text: '56 días naturales como máximo (42 + 14, sin acumulación)',
      rule: 'El art. 182 TRLGSS prescribe que la duración solo puede incrementarse en 14 días naturales, con independencia de que concurran varias situaciones simultáneamente, con máximo absoluto de 56 días naturales.',
    },
    distractors: [
      { text: '70 días naturales (42 + 14 por cada supuesto concurrente)', trap: 'rule_exception_swap', why: 'Los 14 días no se acumulan; solo se aplica una vez.' },
      { text: '42 días naturales, porque la ampliación no puede aplicarse en ningún caso concurrente', trap: 'exception_ignored', why: 'Sí puede aplicarse, pero con tope único de 14 días.' },
      { text: 'No hay límite y se suman 14 días por cada supuesto, pudiendo llegar a 98 días si concurren los cuatro', trap: 'numeric_precision', why: 'La norma fija un tope absoluto de 56 días.' },
    ],
    legal: 'Art. 182 TRLGSS',
    cluster: 'cluster_subsidio_nc',
    difficulty: 3,
  },
  {
    stem: 'Si el tercer progenitor reduce jornada en media hora para el lactante, ¿quién percibe el subsidio y qué base se aplica?',
    prompt: 'Contrasta con el régimen general (INSS paga, empresa no).',
    key: 'A',
    correct: {
      text: 'Solo uno de los progenitores; 100% de la BR de IT por contingencias comunes, proporcional a la media hora',
      rule: 'El art. 184 TRLGSS limita el derecho a percibir la prestación a uno solo de los progenitores, aunque ambos reduzcan la jornada; y el art. 185 fija la cuantía en 100% de la BR de IT por contingencias comunes, proporcional a la reducción.',
    },
    distractors: [
      { text: 'Ambos progenitores, cada uno con el 50% de la base, con independencia de la duración de la reducción', trap: 'factual_misapplication', why: 'El subsidio no se divide; solo lo percibe uno de ellos.' },
      { text: 'Solo el progenitor que trabaje en la misma empresa que el otro, con base de contingencias profesionales', trap: 'wrong_competent_body', why: 'La regla no atiende a la empresa; es el 100% de la BR de IT comunes.' },
      { text: 'Ninguno, porque el lactante no alcanza los 12 meses', trap: 'temporal_confusion', why: 'El intervalo protegido es de 9 a 12 meses; a los 12 se extingue, no antes.' },
    ],
    legal: 'Arts. 183-185 TRLGSS',
    cluster: 'cluster_lactante',
    pair: 'pair_lactante_titularidad',
    difficulty: 3,
  },
  {
    stem: '¿Qué ocurre si la empresa ofrece una reubicación compatible a los 7 meses durante la lactancia natural?',
    prompt: 'Aplica la excepción de extinción anticipada del art. 189.',
    key: 'B',
    correct: {
      text: 'La prestación se extingue el día anterior a la reincorporación al puesto compatible',
      rule: 'El art. 189 TRLGSS establece que, si la beneficiaria se reincorpora con anterioridad a su puesto anterior o a otro compatible, la prestación se extingue el día anterior a dicha reincorporación (incluso antes de los 9 meses).',
    },
    distractors: [
      { text: 'La prestación continúa hasta los 9 meses sin interrupción, dado el límite preclusivo', trap: 'overbroad_statement', why: 'La reincorporación previa extingue el derecho antes de los 9 meses.' },
      { text: 'La prestación se suspende durante un mes y luego se reanuda si la reubicación no se mantiene', trap: 'temporal_confusion', why: 'No hay suspensión ni reanudación; hay extinción.' },
      { text: 'La prestación se mantiene mientras persista el riesgo, aunque la reubicación sea compatible', trap: 'exception_ignored', why: 'La compatibilidad de la reubicación hace cesar la situación protegida.' },
    ],
    legal: 'Art. 189 TRLGSS',
    cluster: 'cluster_riesgos',
    pair: 'pair_riesgo_embarazo_lactancia',
    difficulty: 4,
  },
  // ── I. Ampliación a cobertura completa 2026-11-04 (secuencia C,D,A,B ×5 + C,D,C,D; A5/B5/C7/D7) ──────────
  {
    stem: '¿Qué límites de edad y circunstancias se exigen para el menor adoptado o acogido en la prestación de nacimiento?',
    prompt: 'Separa la regla general de la regla especial de 6 a 18 años.',
    key: 'C',
    correct: {
      text: 'Menor de 6 años; de 6 a 18 si discapacidad o dificultades acreditadas',
      rule: 'El art. 177 TRLGSS exige que el adoptado o acogido sea menor de 6 años como regla general, o mayor de 6 pero menor de 18 años si concurre discapacidad igual o superior al 33% o especiales dificultades de inserción social y familiar acreditadas por los servicios sociales.',
    },
    distractors: [
      { text: 'Solo menores de 6 años sin excepción, con independencia de la discapacidad o de las dificultades de inserción social acreditadas', trap: 'overbroad_statement', why: 'La norma prevé la excepción de 6 a 18 años con discapacidad igual o superior al 33% o con dificultades acreditadas.' },
      { text: 'Menores de 12 años como regla general, con extensión hasta los 18 años si existe cualquier dificultad sin acreditar', trap: 'numeric_substitution', why: 'El límite general es 6 años, no 12, y las dificultades deben estar debidamente acreditadas por servicios sociales.' },
      { text: 'Sin límite de edad, siempre que exista resolución judicial de adopción o decisión administrativa de acogimiento', trap: 'factual_misapplication', why: 'La edad es un requisito material: en general menor de 6 años, en especial hasta 18 con discapacidad o dificultades.' },
    ],
    legal: 'Art. 177 TRLGSS',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 3,
  },
  {
    stem: '¿Qué situación debe acreditar la persona trabajadora al iniciar cada periodo de descanso por nacimiento?',
    prompt: 'Contrasta estar en no alta con estar en alta o asimilada.',
    key: 'D',
    correct: {
      text: 'Alta o asimilada al inicio de cada descanso; sin alta no hay acceso',
      rule: 'El art. 178 TRLGSS exige estar afiliado y en situación de alta o asimilada al alta al inicio de cada periodo de descanso. No cabe el acceso a esta prestación desde la situación de no alta.',
    },
    distractors: [
      { text: 'Basta estar afiliado, con independencia de la situación de alta o asimilada en el momento inicial del descanso', trap: 'partial_rule_accuracy', why: 'La afiliación no basta: se exige además alta o asimilada al inicio de cada periodo de descanso.' },
      { text: 'Se admite el acceso desde la situación de no alta si se acredita una carencia previa de 180 días cotizados', trap: 'exception_ignored', why: 'El alta es requisito inexcusable; la carencia no sustituye la situación de alta o asimilada.' },
      { text: 'Se admite el acceso si el trabajador acredita cinco años de cotización acumulados, aunque esté en no alta al comenzar', trap: 'numeric_substitution', why: 'No existe esa vía: sin alta o asimilada al inicio del descanso no procede la prestación.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    difficulty: 2,
  },
  {
    stem: '¿Qué periodo de cotización debe acreditar una persona con 23 años para acceder a la prestación de nacimiento?',
    prompt: 'Aplica la regla del doble para el tramo intermedio.',
    key: 'A',
    correct: {
      text: '90 días en 7 años o 180 días en vida laboral',
      rule: 'El art. 178 TRLGSS para quien tiene cumplidos 21 años y es menor de 26 exige 90 días cotizados en los 7 años inmediatamente anteriores al inicio del descanso o, alternativamente, 180 días a lo largo de su vida laboral. El mismo periodo mínimo se exige para la IT de la semana 39, el lactante corresponsable y el cáncer infantil.',
    },
    distractors: [
      { text: 'No debe acreditar periodo alguno por tener menos de 25 años, bastando con estar en alta al inicio del descanso', trap: 'numeric_precision', why: 'La exención total es solo para menores de 21 años; desde los 21 ya se exige acreditación.' },
      { text: 'Debe acreditar 180 días en 7 años o 360 días en vida laboral, por aplicación del tramo superior de edad', trap: 'rule_exception_swap', why: 'Esos importes corresponden al tramo de 26 o más años, no al tramo intermedio de 21 a 25.' },
      { text: 'Debe acreditar 90 días en 7 años sin vía alternativa, sin que quepa cómputo en toda la vida laboral', trap: 'exception_ignored', why: 'La ley prevé la doble vía: 90 días en 7 años o 180 días en vida laboral, a elección.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    pair: 'pair_br_nacimiento_it',
    difficulty: 3,
  },
  {
    stem: '¿Qué periodo de cotización debe acreditar una persona con 30 años para acceder a la prestación de nacimiento?',
    prompt: 'Aplica la duplicación respecto al tramo de 21 a 25 años.',
    key: 'B',
    correct: {
      text: '180 días en 7 años o 360 días en vida laboral',
      rule: 'El art. 178 TRLGSS para quien tiene cumplidos 26 años exige 180 días cotizados en los 7 años inmediatamente anteriores al inicio del descanso o, alternativamente, 360 días a lo largo de su vida laboral. Es el doble exacto del tramo de 21 a 25 años.',
    },
    distractors: [
      { text: 'Debe acreditar 90 días en 7 años o 180 días en vida laboral, igual que en el tramo de 21 a 25 años', trap: 'conceptual_merger', why: 'Esos importes son del tramo de 21 a 25; a partir de los 26 se duplican a 180 y 360.' },
      { text: 'No debe acreditar periodo alguno, porque ha superado ampliamente la edad de 26 años exigida para la carencia', trap: 'overbroad_statement', why: 'La edad superior no exime de cotización; al contrario, eleva el mínimo exigible.' },
      { text: 'Debe acreditar 360 días en 7 años o 720 días en vida laboral, por acumulación de ambos tramos', trap: 'numeric_substitution', why: 'No existe acumulación de tramos; la regla es 180 en 7 años o 360 en vida laboral.' },
    ],
    legal: 'Art. 178 TRLGSS',
    cluster: 'cluster_nacimiento_carencia',
    pair: 'pair_br_nacimiento_it',
    difficulty: 3,
  },
  {
    stem: '¿Qué efecto produce la resolución provisional dictada por falta de bases definitivas en la prestación de nacimiento?',
    prompt: 'Separa el cómputo de los 3 meses de la recalculación por diferencia.',
    key: 'C',
    correct: {
      text: 'Deviene definitiva a los 3 meses si la base no varía; si varía, recalcula',
      rule: 'El art. 7 del RD 295/2009 establece que si al tramitar la solicitud no constan las bases definitivas, el INSS dicta resolución provisional con la última base registrada. Si la base definitiva es idéntica, la provisional deviene definitiva automáticamente a los 3 meses sin nuevo acto; si difiere, recalcula y dicta resolución definitiva.',
    },
    distractors: [
      { text: 'La resolución provisional queda sin efecto si la base definitiva difiere, sin que deba emitirse resolución definitiva nueva', trap: 'rule_exception_swap', why: 'Si la base difiere, el INSS recalcula de oficio y emite resolución definitiva, no anula sin más.' },
      { text: 'La resolución provisional deviene definitiva a los 6 meses contados desde la fecha de notificación al beneficiario', trap: 'numeric_precision', why: 'El plazo es de 3 meses desde su emisión, no de 6 meses desde la notificación.' },
      { text: 'La resolución provisional nunca deviene definitiva de forma automática, exigiéndose siempre resolución expresa adicional', trap: 'overbroad_statement', why: 'Si la base no ha variado, la provisional deviene definitiva automáticamente a los 3 meses.' },
    ],
    legal: 'Art. 7 RD 295/2009',
    cluster: 'cluster_nacimiento_no_delegado',
    difficulty: 3,
  },
  {
    stem: '¿Cómo se distribuyen las semanas de suspensión en una familia monoparental frente a la biparental?',
    prompt: 'Identifica el total y los tres tramos monoparentales.',
    key: 'D',
    correct: {
      text: '32 semanas: 6 obligatorias + 22 voluntarias + 4 parentales hasta los 8 años',
      rule: 'El art. 48 ET y el art. 8 RD 295/2009 establecen 32 semanas en monoparentalidad: 6 obligatorias inmediatamente posteriores, 22 voluntarias hasta los 12 meses y 4 parentales en periodos semanales hasta los 8 años, frente a 19 semanas en biparentalidad.',
    },
    distractors: [
      { text: '19 semanas con la misma distribución que la biparental, sin incremento alguno por la monoparentalidad existente', trap: 'factual_misapplication', why: 'La monoparentalidad eleva el total a 32 semanas, con 22 voluntarias y 4 parentales.' },
      { text: '26 semanas: 6 obligatorias, 16 voluntarias hasta los 12 meses y 4 parentales hasta los 8 años', trap: 'numeric_substitution', why: 'Los importes correctos son 22 voluntarias y 4 parentales para un total de 32, no 26.' },
      { text: '32 semanas continuas e ininterrumpidas a jornada completa, sin posibilidad de fraccionamiento en periodos semanales', trap: 'conceptual_merger', why: 'Las voluntarias y parentales pueden disfrutarse en periodos semanales acumulados o interrumpidos.' },
    ],
    legal: 'Art. 48 ET; Art. 8 RD 295/2009',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 3,
  },
  {
    stem: '¿Qué reglas rigen para el disfrute de las semanas voluntarias y parentales tras las 6 obligatorias?',
    prompt: 'Identifica preaviso, semanas completas, carácter personal y limitación.',
    key: 'A',
    correct: {
      text: 'Preaviso 15 días, semanas completas, derecho personal y limitación motivada',
      rule: 'El art. 48 ET exige comunicar a la empresa con 15 días de antelación, solicitar los periodos por semanas completas, reconoce carácter personal e intransferible del derecho y permite limitar el disfrute simultáneo en la misma empresa por razones objetivas motivadas por escrito. El disfrute puede ser a jornada completa o parcial con acuerdo.',
    },
    distractors: [
      { text: 'No se exige preaviso alguno a la empresa y los periodos pueden fraccionarse por días laborables concretos', trap: 'overbroad_statement', why: 'Se exige comunicación con 15 días de antelación y solicitud por semanas completas.' },
      { text: 'El derecho puede cederse libremente al otro progenitor si este lo solicita por escrito a la empresa', trap: 'factual_misapplication', why: 'El derecho es personal (intransferible); no puede cederse al otro progenitor.' },
      { text: 'La empresa no puede limitar en ningún caso el ejercicio simultáneo aunque ambos trabajen en la misma empresa', trap: 'exception_ignored', why: 'La dirección puede limitar el disfrute simultáneo por razones fundadas y objetivas por escrito.' },
    ],
    legal: 'Art. 48 ET',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 3,
  },
  {
    stem: '¿Cómo se abona el subsidio especial por parto o adopción múltiple cuando nacen dos hijos simultáneamente?',
    prompt: 'Separa el descanso ordinario del subsidio especial por el segundo hijo.',
    key: 'B',
    correct: {
      text: '6 semanas extra por hijo desde el segundo, en un solo pago tras las 6 obligatorias; solo uno si ambos pueden',
      rule: 'El art. 179 TRLGSS y el art. 12 RD 295/2009 conceden un subsidio especial de 6 semanas por cada hijo a partir del segundo, abonado en un solo pago al término de las 6 semanas obligatorias posteriores al parto. Si ambos progenitores pueden ser beneficiarios, solo lo percibe uno de ellos, con independencia del descanso ordinario de 19 semanas.',
    },
    distractors: [
      { text: 'Se abonan 6 semanas adicionales por cada hijo desde el primero, fraccionadas en mensualidades durante todo el descanso', trap: 'numeric_substitution', why: 'El subsidio especial es por cada hijo desde el segundo y en un solo pago tras las 6 obligatorias.' },
      { text: 'Se abonan 12 semanas adicionales por el segundo hijo, en dos pagos, uno al inicio y otro al final del descanso', trap: 'numeric_precision', why: 'Son 6 semanas adicionales por hijo y en un solo pago tras las 6 semanas obligatorias.' },
      { text: 'Ambos progenitores perciben el subsidio especial simultáneamente si reúnen los requisitos de carencia individualmente', trap: 'conceptual_merger', why: 'Si ambos pueden ser beneficiarios, solo lo percibe uno de ellos.' },
    ],
    legal: 'Arts. 179 TRLGSS; Art. 12 RD 295/2009',
    cluster: 'cluster_nacimiento_casos',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se computa el descanso cuando el neonato permanece hospitalizado a continuación del parto?',
    prompt: 'Separa la ampliación por días de ingreso del diferimiento del cómputo.',
    key: 'C',
    correct: {
      text: 'Puede computarse desde el alta hospitalaria, excluidas las 6 obligatorias',
      rule: 'El art. 8 RD 295/2009 permite que en parto prematuro o con hospitalización neonatal el periodo de suspensión pueda computarse a instancia del progenitor desde la fecha del alta hospitalaria, excluidas las 6 semanas obligatorias posteriores al parto, además de la ampliación en tantos días de ingreso con máximo de 13 semanas.',
    },
    distractors: [
      { text: 'El cómputo se inicia siempre el día siguiente al parto, sin posibilidad de diferirlo al alta hospitalaria', trap: 'wrong_start_date', why: 'El progenitor puede solicitar que el cómputo se inicie a partir del alta hospitalaria.' },
      { text: 'El diferimiento incluye también las 6 semanas obligatorias, que se desplazan íntegramente al alta hospitalaria', trap: 'factual_misapplication', why: 'Se excluyen las 6 semanas obligatorias del diferimiento; estas se disfrutan tras el parto.' },
      { text: 'El diferimiento solo procede si la hospitalización supera los 14 días, con independencia del diagnóstico clínico', trap: 'numeric_substitution', why: 'El diferimiento no exige ese umbral; el umbral de más de 7 días es para la ampliación.' },
    ],
    legal: 'Art. 8 RD 295/2009',
    cluster: 'cluster_nacimiento_casos',
    difficulty: 3,
  },
  {
    stem: '¿Qué ocurre con el periodo de descanso si fallece uno de los progenitores durante el descanso?',
    prompt: 'Contrasta con el efecto del fallecimiento del menor.',
    key: 'D',
    correct: {
      text: 'El supérstite puede usar el periodo restante del fallecido',
      rule: 'El art. 8 RD 295/2009 y el art. 48 ET permiten que si fallece uno de los progenitores, el progenitor supérstite haga uso de la totalidad o de la parte que reste por disfrutar del periodo de suspensión del fallecido, a diferencia del fallecimiento del menor que no reduce el descanso.',
    },
    distractors: [
      { text: 'Se extingue el periodo de descanso del fallecido y el supérstite pierde definitivamente esas semanas pendientes', trap: 'rule_exception_swap', why: 'El supérstite puede hacer uso de la totalidad o parte restante del periodo del fallecido.' },
      { text: 'El descanso se reduce en la mitad para el supérstite, quedando el resto de semanas sin disfrutar', trap: 'numeric_substitution', why: 'No hay reducción a la mitad; el supérstite acumula el periodo restante.' },
      { text: 'Se suspende el descanso del supérstite hasta que nazca otro menor en los 12 meses siguientes', trap: 'conceptual_merger', why: 'No existe suspensión por nuevo nacimiento; el derecho se acumula al supérstite.' },
    ],
    legal: 'Art. 8 RD 295/2009; Art. 48 ET',
    cluster: 'cluster_nacimiento_casos',
    difficulty: 3,
  },
  {
    stem: '¿Quién ingresa las cuotas durante el descanso por nacimiento y cómo se deduce la cuota obrera?',
    prompt: 'Separa la obligación de cotizar de quién paga cada cuota.',
    key: 'A',
    correct: {
      text: 'Se mantiene la cotización: empresa la patronal; gestora retiene la obrera',
      rule: 'Durante el descanso se mantiene la obligación de cotizar. La entidad gestora deduce de la cuantía del subsidio la aportación del trabajador a la Seguridad Social, desempleo y formación profesional para su ingreso en la TGSS, mientras el empresario ingresa únicamente la aportación a su cargo.',
    },
    distractors: [
      { text: 'La obligación de cotizar se suspende durante el descanso y ambas cuotas quedan sin ingresar en la TGSS', trap: 'overbroad_statement', why: 'La obligación de cotizar se mantiene durante el periodo de descanso.' },
      { text: 'La empresa ingresa la cuota patronal y la obrera, y después la entidad gestora le reembolsa el total pagado', trap: 'factual_misapplication', why: 'La gestora retiene la cuota obrera del subsidio; la empresa solo ingresa la patronal.' },
      { text: 'La mutua colaboradora asume la retención de la cuota obrera en lugar de la entidad gestora competente', trap: 'wrong_competent_body', why: 'La retención la realiza la entidad gestora (INSS o ISM), no la mutua.' },
    ],
    legal: 'Art. 12 RD 295/2009',
    cluster: 'cluster_nacimiento_no_delegado',
    difficulty: 3,
  },
  {
    stem: '¿Qué ocurre si el trabajador en paro total pasa a situación de nacimiento y cuidado de menor?',
    prompt: 'Aplica la suspensión y reanudación del art. 284.',
    key: 'B',
    correct: {
      text: 'Se suspende el paro y se cobra nacimiento; luego se reanuda por lo pendiente',
      rule: 'El art. 284 TRLGSS establece que si el trabajador en desempleo total pasa a nacimiento, se suspende el desempleo y su cotización, pasa a percibir el subsidio de nacimiento gestionado por el INSS y, extinguido este, se reanuda el desempleo por la duración y cuantía pendientes.',
    },
    distractors: [
      { text: 'Se extingue definitivamente el desempleo contributivo y se pierde el derecho restante sin posibilidad de reanudación', trap: 'exception_ignored', why: 'No se extingue: se suspende y luego se reanuda por la duración y cuantía pendientes.' },
      { text: 'Se mantiene el cobro del paro sin suspensión, acumulándolo con el subsidio de nacimiento en esos meses', trap: 'overbroad_statement', why: 'La ley ordena la suspensión del paro mientras se percibe el nacimiento.' },
      { text: 'Se descuentan del paro los días de nacimiento a razón de un día por semana de descanso disfrutado', trap: 'numeric_substitution', why: 'No se descuenta día alguno; se reanuda por la duración que restaba por percibir.' },
    ],
    legal: 'Art. 284 TRLGSS',
    cluster: 'cluster_nacimiento_desempleo',
    difficulty: 4,
  },
  {
    stem: '¿Quiénes son beneficiarias del subsidio no contributivo por nacimiento y qué le falta respecto al contributivo?',
    prompt: 'Identifica el requisito que falta: la carencia.',
    key: 'C',
    correct: {
      text: 'Alta sin periodo mínimo de cotización; gestión directa no contributiva',
      rule: 'El art. 181 TRLGSS define como beneficiarias a las trabajadoras incluidas en el Régimen General que, producida la situación de nacimiento, adopción, guarda o acogimiento, reúnen todos los requisitos para el nacimiento contributivo salvo el periodo mínimo de cotización. La prestación tiene naturaleza no contributiva y su gestión y pago corresponden directamente a la entidad gestora.',
    },
    distractors: [
      { text: 'Son beneficiarias sin exigir afiliación ni alta, pudiendo acceder desde la situación de no alta al nacimiento', trap: 'overbroad_statement', why: 'Se exige afiliación y alta o asimilada, igual que en el contributivo; solo falta la carencia.' },
      { text: 'Son beneficiarias con independencia del periodo mínimo, pero con gestión por pago delegado de la empresa', trap: 'wrong_legal_object', why: 'No existe pago delegado; la gestión y pago son directos de la entidad gestora.' },
      { text: 'Son beneficiarias solo si acreditan 180 días cotizados, por exigirse carencia reducida en el no contributivo', trap: 'factual_misapplication', why: 'El no contributivo exige precisamente no haber acreditado el periodo mínimo de cotización.' },
    ],
    legal: 'Art. 181 TRLGSS',
    cluster: 'cluster_subsidio_nc',
    difficulty: 2,
  },
  {
    stem: '¿Qué requisitos laborales y subjetivos se exigen para el ejercicio corresponsable del cuidado del lactante?',
    prompt: 'Separa la reducción de ambos de la exclusión de funcionarios.',
    key: 'D',
    correct: {
      text: 'Ambos trabajan y reducen igual en media hora con certificación; excluidos funcionarios',
      rule: 'El art. 183 TRLGSS exige que ambos progenitores trabajen y reduzcan la jornada en media hora con la misma duración y régimen para el cuidado del lactante de 9 a 12 meses, acreditándolo mediante certificación de las empresas. El art. 184 TRLGSS excluye a los funcionarios públicos, regidos por el art. 48.f TREBEP.',
    },
    distractors: [
      { text: 'Basta que trabaje uno de los progenitores y reduzca jornada, sin exigir reducción del otro progenitor', trap: 'partial_rule_accuracy', why: 'Ambos progenitores deben trabajar y reducir la jornada con la misma duración y régimen.' },
      { text: 'Ambos deben trabajar pero pueden reducir con duraciones y regímenes distintos, sin certificación empresarial', trap: 'factual_misapplication', why: 'La reducción debe ser con la misma duración y régimen, acreditada por certificación de cada empresa.' },
      { text: 'Se aplica también a los funcionarios públicos en los mismos términos que al resto de trabajadores por cuenta ajena', trap: 'exception_ignored', why: 'El capítulo no es aplicable a funcionarios; se rigen por el art. 48.f TREBEP.' },
    ],
    legal: 'Arts. 183-184 TRLGSS; Art. 48.f TREBEP',
    cluster: 'cluster_lactante',
    pair: 'pair_lactante_titularidad',
    difficulty: 3,
  },
  {
    stem: '¿Cuándo nace y cuándo se extingue la prestación por riesgo durante el embarazo?',
    prompt: 'Identifica inicio, fin y gestión sin pago delegado.',
    key: 'A',
    correct: {
      text: 'Nace al suspender; termina al nacer, reincorporarse, extinguirse contrato o fallecer',
      rule: 'El art. 187 TRLGSS establece que la prestación por riesgo durante el embarazo nace el día en que se inicia la suspensión del contrato y finaliza el día anterior a la suspensión por nacimiento o a la reincorporación a puesto compatible. El art. 35 RD 295/2009 añade la extinción por extinción del contrato o fallecimiento, con gestión por INSS o mutua sin pago delegado.',
    },
    distractors: [
      { text: 'Nace el día del parto y finaliza a los 9 meses del menor, igual que en la lactancia natural posterior', trap: 'temporal_confusion', why: 'Esos límites son de la lactancia: el embarazo nace al suspender y termina al nacer o reincorporarse.' },
      { text: 'Nace con la notificación a la empresa y finaliza solo cuando cesa la lactancia natural del menor', trap: 'factual_misapplication', why: 'La extinción por nacimiento, reincorporación, extinción contractual o fallecimiento es tasada.' },
      { text: 'Nace al suspender y finaliza exclusivamente al cumplir el menor 12 meses, sin excepción por reincorporación', trap: 'numeric_precision', why: 'El límite de 12 meses es del lactante corresponsable, no del riesgo durante el embarazo.' },
    ],
    legal: 'Arts. 186-187 TRLGSS; Art. 35 RD 295/2009',
    cluster: 'cluster_riesgos',
    pair: 'pair_riesgo_embarazo_lactancia',
    difficulty: 3,
  },
  {
    stem: '¿Qué órganos intervienen en la determinación del porcentaje de discapacidad y en la resolución del derecho económico por hijo a cargo?',
    prompt: 'Separa la valoración CCAA/IMSERSO del pago INSS.',
    key: 'B',
    correct: {
      text: 'CCAA o IMSERSO valora la discapacidad; INSS reconoce y paga',
      rule: 'La valoración y reconocimiento del grado de discapacidad y de la necesidad de concurso de tercera persona corresponden a los órganos de las Comunidades Autónomas o al IMSERSO en Ceuta y Melilla. El reconocimiento del derecho y el pago económico corresponden exclusivamente al INSS. El porcentaje de discapacidad no es el de pérdida de capacidad de trabajo.',
    },
    distractors: [
      { text: 'El INSS valora y certifica el grado de discapacidad, y las Comunidades Autónomas reconocen el derecho y pagan', trap: 'wrong_competent_body', why: 'La valoración es autonómica o del IMSERSO; el INSS solo reconoce y paga.' },
      { text: 'El INSS mide la discapacidad con el mismo baremo de incapacidad permanente EVI para asignaciones por hijo', trap: 'conceptual_merger', why: 'La discapacidad la miden las CCAA o el IMSERSO; la incapacidad para trabajar la mide el INSS.' },
      { text: 'Ambos organismos comparten la valoración y el pago a partes iguales, según el territorio de residencia', trap: 'overbroad_statement', why: 'Las competencias son exclusivas: valoración autonómica/IMSERSO y reconocimiento/pago del INSS.' },
    ],
    legal: 'Arts. 351-353 TRLGSS; Art. 9 RD 1335/2005',
    cluster: 'cluster_asignacion_discapacidad',
    difficulty: 3,
  },
  {
    stem: '¿Cuándo surte efectos el nacimiento o la extinción de la asignación por hijo con discapacidad?',
    prompt: 'Identifica trimestre natural, pago semestral o mensual y comunicación.',
    key: 'C',
    correct: {
      text: 'Efectos desde el 1.º del trimestre siguiente; extinción el último día del trimestre; pago según edad',
      rule: 'El art. 353 TRLGSS establece que el reconocimiento surte efectos el primer día del trimestre natural siguiente a la solicitud y la extinción o reducción el último día del trimestre en que se produjo la variación, con obligación de comunicar variaciones en 30 días. El pago se realiza por semestres vencidos para menores de 18 y por meses vencidos para mayores de 18.',
    },
    distractors: [
      { text: 'El reconocimiento surte efectos desde la fecha de la solicitud y la extinción al día siguiente de la variación', trap: 'wrong_start_date', why: 'Los efectos se fijan por trimestre natural: primer día del siguiente y último día del que varía.' },
      { text: 'El pago se realiza siempre por meses vencidos, tanto para menores como para mayores de 18 años', trap: 'overbroad_statement', why: 'Para menores de 18 es por semestres vencidos; solo para mayores de 18 es mensual.' },
      { text: 'No existe obligación de comunicar las variaciones al INSS, produciendo efectos sin comunicación alguna', trap: 'exception_ignored', why: 'Existe obligación de comunicar las variaciones en 30 días desde que se producen.' },
    ],
    legal: 'Art. 353 TRLGSS',
    cluster: 'cluster_asignacion_discapacidad',
    difficulty: 4,
  },
  {
    stem: '¿Qué requisitos de ingresos y residencia distinguen los dos pagos únicos familiares no contributivos?',
    prompt: 'Separa el pago de 1.000 euros del pago por múltiple.',
    key: 'D',
    correct: {
      text: '1.000 euros exige residencia y límite con +15%; múltiple exige residencia sin límite ni carencia',
      rule: 'El art. 357 TRLGSS para la prestación de 1.000 euros exige residencia en España, ingresos anuales inferiores al límite de presupuestos con incremento del 15% por cada hijo desde el segundo y no tener derecho a prestaciones análogas. Los arts. 359-360 TRLGSS para el pago por múltiple exigen residencia y carencia de derechos análogos, sin límite de rentas ni carencia de cotización.',
    },
    distractors: [
      { text: 'Ambos pagos únicos exigen límite de ingresos con incremento del 15% por cada hijo desde el segundo', trap: 'conceptual_merger', why: 'Solo el pago de 1.000 euros exige ese límite; el múltiple no tiene límite de rentas.' },
      { text: 'El pago por múltiple exige carencia de 180 días y límite de ingresos, mientras el de 1.000 euros no lo exige', trap: 'rule_exception_swap', why: 'Es al revés: el múltiple no exige carencia ni límite; el de 1.000 euros sí exige límite.' },
      { text: 'Ninguno de los dos pagos exige residencia legal ni exclusión de prestaciones análogas en otros regímenes', trap: 'exception_ignored', why: 'Ambos exigen residencia en España y no tener derecho a prestaciones análogas en otros regímenes.' },
    ],
    legal: 'Arts. 357-360 TRLGSS',
    cluster: 'cluster_pagos_unicos',
    difficulty: 3,
  },
  {
    stem: '¿Qué ocurre si la persona enferma mayor contrae matrimonio o constituye pareja de hecho?',
    prompt: 'Identifica el traslado del derecho al cónyuge y la convivencia temporal.',
    key: 'A',
    correct: {
      text: 'El cónyuge o pareja asume el derecho; convivencia temporal y escolarización compatibles',
      rule: 'El art. 191 TRLGSS establece que cuando la persona enferma contrae matrimonio o constituye pareja de hecho, el derecho corresponde al cónyuge o pareja si acredita ser beneficiario. La convivencia se mantiene aunque resida temporalmente en recurso residencial o vivienda de apoyo, y la escolarización no extingue el derecho si persisten tratamientos o crisis según informe del servicio público de salud.',
    },
    distractors: [
      { text: 'Se extingue el derecho de los progenitores y no se traslada al cónyuge, quedando el enfermo sin cobertura', trap: 'overbroad_statement', why: 'El derecho se traslada al cónyuge o pareja que acredite las condiciones de beneficiario.' },
      { text: 'La residencia permanente en centro residencial rompe la convivencia y extingue el derecho desde ese momento', trap: 'factual_misapplication', why: 'La residencia temporal en recurso residencial o vivienda de apoyo no rompe la convivencia.' },
      { text: 'La escolarización ordinaria extingue automáticamente el derecho, aunque persistan tratamientos y controles', trap: 'exception_ignored', why: 'La escolarización es compatible si persisten tratamientos, controles o crisis según informe sanitario.' },
    ],
    legal: 'Art. 191 TRLGSS',
    cluster: 'cluster_cuidado_cancer',
    difficulty: 4,
  },
  {
    stem: '¿Cómo se calcula la base reguladora si la persona ingresó en la empresa el mes anterior o el mismo mes del hecho?',
    prompt: 'Aplica las dos reglas especiales de ingreso reciente a tiempo completo.',
    key: 'B',
    correct: {
      text: 'Mes anterior al inicio si ingresó el mes previo; base del mes si ingresó el mismo mes',
      rule: 'El art. 179 TRLGSS establece que si la persona ingresó en la empresa en el mes anterior al hecho causante, se toma la base de contingencias comunes del mes inmediatamente anterior al inicio del descanso. Si ingresó en el mismo mes del hecho causante, se toma la base de dicho mes dividida entre los días transcurridos.',
    },
    distractors: [
      { text: 'Siempre se toma el mes anterior al mes previo, con independencia del mes de ingreso en la empresa', trap: 'partial_rule_accuracy', why: 'Esas son las reglas especiales de ingreso en el mes anterior o en el mismo mes.' },
      { text: 'Si ingresó el mismo mes, se toma la base del mes anterior al mes previo dividida entre 30 días naturales', trap: 'temporal_confusion', why: 'Con ingreso en el mismo mes se toma la base de dicho mes, no la del mes anterior al mes previo.' },
      { text: 'Si ingresó el mes anterior, se suman las bases de 12 meses y se divide entre 365 días naturales completos', trap: 'conceptual_merger', why: 'La regla de 12 meses con divisor 365 es del tiempo parcial; el ingreso reciente tiene reglas propias.' },
    ],
    legal: 'Art. 179 TRLGSS',
    cluster: 'cluster_nacimiento_br',
    pair: 'pair_br_nacimiento_it',
    difficulty: 4,
  },
  {
    stem: '¿Cuál es la cuantía y quién la gestiona cuando solo disfruta la reducción uno de los progenitores?',
    prompt: 'Contrasta el 100% individual proporcional del simultáneo del 50%.',
    key: 'C',
    correct: {
      text: '100% de la BR profesional proporcional a la reducción; gestión por mutua o gestora',
      rule: 'El art. 192 TRLGSS fija el subsidio en el 100% de la base reguladora de la incapacidad temporal por contingencias profesionales, en proporción a la reducción de jornada, gestionado por la mutua colaboradora o por la entidad gestora con la que la empresa tenga concertada la cobertura. La prestación se extingue cuando cesa la necesidad de cuidado según informe del facultativo del servicio público de salud o se pierde la discapacidad o dependencia exigida.',
    },
    distractors: [
      { text: 'Siempre se abona el 50% de la BR profesional, con independencia del porcentaje de reducción individual aplicado', trap: 'numeric_substitution', why: 'El 50% es solo para disfrute simultáneo; en disfrute individual es el 100% proporcional.' },
      { text: 'Se abona el 100% de la BR de contingencias comunes, gestionado exclusivamente por el INSS sin mutua', trap: 'wrong_legal_object', why: 'La base es de contingencias profesionales y la gestión es por mutua o gestora según cobertura.' },
      { text: 'El subsidio se mantiene aunque cese la necesidad de cuidado, sin exigir informe del facultativo sanitario', trap: 'exception_ignored', why: 'Se extingue cuando cesa la necesidad según informe del facultativo del servicio público de salud.' },
    ],
    legal: 'Art. 192 TRLGSS',
    cluster: 'cluster_cuidado_cancer',
    difficulty: 3,
  },
  {
    stem: '¿Qué diferencia existe entre el régimen general y el TREBEP respecto a la anticipación del descanso?',
    prompt: 'Separa las 4 semanas generales del permiso de la semana 37.',
    key: 'D',
    correct: {
      text: 'General admite 4 semanas antes del parto; TREBEP usa permiso retribuido desde la semana 37',
      rule: 'El art. 48 ET permite a la madre biológica del régimen general anticipar el descanso hasta 4 semanas antes de la fecha previsible del parto. Para el personal funcionario, el TREBEP no prevé esa anticipación y la compensa con un permiso retribuido desde la semana 37 de gestación según el art. 49.a TREBEP, debiendo aplicarse cada régimen en su ámbito.',
    },
    distractors: [
      { text: 'Ambos regímenes admiten la anticipación de 4 semanas antes del parto en idénticos términos legales', trap: 'conceptual_merger', why: 'La anticipación de 4 semanas es del régimen general; en TREBEP opera el permiso de la semana 37.' },
      { text: 'El TREBEP permite anticipar 8 semanas antes del parto, frente a las 4 semanas del régimen general', trap: 'numeric_substitution', why: 'El TREBEP no prevé anticipación de descanso; usa el permiso retribuido desde la semana 37.' },
      { text: 'Ningún régimen admite anticipación del descanso antes de la fecha previsible del parto', trap: 'factual_misapplication', why: 'El régimen general sí admite la anticipación de hasta 4 semanas antes.' },
    ],
    legal: 'Art. 48 ET; Art. 49.a TREBEP',
    cluster: 'cluster_nacimiento_duracion',
    difficulty: 4,
  },
  {
    stem: '¿Quién percibe la asignación cuando los progenitores faltan o se separan y la custodia pasa a otra persona?',
    prompt: 'Identifica huérfanos, abandonados, custodia y acuerdo de progenitores.',
    key: 'C',
    correct: {
      text: 'Huérfanos, abandonados y quien tenga la custodia; en convivencia, solo uno de común acuerdo',
      rule: 'El art. 352 TRLGSS y los arts. 10-11 RD 1335/2005 disponen que en separación, nulidad o divorcio percibe quien tenga a su cargo al hijo, aunque no la tuviera antes, y que en convivencia de ambos progenitores solo lo percibe uno de común acuerdo. Se reconocen asimismo a huérfanos de ambos progenitores, a abandonados sin acogimiento permanente y a mayores sin medida de apoyo, a sus representantes legales o a quien los tenga a su cargo.',
    },
    distractors: [
      { text: 'En caso de divorcio la asignación se extingue aunque exista custodia compartida y límites de ingresos cumplidos', trap: 'exception_ignored', why: 'El derecho se conserva para quien tenga a su cargo al hijo aun tras la separación o divorcio.' },
      { text: 'Si conviven ambos progenitores, ambos perciben simultáneamente la asignación por el mismo causante', trap: 'factual_misapplication', why: 'Solo puede reconocerse a uno de ellos, determinado de común acuerdo.' },
      { text: 'Los huérfanos de ambos progenitores no pueden ser beneficiarios de asignaciones del sistema', trap: 'overbroad_statement', why: 'Los huérfanos y abandonados con la discapacidad exigida sí pueden ser beneficiarios.' },
    ],
    legal: 'Art. 352 TRLGSS; Arts. 10-11 RD 1335/2005',
    cluster: 'cluster_asignacion_discapacidad',
    difficulty: 3,
  },
  {
    stem: '¿Por qué causas puede extinguirse el derecho a la prestación por nacimiento y cuidado de menor?',
    prompt: 'Enumera plazos, reincorporación, fallecimiento y pensionista.',
    key: 'D',
    correct: {
      text: 'Por fin de plazos, reincorporación voluntaria, fallecimiento del beneficiario o pensionista',
      rule: 'El art. 8 RD 295/2009 establece que el derecho se extingue por transcurso de los plazos máximos de duración, por reincorporación voluntaria al trabajo, por fallecimiento del beneficiario salvo que continúe en el disfrute el otro beneficiario y por adquirir la condición de pensionista de jubilación o incapacidad permanente, sin perjuicio del disfrute restante por el otro progenitor.',
    },
    distractors: [
      { text: 'Solo se extingue por transcurso de los plazos máximos, sin que la reincorporación voluntaria lo extinga', trap: 'partial_rule_accuracy', why: 'También se extingue por reincorporación voluntaria antes del cumplimiento del plazo máximo.' },
      { text: 'También se extingue por fallecimiento del menor, sin posibilidad de reincorporación voluntaria tras las 6 semanas', trap: 'rule_exception_swap', why: 'El fallecimiento del menor no reduce el periodo, salvo reincorporación voluntaria tras las 6 obligatorias.' },
      { text: 'El fallecimiento del beneficiario extingue siempre el derecho, sin que el otro progenitor pueda continuar el disfrute', trap: 'exception_ignored', why: 'Salvo que continúe en el disfrute el otro beneficiario, el fallecimiento no extingue.' },
    ],
    legal: 'Art. 8 RD 295/2009',
    cluster: 'cluster_nacimiento_no_delegado',
    difficulty: 3,
  },
]

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
    id: `item-t9-${index + 1}`,
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
      options.filter((o) => !o.is_correct).map((o) => [o.id, o.explanation!])
    ),
    trap_types: options.filter((o) => !o.is_correct).map((o) => o.trap_type!),
    corrective_rule: question.prompt,
    difficulty: question.difficulty,
    cognitive_operations: cognitive,
    status: 'validated',
    source: 'manual',
    figure_status: 'BOE_VERIFIED',
    created_at: now,
    updated_at: now,
  };
}

export const seedItemsTema9: Item[] = questionBank.map(makeItem);
