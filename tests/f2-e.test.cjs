const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({});
// Reuse the F2-D loading boundary and F2-C preparation, without EXPERIMENT/RECORDER.
for (const [, src] of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, src), 'utf8'), ctx, {filename: src});
    if (src === 'js/interface/action.js') break;
}
vm.runInContext('Math.random = () => { throw new Error("Math.random forbidden"); };', ctx);
const {WorldConfig, Cell, prepare_world_before_lifecycle, validate_WorldState} =
    vm.runInContext('({WorldConfig, Cell, prepare_world_before_lifecycle, validate_WorldState})', ctx);
const methods = ['regenerate_resources', 'advance_dynamics'];
function fixture(patch = {}, seed = 1) {
    const w = prepare_world_before_lifecycle({...WorldConfig.defaults(), width: 3, height: 3,
        obstacle_density: 0, resource_density: 0, hazard_density: 0, ...patch}, seed);
    w.get_experimental_entity().position = {x: Math.min(1, w.config.width - 1), y: Math.min(1, w.config.height - 1)};
    assert.ok(validate_WorldState(w.state, w.config));
    return w;
}
function resource(w, x, y, stock) {
    w.state.grid[y][x] = new Cell('FREE', {kind: 'RESOURCE', stock});
    return w.state.grid[y][x].effect;
}
const snapshot = w => structuredClone(w.state);
function unchangedError(w, method, message) {
    const before = snapshot(w), rng = w.rng.get_state();
    assert.throws(() => w[method](), {name: 'ContractError', message});
    assert.deepEqual(snapshot(w), before);
    assert.equal(w.rng.get_state(), rng);
}
function valid(w) { assert.ok(validate_WorldState(w.state, w.config)); }

