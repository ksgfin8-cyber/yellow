# Estado de implementación de WORLD-LAB

Documento **informativo y operacional**, no normativo. Corte operativo F2-C (parcial):
2026-11-05, base `main` = `c740f23883bffa455ceb5aecdca30f0d9dfd71a7`.
Cambios F2-C en `dev/f2-c-world-initialization`; evidencia DOC-01 conservada donde sigue
vigente. Actualizar solo lo afectado por cada incremento.

## Autoridad, procedencia y lectura inicial

La autoridad es [WORLD-LAB v0.2.5 Canonical](WORLD-LAB_v0.2.5_canonical_transcripcion.md),
con la precedencia de §0.1: el código y estos documentos no sustituyen contratos,
invariantes ni pseudocódigo. Los vectores son referencias y T01–T280 criterios
de aceptación. FROZEN no significa ejecución ni conformidad demostrada (§0.3–§0.5).

Categorías de afirmaciones documentales, distintas de los estados normativos:
**VERIFIED** = contrato, código, commit o prueba examinados directamente en el incremento indicado;
**REPORTED** = declaración histórica no verificada independientemente aquí;
**INFERRED** = conclusión derivada de evidencia identificada;
**UNKNOWN** = evidencia insuficiente. VERIFIED por lectura se indica como tal;
no equivale a una prueba de comportamiento o conformidad.

Fuentes examinadas íntegramente: especificación y los informes
[F1-A](F1-A-deterministic-core.md) y [F1-B](F1-B-contracts.md), documentos
técnicos históricos previos a DOC-01. También se leyeron todos los módulos JS,
`index.html`, las tres herramientas de prueba de `tests/` y la suite legacy.
Historial contrastado con `git fetch origin`, `git log`, `git show`, diff y
referencias remotas de PR. No se examinó la discusión/revisión web de los PR.

