# Session — 2026-11-20 cierre de fiabilidad

- **Objetivo:** cerrar el trabajo de fiabilidad de intentos, arranque, ámbitos vacíos y guardado de sets.
- **Hecho:** intentos idempotentes con rollback ante fallo SQLite; arranque compilado y PDF corregidos; tema vacío conserva el ámbito; sets del Content Studio se guardan atómicamente y se pueden reintentar tras reinicio. Base: `f8dd93b`; los cambios de código se commitean en este lote.
- **Verificado:** árbol de trabajo: `npm run lint` limpio, `npm test` 384/384 en 51 suites, `npm run build` OK; pruebas aisladas de rollback, reintento y replay HTTP tras reinicio. En copia limpia de HEAD `6b6b6a3`: `npm run lint` limpio y `npm test` 378/378 en 50 suites.
- **Siguiente paso:** smoke visual cuando el owner pueda; después reanudar Tier B.
- **Notas:** no cambió contenido del banco; la matriz y Tier B no requieren actualización. El WIP ajeno permanece fuera del commit.
