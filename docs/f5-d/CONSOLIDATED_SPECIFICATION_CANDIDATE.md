# WORLD-LAB — Consolidated Specification Candidate (Producto A)

**DRAFT / UNAPPROVED / NON-NORMATIVE. Sin número de versión nuevo.**
Base de análisis: `a3fb5b823bfdf74a981e9acf9e10bb30cc18b478`. No sustituye v0.2.5, D-01 ni §37.

Este candidato expresa únicamente partes sustentadas de contratos; las marcas editoriales identifican lo ausente. No es todavía una especificación autocontenida completa ni una prueba de equivalencia global. Producto B está separado en [NORMATIVE_CHANGE_PROPOSALS.md](NORMATIVE_CHANGE_PROPOSALS.md).

Autoridad: D-01 en sustituciones expresas, v0.2.5 en lo demás, fragmentos recuperados con alcance y atribución preservados. El código nunca completa una laguna normativa. Métodos de verificación y localizadores son anotaciones editoriales, no requisitos nuevos.

Los esquemas se interpretan semánticamente: mapa no obliga a Map/clase JS. No se impone la representación interna actual como condición portable.

Índice:
- [WL-R-AUTH — Prioridad y estados de autoridad](#wl-r-auth)
- [WL-R-SCOPE — Alcance experimental explícito y exclusiones heredadas](#wl-r-scope)
- [WL-R-BOUNDARIES — Separación de responsabilidades](#wl-r-boundaries)
- [WL-R-NOLEARN — WORLD no aprende; estado interno del agente](#wl-r-nolearn)
- [WL-R-CONFIG — WorldConfig: esquema, dominios y validación](#wl-r-config)
- [WL-R-ENERGY — Operaciones energéticas binary64](#wl-r-energy)
- [WL-R-STATE — Esquema y copia de WorldState](#wl-r-state)
- [WL-R-CELL — Dominio de Cell y orden espacial](#wl-r-cell)
- [WL-R-ENTITY — Entity: identidad, posición y lifecycle](#wl-r-entity)
- [WL-R-RNG — Xorshift32 y restauración de estado](#wl-r-rng)
- [WL-R-FLOAT — next_float](#wl-r-float)
- [WL-R-INT — next_int mediante rechazo](#wl-r-int)
- [WL-R-RNG-REF — Vectores Xorshift publicados](#wl-r-rng-ref)
- [WL-R-SEED — derive_seed y UTF-8 estricto](#wl-r-seed)
- [WL-R-INIT — Inicialización: procedimiento y resultado conocidos](#wl-r-init)
- [WL-R-MAP — Generación determinista recuperada](#wl-r-map)
- [WL-R-SPAWN — Selección inicial canónica](#wl-r-spawn)
- [WL-R-INIT-EVENTS — Separación crudo/grabado en inicialización](#wl-r-init-events)
- [WL-R-ACTION — Action: estructura y reconocimiento](#wl-r-action)
- [WL-R-ACTION-MOVE — MOVE: precedencia y límites](#wl-r-action-move)
- [WL-R-ACTION-RESULT — ActionResult: contrato parcialmente recuperado](#wl-r-action-result)
- [WL-R-ACTION-ENERGY — Energía de acciones y WAIT](#wl-r-action-energy)
- [WL-R-LIFECYCLE — Resolución de muerte](#wl-r-lifecycle)
- [WL-R-DYNAMICS — Dinámica autónoma y regeneración](#wl-r-dynamics)
- [WL-R-OBS — Observation: proyección y pureza](#wl-r-obs)
- [WL-R-FEEDBACK-CONFIG — FeedbackConfig recuperado](#wl-r-feedback-config)
- [WL-R-FEEDBACK — Feedback y proyección de acción previa](#wl-r-feedback)
- [WL-R-EVENT-SCHEMA — Eventos crudos y enriquecimiento exclusivo](#wl-r-event-schema)
- [WL-R-EVENT-ACTION — Eventos operacionales de MOVE/WAIT](#wl-r-event-action)
- [WL-R-EXPERIMENT-CONFIG — ExperimentConfig y límites](#wl-r-experiment-config)
- [WL-R-TIME — Orden del tick y propiedad temporal](#wl-r-time)
- [WL-R-TERMINATION — Terminación única y precedencia](#wl-r-termination)
- [WL-R-TICK-TRANSACTION — Confirmación atómica WORLD y RNG](#wl-r-tick-transaction)
- [WL-R-RUN — Ejecución con agente](#wl-r-run)
- [WL-R-NOAGENT — Ejecución sin agente](#wl-r-noagent)
- [WL-R-AGENT-FAIL — Fallo del agente y prefijo preservado](#wl-r-agent-fail)
- [WL-R-INIT-FAIL — Fallo inicial fuera de Trajectory](#wl-r-init-fail)
- [WL-R-RECORD-INITIAL — Registro inicial y replay de eventos](#wl-r-record-initial)
- [WL-R-SEQUENCE — Secuencia global y representación temporal](#wl-r-sequence)
- [WL-R-RECORD-STEP — StepRecord y publicación completa](#wl-r-record-step)
- [WL-R-TRAJECTORY — Trajectory y motivos de cierre](#wl-r-trajectory)
- [WL-R-FNV — FNV-1a sobre bytes](#wl-r-fnv)
- [WL-R-HASH — Hashes WORLD/FULL y límites](#wl-r-hash)
- [WL-R-WLS1 — Serialización binaria recuperada](#wl-r-wls1)
- [WL-R-WLS1-REF — Vectores WLS1 y fijación pendiente](#wl-r-wls1-ref)
- [WL-R-REPLAY-REQUEST — Solicitud de replay y contexto explícito](#wl-r-replay-request)
- [WL-R-REPLAY-ORIGIN — Origen0 y segmentos positivos](#wl-r-replay-origin)
- [WL-R-REPLAY-INVALID — INVALID_REPLAY_INPUT: contadores y salidas](#wl-r-replay-invalid)
- [WL-R-REPLAY-STATUS — ReplayResult: estados y coherencia](#wl-r-replay-status)
- [WL-R-REPLAY-CONTINUITY — Continuidad con contexto completo](#wl-r-replay-continuity)
- [WL-R-REPLAY-ATOMIC — Checkpoint y rollback de replay](#wl-r-replay-atomic)
- [WL-R-REPLAY-COMPARE — Comparación exhaustiva y causa terminal](#wl-r-replay-compare)
- [WL-R-REPLAY-INVARIANT — Replay Invariant incorporado §25.9](#wl-r-replay-invariant)
- [WL-R-TIME-REPR — Representación temporal exacta D-01](#wl-r-time-repr)
- [WL-R-ERRORS — Catálogo y clasificación de errores](#wl-r-errors)
- [WL-R-AGENT — Contrato heredado de agente](#wl-r-agent)
- [WL-R-RENDERER — Renderer consumidor de snapshots](#wl-r-renderer)
- [WL-R-METRICS — Metrics consumidor de Trajectory](#wl-r-metrics)
- [WL-R-INVARIANTS — Conservación de invariantes explícitos I67–I82](#wl-r-invariants)
- [WL-R-INVARIANTS-LEGACY — Familia de referencias I01–I66 sin definiciones](#wl-r-invariants-legacy)
- [WL-R-PSEUDOCODE — Pseudocódigo y alias normativos](#wl-r-pseudocode)
- [WL-R-REPRO — Reproducibilidad y sesgos](#wl-r-repro)
- [WL-R-CORPUS — Inventario histórico y referencias de aceptación](#wl-r-corpus)
- [WL-R-CONFORMANCE — Criterio vigente §37 y límites de declaración](#wl-r-conformance)
- [WL-R-TERMS — Terminología y términos heredados](#wl-r-terms)

<a id="wl-r-auth"></a>
## WL-R-AUTH — Prioridad y estados de autoridad

Estado de definición directa: **DETERMINED**. Sujetos: Gobierno de requisitos.

Precondiciones: Interpretación de contratos de la revisión vigente.

Dominio: v0.2.6 D-01 sobre v0.2.5 y referencias incorporadas.

Aplicar D-01 solo en sustituciones expresas; código no normativo; FROZEN no implica VERIFIED; distinguir Conformance, Replay e Interoperability.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Las declaraciones identifican autoridad y evidencia; no afirmar B/C por cierre documental.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§0, S025:§0.1, S025:§0.2, S025:§0.3, S025:§0.4, S025:§0.5, S025:§38, S025:§ANNEX, S025:§PREAMBLE, S026:§D01-PREAMBLE. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: ninguna adicional expresada.

<a id="wl-r-scope"></a>
## WL-R-SCOPE — Alcance experimental explícito y exclusiones heredadas

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: WORLD/EXPERIMENT/consumidores.

Precondiciones: Interpretar resultados del laboratorio.

Dominio: Una entidad; grid BOUNDED; recursos binarios; hazards estáticos; cinco acciones.

El instrumento es computacional reproducible. No derivar cooperación ni adaptación a hazards dinámicos del modelo de una entidad y peligros estáticos.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Límites de inferencia identificados; las exclusiones heredadas no disponibles permanecen pendientes.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** §1.3 incorpora exclusiones de v0.2.4 sin enumerarlas.

Fuentes/cláusulas: S025:§1, S025:§1.1, S025:§1.2, S025:§1.3, S025:§35.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-boundaries"></a>
## WL-R-BOUNDARIES — Separación de responsabilidades

Estado de definición directa: **DETERMINED**. Sujetos: WORLD/AGENT/EXPERIMENT/RECORDER/METRICS/RENDERER.

Precondiciones: Ejecución de componentes del instrumento.

Dominio: Acceso a estado, RNG, reloj, snapshots y trayectorias.

WORLD no importa AGENT/EXPERIMENT ni inspecciona estado interno de AGENT. AGENT recibe Feedback y produce Action sin acceso directo a WORLD. RECORDER no muta WORLD; METRICS no muta Trajectory; RENDERER solo lee snapshots.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: La comunicación y mutaciones respetan estas fronteras.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Observación no consume RNG; execute_tick no accede Recorder, no modifica time ni sincroniza RNG.

Fuentes/cláusulas: S025:§2, S025:§4, S025:§4.1, S025:§4.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-nolearn"></a>
## WL-R-NOLEARN — WORLD no aprende; estado interno del agente

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: WORLD/AGENT.

Precondiciones: Evolución física y ejecución del agente.

Dominio: Estado interno mutable de AGENT permitido.

WORLD no aprende ni conoce al agente; no inspecciona ni modifica su estado interno.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: La física permanece independiente del aprendizaje del agente.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G08](UNRESOLVED_DECISIONS.md#dec-g08):** Alcance adicional §39 idéntico a v0.2.4 ausente; no inferir límites adicionales.

Fuentes/cláusulas: S025:§1.4, S025:§1.5, S025:§39, S025:§4.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-BOUNDARIES.

<a id="wl-r-config"></a>
## WL-R-CONFIG — WorldConfig: esquema, dominios y validación

Estado de definición directa: **DETERMINED**. Sujetos: WorldConfig.

Precondiciones: Configuración suministrada antes de construir WORLD.

Dominio: Esquema cerrado: width/height enteros [1,2^32−1]; topology=BOUNDED; tres densidades binary64 [0,1], recurso+peligro≤1; initial_energy finita; move_cost/wait_cost/resource_effect/hazard_damage/resource_regeneration enteros [0,2^32−1]; death_threshold entero seguro ±(2^53−1); observation_radius entero [0,2^32−1].

Validar tipos sin alterar dominios; width×height≤2^20 mediante representación suficientemente amplia; congelar configuración.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Configuración válida e inmutable o rechazo anterior a generación.

Fallos: ContractError("invalid world_config"); nunca "insufficient resources".

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§6, S025:§6.1, S025:§6.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-energy"></a>
## WL-R-ENERGY — Operaciones energéticas binary64

Estado de definición directa: **DETERMINED**. Sujetos: Operaciones sobre energy.

Precondiciones: Operación energética aplicable.

Dominio: IEEE-754 binary64 finito, incluye negativos/subnormales y ±0 de entrada.

Calcular cada candidato binary64 round-to-nearest ties-to-even, canonicalizar -0 a +0 y verificar finitud. No redondeos arbitrarios ni precisión extendida observable.

Orden: Cálculo → canonicalización → comprobación de finitud; el orden entre coste/efecto se trata en WL-R-ACTION-ENERGY.

Postcondiciones: Cada resultado conserva bits salvo cero; no mutar estado si candidato no finito.

Fallos: ContractError sin modificar estado ante no finitud.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§13, S025:§6.3, S025:§6.4. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG.

<a id="wl-r-state"></a>
## WL-R-STATE — Esquema y copia de WorldState

Estado de definición directa: **DETERMINED**. Sujetos: WorldState.

Precondiciones: Estado efectivo válido.

Dominio: Exactamente time:uint64, grid rectangular height×width, entities:mapa con una entrada, rng_state:uint32 no cero.

Preservar esquema y dominios; full_snapshot produce copia profunda.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Snapshot estructural independiente del estado activo.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§7, S025:§7.1, S025:§7.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-CELL, WL-R-ENTITY.

<a id="wl-r-cell"></a>
## WL-R-CELL — Dominio de Cell y orden espacial

Estado de definición directa: **DETERMINED**. Sujetos: Cell/grid.

Precondiciones: Celda de grid válido.

Dominio: traversal FREE/BLOCKED; effect null/RESOURCE(stock)/HAZARD; stock binario por fuente recuperada de mapa y contrato del incremento F2-A.

BLOCKED sin efecto; como máximo un efecto por celda; recorrido canónico y luego x. Recursos iniciales stock=1 en generate_map recuperado.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Grid estructural BOUNDED sin efectos incompatibles.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§11.2, S025:§1.3, S025:§11.2, S025:§8. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG.

<a id="wl-r-entity"></a>
## WL-R-ENTITY — Entity: identidad, posición y lifecycle

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: EntityState.

Precondiciones: Entidad perteneciente a WorldState.

Dominio: id string UTF-8 no vacío; position; energy binary64 finita; lifecycle ACTIVE/DEAD.

ACTIVE está en celda FREE; DEAD permanece; no resurrección.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Estado de entidad respeta dominios y ciclo de vida explícito.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Dominio completo de Position y esquema JS exacto no se desarrollan aquí; recuperar contrato heredado, no deducirlo exclusivamente del layout WLS1.

Fuentes/cláusulas: S025:§9. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG.

<a id="wl-r-rng"></a>
## WL-R-RNG — Xorshift32 y restauración de estado

Estado de definición directa: **DETERMINED**. Sujetos: PRNG.

Precondiciones: Estado y semilla uint32 distintos de cero.

Dominio: state∈[1,2^32−1].

Aplicar XOR/shift13, lógico17, shift5 con reducción uint32 en cada paso; devolver y guardar resultado no cero. RNG pertenece WORLD y rng_state figura en WorldState. Rollback restaura RNG.

Orden: 13 izquierda →17 derecha lógico →5 izquierda.

Postcondiciones: Misma secuencia para mismo estado; estado cero rechazado sin confirmar actualización.

Fallos: Estado cero: ContractError("rng zero state").

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§10, S025:§10.1, S025:§10.4, S025:§10.5, S025:§10.7. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-float"></a>
## WL-R-FLOAT — next_float

Estado de definición directa: **DETERMINED**. Sujetos: PRNG.next_float.

Precondiciones: PRNG válido.

Dominio: Salida binary64 en [0,1).

Devolver binary64(next())/4294967296.0 con redondeo binary64 estándar.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Una extracción de next por llamada.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§10.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RNG.

<a id="wl-r-int"></a>
## WL-R-INT — next_int mediante rechazo

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: PRNG.next_int.

Precondiciones: Intervalo entero [a,b] cuya cardinalidad permita rechazo con aceptación no vacía.

Dominio: n=b−a+1; n>0 y n≤2^32 son necesarios para límite de aceptación positivo; dominio completo de extremos no publicado.

limit=2^32−(2^32 mod n); repetir next hasta u<limit; devolver a+(u mod n).

Orden: Calcular n/limit → extraer/rechazar → devolver.

Postcondiciones: No sustituir por módulo directo sin rechazo.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G07](UNRESOLVED_DECISIONS.md#dec-g07):** Dominio histórico de a/b y diagnóstico de intervalos inválidos ausentes. Extremos Number seguros son restricción técnica aceptada, no dominio histórico demostrado.

Fuentes/cláusulas: S025:§10.3. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RNG.

<a id="wl-r-rng-ref"></a>
## WL-R-RNG-REF — Vectores Xorshift publicados

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: PRNG / referencias.

Precondiciones: Aplicar vector publicado a su estado inicial.

Dominio: 270369,67634689,2647435461 publicados.

Conservar valores de referencia; no inventar la semilla que la tabla no explicita.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Los casos seed=1 calculados independientemente conservan categoría derivada, no recuperación histórica completa.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G09](UNRESOLVED_DECISIONS.md#dec-g09):** Semilla inicial de la tabla §10.6 no expresada.

Fuentes/cláusulas: S025:§10.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RNG.

<a id="wl-r-seed"></a>
## WL-R-SEED — derive_seed y UTF-8 estricto

Estado de definición directa: **DETERMINED**. Sujetos: derive_seed.

Precondiciones: base_seed y namespace válidos.

Dominio: base_seed:uint32≠0; namespace Unicode válido sin normalizar.

FNV1a_32(UTF8_STRICT(DECIMAL_ASCII(base_seed)+":"+namespace)); decimal sin ceros iniciales; h=0 se sustituye por1; surrogate no emparejado se rechaza.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Vectores (1,world)=2448580590 y (1,random_agent)=84506387 preservados.

Fallos: UTF-8 inválido: ContractError.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§11.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-FNV.

<a id="wl-r-init"></a>
## WL-R-INIT — Inicialización: procedimiento y resultado conocidos

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: initialize_world.

Precondiciones: WorldConfig y semilla suministradas.

Dominio: InitialWorldResult incluye world_state, initial_events crudos y rng_state.

Validar config/seed; PRNG(seed); generar y verificar recursos; elegir entidad; resolver lifecycle una vez; sincronizar RNG; validar estado/eventos; devolver snapshot y RNG efectivo. id inicial=0987898, energy=initial_energy, lifecycle inicialmente ACTIVE.

Orden: Pasos1–12 de §11.1; validación de eventos crudos según INIT-004.

Postcondiciones: Estado inicial efectivo a tiempo0; no doble lifecycle.

Fallos: Fallo sin posición: InitializationError("invalid initial_position"); límites se validan en config, no como insufficient resources.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** La frase "Si algún paso falla" y el único motivo invalid initial_position no determinan por sí solos la clasificación de fallos internos/configuración; no sustituir por un wrap universal.

Fuentes/cláusulas: S025:§11, S025:§11.1, S025:§11.4, S025:§11.5, S025:§5.7. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-MAP, WL-R-SPAWN, WL-R-LIFECYCLE, WL-R-INIT-EVENTS.

<a id="wl-r-map"></a>
## WL-R-MAP — Generación determinista recuperada

Estado de definición directa: **DETERMINED**. Sujetos: generate_map.

Precondiciones: WorldConfig válido y PRNG.

Dominio: Densidades y dimensiones de WorldConfig.

Recorrer y,x. Extraer r1; si r1<obstacle_density crear BLOCKED y continuar. En libres extraer r2; recurso si r2<resource_density; peligro si r2<resource_density+hazard_density; si no NONE. Recurso stock1.

Orden: y externo, x interno, obstáculo antes de efecto.

Postcondiciones: Una extracción por BLOCKED, dos por FREE; sin RNG adicional para efecto.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§11.2, S025:§11.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-FLOAT.

<a id="wl-r-spawn"></a>
## WL-R-SPAWN — Selección inicial canónica

Estado de definición directa: **DETERMINED**. Sujetos: create_entity_and_initial_position.

Precondiciones: Grid generado válido.

Dominio: Candidatos FREE sin efecto.

Lista en orden y,x; seleccionar con rng.next_int(0,len−1).

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Una selección entera; sin selección alternativa.

Fallos: Lista vacía: InitializationError("invalid initial_position").

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§11.3. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-MAP, WL-R-INT.

<a id="wl-r-init-events"></a>
## WL-R-INIT-EVENTS — Separación crudo/grabado en inicialización

Estado de definición directa: **DETERMINED**. Sujetos: WORLD/RECORDER.

Precondiciones: Estado inicial y eventos de lifecycle inicial.

Dominio: WorldEvent crudo de3 campos; RecordedEvent enriquecido de6.

Aplicar aclaración autorizada INIT-004: WORLD valida coherencia de eventos crudos; RECORDER valida tick0/source lifecycle/secuencias. ACTIVE sin muerte y DEAD con una muerte, identidad/posición concordantes.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No añadir metadatos a WORLD ni omitir validación; INIT-004 no se reabre.

Fallos: ContractError("invalid initial_events") en validación de eventos.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINIT:§11.7, S025:§11.7. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-LIFECYCLE, WL-R-EVENT-SCHEMA.

<a id="wl-r-action"></a>
## WL-R-ACTION — Action: estructura y reconocimiento

Estado de definición directa: **DETERMINED**. Sujetos: Action/World.apply_action.

Precondiciones: Entrada de acción.

Dominio: Esquema cerrado {type}; MOVE_N/S/E/W y WAIT reconocidos.

Validación estructural no enum; tipo desconocido produce ContractError cuando se aplica; no inventar acción alternativa.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Acción malformada no ejecuta transición.

Fallos: Estructura inválida: invalid action structure; tipo desconocido: ContractError (mensaje exacto no fijado por §13).

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§12, S025:§13. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-STATE.

<a id="wl-r-action-move"></a>
## WL-R-ACTION-MOVE — MOVE: precedencia y límites

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: World.apply_action.

Precondiciones: Acción MOVE reconocida y estado válido.

Dominio: Topología BOUNDED.

Comprobar ENTITY_NOT_ACTIVE → OUT_OF_BOUNDS → BLOCKED_CELL → INSUFFICIENT_ENERGY; respetar límites sin wrap.

Orden: Precedencia explícita de las cuatro condiciones.

Postcondiciones: No modificar time/lifecycle/rng_state ni emitir ENTITY_DIED.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G01](UNRESOLVED_DECISIONS.md#dec-g01):** Código exacto del ActionResult y efectos/costes en rechazo no están completamente fijados por texto recuperado.

Fuentes/cláusulas: S025:§13, S025:§6.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ACTION, WL-R-ACTION-RESULT.

<a id="wl-r-action-result"></a>
## WL-R-ACTION-RESULT — ActionResult: contrato parcialmente recuperado

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: World.apply_action / ActionResult.

Precondiciones: Aplicación de acción.

Dominio: Resultado ActionResult, energy_delta binary64 y eventos operacionales aplicables.

Devolver resultado de acción, preservar fronteras y no emitir muerte.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Forma y significado deben poder compararse independientemente del código.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G01](UNRESOLVED_DECISIONS.md#dec-g01):** Esquema completo, enums de validity/reason y clasificación de rechazos son ACT-P01 de ingeniería; no incorporarlos como norma.

Fuentes/cláusulas: S025:§13. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ACTION, WL-R-ENERGY.

<a id="wl-r-action-energy"></a>
## WL-R-ACTION-ENERGY — Energía de acciones y WAIT

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: World.apply_action.

Precondiciones: Acción reconocida; parámetros energéticos canónicos.

Dominio: Energía finita; costes/efectos/daños uint32.

Aplicar aritmética binary64, finitud y canonicalización; apply_action no ejecuta dinámica, lifecycle, reloj ni RNG.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No publicar estado con energía no finita.

Fallos: No finitud: ContractError sin mutación.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G01](UNRESOLVED_DECISIONS.md#dec-g01):** Disponibilidad previa al efecto, WAIT con energía negativa/coste0, orden coste/efecto y delta efectivo frente a nominal no se determinan íntegramente en §13. ACT-P02/03/05 son políticas.

Fuentes/cláusulas: S025:§13, S025:§6.3, S025:§6.4. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ENERGY, WL-R-ACTION.

<a id="wl-r-lifecycle"></a>
## WL-R-LIFECYCLE — Resolución de muerte

Estado de definición directa: **DETERMINED**. Sujetos: World.resolve_lifecycle.

Precondiciones: Entidad existente, ACTIVE o DEAD.

Dominio: energy/death_threshold en sus dominios.

Si ACTIVE y energy≤death_threshold, pasar a DEAD y emitir un WorldEvent ENTITY_DIED; DEAD no resucita ni vuelve a emitir. Inicialmente se resuelve una vez tras crear ACTIVE.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Evento crudo coherente; energía negativa permitida.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§14, S025:§14, S025:§5.7, S025:§9. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ENTITY, WL-R-EVENT-SCHEMA.

<a id="wl-r-dynamics"></a>
## WL-R-DYNAMICS — Dinámica autónoma y regeneración

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: World.advance_dynamics / regenerate_resources.

Precondiciones: Estado y configuración válidos.

Dominio: Recursos binarios y tasa uint32.

advance_dynamics invoca regenerate_resources, sin eventos; respeta fronteras WORLD/reloj/RNG y separación de acciones/lifecycle. S-1 permite regeneración en el mismo tick si tasa≥1.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No añadir nuevos tipos/estados ni aleatoriedad sin fuente.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G02](UNRESOLVED_DECISIONS.md#dec-g02):** Fórmula y unidad exacta de resource_regeneration no desarrolladas. DYN-P01 es elección compatible, no equivalencia histórica demostrada.

Fuentes/cláusulas: S025:§15, S025:§35.6, S025:§4.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CELL, WL-R-CONFIG, WL-R-BOUNDARIES.

<a id="wl-r-obs"></a>
## WL-R-OBS — Observation: proyección y pureza

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: build_observation.

Precondiciones: WORLD y entidad observada válidos; radio de configuración.

Dominio: Esquema superior cerrado tick,self,local_view; Chebyshev; tick:uint64 normalizado D-01-E.

OUT_OF_BOUNDS fuera de grid, occupied=false, no distinguir stock0/1 de recursos; función pura sin consumo RNG.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: WORLD y RNG intactos; tick refleja tiempo previo del estado.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G03](UNRESOLVED_DECISIONS.md#dec-g03):** Subesquemas self/local_view, representación exacta y aceptación operacional para radio grande siguen parcialmente documentados como OBS-P01–03.

Fuentes/cláusulas: S025:§16, S025:§35.6, S025:§4.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-STATE, WL-R-TIME-REPR.

<a id="wl-r-feedback-config"></a>
## WL-R-FEEDBACK-CONFIG — FeedbackConfig recuperado

Estado de definición directa: **DETERMINED**. Sujetos: FeedbackConfig.

Precondiciones: Configuración de exposición.

Dominio: Cuatro booleanos exactos: expose_validity=true, expose_reason=false, expose_events=false, expose_energy_delta=true por defecto.

Esquema cerrado, sin coerciones; validación estricta e inmutabilidad conforme a orden F2-I.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Configuración con cuatro flags reales e independientes.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§17, OWNER:F2-H/F2-I/F3-A as scoped in owner-clarifications.md, S025:§17. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-feedback"></a>
## WL-R-FEEDBACK — Feedback y proyección de acción previa

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: build_feedback.

Precondiciones: Observation, acción previa o ausencia, FeedbackConfig válido.

Dominio: Esquema superior observation,has_prior_action,last_action_result.

Sin acción previa: false/null. Con acción: true y proyección conforme a flags sin transmitir valores deshabilitados; no mutar entradas ni consumir RNG (orden F2-I).

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Feedback determinista; preservar límites de información.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G03](UNRESOLVED_DECISIONS.md#dec-g03):** Marcadores ocultos y subesquema proyectado nullable no reproducidos como norma histórica; FB-P01–03 son políticas compatibles.

Fuentes/cláusulas: HINLINE:§17, OWNER:F2-H/F2-I/F3-A as scoped in owner-clarifications.md, S025:§17. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-OBS, WL-R-ACTION-RESULT, WL-R-FEEDBACK-CONFIG.

<a id="wl-r-event-schema"></a>
## WL-R-EVENT-SCHEMA — Eventos crudos y enriquecimiento exclusivo

Estado de definición directa: **DETERMINED**. Sujetos: WORLD/RECORDER.

Precondiciones: Efecto o lifecycle efectivamente ejecutado.

Dominio: WorldEvent exactamente {type,entity_id,position}; RecordedEvent añade tick,source,sequence.

WORLD devuelve crudos; RECORDER enriquece, source=action/lifecycle, tick inicial0 o tick confirmado; no reenriquecer replay.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Registros nuevos, orden de eventos de acción antes de lifecycle.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§18, OWNER:F2-H/F2-I/F3-A as scoped in owner-clarifications.md, S025:§18, S025:§4.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-TIME-REPR.

<a id="wl-r-event-action"></a>
## WL-R-EVENT-ACTION — Eventos operacionales de MOVE/WAIT

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: World.apply_action.

Precondiciones: MOVE aceptado, WAIT o rechazo.

Dominio: ENTITY_MOVED, RESOURCE_CONSUMED, HAZARD_TRIGGERED; no ENTITY_DIED en apply_action.

Emitir efectos realmente ejecutados: consumo stock1→0 y peligro activado; WAIT no inventa desplazamiento/efecto de entrada; rechazo no emite efectos inexistentes.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Eventos describen transiciones reales.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G04](UNRESOLVED_DECISIONS.md#dec-g04):** Orden interno movimiento/efecto y evento de peligro magnitud0 figuran ACT-H01/02 técnicos; no atribuirlos a texto histórico no disponible.

Fuentes/cláusulas: HINLINE:§18, OWNER:F2-H/F2-I/F3-A as scoped in owner-clarifications.md, S025:§13, S025:§18. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-EVENT-SCHEMA, WL-R-ACTION-RESULT.

<a id="wl-r-experiment-config"></a>
## WL-R-EXPERIMENT-CONFIG — ExperimentConfig y límites

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: ExperimentConfig.

Precondiciones: Solicitud experimental.

Dominio: experiment_seed,max_ticks,world_config,feedback_config,agent_type; max_ticks:uint64; expected_steps no es max_ticks.

max_ticks=0 válido; conservar dominios D-01 y validaciones de configuraciones anidadas.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No coerción ni precisión perdida en max_ticks.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Dominio completo de agent_type y algunas propiedades históricas de construcción no reproducidos. No convertir grammar F3B-P01 en historia.

Fuentes/cláusulas: S025:§19, S025:§19.1, S026:§D01-AE. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-FEEDBACK-CONFIG, WL-R-TIME-REPR.

<a id="wl-r-time"></a>
## WL-R-TIME — Orden del tick y propiedad temporal

Estado de definición directa: **DETERMINED**. Sujetos: EXPERIMENT/tick kernel.

Precondiciones: Estado previo no terminal y transición aplicable.

Dominio: time:uint64; observación previa t; registro confirmado t+1.

apply_action→resolve_lifecycle→advance_dynamics→time=t+1→sync_rng_state→record_step. Solo orquestación EXPERIMENT avanza reloj; sync exactamente una vez por tick.

Orden: Orden explícito de §5.1 y §32; execute_tick por sí solo no modifica time/sync ni Recorder.

Postcondiciones: StepRecord.tick=world_state.time=t+1; observation.tick=t si existe.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§10.7, S025:§32, S025:§5, S025:§5.1, S025:§5.2, S025:§5.3. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ACTION, WL-R-LIFECYCLE, WL-R-DYNAMICS, WL-R-TIME-REPR.

<a id="wl-r-termination"></a>
## WL-R-TERMINATION — Terminación única y precedencia

Estado de definición directa: **DETERMINED**. Sujetos: determine_termination.

Precondiciones: Estado válido y max_ticks válido.

Dominio: ENTITY_DIED / MAX_TICKS_REACHED / null.

Muerte por lifecycle explícito precede límite; si no DEAD y time≥max_ticks devolver límite; si no null. Evaluar inicialmente y antes/después de tick.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No deducir muerte únicamente de energía ni terminación de expected_steps.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§20.4, S025:§5.4, S025:§5.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-LIFECYCLE, WL-R-TIME-REPR.

<a id="wl-r-tick-transaction"></a>
## WL-R-TICK-TRANSACTION — Confirmación atómica WORLD y RNG

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: execute_tick / execute_tick_transaction.

Precondiciones: Estado y max_ticks válidos, no terminal, incremento uint64 posible.

Dominio: Snapshot profundo y RNG efectivo antes de transición.

Ejecutar acción/lifecycle/dinámica; incrementar una vez; sync una vez; validar; confirmar. Fallo de transición restaura world.state y world.rng; no publicar resultado parcial.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Estado/RNG recuperables; no overflow uint64.

Fallos: invalid max_ticks conserva mensaje; transición fallida world transition failed; D-01 prohíbe incremento sobre UINT64_MAX.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Esquemas completos TickResult/ConfirmedTickResult proceden de F3A-P02/03 autorizados como ingeniería, no manuscrito histórico recuperado. §26.5 original ausente.

Fuentes/cláusulas: OWNER:F2-H/F2-I/F3-A as scoped in owner-clarifications.md, S025:§26.5, S025:§5.5, S026:§D01-E-FINAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-TIME, WL-R-TERMINATION, WL-R-STATE.

<a id="wl-r-run"></a>
## WL-R-RUN — Ejecución con agente

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: run_experiment.

Precondiciones: ExperimentConfig válido y factory suministrada.

Dominio: ExperimentResult status COMPLETED/FAILED, trajectory y motivos según §20.1.

Derivar semilla world y agent por namespace; inicializar/registrar; construir/reset agente; por tick observar y construir Feedback antes de agent.step; confirmar/registrar acción; actualizar última acción y evaluar terminación.

Orden: Inicialización/registro → factory/reset → terminación inicial → bucle §32.

Postcondiciones: Trayectoria refleja ejecución; agente recibe Feedback, no WORLD.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Esquema failure_details general menciona seed,message,config pero rama error de agente muestra message,config: variante de rama versus campo obligatorio requiere precisión; factory/reset fuera del TRY de step.

Fuentes/cláusulas: S025:§20, S025:§20.1, S025:§32. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-EXPERIMENT-CONFIG, WL-R-INIT, WL-R-FEEDBACK, WL-R-TICK-TRANSACTION, WL-R-RECORD-STEP.

<a id="wl-r-noagent"></a>
## WL-R-NOAGENT — Ejecución sin agente

Estado de definición directa: **DETERMINED**. Sujetos: run_without_agent.

Precondiciones: Configuración válida.

Dominio: Action WAIT y ActionResult real; observation=feedback=null.

Ejecutar WAIT real en cada tick, sin factory/reset/step, sin observación/Feedback. Semillas y resto de secuencia según §20.2.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: action/action_result nunca null; igualdad de nulos solo observation/feedback.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§20.2, S025:§20.3, S025:§27, S025:§32. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RUN, WL-R-ACTION, WL-R-RECORD-STEP.

<a id="wl-r-agent-fail"></a>
## WL-R-AGENT-FAIL — Fallo del agente y prefijo preservado

Estado de definición directa: **DETERMINED**. Sujetos: EXPERIMENT/AGENT.

Precondiciones: Excepción en step o Action estructuralmente inválida.

Dominio: ExperimentResult FAILED; termination_reason=AGENT_CONTRACT_ERROR.

No ejecutar tick con acción inválida, no reemplazar por WAIT, preservar trayectoria confirmada y marcar fallo. Replay valida prefijo, no certifica causa externa ni terminación física.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Fallo no es ejecución COMPLETED exitosa.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§20.6, S025:§28.5, S026:§D01-TRANSVERSAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-ACTION, WL-R-RUN.

<a id="wl-r-init-fail"></a>
## WL-R-INIT-FAIL — Fallo inicial fuera de Trajectory

Estado de definición directa: **DETERMINED**. Sujetos: EXPERIMENT/RECORDER.

Precondiciones: initialize_world produce el fallo de posición inicial previsto.

Dominio: InitializationFailure y ExperimentResult FAILED con trajectory=null.

Registrar seed/reason/message/config fuera de Trajectory para invalid initial_position. No falsificar estado inicial o pasos.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Fallo de posición no se oculta ni se convierte en muestra válida.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§11.1, S025:§20.1, S025:§20.2, S025:§20.5. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-INIT, WL-R-SPAWN.

<a id="wl-r-record-initial"></a>
## WL-R-RECORD-INITIAL — Registro inicial y replay de eventos

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: RECORDER.

Precondiciones: Estado inicial efectivo y WorldEvent iniciales, o RecordedEvent suministrados de replay.

Dominio: Eventos vacíos o coherentes; source lifecycle; contador global de secuencia seguro.

Copiar estado; no resolver lifecycle otra vez; enriquecer iniciales tick0/sequence desde0; replay conserva eventos sin reenriquecer. Vacíos→counter0; no vacíos→max(sequence)+1 exacto o rechazo antes de publicar si no representable.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Copias independientes, secuencia global entre ticks y atomicidad inicial.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Contrato completo §§21.1–21.4 no reproducido; precisión de contador seguro se apoya en D-01 y preparación F3-C, no inferir esquema interno JS.

Fuentes/cláusulas: HINLINE:§18, S025:§18, S025:§21, S025:§21.5, S026:§D01-B. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-INIT-EVENTS, WL-R-SEQUENCE, WL-R-REPLAY-ORIGIN.

<a id="wl-r-sequence"></a>
## WL-R-SEQUENCE — Secuencia global y representación temporal

Estado de definición directa: **DETERMINED**. Sujetos: RECORDER/replay.

Precondiciones: Eventos publicados dentro de una trayectoria o segmento.

Dominio: sequence:Number entero seguro≥0; ticks:uint64; expected_steps:Number entero seguro≥0.

Secuencias contiguas desde0, globales entre ticks de segmento y no consumidas definitivamente en fallo; no wraparound ni conversión con pérdida.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Siguiente contador es exacto o publicación rechazada.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: HINLINE:§18, S025:§18, S025:§21.5, S026:§D01-AE, S026:§D01-B. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-TIME-REPR.

<a id="wl-r-record-step"></a>
## WL-R-RECORD-STEP — StepRecord y publicación completa

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: RECORDER.record_step.

Precondiciones: Tick confirmado, contexto observado o sin agente.

Dominio: Once campos §22; tick:uint64 D-01; action/action_result nunca null; observation/feedback null iff sin agente; entity_states mapa copiado con id,position,energy,lifecycle.

Preparar copias/eventos/secuencias; hashes WLS1 reales; confirmar registro completo sin datos parciales. Acción antes de lifecycle.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Snapshot y registros independientes; no hashes ficticios ni igualdad solo por hash.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Esquemas completos de ActionResult/Observation y detalles heredados de atomicidad/metadata no disponibles; propiedad privada F4-C es ingeniería autorizada, no nueva física.

Fuentes/cláusulas: HINLINE:§22, S025:§21, S025:§22, S026:§D01-AE, S026:§D01-CD. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-TICK-TRANSACTION, WL-R-EVENT-SCHEMA, WL-R-HASH, WL-R-SEQUENCE.

<a id="wl-r-trajectory"></a>
## WL-R-TRAJECTORY — Trajectory y motivos de cierre

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Trajectory/RECORDER.

Precondiciones: Ejecución completa o prefijo/fallo de agente declarado.

Dominio: Campos experiment_config,initial_state,steps,events,termination_reason,metadata; motivos ENTITY_DIED/MAX_TICKS_REACHED/AGENT_CONTRACT_ERROR.

Conservar estado inicial, pasos y eventos en orden; D-01 permite segmento de replay con origen explícito sin certificar historia anterior.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No confundir prefijo válido con ejecución terminal o causa de agente reproducida.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** Esquema de metadata y algunos contratos heredados no reproducidos.

Fuentes/cláusulas: S025:§23, S026:§D01-B, S026:§D01-TRANSVERSAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RECORD-STEP, WL-R-REPLAY-ORIGIN.

<a id="wl-r-fnv"></a>
## WL-R-FNV — FNV-1a sobre bytes

Estado de definición directa: **DETERMINED**. Sujetos: fnv1a_bytes.

Precondiciones: Secuencia de bytes válida.

Dominio: Estado uint32; offset0x811c9dc5; primo0x01000193.

Para cada byte XOR y multiplicar primo reduciendo módulo2^32; vectores empty/a/foobar publicados.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Mismos bytes producen mismo hash uint32.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§24.1, S025:§24.5. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-hash"></a>
## WL-R-HASH — Hashes WORLD/FULL y límites

Estado de definición directa: **DETERMINED**. Sujetos: STATE_HASH_WORLD/FULL.

Precondiciones: WorldState válido serializable.

Dominio: Bytes WLS1 WORLD frente a WORLD+RNG.

Hash WORLD=FNV(bytesWORLD); FULL=FNV(bytesWORLD+rng). FULL no incluye agente ni trayectoria. Hash no sustituye igualdad estructural.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Cambios de RNG afectan FULL según bytes; colisiones posibles no acreditan igualdad.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§24, S025:§24.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-FNV, WL-R-WLS1.

<a id="wl-r-wls1"></a>
## WL-R-WLS1 — Serialización binaria recuperada

Estado de definición directa: **DETERMINED**. Sujetos: WLS1.

Precondiciones: Estado válido de una entidad.

Dominio: Big-endian: time uint64; width/height/entity_count/id_length/x/y/rng uint32; energy binary64 finita; tags uint8.

Cabecera WLS1; time,width,height,celdas(y,x),entity_count,entidades orden UTF8 byte-wise sin signo prefijo corto primero. Celda tags FREE0/BLOCKED1,NONE0/RESOURCE1/HAZARD2,stock0 excepto recurso0/1. Entidad length UTF8,bytes,x,y,energy,lifecycle ACTIVE0/DEAD1. FULL añade rng. Sin normalización Unicode; -0→+0.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Bytes exactos independientes de clases/Map/orden de propiedades JS.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: H034:§34, H034:§34.1, H034:§34.2, H034:§34.3, H034:§34.4, H034:§34.5, H034:§34.6, H034:§34.7, H034:§34.8, S025:§34. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-STATE, WL-R-ENERGY.

<a id="wl-r-wls1-ref"></a>
## WL-R-WLS1-REF — Vectores WLS1 y fijación pendiente

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Referencias WLS1.

Precondiciones: Verificación de serialización e interoperabilidad.

Dominio: V1 recuperado59 bytes; V2–V10 pendientes de generación/fijación.

Preservar V1 y condición de fijar/comprobar referencias antes de Hito C. Nueve PV-F5C son propuestas nuevas, no V2–V10 recuperados.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No promover propuestas a autoridad vigente.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G09](UNRESOLVED_DECISIONS.md#dec-g09):** Entradas/bytes/hashes auténticos de V2–V10 no fijados en fuente disponible; pendiente generación autorizada, no necesariamente manuscrito perdido.

Fuentes/cláusulas: H034:§34.9, S025:§34.9. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-WLS1.

<a id="wl-r-replay-request"></a>
## WL-R-REPLAY-REQUEST — Solicitud de replay y contexto explícito

Estado de definición directa: **DETERMINED**. Sujetos: replay_trajectory / request_context.

Precondiciones: Solicitud de replay suministrada.

Dominio: Ocho campos exactos world_config,feedback_config,initial_state,initial_events,actions,expected_steps,max_ticks,execution_mode; modo WITH_AGENT/WITHOUT_AGENT; expected seguro Number≥0; max:uint64.

Validar configWORLD→configFeedback→state→events→estructura actions→expected→max→time>max→modo; sin defaults ni inferencia. WITHOUT_AGENT exige WAIT, WITH_AGENT tipos desconocidos se clasifican incrementalmente.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Solicitud inválida no ejecuta transiciones; contador *_used se determina independientemente.

Fallos: Primer diagnóstico conforme catálogo/orden D-01; modo inválido usa invalid action structure.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§25, S025:§25.1, S025:§25.3, S026:§D01-AE, S026:§D01-CD. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-FEEDBACK-CONFIG, WL-R-REPLAY-ORIGIN, WL-R-TIME-REPR.

<a id="wl-r-replay-origin"></a>
## WL-R-REPLAY-ORIGIN — Origen0 y segmentos positivos

Estado de definición directa: **DETERMINED**. Sujetos: replay / validador específico de eventos.

Precondiciones: WorldState efectivo válido, 0≤time≤max_ticks.

Dominio: time0: reglas de eventos iniciales; time>0: initial_events=[] incluso DEAD.

Restaurar WORLD/RNG efectivo sin generar mapa, derivar semilla ni resolver lifecycle. Segmento no certifica pasado; secuencias locales desde0; primer tick t+1.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: expected0 devuelve OK y mismo estado, hint derivado; no muerte duplicada.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§25.3, S026:§D01-B. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-INIT-EVENTS, WL-R-STATE.

<a id="wl-r-replay-invalid"></a>
## WL-R-REPLAY-INVALID — INVALID_REPLAY_INPUT: contadores y salidas

Estado de definición directa: **DETERMINED**. Sujetos: ReplayResult inválido.

Precondiciones: Solicitud inválida tras validación en orden.

Dominio: *_used admite null solo por parámetro fuera de dominio; demás valores normalizados exactos; unused=longitud actions estructuralmente válida o0.

Conservar contadores válidos aunque otro campo falle; no inventar0 para parámetro inválido. Salidas vacías; no continuidad ni comparación de final_state con origen en INVALID.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Representación determinada incluso para tipos no numéricos/BigInt inválidos.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§25.2, S025:§25.3, S026:§D01-AE. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-REPLAY-REQUEST, WL-R-TIME-REPR.

<a id="wl-r-replay-status"></a>
## WL-R-REPLAY-STATUS — ReplayResult: estados y coherencia

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: ReplayResult/validador.

Precondiciones: Solicitud válida o rama INVALID.

Dominio: OK,UNKNOWN_ACTION,INCOMPLETE_ACTION_SEQUENCE,EXECUTION_ERROR,EARLY_TERMINATION,MAX_TICKS_REACHED,INVALID_REPLAY_INPUT según cláusulas publicadas.

Mantener compromisos de executed/consumed/unused/records/events/final_state; executed0 implica igualdad con origen salvo INVALID. expected0→OK; si no DEAD antes de límite, después agotamiento, después tipo desconocido.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Comprobar estado, contadores, hint y resultados conjuntamente, no solo hash.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05):** La validación estructural base se incorpora desde v0.2.4; no afirmar recuperación total del esquema histórico por conocer sus usos en código.

Fuentes/cláusulas: HINLINE:§25.8, S025:§25.2, S025:§25.3, S026:§D01-E-FINAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-REPLAY-REQUEST, WL-R-REPLAY-INVALID, WL-R-TERMINATION.

<a id="wl-r-replay-continuity"></a>
## WL-R-REPLAY-CONTINUITY — Continuidad con contexto completo

Estado de definición directa: **DETERMINED**. Sujetos: validate_ReplayResult / validate_replay_continuity.

Precondiciones: ReplayResult no INVALID y request_context válido.

Dominio: Firma vigente de ambos predicados (rr,request_context)→boolean.

Reproducir transición/observación/Feedback con config/modo explícitos; comparar estados/acciones/resultados/eventos/bytes y relaciones temporales; no defaults/globales ni inferir parámetros físicos del snapshot. Entrada malformada devuelve false.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Un hint o hash correcto no sustituye continuidad.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§25.3, S026:§D01-CD. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-REPLAY-STATUS, WL-R-OBS, WL-R-FEEDBACK, WL-R-TICK-TRANSACTION.

<a id="wl-r-replay-atomic"></a>
## WL-R-REPLAY-ATOMIC — Checkpoint y rollback de replay

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: replay_recorder y WORLD/RNG.

Precondiciones: Paso de replay preparado; prefijo confirmado.

Dominio: Estado WORLD, PRNG y estado Recorder del prefijo.

Usar execute_tick_transaction y registro atómico; ante fallo de paso restaurar estado/RNG/Recorder al checkpoint antes de publicar EXECUTION_ERROR.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Prefijo y secuencias preservados, sin datos parciales.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** Algoritmo íntegro §25.4 y §§25.5–25.10 incorporados por referencia; comportamiento descrito solo en ámbitos explícitos/recuperados.

Fuentes/cláusulas: S025:§25.4, S026:§D01-TRANSVERSAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-REPLAY-REQUEST, WL-R-TICK-TRANSACTION, WL-R-RECORD-STEP.

<a id="wl-r-replay-compare"></a>
## WL-R-REPLAY-COMPARE — Comparación exhaustiva y causa terminal

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: validate_replay / derive_termination_reason.

Precondiciones: Trayectoria original y ReplayResult con modo/config explícitos.

Dominio: Firma vigente validate_replay(original,rr,world_config,execution_mode); Match/Mismatch. Derivación ENTITY_DIED/MAX_TICKS_REACHED/INDETERMINATE.

Comparar campos y estados/eventos completos; no consultar original para derivar terminación. Hint no nulo precede estado nulo/DEAD/límite; expected agotado no implica terminal. Prefijo agente no terminal no es MATCH del fallo externo completo.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Rechazar divergencia estructural aun con hashes iguales.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G08](UNRESOLVED_DECISIONS.md#dec-g08):** Lista exacta de diagnósticos Match/Mismatch y algunos detalles §25.7 no reproducidos completamente. No convertir mensajes JS en ABI normativa.

Fuentes/cláusulas: S025:§25.3, S025:§33.5, S025:§33.6, S026:§D01-CD, S026:§D01-TRANSVERSAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-REPLAY-CONTINUITY, WL-R-HASH, WL-R-AGENT-FAIL.

<a id="wl-r-replay-invariant"></a>
## WL-R-REPLAY-INVARIANT — Replay Invariant incorporado §25.9

Estado de definición directa: **INDETERMINATE**. Sujetos: Reproducibilidad/replay.

Precondiciones: Declaración de conformidad y replay.

Dominio: Contenido exacto de §25.9 no proporcionado.

Cumplir el Replay Invariant incorporado por §37, cuyo texto exacto debe recuperarse; no sustituirlo por una formulación intuitiva de determinismo.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Definición y evidencia pendientes; obligación visible.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** §25.9 anunciado en fuente v0.2.4 externa identificada, no suministrada.

Fuentes/cláusulas: S025:§25.4, S025:§37. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-time-repr"></a>
## WL-R-TIME-REPR — Representación temporal exacta D-01

Estado de definición directa: **DETERMINED**. Sujetos: WORLD/Observation/ConfirmedTickResult/RecordedEvent/StepRecord/replay.

Precondiciones: Valores temporales de entrada/salida válidos.

Dominio: uint64 matemático; Number seguro≥0 o BigInt uint64; salidas nuevas Number seguro si cabe y BigInt en otro caso.

Comparar por valor entero sin pérdida; WorldState.time conserva representación válida; expected_steps y sequence siguen Number seguro. Prevenir overflow antes de mutación/RNG.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No truncar WLS1 ni ampliar sequence por cambio de ticks.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§7.1, S026:§D01-AE, S026:§D01-E-FINAL. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-errors"></a>
## WL-R-ERRORS — Catálogo y clasificación de errores

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Validadores/EXPERIMENT/replay.

Precondiciones: Fallo de validación/transición.

Dominio: Trece error_message enumerados en §26.6; no insufficient resources.

Aplicar catálogo y precedencias específicas; no convertir capacidad local en invalid world_config ni inventar diagnósticos normativos nuevos.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Errores clasificables sin ocultar transiciones parciales.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G08](UNRESOLVED_DECISIONS.md#dec-g08):** Alcance completo de §§26.1–26.4 y de mensajes internos frente a error_message público no reproducido.

Fuentes/cláusulas: S025:§26, S025:§26.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-CONFIG, WL-R-REPLAY-REQUEST.

<a id="wl-r-agent"></a>
## WL-R-AGENT — Contrato heredado de agente

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: AGENT.

Precondiciones: Factory/reset/step y Feedback suministrados.

Dominio: Acciones estructurales y estado interno permitido.

Respetar frontera Feedback→Action y fallo de step de §28.5; no atribuir a WORLD aprendizaje o acceso a estado privado.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: API histórica completa y precondiciones pendientes.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G08](UNRESOLVED_DECISIONS.md#dec-g08):** §§28.1–28.4 idénticos a v0.2.4; falta texto completo de contrato y alcance §39.

Fuentes/cláusulas: S025:§28, S025:§28.5, S025:§4.2. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-BOUNDARIES, WL-R-AGENT-FAIL.

<a id="wl-r-renderer"></a>
## WL-R-RENDERER — Renderer consumidor de snapshots

Estado de definición directa: **DETERMINED**. Sujetos: RENDERER.

Precondiciones: Renderizar ejecución/estado.

Dominio: Snapshot recibido.

Solo leer snapshots; no acceder/mutar WORLD activo ni consumir RNG físico.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Renderizado no altera evolución.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§29, S025:§4.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-STATE, WL-R-BOUNDARIES.

<a id="wl-r-metrics"></a>
## WL-R-METRICS — Metrics consumidor de Trajectory

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: METRICS.

Precondiciones: Cálculo de métricas sobre Trajectory.

Dominio: Trajectory suministrada.

Consumir Trajectory sin modificarla. La ausencia de módulo separado no constituye una excepción normativa.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Resultados derivados conservan la trayectoria.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G08](UNRESOLVED_DECISIONS.md#dec-g08):** API y alcance de Metrics no desarrollados; no introducir métricas nuevas ni afirmar conformidad de un consumidor inexistente.

Fuentes/cláusulas: S025:§30, S025:§4.1. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-TRAJECTORY, WL-R-BOUNDARIES.

<a id="wl-r-invariants"></a>
## WL-R-INVARIANTS — Conservación de invariantes explícitos I67–I82

Estado de definición directa: **DETERMINED**. Sujetos: Todos los componentes.

Precondiciones: Estados/operaciones aplicables a cada invariante.

Dominio: I67–I82 expresamente enumerados.

Conservar uint32/nozero, MAX_CELLS y diagnóstico, WAIT y action/result no nulos, fallo de agente, continuidad, executed0, hints, validación inicial, counter0, binary64 y estados epistemológicos. Aplicar sustituciones D-01 donde correspondan.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: No usar referencias históricas desconocidas como si estuvieran satisfechas.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

Fuentes/cláusulas: S025:§31. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-RNG, WL-R-CONFIG, WL-R-NOAGENT, WL-R-AGENT-FAIL, WL-R-REPLAY-CONTINUITY, WL-R-REPLAY-STATUS, WL-R-INIT-EVENTS, WL-R-SEQUENCE, WL-R-ENERGY.

<a id="wl-r-invariants-legacy"></a>
## WL-R-INVARIANTS-LEGACY — Familia de referencias I01–I66 sin definiciones

Estado de definición directa: **INDETERMINATE**. Sujetos: Todos los componentes.

Precondiciones: Conformidad con invariantes incorporados.

Dominio: I01–I66 identificados, contenido no disponible.

Preservar la exigencia de estos invariantes sin inventar su significado; esta ficha es una familia de referencias, no una afirmación de equivalencia entre66 reglas.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: I01–I53 e I54–I66 permanecen individualmente visibles en registro externo de referencias.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** v0.2.4 externa anunciada contiene I54–I66; v0.2.3 es pista concreta para I01–I53, ambos sin copia suministrada.

Fuentes/cláusulas: S025:§31. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-pseudocode"></a>
## WL-R-PSEUDOCODE — Pseudocódigo y alias normativos

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Implementadores.

Precondiciones: Interpretación de secuencias canónicas.

Dominio: Alias a §§5,11,18,20,25,26.

Un alias no añade una implementación ni recupera el cuerpo histórico ausente. Usar procedimientos expresos y sus sustituciones D-01; mantener referencias no expandidas visibles.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Pseudocódigo disponible preservado sin duplicar autoridad.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** Cuerpos completos de execute_tick/transaction, enrich y build_trajectory_events incorporados no todos reproducidos históricamente.

Fuentes/cláusulas: S025:§33, S025:§33.1, S025:§33.10, S025:§33.11, S025:§33.12, S025:§33.13, S025:§33.2, S025:§33.3, S025:§33.4, S025:§33.5, S025:§33.6, S025:§33.7, S025:§33.8, S025:§33.9. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-INIT, WL-R-RUN, WL-R-TIME, WL-R-REPLAY-COMPARE.

<a id="wl-r-repro"></a>
## WL-R-REPRO — Reproducibilidad y sesgos

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: WORLD/AGENT/EXPERIMENT/investigación.

Precondiciones: Repetición e interpretación de experimentos.

Dominio: Niveles WORLD/AGENT/EXPERIMENT distintos; sesgos S1–S5 explícitos.

Separar determinismo físico, agente y experimento; registrar fallo inicial; no inferir cooperación o dinámica de hazards; MAX_CELLS independiente del hardware.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Resultados interpretados dentro del alcance documentado.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** §§35.1–35.4 idénticos a v0.2.4 y no proporcionados.

Fuentes/cláusulas: S025:§35, S025:§35.5, S025:§35.6. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-SCOPE, WL-R-AUTH.

<a id="wl-r-corpus"></a>
## WL-R-CORPUS — Inventario histórico y referencias de aceptación

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Aceptación.

Precondiciones: Identificar/ejecutar T01–T280.

Dominio: IDs/rangos y trazabilidad temática §36; todos inicialmente UNTESTED.

No confundir una asignación temática con definición de entradas/esperados. No reutilizar IDs históricos para nuevos casos ni contar BLOCKED como PASS.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Corpus nuevo mantiene identidad propia y categoría de evidencia.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G09](UNRESOLVED_DECISIONS.md#dec-g09):** Definiciones completas T01–T280 no suministradas; 32 ni siquiera tienen asignación en tabla disponible. §36 externa anunciada podría aportar parte, no se presupone qué detalle.

Fuentes/cláusulas: S025:§36. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

<a id="wl-r-conformance"></a>
## WL-R-CONFORMANCE — Criterio vigente §37 y límites de declaración

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Responsable de aceptación.

Precondiciones: Declarar conformidad.

Dominio: Contratos §§6–30, invariantes§31, orden§32, Replay Invariant§25.9, T01–T280 ejecutados y aprobados, sin OPEN-CRITICAL.

Aplicar el criterio vigente; perfiles y propuestas F5-B/C no lo sustituyen sin aprobación. No afirmar conformance/replay/interoperability verificados sin evidencia correspondiente.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Hitos B/C no declarados por aprobar documentación o contar PASS.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G09](UNRESOLVED_DECISIONS.md#dec-g09):** Criterio de autoridad explícito pero satisfacción no evaluable íntegramente sin dependencias históricas y tests.

Fuentes/cláusulas: S025:§0.4, S025:§0.5, S025:§37. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-INVARIANTS-LEGACY, WL-R-REPLAY-INVARIANT, WL-R-CORPUS.

<a id="wl-r-terms"></a>
## WL-R-TERMS — Terminología y términos heredados

Estado de definición directa: **PARTIALLY_DETERMINED**. Sujetos: Todos los componentes.

Precondiciones: Interpretación de contratos.

Dominio: MAX_CELLS=2^20; ExperimentResult contenedor de salida; ReplayContinuity continuación exacta.

Preservar estas definiciones expresas; no reconstruir los términos heredados a partir de nombres del código.

Orden: Sin precedencia adicional demostrada; conservar las indicadas por las dependencias.

Postcondiciones: Glosario parcial identificado.

Fallos: No inferir mensajes, transiciones ni excepciones que la fuente no determine.

Invariantes: Conservar las restricciones explícitas de las fuentes y las dependencias aplicables.

**PENDIENTE EDITORIAL — [DEC-G00](UNRESOLVED_DECISIONS.md#dec-g00):** Términos de v0.2.4 incorporados sin enumeración.

Fuentes/cláusulas: S025:§3. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).

Dependencias: WL-R-AUTH.

## Pseudocódigo literal disponible

Extractos de fuente, sin completar alias históricos ni aplicar propuestas nuevas. Las demás sustituciones D-01 se expresan en los contratos anteriores.

```text
### §10.1. Xorshift32 — aritmética uint32 explícita (P0-1)
text
MASK32 = 0xFFFFFFFF

ESTADO: state : uint32, state ≠ 0

next():
    x = state
    x = (x XOR ((x << 13) AND MASK32)) AND MASK32
    x = (x XOR (x >> 17)) AND MASK32                // shift lógico
    x = (x XOR ((x << 5) AND MASK32)) AND MASK32
    state = x

    IF state == 0:
        RAISE ContractError("rng zero state")

    RETURN state
Reglas:

Todo valor intermedio se reduce a uint32 mediante AND MASK32.

El desplazamiento a la derecha es lógico (relleno con ceros).

Si el estado resultante es 0, se lanza ContractError("rng zero state") y el estado no se actualiza.

Los vectores publicados en §10.6 permanecen invariantes.

Equivalencia JavaScript:

javascript
const MASK32 = 0xFFFFFFFF;
let x = state;
x = ((x ^ ((x << 13) & MASK32)) & MASK32) >>> 0;
x = ((x ^ (x >>> 17)) & MASK32) >>> 0;
x = ((x ^ ((x << 5) & MASK32)) & MASK32) >>> 0;
if (x === 0) throw new ContractError("rng zero state");
state = x;
return x;
```

```text
### §11.6. derive_seed(base_seed, namespace) (P1-2)
text
DOMINIO:
    base_seed : uint32 ≠ 0
    namespace : string Unicode válido, UTF-8 estricto, sin normalización Unicode

ALGORITMO:
    seed_text = DECIMAL_ASCII(base_seed)
    material  = seed_text + ":" + namespace
    bytes     = UTF8_STRICT(material)
    h         = FNV1a_32(bytes)
    RETURN h == 0 ? 1 : h

DECIMAL_ASCII(base_seed):
    Representación decimal ASCII de un entero uint32 sin signo.
    Sin ceros iniciales.
    El número 0 se representa como "0" (aunque base_seed ≠ 0 por dominio).

Separador:
    ":" es el byte ASCII 0x3A.

UTF-8 estricto:
    Sin normalización Unicode.
    Surrogates no emparejados → ContractError.
Vectores: (1, "world") = 2448580590 (0x91F25FEE), (1, "random_agent") = 84506387 (0x05097713). Estado: verificados por inspección.
```

```text
### §6.4. canonicalize_binary64
text
canonicalize_binary64(x):
    REQUIRE is_finite(x)
    IF x == 0: RETURN +0.0
    RETURN x
Salvo -0 → +0, el valor conserva su representación IEEE-754 exacta (P1-4). Aplicación antes de hash, comparación y serialización.
```

```text
### §20.2. run_without_agent(config) — cierre (P0-3)
text
run_without_agent(config) → ExperimentResult:

    [inicialización idéntica a §20.1, sin agente]

    WHILE true:
        termination = determine_termination(world, config.max_ticks)
        IF termination ≠ null: BREAK

        action = WAIT                                 // normativo

        confirmed = execute_tick_transaction(world, action, config.max_ticks)

        recorder.record_step(confirmed,
                             observation = null,       // sin observación
                             feedback    = null,       // sin feedback
                             action      = WAIT)

        IF confirmed.termination ≠ null: BREAK

    [finalización idéntica a §20.1]
Semántica (P0-3):

El modo sin agente ejecuta exactamente la acción WAIT en cada tick.

observation = null.

feedback = null.

action = WAIT.

action_result es el resultado de aplicar WAIT (no null).

action_events contiene los eventos producidos por WAIT (en general [], pero puede contener eventos si WAIT tiene coste y el efecto de entrada).

Se usa el mismo execute_tick_transaction que en modo con agente.
```

## Condiciones de ReplayResult conservadas con sustitución D-01-C

Transcripción del bloque S025§25.3; única edición local del bloque: llamadas de continuidad pasan al contexto explícito autorizado por D-01-C. Contadores INVALID se interpretan además según WL-R-REPLAY-INVALID/D-01-AE. No es recuperación del esquema histórico base.

```text
INVARIANTE GLOBAL: executed == 0 ⇒ final_state ≡ initial_state  (P0-6)
    Para todo status ≠ INVALID_REPLAY_INPUT:
        IF rr.executed == 0:
            states_equal(rr.final_state, initial_state, world_config)

INVARIANTES POR STATUS:

    OK:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        length(rr.records) == rr.expected_steps_used
        rr.unknown_action_index == null
        rr.error_message == null
        rr.termination_hint ∈ {null, ENTITY_DIED, MAX_TICKS_REACHED}
        validate_replay_continuity(rr, request_context)   // P0-5
        validate_termination_hint(rr)                            // P0-8

    MAX_TICKS_REACHED:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.executed < rr.expected_steps_used
        rr.unused_actions == max(0, length(actions) − rr.executed)
        rr.unknown_action_index == null
        rr.error_message == null
        rr.termination_hint == null
        rr.final_state.time >= request_context.max_ticks
        validate_replay_continuity(rr, request_context)

    EARLY_TERMINATION:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.executed < rr.expected_steps_used
        rr.unused_actions == max(0, length(actions) − rr.executed)
        rr.unknown_action_index == null
        rr.error_message == null
        rr.termination_hint == null
        get_experimental_entity_from(rr.final_state).lifecycle == DEAD
        validate_replay_continuity(rr, request_context)

    INCOMPLETE_ACTION_SEQUENCE:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.executed < rr.expected_steps_used
        rr.unused_actions == 0
        rr.unknown_action_index == null
        rr.error_message == null
        rr.termination_hint == null
        length(actions) == rr.executed
        validate_replay_continuity(rr, request_context)

    UNKNOWN_ACTION:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.executed < rr.expected_steps_used
        rr.unknown_action_index ≠ null
        rr.unknown_action_index == rr.executed
        rr.unknown_action_index < length(actions)
        actions[rr.unknown_action_index].type ∉ VALID_ACTION_TYPES
        rr.error_message == null
        rr.termination_hint == null
        validate_replay_continuity(rr, request_context)

    EXECUTION_ERROR:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.error_message ≠ null
        rr.unknown_action_index == null
        rr.termination_hint == null
        validate_replay_continuity(rr, request_context)

    INVALID_REPLAY_INPUT:
        rr.final_state == null
        rr.executed == 0
        rr.records == []
        rr.events == []
        rr.unknown_action_index == null
        rr.error_message ≠ null
        rr.termination_hint == null
```

## Extracto de invariantes/catálogo vigente con contexto

Texto literal S025; la referencia I01–I66 sigue sin contenido. D-01-B sustituye el validador inicial de replay para segmentos; D-01 no relaja initialize_world ni los demás invariantes.

```text
## §31 — Invariantes
I-01 a I-66 de v0.2.4 más:

ID	Invariante
I-67	Toda operación en Xorshift32 se reduce a uint32 mediante AND MASK32.
I-68	state == 0 en Xorshift32 ⇒ ContractError("rng zero state").
I-69	width × height ≤ MAX_CELLS = 2^20.
I-70	Configuración que excede MAX_CELLS ⇒ "invalid world_config", nunca "insufficient resources".
I-71	run_without_agent ejecuta WAIT en cada tick.
I-72	StepRecord.action y StepRecord.action_result nunca son null.
I-73	AGENT_CONTRACT_ERROR produce ExperimentResult.status = "FAILED" con trayectoria parcial preservada.
I-74	validate_replay_continuity verifica que cada StepRecord es continuación exacta del anterior.
I-75	executed == 0 ⇒ final_state ≡ initial_state para status ≠ INVALID_REPLAY_INPUT.
I-76	termination_hint == ENTITY_DIED ⇒ final_state.entity.lifecycle == DEAD.
I-77	termination_hint == MAX_TICKS_REACHED ⇒ final_state.time >= max_ticks_used ∧ lifecycle ≠ DEAD.
I-78	validate_initial_events_consistency se invoca antes de replay y durante initialize_world.
I-79	record_initial_lifecycle_from_recorded con recorded_events == [] inicializa sequence_counter = 0.
I-80	Operaciones sobre energy usan IEEE-754 binary64, round-to-nearest, ties-to-even.
I-81	Salvo -0 → +0, binary64 conserva representación exacta.
I-82	Conformance, Replay e Interoperability permanecen UNTESTED hasta ejecución.
```

## Extracto de invariantes/catálogo vigente con contexto

Texto literal S025; la referencia I01–I66 sigue sin contenido. D-01-B sustituye el validador inicial de replay para segmentos; D-01 no relaja initialize_world ni los demás invariantes.

```text
### §26.6. Catálogo cerrado de error_message
"invalid world_config", "invalid feedback_config", "invalid initial_state", "invalid initial_events", "invalid action structure", "invalid expected_steps", "invalid max_ticks", "initial_state.time > max_ticks", "invalid initial_position", "world transition failed", "recording failed", "rng zero state", "agent produced structurally invalid action".

Eliminado: "insufficient resources" (P0-2).
```

§11.1 se conserva en WL-R-INIT con la aclaración INIT-004 en WL-R-INIT-EVENTS; no se reproduce sin contexto la frase histórica de metadatos que podría leerse de forma incompatible. §26.5 y §25.9 completos quedan referidos a EXT-024.

La validación de continuidad vigente es contextual según D-01; no insertar el alias antiguo como firma actual. El criterio §37 sigue exigiendo T01–T280: F5-D no aprueba ningún reemplazo.

## Generación recuperada de mapa

HINLINE/OWNER-MAP, atribución del responsable, no manuscrito completo autenticado.

````text
## OWNER-MAP — F2-B §2, algoritmo recuperado de v0.2.4

```yaml
generate_map(world, rng):
    FOR y = 0 TO height - 1:
        FOR x = 0 TO width - 1:
            r1 = rng.next_float()

            IF r1 < obstacle_density:
                grid[y][x] = BLOCKED
                CONTINUE

            r2 = rng.next_float()

            IF r2 < resource_density:
                grid[y][x] = FREE + RESOURCE(stock=1)
            ELSE IF r2 < resource_density + hazard_density:
                grid[y][x] = FREE + HAZARD
            ELSE:
                grid[y][x] = FREE + NONE
```
````

## WLS1 recuperado y vector V1

H034, fragmento de fuente preservado; V2–V10 siguen pendientes y la semántica de time se conserva bajo D-01.

````text
#### §34 — Serialización WLS1

**§34.1. Cabecera**

`57 4C 53 31`

**§34.2. Convenciones**

Big-endian. uint32, uint64. binary64 canonicalizado. Cadenas UTF-8 con longitud. Enums como código uint8 fijo. Campos en orden fijo.

**§34.3. canonical_world_state**

```text
magic[4] = "WLS1"
time[uint64_be]
width[uint32_be]
height[uint32_be]
cells en orden (y, x)
entity_count[uint32_be]
entities_sorted_by_id
```

Orden canónico de IDs: byte-wise UTF-8 sin signo, prefijo corto primero.

**§34.4. Cell**

```text
traversal_tag[uint8]  // FREE=0, BLOCKED=1
effect_tag[uint8]     // NONE=0, RESOURCE=1, HAZARD=2
stock_tag[uint8]      // 0 para NONE/HAZARD; 0|1 para RESOURCE
```

**§34.5. Entity**

```text
id_length[uint32_be]
id_utf8[id_length]
x[uint32_be]
y[uint32_be]
energy[binary64_be]    // canonicalize_binary64
lifecycle_tag[uint8]   // ACTIVE=0, DEAD=1
```

**§34.6. canonical_rng_state**

`rng_state[uint32_be]`

**§34.7. canonical_full_state**

`canonical_world_state + canonical_rng_state`

**§34.8. Energía binary64**

Finita. -0 canonicalizado a +0 antes del hash.

**§34.9. Vectores mínimos**

V1 — bytes completos (59):

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

V2–V10: bytes y hashes PENDIENTES DE GENERACIÓN por implementación de referencia. Antes de declarar Hito C, deben estar fijados y verificados contra una segunda implementación independiente.

Estado histórico: UNTESTED.
````

## Pseudocódigo de ejecución con agente

S025§20.1 literal. Las variantes failure_details y los cuerpos históricos ausentes permanecen marcados en WL-R-RUN/DEC-G05; no rellenar los puntos suspensivos.

````text
### §20.1. run_experiment(config, agent_factory) → ExperimentResult
text
ExperimentResult:
    status          : "COMPLETED" | "FAILED"
    trajectory      : Trajectory | null
    failure_reason  : string | null
    failure_details : { seed, message, config } | null

PSEUDOCÓDIGO:

1.  validate_config(config)
2.  world_seed = derive_seed(config.experiment_seed, "world")
3.  agent_seed = derive_seed(config.experiment_seed, config.agent_type)
4.  radius     = config.world_config.observation_radius

5.  TRY:
        init_result = initialize_world(config.world_config, world_seed)
    CATCH InitializationError error:
        recorder.record_initialization_failure(error, config)
        RETURN ExperimentResult(
            status          = "FAILED",
            trajectory      = null,
            failure_reason  = "INITIALIZATION_ERROR",
            failure_details = {seed, message, config})

6.  world.state = init_result.world_state
7.  world.rng.set_state(init_result.rng_state)

8.  recorder.record_initial_state(world.full_snapshot())
9.  recorder.record_initial_lifecycle_from_world(init_result.initial_events)

10. agent = agent_factory(config.agent_type, agent_seed)
11. agent.reset()
12. last_action_result = null

INITIAL TERMINATION:
    termination = determine_termination(world, config.max_ticks)
    IF termination ≠ null:
        recorder.set_termination_reason(termination)
        RETURN ExperimentResult(
            status     = "COMPLETED",
            trajectory = recorder.finalize(),
            ...)

13. termination_reason = "MAX_TICKS_REACHED"

14. WHILE true:
        termination = determine_termination(world, config.max_ticks)
        IF termination ≠ null:
            termination_reason = termination
            BREAK

        entity      = world.get_experimental_entity()
        observation = build_observation(world, entity, radius)
        ASSERT observation.tick == world.state.time
        feedback = build_feedback(observation, last_action_result,
                                  config.feedback_config)

        TRY:
            action = agent.step(feedback)
            IF NOT validate_Action_structural(action):
                RAISE ContractError("agent produced structurally invalid action")
        CATCH error:
            recorder.set_termination_reason("AGENT_CONTRACT_ERROR")
            RETURN ExperimentResult(
                status          = "FAILED",
                trajectory      = recorder.finalize(),
                failure_reason  = "AGENT_CONTRACT_ERROR",
                failure_details = {message: STRING(error), config})

        confirmed = execute_tick_transaction(world, action, config.max_ticks)
        recorder.record_step(confirmed, observation, feedback, action)
        last_action_result = confirmed.action_result

        IF confirmed.termination ≠ null:
            termination_reason = confirmed.termination
            BREAK

15. recorder.set_termination_reason(termination_reason)
16. RETURN ExperimentResult(
        status     = "COMPLETED",
        trajectory = recorder.finalize(),
        ...)
Semántica de AGENT_CONTRACT_ERROR (P0-4):

No se ejecuta ningún tick con la acción inválida.

Se preserva la trayectoria ya confirmada en trajectory.

El experimento se marca "FAILED".

termination_reason = "AGENT_CONTRACT_ERROR" dentro de la trayectoria.

No se convierte la acción en WAIT.

No se considera la trayectoria parcial como ejecución exitosa (status ≠ "COMPLETED").
````
