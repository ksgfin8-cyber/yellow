'use strict';
const assert = require('node:assert/strict');
function measure(data) {
    const result = data.result, t = result.trajectory;
    if (t === null) return {status: result.status, failure_reason: result.failure_reason, kind: 'INITIALIZATION_FAILURE'};
    const entity = s => { assert.ok(s.entities instanceof Map && s.entities.size === 1); const e = s.entities.get('0987898'); assert.ok(e); return e; };
    const positions = new Set(), actions = {MOVE_N: 0, MOVE_E: 0, MOVE_S: 0, MOVE_W: 0, WAIT: 0}, rejected = {};
    const visit = s => { const p = entity(s).position; positions.add(`${p.x},${p.y}`); };
    visit(t.initial_state);
    for (const step of t.steps) {
        assert.ok(Object.hasOwn(actions, step.action.type)); actions[step.action.type]++; visit(step.world_state);
        if (step.action_result.validity !== 'VALID') {
            const key = step.action_result.validity + '/' + step.action_result.reason;
            rejected[key] = (rejected[key] || 0) + 1;
        }
    }
    const end = t.steps.length ? t.steps[t.steps.length - 1].world_state : t.initial_state;
    const selection = {M_N: 0, M_E: 0, M_S: 0, M_W: 0, NULL: 0}, opportunity = {'0': 0, '1': 0};
    for (const d of data.decisions) { selection[d.selected]++; opportunity[d.phi_exp]++; }
    return {kind: 'DEVELOPMENT_EPISODE', status: result.status, resources_consumed: t.events.filter(e => e.source === 'action' && e.type === 'RESOURCE_CONSUMED').length,
        distinct_positions: positions.size, actions, rejected_actions: rejected, ticks: end.time,
        termination_reason: t.termination_reason, final_energy_descriptive_only: entity(end).energy,
        titan_diagnostics: data.config.agent_type === 'titan_mvp_01' ? {selection, opportunity,
            ties: data.decisions.filter(d => d.minimizers.length > 1).length,
            abstentions: selection.NULL, abstention_fraction: data.decisions.length ? selection.NULL / data.decisions.length : null} : null,
        scientific_evaluation: false};
}
module.exports = {measure};
