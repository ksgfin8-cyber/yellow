'use strict';
// R01 v1: external research instrument. Never edit or execute from the frozen repository.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const {performance} = require('node:perf_hooks');
const DIR = __dirname, SOURCE = path.join(DIR, 'source');
const plan = JSON.parse(fs.readFileSync(path.join(DIR, 'protocol.json')));
const wire = require(path.join(SOURCE, 'conformance/wire.cjs'));
const clone = v => structuredClone(v);
const save = (name, v) => fs.writeFileSync(path.join(DIR, name), JSON.stringify(wire.encode(clone(v)), null, 2) + '\n', {flag: 'wx'});
const load = name => wire.decode(JSON.parse(fs.readFileSync(path.join(DIR, name))));
const same = (a, b) => JSON.stringify(wire.encode(clone(a))) === JSON.stringify(wire.encode(clone(b)));
const cut = plan.cut_after_committed_tick;
const config = Object.fromEntries(['experiment_seed', 'agent_type', 'max_ticks', 'world_config', 'feedback_config'].map(k => [k, plan[k]]));
function runtime() {
    const r = require(path.join(SOURCE, 'tools/p01/runtime.cjs')).loadRuntime();
    Object.assign(r.api, vm.runInContext('({RandomAgent, World, Recorder, PRNG, build_observation, build_feedback, execute_tick_transaction, determine_termination, replay_world_from_state})', r.ctx));
    r.config = new r.api.ExperimentConfig(r.realm(config));
    return r;
}
function memory(agent) {
    return {version: 'RandomAgent-source-5d40f08-adapter-v1', initial_seed: agent._initial_seed, rng_state: agent.rng.get_state()};
}
function createAgent(r) {
    return r.api.create_agent(plan.agent_type, r.api.derive_seed(plan.experiment_seed, plan.agent_type));
}
function state(r, s) {
    return new r.api.WorldState(s.time, r.realm(s.grid), r.realm(s.entities), s.rng_state, r.config.world_config);
}
const raw = events => events.map(e => ({type: e.type, entity_id: e.entity_id, position: {...e.position}}));
function confirmed(r, step) {
    const s = state(r, step.world_state);
    return {tick: step.tick, world_state: s, action_result: r.realm(step.action_result),
        action_events: r.realm(raw(step.action_events)), lifecycle_events: r.realm(raw(step.lifecycle_events)),
        termination: r.api.determine_termination({state: s, config: r.config.world_config, experimental_entity_id: s.entities.keys().next().value}, r.config.max_ticks)};
}
function importRecorder(r, cp) {
    const rec = new r.api.Recorder(r.config);
    rec.record_initial_state(state(r, cp.initial_state));
    rec.record_initial_lifecycle_from_recorded(r.realm(cp.initial_events));
    for (const s of cp.records) rec.record_step(confirmed(r, s), r.realm(s.observation), r.realm(s.feedback), r.realm(s.action));
    assert.equal(rec.sequence_counter, cp.sequence_counter);
    assert(same(rec._prior_action_result(), cp.last_action_result));
    return rec;
}
function countDraws(rng, counter) {
    const next = rng.next;
    rng.next = function() { counter.draws++; return next.call(this); };
}
function publicRun(stop) {
    const started = performance.now(), r = runtime(), trace = [];
    let agent, cp, result = null, error = null;
    const sentinel = Error('EXTERNAL_R01_STOP_AFTER_COMMITTED_TICK_8');
    const draws = {draws: 0};
    if (stop) {
        const original = r.api.Recorder.prototype.record_step;
        r.api.Recorder.prototype.record_step = function(c, o, f, a) {
            original.call(this, c, o, f, a);
            if (Number(c.tick) === cut) {
                cp = clone({source_commit: plan.source_commit, config, cut_tick: c.tick,
                    world_state: c.world_state, world_rng_state: c.world_state.rng_state,
                    initial_state: this.initial_state, initial_events: this.events.filter(e => Number(e.tick) === 0),
                    records: this.steps, sequence_counter: this.sequence_counter,
                    last_action_result: this._prior_action_result(), agent_state: memory(agent), prefix_agent_calls: trace});
                save('checkpoint.json', cp);
                throw sentinel;
            }
        };
    }
    try {
        result = r.api.run_experiment(r.config, (type, seed) => {
            agent = r.api.create_agent(type, seed);
            return {reset() { agent.reset(); countDraws(agent.rng, draws); }, step(feedback) {
                const action = agent.step(feedback);
                trace.push(clone({observation_tick: feedback.observation.tick, action, post_memory: memory(agent), cumulative_agent_rng_draws: draws.draws}));
                return action;
            }};
        });
    } catch (e) { error = String(e); if (e !== sentinel) throw e; }
    const elapsed_ms = performance.now() - started;
    if (stop) {
        assert(cp); assert.equal(trace.length, cut); assert.equal(cp.records.length, cut);
        assert.equal(Number(cp.world_state.time), cut);
        const checked = state(r, cp.world_state);
        assert.equal(r.api.determine_termination({state: checked, config: r.config.world_config,
            experimental_entity_id: checked.entities.keys().next().value}, r.config.max_ticks), null);
        save('interruption.json', {kind: 'EXTERNAL_STOP_NOT_PUBLIC_PAUSE_API', error, agent_calls: trace.length, world_transitions: cut, result_returned: result !== null, elapsed_ms});
        return cp;
    }
    assert.equal(result.status, 'COMPLETED');
    const output = clone({result, trace, agent_rng_draws: draws.draws, elapsed_ms});
    save('continuous.json', output); return output;
}
function resume(mode) {
    const started = performance.now(), cp = load('checkpoint.json'), r = runtime();
    assert.equal(cp.source_commit, plan.source_commit);
    const agent = createAgent(r), warmup = [], warmupDraws = {draws: 0};
    const agentStart = performance.now();
    if (mode === 'snapshot') {
        assert.equal(agent._initial_seed, cp.agent_state.initial_seed);
        agent.rng.set_state(cp.agent_state.rng_state);
    } else {
        agent.reset(); countDraws(agent.rng, warmupDraws);
        if (mode === 'feedback_history') for (const step of cp.records) {
            const action = agent.step(r.realm(step.feedback));
            warmup.push(clone(action)); assert(same(action, step.action));
        }
    }
    const agent_restore_ms = performance.now() - agentStart, at_cut = memory(agent);
    const warmup_rng_draws_at_cut = warmupDraws.draws;
    const world = r.api.replay_world_from_state(state(r, cp.world_state), r.config.world_config);
    world.rng.set_state(cp.world_rng_state);
    r.api.World.prototype.initialize = function() { throw Error('No WORLD initialization in continuation'); };
    const importStart = performance.now(), rec = importRecorder(r, cp);
    const recorder_import_ms = performance.now() - importStart;
    const worldDraws = {draws: 0}, agentDraws = {draws: 0};
    countDraws(world.rng, worldDraws); countDraws(agent.rng, agentDraws);
    let prior = r.realm(cp.last_action_result), termination = r.api.determine_termination(world, r.config.max_ticks);
    const live = [];
    while (termination === null) {
        const observation = r.api.build_observation(world, world.get_experimental_entity(), r.config.world_config.observation_radius);
        const feedback = r.api.build_feedback(observation, prior, r.config.feedback_config);
        const action = agent.step(feedback);
        live.push(clone({source: 'NEW_AGENT_DECISION', observation_tick: observation.tick, action, post_memory: memory(agent), cumulative_agent_rng_draws: agentDraws.draws}));
        const c = r.api.execute_tick_transaction(world, action, r.config.max_ticks);
        rec.record_step(c, observation, feedback, action); prior = c.action_result; termination = c.termination;
    }
    rec.set_termination_reason(termination);
    const output = clone({mode, result: {status: 'COMPLETED', trajectory: rec.finalize(), failure_reason: null, failure_details: null},
        live, memory_at_cut: at_cut, history_generated: warmup, warmup_calls: warmup.length, warmup_agent_rng_draws: warmup_rng_draws_at_cut,
        new_action_calls: live.length, agent_rng_draws_after_restore: agentDraws.draws, world_rng_draws_after_restore: worldDraws.draws,
        timing: {agent_restore_ms, recorder_import_ms, total_ms: performance.now() - started}});
    save('resumed-' + mode + '.json', output); return output;
}
function replayControl(baseline) {
    const started = performance.now(), cp = load('checkpoint.json'), r = runtime();
    let calls = 0;
    r.api.RandomAgent.prototype.step = function() { calls++; throw Error('Replay must not invoke the agent'); };
    const actions = baseline.result.trajectory.steps.slice(cut).map(s => s.action);
    const result = r.api.replay_trajectory(state(r, cp.world_state), [], r.realm(actions), r.config.world_config, r.config.feedback_config, actions.length, r.config.max_ticks, 'WITH_AGENT');
    const out = clone({result, agent_step_calls: calls, saved_actions_supplied: actions.length, elapsed_ms: performance.now() - started});
    save('replay-control.json', out); return out;
}
try {
    save('execution-start.json', {utc: new Date().toISOString(), node: process.version, platform: process.platform, arch: process.arch,
        source_commit: plan.source_commit, harness_sha256: crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
        protocol_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(DIR, 'protocol.json'))).digest('hex')});
    const baseline = publicRun(false), checkpoint = publicRun(true);
    assert(same(checkpoint.records, baseline.result.trajectory.steps.slice(0, cut)));
    assert(same(checkpoint.agent_state, baseline.trace[cut - 1].post_memory));
    resume('snapshot'); resume('feedback_history'); resume('reset_only'); replayControl(baseline);
    save('execution-complete.json', {utc: new Date().toISOString(), status: 'ALL_ARMS_RECORDED', world_transitions: 96});
    console.log('ALL_ARMS_RECORDED: 1 baseline, 1 prefix, 3 continuations, 1 saved-action replay.');
} catch (e) {
    save('failure.json', {error: String(e), stack: e.stack}); console.error(e.stack); process.exitCode = 1;
}
