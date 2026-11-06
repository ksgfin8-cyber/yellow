// Mundo. Estado, reglas y transiciones.
// Contrato: js/world/world.js según especificación §8.4, §9, §10, §11.
//
// NOTA: World NO conoce a Agent, Experiment, Feedback ni Recorder.
// World NO tiene tick(). El ciclo vive en Experiment.

// §11.3 only: no-candidate failure. Full initialization wrapping/recording is deferred.
class InitializationError extends Error {
    constructor() {
        super("invalid initial_position");
        this.name = "InitializationError";
        this.reason = "invalid initial_position";
    }
}

class World {
    constructor(config) {
        this.config = config;
        this.state = null;
        this.rng = null;
        this.experimental_entity_id = null;
    }

    // --- Inicialización ------------------------------------------------

    initialize(seed) {
        // Adapter only: one canonical generation/lifecycle route. Build everything
        // before publishing fields; the returned snapshot never aliases live state.
        const config = new WorldConfig(this.config);
        const result = initialize_world(config, seed);
        const state = result.world_state.copy();
        const rng = new PRNG(result.rng_state); // restore stream, no extraction
        const id = state.entities.keys().next().value;
        const changes = [["config", config], ["state", state], ["rng", rng], ["experimental_entity_id", id]];
        for (const [key] of changes) {
            if (Object.getOwnPropertyDescriptor(this, key)?.writable !== true) {
                throw new ContractError("world transition failed");
            }
        }
        for (const [key, value] of changes) this[key] = value;
        return result;
    }

