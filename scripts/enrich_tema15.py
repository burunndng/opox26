#!/usr/bin/env python3
"""Enrich Tema 15 MCQ items with the pedagogical content from the official
question file's '## Explicaciones' section.

Source of truth: the Tema 15 slides (Ley 39/2015, Ley 40/2015, RD 203/2021),
summarised per item in:
  OPOSICIONES/Tema  15  general/tema15_test_61_questions.md

Outputs:
  - server/seedDataTema15.ts (regenerated, enriched)
  - data/oposilab.db (live SQLite used by the dev server)
  - ../oposilab-mcq-trainer/data/oposilab.db.json (secondary copy, if present)
"""

import json
import re
import sqlite3
from pathlib import Path

HOME = Path.home()
TEST_MD = HOME / "Documents/OPOSICIONES/Tema  15  general/tema15_test_61_questions.md"
REPO = HOME / "Documents/Notesnook/oposilab-mcq-trainer"
DB_PATH = REPO / "data/oposilab.db"
SEED_PATH = REPO / "server/seedDataTema15.ts"
JSON_COPY = HOME / "Documents/oposilab-mcq-trainer/data/oposilab.db.json"

TOPIC_ID = "topic_tema15"
TOPIC_NAME = "Tema 15 (bloque general) — Acto administrativo, validez, notificación y órganos"
TOPIC_DESCRIPTION = (
    "Concepto y clases; elementos; abstención/recusación; invalidez; "
    "validez/eficacia/motivación; notificación/publicación; órganos administrativos/"
    "competencia/colegiados."
)

LEGAL_BASIS = {
    1: "Ley 39/2015",
    2: "Ley 39/2015",
    3: "Ley 39/2015",
    4: "Ley 39/2015",
    5: "Ley 39/2015",
    6: "Art. 23.1 Ley 40/2015",
    7: "Art. 24.3 Ley 40/2015",
    8: "Arts. 24.4 y 24.5 Ley 40/2015",
    9: "Arts. 23.4 y 23.5 Ley 40/2015",
    10: "Ley 39/2015",
    11: "Ley 39/2015",
    12: "Art. 47.1.a Ley 39/2015",
    13: "Art. 47.1.b Ley 39/2015",
    14: "Art. 47.1.e Ley 39/2015",
    15: "Art. 48.1 Ley 39/2015",
    16: "Art. 48.2 Ley 39/2015",
    17: "Art. 52.1 Ley 39/2015",
    18: "Art. 52.3 Ley 39/2015",
    19: "Art. 39.1 Ley 39/2015",
    20: "Art. 39.3 Ley 39/2015",
    21: "Art. 35.1.d Ley 39/2015",
    22: "Art. 35.2 Ley 39/2015",
    23: "Art. 50 Ley 39/2015",
    24: "Arts. 37.1 y 37.2 Ley 39/2015",
    25: "Art. 40.2 Ley 39/2015",
    26: "Art. 40.2 Ley 39/2015",
    27: "Art. 40.3 Ley 39/2015",
    28: "Art. 42.2 Ley 39/2015",
    29: "Art. 42.2 Ley 39/2015",
    30: "Art. 43.2 Ley 39/2015",
    31: "Art. 43.2 Ley 39/2015",
    32: "Art. 41.6 Ley 39/2015 · Art. 43 RD 203/2021",
    33: "Art. 41.2.a Ley 39/2015",
    34: "Art. 44 Ley 39/2015",
    35: "Arts. 45.1.a y 45.1.b Ley 39/2015",
    36: "Art. 45.1.b Ley 39/2015",
    37: "Art. 46 Ley 39/2015",
    38: "Art. 45.4 Ley 39/2015",
    39: "Art. 42.4 RD 203/2021",
    40: "Art. 42.2 RD 203/2021",
    41: "Art. 5.1 Ley 40/2015",
    42: "Art. 5.3 Ley 40/2015",
    43: "Art. 5.4 Ley 40/2015",
    44: "Art. 6.2 Ley 40/2015",
    45: "Art. 9.1 Ley 40/2015",
    46: "Art. 9.2.b Ley 40/2015",
    47: "Art. 9.4 Ley 40/2015",
    48: "Art. 9.5 Ley 40/2015",
    49: "Art. 9.5 Ley 40/2015",
    50: "Arts. 10.1 y 10.2 Ley 40/2015",
    51: "Art. 11.1 Ley 40/2015",
    52: "Art. 11.2 Ley 40/2015",
    53: "Art. 12.2 Ley 40/2015",
    54: "Art. 13.1 Ley 40/2015",
    55: "Art. 20.1 Ley 40/2015",
    56: "Art. 17.2 Ley 40/2015",
    57: "Art. 17.5 Ley 40/2015",
    58: "Art. 17.4 Ley 40/2015",
    59: "Art. 22.2 Ley 40/2015",
    60: "Art. 22.3 Ley 40/2015",
    61: "Art. 16.2 Ley 40/2015",
}

