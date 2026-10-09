// Observación y feedback. Tipos y construcción.
// Contrato: js/interface/observation.js y observation_builder.js según especificación §12.

const CellObservation = Object.freeze({
    FREE: "FREE",
    BLOCKED: "BLOCKED",
    RESOURCE: "RESOURCE",
    HAZARD: "HAZARD",
    UNKNOWN: "UNKNOWN"
});

function build_observation(world, entity, radius) {
    const config = world.config;

    const local_view = [];
    for (let dy = -radius; dy <= radius; dy++) {
        const row = [];
        for (let dx = -radius; dx <= radius; dx++) {
            const x = (entity.position.x + dx + config.width) % config.width;
            const y = (entity.position.y + dy + config.height) % config.height;
            const cell = world.state.grid[y][x];

            let representation;
            if (cell.traversal === "BLOCKED") {
                representation = CellObservation.BLOCKED;
            } else if (cell.effect && cell.effect.kind === EffectKind.RESOURCE && cell.effect.stock > 0) {
                representation = CellObservation.RESOURCE;
            } else if (cell.effect && cell.effect.kind === EffectKind.HAZARD) {
                representation = CellObservation.HAZARD;
            } else {
                representation = CellObservation.FREE;
            }

            // Ocupación por entidad: se informa como campo separado según §23.1.
            let occupied = false;
            for (const other of world.state.entities.values()) {
                if (other.id === entity.id) continue;
                if (other.position.x === x && other.position.y === y) {
                    occupied = true;
                    break;
                }
            }

            row.push({
                representation: representation,
                occupied: occupied
            });
        }
        local_view.push(row);
    }

    return {
        self: {
            id: entity.id,
            position: { x: entity.position.x, y: entity.position.y },
            energy: entity.energy
        },
        time: world.state.time,
        local_view: local_view
    };
}
