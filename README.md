# OposiLab MCQ Trainer

> **Herramienta cognitiva local-first para preparación de oposiciones de Seguridad Social (tipo test).**  
> Diseñada bajo principios de ciencia del aprendizaje: discriminación jurídica fina, recuperación activa generativa (*cover-and-generate*), análisis de trampas en distractores, descarte de pares de confusión, calibración metacognitiva y repaso espaciado con entrelazado (*interleaving*).

---

## 1. Misión y Fundamentos Cognitivos

A diferencia de los simuladores genéricos de test o exámenes completos pasivos, **OposiLab** no entrena la familiaridad difusa ni la relectura pasiva. Entrena la **precisión discriminativa** entre proposiciones normativas análogas y datos de alta interferencia del Texto Refundido de la Ley General de la Seguridad Social (TRLGSS):

1. **Cover-and-Generate MCQ**: Se ocultan las alternativas y se fuerza a escribir la regla, plazo u órgano de memoria antes de ver las opciones, eliminando la falsa ilusión de competencia por mero reconocimiento visual.
2. **Análisis de Distractores y Trampas**: Cada opción incorrecta clasifica su tipología de trampa (*numeric substitution, temporal confusion, wrong competent body, conceptual merger, exception ignored*, etc.) y la condición hipotética bajo la cual sería correcta.
3. **Pares de Confusión (Confusion Pairs)**: Tratamiento directo de conceptos de alta interferencia (e.g. *Prescripción vs Caducidad*, *Automaticidad Absoluta vs Relativa*, *1,4 vs 1,5 en contratos temporales*).
4. **Matriz de Calibración de Confianza (0 a 3)**: Detección estricta de *Confident-Wrong* (máximo peligro en exámenes con penalización por fallo) y aciertos por azar (*Lucky Recognition*).
5. **Entrelazado (*Interleaving*)**: Bloques mixtos sin etiquetas de tema que impiden el estudio en bloque predecible.
6. **Sin Exámenes Mock en Bloque**: Los simulacros largos fomentan el agotamiento y la pasividad; OposiLab entrena micro-drills de alta intensidad cognitiva.

---

## 2. Instalación y Puesta en Marcha

### Requisitos previos
- Node.js 18+ o superior
- npm

### Pasos de Inicio

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo (puerto 3000)
npm run dev

# 3. Compilar para producción
npm run build
npm start
```

La aplicación estará disponible inmediatamente en `http://localhost:3000`.

---

## 3. Base de Datos y Persistencia Local-First

- **Ubicación:** Toda la base de datos se almacena localmente en `./data/oposilab.db.json`.
- **Inicialización automática:** Al arrancar el servidor por primera vez, si el archivo de base de datos no existe, se inicializa automáticamente con el dataset maestro de **Seguridad Social - Tema 7** (100+ ítems polimórficos, 50+ átomos jurídicos, 15 clusters y 20 pares de confusión).
- **Privacidad Total:** Todos los datos, estadísticas y registros de error permanecen exclusivamente en tu máquina.

---

## 4. Dataset Semilla: Seguridad Social (Tema 7)

El contenido semilla pre-cargado cubre las materias con mayor índice de trampas en examen:
- **Prescripción, Caducidad y Retroactividad:** Art. 53, 54, 57 y 59 TRLGSS (5 años vs 1 año; hecho causante vs notificación vs vencimiento; retroactividad de 3 meses).
- **Importes y Revalorización 2026:** Base máxima 3.359,60 €/mes (47.034,40 €/año), 2,7% contributivas, 8.803,20 € PNC, mínimos y límite de ingresos (9.442 € sin cónyuge / 11.013 € con cónyuge).
- **Coeficientes de Cómputo:** Coeficiente 1,5 en fijos-discontinuos (Art. 247) y 1,4 en contratos temporales ≤ 5 días (Art. 249 bis). Reducción por parto de 112 días (+14 días por hijo a partir del segundo).
- **Escala de Embargos (Art. 607 LEC / Art. 44 TRLGSS):** Inembargabilidad del SMI y tramos escalonados (30%, 50%, 60%, 75%, 90%).
- **Automaticidad:** Absoluta (contingencias profesionales y desempleo) vs Relativa condicionada al alta formal (contingencias comunes, Decreto 21 de abril 1966).
- **Responsabilidad Empresarial:** Directa, solidaria y subsidiaria (subcontratas art. 42 ET, ETTs art. 16.3 Ley 14/1994).
- **Entidades Gestoras y Colaboradoras:** Distribución competencial exacta entre INSS, TGSS, Mutuas Colaboradoras y Empresas Autoaseguradoras.

