import { Topic, SourceChunk, Atom, Cluster, ConfusionPair, Item } from '../src/types.ts';
import {
  seedTopicTema1,
  seedSourceChunksTema1,
  seedClustersTema1,
  seedConfusionPairsTema1,
  seedAtomsTema1,
  seedItemsTema1,
} from './seedDataTema1.ts';
import {
  seedTopicTema3,
  seedSourceChunksTema3,
  seedClustersTema3,
  seedConfusionPairsTema3,
  seedAtomsTema3,
  seedItemsTema3,
} from './seedDataTema3.ts';
import {
  seedTopicTema8,
  seedSourceChunksTema8,
  seedClustersTema8,
  seedConfusionPairsTema8,
} from './seedDataTema8Meta.ts';
import { seedItemsTema8 } from './seedDataTema8Items.ts';

export const seedTopic: Topic = {
  "id": "topic_seguridad_social_tema_7",
  "name": "Seguridad Social - Tema 7: Régimen General y Acción Protectora",
  "description": "Acción protectora, prescripción, caducidad, automaticidad, coeficientes, responsabilidades empresariales e importes 2026.",
  "source_file": "Diapositivas Tema 7 SS.pdf",
  "status": "active",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
};

export const seedTopics: Topic[] = [seedTopic, seedTopicTema1, seedTopicTema3, seedTopicTema8];

const seedSourceChunksTema7: SourceChunk[] = [
  {
    "id": "chunk_tema7_1",
    "topic_id": "topic_seguridad_social_tema_7",
    "page_number": 1,
    "article_reference": "Art. 53 y 54 TRLGSS",
    "raw_text": "Prescripción y caducidad de prestaciones en el Régimen General de la Seguridad Social.",
    "summary": "Plazos extintivos: 5 años para prescripción de reconocimiento, 1 año para caducidad de cobro.",
    "order_index": 1
  },
  {
    "id": "chunk_tema7_2",
    "topic_id": "topic_seguridad_social_tema_7",
    "page_number": 2,
    "article_reference": "Art. 167 TRLGSS",
    "raw_text": "Principio de automaticidad absoluta en AT/EP y relativa en contingencias comunes.",
    "summary": "Protección de los trabajadores frente a incumplimientos empresariales de alta y cotización.",
    "order_index": 2
  },
  {
    "id": "chunk_tema7_3",
    "topic_id": "topic_seguridad_social_tema_7",
    "page_number": 3,
    "article_reference": "Art. 247 y 249 bis TRLGSS",
    "raw_text": "Coeficientes de cómputo de cotizaciones: 1,5 en fijos-discontinuos y 1,4 en contratos cortos <= 5 días.",
    "summary": "Reglas de bonificación y cómputo temporal de cotizaciones.",
    "order_index": 3
  },
  {
    "id": "chunk_tema7_4",
    "topic_id": "topic_seguridad_social_tema_7",
    "page_number": 4,
    "article_reference": "Art. 58 y 59 TRLGSS",
    "raw_text": "Revalorización 2026 del 2,7% y cuantías máximas de 3.359,60 € mensuales y complementos a mínimos.",
    "summary": "Actualizaciones cuantitativas y límites presupuestarios para el año 2026.",
    "order_index": 4
  },
  {
    "id": "chunk_tema7_5",
    "topic_id": "topic_seguridad_social_tema_7",
    "page_number": 5,
    "article_reference": "Art. 44 TRLGSS y Art. 607 LEC",
    "raw_text": "Inembargabilidad absoluta del SMI y escala de embargabilidad del exceso del 30% al 90%.",
    "summary": "Régimen de protección del salario y pensiones frente a retenciones y embargos.",
    "order_index": 5
  }
];

export const seedSourceChunks: SourceChunk[] = [
  ...seedSourceChunksTema7,
  ...seedSourceChunksTema1,
  ...seedSourceChunksTema3,
  ...seedSourceChunksTema8,
];

const seedClustersTema7: Cluster[] = [
  {
    "id": "cluster_prescripcion_caducidad",
    "name": "Prescripción, caducidad y retroactividad",
    "type": "numeric",
    "priority": "critical",
    "description": "Plazos extintivos: 5 años vs 1 año, 3 meses de efectos económicos y causas interruptivas."
  },
  {
    "id": "cluster_automaticidad",
    "name": "Automaticidad absoluta y relativa",
    "type": "conceptual",
    "priority": "critical",
    "description": "Diferenciación del principio de anticipo según contingencias profesionales o comunes."
  },
  {
    "id": "cluster_coeficientes",
    "name": "Coeficientes y cómputo de cotización",
    "type": "numeric",
    "priority": "high",
    "description": "Multiplicadores: 1,5 fijos-discontinuos, 1,4 contratos cortos <= 5 días, 112 días parto."
  },
  {
    "id": "cluster_importes_2026",
    "name": "Revalorización e importes clave 2026",
    "type": "numeric",
    "priority": "high",
    "description": "Topes de pensión (3.359,60 €), 2,7% IPC, no contributivas (8.803,20 €), complementos por mínimos."
  },
  {
    "id": "cluster_intangibilidad_embargo",
    "name": "Intangibilidad, inembargabilidad y escala art. 607 LEC",
    "type": "procedural",
    "priority": "high",
    "description": "Inembargabilidad hasta SMI y escala porcentual del exceso (30% a 90%)."
  },
  {
    "id": "cluster_responsabilidad",
    "name": "Responsabilidad empresarial y recargos",
    "type": "institutional",
    "priority": "high",
    "description": "Incumplimiento de alta y cotización, responsabilidad directa, solidaria y subsidiaria."
  },
  {
    "id": "cluster_requisitos_generales",
    "name": "Requisitos generales: alta, asimilada y al corriente",
    "type": "procedural",
    "priority": "high",
    "description": "Presupuestos de acceso a la acción protectora e invitación al pago de 30 días."
  },
  {
    "id": "cluster_capital_coste",
    "name": "Capital coste y anticipo de prestaciones",
    "type": "institutional",
    "priority": "medium",
    "description": "Constitución obligatoria de capitales coste ante la TGSS y subrogación."
  },
  {
    "id": "cluster_contingencias",
    "name": "Contingencias comunes y profesionales",
    "type": "conceptual",
    "priority": "high",
    "description": "Diferenciación entre contingencia común y profesional y sus efectos protectores."
  },
  {
    "id": "cluster_accidente_enfermedad",
    "name": "Accidente de trabajo y enfermedad profesional",
    "type": "conceptual",
    "priority": "high",
    "description": "Presunciones de laboralidad, accidente in itinere y lista de enfermedades profesionales."
  },
  {
    "id": "cluster_incompatibilidades",
    "name": "Incompatibilidades y solapamientos",
    "type": "procedural",
    "priority": "medium",
    "description": "Régimen de incompatibilidad entre prestaciones del mismo o distinto régimen."
  },
  {
    "id": "cluster_recargo_medidas",
    "name": "Recargo por falta de medidas de seguridad (30%-50%)",
    "type": "procedural",
    "priority": "critical",
    "description": "Naturaleza no asegurable e imposición exclusiva sobre el empresario infractor."
  },
  {
    "id": "cluster_carencia_cotizacion",
    "name": "Carencia y cotización previa",
    "type": "numeric",
    "priority": "high",
    "description": "Periodos mínimos de cotización exigibles para subsidios y pensiones."
  },
  {
    "id": "cluster_beneficios_parto",
    "name": "Beneficios por parto y cuidado de familiares",
    "type": "numeric",
    "priority": "medium",
    "description": "112 días parto simple, +14 días parto múltiple y asimilación de excedencias."
  },
  {
    "id": "cluster_entidades_gestoras",
    "name": "Entidades gestoras y servicios comunes (INSS, TGSS, Mutuas)",
    "type": "institutional",
    "priority": "medium",
    "description": "Distribución competencial entre INSS, TGSS, ISM y Mutuas colaboradoras."
  }
];

export const seedClusters: Cluster[] = [...seedClustersTema7, ...seedClustersTema1, ...seedClustersTema3, ...seedClustersTema8];

const seedConfusionPairsTema7: ConfusionPair[] = [
  {
    "id": "pair_prescripcion_caducidad",
    "concept_a": "Prescripción de prestaciones",
    "concept_b": "Caducidad de prestaciones",
    "discriminating_cue": "Objeto: Prescripción extingue el RECONOCIMIENTO (5 años); Caducidad extingue el PERCIBO de lo ya reconocido (1 año).",
    "common_trap": "Aplicar 5 años al cobro de mensualidades o 1 año a la solicitud inicial.",
    "legal_basis_a": "Art. 53 TRLGSS",
    "legal_basis_b": "Art. 54 TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_prescripcion_retroactividad",
    "concept_a": "Prescripción (5 años)",
    "concept_b": "Retroactividad económica (3 meses)",
    "discriminating_cue": "5 años mide hasta cuándo se puede solicitar; 3 meses mide cuántas mensualidades devengadas hacia atrás se pagarán.",
    "common_trap": "Creer que al solicitar dentro de 5 años se abonarán todos los años anteriores.",
    "legal_basis_a": "Art. 53.1 TRLGSS",
    "legal_basis_b": "Art. 53.1 in fine TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_caducidad_alzado_periodicas",
    "concept_a": "Caducidad tanto alzado",
    "concept_b": "Caducidad prestaciones periódicas",
    "discriminating_cue": "Dies a quo: tanto alzado desde notificación de resolución; periódicas desde el vencimiento de cada mensualidad.",
    "common_trap": "Contar tanto alzado desde el hecho causante o periódicas desde la solicitud.",
    "legal_basis_a": "Art. 54.1 TRLGSS",
    "legal_basis_b": "Art. 54.2 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_automaticidad_absoluta_relativa",
    "concept_a": "Automaticidad absoluta",
    "concept_b": "Automaticidad relativa",
    "discriminating_cue": "Presupuesto de alta: la absoluta NO exige alta previa (profesionales); la relativa EXIGE alta previa (comunes).",
    "common_trap": "Creer que toda contingencia común se anticipa de oficio aunque no hubiera alta previa.",
    "legal_basis_a": "Decreto 21 abril 1966",
    "legal_basis_b": "Art. 167 TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_fijo_discontinuo_contrato_corto",
    "concept_a": "Coeficiente 1,5 (Fijo-discontinuo)",
    "concept_b": "Coeficiente 1,4 (Contratos <= 5 días)",
    "discriminating_cue": "Tope de cómputo: 1,5 tiene tope anual de días naturales; 1,4 tiene tope mensual de días del mes natural.",
    "common_trap": "Intercambiar 1,4 y 1,5 o sus topes anual vs mensual.",
    "legal_basis_a": "Art. 247 TRLGSS",
    "legal_basis_b": "Art. 249 bis TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_contrato_corto_tiempo_parcial",
    "concept_a": "Contrato <= 5 días (coeficiente 1,4)",
    "concept_b": "Contrato a tiempo parcial estándar",
    "discriminating_cue": "El coeficiente 1,4 solo opera en contratos temporales de duración <= 5 días; el tiempo parcial computa por horas trabajadas.",
    "common_trap": "Aplicar 1,4 a contratos a tiempo parcial de duración indefinida o superior a 5 días.",
    "legal_basis_a": "Art. 249 bis TRLGSS",
    "legal_basis_b": "Art. 248 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_intangibilidad_embargo_irpf",
    "concept_a": "Inembargabilidad y retención",
    "concept_b": "Exención de tributación IRPF",
    "discriminating_cue": "Inembargabilidad protege el SMI frente a acreedores (art. 44); exención IRPF exime solo a IP absoluta y gran invalidez (art. 7 LIRPF).",
    "common_trap": "Considerar que la pensión de jubilación está exenta de IRPF por ser inembargable hasta el SMI.",
    "legal_basis_a": "Art. 44 TRLGSS",
    "legal_basis_b": "Art. 7 Ley 35/2006",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_recargo_aseguramiento_medidas",
    "concept_a": "Recargo por falta de medidas (30%-50%)",
    "concept_b": "Responsabilidad por falta de aseguramiento",
    "discriminating_cue": "Asegurabilidad: el recargo de seguridad es inasegurable bajo sanción de nulidad; la falta de aseguramiento puede ser anticipada por la mutua.",
    "common_trap": "Pensar que un seguro de responsabilidad civil privada puede cubrir el recargo del 30%-50%.",
    "legal_basis_a": "Art. 164 TRLGSS",
    "legal_basis_b": "Art. 167 TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_inss_tgss_competencia",
    "concept_a": "INSS (Entidad Gestora)",
    "concept_b": "TGSS (Servicio Común)",
    "discriminating_cue": "INSS reconoce y abona prestaciones económicas contributivas; TGSS gestiona caja única, afiliación, cotización y recaudación.",
    "common_trap": "Atribuir a la TGSS el reconocimiento de jubilación o al INSS la concesión de un aplazamiento de cuotas.",
    "legal_basis_a": "Art. 66 TRLGSS",
    "legal_basis_b": "Art. 74 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_falta_alta_falta_cotizacion",
    "concept_a": "Falta de afiliación/alta",
    "concept_b": "Falta de cotización (descubierto)",
    "discriminating_cue": "Falta de alta es omisión constitutiva; falta de cotización con alta previa permite operar la automaticidad relativa.",
    "common_trap": "Equiparar el descubierto de cuotas de una empresa con el trabajo no declarado sin alta.",
    "legal_basis_a": "Art. 166 TRLGSS",
    "legal_basis_b": "Art. 167 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "concept_a": "Responsabilidad solidaria (contratas propia actividad)",
    "concept_b": "Responsabilidad subsidiaria",
    "discriminating_cue": "Solidaria permite dirigirse a contratista o principal durante 1 año (art. 42 ET); subsidiaria exige previa insolvencia del deudor principal.",
    "common_trap": "Exigir previa insolvencia en subcontratación de propia actividad.",
    "legal_basis_a": "Art. 42 ET",
    "legal_basis_b": "Art. 168 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_hecho_causante_solicitud_notificacion",
    "concept_a": "Hecho causante vs solicitud",
    "concept_b": "Notificación vs vencimiento",
    "discriminating_cue": "Hecho causante inicia prescripción; Solicitud fija retroactividad de 3 meses; Notificación inicia caducidad a tanto alzado; Vencimiento caducidad periódicas.",
    "common_trap": "Mezclar el inicio del plazo de prescripción con la fecha de solicitud.",
    "legal_basis_a": "Art. 53 TRLGSS",
    "legal_basis_b": "Art. 54 TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_contributiva_no_contributiva",
    "concept_a": "Prestación contributiva",
    "concept_b": "Prestación no contributiva",
    "discriminating_cue": "Contributiva exige carencia y relación previa con la SS; no contributiva exige necesidad y residencia legal en España.",
    "common_trap": "Exigir cotización previa a la pensión no contributiva de invalidez.",
    "legal_basis_a": "Art. 15 TRLGSS",
    "legal_basis_b": "Art. 363 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_economica_en_especie",
    "concept_a": "Prestaciones económicas",
    "concept_b": "Prestaciones en especie",
    "discriminating_cue": "Económicas son subsidios, pensiones o indemnizaciones; en especie son asistencia sanitaria y farmacéutica.",
    "common_trap": "Tratar la asistencia sanitaria como sujeta a prescripción de 5 años.",
    "legal_basis_a": "Art. 42 TRLGSS",
    "legal_basis_b": "Art. 43 TRLGSS",
    "severity": "medium",
    "status": "validated"
  },
  {
    "id": "pair_contingencia_comun_profesional",
    "concept_a": "Contingencia común",
    "concept_b": "Contingencia profesional",
    "discriminating_cue": "Profesional no exige carencia previa y tiene presunción legal en centro de trabajo; común exige cotización previa en muchos casos.",
    "common_trap": "Exigir período de cotización para una IT de accidente de trabajo.",
    "legal_basis_a": "Art. 156 TRLGSS",
    "legal_basis_b": "Art. 157 TRLGSS",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_it_ip",
    "concept_a": "Incapacidad Temporal (IT)",
    "concept_b": "Incapacidad Permanente (IP)",
    "discriminating_cue": "IT es situación temporal máx 365 días (+180 prórroga); IP evalúa reducciones anatómicas/funcionales definitivas.",
    "common_trap": "Otorgar carácter definitivo a secuelas valoradas antes de agotar la duración máxima de IT.",
    "legal_basis_a": "Art. 169 TRLGSS",
    "legal_basis_b": "Art. 193 TRLGSS",
    "severity": "high",
    "status": "validated"
  },
  {
    "id": "pair_complemento_minimos_pension_maxima",
    "concept_a": "Complemento por mínimos",
    "concept_b": "Límite de pensión máxima 2026",
    "discriminating_cue": "Complemento nivela pensiones bajas si no superan ingresos límite (9.442 €/año); pensión máxima es el tope legal de 3.359,60 €/mes.",
    "common_trap": "Aplicar complemento por mínimos a quien supere los límites de rentas individuales.",
    "legal_basis_a": "Art. 59 TRLGSS",
    "legal_basis_b": "Art. 58 TRLGSS",
    "severity": "medium",
    "status": "validated"
  },
  {
    "id": "pair_inembargabilidad_smi_escala_lec",
    "concept_a": "Inembargabilidad absoluta hasta SMI",
    "concept_b": "Escala porcentual del exceso",
    "discriminating_cue": "Hasta el 100% del SMI es inembargable (salvo alimentos); la escala de 30% a 90% se aplica únicamente sobre el exceso por encima del SMI.",
    "common_trap": "Calcular el 30% sobre el importe total de la pensión en lugar del exceso.",
    "legal_basis_a": "Art. 44 TRLGSS",
    "legal_basis_b": "Art. 607 LEC",
    "severity": "critical",
    "status": "validated"
  },
  {
    "id": "pair_aplazamiento_corriente_incumplimiento",
    "concept_a": "Aplazamiento concedido",
    "concept_b": "Incumplimiento del aplazamiento",
    "discriminating_cue": "La concesión formal de aplazamiento otorga estar al corriente; el impago de un solo plazo determina su decaimiento ipso iure.",
    "common_trap": "Considerar al empresario en descubierto culpable mientras mantenga al día su moratoria.",
    "legal_basis_a": "Art. 23 TRLGSS",
    "legal_basis_b": "Art. 47 TRLGSS",
    "severity": "medium",
    "status": "validated"
  },
  {
    "id": "pair_cotizacion_fuera_plazo_descubiertos",
    "concept_a": "Ingreso fuera de plazo voluntario previo",
    "concept_b": "Descubierto regularizado tras el hecho causante",
    "discriminating_cue": "Cuotas pagadas con recargo ANTES del hecho causante producen plenos efectos; las pagadas DESPUÉS no convalidan la carencia para prestaciones.",
    "common_trap": "Creer que pagar cuotas con posterioridad a un infarto convalidará la carencia de IT.",
    "legal_basis_a": "Art. 165 TRLGSS",
    "legal_basis_b": "Art. 166 TRLGSS",
    "severity": "high",
    "status": "validated"
  }
];

export const seedConfusionPairs: ConfusionPair[] = [
  ...seedConfusionPairsTema7,
  ...seedConfusionPairsTema1,
  ...seedConfusionPairsTema3,
  ...seedConfusionPairsTema8,
];

