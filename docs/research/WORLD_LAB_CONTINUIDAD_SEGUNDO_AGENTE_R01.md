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

**Dictamen:** `CONTINUITY_VERIFIED_WITHIN_FIXED_CASE`. Hay base empírica adicional para **especificar** una interfaz versionada que separe estado del agente, coordinación y registro. No se implementó ni se declaró portable una API pública.

### Identidad, ejecución e integridad

- Protocolo previo: commit `283353e` (resoluble en el historial de esta rama); [configuración v1](continuidad-segundo-agente-r01/protocol.json), SHA-256 `cbfc04d3de2bac2446a2d817a86edda0047b51fc0359fafc67e92287c3c7c911`.
- Instrumento previo: `a73bcba6e8b343d39a3fee2b995e1641ac69c73b`; [harness.cjs](continuidad-segundo-agente-r01/harness.cjs), SHA-256 `b2e90c91196998b998a7b92a0646ec8e2e0a7f9c69d051c29b6163540ec7b0ba`.
- Motor: SHA base indicado arriba; Node `v24.22.1`, Linux x64. Inicio y cierre UTC en `execution-start.json`/`execution-complete.json`, incluidos en el expediente. Fecha local de la investigación: 2026-11-25.
- Una invocación del arnés, salida 0, sin reintentos ni cambio de diseño. Se realizaron 96 transiciones WORLD: 24 continuas, 8 de prefijo, 48 de continuaciones y 16 de replay. La reimportación del recorder y el análisis no ejecutaron física.
- Los 662 archivos exportados coinciden con los blobs de Git del motor y permanecieron intactos. Los 666 archivos versionados existentes al inicio del ensayo conservaron sus hashes durante su ejecución; después se añadieron resultados y se corrigió el analizador en esta rama. `origin/main` seguía en el SHA base. El Playbook conserva su hash original.

La captura del corte dio: WORLD.time=8; RNG del mundo `554160809`; semilla privada original del agente `1627437821`; RNG privado actual `645573146`; siguiente secuencia del recorder 7. Último ActionResult: VALID/NONE, delta −1, ENTITY_MOVED a `(5,1)`, entidad `0987898`.

### Comparación observada y verificada

| Brazo | Reconstrucción previa / decisiones nuevas | Resultado frente a continua |
|---|---|---|
| Instantánea | 0 llamadas de reconstrucción / 16 nuevas | ExperimentResult completo igual; memoria privada, feedback, eventos, secuencias y terminación iguales. |
| Historial de feedback | 8 llamadas de reconstrucción / 16 nuevas | Ocho acciones del prefijo comprobadas y descartadas; ExperimentResult completo y estado privado iguales. |
| Mundo restaurado y reset sin memoria | 0 / 16 nuevas | Diferente desde acción del tick 9. Control discriminativo. |
| Replay de acciones guardadas | 0 llamadas al agente / 16 transiciones suministradas | Acciones, estados y terminación iguales; contexto registral completo diferente. |

Cada brazo de continuación usó VM nueva. El prefijo interrumpido coincidió con los ocho pasos continuos y con la memoria capturada tras la octava decisión. Las continuaciones no recibieron acciones futuras; `resume(mode)` solo recibió el modo y cargó el checkpoint. La secuencia futura esperada se usó exclusivamente en análisis y en el contraste declarado de replay.

**Primera divergencia del control reset:**

- El estado privado ya difería al restaurar: `1627437821` frente a `645573146`.
- Tick 9, desde observación 8: continua `MOVE_S` (INVALID/BLOCKED_CELL, delta 0), reset `WAIT` (VALID/NONE, delta −1). Ambas quedan inicialmente en `(5,1)`, pero con energía 110 frente a 109.
- RNG privado tras esa decisión: `335782726` frente a `3183156114`.
- WorldState y bytes divergen en tick 9. El feedback diverge en la observación 9, registrada con la acción del tick 10. Eventos y secuencias divergen en tick 11.
- El RNG del mundo permanece igual; ambas terminan MAX_TICKS_REACHED en tick 24. Igualdad de posición inmediata, RNG del mundo y terminación no acredita continuidad.

