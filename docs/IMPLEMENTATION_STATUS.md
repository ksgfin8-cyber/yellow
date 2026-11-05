# Estado de implementación de WORLD-LAB

Documento **informativo y operacional**, no normativo. Corte operativo F2-F:
2026-11-05 (America/Guayaquil), base `main` posterior al PR #9 =
`b37abd3f46d4aa8032556e0dbc92b5a41c6c0448`. Rama: `dev/f2-f-world-observation`.

Corte anterior F2-E: base `f8aaca31951e425333416cfce85a031572890cfe`,
rama `dev/f2-e-world-dynamics`.

Referencia del corte anterior F2-D: base `4729c999ebf97c4d643bf688abf7e2ec1acc8509`.
La entrega parcial `1d2bc5c` fue incorporada por el usuario en PR #7;
HEAD remoto observado al entregar la continuación: `e76754e0a95483818633e5121a5f6c205ec92de0`.
Entrega F2-D en `dev/f2-d-world-actions`; evidencia DOC-01 conservada donde sigue
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
las ejecuciones F2-D siguientes son evidencia nueva, no certificación retroactiva.

## Estado por componente (actualizado F2-F)

| Incremento / componente | Estado y alcance de evidencia (DOC-01, actualizado F2-F) |
|---|---|
| F1-A: PRNG, UTF-8, FNV, semillas | Implementado; VERIFIED por ejecución de 18 casos locales. `next_int` admite extremos Number seguros y cardinalidad ≤2^32; esa decisión interna está documentada, sin ampliar §10.3. No es la suite canónica completa. |
| F1-B: contratos | Parcialmente implementado; VERIFIED por ejecución de B01–B12: WorldConfig, binary64, predicados Cell/Entity/WorldState y Action. No incorpora por sí solo esos contratos al motor. |
| FeedbackConfig / ExperimentConfig | Pendientes de cierre documental/integración. VERIFIED por lectura: clases legacy y un inspector parcial `complete:false`; TR-006/007. |
| WORLD | F2-A implementa tipos validados, copias profundas, WorldState.full_snapshot y delegación World.full_snapshot (§7–§9); VERIFIED por F2A-01–14. F2-B verifica generación y selección inicial (§11.2 recuperado/§11.3) con F2B-01–13. F2-C parcial añade preparación, lifecycle <=, eventos crudos y sync posterior (21 pruebas). Sin initialize_world/InitialWorldResult completos: INIT-004 bloquea la validación de metadatos de §11.7. F2-D implementa apply_action con validación, MOVE BOUNDED, precedencia completa, costes y efectos con los campos canónicos, WAIT y resultados bajo decisiones de ingeniería explícitas (28 pruebas). Conformidad histórica de ActionResult/eventos no verificada. F2-E implementa advance_dynamics y regeneración binaria determinista con validación y preparación/confirmación (16 pruebas); fórmula conservada como decisión de ingeniería DYN-P01. F2-F migra observación pura BOUNDED, tick exacto, privacidad de stock y validación (18 pruebas). initialize sigue legacy. TR-003 queda resuelta en alcance espacial local; TR-001/004/008 persisten. F2 completo no implementado. |
| EXPERIMENT | Ciclo legacy presente; pendientes secuencia canónica, transacción con rollback, determine_termination y ExperimentResult (§5, §20, §26.5, §32). TR-005. |
| Observaciones / agentes | F2-F implementa observación pura tick/self/local_view, BOUNDED, OUT_OF_BOUNDS, occupied=false y RESOURCE sin distinción de stock (18 pruebas locales). Subesquemas y capacidad documentados como OBS-P01–03, no conformidad histórica demostrada. Agentes sin cambios ni nueva auditoría; integración no verificada. |
| Recorder / hashes | Código legacy presente. VERIFIED por lectura de `recorder.js`/`hash_state.js`: sin source/sequence ni listas action_events/lifecycle_events del StepRecord; record_step asigna rng_state del argumento WORLD. Hashes sobre texto, no WLS1. Migración pendiente (§4, §18, §21–§24, §34). |
| Replay / WLS1 / Metrics | Pendientes: no se encontraron implementaciones en el árbol JS inspeccionado. T20 legacy vuelve a ejecutar Experiment; no implementa replay. Ausencia no clasificada como defecto de F1-A/B. |
| Renderer / entrada web | Legacy presente, sin validación integrada. VERIFIED por lectura: render recibe World y `main.js` reconstruye su estado. TR-008 impide interpretar las pruebas actuales como validación de la aplicación. |
| Integración y conformidad global | No verificadas. UNKNOWN respecto al cumplimiento global; no existe evidencia ejecutada de T01–T280 ni interoperabilidad. §37 no se satisface con las pruebas locales. |

