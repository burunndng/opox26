# Session — 2026-11-20 arranque y PDF de producción

- **Objetivo:** reparar el servidor compilado y la importación local de PDF del plan de prioridades.
- **Hecho:** build CJS con `NODE_ENV` de producción fijado al compilar; resolución de fuentes PDF sin `import.meta.url`; prueba aislada del servidor compilado y de PDF válido/corrupto. Criterio 3 de aceptación actualizado.
- **Verificado:** `npm run lint` limpio; `npm test` 380/380 en 50 suites; `npm run build` OK sin aviso `import.meta`; smoke real de `npm start` sin `NODE_ENV`, con datos temporales: health OK, HTML compilado, PDF válido 200 y corrupto 422 con fallback.
- **Siguiente paso:** comprobar en navegador aislado la caída de API y el reintento de intentos, más el recorrido visual y navegación del Tema 10; seguir el plan de prioridades.
- **Notas:** sigue pendiente el smoke visual por falta de navegador. Persisten los avisos de tamaño del bundle y de configuración Vite. WIP ajeno intacto.