**Replay diferenciado:** status OK, 16 pasos, cero llamadas a RandomAgent. En el primer feedback del segmento (observación 8), `has_prior_action=false` y resultado anterior nulo, frente a true y el ActionResult previo de la continua. El primer evento del sufijo está en tick 10: secuencia 0 frente a 7. El primer paso (tick 9) no tiene eventos en ninguno de los dos, por lo que comparar solo su primera secuencia no detectaría la pérdida de contexto.

**Verificación analítica:** [analysis.json](continuidad-segundo-agente-r01/analysis.json) conserva la primera diferencia por dimensión, incluidos los valores completos; [verification.json](continuidad-segundo-agente-r01/verification.json) registra controles de integridad y alcance. Se compararon 50 serializaciones WORLD/FULL por brazo positivo (25 estados × dos formatos), más 32 del sufijo replay: **132 comparaciones de bytes iguales**. El control reset se comparó también 50 veces, conservando su primera discrepancia. No son 132 réplicas independientes. Los ocho feedback iniciales se reconstruyeron desde observaciones y ActionResults previos y coincidieron exactamente.

En cada continuación se observaron 16 extracciones del RNG del agente y cero del mundo. La reconstrucción consumió otras ocho extracciones del agente en este caso. No se reemplazó `step` por avanzar ocho enteros: el PRNG usa rechazo y ese atajo no sería una garantía general.

### Estado requerido, reconstrucción, adaptación y trabajo

| Estado / responsable | Instantánea | Reconstrucción | Adaptación y trabajo observado |
|---|---|---|---|
| Agente: RNG privado e identidad de implementación | Capturar get_state y restaurar set_state en una instancia creada con su semilla original | reset desde semilla conocida y ocho llamadas step con feedback ordenados | Adaptador específico a `agent.rng` y `_initial_seed`. No pertenece al contrato genérico Agent. Payload JSON compacto: 99 bytes con versión/semilla/estado; el uint32 actual determina la fase siguiente, la semilla conserva procedencia/reset. |
| Supervisor: configuración, código y límite temporal | Mismos parámetros y SHA; reanudar después de registrar tick 8 | Idéntico | Se reutilizó la coordinación externa anterior. No llamar initialize ni reset después de restaurar la memoria. |
| WORLD: mapa, entidad, tiempo y RNG | Snapshot confirmado, replay_world_from_state y estado RNG explícito | Idéntico | Helpers históricos sin cambios. Sin volver a generar mapa ni transiciones del prefijo. |
| Contexto previo de decisión | Último ActionResult crudo | Recuperado del último paso | Necesario para feedback completo, aunque este RandomAgent ignore su contenido. El supervisor lo presenta; el recorder mantiene su copia coherente. |
| Recorder: origen, prefijo, contexto y secuencia | Reimportar origen y ocho registros mediante operaciones nativas | Idéntico | 29.228 bytes de JSON compacto para origen/prefijo/contexto/secuencia en este caso. Su importación no es física ni una API de checkpoint portable. |
| Historial del agente | No se necesita para restaurar su fase con el snapshot | Semilla más ocho feedback, orden y número exacto de llamadas | Lista de feedback: 5.580 bytes compactos; ocho acciones descartadas y cotejadas. RandomAgent ignora feedback: aquí basta la semilla y el historial de llamadas, deducido por lectura; no se ensayó el atajo sin feedback. |

Tiempos instrumentales de una muestra (ms), no benchmark: restauración del agente 0,020 por instantánea y 0,190 por historial; importación del recorder 38,002 y 37,187; total del brazo 160,416 y 158,062. El reset de control totalizó 184,275. Las diferencias totales no permiten atribuir ventaja de rendimiento: incluyen VM, registro, serialización y ruido. La continua totalizó 208,203 y replay 111,688; no representan trabajo equivalente.