## Evidencia ejecutada en F2-D

En `/workspace/yellow`, Node.js v24.22.1, sin editar suites anteriores a F2-D:

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL, 0 omitidas; preparación/lifecycle crudo, no API canónica completa | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL, 0 omitidas; helpers y transiciones públicas bajo políticas explícitas | 0 |
| `node tests/f1-a-legacy.cjs --baseline` | REPORTED: F2-B registró 4 PASS/18 FAIL; no reejecutado en F2-C | 1 histórico |
| `node tests/f1-a-legacy.cjs` | 22 casos: 4 PASS, 18 FAIL | 1 |
| `git diff --check` | sin errores | 0 |

VERIFIED (ejecución F2-D): el runner legacy actual pasa T01/T02/T03/T18; las otras 18 fallan con
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
| TR-001 | Corpus normativo | Recuperación transmitida de v0.2.4 §§6.1/14/18/21.2 en F2-C; INIT-004 persiste. Sin fuente histórica independiente adicional para acciones | ActionResult, WAIT, costes/efectos y eventos mantienen riesgo de conformidad histórica; no contradicción demostrada | Directiva complementaria F2-D autoriza políticas compatibles ACT-P01–06; conservar riesgo histórico y resolver §11.7 con autoridad | Parcialmente resuelta; VERIFIED implementación/pruebas locales, conformidad histórica restante UNKNOWN |
| TR-002 | EntityState y creación | F2-A resolvió tipo/copia; F2-C prepare_world_before_lifecycle usa lifecycle/config explícitos y F2C-03/04/08/13–21 los verifican | Preparación/lifecycle inicial válidos; World.initialize y consumidores EXPERIMENT aún usan la firma antigua | Evidencia: commits F2-A/F2-C en historial y pruebas citadas. Integrar únicamente cuando se cierre el contrato canónico de eventos/lifecycle | VERIFIED ejecución; estructura y preparación resueltas, incompatibilidad legacy no resuelta globalmente |
| TR-003 | Movimiento / observación | F2-D verifica MOVE BOUNDED; F2-F elimina módulo de build_observation y verifica centro/bordes/esquinas/mapas estrechos con F2F-02–07 | Movimiento y proyección espacial corregidos localmente; orquestación experimental no verificada | Conservar evidencia local y comprobar consumidores cuando se integren; subesquemas/capacidad OBS-P01–03 explícitos | VERIFIED ejecución F2-D/F2-F; divergencia espacial resuelta en alcance local, sin cerrar TR-008 ni certificar aplicación completa |
| TR-004 | Configuración / daño | apply_action usa move_cost, wait_cost, resource_effect y hazard_damage; F2D-14/15/19/21/27 verifican contabilidad | Consumidor de daño migrado sin alias hazard_effect; integración legacy no alcanzada por inicialización inválida | Conservar evidencia local y verificar consumidores al integrarlos; políticas de orden/eventos ACT-P03/04 pendientes de contraste histórico | VERIFIED lectura/ejecución F2-D; divergencia de campo resuelta en apply_action, conformidad integrada no verificada |
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
| §13–§15/§18: acciones, lifecycle, eventos | Condición <= y WorldEvent/RecordedEvent recuperados en F2-C; persiste INIT-004 y faltan contratos operacionales de acción/dinámica | Preparación/lifecycle, acciones F2-D y dinámica F2-E verificadas localmente; políticas de ingeniería identificadas | Resolver §11.7 y contrastar políticas de acciones/regeneración con fuente histórica si aparece; integración experimental pendiente |
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
parcialmente resuelta; no se altera v0.2.5. La orden F2-C no autorizaba
F2-D/F3; el trabajo posterior requiere su propia orden.

