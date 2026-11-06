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
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
    return vm.runInContext('({World,WorldConfig,Cell,ContractError,initialize_world,validate_WorldState})',ctx);
}
const api=load();const clone=x=>structuredClone(x);
function fixture(patch={},a=api){
    const w=new a.World(new a.WorldConfig({...a.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:2,wait_cost:3,resource_effect:7,hazard_damage:7,...patch}));
    w.initialize(1);w.get_experimental_entity().position={x:1,y:1};return w;
}
const action=type=>({type});
const record=(type,x,y)=>({type,entity_id:'0987898',position:{x,y}});
function result(r,delta,events){
    assert.deepEqual(Array.from(Reflect.ownKeys(r)).sort(),['energy_delta','events','reason','validity']);
    assert.equal(r.validity,'VALID');assert.equal(r.reason,'NONE');assert.ok(Object.is(r.energy_delta,delta));
    assert.deepEqual(clone(r.events),events);
    for(const e of r.events){
        assert.deepEqual(Array.from(Reflect.ownKeys(e)).sort(),['entity_id','position','type']);
        assert.deepEqual(Array.from(Reflect.ownKeys(e.position)).sort(),['x','y']);
        assert.equal(e.type==='ENTITY_DIED',false);
        for(const key of ['tick','source','sequence'])assert.equal(Object.hasOwn(e,key),false);
    }
}
function unchanged(w,fn){const before=clone(w.state),rng=w.rng.get_state();const r=fn();assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);return r;}
test('F2H-01: four accepted cardinal moves emit one destination ENTITY_MOVED, exact schemas',()=>{
    for(const [type,x,y] of [['MOVE_N',1,0],['MOVE_S',1,2],['MOVE_E',2,1],['MOVE_W',0,1]]){
        const w=fixture();result(w.apply_action(action(type)),-2,[record('ENTITY_MOVED',x,y)]);
        assert.deepEqual(clone(w.get_experimental_entity().position),{x,y});assert.equal(w.get_experimental_entity().energy,8);
        assert.ok(api.validate_WorldState(w.state,w.config));
    }
});
test('F2H-02: resource stock1→0 emits movement then RESOURCE_CONSUMED with realized energy',()=>{
    const w=fixture();w.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});
    result(w.apply_action(action('MOVE_E')),5,[record('ENTITY_MOVED',2,1),record('RESOURCE_CONSUMED',2,1)]);
    assert.equal(w.state.grid[1][2].effect.stock,0);assert.equal(w.get_experimental_entity().energy,15);
});
test('F2H-03: depleted resource emits movement only, with no gain or phantom consumption',()=>{
    const w=fixture();w.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:0});
    result(w.apply_action(action('MOVE_E')),-2,[record('ENTITY_MOVED',2,1)]);
    assert.equal(w.state.grid[1][2].effect.stock,0);assert.equal(w.get_experimental_entity().energy,8);
});
test('F2H-04: hazard emits HAZARD_TRIGGERED after movement and remains static',()=>{
    const w=fixture();w.state.grid[1][2]=new api.Cell('FREE',{kind:'HAZARD'});const effect=w.state.grid[1][2].effect;
    result(w.apply_action(action('MOVE_E')),-9,[record('ENTITY_MOVED',2,1),record('HAZARD_TRIGGERED',2,1)]);
    assert.equal(w.get_experimental_entity().energy,1);assert.equal(w.state.grid[1][2].effect,effect);assert.deepEqual(clone(effect),{kind:'HAZARD'});
});
test('F2H-05 policy: zero resource_effect still consumes stock; zero hazard_damage still triggers on entry',()=>{
    const resource=fixture({resource_effect:0});resource.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});
    result(resource.apply_action(action('MOVE_E')),-2,[record('ENTITY_MOVED',2,1),record('RESOURCE_CONSUMED',2,1)]);assert.equal(resource.state.grid[1][2].effect.stock,0);
    const hazard=fixture({hazard_damage:0});hazard.state.grid[1][2]=new api.Cell('FREE',{kind:'HAZARD'});
    result(hazard.apply_action(action('MOVE_E')),-2,[record('ENTITY_MOVED',2,1),record('HAZARD_TRIGGERED',2,1)]);
});
test('F2H-06: WAIT keeps costs and never moves, consumes or triggers entry effects',()=>{
    for(const effect of [null,{kind:'RESOURCE',stock:1},{kind:'HAZARD'}]){
        const w=fixture();w.state.grid[1][1]=new api.Cell('FREE',effect);const position=w.get_experimental_entity().position;
        result(w.apply_action(action('WAIT')),-3,[]);assert.equal(w.get_experimental_entity().position,position);
        assert.deepEqual(clone(w.state.grid[1][1].effect),effect);assert.equal(w.get_experimental_entity().energy,7);
    }
});
test('F2H-07: invalid/rejected actions preserve precedence, state and empty event lists',()=>{
    for(const [kind,expected] of [['dead','ENTITY_NOT_ACTIVE'],['outside','OUT_OF_BOUNDS'],['blocked','BLOCKED_CELL'],['energy','INSUFFICIENT_ENERGY']]){
        const w=fixture({initial_energy:0,death_threshold:-1});w.get_experimental_entity().position={x:0,y:0};let type='MOVE_S';
        if(kind==='dead')w.get_experimental_entity().lifecycle='DEAD';
        if(kind==='outside')type='MOVE_N';
        if(kind==='blocked')w.state.grid[1][0]=api.Cell.blocked();
        const r=unchanged(w,()=>w.apply_action(action(type)));assert.equal(r.reason,expected);assert.equal(r.validity,kind==='energy'?'FAILED':'INVALID');assert.equal(r.energy_delta,0);assert.deepEqual(clone(r.events),[]);
    }
    const w=fixture();for(const a of [{type:'UNKNOWN'},null,{type:'WAIT',extra:1}])unchanged(w,()=>assert.throws(()=>w.apply_action(a),api.ContractError));
});
test('F2H-08 §5/13: apply_action never emits death; separate lifecycle follows action events',()=>{
    const w=fixture({initial_energy:2,hazard_damage:5});w.state.grid[1][2]=new api.Cell('FREE',{kind:'HAZARD'});
    const r=w.apply_action(action('MOVE_E'));result(r,-7,[record('ENTITY_MOVED',2,1),record('HAZARD_TRIGGERED',2,1)]);
    assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE');
    const lifecycle=w.resolve_lifecycle();assert.deepEqual(clone(lifecycle),[record('ENTITY_DIED',2,1)]);
    assert.deepEqual(Array.from([...r.events,...lifecycle],e=>e.type),['ENTITY_MOVED','HAZARD_TRIGGERED','ENTITY_DIED']);
    assert.equal(w.resolve_lifecycle().length,0);assert.equal(w.state.time,0);
});
test('F2H-09: event positions are fresh per record and independent of WORLD and later movement',()=>{
    const w=fixture();w.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});const r=w.apply_action(action('MOVE_E'));
    const [move,effect]=r.events;assert.notEqual(move.position,effect.position);assert.notEqual(move.position,w.get_experimental_entity().position);assert.notEqual(effect.position,w.get_experimental_entity().position);
    move.position.x=99;assert.equal(effect.position.x,2);assert.equal(w.get_experimental_entity().position.x,2);
    w.apply_action(action('MOVE_W'));assert.deepEqual(clone(effect.position),{x:2,y:1});
    effect.position.y=99;assert.equal(w.get_experimental_entity().position.y,1);
});
test('F2H-10: event-construction failure on either record preserves full state and error identity',()=>{
    for(const failAt of [1,2]){
        const a=load(),w=fixture({},a);w.state.grid[1][2]=new a.Cell('FREE',{kind:'RESOURCE',stock:1});
        const original=a.World._make_action_event,failure=new RangeError('injected event allocation failure');let calls=0;
        a.World._make_action_event=(...args)=>{if(++calls===failAt)throw failure;return original(...args);};
        unchanged(w,()=>assert.throws(()=>w.apply_action(action('MOVE_E')),e=>e===failure));assert.equal(calls,failAt);
    }
});
test('F2H-11: nonfinite staged arithmetic fails before event construction or any mutation',()=>{
    const a=load(),w=fixture({},a);w.state.grid[1][2]=new a.Cell('FREE',{kind:'RESOURCE',stock:1});
    const sum=a.World._finite_energy_sum;let calls=0;a.World._finite_energy_sum=(...args)=>++calls===2?Infinity:sum(...args);
    a.World._make_action_event=()=>assert.fail('event before finite calculation');
    unchanged(w,()=>assert.throws(()=>w.apply_action(action('MOVE_E')),a.ContractError));
});
test('F2H-12: both event records are staged before writes; late readonly stock prevents all mutation',()=>{
    const a=load(),w=fixture({},a);w.state.grid[1][2]=new a.Cell('FREE',{kind:'RESOURCE',stock:1});const before=clone(w.state);
    Object.defineProperty(w.state.grid[1][2].effect,'stock',{writable:false});
    const original=a.World._make_action_event;let calls=0;
    a.World._make_action_event=(...args)=>{assert.deepEqual(clone(w.state),before);calls++;return original(...args);};
    unchanged(w,()=>assert.throws(()=>w.apply_action(action('MOVE_E')),{name:'ContractError',message:'world transition failed'}));assert.equal(calls,2);
});
test('F2H-13 §4/13: events preserve clock/lifecycle/rng_state with no RNG/Recorder/sync access',()=>{
    const w=fixture();w.state.time=0xffffffffffffffffn;w.state.grid[1][2]=new api.Cell('FREE',{kind:'HAZARD'});const rng=w.state.rng_state;
    for(const key of ['rng','recorder'])Object.defineProperty(w,key,{get(){assert.fail('forbidden '+key);}});
    for(const key of ['resolve_lifecycle','advance_dynamics','sync_rng_state'])w[key]=()=>assert.fail('forbidden '+key);
    result(w.apply_action(action('MOVE_E')),-9,[record('ENTITY_MOVED',2,1),record('HAZARD_TRIGGERED',2,1)]);
    assert.equal(w.state.time,0xffffffffffffffffn);assert.equal(w.state.rng_state,rng);assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE');assert.ok(api.validate_WorldState(w.state,w.config));
});
test('F2H-14: repeated sequences are deterministic with independent event/result lists',()=>{
    const setup=()=>{const w=fixture({initial_energy:100});w.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});return w;};
    const a=setup(),b=setup();const rng=a.rng.get_state();
    for(const type of ['MOVE_E','WAIT','MOVE_W','MOVE_E']){
        const ar=a.apply_action(action(type)),br=b.apply_action(action(type));assert.deepEqual(clone(ar),clone(br));assert.notEqual(ar.events,br.events);assert.deepEqual(clone(a.state),clone(b.state));
    }
    assert.equal(a.rng.get_state(),rng);assert.equal(b.rng.get_state(),rng);
});
test('F2H-15 §6: event additions leave signed-zero/rounded energy_delta unchanged',()=>{
    const w=fixture({initial_energy:Number.MAX_VALUE,move_cost:1});
    result(w.apply_action(action('MOVE_E')),0,[record('ENTITY_MOVED',2,1)]);assert.equal(w.get_experimental_entity().energy,Number.MAX_VALUE);
    const zero=fixture({initial_energy:-0,move_cost:0,death_threshold:-1});result(zero.apply_action(action('MOVE_E')),0,[record('ENTITY_MOVED',2,1)]);assert.ok(Object.is(zero.get_experimental_entity().energy,+0));
});
