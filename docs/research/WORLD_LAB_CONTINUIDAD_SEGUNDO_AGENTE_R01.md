# WORLD-LAB — Continuidad con segundo agente R01

## Protocolo v1 — registrado antes de ejecutar

**Fecha:** 2026-11-25, America/Guayaquil. **Pregunta R01:** ¿se sostiene el contrato candidato de pausa/reanudación ante memoria privada de tipo PRNG, y qué estado corresponde al agente, supervisor y registro? **Decisión dependiente:** determinar si hay base para especificar una interfaz portable, sin implementarla.

**Base de motor y rama documental:** `5d40f08fbb36c5bbe075628a5b9a9078ce9c017c`; rama `research/especializacion-continuidad-r01`. Fuentes históricas tratadas como referencias congeladas. RDL-PB-001 v0.1 se aplica como norma operacional según su [adopción](../program/RDL-PB-001_v0.1_AUTHORITY_AND_ADOPTION.md), conservando intacto el [original](../program/RDL-PB-001_v0.1_original_propuesta.md), SHA-256 `84019bd0c70206d9f90ec219d4fefbc1eb58041ba1762818687ae8a983317436`.

### Objeto, antecedentes y selección

Se admite el `RandomAgent` existente (`js/agents/random_agent.js`), construido con la semilla derivada por `run_experiment`: `derive_seed(1, "random")`. Guarda `_initial_seed` y un PRNG propio cuyo estado avanza por `next_int(0,4)` en cada decisión. A diferencia de FrontierMemory, su memoria no representa celdas ni experiencias: conserva la fase de una secuencia pseudoaleatoria. RuleAgent y WaitAgent no tienen estado útil para este ensayo. No se crea un agente nuevo.