## F2-D — transiciones de acción y políticas de ingeniería

**Implementación funcional local:** World.apply_action reconoce las cinco acciones,
mueve en BOUNDED, aplica costes y efectos, y devuelve resultados cerrados bajo
las políticas siguientes. No se declara conformidad histórica de ActionResult ni
del catálogo de eventos, conformidad global o interoperabilidad demostrada.
INIT-004 permanece abierto e independiente de estas transiciones.

### Autoridad y límite documental

VERIFIED por lectura: §§0/4/5.1–5.2/6–9/12–14/18/26/31/33 aplicables,
estado operacional pertinente, EL-001–005 y módulos/fixtures F1-B/F2-A/F2-C.
La transcripción §13 no reproduce el esquema completo de ActionResult ni el
catálogo de eventos operacionales. Los archivos históricos docs/specifications
(909a43f/baa785e) y docs (764910f) contienen solo LF; la búsqueda focalizada
no recuperó una fuente independiente adicional. La directiva complementaria
F2-D declara agotadas las fuentes disponibles y autoriza resolver las
indeterminaciones mediante ingeniería compatible, simple, determinista y
verificable. No se repite la búsqueda sin nuevas fuentes concretas.

ACT-001 (esquema/resultados/eventos) y ACT-002 (WAIT/costes/efectos) quedan como
**riesgos de conformidad histórica**, gestionados mediante ACT-P01–06; no son
contradicciones demostradas ni bloqueos generales. Ninguna política se presenta
como la única alternativa permitida. Código y pruebas legacy no son autoridad.
El WorldEvent de tres campos y enriquecimiento exclusivo del Recorder recuperados
en F2-C conservan su autoridad; no se añaden metadatos en WORLD.

### Contratos normativos implementados

| Obligación conocida | Implementación / comprobación | Pruebas locales |
|---|---|---|
| §7/§12/§13: precondiciones, Action cerrada y cinco tipos | assert_WorldState, entidad seleccionada, assert_Action_structural y reconocimiento separado; desconocidos producen ContractError | F2D-01–03/13 |
| BOUNDED / desplazamientos de orden F2-D | x+dx/y+dy sin módulo; cuatro direcciones y cuatro bordes reales | F2D-04/05/14 |
| §13: precedencia MOVE | ENTITY_NOT_ACTIVE → OUT_OF_BOUNDS → BLOCKED_CELL → INSUFFICIENT_ENERGY | F2D-06/07/16/17/20 |
| §6.3–6.4: aritmética | Number binary64, suma finita y canonicalize_binary64; sin saturación ni redondeo decimal adicional | F2D-09/10/22/23 |
| Configuración canónica | Solo move_cost/wait_cost/resource_effect/hazard_damage en acciones, sin alias legacy | F2D-14/15/19/21/27 |
| §4/§5/§13: fronteras | Sin cambio de time, lifecycle o rng_state, sin leer RNG, sync, dinámica, resolve_lifecycle ni ENTITY_DIED | F2D-11/25 |
| Determinismo / estado válido | Dos fixtures con ledger esperado independiente y validación de estado tras cada paso | F2D-12/27 |

### Decisiones observables autorizadas, no contratos históricos recuperados

