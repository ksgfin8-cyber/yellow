// F3-A: standalone kernel. Load after WORLD, Action and ActionResult scripts.
// F3A-P01/02/03 are authorized engineering decisions, not historical schemas.
const TICK_MAX_UINT64 = (1n << 64n) - 1n;
function tick_require(condition) {
    if (!condition) throw new ContractError("world transition failed");
}
function tick_max_ticks(value) {
    if (!is_uint64(value)) throw new ContractError("invalid max_ticks");
    return typeof value === "bigint" ? value : BigInt(value);
}
function tick_assert_world(world) {
    if (world === null || typeof world !== "object") throw new ContractError("invalid initial_state");
    WorldConfig._validate(world.config);
    assert_WorldState(world.state, world.config);
    const entity = world.state.entities.get(world.experimental_entity_id);
    if (!entity) throw new ContractError("invalid initial_state");
    return entity;
}
function determine_termination(world, max_ticks) {
    const limit = tick_max_ticks(max_ticks);
    const entity = tick_assert_world(world);
    if (entity.lifecycle === "DEAD") return "ENTITY_DIED";
    if (BigInt(world.state.time) >= limit) return "MAX_TICKS_REACHED";
    return null;
}
function tick_exact_increment(time) {
    tick_require(is_uint64(time));
    const next = BigInt(time) + 1n;
    tick_require(next <= TICK_MAX_UINT64);
    // Explicit representation policy: retain Number while safe, otherwise promote.
    return typeof time === "number" && next <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(next) : next;
}
function tick_valid_events(events, types) {
    if (!Array.isArray(events)) return false;
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (!has_exact_fields(event, ["type", "entity_id", "position"]) || !types.includes(event.type) ||
            !is_unicode_string(event.entity_id) || event.entity_id.length === 0 ||
            !has_exact_fields(event.position, ["x", "y"]) ||
            !Number.isSafeInteger(event.position.x) || event.position.x < 0 ||
            !Number.isSafeInteger(event.position.y) || event.position.y < 0) return false;
    }
    return true;
}
function tick_events_equal(a, b) {
    return a.length === b.length && a.every((event, i) => event.type === b[i].type &&
        event.entity_id === b[i].entity_id && event.position.x === b[i].position.x && event.position.y === b[i].position.y);
}
function tick_copy_events(events) {
    return events.map(event => ({type: event.type, entity_id: event.entity_id,
        position: {x: event.position.x, y: event.position.y}}));
}
function tick_valid_action_result(result) {
    return has_exact_fields(result, ["validity", "reason", "energy_delta", "events"]) &&
        Object.values(ActionResultValidity).includes(result.validity) &&
        Object.values(ActionResultReason).includes(result.reason) && Number.isFinite(result.energy_delta) &&
        tick_valid_events(result.events, ["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"]);
}
function tick_copy_action_result(result) {
    return {validity: result.validity, reason: result.reason, energy_delta: result.energy_delta,
        events: tick_copy_events(result.events)};
}
function validate_TickResult(result) {
    return has_exact_fields(result, ["action_result", "action_events", "lifecycle_events"]) &&
        tick_valid_action_result(result.action_result) &&
        tick_valid_events(result.action_events, ["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"]) &&
        tick_valid_events(result.lifecycle_events, ["ENTITY_DIED"]) && result.lifecycle_events.length <= 1 &&
        tick_events_equal(result.action_events, result.action_result.events);
}
function execute_tick(world, action) {
    tick_assert_world(world);
    const action_result = world.apply_action(action);
    const lifecycle_events = world.resolve_lifecycle();
    world.advance_dynamics();
    tick_require(tick_valid_action_result(action_result) && tick_valid_events(lifecycle_events, ["ENTITY_DIED"]));
    const result = {action_result: tick_copy_action_result(action_result),
        action_events: tick_copy_events(action_result.events), lifecycle_events: tick_copy_events(lifecycle_events)};
    tick_require(validate_TickResult(result));
    return result; // no temporal commit, RNG access or global rollback here
}
// Both states are already structurally validated against the same configuration.
function tick_snapshot_matches(a, b) {
    if (a === b || a.entities === b.entities || a.grid === b.grid) return false;
    if (BigInt(a.time) !== BigInt(b.time) || a.rng_state !== b.rng_state) return false;
    for (const [id, entity] of a.entities) {
        const other = b.entities.get(id);
        if (!other || entity === other || entity.position === other.position || entity.id !== other.id || entity.lifecycle !== other.lifecycle ||
            !Object.is(entity.energy, other.energy) || entity.position.x !== other.position.x ||
            entity.position.y !== other.position.y) return false;
    }
    for (let y = 0; y < a.grid.length; y++) for (let x = 0; x < a.grid[y].length; x++) {
        const left = a.grid[y][x], right = b.grid[y][x];
        if (a.grid[y] === b.grid[y] || left === right ||
            (left.effect !== null && left.effect === right.effect) || left.traversal !== right.traversal || (left.effect === null) !== (right.effect === null)) return false;
        if (left.effect !== null && (left.effect.kind !== right.effect.kind || left.effect.stock !== right.effect.stock)) return false;
    }
    return true;
}
function tick_lifecycle_matches(events, world) {
    const entity = world.state.entities.get(world.experimental_entity_id);
    if (entity.lifecycle === "ACTIVE") return events.length === 0;
    return events.length === 1 && events[0].entity_id === entity.id &&
        events[0].position.x === entity.position.x && events[0].position.y === entity.position.y;
}
function validate_ConfirmedTickResult(result, world, expected_termination) {
    return has_exact_fields(result, ["tick", "world_state", "action_result", "action_events", "lifecycle_events", "termination"]) &&
        is_uint64(result.tick) && validate_WorldState(result.world_state, world.config) &&
        BigInt(result.tick) === BigInt(result.world_state.time) &&
        validate_TickResult({action_result: result.action_result, action_events: result.action_events,
            lifecycle_events: result.lifecycle_events}) && tick_lifecycle_matches(result.lifecycle_events, world) &&
        [null, "ENTITY_DIED", "MAX_TICKS_REACHED"].includes(result.termination) &&
        result.termination === expected_termination && tick_snapshot_matches(result.world_state, world.state) &&
        result.world_state.rng_state === world.rng.get_state();
}
function tick_writable_data(record, key) {
    const descriptor = Object.getOwnPropertyDescriptor(record, key);
    return descriptor !== undefined && Object.hasOwn(descriptor, "value") && descriptor.writable === true;
}
function execute_tick_transaction(world, action, max_ticks) {
    tick_max_ticks(max_ticks); // keep invalid max_ticks outside transition normalization
    tick_assert_world(world); // keep configuration/state input diagnostics
    tick_require(determine_termination(world, max_ticks) === null);
    const t_before = world.state.time;
    const next_time = tick_exact_increment(t_before);
    // A native PRNG and writable restoration slots are required before any action.
    tick_require(world.state instanceof WorldState && tick_writable_data(world, "state") &&
        tick_writable_data(world, "rng") && tick_writable_data(world.state, "time"));
    const rng = world.rng;
    tick_require(rng instanceof PRNG && tick_writable_data(rng, "state") && is_uint32(rng.state) && rng.state !== 0);
    const restore_rng = PRNG.prototype.set_state.bind(rng);
    let state_before, rng_before;
    try {
        state_before = world.state.full_snapshot();
        rng_before = rng.get_state();
        tick_require(is_uint32(rng_before) && rng_before !== 0 && rng_before === rng.state);
    } catch (error) {
        throw new ContractError("world transition failed"); // no mutation has started
    }
    try {
        const tick_result = execute_tick(world, action);
        tick_require(Object.is(world.state.time, t_before));
        world.state.time = next_time;
        tick_require(world.rng === rng);
        world.sync_rng_state(); // only temporal commit point
        assert_WorldState(world.state, world.config);
        tick_require(Object.is(world.state.time, next_time));
        const termination = determine_termination(world, max_ticks);
        const result = {tick: world.state.time, world_state: world.full_snapshot(),
            action_result: tick_copy_action_result(tick_result.action_result),
            action_events: tick_copy_events(tick_result.action_events),
            lifecycle_events: tick_copy_events(tick_result.lifecycle_events), termination};
        tick_require(validate_ConfirmedTickResult(result, world, termination));
        return result;
    } catch (error) {
        world.state = state_before;
        world.rng = rng;
        restore_rng(rng_before);
        throw new ContractError("world transition failed");
    }
}
