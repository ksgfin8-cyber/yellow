'use strict';
const assert = require('node:assert/strict');
const {loadRuntime, createAgentFactory, stateBytes} = require('./runtime.cjs');
const {assertProfile} = require('./protocol.cjs');
function verifyEpisode(data, diagnosticsExpected = true) {
    assertProfile(data.config);
    const r = loadRuntime(), a = r.api, c = new a.ExperimentConfig(r.realm(data.config));
    assert.deepEqual(data.seeds, {experiment: c.experiment_seed,
        world: a.derive_seed(c.experiment_seed, 'world'), agent: a.derive_seed(c.experiment_seed, c.agent_type)});
    const result = r.realm(data.result);
    if (result.trajectory === null) {
        assert.equal(result.status, 'FAILED'); assert.equal(result.failure_reason, 'INITIALIZATION_ERROR');
        assert.throws(() => a.initialize_world(c.world_config, data.seeds.world));
        return {status: 'INITIALIZATION_FAILURE_CONFIRMED', decisions: 0};
    }
    assert.equal(result.status, 'COMPLETED', 'incomplete experiment retained, not accepted');
    const t = result.trajectory, initialized = a.initialize_world(c.world_config, data.seeds.world);
    assert.ok(a.replay_values_equal(t.initial_state, initialized.world_state), 'seed/initial world mismatch');
    assert.deepEqual([...t.initial_state.entities.keys()], ['0987898']);
    const contextEvents = t.events.filter(e => BigInt(e.tick) === 0n), actions = t.steps.map(s => s.action);
    const replay = a.replay_trajectory(t.initial_state, contextEvents, actions, c.world_config,
        c.feedback_config, actions.length, c.max_ticks, 'WITH_AGENT');
    assert.equal(replay.status, 'OK');
    assert.ok(a.validate_ReplayResult(replay, {world_config: c.world_config, feedback_config: c.feedback_config,
        initial_state: t.initial_state, initial_events: contextEvents, actions, expected_steps: actions.length,
        max_ticks: c.max_ticks, execution_mode: 'WITH_AGENT'}));
    assert.equal(a.validate_replay(t, replay, c.world_config, 'WITH_AGENT').status, 'MATCH');
    assert.ok(a.replay_values_equal(t.steps, replay.records)); assert.ok(a.replay_values_equal(t.events, replay.events));
    assert.deepEqual(data.wls1, stateBytes(a, t));
    assert.deepEqual(data.wls1, stateBytes(a, {initial_state: t.initial_state, steps: replay.records}));
    const decisions = [], factory = createAgentFactory(a, {seed: c.experiment_seed, diagnostics: decisions, code_sha256: r.code_sha256});
    const agent = factory(c.agent_type, data.seeds.agent); agent.reset();
    for (const step of t.steps) assert.ok(a.replay_values_equal(agent.step(step.feedback), step.action), 'decision from recorded feedback differs');
    if (c.agent_type === 'titan_mvp_01' && diagnosticsExpected) assert.deepEqual(structuredClone(decisions), data.decisions);
    else assert.equal(data.decisions.length, 0);
    return {status: 'COMPLETE_MATCH', states: data.wls1.length, actions: actions.length,
        decisions: c.agent_type === 'titan_mvp_01' ? decisions.length : 0,
        initial_full_hex: data.wls1[0].full_hex, same_engine_only: true};
}
module.exports = {verifyEpisode};
