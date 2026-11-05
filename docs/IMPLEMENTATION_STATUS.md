# Estado de implementación de WORLD-LAB

Documento **informativo y operacional**, no normativo. Corte DOC-01: 2026-11-05,
`main` = `c98243bf0be1b5a26503d78771179e907bfdf480`. Las referencias a código
son a ese corte; actualizar solo lo afectado por cada incremento.

## Autoridad, procedencia y lectura inicial

La autoridad es [WORLD-LAB v0.2.5 Canonical](WORLD-LAB_v0.2.5_canonical_transcripcion.md),
con la precedencia de §0.1: el código y estos documentos no sustituyen contratos,
invariantes ni pseudocódigo. Los vectores son referencias y T01–T280 criterios
de aceptación. FROZEN no significa ejecución ni conformidad demostrada (§0.3–§0.5).

Categorías de afirmaciones documentales, distintas de los estados normativos:
**VERIFIED** = contrato, código, commit o prueba examinados directamente en DOC-01;
**REPORTED** = declaración histórica no verificada independientemente aquí;
**INFERRED** = conclusión derivada de evidencia identificada;
**UNKNOWN** = evidencia insuficiente. VERIFIED por lectura se indica como tal;
no equivale a una prueba de comportamiento o conformidad.

Fuentes examinadas íntegramente: especificación y los informes
[F1-A](F1-A-deterministic-core.md) y [F1-B](F1-B-contracts.md), únicos documentos
técnicos previos presentes en `docs/`. También se leyeron todos los módulos JS,
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
las ejecuciones DOC-01 siguientes son evidencia nueva, no certificación retroactiva.

## Estado por componente

| Incremento / componente | Estado y alcance de evidencia DOC-01 |
|---|---|
| F1-A: PRNG, UTF-8, FNV, semillas | Implementado; VERIFIED por ejecución de 18 casos locales. `next_int` admite extremos Number seguros y cardinalidad ≤2^32; esa decisión interna está documentada, sin ampliar §10.3. No es la suite canónica completa. |
| F1-B: contratos | Parcialmente implementado; VERIFIED por ejecución de B01–B12: WorldConfig, binary64, predicados Cell/Entity/WorldState y Action. No incorpora por sí solo esos contratos al motor. |
| FeedbackConfig / ExperimentConfig | Pendientes de cierre documental/integración. VERIFIED por lectura: clases legacy y un inspector parcial `complete:false`; TR-006/007. |
| WORLD | Implementación legacy presente (generación, selección de posición, acciones y regeneración), pendiente de migración conforme a §7–§15. Sin InitialWorldResult, resolución explícita de lifecycle ni `full_snapshot`; TR-001–004/008. No se afirma que F2 esté implementado. |
| EXPERIMENT | Ciclo legacy presente; pendientes secuencia canónica, transacción con rollback, determine_termination y ExperimentResult (§5, §20, §26.5, §32). TR-005. |
| Observaciones / agentes | Código legacy presente. VERIFIED por lectura: observación devuelve `time`, envuelve bordes y distingue stock; §16 exige `tick`/OUT_OF_BOUNDS y §35.6 S-2 no distinguir stocks. Agentes wait/random/rule existen; integración canónica no verificada. |
| Recorder / hashes | Código legacy presente. VERIFIED por lectura de `recorder.js`/`hash_state.js`: sin source/sequence ni listas action_events/lifecycle_events del StepRecord; record_step asigna rng_state del argumento WORLD. Hashes sobre texto, no WLS1. Migración pendiente (§4, §18, §21–§24, §34). |
| Replay / WLS1 / Metrics | Pendientes: no se encontraron implementaciones en el árbol JS inspeccionado. T20 legacy vuelve a ejecutar Experiment; no implementa replay. Ausencia no clasificada como defecto de F1-A/B. |
| Renderer / entrada web | Legacy presente, sin validación integrada. VERIFIED por lectura: render recibe World y `main.js` reconstruye su estado. TR-008 impide interpretar las pruebas actuales como validación de la aplicación. |
| Integración y conformidad global | No verificadas. UNKNOWN respecto al cumplimiento global; no existe evidencia ejecutada de T01–T280 ni interoperabilidad. §37 no se satisface con las pruebas locales. |

## Evidencia ejecutada en DOC-01

En `/workspace/yellow`, Node.js v24.22.1, sin editar pruebas:

| Comando | Resultado observado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL, 0 omitidas | 0 |
| `node tests/f1-a-legacy.cjs --baseline` | 22 casos: 4 PASS, 18 FAIL | 1 |
| `node tests/f1-a-legacy.cjs` | 22 casos: 4 PASS, 18 FAIL | 1 |

VERIFIED (ejecución): ambas corridas legacy pasan T01/T02/T03/T18; las otras 18
fallan con `Cell is not defined`. El baseline necesitó permiso de ejecución del
subproceso Git en el sandbox. Sin pruebas nuevas ni cambios para ocultar fallos.
INFERRED: igualdad de resultados en las rutas alcanzadas no demuestra ausencia de
regresiones en movimiento, energía, ticks o render. UNKNOWN: comportamiento
integrado de esas rutas. No se realizó una auditoría general de conformidad.

## Divergencias y dependencias vigentes

