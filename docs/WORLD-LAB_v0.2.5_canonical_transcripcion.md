# WORLD-LAB v0.2.5 — Especificación canónica consolidada
Documento normativo único. Estado: NORMATIVE SPECIFICATION CLOSED.
Verificación empírica: UNTESTED. Interoperabilidad: UNTESTED.
Incremento de versión: v0.2.4 → v0.2.5 por P0-1 a P0-8 y P1-1 a P1-5.

## §0 — Autoridad, estados y regla general
### §0.1. Tabla de autoridad
Artefacto	Autoridad
Este documento (v0.2.5 Canonical)	Normativa
Pseudocódigo normativo (§33)	Normativa
Contratos, tipos, dominios (§6–§30)	Normativa
Invariantes (§31)	Normativa
Orden canónico (§32)	Normativa
Catálogo de errores (§26.6)	Normativa
Serialización binaria WLS1 (§34)	Normativa
Vectores de prueba (§10.6, §11.6, §24.5, §34.9)	Referencia
Tests T01–T280	Criterios de aceptación
Código actual del repositorio	No normativa
### §0.2. Regla general
Si el código contradice este documento, el documento prevalece.

### §0.3. Estados operacionales
FROZEN: regla normativa cerrada.

UNTESTED: test definido, no ejecutado.

VERIFIED: test ejecutado con resultado reproducible.

FAIL: test ejecutado, no superado.

OPEN-CRITICAL: pendiente bloqueante.

Un requisito puede estar FROZEN y UNTESTED simultáneamente.

### §0.4. Tres niveles de evidencia
Conformance: la implementación cumple las reglas normativas.

Replay: una trayectoria concreta puede reproducirse.

Interoperability: dos implementaciones independientes producen resultados estructuralmente idénticos.

Ninguno implica los otros dos.

### §0.5. Hitos
Hito A — Specification Closed.

Hito B — Conformance Verified.

Hito C — Replay and Interoperability Verified.

Los hitos B y C no bloquean la declaración del hito A.

## §1 — Propósito y alcance
### §1.1. Propósito
WORLD-LAB es un instrumento experimental computacional reproducible.

### §1.2. Flujo
text
(Config, World, Agent) → ExperimentResult → Metrics → Analysis
### §1.3. Alcance de v0.2.5
Incluye v0.2.4 más P0-1 a P0-8 y P1-1 a P1-5. Sin mecánicas nuevas.

Incluido:

Grid 2D acotado con MAX_CELLS = 2^20.

Una entidad experimental.

Recursos binarios regenerables.

Peligros estáticos uniformes.

Ciclo de vida explícito.

Acciones: MOVE_N, MOVE_S, MOVE_E, MOVE_W, WAIT.

Modo autónomo ejecutando WAIT.

Registro completo.

Reproducibilidad determinista por semilla.

Agentes con estado interno mutable.

Excluido: lo mismo que v0.2.4.

### §1.4. Evolución vs aprendizaje
El WORLD no aprende.

### §1.5. Relación con agentes
El mundo no conoce al agente.

## §2 — Principios normativos
Separación de responsabilidades.

Determinismo del WORLD.

Minimalidad.

No invención.

Fronteras estrictas.

Reproducibilidad.

Atomicidad del tick.

Igualdad estructural.

Recorder como único punto de enriquecimiento.

Parámetros y contadores son conceptos distintos.

Solo EXPERIMENT modifica world.state.time.

Punto único de sync_rng_state por tick.

Fallos de inicialización registrables fuera de trayectoria.

Aritmética uint32 explícita en Xorshift32.

Límite normativo de celdas MAX_CELLS independiente del hardware.

Continuidad verificable entre StepRecords de replay.

## §3 — Terminología
Términos de v0.2.4 más:

Término	Significado
MAX_CELLS	2^20. Límite normativo de width × height.
ExperimentResult	Contenedor de salida de run_experiment (éxito o fallo).
ReplayContinuity	Propiedad de que cada StepRecord del replay es la continuación exacta del anterior.
## §4 — Arquitectura y fronteras
text
EXPERIMENT
    ├── conoce WORLD, AGENT, RECORDER
    ├── administra el ciclo, el reloj, la terminación
    ├── ejecuta execute_tick_transaction (con rollback)
    ├── es el único que modifica world.state.time
    ├── registra fallos de inicialización
    └── devuelve ExperimentResult