test('F2E-01 §15: advance delegates exactly once and exposes no events/result', () => {
    const w = fixture(); const effect = resource(w, 0, 0, 0);
    const original = w.regenerate_resources; let calls = 0;
    w.regenerate_resources = function() { assert.equal(this, w); calls++; return original.call(this); };
    assert.equal(w.advance_dynamics(), undefined);
    assert.equal(calls, 1); assert.equal(effect.stock, 1); valid(w);
});
test('F2E-02 policy: regeneration zero preserves both stocks, including frozen depleted effects', () => {
    for (const method of methods) {
        const w = fixture({resource_regeneration: 0});
        Object.freeze(resource(w, 0, 0, 0)); Object.freeze(resource(w, 2, 2, 1));
        const before = snapshot(w); assert.equal(w[method](), undefined);
        assert.deepEqual(snapshot(w), before); valid(w);
    }
});
test('F2E-03 policy: positive integer rates replenish depleted stock and preserve full stock', () => {
    for (const method of methods) for (const rate of [1, 2, 17, 0xfffffffe]) {
        const w = fixture({resource_regeneration: rate});
        const depleted = resource(w, 0, 0, 0), full = resource(w, 2, 2, 1);
        const expected = snapshot(w); expected.grid[0][0].effect.stock = 1;
        assert.equal(w[method](), undefined);
        assert.equal(depleted.stock, 1); assert.equal(full.stock, 1);
        assert.deepEqual(snapshot(w), expected); valid(w);
    }
});
test('F2E-04 §6/8 policy: maximum uint32 regeneration on minimum-size WORLD stays binary', () => {
    for (const method of methods) {
        const w = fixture({width: 1, height: 1, resource_regeneration: 0xffffffff});
        resource(w, 0, 0, 0); w[method]();
        assert.equal(w.state.grid[0][0].effect.stock, 1); valid(w);
        const before = snapshot(w); w[method](); assert.deepEqual(snapshot(w), before);
    }
});
test('F2E-05 §8/15: no resources, BLOCKED/HAZARD/NONE remain unchanged', () => {
    for (const method of methods) {
        const w = fixture({resource_regeneration: 0xffffffff});
        w.state.grid[0][0] = Cell.blocked(); w.state.grid[2][2] = new Cell('FREE', {kind: 'HAZARD'});
        for (const row of w.state.grid) { for (const cell of row) { if (cell.effect) Object.freeze(cell.effect); Object.freeze(cell); } Object.freeze(row); }
        Object.freeze(w.state.grid);
        const before = snapshot(w); assert.equal(w[method](), undefined);
        assert.deepEqual(snapshot(w), before); valid(w);
    }
});
test('F2E-06 §8/15: only depleted stock changes; grid/rows/cells/effects/entity retain identity', () => {
    const w = fixture(); resource(w, 0, 0, 0); resource(w, 2, 2, 1);
    w.state.grid[0][1] = Cell.blocked(); w.state.grid[2][0] = new Cell('FREE', {kind: 'HAZARD'});
    const grid = w.state.grid, rows = [...grid], cells = grid.flat(), effects = cells.map(c => c.effect);
    const entity = w.get_experimental_entity(), position = entity.position, entities = w.state.entities;
    const expected = snapshot(w); expected.grid[0][0].effect.stock = 1;
    w.advance_dynamics(); assert.deepEqual(snapshot(w), expected);
    assert.equal(w.state.grid, grid); assert.equal(w.state.entities, entities);
    for (let y = 0; y < rows.length; y++) assert.equal(grid[y], rows[y]);
    grid.flat().forEach((cell, i) => { assert.equal(cell, cells[i]); assert.equal(cell.effect, effects[i]); });
    assert.equal(w.get_experimental_entity(), entity); assert.equal(entity.position, position); valid(w);
});
test('F2E-07 §8: depleted resources are confirmed in canonical row-major order', () => {
    for (const method of methods) {
        const w = fixture(); const writes = [];
        // Insert in reverse order to distinguish grid traversal from insertion order.
        const points = [[2,2], [1,2], [2,0], [0,0]];
        for (const [x,y] of points) {
            const effect = resource(w, x, y, 0);
            w.state.grid[y][x].effect = new Proxy(effect, {set(target, key, value, receiver) {
                writes.push([x,y,key,value]); return Reflect.set(target, key, value, receiver);
            }});
        }
        resource(w, 0, 1, 1); w.state.grid[0][1] = Cell.blocked();
        w[method]();
        assert.deepEqual(writes, [[0,0,'stock',1], [2,0,'stock',1], [1,2,'stock',1], [2,2,'stock',1]]);
        valid(w);
    }
});
test('F2E-08: repeated dynamics are deterministic and preserve real PRNG state', () => {
    for (const seed of [1, 42, 0xffffffff]) for (const rate of [0, 1, 0xffffffff]) {
        const setup = () => { const w = fixture({resource_regeneration: rate}, seed); resource(w, 0, 0, 0); resource(w, 2, 2, 1); return w; };
        const a = setup(), b = setup(), rngA = a.rng.get_state(), rngB = b.rng.get_state();
        for (let i = 0; i < 3; i++) {
            a.advance_dynamics(); b.advance_dynamics();
            assert.deepEqual(snapshot(a), snapshot(b));
            assert.equal(a.rng.get_state(), rngA); assert.equal(b.rng.get_state(), rngB); valid(a); valid(b);
        }
    }
});
test('F2E-09 §5/9: Number/BigInt clocks and ACTIVE/DEAD entities remain exact', () => {
    for (const method of methods) for (const time of [0, 7, Number.MAX_SAFE_INTEGER, 0n, 0xffffffffffffffffn]) for (const lifecycle of ['ACTIVE', 'DEAD']) {
        const w = fixture({initial_energy: -0}); w.state.time = time;
        const entity = w.get_experimental_entity(); entity.lifecycle = lifecycle;
        resource(w, entity.position.x, entity.position.y, 0);
        const before = structuredClone(entity); w[method]();
        assert.deepEqual(structuredClone(entity), before); assert.ok(Object.is(entity.energy, -0));
        assert.equal(w.state.time, time); assert.equal(w.state.grid[entity.position.y][entity.position.x].effect.stock, 1); valid(w);
    }
});
test('F2E-10 §4/15: no RNG, action, lifecycle, sync, Recorder or event-channel access', () => {
    for (const method of methods) {
        const w = fixture(); resource(w, 0, 0, 0); const rngState = w.state.rng_state;
        for (const name of ['rng','recorder','events']) Object.defineProperty(w, name, {get() { assert.fail('forbidden access: ' + name); }});
        for (const name of ['apply_action','resolve_lifecycle','sync_rng_state']) w[name] = () => assert.fail('forbidden call: ' + name);
        assert.equal(w[method](), undefined); assert.equal(w.state.rng_state, rngState); valid(w);
    }
});
test('F2E-11 policy: all-full resources are idempotent, with no writes even when frozen', () => {
    for (const method of methods) {
        const w = fixture(); Object.freeze(resource(w, 0, 0, 1)); Object.freeze(resource(w, 2, 2, 1));
        const before = snapshot(w);
        for (let i = 0; i < 3; i++) { assert.equal(w[method](), undefined); assert.deepEqual(snapshot(w), before); valid(w); }
    }
});
test('F2E-12 §8/validation: invalid late cell rejected before any earlier stock mutation', () => {
    for (const method of methods) for (const bad of [
        {traversal:'FREE',effect:{kind:'RESOURCE',stock:2}},
        {traversal:'FREE',effect:{kind:'RESOURCE',stock:0.5}},
        {traversal:'BLOCKED',effect:{kind:'RESOURCE',stock:0}},
        {traversal:'FREE',effect:{kind:'HAZARD',stock:0}}
    ]) {
        const w = fixture(); resource(w, 0, 0, 0); w.state.grid[2][2] = structuredClone(bad);
        unchangedError(w, method, 'invalid initial_state'); assert.equal(w.state.grid[0][0].effect.stock, 0);
    }
});
test('F2E-13 §7/validation: invalid WORLD rejected even when regeneration is zero', () => {
    const corruptions = [w => w.state = null, w => w.state.rng_state = 0, w => w.state.time = -1,
        w => w.get_experimental_entity().energy = NaN, w => w.state.grid[2].pop(),
        w => w.state.entities.clear(), w => w.state.extra = true];
    for (const method of methods) for (const rate of [0, 1]) for (const corrupt of corruptions) {
        const w = fixture({resource_regeneration: rate}); resource(w, 0, 0, 0); corrupt(w);
        unchangedError(w, method, 'invalid initial_state');
    }
});
test('F2E-14 §6: invalid configuration is rejected without changing WORLD', () => {
    for (const method of methods) for (const rate of [-1, 0.5, 0x100000000, Infinity, '1']) {
        const w = fixture(); resource(w, 0, 0, 0); w.config = {...w.config, resource_regeneration: rate};
        unchangedError(w, method, 'invalid world_config');
    }
});
test('F2E-15 preparation/commit: late nonwritable stock fails before any earlier update', () => {
    for (const method of methods) {
        const w = fixture(); const first = resource(w, 0, 0, 0);
        const late = resource(w, 2, 2, 0); Object.defineProperty(late, 'stock', {writable: false});
        assert.ok(validate_WorldState(w.state, w.config));
        unchangedError(w, method, 'world transition failed'); assert.equal(first.stock, 0); assert.equal(late.stock, 0);
    }
});
test('F2E-16 §15: entry points produce equal state changes and no WORLD/State metadata', () => {
    const a = fixture(), b = fixture(); resource(a, 0, 0, 0); resource(b, 0, 0, 0);
    const worldKeys = Object.keys(a).sort(), stateKeys = Object.keys(a.state).sort();
    assert.equal(a.regenerate_resources(), undefined); assert.equal(b.advance_dynamics(), undefined);
    assert.deepEqual(snapshot(a), snapshot(b));
    assert.deepEqual(Object.keys(a).sort(), worldKeys); assert.deepEqual(Object.keys(b).sort(), worldKeys);
    assert.deepEqual(Object.keys(a.state).sort(), stateKeys); valid(a); valid(b);
});
