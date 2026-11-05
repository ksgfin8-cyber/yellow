# Estado de implementación de WORLD-LAB

Documento **informativo y operacional**, no normativo. Corte operativo F2-A:
2026-11-05, base `main` = `4cbb42c0aadc119e0c64c2526b7e80d6d2be3822`.
Cambios F2-A en `dev/f2-a-world-state`; evidencia DOC-01 conservada donde sigue
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
las ejecuciones F2-A siguientes son evidencia nueva, no certificación retroactiva.

## Estado por componente (actualizado F2-A)

| Incremento / componente | Estado y alcance de evidencia (DOC-01, actualizado F2-A) |
|---|---|
| F1-A: PRNG, UTF-8, FNV, semillas | Implementado; VERIFIED por ejecución de 18 casos locales. `next_int` admite extremos Number seguros y cardinalidad ≤2^32; esa decisión interna está documentada, sin ampliar §10.3. No es la suite canónica completa. |
| F1-B: contratos | Parcialmente implementado; VERIFIED por ejecución de B01–B12: WorldConfig, binary64, predicados Cell/Entity/WorldState y Action. No incorpora por sí solo esos contratos al motor. |
| FeedbackConfig / ExperimentConfig | Pendientes de cierre documental/integración. VERIFIED por lectura: clases legacy y un inspector parcial `complete:false`; TR-006/007. |
| WORLD | F2-A implementa tipos validados, copias profundas, WorldState.full_snapshot y delegación World.full_snapshot (§7–§9); VERIFIED por F2A-01–14. Generación, posición, acciones y regeneración siguen legacy; faltan InitialWorldResult y lifecycle operacional. TR-001/003/004/008 persisten. F2 completo no implementado. |
| EXPERIMENT | Ciclo legacy presente; pendientes secuencia canónica, transacción con rollback, determine_termination y ExperimentResult (§5, §20, §26.5, §32). TR-005. |
| Observaciones / agentes | Código legacy presente. VERIFIED por lectura: observación devuelve `time`, envuelve bordes y distingue stock; §16 exige `tick`/OUT_OF_BOUNDS y §35.6 S-2 no distinguir stocks. Agentes wait/random/rule existen; integración canónica no verificada. |
| Recorder / hashes | Código legacy presente. VERIFIED por lectura de `recorder.js`/`hash_state.js`: sin source/sequence ni listas action_events/lifecycle_events del StepRecord; record_step asigna rng_state del argumento WORLD. Hashes sobre texto, no WLS1. Migración pendiente (§4, §18, §21–§24, §34). |
| Replay / WLS1 / Metrics | Pendientes: no se encontraron implementaciones en el árbol JS inspeccionado. T20 legacy vuelve a ejecutar Experiment; no implementa replay. Ausencia no clasificada como defecto de F1-A/B. |
| Renderer / entrada web | Legacy presente, sin validación integrada. VERIFIED por lectura: render recibe World y `main.js` reconstruye su estado. TR-008 impide interpretar las pruebas actuales como validación de la aplicación. |
| Integración y conformidad global | No verificadas. UNKNOWN respecto al cumplimiento global; no existe evidencia ejecutada de T01–T280 ni interoperabilidad. §37 no se satisface con las pruebas locales. |

## Evidencia ejecutada en F2-A

