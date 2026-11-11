// F4-C local ownership, atomicity and equivalence evidence; not T01–T280.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {performance} = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const BASE = '3f70a9842a967b7fed157cd7db94e6313f590b6d';
const sources = new Map();
function read(file, version) {
    if (version !== 'base') return fs.readFileSync(path.join(root, file), 'utf8');
    if (!sources.has(file)) sources.set(file, execFileSync('git', ['show', BASE + ':' + file], {cwd: root, encoding: 'utf8'}));
    return sources.get(file);
}
function load(version = 'working', options = {}) {
    const ctx = vm.createContext({stats: options.stats});
    for (const [,p] of read('index.html', version).matchAll(/<script src="([^"]+)"/g)) {
        if (p === 'js/main.js' || p.includes('/visualization/')) continue;
        let source=read(p,version);
        if(version==='working' && p==='js/experiment/recorder.js') {
            if(options.probe) source=source.replace('class Recorder {','class Recorder { _test_corrupt(fn) { fn(histories.get(this)); }');
            if(options.stats) source=source.replace('function copy_step(recorder, step) {','function copy_step(recorder, step) { stats.owned_step_copies++;').replace('function public_value(recorder, key) {','function public_value(recorder, key) { stats.public_queries++;');
        }
        vm.runInContext(source, ctx, {filename:p});
    }
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");};', ctx);
    return {ctx, ...vm.runInContext('({World,WorldState,WorldConfig,FeedbackConfig,ExperimentConfig,Recorder,RecordTransaction,Cell,PRNG,build_observation,build_feedback,execute_tick_transaction,determine_termination,run_experiment,run_without_agent,replay_trajectory,replay_confirmed_tick,replay_world_from_state,validate_ReplayResult,validate_replay,canonical_world_state_bytes,canonical_full_state_bytes,STATE_HASH_WORLD,STATE_HASH_FULL,validate_ReplayResult_structure,recorder_sequence_after,recorder_tick})', ctx)};
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