WORLD
    ├── mantiene WorldState, reglas, transiciones, dinámica
    ├── no conoce AGENT, EXPERIMENT ni RECORDER
    └── no modifica time

AGENT
    ├── recibe Feedback, devuelve Action
    ├── mantiene y modifica su propio estado interno
    └── no accede a world, world.state, rng, ni al recorder

RECORDER
    ├── recibe WorldEvent o RecordedEvent
    ├── produce StepRecord y Trajectory
    ├── enriquece con tick, source, sequence
    ├── muta su propio estado solo tras confirmación (RecordTransaction)
    └── no modifica WORLD

METRICS
    ├── consume Trajectory
    └── no modifica Trajectory
### §4.1. Prohibiciones arquitectónicas
WORLD no importa AGENT ni EXPERIMENT.

AGENT no accede a WORLD directamente.

RECORDER no muta WORLD.

METRICS no muta Trajectory.

RENDERER solo lee snapshots.

Ninguna función de observación consume RNG.

execute_tick no accede al recorder, no modifica time, no sincroniza rng_state.

El recorder es el único responsable del enriquecimiento de eventos.

Ninguna función del WORLD modifica world.state.time.

Ninguna función del WORLD ejecuta resolve_lifecycle más de una vez durante la inicialización.

### §4.2. Frontera AGENT/WORLD
El AGENT puede mantener y modificar su estado interno. WORLD no inspecciona ni modifica el estado interno del AGENT.

## §5 — Modelo temporal
### §5.1. Tick — secuencia normativa
text
TICK(t):
    1. apply_action(action)
    2. resolve_lifecycle()
    3. advance_dynamics()
    4. world.state.time = t + 1                 // EXPERIMENT
    5. world.sync_rng_state()                   // EXPERIMENT (punto único)
    6. record_step()
Idéntico a §20.1, §20.2 y §32.

### §5.2. Regla temporal
time comienza en 0.

time es modificado únicamente por EXPERIMENT.

Ninguna función del WORLD modifica time.

sync_rng_state se invoca exactamente una vez por tick, por EXPERIMENT.

### §5.3. Relación observación–registro
text
step.tick              = T + 1
step.observation.tick  = T
step.world_state.time  = T + 1
### §5.4. determine_termination — función única normativa
text
determine_termination(world, max_ticks):
    IF world.is_terminal():
        RETURN ENTITY_DIED
    IF world.state.time >= max_ticks:
        RETURN MAX_TICKS_REACHED
    RETURN null
Precedencia: ENTITY_DIED > MAX_TICKS_REACHED.

### §5.5. Atomicidad del tick
Cada tick es atómico. Fallo ⇒ rollback completo de world.state y world.rng.

### §5.6. Evaluación de terminación
Se evalúa exactamente en tres puntos:

Antes del bucle.

Al inicio de cada iteración.

Al final de cada transición confirmada.

Ninguna rama duplica la lógica de terminación.

### §5.7. Resolución inicial única
resolve_lifecycle se invoca exactamente una vez durante initialize_world.

## §6 — WorldConfig
### §6.1. Esquema cerrado
Campo	Tipo	Dominio	Inmutable
width, height	entero seguro	[1, 2^32 − 1]	✓
topology	string	"BOUNDED"	✓
obstacle_density, resource_density, hazard_density	binary64	[0, 1]	✓
initial_energy	binary64 finito	(-∞, +∞)	✓
move_cost, wait_cost	entero seguro	[0, 2^32 − 1]	✓
resource_effect	entero seguro	[0, 2^32 − 1]	✓
hazard_damage	entero seguro	[0, 2^32 − 1]	✓
resource_regeneration	entero seguro	[0, 2^32 − 1]	✓
death_threshold	entero seguro	[−(2^53 − 1), 2^53 − 1]	✓
observation_radius	entero seguro	[0, 2^32 − 1]	✓
topology obligatorio. Sin campos adicionales.

Límite normativo de celdas: width × height ≤ MAX_CELLS, donde MAX_CELLS = 2^20. La multiplicación se evalúa en una representación suficientemente amplia para evitar overflow antes de la comparación.

### §6.2. Validación
Dimensiones: enteros en [1, 2^32 − 1].

Producto width × height ≤ 2^20 (nuevo, P0-2).

Densidades: [0, 1], suma recurso+peligro ≤ 1.