const seedAtomsTema7: Atom[] = [
  {
    "id": "atom-1",
    "type": "deadline",
    "text": "El derecho al reconocimiento de las prestaciones de la Seguridad Social prescribe a los cinco años contados desde el día siguiente al hecho causante.",
    "legal": "Art. 53.1 TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_prescripcion_caducidad",
    "tags": [
      "prescripcion",
      "5_años",
      "hecho_causante"
    ],
    "diff": 1
  },
  {
    "id": "atom-2",
    "type": "deadline",
    "text": "Los efectos económicos retroactivos del reconocimiento inicial se retrotraen como máximo a los tres meses anteriores a la fecha de la solicitud.",
    "legal": "Art. 53.1 in fine TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_prescripcion_retroactividad",
    "tags": [
      "retroactividad",
      "3_meses",
      "solicitud"
    ],
    "diff": 2
  },
  {
    "id": "atom-3",
    "type": "exception",
    "text": "El derecho al reconocimiento de la pensión de jubilación y de incapacidad permanente es imprescriptible.",
    "legal": "Art. 53.3 TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_prescripcion_caducidad",
    "tags": [
      "imprescriptible",
      "jubilacion",
      "incapacidad_permanente"
    ],
    "diff": 2
  },
  {
    "id": "atom-4",
    "type": "deadline",
    "text": "El derecho al percibo de prestaciones a tanto alzado y por una sola vez caduca al año desde el día siguiente a la notificación de la concesión.",
    "legal": "Art. 54.1 TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_caducidad_alzado_periodicas",
    "tags": [
      "caducidad",
      "tanto_alzado",
      "1_año",
      "notificacion"
    ],
    "diff": 2
  },
  {
    "id": "atom-5",
    "type": "deadline",
    "text": "En prestaciones periódicas, el derecho al cobro de cada mensualidad caduca al año contado desde su respectivo vencimiento.",
    "legal": "Art. 54.2 TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_caducidad_alzado_periodicas",
    "tags": [
      "caducidad",
      "periodicas",
      "1_año",
      "vencimiento"
    ],
    "diff": 2
  },
  {
    "id": "atom-6",
    "type": "condition",
    "text": "La automaticidad absoluta ampara contingencias profesionales (AT y EP), desempleo y riesgo durante el embarazo sin exigir alta previa.",
    "legal": "Decreto 21 abril 1966",
    "cluster": "cluster_automaticidad",
    "pair": "pair_automaticidad_absoluta_relativa",
    "tags": [
      "automaticidad_absoluta",
      "at_ep",
      "sin_alta"
    ],
    "diff": 3
  },
  {
    "id": "atom-7",
    "type": "condition",
    "text": "La automaticidad relativa en contingencias comunes exige inexcusablemente que el trabajador se encuentre en alta o situación asimilada.",
    "legal": "Art. 167 TRLGSS",
    "cluster": "cluster_automaticidad",
    "pair": "pair_automaticidad_absoluta_relativa",
    "tags": [
      "automaticidad_relativa",
      "comunes",
      "alta_previa"
    ],
    "diff": 3
  },
  {
    "id": "atom-8",
    "type": "coefficient",
    "text": "A trabajadores fijos-discontinuos se les aplica un coeficiente del 1,5 a los días cotizados con tope de los días naturales del año.",
    "legal": "Art. 247 TRLGSS",
    "cluster": "cluster_coeficientes",
    "pair": "pair_fijo_discontinuo_contrato_corto",
    "tags": [
      "coeficiente_1_5",
      "fijo_discontinuo",
      "tope_anual"
    ],
    "diff": 2
  },
  {
    "id": "atom-9",
    "type": "coefficient",
    "text": "En contratos temporales de duración igual o inferior a 5 días, cada día de trabajo computa como 1,4 días de cotización con tope mensual.",
    "legal": "Art. 249 bis TRLGSS",
    "cluster": "cluster_coeficientes",
    "pair": "pair_fijo_discontinuo_contrato_corto",
    "tags": [
      "coeficiente_1_4",
      "contrato_corto",
      "tope_mensual"
    ],
    "diff": 2
  },
  {
    "id": "atom-10",
    "type": "deadline",
    "text": "Beneficio por parto simple: se reconocen a la madre 112 días de cotización computable para jubilación e incapacidad sin cotización previa.",
    "legal": "Art. 235 TRLGSS",
    "cluster": "cluster_beneficios_parto",
    "pair": "pair_fijo_discontinuo_contrato_corto",
    "tags": [
      "parto_simple",
      "112_dias",
      "beneficio_madres"
    ],
    "diff": 2
  },
  {
    "id": "atom-11",
    "type": "deadline",
    "text": "En parto múltiple se añaden 14 días adicionales de cotización ficticia por cada hijo a partir del segundo.",
    "legal": "Art. 235 TRLGSS",
    "cluster": "cluster_beneficios_parto",
    "pair": "pair_fijo_discontinuo_contrato_corto",
    "tags": [
      "parto_multiple",
      "14_dias_adicionales"
    ],
    "diff": 2
  },
  {
    "id": "atom-12",
    "type": "percentage",
    "text": "Para el ejercicio 2026 las pensiones contributivas experimentan una revalorización general del 2,7% según el IPC medio anual.",
    "legal": "Art. 58 TRLGSS",
    "cluster": "cluster_importes_2026",
    "pair": "pair_complemento_minimos_pension_maxima",
    "tags": [
      "revalorizacion",
      "2_7_por_ciento",
      "2026"
    ],
    "diff": 1
  },
  {
    "id": "atom-13",
    "type": "amount",
    "text": "La cuantía máxima de las pensiones de la Seguridad Social para 2026 se fija en 3.359,60 € mensuales y 47.034,40 € anuales.",
    "legal": "Art. 58 TRLGSS",
    "cluster": "cluster_importes_2026",
    "pair": "pair_complemento_minimos_pension_maxima",
    "tags": [
      "pension_maxima",
      "3359_60_mes",
      "47034_40_año"
    ],
    "diff": 2
  },
  {
    "id": "atom-14",
    "type": "amount",
    "text": "La pensión no contributiva de jubilación e invalidez se fija para 2026 en 8.803,20 € íntegros anuales (628,80 €/mes en 14 pagas).",
    "legal": "Arts. 364 y 370 TRLGSS",
    "cluster": "cluster_importes_2026",
    "pair": "pair_contributiva_no_contributiva",
    "tags": [
      "no_contributiva",
      "8803_20_año"
    ],
    "diff": 2
  },
  {
    "id": "atom-15",
    "type": "amount",
    "text": "El límite de ingresos para complemento por mínimos sin cónyuge a cargo se sitúa en 9.442,00 € anuales en 2026.",
    "legal": "Art. 59 TRLGSS",
    "cluster": "cluster_importes_2026",
    "pair": "pair_complemento_minimos_pension_maxima",
    "tags": [
      "complemento_minimos",
      "9442_00_año",
      "sin_conyuge"
    ],
    "diff": 2
  },
  {
    "id": "atom-16",
    "type": "amount",
    "text": "El límite de ingresos para complemento por mínimos con cónyuge a cargo se sitúa en 11.013,00 € anuales en 2026.",
    "legal": "Art. 59 TRLGSS",
    "cluster": "cluster_importes_2026",
    "pair": "pair_complemento_minimos_pension_maxima",
    "tags": [
      "complemento_minimos",
      "11013_00_año",
      "con_conyuge"
    ],
    "diff": 2
  },
  {
    "id": "atom-17",
    "type": "condition",
    "text": "Las pensiones que no superen el Salario Mínimo Interprofesional son absolutamente inembargables salvo para deudas de alimentos.",
    "legal": "Art. 44 TRLGSS",
    "cluster": "cluster_intangibilidad_embargo",
    "pair": "pair_inembargabilidad_smi_escala_lec",
    "tags": [
      "inembargabilidad",
      "smi",
      "alimentos"
    ],
    "diff": 2
  },
  {
    "id": "atom-18",
    "type": "percentage",
    "text": "Escala art. 607 LEC: exceso sobre SMI se embarga al 30% (hasta 2x SMI), 50% (3x), 60% (4x), 75% (5x) y 90% (exceso superior).",
    "legal": "Art. 607 LEC",
    "cluster": "cluster_intangibilidad_embargo",
    "pair": "pair_inembargabilidad_smi_escala_lec",
    "tags": [
      "escala_embargo",
      "30_50_60_75_90",
      "lec"
    ],
    "diff": 3
  },
  {
    "id": "atom-19",
    "type": "percentage",
    "text": "El recargo de prestaciones por falta de medidas de seguridad oscila entre el 30% y el 50% según la gravedad de la infracción.",
    "legal": "Art. 164 TRLGSS",
    "cluster": "cluster_recargo_medidas",
    "pair": "pair_recargo_aseguramiento_medidas",
    "tags": [
      "recargo_seguridad",
      "30_a_50"
    ],
    "diff": 2
  },
  {
    "id": "atom-20",
    "type": "legal_effect",
    "text": "Es nulo de pleno derecho todo pacto o contrato celebrado con el fin de asegurar o trasladar el recargo de prestaciones de seguridad.",
    "legal": "Art. 164.2 TRLGSS",
    "cluster": "cluster_recargo_medidas",
    "pair": "pair_recargo_aseguramiento_medidas",
    "tags": [
      "nulidad",
      "no_asegurable",
      "recargo"
    ],
    "diff": 2
  },
  {
    "id": "atom-21",
    "type": "deadline",
    "text": "La acción administrativa para el reintegro de prestaciones indebidamente percibidas prescribe a los cuatro años desde su cobro.",
    "legal": "Art. 55.1 TRLGSS",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_prescripcion_caducidad",
    "tags": [
      "reintegro",
      "4_años",
      "cobro_indebido"
    ],
    "diff": 2
  },
  {
    "id": "atom-22",
    "type": "deadline",
    "text": "En caso de responsables del ingreso de cuotas (autónomos/empresarios), la invitación al pago concede 30 días naturales improrrogables.",
    "legal": "Art. 47 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_aplazamiento_corriente_incumplimiento",
    "tags": [
      "invitacion_pago",
      "30_dias_naturales"
    ],
    "diff": 2
  },
  {
    "id": "atom-23",
    "type": "competent_body",
    "text": "El Instituto Nacional de la Seguridad Social (INSS) es competente para reconocer y gestionar las prestaciones económicas contributivas.",
    "legal": "Art. 66 TRLGSS",
    "cluster": "cluster_entidades_gestoras",
    "pair": "pair_inss_tgss_competencia",
    "tags": [
      "inss",
      "gestion_prestaciones"
    ],
    "diff": 1
  },
  {
    "id": "atom-24",
    "type": "competent_body",
    "text": "La Tesorería General de la Seguridad Social (TGSS) ostenta competencia exclusiva sobre recaudación, caja única, afiliación y aplazamientos.",
    "legal": "Art. 74 TRLGSS",
    "cluster": "cluster_entidades_gestoras",
    "pair": "pair_inss_tgss_competencia",
    "tags": [
      "tgss",
      "recaudacion",
      "caja_unica"
    ],
    "diff": 1
  },
  {
    "id": "atom-25",
    "type": "legal_effect",
    "text": "En contratas de propia actividad, el empresario principal responde solidariamente durante 1 año de las obligaciones de SS del contratista.",
    "legal": "Art. 42 ET",
    "cluster": "cluster_responsabilidad",
    "pair": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "tags": [
      "responsabilidad_solidaria",
      "contratas",
      "1_año"
    ],
    "diff": 2
  },
  {
    "id": "atom-26",
    "type": "legal_effect",
    "text": "En cesión ilegal de trabajadores, cedente y cesionario responden solidariamente de todas las obligaciones y prestaciones devengadas.",
    "legal": "Art. 43 ET",
    "cluster": "cluster_responsabilidad",
    "pair": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "tags": [
      "cesion_ilegal",
      "solidaridad"
    ],
    "diff": 2
  },
  {
    "id": "atom-27",
    "type": "deadline",
    "text": "El capital coste de pensión fijado por la TGSS a cargo del empresario infractor debe ingresarse en el plazo reglamentario de 30 días.",
    "legal": "Art. 69 RD 1415/2004",
    "cluster": "cluster_capital_coste",
    "pair": "pair_recargo_aseguramiento_medidas",
    "tags": [
      "capital_coste",
      "30_dias"
    ],
    "diff": 2
  },
  {
    "id": "atom-28",
    "type": "amount",
    "text": "El límite máximo fijado legalmente para anticipos de prestaciones a cuenta y fondos de garantía es de 2,5 veces el IPREM mensual.",
    "legal": "Art. 33 ET",
    "cluster": "cluster_capital_coste",
    "pair": "pair_complemento_minimos_pension_maxima",
    "tags": [
      "anticipo",
      "2_5_iprem"
    ],
    "diff": 3
  },
  {
    "id": "atom-29",
    "type": "condition",
    "text": "La situación asimilada al alta comprende el desempleo involuntario total, excedencia forzosa y traslado fuera de España.",
    "legal": "Art. 166 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_falta_alta_falta_cotizacion",
    "tags": [
      "asimilada_alta",
      "desempleo"
    ],
    "diff": 2
  },
  {
    "id": "atom-30",
    "type": "exception",
    "text": "Están exentas del IRPF las prestaciones por incapacidad permanente absoluta y gran invalidez de la Seguridad Social.",
    "legal": "Art. 7 Ley 35/2006",
    "cluster": "cluster_intangibilidad_embargo",
    "pair": "pair_intangibilidad_embargo_irpf",
    "tags": [
      "exencion_irpf",
      "ip_absoluta",
      "gran_invalidez"
    ],
    "diff": 2
  },
  {
    "id": "atom-31",
    "type": "condition",
    "text": "La incapacidad permanente total está sujeta a tributación en el IRPF como rendimiento del trabajo personal.",
    "legal": "Art. 17 Ley 35/2006",
    "cluster": "cluster_intangibilidad_embargo",
    "pair": "pair_intangibilidad_embargo_irpf",
    "tags": [
      "tributacion_irpf",
      "ip_total"
    ],
    "diff": 2
  },
  {
    "id": "atom-32",
    "type": "condition",
    "text": "Las prestaciones causadas por accidente de trabajo o enfermedad profesional no exigen período previo de cotización (carencia 0).",
    "legal": "Art. 172 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_contingencia_comun_profesional",
    "tags": [
      "carencia_cero",
      "accidente_trabajo"
    ],
    "diff": 1
  },
  {
    "id": "atom-33",
    "type": "deadline",
    "text": "Para causar subsidio de IT por enfermedad común se exige haber cotizado 180 días dentro de los 5 años inmediatamente anteriores.",
    "legal": "Art. 172.1 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_contingencia_comun_profesional",
    "tags": [
      "carencia_it",
      "180_dias",
      "5_años"
    ],
    "diff": 2
  },
  {
    "id": "atom-34",
    "type": "deadline",
    "text": "El subsidio por nacimiento y cuidado de menor no exige período previo de cotización a menores de 21 años al hecho causante.",
    "legal": "Art. 178 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_carencia_cotizacion",
    "tags": [
      "nacimiento",
      "menor_21_años",
      "sin_carencia"
    ],
    "diff": 2
  },
  {
    "id": "atom-35",
    "type": "deadline",
    "text": "Trabajadores entre 21 y 26 años requieren 90 días en los 7 años anteriores o 180 días en toda su vida laboral para nacimiento.",
    "legal": "Art. 178.2 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_carencia_cotizacion",
    "tags": [
      "nacimiento",
      "21_a_26_años",
      "90_dias"
    ],
    "diff": 2
  },
  {
    "id": "atom-36",
    "type": "deadline",
    "text": "Trabajadores mayores de 26 años requieren 180 días en los 7 años anteriores o 360 días a lo largo de su vida laboral.",
    "legal": "Art. 178.3 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_carencia_cotizacion",
    "tags": [
      "nacimiento",
      "mayor_26_años",
      "180_dias"
    ],
    "diff": 2
  },
  {
    "id": "atom-37",
    "type": "condition",
    "text": "Presunción de laboralidad: se presumen constitutivas de accidente de trabajo las lesiones sufridas durante el tiempo y lugar de trabajo.",
    "legal": "Art. 156.3 TRLGSS",
    "cluster": "cluster_accidente_enfermedad",
    "pair": "pair_contingencia_comun_profesional",
    "tags": [
      "presuncion_laboralidad",
      "tiempo_lugar_trabajo"
    ],
    "diff": 1
  },
  {
    "id": "atom-38",
    "type": "condition",
    "text": "Accidente in itinere: tiene consideración de accidente de trabajo el que sufra el trabajador al ir o volver del lugar de trabajo.",
    "legal": "Art. 156.2.a TRLGSS",
    "cluster": "cluster_accidente_enfermedad",
    "pair": "pair_contingencia_comun_profesional",
    "tags": [
      "accidente_in_itinere",
      "ida_vuelta"
    ],
    "diff": 1
  },
  {
    "id": "atom-39",
    "type": "legal_effect",
    "text": "Las pensiones de un mismo régimen son incompatibles entre sí cuando coinciden en un mismo beneficiario salvo disposición legal.",
    "legal": "Art. 163 TRLGSS",
    "cluster": "cluster_incompatibilidades",
    "pair": "pair_it_ip",
    "tags": [
      "incompatibilidad_pensiones",
      "opcion"
    ],
    "diff": 2
  },
  {
    "id": "atom-40",
    "type": "exception",
    "text": "La pensión de viudedad es plenamente compatible con cualquier renta del trabajo del cónyuge supérstite y con jubilación o IP.",
    "legal": "Art. 223 TRLGSS",
    "cluster": "cluster_incompatibilidades",
    "pair": "pair_it_ip",
    "tags": [
      "compatibilidad_viudedad",
      "rentas_trabajo"
    ],
    "diff": 2
  },
  {
    "id": "atom-41",
    "type": "deadline",
    "text": "La incapacidad temporal tiene una duración máxima ordinaria de 365 días, prorrogable expresamente por 180 días adicionales.",
    "legal": "Art. 169.1 TRLGSS",
    "cluster": "cluster_contingencias",
    "pair": "pair_it_ip",
    "tags": [
      "duracion_it",
      "365_dias",
      "prorroga_180"
    ],
    "diff": 1
  },
  {
    "id": "atom-42",
    "type": "competent_body",
    "text": "Agotados los 545 días de IT, el INSS es el único órgano competente para emitir alta médica o iniciar expediente de IP.",
    "legal": "Art. 170.2 TRLGSS",
    "cluster": "cluster_entidades_gestoras",
    "pair": "pair_inss_tgss_competencia",
    "tags": [
      "inss",
      "545_dias_it",
      "competencia_exclusiva"
    ],
    "diff": 2
  },
  {
    "id": "atom-43",
    "type": "deadline",
    "text": "Demora de calificación de IP: de forma extraordinaria la IT puede prorrogarse hasta un máximo absoluto de 730 días naturales.",
    "legal": "Art. 174.2 TRLGSS",
    "cluster": "cluster_contingencias",
    "pair": "pair_it_ip",
    "tags": [
      "demora_calificacion",
      "730_dias"
    ],
    "diff": 2
  },
  {
    "id": "atom-44",
    "type": "condition",
    "text": "Para acceder a pensión no contributiva de jubilación se requiere haber residido 10 años en España (2 consecutivos e inmediatos).",
    "legal": "Art. 369 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_contributiva_no_contributiva",
    "tags": [
      "pnc_jubilacion",
      "residencia_10_años"
    ],
    "diff": 2
  },
  {
    "id": "atom-45",
    "type": "condition",
    "text": "Para pensión no contributiva de invalidez se exige residencia de 5 años y grado de discapacidad o afección de al menos 65%.",
    "legal": "Art. 363 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_contributiva_no_contributiva",
    "tags": [
      "pnc_invalidez",
      "discapacidad_65"
    ],
    "diff": 2
  },
  {
    "id": "atom-46",
    "type": "condition",
    "text": "La moratoria concedida por la TGSS confiere la condición de estar al corriente de pago de cuotas mientras se cumplan los pagos.",
    "legal": "Art. 23 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_aplazamiento_corriente_incumplimiento",
    "tags": [
      "moratoria_tgss",
      "estar_al_corriente"
    ],
    "diff": 2
  },
  {
    "id": "atom-47",
    "type": "legal_effect",
    "text": "El impago de cualquier plazo del aplazamiento acordado determina la caducidad del beneficio y la exigibilidad inmediata de la deuda.",
    "legal": "Art. 23.4 TRLGSS",
    "cluster": "cluster_requisitos_generales",
    "pair": "pair_aplazamiento_corriente_incumplimiento",
    "tags": [
      "incumplimiento_aplazamiento",
      "exigibilidad_inmediata"
    ],
    "diff": 2
  },
  {
    "id": "atom-48",
    "type": "condition",
    "text": "El ingreso de cuotas fuera de plazo pero antes de sobrevenir el hecho causante convalida la carencia con recargo de mora.",
    "legal": "Art. 165.2 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_cotizacion_fuera_plazo_descubiertos",
    "tags": [
      "pago_fuera_plazo_previo",
      "convalida_carencia"
    ],
    "diff": 3
  },
  {
    "id": "atom-49",
    "type": "legal_effect",
    "text": "El pago extemporáneo de cotizaciones efectuado tras la fecha del hecho causante carece de efectos retroactivos para causar pensión.",
    "legal": "Art. 165.3 TRLGSS",
    "cluster": "cluster_carencia_cotizacion",
    "pair": "pair_cotizacion_fuera_plazo_descubiertos",
    "tags": [
      "pago_posterior_hecho_causante",
      "sin_efecto_retroactivo"
    ],
    "diff": 3
  },
  {
    "id": "atom-50",
    "type": "condition",
    "text": "El primer año de excedencia por cuidado de hijo tiene consideración de cotización efectiva para todas las prestaciones del sistema.",
    "legal": "Art. 237 TRLGSS",
    "cluster": "cluster_beneficios_parto",
    "pair": "pair_beneficios_parto",
    "tags": [
      "excedencia_hijos",
      "1_año_efectiva"
    ],
    "diff": 2
  },
  {
    "id": "atom-51",
    "type": "deadline",
    "text": "El periodo de excedencia por cuidado de hijo computable para jubilación, IP, viudedad e IT se extiende hasta 3 años.",
    "legal": "Art. 237.1 TRLGSS",
    "cluster": "cluster_beneficios_parto",
    "pair": "pair_beneficios_parto",
    "tags": [
      "excedencia_hijos",
      "hasta_3_años"
    ],
    "diff": 2
  },
  {
    "id": "atom-52",
    "type": "deadline",
    "text": "El plazo máximo para resolver y notificar prestaciones económicas de la Seguridad Social es de 135 días (silencio negativo).",
    "legal": "Art. 129 RDL 8/2015",
    "cluster": "cluster_prescripcion_caducidad",
    "pair": "pair_hecho_causante_solicitud_notificacion",
    "tags": [
      "plazo_resolucion",
      "135_dias",
      "silencio_negativo"
    ],
    "diff": 2
  }
];

export const seedAtoms: Atom[] = [...seedAtomsTema7, ...seedAtomsTema1, ...seedAtomsTema3];

