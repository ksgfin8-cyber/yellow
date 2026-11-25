# WORLD-LAB — Viabilidad de reanudar un agente con memoria

**Registro:** 2026-11-25 (America/Guayaquil).

**Naturaleza:** conocimiento de ingeniería derivado de un caso técnico focalizado; no es un contrato nuevo, una implementación pública de pausa/reanudación ni autorización de campañas.

**Procedencia:** orden del propietario de examinar en lectura `5d40f08`, con arnés temporal externo, comparar continuidad con nuevas acciones y distinguir replay. Tras la ejecución, el propietario solicitó documentar el conocimiento. Esta publicación conserva los resultados existentes; no repite el caso.

**Fuente exacta examinada:** `5d40f08fbb36c5bbe075628a5b9a9078ce9c017c`.

**Resultado:** viable en el arnés externo para este caso, mediante restauración de memoria o reconstrucción desde feedback. **La API pública `run_experiment` no ofrece actualmente un contrato de pausa/reanudación.** Restaurar únicamente el mundo y reiniciar el agente produjo una divergencia inmediata.

## 1. Caso y criterio fijados antes de ejecutar

El plan original está conservado como `plan.json` dentro del [expediente](resume-case-evidence.tar.gz). Se registró antes de la única invocación del arnés; no se ajustaron semilla, corte u horizonte después de observar resultados.

| Parámetro | Valor |
|---|---|
| Agente / semilla | FrontierMemoryAgent / 1 |
| Mundo / topología / radio | 6×6 / BOUNDED / 1 |
| Obstáculos / recursos / hazards | 0,10 / 0,25 / 0 |
| Energía inicial / umbral de muerte | 100 / 0 |
| Coste MOVE / WAIT / efecto recurso | 1 / 1 / +8 |
| Regeneración / daño hazard | 0 / 0 |
| Feedback | Los cuatro flags activos |
| Horizonte / corte | 24 ticks / después de confirmar y registrar el tick 8 |

**Criterio:** ninguna primera divergencia en acciones nuevas, WorldState completo, RNG o terminación respecto a la corrida continua. Para las continuaciones completas, comparar además registros, eventos y feedback. Identificar separadamente el control que usa acciones guardadas, sin invocar al agente.

La interrupción se inyectó mediante una señal del arnés después de `Recorder.record_step`. El coordinador público propagó esa señal. **No se presentó como un resultado canónico de pausa**, fallo científico o nuevo estado terminal. La exportación de fuentes y todos los artefactos se conservaron fuera del repositorio.

## 2. Resultados ejecutados

| Ejecución desde el corte | Nuevas llamadas al agente después del corte | Resultado frente a la continua |
|---|---:|---|
| Restauración de instantánea del agente | 16 | Igualdad estructural del ExperimentResult completo; ninguna divergencia. |
| Reconstrucción mediante ocho feedback históricos | 16, tras ocho llamadas de reconstrucción | Igualdad estructural del resultado completo; ninguna divergencia. |
| Mundo restaurado y agente reiniciado sin memoria | 16 | Divergencia en la primera decisión posterior al corte. |
| `replay_trajectory` con acciones guardadas | 0 | Igualdad de acciones, estados y terminación; no del contexto completo del segmento. |

Se utilizó una VM nueva en cada continuación, con las mismas fuentes congeladas. En las dos continuaciones satisfactorias, las acciones posteriores se obtuvieron de `agent.step(feedback_actual)`: no se suministraron las acciones futuras de referencia. Las ocho acciones generadas durante la reconstrucción histórica se comprobaron contra el prefijo y se descartaron, sin ejecutar otra vez sus transiciones físicas.

**Primera divergencia del control con memoria vacía:**

- Observación 8, acción registrada en tick 9.
- Continua: `MOVE_W`, posición resultante `(2,2)`.
- Reiniciada: `MOVE_N`, posición resultante `(3,1)`.
- Ambas tenían energía 115 en ese punto y RNG `554160809`.
- Ambas terminaron `MAX_TICKS_REACHED` en tick 24.

Por tanto, **igualdad de RNG o terminación no demuestra continuidad conductual**.