TRAP_CODE_TO_TYPE = {
    "NUM": "numeric_substitution",
    "PART": "partial_rule_accuracy",
    "MERGE": "conceptual_merger",
    "TEMP": "temporal_confusion",
    "BODY": "wrong_competent_body",
    "EXC": "exception_ignored",
    "ABS": "overbroad_statement",
    "NARROW": "hyper_narrow_statement",
    "FACT": "factual_misapplication",
    "IRREL": "true_but_irrelevant",
    "WORD": "familiar_wording_trap",
    "SIGN": "rule_exception_swap",
}

# Editorial length-parity rework (seed-integrity F3): the source test's correct
# options carry full legal precision, so the distractors are lengthened with
# plausible motive clauses (consistent with their fault) until option length
# carries no signal. Correct options keep their original wording.
OPTION_TEXT_OVERRIDES = {
    6: {
        "A": "El interesado afectado por la causa, que debe comunicarlo por escrito a su superior inmediato",
        "B": "Solo los titulares de los órganos colegiados, cuando hayan de intervenir como órgano competente",
        "D": "Únicamente el superior jerárquico del órgano instructor, a instancia del interesado afectado",
    },
    8: {
        "A": "En diez días hábiles contados desde la notificación de la recusación, y cabe recurso de alzada ante el superior",
        "B": "En tres días; cabe recurso potestativo de reposición ante el mismo órgano que resolvió la recusación",
        "C": "En tres días; cabe recurso de alzada ante el superior del órgano que tramita el procedimiento",
    },
    9: {
        "A": "Nulidad de pleno derecho de todos los actos en que hubiera intervenido, por aplicación directa del art. 47.1",
        "C": "Anulabilidad automática de los actos, sin posibilidad de convalidación, al tratarse de un vicio grave",
        "D": "Ninguna, porque la abstención es una facultad del empleado público y no un deber jurídico",
    },
    11: {
        "A": "Por escrito, en soporte papel, salvo que la ley exija forma verbal, por ser el papel el medio ordinario de constancia",
        "B": "Verbalmente, con constancia escrita posterior en el expediente, bastando la firma del titular en la diligencia",
        "C": "Por escrito, en todo caso y sin excepción alguna, cualquiera que sea la naturaleza o el contenido del acto",
    },
    15: {
        "A": "Solo los que infringen una norma con rango de Ley, incluidos sus reglamentos de desarrollo",
        "B": "Solo los que presentan defectos de forma causantes de indefensión al interesado en el procedimiento",
        "D": "Los que carecen de los requisitos esenciales para adquirir facultades o derechos, aun sin resolución expresa",
    },
    16: {
        "B": "Siempre, porque todo defecto de forma es causa de nulidad de pleno derecho del acto administrativo",
        "C": "Nunca, porque los defectos de forma son irrelevantes si el acto alcanza su fin",
        "D": "Cuando el acto se notifica fuera de plazo, pues la notificación tardía altera el fin del acto",
    },
    17: {
        "A": "Los actos nulos y los anulables, de oficio o a instancia de parte",
    },
    18: {
        "A": "El órgano que dictó el acto, de oficio, porque quien dictó el acto conoce el vicio y puede subsanarlo",
        "C": "Cualquier órgano de la misma Administración, incluso los de inferior jerarquía",
    },
    20: {
        "D": "Sí, en todo caso, porque la retroactividad es la regla general de la eficacia del acto",
    },
    22: {
        "A": "Se rige por la Ley 39/2015 de forma idéntica a la de cualquier otro acto administrativo, sin especialidad alguna en su motivación",
        "B": "No es exigible, por tratarse de actos de ejecución de las bases de la convocatoria, que ya motivan la decisión adoptada",
        "C": "Debe incluir la motivación completa conforme al régimen común del art. 35 de la Ley 39/2015, sin remisión alguna a la convocatoria",
    },
    26: {
        "A": "Solo la parte dispositiva, si el acto es favorable al interesado, por resultar lo decidido suficientemente expresivo",
        "C": "Solo la mención de los recursos judiciales, ya que los administrativos son potestativos y no requieren indicación expresa",
        "D": "Un resumen de los fundamentos jurídicos y de la parte dispositiva, sin mención de los recursos ni del órgano competente",
    },
    27: {
        "A": "Desde el envío de la notificación al domicilio del interesado, aunque este no llegue a recibirla personalmente",
        "B": "Nunca; debe repetirse íntegramente la notificación con la indicación de los recursos omitidos para que el acto sea eficaz",
        "D": "Desde la fecha en que se dictó el acto, ya que la omisión de recursos no perjudica al interesado",
    },
    28: {
        "A": "Cualquier persona mayor de dieciocho años que conviva con el interesado, sin necesidad de acreditar su identidad",
        "B": "Solo un familiar de primer grado, por ser quien mejor conoce la situación del interesado",
        "C": "Un vecino, si lo acepta expresamente por escrito y firma la diligencia de notificación",
    },
    29: {
        "A": "A las 12:00 horas del mismo día, porque basta con dejar constancia del segundo intento",
        "D": "A las 11:00 horas del día siguiente, al no haberse superado el margen de tres horas",
    },
    33: {
        "B": "La que se refiere a un procedimiento iniciado de oficio, por su propia naturaleza",
        "D": "La que contiene un acto favorable para el interesado, como una subvención",
    },
    35: {
        "B": "Siempre que se publique en el «Boletín Oficial del Estado» o, en su caso, en el boletín oficial de la comunidad autónoma donde haya de surtir efectos",
        "C": "Cuando así lo solicite el interesado y se publique además en el portal de transparencia de la Administración actuante",
        "D": "Solo en los procedimientos sancionadores y en los de responsabilidad patrimonial, por la complejidad de su tramitación",
    },
    37: {
        "A": "No publica nada y anula el procedimiento, retrotrayéndolo al momento en que se intentó la notificación",
        "B": "Publica en el BOE el contenido íntegro del acto, sin indicar el lugar de comparecencia de los interesados, por seguridad jurídica",
        "D": "Publica el acto en el tablón de anuncios del Ayuntamiento del domicilio del interesado, por ser el único medio previsto",
    },
    39: {
        "A": "Diez días naturales contados desde la defunción, conforme al plazo general de comunicación al órgano competente",
        "B": "Quince días naturales desde la efectividad de la sucesión, computados sin excluir sábados ni festivos",
        "C": "Un mes desde la inscripción de la defunción en el Registro Civil, por analogía con otros plazos de comunicación",
    },
    41: {
        "B": "Todas las unidades de la Administración, con independencia de sus funciones, ya que toda unidad forma parte del organigrama",
        "C": "Solo los órganos colegiados de la Administración General del Estado, por tener competencias decisorias propias",
        "D": "Los servicios que prestan únicamente asistencia material, sin efectos frente a terceros, aunque gestionen medios personales",
    },
    42: {
        "A": "Aprobación previa del Consejo de Estado, por tratarse de la creación de un órgano administrativo de nueva planta",
        "C": "Informe favorable de la Intervención General de la Administración del Estado, al exigirse control financiero previo",
        "D": "Un mínimo de tres personas adscritas a sus funciones, para garantizar su operatividad y continuidad",
    },
    43: {
        "A": "No existe otro en otra Administración que desarrolle funciones similares, con independencia de cual sea",
        "B": "El nuevo órgano tendrá al menos cinco miembros, como garantía de pluralidad en su funcionamiento",
    },
    44: {
        "A": "Anulabilidad de todos los actos dictados tras el incumplimiento, por vicio de desviación de poder",
        "B": "Responsabilidad patrimonial del superior, únicamente, por el daño causado al servicio público",
        "C": "Nulidad de pleno derecho de los actos dictados, por aplicación del art. 47.1 de la Ley 39/2015",
    },
    45: {
        "A": "Es renunciable por acuerdo motivado del órgano titular y publicado en el diario oficial correspondiente",
        "B": "Es renunciable solo si lo autoriza una norma reglamentaria de desarrollo de la Ley 40/2015",
        "D": "Es transferible a otra Administración mediante convenio para su ejercicio por la cesionaria",
    },
    47: {
        "A": "Se considera dictada por el órgano delegado, por ser el órgano que materialmente resuelve",
        "C": "Se considera dictada por el órgano delegante, sin necesidad de indicar la delegación ni su publicación",
        "D": "Es nula de pleno derecho si la delegación no se publicó previamente a la resolución",
    },
    50: {
        "A": "Cualquier órgano, por simple decisión de su titular, al decidir este sobre su propia competencia",
        "C": "Solo el órgano delegado, cuando la delegación se haya publicado, conforme a las reglas del art. 9",
        "D": "Los órganos superiores, mediante acuerdo no motivado, cuando se trate de un asunto técnico, bastando la exposición de motivos",
    },
    51: {
        "A": "Actividades de carácter material o técnico de la competencia del órgano, siempre que se acredite su carácter instrumental",
        "B": "Actividades para las que no se posean medios técnicos idóneos, por tratarse de una carencia sobrevenida",
        "D": "Actividades que se encomiendan a un órgano de otra Administración, previo convenio entre ambas",
    },
    53: {
        "A": "Altera la competencia del órgano delegante, al trasladarse su ejercicio al órgano firmante",
        "B": "Requiere su publicación en el BOE para ser válida, como garantía de publicidad para los interesados",
        "C": "Puede hacerse en órganos que no dependan jerárquicamente del delegante, siempre que exista acuerdo previo",
    },
    54: {
        "A": "Solo en caso de vacante definitiva, por ser el único supuesto contemplado expresamente en la ley",
        "C": "Solo cuando el titular renuncie a su cargo, previa aceptación expresa del sustituto",
        "D": "En caso de vacante, ausencia o enfermedad, pero siempre con publicación en el BOE para general conocimiento",
    },
    56: {
        "A": "La mayoría absoluta de sus miembros, incluyendo expresamente al Presidente y al Secretario",
        "C": "La totalidad de sus miembros, con independencia de que existan vacantes",
        "D": "El Presidente y, al menos, un tercio de los miembros que integran el órgano",
    },
    58: {
        "A": "Sí, siempre que lo proponga el Presidente, por ser el orden del día una propuesta suya",
        "B": "Sí, si la mayoría lo declara urgente, aunque no asistan todos los miembros, cuando el asunto sea de interés general",
        "C": "Sí, sin limitación, cuando la sesión se celebre a distancia, al equipararse a la presencial",
    },
    60: {
        "B": "Por Real Decreto, con publicación en el BOE, y con efectos directos frente a terceros, en atención a su carácter decisorio",
        "C": "Por Orden ministerial conjunta, y sus acuerdos vinculan a terceros, al formar parte del organigrama ministerial",
        "D": "Por Orden ministerial, y sus acuerdos requieren publicación en el BOE, por su carácter normativo interno",
    },
    61: {
        "A": "Presidir las sesiones en ausencia del Presidente, asumiendo sus funciones en caso de ausencia temporal",
        "C": "Fijar el orden del día de cada sesión, como parte de la preparación de las sesiones",
        "D": "Dirimir los empates con voto de calidad, como ocurre en los órganos colegiados de gobierno",
    },
}

