import type { Item, MCQOption, TrapType, CognitiveOperation } from '../src/types.ts';

/** Exact question set supplied by the user; letters below refer to the original key. */
type Question = {
  stem: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  legal: string;
  rationale: string;
};

const TOPIC = 'topic_seguridad_social_tema_8';
const now = '2026-03-01T10:00:00Z';
const questionBank: Question[] = [
  {
    stem: 'Según la regla general del art. 169 TRLGSS, para que una enfermedad común o profesional, o un accidente sea o no de trabajo, determine una situación de incapacidad temporal es necesario que concurran:',
    options: ['Diagnóstico médico y comunicación voluntaria de baja a la empresa', 'Hospitalización e imposibilidad temporal de realizar tareas domésticas', 'Contingencia profesional y declaración expresa del empresario', 'Asistencia sanitaria de la Seguridad Social e impedimento para el trabajo'], answer: 'D', legal: 'Art. 169 TRLGSS',
    rationale: 'La regla general exige conjuntamente asistencia sanitaria de la Seguridad Social e impedimento para el trabajo. No requiere hospitalización ni declaración empresarial.',
  },
  {
    stem: '¿Cuál es la duración máxima del subsidio por incapacidad temporal?',
    options: ['545 días naturales', '365 días naturales', '360 días naturales', '730 días naturales'], answer: 'A', legal: 'Arts. 169 y 174 TRLGSS',
    rationale: 'La IT ordinaria dura 365 días y admite prórroga de 180: el máximo del subsidio es de 545 días naturales. Los 730 días son el límite conjunto de IT más prolongación por demora de calificación, no la duración del subsidio.',
  },
  {
    stem: 'La prórroga de la incapacidad temporal por otros 180 días procede cuando se presuma que, durante ese periodo, la persona:',
    options: ['Haya agotado los 365 días ordinarios sin necesidad de pronóstico médico', 'Alcanzará automáticamente una pensión de incapacidad permanente', 'Puede ser dada de alta médica por curación', 'Habrá agotado los efectos económicos del proceso'], answer: 'C', legal: 'Art. 169 TRLGSS',
    rationale: 'La prórroga se acuerda cuando se presume que durante los 180 días la persona puede ser dada de alta médica por curación.',
  },
  {
    stem: 'El periodo de observación por enfermedad profesional puede alcanzar, con prórroga, una duración máxima de:',
    options: ['365 días', '545 días', '360 días', '730 días'], answer: 'C', legal: 'Art. 169 TRLGSS',
    rationale: 'La observación por enfermedad profesional dura 180 días y puede prorrogarse otros 180 para estudio y diagnóstico: máximo 360.',
  },
  {
    stem: 'Una trabajadora se encuentra en el día 400 de un proceso ordinario de IT, sin que se haya emitido alta médica. En ese momento está:',
    options: ['En un nuevo proceso autónomo de IT', 'En prolongación de efectos económicos', 'En un periodo de observación por enfermedad profesional', 'En la prórroga de la IT, por presunción de posible curación o mejoría'], answer: 'D', legal: 'Arts. 169 y 174 TRLGSS',
    rationale: 'Entre los días 366 y 545 subsiste la prórroga de la propia IT; la prolongación de efectos económicos es posterior y distinta.',
  },
  {
    stem: 'En la menstruación incapacitante secundaria:',
    options: ['Se exigen 180 días de cotización en los cinco años anteriores', 'El subsidio nace el día 4 de baja y lo abona la empresa', 'Se percibe el 100 % de la base reguladora desde el nacimiento del derecho', 'No se exige periodo mínimo de cotización y el subsidio nace el día de la baja'], answer: 'D', legal: 'Arts. 169, 172 y 173 TRLGSS',
    rationale: 'La menstruación incapacitante secundaria no exige cotización mínima y el subsidio a cargo de la Seguridad Social nace el mismo día de la baja.',
  },
  {
    stem: 'En la interrupción del embarazo, con carácter general:',
    options: ['La contingencia es profesional y no exige cotización previa', 'La contingencia es común; el día de la baja lo paga la empresa con salario íntegro y el subsidio nace el día siguiente', 'El subsidio nace el día de la baja y lo abona directamente la Seguridad Social', 'Se exige la cotización del art. 178.1 TRLGSS según la edad de la trabajadora'], answer: 'B', legal: 'Arts. 169, 172 y 173 TRLGSS',
    rationale: 'La interrupción del embarazo es contingencia común salvo que derive de AT o EP; no exige cotización. El subsidio nace al día siguiente y el día de baja se paga como salario íntegro.',
  },
  {
    stem: 'En la situación especial de gestación a partir del día primero de la semana 39, el subsidio por incapacidad temporal se abona:',
    options: ['Desde el día siguiente a la baja hasta la fecha del parto, y el día de la baja lo paga la empresa con salario íntegro', 'Desde el día de la baja hasta la fecha del parto, a cargo de la Seguridad Social', 'Desde el día 4 de baja, abonando la empresa los días 4 a 15 inclusive', 'Desde el día siguiente a la baja, pero con cuantía del 100 % de la base reguladora'], answer: 'A', legal: 'Arts. 169, 172 y 173 TRLGSS; art. 178.1 TRLGSS',
    rationale: 'La situación comienza el primer día de la semana trigésima novena. El día de la baja se remunera como salario íntegro por la empresa y el subsidio se abona desde el día siguiente hasta la fecha del parto. La cuantía es la regla general de contingencias comunes.',
  },
  {
    stem: 'La situación especial por donación de órganos o tejidos comprende:',
    options: ['Los días de preparación, el ingreso para la preparación o trasplante y el periodo posterior hasta el alta por curación', 'Únicamente el día quirúrgico de la extracción', 'Solo el ingreso hospitalario, pero no la preparación médica', 'Solamente los días posteriores al alta médica ordinaria'], answer: 'A', legal: 'Art. 169 TRLGSS',
    rationale: 'La protección abarca los días discontinuos o ininterrumpidos de preparación médica, el ingreso para preparación o trasplante y el periodo posterior hasta el alta por curación.',
  },
  {
    stem: 'Respecto de la donación de órganos o tejidos, la combinación correcta es:',
    options: ['Exige 180 días de cotización y paga la empresa los tres primeros días', 'No exige periodo mínimo de cotización, se abona desde el día de la baja y su cuantía es del 100 % de la base reguladora de contingencias comunes', 'Tiene una cuantía del 75 % y comienza el día 4 de baja', 'Exige cotización según edad y mantiene la cuantía ordinaria del 60 %'], answer: 'B', legal: 'Arts. 169, 172 y 173 TRLGSS',
    rationale: 'La donación no exige carencia; el subsidio nace el día de la baja y asciende al 100 % de la base reguladora de contingencias comunes.',
  },
  {
    stem: 'Será beneficiaria de la prestación la persona incluida en el Régimen General que:',
    options: ['Se encuentre en una situación determinante, esté de alta o asimilada al alta y acredite la cotización previa cuando sea exigible', 'Esté impedida, aunque no esté de alta ni en situación asimilada', 'Esté de alta, aunque no exista situación médica determinante', 'Cotice 180 días en todos los supuestos de incapacidad temporal'], answer: 'A', legal: 'Arts. 165.1, 169 y 172 TRLGSS',
    rationale: 'Deben concurrir situación determinante, alta o asimilada y cotización previa solo cuando el supuesto la exija.',
  },
  {
    stem: 'En la incapacidad temporal derivada de enfermedad común, el periodo mínimo exigible es:',
    options: ['90 días dentro de los dos años anteriores', '180 días dentro de los cinco años inmediatamente anteriores al hecho causante', '180 días dentro de los cinco años anteriores a la fecha de alta en la empresa', '360 días dentro de los diez años anteriores a la baja'], answer: 'B', legal: 'Art. 172 TRLGSS',
    rationale: 'La enfermedad común exige 180 días cotizados dentro de los cinco años inmediatamente anteriores al hecho causante.',
  },
{
    stem: '¿Cuál de las siguientes situaciones de incapacidad temporal NO exige periodo mínimo de cotización previa?',
    options: ['Enfermedad común', 'Accidente no laboral', 'Gestación desde la semana 39', 'Enfermedad común de una persona que cotiza como responsable del pago'], answer: 'B', legal: 'Art. 172 TRLGSS; art. 178.1 TRLGSS',
    rationale: 'El accidente, sea o no de trabajo, no exige periodo mínimo. En cambio, la enfermedad común exige 180 días en cinco años, la gestación desde la semana 39 exige la cotización del art. 178.1 TRLGSS, y quien cotiza como responsable del pago debe estar además al corriente de sus obligaciones.',
  },
  {
    stem: 'Cuando se exige periodo mínimo de cotización, la cotización por horas extraordinarias:',
    options: ['Nunca computa para el derecho a la prestación', 'Solo computa si la incapacidad es profesional', 'Se computa como días de cuota', 'Se multiplica por 1,4 en todos los contratos temporales'], answer: 'C', legal: 'Art. 172 TRLGSS',
    rationale: 'Cuando se exige periodo mínimo, la cotización por horas extraordinarias se computa como días de cuota.',
  },
  {
    stem: 'En los contratos temporales de duración igual o inferior a cinco días:',
    options: ['Cada día cotizado computa como dos días', 'Cada día cotizado computa como 1,4 días, sin poder superar mensualmente los días del mes efectivo', 'Cada día cotizado computa como 1,4 días, sin límite mensual', 'La regla se aplica también a los contratos a tiempo parcial y fijos discontinuos'], answer: 'B', legal: 'Art. 249 bis TRLGSS',
    rationale: 'Cada día cotizado computa como 1,4 días, con el límite mensual de días naturales del mes efectivo; se excluyen parcial, relevo parcial y fijos discontinuos.',
  },
  {
    stem: 'Respecto de la suspensión colectiva del trabajo y el subsidio temporal, es correcto afirmar que:',
    options: ['Toda IT iniciada antes de la huelga queda automáticamente suspendida', 'Si la contingencia nace durante la huelga, el derecho subsiste durante toda ella', 'Si la IT ya se había iniciado antes de la huelga, la prestación económica no se suspende', 'La huelga parcial impide siempre el nacimiento de la contingencia'], answer: 'C', legal: 'Art. 165 TRLGSS; guía visual Tema 8, apartado de huelga',
    rationale: 'Si la IT ya se había iniciado antes de la huelga, la prestación económica no se suspende; una contingencia nacida durante huelga tiene tratamiento distinto.',
  },
  {
    stem: 'Una trabajadora con salario mensual tiene una base de cotización de 1.800 € en el mes anterior al inicio de una IT por contingencia común. Su base reguladora diaria es:',
    options: ['45 €', '60 €', '72 €', '75 €'], answer: 'B', legal: 'Art. 13 Decreto 1646/1972; guía visual Tema 8, base reguladora',
    rationale: 'Para salario mensual y mes completo: 1.800 € dividido entre 30 días = 60 € diarios.',
  },
  {
    stem: 'Si la remuneración está fijada por día, ¿qué divisor corresponde al cálculo de la base reguladora?',
    options: ['El número de días del mes a que se refiere la cotización', 'Siempre 30', 'Siempre 365', 'Los días efectivamente trabajados, aunque el salario sea diario'], answer: 'A', legal: 'Guía visual Tema 8, base reguladora de contingencias comunes',
    rationale: 'Con salario diario, se divide por el número de días del mes al que corresponde la cotización, no por una cifra fija.',
  },
  {
    stem: 'Si la persona no ha permanecido de alta durante todo el mes natural anterior al inicio de la IT, la base reguladora de contingencias comunes se calcula con:',
    options: ['La base de cotización de los tres meses anteriores', 'Un divisor fijo de 30 días', 'Los días efectivamente cotizados', 'La base mínima del grupo de cotización'], answer: 'C', legal: 'Guía visual Tema 8, base reguladora de contingencias comunes',
    rationale: 'Cuando no se estuvo de alta durante todo el mes anterior, se toma la base correspondiente a los días efectivamente cotizados.',
  },
  {
    stem: 'En una incapacidad profesional, la base del mes anterior, sin horas extraordinarias, es de 1.800 € para 30 días; las horas extraordinarias del año natural anterior suman 730 €. La base reguladora diaria es:',
    options: ['62 €', '60 €', '61 €', '64 €'], answer: 'A', legal: 'Art. 13 Decreto 1646/1972; guía visual Tema 8, base reguladora profesional',
    rationale: 'Componente ordinario: 1.800 / 30 = 60 €. Horas extraordinarias: 730 / 365 = 2 €. Total diario: 62 €.',
  },
  {
    stem: 'En situación de pluriempleo, para determinar la base reguladora:',
    options: ['Solo se computa la base de la empresa que comunica la baja', 'Se promedian las bases, sin aplicar ningún límite', 'Se computan todas las bases de cotización, con aplicación del tope máximo vigente', 'Se utiliza exclusivamente la base más alta de las acreditadas'], answer: 'C', legal: 'Guía visual Tema 8, base reguladora en pluriempleo',
    rationale: 'Se computan todas las bases de cotización acreditadas en pluriempleo, respetando el tope máximo vigente.',
  },
  {
    stem: 'Para los trabajadores a tiempo parcial, la base reguladora y el abono de la prestación se determinan así:',
    options: ['Suma de las bases acreditadas desde la última alta laboral, con un máximo de tres meses inmediatamente anteriores al mes previo al hecho causante, entre los días naturales del periodo; el abono es por todos los días naturales de incapacidad', 'Base del último mes completo dividida entre 30 días, con abono por los días laborables trabajados', 'Solo las bases de los días efectivamente cotizados en el mes anterior a la baja, con abono por días naturales', 'Suma de las bases de los tres meses siguientes a la baja, entre los días naturales del periodo, con abono por días naturales'], answer: 'A', legal: 'Guía visual Tema 8, base reguladora de tiempo parcial',
    rationale: 'La base reguladora del tiempo parcial resulta de dividir la suma de las bases acreditadas desde la última alta laboral, con un máximo de tres meses inmediatamente anteriores al mes previo al del hecho causante, entre los días naturales comprendidos en el periodo. La prestación económica se abona durante todos los días naturales en que se mantenga la incapacidad.',
  },
  {
    stem: 'En enfermedad común o accidente no laboral, la cuantía reglamentaria es:',
    options: ['60 % de la base reguladora desde el día 4 al 20, inclusive, y 75 % desde el día 21', '75 % desde el primer día', '60 % desde el día 4 y 100 % desde el día 21', '60 % durante los primeros quince días y 75 % desde el día 16'], answer: 'A', legal: 'Art. 2 Decreto 3158/1966; guía visual Tema 8, cuantía',
    rationale: 'La prestación es el 60 % del día 4 al 20 inclusive y el 75 % desde el día 21.',
  },
  {
    stem: 'La base reguladora diaria de una trabajadora es de 60 €. En una IT por enfermedad común, percibirá:',
    options: ['36 € el día 12 y 36 € el día 25', '45 € el día 12 y 45 € el día 25', '45 € el día 12 y 60 € el día 25', '36 € el día 12 y 45 € el día 25'], answer: 'D', legal: 'Art. 2 Decreto 3158/1966; guía visual Tema 8, cuantía',
    rationale: 'Día 12: 60 % de 60 € = 36 €. Día 25: 75 % de 60 € = 45 €.',
  },
  {
    stem: 'La relación correcta entre contingencia y cuantía es:',
    options: ['Accidente de trabajo: 60 %; enfermedad profesional: 100 %', 'Accidente de trabajo o enfermedad profesional: 75 % desde el nacimiento del derecho; donación de órganos: 100 % de la base reguladora de contingencias comunes', 'Donación de órganos: 75 %; enfermedad común: 100 %', 'Toda contingencia común especial: 100 % desde el día de la baja'], answer: 'B', legal: 'Art. 2 Decreto 3158/1966; arts. 169 y 173 TRLGSS',
    rationale: 'AT/EP se abona al 75 % desde el nacimiento del derecho; la donación tiene regla específica del 100 % de la base reguladora común.',
  },
  {
    stem: 'En enfermedad común o accidente no laboral, sin mejora convencional:',
    options: ['El subsidio nace el día de la baja y lo abona la Seguridad Social', 'El subsidio nace el día 3 y lo abona la empresa durante quince días', 'No hay subsidio reglamentario los tres primeros días; el derecho nace el día 4 y la empresa abona los días 4 a 15, inclusive', 'La empresa abona siempre los primeros treinta días'], answer: 'C', legal: 'Art. 173 TRLGSS',
    rationale: 'Los tres primeros días no tienen subsidio reglamentario; nace el derecho el día 4 y la empresa asume los días 4 a 15.',
  },
  {
    stem: 'En accidente de trabajo o enfermedad profesional:',
    options: ['El día de la baja lo abona la Seguridad Social y el día siguiente la empresa', 'La empresa abona los tres primeros días y la Seguridad Social desde el cuarto', 'El día de la baja corresponde a la empresa con salario íntegro y el subsidio nace el día siguiente', 'El subsidio nace el día de la baja, pero con el 60 % de la base reguladora'], answer: 'C', legal: 'Art. 173 TRLGSS',
    rationale: 'En contingencias profesionales el día de la baja se remunera como salario íntegro por la empresa y el subsidio nace al día siguiente.',
  },
  {
    stem: '¿Cómo se distribuye el inicio del derecho entre estos supuestos especiales?',
    options: ['Menstruación incapacitante secundaria y donación nacen el día de la baja; interrupción del embarazo y gestación desde la semana 39 nacen el día siguiente, con salario empresarial íntegro el día de la baja', 'Todas nacen el día siguiente a la baja, con salario íntegro empresarial durante el día inicial', 'Todas nacen el día de la baja y tienen cuantía del 100 %, sin distinguir contingencias', 'La donación nace el día 4 y la gestación el día siguiente, con abono empresarial al inicio'], answer: 'A', legal: 'Arts. 169, 172 y 173 TRLGSS',
    rationale: 'Menstruación y donación nacen el mismo día; interrupción y gestación en semana 39 nacen al día siguiente, con salario íntegro empresarial en el día de baja.',
  },
  {
    stem: 'Los convenios colectivos pueden mejorar, en enfermedad común o accidente no laboral, el tratamiento de:',
    options: ['Los días 21 en adelante, elevando el 75 % al 100 %', 'Los tres primeros días, estableciendo su abono por la empresa', 'Los días 4 a 20, elevando el 60 % al 100 %', 'Los días 16 a 30, trasladando a la empresa la responsabilidad definitiva'], answer: 'B', legal: 'Guía visual Tema 8, nacimiento y cuantía',
    rationale: 'La mejora convencional puede establecer el abono empresarial de los tres primeros días, que carecen de subsidio reglamentario.',
  },
  {
    stem: 'La nueva baja constituye recaída dentro del mismo proceso si se registra:',
    options: ['Por cualquier patología dentro de los 365 días siguientes', 'Por la misma patología dentro de los 90 días siguientes a la resolución de IP', 'Por la misma o similar patología dentro de los 180 días naturales siguientes a la fecha de efectos del alta anterior', 'Por una patología distinta dentro de los 545 días del proceso'], answer: 'C', legal: 'Art. 174 TRLGSS',
    rationale: 'La recaída general exige misma o similar patología y nueva baja dentro de los 180 días naturales siguientes a los efectos del alta anterior.',
  },
  {
    stem: 'La excepción a la regla general de recaída es que, en la menstruación incapacitante secundaria:',
    options: ['La recaída computa solo la mitad de su duración', 'El nuevo proceso exige siempre 180 días adicionales de cotización', 'La cuantía pasa automáticamente al 100 % de la base reguladora', 'Cada proceso se considera nuevo y no se acumula al periodo máximo ni a su prórroga'], answer: 'D', legal: 'Art. 170.4 TRLGSS',
    rationale: 'Cada proceso por menstruación incapacitante secundaria se considera nuevo y no computa para el máximo ordinario ni su prórroga, ni genera recaída.',
  },
  {
    stem: 'Los límites 365, 545 y 730 días significan, respectivamente:',
    options: ['Duración ordinaria de la IT, duración máxima del subsidio y límite conjunto de IT más prolongación por demora de calificación', 'Duración máxima del subsidio, duración ordinaria y plazo de resolución de IP', 'Plazo de observación, duración máxima del subsidio y límite del pago delegado', 'Duración ordinaria, duración del cese de cotización y límite del pago voluntario'], answer: 'A', legal: 'Arts. 169 y 174 TRLGSS',
    rationale: '365 marca la duración ordinaria; 545 agota el subsidio; 730 limita conjuntamente la IT y prolongación por demora de calificación de IP.',
  },
  {
stem: 'Hasta el cumplimiento de los 365 días de duración de la incapacidad temporal, el INSS ejerce, a través de su inspección médica, las mismas competencias que el servicio público de salud para:',
    options: ['Emitir un alta médica a todos los efectos y considerar que existe recaída en un mismo proceso', 'Emitir los partes ordinarios de baja y confirmación en el ámbito de las contingencias comunes', 'Declarar la extinción del derecho al subsidio antes de que se agote la duración máxima', 'Sustituir al servicio público de salud en el control médico ordinario del proceso'], answer: 'A', legal: 'Art. 170 TRLGSS',
    rationale: 'Hasta los 365 días, el INSS ejerce a través de su inspección médica las mismas competencias que la inspección del servicio público de salud para emitir un alta médica a todos los efectos y para considerar que existe recaída en un mismo proceso. Los partes ordinarios de baja, confirmación y alta corresponden al servicio público de salud y, en su ámbito, a mutuas y empresas colaboradoras.',
  },
  {
    stem: 'Agotados los 365 días, la inspección médica del INSS es la única competente para emitir:',
    options: ['Únicamente el alta por curación', 'Altas por curación, mejoría, propuesta de incapacidad permanente o incomparecencia, y nueva baja por la misma o similar patología dentro de los 180 días naturales posteriores', 'Partes de baja y confirmación ordinarios', 'Solo la resolución administrativa de extinción del derecho'], answer: 'B', legal: 'Art. 170 TRLGSS',
    rationale: 'Después de 365 días, el INSS concentra en exclusiva las altas, propuestas de IP y nuevas bajas por similar patología en los 180 días siguientes.',
  },
  {
    stem: 'Cuando se emite el último parte de confirmación antes de agotar los 365 días:',
    options: ['El servicio público de salud continuará emitiendo confirmaciones hasta el día 545', 'La empresa comunicará al INSS el agotamiento dentro de los diez días siguientes', 'La mutua asumirá automáticamente el control hasta el día 545', 'Se comunicará a la persona el cambio de control; cumplido el plazo cesarán las confirmaciones y el servicio público de salud comunicará al INSS el agotamiento de inmediato y, en todo caso, el primer día hábil siguiente'], answer: 'D', legal: 'Art. 170 TRLGSS',
    rationale: 'La persona debe conocer el cambio de control; al agotarse 365 días cesan las confirmaciones y el servicio lo comunica de inmediato, como máximo el primer día hábil siguiente.',
  },
  {
    stem: 'Si el alta fue expedida por el INSS antes del día 365, la nueva baja por la misma o similar patología durante los 180 días siguientes corresponde:',
    options: ['Al facultativo del servicio público de salud', 'Exclusivamente al INSS', 'A la mutua colaboradora', 'A la empresa colaboradora'], answer: 'B', legal: 'Art. 170 TRLGSS',
    rationale: 'Si el alta la expidió el INSS antes de los 365 días, la nueva baja por patología igual o similar dentro de 180 días corresponde exclusivamente al INSS.',
  },
  {
    stem: 'Tras superar el umbral ordinario, una persona discrepa de la decisión que cierra el proceso. ¿Qué pasos siguen?',
    options: ['4 días hábiles para reclamar ante la mutua; silencio a los 15 días', '10 días hábiles para recurrir directamente ante el director provincial del INSS', '4 días naturales para manifestarla ante la inspección médica del servicio público de salud; si esta discrepa, 7 días naturales para proponer al INSS la reconsideración, que dispone de otros 7 días naturales', '15 días naturales para presentar alegaciones ante el Equipo de Valoración de Incapacidades'], answer: 'C', legal: 'Art. 170 TRLGSS',
    rationale: 'La secuencia es 4-7-7 en días naturales: persona trabajadora, servicio público de salud e INSS.',
  },
  {
    stem: 'Si no hay pronunciamiento de la inspección sanitaria en el procedimiento de disconformidad, el alta adquiere plenos efectos transcurridos:',
    options: ['11 días naturales', '4 días naturales', '7 días naturales', '10 días hábiles'], answer: 'A', legal: 'Art. 170 TRLGSS',
    rationale: 'A falta de pronunciamiento, el alta adquiere plenos efectos transcurridos 11 días naturales.',
  },
  {
    stem: 'Durante la tramitación de la discrepancia, ¿qué sucede con la prestación y la colaboración?',
    options: ['La prestación queda siempre suspendida desde la fecha del alta', 'Si el INSS reconsidera el alta, se reconoce la prórroga a todos los efectos; si la confirma, la IT solo se prorroga hasta la fecha de la última resolución', 'La empresa pierde automáticamente toda función de pago aunque existiera colaboración voluntaria', 'El periodo entre el alta y la adquisición de plenos efectos se considera prorrogada la IT; la reconsideración la reconoce a todos los efectos y la confirmación la limita hasta la última resolución, manteniéndose la colaboración en el pago'], answer: 'D', legal: 'Art. 170 TRLGSS',
    rationale: 'El periodo intermedio se considera prórroga de IT; la reconsideración la reconoce a todos los efectos y la confirmación la limita hasta la última resolución, manteniendo la colaboración en el pago.',
  },
  {
    stem: 'Los partes de baja, confirmación y alta se remiten al INSS:',
    options: ['Por vía telemática, de manera inmediata y, en todo caso, a más tardar el primer día hábil siguiente a su expedición', 'En los cinco días hábiles siguientes, por cualquier medio', 'Solo a petición de la empresa', 'Junto con la nómina mensual de la persona trabajadora'], answer: 'A', legal: 'RD 625/2014',
    rationale: 'La remisión al INSS es telemática e inmediata y, como límite, el primer día hábil siguiente a la expedición.',
  },
  {
    stem: 'En un proceso de duración prevista muy breve (menos de cinco días):',
    options: ['Se emite baja y un primer parte de confirmación a los siete días', 'Solo se emite el alta transcurridos cinco días', 'Debe emitirse informe complementario junto con la baja', 'La baja y el alta se emiten en el mismo acto; el alta puede fijarse el mismo día o dentro de los tres días naturales siguientes'], answer: 'D', legal: 'RD 625/2014',
    rationale: 'En procesos estimados de menos de cinco días naturales, baja y alta se expiden en el mismo acto; el alta puede ser ese día o dentro de los tres días naturales siguientes.',
  },
  {
    stem: 'Para un proceso de duración prevista entre cinco y treinta días:',
    options: ['Primera revisión máximo a los 7 días naturales desde la baja y partes sucesivos con intervalo máximo de 14 días naturales', 'Primera revisión máximo a los 14 días y partes sucesivos cada 35', 'Primera revisión máximo a los 7 días hábiles y partes sucesivos cada 28 días', 'No se exige revisión mientras no supere los treinta días'], answer: 'A', legal: 'RD 625/2014',
    rationale: 'Para 5-30 días: primera confirmación en un máximo de 7 días naturales; las sucesivas, con intervalo máximo de 14 días naturales.',
  },
  {
    stem: 'En un proceso cuya duración prevista alcanza al menos 61 días:',
    options: ['Primera revisión a los 7 días y partes sucesivos cada 14', 'Primera revisión a los 14 días hábiles y partes cada 35 días hábiles', 'Primera revisión máximo a los 14 días naturales desde la baja y partes sucesivos con intervalo máximo de 35 días naturales', 'Se emite directamente parte trimestral sin revisión inicial'], answer: 'C', legal: 'RD 625/2014',
    rationale: 'Para 61 días o más: primera confirmación en un máximo de 14 días naturales y sucesivas cada 35 días naturales como máximo.',
  },
  {
    stem: 'En procesos del servicio público de salud con duración prevista superior a 30 días naturales:',
    options: ['El primer parte de confirmación debe ir siempre acompañado de informe complementario', 'El segundo parte de confirmación se acompaña de informe complementario, que se actualiza cada dos partes posteriores', 'El informe complementario solo se exige a partir del día 365', 'La empresa debe emitir informe trimestral de control'], answer: 'B', legal: 'RD 625/2014',
    rationale: 'En procesos de más de 30 días, el informe complementario se adjunta al segundo parte de confirmación y se actualiza cada dos partes posteriores.',
  },
  {
    stem: 'El informe trimestral de control:',
    options: ['Lo emite la inspección médica del servicio público de salud o el médico de atención primaria bajo su supervisión, y debe justificar médicamente la necesidad de mantener la IT', 'Lo emite la empresa y justifica la necesidad de mantener la relación laboral', 'Lo emite la mutua para todas las contingencias', 'Solo se emite cuando se solicita incapacidad permanente'], answer: 'A', legal: 'RD 625/2014',
    rationale: 'El informe lo emite la inspección médica del servicio público de salud o atención primaria bajo su supervisión y justifica médicamente la persistencia de la IT.',
  },
  {
    stem: 'En contingencias comunes, el parte de alta médica puede ser emitido por:',
    options: ['El facultativo o inspector médico del servicio público de salud, el inspector médico del INSS y, en su caso, el inspector médico del ISM', 'Únicamente el médico de la mutua', 'El empresario, previo informe del comité de empresa', 'Cualquier facultativo, aunque no pertenezca a los servicios competentes'], answer: 'A', legal: 'RD 625/2014',
    rationale: 'En contingencias comunes pueden emitir el alta los facultativos o inspectores competentes del servicio de salud, y los inspectores médicos del INSS o ISM en su ámbito.',
  },
  {
    stem: 'El parte de alta médica debe contener:',
    options: ['Únicamente la fecha de reincorporación y la firma del facultativo', 'La valoración de contingencia, la cuantía de la prestación y el CCC de la empresa', 'El informe del Equipo de Valoración de Incapacidades y la propuesta de incapacidad permanente', 'La causa del alta, el código del diagnóstico definitivo y la fecha de la baja inicial'], answer: 'D', legal: 'RD 625/2014',
    rationale: 'El parte de alta recoge la causa del alta, el código de diagnóstico definitivo y la fecha de la baja inicial.',
  },
  {
    stem: 'El alta médica:',
    options: ['Produce efectos laborales el mismo día de su emisión y extingue la asistencia sanitaria', 'Extingue el proceso de IT, produce efectos laborales el día siguiente a su emisión y no impide continuar la asistencia sanitaria necesaria', 'Solo extingue la IT si media resolución del INSS', 'Deja sin efectos el alta en la Seguridad Social, pero no la situación de IT'], answer: 'B', legal: 'RD 625/2014',
    rationale: 'El alta extingue la IT y tiene efectos laborales al día siguiente, pero no impide que continúe la asistencia sanitaria necesaria.',
  },
  {
    stem: 'Si una mutua considera que una persona en contingencia común puede no estar impedida para el trabajo:',
    options: ['Emite directamente un alta médica efectiva', 'Deniega administrativamente la prestación sin intervención facultativa', 'Comunica la extinción directamente a la empresa y cesa el pago', 'Formula una propuesta motivada de alta, con informes y pruebas, que se traslada a la inspección médica del servicio público de salud'], answer: 'D', legal: 'RD 625/2014',
    rationale: 'En contingencias comunes la mutua formula propuesta motivada de alta, acompañada de informes y pruebas, dirigida a la inspección médica del servicio de salud.',
  },
  {
    stem: 'Sobre la tramitación de la propuesta médica en contingencia común:',
    options: ['Si el facultativo confirma la baja, la inspección traslada el informe a la mutua en un máximo de 15 días; si no se resuelve, la mutua solicita el alta al SPS, que resuelve en 10 días', 'La inspección debe resolver siempre en 4 días hábiles', 'La mutua puede imponer el alta si el facultativo no contesta en 24 horas', 'Si el facultativo confirma la baja, la inspección traslada el informe a la mutua en un máximo de 5 días; si no se resuelve y notifica en ese plazo, la mutua puede acudir al INSS o ISM, que resuelven en los 4 días siguientes'], answer: 'D', legal: 'RD 625/2014',
    rationale: 'Si se confirma la baja, el informe se traslada a la mutua en cinco días; ante falta de resolución y notificación, la mutua puede solicitar el alta al INSS o ISM, que resuelve en cuatro días.',
  },
  {
    stem: 'Para el reconocimiento del subsidio de IT:',
    options: ['Es precisa solicitud escrita en todos los casos', 'No es necesaria solicitud; la declaración del derecho corresponde a la entidad gestora, la mutua colaboradora o la empresa colaboradora voluntaria cuando cubra la contingencia', 'La iniciativa corresponde exclusivamente a la persona trabajadora', 'Corresponde al servicio público de salud, que también abona la prestación'], answer: 'B', legal: 'Art. 82 TRLGSS; guía visual Tema 8, reconocimiento',
    rationale: 'No se requiere solicitud; declaran el derecho la entidad gestora, la mutua o, si cubre voluntariamente, la empresa colaboradora.',
  },
  {
    stem: 'El procedimiento para determinar la contingencia causante puede iniciarse:',
    options: ['Únicamente de oficio por el INSS', 'De oficio por el INSS o a instancia de la persona trabajadora, mutuas, empresas colaboradoras directamente afectadas y otros sujetos previstos', 'Únicamente a instancia de la persona trabajadora', 'Solo mediante denuncia de la Inspección de Trabajo y Seguridad Social'], answer: 'B', legal: 'Art. 6 RD 1430/2009',
    rationale: 'Puede iniciarlo el INSS de oficio o los sujetos legitimados que contempla el procedimiento, incluida la persona trabajadora, mutua y empresa colaboradora directamente afectada.',
  },
  {
    stem: 'Sobre los plazos para las actuaciones iniciales y las alegaciones:',
    options: ['Las entidades disponen de 4 días hábiles y la persona trabajadora, si no inició el procedimiento, de 10 días hábiles', 'Todas las partes disponen de 15 días naturales', 'Las entidades disponen de 4 días hábiles improrrogables y la persona trabajadora, si no inició el procedimiento, de 10 días hábiles', 'El plazo es de 10 días hábiles para todas las personas y entidades'], answer: 'C', legal: 'Art. 6 RD 1430/2009',
    rationale: 'Las entidades aportan antecedentes en 4 días hábiles improrrogables; la persona trabajadora dispone de 10 días hábiles si no inició el procedimiento.',
  },
  {
    stem: 'Para concluir el trámite administrativo de calificación, ¿qué secuencia rige?',
    options: ['El informe del Equipo de Valoración es preceptivo y el director provincial del INSS resuelve en un máximo de 15 días hábiles', 'El informe es facultativo y resuelve la mutua en 15 días naturales', 'El informe lo emite el servicio público de salud y resuelve el INSS en 30 días', 'No se requiere informe si consta parte de alta médica'], answer: 'A', legal: 'Art. 6 RD 1430/2009',
    rationale: 'El informe del EVI es preceptivo y el director provincial del INSS resuelve en un máximo de 15 días hábiles.',
  },
  {
    stem: 'Si una IT se abonó como contingencia común y posteriormente se declara profesional, cuando la contingencia profesional esté cubierta por mutua:',
    options: ['La mutua abona a la persona las diferencias a su favor, reintegra a la entidad gestora la prestación abonada y al servicio público de salud el coste asistencial', 'La entidad gestora conserva íntegramente lo abonado', 'La empresa debe asumir las diferencias sin compensación', 'No se produce ajuste económico alguno'], answer: 'A', legal: 'Art. 6 RD 1430/2009',
    rationale: 'Declarada profesional la contingencia y cubierta por mutua, esta abona las diferencias favorables a la persona y reintegra prestación y coste asistencial a las entidades correspondientes.',
  },
  {
    stem: 'Si una IT se abonó como profesional y se declara común:',
    options: ['La mutua pierde definitivamente todo lo abonado', 'La persona trabajadora devuelve íntegramente la prestación percibida', 'La entidad gestora y el servicio público de salud reintegran a la mutua los gastos generados hasta la cuantía correspondiente a la contingencia común; si la misma mutua cubría ambas, compensa internamente', 'La empresa queda responsable de todos los importes'], answer: 'C', legal: 'Art. 6 RD 1430/2009',
    rationale: 'Al declararse común, entidad gestora y servicio de salud reintegran a la mutua hasta el importe que habría correspondido por contingencia común; una misma mutua compensa internamente.',
  },
  {
    stem: 'Cuando la cobertura de una contingencia común se concierta con la misma mutua que las contingencias profesionales:',
    options: ['La mutua sustituye al servicio público de salud en el control médico', 'La mutua ejerce funciones de declaración, denegación, suspensión, anulación y extinción del derecho, sin perjuicio del control sanitario competente', 'La empresa se convierte en responsable económica definitiva', 'El INSS deja de participar en el proceso en todos los casos'], answer: 'B', legal: 'Art. 82 TRLGSS',
    rationale: 'La mutua puede asumir la gestión del derecho económico en comunes, pero sin perjuicio del control sanitario que corresponde a los servicios públicos competentes.',
  },
  {
    stem: 'En contingencias profesionales:',
    options: ['La responsabilidad corresponde al INSS o a la mutua colaboradora con convenio, aunque la empresa pueda abonar materialmente la prestación', 'La responsabilidad económica corresponde siempre a la empresa', 'El pago delegado implica que la empresa asume definitivamente la prestación', 'La mutua colaboradora solo puede pagar si la empresa no existe'], answer: 'A', legal: 'Art. 82 TRLGSS; RD 1403/2009',
    rationale: 'La responsabilidad económica corresponde al INSS o a la mutua según cobertura, aunque la empresa materialice el pago delegado.',
  },
  {
    stem: 'La colaboración obligatoria de la empresa en el pago se mantiene hasta la primera de estas referencias:',
    options: ['Siempre durante los 365 días completos', 'La notificación de la baja médica o el día 730', 'La notificación de ciertas altas médicas, el último día del mes del alta con propuesta de incapacidad permanente o el cumplimiento de los 545 días', 'La resolución de jubilación o la fecha del alta en el régimen'], answer: 'C', legal: 'Art. 82 TRLGSS; RD 1403/2009',
    rationale: 'La colaboración obligatoria cesa en las referencias legalmente previstas: notificación de determinadas altas, fin de mes del alta con propuesta de IP o agotamiento de 545 días.',
  },
  {
    stem: 'Una vez cesa la colaboración obligatoria:',
    options: ['La prestación queda extinguida automáticamente', 'Debe abonarla siempre la empresa durante otros seis meses', 'Pasa a abonarla el servicio público de salud', 'El subsidio lo abona directamente la entidad gestora o la mutua colaboradora'], answer: 'D', legal: 'Art. 82 TRLGSS; RD 1403/2009',
    rationale: 'Al cesar el pago delegado, el abono directo corresponde a la entidad gestora o a la mutua colaboradora responsable.',
  },
  {
    stem: 'En la IT de una persona jubilada parcial:',
    options: ['La empresa está obligada a pagar durante los 545 días', 'La prestación se abona a través de la mutua de contingencias comunes', 'El pago se efectúa directamente por la entidad gestora o colaboradora', 'No existe derecho a prestación económica por IT'], answer: 'C', legal: 'Art. 82 TRLGSS; guía visual Tema 8, pago directo',
    rationale: 'La IT de personas jubiladas parcialmente es uno de los supuestos de pago directo por la entidad gestora o colaboradora.',
  },
  {
    stem: 'Las empresas colaboradoras voluntarias mantienen el pago hasta:',
    options: ['El día 365, aunque exista prolongación de efectos económicos', 'El agotamiento de los 730 días en todos los casos', 'La fecha en que la Seguridad Social reconozca la incapacidad permanente', 'La notificación del alta médica o la resolución de extinción del subsidio, incluida la prolongación de efectos económicos cuando proceda'], answer: 'D', legal: 'Art. 82 TRLGSS; RD 1403/2009',
    rationale: 'La colaboración voluntaria se mantiene hasta el alta o resolución que extingue el subsidio, incluida la prolongación de efectos económicos cuando proceda.',
  },
  {
    stem: '¿Cuál de las siguientes NO es causa de extinción del derecho al subsidio de IT?',
    options: ['La incomparecencia justificada a un reconocimiento médico convocado', 'El transcurso de los 545 días naturales desde la baja médica', 'El alta médica por curación o por mejoría para realizar el trabajo habitual', 'El reconocimiento de una pensión de jubilación'], answer: 'A', legal: 'Art. 174 TRLGSS',
    rationale: 'La incomparecencia que puede extinguir es la injustificada; una ausencia justificada no es causa de extinción.',
  },
  {
    stem: 'Si se deniega una incapacidad permanente iniciada antes del día 545:',
    options: ['El proceso de IT queda definitivamente extinguido, sea cual sea la patología', 'Durante los 180 días naturales posteriores a la denegación, el INSS es el único competente para una nueva baja por la misma o similar patología y el proceso se reanuda hasta completar, como máximo, 545 días', 'La persona debe esperar 180 días para cualquier nueva baja', 'La competencia corresponde a la mutua durante 365 días'], answer: 'B', legal: 'Art. 174 TRLGSS',
    rationale: 'Si la IP se deniega antes de 545 días, el INSS conserva la competencia para una nueva baja por la misma o similar patología durante 180 días y el proceso puede reanudarse hasta completar el máximo.',
  },
  {
    stem: 'Al agotarse la duración máxima del subsidio:',
    options: ['Solo se examina a la persona si solicita incapacidad permanente', 'La obligación de cotizar subsiste durante los 90 días siguientes', 'La prolongación de efectos tiene una duración fija de 180 días', 'Se examinará necesariamente su estado y la calificación de incapacidad permanente deberá realizarse en un máximo de 90 días naturales'], answer: 'D', legal: 'Art. 174 TRLGSS',
    rationale: 'Agotados 545 días debe examinarse necesariamente el estado de la persona y calificarse la IP en un máximo de 90 días naturales.',
  },
  {
    stem: 'Agotados los 545 días, ¿cuándo puede demorarse la calificación de incapacidad permanente y con qué límite?',
    options: ['Si continua la necesidad de tratamiento médico por expectativa de recuperación o mejora con vistas a la reincorporación, sin que IT más prolongación supere los 730 días naturales', 'Siempre que el trabajador lo solicite, hasta un máximo de 730 días naturales', 'Si el INSS lo estima oportuno, sin límite temporal siempre que persista la incapacidad', 'Solo durante 90 días naturales, sin posibilidad de prórroga'], answer: 'A', legal: 'Art. 174 TRLGSS',
    rationale: 'La calificación puede demorarse cuando continúa la necesidad de tratamiento médico por la expectativa de recuperación o mejora con vistas a la reincorporación laboral, sin que los días de IT más los de prolongación de sus efectos superen los 730 días naturales. Exige resolución expresa del INSS, comunicada telemáticamente a la empresa, a propuesta del EVI y previa audiencia de la mutua por siete días hábiles si la contingencia está cubierta por ella. Durante los períodos de 90 días y de demora no subsistirá la obligación de cotizar.',
  },
  {
    stem: 'Cuando el alta propone el reconocimiento de una prestación de larga duración, ¿qué efecto tiene sobre la IT?',
    options: ['No extingue la IT hasta que se notifique la resolución de pensión', 'Solo puede expedirse después del día 545', 'Impide automáticamente el reconocimiento de cualquier pensión', 'Extingue la situación de IT con independencia del momento en que se expida y genera una prolongación de efectos económicos hasta que se notifique la resolución de incapacidad permanente'], answer: 'D', legal: 'Art. 174 TRLGSS',
    rationale: 'El alta con propuesta de IP extingue la IT y da paso a prolongación de efectos económicos hasta que se notifique la resolución de IP.',
  },
  {
    stem: 'En la prolongación de efectos económicos, ¿desde cuándo surten efectos la incapacidad permanente reconocida y cuándo se retrotraen?',
    options: ['Desde la fecha de la resolución de la entidad gestora, salvo que la prestación reconocida sea superior a la percibida por prolongación, en cuyo caso se retrotraen al día siguiente a la extinción de la IT', 'Siempre desde la fecha del alta médica que extinguish la incapacidad temporal', 'Desde la fecha de la resolución, sin posibilidad de retroacción en ningún caso', 'Desde el día siguiente a la baja médica inicial en todos los supuestos'], answer: 'A', legal: 'Art. 174 TRLGSS',
    rationale: 'En la prolongación de efectos económicos, los efectos de la incapacidad permanente reconocida coinciden con la fecha de la resolución de la entidad gestora. Solo si la prestación reconocida es superior a la que venía percibiendo en concepto de prolongación de efectos se retrotraen al día siguiente al de extinción de la incapacidad temporal.',
  },
  {
    stem: 'Si la misma o similar patología reaparece antes de que transcurran 180 días desde la denegación de incapacidad permanente:',
    options: ['Podrá iniciarse un nuevo proceso por una sola vez si el INSS considera que la persona puede recuperar su capacidad laboral; acordará la baja exclusivamente a efectos de la prestación económica por IT', 'No cabe ningún nuevo proceso en ningún caso', 'La mutua podrá iniciarlo las veces que estime oportuno', 'La persona tendrá derecho automático durante 545 días adicionales'], answer: 'A', legal: 'Art. 174 TRLGSS',
    rationale: 'El INSS puede iniciar por una sola vez un nuevo proceso dentro de los 180 días si aprecia posible recuperación, con baja a efectos exclusivos de la prestación económica.',
  },
  {
    stem: 'Una incapacidad permanente en grados de total, absoluta o gran invalidez no extingue la relación laboral porque la empresa adapta razonablemente el trabajo o destina a la persona a otra función. ¿Qué efecto tiene sobre la prestación de incapacidad permanente?',
    options: ['Se suspende durante el desempeño del puesto adaptado o de otro incompatible con la pensión', 'Se extingue desde el alta médica, aunque la relación laboral se mantenga por la adaptación del puesto', 'Se mantiene íntegra mientras la persona ocupe el puesto, aunque resulte incompatible con la pensión que correspondería', 'Se reduce a la mitad mientras se ocupe el puesto adaptado, sin llegar a suspenderse'], answer: 'A', legal: 'Art. 198 TRLGSS; art. 49.1.n) ET',
    rationale: 'Cuando la declaración de incapacidad permanente en los grados de total, absoluta o gran incapacidad no determina la extinción de la relación laboral por la adaptación razonable, necesaria y adecuada del puesto o por haber destinado a la persona trabajadora a otro puesto, la prestación de incapacidad permanente se suspende durante el desempeño de ese puesto adaptado o de otro incompatible con la percepción de la pensión.',
  },
];

