# Session — 2026-11-20 ámbito y temas vacíos

- **Objetivo:** evitar que un tema sin preguntas elegibles pierda su ámbito y reducir las consultas al cambiar de tema.
- **Hecho:** el arranque sin preguntas conserva el ámbito y avisa; Estudiar muestra el estado vacío y acceso a Contenidos, con CTA desactivado. El banco global carga al inicio y al refrescar, y las estadísticas por tema se consultan por separado con cancelación de respuestas obsoletas. El registro de intentos propaga fallos de SQLite y revierte el estado en memoria. `/api/content-sets` guarda tema, clústeres, átomos, pares y clave idempotente en una transacción; Content Studio conserva el mismo identificador al reintentar la misma selección.
- **Verificado:** `npm run lint` limpio; `npm test` 384/384 en 51 suites; `npm run build` OK. Pruebas aisladas cubren fallo SQLite + rollback de intento/set, reintento sin duplicados y replay HTTP tras reiniciar el servidor compilado. El smoke visual y los cambios rápidos de ámbito siguen pendientes.
- **Siguiente paso:** smoke manual en navegador y base aislada cuando el owner pueda; luego revisar mejoras UX respaldadas por el recorrido y reanudar Tier B.
- **Notas:** `npm start` sin `NODE_ENV` sirve el build; PDF válido 200 y corrupto 422 con fallback. Persisten avisos de tamaño de bundle. WIP ajeno intacto.
