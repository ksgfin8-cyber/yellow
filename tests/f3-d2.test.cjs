// Local WLS1 tests; only V1 and §24.5 vectors are recovered normative vectors.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({});
for(const [,p] of fs.readFileSync('index.html','utf8').matchAll(/<script src="([^"]+)"/g)){
 vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:p});if(p==='js/world/world.js')break;
}
vm.runInContext(fs.readFileSync('js/experiment/hash_state.js','utf8'),ctx);
const api=vm.runInContext('({World,WorldState,WorldConfig,Cell,Map,utf8_encode,wls1_compare_bytes,serialize_world_state,canonical_world_state_bytes,canonical_full_state_bytes,STATE_HASH_WORLD,STATE_HASH_FULL})',ctx);
function fixture({width=1,height=1,id='0987898',energy=0,lifecycle='ACTIVE',time=0,rng_state=1}={}){
 const entity={id,position:{x:0,y:0},energy,lifecycle};
 return {time,grid:Array.from({length:height},()=>Array.from({length:width},()=>new api.Cell('FREE',null))),entities:new api.Map([[id,entity]]),rng_state};
}
// Independent encoding via Node Buffer and concatenated chunks, not the production
// DataView cursor, UTF-8 encoder or enum expressions. No production serializers used.
function reference(s,full){
 const u32=x=>{const b=Buffer.alloc(4);b.writeUInt32BE(x);return b;};
 const time=Buffer.alloc(8);time.writeBigUInt64BE(BigInt(s.time));
 const parts=[Buffer.from('WLS1','ascii'),time,u32(s.grid[0].length),u32(s.grid.length)];
 const tags={FREE:0,BLOCKED:1,NONE:0,RESOURCE:1,HAZARD:2,ACTIVE:0,DEAD:1};
 for(const row of s.grid)for(const c of row)parts.push(Buffer.from([tags[c.traversal],tags[c.effect?.kind??'NONE'],c.effect?.stock??0]));
 const entries=Array.from(s.entities.values()).map(e=>[Buffer.from(e.id,'utf8'),e]).sort((a,b)=>Buffer.compare(a[0],b[0]));
 parts.push(u32(entries.length));
 for(const [id,e] of entries){const en=Buffer.alloc(8);en.writeDoubleBE(e.energy===0?0:e.energy);parts.push(u32(id.length),id,u32(e.position.x),u32(e.position.y),en,Buffer.from([tags[e.lifecycle]]));}
 if(full)parts.push(u32(s.rng_state));return Buffer.concat(parts);
}
function fnv(bytes){let h=2166136261n;for(const b of bytes)h=((h^BigInt(b))*16777619n)%4294967296n;return Number(h);}
const bytes=x=>Buffer.from(x);
const V1=Buffer.from(`574c5331 0000000000000000 00000001 00000001 000000 00000001 00000007 30393837383938 00000000 00000000 0000000000000000 00 00000001`.replace(/ /g,''),'hex');
function check(s){for(const full of [false,true]){const expected=reference(s,full),actual=bytes(api.serialize_world_state(s,full));assert.deepEqual(actual,expected);assert.equal(full?api.STATE_HASH_FULL(s):api.STATE_HASH_WORLD(s),fnv(expected));}}
test('F3D2-01 recovered V1: exactly 59 FULL bytes and 55 WORLD bytes, byte-for-byte',()=>{
 const s=fixture();assert.equal(V1.length,59);assert.deepEqual(bytes(api.canonical_full_state_bytes(s)),V1);assert.deepEqual(bytes(api.canonical_world_state_bytes(s)),V1.subarray(0,55));check(s);
});
test('F3D2-02 V1 hash values independently fixed from recovered bytes',()=>{
 const s=fixture();assert.equal(fnv(V1),0x96dc7bfe);assert.equal(fnv(V1.subarray(0,55)),0x60515681);
 assert.equal(api.STATE_HASH_WORLD(s),1615943297);assert.equal(api.STATE_HASH_FULL(s),2531032062);
});
test('F3D2-03 cells use exact three-byte tags in row then column order',()=>{
 const s=fixture({width:3,height:2});s.grid[0][1]=new api.Cell('BLOCKED',null);s.grid[0][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:0});s.grid[1][0]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});s.grid[1][1]=new api.Cell('FREE',{kind:'HAZARD'});
 assert.deepEqual(bytes(api.canonical_world_state_bytes(s)).subarray(20,38),Buffer.from([0,0,0,1,0,0,0,1,0,0,1,1,0,2,0,0,0,0]));check(s);
});
test('F3D2-04 lifecycle and positions use recovered encodings',()=>{
 for(const lifecycle of ['ACTIVE','DEAD']){const s=fixture({width:3,height:2,lifecycle});s.entities.get('0987898').position={x:2,y:1};if(lifecycle==='DEAD')s.grid[1][2]=new api.Cell('BLOCKED',null);check(s);assert.equal(bytes(api.canonical_world_state_bytes(s)).at(-1),lifecycle==='ACTIVE'?0:1);}
});
test('F3D2-05 IDs use UTF-8 byte length including astral, NUL and non-normalized strings',()=>{
 for(const id of ['a','aa','é','e\u0301','😀','\ue000','\u{10000}','a\0b']){const s=fixture({id});check(s);assert.equal(bytes(api.canonical_world_state_bytes(s)).readUInt32BE(27),Buffer.byteLength(id,'utf8'));}
});
test('F3D2-06 canonical comparator is unsigned UTF-8, shorter prefix first',()=>{
 const ids=['ab','a','é','e\u0301','\ue000','\u{10000}','😀','z'];
 const actual=ids.slice().sort((a,b)=>api.wls1_compare_bytes(api.utf8_encode(a),api.utf8_encode(b)));
 const expected=ids.slice().sort((a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b)));
 assert.deepEqual(actual,expected);assert.ok(actual.indexOf('a')<actual.indexOf('ab'));assert.ok(actual.indexOf('\ue000')<actual.indexOf('\u{10000}'));
 // Comparator tested separately: v0.2.5 still rejects multiple entities.
 const s=fixture();s.entities.set('other',{id:'other',position:{x:0,y:0},energy:1,lifecycle:'ACTIVE'});assert.throws(()=>api.STATE_HASH_WORLD(s),{message:'recording failed'});
});
test('F3D2-07 uint64 boundaries are exact, Number and BigInt representations agree',()=>{
 for(const time of [0,0n,0xffffffff,0x100000000,Number.MAX_SAFE_INTEGER,BigInt(Number.MAX_SAFE_INTEGER),9007199254740992n,0xffffffffffffffffn])check(fixture({time}));
 assert.deepEqual(bytes(api.canonical_full_state_bytes(fixture({time:42}))),bytes(api.canonical_full_state_bytes(fixture({time:42n}))));
});
test('F3D2-08 rng uint32 changes FULL only, no agent or trajectory state included',()=>{
 const a=fixture({rng_state:1});for(const rng_state of [2,0x80000000,0xffffffff]){const b=fixture({rng_state});check(b);assert.deepEqual(bytes(api.canonical_world_state_bytes(a)),bytes(api.canonical_world_state_bytes(b)));assert.equal(api.STATE_HASH_WORLD(a),api.STATE_HASH_WORLD(b));assert.notDeepEqual(bytes(api.canonical_full_state_bytes(a)),bytes(api.canonical_full_state_bytes(b)));assert.notEqual(api.STATE_HASH_FULL(a),api.STATE_HASH_FULL(b));}
});
test('F3D2-09 binary64 canonical zero, subnormal, extremes and finite negatives',()=>{
 for(const energy of [0,-0,Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE,0.1,-7.25])check(fixture({energy}));
 const positive=bytes(api.canonical_world_state_bytes(fixture({energy:0}))),negative=bytes(api.canonical_world_state_bytes(fixture({energy:-0})));
 assert.deepEqual(positive,negative);assert.equal(bytes(api.canonical_world_state_bytes(fixture({energy:Number.MIN_VALUE}))).subarray(-9,-1).toString('hex'),'0000000000000001');
 assert.equal(bytes(api.canonical_world_state_bytes(fixture({energy:Number.MAX_VALUE}))).subarray(-9,-1).toString('hex'),'7fefffffffffffff');
});
test('F3D2-10 reject invalid domains before writing output',()=>{
 const mutations=[s=>s.time=-1,s=>s.time=2**53,s=>s.time=1n<<64n,s=>s.time='0',s=>s.rng_state=0,s=>s.rng_state=2**32,s=>s.rng_state=1n,s=>s.entities.get('0987898').energy=NaN,s=>s.entities.get('0987898').energy=Infinity,s=>s.entities.get('0987898').lifecycle='OTHER',s=>s.grid[0][0]={traversal:'FREE',effect:{kind:'RESOURCE',stock:2}},s=>s.grid[0][0]={traversal:'BLOCKED',effect:{kind:'HAZARD'}},s=>s.entities.get('0987898').position.x=1,s=>s.entities.clear(),s=>s.grid=[],s=>s.grid[0]=[],s=>s.extra=1];
 for(const mutate of mutations){const s=fixture();mutate(s);for(const f of [api.canonical_world_state_bytes,api.canonical_full_state_bytes,api.STATE_HASH_WORLD,api.STATE_HASH_FULL])assert.throws(()=>f(s),{name:'ContractError',message:'recording failed'});}
 for(const id of ['', '\ud800'])assert.throws(()=>api.canonical_world_state_bytes(fixture({id})),{message:'recording failed'});
});
test('F3D2-11 reject ragged grids, holes and accessor cells without getter effects',()=>{
 const ragged=fixture({width:2,height:2});ragged.grid[1].pop();assert.throws(()=>api.STATE_HASH_FULL(ragged));
 const s=fixture();let reads=0;Object.defineProperty(s.grid[0],'0',{get(){reads++;return new api.Cell('FREE',null);}});assert.throws(()=>api.STATE_HASH_FULL(s));assert.equal(reads,0);
 const hole=fixture();delete hole.grid[0][0];assert.throws(()=>api.STATE_HASH_FULL(hole));
});
test('F3D2-12 purity, independent output and repeatability, including preserved negative-zero input',()=>{
 const s=fixture({energy:-0,time:0xffffffffffffffffn});const before=structuredClone(s);const a=api.canonical_full_state_bytes(s),b=api.canonical_full_state_bytes(s);assert.notEqual(a,b);assert.deepEqual(bytes(a),bytes(b));a[0]=0;assert.equal(b[0],0x57);assert.deepEqual(structuredClone(s),before);assert.ok(Object.is(s.entities.get('0987898').energy,-0));
});
test('F3D2-13 real WorldState and pure state copies produce identical bytes without RNG draws',()=>{
 vm.runInContext('Math.random=()=>{throw new Error("random forbidden");}',ctx);
 const config=new api.WorldConfig({...api.WorldConfig.defaults(),width:2,height:2,obstacle_density:0,resource_density:0,hazard_density:0});const world=new api.World(config);world.initialize(1);
 const rng=world.rng.get_state(),before=structuredClone(world.state);check(world.state);assert.deepEqual(bytes(api.canonical_full_state_bytes(world.state)),bytes(api.canonical_full_state_bytes(world.full_snapshot())));assert.equal(world.rng.get_state(),rng);assert.deepEqual(structuredClone(world.state),before);
});
test('F3D2-14 compatibility flag is strict boolean and defaults to WORLD',()=>{
 const s=fixture();assert.deepEqual(bytes(api.serialize_world_state(s)),bytes(api.canonical_world_state_bytes(s)));for(const flag of [null,0,1,'true'])assert.throws(()=>api.serialize_world_state(s,flag),{message:'recording failed'});
});
test('F3D2-15 structurally equal records ignore property insertion order',()=>{
 const a=fixture({energy:47,time:3}),e=a.entities.get('0987898');a.grid[0][0]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});
 const b={rng_state:1,entities:new api.Map([[e.id,{lifecycle:e.lifecycle,energy:e.energy,position:{y:0,x:0},id:e.id}]]),grid:[[{effect:{stock:1,kind:'RESOURCE'},traversal:'FREE'}]],time:3};
 check(a);check(b);assert.deepEqual(bytes(api.canonical_full_state_bytes(a)),bytes(api.canonical_full_state_bytes(b)));assert.equal(api.STATE_HASH_FULL(a),api.STATE_HASH_FULL(b));
});
