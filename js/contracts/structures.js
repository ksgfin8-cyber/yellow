// Executable structural predicates, not transition or initialization logic.
// Requires core/contracts.js, core/hash.js, world/world_config.js.
function is_unicode_string(value) {
    if (typeof value !== "string") return false;
    try { utf8_encode(value); return true; }
    catch (error) {
        if (error instanceof ContractError) return false;
        throw error;
    }
}
function validate_Cell(cell) {
    if (!has_exact_fields(cell, ["traversal", "effect"])) return false;
    if (cell.traversal !== "FREE" && cell.traversal !== "BLOCKED") return false;
    if (cell.effect === null) return true;
    if (cell.traversal === "BLOCKED") return false;
    const effect = cell.effect;
    return (has_exact_fields(effect, ["kind", "stock"]) && effect.kind === "RESOURCE" &&
        (effect.stock === 0 || effect.stock === 1)) ||
        (has_exact_fields(effect, ["kind"]) && effect.kind === "HAZARD");
}
function validate_EntityState(entity, config) {
    if (!validate_WorldConfig(config)) return false;
    if (!has_exact_fields(entity, ["id", "position", "energy", "lifecycle"])) return false;
    if (!is_unicode_string(entity.id) || entity.id.length === 0 || !Number.isFinite(entity.energy)) return false;
    if (entity.lifecycle !== "ACTIVE" && entity.lifecycle !== "DEAD") return false;
    if (!has_exact_fields(entity.position, ["x", "y"])) return false;
    const {x, y} = entity.position;
    return Number.isSafeInteger(x) && Number.isSafeInteger(y) && x >= 0 && y >= 0 &&
        x < config.width && y < config.height;
}
function validate_WorldState(state, config) {
    if (!validate_WorldConfig(config) || !has_exact_fields(state, ["time", "grid", "entities", "rng_state"])) return false;
    if (!is_uint64(state.time) || !is_uint32(state.rng_state) || state.rng_state === 0) return false;
    if (!Array.isArray(state.grid) || state.grid.length !== config.height) return false;
    for (let y = 0; y < config.height; y++) {
        const row = state.grid[y];
        if (!Array.isArray(row) || row.length !== config.width) return false;
        for (let x = 0; x < config.width; x++) if (!validate_Cell(row[x])) return false;
    }
    if (!(state.entities instanceof Map) || state.entities.size !== 1) return false;
    for (const [id, entity] of state.entities) {
        if (!validate_EntityState(entity, config) || id !== entity.id) return false;
        if (entity.lifecycle === "ACTIVE" && state.grid[entity.position.y][entity.position.x].traversal !== "FREE") return false;
    }
    return true;
}
function assert_WorldState(state, config) {
    if (!validate_WorldState(state, config)) throw new ContractError("invalid initial_state");
    return state;
}
// This is NOT an acceptance validator: feedback and inherited domains are unresolved.
function inspect_ExperimentConfig_defined_fields(config) {
    const issues = [];
    if (config === null || typeof config !== "object") return {checked: false, complete: false};
    for (const field of ["experiment_seed", "max_ticks", "world_config", "feedback_config", "agent_type"]) {
        if (!Object.hasOwn(config, field)) issues.push("missing " + field);
    }
    if (!is_uint32(config.experiment_seed) || config.experiment_seed === 0) issues.push("experiment_seed domain (§11.6)");
    if (!validate_WorldConfig(config.world_config)) issues.push("invalid world_config");
    return {checked: true, complete: false, issues};
}
