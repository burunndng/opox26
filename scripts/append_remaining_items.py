import sys
import os
import json

sys.path.append(os.path.dirname(__file__))
from generate_seed_data import clusters, pairs, atoms
from append_more_items import all_items

print(f"Current items count: {len(all_items)} (25 MCQs + 20 Clozes)")

# 3. Generate 15 Contrast Card items
contrast_specs = [
    ("item-contrast-1", "Prescripción vs Caducidad de prestaciones", "pair_prescripcion_caducidad", "cluster_prescripcion_caducidad", "Art. 53 y 54 TRLGSS", [
        {"criterion": "Objeto sobre el que recae", "concept_a_val": "Derecho al RECONOCIMIENTO de la prestación", "concept_b_val": "Derecho al PERCIBO de lo ya reconocido", "trap_note": "Confundir reconocimiento con cobro."},
        {"criterion": "Plazo legal extintivo", "concept_a_val": "5 años con carácter general", "concept_b_val": "1 año (tanto alzado o periódicas)", "trap_note": "Invertir 5 años y 1 año."},
        {"criterion": "Dies a quo de cómputo", "concept_a_val": "Día siguiente al hecho causante", "concept_b_val": "Notificación concesión (alzado) o vencimiento (periódica)", "trap_note": "Contar caducidad desde el hecho causante."},
        {"criterion": "Interrupción del plazo", "concept_a_val": "Se interrumpe por reclamación judicial o extrajudicial", "concept_b_val": "La caducidad se aprecia de oficio y no admite interrupción", "trap_note": "Creer que la caducidad admite interrupción ordinaria."}
    ]),
    ("item-contrast-2", "Prescripción vs Retroactividad económica", "pair_prescripcion_retroactividad", "cluster_prescripcion_caducidad", "Art. 53.1 TRLGSS", [
        {"criterion": "Finalidad jurídica", "concept_a_val": "Plazo para poder solicitar el reconocimiento (5 años)", "concept_b_val": "Límite temporal de efectos económicos pasados (3 meses)", "trap_note": "Creer que se cobra todo el quinquenio pasado."},
        {"criterion": "Dies a quo", "concept_a_val": "Día siguiente al hecho causante", "concept_b_val": "Fecha de presentación de la solicitud", "trap_note": "Contar la retroactividad desde el hecho causante."}
    ]),
    ("item-contrast-3", "Caducidad de tanto alzado vs Caducidad de periódicas", "pair_caducidad_alzado_periodicas", "cluster_prescripcion_caducidad", "Art. 54 TRLGSS", [
        {"criterion": "Tipo de abono", "concept_a_val": "Pago único y por una sola vez", "concept_b_val": "Devengo mensual sucesivo", "trap_note": "Equiparar indemnización única con nómina periódica."},
        {"criterion": "Dies a quo del año de caducidad", "concept_a_val": "Día siguiente a la notificación de la concesión", "concept_b_val": "Vencimiento respectivo de cada mensualidad", "trap_note": "Fijar el vencimiento en prestaciones a tanto alzado."}
    ]),
    ("item-contrast-4", "Automaticidad absoluta vs Automaticidad relativa", "pair_automaticidad_absoluta_relativa", "cluster_automaticidad", "Decreto 21 abril 1966 y Art. 167 TRLGSS", [
        {"criterion": "Contingencias amparadas", "concept_a_val": "Accidente de trabajo, enfermedad profesional y desempleo", "concept_b_val": "Contingencias comunes (enfermedad común y accidente no laboral)", "trap_note": "Creer que rige la absoluta en cualquier contingencia común."},
        {"criterion": "Exigencia de alta previa del trabajador", "concept_a_val": "NO se exige; opera incluso sin afiliación ni alta previa", "concept_b_val": "SÍ se exige inexcusablemente encontrarse en alta o asimilada", "trap_note": "Conceder anticipo de contingencia común sin alta."}
    ]),
    ("item-contrast-5", "Coeficiente 1,5 (Fijo-discontinuo) vs Coeficiente 1,4 (Contratos <= 5 días)", "pair_fijo_discontinuo_contrato_corto", "cluster_coeficientes", "Art. 247 y 249 bis TRLGSS", [
        {"criterion": "Coeficiente multiplicador", "concept_a_val": "1,5 a los días cotizados", "concept_b_val": "1,4 a los días trabajados", "trap_note": "Intercambiar los multiplicadores 1,4 y 1,5."},
        {"criterion": "Tope temporal de cómputo", "concept_a_val": "Días naturales del año (máx 365/366)", "concept_b_val": "Días naturales del mes de liquidación", "trap_note": "Aplicar tope anual a contratos cortos de 5 días."}
    ]),
    ("item-contrast-6", "Contrato corto (<= 5 días) vs Contrato a tiempo parcial estándar", "pair_contrato_corto_tiempo_parcial", "cluster_coeficientes", "Art. 248 y 249 bis TRLGSS", [
        {"criterion": "Aplicación del multiplicador 1,4", "concept_a_val": "SÍ, de forma expresa para contratos <= 5 días", "concept_b_val": "NO, computa por horas efectivamente trabajadas/jornada legal", "trap_note": "Aplicar 1,4 al tiempo parcial indefinido."},
        {"criterion": "Duración contractual", "concept_a_val": "Temporal igual o inferior a 5 días", "concept_b_val": "Cualquier duración (indefinida o temporal > 5 días)", "trap_note": "Olvidar el umbral estricto de 5 días."}
    ]),
    ("item-contrast-7", "Inembargabilidad de pensión vs Exención tributaria en IRPF", "pair_intangibilidad_embargo_irpf", "cluster_intangibilidad_embargo", "Art. 44 TRLGSS y Art. 7 Ley 35/2006", [
        {"criterion": "Ámbito de protección", "concept_a_val": "Frente a acreedores civiles o ejecutivos (límite SMI)", "concept_b_val": "Frente a la Hacienda Pública (deber tributario)", "trap_note": "Creer que lo inembargable no tributa en IRPF."},
        {"criterion": "Beneficiarios", "concept_a_val": "Todas las pensiones hasta la cuantía del SMI", "concept_b_val": "Exclusivamente IP absoluta y gran invalidez", "trap_note": "Creer que la jubilación mínima está exenta de IRPF."}
    ]),
    ("item-contrast-8", "Recargo por falta de medidas vs Responsabilidad por falta de aseguramiento", "pair_recargo_aseguramiento_medidas", "cluster_recargo_medidas", "Art. 164 y 167 TRLGSS", [
        {"criterion": "Asegurabilidad", "concept_a_val": "INASEGURABLE; pacto de seguro nulo de pleno derecho", "concept_b_val": "Asegurable y con posible anticipo por entidades gestoras/mutuas", "trap_note": "Intentar cubrir el recargo del 30-50% con seguro privado."},
        {"criterion": "Cuantía de la carga", "concept_a_val": "Incremento del 30% al 50% sobre la prestación", "concept_b_val": "Coste íntegro de la prestación o capital coste", "trap_note": "Identificar el recargo con el capital coste íntegro."}
    ]),
    ("item-contrast-9", "INSS (Entidad Gestora) vs TGSS (Servicio Común)", "pair_inss_tgss_competencia", "cluster_entidades_gestoras", "Art. 66 y 74 TRLGSS", [
        {"criterion": "Naturaleza jurídica", "concept_a_val": "Entidad Gestora de la Seguridad Social", "concept_b_val": "Servicio Común de la Seguridad Social", "trap_note": "Denominar a la TGSS entidad gestora."},
        {"criterion": "Función principal", "concept_a_val": "Reconocimiento y pago de prestaciones económicas contributivas", "concept_b_val": "Afiliación, cotización, recaudación y caja única", "trap_note": "Atribuir la recaudación de cuotas al INSS."}
    ]),
    ("item-contrast-10", "Falta de alta vs Falta de cotización (descubierto)", "pair_falta_alta_falta_cotizacion", "cluster_requisitos_generales", "Art. 166 y 167 TRLGSS", [
        {"criterion": "Situación jurídica del trabajador", "concept_a_val": "Trabajo clandestino o no declarado (sin alta)", "concept_b_val": "Alta real formalizada pero cuotas impagadas", "trap_note": "Asimilar descubierto empresarial a falta de alta."},
        {"criterion": "Efecto en contingencias comunes", "concept_a_val": "Excluye la automaticidad relativa; sin prestación", "concept_b_val": "Opera el principio de automaticidad relativa con anticipo", "trap_note": "Denegar prestación al trabajador en alta por impago patronal."}
    ]),
    ("item-contrast-11", "Responsabilidad solidaria (art. 42 ET) vs Responsabilidad subsidiaria (art. 168 TRLGSS)", "pair_responsabilidad_directa_solidaria_subsidiaria", "cluster_responsabilidad", "Art. 42 ET y Art. 168 TRLGSS", [
        {"criterion": "Presupuesto de exigibilidad", "concept_a_val": "Directa sin necesidad de previa insolvencia del contratista", "concept_b_val": "Requiere insolvencia formal declarada del deudor principal", "trap_note": "Exigir previa excusión en contratas de propia actividad."},
        {"criterion": "Plazo de sujeción", "concept_a_val": "Durante el año siguiente a la finalización de la contrata", "concept_b_val": "Sujeta al plazo general de prescripción de cuotas", "trap_note": "Aplicar el límite de 1 año a cualquier responsabilidad."}
    ]),
    ("item-contrast-12", "Prestación contributiva vs Prestación no contributiva", "pair_contributiva_no_contributiva", "cluster_requisitos_generales", "Art. 15 y 363 TRLGSS", [
        {"criterion": "Requisito de cotización previa", "concept_a_val": "Exige cotización previa (período de carencia)", "concept_b_val": "Carencia 0; no exige cotización previa alguna", "trap_note": "Exigir días cotizados a la PNC de invalidez."},
        {"criterion": "Requisito económico", "concept_a_val": "Se abona con independencia de los ingresos del beneficiario", "concept_b_val": "Exige carecer de rentas o ingresos suficientes", "trap_note": "Condicionar la contributiva ordinaria al límite de rentas."}
    ]),
    ("item-contrast-13", "Incapacidad Temporal vs Incapacidad Permanente", "pair_it_ip", "cluster_contingencias", "Art. 169 y 193 TRLGSS", [
        {"criterion": "Duración de la situación", "concept_a_val": "Temporal: máx 365 días + 180 prórroga (+180 demora)", "concept_b_val": "Previsiblemente definitiva (secuelas anatómicas/funcionales)", "trap_note": "Considerar la IP como situación meramente transitoria."},
        {"criterion": "Finalidad protectora", "concept_a_val": "Subsidio sustitutorio del salario durante el tratamiento médico", "concept_b_val": "Pensión o indemnización reparadora de pérdida de capacidad", "trap_note": "Confundir el subsidio diario con la pensión mensual."}
    ]),
    ("item-contrast-14", "Inembargabilidad del SMI vs Escala de embargo de la LEC", "pair_inembargabilidad_smi_escala_lec", "cluster_intangibilidad_embargo", "Art. 44 TRLGSS y Art. 607 LEC", [
        {"criterion": "Porcentaje aplicable", "concept_a_val": "0% de embargo (inembargable al 100%)", "concept_b_val": "Del 30% al 90% según los tramos de exceso sobre el SMI", "trap_note": "Calcular la escala sobre la pensión íntegra y no sobre el exceso."},
        {"criterion": "Excepción legal", "concept_a_val": "Pensiones compensatorias y de alimentos a cónyuge e hijos", "concept_b_val": "Rebaja de un 10% a 15% en atención a cargas familiares", "trap_note": "Ignorar la excepción privilegiada de alimentos."}
    ]),
    ("item-contrast-15", "Pago voluntario de cuotas previo vs Pago extemporáneo posterior al hecho causante", "pair_cotizacion_fuera_plazo_descubiertos", "cluster_carencia_cotizacion", "Art. 165 TRLGSS", [
        {"criterion": "Momento del abono", "concept_a_val": "Antes de producirse el hecho causante de la prestación", "concept_b_val": "Después de sobrevenir el hecho causante (accidente/enfermedad)", "trap_note": "Equiparar pagar con recargo antes de enfermar a pagar después."},
        {"criterion": "Efectos sobre la carencia", "concept_a_val": "Convalida la carencia con plenos efectos (con recargo)", "concept_b_val": "Carece de efectos retroactivos para causar la prestación", "trap_note": "Creer que abonar la deuda tras el infarto habilita la pensión."}
    ])
]

