const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const ctx = vm.createContext({});
for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
    if(src==='js/interface/action.js') break;
}
vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
const {World,WorldConfig,Cell,ContractError,prepare_world_before_lifecycle,validate_WorldState} = vm.runInContext('({World,WorldConfig,Cell,ContractError,prepare_world_before_lifecycle,validate_WorldState})',ctx);
function fixture(patch={}) {
    const config={...WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,...patch};
    const w=prepare_world_before_lifecycle(config,1);
    w.get_experimental_entity().position={x:1,y:1};
    assert.ok(validate_WorldState(w.state,w.config));return w;
}
const act=type=>({type});
test('F2D-01 §12/13: recognize exactly five types, independent of operational semantics',()=>{
    const w=fixture();
    for(const type of ['MOVE_N','MOVE_S','MOVE_E','MOVE_W','WAIT']) assert.equal(w._action_type(act(type)),type);
    for(const type of ['', 'MOVE_NE','__proto__','toString','wait']) assert.throws(()=>w._action_type(act(type)),ContractError);
});
test('F2D-02 §12: closed structure, no coercion; retain F1-B exact error',()=>{
    const w=fixture();
    for(const action of [null,undefined,[],{},'WAIT',{type:1},{type:'WAIT',extra:0},Object.create({type:'WAIT'})])
        assert.throws(()=>w._action_type(action),{name:'ContractError',message:'invalid action structure'});
});
test('F2D-03 §7/13: reject invalid WORLD or entity selection before planning',()=>{
    const w=fixture();w.state.rng_state=0;
    assert.throws(()=>w._action_type(act('WAIT')),{name:'ContractError',message:'invalid initial_state'});
    const other=fixture();other.experimental_entity_id='absent';
    assert.throws(()=>other._bounded_move_target(act('MOVE_N')),ContractError);
});
test('F2D-04 BOUNDED: hard-coded cardinal offsets, no position alias or mutation',()=>{
    const w=fixture(),expected={MOVE_N:{x:1,y:0},MOVE_S:{x:1,y:2},MOVE_E:{x:2,y:1},MOVE_W:{x:0,y:1}};
    for(const [type,target] of Object.entries(expected)) {
        const actual=w._bounded_move_target(act(type));
        assert.deepEqual(JSON.parse(JSON.stringify(actual)),target);
        assert.notEqual(actual,w.get_experimental_entity().position);
        actual.x=99;assert.equal(w.get_experimental_entity().position.x,1);
    }
});
test('F2D-05 BOUNDED: each edge produces outside coordinates instead of wrapping',()=>{
    const w=fixture(),e=w.get_experimental_entity();
    for(const [type,pos,target] of [
        ['MOVE_N',{x:0,y:0},{x:0,y:-1}],['MOVE_W',{x:0,y:0},{x:-1,y:0}],
        ['MOVE_S',{x:2,y:2},{x:2,y:3}],['MOVE_E',{x:2,y:2},{x:3,y:2}]
    ]) {
        e.position=pos;assert.deepEqual(JSON.parse(JSON.stringify(w._bounded_move_target(act(type)))),target);
        assert.equal(w._move_failure_before_energy(act(type)),'OUT_OF_BOUNDS');
    }
});
test('F2D-06 §13: ENTITY_NOT_ACTIVE precedes all spatial checks',()=>{
    const w=fixture(),e=w.get_experimental_entity();e.lifecycle='DEAD';e.position={x:0,y:0};e.energy=0;
    w.state.grid[0][1]=Cell.blocked();
    w._bounded_move_target=()=>assert.fail('must not evaluate destination after inactive entity');
    for(const type of ['MOVE_N','MOVE_E','MOVE_W','MOVE_S']) assert.equal(w._move_failure_before_energy(act(type)),'ENTITY_NOT_ACTIVE');
});
test('F2D-07 §13: BLOCKED precedes any unresolved energy gating; null is not success',()=>{
    const w=fixture(),e=w.get_experimental_entity();e.energy=0;w.state.grid[1][2]=Cell.blocked();
    assert.equal(w._move_failure_before_energy(act('MOVE_E')),'BLOCKED_CELL');
    for(const energy of [0,-1,100]) {
        e.energy=energy;assert.equal(w._move_failure_before_energy(act('MOVE_N')),null);
    }
    // Only spatial/lifecycle checks above are implemented; no ActionResult inferred.
});
test('F2D-08: WAIT recognition adds no arbitrary DEAD/insufficiency semantics',()=>{
    const w=fixture();w.get_experimental_entity().lifecycle='DEAD';
    assert.equal(w._action_type(act('WAIT')),'WAIT');
    assert.throws(()=>w._bounded_move_target(act('WAIT')),ContractError); // MOVE-only helper
    assert.throws(()=>w._move_failure_before_energy(act('WAIT')),ContractError);
});
test('F2D-09 §6.3/6.4: binary64 sum hard-coded rounding and exact -0 canonicalization',()=>{
    assert.equal(World._finite_energy_sum(0.1,0.2),0.30000000000000004);
    assert.equal(World._finite_energy_sum(2**53,1),2**53); // ties-to-even
    assert.equal(World._finite_energy_sum(Number.MIN_VALUE,Number.MIN_VALUE),2*Number.MIN_VALUE);
    assert.ok(Object.is(World._finite_energy_sum(-0,-0),+0));
    assert.ok(Object.is(World._finite_energy_sum(1,-1),+0));
});
test('F2D-10 §6.3: reject nonfinite operands/results without saturation or coercion',()=>{
    for(const [a,b] of [[Number.MAX_VALUE,Number.MAX_VALUE],[-Number.MAX_VALUE,-Number.MAX_VALUE],[NaN,1],[1,Infinity],['1',2],[null,1],[1,1n]])
        assert.throws(()=>World._finite_energy_sum(a,b),ContractError);
});
test('F2D-11 §4/5/13: helpers preserve complete state, clock/lifecycle/RNG, even on error',()=>{
    const w=fixture();w.state.time=7n;const snapshot=w.full_snapshot(),rng=w.rng.get_state();
    w.rng=new Proxy({}, {get(){assert.fail('helpers must not access RNG');}});
    w.sync_rng_state=()=>assert.fail('unexpected sync');w.resolve_lifecycle=()=>assert.fail('unexpected lifecycle');
    w.regenerate_resources=()=>assert.fail('unexpected dynamics');
    for(const type of ['MOVE_N','MOVE_S','MOVE_E','MOVE_W']) {
        w._bounded_move_target(act(type));w._move_failure_before_energy(act(type));
    }
    assert.throws(()=>w._action_type(act('UNKNOWN')),ContractError);
    assert.throws(()=>World._finite_energy_sum(Number.MAX_VALUE,Number.MAX_VALUE),ContractError);
    // Normalize VM/host prototypes while preserving BigInt, Map and numeric values.
    assert.deepEqual(structuredClone(w.state),structuredClone(snapshot));assert.ok(rng>0);assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE');
});
test('F2D-12: deterministic planning from identical valid fixtures',()=>{
    const a=fixture(),b=fixture();
    for(const type of ['MOVE_N','MOVE_S','MOVE_E','MOVE_W']) {
        assert.deepEqual(a._bounded_move_target(act(type)),b._bounded_move_target(act(type)));
        assert.equal(a._move_failure_before_energy(act(type)),b._move_failure_before_energy(act(type)));
    }
    assert.deepEqual(a.state,b.state);
});
