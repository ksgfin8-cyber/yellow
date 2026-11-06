const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load() {
    const ctx = vm.createContext({});
    for (const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)) {
        vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
        if (src === 'js/world/world.js') break;
    }
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
    return {ctx,...vm.runInContext('({World,WorldConfig,PRNG,WorldState,Cell,InitializationError,ContractError,initialize_world,validate_initial_events_consistency,validate_WorldState})',ctx)};
}
const api=load();
const cfg=patch=>({...api.WorldConfig.defaults(),width:7,height:5,obstacle_density:0.2,resource_density:0.3,hazard_density:0.1,...patch});
const clone=x=>structuredClone(x);
const keys=x=>Array.from(Reflect.ownKeys(x)).sort();
const entity=result=>result.world_state.entities.get('0987898');
// Independent flat traversal + BigInt Xorshift/rejection; no production PRNG helpers.
function reference(c,seed) {
    let s=BigInt(seed),draws=0;
    const next=()=>{s=(s^(s<<13n))&0xffffffffn;s=(s^(s>>17n))&0xffffffffn;s=(s^(s<<5n))&0xffffffffn;draws++;return Number(s);};
    const flat=[],candidates=[];
    for(let i=0;i<c.width*c.height;i++) {
        const blocked=next()/2**32<c.obstacle_density;let effect=null;
        if(!blocked){const u=next()/2**32;if(u<c.resource_density)effect={kind:'RESOURCE',stock:1};else if(u<c.resource_density+c.hazard_density)effect={kind:'HAZARD'};}
        flat.push({traversal:blocked?'BLOCKED':'FREE',effect});
        if(!blocked&&effect===null)candidates.push({x:i%c.width,y:Math.floor(i/c.width)});
    }
    let u;const n=candidates.length;assert.ok(n>0);const limit=2**32-(2**32%n);
    do{u=next();}while(u>=limit);
    return {flat,position:candidates[u%n],state:Number(s),draws};
}
test('F2G-01 §11.1: exact InitialWorldResult and validated ACTIVE initial state',()=>{
    const c=cfg(),r=api.initialize_world(c,42),e=entity(r);
    assert.deepEqual(keys(r),['initial_events','rng_state','world_state']);
    assert.ok(r.world_state instanceof api.WorldState);assert.ok(api.validate_WorldState(r.world_state,c));
    assert.equal(r.world_state.time,0);assert.equal(e.id,'0987898');assert.equal(e.lifecycle,'ACTIVE');assert.equal(e.energy,c.initial_energy);
    assert.equal(r.initial_events.length,0);assert.equal(r.rng_state,r.world_state.rng_state);
    assert.equal(api.validate_initial_events_consistency(r.world_state,r.initial_events),true);
});
test('F2G-02: same config/seed reproduces state, events and RNG without shared snapshots',()=>{
    for(const seed of [1,42,0x80000000,0xffffffff]) {
        const a=api.initialize_world(cfg(),seed),b=api.initialize_world(cfg(),seed);
        assert.deepEqual(clone(a),clone(b));assert.notEqual(a.world_state,b.world_state);assert.notEqual(a.initial_events,b.initial_events);
    }
});
test('F2G-03 §10/11: different seeds match independent map, selection and final RNG oracle',()=>{
    const c=cfg();const states=[];
    for(const seed of [1,42,0x80000000,0xffffffff]) {
        const expected=reference(c,seed),r=api.initialize_world(c,seed);
        assert.deepEqual(clone(r.world_state.grid.flat()),expected.flat);
        assert.deepEqual(clone(entity(r).position),expected.position);assert.equal(r.rng_state,expected.state);states.push(r.rng_state);
    }
    assert.equal(new Set(states).size,4);
});
test('F2G-04 §11.2–4: FREE/NONE start, stock1 resources and static hazards',()=>{
    const r=api.initialize_world(cfg(),42),s=r.world_state,p=entity(r).position;
    assert.equal(s.grid[p.y][p.x].traversal,'FREE');assert.equal(s.grid[p.y][p.x].effect,null);
    const resources=s.grid.flat().filter(c=>c.effect?.kind==='RESOURCE');assert.ok(resources.length>0);
    for(const c of resources)assert.equal(c.effect.stock,1);
    for(const c of s.grid.flat().filter(c=>c.effect?.kind==='HAZARD'))assert.deepEqual(keys(c.effect),['kind']);
});
test('F2G-05 recovered lifecycle: <=, equality/negative thresholds and exact initial energy',()=>{
    for(const [energy,threshold,lifecycle] of [[1,0,'ACTIVE'],[0,0,'DEAD'],[-1,0,'DEAD'],[-2,-3,'ACTIVE'],[-3,-3,'DEAD'],[-4,-3,'DEAD'],[-0,0,'DEAD'],[Number.MIN_VALUE,0,'ACTIVE']]) {
        const r=api.initialize_world(cfg({initial_energy:energy,death_threshold:threshold}),1);
        assert.equal(entity(r).lifecycle,lifecycle);assert.ok(Object.is(entity(r).energy,energy));
        assert.equal(r.initial_events.length,lifecycle==='DEAD'?1:0);assert.equal(r.world_state.time,0);
    }
});
test('F2G-06 INIT-004: one raw death event, exact fields, matching id/position and no metadata',()=>{
    const r=api.initialize_world(cfg({initial_energy:0}),42),ev=r.initial_events[0],e=entity(r);
    assert.deepEqual(keys(ev),['entity_id','position','type']);assert.deepEqual(keys(ev.position),['x','y']);
    assert.equal(ev.type,'ENTITY_DIED');assert.equal(ev.entity_id,e.id);assert.deepEqual(clone(ev.position),clone(e.position));
    assert.notEqual(ev.position,e.position);
    for(const key of ['tick','source','sequence'])assert.equal(Object.hasOwn(ev,key),false);
});
test('F2G-07 INIT-004 validator: ACTIVE accepts only empty initial lifecycle events',()=>{
    const r=api.initialize_world(cfg(),1),e=entity(r),d={type:'ENTITY_DIED',entity_id:e.id,position:{...e.position}};
    assert.equal(api.validate_initial_events_consistency(r.world_state,[]),true);
    for(const events of [[d],[{type:'ENTITY_MOVED',entity_id:e.id,position:{...e.position}}],null,{},''])
        assert.throws(()=>api.validate_initial_events_consistency(r.world_state,events),{name:'ContractError',message:'invalid initial_events'});
});
test('F2G-08 INIT-004 validator: DEAD rejects missing/duplicate/foreign/extra/malformed/enriched events',()=>{
    const r=api.initialize_world(cfg({initial_energy:0}),1),ev=clone(r.initial_events[0]);
    const accessor={type:'ENTITY_DIED',entity_id:ev.entity_id};Object.defineProperty(accessor,'position',{get(){assert.fail('accessor must not be invoked');}});
    const cases=[[],[ev,ev],new Array(1),[null],[{...ev,type:'ENTITY_MOVED'}],[{...ev,entity_id:'foreign'}],
        [{...ev,position:{x:ev.position.x+1,y:ev.position.y}}],[{...ev,position:{x:String(ev.position.x),y:ev.position.y}}],
        [{...ev,position:{...ev.position,z:0}}],[{...ev,tick:0}],[{...ev,source:'lifecycle'}],[{...ev,sequence:0}],[accessor]];
    for(const events of cases)assert.throws(()=>api.validate_initial_events_consistency(r.world_state,events),{name:'ContractError',message:'invalid initial_events'});
    const before=clone(r);assert.equal(api.validate_initial_events_consistency(r.world_state,r.initial_events),true);assert.deepEqual(clone(r),before);
});
test('F2G-09 §11.1: full order, ACTIVE before resolve, exact once lifecycle/sync/validation then snapshot',()=>{
    const a=load(),trace=[];
    a.ctx.mark=name=>trace.push(name);
    vm.runInContext(`
        const oldPRNG=PRNG;
        PRNG=class extends oldPRNG { constructor(seed){mark('rng');super(seed);} };
        const oldSeed=PRNG._validate_state;let seedMarked=false;
        PRNG._validate_state=function(seed){if(!seedMarked){mark('seed');seedMarked=true;}return oldSeed(seed);};
        const oldConfig=WorldConfig._validate;let configMarked=false;
        WorldConfig._validate=function(c){if(!configMarked){mark('config');configMarked=true;}return oldConfig(c);};
        const oldVerify=verify_generated_initial_resources;
        verify_generated_initial_resources=(...args)=>{mark('resources');return oldVerify(...args);};
        const oldEvents=validate_initial_events_consistency;
        validate_initial_events_consistency=(...args)=>{mark('events');return oldEvents(...args);};
    `,a.ctx);
    for(const [method,label] of [['_generate_grid','map'],['_choose_initial_position','position'],['resolve_lifecycle','resolve'],['sync_rng_state','sync'],['full_snapshot','snapshot']]) {
        const original=a.World.prototype[method];let calls=0;
        a.World.prototype[method]=function(...args){trace.push(label);calls++;assert.equal(calls,1,'duplicate '+label);
            if(label==='resolve')assert.equal(this.get_experimental_entity().lifecycle,'ACTIVE');
            if(label==='sync')assert.equal(this.get_experimental_entity().lifecycle,'DEAD');
            return original.apply(this,args);};
    }
    a.initialize_world(cfg({initial_energy:0}),1);
    assert.deepEqual(trace,['config','seed','rng','map','resources','position','resolve','sync','events','snapshot']);
});
test('F2G-10 §11.1: adapted initialize resolves lifecycle exactly once too',()=>{
    const a=load(),original=a.World.prototype.resolve_lifecycle;let resolves=0;
    a.World.prototype.resolve_lifecycle=function(){resolves++;assert.equal(resolves,1);return original.call(this);};
    const w=new a.World(new a.WorldConfig(cfg({initial_energy:0}))),r=w.initialize(1);
    assert.equal(resolves,1);assert.equal(r.initial_events.length,1);assert.equal(w.get_experimental_entity().lifecycle,'DEAD');
});
test('F2G-11 §10/11: exact extraction count, sync once, no draws for resource/lifecycle/snapshot/adapter',()=>{
    for(const adapted of [false,true]) {
        const a=load(),c=cfg(),expected=reference(c,42);let draws=0,floats=0,ints=0,syncs=0;
        for(const [method,increment] of [['next',()=>draws++],['next_float',()=>floats++],['next_int',()=>ints++]]) {
            const original=a.PRNG.prototype[method];a.PRNG.prototype[method]=function(...args){increment();return original.apply(this,args);};
        }
        const sync=a.World.prototype.sync_rng_state;a.World.prototype.sync_rng_state=function(){syncs++;return sync.call(this);};
        const w=new a.World(new a.WorldConfig(c)),r=adapted?w.initialize(42):a.initialize_world(c,42);
        const blocked=r.world_state.grid.flat().filter(c=>c.traversal==='BLOCKED').length;
        assert.equal(floats,2*c.width*c.height-blocked);assert.equal(ints,1);assert.equal(draws,expected.draws);assert.equal(syncs,1);assert.equal(r.rng_state,expected.state);
        if(adapted)assert.equal(w.rng.get_state(),expected.state);
    }
});
test('F2G-12 §7.2: canonical snapshot detached from temporary WORLD and event positions',()=>{
    const a=load(),original=a.World.prototype.full_snapshot;let live;
    a.World.prototype.full_snapshot=function(){live=this;return original.call(this);};
    const r=a.initialize_world(cfg({initial_energy:0}),42),before=clone(r),le=live.get_experimental_entity();
    le.energy=123;le.position.x=999;live.state.grid.flat().find(c=>c.effect?.kind==='RESOURCE').effect.stock=0;
    assert.deepEqual(clone(r),before);
    r.initial_events[0].position.y=888;assert.notEqual(entity(r).position.y,888);
    r.world_state.grid[0][0].effect=null;assert.notEqual(r.world_state.grid,live.state.grid);
});
test('F2G-13 adapter: same canonical result/state/RNG but independent mutable snapshots both ways',()=>{
    const c=cfg({initial_energy:0}),w=new api.World(new api.WorldConfig(c));const r=w.initialize(42),expected=api.initialize_world(c,42);
    assert.deepEqual(clone(r),clone(expected));assert.deepEqual(clone(w.state),clone(r.world_state));assert.equal(w.rng.get_state(),r.rng_state);
    assert.notEqual(w.state,r.world_state);assert.equal(w.experimental_entity_id,'0987898');assert.ok(Object.isFrozen(w.config));
    const before=clone(w.state);entity(r).energy=999;r.initial_events[0].position.x=888;r.world_state.grid[0][0].effect=null;
    assert.deepEqual(clone(w.state),before);w.get_experimental_entity().position.y=777;assert.notEqual(entity(r).position.y,777);
});
test('F2G-14 §11.3: no candidates carries received seed and never resolves lifecycle/sync',()=>{
    for(const adapted of [false,true])for(const patch of [{obstacle_density:1},{obstacle_density:0,resource_density:1,hazard_density:0},{obstacle_density:0,resource_density:0,hazard_density:1}]) {
        const a=load(),c=cfg(patch),w=new a.World(new a.WorldConfig(c));
        a.World.prototype.resolve_lifecycle=()=>assert.fail('unexpected resolve');a.World.prototype.sync_rng_state=()=>assert.fail('unexpected sync');
        assert.throws(()=>adapted?w.initialize(123):a.initialize_world(c,123),e=>e instanceof a.InitializationError&&e.seed===123&&e.reason==='invalid initial_position'&&e.message==='invalid initial_position');
        assert.equal(w.state,null);assert.equal(w.rng,null);assert.equal(w.experimental_entity_id,null);
    }
});
test('F2G-15 §6/10: invalid config precedes invalid seed; invalid seeds do not create WORLD/map',()=>{
    for(const c of [null,{},cfg({width:0}),{...cfg(),extra:1}])assert.throws(()=>api.initialize_world(c,0),{name:'ContractError',message:'invalid world_config'});
    const a=load();a.World.prototype._generate_grid=()=>assert.fail('generation with invalid seed');
    for(const seed of [0,-0,-1,0x100000000,1.5,NaN,Infinity,'1',1n,undefined])assert.throws(()=>a.initialize_world(cfg(),seed),a.ContractError);
    for(const adapted of [false,true])for(const seed of [1,0xffffffff]) {
        const c=cfg({obstacle_density:0,resource_density:0,hazard_density:0}),w=new api.World(new api.WorldConfig(c));
        const r=adapted?w.initialize(seed):api.initialize_world(c,seed);assert.ok(api.validate_WorldState(r.world_state,c));
    }
});
test('F2G-16 atomicity: failures at map/position/lifecycle/sync/snapshot preserve old or empty receiver',()=>{
    for(const initialized of [false,true])for(const method of ['_generate_grid','_choose_initial_position','resolve_lifecycle','sync_rng_state','full_snapshot']) {
        const a=load(),w=new a.World(new a.WorldConfig(cfg()));if(initialized)w.initialize(1);
        const refs=[w.config,w.state,w.rng,w.experimental_entity_id],before=w.state?clone(w.state):null,rng=w.rng?.get_state();
        const failure=new RangeError('injected allocation failure');a.World.prototype[method]=()=>{throw failure;};
        assert.throws(()=>w.initialize(42),e=>e===failure&&!Object.hasOwn(e,'seed'));
        assert.deepEqual([w.config,w.state,w.rng,w.experimental_entity_id],refs);assert.deepEqual(w.state?clone(w.state):null,before);assert.equal(w.rng?.get_state(),rng);
    }
});
test('F2G-17 atomicity: inconsistent raw lifecycle events abort before snapshot and publication',()=>{
    const a=load(),w=new a.World(new a.WorldConfig(cfg({initial_energy:0})));
    const resolve=a.World.prototype.resolve_lifecycle;a.World.prototype.resolve_lifecycle=function(){resolve.call(this);return [];};
    a.World.prototype.full_snapshot=()=>assert.fail('snapshot before event validation');
    assert.throws(()=>w.initialize(42),{name:'ContractError',message:'invalid initial_events'});assert.equal(w.state,null);assert.equal(w.rng,null);
});
test('F2G-18 adapter atomicity: nonwritable receiver field detected before publishing others',()=>{
    const w=new api.World(new api.WorldConfig(cfg()));w.initialize(1);
    const state=clone(w.state),rng=w.rng,config=w.config;Object.defineProperty(w,'experimental_entity_id',{writable:false});
    assert.throws(()=>w.initialize(42),{name:'ContractError',message:'world transition failed'});
    assert.deepEqual(clone(w.state),state);assert.equal(w.rng,rng);assert.equal(w.config,config);
});
test('F2G-19 §4/5: initialization starts time0, uses no action/dynamics/Recorder or second lifecycle',()=>{
    const a=load();for(const method of ['apply_action','advance_dynamics','regenerate_resources'])a.World.prototype[method]=()=>assert.fail('forbidden '+method);
    Object.defineProperty(a.World.prototype,'recorder',{get(){assert.fail('Recorder access');}});
    const w=new a.World(new a.WorldConfig(cfg())),r=w.initialize(42);assert.equal(r.world_state.time,0);assert.equal(w.state.time,0);
    assert.equal(w.experimental_entity_id,'0987898');
});
test('F2G-20: reinitialization uses the single route and yields fresh snapshots',()=>{
    const w=new api.World(new api.WorldConfig(cfg())),first=w.initialize(42),old=w.state;
    w.get_experimental_entity().energy=1;w.state.time=7;
    const second=w.initialize(42);assert.notEqual(w.state,old);assert.deepEqual(clone(first),clone(second));assert.equal(w.state.time,0);
    assert.notEqual(first.world_state.grid,second.world_state.grid);assert.equal(w.rng.get_state(),second.rng_state);
});

test('F2G-21 atomicity: resource verification and adapter-copy allocation failures preserve receiver',()=>{
    for(const stage of ['resources','copy']) {
        const a=load(),w=new a.World(new a.WorldConfig(cfg()));w.initialize(1);
        const before=clone(w.state),rng=w.rng,state=w.state;const failure=new RangeError('injected capacity failure');
        if(stage==='resources') {
            a.ctx.failResources=()=>{throw failure;};
            vm.runInContext('verify_generated_initial_resources=()=>failResources();',a.ctx);
        } else {
            const copy=a.WorldState.prototype.copy;let calls=0;
            a.WorldState.prototype.copy=function(){if(++calls===2)throw failure;return copy.call(this);};
        }
        assert.throws(()=>w.initialize(42),e=>e===failure&&!Object.hasOwn(e,'seed'));
        assert.equal(w.state,state);assert.equal(w.rng,rng);assert.deepEqual(clone(w.state),before);
    }
});
