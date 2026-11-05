const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load() {
    const ctx=vm.createContext({});
    for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)) {
        vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
        if(src==='js/world/world.js') break;
    }
    vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
    return {ctx,...vm.runInContext('({World,WorldConfig,PRNG,Cell,ContractError,InitializationError,prepare_world_before_lifecycle,verify_generated_initial_resources,validate_WorldState})',ctx)};
}
const api=load();
const cfg=patch=>({...api.WorldConfig.defaults(),width:4,height:3,...patch});
function values(world) {
    const s=world.state;
    return {time:s.time,grid:JSON.parse(JSON.stringify(s.grid)),entities:JSON.parse(JSON.stringify(Array.from(s.entities))),rng_state:s.rng_state};
}
test('F2C-01 §6: config validation before seed validation, no coercion/repair',()=>{
    for(const config of [null,{}, {...cfg(),extra:1}, {...cfg(),width:0}, {...cfg(),initial_energy:Infinity}])
        assert.throws(()=>api.prepare_world_before_lifecycle(config,0),{name:'ContractError',message:'invalid world_config'});
    const {width,...missing}=cfg();assert.throws(()=>api.prepare_world_before_lifecycle(missing,1),api.ContractError);
});
test('F2C-02 §10: original uint32 seed validation, no derivation',()=>{
    for(const seed of [0,-0,-1,2**32,1.5,NaN,Infinity,'1',1n,undefined])
        assert.throws(()=>api.prepare_world_before_lifecycle(cfg(),seed),api.ContractError);
    for(const seed of [1,0xFFFFFFFF]) {
        const w=api.prepare_world_before_lifecycle(cfg(),seed);
        assert.ok(api.validate_WorldState(w.state,w.config));
    }
});
test('F2C-03 §11.3/11.4: exact id, one entity, valid initial position, ACTIVE before resolution',()=>{
    const w=api.prepare_world_before_lifecycle(cfg(),42),e=w.get_experimental_entity();
    assert.equal(w.experimental_entity_id,'0987898');assert.equal(e.id,'0987898');
    assert.equal(w.state.entities.size,1);assert.equal(e.lifecycle,'ACTIVE');
    const cell=w.state.grid[e.position.y][e.position.x];
    assert.equal(cell.traversal,'FREE');assert.equal(cell.effect,null);
    assert.deepEqual(Array.from(Reflect.ownKeys(e)).sort(),['energy','id','lifecycle','position']);
    assert.deepEqual(Array.from(Reflect.ownKeys(w.state)).sort(),['entities','grid','rng_state','time']);
});
test('F2C-04 §11.4: exact finite energy including -0; no premature threshold decision',()=>{
    for(const energy of [-Number.MAX_VALUE,-0,Number.MIN_VALUE,0,Number.MAX_VALUE,1+Number.EPSILON]) {
        const w=api.prepare_world_before_lifecycle(cfg({initial_energy:energy,death_threshold:0}),1);
        assert.ok(Object.is(w.get_experimental_entity().energy,energy));
        assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE'); // strictly PRE-resolution
        assert.equal(w.state.time,0);
    }
});
test('F2C-05 §11.1: reproducible prepared state and RNG on identical inputs',()=>{
    for(const seed of [1,42,0x80000000,0xFFFFFFFF]) {
        const a=api.prepare_world_before_lifecycle(cfg(),seed), b=api.prepare_world_before_lifecycle(cfg(),seed);
        assert.deepEqual(values(a),values(b));assert.equal(a.rng.get_state(),b.rng.get_state());
    }
});
test('F2C-06 §11.1: same stream/state as F2-B map plus one selection, no extra draws',()=>{
    const c=cfg(),seed=123;
    const reference=new api.World(new api.WorldConfig(c));reference.rng=new api.PRNG(seed);
    const grid=reference._generate_grid(),position=reference._choose_initial_position(grid);
    const w=api.prepare_world_before_lifecycle(c,seed);
    assert.deepEqual(JSON.parse(JSON.stringify(w.state.grid)),JSON.parse(JSON.stringify(grid)));
    assert.deepEqual(JSON.parse(JSON.stringify(w.get_experimental_entity().position)),JSON.parse(JSON.stringify(position)));
    assert.equal(w.rng.get_state(),reference.rng.get_state());
    assert.equal(w.state.rng_state,reference.rng.get_state());
});
test('F2C-07 §11.1: generation/resources/position order; final lifecycle/sync not pretended',()=>{
    const isolated=load(),trace=[];
    for(const name of ['_generate_grid','_choose_initial_position']) {
        const original=isolated.World.prototype[name];
        isolated.World.prototype[name]=function(...args){trace.push(name);return original.apply(this,args);};
    }
    isolated.ctx.recordResources=()=>trace.push('resources');
    vm.runInContext('const originalVerify=verify_generated_initial_resources; verify_generated_initial_resources=(...args)=>{recordResources();return originalVerify(...args);};',isolated.ctx);
    isolated.World.prototype.sync_rng_state=()=>assert.fail('final sync belongs AFTER lifecycle');
    isolated.World.prototype.is_experimental_entity_dead=()=>assert.fail('legacy predicate is not normative authority');
    isolated.World.prototype.resolve_lifecycle=()=>assert.fail('unresolved event contract');
    const w=isolated.prepare_world_before_lifecycle(cfg(),1);
    assert.deepEqual(trace,['_generate_grid','resources','_choose_initial_position']);
    assert.equal(w.state.time,0);assert.ok(isolated.validate_WorldState(w.state,w.config));
});
test('F2C-08 §7.2: snapshot independent both ways, no RNG consumption',()=>{
    const w=api.prepare_world_before_lifecycle(cfg({obstacle_density:0,resource_density:0.3,hazard_density:0.2}),42);
    const before=w.rng.get_state(),snapshot=w.full_snapshot(),entity=snapshot.entities.get('0987898');
    const oldPosition={...entity.position};w.get_experimental_entity().position.x=(oldPosition.x+1)%4;
    assert.equal(entity.position.x,oldPosition.x);
    const oldEnergy=w.get_experimental_entity().energy;entity.energy=1234;
    assert.equal(w.get_experimental_entity().energy,oldEnergy);
    const resource=w.state.grid.flat().find(c=>c.effect?.kind==='RESOURCE');
    assert.ok(resource);const clone=snapshot.grid.flat().find(c=>c.effect?.kind==='RESOURCE');
    resource.effect.stock=0;assert.equal(clone.effect.stock,1);
    assert.equal(w.rng.get_state(),before);assert.equal(snapshot.rng_state,before);
});
test('F2C-09 §11.3: no candidates preserves ORIGINAL seed, reason and message',()=>{
    const c=cfg({obstacle_density:1});
    for(const seed of [1,42,0xFFFFFFFF]) assert.throws(()=>api.prepare_world_before_lifecycle(c,seed),e=>
        e instanceof api.InitializationError && !(e instanceof api.ContractError) &&
        e.seed===seed && e.reason==='invalid initial_position' && e.message==='invalid initial_position');
});
test('F2C-10 §26: preserve programming/contract errors, never wrap them as InitializationError',()=>{
    for(const method of ['_generate_grid','_choose_initial_position']) {
        const isolated=load(),error=new Error('sentinel programming failure');
        isolated.World.prototype[method]=()=>{throw error;};
        assert.throws(()=>isolated.prepare_world_before_lifecycle(cfg(),1),e=>e===error && !Object.hasOwn(e,'seed'));
    }
    const isolated=load(),error=new isolated.ContractError('invalid initial_state');
    isolated.World.prototype._choose_initial_position=()=>{throw error;};
    assert.throws(()=>isolated.prepare_world_before_lifecycle(cfg(),1),e=>e===error && !Object.hasOwn(e,'seed'));
});
test('F2C-11 §8/F2-B: reuse generated resources verbatim; reject repair or redistribution',()=>{
    const c=new api.WorldConfig(cfg()),w=new api.World(c);w.rng=new api.PRNG(42);
    const grid=w._generate_grid(),before=JSON.stringify(grid),rng=w.rng.get_state();
    api.verify_generated_initial_resources(grid,c);
    assert.equal(JSON.stringify(grid),before);assert.equal(w.rng.get_state(),rng);
    const resource=grid.flat().find(cell=>cell.effect?.kind==='RESOURCE');assert.ok(resource);
    resource.effect.stock=0;
    assert.throws(()=>api.verify_generated_initial_resources(grid,c),{name:'ContractError',message:'invalid initial_state'});
    assert.equal(resource.effect.stock,0);
    for(const g of [null,[],new Array(c.height)]) assert.throws(()=>api.verify_generated_initial_resources(g,c),api.ContractError);
});
test('F2C-12: config captured immutably; resources/state construction has no duplicate float draws',()=>{
    const isolated=load(),input=cfg(),float=isolated.PRNG.prototype.next_float,int=isolated.PRNG.prototype.next_int;
    let floats=0,ints=0;
    isolated.PRNG.prototype.next_float=function(){floats++;return float.call(this);};
    isolated.PRNG.prototype.next_int=function(...args){ints++;return int.apply(this,args);};
    const w=isolated.prepare_world_before_lifecycle(input,1),blocked=w.state.grid.flat().filter(c=>c.traversal==='BLOCKED').length;
    assert.equal(floats,2*input.width*input.height-blocked);assert.equal(ints,1);
    input.initial_energy=999;assert.notEqual(w.get_experimental_entity().energy,999);assert.ok(Object.isFrozen(w.config));
});