Costes, efectos, daños, regeneración: enteros [0, 2^32 − 1].

initial_energy: binary64 finito. Valores negativos permitidos.

death_threshold: entero seguro [−(2^53 − 1), 2^53 − 1].

topology == "BOUNDED".

Errores → "invalid world_config". Nunca "insufficient resources".

Objeto congelado tras construcción.

### §6.3. Restricciones numéricas y finitud
Dominio de enteros seguros. time como uint64. energy como binary64 finito.

Toda operación sobre energy:

Calcular candidato con IEEE-754 binary64, round-to-nearest, ties-to-even (P1-3).

Aplicar canonicalize_binary64(candidato).

Verificar is_finite.

Si no finito: ContractError, sin modificar estado.

No se permiten redondeos arbitrarios ni precisión extendida observable (P1-3).

### §6.4. canonicalize_binary64
text
canonicalize_binary64(x):
    REQUIRE is_finite(x)
    IF x == 0: RETURN +0.0
    RETURN x
Salvo -0 → +0, el valor conserva su representación IEEE-754 exacta (P1-4). Aplicación antes de hash, comparación y serialización.

## §7 — WorldState
### §7.1. Esquema cerrado
Campo	Tipo	Dominio
time	uint64	≥ 0
grid	matriz height × width de Cell	rectangular
entities	mapa id → EntityState	exactamente 1 entrada
rng_state	uint32	≠ 0
### §7.2. Copia
full_snapshot() produce copia profunda.

## §8 — Grid / Cell
Grid 2D. Orden canónico (y, x).

Cell: traversal ∈ {FREE, BLOCKED}, effect ∈ {null, RESOURCE(stock), HAZARD}. BLOCKED sin efecto. Máximo un efecto por celda.

## §9 — Entity
id (string UTF-8 no vacío), position, energy (binary64 finito), lifecycle (ACTIVE | DEAD).

Invariantes: ACTIVE en celda FREE; DEAD permanece; sin resurrección.

## §10 — PRNG
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
### §10.2. next_float()
binary64(next()) / 4294967296.0, en [0, 1), con redondeo binary64 estándar.

### §10.3. next_int(a, b) con rechazo
text
n = b − a + 1
limit = 2^32 − (2^32 mod n)
LOOP:
    u = next()
    IF u < limit: RETURN a + (u mod n)
### §10.4. Estado cero
state == 0 en cualquier punto: ContractError. Semilla inicial 0: excepción.

### §10.5. Fuentes prohibidas.
### §10.6. Vectores Xorshift32
It	Decimal	Hex
1	270369	0x00042021
2	67634689	0x04080601
3	2647435461	0x9DCCA8C5
Estado: UNTESTED.

### §10.7. Contrato del RNG
RNG pertenece a WORLD.

AGENT sin acceso.

rng_state en WorldState.

build_observation no consume RNG.

Rollback restaura RNG.

sync_rng_state se invoca exactamente una vez por tick, por EXPERIMENT.

Todo estado intermedio se reduce a uint32.

Estado cero ⇒ ContractError.

## §11 — Inicialización del mundo
### §11.1. initialize_world — procedimiento único
text
initialize_world(config, seed) → InitialWorldResult
    Puede lanzar InitializationError.

    1. validate_config(config)
    2. validate_seed(seed)
    3. rng = PRNG(seed)
    4. world = create_empty_world(config)
    5. generate_map(world, rng)
    6. initialize_resources(world)
    7. create_entity_and_initial_position(world, rng)
    8. initial_events = resolve_lifecycle(world)   // UNA SOLA VEZ
    9. world.sync_rng_state()
    10. validate_WorldState(world.state, config)
    11. validate_initial_events_consistency(world.state, initial_events)
    12. RETURN InitialWorldResult(
            world_state    = world.full_snapshot(),
            initial_events = initial_events,       // WorldEvent[] crudos
            rng_state      = world.state.rng_state)

FALLOS:
    Si algún paso falla → InitializationError con:
        seed     : semilla
        reason   : "invalid initial_position" (único caso posible)
        message  : descripción

    Los límites de celdas se validan en §6.2, no aquí.
    No existe "insufficient resources" (P0-2).
### §11.2. generate_map
Idéntico a v0.2.4.

### §11.3. create_entity_and_initial_position
Candidatos FREE sin efecto, orden canónico. rng.next_int(0, len-1). Sin candidatos → InitializationError("invalid initial_position").

