// Local independent F3-D tests; not canonical T01–T280 or WLS1 vectors.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({});
for(const p of ['js/core/contracts.js','js/core/hash.js','js/core/seed.js','js/experiment/hash_state.js'])
    vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:p});
const api=vm.runInContext('({fnv1a_bytes,fnv1a,derive_seed,ContractError,Uint8Array,serialize_world_state,STATE_HASH_WORLD,STATE_HASH_FULL})',ctx);
function oracle(bytes){let h=2166136261n;for(const byte of bytes)h=((h^BigInt(byte))*16777619n)&4294967295n;return Number(h);}
const bad=fn=>assert.throws(fn,{name:'ContractError',message:'recording failed'});
test('F3D-01 normative FNV vectors on literal ASCII bytes',()=>{
 for(const [bytes,expected] of [[[],0x811c9dc5],[[97],0xe40c292c],[[102,111,111,98,97,114],0xbf9cf968]])assert.equal(api.fnv1a_bytes(bytes),expected);
});
test('F3D-02 all 256 byte values and reverse order against independent BigInt arithmetic',()=>{
 const bytes=Array.from({length:256},(_,i)=>i);
 for(const data of [bytes,bytes.slice().reverse(),[0,255,0,128,1,127]])assert.equal(api.fnv1a_bytes(data),oracle(data));
});
test('F3D-03 every one-byte input against independent reference',()=>{
 for(let i=0;i<256;i++)assert.equal(api.fnv1a_bytes([i]),oracle([i]));
});
test('F3D-04 long byte input preserves uint32 arithmetic without float product overflow',()=>{
 const bytes=Array.from({length:65536},(_,i)=>(i*73+19)%256);
 const h=api.fnv1a_bytes(bytes);assert.equal(h,oracle(bytes));assert.ok(Number.isInteger(h)&&h>=0&&h<=0xffffffff);
});
test('F3D-05 Uint8Array views hash only their byte window, not backing-buffer siblings',()=>{
 const bytes=new api.Uint8Array([99,0,128,255,88]),view=bytes.subarray(1,4);
 assert.equal(api.fnv1a_bytes(view),oracle([0,128,255]));assert.equal(api.fnv1a_bytes(new api.Uint8Array()),0x811c9dc5);
 assert.deepEqual(Array.from(bytes),[99,0,128,255,88]);
});
test('F3D-06 reject non-byte sequences and implicit conversions',()=>{
 for(const x of [null,undefined,'abc',42,true,{},new ArrayBuffer(1),new Uint16Array([1]),new DataView(new ArrayBuffer(1)),{0:1,length:1}])bad(()=>api.fnv1a_bytes(x));
});
test('F3D-07 reject invalid byte values instead of truncation, wraparound or coercion',()=>{
 for(const x of [-1,256,0.5,NaN,Infinity,-Infinity,1n,'1',true,null,undefined,{}])bad(()=>api.fnv1a_bytes([0,x,255]));
});
test('F3D-08 reject holes and accessors without executing getters',()=>{
 bad(()=>api.fnv1a_bytes([0,,255]));let reads=0;const bytes=[0,1];
 Object.defineProperty(bytes,'1',{get(){reads++;return 1;}});bad(()=>api.fnv1a_bytes(bytes));assert.equal(reads,0);
});
test('F3D-09 read-only input, repeatability, failure does not contaminate later calls',()=>{
 const bytes=Object.freeze([0,1,127,128,255]),before=bytes.slice(),expected=oracle(bytes);
 for(let i=0;i<5;i++)assert.equal(api.fnv1a_bytes(bytes),expected);
 bad(()=>api.fnv1a_bytes([1,256]));assert.deepEqual(bytes,before);assert.equal(api.fnv1a_bytes(bytes),expected);
});
test('F3D-10 UTF-8 wrapper delegates to shared byte accumulator without changing F1-A seeds',()=>{
 for(const text of ['', 'foobar', 'a\0é😀', 'e\u0301', 'é'])assert.equal(api.fnv1a(text),oracle(Buffer.from(text,'utf8')));
 assert.equal(api.derive_seed(1,'world'),2448580590);assert.equal(api.derive_seed(1,'random_agent'),84506387);
 assert.throws(()=>api.fnv1a('\ud800'),api.ContractError);assert.throws(()=>api.fnv1a(1),/input must be a string/);
 const original=api.fnv1a_bytes;ctx.spy=bytes=>{assert.deepEqual(Array.from(bytes),[195,169]);return 123;};
 try{vm.runInContext('fnv1a_bytes=spy',ctx);assert.equal(api.fnv1a('é'),123);}finally{ctx.saved=original;vm.runInContext('fnv1a_bytes=saved',ctx);}
});
test('F3D-11 byte hashing does not use RNG or stringify bytes',()=>{
 vm.runInContext('Math.random=()=>{throw new Error("random forbidden");}',ctx);
 const bytes=Object.freeze([0,255]);assert.equal(api.fnv1a_bytes(bytes),oracle(bytes));
});
test('F3D-12 blocked canonical APIs never inspect/mutate state or return text/placeholder hashes',()=>{
 const state=new Proxy({},{get(){assert.fail('blocked serializer inspected state');},set(){assert.fail('blocked serializer mutated state');}});
 for(const fn of [api.STATE_HASH_WORLD,api.STATE_HASH_FULL,api.serialize_world_state]){bad(()=>fn(state));bad(()=>fn(null));bad(()=>fn(state,true));}
});