ARTICLE_PREFIX = re.compile(
    r"^(?:Arts?\.\s*[0-9][0-9A-Za-z.]*(?:\s*(?:,|y)\s*(?:arts?\.\s*)?[0-9][0-9A-Za-z.]*)*"
    r"\s*(?:de la Ley \d+/\d+|RD 203/2021)?"
    r"|RD\s*203/2021,\s*art\.\s*[0-9][0-9A-Za-z.]*)"
    r"\s*:\s*"
)


def clean_text(text: str) -> str:
    text = re.sub(r"\s*⚠️\s*fuente interna\.?", "", text)
    text = re.sub(r"\s*\(diap\. [^)]*\)", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_rule(text: str) -> str:
    text = clean_text(text)
    text = ARTICLE_PREFIX.sub("", text).strip()
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    return text


def parse_traps(block: str):
    """Return [(letter, [codes], explanation), ...] parsing balanced parentheses."""
    traps = []
    pattern = re.compile(r"([A-D])\s*=\s*([A-Z]+(?:\s*\+\s*[A-Z]+)*)\s*\(")
    pos = 0
    while True:
        match = pattern.search(block, pos)
        if not match:
            break
        start = match.end()
        depth = 1
        cursor = start
        while cursor < len(block) and depth:
            if block[cursor] == "(":
                depth += 1
            elif block[cursor] == ")":
                depth -= 1
            cursor += 1
        if depth != 0:
            raise ValueError(f"Unbalanced trap parentheses near: {block[match.start():max(0, match.start()+120)]!r}")
        explanation = re.sub(r"\s+", " ", block[start:cursor - 1]).strip().rstrip(".")
        if explanation and explanation[0].islower():
            explanation = explanation[0].upper() + explanation[1:]
        if explanation and explanation[-1] not in ".!?":
            explanation += "."
        traps.append((match.group(1), [c.strip() for c in match.group(2).split("+")], explanation))
        pos = cursor
    return traps


def parse_explanations():
    md = TEST_MD.read_text(encoding="utf-8")
    section = md.split("## Explicaciones", 1)[1].split("## Verificación", 1)[0]
    entries = {}
    for match in re.finditer(r"^\*\*(\d+)\.\*\* \*\*Correcta: ([A-D])\.\*\* (.+)$", section, re.M):
        number = int(match.group(1))
        correct = match.group(2)
        body = match.group(3).strip()

        if body.count("Trampas:") != 1:
            raise ValueError(f"Item {number}: expected exactly one 'Trampas:' marker")

        before_traps, after_traps = body.split("Trampas:", 1)
        pista = ""
        pista_match = re.search(r"\bPista:\s*(.+)$", after_traps)
        if pista_match:
            pista = clean_text(pista_match.group(1))
            pista = re.sub(r"^[🧩\s]+", "", pista)
            after_traps = after_traps[: pista_match.start()]

        traps = parse_traps(after_traps)
        expected_letters = set("ABCD") - {correct}
        if {t[0] for t in traps} != expected_letters:
            raise ValueError(
                f"Item {number}: trap letters {sorted(t[0] for t in traps)} != expected {sorted(expected_letters)}"
            )
        for letter, codes, _ in traps:
            for code in codes:
                if code not in TRAP_CODE_TO_TYPE:
                    raise ValueError(f"Item {number}: unknown trap code {code!r}")

        entries[number] = {
            "correct": correct,
            "rule": clean_rule(before_traps),
            "pista": pista,
            "traps": traps,
        }

    missing = sorted(set(range(1, 62)) - set(entries))
    if missing:
        raise ValueError(f"Missing explanations: {missing}")
    return entries


def ts_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
    )