Antecedente: [informe FrontierMemory en commit c807730](https://github.com/ksgfin8-cyber/yellow/blob/c807730ada1cc1ec830c2ead8c5836a469349471/docs/research/world-lab-resume-viability/REPORT.md), expediente SHA-256 `46e53e12a5b149084fcb153ab1ad78f246289d2d4b2bbbbbd17e15b18404e82f`. Se reutiliza su estrategia de VM nueva, corte posterior a record_step y reimportación del prefijo del recorder; se adapta exclusivamente la captura/restauración de memoria. No se hereda la conclusión sin comprobarla.

Referencias técnicas en el SHA base: `js/agents/{random_agent,registry,agent}.js`, `js/core/{prng,seed}.js`, `js/experiment/{experiment,recorder,replay,tick_transaction}.js`, `js/world/world_state.js`, `tools/p01/runtime.cjs`, `conformance/wire.cjs`. El arnés carga esas fuentes desde una exportación externa, sin editar ninguna.

### Caso fijado, variables y presupuesto

La [configuración exacta](continuidad-segundo-agente-r01/protocol.json) fija semilla de experimento 1; agente `random`; mundo 6×6 BOUNDED, radio 1, obstáculos 0,10, recursos 0,25, hazards 0; energía inicial 100; MOVE/WAIT 1; recurso +8; daño y regeneración 0; umbral 0; cuatro flags de feedback activos. Horizonte 24, corte único después de confirmar y registrar tick 8 y antes de observación 8. No se buscan semillas ni cortes discriminativos a posteriori.

La energía y el horizonte dejan un corte no terminal. Ocho decisiones avanzan el PRNG privado. Que sus siguientes acciones difieran de reset es una hipótesis comprobable, no un resultado supuesto. Una colisión de acciones podría hacer que el caso no discrimine; se conservaría esa conclusión.

Presupuesto: un agente adicional, un corte; una corrida continua de 24 transiciones, un prefijo de 8, tres sufijos de hasta 16 y un replay de 16: máximo 96 transiciones WORLD, sin contar serialización ni reimportación registral (sin física). Cada brazo usa VM y objetos nuevos. Una invocación del arnés, timeout externo 60 s y heap V8 512 MiB. Sin réplicas estadísticas ni nuevas campañas. Se mide duración por método, llamadas, extracciones PRNG y bytes de evidencia; no se interpretan tiempos de una muestra como benchmark ni ahorro de productividad. Esfuerzo de adaptación se informa por tareas y líneas, sin inventar horas humanas.

### Procedimiento y controles

1. Guardar este protocolo y su configuración en un commit antes de ejecutar. Preparar el arnés externo y registrar su hash antes de invocarlo.
2. Corrida pública continua `run_experiment` con RandomAgent existente; registrar cada feedback, acción y estado PRNG del agente.
3. Nueva VM, misma configuración: interrumpir mediante señal del arnés inmediatamente después del commit nativo de `Recorder.record_step` en tick 8. Conservar checkpoint, prefijo, memoria, último ActionResult, secuencia y comparación con prefijo continuo. La señal no es una API pública de pausa.
4. Nueva VM para cada continuación: restaurar WORLD/RNG y reimportar el prefijo del recorder mediante sus operaciones nativas. Restaurar el PRNG del agente por snapshot; o reset y reconstrucción con los ocho feedback históricos, generando/verificando/descartando sus acciones sin reejecutar WORLD; o reset sin reconstrucción como control negativo. Generar todas las acciones posteriores desde feedback actual: el sufijo esperado no se pasa al agente.
5. Contraste separado: `replay_trajectory` desde el corte con acciones guardadas y cero invocaciones del agente. Medir diferencias de contexto inicial y secuencia, sin llamarlo reanudación.
6. Análisis puro sobre archivos: comparar acciones, WorldState, RNG, terminación, feedback, eventos, secuencias y resultado completo. Comparar bytes WLS1 WORLD/FULL; reconstruir feedback del prefijo desde observaciones/ActionResult. Conservar primera divergencia por dimensión, incluso del control negativo.

### Oráculo y criterio de aceptación

Oráculo diferencial: corrida continua pública, mismas fuentes/configuración. No es implementación independiente del motor. Igualdad exacta mediante codec lossless y comparación estructural, más bytes WLS1. Prefijo interrumpido y estado privado deben coincidir con la referencia en el corte.

Continuidad completa en este caso exige: snapshot y reconstrucción producen las mismas acciones nuevas, estados, RNG del mundo y agente, terminación, feedback, eventos y secuencia, así como el ExperimentResult completo. Debe haber 16 nuevas decisiones por continuación si se alcanza el horizonte. La reconstrucción presupone semilla inicial conocida e historial completo y ordenado de llamadas; feedback solo no determina una semilla privada desconocida. Se ejecuta `step` completo, no se asume una extracción PRNG por llamada (puede haber rechazo).

El control reset debe informar primera diferencia o falta de poder discriminativo. Replay debe tener cero llamadas al agente; la igualdad física no implica continuidad de feedback/recorder. Fallos o diferencias en brazos positivos impiden declarar continuidad completa, sin borrar resultados.

### Cierre, desviaciones y límites previstos

Cerrar tras la única invocación y verificación analítica, o ante error/presupuesto: preservar datos parciales, primera divergencia, diagnóstico y estado inconcluso si corresponde. No reintentar automáticamente. Todo cambio posterior a resultados conserva v1 y registra motivo, momento, alcance y nueva versión antes de otra ejecución.

No se evalúan recuperación durante escritura, almacenamiento distribuido, entradas incompletas, otros agentes, otros cortes, portabilidad entre versiones/runtime ni rendimiento estadístico. El supervisor necesita identidad/configuración y corte consistente; agente y recorder deben conservar sus responsabilidades. La propuesta de interfaz no modifica esquemas cerrados ni fuentes del motor.

Aplicación proporcional de RDL-PB: §§5–6 (objeto/pregunta), §7.4 (reutilización), §8 (controles/presupuesto), §9 (identidad/registro), §§10–12 (divergencias/alcance), §§13–14 (decisión/activo), §§17–20 (costes/desviaciones/evidencia) y §23 (cierre). No se declara conformidad universal del laboratorio ni se convierten recomendaciones en obligaciones adicionales.

## Resultado

Pendiente de la ejecución fijada. Este apartado se completará sin alterar el protocolo previo, recuperable en su commit.
