// Estado del mundo. Tipo puro, sin lógica.
// Contrato: js/world/world_state.js según especificación §8.3.

class WorldState {
    constructor(time, grid, entities, rng_state) {
        this.time = time;
        this.grid = grid;
        this.entities = entities;     // Map<id, EntityState>
        this.rng_state = rng_state;   // uint32
    }

    copy() {
        const gridCopy = this.grid.map(row => row.map(cell => new Cell(cell.traversal, cell.effect ? { ...cell.effect } : null)));
        const entitiesCopy = new Map();
        for (const [id, e] of this.entities.entries()) {
            entitiesCopy.set(id, e.copy());
        }
        return new WorldState(this.time, gridCopy, entitiesCopy, this.rng_state >>> 0);
    }
}
