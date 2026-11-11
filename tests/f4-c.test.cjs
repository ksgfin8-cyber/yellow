// F4-C local ownership, atomicity and equivalence evidence; not T01–T280.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {performance} = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const BASE = '635b4a493aabcf35c85ea3c5a47aca174a29c671';
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

function measured(version, n, eventful = false) {
    const m = {owned_step_copies:0, public_queries:0, historical_record_visits:0, final_visits:0,
        prefix_entries_copied:0, published_step_entries:0, published_event_entries:0, event_copies:0, hashes:0, full_checks:0,
        world_ms:0, record_ms:0, finalize_ms:0, hash_ms:0, prepare_ms:0, commit_ms:0};
    const a = load(version,{stats:m}); a.ctx.now=()=>performance.now(); a.ctx.metrics=m;
    vm.runInContext(`(() => {
        let phase='other';
        for(const [key,bucket] of [['record_step','record_ms'],['finalize','finalize_ms']]) {
            const old=Recorder.prototype[key];Recorder.prototype[key]=function(...args){
                const prior=phase;phase=key;const t=now();try{return old.apply(this,args);}finally{metrics[bucket]+=now()-t;phase=prior;}
            };
        }
        const tick=execute_tick_transaction;execute_tick_transaction=(...args)=>{const t=now();try{return tick(...args);}finally{metrics.world_ms+=now()-t;}};
        const validate=Recorder.prototype._validate_step;Recorder.prototype._validate_step=function(step,...args){
            if(phase==='finalize')metrics.final_visits++;
            if(phase==='record_step' && step.tick <= (this._history_length?this._history_length():this.steps.length))metrics.historical_record_visits++;
            return validate.call(this,step,...args);
        };
        const full=Recorder.prototype._validate_prepared;Recorder.prototype._validate_prepared=function(...args){metrics.full_checks++;return full.apply(this,args);};
        const current=Recorder.prototype._prepare_current;Recorder.prototype._prepare_current=function(...args){
            if(phase==='record_step')metrics.prefix_entries_copied+=this._history_length?this._history_length():this.steps.length;
            return current.apply(this,args);
        };
        const pub=RecordTransaction.prototype._publish;RecordTransaction.prototype._publish=function(key,value){
            if(phase==='record_step'&&key==='steps')metrics.published_step_entries+=value.length;
            if(phase==='record_step'&&key==='events')metrics.published_event_entries+=value.length;
            return pub.call(this,key,value);
        };
        const eventCopy=recorder_copy_event;recorder_copy_event=(...args)=>{metrics.event_copies++;return eventCopy(...args);};
        for(const key of ['commit','_append'])if(RecordTransaction.prototype[key]) {
            const old=RecordTransaction.prototype[key];RecordTransaction.prototype[key]=function(prepare,validate){
                if(phase!=='record_step')return old.call(this,prepare,validate);
                let callbacks=0;const wrap=f=>p=>{const t=now();try{return f(p);}finally{callbacks+=now()-t;}};
                const t=now();try{return old.call(this,wrap(prepare),wrap(validate));}finally{metrics.prepare_ms+=callbacks;metrics.commit_ms+=now()-t-callbacks;}
            };
        }
        for(const key of ['STATE_HASH_WORLD','STATE_HASH_FULL']) {
            const old=globalThis[key];globalThis[key]=(...args)=>{metrics.hashes++;const t=now();try{return old(...args);}finally{metrics.hash_ms+=now()-t;}};
        }
    })();`,a.ctx);
    const c=config(a,{width:eventful?2:1,height:1,observation_radius:0,wait_cost:0},n),start=performance.now();
    const result=eventful?a.run_experiment(c,()=>({reset(){},step(f){return {type:f.observation.self.position.x===0?'MOVE_E':'MOVE_W'};}})):a.run_without_agent(c);
    const elapsed=performance.now()-start;assert.equal(result.status,'COMPLETED');assert.equal(result.trajectory.steps.length,n);
    return {version,ticks:n,eventful,total_ms:+elapsed.toFixed(3),...Object.fromEntries(Object.entries(m).map(([k,v])=>[k,k.endsWith('_ms')?+v.toFixed(3):v]))};
}
if (benchmark) {
    const size=process.argv.find(x=>x.startsWith('--sizes='));
    const sizes=size?size.slice(8).split(',').map(Number):[10,100,500,1000];
    const versions=process.argv.includes('--working-only')?['working']:['base','working'];
    for(const n of sizes)for(const version of versions)console.log(JSON.stringify(measured(version,n,process.argv.includes('--events'))));
} else {
test('F4C-01 policy change is explicit against the independently loaded F4-B base',()=>{
    const a=load(),b=load('base'),x=setup(a,{},2),y=setup(b,{},2);
    record(x,next(x,'MOVE_E'));record(y,next(y,'MOVE_E'));
    x.r.steps[0].state_hash_full^=1;y.r.steps[0].state_hash_full^=1;
    record(x,next(x,'MOVE_S'));fail(()=>record(y,next(y,'MOVE_S')));
    assert.equal(x.r.finalize().steps.length,2);
    assert.equal(typeof x.r._test_corrupt,'undefined');
});
test('F4C-02 exact 0/1/several/100/500 tick trajectories, snapshots and WLS1 bytes equal F4-B',()=>{
    for(const n of [0,1,4,100,500]){
        const a=load(),b=load('base'),patch={width:1,height:1,observation_radius:0,wait_cost:0};
        equivalent(a,a.run_without_agent(config(a,patch,n)),b,b.run_without_agent(config(b,patch,n)));
    }
});
test('F4C-03 agents, seeded RNG and all sixteen feedback configurations preserve exact results',()=>{
    const names=['expose_validity','expose_reason','expose_events','expose_energy_delta'];
    for(let mask=0;mask<16;mask++){
        const flags=Object.fromEntries(names.map((k,i)=>[k,Boolean(mask&(1<<i))])),a=load(),b=load('base');
        const types=['MOVE_E','MOVE_S','MOVE_N','MOVE_W'];
        equivalent(a,manual(a,types,{},flags).trajectory,b,manual(b,types,{},flags).trajectory);
    }
    const a=load(),b=load('base'),c=a=>new a.ExperimentConfig({...config(a,{},12),agent_type:'random'});
    equivalent(a,a.run_experiment(c(a)),b,b.run_experiment(c(b)));
});
test('F4C-04 initial/later death, regeneration, hazards, events and initialization failure remain equivalent',()=>{
    for(const patch of [{initial_energy:0},{initial_energy:1},{initial_energy:3,resource_effect:0,hazard_damage:20},{resource_regeneration:0},{}]){
        const a=load(),b=load('base');
        equivalent(a,manual(a,['MOVE_E','MOVE_S','MOVE_N','MOVE_W'],patch).trajectory,b,manual(b,['MOVE_E','MOVE_S','MOVE_N','MOVE_W'],patch).trajectory);
    }
    const a=load(),b=load('base');equivalent(a,a.run_experiment(config(a,{obstacle_density:1})),b,b.run_experiment(config(b,{obstacle_density:1})));
});
test('F4C-05 public queries and retained staging values never expose mutable internal history',()=>{
    const f=setup(load(),{},2);record(f,next(f,'MOVE_E'));const before=saved(f);
    const readers=[()=>({steps:f.r.steps,events:f.r.events,initial_state:f.r.initial_state}),()=>f.r._prepare_current(),()=>f.r._export_prefix()];
    for(const read of readers){const x=read(),steps=x.steps||x.records;steps[0].world_state.entities.get('0987898').energy=-99;
        steps[0].entity_states.clear();steps[0].action_result.events[0].position.x=99;x.events.length=0;
        if(x.initial_state)x.initial_state.grid[0][1].effect.stock=0;
        assert.deepEqual(saved(f),before);
    }
    const prior=f.r._prior_action_result(),last=f.r._last_state();prior.events.length=0;last.entities.clear();assert.deepEqual(saved(f),before);
    record(f,next(f,'MOVE_S'));const t=f.r.finalize(),kept=clone(t);t.steps[0].world_state.entities.clear();t.events.length=0;
    assert.deepEqual(clone(f.r.finalize()),kept);
});
test('F4C-06 all seven external property replacements are rejected and Map snapshots stay independent',()=>{
    const f=setup();record(f,next(f,'MOVE_E'));
    for(const key of fields)unchanged(f,()=>fail(()=>{f.r[key]=null;}));
    const steps=f.r.steps,map=steps[0].entity_states;map.set('fake',{id:'fake'});map.delete('0987898');
    assert.equal(f.r.steps[0].entity_states.size,1);assert.equal(Object.isFrozen(map),false);
});
test('F4C-07 publication hooks retaining prepared values cannot mutate adopted steps or events',()=>{
    const a=load(),f=setup(a,{},1),old=a.RecordTransaction.prototype._publish,retained=[];
    a.RecordTransaction.prototype._publish=function(key,value){if(key==='steps'||key==='events')retained.push(value);return old.call(this,key,value);};
    record(f,next(f,'MOVE_E'));const before=saved(f);
    for(const list of retained){if(list[0]?.world_state)list[0].world_state.entities.clear();else if(list[0])list[0].position.x=99;list.length=0;}
    assert.deepEqual(saved(f),before);f.r.finalize();
});
test('F4C-08 internally induced corruption is detected exhaustively without normalizing it away',()=>{
    const corruptions=[h=>h.steps[0].state_hash_full^=1,h=>h.steps[0].extra=1,
        h=>h.steps[0].entity_states.get('0987898').energy++,h=>h.steps[0].entity_states.get('0987898').extra=1,
        h=>h.steps[0].action.extra=1,h=>h.steps[0].action_result.extra=1,h=>h.events.pop(),h=>h.sequence_counter++,
        h=>h.steps[0].world_state.rng_state=0,h=>h.steps[0].world_state.entities.get('0987898').energy++];
    for(const corrupt of corruptions){const a=load('working',{probe:true}),f=setup(a,{},1);record(f,next(f,'MOVE_E'));f.r._test_corrupt(corrupt);fail(()=>f.r.finalize());}
});
test('F4C-09 opaque owner-bound checkpoints restore lengths/scalars and cannot restore discarded future data',()=>{
    const f=setup(),token=f.r._checkpoint(),before=saved(f);
    assert.deepEqual(Reflect.ownKeys(token),[]);assert.ok(Object.isFrozen(token));
    const input=record(f,next(f,'MOVE_E'));const future=f.r._checkpoint();f.r._restore_checkpoint(token);assert.deepEqual(saved(f),before);
    fail(()=>f.r._restore_checkpoint(future));fail(()=>f.r._restore_checkpoint({}));fail(()=>setup(f.a).r._restore_checkpoint(token));
    record(f,input);fail(()=>f.r._restore_checkpoint(future));
});
test('F4C-10 failures in preparation, hashes and incremental validation are atomic and retryable',()=>{
    for(const phase of ['prepare','validate','STATE_HASH_WORLD','STATE_HASH_FULL','serialize_world_state']){
        const a=load(),f=setup(a,{},2);record(f,next(f,'MOVE_E'));const i=next(f,'MOVE_S'),world=clone(f.w.state),rng=f.w.rng.get_state();let restore,hits=0;
        if(phase==='prepare'||phase==='validate'){
            const key=phase==='prepare'?'_prepare_step_input':'_validate_append',old=f.r[key];
            f.r[key]=function(...args){old.apply(this,args);hits++;throw Error(phase);};restore=()=>{f.r[key]=old;};
        }else{const old=vm.runInContext(phase,a.ctx);a.ctx.fault=()=>{hits++;throw Error(phase);};vm.runInContext(phase+'=fault',a.ctx);restore=()=>{a.ctx.fault=old;vm.runInContext(phase+'=fault',a.ctx);};}
        unchanged(f,()=>fail(()=>record(f,i)));assert.equal(hits,1);assert.deepEqual(clone(f.w.state),world);assert.equal(f.w.rng.get_state(),rng);
        restore();record(f,i);assert.equal(f.r.finalize().steps.length,2);
    }
});
test('F4C-11 ownership-copy failure before append consumes nothing',()=>{
    const a=load(),f=setup(a,{},1),i=next(f,'MOVE_E'),before=saved(f),oldValidate=f.r._validate_append,oldCopy=a.WorldState.prototype.copy;let copying=false,hits=0;
    f.r._validate_append=function(...args){const r=oldValidate.apply(this,args);copying=true;return r;};
    a.WorldState.prototype.copy=function(...args){if(copying){hits++;throw Error('adoption copy');}return oldCopy.apply(this,args);};
    fail(()=>record(f,i));a.WorldState.prototype.copy=oldCopy;f.r._validate_append=oldValidate;
    assert.equal(hits,1);assert.deepEqual(saved(f),before);record(f,i);f.r.finalize();
});
test('F4C-12 fault after every publication, including append and last scalar, restores the exact prefix',()=>{
    for(let at=1;at<=7;at++){
        const a=load(),f=setup(a,{},2);record(f,next(f,'MOVE_E'));const i=next(f,'MOVE_S'),old=a.RecordTransaction.prototype._publish;let hits=0;
        a.RecordTransaction.prototype._publish=function(...args){old.apply(this,args);if(++hits===at)throw Error('publication');};
        unchanged(f,()=>fail(()=>record(f,i)));assert.equal(hits,at);a.RecordTransaction.prototype._publish=old;record(f,i);
        assert.deepEqual(Array.from(f.r.finalize().events,e=>e.sequence),[0,1,2,3]);
    }
});
test('F4C-13 reentrant writes are rejected and roll back the outer transition',()=>{
    const a=load(),f=setup(a,{},1),i=next(f,'MOVE_E'),old=a.RecordTransaction.prototype._publish;let hits=0;
    a.RecordTransaction.prototype._publish=function(...args){old.apply(this,args);if(hits++===0)f.r.record_step(i.confirmed,i.observation,i.feedback,i.action);};
    unchanged(f,()=>fail(()=>record(f,i)));a.RecordTransaction.prototype._publish=old;record(f,i);f.r.finalize();
});
function request(t,patch={}){return {initial_state:t.initial_state,initial_events:t.events.filter(e=>e.tick===0),actions:t.steps.map(s=>s.action),world_config:t.experiment_config.world_config,feedback_config:t.experiment_config.feedback_config,expected_steps:t.steps.length,max_ticks:t.experiment_config.max_ticks,...patch};}
function replay(a,c){return a.replay_trajectory(c.initial_state,c.initial_events,c.actions,c.world_config,c.feedback_config,c.expected_steps,c.max_ticks);}
test('F4C-14 EXPERIMENT -> replay -> contextual validation preserves full data and MATCH',()=>{
    const a=load(),t=manual(a,['MOVE_E','MOVE_S','MOVE_N','MOVE_W']).trajectory,c=request(t),rr=replay(a,c);
    assert.equal(rr.status,'OK');assert.equal(a.validate_ReplayResult(rr,c),true);assert.equal(a.validate_replay(t,rr,c.world_config).status,'MATCH');
    assert.deepEqual(clone(rr.records),clone(t.steps));assert.deepEqual(clone(rr.events),clone(t.events));
});
test('F4C-15 replay retains all seven statuses and the exact independent F4-B results',()=>{
    const a=load(),b=load('base'),ta=a.run_experiment(config(a)).trajectory,tb=b.run_experiment(config(b)).trajectory;
    for(const [status,patch] of [['OK',{}],['MAX_TICKS_REACHED',{max_ticks:0}],['INCOMPLETE_ACTION_SEQUENCE',{actions:[]}],['UNKNOWN_ACTION',{actions:[{type:'UNKNOWN'}]}],['INVALID_REPLAY_INPUT',{actions:null}]]){
        const x=replay(a,request(ta,patch)),y=replay(b,request(tb,patch));assert.equal(x.status,status);assert.deepEqual(clone(x),clone(y));
    }
    const da=a.run_experiment(config(a,{initial_energy:0})).trajectory,db=b.run_experiment(config(b,{initial_energy:0})).trajectory;
    const x=replay(a,request(da,{expected_steps:1})),y=replay(b,request(db,{expected_steps:1}));assert.equal(x.status,'EARLY_TERMINATION');assert.deepEqual(clone(x),clone(y));
    for(const api of [a,b]){let n=0;const old=api.World.prototype.advance_dynamics;api.World.prototype.advance_dynamics=function(){if(++n===2)throw Error('fault');return old.call(this);};}
    const ex=replay(a,request(ta)),ey=replay(b,request(tb));assert.equal(ex.status,'EXECUTION_ERROR');assert.deepEqual(clone(ex),clone(ey));
});
test('F4C-16 late Recorder error restores WORLD, divergent RNG and private history checkpoints',()=>{
    const a=load(),t=a.run_experiment(config(a)).trajectory,c=t.experiment_config,w=a.replay_world_from_state(t.initial_state,c.world_config),r=new a.Recorder(c);
    r.record_initial_state(t.initial_state);r.record_initial_lifecycle_from_recorded([]);
    a.replay_confirmed_tick(w,r,{type:'WAIT'},c.feedback_config,c.max_ticks);w.rng.next();
    const f={r},before=clone(w.state),rng=w.rng.get_state(),old=r.record_step;
    r.record_step=function(...args){old.apply(this,args);throw Error('after append');};
    unchanged(f,()=>fail(()=>a.replay_confirmed_tick(w,r,{type:'WAIT'},c.feedback_config,c.max_ticks)));
    assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
});
test('F4C-17 uint64 representation, Number limits and sequence overflow are preserved',()=>{
    const a=load(),f=setup(a,{},1n),r=new a.Recorder(f.c);f.w.state.time=0n;r.record_initial_state(f.w.full_snapshot());r.record_initial_lifecycle_from_world([]);f.r=r;
    record(f,next(f,'MOVE_E'));const t=r.finalize();assert.equal(t.steps[0].tick,1);assert.equal(t.steps[0].world_state.time,1n);
    assert.equal(a.recorder_sequence_after(Number.MAX_SAFE_INTEGER),9007199254740992n);
    for(const bad of [9007199254740992,9007199254740992n,-1,'1'])fail(()=>a.recorder_tick(bad));
    const raw=[{type:'ENTITY_MOVED',entity_id:'0987898',position:{x:0,y:0}}];
    const events=r._prepare_events(raw,1,'action',Number.MAX_SAFE_INTEGER);assert.equal(events.sequence_counter,9007199254740992n);
    fail(()=>r._prepare_events(raw,1,'action',events.sequence_counter));
});
test('F4C-18 recording and finalize never access live WORLD or PRNG',()=>{
    const f=setup(load(),{},1),i=next(f,'MOVE_E'),before=clone(f.w.state),rng=f.w.rng.get_state();
    for(const key of ['apply_action','advance_dynamics','resolve_lifecycle','sync_rng_state'])f.w[key]=()=>assert.fail(key);
    Object.defineProperty(f.w,'rng',{get(){assert.fail('RNG');}});f.a.PRNG.prototype.next=()=>assert.fail('PRNG');
    record(f,i);f.r.finalize();assert.deepEqual(clone(f.w.state),before);assert.ok(rng>0);
});
test('F4C-19 work counters prove no old-record visits, no prefix copies and no mandatory snapshot queries',()=>{
    for(const n of [10,100,500]){
        const m=measured('working',n,true);assert.equal(m.historical_record_visits,0);assert.equal(m.prefix_entries_copied,0);
        assert.equal(m.published_step_entries,n);assert.equal(m.owned_step_copies,2*n);assert.equal(m.public_queries,0);
        assert.equal(m.published_event_entries,n);assert.equal(m.event_copies,5*n);
        assert.equal(m.final_visits,n);assert.equal(m.hashes,6*n);assert.equal(m.full_checks,3);
    }
});
test('F4C-20 replay exports the growing prefix once, with no per-tick full query/copy',()=>{
    const m={owned_step_copies:0,public_queries:0},a=load('working',{stats:m}),t=a.run_experiment(config(a,{},20)).trajectory;
    m.owned_step_copies=0;m.public_queries=0;const c=request(t),rr=replay(a,c);assert.equal(rr.status,'OK');
    assert.equal(m.public_queries,0);assert.equal(m.owned_step_copies,40);assert.equal(a.validate_ReplayResult(rr,c),true);
});
}