En `/workspace/yellow`, Node.js v24.22.1, sin editar pruebas existentes:

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-a-legacy.cjs --baseline` | 22 casos: 4 PASS, 18 FAIL | 1 |
| `node tests/f1-a-legacy.cjs` | 22 casos: 4 PASS, 18 FAIL | 1 |

VERIFIED (ejecución F2-A): ambas corridas legacy pasan T01/T02/T03/T18.
Baseline: 18 fallan con `Cell is not defined`. Actual: 16 fallan con
`makeResource is not defined` y T20/T22 con `makeHazard is not defined`.
El baseline necesitó permiso del subproceso Git. Las aserciones legacy y los
runners F1-A/F1-B no se modificaron; hay nuevas pruebas focalizadas F2-A.
VERIFIED (diagnóstico Node/VM): cargar los scripts HTML completos y ejecutar el
callback real de DOMContentLoaded (window simulado) falla en main.js →
Experiment.run → World.initialize → _generate_grid: `makeResource is not defined`.
No es una validación de navegador/render ni de simulación integrada.
INFERRED: igualdad de resultados en las rutas alcanzadas no demuestra ausencia de
regresiones en movimiento, energía, ticks o render. UNKNOWN: comportamiento
integrado de esas rutas. No se realizó una auditoría general de conformidad.

## Divergencias y dependencias vigentes

Los estados VERIFIED de esta tabla certifican la observación citada, no conformidad.
Los diez IDs se conservan. F2-A resuelve TR-002 en su alcance estructural;
TR-008 queda parcialmente resuelta (carga corregida, dependencias operacionales
pendientes); TR-010 tiene copia exacta verificada pero integración temporal/WLS1
pendiente. TR-001/003–007/009 siguen abiertos. No se equipara funcionalidad futura
con defecto nuevo ni se consideran estas dependencias bloqueantes globales.

| ID | Componente | Evidencia | Impacto | Resolución prevista | Estado |
|---|---|---|---|---|---|
| TR-001 | Corpus normativo | §11.2, §18, §21, §25, §26.5, §31 y §34 remiten a v0.2.4 sin reproducir definiciones; historial `909a43f:docs/specifications`, `baa785e:docs/specifications`, `764910f:docs` solo contiene LF | No permite cerrar generación/RNG, eventos, atomicidad, replay/WLS1 ni I-01–I-66 heredados | Recuperar fuentes auténticas y vincular cada operación; detalle abajo | VERIFIED por lectura/Git; dependencia documental abierta; no prueba inexistencia fuera del repositorio |
| TR-002 | EntityState y copia | F2-A `entity.js` y F2A-04–06/10/11: lifecycle explícito, validación y posición independiente; §9 | Tipo/copia ahora satisfacen F1-B; el creador legacy aún usa la firma antigua | Resuelta estructura/copia por commit F2-A en historial de `dev/f2-a-world-state` (`git log -1 -- js/world/entity.js`) y pruebas citadas; migración de inicialización sigue fuera de alcance | VERIFIED ejecución F2-A; resuelta en tipos, no certifica motor |
| TR-003 | Movimiento / observación | `World.apply_action` calcula target con módulo; `build_observation` también; WorldConfig exige BOUNDED (§6), §13/§16 definen bordes | Semántica legacy de bordes incompatible; T16 legacy exige wrap | Migrar bordes y comprobar OUT_OF_BOUNDS/orden de validación; no adaptar la norma a T16 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-004 | Configuración / daño | WorldConfig tiene hazard_damage; `world.js:apply_action` y T14 legacy leen hazard_effect; §6.1 | Productor y consumidor no coinciden; INFERRED: restar undefined podría producir NaN al alcanzar el peligro | Migrar consumo y probar energía finita y efectos; sin alias normativo inventado | VERIFIED (nombres); incompatibilidad de migración abierta; efecto integrado no ejecutado |
| TR-005 | EXPERIMENT / reloj | `experiment.js:run` incrementa time y regenera antes de observación/acción; `run_without_agent` no aplica WAIT y registra null; §5/§20/§32 | Orden/nulabilidad contrarios a norma; sin rollback transaccional | Migración en alcance F3 y pruebas de orden, terminación y fallos; dependencias TR-001 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-006 | FeedbackConfig / Feedback | §17 dice cuatro flags exactos sin nombres; `feedback.js` tiene tres con coerción `!!` y esquema de salida diferente | Clase legacy no es contrato canónico; no puede inventarse cuarto flag | Obtener nombres/dominos de fuente normativa y migrar configuración/proyección | VERIFIED por lectura; incompatibilidad heredada y dependencia documental abiertas |
| TR-007 | ExperimentConfig | `inspect_ExperimentConfig_defined_fields` siempre complete:false; constructor legacy exige max_ticks>0 y registro de agente; §19.1 contempla cero | Inspección sin issues no acredita aceptación; cero rechazado por constructor legacy | Recuperar contrato completo y unificar aceptación sin añadir restricciones inferidas | VERIFIED por lectura y B12; implementación parcial e incompatibilidad legacy abiertas |
| TR-008 | Carga HTML / dependencias legacy | F2-A index.html carga structures.js/cells.js; no referencia cell.js/effect.js inexistentes. F2A-14 carga tipos con el orden HTML y comprueba todos los paths; diagnóstico sigue fallando en makeResource/makeHazard | Se elimina el bloqueo Cell ausente; no existe ejecución de efectos/generación conforme | Commit F2-A en historial de rama y F2A-14 resuelven referencias. Recuperar contratos y migrar inicialización/efectos, incluidas firmas lifecycle/config aún no usadas por world.initialize | VERIFIED ejecución F2-A; parcialmente resuelta |
| TR-009 | Suite legacy | Ejecuciones arriba; `js/tests/tests.js`: T15/T19 contienen `|| true`; T18 captura su propia aserción; T20 compara dos runs; T21 no llama Renderer | PASS no siempre acredita intención; mismo conteo 4 PASS/18 FAIL con causas distintas no verifica integración ni replay | Diseñar pruebas pertinentes a contratos recuperados y a rutas antes bloqueadas; distinguir IDs locales/canónicos | VERIFIED lectura DOC-01/ejecución F2-A; límite de evidencia y defectos legacy abiertos |
| TR-010 | uint64 e integración | `is_uint64` admite BigInt uint64 o Number seguro; B08 y F2A-11; `experiment.js` usa `time += 1`; `hash_state.js` serializa texto; §6.3/§7/§34 | INFERRED: BigInt requiere integrar aritmética y serialización; aceptar estructura no garantiza interoperabilidad | Mantener exactitud al integrar reloj/WLS1 y probar extremos; no convertir a Number con pérdida | VERIFIED representación/B08 y F2A-11; copias exactas verificadas en F2-A; integración reloj/WLS1 abierta |

No se identificó una desviación normativa nueva no autorizada mediante esta
revisión focalizada; ello no certifica su ausencia fuera de lo examinado.

## Dependencias localizadas para continuar

| Contrato / operación afectada | Qué falta o requiere resolución | Trabajo independiente posible | Evidencia para cerrar |
|---|---|---|---|
| §11.2: generación del mapa | Algoritmo v0.2.4 y consumo/orden de RNG exactos | Estructuras, copias y validación ya definida de §6–§9 | Texto normativo íntegro anterior y vectores/casos de generación pertinentes |
| §13–§15/§18: acciones, lifecycle, eventos | Esquemas completos ActionResult/WorldEvent, detalles heredados de efectos; §11.1 devuelve eventos crudos pero §11.7 pide tick/source/sequence | Revisar estructuras/BOUNDED y criterios explícitos sin completar payloads por inferencia | Cláusulas anteriores y aclaración autorizada de la representación inicial (§4/§11.7/§18) |
| §11.1/§11.7/§26: errores de inicialización | Tensión entre envolver cualquier fallo en InitializationError y lanzar ContractError por eventos inválidos | Validación independiente de WorldConfig y datos | Fuente anterior y decisión normativa inequívoca sobre precedencia; no deducirla del código |
| §17/§19: feedback y aceptación del experimento | Nombres de cuatro flags, dominios/validación heredados | WORLD sin agente/feedback dentro de contratos disponibles | Esquemas normativos completos; pruebas de configuración pertinentes |
| §21/§25/§26.5/§34: registro, replay, atomicidad y bytes | Algoritmos heredados; WLS1 V1 de 59 bytes no reproducido; V2–V10 declarados pendientes | No bloquea todo trabajo estructural F2; sí cierre de equivalencia afectada | Corpus anterior, vectores y pruebas respectivas antes de F3/F4 dependiente |
| §31/§36/§37: aceptación completa | I-01–I-66 y definiciones individuales de tests no reproducidos; T61–T80 no están asignados en tabla §36 | Pruebas locales trazables sin llamarlas suite canónica | Invariantes/casos originales y resolución del inventario incompleto |

VERIFIED: esas referencias/omisiones están en la transcripción examinada.
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
estos dos documentos, código, pruebas y dependencias. F2-A no autoriza F2-B.

## Integración estructural F2-A — contrato y uso

VERIFIED (código/pruebas): archivos afectados: `js/world/cells.js`, `entity.js`,
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

Dependencias relevantes para F2-B: TR-001 (algoritmo de mapa/orden RNG, efectos,
eventos y errores iniciales), TR-003/004 (bordes y nombres de daño) y la migración
explícita de las firmas de creación cuando sea autorizada. TR-006/007 y la
integración uint64 operacional siguen pendientes. Las estructuras y sus copias
ya pueden verificarse sin resolver generación o ciclo experimental. Ni las 14
pruebas locales ni los predicados acreditan T01–T280, replay o conformidad global.