**Esfuerzo conservado:** reutilización del loader/codec y estrategia de corte/importación del caso FrontierMemory; sustitución de captura/restauración de Map/Set por estado PRNG; incorporación de contadores separados y análisis explícito por dimensión. Arnés de ejecución: 156 líneas; analizador: 87. Se añadieron soporte de preparación y un verificador puro, no una infraestructura de reanudación. No existe medición fiable de horas humanas ni comparación controlada de productividad; no se infieren ahorros económicos. La instantánea añade un set_state y validación de semilla; el historial añade procesamiento proporcional al prefijo. El coste común del recorder no debe atribuirse al agente.

### Fallos instrumentales y conservación de resultados

El primer análisis, congelado como [analyze-v1.cjs](continuidad-segundo-agente-r01/analyze-v1.cjs), falló al leer `Trajectory.final_state.time`: ese campo no existe. Se conservan `analysis-attempt-1.json`, el analizador original y `analysis-revision.json` en el paquete. La revisión v1.1 lee `steps.at(-1).world_state.time`. No se alteraron entradas, criterios, protocolo ni arnés, y **no se repitió ninguna transición**. Es una corrección analítica posterior a resultados, explícita, no una nueva ejecución.

Una comprobación pura posterior pasó las aserciones de datos pero falló al consultar la referencia local `main`, inexistente en este checkout. Se corrigió a `origin/main`; el incidente está registrado en verification.json. Tampoco cambió datos ni repitió episodios. Los resultados contrarios del control reset y las diferencias registrales de replay se conservan íntegros.

### Afirmaciones y decisión

| Estado epistemológico | Afirmación | Evidencia / límite |
|---|---|---|
| OBSERVADO y VERIFICADO en el caso | Snapshot y reconstrucción sostienen continuidad completa de RandomAgent | Resultados guardados, comparación estructural exacta y WLS1; oráculo diferencial común, no implementación independiente. |
| OBSERVADO y VERIFICADO en el caso | Restaurar solo WORLD no basta, aunque su RNG y el motivo terminal coincidan | Primera decisión y energía divergentes en tick 9; control con poder discriminativo. |
| OBSERVADO y VERIFICADO en el caso | Replay físico no conserva automáticamente contexto de decisión y registro | Cero llamadas al agente, feedback distinto y secuencias reiniciadas. |
| DEDUCIDO de fuente + respaldado en el caso | Estado privado del agente incluye fuentes de aleatoriedad propias | RandomAgent guarda su PRNG fuera de WorldState; restaurarlo mantiene la fase; reset la pierde. No se generaliza a cualquier tipo de memoria. |
| DEDUCIDO, no ensayado como alternativa | Para este agente, semilla e historial exacto de llamadas bastan aunque se omita el contenido del feedback | step ignora feedback. Este ensayo sí suministró los ocho feedback, no prueba recuperación con semilla desconocida ni llamadas omitidas. |
| PROPUESTA, no implementada | Interfaz versionada separada para agente, supervisor y recorder | Hay dos formas de memoria examinadas sumando el antecedente, no una prueba de portabilidad universal. |

**Decisión R01:** cerrar la pregunta acotada como respaldada y conservar el activo como instrumento de investigación. Especificar como candidato `export_state()/import_state(payload)` del agente con tipo/versión/identidad y sin exponer su representación al supervisor. Declarar reconstrucción por historial como capacidad opcional con precondiciones, no como sustituto universal del snapshot. El supervisor coordina checkpoint consistente, configuración e identidades; el recorder debe ofrecer su propio memento portable para contexto, secuencias e historial. No almacenar el RNG privado del agente en WorldState ni confundirlo con rng_state del mundo. No se implementan estos contratos ni se amplían esquemas cerrados.

