// WORLD-LAB v0.2.5 §6. Values are validated, never coerced.
const MAX_CELLS = 2 ** 20;
const WORLD_CONFIG_FIELDS = Object.freeze([
    "width", "height", "topology", "obstacle_density", "resource_density",
    "hazard_density", "initial_energy", "move_cost", "wait_cost",
    "resource_effect", "hazard_damage", "resource_regeneration",
    "death_threshold", "observation_radius"
]);
function validate_WorldConfig(p) {
    if (!has_exact_fields(p, WORLD_CONFIG_FIELDS)) return false;
    if (!is_uint32(p.width) || p.width === 0 || !is_uint32(p.height) || p.height === 0) return false;
    if (BigInt(p.width) * BigInt(p.height) > BigInt(MAX_CELLS)) return false;
    if (p.topology !== "BOUNDED") return false;
    for (const k of ["obstacle_density", "resource_density", "hazard_density"]) {
        if (!Number.isFinite(p[k]) || p[k] < 0 || p[k] > 1) return false;
    }
    if (p.resource_density + p.hazard_density > 1 || !Number.isFinite(p.initial_energy)) return false;
    for (const k of ["move_cost", "wait_cost", "resource_effect", "hazard_damage",
        "resource_regeneration", "observation_radius"]) {
        if (!is_uint32(p[k])) return false;
    }
    return Number.isSafeInteger(p.death_threshold);
}
class WorldConfig {
    constructor(params) {
        WorldConfig._validate(params);
        for (const k of WORLD_CONFIG_FIELDS) this[k] = params[k];
        Object.freeze(this);
    }
    static _validate(params) {
        if (!validate_WorldConfig(params)) throw new ContractError("invalid world_config");
    }
    static defaults() {
        return new WorldConfig({
            topology: "BOUNDED",
            width: 20,
            height: 20,
            obstacle_density: 0.10,
            resource_density: 0.15,
            hazard_density: 0.05,
            initial_energy: 100,
            move_cost: 2,
            wait_cost: 0,
            resource_effect: 10,
            hazard_damage: 15,
            resource_regeneration: 1,
            death_threshold: 0,
            observation_radius: 2
        });
    }
}
