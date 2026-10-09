// Mundo. Estado, reglas y transiciones.
// Contrato: js/world/world.js según especificación §8.4, §9, §10, §11.
//
// NOTA: World NO conoce a Agent, Experiment, Feedback ni Recorder.
// World NO tiene tick(). El ciclo vive en Experiment.

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

    _generate_grid() {
        const { width, height, obstacle_density, resource_density, hazard_density } = this.config;
        const grid = [];

        // Orden canónico: primero y, después x.
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const r_obstacle = this.rng.next_float();
                if (r_obstacle < obstacle_density) {
                    row.push(Cell.blocked());
                    continue;
                }

                const r_effect = this.rng.next_float();
                let effect = null;
                if (r_effect < resource_density) {
                    effect = makeResource(1);
                } else if (r_effect < resource_density + hazard_density) {
                    effect = makeHazard();
                }
                row.push(new Cell("FREE", effect));
            }
            grid.push(row);
        }
        return grid;
    }

    _choose_initial_position(grid) {
        const candidates = [];
        for (let y = 0; y < this.config.height; y++) {
            for (let x = 0; x < this.config.width; x++) {
                const cell = grid[y][x];
                if (cell.traversal === "FREE" && cell.effect === null) {
                    candidates.push({ x, y });
                }
            }
        }

        if (candidates.length === 0) {
            throw new Error("World.initialize: no valid initial position (no FREE cell without effects)");
        }

        const idx = this.rng.next_int(0, candidates.length - 1);
        return candidates[idx];
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