Pendientes antes de adoptar una API: definir y validar payloads/versiones incompatibles, aislamiento y errores de importación, memento del recorder independiente de instancia y responsabilidades del coordinador. Persistencia distribuida y recuperación durante escritura siguen fuera del ensayo. Otras semillas, cortes, agentes y versiones no se evaluaron. No se autoriza campaña ni se modifica la congelación operacional.

Cierre conforme al propósito acotado de RDL-PB §23: decisión, evidencia favorable/contraria, límites y pendientes preservados. No se declara conformidad transversal integral por un caso exitoso. Reabrir solo ante una nueva pregunta o fallo que afecte estas condiciones, con protocolo y presupuesto identificados.

### Expediente íntegro y comandos

[Paquete de evidencia](continuidad-segundo-agente-r01/evidence.tar.gz): **110.265 bytes**, SHA-256 `5316babbd80548fc43e3e1710658c8c5a20848d16e2d6b8d780e8a82dff05fe9`; [checksum](continuidad-segundo-agente-r01/evidence.tar.gz.sha256). Contiene 22 miembros: 21 archivos más manifiesto interno de tamaño/hash. Incluye configuración, instrumentos y revisión original, preejecución, checkpoint, resultados completos, análisis, fallos, verificaciones y logs. No incluye fuentes duplicadas del motor ni material de autorización. El manifiesto identifica bytes; no certifica por sí solo la validez del contenido.

Comandos efectivamente ejecutados (rutas externas históricas, no enlaces públicos):

```bash
# Exportación previa: git archive del SHA base a source.tar; extracción en source/.
node --check /tmp/continuidad-r01-ukpti5wl/harness.cjs
node --check /tmp/continuidad-r01-ukpti5wl/analyze.cjs
timeout --signal=TERM --kill-after=5s 60s node --max-old-space-size=512 /tmp/continuidad-r01-ukpti5wl/harness.cjs > /tmp/continuidad-r01-ukpti5wl/execution.log 2>&1
node --max-old-space-size=512 /tmp/continuidad-r01-ukpti5wl/analyze.cjs
# El análisis inicial falló; tras la revisión v1.1 se repitió solo el análisis.
python3 /tmp/continuidad-r01-ukpti5wl/verify.py
```

Para **verificar archivos existentes sin episodios**, descargar/extraer el paquete en un directorio nuevo, comprobar su SHA-256 y manifiesto interno, exportar allí el motor base a `source/` y ejecutar `python3 verify.py`. Este script no llama a WORLD, agentes ni replay. La comprobación WLS1 completa ya está registrada; se puede recalcular con analyze.cjs tras retirar/copiar aparte analysis.json, sin ejecutar transiciones. Conservar siempre el análisis original.

Soporte para una **reproducción futura y separada**, no ejecutada durante este cierre:

```bash
# Desde un checkout limpio de esta rama. Debe usarse un destino inexistente fuera del repo.
python3 docs/research/continuidad-segundo-agente-r01/prepare.py "$PWD" /tmp/continuidad-r01-reproduction-NEW
# prepare solo exporta/verifica fuentes y registra identidad; no inicia episodios.
cd /tmp/continuidad-r01-reproduction-NEW
timeout --signal=TERM --kill-after=5s 60s node --max-old-space-size=512 harness.cjs > execution.log 2>&1
node --max-old-space-size=512 analyze.cjs
python3 verify.py
```

La [prueba posterior del preparador](continuidad-segundo-agente-r01/preparation-check.json) verificó 662 fuentes en un directorio externo nuevo y el rechazo de sobrescritura de ese mismo destino, sin cambiar sus archivos. Inició cero episodios y cero transiciones; la segunda invocación fue una prueba negativa de preparación, no un reintento experimental.

El preparador, incorporado después de los resultados para facilitar recuperación, no modifica el protocolo ni el arnés congelado. Crea una identidad de ejecución nueva y se niega a sobrescribir destinos existentes. La reproducción futura no debe mezclarse con la ejecución original ni presumirse autorizada como campaña. Las rutas locales y hashes de integridad histórica se preservan como procedencia, no como dependencias de almacenamiento permanente.
