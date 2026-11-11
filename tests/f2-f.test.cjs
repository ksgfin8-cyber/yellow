const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
// Same preparation boundary as F2-E; index is consulted only for script loading.
for (const [, src] of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, src), 'utf8'), ctx, {filename: src});
    if (src === 'js/interface/observation.js') break;
}
vm.runInContext('Math.random = () => { throw new Error("Math.random forbidden"); };', ctx);
const {WorldConfig, Cell, build_observation, prepare_world_before_lifecycle, validate_WorldState, CellObservation} =
    vm.runInContext('({WorldConfig, Cell, build_observation, prepare_world_before_lifecycle, validate_WorldState, CellObservation})', ctx);
function fixture(patch = {}, seed = 1) {
    const w = prepare_world_before_lifecycle({...WorldConfig.defaults(), width: 3, height: 3,
        obstacle_density: 0, resource_density: 0, hazard_density: 0, observation_radius: 1, ...patch}, seed);
    w.get_experimental_entity().position = {x: Math.min(1, w.config.width - 1), y: Math.min(1, w.config.height - 1)};
    assert.ok(validate_WorldState(w.state, w.config)); return w;
}
const observe = (w, radius = w.config.observation_radius) => build_observation(w, w.get_experimental_entity(), radius);
const representations = o => Array.from(o.local_view, row => Array.from(row, cell => cell.representation));
const clone = x => structuredClone(x);
function unchanged(w, operation) {
    const before = clone(w.state), rng = w.rng.get_state(); const result = operation();
    assert.deepEqual(clone(w.state), before); assert.equal(w.rng.get_state(), rng); return result;
}
function schema(o) {
    assert.deepEqual(Object.keys(o).sort(), ['local_view','self','tick']);
    assert.deepEqual(Object.keys(o.self).sort(), ['energy','id','position']);
    assert.deepEqual(Object.keys(o.self.position).sort(), ['x','y']);
    for (const row of o.local_view) for (const cell of row) {
        assert.deepEqual(Object.keys(cell).sort(), ['occupied','representation']);
        assert.equal(cell.occupied, false);
        assert.ok(['FREE','BLOCKED','RESOURCE','HAZARD','OUT_OF_BOUNDS'].includes(cell.representation));
    }
}
function patterned() {
    const w = fixture();
    w.state.grid[0][0] = Cell.blocked();
    w.state.grid[0][1] = new Cell('FREE', {kind:'RESOURCE', stock:0});
    w.state.grid[0][2] = new Cell('FREE', {kind:'HAZARD'});
    w.state.grid[1][2] = new Cell('FREE', {kind:'RESOURCE', stock:1});
    w.state.grid[2][0] = new Cell('FREE', {kind:'HAZARD'});
    w.state.grid[2][1] = Cell.blocked();
    return w;
}
test('F2F-01 §16/policy: radius zero, exact closed records and no internal data', () => {
    const w = fixture({observation_radius:0}); const e = w.get_experimental_entity();
    const o = unchanged(w, () => observe(w)); schema(o);
    assert.deepEqual(representations(o), [['FREE']]);
    assert.deepEqual(clone(o.self), {id:e.id, position:{x:1,y:1}, energy:100});
    assert.equal(o.tick, 0); assert.equal(Object.hasOwn(o, 'time'), false);
});
test('F2F-02 §8/16: hard-coded center matrix preserves all distinctions and row/column order', () => {
    const o = observe(patterned()); schema(o);
    assert.deepEqual(representations(o), [
        ['BLOCKED','RESOURCE','HAZARD'], ['FREE','FREE','RESOURCE'], ['HAZARD','BLOCKED','FREE']
    ]);
});
test('F2F-03 §16 Chebyshev: diagonal corners included at radius 1; radius 2 covers 5x5', () => {
    const w = fixture({width:5,height:5,observation_radius:1}); const e = w.get_experimental_entity(); e.position={x:2,y:2};
    for (const [x,y] of [[1,1],[3,1],[1,3],[3,3]]) w.state.grid[y][x]=new Cell('FREE',{kind:'HAZARD'});
    const small = representations(observe(w));
    assert.deepEqual(small, [['HAZARD','FREE','HAZARD'],['FREE','FREE','FREE'],['HAZARD','FREE','HAZARD']]);
    const large=observe(w,2); assert.equal(large.local_view.length,5); assert.ok(large.local_view.every(row=>row.length===5));
    assert.ok(large.local_view.flat().every(cell=>cell.representation!=='OUT_OF_BOUNDS'));
});
test('F2F-04 §16 BOUNDED: four corners match fixed outside masks, never wrapped cells', () => {
    const masks = [
        [{x:0,y:0}, ['OOO','OFF','OFF']], [{x:2,y:0}, ['OOO','FFO','FFO']],
        [{x:0,y:2}, ['OFF','OFF','OOO']], [{x:2,y:2}, ['FFO','FFO','OOO']]
    ];
    for (const [position, expected] of masks) {
        const w = fixture(); w.get_experimental_entity().position=position;
        const actual=representations(observe(w)).map(row=>row.map(r=>r==='OUT_OF_BOUNDS'?'O':'F').join(''));
        assert.deepEqual(actual,expected);
    }
});
test('F2F-05 §16 BOUNDED: four edge midpoints have exactly one outside row/column', () => {
    for (const [position, expected] of [
        [{x:1,y:0},['OOO','FFF','FFF']], [{x:1,y:2},['FFF','FFF','OOO']],
        [{x:0,y:1},['OFF','OFF','OFF']], [{x:2,y:1},['FFO','FFO','FFO']]
    ]) {
        const w=fixture();w.get_experimental_entity().position=position;
        assert.deepEqual(representations(observe(w)).map(row=>row.map(r=>r==='OUT_OF_BOUNDS'?'O':'F').join('')),expected);
    }
});
test('F2F-06 §16: width/height 1 and radius larger than map retain full window', () => {
    for (const [width,height,expected] of [
        [1,1,['OOO','OFO','OOO']], [1,3,['OFO','OFO','OFO']], [3,1,['OOO','FFF','OOO']]
    ]) {
        const w=fixture({width,height});
        assert.deepEqual(representations(observe(w)).map(row=>row.map(r=>r==='OUT_OF_BOUNDS'?'O':'F').join('')),expected);
    }
    const w=fixture({width:1,height:1}); const big=observe(w,3);
    assert.equal(big.local_view.length,7); assert.equal(big.local_view.flat().filter(c=>c.representation==='OUT_OF_BOUNDS').length,48);
    assert.equal(big.local_view[3][3].representation,'FREE');
});
test('F2F-07 §16: outside positions cause no additional grid cell reads', () => {
    const w=fixture({width:1,height:1}); let reads=0;
    w.state.grid[0]=new Proxy(w.state.grid[0],{get(target,key,receiver){
        if (typeof key==='string' && /^-?\d+$/.test(key)) { assert.equal(key,'0'); reads++; }
        return Reflect.get(target,key,receiver);
    }});
    assert.ok(validate_WorldState(w.state,w.config)); const validationReads=reads; reads=0;
    const o=observe(w,4);
    assert.equal(reads, validationReads+1); // validation plus the single in-bounds projection
    assert.equal(o.local_view[4][4].representation,'FREE');
});
test('F2F-08 §35.6 S-2: changing resource stock0↔1 leaves complete observation indistinguishable', () => {
    const w=fixture();w.state.grid[0][0]=new Cell('FREE',{kind:'RESOURCE',stock:0});
    const depleted=clone(observe(w));w.state.grid[0][0].effect.stock=1;
    const full=observe(w);assert.deepEqual(clone(full),depleted);schema(full);
    assert.equal(full.local_view[0][0].representation,'RESOURCE');
    assert.equal(JSON.stringify(full).includes('stock'),false);
});
test('F2F-09 §16: occupied is false for all representations, including self and outside', () => {
    const w=patterned();const o=observe(w,2);schema(o);
    assert.ok(o.local_view.flat().every(c=>c.occupied===false));
    assert.deepEqual(Array.from(Object.values(CellObservation)).sort(),['BLOCKED','FREE','HAZARD','OUT_OF_BOUNDS','RESOURCE']);
});
test('F2F-10 §5/7: tick preserves admitted Number/BigInt uint64 values exactly', () => {
    const w=fixture({observation_radius:0});
    for (const time of [0,7,Number.MAX_SAFE_INTEGER,0n,9007199254740993n,0xffffffffffffffffn]) {
        w.state.time=time;const o=unchanged(w,()=>observe(w));const expected=BigInt(time)<=BigInt(Number.MAX_SAFE_INTEGER)?Number(time):time;assert.equal(o.tick,expected);assert.equal(typeof o.tick,typeof expected);
    }
});
test('F2F-11 §9/policy: ACTIVE and DEAD may observe; negative/subnormal/-0 energy is copied exactly', () => {
    for (const lifecycle of ['ACTIVE','DEAD']) for (const energy of [-12,-0,Number.MIN_VALUE,Number.MAX_VALUE]) {
        const w=fixture({initial_energy:energy});w.get_experimental_entity().lifecycle=lifecycle;
        if(lifecycle==='DEAD')w.state.grid[1][1]=Cell.blocked();
        const o=unchanged(w,()=>observe(w));assert.ok(Object.is(o.self.energy,energy));schema(o);
    }
});
test('F2F-12: output and calls have independent references; mutations cannot reach WORLD', () => {
    const w=patterned(),before=clone(w.state),a=observe(w),b=observe(w);
    assert.notEqual(a.self.position,w.get_experimental_entity().position);assert.notEqual(a.local_view,w.state.grid);
    assert.notEqual(a,b);assert.notEqual(a.self,b.self);assert.notEqual(a.local_view[0],b.local_view[0]);
    const cells=a.local_view.flat();assert.equal(new Set(cells).size,9);
    a.self.position.x=99;a.self.energy=0;a.local_view[0][0].representation='caller';a.local_view[0].push({});
    assert.deepEqual(clone(w.state),before);assert.equal(b.self.position.x,1);assert.equal(b.local_view[0][0].representation,'BLOCKED');
    w.state.grid[0][1].effect.stock=1;w.get_experimental_entity().position.x=0;
    assert.equal(b.self.position.x,1);assert.equal(b.local_view[0][1].representation,'RESOURCE');
});
test('F2F-13 §4/16: frozen WORLD state is not mutated; no RNG or transition methods accessed', () => {
    const w=patterned();const before=clone(w.state),rng=w.rng.get_state();
    for (const row of w.state.grid) {for(const cell of row){if(cell.effect)Object.freeze(cell.effect);Object.freeze(cell);}Object.freeze(row);}
    Object.freeze(w.state.grid);const e=w.get_experimental_entity();Object.freeze(e.position);Object.freeze(e);Object.freeze(w.state);
    for(const key of ['rng','recorder'])Object.defineProperty(w,key,{get(){assert.fail('forbidden access '+key);}});
    for(const key of ['apply_action','resolve_lifecycle','advance_dynamics','regenerate_resources','sync_rng_state'])w[key]=()=>assert.fail('forbidden call '+key);
    const o=observe(w);schema(o);assert.deepEqual(clone(w.state),before);assert.ok(rng>0);
});
test('F2F-14: same state and seed produce identical observations and unchanged real PRNG', () => {
    for(const seed of [1,42,0xffffffff]) {
        const a=fixture({},seed),b=fixture({},seed);const rng=a.rng.get_state();
        for(let i=0;i<3;i++)assert.deepEqual(clone(unchanged(a,()=>observe(a))),clone(unchanged(b,()=>observe(b))));
        assert.equal(a.rng.get_state(),rng);
    }
});
test('F2F-15 validation: reject invalid WORLD/config/entity before building output', () => {
    assert.throws(()=>build_observation(null,null,0),{name:'ContractError',message:'invalid initial_state'});
    for(const corrupt of [w=>w.state.rng_state=0,w=>w.state.time=-1,w=>w.state.grid[2].pop(),w=>w.state.grid[0][0].effect={kind:'RESOURCE',stock:2}]) {
        const w=fixture();corrupt(w);unchanged(w,()=>assert.throws(()=>observe(w),{name:'ContractError',message:'invalid initial_state'}));
    }
    const w=fixture();for(const entity of [null,{},clone(w.get_experimental_entity()),{...w.get_experimental_entity(),id:'other'}])
        unchanged(w,()=>assert.throws(()=>build_observation(w,entity,1),{name:'ContractError',message:'invalid initial_state'}));
    w.config={...w.config,topology:'TOROIDAL'};
    unchanged(w,()=>assert.throws(()=>observe(w),{name:'ContractError',message:'invalid world_config'}));
});
test('F2F-16 validation: radius is explicit uint32, no coercion and no frozen-domain changes', () => {
    const w=fixture();for(const radius of [-1,0.5,0x100000000,NaN,Infinity,'1',1n,null,undefined])
        unchanged(w,()=>assert.throws(()=>build_observation(w,w.get_experimental_entity(),radius),{name:'ContractError',message:'world transition failed'}));
    const zero=observe(w,-0);assert.deepEqual(representations(zero),[['FREE']]);
});
test('F2F-17 capacity policy: valid large radii fail distinctly without WORLD mutation or allocation', () => {
    for(const radius of [512,100000,0xffffffff]) {
        const w=fixture({observation_radius:radius});assert.ok(validate_WorldState(w.state,w.config));
        unchanged(w,()=>assert.throws(()=>observe(w),{name:'RangeError',message:'observation window exceeds implementation capacity'}));
    }
});
test('F2F-18 capacity boundary: radius511 actually builds full 1023x1023 window within budget', () => {
    const w=fixture({width:1,height:1,observation_radius:511});const o=unchanged(w,()=>observe(w));
    assert.equal(o.local_view.length,1023);assert.ok(o.local_view.every(row=>row.length===1023));
    assert.equal(o.local_view[511][511].representation,'FREE');
    assert.equal(o.local_view[0][0].representation,'OUT_OF_BOUNDS');
    assert.equal(o.local_view[1022][1022].representation,'OUT_OF_BOUNDS');
    assert.equal(o.local_view.flat().filter(c=>c.representation==='FREE').length,1);
});