| Evidencia histórica | Procedencia comprobada en DOC-01 |
|---|---|
| F1-A | VERIFIED (Git): [0356c21](https://github.com/ksgfin8-cyber/yellow/commit/0356c2123b4be10b974d07d911ab55b700fb8e1b), head de [PR #1](https://github.com/ksgfin8-cyber/yellow/pull/1); incorporado por `a5d293d` |
| F1-B | VERIFIED (Git): [e6bcea2](https://github.com/ksgfin8-cyber/yellow/commit/e6bcea28a9781c3120e24f35f5fd946577c14f07), head de [PR #2](https://github.com/ksgfin8-cyber/yellow/pull/2); incorporado por `c98243b` |
| Línea base legacy | VERIFIED (runner leído): `ad7cc990201193714875f7b7dfba26375dee0b40`, no el main actual |

Los informes conservan historia, no describen necesariamente el presente:
VERIFIED (diff/código), F1-B trasladó `ContractError` de `prng.js` a
[`core/contracts.js`](../js/core/contracts.js); hoy se carga antes de PRNG/hash/seed.
El runner `--baseline` actual lee HTML y scripts antiguos completos desde Git,
no solo los tres módulos core como describe el informe F1-A.
REPORTED: resultados y particularidades del runtime de las ejecuciones originales;
las ejecuciones F2-C siguientes son evidencia nueva, no certificación retroactiva.

## Estado por componente (actualizado F2-C)

| Incremento / componente | Estado y alcance de evidencia (DOC-01, actualizado F2-C) |
|---|---|
| F1-A: PRNG, UTF-8, FNV, semillas | Implementado; VERIFIED por ejecución de 18 casos locales. `next_int` admite extremos Number seguros y cardinalidad ≤2^32; esa decisión interna está documentada, sin ampliar §10.3. No es la suite canónica completa. |
| F1-B: contratos | Parcialmente implementado; VERIFIED por ejecución de B01–B12: WorldConfig, binary64, predicados Cell/Entity/WorldState y Action. No incorpora por sí solo esos contratos al motor. |
| FeedbackConfig / ExperimentConfig | Pendientes de cierre documental/integración. VERIFIED por lectura: clases legacy y un inspector parcial `complete:false`; TR-006/007. |
| WORLD | F2-A implementa tipos validados, copias profundas, WorldState.full_snapshot y delegación World.full_snapshot (§7–§9); VERIFIED por F2A-01–14. F2-B verifica generación y selección inicial (§11.2 recuperado/§11.3) con F2B-01–13. F2-C parcial añade preparación, lifecycle <=, eventos crudos y sync posterior (21 pruebas). Sin initialize_world/InitialWorldResult completos: INIT-004 bloquea la validación de metadatos de §11.7. Acciones, dinámica e initialize siguen legacy. TR-001/003/004/008 persisten. F2 completo no implementado. |
| EXPERIMENT | Ciclo legacy presente; pendientes secuencia canónica, transacción con rollback, determine_termination y ExperimentResult (§5, §20, §26.5, §32). TR-005. |
| Observaciones / agentes | Código legacy presente. VERIFIED por lectura: observación devuelve `time`, envuelve bordes y distingue stock; §16 exige `tick`/OUT_OF_BOUNDS y §35.6 S-2 no distinguir stocks. Agentes wait/random/rule existen; integración canónica no verificada. |
| Recorder / hashes | Código legacy presente. VERIFIED por lectura de `recorder.js`/`hash_state.js`: sin source/sequence ni listas action_events/lifecycle_events del StepRecord; record_step asigna rng_state del argumento WORLD. Hashes sobre texto, no WLS1. Migración pendiente (§4, §18, §21–§24, §34). |
| Replay / WLS1 / Metrics | Pendientes: no se encontraron implementaciones en el árbol JS inspeccionado. T20 legacy vuelve a ejecutar Experiment; no implementa replay. Ausencia no clasificada como defecto de F1-A/B. |
| Renderer / entrada web | Legacy presente, sin validación integrada. VERIFIED por lectura: render recibe World y `main.js` reconstruye su estado. TR-008 impide interpretar las pruebas actuales como validación de la aplicación. |
| Integración y conformidad global | No verificadas. UNKNOWN respecto al cumplimiento global; no existe evidencia ejecutada de T01–T280 ni interoperabilidad. §37 no se satisface con las pruebas locales. |

## Evidencia ejecutada en F2-C

En `/workspace/yellow`, Node.js v24.22.1, sin editar pruebas existentes:

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL, 0 omitidas; preparación/lifecycle crudo, no API canónica completa | 0 |
| `node tests/f1-a-legacy.cjs --baseline` | REPORTED: F2-B registró 4 PASS/18 FAIL; no reejecutado en F2-C | 1 histórico |
| `node tests/f1-a-legacy.cjs` | 22 casos: 4 PASS, 18 FAIL | 1 |
| `git diff --check` | sin errores | 0 |

VERIFIED (ejecución F2-C): el runner legacy actual pasa T01/T02/T03/T18; las otras 18 fallan con
`invalid initial_state` al construir EntityState desde World.initialize, que
sigue sin pasar lifecycle/config. Los fallos F2-A makeResource/makeHazard ya no
impiden las operaciones de generación autorizadas. No se alteraron las
aserciones ni los runners heredados. T18 no verifica el tipo exacto de excepción.
REPORTED (F2-B): el baseline falló 18 veces por Cell ausente y necesitó permiso
del subproceso Git. REPORTED (diagnóstico Node/VM F2-B, no repetido en F2-C): cargar los scripts HTML completos y ejecutar el
callback real de DOMContentLoaded (window simulado) falla en main.js →
Experiment.run → World.initialize → EntityState: ContractError("invalid initial_state").
No es validación de navegador/render ni de inicialización completa.
INFERRED: igualdad de resultados en las rutas alcanzadas no demuestra ausencia de
regresiones en movimiento, energía, ticks o render. UNKNOWN: comportamiento
integrado de esas rutas. No se realizó una auditoría general de conformidad.

## Divergencias y dependencias vigentes

Los estados VERIFIED de esta tabla certifican la observación citada, no conformidad.
Los diez IDs se conservan. F2-A resuelve TR-002 en su alcance estructural;
TR-008 queda parcialmente resuelta (carga corregida, dependencias operacionales
pendientes); TR-010 tiene copia exacta verificada pero integración temporal/WLS1
pendiente. F2-B resuelve generación/selección en el alcance recuperado, pero
TR-001 permanece parcialmente resuelta y TR-003–007/009 siguen abiertos.
F2-C es parcial: INIT-005 se resolvió con el contrato histórico recuperado;
INIT-004 permanece como posible contradicción normativa localizada y bloquea
§11.7/la API canónica completa, no las operaciones independientes verificadas. No se equipara funcionalidad futura
con defecto nuevo ni se consideran estas dependencias bloqueantes globales.

| ID | Componente | Evidencia | Impacto | Resolución prevista | Estado |
|---|---|---|---|---|---|
| TR-001 | Corpus normativo | Recuperación transmitida de v0.2.4 §§6.1/14/18/21.2 en F2-C: muerte <= y WorldEvent crudo definidos; §11.7 exige metadatos del RecordedEvent, INIT-004. Archivo histórico independiente no presente | Permite lifecycle/eventos crudos; persiste posible contradicción normativa inicial y faltan otros contratos heredados | Resolver §11.7 con autoridad, recuperar corpus restante; no declarar resuelta toda TR-001 | VERIFIED texto recibido/ejecución F2C-13–21; origen histórico REPORTED; parcialmente resuelta |
| TR-002 | EntityState y creación | F2-A resolvió tipo/copia; F2-C prepare_world_before_lifecycle usa lifecycle/config explícitos y F2C-03/04/08/13–21 los verifican | Preparación/lifecycle inicial válidos; World.initialize y consumidores EXPERIMENT aún usan la firma antigua | Evidencia: commits F2-A/F2-C en historial y pruebas citadas. Integrar únicamente cuando se cierre el contrato canónico de eventos/lifecycle | VERIFIED ejecución; estructura y preparación resueltas, incompatibilidad legacy no resuelta globalmente |
| TR-003 | Movimiento / observación | `World.apply_action` calcula target con módulo; `build_observation` también; WorldConfig exige BOUNDED (§6), §13/§16 definen bordes | Semántica legacy de bordes incompatible; T16 legacy exige wrap | Migrar bordes y comprobar OUT_OF_BOUNDS/orden de validación; no adaptar la norma a T16 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-004 | Configuración / daño | WorldConfig tiene hazard_damage; `world.js:apply_action` y T14 legacy leen hazard_effect; §6.1 | Productor y consumidor no coinciden; INFERRED: restar undefined podría producir NaN al alcanzar el peligro | Migrar consumo y probar energía finita y efectos; sin alias normativo inventado | VERIFIED (nombres); incompatibilidad de migración abierta; efecto integrado no ejecutado |
| TR-005 | EXPERIMENT / reloj | `experiment.js:run` incrementa time y regenera antes de observación/acción; `run_without_agent` no aplica WAIT y registra null; §5/§20/§32 | Orden/nulabilidad contrarios a norma; sin rollback transaccional | Migración en alcance F3 y pruebas de orden, terminación y fallos; dependencias TR-001 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-006 | FeedbackConfig / Feedback | §17 dice cuatro flags exactos sin nombres; `feedback.js` tiene tres con coerción `!!` y esquema de salida diferente | Clase legacy no es contrato canónico; no puede inventarse cuarto flag | Obtener nombres/dominos de fuente normativa y migrar configuración/proyección | VERIFIED por lectura; incompatibilidad heredada y dependencia documental abiertas |
| TR-007 | ExperimentConfig | `inspect_ExperimentConfig_defined_fields` siempre complete:false; constructor legacy exige max_ticks>0 y registro de agente; §19.1 contempla cero | Inspección sin issues no acredita aceptación; cero rechazado por constructor legacy | Recuperar contrato completo y unificar aceptación sin añadir restricciones inferidas | VERIFIED por lectura y B12; implementación parcial e incompatibilidad legacy abiertas |
| TR-008 | Carga / integración inicial | F2-A corrigió carga; F2-B corrigió factories en generación; F2-C prepara estado, resuelve lifecycle y produce eventos crudos independientemente. El runner actual aún falla en EntityState desde World.initialize | El nuevo helper no es alias ni reparación silenciosa de initialize_world/World.initialize | No usar la salida diagnóstica como InitialWorldResult; resolver INIT-004 antes de migrar consumidores | VERIFIED ejecución F2-C; carga/generación/preparación cubiertas, inicialización completa pendiente |
| TR-009 | Suite legacy | Ejecuciones arriba; `js/tests/tests.js`: T15/T19 contienen `|| true`; T18 captura su propia aserción; T20 compara dos runs; T21 no llama Renderer | PASS no siempre acredita intención; mismo conteo 4 PASS/18 FAIL con causas distintas no verifica integración ni replay | Diseñar pruebas pertinentes a contratos recuperados y a rutas antes bloqueadas; distinguir IDs locales/canónicos | VERIFIED lectura DOC-01/ejecución F2-C; límite de evidencia y defectos legacy abiertos |
| TR-010 | uint64 e integración | `is_uint64` admite BigInt uint64 o Number seguro; B08 y F2A-11; `experiment.js` usa `time += 1`; `hash_state.js` serializa texto; §6.3/§7/§34 | INFERRED: BigInt requiere integrar aritmética y serialización; aceptar estructura no garantiza interoperabilidad | Mantener exactitud al integrar reloj/WLS1 y probar extremos; no convertir a Number con pérdida | VERIFIED representación/B08 y F2A-11; copias exactas verificadas en F2-A; integración reloj/WLS1 abierta |

No se identificó una desviación normativa nueva no autorizada mediante esta
revisión focalizada; ello no certifica su ausencia fuera de lo examinado.

## Dependencias localizadas para continuar

| Contrato / operación afectada | Qué falta o requiere resolución | Trabajo independiente posible | Evidencia para cerrar |
|---|---|---|---|
| §11.2: generación del mapa | Algoritmo recuperado desde el texto histórico v0.2.4 proporcionado en la orden F2-B; falta fuente independiente en repo | Generación y selección ya verificadas; pueden usarse sin inicialización completa | Conservar procedencia y recuperar documento original para trazabilidad duradera; no reconstruir otras cláusulas |
| §13–§15/§18: acciones, lifecycle, eventos | Condición <= y WorldEvent/RecordedEvent recuperados en F2-C; persiste INIT-004 y faltan contratos operacionales de acción/dinámica | Preparación, lifecycle inicial y eventos crudos ya verificados; no enriquecer en WORLD | Resolver compatibilidad §11.7 y recuperar contratos operacionales sin extender esta fase |
| §11.1/§11.7/§26: inicialización y errores | §11.7 demanda metadatos incompatibles con WorldEvent crudo; captura de errores delimitada por orden F2-C §6.6 | Preparación/lifecycle/sync, con error de posición preservando semilla y otros errores sin envolver | Decisión autorizada sobre §11.7 antes de cerrar la API; no alterar v0.2.5 unilateralmente |
| §17/§19: feedback y aceptación del experimento | Nombres de cuatro flags, dominios/validación heredados | WORLD sin agente/feedback dentro de contratos disponibles | Esquemas normativos completos; pruebas de configuración pertinentes |
| §21/§25/§26.5/§34: registro, replay, atomicidad y bytes | Algoritmos heredados; WLS1 V1 de 59 bytes no reproducido; V2–V10 declarados pendientes | No bloquea todo trabajo estructural F2; sí cierre de equivalencia afectada | Corpus anterior, vectores y pruebas respectivas antes de F3/F4 dependiente |
| §31/§36/§37: aceptación completa | I-01–I-66 y definiciones individuales de tests no reproducidos; T61–T80 no están asignados en tabla §36 | Pruebas locales trazables sin llamarlas suite canónica | Invariantes/casos originales y resolución del inventario incompleto |

VERIFIED: esas referencias/omisiones están en la transcripción examinada;
el algoritmo de mapa también está en el texto de la orden F2-B recibida.
UNKNOWN: contenido exacto omitido y disponibilidad en fuentes externas.
Las tensiones señaladas requieren revisión, no son permiso para corregir la norma
ni refutan por sí solas toda la declaración histórica de cierre.

## Trayectoria provisional y mantenimiento

Plan informativo, sin autorización funcional ni fuerza normativa:
F2 — WORLD (estructuras, inicialización, transiciones, dinámica);
F3 — EXPERIMENT (reloj, atomicidad, ejecución, terminación);
F4 — RECORDER/REPLAY (eventos, hashes, WLS1, reproducción);
F5–F6 — integración, agentes, pruebas y conformidad.
INFERRED: la siguiente orden debe acotar trabajo según dependencias resueltas;
no basta asignar una fase del plan para considerar definido su contrato.

En cada incremento actualizar solo componentes afectados, divergencias nuevas o
resueltas, evidencia que cambió y dependencias del siguiente paso. Conservar
referencias históricas sin duplicar informes. Marcar una divergencia resuelta
solo con commit/PR y prueba pertinente verificables.
Toda entrega informa **contratos, comportamiento observable, evidencia ejecutada
y divergencias**. Es una regla mínima de continuidad; no crea aprobación para
cada decisión interna ni exige repetir auditorías generales. Antes de F2-A, la
revisión de continuidad reúne especificación disponible, informes F1-A/F1-B,
estos dos documentos, código, pruebas y dependencias. Cada incremento requiere
su alcance autorizado; F2-B no autoriza el siguiente.

## Integración estructural F2-A — contrato y uso

Evidencia histórica F2-A, contrastada nuevamente por sus 14 pruebas: archivos afectados: `js/world/cells.js`, `entity.js`,
`world_state.js`, `world.js` (solo delegación full_snapshot), `index.html`,
`tests/f2-a.test.cjs` y este estado vivo. Norma, validadores F1-B, algoritmos F1-A,
operaciones WORLD/EXPERIMENT y pruebas heredadas permanecen sin cambios.

| Contrato | API / decisión interna | Prueba local |
|---|---|---|
| §8 | `new Cell(traversal, effect)`, free/blocked/copy; effect explícito y clonado, sin coerción falsy→null, sin ejecución de efectos | F2A-01–03 |
| §9 | `new EntityState(id, position, energy, lifecycle, config)`; cuatro campos propios; posición copiada | F2A-04–06 |
| §7.1 | `new WorldState(time, grid, entities, rng_state, config)` valida antes de copiar; Map con una entidad, grid/efectos/posiciones independientes | F2A-07–09/12 |
| §7.2 | copy/full_snapshot copian estado; World.full_snapshot delega sin leer RNG, inicializar o alterar reloj | F2A-10/13 |
| §6.3/§7 | preservación exacta de energía (incluido -0), RNG y tipo/valor Number seguro o BigInt uint64, sin conversión numérica | F2A-11 |
| Carga de tipos | Todas las rutas script HTML existen y los tipos se cargan en ese orden real | F2A-14 |

`config` es contexto interno de validación de posiciones/dimensiones, no campo
del registro. Se captura como WorldConfig congelado en campo privado #config;
Reflect.ownKeys conserva exactamente los campos del esquema. No se comparte
configuración mutable externa. Las entradas inválidas producen ContractError
("invalid initial_state"), no InitializationError ni reparaciones de datos.
Copiar un objeto mutado inválido también se rechaza antes de proyectar campos:
no se eliminan silenciosamente claves adicionales ni se trunca rng_state.
Los objetos permanecen mutables para operaciones futuras; las copias son
independientes, no snapshots congelados. El constructor también aísla sus entradas.

Diferencias intencionales frente al legacy: lifecycle y config son explícitos;
no se asume ACTIVE para llamadas incompletas ni se mantiene una firma inválida
para hacer pasar el motor anterior. El nuevo estado conserva RNG sin >>>0 y el
tiempo sin coerción. Los efectos son registros estructurales literales validados;
no se añadieron makeResource/makeHazard/EffectKind ni dinámica artificial.

## Generación y selección F2-B — contrato y uso

VERIFIED: se leyó íntegramente la transcripción y la documentación de
implementación; se reutilizan PRNG F1-A, validadores F1-B y Cell F2-A sin cambios.
La orden F2-B de 2026-11-05 proporcionó el algoritmo de §11.2 **recuperado desde
el texto histórico de WORLD-LAB v0.2.4**, conservado por referencia en v0.2.5.
Su contenido **no está todavía incorporado al repositorio como fuente histórica
independiente**. La procedencia histórica es REPORTED por la orden; el texto
recibido y la implementación fueron examinados directamente. No se completa
por inferencia el resto de v0.2.4 ni se modifica la especificación canónica.

| Contrato | Implementación / comprobación | Pruebas locales |
|---|---|---|
| §11.2 recuperado | World._generate_grid(rng = this.rng) devuelve grid de Cell válido; recorrido y/x, comparación estricta <, un float en BLOCKED y dos en FREE, ninguno adicional para efectos | F2B-01–04/10 |
| §11.3 | World._choose_initial_position(grid, rng = this.rng), candidatos FREE sin efecto en orden y/x; recursos stock=0 también excluidos; una llamada next_int(0,n-1), incluso singleton | F2B-05/06/11 |
| §11.3 sin candidatos | InitializationError distinto de ContractError; mensaje y reason exactos "invalid initial_position"; cero llamadas RNG | F2B-07 |
| §6/§8 | Config válida, grid rectangular y celdas válidas antes de seleccionar; errores contractuales sin consumir RNG | F2B-08 |
| Determinismo y estado RNG | Oráculo independiente con Xorshift32 BigInt, recorrido plano y rechazo para selección; comparación estructural y del RNG antes/después de selección, semillas 1/42/0x80000000/0xffffffff | F2B-09/10 |
| §5 / fronteras del alcance | Sin leer/escribir state/time, sin entidades, eventos o sync_rng_state; éxito y fallo sin cambios de reloj Number/BigInt | F2B-12/13 |

Archivos de F2-B: `js/world/world.js`, `tests/f2-b.test.cjs` y este documento.
La clase InitializationError en world.js cubre únicamente el fallo sin candidatos
de §11.3. No crea InitialWorldResult ni InitializationFailure, no envuelve otros
errores y no inventa una semilla inicial a partir del estado actual del RNG.
El registro/completitud de errores de initialize_world sigue pendiente.

La única llamada a next_int puede consumir varias extracciones internas por el
rechazo ya normado en F1-A; no se confunde llamada de API con extracción uint32.
Los recursos se crean con {kind:"RESOURCE",stock:1}, peligros con {kind:"HAZARD"};
no se añadieron factories ni mecánicas. EffectKind sigue referenciado en acciones/
dinámica legacy fuera de alcance: no se eliminan esas dependencias todavía.

VERIFIED (comparación contra main): initialize(seed), acciones, dinámica y
persistencia son idénticos a la base; contratos/algoritmos F1 y tipos F2-A tampoco
cambian. World.initialize no funciona con las firmas actuales, intencionalmente
sin compatibilidad artificial: no se le añadieron lifecycle/config, eventos,
resolve_lifecycle, InitialWorldResult ni procedimiento initialize_world completo.
El avance observable es que generación/selección ya no dependen de factories
ausentes; el diagnóstico alcanza ahora el siguiente bloqueo real de migración.

F2-C compone entidad/estado, resolución inicial, eventos crudos, sincronización
y snapshot de forma independiente. Para completar initialize_world queda por
resolver §11.7 frente a los tipos de evento recuperados y cerrar la salida
canónica, sin trasladar responsabilidades al WORLD. TR-001 no se resuelve
globalmente. Bordes/daño operativo, feedback, ejecución y replay no se implementan
aquí. Pruebas locales distintas de T01–T280; sin conformidad global.

## Registro de resoluciones de ingeniería y cuestiones normativas

**F2-C parcialmente implementado.** No existe una API initialize_world completa ni
se devuelve InitialWorldResult. Hay dos helpers de preparación explícitamente
parciales: `prepare_world_before_lifecycle(config, seed)` termina antes del paso
8; `prepare_world_through_lifecycle(config, seed)` realiza una resolución inicial,
sync_rng_state y validación estructural, devolviendo `{world, initial_events,
snapshot}` como resultado interno/diagnóstico, no como contrato canónico final.
El segundo no realiza el paso 11 de §11.1: su aparente incompatibilidad normativa
está identificada, no se omite silenciosamente para declarar éxito canónico.

| ID | Clasificación | Referencia | Evidencia | Resolución / estado | Impacto |
|---|---|---|---|---|---|
| INIT-001 | Contrato normativo explícito | §6, §7, §10, §11.1 pasos 1–7 y §11.3/4 | F2C-01–07/12: config/semilla, PRNG original, mapa/posición F2-B, entidad única 0987898, energía exacta, ACTIVE antes de resolución, time=0 | Preparación estructural verificada sin consumo RNG adicional | Constructor F2-A recibe config/lifecycle; RNG refleja extracciones reales |
| INIT-002 | Contrato normativo incorporado por referencia | v0.2.4 §§6.1/14/18/21.2 conservados por v0.2.5; recuperación transmitida durante F2-C | Texto recibido especifica energy <= death_threshold, WorldEvent de tres campos, RecordedEvent con tick/source/sequence y enriquecimiento exclusivo en Recorder | Aplicado solo lo conservado: condición exacta, lifecycle inicial y eventos crudos; no se implementa Recorder | Desbloquea INIT-005 y payload crudo; no resuelve §11.7 ni todo TR-001 |
| INIT-003 | Decisión de implementación compatible | initialize_resources en §11.1; stock=1 establecido por generación F2-B y orden F2-C §6.3 | F2C-07/11/12 comprueban conservación de celdas/stock/RNG | verify_generated_initial_resources valida sin mutación el dominio generado; rechaza stock agotado sin repararlo | No define initialize_resources general ni crea segunda distribución; semántica histórica general aún UNKNOWN |
| INIT-004 | Posible contradicción normativa localizada | §4/§11.1/§11.7 de v0.2.5 frente a §18 y §21.2 recuperados | WorldEvent={type,entity_id,position}; RecordedEvent añade tick/source/sequence solo en Recorder; §11.1 valida los eventos crudos antes de Recorder, pero §11.7 exige esos tres metadatos | Sin representación inventada, enriquecimiento en WORLD, validación debilitada ni API final declarada completa; pendiente decisión autorizada | Bloquea validate_initial_events_consistency completa y cierre de initialize_world/InitialWorldResult; no las operaciones independientes |
| INIT-005 | Contrato incorporado recuperado; laguna inicial resuelta | v0.2.4 §6.1/§14, no sustituido por v0.2.5 | Recuperación explícita: energy <= death_threshold, energías/umbrales negativos permitidos, ACTIVE inicial, sin resurrección ni duplicados; F2C-13/15/16/20 | World.resolve_lifecycle implementa condición y una transición con evento crudo; preparación inicial lo invoca exactamente una vez | Muerte, igualdad y negativos verificados; no depende del código legacy como autoridad |
| INIT-006 | Contrato explícito y delimitación autorizada de errores | §6/§10/§11.3/§26; orden F2-C §6.6 | F2C-09/10/19: no candidatos conserva seed original y reason/mensaje invalid initial_position; otros errores preservan identidad | Solo fallo de posición recibe seed en la composición; no se envuelven errores de configuración/contrato/programación | No crea categorías nuevas ni convierte RNG actual en semilla; comportamiento aplicado por autorización explícita F2-C |
| INIT-007 | Decisión de implementación compatible | Orden §11.1 pasos 8–10 y frontera de helper parcial | F2C-16/17/18: resolve una vez → sync una vez → validación estructural → snapshot diagnóstico; sin draws ni cambio temporal | Pipeline independiente verificado, sin presentar el snapshot como resultado validado por §11.7 | Falta la decisión normativa de eventos para salida canónica; no se altera la norma |
| INIT-008 | Incompatibilidad de migración | World.initialize y EXPERIMENT | Código legacy intacto; runner F2-C 4 PASS/18 FAIL con invalid initial_state | Sin alias de compatibilidad; consumidores pendientes de API canónica | TR-002/TR-008 no resueltas de extremo a extremo; no se modifica EXPERIMENT |
| INIT-009 | Consecuencia normativa derivada y representación interna | §11.7 exige correspondencia de entity_id/position con el estado inicial; esquema WorldEvent recuperado | F2C-14: evento ENTITY_DIED contiene id y copia de coordenadas de la entidad; exactamente tres campos propios | Payload crudo sin referencias mutables compartidas; no se añaden tick/source/sequence | Correspondencia del payload verificada, sin afirmar verificados los metadatos contradictorios de §11.7 |

### Procedencia y recuperación localizada

VERIFIED por lectura/Git: main c740f23, historial no superficial, rutas históricas
y referencias remotas inspeccionados. Los antiguos docs/specifications
(909a43f/baa785e) y docs (764910f) contienen LF, no cláusulas §14/§18.
No se encontró un documento histórico independiente en las ramas consultadas.

Durante F2-C el usuario aportó la recuperación auténtica atribuida a
**WORLD-LAB v0.2.4 Canonical, Texto pegado(5).txt de conversaciones anteriores**:
condición <= de §§6.1/14; WorldEvent/RecordedEvent de §18 y recepción de eventos
crudos por Recorder §21.2, que enriquece con tick=0, source="lifecycle" y
sequence=next_sequence() sin volver a resolver lifecycle. VERIFIED: contenido
recibido, contraste con la transcripción y ejecución de sus partes implementadas.
REPORTED: atribución/autenticidad del archivo histórico original, no inspeccionado
íntegramente ni incorporado al repositorio como fuente independiente. No se
presumen recuperadas cláusulas no transmitidas. v0.2.5 conserva §18 por referencia
y no sustituye la condición matemática de muerte; sí introduce §11.7, que
mantiene la cuestión normativa localizada descrita en INIT-004.

### Alternativas examinadas y límite de la resolución

Antes de la recuperación, < y <= producían diferencias observables y no podían
seleccionarse como decisión interna. La fuente transmitida resolvió esa laguna:
se implementa <= por contrato incorporado, no porque el legacy lo use.

Con los tipos históricos ahora disponibles, el problema de §11.7 ya no se trata
como incompatibilidad legacy: validar los eventos crudos de §11.1 exige campos
propios de RecordedEvent antes de Recorder. Cambiar de tipo/etapa, construir una
proyección enriquecida, añadir propiedades ocultas, debilitar validaciones o
pasar [] para esconder la muerte no está autorizado. Se registra como **posible
contradicción normativa** con evidencia explícita y se reserva su resolución.
No se declara completa initialize_world ni se publica una alternativa arbitraria
como canónica. El helper finaliza únicamente las operaciones independientes y
marca su salida como diagnóstico de preparación parcial.

### Evidencia y límites actuales

Archivos F2-C: `js/world/world.js` (resolve_lifecycle y helpers de preparación),
`tests/f2-c.test.cjs` y este documento. Disponibles en la rama F2-C tras cargar
world.js; sin cambios a HTML, tipos/validadores, algoritmos F1/F2-B, acciones,
dinámica, observaciones, feedback, recorder, hashes, replay o agentes.

VERIFIED por ejecución: 21 pruebas locales. Se verificaron construcción,
configuración/semilla, determinismo antes y después de lifecycle, recursos sin
redistribución, ID/posición/energía, ACTIVE previo, muerte por <=, negativos,
una resolución en la preparación inicial, ausencia de resurrección/duplicados,
raw WorldEvent, RNG exacto/sin draws adicionales, sync posterior y snapshot
profundo e independiente. No son T01–T280 ni prueba de interoperabilidad.

**No implementados ni ejecutados**: enriquecimiento (fuera de alcance), validación
completa de initial_events con tick/source/sequence de §11.7 y devolución canónica
InitialWorldResult por initialize_world. No hay aserciones eliminadas ni pruebas
omitidas que se cuenten como aprobadas. F2-C sigue parcial por INIT-004.

Para continuar: decisión autorizada que resuelva §11.7 frente a eventos crudos y
responsabilidad exclusiva del Recorder, integrar los pasos finales de validación/
resultado y después migrar World.initialize y consumidores. TR-001 permanece
parcialmente resuelta; no se altera v0.2.5 ni se inicia F2-D/F3.