    // §11.2, algorithm recovered in the F2-B order. Returns a grid, not a WorldState.
    _generate_grid(rng = this.rng) {
        WorldConfig._validate(this.config);
        const { width, height, obstacle_density, resource_density, hazard_density } = this.config;
        const grid = [];

        // Orden canónico: primero y, después x.
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const r_obstacle = rng.next_float();
                if (r_obstacle < obstacle_density) {
                    row.push(Cell.blocked());
                    continue;
                }

                const r_effect = rng.next_float();
                let effect = null;
                if (r_effect < resource_density) {
                    effect = {kind: "RESOURCE", stock: 1};
                } else if (r_effect < resource_density + hazard_density) {
                    effect = {kind: "HAZARD"};
                }
                row.push(new Cell("FREE", effect));
            }
            grid.push(row);
        }
        return grid;
    }

    // §11.3: canonical candidate list, one next_int call, no clock/state writes.
    _choose_initial_position(grid, rng = this.rng) {
        WorldConfig._validate(this.config);
        if (!Array.isArray(grid) || grid.length !== this.config.height) {
            throw new ContractError("invalid initial_state");
        }
        const candidates = [];
        for (let y = 0; y < this.config.height; y++) {
            if (!Array.isArray(grid[y]) || grid[y].length !== this.config.width) {
                throw new ContractError("invalid initial_state");
            }
            for (let x = 0; x < this.config.width; x++) {
                const cell = grid[y][x];
                if (!validate_Cell(cell)) throw new ContractError("invalid initial_state");
                if (cell.traversal === "FREE" && cell.effect === null) {
                    candidates.push({ x, y });
                }
            }
        }

        if (candidates.length === 0) {
            throw new InitializationError();
        }

        const idx = rng.next_int(0, candidates.length - 1);
        return candidates[idx];
    }

    // v0.2.4 §6.1/§14 recovered in the F2-C reply; no per-tick orchestration.
    resolve_lifecycle() {
        assert_WorldState(this.state, this.config);
        const entity = this.get_experimental_entity();
        if (!entity) throw new ContractError("invalid initial_state");
        if (entity.lifecycle === "DEAD" || entity.energy > this.config.death_threshold) {
            return [];
        }
        const event = {
            type: "ENTITY_DIED",
            entity_id: entity.id,
            position: {x: entity.position.x, y: entity.position.y}
        };
        entity.lifecycle = "DEAD";
        return [event]; // raw WorldEvent; Recorder alone adds tick/source/sequence
    }

    // --- Dinámica autónoma --------------------------------------------

    // §15: no events, actions, lifecycle, clock changes or RNG access.
    advance_dynamics() {
        this.regenerate_resources();
    }

    regenerate_resources() {
        WorldConfig._validate(this.config);
        assert_WorldState(this.state, this.config);
        const { width, height, resource_regeneration } = this.config;
        if (resource_regeneration === 0) return;

        const changes = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = this.state.grid[y][x];
                const effect = cell.effect;
                if (effect === null || effect.kind !== "RESOURCE" || effect.stock === 1) continue;
                // Engineering policy DYN-P01: binary stock and uint32 rate make
                // this exact integer expression 1 for every positive rate.
                const stock = Math.min(1, effect.stock + resource_regeneration);
                if (Object.getOwnPropertyDescriptor(effect, "stock")?.writable !== true) {
                    throw new ContractError("world transition failed");
                }
                changes.push([effect, stock]);
            }
        }
        // All structural checks and ordinary-record write checks precede mutation.
        for (const [effect, stock] of changes) effect.stock = stock;
    }

    // --- Transición ---------------------------------------------------

    // F2-D input/geometry helpers; no mutations or ActionResult construction here.
    _action_type(action) {
        assert_WorldState(this.state, this.config);
        if (!this.get_experimental_entity()) throw new ContractError("invalid initial_state");
        assert_Action_structural(action);
        if (!Object.hasOwn(ActionType, action.type)) {
            throw new ContractError("world transition failed");
        }
        return action.type;
    }

    _bounded_move_target(action) {
        const type = this._action_type(action);
        if (type === "WAIT") throw new ContractError("world transition failed");
        const {dx, dy} = World._offset(type);
        const position = this.get_experimental_entity().position;
        return {x: position.x + dx, y: position.y + dy};
    }

    _move_failure_before_energy(action) {
        const type = this._action_type(action);
        if (type === "WAIT") throw new ContractError("world transition failed");
        const entity = this.get_experimental_entity();
        if (entity.lifecycle !== "ACTIVE") return "ENTITY_NOT_ACTIVE";
        const target = this._bounded_move_target(action);
        if (target.x < 0 || target.x >= this.config.width ||
            target.y < 0 || target.y >= this.config.height) return "OUT_OF_BOUNDS";
        if (this.state.grid[target.y][target.x].traversal === "BLOCKED") return "BLOCKED_CELL";
        // Energy gating follows in apply_action under the documented engineering policy.
        return null; // only the checks above passed; not a successful ActionResult
    }

    static _finite_energy_sum(energy, delta) {
        if (!Number.isFinite(energy) || !Number.isFinite(delta)) {
            throw new ContractError("world transition failed");
        }
        return canonicalize_binary64(energy + delta);
    }

    // Raw action WorldEvent; inputs have already passed WORLD/action validation.
    static _make_action_event(type, entity, position) {
        return {type, entity_id: entity.id, position: {x: position.x, y: position.y}};
    }

    // F2-D: normative boundaries plus explicit engineering policies recorded in STATUS.
    apply_action(action) {
        const type = this._action_type(action);
        const entity = this.get_experimental_entity();
        const unchanged = (validity, reason) => ({validity, reason, energy_delta: 0, events: []});
        if (entity.lifecycle !== "ACTIVE") return unchanged("INVALID", "ENTITY_NOT_ACTIVE");

        let target = null;
        if (type !== "WAIT") {
            const reason = this._move_failure_before_energy(action);
            if (reason !== null) return unchanged("INVALID", reason);
            target = this._bounded_move_target(action);
        }

        const cost = canonicalize_binary64(type === "WAIT" ? this.config.wait_cost : this.config.move_cost);
        if (canonicalize_binary64(entity.energy) < cost) return unchanged("FAILED", "INSUFFICIENT_ENERGY");

        // Stage all arithmetic and effects before committing any mutation.
        const before = entity.energy;
        let energy = World._finite_energy_sum(before, -cost);
        let resource = null;
        let effect_event = null;
        if (target !== null) {
            const effect = this.state.grid[target.y][target.x].effect;
            if (effect !== null && effect.kind === "RESOURCE" && effect.stock === 1) {
                energy = World._finite_energy_sum(energy, this.config.resource_effect);
                resource = effect;
                effect_event = "RESOURCE_CONSUMED";
            } else if (effect !== null && effect.kind === "HAZARD") {
                energy = World._finite_energy_sum(energy, -this.config.hazard_damage);
                effect_event = "HAZARD_TRIGGERED";
            }
        }
        energy = canonicalize_binary64(energy);
        const energy_delta = canonicalize_binary64(energy - before);
        const events = [];
        if (target !== null) {
            // ACT-H01: movement before its entry effect; all records staged before writes.
            events.push(World._make_action_event("ENTITY_MOVED", entity, target));
            if (effect_event !== null) events.push(World._make_action_event(effect_event, entity, target));
        }
        const result = {validity: "VALID", reason: "NONE", energy_delta, events};

        // Ordinary F2-A records may have been frozen by a caller. Reject before writes.
        const changes = [];
        if (!Object.is(entity.energy, energy)) changes.push([entity, "energy", energy]);
        if (target !== null) changes.push([entity, "position", target]);
        if (resource !== null) changes.push([resource, "stock", 0]);
        for (const [record, key] of changes) {
            if (Object.getOwnPropertyDescriptor(record, key)?.writable !== true) {
                throw new ContractError("world transition failed");
            }
        }
        for (const [record, key, value] of changes) record[key] = value;
        return result;
    }

    static _offset(actionType) {
        switch (actionType) {
            case "MOVE_N": return { dx: 0, dy: -1 };
            case "MOVE_S": return { dx: 0, dy: +1 };
            case "MOVE_E": return { dx: +1, dy: 0 };
            case "MOVE_W": return { dx: -1, dy: 0 };
            default: throw new Error("World._offset: unknown action type");
        }
    }

    // --- Persistencia -------------------------------------------------

    // §7.2: structural snapshot only; no initialization, clock or RNG access.
    full_snapshot() {
        if (!(this.state instanceof WorldState)) throw new ContractError("invalid initial_state");
        return this.state.full_snapshot();
    }

    sync_rng_state() {
        this.state.rng_state = this.rng.get_state();
    }

    // --- Acceso controlado --------------------------------------------

    get_experimental_entity() {
        return this.state.entities.get(this.experimental_entity_id);
    }

    is_experimental_entity_dead() {
        const e = this.get_experimental_entity();
        return e.energy <= this.config.death_threshold;
    }
}

