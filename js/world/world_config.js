// Configuración inmutable del mundo.
// Contrato: js/world/world_config.js según especificación §7.

class WorldConfig {
    constructor(params) {
        WorldConfig._validate(params);

        this.width = params.width;
        this.height = params.height;
        this.obstacle_density = params.obstacle_density;
        this.resource_density = params.resource_density;
        this.hazard_density = params.hazard_density;
        this.initial_energy = params.initial_energy;
        this.move_cost = params.move_cost;
        this.wait_cost = params.wait_cost;
        this.resource_effect = params.resource_effect;
        this.hazard_effect = params.hazard_effect;
        this.resource_regeneration = params.resource_regeneration;
        this.death_threshold = params.death_threshold;
        this.observation_radius = params.observation_radius;

        Object.freeze(this);
    }

    static _validate(p) {
        const fail = (msg) => { throw new Error("WorldConfig: " + msg); };

        if (!Number.isInteger(p.width) || p.width <= 0) fail("width must be a positive integer");
        if (!Number.isInteger(p.height) || p.height <= 0) fail("height must be a positive integer");

        for (const k of ["obstacle_density", "resource_density", "hazard_density"]) {
            if (typeof p[k] !== "number" || !Number.isFinite(p[k])) fail(k + " must be finite");
            if (p[k] < 0 || p[k] > 1) fail(k + " must be in [0, 1]");
        }

        if (p.resource_density + p.hazard_density > 1) {
            fail("resource_density + hazard_density must be <= 1");
        }

        if (typeof p.initial_energy !== "number" || !Number.isFinite(p.initial_energy)) {
            fail("initial_energy must be finite");
        }

        for (const k of ["move_cost", "wait_cost"]) {
            if (!Number.isInteger(p[k]) || p[k] < 0) fail(k + " must be a non-negative integer");
        }

        if (!Number.isInteger(p.resource_effect) || p.resource_effect < 0) {
            fail("resource_effect must be a non-negative integer");
        }
        if (!Number.isInteger(p.hazard_effect) || p.hazard_effect < 0) {
            fail("hazard_effect must be a non-negative integer");
        }

        if (!Number.isInteger(p.resource_regeneration) || p.resource_regeneration < 0) {
            fail("resource_regeneration must be a non-negative integer");
        }

        if (!Number.isInteger(p.death_threshold)) {
            fail("death_threshold must be an integer");
        }

        if (!Number.isInteger(p.observation_radius) || p.observation_radius < 0) {
            fail("observation_radius must be a non-negative integer");
        }
    }

    static defaults() {
        return new WorldConfig({
            width: 20,
            height: 20,
            obstacle_density: 0.10,
            resource_density: 0.15,
            hazard_density: 0.05,
            initial_energy: 100,
            move_cost: 2,
            wait_cost: 0,
            resource_effect: 10,
            hazard_effect: 15,
            resource_regeneration: 1,
            death_threshold: 0,
            observation_radius: 2
        });
    }
}
