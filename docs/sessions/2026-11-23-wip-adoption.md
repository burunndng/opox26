# Session — 2026-11-23 adopción de WIP de tooling

- **Objetivo:** terminar y decidir el destino de los tres WIP ajenos: `opencode.json`, `.opencode/agent/oposilab-pm.md` y `CODEBASE.md`.
- **Hecho:** sobre `97f3143`, se validó el esquema de `default_agent`/`agent.mode`, se actualizó el brief del PM a 11 temas / 646 elegibles y 384/51 pruebas, y se reescribió `CODEBASE.md` con el estado actual. Decisión: adoptar los tres en un commit de tooling.
- **Verificado:** `opencode debug agents` lista `oposilab-pm`; `opencode debug config` carga sin error; `npm run lint` limpio y `npm test` 384/384 en 51 suites.
- **Siguiente paso:** smoke visual pendiente y Tier B; reiniciar OpenCode para que el `default_agent` surta efecto.
- **Notas:** no se cambiaron reglas de producto, alcance ni datos de estudio. Los tres archivos dejan de ser WIP ajenos al quedar adoptados.