| ID | Indeterminación y contratos conocidos | Alternativas consideradas | Decisión adoptada y justificación | Pruebas | Riesgo pendiente |
|---|---|---|---|---|---|
| ACT-P01 | Esquema/dominios de ActionResult; §13 exige resultado y energy_delta, motivos MOVE conocidos | Añadir contexto redundante o resultado mínimo; diversas clasificaciones de fallo | Exactamente {validity,reason,energy_delta,events}. VALID/NONE al ejecutar; INVALID para entidad inactiva/borde/bloqueo; FAILED/INSUFFICIENT_ENERGY. Sin entity_id/action redundantes; objetos/listas nuevos | F2D-13–18/26/28 | Esquema y clasificación históricos no verificados; consumidores futuros deben contrastarlos |
| ACT-P02 | WAIT, disponibilidad energética y costes cero; §13 fija precedencia MOVE y §6 permite energía negativa | Cobrar intentos fallidos, permitir deuda o exigir energía >= coste | Rechazo sin mutación ni coste. MOVE/WAIT requieren energy >= coste antes de efectos; igualdad permite ejecutar. WAIT requiere ACTIVE, cobra wait_cost y no reentra en efectos. Energía negativa no puede pagar ni coste cero. Regla uniforme y local | F2D-15–18/20/22 | Semántica histórica de WAIT/fallos/negativos no recuperada; puede requerir migración futura |
| ACT-P03 | Orden coste/efecto y consumo; tipos F2-A fijan RESOURCE(stock 0/1), HAZARD estático y configuración canónica | Efecto antes/después del coste; activar también en WAIT | Coste primero; solo entrada MOVE activa efecto. RESOURCE stock1 suma resource_effect y pasa a0 incluso si efecto=0; stock0 no aporta. HAZARD resta hazard_damage, no cambia celda. Sin regeneración ni lifecycle, incluso con energía final negativa | F2D-19–21/27 | Orden/activación históricos no verificados; política conserva tipos y contabilidad reproducible |
| ACT-P04 | Catálogo de eventos de acción ausente; §13 prohíbe ENTITY_DIED; Recorder enriquece exclusivamente | Inventar nombres/payloads o emitir lista vacía | events:[] para toda acción. No se afirma ausencia normativa de eventos: se evita inventar catálogo y se aísla la decisión en el resultado | F2D-15–27 | Trayectorias podrían carecer de eventos exigidos históricamente; replay/interoperabilidad no demostrados |
| ACT-P05 | Significado exacto de energy_delta no reproducido; §13/§6.3 exigen binary64 y §6.4 canonicalización | Suma nominal de costes/efectos o diferencia efectiva | canonicalize_binary64(energía_final - energía_previa); rechazos +0. Diferencia efectiva permite reconciliar estado y resultado con redondeo binary64; puede ser0 aunque coste nominal sea positivo en magnitudes grandes | F2D-14/19/21/22/27 | Convención histórica no verificada; serialización/replay futuros deben usar la misma definición |
| ACT-P06 | Atomicidad local ante error; §6 exige rechazo de candidatos no finitos sin mutación parcial | Mutar mientras se calcula o preparar antes de confirmar | Preparar energía, delta, destino y stock antes de escrituras; comprobar campos propios escribibles de registros F2-A antes de confirmar. Sin rollback global ni cambios a EXPERIMENT; solución local para datos ordinarios | F2D-10/13/23/24 | No promete atomicidad ante objetos hostiles Proxy ni transacción global del experimento |

Evaluación de efectos: las decisiones no consumen aleatoriedad y producen el
mismo estado para iguales entradas; los costes/ganancias se calculan en orden
explícito y el delta refleja la diferencia efectiva. Solo cambian posición,
energía y stock autorizados; el reloj, RNG y lifecycle quedan separados.
No se invaden responsabilidades del Recorder/EXPERIMENT. Por lectura, Feedback
consume validity/reason/events y Recorder consume events y conserva el resultado;
no se verificó su integración. El EXPERIMENT legacy añade muerte fuera de WORLD
y sigue pendiente de migración. Esquema, clasificación, delta y lista vacía son
riesgos explícitos para trayectorias y replay; no se afirma interoperabilidad.

### Evidencia, diferencias y límites

Archivos F2-D: js/world/world.js, js/interface/action_result.js,
tests/f2-d.test.cjs y este documento. Frente a main se sustituye apply_action
legacy (envoltura toroidal, hazard_effect, dependencia EffectKind y eventos
operacionales heredados) por transiciones y políticas documentadas. Se reutilizan
los validadores, tipos y helpers de fixtures existentes sin debilitarlos.