### §11.4. create_entity
id = "0987898", energy = initial_energy, lifecycle = "ACTIVE".

### §11.5. resolve_initial_state
Se invoca una sola vez dentro de initialize_world.

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

### §11.7. validate_initial_events_consistency(initial_state, initial_events) (P0-7)
text
Verifica:
    1. Todos los eventos tienen tick == 0.
    2. Todos los eventos tienen source == "lifecycle".
    3. Los sequence son estrictamente crecientes, empezando en 0.
    4. Los entity_id y position corresponden a entidades del
       initial_state.
    5. Si la entidad inicial está ACTIVE:
           NO existe evento ENTITY_DIED para esa entidad.
    6. Si la entidad inicial está DEAD:
           existe EXACTAMENTE UN evento ENTITY_DIED para esa entidad.

Retorno: Valid | Invalid.
Si Invalid → ContractError con mensaje "invalid initial_events".
## §12 — Acciones
MOVE_N, MOVE_S, MOVE_E, MOVE_W, WAIT. Esquema cerrado {type}. Validación estructural sin enum.

## §13 — apply_action()
Contrato: IN action, OUT ActionResult. No modifica time, lifecycle, rng_state. No emite ENTITY_DIED. Tipo desconocido → ContractError.

Orden MOVE_*: ENTITY_NOT_ACTIVE → OUT_OF_BOUNDS → BLOCKED_CELL → INSUFFICIENT_ENERGY.

energy_delta con redondeo binary64 (P1-3).

## §14 — Lifecycle
resolve_lifecycle() devuelve WorldEvent[]. Una entidad no emite ENTITY_DIED más de una vez.

## §15 — Dynamics
advance_dynamics() llama regenerate_resources(). Sin evento.

## §16 — Observation
Esquema cerrado: tick, self, local_view. Chebyshev. OUT_OF_BOUNDS fuera del grid. occupied = false.

build_observation puro.

## §17 — Feedback
Esquema: observation, has_prior_action, last_action_result.

FeedbackConfig: cuatro flags booleanos exactos.

## §18 — Events
Idéntico a v0.2.4.

## §19 — ExperimentConfig
experiment_seed, max_ticks, world_config, feedback_config, agent_type.

### §19.1. max_ticks = 0
Comportamiento idéntico a v0.2.4, con evaluación vía determine_termination.

## §20 — Ciclo de ejecución
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

### §20.3. Diferencias entre modos
Elemento	Con agente	Sin agente
observation	Observation	null
feedback	Feedback	null
action	Action del agente	WAIT
action_result	resultado del agente	resultado de WAIT
action_events	eventos de la acción	eventos de WAIT
### §20.4. Precedencia terminal
Determinada exclusivamente por determine_termination.

### §20.5. InitializationFailure
text
InitializationFailure:
    seed           : uint32
    reason         : "invalid initial_position"
    message        : string
    experiment_config : ExperimentConfig serializable
Registrada fuera de Trajectory.

### §20.6. Errores del agente (P0-4)
Si agent.step() lanza excepción o devuelve una Action estructuralmente inválida:

No se ejecuta ningún tick con esa acción.

Se preserva la trayectoria ya confirmada.

ExperimentResult.status = "FAILED".

termination_reason = "AGENT_CONTRACT_ERROR" en la trayectoria preservada.

El error queda registrado en failure_details.

La trayectoria parcial NO se marca como exitosa.

No se convierte la acción en WAIT.

## §21 — Recorder
§21.1–§21.4
Idénticos a v0.2.4.

### §21.5. record_initial_lifecycle_from_recorded — caso vacío (P1-1)
text
PRECONDICIÓN:
    recorded_events : RecordedEvent[]

POSTCONDICIÓN:
    Conserva eventos EXACTAMENTE.
    IF recorded_events == []:
        sequence_counter = 0
    ELSE:
        sequence_counter = max(sequence) + 1
    Sin re-enriquecimiento.
    No se invoca max([]).
§21.6–§21.10
Idénticos a v0.2.4.

## §22 — StepRecord
Idéntico a v0.2.4, con la precisión de que action en modo sin agente es WAIT (P0-3), no null.

