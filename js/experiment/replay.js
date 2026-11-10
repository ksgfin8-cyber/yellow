// F3-G: deterministic replay. Contractually unresolved input branches throw
// rather than fabricating ReplayResult counters or weakening shared validation.
function replay_world_from_state(initial_state, world_config) {
    const config = new WorldConfig(world_config);
    assert_WorldState(initial_state, config);
    const world = new World(config);
    world.state = new WorldState(initial_state.time, initial_state.grid,
        initial_state.entities, initial_state.rng_state, config);
    world.experimental_entity_id = world.state.entities.keys().next().value;
    world.rng = new PRNG(initial_state.rng_state); // restore, never derive/reseed/generate
    return world;
}
function replay_confirmed_tick(world, recorder, action, feedback_config, max_ticks) {
    // Separate snapshots: the internal stream can differ from persisted rng_state
    // before the kernel's synchronization point. Preserve both exactly.
    let state_before, rng, rng_before, restore_rng, recorder_before;
    try {
        state_before = world.full_snapshot();
        rng = world.rng;
        rng_before = rng.get_state();
        restore_rng = PRNG.prototype.set_state.bind(rng);
        recorder_before = Object.fromEntries(RECORD_TRANSACTION_FIELDS.map(key => [key, recorder[key]]));
    } catch (error) { throw new ContractError("world transition failed"); }
    let phase = "world";
    try {
        const previous = recorder.steps.length === 0 ? null : recorder.steps[recorder.steps.length - 1].action_result;
        const observation = build_observation(world, world.get_experimental_entity(), world.config.observation_radius);
        const feedback = build_feedback(observation, previous, feedback_config);
        const confirmed = execute_tick_transaction(world, action, max_ticks);
        phase = "recorder";
        recorder.record_step(confirmed, observation, feedback, action);
        return {confirmed, prefix: replay_prefix_snapshot(world, recorder)};
    } catch (error) {
        world.state = state_before;
        world.rng = rng;
        restore_rng(rng_before);
        for (const key of RECORD_TRANSACTION_FIELDS) recorder[key] = recorder_before[key];
        throw new ContractError(phase === "recorder" ? "recording failed" : "world transition failed");
    }
}
function replay_prefix_snapshot(world, recorder) {
    // Reuse Recorder's existing validation/copier without pretending that an
    // unfinished replay is a finalized Trajectory or an agent-contract failure.
    return {
        records: recorder.steps.map(step => recorder._copy_step(step)),
        events: recorder.events.map(recorder_copy_event),
        final_state: world.full_snapshot(),
        executed: recorder.steps.length
    };
}
const REPLAY_RESULT_FIELDS = Object.freeze(["status", "records", "events", "final_state", "executed",
    "unused_actions", "max_ticks_used", "expected_steps_used", "unknown_action_index", "error_message", "termination_hint"]);
const REPLAY_STATUSES = Object.freeze(["OK", "MAX_TICKS_REACHED", "EARLY_TERMINATION", "INCOMPLETE_ACTION_SEQUENCE",
    "UNKNOWN_ACTION", "INVALID_REPLAY_INPUT", "EXECUTION_ERROR"]);
