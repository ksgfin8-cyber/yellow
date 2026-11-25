'use strict';
// Pure analysis of saved artifacts. No agent.step, WORLD transition or replay invocation.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const DIR = __dirname, wire = require('./source/conformance/wire.cjs');
const load = n => wire.decode(JSON.parse(fs.readFileSync(path.join(DIR, n))));
const same = (a, b) => JSON.stringify(wire.encode(structuredClone(a))) === JSON.stringify(wire.encode(structuredClone(b)));
const plan = load('protocol.json'), cut = plan.cut_after_committed_tick;
const baseline = load('continuous.json'), cp = load('checkpoint.json');
const r = require('./source/tools/p01/runtime.cjs').loadRuntime();
Object.assign(r.api, vm.runInContext('({build_feedback})', r.ctx));
const state = s => new r.api.WorldState(s.time, r.realm(s.grid), r.realm(s.entities), s.rng_state, r.realm(plan.world_config));
const steps = baseline.result.trajectory.steps;
function first(expected, actual, project, offset = 0) {
    for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
        const a = expected[i] === undefined ? undefined : project(expected[i]);
        const b = actual[i] === undefined ? undefined : project(actual[i]);
        if (!same(a, b)) return {step_tick: offset + i + 1, expected: a, actual: b};
    }
    return null;
}
function dimensions(expected, actual, offset = 0) {
    return Object.fromEntries(Object.entries({action: s => s.action, world_state: s => s.world_state,
        world_rng: s => s.world_state.rng_state, feedback: s => s.feedback,
        action_result: s => s.action_result, action_events: s => s.action_events, lifecycle_events: s => s.lifecycle_events,
        event_sequence: s => [...s.action_events, ...s.lifecycle_events].map(e => e.sequence), full_record: s => s})
        .map(([name, f]) => [name, first(expected, actual, f, offset)]));
}
function bytes(expected, actual) {
    let compared = 0, mismatch = null;
    for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
        for (const fn of ['canonical_world_state_bytes', 'canonical_full_state_bytes']) {
            if (!expected[i] || !actual[i]) { mismatch ??= {index: i, kind: 'length'}; continue; }
            compared++;
            if (!Buffer.from(r.api[fn](state(expected[i]))).equals(Buffer.from(r.api[fn](state(actual[i]))))) mismatch ??= {index: i, kind: fn};
        }
    }
    return {comparisons: compared, first_mismatch: mismatch};
}
const arms = [];
for (const mode of ['snapshot', 'feedback_history', 'reset_only']) {
    const a = load('resumed-' + mode + '.json'), t = a.result.trajectory;
    const dimensions_first_divergence = dimensions(steps.slice(cut), t.steps.slice(cut), cut);
    arms.push({mode, new_action_calls: a.new_action_calls, warmup_calls: a.warmup_calls,
        warmup_agent_rng_draws: a.warmup_agent_rng_draws, agent_rng_draws_after_restore: a.agent_rng_draws_after_restore,
        world_rng_draws_after_restore: a.world_rng_draws_after_restore,
        memory_at_cut: a.memory_at_cut, memory_at_cut_equal: same(cp.agent_state, a.memory_at_cut),
        first_agent_rng_divergence: first(baseline.trace.slice(cut), a.live, x => x.post_memory, cut),
        dimensions_first_divergence, full_result_equal: same(baseline.result, a.result),
        global_events_equal: same(baseline.result.trajectory.events, t.events),
        termination_equal: baseline.result.trajectory.termination_reason === t.termination_reason,
        termination: t.termination_reason, final_tick: t.final_state.time,
        bytes: bytes([baseline.result.trajectory.initial_state, ...steps.map(s => s.world_state)], [t.initial_state, ...t.steps.map(s => s.world_state)]),
        timing: a.timing});
}
const replay = load('replay-control.json'), rr = replay.result;
const replay_report = {status: rr.status, executed: rr.executed, agent_step_calls: replay.agent_step_calls,
    dimensions_first_divergence: dimensions(steps.slice(cut), rr.records, cut),
    termination_equal: rr.termination_hint === baseline.result.trajectory.termination_reason,
    first_feedback_prior: {continuous: steps[cut].feedback.has_prior_action, replay: rr.records[0].feedback.has_prior_action},
    first_event_sequences: {continuous: steps[cut].action_events[0]?.sequence ?? null, replay: rr.records[0].action_events[0]?.sequence ?? null},
    bytes: bytes(steps.slice(cut).map(s => s.world_state), rr.records.map(s => s.world_state)), elapsed_ms: replay.elapsed_ms};
let prior = null, feedback_count = 0;
for (const s of cp.records) {
    assert(same(r.api.build_feedback(r.realm(s.observation), r.realm(prior), r.realm(plan.feedback_config)), s.feedback));
    prior = s.action_result; feedback_count++;
}
// Verify inputs and declared completion without rerunning any physical operations.
assert(same(cp.records, steps.slice(0, cut)));
assert(same(cp.agent_state, baseline.trace[cut - 1].post_memory));
assert.equal(load('execution-complete.json').world_transitions, 96);
const harness_sha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(DIR, 'harness.cjs'))).digest('hex');
assert.equal(harness_sha256, load('execution-start.json').harness_sha256);
const summary = {source_commit: plan.source_commit, protocol_commit: load('pre-execution.json').protocol_commit,
    runtime: load('execution-start.json'), prefix_equal: true, prefix_feedback_reconstructed: feedback_count,
    checkpoint: {world_time: cp.world_state.time, world_rng: cp.world_rng_state, agent_state: cp.agent_state,
        recorder_sequence: cp.sequence_counter, last_action_result: cp.last_action_result},
    baseline: {agent_calls: baseline.trace.length, agent_rng_draws: baseline.agent_rng_draws,
        termination: baseline.result.trajectory.termination_reason, elapsed_ms: baseline.elapsed_ms},
    arms, replay: replay_report,
    decision: arms.slice(0, 2).every(a => a.full_result_equal && !a.first_agent_rng_divergence && !a.bytes.first_mismatch)
        ? 'CONTINUITY_VERIFIED_WITHIN_FIXED_CASE' : 'CONTINUITY_NOT_ESTABLISHED',
    negative_control_discriminates_actions: arms[2].dimensions_first_divergence.action !== null,
    scope: 'One RandomAgent fixture and cut, common engine/differential oracle, same runtime. Portable interface proposed, not implemented.'};
fs.writeFileSync(path.join(DIR, 'analysis.json'), JSON.stringify(wire.encode(summary), null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({decision: summary.decision, arms: arms.map(a => ({mode:a.mode, full_result_equal:a.full_result_equal,
    first_action_divergence:a.dimensions_first_divergence.action, new_action_calls:a.new_action_calls})), replay: {status:rr.status, agent_calls:replay.agent_step_calls}}));