Campo	Tipo	Nulabilidad
tick	entero seguro ≥ 0	no null
world_state	WorldState	no null
observation	Observation	null ⇔ modo sin agente
feedback	Feedback	null ⇔ modo sin agente
action	Action	nunca null
action_result	ActionResult	nunca null
action_events	RecordedEvent[]	puede ser []
lifecycle_events	RecordedEvent[]	puede ser []
state_hash_world	uint32	no null
state_hash_full	uint32	no null
entity_states	mapa	no null
Invariante revisada: action y action_result siempre presentes. observation y feedback son null si y solo si el modo es sin agente.

## §23 — Trajectory
experiment_config, initial_state, steps, events, termination_reason, metadata.

termination_reason ∈ {"ENTITY_DIED", "MAX_TICKS_REACHED", "AGENT_CONTRACT_ERROR"}.

## §24 — Hashes
### §24.1. FNV-1a
OFFSET_BASIS = 0x811c9dc5, FNV_PRIME = 0x01000193.

### §24.2. Definición
state_hash_world = fnv1a(canonical_world_state).
state_hash_full = fnv1a(canonical_full_state).

state_hash_full es hash del estado del WORLD + RNG, no del agente ni la trayectoria.

§24.3–§24.4
Límites y no-sustitución de igualdad estructural.

### §24.5. Vectores FNV-1a
"" → 0x811c9dc5. "a" → 0xe40c292c. "foobar" → 0xbf9cf968.

## §25 — Replay
### §25.1. Firma
Idéntica a v0.2.4.

### §25.2. ReplayResult
Idéntica a v0.2.4, con la semántica de contadores.

### §25.3. validate_ReplayResult(rr, request_context)
text
request_context:
    world_config, initial_state, initial_events, actions,
    expected_steps, max_ticks

VALIDACIÓN ESTRUCTURAL BASE:
    [idéntica a v0.2.4]

COMPROMISOS CON request_context:
    - rr.max_ticks_used == request_context.max_ticks
    - rr.expected_steps_used == request_context.expected_steps

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
        validate_replay_continuity(rr, initial_state, actions)   // P0-5
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
        validate_replay_continuity(rr, initial_state, actions)

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
        validate_replay_continuity(rr, initial_state, actions)

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
        validate_replay_continuity(rr, initial_state, actions)

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
        validate_replay_continuity(rr, initial_state, actions)

    EXECUTION_ERROR:
        rr.final_state ≠ null
        validate_WorldState(rr.final_state, world_config)
        rr.executed == length(rr.records)
        rr.error_message ≠ null
        rr.unknown_action_index == null
        rr.termination_hint == null
        validate_replay_continuity(rr, initial_state, actions)

    INVALID_REPLAY_INPUT:
        rr.final_state == null
        rr.executed == 0
        rr.records == []
        rr.events == []
        rr.unknown_action_index == null
        rr.error_message ≠ null
        rr.termination_hint == null
### §25.3.1. validate_replay_continuity(rr, initial_state, actions) (P0-5)
text
Para cada i IN [0, length(rr.records)):

    expected_input_state =
        initial_state                    si i == 0
        rr.records[i-1].world_state      si i > 0

    // La transición producida por actions[i] desde
    // expected_input_state debe coincidir estructuralmente
    // con rr.records[i].

    Verifica:
        - rr.records[i].tick == expected_input_state.time + 1
        - rr.records[i].world_state.time == expected_input_state.time + 1
        - rr.records[i].action == actions[i]
        - Comparación estructural de rr.records[i].action_result con
          el resultado esperado de aplicar actions[i] desde
          expected_input_state
        - Comparación estructural de rr.records[i].action_events
        - Comparación estructural de rr.records[i].lifecycle_events
        - Comparación estructural de rr.records[i].entity_states
        - rr.records[i].state_hash_world ==
          STATE_HASH_WORLD(rr.records[i].world_state)
        - rr.records[i].state_hash_full ==
          STATE_HASH_FULL(rr.records[i].world_state)

Retorno: Valid | Invalid.
Si Invalid → validate_ReplayResult devuelve Invalid.
### §25.3.2. validate_termination_hint(rr) (P0-8)
text
IF rr.termination_hint == ENTITY_DIED:
    REQUIRE get_experimental_entity_from(rr.final_state).lifecycle == DEAD

ELSE IF rr.termination_hint == MAX_TICKS_REACHED:
    REQUIRE rr.final_state.time >= rr.max_ticks_used
    REQUIRE get_experimental_entity_from(rr.final_state).lifecycle != DEAD

