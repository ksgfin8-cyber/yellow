// Recorder. Acumula pasos y eventos.
// Contrato: js/experiment/recorder.js según especificación §18.

class Recorder {
    constructor(experiment_config) {
        this.experiment_config = experiment_config;
        this.initial_state = null;
        this.steps = [];
        this.events = [];
        this.termination_reason = "MAX_TICKS_REACHED";
        this._death_recorded = false;
    }

    record_initial_state(world_state) {
        this.initial_state = world_state.copy();
    }

    record_step(tick, world_state, observation, feedback, action, action_result) {
        // Sincronizar rng_state antes de persistir.
        world_state.rng_state = world_state.rng_state >>> 0;

        const state_hash_world = STATE_HASH_WORLD(world_state);
        const state_hash_full = STATE_HASH_FULL(world_state);

        const entity_states = {};
        for (const [id, e] of world_state.entities.entries()) {
            entity_states[id] = {
                id: e.id,
                position: { x: e.position.x, y: e.position.y },
                energy: e.energy
            };
        }

        this.steps.push({
            tick: tick,
            world_state: world_state.copy(),
            observation: observation,
            feedback: feedback,
            action: action,
            action_result: action_result,
            state_hash_world: state_hash_world,
            state_hash_full: state_hash_full,
            entity_states: entity_states
        });

        // Registrar eventos del resultado.
        for (const ev of action_result.events) {
            this.events.push({
                tick: tick,
                type: ev.type,
                entity_id: ev.entity_id || null,
                position: ev.position ? { ...ev.position } : null
            });
        }
    }

    record_death_event_if_needed(tick, entity_id) {
        if (this._death_recorded) return;
        this._death_recorded = true;
        this.events.push({
            tick: tick,
            type: "ENTITY_DIED",
            entity_id: entity_id,
            position: null
        });
    }

    set_termination_reason(reason) {
        this.termination_reason = reason;
    }

    finalize() {
        return new Trajectory(
            {
                experiment_seed: this.experiment_config.experiment_seed,
                max_ticks: this.experiment_config.max_ticks,
                world_config: { ...this.experiment_config.world_config },
                feedback_config: { ...this.experiment_config.feedback_config },
                agent_type: this.experiment_config.agent_type
            },
            this.initial_state,
            this.steps,
            this.events,
            this.termination_reason,
            { version: "v0.1" }
        );
    }
}