VERIFIED por ejecución: F2D-01–28 pasan, sin omitidas. Oráculos de movimiento,
precedencia y ledger fijan resultados esperados independientes; se incluyen
stock0/1, efectos/costes0, igualdad energética, negativos, ceros con signo y
redondeo de grandes magnitudes. F2D-10 prueba overflow de la suma pura;
F2D-23 **inyecta** un candidato infinito en la segunda operación para comprobar
rechazo previo a escrituras: no afirma que ese overflow sea alcanzable con
costes/efectos uint32 válidos. F2D-24 comprueba campos no escribibles.
El harness usa structuredClone para normalizar prototipos host/VM conservando
Map/BigInt y datos exactos; no se debilitan aserciones heredadas.

Las suites F1-A/F1-B/F2-A/F2-B/F2-C mantienen 18/12/14/13/21 aprobadas;
F2-D añade 28 (106 en total). Diagnóstico legacy: 4 PASS/18 FAIL por
invalid initial_state en World.initialize, sin nueva diferencia observable
respecto a la ejecución anterior, pero sin cobertura integrada de acciones.
Los comandos/resultados/exit figuran en la tabla de evidencia anterior.

VERIFIED por comparación con main: norma, core, contratos, tipos, inicialización,
generación, lifecycle, dinámica, observaciones, agentes, EXPERIMENT, Feedback,
Recorder, hashes, replay y suites anteriores sin cambios. TR-003 resuelve
movimiento localmente pero mantiene observación pendiente; TR-004 resuelve el
campo de daño en apply_action sin certificar integración. TR-001 sigue parcial;
TR-008 conserva exactamente su estado anterior e INIT-004 sigue abierto.
No se implementa F2-E/F3 ni se declara aceptación de T01–T280 o conformidad global.


## F2-E — dinámica autónoma y regeneración determinista

Implementados `World.advance_dynamics()` y `World.regenerate_resources()` en la
rama F2-E basada en main posterior al PR #8. Las secciones F2-B/C/D anteriores
conservan la evidencia y los límites de sus respectivos incrementos; esta sección
registra el avance actual sin reescribir informes históricos.

### Obligaciones y decisiones

VERIFIED por lectura selectiva: §§4–9, §15 e invariantes aplicables de §31,
WorldConfig, Cell, WorldState, validadores y fixtures F2-D. §15 exige delegación
advance_dynamics → regenerate_resources y ausencia de eventos. §5 reserva el
reloj a EXPERIMENT; §6 limita resource_regeneration a uint32, §8 establece orden
(y,x) y tipos de celdas. El dominio binario stock0/1 procede de los contratos
estructurales F1-B/F2-A y de la orden F2-E. No se recuperó una fuente histórica
adicional de la fórmula; no se le atribuye autoridad por su presencia en legacy.

| ID / clasificación | Indeterminación y obligaciones conocidas | Alternativas / decisión y justificación | Pruebas / riesgo |
|---|---|---|---|
| DYN-P01 — decisión de ingeniería | Fórmula de regeneración no reproducida íntegramente en §15; tasa uint32 y stock binario obligatorios | Conservar min(1,stock+resource_regeneration), equivalente a reponer stock0→1 para cualquier tasa positiva; tasa0 conserva todo, stock1 no cambia. Alternativa: ignorar la tasa positiva o añadir probabilidades; se elige la fórmula simple compatible, sin nuevo estado ni RNG. stock+tasa ≤2^32, exacto en Number | F2E-02–05/08/11. Conformidad histórica de la fórmula no verificada; no es contradicción demostrada ni alternativa declarada única |
| DYN-P02 — decisión interna compatible | Validación previa y prevención de cambios parciales detectables exigidas por la orden; tipos/errores existentes | WorldConfig._validate y assert_WorldState antes de retornar incluso con tasa0. Preparar lista en (y,x), verificar stock propio escribible de todos los candidatos y luego confirmar en ese orden. Frente a mutación durante recorrido, evita cambios anteriores si una celda tardía es inválida/no escribible. Sin transacción global | F2E-07/12–15. Atomicidad local para registros ordinarios; no promete rollback ante Proxy hostil ni fallos externos durante commit |
| DYN-P03 — decisión de interfaz compatible | §15 prohíbe eventos, no especifica un resultado adicional | Ambos métodos retornan undefined, sin crear un resultado, lista de eventos o metadatos. advance_dynamics llama regenerate_resources una vez, sin pasar por acciones/lifecycle/Recorder | F2E-01/10/16. No se afirma haber recuperado una firma histórica de retorno más detallada |