ELSE IF rr.termination_hint == null:
    // No requiere verificación adicional.
    // Puede coexistir con cualquier estado final.

Precedencia: si ambas condiciones podrían cumplirse (DEAD y
time >= max_ticks), ENTITY_DIED prevalece y termination_hint
debe ser ENTITY_DIED, no MAX_TICKS_REACHED.
### §25.3.3. Validación de initial_events en replay (P0-7)
text
Al inicio de replay_trajectory, antes de ejecutar:

    validate_initial_events_consistency(initial_state, initial_events)

Si falla → ContractError("invalid initial_events").
### §25.4. Algoritmo
Idéntico a v0.2.4 con:

Validación explícita de initial_events (P0-7).

Uso de execute_tick_transaction en modo replay.

Registro atómico en replay_recorder.

§25.5–§25.10
Idénticos a v0.2.4 con las ampliaciones de §25.3.

## §26 — Validación y errores
§26.1–§26.4
Configuración, contrato, inicialización, replay.

### §26.5. Atomicidad del tick
Idéntico a v0.2.4.

### §26.6. Catálogo cerrado de error_message
"invalid world_config", "invalid feedback_config", "invalid initial_state", "invalid initial_events", "invalid action structure", "invalid expected_steps", "invalid max_ticks", "initial_state.time > max_ticks", "invalid initial_position", "world transition failed", "recording failed", "rng zero state", "agent produced structurally invalid action".

Eliminado: "insufficient resources" (P0-2).

## §27 — Modo sin agente
Idéntico a v0.2.4 con la precisión de que ejecuta WAIT explícitamente (P0-3).

## §28 — Agent contract
§28.1–§28.4
Idénticos a v0.2.4.

### §28.5. Errores del agente (P0-4)
Idéntico a v0.2.4 §28.5, referenciando ExperimentResult.status = "FAILED" con termination_reason = "AGENT_CONTRACT_ERROR".

## §29 — Renderer
Solo lee snapshots.

## §30 — Metrics
Consume Trajectory.

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
## §32 — Orden normativo de ejecución
Con agente
text
TICK(t):
    1.  determine_termination → si ≠ null, terminar
    2.  entity, observation, ASSERT, feedback
    3.  action = agent.step(feedback)   // puede lanzar
    4.  confirmed = execute_tick_transaction(world, action, max_ticks)
    5.  recorder.record_step(confirmed, observation, feedback, action)
    6.  last_action_result = confirmed.action_result
    7.  determine_termination → si ≠ null, terminar
Sin agente
text
TICK(t):
    1.  determine_termination → si ≠ null, terminar
    2.  action = WAIT
    3.  confirmed = execute_tick_transaction(world, action, max_ticks)
    4.  recorder.record_step(confirmed, null, null, WAIT)
    5.  determine_termination → si ≠ null, terminar
## §33 — Pseudocódigo normativo
### §33.1 initialize_world — §11.1.
### §33.2 run_experiment / run_without_agent — §20.1, §20.2.
### §33.3 execute_tick / execute_tick_transaction — §26.5.
### §33.4 replay_trajectory — §25.4.
### §33.5 validate_replay — §25.7.
### §33.6 derive_termination_reason — §25.8.
### §33.7 determine_termination — §5.4.
### §33.8 build_trajectory_events — §18.8.
### §33.9 canonicalize_binary64 — §6.4.
### §33.10 enrich — §18.4.
### §33.11 validate_replay_continuity — §25.3.1.
### §33.12 validate_termination_hint — §25.3.2.
### §33.13 validate_initial_events_consistency — §11.7.

## §34 — Serialización WLS1
Idéntica a v0.2.4 con:

P1-4: binary64 conserva representación exacta salvo -0 → +0.

Hashes sobre bytes producidos por operaciones binary64 estándar.

### §34.9. Vectores mínimos
V1 — bytes completos (59) definidos en v0.2.4.
V2–V10 — pendientes de generación por implementación de referencia. Hashes pendientes de cálculo independiente.

Estado: UNTESTED.

## §35 — Reproducibilidad
§35.1–§35.4
Idénticos a v0.2.4.

### §35.5. Tres niveles
WORLD, AGENT, EXPERIMENT. No equivalentes.

### §35.6. Sesgos experimentales documentados
S-1 — Regeneración de recursos: puede regenerarse en el mismo tick si resource_regeneration ≥ 1.

