# OposiLab MCQ Trainer

> **Herramienta cognitiva local-first para preparar oposiciones de Seguridad Social (tipo test).**
> No es un quiz genérico: entrena discriminación entre reglas casi idénticas, recuperación generativa,
> espaciado, intercalado, análisis de distractores, reparación de errores y calibración metacognitiva.
> Sin simulacros de examen completos, por decisión metodológica (ver *Ayuda / Método* dentro de la app).

Todo vive en tu máquina. La IA es **opcional**: la app funciona al 100 % sin API keys.

---

## Requisitos

- **Node.js ≥ 22.5** (usa el módulo integrado `node:sqlite`). Recomendado: Node 24.
- npm (el proyecto incluye `bun.lock`, pero npm funciona con `--legacy-peer-deps`).

## Instalación y arranque

```bash
npm install --legacy-peer-deps
npm run dev
```

Abre **http://localhost:3000**. La base de datos se inicializa sola en el primer arranque y se cargan
las semillas (Tema 7 de Seguridad Social + Tema 1 CE 1978).

Otros comandos:

```bash
npm run lint     # tsc --noEmit (0 errores exigido)
npm test         # 183 pruebas (node:test vía tsx)
npm run build    # bundle de producción; npm start lo sirve
```

## Base de datos

- **SQLite** en `data/oposilab.db` (WAL), esquema en `server/sqlite/connection.ts`, escritura en una
  transacción por mutación. Los datos de estudio **no** se suben a ningún sitio.
- **Migración desde la antigua base JSON** (si vienes de una versión previa): automática al arrancar;
  el JSON se conserva como `data/oposilab.db.json.migrated.bak`. También manual:
  ```bash
  npx tsx scripts/migrate-json-to-sqlite.ts [ruta/al/oposilab.db.json]
  ```
- Aislar otra base (tests, Copelandias): `OPOSILAB_DATA_DIR=/ruta npm run dev`.
- Copia de seguridad: *Ajustes → Exportar backup JSON* (e *Importar backup* la restaura).

## Content Studio: del texto al banco de reactivos

1. **Importa** un PDF o pega texto (el PDF se extrae **localmente** con pdfjs-dist; si es escaneado
   sin texto, la app te lo dice y sigues pegando el texto).
2. **"Crear fragmentos"** divide el material en *source chunks* con referencia de artículo y página.
3. **"Sugerir átomos (sin IA)"** detecta frases-atómicas por marcadores léxicos (plazos, porcentajes,
   coeficientes, excepciones *salvo/excepto/sin perjuicio*, órganos como INSS/TGSS/mutua…), infiere el
   tipo y la base legal, y los deja como **borrador**.
4. **"Generar Set Completo en 1 clic"** usa la IA (si la configuraste) para extraer clústeres, átomos y
   pares de confusión de interferencia.
5. **Valida antes de activar**: todo lo generado por IA o heurística nace como `draft`; el Item Bank
   marca avisos de calidad (base legal ausente, distractores sin explicación/trampa, duplicados,
   stems negativos, opciones desbalanceadas) y tú decides qué pasa a `validated`/`active`.

## Modos de estudio

| Modo | Para qué |
|---|---|
| **Repaso espaciado (SRS)** | Cola diaria con reaprendizaje sucesivo: 3 aciertos separados, 2 formatos distintos, 1 acierto intercalado, confianza ≥ 2 y sin "confident-wrong" reciente para graduar. |
| **Pretest diagnóstico** | 10 ítems sin etiquetas; al terminar: mapa de clústeres fuertes/débiles, pares de confusión probables, enfoque recomendado y botón **"Reparar ahora"**. |
| **Micro-lección (recuperación primero)** | Lee un fragmento → escribe la regla de memoria → se revela → se compara con los átomos clave; cada fallo genera un ítem de repaso. |
| **Modo A / Modo B** | Codificación con andamiaje (Modo A) antes del reconocimiento baremo −0,25 (Modo B), con requeue de los fallos. |
| **Bloque intercalado** | 10–30 ítems mezclando temas, formatos y mantenimiento; nunca más de 2 seguidos del mismo clúster. |
| **Taller de reparación** | Errores abiertos, confident-wrong y conocimiento frágil; cada tipo de error (E1–E20) se repara con la actividad que lo corrige. |
| **Drill Sniper** | Anti-trampa: solo números, solo confident-wrong o alta interferencia. |

