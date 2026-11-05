// WORLD-LAB v0.2.5 §7. Private validation context is not a record field.
class WorldState {
    #config;

    constructor(time, grid, entities, rng_state, config) {
        if (!validate_WorldState({time, grid, entities, rng_state}, config)) {
            throw new ContractError("invalid initial_state");
        }
        this.#config = new WorldConfig(config);
        this.time = time;
        this.grid = grid.map(row => row.map(cell => new Cell(cell.traversal, cell.effect)));
        this.entities = new Map();
        for (const [id, entity] of entities) {
            this.entities.set(id, new EntityState(entity.id, entity.position, entity.energy,
                entity.lifecycle, this.#config));
        }
        this.rng_state = rng_state;
    }

    copy() {
        // Validate before copying: do not strip added fields or repair corrupt state.
        if (!validate_WorldState(this, this.#config)) {
            throw new ContractError("invalid initial_state");
        }
        return new WorldState(this.time, this.grid, this.entities, this.rng_state, this.#config);
    }

    full_snapshot() {
        return this.copy();
    }
}