function ctx(t,patch={}){return {world_config:t.experiment_config.world_config,feedback_config:t.experiment_config.feedback_config,initial_state:t.initial_state,initial_events:t.events.filter(e=>e.tick===0),actions:t.steps.map(s=>s.action),expected_steps:t.steps.length,max_ticks:t.experiment_config.max_ticks,execution_mode:'WITH_AGENT',...patch};}
function replay(a,c){return a.replay_trajectory(c.initial_state,c.initial_events,c.actions,c.world_config,c.feedback_config,c.expected_steps,c.max_ticks,c.execution_mode);}
test('F4E domains modes segments and exact validation',()=>{
 const a=load();for(const mode of ['WITH_AGENT','WITHOUT_AGENT']){
 const t=(mode==='WITH_AGENT'?a.run_experiment:a.run_without_agent)(config(a,{},3)).trajectory,c=ctx(t,{execution_mode:mode}),rr=replay(a,c);
 assert.equal(rr.status,'OK');assert.equal(a.validate_ReplayResult(rr,c),true);assert.equal(a.validate_replay(t,rr,c.world_config,mode).status,'MATCH');
 assert.equal(vm.runInContext('validate_replay_continuity',a.ctx)(rr,c),true);
 for(const time of [1,Number.MAX_SAFE_INTEGER,9007199254740992n,18446744073709551614n]){const state=t.initial_state.copy();state.time=time;const rc=ctx(t,{initial_state:state,initial_events:[],max_ticks:18446744073709551615n,expected_steps:1,actions:[{type:'WAIT'}],execution_mode:mode});const r=replay(a,rc);assert.equal(r.status,'OK');assert.equal(BigInt(r.records[0].tick),BigInt(time)+1n);assert.equal(a.validate_ReplayResult(r,rc),true);}
 for(const bad of ['1',-1,1.5,NaN,Infinity,{},null,undefined,true,false,Symbol('x'),9007199254740992,1n]) {const rc=ctx(t,{expected_steps:bad});const r=replay(a,rc);assert.equal(r.status,'INVALID_REPLAY_INPUT');assert.equal(r.expected_steps_used,null);assert.equal(a.validate_ReplayResult(r,rc),true);}
 }
});
function fixture(patch={}){const a=load(),t=a.run_experiment(config(a,{},3)).trajectory,c=ctx(t,patch);return {a,t,c};}
test('F4E-02 invalid max types and independent partial counters',()=>{const {a,c}=fixture();for(const value of ['1',-1,1.5,NaN,Infinity,{},null,undefined,9007199254740992,-1n,18446744073709551616n]){const r=replay(a,{...c,max_ticks:value});assert.equal(r.status,'INVALID_REPLAY_INPUT');assert.equal(r.max_ticks_used,null);assert.equal(r.expected_steps_used,3);}const r=replay(a,{...c,max_ticks:'x',expected_steps:-1});assert.equal(r.max_ticks_used,null);assert.equal(r.expected_steps_used,null);assert.equal(r.error_message,'invalid expected_steps');});
test('F4E-03 error precedence and unused list structural validity',()=>{const {a,c}=fixture();for(const [patch,error] of [[{world_config:{},feedback_config:{},actions:null},'invalid world_config'],[{feedback_config:{},expected_steps:-1},'invalid feedback_config'],[{initial_events:[{}],actions:null},'invalid initial_events'],[{actions:null,expected_steps:-1},'invalid action structure'],[{expected_steps:-1,max_ticks:-1},'invalid expected_steps'],[{max_ticks:-1,execution_mode:null},'invalid max_ticks']]){const r=replay(a,{...c,...patch});assert.equal(r.error_message,error);assert.equal(a.validate_ReplayResult(r,{...c,...patch}),true);}assert.equal(replay(a,{...c,actions:[{type:'UNKNOWN'}],max_ticks:-1}).unused_actions,1);});
test('F4E-04 mode required including zero steps and incompatible WAIT',()=>{const {a,c}=fixture();for(const mode of [undefined,null,'bad'])assert.equal(replay(a,{...c,expected_steps:0,execution_mode:mode}).error_message,'invalid action structure');assert.equal(replay(a,{...c,actions:[{type:'MOVE_E'}],execution_mode:'WITHOUT_AGENT'}).status,'INVALID_REPLAY_INPUT');});
test('F4E-05 positive dead/zero segments no fabricated history or death',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=5;const entity=state.entities.values().next().value;entity.energy=0;entity.lifecycle='DEAD';for(const n of [0,1]){const rc={...c,initial_state:state,initial_events:[],expected_steps:n,max_ticks:5};const r=replay(a,rc);assert.equal(r.executed,0);assert.equal(r.events.length,0);assert.deepEqual(clone(r.final_state),clone(state));assert.equal(r.status,n===0?'OK':'EARLY_TERMINATION');assert.equal(a.validate_ReplayResult(r,rc),true);}});
test('F4E-06 positive origin rejects nonempty historical events',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=1;const event={type:'ENTITY_DIED',entity_id:'0987898',position:{x:0,y:0},tick:0,source:'lifecycle',sequence:0};assert.equal(replay(a,{...c,initial_state:state,initial_events:[event]}).error_message,'invalid initial_events');});
test('F4E-07 bigint operational events and absolute local sequence with WLS1',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=9007199254740991n;state.entities.values().next().value.position={x:0,y:0};const rc={...c,initial_state:state,actions:[{type:'MOVE_E'},{type:'MOVE_W'}],expected_steps:2,max_ticks:18446744073709551615n};const r=replay(a,rc);assert.equal(r.status,'OK');assert.deepEqual(Array.from(r.events,e=>e.sequence),[0,1]);assert.equal(r.events[0].tick,9007199254740992n);for(const s of r.records){assert.equal(a.STATE_HASH_FULL(s.world_state),s.state_hash_full);assert.equal(a.STATE_HASH_WORLD(s.world_state),s.state_hash_world);}assert.equal(a.validate_ReplayResult(r,rc),true);});
test('F4E-08 exact RNG restored without generation or extra draws',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=1;state.rng_state=54321;a.PRNG.prototype.next=()=>assert.fail('draw');a.World.prototype.initialize=()=>assert.fail('initialize');const r=replay(a,{...c,initial_state:state});assert.equal(r.final_state.rng_state,54321);});
test('F4E-09 UINT64 overflow atomic in existing kernel',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=18446744073709551615n;const w=a.replay_world_from_state(state,c.world_config),before=clone(w.state),rng=w.rng.get_state();assert.throws(()=>a.execute_tick_transaction(w,{type:'WAIT'},18446744073709551615n));assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);});
test('F4E-10 malformed context, different costs and predicate purity',()=>{const {a,c}=fixture();const rr=replay(a,c),valid=vm.runInContext('validate_replay_continuity',a.ctx),before=clone({rr,c});assert.equal(valid(rr,c),true);assert.equal(valid(rr,{...c,world_config:{...c.world_config,wait_cost:2}}),false);assert.equal(valid(rr,{}),false);assert.equal(valid({},c),false);assert.equal(valid(rr,{...c,extra:true}),false);assert.deepEqual(clone({rr,c}),before);});
test('F4E-11 sixteen Feedback flags and no-agent structural distinction',()=>{const a=load(),names=['expose_validity','expose_reason','expose_events','expose_energy_delta'];for(let n=0;n<16;n++){const cfg=config(a,{},2,Object.fromEntries(names.map((k,i)=>[k,Boolean(n&(1<<i))])));for(const mode of ['WITH_AGENT','WITHOUT_AGENT']){const t=(mode==='WITH_AGENT'?a.run_experiment:a.run_without_agent)(cfg).trajectory,c=ctx(t,{execution_mode:mode}),r=replay(a,c);assert.equal(a.validate_replay(t,r,c.world_config,mode).status,'MATCH');assert.equal(r.records[0].observation===null,mode==='WITHOUT_AGENT');}}});
test('F4E-12 exact signatures and no mode inference by comparators',()=>{const {a,t,c}=fixture();assert.equal(a.replay_trajectory.length,8);assert.equal(a.validate_replay.length,4);assert.equal(vm.runInContext('validate_replay_continuity.length',a.ctx),2);const rr=replay(a,c);assert.equal(a.validate_replay(t,rr,c.world_config).status,'MISMATCH');assert.equal(a.validate_replay(t,rr,c.world_config,'WITHOUT_AGENT').status,'MISMATCH');});
test('F4E-13 rollback after append on positive origin preserves prefix',()=>{const {a,c}=fixture();const state=c.initial_state.copy();state.time=7;let calls=0;const old=a.Recorder.prototype.record_step;a.Recorder.prototype.record_step=function(...args){old.apply(this,args);if(++calls===2)throw Error('after commit');};const r=replay(a,{...c,initial_state:state,max_ticks:20});assert.equal(r.status,'EXECUTION_ERROR');assert.equal(r.executed,1);assert.equal(r.final_state.time,8);assert.equal(r.records.length,1);});
test('F4E-14 legacy domain bytes equal pinned reference',()=>{const a=load(),b=load('base');equivalent(a,a.run_experiment(config(a)),b,b.run_experiment(config(b)));});
