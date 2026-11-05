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
| WORLD | F2-A implementa tipos validados, copias profundas, WorldState.full_snapshot y delegación World.full_snapshot (§7–§9); VERIFIED por F2A-01–14. F2-B verifica generación y selección inicial (§11.2 recuperado/§11.3) con F2B-01–13. F2-C añade preparación ejecutable anterior a lifecycle (12 pruebas), sin initialize_world/InitialWorldResult ni eventos. Lifecycle inicial y sincronización final bloqueados por cuestiones INIT-004/005. Acciones, dinámica e initialize siguen legacy. TR-001/003/004/008 persisten. F2 completo no implementado. |
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
| `node tests/f2-c.test.cjs` | 12 PASS, 0 FAIL, 0 omitidas; solo preparación previa a lifecycle | 0 |
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
F2-C es parcial: las nuevas cuestiones INIT-004/005 bloquean únicamente la
resolución inicial y la API canónica completa, no la preparación independiente. No se equipara funcionalidad futura
con defecto nuevo ni se consideran estas dependencias bloqueantes globales.

| ID | Componente | Evidencia | Impacto | Resolución prevista | Estado |
|---|---|---|---|---|---|
| TR-001 | Corpus normativo | Investigación F2-C: no se recuperó §18 ni condición matemática de muerte; v0.2.5 §11.1 entrega WorldEvent crudos, §11.7 exige tick/source/sequence; INIT-004/005. §11.2 sigue recuperado solo por orden F2-B | Impide cerrar lifecycle/eventos/initialize_world; no bloquea construcción previa ya ejecutable | Recuperar cláusulas auténticas §14/§18 y resolver la representación inicial; resto de invariantes/registro/replay/WLS1 sigue pendiente | VERIFIED lectura/Git F2-C; parcialmente resuelta, nunca cerrada globalmente |
| TR-002 | EntityState y creación | F2-A resolvió tipo/copia; F2-C prepare_world_before_lifecycle usa lifecycle/config explícitos y F2C-03/04/08 los verifican | Nueva preparación válida; World.initialize y consumidores EXPERIMENT aún usan la firma antigua | Evidencia: commits F2-A/F2-C en historial y pruebas citadas. Integrar únicamente cuando se cierre el contrato canónico de eventos/lifecycle | VERIFIED ejecución; estructura y preparación resueltas, incompatibilidad legacy no resuelta globalmente |
| TR-003 | Movimiento / observación | `World.apply_action` calcula target con módulo; `build_observation` también; WorldConfig exige BOUNDED (§6), §13/§16 definen bordes | Semántica legacy de bordes incompatible; T16 legacy exige wrap | Migrar bordes y comprobar OUT_OF_BOUNDS/orden de validación; no adaptar la norma a T16 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-004 | Configuración / daño | WorldConfig tiene hazard_damage; `world.js:apply_action` y T14 legacy leen hazard_effect; §6.1 | Productor y consumidor no coinciden; INFERRED: restar undefined podría producir NaN al alcanzar el peligro | Migrar consumo y probar energía finita y efectos; sin alias normativo inventado | VERIFIED (nombres); incompatibilidad de migración abierta; efecto integrado no ejecutado |
| TR-005 | EXPERIMENT / reloj | `experiment.js:run` incrementa time y regenera antes de observación/acción; `run_without_agent` no aplica WAIT y registra null; §5/§20/§32 | Orden/nulabilidad contrarios a norma; sin rollback transaccional | Migración en alcance F3 y pruebas de orden, terminación y fallos; dependencias TR-001 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-006 | FeedbackConfig / Feedback | §17 dice cuatro flags exactos sin nombres; `feedback.js` tiene tres con coerción `!!` y esquema de salida diferente | Clase legacy no es contrato canónico; no puede inventarse cuarto flag | Obtener nombres/dominos de fuente normativa y migrar configuración/proyección | VERIFIED por lectura; incompatibilidad heredada y dependencia documental abiertas |
| TR-007 | ExperimentConfig | `inspect_ExperimentConfig_defined_fields` siempre complete:false; constructor legacy exige max_ticks>0 y registro de agente; §19.1 contempla cero | Inspección sin issues no acredita aceptación; cero rechazado por constructor legacy | Recuperar contrato completo y unificar aceptación sin añadir restricciones inferidas | VERIFIED por lectura y B12; implementación parcial e incompatibilidad legacy abiertas |
| TR-008 | Carga / integración inicial | F2-A corrigió carga; F2-B corrigió factories en generación; F2-C prepara estado válido de forma independiente. El runner actual aún falla en EntityState desde World.initialize | El nuevo helper no es alias ni reparación silenciosa de initialize_world/World.initialize | Usar preparación solo para el alcance previo a lifecycle; resolver INIT-004/005 antes de migrar consumidores | VERIFIED ejecución F2-C; carga/generación/preparación cubiertas, inicialización completa pendiente |
| TR-009 | Suite legacy | Ejecuciones arriba; `js/tests/tests.js`: T15/T19 contienen `|| true`; T18 captura su propia aserción; T20 compara dos runs; T21 no llama Renderer | PASS no siempre acredita intención; mismo conteo 4 PASS/18 FAIL con causas distintas no verifica integración ni replay | Diseñar pruebas pertinentes a contratos recuperados y a rutas antes bloqueadas; distinguir IDs locales/canónicos | VERIFIED lectura DOC-01/ejecución F2-C; límite de evidencia y defectos legacy abiertos |
| TR-010 | uint64 e integración | `is_uint64` admite BigInt uint64 o Number seguro; B08 y F2A-11; `experiment.js` usa `time += 1`; `hash_state.js` serializa texto; §6.3/§7/§34 | INFERRED: BigInt requiere integrar aritmética y serialización; aceptar estructura no garantiza interoperabilidad | Mantener exactitud al integrar reloj/WLS1 y probar extremos; no convertir a Number con pérdida | VERIFIED representación/B08 y F2A-11; copias exactas verificadas en F2-A; integración reloj/WLS1 abierta |