for idx, spec in enumerate(contrast_specs, start=1):
    iid, stem, pr, clus, legal, rows = spec
    c_a, c_b = stem.split(" vs ")
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "contrast_card",
        "stem": f"Tarjeta de Contraste y Micro-Discriminación: ¿Qué criterios distinguen {c_a} de {c_b}?",
        "contrast_data": {
            "concept_a": c_a,
            "concept_b": c_b,
            "prompt_cue": f"Identifica la diferencia angular de régimen jurídico entre {c_a} y {c_b}.",
            "rows": rows
        },
        "legal_basis": legal,
        "rule_statement": f"Régimen de discriminación positiva y negativa amparado en {legal}.",
        "why_correct": f"Análisis cruzado riguroso según {legal}.",
        "corrective_rule": f"Analiza siempre el objeto y el dies a quo para no mezclar {c_a} y {c_b}.",
        "difficulty": 2,
        "cognitive_operations": ["micro_discrimination", "response_inhibition"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Contrast Cards. Total items: {len(all_items)}")

# 4. Generate 10 Number Sorting items
numsort_specs = [
    ("item-numsort-1", "Plazos extintivos y de prescripción en el TRLGSS", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad", "Art. 53, 54 y 55 TRLGSS", [
        {"id": "1", "concept": "Prescripción general del reconocimiento", "correct_value": "5 años", "category": "Prescripción"},
        {"id": "2", "concept": "Caducidad de percibo en pago único", "correct_value": "1 año", "category": "Caducidad"},
        {"id": "3", "concept": "Retroactividad económica máxima", "correct_value": "3 meses", "category": "Efectos"},
        {"id": "4", "concept": "Prescripción de reintegro de indebidas", "correct_value": "4 años", "category": "Prescripción"}
    ]),
    ("item-numsort-2", "Coeficientes y bonificaciones de cómputo", "cluster_coeficientes", "pair_fijo_discontinuo_contrato_corto", "Art. 247, 249 bis y 235 TRLGSS", [
        {"id": "1", "concept": "Coeficiente fijos-discontinuos", "correct_value": "1,5", "category": "Coeficiente"},
        {"id": "2", "concept": "Coeficiente contratos <= 5 días", "correct_value": "1,4", "category": "Coeficiente"},
        {"id": "3", "concept": "Cotización ficticia parto simple", "correct_value": "112 días", "category": "Días"},
        {"id": "4", "concept": "Adicional parto múltiple por hijo", "correct_value": "14 días", "category": "Días"}
    ]),
    ("item-numsort-3", "Magnitudes económicas y límites clave 2026", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima", "Art. 58, 59 y 363 TRLGSS", [
        {"id": "1", "concept": "Revalorización general contributiva", "correct_value": "2,7%", "category": "Porcentaje"},
        {"id": "2", "concept": "Tope pensión mensual máxima", "correct_value": "3.359,60 €", "category": "Importe mensual"},
        {"id": "3", "concept": "Pensión no contributiva anual", "correct_value": "8.803,20 €", "category": "Importe anual"},
        {"id": "4", "concept": "Límite mínimos sin cónyuge", "correct_value": "9.442,00 €", "category": "Límite de rentas"},
        {"id": "5", "concept": "Límite mínimos con cónyuge", "correct_value": "11.013,00 €", "category": "Límite de rentas"}
    ]),
    ("item-numsort-4", "Escala de embargabilidad del art. 607 de la LEC", "cluster_intangibilidad_embargo", "pair_inembargabilidad_smi_escala_lec", "Art. 607 LEC", [
        {"id": "1", "concept": "Tramo hasta 1x SMI", "correct_value": "0% (Inembargable)", "category": "Escala"},
        {"id": "2", "concept": "Tramo exceso hasta 2x SMI", "correct_value": "30%", "category": "Escala"},
        {"id": "3", "concept": "Tramo exceso hasta 3x SMI", "correct_value": "50%", "category": "Escala"},
        {"id": "4", "concept": "Tramo exceso hasta 4x SMI", "correct_value": "60%", "category": "Escala"},
        {"id": "5", "concept": "Tramo exceso hasta 5x SMI", "correct_value": "75%", "category": "Escala"},
        {"id": "6", "concept": "Exceso por encima de 5x SMI", "correct_value": "90%", "category": "Escala"}
    ]),
    ("item-numsort-5", "Duración temporal y prórrogas en Incapacidad Temporal", "cluster_contingencias", "pair_it_ip", "Art. 169 y 174 TRLGSS", [
        {"id": "1", "concept": "Duración máxima ordinaria", "correct_value": "365 días", "category": "Duración"},
        {"id": "2", "concept": "Prórroga expresa extraordinaria", "correct_value": "180 días", "category": "Prórroga"},
        {"id": "3", "concept": "Límite máximo absoluto con demora", "correct_value": "730 días", "category": "Límite"}
    ]),
    ("item-numsort-6", "Períodos de carencia exigibles en subsidios", "cluster_carencia_cotizacion", "pair_contingencia_comun_profesional", "Art. 172 y 178 TRLGSS", [
        {"id": "1", "concept": "IT por contingencias profesionales", "correct_value": "0 días", "category": "Carencia"},
        {"id": "2", "concept": "IT por enfermedad común", "correct_value": "180 días en 5 años", "category": "Carencia"},
        {"id": "3", "concept": "Nacimiento trabajadores < 21 años", "correct_value": "0 días", "category": "Carencia"},
        {"id": "4", "concept": "Nacimiento trabajadores 21 a 26 años", "correct_value": "90 días en 7 años", "category": "Carencia"},
        {"id": "5", "concept": "Nacimiento trabajadores > 26 años", "correct_value": "180 días en 7 años", "category": "Carencia"}
    ]),
    ("item-numsort-7", "Recargos y plazos de gestión empresarial", "cluster_recargo_medidas", "pair_recargo_aseguramiento_medidas", "Art. 47, 164 TRLGSS y RD 1415/2004", [
        {"id": "1", "concept": "Recargo mínimo por falta de medidas", "correct_value": "30%", "category": "Porcentaje"},
        {"id": "2", "concept": "Recargo máximo por falta de medidas", "correct_value": "50%", "category": "Porcentaje"},
        {"id": "3", "concept": "Plazo de invitación al pago de cuotas", "correct_value": "30 días naturales", "category": "Plazo"},
        {"id": "4", "concept": "Ingreso del capital coste por la empresa", "correct_value": "30 días", "category": "Plazo"}
    ]),
    ("item-numsort-8", "Requisitos de residencia en prestaciones no contributivas", "cluster_requisitos_generales", "pair_contributiva_no_contributiva", "Art. 363 y 369 TRLGSS", [
        {"id": "1", "concept": "Residencia exigida para PNC jubilación", "correct_value": "10 años", "category": "Residencia"},
        {"id": "2", "concept": "Años consecutivos e inmediatamente anteriores en jubilación", "correct_value": "2 años", "category": "Residencia"},
        {"id": "3", "concept": "Residencia exigida para PNC invalidez", "correct_value": "5 años", "category": "Residencia"},
        {"id": "4", "concept": "Grado mínimo de discapacidad para PNC invalidez", "correct_value": "65%", "category": "Porcentaje"}
    ]),
    ("item-numsort-9", "Responsabilidades y garantías temporales", "cluster_responsabilidad", "pair_responsabilidad_directa_solidaria_subsidiaria", "Art. 42 ET y Art. 33 ET", [
        {"id": "1", "concept": "Responsabilidad solidaria contratas propia actividad", "correct_value": "1 año", "category": "Plazo"},
        {"id": "2", "concept": "Tope límite de anticipo FOGASA / garantías", "correct_value": "2,5 veces IPREM", "category": "Límite"}
    ]),
    ("item-numsort-10", "Excedencias y cómputo de cotizaciones efectivas", "cluster_beneficios_parto", "pair_beneficios_parto", "Art. 237 TRLGSS", [
        {"id": "1", "concept": "Cuidado de hijo con cotización para todo", "correct_value": "1 año", "category": "Plazo"},
        {"id": "2", "concept": "Cuidado de hijo computable para jubilación/IP", "correct_value": "3 años", "category": "Plazo"},
        {"id": "3", "concept": "Cuidado de familiar con cotización computable", "correct_value": "1 año", "category": "Plazo"}
    ])
]

