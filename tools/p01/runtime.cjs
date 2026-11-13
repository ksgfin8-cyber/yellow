// Load existing classic scripts; no duplicate WORLD or transition implementation.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ROOT = path.resolve(__dirname, '../..');
function engineFiles() {
    return [...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)]
        .map(m => m[1]).filter(p => !['js/main.js', 'js/visualization/renderer.js', 'js/tests/tests.js'].includes(p));
}
function loadRuntime() {
    const ctx = vm.createContext({});
    for (const file of [...engineFiles(), 'js/agents/frontier_memory_agent.js']) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, {filename: file});
    }
    const api = vm.runInContext(`({Map, WorldConfig, FeedbackConfig, ExperimentConfig, WorldState,
        FrontierMemoryAgent, create_agent, run_experiment, initialize_world, derive_seed,
        validate_ExperimentConfig, validate_WorldState, replay_trajectory, validate_ReplayResult,
        validate_replay, replay_values_equal, replay_record_structure, validate_RecordedEvent, canonical_world_state_bytes, canonical_full_state_bytes})`, ctx);
    function realm(value) {
        if (value instanceof Map) return new api.Map([...value].map(([k, v]) => [realm(k), realm(v)]));
        if (Array.isArray(value)) return value.map(realm);
        if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, realm(v)]));
        return value;
    }
    return {api, ctx, realm, run(config) {
        const checked = new api.ExperimentConfig(config);
        const factory = (type, seed) => type === 'frontier_memory_v1' ? new api.FrontierMemoryAgent() : api.create_agent(type, seed);
        return structuredClone(api.run_experiment(checked, factory));
    }};
}
module.exports = {ROOT, engineFiles, loadRuntime};
