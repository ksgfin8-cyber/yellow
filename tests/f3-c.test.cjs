const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function load(){
    const ctx=vm.createContext({});
    for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
        vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});if(src==='js/interface/feedback.js')break;
    }
    for(const src of ['experiment_config.js','trajectory.js','hash_state.js','recorder.js','tick_transaction.js'])vm.runInContext(fs.readFileSync(path.join(root,'js/experiment',src),'utf8'),ctx,{filename:src});
    vm.runInContext('Math.random=()=>{throw new Error("random forbidden");}',ctx);
    return {ctx,...vm.runInContext('({Recorder,RecordTransaction,validate_RecordedEvent,World,WorldState,WorldConfig,FeedbackConfig,ExperimentConfig,Cell,InitializationError,ContractError,build_observation,build_feedback,execute_tick_transaction,determine_termination})',ctx)};
}
const api=load(),clone=x=>structuredClone(x),keys=x=>Array.from(Reflect.ownKeys(x)).sort();
function base(patch={},a=api){const c=new a.ExperimentConfig({experiment_seed:1,max_ticks:10,agent_type:'wait',feedback_config:a.FeedbackConfig.defaults(),world_config:{...a.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:2,wait_cost:1,hazard_damage:5,resource_effect:0,...patch}});const w=new a.World(c.world_config),initial=w.initialize(1),r=new a.Recorder(c);return {a,c,w,initial,r};}
function ready(patch={},a=api){const f=base(patch,a);f.r.record_initial_state(f.initial.world_state);f.r.record_initial_lifecycle_from_world(f.initial.initial_events);return f;}
function material(patch={},a=api){const f=base(patch,a);f.w.get_experimental_entity().position={x:1,y:1};f.w.state.grid[1][2]=new a.Cell('FREE',{kind:'HAZARD'});f.r.record_initial_state(f.w.full_snapshot());f.r.record_initial_lifecycle_from_world([]);f.o=a.build_observation(f.w,f.w.get_experimental_entity(),1);f.fb=a.build_feedback(f.o,null,f.c.feedback_config);f.action={type:'MOVE_E'};f.confirmed=a.execute_tick_transaction(f.w,f.action,10);return f;}
function state(r){return clone({initial_state:r.initial_state,steps:r.steps,events:r.events,sequence_counter:r.sequence_counter,initialization_failure:r.initialization_failure,initial_lifecycle:r._initial_lifecycle_recorded,termination_reason:r.termination_reason});}
const failed=fn=>assert.throws(fn,{name:'ContractError',message:'recording failed'});
function unchanged(r,fn){const before=state(r);const value=fn();assert.deepEqual(state(r),before);return value;}

