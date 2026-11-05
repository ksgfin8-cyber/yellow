const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load() {
    const ctx = vm.createContext({});
    for (const name of ['contracts', 'prng', 'hash', 'seed']) {
        vm.runInContext(fs.readFileSync(path.join(root, 'js/core', name + '.js'), 'utf8'), ctx);
    }
    return vm.runInContext('({PRNG, ContractError, fnv1a, utf8_encode, derive_seed})', ctx);
}
const {PRNG, ContractError, fnv1a, utf8_encode, derive_seed} = load();
const invalid = [0, -0, -1, 2 ** 32, 1.5, NaN, Infinity, -Infinity, '1', null, undefined, true, 1n];

test('F1A-01: Xorshift32 normative seed-1 vector', () => {
    const rng = new PRNG(1);
    assert.deepEqual([rng.next(), rng.next(), rng.next()], [270369, 67634689, 2647435461]);
});
test('F1A-02: independent BigInt oracle, four boundary seeds, 1000 steps each', () => {
    for (const seed of [1, 0x7FFFFFFF, 0x80000000, 0xFFFFFFFF]) {
        let x = BigInt(seed);
        const rng = new PRNG(seed), mask = 0xFFFFFFFFn;
        for (let i = 0; i < 1000; i++) {
            x = (x ^ (x << 13n)) & mask;
            x = (x ^ (x >> 17n)) & mask;
            x = (x ^ (x << 5n)) & mask;
            assert.equal(rng.next(), Number(x));
        }
    }
});
test('F1A-03: constructor rejects non-domain seeds without coercion', () => {
    for (const seed of invalid) assert.throws(() => new PRNG(seed), ContractError);
});
test('F1A-04: zero state error and no commit', () => {
    const rng = new PRNG(1);
    rng.state = 0;
    assert.throws(() => rng.next(), {name: 'ContractError', message: 'rng zero state'});
    assert.equal(rng.state, 0);
    assert.throws(() => rng.get_state(), ContractError);
});
test('F1A-05: restoration reproduces future integer and float stream', () => {
    const rng = new PRNG(0xFFFFFFFF);
    for (let i=0;i<17;i++) rng.next();
    const state = rng.get_state();
    const future = [rng.next(), rng.next_float(), rng.next_int(-7, 9)];
    rng.set_state(state);
    assert.deepEqual([rng.next(), rng.next_float(), rng.next_int(-7, 9)], future);
});
test('F1A-06: rejected restoration preserves prior state', () => {
    const rng = new PRNG(123);
    for (const state of invalid) {
        assert.throws(() => rng.set_state(state), ContractError);
        assert.equal(rng.get_state(), 123);
    }
});
test('F1A-07: next_float uses one draw and exact divisor', () => {
    const rng = new PRNG(1);
    assert.equal(rng.next_float(), 270369 / 4294967296);
    assert.equal(rng.get_state(), 270369);
    let calls = 0;
    rng.next = () => {calls++; return 0xFFFFFFFF;};
    assert.equal(rng.next_float(), 1 - 2 ** -32);
    assert.equal(calls, 1);
});
test('F1A-08: rejection excludes u == limit and larger u', () => {
    const rng = new PRNG(1), draws = [0xFFFFFFFF, 4294967290, 4294967289];
    let calls = 0;
    rng.next = () => { assert.ok(calls < draws.length); return draws[calls++]; };
    assert.equal(rng.next_int(10, 19), 19);
    assert.equal(calls, 3);
});
test('F1A-09: singleton still consumes a draw; full uint32 interval', () => {
    const rng = new PRNG(1);
    assert.equal(rng.next_int(-5, -5), -5);
    assert.equal(rng.get_state(), 270369);
    rng.next = () => 0xFFFFFFFF;
    assert.equal(rng.next_int(0, 0xFFFFFFFF), 0xFFFFFFFF);
    assert.equal(rng.next_int(-2147483648, 2147483647), 2147483647);
});
test('F1A-10: invalid intervals fail before consuming state', () => {
    const rng = new PRNG(1);
    for (const [a,b] of [[1,0],[0,2**32],[0.1,3],[NaN,1],[0,Infinity],['0',2],[0,1n],[null,2],[undefined,2],[-Infinity,0],[0,Number.MAX_SAFE_INTEGER+1]]) {
        assert.throws(() => rng.next_int(a,b), ContractError);
        assert.equal(rng.get_state(), 1);
    }
});
test('F1A-11: safe endpoint boundaries and repeated range checks', () => {
    const rng = new PRNG(1);
    for (const a of [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 4, -2]) {
        for (let i=0;i<100;i++) {
            const v = rng.next_int(a,a+4);
            assert.ok(Number.isSafeInteger(v) && v >= a && v <= a+4);
        }
    }
});
test('F1A-12: normative FNV-1a vectors', () => {
    for (const [s,h] of [['',0x811C9DC5],['a',0xE40C292C],['foobar',0xBF9CF968]]) assert.equal(fnv1a(s), h);
});
test('F1A-13: normative derive_seed vectors', () => {
    assert.equal(derive_seed(1,'world'), 2448580590);
    assert.equal(derive_seed(1,'random_agent'), 84506387);
});
test('F1A-14: derive_seed uint32 domain', () => {
    for (const seed of invalid) assert.throws(() => derive_seed(seed,'world'), ContractError);
});
test('F1A-15: strict UTF-8 scalar boundaries, NUL, astral characters', () => {
    for (const s of ['', '\0', '\u007F\u0080\u07FF\u0800\uD7FF\uE000\uFFFF', 'á世界😀', '\u{10FFFF}']) {
        assert.deepEqual(Array.from(utf8_encode(s)), Array.from(Buffer.from(s, 'utf8')));
    }
});
test('F1A-16: reject every lone surrogate form', () => {
    for (const s of ['\uD800', '\uDFFF', '\uD800a', '\uDC00\uD800', '\uD800\uD800', '😀\uDFFF']) {
        assert.throws(() => derive_seed(1,s), ContractError);
        assert.throws(() => utf8_encode(s), ContractError);
    }
    for (const s of [null, 1, {}, undefined]) assert.throws(() => derive_seed(1,s), ContractError);
});
function referenceSeed(seed, namespace) {
    let h = 0x811C9DC5n;
    for (const b of Buffer.from(seed.toString(10) + ':' + namespace, 'utf8')) h = ((h ^ BigInt(b)) * 0x01000193n) & 0xFFFFFFFFn;
    return Number(h) || 1;
}
test('F1A-17: decimal ASCII, empty namespace, no normalization, independent oracle', () => {
    for (const seed of [1,10,0x80000000,0xFFFFFFFF]) {
        for (const namespace of ['', 'world', 'é', 'e\u0301', '😀', '\0']) assert.equal(derive_seed(seed,namespace), referenceSeed(seed,namespace));
    }
    assert.notEqual(derive_seed(1,'é'), derive_seed(1,'e\u0301'));
});
test('F1A-18: zero hash maps to 1 (isolated branch injection)', () => {
    const ctx = vm.createContext({fnv1a: () => 0, ContractError});
    vm.runInContext(fs.readFileSync(path.join(root,'js/core/seed.js'),'utf8'), ctx);
    assert.equal(vm.runInContext('derive_seed(1,"world")',ctx), 1);
});
