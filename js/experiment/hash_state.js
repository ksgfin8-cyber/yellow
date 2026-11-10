// WLS1: recovered §34.1–9, with v0.2.5 binary64 canonicalization.
function wls1_require(condition) {
    if (!condition) throw new ContractError("recording failed");
}
function wls1_array_item(array, index) {
    const item = Object.getOwnPropertyDescriptor(array, String(index));
    wls1_require(item && Object.hasOwn(item, "value"));
    return item.value;
}
function wls1_validate_state(state) {
    wls1_require(has_exact_fields(state, ["time", "grid", "entities", "rng_state"]));
    const grid = state.grid;
    wls1_require(Array.isArray(grid) && grid.length > 0);
    const first = wls1_array_item(grid, 0);
    wls1_require(Array.isArray(first) && first.length > 0);
    // WorldState has no public config field: infer only dimensions for the
    // existing structural validator; other WorldConfig fields do not encode state.
    const config = {...WorldConfig.defaults(), width: first.length, height: grid.length};
    wls1_require(validate_WorldConfig(config));
    for (let y = 0; y < grid.length; y++) {
        const row = wls1_array_item(grid, y);
        wls1_require(Array.isArray(row) && row.length === config.width);
        for (let x = 0; x < row.length; x++) wls1_array_item(row, x);
    }
    wls1_require(validate_WorldState(state, config));
    return config;
}
function wls1_compare_bytes(a, b) {
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return a.length - b.length;
}
function serialize_world_state(state, include_rng = false) {
    wls1_require(typeof include_rng === "boolean");
    const config = wls1_validate_state(state);
    const entities = Array.from(state.entities.values(), entity => {
        const id_bytes = utf8_encode(entity.id);
        wls1_require(id_bytes.length <= 0xffffffff);
        return {entity, id_bytes};
    }).sort((a, b) => wls1_compare_bytes(a.id_bytes, b.id_bytes));
    const size = 24 + config.width * config.height * 3 +
        entities.reduce((n, item) => n + 21 + item.id_bytes.length, 0) + (include_rng ? 4 : 0);
    const bytes = new Uint8Array(size);
    const view = new DataView(bytes.buffer);
    let offset = 0;
    const u8 = value => { view.setUint8(offset, value); offset++; };
    const u32 = value => { view.setUint32(offset, value, false); offset += 4; };
    bytes.set([0x57, 0x4c, 0x53, 0x31]); offset = 4;
    view.setBigUint64(offset, BigInt(state.time), false); offset += 8;
    u32(config.width); u32(config.height);
    for (let y = 0; y < config.height; y++) for (let x = 0; x < config.width; x++) {
        const cell = state.grid[y][x], effect = cell.effect;
        u8(cell.traversal === "FREE" ? 0 : 1);
        u8(effect === null ? 0 : effect.kind === "RESOURCE" ? 1 : 2);
        u8(effect !== null && effect.kind === "RESOURCE" ? effect.stock : 0);
    }
    u32(entities.length);
    for (const {entity, id_bytes} of entities) {
        u32(id_bytes.length); bytes.set(id_bytes, offset); offset += id_bytes.length;
        u32(entity.position.x); u32(entity.position.y);
        view.setFloat64(offset, canonicalize_binary64(entity.energy), false); offset += 8;
        u8(entity.lifecycle === "ACTIVE" ? 0 : 1);
    }
    if (include_rng) u32(state.rng_state);
    wls1_require(offset === bytes.length);
    return bytes;
}
function canonical_world_state_bytes(state) {
    return serialize_world_state(state, false);
}
function canonical_full_state_bytes(state) {
    return serialize_world_state(state, true);
}
function STATE_HASH_WORLD(state) {
    return fnv1a_bytes(canonical_world_state_bytes(state));
}
function STATE_HASH_FULL(state) {
    return fnv1a_bytes(canonical_full_state_bytes(state));
}