No se identificó una desviación normativa nueva no autorizada mediante esta
revisión focalizada; ello no certifica su ausencia fuera de lo examinado.

## Dependencias localizadas para continuar

| Contrato / operación afectada | Qué falta o requiere resolución | Trabajo independiente posible | Evidencia para cerrar |
|---|---|---|---|
| §11.2: generación del mapa | Algoritmo recuperado desde el texto histórico v0.2.4 proporcionado en la orden F2-B; falta fuente independiente en repo | Generación y selección ya verificadas; pueden usarse sin inicialización completa | Conservar procedencia y recuperar documento original para trazabilidad duradera; no reconstruir otras cláusulas |
| §13–§15/§18: acciones, lifecycle, eventos | Esquemas completos ActionResult/WorldEvent, detalles heredados de efectos; §11.1 devuelve eventos crudos pero §11.7 pide tick/source/sequence | Preparación anterior a lifecycle, verificada en F2-C; no decidir umbral ni payloads por inferencia | Cláusulas anteriores y aclaración autorizada de la representación inicial (§4/§11.7/§18) |
| §11.1/§11.7/§26: errores de inicialización | Tensión entre envolver cualquier fallo en InitializationError y lanzar ContractError por eventos inválidos | Validación independiente de WorldConfig y datos | Fuente anterior y decisión normativa inequívoca sobre precedencia; no deducirla del código |
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

F2-C integra entidad/estado en un helper explícitamente previo a lifecycle.
Para completar initialize_world faltan la resolución inicial única, condición
matemática de muerte, consistencia y representación de eventos,
snapshot/validación y sincronización final de RNG según §11.1. Permanecen las
tensiones §11.1/§11.7/§26 y los esquemas de eventos heredados; TR-001 no está
resuelta globalmente. Bordes/daño operativo, feedback, ejecución y replay no se
implementan aquí. Pruebas locales distintas de T01–T280; sin conformidad global.

## Registro de resoluciones de ingeniería y cuestiones normativas

**F2-C parcialmente implementado.** No existe una API initialize_world completa ni
se devuelve InitialWorldResult. El helper `prepare_world_before_lifecycle(config,
seed)` devuelve un World de trabajo **antes del paso 8 de §11.1**, con entidad
ACTIVE incluso si su energía pudiera implicar muerte posteriormente. No debe
consumirse como mundo inicial resuelto para ejecutar experimentos.