Evaluación de riesgos: la transición es determinista, no lee RNG y solo escribe
stock de recursos agotados existentes. Conserva referencias de grid/filas/celdas/
efectos y entidad; no crea recursos ni altera traversals o peligros. No realiza
operaciones energéticas: conserva incluso el signo de cero y la representación
exacta de energy. No cambia time, lifecycle o rng_state, no ejecuta acciones ni
lifecycle, no sincroniza RNG ni toca Recorder. La lista de confirmación usa
memoria proporcional a los recursos agotados; el mapa ya está limitado por
MAX_CELLS. La fórmula queda aislada y puede contrastarse con una fuente auténtica
futura sin tratar los tests locales como norma. No hay nueva fuente aleatoria.

Errores: configuración inválida → ContractError("invalid world_config"); estado
inválido → ContractError("invalid initial_state"); stock candidato no escribible
→ ContractError("world transition failed"). Todos pertenecen al catálogo §26.6.
La tasa0 y los recursos completos no requieren escritura, por lo que sus registros
pueden estar congelados. La validación estructural completa se mantiene aun si
no hay cambios. No se debilita ningún validador ni se reparan estados inválidos.

### Correspondencia de requisitos y pruebas

| Obligación / comportamiento | Pruebas locales ejecutadas |
|---|---|
| Delegación exacta y ausencia de eventos/resultado/metadatos | F2E-01/10/16 |
| Stock0/1; tasa0, positiva y uint32 máxima | F2E-02–04 |
| Sin recursos; BLOCKED, HAZARD y NONE sin alteración | F2E-05/06 |
| Orden canónico y conservación de estructura/referencias | F2E-06/07; Proxy transparente solo como instrumento de orden de escrituras |
| Determinismo e idempotencia | F2E-04/08/11/16 |
| No consumo de PRNG real, Math.random ni acceso a RNG/sync | F2E-08/10; Math.random lanza error en el harness |
| Reloj Number/BigInt uint64 y entidad ACTIVE/DEAD sin mutación | F2E-06/09; incluye límite uint64 y energía -0 exacta |
| Validación de estado después de cada transición válida | F2E-01–11/16 |
| Errores tardíos de celda/estado/config y stock no escribible sin mutación parcial | F2E-12–15; comparación completa antes/después |

### Ejecución F2-E

En /workspace/yellow, Node.js v24.22.1. Suites anteriores intactas; ninguna prueba
omitida. Los IDs F2E son locales, no T01–T280.

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 4 PASS/18 FAIL: invalid initial_state desde World.initialize | 1 |
| `git diff --check` | Sin errores | 0 |

Total: **122 pruebas locales aprobadas**, de ellas 16 nuevas F2-E. El diagnóstico
legacy conserva los mismos cuatro PASS (T01/T02/T03/T18) y 18 fallos previos;
no alcanza dinámica por el bloqueo de inicialización, por lo que no demuestra
integración de la nueva operación. No se reejecutó baseline ni se atribuye su
resultado histórico a una verificación nueva.

### Divergencias resueltas y dependencias pendientes

Resuelto en este alcance: faltaba advance_dynamics; regenerate_resources dependía
de EffectKind ausente y mutaba durante recorrido sin validación/preparación.
Ahora la operación es invocable independientemente, válida y reproducible bajo
DYN-P01. No se cambia la arquitectura ni las fórmulas/contratos de acciones,
lifecycle o inicialización. Archivos: js/world/world.js (solo dinámica),
tests/f2-e.test.cjs y este estado operacional.

TR-001 sigue parcial; autenticidad histórica de la fórmula continúa no verificada.
INIT-004 y TR-008 mantienen exactamente su estado: falta cerrar initialize_world.
TR-005 sigue abierta: EXPERIMENT debe integrar posteriormente la secuencia
acción → lifecycle → dinámica → reloj → sync → registro y su transacción global,
sin realizarse aquí. Observaciones, feedback, Recorder, hashes, WLS1/replay y
agentes permanecen fuera de alcance y sin cambios. Las políticas ACT-P01–06 no
se modifican. No se declara conformidad global ni interoperabilidad; no se inicia
F2-F ni F3, no se realiza merge ni despliegue.


