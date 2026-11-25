# Session — 2026-11-25 banco Tema 4 General (La Corona)

- **Objetivo:** cerrar el hueco de contenido del bloque general de Tema 4 detectado en la clase
  del 23-11, sin solapar con `topic_seguridad_social_tema_4` (cotización) ni con el banco de
  reforma constitucional de Tema 1.
- **Hecho:** topic nuevo `topic_constitucion_tema_4` con 8 chunks, 8 clústeres, 4 pares de
  confusión, 24 átomos y 47 MCQs validados (`item-t4g-1…47`) en `server/seedDataTema4General.ts`,
  escritos desde el resumen de clase y `Resumen T4g (resumen SOLO del pdf).txt`. Registro en
  `server/seedData.ts` y guarda `tests/tema4g-bank.test.ts` (T1–T11). R1 646→693,
  `tema10-bank` T9 y `doc-freshness` X3 ajustados al nuevo tail; bookkeeping en README,
  ACCEPTANCE, CONTENT-COVERAGE, plan §1.21 y brief del guardian.
- **Rigor BOE (verificado en texto consolidado, 2026-11-25):** el aforamiento de la Familia
  Real es art. 55 bis LOPJ (LO 4/2014), **no** art. 58 CE; RD 1368/1987 art. 1 (Majestad y
  consortes), 2 (heredero), 3 (Infantes y merced), 4 (hijos de Infantes), 5 (Regencia) y DT 4.ª
  (Reyes honoríficos); RD 434/1988 art. 8 (clases de personal), 9.1 (alta dirección), 12.2
  (retribuciones), 13.4/13.5 (asistencia/auditoría), disposición adicional única (regalos) y
  13.1 según RD 139/2026 (BOE-A-2026-4514, TIC → Ministerio de Defensa). No se codificó el
  matiz del profesor sobre «español de nacimiento» ni las valoraciones personales del resumen.
- **Verificado:** `npm run lint` limpio; banco T4G 11/11; reconcile 19/19; doc-freshness 3/3;
  `npm test` 395/395 en 52 suites; `npm run build` OK. Claves 12/12/12/11, sin leak ni
  run > 2, ratio de longitud y traps correctos.
- **Siguiente paso:** smoke visual pendiente y Tier B; el matiz «español de nacimiento» sigue
  diferido a falta de anclaje BOE.
- **Notas:** se añadió un ítem más de los 46 aprobados (`item-t4g-47`) para ejercitar el cuarto
  par de confusión (refrendo PG vs Presidente del Congreso), que de otro modo quedaba declarado
  pero sin ítems que lo discriminen.