def build_options(options, traps, correct_letter, overrides=None):
    overrides = overrides or {}
    trap_by_letter = {letter: (codes, text) for letter, codes, text in traps}
    enriched = []
    for option in options:
        entry = {
            "id": option["id"],
            "text": overrides.get(option["id"], option["text"]),
            "is_correct": option["is_correct"],
        }
        if not option["is_correct"]:
            codes, explanation = trap_by_letter[option["id"]]
            entry["trap_type"] = TRAP_CODE_TO_TYPE[codes[0]]
            entry["explanation"] = explanation
        enriched.append(entry)
    return enriched


def build_enrichment(entries):
    enrichment = {}
    for number, data in entries.items():
        traps = data["traps"]
        mapped = []
        for _, codes, _ in traps:
            mapped_type = TRAP_CODE_TO_TYPE[codes[0]]
            if mapped_type not in mapped:
                mapped.append(mapped_type)
        enrichment[number] = {
            "correct_answer": data["correct"],
            "legal_basis": LEGAL_BASIS[number],
            "rule_statement": data["rule"],
            "corrective_rule": data["pista"],
            "distractor_analysis": {letter: text for letter, _, text in traps},
            "trap_types": mapped,
            "trap_by_letter": {letter: text for letter, _, text in traps},
        }
    return enrichment