## F2-F — observación determinista, BOUNDED y privacidad

Implementado build_observation(world, entity, radius) en la rama F2-F, desde main
posterior al PR #9. Solo cambian js/interface/observation.js,
tests/f2-f.test.cjs y este documento. Las secciones F2-C/D/E anteriores conservan
sus límites y resultados históricos; la actualización actual es esta sección y
las filas de componentes/TR-003 afectadas.

### Contratos explícitos implementados

VERIFIED por lectura selectiva: §§4–9, §16, §35.6 y los invariantes aplicables;
tipos/validadores WORLD existentes y fixtures F2-E. No se auditan otros subsistemas.
§16 define el esquema cerrado superior tick/self/local_view, Chebyshev,
OUT_OF_BOUNDS, occupied=false y pureza; §35.6 S-2 impide distinguir stock0/1.
No se recuperó un esquema histórico independiente más detallado de self o de las
celdas observadas. Las decisiones siguientes no se presentan como fuente histórica.

| Obligación | Implementación / evidencia local |
|---|---|
| Esquema superior cerrado y reloj actual | Exactamente tick/self/local_view; tick copia state.time sin conversión Number/BigInt ni incremento. F2F-01/10 |
| Chebyshev / orden canónico | Ventana cuadrada de lado 2r+1, dy de -r a r y después dx; diagonales incluidas. F2F-02/03/06 |
| BOUNDED / exterior inequívoco | x+dx/y+dy, sin módulo; representación OUT_OF_BOUNDS sin proyección de otra celda. F2F-04–07 |
| Distinciones autorizadas / privacidad | FREE, BLOCKED, RESOURCE y HAZARD; RESOURCE representa stocks0/1 del mismo modo, sin stock ni referencias a efectos. occupied=false siempre, incluso self/exterior. F2F-02/08/09 |
| Pureza y ausencia de RNG | Sin escritura de WORLD, entidad, mapa, stock, lifecycle, reloj o rng_state; sin RNG, Math.random, sync, acciones, dinámica, lifecycle o Recorder. F2F-10–14 |
| Precondiciones | WorldConfig y WorldState válidos; entidad estructural válida y perteneciente al mapa; radio uint32 explícito, sin coerción. F2F-15/16 |

La validación previa lee el mapa para verificar WorldState; la regla de no
consultar una celda por coordenadas externas se aplica a la **proyección**.
F2F-07 instrumenta un mapa1x1: además de las lecturas de validación, solo hay una
lectura de celda para toda la ventana, correspondiente al centro válido.

### Decisiones observables y riesgos

| ID | Indeterminación / alternativas | Decisión y justificación | Evidencia / riesgo |
|---|---|---|---|
| OBS-P01 | Subesquemas de self y local_view no reproducidos íntegramente. Añadir lifecycle, coordenadas de celda u otros campos, o elegir proyección mínima | self cerrado {id,position:{x,y},energy}; cada celda cerrada {representation,occupied}. Posición absoluta propia, ventana relativa ordenada; no lifecycle, stock, efectos, RNG o config. Strings FREE/BLOCKED/RESOURCE/HAZARD/OUT_OF_BOUNDS, sin UNKNOWN. Objetos y filas nuevos, sin referencias mutables del WORLD | F2F-01/02/08/09/12. Esquemas mínimos compatibles, no conformidad histórica de subregistros ni interoperabilidad demostrada |
| OBS-P02 | Firma/precondiciones históricas detalladas no recuperadas; aceptar entidades copiadas/sintéticas o exigir entidad actual | Se conserva parámetro requerido radius uint32; no se añade igualdad obligatoria con config.observation_radius ni valor por defecto implícito. El llamador proporciona el radio solicitado, normalmente el configurado. entity debe ser la referencia vigente de world.state.entities para su id; ACTIVE o DEAD válidos pueden observar. No se inspecciona agente/experimento. Copiar energy conserva incluso -0: no hay aritmética ni serialización en esta función | F2F-03/06/10/11/15/16. Restricción de identidad y subfirma son decisiones locales; consumidores futuros deben contrastarlas con fuente auténtica |
| OBS-P03 | Radio uint32 puede exigir una ventana impracticable; materializar sin límite arriesga fallo fatal del proceso, recortar alteraría geometría | Presupuesto local de construcción de 64 MiB, estimación conservadora 64 bytes por registro de celda y 8 por fila. Plan exacto BigInt: side=2r+1; bytes=side²×64+side×8. Si supera presupuesto, RangeError("observation window exceeds implementation capacity") antes de crear salida. No se trunca radio/ventana, no se modifica WorldConfig ni MAX_CELLS, no se declara inválido normativamente el radio | F2F-17/18. Es una limitación de implementación explícita, no medición de heap disponible ni límite normativo: esta versión construye hasta r511 y rechaza r512 o mayor por capacidad reservada. No garantiza ausencia de OOM con menos recursos reales |

