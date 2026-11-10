// F3-C GO partial: initial recording and pure step preparation. Full StepRecord
// publication is blocked on verified WLS1 hashes; no legacy or placeholder hashes.
const RECORD_TRANSACTION_FIELDS = Object.freeze([
    "initial_state", "steps", "events", "sequence_counter",
    "_initial_lifecycle_recorded", "initialization_failure", "termination_reason"
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
        // This increment publishes initial records only, never a partial StepRecord.
        recording_require(Array.isArray(prepared.steps) && prepared.steps.length === 0 && Array.isArray(prepared.events));
        recording_require(["MAX_TICKS_REACHED", "ENTITY_DIED", "AGENT_CONTRACT_ERROR"].includes(prepared.termination_reason));
        recording_require(typeof prepared._initial_lifecycle_recorded === "boolean");
        if (prepared.initialization_failure !== null) {
            const failure = prepared.initialization_failure;
            recording_require(has_exact_fields(failure, ["seed", "reason", "message", "experiment_config"]) &&
                is_uint32(failure.seed) && failure.seed !== 0 && failure.reason === "invalid initial_position" &&
                typeof failure.message === "string" && validate_ExperimentConfig(failure.experiment_config));
            recording_require(prepared.initial_state === null && prepared.events.length === 0 &&
                prepared.sequence_counter === 0 && !prepared._initial_lifecycle_recorded);
        } else if (prepared.initial_state === null) {
            recording_require(prepared.events.length === 0 && prepared.sequence_counter === 0 && !prepared._initial_lifecycle_recorded);
        } else {
            const state = prepared.initial_state;
            recording_require(state instanceof WorldState && validate_WorldState(state, this.experiment_config.world_config) &&
                (state.time === 0 || state.time === 0n));
            if (!prepared._initial_lifecycle_recorded) {
                recording_require(prepared.events.length === 0 && prepared.sequence_counter === 0);
            } else {
                this._validate_initial_recorded(state, prepared.events);
                recording_require(prepared.sequence_counter === prepared.events.length); // []→0; one initial death→1
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
        // Internal preparation only: the wrapper is NOT a StepRecord and has no hashes.
        this._validate_prepared(this._prepare_current());
        recording_require(this.initial_state !== null && this._initial_lifecycle_recorded && this.initialization_failure === null);
        recording_require(has_exact_fields(confirmed, ["tick", "world_state", "action_result", "action_events", "lifecycle_events", "termination"]));
        const tick = recorder_tick(confirmed.tick), config = this.experiment_config;
        recording_require(confirmed.world_state instanceof WorldState && validate_WorldState(confirmed.world_state, config.world_config) &&
            BigInt(confirmed.world_state.time) === BigInt(tick) && BigInt(tick) === BigInt(this.initial_state.time) + 1n &&
            BigInt(tick) <= BigInt(config.max_ticks));
        recording_require(validate_TickResult({action_result: confirmed.action_result, action_events: confirmed.action_events,
            lifecycle_events: confirmed.lifecycle_events}) && [null, "ENTITY_DIED", "MAX_TICKS_REACHED"].includes(confirmed.termination));
        recording_require((observation === null) === (feedback === null));
        assert_Action_structural(action);
        recording_require(Object.hasOwn(ActionType, action.type));
        if (observation === null) recording_require(action.type === "WAIT" && confirmed.action_events.length === 0);
        const prior_entity = this.initial_state.entities.values().next().value;
        recording_require(prior_entity.lifecycle === "ACTIVE");
        const snapshot = confirmed.world_state.full_snapshot();
        const entity = snapshot.entities.values().next().value;
        recording_require(entity.lifecycle === "DEAD" ? confirmed.lifecycle_events.length === 1 : confirmed.lifecycle_events.length === 0);
        for (const event of [...confirmed.action_events, ...confirmed.lifecycle_events]) recording_require(event.entity_id === entity.id &&
            event.position.x === entity.position.x && event.position.y === entity.position.y);
        const copied_observation = observation === null ? null : feedback_copy_observation(observation);
        if (copied_observation !== null) recording_require(BigInt(copied_observation.tick) === BigInt(tick) - 1n);
        const copied_feedback = feedback === null ? null : this._copy_feedback(feedback, copied_observation);
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
    record_step(confirmed, observation, feedback, action) {
        try { this._prepare_step(confirmed, observation, feedback, action); }
        catch (error) { throw new ContractError("recording failed"); }
        // B is blocked on verified WLS1 hashes. Never publish an incomplete StepRecord.
        throw new ContractError("recording failed");
    }
    record_death_event_if_needed() { throw new ContractError("recording failed"); }
    set_termination_reason(reason) {
        this._record(() => { const prepared = this._prepare_current(); prepared.termination_reason = reason; return prepared; });
    }
    finalize() {
        try {
            this._validate_prepared(this._prepare_current());
            recording_require(this.initial_state !== null && this.initialization_failure === null && this._initial_lifecycle_recorded);
            return new Trajectory(recorder_config_record(this.experiment_config), this.initial_state.full_snapshot(), [],
                this.events.map(recorder_copy_event), this.termination_reason, {version: "v0.1"});
        } catch (error) { throw new ContractError("recording failed"); }
    }
}