Las verificaciones posteriores, sobre las salidas guardadas, comprobaron 134 pares iguales de bytes WORLD/FULL y reconstruyeron los ocho feedback del prefijo desde sus observaciones y ActionResults anteriores. Estos son controles dependientes de un único caso, no 134 réplicas independientes. No se ejecutaron nuevas transiciones en esa comprobación posterior.

## 3. Estado necesario en el punto de corte

El corte está situado después del commit del tick 8 y antes de construir la siguiente observación. El mundo y recorder están en 8; el agente procesó por última vez la observación 7.

| Componente | Estado conservado / reconstrucción |
|---|---|
| Mundo | Mapa y stocks, entidad, posición, energía, lifecycle, tiempo y RNG. Se restauró desde el snapshot confirmado, sin generar un nuevo mundo. |
| RNG del mundo | `554160809`. El kernel ya había sincronizado `rng_state` en este límite; no se extrajeron nuevos valores durante las continuaciones. No se extrapola a cortes anteriores a sync. |
| Agente | `known`, `visited`, `consumed`; tamaños 22/6/3 al corte. Se restauraron como colecciones independientes o se reconstruyeron con reset y feedback histórico. |
| Contexto del siguiente feedback | Último ActionResult, todavía pendiente de presentarse en la siguiente decisión. En este caso era un MOVE válido con delta−1 y evento ENTITY_MOVED. |
| Recorder | Estado inicial, prefijo de pasos/eventos, contexto y secuencia global 11. El arnés reimportó el prefijo mediante operaciones de registro, sin repetir la física. |
| Identidad | Configuración, versión de código y semántica exacta del punto de corte. |

La restauración de memoria utiliza campos ordinarios de esta implementación de FrontierMemory, accesibles en JavaScript pero ajenos al contrato genérico `Agent.reset/step`. Es un acoplamiento del arnés a esa versión, no una API portable de estado del agente.

## 4. Por qué replay no equivale a reanudación del agente

El control de replay recibió las 16 acciones guardadas del sufijo. Terminó `OK`, ejecutó 16 transiciones y realizó **cero llamadas al agente**.

En su primer registro:

| Campo | Continuación original | Nuevo segmento replay |
|---|---|---|
| `feedback.has_prior_action` | true | false |
| Secuencia del primer evento | 11 | 0 |

Por eso las acciones, estados y terminación coinciden, pero el primer registro completo no. El origen de un segmento no transporta automáticamente el contexto del experimento original.

## 5. Fronteras públicas y caso mínimo de bloqueo

Las pruebas de frontera están en `api-probes.json`, dentro del expediente:

1. **`run_experiment(config, factory)`** inicializa WORLD y llama a `agent.reset()`. Un argumento adicional de checkpoint se ignora; la primera observación fue tick 0 y la memoria estaba vacía. El arnés detuvo esa prueba con un error de agente intencional, cuyo resultado FAILED no debe confundirse con una pausa soportada.
2. **`Recorder.record_initial_state`** rechazó un estado con tiempo 8: `ContractError: recording failed`.
3. **`Recorder._checkpoint/_restore_checkpoint`** usa tokens opacos ligados al propietario mediante WeakMap. El token serializado no permitió restauración en otro recorder: `ContractError: recording failed`.
4. **`_adopt_replay_origin`** permite el origen positivo de un segmento, pero reinicia su contexto. Registrar directamente el feedback de continuación original en ese recorder falló con `ContractError: recording failed`.

El arnés evitó esas limitaciones reconstruyendo el recorder desde el prefijo original y coordinando el sufijo con las operaciones existentes. Esto demuestra viabilidad técnica local, **no que el contrato público ya soporte reinicio**.

Archivos pertinentes, todos de la revisión examinada:

- `js/experiment/experiment.js`: inicialización/reset y bucle de coordinación.
- `js/agents/agent.js` y `js/agents/frontier_memory_agent.js`: contrato genérico y memoria concreta.
- `js/experiment/recorder.js`: historial propio, contexto anterior, secuencias y checkpoints opacos.
- `js/experiment/replay.js`: restauración del mundo y reproducción de acciones suministradas.
- `js/experiment/tick_transaction.js`: commit de tiempo, sincronización y rollback del mundo/RNG.
- `js/world/world_state.js`: snapshot estructural con contexto de validación.

