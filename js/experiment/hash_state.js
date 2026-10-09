// Serialización canónica y hashes del estado.
// Contrato: js/experiment/hash_state.js según especificación §17.

function serialize_world_state(state, include_rng) {
    const parts = [];

    parts.push("time=" + state.time);

    // Grid en orden canónico.
    parts.push("grid=[");
    for (let y = 0; y < state.grid.length; y++) {
        for (let x = 0; x < state.grid[y].length; x++) {
            const cell = state.grid[y][x];
            let s = "(" + x + "," + y + "):" + cell.traversal;
            if (cell.effect) {
                s += "/" + cell.effect.kind;
                if (cell.effect.kind === EffectKind.RESOURCE) {
                    s += ":" + cell.effect.stock;
                }
            }
            parts.push(s);
        }
    }
    parts.push("]");

    // Entidades ordenadas por id.
    const ids = Array.from(state.entities.keys()).sort();
    parts.push("entities=[");
    for (const id of ids) {
        const e = state.entities.get(id);
        parts.push("(" + id + "," + e.position.x + "," + e.position.y + "," + e.energy + ")");
    }
    parts.push("]");

    if (include_rng) {
        parts.push("rng=" + (state.rng_state >>> 0));
    }

    return parts.join(";");
}

function STATE_HASH_WORLD(state) {
    return fnv1a(serialize_world_state(state, false));
}

function STATE_HASH_FULL(state) {
    return fnv1a(serialize_world_state(state, true));
}