def update_topic():
    con = sqlite3.connect(DB_PATH)
    updated = con.execute(
        "UPDATE topics SET name = ?, description = ? WHERE id = ?",
        (TOPIC_NAME, TOPIC_DESCRIPTION, TOPIC_ID),
    ).rowcount
    con.commit()
    con.close()
    if updated != 1:
        raise ValueError(f"Expected to update 1 topic, updated {updated}")


def update_sqlite(entries, enrichment):
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, correct_answer, options FROM items WHERE topic_id = ? ORDER BY CAST(substr(id, 10) AS INTEGER)",
        (TOPIC_ID,),
    ).fetchall()
    if len(rows) != 61:
        raise ValueError(f"Expected 61 tema15 items in SQLite, found {len(rows)}")
    for row in rows:
        number = int(row["id"].rsplit("-", 1)[1])
        data = enrichment[number]
        if row["correct_answer"] != data["correct_answer"]:
            raise ValueError(
                f"{row['id']}: DB answer {row['correct_answer']} != source {data['correct_answer']}"
            )
        options = json.loads(row["options"])
        enriched_options = build_options(
            options,
            entries[number]["traps"],
            data["correct_answer"],
            OPTION_TEXT_OVERRIDES.get(number),
        )
        con.execute(
            """UPDATE items
               SET options = ?, legal_basis = ?, rule_statement = ?, why_correct = ?,
                   distractor_analysis = ?, trap_types = ?, corrective_rule = ?
               WHERE id = ?""",
            (
                json.dumps(enriched_options, ensure_ascii=False),
                data["legal_basis"],
                data["rule_statement"],
                "",
                json.dumps(data["distractor_analysis"], ensure_ascii=False),
                json.dumps(data["trap_types"], ensure_ascii=False),
                data["corrective_rule"],
                row["id"],
            ),
        )
    con.commit()
    con.close()


