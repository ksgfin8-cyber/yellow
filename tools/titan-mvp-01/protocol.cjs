'use strict';
const assert = require('node:assert/strict');
const AGENTS = Object.freeze(['wait', 'random', 'rule', 'frontier_memory_v1', 'titan_mvp_01']);
const DEVELOPMENT_SEEDS = Object.freeze([1, 2, 3, 4]);
// New development safeguards, not inherited authorization from P01/RC1.
const LIMITS = Object.freeze({timeout_ms: 30000, heap_mib: 384, total_ms: 420000,
    archive_bytes: 64 * 1024 * 1024, max_attempts: 12});
function physicalConfig() {
    return {max_ticks: 160, world_config: {width: 12, height: 12, topology: 'BOUNDED',
        obstacle_density: 0.15, resource_density: 0.12, hazard_density: 0,
        initial_energy: 240, move_cost: 1, wait_cost: 1, resource_effect: 8, hazard_damage: 0,
        resource_regeneration: 0, death_threshold: 0, observation_radius: 1},
        feedback_config: {expose_validity: true, expose_reason: true, expose_events: true, expose_energy_delta: true}};
}
function assertDevelopmentSeed(seed) {
    assert.ok(Number.isInteger(seed) && DEVELOPMENT_SEEDS.includes(seed), 'TITAN development only: seeds1–4; evaluation2001–2012 is HOLD');
}
function assertRequest(request) {
    assert.deepEqual(Object.keys(request).sort(), ['agent', 'repetition', 'seed']);
    assertDevelopmentSeed(request.seed); assert.ok(AGENTS.includes(request.agent));
    assert.ok([1, 2].includes(request.repetition)); return request;
}
function config(seed, agent) {
    assertDevelopmentSeed(seed); assert.ok(AGENTS.includes(agent));
    return {...physicalConfig(), experiment_seed: seed, agent_type: agent};
}
function assertProfile(config) {
    assertDevelopmentSeed(config.experiment_seed); assert.ok(AGENTS.includes(config.agent_type));
    assert.equal(config.world_config.observation_radius, 1, 'TITAN adapter requires radius1');
    assert.deepEqual(Object.keys(config.feedback_config).sort(), ['expose_energy_delta','expose_events','expose_reason','expose_validity']);
    assert.ok(Object.values(config.feedback_config).every(x => x === true), 'TITAN adapter requires all four feedback exposures');
}
function smokePlan() {
    const plan = [1, 2].map(repetition => ({seed: 1, agent: 'titan_mvp_01', repetition}));
    for (const agent of AGENTS.filter(a => a !== 'titan_mvp_01')) plan.push({seed: 1, agent, repetition: 1});
    for (const seed of [2, 3, 4]) for (const repetition of [1, 2]) plan.push({seed, agent: 'titan_mvp_01', repetition});
    return plan;
}
module.exports = {AGENTS, DEVELOPMENT_SEEDS, LIMITS, physicalConfig, config, assertDevelopmentSeed, assertRequest, assertProfile, smokePlan};