El presupuesto OBS-P03 limita la construcción densa y evita intentar asignaciones
del orden de 2^66 celdas para el radio uint32 máximo. Se aplica igual en navegador
y Node, sin introducir dependencia de plataforma o una nueva fuente aleatoria.
WorldConfig con esos radios **continúa siendo válida**. El RangeError de capacidad
se distingue del ContractError de entrada y no amplía el catálogo de errores
normativos: es un fallo operacional de implementación, no InitializationFailure.
No se devuelven observaciones parciales, ventanas recortadas ni UNKNOWN para
ocultar la limitación. r511 se construyó realmente en la prueba, con 1023² celdas;
la fórmula de estimación no pretende medir consumo exacto de objetos JS.

Errores contractuales: WORLD/entidad inválidos → ContractError("invalid initial_state");
config inválida → ContractError("invalid world_config"); radio fuera de uint32
→ ContractError("world transition failed"). Son mensajes del catálogo existente;
no se afirma que el texto disponible determine esos mensajes para cada parámetro.
Toda validación/planificación precede a la devolución de un resultado.

### Pruebas ejecutadas F2-F

Node.js v24.22.1, /workspace/yellow; suites anteriores intactas, sin omitidas.
Los IDs F2F son pruebas locales, no T01–T280. Oráculos de geometría incluyen
matrices y máscaras fijadas independientemente; no se usa build_observation como
su propio oráculo. La prueba S-2 compara la observación completa antes/después de
cambiar solo stock. Se prueban referencias independientes, WORLD congelado,
RNG real y accesos prohibidos instrumentados, DEAD en BLOCKED válido, energías
negativas/subnormales/-0, y ticks hasta uint64 máximo BigInt.

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 4 PASS/18 FAIL por invalid initial_state desde World.initialize | 1 |
| `git diff --check` | Sin errores | 0 |

Total: **140 pruebas locales aprobadas**, 18 nuevas F2-F. El diagnóstico legacy
mantiene sus fallos de inicialización anteriores y no llega a verificar el nuevo
contrato de observación; no es evidencia de integración completa. No se cambiaron
pruebas anteriores para aceptar tick, nuevas representaciones o límites locales.

### Divergencias y continuidad

TR-003 queda resuelta en el alcance espacial local: MOVE BOUNDED ya verificado
en F2-D y observación BOUNDED/OUT_OF_BOUNDS ahora verificada. También se corrigen
la salida time legacy (ahora tick), distinción indebida de stock y dependencia
EffectKind. No se evalúa ni modifica compatibilidad de agentes, Feedback,
EXPERIMENT, RECORDER o renderer. La orquestación futura debe invocar observación
antes de transición para conservar observation.tick=T; esta función no ejecuta
el tick ni incrementa el reloj.

INIT-004 y TR-008 conservan exactamente su estado previo, sin nueva evidencia
para cerrarlos. TR-001 sigue parcial; subesquemas históricos y OBS-P03 son riesgos
explícitos de conformidad/capacidad. Acciones, dinámica, lifecycle, inicialización,
contratos/tipos congelados, especificación y suites previas no cambian.
Sin conformidad global ni interoperabilidad demostrada; no se realiza merge,
despliegue ni se inicia F2-G/F3.
