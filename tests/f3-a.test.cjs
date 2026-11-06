const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function load(){
    const ctx=vm.createContext({});
    for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
        vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
        if(src==='js/interface/action_result.js')break;
    }
    vm.runInContext(fs.readFileSync(path.join(root,'js/experiment/tick_transaction.js'),'utf8'),ctx,{filename:'tick_transaction.js'});
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
    return {ctx,...vm.runInContext('({World,WorldState,WorldConfig,Cell,PRNG,ContractError,determine_termination,execute_tick,execute_tick_transaction,validate_TickResult,validate_ConfirmedTickResult,tick_exact_increment,validate_WorldState})',ctx)};
}
const api=load(),clone=x=>structuredClone(x),keys=x=>Array.from(Reflect.ownKeys(x)).sort();
const WAIT={type:'WAIT'},EAST={type:'MOVE_E'};
function fixture(patch={},a=api){
    const w=new a.World(new a.WorldConfig({...a.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:2,wait_cost:1,resource_effect:5,hazard_damage:7,resource_regeneration:1,...patch}));
    w.initialize(1);w.get_experimental_entity().position={x:1,y:1};return w;
}
function effect(w,kind,stock=1,a=api){w.state.grid[1][2]=new a.Cell('FREE',kind==='RESOURCE'?{kind,stock}:{kind});}
function unchanged(w,fn){const before=clone(w.state),rng=w.rng.get_state();const r=fn();assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);return r;}
const failed=fn=>assert.throws(fn,{name:'ContractError',message:'world transition failed'});
const invalidMax=fn=>assert.throws(fn,{name:'ContractError',message:'invalid max_ticks'});
function raw(events){for(const e of events){assert.deepEqual(keys(e),['entity_id','position','type']);assert.deepEqual(keys(e.position),['x','y']);}}
function traceFixture(){
    const a=load(),w=fixture({},a),trace=[];
    for(const method of ['apply_action','resolve_lifecycle','advance_dynamics','sync_rng_state']){
        const original=w[method];w[method]=function(...args){trace.push([method,this.state.time,this.get_experimental_entity().energy,this.get_experimental_entity().lifecycle]);return original.apply(this,args);};
    }
    return {a,w,trace};
}
function injectedFailure(method){
    const a=load(),w=fixture(method==='resolve_lifecycle'?{initial_energy:2,resource_effect:0}:{},a);effect(w,'RESOURCE',1,a);const before=clone(w.state),rng=w.rng.get_state();
    const original=w[method];w[method]=function(...args){const result=original.apply(this,args);this.state.grid[0][0]=a.Cell.blocked();this.rng.next();throw new Error('injected '+method);};
    failed(()=>a.execute_tick_transaction(w,EAST,10));assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
}