| ID | Clasificación | Referencia | Evidencia | Resolución / estado | Impacto |
|---|---|---|---|---|---|
| INIT-001 | Contrato normativo explícito | §6, §7, §10, §11.1 pasos 1–7 y §11.3/4 | F2C-01–07/12: configuración/semilla validadas, PRNG original, mapa/posición F2-B, entidad única 0987898, energía exacta, ACTIVE, time=0 | Implementada preparación estructural sin consumo RNG adicional | Constructor F2-A recibe config/lifecycle; estado RNG inicial refleja extracciones reales |
| INIT-002 | Contrato normativo incorporado por referencia | §11.2 y orden F2-B | Código/pruebas F2-B reutilizados; no se encontró documento histórico independiente | No se recuperó ningún contrato histórico nuevo en F2-C | Algoritmo de mapa disponible; procedencia completa y resto de TR-001 pendientes |
| INIT-003 | Decisión de implementación compatible | initialize_resources en §11.1; stock=1 establecido por generación F2-B y orden F2-C §6.3 | F2C-07/11/12 comprueban orden y conservación de celdas/stock/RNG | verify_generated_initial_resources es validación sin mutación sobre el dominio ya generado; rechaza stock agotado sin repararlo | No define initialize_resources general para mapas externos ni crea segunda distribución; su semántica histórica completa sigue UNKNOWN |
| INIT-004 | Laguna contractual y tensión aparente, no contradicción genuina demostrada | §4/§11.1/§11.7/§14/§18 | WorldEvent inicial se dice crudo; la misma secuencia se valida antes de Recorder, exigiendo tick/source/sequence; definición de §18 no disponible | No se elige representación, no se enriquece en WORLD, no se debilita validación; resolver fuente/etapa/tipo con autoridad antes de implementar | Bloquea resolve_lifecycle con eventos, validate_initial_events_consistency e InitialWorldResult, no la preparación anterior |
| INIT-005 | Laguna contractual | §6 death_threshold, §9, §14 y orden F2-C §6.4 | No se encontró condición matemática explícita de muerte; legacy usa <=, sin autoridad normativa. < y <= difieren al ser energy==death_threshold | Se solicitó contrato recuperado/aclaración; no se atribuye <= a la norma ni se implementa decisión arbitraria | Permanencia ACTIVE después de resolver, muerte inicial, no resurrección y llamada única a resolve_lifecycle NO implementadas/verificadas |
| INIT-006 | Contrato explícito y delimitación autorizada de errores | §6, §10, §11.3, §26; orden F2-C §6.6 | F2C-09/10: no candidatos produce InitializationError con reason/mensaje invalid initial_position y seed original; errores contractuales/programación conservan identidad | Solo se añade seed al fallo de posición de F2-B en la composición; no se envuelven otros errores | No crea categorías nuevas ni convierte RNG actual en semilla; la frase global FALLOS de §11.1 requiere interpretación al cerrar la API, no se declara resuelta unilateralmente |
| INIT-007 | Decisión de implementación | Frontera y orden §11.1; helpers permitidos por orden F2-C §6.2 | F2C-07/08: helper separado, config congelada, WorldState validado, snapshot profundo sin consumo RNG | Se conserva rng_state correcto al construir WorldState, sin llamar todavía sync_rng_state del paso 9, que debe seguir a lifecycle | No se falsea orden canónico; snapshot previo disponible para diagnóstico, no salida final de initialize_world |
| INIT-008 | Incompatibilidad de migración | World.initialize, EXPERIMENT | Código legacy intacto; runner F2-C 4 PASS/18 FAIL con invalid initial_state | Sin alias de compatibilidad; se mantiene pendiente la migración de consumidores | TR-002/TR-008 no resueltas de extremo a extremo; no se modifica EXPERIMENT |

### Investigación localizada y alternativas no elegidas

VERIFIED por lectura/Git: main c740f23, historial no superficial, listado de rutas
históricas y referencias remotas disponibles inspeccionados. Los únicos candidatos
anteriores docs/specifications (909a43f/baa785e) y docs (764910f) contienen LF,
no cláusulas §14/§18. Las ramas remotas consultadas contienen incrementos ya
conocidos, no una versión normativa histórica adicional. UNKNOWN: contenido
omitido y si existe fuera del repositorio. No se usa el legacy como sustituto.

Para INIT-004 se consideró validar otro tipo/etapa o una proyección enriquecida.
Ninguna está demostrada por el texto disponible: §11.1 pasa sus eventos crudos
al validador antes de Recorder; el esquema de WorldEvent no está transcrito.
Por tanto no se introducen campos tick/source/sequence, payloads adivinados,
proyecciones, hooks ni un array vacío de eventos para esconder el caso DEAD.
Tampoco se declara probada una contradicción insalvable: §18 auténtico podría
aclarar la distinción. Requiere fuente histórica o decisión normativa posterior.

Para INIT-005, «satisface el umbral» no especifica por sí solo la comparación.
Elegir < frente a <= cambia un resultado observable, no es una elección interna.
La orden F2-C permite derivar consecuencias necesarias, no esa elección arbitraria.
La pregunta de recuperación abarca la condición exacta y el contrato de WorldEvent.

### Evidencia y límites del incremento

Archivos F2-C: `js/world/world.js` (solo helpers de preparación/verificación),
`tests/f2-c.test.cjs` y este documento. En la rama F2-C están disponibles directamente
tras cargar world.js; no cambian HTML, tipos/validadores, algoritmos F1/F2-B,
acciones, dinámica, observaciones, feedback, recorder, hashes, replay o agentes.
El helper de recursos no modifica referencias ni valores del grid generado.
El snapshot copia sin alterar energía (incluido -0), time=0 o RNG; se mantiene
separado de la sincronización final pendiente. F2C-04 verifica ACTIVE **antes** de
resolución y no constituye prueba de supervivencia ni de muerte.

VERIFIED por ejecución: las 12 pruebas locales cubren solo lo implementado y las
regresiones pertinentes pasan. **No implementados ni ejecutados**: lifecycle
inicial, muerte/permanencia después de resolver, su invocación exactamente una
vez, no resurrección/evento único, sincronización final después de lifecycle,
consistencia de eventos y devolución final InitialWorldResult. No hay una prueba
omitida que se cuente como aprobada ni se sustituye T01–T280 por estos casos.
No se declara conformidad global ni interoperabilidad.

Para continuar: aportar §14/§18 auténticos (condición de muerte, esquema de evento
y relación crudo/enriquecido), resolver INIT-004/005 y la precedencia global de
FALLOS, integrar los pasos 8–12 y recién entonces migrar World.initialize y sus
consumidores. No se inicia F2-D/F3 ni se modifica v0.2.5 para cerrar estas cuestiones.