const clusterByItem = (index: number): string => {
  if (index <= 10) return 'cluster_it_situaciones_especiales';
  if ([17,18,19,20,21,22,23,24,25,14,15].includes(index)) return 'cluster_it_cuantia_nacimiento';
  if (index >= 63 || [30,31,32,65,66,67,68,69,70].includes(index)) return 'cluster_it_extincion_efectos';
  return 'cluster_it_competencias_control';
};

// Keep answer choices discriminative and reasonably parallel in length; the
// complete legal rule remains in each item's rationale and corrective_rule.
const conciseCorrectAnswers: Record<number, string> = {
  5: 'Prórroga ordinaria de la propia IT.',
  7: 'Común; subsidio al día siguiente; empresa paga íntegra la baja.',
  8: 'Día siguiente a la baja hasta el parto; la baja, salario íntegro empresarial.',
  9: 'Preparación, ingreso y recuperación hasta alta por curación.',
  12: '180 días en los cinco años previos al hecho causante.',
  10: 'Sin carencia; 100 % de base común desde el día de baja.',
  11: 'Situación protegida, alta/asimilada y cotización previa cuando proceda.',
  15: '1,4 días por día cotizado, con tope mensual del mes efectivo.',
  18: 'Los días del mes cotizado.',
  21: 'Todas las bases, con el tope máximo vigente.',
  22: 'Bases desde la última alta (máx. 3 meses previos) / días naturales del periodo; abono por días naturales.',
  23: '60 % días 4-20; 75 % desde día 21.',
  25: 'AT/EP: 75 %; donación: 100 % de base común.',
  26: 'Sin subsidio días 1-3; empresa abona del 4 al 15.',
  27: 'Empresa: salario íntegro en baja; subsidio, día siguiente.',
  28: 'Mismo día: menstruación/donación; día siguiente: interrupción/gestación.',
  30: 'Misma o similar patología en 180 días naturales desde efectos del alta.',
  31: 'Proceso nuevo: no genera recaída ni suma al máximo o prórroga.',
  32: '365: IT ordinaria; 545: subsidio máximo; 730: IT más demora de IP.',
  33: 'Emitir alta médica a todos los efectos y considerar que existe recaída en un mismo proceso.',
  34: 'INSS: altas, IP y nuevas bajas similares en 180 días.',
  35: 'Al cumplir 365: cesan partes; SPS avisa al INSS (máximo, día hábil siguiente).',
  37: '4-7-7 días naturales: trabajador, servicio de salud e INSS.',
  39: 'IT prorrogada; reconsideración íntegra, confirmación hasta resolución; pago sigue.',
  40: 'Vía telemática, inmediata; límite: siguiente día hábil.',
  41: 'Baja y alta juntas; alta en el acto o hasta 3 días naturales.',
  42: 'Primera revisión en 7 días naturales; siguientes cada 14 como máximo.',
  43: 'Primera revisión en 14 días naturales; siguientes cada 35 como máximo.',
  44: 'Informe en segundo parte; actualización cada dos partes posteriores.',
  45: 'Inspección SPS/AP supervisada: justifica médicamente mantener IT.',
  46: 'Facultativo/inspector SPS, inspector INSS o ISM si procede.',
  48: 'Extingue IT; efectos laborales al día siguiente; asistencia puede seguir.',
  49: 'Mutua presenta propuesta motivada, con pruebas, ante inspección del SPS.',
  50: 'Traslado en 5 días; ante silencio, mutua pide alta a INSS/ISM (4 días).',
  51: 'Sin solicitud: declara gestora, mutua o empresa colaboradora.',
  52: 'De oficio por INSS o a instancia de sujetos legitimados.',
  53: 'Entidades: 4 hábiles; trabajador: 10 hábiles si no inició trámite.',
  54: 'EVI preceptivo; INSS resuelve en 15 días hábiles.',
  55: 'Mutua paga diferencias y reintegra prestación y asistencia.',
  56: 'Reintegro hasta cuantía común; misma mutua compensa internamente.',
  57: 'Mutua gestiona el derecho; servicio competente conserva control sanitario.',
  58: 'Responde INSS/mutua; empresa puede materializar pago delegado.',
  59: 'Alta aplicable, fin de mes con propuesta IP o día 545.',
  60: 'Abono directo por entidad gestora o mutua.',
  62: 'Hasta alta o extinción, incluida la prolongación económica.',
  64: 'INSS decide nueva baja similar en 180 días; IT completa máximo 545.',
  65: 'Examen obligatorio; calificación de IP en 90 días naturales.',
  66: 'Si continúa el tratamiento médico por recuperación o mejora; IT + prolongación ≤ 730 días.',
  67: 'Extingue IT; prolonga efectos económicos hasta resolución de IP.',
  68: 'Desde la resolución; si supera lo percibido, retroacción al día siguiente a la extinción.',
  69: 'Una nueva baja económica si el INSS prevé recuperación.',
  70: 'Se suspende durante el desempeño del puesto adaptado o de otro incompatible con la pensión.',
};

