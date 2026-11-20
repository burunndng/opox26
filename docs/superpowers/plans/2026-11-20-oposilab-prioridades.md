# OposiLab: plan de acción por retorno

**Objetivo:** hacer fiable el ciclo de estudio y verificar la experiencia real antes de invertir en ampliaciones o rediseños.

**Base:** auditoría del 20-11-2026, HEAD `6b6b6a3`; 378 pruebas y 50 suites en verde. El servidor de producción devuelve 500 al importar PDF y `npm start`, sin `NODE_ENV`, sirve el cliente de desarrollo de Vite.

**Restricciones:** Vite + React + Express + `node:sqlite`; IA opcional; sin simulacros completos. No registrar pruebas en la base real, cambiar reglas de estudio ni modificar el WIP ajeno (`opencode.json`, `.opencode/agent/oposilab-pm.md`, `CODEBASE.md`). Usar `OPOSILAB_DATA_DIR` aislado y `OPOSILAB_OFFLINE=1` para los recorridos. Las estimaciones son relativas, no plazos comprometidos.

## 1. Evitar la pérdida de intentos — máxima prioridad

**Valor:** protege LO1 y LO4, la continuidad del estudio, el SRS y la calibración. **Esfuerzo:** medio.

- [x] Examinar todos los caminos que guardan respuestas y blancos en `src/components/ActivityRunner.tsx`, `src/api.ts` y `server.ts`, incluyendo fallos de red y respuestas duplicadas.
- [x] Hacer explícito el fallo de guardado y ofrecer una recuperación que preserve la respuesta. Evitar contar o guardar dos veces un intento cuando se reintenta; contemplar que una petición pueda haberse guardado aunque falle su respuesta.
- [x] Añadir pruebas de comportamiento para fallo, recuperación y ausencia de duplicados, usando datos aislados. Comprobar que SRS y analítica reflejan el intento confirmado.
- [ ] Verificar manualmente en aislamiento: responder, interrumpir la API, recuperar la conexión y confirmar que el estado mostrado coincide con el persistido.

**Cierre:** ningún intento no confirmado se presenta como guardado; la recuperación no produce duplicados y el usuario sabe qué hacer. La estrategia de reintento debe resolver explícitamente la incertidumbre de una respuesta de red perdida.

## 2. Reparar el arranque y PDF compilados

**Valor:** cierra un fallo reproducido en una función de LO1/LO5 y hace fiable la ruta documentada de producción. **Esfuerzo:** bajo a medio.

- [x] Revisar `package.json`, `server.ts`, `server/pdfImport.ts` y `tests/pipeline.test.ts`. Asegurar que `npm start` sirva `dist/` sin depender de una variable externa y que la resolución de fuentes PDF funcione en el formato compilado.
- [x] Añadir una comprobación de integración del servidor compilado con puerto y base aislados: raíz sin `/@vite/client`, `/api/health`, PDF válido con texto extraído y PDF corrupto con respuesta de error comprensible.
- [x] Ejecutar `npm run lint`, `npm test`, `npm run build` y el smoke del servidor compilado. Registrar el resultado en `docs/ACCEPTANCE.md`, criterio 3; actualizar `README.md` si cambia la instrucción de arranque.

**Cierre:** `npm start` sirve el build y el PDF válido funciona; el PDF inválido usa el fallback esperado, sin 500. Mantener el criterio 3 como parcial hasta contar con esa evidencia.

## 3. Recorrer la aplicación y reparar bloqueos observados

**Valor:** comprueba LO1–LO5 en el uso real y evita invertir en cambios visuales basados solo en código. **Esfuerzo:** bajo para el recorrido; correcciones por separado.

- [ ] Levantar la aplicación en otro puerto con una base temporal y sin IA. No usar la base del candidato ni reiniciar un servidor en uso.
- [ ] En escritorio y móvil, recorrer: Temario → Tema 10 → test → respuesta → confianza → feedback → Mis fallos; después Estudiar, Herramientas, banco, filtros por tema y exportación. Comprobar los 50 ítems del Tema 10 y la navegación consolidada.
- [ ] Con teclado, comprobar foco visible, Tab/Shift+Tab, Escape y restauración del foco en un diálogo; probar estados vacíos y un error de conexión. Registrar pasos, resultado y capturas cuando aporten evidencia.
- [ ] Priorizar únicamente los bloqueos o errores de información observados. Mantener los criterios 7–14 y la accesibilidad como cobertura parcial allí donde falte verificación real; las guardas estáticas no prueban la interacción.
- [ ] Invitar al owner a revisar el resultado visual en su entorno; no atribuir a ese smoke una aprobación que todavía no se ha realizado.