test('F3C-01: initial state copied deeply without WORLD writes or RNG consumption',()=>{
    const {w,initial,r}=base();const before=clone(w.state),rng=w.rng.get_state();r.record_initial_state(initial.world_state);assert.deepEqual(clone(r.initial_state),clone(initial.world_state));assert.notEqual(r.initial_state,initial.world_state);
    initial.world_state.entities.get('0987898').energy=999;assert.equal(r.initial_state.entities.get('0987898').energy,10);assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
});
test('F3C-02 recovered: initial death enriches exact RecordedEvent with tick0/lifecycle/sequence0',()=>{
    const {r,initial}=ready({initial_energy:0});assert.equal(r.events.length,1);assert.equal(r.sequence_counter,1);const e=r.events[0];assert.deepEqual(keys(e),['entity_id','position','sequence','source','tick','type']);assert.equal(e.tick,0);assert.equal(e.source,'lifecycle');assert.equal(e.sequence,0);assert.equal(e.type,'ENTITY_DIED');assert.equal(api.validate_RecordedEvent(e),true);assert.deepEqual(clone(initial.initial_events[0].position),clone(e.position));assert.deepEqual(keys(initial.initial_events[0]),['entity_id','position','type']);
});
test('F3C-03: death at tick zero finalizes initial-only trajectory with independent snapshots',()=>{
    const {r,w,c}=ready({initial_energy:0});r.set_termination_reason(api.determine_termination(w,c.max_ticks));const t=r.finalize();assert.equal(t.steps.length,0);assert.equal(t.events.length,1);assert.equal(t.initial_state.time,0);assert.equal(t.termination_reason,'ENTITY_DIED');t.events[0].position.x=99;t.initial_state.entities.get('0987898').energy=123;assert.notEqual(r.events[0].position.x,99);assert.equal(r.initial_state.entities.get('0987898').energy,0);
});
test('F3C-04: empty initial replay is valid, consumes no sequence and does not enrich',()=>{
    const {r,initial}=base();r.record_initial_state(initial.world_state);r._prepare_events=()=>assert.fail('re-enrichment');r.record_initial_lifecycle_from_recorded([]);assert.equal(r.sequence_counter,0);assert.equal(r.events.length,0);
});
test('F3C-05: replay preserves existing metadata exactly, independently of input',()=>{
    const source=ready({initial_energy:0}),target=base({initial_energy:0});target.r.record_initial_state(target.initial.world_state);const events=clone(source.r.events),before=clone(events);target.r._prepare_events=()=>assert.fail('re-enrichment');target.r.record_initial_lifecycle_from_recorded(events);assert.deepEqual(clone(target.r.events),before);assert.equal(target.r.sequence_counter,1);events[0].position.y=99;assert.notEqual(target.r.events[0].position.y,99);
});
test('F3C-06: reject duplicate calls, enriched input to world path and raw input to replay path',()=>{
    const {r,initial}=ready({initial_energy:0});unchanged(r,()=>failed(()=>r.record_initial_lifecycle_from_world(initial.initial_events)));unchanged(r,()=>failed(()=>r.record_initial_lifecycle_from_recorded(r.events)));
    const f=base({initial_energy:0});f.r.record_initial_state(f.initial.world_state);unchanged(f.r,()=>failed(()=>f.r.record_initial_lifecycle_from_world(r.events)));unchanged(f.r,()=>failed(()=>f.r.record_initial_lifecycle_from_recorded(f.initial.initial_events)));
});
test('F3C-07: recorded schemas/domains reject source/type/time/sequence/position corruption',()=>{
    const {r}=ready({initial_energy:0}),e=r.events[0];assert.equal(api.validate_RecordedEvent({...e,tick:Number.MAX_SAFE_INTEGER,sequence:Number.MAX_SAFE_INTEGER}),true);for(const bad of [{...e,extra:1},{...e,source:'world'},{...e,source:'action'},{...e,tick:0n},{...e,tick:NaN},{...e,sequence:-1},{...e,sequence:1n},{...e,sequence:0.5},{...e,sequence:Number.MAX_SAFE_INTEGER+1},{...e,position:null}])assert.equal(api.validate_RecordedEvent(bad),false);
});
test('F3C-08: replay rejects nonzero start, duplicate death, wrong tick/id and changed position',()=>{
    const source=ready({initial_energy:0}),e=source.r.events[0];for(const events of [[{...e,sequence:1}],[e,e],[{...e,tick:1}],[{...e,entity_id:'other'}],[{...e,position:{x:99,y:99}}]]){const f=base({initial_energy:0});f.r.record_initial_state(f.initial.world_state);unchanged(f.r,()=>failed(()=>f.r.record_initial_lifecycle_from_recorded(events)));}
});
test('F3C-09: initialization failure uses §20.5 four-field data outside Trajectory, never fake success',()=>{
    const c=new api.ExperimentConfig({experiment_seed:1,max_ticks:0n,agent_type:'wait',world_config:{...api.WorldConfig.defaults(),obstacle_density:1},feedback_config:api.FeedbackConfig.defaults()});let error;try{new api.World(c.world_config).initialize(42);}catch(e){error=e;}
    const r=new api.Recorder(c),failure=r.record_initialization_failure(error,c);assert.deepEqual(keys(failure),['experiment_config','message','reason','seed']);assert.equal(failure.seed,42);assert.equal(failure.reason,'invalid initial_position');assert.equal(failure.experiment_config.max_ticks,0n);assert.equal(r.initial_state,null);assert.equal(r.steps.length,0);assert.equal(r.events.length,0);unchanged(r,()=>failed(()=>r.finalize()));failure.experiment_config.world_config.width=999;assert.notEqual(r.initialization_failure.experiment_config.world_config.width,999);
});
test('F3C-10: unrelated errors cannot be disguised as initialization failures',()=>{
    const {r}=base();for(const error of [new Error('allocation'),{seed:1,reason:'invalid initial_position',message:'x'},Object.assign(new api.InitializationError(),{seed:0}),Object.assign(new api.InitializationError(),{seed:1,reason:'insufficient resources'})])unchanged(r,()=>failed(()=>r.record_initialization_failure(error)));
});
test('F3C-11: initial state/lifecycle/event preparation faults do not publish changes',()=>{
    const a=load(),f=base({initial_energy:0},a),snapshot=a.WorldState.prototype.full_snapshot;let allocations=0;a.WorldState.prototype.full_snapshot=()=>{allocations++;throw new RangeError('allocation');};unchanged(f.r,()=>failed(()=>f.r.record_initial_state(f.initial.world_state)));assert.equal(allocations,1);a.WorldState.prototype.full_snapshot=snapshot;f.r.record_initial_state(f.initial.world_state);f.r._prepare_events=()=>{throw new RangeError('event allocation');};unchanged(f.r,()=>failed(()=>f.r.record_initial_lifecycle_from_world(f.initial.initial_events)));
});
test('F3C-12: failed confirmation restores steps/events/counter/flags jointly, including late failure',()=>{
    for(const failAt of [1,3,4,7]){const a=load(),f=base({initial_energy:0},a);f.r.record_initial_state(f.initial.world_state);const original=a.RecordTransaction.prototype._publish;let calls=0;
        a.RecordTransaction.prototype._publish=function(...args){original.apply(this,args);if(++calls===failAt)throw new Error('commit fault');};
        unchanged(f.r,()=>failed(()=>f.r.record_initial_lifecycle_from_world(f.initial.initial_events)));assert.equal(f.r.sequence_counter,0);assert.equal(f.r.events.length,0);assert.equal(calls,failAt);
    }
});
test('F3C-13 P01: provisional sequence batches increase globally, not per tick; owner untouched',()=>{
    const {r}=ready(),raw={type:'ENTITY_MOVED',entity_id:'0987898',position:{x:1,y:1}};unchanged(r,()=>{const a=r._prepare_events([raw],1,'action');const b=r._prepare_events([raw],2,'action',a.sequence_counter);assert.equal(a.events[0].sequence,0);assert.equal(b.events[0].sequence,1);assert.equal(b.sequence_counter,2);});
});
test('F3C-14 P01: allow last safe sequence, retain exact next counter, reject overflow without publication',()=>{
    const {r}=ready(),raw={type:'ENTITY_MOVED',entity_id:'0987898',position:{x:1,y:1}};unchanged(r,()=>{const batch=r._prepare_events([raw],1,'action',Number.MAX_SAFE_INTEGER);assert.equal(batch.events[0].sequence,Number.MAX_SAFE_INTEGER);assert.equal(batch.sequence_counter,9007199254740992n);failed(()=>r._prepare_events([raw],2,'action',batch.sequence_counter));failed(()=>r._prepare_events([raw,raw],1,'action',Number.MAX_SAFE_INTEGER));});
});
test('F3C-15 P02: real confirmed preparation has lifecycle in independent Map, no StepRecord/hash fields',()=>{
    const f=material(),p=unchanged(f.r,()=>f.r._prepare_step(f.confirmed,f.o,f.fb,f.action));assert.equal(p.tick,1);assert.equal(p.entity_states.size,1);const e=p.entity_states.get('0987898');assert.deepEqual(keys(e),['energy','id','lifecycle','position']);assert.equal(e.lifecycle,'ACTIVE');assert.equal(e.energy,3);assert.notEqual(e.position,p.snapshot.entities.get('0987898').position);assert.equal(Object.hasOwn(p,'state_hash_world'),false);assert.equal(Object.hasOwn(p,'world_state'),false);assert.equal(f.r.steps.length,0);
});
test('F3C-16: movement→hazard→death events prepare correct sources/order without counter commit',()=>{
    const f=material({initial_energy:2}),p=unchanged(f.r,()=>f.r._prepare_step(f.confirmed,f.o,f.fb,f.action));assert.deepEqual(Array.from([...p.action_events,...p.lifecycle_events],e=>[e.type,e.source,e.sequence]),[['ENTITY_MOVED','action',0],['HAZARD_TRIGGERED','action',1],['ENTITY_DIED','lifecycle',2]]);assert.equal(p.sequence_after,3);assert.equal(f.r.sequence_counter,0);assert.equal(f.r.events.length,0);
});
test('F3C-17: lossless safe BigInt tick boundary accepted; unrepresentable tick rejected',()=>{
    const f=material();const safe={...f.confirmed,tick:1n};const p=f.r._prepare_step(safe,f.o,f.fb,f.action);assert.equal(p.tick,1);assert.equal(typeof p.tick,'number');for(const tick of [9007199254740992n,0xffffffffffffffffn,Number.MAX_SAFE_INTEGER+1])unchanged(f.r,()=>{failed(()=>f.r._prepare_step({...f.confirmed,tick},f.o,f.fb,f.action));failed(()=>f.r.record_step({...f.confirmed,tick},f.o,f.fb,f.action));});
});
test('F3C-18 corrected P0-3: null observation/feedback paired, action nonnull and real WAIT',()=>{
    const {r,w}=ready();const wait={type:'WAIT'},confirmed=api.execute_tick_transaction(w,wait,10),p=r._prepare_step(confirmed,null,null,wait);assert.equal(p.context.action.type,'WAIT');assert.equal(p.context.action_result.energy_delta,-1);assert.equal(p.context.observation,null);assert.equal(p.context.feedback,null);assert.equal(p.action_events.length,0);
    for(const [o,fb,a] of [[null,null,null],[null,null,{type:'MOVE_E'}],[{tick:0},null,wait],[null,{},wait]])unchanged(r,()=>{assert.throws(()=>r._prepare_step(confirmed,o,fb,a),api.ContractError);failed(()=>r.record_step(confirmed,o,fb,a));});
});
test('F3C-19: retained preparations and snapshots are independent from all caller inputs',()=>{
    const f=material(),p=f.r._prepare_step(f.confirmed,f.o,f.fb,f.action),before=clone(p);f.confirmed.world_state.entities.get('0987898').energy=999;f.confirmed.action_events[0].position.x=99;f.o.self.position.y=99;f.fb.observation.self.energy=999;f.action.type='WAIT';assert.deepEqual(clone(p),before);p.snapshot.entities.get('0987898').position.x=88;assert.notEqual(f.w.get_experimental_entity().position.x,88);
});
test('F3C-20: WLS1 blocker never calls legacy hashes or publishes any StepRecord',()=>{
    const a=load(),f=material({},a),world=clone(f.w.state),rng=f.w.rng.get_state();a.ctx.forbid=()=>assert.fail('legacy hash');vm.runInContext('STATE_HASH_WORLD=forbid;STATE_HASH_FULL=forbid;serialize_world_state=forbid;',a.ctx);unchanged(f.r,()=>failed(()=>f.r.record_step(f.confirmed,f.o,f.fb,f.action)));assert.deepEqual(clone(f.w.state),world);assert.equal(f.w.rng.get_state(),rng);assert.equal(f.r.steps.length,0);
});
test('F3C-21: malformed confirmed/context/raw events fail with no effects or double enrichment',()=>{
    const f=material();for(const confirmed of [{...f.confirmed,extra:1},{...f.confirmed,action_events:[{...f.confirmed.action_events[0],tick:1}]},{...f.confirmed,action_events:[]}])unchanged(f.r,()=>{assert.throws(()=>f.r._prepare_step(confirmed,f.o,f.fb,f.action),api.ContractError);failed(()=>f.r.record_step(confirmed,f.o,f.fb,f.action));});
    const flagNames=['expose_validity','expose_reason','expose_events','expose_energy_delta'];
    for(let mask=0;mask<16;mask++){
        const flags=Object.fromEntries(flagNames.map((name,i)=>[name,Boolean(mask&(1<<i))]));
        const r=new api.Recorder(new api.ExperimentConfig({...f.c,feedback_config:flags}));
        const projection=api.build_feedback(f.o,f.confirmed.action_result,flags);
        assert.deepEqual(clone(r._copy_feedback(projection,f.o)),clone(projection));
    }
    const bad=clone(f.fb);bad.observation.tick=1;assert.throws(()=>f.r._prepare_step(f.confirmed,f.o,bad,f.action),api.ContractError);unchanged(f.r,()=>failed(()=>f.r.record_step(f.confirmed,f.o,bad,f.action)));
});
test('F3C-22: no WORLD/lifecycle/RNG/Recorder callbacks; preparation deterministic and pure',()=>{
    const f=material(),before=clone(f.confirmed),rng=f.w.rng.get_state();for(const key of ['resolve_lifecycle','sync_rng_state','apply_action'])f.w[key]=()=>assert.fail(key);Object.defineProperty(f.w,'rng',{get(){assert.fail('WORLD RNG');}});
    const a=f.r._prepare_step(f.confirmed,f.o,f.fb,f.action),b=f.r._prepare_step(f.confirmed,f.o,f.fb,f.action);assert.deepEqual(clone(a),clone(b));assert.deepEqual(clone(f.confirmed),before);assert.ok(rng>0);
});