function trapForOption(text: string, correct: string): TrapType {
  if (/\d|por ciento|%|euros?|€/.test(text) && !new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(correct)) return 'numeric_substitution';
  if (/naturales|hábiles|día siguiente|día de la baja|meses|días/.test(text)) return 'temporal_confusion';
  if (/INSS|ISM|mutua|empresa|servicio público|facultativo|inspección/i.test(text)) return 'wrong_competent_body';
  if (/solo|únicamente|siempre|automáticamente|ningún|toda|todos/i.test(text)) return 'overbroad_statement';
  return 'partial_rule_accuracy';
}

function makeItem(question: Question, index: number): Item {
  const itemNumber = index + 1;
  const originalCorrect = question.options[question.answer.charCodeAt(0) - 65];
  const correctText = conciseCorrectAnswers[itemNumber] ?? originalCorrect;
  const options: MCQOption[] = question.options.map((text, optionIndex) => {
    const isCorrect = String.fromCharCode(65 + optionIndex) === question.answer;
    return {
      id: String.fromCharCode(65 + optionIndex),
      text: isCorrect ? correctText : text,
      is_correct: isCorrect,
      trap_type: isCorrect ? 'partial_rule_accuracy' : trapForOption(text, correctText),
      explanation: isCorrect
        ? question.rationale
        : `Incorrecta. ${question.rationale} La opción propuesta cambia esa regla: «${text}».`,
      condition_if_correct: isCorrect
        ? 'Correcta conforme a la regla sintetizada en la explicación.'
        : `Solo sería correcta si la regla aplicable estableciera: «${text}».`,
    };
  });
  const cognitive: CognitiveOperation[] = /\d|%|€|día|días|meses|plazo/i.test(question.stem)
    ? ['generative_retrieval', 'numeric_precision', 'micro_discrimination']
    : ['generative_retrieval', 'micro_discrimination', 'application'];
  return {
    id: `item-t8-${index + 1}`,
    topic_id: TOPIC,
    cluster_id: clusterByItem(index + 1),
    item_type: 'cover_and_generate_mcq',
    stem: question.stem,
    options,
    correct_answer: question.answer,
    legal_basis: question.legal,
    rule_statement: correctText,
    why_correct: question.rationale,
    distractor_analysis: Object.fromEntries(options.filter((o) => !o.is_correct).map((o) => [o.id, o.explanation!])),
    trap_types: options.filter((o) => !o.is_correct).map((o) => o.trap_type!),
    corrective_rule: question.rationale,
    difficulty: 4,
    cognitive_operations: cognitive,
    status: 'validated',
    source: 'manual',
    created_at: now,
    updated_at: now,
  };
}

export const seedItemsTema8: Item[] = questionBank.map(makeItem);