function replay_expected_steps(value) {
    if (!recorder_safe_number(value)) throw new ContractError("invalid expected_steps");
    return value;
}
function replay_valid_action_list(actions) {
    if (!Array.isArray(actions)) return false;
    try {
        for (let i = 0; i < actions.length; i++) if (!validate_Action_structural(feedback_array_item(actions, i))) return false;
        return true;
    } catch (error) { return false; }
}
function replay_counter_parameters(expected_steps, max_ticks) {
    return recorder_safe_number(expected_steps) && is_uint64(max_ticks) && BigInt(max_ticks) <= RECORDER_MAX_SAFE;
}
function validate_replay_inputs(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks) {
    // Fixed validation order; unknown types remain structurally valid here.
    const config = new WorldConfig(world_config);
    const feedback = new FeedbackConfig(feedback_config);
    assert_WorldState(initial_state, config);
    try { Recorder.prototype._validate_initial_recorded(initial_state, initial_events); }
    catch (error) { throw new ContractError("invalid initial_events"); }
    if (!replay_valid_action_list(actions)) throw new ContractError("invalid action structure");
    replay_expected_steps(expected_steps);
    tick_max_ticks(max_ticks);
    if (BigInt(initial_state.time) > BigInt(max_ticks)) throw new ContractError("initial_state.time > max_ticks");
    return {world_config: config, feedback_config: feedback,
        initial_state: new WorldState(initial_state.time, initial_state.grid, initial_state.entities, initial_state.rng_state, config),
        initial_events: initial_events.map(recorder_copy_event), actions: actions.map(action => ({type: action.type})),
        expected_steps, max_ticks};
}
function replay_termination(state, context) {
    return determine_termination({state, config: context.world_config,
        experimental_entity_id: state.entities.keys().next().value}, context.max_ticks);
}
function replay_result(status, prefix, context, error_message = null, unknown_action_index = null) {
    return {status, records: prefix.records, events: prefix.events, final_state: prefix.final_state, executed: prefix.executed,
        unused_actions: Math.max(0, context.actions.length - prefix.executed), max_ticks_used: Number(context.max_ticks),
        expected_steps_used: context.expected_steps, unknown_action_index, error_message,
        termination_hint: status === "OK" ? replay_termination(prefix.final_state, context) : null};
}
function replay_array_every(array, predicate) {
    if (!Array.isArray(array)) return false;
    try {
        for (let i = 0; i < array.length; i++) if (!predicate(feedback_array_item(array, i))) return false;
        return true;
    } catch (error) { return false; }
}
function replay_record_structure(step, context) {
    if (!has_exact_fields(step, STEP_RECORD_FIELDS) || !recorder_safe_number(step.tick) ||
        !validate_WorldState(step.world_state, context.world_config) || !is_uint32(step.state_hash_world) ||
        !is_uint32(step.state_hash_full) || !validate_Action_structural(step.action) ||
        !tick_valid_action_result(step.action_result) ||
        !replay_array_every(step.action_events, validate_RecordedEvent) ||
        !replay_array_every(step.lifecycle_events, validate_RecordedEvent) ||
        !(step.entity_states instanceof Map) || step.entity_states.size !== 1 ||
        (step.observation === null) !== (step.feedback === null)) return false;
    for (const [id, entity] of step.entity_states) if (id !== entity.id || !validate_EntityState(entity, context.world_config)) return false;
    if (step.observation !== null) Recorder.prototype._copy_feedback.call(
        {experiment_config: {feedback_config: context.feedback_config}}, step.feedback, feedback_copy_observation(step.observation));
    return true;
}
function validate_ReplayResult_structure(result, context) {
    if (!context || !replay_counter_parameters(context.expected_steps, context.max_ticks)) return false;
    if (!has_exact_fields(result, REPLAY_RESULT_FIELDS) || !REPLAY_STATUSES.includes(result.status) ||
        !Array.isArray(result.records) || !Array.isArray(result.events) || !recorder_safe_number(result.executed) ||
        result.records.length !== result.executed || !recorder_safe_number(result.unused_actions) ||
        !recorder_safe_number(result.expected_steps_used) || !recorder_safe_number(result.max_ticks_used) ||
        result.expected_steps_used !== context.expected_steps || BigInt(result.max_ticks_used) !== BigInt(context.max_ticks)) return false;
    if (result.status === "INVALID_REPLAY_INPUT") return result.final_state === null && result.executed === 0 &&
        result.events.length === 0 && result.unknown_action_index === null && result.termination_hint === null &&
        typeof result.error_message === "string" && result.error_message.length > 0 &&
        result.unused_actions === (replay_valid_action_list(context.actions) ? context.actions.length : 0);
    if (!validate_WorldState(result.final_state, context.world_config) ||
        result.unused_actions !== Math.max(0, context.actions.length - result.executed) ||
        !replay_array_every(result.events, validate_RecordedEvent) ||
        !replay_array_every(result.records, step => replay_record_structure(step, context))) return false;
    if (result.status === "OK") return result.executed === context.expected_steps && result.unknown_action_index === null &&
        result.error_message === null && result.termination_hint === replay_termination(result.final_state, context);
    if (result.termination_hint !== null) return false;
    if (result.status === "EXECUTION_ERROR") return result.unknown_action_index === null &&
        typeof result.error_message === "string" && result.error_message.length > 0;
    if (result.executed >= context.expected_steps || result.error_message !== null) return false;
    if (result.status === "UNKNOWN_ACTION") return result.unknown_action_index === result.executed &&
        result.executed < context.actions.length && !Object.hasOwn(ActionType, context.actions[result.executed].type);
    if (result.unknown_action_index !== null) return false;
    if (result.status === "INCOMPLETE_ACTION_SEQUENCE") return result.executed === context.actions.length;
    return replay_termination(result.final_state, context) === (result.status === "EARLY_TERMINATION" ? "ENTITY_DIED" : "MAX_TICKS_REACHED");
}
function replay_trajectory(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks) {
    let context;
    try {
        context = validate_replay_inputs(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks);
    } catch (error) {
        // Contractual conflict: counters cannot both be safe integers and equal
        // invalid parameters. Nonzero initial time conflicts with shared P0-7.
        if (!replay_counter_parameters(expected_steps, max_ticks) ||
            (validate_WorldConfig(world_config) && validate_FeedbackConfig(feedback_config) &&
                validate_WorldState(initial_state, world_config) && BigInt(initial_state.time) > 0n)) throw error;
        const invalid = {status: "INVALID_REPLAY_INPUT", records: [], events: [], final_state: null, executed: 0,
            unused_actions: replay_valid_action_list(actions) ? actions.length : 0,
            max_ticks_used: Number(max_ticks), expected_steps_used: expected_steps,
            unknown_action_index: null, error_message: error.message, termination_hint: null};
        if (!validate_ReplayResult_structure(invalid, {actions, expected_steps, max_ticks})) throw new ContractError("world transition failed");
        return invalid;
    }
    // A valid uint64 may exceed the safe Number representation required by the
    // recovered result-counter contract. Do not silently reduce the WORLD limit.
    if (!replay_counter_parameters(expected_steps, max_ticks)) throw new ContractError("world transition failed");
    const world = replay_world_from_state(context.initial_state, context.world_config);
    let consistent = {records: [], events: context.initial_events.map(recorder_copy_event),
        final_state: world.full_snapshot(), executed: 0};
    // Constructor-only context for Recorder; seed1/type replay are private adapter
    // values, never a claim about the original experiment and never used to seed WORLD.
    const recorder = new Recorder(new ExperimentConfig({experiment_seed: 1, agent_type: "replay",
        max_ticks: context.max_ticks, world_config: context.world_config, feedback_config: context.feedback_config}));
    let status = "OK", error_message = null, unknown_action_index = null;
    try {
        recorder.record_initial_state(world.state);
        recorder.record_initial_lifecycle_from_recorded(context.initial_events);
    } catch (error) { status = "EXECUTION_ERROR"; error_message = "recording failed"; }
    if (status === "OK") for (let i = 0; i < context.expected_steps; i++) {
        const termination = determine_termination(world, context.max_ticks);
        if (termination !== null) { status = termination === "ENTITY_DIED" ? "EARLY_TERMINATION" : "MAX_TICKS_REACHED"; break; }
        if (i >= context.actions.length) { status = "INCOMPLETE_ACTION_SEQUENCE"; break; }
        if (!Object.hasOwn(ActionType, context.actions[i].type)) { status = "UNKNOWN_ACTION"; unknown_action_index = i; break; }
        try { consistent = replay_confirmed_tick(world, recorder, context.actions[i], context.feedback_config, context.max_ticks).prefix; }
        catch (error) { status = "EXECUTION_ERROR"; error_message = error.message; break; }
    }
    const result = replay_result(status, consistent, context, error_message, unknown_action_index);
    if (!validate_ReplayResult_structure(result, context)) throw new ContractError("world transition failed");
    return result;
}