Los estados VERIFIED de esta tabla certifican la observación citada, no conformidad.
Los diez candidatos se conservan: **7 incompatibilidades actuales** (TR-002–008),
**1 dependencia documental** (TR-001), **1 límite de evidencia con defectos de tests
legacy** (TR-009) y **1 riesgo de integración** (TR-010). Cero descartados;
cero pendientes de comprobar su existencia dentro del corte. Sus resoluciones y
la validación funcional que falta permanecen pendientes. No son diez defectos
nuevos de F1-B ni diez bloqueantes globales.

| ID | Componente | Evidencia | Impacto | Resolución prevista | Estado |
|---|---|---|---|---|---|
| TR-001 | Corpus normativo | §11.2, §18, §21, §25, §26.5, §31 y §34 remiten a v0.2.4 sin reproducir definiciones; historial `909a43f:docs/specifications`, `baa785e:docs/specifications`, `764910f:docs` solo contiene LF | No permite cerrar generación/RNG, eventos, atomicidad, replay/WLS1 ni I-01–I-66 heredados | Recuperar fuentes auténticas y vincular cada operación; detalle abajo | VERIFIED por lectura/Git; dependencia documental abierta; no prueba inexistencia fuera del repositorio |
| TR-002 | EntityState y copia | `js/world/entity.js`: constructor/copy sin lifecycle; `validate_EntityState` exige ACTIVE/DEAD; §9 | Los objetos legacy no satisfacen el predicado nuevo; copia pierde lifecycle añadido manualmente | Migrar tipos/copias con pruebas de aislamiento y lifecycle en alcance autorizado F2 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-003 | Movimiento / observación | `World.apply_action` calcula target con módulo; `build_observation` también; WorldConfig exige BOUNDED (§6), §13/§16 definen bordes | Semántica legacy de bordes incompatible; T16 legacy exige wrap | Migrar bordes y comprobar OUT_OF_BOUNDS/orden de validación; no adaptar la norma a T16 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-004 | Configuración / daño | WorldConfig tiene hazard_damage; `world.js:apply_action` y T14 legacy leen hazard_effect; §6.1 | Productor y consumidor no coinciden; INFERRED: restar undefined podría producir NaN al alcanzar el peligro | Migrar consumo y probar energía finita y efectos; sin alias normativo inventado | VERIFIED (nombres); incompatibilidad de migración abierta; efecto integrado no ejecutado |
| TR-005 | EXPERIMENT / reloj | `experiment.js:run` incrementa time y regenera antes de observación/acción; `run_without_agent` no aplica WAIT y registra null; §5/§20/§32 | Orden/nulabilidad contrarios a norma; sin rollback transaccional | Migración en alcance F3 y pruebas de orden, terminación y fallos; dependencias TR-001 | VERIFIED por lectura; incompatibilidad heredada abierta |
| TR-006 | FeedbackConfig / Feedback | §17 dice cuatro flags exactos sin nombres; `feedback.js` tiene tres con coerción `!!` y esquema de salida diferente | Clase legacy no es contrato canónico; no puede inventarse cuarto flag | Obtener nombres/dominos de fuente normativa y migrar configuración/proyección | VERIFIED por lectura; incompatibilidad heredada y dependencia documental abiertas |
| TR-007 | ExperimentConfig | `inspect_ExperimentConfig_defined_fields` siempre complete:false; constructor legacy exige max_ticks>0 y registro de agente; §19.1 contempla cero | Inspección sin issues no acredita aceptación; cero rechazado por constructor legacy | Recuperar contrato completo y unificar aceptación sin añadir restricciones inferidas | VERIFIED por lectura y B12; implementación parcial e incompatibilidad legacy abiertas |
| TR-008 | Carga HTML | `index.html` apunta a `js/world/cell.js` y `effect.js` ausentes; existe cells.js; no se hallaron definiciones makeResource/makeHazard/EffectKind | La carga efectiva no proporciona Cell/efectos; pruebas fallan antes de rutas WORLD | Corregir integración de módulos en incremento autorizado, con arranque funcional representativo | VERIFIED árbol/lectura y runner; defecto de carga heredado abierto |
| TR-009 | Suite legacy | Ejecuciones arriba; `js/tests/tests.js`: T15/T19 contienen `|| true`; T18 captura su propia aserción; T20 compara dos runs; T21 no llama Renderer | PASS no siempre acredita intención; coincidencia 4/18 no verifica integración ni replay | Diseñar pruebas pertinentes a contratos recuperados y a rutas antes bloqueadas; distinguir IDs locales/canónicos | VERIFIED lectura/ejecución; límite de evidencia y defectos legacy abiertos |
| TR-010 | uint64 e integración | `is_uint64` admite BigInt uint64 o Number seguro; B08; `experiment.js` usa `time += 1`; `hash_state.js` serializa texto; §6.3/§7/§34 | INFERRED: BigInt requiere integrar aritmética y serialización; aceptar estructura no garantiza interoperabilidad | Mantener exactitud al integrar reloj/WLS1 y probar extremos; no convertir a Number con pérdida | VERIFIED representación/B08; riesgo de integración abierto, no defecto probado del validador |

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
estos dos documentos, código, pruebas y dependencias. DOC-01 termina aquí.