**Cierre:** recorrido reproducible con resultados registrados, lista corta de defectos clasificados y decisión sobre cuáles corregir primero.

## 4. Corregir el flujo de temas vacíos y el refresco

**Valor:** evita desorientación y trabajo redundante en LO1. **Esfuerzo:** bajo a medio.

- [x] En `src/App.tsx`, `src/components/Dashboard.tsx` y `src/components/StudySetup.tsx`, impedir que un tema sin ítems elegibles derive silenciosamente al ámbito global; mostrar una indicación y una acción útil.
- [x] Eliminar la recarga global y consulta duplicada al cambiar el ámbito; impedir que una respuesta anterior sobrescriba el contador del ámbito seleccionado.
- [ ] Probar un tema vacío, uno con solo borradores, un tema con preguntas y cambios rápidos de ámbito. Comprobar que los totales globales continúan correctos (`tests/topic-counts.test.ts`).

**Cierre:** el ámbito solicitado es inequívoco, los estados vacíos son comprensibles y la selección no produce consultas redundantes ni cifras obsoletas observadas.

## 5. Hacer recuperable el guardado de sets

**Valor:** protege el trabajo de creación de contenido de LO1/LO5; afecta sobre todo a errores intermedios. **Esfuerzo:** medio.

- [x] Revisar `src/components/ContentStudio.tsx`, `server.ts`, `server/db.ts` y la persistencia SQLite. Reproducir con base aislada un fallo después de crear parte del set.
- [x] Elegir una operación agrupada con transacción o una recuperación explícita de lo ya guardado; cubrir también el caso de respuesta perdida para que reintentar no duplique datos.
- [x] Verificar éxito, fallo intermedio y reintento; conservar la validación humana y los estados de contenido exigidos por el proyecto.

**Cierre:** un fallo no deja al usuario sin saber qué se guardó y un reintento no duplica el set.

## 6. Actualizar evidencia y pulir lo que aporte valor

**Valor:** reduce errores de decisión y simplifica la experiencia; sin urgencia frente a datos perdidos. **Esfuerzo:** bajo.

- [ ] Sincronizar afirmaciones actuales de tests y contenido en `README.md`, `implementation_plan.md` y `docs/ACCEPTANCE.md`; corregir el texto de 48 ítems en `tests/tema10-bank.test.ts` sin alterar sus aserciones de 50. Conservar la historia fechada.
- [ ] Ajustar la aceptación de diálogos a la evidencia real: `tests/modal-a11y.test.ts` es una guarda estática, no una prueba de foco ni de `aria-labelledby`.
- [ ] Tras el smoke, decidir si merece la pena corregir la duplicación de «Añadir tema», el onboarding y el número de modos expandidos documentados en `docs/UX-AUDIT-2026-11.md`.
- [ ] Evaluar el aviso del bundle de 1,28 MB solo si la medición del recorrido muestra impacto perceptible.
- [ ] Actualizar el diario y el puntero de `implementation_plan.md` al cerrar cada lote; no modificar los archivos ajenos sin coordinación.

**Cierre:** documentación actual coherente con verificaciones efectivamente ejecutadas y mejoras UX justificadas por observación.

## Después: cobertura legal

Retomar `docs/CONTENT-COVERAGE.md` Tier B una vez estabilizado el ciclo de estudio: revisión de oficio TGSS; cuotas y MEI 2027; coeficientes y afirmaciones pendientes de jubilación. Contrastar cada afirmación con fuente oficial vigente antes de escribir o activar ítems. No tratar prioridades temáticas como debilidades medidas del candidato.

## Verificación común y decisiones

Cada lote termina con `npm run lint` y `npm test`; añadir `npm run build` para cambios de servidor/runtime, y pruebas manuales descritas en el lote. Registrar los resultados reales, no reutilizar los del baseline. Si una corrección afecta almacenamiento o relaciones persistidas, inspeccionar el impacto y preservar los datos existentes.

La planificación no autoriza automáticamente cambios de alcance, publicación ni alteración de datos personales. La elección entre refinamientos visuales se hará después del recorrido; el plan no presupone que un rediseño sea necesario.
