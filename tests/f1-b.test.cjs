const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
for (const file of ['core/contracts', 'core/prng', 'core/hash', 'core/seed', 'world/world_config', 'contracts/structures', 'interface/action']) {
    vm.runInContext(fs.readFileSync(path.join(root,'js',file+'.js'),'utf8'),ctx,{filename:file});
}
const api = vm.runInContext('({WorldConfig,WORLD_CONFIG_FIELDS,ContractError,PRNG,canonicalize_binary64,validate_WorldConfig,validate_Cell,validate_EntityState,validate_WorldState,assert_WorldState,validate_Action_structural,assert_Action_structural,inspect_ExperimentConfig_defined_fields,Map})',ctx);
const {WorldConfig,ContractError} = api;
const config = () => ({...WorldConfig.defaults(), width: 1, height: 1});
const entity = () => ({id:'0987898',position:{x:0,y:0},energy:10,lifecycle:'ACTIVE'});
const cell = () => ({traversal:'FREE',effect:null});
const state = () => ({time:0,grid:[[cell()]],entities:new api.Map([['0987898',entity()]]),rng_state:1});
const invalid = [NaN,Infinity,-Infinity,'1',null,undefined,true,{},1n];
function failsConfig(p) {
    assert.equal(api.validate_WorldConfig(p),false);
    assert.throws(()=>new WorldConfig(p),{name:'ContractError',message:'invalid world_config'});
}
test('B01: required/extra fields, data fields, exact error, immutability', () => {
    const p=config(), c=new WorldConfig(p);
    assert.equal(api.validate_WorldConfig(c),true);
    assert.ok(Object.isFrozen(c));
    p.width=2; assert.equal(c.width,1);
    assert.equal(Reflect.set(c,'width',2),false);
    for (const key of api.WORLD_CONFIG_FIELDS) { const p=config(); delete p[key]; failsConfig(p); }
    failsConfig({...config(),unexpected:1});
    failsConfig({...config(),hazard_effect:2});
    failsConfig({...config(),[Symbol('extra')]:1});
    const inherited=Object.create(config()); failsConfig(inherited);
    const getter=config(); Object.defineProperty(getter,'width',{get(){throw Error('must not run');}}); failsConfig(getter);
    for (const p of [null,undefined,[],3]) failsConfig(p);
});
test('B02: uint32 fields and exact wide MAX_CELLS product', () => {
    assert.ok(api.validate_WorldConfig({...config(),width:1024,height:1024}));
    assert.ok(api.validate_WorldConfig({...config(),width:2**20}));
    for (const p of [{width:1025,height:1024},{width:0xFFFFFFFF,height:0xFFFFFFFF},{width:0},{height:0},{width:2**20+1}]) failsConfig({...config(),...p});
    for (const k of ['width','height','move_cost','wait_cost','resource_effect','hazard_damage','resource_regeneration','observation_radius']) {
        for (const v of [...invalid,-1,0.5,2**32,Number.MAX_SAFE_INTEGER+1]) failsConfig({...config(),[k]:v});
    }
    for (const k of ['move_cost','wait_cost','resource_effect','hazard_damage','resource_regeneration','observation_radius']) {
        for (const v of [0,0xFFFFFFFF]) assert.ok(api.validate_WorldConfig({...config(),[k]:v}));
    }
});
test('B03: finite densities, sum boundaries, topology exact', () => {
    for (const k of ['obstacle_density','resource_density','hazard_density']) {
        for (const v of [...invalid,-Number.MIN_VALUE,1+Number.EPSILON]) failsConfig({...config(),[k]:v});
    }
    assert.ok(api.validate_WorldConfig({...config(),resource_density:1,hazard_density:0,obstacle_density:1}));
    failsConfig({...config(),resource_density:1,hazard_density:Number.EPSILON});
    for (const topology of ['TOROIDAL','bounded',null,1]) failsConfig({...config(),topology});
});
test('B04: energy finite, threshold safe signed domain', () => {
    for (const initial_energy of [-Number.MAX_VALUE,Number.MIN_VALUE,-0,Number.MAX_VALUE]) assert.ok(api.validate_WorldConfig({...config(),initial_energy}));
    for (const initial_energy of invalid) failsConfig({...config(),initial_energy});
    for (const death_threshold of [Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER,0]) assert.ok(api.validate_WorldConfig({...config(),death_threshold}));
    for (const death_threshold of [...invalid,0.5,Number.MAX_SAFE_INTEGER+1,Number.MIN_SAFE_INTEGER-1]) failsConfig({...config(),death_threshold});
});
test('B05: binary64 exact bits except -0, reject non Numbers/nonfinite', () => {
    const canonical=api.canonicalize_binary64;
    assert.ok(Object.is(canonical(-0),+0)); assert.ok(Object.is(canonical(+0),+0));
    for (const x of [Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE,1+Number.EPSILON,0.1]) {
        const before=Buffer.alloc(8), after=Buffer.alloc(8);
        before.writeDoubleBE(x); after.writeDoubleBE(canonical(x)); assert.deepEqual(after,before);
    }
    for (const x of invalid) assert.throws(()=>canonical(x),ContractError);
});
test('B06: Cell/effect shape, binary stock, blocked has no effect', () => {
    for (const effect of [null,{kind:'RESOURCE',stock:0},{kind:'RESOURCE',stock:1},{kind:'HAZARD'}]) assert.ok(api.validate_Cell({...cell(),effect}));
    assert.ok(api.validate_Cell({traversal:'BLOCKED',effect:null}));
    for (const bad of [null,{},[],{...cell(),extra:1},{traversal:'OTHER',effect:null},{traversal:'BLOCKED',effect:{kind:'HAZARD'}}]) assert.equal(api.validate_Cell(bad),false);
    for (const effect of [{},{kind:'RESOURCE'},{kind:'RESOURCE',stock:2},{kind:'RESOURCE',stock:true},{kind:'RESOURCE',stock:NaN},{kind:'HAZARD',stock:0},{kind:'OTHER'},[{kind:'HAZARD'}]]) assert.equal(api.validate_Cell({...cell(),effect}),false);
});
test('B07: Entity fields, UTF-8 id, lifecycle, grid position, energy', () => {
    assert.ok(api.validate_EntityState(entity(),config()));
    for (const patch of [{id:''},{id:'\uD800'},{id:1},{energy:NaN},{energy:Infinity},{lifecycle:'OTHER'},{position:{x:0,y:0,z:0}},{position:{x:1,y:0}},{position:{x:0,y:-1}},{position:{x:0.5,y:0}},{extra:1}]) assert.equal(api.validate_EntityState({...entity(),...patch},config()),false);
    for (const key of ['id','position','energy','lifecycle']) {const e=entity();delete e[key];assert.equal(api.validate_EntityState(e,config()),false);}
    assert.ok(api.validate_EntityState({...entity(),id:'😀',lifecycle:'DEAD',energy:-Number.MAX_VALUE},config()));
    assert.equal(api.validate_EntityState(entity(),null),false);
});
test('B08: WorldState closed shape, exact uint64 and rng domain', () => {
    for (const time of [0,Number.MAX_SAFE_INTEGER,0n,0xFFFFFFFFFFFFFFFFn]) assert.ok(api.validate_WorldState({...state(),time},config()));
    for (const time of [...invalid.filter(v=>v!==1n),-1,-1n,2n**64n,Number.MAX_SAFE_INTEGER+1,0.5]) assert.equal(api.validate_WorldState({...state(),time},config()),false);
    for (const rng_state of [0,...invalid,-1,2**32,0.5]) assert.equal(api.validate_WorldState({...state(),rng_state},config()),false);
    for (const key of ['time','grid','entities','rng_state']) {const s=state();delete s[key];assert.equal(api.validate_WorldState(s,config()),false);}
    assert.equal(api.validate_WorldState({...state(),extra:1},config()),false);
    assert.throws(()=>api.assert_WorldState({},config()),{name:'ContractError',message:'invalid initial_state'});
});
test('B09: rectangular dense grid, entity cardinality and matching id', () => {
    for (const grid of [[],[[]],[[cell(),cell()]],new Array(1),[new Array(1)],[[{traversal:'OTHER',effect:null}]]]) assert.equal(api.validate_WorldState({...state(),grid},config()),false);
    for (const entities of [new api.Map(),new api.Map([['x',entity()]]),new api.Map([['0987898',entity()],['x',{...entity(),id:'x'}]]),{'0987898':entity()}]) assert.equal(api.validate_WorldState({...state(),entities},config()),false);
    assert.equal(api.validate_WorldState(state(),{...config(),height:2}),false);
});
test('B10: ACTIVE only FREE, DEAD permitted, validators do not mutate', () => {
    const s=state();s.grid[0][0].traversal='BLOCKED';
    assert.equal(api.validate_WorldState(s,config()),false);
    s.entities.get('0987898').lifecycle='DEAD';assert.ok(api.validate_WorldState(s,config()));
    const c=config();const before=JSON.stringify([c,s.grid,s.time,s.rng_state,Array.from(s.entities)]);
    api.validate_WorldState(s,c);
    assert.equal(JSON.stringify([c,s.grid,s.time,s.rng_state,Array.from(s.entities)]),before);
});
test('B11: Action closed structure is distinct from enum membership', () => {
    for (const type of ['WAIT','MOVE_N','UNKNOWN','']) assert.ok(api.validate_Action_structural({type}));
    for (const action of [null,[],{},'WAIT',{type:1},{type:'WAIT',extra:1},Object.create({type:'WAIT'})]) {
        assert.equal(api.validate_Action_structural(action),false);
        assert.throws(()=>api.assert_Action_structural(action),{name:'ContractError',message:'invalid action structure'});
    }
});
test('B12: Experiment inspection stays explicitly partial', () => {
    const inspect=api.inspect_ExperimentConfig_defined_fields;
    const p={experiment_seed:1,max_ticks:0,world_config:config(),feedback_config:{},agent_type:'unknown'};
    const report=inspect(p);assert.equal(report.complete,false);assert.equal(report.issues.length,0);
    assert.ok(inspect({...p,experiment_seed:0}).issues.length>0);
    assert.ok(inspect({...p,world_config:{}}).issues.length>0);
    for(const k of Object.keys(p)){const q={...p};delete q[k];assert.ok(inspect(q).issues.length>0);}
    assert.equal(inspect(null).complete,false);
});
