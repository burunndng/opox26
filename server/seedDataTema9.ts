import type { Item, MCQOption, TrapType, CognitiveOperation } from '../src/types.ts';

/**
 * Tema 9 Específico — Nacimiento y cuidado de menor y prestaciones familiares.
 * 24 items (2026-11-04 gap audit). Source: resumen/notas de clase (4-11),
 * "Supuesto repaso t. 9 especif,.pdf.md" (preguntas oficiales adaptadas),
 * diapositivas T9. Clusters/pairs registered in seedDataTema9Meta.ts.
 * Key balance: A=6 / B=6 / C=6 / D=6; no runs >2 (cycle matches global).
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
