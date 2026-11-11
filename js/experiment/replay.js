// F3-G: deterministic replay. Contractually unresolved input branches throw
// rather than fabricating ReplayResult counters or weakening shared validation.
function validate_replay_initial_events(state, events) {
    if(BigInt(state.time)>0n) { if(!Array.isArray(events)||events.length!==0) throw new ContractError("invalid initial_events"); }
    else Recorder.prototype._validate_initial_recorded(state,events);
}
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
    return replay_tick_transaction(world, recorder, action, feedback_config, max_ticks, true, "WITH_AGENT");
}
// Internal bounded transition. Prefix export is requested explicitly, not on every engine tick.
function replay_tick_transaction(world, recorder, action, feedback_config, max_ticks, export_prefix, execution_mode) {
    // Separate snapshots: the internal stream can differ from persisted rng_state
    // before the kernel's synchronization point. Preserve both exactly.
    let state_before, rng, rng_before, restore_rng, recorder_before;
    try {
        state_before = world.full_snapshot();
        rng = world.rng;
        rng_before = rng.get_state();
        restore_rng = PRNG.prototype.set_state.bind(rng);
        recorder_before = recorder._checkpoint();
    } catch (error) { throw new ContractError("world transition failed"); }
    let phase = "world";
    try {
        const previous = recorder._prior_action_result();
        const observation = execution_mode==="WITHOUT_AGENT"?null:build_observation(world, world.get_experimental_entity(), world.config.observation_radius);
        const feedback = observation===null?null:build_feedback(observation, previous, feedback_config);
        const confirmed = execute_tick_transaction(world, action, max_ticks);
        phase = "recorder";
        recorder.record_step(confirmed, observation, feedback, action);
        return {confirmed, prefix: export_prefix ? replay_prefix_snapshot(world, recorder) : null};
    } catch (error) {
        world.state = state_before;
        world.rng = rng;
        restore_rng(rng_before);
        recorder._restore_checkpoint(recorder_before);
        throw new ContractError(phase === "recorder" ? "recording failed" : "world transition failed");
    }
}
function replay_prefix_snapshot(world, recorder) {
    // Reuse Recorder's existing validation/copier without pretending that an
    // unfinished replay is a finalized Trajectory or an agent-contract failure.
    const prefix = recorder._export_prefix();
    prefix.final_state = world.full_snapshot();
    return prefix;
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
function replay_counter_parameters(expected_steps, max_ticks, execution_mode) {
    return recorder_safe_number(expected_steps) && is_uint64(max_ticks);
}
function validate_replay_inputs(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks, execution_mode) {
    // Fixed validation order; unknown types remain structurally valid here.
    const config = new WorldConfig(world_config);
    const feedback = new FeedbackConfig(feedback_config);
    assert_WorldState(initial_state, config);
    try { validate_replay_initial_events(initial_state, initial_events); }
    catch (error) { throw new ContractError("invalid initial_events"); }
    if (!replay_valid_action_list(actions)) throw new ContractError("invalid action structure");
    replay_expected_steps(expected_steps);
    tick_max_ticks(max_ticks);
    if (BigInt(initial_state.time) > BigInt(max_ticks)) throw new ContractError("initial_state.time > max_ticks");
    if(!["WITH_AGENT","WITHOUT_AGENT"].includes(execution_mode) ||
        (execution_mode==="WITHOUT_AGENT" && actions.some(a=>a.type!=="WAIT"))) throw new ContractError("invalid action structure");
    return {execution_mode, world_config: config, feedback_config: feedback,
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
        unused_actions: Math.max(0, context.actions.length - prefix.executed), max_ticks_used: recorder_tick(context.max_ticks),
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
    if (!has_exact_fields(step, STEP_RECORD_FIELDS) || !is_uint64(step.tick) ||
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
    if(!context) return false;
    if(result?.status==="INVALID_REPLAY_INPUT") return has_exact_fields(result,REPLAY_RESULT_FIELDS) &&
        result.final_state===null && result.executed===0 && Array.isArray(result.records)&&result.records.length===0 &&
        Array.isArray(result.events)&&result.events.length===0 && result.unknown_action_index===null &&result.termination_hint===null &&
        typeof result.error_message==="string" && result.error_message.length>0 &&
        result.expected_steps_used===(recorder_safe_number(context.expected_steps)?context.expected_steps:null) &&
        result.max_ticks_used===(is_uint64(context.max_ticks)?recorder_tick(context.max_ticks):null) &&
        result.unused_actions===(replay_valid_action_list(context.actions)?context.actions.length:0);
    if (!replay_counter_parameters(context.expected_steps, context.max_ticks)) return false;
    if (!has_exact_fields(result, REPLAY_RESULT_FIELDS) || !REPLAY_STATUSES.includes(result.status) ||
        !Array.isArray(result.records) || !Array.isArray(result.events) || !recorder_safe_number(result.executed) ||
        result.records.length !== result.executed || !recorder_safe_number(result.unused_actions) ||
        !recorder_safe_number(result.expected_steps_used) || !is_uint64(result.max_ticks_used) ||
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
function replay_trajectory(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks, execution_mode) {
    let context;
    try {
        context = validate_replay_inputs(initial_state, initial_events, actions, world_config, feedback_config, expected_steps, max_ticks, execution_mode);
    } catch (error) {
        const invalid = {status: "INVALID_REPLAY_INPUT", records: [], events: [], final_state: null, executed: 0,
            unused_actions: replay_valid_action_list(actions) ? actions.length : 0,
            max_ticks_used: is_uint64(max_ticks)?recorder_tick(max_ticks):null, expected_steps_used: recorder_safe_number(expected_steps)?expected_steps:null,
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
        recorder._adopt_replay_origin(world.state,context.initial_events);
    } catch (error) { status = "EXECUTION_ERROR"; error_message = "recording failed"; }
    if (status === "OK") for (let i = 0; i < context.expected_steps; i++) {
        const termination = determine_termination(world, context.max_ticks);
        if (termination !== null) { status = termination === "ENTITY_DIED" ? "EARLY_TERMINATION" : "MAX_TICKS_REACHED"; break; }
        if (i >= context.actions.length) { status = "INCOMPLETE_ACTION_SEQUENCE"; break; }
        if (!Object.hasOwn(ActionType, context.actions[i].type)) { status = "UNKNOWN_ACTION"; unknown_action_index = i; break; }
        try { replay_tick_transaction(world, recorder, context.actions[i], context.feedback_config, context.max_ticks, false, context.execution_mode); }
        catch (error) { status = "EXECUTION_ERROR"; error_message = error.message; break; }
    }
    if (recorder._history_length() > 0) consistent = recorder._export_prefix();
    const result = replay_result(status, consistent, context, error_message, unknown_action_index);
    if (!validate_ReplayResult_structure(result, context)) throw new ContractError("world transition failed");
    return result;
}

// F3-H: value equality is structural, independent of hashes and object order.
function replay_values_equal(a, b, field = "") {
    if ((field === "time" || field === "tick") && is_uint64(a) && is_uint64(b)) return BigInt(a) === BigInt(b);
    if (typeof a === "number" && typeof b === "number") return (a === 0 && b === 0) || Object.is(a, b);
    if (a === b) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
    if (a instanceof Map || b instanceof Map) {
        if (!(a instanceof Map) || !(b instanceof Map) || a.size !== b.size) return false;
        for (const [key, value] of a) if (!b.has(key) || !replay_values_equal(value, b.get(key))) return false;
        return true;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!replay_values_equal(feedback_array_item(a, i), feedback_array_item(b, i))) return false;
        return true;
    }
    const keys = Reflect.ownKeys(a);
    if (keys.length !== Reflect.ownKeys(b).length) return false;
    return keys.every(key => {
        const x = Object.getOwnPropertyDescriptor(a, key), y = Object.getOwnPropertyDescriptor(b, key);
        return x && y && Object.hasOwn(x, "value") && Object.hasOwn(y, "value") && replay_values_equal(x.value, y.value, key);
    });
}
function validate_termination_hint(rr) {
    try {
        if (rr.termination_hint === null) return true; // §25.3.2 expressly permits null at any final state
        if (!["ENTITY_DIED", "MAX_TICKS_REACHED"].includes(rr.termination_hint) ||
            !has_exact_fields(rr.final_state, ["time", "grid", "entities", "rng_state"]) ||
            !is_uint64(rr.final_state.time) || !(rr.final_state.entities instanceof Map) || rr.final_state.entities.size !== 1) return false;
        const entity = rr.final_state.entities.values().next().value;
        if (rr.termination_hint === "ENTITY_DIED") return entity.lifecycle === "DEAD";
        return entity.lifecycle === "ACTIVE" && is_uint64(rr.max_ticks_used) &&
            BigInt(rr.final_state.time) >= BigInt(rr.max_ticks_used);
    } catch (error) { return false; }
}
function derive_termination_reason(rr) {
    if (!rr || ![null, "ENTITY_DIED", "MAX_TICKS_REACHED"].includes(rr.termination_hint)) throw new ContractError("world transition failed");
    if (rr.termination_hint !== null) return rr.termination_hint;
    if (rr.final_state === null) return "INDETERMINATE";
    const entity = rr.final_state.entities.values().next().value;
    if (entity.lifecycle === "DEAD") return "ENTITY_DIED";
    if (BigInt(rr.final_state.time) >= BigInt(rr.max_ticks_used)) return "MAX_TICKS_REACHED";
    return "INDETERMINATE";
}
// Private explicit-context proof: one kernel call per record, no Recorder prefix
// revalidation and no configuration defaults/inference. Never trusts hashes alone.
function replay_continuity_proof(rr, context, trajectory_null_mode) {
    const world = replay_world_from_state(context.initial_state, context.world_config);
    const all_events = context.initial_events.slice();
    let sequence = BigInt(all_events.length), previous_result = null;
    for (let i = 0; i < rr.records.length; i++) {
        const step = feedback_array_item(rr.records, i), action = feedback_array_item(context.actions, i);
        if (!replay_record_structure(step, context) || !Object.hasOwn(ActionType, action.type) ||
            !replay_values_equal(step.action, action) || determine_termination(world, context.max_ticks) !== null) return null;
        const observation = trajectory_null_mode ? null : build_observation(world, world.get_experimental_entity(), context.world_config.observation_radius);
        const feedback = trajectory_null_mode ? null : build_feedback(observation, previous_result, context.feedback_config);
        if ((trajectory_null_mode && action.type !== "WAIT") || !replay_values_equal(step.observation, observation) ||
            !replay_values_equal(step.feedback, feedback)) return null;
        const confirmed = execute_tick_transaction(world, {type: action.type}, context.max_ticks);
        if (BigInt(step.tick) !== BigInt(confirmed.tick) || !replay_values_equal(step.world_state, confirmed.world_state) ||
            !replay_values_equal(step.action_result, confirmed.action_result) ||
            step.state_hash_world !== STATE_HASH_WORLD(step.world_state) || step.state_hash_full !== STATE_HASH_FULL(step.world_state)) return null;
        for (const [source, list, raw] of [["action", step.action_events, confirmed.action_events], ["lifecycle", step.lifecycle_events, confirmed.lifecycle_events]]) {
            if (list.length !== raw.length) return null;
            for (let j = 0; j < list.length; j++) {
                const event = feedback_array_item(list, j), expected = raw[j];
                if (!validate_RecordedEvent(event) || event.type !== expected.type || event.entity_id !== expected.entity_id ||
                    !replay_values_equal(event.position, expected.position) || event.source !== source ||
                    BigInt(event.tick) !== BigInt(confirmed.tick) || BigInt(event.sequence) !== sequence) return null;
                sequence++; all_events.push(event);
            }
        }
        if (!replay_values_equal(step.entity_states, confirmed.world_state.entities)) return null;
        previous_result = confirmed.action_result;
    }
    if (!replay_values_equal(rr.final_state, world.state) || !replay_values_equal(rr.events, all_events)) return null;
    return {final_state: world.state, termination: determine_termination(world, context.max_ticks)};
}
// Published three-argument signature is retained. Physics/Feedback context is
// unavailable here; nonempty standalone validation is explicitly PARTIAL.
function validate_replay_continuity(rr, request_context) {
    try { const c=replay_context_values(request_context);
        if(!has_exact_fields(rr,REPLAY_RESULT_FIELDS)||!Array.isArray(rr.records)||!Array.isArray(rr.events)||rr.executed!==rr.records.length)return false;
        return !!replay_continuity_proof(rr,c,c.execution_mode==="WITHOUT_AGENT");
    } catch { return false; }
}
const REPLAY_ERROR_CATALOG = Object.freeze(["invalid world_config", "invalid feedback_config", "invalid initial_state",
    "invalid initial_events", "invalid action structure", "invalid expected_steps", "invalid max_ticks",
    "initial_state.time > max_ticks", "invalid initial_position", "world transition failed", "recording failed",
    "rng zero state", "agent produced structurally invalid action"]);
function replay_context_values(context) {
    if(!has_exact_fields(context,["world_config","feedback_config","initial_state","initial_events","actions","expected_steps","max_ticks","execution_mode"])) throw new ContractError("invalid action structure");
    return validate_replay_inputs(context.initial_state, context.initial_events, context.actions,
        context.world_config, context.feedback_config, context.expected_steps, context.max_ticks, context.execution_mode);
}
function validate_ReplayResult(rr, request_context) {
    try {
        const c = request_context;
        if (!c ||
            !has_exact_fields(rr, REPLAY_RESULT_FIELDS) || !REPLAY_STATUSES.includes(rr.status)) return false;
        if (rr.status === "INVALID_REPLAY_INPUT") {
            try { replay_context_values(c); return false; }
            catch (error) { return validate_ReplayResult_structure(rr, c) && REPLAY_ERROR_CATALOG.includes(rr.error_message) && rr.error_message === error.message; }
        }
        const context = replay_context_values(c);
        if (!Array.isArray(rr.records) || !Array.isArray(rr.events) || !recorder_safe_number(rr.executed) ||
            rr.executed !== rr.records.length || rr.executed > context.expected_steps ||
            !recorder_safe_number(rr.unused_actions) || rr.unused_actions !== Math.max(0, context.actions.length - rr.executed) ||
            !is_uint64(rr.max_ticks_used) || BigInt(rr.max_ticks_used) !== BigInt(context.max_ticks) ||
            rr.expected_steps_used !== context.expected_steps || !recorder_safe_number(rr.expected_steps_used) ||
            !validate_WorldState(rr.final_state, context.world_config) || !replay_array_every(rr.events, validate_RecordedEvent)) return false;
        const proof = replay_continuity_proof(rr, context, context.execution_mode==="WITHOUT_AGENT");
        if (!proof || !validate_termination_hint(rr)) return false;
        if (rr.status === "OK") return rr.executed === context.expected_steps && rr.error_message === null && rr.unknown_action_index === null;
        if (rr.termination_hint !== null) return false;
        if (rr.status === "EXECUTION_ERROR") return rr.unknown_action_index === null && REPLAY_ERROR_CATALOG.includes(rr.error_message);
        if (rr.executed >= context.expected_steps || rr.error_message !== null) return false;
        if (rr.status === "UNKNOWN_ACTION") return proof.termination === null && rr.unknown_action_index === rr.executed &&
            rr.executed < context.actions.length && !Object.hasOwn(ActionType, context.actions[rr.executed].type);
        if (rr.unknown_action_index !== null) return false;
        if (rr.status === "INCOMPLETE_ACTION_SEQUENCE") return proof.termination === null && rr.executed === context.actions.length;
        return proof.termination === (rr.status === "EARLY_TERMINATION" ? "ENTITY_DIED" : "MAX_TICKS_REACHED");
    } catch (error) { return false; }
}
function replay_original_context(original, world_config, execution_mode) {
    if (!has_exact_fields(original, ["experiment_config", "initial_state", "steps", "events", "termination_reason", "metadata"]) ||
        !validate_ExperimentConfig(original.experiment_config) || !replay_values_equal(world_config, original.experiment_config.world_config) ||
        !Array.isArray(original.steps) || !Array.isArray(original.events) ||
        !["ENTITY_DIED", "MAX_TICKS_REACHED", "AGENT_CONTRACT_ERROR"].includes(original.termination_reason)) return null;
    if (!validate_WorldState(original.initial_state, world_config)) return null;
    const count = original.initial_state.entities.values().next().value.lifecycle === "DEAD" ? 1 : 0;
    const context = replay_context_values({world_config, feedback_config: original.experiment_config.feedback_config,
        initial_state: original.initial_state, initial_events: BigInt(original.initial_state.time)===0n?original.events.slice(0, count):[], execution_mode,
        actions: original.steps.map(step => step.action), expected_steps: original.steps.length,
        max_ticks: original.experiment_config.max_ticks});
    const end = original.steps.length === 0 ? original.initial_state : original.steps[original.steps.length - 1].world_state;
    const null_mode = execution_mode==="WITHOUT_AGENT";
    const proof = replay_continuity_proof({records: original.steps, events: original.events, final_state: end}, context, null_mode);
    if (!proof || (original.termination_reason === "AGENT_CONTRACT_ERROR" ? proof.termination !== null : original.termination_reason !== proof.termination)) return null;
    return context;
}
function validate_replay(original, rr, world_config, execution_mode) {
    // JS envelope and reason strings are engineering diagnostics, not recovered
    // normative error-message categories. Metadata is deliberately opaque.
    const mismatch = reason => ({status: "MISMATCH", reason});
    try {
        const context = replay_original_context(original, world_config, execution_mode);
        if (!context) return mismatch("invalid original trajectory");
        if (!validate_ReplayResult(rr, context)) return mismatch("invalid ReplayResult");
        if (rr.status !== "OK") return mismatch("replay status is not OK");
        if (rr.expected_steps_used !== original.steps.length || rr.records.length !== original.steps.length) return mismatch("step count mismatch");
        if (!replay_values_equal(rr.records, original.steps)) return mismatch("StepRecord mismatch");
        const final_state = original.steps.length === 0 ? original.initial_state : original.steps[original.steps.length - 1].world_state;
        if (!replay_values_equal(rr.final_state, final_state)) return mismatch("final state mismatch");
        if (!replay_values_equal(rr.events, original.events)) return mismatch("events mismatch");
        const termination = derive_termination_reason(rr);
        if (termination === "INDETERMINATE" || termination !== original.termination_reason) return mismatch("termination mismatch");
        return {status: "MATCH"};
    } catch (error) { return mismatch("invalid validation input"); }
}
