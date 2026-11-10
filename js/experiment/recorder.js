// F3-E: transactional initial/step recording with verified WLS1 hashes.
// Requires F3-A validators/termination and interface projection helpers.
const RECORD_TRANSACTION_FIELDS = Object.freeze([
    "initial_state", "steps", "events", "sequence_counter",
    "_initial_lifecycle_recorded", "initialization_failure", "termination_reason"
]);
const STEP_RECORD_FIELDS = Object.freeze([
    "tick", "world_state", "observation", "feedback", "action", "action_result",
    "action_events", "lifecycle_events", "state_hash_world", "state_hash_full", "entity_states"
]);
const RECORDER_MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
function recording_require(condition) {
    if (!condition) throw new ContractError("recording failed");
}
function recorder_safe_number(value) {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function recorder_sequence_after(sequence) {
    recording_require(recorder_safe_number(sequence));
    const next = BigInt(sequence) + 1n;
    return next <= RECORDER_MAX_SAFE ? Number(next) : next;
}
function recorder_tick(value) {
    // Explicit lossless boundary conversion, never a reduction of F3A-P01.
    recording_require(is_uint64(value) && BigInt(value) <= RECORDER_MAX_SAFE);
    return Number(value);
}
function recorder_copy_event(event) {
    recording_require(validate_RecordedEvent(event));
    return {type: event.type, entity_id: event.entity_id,
        position: {x: event.position.x, y: event.position.y},
        tick: event.tick, source: event.source, sequence: event.sequence};
}
function validate_RecordedEvent(event) {
    return has_exact_fields(event, ["type", "entity_id", "position", "tick", "source", "sequence"]) &&
        recorder_safe_number(event.tick) && recorder_safe_number(event.sequence) &&
        (event.source === "action" ? ["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"].includes(event.type) :
            event.source === "lifecycle" && event.type === "ENTITY_DIED") &&
        is_unicode_string(event.entity_id) && event.entity_id.length > 0 &&
        has_exact_fields(event.position, ["x", "y"]) && Number.isSafeInteger(event.position.x) && event.position.x >= 0 &&
        Number.isSafeInteger(event.position.y) && event.position.y >= 0;
}
function recorder_config_record(config) {
    const captured = new ExperimentConfig(config);
    return {experiment_seed: captured.experiment_seed, max_ticks: captured.max_ticks,
        world_config: {...captured.world_config}, feedback_config: {...captured.feedback_config}, agent_type: captured.agent_type};
}
function recorder_copy_failure(failure) {
    return {...failure, experiment_config: recorder_config_record(failure.experiment_config)};
}
class RecordTransaction {
    constructor(recorder) { this.recorder = recorder; }
    _publish(key, value) { this.recorder[key] = value; }
    commit(prepare, validate) {
        const before = {};
        let captured = false;
        try {
            for (const key of RECORD_TRANSACTION_FIELDS) {
                const descriptor = Object.getOwnPropertyDescriptor(this.recorder, key);
                recording_require(descriptor && Object.hasOwn(descriptor, "value") && descriptor.writable === true);
                before[key] = descriptor.value;
            }
            captured = true;
            const prepared = prepare(); // pure preparation: owned arrays are never modified in place
            recording_require(has_exact_fields(prepared, RECORD_TRANSACTION_FIELDS));
            validate(prepared);
            for (const key of RECORD_TRANSACTION_FIELDS) this._publish(key, prepared[key]);
        } catch (error) {
            if (captured) for (const key of RECORD_TRANSACTION_FIELDS) this.recorder[key] = before[key];
            throw new ContractError("recording failed");
        }
    }
}
class Recorder {
    constructor(experiment_config) {
        Object.defineProperty(this, "experiment_config", {
            value: new ExperimentConfig(experiment_config), enumerable: true
        });
        this.initial_state = null;
        this.steps = [];
        this.events = [];
        this.sequence_counter = 0;
        this._initial_lifecycle_recorded = false;
        this.initialization_failure = null; // §20.5 data, outside Trajectory
        this.termination_reason = "MAX_TICKS_REACHED";
    }
    _prepare_current() {
        return {initial_state: this.initial_state, steps: this.steps.slice(),
            events: this.events.map(recorder_copy_event), sequence_counter: this.sequence_counter,
            _initial_lifecycle_recorded: this._initial_lifecycle_recorded,
            initialization_failure: this.initialization_failure === null ? null : recorder_copy_failure(this.initialization_failure),
            termination_reason: this.termination_reason};
    }
    _validate_prepared(prepared) {
        recording_require(Array.isArray(prepared.steps) && Array.isArray(prepared.events));
        recording_require(["MAX_TICKS_REACHED", "ENTITY_DIED", "AGENT_CONTRACT_ERROR"].includes(prepared.termination_reason));
        recording_require(typeof prepared._initial_lifecycle_recorded === "boolean");
        if (prepared.initialization_failure !== null) {
            const failure = prepared.initialization_failure;
            recording_require(has_exact_fields(failure, ["seed", "reason", "message", "experiment_config"]) &&
                is_uint32(failure.seed) && failure.seed !== 0 && failure.reason === "invalid initial_position" &&
                typeof failure.message === "string" && validate_ExperimentConfig(failure.experiment_config));
            recording_require(prepared.initial_state === null && prepared.steps.length === 0 && prepared.events.length === 0 &&
                prepared.sequence_counter === 0 && !prepared._initial_lifecycle_recorded);
        } else if (prepared.initial_state === null) {
            recording_require(prepared.steps.length === 0 && prepared.events.length === 0 && prepared.sequence_counter === 0 && !prepared._initial_lifecycle_recorded);
        } else {
            const state = prepared.initial_state;
            recording_require(state instanceof WorldState && validate_WorldState(state, this.experiment_config.world_config) &&
                (state.time === 0 || state.time === 0n));
            if (!prepared._initial_lifecycle_recorded) {
                recording_require(prepared.steps.length === 0 && prepared.events.length === 0 && prepared.sequence_counter === 0);
            } else {
                const initial_count = state.entities.values().next().value.lifecycle === "DEAD" ? 1 : 0;
                this._validate_initial_recorded(state, prepared.events.slice(0, initial_count));
                let sequence = BigInt(initial_count), previous = state;
                const all = prepared.events.slice(0, initial_count);
                for (let i = 0; i < prepared.steps.length; i++) {
                    const step = feedback_array_item(prepared.steps, i);
                    sequence = this._validate_step(step, previous, sequence, i === 0 ? null : prepared.steps[i - 1].action_result);
                    all.push(...step.action_events, ...step.lifecycle_events);
                    previous = step.world_state;
                }
                recording_require(is_uint64(prepared.sequence_counter) && BigInt(prepared.sequence_counter) === sequence &&
                    prepared.events.length === all.length && all.every((event, i) => this._events_equal(event, feedback_array_item(prepared.events, i))));
                if (prepared.termination_reason !== "MAX_TICKS_REACHED") recording_require(
                    prepared.termination_reason === "AGENT_CONTRACT_ERROR" ? this._termination(previous) === null :
                        this._termination(previous) === prepared.termination_reason);
            }
        }
    }
    _validate_initial_recorded(state, events) {
        recording_require(Array.isArray(events));
        const raw = [];
        for (let i = 0; i < events.length; i++) {
            const event = feedback_array_item(events, i);
            recording_require(validate_RecordedEvent(event) && event.tick === 0 && event.source === "lifecycle" &&
                (i === 0 ? event.sequence === 0 : event.sequence > events[i - 1].sequence));
            raw.push({type: event.type, entity_id: event.entity_id, position: event.position});
        }
        validate_initial_events_consistency(state, raw); // exactly [] or one matching death
    }
    _record(prepare) {
        new RecordTransaction(this).commit(prepare, prepared => this._validate_prepared(prepared));
    }
    _require_initial_open() {
        recording_require(this.initial_state !== null && this.initialization_failure === null &&
            !this._initial_lifecycle_recorded && this.steps.length === 0 && this.events.length === 0 && this.sequence_counter === 0);
    }
    record_initial_state(world_state) {
        this._record(() => {
            recording_require(this.initial_state === null && this.initialization_failure === null &&
                this.events.length === 0 && this.steps.length === 0 && this.sequence_counter === 0 && !this._initial_lifecycle_recorded);
            recording_require(world_state instanceof WorldState && validate_WorldState(world_state, this.experiment_config.world_config) &&
                (world_state.time === 0 || world_state.time === 0n));
            const prepared = this._prepare_current();
            prepared.initial_state = world_state.full_snapshot();
            return prepared;
        });
    }
    _prepare_events(raw, tick, source, start = this.sequence_counter) {
        recording_require(Array.isArray(raw) && (source === "action" || source === "lifecycle") && is_uint64(start));
        const recorded_tick = recorder_tick(tick);
        const next = BigInt(start) + BigInt(raw.length);
        if (raw.length > 0) recording_require(next - 1n <= RECORDER_MAX_SAFE);
        const events = [];
        for (let i = 0; i < raw.length; i++) {
            const event = feedback_array_item(raw, i);
            recording_require(has_exact_fields(event, ["type", "entity_id", "position"]));
            const recorded = {type: event.type, entity_id: event.entity_id,
                position: feedback_copy_position(event.position), tick: recorded_tick, source,
                sequence: Number(BigInt(start) + BigInt(i))}; // the only enrichment/sequence assignment point
            recording_require(validate_RecordedEvent(recorded));
            events.push(recorded);
        }
        recording_require(events.length === raw.length && events.every(validate_RecordedEvent));
        return {events, sequence_counter: next <= RECORDER_MAX_SAFE ? Number(next) : next};
    }
    record_initial_lifecycle_from_world(initial_events) {
        this._record(() => {
            this._require_initial_open();
            validate_initial_events_consistency(this.initial_state, initial_events);
            const prepared = this._prepare_current();
            const enriched = this._prepare_events(initial_events, 0, "lifecycle");
            prepared.events = enriched.events;
            prepared.sequence_counter = enriched.sequence_counter;
            prepared._initial_lifecycle_recorded = true;
            return prepared;
        });
    }
    record_initial_lifecycle_from_recorded(initial_events) {
        this._record(() => {
            this._require_initial_open();
            this._validate_initial_recorded(this.initial_state, initial_events);
            const prepared = this._prepare_current();
            prepared.events = [];
            for (let i = 0; i < initial_events.length; i++) prepared.events.push(recorder_copy_event(feedback_array_item(initial_events, i)));
            prepared.sequence_counter = prepared.events.length === 0 ? 0 : recorder_sequence_after(prepared.events[prepared.events.length - 1].sequence);
            prepared._initial_lifecycle_recorded = true;
            return prepared;
        });
    }
    record_initialization_failure(error, config = this.experiment_config) {
        let returned;
        this._record(() => {
            recording_require(this.initial_state === null && this.initialization_failure === null &&
                this.steps.length === 0 && this.events.length === 0 && this.sequence_counter === 0);
            ExperimentConfig._validate(config);
            recording_require(error instanceof InitializationError && is_uint32(error.seed) && error.seed !== 0 &&
                error.reason === "invalid initial_position" && typeof error.message === "string");
            const prepared = this._prepare_current();
            prepared.initialization_failure = {seed: error.seed, reason: error.reason, message: error.message,
                experiment_config: recorder_config_record(config)};
            returned = recorder_copy_failure(prepared.initialization_failure);
            return prepared;
        });
        return returned;
    }
    _copy_feedback(feedback, observation) {
        recording_require(has_exact_fields(feedback, ["observation", "has_prior_action", "last_action_result"]) &&
            typeof feedback.has_prior_action === "boolean");
        const copied_observation = feedback_copy_observation(feedback.observation);
        // Values contain uint64 BigInt; avoid JSON serialization/comparison.
        recording_require(BigInt(copied_observation.tick) === BigInt(observation.tick) &&
            copied_observation.self.id === observation.self.id && Object.is(copied_observation.self.energy, observation.self.energy) &&
            copied_observation.self.position.x === observation.self.position.x && copied_observation.self.position.y === observation.self.position.y &&
            copied_observation.local_view.length === observation.local_view.length &&
            copied_observation.local_view.every((row, y) => row.every((cell, x) =>
                cell.representation === observation.local_view[y][x].representation && cell.occupied === observation.local_view[y][x].occupied)));
        let prior = null;
        if (feedback.has_prior_action) {
            const value = feedback.last_action_result, flags = this.experiment_config.feedback_config;
            recording_require(has_exact_fields(value, ["validity", "reason", "energy_delta", "events"]));
            recording_require(flags.expose_validity ? Object.values(ActionResultValidity).includes(value.validity) : value.validity === null);
            recording_require(flags.expose_reason ? Object.values(ActionResultReason).includes(value.reason) : value.reason === null);
            recording_require(Number.isFinite(value.energy_delta) && (flags.expose_energy_delta || Object.is(value.energy_delta, 0)));
            recording_require(tick_valid_events(value.events, ["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"]) &&
                (flags.expose_events || value.events.length === 0));
            prior = {validity: value.validity, reason: value.reason, energy_delta: value.energy_delta, events: tick_copy_events(value.events)};
        } else recording_require(feedback.last_action_result === null);
        return {observation: copied_observation, has_prior_action: feedback.has_prior_action, last_action_result: prior};
    }
    _prepare_step(confirmed, observation, feedback, action) {
        // Pure staging wrapper; record_step adds WLS1 hashes before transactional publication.
        this._validate_prepared(this._prepare_current());
        recording_require(this.initial_state !== null && this._initial_lifecycle_recorded && this.initialization_failure === null);
        recording_require(has_exact_fields(confirmed, ["tick", "world_state", "action_result", "action_events", "lifecycle_events", "termination"]));
        const previous = this.steps.length === 0 ? this.initial_state : this.steps[this.steps.length - 1].world_state;
        recording_require(this.termination_reason !== "AGENT_CONTRACT_ERROR" && this._termination(previous) === null);
        const tick = recorder_tick(confirmed.tick), config = this.experiment_config;
        recording_require(confirmed.world_state instanceof WorldState && validate_WorldState(confirmed.world_state, config.world_config) &&
            BigInt(confirmed.world_state.time) === BigInt(tick) && BigInt(tick) === BigInt(previous.time) + 1n &&
            BigInt(tick) <= BigInt(config.max_ticks));
        recording_require(validate_TickResult({action_result: confirmed.action_result, action_events: confirmed.action_events,
            lifecycle_events: confirmed.lifecycle_events}) && [null, "ENTITY_DIED", "MAX_TICKS_REACHED"].includes(confirmed.termination));
        recording_require((observation === null) === (feedback === null));
        assert_Action_structural(action);
        recording_require(Object.hasOwn(ActionType, action.type));
        if (observation === null) recording_require(action.type === "WAIT" && confirmed.action_events.length === 0);
        const prior_entity = previous.entities.values().next().value;
        recording_require(prior_entity.lifecycle === "ACTIVE");
        const snapshot = confirmed.world_state.full_snapshot();
        const entity = snapshot.entities.values().next().value;
        recording_require(entity.id === prior_entity.id && confirmed.termination === this._termination(snapshot));
        recording_require(entity.lifecycle === "DEAD" ? confirmed.lifecycle_events.length === 1 : confirmed.lifecycle_events.length === 0);
        for (const event of [...confirmed.action_events, ...confirmed.lifecycle_events]) recording_require(event.entity_id === entity.id &&
            event.position.x === entity.position.x && event.position.y === entity.position.y);
        const copied_observation = observation === null ? null : feedback_copy_observation(observation);
        if (copied_observation !== null) recording_require(BigInt(copied_observation.tick) === BigInt(tick) - 1n);
        const copied_feedback = feedback === null ? null : this._copy_feedback(feedback, copied_observation);
        this._validate_context(copied_observation, copied_feedback, action, previous,
            this.steps.length === 0 ? null : this.steps[this.steps.length - 1].action_result);
        const action_events = this._prepare_events(confirmed.action_events, tick, "action");
        const lifecycle_events = this._prepare_events(confirmed.lifecycle_events, tick, "lifecycle", action_events.sequence_counter);
        const entity_states = new Map();
        for (const [id, value] of snapshot.entities) entity_states.set(id, {id: value.id,
            position: {x: value.position.x, y: value.position.y}, energy: value.energy, lifecycle: value.lifecycle});
        return {tick, snapshot, context: {observation: copied_observation, feedback: copied_feedback,
            action: {type: action.type}, action_result: tick_copy_action_result(confirmed.action_result)},
            action_events: action_events.events, lifecycle_events: lifecycle_events.events,
            entity_states, sequence_after: lifecycle_events.sequence_counter};
    }
    _termination(state) {
        return determine_termination({state, config: this.experiment_config.world_config,
            experimental_entity_id: state.entities.keys().next().value}, this.experiment_config.max_ticks);
    }
    _events_equal(a, b) {
        return validate_RecordedEvent(a) && validate_RecordedEvent(b) && a.type === b.type &&
            a.entity_id === b.entity_id && a.tick === b.tick && a.source === b.source && a.sequence === b.sequence &&
            a.position.x === b.position.x && a.position.y === b.position.y;
    }
    _validate_context(observation, feedback, action, previous, prior_result) {
        assert_Action_structural(action);
        recording_require(Object.hasOwn(ActionType, action.type) && (observation === null) === (feedback === null));
        if (observation === null) { recording_require(action.type === "WAIT"); return; }
        const copied = feedback_copy_observation(observation), entity = previous.entities.values().next().value;
        recording_require(BigInt(copied.tick) === BigInt(previous.time) && copied.self.id === entity.id &&
            copied.self.position.x === entity.position.x && copied.self.position.y === entity.position.y &&
            Object.is(copied.self.energy, entity.energy));
        const projected = this._copy_feedback(feedback, copied);
        const expected = build_feedback(copied, prior_result, this.experiment_config.feedback_config);
        recording_require(projected.has_prior_action === expected.has_prior_action);
        if (projected.has_prior_action) {
            const a = projected.last_action_result, b = expected.last_action_result;
            recording_require(a.validity === b.validity && a.reason === b.reason && Object.is(a.energy_delta, b.energy_delta) &&
                tick_events_equal(a.events, b.events));
        }
    }
    _validate_step(step, previous, sequence, prior_result) {
        recording_require(has_exact_fields(step, STEP_RECORD_FIELDS) && recorder_safe_number(step.tick) &&
            step.world_state instanceof WorldState && validate_WorldState(step.world_state, this.experiment_config.world_config) &&
            BigInt(step.tick) === BigInt(previous.time) + 1n && BigInt(step.world_state.time) === BigInt(step.tick) &&
            BigInt(step.tick) <= BigInt(this.experiment_config.max_ticks) && this._termination(previous) === null);
        const entity = step.world_state.entities.values().next().value;
        recording_require(entity.id === previous.entities.values().next().value.id);
        this._validate_context(step.observation, step.feedback, step.action, previous, prior_result);
        const raw = list => {
            recording_require(Array.isArray(list));
            const result = [];
            for (let i = 0; i < list.length; i++) {
                const event = feedback_array_item(list, i);
                recording_require(validate_RecordedEvent(event));
                result.push({type: event.type, entity_id: event.entity_id, position: event.position});
            }
            return result;
        };
        recording_require(validate_TickResult({action_result: step.action_result, action_events: raw(step.action_events),
            lifecycle_events: raw(step.lifecycle_events)}));
        recording_require(entity.lifecycle === "DEAD" ? step.lifecycle_events.length === 1 : step.lifecycle_events.length === 0);
        if (step.observation === null) recording_require(step.action_events.length === 0);
        for (const [source, list] of [["action", step.action_events], ["lifecycle", step.lifecycle_events]]) {
            for (let i = 0; i < list.length; i++) {
                const event = feedback_array_item(list, i);
                recording_require(validate_RecordedEvent(event) && event.tick === step.tick && event.source === source &&
                    BigInt(event.sequence) === sequence && event.entity_id === entity.id &&
                    event.position.x === entity.position.x && event.position.y === entity.position.y);
                sequence++;
            }
        }
        recording_require(step.entity_states instanceof Map && step.entity_states.size === 1);
        const saved = step.entity_states.get(entity.id);
        recording_require(has_exact_fields(saved, ["id", "position", "energy", "lifecycle"]) && saved.id === entity.id &&
            has_exact_fields(saved.position, ["x", "y"]) && saved.position.x === entity.position.x && saved.position.y === entity.position.y &&
            Object.is(saved.energy, entity.energy) && saved.lifecycle === entity.lifecycle);
        recording_require(is_uint32(step.state_hash_world) && is_uint32(step.state_hash_full) &&
            step.state_hash_world === STATE_HASH_WORLD(step.world_state) && step.state_hash_full === STATE_HASH_FULL(step.world_state));
        return sequence;
    }
    _copy_step(step) {
        return {tick: step.tick, world_state: step.world_state.full_snapshot(),
            observation: step.observation === null ? null : feedback_copy_observation(step.observation),
            feedback: step.feedback === null ? null : this._copy_feedback(step.feedback, step.observation),
            action: {type: step.action.type}, action_result: tick_copy_action_result(step.action_result),
            action_events: step.action_events.map(recorder_copy_event), lifecycle_events: step.lifecycle_events.map(recorder_copy_event),
            state_hash_world: step.state_hash_world, state_hash_full: step.state_hash_full,
            entity_states: new Map(Array.from(step.entity_states, ([id, value]) => [id, {id: value.id,
                position: {x: value.position.x, y: value.position.y}, energy: value.energy, lifecycle: value.lifecycle}]))};
    }
    record_step(confirmed, observation, feedback, action) {
        this._record(() => {
            const input = this._prepare_step(confirmed, observation, feedback, action);
            const step = {tick: input.tick, world_state: input.snapshot, observation: input.context.observation,
                feedback: input.context.feedback, action: input.context.action, action_result: input.context.action_result,
                action_events: input.action_events, lifecycle_events: input.lifecycle_events,
                state_hash_world: STATE_HASH_WORLD(input.snapshot), state_hash_full: STATE_HASH_FULL(input.snapshot),
                entity_states: input.entity_states};
            const prepared = this._prepare_current();
            prepared.steps.push(step);
            prepared.events.push(...step.action_events.map(recorder_copy_event), ...step.lifecycle_events.map(recorder_copy_event));
            prepared.sequence_counter = input.sequence_after;
            prepared.termination_reason = confirmed.termination === null ? this.termination_reason : confirmed.termination;
            return prepared;
        });
    }
    record_death_event_if_needed() { throw new ContractError("recording failed"); }
    set_termination_reason(reason) {
        this._record(() => {
            const prepared = this._prepare_current();
            const state = prepared.steps.length === 0 ? prepared.initial_state : prepared.steps[prepared.steps.length - 1].world_state;
            recording_require(state !== null && (reason === "AGENT_CONTRACT_ERROR" ? this._termination(state) === null : reason === this._termination(state)));
            prepared.termination_reason = reason; return prepared;
        });
    }
    finalize() {
        try {
            this._validate_prepared(this._prepare_current());
            recording_require(this.initial_state !== null && this.initialization_failure === null && this._initial_lifecycle_recorded);
            const last = this.steps.length === 0 ? this.initial_state : this.steps[this.steps.length - 1].world_state;
            recording_require(this.termination_reason === "AGENT_CONTRACT_ERROR" || this.termination_reason === this._termination(last));
            return new Trajectory(recorder_config_record(this.experiment_config), this.initial_state.full_snapshot(), this.steps.map(step => this._copy_step(step)),
                this.events.map(recorder_copy_event), this.termination_reason, {version: "v0.1"});
        } catch (error) { throw new ContractError("recording failed"); }
    }
}
