// WORLD-LAB v0.2.5 §9. Explicit lifecycle; no lifecycle transitions here.
class EntityState {
    #config;

    constructor(id, position, energy, lifecycle, config) {
        if (!validate_EntityState({id, position, energy, lifecycle}, config)) {
            throw new ContractError("invalid initial_state");
        }
        this.#config = new WorldConfig(config);
        this.id = id;
        this.position = {x: position.x, y: position.y};
        this.energy = energy;
        this.lifecycle = lifecycle;
    }

    copy() {
        if (!validate_EntityState(this, this.#config)) {
            throw new ContractError("invalid initial_state");
        }
        return new EntityState(this.id, this.position, this.energy, this.lifecycle, this.#config);
    }
}