S-2 — Observación de recursos: el agente no distingue stock 0 de stock 1.

S-3 — Una entidad + peligros estáticos: no permite concluir sobre cooperación o adaptación a peligros dinámicos.

S-4 — Posición inicial: sin candidatos válidos, initialize_world falla con InitializationError("invalid initial_position"). El fallo se registra en InitializationFailure.

S-5 — Límite de celdas: MAX_CELLS = 2^20. Configuraciones mayores ⇒ "invalid world_config". No depende del hardware.

## §36 — Inventario de tests
Grupo	Rango
Núcleo	T01–T05, T13–T17, T23–T27, T38–T41
Experimental	T06–T11, T20, T28–T30, T42–T43
Integración	T12, T18, T19, T21, T22, T31–T37, T44–T45
Replay	T46–T60, T81–T92, T105–T116, T117–T132, T133–T143, T144–T153, T154–T167, T168–T175, T176–T202
R-1 / D-27–D-42	T203–T204
M-1–M-25 / A-1–A-4	T205–T218
B-1–B-8 (v0.2.2)	T219–T240
B-9–B-13, V-1, V-2 (v0.2.3)	T241–T255
v0.2.4	T256–T265
v0.2.5	T266–T280
Vectores	T32–T35, T54, T202
Todos: UNTESTED.

Trazabilidad v0.2.5
ID	Sección	Test
P0-1	§10.1	T266
P0-2	§6.1, §6.2, §35.6	T267
P0-3	§20.2, §22, §27, §32	T268, T269
P0-4	§20.6, §28.5	T270
P0-5	§25.3.1	T271
P0-6	§25.3	T272
P0-7	§11.7, §25.3.3	T273
P0-8	§25.3.2	T274
P1-1	§21.5	T275
P1-2	§11.6	T276
P1-3	§6.3, §13	T277
P1-4	§6.4, §34	T278
P1-5	§37, §36	T279
Auditoría cruzada	§1–§39	T280
## §37 — Criterio de conformidad (corregido, P1-5)
Una implementación es conforme si y solo si:

Contratos §6–§30 respetados.

Invariantes §31 mantenidos.

Orden §32 respetado.

Replay Invariant §25.9 se cumple.

Tests T01–T280 han sido ejecutados y pasan.

No hay OPEN-CRITICAL.

Estado actual: los tests T01–T280 están UNTESTED. Por tanto:

Conformance: UNTESTED.

Replay: UNTESTED.

Interoperability: UNTESTED.

T01–T280: UNTESTED.

Vectores: UNTESTED.

No se puede declarar conformance, replay ni interoperabilidad verificadas sin ejecución.

## §38 — Congelación
Contratos congelados de v0.2.4 más:

Xorshift32 con aritmética uint32 explícita.

MAX_CELLS = 2^20.

run_without_agent ejecuta WAIT.

AGENT_CONTRACT_ERROR cierra con ExperimentResult.status = "FAILED".

validate_replay_continuity.

executed == 0 ⇒ final_state ≡ initial_state.

validate_termination_hint.

validate_initial_events_consistency.

Operaciones binary64 round-to-nearest ties-to-even.

ExperimentResult como contenedor de salida.

## §39 — Alcance sobre agentes con aprendizaje
Idéntico a v0.2.4.

