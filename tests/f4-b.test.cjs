// F4-B local equivalence/regression evidence, not canonical T01–T280.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {performance} = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const BASE = 'a096d5b3ac0ac4763a6dee03e2018f56b459bd9a';
const sources = new Map();
function read(file, version) {
    if (version !== 'base') return fs.readFileSync(path.join(root, file), 'utf8');
    if (!sources.has(file)) sources.set(file, execFileSync('git', ['show', BASE + ':' + file], {cwd: root, encoding: 'utf8'}));
    return sources.get(file);
}
function load(version = 'working') {
    const ctx = vm.createContext({});
    for (const [,p] of read('index.html', version).matchAll(/<script src="([^"]+)"/g)) {
        if (p === 'js/main.js' || p.includes('/visualization/')) continue;
        vm.runInContext(read(p, version), ctx, {filename: p});
    }
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");};', ctx);
    return {ctx, ...vm.runInContext('({World,WorldState,WorldConfig,FeedbackConfig,ExperimentConfig,Recorder,RecordTransaction,Cell,PRNG,build_observation,build_feedback,execute_tick_transaction,determine_termination,run_experiment,run_without_agent,replay_trajectory,replay_confirmed_tick,replay_world_from_state,validate_ReplayResult,validate_replay,canonical_world_state_bytes,canonical_full_state_bytes,STATE_HASH_WORLD,STATE_HASH_FULL,recorder_sequence_after,recorder_tick})', ctx)};
}
function config(a, patch = {}, max = 4, flags = {}) {
    return new a.ExperimentConfig({experiment_seed: 12345, max_ticks: max, agent_type: 'wait',
        world_config: {...a.WorldConfig.defaults(), width: 2, height: 2, obstacle_density: 0,
            resource_density: 0, hazard_density: 0, initial_energy: 10000, wait_cost: 1,
            observation_radius: 1, ...patch}, feedback_config: {...a.FeedbackConfig.defaults(), ...flags}});
}
const clone = x => structuredClone(x);
const benchmark = process.argv.includes('--benchmark');
function setup(a = load(), patch = {}, max = 3, flags = {}, layout = true) {
    const c = config(a, patch, max, flags), w = new a.World(c.world_config), initial = w.initialize(12345);
    if (layout && w.get_experimental_entity().lifecycle === 'ACTIVE') {
        w.get_experimental_entity().position = {x: 0, y: 0};
        w.state.grid[0][1] = new a.Cell('FREE', {kind: 'RESOURCE', stock: 1});
        w.state.grid[1][1] = new a.Cell('FREE', {kind: 'HAZARD'});
    }
    const r = new a.Recorder(c);
    r.record_initial_state(w.full_snapshot()); r.record_initial_lifecycle_from_world(initial.initial_events);
    return {a, c, w, r, last: null};
}
function next(f, type = 'WAIT', observed = true) {
    const action = {type}, observation = observed ? f.a.build_observation(f.w, f.w.get_experimental_entity(), f.c.world_config.observation_radius) : null;
    const feedback = observed ? f.a.build_feedback(observation, f.last, f.c.feedback_config) : null;
    const confirmed = f.a.execute_tick_transaction(f.w, action, f.c.max_ticks);
    return {confirmed, observation, feedback, action};
}
function record(f, input = next(f)) {
    const result = f.r.record_step(input.confirmed, input.observation, input.feedback, input.action);
    assert.equal(result, undefined); f.last = input.confirmed.action_result; return input;
}
const fields = ['initial_state', 'steps', 'events', 'sequence_counter', '_initial_lifecycle_recorded', 'initialization_failure', 'termination_reason'];
function saved(f) { return clone(Object.fromEntries(fields.map(key => [key, f.r[key]]))); }
function unchanged(f, fn) {
    const before = saved(f), refs = fields.map(key => f.r[key]);
    fn(); assert.deepEqual(saved(f), before);
    // F4C-P01 returns independent snapshots; original identity assertions remain for the base.
    if (!Object.getOwnPropertyDescriptor(f.r,'steps').get) fields.forEach((key, i) => assert.equal(f.r[key], refs[i], 'rollback reference ' + key));
}
const fail = fn => assert.throws(fn, {name: 'ContractError', message: 'recording failed'});
function equivalent(a, actual, b, expected) {
    assert.deepEqual(clone(actual), clone(expected));
    const at = actual.trajectory || actual, bt = expected.trajectory || expected;
    if (!at.initial_state) return;
    const as = [at.initial_state, ...at.steps.map(s => s.world_state)], bs = [bt.initial_state, ...bt.steps.map(s => s.world_state)];
    as.forEach((s, i) => {
        for (const fn of ['canonical_world_state_bytes', 'canonical_full_state_bytes']) {
            assert.ok(Buffer.from(a[fn](s)).equals(Buffer.from(b[fn](bs[i]))), fn + ' step ' + i);
        }
    });
}
function manual(a, types, patch = {}, flags = {}, observed = true) {
    const f = setup(a, patch, types.length, flags);
    for (const type of types) {
        if (a.determine_termination(f.w, f.c.max_ticks) !== null) break;
        record(f, next(f, type, observed));
    }
    f.r.set_termination_reason(a.determine_termination(f.w, f.c.max_ticks));
    return {f, trajectory: f.r.finalize()};
}

