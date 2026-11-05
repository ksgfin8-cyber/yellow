// WORLD-LAB §16 / §35.6. Pure projection; subrecord policies OBS-P01/02 in STATUS.
const CellObservation = Object.freeze({
    FREE: "FREE",
    BLOCKED: "BLOCKED",
    RESOURCE: "RESOURCE",
    HAZARD: "HAZARD",
    OUT_OF_BOUNDS: "OUT_OF_BOUNDS"
});

// OBS-P03: construction budget, NOT a normative radius or map limit.
// Conservative model for fresh cell records and row slots, not a heap measurement.
const OBSERVATION_MEMORY_BUDGET_BYTES = 64n * 1024n * 1024n;

function build_observation(world, entity, radius) {
    if (world === null || typeof world !== "object") {
        throw new ContractError("invalid initial_state");
    }
    WorldConfig._validate(world.config);
    assert_WorldState(world.state, world.config);
    if (!validate_EntityState(entity, world.config) || world.state.entities.get(entity.id) !== entity) {
        throw new ContractError("invalid initial_state");
    }
    if (!is_uint32(radius)) throw new ContractError("world transition failed");

    // Exact planning even at maximum uint32 radius; fail before creating output.
    const side = 2n * BigInt(radius) + 1n;
    const estimatedBytes = side * side * 64n + side * 8n;
    if (estimatedBytes > OBSERVATION_MEMORY_BUDGET_BYTES) {
        throw new RangeError("observation window exceeds implementation capacity");
    }

    const {width, height} = world.config;
    const local_view = [];
    for (let dy = -radius; dy <= radius; dy++) {
        const row = [];
        for (let dx = -radius; dx <= radius; dx++) {
            const x = entity.position.x + dx;
            const y = entity.position.y + dy;
            let representation = CellObservation.OUT_OF_BOUNDS;
            if (x >= 0 && x < width && y >= 0 && y < height) {
                const cell = world.state.grid[y][x];
                if (cell.traversal === "BLOCKED") representation = CellObservation.BLOCKED;
                else if (cell.effect === null) representation = CellObservation.FREE;
                else if (cell.effect.kind === "RESOURCE") representation = CellObservation.RESOURCE;
                else representation = CellObservation.HAZARD; // validated Cell
            }
            row.push({representation, occupied: false});
        }
        local_view.push(row);
    }
    return {
        tick: world.state.time,
        self: {id: entity.id, position: {x: entity.position.x, y: entity.position.y}, energy: entity.energy},
        local_view
    };
}
