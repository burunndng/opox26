import sys
import os
import json

sys.path.append(os.path.dirname(__file__))
from generate_seed_data import clusters, pairs, atoms
from append_items import items as mcq_items

all_items = list(mcq_items)

# 2. Generate 20 Cloze items
cloze_specs = [
    ("item-cloze-1", "El derecho al reconocimiento de las prestaciones prescribirá a los {{c1::5 años}}, contados desde el día siguiente a aquel en que tenga lugar el {{c2::hecho causante}}, sin perjuicio de que los efectos se retrotraigan a los {{c3::3 meses}} anteriores a la solicitud.", "5 años", ["cinco años"], "hecho causante", ["hecho causante de la prestación"], "3 meses", ["tres meses"], "Art. 53.1 TRLGSS", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad"),
    ("item-cloze-2", "El derecho al percibo de las prestaciones a tanto alzado y por una sola vez caducará al {{c1::1 año}}, a contar desde el día siguiente al de la {{c2::notificación}} de la concesión.", "1 año", ["un año"], "notificación", ["notificación de la resolución"], "", [], "Art. 54.1 TRLGSS", "cluster_prescripcion_caducidad", "pair_caducidad_alzado_periodicas"),
    ("item-cloze-3", "En las prestaciones periódicas, el derecho al percibo de cada mensualidad caducará al {{c1::1 año}} de su respectivo {{c2::vencimiento}}.", "1 año", ["un año"], "vencimiento", ["vencimiento mensual"], "", [], "Art. 54.2 TRLGSS", "cluster_prescripcion_caducidad", "pair_caducidad_alzado_periodicas"),
    ("item-cloze-4", "Son legalmente imprescriptibles el derecho al reconocimiento de las pensiones de {{c1::jubilación}} y de {{c2::incapacidad permanente}}.", "jubilación", ["pensión de jubilación"], "incapacidad permanente", ["IP"], "", [], "Art. 53.3 TRLGSS", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad"),
    ("item-cloze-5", "La obligación de reintegrar las prestaciones indebidamente percibidas prescribirá a los {{c1::4 años}}, contados a partir de la fecha de su {{c2::cobro}}.", "4 años", ["cuatro años"], "cobro", ["percepción"], "", [], "Art. 55.1 TRLGSS", "cluster_prescripcion_caducidad", "pair_prescripcion_caducidad"),
    ("item-cloze-6", "A los trabajadores fijos-discontinuos se les aplicará un coeficiente del {{c1::1,5}} a cada día cotizado, con el límite máximo de los días naturales del {{c2::año}}.", "1,5", ["1.5", "uno y medio"], "año", ["año natural"], "", [], "Art. 247 TRLGSS", "cluster_coeficientes", "pair_fijo_discontinuo_contrato_corto"),
    ("item-cloze-7", "En contratos temporales de duración igual o inferior a 5 días, cada día computa como {{c1::1,4}} días cotizados, con tope de los días naturales del {{c2::mes}}.", "1,4", ["1.4"], "mes", ["mes natural"], "", [], "Art. 249 bis TRLGSS", "cluster_coeficientes", "pair_fijo_discontinuo_contrato_corto"),
    ("item-cloze-8", "Por cada parto simple se computarán {{c1::112 días}} de cotización ficticia en beneficio de la madre trabajadora sin necesidad de cotización previa.", "112 días", ["112"], "", [], "", [], "Art. 235 TRLGSS", "cluster_beneficios_parto", "pair_fijo_discontinuo_contrato_corto"),
    ("item-cloze-9", "En caso de parto múltiple, se sumarán {{c1::14 días}} adicionales por cada hijo a partir del segundo.", "14 días", ["14"], "", [], "", [], "Art. 235 TRLGSS", "cluster_beneficios_parto", "pair_fijo_discontinuo_contrato_corto"),
    ("item-cloze-10", "Para 2026, la revalorización de las pensiones contributivas de la Seguridad Social se fija con carácter general en el {{c1::2,7%}}.", "2,7%", ["2.7%", "2,7 por ciento", "2.7 por ciento"], "", [], "", [], "Art. 58 TRLGSS", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima"),
    ("item-cloze-11", "La cuantía máxima de las pensiones de la Seguridad Social para 2026 asciende a {{c1::3.359,60 €}} mensuales.", "3.359,60 €", ["3359,60 €", "3359.60", "3.359,60 euros"], "", [], "", [], "Art. 58 TRLGSS", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima"),
    ("item-cloze-12", "La pensión no contributiva íntegra de jubilación e invalidez se fija para 2026 en {{c1::8.803,20 €}} anuales.", "8.803,20 €", ["8803,20 €", "8803.20", "8.803,20 euros"], "", [], "", [], "Art. 363 TRLGSS", "cluster_importes_2026", "pair_contributiva_no_contributiva"),
    ("item-cloze-13", "El límite de ingresos para tener derecho al complemento a mínimos sin cónyuge a cargo en 2026 es de {{c1::9.442,00 €}} al año.", "9.442,00 €", ["9442,00 €", "9442.00", "9.442 euros"], "", [], "", [], "Art. 59 TRLGSS", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima"),
    ("item-cloze-14", "El límite de ingresos para complemento a mínimos con cónyuge a cargo en 2026 se sitúa en {{c1::11.013,00 €}} anuales.", "11.013,00 €", ["11013,00 €", "11013.00", "11.013 euros"], "", [], "", [], "Art. 59 TRLGSS", "cluster_importes_2026", "pair_complemento_minimos_pension_maxima"),
    ("item-cloze-15", "Son inembargables los salarios, sueldos o pensiones que no excedan de la cuantía señalada para el {{c1::SMI}}.", "SMI", ["Salario Mínimo Interprofesional", "salario mínimo"], "", [], "", [], "Art. 44 TRLGSS", "cluster_intangibilidad_embargo", "pair_inembargabilidad_smi_escala_lec"),
    ("item-cloze-16", "La primera cuantía adicional de pensión que supere el SMI hasta el doble del SMI se embarga en un {{c1::30%}}.", "30%", ["30 por ciento", "treinta por ciento"], "", [], "", [], "Art. 607.2 LEC", "cluster_intangibilidad_embargo", "pair_inembargabilidad_smi_escala_lec"),
    ("item-cloze-17", "El recargo de prestaciones económicas por infracción de medidas de seguridad oscila entre el {{c1::30%}} y el {{c2::50%}}.", "30%", ["30 por ciento"], "50%", ["50 por ciento"], "", [], "Art. 164 TRLGSS", "cluster_recargo_medidas", "pair_recargo_aseguramiento_medidas"),
    ("item-cloze-18", "La invitación al pago de cuotas debidas concede al responsable un plazo improrrogable de {{c1::30 días naturales}} para abonarlas.", "30 días naturales", ["30 días", "treinta días naturales"], "", [], "", [], "Art. 47.1 TRLGSS", "cluster_requisitos_generales", "pair_aplazamiento_corriente_incumplimiento"),
    ("item-cloze-19", "Las pensiones contributivas por incapacidad permanente {{c1::absoluta}} y por {{c2::gran invalidez}} están exentas de tributar en el IRPF.", "absoluta", ["IP absoluta"], "gran invalidez", ["GI"], "", [], "Art. 7 Ley 35/2006", "cluster_intangibilidad_embargo", "pair_intangibilidad_embargo_irpf"),
    ("item-cloze-20", "La incapacidad temporal tendrá una duración máxima de {{c1::365 días}}, prorrogables expresamente por otros {{c2::180 días}}.", "365 días", ["365"], "180 días", ["180"], "", [], "Art. 169 TRLGSS", "cluster_contingencias", "pair_it_ip")
]

for idx, spec in enumerate(cloze_specs, start=1):
    iid, text, b1_ans, b1_syn, b2_ans, b2_syn, b3_ans, b3_syn, legal, clus, pr = spec
    blanks = [
        {"id": "c1", "correct_answer": b1_ans, "synonyms": b1_syn, "prompt_hint": "Dato jurídico exacto", "explanation": f"El valor exacto según {legal} es {b1_ans}.", "trap_type_if_missed": "numeric_precision"}
    ]
    if b2_ans:
        blanks.append({"id": "c2", "correct_answer": b2_ans, "synonyms": b2_syn, "prompt_hint": "Término legal", "explanation": f"El término exacto según {legal} es {b2_ans}.", "trap_type_if_missed": "conceptual_merger"})
    if b3_ans:
        blanks.append({"id": "c3", "correct_answer": b3_ans, "synonyms": b3_syn, "prompt_hint": "Plazo temporal", "explanation": f"El plazo exacto según {legal} es {b3_ans}.", "trap_type_if_missed": "temporal_confusion"})

    all_items.append({
        "id": iid,
        "topic_id": "topic_seguridad_social_tema_7",
        "cluster_id": clus,
        "confusion_pair_id": pr,
        "item_type": "cloze",
        "stem": f"Completa los términos y cifras exactas en el siguiente precepto legal:\n\n{text}",
        "cloze_data": {
            "template_text": text,
            "blanks": blanks
        },
        "legal_basis": legal,
        "rule_statement": f"Precepto regulado en {legal}.",
        "why_correct": f"Compleción exacta según el texto legal de {legal}.",
        "corrective_rule": f"Memoriza con precisión las magnitudes fijadas en {legal}.",
        "difficulty": 2,
        "cognitive_operations": ["generative_retrieval", "numeric_precision"],
        "status": "validated",
        "source": "manual",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
    })

print(f"Added Clozes. Total items: {len(all_items)}")
