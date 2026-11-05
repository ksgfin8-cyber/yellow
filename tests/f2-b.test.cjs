const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const [,src] of html.matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
    if (src === 'js/world/world.js') break;
}
vm.runInContext('Math.random = () => { throw new Error("Math.random forbidden"); }',ctx);
const {World,WorldConfig,Cell,PRNG,ContractError,InitializationError,validate_Cell} = vm.runInContext('({World,WorldConfig,Cell,PRNG,ContractError,InitializationError,validate_Cell})',ctx);
const cfg = patch => new WorldConfig({...WorldConfig.defaults(),width:3,height:2,...patch});
const shape = grid => JSON.parse(JSON.stringify(grid));
function scripted(values) {
    const calls=[];
    return {calls,next_float() {
        assert.ok(calls.length < values.length,'unexpected extraction');
        const value=values[calls.length]; calls.push(['float',value]); return value;
    },next_int(){assert.fail('unexpected next_int during generation');}};
}
function candidateGrid() {
    return [[Cell.free(),Cell.blocked(),new Cell('FREE',{kind:'RESOURCE',stock:0})],
        [new Cell('FREE',{kind:'HAZARD'}),Cell.free(),Cell.free()]];
}
test('F2B-01 §11.2: exact row-major call stream and strict density thresholds',()=>{
    const values=[0.125, 0.25,0, 0.9,0.25, 0.9,0.5, 0.249, 0.75,0.499];
    const rng=scripted(values), w=new World(cfg({obstacle_density:0.25,resource_density:0.25,hazard_density:0.25}));
    const grid=w._generate_grid(rng);
    assert.deepEqual(shape(grid),[
        [{traversal:'BLOCKED',effect:null},{traversal:'FREE',effect:{kind:'RESOURCE',stock:1}},{traversal:'FREE',effect:{kind:'HAZARD'}}],
        [{traversal:'FREE',effect:null},{traversal:'BLOCKED',effect:null},{traversal:'FREE',effect:{kind:'HAZARD'}}]
    ]);
    assert.deepEqual(rng.calls,values.map(v=>['float',v]));
    for(const row of grid) for(const cell of row) {assert.ok(cell instanceof Cell);assert.ok(validate_Cell(cell));}
});
test('F2B-02 §11.2: one extraction per BLOCKED, no effect draw',()=>{
    const rng=scripted([0,0.2,0.4,0.6,0.8,1-2**-32]);
    const grid=new World(cfg({obstacle_density:1}))._generate_grid(rng);
    assert.equal(rng.calls.length,6);
    for(const row of grid) for(const cell of row) assert.equal(cell.traversal,'BLOCKED');
});
test('F2B-03 §11.2: two extractions per FREE even at density extremes',()=>{
    for(const [resource_density,hazard_density,kind] of [[1,0,'RESOURCE'],[0,1,'HAZARD'],[0,0,null]]) {
        const rng=scripted(new Array(12).fill(0));
        const g=new World(cfg({obstacle_density:0,resource_density,hazard_density}))._generate_grid(rng);
        assert.equal(rng.calls.length,12);
        for(const row of g) for(const cell of row) {
            assert.equal(cell.traversal,'FREE');assert.equal(cell.effect?.kind ?? null,kind);
            if(kind==='RESOURCE') assert.equal(cell.effect.stock,1);
            if(kind==='HAZARD') assert.deepEqual(Object.keys(cell.effect),['kind']);
        }
    }
});
test('F2B-04 §8/§11.2: distinct mutable cells/effects, static HAZARD data',()=>{
    for(const patch of [{resource_density:1,hazard_density:0},{resource_density:0,hazard_density:1}]) {
        const rng=scripted(new Array(12).fill(0.5));
        const g=new World(cfg({obstacle_density:0,...patch}))._generate_grid(rng);
        assert.notEqual(g[0],g[1]);assert.notEqual(g[0][0],g[0][1]);assert.notEqual(g[0][0].effect,g[0][1].effect);
        const saved=shape(g[0][1]);g[0][0].effect=null;assert.deepEqual(shape(g[0][1]),saved);
        assert.equal(rng.calls.length,12);
    }
});
test('F2B-05 §11.3: candidate order y then x, excludes depleted resources',()=>{
    const expected=[{x:0,y:0},{x:1,y:1},{x:2,y:1}],g=candidateGrid(),before=shape(g);
    for(let index=0;index<expected.length;index++) {
        const calls=[],rng={next_float(){assert.fail('unexpected float');},next_int(a,b){calls.push([a,b]);return index;}};
        const p=new World(cfg())._choose_initial_position(g,rng);
        assert.deepEqual(JSON.parse(JSON.stringify(p)),expected[index]);
        assert.deepEqual(calls,[[0,2]]);
        p.x=99; assert.deepEqual(shape(g),before);
    }
});
test('F2B-06 §11.3: one next_int call for singleton, no shortcut',()=>{
    const w=new World(cfg({width:1,height:1})),calls=[];
    const rng={next_int(a,b){calls.push([a,b]);return 0;},next_float(){assert.fail('unexpected float');}};
    assert.deepEqual(JSON.parse(JSON.stringify(w._choose_initial_position([[Cell.free()]],rng))),{x:0,y:0});
    assert.deepEqual(calls,[[0,0]]);
});
test('F2B-07 §11.3: no candidates yields exact initialization failure, zero RNG calls',()=>{
    const w=new World(cfg()),g=[[Cell.blocked(),new Cell('FREE',{kind:'RESOURCE',stock:1}),new Cell('FREE',{kind:'RESOURCE',stock:0})],
        [new Cell('FREE',{kind:'HAZARD'}),Cell.blocked(),Cell.blocked()]];
    let calls=0;const rng={next_float(){calls++;},next_int(){calls++;}};
    assert.throws(()=>w._choose_initial_position(g,rng),error=>error instanceof InitializationError &&
        !(error instanceof ContractError) && error.message==='invalid initial_position' && error.reason==='invalid initial_position');
    assert.equal(calls,0);
});
test('F2B-08 §6/§8: invalid config/grid rejected before RNG consumption',()=>{
    let calls=0;const rng={next_float(){calls++;},next_int(){calls++;}};
    const w=new World({...cfg(),width:0});
    assert.throws(()=>w._generate_grid(rng),{name:'ContractError',message:'invalid world_config'});
    assert.throws(()=>w._choose_initial_position(candidateGrid(),rng),ContractError);
    const valid=new World(cfg());
    for(const g of [null,[],[[]],new Array(2),[new Array(3),candidateGrid()[1]],[[{traversal:'OTHER',effect:null},Cell.free(),Cell.free()],candidateGrid()[1]]])
        assert.throws(()=>valid._choose_initial_position(g,rng),{name:'ContractError',message:'invalid initial_state'});
    assert.equal(calls,0);
});
// Independent BigInt arithmetic and a flat traversal oracle; no production PRNG calls.
function reference(config, seed) {
    let state=BigInt(seed),draws=0;
    function next(){state=(state^(state<<13n))&0xFFFFFFFFn;state=(state^(state>>17n))&0xFFFFFFFFn;state=(state^(state<<5n))&0xFFFFFFFFn;draws++;return Number(state);}
    const flat=[],candidates=[];
    for(let i=0;i<config.width*config.height;i++) {
        const blocked=next()/2**32 < config.obstacle_density;
        let effect=null;
        if(!blocked) {
            const u=next()/2**32;
            if(u<config.resource_density) effect={kind:'RESOURCE',stock:1};
            else if(u<config.resource_density+config.hazard_density) effect={kind:'HAZARD'};
        }
        flat.push({traversal:blocked?'BLOCKED':'FREE',effect});
        if(!blocked && effect===null) candidates.push({x:i%config.width,y:Math.floor(i/config.width)});
    }
    const gridState=Number(state), gridDraws=draws;
    let position=null;
    if(candidates.length) {
        const n=candidates.length,limit=2**32-(2**32%n);let u;
        do {u=next();} while(u>=limit);
        position=candidates[u%n];
    }
    return {flat,position,gridState,finalState:Number(state),gridDraws,draws};
}
test('F2B-09: real PRNG reproduces grid/position and oracle RNG state across seeds',()=>{
    const c=cfg({width:7,height:5,obstacle_density:0.2,resource_density:0.3,hazard_density:0.1});
    for(const seed of [1,42,0x80000000,0xFFFFFFFF]) {
        const expected=reference(c,seed);
        const run=()=>{
            const rng=new PRNG(seed),w=new World(c),g=w._generate_grid(rng);
            assert.equal(rng.get_state(),expected.gridState);
            assert.deepEqual(shape(g).flat(),expected.flat);
            const position=w._choose_initial_position(g,rng);
            assert.deepEqual(JSON.parse(JSON.stringify(position)),expected.position);
            assert.equal(rng.get_state(),expected.finalState);
            return {grid:shape(g),position:JSON.parse(JSON.stringify(position)),state:rng.get_state()};
        };
        assert.deepEqual(run(),run());
    }
});
test('F2B-10: real PRNG float draw count is 2*cells - blocked',()=>{
    const c=cfg({width:9,height:4}),rng=new PRNG(123),next=rng.next_float.bind(rng);let calls=0;
    rng.next_float=()=>{calls++;return next();};
    const g=new World(c)._generate_grid(rng),blocked=g.flat().filter(cell=>cell.traversal==='BLOCKED').length;
    assert.equal(calls,2*c.width*c.height-blocked);
    assert.equal(calls,reference(c,123).gridDraws);
});
test('F2B-11: selected singleton consumes actual F1-A extraction and default world RNG works',()=>{
    const w=new World(cfg({width:1,height:1,obstacle_density:0,resource_density:0,hazard_density:0}));
    w.rng=new PRNG(1);const g=w._generate_grid(),saved=w.rng.get_state();
    const oracle=new PRNG(saved);oracle.next_int(0,0);
    let calls=0;const nextInt=w.rng.next_int.bind(w.rng);w.rng.next_int=(...args)=>{calls++;return nextInt(...args);};
    w._choose_initial_position(g);assert.equal(calls,1);assert.equal(w.rng.get_state(),oracle.get_state());
});
test('F2B-12: generation/selection do not read/write state or clock, create entity, or sync RNG',()=>{
    const w=new World(cfg({obstacle_density:0,resource_density:0,hazard_density:0}));
    Object.defineProperty(w,'state',{get(){assert.fail('state read');},set(){assert.fail('state write');}});
    w.sync_rng_state=()=>assert.fail('unexpected sync');
    const rng=scripted(new Array(12).fill(0.5));
    const g=w._generate_grid(rng);
    const p=w._choose_initial_position(g,{next_int(a,b){assert.equal(a,0);assert.equal(b,5);return 5;}});
    assert.equal(p.x,2);assert.equal(p.y,1);assert.equal(w.experimental_entity_id,null);
});
test('F2B-13: clock is unchanged on generation success and no-candidate failure',()=>{
    for(const time of [0,7,0n,0xFFFFFFFFFFFFFFFFn]) {
        const w=new World(cfg({obstacle_density:1}));w.state=Object.freeze({time,rng_state:17});
        w.rng=new PRNG(1);const g=w._generate_grid();
        const rngState=w.rng.get_state();assert.throws(()=>w._choose_initial_position(g),InitializationError);
        assert.ok(Object.is(w.state.time,time));assert.equal(w.state.rng_state,17);assert.equal(w.rng.get_state(),rngState);
    }
});