// F2-C independent preparation only (before §11.1 step 8).
// Does NOT implement initialize_world/InitialWorldResult or lifecycle/event resolution.
function prepare_world_before_lifecycle(config, seed) {
    const checkedConfig = new WorldConfig(config);
    PRNG._validate_state(seed); // §11.1: validate before constructing the stream
    const rng = new PRNG(seed); // validate original world seed; do not derive another seed
    const world = new World(checkedConfig);
    world.rng = rng;
    const grid = world._generate_grid();
    verify_generated_initial_resources(grid, checkedConfig);

    let position;
    try {
        position = world._choose_initial_position(grid);
    } catch (error) {
        // Only the specified no-candidate failure receives initialization metadata.
        if (error instanceof InitializationError && error.reason === "invalid initial_position") {
            error.seed = seed;
        }
        throw error;
    }

    const entity = new EntityState("0987898", position, checkedConfig.initial_energy,
        "ACTIVE", checkedConfig);
    const entities = new Map([[entity.id, entity]]);
    world.state = new WorldState(0, grid, entities, rng.get_state(), checkedConfig);
    world.experimental_entity_id = entity.id;
    assert_WorldState(world.state, checkedConfig);
    // No final sync here: its normative point is AFTER lifecycle in the next helper.
    return world;
}

// On the F2-B-generated domain, resources already have stock=1. Validate only;
// do not redistribute, consume RNG, repair depleted resources or mutate the grid.
function verify_generated_initial_resources(grid, config) {
    WorldConfig._validate(config);
    if (!Array.isArray(grid) || grid.length !== config.height) {
        throw new ContractError("invalid initial_state");
    }
    for (let y = 0; y < config.height; y++) {
        if (!Array.isArray(grid[y]) || grid[y].length !== config.width) {
            throw new ContractError("invalid initial_state");
        }
        for (let x = 0; x < config.width; x++) {
            const cell = grid[y][x];
            if (!validate_Cell(cell) ||
                (cell.effect !== null && cell.effect.kind === "RESOURCE" && cell.effect.stock !== 1)) {
                throw new ContractError("invalid initial_state");
            }
        }
    }
}

// Shared pipeline. F2-G adds raw-event validation under authorized INIT-004.
// Keep the F2-C helper shape for diagnostics; initialize_world projects the public result.
function prepare_world_through_lifecycle(config, seed) {
    const world = prepare_world_before_lifecycle(config, seed);
    const initial_events = world.resolve_lifecycle();
    world.sync_rng_state();
    assert_WorldState(world.state, world.config);
    validate_initial_events_consistency(world.state, initial_events);
    return {world, initial_events, snapshot: world.full_snapshot()};
}

// INIT-004 clarification (F2-G order): WORLD validates raw events; only RECORDER
// later validates/enriches tick/source/sequence. Precondition: validated WorldState.
function validate_initial_events_consistency(initial_state, initial_events) {
    const invalid = () => { throw new ContractError("invalid initial_events"); };
    if (!has_exact_fields(initial_state, ["time", "grid", "entities", "rng_state"]) ||
        (initial_state.time !== 0 && initial_state.time !== 0n) ||
        !(initial_state.entities instanceof Map) || initial_state.entities.size !== 1 ||
        !Array.isArray(initial_events)) invalid();
    const [id, entity] = initial_state.entities.entries().next().value;
    if (!has_exact_fields(entity, ["id", "position", "energy", "lifecycle"]) ||
        id !== entity.id || !has_exact_fields(entity.position, ["x", "y"]) ||
        (entity.lifecycle !== "ACTIVE" && entity.lifecycle !== "DEAD")) invalid();
    if (entity.lifecycle === "ACTIVE") {
        if (initial_events.length !== 0) invalid();
    } else {
        if (initial_events.length !== 1) invalid();
        const event = initial_events[0];
        if (!has_exact_fields(event, ["type", "entity_id", "position"]) ||
            event.type !== "ENTITY_DIED" || event.entity_id !== entity.id ||
            !has_exact_fields(event.position, ["x", "y"]) ||
            event.position.x !== entity.position.x || event.position.y !== entity.position.y) invalid();
    }
    return true;
}

// §11.1 / F2-G: exact InitialWorldResult, detached from the temporary active WORLD.
function initialize_world(config, seed) {
    const {snapshot, initial_events} = prepare_world_through_lifecycle(config, seed);
    return {world_state: snapshot, initial_events, rng_state: snapshot.rng_state};
}
