# Matriz de conformidad F5-A

Documento informativo. Base 14d59dad381c344b7213025c86ffa5e661f16fc2.
Autoridad: v0.2.6 D-01 sobre v0.2.5; fragmentos históricos con procedencia
registrada en sources.json. No confundir relaciones temáticas con cobertura completa.

La matriz es bidireccional: obligations.json → executable_cases → cases.json
(cláusulas, fuente, entrada y oráculo) → results/f5-a.json. Cada T histórico
permanece en corpus.json con sus campos ausentes explícitos; no se sustituye por
un caso local de nombre similar. Todos los artefactos están en ../conformance/.

## Secciones y obligaciones actuales

| Obligación | Casos exactos del harness | Alcance |
|---|---|---|
| §0: Autoridad, estados y regla general | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §1: Propósito y alcance | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §2: Principios normativos | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §3: Terminología | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §4: Arquitectura y fronteras | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §5: Modelo temporal | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §6: WorldConfig | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §7: WorldState | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §8: Grid / Cell | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §9: Entity | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §10: PRNG | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §11: Inicialización del mundo | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §12: Acciones | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §13: apply_action() | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §14: Lifecycle | ND-INITIAL-EVENT | PARTIAL; exact listed assertions only |
| §15: Dynamics | ND-DYNAMICS | PARTIAL; exact listed assertions only |
| §16: Observation | ER-REPLAY-WITH_AGENT, ER-REPLAY-WITHOUT_AGENT | PARTIAL; exact listed assertions only |
| §17: Feedback | ER-REPLAY-WITH_AGENT, ER-REPLAY-WITHOUT_AGENT | PARTIAL; exact listed assertions only |
| §18: Events | ND-INITIAL-EVENT | PARTIAL; exact listed assertions only |
| §19: ExperimentConfig | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §20: Ciclo de ejecución | ER-REPLAY-WITH_AGENT, ER-REPLAY-WITHOUT_AGENT | PARTIAL; exact listed assertions only |
| §21: Recorder | ND-INITIAL-EVENT | PARTIAL; exact listed assertions only |
| §22: StepRecord | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §23: Trajectory | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §24: Hashes | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §25: Replay | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §26: Validación y errores | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §27: Modo sin agente | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §28: Agent contract | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §29: Renderer | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §30: Metrics | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §31: Invariantes | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §32: Orden normativo de ejecución | ND-TICK-ORDER | PARTIAL; exact listed assertions only |
| §33: Pseudocódigo normativo | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §34: Serialización WLS1 | ND-HASH-V1, ND-BINARY64-ZERO, ND-BINARY64-SUBNORMAL, ND-BINARY64-PI, ER-REPLAY-UINT64 | PARTIAL; exact listed assertions only |
| §35: Reproducibilidad | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §36: Inventario de tests | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §37: Criterio de conformidad (corregido, P1-5) | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §38: Congelación | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| §39: Alcance sobre agentes con aprendizaje | Ninguno | UNTESTED in new harness; no thematic coverage claim |
| D-01-A: Current replacement; historical definitions remain separately inventoried | ND-INVALID-BOTH, ND-INVALID-BIGMAX, ND-INVALID-BIGEXPECTED | PARTIAL; exact listed assertions only |
| D-01-B: Current replacement; historical definitions remain separately inventoried | ER-REPLAY-WITH_AGENT, ER-REPLAY-WITHOUT_AGENT, ND-SEGMENT-ZERO-ACTIVE, ND-SEGMENT-ZERO-DEAD | PARTIAL; exact listed assertions only |
| D-01-C: Current replacement; historical definitions remain separately inventoried | ND-MODE-WITH_AGENT, ND-MODE-WITHOUT_AGENT, ND-UINT64, ER-VALIDATION-WORK, ER-METADATA-NO-WORK, ND-STRUCTURE-HASH, ND-METADATA-status, ND-METADATA-max_ticks_used, ND-METADATA-expected_steps_used, ND-METADATA-unused_actions, ND-METADATA-termination_hint, ND-METADATA-unknown_action_index, ND-METADATA-error_message, ND-CONTEXT-extra, ND-CONTEXT-execution_mode, ND-HINT-NULL-ACTIVE, ND-HINT-NULL-DEAD | PARTIAL; exact listed assertions only |
| D-01-D: Current replacement; historical definitions remain separately inventoried | ER-REPLAY-WITH_AGENT, ND-MODE-WITH_AGENT, ER-REPLAY-WITHOUT_AGENT, ND-MODE-WITHOUT_AGENT, ND-CONTEXT-extra, ND-CONTEXT-execution_mode | PARTIAL; exact listed assertions only |
| D-01-E: Current replacement; historical definitions remain separately inventoried | ER-REPLAY-UINT64, ND-UINT64, ND-INVALID-BOTH, ND-INVALID-BIGMAX, ND-INVALID-BIGEXPECTED, ND-SEGMENT-ZERO-ACTIVE, ND-SEGMENT-ZERO-DEAD | PARTIAL; exact listed assertions only |

Las subcláusulas se trazan literalmente en cada caso y en el índice inverso
summary_by_clause del reporte; una sección sin casos directos puede tener
subcláusulas verificadas, pero nunca se considera completa por ello. Las 82 filas
de invariantes y los grupos P0/P1/R/D/M/A/B/V- están en obligations.json, con
fuentes ausentes y relaciones grupales identificadas explícitamente.

## Sustituciones D-01

| Contrato anterior | Contrato actual | Aceptación nueva |
|---|---|---|
| INVALID con contadores históricamente incompatibles | Contadores parciales independientes, null solo por parámetro inválido | ND-INVALID-BOTH/BIGMAX/BIGEXPECTED |
| Ticks de registro Number seguro | Salidas uint64 exactas canónicas, sequence/expected sin ampliar | ND-UINT64; ER-REPLAY-UINT64; ND-HINT-NULL-* |
| Origen replay positivo incompatible con validador time0 | Segmentos desde estado efectivo; eventos iniciales vacíos si time>0 | ND-SEGMENT-ZERO-*; ND-MODE-*; ER-REPLAY-* |
| Firma pública continuidad sin contexto físico suficiente | Dos argumentos, contexto cerrado de ocho campos | ND-CONTEXT-*; ND-MODE-* |
| Replay observado implícito | WITH_AGENT/WITHOUT_AGENT declarados | ND-MODE-*; ER-REPLAY-WITH_AGENT/WITHOUT_AGENT |
| Guardado incompleto de metadatos (defecto F4F-001) | Estructura válida antes de reproducción | Siete ND-METADATA-* |

Los seis casos históricos fijados a v0.2.5 en F3-G/H se conservan como
ENGINEERING-REGRESSION histórica; no deciden conformidad vigente. Ningún T271
o T273 se declara ejecutado por implementar estos casos nuevos.

## Vacíos y límites

280 definiciones T no están recuperadas íntegramente: 248 referencias parciales
y 32 IDs sin asignación (T61–80/T93–104). V1 recuperado; V2–V10 no fijados.
I-01–I-66 y definiciones individuales R/D/M/A/B/V- faltan. Los test canónicos
completos permanecen BLOCKED, nunca PASS por coincidencia temática.
Los casos ND demuestran solo las aserciones y entradas listadas. Los casos ER
conservan políticas actuales de salida no totalmente recuperadas históricamente.
Procedencia de checkpoints, causa externa de fallos y una segunda implementación
no se certifican. No se declaran conformidad global ni hitos B/C.