Lista final de cambios v0.2.5
P0 — Bloqueantes resueltos
ID	Sección	Cambio
P0-1	§10.1	Xorshift32 con aritmética uint32 explícita y check de estado cero
P0-2	§6.1, §6.2, §35.6	MAX_CELLS = 2^20; eliminado "insufficient resources"
P0-3	§20.2, §22, §27, §32	run_without_agent ejecuta WAIT; action y action_result nunca null
P0-4	§20.6, §28.5	AGENT_CONTRACT_ERROR cierra con ExperimentResult.status = "FAILED"
P0-5	§25.3.1	validate_replay_continuity verifica continuidad entre StepRecords
P0-6	§25.3	executed == 0 ⇒ final_state ≡ initial_state
P0-7	§11.7, §25.3.3	validate_initial_events_consistency
P0-8	§25.3.2	validate_termination_hint
P1 — Correcciones
ID	Sección	Cambio
P1-1	§21.5	recorded_events == [] ⇒ sequence_counter = 0
P1-2	§11.6	DECIMAL_ASCII definido explícitamente
P1-3	§6.3, §13	Round-to-nearest ties-to-even
P1-4	§6.4, §34	Binary64 conserva representación exacta salvo -0 → +0
P1-5	§37, §36	Estado epistemológico corregido: todo UNTESTED
Matriz de determinación
Elemento	Determinado	Libre
Aritmética uint32 en Xorshift32	✓	
Estado cero en RNG	✓	
Límite MAX_CELLS	✓	
Comportamiento width × height > MAX_CELLS	✓	
run_without_agent (acción WAIT)	✓	
AGENT_CONTRACT_ERROR	✓	
Continuidad de replay	✓	
executed == 0	✓	
termination_hint semántico	✓	
initial_events consistency	✓	
recorded_events == []	✓	
DECIMAL_ASCII	✓	
Round-to-nearest ties-to-even	✓	
Representación binary64	✓	
Estado epistemológico	✓	
Orden de consumo de RNG	✓	
Orden de inicialización	✓	
Generación del mapa	✓	
Selección de posición inicial	✓	
Topología	✓	
Acciones disponibles	✓	
Orden de validación	✓	
Efectos de entrada	✓	
Propiedad del reloj	✓	
Atomicidad del tick	✓	
Regeneración	✓	
Condición de muerte	✓	
determine_termination	✓	
Observación	✓	
Feedback	✓	
Eventos (sequence)	✓	
Serialización WLS1	✓	
Hashes	✓	
Replay	✓	
validate_ReplayResult	✓	
Semántica de contadores	✓	
Validadores y comparadores	✓	
Catálogo de errores	✓	
Estructura interna de clases		✓
Nombres de variables internas		✓
Optimizaciones		✓
DOM/canvas		✓
Framework de tests		✓
Auditoría cruzada final
Se revisaron las siguientes dependencias:

Verificación	Resultado
§5 ↔ §10 ↔ §11: RNG inicializado antes de consumir	✓
§5 ↔ §19 ↔ §20: tiempo solo modificado por EXPERIMENT	✓
§20 ↔ §21: recorder atómico	✓
§20 ↔ §26: atomicidad de execute_tick_transaction	✓
### §20.2 ↔ §22 ↔ §32: run_without_agent con WAIT	✓
### §20.6 ↔ §28: AGENT_CONTRACT_ERROR	✓
§25 ↔ §25.3.1: continuidad de replay	✓
### §25.3 ↔ §25.3.2: termination_hint semántico	✓
### §25.3 ↔ §25.3.3 ↔ §11.7: initial_events consistency	✓
### §6.1 ↔ §6.2 ↔ §34: MAX_CELLS en config	✓
### §6.3 ↔ §6.4 ↔ §13: binary64	✓
§21.5: recorded_events == []	✓
§35.6: sin "insufficient resources"	✓
§36 ↔ §37: tests UNTESTED coherentes	✓
Contradicciones residuales detectadas: ninguna tras las correcciones P0-1 a P0-8 y P1-1 a P1-5.

Declaración final de estado
Cierre normativo
Alcanzado. La especificación v0.2.5 es internamente coherente.

Verificación empírica
UNTESTED.

Interoperabilidad
UNTESTED.

Reproducibilidad observable
UNTESTED.

Propiedades consideradas consistentes según inspección normativa
Las reglas de §1–§39 no presentan contradicciones residuales detectadas.

Esta inspección no constituye verificación empírica.

Tests por estado
T01–T280: UNTESTED.

Vectores
Xorshift32, FNV-1a, derive_seed, WLS1: UNTESTED.

Adiciones genuinas de v0.2.5
P0-1 a P0-8: correcciones de bloqueantes.

P1-1 a P1-5: correcciones menores.

ExperimentResult como contenedor de salida de run_experiment.

Defectos normativos abiertos
Ninguno.

Hitos
Hito	Estado
A — Specification Closed	Alcanzado
B — Conformance Verified	UNTESTED
C — Replay and Interoperability Verified	UNTESTED
Siguiente paso
La especificación queda congelada para implementación.

A partir de este momento, cualquier modificación deberá estar motivada por:

fallo de test,

contradicción demostrada,

defecto de interoperabilidad,

o evidencia de implementación.

No se añadirán requisitos especulativos.

WORLD-LAB v0.2.5 — NORMATIVE SPECIFICATION CLOSED.
CONFORMANCE: UNTESTED.
REPLAY: UNTESTED.
INTEROPERABILITY: UNTESTED.