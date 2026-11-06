// WORLD-LAB §17, four-flag contract recovered in the F2-I order.
const FEEDBACK_CONFIG_FIELDS = Object.freeze([
    "expose_validity", "expose_reason", "expose_events", "expose_energy_delta"
]);
function validate_FeedbackConfig(params) {
    return has_exact_fields(params, FEEDBACK_CONFIG_FIELDS) &&
        FEEDBACK_CONFIG_FIELDS.every(key => typeof params[key] === "boolean");
}
class FeedbackConfig {
    constructor(params) {
        FeedbackConfig._validate(params);
        for (const key of FEEDBACK_CONFIG_FIELDS) this[key] = params[key];
        Object.freeze(this);
    }
    static _validate(params) {
        if (!validate_FeedbackConfig(params)) throw new ContractError("invalid feedback_config");
    }
    static defaults() {
        return new FeedbackConfig({expose_validity: true, expose_reason: false,
            expose_events: false, expose_energy_delta: true});
    }
}

// Input failures use the existing catalog; no getter evaluation or coercion.
function feedback_require(condition) {
    if (!condition) throw new ContractError("world transition failed");
}
function feedback_array_item(array, index) {
    const descriptor = Object.getOwnPropertyDescriptor(array, index);
    feedback_require(descriptor !== undefined && Object.hasOwn(descriptor, "value"));
    return descriptor.value;
}
function feedback_copy_position(position) {
    feedback_require(has_exact_fields(position, ["x", "y"]));
    feedback_require(Number.isSafeInteger(position.x) && position.x >= 0 &&
        Number.isSafeInteger(position.y) && position.y >= 0);
    return {x: position.x, y: position.y};
}
function feedback_copy_observation(observation) {
    feedback_require(has_exact_fields(observation, ["tick", "self", "local_view"]));
    feedback_require(is_uint64(observation.tick));
    const self = observation.self;
    feedback_require(has_exact_fields(self, ["id", "position", "energy"]));
    feedback_require(is_unicode_string(self.id) && self.id.length > 0 && Number.isFinite(self.energy));
    const position = feedback_copy_position(self.position);
    const view = observation.local_view;
    feedback_require(Array.isArray(view) && view.length > 0 && view.length % 2 === 1);
    const local_view = [];
    const representations = Object.values(CellObservation);
    for (let y = 0; y < view.length; y++) {
        const source = feedback_array_item(view, y);
        feedback_require(Array.isArray(source) && source.length === view.length);
        const row = [];
        for (let x = 0; x < source.length; x++) {
            const cell = feedback_array_item(source, x);
            feedback_require(has_exact_fields(cell, ["representation", "occupied"]));
            feedback_require(representations.includes(cell.representation) && cell.occupied === false);
            row.push({representation: cell.representation, occupied: false});
        }
        local_view.push(row);
    }
    return {tick: observation.tick, self: {id: self.id, position, energy: self.energy}, local_view};
}
function feedback_project_action(result, config) {
    feedback_require(has_exact_fields(result, ["validity", "reason", "energy_delta", "events"]));
    feedback_require(Object.values(ActionResultValidity).includes(result.validity) &&
        Object.values(ActionResultReason).includes(result.reason) && Number.isFinite(result.energy_delta) &&
        Array.isArray(result.events));
    const events = [];
    for (let i = 0; i < result.events.length; i++) {
        const event = feedback_array_item(result.events, i);
        feedback_require(has_exact_fields(event, ["type", "entity_id", "position"]));
        feedback_require(["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"].includes(event.type) &&
            is_unicode_string(event.entity_id) && event.entity_id.length > 0);
        const position = feedback_copy_position(event.position);
        if (config.expose_events) events.push({type: event.type, entity_id: event.entity_id, position});
    }
    // FB-P01: nullable hidden labels, empty events, constant finite +0 delta.
    // This is a projection, not a new raw ActionResult or a fabricated action state.
    return {
        validity: config.expose_validity ? result.validity : null,
        reason: config.expose_reason ? result.reason : null,
        energy_delta: config.expose_energy_delta ? result.energy_delta : 0,
        events
    };
}
function build_feedback(observation, last_action_result, feedback_config) {
    FeedbackConfig._validate(feedback_config); // also required when prior action is null
    const copied = feedback_copy_observation(observation);
    const prior = last_action_result === null ? null : feedback_project_action(last_action_result, feedback_config);
    return {observation: copied, has_prior_action: last_action_result !== null, last_action_result: prior};
}
