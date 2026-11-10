// WORLD-LAB v0.2.5 §20/§32. Requires F3-A kernel and F3-E Recorder.
function experiment_result(status, trajectory = null, failure_reason = null, failure_details = null) {
    return {status, trajectory, failure_reason, failure_details};
}
function execute_experiment(config, agent_factory, with_agent) {
    const checked = new ExperimentConfig(config);
    const world_seed = derive_seed(checked.experiment_seed, "world");
    const agent_seed = derive_seed(checked.experiment_seed, checked.agent_type);
    const recorder = new Recorder(checked);
    const world = new World(checked.world_config);
    let initial;
    try {
        // World.initialize is the F2-G adapter to the single initialize_world route;
        // it already adopts the independent state/RNG. Do not initialize/sync twice.
        initial = world.initialize(world_seed);
    } catch (error) {
        if (!(error instanceof InitializationError)) throw error;
        const failure = recorder.record_initialization_failure(error, checked);
        return experiment_result("FAILED", null, "INITIALIZATION_ERROR", {
            seed: failure.seed, message: failure.message, config: recorder_config_record(checked)
        });
    }
    recorder.record_initial_state(initial.world_state);
    recorder.record_initial_lifecycle_from_world(initial.initial_events);
    let agent = null;
    if (with_agent) {
        // Setup/factory/reset failures are outside §20.6's step-action catch.
        if (typeof agent_factory !== "function") throw new ContractError("world transition failed");
        agent = agent_factory(checked.agent_type, agent_seed);
        if (agent === null || typeof agent !== "object" ||
            typeof agent.reset !== "function" || typeof agent.step !== "function") {
            throw new ContractError("world transition failed");
        }
        agent.reset();
    }
    let last_action_result = null;
    let termination = determine_termination(world, checked.max_ticks);
    if (termination === null) {
        while (true) {
            termination = determine_termination(world, checked.max_ticks);
            if (termination !== null) break;
            let observation = null, feedback = null, action;
            if (with_agent) {
                observation = build_observation(world, world.get_experimental_entity(), checked.world_config.observation_radius);
                if (BigInt(observation.tick) !== BigInt(world.state.time)) throw new ContractError("world transition failed");
                feedback = build_feedback(observation, last_action_result, checked.feedback_config);
                try {
                    action = agent.step(feedback);
                    if (!validate_Action_structural(action)) {
                        throw new ContractError("agent produced structurally invalid action");
                    }
                } catch (error) {
                    recorder.set_termination_reason("AGENT_CONTRACT_ERROR");
                    return experiment_result("FAILED", recorder.finalize(), "AGENT_CONTRACT_ERROR", {
                        message: String(error), config: recorder_config_record(checked)
                    });
                }
            } else {
                action = {type: "WAIT"};
            }
            const confirmed = execute_tick_transaction(world, action, checked.max_ticks);
            // Fail-stop boundary: if recording fails, propagate; no retry, no
            // fake terminal reason, and no claim of joint WORLD/Recorder rollback.
            recorder.record_step(confirmed, observation, feedback, action);
            last_action_result = confirmed.action_result;
            termination = confirmed.termination;
            if (termination !== null) break;
        }
    }
    recorder.set_termination_reason(termination);
    return experiment_result("COMPLETED", recorder.finalize());
}
function run_experiment(config, agent_factory = create_agent) {
    return execute_experiment(config, agent_factory, true);
}
function run_without_agent(config) {
    return execute_experiment(config, null, false);
}
class Experiment {
    constructor(config) { this.config = new ExperimentConfig(config); }
    run(agent_factory = create_agent) { return run_experiment(this.config, agent_factory); }
    run_without_agent() { return run_without_agent(this.config); }
}
