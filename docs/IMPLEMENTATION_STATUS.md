# Estado de implementación de WORLD-LAB

Documento **informativo y operacional**. Consolidación DOC-02: **2026-11-10
(America/Guayaquil)**. Rama documental `dev/doc-02-knowledge-consolidation`, creada
sobre `origin/main`; aquel cambio no incorporaba código ni pruebas de F3-C.

**Actualización vigente F5-C (2026-11-11, America/Guayaquil): expediente de
preparación COMPLETED; recomendación normativa HOLD.** Base main PR #32
`e7fada1a0e78ff711f056b53148e048102fd1c02`, rama
`dev/f5-c-acceptance-profile`. Perfil `WL-ACCEPT-v026-CAND-1.0.0` **candidato no
aprobado**: fuentes, inventario, suficiencia, arquitectura y nueve propuestas de
vectores. No modifica §37 ni declara conformidad o hitos B/C.
[Decisión, evidencia y dependencias F5-C](#f5-c).

**Corte previo F5-B (2026-11-11, America/Guayaquil): cobertura y
preparación de decisión COMPLETED.** Base main PR #31
`b13d637dd405d363442803ad53821f5a6c6f4a62`, rama
`dev/f5-b-conformance-coverage`. Se conservan las 50 entradas F5-A; se añaden
58 ND y seis ER. Corpus ampliado: 114 PASS, 0 FAIL, 289 BLOCKED, 0 UNTESTED.
GO para revisar el incremento/expediente; **HOLD para resolver la base de aceptación**.
§37 permanece intacto. [Cobertura, evidencia y decisión pendiente F5-B](#f5-b).

**Corte previo F5-A (2026-11-11, America/Guayaquil):
F5A-CONFORMANCE-INFRASTRUCTURE COMPLETED con límites documentales.** Base main
posterior al PR #30 `14d59dad381c344b7213025c86ffa5e661f16fc2`, rama
`dev/f5-a-conformance-harness`. Harness: 6 vectores recuperados, 39 casos derivados
y 5 regresiones PASS; 280 tests históricos y V2–V10 BLOCKED por falta de definición
completa. No se declara conformidad canónica completa ni interoperabilidad.
[Inventario, categorías, evidencia y continuidad F5-A](#f5-a).

**Corte previo F4-G (2026-11-11, America/Guayaquil): corrección
focalizada F4F-001 COMPLETED; GO para revisión de cierre.** Base main posterior al PR #29
`ce9082c55b304cfaac924e7477bf9424c444f3ea`, rama
`dev/f4-g-replay-validator-fix`. Se reutiliza la guardia estructural antes de la
prueba física. Sin enmienda normativa ni cambios en el motor físico.
[Corrección, contrastes y evidencia F4-G](#f4-g).

**Corte previo F4-F (2026-11-11 UTC): auditoría COMPLETED;
aceptación canónica HOLD por F4F-001 (P1).** Base main posterior al PR #28
`20a89415e568b50926ff94bb39b7b1c8962f47b3`, rama
`dev/f4-f-contractual-audit`. Solo pruebas nuevas e informe: ninguna corrección
productiva ni cambio normativo. La conclusión local F4-E queda limitada por el
contraejemplo de continuidad pública. [Inventario, hallazgo y evidencia F4-F](#f4-f).

**Corte previo F4-E (2026-11-11 UTC): autoridad v0.2.6 D-01 aprobada e
implementada; COMPLETED en aceptación local.** Base PR #27
`3f70a9842a967b7fed157cd7db94e6313f590b6d`, rama
`dev/f4-e-contractual-amendment`. La enmienda normativa se publicó primero,
con genealogía y supersesión explícitas. v0.2.5 permanece inalterada; no se declaran
conformidad global, interoperabilidad ni hitos B/C. [Evidencia y límites F4-E](#f4-e).

**Corte previo F4-D (2026-11-11 UTC): revisión contractual COMPLETED;
correcciones PROPOSED CHANGE, pendientes de aprobación e implementación.** Base
main PR #26 `37a718c3680092f46b0d0ba79fc5920d25400a2a`, rama
`dev/f4-d-replay-contract-closure`. Solo documentación: no se cambian norma, APIs,
motor ni excepciones provisionales. Los conflictos A–D permanecen abiertos.
[Paquete de decisión, aceptación y preconformidad F4-D](#f4-d).

**Corte previo F4-C (2026-11-11 UTC): COMPLETED en el cambio de
propiedad y registro incremental autorizado.** Base main PR #25
`635b4a493aabcf35c85ea3c5a47aca174a29c671`, rama `dev/f4-c-recorder-linear`,
pendiente de revisión/merge. F4C-P01 sustituye F3E-P01 y cierra F4B-P02:
historial privado, snapshots independientes, append con rollback y validación
incremental. 453 pruebas Node y un caso adicional de Chromium aprobados;
trabajo de registro O(n) para WORLD/eventos acotados, acreditado por contadores.
No constituye conformidad global. [Propiedad, compatibilidad y evidencia F4-C](#f4-c).

**Corte previo F4-B (2026-11-10): optimización equivalente parcial;
cierre PARTIAL.** Base main PR #24 `a096d5b3ac0ac4763a6dee03e2018f56b459bd9a`,
rama `dev/f4-b-recorder-performance`, pendiente de revisión/merge. Se elimina una
validación/copia redundante por record_step; se preservan detección de corrupción,
atomicidad, API, aliases previos y resultados. No se afirma crecimiento lineal:
continúa bloqueada la decisión sobre propiedad/mutabilidad y publicación del
historial. 433 pruebas Node aprobadas; regresión Chromium aprobada; legacy13 PASS/9 FAIL.
[Equivalencia, perfil y decisión pendiente F4-B](#f4-b).

**Corte previo F4-A (2026-11-10): integración web COMPLETED en su
alcance local.** Base main PR #23 `1491d9213acf7fe1cb2b1e7531889e296b4a61ce`,
rama `dev/f4-a-web-integration`, pendiente de revisión/merge. La web ejecuta
EXPERIMENT y muestra ExperimentResult/estado final sin cambiar el motor.
415 casos Node y un caso adicional de Chromium real aprobados; legacy 13/9 con
causas diferenciadas. Las cuatro fronteras F3-G/H continúan abiertas y no se
certifica conformidad global. [Integración, evidencia y límites F4-A](#f4-a).

**Corte previo F3-H (2026-11-10): validación con contexto implementada;
cierre PARTIAL.** Base main PR #22 `7a8f34668c70d3e4da217915030ecba476c17f94`,
rama dev/f3-h-replay-validation. A/C/D/E y continuidad interna se verifican con
reproducción independiente, estructura/eventos/hashes/terminación; 400 pruebas.
Los bloqueos F3-G persisten y la continuidad pública3 carece de contexto; no se
finge equivalencia de contextos null/observados. [Fuentes, pruebas y límites F3-H](#f3-h).

**Corte previo F3-G (2026-11-10): replay PARTIAL.** Base main PR #21
`943458da7340ead3f947aa54bcbc97186b5fa732`, rama dev/f3-g-replay-core.
Siete statuses verificados para time0/parámetros representables, rollback propio de
replay WORLD/RNG/Recorder; 377 pruebas locales. Dos incompatibilidades de §25
siguen bloqueadas: parámetros inválidos frente a *_used y origen temporal>0.
[Evidencia, caracterización y propuestas mínimas F3-G](#f3-g). Sin conformidad global.

**Corte previo F3-F (2026-11-10): ciclo experimental COMPLETED en alcance local.**
Base main PR #20 `8f8a771d76e88499bba6c2ef3a894fe1f981f346`; rama
`dev/f3-f-experiment-integration`. Ambos modos producen ExperimentResult y
trayectorias WLS1; fallos internos se propagan sin reintento ni falso COMPLETED.
Atomicidad conjunta WORLD/RECORDER no implementada. 350 pruebas locales y medición
10/100/500 ticks. [Evidencia, errores y límites F3-F](#f3-f).

**Corte previo F3-E (2026-11-10): RECORDER B COMPLETED en alcance local.**
Base main `bdf347344e47d7908fe327fcef31111905e0a4f9` (PR #19), rama
`dev/f3-e-recorder-completion`: StepRecords multi-tick completos con hashes WLS1,
eventos/secuencias y confirmación atómica; Trajectory con copias independientes.
327 pruebas locales. [Contratos, límites y evidencia F3-E](#f3-e).
EXPERIMENT/replay no se implementan ni se declara conformidad global.

**Corte previo F3-D/2 (2026-11-10): puerta READY; F3-D COMPLETED en el
alcance contractual disponible.** Base main posterior al PR #18,
`fa79ad6a990ea8b1b477868c1e4a81e05d25f481`. Fragmento §34 y V1 recuperados;
WORLD/FULL y hashes verificados, 303 pruebas locales. [Evidencia F3-D/2](#f3-d2).
RECORDER conserva su estado parcial y no se modifica; no implica conformidad global.

**Corte F3-D anterior: PARTIAL, puerta WLS1 BLOCKED (2026-11-10).**
Base main `4cde54c7c966530aa7ed59c48d10ea630130dfaa`, posterior al PR #17:
F3-C está integrado y sigue parcial. En dev/f3-d-wls1-hashes se verifica el
acumulador FNV sobre bytes, pero faltan layout §34 y V1; hashes canónicos no
disponibles y RECORDER no se completa. Véase [F3-D](#f3-d), 288 pruebas locales.

**Corte de integración F3-C previo, 2026-11-10.** Rama
`dev/f3-c-recorder` sincronizada con main `2846a8560c00daef85d91c9a9feffa7456862039`
mediante merge `cccb7b4b6cc80f4a22a30c14ac66476063946df4`. main contiene DOC-02,
pero **F3-C sigue sin merge hacia main**. RECORDER continúa parcial, B bloqueada.
Detalle de corrección, 276 pruebas locales y preparación documental WLS1 en
[integración F3-C](#integracion-f3-c) y [frontera F3-D](#frontera-f3-d).

<a id="doc02-scope"></a>
## Corte DOC-02: qué estaba integrado y qué estaba solo en rama

**Corte histórico VERIFIED por Git y ejecución DOC-02:** `main` estaba en
[`b00a50ebcc25f2a0d3e3abe4cc5eb2b1b64a79b8`](https://github.com/ksgfin8-cyber/yellow/commit/b00a50ebcc25f2a0d3e3abe4cc5eb2b1b64a79b8),
posterior al PR #15. F3-C está publicado únicamente en
[`dev/f3-c-recorder`, `0a6e245b930698b62ac25a34bf539f3828be20a0`](https://github.com/ksgfin8-cyber/yellow/commit/0a6e245b930698b62ac25a34bf539f3828be20a0).
El segundo es descendiente directo de main, con un commit adicional y **sin merge**.
DOC-02 conserva aquí sus anotaciones documentales para consulta, no su funcionalidad.

| Referencia inspeccionada | Código disponible | Evidencia local reejecutada DOC-02 |
|---|---|---|
| main / árbol funcional de DOC-02 | F1-A–F3-B; Recorder y hashes legacy | 13 suites, **252 PASS**, 0 FAIL |
| Rama F3-C, commit fijado arriba | Capacidad A: registro inicial, eventos/secuencias y preparación; capacidad B: StepRecord completo bloqueado por WLS1 | 14 suites, **274 PASS**, 0 FAIL, incluidas 22 F3-C |
| Ambos árboles | EXPERIMENT heredado, sin replay integrado ni conformidad global demostrada | Legacy 10 PASS / 12 FAIL; cinco causas distintas, véase [TR-009](#tr-vigentes) |

Cuando una fila diga «F3-C implementado/verificado», se refiere **solo a esa rama**.
Los enlaces a su código y pruebas se fijan al SHA publicado; esos archivos/cambios
no están integrados en main. La preparación de eventos de replay iniciales no es
replay completo. El alcance B no está completo en ninguna de las dos referencias.

<a id="doc02-navigation"></a>
## Ruta de consulta

| Necesidad | Fuente única para el detalle |
|---|---|
| Perfil candidato vigente F5-C | [Autoridad, suficiencia y puerta HOLD](#f5-c) |
| Cobertura y expediente previo F5-B | [Obligaciones atómicas, contrastes y propuesta pendiente](#f5-b) |
| Infraestructura previa F5-A | [Corpus, runner, resultados y vacíos](#f5-a) |
| Corrección previa F4-G | [F4G-001, cierre y regresión](#f4-g) |
| Auditoría previa F4-F | [HOLD original, contraejemplo y preparación canónica](#f4-f) |
| Enmienda e implementación F4-E | [Genealogía y evidencia previa](#f4-e) |
| Revisión contractual previa F4-D | [Propuesta única pendiente y matriz de preconformidad](#f4-d) |
| Historial propio y registro incremental F4-C | [Política, equivalencia, atomicidad y complejidad](#f4-c) |
| Rendimiento RECORDER F4-B previo | [Optimización parcial, equivalencia y bloqueo](#f4-b) |
| Integración web F4-A | [Carga real, resultados, renderer y Chromium](#f4-a) |
| Estado validación F3-H | [Contraste exhaustivo, rendimiento y fronteras](#f3-h) |
| Cierre previo replay F3-G | [Motor parcial, ramas bloqueadas y pruebas](#f3-g) |
| Cierre previo EXPERIMENT F3-F | [Orquestación, resultados, fallos y rendimiento](#f3-f) |
| Cierre previo RECORDER F3-E | [Pasos, eventos, atomicidad, Trajectory y regresión](#f3-e) |
| Cierre previo de hashes F3-D/2 | [Contrato recuperado, V1, implementación y pruebas](#f3-d2); [corte F3-D parcial anterior](#f3-d) |
| Integración F3-C previa y frontera WLS1 | [Merge, corrección y pruebas](#integracion-f3-c); [contratos requeridos para F3-D](#frontera-f3-d) |
| Autoridad y significado de evidencia | [Autoridad](#autoridad); [especificación canónica](WORLD-LAB_v0.2.5_canonical_transcripcion.md) |
| Contrato → componente → pruebas | [Mapa del repositorio](#mapa-repositorio); [estado por componente](#estado-componentes) |
| Decisión vigente, sustitución y justificación | [Índice de decisiones](#decisiones-vigentes); cada enlace lleva al expediente existente |
| Bloqueo, impacto y condición de cierre | [TR-001–010](#tr-vigentes); no se abre otro registro de incidencias |
| Commit y alcance de integración | [PR #1–15 y F3-C](#historial-integracion) |
| Reproducción y límites de la verificación DOC-02 | [Evidencia DOC-02](#verificacion-doc02) |
| Evidencia original de cada incremento | [F2-A](#f2-a), [F2-B](#f2-b), [F2-C](#f2-c-historico), [F2-D](#f2-d), [F2-E](#f2-e), [F2-F](#f2-f), [F2-G](#f2-g), [F2-H](#f2-h), [F2-I](#f2-i), [F3-A](#f3-a), [F3-B](#f3-b), [F3-C en rama](#f3-c) |
| Historia F1 y reglas generalizables | [Informe F1-A](F1-A-deterministic-core.md), [informe F1-B](F1-B-contracts.md), [aprendizajes](ENGINEERING_LEARNINGS.md) |

Los apartados por incremento conservan su corte histórico: «pendiente», «aquí» o
«actual» dentro de ellos no anulan una resolución posterior. Para vigencia usar
este índice y TR. F1-A/F1-B no se reescriben; tampoco se eliminan sus advertencias.

<details>
<summary>Cortes históricos y bases de incrementos anteriores</summary>

Corte anterior F3-B: base `da2d1db11ee1cdd7709eedaa866dbf36aa84497d`,
rama `dev/f3-b-experiment-config`.

Corte anterior F3-A: base `4ac1ec6bd17d546c4ed9ae92c60ee04c3fb5c825`,
rama `dev/f3-a-tick-transaction`.

Corte anterior F2-I: base `becf49740905ee136c046c792f071edf2f8c85d0`,
rama `dev/f2-i-feedback-contract`.

Corte anterior F2-H: base `c57a84a72119a8d752368f1c556aaebfc7ae5617`,
rama `dev/f2-h-action-events`.

Corte anterior F2-G: base `1ef8799f1d1e842a70686e5cc42363f90b8e3e25`,
rama `dev/f2-g-world-initialization`.

Corte anterior F2-F: base `b37abd3f46d4aa8032556e0dbc92b5a41c6c0448`,
rama `dev/f2-f-world-observation`.

Corte anterior F2-E: base `f8aaca31951e425333416cfce85a031572890cfe`,
rama `dev/f2-e-world-dynamics`.

Referencia del corte anterior F2-D: base `4729c999ebf97c4d643bf688abf7e2ec1acc8509`.
La entrega parcial `1d2bc5c` fue incorporada por el usuario en PR #7;
HEAD remoto observado al entregar la continuación: `e76754e0a95483818633e5121a5f6c205ec92de0`.
Entrega F2-D en `dev/f2-d-world-actions`; evidencia DOC-01 conservada donde sigue
vigente. Actualizar solo lo afectado por cada incremento.

</details>

<a id="autoridad"></a>
## Autoridad, procedencia y lectura inicial

La autoridad es [WORLD-LAB v0.2.5 Canonical](WORLD-LAB_v0.2.5_canonical_transcripcion.md),
con la precedencia de §0.1: el código y estos documentos no sustituyen contratos,
invariantes ni pseudocódigo. Los vectores son referencias y T01–T280 criterios
de aceptación. FROZEN no significa ejecución ni conformidad demostrada (§0.3–§0.5).

**NORMATIVE** identifica obligaciones canónicas y disposiciones históricas
incorporadas; **ENGINEERING DECISION** identifica una precisión técnica compatible,
con la autoridad y límites descritos en su expediente. «HISTORICAL» en los cortes
anteriores indica procedencia atribuida a un fragmento recuperado, no lectura
independiente del documento v0.2.4 completo ni una prueba de autenticidad.

Categorías de afirmaciones documentales, distintas de los estados normativos:
**VERIFIED** = contrato, código, commit o prueba examinados directamente en el incremento indicado;
**REPORTED** = declaración histórica no verificada independientemente aquí;
**INFERRED** = conclusión derivada de evidencia identificada;
**UNKNOWN** = evidencia insuficiente. VERIFIED por lectura se indica como tal;
no equivale a una prueba de comportamiento o conformidad.

En el corte DOC-01 se registró la lectura íntegra de la especificación y los informes
[F1-A](F1-A-deterministic-core.md) y [F1-B](F1-B-contracts.md), documentos
técnicos históricos previos a DOC-01. En aquel corte también se leyeron todos los módulos JS,
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

<a id="mapa-repositorio"></a>
## Mapa del repositorio y contratos

VERIFIED por inventario Git DOC-02: **49 archivos versionados en main**: 28 JS,
14 en tests (13 suites locales y runner legacy), cinco documentos, index.html y
CSS. F3-C añade tests/f3-c.test.cjs: 50 archivos. Sin gestor de paquetes ni árbol
independiente de replay/metrics. Se inspeccionaron rutas, APIs, cargadores y las
fronteras señaladas; no se realizó una nueva auditoría exhaustiva de conformidad.

| Rutas / responsabilidad | Autoridad o precisión vigente | Implementación / evidencia y entrada al expediente |
|---|---|---|
| [core](../js/core/prng.js): contracts, prng, hash, seed | §§6.4/10/11.6/24.1; dominio de next_int acotado técnicamente | F1-A 18 casos y F1-B B05; [informe F1-A](F1-A-deterministic-core.md), [F1-B](F1-B-contracts.md) |
| [contracts/structures.js](../js/contracts/structures.js), [WorldConfig](../js/world/world_config.js) | §§6–9/12; esquemas cerrados; inspector de ExperimentConfig sigue complete:false | F1-B B01–B12; [tipos F2-A](#f2-a) |
| [world](../js/world/world.js): cells, entity, world_state y world | §§7–15/31; mapa recuperado F2-B; aclaración INIT-004 y decisiones ACT/DYN | [F2-A–C](#f2-a), [F2-D](#f2-d), [F2-E](#f2-e), [F2-G](#f2-g), [F2-H](#f2-h); suites homónimas |
| [interface](../js/interface/feedback.js): action, action_result, observation, feedback | §§12/13/16/17; detalles ACT/OBS/FB de ingeniería conservados | [F2-F](#f2-f), [F2-H](#f2-h), [F2-I](#f2-i); pruebas de privacidad/16 flags |
| [tick_transaction.js](../js/experiment/tick_transaction.js) | §§5/26/32 + F3A-P01–03 autorizadas; reutiliza WORLD | [F3-A](#f3-a), 40 casos; script independiente, no cargado por index.html |
| [experiment_config.js](../js/experiment/experiment_config.js) | §19, F3A-P01 y F3B-P01–03; aceptación no depende de registry | [F3-B](#f3-b), 18 casos; configuración no demuestra ejecución de agente |
| [experiment.js](../js/experiment/experiment.js), [recorder.js de main](../js/experiment/recorder.js), [trajectory.js](../js/experiment/trajectory.js) | Deben migrar a §§20–23/32; main conserva firmas/bucle legacy | TR-005/008/009; [frontera F3-B](#f3-b); F3-C no se importa a este árbol |
| [Recorder F3-C fijado](https://github.com/ksgfin8-cyber/yellow/blob/0a6e245b930698b62ac25a34bf539f3828be20a0/js/experiment/recorder.js) | §§18/21/22 y resolución transmitida F3-C; capacidad A, no StepRecord completo | [Expediente F3-C](#f3-c), [22 pruebas solo en rama](https://github.com/ksgfin8-cyber/yellow/blob/0a6e245b930698b62ac25a34bf539f3828be20a0/tests/f3-c.test.cjs) |
| [hash_state.js](../js/experiment/hash_state.js), core/hash.js | §§24/34: FNV probado no acredita WLS1 | Texto legacy omite lifecycle y referencia EffectKind ausente. TR-001/010; WLS1 no implementado/verificado |
| [agents](../js/agents/registry.js): agent, wait_agent, random_agent, rule_agent, registry | §§4.2/28; factory es disponibilidad legacy, no dominio de agent_type | TR-007/008: sin migración ni interoperabilidad probada |
| [index.html](../index.html), [main.js](../js/main.js), [renderer](../js/visualization/renderer.js), [CSS](../css/style.css) | §29 y frontera de snapshots; ejecución web todavía legacy | TR-008: cargar scripts en VM no es probar navegador ni renderer |
| [tests](../tests/f1-a-legacy.cjs), [suite legacy](../js/tests/tests.js) y cinco docs | Pruebas locales ≠ T01–T280; norma única y dos informes históricos | [Verificación DOC-02](#verificacion-doc02); F1-A/F1-B históricos y dos documentos vivos, sin nuevos archivos |

<a id="decisiones-vigentes"></a>
## Índice de decisiones vigentes y sustituidas

Este índice **no duplica los expedientes**: allí permanecen problema, alternativas
realmente documentadas, razones, autoridad, pruebas y riesgos. Si un expediente
no enumera alternativas o no conserva la orden original como fuente independiente,
esa parte histórica permanece **UNKNOWN**; DOC-02 no la reconstruye. Los IDs
existentes se conservan. Los nombres de apartados F1 son sus referencias originales,
no nuevos identificadores normativos.

| ID / referencia estable | Vigencia y autoridad | Dónde decidir / componentes y pruebas |
|---|---|---|
| F1-A: dominio next_int / UTF-8 / semillas | Vigente en main; algoritmo NORMATIVE, frontera de enteros seguros/cardinalidad es ENGINEERING DECISION; ubicación/carga inicial de ContractError sustituida por F1-B | [Decisiones internas F1-A](F1-A-deterministic-core.md#decisiones-internas); core PRNG/hash/seed, F1A-01–18; traslado posterior de ContractError descrito en F1-B |
| F1-B: esquemas y representaciones | Vigente; contratos NORMATIVE, registros propios/Map y representaciones documentadas; inspector parcial no acepta ExperimentConfig | [Implementación F1-B](F1-B-contracts.md#implementación-y-decisiones-internas); structures/contracts y B01–B12; validadores actuales F3-B en su expediente |
| INIT-001–009 | Registro histórico F2-C; INIT-004 resuelta por aclaración autorizada F2-G, INIT-005 por fragmento incorporado; INIT-007/008 ya no describen inicialización actual | [Historial INIT](#f2-c-historico), [resolución vigente F2-G](#f2-g); world.js y F2G-01–21. No volver a resolver lifecycle en Recorder |
| INIT-G01–03 | Vigentes, adaptación/atomicidad/diagnóstico internos compatibles con aclaración autorizada | [F2-G](#f2-g); World.initialize/initialize_world, snapshots y errores, límites de datos ordinarios |
| ACT-P01/02/03/05 | Vigentes como ENGINEERING DECISION en esquema ActionResult, WAIT/costes, orden energético y delta efectivo; no autoridad histórica completa | [Revisión F2-H](#f2-h), alternativas conservadas en [F2-D](#f2-d); world.js/action_result.js, F2D/F2H |
| ACT-P04 | **SUSTITUIDA**: events:[] provisional no rige MOVE con efectos; obligaciones recuperadas más detalles ACT-H01/02 | [F2-H](#f2-h), world.js; F2H-01–15. La tabla F2-D es historia |
| ACT-P06 | Vigente, extendida por orden F2-H: preparación conjunta de eventos/cambios, atomicidad local | [F2-H](#f2-h); F2D-23/24 y F2H; no equivale a transacción global |
| ACT-H01/02 | Vigentes ENGINEERING DECISION: movimiento→efecto, activación con magnitud cero; no orden histórico interno demostrado | [F2-H](#f2-h), world.js; F2H-05/08/15 y matriz del incremento |
| DYN-P01–03 | Vigentes ENGINEERING DECISION: regeneración binaria determinista, preparación local, retorno undefined | [F2-E](#f2-e), world.js; F2E-01–16. Fórmula histórica no verificada |
| OBS-P01–03 | Vigentes ENGINEERING DECISION: subesquemas, identidad de entidad/radio y capacidad de ventana | [F2-F](#f2-f), observation.js; F2F-01–18. Presupuesto local 64 MiB, r511/r512; no redefine WorldConfig |
| FB-P01–03 | Vigentes ENGINEERING DECISION: marcadores ocultos constantes, validación estructural, solo null/snapshots | [F2-I](#f2-i), feedback.js; F2I-01–18. Proyección nullable no es ActionResult crudo |
| F3A-P01 | Vigente, ENGINEERING DECISION aprobada explícitamente: max_ticks uint64 Number seguro/BigInt, comparación/promoción exactas | [F3-A](#f3-a), tick_transaction.js; F3A-15/17–23/39; frontera Recorder en TR-010 |
| F3A-P02/03 | Vigentes, esquemas de salida ENGINEERING DECISION autorizados; orden/rollback exigidos normativamente | [F3-A](#f3-a); F3A-01–40. Capturas WorldState y PRNG vivo separadas; [EL-006](ENGINEERING_LEARNINGS.md) |
| F3B-P01–03 | Vigentes ENGINEERING DECISION: identidad Unicode no vacía sin normalizar ni consultar registry, captura anidada y diagnóstico | [F3-B](#f3-b), experiment_config.js; F3B-01–18. Config válida no garantiza factory disponible |
| F3C-P01/02 | **Solo rama**, ENGINEERING DECISION autorizada: metadata Number seguro y entity_states Map; esquema/valores recuperados diferenciados | [F3-C](#f3-c); F3C-07/14/15/17/19. Límites de metadata no atribuidos al texto histórico |
| F3C-P03/04 | **Solo rama**, precisiones técnicas de conversión exacta/puntero y preparación sin publicación | [F3-C](#f3-c); F3C-14–22. Alternativas completas no enumeradas en ese registro; no suponerlas recuperadas |
| F3H-P01/P02 | Prueba interna lineal con contexto explícito; firmas preservadas y diagnostics MATCH/MISMATCH de ingeniería | [F3-H](#f3-h); no defaults ni contexto global, firma pública de continuidad no vacía PARTIAL |
| F3G-P01–03 | Adaptación privada a Recorder, checkpoint de ambos propietarios y representación exacta de contadores; A/B siguen abiertos | [F3-G](#f3-g); no modifica fail-stop F3-F ni las precondiciones compartidas |
| F3F-P01–03 | Fail-stop sin rollback conjunto ni categorías públicas nuevas; setup fuera de catch step; detalles por rama §20 | [F3-F](#f3-f), experiment.js; errores y limitaciones explícitos, no norma histórica inventada |
| F3E-P01/P02; F3C-P04 | Staging F3-C conservado, bloqueo de publicación sustituido por pasos completos; revalidación de prefijo y finalización coherente son precisiones de ingeniería | [F3-E](#f3-e), Recorder; no reejecuta WORLD ni ofrece rollback conjunto con EXPERIMENT |
| F3D-P01 / F3D-P02 / F3D2-P01 | Acumulador vigente; rechazo provisional de hashes sustituido por WLS1 real; contexto de validación y APIs son ENGINEERING DECISION | [F3-D/2](#f3-d2), hash_state.js; 15 pruebas nuevas y F3-D original intacto. Layout/tags son HISTORICAL RECOVERED, no ingeniería |
| P0-3 / nulabilidad F3-C | NORMATIVE: sustituye equivalencia heredada de tres nulos; action y action_result presentes, WAIT real sin agente | [F3-C](#f3-c), §§20.2/22/32; F3C-18 y kernel F3-A. No nulos fabricados |

<a id="historial-integracion"></a>
## Historial de integración contrastado

VERIFIED por `git fetch` explícito de main y F3-C, `git log --merges`, padres y
ancestralidad: los merges #1–15 son recuperables desde main. La tabla relaciona
el número registrado en el mensaje de merge con su segundo padre, no pretende
certificar discusiones, aprobaciones o revisiones web de los PR, **no examinadas**.

| PR / incremento | Commit incorporado (segundo padre) | Merge recuperable en main |
|---|---|---|
| [#1 F1-A](https://github.com/ksgfin8-cyber/yellow/pull/1) | 0356c21 | a5d293d |
| [#2 F1-B](https://github.com/ksgfin8-cyber/yellow/pull/2) | e6bcea2 | c98243b |
| [#3 DOC-01](https://github.com/ksgfin8-cyber/yellow/pull/3) | 18a4413 | 4cbb42c |
| [#4 F2-A](https://github.com/ksgfin8-cyber/yellow/pull/4) | 5d585fc | 02abea2 |
| [#5 F2-B](https://github.com/ksgfin8-cyber/yellow/pull/5) | 07e8c74 | c740f23 |
| [#6 F2-C parcial](https://github.com/ksgfin8-cyber/yellow/pull/6) | 7d070f5 | 4729c99 |
| [#7 F2-D parcial](https://github.com/ksgfin8-cyber/yellow/pull/7) | 1d2bc5c | e76754e |
| [#8 F2-D continuación](https://github.com/ksgfin8-cyber/yellow/pull/8) | a22ee52 | f8aaca3 |
| [#9 F2-E](https://github.com/ksgfin8-cyber/yellow/pull/9) | f0fe1f9 | b37abd3 |
| [#10 F2-F](https://github.com/ksgfin8-cyber/yellow/pull/10) | 56ac7ba | 1ef8799 |
| [#11 F2-G](https://github.com/ksgfin8-cyber/yellow/pull/11) | 1740f65 | c57a84a |
| [#12 F2-H](https://github.com/ksgfin8-cyber/yellow/pull/12) | 6486ccf | becf497 |
| [#13 F2-I](https://github.com/ksgfin8-cyber/yellow/pull/13) | cbe4242 | 4ac1ec6 |
| [#14 F3-A](https://github.com/ksgfin8-cyber/yellow/pull/14) | 14ec2e5 | da2d1db |
| [#15 F3-B](https://github.com/ksgfin8-cyber/yellow/pull/15) | 1cbadd7 | b00a50e |
| F3-C, sin integración observada | 0a6e245; padre b00a50e | Ninguno; no se atribuye número de PR no comprobado |

<a id="verificacion-doc02"></a>
## Evidencia DOC-02 y límites

**VERIFIED por ejecución, 2026-11-10, Node.js v24.22.1:** se ejecutó cada suite
con `node tests/<suite>.test.cjs` en el commit F3-C fijado y luego en la rama
documental recién creada desde main, antes de editar documentos. En main:
F1-A 18, F1-B 12, F2-A 14, F2-B 13, F2-C 21, F2-D 28, F2-E 16, F2-F 18,
F2-G 21, F2-H 15, F2-I 18, F3-A 40, F3-B 18: **252 PASS**, exit 0 en las 13
suites, sin fallos ni omitidas. F3-C añade 22: **274 PASS**, exit 0 en las 14.
No se ejecuta un supuesto tests/f3-c.test.cjs en main: ese archivo no existe allí.

`node tests/f1-a-legacy.cjs` produjo exit 1 y 10 PASS/12 FAIL en cada árbol. En main
nueve fallan por EffectKind, dos por factories y T16 por invalid initial_state.
F3-C conserva cuatro EffectKind y cambia cinco a recording failed, documentados en
TR-009. Ninguna aserción se ajusta; un total igual no demuestra compatibilidad.
No se repitió --baseline: no es necesario para este cambio documental ni representa
la base actual (lee ad7cc99). Estas ejecuciones no sustituyen T01–T280.

Verificación documental DOC-02: inventario completo de rutas versionadas, enlaces
relativos/anclas internas, existencia de objetos Git citados y ancestralidad de
los 15 merges, inspección del diff y `git diff --check`. Solo se modifican los dos
documentos vivos; informes F1, norma, código, pruebas y HTML permanecen idénticos
a main. Los enlaces remotos a contenido F3-C se contrastan con objetos Git del
commit obtenido, sin afirmar comprobación HTTP de cada página web.

**UNKNOWN / pendiente:** archivo histórico v0.2.4 completo; gramáticas/detalles
históricos no transmitidos; WLS1/vectores íntegros; confirmación StepRecord;
integración experimental/web/agentes y replay; ejecución de tests canónicos e
interoperabilidad. Dependencias, impacto y cierre en TR-001/005/007/008/009/010.
La consolidación no autoriza implementarlos ni iniciar F3-D.

<a id="estado-componentes"></a>
## Estado por componente (main F3-B y F3-C separado)

| Incremento / componente | Estado y alcance de evidencia; F3-C solo en rama |
|---|---|
| F1-A: PRNG, UTF-8, FNV, semillas | Implementado; VERIFIED por ejecución de 18 casos locales. `next_int` admite extremos Number seguros y cardinalidad ≤2^32; esa decisión interna está documentada, sin ampliar §10.3. No es la suite canónica completa. |
| F1-B: contratos | Parcialmente implementado; VERIFIED por ejecución de B01–B12: WorldConfig, binary64, predicados Cell/Entity/WorldState y Action. No incorpora por sí solo esos contratos al motor. |
| FeedbackConfig / ExperimentConfig | Feedback F2-I verificado localmente. F3-B implementa ExperimentConfig cerrado de cinco campos, semilla exacta, dominio F3A-P01 y copias anidadas inmutables (18 pruebas). TR-007 resuelta en alcance de configuración bajo política de identificador F3B-P01; gramática histórica completa no verificada. Inspector F1-B complete:false conserva su propósito parcial y no es validador canónico. Integración experimental pendiente. |
| WORLD | F2-A/B proporcionan tipos, snapshots, generación y selección; F2-C lifecycle <= y preparación. F2-D/E/F mantienen acciones, dinámica y observación verificadas localmente bajo sus políticas documentadas. F2-G cierra initialize_world → InitialWorldResult y adapta World.initialize a la misma ruta: validación de eventos crudos, lifecycle/sync únicos, snapshots separados y atomicidad local (21 pruebas nuevas). F2-H añade eventos operacionales crudos preparados antes de confirmar acciones (15 pruebas nuevas), sustituyendo ACT-P04. INIT-004 resuelta por aclaración autorizada; TR-008 resuelta para carga/inicialización en runner. No equivale a F2 completo o conformidad global. |
| EXPERIMENT | Rama F3-F integra ambos modos con inicialización única, Feedback, agentes/factories, kernel F3-A y Recorder F3-E; ExperimentResult cerrado. Errores de step → FAILED con prefijo; internos/setup se propagan. Atomicidad conjunta no implementada. 23 pruebas end-to-end nuevas; [evidencia](#f3-f). |
| Observaciones / agentes | F2-F implementa observación pura tick/self/local_view, BOUNDED, OUT_OF_BOUNDS, occupied=false y RESOURCE sin distinción de stock (18 pruebas locales). Subesquemas y capacidad documentados como OBS-P01–03, no conformidad histórica demostrada. Agentes sin cambios ni nueva auditoría; integración no verificada. |
| Recorder / hashes | main PR #19 dispone de WLS1 verificado y RECORDER parcial. Rama F3-E completa registro multi-tick y Trajectory con hashes WORLD/FULL, secuencias globales y RecordTransaction; 24 pruebas nuevas. EXPERIMENT sigue sin integrar; [evidencia actual](#f3-e). |
| Replay / WLS1 / Metrics | F3-G motor parcial; rama F3-H añade validación de ReplayResult y comparación exhaustiva con contexto, sin alterar motor. Firma pública de continuidad y modos de contexto conservan limitaciones; bloqueos A/B persisten. WLS1 verificado, Metrics sin implementar; [evidencia F3-H](#f3-h). |
| Renderer / entrada web | Legacy presente, sin cambios ni validación de navegador/render. La inicialización de World en el runner ya funciona; no acredita la aplicación completa ni la orquestación experimental. |
| Integración y conformidad global | No verificadas. UNKNOWN respecto al cumplimiento global; no existe evidencia ejecutada de T01–T280 ni interoperabilidad. §37 no se satisface con las pruebas locales. |

## Evidencia histórica ejecutada en F2-D

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

<a id="tr-vigentes"></a>
## Divergencias y dependencias vigentes

Los estados VERIFIED certifican la observación citada, no conformidad. Estos diez
IDs son el registro vigente, con alcance main/rama explícito. INIT-004 está
resuelta en WORLD desde F2-G; su validación temporal existe solo en la capacidad A
de F3-C. Las tablas por incremento posteriores conservan historia, no reabren
resoluciones ni permiten declarar integración global.

| ID | Componente | Evidencia | Impacto | Resolución prevista | Estado | Condición verificable de cierre / siguiente dependencia |
|---|---|---|---|---|---|---|
| TR-001 | Corpus normativo | F3-D/2 recibe §34.1–9, layout y V1 completos; otros fragmentos F2/F3 conservan procedencia. No se leyó el documento histórico completo | Se cierra el bloqueo de bytes/hashes en rama F3-D/2; quedan otras cláusulas y V2–V10 | [Fuente, V1 y pruebas F3-D/2](#f3-d2); no reconstruir lo aún ausente ni ampliar RECORDER | Parcialmente resuelta; WLS1 VERIFIED localmente, no conformidad global | Mantener evidencia exacta; RECORDER B verificado localmente en F3-E; otras cláusulas requieren fuentes/tests respectivos. La integración con EXPERIMENT y replay conserva sus criterios propios. |
| TR-002 | EntityState y creación | F2-A/C aportaron tipos/preparación; F2-G World.initialize llama initialize_world y adopta copia tipada independiente con lifecycle/config explícitos | Resuelta la ruta de creación heredada inválida; consumidores no migrados al ciclo canónico completo | Conservar pruebas F2G-01/05/13/16; integrar eventos/ciclo solo en alcance autorizado | VERIFIED ejecución F2-G; creación y adaptación inicial resueltas, integración experimental pendiente | Creación local ya cerrada en F2-G; integración: consumir InitialWorldResult y eventos sin duplicar lifecycle, con prueba del ciclo real. |
| TR-003 | Movimiento / observación | F2-D verifica MOVE BOUNDED; F2-F elimina módulo de build_observation y verifica centro/bordes/esquinas/mapas estrechos con F2F-02–07 | Movimiento y proyección espacial corregidos localmente; orquestación experimental no verificada | Conservar evidencia local y comprobar consumidores cuando se integren; subesquemas/capacidad OBS-P01–03 explícitos | VERIFIED ejecución F2-D/F2-F; divergencia espacial resuelta en alcance local, sin certificar aplicación completa | Bordes/BOUNDED locales ya verificados; integración: consumidor real conserva geometría, privacidad y radio con pruebas alcanzadas. |
| TR-004 | Configuración / daño | apply_action usa campos canónicos, verificados en F2-D; tras F2-G legacy T14 alcanza fallo de factory makeHazard ausente | Campo de daño corregido localmente; runner heredado no acredita aplicación de peligro | Conservar pruebas focalizadas y resolver consumidores en su alcance; ACT-P03 y detalles ACT-H01/02 siguen pendientes de contraste histórico | VERIFIED F2-D y diagnóstico F2-G; integración de daño no certificada | Mantener pruebas de daño/coste reales; consumidor integrado demuestra efecto y eventos sin factories legacy. |
| TR-005 | EXPERIMENT / reloj | F3-F integra secuencia canónica mediante F3-A, 23 pruebas; lifecycle/sync únicos por inicialización/tick | Episodios locales completos; fallo WORLD confirmado→Recorder conserva prefijo y se propaga sin retry | [F3-F](#f3-f); no prometer rollback conjunto; registrar política y futuros diagnósticos | Orquestación local resuelta, coordinación global parcial explícita | Cualquier futura recuperación conjunta requiere contrato y prueba; replay/UI siguen fuera de este cierre. |
| TR-006 | FeedbackConfig / Feedback | Orden F2-I transmite §17 histórico: expose_validity=true, expose_reason=false, expose_events=false, expose_energy_delta=true, booleanos exactos y Feedback cerrado | Eliminados flags incompletos, coerciones y esquema legacy; FB-P01–03 documentan detalles de proyección no recuperados | Conservar 18 casos F2-I y verificar uso por consumidores en futuro alcance, sin adaptar agentes/EXPERIMENT ahora | VERIFIED lectura de fragmento/ejecución F2-I; resuelta localmente configuración/proyección, no integración ni conformidad histórica de marcadores ocultos | Proyección local cerrada; integración con agente/ciclo preserva flags y nulabilidad. Representación histórica solo se cierra con fuente auténtica. |
| TR-007 | ExperimentConfig | F3-B constructor/validate_ExperimentConfig aceptan cinco campos cerrados, uint32 no nulo, max_ticks uint64 exacto, WORLD/Feedback canónicos e identificador F3B-P01 independiente del registro | Se eliminan restricción max_ticks>0, normalización de semilla y acoplamiento de aceptación a AGENT_REGISTRY; bucles siguen legacy | Integrar configuración sin convertir límites ni asumir disponibilidad de factory; inspección F1-B sigue parcial | VERIFIED F3B-01–18; resuelta configuración local, gramática histórica del identificador e integración pendientes | Configuración local cerrada; factory/agent resueltos explícitamente y probados sin restringir silenciosamente agent_type. |
| TR-008 | Carga / integración web | F4A-01–16: HTML incluye kernel/replay, entrada consume ExperimentResult, Chromium ejecuta Wait/Random y renderiza estado final o inicial | Se cierra la entrada web legacy y se conserva el resultado ante errores visuales | [F4-A](#f4-a); mantener snapshots independientes y episodios pequeños | VERIFIED Node/Chromium; integración web COMPLETED en rama F4-A, pendiente de merge; no conformidad global | Criterio web alcanzado; aceptación integral conserva fronteras de replay, dominios y corpus de pruebas. |
| TR-009 | Suite legacy | F4-A: 13 PASS/9 FAIL; T06/07/08/20/22 ya cargan kernel y fallan al esperar Trajectory directa; T12/13/14 factories eliminadas; T16 TOROIDAL | El fallo de carga desaparece; las expectativas históricas siguen incompatibles con la API vigente | [Causas ejecutadas F4-A](#f4-a); runner separado de la web, aserciones intactas | VERIFIED causas diferenciadas; no hay mejora artificial del total | Consumidores web migrados; pruebas v0.1 conservadas como diagnóstico histórico, no criterio canónico. |
| TR-010 | uint64 e integración | F3-A conserva uint64; §22 recuperado exige StepRecord.tick Number seguro. F3-C convierte BigInt pequeño solo sin pérdida y rechaza tick no representable. RecordedEvent/sequence Number seguro según F3C-P01 | Incompatibilidad de frontera permanece para ticks >MAX_SAFE_INTEGER, sin reducir max_ticks ni tocar núcleo/config | Resolver integración/persistencia y hashes en autorización posterior; no cast con pérdida | VERIFIED F3C-07/14/17 y F3-A; representación de registro acotada, integración de dominio completo pendiente | Decisión de integración/persistencia compatible con ambos dominios y pruebas en MAX_SAFE_INTEGER/uint64; sin pérdida ni reducción implícita. |

No se identificó una desviación normativa nueva no autorizada mediante esta
revisión focalizada; ello no certifica su ausencia fuera de lo examinado.

## Dependencias localizadas para continuar

| Contrato / operación afectada | Qué falta o requiere resolución | Trabajo independiente posible | Evidencia para cerrar |
|---|---|---|---|
| §11.2: generación del mapa | Algoritmo recuperado desde el texto histórico v0.2.4 proporcionado en la orden F2-B; falta fuente independiente en repo | Generación y selección ya verificadas; pueden usarse sin inicialización completa | Conservar procedencia y recuperar documento original para trazabilidad duradera; no reconstruir otras cláusulas |
| §13–§15/§18: acciones, lifecycle, eventos | Condición <= y eventos recuperados en F2-C; INIT-004 aclarada en F2-G; políticas ACT/DYN siguen sin contraste histórico completo | WORLD inicial completo y operaciones independientes verificadas localmente | Integración experimental y contraste histórico de políticas cuando haya fuente, sin reabrir INIT-004 por ausencia del archivo original |
| §11.1/§11.7/§26: inicialización y errores | Aclaración F2-G separa consistencia cruda de validación temporal; API inicial cerrada localmente | initialize_world y adaptador preservan semilla en fallo de posición y no envuelven errores ajenos | main: enriquecimiento aún pendiente; rama F3-C: capacidad A verificada. EXPERIMENT deberá consumir InitialWorldResult y eventos sin resolver lifecycle otra vez |
| §17/§19: feedback y aceptación del experimento | Feedback y configuración migrados F2-I/F3-B; representación de ocultación e identificador no tienen todas sus cláusulas históricas reproducidas | Constructor/validadores canónicos disponibles bajo políticas documentadas | Integrar ciclo/factory/Recorder en alcance posterior sin usar inspector parcial como aceptación; contrastar precisiones históricas si aparece fuente |
| §21/§25/§26.5/§34: registro, replay, atomicidad y bytes | main conserva Recorder legacy; rama F3-C implementa A y bloquea StepRecord. WLS1 V1 de 59 bytes no reproducido; V2–V10 declarados pendientes | Núcleo F3-A y capacidad A verificables independientemente; B/replay necesitan bytes/hashes canónicos | WLS1 auténtico, vectores y pruebas de confirmación/continuidad antes de declarar B o replay completos; TR-001/005/010 |
| §31/§36/§37: aceptación completa | I-01–I-66 y definiciones individuales de tests no reproducidos; T61–T80 no están asignados en tabla §36 | Pruebas locales trazables sin llamarlas suite canónica | Invariantes/casos originales y resolución del inventario incompleto |

VERIFIED: esas referencias/omisiones están en la transcripción examinada;
el algoritmo de mapa también está en el texto de la orden F2-B recibida.
UNKNOWN: contenido exacto omitido y disponibilidad en fuentes externas.
Las tensiones señaladas requieren revisión, no son permiso para corregir la norma
ni refutan por sí solas toda la declaración histórica de cierre.

## Plan histórico DOC-01 y mantenimiento

Plan histórico DOC-01, sin autorización funcional ni fuerza normativa.
No determina el siguiente incremento: F3-C ya aborda RECORDER en una rama y no
queda renombrado F4 por este plan. Véanse TR-001/005/010 para dependencias vigentes:
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
cada decisión interna ni exige repetir auditorías generales. El corte previo a F2-A reunió en su
revisión de continuidad especificación disponible, informes F1-A/F1-B,
estos dos documentos, código, pruebas y dependencias. Cada incremento requiere
su alcance autorizado; F2-B no autoriza el siguiente.

<a id="f2-a"></a>
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

<a id="f2-b"></a>
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

<a id="f2-c-historico"></a>
## Registro de resoluciones de ingeniería y cuestiones normativas

Contexto histórico F2-C: las descripciones siguientes conservan el diagnóstico de
aquel incremento; la fila INIT-004 y la sección F2-G registran su resolución actual.

**Corte histórico F2-C, sustituido para inicialización completa por [F2-G](#f2-g).**
En aquel corte, F2-C estaba parcialmente implementado. No existía una API initialize_world completa ni
se devolvía InitialWorldResult. Hay dos helpers de preparación explícitamente
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
| INIT-004 | Aclaración normativa autorizada, resuelta en WORLD | Orden F2-G §3 del responsable: §§11.1/11.7/18/21.2 | Obligación original: §11.1 valida WorldEvent crudos y §11.7 pide tick/source/sequence. Aclaración: semántica/estructura cruda en WORLD; metadatos solo en RecordedEvent/RECORDER | validate_initial_events_consistency exige ACTIVE→[] o DEAD→un ENTITY_DIED exacto, id/posición correspondientes, sin campos extra; F2G-06–10/17 | Cierre de initialize_world habilitado; validación temporal/enriquecimiento de Recorder sigue pendiente fuera de este incremento |
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

<a id="f2-d"></a>
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

Registro del corte F2-D. La revisión vigente de ACT-P01–06 y la sustitución de
ACT-P04 por contratos transmitidos están en la sección F2-H; la tabla siguiente
conserva la decisión provisional original como historia.

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


<a id="f2-e"></a>
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


<a id="f2-f"></a>
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


<a id="f2-g"></a>
## F2-G — cierre de inicialización y aclaración autorizada INIT-004

### Fuente, autoridad y alcance exacto de la aclaración

**Autorización del responsable del proyecto:** orden F2-G recibida en este chat,
§3 «Aclaración autorizada INIT-004», archivo adjunto Texto pegado.txt, SHA-256
`285ecd4e11668543cba3254418b599f12d0a71c3351ee3a74e34ad8e89419df1`.
El usuario declara recuperada una copia histórica auténtica v0.2.4 fuera del repo;
Codex **no leyó ese archivo histórico completo** ni lo presenta como incorporado.
VERIFIED: contenido de la orden recibida y cláusulas aplicables de la transcripción.
REPORTED: recuperación/autenticidad de la copia histórica externa.

Obligaciones originales conservadas como evidencia:

- §11.1 exige resolver lifecycle una sola vez, validar initial_events y devolver
  WorldEvent[] crudos en InitialWorldResult.
- §11.7 exige tick=0, source="lifecycle", sequence creciente desde0 y consistencia
  de entity_id/position y muerte inicial.
- §18 conserva tipos históricos; lo transmitido en F2-C diferencia WorldEvent
  {type,entity_id,position} de RecordedEvent con metadatos.
- §21.2 (incorporado por referencia; contenido transmitido en F2-C y orden F2-G)
  reserva el enriquecimiento inicial al RECORDER, sin otra resolución de lifecycle.

**Resolución autorizada aplicada:** WORLD valida el esquema cerrado y la
consistencia semántica de WorldEvent crudos con el estado inicial. ACTIVE exige
cero eventos iniciales; DEAD exige exactamente un ENTITY_DIED con id y posición
correspondientes. No se aceptan eventos extra ni metadatos. La validación temporal
de §11.7 se aplica a RecordedEvent[] después del enriquecimiento exclusivo del
RECORDER (tick=0, source="lifecycle", sequence=0,1,...), en una fase posterior.
Justificación arquitectónica: validar metadatos crudos antes del Recorder
confundía los dos tipos y trasladaba una responsabilidad de §4/§21.2 a WORLD.
La orden resuelve esa tensión localizada; no es una decisión de ingeniería inferida
ni una edición unilateral de otros contratos. El archivo normativo original no
se modifica. La validación temporal del RECORDER **no está implementada aquí**.

### Implementación y decisiones internas

Una ruta compartida: prepare_world_before_lifecycle →
prepare_world_through_lifecycle → initialize_world. Los helpers F2-B/C se reutilizan;
no se duplica generación ni resolución. Orden ejecutado:
config válida → semilla válida → PRNG original → WORLD temporal → mapa →
verificación de recursos → posición/entidad ACTIVE → resolve_lifecycle una vez →
sync una vez → validación WorldState → validación cruda → snapshot y resultado.
La validación explícita de semilla reutiliza PRNG._validate_state antes de crear
el stream; la comprobación interna del constructor no consume extracciones.

InitialWorldResult tiene exactamente {world_state,initial_events,rng_state}.
world_state es full_snapshot independiente, time=0, id0987898, posición FREE/NONE,
energía exacta y lifecycle resuelto por <=. rng_state coincide con el stream tras
mapa y una selección next_int; validación, lifecycle y copias no consumen RNG.
validate_initial_events_consistency(state,events) presupone WorldState ya validado
con su configuración; comprueba estado inicial/entidad y eventos, devuelve true
para válido y lanza ContractError("invalid initial_events") para inconsistencia.
No sustituye validate_WorldState ni valida RecordedEvent.

| ID / decisión interna | Comportamiento / justificación | Pruebas / límite |
|---|---|---|
| INIT-G01 — adaptación explícita | World.initialize(seed) llama initialize_world, prepara una copia del snapshot para estado activo y restaura un PRNG en rng_state sin draws; configura id y config inmutable. Devuelve el mismo esquema InitialWorldResult como extensión documentada de la interfaz antes void; el resultado no comparte estado mutable con el WORLD receptor | F2G-10/11/13/20. No añade campo world a la salida canónica, ni segunda generación/lifecycle; consumidores antiguos que ignoran retorno pueden seguir inicializando, sin prometer compatibilidad global |
| INIT-G02 — atomicidad local | Todo se construye temporalmente antes de publicar config/state/rng/id. Se comprueban campos propios escribibles del receptor antes de confirmar. Fallo de primera inicialización conserva state/rng/id nulos; reintento fallido conserva el WORLD anterior íntegro, sin estado parcial nuevo | F2G-14/16–18/21. Registros ordinarios; no rollback global de EXPERIMENT ni protección frente a Proxy hostil |
| INIT-G03 — errores delimitados | Solo ausencia de candidatos genera InitializationError con seed recibida/reason invalid initial_position. Errores de contrato, programación y capacidad conservan clase/identidad; nunca se convierten indiscriminadamente en fallo de posición | F2G-14–18/21. Inyección de RangeError comprueba separación operacional; no es prueba de agotar memoria real |

No se crea Recorder ni se ejecutan acciones, dinámica, agentes o ciclos. La
inicialización crea un estado nuevo time0; no incrementa ni transforma el reloj
del receptor anterior durante planificación. Las asignaciones finales publican
el estado nuevo solo tras éxito completo. No se cambian las políticas ACT/DYN/OBS.

### Correspondencia y ejecución

F2G son IDs locales distintos de T01–T280. El oráculo independiente usa Xorshift
BigInt y recorrido plano con rechazo para selección; se comparan mapa, posición,
conteo de extracciones y estado RNG. Se instrumentan ambas APIs para detectar
expresamente una segunda resolución de lifecycle. No se alteran aserciones previas.

| Obligación | Pruebas nuevas |
|---|---|
| Esquema, estado válido/time0, determinismo y PRNG | F2G-01–04/09/11 |
| ACTIVE antes de resolución, muerte <=, evento único crudo y consistencia cerrada | F2G-05–10/17 |
| Snapshot independiente y equivalencia de adaptador | F2G-12/13/20 |
| Posición ausente, configuración/semilla inválida | F2G-14/15 |
| Atomicidad ante fallos tempranos/tardíos/copia/campo no escribible y errores no envueltos | F2G-16–18/21 |
| Sin Recorder, acciones, dinámica o avance de reloj | F2G-09–11/19 |

En /workspace/yellow, Node.js v24.22.1:

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
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS, 12 FAIL | 1 |
| `git diff --check` | Sin errores | 0 |

**161 pruebas locales aprobadas**, 21 nuevas F2-G, sin omitidas. Legacy antes:
4 PASS/18 FAIL, todas las fallidas en EntityState desde World.initialize. Ahora
10 PASS (T01/T02/T03/T05/T09/T10/T11/T15/T17/T18), 12 FAIL: nueve EffectKind
(T04/06/07/08/13/19/20/21/22), makeResource ausente (T12), makeHazard ausente
(T14), invalid initial_state (T16). T16 reubica la entidad en0,0 sin asegurar FREE
y exige topología toroidal, incompatible con BOUNDED; no se modifica su aserción.
Los fallos actuales alcanzan rutas antes bloqueadas; igual clase/mensaje en T16
no significa que siga fallando la construcción inicial. No se declara regresión
nueva probada ni ausencia global de regresiones a partir del conteo. No se
implementan fixes fuera de alcance para hacer pasar la suite heredada.

### Cierre y riesgos pendientes

INIT-004 resuelta mediante aclaración autorizada y pruebas crudas. TR-002 y
TR-008 resueltas en creación/adaptación inicial; el runner con scripts reales
alcanza consumidores posteriores. Esto no valida navegador/render ni secuencia
canónica de EXPERIMENT. El RECORDER deberá enriquecer y validar RecordedEvent;
EXPERIMENT deberá consumir los eventos iniciales sin volver a resolver lifecycle.
TR-001 continúa parcial: el corpus histórico completo no está incorporado ni leído;
contratos de acciones/subregistros, WLS1, replay e interoperabilidad siguen con sus
riesgos. Contratos/tipos congelados, PRNG, acciones, dinámica, observación, agentes,
renderer, EXPERIMENT y RECORDER y pruebas anteriores se conservan sin cambios.
Archivos del incremento: js/world/world.js, tests/f2-g.test.cjs y este documento.
No surgió un aprendizaje nuevo que requiera modificar ENGINEERING_LEARNINGS.
Sin conformidad global, merge, despliegue ni avance a F2-H/F3.


<a id="f2-h"></a>
## F2-H — eventos operacionales y revisión de ActionResult

### Fuentes contractuales y alcance implementado

Fuente histórica **transmitida por el responsable del proyecto en la orden F2-H,
§§2–3**, recibida en este chat: WorldEvent tiene exactamente type/entity_id/position;
WORLD no añade tick/source/sequence; apply_action no emite ENTITY_DIED;
eventos de acción preceden a lifecycle; RESOURCE_CONSUMED y HAZARD_TRIGGERED son
eventos operacionales definidos. La orden pide emitir ENTITY_MOVED cuando
corresponda y eventos de efectos realmente ejecutados. §4 de v0.2.5 y la
recuperación transmitida reservan el enriquecimiento al RECORDER; §5 separa
apply_action y resolve_lifecycle. VERIFIED: texto recibido y secciones pertinentes
leídas. No se dispone ni se afirma lectura de la copia histórica completa.

Ahora un MOVE aceptado devuelve ENTITY_MOVED en destino; si consume stock1→0,
añade RESOURCE_CONSUMED; si ejecuta el efecto de peligro, añade HAZARD_TRIGGERED.
Stock0 no genera consumo. WAIT no desplaza ni reactiva efectos y devuelve [];
rechazos tampoco generan efectos ni eventos ficticios. No se incorpora
ENTITY_BLOCKED, HAZARD_ENTERED u otro tipo no aportado por la orden.
Cada evento y su posición son objetos nuevos; no comparten coordenadas con el
estado ni con otro evento. El esquema de ActionResult sigue siendo exactamente
{validity,reason,energy_delta,events}; no se añade contexto o metadatos.

### Revisión vigente ACT-P01–06

| ID | Clasificación tras contraste F2-H | Fuente, decisión conservada/cambio y riesgo |
|---|---|---|
| ACT-P01 | Política de ingeniería conservada en esquema/dominios; WorldEvent respaldado por contrato recuperado | La orden no aporta el esquema histórico completo de ActionResult ni nuevas clasificaciones de validity/reason: se mantienen cuatro campos y dominios actuales. WorldEvent de tres campos sí es norma transmitida en F2-H §2. Conformidad histórica completa de ActionResult no demostrada |
| ACT-P02 | Política compatible conservada; obligaciones explícitas F2-H preservadas | Misma disponibilidad energética, costes, rechazo sin mutación y WAIT sin entrada. La orden exige preservar semántica y no inventar desplazamientos/efectos WAIT; no recupera todos los casos históricos de WAIT/energía negativa. Rechazos mantienen events:[] sin inventar catálogo |
| ACT-P03 | Semántica energética conservada; emisión operacional respaldada por F2-H | Coste/ganancia/daño y orden de cálculos intactos. Recurso stock1→0 exige RESOURCE_CONSUMED; activación del peligro exige HAZARD_TRIGGERED. No se reclasifica como histórico el orden aritmético elegido en F2-D. No cambia la dinámica del WORLD |
| ACT-P04 | Provisional events:[] sustituida; esquema/tipos y separación de responsabilidades normativos recuperados | Contratos F2-H §2–3/§18 y §§4/5/13: eventos crudos, efectos reales, sin muerte ni metadatos. Detalles de emisión/orden interno no reproducidos íntegramente quedan explícitos en ACT-H01/02; no se declara cerrado todo TR-001 |
| ACT-P05 | Política de ingeniería conservada | Delta efectivo canonicalize_binary64(final-inicial), sin modificar redondeo ni sumar nominales. La orden exige preservarlo, pero no aporta una definición histórica adicional de su significado |
| ACT-P06 | Preparación/confirmación extendida por obligación explícita F2-H §4 | Se preparan energía, delta y eventos completos antes de verificar escrituras y confirmar posición/energía/stock. Fallo de cálculo o construcción no publica resultado ni cambios parciales. Sigue siendo atomicidad local de registros ordinarios, no transacción global ni protección ante Proxy hostil |

**ACT-H01 — decisión compatible de orden interno y correspondencia.** Se emite
ENTITY_MOVED para cada MOVE aceptado (siempre cambia una coordenada por BOUNDED),
con posición de destino; después va el evento del efecto en ese mismo destino.
Alternativa de ordenar efecto antes de movimiento no se selecciona: la lista
adoptada refleja entrada y efecto posterior sin alterar su ejecución. El texto
aportado confirma acción antes de lifecycle, **no reproduce un orden histórico
interno más detallado**. Por tanto movimiento→efecto se registra como ingeniería,
no como orden histórico demostrado. La implementación no fusiona eventos de
lifecycle ni enriquece; EXPERIMENT/RECORDER deberán preservar las fases al integrarse.
F2H-08 llama las operaciones separadamente para comprobar su frontera, no prueba
un ciclo experimental completo.

**ACT-H02 — activación con magnitud cero.** resource_effect0 no impide consumir
stock1→0, por lo que se emite consumo. hazard_damage0 sigue ejecutando el efecto
de entrada (resta0) y emite HAZARD_TRIGGERED. No se introduce daño ni mecánica
nueva. Distinguir activación de variación numérica evita suprimir un efecto
realmente ejecutado por redondeo/cero. La condición histórica específica de
peligro con daño0 no está reproducida: esta precisión queda como decisión de
ingeniería compatible; WAIT sigue sin activarlo. F2H-05/15 cubren esos límites.

### Preparación transaccional y pruebas

_make_action_event solo construye registros crudos con tipos constantes de estas
ramas, a partir de entidad/destino ya validados. Toda construcción ocurre después
de los cálculos finitos/delta y antes de cualquier escritura. No se modifica la
precedencia ENTITY_NOT_ACTIVE→OUT_OF_BOUNDS→BLOCKED_CELL→INSUFFICIENT_ENERGY,
los costes/efectos, BOUNDED, reloj, lifecycle, RNG o sync. El fallo de asignación
simulado al construir el primer o segundo evento conserva identidad y estado.
La lista parcial interna no se publica si ocurre una excepción.

| Obligación | Pruebas locales F2-H |
|---|---|
| MOVE sin efecto, recurso disponible/agotado, peligro y correspondencia real | F2H-01–05 |
| WAIT y rechazos sin movimiento/consumo/activación ficticios | F2H-06/07 |
| Orden, esquema cerrado, ausencia de muerte y metadatos | F2H-01–08/13 |
| Referencias independientes y determinismo | F2H-09/14 |
| Fallos de construcción/cálculo y stock no escribible sin cambios parciales | F2H-10–12 |
| Reloj/lifecycle/rng_state intactos, sin RNG/Recorder/sync | F2H-08/13/14 |
| Binary64, delta efectivo, ceros y grandes magnitudes preservados | F2H-15 y F2D-09/10/14–27 |

Se migran **solo las expectativas de la política sustituida ACT-P04** en la suite
F2-D: la antigua aserción universal events.length=0 se reemplaza por listas de
tipos explícitas esperadas para MOVE/efectos; WAIT/rechazos siguen exigiendo lista
vacía. Todas las comprobaciones de estado, energía, delta, precedencia y errores
se conservan; los 28 casos siguen presentes. F2-H verifica además los payloads
completos, no solo nombres. No se tocan runner ni aserciones legacy, ni se cambia
un contrato para satisfacerlas. Los otros archivos de pruebas anteriores quedan
idénticos. Los IDs F2H son locales, no tests canónicos T01–T280.

Node.js v24.22.1, ejecución en /workspace/yellow:

| Comando | Resultado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL; expectativas ACT-P04 migradas | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-h.test.cjs` | 15 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS, 12 FAIL, mismas causas que F2-G | 1 |
| `git diff --check` | Sin errores | 0 |

**176 pruebas locales aprobadas**, 15 nuevas F2-H, sin omitidas. Legacy mantiene
nueve errores EffectKind, makeResource/makeHazard ausentes y T16 invalid initial_state;
no certifica ejecución experimental. Las primeras dos expectativas fallidas del
nuevo harness H usaban energía0 con threshold0: la inicialización canónica crea
DEAD correctamente. Se corrigieron esas configuraciones de prueba a threshold-1
para probar entidad ACTIVE sin resurrección ni cambio a lifecycle del producto;
se reejecutaron los casos y la totalidad de suites.

### Continuidad y límites

ACT-P04 sustituida en el alcance transmitido. INIT-004 y cierre de inicialización
F2-G se conservan; no se modifica RECORDER, EXPERIMENT, replay/WLS1, agentes o web.
Siguen pendientes el orden histórico interno no reproducido, la definición
histórica completa de ActionResult y la integración de eventos en trayectorias.
No se declara conformidad histórica completa, conformidad global o interoperabilidad.
Archivos: world.js, action_result.js, tests/f2-d.test.cjs, tests/f2-h.test.cjs y
este estado operacional. ENGINEERING_LEARNINGS no cambia: EL-004 ya cubre la
distinción entre políticas, norma y evidencia. Sin merge, despliegue ni F2-I.


<a id="f2-i"></a>
## F2-I — FeedbackConfig y proyección canónica de Feedback

### Contratos recuperados y cambios

Fuente: **orden F2-I del responsable, §§2–5**, fragmento recuperado de §17 v0.2.4
incorporado por v0.2.5. VERIFIED: contenido transmitido y lectura selectiva de
§§0/4/16/17/19/20/28 y documentación pertinente. No se afirma lectura del documento
histórico completo ni recuperación de detalles que la orden no reproduce.

FeedbackConfig tiene exactamente cuatro booleanos: expose_validity=true,
expose_reason=false, expose_events=false, expose_energy_delta=true. Se implementan
validate_FeedbackConfig y FeedbackConfig._validate en feedback.js; constructor
sin defaults parciales ni conversiones, defaults() exacto e instancia congelada.
Desconocidos, ausentes, heredados en lugar de propios, símbolos extra, accessors y
valores no booleanos se rechazan. Config inválida siempre produce
ContractError("invalid feedback_config"), incluso si no hay acción anterior.

build_feedback(observation,last_action_result,config) devuelve exactamente
{observation,has_prior_action,last_action_result}. Con historial null devuelve
false/null. Con acción anterior válida devuelve true y una proyección de cuatro
campos {validity,reason,energy_delta,events}. No añade flags, nombres legacy,
contexto o estado interno. Se elimina NONE_FEEDBACK, que no era el Feedback cerrado
canónico, y action_validity/action_reason/action_events. No hay compatibilidad
silenciosa con tres flags, historial falsy o el esquema anterior.

### Decisiones técnicas, distintas del contrato histórico transmitido

| ID | Detalle no determinado / alternativas | Decisión y justificación | Evidencia / riesgo |
|---|---|---|---|
| FB-P01 — representación de campos ocultos | Mantener cuatro campos; no inventar estados/motivos/eventos. Omitir claves rompería la forma elegida; reutilizar valor fuente o NONE introduciría fuga/estado artificial | validity y reason deshabilitados son null (ausencia de etiqueta, no nuevo enum); events deshabilitados son []; energy_delta deshabilitado es +0 constante finito. Campos habilitados copian su valor real. La proyección tiene la misma forma, pero etiquetas nullable: no es un ActionResult crudo fabricado ni se debe revalidar como tal | F2I-06–10/18. Marcadores ocultos no están definidos en el fragmento histórico: política compatible, no conformidad histórica de representación demostrada |
| FB-P02 — validación estructural disponible | El texto no aporta todos los subesquemas históricos. Se reutilizan los adoptados y verificados en F2-F/H; no se modifica su productor | Observation cerrada con tick uint64, self id/position/energy y ventana cuadrada impar no vacía de celdas representation/occupied=false. ActionResult crudo cerrado, enums vigentes, delta finito y eventos operacionales de tres campos conocidos. Se validan incluso los campos que serán ocultados; no se agregan inferencias de correspondencia semántica entre validity/reason/eventos ni límites de mapa no disponibles | F2I-13–17. Validación estructural contextual, no aceptación de todo contrato histórico o de RecordedEvent. No acepta ENTITY_DIED dentro del resultado de apply_action |
| FB-P03 — ausencia y copias | Alternativas: admitir falsy/undefined, compartir Observation o copiar solo la lista de eventos | Solo null significa sin acción (coherente con §20.1); undefined/false/0 no sustituyen null. Copias nuevas de Observation completa, self/position, filas/celdas y eventos/posiciones expuestos en cada llamada. Sin referencias a config, resultado fuente o prototipos personalizados | F2I-05/11/12/15/16/18. Más memoria por copia profunda; errores de asignación no se convierten en errores contractuales ni se añade un límite normativo nuevo |

Errores estructurales de Observation/ActionResult usan el mensaje de catálogo
ContractError("world transition failed"); es elección de diagnóstico, no un
mensaje histórico recuperado para esos parámetros. Registros son datos propios,
no getters; huecos/accessors en slots de filas/celdas/eventos se rechazan sin
invocarlos. La función valida config antes de construir salida y devuelve solo
un resultado completo. No valida relación temporal entre observación y acción
anterior: corresponde al ciclo de EXPERIMENT, que aquí no se cambia.

### Propiedad informacional comprobada

Para cada combinación de flags, fijando Observation y los campos habilitados,
variar **solo valores estructuralmente válidos de campos deshabilitados** deja
el Feedback completo idéntico (F2I-09). Los marcadores no dependen del dato oculto;
no se duplican valores en propiedades extra, prototipos, arrays compartidos o
referencias a resultados previos. El contador/lista de eventos deshabilitados no
se traslada al resultado. has_prior_action revela únicamente presencia, por el
contrato, no el valor de campos ocultos. F2I-08/10/11/18 prueban esos canales.

El alcance es no interferencia de la **proyección de entradas válidas**, no ocultar
información que Observation u otros flags habilitan expresamente. Por ejemplo,
reason expuesto puede permitir inferir validity: suprimir reason o inventar un
valor pese a expose_reason=true alteraría la política de flags. No se afirma
eliminar correlaciones semánticas entre datos autorizados ni resistencia de tiempo/
asignaciones; la validación debe examinar también campos ocultos para rechazar
entradas malformadas. Estas distinciones evitan prometer confidencialidad global
más fuerte que la proyección comprobada.

### Ejecución y trazabilidad

Pruebas con Observation y ActionResult reales producidos por WORLD F2-G/H y
build_observation F2-F; no se modifica ninguno de ellos. Oráculo de las 16
combinaciones construido con valores esperados independientes. Se prueban
configuración/defaults/esquemas cerrados, errores de coerción, historial null,
proyección completa y oculta, referencias en ambos sentidos, datos congelados,
determinismo, reloj uint64 BigInt y números binary64 exactos. Math.random lanza
error en el harness, y el PRNG real/WorldState se comparan antes/después.
IDs F2I locales, no T01–T280. Suites anteriores y runner/aserciones legacy intactos.

| Comando (Node.js v24.22.1) | Resultado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-h.test.cjs` | 15 PASS, 0 FAIL | 0 |
| `node tests/f2-i.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS/12 FAIL, mismas causas que F2-H | 1 |
| `git diff --check` | Sin errores | 0 |

**194 pruebas locales aprobadas**, 18 nuevas F2-I; ninguna omitida. Legacy mantiene
nueve EffectKind, makeResource/makeHazard ausentes y T16 invalid initial_state.
Su falta de cambios no acredita integración canónica de Feedback ni aplicación
completa. TR-006 se resuelve para configuración/proyección; TR-007/ExperimentConfig,
consumo por agentes/EXPERIMENT y el corpus histórico restante siguen pendientes.
INIT-004 y TR-008 conservan el cierre alcanzado en F2-G; ACT/OBS/DYN no cambian.
Archivos: js/interface/feedback.js, tests/f2-i.test.cjs y este documento.
ENGINEERING_LEARNINGS permanece intacto: no se añade una nueva regla general.
Sin conformidad global/interoperabilidad, merge, despliegue o inicio de F3.


<a id="f3-a"></a>
## F3-A — núcleo transaccional, terminación y decisiones autorizadas

### Autoridad y recuperación

**NORMATIVE:** v0.2.5 §§4/5/12–15/20/26/31–33 establecen separación de
responsabilidades, orden de transición, propiedad del reloj, precedencia de
muerte y atomicidad del tick. max_ticks=0 está permitido por §19.1. Los métodos
WORLD implementados en F2 se reutilizan sin duplicar sus reglas.

**HISTORICAL:** según la recuperación transmitida por el responsable en el
paquete ejecutivo F3-A, §26.5 v0.2.4 define secuencia y rollback, pero no enumera
campos de TickResult/ConfirmedTickResult; §19 confirma cero, sin límite superior
ni BigInt expresos. No se afirma lectura del documento histórico completo.
La inspección inicial encontró esas lagunas en la transcripción y pidió el
contrato; el paquete posterior las resuelve mediante autorización de ingeniería,
no mediante una transcripción histórica inexistente.

**ENGINEERING DECISION:** F3A-P01–03 fueron aprobadas explícitamente por el
responsable del proyecto en la orden ejecutiva consolidada recibida en este chat,
§§2–4. Las decisiones siguientes implementan ese paquete y no alteran el archivo
canónico. **VERIFIED** identifica ejecución de las pruebas indicadas; la integración
con bucles/Recorder/replay permanece **UNTESTED** en este incremento.

### F3A-P01 — max_ticks, reloj y precondiciones

Laguna: dominio superior/representaciones de max_ticks no recuperados. Alternativas
consideradas: limitar a Number seguro o reflejar uint64 completo; el responsable
aprobó Z∩[0,2^64−1], con Number seguro no negativo o BigInt uint64. Se reutiliza
is_uint64, sin coerción de strings, booleanos, objetos, fracciones o no finitos.
0 y 0n son válidos. Comparación normalizada a BigInt, nunca redondeando a Number.

El incremento se prepara exactamente con BigInt. Number se conserva mientras
el siguiente valor sea seguro; **promoción explícita a BigInt** al cruzar
2^53−1, necesaria para representar el siguiente uint64 sin pérdida. Un reloj
BigInt permanece BigInt. Alternativa de rechazar prematuramente en MAX_SAFE_INTEGER
se descarta porque el dominio aprobado admite valores mayores. En MAX_UINT64
no se incrementa: ya se alcanzó cualquier max_ticks permitido; el helper aritmético
también rechaza overflow independientemente. No hay wraparound ni reducción uint32.
F3A-15/17–23/39 verifican cero, extremos, comparación mixta y representación.

Precondiciones, sin mutación: max_ticks válido primero; config/WorldState/reloj y
entidad seleccionada válidos; no terminal; incremento representable; ranuras de
restauración world.state/world.rng y campos time/PRNG.state escribibles; WorldState
tipado y PRNG nativo de los módulos existentes. DEAD o time>=max_ticks produce
ContractError("world transition failed") antes de ejecutar acción. Config inválida
conserva "invalid world_config", estado inválido "invalid initial_state" y límite
inválido "invalid max_ticks"; no se absorben en la normalización de una transición.
Limitación: no es un adaptador de RNG arbitrarios ni de objetos hostiles Proxy.

### F3A-P02 — TickResult y transición WORLD

Laguna: campos no enumerados históricamente. Frente a concatenar eventos o añadir
snapshot/tiempo, el contrato autorizado selecciona exactamente:

`{action_result, action_events, lifecycle_events}`.

action_result conserva los cuatro campos/valores crudos de apply_action;
action_events es estructuralmente equivalente a action_result.events;
lifecycle_events conserva la lista de resolve_lifecycle. Se copian registros y
posiciones en listas independientes. WorldEvent mantiene exactamente type/entity_id/position, sin tick/source/sequence ni muerte dentro de action_events.
Una sola entidad admite como máximo un evento de muerte por esta resolución.

execute_tick ejecuta apply_action → resolve_lifecycle → advance_dynamics, una vez
cada uno. Valida/copia resultados sin consultar PRNG, modificar time, sincronizar,
construir Observation/Feedback o acceder a agentes/Recorder. Una acción rechazada
sigue siendo un tick con lifecycle y dinámica posteriores. **No ofrece rollback
por sí sola**: la frontera global es execute_tick_transaction. F3A-01/03–07/33/34/
37–40 verifican contrato y comportamiento real. Riesgos históricos ACT/OBS/DYN
anteriores no se convierten aquí en nuevas reglas canónicas.

### F3A-P03 — ConfirmedTickResult y confirmación

Laguna: esquema de salida de la transacción no enumerado históricamente. La
alternativa de devolver referencias vivas se descarta por aislamiento; el contrato
autorizado tiene exactamente seis campos:

`{tick, world_state, action_result, action_events, lifecycle_events, termination}`.

tick es time_before+1 exacto; world_state es snapshot profundo tras dinámica,
reloj y sync; las tres salidas de acción/lifecycle conservan valores/orden crudos.
termination es null, ENTITY_DIED o MAX_TICKS_REACHED, calculada por la función única
sobre estado confirmado, usando lifecycle y dando precedencia a muerte. El
validador recibe esa causa ya calculada: no reevalúa otra vez la terminación.

La transacción captura por separado snapshot previo y estado PRNG interno,
ejecuta execute_tick, escribe el reloj preparado y sincroniza **una sola vez**;
valida WorldState, calcula terminación, construye/copia y valida el resultado
antes de devolverlo. La validación comprueba esquema, igualdad estructural de
listas, tiempo exacto incluso con representaciones distintas, consistencia de
lifecycle al final de este tick, snapshot igual al estado activo y realmente separado
en grid/filas/celdas/efectos/mapa/entidad/posición, y rng_state sincronizado.
F3A-02/08–10/13/14/24–38 verifican estas invariantes.

La confirmación incluye construcción y validación del snapshot/resultado. Un
fallo en acción, lifecycle, dinámica, sync, estado o resultado restaura
world.state desde la copia y la referencia original PRNG con su estado interno
capturado, y lanza ContractError("world transition failed"). Se captura el método
nativo de restauración antes del tick; no se confía en un RNG reemplazado por la
fase que falla. No se usa el rng_state persistido como sustituto del PRNG interno:
pueden diferir antes del punto único de sync. F3A-31 prueba exactamente ese caso.

El rollback prescrito restaura **datos estructurales**, no la identidad del objeto
WorldState previo ni sus descriptores; clientes deben conservar full_snapshot,
no aliases al estado mutable durante una transición. No se prometen restauración
de referencias externas retenidas al objeto que falló, efectos laterales externos,
mutaciones arbitrarias de configuración/prototipos o congelación maliciosa a mitad
de ejecución. Los métodos WORLD reales no realizan esas operaciones. No se
introduce una transacción de agentes o Recorder. Fallos al preparar snapshots,
antes de empezar, se normalizan sin ejecutar ni publicar una transición.

### Ubicación, carga y frontera futura

Implementación y validadores específicos en **js/experiment/tick_transaction.js**.
Es un script clásico independiente, que debe cargarse después de WORLD, Action y
ActionResult. Las pruebas lo cargan explícitamente después de esos scripts.
**No se añade al HTML ni se cambia la interfaz web**; el futuro incremento que
integre EXPERIMENT deberá conectarlo. Experiment.run/run_without_agent quedan
idénticos al main base, al igual que WORLD, PRNG, contratos previos, Recorder,
agentes, renderer, hashes y suites anteriores. No hay segunda implementación de
acciones/lifecycle/dinámica ni registro antes de confirmar.

TR-005 y TR-010 parcialmente resueltas solo para el núcleo: secuencia/rollback y
precisión temporal verificadas. La sustitución de bucles legacy, tres puntos de
evaluación terminal del ciclo completo y uso por RECORDER permanecen UNTESTED.
ExperimentConfig no cambia: su incompatibilidad con cero/BigInt sigue en TR-007,
aunque el kernel ya acepta el dominio autorizado. INIT-004/TR-008 no se reabren.

### Matriz de evidencia ejecutada

| Grupo / requisito | Casos locales | Evidencia |
|---|---|---|
| P02/P03, listas separadas, esquemas/eventos crudos | F3A-01–05 | Validadores reales, payloads sin metadatos; rechazo de listas divergentes, campos extra, snapshots incorrectos/compartidos |
| Orden y punto temporal de confirmación | F3A-06–10 | Energía vista por lifecycle, DEAD y stock0 vistos por dinámica, reloj viejo/nuevo, sync único y error posterior |
| Precedencia terminal y no iniciar en terminal | F3A-11–16 | ACTIVE con energía negativa no se declara DEAD; DEAD con energía alta sí; cero y coincidencia muerte/límite |
| P01 y uint64/Number/BigInt | F3A-17–23 | Cruce de MAX_SAFE_INTEGER, BigInt grande, datos inválidos sin coerción, máximo uint64 y overflow |
| Rollback y no publicación parcial | F3A-24–32 | Fallos tras operaciones reales, corrupción/alias de snapshot, error de asignación inyectado, restauración de todo WorldState y PRNG reemplazado |
| Transiciones e independencia | F3A-33–40 | Muerte por peligro, recurso consumido/regenerado tras muerte, snapshots en ambos sentidos, ledger energético esperado, sin Recorder/Agent/Observation/Feedback |

Node.js v24.22.1, /workspace/yellow. Los IDs F3A son locales y no sustituyen
T01–T280. No se modificaron tests anteriores ni aserciones/runners heredados.

| Comando | Resultado | Exit |
|---|---|---|
| `node tests/f3-a.test.cjs` | 40 PASS, 0 FAIL | 0 |
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-h.test.cjs` | 15 PASS, 0 FAIL | 0 |
| `node tests/f2-i.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS/12 FAIL, sin diferencias respecto a F2-I | 1 |
| `git diff --check` | Sin errores | 0 |

Total VERIFIED: **234 pruebas locales aprobadas**, 40 nuevas F3-A, sin omitidas.
Legacy conserva nueve EffectKind, makeResource/makeHazard ausentes y T16 invalid
initial_state; no ejecuta el kernel nuevo porque los bucles no se migran aquí.
Estos resultados no acreditan conformidad global, replay o interoperabilidad.
Archivos: tick_transaction.js, tests/f3-a.test.cjs, IMPLEMENTATION_STATUS.md y una
entrada generalizable EL-006 en ENGINEERING_LEARNINGS.md. Sin merge, despliegue
ni F3-B.


<a id="f3-b"></a>
## F3-B — ExperimentConfig y contrato de integración preparado

### Implementación y contraste de autoridad

NORMATIVE / orden F3-B: esquema cerrado exactamente experiment_seed, max_ticks,
world_config, feedback_config, agent_type. Semilla Number uint32 no nula sin
truncamiento; WORLD y Feedback válidos según sus validadores existentes.
F3A-P01 es ENGINEERING DECISION autorizada previamente: max_ticks matemático
[0,2^64−1], Number seguro no negativo o BigInt uint64, incluidos 0/0n. Se utiliza
el **mismo is_uint64** que tick_max_ticks; el constructor conserva valor y tipo,
incluso -0 Number permitido como cero. No convierte límites a Number ni semillas
con >>>0. VERIFIED por lectura y F3B-02–08/15/18.

Se añaden validate_ExperimentConfig (predicado completo) y ExperimentConfig._validate
en experiment_config.js. El constructor captura WorldConfig y FeedbackConfig en
instancias nuevas congeladas, aceptando solo registros/instancias que ya cumplen
sus esquemas exactos. Después congela los cinco campos exteriores. No hay defaults
parciales, reparación de legacy ni referencias a configuraciones mutables fuente.
Identidad reproducible significa valores y representación conservados, no igualdad
de referencias de objetos. F3B-01/11/12/14 verifican cierre e inmutabilidad.

La función histórica inspect_ExperimentConfig_defined_fields de F1-B permanece
**parcial, complete:false**, y no sustituye al nuevo predicado/constructor. Sus
pruebas previas siguen intactas; no se altera structures.js ni un validador WORLD.

| Decisión técnica | Laguna / alternativas y comportamiento | Evidencia / límite |
|---|---|---|
| F3B-P01 — agent_type | §19 enumera el campo y §20.1 lo utiliza como namespace de derive_seed y argumento de agent_factory; §28.1–4 remiten a v0.2.4 sin reproducir gramática. Agent base solo exige reset/step. Se elige string Unicode válido no vacío como identificador mínimo; se descartan enum del registro legacy y regex/trim/NFC no fundamentados. Se aceptan nombres no registrados, mayúsculas/caracteres no ASCII, espacios y otros caracteres Unicode válidos sin normalizarlos | F3B-09/10/13/17. No vacío es una precisión de ingeniería, no cláusula histórica recuperada. Gramática histórica completa no disponible; aceptación de config no garantiza factory/agent disponible |
| F3B-P02 — captura anidada | Alternativas: exigir instanceof/referencias compartidas o validar valores y copiar. Se validan exactamente los contratos WORLD/Feedback y se construyen instancias canónicas independientes, preservando todos sus valores binarios/booleanos | F3B-07/08/11/14/18. No se convierten datos inválidos en válidos ni se debilitan los constructores anidados |
| F3B-P03 — diagnóstico | No hay invalid experiment_config en el catálogo §26.6. Para esquema/semilla/identificador inválidos se utiliza ContractError("world transition failed"); max_ticks usa invalid max_ticks y anidados conservan invalid world_config/invalid feedback_config | F3B-01–10. Mensajes son decisión de diagnóstico, no transcripción histórica del error de cada campo |

No se afirma lectura del documento histórico v0.2.4 completo. El contraste usa el
fragmento canónico disponible, las reglas recuperadas transmitidas anteriormente
y el alcance de esta orden. El código AGENT_REGISTRY no adquiere autoridad:
"wait/random/rule" son disponibilidad legacy, no el dominio canónico de agent_type.
No se crea agente, RNG ni Recorder al validar/capturar configuración; no se deriva
semilla nueva en el constructor. La derivación futura conserva los bytes exactos
del identificador; é y e+acento combinante pueden producir semillas distintas.

### Secuencia de orquestación futura — documentada, no implementada

1. Validar/capturar ExperimentConfig completo; derivar world_seed con namespace
   "world" y agent_seed con agent_type, sin normalizar su texto; tomar radio configurado.
2. Inicializar una sola vez mediante la ruta F2-G. Uso propuesto del adaptador
   existente: crear World(config.world_config) y llamar world.initialize(world_seed),
   que llama **una sola vez initialize_world** y devuelve InitialWorldResult mientras
   conserva estado activo separado. No llamar ambas APIs consecutivamente en el
   ciclo: duplicaría generación. F3B-16 compara ambas como oráculo, no es un bucle.
3. Tras inicialización confirmada, RECORDER deberá recibir el snapshot inicial y
   los WorldEvent iniciales para enriquecerlos como lifecycle/tick0/sequence desde0.
   Esto es registro inicial, no escritura de un step antes de su transacción. No
   volver a resolver lifecycle. InitializationError de posición debe registrarse
   fuera de Trajectory; otros errores no se convierten en invalid initial_position.
4. Crear agente con factory y agent_seed; reset una vez; last_action_result=null.
   Evaluar terminación inicial mediante determine_termination. Si está terminal,
   no pedir acción ni producir tick; conservar registro inicial aun con max_ticks0.
5. Al inicio de cada iteración, consultar la misma función terminal. Si continúa:
   construir Observation en T antes de acción/reloj/dinámica; build_feedback recibe
   esa observación, el resultado crudo previo y FeedbackConfig. El agente recibe
   la proyección copiada, nunca referencias al WORLD o al resultado crudo previo.
6. agent.step; comprobar estructura de Action sin confundirla con reconocimiento
   del enum. Errores del agente/estructura aplican §20.6 sin iniciar transición.
   execute_tick_transaction realiza acción/lifecycle/dinámica/reloj/sync; el bucle
   no ejecuta ninguno de esos pasos por separado ni añade muerte a ActionResult.
7. Solo tras obtener ConfirmedTickResult válido, llamar a la futura frontera
   record_step(confirmed, observation, feedback, action). Después conservar
   confirmed.action_result como fuente cruda de feedback siguiente y respetar
   confirmed.termination, calculada en el punto final de la transición por la
   función normativa única. No duplicar precedencia con comparaciones energéticas.

Los puntos terminales son inicial/antes del bucle, inicio de iteración y fin de
transición confirmada. El kernel además defiende su precondición contra llamadas
en WORLD terminal; no se reescribe esa lógica en el orquestador. En modo sin agente,
§20.2 usa WAIT, observation=null y feedback=null; Action y ActionResult siguen
presentes y pasan por la misma transacción. No se añade un flag de modo a config.
Este diseño no migra run/run_without_agent ni añade un adaptador provisional.

### Frontera RECORDER: datos exactos a recibir

Corte F3-B: source/domain/entity_states se precisaron después en [F3-C](#f3-c),
solo en rama. Este diseño futuro no acredita su integración con EXPERIMENT.

La llamada lógica futura record_step(confirmed, observation, feedback, action)
está indicada por §20.1; la firma legacy de seis argumentos no es compatible.
La tabla define entradas y propiedad de datos, no una nueva implementación de
StepRecord ni de sus hashes/serialización.

| Entrada | Dato recibido / obligación del receptor |
|---|---|
| confirmed.tick | T+1 exacto y numéricamente igual a confirmed.world_state.time; no convertir BigInt a Number con pérdida |
| confirmed.world_state | Snapshot completo posacción/lifecycle/dinámica/reloj/sync; copiar para propiedad interna del Recorder. No volver a sincronizar ni escribir rng_state, no pedir estado vivo al WORLD |
| confirmed.action_result | Los cuatro campos crudos originales, incluidos sus WorldEvent; conservar valores y copia profunda, sin añadir ENTITY_DIED ni sustituirlos por Feedback ocultado |
| confirmed.action_events | Fuente única para enriquecer eventos de acción de ese step, en orden. Su igualdad con action_result.events no justifica registrarlos dos veces |
| confirmed.lifecycle_events | Eventos crudos separados; enriquecer después de action_events, sin llamar a resolve_lifecycle ni reconstruir muerte por energía |
| confirmed.termination | null/ENTITY_DIED/MAX_TICKS_REACHED, para finalizar o continuar sin nueva regla terminal. No se añade por ello un campo nuevo a StepRecord |
| Observation | Copia independiente previa, tick=T; self/local_view ya proyectados. null solo en modo sin agente |
| Feedback | Copia independiente de los tres campos F2-I, con proyección del resultado anterior conforme a flags. null solo sin agente; no es fuente del ActionResult crudo actual |
| Action | Registro cerrado {type} seleccionado para el tick, copia independiente; presente también para WAIT/sin agente |

RECORDER será el único que añada tick=T+1, source y sequence, conservando orden
acción→lifecycle. Los literales source="action"/"lifecycle" para eventos de step
son una propuesta de interfaz, no cláusula histórica recuperada aquí: el catálogo
completo debe contrastarse al implementar Recorder. El caso inicial sí está
aclarado por INIT-004: tick0/source lifecycle, contador según §§21.2/21.5.
StepRecord exige listas RecordedEvent de
acción y lifecycle por separado (§22), sin re-enriquecer entradas ya registradas.
Guardar snapshots/entradas en propiedad del Recorder requiere copias profundas
(o una política de transferencia inmutable explícita futura), nunca aliases a
estados transitorios ni al WORLD. La escritura propia del Recorder debe ser
atómica conforme a su contrato; aquí no se implementa RecordTransaction.
state_hash_world/full y entity_states deberán derivarse del snapshot confirmado
según sus contratos; no se selecciona WLS1/bytes/hash alternativo para conectar
prematuramente el ciclo.

### Incompatibilidades pendientes y auditoría focalizada

Evidencia del corte F3-B: las líneas de Recorder siguientes pertenecen a su
versión legacy en main; no describen el Recorder reemplazado en la rama F3-C.
Para pendientes vigentes usar [TR](#tr-vigentes).

| Archivo / evidencia | Impacto observado | Decisión en F3-B |
|---|---|---|
| experiment_config.js: validación usa is_uint64; tick_transaction.js: tick_max_ticks usa el mismo predicado; F3B-04–06/15/18 | Mismo dominio F3A-P01, sin conversiones de límites; cero no implica que el bucle legacy ya sea canónico | VERIFIED configuración/núcleo; mantener bucles intactos |
| experiment_config.js: semilla validada y asignada directamente; F3B-02/03/12/18 | No truncamiento a uint32 ni reparación de entradas; vectores se conservan | VERIFIED; no alterar derive_seed ni PRNG |
| world_config.js/structures.js/feedback.js sin diff; F3B-07/08/11/14 | Se reutilizan sus validadores y copias congeladas; no se amplía aceptación de WORLD | VERIFIED por diff/pruebas; constructor propio, no dependencia inversa |
| experiment_config.js sin AGENT_REGISTRY, imports de kernel/Recorder o creación RNG; F3B-09/17 | Sin dependencia circular. Config válida puede tener un identificador aún no resoluble por factory | VERIFIED aislamiento; política/error de factory desconocida es decisión futura, no una nueva restricción de configuración |
| recorder.js:18–20 firma antigua y escritura en world_state.rng_state | No recibe ConfirmedTickResult y trata el snapshot como entrada mutable | No invocar como integración provisional; migración posterior, sin cambiar Recorder aquí |
| recorder.js no define record_initial_lifecycle_from_world ni record_initialization_failure | Faltan recepción de muerte inicial validada y registro de fallo fuera de Trajectory exigidos por §20 | Resolver interfaz inicial de Recorder antes de migrar bucle; no llamar record_death_event_if_needed como sustituto artificial |
| recorder.js:34–53 retiene observation/feedback/action/action_result y solo itera ActionResult.events | Riesgo de aliases; faltan listas separadas, source y sequence. Muerte separada con position:null en :57–65 | Definir recepción por copia y enriquecimiento exclusivo; no inventar muerte ni duplicar eventos |
| recorder.js:22/23 y §22/§34 | Hashes legacy no demuestran WLS1. §22 llama tick "entero seguro ≥0" mientras F3A-P03 permite uint64 BigInt, incluso >MAX_SAFE_INTEGER | Aclarar dominio/representación de StepRecord/RecordedEvent y serialización al migrar Recorder; no restringir F3A-P01 ni convertir BigInt para ocultar la diferencia |
| experiment.js: reloj/dinámica antes de observación y muerte añadida a ActionResult | No puede declararse integrado con núcleo/Feedback canónicos porque config ya valide | Ciclo permanece UNTESTED como implementación canónica; sustituir en alcance posterior |

La frontera documentada evita entregar referencias activas, pero su cumplimiento
por RECORDER sigue **UNTESTED**: no hay un mock de integración que se presente como
conformidad real. La política de aceptación de identificadores y los dominios de
registro grandes requieren contraste/decisión posterior. No se interpreta una
limitación de hash/registro como permiso para reducir el dominio temporal aprobado.

### Evidencia ejecutada

Node.js v24.22.1, /workspace/yellow. F3B son pruebas locales, no T01–T280.

| Comando | Resultado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-h.test.cjs` | 15 PASS, 0 FAIL | 0 |
| `node tests/f2-i.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f3-a.test.cjs` | 40 PASS, 0 FAIL | 0 |
| `node tests/f3-b.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS/12 FAIL; mismas causas previas | 1 |
| `git diff --check` | Sin errores | 0 |

**252 pruebas locales aprobadas**, 18 nuevas F3-B, sin omitidas. Legacy conserva
nueve EffectKind, makeResource/makeHazard ausentes y T16 invalid initial_state.
No se cambian expectativas ni suites anteriores. VERIFIED F3B-01–18: cierre,
semillas, límites, configuraciones inválidas, identificadores, copias inmutables,
identidad de semillas/Unicode y compatibilidad estructural real con F3-A.
TR-007 se resuelve en configuración local bajo F3B-P01; TR-005/010 mantienen sus
pendientes de ciclo/serialización. INIT-004/TR-008 siguen como en F2-G.
Archivos: experiment_config.js, tests/f3-b.test.cjs y este documento.
No se modifica ENGINEERING_LEARNINGS: EL-001/004/006 ya cubren los hallazgos
pertinentes. Sin conformidad global/interoperabilidad, merge, despliegue ni F3-C.


<a id="f3-c"></a>
## F3-C — RECORDER: capacidad A implementada, capacidad B bloqueada

**Solo rama, sin integrar en main.** Corte F3-C original: 2026-11-06.
Esta sección conserva la evidencia de
`0a6e245b930698b62ac25a34bf539f3828be20a0`, contrastada en DOC-02. Consultar el
[Recorder F3-C](https://github.com/ksgfin8-cyber/yellow/blob/0a6e245b930698b62ac25a34bf539f3828be20a0/js/experiment/recorder.js)
y sus [22 pruebas](https://github.com/ksgfin8-cyber/yellow/blob/0a6e245b930698b62ac25a34bf539f3828be20a0/tests/f3-c.test.cjs).
Los métodos nuevos descritos debajo no pertenecen al Recorder de main.

### Autoridad y corrección recibida

Fuente: orden F3-C y posterior **«Resolución contractual y continuación autorizada»**
del responsable, recibida en este chat. HISTORICAL transmitido: RecordedEvent cerrado
{type,entity_id,position,tick,source,sequence}; source=action para efectos de acción,
source=lifecycle para lifecycle/iniciales; initial tick0 y secuencia global desde0;
StepRecord.tick Number entero seguro no negativo; entity_states mapa de una entrada
con id/position/energy/lifecycle. No se afirma lectura del archivo v0.2.4 completo.

La equivalencia de tres nulos de la primera orden era incompatible con P0-3/§22.
Corrección autorizada: observation=null ⇔ feedback=null, **action y action_result
siempre presentes**; modo sin agente usa Action={type:"WAIT"} y ActionResult de
WAIT realmente ejecutado. No se restaura el null legacy ni se inventa un resultado.

**A — VERIFIED localmente:** registro inicial, recepción de eventos crudos o
RecordedEvent iniciales, secuencias provisionales y preservación de replay,
InitializationFailure, copias independientes, preparación pura de primer paso
confirmado y publicación atómica de operaciones iniciales.
**B — BLOQUEADA / UNTESTED:** StepRecord completo y su confirmación atómica, por
falta de funciones WLS1/hashes canónicos verificados. La resolución autoriza A y
preparación de frontera B, no completar B con sustitutos. F3-C sigue **parcial**.

### Políticas y dominios

| ID / autoridad | Implementación / decisión | Pruebas y límites |
|---|---|---|
| F3C-P01 — ENGINEERING DECISION autorizada | RecordedEvent.tick y sequence son Number enteros seguros >=0; ningún string, booleano, fracción, BigInt o Number inseguro en eventos ya registrados. Límites superiores no están explicitados históricamente. StepRecord.tick Number seguro sí es HISTORICAL | F3C-07/14/17. F3-A/B uint64 no se modifican; tick grande se rechaza controladamente, no se redondea |
| F3C-P02 — representación compatible autorizada | entity_states usa Map, exactamente una entrada del snapshot; valores cerrados id/position/energy/lifecycle, posición independiente y binary64 conservado | F3C-15/19. Se prepara como dato interno, no se publica StepRecord sin hashes |
| F3C-P03 — precisión técnica de frontera | ConfirmedTickResult.tick BigInt <=MAX_SAFE_INTEGER se convierte explícitamente y sin pérdida a Number de registro; snapshot.time conserva su tipo. BigInt mayor se rechaza. El último sequence permitido MAX_SAFE_INTEGER puede prepararse; el puntero interno next pasa exactamente a 2^53n, y cualquier siguiente emisión se rechaza antes de publicar | F3C-14/17. Ese puntero BigInt interno no es un RecordedEvent.sequence ni amplía el dominio autorizado. Un lote vacío no consume secuencias |
| F3C-P04 — preparación interna y publicación | _prepare_step devuelve un wrapper técnico con snapshot/contexto/eventos/entity_states/sequence_after; no tiene hashes ni forma/nombre de StepRecord. No muta el Recorder ni consume contador. record_step valida/prepara y termina siempre con ContractError("recording failed") mientras B esté bloqueada | F3C-15–22. No hay hash nulo/cero/ficticio, API de hash de prueba o éxito parcial |

### Registro inicial y fallo de inicialización

record_initial_state valida WorldState efectivo time0 y conserva una copia profunda;
no recibe WORLD vivo ni RNG. record_initial_lifecycle_from_world reutiliza la
validación cruda INIT-004 y enriquece solo una vez: ACTIVE→[], DEAD→un ENTITY_DIED
coherente con id/posición. El único asignador de source/tick/sequence es
_prepare_events; inicial usa tick0/lifecycle/sequence0, contador siguiente0 o1.
No se llama a resolve_lifecycle ni se deduce muerte por energía.

record_initial_lifecycle_from_recorded valida los seis campos, tipos/dominios,
tick0/lifecycle, orden desde0 y coherencia inicial. Copia **exactamente los valores
de entrada** sin volver al enriquecedor. Lista vacía deja sequence_counter=0;
lista no vacía obtiene último sequence+1 (lista creciente), sin max([]). WORLD
v0.2.5 tiene una entidad: solo son admisibles [] o una muerte inicial, no eventos
adicionales ni duplicados. Se rechaza registrar el lifecycle inicial dos veces.

record_initialization_failure usa el esquema de **§20.5 v0.2.5**, que incluye cuatro
campos, no solo tres: {seed,reason,message,experiment_config}. Acepta InitializationError
real con reason="invalid initial_position", captura config validada como datos
planos independientes y conserva números/BigInt sin una conversión de persistencia
inventada. Mantiene el fallo fuera de Trajectory; finalize en un Recorder con
fallo se rechaza. No transforma errores de memoria/programación/contrato en
fallos de posición. El formato/encoding persistente externo no se implementa.

finalize solo exporta el caso inicial ya registrado, sin pasos. Copia config,
snapshot y eventos para no compartir referencias; la causa terminal se recibe
del orquestador, sin resolver lifecycle. Se conserva metadata legacy versionv0.1,
sin atribuirle conformidad canónica. La muerte inicial puede producir una
trayectoria sin pasos ni hashes de StepRecord; no se fabrica una trayectoria
exitosa para InitializationFailure.

### RecordTransaction e integridad

La clase RecordTransaction captura las ranuras propias escribibles del Recorder,
prepara/valida el estado completo antes de publicar y confirma mediante reemplazos
de campos/arrays. No modifica en sitio las listas previamente poseídas. Ante
fallo de preparación, validación o publicación restaura las referencias/valores
previos de initial_state, steps, events, contador, flags, fallo y causa. Los tests
inyectan error tras escrituras parciales, incluida la última, y verifican igualdad
anterior/posterior. Se verifican operaciones iniciales con steps vacío; **no** se
presenta eso como atomicidad de StepRecords completos todavía inexistentes.

Los helpers son internos, no puntos de extensión para código hostil que modifique
arrays previos en sitio, proxies o descriptores durante commit. Entradas de usuario
se copian y no pueden mutar el contenido retenido mediante referencias de retorno.
Errores de registro públicos se normalizan a ContractError("recording failed");
la validación de ExperimentConfig en el constructor conserva sus diagnósticos.

### Preparación de B y bloqueo WLS1

_prepare_step acepta la forma ConfirmedTickResult real F3-A sin consultar un WORLD
activo. Reutiliza validate_TickResult/copiadores de F3-A y los subesquemas de
Observation/Feedback vigentes. Valida tick representable, continuidad desde el
estado inicial registrado, equivalencia de listas de acción, lifecycle y
correspondencia de id/posición; copia snapshot/contexto y construye entity_states.
Valida contexto previo tick=T y nulabilidad corregida. Para modo sin agente exige
WAIT no nulo y sus eventos de acción vacíos; los tests pasan el resultado de una
transacción real WAIT, no una reconstrucción en Recorder.

Los lotes provisionales mantienen orden acción→lifecycle y encadenan el siguiente
contador, incluso entre ticks, sin consumirlo en el Recorder. Hoy solo puede
prepararse el primer paso coherente con el prefijo inicial: no hay historial de
pasos confirmados mientras falten hashes. Ampliar el validador de publicación a
StepRecords completos y su continuidad será parte de B. No se ejecutan acciones
para comprobar procedencia: el llamador debe entregar la transacción real, y la
verificación de replay no se introduce aquí.

record_step no publica ni devuelve StepRecord: rechaza con recording failed aun
si la preparación es válida. Se elimina la escritura legacy sobre rng_state y
el uso de STATE_HASH_WORLD/FULL/serialize_world_state en Recorder. hash_state.js
permanece intacto: concatena texto y omite lifecycle, no implementa §34; tampoco
se corrigen sus referencias EffectKind en este incremento. No se llaman hashes
legacy ni se introducen hashes de prueba para pasar tests. Un error de registro
no revierte el WORLD ya confirmado: la atomicidad aquí afecta al Recorder, no
usurpa la transacción EXPERIMENT.

La preparación requiere cargar el script F3-A, además de configuración, WORLD,
ActionResult, Observation y Feedback. Las pruebas lo cargan explícitamente;
no se modifica HTML ni se conecta el bucle heredado. Las operaciones iniciales
no necesitan el kernel ni usan RNG. El helper legacy de muerte ad hoc se rechaza
en lugar de fabricar un segundo evento. Trajectory, hashes, F3A-P01–03,
ExperimentConfig, agentes y bucles EXPERIMENT permanecen sin cambios.

### Evidencia ejecutada y pendiente

| Casos locales | Propiedades verificadas |
|---|---|
| F3C-01–06 | Copia inicial, RecordedEvent cerrado, muerte tick0, replay vacío/no vacío, valores preservados y no reenriquecimiento |
| F3C-07/08 | Dominios de source/tick/sequence, secuencias iniciales desde0, coherencia y rechazo de duplicados/entradas malformadas |
| F3C-09/10 | InitializationFailure de cuatro campos fuera de Trajectory; ausencia de éxito ficticio o error de posición inventado |
| F3C-11/12 | Errores reales de preparación/allocación y publicación parcial, rollback conjunto de datos/contador/flags iniciales |
| F3C-13/14 | Orden provisional global, último sequence seguro, contador siguiente exacto y overflow rechazado |
| F3C-15–18 | ConfirmedTickResult real, Map con lifecycle, orden movimiento/peligro/muerte, BigInt seguro y nulabilidad/WAIT corregidos |
| F3C-19–22 | Independencia, ausencia de hashes/StepRecords publicados, validación de contexto y 16 proyecciones de Feedback, pureza/determinismo/sin WORLD/RNG |

Node.js v24.22.1, /workspace/yellow. IDs F3C locales, no T01–T280. Ninguna prueba
anterior ni expectativa legacy se modifica.

| Comando | Resultado | Exit |
|---|---|---|
| `node tests/f1-a.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f1-b.test.cjs` | 12 PASS, 0 FAIL | 0 |
| `node tests/f2-a.test.cjs` | 14 PASS, 0 FAIL | 0 |
| `node tests/f2-b.test.cjs` | 13 PASS, 0 FAIL | 0 |
| `node tests/f2-c.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-d.test.cjs` | 28 PASS, 0 FAIL | 0 |
| `node tests/f2-e.test.cjs` | 16 PASS, 0 FAIL | 0 |
| `node tests/f2-f.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f2-g.test.cjs` | 21 PASS, 0 FAIL | 0 |
| `node tests/f2-h.test.cjs` | 15 PASS, 0 FAIL | 0 |
| `node tests/f2-i.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f3-a.test.cjs` | 40 PASS, 0 FAIL | 0 |
| `node tests/f3-b.test.cjs` | 18 PASS, 0 FAIL | 0 |
| `node tests/f3-c.test.cjs` | 22 PASS, 0 FAIL | 0 |
| `node tests/f1-a-legacy.cjs` | 10 PASS/12 FAIL, causas actualizadas abajo | 1 |
| `git diff --check` | Sin errores | 0 |

Total: **274 pruebas locales aprobadas**, 22 nuevas F3-C, sin omitidas. Legacy
conserva el conteo10/12, pero **cambia cinco causas**: T06/T07/T08/T20/T22 ahora
fallan recording failed al alcanzar la interfaz retirada/bloqueada; T04/T13/T19/T21
siguen EffectKind; T12 makeResource, T14 makeHazard y T16 invalid initial_state.
No se presenta igualdad de conteos como ausencia de regresión o compatibilidad
legacy. El rechazo es deliberado, sin adaptador provisional a hashes no canónicos.

**UNTESTED/BLOQUEADO:** StepRecord completo de §22, publicación de pasos con hashes
WLS1, su atomicidad conjunta completa y secuencias entre pasos publicados; hashes,
replay completo e integración Experiment.run/run_without_agent. La ingestión de
eventos iniciales de replay no equivale a implementar replay. No se declara F3-C
totalmente conforme, WLS1 verificado o interoperabilidad. INIT-004/TR-008 permanecen
resueltos para WORLD; el límite de registro no reduce max_ticks ni cambia F3-A.
Archivos: recorder.js, tests/f3-c.test.cjs, este documento y EL-007 de aprendizajes.
Sin merge, despliegue ni inicio de F3-D.

<a id="integracion-f3-c"></a>
## Integración F3-C sobre DOC-02 y frontera de F3-D

**Corte 2026-11-10 (America/Guayaquil). VERIFIED por Git y ejecución:**
main remoto utilizado `2846a8560c00daef85d91c9a9feffa7456862039` (PR #16, DOC-02);
F3-C anterior `0a6e245b930698b62ac25a34bf539f3828be20a0`; base común
`b00a50ebcc25f2a0d3e3abe4cc5eb2b1b64a79b8`. main aportaba solo cambios documentales.
Se incorporó main **a la rama F3-C**, no F3-C a main, mediante merge
`cccb7b4b6cc80f4a22a30c14ac66476063946df4`, con ambos padres recuperables.
La corrección y esta evidencia se añaden después del merge, en la misma rama.

Hubo conflictos únicamente en IMPLEMENTATION_STATUS y ENGINEERING_LEARNINGS:
cabeceras/alcance, estado Recorder, tabla TR e introducción F3-C, además de EL-007.
Se resolvió cada bloque con la versión consolidada DOC-02, que ya conservaba la
evidencia F3-C y añadía navegación/procedencia. Antes de la corrección, ambos
documentos quedaron idénticos a main; Recorder y las 22 pruebas F3-C quedaron
idénticos a la rama original. No se sustituyó ningún documento por una versión
anterior ni se perdió evidencia. No hubo conflicto en código, pruebas o norma.

**Estado vigente:** RECORDER sigue **PARCIAL**, capacidad A disponible solo en rama
F3-C; B/StepRecord completo sigue bloqueado por WLS1. main tiene documentación
DOC-02, no esta implementación. Se conservan source/tick/secuencias, copias y
atomicidad inicial; nulabilidad observation⇔feedback, WAIT real y ActionResult
presente; separación uint64/Number seguro y prohibición de hashes legacy/ficticios.
F3C-01–22, incluido F3C-20, vuelven a comprobar esas fronteras. La publicación de
esta rama para revisión no equivale a merge ni conformidad global.

### Corrección focalizada del siguiente contador

**VERIFIED por lectura/cálculo:** la expresión anterior del replay inicial
`last_sequence + 1` producía Number 9007199254740992 al recibir MAX_SAFE_INTEGER:
esa suma particular es exacta, pero el resultado es un **Number inseguro**, y
sumarle 1 de nuevo ya colapsa al mismo valor. F3C-P03 conserva el siguiente
contador interno como BigInt al cruzar el límite, manteniendo sequence de cada
RecordedEvent como Number seguro.

La ruta pública actual exige secuencia inicial desde0 y solo [] o una muerte;
por ello **no se demostró un fallo observable con entradas iniciales válidas**.
Un evento inicial con sequence=MAX_SAFE_INTEGER se rechaza por coherencia antes
de confirmar; no se relaja esa validación para alcanzar una rama de prueba.

Se extrae el cálculo interno `recorder_sequence_after` y se usa en
record_initial_lifecycle_from_recorded: entrada Number seguro no negativa,
BigInt(sequence)+1, retorno Number mientras sea seguro y BigInt después. Vacío
sigue dejando contador0. Es una precisión local de **ENGINEERING DECISION
F3C-P03 ya autorizada**, no un dominio histórico nuevo ni cambio en F3-A/P01.
Alternativa de rechazar el último valor seguro en el cálculo no se elige: conservar
su siguiente contador exacto mantiene la política existente del enriquecedor.
No se añaden otras correcciones preventivas.

- [F3C-23](../tests/f3-c.test.cjs): el evento con último MAX_SAFE_INTEGER cumple
  el esquema genérico, pero replay inicial lo rechaza sin mutar Recorder/WORLD/RNG.
- F3C-24: alcanza el cálculo realmente usado por replay en 0, MAX_SAFE−1 y MAX_SAFE;
  comprueba Number seguro / BigInt 9007199254740992n exactos y rechazo de entradas
  fuera de dominio. Es prueba de la aritmética aislada, no aceptación pública de
  eventos iniciales fuera de coherencia.

### Verificación por archivo y regresiones

En /workspace/yellow, Node.js v24.22.1. Cada fila se ejecutó con
`node tests/<archivo>`; exit0, cero fallos y cero omitidas en las suites unitarias.
Tras resolver el merge, las 22 originales pasaron antes de corregir el contador;
su contenido original sigue siendo prefijo byte a byte del archivo ampliado.
Las demás suites/runners son idénticas a 0a6e245 y a main.

| Archivo en tests/ | F3-C anterior / DOC-02 | Rama sincronizada |
|---|---|---|
| f1-a.test.cjs | 18 PASS | 18 PASS |
| f1-b.test.cjs | 12 PASS | 12 PASS |
| f2-a.test.cjs | 14 PASS | 14 PASS |
| f2-b.test.cjs | 13 PASS | 13 PASS |
| f2-c.test.cjs | 21 PASS | 21 PASS |
| f2-d.test.cjs | 28 PASS | 28 PASS |
| f2-e.test.cjs | 16 PASS | 16 PASS |
| f2-f.test.cjs | 18 PASS | 18 PASS |
| f2-g.test.cjs | 21 PASS | 21 PASS |
| f2-h.test.cjs | 15 PASS | 15 PASS |
| f2-i.test.cjs | 18 PASS | 18 PASS |
| f3-a.test.cjs | 40 PASS | 40 PASS |
| f3-b.test.cjs | 18 PASS | 18 PASS |
| f3-c.test.cjs | 22 PASS | **24 PASS**, originales22 + nuevas2 |
| Total unitario | 274 PASS | **276 PASS** |
| f1-a-legacy.cjs | 10 PASS / 12 FAIL, exit1 | 10 PASS / 12 FAIL, exit1, mismas causas que F3-C anterior |

Legacy repetida: T06/07/08/20/22 recording failed; T04/13/19/21 EffectKind ausente;
T12 makeResource, T14 makeHazard, T16 invalid initial_state. Frente a main cambian
las cinco causas documentadas por DOC-02; frente a F3-C publicado no hay causas
nuevas. No se editaron expectativas heredadas. Ni igualdad de conteos ni suites
locales acreditan T01–T280, replay o interoperabilidad.

`git diff --check`: sin errores. Norma, F1-A/F1-B históricos, hashes, WORLD,
núcleo F3-A, configuración F3-B, bucles EXPERIMENT, HTML y agentes intactos.
Se preservan anclas/índices DOC-02, categorías de autoridad/evidencia, expedientes
y la distinción main/rama; los enlaces relativos y objetos Git citados se validan.

<a id="frontera-f3-d"></a>
### Contrato que deberá estar disponible antes de implementar F3-D

Preparación documental, **sin iniciar F3-D**. NORMATIVE y fragmento recuperado no
significan disponer del §34 histórico completo. La resolución transmitida F3-C
recuperó contratos de eventos/registro; **no recuperó el layout WLS1 ni V1**.

| Aspecto | Obligación conocida / fuente | Información aún necesaria y criterio de verificación |
|---|---|---|
| FNV-1a sobre bytes | NORMATIVE §24.1/2: offset 0x811c9dc5, primo 0x01000193, hash de estados canónicos; §34 exige bytes. FULL comprende WORLD+RNG, no agente/trayectoria | API de bytes y prueba independiente del acumulador uint32. fnv1a actual recibe texto, lo codifica UTF-8; sus vectores F1-A no prueban WLS1 |
| Formato WLS1 | NORMATIVE §34 incorpora v0.2.4; no reproduce layout | Fuente auténtica con campos, orden, tamaños, endianness, tags/ausencia/efectos y cobertura WORLD/FULL. No adoptar concatenación textual legacy |
| Celdas y entidades | NORMATIVE §§7–9: celdas (y,x), tipos válidos, mapa de exactamente una entidad y lifecycle explícito | Orden y codificación binaria de cada registro/entidad según §34 histórico; criterio de ordenación si aplica. No inferirlo de Array.sort legacy |
| Identificadores | NORMATIVE §9: string UTF-8 no vacío; UTF-8 estricto ya implementado para semillas, §11.6 | Recuperar la regla WLS1 de longitud, unidad, ancho, prefijo y límites; no asumir longitud UTF-16 ni transferir reglas de normalización de semillas a WLS1 sin fuente |
| binary64 | NORMATIVE §§6.3/6.4, P1-3/4: finitos, IEEE-754 exacto salvo -0→+0 antes de hash/serialización | Orden de bytes/layout histórico; vectores de límites, redondeo y cero canónico sin formato decimal intermedio |
| time / rng_state | NORMATIVE §7: uint64 / uint32 no cero; F3A-P01 autoriza representación JS Number seguro o BigInt para dominio temporal completo | Codificación binaria exacta y endianness de §34; límites mixtos sin pérdida. TR-010 persiste: StepRecord.tick seguro no se amplía por implementar bytes |
| Vectores | NORMATIVE §34.9 remite a V1 de 59 bytes; V2–V10 y hashes independientes pendientes en la transcripción | Recuperar estado de entrada y los 59 bytes completos auténticos de V1; contrastar byte a byte y hash independiente. V2–V10 requieren referencia verificable, no resultados fabricados desde legacy |

**UNKNOWN:** contenido de esas disposiciones ausentes. Si la futura orden autoriza
precisiones de ingeniería para aspectos no fijados, deberán identificarse con
alternativas, justificación y pruebas; esta preparación no selecciona layout,
endianness, tamaños o vectores nuevos ni les atribuye autoridad histórica.
No se modifican hash_state.js ni core/hash.js. B sigue bloqueada y no se publica
ningún StepRecord con hashes provisionales, nulos o de prueba. Condiciones de cierre
siguen en TR-001/005/010; merge a main y comienzo de F3-D requieren otra autorización.

<a id="f3-d"></a>
## Corte histórico F3-D — PARTIAL; puerta WLS1 BLOCKED

Corte 2026-11-10 (America/Guayaquil). Rama dev/f3-d-wls1-hashes desde
main `4cde54c7c966530aa7ed59c48d10ea630130dfaa`, posterior al PR #17: F3-C ya
está integrado con sus 24 pruebas y conserva su alcance parcial. La orden ejecutiva
F3-D permite trabajo independiente si el layout incorporado está ausente, y prohíbe
mantener hashes textuales operativos bajo nombres canónicos. No autoriza completar
RECORDER ni su publicación de StepRecords.

### Puerta contractual y procedencia

**Resultado: BLOCKED para serialización WLS1 y hashes WORLD/FULL; PARTIAL para
el incremento.** Ninguna cláusula histórica binaria nueva fue recuperada.
La orden recibida enumera verificaciones, pero no proporciona layout ni V1.

VERIFIED por lectura/Git: §24 fija constantes/composición y §34 remite al texto
v0.2.4. En main solo hay cinco documentos; el commit de incorporación a154b14
contiene la transcripción v0.2.5. Las rutas históricas docs/specifications en
909a43f y baa785e miden un byte (LF), no son §34. El historial pertinente no aporta
layout ni V1. No se afirma inspección de un archivo histórico externo completo.
La matriz [frontera F3-D](#frontera-f3-d) conserva los requisitos de recuperación;
se precisa aquí qué pudo ejecutarse, sin reconstruir la norma con legacy.

| Regla | Clasificación / fuente disponible | Estado de puerta |
|---|---|---|
| FNV-1a, offset 0x811c9dc5, primo 0x01000193, uint32; hashes de bytes canónicos | NORMATIVE §24/§34; acumulador independiente implementado | VERIFIED sobre bytes, no WLS1 |
| FULL = WORLD + RNG; no agente/trayectoria | NORMATIVE §24.2 | Composición conceptual conocida; lista exacta de campos/layout WORLD/FULL UNKNOWN |
| Magic, versión, orden de campos, anchos, endianness, tags y ausentes | UNKNOWN: §34 histórico incorporado pero no reproducido | BLOCKED; sin decisiones sustitutivas |
| Celdas (y,x), tipos, stock binario; entidad única y lifecycle explícito | NORMATIVE §§1/7–9 y contratos disponibles | Orden espacial conocido; codificación binaria y orden de entidades WLS1 UNKNOWN |
| ID UTF-8 no vacío | NORMATIVE §9; codificador estricto existente de §11.6 | Prefijo/ancho/unidad/límite de longitud y reglas WLS1 de ID UNKNOWN; no inferir de length JS o sort legacy |
| time uint64, rng_state uint32 no cero | NORMATIVE §7; representaciones JS F3A-P01 ENGINEERING DECISION vigente | Dominios preservados; tamaño/orden exactos del layout y endianness requieren fuente |
| binary64 finito, canonicalize_binary64 salvo -0→+0 | NORMATIVE §§6.3/6.4 y §34 | Helper existente intacto y pruebas F1-B conservadas; bytes WLS1 aún UNKNOWN |
| V1 completo de 59 bytes | Referencia NORMATIVE §34.9 al histórico; contenido UNKNOWN | Sin estado de entrada ni bytes auténticos: comparación byte a byte NO EJECUTADA |
| V2–V10 / hashes independientes | §34.9 los declara pendientes | No generados ni atribuidos a referencia normativa |

### Implementación independiente y decisiones acotadas

**F3D-P01 — ENGINEERING DECISION de API:** se añade fnv1a_bytes(bytes) en
[core/hash.js](../js/core/hash.js). Acepta Array denso de Number enteros 0..255 o
Uint8Array del mismo ámbito JS; procesa solo la vista, sin coerción, wraparound de
entradas, lectura de getters, texto intermedio, mutación o RNG. Rechaza huecos,
accessors y valores inválidos. No se ofrece streaming ni estado mutable externo.
Alternativas: algoritmo duplicado para UTF-8 o un acumulador común; se elige común.
fnv1a(text) conserva su firma, errores de tipo/Unicode y vectores: codifica UTF-8
estricto y delega al mismo acumulador. Math.imul y reducción uint32 se mantienen.
El error de la API nueva es ContractError("recording failed"), decisión diagnóstica
usando catálogo §26.6; no se atribuye ese mensaje al contrato histórico de bytes.

**F3D-P02 — ENGINEERING DECISION de bloqueo explícito:**
[hash_state.js](../js/experiment/hash_state.js) retira la serialización textual.
serialize_world_state, STATE_HASH_WORLD y STATE_HASH_FULL conservan los nombres
pero rechazan siempre con ContractError("recording failed"), sin consultar/mutar
la entrada ni devolver un hash, bytes vacíos, texto o valor provisional. Es una
operación no disponible, no un serializador definitivo. Frente a renombrar y
mantener un hash legacy alternativo, se elige fallo explícito sin ruta ambigua.
No se pretende distinguir errores estructurales de WORLD en un formato que todavía
no puede ejecutarse. Validación de estados/uint64/binary64 existentes no se cambia.

**Disponibilidad para RECORDER: NO.** El acumulador de bytes está disponible;
faltan los bytes auténticos que debe consumir. Recorder permanece exactamente
como en main F3-C: prepara datos y rechaza record_step sin publicar hashes/steps.
No se alteran las políticas de secuencias, reloj, lifecycle o Feedback.

### Pruebas ejecutadas y pendientes

Node v24.22.1, /workspace/yellow. Comandos directos `node tests/<archivo>`.

| Archivo / grupo | Resultado | Evidencia |
|---|---|---|
| f3-d.test.cjs | **12 PASS**, exit0, 0 omitidas | F3D-01: vectores §24.5 sobre ASCII literal; 02–04: todos los bytes, orden inverso, 256 casos unitarios y 65536 bytes contra oráculo BigInt independiente; 05: ventana Uint8Array; 06–08: dominios/sin coerción/huecos/getters; 09: pureza/repetición; 10: wrapper/UTF-8/semillas; 11: sin RNG; 12: APIs bloqueadas sin lectura/mutación ni resultado ficticio |
| f1-a.test.cjs / f1-b.test.cjs | 18 / 12 PASS | Vectores y contratos preservados |
| f2-a / f2-b / f2-c / f2-d .test.cjs | 14 / 13 / 21 / 28 PASS | Sin cambios en suites ni contratos |
| f2-e / f2-f / f2-g / f2-h / f2-i .test.cjs | 16 / 18 / 21 / 15 / 18 PASS | Sin cambios en suites ni contratos |
| f3-a / f3-b / f3-c .test.cjs | 40 / 18 / 24 PASS | uint64, rollback, configuración y RECORDER parcial conservados |
| Total unitario | **288 PASS**, exit0 en las 15 suites; 0 FAIL/omitidas | 276 anteriores + 12 nuevas; IDs locales, no T01–T280 |
| node tests/f1-a-legacy.cjs | **10 PASS / 12 FAIL**, exit1 | Causas diferenciadas abajo; ninguna expectativa modificada |
| git diff --check | Sin errores | Norma e informes históricos intactos |

Normativos verificados aquí: vectores FNV-1a de §24.5 (vacío/a/foobar) y vectores
semilla F1-A conservados. Los demás bytes de prueba se contrastan con multiplicación
BigInt módulo 2^32 independiente de Math.imul; son casos locales, **no V1–V10**.
No se usa la función ensayada para generar el resultado esperado.

Legacy: T04/06/07/08/19/20/21/22 recording failed; T13 EffectKind; T12 makeResource;
T14 makeHazard; T16 invalid initial_state. Frente a main cambian **T04/T19/T21**,
antes EffectKind, ahora rechazo explícito de hash no canónico. Las otras nueve
causas permanecen. El conteo10/12 no demuestra ausencia de regresiones: se retira
intencionadamente la capacidad de devolver hashes textuales bajo nombres canónicos.

**UNTESTED/BLOCKED:** bytes/orden/composición WORLD/FULL, efectos/lifecycle/IDs
serializados, endianness, binary64/uint64 codificados, V1 byte a byte, V2–V10,
oráculos de hashes de estado, diferencias WORLD/FULL al cambiar solo RNG y
StepRecords con hashes. No se convierten en tests omitidos contados como PASS.
Para cerrar, obtener contrato auténtico §34 y V1 completo y ejecutar esas pruebas.
No hay conformidad WLS1/global, replay o interoperabilidad verificados.

Solo se modifican core/hash.js, experiment/hash_state.js, tests/f3-d.test.cjs y
este documento. Sin cambios a norma, WORLD, PRNG, F3-A, ExperimentConfig, bucles,
Recorder, agentes, web ni renderer. Sin merge/despliegue ni avance de incremento.

<a id="f3-d2"></a>
## F3-D/2 — WLS1 y hashes COMPLETED en el alcance contractual disponible

Corte 2026-11-10 (America/Guayaquil). Base main posterior al PR #18:
`fa79ad6a990ea8b1b477868c1e4a81e05d25f481`; rama dev/f3-d2-wls1-completion.
**Puerta READY; implementación VERIFIED localmente.** El bloqueo de layout/V1 de
F3-D se resuelve por el fragmento auténtico transmitido en la orden F3-D/2.
No equivale a conformidad global ni Hito C. RECORDER B no se implementa.

### Fuente recuperada y contraste de consistencia

**HISTORICAL RECOVERED:** §34.1–9 atribuido por el responsable a WORLD-LAB v0.2.4
Canonical, Texto pegado(5).txt. Fuente recibida: orden ejecutiva F3-D/2,
SHA-256 `47db32068e479861054f03e85123b1e927b7be17da94a41cca540143ae46cd40`.
VERIFIED: lectura del fragmento y contraste con §§6.4/7–9/24/34 v0.2.5.
REPORTED: recuperación/autenticidad del documento externo completo, que no se leyó
íntegramente. El fragmento incorporado tiene autoridad normativa en su ámbito;
no se atribuye esa autoridad a las decisiones de interfaz JS.

| Cláusula recuperada | Regla exacta aplicada |
|---|---|
| §34.1/2 | Magic 57 4C 53 31; enteros y binary64 big-endian; enums uint8; campos en orden fijo |
| §34.3 WORLD | magic[4], time[uint64], width[uint32], height[uint32], cells(y,x), entity_count[uint32], entidades ordenadas por ID |
| Orden de IDs | Comparación byte-wise UTF-8 sin signo; prefijo corto primero |
| §34.4 Cell | traversal uint8 FREE=0/BLOCKED=1; effect uint8 NONE=0/RESOURCE=1/HAZARD=2; stock uint8 0 para NONE/HAZARD, 0 o1 para RESOURCE |
| §34.5 Entity | id_length[uint32] en bytes UTF-8, id_utf8, x[uint32], y[uint32], energy[binary64], lifecycle[uint8] ACTIVE=0/DEAD=1 |
| §34.6/7 FULL | WORLD concatenado con rng_state[uint32]; RNG no aparece en WORLD |
| §34.8, v0.2.5 §6.4/P1-4 | energy finita; -0→+0 antes de codificar, demás bits binary64 conservados |
| §34.9 | V1 FULL de59 bytes recuperado; V2–V10 y hashes de referencia pendientes; Hito C exige referencia y segunda implementación |

No hay contradicción material con v0.2.5. El esquema admite exactamente una entidad:
se mantiene esa restricción aunque la serialización defina ordenación general.
ACTIVE con energía0 es un estado estructural válido: no se deduce lifecycle de la
energía ni se ejecuta inicialización/lifecycle para fabricar V1; death_threshold
no forma parte de WorldState ni de sus bytes.

### V1 preservado y resultados exactos

Estado representado: time0; width1/height1; FREE/NONE; una entidad con ID0987898,
posición(0,0), energía+0, lifecycleACTIVE; rng_state1.

Bytes FULL **recuperados**, agrupados como en la orden (59):

```text
57 4C 53 31
00 00 00 00 00 00 00 00
00 00 00 01
00 00 00 01
00 00 00
00 00 00 01
00 00 00 07
30 39 38 37 38 39 38
00 00 00 00
00 00 00 00
00 00 00 00 00 00 00 00
00
00 00 00 01
```

WORLD son los primeros **55 bytes**; FULL añade los cuatro finales 00 00 00 01.
La longitud se comprueba antes de implementar y en F3D2-01, sin rellenar bytes.
Hashes **calculados aquí**, no hashes históricos publicados recuperados:

| Estado V1 | Bytes | FNV-1a decimal | Hex |
|---|---|---|---|
| WORLD | 55 | 1615943297 | 0x60515681 |
| FULL | 59 | 2531032062 | 0x96DC7BFE |

Oráculos: cálculo previo sobre el literal hexadecimal con enteros Python módulo
2^32 y prueba con BigInt JS; ambos independientes del acumulador Math.imul.
Para los otros casos, codificador de referencia con Buffer.writeUInt32BE,
writeBigUInt64BE, writeDoubleBE, Buffer UTF-8 y Buffer.compare, concatenando bloques;
producción usa DataView y cursor. El esperado no llama al serializador ensayado.
Los casos adicionales son tests locales, **no V2–V10** ni interoperabilidad completa.

### API, validación y decisiones de ingeniería

En [hash_state.js](../js/experiment/hash_state.js):
canonical_world_state_bytes(state), canonical_full_state_bytes(state) y
serialize_world_state(state, include_rng=false) producen Uint8Array nuevos.
STATE_HASH_WORLD/FULL llaman a fnv1a_bytes sobre sus bytes respectivos. Desaparece
el rechazo provisional para entradas válidas; no hay ruta textual o hashes falsos.
Core/hash.js y derivación de semillas no se modifican.

**F3D2-P01 — ENGINEERING DECISION de interfaz/validación:** conservar el nombre
serialize_world_state y flag opcional booleano estricto (defaultWORLD), en vez de
romper las llamadas de consumidores o aceptar flags coercionados. Funciones con
nombres WORLD/FULL evitan depender del flag. WorldState no expone config pública:
para reutilizar validate_WorldState se infieren width/height del grid y se usa un
contexto WorldConfig con esos tamaños y los defaults restantes; no se modifica
WORLD ni se añaden campos. Esos defaults no se serializan ni determinan energía,
lifecycle o mecánicas. Se validan MAX_CELLS, matriz densa/rectangular y todos los
contratos existentes antes de asignar salida. Alternativa de duplicar validadores
se descarta para conservar una sola definición estructural.

Acepta WorldState tipado o registro estructural válido con Map del mismo ámbito,
como el predicado F1-B. Errores de datos/flag → ContractError("recording failed"),
diagnóstico F3D-P02 conservado dentro del catálogo §26.6. No finitos, BigInt fuera
de uint64, Number inseguro, RNG0/fuera de uint32, IDs inválidos y esquemas ajenos
se rechazan sin reparación ni truncación. El orden espacial y los tags son
HISTORICAL RECOVERED, **no** políticas de ingeniería. Los valores de tiempo se
convierten a BigInt solo después de validar, sin pérdida ni reducción del dominio.
Capacidad de asignación del proceso puede producir RangeError operacional; no se
promete memoria infinita ni se añade un nuevo límite normativo.

**F3D-P01 vigente:** acumulador de bytes y wrapper UTF-8 sin cambios.
**F3D-P02 sustituida para datos válidos:** ya no hay bloqueo global de APIs; sí
rechazo de entradas inválidas. Las 12 pruebas originales F3-D se conservan byte a
byte; el nombre histórico de F3D-12 menciona bloqueo, pero sus entradas son null y
un registro vacío/proxy, que siguen siendo inválidos. Esa prueba no acredita
aceptación válida: F3D2-01–15 la prueban explícitamente.

### Pruebas y regresión por archivo

Node.js v24.22.1, /workspace/yellow. Comando para cada suite:
`node tests/<archivo>`. Exit0, 0 FAIL/omitidas en todas las suites unitarias.

| Archivo en tests/ | Resultado |
|---|---|
| f1-a.test.cjs | 18 PASS |
| f1-b.test.cjs | 12 PASS |
| f2-a.test.cjs | 14 PASS |
| f2-b.test.cjs | 13 PASS |
| f2-c.test.cjs | 21 PASS |
| f2-d.test.cjs | 28 PASS |
| f2-e.test.cjs | 16 PASS |
| f2-f.test.cjs | 18 PASS |
| f2-g.test.cjs | 21 PASS |
| f2-h.test.cjs | 15 PASS |
| f2-i.test.cjs | 18 PASS |
| f3-a.test.cjs | 40 PASS |
| f3-b.test.cjs | 18 PASS |
| f3-c.test.cjs | 24 PASS |
| f3-d.test.cjs | 12 PASS, originales intactas |
| f3-d2.test.cjs | **15 PASS**, nuevas |
| Total | **303 PASS**; 288 anteriores +15 |
| node tests/f1-a-legacy.cjs | **13 PASS/9 FAIL**, exit1 |
| git diff --check | Sin errores |

Correspondencia: F3D2-01/02 V1+hashes; 03/04 tags/orden/posición/lifecycle; 05/06
UTF-8/longitud/prefijos/orden no UTF-16; 07 uint64 completo y representaciones mixtas;
08 rng uint32 y WORLD invariante/FULL diferente; 09 binary64 y canonicalización;
10/11 dominios/esquemas/huecos/getters; 12/13 copias/pureza/PRNG/WorldState real;
14 flag y default; 15 igualdad estructural independientemente del orden de campos.
La comparación de IDs se ensaya separadamente porque no se relaja el dominio de
una sola entidad para probar el sort. Todos los archivos previos de tests son
idénticos a main; no se cambian expectativas para ocultar incompatibilidades.

Legacy T04/T19/T21 pasan ahora, antes recording failed: alcanzan hashes reales.
Persisten T06/07/08/20/22 recording failed (RECORDER parcial), T12 makeResource,
T13 EffectKind, T14 makeHazard y T16 invalid initial_state. No surgen nuevas causas.
No se interpreta ese avance como certificación de replay o ciclo experimental.

### Cierre y frontera RECORDER

F3-D **COMPLETED bajo los contratos disponibles y pruebas locales**: puerta READY,
WLS1 WORLD/FULL y V1 exactos, hashes sobre bytes auténticos, regresión verificada.
V2–V10 siguen pendientes de referencia y segunda implementación para Hito C;
conformidad global/T01–T280, replay e interoperabilidad siguen no demostrados.
TR-001 no se cierra íntegramente; TR-010 (uint64 versus StepRecord.tick seguro)
no se modifica. La dependencia de bytes/hashes para RECORDER ya está disponible,
pero **RECORDER sigue parcial y sin publicar StepRecords** hasta otro incremento.
Solo hash_state.js, tests/f3-d2.test.cjs y este documento cambian; no se modifica
la especificación canónica, WORLD, core/PRNG/semillas, F3-A/B, Recorder, EXPERIMENT,
agentes, interfaz ni renderer. Sin merge ni despliegue ni inicio de RECORDER B.

<a id="f3-e"></a>
## F3-E — RECORDER B COMPLETED en alcance local

Corte 2026-11-10 (America/Guayaquil), rama dev/f3-e-recorder-completion desde
main `bdf347344e47d7908fe327fcef31111905e0a4f9` (PR #19). Orden ejecutiva F3-E:
§§4–5/18/20–24/26/31–34, P0-3/P1-1 y contratos F3-A/F3-C/F3-D/2.
**VERIFIED por ejecución:** registro de varios ticks reales, StepRecord cerrado
completo, hashes WLS1, secuencias globales, atomicidad y Trajectory independiente.
No se implementan EXPERIMENT ni replay ni rollback conjunto WORLD+RECORDER.

### Contratos implementados y vigencia

record_step(confirmed, observation, feedback, action) mantiene once campos exactos:
tick, world_state, observation, feedback, action, action_result, action_events,
lifecycle_events, state_hash_world, state_hash_full, entity_states. tick sigue siendo
Number seguro; una entrada BigInt representable se convierte sin pérdida, snapshot.time
conserva su representación. El dominio uint64 de F3-A y la frontera TR-010 no cambian.

La preparación F3-C se conserva como wrapper interno puro; F3C-P04 se sustituye
solo en su bloqueo de publicación. Se usa como precedente initial_state o el
último StepRecord, se exige tick=precedente.time+1 y snapshot.time=tick, identidad
estable y estado estructural válido. No se agregan pasos tras DEAD, max_ticks o
AGENT_CONTRACT_ERROR. La causa de ConfirmedTickResult debe coincidir con
**determine_termination existente**, invocado sobre una fachada de datos de solo
lectura (state/config/id), sin WORLD vivo, agente, RNG ni Recorder externo.
No se introduce otra precedencia terminal ni motor de transición.

Observación, si existe, tiene tick/self del precedente; Feedback corresponde a
esa Observation y a la proyección del ActionResult previamente registrado según
los cuatro flags. No se reconstruye local_view para comprobar su equivalencia
semántica con el mapa: esa verificación completa corresponde al replay. Action y
ActionResult siempre presentes; solo WAIT real con observación/feedback ambos
nulos en modo sin agente. Se conserva el ActionResult crudo, no su proyección.

Se enriquece exclusivamente aquí: iniciales tick0/lifecycle, después acciones y
lifecycle de cada tick. sequence global desde0, sin reinicio y con reservas
provisionales F3C-P01/P03. Trajectory.events debe coincidir exactamente con la
concatenación iniciales→action_events→lifecycle_events de todos sus pasos; el
validador comprueba contenido y orden, no solo cantidad. Map entity_states copia
id/position/energy/lifecycle del snapshot y no comparte su posición.

STATE_HASH_WORLD y STATE_HASH_FULL se calculan sobre **el mismo snapshot que se
incorpora al StepRecord**; validación posterior vuelve a contrastarlos sobre ese
objeto. WLS1 no se modifica. Eventos, acción, resultado y entradas se copian antes
de publicar. RecordTransaction confirma mediante reemplazo de sus siete ranuras;
si algo falla restaura los valores/referencias anteriores sin mutar las listas
preexistentes. record_step devuelve undefined, conservando la API de comando.

### Decisiones técnicas acotadas y límites

**F3E-P01 — ENGINEERING DECISION:** validar el prefijo completo, eventos, contador,
contextos y hashes en cada preparación/confirmación, frente a confiar ciegamente
en el último registro. Detecta corrupción de esquemas/mapas/hashes/eventos de las
propiedades públicas. No reejecuta acciones ni comprueba equivalencia completa de
transición. El coste acumulado de registrar n pasos es cuadrático en n al
revalidar el prefijo (y proporcional al estado serializado); no se presenta como
optimización para trayectorias masivas. No se prueba materializar 2^53 eventos.

**F3E-P02 — ENGINEERING DECISION de finalización:** la causa MAX_TICKS_REACHED por
defecto es provisional mientras se registra; finalize solo permite éxito si
coincide con terminación real. AGENT_CONTRACT_ERROR se acepta como parada externa
no terminal, impide pasos siguientes y exporta el prefijo, sin inventar un estado
ExperimentResult.status. EXPERIMENT deberá marcar el fallo conforme a §20.6.
Una muerte/límite no se puede reemplazar por fallo de agente. Metadata conserva
{version:"v0.1"} como contenido opaco heredado, sin autoridad normativa.

Se mantienen muerte inicial y límite0 con steps=[], eventos de replay iniciales
sin reenriquecimiento, y InitializationFailure fuera de Trajectory. finalize
valida antes de copiar todo el historial, configuración, mapas y eventos. No
conserva referencias mutables al WORLD ni las entrega al llamador. Trajectory ya
tenía sus seis campos exactos, por lo que **trajectory.js no requiere cambios**.

Atomicidad limitada a Recorder nativo/datos ordinarios y fases sin efectos
externos: no garantiza protección ante Proxy hostil que muta datos previos,
cambios maliciosos de prototipos/descriptores durante commit o aliases públicos
alterados concurrentemente. Un fallo de registro conserva el WORLD ya confirmado;
la coordinación con EXPERIMENT queda pendiente, no se promete rollback conjunto.
Se requiere cargar tick_transaction.js y los productores de interfaz/WLS1; no se
modifica HTML ni se conecta el bucle legacy en este incremento.

### Evidencia y trazabilidad

| Casos locales F3E | Propiedad ejecutada |
|---|---|
| 01/02 | Esquema cerrado, Map/snapshot independiente, tres ticks reales con contexto previo y terminación por límite |
| 03/09/19/21 | Orden de seis eventos movimiento/peligro/muerte, iniciales/replay, copias y consumo/regeneración de recursos |
| 04/21/24 | Hashes del snapshot exacto, comparación WLS1 y oráculo independiente Buffer/BigInt; cambios solo RNG conservan WORLD y cambian FULL |
| 05/17/19 | Aislamiento entradas/salida/WORLD, sin métodos mutadores ni RNG vivo; snapshots y posiciones separados |
| 06/07/08/10/20/23 | Continuidad/identidad/causa, rechazo duplicados/saltos, Feedback previo y 16 flags, WAIT real, finales y parada por agente |
| 11/12 | BigInt pequeño, frontera Number seguro y rechazo temporal; overflow real del enriquecedor provocado en preparación sin commit |
| 13/14/15 | Fallos de preparación/copia/serialización/hash/validación con contadores que acreditan la fase alcanzada; hashes fallan tanto en primer paso como en revalidación de prefijo |
| 16/22 | Fallo tras cada una de siete publicaciones efectivas, restauración de todas las ranuras; retry del mismo confirmado reutiliza sequence0 y no revierte WORLD |
| 18 | Corrupción de agregación, hash, Map y campo adicional detectada por validación de historial |

F3E-11 no pretende publicar MAX_SAFE_INTEGER como primer tick ni relajar
continuidad: prueba la conversión exacta usada y el rechazo de saltos/grandes.
F3E-12 inyecta el inicio MAX_SAFE en el enriquecedor de una acción con dos eventos
para alcanzar su error de overflow; no altera el dominio ni fabrica una trayectoria
con un contador enorme. F3E-15 acredita expresamente la llegada a validación del
paso nuevo; F3E-16 falla después de escribir cada campo, no antes de la fase.

Las 24 pruebas F3-C y las pruebas F3-D/2 permanecen byte a byte intactas.
F3C-20 intercepta las funciones hash y su aserción de ausencia se captura como
fallo de registro: tras levantar el bloqueo de B, **ese caso histórico no demuestra
ausencia de llamadas a hashes**. La nueva evidencia relevante es F3E-04/14/21/24:
hashes canónicos reales y fallos inyectados con contadores, sin cambiar expectativas
heredadas. No se presenta una prueba que se detiene antes de la fase como prueba
de publicación completa ni se llama a estos casos T01–T280.

### Demostración reproducible de tres ticks

Fixture F3E-03: mapa4×3, semilla1, entidad en(1,1), energía6, costeMOVE1,
peligro en(2,1) daño3, límite10. El mapa con peligro forma parte del estado inicial
registrado. Acciones MOVE_E, MOVE_W, MOVE_E mediante execute_tick_transaction;
observación/feedback reales antes de cada tick. Resultado final ENTITY_DIED.

| Tick | Energía final | state_hash_world | state_hash_full | sequence de eventos |
|---|---|---|---|---|
| 1 | 2 | 3051273274 | 3456103947 | 0,1 |
| 2 | 1 | 1757557637 | 3601543720 | 2 |
| 3 | -3 | 2138345419 | 3810741570 | 3,4,5 |

Son resultados de ejemplo locales, no nuevos vectores normativos. WORLD sigue
confirmado en time3; Recorder posee tres snapshots, seis eventos y contador6.

### Ejecución de regresión

Node.js v24.22.1, /workspace/yellow. `node tests/<archivo>` en cada suite; todas
exit0, sin fallos ni omitidas. Ningún archivo de pruebas anterior se modifica.

| Archivo | PASS |
|---|---|
| f1-a.test.cjs | 18 |
| f1-b.test.cjs | 12 |
| f2-a.test.cjs | 14 |
| f2-b.test.cjs | 13 |
| f2-c.test.cjs | 21 |
| f2-d.test.cjs | 28 |
| f2-e.test.cjs | 16 |
| f2-f.test.cjs | 18 |
| f2-g.test.cjs | 21 |
| f2-h.test.cjs | 15 |
| f2-i.test.cjs | 18 |
| f3-a.test.cjs | 40 |
| f3-b.test.cjs | 18 |
| f3-c.test.cjs | 24 |
| f3-d.test.cjs | 12 |
| f3-d2.test.cjs | 15 |
| f3-e.test.cjs | **24** |
| Total | **327** |

`node tests/f1-a-legacy.cjs`: **13 PASS /9 FAIL**, exit1, sin nuevas causas frente
a main. T06/07/08/20/22 recording failed: diagnóstico VM focalizado comprueba que
entran en _prepare_step con lifecycle inicial no registrado y primer argumento
Number de firma legacy, no ConfirmedTickResult. El bucle también necesita cargar
el kernel y migrar orquestación; no se añade compatibilidad artificial.
T12 makeResource, T13 EffectKind, T14 makeHazard y T16 invalid initial_state
permanecen. T18 y el falso replay T20 conservan las advertencias históricas.
`git diff --check`: limpio; enlaces internos y alcance de archivos comprobados.

### Cierre y disponibilidad

F3-E **COMPLETED en alcance local**: Steps completos multi-tick y Trajectory
independiente con hashes auténticos y commit atómico. Preparado para integrar
EXPERIMENT por una orden posterior; faltan su bucle canónico, coordinación de
fallos tras confirmar WORLD, agentes/web, replay, V2–V10 y conformidad global.
TR-005/008/009/010 conservan sus pendientes. No se demuestra interoperabilidad ni
T01–T280 por estas suites locales.
Solo recorder.js, tests/f3-e.test.cjs y este documento cambian. Sin modificaciones
a norma, hashes/WLS1, WORLD, PRNG, F3-A/B, Feedback/Observation, EXPERIMENT,
Trajectory, agentes, replay, renderer o interfaz. Sin merge ni despliegue.

<a id="f3-f"></a>
## F3-F — ciclo experimental COMPLETED en alcance local

Corte 2026-11-10 (America/Guayaquil), base main posterior al PR #20:
`8f8a771d76e88499bba6c2ef3a894fe1f981f346`, rama dev/f3-f-experiment-integration.
**VERIFIED por episodios end-to-end reales:** run_experiment(config, agent_factory)
y run_without_agent(config) devuelven ExperimentResult cerrado, con StepRecords
WLS1 y eventos finales. No se cambia WORLD, kernel, RECORDER, agentes ni UI.

### Orquestación y contratos

Se valida/copia ExperimentConfig; se derivan world_seed con namespace world y
agent_seed con agent_type exacto, sin aliases ni normalización. Incluso sin agente
se mantiene esa derivación pura (no consume streams); no se crea/reset/llama ningún
agente en ese modo. Con agente, factory recibe solo tipo/semilla. La aceptación de
config no depende de registry: resolución y disponibilidad son frontera EXPERIMENT.

World.initialize es el adaptador F2-G a initialize_world único: se utiliza su
InitialWorldResult y su adopción de state/RNG ya realizada. Se registran snapshot
y eventos crudos, sin volver a resolver lifecycle, sincronizar RNG ni inicializar
otra vez. Factory y reset ocurren antes de comprobar terminación inicial, conforme
a §20.1, también en episodios de cero ticks. La muerte prevalece sobre límite0.

Luego se usa determine_termination existente antes del bucle y al inicio de la
iteración; se construyen Observation T y Feedback previo; se valida estructura de
Action; execute_tick_transaction confirma T+1; Recorder registra ese confirmado;
solo entonces se actualiza last_action_result. Se examina confirmed.termination
calculada por el kernel, sin duplicar su precedencia. Las validaciones internas de
F3-A/F3-E también consultan la misma función: no se afirma un conteo global de solo
tres invocaciones contando esos validadores. Sin agente se ejecuta WAIT real con
contextos nulos y resultado efectivo; nunca se fabrica ActionResult.

La clase Experiment permanece como adaptador y captura config inmutable; run(factory)
y run_without_agent() retornan **ExperimentResult**, no una Trajectory aislada.
Los cuatro campos exactos: status, trajectory, failure_reason, failure_details.
Éxito: COMPLETED, Trajectory completa, ambos failure_* null.

### Errores, decisiones y frontera de atomicidad

| Caso | Comportamiento y autoridad |
|---|---|
| Posición inicial sin candidatos | NORMATIVE §§20.1/20.5: Recorder registra InitializationFailure fuera de Trajectory; resultado FAILED, trajectory=null, failure_reason=INITIALIZATION_ERROR, details={seed,message,config}. No se crea agente |
| Error de step / Action estructuralmente inválida | NORMATIVE §§20.1/20.6/P0-4: FAILED/AGENT_CONTRACT_ERROR, details={message,config}, trayectoria confirmada preservada con esa causa. Sin tick adicional ni WAIT sustituto |
| Action estructuralmente válida de tipo desconocido | Contrato §12/13: pasa forma y el kernel rechaza operacionalmente. No se reclasifica como error estructural de agente |
| Factory/reset y producto de agente inválido | F3F-P02 ENGINEERING DECISION: fuera del catch de step; error original de factory/reset propagado. Producto sin reset/step callable o factory no función → ContractError(world transition failed) de preparación, sin categoría pública nueva |
| Error interno de observación/transición/registro/finalización | F3F-P01 ENGINEERING DECISION: propagar y detener, sin producir ExperimentResult COMPLETED ni un nuevo failure_reason. No convertir errores de capacidad/programación en InitializationError |

**F3F-P01 — fail-stop WORLD/RECORDER.** §20.1 solo captura explícitamente
inicialización y step; no proporciona categoría pública completa para todos los
fallos internos. Se mantiene esa propagación y se aísla la frontera. Alternativas
no adoptadas: reintentar el tick (duplicaría efectos/estado de agente), etiquetar
como AGENT_CONTRACT_ERROR o inventar TRANSITION_ERROR/RECORDING_ERROR públicos,
o prometer rollback conjunto sin autoridad. Ninguna se necesita para episodios
normales. Si WORLD confirma y Recorder falla, WORLD puede quedar adelantado un
tick, Recorder conserva su prefijo y el error sale al llamador. No hay reejecución,
resultado exitoso incompleto ni exportación de trayectoria interna disfrazada de
éxito. Ese prefijo no se devuelve como ExperimentResult de un fallo sin categoría
normativa definida. Un futuro contrato puede precisar diagnóstico/recuperación.

**Propiedad de atomicidad conjunta: PARTIAL/NO IMPLEMENTADA.** F3-A restaura WORLD
ante fallo dentro de su transacción; F3-E restaura Recorder ante fallo de registro.
El test F3F-15 falla después de la escritura sequence_counter durante el segundo
commit de Recorder: WORLD.time2, Recorder.steps1, agente.step llamado2 veces;
Recorder íntegro frente a su captura previa. No se afirma rollback de agente.
No se modifica ninguna de esas dos fronteras para fingir una transacción global.

**F3F-P02 — clasificación de preparación.** §20.6 especifica step, no todo error
de factory/reset. Se conservan fuera del catch como §20.1; se descarta clasificarlos
indiscriminadamente como acción inválida. Sus errores originales conservan
identidad. El chequeo mínimo de producto exige objeto con métodos reset/step,
sin inspeccionar estado interno. Config Unicode válida no garantiza factory.
Conformidad histórica completa de diagnósticos de setup sigue no verificada.

**F3F-P03 — detalles de fallo por rama.** El resumen de tipo §20 lista seed/message/
config, pero el pseudocódigo de la rama AGENT_CONTRACT_ERROR da message/config.
Se sigue la forma específica de cada rama: seed solo para inicialización; no se
inventa una semilla de error de agente. Copias independientes de config; mensaje
String(error) conforme a la rama. Esto no amplía el esquema público de cuatro
campos ni introduce nueva categoría de fallo.

### Evidencia de pruebas

| Casos F3F locales | Propiedad ejecutada |
|---|---|
| 01–05/19 | Episodios cero/uno/varios ticks, muerte inicial/posterior, precedencia, WAIT real sin agente y adaptador de clase; Observation T/Feedback previo |
| 06/07/11 | Igualdad estructural, bytes/hashes y semilla; Wait/Random/Rule reales; factory controlada para identificador no registrado |
| 08–13/22/23 | Step inválido/excepción sin tick adicional, UNKNOWN operacional, factory/reset, InitializationFailure, error ajeno y capacidad de observación |
| 14/15 | Fallo efectivo en segunda dinámica con WORLD restaurado; fallo efectivo tras publicación parcial de Recorder, prefijo y contador restaurados, sin retry |
| 16/17 | Una resolución lifecycle y un sync iniciales, más uno por tick; trayectorias/configs de fallo independientes del WORLD/Recorder vivos |
| 18 | max_ticks uint64 completo aceptado; BigInt/no representable o salto en ConfirmedTickResult rechazados por Recorder sin falso éxito |
| 20/21 | Eventos crudos iniciales sin reenriquecer/doble muerte; movimiento→lifecycle y secuencia global mediante orquestador real |

F3F-18 usa confirmados inyectados para alcanzar la frontera numérica, no ejecuta
2^53 ticks ni reduce max_ticks. La independencia del estado de agente se verifica
sin pasar WORLD/RNG/Recorder como argumentos; el estado mutable propio del agente
no se inspecciona. No se considera la repetición de runs equivalente a replay.

### Ejemplo reproducible de episodio completo

Fixture F3F-21: semilla de experimento1, mapa2×2 FREE/NONE, energía3, costes MOVE1 y
WAIT1, radio1, max_ticks3. Factory controlada devuelve MOVE_E si x0, MOVE_W si x1.
Resultado COMPLETED, causa ENTITY_DIED (muerte y límite coinciden), cuatro eventos:
ENTITY_MOVED tick1 seq0, ENTITY_MOVED tick2 seq1, ENTITY_MOVED tick3 seq2,
ENTITY_DIED tick3 seq3. Snapshot inicial rng_state2061750760.

| Tick | Posición | Energía | WORLD hash | FULL hash |
|---|---|---|---|---|
| 1 | (1,0) | 2 | 1616389299 | 3108831289 |
| 2 | (0,0) | 1 | 499366166 | 457716380 |
| 3 | (1,0) | 0 | 1573707962 | 3948499472 |

Son valores de ejemplo, no vectores normativos. run_without_agent con la misma
config ejecuta WAIT: también tres ticks y muerte, contextos nulos y ActionResult
real. Reproducibilidad comparada por estructura, acciones/eventos y bytes WLS1,
no solo por cantidad de pasos. No se define un hash nuevo de Trajectory.

### Rendimiento observado, sin optimización

Reproducción opcional: `node tests/f3-f.test.cjs --benchmark` (10/100/500;
no se activa en la ejecución unitaria normal). La medición se realizó con el
mismo código de instrumentación en /tmp/f3f-bench.cjs antes de incorporarlo como
modo opcional al archivo de pruebas.

Medición única local, Node v24.22.1, mapa1×1 FREE/NONE, radio0, energía1000,
WAIT coste0, sin agente, mismos módulos que las pruebas Node. Se midió el
orquestador real con performance.now y wrappers de kernel/record_step/finalize;
sin alterar código versionado de F3-A/F3-E. Ejecuciones consecutivas, sin comparar
con otras plataformas ni tratarlas como garantía temporal. Todas finalizaron
COMPLETED con el número de pasos pedido, sin fallo de memoria observado.

| Ticks | Total ms | Kernel ms | record_step acumulado ms | finalize ms |
|---|---|---|---|---|
| 10 | 79.68 | 11.49 | 53.08 | 6.10 |
| 100 | 3767.46 | 69.38 | 3601.64 | 50.20 |
| 500 | 89485.36 | 349.53 | 88695.46 | 231.13 |

El coste dominante es la revalidación del prefijo F3E-P01; 500 ticks pequeños ya
requieren unos90 segundos. Es un límite operativo relevante para episodios largos,
no un fallo de determinismo ni motivo para quitar validaciones aquí. Propuesta
focalizada para futura autorización: evaluar validación incremental de paso nuevo
con prefijo previamente validado bajo propiedad/inmutabilidad verificable, manteniendo
controles de hashes/eventos y atomicidad. No se implementa ni se declara único
algoritmo permitido. La optimización de Recorder sigue fuera de F3-F.

### Regresión y ejecución

Cada comando `node tests/<archivo>` ejecutado desde /workspace/yellow. Todas las
suites unitarias: exit0, 0 FAIL/omitidas; ningún archivo de prueba previo editado.

| Archivo | PASS |
|---|---|
| f1-a.test.cjs | 18 |
| f1-b.test.cjs | 12 |
| f2-a.test.cjs | 14 |
| f2-b.test.cjs | 13 |
| f2-c.test.cjs | 21 |
| f2-d.test.cjs | 28 |
| f2-e.test.cjs | 16 |
| f2-f.test.cjs | 18 |
| f2-g.test.cjs | 21 |
| f2-h.test.cjs | 15 |
| f2-i.test.cjs | 18 |
| f3-a.test.cjs | 40 |
| f3-b.test.cjs | 18 |
| f3-c.test.cjs | 24 |
| f3-d.test.cjs | 12 |
| f3-d2.test.cjs | 15 |
| f3-e.test.cjs | 24 |
| f3-f.test.cjs | **23** |
| Total | **350** |

`node tests/f1-a-legacy.cjs`: **13 PASS/9 FAIL**, exit1, conteo igual pero **cambian
cinco causas**. T06/07/08/20/22 ahora determine_termination is not defined (antes
recording failed): HTML/runner no cargan tick_transaction.js; los tests nuevos lo
cargan explícitamente como exige la orden. No se inserta kernel en index.html.
Aun después de cargarlo, los consumidores web/legacy deben migrar de Trajectory
directa a ExperimentResult. js/main.js sigue usando experiment.run().steps;
se identifica sin modificarlo. T12 makeResource, T13 EffectKind, T14 makeHazard,
T16 invalid initial_state conservan causas. No se ocultan regresiones por igualdad
de conteos ni se adapta el resultado al esquema antiguo contra §20.
`git diff --check`: limpio; referencias internas y alcance verificados.

### Cierre y preparación de replay

F3-F **COMPLETED en alcance local**: ambos modos y errores normativamente definidos
funcionan end-to-end con trayectorias registradas. Política interna fail-stop
verificada; atomicidad conjunta no implementada ni convertida en requisito histórico.
Listo para definir el incremento de replay mediante orden posterior, **sin iniciarlo**.
Pendientes: contrato completo de diagnóstico/recuperación interno, coordinación
si se requiere rollback global, rendimiento de Recorder, UI/cargador, replay,
V2–V10, T01–T280 e interoperabilidad. Conformidad global no demostrada.
Solo experiment.js, tests/f3-f.test.cjs y este documento cambian. Sin cambios en
norma, WORLD, agentes, semillas/PRNG, WLS1, F3-A/F3-E, configuración, interfaz,
renderer, index.html ni main.js. Sin merge automático ni despliegue.

<a id="f3-g"></a>
## F3-G — replay PARTIAL; dos ramas contractuales bloqueadas

Corte 2026-11-10 (America/Guayaquil), rama dev/f3-g-replay-core; base main PR #21:
`943458da7340ead3f947aa54bcbc97186b5fa732`. Orden F3-G y resolución posterior del
responsable «F3-G: Resolución contractual de §25», recibida en este chat. Se leyó
§25 v0.2.5 y los fragmentos transmitidos; no el documento histórico completo.
**Estado: PARTIAL**, incluso con los siete statuses ejecutados para el subconjunto
no bloqueado. No se declara validación exhaustiva, conformidad global o Hito C.

### Contratos recuperados y ámbito disponible

HISTORICAL RECOVERED por la orden y resolución: firma
replay_trajectory(initial_state, initial_events, actions, world_config,
feedback_config, expected_steps, max_ticks); once campos cerrados de ReplayResult;
siete statuses y orden de validación/ejecución especificados. expected_steps es
**Number entero seguro no negativo [0,2^53−1], admite0 y rechaza BigInt**.
INVALID_REPLAY_INPUT.unused_actions es actions.length si la lista es válida,
0 en otro caso. La atribución de recuperación auténtica proviene del responsable;
VERIFIED aquí: contenido recibido, contraste con código/norma y pruebas locales.

Funciona: origen time0 o0n, eventos iniciales registrados válidos, expected_steps
en su dominio y max_ticks representable exactamente como contador Number seguro
(incluido BigInt pequeño convertido sin pérdida). max_ticks semántico se valida
con tick_max_ticks/is_uint64 existentes, sin reducir el dominio WORLD/F3-A.

ReplayResult exacto: status, records, events, final_state, executed, unused_actions,
max_ticks_used, expected_steps_used, unknown_action_index, error_message,
termination_hint. Los records conservan los once campos StepRecord existentes,
no un esquema alternativo. Final state y registros/eventos son copias independientes.

### Casos bloqueados: caracterización, no conformidad

**A — parámetros inválidos y representación de *_used (TR-001/010).** La resolución
confirma dos obligaciones incompatibles para parámetros inválidos: *_used enteros
seguros e igualdad con los valores recibidos. No define representación alternativa.
Si expected_steps es negativo/fraccionario/NaN/BigInt/inseguro, o max_ticks es
inválido, no se fabrica INVALID_REPLAY_INPUT con valores0/null/normalizados.
Se propaga el ContractError de la primera validación fallida, respetando el orden;
no se presenta esa excepción como la solución normativa de la rama.

Una instancia adicional de la misma frontera: max_ticks uint64 válido pero mayor
que MAX_SAFE_INTEGER tampoco cabe en el contador histórico Number seguro. En ese
caso el motor rechaza con world transition failed tras validar entradas, sin
etiquetarlo falsamente invalid max_ticks ni bajar el límite del kernel. Para BigInt
representable se conserva el valor matemático exacto en *_used Number (F3G-P03).
Prueba F3G-16 caracteriza estas restricciones; no acredita conformidad del caso
bloqueado. F3G-26 prueba el máximo Number seguro sin ejecutar un episodio enorme.

Propuesta mínima pendiente de autorización: decidir una política explícita de
excepción para parámetros inválidos, o revisar la nulabilidad/igualdad y dominio
de *_used en ese status. Para uint64 grande, armonizar el dominio del contador de
resultado con el límite temporal o fijar explícitamente la frontera del replay.
No se aplica ninguna de esas alternativas ni se modifica la norma aquí.

**B — initial_state.time>0 (TR-001/010).** §25.1 recuperado permite origen≤max_ticks
sin exigir0, pero validate_initial_events_consistency de WORLD exige0 y P0-7
obliga a invocarlo. Recorder.record_initial_state también exige0. La reconstrucción
pura admite uint64 completo, pero el replay público queda bloqueado para origen
positivo: propaga invalid initial_events, sin presentar como históricamente inválido
un estado que §25 admite. F3G-17 prueba ambas precondiciones incompatibles, no las
relaja. No se desplaza el reloj ni se falsifican snapshots/metadata para sortearlas.

Propuesta mínima: aclarar el dominio normativo del origen (si se acota a0) o
autorizar una adaptación específica de validación inicial/Recorder para un origen
arbitrario, con reglas temporales precisas. No se modifica ninguna dependencia
protegida. Por estos bloqueos F3-G **no puede declararse COMPLETED**.

### Motor y decisiones técnicas

[replay.js](../js/experiment/replay.js) añade replay_trajectory,
validate_replay_inputs, validate_ReplayResult_structure y helpers de reconstrucción,
checkpoint y exportación de prefijo. Valida en orden WorldConfig, FeedbackConfig,
WorldState, RecordedEvents iniciales, estructura de todas las acciones y números.
Unknown type no se rechaza en el escaneo estructural; se alcanza incrementalmente.
El validador de eventos de Recorder reutiliza la consistencia compartida P0-7.

Orden por índice: determine_termination (DEAD antes del límite), agotamiento de
acciones, tipo desconocido, kernel F3-A, record_step F3-E. Cero pasos pedidos se
satisface con OK y hint calculado por la función única; si faltan pasos, una causa
terminal produce status parcial, **no OK**. No hay agente ni otro motor de acciones.

| Status disponible | Contadores y salida |
|---|---|
| OK | executed=records.length=expected_steps; hint=determine_termination sobre el estado final; error/index null |
| EARLY_TERMINATION | executed<expected, estado DEAD; hint/error/index null |
| MAX_TICKS_REACHED | executed<expected, límite alcanzado y no DEAD; hint/error/index null |
| INCOMPLETE_ACTION_SEQUENCE | executed=actions.length<expected; unused0; hint/error/index null |
| UNKNOWN_ACTION | index=executed<actions.length; unknown incluye la acción no ejecutada entre unused; hint/error null |
| EXECUTION_ERROR | Solo prefijo confirmado; error_message de catálogo, index/hint null; final_state del checkpoint |
| INVALID_REPLAY_INPUT | Cuando parámetros/counters no están bloqueados: records/events[], final_state=null, executed0, hint/index null, error de validación; unused según lista válida |

Para entradas no inválidas unused_actions=max(0,actions.length−executed), incluidos
sobrantes de OK y acción fallida/desconocida. expected_steps_used conserva Number;
max_ticks_used conserva valor exacto representable. No se consumen acciones extra
para buscar errores después de cumplir la cantidad pedida o alcanzar terminación.

**F3G-P01 — ENGINEERING DECISION de adaptación privada:** Recorder exige
ExperimentConfig, aunque la firma de replay no recibe semilla/tipo de experimento.
Se usa contexto técnico privado experiment_seed=1/agent_type=replay, con WORLD,
Feedback y max_ticks reales. No son la configuración ni semilla original y no se
exponen en ReplayResult; no se deriva semilla, crea agente ni consume RNG por ellos.
WORLD se reconstruye copiando el estado efectivo y restaurando PRNG directamente
desde rng_state. Alternativa de interpretar rng_state como experiment_seed se
rechaza; tampoco se vuelve a inicializar el mapa. F3G-02/22 acreditan ausencia de
generación, selección, derivación, agente y draws adicionales.

**F3G-P02 — checkpoint de dos propietarios, específico de replay:** se captura
snapshot WORLD, referencia PRNG y su estado interno, y las siete ranuras nativas de
Recorder antes del tick. F3-E no muta prefijos en sitio, por lo que sus referencias
previas son suficientes para restaurarlos. Si falla WORLD/Recorder o la copia del
nuevo prefijo, se restauran los dos propietarios y se conserva el último prefijo
independiente ya capturado. Esto incluye una excepción después de que Recorder
haya completado su propio commit. No hay reintento. Errores de fase WORLD se
normalizan a world transition failed; fase registro/copia a recording failed,
dentro de §26.6. El checkpoint fallido antes de mutar también se diagnostica.

El prefijo consistente exportado no recalcula hashes al manejar el fallo: puede
retornarse EXECUTION_ERROR aunque la dependencia de hashing continúe fallando.
Los hashes se habían verificado en el commit Recorder anterior. Se usa su copiador
existente; no se finge finalize de una Trajectory no terminal ni se le asigna
AGENT_CONTRACT_ERROR para exportarla. F3-F conserva exactamente su fail-stop;
su frontera de errores no se altera por el rollback de replay.

**F3G-P03 — representación de parámetros/resultados:** BigInt seguro de max_ticks
se convierte sin pérdida a Number para *_used, respetando el contrato histórico de
contador y la igualdad numérica. BigInt de expected_steps no se admite. Si no hay
representación compatible, se aísla el bloqueo A, no se cambia WORLD ni se fabrica
un resultado. validate_replay_inputs devuelve contexto validado/copias o lanza;
validate_ReplayResult_structure devuelve booleano y usa STEP_RECORD_FIELDS/validadores
existentes. No recalcula por reejecución ni certifica toda §25.3.1; esa validación
exhaustiva queda fuera de F3-G. El replay reconstruye Observation/Feedback según la
firma recibida; no recibe un modo para inferir contextos null de una trayectoria
sin agente. La comparación integral ejecutada utiliza episodios con agente F3-F.

### Pruebas, fases y ejemplo real

La primera prueba integral F3G-01 reproduce una trayectoria real de run_experiment
F3-F con tres pasos: igualdad estructural de snapshots, resultados, eventos y
bytes WLS1. F3G-10 prueba la API pública y el esquema completo; F3G-23 reproduce
movimientos y muerte, no solo una trayectoria con lista de eventos vacía.

| Casos F3G | Evidencia ejecutada |
|---|---|
| 01/10/23 | F3-F real → replay, estructura de records, RecordedEvents, bytes/hashes y orden global |
| 02/06/07/08/09/21/22 | Restauración exacta/no generación/derivación, muerte inicial, uint64 puro, repetición y copias independientes, sin reenriquecimiento; lifecycle/sync solo por tick |
| 03/04/05/19/20/24/27 | Errores de WORLD, Recorder tras transición y publicación, excepción después del commit, hash persistente y checkpoint; contadores prueban fase alcanzada y restauración de prefijo/RNG |
| 11–15/18 | Cero pasos, hint DEAD>MAX, precedencias incrementales, todos los statuses, cantidades/índices, validación inicial en orden |
| 16/17 | **Caracterización de bloqueos A/B, no conformidad**: el error observado permanece explícito |
| 25/26 | Esquemas/huecos/counters/hints del validador mínimo, límites Number seguros sin simulación enorme |

Ejemplo F3G-23/F3F-21: config semilla1, mapa2×2 FREE/NONE, energía3, costeMOVE1,
límite3; acciones MOVE_E/MOVE_W/MOVE_E según posición inicial. Replay devuelve:
statusOK, executed3, unused_actions0, expected_steps_used3, max_ticks_used3,
unknown_action_index=null, error_message=null, termination_hint=ENTITY_DIED.
Los cuatro RecordedEvents coinciden exactamente con F3-F; hash final WORLD
1573707962 y FULL3948499472, idénticos a la trayectoria fuente. Son resultados
locales, no nuevos vectores normativos ni prueba de interoperabilidad independiente.

En F3G-04 se fuerza estado PRNG interno diferente al rng_state persistido antes
del tick: el fallo restaura ambos valores y la referencia original del generador.
F3G-05 falla después de escritura efectiva sequence_counter; F3G-20 después del
commit Recorder completo; ambos conservan exactamente un paso y su WORLD previo.
F3G-24 retorna ese prefijo sin volver a llamar un hash persistentemente fallido.
F3G-27 falla en la segunda lectura time0 de WORLD.full_snapshot, correspondiente
al checkpoint antes de la primera transición; no se atribuye a una fase no alcanzada.
La garantía cubre objetos nativos y fases sin mutación hostil de prefijos/descriptores,
como F3-A/F3-E; no presume restauración arbitraria de prototipos/configuración.

### Regresión ejecutada

Node v24.22.1, /workspace/yellow. Comando `node tests/<archivo>` para cada suite;
exit0, sin fallos ni omitidas. Tests anteriores idénticos byte a byte a main.

| Archivo | PASS |
|---|---|
| f1-a.test.cjs | 18 |
| f1-b.test.cjs | 12 |
| f2-a.test.cjs | 14 |
| f2-b.test.cjs | 13 |
| f2-c.test.cjs | 21 |
| f2-d.test.cjs | 28 |
| f2-e.test.cjs | 16 |
| f2-f.test.cjs | 18 |
| f2-g.test.cjs | 21 |
| f2-h.test.cjs | 15 |
| f2-i.test.cjs | 18 |
| f3-a.test.cjs | 40 |
| f3-b.test.cjs | 18 |
| f3-c.test.cjs | 24 |
| f3-d.test.cjs | 12 |
| f3-d2.test.cjs | 15 |
| f3-e.test.cjs | 24 |
| f3-f.test.cjs | 23 |
| f3-g.test.cjs | **27** (25 de comportamiento local y2 de caracterización) |
| Total | **377** |

`node tests/f1-a-legacy.cjs`: 13 PASS/9 FAIL, exit1, mismas causas que F3-F:
T06/07/08/20/22 determine_termination is not defined (cargador HTML sin kernel);
T12 makeResource, T13 EffectKind, T14 makeHazard, T16 invalid initial_state.
No se cambian expectativas ni se carga replay en HTML. `git diff --check`: limpio;
referencias y alcance verificados. Ningún test local equivale a T01–T280 ejecutado.

### Entrega parcial y continuación

Solo replay.js, tests/f3-g.test.cjs y este documento cambian. WORLD, Recorder,
PRNG, WLS1, F3-F, agentes, web y norma permanecen intactos. Motor no bloqueado
listo para revisión; faltan autorización que resuelva A/B y representación de
contadores grandes, y validación exhaustiva de continuidad/resultados externos.
Se conservan el coste cuadrático heredado de Recorder y copias adicionales de
prefijo; no se introduce optimización no autorizada ni se repite el benchmark500.
F3-G sigue **PARTIAL**; no se inicia la validación integral ni otro incremento.
Sin merge automático ni despliegue.

<a id="f3-h"></a>
## F3-H — validación exhaustiva con contexto; cierre PARTIAL

Corte 2026-11-10 (America/Guayaquil), base main posterior al PR #22:
`7a8f34668c70d3e4da217915030ecba476c17f94`, rama dev/f3-h-replay-validation.
Se implementan las verificaciones no bloqueadas sobre copias independientes,
utilizando el kernel existente; **no** se declara F3-H completo universalmente.
Persisten A/B de F3-G y dos fronteras de publicación/contexto descritas debajo.
400 pruebas locales; no son certificación T01–T280 ni interoperabilidad global.

### Recuperación, firma y autoridad

Fuente: orden F3-H y respuesta del responsable «Resolución histórica §25.7,
§25.8 y contexto» recibida en este chat. HISTORICAL RECOVERED: una versión anterior
documentaba validate_replay(original, replay_result, world_config) → Match/Mismatch
con reason; derive_termination_reason(replay_result) → ENTITY_DIED |
MAX_TICKS_REACHED | INDETERMINATE. No se afirma que v0.2.4 reenumerase esas firmas
ni todos sus diagnósticos: exige comparación exhaustiva con request_context y
remite a §25.3. No se leyó el documento histórico íntegro externo.

NORMATIVE v0.2.5: validate_ReplayResult(rr,request_context), continuidad §25.3.1,
hint §25.3.2, igualdad estructural y RNG/dinámica, nunca hashes como sustituto.
La recuperación precisa que request_context suministra WorldConfig/FeedbackConfig,
pero **no** cómo los recibe la firma pública de continuidad de tres argumentos.
Se preservan las firmas publicadas sin añadir parámetros por conveniencia.

### Funciones y responsabilidades implementadas

| Función | Alcance y resultado |
|---|---|
| validate_ReplayResult(rr,request_context) | Booleano Valid/Invalid sobre dominio no bloqueado: esquema, dominios, compromisos con contexto, estados por status, acciones, contexto observado, eventos, hashes y reejecución independiente |
| replay_continuity_proof(rr,context,...) | Helper **interno de ingeniería**, contexto explícito; una transición F3-A por registro y comparación completa. No se publica como nueva firma normativa |
| validate_replay_continuity(rr,initial_state,actions) | Firma3 preservada; caso vacío verifica la invariante por paso vacía. No vacío: frontera **PARTIAL**, error explícito sin inventar configuración |
| validate_termination_hint(rr) | Reglas exactas §25.3.2: DEAD coherente, MAX solo ACTIVE con time≥max, null permitido incluso en estado terminal |
| derive_termination_reason(rr) | Hint no nulo primero; luego final_state null→INDETERMINATE, DEAD, límite, INDETERMINATE. Solo recibe rr, nunca consulta original ni deduce fin por expected_steps satisfecho |
| validate_replay(original,rr,world_config) | Firma histórica3: valida original, valida rr con contexto explícito construido de config/estado/eventos/acciones originales, exige OK, compara todo, deriva causa y devuelve MATCH/MISMATCH |

**F3H-P01 — ENGINEERING DECISION de implementación:** el helper interno recibe
contexto validado completo; no usa defaults, estado global, WeakMap de procedencia
ni inferencia de parámetros físicos del snapshot. Reconstruye un WORLD separado
con el RNG inicial y ejecuta F3-A secuencialmente una sola vez por registro. Calcula
Observation antes del tick y Feedback desde el resultado **reproducido** anterior.
Compara reloj, acción solicitada, ActionResult, WORLD completo (grid/stock/lifecycle/
RNG incluidos), entity_states y ambos hashes. Comprueba eventos crudos contra las
listas registradas y su metadata/orden/sequence; no inventa eventos ausentes ni
produce enriquecimiento fuera de Recorder. El agregado global debe coincidir con
initial_events y todos los eventos confirmados. Final_state debe coincidir con el
estado reproducido, incluido el caso executed0 y la copia inicial exacta.

La comparación es estructural, sin depender de orden de propiedades/prototipos.
Clocks uint64 Number/BigInt se comparan matemáticamente exactos; valores binary64
mantienen exactitud salvo cero canónico conforme a §6.4. No hay tolerancias numéricas
ni comparación limitada a posición/energía. WorldConfig/FeedbackConfig proceden de
request_context o, en D, de la configuración explícita de original y del argumento
world_config, cuya correspondencia se verifica. Los objetos originales no se mutan.

Se verifican los siete statuses en su dominio autorizado. Para INC/UNKNOWN se
exige que una condición terminal no debiera haber prevalecido. EXECUTION_ERROR
valida el prefijo determinista y diagnóstico dentro de §26.6: no pretende demostrar
por simulación que ocurrió una avería operacional externa. INVALID compatible se
contrasta con el primer error real de validate_replay_inputs y unused correcto.
Los casos bloqueados no se convierten en resultados ficticios.

El validador mínimo F3-G conserva su uso de comprobación de salida del motor.
El validador normativo nuevo acepta hint=null terminal cuando §25.3.2 lo permite,
aunque F3-G al **construir** OK calcule el hint. Esta distinción no cambia el motor
ni relaja las reglas de hint no nulo: MAX con entidad DEAD es siempre inválido.
La derivación prioriza el hint ya validado, como exige la fuente recuperada.

**F3H-P02 — representación JS y diagnóstico:** booleanos representan Valid/Invalid,
como los predicados existentes. validate_replay devuelve {status:MATCH} o
{status:MISMATCH,reason:string}; ese envelope JS y los textos reason son decisiones
de ingeniería, **no** transcripciones de un esquema/catálogo histórico completo.
No se añaden categorías a ReplayResult.status ni error_message. Los motivos sirven
para distinguir original inválido, rr inválido, status, cantidad, registros,
final_state, eventos y terminación, sin atribuirles nombres normativos no recuperados.
Metadata permanece opaca y no se le atribuye conformidad ni se exige contenido
idéntico a un campo inexistente en ReplayResult.

El original también se reejecuta para validar su coherencia, incluido su motivo
terminal. Una trayectoria parcial AGENT_CONTRACT_ERROR puede ser un original
estructuralmente válido, pero su replay no terminal deriva INDETERMINATE: §25.7
no permite convertir eso en MATCH. Los statuses parciales de rr pueden ser Valid
para A; D exige OK. Satisfacer expected_steps no equivale a terminar el WORLD.

### Fronteras restantes y propuestas mínimas

1. **A/B F3-G, sin cambios:** INVALID con parámetros no representables y origen
   time>0 siguen bloqueados. Las pruebas F3G-16/17 permanecen idénticas; no se
   modifican WORLD, Recorder o precondiciones iniciales. Contadores uint64 grandes
   conservan la frontera de representación ya registrada, sin reducir el kernel.
2. **Continuidad pública no vacía sin contexto:** los tres argumentos no aportan
   WorldConfig/FeedbackConfig. El mismo estado/WAIT puede producir energía distinta
   con costes diferentes. La resolución prohíbe defaults, globales o inferencia.
   A ejecuta la prueba completa con su helper explícito; el wrapper3 no falsea
   Invalid para un replay correcto, sino que lanza world transition failed como
   diagnóstico técnico de operación no disponible. El caso vacío es vacuo por
   paso, no una certificación de todo ReplayResult. F3H-15/23 lo caracterizan.
   Corrección mínima pendiente: autorizar suministro explícito de contexto en la
   firma pública, o definir normativamente otro mecanismo; no se improvisa aquí.
3. **Trayectoria sin agente frente a contexto de replay F3-G:** el motor actual
   siempre reconstruye Observation/Feedback y su firma no recibe modo. El original
   sin agente guarda ambos null. D valida ese original con WAIT real y detecta
   **MISMATCH en StepRecord** frente al rr observado, sin borrar/proyectar campos
   para producir MATCH artificial. F3H-16 caracteriza la limitación heredada y no
   certifica aceptación integral de ese modo. Para soportarlo se requiere contrato
   explícito de modo/contexto en replay o una política autorizada de comparación.
   No se altera el motor ni la interfaz en esta fase.

Por estas fronteras el cierre global del incremento es **PARTIAL**, aunque A/C/D/E
y la continuidad interna con contexto estén implementados/verificados en su dominio.
No se presenta como solución de los dos bloqueos originales ni Hito C.

### Contraste positivo/negativo y fases alcanzadas

| Casos F3H | Evidencia ejecutada |
|---|---|
| 01–03 | EXPERIMENT→Replay→MATCH con cero/uno/varios ticks, muerte inicial/posterior y límite; fixture de estado efectivo con recurso, regeneración y peligro |
| 04–08 | Statuses parciales/ERROR/INVALID compatibles, causa del primer error, hints nulos/no nulos, DEAD>MAX y derivación INDETERMINATE sin consultar original |
| 09–13 | Acción/tick/energía/posición/RNG/hashes/mapas/resultado alterados, observación/feedback falsos, estado final y contadores: rechazo |
| 14/17 | Pureza y ausencia de agentes/derivación; Recorder.record_step prohibido durante validación; n llamadas kernel en A, 2n en D |
| 15/16/23 | Caracterización de firma de continuidad y modo sin agente; firmas publicadas y envelope diagnóstico JS |
| 18–22 | Eventos omitidos/duplicados/reordenados/sequence incorrecto; executed0 final≠initial; hashes iguales simulados no ocultan estructura; precedencia de statuses y compromisos con configuración/contexto |

Para perturbaciones semánticas se conservan tipos válidos (hash modificado sigue
uint32, posición dentro del mapa, RNG no cero, etc.) y se comprueba que pasan el
validador mínimo antes de llegar al helper de continuidad. Contadores de invocación
acreditan que alcanza esa fase; no se confunde rechazo por otra representación JS
con detección de una divergencia. Las copias de tests conservan WorldState y Map
en el ámbito correcto, evitando un falso rechazo por cambio de realm.

F3H-03 altera stock regenerado y recalcula hashes: se rechaza por transición real,
no por checksum desactualizado. F3H-10 hace lo mismo con energía y RNG. F3H-20 simula
igualdad de hashes en una prueba **negativa** y aun así rechaza la estructura
alterada; no se generan trayectorias aceptadas con hashes ficticios ni se cambia WLS1.
F3H-18 verifica eventos y metadata; nunca rellena eventos para hacer coincidir listas.
F3H-19 verifica la invariante global de cero ejecuciones sin necesitar un paso.

Ejemplo positivo real: trayectoria con agente WAIT de tres ticks, semilla1,
mapa2×2 FREE/NONE, energía20 y costeWAIT1. Resultado replay OK, executed3,
termination_hintMAX_TICKS_REACHED; validate_ReplayResult=true y validate_replay=MATCH.
En el contraste con energía modificada +0.25 y hashes recalculados correctamente,
validate_ReplayResult=false; no se acepta por consistencia aislada de hashes.

### Rendimiento separado de validación

Comando opcional `node tests/f3-h.test.cjs --benchmark`; no se ejecuta en la suite
normal. Medición única local Node v24.22.1, mapa1×1 FREE/NONE, radio0, energía1000,
WAIT coste0, episodios10/50/100. Se separan generación/replay de validación pura.

| Ticks | EXPERIMENT ms | Replay ms | A: validate_ReplayResult ms | D: validate_replay ms | Kernel A / D |
|---|---|---|---|---|---|
| 10 | 128.94 | 97.24 | 19.31 | 39.96 | 10 /20 |
| 50 | 1296.60 | 1459.22 | 70.10 | 161.10 | 50 /100 |
| 100 | 4856.73 | 5672.01 | 153.91 | 290.80 | 100 /200 |

A es lineal en registros por tamaño de estado/ventana: un kernel por paso. D usa
una prueba del original y otra del rr, ambas lineales, sin crear un segundo proceso
de revalidación cuadrática ni cachés globales de evidencia mutable. Tiempos son
observaciones de una ejecución, no garantías de plataforma. El coste cuadrático
original de Recorder sigue dominando generación/replay y no se optimiza.

### Regresión y disponibilidad

Desde /workspace/yellow: `node tests/<archivo>` para cada suite; exit0, 0 FAIL y
0 omitidas. Ningún archivo de tests anterior fue modificado.

| Archivo | PASS |
|---|---|
| f1-a.test.cjs | 18 |
| f1-b.test.cjs | 12 |
| f2-a.test.cjs | 14 |
| f2-b.test.cjs | 13 |
| f2-c.test.cjs | 21 |
| f2-d.test.cjs | 28 |
| f2-e.test.cjs | 16 |
| f2-f.test.cjs | 18 |
| f2-g.test.cjs | 21 |
| f2-h.test.cjs | 15 |
| f2-i.test.cjs | 18 |
| f3-a.test.cjs | 40 |
| f3-b.test.cjs | 18 |
| f3-c.test.cjs | 24 |
| f3-d.test.cjs | 12 |
| f3-d2.test.cjs | 15 |
| f3-e.test.cjs | 24 |
| f3-f.test.cjs | 23 |
| f3-g.test.cjs | 27 |
| f3-h.test.cjs | **23** |
| Total | **400** |

Legacy `node tests/f1-a-legacy.cjs`: 13 PASS/9 FAIL, exit1; causas idénticas a F3-G:
T06/07/08/20/22 determine_termination is not defined (HTML/runner sin kernel),
T12 makeResource, T13 EffectKind, T14 makeHazard, T16 invalid initial_state.
`git diff --check`: limpio. Enlaces internos, ámbitos de cambios y preservación
del motor F3-G y de los módulos protegidos verificados.

Solo se añaden validadores a replay.js, tests/f3-h.test.cjs y este documento.
El contenido anterior de replay.js se conserva íntegro como prefijo; no cambia el
motor F3-G. Sin cambios a WORLD, PRNG, Recorder, WLS1, EXPERIMENT, agentes, UI,
renderer ni norma. Listo para revisión del alcance implementado; aceptación integral
pendiente de las fronteras indicadas, V2–V10, T01–T280 e interoperabilidad.
Sin merge automático, despliegue, interfaz ni optimización de Recorder.


<a id="f4-a"></a>
## F4-A — integración web del núcleo experimental

**COMPLETED en el alcance web autorizado; VERIFIED 2026-11-10.** Base
`origin/main` posterior al PR #23, SHA
`1491d9213acf7fe1cb2b1e7531889e296b4a61ce`; rama
`dev/f4-a-web-integration`. Entrega para revisión, sin merge ni despliegue.
No cambia WORLD, PRNG, WLS1, RECORDER, EXPERIMENT, replay ni norma. No implica
aceptación integral ni cierre de las cuatro fronteras F3-G/H.

### Contratos consumidos y decisiones de presentación

**NORMATIVE:** se conservan los contratos canónicos implementados por el motor:
WorldState/Cell/Map, reloj exacto Number/BigInt, eventos y separación entre
componentes. La autoridad contractual y decisiones de cada módulo permanecen
en sus incrementos anteriores. No se recupera nuevo texto histórico aquí.

**ENGINEERING DECISION F4A-P01 — vista final independiente:** la entrada llama
`new Experiment(config).run()` y conserva su ExperimentResult sin normalizarlo.
Muestra su status COMPLETED/FAILED, número real de steps/events, termination_reason,
tiempo, entidad, posición, energía/lifecycle y hashes uint32 del último StepRecord
como hexadecimal de ocho dígitos. El estado mostrado es el último world_state,
o initial_state si no hay pasos. Sin pasos no se publican hashes sustitutos.

El renderer recibe `{config, state}` con `state.full_snapshot()` independiente,
validado; lee el único EntityState del Map y conserva coordenadas BOUNDED, celdas
y efectos. No necesita construir otro WORLD, RNG ni ejecutar otra transición.
Se conserva el color azul para la entidad, verde para recursos disponibles, rojo
para peligros, gris oscuro para BLOCKED y claro para celdas libres/recursos agotados.
La información textual se muestra en DOM; el footer anterior tapaba la última
fila del mapa. No se rediseña la interfaz ni se añade dashboard.

**ENGINEERING DECISION F4A-P02 — errores visibles:** FAILED sin trayectoria
muestra el diagnóstico de inicialización y oculta el canvas. FAILED con trayectoria
parcial de agente muestra diagnóstico y los datos reales del prefijo. Un error
interno propagado se muestra como «Error de ejecución», sin fabricar un
ExperimentResult ni una causa terminal. Un error visual tiene su propio mensaje:
no altera el status ni los datos experimentales. F4A-14/15 y Chromium comprueban
que incluso un renderer defectuoso que muta su copia y lanza no cambia el resultado.

**ENGINEERING DECISION F4A-P03 — demostración acotada:** semilla12345, mapa6×6,
máximo10 ticks, configuración canónica por defecto en los demás campos. Dos botones
invocan WaitAgent y RandomAgent reales. No se aumenta timeout ni se optimiza
Recorder; el coste cuadrático de generación/validación de historia sigue vigente.
No se usa Math.random ni se adapta silenciosamente el resultado para dibujar.

### Cargador y cambios auxiliares demostrados

[index.html](../index.html) carga cada script una vez. Se incorporan
[tick_transaction.js](../js/experiment/tick_transaction.js) antes de Recorder y
[replay.js](../js/experiment/replay.js) después de EXPERIMENT, incluyendo sus
validadores. WORLD/contratos, interfaz, agentes, configuración, Trajectory/WLS1 ya
se cargaban y se conservan en orden. main se ejecuta por DOMContentLoaded.

Se retira `js/tests/tests.js` de la página de producción. Las pruebas v0.1
permanecen intactas en el repositorio y se ejecutan explícitamente desde el runner
legacy. Los cargadores de F3-E/F/G/H usaban ese script como barrera y cargaban
kernel/replay a mano: al cambiar HTML, F3-E alcanzó `window` sin DOM y sus24 casos
fallaron. Solo se modifican esas cuatro funciones load para omitir main/renderer y
cargar los módulos reales una vez desde HTML; todas sus aserciones se preservan.
El runner legacy carga su archivo histórico si la página no lo incluyó, y conserva
su ruta --baseline sin duplicar la declaración Tests.

Cambio auxiliar CSS justificado por prueba real: `canvas {display:block}` anulaba
`hidden`, dejando visible un canvas tras fallo. F4A-16 falló con display block
frente a none. Se añade únicamente `canvas[hidden] {display:none}`; la misma prueba
pasa después. No se añaden estilos decorativos.

### Correspondencia y evidencia ejecutada

Suite local [tests/f4-a.test.cjs](../tests/f4-a.test.cjs); IDs F4A locales,
no sustituyen T01–T280 ni convierten reglas FROZEN en evidencia empírica.

| Comprobación | Casos ejecutados |
|---|---|
| Orden real, unicidad, kernel/replay, legacy fuera de producción | F4A-01/02, Chromium F4A-16 |
| ExperimentResult y hashes/cantidades reales, Wait/Random, repetibilidad | F4A-03/04, F4A-16 |
| Muerte, muerte inicial, límite cero, estado inicial sin pasos | F4A-05–07, F4A-16 |
| Fallo inicial y de agente; errores internos sin falso éxito | F4A-08–10, F4A-16 para inicial/agente |
| Map, coordenadas, stock/efectos, BigInt, lectura sin mutación | F4A-11–13, F4A-16 para Map/posición/BigInt/pureza |
| Copia independiente, error visual sin cambiar resultado | F4A-14/15, F4A-16 |

Comandos para reproducir desde `/workspace/yellow`, Node v24.22.1
(se ejecutó cada archivo mediante `node tests/<archivo>`):

```bash
for suite in tests/f*-*.test.cjs; do node "$suite" || exit; done
node tests/f1-a-legacy.cjs
git diff --check
```

Las21 suites Node terminan con exit0: las400 pruebas anteriores más15 nuevas,
**415 PASS, 0 FAIL, 0 omitidas**. Detalle por archivo:

| Suite | PASS | Suite | PASS |
|---|---|---|---|
| F1-A | 18 | F1-B | 12 |
| F2-A | 14 | F2-B | 13 |
| F2-C | 21 | F2-D | 28 |
| F2-E | 16 | F2-F | 18 |
| F2-G | 21 | F2-H | 15 |
| F2-I | 18 | F3-A | 40 |
| F3-B | 18 | F3-C | 24 |
| F3-D | 12 | F3-D/2 | 15 |
| F3-E | 24 | F3-F | 23 |
| F3-G | 27 | F3-H | 23 |
| F4-A Node/DOM | 15 | Total Node | **415** |

Prueba real opcional y reproducible con Playwright/Chromium disponibles:

```bash
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
CHROMIUM_EXECUTABLE=/usr/bin/chromium F4A_SCREENSHOT=/tmp/f4-a-web.png \
node tests/f4-a.test.cjs --browser
```

El modo --browser ejecutó15 casos Node más F4A-16: **16 PASS, 0 FAIL**, con
Chromium155.0.8059.79 headless, viewport1000×760 y HTTP local efímero. La primera
invocación en sandbox falló al abrir localhost con EPERM; se ejecutó la misma
prueba fuera del sandbox. Servidor/navegador se cierran al terminar. No es despliegue.
El navegador no registró pageerror, errores de consola ni solicitudes fallidas.
El pixel en el centro de la posición real de entidad fue RGBA(33,150,243,255).

| Caso Chromium (mapa2×2, semilla12345, WAIT coste1 salvo indicación) | Resultado observado |
|---|---|
| Wait, límite3 | COMPLETED,3 pasos,0 eventos, MAX_TICKS_REACHED |
| Random, límite3 | COMPLETED,3 pasos,1 evento, MAX_TICKS_REACHED |
| Energía1 | COMPLETED,1 paso,1 evento, ENTITY_DIED |
| Energía0 | COMPLETED,0 pasos,1 evento inicial, ENTITY_DIED |
| Límite0 | COMPLETED,0 pasos,0 eventos, MAX_TICKS_REACHED |
| obstacle_density=1 | FAILED, trayectoria null, INITIALIZATION_ERROR/invalid initial_position; canvas invisible |
| Agente lanza en segunda llamada | FAILED,1 paso preservado, AGENT_CONTRACT_ERROR visible |
| Error visual inyectado | status COMPLETED conservado, datos intactos, canvas invisible, diagnóstico separado |

La captura `/tmp/f4-a-web.png` se generó y se inspeccionó visualmente; es evidencia
de ejecución local, no un archivo versionado ni una dirección de despliegue.
Demostración Random por defecto:10 pasos,5 eventos, MAX_TICKS_REACHED, tiempo10,
entidad0987898 en(1,3), energía90 ACTIVE, hashWORLD `0x8cd3ed79`,
hashFULL `0x8c60e4f`. El mapa6×6 y la entidad azul coinciden con el estado final.

### Pruebas históricas y límites pendientes

Legacy ejecutada: **13 PASS/9 FAIL, exit1**. Las expectativas no se cambian.

| Casos legacy | Error actual | Clasificación |
|---|---|---|
| T06/07/08/20/22 | Cannot read properties of undefined (reading 'length') | Ahora se alcanza EXPERIMENT con kernel; acceden a .steps de ExperimentResult como si fuera Trajectory directa. El error anterior determine_termination is not defined desaparece |
| T12 | makeResource is not defined | Factory histórica eliminada |
| T13 | EffectKind is not defined | Enum histórico eliminado |
| T14 | makeHazard is not defined | Factory histórica eliminada |
| T16 | invalid initial_state | Expectativa TOROIDAL incompatible con BOUNDED |

T18 sigue siendo un PASS histórico débil (captura su propia aserción) y T20 no
comprueba replay real; no se presentan como verificación canónica. No se introducen
aliases, enums ni geometría legacy para cambiar el total.

**VERIFIED:** integración web y evidencia Chromium descritas, suites locales,
conservación de aserciones antiguas y módulos protegidos. **UNTESTED:** otros motores
de navegador, dispositivos móviles y accesibilidad exhaustiva; no se infieren de
Chromium headless. Captura inspeccionada no equivale a interoperabilidad.

Permanecen las cuatro fronteras F3-G/H: INVALID con parámetros no representables,
origen time>0, continuidad pública no vacía sin contexto y comparación de
trayectorias sin agente con replay observado. No se modifican. También permanecen
la frontera uint64/StepRecord Number seguro, rollback conjunto WORLD/Recorder,
coste de Recorder, vectoresV2–V10, T01–T280 e interoperabilidad no demostrada.
La web está lista para revisión de su alcance; la aceptación integral conserva
estas dependencias. No se avanza a otro incremento.


<a id="f4-b"></a>
## F4-B — optimización equivalente de RECORDER; cierre PARTIAL

**PARTIAL, 2026-11-10.** Base `origin/main`, PR #24,
`a096d5b3ac0ac4763a6dee03e2018f56b459bd9a`; rama
`dev/f4-b-recorder-performance`. Se entrega una reducción equivalente del trabajo
redundante. No se implementa ni se declara un registro de coste aproximadamente
lineal. F4B-P02 permanece **BLOCKED por decisión técnica pendiente**, no por una
contradicción normativa nueva ni por falta de fuentes históricas.

### Autoridad y diagnóstico previo

**NORMATIVE:** §§18,21–24,31–34 v0.2.5 se conservan, incluidos eventos crudos y
su enriquecimiento, campos cerrados de StepRecord/Trajectory, WLS1/FNV, valores
binary64, nulabilidad y orden. **HISTORICAL:** se consumen únicamente los fragmentos
ya recuperados y documentados en F3-C/E/D2; no se afirma lectura histórica completa.

**ENGINEERING DECISION vigente F3E-P01:** las propiedades públicas y sus registros
anidados son mutables; registrar un nuevo paso detecta corrupción del prefijo
mediante validación exhaustiva. RecordTransaction reemplaza sus siete ranuras y
arrays, y restaura sus referencias al fallar. finalize valida y copia el historial
completo. Estas garantías observables se mantienen, incluidas las referencias a
arrays antiguos que no crecen tras futuras confirmaciones.

Antes de modificar recorder.js se ejecutaron benchmarks de10/100 y500 ticks
contra todos los scripts obtenidos del commit base con `git show`. Dos cargas:
WORLD1×1, WAIT sin agente; WORLD2×1, agente alternando MOVE_E/MOVE_W con un evento
por tick. Radio0, semilla12345, energía10000, costeWAIT0, demás campos canónicos.
Cada fila usa una VM nueva. La fuente base es independiente del código optimizado;
no se reconstruye una supuesta referencia copiando el algoritmo actual.

Para100 ticks sin agente, record_step consumió3898,868ms de4069,398ms totales;
se recorrieron10.200 registros en validaciones completas, con20.600 invocaciones
a hashes. El tiempo acumulado dentro de hashes fue2766,416ms. Para500 ticks,
record_step consumió86486,409ms de87277,227ms totales. El coste dominante fue
revalidar/serializar el prefijo, no WORLD ni finalize. Las copias de eventos y los
slices de arrays también acumulan trabajo cuadrático, aunque de menor coste.

### Cambio exacto y garantías preservadas

**F4B-P01 — ENGINEERING DECISION implementada y VERIFIED:** extraer la preparación
de entradas en `_prepare_step_input`, reutilizada por el wrapper `_prepare_step`
y record_step. El wrapper independiente conserva su validación de prefijo F3-C.
record_step prepara sin esa validación/copia previa redundante; `_record` y
RecordTransaction siguen validando exhaustivamente **todo el candidato** una vez
antes de publicar. Se verifican tanto registros previos como el paso nuevo,
contextos, secuencias, snapshots, mapas, hashes y concatenación global de eventos.

No se quita la validación posterior ni se crea una marca de confianza. No se
congela, encapsula ni sustituye por snapshots de lectura la historia pública.
Las copias del prefijo y eventos que sirven a la publicación siguen presentes.
La detección de corrupción sigue ocurriendo en la misma llamada pública antes de
cualquier publicación; solo desaparece una visita interna previa a la preparación.
Todos los errores públicos conservan ContractError("recording failed").

RecordTransaction y su contrato público no cambian. Se conservan copias
independientes, orden de eventos, secuencias globales, retry del mismo confirmed,
rollback de siete ranuras/referencias y ausencia de rollback WORLD desde Recorder.
finalize no se modifica: comprobación exhaustiva, copia profunda y causa real.
No se mueve trabajo omitido a otra operación. No hay cambio a resultados válidos,
esquemas, representación Number/BigInt, bytes, hashes ni API de comando undefined.

### F4B-P02 — BLOCKED: propiedad del prefijo y coste lineal

La orden F4-B §5.C exige «No aplicar una relajación silenciosa de garantías»
y aislar como BLOCKED el cambio de una garantía técnica que requiera decisión.
Este es el caso de F3E-P01 y de los aliases públicos descritos aquí; la optimización
equivalente F4B-P01 sí se completa y verifica.

En JavaScript los registros publicados siguen siendo objetos/arrays/Map mutables
ordinarios. Un tercero puede modificar un campo de cualquier paso antiguo sin
cambiar la referencia del array ni del registro. Sin instrumentar esas escrituras,
una marca de «ya validado» no permite detectar el cambio: es necesario volver a
inspeccionar el prefijo. Las pruebas F4B-11/12 acreditan que su corrupción continúa
rechazándose al registrar y al finalizar, y que no cambió su mutabilidad.

Segundo impedimento independiente: copiar arrays de longitud creciente y todos
los eventos previos en cada publicación sigue sumando O(n²), aunque se omitiese
la validación histórica. Cambiarlo por push en los mismos arrays haría crecer las
referencias antiguas que hoy permanecen como prefijos. Los objetos de eventos
globales también se copian entre confirmaciones. No se elimina ninguna de esas
copias alterando silenciosamente la propiedad de sus referencias.

Alternativas consideradas, **no autorizadas ni aplicadas** en F4-B:

- Encapsular un log de propiedad exclusiva, con acceso explícito a snapshots y
  registros protegidos de mutaciones externas. Cambiaría la posibilidad de escribir
  directamente steps/events y sus objetos/Map anidados; no basta Object.freeze(Map).
- Conservar estructuras mutables y diferir la validación exhaustiva a finalize o
  una verificación explícita. Cambiaría la garantía de que el siguiente record_step
  detecta corrupción antigua. No alcanza por sí sola coste lineal si persisten las
  copias completas de arrays/eventos por tick.
- Añadir seguimiento de todas las escrituras mediante envoltorios. Modifica las
  superficies públicas y requiere resolver identidad, Map y métodos de WorldState;
  no se introduce esa arquitectura en este incremento.

**Propuesta mínima para una orden posterior:** autorizar conjuntamente una política
explícita de propiedad/mutabilidad y un commit append sobre buffers propios con
rollback por longitudes. Debe especificar si se permiten alias públicos que crezcan,
si las escrituras externas se rechazan o afectan solo snapshots y cuándo se detecta
corrupción previa. Después podrá validarse solo el elemento nuevo y su continuidad,
con verificación completa al finalizar. Requiere pruebas de compatibilidad para
consumidores/replay; no se aplica anticipadamente. Se conserva F3E-P01 hasta esa
decisión. No se atribuye esta restricción de ingeniería a una cláusula normativa
histórica inexistente.

La validación heredada comprueba sus invariantes estructurales/contextuales y
hashes, no reejecuta todas las acciones para acreditar continuidad física completa;
esa responsabilidad de replay no se amplía ni se debilita aquí.

### Pruebas de equivalencia, atomicidad e integración

[tests/f4-b.test.cjs](../tests/f4-b.test.cjs) obtiene **todos los scripts de la
referencia desde el SHA base**, no solo una función simulada. Se comparan resultados
completos mediante igualdad estructural exacta y bytes WORLD/FULL de cada estado.
Se conservan Maps, orden, binary64 y distinción Number/BigInt; no se usa JSON para
igualar valores. Los hashes no sustituyen la igualdad estructural.

| Casos locales | Evidencia ejecutada |
|---|---|
| F4B-01/02 | Referencia fijada; uno,5 y200 ticks sin agente; cada snapshot WLS1 WORLD/FULL |
| F4B-03 | Agente real y16 combinaciones de flags, contexto de acción previa |
| F4B-04 | RESOURCE consumido y regenerado, HAZARD, siete eventos ordenados y secuencias0–6 |
| F4B-05/06 | Muerte inicial/posterior, límite0, inicialización fallida, fallo de agente con prefijo |
| F4B-07 | finalize y entradas independientes, posiciones, Maps, eventos, snapshots |
| F4B-08 | Fallos de snapshot, dos lotes de eventos, serialización, dos hashes, copia de candidato y dos validadores; mismas pruebas sobre base y rama; retry sin duplicar secuencias |
| F4B-09 | Excepción después de cada una de las siete escrituras; se restauran valores y referencias |
| F4B-10 | Confirmed/contexto inválidos y corrupción de copia provisional, sin publicación parcial |
| F4B-11/12 | Once mutaciones externas, rechazo al siguiente registro/finalize, mutabilidad y aliases conservados |
| F4B-13 | Menos validaciones/hashes/copias sin confiar permanentemente en un prefijo mutable |
| F4B-14 | EXPERIMENT→replay→validación exhaustiva: MATCH y registros/eventos iguales, sobre base y rama |
| F4B-15 | Replay restaura WORLD/RNG/Recorder ante fallo de publicación parcial y posterior al retorno de record_step |
| F4B-16/17 | Sin acceso/mutación de WORLD/PRNG; time0n→1n sin pérdida, tick Number, límites seguros y agotamiento de secuencias |
| F4B-18 | RandomAgent con semilla: trayectoria completa y snapshots RNG iguales a la base |

Comandos ejecutados desde `/workspace/yellow`, Node v24.22.1:

```bash
node tests/f4-b.test.cjs
node tests/f1-a-legacy.cjs
git diff --check
```

Cada suite previa se ejecutó mediante `node tests/<archivo>`. Nueva suite:
**18 PASS/0 FAIL**. Regresión F1–F4-A:21 suites,**415 PASS/0 FAIL**. Total:
**433 PASS,0 FAIL,0 omitidas**, en22 suites Node. Ninguna prueba previa se modifica.
Los IDs F4B son locales; no se presentan como T01–T280 ni conformance global.
Los conteos por archivo de las21 suites previas son los mismos de [F4-A](#f4-a),
reejecutados con el Recorder de esta rama. Además se ejecutó:

```bash
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
```

Resultado:16 PASS (15 Node repetidas y un caso real adicional), Chromium155.0.8059.79,
sin pageerror, errores de consola ni solicitudes fallidas. Agentes, errores y
renderizado puro/repetible siguen funcionando; no se modifica ningún archivo web.
Esto no amplía la verificación a otros navegadores.

El sandbox rechazó subprocesos Node→git con EPERM; la suite nueva y los benchmarks
con referencia Git se ejecutaron fuera del sandbox. No se sustituyó la referencia
por el código de trabajo para evitar ese error.

Legacy:13 PASS/9 FAIL, exit1. T06/07/08/20/22 esperan Trajectory directa y fallan
al leer length desde ExperimentResult; T12 makeResource, T13 EffectKind y T14
makeHazard son interfaces históricas eliminadas; T16 conserva expectativa TOROIDAL
incompatible con BOUNDED. Ninguna expectativa se cambia para mejorar el total.

### Benchmarks instrumentados y coste que permanece

Comandos ejecutados (separados de la suite unitaria):

```bash
node tests/f4-b.test.cjs --benchmark --baseline-only --sizes=10,100,500 --with-events
node tests/f4-b.test.cjs --benchmark --working-only --sizes=10,100,500 --with-events
node tests/f4-b.test.cjs --benchmark --sizes=1000
```

Tiempos en milisegundos, una observación por fila, mismo entorno Node v24.22.1 y
misma configuración/semilla por carga. No son medianas ni garantías de plataforma;
entorno compartido, sin aislamiento de CPU. Las envolturas de instrumentación
son idénticas en ambas versiones. WORLD mide execute_tick_transaction; Registro
mide record_step; Fin mide finalize. Hashes es tiempo inclusivo dentro de las otras
operaciones: **no se suma de nuevo**. Total mide el ciclo real run_without_agent o
run_experiment, incluidos setup, contexto, terminación y finalización; no incluye
carga de fuentes Git/VM ni pruebas de igualdad posteriores.

| Carga | Ticks | Versión | Total ms | WORLD ms | Registro ms | Fin ms | Hashes ms |
|---|---|---|---|---|---|---|---|
| WAIT sin agente | 10 | base | 93.735 | 13.326 | 60.951 | 7.814 | 44.766 |
| WAIT sin agente | 10 | F4-B | 78.809 | 11.949 | 37.563 | 9.935 | 31.282 |
| WAIT sin agente | 100 | base | 4069.398 | 71.502 | 3898.868 | 52.079 | 2766.416 |
| WAIT sin agente | 100 | F4-B | 2415.763 | 85.421 | 2225.481 | 56.243 | 1571.862 |
| WAIT sin agente | 500 | base | 87277.227 | 362.236 | 86486.409 | 224.474 | 60603.253 |
| WAIT sin agente | 500 | F4-B | 52830.771 | 419.816 | 51888.010 | 267.887 | 36414.154 |
| WAIT sin agente | 1000 | base | 369072.199 | 689.043 | 367541.775 | 446.960 | 256450.552 |
| WAIT sin agente | 1000 | F4-B | 177031.692 | 679.459 | 175559.187 | 413.343 | 122697.884 |
| MOVE observado | 10 | base | 136.462 | 25.110 | 92.624 | 8.207 | 52.224 |
| MOVE observado | 10 | F4-B | 103.598 | 16.350 | 64.693 | 7.925 | 35.852 |
| MOVE observado | 100 | base | 5156.786 | 91.120 | 4908.550 | 80.409 | 2759.000 |
| MOVE observado | 100 | F4-B | 3451.222 | 103.537 | 3034.596 | 228.464 | 1753.417 |
| MOVE observado | 500 | base | 122612.422 | 499.543 | 121474.246 | 300.899 | 66418.256 |
| MOVE observado | 500 | F4-B | 77857.183 | 541.843 | 76481.745 | 373.634 | 41564.179 |

Contadores del episodio completo: validaciones `_validate_prepared`, incluidos
los dos registros iniciales, fijación de causa y finalize. Pasos visitados cuenta
la longitud de cada candidato validado, no solo llamadas. Copias de pasos son
entradas copiadas por slices; copias de eventos son registros globales copiados
en `_prepare_current`, sin contar las nuevas listas del paso ni la copia final de
salida. Las dos cargas tienen los mismos conteos salvo eventos (cero en WAIT).

| Ticks | Versión | Validaciones completas | Pasos visitados | Hashes WORLD+FULL | Entradas de arrays copiadas | Eventos previos copiados (MOVE) |
|---|---|---|---|---|---|---|
| 10 | base | 24 | 120 | 260 | 110 | 110 |
| 10 | F4-B | 14 | 75 | 170 | 65 | 65 |
| 100 | base | 204 | 10200 | 20600 | 10100 | 10100 |
| 100 | F4-B | 104 | 5250 | 10700 | 5150 | 5150 |
| 500 | base | 1004 | 251000 | 503000 | 250500 | 250500 |
| 500 | F4-B | 504 | 126250 | 253500 | 125750 | 125750 |
| 1000 | base | 2004 | 1002000 | 2006000 | 1001000 | n/a (WAIT sin eventos) |
| 1000 | F4-B | 1004 | 502500 | 1007000 | 501500 | n/a (WAIT sin eventos) |

En 500 ticks sin agente, el total mejora 87277→52831 ms (aprox.1,65×) y el registro
86486→51888 ms. Con MOVE observado, total 122612→77857 ms (aprox.1,57×). No se
fija un porcentaje de aceleración como criterio normativo. La integridad, copia
final y hashing del prefijo no se ocultan en otra fase.

Para n ticks completos de estas cargas, las validaciones pasan de2n+4 a n+4 y
las visitas a pasos de n²+2n a (n²+5n)/2. Las llamadas a hashes pasan de2n²+6n a
n²+7n. Las entradas de arrays copiadas pasan de n²+n a (n²+3n)/2; con un evento
por tick sucede lo mismo con las copias de eventos anteriores. Son conteos de
trabajo observado y explican por qué **el coste sigue siendo cuadrático**, aunque
se reduzca aproximadamente a la mitad en cargas largas. finalize sigue haciendo
una sola validación exhaustiva y copia de O(n) para un WORLD fijo.

La carga de 1000 ticks fue viable y se completó en ambas versiones. Total
369072,199→177031,692ms (aprox.2,08×); record_step 367541,775→175559,187ms.
WORLD 689,043→679,459ms y finalize 446,960→413,343ms: la mejora no se consigue
trasladando trabajo a esas fases. El número de hashes es 2006000→1007000.
Esta observación adicional no convierte la tendencia de conteos cuadráticos en
lineal ni elimina F4B-P02. No se ejecutó 1000 con MOVE observado; los 500 ticks con
eventos ya caracterizan las copias crecientes. Los tiempos inclusivos y el entorno
compartido explican que las razones temporales no sean constantes.

### Cierre y límites

**VERIFIED:** reducción de trabajo redundante, equivalencia estructural/binaria
contra base, atomicidad, corrupción detectable en la siguiente llamada/finalize,
regresión, integración EXPERIMENT/replay/validación y web Chromium. Las 18 pruebas
nuevas y las415 anteriores pasan; el caso Chromium adicional pasa. `git diff --check`
sin errores. Norma, suites previas y componentes protegidos se preservan íntegros.

**BLOCKED:** garantía/propiedad de historial para registro aproximadamente lineal
(F4B-P02); no se cambia silenciosamente F3E-P01 ni la publicación por reemplazo.
**UNTESTED:** conformance global T01–T280, vectoresV2–V10 e interoperabilidad;
las cuatro fronteras F3-G/H y el límite uint64 frente a StepRecord Number seguro
siguen abiertos. No se modifica replay ni se inicia aceptación integral.

Solo cambian [recorder.js](../js/experiment/recorder.js),
[tests/f4-b.test.cjs](../tests/f4-b.test.cjs) y este documento. Listo para revisar la
optimización equivalente y decidir F4B-P02 por separado. No se presenta como F4-B
COMPLETED. Sin merge, despliegue ni avance al siguiente incremento.


<a id="f4-c"></a>
## F4-C — propiedad exclusiva y publicación incremental de RECORDER

**COMPLETED en el alcance de ingeniería autorizado, VERIFIED 2026-11-11 UTC.**
Base main posterior al PR #25, `635b4a493aabcf35c85ea3c5a47aca174a29c671`,
rama `dev/f4-c-recorder-linear`. No se fusiona ni despliega. No se amplía aceptación
integral ni se resuelven las cuatro fronteras contractuales F3-G/H.

### F4C-P01: autoridad y sustitución deliberada de F3E-P01

**NORMATIVE/HISTORICAL:** se conservan los contratos ya documentados de
§§18,21–24,31–34: métodos públicos de registro, StepRecord/Trajectory cerrados,
eventos y orden, WLS1/FNV, representación numérica, nulabilidad y terminación.
No se atribuye a las fuentes históricas el mecanismo nuevo de almacenamiento.
La norma y los módulos WORLD/PRNG/semillas/WLS1/EXPERIMENT/agentes/web permanecen
intactos. No se altera la semántica de replay ni los validadores F3-H.

**ENGINEERING DECISION autorizada F4C-P01:** sustituye expresamente F3E-P01.
RECORDER posee el historial en un WeakMap cerrado dentro de la misma clausura que
RecordTransaction. Ese mapa y los buffers no se exportan. Las siete propiedades
públicas siguen siendo legibles y enumerables, pero son accesores no configurables:
steps/events/initial_state/initialization_failure entregan copias independientes;
contador, flag y causa entregan escalares. Reemplazarlas lanza el error existente
ContractError("recording failed"). Las escrituras en un snapshot, incluso mediante
Map.set/delete/clear, no afectan al almacenamiento. No se usa Object.freeze(Map)
como protección ni un sistema de observación de mutaciones.

Las entradas se copian/validan y se adopta otra copia privada antes de publicar.
Los valores entregados a hooks de validación/publicación también quedan separados
de la copia adoptada. Un hook que retiene prepared o su paso no obtiene el objeto
almacenado. El anterior estado/resultados usados por validadores son copias acotadas.
El acceso por consulta no entrega aliases mutables del prefijo real.

| Garantía / comportamiento | F4-B | F4-C autorizado |
|---|---|---|
| Escritura de recorder.steps/events y escalares | Propiedades escribibles | Sustitución explícitamente rechazada |
| Mutación de un objeto obtenido de steps | Puede cambiar historial; siguiente registro detecta corrupción cubierta por el validador | Modifica solo un snapshot; el historial no cambia |
| Identidad en lecturas repetidas | Referencias públicas estables hasta reemplazo de arrays; pasos antiguos compartidos | Snapshots nuevos e independientes |
| Integridad en ingreso | Nuevo dato y prefijo completo | Nuevo dato, contexto anterior y continuidad; ambos protegidos por propiedad |
| Integridad almacenada | Revalidación de objetos externamente mutables | Propiedad exclusiva sin referencias de escritura entregadas |
| Corrupción interna inducida | Detección al registrar/finalizar | Detección exhaustiva en finalize o verificación explícita |
| Resultado de finalize | Copia independiente y validada | Copia independiente y validada, mismo esquema/valores |

### Puerta de compatibilidad realizada antes de implementar

Se buscaron todos los accesos de producción y pruebas a las siete propiedades,
RecordTransaction, _prepare_current y _validate_prepared. No hay consumidores de
escritura adicionales en agentes, renderer, interfaz o EXPERIMENT.

| Consumidor | Acceso anterior y clasificación | Tratamiento |
|---|---|---|
| EXPERIMENT F3-F | Solo métodos de registro, causa y finalize; lectura legítima | Sin cambio de archivo ni contrato |
| Replay F3-G, tick | Lee steps.length/último ActionResult y guarda/restaura siete campos; dependencia de identidad/escritura | Último resultado copiado en O(1) para eventos acotados; checkpoint opaco y restore privados |
| Replay, prefijo | Copia todos los registros/eventos después de cada tick; consulta obligatoria superlineal | Motor coordina ticks sin exportar arrays; exporta el prefijo al construir el resultado |
| replay_confirmed_tick/prefix_snapshot | Helpers de ingeniería consultados explícitamente por tests | Se conserva su firma y salida con copia independiente bajo petición |
| Validadores F3-H | Métodos puros sobre estructuras recibidas | Sin cambios; reproducción contextual y comparación exhaustiva continúan funcionando |
| main/renderer | Consumen ExperimentResult/Trajectory, no buffers Recorder | Sin cambios; Chromium reejecutado |
| Tests F3-C/F/G/H y demás regresiones | Lecturas/snapshots/fallos | Sin modificaciones |
| Tests F3-E/F4-B ligados a F3E-P01 | Identidad de referencias, mutación externa y doble validación/copia | Actualización controlada detallada debajo; pruebas históricas preservadas en Git/base |

No fue necesario modificar firmas normativas ni eliminar una garantía explícita
recuperada de §21. Los cambios de mutabilidad e identidad tienen autorización
expresa en esta orden, y no se presentan como equivalencia de esa política antigua.

### Registro y protocolo privado

Por tick se prepara únicamente el paso nuevo, sus eventos/contextos/copias y
hashes. Se valida el estado anterior, el nuevo ConfirmedTickResult, continuidad,
identidad, ActionResult, observación/feedback y secuencias. _validate_step se aplica
solo al paso nuevo. No se reserializa un paso antiguo durante record_step.

RecordTransaction conserva constructor(recorder), commit(prepare,validate) y el
hook _publish(key,value); commit completo se usa para inicialización sin pasos.
Añade _append para el delta interno cerrado {step,events,sequence_counter,
termination_reason}, donde step=null corresponde al cambio de causa sin nuevo
registro. El delta no es StepRecord/Trajectory ni una API normativa nueva.
La adopción privada copia solo ese delta; steps/events se anexan a buffers propios.
No se copian arrays crecientes al confirmar cada tick.

El checkpoint guarda referencias privadas a buffers, longitudes, escalares y la
identidad del último elemento del prefijo. Rollback restaura ranuras/longitudes;
no toca pasos anteriores. También revierte el último escalar si falla la séptima
publicación. Las secuencias no se consumen y el mismo confirmed puede reintentarse.
No revierte WORLD desde RECORDER.

Interfaces privadas acotadas de integración:

- _checkpoint() devuelve un token vacío congelado, cuya información queda en otro
  WeakMap privado, ligada al Recorder que lo creó. No entrega arrays ni snapshots.
- _restore_checkpoint(token) rechaza tokens falsos/ajenos, restauraciones durante
  una transacción y prefijos descartados. Si el buffer vuelve a crecer después de
  rollback, la identidad de su extremo impide revivir un token de la rama anterior.
- _history_length() y _prior_action_result() dan cantidad y copia del último
  resultado sin consultar/copiar steps completo.
- _last_state() devuelve copia del último estado o del inicial, coste por WORLD fijo.
- _export_prefix() produce registros/eventos/estado final independientes cuando
  se solicita un prefijo completo; no se invoca en cada tick del motor de replay.

_prepare_current sigue disponible como snapshot completo independiente para
consultas/verificación; no se usa en el camino normal de record_step.
_validate_prepared sigue siendo exhaustivo. finalize obtiene un snapshot completo,
lo verifica y entrega esos datos separados del almacenamiento; se hace una única
validación histórica final. El cambio de causa se valida con el último estado,
sin volver a recorrer todo el episodio. No se oculta trabajo en otra fase.

Replay conserva los siete estados, los checkpoints WORLD/RNG independientes,
los prefijos y el rollback incluso cuando record_step lanza después de devolver
su propio commit. Usa replay_tick_transaction como helper interno; la firma de
replay_trajectory y los wrappers anteriores no cambian. Para cero ticks o fallo
inicial se conserva el snapshot inicial efectivo; para pasos confirmados la
exportación final usa el historial privado ya confirmado, sin otro sorteo ni
resolución de lifecycle. No se modifican las reglas terminales ni F3-H. Si la asignación de memoria para
exportar el resultado final falla, no se fabrica un ReplayResult parcial; no se
promete devolver datos cuya copia no pueda construirse.

### Integridad y límites de atomicidad

La transacción es síncrona: tras retorno o excepción, los consumidores reciben
un historial completo o el prefijo anterior, respectivamente. Un WeakSet rechaza
escrituras/checkpoints reentrantes mientras se prepara/publica. F4C-13 demuestra
el rollback de una escritura anidada rechazada.

No se declara aislamiento de lecturas reentrantes desde hooks instrumentados
_publish: esos hooks de prueba pueden observar fases intermedias (como ya hacían
F3-F/G), antes de que una excepción restaure el prefijo. Tampoco se promete
atomicidad frente a reemplazar código confiable, modificar internamente buffers
desde un depurador o escrituras concurrentes arbitrarias. No hay callback de
consumidor en la implementación de publicación normal.

La corrupción interna inducida se comprueba sin dar una puerta de escritura en
producción. El cargador F4C de prueba puede insertar un método solo en su VM de
ensayo para alcanzar el WeakMap privado. Ese método no existe en recorder.js real.
Se alteran hashes, esquemas, mapas, eventos, contador y estado; finalize rechaza.
Los copiadores verifican esquemas cerrados antes de reconstruir registros, para
que una propiedad extra corrupta no se borre y parezca validada al copiarla.
La validación no se sustituye por un checksum ni por una marca sobre datos
externamente mutables.

### Expectativas históricas actualizadas de forma controlada

Antes de actualizar se ejecutaron las suites: F3-C/F/G/H pasaron; F3-E falló solo
en F3E-15/18; F4-B caracterizó las dependencias de identidad/mutabilidad y su antiguo
camino de validación/copia. Se conservan las versiones originales en el SHA base
635b4a493aabcf35c85ea3c5a47aca174a29c671, no se borran del historial.

| Prueba/helper actualizado | Motivo autorizado y nueva evidencia |
|---|---|
| F3E-15 | Una validación del nuevo paso, frente a >=2 por revisitar el anterior; fallo sigue alcanzando ese validador y preserva el prefijo |
| F3E-18 | Mutación de snapshot externo queda aislada, finalize preserva el historial; corrupción interna se cubre en F4C-08 |
| F4-B unchanged | Compara valores; identidad estricta de snapshots solo se conserva en la referencia histórica con propiedades de datos |
| F4B-08 | Los hooks de copia/validación completa por tick se sustituyen por preparación/validación incremental; mismo fallo, hits, atomicidad y retry. La base usa los hooks originales |
| F4B-10 | Se corrompe el lote nuevo provisional, no una copia histórica que ya no existe por tick; sigue rechazándose sin publicación |
| F4B-11/12 | Rama actual acredita aislamiento/rechazo de sustitución; la base conserva mutación/detección e identidad originales |
| F4B-13 | Una visita histórica por paso al finalizar, frente a más visitas antiguas; trabajo reducido sin confianza en aliases mutables |
| F4B-17 | Para time0n se adopta el snapshot antes de registrar; el contador es readonly. Helpers de límites y agotamiento se conservan |

Las demás aserciones/ficheros previos no se cambian. F4C-01 compara directamente la
semántica antigua sobre scripts base: la corrupción pública provoca rechazo allí,
mientras la misma escritura externa actual no cambia el historial. La equivalencia
normativa se contrasta por separado con la referencia, sin suponer equivalencia
de las políticas de ingeniería sustituidas.

### Pruebas y evidencia funcional

Suite local [tests/f4-c.test.cjs](../tests/f4-c.test.cjs), scripts de referencia
obtenidos directamente de todo el commit base con git show. Igualdad estructural
exacta de resultados y bytes WLS1 WORLD/FULL de todos los snapshots; se preservan
Maps, binary64 y representaciones Number/BigInt. No se usa solo igualdad de hashes.

| Casos | Evidencia ejecutada |
|---|---|
| F4C-01/02 | Cambio de política explícito; episodios0/1/4/100/500 y bytes completos equivalentes a F4-B |
| F4C-03/04 | Agentes y Random con semilla,16 flags Feedback, recursos/peligros/regeneración, muerte inicial/posterior y fallo inicial |
| F4C-05–07 | Snapshots, Maps, raíces readonly, datos de hooks y salidas finales sin aliases mutables internos |
| F4C-08/09 | Corrupción interna detectada sin normalizar; token opaco ligado a propietario/prefijo, sin resurrección de ramas descartadas |
| F4C-10–13 | Fallos en preparación/hash/validación/copia de adopción y cada publicación; retry y secuencias; escritura reentrante rechazada |
| F4C-14–16 | EXPERIMENT→replay→validación MATCH; siete estados y errores iguales a F4-B; rollback WORLD/RNG/Recorder después de commit |
| F4C-17/18 | Dominios Number/BigInt, secuencias y ausencia de acceso/mutación de WORLD/PRNG |
| F4C-19/20 | Conteos lineales; cero visitas/copias de prefijo y cero consultas públicas obligatorias por tick; exportación replay única |

Ejecución desde /workspace/yellow, Node v24.22.1:

```bash
node tests/f4-c.test.cjs
node tests/f4-b.test.cjs
node tests/f1-a-legacy.cjs
git diff --check
```

Además se ejecutó node tests/<archivo> para cada suite F1–F4-A. Resultado final:
23 suites, **453 PASS/0 FAIL/0 omitidas** (415 anteriores a F4-B,18 F4-B,20 F4-C).
Las versiones originales de los dos archivos adaptados quedan en Git; no se
cambian expectativas legacy. Los IDs F4C son locales, no T01–T280.

```bash
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
```

Chromium155.0.8059.79 real:16 PASS (15 Node repetidas y un caso adicional), sin
pageerror/errores de consola/solicitudes fallidas. Wait/Random, errores, muerte
inicial, coordenadas y aislamiento visual se preservan, sin cambios a UI/CSS.
La referencia Git y Chromium se ejecutan fuera del sandbox por sus restricciones
a subprocesos/localhost; no se altera el oráculo para evitar esas restricciones.

Legacy ejecutada: **13 PASS/9 FAIL, exit1**, mismas causas F4-A/B:
T06/07/08/20/22 esperan Trajectory directa; T12/13/14 usan makeResource/EffectKind/
makeHazard eliminados; T16 espera TOROIDAL. No se introducen aliases ni se corrigen
aserciones históricas para mejorar el total.


### Complejidad y benchmarks

Comandos ejecutados, separados de las pruebas funcionales:

```bash
node tests/f4-c.test.cjs --benchmark
node tests/f4-c.test.cjs --benchmark --working-only
node tests/f4-c.test.cjs --benchmark --sizes=10,100 --events
node tests/f4-c.test.cjs --benchmark --working-only --sizes=500 --events
```

Referencia F4-B desde el SHA base; mismas configuraciones y entorno Node v24.22.1.
Carga WAIT sin agente: WORLD1×1, radio0, semilla12345, energía10000, costeWAIT0;
demás campos canónicos por defecto. Cada observación crea una VM nueva. Se ejecutó
la serie pareada y se repitió la versión final tras endurecer los tokens de
checkpoint. La tabla usa la referencia de la serie principal y esa repetición final,
no medianas ni aislamiento de CPU. La serie principal completa también se resume
abajo para no ocultar variación entre ejecuciones.

Tiempos en ms. WORLD es execute_tick_transaction. Preparación incluye construcción
y validación del candidato, con su hashing. Hashes mide por separado todas las
llamadas WORLD/FULL, incluidas las de finalize, por lo que **se solapa** con otras
columnas y no se suma otra vez. Commit excluye callbacks de preparación/validación
e incluye copia privada de adopción, checkpoint y publicación. Finalización incluye
su propia verificación y copia. Total mide EXPERIMENT completo, incluyendo setup,
contextos y cambio de causa; excluye carga Git/VM. No se oculta el trabajo de la
copia de propiedad: ahora pertenece a Commit y aparece en el total.

| Ticks | Versión | WORLD | Prep.+valid. | Hashes (inclusivo) | Commit | finalize | Total |
|---|---|---|---|---|---|---|---|
| 10 | F4-B base | 8.966 | 32.926 | 24.639 | 0.320 | 5.588 | 57.336 |
| 10 | F4-C final | 18.603 | 34.602 | 19.690 | 5.875 | 11.832 | 83.200 |
| 100 | F4-B base | 69.215 | 1832.183 | 1315.399 | 2.326 | 47.715 | 1999.944 |
| 100 | F4-C final | 126.188 | 292.574 | 154.890 | 30.111 | 96.111 | 561.995 |
| 500 | F4-B base | 315.794 | 41550.074 | 29321.711 | 10.446 | 462.884 | 42549.729 |
| 500 | F4-C final | 1390.894 | 2692.069 | 2090.581 | 362.167 | 1696.745 | 6263.305 |
| 1000 | F4-B base | 831.647 | 209639.092 | 146785.930 | 21.509 | 458.495 | 211374.555 |
| 1000 | F4-C final | 918.775 | 1696.973 | 1034.860 | 242.215 | 655.102 | 3601.416 |

La versión final de500 ticks fue más lenta que la de1000 en esta repetición,
con ralentización también en WORLD/finalize: los tiempos del entorno compartido
son ruidosos y no se usan solos como prueba de complejidad. La serie pareada
principal dio estos totales (ms):

| Ticks | F4-B | F4-C |
|---|---|---|
| 10 | 57.336 | 40.004 |
| 100 | 1999.944 | 272.536 |
| 500 | 42549.729 | 2296.737 |
| 1000 | 211374.555 | 2478.814 |

Evidencia de trabajo, independiente del ruido temporal. Visitas antiguas y copias
de prefijo se cuentan **durante record_step**, excluyendo finalize. Elementos
publicados es la longitud total de los arrays de pasos entregados a _publish;
en F4-B contienen el candidato completo y en F4-C solo el delta nuevo. Copias
propias F4-C cuenta tanto adopción como salida final; no oculta la segunda copia.

| Ticks | Versión | Visitas antiguas en registro | Entradas de prefijo copiadas | Elementos de pasos publicados | Hashes episodio | Visitas finalize |
|---|---|---|---|---|---|---|
| 10 | F4-B | 45 | 45 | 55 | 170 | 10 |
| 10 | F4-C | 0 | 0 | 10 | 60 | 10 |
| 100 | F4-B | 4950 | 4950 | 5050 | 10700 | 100 |
| 100 | F4-C | 0 | 0 | 100 | 600 | 100 |
| 500 | F4-B | 124750 | 124750 | 125250 | 253500 | 500 |
| 500 | F4-C | 0 | 0 | 500 | 3000 | 500 |
| 1000 | F4-B | 499500 | 499500 | 500500 | 1007000 | 1000 |
| 1000 | F4-C | 0 | 0 | 1000 | 6000 | 1000 |

F4C-19 instrumenta10/100/500 ticks con un evento por tick y acredita:

- Cero visitas a pasos antiguos durante registro y cero copias de prefijo.
- n pasos nuevos publicados y n eventos nuevos publicados; un delta por tick.
- 2n copias privadas de pasos: n al adoptar y n al exportar al finalizar.
- 5n copias de RecordedEvent para preparar/adoptar/exportar, sin recopia histórica.
- 6n llamadas a hashes: dos al construir el paso, dos al validarlo, dos al verificarlo
  en finalize. Solo se serializa el paso nuevo durante registro.
- n visitas históricas en finalize y tres llamadas totales al validador completo:
  dos para inicialización vacía y una única pasada histórica final.
- Cero consultas a las propiedades públicas obligatorias durante EXPERIMENT;
  replay también cumple cero y exporta su prefijo una vez (F4C-20).

Por WORLD/radio fijos y eventos acotados, preparación y adopción cuestan O(S+K)
por tick; append usa buffers propios con inserción amortizada O(1) por elemento.
El registro total es O(n·(S+K)); para S/K fijos es O(n). La única verificación/copia
final es O(n·(S+K)). Los contadores, el código y las pruebas respaldan esta afirmación;
no se deduce únicamente de aceleración temporal. Consultas externas deliberadas
que pidan todo el historial siguen costando O(n); no se trasladan al bucle obligatorio.


Carga adicional MOVE observado en WORLD2×1, radio0, un ENTITY_MOVED por tick,
mismos parámetros en ambas versiones. Se midieron también elementos de eventos
enviados a publicación y llamadas a su copiador, no solo los arrays de pasos.

| Ticks | Versión | Total ms | Registro ms | Eventos enviados a publicación | Copias RecordedEvent totales |
|---|---|---|---|---|---|
| 10 | F4-B | 76.126 | 45.510 | 55 | 95 |
| 10 | F4-C | 49.542 | 23.901 | 10 | 50 |
| 100 | F4-B | 4218.645 | 3863.074 | 5050 | 5450 |
| 100 | F4-C | 723.546 | 352.116 | 100 | 500 |
| 500 | F4-C | 2046.350 | 1090.478 | 500 | 2500 |

En F4-B las copias de eventos son n(n−1)/2+5n para esta carga. En F4-C son5n:
la eliminación del crecimiento cuadrático incluye pasos **y eventos**. El coste
de nuevas listas/copias sigue contabilizado; los valores y secuencias se verifican
contra la referencia. F4C-19/20 se reejecutaron después de añadir estos contadores:
2 PASS/0 FAIL, además de la suite completa previamente descrita.

### Cierre, riesgos y aceptación integral

**VERIFIED:** propiedad efectiva por snapshots independientes, validación
incremental, append/rollback, equivalencia de estructuras/bytes, dominios, siete
estados replay, validación contextual y Chromium. No hay visitas/copias de prefijo
por tick; el trabajo de registro bajo S/K acotados es lineal con una pasada final.
**F4B-P02 cerrado por la autorización e implementación F4C-P01**, sin reescribir
el informe histórico F4-B ni atribuirle una conformidad que entonces no tenía.

La verificación histórica valida esquemas, contextos, secuencias, mapas y hashes;
no reejecuta cada acción para demostrar continuidad física. Esa prueba de
reproducción estructural conserva su lugar en F3-H. No se confunden ambas garantías.

**UNTESTED / fuera de alcance:** conformidad global T01–T280, vectoresV2–V10 e
interoperabilidad; otros navegadores/accesibilidad exhaustiva. Permanecen las
cuatro fronteras F3-G/H, uint64 frente a StepRecord Number seguro y el rollback
conjunto WORLD/Recorder fuera de replay. Consultar todo el historial en cada tick
por decisión de un consumidor externo puede costar O(n²); no ocurre en los
consumidores obligatorios migrados. No se promete aislamiento de hooks reentrantes
que sustituyan el código de publicación.

Archivos de producción modificados: [recorder.js](../js/experiment/recorder.js) y
[replay.js](../js/experiment/replay.js). Pruebas: nueva
[f4-c.test.cjs](../tests/f4-c.test.cjs), ajustes autorizados de
[f3-e.test.cjs](../tests/f3-e.test.cjs) y [f4-b.test.cjs](../tests/f4-b.test.cjs).
Se actualiza únicamente este informe operacional. No cambia norma, WORLD, PRNG,
semillas, WLS1, EXPERIMENT, agentes, interfaz, renderer ni CSS. Listo para revisión
del alcance F4-C; sin merge, despliegue ni inicio de otro incremento.


<a id="f4-d"></a>
## F4-D — paquete de correcciones contractuales; revisión COMPLETED

Base main PR #26 `37a718c3680092f46b0d0ba79fc5920d25400a2a`.
**COMPLETED como revisión**, no como cierre de conflictos ni conformidad.
Único archivo cambiado: este informe. Ningún texto siguiente modifica la norma
vigente: todo texto de reemplazo está marcado **PROPOSED CHANGE** y requiere
aprobación del paquete D-01 antes de implementar. No se eliminan bloqueos actuales.

### Autoridad y evidencia

**NORMATIVE:** transcripción v0.2.5 §§11.7,18,20–26,31–37. §25.3 exige igualdad
de *_used con solicitud; P0-6 exige final_state idéntico al origen si executed=0
salvo INVALID; §25.3.1 exige continuidad; §25.3.2 define hints y precedencia;
§22 exige tick Number seguro; §37 exige ejecutar T01–T280 y ausencia de críticos.
**HISTORICAL:** fragmentos de §25 v0.2.4 transmitidos por el responsable y registrados
en F3-G/H: expected_steps Number seguro no negativo; time≤max_ticks sin exigir
cero; firma histórica validate_replay(original,rr,world_config); derivación terminal
sin consultar original. No hay documento histórico completo independiente en el
repositorio y no se afirma haberlo leído. La firma anterior recuperada de una
versión previa no se atribuye automáticamente a cada cláusula v0.2.4.
**ENGINEERING:** F3A-P01 uint64 Number/BigInt; F3C-P01 representación segura de eventos;
F3H-P01 helper con contexto; F4C-P01 propiedad/checkpoints. No son nuevas cláusulas
normativas. **PROPOSED CHANGE:** todas las precisiones D-01 que siguen.

Se inspeccionaron replay.js (validación, motor y comparador), Recorder F4-C,
EXPERIMENT, WORLD/validator inicial y las caracterizaciones F3-G/H. Se reejecutaron:
`node tests/f3-g.test.cjs` y `node tests/f3-h.test.cjs`:27+23=**50 PASS/0 FAIL**.
Las453 PASS previas pertenecen a F4-C; no se presentan como nueva ejecución F4-D.
No se crean pruebas nuevas: las existentes ya aportan los contraejemplos focales.

### Tabla de conflictos y cuestiones transversales vigentes

| ID | Clasificación actual | Fuente y contraejemplo mínimo | Imposibilidad / comportamiento actual |
|---|---|---|---|
| A | CONTRACTUAL CONFLICT | §25.2 histórico contador seguro + §25.3 igualdad; expected_steps="x", max_ticks=3 | Un campo no puede ser entero seguro y valer "x"; F3G-16 mantiene excepción, no un INVALID ficticio |
| B | CONTRACTUAL CONFLICT | §25.1 histórico time≤max; P0-7 §25.3.3/§11.7; snapshot ACTIVE,time=1,max=2,events=[] | Validador compartido y Recorder requieren origen0; F3G-17 rechaza invalid initial_events; §11.7 de la transcripción fija metadata tick0, no debe citarse falsamente como frase literal time=0 |
| C | PENDING DECISION | §25.3.1 firma3; mismo snapshot, WAIT, costes1 y2 | Configuración no recuperable del snapshot; wrapper no vacío lanza world transition failed. Helper contextual funciona; F3H-15/23 |
| D | PENDING DECISION | P0-3 §§20.2/22/27/32; una acción WAIT con agente vs sin agente | Mismo movimiento físico, StepRecords distintos por observation/feedback; comparador devuelve MISMATCH sin borrar campos, F3H-16 |
| E | CONTRACTUAL CONFLICT de integración | §7/F3A uint64 vs §22 tick seguro; time=2^53−1 y siguiente tick=2^53 | WORLD puede confirmar; Recorder rechaza la representación. No se reduce max_ticks; F3F-18/F3E-11 |
| F | RESOLVED en dominio soportado | P0-6, §25.3; expected_steps=0, origen0 | Estado final igual al inicial, eventos iniciales conservados, muerte prevalece sobre límite; F3G-11/F3H-19 |
| G | EXPLICIT LIMITATION | §§23,25.7/25.8; trayectoria de1 WAIT detenida por error de agente con WORLD ACTIVE bajo límite | Replay reproduce prefijo, deriva INDETERMINATE; no puede probar el fallo de un agente ausente. MATCH terminal no autorizado; F3H-08 |
| H | RESOLVED con límites explícitos | §25.3.2 y §5.4; DEAD y time=max simultáneos | ENTITY_DIED prevalece; hint=null permitido incluso terminal, no prueba terminación por agotamiento de acciones; F3H-05–08 |
| I | EXPLICIT LIMITATION | §§20.6/26.5 vs coordinación replay | EXPERIMENT propaga fallo WORLD/Recorder y conserva prefijo sin retry; replay restaura WORLD/RNG/Recorder. No equivalen a rollback conjunto en EXPERIMENT; F3F-14/15, F3G-03–05/19/20, F4C-16 |

No se demuestra un IMPLEMENTATION DEFECT nuevo: A/B/E son incompatibilidades
contractuales, C/D requieren completar contratos y G/I son límites explícitos.
Una implementación posterior que difiera de un contrato ya aprobado sí sería un
defecto; no se reclasifican lagunas como bugs para cambiar APIs sin autoridad.

### D-01 — propuesta única recomendada para aprobación

Recomendar aprobar conjuntamente A–E siguientes, con F–I conservados. Es un paquete
coherente de correcciones explícitas, no una autorización vigente. No introduce
estados de replay, acciones ni motivos terminales nuevos. No hay defaults de modo
o configuración. Alternativa global: limitar replay a origen0, Number seguro y
modo observado; mantiene incompatibilidades históricas y no cierra el dominio
anunciado. Se recomienda cobertura explícita del dominio, con cambios mínimos a
los campos temporales existentes, sin agregar claves a ReplayResult/StepRecord.

#### A/E — contadores inválidos y representación temporal

**Alternativas:** (a) copiar cualquier parámetro inválido en *_used destruye el
dominio cerrado y puede retener objetos mutables; (b) usar cero/otro número inventa
un parámetro; (c) null explícito para parámetro sin representación válida y ampliar
max/ticks válidos a uint64. Recomendada (c), como cambio de contrato, no sustituto
actual. Un max_ticks grande válido no debe clasificarse como entrada inválida.

**PROPOSED CHANGE — sustituir dominios en §§18,22,25.2 y compromisos §25.3:**

> StepRecord.tick y RecordedEvent.tick tienen dominio matemático uint64. Se admiten
> Number entero seguro no negativo o BigInt uint64 no negativo; comparaciones son
> exactas por valor entero. No hay conversión con pérdida. Para salidas nuevas se
> usa Number si el valor cabe exactamente en entero seguro, BigInt en otro caso.
> WorldState.time conserva su representación válida; su igualdad con tick es
> numérica exacta. sequence y expected_steps conservan Number seguro no negativo.
> max_ticks_used representa uint64 con la misma regla de salida segura.
> Solo en INVALID_REPLAY_INPUT cada *_used admite null. expected_steps_used es el
> expected_steps recibido si es Number seguro≥0; en otro caso null. max_ticks_used
> es el valor uint64 recibido, normalizado sin pérdida, si es válido; en otro caso
> null. Ambos campos se evalúan independientemente del primer error.
> Fuera de INVALID ambos son no nulos y equivalen exactamente a los parámetros
> válidos. En INVALID, null significa exclusivamente que ese parámetro no pertenece
> a su dominio; no significa cero ni parámetro omitido válido.

| Parámetro recibido | expected_steps_used propuesto | max_ticks_used propuesto |
|---|---|---|
| Number seguro≥0, incluido0 | Mismo Number | Mismo Number |
| BigInt uint64, incluido0n | null (no pertenece a expected_steps histórico) | Number exacto si ≤MAX_SAFE, BigInt si mayor |
| Number inseguro, aun aparentemente entero | null | null (no reconstruir precisión perdida) |
| Negativo, fracción, NaN, Infinity | null | null |
| String, booleano, null, undefined/ausente, objeto, símbolo | null | null; sin coerción/retener referencias |
| BigInt fuera de uint64 | null | null |

Si otro campo es inválido y ambos contadores son válidos, ambos conservan sus
valores; si ambos contadores son inválidos, ambos son null. Esquema de once claves
ReplayResult intacto; cambian dominios/nulabilidad, por tanto es una ruptura pública
que requiere aprobación. §25.3.2 compara max_ticks_used solo en estados no INVALID.
§24/WLS1 ya codifica time uint64: no modificar bytes ni función hash. Replay de
eventos grabados conserva su representación admitida, sin reenriquecimiento.

**PROPOSED CHANGE — precedencia de §§25.1/25.3/26:**
Validar en orden WORLD config → Feedback config → initial_state → initial_events
→ estructura actions → expected_steps → max_ticks → time>max → execution_mode.
Cada fallo usa el catálogo actual; modo ausente/desconocido emplea invalid action
structure (ampliar explícitamente su definición, sin crear mensaje nuevo).
No ejecutar transiciones ante entrada inválida. Calcular *_used independientemente
con las funciones parciales anteriores. unused_actions=length(actions) si la lista
es estructuralmente válida, incluso con tipos de acción desconocidos; si no,0.
UNKNOWN_ACTION sigue siendo clasificación incremental tras entradas válidas.

Validador INVALID: verificar forma, salidas vacías, contador nulo solo si parámetro
inválido, valores exactos restantes, unused y primer diagnóstico del orden anterior.
No invocar prueba de continuidad ni comparar final_state con origen en INVALID.
Para los demás statuses validar contexto completo y aplicar P0-6 normalmente.

Aceptación posterior A/E: matriz de cada clase anterior×error de otro campo;
ambos inválidos; max_ticks=2^53/UINT64_MAX válidos; Number inseguro rechazado;
tick MAX_SAFE→MAX_SAFE+1 exacto en WORLD/Recorder/replay, evento en ese tick,
comparación/hints exactos y prevención de overflowUINT64_MAX. Verificación con
WLS1 byte a byte, sin truncar uint64 ni ampliar sequence. Casos enormes deben
usar segmentos/snapshots próximos al límite, nunca iterar2^53 pasos.

#### B — replay desde un estado efectivo positivo

**Alternativas:** (1) corregir §25.1 para exigir time=0: menos código pero pierde
reanudación histórica; (2) admitir segmentos con origen explícito y eventos locales.
Recomendada (2). No se pretende reconstruir eventos anteriores a partir de energía,
lifecycle o RNG. No se trasladan ni reetiquetan eventos históricos automáticamente.

**PROPOSED CHANGE — §25.1/§25.3.3 y precisiones §§18/21/23:**

> Replay acepta WorldState efectivo válido con 0≤initial_state.time≤max_ticks.
> validate_replay_initial_events(state,events) valida RecordedEvent[] del segmento.
> Si time=0 conserva exactamente las reglas iniciales vigentes, incluida la muerte
> inicial y secuencia0; convierte a WorldEvent solo para llamar al validador WORLD
> existente como hace el adaptador actual. Si time>0 exige events=[] tanto ACTIVE
> como DEAD: lifecycle ya forma parte del snapshot y no se emite otra muerte por
> existir un estado DEAD. No se promete incluir el pasado del segmento.
> §25.3.3 llama a este validador específico antes de ejecutar. §11.7 y el procedimiento
> initialize_world no se modifican. El nuevo validador de replay falla con invalid
> initial_events. No usar eventos con tick0 para fingir origen histórico positivo.
> Recorder dispone de adopción privada de origen de replay sin generación ni
> lifecycle: valida/copia estado y eventos conforme a esa regla, preservando reloj
> y rng_state. finalize/verificación admiten ese origen solo en el contexto de
> segmento de replay. Inicialización experimental normal sigue exigiendo origen0.
> Secuencias son locales al segmento, globales entre sus ticks, contiguas desde0;
> no son continuación de un contador de un episodio ausente. En origen0 con una
> muerte inicial, esa muerte consume sequence0, como ahora.

Primer paso en origen t ACTIVE: tick=t+1, observación en t si modo observado;
reconstruir PRNG directamente desde rng_state, sin derive_seed, sorteos de mapa,
sync extra ni avance previo. DEAD inicial o time=max no ejecuta pasos; muerte
prevalece. expected_steps=0 devuelve OK con mismo estado efectivo incluso DEAD;
el hint se deriva del estado/límite, no del número solicitado. Si se solicitan
pasos y el origen es terminal, clasificar EARLY_TERMINATION o MAX_TICKS_REACHED
antes de inspeccionar acciones. No renumerar ticks para hacerlos empezar en1.

El alcance de igualdad/eventos es el segmento completo, nunca una trayectoria
histórica previa no suministrada. No añadir campos a Trajectory: initial_state.time
expresa el origen; documentar en §23 que puede representar un segmento. Comparación
exhaustiva valida origen/eventos de segmento con las mismas reglas específicas.

Aceptación B: t=1 ACTIVE dos pasos produce ticks2/3; t>0 DEAD sin eventos produce
cero pasos sin muerte duplicada; eventos históricos no vacíos rechazados; empate
muerte/límite; expected0; RNG efectivo restaurado distinto de semilla derivada;
secuencias0..k dentro del segmento; equivalencia snapshot al executed0. Repetir
casos cerca deMAX_SAFE/UINT64_MAX con A/E. Contrastar rollback F4-C sin perder origen.

#### C/D — contexto explícito y modo físico/observacional

**Alternativas C:** ampliar firma3 con parámetros separados, o unificar con el
contexto ya obligatorio del validador. Recomendada firma contextual de dos argumentos.
**Alternativas D:** inferir modo desde WAIT o borrar campos: inválidas por pérdida
de información; introducir modo explícito es la mínima información ausente.

**PROPOSED CHANGE — firmas públicas de §§25.1/25.3/25.3.1/25.7:**

```text
replay_trajectory(initial_state, initial_events, actions,
                  world_config, feedback_config, expected_steps, max_ticks,
                  execution_mode) -> ReplayResult
validate_replay_continuity(rr, request_context) -> Valid | Invalid
validate_ReplayResult(rr, request_context) -> Valid | Invalid
validate_replay(original, rr, world_config, execution_mode) -> Match | Mismatch
```

request_context tiene exactamente ocho campos obligatorios:
{world_config,feedback_config,initial_state,initial_events,actions,expected_steps,
max_ticks,execution_mode}. Tipos/dominios son los de la solicitud corregida anterior;
execution_mode∈{"WITH_AGENT","WITHOUT_AGENT"}, sin default ni inferencia desde WAIT,
metadata o snapshots. execution_mode se añade también al contexto explícito del
comparador; este construye el request_context desde original y el modo recibido.
No se modifica ExperimentConfig ni Trajectory para inventar un campo histórico.
El modo de una trayectoria sin pasos debe proporcionarlo el llamador; no se puede
recuperar de una lista vacía. La documentación/API debe hacer visible ese requisito.

Valid/Invalid se representa mediante booleanos, conforme a la decisión JS F3H-P02.
El predicado de continuidad valida contexto, estructura y reproducción; ante entrada
malformada devuelve false, sin consultar globales/defaults ni arrojar una falsa
incompatibilidad para un replay válido. Delegar en el helper F3-H con contexto
explícito, extendiendo su validación de origen/mode; no duplicar el motor físico.
El predicado completo mantiene sus comprobaciones por status y llama a continuidad
con ese mismo contexto. INVALID usa la rama A y no exige que todos sus parámetros
sean válidos para poder validarlo.

WITH_AGENT: no invocar agente; ejecutar las acciones suministradas y construir
Observation/Feedback previos exactamente como el experimento observado.
WITHOUT_AGENT: exigir que toda acción estructuralmente válida tenga type=WAIT;
un tipo distinto invalida la solicitud con invalid action structure. Ejecutar
WAIT real con ActionResult no nulo; registrar observation=feedback=null en cada
paso. El modo conocido se comprueba sin inferirlo desde acciones. Para WITH_AGENT
los tipos desconocidos continúan produciendo UNKNOWN_ACTION incremental.
La comprobación de restricciones de modo ocurre tras validar el enum de modo,
sin adelantarse al orden de errores anterior.

Comparación siempre exhaustiva de todos los campos; si se pasa modo erróneo para
un original no vacío, rechazarlo por inconsistencia de nulabilidad, no proyectarlo.
Mismas acciones físicas entre modos pueden dar mismo WORLD/hash, pero no MATCH
entre StepRecords diferentes. Un original vacío no prueba qué modo lo produjo:
el contexto declarado fija qué ejecución vacía se verifica, sin inventar evidencia.

Aceptación C/D: costesWAIT1/2 sobre mismo snapshot producen resultados distintos;
contexto ausente/incorrecto false; las16 configuraciones Feedback; WAIT observado
versus sin agente generan WORLD igual y registros distintos; replay no-agente
produce MATCH completo con su original; mezcla de nulos rechazada; modo ausente,
inválido o erróneo detectado, incluido modo desconocido en cero pasos. Conservar
igualdad estructural de observaciones/eventos, no comparar solo hashes.

### Transversales preservadas y pseudocódigo del paquete

**PROPOSED CHANGE complementaria §25.7 (precisión de alcance, sin nuevos estados):**
Una trayectoria AGENT_CONTRACT_ERROR permite validar/reproducir su prefijo mediante
validate_ReplayResult con expected_steps=length(steps). Si el WORLD no es terminal,
OK no significa terminación: hint=null y derive_termination_reason=INDETERMINATE.
validate_replay sigue devolviendo MISMATCH para ese original completo, con diagnóstico
de prefijo válido pero fallo de agente no reproducido. No atribuir a replay el
fallo de un agente que no se ejecuta ni añadir AGENT_CONTRACT_ERROR a termination_hint.
La capacidad de certificar esa causa externa queda EXPLICIT LIMITATION, no un
bloqueo de la prueba del prefijo. Alternativa futura de certificación externa no
forma parte de D-01.

```text
validar solicitud en orden A (incluidos modo y restricciones de modo)
si inválida: INVALID vacío + contadores parciales A + primer error
validar origen/eventos según B; adoptar estado/RNG efectivo sin inicializar
si expected_steps == 0: OK con estado idéntico y hint terminal derivado
por cada paso solicitado:
    determinar terminación: muerte antes que límite
    aplicar precedencias actuales de agotamiento y acción desconocida
    preparar contexto observado o ambos nulos según execution_mode
    ejecutar kernel y registrar, con checkpoints F4-C/WORLD/RNG
    ante fallo restaurar prefijo y producir EXECUTION_ERROR como hoy
exportar prefijo; validar estructura/continuidad con request_context completo
```

La validación de origen/eventos pertenece a la fase de solicitud en el orden A;
no repetirla después de invalidar para cambiar el error prioritario. El ciclo
EXPERIMENT conserva fail-stop y replay su rollback específico. No se propone una
transacción conjunta nueva. Un hint válido no sustituye la prueba de continuidad;
null nunca prueba por sí solo ausencia de terminación. Rechazar hints de límite
cuando lifecycle=DEAD, incluso si se alcanza el límite.

### Impacto técnico y plan posterior verificable

| Orden | Componentes previstos (no editados aquí) | Criterio de salida |
|---|---|---|
| 1 | Aprobar D-01 y publicar revisión normativa/errata con textos anteriores en §§18,21–23,25.1–3,25.7; §26 precisa mensaje de modo | Decisión única sobre paquete completo; no atribuir autoridad a este informe |
| 2 | recorder_tick/validate_RecordedEvent, validadores StepRecord y dominios *_used en replay | A/E: null solo en INVALID y uint64 exacto, bytes sin cambio |
| 3 | Nuevo validador replay de origen/eventos y adopción privada Recorder; WORLD/init intactos | B: segmentos positivos y cero pasos coherentes, secuencias locales y rollback |
| 4 | Contexto y firmas públicas C/D, helper F3-H y motor replay | Reproducción física única y proyección correcta por modo, sin defaults |
| 5 | Comparador validate_replay, consumidores/tests de firmas afectadas, documentación API | MATCH observado/sin agente; prefijo de error externo explícitamente limitado |
| 6 | Suites nuevas de aceptación A–E y regresión completa F1–F4-C, Chromium/legacy | Evidencia ejecutada de cada decisión; conservar negativos anteriores como caracterizaciones de versión |
| 7 | Completar corpus/harness canónico y oráculos independientes | Solo entonces evaluar §37, sin reclasificar automáticamente pruebas locales |

Archivos previstos: js/experiment/replay.js, recorder.js, contratos/validadores de
StepRecord y RecordedEvent actualmente internos a esos módulos, pruebas F3-G/H/C/E
y F4-C afectadas por firmas; consumidores externos deberán migrar. No es necesario
editar WORLD, PRNG, WLS1 ni EXPERIMENT. Cambios públicos son incompatibles a propósito:
firmas7→8,3→2,3→4 indicadas, contexto cerrado ampliado y dominios/null de contadores.
No se recomienda conservar wrappers con defaults que oculten el contexto ausente.

### Matriz de preconformidad: cobertura disponible y vacíos

Estados de evidencia: **EJECUTADO F4-D** solo F3-G/H; **EJECUTADO PREVIO** es la
corrida453 PASS de F4-C documentada, no repetida aquí; **PRESENTE NO REEJECUTADO**
identifica el resto de suites locales en este incremento. Ningún conjunto equivale
al harness canónico, que no está implementado íntegramente/disponible como tal.

| Contrato / IDs canónicos según §36 | Evidencia local relacionada | Estado y brecha |
|---|---|---|
| Núcleo T01–05,13–17,23–27,38–41 | F1-A/B y F2-A–I | Presente, ejecutado previo, no reejecutado F4-D; correspondencia temática, no equivalencia individual sin contratos de cada T |
| Experimental T06–11,20,28–30,42–43 | F3-A/B/E/F, F4-C | Igual situación; ciclo/terminación/rollback local comprobados previamente |
| Integración T12,18,19,21,22,31–37,44–45 | F2-G/H/I, F3-F/H, F4-A/C | Pruebas locales y Chromium previos; no sustituyen integración canónica ni independientes |
| Replay T46–60,81–92,105–202 | F3-G27/F3-H23, F4-C14–16/20 | 50 PASS reejecutados F4-D; A–E bloquean verificación del dominio completo; descripciones individuales históricas incompletas |
| R-1/D-27–42 T203–204 | Pruebas locales de dominios/contratos F1-B/F3, sin vínculo recuperado por ID | Exigidos; no asignar equivalencia sin definición completa |
| M/A T205–218; B1–8 T219–240; B9–13/V1–2 T241–255 | Familias F1–F4 relacionadas, sin corpus detallado de esos IDs | Exigidos; harness canónico no implementado como tal; no inventar aserciones |
| v0.2.4 T256–265 | F3-C–H/F4-C aportan evidencia contractual parcial | Definiciones individuales pendientes; locales no son sustitutos |
| T266/P0-1 | Xorshift uint32 F1-A | Ejecutado previo; verificar equivalencia formal con T266 antes de certificar |
| T267/P0-2 | MAX_CELLS/config F1-B/F2-A | Ejecutado previo; T267 canónico pendiente |
| T268–269/P0-3 | WAIT real/nulls F3-E/F, F2-I | Ejecutado previo; modo replay D pendiente |
| T270/P0-4 | Fallos de agente F3-F | Ejecutado previo; no implica reproducir causalidad de fallo externo |
| T271/P0-5 | Continuidad F3H-09–17/23 | Reejecutado; firma pública C y dominio B/D pendientes |
| T272/P0-6 | F3G-11, F3H-19 | Reejecutado origen0; origen positivo pendiente B |
| T273/P0-7 | F2-G, F3G-17/18 | Contrato inicial previo; negativo positivo reejecutado; B requiere texto aprobado |
| T274/P0-8 | F3H-05–08/21 | Reejecutado; hints grandes dependen A/E |
| T275/P1-1 | F3-C eventos vacíos y F3-G | Ejecutado previo; secuencia inicial0, sin max([]) |
| T276/P1-2 | derive_seed F1-A | Ejecutado previo; no se cambia por replay |
| T277/P1-3; T278/P1-4 | Energía F2-D/F3-A; bytes F3-D/D2 | Ejecutado previo; dominio binary64/vectores parciales, no todos los T |
| T279/P1-5 y T280 auditoría global | Este registro y matriz son preparación | No ejecutados como tests canónicos; no satisfacen §37 |
| Vectores T32–35,T54,T202 | F1-A/F3-D/D2; V1 recuperado | Evidencia local previa; V2–V10/oráculo independiente pendientes |
| T61–80 y T93–104 | §36 no los asigna a los grupos de su tabla | 32 IDs sin ubicación en ese inventario: recuperar definiciones, no rellenar por suposición |

Los rangos de replay se expanden como §36:105–116,117–132,133–143,144–153,
154–167,168–175,176–202. La fila105–202 compacta esa unión sin añadir casos.
Los rangos canónicos repetidos como vectores son etiquetas superpuestas, no tests
adicionales. Los T01 etc. del runner legacy v0.1 no acreditan por coincidencia de
nombre los T canónicos v0.2.5. Las453 PASS son casos locales, no453 conformidades.

Aceptación integral requiere además corpus auténtico individual de T01–T280,
harness ejecutable, oráculos esperados, vectores pendientes y comparación entre
implementaciones independientes con misma entrada/bytes/eventos. Base Git previa
es un oráculo de regresión de la misma familia, no evidencia de interoperabilidad.
Conformance/Interoperability global permanecen UNTESTED; los conflictos continúan
CONTRACTUAL CONFLICT/PENDING DECISION hasta aprobación, implementación y pruebas.

Cierre F4-D: paquete D-01 completo, criterios A–E concretos, límites F–I explícitos.
Pendiente una aprobación única del texto propuesto y una orden posterior para
implementarlo. No se aplicó ninguna corrección ni nueva API, no se hizo merge,
no se desplegó y no se inició otro incremento.


<a id="f4-e"></a>
## F4-E — fase I normativa y genealogía

Base PR #27 `3f70a9842a967b7fed157cd7db94e6313f590b6d`.
Autoridad nueva: [v0.2.6 D-01](WORLD-LAB_v0.2.6_contractual_amendment_D-01.md),
NORMATIVE CONTRACTUAL AMENDMENT aprobada por la orden F4-E; v0.2.5 no cambia.
Antes de código se inspeccionaron árbol y nombres de documentos en todo Git.
v0.2.1: SOURCE UNAVAILABLE en ese corpus; identificada por el responsable pero
sin archivo íntegro local. v0.2.2 y v0.2.3: SOURCE UNAVAILABLE. v0.2.4 íntegra:
SOURCE UNAVAILABLE; solo fragmentos transmitidos registrados en F3-G/H y otras
fases. No se reconstruyen. Primera evidencia íntegra disponible: transcripción
v0.2.5; primera evidencia de contraejemplos: F3-G/H, consolidada F4-D.

| ID | Categoría | Regla sustituida / defecto | Nueva regla / compatibilidad | Aceptación requerida |
|---|---|---|---|---|
| A | Reparación contractual | §25 contador seguro e igual a parámetro inválido | null por parámetro inválido; rompe dominio anterior explícitamente | Matriz de tipos y precedencia |
| B | Extensión semántica | §25 admite t>0 pero validación inicial/Recorder solo t0 | Segmentos sin pasado inventado, eventos vacíos y secuencias locales0 | ACTIVE/DEAD, RNG, reloj absoluto y rollback |
| C | Reparación de interfaz | Firma3 no contiene configuración física | Firma2 contextual, sin defaults | Costes/config distintos, pureza |
| D | Contexto experimental | WAIT no distingue modo observado/nulo | Modo obligatorio, firmas8/4; ruptura deliberada | MATCH sin agente,16 flags, modo ausente |
| E | Armonización temporal | WORLD uint64 vs registro seguro | Ticks uint64 exactos; sequence/expected no se amplían | MAX_SAFE, siguiente y UINT64_MAX, WLS1 |

Para cada fila, fuente histórica es fragmentaria como arriba; no se atribuyen a
v0.2.1/2/3 textos no disponibles. Supersesión explícita de las propuestas F4-D y
límites F3-G/H/F3C-P01 solo en lo enumerado. Decisiones previas quedan como historia.
Fase I contractual terminada; implementación y evidencia empírica aún pendientes.


### Implementación D-01 por fases y alcance de archivos

Fase I: commit f27cff9, contrato v0.2.6 y genealogía antes de código. La búsqueda
incluyó archivos Git históricos y, como contraste adicional, los textos adjuntos
accesibles de este chat: contienen órdenes/fragmentos, no fuentes completas de
v0.2.1/2/3/4. No se reconstruye su contenido. Las indicaciones del responsable
sobre fuentes externas conservan su procedencia, sin fingir una lectura local.

Fases II–IV: commit e8e4a98 y precisiones verificadas en los puntos siguientes.

| Punto verificable | Implementación y razón |
|---|---|
| II-A | replay.js emite contadores parciales independientes en INVALID y valida su nulabilidad exacta; conserva once claves y precedencia |
| II-E | recorder_tick y RecordedEvent/StepRecord admiten uint64; salida segura Number/BigInt; sequence y expected_steps siguen sin ampliarse |
| II-E auditoría | WorldState.time y overflow del kernel ya eran uint64 exactos. represent_uint64 en core/contracts se usa solo para salidas de Observation y ConfirmedTickResult; no cambia reloj ni orden físico |
| III-B | Recorder._adopt_replay_origin valida/copia origen y eventos específicos; flag privado de segmento incluido en checkpoint/restore. Inicialización normal y validador WORLD no se relajan |
| IV-C | Contexto cerrado de ocho campos en predicados; firma de continuidad2, sin wrapper incompleto ni configuración inferida |
| IV-D | Replay firma8 y comparador4; modo obligatorio, WITHOUT_AGENT solo WAIT real/nulls; WITH_AGENT produce contexto observado sin agente |
| V | Pruebas nuevas, migración explícita de consumidores de test, corpus histórico conservado y regresión completa |

La modificación adicional a js/interface/observation.js y
js/experiment/tick_transaction.js está motivada exclusivamente por D-01-E:
canonicalizar el campo emitido tick, preservando WorldState.time y los bytes.
js/core/contracts.js centraliza esa representación con validación sin coerción.
WORLD, PRNG, semillas, WLS1/hash_state, EXPERIMENT y web/renderer/CSS no se editan.
Feedback/validadores uint64/copias existentes ya preservaban precisión; no se
cambian por conveniencia. El reloj mostrado en web usa String y admite BigInt.

La revisión normativa v0.2.6 precisa también §16 y §26.5 solo en representación
de las salidas temporales. Son extensiones directas D-01-E, no otra mecánica.

### Migración de firmas y expectativas

Las llamadas actuales de fixtures en F3-G/H y F4-B/C pasan WITH_AGENT explícito;
no existe adaptador de defaults en producción. Contextos usados por validación
incluyen execution_mode y todas las configuraciones. F4-E cubre ambos modos.
Los helpers observados de replay mantienen una elección WITH_AGENT explícita,
no deducida desde acciones; el punto público requiere argumento de modo.

F3G-16/17 y F3H-06/15/16/23 conservan sus expectativas antiguas como
caracterizaciones etiquetadas historical v0.2.5, cargando todos los scripts de
3f70a9842a967b7fed157cd7db94e6313f590b6d. Sus fallos provisionales no se borran del
historial ni se confunden con el comportamiento normativo actual. F4-E contrasta
sus reemplazos con resultados/contextos nuevos. Los demás casos usan código actual.

F3-C admite ahora tick BigInt en RecordedEvent; su negativo se sustituye por
BigInt negativo, no por relajación de sequence. F2F-10 y F3A-08 comprueban el tick
seguro emitido como Number y conservan reloj BigInt. F4B-17/F4C-17 actualizan el
rechazo antiguo de tick uint64 grande. La comparación con la base en F4B-17
identifica explícitamente los dos campos Observation.tick/Feedback.observation.tick
que pasan de0n a0: se compara íntegramente el resto y se prueban bytes WLS1 iguales.
No se proyectan observaciones al comparar trayectorias en producción.

### Pruebas F4-E y correspondencia con los25 requisitos de la orden

Nueva suite tests/f4-e.test.cjs:17 casos locales, varios con matrices internas.
No son T01–T280. La siguiente tabla permite comprobar que25 requisitos no se
confunden con el número de funciones test registradas.

| Requisitos de la orden | Casos/evidencia |
|---|---|
| 1–4 entradas, precedencia, uint64 válido y Number inseguro | Caso inicial, F4E-02/03/04; incluye null, undefined, booleanos, símbolos, objetos, fracciones, NaN/Infinity, BigInt esperado inválido y ambos contadores inválidos |
| 5–7 límites, overflow, eventos/hash BigInt | Inicial y F4E-07/09/16; MAX_SAFE→siguiente, próximo UINT64_MAX→MAX, rechazo atómico enMAX; oráculo BufferBE/FNV BigInt independiente |
| 8–12 segmentos ACTIVE/DEAD, cero, eventos locales, rechazo de historia | Inicial, F4E-05/06/07/17; tiempos absolutos, secuencias locales0, sin muerte fabricada |
| 13–14 RNG y rollback | F4E-08/13 y regresión F4-C; no generación/draws extra y prefijo tras fallo posterior a append |
| 15 contexto de configuración | F4E-10/15; costes/flags distintos no se infieren, contexto extra/ausente Invalid |
| 16–19 WAIT observado/no-agente, MATCH, nulabilidad,16 flags | Inicial, F4E-11/16; comparación completa sin eliminar campos |
| 20 firmas revisadas | F4E-12:8/4/2 y rechazo de modo no declarado, incluso cero pasos |
| 21 regresión tiempo0 | F3-F y F4E-14; ciclo EXPERIMENT no editado |
| 22 compatibilidad bytes | F4E-14 frente a base, suites F3-D/D2 y oráculo F4E-16 |
| 23–25 estados/errores, pureza, no inferencias | F3-G/H migrados, F4E-02/03/04/10/12/15 |

Se mantiene la limitación explícita AGENT_CONTRACT_ERROR: se reproduce/verifica
el prefijo, no la causalidad de un agente que no se ejecuta. No se añade ese motivo
a termination_hint ni se certifica MATCH completo para una causa externa.
Un Replay Segment certifica continuidad desde el checkpoint suministrado, no su
legitimidad histórica ni que proceda de initialize_world. Estas limitaciones no
son contradicciones residuales A–E.


### Resultado ejecutado, compatibilidad y cierre

Ejecución final:24 suites F1–F4-E, **470 PASS/0 FAIL/0 omitidas**. De ese total,
seis casos F3-G/H están etiquetados y fijados a fuentes v0.2.5 para conservar las
caracterizaciones sustituidas;464 casos ejercitan código actual (con referencias
independientes de regresión cuando procede). Nueva suite F4-E:17 PASS. No se
convierten esos números en pruebas canónicas T01–T280.

Comandos desde /workspace/yellow, Node v24.22.1:

```bash
node tests/f4-e.test.cjs
# Se ejecutó también node tests/<archivo> para cada suite F1–F4-C.
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
git diff --check
```

Chromium155.0.8059.79:16 PASS, incluidos15 Node repetidos y un caso de navegador
real adicional. Sin errores de scripts/requests/consola; ambos agentes, fallos,
renderizado y pureza preservados. Legacy:13 PASS/9 FAIL, exit1: cinco consumidores
esperan Trajectory directa (T06/07/08/20/22), factories/enum eliminados T12/13/14 y
TOROIDAL T16. Ninguna aserción legacy se modifica. Subprocesos Git de referencias
históricas y Chromium/localhost se ejecutaron fuera del sandbox; no se sustituyó
el oráculo por código actual para evitar restricciones del entorno.

| API / dato | Anterior | v0.2.6 actual |
|---|---|---|
| replay_trajectory |7 argumentos, contexto observado implícito |8, execution_mode obligatorio |
| validate_replay_continuity |3 argumentos, no vacío bloqueado |2, contexto explícito y retorno booleano |
| validate_replay |3 argumentos |4, modo obligatorio y comparación completa |
| validate_ReplayResult |2, contexto insuficientemente explicitado |2, contexto cerrado de8 campos |
| INVALID.*_used | Conflicto en parámetros inválidos | null solo por parámetro inválido; demás valores exactos |
| max/ticks temporales | Registro acotado a Number seguro | uint64 exacto, salida Number seguro o BigInt grande |
| Replay positivo | Excepción provisional | Segmento con eventos iniciales vacíos y secuencias locales |
| Sin agente | Replay observado y MISMATCH | WAIT real/nulls y MATCH con modo declarado |

Archivos afectados: nueva norma e informe; core/contracts (representación),
recorder/replay (A–E), tick_transaction y observation (salidas temporales);
fixtures/expectativas de f2-f, f3-a, f3-c, f3-g, f3-h, f4-b, f4-c y nueva f4-e.
Quince archivos en total. Las fuentes de v0.2.5 y las decisiones anteriores se
preservan, con supersesión añadida. WORLD, PRNG/semillas, WLS1, EXPERIMENT y web
permanecen byte a byte intactos frente a la base. La revisión normativa precede
el código y los puntos de verificación de las fases quedan identificados arriba.

**VERIFIED local:** A–E, firmas, contextos/modos, representación/límites, segmentos,
bytes previos, oráculo independiente FNV/Buffer, pureza, rollback y regresión.
No hay contradicción residual demostrada en A–E. Secuencias y expected_steps no
se amplían; los límites físicos/numéricos y F4-C siguen verificándose.
**EXPLICIT LIMITATION:** procedencia histórica del checkpoint, causalidad externa
de AGENT_CONTRACT_ERROR y rollback conjunto en EXPERIMENT no se certifican. La
firma antigua no tiene wrapper de compatibilidad silencioso; consumidores externos
necesitan migrar explícitamente a la revisión.
**UNTESTED:** harness canónico individual T01–T280, vectoresV2–V10 pendientes y
comparación entre implementaciones independientes. La comparación contra una base
Git es regresión de la misma familia, no interoperabilidad completa. La matriz
F4-D prepara esos trabajos; no se inicia su harness ni se declaran hitos B/C.

F4-E COMPLETED en el alcance autorizado. Listo para revisión, sin merge ni
publicación de despliegue y sin iniciar otro incremento.


<a id="f4-f"></a>
## F4-F — auditoría adversarial contractual v0.2.6

### Dictamen, alcance y autoridad

**Auditoría COMPLETED; aceptación integral HOLD.** Hallazgo reproducible
F4F-001, P1 de implementación, pendiente de una orden de corrección productiva.
No se modifica el motor, la norma ni las expectativas de pruebas anteriores.
No se certifica conformidad global ni preparación incondicional para T01–T280.
Base auditada: main PR #28, `20a89415e568b50926ff94bb39b7b1c8962f47b3`.
Entregables: esta sección y `tests/f4-f.test.cjs`, en
`dev/f4-f-contractual-audit`. No se inicia otro incremento.

Autoridad aplicada: [v0.2.6 D-01](WORLD-LAB_v0.2.6_contractual_amendment_D-01.md)
en sus sustituciones expresas; [v0.2.5](WORLD-LAB_v0.2.5_canonical_transcripcion.md)
para lo heredado, incluidos pseudocódigo/invariantes; cláusulas históricas
recuperadas solo donde están disponibles. Código, pruebas e informes son evidencia,
no fuente para redefinir contratos. No se dispone de copias íntegras verificables
de todas las versiones históricas: no se afirma haberlas leído completas.

La enmienda identifica §§25.1/25.2/25.3/25.3.1/25.7, §23 y los campos temporales
sustituidos; conserva A–E y las exclusiones de sequence/expected_steps. Se verificó
que v0.2.5 permanece byte a byte igual a la base anterior a F4-E y que las dos
fuentes normativas permanecen intactas en F4-F. La precedencia de solicitud inválida
se aplica antes del despacho de acciones/terminales: la expresión de B «antes de
inspeccionar acciones» se lee con la precedencia global explícita de la enmienda,
no como autorización para ignorar errores estructurales. No se demuestra una
contradicción textual adicional. El estado FROZEN/normativo no equivale a VERIFIED.
Los enlaces relativos, anclas y referencias Git de los documentos se verificaron;
no se certifica disponibilidad del contenido externo ausente.

### Inventario contractual y de interfaces

La inspección incluyó componentes que no cambiaron en F4-E. La evidencia siguiente
es local y acotada; «sin defecto nuevo reproducido» no prueba corrección universal.

| Contrato / interfaz | Inspección y riesgo examinado | Evidencia ejecutada / resultado |
|---|---|---|
| D-01 A, INVALID_REPLAY_INPUT; §§25.1–25.3 | `replay.js`: validación de solicitud, contadores independientes, esquema cerrado, precedencia, acciones dispersas | F4F-05/06: 144 combinaciones de dos contadores inválidos, errores simultáneos escalonados, límites válidos y cero llamadas al kernel; rama inválida validable con contexto inválido |
| D-01 B, origen positivo y §23 | Reconstrucción WORLD/PRNG y adopción privada de RECORDER; no generación ni lifecycle inicial adicional | F4F-01/02/03/07/08/12: ACTIVE/DEAD, cero pasos, empate muerte/límite, prefijos, UNKNOWN_ACTION, EXECUTION_ERROR y rollback tras append confirmado |
| D-01 C, continuidad pública | `replay.js:276–280`, `replay_context_values`, helper físico compartido | **F4F-001 P1:** el wrapper verifica claves pero omite dominios de metadatos; F4F-10 demuestra siete variantes y F4F-11 queda rojo |
| D-01 C/D, firmas y contexto | replay8, continuidad2, validador completo2, comparación4; ocho campos sin defaults | F4E-12 y F4F-09; modo omitido/extra/inválido rechazado. Declaraciones válidas distintas son posibles para cero pasos: el registro vacío no prueba el modo histórico |
| D-01 D, Observation/Feedback | `observation.js`, `feedback.js`, estructuras y copiadores; WAIT observado frente a WAIT sin agente | F4F-01 verifica Observation/Feedback completos contra expectativas manuales; F4E-11 ejecuta 16 combinaciones de flags y ambos modos sin proyectar campos al comparar |
| D-01 E, uint64 y representación | `core/contracts.js`, `structures.js`, `world_state.js`: is_uint64/represent_uint64, copias y comparaciones exactas; índices/sequence siguen Number seguro | F4F-01/04/08 y F4E-02/03/07/09/16: Number seguro, BigInt pequeño/grande, rechazos, fronteras e incremento sin overflow |
| WORLD, §§6–15/31 | Acciones, lifecycle y dinámica mantienen energía binary64, tiempo y RNG bajo sus responsabilidades | Suites F2-A–I/F3-A, F4F-01/03/08/12: energía/efectos y eventos predichos, muerte antes de límite, sin consumo aleatorio adicional |
| Tick transaction, §26.5 | `tick_transaction.js`: incremento exacto, snapshot, sync y restauración | F3-A (40), F4E-13, F4F-08; rechazo en UINT64_MAX preserva estado y RNG; Confirmed.tick canónico aunque WorldState.time conserve BigInt pequeño |
| EXPERIMENT / ExperimentConfig | `experiment.js`, `experiment_config.js`: límites, precedencia, modo observado y sin agente, frontera con RECORDER | F3-B/F3-F y F4E-11/14; integración EXPERIMENT→RECORDER→REPLAY→validación/MATCH en ambos modos. No se presupone que archivo sin cambios implique compatibilidad |
| RECORDER / Trajectory, §§21–23 | `recorder.js`, `trajectory.js`: ticks, eventos, segmentos, secuencias seguras, checkpoint y propiedad de historial | F3-C/E, F4-C, F4E-09/13, F4F-03/07: secuencias locales 0..k, ticks absolutos, copias sin alias, rollback después de append |
| WLS1 / FNV, §§24/34 | `hash_state.js`, `hash.js`: uint64 BE sin truncamiento, UTF-8, orden de celdas/entidades, binary64 y -0 | F3-D/D2, F4E-14 (referencia Git histórica), F4F-01/03/04: bytes y hash independientes, incluidos ID multibyte y valores subnormales |
| Web / renderer | `main.js`, `renderer.js`: reloj representado como texto, consumidores de resultados/snapshots | F4-A con Chromium real: 16 PASS, agentes y modos, errores, renderizado y pureza; límite grande cubierto en núcleo, no se afirma simular astronómicos ticks en navegador |
| Validadores/copiadores transversales | Esquemas cerrados, representaciones exactas, ausencia de coerciones; mutaciones con hash correcto aún deben fallar | F1-B, F2-I, F3-G/H, F4E y F4F-09/10; validador completo protege metadatos malformados, continuidad pública no |

### Matriz de hallazgos

| Campo | F4F-001 |
|---|---|
| Severidad | **P1 mayor**, error de implementación reproducido; no contradicción normativa |
| Cláusula | v0.2.6 D-01 C/D, párrafo «El predicado de continuidad valida contexto, estructura y reproducción; ante entrada malformada devuelve false»; esquema ReplayResult §25.2/25.3 heredado |
| Componente/localización | `js/experiment/replay.js`, `validate_replay_continuity`, líneas 276–280; guardia de estructura en 278 |
| Evidencia | Replay de un WAIT real, origen manual time=7, configuración explícita y resultado inicialmente válido. Cambiar solo status a BOGUS deja claves exactas, records/eventos y física intactos; continuidad devuelve true. También ocurre con max_ticks_used=null, expected_steps_used="1", unused_actions=-1, termination_hint="BOGUS", unknown_action_index="bad" o error_message={} |
| Esperado | Invalid/false ante cada entrada malformada; no certificar como válido un ReplayResult fuera de dominio |
| Observado | true en las siete variantes; cada llamada alcanza exactamente una transición de prueba física. El validador completo devuelve false en todas ellas |
| Impacto | Garantía pública de validación incumplida; un consumidor que use solo continuidad puede aceptar metadatos inválidos. No se demuestra aceptación por validate_ReplayResult ni alteración de la física/WORLD |
| Corrección mínima propuesta | Antes de la prueba física, validar dominios/esquema del resultado con un helper estructural compartido con el validador completo, sin recursión entre ambos y sin duplicar el motor. Preservar reglas legales por status y termination_hint=null; no reutilizar ciegamente una guardia más restrictiva que P0-8 |
| Prueba para cierre | F4F-11 debe pasar, las siete variantes de F4F-10 deben rechazar y conservarse replays válidos, hints nulos legales, errores válidos y un único recorrido físico. Adaptar entonces la caracterización del defecto mediante orden posterior; no hacerlo en esta auditoría |

Reproducción: `node tests/f4-f.test.cjs`. F4F-10 es una caracterización que pasa
porque demuestra el defecto; **no es evidencia de conformidad**. F4F-11 expresa la
expectativa normativa y falla (`true !== false`). No se oculta con skip/TODO ni
se modifica producción para ponerla verde. No se detectó otro P0/P1 reproducible
en el alcance ejecutado. Hipótesis no reproducidas no se cuentan como hallazgos.

### Oráculos adversariales, fronteras y aislamiento

Los fixtures nuevos no se generan mediante initialize_world ni replay. Se suministra
un mapa manual 2×1, entidad con ID UTF-8 `é😀`, RNG efectivo 0x12345678,
configuración física/feedback completa, acciones explícitas y energía conocida.
Los constructores/validadores actuales se usan para la representación, no para
calcular los resultados esperados. Un oráculo externo al motor usa Buffer para
WLS1, uint64 BE y binary64, y BigInt para FNV-1a módulo 2^32; no llama al serializador
ni al hash productivo para producir la expectativa. Estados WAIT, costes,
consumo de recurso/peligro, eventos y terminales se predicen directamente.
Esto es independencia del oráculo frente al motor, no una segunda implementación
completa de WORLD-LAB ni una certificación institucional externa.

F4F-01 ejecuta dos pasos en cada modo desde 0, 7n, MAX_SAFE−1, MAX_SAFE,
MAX_SAFE+1 y UINT64_MAX−2. Se comparan estados/mapas, tipos de tick, energía,
Observation/Feedback y bytes/hash. F4F-08 llega a UINT64_MAX desde MAX−1 y
comprueba rechazo sin mutación posterior. F4F-04 cruza tiempos 0/1/123456789/
MAX_SAFE/MAX con energía -0, mínimo subnormal y π: 15 combinaciones, dos formatos
hash/bytes cada una. No hay conversión BigInt→Number insegura en esos resultados.
No se infiere compatibilidad para todo uint64 de estos pocos ejemplos.

F4F-03 predice recurso disponible→agotado o peligro estático y secuencias
operacionales 0/1/2 en ticks absolutos 8/9; modifica después un snapshot para
comprobar aislamiento. F4F-07 inyecta un fallo después del segundo commit real de
RECORDER y comprueba restauración al primer paso confirmado. F4F-08 prohíbe
inicialización/generación y draws RNG; se observa una resolución lifecycle y un
sync por paso, con RNG restaurado efectivo. F4F-09 perturba energía y recalcula
hash con el oráculo independiente: la continuidad física completa sigue rechazando.
La instrumentación cuenta llamadas reales para demostrar que las condiciones
previstas se alcanzan; no sustituye las transiciones por resultados fabricados.

### Ejecución y regresiones por archivo

Entorno: 2026-11-11 UTC, `/workspace/yellow`, Node v24.22.1,
Chromium 155.0.8059.79 y Playwright instalado. No se instalaron dependencias.
Comandos ejecutados (la suite de auditoría tiene exit1 por el hallazgo abierto):

```bash
node tests/f4-f.test.cjs
# Cada uno de los 24 archivos de la tabla se ejecutó como node tests/<archivo>.
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
git diff --check
```

| Suite F1–F4-E | PASS | FAIL |
|---|---:|---:|
| f1-a | 18 | 0 |
| f1-b | 12 | 0 |
| f2-a | 14 | 0 |
| f2-b | 13 | 0 |
| f2-c | 21 | 0 |
| f2-d | 28 | 0 |
| f2-e | 16 | 0 |
| f2-f | 18 | 0 |
| f2-g | 21 | 0 |
| f2-h | 15 | 0 |
| f2-i | 18 | 0 |
| f3-a | 40 | 0 |
| f3-b | 18 | 0 |
| f3-c | 24 | 0 |
| f3-d | 12 | 0 |
| f3-d2 | 15 | 0 |
| f3-e | 24 | 0 |
| f3-f | 23 | 0 |
| f3-g | 27 | 0 |
| f3-h | 23 | 0 |
| f4-a | 15 | 0 |
| f4-b | 18 | 0 |
| f4-c | 20 | 0 |
| f4-e | 17 | 0 |
| **Total regresión previa** | **470** | **0** |
| **Nueva auditoría f4-f** | **11** | **1** |

La regresión previa incluye **464 casos sobre código actual y seis
caracterizaciones históricas fijadas a v0.2.5** (F3G-16/17, F3H-06/15/16/23).
Con auditoría: 475 PASS actuales + seis PASS históricos + un FAIL actual abierto;
482 casos en total. Los casos locales tienen matrices internas y no se renombran
T01–T280. La suite adversarial termina exit1, sin omitidos/TODO. Las 24 suites
anteriores terminan exit0; no hay regresión nueva por archivo anterior.

Chromium: **16 PASS/0 FAIL** (15 repiten F4-A Node y uno adicional real de navegador).
Integración EXPERIMENT→RECORDER→REPLAY→validación/MATCH ejecutada en F4E-11/14,
además de las suites F3-F/G/H; comparación WLS1 con referencia Git en F4E-14 y
F3-D/D2, oráculo nuevo en F4F-01/03/04. Subprocesos Git históricos y navegador
localhost requirieron ejecución fuera del sandbox; no se reemplazaron las referencias
por el código actual para eludir una restricción del entorno.

Legacy: **13 PASS/9 FAIL**, exit1, sin alterar aserciones. T06/07/08/20/22 consumen
Trajectory directa donde ahora existe ExperimentResult; T12/13/14 dependen de
makeResource/EffectKind/makeHazard retirados; T16 intenta topología TOROIDAL y
falla validación del estado inicial. No se atribuyen estos fallos a F4-F ni se
confunden con T01–T280 canónicos. `git diff --check` y comprobación de referencias
internas completados; solo se entregan los dos archivos autorizados.

### Límites epistemológicos y preparación canónica

- Reproducir un segmento demuestra continuidad desde el checkpoint suministrado;
  no demuestra procedencia legítima de una trayectoria anterior no aportada.
- Un prefijo reproducible no prueba causalidad externa de AGENT_CONTRACT_ERROR
  ni de un fallo de ejecución; no se invoca el agente para fabricar esa evidencia.
  La limitación no constituye por sí misma un error del motor.
- Un registro vacío no identifica el modo histórico. Ambos modos declarados
  válidos pueden aceptarse con cero pasos; un enum inválido u omisión se rechazan.
- Las pruebas Git son regresión de una familia de implementación, no
  interoperabilidad con una implementación independiente. Se conservaron las
  fronteras de atomicidad de EXPERIMENT y las limitaciones documentales históricas.

**Preparación para T01–T280: HOLD.** Primero se requiere corregir F4F-001 en una
orden delimitada y superar su regresión y las anteriores. Además continúa pendiente
el harness canónico individual, las fuentes de los identificadores ausentes
T61–80/T93–104 (32 IDs), vectores V2–V10 y contraste independiente. La matriz de
preconformidad F4-D sigue siendo un plan, no evidencia ejecutada de esos tests.
Ningún resultado local ni ausencia de otros hallazgos autoriza conformidad global.

F4-F termina como auditoría, sin merge, despliegue, cambios productivos ni inicio
de otro incremento. La propuesta de corrección es informativa y no se ejecutó.


<a id="f4-g"></a>
## F4-G — corrección P1 F4F-001 y cierre de regresión

### F4G-001 — IMPLEMENTATION DEFECT CORRECTION

Base main PR #29: `ce9082c55b304cfaac924e7477bf9424c444f3ea`.
Rama: `dev/f4-g-replay-validator-fix`. Autoridad: **v0.2.6 D-01-C**, con las
reglas por status de §25.3 y la semántica de hint de §25.3.2/P0-8 heredadas.
Es una corrección productiva autorizada; no constituye una enmienda normativa.

| Aspecto | Registro |
|---|---|
| Origen / severidad | F4F-001, P1 mayor. La auditoría F4-F queda conservada como evidencia histórica del defecto |
| Contraejemplo | Replay real de WAIT desde checkpoint manual time=7; cambiar status a BOGUS conserva prefijo físico pero continuidad pública devolvía true. Otras seis mutaciones: max_ticks_used=null, expected_steps_used="1", unused_actions=-1, termination_hint="BOGUS", unknown_action_index="bad", error_message={} |
| Causa raíz | La guardia pública solo verificaba claves/listas/cantidad antes del helper físico; el validador completo mantenía por separado las reglas de dominio/status. El helper estructural existente tampoco podía reutilizarse sin preservar hints nulos legales |
| Corrección exacta | `validate_replay_continuity` exige contexto cerrado y reutiliza `validate_ReplayResult_structure` antes de llamar a `replay_continuity_proof`. El validador completo delega a continuidad para todo status distinto de INVALID; la rama INVALID conserva su validación de solicitud/error y no ejecuta física |
| Ajustes al helper compartido | Conserva executed≤expected_steps; usa validate_termination_hint para OK, incluido null en terminales; comparte catálogo de errores de EXECUTION_ERROR; exige final no terminal para UNKNOWN/INCOMPLETE como ya hacía el validador completo. Se elimina una rama INVALID inalcanzable, ya resuelta al principio del mismo helper |
| Invariantes preservadas | Esquema cerrado, siete estados sin cambios, uint64 exacto, expected_steps/sequence Number seguro, modos/contexto explícitos, pureza, mismo motor físico, orden de transición/eventos, hashes WLS1 y checkpoints/RNG |
| Evidencia antes | Con HEAD en la base indicada y antes de editar: node tests/f4-f.test.cjs → 11 PASS / 1 FAIL, exit1; F4F-10 reproduce las siete aceptaciones indebidas y F4F-11 falla true!==false |
| Evidencia después | F4F-10 exige false para las siete variantes y prueba cero reconstrucciones/ejecuciones; F4F-11 conserva literalmente su expectativa false y pasa. Suite: 12 PASS / 0 FAIL, exit0, sin skip/TODO |
| Estado final | **CLOSED / VERIFIED en esta rama**; pendiente de revisión e integración. GO para la corrección F4-G, sin declaración de conformidad global |

La caracterización original permanece recuperable en Git:
[tests F4-F antes de corregir](https://github.com/ksgfin8-cyber/yellow/blob/ce9082c55b304cfaac924e7477bf9424c444f3ea/tests/f4-f.test.cjs).
Solo se migra la expectativa deliberadamente defectuosa de F4F-10 conforme a esta
orden; no se relajan pruebas anteriores. F4F-11 no se omite ni se cambia a true.
Los contrastes nuevos caben en F4F-10/12 y la comprobación física F4F-09: no se
crea una suite F4-G adicional ni se infla el conteo de tests registrados.

### Reutilización y separación entre estructura y física

Se examinó primero `validate_ReplayResult_structure`. Su rama OK exigía el hint
calculado exacto, aunque P0-8 admite null incluso en un estado terminal; la rama
EXECUTION_ERROR aceptaba cualquier texto no vacío, mientras que el validador
completo exigía el catálogo. UNKNOWN/INCOMPLETE comprobaban cantidades/acción,
pero el validador completo comprobaba además precedencia terminal después de la
prueba física. Reutilizarlo sin reconciliar esas diferencias habría introducido
rechazos legítimos o divergencias. Se consolidan esas reglas existentes en el
helper; no se crean reglas de estados ni un segundo motor.

Flujo actual, sin recursión: validador completo no-INVALID → continuidad pública
→ contexto validado → guardia estructural/status → única prueba física compartida.
La guardia puede consultar terminación del snapshot validado sin mutarlo; no
reconstruye WORLD ni ejecuta acciones. Tras ella, la reproducción compara el
snapshot efectivo, hashes, eventos, observaciones y feedback como antes.

INVALID_REPLAY_INPUT no contiene un prefijo reproducible con contexto válido:
continuidad devuelve false y no reconstruye WORLD. El validador completo puede
aceptar la respuesta INVALID correcta usando su solicitud inválida y sus
contadores parciales, sin requerir una solicitud física válida. Un
EXECUTION_ERROR con prefijo válido sí supera continuidad; eso no prueba la causa
externa del fallo. El límite epistemológico previo permanece explícito.

La estructura se recorre antes de la reproducción, con trabajo lineal y sin
pruebas físicas adicionales. Se mantiene una reconstrucción por invocación válida
y una transición por registro; cero transiciones para cero pasos. No se introduce
caché, defaults, estado global de contexto ni cambios de firmas públicas.

### Contrastes focalizados por status y frontera

F4F-10 añade una matriz de 13 solicitudes/resultados reales: ambos modos para
OK/MAX_TICKS_REACHED/EARLY_TERMINATION/INCOMPLETE_ACTION_SEQUENCE/
INVALID_REPLAY_INPUT/EXECUTION_ERROR y WITH_AGENT para UNKNOWN_ACTION.
WITHOUT_AGENT solo admite WAIT: no se fabrica un UNKNOWN legítimo en ese modo.
Los estados parciales usan un prefijo de un paso; EXECUTION_ERROR se obtiene
mediante un fallo inyectado después del segundo append real, con rollback al
primero. Las solicitudes parten de un checkpoint positivo 7n.

| Resultado | Continuidad pública | Validador completo | Reconstrucciones por llamada a cada uno |
|---|---|---|---:|
| OK, MAX_TICKS_REACHED, EARLY_TERMINATION | true para resultado real coherente | true | 1 |
| INCOMPLETE_ACTION_SEQUENCE, UNKNOWN_ACTION | true para prefijo no terminal y metadatos válidos | true | 1 |
| EXECUTION_ERROR | true para prefijo físico válido y error del catálogo | true; no demuestra causalidad externa | 1 |
| INVALID_REPLAY_INPUT | false, sin prefijo reproducible | true para respuesta INVALID correcta | 0 |
| Siete mutaciones malformadas | false antes de prueba física | false antes de prueba física | 0 |
| Contexto incompleto/extra, modo desconocido o configuración inválida | false | false | 0 |

Contadores instrumentados alrededor de reconstrucción, helper de prueba física y
kernel comprueban estos resultados por llamada, no solo un valor booleano final.
Los argumentos rr/contexto se comparan antes/después. Un segundo registro con
Action malformada también se rechaza antes de reconstruir WORLD o ejecutar el
primer registro válido. Se quita cada uno de los
ocho campos obligatorios y se perturban ambos tipos de configuración.

F4F-12 añade ocho escenarios terminales (ACTIVE/DEAD × cero/un paso × ambos modos)
en UINT64_MAX o MAX−1. Cada uno prueba hint correcto y null en ambos predicados:
exactamente una reconstrucción por llamada; ticks/counters grandes sin conversión
insegura. F4F-01 conserva la matriz de fronteras y salidas canónicas; F4F-09 exige
que ambos predicados rechacen un estado físicamente alterado incluso con hash
recalculado por el oráculo independiente. La guardia previa no sustituye la prueba
física por confianza en los hashes.

### Verificación, alcance y recomendación

Comandos desde /workspace/yellow, Node v24.22.1 y Chromium 155.0.8059.79:

```bash
# Antes de editar, HEAD ce9082c…: 11 PASS / 1 FAIL (exit1)
node tests/f4-f.test.cjs
# Después de corregir y ampliar contrastes: 12 PASS / 0 FAIL (exit0)
node tests/f4-f.test.cjs
# Se ejecuta node tests/<archivo> para cada una de las 24 suites F1–F4-E.
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
git diff --check
```

Resultados ejecutados: **F4-F 12 PASS / 0 FAIL**, exit0, sin omitidos/TODO;
**F1–F4-E 470 PASS / 0 FAIL**, las 24 suites exit0, mismos conteos por archivo que
la tabla F4-F. Se comparó el resultado de cada archivo con la auditoría previa:
ninguna divergencia. De los 470, **464 son casos actuales y seis son
caracterizaciones históricas v0.2.5**, no evidencia de conformidad vigente.
Total Node actual: **476 PASS**, más seis históricos; 482 casos registrados en
las 25 suites. Las matrices internas no se cuentan como tests separados.

Chromium: **16 PASS / 0 FAIL**, exit0; 15 casos Node repetidos y un caso adicional
real de navegador. Integración EXPERIMENT→RECORDER→REPLAY→VALIDACIÓN/MATCH
superada en F4E-11/14 y suites F3-F/G/H; WLS1 histórico y oráculos independientes
conservados en F3-D/D2, F4E-14 y F4F-01/03/04. Node v24.22.1 y Chromium
155.0.8059.79; no se instalan dependencias. Los subprocesos Git históricos y el
servidor localhost/navegador usan la ejecución autorizada fuera del sandbox.

Legacy: **13 PASS / 9 FAIL**, exit1. Se compararon IDs y mensajes con F4-F:
idénticos. T06/07/08/20/22 esperan Trajectory directa en lugar de ExperimentResult;
T12/13/14 llaman factories/enum retirados; T16 intenta TOROIDAL y falla validación
inicial. No se cambian sus aserciones ni se les atribuye un fallo nuevo.
`git diff --check` y revisión de referencias internas: correctos. El diff se
limita a reutilización/reconciliación de la guardia, migración explícita de
F4F-10, contrastes focalizados y documentación.

**Recomendación: GO para revisión y cierre de F4-G.** F4F-001 se reproduce en la
base y se rechaza tras la corrección sin cambiar la expectativa normativa de
F4F-11. No se observa divergencia entre validadores en los contrastes ejecutados.
No se declara conformidad global ni interoperabilidad independiente. Permanecen
las limitaciones de procedencia del checkpoint y causalidad externa de errores,
el corpus/harness T01–T280 incompleto y los vectores pendientes ya documentados.
No se inicia ese harness ni se autoriza otro incremento.

Solo cambian `js/experiment/replay.js`, `tests/f4-f.test.cjs` y este documento.
WORLD, PRNG, RECORDER, EXPERIMENT, WLS1, web, fuentes normativas y todas las demás
pruebas permanecen idénticos a la base. No se inicia T01–T280 ni otra funcionalidad.
Las secciones históricas F4-E/F4-F conservan sus conclusiones de aquel momento;
el estado vigente se establece aquí, sin borrar la evidencia roja anterior.


<a id="f5-a"></a>
## F5-A — F5A-CONFORMANCE-INFRASTRUCTURE

**COMPLETED como infraestructura con limitaciones; conformidad canónica completa
NO ESTABLECIDA.** Base main PR #30: `14d59dad381c344b7213025c86ffa5e661f16fc2`.
Rama `dev/f5-a-conformance-harness`. Sin cambios productivos, especificaciones,
pruebas previas, merge ni despliegue. Los registros históricos anteriores se
conservan; esta sección establece el nuevo corte, sin reasignar sus categorías.

### Recuperación documental y autenticidad

Se buscaron fuentes en documentación actual, historial Git local alcanzable tras
fetch y 26 órdenes adjuntas accesibles. El candidato histórico docs/specifications
es un blob de un byte (solo LF), no un corpus recuperable. No se hallaron
especificaciones individuales completas T01–T280. Se registran límites de búsqueda,
objetos Git, títulos y SHA-256 en [recovery.json](../conformance/recovery.json).
No se afirma haber leído documentos históricos íntegros ni conversaciones/ramas
no disponibles. El código legacy con etiquetas T01–T22 no adquiere autoridad.

[corpus.json](../conformance/corpus.json) contiene una fila por cada T01–T280:
versión de origen cuando está expresamente fijada, fuente y localizador,
cláusulas disponibles, entrada/procedimiento/esperado, recuperación,
implementación, ejecución y evidencia. Hay **248 referencias parciales y 32 IDs
sin asignación explícita** (T61–80/T93–104). Todas las definiciones individuales
siguen incompletas y sus entradas/esperados ausentes son null, con ejecución
BLOCKED. La tabla P0/P1→T266–T280 relaciona obligaciones, no recupera por sí sola
las definiciones de esos tests. No se inventan identidades a partir de su tema.

V1 sí se recupera como vector literal completo de 59 bytes desde la orden F3-D/2
que transcribe §34 de v0.2.4; su estado se decodifica unívocamente del layout, sin
inicialización ni resolver lifecycle. **V2–V10 siguen sin valores fijados** en
§34.9: no se generan salidas del motor para rellenarlos. Los identificadores V-1 y
V-2 del grupo de correcciones v0.2.3 no se confunden con WLS1 V1/V2.

[sources.json](../conformance/sources.json) fija los SHA-256 de S025/S026 y de
las capturas H034/HINIT. Estas últimas preservan exactamente órdenes del propietario
con fragmentos recuperados, mediante base64 para conservar CRLF/espacios sin
alterarlos. Se comprueba hash del archivo y del original decodificado; no son
una autenticación independiente de todo v0.2.4. El original recuperado conserva
su estado histórico UNTESTED aunque una envoltura nueva ejecute ahora su vector.

### Categorías, trazabilidad y cobertura demostrada

| Categoría del harness | PASS | FAIL | Alcance |
|---|---:|---:|---|
| CANONICAL-RECOVERED | 6 | 0 | FNV literal: vacío/a/foobar; dos derive_seed de §11.6; V1 byte por byte |
| NORMATIVE-DERIVED | 39 | 0 | Nuevos IDs ND, cláusulas y oráculos explícitos; no son T recuperados |
| ENGINEERING-REGRESSION | 5 | 0 | Tres proyecciones de replay según políticas actuales y dos casos de instrumentación de yellow; expectativas manuales y hashes independientes |
| Entradas sin definición de test (category=null) | 0 | 0 | 289 BLOCKED: 280 T y nueve vectores no fijados; no son una cuarta categoría de pruebas |

Total de entradas del reporte: **339 = 50 ejecutadas + 289 BLOCKED**.
Ninguna ausencia de fuente recibe PASS. Las envolturas CR-* tienen IDs nuevos del
runner y original_reference para la referencia literal del vector; no se renombran
como T. La tabla Xorshift §10.6 disponible no fija expresamente su semilla: el
contraste de semilla1 se deriva del algoritmo con oráculo BigInt, sin presentarlo
como recuperación íntegra de aquella prueba histórica. Los nuevos hashes V1 se
calculan con FNV independiente y se identifican ND, no hashes históricos fijados.

La [matriz](CONFORMANCE_MATRIX.md) y
[obligations.json](../conformance/obligations.json) recorren §§0–39, I-01–I-82,
P0/P1 y los grupos R/D/M/A/B/V- disponibles. Cada regla tiene fuente, relación
histórica conocida, casos exactos y cobertura parcial/UNTESTED/BLOCKED. I-01–I-66
y las definiciones individuales R/D/M/A/B/V- no se reconstruyen del código.
La dirección inversa está en [cases.json](../conformance/cases.json): norma,
fuente, operación, entrada, expectativa y oráculo, enlazados al resultado por ID.
summary_by_clause muestra las aserciones ejecutadas, no porcentajes de cobertura
ni certificación de toda una sección por coincidencia temática.

D-01 tiene casos explícitos para A (contadores parciales independientes), B
(segmentos ACTIVE/DEAD positivos y cero pasos), C (contexto cerrado, validación
previa de siete metadatos y F4F-001), D (modos observados y sin agente) y E
(uint64/MAX, hints nulos y representación exacta). El caso ND-STRUCTURE-HASH
modifica energía y recalcula correctamente el hash con oráculo independiente:
ambos predicados siguen rechazando por inconsistencia física/estructural. No se
ha debilitado la prueba hasta limitarla a hashes.

### Runner, aislamiento y oráculos

[runner.cjs](../conformance/runner.cjs) se ejecuta en Node sin index.html,
renderer ni navegador. Crea un adaptador/VM fresco por caso, entrega una copia de
entrada sin expectativa y compara estructuras completas y bytes. Admite PASS,
FAIL, BLOCKED y UNTESTED; registra excepciones y causas, valida IDs únicos y
rechaza oráculos ausentes. Las expectativas throws afirman solo nombre/mensaje
que estén especificados; un diagnóstico no fijado se registra sin convertirlo en
nuevo requisito. La selección parcial conserva los no seleccionados como UNTESTED.

Los oráculos se construyen antes de ejecutar el motor: BigInt para PRNG/FNV;
Buffer para UTF-8, BE uint64 y binary64/WLS1; estados manuales, tabla terminal,
orden físico, eventos crudos/iniciales y rollback con fallo inyectado tras alterar
estado y RNG. Tres ER explicitan su dependencia de políticas de ActionResult/
proyección no recuperadas íntegramente; otros dos son instrumentación específica
de yellow. Los ND de validación comparan resultados públicos, sin exigir a otro
motor los nombres de helpers ni los contadores internos de esta implementación.
Cambiar su calidad empírica
no cambia su categoría por conveniencia.

JSON wire conserva BigInt, Map, bytes, -0/NaN/Infinity y undefined sin coerción.
Cada reporte incluye hashes del manifiesto de casos y corpus, fuentes, oráculo,
entrada y salida. Dos ejecuciones completas produjeron archivos idénticos byte
a byte; no contienen duraciones o marcas temporales variables. Exit0 significa
que no hubo FAIL, **no** que los 289 BLOCKED estén conformes.

[README del harness](../conformance/README.md) fija CLI, protocolo del adaptador,
DTO y procedimiento formal de sustitución. Una futura implementación podrá
recibir exactamente las mismas entradas y devolver observados, sin acceder a las
expectativas ni modificarlas. F5-A no ejecuta una segunda implementación ni
presenta regresión Git como interoperabilidad. fixture_base no identifica el
commit de una futura implementación externa.

### Ejecución y pruebas del sistema de prueba

Entorno: Node v24.22.1, Chromium 155.0.8059.79. Comandos desde /workspace/yellow:

```bash
node conformance/build-corpus.cjs
node conformance/build-trace.cjs
node conformance/runner.cjs --out conformance/results/f5-a.json
node conformance/runner.cjs --out /tmp/f5a-repeat.json
cmp conformance/results/f5-a.json /tmp/f5a-repeat.json
node tests/f5-a.test.cjs
# node tests/<archivo> para las 25 suites anteriores F1–F4-G.
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
git diff --check
```

- Harness: **50 PASS / 0 FAIL / 289 BLOCKED / 0 UNTESTED** en ejecución completa.
- Infraestructura nueva: **12 PASS**, exit0. Demuestra respuesta incorrecta,
  excepción/causa inesperada, estructura alterada con hash igual, estados
  BLOCKED/FAIL/UNTESTED distintos, ningún PASS sin ejecutar, duplicados,
  oráculos ausentes, aislamiento, pureza de entrada, reproducibilidad,
  procedencia/hash alterado y codec exacto. Ejecución seleccionada: un PASS,
  49 UNTESTED y 289 BLOCKED.
- Regresión de ingeniería F1–F4-G: **482 PASS / 0 FAIL**, 25 archivos, mismos
  conteos por archivo; **476 actuales y seis caracterizaciones históricas**
  v0.2.5 fijadas en Git (F3G-16/17, F3H-06/15/16/23). Las seis no acreditan
  conformidad vigente. No existe una suite separada F4-G: sus contrastes están
  incorporados en los 12 casos F4-F, sin omisiones/TODO.
- Integración EXPERIMENT→RECORDER→REPLAY→VALIDACIÓN/MATCH en ambos modos:
  ejecutada en F4E-11/14 y F3-F/G/H. Comparación WLS1 histórica F4E-14 y nuevos
  oráculos independientes conservados.
- Chromium: **16 PASS**, 15 repeticiones Node y un caso adicional de navegador.
  Subprocesos Git históricos y servidor localhost/navegador usaron la ejecución
  autorizada fuera del sandbox; no se sustituyeron sus referencias por el motor.
- Legacy: **13 PASS / 9 FAIL**, exit1; mismos IDs/mensajes que F4-G.
  T06/07/08/20/22 esperan Trajectory directa, T12/13/14 factories/enum retirados,
  T16 usa TOROIDAL y falla estado inicial. Sus T locales no son tests canónicos.

El [reporte completo](../conformance/results/f5-a.json) contiene cada entrada y
el [reporte de regresiones](../conformance/results/regressions.json) conserva
comandos/contexto, conteos por archivo y causas legacy. La lista de suites y sus
huellas está en engineering-regressions.json. No se mezclan categorías para
inflar una cifra de conformidad. No se reprodujo un defecto productivo nuevo en
los casos ejecutados; esto no prueba ausencia universal de defectos.

### Continuidad autorizable y límites de cierre

**GO para infraestructura; conformidad canónica completa NO ESTABLECIDA.**
Los 280 tests originales y V2–V10 mantienen el bloqueo documental. Para avanzar:
obtener nuevas fuentes auténticas con entradas/procedimientos/esperados, o aprobar
por orden separada un corpus sustituto derivado y versionado con IDs nuevos y
oráculos publicados antes de contrastar otro motor. La propuesta formal está en
README: enumerar lagunas, proponer casos nuevos, aprobación separada, congelar
expectativas y comparar sin acomodarlas. Los ND de F5-A son evidencia parcial,
no autorización para fingir T01–T280 recuperados ni reescribir §37.

La interfaz para F5-B está preparada; no se inicia interoperabilidad independiente
ni se declaran hitos B/C. Permanece la distinción entre reproducción interna,
regresión entre versiones del mismo motor, contraste contra oráculo independiente
y verdadera interoperabilidad. Tampoco se prueba la legitimidad histórica de
checkpoints ni causalidad externa de fallos de agente a partir de su prefijo.


<a id="f5-b"></a>
## F5-B — cobertura y preparación de base de aceptación

**COMPLETED como incremento de cobertura y expediente, no como conformidad global.**
Base main PR #31 `b13d637dd405d363442803ad53821f5a6c6f4a62`;
rama `dev/f5-b-conformance-coverage`. No se modifica WORLD/EXPERIMENT/RECORDER/
REPLAY/AGENT, PRNG, WLS1, renderer ni especificaciones vigentes. No se ejecuta
una segunda implementación, ni se declaran hitos B/C.

### Recuperación final delimitada

[recovery-f5-b.json](../conformance/recovery-f5-b.json) registra historial Git
alcanzable después de fetch, documentos/fuentes y 27 órdenes accesibles con
hashes/localizadores. El candidato histórico docs/specifications sigue siendo
un blob de un byte LF. No se encontró un corpus original completo ni una nueva
definición individual T auténtica. H034/HINIT conservan cláusulas recuperadas,
no tests históricos completos. Persisten 248 referencias parciales y 32 IDs
sin asignación; las 280 definiciones individuales están incompletas. V2–V10 están
expresamente pendientes de fijación, no se inventan sus salidas.

Hay referencias externas a v0.2.1/v0.2.4, pero no se recibió un archivo original
adicional verificable en este incremento. No hay acceso a la Biblioteca de
ChatGPT. La conclusión se limita a las fuentes consultadas, no a una imposibilidad
mundial de recuperación. Solo se reabre la búsqueda al disponer de un archivo
con procedencia verificable; no se repiten búsquedas sin fuente nueva ni se
solicita una exportación cuya disponibilidad no consta.

Los **289 BLOCKED originales permanecen idénticos**. No se los reclasifica ni se
renombra ND/ER como T. El inventario corpus.json y el material F5-A no cambian.

### Evidencia de cobertura, separada de gobernanza

La ampliación mantiene categorías y oráculos. [cases-f5-b.json](../conformance/cases-f5-b.json)
contiene las 50 entradas originales, idénticas, seguidas de 64 nuevas: **58
NORMATIVE-DERIVED y seis ENGINEERING-REGRESSION**, con IDs ND5B/ER5B, fuente,
cláusula, prioridad, precondición, operación, expectativa y procedimiento del
oráculo. Su número resulta de los contratos/contrastes elegidos, no es una meta
de PASS ni equivalencia científica con T01–T280.

P0 amplía restauración/float/rechazo del PRNG; tick sin confirmación, rollback
tras cinco fases, independencia de snapshot; continuidad frente a estados con
hashes retenidos o recalculados, discontinuidad temporal, eventos tipados fuera
de orden y secuencias no contiguas; cambios de costes/flags, Observation/Feedback,
RNG/energía de origen, modo, metadatos y representaciones Number/BigInt;
bytes WLS1/tags/UTF-8/binary64 y separación de hash WORLD/FULL por RNG.

P1 contrasta dominios y negativos válidos de WorldConfig, redondeo binary64 ties-to-even y
canonicalización de cero, flags de FeedbackConfig,
fronteras Chebyshev/pureza/RNG de Observation, acciones frente a borde/obstáculo,
tipo desconocido, lifecycle alrededor de umbral negativo y no resurrección,
fallo del agente con prefijo preservado, WAIT sin agente e inicialización sin
candidatos. P2 conserva la integración/pureza del consumidor en Chromium como
regresión de ingeniería, sin simular un nuevo corpus canónico de web.

Los prefijos completos MOVE/WAIT, el origen positivo de colisión y las políticas de recurso/hazard/
regeneración/propiedad de registros se clasifican ER cuando dependen de precisión
histórica incompleta o decisión de ingeniería. Sus expectativas son manuales y
sus hashes independientes; esa calidad no cambia su autoridad. Los ND negativos
usan los prefijos positivos compatibles como entradas explícitas y prueban una
obligación de rechazo identificada. No recuperan el ActionResult histórico entero.

[atomic-obligations-f5-b.json](../conformance/atomic-obligations-f5-b.json) añade
**48 filas** sobre los padres de obligations.json, sin sobrescribirlos. Cada fila
fija fuente/localizador, precondiciones, operación, postcondición/oráculo, casos y
alternativa de evidencia. Se distinguen propiedades atómicas aun cuando compartan
un caso (por ejemplo restaurar estado y restaurar RNG). La
[matriz de preaceptación](CONFORMANCE_PREACCEPTANCE_F5-B.md) y su
[JSON](../conformance/results/preacceptance-f5-b.json) vinculan resultados ejecutados:

| Decisión | Filas | Interpretación |
|---|---:|---|
| SATISFIED_WITH_EXECUTED_EXAMPLES | 35 | Solo aserciones y precondiciones concretas ejecutadas |
| PARTIALLY_COVERED | 5 | Políticas de ingeniería, metamorfismo o integración insuficientes para cobertura general |
| DOCUMENTATION_BLOCKED | 4 | Corpus original, invariantes antiguos, mecánicas históricas incompletas, vectores pendientes |
| REPRODUCIBLE_FAIL | 0 | No se reprodujo un defecto productivo nuevo en las entradas ejecutadas |
| NON_EXECUTABLE_ALTERNATIVE_EVIDENCE | 3 | Prohibiciones arquitectónicas, límite de procedencia y decisión de aceptación |
| INDEPENDENT_IMPLEMENTATION_REQUIRED | 1 | Interoperabilidad/Hito C, no autorizado ni ejecutado aquí |

Todas las filas conservan domain_coverage=PARTIAL y universal_conformance_claim=false.
Son decisiones de evidencia acotada, no cumplimiento universal de una sección.
Las filas documentales no reemplazan ni descuentan los 289 tests/vectores bloqueados.

El fixture [collision-f5-b.json](../conformance/collision-f5-b.json) fija una colisión
real: energías binary64 1.8873007147162755 y 1.5414347304747777, time=8,
WORLD FNV=1873394908 y FULL FNV=1720692783 para ambos estados válidos. Se obtuvo
mediante búsqueda determinista acotada de mantisas SHA-256 y cálculo Buffer/BigInt
independiente, sin cargar producción. Los builders reproducen solo sus dos índices
fijados. El test de infraestructura verifica también los hashes productivos de
ambos estados; el caso ND rechaza el estado equivocado aunque sus dos hashes sean
correctos e iguales. Es un fixture derivado, no V2–V10 ni un defecto de FNV.

### Independencia, contraste y preservación F5-A

Las expectativas se fijan sin cargar yellow: BigInt/Buffer para matemáticas,
bytes y UTF-8; fixtures manuales y relaciones metamórficas identificadas. Un caso
de separación WORLD/AGENT varía los draws del RNG privado del agente manteniendo
WAIT: es reproducción metamórfica dentro de un motor, no interoperabilidad ni
prueba estática completa de ausencia de flujos prohibidos.

[mutation-f5-b.cjs](../conformance/mutation-f5-b.cjs) ejecuta cada caso nuevo con
el adaptador real y después corrompe un campo/byte o suprime su excepción.
El [reporte](../conformance/results/f5-b-mutants.json) conserva **64 baseline PASS
y 64 respuestas corruptas detectadas como FAIL**. Esto satisface el contraste de
sensibilidad a respuesta incorrecta; no es un mutation score exhaustivo de código,
no son 64 defectos productivos ni se agregan a los FAIL del corpus normativo.

Durante la construcción se corrigió un enlace del adaptador al helper estático
World._finite_energy_sum; los tres esperados matemáticos no cambiaron y no se
modificó producción. Ese TypeError inicial fue de infraestructura, no un defecto
normativo del motor. No se encontró un error de oráculo que exigiera revisar F5-A. Sus 50 entradas,
expectativas/oráculos y su reporte original permanecen íntegros; el test F5B-INFRA-01
los compara y ejecuta el reporte por defecto byte/estructura equivalente. La
única ampliación del runner es `--cases` para seleccionar otro manifiesto bajo
conformance/: comparación, aislamiento, categorías y comportamiento por defecto
no cambian. El adaptador añade operaciones de prueba aisladas; no modifica archivos
productivos. La documentación de uso está en [README-F5-B](../conformance/README-F5-B.md).

### F5B-ACCEPTANCE-BASIS-REVIEW — preparación de decisión

Naturaleza: **Methodological and Normative Acceptance-Governance Decision Preparation**.
Su resultado es una propuesta, no una modificación de las hipótesis experimentales,
reglas físicas ni teoría de agentes. Los avances de cobertura anteriores son
resultados de validación separados de esta gobernanza.

[CONFORMANCE_ACCEPTANCE_PROPOSAL.md](CONFORMANCE_ACCEPTANCE_PROPOSAL.md) entrega:
A) recuperación auténtica y ejecución del corpus original, conservando §37;
B) corpus sustituto de obligaciones actuales con IDs nuevos, únicamente mediante
decisión normativa expresa posterior. Incluye justificación documental delimitada,
inventario, vacíos, independencia de oráculos, suficiencia por obligación,
exclusiones, revisión alternativa, comparación entre motores y tratamiento de
fuentes históricas que aparezcan después. Contiene el texto exacto propuesto para
§37, marcado **PROPOSED ONLY / NO APROBADO / NO VIGENTE**. No se aplica al archivo
normativo ni aprueba B por el mero hecho de presentar el expediente.

Ningún total arbitrario de pruebas sustituye 280. Se propone revisar cierre de
fuentes/reglas, particiones de dominio, oráculos, evidencia adversarial y alternativas
estáticas; las obligaciones no definidas deben recuperarse o precisarse expresamente,
no aceptarse porque el motor actual las implemente de una manera compatible.
Hito B requiere el criterio vigente o una enmienda aprobada y evidencias suficientes;
Hito C conserva además la segunda implementación y condiciones/vectores de su revisión.

### Ejecución reproducible y resultados separados

Comandos desde /workspace/yellow, Node v24.22.1, Chromium 155.0.8059.79:

```bash
node conformance/build-f5-b.cjs
node conformance/build-atomic-f5-b.cjs
node conformance/runner.cjs --out /tmp/f5b-original50.json
cmp conformance/results/f5-a.json /tmp/f5b-original50.json
node conformance/runner.cjs --cases cases-f5-b.json --out conformance/results/f5-b.json
node conformance/runner.cjs --cases cases-f5-b.json --out /tmp/f5b-repeat.json
cmp conformance/results/f5-b.json /tmp/f5b-repeat.json
node conformance/build-preacceptance-f5-b.cjs
node conformance/mutation-f5-b.cjs conformance/results/f5-b-mutants.json
node tests/f5-a.test.cjs
node tests/f5-b.test.cjs
# node tests/<archivo> para las 25 suites F1–F4-G.
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js \
node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
git diff --check
```

| Categoría del corpus ampliado | PASS | FAIL | BLOCKED | UNTESTED |
|---|---:|---:|---:|---:|
| CANONICAL-RECOVERED | 6 | 0 | 0 | 0 |
| NORMATIVE-DERIVED | 97 | 0 | 0 | 0 |
| ENGINEERING-REGRESSION | 11 | 0 | 0 | 0 |
| Sin definición ejecutable / category=null | 0 | 0 | 289 | 0 |

403 entradas: 114 ejecutadas y 289 bloqueadas. El [reporte completo](../conformance/results/f5-b.json)
es idéntico byte a byte en ejecuciones repetidas. Selección parcial marca los
omitidos UNTESTED en lugar de PASS. Las pruebas de infraestructura dan **12 PASS
F5-A + seis PASS F5-B**, sin omitidos/TODO; validan preservación, reproducción,
sensibilidad, enlaces atómicos y selección de manifiesto sin traversal.

Regresión F1–F4-G: **482 PASS / 0 FAIL**, mismos conteos de cada uno de los
25 archivos; 476 casos actuales y seis caracterizaciones históricas v0.2.5,
que no se cuentan como conformidad vigente. Integración EXPERIMENT→RECORDER→
REPLAY→VALIDACIÓN/MATCH reejecutada en F3-F/G/H y F4E-11/14. Chromium **16 PASS**
(15 repiten Node y un caso adicional real). Legacy **13 PASS / 9 FAIL**, exit1,
mismos IDs/mensajes: T06/07/08/20/22 esperan Trajectory directa, T12/13/14 factories/
enum retirados y T16 usa TOROIDAL/falla validación inicial. No se modifican sus
expectativas. El [reporte de regresión](../conformance/results/regressions-f5-b.json)
conserva resultados por archivo, comandos y causas. Git histórico y navegador
localhost se ejecutaron con la excepción de sandbox autorizada; no se alteraron
referencias para eludir la restricción.

**GO para revisión del incremento y expediente; HOLD para resolver/declarar la
base de aceptación canónica.** El siguiente paso recomendado es decidir A con
archivos verificables o revisar/aprobar expresamente B y cerrar lagunas de autoridad
antes de fijar su manifiesto. Se requiere orden posterior para modificar §37 o
iniciar una segunda implementación. No se fusiona ni despliega este incremento.


<a id="f5-c"></a>
## F5-C — Perfil candidato de aceptación y preparación normativa

**F5C-001 — ACCEPTANCE BASIS CANDIDATE PREPARATION.** Clasificación:
**Methodological and Normative Acceptance-Governance Decision Preparation**.
Expediente preparado para una decisión expresa; no es una aprobación normativa.
[Informe y texto final propuesto de §37](ACCEPTANCE_PROFILE_F5-C.md),
[manifiesto candidato](../conformance/acceptance-profile-candidate.json),
[índice reproducible](../conformance/profile/README.md).

Se indexa íntegramente el texto disponible: 141 fichas de cláusulas/fragmentos,
572 unidades literales/referenciales (A=429, B=55, C=86, D=2), 515 marcadores
obligatorios. **No son 515 obligaciones semánticas independientes**: hay alias,
fragmentos y 66 identificadores opacos I01–I66 cuya definición no está disponible.
No se afirma haber reconstruido el universo contractual histórico completo.
Las clases A/B/C/D/E distinguen norma vigente, fragmento histórico incorporado,
referencia incompleta, política técnica y precisión propuesta. La captura de
mensajes anteriores del responsable conserva su procedencia y alcance; no es una
copia del manuscrito histórico completo ni eleva las políticas a norma.

[Revisión individual de los 114 casos](../conformance/profile/corpus-quality-review.json):
58 ejemplos obligatorios definidos, 44 condicionales a precisiones y 12
complementarios. Se conservan categorías, entradas, expectativas y oráculos.
[Matriz de suficiencia](../conformance/profile/sufficiency-matrix.json):
3 SATISFIED_BY_EVIDENCE (solo conjuntos finitos FNV, semillas y V1), 227 PARTIAL,
97 BLOCKED_BY_UNRESOLVED_CONTRACT, 24 BLOCKED_BY_MISSING_TEST,
162 REQUIRES_STATIC_REVIEW, 2 REQUIRES_INDEPENDENT_IMPLEMENTATION,
0 VERIFIED_EXCEPTION sobre los marcadores obligatorios. Tres límites normativos
reales de alcance se registran aparte: no dispensan obligaciones pendientes.
No se promueven los 35 ejemplos satisfechos de F5-B a suficiencia completa.

[Brechas y precisiones](../conformance/profile/contract-gaps.json): diez decisiones,
nueve bloqueantes y una consolidación editorial no bloqueante (INIT-004, ya
resuelta). G00 requiere fuente verificable o un anexo contractual completo
expresamente aprobado; cerrar solo políticas conocidas no demuestra exhaustividad.
Se recomienda **HOLD**, con alternativas, texto mínimo, efecto y pruebas por brecha.
ActionResult, eventos, dinámica, interfaces, límites y políticas de representación
mantienen su distinción de autoridad. D-01 prevalece en sus sustituciones expresas.

[Revisión estática](../conformance/profile/architecture-review.json): nueve áreas,
29 archivos citados con función, intervalo y SHA; cinco notas P2 por referencias
obsoletas en comentarios de agentes. No se reprodujo una violación funcional P0/P1
ni se corrigió producción. La inspección acotada no demuestra propiedades
universales ni sustituye revisión independiente. La ausencia de Metrics no elimina
su restricción condicional. Se preservan fail-stop de EXPERIMENT y restauración
conjunta de replay, sin inventar una transacción global adicional.

[Nueve vectores PV-F5C](../conformance/profile/vector-candidates.json), calculados
con Python/struct/FNV y contrastados con el oráculo independiente Buffer/BigInt:
bytes, estados y hashes exactos; PROPOSED ONLY, no V2–V10 históricos recuperados.
Su fijación requeriría aprobación anterior a comparar implementaciones.
No se inicia segunda implementación ni interoperabilidad.

[Ejecuciones por archivo y comandos](../conformance/profile/regression-results.json):
27 suites previas, 500 PASS/0 FAIL (494 aserciones actuales y seis de v0.2.5 fija);
11 pruebas nuevas del perfil PASS. Navegador: 16 PASS, incluidos 15 casos Node
repetidos y un caso adicional real en Chromium. F5-A completo: 50 PASS y 289 BLOCKED;
F5-B completo: 114 PASS y 289 BLOCKED; ambos resultados idénticos byte a byte a sus
reportes fijados. No sumar corpus superpuestos. Legacy: 13 PASS/9 FAIL conocidos
por esquemas y constructores retirados, sin modificar sus aserciones.
El validador comprueba fuentes, hashes, literales, referencias, obligatoriedad,
fronteras de autoridad, nueve vectores y rechazo de suficiencia falsificada.

**Límite de cierre:** F5-C deja un expediente para rechazar/aprobar la base, con
recomendación HOLD por contenido obligatorio indeterminado. La propuesta final
§37 identifica perfil/revisión, reglas de suficiencia, versionado, aprobación,
suspensión y recuperación posterior de fuentes, pero no se aplica a la norma.
Los 289 bloqueos permanecen y no cuentan como PASS. Sin merge, despliegue,
conformidad global ni declaración de hitos B/C.