### Atajos de teclado

`Espacio` revelar/seguir · `H` pedir pista · `1–4` elegir opción · `0–3` confianza · `Esc` salir/cerrar · `?` ayuda.

### Confianza (0–3)

`0` azar · `1` corazonada · `2` probable · `3` seguro. Se registra en cada intento y alimenta la
calibración: aciertos con confianza baja = conocimiento frágil; fallos con confianza 3 = errores
conceptuales prioritarios que bloquean la graduación del ítem.

## Analítica (sin pestaña propia)

Las métricas viven **dentro** del panel y del resumen de cada sesión —no en un destino aparte— para que
informen la siguiente decisión de estudio: curva de confianza por nivel, alertas de sobrecalibración,
clústeres débiles, pares a vigilar, matrices numérica/institucional/temporal, mapa de calor de la
sesión y calidad del banco. Activa el **alto contraste** con el botón del Navbar (se guarda en ajustes).

## Exportar e importar

- **Anki** (TSV con los 5 note types), **CSV** de ítems y de errores, **Quizlet** (texto plano),
  informe analítico en **Markdown** y **backup JSON** completo. Todo en *Ajustes → Exportación*.
- Ejemplos reales generados desde la base: `examples/anki_sample.tsv`, `examples/error_log_report.md`.
- Importar: JSON (backup) o CSV/JSON de ítems desde la misma pantalla.

## IA (opcional)

- Configura `GEMINI_API_KEY` / `OPENROUTER_API_KEY` en `.env` (ver `.env.example`) y elige proveedor y
  modelo en *Ajustes*.
- Sin clave (o sin créditos) todo sigue funcionando: el motor Jev cae a su heurística local y el resto
  de la app es idéntico. Ningún contenido generado por IA se activa sin validación humana.

## Arquitectura (y por qué)

- **Vite + React 19 + Express + TypeScript** (se mantuvo frente a la preferencia de Next.js: migrar el
  framework no aportaba nada pedagógicamente y el proyecto ya funcionaba).
- **SQLite con `node:sqlite`** (sin dependencias nativas) en lugar de better-sqlite3: cero compilación,
  una promesa de "un comando" real.
- **Sin Drizzle** y **sin Vitest**: repositorios tipados sobre `node:sqlite` y las 183 pruebas con
  `node:test` cubren lo necesario con menos machinery.
- **Módulos puros y testeados**: `server/scheduler.ts` (SRS + intercalado), `server/heuristics.ts`
  (sugerencias offline), `server/pdfImport.ts`, `src/scoring/evaluateItem.ts`, `src/utils/analytics.ts`,
  `src/utils/retrievalMatch.ts`.
- `docs/ACCEPTANCE.md` traza los 29 criterios de aceptación de la spec a su evidencia.

## Estructura (resumen)

```
server.ts               API Express + Vite
server/                 sqlite/, scheduler, exporter, ai, jev, heuristics, pdfImport, semillas
src/components/         Dashboard, ActivityRunner, ContentStudio, ItemBank, RepairStudio,
                        MicroLessonRunner, PretestDiagnosticMap, AnalyticsStrip, SessionHeatMap…
src/utils/              analytics, retrievalMatch, learningDesignValidator
src/scoring/            evaluateItem (cloze, spot-error, two-tier, number-sort…)
tests/                  183 pruebas (unit + integración)
data/                   SQLite local (no versionado)
examples/               exportaciones reales de ejemplo
docs/                   ACCEPTANCE.md, plans/
```

## Licencia y privacidad

Código abierto y local-first. Tus temarios, intentos y datos de calibración nunca salen de tu equipo
salvo que actives tú el inicio de sesión opcional con Google para sincronizar repasos.
