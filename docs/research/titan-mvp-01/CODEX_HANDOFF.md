# CODEx — orden ejecutable de implementación de TITAN-MVP-01

**Inicio:** checkout limpio del `main` que contenga el PR de este expediente. Verificar que `docs/research/RC1_TEMPORARY_FREEZE_2026-11-20.md` está integrado. No escribir código en rama anterior a su integración.

## Lectura antes de programar

`README.md` → `SOURCE_V01.md` → `SOURCE_V03.md` → `DECISION_RECORD.md` → `IMPLEMENTATION_CONTRACT.md` → `EXPERIMENT_PROTOCOL.md`. Leer también los contratos reales `js/agents/agent.js`, `js/experiment/experiment.js`, `js/experiment/experiment_config.js`, `js/interface/{observation,feedback,action}.js`, `tools/p01/runtime.cjs` y `js/world/world.js`.

Las dos SOURCES son **normalizaciones**, no evidencia de transcripción literal. No atribuir a v0.3 las heurísticas del adaptador.

## Orden

1. Crear rama de implementación basada en `main` tras la integración del expediente.
2. Implementar núcleo puro para costos finitos, `C_null=LΦ`, Cap, brechas, minimizadores y política de desempate documentada.
3. Implementar `TitanMVP01Agent` con `reset()` y `step(feedback)`, exclusivamente sobre observación y feedback. Estado local `visited/consumed`, movimiento cardinal, WAIT de la acción nula.
4. Crear factory/runner aislado; mismo patrón de `tools/p01/runtime.cjs`, sin editar WORLD, agente P01 ni registro estático. `agent_type=titan_mvp_01`, entidad `0987898`.
5. Incorporar diagnósticos de decisión como sidecar, sin tocar esquemas cerrados ni lógica científica.
6. Preparar fixture y pruebas focalizadas especificadas; ejecutar smoke de **desarrollo** solo con 1–4 y sin hipótesis final. No ejecutar semillas2001–2012.
7. Medir y documentar esfuerzo de integración **realmente observado** (inicio/fin de tareas si existe evidencia; de otro modo solo conteo de archivos, bloqueantes y procedimientos) para la futura investigación Q4.
8. Entregar reporte de cobertura de contrato, tests, hashes de fuentes, riesgos, desviaciones y propuesta de presupuesto G2. Crear PR sin fusionar automáticamente.
9. Terminar en `READY_FOR_TITAN_MVP_01_REVIEW`. Evaluación G2 `HOLD`.

## Condiciones de parada

Detenerse y reportar si: requiere editar WORLD/Recorder/WLS1/Experiment/contratos congelados; produce acciones no válidas; no puede preservar mismo estado por seed; falta información disponible en Feedback; la política es ambigua en un caso no cubierto por `DECISION_RECORD.md`; reutilizar P01 implica modificar su código; falla prueba de integridad. No inventar comportamiento para superar el bloqueo; proponer corrección separada.

## Entregables

Nuevos archivos de agente, harness separado, tests, resultados de smoke de desarrollo, registro de decisiones y propuesta de G2; cambios mínimos y trazables. Sin campaña científica, sin optimizaciones, sin nuevas normas para WORLD-LAB y sin afirmaciones de conformidad de TITAN.