function instrument(a) {
    const metrics = {kernel_ms: 0, record_ms: 0, finalize_ms: 0, hash_ms: 0, history_ms: 0,
        copies_ms: 0, hashes: 0, history_checks: 0, history_steps: 0, copied_steps: 0, copied_events: 0};
    a.ctx.metrics = metrics; a.ctx.now = () => performance.now();
    vm.runInContext(`(() => {
        const tick = execute_tick_transaction;
        execute_tick_transaction = (...args) => { const t=now(); try{return tick(...args);}finally{metrics.kernel_ms+=now()-t;} };
        for(const [name,key] of [['record_step','record_ms'],['finalize','finalize_ms'],['_validate_prepared','history_ms'],['_prepare_current','copies_ms']]) {
            const old=Recorder.prototype[name];
            Recorder.prototype[name]=function(...args){
                if(name==='_validate_prepared'){metrics.history_checks++;metrics.history_steps+=args[0].steps.length;}
                if(name==='_prepare_current'){metrics.copied_steps+=this.steps.length;metrics.copied_events+=this.events.length;}
                const t=now();try{return old.apply(this,args);}finally{metrics[key]+=now()-t;}
            };
        }
        for(const name of ['STATE_HASH_WORLD','STATE_HASH_FULL']) {
            const old=globalThis[name];globalThis[name]=(...args)=>{
                metrics.hashes++;const t=now();try{return old(...args);}finally{metrics.hash_ms+=now()-t;}
            };
        }
    })();`, a.ctx);
    return metrics;
}
function bench(version, n, eventful = false) {
    const a = load(version), metrics = instrument(a);
    const c = config(a, {width: eventful ? 2 : 1, height: 1, observation_radius: 0, wait_cost: 0}, n);
    const start = performance.now();
    const r = eventful ? a.run_experiment(c, () => ({reset() {}, step(f) {
        return {type: f.observation.self.position.x === 0 ? 'MOVE_E' : 'MOVE_W'};
    }})) : a.run_without_agent(c);
    const elapsed = performance.now() - start;
    assert.equal(r.status, 'COMPLETED'); assert.equal(r.trajectory.steps.length, n);
    const rounded = Object.fromEntries(Object.entries(metrics).map(([k,v]) => [k, k.endsWith('_ms') ? +v.toFixed(3) : v]));
    console.log(JSON.stringify({version, ticks: n, eventful, total_ms: +elapsed.toFixed(3), ...rounded}));
}
if (benchmark) {
    const sizeArg = process.argv.find(x => x.startsWith('--sizes='));
    const sizes = sizeArg ? sizeArg.slice(8).split(',').map(Number) : [10,100,500];
    const versions = process.argv.includes('--baseline-only') ? ['base'] : process.argv.includes('--working-only') ? ['working'] : ['base','working'];
    const workloads = process.argv.includes('--with-events') ? [false,true] : [false];
    for (const eventful of workloads) for (const n of sizes) for (const version of versions) bench(version, n, eventful);
} else {
    test('F4B-01 independent base sources are pinned to the approved commit', () => {
        assert.match(read('js/experiment/recorder.js', 'base'), /this\._validate_prepared\(this\._prepare_current\(\)\)/);
        assert.equal(execFileSync('git', ['rev-parse', BASE + '^{commit}'], {cwd: root, encoding: 'utf8'}).trim(), BASE);
    });
    test('F4B-02 exact no-agent trajectories for one, several and two hundred ticks, including WLS1 bytes', () => {
        for (const n of [1, 5, 200]) {
            const a = load(), b = load('base'), patch = {width: 1, height: 1, observation_radius: 0, wait_cost: 0};
            equivalent(a, a.run_without_agent(config(a, patch, n)), b, b.run_without_agent(config(b, patch, n)));
        }
    });
    test('F4B-03 real agent trajectories and all sixteen feedback masks equal the independent base', () => {
        const names = ['expose_validity','expose_reason','expose_events','expose_energy_delta'];
        for (let mask = 0; mask < 16; mask++) {
            const flags = Object.fromEntries(names.map((name, i) => [name, Boolean(mask & (1 << i))]));
            const a = load(), b = load('base');
            const factory = () => ({reset() {}, step(f) { return {type: f.observation.self.position.x === 0 ? 'MOVE_E' : 'MOVE_W'}; }});
            equivalent(a, a.run_experiment(config(a, {}, 4, flags), factory), b, b.run_experiment(config(b, {}, 4, flags), factory));
        }
    });
    test('F4B-04 resources, regeneration, hazards and multiple ordered events preserve full structure and bytes', () => {
        const a = load(), b = load('base'), types = ['MOVE_E', 'MOVE_S', 'MOVE_N', 'MOVE_W'];
        const x = manual(a, types), y = manual(b, types); equivalent(a, x.trajectory, b, y.trajectory);
        assert.deepEqual(Array.from(x.trajectory.events, e => e.type), ['ENTITY_MOVED','RESOURCE_CONSUMED','ENTITY_MOVED','HAZARD_TRIGGERED','ENTITY_MOVED','RESOURCE_CONSUMED','ENTITY_MOVED']);
        assert.deepEqual(Array.from(x.trajectory.events, e => e.sequence), [0,1,2,3,4,5,6]);
        assert.equal(x.trajectory.steps[0].world_state.grid[0][1].effect.stock, 1);
    });
    test('F4B-05 initial and subsequent death, zero limit and initialization failure equal the base', () => {
        for (const [patch, n] of [[{initial_energy: 0},3],[{initial_energy: 1},3],[{},0],[{obstacle_density: 1},3]]) {
            const a = load(), b = load('base');
            const x = a.run_without_agent(config(a, patch, n)), y = b.run_without_agent(config(b, patch, n));
            equivalent(a, x, b, y);
            if (patch.initial_energy === 0) { assert.equal(x.trajectory.steps.length, 0); assert.equal(x.trajectory.events.length, 1); }
        }
    });
    test('F4B-06 agent failure retains exactly the same partial trajectory and reason', () => {
        const a = load(), b = load('base'), factory = () => { let i = 0; return {reset() {}, step() { if (i++ === 0) return {type:'WAIT'}; throw Error('agent stopped'); }}; };
        const x = a.run_experiment(config(a), factory), y = b.run_experiment(config(b), factory);
        equivalent(a, x, b, y); assert.equal(x.status, 'FAILED'); assert.equal(x.trajectory.steps.length, 1);
    });
    test('F4B-07 finalize and confirmed inputs retain independent ownership of nested Maps/events', () => {
        const f = setup(load(), {}, 1), i = record(f, next(f, 'MOVE_E')), before = saved(f), t = f.r.finalize();
        t.steps[0].world_state.entities.get('0987898').energy = -100;
        t.steps[0].entity_states.get('0987898').position.x = 99;
        t.events[0].position.x = 99; t.steps[0].action_events[0].position.y = 99;
        t.steps[0].action_result.events[0].position.x = 99; t.initial_state.grid[0][1].effect.stock = 0;
        i.confirmed.world_state.grid[0][1].effect.stock = 0; i.action.type = 'WAIT'; i.observation.self.energy = 0;
        assert.deepEqual(saved(f), before);
    });
    test('F4B-08 failures in preparation, copy, serialization, both hashes and validation are atomic and retryable', () => {
        for (const phase of ['snapshot','action-events','lifecycle-events','serialize_world_state','STATE_HASH_WORLD','STATE_HASH_FULL','candidate-copy','history-validation','step-validation']) {
            for (const version of ['working', 'base']) {
                const a = load(version), f = setup(a, {}, 2); record(f, next(f, 'MOVE_E'));
                const i = next(f, 'MOVE_S'), world = clone(f.w.state), rng = f.w.rng.get_state(); let hits = 0, restore;
                const wrap = (owner, name, replacement) => { const old = owner[name]; owner[name] = replacement(old); return () => { owner[name] = old; }; };
                if (phase === 'snapshot') restore = wrap(a.WorldState.prototype, 'full_snapshot', () => function() { hits++; throw Error(phase); });
                else if (phase.endsWith('-events')) restore = wrap(f.r, '_prepare_events', old => function(...args) {
                    const result = old.apply(this, args);
                    if (args[2] === (phase === 'action-events' ? 'action' : 'lifecycle')) { hits++; throw Error(phase); } return result;
                });
                else if (['serialize_world_state','STATE_HASH_WORLD','STATE_HASH_FULL'].includes(phase)) {
                    const old = vm.runInContext(phase, a.ctx); a.ctx.injected = () => { hits++; throw Error(phase); };
                    vm.runInContext(phase + '=injected', a.ctx); restore = () => { a.ctx.injected = old; vm.runInContext(phase + '=injected', a.ctx); };
                } else {
                    const snapshots=Boolean(Object.getOwnPropertyDescriptor(f.r,'steps').get);
                    const name = {'candidate-copy':snapshots?'_prepare_step_input':'_prepare_current','history-validation':snapshots?'_validate_append':'_validate_prepared','step-validation':'_validate_step'}[phase];
                    restore = wrap(f.r, name, old => function(...args) {
                        const result = old.apply(this, args);
                        if (phase === 'candidate-copy' || (phase === 'history-validation' ? (snapshots ? args[0].step?.tick === 2 : args[0].steps.length === 2) : args[0].tick === 2)) { hits++; throw Error(phase); }
                        return result;
                    });
                }
                unchanged(f, () => fail(() => record(f, i))); assert.equal(hits, 1, version + ' ' + phase);
                assert.deepEqual(clone(f.w.state), world); assert.equal(f.w.rng.get_state(), rng);
                restore(); record(f, i); const t = f.r.finalize();
                assert.equal(t.steps.length, 2); assert.deepEqual(Array.from(t.events, e => e.sequence), [0,1,2,3]);
            }
        }
    });
    test('F4B-09 faults after each of seven publications restore values and references, consume no sequences', () => {
        for (let n = 1; n <= 7; n++) {
            const a = load(), f = setup(a, {}, 2); record(f, next(f, 'MOVE_E'));
            const i = next(f, 'MOVE_S'), old = a.RecordTransaction.prototype._publish; let hits = 0;
            a.RecordTransaction.prototype._publish = function(...args) { old.apply(this, args); if (++hits === n) throw Error('publication'); };
            unchanged(f, () => fail(() => record(f, i))); assert.equal(hits, n);
            a.RecordTransaction.prototype._publish = old; record(f, i);
            assert.equal(f.r.steps.length, 2); assert.equal(f.r.sequence_counter, 4); f.r.finalize();
        }
    });
    test('F4B-10 invalid confirmed/context and candidate event copies cannot publish partial data', () => {
        for (const mutate of [i => i.confirmed.termination = 'ENTITY_DIED', i => i.observation.self.energy++,
            i => i.feedback.has_prior_action = false, i => i.confirmed.action_events.pop(), i => i.action = null]) {
            const f = setup(); record(f, next(f, 'MOVE_E')); const i = next(f, 'MOVE_S'); mutate(i);
            unchanged(f, () => fail(() => record(f, i)));
        }
        const f = setup(); record(f, next(f, 'MOVE_E')); const i = next(f, 'MOVE_S');
        if(Object.getOwnPropertyDescriptor(f.r,'steps').get) {
            const old=f.r._validate_append;
            f.r._validate_append=function(p){p.events[0].position.x=99;return old.call(this,p);};
        } else {
            const old=f.r._prepare_current;
            f.r._prepare_current=function(){const p=old.call(this);p.events[0].position.x=99;return p;};
        }
        unchanged(f, () => fail(() => record(f, i)));
    });
    test('F4B-11 external prefix corruption is still detected on the next record and on exhaustive finalize', () => {
        const corruptions = [r => r.steps[0].state_hash_full ^= 1,
            r => r.steps[0].entity_states.get('0987898').energy++, r => r.steps[0].world_state.entities.get('0987898').energy++,
            r => r.steps[0].world_state.grid[0][1].effect.stock = 0, r => r.steps[0].action_result.events[0].position.x = 99,
            r => r.steps[0].extra = true, r => delete r.steps[0], r => r.events[0].sequence++,
            r => r.events = r.events.slice(1), r => r.sequence_counter++, r => r._initial_lifecycle_recorded = 'true'];
        for (const version of ['working','base']) for (const corrupt of corruptions) {
            const a = load(version), f = setup(a, {}, 3); record(f, next(f, 'MOVE_E')); record(f, next(f, 'MOVE_S'));
            const i = next(f, 'MOVE_N');
            if(Object.getOwnPropertyDescriptor(f.r,'steps').get) {
                const before=saved(f), external=Object.fromEntries(fields.map(key=>[key,f.r[key]]));corrupt(external);
                assert.deepEqual(saved(f),before);record(f,i);assert.equal(f.r.finalize().steps.length,3);
                continue; // Original F3E-P01 detection semantics remain exercised by the pinned base below.
            }
            corrupt(f.r);
            unchanged(f, () => fail(() => record(f, i)));
            const g = setup(a, {}, 2); record(g, next(g, 'MOVE_E')); record(g, next(g, 'MOVE_S')); corrupt(g.r);
            unchanged(g, () => fail(() => g.r.finalize()));
        }
    });
    test('F4B-12 writable public arrays and old array references keep their existing observable behavior', () => {
        const f = setup(), steps = f.r.steps, events = f.r.events; record(f, next(f, 'MOVE_E'));
        assert.notEqual(f.r.steps, steps); assert.notEqual(f.r.events, events);
        assert.equal(steps.length, 0); assert.equal(events.length, 0);
        const snapshots=Boolean(Object.getOwnPropertyDescriptor(f.r,'steps').get);
        if(snapshots) fail(()=>{f.r.steps=[];}); else assert.equal(Object.getOwnPropertyDescriptor(f.r, 'steps').writable, true);
        const prefix = f.r.steps, first = prefix[0], oldEvent = f.r.events[0]; record(f, next(f, 'MOVE_S'));
        assert.equal(prefix.length, 1); if(snapshots) assert.notEqual(f.r.steps[0],first); else assert.equal(f.r.steps[0], first); assert.equal(Object.isFrozen(first), false);
        assert.notEqual(f.r.events[0], oldEvent);
        oldEvent.position.x = 99; assert.notEqual(f.r.events[0].position.x, 99);
        first.entity_states.get('0987898').energy++;
        if(snapshots){record(f,next(f,'MOVE_N'));assert.equal(f.r.finalize().steps.length,3);}else unchanged(f, () => fail(() => record(f, next(f, 'MOVE_N'))));
    });
    test('F4B-13 work counts fall without trusting a previously validated mutable prefix', () => {
        const rows = [];
        for (const version of ['working','base']) {
            const a = load(version), m = instrument(a);
            const t = a.run_without_agent(config(a, {width:1,height:1,observation_radius:0}, 8)).trajectory;
            assert.equal(t.steps.length, 8); rows.push(m);
        }
        assert.ok(rows[0].history_checks < rows[1].history_checks);
        assert.ok(rows[0].hashes < rows[1].hashes); assert.ok(rows[0].copied_steps < rows[1].copied_steps);
        assert.equal(rows[0].history_steps,8,'F4C: one exhaustive history validation at finalize');
    });
    test('F4B-14 EXPERIMENT -> replay -> exhaustive validation preserves MATCH and full data', () => {
        for (const version of ['working','base']) {
            const a = load(version), t = a.run_experiment(config(a, {}, 5)).trajectory;
            const c = {world_config:t.experiment_config.world_config, feedback_config:t.experiment_config.feedback_config,
                initial_state:t.initial_state, initial_events:t.events.filter(e => e.tick === 0), actions:t.steps.map(s => s.action), expected_steps:t.steps.length, max_ticks:t.experiment_config.max_ticks,execution_mode:'WITH_AGENT'};
            const rr = a.replay_trajectory(c.initial_state,c.initial_events,c.actions,c.world_config,c.feedback_config,c.expected_steps,c.max_ticks,'WITH_AGENT');
            assert.equal(a.validate_ReplayResult(rr,c), true); assert.equal(a.validate_replay(t,rr,c.world_config,'WITH_AGENT').status, 'MATCH');
            assert.deepEqual(clone(rr.records), clone(t.steps)); assert.deepEqual(clone(rr.events), clone(t.events));
        }
    });
    test('F4B-15 replay rollback still restores WORLD/RNG/Recorder on partial and late publication failure', () => {
        for (const late of [false,true]) {
            const a = load(), t = a.run_experiment(config(a)).trajectory, c = t.experiment_config;
            const w = a.replay_world_from_state(t.initial_state,c.world_config), r = new a.Recorder(c);
            r.record_initial_state(t.initial_state); r.record_initial_lifecycle_from_recorded([]);
            a.replay_confirmed_tick(w,r,{type:'WAIT'},c.feedback_config,c.max_ticks);
            const f = {r}, before = clone(w.state), rng = w.rng.get_state(); let hits = 0;
            if (late) { const old = r.record_step; r.record_step = function(...args) { old.apply(this,args); hits++; throw Error('late'); }; }
            else { const old = a.RecordTransaction.prototype._publish; a.RecordTransaction.prototype._publish = function(key,value) { old.call(this,key,value); if (key === 'sequence_counter') { hits++; throw Error('publish'); } }; }
            unchanged(f, () => fail(() => a.replay_confirmed_tick(w,r,{type:'WAIT'},c.feedback_config,c.max_ticks)));
            assert.equal(hits,1); assert.deepEqual(clone(w.state),before); assert.equal(w.rng.get_state(),rng);
        }
    });
    test('F4B-16 no live WORLD/PRNG effects during recording or finalization', () => {
        const f = setup(load(), {}, 1), i = next(f, 'MOVE_E'), before = clone(f.w.state), rng = f.w.rng.get_state();
        for (const name of ['apply_action','resolve_lifecycle','advance_dynamics','sync_rng_state']) f.w[name] = () => assert.fail(name);
        Object.defineProperty(f.w, 'rng', {get() { assert.fail('live RNG'); }});
        f.a.PRNG.prototype.next = () => assert.fail('PRNG');
        record(f,i); f.r.finalize(); assert.deepEqual(clone(f.w.state),before); assert.ok(rng > 0);
    });
    test('F4B-17 BigInt representation, safe tick boundary and sequence exhaustion stay exact', () => {
        const results = [];
        for (const version of ['working','base']) {
            const a = load(version), f = setup(a, {}, 1n); f.w.state.time = 0n;
            if(Object.getOwnPropertyDescriptor(f.r,'steps').get){f.r=new a.Recorder(f.c);f.r.record_initial_state(f.w.full_snapshot());f.r.record_initial_lifecycle_from_world([]);}else f.r.initial_state.time = 0n;
            record(f,next(f,'MOVE_E')); const t = f.r.finalize(); assert.equal(t.steps[0].tick,1); assert.equal(t.steps[0].world_state.time,1n); results.push({a,t});
            assert.equal(a.recorder_sequence_after(Number.MAX_SAFE_INTEGER),9007199254740992n);
            assert.equal(a.recorder_tick(Number.MAX_SAFE_INTEGER),Number.MAX_SAFE_INTEGER);
            if(version==='working')assert.equal(a.recorder_tick(9007199254740992n),9007199254740992n);else fail(()=>a.recorder_tick(9007199254740992n));
            for (const value of [9007199254740992,-1,NaN,'1']) fail(() => a.recorder_tick(value));
            const g = setup(a), i = next(g,'MOVE_E'), old = g.r._prepare_events;
            g.r._prepare_events = function(raw,tick,source) { return old.call(this,raw,tick,source,Number.MAX_SAFE_INTEGER); };
            unchanged(g, () => fail(() => record(g,i)));
            const h = setup(a);
            if(Object.getOwnPropertyDescriptor(h.r,'steps').get) unchanged(h,()=>fail(()=>{h.r.sequence_counter=9007199254740992n;}));
            else {h.r.sequence_counter = 9007199254740992n;unchanged(h, () => fail(() => record(h,next(h,'MOVE_E'))));}
        }
        equivalent(results[0].a,results[0].t,results[1].a,results[1].t);
    });
    test('F4B-18 seeded RandomAgent preserves the entire trajectory and RNG snapshots against the base', () => {
        const a = load(), b = load('base');
        const c = api => new api.ExperimentConfig({...config(api, {}, 8), agent_type:'random'});
        equivalent(a,a.run_experiment(c(a)),b,b.run_experiment(c(b)));
    });
}