const seedItemsTema7: Item[] = [
  {
    "id": "item-mcq-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cover_and_generate_mcq",
    "stem": "El derecho al reconocimiento de una pensión de orfandad prescribirá:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el plazo general de prescripción para el reconocimiento y su dies a quo.",
    "options": [
      {
        "id": "A",
        "text": "A los cinco años, a contar desde el día siguiente a aquel en que tenga lugar el hecho causante.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El derecho al reconocimiento de las prestaciones prescribirá a los cinco años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "A los cinco años, desde el día en que se presente la solicitud de la prestación.",
        "is_correct": false,
        "trap_type": "temporal_confusion",
        "explanation": "Incorrecto. Si fuera el plazo para reclamar retroactividad de efectos o revisión.",
        "condition_if_correct": "Si fuera el plazo para reclamar retroactividad de efectos o revisión."
      },
      {
        "id": "C",
        "text": "Al año natural, contado desde el día siguiente a la notificación de la resolución denegatoria.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara del plazo de caducidad para el percibo de una prestación a tanto alzado.",
        "condition_if_correct": "Si se tratara del plazo de caducidad para el percibo de una prestación a tanto alzado."
      },
      {
        "id": "D",
        "text": "A los cuatro años, contados desde la fecha en que finalizó la relación laboral causante.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del plazo de prescripción de la obligación de reintegro de prestaciones indebidas.",
        "condition_if_correct": "Si se tratara del plazo de prescripción de la obligación de reintegro de prestaciones indebidas."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 53.1 TRLGSS",
    "rule_statement": "El derecho al reconocimiento de las prestaciones prescribirá a los cinco años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante.",
    "why_correct": "El derecho al reconocimiento de las prestaciones prescribirá a los cinco años, contados desde el día siguiente a aquel en que tenga lugar el hecho causante.",
    "distractor_analysis": {
      "B": "Si fuera el plazo para reclamar retroactividad de efectos o revisión.",
      "C": "Si se tratara del plazo de caducidad para el percibo de una prestación a tanto alzado.",
      "D": "Si se tratara del plazo de prescripción de la obligación de reintegro de prestaciones indebidas."
    },
    "trap_types": [
      "temporal_confusion",
      "conceptual_merger",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla mnemotécnica: El RECONOCIMIENTO prescribe a los 5 AÑOS desde el HECHO CAUSANTE (Art. 53.1). El cobro de lo reconocido caduca al 1 AÑO (Art. 54).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_retroactividad",
    "item_type": "cover_and_generate_mcq",
    "stem": "Una trabajadora solicita el reconocimiento de una prestación reconocida por hecho causante de hace 2 años. ¿A qué fecha se retrotraen los efectos económicos iniciales?",
    "prompt_before_options": "Antes de ver las opciones, recuerda el límite máximo temporal de retroactividad económica del art. 53.1 TRLGSS.",
    "options": [
      {
        "id": "A",
        "text": "A los tres meses anteriores a la fecha en que se presente la correspondiente solicitud.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Los efectos de las prestaciones se producirán a partir de los tres meses anteriores a la fecha en que se presente la solicitud.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Al día siguiente en que tuvo lugar el hecho causante de la prestación solicitada.",
        "is_correct": false,
        "trap_type": "temporal_confusion",
        "explanation": "Incorrecto. Si la solicitud se hubiera cursado inmediatamente dentro de los 3 meses posteriores al hecho causante.",
        "condition_if_correct": "Si la solicitud se hubiera cursado inmediatamente dentro de los 3 meses posteriores al hecho causante."
      },
      {
        "id": "C",
        "text": "A los seis meses anteriores a la solicitud administrativa, por causa no imputable.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si existiera suspensión judicial de plazos administrativos con carácter extraordinario.",
        "condition_if_correct": "Si existiera suspensión judicial de plazos administrativos con carácter extraordinario."
      },
      {
        "id": "D",
        "text": "A los treinta días naturales anteriores a la fecha del registro telemático de entrada.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del plazo de invitación al pago de cuotas en descubierto.",
        "condition_if_correct": "Si se tratara del plazo de invitación al pago de cuotas en descubierto."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 53.1 in fine TRLGSS",
    "rule_statement": "Los efectos de las prestaciones se producirán a partir de los tres meses anteriores a la fecha en que se presente la solicitud.",
    "why_correct": "Los efectos de las prestaciones se producirán a partir de los tres meses anteriores a la fecha en que se presente la solicitud.",
    "distractor_analysis": {
      "B": "Si la solicitud se hubiera cursado inmediatamente dentro de los 3 meses posteriores al hecho causante.",
      "C": "Si existiera suspensión judicial de plazos administrativos con carácter extraordinario.",
      "D": "Si se tratara del plazo de invitación al pago de cuotas en descubierto."
    },
    "trap_types": [
      "temporal_confusion",
      "numeric_substitution",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla mnemotécnica: La prescripción da 5 años para pedir, pero el dinero solo viaja 3 MESES atrás desde la SOLICITUD (Art. 53.1).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_caducidad_alzado_periodicas",
    "item_type": "cover_and_generate_mcq",
    "stem": "El derecho al percibo de una prestación económica a tanto alzado y por una sola vez caducará:",
    "prompt_before_options": "Antes de ver las opciones, identifica el plazo de caducidad y el dies a quo para pagos únicos.",
    "options": [
      {
        "id": "A",
        "text": "Un año desde el día siguiente a la notificación de la concesión.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El derecho al percibo caduca al año desde la notificación de la resolución de concesión si es tanto alzado.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "A los cinco años, computados desde la fecha del hecho causante.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara de prescribir el reconocimiento inicial del derecho.",
        "condition_if_correct": "Si se tratara de prescribir el reconocimiento inicial del derecho."
      },
      {
        "id": "C",
        "text": "A los seis meses, computados desde que adquiera firmeza en vía judicial.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el plazo de caducidad del recurso de alzada en procedimiento general.",
        "condition_if_correct": "Si fuera el plazo de caducidad del recurso de alzada en procedimiento general."
      },
      {
        "id": "D",
        "text": "Al año, computado desde el hecho causante del derecho.",
        "is_correct": false,
        "trap_type": "wrong_start_date",
        "explanation": "Incorrecto. Si el hecho causante coincidiese temporalmente con la notificación formal.",
        "condition_if_correct": "Si el hecho causante coincidiese temporalmente con la notificación formal."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 54.1 TRLGSS",
    "rule_statement": "El derecho al percibo caduca al año desde la notificación de la resolución de concesión si es tanto alzado.",
    "why_correct": "El derecho al percibo caduca al año desde la notificación de la resolución de concesión si es tanto alzado.",
    "distractor_analysis": {
      "B": "Si se tratara de prescribir el reconocimiento inicial del derecho.",
      "C": "Si fuera el plazo de caducidad del recurso de alzada en procedimiento general.",
      "D": "Si el hecho causante coincidiese temporalmente con la notificación formal."
    },
    "trap_types": [
      "conceptual_merger",
      "numeric_substitution",
      "wrong_start_date"
    ],
    "corrective_rule": "Regla mnemotécnica: Tanto alzado = 1 AÑO desde la NOTIFICACIÓN del reconocimiento (Art. 54.1).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_caducidad_alzado_periodicas",
    "item_type": "cover_and_generate_mcq",
    "stem": "En una prestación económica de devengo periódico mensual, ¿cuándo caduca el derecho a cobrar cada una de las mensualidades devengadas?",
    "prompt_before_options": "Antes de ver las opciones, recuerda el plazo y el cómputo para cada mensualidad periódica.",
    "options": [
      {
        "id": "A",
        "text": "Al año natural, a contar desde el respectivo vencimiento de cada mensualidad.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "En las prestaciones periódicas, el derecho al percibo de cada mensualidad caduca al año de su respectivo vencimiento.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "A los cinco años contados desde el reconocimiento del derecho.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se confundiese con la prescripción del derecho sustantivo a la pensión.",
        "condition_if_correct": "Si se confundiese con la prescripción del derecho sustantivo a la pensión."
      },
      {
        "id": "C",
        "text": "A los tres meses desde la emisión de la nómina por la TGSS.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se confundiese con el tope de retroactividad económica.",
        "condition_if_correct": "Si se confundiese con el tope de retroactividad económica."
      },
      {
        "id": "D",
        "text": "A los cuatro años computados desde la liquidación del ejercicio.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el plazo de prescripción de cuotas de la Seguridad Social.",
        "condition_if_correct": "Si fuera el plazo de prescripción de cuotas de la Seguridad Social."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 54.2 TRLGSS",
    "rule_statement": "En las prestaciones periódicas, el derecho al percibo de cada mensualidad caduca al año de su respectivo vencimiento.",
    "why_correct": "En las prestaciones periódicas, el derecho al percibo de cada mensualidad caduca al año de su respectivo vencimiento.",
    "distractor_analysis": {
      "B": "Si se confundiese con la prescripción del derecho sustantivo a la pensión.",
      "C": "Si se confundiese con el tope de retroactividad económica.",
      "D": "Si fuera el plazo de prescripción de cuotas de la Seguridad Social."
    },
    "trap_types": [
      "conceptual_merger",
      "numeric_substitution",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Mensualidades periódicas caducan al 1 AÑO de su VENCIMIENTO (Art. 54.2).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cover_and_generate_mcq",
    "stem": "¿Cuál de las siguientes prestaciones se encuentra legalmente exenta de prescripción extintiva en el sistema de la Seguridad Social?",
    "prompt_before_options": "Antes de ver las opciones, recuerda qué prestaciones tienen un derecho al reconocimiento declaradamente imprescriptible en el TRLGSS.",
    "options": [
      {
        "id": "A",
        "text": "La jubilación contributiva y las prestaciones por muerte y supervivencia.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La pensión de jubilación contributiva (art. 212 TRLGSS) y las prestaciones por muerte y supervivencia (art. 230 TRLGSS) son imprescriptibles en su reconocimiento.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "El subsidio por incapacidad temporal derivado de enfermedad común.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto: el subsidio por incapacidad temporal prescribe a los cinco años (art. 53.1 TRLGSS).",
        "condition_if_correct": "Si la ley confiriese carácter imprescriptible a subsidios de corta duración."
      },
      {
        "id": "C",
        "text": "La incapacidad permanente en cualquiera de sus grados.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto: la incapacidad permanente no es imprescriptible, prescribe a los cinco años (art. 53.1 TRLGSS).",
        "condition_if_correct": "Si se extendiera la imprescriptibilidad de la jubilación contributiva a la incapacidad permanente."
      },
      {
        "id": "D",
        "text": "La indemnización a tanto alzado por lesiones permanentes no invalidantes.",
        "is_correct": false,
        "trap_type": "exception_ignored",
        "explanation": "Incorrecto: la indemnización a tanto alzado no es una prestación contributiva y se rige por su normativa específica.",
        "condition_if_correct": "Si se asimilara indebidamente una indemnización de pago único a una pensión vitalicia."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Arts. 53.1, 212 y 230 TRLGSS",
    "rule_statement": "La pensión de jubilación contributiva y las prestaciones por muerte y supervivencia son imprescriptibles en su reconocimiento.",
    "why_correct": "La pensión de jubilación contributiva y las prestaciones por muerte y supervivencia son imprescriptibles en su reconocimiento.",
    "distractor_analysis": {
      "B": "Si la ley confiriese carácter imprescriptible a subsidios de corta duración.",
      "C": "Si se extendiera la imprescriptibilidad de la jubilación contributiva a la incapacidad permanente.",
      "D": "Si se asimilara indebidamente una indemnización de pago único a una pensión vitalicia."
    },
    "trap_types": [
      "overbroad_statement",
      "conceptual_merger",
      "exception_ignored"
    ],
    "corrective_rule": "Regla: solo la JUBILACIÓN CONTRIBUTIVA y las PRESTACIONES POR MUERTE Y SUPERVIVENCIA son imprescriptibles (Arts. 212 y 230 TRLGSS); la incapacidad permanente prescribe a los cinco años (art. 53.1 TRLGSS).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "cover_and_generate_mcq",
    "stem": "El principio de automaticidad absoluta en el pago de prestaciones de la Seguridad Social opera de pleno derecho cuando concurre:",
    "prompt_before_options": "Antes de ver las opciones, determina qué contingencias disfrutan de anticipo sin exigir alta previa del trabajador.",
    "options": [
      {
        "id": "A",
        "text": "Accidente de trabajo o enfermedad profesional, aun sin afiliación ni alta empresarial.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La automaticidad absoluta no exige alta previa del trabajador para AT, EP y desempleo.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Cualquier contingencia común, bastando que la empresa tenga más de 50 trabajadores.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto. Si rigiera la automaticidad absoluta universal para cualquier contingencia del sistema.",
        "condition_if_correct": "Si rigiera la automaticidad absoluta universal para cualquier contingencia del sistema."
      },
      {
        "id": "C",
        "text": "Incapacidad temporal por enfermedad común si el trabajador está en alta real.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara de la automaticidad relativa condicionada al alta.",
        "condition_if_correct": "Si se tratara de la automaticidad relativa condicionada al alta."
      },
      {
        "id": "D",
        "text": "Jubilación contributiva con al menos 15 años de cotización acreditada.",
        "is_correct": false,
        "trap_type": "familiar_wording_trap",
        "explanation": "Incorrecto. Si la jubilación no exigiera carencia específica y genérica previa.",
        "condition_if_correct": "Si la jubilación no exigiera carencia específica y genérica previa."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Decreto 21 abril 1966 y Art. 167 TRLGSS",
    "rule_statement": "La automaticidad absoluta no exige alta previa del trabajador para AT, EP y desempleo.",
    "why_correct": "La automaticidad absoluta no exige alta previa del trabajador para AT, EP y desempleo.",
    "distractor_analysis": {
      "B": "Si rigiera la automaticidad absoluta universal para cualquier contingencia del sistema.",
      "C": "Si se tratara de la automaticidad relativa condicionada al alta.",
      "D": "Si la jubilación no exigiera carencia específica y genérica previa."
    },
    "trap_types": [
      "overbroad_statement",
      "conceptual_merger",
      "familiar_wording_trap"
    ],
    "corrective_rule": "Regla: Automaticidad ABSOLUTA = Contingencias PROFESIONALES (AT/EP) y desempleo; opera INCLUSO SIN ALTA.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "cover_and_generate_mcq",
    "stem": "Para que opere el principio de automaticidad relativa en una prestación por contingencia común, es presupuesto indispensable:",
    "prompt_before_options": "Antes de ver las opciones, indica qué condición previa del trabajador exige el art. 167 TRLGSS en contingencias comunes.",
    "options": [
      {
        "id": "A",
        "text": "Estar en alta o situación asimilada al sobrevenir la contingencia.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La automaticidad relativa exige obligatoriamente el alta o situación asimilada en la fecha del hecho causante.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Que el empresario haya ingresado todas las cotizaciones dentro del plazo reglamentario.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si el sistema no protegiera al trabajador frente al descubierto empresarial.",
        "condition_if_correct": "Si el sistema no protegiera al trabajador frente al descubierto empresarial."
      },
      {
        "id": "C",
        "text": "Que el INSS haya emitido informe preceptivo de viabilidad financiera.",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "Incorrecto. Si la automaticidad dependiese de autorización previa de la intervención general.",
        "condition_if_correct": "Si la automaticidad dependiese de autorización previa de la intervención general."
      },
      {
        "id": "D",
        "text": "Que el trabajador cuente con más de 35 años de cotizaciones ininterrumpidas.",
        "is_correct": false,
        "trap_type": "hyper_narrow_statement",
        "explanation": "Incorrecto. Si estuviéramos ante una jubilación anticipada bonificada por trabajos penosos.",
        "condition_if_correct": "Si estuviéramos ante una jubilación anticipada bonificada por trabajos penosos."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 167.2 TRLGSS",
    "rule_statement": "La automaticidad relativa exige obligatoriamente el alta o situación asimilada en la fecha del hecho causante.",
    "why_correct": "La automaticidad relativa exige obligatoriamente el alta o situación asimilada en la fecha del hecho causante.",
    "distractor_analysis": {
      "B": "Si el sistema no protegiera al trabajador frente al descubierto empresarial.",
      "C": "Si la automaticidad dependiese de autorización previa de la intervención general.",
      "D": "Si estuviéramos ante una jubilación anticipada bonificada por trabajos penosos."
    },
    "trap_types": [
      "conceptual_merger",
      "wrong_competent_body",
      "hyper_narrow_statement"
    ],
    "corrective_rule": "Regla: Automaticidad RELATIVA = Contingencias COMUNES; EXIGE ALTA o asimilada al sobrevenir la contingencia.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cover_and_generate_mcq",
    "stem": "A efectos de acreditar los períodos de cotización para pensiones de jubilación e incapacidad, a los trabajadores con contratos fijos-discontinuos:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el coeficiente multiplicador y el tope aplicable a fijos-discontinuos (Art. 247).",
    "options": [
      {
        "id": "A",
        "text": "Coeficiente 1,5, con tope en los días naturales del año.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "A los días efectivamente cotizados se aplica el coeficiente del 1,5, sin superar los días naturales de cada año.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Se aplica un coeficiente del 1,4 a los días trabajados, con el límite mensual de días de cada mes.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara de contratos temporales de duración igual o inferior a 5 días (art. 249 bis).",
        "condition_if_correct": "Si se tratara de contratos temporales de duración igual o inferior a 5 días (art. 249 bis)."
      },
      {
        "id": "C",
        "text": "Se les computa cada jornada como 1,25 días sin límite temporal alguno.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el coeficiente de bonificación para jubilación parcial de la industria manufacturera.",
        "condition_if_correct": "Si fuera el coeficiente de bonificación para jubilación parcial de la industria manufacturera."
      },
      {
        "id": "D",
        "text": "Se les computa exclusivamente el número estricto de horas o días de trabajo efectivo.",
        "is_correct": false,
        "trap_type": "partial_rule_accuracy",
        "explanation": "Incorrecto. Si no existiera la regla protectora de fijos-discontinuos del art. 247.",
        "condition_if_correct": "Si no existiera la regla protectora de fijos-discontinuos del art. 247."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 247 TRLGSS",
    "rule_statement": "A los días efectivamente cotizados se aplica el coeficiente del 1,5, sin superar los días naturales de cada año.",
    "why_correct": "A los días efectivamente cotizados se aplica el coeficiente del 1,5, sin superar los días naturales de cada año.",
    "distractor_analysis": {
      "B": "Si se tratara de contratos temporales de duración igual o inferior a 5 días (art. 249 bis).",
      "C": "Si fuera el coeficiente de bonificación para jubilación parcial de la industria manufacturera.",
      "D": "Si no existiera la regla protectora de fijos-discontinuos del art. 247."
    },
    "trap_types": [
      "conceptual_merger",
      "numeric_substitution",
      "partial_rule_accuracy"
    ],
    "corrective_rule": "Regla: Fijos-discontinuos = coeficiente 1,5 y tope ANUAL de días naturales.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-9",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cover_and_generate_mcq",
    "stem": "En los contratos de carácter temporal cuya duración efectiva sea igual o inferior a cinco días naturales:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el coeficiente y el tope aplicable a contratos cortos (Art. 249 bis).",
    "options": [
      {
        "id": "A",
        "text": "Cada jornada cotizada se computa como 1,4, con límite mensual igual a los días del mes.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "A los contratos temporales <= 5 días se aplica coeficiente 1,4 con límite mensual de días naturales.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Cada día computa como 1,5 días de cotización con tope de los días naturales del año.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara del régimen de fijos-discontinuos del art. 247.",
        "condition_if_correct": "Si se tratara del régimen de fijos-discontinuos del art. 247."
      },
      {
        "id": "C",
        "text": "Se incrementa la base de cotización en un 40% a cargo exclusivo del trabajador.",
        "is_correct": false,
        "trap_type": "factual_misapplication",
        "explanation": "Incorrecto. Si se confundiese con la cotización adicional de contratos temporales a cargo de la empresa.",
        "condition_if_correct": "Si se confundiese con la cotización adicional de contratos temporales a cargo de la empresa."
      },
      {
        "id": "D",
        "text": "No computan como días cotizados hasta alcanzar un periodo ininterrumpido de 30 días.",
        "is_correct": false,
        "trap_type": "exception_ignored",
        "explanation": "Incorrecto. Si existiera una exclusión general de carencia para contratos de muy corta duración.",
        "condition_if_correct": "Si existiera una exclusión general de carencia para contratos de muy corta duración."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 249 bis TRLGSS",
    "rule_statement": "A los contratos temporales <= 5 días se aplica coeficiente 1,4 con límite mensual de días naturales.",
    "why_correct": "A los contratos temporales <= 5 días se aplica coeficiente 1,4 con límite mensual de días naturales.",
    "distractor_analysis": {
      "B": "Si se tratara del régimen de fijos-discontinuos del art. 247.",
      "C": "Si se confundiese con la cotización adicional de contratos temporales a cargo de la empresa.",
      "D": "Si existiera una exclusión general de carencia para contratos de muy corta duración."
    },
    "trap_types": [
      "conceptual_merger",
      "factual_misapplication",
      "exception_ignored"
    ],
    "corrective_rule": "Regla: Contrato temporal <= 5 días = coeficiente 1,4 y tope MENSUAL.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-10",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cover_and_generate_mcq",
    "stem": "En beneficio de las mujeres trabajadoras, por cada parto simple se computa a efectos de jubilación e incapacidad:",
    "prompt_before_options": "Antes de ver las opciones, recuerda los días de cotización ficticia por parto simple (Art. 235).",
    "options": [
      {
        "id": "A",
        "text": "112 días de cotización ficticia, aunque no hubiera cotizado antes.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El parto simple otorga 112 días de cotización ficticia efectiva para jubilación e incapacidad.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Un total de 180 días naturales de cotización efectiva bonificada.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el periodo mínimo exigible para causar IT en contingencias comunes.",
        "condition_if_correct": "Si fuera el periodo mínimo exigible para causar IT en contingencias comunes."
      },
      {
        "id": "C",
        "text": "Un total de 90 días, siempre que la madre acredite 180 días de alta previa.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si la madre tuviera entre 21 y 26 años en el subsidio por nacimiento ordinario.",
        "condition_if_correct": "Si la madre tuviera entre 21 y 26 años en el subsidio por nacimiento ordinario."
      },
      {
        "id": "D",
        "text": "Un coeficiente del 1,4 sobre las cotizaciones del último trimestre de gestación.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se aplicase el coeficiente de contratos de corta duración.",
        "condition_if_correct": "Si se aplicase el coeficiente de contratos de corta duración."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 235 TRLGSS",
    "rule_statement": "El parto simple otorga 112 días de cotización ficticia efectiva para jubilación e incapacidad.",
    "why_correct": "El parto simple otorga 112 días de cotización ficticia efectiva para jubilación e incapacidad.",
    "distractor_analysis": {
      "B": "Si fuera el periodo mínimo exigible para causar IT en contingencias comunes.",
      "C": "Si la madre tuviera entre 21 y 26 años en el subsidio por nacimiento ordinario.",
      "D": "Si se aplicase el coeficiente de contratos de corta duración."
    },
    "trap_types": [
      "numeric_substitution",
      "conceptual_merger",
      "conceptual_merger"
    ],
    "corrective_rule": "Regla: Parto simple = 112 DÍAS de cotización ficticia (Art. 235).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-11",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cover_and_generate_mcq",
    "stem": "En el supuesto de parto múltiple, ¿cuántos días adicionales de cotización se reconocen a la madre por cada hijo a partir del segundo?",
    "prompt_before_options": "Antes de ver las opciones, recuerda el incremento legal por parto múltiple a partir del segundo hijo.",
    "options": [
      {
        "id": "A",
        "text": "Un incremento de 14 días por descendiente adicional.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "En parto múltiple se computan 112 días más 14 días adicionales por cada hijo a partir del segundo.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "30 días naturales por cada nuevo nacido.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del periodo de invitación al pago de descubiertos.",
        "condition_if_correct": "Si se tratara del periodo de invitación al pago de descubiertos."
      },
      {
        "id": "C",
        "text": "112 días por cada uno de los hijos nacidos en el parto múltiple.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto. Si la ley duplicara íntegramente los 112 días por cada hijo habido en el parto.",
        "condition_if_correct": "Si la ley duplicara íntegramente los 112 días por cada hijo habido en el parto."
      },
      {
        "id": "D",
        "text": "7 días de descanso computable por cada hijo.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el plazo de descanso obligatorio en IT.",
        "condition_if_correct": "Si fuera el plazo de descanso obligatorio en IT."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 235 TRLGSS",
    "rule_statement": "En parto múltiple se computan 112 días más 14 días adicionales por cada hijo a partir del segundo.",
    "why_correct": "En parto múltiple se computan 112 días más 14 días adicionales por cada hijo a partir del segundo.",
    "distractor_analysis": {
      "B": "Si se tratara del periodo de invitación al pago de descubiertos.",
      "C": "Si la ley duplicara íntegramente los 112 días por cada hijo habido en el parto.",
      "D": "Si fuera el plazo de descanso obligatorio en IT."
    },
    "trap_types": [
      "numeric_substitution",
      "overbroad_statement",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Parto múltiple = 112 días base + 14 DÍAS ADICIONALES por hijo a partir del 2º.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-12",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cover_and_generate_mcq",
    "stem": "Para el ejercicio económico 2026, el porcentaje general de revalorización de las pensiones contributivas de la Seguridad Social se sitúa en:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el porcentaje de revalorización fijado según el IPC medio.",
    "options": [
      {
        "id": "A",
        "text": "El 2,7 por ciento.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "En 2026 la revalorización de las pensiones contributivas de la Seguridad Social se ha fijado en el 2,7%.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "El 3,8 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del porcentaje aplicado en ejercicios precedentes.",
        "condition_if_correct": "Si se tratara del porcentaje aplicado en ejercicios precedentes."
      },
      {
        "id": "C",
        "text": "El 1,5 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si coincidiera con el coeficiente de fijos-discontinuos.",
        "condition_if_correct": "Si coincidiera con el coeficiente de fijos-discontinuos."
      },
      {
        "id": "D",
        "text": "El 8,5 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del IPC de revalorización histórica del ejercicio 2023.",
        "condition_if_correct": "Si se tratara del IPC de revalorización histórica del ejercicio 2023."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 58 TRLGSS",
    "rule_statement": "En 2026 la revalorización de las pensiones contributivas de la Seguridad Social se ha fijado en el 2,7%.",
    "why_correct": "En 2026 la revalorización de las pensiones contributivas de la Seguridad Social se ha fijado en el 2,7%.",
    "distractor_analysis": {
      "B": "Si se tratara del porcentaje aplicado en ejercicios precedentes.",
      "C": "Si coincidiera con el coeficiente de fijos-discontinuos.",
      "D": "Si se tratara del IPC de revalorización histórica del ejercicio 2023."
    },
    "trap_types": [
      "numeric_substitution",
      "numeric_substitution",
      "numeric_substitution"
    ],
    "corrective_rule": "Dato 2026: Revalorización contributiva = 2,7%.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-13",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cover_and_generate_mcq",
    "stem": "El límite máximo legal de percepción para las pensiones públicas de la Seguridad Social durante el año 2026 asciende a:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el importe máximo mensual y anual de pensión en 2026.",
    "options": [
      {
        "id": "A",
        "text": "3.359,60 €/mes y 47.034,40 €/año (14 pagas).",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El tope máximo de pensión en 2026 es de 3.359,60 € al mes y 47.034,40 € anuales.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "3.175,04 euros mensuales y 44.450,56 euros en cómputo anual.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el tope vigente en ejercicios anteriores.",
        "condition_if_correct": "Si fuera el tope vigente en ejercicios anteriores."
      },
      {
        "id": "C",
        "text": "4.000,00 euros mensuales y 56.000,00 euros anuales.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera una cifra redonda estimada sin rigor normativo.",
        "condition_if_correct": "Si fuera una cifra redonda estimada sin rigor normativo."
      },
      {
        "id": "D",
        "text": "2.850,50 euros mensuales y 39.907,00 euros anuales.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera la cuantía fijada para tres veces el SMI.",
        "condition_if_correct": "Si fuera la cuantía fijada para tres veces el SMI."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "D.T. 39.ª TRLGSS",
    "rule_statement": "El tope máximo de pensión en 2026 es de 3.359,60 € al mes y 47.034,40 € anuales.",
    "why_correct": "El tope máximo de pensión en 2026 es de 3.359,60 € al mes y 47.034,40 € anuales.",
    "distractor_analysis": {
      "B": "Si fuera el tope vigente en ejercicios anteriores.",
      "C": "Si fuera una cifra redonda estimada sin rigor normativo.",
      "D": "Si fuera la cuantía fijada para tres veces el SMI."
    },
    "trap_types": [
      "numeric_substitution",
      "numeric_substitution",
      "numeric_substitution"
    ],
    "corrective_rule": "Dato 2026: Pensión máxima = 3.359,60 €/mes (47.034,40 €/año).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-14",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_contributiva_no_contributiva",
    "item_type": "cover_and_generate_mcq",
    "stem": "La cuantía anual íntegra de las pensiones no contributivas de la Seguridad Social para el año 2026 se fija en:",
    "prompt_before_options": "Antes de ver las opciones, recuerda la cuantía anual de las pensiones no contributivas en 2026.",
    "options": [
      {
        "id": "A",
        "text": "8.803,20 €/año en 14 pagas de 628,80 €.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La pensión no contributiva en 2026 asciende a 8.803,20 € anuales (628,80 €/mes en 14 pagas).",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "7.250,60 euros anuales, en 12 pagas ordinarias.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si fuera el importe aplicable en ejercicios anteriores.",
        "condition_if_correct": "Si fuera el importe aplicable en ejercicios anteriores."
      },
      {
        "id": "C",
        "text": "9.442,00 euros anuales, distribuidos en 14 pagas.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se confundiese con el límite de ingresos para complemento a mínimos sin cónyuge.",
        "condition_if_correct": "Si se confundiese con el límite de ingresos para complemento a mínimos sin cónyuge."
      },
      {
        "id": "D",
        "text": "11.013,00 euros anuales, equivalentes al IPREM anual.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se confundiese con el límite de ingresos para complemento con cónyuge a cargo.",
        "condition_if_correct": "Si se confundiese con el límite de ingresos para complemento con cónyuge a cargo."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Arts. 364 y 370 TRLGSS",
    "rule_statement": "La pensión no contributiva en 2026 asciende a 8.803,20 € anuales (628,80 €/mes en 14 pagas).",
    "why_correct": "La pensión no contributiva en 2026 asciende a 8.803,20 € anuales (628,80 €/mes en 14 pagas).",
    "distractor_analysis": {
      "B": "Si fuera el importe aplicable en ejercicios anteriores.",
      "C": "Si se confundiese con el límite de ingresos para complemento a mínimos sin cónyuge.",
      "D": "Si se confundiese con el límite de ingresos para complemento con cónyuge a cargo."
    },
    "trap_types": [
      "numeric_substitution",
      "conceptual_merger",
      "conceptual_merger"
    ],
    "corrective_rule": "Dato 2026: Pensión no contributiva = 8.803,20 €/año (628,80 €/mes en 14 pagas).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-15",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cover_and_generate_mcq",
    "stem": "Para tener derecho a complementos por mínimos sin cónyuge a cargo en 2026, el beneficiario no puede percibir rendimientos anuales superiores a:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el límite de ingresos anual para complemento por mínimos unipersonal.",
    "options": [
      {
        "id": "A",
        "text": "9.442,00 euros al año.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El límite de ingresos para complementos por mínimos sin cónyuge a cargo en 2026 es 9.442,00 €.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "11.013,00 euros al año.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si tuviera cónyuge a cargo reconocido legalmente.",
        "condition_if_correct": "Si tuviera cónyuge a cargo reconocido legalmente."
      },
      {
        "id": "C",
        "text": "8.803,20 euros al año.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara del importe de la pensión no contributiva de invalidez.",
        "condition_if_correct": "Si se tratara del importe de la pensión no contributiva de invalidez."
      },
      {
        "id": "D",
        "text": "6.500,00 euros al año.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del umbral de pobreza relativa autonómico.",
        "condition_if_correct": "Si se tratara del umbral de pobreza relativa autonómico."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 59 TRLGSS",
    "rule_statement": "El límite de ingresos para complementos por mínimos sin cónyuge a cargo en 2026 es 9.442,00 €.",
    "why_correct": "El límite de ingresos para complementos por mínimos sin cónyuge a cargo en 2026 es 9.442,00 €.",
    "distractor_analysis": {
      "B": "Si tuviera cónyuge a cargo reconocido legalmente.",
      "C": "Si se tratara del importe de la pensión no contributiva de invalidez.",
      "D": "Si se tratara del umbral de pobreza relativa autonómico."
    },
    "trap_types": [
      "conceptual_merger",
      "conceptual_merger",
      "numeric_substitution"
    ],
    "corrective_rule": "Dato 2026: Complemento a mínimos SIN cónyuge = límite de 9.442,00 €/año.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-16",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cover_and_generate_mcq",
    "stem": "¿Cuál es el límite de ingresos exigido para el reconocimiento de complementos por mínimos con cónyuge a cargo en 2026?",
    "prompt_before_options": "Antes de ver las opciones, recuerda el límite conjunto con cónyuge a cargo en 2026.",
    "options": [
      {
        "id": "A",
        "text": "11.013,00 euros al año.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El límite de rendimientos computables con cónyuge a cargo en 2026 es 11.013,00 €.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "9.442,00 euros al año.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara del supuesto sin cónyuge a cargo.",
        "condition_if_correct": "Si se tratara del supuesto sin cónyuge a cargo."
      },
      {
        "id": "C",
        "text": "15.000,00 euros al año.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si existieran tres hijos a cargo en el hogar.",
        "condition_if_correct": "Si existieran tres hijos a cargo en el hogar."
      },
      {
        "id": "D",
        "text": "8.803,20 euros al año.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si fuera el importe íntegro de la pensión no contributiva.",
        "condition_if_correct": "Si fuera el importe íntegro de la pensión no contributiva."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 59 TRLGSS",
    "rule_statement": "El límite de rendimientos computables con cónyuge a cargo en 2026 es 11.013,00 €.",
    "why_correct": "El límite de rendimientos computables con cónyuge a cargo en 2026 es 11.013,00 €.",
    "distractor_analysis": {
      "B": "Si se tratara del supuesto sin cónyuge a cargo.",
      "C": "Si existieran tres hijos a cargo en el hogar.",
      "D": "Si fuera el importe íntegro de la pensión no contributiva."
    },
    "trap_types": [
      "conceptual_merger",
      "numeric_substitution",
      "conceptual_merger"
    ],
    "corrective_rule": "Dato 2026: Complemento a mínimos CON cónyuge a cargo = límite de 11.013,00 €/año.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-17",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "cover_and_generate_mcq",
    "stem": "En relación con el régimen de inembargabilidad de las pensiones de la Seguridad Social, ¿qué importe resulta absolutamente inembargable?",
    "prompt_before_options": "Antes de ver las opciones, recuerda la cuantía protegida de forma absoluta frente a embargos ordinarios.",
    "options": [
      {
        "id": "A",
        "text": "La cuantía que no supere el Salario Mínimo Interprofesional (SMI) vigente.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Es inembargable el sueldo o pensión que no exceda del importe del Salario Mínimo Interprofesional.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "La cuantía equivalente a tres veces el Indicador Público de Renta de Efectos Múltiples (IPREM).",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si la norma protectora utilizase el IPREM en lugar del SMI como baremo procesal.",
        "condition_if_correct": "Si la norma protectora utilizase el IPREM en lugar del SMI como baremo procesal."
      },
      {
        "id": "C",
        "text": "El 50% de cualquier pensión, con independencia de su importe total.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto. Si existiera una regla fija de quita universal sobre nóminas.",
        "condition_if_correct": "Si existiera una regla fija de quita universal sobre nóminas."
      },
      {
        "id": "D",
        "text": "La totalidad de la pensión si es contributiva, al ser un derecho indisponible.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si la inembargabilidad fuese absoluta para cualquier tramo y concepto.",
        "condition_if_correct": "Si la inembargabilidad fuese absoluta para cualquier tramo y concepto."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 44 TRLGSS y Art. 607 LEC",
    "rule_statement": "Es inembargable el sueldo o pensión que no exceda del importe del Salario Mínimo Interprofesional.",
    "why_correct": "Es inembargable el sueldo o pensión que no exceda del importe del Salario Mínimo Interprofesional.",
    "distractor_analysis": {
      "B": "Si la norma protectora utilizase el IPREM en lugar del SMI como baremo procesal.",
      "C": "Si existiera una regla fija de quita universal sobre nóminas.",
      "D": "Si la inembargabilidad fuese absoluta para cualquier tramo y concepto."
    },
    "trap_types": [
      "numeric_substitution",
      "overbroad_statement",
      "conceptual_merger"
    ],
    "corrective_rule": "Regla: Inembargable de modo absoluto hasta el 100% del SMI (salvo deudas de alimentos, art. 608 LEC).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-18",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "cover_and_generate_mcq",
    "stem": "De conformidad con la escala del art. 607 de la LEC, el tramo de pensión que exceda del SMI hasta el doble del SMI es embargable en un:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el primer porcentaje de embargo sobre el exceso del SMI.",
    "options": [
      {
        "id": "A",
        "text": "30 por ciento.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Para la primera cuantía adicional hasta la que suponga el importe del doble del SMI, el 30%.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "50 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del tramo correspondiente al exceso hasta el triple del SMI.",
        "condition_if_correct": "Si se tratara del tramo correspondiente al exceso hasta el triple del SMI."
      },
      {
        "id": "C",
        "text": "60 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del tramo correspondiente al exceso hasta el cuádruple del SMI.",
        "condition_if_correct": "Si se tratara del tramo correspondiente al exceso hasta el cuádruple del SMI."
      },
      {
        "id": "D",
        "text": "75 por ciento.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara del tramo correspondiente al exceso hasta el quíntuple del SMI.",
        "condition_if_correct": "Si se tratara del tramo correspondiente al exceso hasta el quíntuple del SMI."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 607.2.1ª LEC",
    "rule_statement": "Para la primera cuantía adicional hasta la que suponga el importe del doble del SMI, el 30%.",
    "why_correct": "Para la primera cuantía adicional hasta la que suponga el importe del doble del SMI, el 30%.",
    "distractor_analysis": {
      "B": "Si se tratara del tramo correspondiente al exceso hasta el triple del SMI.",
      "C": "Si se tratara del tramo correspondiente al exceso hasta el cuádruple del SMI.",
      "D": "Si se tratara del tramo correspondiente al exceso hasta el quíntuple del SMI."
    },
    "trap_types": [
      "numeric_substitution",
      "numeric_substitution",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Escala de embargo sobre el exceso del SMI: 1º tramo (hasta 2x SMI) = 30%.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-19",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "cover_and_generate_mcq",
    "stem": "El recargo de prestaciones económicas en caso de accidente de trabajo derivado de la infracción de medidas de seguridad oscila entre:",
    "prompt_before_options": "Antes de ver las opciones, recuerda la horquilla porcentual legal del recargo por falta de medidas de seguridad.",
    "options": [
      {
        "id": "A",
        "text": "Un mínimo del 30% y un máximo del 50%, según la gravedad de la falta.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Todas las prestaciones económicas por AT o EP se aumentarán de un 30 a un 50% por falta de medidas.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Un mínimo del 20% y un máximo del 40%, a criterio exclusivo de la Inspección de Trabajo.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara de recargos por mora en la cotización extemporánea.",
        "condition_if_correct": "Si se tratara de recargos por mora en la cotización extemporánea."
      },
      {
        "id": "C",
        "text": "Un porcentaje fijo del 25% con independencia de las circunstancias concurrentes.",
        "is_correct": false,
        "trap_type": "partial_rule_accuracy",
        "explanation": "Incorrecto. Si no se permitiera modulación según la gravedad técnica de la infracción.",
        "condition_if_correct": "Si no se permitiera modulación según la gravedad técnica de la infracción."
      },
      {
        "id": "D",
        "text": "Un mínimo del 50% y un máximo del 100% en supuestos de reincidencia probada.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si se tratara de sanciones pecuniarias de la LISOS en grado máximo.",
        "condition_if_correct": "Si se tratara de sanciones pecuniarias de la LISOS en grado máximo."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 164.1 TRLGSS",
    "rule_statement": "Todas las prestaciones económicas por AT o EP se aumentarán de un 30 a un 50% por falta de medidas.",
    "why_correct": "Todas las prestaciones económicas por AT o EP se aumentarán de un 30 a un 50% por falta de medidas.",
    "distractor_analysis": {
      "B": "Si se tratara de recargos por mora en la cotización extemporánea.",
      "C": "Si no se permitiera modulación según la gravedad técnica de la infracción.",
      "D": "Si se tratara de sanciones pecuniarias de la LISOS en grado máximo."
    },
    "trap_types": [
      "numeric_substitution",
      "partial_rule_accuracy",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Recargo por falta de medidas de seguridad = del 30% al 50% a cargo del empresario infractor.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-20",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "cover_and_generate_mcq",
    "stem": "En cuanto a la asegurabilidad del recargo de prestaciones por falta de medidas de seguridad, el ordenamiento jurídico dispone que:",
    "prompt_before_options": "Antes de ver las opciones, recuerda la validez o nulidad de los seguros sobre el recargo de prestaciones.",
    "options": [
      {
        "id": "A",
        "text": "Es nulo de pleno derecho todo pacto o contrato que tenga por objeto asegurar o repercutir dicho recargo.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La responsabilidad del pago del recargo recae directamente sobre el empresario infractor y no puede ser objeto de seguro.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Es asegurable únicamente si la póliza se contrata con una Mutua Colaboradora de la Seguridad Social.",
        "is_correct": false,
        "trap_type": "factual_misapplication",
        "explanation": "Incorrecto. Si las mutuas estuvieran legalmente facultadas para mutualizar la negligencia delictiva.",
        "condition_if_correct": "Si las mutuas estuvieran legalmente facultadas para mutualizar la negligencia delictiva."
      },
      {
        "id": "C",
        "text": "Es asegurable previa autorización expresa y motivada del INSS y de la TGSS.",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "Incorrecto. Si las entidades gestoras pudieran autorizar excepciones a normas imperativas.",
        "condition_if_correct": "Si las entidades gestoras pudieran autorizar excepciones a normas imperativas."
      },
      {
        "id": "D",
        "text": "El empresario puede repercutirlo directamente sobre el trabajador mediante retenciones en nómina.",
        "is_correct": false,
        "trap_type": "absolute_relative_confusion",
        "explanation": "Incorrecto. Si existiera compensación salarial de daños en la relación laboral ordinaria.",
        "condition_if_correct": "Si existiera compensación salarial de daños en la relación laboral ordinaria."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 164.2 TRLGSS",
    "rule_statement": "La responsabilidad del pago del recargo recae directamente sobre el empresario infractor y no puede ser objeto de seguro.",
    "why_correct": "La responsabilidad del pago del recargo recae directamente sobre el empresario infractor y no puede ser objeto de seguro.",
    "distractor_analysis": {
      "B": "Si las mutuas estuvieran legalmente facultadas para mutualizar la negligencia delictiva.",
      "C": "Si las entidades gestoras pudieran autorizar excepciones a normas imperativas.",
      "D": "Si existiera compensación salarial de daños en la relación laboral ordinaria."
    },
    "trap_types": [
      "factual_misapplication",
      "wrong_competent_body",
      "absolute_relative_confusion"
    ],
    "corrective_rule": "Regla: El recargo de prestaciones es DIRECTO e INASEGURABLE; cualquier pacto de seguro es NULO DE PLENO DERECHO.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-21",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cover_and_generate_mcq",
    "stem": "La acción administrativa de la Seguridad Social para exigir el reintegro de las prestaciones indebidamente percibidas prescribirá:",
    "prompt_before_options": "Antes de ver las opciones, recuerda el plazo legal de prescripción para la devolución de cobros indebidos (Art. 55).",
    "options": [
      {
        "id": "A",
        "text": "A los cuatro años, contados a partir de la fecha de su cobro efectivo o percepción.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La obligación de reintegrar las prestaciones indebidamente percibidas prescribe a los cuatro años desde su cobro.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "A los cinco años, computados desde la fecha del hecho causante.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara del plazo general de prescripción del reconocimiento del derecho.",
        "condition_if_correct": "Si se tratara del plazo general de prescripción del reconocimiento del derecho."
      },
      {
        "id": "C",
        "text": "Al año, computado desde que la entidad gestora descubra formalmente el cobro irregular.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara de caducidad del percibo ordinario.",
        "condition_if_correct": "Si se tratara de caducidad del percibo ordinario."
      },
      {
        "id": "D",
        "text": "A los diez años, por tratarse de un enriquecimiento sin causa de fondos públicos.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si estuviéramos ante infracciones penales graves con dolo probado.",
        "condition_if_correct": "Si estuviéramos ante infracciones penales graves con dolo probado."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 55.1 TRLGSS",
    "rule_statement": "La obligación de reintegrar las prestaciones indebidamente percibidas prescribe a los cuatro años desde su cobro.",
    "why_correct": "La obligación de reintegrar las prestaciones indebidamente percibidas prescribe a los cuatro años desde su cobro.",
    "distractor_analysis": {
      "B": "Si se tratara del plazo general de prescripción del reconocimiento del derecho.",
      "C": "Si se tratara de caducidad del percibo ordinario.",
      "D": "Si estuviéramos ante infracciones penales graves con dolo probado."
    },
    "trap_types": [
      "conceptual_merger",
      "conceptual_merger",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Reintegro de prestaciones indebidas prescribe a los 4 AÑOS desde su cobro (Art. 55.1).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-22",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_aplazamiento_corriente_incumplimiento",
    "item_type": "cover_and_generate_mcq",
    "stem": "Cuando el causante sea deudor de cuotas y proceda la invitación al pago, ¿de qué plazo dispone para ponerse al corriente?",
    "prompt_before_options": "Antes de ver las opciones, recuerda el plazo de invitación al pago otorgado por la entidad gestora.",
    "options": [
      {
        "id": "A",
        "text": "Treinta días naturales improrrogables desde la notificación.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "La entidad gestora invitará al deudor para que, en el plazo improrrogable de 30 días naturales, ingrese las cuotas debidas.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "De quince días hábiles computados con arreglo a la Ley 39/2015.",
        "is_correct": false,
        "trap_type": "temporal_confusion",
        "explanation": "Incorrecto. Si se aplicara el plazo general supletorio de subsanación de la LPACAP.",
        "condition_if_correct": "Si se aplicara el plazo general supletorio de subsanación de la LPACAP."
      },
      {
        "id": "C",
        "text": "De tres meses naturales, computados desde la solicitud de la prestación.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se confundiese con la retroactividad económica del reconocimiento.",
        "condition_if_correct": "Si se confundiese con la retroactividad económica del reconocimiento."
      },
      {
        "id": "D",
        "text": "De sesenta días naturales, prorrogables por otros treinta si concurre causa justificada.",
        "is_correct": false,
        "trap_type": "numeric_substitution",
        "explanation": "Incorrecto. Si existiera régimen de prórroga formal en vía ejecutiva ordinaria.",
        "condition_if_correct": "Si existiera régimen de prórroga formal en vía ejecutiva ordinaria."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 47.1 TRLGSS",
    "rule_statement": "La entidad gestora invitará al deudor para que, en el plazo improrrogable de 30 días naturales, ingrese las cuotas debidas.",
    "why_correct": "La entidad gestora invitará al deudor para que, en el plazo improrrogable de 30 días naturales, ingrese las cuotas debidas.",
    "distractor_analysis": {
      "B": "Si se aplicara el plazo general supletorio de subsanación de la LPACAP.",
      "C": "Si se confundiese con la retroactividad económica del reconocimiento.",
      "D": "Si existiera régimen de prórroga formal en vía ejecutiva ordinaria."
    },
    "trap_types": [
      "temporal_confusion",
      "conceptual_merger",
      "numeric_substitution"
    ],
    "corrective_rule": "Regla: Invitación al pago de cuotas = 30 DÍAS NATURALES improrrogables (Art. 47.1).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-23",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_entidades_gestoras",
    "confusion_pair_id": "pair_inss_tgss_competencia",
    "item_type": "cover_and_generate_mcq",
    "stem": "En la distribución competencial del sistema, ¿a qué entidad corresponde el reconocimiento del derecho a la jubilación contributiva?",
    "prompt_before_options": "Antes de ver las opciones, identifica el órgano gestor competente para pensiones contributivas.",
    "options": [
      {
        "id": "A",
        "text": "Al Instituto Nacional de la Seguridad Social (INSS).",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Corresponde al INSS la gestión y administración de las prestaciones económicas del sistema, incluida la jubilación.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "A la Tesorería General de la Seguridad Social (TGSS).",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "Incorrecto. Si se tratara de recaudación, caja única o afiliación.",
        "condition_if_correct": "Si se tratara de recaudación, caja única o afiliación."
      },
      {
        "id": "C",
        "text": "A las Mutuas Colaboradoras con la Seguridad Social en todo caso.",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "Incorrecto. Si se tratara de la gestión de incapacidad temporal por contingencias profesionales o cese de autónomos.",
        "condition_if_correct": "Si se tratara de la gestión de incapacidad temporal por contingencias profesionales o cese de autónomos."
      },
      {
        "id": "D",
        "text": "A la Dirección General de Ordenación de la Seguridad Social (DGOSS).",
        "is_correct": false,
        "trap_type": "wrong_competent_body",
        "explanation": "Incorrecto. Si se tratara de la elaboración de directrices normativas e informes técnicos ministeriales.",
        "condition_if_correct": "Si se tratara de la elaboración de directrices normativas e informes técnicos ministeriales."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 66 TRLGSS",
    "rule_statement": "Corresponde al INSS la gestión y administración de las prestaciones económicas del sistema, incluida la jubilación.",
    "why_correct": "Corresponde al INSS la gestión y administración de las prestaciones económicas del sistema, incluida la jubilación.",
    "distractor_analysis": {
      "B": "Si se tratara de recaudación, caja única o afiliación.",
      "C": "Si se tratara de la gestión de incapacidad temporal por contingencias profesionales o cese de autónomos.",
      "D": "Si se tratara de la elaboración de directrices normativas e informes técnicos ministeriales."
    },
    "trap_types": [
      "wrong_competent_body",
      "wrong_competent_body",
      "wrong_competent_body"
    ],
    "corrective_rule": "Regla: INSS reconoce y paga prestaciones; TGSS recauda cuotas y custodia la caja única.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-24",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_responsabilidad",
    "confusion_pair_id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "item_type": "cover_and_generate_mcq",
    "stem": "En materia de subcontratación de obras y servicios correspondientes a la propia actividad (art. 42 ET), la responsabilidad del empresario principal:",
    "prompt_before_options": "Antes de ver las opciones, recuerda la naturaleza y plazo de responsabilidad del principal en contratas.",
    "options": [
      {
        "id": "A",
        "text": "Es solidaria durante el año siguiente a la terminación del encargo.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "El empresario principal responde solidariamente durante el año siguiente a la finalización del encargo de las deudas de SS.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Es estrictamente subsidiaria, exigiendo la previa declaración judicial de insolvencia del contratista.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se tratara de contratas de actividad no propia o supuestos residuales de responsabilidad subsidiaria.",
        "condition_if_correct": "Si se tratara de contratas de actividad no propia o supuestos residuales de responsabilidad subsidiaria."
      },
      {
        "id": "C",
        "text": "Es mancomunada proporcional al volumen de trabajadores asignados a la contrata.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si se aplicaran las reglas generales mancomunadas del Código Civil sin norma laboral especial.",
        "condition_if_correct": "Si se aplicaran las reglas generales mancomunadas del Código Civil sin norma laboral especial."
      },
      {
        "id": "D",
        "text": "Se extingue de forma automática con la entrega formal y recepción de la obra.",
        "is_correct": false,
        "trap_type": "exception_ignored",
        "explanation": "Incorrecto. Si la certificación negativa de descubiertos de la TGSS exonerase permanentemente.",
        "condition_if_correct": "Si la certificación negativa de descubiertos de la TGSS exonerase permanentemente."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 42.2 ET y Art. 168 TRLGSS",
    "rule_statement": "El empresario principal responde solidariamente durante el año siguiente a la finalización del encargo de las deudas de SS.",
    "why_correct": "El empresario principal responde solidariamente durante el año siguiente a la finalización del encargo de las deudas de SS.",
    "distractor_analysis": {
      "B": "Si se tratara de contratas de actividad no propia o supuestos residuales de responsabilidad subsidiaria.",
      "C": "Si se aplicaran las reglas generales mancomunadas del Código Civil sin norma laboral especial.",
      "D": "Si la certificación negativa de descubiertos de la TGSS exonerase permanentemente."
    },
    "trap_types": [
      "conceptual_merger",
      "conceptual_merger",
      "exception_ignored"
    ],
    "corrective_rule": "Regla: Contratas de propia actividad = Responsabilidad SOLIDARIA durante 1 AÑO (Art. 42 ET).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-mcq-25",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_intangibilidad_embargo_irpf",
    "item_type": "cover_and_generate_mcq",
    "stem": "¿Cuáles de las siguientes pensiones contributivas de la Seguridad Social gozan de exención íntegra en el IRPF?",
    "prompt_before_options": "Antes de ver las opciones, recuerda las dos únicas prestaciones contributivas exentas de tributación en IRPF.",
    "options": [
      {
        "id": "A",
        "text": "Las pensiones por incapacidad permanente absoluta y por gran invalidez.",
        "is_correct": true,
        "trap_type": "factual_misapplication",
        "explanation": "Están exentas de IRPF las pensiones por incapacidad permanente absoluta o gran invalidez.",
        "condition_if_correct": "Correcto con arreglo a la norma vigente."
      },
      {
        "id": "B",
        "text": "Todas las pensiones que se abonen por contingencias profesionales.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto. Si las contingencias profesionales estuvieran exentas por su causa y no por el grado invalidante.",
        "condition_if_correct": "Si las contingencias profesionales estuvieran exentas por su causa y no por el grado invalidante."
      },
      {
        "id": "C",
        "text": "La pensión de viudedad y la pensión de orfandad con independencia de la edad.",
        "is_correct": false,
        "trap_type": "overbroad_statement",
        "explanation": "Incorrecto. Si la orfandad estuviera exenta totalmente (está exenta hasta 22 años o con discapacidad, no siempre).",
        "condition_if_correct": "Si la orfandad estuviera exenta totalmente (está exenta hasta 22 años o con discapacidad, no siempre)."
      },
      {
        "id": "D",
        "text": "La pensión de jubilación ordinaria que no alcance el tope de pensión máxima.",
        "is_correct": false,
        "trap_type": "conceptual_merger",
        "explanation": "Incorrecto. Si la jubilación gozase de exención fiscal por tributar como rentas del ahorro.",
        "condition_if_correct": "Si la jubilación gozase de exención fiscal por tributar como rentas del ahorro."
      }
    ],
    "correct_answer": "A",
    "legal_basis": "Art. 7 Ley 35/2006 (LIRPF)",
    "rule_statement": "Están exentas de IRPF las pensiones por incapacidad permanente absoluta o gran invalidez.",
    "why_correct": "Están exentas de IRPF las pensiones por incapacidad permanente absoluta o gran invalidez.",
    "distractor_analysis": {
      "B": "Si las contingencias profesionales estuvieran exentas por su causa y no por el grado invalidante.",
      "C": "Si la orfandad estuviera exenta totalmente (está exenta hasta 22 años o con discapacidad, no siempre).",
      "D": "Si la jubilación gozase de exención fiscal por tributar como rentas del ahorro."
    },
    "trap_types": [
      "overbroad_statement",
      "overbroad_statement",
      "conceptual_merger"
    ],
    "corrective_rule": "Regla: En IRPF solo están exentas la Incapacidad Permanente ABSOLUTA y la GRAN INVALIDEZ (Art. 7 LIRPF).",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEl derecho al reconocimiento de las prestaciones prescribirá a los {{c1::5 años}}, contados desde el día siguiente a aquel en que tenga lugar el {{c2::hecho causante}}, sin perjuicio de que los efectos se retrotraigan a los {{c3::3 meses}} anteriores a la solicitud.",
    "cloze_data": {
      "template_text": "El derecho al reconocimiento de las prestaciones prescribirá a los {{c1::5 años}}, contados desde el día siguiente a aquel en que tenga lugar el {{c2::hecho causante}}, sin perjuicio de que los efectos se retrotraigan a los {{c3::3 meses}} anteriores a la solicitud.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "5 años",
          "synonyms": [
            "cinco años"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 53.1 TRLGSS es 5 años.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "hecho causante",
          "synonyms": [
            "hecho causante de la prestación"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 53.1 TRLGSS es hecho causante.",
          "trap_type_if_missed": "conceptual_merger"
        },
        {
          "id": "c3",
          "correct_answer": "3 meses",
          "synonyms": [
            "tres meses"
          ],
          "prompt_hint": "Plazo temporal",
          "explanation": "El plazo exacto según Art. 53.1 TRLGSS es 3 meses.",
          "trap_type_if_missed": "temporal_confusion"
        }
      ]
    },
    "legal_basis": "Art. 53.1 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 53.1 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 53.1 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 53.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_caducidad_alzado_periodicas",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEl derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará al {{c1::1 año}}, a contar desde el día siguiente al de la {{c2::notificación}} de la concesión.",
    "cloze_data": {
      "template_text": "El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará al {{c1::1 año}}, a contar desde el día siguiente al de la {{c2::notificación}} de la concesión.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "1 año",
          "synonyms": [
            "un año"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 54.1 TRLGSS es 1 año.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "notificación",
          "synonyms": [
            "notificación de la resolución"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 54.1 TRLGSS es notificación.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 54.1 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 54.1 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 54.1 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 54.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_caducidad_alzado_periodicas",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEn las prestaciones periódicas, el derecho al percibo de cada mensualidad caducará al {{c1::1 año}} de su respectivo {{c2::vencimiento}}.",
    "cloze_data": {
      "template_text": "En las prestaciones periódicas, el derecho al percibo de cada mensualidad caducará al {{c1::1 año}} de su respectivo {{c2::vencimiento}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "1 año",
          "synonyms": [
            "un año"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 54.2 TRLGSS es 1 año.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "vencimiento",
          "synonyms": [
            "vencimiento mensual"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 54.2 TRLGSS es vencimiento.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 54.2 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 54.2 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 54.2 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 54.2 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nSon legalmente imprescriptibles el derecho al reconocimiento de la pensión de {{c1::jubilación}} en su modalidad contributiva y de las prestaciones por {{c2::muerte y supervivencia}}.",
    "cloze_data": {
      "template_text": "Son legalmente imprescriptibles el derecho al reconocimiento de la pensión de {{c1::jubilación}} en su modalidad contributiva y de las prestaciones por {{c2::muerte y supervivencia}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "jubilación",
          "synonyms": [
            "pensión de jubilación",
            "jubilación contributiva",
            "modalidad contributiva"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El derecho al reconocimiento de la pensión de jubilación en su modalidad contributiva es imprescriptible (Art. 212 TRLGSS), sin perjuicio de que sus efectos se produzcan desde los tres meses anteriores a la solicitud.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "muerte y supervivencia",
          "synonyms": [
            "muerte",
            "prestaciones por muerte y supervivencia",
            "viudedad y orfandad"
          ],
          "prompt_hint": "Término legal",
          "explanation": "Las prestaciones por muerte y supervivencia son también imprescriptibles (Art. 230 TRLGSS). En cambio, la incapacidad permanente NO es imprescriptible: prescribe a los cinco años (Art. 53.1 TRLGSS).",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Arts. 212 y 230 TRLGSS",
    "rule_statement": "Excepciones a la prescripción quinquenal del Art. 53.1 TRLGSS en los Arts. 212 y 230 TRLGSS.",
    "why_correct": "Solo la pensión de jubilación contributiva (Art. 212 TRLGSS) y las prestaciones por muerte y supervivencia (Art. 230 TRLGSS) son imprescriptibles; la incapacidad permanente queda sometida a la prescripción de cinco años.",
    "corrective_rule": "No extiendas la imprescriptibilidad a la incapacidad permanente: prescribe a los cinco años desde el hecho causante.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa obligación de reintegrar las prestaciones indebidamente percibidas prescribirá a los {{c1::4 años}}, contados a partir de la fecha de su {{c2::cobro}}.",
    "cloze_data": {
      "template_text": "La obligación de reintegrar las prestaciones indebidamente percibidas prescribirá a los {{c1::4 años}}, contados a partir de la fecha de su {{c2::cobro}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "4 años",
          "synonyms": [
            "cuatro años"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 55.1 TRLGSS es 4 años.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "cobro",
          "synonyms": [
            "percepción"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 55.1 TRLGSS es cobro.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 55.1 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 55.1 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 55.1 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 55.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nA los trabajadores fijos-discontinuos se les aplicará un coeficiente del {{c1::1,5}} a cada día cotizado, con el límite máximo de los días naturales del {{c2::año}}.",
    "cloze_data": {
      "template_text": "A los trabajadores fijos-discontinuos se les aplicará un coeficiente del {{c1::1,5}} a cada día cotizado, con el límite máximo de los días naturales del {{c2::año}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "1,5",
          "synonyms": [
            "1.5",
            "uno y medio"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 247 TRLGSS es 1,5.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "año",
          "synonyms": [
            "año natural"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 247 TRLGSS es año.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 247 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 247 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 247 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 247 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEn contratos temporales de duración igual o inferior a 5 días, cada día computa como {{c1::1,4}} días cotizados, con tope de los días naturales del {{c2::mes}}.",
    "cloze_data": {
      "template_text": "En contratos temporales de duración igual o inferior a 5 días, cada día computa como {{c1::1,4}} días cotizados, con tope de los días naturales del {{c2::mes}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "1,4",
          "synonyms": [
            "1.4"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 249 bis TRLGSS es 1,4.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "mes",
          "synonyms": [
            "mes natural"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 249 bis TRLGSS es mes.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 249 bis TRLGSS",
    "rule_statement": "Precepto regulado en Art. 249 bis TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 249 bis TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 249 bis TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nPor cada parto simple se computarán {{c1::112 días}} de cotización ficticia en beneficio de la madre trabajadora sin necesidad de cotización previa.",
    "cloze_data": {
      "template_text": "Por cada parto simple se computarán {{c1::112 días}} de cotización ficticia en beneficio de la madre trabajadora sin necesidad de cotización previa.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "112 días",
          "synonyms": [
            "112"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 235 TRLGSS es 112 días.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 235 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 235 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 235 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 235 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-9",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEn caso de parto múltiple, se sumarán {{c1::14 días}} adicionales por cada hijo a partir del segundo.",
    "cloze_data": {
      "template_text": "En caso de parto múltiple, se sumarán {{c1::14 días}} adicionales por cada hijo a partir del segundo.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "14 días",
          "synonyms": [
            "14"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 235 TRLGSS es 14 días.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 235 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 235 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 235 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 235 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-10",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nPara 2026, la revalorización de las pensiones contributivas de la Seguridad Social se fija con carácter general en el {{c1::2,7%}}.",
    "cloze_data": {
      "template_text": "Para 2026, la revalorización de las pensiones contributivas de la Seguridad Social se fija con carácter general en el {{c1::2,7%}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "2,7%",
          "synonyms": [
            "2.7%",
            "2,7 por ciento",
            "2.7 por ciento"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 58 TRLGSS es 2,7%.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 58 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 58 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 58 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 58 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-11",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa cuantía máxima de las pensiones de la Seguridad Social para 2026 asciende a {{c1::3.359,60 €}} mensuales.",
    "cloze_data": {
      "template_text": "La cuantía máxima de las pensiones de la Seguridad Social para 2026 asciende a {{c1::3.359,60 €}} mensuales.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "3.359,60 €",
          "synonyms": [
            "3359,60 €",
            "3359.60",
            "3.359,60 euros"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 58 TRLGSS es 3.359,60 €.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 58 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 58 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 58 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 58 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-12",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_contributiva_no_contributiva",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa pensión no contributiva íntegra de jubilación e invalidez se fija para 2026 en {{c1::8.803,20 €}} anuales.",
    "cloze_data": {
      "template_text": "La pensión no contributiva íntegra de jubilación e invalidez se fija para 2026 en {{c1::8.803,20 €}} anuales.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "8.803,20 €",
          "synonyms": [
            "8803,20 €",
            "8803.20",
            "8.803,20 euros"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según los arts. 364 y 370 TRLGSS es 8.803,20 €.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Arts. 364 y 370 TRLGSS",
    "rule_statement": "Precepto regulado en los arts. 364 y 370 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de los arts. 364 y 370 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en los arts. 364 y 370 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-13",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEl límite de ingresos para tener derecho al complemento a mínimos sin cónyuge a cargo en 2026 es de {{c1::9.442,00 €}} al año.",
    "cloze_data": {
      "template_text": "El límite de ingresos para tener derecho al complemento a mínimos sin cónyuge a cargo en 2026 es de {{c1::9.442,00 €}} al año.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "9.442,00 €",
          "synonyms": [
            "9442,00 €",
            "9442.00",
            "9.442 euros"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 59 TRLGSS es 9.442,00 €.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 59 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 59 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 59 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 59 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-14",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEl límite de ingresos para complemento a mínimos con cónyuge a cargo en 2026 se sitúa en {{c1::11.013,00 €}} anuales.",
    "cloze_data": {
      "template_text": "El límite de ingresos para complemento a mínimos con cónyuge a cargo en 2026 se sitúa en {{c1::11.013,00 €}} anuales.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "11.013,00 €",
          "synonyms": [
            "11013,00 €",
            "11013.00",
            "11.013 euros"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 59 TRLGSS es 11.013,00 €.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 59 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 59 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 59 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 59 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-15",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nSon inembargables los salarios, sueldos o pensiones que no excedan de la cuantía señalada para el {{c1::SMI}}.",
    "cloze_data": {
      "template_text": "Son inembargables los salarios, sueldos o pensiones que no excedan de la cuantía señalada para el {{c1::SMI}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "SMI",
          "synonyms": [
            "Salario Mínimo Interprofesional",
            "salario mínimo"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 44 TRLGSS es SMI.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 44 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 44 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 44 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 44 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-16",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa primera cuantía adicional de pensión que supere el SMI hasta el doble del SMI se embarga en un {{c1::30%}}.",
    "cloze_data": {
      "template_text": "La primera cuantía adicional de pensión que supere el SMI hasta el doble del SMI se embarga en un {{c1::30%}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "30%",
          "synonyms": [
            "30 por ciento",
            "treinta por ciento"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 607.2 LEC es 30%.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 607.2 LEC",
    "rule_statement": "Precepto regulado en Art. 607.2 LEC.",
    "why_correct": "Compleción exacta según el texto legal de Art. 607.2 LEC.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 607.2 LEC.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-17",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nEl recargo de prestaciones económicas por infracción de medidas de seguridad oscila entre el {{c1::30%}} y el {{c2::50%}}.",
    "cloze_data": {
      "template_text": "El recargo de prestaciones económicas por infracción de medidas de seguridad oscila entre el {{c1::30%}} y el {{c2::50%}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "30%",
          "synonyms": [
            "30 por ciento"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 164 TRLGSS es 30%.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "50%",
          "synonyms": [
            "50 por ciento"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 164 TRLGSS es 50%.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 164 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 164 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 164 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 164 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-18",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_aplazamiento_corriente_incumplimiento",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa invitación al pago de cuotas debidas concede al responsable un plazo improrrogable de {{c1::30 días naturales}} para abonarlas.",
    "cloze_data": {
      "template_text": "La invitación al pago de cuotas debidas concede al responsable un plazo improrrogable de {{c1::30 días naturales}} para abonarlas.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "30 días naturales",
          "synonyms": [
            "30 días",
            "treinta días naturales"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 47.1 TRLGSS es 30 días naturales.",
          "trap_type_if_missed": "numeric_precision"
        }
      ]
    },
    "legal_basis": "Art. 47.1 TRLGSS",
    "rule_statement": "Precepto regulado en Art. 47.1 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de Art. 47.1 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 47.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-19",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_intangibilidad_embargo_irpf",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLas pensiones contributivas por incapacidad permanente {{c1::absoluta}} y por {{c2::gran invalidez}} están exentas de tributar en el IRPF.",
    "cloze_data": {
      "template_text": "Las pensiones contributivas por incapacidad permanente {{c1::absoluta}} y por {{c2::gran invalidez}} están exentas de tributar en el IRPF.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "absoluta",
          "synonyms": [
            "IP absoluta"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 7 Ley 35/2006 es absoluta.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "gran invalidez",
          "synonyms": [
            "GI"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El término exacto según Art. 7 Ley 35/2006 es gran invalidez.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Art. 7 Ley 35/2006",
    "rule_statement": "Precepto regulado en Art. 7 Ley 35/2006.",
    "why_correct": "Compleción exacta según el texto legal de Art. 7 Ley 35/2006.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en Art. 7 Ley 35/2006.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-cloze-20",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_contingencias",
    "confusion_pair_id": "pair_it_ip",
    "item_type": "cloze",
    "stem": "Completa los términos y cifras exactas en el siguiente precepto legal:\n\nLa incapacidad temporal tendrá una duración máxima de {{c1::365 días}}, prorrogables expresamente por otros {{c2::180 días}}.",
    "cloze_data": {
      "template_text": "La incapacidad temporal tendrá una duración máxima de {{c1::365 días}}, prorrogables expresamente por otros {{c2::180 días}}.",
      "blanks": [
        {
          "id": "c1",
          "correct_answer": "365 días",
          "synonyms": [
            "365"
          ],
          "prompt_hint": "Dato jurídico exacto",
          "explanation": "El valor exacto según Art. 170.1 TRLGSS es 365 días.",
          "trap_type_if_missed": "numeric_precision"
        },
        {
          "id": "c2",
          "correct_answer": "180 días",
          "synonyms": [
            "180"
          ],
          "prompt_hint": "Término legal",
          "explanation": "El valor exacto según Art. 170.2 TRLGSS es 180 días de prórroga expresa.",
          "trap_type_if_missed": "conceptual_merger"
        }
      ]
    },
    "legal_basis": "Arts. 170.1 y 170.2 TRLGSS",
    "rule_statement": "Duración y prórroga de la incapacidad temporal en los Arts. 170.1 y 170.2 TRLGSS.",
    "why_correct": "Compleción exacta según el texto legal de los Arts. 170.1 y 170.2 TRLGSS.",
    "corrective_rule": "Memoriza con precisión las magnitudes fijadas en los Arts. 170.1 y 170.2 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "generative_retrieval",
      "numeric_precision"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Prescripción de Caducidad de prestaciones?",
    "contrast_data": {
      "concept_a": "Prescripción",
      "concept_b": "Caducidad de prestaciones",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Prescripción y Caducidad de prestaciones.",
      "rows": [
        {
          "criterion": "Objeto sobre el que recae",
          "concept_a_val": "Derecho al RECONOCIMIENTO de la prestación",
          "concept_b_val": "Derecho al PERCIBO de lo ya reconocido",
          "trap_note": "Confundir reconocimiento con cobro."
        },
        {
          "criterion": "Plazo legal extintivo",
          "concept_a_val": "5 años con carácter general",
          "concept_b_val": "1 año (tanto alzado o periódicas)",
          "trap_note": "Invertir 5 años y 1 año."
        },
        {
          "criterion": "Dies a quo de cómputo",
          "concept_a_val": "Día siguiente al hecho causante",
          "concept_b_val": "Notificación concesión (alzado) o vencimiento (periódica)",
          "trap_note": "Contar caducidad desde el hecho causante."
        },
        {
          "criterion": "Interrupción del plazo",
          "concept_a_val": "Se interrumpe por reclamación judicial o extrajudicial",
          "concept_b_val": "La caducidad se aprecia de oficio y no admite interrupción",
          "trap_note": "Creer que la caducidad admite interrupción ordinaria."
        }
      ]
    },
    "legal_basis": "Art. 53 y 54 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 53 y 54 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 53 y 54 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Prescripción y Caducidad de prestaciones.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_retroactividad",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Prescripción de Retroactividad económica?",
    "contrast_data": {
      "concept_a": "Prescripción",
      "concept_b": "Retroactividad económica",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Prescripción y Retroactividad económica.",
      "rows": [
        {
          "criterion": "Finalidad jurídica",
          "concept_a_val": "Plazo para poder solicitar el reconocimiento (5 años)",
          "concept_b_val": "Límite temporal de efectos económicos pasados (3 meses)",
          "trap_note": "Creer que se cobra todo el quinquenio pasado."
        },
        {
          "criterion": "Dies a quo",
          "concept_a_val": "Día siguiente al hecho causante",
          "concept_b_val": "Fecha de presentación de la solicitud",
          "trap_note": "Contar la retroactividad desde el hecho causante."
        }
      ]
    },
    "legal_basis": "Art. 53.1 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 53.1 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 53.1 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Prescripción y Retroactividad económica.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_caducidad_alzado_periodicas",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Caducidad de tanto alzado de Caducidad de periódicas?",
    "contrast_data": {
      "concept_a": "Caducidad de tanto alzado",
      "concept_b": "Caducidad de periódicas",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Caducidad de tanto alzado y Caducidad de periódicas.",
      "rows": [
        {
          "criterion": "Tipo de abono",
          "concept_a_val": "Pago único y por una sola vez",
          "concept_b_val": "Devengo mensual sucesivo",
          "trap_note": "Equiparar indemnización única con nómina periódica."
        },
        {
          "criterion": "Dies a quo del año de caducidad",
          "concept_a_val": "Día siguiente a la notificación de la concesión",
          "concept_b_val": "Vencimiento respectivo de cada mensualidad",
          "trap_note": "Fijar el vencimiento en prestaciones a tanto alzado."
        }
      ]
    },
    "legal_basis": "Art. 54 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 54 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 54 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Caducidad de tanto alzado y Caducidad de periódicas.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Automaticidad absoluta de Automaticidad relativa?",
    "contrast_data": {
      "concept_a": "Automaticidad absoluta",
      "concept_b": "Automaticidad relativa",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Automaticidad absoluta y Automaticidad relativa.",
      "rows": [
        {
          "criterion": "Contingencias amparadas",
          "concept_a_val": "Accidente de trabajo, enfermedad profesional y desempleo",
          "concept_b_val": "Contingencias comunes (enfermedad común y accidente no laboral)",
          "trap_note": "Creer que rige la absoluta en cualquier contingencia común."
        },
        {
          "criterion": "Exigencia de alta previa del trabajador",
          "concept_a_val": "NO se exige; opera incluso sin afiliación ni alta previa",
          "concept_b_val": "SÍ se exige inexcusablemente encontrarse en alta o asimilada",
          "trap_note": "Conceder anticipo de contingencia común sin alta."
        }
      ]
    },
    "legal_basis": "Decreto 21 abril 1966 y Art. 167 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Automaticidad absoluta y Automaticidad relativa.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Coeficiente 1,5 (Fijo-discontinuo) de Coeficiente 1,4 (Contratos <= 5 días)?",
    "contrast_data": {
      "concept_a": "Coeficiente 1,5 (Fijo-discontinuo)",
      "concept_b": "Coeficiente 1,4 (Contratos <= 5 días)",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Coeficiente 1,5 (Fijo-discontinuo) y Coeficiente 1,4 (Contratos <= 5 días).",
      "rows": [
        {
          "criterion": "Coeficiente multiplicador",
          "concept_a_val": "1,5 a los días cotizados",
          "concept_b_val": "1,4 a los días trabajados",
          "trap_note": "Intercambiar los multiplicadores 1,4 y 1,5."
        },
        {
          "criterion": "Tope temporal de cómputo",
          "concept_a_val": "Días naturales del año (máx 365/366)",
          "concept_b_val": "Días naturales del mes de liquidación",
          "trap_note": "Aplicar tope anual a contratos cortos de 5 días."
        }
      ]
    },
    "legal_basis": "Art. 247 y 249 bis TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 247 y 249 bis TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 247 y 249 bis TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Coeficiente 1,5 (Fijo-discontinuo) y Coeficiente 1,4 (Contratos <= 5 días).",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_contrato_corto_tiempo_parcial",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Contrato corto (<= 5 días) de Contrato a tiempo parcial estándar?",
    "contrast_data": {
      "concept_a": "Contrato corto (<= 5 días)",
      "concept_b": "Contrato a tiempo parcial estándar",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Contrato corto (<= 5 días) y Contrato a tiempo parcial estándar.",
      "rows": [
        {
          "criterion": "Aplicación del multiplicador 1,4",
          "concept_a_val": "SÍ, de forma expresa para contratos <= 5 días",
          "concept_b_val": "NO, computa por horas efectivamente trabajadas/jornada legal",
          "trap_note": "Aplicar 1,4 al tiempo parcial indefinido."
        },
        {
          "criterion": "Duración contractual",
          "concept_a_val": "Temporal igual o inferior a 5 días",
          "concept_b_val": "Cualquier duración (indefinida o temporal > 5 días)",
          "trap_note": "Olvidar el umbral estricto de 5 días."
        }
      ]
    },
    "legal_basis": "Art. 248 y 249 bis TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 248 y 249 bis TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 248 y 249 bis TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Contrato corto (<= 5 días) y Contrato a tiempo parcial estándar.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_intangibilidad_embargo_irpf",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Inembargabilidad de pensión de Exención tributaria en IRPF?",
    "contrast_data": {
      "concept_a": "Inembargabilidad de pensión",
      "concept_b": "Exención tributaria en IRPF",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Inembargabilidad de pensión y Exención tributaria en IRPF.",
      "rows": [
        {
          "criterion": "Ámbito de protección",
          "concept_a_val": "Frente a acreedores civiles o ejecutivos (límite SMI)",
          "concept_b_val": "Frente a la Hacienda Pública (deber tributario)",
          "trap_note": "Creer que lo inembargable no tributa en IRPF."
        },
        {
          "criterion": "Beneficiarios",
          "concept_a_val": "Todas las pensiones hasta la cuantía del SMI",
          "concept_b_val": "Exclusivamente IP absoluta y gran invalidez",
          "trap_note": "Creer que la jubilación mínima está exenta de IRPF."
        }
      ]
    },
    "legal_basis": "Art. 44 TRLGSS y Art. 7 Ley 35/2006",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 44 TRLGSS y Art. 7 Ley 35/2006.",
    "why_correct": "Análisis cruzado riguroso según Art. 44 TRLGSS y Art. 7 Ley 35/2006.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Inembargabilidad de pensión y Exención tributaria en IRPF.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Recargo por falta de medidas de Responsabilidad por falta de aseguramiento?",
    "contrast_data": {
      "concept_a": "Recargo por falta de medidas",
      "concept_b": "Responsabilidad por falta de aseguramiento",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Recargo por falta de medidas y Responsabilidad por falta de aseguramiento.",
      "rows": [
        {
          "criterion": "Asegurabilidad",
          "concept_a_val": "INASEGURABLE; pacto de seguro nulo de pleno derecho",
          "concept_b_val": "Asegurable y con posible anticipo por entidades gestoras/mutuas",
          "trap_note": "Intentar cubrir el recargo del 30-50% con seguro privado."
        },
        {
          "criterion": "Cuantía de la carga",
          "concept_a_val": "Incremento del 30% al 50% sobre la prestación",
          "concept_b_val": "Coste íntegro de la prestación o capital coste",
          "trap_note": "Identificar el recargo con el capital coste íntegro."
        }
      ]
    },
    "legal_basis": "Art. 164 y 167 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 164 y 167 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 164 y 167 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Recargo por falta de medidas y Responsabilidad por falta de aseguramiento.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-9",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_entidades_gestoras",
    "confusion_pair_id": "pair_inss_tgss_competencia",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen INSS (Entidad Gestora) de TGSS (Servicio Común)?",
    "contrast_data": {
      "concept_a": "INSS (Entidad Gestora)",
      "concept_b": "TGSS (Servicio Común)",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre INSS (Entidad Gestora) y TGSS (Servicio Común).",
      "rows": [
        {
          "criterion": "Naturaleza jurídica",
          "concept_a_val": "Entidad Gestora de la Seguridad Social",
          "concept_b_val": "Servicio Común de la Seguridad Social",
          "trap_note": "Denominar a la TGSS entidad gestora."
        },
        {
          "criterion": "Función principal",
          "concept_a_val": "Reconocimiento y pago de prestaciones económicas contributivas",
          "concept_b_val": "Afiliación, cotización, recaudación y caja única",
          "trap_note": "Atribuir la recaudación de cuotas al INSS."
        }
      ]
    },
    "legal_basis": "Art. 66 y 74 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 66 y 74 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 66 y 74 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar INSS (Entidad Gestora) y TGSS (Servicio Común).",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-10",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_falta_alta_falta_cotizacion",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Falta de alta de Falta de cotización (descubierto)?",
    "contrast_data": {
      "concept_a": "Falta de alta",
      "concept_b": "Falta de cotización (descubierto)",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Falta de alta y Falta de cotización (descubierto).",
      "rows": [
        {
          "criterion": "Situación jurídica del trabajador",
          "concept_a_val": "Trabajo clandestino o no declarado (sin alta)",
          "concept_b_val": "Alta real formalizada pero cuotas impagadas",
          "trap_note": "Asimilar descubierto empresarial a falta de alta."
        },
        {
          "criterion": "Efecto en contingencias comunes",
          "concept_a_val": "Excluye la automaticidad relativa; sin prestación",
          "concept_b_val": "Opera el principio de automaticidad relativa con anticipo",
          "trap_note": "Denegar prestación al trabajador en alta por impago patronal."
        }
      ]
    },
    "legal_basis": "Art. 166 y 167 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 166 y 167 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 166 y 167 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Falta de alta y Falta de cotización (descubierto).",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-11",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_responsabilidad",
    "confusion_pair_id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Responsabilidad solidaria (art. 42 ET) de Responsabilidad subsidiaria (art. 168 TRLGSS)?",
    "contrast_data": {
      "concept_a": "Responsabilidad solidaria (art. 42 ET)",
      "concept_b": "Responsabilidad subsidiaria (art. 168 TRLGSS)",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Responsabilidad solidaria (art. 42 ET) y Responsabilidad subsidiaria (art. 168 TRLGSS).",
      "rows": [
        {
          "criterion": "Presupuesto de exigibilidad",
          "concept_a_val": "Directa sin necesidad de previa insolvencia del contratista",
          "concept_b_val": "Requiere insolvencia formal declarada del deudor principal",
          "trap_note": "Exigir previa excusión en contratas de propia actividad."
        },
        {
          "criterion": "Plazo de sujeción",
          "concept_a_val": "Durante el año siguiente a la finalización de la contrata",
          "concept_b_val": "Sujeta al plazo general de prescripción de cuotas",
          "trap_note": "Aplicar el límite de 1 año a cualquier responsabilidad."
        }
      ]
    },
    "legal_basis": "Art. 42 ET y Art. 168 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 42 ET y Art. 168 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 42 ET y Art. 168 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Responsabilidad solidaria (art. 42 ET) y Responsabilidad subsidiaria (art. 168 TRLGSS).",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-12",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_contributiva_no_contributiva",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Prestación contributiva de Prestación no contributiva?",
    "contrast_data": {
      "concept_a": "Prestación contributiva",
      "concept_b": "Prestación no contributiva",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Prestación contributiva y Prestación no contributiva.",
      "rows": [
        {
          "criterion": "Requisito de cotización previa",
          "concept_a_val": "Exige cotización previa (período de carencia)",
          "concept_b_val": "Carencia 0; no exige cotización previa alguna",
          "trap_note": "Exigir días cotizados a la PNC de invalidez."
        },
        {
          "criterion": "Requisito económico",
          "concept_a_val": "Se abona con independencia de los ingresos del beneficiario",
          "concept_b_val": "Exige carecer de rentas o ingresos suficientes",
          "trap_note": "Condicionar la contributiva ordinaria al límite de rentas."
        }
      ]
    },
    "legal_basis": "Art. 15 y 363 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 15 y 363 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 15 y 363 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Prestación contributiva y Prestación no contributiva.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-13",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_contingencias",
    "confusion_pair_id": "pair_it_ip",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Incapacidad Temporal de Incapacidad Permanente?",
    "contrast_data": {
      "concept_a": "Incapacidad Temporal",
      "concept_b": "Incapacidad Permanente",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Incapacidad Temporal y Incapacidad Permanente.",
      "rows": [
        {
          "criterion": "Duración de la situación",
          "concept_a_val": "Temporal: 365 días + prórroga expresa de 180 días (calificación en 90 días; tope 730 días)",
          "concept_b_val": "Previsiblemente definitiva (secuelas anatómicas/funcionales)",
          "trap_note": "Considerar la IP como situación meramente transitoria."
        },
        {
          "criterion": "Finalidad protectora",
          "concept_a_val": "Subsidio sustitutorio del salario durante el tratamiento médico",
          "concept_b_val": "Pensión o indemnización reparadora de pérdida de capacidad",
          "trap_note": "Confundir el subsidio diario con la pensión mensual."
        }
      ]
    },
    "legal_basis": "Arts. 170, 174 y 193 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en los Arts. 170, 174 y 193 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según los Arts. 170, 174 y 193 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Incapacidad Temporal y Incapacidad Permanente.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-14",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Inembargabilidad del SMI de Escala de embargo de la LEC?",
    "contrast_data": {
      "concept_a": "Inembargabilidad del SMI",
      "concept_b": "Escala de embargo de la LEC",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Inembargabilidad del SMI y Escala de embargo de la LEC.",
      "rows": [
        {
          "criterion": "Porcentaje aplicable",
          "concept_a_val": "0% de embargo (inembargable al 100%)",
          "concept_b_val": "Del 30% al 90% según los tramos de exceso sobre el SMI",
          "trap_note": "Calcular la escala sobre la pensión íntegra y no sobre el exceso."
        },
        {
          "criterion": "Excepción legal",
          "concept_a_val": "Pensiones compensatorias y de alimentos a cónyuge e hijos",
          "concept_b_val": "Rebaja de un 10% a 15% en atención a cargas familiares",
          "trap_note": "Ignorar la excepción privilegiada de alimentos."
        }
      ]
    },
    "legal_basis": "Art. 44 TRLGSS y Art. 607 LEC",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 44 TRLGSS y Art. 607 LEC.",
    "why_correct": "Análisis cruzado riguroso según Art. 44 TRLGSS y Art. 607 LEC.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Inembargabilidad del SMI y Escala de embargo de la LEC.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-contrast-15",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_carencia_cotizacion",
    "confusion_pair_id": "pair_cotizacion_fuera_plazo_descubiertos",
    "item_type": "contrast_card",
    "stem": "Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen Pago voluntario de cuotas previo de Pago extemporáneo posterior al hecho causante?",
    "contrast_data": {
      "concept_a": "Pago voluntario de cuotas previo",
      "concept_b": "Pago extemporáneo posterior al hecho causante",
      "prompt_cue": "Identifica la diferencia angular de régimen jurídico entre Pago voluntario de cuotas previo y Pago extemporáneo posterior al hecho causante.",
      "rows": [
        {
          "criterion": "Momento del abono",
          "concept_a_val": "Antes de producirse el hecho causante de la prestación",
          "concept_b_val": "Después de sobrevenir el hecho causante (accidente/enfermedad)",
          "trap_note": "Equiparar pagar con recargo antes de enfermar a pagar después."
        },
        {
          "criterion": "Efectos sobre la carencia",
          "concept_a_val": "Convalida la carencia con plenos efectos (con recargo)",
          "concept_b_val": "Carece de efectos retroactivos para causar la prestación",
          "trap_note": "Creer que abonar la deuda tras el infarto habilita la pensión."
        }
      ]
    },
    "legal_basis": "Art. 165 TRLGSS",
    "rule_statement": "Régimen de discriminación positiva y negativa amparado en Art. 165 TRLGSS.",
    "why_correct": "Análisis cruzado riguroso según Art. 165 TRLGSS.",
    "corrective_rule": "Analiza siempre el objeto y el dies a quo para no mezclar Pago voluntario de cuotas previo y Pago extemporáneo posterior al hecho causante.",
    "difficulty": 2,
    "cognitive_operations": [
      "micro_discrimination",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Plazos extintivos y de prescripción en el TRLGSS. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Plazos extintivos y de prescripción en el TRLGSS",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Prescripción general del reconocimiento",
          "correct_value": "5 años",
          "category": "Prescripción"
        },
        {
          "id": "2",
          "concept": "Caducidad de percibo en pago único",
          "correct_value": "1 año",
          "category": "Caducidad"
        },
        {
          "id": "3",
          "concept": "Retroactividad económica máxima",
          "correct_value": "3 meses",
          "category": "Efectos"
        },
        {
          "id": "4",
          "concept": "Prescripción de reintegro de indebidas",
          "correct_value": "4 años",
          "category": "Prescripción"
        }
      ]
    },
    "legal_basis": "Art. 53, 54 y 55 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 53, 54 y 55 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 53, 54 y 55 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Coeficientes y bonificaciones de cómputo. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Coeficientes y bonificaciones de cómputo",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Coeficiente fijos-discontinuos",
          "correct_value": "1,5",
          "category": "Coeficiente"
        },
        {
          "id": "2",
          "concept": "Coeficiente contratos <= 5 días",
          "correct_value": "1,4",
          "category": "Coeficiente"
        },
        {
          "id": "3",
          "concept": "Cotización ficticia parto simple",
          "correct_value": "112 días",
          "category": "Días"
        },
        {
          "id": "4",
          "concept": "Adicional parto múltiple por hijo",
          "correct_value": "14 días",
          "category": "Días"
        }
      ]
    },
    "legal_basis": "Art. 247, 249 bis y 235 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 247, 249 bis y 235 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 247, 249 bis y 235 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-3",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Magnitudes económicas y límites clave 2026. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Magnitudes económicas y límites clave 2026",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Revalorización general contributiva",
          "correct_value": "2,7%",
          "category": "Porcentaje"
        },
        {
          "id": "2",
          "concept": "Tope pensión mensual máxima",
          "correct_value": "3.359,60 €",
          "category": "Importe mensual"
        },
        {
          "id": "3",
          "concept": "Pensión no contributiva anual",
          "correct_value": "8.803,20 €",
          "category": "Importe anual"
        },
        {
          "id": "4",
          "concept": "Límite mínimos sin cónyuge",
          "correct_value": "9.442,00 €",
          "category": "Límite de rentas"
        },
        {
          "id": "5",
          "concept": "Límite mínimos con cónyuge",
          "correct_value": "11.013,00 €",
          "category": "Límite de rentas"
        }
      ]
    },
    "legal_basis": "Art. 58, 59, 364 y 370 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 58, 59, 364 y 370 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 58, 59, 364 y 370 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Escala de embargabilidad del art. 607 de la LEC. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Escala de embargabilidad del art. 607 de la LEC",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Tramo hasta 1x SMI",
          "correct_value": "0% (Inembargable)",
          "category": "Escala"
        },
        {
          "id": "2",
          "concept": "Tramo exceso hasta 2x SMI",
          "correct_value": "30%",
          "category": "Escala"
        },
        {
          "id": "3",
          "concept": "Tramo exceso hasta 3x SMI",
          "correct_value": "50%",
          "category": "Escala"
        },
        {
          "id": "4",
          "concept": "Tramo exceso hasta 4x SMI",
          "correct_value": "60%",
          "category": "Escala"
        },
        {
          "id": "5",
          "concept": "Tramo exceso hasta 5x SMI",
          "correct_value": "75%",
          "category": "Escala"
        },
        {
          "id": "6",
          "concept": "Exceso por encima de 5x SMI",
          "correct_value": "90%",
          "category": "Escala"
        }
      ]
    },
    "legal_basis": "Art. 607 LEC",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 607 LEC.",
    "why_correct": "Valores normativos estrictos fijados en Art. 607 LEC.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_contingencias",
    "confusion_pair_id": "pair_it_ip",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Duración temporal y prórrogas en Incapacidad Temporal. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Duración temporal y prórrogas en Incapacidad Temporal",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Duración máxima ordinaria de la situación de IT",
          "correct_value": "365 días",
          "category": "Duración"
        },
        {
          "id": "2",
          "concept": "Prórroga expresa (agotados los 365 días)",
          "correct_value": "180 días",
          "category": "Prórroga"
        },
        {
          "id": "3",
          "concept": "Límite máximo con demora en la calificación de incapacidad permanente",
          "correct_value": "730 días",
          "category": "Límite"
        }
      ]
    },
    "legal_basis": "Arts. 170.1, 170.2 y 174.2 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por los Arts. 170.1, 170.2 y 174.2 TRLGSS.",
    "why_correct": "La duración ordinaria de la incapacidad temporal es de 365 días (art. 170.1), la prórroga expresa alcanza otros 180 días (art. 170.2) y la demora en la calificación de incapacidad permanente no puede rebasar los 730 días (art. 174.2).",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_carencia_cotizacion",
    "confusion_pair_id": "pair_contingencia_comun_profesional",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Períodos de carencia exigibles en subsidios. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Períodos de carencia exigibles en subsidios",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "IT por contingencias profesionales",
          "correct_value": "0 días",
          "category": "Carencia"
        },
        {
          "id": "2",
          "concept": "IT por enfermedad común",
          "correct_value": "180 días en 5 años",
          "category": "Carencia"
        },
        {
          "id": "3",
          "concept": "Nacimiento trabajadores < 21 años",
          "correct_value": "0 días",
          "category": "Carencia"
        },
        {
          "id": "4",
          "concept": "Nacimiento trabajadores de 21 a menos de 26 años",
          "correct_value": "90 días en 7 años",
          "category": "Carencia"
        },
        {
          "id": "5",
          "concept": "Nacimiento trabajadores de 26 años o más",
          "correct_value": "180 días en 7 años",
          "category": "Carencia"
        }
      ]
    },
    "legal_basis": "Art. 172 y 178 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 172 y 178 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 172 y 178 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Recargos y plazos de gestión empresarial. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Recargos y plazos de gestión empresarial",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Recargo mínimo por falta de medidas",
          "correct_value": "30%",
          "category": "Porcentaje"
        },
        {
          "id": "2",
          "concept": "Recargo máximo por falta de medidas",
          "correct_value": "50%",
          "category": "Porcentaje"
        },
        {
          "id": "3",
          "concept": "Plazo de invitación al pago de cuotas",
          "correct_value": "30 días naturales",
          "category": "Plazo"
        },
        {
          "id": "4",
          "concept": "Ingreso del capital coste por la empresa (plazo reglamentario de ingreso)",
          "correct_value": "1 mes (último día hábil del mes siguiente)",
          "category": "Plazo"
        }
      ]
    },
    "legal_basis": "Art. 47 y 164 TRLGSS, y art. 70 RD 1415/2004",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 47 y 164 TRLGSS y por el art. 70 del Reglamento General de Recaudación.",
    "why_correct": "El recargo va del 30 al 50%, la invitación al pago son 30 días naturales y el plazo reglamentario de ingreso del capital coste finaliza el último día hábil del mes siguiente a la notificación de la reclamación de deuda (art. 70.1 RD 1415/2004).",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_contributiva_no_contributiva",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Requisitos de residencia en prestaciones no contributivas. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Requisitos de residencia en prestaciones no contributivas",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Residencia exigida para PNC jubilación",
          "correct_value": "10 años",
          "category": "Residencia"
        },
        {
          "id": "2",
          "concept": "Años consecutivos e inmediatamente anteriores en jubilación",
          "correct_value": "2 años",
          "category": "Residencia"
        },
        {
          "id": "3",
          "concept": "Residencia exigida para PNC invalidez",
          "correct_value": "5 años",
          "category": "Residencia"
        },
        {
          "id": "4",
          "concept": "Grado mínimo de discapacidad para PNC invalidez",
          "correct_value": "65%",
          "category": "Porcentaje"
        }
      ]
    },
    "legal_basis": "Art. 363 y 369 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 363 y 369 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 363 y 369 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-9",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_responsabilidad",
    "confusion_pair_id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Responsabilidades y garantías temporales. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Responsabilidades y garantías temporales",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Responsabilidad solidaria por obligaciones salariales (empresario principal en contratas)",
          "correct_value": "1 año",
          "category": "Plazo"
        },
        {
          "id": "2",
          "concept": "Tope máximo del anticipo de prestaciones (art. 167 TRLGSS)",
          "correct_value": "2,5 veces IPREM",
          "category": "Límite"
        }
      ]
    },
    "legal_basis": "Art. 42.2 ET y art. 167 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 42.2 ET (responsabilidad solidaria salarial) y Art. 167 TRLGSS (anticipo de prestaciones).",
    "why_correct": "El año siguiente es la responsabilidad solidaria por obligaciones salariales (art. 42.2 ET) y el límite de dos veces y media el IPREM es el tope del anticipo de prestaciones del art. 167 TRLGSS, no un límite de FOGASA (art. 33 ET).",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-numsort-10",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_beneficios_parto",
    "item_type": "number_sort",
    "stem": "Drill de Clasificación Numérica y Temporal: Excedencias y cómputo de cotizaciones efectivas. Asocia cada concepto con su magnitud jurídica exacta.",
    "number_sort_data": {
      "title": "Excedencias y cómputo de cotizaciones efectivas",
      "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
      "items": [
        {
          "id": "1",
          "concept": "Cuidado de hijo con cotización para todo",
          "correct_value": "1 año",
          "category": "Plazo"
        },
        {
          "id": "2",
          "concept": "Cuidado de hijo computable para jubilación/IP",
          "correct_value": "3 años",
          "category": "Plazo"
        },
        {
          "id": "3",
          "concept": "Cuidado de familiar con cotización computable",
          "correct_value": "1 año",
          "category": "Plazo"
        }
      ]
    },
    "legal_basis": "Art. 237 TRLGSS",
    "rule_statement": "Parámetros cuantitativos tasados por Art. 237 TRLGSS.",
    "why_correct": "Valores normativos estrictos fijados en Art. 237 TRLGSS.",
    "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
    "difficulty": 2,
    "cognitive_operations": [
      "numeric_precision",
      "response_inhibition"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará a los cinco años, contados desde el día siguiente al hecho causante.",
      "erroneous_span": "cinco años",
      "corrected_text": "un año",
      "explanation": "La caducidad es de 1 año (art. 54.1), no de 5 años (que corresponde a la prescripción del reconocimiento).",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "Art. 54.1 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 54.1 TRLGSS.",
    "why_correct": "La caducidad es de 1 año (art. 54.1), no de 5 años (que corresponde a la prescripción del reconocimiento).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 54.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_retroactividad",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "Los efectos económicos del reconocimiento inicial de las prestaciones se retrotraerán como máximo a los seis meses anteriores a la solicitud.",
      "erroneous_span": "seis meses",
      "corrected_text": "tres meses",
      "explanation": "La retroactividad máxima está tasada en 3 meses anteriores a la solicitud (art. 53.1 in fine).",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "Art. 53.1 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 53.1 TRLGSS.",
    "why_correct": "La retroactividad máxima está tasada en 3 meses anteriores a la solicitud (art. 53.1 in fine).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 53.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "En caso de fijos-discontinuos, a los días cotizados se les aplicará un coeficiente del 1,4 con límite mensual de días naturales.",
      "erroneous_span": "coeficiente del 1,4",
      "corrected_text": "coeficiente del 1,5",
      "explanation": "A los fijos-discontinuos se aplica el 1,5 con tope anual; el 1,4 corresponde a contratos <= 5 días.",
      "trap_type": "conceptual_merger"
    },
    "legal_basis": "Art. 247 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 247 TRLGSS.",
    "why_correct": "A los fijos-discontinuos se aplica el 1,5 con tope anual; el 1,4 corresponde a contratos <= 5 días.",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 247 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-4",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "Para el ejercicio 2026, las pensiones contributivas de la Seguridad Social se revalorizan con carácter general en un 4,5%.",
      "erroneous_span": "un 4,5%",
      "corrected_text": "un 2,7%",
      "explanation": "La revalorización fijada para 2026 según el IPC medio de referencia es del 2,7%.",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "Art. 58 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 58 TRLGSS.",
    "why_correct": "La revalorización fijada para 2026 según el IPC medio de referencia es del 2,7%.",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 58 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "El recargo de prestaciones por falta de medidas de seguridad es asegurable si se formaliza con una Mutua Colaboradora.",
      "erroneous_span": "es asegurable",
      "corrected_text": "es nulo de pleno derecho todo pacto para asegurarlo",
      "explanation": "El art. 164.2 TRLGSS declara expresamente nulo de pleno derecho todo aseguramiento o traslación del recargo.",
      "trap_type": "rule_exception_swap"
    },
    "legal_basis": "Art. 164.2 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 164.2 TRLGSS.",
    "why_correct": "El art. 164.2 TRLGSS declara expresamente nulo de pleno derecho todo aseguramiento o traslación del recargo.",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 164.2 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "La pensión de jubilación y la incapacidad permanente son imprescriptibles en el sistema de la Seguridad Social.",
      "erroneous_span": "y la incapacidad permanente",
      "corrected_text": "y las prestaciones por muerte y supervivencia",
      "explanation": "Solo la pensión de jubilación en su modalidad contributiva (art. 212 TRLGSS) y las prestaciones por muerte y supervivencia (art. 230 TRLGSS) son legalmente imprescriptibles; la incapacidad permanente prescribe a los cinco años (art. 53.1 TRLGSS).",
      "trap_type": "overbroad_statement"
    },
    "legal_basis": "Arts. 53.1, 212 y 230 TRLGSS",
    "rule_statement": "Corrección estricta amparada en los Arts. 53.1, 212 y 230 TRLGSS.",
    "why_correct": "Solo la pensión de jubilación contributiva y las prestaciones por muerte y supervivencia son legalmente imprescriptibles (arts. 212 y 230 TRLGSS).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con los Arts. 53.1, 212 y 230 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "En la escala de la LEC, el primer tramo de pensión que excede del SMI hasta el doble del SMI se embargará en un 50%.",
      "erroneous_span": "en un 50%",
      "corrected_text": "en un 30%",
      "explanation": "El primer tramo adicional hasta el doble del SMI se embarga en un 30% (art. 607.2 LEC).",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "Art. 607 LEC",
    "rule_statement": "Corrección estricta amparada en Art. 607 LEC.",
    "why_correct": "El primer tramo adicional hasta el doble del SMI se embarga en un 30% (art. 607.2 LEC).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 607 LEC.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_aplazamiento_corriente_incumplimiento",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "El plazo concedido al deudor de cuotas en la invitación al pago es de 15 días hábiles prorrogables.",
      "erroneous_span": "15 días hábiles prorrogables",
      "corrected_text": "30 días naturales improrrogables",
      "explanation": "El plazo legal tasado de invitación al pago es de 30 días naturales improrrogables (art. 47.1).",
      "trap_type": "temporal_confusion"
    },
    "legal_basis": "Art. 47.1 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 47.1 TRLGSS.",
    "why_correct": "El plazo legal tasado de invitación al pago es de 30 días naturales improrrogables (art. 47.1).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 47.1 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-9",
    "figure_status": "BOE_VERIFIED",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_importes_2026",
    "confusion_pair_id": "pair_complemento_minimos_pension_maxima",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "La cuantía máxima de las pensiones de la Seguridad Social para 2026 no puede superar los 4.500,00 euros mensuales.",
      "erroneous_span": "4.500,00 euros mensuales",
      "corrected_text": "3.359,60 euros mensuales",
      "explanation": "El tope legal mensual para 2026 asciende exactamente a 3.359,60 € (D.T. 39.ª TRLGSS).",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "D.T. 39.ª TRLGSS",
    "rule_statement": "Corrección estricta amparada en la D.T. 39.ª TRLGSS.",
    "why_correct": "El tope legal mensual para 2026 asciende exactamente a 3.359,60 € (D.T. 39.ª TRLGSS).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con la D.T. 39.ª TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-spot-10",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_beneficios_parto",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "spot_error",
    "stem": "Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
    "spot_error_data": {
      "full_statement": "El beneficio por parto simple otorga a la madre trabajadora 90 días naturales de cotización computable.",
      "erroneous_span": "90 días naturales",
      "corrected_text": "112 días",
      "explanation": "El parto simple acredita 112 días de cotización ficticia (art. 235 TRLGSS).",
      "trap_type": "numeric_substitution"
    },
    "legal_basis": "Art. 235 TRLGSS",
    "rule_statement": "Corrección estricta amparada en Art. 235 TRLGSS.",
    "why_correct": "El parto simple acredita 112 días de cotización ficticia (art. 235 TRLGSS).",
    "corrective_rule": "No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con Art. 235 TRLGSS.",
    "difficulty": 2,
    "cognitive_operations": [
      "response_inhibition",
      "exception_detection"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "El subsidio de incapacidad temporal derivado de contingencias comunes se rige en nuestro ordenamiento por:",
        "options": [
          {
            "id": "A",
            "text": "Automaticidad relativa condicionada inexcusablemente al alta del trabajador.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Automaticidad absoluta con anticipo obligatorio aun en supuestos de falta de alta.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Inexistencia total de automaticidad, debiendo el trabajador reclamar al juzgado.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Automaticidad condicionada exclusivamente al pago previo de cuotas patronales.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Cuál es el fundamento jurídico y causal que justifica la respuesta elegida en el Nivel 1?",
        "options": [
          {
            "id": "A",
            "text": "Porque el art. 167.2 TRLGSS exige estar en alta o asimilada para que la gestora anticipe la prestación por contingencias comunes.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Porque el Decreto de 1966 solo prevé la automaticidad absoluta para contingencias profesionales y desempleo.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Porque la Seguridad Social nunca asume anticipos de contingencias comunes en ningún caso.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Porque la Inspección de Trabajo debe calificar el descubierto previamente con acta de liquidación.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 167 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 167 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 167 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "Un pensionista solicita en 2026 el abono retroactivo de mensualidades devengadas hace 2 años y no percibidas por error propio. ¿Qué ocurrirá con su derecho?",
        "options": [
          {
            "id": "A",
            "text": "Las mensualidades devengadas con más de un año de antigüedad han caducado.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Cobrará los 2 años completos porque el reconocimiento no prescribe hasta los 5 años.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Ha prescrito la pensión completa y perderá el derecho hacia el futuro.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Se le abonarán exclusivamente las tres últimas mensualidades por retroactividad.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Por qué motivo legal se adopta dicha decisión resolutoria?",
        "options": [
          {
            "id": "A",
            "text": "Porque según el art. 54.2 TRLGSS el cobro de cada mensualidad periódica caduca al año de su respectivo vencimiento.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Porque la prescripción del art. 53 borra el reconocimiento inicial.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Porque el art. 53.1 solo permite retrotraer tres meses en solicitudes iniciales.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Porque la caducidad requiere intimación judicial expresa del deudor.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 54.2 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 54.2 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 54.2 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_recargo_medidas",
    "confusion_pair_id": "pair_recargo_aseguramiento_medidas",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "En un accidente de trabajo con infracción acreditada de medidas de seguridad, ¿puede la empresa derivar el recargo del 40% a su seguro de responsabilidad civil?",
        "options": [
          {
            "id": "A",
            "text": "No, es nulo de pleno derecho cualquier pacto o seguro que cubra dicho recargo.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Sí, siempre que la póliza se hubiera suscrito con anterioridad al siniestro.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Sí, pero únicamente hasta un límite del 30%, asumiendo la empresa el 10% restante.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Solo si la mutua colaboradora autoriza la subrogación aseguradora.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Cuál es la justificación teleológica y normativa de esta limitación?",
        "options": [
          {
            "id": "A",
            "text": "Porque el recargo tiene una función preventiva y sancionadora directa sobre el infractor (art. 164.2 TRLGSS).",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Porque las compañías de seguros privadas tienen prohibido operar en el ramo de accidentes de trabajo.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Porque el recargo de prestaciones solo se aplica cuando no existe seguro básico de accidentes.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Porque el importe del recargo se ingresa en el Tesoro Público y no va al trabajador.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 164 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 164 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 164 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "A un trabajador con contrato temporal de 4 días de duración se le computan las cotizaciones aplicando:",
        "options": [
          {
            "id": "A",
            "text": "El coeficiente del 1,4 por día trabajado con tope mensual de días naturales.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "El coeficiente del 1,5 por día cotizado con tope anual de días naturales.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Exclusivamente los 4 días naturales sin ningún multiplicador legal.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Un recargo de cotización del 40% sin cómputo de días adicionales.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Cuál es el precepto y ámbito que rige esta regla específica?",
        "options": [
          {
            "id": "A",
            "text": "El art. 249 bis TRLGSS para contratos temporales de duración igual o inferior a cinco días.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "El art. 247 TRLGSS aplicable al régimen de trabajadores fijos-discontinuos.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "La regla general de contratación a tiempo parcial del art. 248 TRLGSS.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "La Ley de Presupuestos Generales del Estado exclusivamente para personal interino.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 249 bis TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 249 bis TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 249 bis TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "Un perceptor de una pensión de jubilación percibe 1.200 € mensuales en 2026. Frente a una deuda civil ordinaria con un banco, ¿qué importe puede ser objeto de traba?",
        "options": [
          {
            "id": "A",
            "text": "Únicamente el porcentaje fijado por la escala de la LEC sobre el exceso que supere el SMI.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "La totalidad de los 1.200 € al tratarse de una deuda dineraria líquida y exigible.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "El 50% de la cuantía íntegra de la pensión por ser superior al IPREM.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Ninguna cantidad, pues todas las pensiones públicas son absolutamente inembargables.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿En qué principio y precepto legal se sustenta esta protección?",
        "options": [
          {
            "id": "A",
            "text": "En el art. 44 TRLGSS y art. 607 LEC, que declaran inembargable el salario o pensión que no exceda del SMI.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "En la exención de rentas de inserción del art. 7 de la Ley del IRPF.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "En el carácter indisponible del derecho a la Seguridad Social del art. 3 TRLGSS.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "En la prohibición constitucional de embargar bienes del patrimonio de la Seguridad Social.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 44 TRLGSS y Art. 607 LEC",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 44 TRLGSS y Art. 607 LEC.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 44 TRLGSS y Art. 607 LEC.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_aplazamiento_corriente_incumplimiento",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "Un autónomo en descubierto de cuotas solicita una pensión y recibe la invitación al pago. ¿De qué plazo dispone para abonarlas con plenos efectos?",
        "options": [
          {
            "id": "A",
            "text": "30 días naturales improrrogables desde la notificación.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "10 días hábiles conforme a la Ley 39/2015 de procedimiento común.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "3 meses equivalentes a la retroactividad de las prestaciones.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Hasta que finalice el año natural correspondiente al hecho causante.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Qué efecto jurídico produce el ingreso regular dentro de dicho plazo?",
        "options": [
          {
            "id": "A",
            "text": "Convalida la situación de estar al corriente y permite causar la prestación solicitada (art. 47 TRLGSS).",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Exonera al autónomo del pago de los recargos de mora e intereses devengados.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Determina la concesión automática de un aplazamiento a 5 años sin garantías.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Transforma la pensión en no contributiva a cargo del Estado.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 47 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 47 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 47 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-7",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_requisitos_generales",
    "confusion_pair_id": "pair_aplazamiento_corriente_incumplimiento",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "¿Está obligada la TGSS a conceder aplazamiento de las cuotas adeudadas por una empresa en crisis económica?",
        "options": [
          {
            "id": "A",
            "text": "No, la concesión de aplazamiento es una potestad discrecional reglada de la TGSS sujeta a garantías.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Sí, es un derecho subjetivo absoluto de todo empresario al corriente del año anterior.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Solo si la empresa cuenta con menos de 10 trabajadores y no adeuda salarios.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "No, los aplazamientos de cuotas de Seguridad Social están legalmente prohibidos.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Qué consecuencia acarrea el impago de un solo plazo en un aplazamiento concedido?",
        "options": [
          {
            "id": "A",
            "text": "Determina la caducidad del aplazamiento y la apertura inmediata de la vía de apremio por la totalidad (art. 23.4 TRLGSS).",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Otorga automáticamente una prórroga de gracia de 6 meses.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Únicamente devenga un interés de demora del 2% sobre la cuota impagada.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Requiere una nueva resolución motivada del Ministro de Inclusión.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 23 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 23 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 23 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-twotier-8",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_accidente_enfermedad",
    "confusion_pair_id": "pair_contingencia_comun_profesional",
    "item_type": "two_tier",
    "stem": "Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
    "two_tier_data": {
      "tier1": {
        "prompt": "Un trabajador sufre un infarto mientras se encontraba prestando servicios en su puesto habitual de trabajo. Legalmente se considera:",
        "options": [
          {
            "id": "A",
            "text": "Presuntamente accidente de trabajo en virtud de la presunción legal del art. 156.3 TRLGSS.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Enfermedad común en todo caso, por tratarse de una patología de origen cardiovascular.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "Accidente no laboral, salvo que el convenio colectivo lo califique de profesional.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Accidente in itinere al haberse manifestado durante la jornada laboral.",
            "is_correct": false
          }
        ]
      },
      "tier2": {
        "prompt": "¿Cuál es el alcance probatorio de la presunción legalmente establecida?",
        "options": [
          {
            "id": "A",
            "text": "Es una presunción iuris tantum que solo puede desvirtuarse probando la falta de vinculación lesiva laboral.",
            "is_correct": true
          },
          {
            "id": "B",
            "text": "Es una presunción iuris et de iure que no admite prueba en contrario bajo ningún concepto.",
            "is_correct": false
          },
          {
            "id": "C",
            "text": "No tiene valor probatorio hasta que no recaiga sentencia firme del Juzgado de lo Social.",
            "is_correct": false
          },
          {
            "id": "D",
            "text": "Depende de que el trabajador no hubiera solicitado una baja voluntaria previa.",
            "is_correct": false
          }
        ]
      }
    },
    "legal_basis": "Art. 156.3 TRLGSS",
    "rule_statement": "Evaluación en dos niveles fundamentada en Art. 156.3 TRLGSS.",
    "why_correct": "Respuesta y justificación causal plenamente coherentes con Art. 156.3 TRLGSS.",
    "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
    "difficulty": 3,
    "cognitive_operations": [
      "calibrated_decision",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_intangibilidad_embargo_irpf",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Inembargabilidad, Embargabilidad y Tributación en IRPF.",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_embargo",
        "label": "Ingreso percibido de la Seguridad Social",
        "rule_text": "Análisis del régimen de inembargabilidad frente a terceros acreedores y exención en IRPF.",
        "legal_basis": "Art. 44 TRLGSS",
        "children": [
          {
            "id": "node_smi",
            "label": "¿Cuantía <= Salario Mínimo Interprofesional (SMI)?",
            "rule_text": "Inembargable al 100% de forma absoluta, salvo deudas de alimentos (art. 608 LEC).",
            "legal_basis": "Art. 44 TRLGSS",
            "children": []
          },
          {
            "id": "node_exceso",
            "label": "¿Cuantía > SMI?",
            "rule_text": "El exceso es embargable según la escala del art. 607 de la LEC (30% a 90%).",
            "legal_basis": "Art. 607 LEC",
            "children": [
              {
                "id": "leaf_exenta_irpf",
                "label": "¿Es pensión por IP absoluta o gran invalidez?",
                "rule_text": "Exenta íntegramente de tributación en el IRPF.",
                "legal_basis": "Art. 7 Ley 35/2006",
                "children": []
              },
              {
                "id": "leaf_tributa_irpf",
                "label": "¿Es pensión de jubilación, viudedad o IP total?",
                "rule_text": "Sujeta a tributación en el IRPF como rendimiento del trabajo.",
                "legal_basis": "Art. 17 Ley 35/2006",
                "children": []
              }
            ]
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Pensión de IP absoluta de 1.100 € (inferior al SMI).",
          "correct_leaf_id": "node_smi",
          "explanation": "Al no superar el SMI, es absolutamente inembargable."
        },
        {
          "scenario": "Pensión de jubilación de 2.000 € frente a embargo bancario.",
          "correct_leaf_id": "leaf_tributa_irpf",
          "explanation": "Supera el SMI (embargable en el exceso) y tributa en IRPF."
        },
        {
          "scenario": "Pensión de gran invalidez de 3.000 €.",
          "correct_leaf_id": "leaf_exenta_irpf",
          "explanation": "Supera el SMI en embargo pero está totalmente exenta de IRPF."
        }
      ]
    },
    "legal_basis": "Art. 44 TRLGSS, Art. 607 LEC y Art. 7 Ley 35/2006",
    "rule_statement": "Estructura condicional jerarquizada en Art. 44 TRLGSS, Art. 607 LEC y Art. 7 Ley 35/2006.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Art. 44 TRLGSS, Art. 607 LEC y Art. 7 Ley 35/2006.",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Principio de Automaticidad (Absoluta vs Relativa).",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_auto",
        "label": "Contingencia causante de la prestación",
        "rule_text": "Determinación del principio de automaticidad según la naturaleza de la contingencia.",
        "legal_basis": "Art. 167 TRLGSS",
        "children": [
          {
            "id": "leaf_auto_absoluta",
            "label": "Contingencia profesional (AT / EP) o desempleo",
            "rule_text": "Automaticidad absoluta: se anticipa la prestación incluso con falta absoluta de alta.",
            "legal_basis": "Decreto 21 abril 1966",
            "children": []
          },
          {
            "id": "leaf_auto_relativa",
            "label": "Contingencia común (enfermedad común / accidente no laboral)",
            "rule_text": "Automaticidad relativa: exige alta o situación asimilada al alta del trabajador.",
            "legal_basis": "Art. 167 TRLGSS",
            "children": []
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Trabajador sin dar de alta sufre caída mortal en andamio.",
          "correct_leaf_id": "leaf_auto_absoluta",
          "explanation": "Accidente de trabajo: opera la automaticidad absoluta aunque no estuviera de alta."
        },
        {
          "scenario": "Trabajador en alta pero con empresa en descubierto sufre apendicitis.",
          "correct_leaf_id": "leaf_auto_relativa",
          "explanation": "Contingencia común con alta real: opera la automaticidad relativa con anticipo."
        }
      ]
    },
    "legal_basis": "Decreto 21 abril 1966 y Art. 167 TRLGSS",
    "rule_statement": "Estructura condicional jerarquizada en Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_responsabilidad",
    "confusion_pair_id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Responsabilidad empresarial por contratas y cesión.",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_resp",
        "label": "Infracción u obligación de Seguridad Social en subcontratación",
        "rule_text": "Clasificación del régimen de responsabilidad exigible al empresario principal.",
        "legal_basis": "Art. 42 ET",
        "children": [
          {
            "id": "leaf_propia_actividad",
            "label": "Contrata de obras o servicios de la propia actividad",
            "rule_text": "Responsabilidad solidaria durante el año siguiente a la finalización del encargo.",
            "legal_basis": "Art. 42.2 ET",
            "children": []
          },
          {
            "id": "leaf_cesion_ilegal",
            "label": "Cesión ilegal de trabajadores (art. 43 ET)",
            "rule_text": "Responsabilidad solidaria indefinida entre cedente y cesionario.",
            "legal_basis": "Art. 43 ET",
            "children": []
          },
          {
            "id": "leaf_actividad_no_propia",
            "label": "Contrata de actividad no propia sin certificación negativa",
            "rule_text": "Responsabilidad subsidiaria previa insolvencia del contratista.",
            "legal_basis": "Art. 168 TRLGSS",
            "children": []
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Constructora subcontrata el encofrado con deudas en la TGSS.",
          "correct_leaf_id": "leaf_propia_actividad",
          "explanation": "Propia actividad: responsabilidad solidaria durante 1 año."
        },
        {
          "scenario": "Empresa pantalla suministra personal sin estructura productiva propia.",
          "correct_leaf_id": "leaf_cesion_ilegal",
          "explanation": "Cesión ilegal: responsabilidad solidaria entre ambas empresas."
        }
      ]
    },
    "legal_basis": "Art. 42 y 43 ET, Art. 168 TRLGSS",
    "rule_statement": "Estructura condicional jerarquizada en Art. 42 y 43 ET, Art. 168 TRLGSS.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Art. 42 y 43 ET, Art. 168 TRLGSS.",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_caducidad",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Prescripción vs Caducidad según el objeto reclamado.",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_extincion",
        "label": "Objeto temporal de la pretensión",
        "rule_text": "Diferenciación entre el reconocimiento inicial y la efectividad del cobro.",
        "legal_basis": "Art. 53 y 54 TRLGSS",
        "children": [
          {
            "id": "leaf_prescripcion_general",
            "label": "Reconocimiento inicial de prestación temporal",
            "rule_text": "Prescripción a los 5 años desde el hecho causante (retroactividad 3 meses).",
            "legal_basis": "Art. 53.1 TRLGSS",
            "children": []
          },
          {
            "id": "leaf_imprescriptible",
            "label": "Reconocimiento de la pensión de jubilación contributiva",
            "rule_text": "Imprescriptible (no prescribe nunca), con efectos desde los tres meses anteriores a la solicitud. La incapacidad permanente, en cambio, prescribe a los 5 años.",
            "legal_basis": "Art. 212 TRLGSS",
            "children": []
          },
          {
            "id": "leaf_caducidad_percibo",
            "label": "Percibo de mensualidad ya reconocida",
            "rule_text": "Caducidad al año de su vencimiento respectivo.",
            "legal_basis": "Art. 54.2 TRLGSS",
            "children": []
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Solicitud de pensión de jubilación 7 años tras cumplir los 65 años.",
          "correct_leaf_id": "leaf_imprescriptible",
          "explanation": "La pensión de jubilación contributiva es imprescriptible (art. 212 TRLGSS)."
        },
        {
          "scenario": "Solicitud de pensión de incapacidad permanente 7 años después del hecho causante.",
          "correct_leaf_id": "leaf_prescripcion_general",
          "explanation": "La incapacidad permanente no es imprescriptible: ha superado los 5 años del art. 53.1 TRLGSS."
        },
        {
          "scenario": "Reclamación de subsidio de IT denegado hace 6 años.",
          "correct_leaf_id": "leaf_prescripcion_general",
          "explanation": "Supera el plazo de 5 años: prescrito."
        }
      ]
    },
    "legal_basis": "Arts. 53, 54 y 212 TRLGSS",
    "rule_statement": "Estructura condicional jerarquizada en Art. 53 y 54 TRLGSS, con la excepción de imprescriptibilidad del Art. 212 TRLGSS.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Art. 53 y 54 TRLGSS; la impresscriptibilidad solo alcanza a la jubilación contributiva (Art. 212 TRLGSS) y a las prestaciones por muerte y supervivencia (Art. 230 TRLGSS).",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Coeficientes de cotización y cómputo de días.",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_coef",
        "label": "Modalidad de contratación laboral",
        "rule_text": "Aplicación de multiplicadores protectores según modalidad contractual.",
        "legal_basis": "Art. 247 TRLGSS",
        "children": [
          {
            "id": "leaf_fijo_disc",
            "label": "Contrato Fijo-Discontinuo",
            "rule_text": "Coeficiente 1,5 con tope anual de días naturales.",
            "legal_basis": "Art. 247 TRLGSS",
            "children": []
          },
          {
            "id": "leaf_temporal_corto",
            "label": "Contrato temporal <= 5 días naturales",
            "rule_text": "Coeficiente 1,4 con tope mensual de días naturales.",
            "legal_basis": "Art. 249 bis TRLGSS",
            "children": []
          },
          {
            "id": "leaf_ordinario",
            "label": "Contrato indefinido ordinario a tiempo completo",
            "rule_text": "Cómputo estricto de días naturales trabajados (1 a 1).",
            "legal_basis": "Art. 165 TRLGSS",
            "children": []
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Trabajador fijo-discontinuo con 200 días de alta en la campaña.",
          "correct_leaf_id": "leaf_fijo_disc",
          "explanation": "Se aplica coeficiente 1,5 (200 x 1,5 = 300 días)."
        },
        {
          "scenario": "Camarero contratado para evento de 3 días de duración.",
          "correct_leaf_id": "leaf_temporal_corto",
          "explanation": "Contrato <= 5 días: coeficiente 1,4 (3 x 1,4 = 4,2 días)."
        }
      ]
    },
    "legal_basis": "Art. 247 y 249 bis TRLGSS",
    "rule_statement": "Estructura condicional jerarquizada en Art. 247 y 249 bis TRLGSS.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Art. 247 y 249 bis TRLGSS.",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-tree-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_carencia_cotizacion",
    "confusion_pair_id": "pair_carencia_cotizacion",
    "item_type": "exception_tree",
    "stem": "Árbol de Excepciones y Enrutamiento Normativo: Árbol de Decisión: Período de carencia en el subsidio por nacimiento.",
    "exception_tree_data": {
      "root_rule": {
        "id": "root_nacimiento",
        "label": "Edad del progenitor en la fecha del parto",
        "rule_text": "Graduación de carencia exigida para nacimiento y cuidado de menor.",
        "legal_basis": "Art. 178 TRLGSS",
        "children": [
          {
            "id": "leaf_menor_21",
            "label": "Menor de 21 años",
            "rule_text": "No se exige período previo de cotización (carencia cero).",
            "legal_basis": "Art. 178.1 TRLGSS",
            "children": []
          },
          {
            "id": "leaf_21_a_26",
            "label": "De 21 a menos de 26 años cumplidos",
            "rule_text": "90 días en los 7 años anteriores o 180 días en toda su vida laboral.",
            "legal_basis": "Art. 178.2 TRLGSS",
            "children": []
          },
          {
            "id": "leaf_mayor_26",
            "label": "26 años o más",
            "rule_text": "180 días en los 7 años anteriores o 360 días a lo largo de la vida laboral.",
            "legal_basis": "Art. 178.3 TRLGSS",
            "children": []
          }
        ]
      },
      "test_cases": [
        {
          "scenario": "Madre de 19 años da a luz sin haber cotizado nunca.",
          "correct_leaf_id": "leaf_menor_21",
          "explanation": "Menor de 21 años: carencia cero."
        },
        {
          "scenario": "Padre de 24 años acredita 100 días en los últimos 3 años.",
          "correct_leaf_id": "leaf_21_a_26",
          "explanation": "Entre 21 y 26 años: exige 90 días en 7 años (cumple)."
        },
        {
          "scenario": "Madre de 30 años acredita 120 días cotizados.",
          "correct_leaf_id": "leaf_mayor_26",
          "explanation": "Mayor de 26 años: exige 180 días en 7 años (no cumple)."
        }
      ]
    },
    "legal_basis": "Art. 178 TRLGSS",
    "rule_statement": "Estructura condicional jerarquizada en Art. 178 TRLGSS.",
    "why_correct": "Enrutamiento estricto siguiendo las ramas de regla y excepción de Art. 178 TRLGSS.",
    "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
    "difficulty": 3,
    "cognitive_operations": [
      "exception_detection",
      "application"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-1",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_coeficientes",
    "confusion_pair_id": "pair_fijo_discontinuo_contrato_corto",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Cómputo de días en fijos-discontinuos y contratos cortos.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Trabajador fijo-discontinuo acredita 200 días de trabajo efectivo en alta durante el año natural.",
        "question": "¿Cuántos días de cotización se le computan para acreditar carencia de pensión de jubilación?",
        "correct_outcome": "300 días de cotización (200 x 1,5 = 300), al no superar el límite de días naturales del año (365 días).",
        "legal_rule": "Art. 247 TRLGSS: multiplicador 1,5 con tope anual de días naturales."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "El trabajador es contratado bajo un contrato temporal de 4 días de duración en lugar de fijo-discontinuo.",
          "new_scenario": "Trabajador con contrato temporal de 4 días naturales en un mes de 30 días.",
          "outcome_changes": true,
          "correct_outcome": "5,6 días de cotización (4 x 1,4 = 5,6), con tope de los días naturales del mes.",
          "explanation": "Pasa a regirse por el art. 249 bis TRLGSS: multiplicador 1,4 y tope mensual."
        },
        {
          "id": "v2",
          "changed_fact": "El trabajador fijo-discontinuo acredita 260 días de trabajo en el año natural en lugar de 200.",
          "new_scenario": "Trabajador fijo-discontinuo acredita 260 días cotizados en el año.",
          "outcome_changes": true,
          "correct_outcome": "365 días de cotización (tope de días naturales del año), ya que 260 x 1,5 = 390 días.",
          "explanation": "El art. 247 TRLGSS establece el límite máximo infranqueable de los días naturales del año."
        },
        {
          "id": "v3",
          "changed_fact": "El contrato temporal dura 6 días naturales en lugar de 4 días.",
          "new_scenario": "Trabajador contratado temporalmente por 6 días naturales continuados.",
          "outcome_changes": true,
          "correct_outcome": "6 días de cotización estrictos, sin multiplicador del 1,4.",
          "explanation": "El coeficiente 1,4 solo es aplicable si la duración es igual o inferior a 5 días (art. 249 bis)."
        },
        {
          "id": "v4",
          "changed_fact": "El contrato es a tiempo parcial indefinido con 200 días trabajados al 50% de la jornada.",
          "new_scenario": "Trabajador a tiempo parcial indefinido que realiza media jornada durante 200 días.",
          "outcome_changes": true,
          "correct_outcome": "No se aplica 1,5 ni 1,4; se computan las horas trabajadas según las reglas del art. 248 TRLGSS.",
          "explanation": "Los contratos a tiempo parcial ordinarios no fijos-discontinuos siguen el régimen del art. 248 TRLGSS."
        }
      ]
    },
    "legal_basis": "Art. 247 y 249 bis TRLGSS",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en Art. 247 y 249 bis TRLGSS.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de Art. 247 y 249 bis TRLGSS.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-2",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_prescripcion_caducidad",
    "confusion_pair_id": "pair_prescripcion_retroactividad",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Prescripción y efectos económicos retroactivos.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Hecho causante ocurrido el 1 de enero de 2025. Se presenta la solicitud formal de pensión de viudedad el 1 de julio de 2025 (6 meses después).",
        "question": "¿Desde qué fecha produce efectos económicos el reconocimiento de la pensión?",
        "correct_outcome": "Desde el 1 de abril de 2025 (tres meses anteriores a la fecha de presentación de la solicitud).",
        "legal_rule": "Art. 53.1 TRLGSS: retroactividad económica máxima de 3 meses."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "La solicitud se presenta el 1 de febrero de 2025 (1 mes tras el hecho causante).",
          "new_scenario": "Solicitud presentada dentro del mes siguiente al hecho causante.",
          "outcome_changes": true,
          "correct_outcome": "Produce efectos económicos desde el día siguiente al hecho causante (2 de enero de 2025).",
          "explanation": "Al haberse solicitado dentro de los 3 meses posteriores al hecho causante, los efectos alcanzan la fecha originaria."
        },
        {
          "id": "v2",
          "changed_fact": "La prestación solicitada es el subsidio por incapacidad temporal en lugar de la pensión de viudedad.",
          "new_scenario": "Solicitud de subsidio por incapacidad temporal cursada transcurridos 6 años desde el hecho causante.",
          "outcome_changes": true,
          "correct_outcome": "El derecho al reconocimiento ha prescrito por haber transcurrido más de cinco años (art. 53.1).",
          "explanation": "El subsidio por incapacidad temporal sí prescribe a los 5 años; la imprescriptibilidad de las prestaciones por muerte y supervivencia (art. 230 TRLGSS) no se extiende a los subsidios."
        },
        {
          "id": "v3",
          "changed_fact": "La pensión solicitada 6 años después es de jubilación contributiva en lugar de viudedad.",
          "new_scenario": "Solicitud de pensión de jubilación contributiva formulada 6 años después de cumplir la edad y cesar en el trabajo.",
          "outcome_changes": true,
          "correct_outcome": "El derecho se reconoce por ser imprescriptible (art. 212 TRLGSS), con retroactividad económica de 3 meses.",
          "explanation": "La pensión de jubilación contributiva no prescribe nunca, pero sus efectos económicos solo viajan 3 meses hacia atrás."
        }
      ]
    },
    "legal_basis": "Arts. 53.1, 212 y 230 TRLGSS",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en los Arts. 53.1, 212 y 230 TRLGSS.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de los Arts. 53.1, 212 y 230 TRLGSS.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-3",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_automaticidad",
    "confusion_pair_id": "pair_automaticidad_absoluta_relativa",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Automaticidad en accidente vs enfermedad común.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Trabajador sin afiliar ni dar de alta por su empresa sufre accidente en el centro de trabajo.",
        "question": "¿Tiene derecho al percibo de las prestaciones sanitarias y económicas de la Seguridad Social?",
        "correct_outcome": "Sí, opera la automaticidad absoluta con anticipo íntegro por la Mutua o la Entidad Gestora.",
        "legal_rule": "Decreto 21 abril 1966: automaticidad absoluta en contingencias profesionales aun sin alta."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "La contingencia no es accidente de trabajo sino infarto fuera del centro y tiempo de trabajo.",
          "new_scenario": "Trabajador sin dar de alta sufre enfermedad común en su domicilio durante el fin de semana.",
          "outcome_changes": true,
          "correct_outcome": "No tiene derecho a la prestación por contingencia común por falta de alta previa (no opera automaticidad relativa).",
          "explanation": "En contingencias comunes, el art. 167.2 TRLGSS exige estar en alta o asimilada para activar el anticipo."
        },
        {
          "id": "v2",
          "changed_fact": "El trabajador sí estaba dado de alta reglamentariamente, pero la empresa adeudaba todas las cuotas.",
          "new_scenario": "Trabajador dado de alta debidamente, con empresa en descubierto culpable de cotizaciones.",
          "outcome_changes": true,
          "correct_outcome": "Sí tiene derecho a la prestación de enfermedad común por el principio de automaticidad relativa.",
          "explanation": "Al existir alta previa, la entidad gestora anticipa la prestación y se subroga frente al empresario deudor."
        }
      ]
    },
    "legal_basis": "Decreto 21 abril 1966 y Art. 167 TRLGSS",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de Decreto 21 abril 1966 y Art. 167 TRLGSS.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-4",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_intangibilidad_embargo",
    "confusion_pair_id": "pair_inembargabilidad_smi_escala_lec",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Inembargabilidad y escala de retenciones.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Pensión mensual de jubilación de 1.000 € (inferior al SMI fijado de referencia).",
        "question": "¿Qué importe puede embargar judicialmente un acreedor por un crédito impagado?",
        "correct_outcome": "0 € (cero euros), por ser absolutamente inembargable en virtud del art. 44 TRLGSS y art. 607.1 LEC.",
        "legal_rule": "Inembargabilidad absoluta del sueldo o pensión que no exceda del SMI."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "El título judicial ejecutivo es una condena por impago de pensión de alimentos al cónyuge.",
          "new_scenario": "Pensión de 1.000 € frente a ejecución por alimentos debidos a los hijos menores.",
          "outcome_changes": true,
          "correct_outcome": "El tribunal fija la cuantía embargable sin quedar limitado por el SMI (art. 608 LEC).",
          "explanation": "El art. 608 LEC exceptúa expresamente el blindaje del SMI cuando la deuda derive de alimentos legales."
        },
        {
          "id": "v2",
          "changed_fact": "La pensión mensual percibida asciende a 2.000 € frente a deuda ordinaria mercantil.",
          "new_scenario": "Pensión de 2.000 € con SMI de referencia de 1.134 €.",
          "outcome_changes": true,
          "correct_outcome": "Se embarga el 30% del exceso entre 1.134 € y 2.000 € (866 € x 30% = 259,80 €).",
          "explanation": "La escala de la LEC solo grava el tramo sobrante por encima del SMI al 30% en el primer múltiplo."
        }
      ]
    },
    "legal_basis": "Art. 44 TRLGSS y Art. 607 LEC",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en Art. 44 TRLGSS y Art. 607 LEC.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de Art. 44 TRLGSS y Art. 607 LEC.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-5",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_carencia_cotizacion",
    "confusion_pair_id": "pair_cotizacion_fuera_plazo_descubiertos",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Ingreso extemporáneo de cuotas y carencia.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Un trabajador autónomo en descubierto abona voluntariamente sus cuotas impagadas con recargo el 10 de enero de 2026. Sufre un ictus cerebral el 15 de febrero de 2026.",
        "question": "¿Computan dichas cuotas abonadas fuera de plazo para acreditar la carencia de la pensión de incapacidad permanente?",
        "correct_outcome": "Sí, producen plenos efectos porque el ingreso extemporáneo tuvo lugar antes de sobrevenir el hecho causante.",
        "legal_rule": "Art. 165.2 TRLGSS: pago extemporáneo previo al hecho causante convalida la carencia."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "El abono con recargo se realiza el 20 de febrero de 2026, cinco días después de sufrir el ictus.",
          "new_scenario": "Ingreso de las cuotas con recargo efectuado con posterioridad a la fecha del hecho causante.",
          "outcome_changes": true,
          "correct_outcome": "No computan para causar la prestación; el pago posterior al hecho causante no convalida la carencia.",
          "explanation": "El art. 165.3 TRLGSS prohíbe los efectos retroactivos de pagos posteriores para lucrar prestaciones del sistema."
        },
        {
          "id": "v2",
          "changed_fact": "La incapacidad no deriva de ictus sino de un accidente de tráfico ocurrido en el trabajo.",
          "new_scenario": "El hecho causante es un accidente de trabajo y las cuotas continúan impagadas.",
          "outcome_changes": true,
          "correct_outcome": "Se reconoce la pensión íntegra de incapacidad con independencia del pago de cuotas (carencia cero y automaticidad).",
          "explanation": "Las prestaciones derivadas de accidente de trabajo no exigen período previo de cotización (art. 172 TRLGSS)."
        }
      ]
    },
    "legal_basis": "Art. 165 TRLGSS",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en Art. 165 TRLGSS.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de Art. 165 TRLGSS.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "item-variant-6",
    "topic_id": "topic_seguridad_social_tema_7",
    "cluster_id": "cluster_responsabilidad",
    "confusion_pair_id": "pair_responsabilidad_directa_solidaria_subsidiaria",
    "item_type": "fact_variant",
    "stem": "Laboratorio de Variantes Fácticas: Laboratorio de Variantes Fácticas: Responsabilidad solidaria en subcontratación de obras.",
    "fact_variant_data": {
      "base_case": {
        "scenario": "Promotora constructora contrata con un subcontratista la estructura de un edificio residencial (propia actividad). La obra concluye el 1 de junio de 2025. El subcontratista deja descubiertos en la TGSS.",
        "question": "¿Hasta qué fecha responde solidariamente la constructora principal de dichas cuotas impagadas?",
        "correct_outcome": "Hasta el 1 de junio de 2026 (durante el año siguiente a la terminación del encargo).",
        "legal_rule": "Art. 42.2 Estatuto de los Trabajadores: responsabilidad solidaria de 1 año en propia actividad."
      },
      "variants": [
        {
          "id": "v1",
          "changed_fact": "La constructora recabó previamente certificación negativa de descubiertos ante la TGSS.",
          "new_scenario": "La empresa principal obtuvo de la TGSS certificación negativa de descubiertos dentro de plazo reglamentario.",
          "outcome_changes": true,
          "correct_outcome": "Queda exonerada de responsabilidad solidaria por las deudas devengadas en el período certificado.",
          "explanation": "El art. 42.1 ET exonera al comitente que solicita y obtiene en plazo certificación negativa de la TGSS."
        },
        {
          "id": "v2",
          "changed_fact": "La reclamación de cuotas se notifica a la principal el 1 de diciembre de 2026 (18 meses tras la obra).",
          "new_scenario": "Reclamación de deuda notificada transcurrido un año desde la finalización de la contrata.",
          "outcome_changes": true,
          "correct_outcome": "Ha decaído la responsabilidad solidaria por haber expirado el plazo de un año del art. 42 ET.",
          "explanation": "Transcurrido el año de garantía solidaria, la TGSS solo puede dirigirse contra el deudor principal o en vía subsidiaria."
        }
      ]
    },
    "legal_basis": "Art. 42 ET y Art. 168 TRLGSS",
    "rule_statement": "Análisis de sensibilidad fáctica fundado en Art. 42 ET y Art. 168 TRLGSS.",
    "why_correct": "Variación causal de supuestos de hecho conforme a la hermenéutica de Art. 42 ET y Art. 168 TRLGSS.",
    "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
    "difficulty": 3,
    "cognitive_operations": [
      "application",
      "micro_discrimination"
    ],
    "status": "validated",
    "source": "manual",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  }
];

const canonicalCorrectOptionPositionCycle = [0, 1, 3, 2, 0, 2, 1, 3];
const standardMcqItemTypes = new Set<Item['item_type']>(['cover_and_generate_mcq', 'pretest_item']);

function rebalanceCanonicalMcqOptions(items: Item[]): Item[] {
  let mcqIndex = 0;

  return items.map((item) => {
    if (!standardMcqItemTypes.has(item.item_type) || !item.options?.length) return item;

    const targetPosition = canonicalCorrectOptionPositionCycle[mcqIndex % canonicalCorrectOptionPositionCycle.length];
    mcqIndex++;
    const correctPosition = item.options.findIndex((option) => option.is_correct);
    if (correctPosition < 0 || targetPosition >= item.options.length || correctPosition === targetPosition) {
      return item;
    }

    const options = [...item.options];
    const [correctOption] = options.splice(correctPosition, 1);
    options.splice(targetPosition, 0, correctOption);
    return { ...item, options };
  });
}

export const seedItems: Item[] = rebalanceCanonicalMcqOptions([
  ...seedItemsTema7,
  ...seedItemsTema1,
  ...seedItemsTema3,
  ...seedItemsTema8,
]);
