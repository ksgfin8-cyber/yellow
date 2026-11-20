'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto');
const {loadRuntime: loadExisting, ROOT} = require('../p01/runtime.cjs');
const {assertProfile, AGENTS} = require('./protocol.cjs');
const FILE = 'js/agents/titan_mvp_01.js';
function createAgentFactory(api, {seed, diagnostics = null, code_sha256} = {}) {
    return (type, agentSeed) => {
        if (!AGENTS.includes(type)) throw Error('unsupported TITAN harness agent');
        if (type === 'frontier_memory_v1') return new api.FrontierMemoryAgent();
        if (type !== 'titan_mvp_01') return api.create_agent(type, agentSeed);
        // TITAN receives no seed, WORLD, recorder, host clock or callback.
        const subject = new api.TitanMVP01Agent();
        return {reset() { subject.reset(); }, step(feedback) {
            const action = subject.step(feedback);
            // Observer is external and write-only; it is never consulted by the policy.
            if (diagnostics !== null) diagnostics.push({experiment_seed: seed, code_sha256, ...subject.getDiagnostic()});
            return action;
        }};
    };
}
function stateBytes(api, trajectory) {
    if (!trajectory) return [];
    return [trajectory.initial_state, ...trajectory.steps.map(s => s.world_state)].map(s => ({
        world_hex: Buffer.from(api.canonical_world_state_bytes(s)).toString('hex'),
        full_hex: Buffer.from(api.canonical_full_state_bytes(s)).toString('hex')
    }));
}
function loadRuntime() {
    const base = loadExisting();
    const source = fs.readFileSync(path.join(ROOT, FILE));
    vm.runInContext(source.toString('utf8'), base.ctx, {filename: FILE});
    const added = vm.runInContext('({TitanMVP01Agent, selectTitanMVP01Mechanism})', base.ctx);
    const api = {...base.api, ...added};
    const code_sha256 = crypto.createHash('sha256').update(source).digest('hex');
    return {...base, api, code_sha256, run(config, {diagnostics = true} = {}) {
        assertProfile(config); // Reject hidden feedback/radius BEFORE WORLD or agent construction.
        const checked = new api.ExperimentConfig(base.realm(config)), decisions = [];
        const factory = createAgentFactory(api, {seed: checked.experiment_seed,
            diagnostics: diagnostics ? decisions : null, code_sha256});
        const result = api.run_experiment(checked, factory);
        const states = stateBytes(api, result.trajectory);
        return structuredClone({config: checked, seeds: {experiment: checked.experiment_seed,
            world: api.derive_seed(checked.experiment_seed, 'world'), agent: api.derive_seed(checked.experiment_seed, checked.agent_type)},
            result, decisions, wls1: states});
    }};
}
module.exports = {ROOT, FILE, loadRuntime, createAgentFactory, stateBytes};