---

## 5. Formatos de Actividad Implementados

1. **Cover-and-Generate MCQ**: Pregunta de test con opciones ocultas, input de recuperación generativa previa, valoración de confianza y autopsia de distractores.
2. **Cloze / Texto Mutilado**: Recuperación atómica de números, plazos y términos jurídicos con detección de *near-misses* (e.g. confundir meses con años).
3. **Contrast Card / Matriz de Discriminación**: Comparador visual y conceptual entre pares de confusión (objeto, plazo, cómputo, excepción y mini-caso).
4. **Number / Deadline Sorting**: Emparejamiento de conceptos normativos con sus plazos o importes correspondientes, con alternativa para teclado.
5. **Spot-the-Error / Detección de Falsedad**: Enunciado normativo con error sutil donde el usuario selecciona la frase defectuosa y escribe la corrección.
6. **Two-Tier Diagnostic**: Pregunta en 2 niveles (Nivel 1: contenido; Nivel 2: razonamiento jurídico) con mapa de cuadrantes diagnósticos.
7. **Exception Tree**: Árboles de reglas condicionales y enrutamiento de excepciones normativas.
8. **Fact-Variant Case Lab**: Casos prácticos paramétricos donde se altera una variable jurídica y se predice el cambio de efecto legal.
9. **Diagnostic Pretest**: Batería de 10-15 ítems para mapeo de lagunas previas y siembra automática del SRS.
10. **Interleaved Practice Blocks**: Generador de bloques mixtos con restricciones algorítmicas (máximo 2 ítems consecutivos del mismo cluster, inclusión de ambos términos de pares de confusión).

---

## 6. Flujo de Trabajo en Estudio de Contenidos

1. **Importar Texto o PDF:** En la pestaña *Estudio*, pega el texto normativo o sube un archivo. El sistema segmenta el contenido en *Source Chunks*.
2. **Atomizar Proposiciones:** Usa el extractor heurístico de plazos, excepciones y competencias para crear átomos jurídicos con su artículo aplicable.
3. **Mapear Pares y Clusters:** Asocia cada átomo a un cluster conceptual y a un par de confusión.
4. **Generar/Validar Ítems:** Pasa los ítems de estado `draft` a `validated` para que entren en la cola activa de entrenamiento.

---

## 7. Exportación a Anki y Copias de Seguridad

En la pestaña **Exportar / Ajustes**, dispones de exportación con un clic:
- **Exportar a Anki (TSV):** Genera archivos compatibles con Anki con campos enriquecidos (Enunciado, Prompt generativo, Opciones, Base legal, Por qué es correcta, Explicación de distractores A/B/C/D, Tipos de trampa y Regla correctiva).
- **Exportar Banco de Ítems (CSV):** Descarga tabular completa para análisis en hojas de cálculo.
- **Exportar Registro de Errores (CSV):** Listado de fallos clasificados por código de taxonomía (E1-E20).
- **Copia de Seguridad (JSON):** Exporta e importa el estado íntegro de la base de datos local.

---

## 8. Ejecución de Tests Unitarios

Para verificar todos los algoritmos de programación espaciada, entrelazado, validación de calidad y puntuación:

```bash
npm test
```

### Cobertura de Tests:
- Validación de creación de átomos y citas normativas.
- Motor de parsing cloze y detección de fallos cercanos (*near-misses*).
- Chequeo de calidad de ítems de test (longitud de distractores, bases legales ausentes).
- Puntuación de Cover-and-Generate y clasificación de *Confident-Wrong* vs *Lucky Guess*.
- Matriz diagnóstica de 4 cuadrantes en Two-Tier items.
- Algoritmo de Repaso Espaciado (SRS) y criterios de graduación.
- Motor de Entrelazado (*Interleaving Engine*).
- Transiciones del Estudio de Reparación de Errores.
- Formateo de notas TSV para Anki.