test('F3A-01 P02: exact TickResult and real movement/energy without temporal commit',()=>{
    const w=fixture(),r=api.execute_tick(w,EAST);assert.deepEqual(keys(r),['action_events','action_result','lifecycle_events']);assert.equal(api.validate_TickResult(r),true);
    assert.deepEqual(clone(w.get_experimental_entity().position),{x:2,y:1});assert.equal(w.get_experimental_entity().energy,8);assert.equal(w.state.time,0);
});
test('F3A-02 P03: exact ConfirmedTickResult and post-transition snapshot',()=>{
    const w=fixture(),r=api.execute_tick_transaction(w,EAST,10);assert.deepEqual(keys(r),['action_events','action_result','lifecycle_events','termination','tick','world_state']);
    assert.equal(r.tick,1);assert.equal(r.world_state.time,1);assert.deepEqual(clone(r.world_state),clone(w.state));assert.equal(api.validate_ConfirmedTickResult(r,w,null),true);
    assert.equal(api.validate_ConfirmedTickResult({...r,extra:1},w,null),false);
    assert.equal(api.validate_ConfirmedTickResult({...r,tick:2},w,null),false);
    assert.equal(api.validate_ConfirmedTickResult({...r,tick:1n},w,null),true);
    assert.equal(api.validate_ConfirmedTickResult({...r,world_state:w.state},w,null),false);
    assert.equal(api.validate_ConfirmedTickResult({...r,termination:'MAX_TICKS_REACHED'},w,null),false);
    const wrong=r.world_state.copy();wrong.entities.get('0987898').energy=123;
    assert.equal(api.validate_ConfirmedTickResult({...r,world_state:wrong},w,null),false);
    assert.equal(api.validate_TickResult({...r,action_events:[]}),false);
});
test('F3A-03: action/lifecycle WorldEvent stay raw and closed, with no Recorder metadata',()=>{
    const w=fixture({initial_energy:2,hazard_damage:5});effect(w,'HAZARD');const r=api.execute_tick_transaction(w,EAST,1);raw(r.action_events);raw(r.lifecycle_events);
    assert.deepEqual(Array.from(r.action_events,e=>e.type),['ENTITY_MOVED','HAZARD_TRIGGERED']);assert.equal(r.lifecycle_events[0].type,'ENTITY_DIED');
});
test('F3A-04: action_events structurally equals ActionResult.events with independent references',()=>{
    const w=fixture();effect(w,'RESOURCE');const r=api.execute_tick(w,EAST);assert.deepEqual(clone(r.action_events),clone(r.action_result.events));assert.notEqual(r.action_events,r.action_result.events);
    assert.equal(w.state.grid[1][2].effect.stock,1); // consumed then regenerated
    r.action_events[0].position.x=99;assert.notEqual(r.action_result.events[0].position.x,99);assert.equal(api.validate_TickResult(r),false);
});
test('F3A-05: rejected action still resolves lifecycle/dynamics, events kept separate',()=>{
    const w=fixture();w.get_experimental_entity().energy=0;const r=api.execute_tick_transaction(w,EAST,10);
    assert.equal(r.action_result.reason,'INSUFFICIENT_ENERGY');assert.equal(r.action_events.length,0);assert.equal(r.lifecycle_events.length,1);assert.equal(w.get_experimental_entity().lifecycle,'DEAD');assert.equal(w.state.time,1);
});
test('F3A-06: apply_action precedes lifecycle, which sees the actual charged energy',()=>{
    const {a,w,trace}=traceFixture();a.execute_tick_transaction(w,EAST,10);assert.deepEqual(trace.map(x=>x[0]),['apply_action','resolve_lifecycle','advance_dynamics','sync_rng_state']);assert.equal(trace[1][2],8);
});
test('F3A-07: lifecycle precedes dynamics, which sees DEAD and depleted resource',()=>{
    const w=fixture({initial_energy:2,resource_effect:0});effect(w,'RESOURCE');const advance=w.advance_dynamics;let calls=0;
    w.advance_dynamics=function(){calls++;assert.equal(this.get_experimental_entity().lifecycle,'DEAD');assert.equal(this.state.grid[1][2].effect.stock,0);return advance.call(this);};
    const r=api.execute_tick_transaction(w,EAST,10);assert.equal(calls,1);assert.equal(r.world_state.grid[1][2].effect.stock,1);assert.equal(r.lifecycle_events.length,1);
});
test('F3A-08: clock changes only after actual dynamics and before sync',()=>{
    const {a,w,trace}=traceFixture();w.state.time=7n;const r=a.execute_tick_transaction(w,WAIT,10n);assert.deepEqual(trace.map(x=>x[1]),[7n,7n,7n,8n]);assert.equal(r.tick,8n);
});
test('F3A-09: sync occurs once and confirms real PRNG state, without extra draws',()=>{
    const w=fixture();w.rng.next();const current=w.rng.get_state();let calls=0;const sync=w.sync_rng_state;
    w.sync_rng_state=function(){calls++;return sync.call(this);};const r=api.execute_tick_transaction(w,WAIT,10);assert.equal(calls,1);assert.equal(r.world_state.rng_state,current);assert.equal(w.rng.get_state(),current);
});
test('F3A-10: invalid state introduced by sync is validated after sync and rolled back',()=>{
    const a=load(),w=fixture({},a),before=clone(w.state),rng=w.rng.get_state();let synced=false;const original=w.sync_rng_state;
    w.sync_rng_state=function(){synced=true;original.call(this);this.state.rng_state=0;};failed(()=>a.execute_tick_transaction(w,WAIT,10));assert.equal(synced,true);assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
});
test('F3A-11: ACTIVE below max is nonterminal, even if energy awaits lifecycle resolution',()=>{
    const w=fixture();w.get_experimental_entity().energy=-1;assert.equal(unchanged(w,()=>api.determine_termination(w,1)),null);
    Object.defineProperty(w,'rng',{get(){assert.fail('termination RNG access');}});w.sync_rng_state=()=>assert.fail('termination sync');assert.equal(api.determine_termination(w,1),null);
});
test('F3A-12: explicit DEAD is terminal even with energy above threshold',()=>{
    const w=fixture();w.get_experimental_entity().lifecycle='DEAD';assert.equal(unchanged(w,()=>api.determine_termination(w,10)),'ENTITY_DIED');
});
test('F3A-13: confirmed limit and exact mixed-type comparison',()=>{
    const w=fixture();const r=api.execute_tick_transaction(w,WAIT,1n);assert.equal(r.termination,'MAX_TICKS_REACHED');assert.equal(unchanged(w,()=>api.determine_termination(w,1)),'MAX_TICKS_REACHED');
});
test('F3A-14: death and limit coincide; death wins after one resolution',()=>{
    const w=fixture({initial_energy:2,hazard_damage:5});effect(w,'HAZARD');let calls=0;const resolve=w.resolve_lifecycle;w.resolve_lifecycle=function(){assert.equal(++calls,1);return resolve.call(this);};
    const r=api.execute_tick_transaction(w,EAST,1);assert.equal(r.termination,'ENTITY_DIED');assert.equal(r.tick,1);assert.equal(r.lifecycle_events.length,1);
});
test('F3A-15 P01: max_ticks=0 and 0n valid, but allow no new transaction',()=>{
    for(const limit of [0,0n]){const w=fixture();assert.equal(api.determine_termination(w,limit),'MAX_TICKS_REACHED');unchanged(w,()=>failed(()=>api.execute_tick_transaction(w,WAIT,limit)));}
});
test('F3A-16: terminal WORLD rejected before action and without state/RNG mutation',()=>{
    for(const dead of [false,true]){const w=fixture();if(dead)w.get_experimental_entity().lifecycle='DEAD';else w.state.time=10;
        w.apply_action=()=>assert.fail('action on terminal world');unchanged(w,()=>failed(()=>api.execute_tick_transaction(w,EAST,10)));}
});
test('F3A-17 P01: safe Number clock preserved; crossing safe boundary explicitly promotes to BigInt',()=>{
    const w=fixture();w.state.time=Number.MAX_SAFE_INTEGER-1;const first=api.execute_tick_transaction(w,WAIT,0xffffffffffffffffn);assert.equal(first.tick,Number.MAX_SAFE_INTEGER);assert.equal(typeof first.tick,'number');
    const second=api.execute_tick_transaction(w,WAIT,0xffffffffffffffffn);assert.equal(second.tick,9007199254740992n);assert.equal(typeof second.tick,'bigint');
});
test('F3A-18 P01: BigInt clocks and limits retained above Number range',()=>{
    const w=fixture();w.state.time=9007199254740993n;const r=api.execute_tick_transaction(w,WAIT,9007199254740995n);assert.equal(r.tick,9007199254740994n);assert.equal(r.termination,null);
});
test('F3A-19 P01: unsafe/fractional/nonfinite/negative Number max rejected first',()=>{
    const w=fixture();for(const limit of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])unchanged(w,()=>invalidMax(()=>api.execute_tick_transaction(w,WAIT,limit)));
    invalidMax(()=>api.determine_termination(null,Number.MAX_SAFE_INTEGER+1));
    const bad=fixture();bad.config={...bad.config,width:0};assert.throws(()=>api.execute_tick_transaction(bad,WAIT,10),{name:'ContractError',message:'invalid world_config'});
});
test('F3A-20 P01: BigInt outside uint64 rejected',()=>{const w=fixture();for(const limit of [-1n,1n<<64n])unchanged(w,()=>invalidMax(()=>api.determine_termination(w,limit)));});
test('F3A-21 P01: strings/boolean/null/objects rejected without numeric conversion',()=>{
    const w=fixture();for(const limit of ['1',true,false,null,undefined,{valueOf(){assert.fail('coercion');}}])unchanged(w,()=>invalidMax(()=>api.execute_tick_transaction(w,WAIT,limit)));
});
test('F3A-22 P01: exact comparison at large uint64 boundaries',()=>{
    const w=fixture();w.state.time=0xfffffffffffffffen;assert.equal(api.determine_termination(w,0xffffffffffffffffn),null);assert.equal(api.determine_termination(w,0xfffffffffffffffen),'MAX_TICKS_REACHED');
    const r=api.execute_tick_transaction(w,WAIT,0xffffffffffffffffn);assert.equal(r.tick,0xffffffffffffffffn);assert.equal(r.termination,'MAX_TICKS_REACHED');
});
test('F3A-23: uint64 max never wraps; illegal clock and increment fail before action',()=>{
    const w=fixture();w.state.time=0xffffffffffffffffn;w.apply_action=()=>assert.fail('overflow action');unchanged(w,()=>failed(()=>api.execute_tick_transaction(w,WAIT,0xffffffffffffffffn)));failed(()=>api.tick_exact_increment(0xffffffffffffffffn));
    w.state.time=1n<<64n;assert.throws(()=>api.execute_tick_transaction(w,WAIT,0xffffffffffffffffn),{name:'ContractError',message:'invalid initial_state'});
});
test('F3A-24: failure after real apply_action restores resource, position, energy and RNG',()=>injectedFailure('apply_action'));
test('F3A-25: failure after real lifecycle restores ACTIVE, energy and events unpublished',()=>injectedFailure('resolve_lifecycle'));
test('F3A-26: failure after dynamics restores whole grid and RNG',()=>injectedFailure('advance_dynamics'));
test('F3A-27: failure after sync restores original clock and internal/persisted RNG',()=>injectedFailure('sync_rng_state'));
test('F3A-28: ConfirmedTickResult validation failure participates in rollback',()=>{
    for(const injected of ['mismatch','alias','failure']){
        const a=load(),w=fixture({},a),before=clone(w.state),rng=w.rng.get_state();
        if(injected==='failure'){a.ctx.failValidation=()=>false;vm.runInContext('validate_ConfirmedTickResult=failValidation;',a.ctx);}
        else if(injected==='alias')w.full_snapshot=function(){return this.state;};
        else {const snapshot=w.full_snapshot;w.full_snapshot=function(){const bad=snapshot.call(this);bad.entities.get('0987898').energy=999;return bad;};}
        failed(()=>a.execute_tick_transaction(w,EAST,10));assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
    }
});
test('F3A-29: confirmed snapshot allocation failure rolls back completed transition',()=>{
    const w=fixture(),before=clone(w.state),rng=w.rng.get_state();w.full_snapshot=()=>{throw new RangeError('injected snapshot allocation');};failed(()=>api.execute_tick_transaction(w,EAST,10));assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
});
test('F3A-30: complete WorldState rollback includes BigInt time, entities, effects, lifecycle and rng_state',()=>{
    const w=fixture({initial_energy:2,hazard_damage:5});w.state.time=8n;effect(w,'HAZARD');w.state.grid[0][0]=new api.Cell('FREE',{kind:'RESOURCE',stock:0});const before=clone(w.state),advance=w.advance_dynamics;
    w.advance_dynamics=function(){advance.call(this);assert.equal(this.get_experimental_entity().lifecycle,'DEAD');this.state.grid[0][0]=api.Cell.blocked();throw new Error('fault after regeneration');};failed(()=>api.execute_tick_transaction(w,EAST,10));assert.deepEqual(clone(w.state),before);assert.ok(api.validate_WorldState(w.state,w.config));
});
test('F3A-31: rollback restores original PRNG reference and exact state even after replacement',()=>{
    const w=fixture();w.rng.next();const original=w.rng,internal=original.get_state(),persisted=w.state.rng_state;w.advance_dynamics=function(){original.next();this.rng=new api.PRNG(42);throw new Error('replace rng');};
    failed(()=>api.execute_tick_transaction(w,WAIT,10));assert.equal(w.rng,original);assert.equal(w.rng.get_state(),internal);assert.equal(w.state.rng_state,persisted);
});
test('F3A-32: no partial publication and readonly rollback/time slots rejected before execution',()=>{
    for(const key of ['state','rng','time','internal_rng']){const w=fixture();if(key==='internal_rng')Object.defineProperty(w.rng,'state',{writable:false});else if(key==='time')Object.defineProperty(w.state,key,{writable:false});else Object.defineProperty(w,key,{writable:false});w.apply_action=()=>assert.fail('no restore path');unchanged(w,()=>failed(()=>api.execute_tick_transaction(w,WAIT,10)));}
    const w=fixture();const resolve=w.resolve_lifecycle;w.resolve_lifecycle=function(){resolve.call(this);throw new Error('late failure');};let published=false;try{api.execute_tick_transaction(w,EAST,10);published=true;}catch(e){assert.equal(e.message,'world transition failed');}assert.equal(published,false);
});
test('F3A-33: hazard kills only in lifecycle; confirmation preserves both event lists and exact energy',()=>{
    const w=fixture({initial_energy:2,hazard_damage:5});effect(w,'HAZARD');const r=api.execute_tick_transaction(w,EAST,10);assert.equal(w.get_experimental_entity().energy,-5);assert.equal(r.world_state.entities.get('0987898').lifecycle,'DEAD');assert.equal(r.action_events.length,2);assert.equal(r.lifecycle_events.length,1);assert.equal(r.termination,'ENTITY_DIED');
});
test('F3A-34: consumed resource regenerates after death; action event remains real consumption',()=>{
    const w=fixture({initial_energy:2,resource_effect:0});effect(w,'RESOURCE');const r=api.execute_tick_transaction(w,EAST,10);assert.equal(r.world_state.grid[1][2].effect.stock,1);assert.equal(r.action_events[1].type,'RESOURCE_CONSUMED');assert.equal(r.termination,'ENTITY_DIED');
});
test('F3A-35: confirmed snapshot and event positions isolated in both directions',()=>{
    const w=fixture();effect(w,'RESOURCE');const r=api.execute_tick_transaction(w,EAST,10),before=clone(r);w.get_experimental_entity().energy=999;w.state.grid[1][2].effect.stock=0;assert.deepEqual(clone(r),before);
    r.world_state.entities.get('0987898').position.x=99;r.action_events[0].position.y=88;assert.equal(w.get_experimental_entity().position.x,2);assert.equal(w.get_experimental_entity().position.y,1);assert.notEqual(r.action_events[0].position,r.action_result.events[0].position);
});
test('F3A-36: deterministic sequence matches independent fixed energy/position/time ledger',()=>{
    const a=fixture(),b=fixture();effect(a,'RESOURCE');effect(b,'RESOURCE');
    for(const [action,energy,time,x] of [[EAST,13,1,2],[WAIT,12,2,2],[{type:'MOVE_W'},10,3,1]]){
        const ar=api.execute_tick_transaction(a,action,10),br=api.execute_tick_transaction(b,action,10);assert.deepEqual(clone(ar),clone(br));assert.equal(a.get_experimental_entity().energy,energy);assert.equal(a.state.time,time);assert.equal(a.get_experimental_entity().position.x,x);
    }
});
test('F3A-37: no Recorder access or enriched events',()=>{
    const w=fixture();Object.defineProperty(w,'recorder',{get(){assert.fail('Recorder');}});const r=api.execute_tick_transaction(w,EAST,10);raw(r.action_events);raw(r.lifecycle_events);
});
test('F3A-38: no Agent, Observation or Feedback access',()=>{
    const a=load(),w=fixture({},a);for(const key of ['agent','observation','feedback'])Object.defineProperty(w,key,{get(){assert.fail(key);}});
    for(const name of ['build_observation','build_feedback','create_agent'])a.ctx[name]=()=>assert.fail(name);
    const r=a.execute_tick_transaction(w,WAIT,10);assert.equal(r.tick,1);assert.equal(w.get_experimental_entity().energy,9);
});
test('F3A-39: execute_tick preserves clock exactly, including Number/BigInt uint64 max',()=>{
    for(const time of [0,7,Number.MAX_SAFE_INTEGER,7n,0xffffffffffffffffn]){const w=fixture();w.state.time=time;const r=api.execute_tick(w,WAIT);assert.equal(w.state.time,time);assert.equal(r.action_result.energy_delta,-1);}
});
test('F3A-40: execute_tick never syncs or accesses RNG, but performs real action and dynamics',()=>{
    const w=fixture();effect(w,'RESOURCE');const rng=w.state.rng_state;w.sync_rng_state=()=>assert.fail('sync');Object.defineProperty(w,'rng',{get(){assert.fail('RNG');}});
    const r=api.execute_tick(w,EAST);assert.equal(w.state.rng_state,rng);assert.equal(w.get_experimental_entity().energy,13);assert.equal(w.state.grid[1][2].effect.stock,1);assert.equal(r.action_events[1].type,'RESOURCE_CONSUMED');
});
