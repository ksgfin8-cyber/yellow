const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const ctx = vm.createContext({});
// Exercise the actual HTML load order through WORLD, without initializing it.
for (const src of scripts) {
    vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
    if (src === 'js/world/world.js') break;
}
const api = vm.runInContext('({Cell, EntityState, WorldState, World, WorldConfig, PRNG, ContractError, validate_Cell, validate_EntityState, validate_WorldState, Map})',ctx);
const {Cell, EntityState, WorldState, World, WorldConfig, ContractError} = api;
const config = () => new WorldConfig({...WorldConfig.defaults(), width:3, height:2});
const grid = () => [
    [Cell.free(), new Cell('FREE',{kind:'RESOURCE',stock:1}), Cell.blocked()],
    [new Cell('FREE',{kind:'HAZARD'}), Cell.free(), Cell.free()]
];
const entity = (cfg=config(), lifecycle='ACTIVE', energy=17.25) => new EntityState('0987898',{x:0,y:0},energy,lifecycle,cfg);
function makeState(time=0, rng=1, energy=17.25) {
    const cfg=config();
    return new WorldState(time,grid(),new api.Map([['0987898',entity(cfg,'ACTIVE',energy)]]),rng,cfg);
}
const invalidState = fn => assert.throws(fn,{name:'ContractError',message:'invalid initial_state'});
const keys = value => Array.from(Reflect.ownKeys(value)).sort();
test('F2A-01 §8: all Cell variants validate and remain closed',()=>{
    for(const c of [Cell.free(),Cell.blocked(),new Cell('FREE',{kind:'RESOURCE',stock:0}),new Cell('FREE',{kind:'RESOURCE',stock:1}),new Cell('FREE',{kind:'HAZARD'})]) {
        assert.equal(api.validate_Cell(c),true);
        assert.deepEqual(keys(c),['effect','traversal']);
        assert.equal(api.validate_Cell(c.copy()),true);
    }
});
test('F2A-02 §8: invalid effects rejected, never coerced to null',()=>{
    for(const effect of [undefined,false,0,'',{}, {kind:'RESOURCE'}, {kind:'RESOURCE',stock:2}, {kind:'RESOURCE',stock:NaN}, {kind:'HAZARD',extra:0}]) invalidState(()=>new Cell('FREE',effect));
    invalidState(()=>new Cell('OTHER',null));
    invalidState(()=>new Cell('BLOCKED',{kind:'HAZARD'}));
});
test('F2A-03 §8: construction and copy isolate mutable effects both ways',()=>{
    const effect={kind:'RESOURCE',stock:1}, original=new Cell('FREE',effect), copy=original.copy();
    effect.stock=0; assert.equal(original.effect.stock,1);
    original.effect.stock=0; assert.equal(copy.effect.stock,1);
    copy.effect.stock=1; assert.equal(original.effect.stock,0);
    assert.notEqual(original.effect,copy.effect);
    original.extra=1; invalidState(()=>original.copy());
});
test('F2A-04 §9: explicit lifecycle and closed valid entity copies',()=>{
    for(const lifecycle of ['ACTIVE','DEAD']) {
        const cfg=config(), e=entity(cfg,lifecycle), copy=e.copy();
        assert.equal(api.validate_EntityState(e,cfg),true);
        assert.equal(api.validate_EntityState(copy,cfg),true);
        assert.equal(copy.lifecycle,lifecycle);
        assert.deepEqual(keys(copy),['energy','id','lifecycle','position']);
        assert.deepEqual(keys(copy.position),['x','y']);
    }
});
test('F2A-05 §9: invalid entity structures/config rejected without defaults',()=>{
    const cfg=config();
    for(const [id,position,energy,lifecycle] of [
        ['', {x:0,y:0},1,'ACTIVE'], ['\uD800',{x:0,y:0},1,'ACTIVE'],
        ['e',{x:3,y:0},1,'ACTIVE'], ['e',{x:0,y:0,z:1},1,'ACTIVE'],
        ['e',{x:0,y:0},NaN,'ACTIVE'], ['e',{x:0,y:0},Infinity,'DEAD'],
        ['e',{x:0,y:0},1,undefined], ['e',{x:0,y:0},1,'OTHER']
    ]) invalidState(()=>new EntityState(id,position,energy,lifecycle,cfg));
    invalidState(()=>new EntityState('e',{x:0,y:0},1,'ACTIVE'));
    const e=entity(); e.extra=0; invalidState(()=>e.copy());
});
test('F2A-06 §9: positions/config copied; no lifecycle transition or numeric change',()=>{
    const cfg={...config()}, p={x:0,y:0}, e=new EntityState('e',p,-0,'DEAD',cfg);
    p.x=1; cfg.width=1; assert.equal(e.position.x,0);
    const c=e.copy(); e.position.x=2; assert.equal(c.position.x,0);
    c.position.y=1; assert.equal(e.position.y,0);
    assert.equal(c.lifecycle,'DEAD'); assert.ok(Object.is(c.energy,-0));
});
test('F2A-07 §7: constructors/snapshots produce validated closed states',()=>{
    const s=makeState();
    for(const v of [s,s.copy(),s.full_snapshot()]) {
        assert.equal(api.validate_WorldState(v,config()),true);
        assert.deepEqual(keys(v),['entities','grid','rng_state','time']);
        for(const row of v.grid) for(const c of row) assert.equal(api.validate_Cell(c),true);
        assert.equal(api.validate_EntityState(v.entities.get('0987898'),config()),true);
    }
});
test('F2A-08 §7: state rejects cardinality, shape, RNG and ACTIVE on BLOCKED',()=>{
    const cfg=config(), e=entity(cfg), entities=new api.Map([['0987898',e]]);
    for(const time of [-1,NaN,Infinity,2n**64n,Number.MAX_SAFE_INTEGER+1]) invalidState(()=>new WorldState(time,grid(),entities,1,cfg));
    for(const rng of [0,2**32,-1,1.5,1n,'1']) invalidState(()=>new WorldState(0,grid(),entities,rng,cfg));
    for(const entities of [new api.Map(),new api.Map([['wrong',e]]),new api.Map([['0987898',e],['e',e]])]) invalidState(()=>new WorldState(0,grid(),entities,1,cfg));
    for(const g of [[],[[]],new Array(2),[new Array(3),grid()[1]]]) invalidState(()=>new WorldState(0,g,entities,1,cfg));
    const g=grid();g[0][0]=Cell.blocked();invalidState(()=>new WorldState(0,g,entities,1,cfg));
    invalidState(()=>new WorldState(0,grid(),entities,1));
});
test('F2A-09 §7: raw validated records accepted without relying on copy methods',()=>{
    const cfg=config(), raw={id:'e',position:{x:0,y:0},energy:1,lifecycle:'ACTIVE'};
    const g=grid(), m=new api.Map([['e',raw]]), s=new WorldState(0,g,m,1,cfg);
    raw.position.x=2;g[0][0].traversal='BLOCKED';m.clear();
    assert.equal(s.entities.get('e').position.x,0);
    assert.equal(s.grid[0][0].traversal,'FREE');assert.equal(s.entities.size,1);
    const c=s.copy();assert.ok(api.validate_WorldState(c,cfg));
});
test('F2A-10 §7.2: snapshots deeply independent in both directions',()=>{
    const original=makeState(), copy=original.full_snapshot();
    assert.notEqual(copy.grid,original.grid);
    for(let y=0;y<2;y++) {
        assert.notEqual(copy.grid[y],original.grid[y]);
        for(let x=0;x<3;x++) {
            assert.notEqual(copy.grid[y][x],original.grid[y][x]);
            if(original.grid[y][x].effect !== null) assert.notEqual(copy.grid[y][x].effect,original.grid[y][x].effect);
        }
    }
    assert.notEqual(copy.entities,original.entities);
    assert.notEqual(copy.entities.get('0987898'),original.entities.get('0987898'));
    original.grid[0][1].effect.stock=0;
    original.grid[1][0].effect=null;
    original.entities.get('0987898').position.x=1;
    original.entities.get('0987898').lifecycle='DEAD';
    original.time=5;original.rng_state=17;
    assert.equal(copy.grid[0][1].effect.stock,1);assert.equal(copy.grid[1][0].effect.kind,'HAZARD');
    assert.equal(copy.entities.get('0987898').position.x,0);assert.equal(copy.entities.get('0987898').lifecycle,'ACTIVE');
    assert.equal(copy.time,0);assert.equal(copy.rng_state,1);
    copy.grid[0][0].effect={kind:'RESOURCE',stock:0};
    copy.entities.get('0987898').position.y=1;
    copy.entities.get('0987898').energy=42;copy.entities.clear();
    assert.equal(original.grid[0][0].effect,null);
    assert.equal(original.entities.get('0987898').position.y,0);
    assert.equal(original.entities.get('0987898').energy,17.25);
});
test('F2A-11 §6.3/§7: exact time representation, RNG and energy preserved',()=>{
    for(const time of [0,-0,Number.MAX_SAFE_INTEGER,0n,2n**53n+1n,0xFFFFFFFFFFFFFFFFn]) {
        for(const energy of [-0,Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,1+Number.EPSILON]) {
            const s=makeState(time,0xFFFFFFFF,energy), c=s.full_snapshot();
            assert.equal(typeof c.time,typeof time);assert.ok(Object.is(c.time,time));
            assert.equal(c.rng_state,0xFFFFFFFF);assert.ok(Object.is(c.entities.get('0987898').energy,energy));
            assert.equal(api.validate_WorldState(c,config()),true);
        }
    }
});
test('F2A-12 §7: invalid mutations rejected, never stripped/repaired by copy',()=>{
    for(const mutate of [s=>{s.extra=1;},s=>{s.rng_state=2**32+1;},s=>{s.entities.get('0987898').extra=1;},s=>{s.grid[0][1].effect.extra=1;},s=>{s.entities.get('0987898').position.x=99;}]) {
        const s=makeState(); mutate(s);
        assert.equal(api.validate_WorldState(s,config()),false);
        invalidState(()=>s.copy());invalidState(()=>s.full_snapshot());
    }
});
test('F2A-13 §7.2: WORLD delegation copies only state, not clock or RNG',()=>{
    const w=new World(config());invalidState(()=>w.full_snapshot());
    w.state=makeState(7n,42);w.rng=new api.PRNG(1);
    const before=w.rng.get_state(), s=w.full_snapshot();
    assert.ok(api.validate_WorldState(s,config()));assert.equal(w.rng.get_state(),before);
    assert.equal(w.state.time,7n);assert.equal(s.rng_state,42);
    s.grid[0][1].effect.stock=0;assert.equal(w.state.grid[0][1].effect.stock,1);
});
test('F2A-14: HTML refers only to existing scripts; structural load uses F1-B unchanged',()=>{
    for(const src of scripts) assert.ok(fs.existsSync(path.join(root,src)),src);
    assert.ok(scripts.indexOf('js/contracts/structures.js')<scripts.indexOf('js/world/cells.js'));
    assert.ok(scripts.indexOf('js/world/cells.js')<scripts.indexOf('js/world/world_state.js'));
    assert.ok(new Cell('FREE',null) instanceof Cell);
});
