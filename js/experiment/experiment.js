// Orquestador del experimento. Ciclo exacto.
// Contrato: js/experiment/experiment.js según especificación §16.

class Experiment {
    constructor(config) {
        this.config = config;
    }

    run() {
        // 1. Validar config (ya validada en constructor).
        // 2. Derivar semilla del mundo.
        const world_seed = derive_seed(this.config.experiment_seed, "world");

        // 3. Crear e inicializar World.
        const world = new World(this.config.world_config);
        world.initialize(world_seed);

        // 4. Crear agente.
        const agent_seed = derive_seed(this.config.experiment_seed, this.config.agent_type);
        const agent = create_agent(this.config.agent_type, agent_seed);

        // 5. reset().
        agent.reset();

        // 6. Estado inicial.
        let last_action_result = null;

        // 7. Recorder.
        const recorder = new Recorder(this.config);
        recorder.record_initial_state(world.state);

        let termination_reason = "MAX_TICKS_REACHED";

        while (true) {
            // Comprobar terminación.
            if (world.is_experimental_entity_dead()) {
                termination_reason = "ENTITY_DIED";
                break;
            }
            if (world.state.time >= this.config.max_ticks) {
                termination_reason = "MAX_TICKS_REACHED";
                break;
            }

            // 1. Incrementar reloj.
            world.state.time += 1;

            // 2. Regenerar recursos.
            world.regenerate_resources();

            // 3. Observación.
            const entity = world.get_experimental_entity();
            const observation = build_observation(world, entity, this.config.world_config.observation_radius);

            // 4. Feedback.
            const feedback = build_feedback(observation, last_action_result, this.config.feedback_config);

            // 5. Acción.
            const action = agent.step(feedback);

            // 6. Resolver acción.
            const action_result = world.apply_action(action);

            // 7. Evaluar muerte.
            const dead = world.is_experimental_entity_dead();
            if (dead) {
                action_result.events.push({
                    type: "ENTITY_DIED",
                    entity_id: entity.id,
                    position: null
                });
            }

            // 8. Sincronizar rng_state.
            world.sync_rng_state();

            // 9. Registrar.
            recorder.record_step(
                world.state.time,
                world.state,
                observation,
                feedback,
                action,
                action_result
            );

            // 10. Actualizar last_action_result.
            last_action_result = action_result;

            // 11. Comprobar terminación en la siguiente iteración.
            if (dead) {
                recorder.record_death_event_if_needed(world.state.time, entity.id);
                termination_reason = "ENTITY_DIED";
                break;
            }
        }

        recorder.set_termination_reason(termination_reason);
        return recorder.finalize();
    }

    // Modo sin agente: solo dinámica autónoma.
    run_without_agent() {
        const world_seed = derive_seed(this.config.experiment_seed, "world");
        const world = new World(this.config.world_config);
        world.initialize(world_seed);

        const recorder = new Recorder(this.config);
        recorder.record_initial_state(world.state);

        while (world.state.time < this.config.max_ticks) {
            world.state.time += 1;
            world.regenerate_resources();
            world.sync_rng_state();

            // No hay agente, no hay observación, no hay acción.
            // Registramos solo el estado.
            recorder.record_step(
                world.state.time,
                world.state,
                null,
                null,
                null,
                { entity_id: null, action: null, validity: "NONE", reason: "NONE", events: [] }
            );
        }

        recorder.set_termination_reason("MAX_TICKS_REACHED");
        return recorder.finalize();
    }
}