for idx, spec in enumerate(numsort_specs, start=1):
    iid, title, clus, pr, legal, items_data = spec
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "number_sort",
        "stem": f"Drill de Clasificación Numérica y Temporal: {title}. Asocia cada concepto con su magnitud jurídica exacta.",
        "number_sort_data": {
            "title": title,
            "instruction": "Arrastra o asocia cada concepto legal de Seguridad Social con su cifra, plazo o coeficiente correcto.",
            "items": items_data
        },
        "legal_basis": legal,
        "rule_statement": f"Parámetros cuantitativos tasados por {legal}.",
        "why_correct": f"Valores normativos estrictos fijados en {legal}.",
        "corrective_rule": "Evita la interferencia numérica asociando el concepto causal con su magnitud exacta.",
        "difficulty": 2,
        "cognitive_operations": ["numeric_precision", "response_inhibition"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Number Sort items. Total items: {len(all_items)}")

# 5. Generate 10 Spot Error items
spot_specs = [
    ("item-spot-1", "El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará a los cinco años, contados desde el día siguiente al hecho causante.", "cinco años", "un año", "La caducidad es de 1 año (art. 54.1), no de 5 años (que corresponde a la prescripción del reconocimiento).", "numeric_substitution", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad", "Art. 54.1 TRLGSS"),
    ("item-spot-2", "Los efectos económicos del reconocimiento inicial de las prestaciones se retrotraerán como máximo a los seis meses anteriores a la solicitud.", "seis meses", "tres meses", "La retroactividad máxima está tasada en 3 meses anteriores a la solicitud (art. 53.1 in fine).", "numeric_substitution", "cluster_prescripcion_caducidad", "pair_prescripcion_retroactividad", "Art. 53.1 TRLGSS"),
    ("item-spot-3", "En caso de fijos-discontinuos, a los días cotizados se les aplicará un coeficiente del 1,4 con límite mensual de días naturales.", "coeficiente del 1,4", "coeficiente del 1,5", "A los fijos-discontinuos se aplica el 1,5 con tope anual; el 1,4 corresponde a contratos <= 5 días.", "conceptual_merger", "cluster_coeficientes", "pair_fijo_discontinuo_contrato_corto", "Art. 247 TRLGSS"),
    ("item-spot-4", "Para el ejercicio 2026, las pensiones contributivas de la Seguridad Social se revalorizan con carácter general en un 4,5%.", "un 4,5%", "un 2,7%", "La revalorización fijada para 2026 según el IPC medio de referencia es del 2,7%.", "numeric_substitution", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima", "Art. 58 TRLGSS"),
    ("item-spot-5", "El recargo de prestaciones por falta de medidas de seguridad es asegurable si se formaliza con una Mutua Colaboradora.", "es asegurable", "es nulo de pleno derecho todo pacto para asegurarlo", "El art. 164.2 TRLGSS declara expresamente nulo de pleno derecho todo aseguramiento o traslación del recargo.", "rule_exception_swap", "cluster_recargo_medidas", "pair_recargo_aseguramiento_medidas", "Art. 164.2 TRLGSS"),
    ("item-spot-6", "La pensión de jubilación y todas las pensiones de viudedad son imprescriptibles en el sistema de la Seguridad Social.", "y todas las pensiones de viudedad", "y la incapacidad permanente", "Solo la jubilación y la incapacidad permanente son legalmente imprescriptibles (art. 53.3).", "overbroad_statement", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad", "Art. 53.3 TRLGSS"),
    ("item-spot-7", "En la escala de la LEC, el primer tramo de pensión que excede del SMI hasta el doble del SMI se embargará en un 50%.", "en un 50%", "en un 30%", "El primer tramo adicional hasta el doble del SMI se embarga en un 30% (art. 607.2 LEC).", "numeric_substitution", "cluster_intangibilidad_embargo", "pair_inembargabilidad_smi_escala_lec", "Art. 607 LEC"),
    ("item-spot-8", "El plazo concedido al deudor de cuotas en la invitación al pago es de 15 días hábiles prorrogables.", "15 días hábiles prorrogables", "30 días naturales improrrogables", "El plazo legal tasado de invitación al pago es de 30 días naturales improrrogables (art. 47.1).", "temporal_confusion", "cluster_requisitos_generales", "pair_aplazamiento_corriente_incumplimiento", "Art. 47.1 TRLGSS"),
    ("item-spot-9", "La cuantía máxima de las pensiones de la Seguridad Social para 2026 no puede superar los 4.500,00 euros mensuales.", "4.500,00 euros mensuales", "3.359,60 euros mensuales", "El tope legal mensual para 2026 asciende exactamente a 3.359,60 € (art. 58 TRLGSS).", "numeric_substitution", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima", "Art. 58 TRLGSS"),
    ("item-spot-10", "El beneficio por parto simple otorga a la madre trabajadora 90 días naturales de cotización computable.", "90 días naturales", "112 días", "El parto simple acredita 112 días de cotización ficticia (art. 235 TRLGSS).", "numeric_substitution", "cluster_beneficios_parto", "pair_fijo_discontinuo_contrato_corto", "Art. 235 TRLGSS")
]

for idx, spec in enumerate(spot_specs, start=1):
    iid, full_stmt, err_span, corr_text, expl, tr_type, clus, pr, legal = spec
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "spot_error",
        "stem": f"Detección e Inhibición de Errores: Identifica y corrige la afirmación errónea en el enunciado jurídico.",
        "spot_error_data": {
            "full_statement": full_stmt,
            "erroneous_span": err_span,
            "corrected_text": corr_text,
            "explanation": expl,
            "trap_type": tr_type
        },
        "legal_basis": legal,
        "rule_statement": f"Corrección estricta amparada en {legal}.",
        "why_correct": expl,
        "corrective_rule": f"No des por válida una afirmación con cifras o conceptos descontextualizados; verifica siempre con {legal}.",
        "difficulty": 2,
        "cognitive_operations": ["response_inhibition", "exception_detection"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Spot Error items. Total items: {len(all_items)}")

# 6. Generate 8 Two-Tier items
twotier_specs = [
    (
        "item-twotier-1",
        "El subsidio de incapacidad temporal derivado de contingencias comunes se rige en nuestro ordenamiento por:",
        [
            {"id": "A", "text": "Automaticidad relativa condicionada inexcusablemente al alta del trabajador.", "is_correct": True},
            {"id": "B", "text": "Automaticidad absoluta con anticipo obligatorio aun en supuestos de falta de alta.", "is_correct": False},
            {"id": "C", "text": "Inexistencia total de automaticidad, debiendo el trabajador reclamar al juzgado.", "is_correct": False},
            {"id": "D", "text": "Automaticidad condicionada exclusivamente al pago previo de cuotas patronales.", "is_correct": False}
        ],
        "¿Cuál es el fundamento jurídico y causal que justifica la respuesta elegida en el Nivel 1?",
        [
            {"id": "A", "text": "Porque el art. 167.2 TRLGSS exige estar en alta o asimilada para que la gestora anticipe la prestación por contingencias comunes.", "is_correct": True},
            {"id": "B", "text": "Porque el Decreto de 1966 solo prevé la automaticidad absoluta para contingencias profesionales y desempleo.", "is_correct": False},
            {"id": "C", "text": "Porque la Seguridad Social nunca asume anticipos de contingencias comunes en ningún caso.", "is_correct": False},
            {"id": "D", "text": "Porque la Inspección de Trabajo debe calificar el descubierto previamente con acta de liquidación.", "is_correct": False}
        ],
        "cluster_automaticidad",
        "pair_automaticidad_absoluta_relativa",
        "Art. 167 TRLGSS"
    ),
    (
        "item-twotier-2",
        "Un pensionista solicita en 2026 el abono retroactivo de mensualidades devengadas hace 2 años y no percibidas por error propio. ¿Qué ocurrirá con su derecho?",
        [
            {"id": "A", "text": "Las mensualidades devengadas con más de un año de antigüedad han caducado.", "is_correct": True},
            {"id": "B", "text": "Cobrará los 2 años completos porque el reconocimiento no prescribe hasta los 5 años.", "is_correct": False},
            {"id": "C", "text": "Ha prescrito la pensión completa y perderá el derecho hacia el futuro.", "is_correct": False},
            {"id": "D", "text": "Se le abonarán exclusivamente las tres últimas mensualidades por retroactividad.", "is_correct": False}
        ],
        "¿Por qué motivo legal se adopta dicha decisión resolutoria?",
        [
            {"id": "A", "text": "Porque según el art. 54.2 TRLGSS el cobro de cada mensualidad periódica caduca al año de su respectivo vencimiento.", "is_correct": True},
            {"id": "B", "text": "Porque la prescripción del art. 53 borra el reconocimiento inicial.", "is_correct": False},
            {"id": "C", "text": "Porque el art. 53.1 solo permite retrotraer tres meses en solicitudes iniciales.", "is_correct": False},
            {"id": "D", "text": "Porque la caducidad requiere intimación judicial expresa del deudor.", "is_correct": False}
        ],
        "cluster_prescripcion_caducidad",
        "pair_prescripcion_caducidad",
        "Art. 54.2 TRLGSS"
    ),
    (
        "item-twotier-3",
        "En un accidente de trabajo con infracción acreditada de medidas de seguridad, ¿puede la empresa derivar el recargo del 40% a su seguro de responsabilidad civil?",
        [
            {"id": "A", "text": "No, es nulo de pleno derecho cualquier pacto o seguro que cubra dicho recargo.", "is_correct": True},
            {"id": "B", "text": "Sí, siempre que la póliza se hubiera suscrito con anterioridad al siniestro.", "is_correct": False},
            {"id": "C", "text": "Sí, pero únicamente hasta un límite del 30%, asumiendo la empresa el 10% restante.", "is_correct": False},
            {"id": "D", "text": "Solo si la mutua colaboradora autoriza la subrogación aseguradora.", "is_correct": False}
        ],
        "¿Cuál es la justificación teleológica y normativa de esta limitación?",
        [
            {"id": "A", "text": "Porque el recargo tiene una función preventiva y sancionadora directa sobre el infractor (art. 164.2 TRLGSS).", "is_correct": True},
            {"id": "B", "text": "Porque las compañías de seguros privadas tienen prohibido operar en el ramo de accidentes de trabajo.", "is_correct": False},
            {"id": "C", "text": "Porque el recargo de prestaciones solo se aplica cuando no existe seguro básico de accidentes.", "is_correct": False},
            {"id": "D", "text": "Porque el importe del recargo se ingresa en el Tesoro Público y no va al trabajador.", "is_correct": False}
        ],
        "cluster_recargo_medidas",
        "pair_recargo_aseguramiento_medidas",
        "Art. 164 TRLGSS"
    ),
    (
        "item-twotier-4",
        "A un trabajador con contrato temporal de 4 días de duración se le computan las cotizaciones aplicando:",
        [
            {"id": "A", "text": "El coeficiente del 1,4 por día trabajado con tope mensual de días naturales.", "is_correct": True},
            {"id": "B", "text": "El coeficiente del 1,5 por día cotizado con tope anual de días naturales.", "is_correct": False},
            {"id": "C", "text": "Exclusivamente los 4 días naturales sin ningún multiplicador legal.", "is_correct": False},
            {"id": "D", "text": "Un recargo de cotización del 40% sin cómputo de días adicionales.", "is_correct": False}
        ],
        "¿Cuál es el precepto y ámbito que rige esta regla específica?",
        [
            {"id": "A", "text": "El art. 249 bis TRLGSS para contratos temporales de duración igual o inferior a cinco días.", "is_correct": True},
            {"id": "B", "text": "El art. 247 TRLGSS aplicable al régimen de trabajadores fijos-discontinuos.", "is_correct": False},
            {"id": "C", "text": "La regla general de contratación a tiempo parcial del art. 248 TRLGSS.", "is_correct": False},
            {"id": "D", "text": "La Ley de Presupuestos Generales del Estado exclusivamente para personal interino.", "is_correct": False}
        ],
        "cluster_coeficientes",
        "pair_fijo_discontinuo_contrato_corto",
        "Art. 249 bis TRLGSS"
    ),
    (
        "item-twotier-5",
        "Un perceptor de una pensión de jubilación percibe 1.200 € mensuales en 2026. Frente a una deuda civil ordinaria con un banco, ¿qué importe puede ser objeto de traba?",
        [
            {"id": "A", "text": "Únicamente el porcentaje fijado por la escala de la LEC sobre el exceso que supere el SMI.", "is_correct": True},
            {"id": "B", "text": "La totalidad de los 1.200 € al tratarse de una deuda dineraria líquida y exigible.", "is_correct": False},
            {"id": "C", "text": "El 50% de la cuantía íntegra de la pensión por ser superior al IPREM.", "is_correct": False},
            {"id": "D", "text": "Ninguna cantidad, pues todas las pensiones públicas son absolutamente inembargables.", "is_correct": False}
        ],
        "¿En qué principio y precepto legal se sustenta esta protección?",
        [
            {"id": "A", "text": "En el art. 44 TRLGSS y art. 607 LEC, que declaran inembargable el salario o pensión que no exceda del SMI.", "is_correct": True},
            {"id": "B", "text": "En la exención de rentas de inserción del art. 7 de la Ley del IRPF.", "is_correct": False},
            {"id": "C", "text": "En el carácter indisponible del derecho a la Seguridad Social del art. 3 TRLGSS.", "is_correct": False},
            {"id": "D", "text": "En la prohibición constitucional de embargar bienes del patrimonio de la Seguridad Social.", "is_correct": False}
        ],
        "cluster_intangibilidad_embargo",
        "pair_inembargabilidad_smi_escala_lec",
        "Art. 44 TRLGSS y Art. 607 LEC"
    ),
    (
        "item-twotier-6",
        "Un autónomo en descubierto de cuotas solicita una pensión y recibe la invitación al pago. ¿De qué plazo dispone para abonarlas con plenos efectos?",
        [
            {"id": "A", "text": "30 días naturales improrrogables desde la notificación.", "is_correct": True},
            {"id": "B", "text": "10 días hábiles conforme a la Ley 39/2015 de procedimiento común.", "is_correct": False},
            {"id": "C", "text": "3 meses equivalentes a la retroactividad de las prestaciones.", "is_correct": False},
            {"id": "D", "text": "Hasta que finalice el año natural correspondiente al hecho causante.", "is_correct": False}
        ],
        "¿Qué efecto jurídico produce el ingreso regular dentro de dicho plazo?",
        [
            {"id": "A", "text": "Convalida la situación de estar al corriente y permite causar la prestación solicitada (art. 47 TRLGSS).", "is_correct": True},
            {"id": "B", "text": "Exonera al autónomo del pago de los recargos de mora e intereses devengados.", "is_correct": False},
            {"id": "C", "text": "Determina la concesión automática de un aplazamiento a 5 años sin garantías.", "is_correct": False},
            {"id": "D", "text": "Transforma la pensión en no contributiva a cargo del Estado.", "is_correct": False}
        ],
        "cluster_requisitos_generales",
        "pair_aplazamiento_corriente_incumplimiento",
        "Art. 47 TRLGSS"
    ),
    (
        "item-twotier-7",
        "¿Está obligada la TGSS a conceder aplazamiento de las cuotas adeudadas por una empresa en crisis económica?",
        [
            {"id": "A", "text": "No, la concesión de aplazamiento es una potestad discrecional reglada de la TGSS sujeta a garantías.", "is_correct": True},
            {"id": "B", "text": "Sí, es un derecho subjetivo absoluto de todo empresario al corriente del año anterior.", "is_correct": False},
            {"id": "C", "text": "Solo si la empresa cuenta con menos de 10 trabajadores y no adeuda salarios.", "is_correct": False},
            {"id": "D", "text": "No, los aplazamientos de cuotas de Seguridad Social están legalmente prohibidos.", "is_correct": False}
        ],
        "¿Qué consecuencia acarrea el impago de un solo plazo en un aplazamiento concedido?",
        [
            {"id": "A", "text": "Determina la caducidad del aplazamiento y la apertura inmediata de la vía de apremio por la totalidad (art. 23.4 TRLGSS).", "is_correct": True},
            {"id": "B", "text": "Otorga automáticamente una prórroga de gracia de 6 meses.", "is_correct": False},
            {"id": "C", "text": "Únicamente devenga un interés de demora del 2% sobre la cuota impagada.", "is_correct": False},
            {"id": "D", "text": "Requiere una nueva resolución motivada del Ministro de Inclusión.", "is_correct": False}
        ],
        "cluster_requisitos_generales",
        "pair_aplazamiento_corriente_incumplimiento",
        "Art. 23 TRLGSS"
    ),
    (
        "item-twotier-8",
        "Un trabajador sufre un infarto mientras se encontraba prestando servicios en su puesto habitual de trabajo. Legalmente se considera:",
        [
            {"id": "A", "text": "Presuntamente accidente de trabajo en virtud de la presunción legal del art. 156.3 TRLGSS.", "is_correct": True},
            {"id": "B", "text": "Enfermedad común en todo caso, por tratarse de una patología de origen cardiovascular.", "is_correct": False},
            {"id": "C", "text": "Accidente no laboral, salvo que el convenio colectivo lo califique de profesional.", "is_correct": False},
            {"id": "D", "text": "Accidente in itinere al haberse manifestado durante la jornada laboral.", "is_correct": False}
        ],
        "¿Cuál es el alcance probatorio de la presunción legalmente establecida?",
        [
            {"id": "A", "text": "Es una presunción iuris tantum que solo puede desvirtuarse probando la falta de vinculación lesiva laboral.", "is_correct": True},
            {"id": "B", "text": "Es una presunción iuris et de iure que no admite prueba en contrario bajo ningún concepto.", "is_correct": False},
            {"id": "C", "text": "No tiene valor probatorio hasta que no recaiga sentencia firme del Juzgado de lo Social.", "is_correct": False},
            {"id": "D", "text": "Depende de que el trabajador no hubiera solicitado una baja voluntaria previa.", "is_correct": False}
        ],
        "cluster_accidente_enfermedad",
        "pair_contingencia_comun_profesional",
        "Art. 156.3 TRLGSS"
    )
]

for idx, spec in enumerate(twotier_specs, start=1):
    iid, t1_prompt, t1_opts, t2_prompt, t2_opts, clus, pr, legal = spec
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "two_tier",
        "stem": f"Ítem Diagnóstico de Dos Niveles: Evaluación de decisión jurídica (Nivel 1) y justificación causal (Nivel 2).",
        "two_tier_data": {
            "tier1": {
                "prompt": t1_prompt,
                "options": t1_opts
            },
            "tier2": {
                "prompt": t2_prompt,
                "options": t2_opts
            }
        },
        "legal_basis": legal,
        "rule_statement": f"Evaluación en dos niveles fundamentada en {legal}.",
        "why_correct": f"Respuesta y justificación causal plenamente coherentes con {legal}.",
        "corrective_rule": "Distingue el acierto por reconocimiento superficial del dominio del modelo causal subyacente.",
        "difficulty": 3,
        "cognitive_operations": ["calibrated_decision", "application"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Two-Tier items. Total items: {len(all_items)}")

# 7. Generate 6 Exception Tree items
tree_specs = [
    (
        "item-tree-1",
        "Árbol de Decisión: Inembargabilidad, Embargabilidad y Tributación en IRPF",
        "cluster_intangibilidad_embargo",
        "pair_intangibilidad_embargo_irpf",
        "Art. 44 TRLGSS, Art. 607 LEC y Art. 7 Ley 35/2006",
        {
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
        [
            {"scenario": "Pensión de IP absoluta de 1.100 € (inferior al SMI).", "correct_leaf_id": "node_smi", "explanation": "Al no superar el SMI, es absolutamente inembargable."},
            {"scenario": "Pensión de jubilación de 2.000 € frente a embargo bancario.", "correct_leaf_id": "leaf_tributa_irpf", "explanation": "Supera el SMI (embargable en el exceso) y tributa en IRPF."},
            {"scenario": "Pensión de gran invalidez de 3.000 €.", "correct_leaf_id": "leaf_exenta_irpf", "explanation": "Supera el SMI en embargo pero está totalmente exenta de IRPF."}
        ]
    ),
    (
        "item-tree-2",
        "Árbol de Decisión: Principio de Automaticidad (Absoluta vs Relativa)",
        "cluster_automaticidad",
        "pair_automaticidad_absoluta_relativa",
        "Decreto 21 abril 1966 y Art. 167 TRLGSS",
        {
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
        [
            {"scenario": "Trabajador sin dar de alta sufre caída mortal en andamio.", "correct_leaf_id": "leaf_auto_absoluta", "explanation": "Accidente de trabajo: opera la automaticidad absoluta aunque no estuviera de alta."},
            {"scenario": "Trabajador en alta pero con empresa en descubierto sufre apendicitis.", "correct_leaf_id": "leaf_auto_relativa", "explanation": "Contingencia común con alta real: opera la automaticidad relativa con anticipo."}
        ]
    ),
    (
        "item-tree-3",
        "Árbol de Decisión: Responsabilidad empresarial por contratas y cesión",
        "cluster_responsabilidad",
        "pair_responsabilidad_directa_solidaria_subsidiaria",
        "Art. 42 y 43 ET, Art. 168 TRLGSS",
        {
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
        [
            {"scenario": "Constructora subcontrata el encofrado con deudas en la TGSS.", "correct_leaf_id": "leaf_propia_actividad", "explanation": "Propia actividad: responsabilidad solidaria durante 1 año."},
            {"scenario": "Empresa pantalla suministra personal sin estructura productiva propia.", "correct_leaf_id": "leaf_cesion_ilegal", "explanation": "Cesión ilegal: responsabilidad solidaria entre ambas empresas."}
        ]
    ),
    (
        "item-tree-4",
        "Árbol de Decisión: Prescripción vs Caducidad según el objeto reclamado",
        "cluster_prescripcion_caducidad",
        "pair_prescripcion_caducidad",
        "Art. 53 y 54 TRLGSS",
        {
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
                    "label": "Reconocimiento de jubilación o incapacidad permanente",
                    "rule_text": "Imprescriptible (no prescribe nunca).",
                    "legal_basis": "Art. 53.3 TRLGSS",
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
        [
            {"scenario": "Solicitud de pensión de jubilación 7 años tras cumplir los 65 años.", "correct_leaf_id": "leaf_imprescriptible", "explanation": "La jubilación es imprescriptible (art. 53.3)."},
            {"scenario": "Reclamación de subsidio de IT denegado hace 6 años.", "correct_leaf_id": "leaf_prescripcion_general", "explanation": "Supera el plazo de 5 años: prescrito."}
        ]
    ),
    (
        "item-tree-5",
        "Árbol de Decisión: Coeficientes de cotización y cómputo de días",
        "cluster_coeficientes",
        "pair_fijo_discontinuo_contrato_corto",
        "Art. 247 y 249 bis TRLGSS",
        {
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
        [
            {"scenario": "Trabajador fijo-discontinuo con 200 días de alta en la campaña.", "correct_leaf_id": "leaf_fijo_disc", "explanation": "Se aplica coeficiente 1,5 (200 x 1,5 = 300 días)."},
            {"scenario": "Camarero contratado para evento de 3 días de duración.", "correct_leaf_id": "leaf_temporal_corto", "explanation": "Contrato <= 5 días: coeficiente 1,4 (3 x 1,4 = 4,2 días)."}
        ]
    ),
    (
        "item-tree-6",
        "Árbol de Decisión: Período de carencia en el subsidio por nacimiento",
        "cluster_carencia_cotizacion",
        "pair_carencia_cotizacion",
        "Art. 178 TRLGSS",
        {
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
                    "label": "De 21 a 26 años cumplidos",
                    "rule_text": "90 días en los 7 años anteriores o 180 días en toda su vida laboral.",
                    "legal_basis": "Art. 178.2 TRLGSS",
                    "children": []
                },
                {
                    "id": "leaf_mayor_26",
                    "label": "Mayor de 26 años",
                    "rule_text": "180 días en los 7 años anteriores o 360 días a lo largo de la vida laboral.",
                    "legal_basis": "Art. 178.3 TRLGSS",
                    "children": []
                }
            ]
        },
        [
            {"scenario": "Madre de 19 años da a luz sin haber cotizado nunca.", "correct_leaf_id": "leaf_menor_21", "explanation": "Menor de 21 años: carencia cero."},
            {"scenario": "Padre de 24 años acredita 100 días en los últimos 3 años.", "correct_leaf_id": "leaf_21_a_26", "explanation": "Entre 21 y 26 años: exige 90 días en 7 años (cumple)."},
            {"scenario": "Madre de 30 años acredita 120 días cotizados.", "correct_leaf_id": "leaf_mayor_26", "explanation": "Mayor de 26 años: exige 180 días en 7 años (no cumple)."}
        ]
    )
]

for idx, spec in enumerate(tree_specs, start=1):
    iid, stem, clus, pr, legal, root_rule, test_cases = spec
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "exception_tree",
        "stem": f"Árbol de Excepciones y Enrutamiento Normativo: {stem}.",
        "exception_tree_data": {
            "root_rule": root_rule,
            "test_cases": test_cases
        },
        "legal_basis": legal,
        "rule_statement": f"Estructura condicional jerarquizada en {legal}.",
        "why_correct": f"Enrutamiento estricto siguiendo las ramas de regla y excepción de {legal}.",
        "corrective_rule": "Identifica siempre la condición previa que conmuta la regla general a la rama de excepción.",
        "difficulty": 3,
        "cognitive_operations": ["exception_detection", "application"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Exception Trees. Total items: {len(all_items)}")

# 8. Generate 6 Fact-Variant items
variant_specs = [
    (
        "item-variant-1",
        "Laboratorio de Variantes Fácticas: Cómputo de días en fijos-discontinuos y contratos cortos",
        "cluster_coeficientes",
        "pair_fijo_discontinuo_contrato_corto",
        "Art. 247 y 249 bis TRLGSS",
        {
            "scenario": "Trabajador fijo-discontinuo acredita 200 días de trabajo efectivo en alta durante el año natural.",
            "question": "¿Cuántos días de cotización se le computan para acreditar carencia de pensión de jubilación?",
            "correct_outcome": "300 días de cotización (200 x 1,5 = 300), al no superar el límite de días naturales del año (365 días).",
            "legal_rule": "Art. 247 TRLGSS: multiplicador 1,5 con tope anual de días naturales."
        },
        [
            {
                "id": "v1",
                "changed_fact": "El trabajador es contratado bajo un contrato temporal de 4 días de duración en lugar de fijo-discontinuo.",
                "new_scenario": "Trabajador con contrato temporal de 4 días naturales en un mes de 30 días.",
                "outcome_changes": True,
                "correct_outcome": "5,6 días de cotización (4 x 1,4 = 5,6), con tope de los días naturales del mes.",
                "explanation": "Pasa a regirse por el art. 249 bis TRLGSS: multiplicador 1,4 y tope mensual."
            },
            {
                "id": "v2",
                "changed_fact": "El trabajador fijo-discontinuo acredita 260 días de trabajo en el año natural en lugar de 200.",
                "new_scenario": "Trabajador fijo-discontinuo acredita 260 días cotizados en el año.",
                "outcome_changes": True,
                "correct_outcome": "365 días de cotización (tope de días naturales del año), ya que 260 x 1,5 = 390 días.",
                "explanation": "El art. 247 TRLGSS establece el límite máximo infranqueable de los días naturales del año."
            },
            {
                "id": "v3",
                "changed_fact": "El contrato temporal dura 6 días naturales en lugar de 4 días.",
                "new_scenario": "Trabajador contratado temporalmente por 6 días naturales continuados.",
                "outcome_changes": True,
                "correct_outcome": "6 días de cotización estrictos, sin multiplicador del 1,4.",
                "explanation": "El coeficiente 1,4 solo es aplicable si la duración es igual o inferior a 5 días (art. 249 bis)."
            },
            {
                "id": "v4",
                "changed_fact": "El contrato es a tiempo parcial indefinido con 200 días trabajados al 50% de la jornada.",
                "new_scenario": "Trabajador a tiempo parcial indefinido que realiza media jornada durante 200 días.",
                "outcome_changes": True,
                "correct_outcome": "No se aplica 1,5 ni 1,4; se computan las horas trabajadas según las reglas del art. 248 TRLGSS.",
                "explanation": "Los contratos a tiempo parcial ordinarios no fijos-discontinuos siguen el régimen del art. 248 TRLGSS."
            }
        ]
    ),
    (
        "item-variant-2",
        "Laboratorio de Variantes Fácticas: Prescripción y efectos económicos retroactivos",
        "cluster_prescripcion_caducidad",
        "pair_prescripcion_retroactividad",
        "Art. 53 TRLGSS",
        {
            "scenario": "Hecho causante ocurrido el 1 de enero de 2025. Se presenta la solicitud formal de pensión de viudedad el 1 de julio de 2025 (6 meses después).",
            "question": "¿Desde qué fecha produce efectos económicos el reconocimiento de la pensión?",
            "correct_outcome": "Desde el 1 de abril de 2025 (tres meses anteriores a la fecha de presentación de la solicitud).",
            "legal_rule": "Art. 53.1 TRLGSS: retroactividad económica máxima de 3 meses."
        },
        [
            {
                "id": "v1",
                "changed_fact": "La solicitud se presenta el 1 de febrero de 2025 (1 mes tras el hecho causante).",
                "new_scenario": "Solicitud presentada dentro del mes siguiente al hecho causante.",
                "outcome_changes": True,
                "correct_outcome": "Produce efectos económicos desde el día siguiente al hecho causante (2 de enero de 2025).",
                "explanation": "Al haberse solicitado dentro de los 3 meses posteriores al hecho causante, los efectos alcanzan la fecha originaria."
            },
            {
                "id": "v2",
                "changed_fact": "La solicitud se presenta 6 años después del hecho causante.",
                "new_scenario": "Solicitud de pensión de viudedad cursada transcurridos 6 años desde el fallecimiento.",
                "outcome_changes": True,
                "correct_outcome": "El derecho al reconocimiento ha prescrito por haber transcurrido más de cinco años (art. 53.1).",
                "explanation": "La viudedad no es imprescriptible; prescribe a los 5 años desde el hecho causante."
            },
            {
                "id": "v3",
                "changed_fact": "La pensión solicitada 6 años después es de jubilación ordinaria en lugar de viudedad.",
                "new_scenario": "Solicitud de jubilación ordinaria formulada 6 años después de cumplir la edad y cesar en el trabajo.",
                "outcome_changes": True,
                "correct_outcome": "El derecho se reconoce por ser imprescriptible (art. 53.3), con retroactividad económica de 3 meses.",
                "explanation": "La jubilación no prescribe nunca, pero sus efectos económicos solo viajan 3 meses hacia atrás."
            }
        ]
    ),
    (
        "item-variant-3",
        "Laboratorio de Variantes Fácticas: Automaticidad en accidente vs enfermedad común",
        "cluster_automaticidad",
        "pair_automaticidad_absoluta_relativa",
        "Decreto 21 abril 1966 y Art. 167 TRLGSS",
        {
            "scenario": "Trabajador sin afiliar ni dar de alta por su empresa sufre accidente en el centro de trabajo.",
            "question": "¿Tiene derecho al percibo de las prestaciones sanitarias y económicas de la Seguridad Social?",
            "correct_outcome": "Sí, opera la automaticidad absoluta con anticipo íntegro por la Mutua o la Entidad Gestora.",
            "legal_rule": "Decreto 21 abril 1966: automaticidad absoluta en contingencias profesionales aun sin alta."
        },
        [
            {
                "id": "v1",
                "changed_fact": "La contingencia no es accidente de trabajo sino infarto fuera del centro y tiempo de trabajo.",
                "new_scenario": "Trabajador sin dar de alta sufre enfermedad común en su domicilio durante el fin de semana.",
                "outcome_changes": True,
                "correct_outcome": "No tiene derecho a la prestación por contingencia común por falta de alta previa (no opera automaticidad relativa).",
                "explanation": "En contingencias comunes, el art. 167.2 TRLGSS exige estar en alta o asimilada para activar el anticipo."
            },
            {
                "id": "v2",
                "changed_fact": "El trabajador sí estaba dado de alta reglamentariamente, pero la empresa adeudaba todas las cuotas.",
                "new_scenario": "Trabajador dado de alta debidamente, con empresa en descubierto culpable de cotizaciones.",
                "outcome_changes": True,
                "correct_outcome": "Sí tiene derecho a la prestación de enfermedad común por el principio de automaticidad relativa.",
                "explanation": "Al existir alta previa, la entidad gestora anticipa la prestación y se subroga frente al empresario deudor."
            }
        ]
    ),
    (
        "item-variant-4",
        "Laboratorio de Variantes Fácticas: Inembargabilidad y escala de retenciones",
        "cluster_intangibilidad_embargo",
        "pair_inembargabilidad_smi_escala_lec",
        "Art. 44 TRLGSS y Art. 607 LEC",
        {
            "scenario": "Pensión mensual de jubilación de 1.000 € (inferior al SMI fijado de referencia).",
            "question": "¿Qué importe puede embargar judicialmente un acreedor por un crédito impagado?",
            "correct_outcome": "0 € (cero euros), por ser absolutamente inembargable en virtud del art. 44 TRLGSS y art. 607.1 LEC.",
            "legal_rule": "Inembargabilidad absoluta del sueldo o pensión que no exceda del SMI."
        },
        [
            {
                "id": "v1",
                "changed_fact": "El título judicial ejecutivo es una condena por impago de pensión de alimentos al cónyuge.",
                "new_scenario": "Pensión de 1.000 € frente a ejecución por alimentos debidos a los hijos menores.",
                "outcome_changes": True,
                "correct_outcome": "El tribunal fija la cuantía embargable sin quedar limitado por el SMI (art. 608 LEC).",
                "explanation": "El art. 608 LEC exceptúa expresamente el blindaje del SMI cuando la deuda derive de alimentos legales."
            },
            {
                "id": "v2",
                "changed_fact": "La pensión mensual percibida asciende a 2.000 € frente a deuda ordinaria mercantil.",
                "new_scenario": "Pensión de 2.000 € con SMI de referencia de 1.134 €.",
                "outcome_changes": True,
                "correct_outcome": "Se embarga el 30% del exceso entre 1.134 € y 2.000 € (866 € x 30% = 259,80 €).",
                "explanation": "La escala de la LEC solo grava el tramo sobrante por encima del SMI al 30% en el primer múltiplo."
            }
        ]
    ),
    (
        "item-variant-5",
        "Laboratorio de Variantes Fácticas: Ingreso extemporáneo de cuotas y carencia",
        "cluster_carencia_cotizacion",
        "pair_cotizacion_fuera_plazo_descubiertos",
        "Art. 165 TRLGSS",
        {
            "scenario": "Un trabajador autónomo en descubierto abona voluntariamente sus cuotas impagadas con recargo el 10 de enero de 2026. Sufre un ictus cerebral el 15 de febrero de 2026.",
            "question": "¿Computan dichas cuotas abonadas fuera de plazo para acreditar la carencia de la pensión de incapacidad permanente?",
            "correct_outcome": "Sí, producen plenos efectos porque el ingreso extemporáneo tuvo lugar antes de sobrevenir el hecho causante.",
            "legal_rule": "Art. 165.2 TRLGSS: pago extemporáneo previo al hecho causante convalida la carencia."
        },
        [
            {
                "id": "v1",
                "changed_fact": "El abono con recargo se realiza el 20 de febrero de 2026, cinco días después de sufrir el ictus.",
                "new_scenario": "Ingreso de las cuotas con recargo efectuado con posterioridad a la fecha del hecho causante.",
                "outcome_changes": True,
                "correct_outcome": "No computan para causar la prestación; el pago posterior al hecho causante no convalida la carencia.",
                "explanation": "El art. 165.3 TRLGSS prohíbe los efectos retroactivos de pagos posteriores para lucrar prestaciones del sistema."
            },
            {
                "id": "v2",
                "changed_fact": "La incapacidad no deriva de ictus sino de un accidente de tráfico ocurrido en el trabajo.",
                "new_scenario": "El hecho causante es un accidente de trabajo y las cuotas continúan impagadas.",
                "outcome_changes": True,
                "correct_outcome": "Se reconoce la pensión íntegra de incapacidad con independencia del pago de cuotas (carencia cero y automaticidad).",
                "explanation": "Las prestaciones derivadas de accidente de trabajo no exigen período previo de cotización (art. 172 TRLGSS)."
            }
        ]
    ),
    (
        "item-variant-6",
        "Laboratorio de Variantes Fácticas: Responsabilidad solidaria en subcontratación de obras",
        "cluster_responsabilidad",
        "pair_responsabilidad_directa_solidaria_subsidiaria",
        "Art. 42 ET y Art. 168 TRLGSS",
        {
            "scenario": "Promotora constructora contrata con un subcontratista la estructura de un edificio residencial (propia actividad). La obra concluye el 1 de junio de 2025. El subcontratista deja descubiertos en la TGSS.",
            "question": "¿Hasta qué fecha responde solidariamente la constructora principal de dichas cuotas impagadas?",
            "correct_outcome": "Hasta el 1 de junio de 2026 (durante el año siguiente a la terminación del encargo).",
            "legal_rule": "Art. 42.2 Estatuto de los Trabajadores: responsabilidad solidaria de 1 año en propia actividad."
        },
        [
            {
                "id": "v1",
                "changed_fact": "La constructora recabó previamente certificación negativa de descubiertos ante la TGSS.",
                "new_scenario": "La empresa principal obtuvo de la TGSS certificación negativa de descubiertos dentro de plazo reglamentario.",
                "outcome_changes": True,
                "correct_outcome": "Queda exonerada de responsabilidad solidaria por las deudas devengadas en el período certificado.",
                "explanation": "El art. 42.1 ET exonera al comitente que solicita y obtiene en plazo certificación negativa de la TGSS."
            },
            {
                "id": "v2",
                "changed_fact": "La reclamación de cuotas se notifica a la principal el 1 de diciembre de 2026 (18 meses tras la obra).",
                "new_scenario": "Reclamación de deuda notificada transcurrido un año desde la finalización de la contrata.",
                "outcome_changes": True,
                "correct_outcome": "Ha decaído la responsabilidad solidaria por haber expirado el plazo de un año del art. 42 ET.",
                "explanation": "Transcurrido el año de garantía solidaria, la TGSS solo puede dirigirse contra el deudor principal o en vía subsidiaria."
            }
        ]
    )
]

for idx, spec in enumerate(variant_specs, start=1):
    iid, stem, clus, pr, legal, base_case, variants = spec
    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "fact_variant",
        "stem": f"Laboratorio de Variantes Fácticas: {stem}.",
        "fact_variant_data": {
            "base_case": base_case,
            "variants": variants
        },
        "legal_basis": legal,
        "rule_statement": f"Análisis de sensibilidad fáctica fundado en {legal}.",
        "why_correct": f"Variación causal de supuestos de hecho conforme a la hermenéutica de {legal}.",
        "corrective_rule": "Comprueba siempre qué hecho concreto cambia (duración, fecha, contingencia) antes de extrapolar la regla.",
        "difficulty": 3,
        "cognitive_operations": ["application", "micro_discrimination"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Fact Variants. Total items: {len(all_items)}")

# Summary count verification
counts_by_type = {}
for it in all_items:
    t = it["item_type"]
    counts_by_type[t] = counts_by_type.get(t, 0) + 1

print("\n--- Summary of Seed Items ---")
for t, c in counts_by_type.items():
    print(f"  {t}: {c}")
print(f"Total Items: {len(all_items)}")

# Now generate server/seedData.ts content
topic = {
    "id": "topic_seguridad_social_tema_7",
    "name": "Seguridad Social - Tema 7: Régimen General y Acción Protectora",
    "description": "Acción protectora, prescripción, caducidad, automaticidad, coeficientes, responsabilidades empresariales e importes 2026.",
    "source_file": "Diapositivas Tema 7 SS.pdf",
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
}

source_chunks = [
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
]

# Write out to server/seedData.ts
ts_content = f"""import {{ Topic, SourceChunk, Atom, Cluster, ConfusionPair, Item }} from '../src/types';

export const seedTopic: Topic = {json.dumps(topic, indent=2, ensure_ascii=False)};

export const seedSourceChunks: SourceChunk[] = {json.dumps(source_chunks, indent=2, ensure_ascii=False)};

export const seedClusters: Cluster[] = {json.dumps(clusters, indent=2, ensure_ascii=False)};

export const seedConfusionPairs: ConfusionPair[] = {json.dumps(pairs, indent=2, ensure_ascii=False)};

export const seedAtoms: Atom[] = {json.dumps(atoms, indent=2, ensure_ascii=False)};

export const seedItems: Item[] = {json.dumps(all_items, indent=2, ensure_ascii=False)};
"""

target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "server", "seedData.ts"))
with open(target_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully wrote full dataset to {target_path}")