test('F3C-23 integration: replay rejects a last MAX_SAFE sequence before publication, without relaxing initial coherence',()=>{
    const source=ready({initial_energy:0}),target=base({initial_energy:0});
    target.r.record_initial_state(target.initial.world_state);
    const event={...clone(source.r.events[0]),sequence:Number.MAX_SAFE_INTEGER};
    assert.equal(api.validate_RecordedEvent(event),true); // valid metadata, invalid initial start
    const world=clone(target.w.state),rng=target.w.rng.get_state();
    unchanged(target.r,()=>failed(()=>target.r.record_initial_lifecycle_from_recorded([event])));
    assert.equal(target.r.sequence_counter,0);
    assert.equal(target.r._initial_lifecycle_recorded,false);
    assert.deepEqual(clone(target.w.state),world);assert.equal(target.w.rng.get_state(),rng);
});
test('F3C-24 integration: replay next-counter calculation promotes exactly at MAX_SAFE without widening event sequence',()=>{
    const next=vm.runInContext('recorder_sequence_after',api.ctx),{r}=ready();
    unchanged(r,()=>{
        assert.equal(next(0),1);
        assert.equal(next(Number.MAX_SAFE_INTEGER-1),Number.MAX_SAFE_INTEGER);
        const after=next(Number.MAX_SAFE_INTEGER);
        assert.equal(after,9007199254740992n);assert.equal(typeof after,'bigint');
        assert.equal(after+1n,9007199254740993n);
        for(const invalid of [9007199254740992,9007199254740992n,Number.MAX_SAFE_INTEGER.toString(),-1,NaN])failed(()=>next(invalid));
    });
});