def regenerate_seed(entries, enrichment):
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, stem, options, correct_answer FROM items WHERE topic_id = ? ORDER BY CAST(substr(id, 10) AS INTEGER)",
        (TOPIC_ID,),
    ).fetchall()
    con.close()
    if len(rows) != 61:
        raise ValueError(f"Expected 61 tema15 items in SQLite, found {len(rows)}")

    lines = [
        "import { Topic, SourceChunk, Item } from '../src/types.ts';",
        "const TOPIC = 'topic_tema15';",
        "const now = '2026-10-14T13:00:00Z';",
        "export const seedTopicTema15: Topic = {"
        "id:TOPIC,"
        f"name:'{ts_escape(TOPIC_NAME)}',"
        f"description:'{ts_escape(TOPIC_DESCRIPTION)}',"
        "source_file:'tema15_test_61_questions.md',"
        "status:'active',created_at:now,updated_at:now};",
        "export const seedSourceChunksTema15: SourceChunk[] = [];",
        "export const seedItemsTema15: Item[] = [",
    ]

    for row in rows:
        number = int(row["id"].rsplit("-", 1)[1])
        data = enrichment[number]
        options = json.loads(row["options"])
        enriched_options = build_options(
            options,
            entries[number]["traps"],
            data["correct_answer"],
            OPTION_TEXT_OVERRIDES.get(number),
        )

        option_literals = []
        for option in enriched_options:
            parts = [
                f"id:'{ts_escape(option['id'])}'",
                f"text:'{ts_escape(option['text'])}'",
                f"is_correct:{str(option['is_correct']).lower()}",
            ]
            if "trap_type" in option:
                parts.append(f"trap_type:'{option['trap_type']}'")
            if "explanation" in option:
                parts.append(f"explanation:'{ts_escape(option['explanation'])}'")
            option_literals.append("{" + ",".join(parts) + "}")

        distractor_literal = "{"
        distractor_literal += ",".join(
            f"'{ts_escape(letter)}':'{ts_escape(text)}'"
            for letter, text in data["distractor_analysis"].items()
        )
        distractor_literal += "}"
        trap_types_literal = "[" + ",".join(f"'{t}'" for t in data["trap_types"]) + "]"

        lines.append(
            "  {"
            f"id:'{row['id']}',"
            f"topic_id:'{TOPIC_ID}',"
            "item_type:'cover_and_generate_mcq',"
            f"stem:'{ts_escape(row['stem'])}',"
            f"options:[{','.join(option_literals)}],"
            f"correct_answer:'{data['correct_answer']}',"
            f"legal_basis:'{ts_escape(data['legal_basis'])}',"
            f"rule_statement:'{ts_escape(data['rule_statement'])}',"
            "why_correct:'',"
            f"distractor_analysis:{distractor_literal},"
            f"trap_types:{trap_types_literal},"
            f"corrective_rule:'{ts_escape(data['corrective_rule'])}',"
            "cognitive_operations:['micro_discrimination','calibrated_decision','exception_detection'],"
            "difficulty:2,status:'validated',source:'manual',"
            "created_at:'2026-10-14T13:00:00Z',updated_at:'2026-10-14T13:00:00Z'},"
        )

    lines.append("];")
    SEED_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def update_json_copy(entries, enrichment):
    if not JSON_COPY.exists():
        return
    data = json.loads(JSON_COPY.read_text(encoding="utf-8"))
    topics = data.get("topics", [])
    for topic in topics:
        if topic.get("id") == TOPIC_ID:
            topic["name"] = TOPIC_NAME
            topic["description"] = TOPIC_DESCRIPTION
    updated = 0
    for item in data.get("items", []):
        if item.get("topic_id") != TOPIC_ID:
            continue
        number = int(item["id"].rsplit("-", 1)[1])
        info = enrichment[number]
        item["legal_basis"] = info["legal_basis"]
        item["rule_statement"] = info["rule_statement"]
        item["why_correct"] = ""
        item["distractor_analysis"] = info["distractor_analysis"]
        item["trap_types"] = info["trap_types"]
        item["corrective_rule"] = info["corrective_rule"]
        item["options"] = build_options(
            item["options"],
            entries[number]["traps"],
            info["correct_answer"],
            OPTION_TEXT_OVERRIDES.get(number),
        )
        updated += 1
    if updated != 61:
        raise ValueError(f"Expected 61 tema15 items in JSON copy, found {updated}")
    JSON_COPY.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    entries = parse_explanations()
    enrichment = build_enrichment(entries)
    update_topic()
    update_sqlite(entries, enrichment)
    regenerate_seed(entries, enrichment)
    update_json_copy(entries, enrichment)

    # Verification: nothing placeholder-like may survive in user-facing fields.
    seed = SEED_PATH.read_text(encoding="utf-8")
    banned = [
        "diapositivas",
        "fuente interna",
        "segun diapositivas",
        "Consultar diapositivas",
        "Trampa: distractor",
    ]
    for phrase in banned:
        if phrase.lower() in seed.lower():
            raise SystemExit(f"Placeholder text still present: {phrase!r}")

    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, options, rule_statement, corrective_rule, distractor_analysis FROM items WHERE topic_id = ?",
        (TOPIC_ID,),
    ).fetchall()
    con.close()
    if len(rows) != 61:
        raise SystemExit(f"Expected 61 items, found {len(rows)}")
    for row in rows:
        for field in ("rule_statement", "distractor_analysis"):
            value = row[field]
            if not value or (field != "distractor_analysis" and "diapositivas" in value.lower()):
                raise SystemExit(f"{row['id']}: invalid {field}")
        analysis = json.loads(row["distractor_analysis"])
        if len(analysis) != 3:
            raise SystemExit(f"{row['id']}: expected 3 distractor explanations, got {len(analysis)}")
        options = json.loads(row["options"])
        wrong = [o for o in options if not o.get("is_correct")]
        if len(wrong) != 3:
            raise SystemExit(f"{row['id']}: expected 3 distractors, got {len(wrong)}")
        for option in wrong:
            if not option.get("explanation") or not option.get("trap_type"):
                raise SystemExit(f"{row['id']} option {option.get('id')}: missing trap feedback")
            if option["id"] not in analysis:
                raise SystemExit(f"{row['id']}: distractor_analysis missing key {option['id']}")
    # Length parity (seed-integrity F3): the correct option must not exceed
    # 1.25x the mean distractor length, so option length carries no signal.
    parity_failures = []
    worst = (0.0, "")
    for row in rows:
        options = json.loads(row["options"])
        correct = next(o for o in options if o.get("is_correct"))
        wrong = [o for o in options if not o.get("is_correct")]
        correct_len = len(correct["text"].strip())
        mean_wrong = sum(len(o["text"].strip()) for o in wrong) / len(wrong)
        ratio = correct_len / mean_wrong
        if ratio > worst[0]:
            worst = (ratio, row["id"])
        if ratio > 1.25:
            parity_failures.append(f"{row['id']} ({ratio:.2f})")
    if parity_failures:
        raise SystemExit(f"F3 length-parity violations: {', '.join(parity_failures)}")
    print(f"Length parity ok (worst ratio {worst[0]:.2f} at {worst[1]}).")
    print(f"Done: {len(rows)} items enriched (SQLite + seed + JSON copy).")


if __name__ == "__main__":
    main()