## 6. Propuesta mínima, no implementada ni aprobada

Exponer un checkpoint consistente posterior a `record_step` y una entrada explícita de reanudación que restaure:

- mundo y RNG;
- estado versionado del agente, o reconstrucción declarada desde el historial suficiente;
- último ActionResult;
- historial/contexto del recorder y su secuencia;
- configuración e identidad de código.

La continuación debe evitar `initialize()` y un `reset()` posterior a la restauración. Un contrato genérico de snapshot del agente requeriría operaciones equivalentes a `export_state/import_state`; el recorder necesitaría una representación portable distinta de sus tokens actuales. La alternativa por historial tiene coste de reconstrucción y depende de código, reset y entradas suficientes para reproducir las actualizaciones del agente.

No se añaden campos a ExperimentConfig, nuevos estados de ExperimentResult ni métodos al motor por publicar esta propuesta. La adopción de una interfaz requeriría una orden independiente.

## 7. Evidencia preservada y reproducción

[Expediente completo](resume-case-evidence.tar.gz), **83.106 bytes**, copiado sin modificar sus bytes del paquete externo original.

SHA-256: `46e53e12a5b149084fcb153ab1ad78f246289d2d4b2bbbbbd17e15b18404e82f`.

[Checksum](resume-case-evidence.tar.gz.sha256). El paquete contiene 18 miembros, incluido un manifiesto de hashes: plan, arnés, checkpoint, corrida continua, tres continuaciones, replay diferenciado, fallos mínimos de API, postcomprobación, log y registros de integridad.

Comandos de la ejecución original, Node `v24.22.1`:

```bash
node /tmp/world-lab-resume-5d40f08-hz3tlbii/resume-harness.cjs > /tmp/world-lab-resume-5d40f08-hz3tlbii/execution.log 2>&1
node /tmp/world-lab-resume-5d40f08-hz3tlbii/check-evidence.cjs
```

Las rutas `/tmp/...` y `/workspace/shared/...` del README interno son referencias históricas del entorno. Para reproducir, usar un directorio **nuevo**, copiar allí `plan.json`, `resume-harness.cjs` y `check-evidence.cjs`, y extraer `git archive 5d40f08fbb36c5bbe075628a5b9a9078ce9c017c` en su subdirectorio `source/`. Ejecutar los comandos con esa nueva ruta. El arnés rechaza sobrescribir resultados existentes. Estas instrucciones no se ejecutaron durante la publicación documental.

El expediente conserva que el HEAD del repositorio de trabajo original permaneció `0734e6f800796ae43f1821ed46093a9183080113`; la investigación utilizó una exportación separada de `5d40f08fbb36c5bbe075628a5b9a9078ce9c017c`. No se confunden ambas identidades. Los 662 blobs de la exportación coincidieron con el árbol solicitado; los 662 archivos del repositorio original no cambiaron.

Antes de publicar este expediente se comprobó su SHA-256, los 18 miembros, sus hashes declarados y ausencia de patrones de claves privadas/tokens. No se repitió ninguna ejecución experimental.

## 8. Alcance y aprendizaje reutilizable

Un caso técnico, un agente FrontierMemory, mismo código/runtime, feedback completamente expuesto, sin hazards ni regeneración y un corte confirmado no terminal. No demuestra reinicio genérico de cualquier agente, recuperación tras caída durante escritura ni conformidad global.

**EL-009:** restaurar un mundo no basta para continuar un agente con memoria. Deben preservarse o reconstruirse la memoria y el contexto temporal/registral correspondiente. Replay de acciones guardadas y nueva decisión del agente son capacidades distintas; deben verificarse por separado.

La referencia central es [ENGINEERING_LEARNINGS.md](../../ENGINEERING_LEARNINGS.md). Este registro no reabre P01, RC1 ni TITAN G2 y no altera la congelación operacional.
