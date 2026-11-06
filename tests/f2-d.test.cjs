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
        assertResult(unchanged(w,()=>w.apply_action(act(type))),'INVALID','OUT_OF_BOUNDS',0);
    }
});
test('F2D-06 §13: ENTITY_NOT_ACTIVE precedes all spatial checks',()=>{
    const w=fixture(),e=w.get_experimental_entity();e.lifecycle='DEAD';e.position={x:0,y:0};e.energy=0;
    w.state.grid[0][1]=Cell.blocked();
    w._bounded_move_target=()=>assert.fail('must not evaluate destination after inactive entity');
    for(const type of ['MOVE_N','MOVE_E','MOVE_W','MOVE_S']) assert.equal(w._move_failure_before_energy(act(type)),'ENTITY_NOT_ACTIVE');
});
test('F2D-07 §13: BLOCKED precedes the separate energy gate; helper null is not success',()=>{
    const w=fixture(),e=w.get_experimental_entity();e.energy=0;w.state.grid[1][2]=Cell.blocked();
    assert.equal(w._move_failure_before_energy(act('MOVE_E')),'BLOCKED_CELL');
    for(const energy of [0,-1,100]) {
        e.energy=energy;assert.equal(w._move_failure_before_energy(act('MOVE_N')),null);
    }
    // This helper reports only spatial/lifecycle checks, not the complete action.
});
test('F2D-08: MOVE-only helper recognition is separate from WAIT operational policy',()=>{
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


// Engineering policies authorized by the complementary F2-D directive.
// F2-H migrates only superseded ACT-P04 expectations; state/energy assertions stay.
function assertResult(result, validity, reason, energy_delta, eventTypes = []) {
    assert.deepEqual(Array.from(Object.keys(result)).sort(),['energy_delta','events','reason','validity']);
    assert.equal(result.validity,validity);assert.equal(result.reason,reason);
    assert.ok(Object.is(result.energy_delta,energy_delta));assert.deepEqual(Array.from(result.events,event=>event.type),eventTypes);
}
function unchanged(w, fn) {
    const before=structuredClone(w.state),state=w.rng.get_state();
    const result=fn();assert.deepEqual(structuredClone(w.state),before);assert.equal(w.rng.get_state(),state);
    return result;
}
test('F2D-13 §12/13: actual apply_action rejects malformed and unknown types without mutation',()=>{
    const w=fixture();
    for(const action of [null,{},[],{type:1},{type:'WAIT',extra:1}]) unchanged(w,()=>assert.throws(()=>w.apply_action(action),{name:'ContractError',message:'invalid action structure'}));
    for(const type of ['', 'UNKNOWN','__proto__']) unchanged(w,()=>assert.throws(()=>w.apply_action(act(type)),ContractError));
});
test('F2D-14 §6/13: actual cardinal moves are bounded, with cost and net delta',()=>{
    const targets={MOVE_N:[1,0],MOVE_S:[1,2],MOVE_E:[2,1],MOVE_W:[0,1]};
    for(const [type,[x,y]] of Object.entries(targets)) {
        const w=fixture({initial_energy:10,move_cost:3});
        assertResult(w.apply_action(act(type)),'VALID','NONE',-3,['ENTITY_MOVED']);
        const e=w.get_experimental_entity();assert.equal(e.position.x,x);assert.equal(e.position.y,y);assert.equal(e.energy,7);
        assert.equal(e.lifecycle,'ACTIVE');assert.ok(validate_WorldState(w.state,w.config));
    }
});
test('F2D-15 policy: WAIT pays wait_cost and never re-enters resource/hazard',()=>{
    for(const effect of [null,{kind:'RESOURCE',stock:1},{kind:'HAZARD'}]) {
        const w=fixture({initial_energy:10,wait_cost:3,hazard_damage:7});
        w.state.grid[1][1]=new Cell('FREE',effect);const position=w.get_experimental_entity().position;
        assertResult(w.apply_action(act('WAIT')),'VALID','NONE',-3);
        assert.equal(w.get_experimental_entity().energy,7);assert.equal(w.get_experimental_entity().position,position);
        assert.deepEqual(JSON.parse(JSON.stringify(w.state.grid[1][1].effect)),effect);
    }
});
test('F2D-16 §13/policy: DEAD precedes bounds/block/energy; WAIT with DEAD is INVALID',()=>{
    const w=fixture({initial_energy:0});const e=w.get_experimental_entity();e.lifecycle='DEAD';e.position={x:0,y:0};w.state.grid[0][1]=Cell.blocked();
    for(const type of ['MOVE_N','MOVE_E','MOVE_W','MOVE_S','WAIT'])
        assertResult(unchanged(w,()=>w.apply_action(act(type))),'INVALID','ENTITY_NOT_ACTIVE',0);
});
test('F2D-17 §13: complete MOVE precedence, failure mappings and no mutation',()=>{
    const w=fixture({initial_energy:0,move_cost:2});const e=w.get_experimental_entity();e.position={x:0,y:0};w.state.grid[0][1]=Cell.blocked();
    assertResult(unchanged(w,()=>w.apply_action(act('MOVE_N'))),'INVALID','OUT_OF_BOUNDS',0);
    assertResult(unchanged(w,()=>w.apply_action(act('MOVE_E'))),'INVALID','BLOCKED_CELL',0);
    assertResult(unchanged(w,()=>w.apply_action(act('MOVE_S'))),'FAILED','INSUFFICIENT_ENERGY',0);
});
test('F2D-18 policy: WAIT insufficient, exact equality, zero cost and negative energy',()=>{
    const poor=fixture({initial_energy:1,wait_cost:2});assertResult(unchanged(poor,()=>poor.apply_action(act('WAIT'))),'FAILED','INSUFFICIENT_ENERGY',0);
    for(const type of ['MOVE_E','WAIT']) {
        const exact=fixture({initial_energy:2,move_cost:2,wait_cost:2});assertResult(exact.apply_action(act(type)),'VALID','NONE',-2,type==='WAIT'?[]:['ENTITY_MOVED']);assert.equal(exact.get_experimental_entity().energy,0);
        const free=fixture({initial_energy:0,move_cost:0,wait_cost:0});assertResult(free.apply_action(act(type)),'VALID','NONE',0,type==='WAIT'?[]:['ENTITY_MOVED']);
        const negative=fixture({initial_energy:-1,move_cost:0,wait_cost:0,death_threshold:-2});
        assertResult(unchanged(negative,()=>negative.apply_action(act(type))),'FAILED','INSUFFICIENT_ENERGY',0);
    }
});
test('F2D-19 policy: resource stock 1 consumed on entry, stock 0 gives no gain or regeneration',()=>{
    const w=fixture({initial_energy:10,move_cost:2,resource_effect:7});w.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});
    w.regenerate_resources=()=>assert.fail('must not regenerate');
    assertResult(w.apply_action(act('MOVE_E')),'VALID','NONE',5,['ENTITY_MOVED','RESOURCE_CONSUMED']);assert.equal(w.get_experimental_entity().energy,15);assert.equal(w.state.grid[1][2].effect.stock,0);
    assertResult(w.apply_action(act('MOVE_W')),'VALID','NONE',-2,['ENTITY_MOVED']);
    assertResult(w.apply_action(act('MOVE_E')),'VALID','NONE',-2,['ENTITY_MOVED']);assert.equal(w.get_experimental_entity().energy,11);assert.equal(w.state.grid[1][2].effect.stock,0);
    const zero=fixture({resource_effect:0});zero.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});zero.apply_action(act('MOVE_E'));assert.equal(zero.state.grid[1][2].effect.stock,0);
});
test('F2D-20 policy: entry resource cannot finance a previously unaffordable move',()=>{
    const w=fixture({initial_energy:1,move_cost:2,resource_effect:100});w.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});
    assertResult(unchanged(w,()=>w.apply_action(act('MOVE_E'))),'FAILED','INSUFFICIENT_ENERGY',0);
    assert.equal(w.state.grid[1][2].effect.stock,1);
});
test('F2D-21 §6/policy: hazard_damage on MOVE entry; negative energy does not resolve lifecycle',()=>{
    const w=fixture({initial_energy:10,move_cost:2,hazard_damage:7,wait_cost:1});w.state.grid[1][2]=new Cell('FREE',{kind:'HAZARD'});
    assertResult(w.apply_action(act('MOVE_E')),'VALID','NONE',-9,['ENTITY_MOVED','HAZARD_TRIGGERED']);assert.equal(w.get_experimental_entity().energy,1);
    assertResult(w.apply_action(act('WAIT')),'VALID','NONE',-1);assert.equal(w.get_experimental_entity().energy,0);assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE');
    const lethal=fixture({initial_energy:2,move_cost:2,hazard_damage:5});lethal.state.grid[1][2]=new Cell('FREE',{kind:'HAZARD'});
    assertResult(lethal.apply_action(act('MOVE_E')),'VALID','NONE',-7,['ENTITY_MOVED','HAZARD_TRIGGERED']);assert.equal(lethal.get_experimental_entity().energy,-5);assert.equal(lethal.get_experimental_entity().lifecycle,'ACTIVE');
    const harmless=fixture({initial_energy:2,move_cost:0,hazard_damage:0});harmless.state.grid[1][2]=new Cell('FREE',{kind:'HAZARD'});assertResult(harmless.apply_action(act('MOVE_E')),'VALID','NONE',0,['ENTITY_MOVED','HAZARD_TRIGGERED']);
});
test('F2D-22 §6.3/6.4/policy: signed zeros and realized binary64 net delta',()=>{
    const w=fixture({initial_energy:-0,wait_cost:0});assert.ok(Object.is(w.get_experimental_entity().energy,-0));
    assertResult(w.apply_action(act('WAIT')),'VALID','NONE',0);assert.ok(Object.is(w.get_experimental_entity().energy,+0));
    const poor=fixture({initial_energy:-0,wait_cost:1});assertResult(unchanged(poor,()=>poor.apply_action(act('WAIT'))),'FAILED','INSUFFICIENT_ENERGY',0);assert.ok(Object.is(poor.get_experimental_entity().energy,-0));
    const rounded=fixture({initial_energy:Number.MAX_VALUE,wait_cost:1});assertResult(rounded.apply_action(act('WAIT')),'VALID','NONE',0);assert.equal(rounded.get_experimental_entity().energy,Number.MAX_VALUE);
});
test('F2D-23 §6.3: nonfinite effect candidate fault is rejected before energy/position/stock writes',()=>{
    const w=fixture({initial_energy:10,move_cost:2,resource_effect:7});w.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});
    const original=World._finite_energy_sum;let calls=0;
    World._finite_energy_sum=(...args)=>++calls===2?Infinity:original(...args);
    try {unchanged(w,()=>assert.throws(()=>w.apply_action(act('MOVE_E')),ContractError));assert.equal(calls,2);}
    finally {World._finite_energy_sum=original;}
});
test('F2D-24 policy: non-writable position/stock rejected before committing other fields',()=>{
    for(const frozen of ['position','stock']) {
        const w=fixture({initial_energy:10,move_cost:2,resource_effect:7});w.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});
        if(frozen==='stock') Object.freeze(w.state.grid[1][2].effect);
        else Object.defineProperty(w.get_experimental_entity(),'position',{writable:false});
        unchanged(w,()=>assert.throws(()=>w.apply_action(act('MOVE_E')),ContractError));
    }
});
test('F2D-25 §4/5/13: all actual actions preserve time, lifecycle, rng_state and do not read RNG',()=>{
    for(const type of ['MOVE_N','MOVE_S','MOVE_E','MOVE_W','WAIT']) {
        const w=fixture({initial_energy:10});w.state.time=9n;const state=w.state.rng_state;
        w.rng=new Proxy({}, {get(){assert.fail('apply_action RNG access');}});
        w.sync_rng_state=()=>assert.fail('unexpected sync');w.resolve_lifecycle=()=>assert.fail('unexpected lifecycle');w.regenerate_resources=()=>assert.fail('unexpected dynamics');
        const result=w.apply_action(act(type));assert.equal(result.validity,'VALID');assert.equal(w.state.time,9n);assert.equal(w.state.rng_state,state);assert.equal(w.get_experimental_entity().lifecycle,'ACTIVE');assert.deepEqual(Array.from(result.events,event=>event.type),type==='WAIT'?[]:['ENTITY_MOVED']);
    }
});
test('F2D-26 policy: fresh closed results/events contain no mutable WORLD or Action references',()=>{
    const w=fixture({wait_cost:0});const action=act('WAIT'),a=w.apply_action(action),b=w.apply_action(action);
    assert.notEqual(a,b);assert.notEqual(a.events,b.events);assertResult(a,'VALID','NONE',0);
    action.type='MOVE_E';a.energy_delta=999;a.events.push({type:'caller-only'});
    assert.equal(b.events.length,0);assert.equal(b.energy_delta,0);assert.equal(w.get_experimental_entity().energy,100);
});
test('F2D-27 policy: fixed multi-action energy ledger and deterministic full state',()=>{
    const setup=()=>{const w=fixture({initial_energy:20,move_cost:2,wait_cost:1,resource_effect:3,hazard_damage:4});w.state.grid[1][2]=new Cell('FREE',{kind:'RESOURCE',stock:1});w.state.grid[0][2]=new Cell('FREE',{kind:'HAZARD'});return w;};
    const a=setup(),b=setup();
    const steps=[['MOVE_E',21,1,['ENTITY_MOVED','RESOURCE_CONSUMED']],['MOVE_N',15,-6,['ENTITY_MOVED','HAZARD_TRIGGERED']],['WAIT',14,-1,[]],['MOVE_W',12,-2,['ENTITY_MOVED']],['MOVE_S',10,-2,['ENTITY_MOVED']]];
    for(const [type,energy,delta,eventTypes] of steps) {
        const ar=a.apply_action(act(type)),br=b.apply_action(act(type));assertResult(ar,'VALID','NONE',delta,eventTypes);assert.deepEqual(ar,br);
        assert.equal(a.get_experimental_entity().energy,energy);assert.equal(b.get_experimental_entity().energy,energy);assert.deepEqual(structuredClone(a.state),structuredClone(b.state));
        assert.ok(validate_WorldState(a.state,a.config));
    }
});

test('F2D-28 engineering interface: declared result domains match the adopted policy',()=>{
    vm.runInContext(fs.readFileSync(path.join(root,'js/interface/action_result.js'),'utf8'),ctx);
    const domains=vm.runInContext('({validities:Object.values(ActionResultValidity),reasons:Object.values(ActionResultReason)})',ctx);
    assert.deepEqual(Array.from(domains.validities).sort(),['FAILED','INVALID','VALID']);
    assert.deepEqual(Array.from(domains.reasons).sort(),['BLOCKED_CELL','ENTITY_NOT_ACTIVE','INSUFFICIENT_ENERGY','NONE','OUT_OF_BOUNDS']);
});
