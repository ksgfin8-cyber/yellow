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
        // Semilla ya debe ser válida para el PRNG.
        this.rng = new PRNG(seed);

        const grid = this._generate_grid();

        const initialPosition = this._choose_initial_position(grid);

        const entity = new EntityState(
            "0987898",
            initialPosition,
            this.config.initial_energy
        );

        const entities = new Map();
        entities.set(entity.id, entity);

        // Sincronizar rng_state antes de persistir.
        const rng_state = this.rng.get_state();

        this.state = new WorldState(0, grid, entities, rng_state);
        this.experimental_entity_id = entity.id;
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

    regenerate_resources() {
        const { width, height, resource_regeneration } = this.config;
        if (resource_regeneration === 0) return;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = this.state.grid[y][x];
                if (cell.traversal !== "FREE") continue;
                if (!cell.effect || cell.effect.kind !== EffectKind.RESOURCE) continue;
                if (cell.effect.stock >= 1) continue;
                cell.effect.stock = Math.min(1, cell.effect.stock + resource_regeneration);
            }
        }
    }

    // --- Transición ---------------------------------------------------

    // F2-D independent helpers. These are NOT ActionResult-producing transitions.
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
        // Energy gating still needs the incorporated action contract.
        return null; // only the checks above passed; not a successful ActionResult
    }

    static _finite_energy_sum(energy, delta) {
        if (!Number.isFinite(energy) || !Number.isFinite(delta)) {
            throw new ContractError("world transition failed");
        }
        return canonicalize_binary64(energy + delta);
    }

    apply_action(action) {
        const entity = this.state.entities.get(this.experimental_entity_id);
        if (!entity) {
            throw new Error("World.apply_action: experimental entity not found");
        }

        const result = {
            entity_id: entity.id,
            action: { ...action },
            validity: "VALID",
            reason: "NONE",
            events: []
        };

        if (action.type === "WAIT") {
            entity.energy -= this.config.wait_cost;
            return result;
        }

        if (action.type !== "MOVE_N" && action.type !== "MOVE_S" && action.type !== "MOVE_E" && action.type !== "MOVE_W") {
            throw new Error("World.apply_action: unknown action type '" + action.type + "'");
        }

        const offset = World._offset(action.type);
        const target = {
            x: (entity.position.x + offset.dx + this.config.width) % this.config.width,
            y: (entity.position.y + offset.dy + this.config.height) % this.config.height
        };

        const cell = this.state.grid[target.y][target.x];

        if (cell.traversal === "BLOCKED") {
            result.validity = "INVALID";
            result.reason = "BLOCKED_CELL";
            result.events.push({ type: "ENTITY_BLOCKED", entity_id: entity.id, position: { ...target } });
            return result;
        }

        if (entity.energy < this.config.move_cost) {
            result.validity = "FAILED";
            result.reason = "INSUFFICIENT_ENERGY";
            return result;
        }

        entity.energy -= this.config.move_cost;
        entity.position = target;
        result.events.push({ type: "ENTITY_MOVED", entity_id: entity.id, position: { ...target } });

        if (cell.effect) {
            if (cell.effect.kind === EffectKind.RESOURCE && cell.effect.stock > 0) {
                entity.energy += this.config.resource_effect;
                cell.effect.stock -= 1;
                result.events.push({ type: "RESOURCE_CONSUMED", entity_id: entity.id, position: { ...target } });
            } else if (cell.effect.kind === EffectKind.HAZARD) {
                entity.energy -= this.config.hazard_effect;
                result.events.push({ type: "HAZARD_ENTERED", entity_id: entity.id, position: { ...target } });
            }
        }

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

// F2-C partial pipeline through §11.1 step 10, plus a diagnostic snapshot.
// Step 11 remains unresolved: raw WorldEvent vs tick/source/sequence requirements.
// This is NOT initialize_world and does NOT return a canonical InitialWorldResult.
function prepare_world_through_lifecycle(config, seed) {
    const world = prepare_world_before_lifecycle(config, seed);
    const initial_events = world.resolve_lifecycle();
    world.sync_rng_state();
    assert_WorldState(world.state, world.config);
    return {world, initial_events, snapshot: world.full_snapshot()};
}
