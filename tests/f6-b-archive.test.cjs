const {test,before}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),zlib=require('node:zlib');
const {runChild}=require('../tools/p01/supervisor.cjs'),{createArtifact,pack,unpack,verifyArtifact,canonical}=require('../tools/p01/archive.cjs');
const codec=require('../tools/p01/codec.cjs'),{sha}=require('../tools/p01/provenance.cjs');
let artifact;
before(async()=>{const x=await runChild(path.resolve(__dirname,'../tools/p01/worker.cjs'),{seed:1,agent:'wait'});assert.equal(x.operational_status,'RETURNED');artifact=createArtifact({seed:1,agent:'wait'},x);});
function change(bytes,fn,rechecksum=false){const doc=JSON.parse(zlib.gunzipSync(bytes));fn(doc);if(rechecksum){doc.body=codec.encode(doc.body);doc.sha256=sha(JSON.stringify(doc.body));}return zlib.gzipSync(JSON.stringify(doc));}
test('F6B-AR01 reviewed codec preserves Map, BigInt, binary64 -0/subnormal and bytes',()=>{
 const x={m:new Map([['é😀',1n<<63n]]),negativeZero:-0,subnormal:Number.MIN_VALUE,bytes:new Uint8Array([0,128,255])};
 const y=codec.decode(codec.encode(x));assert.deepEqual(y.m,x.m);assert.equal(y.subnormal,x.subnormal);assert.deepEqual([...y.bytes],[...x.bytes]);assert.ok(Object.is(y.negativeZero,-0));
 assert.throws(()=>codec.decode({$type:'map',entries:[['a',1],['a',2]]}),/duplicate/);
 assert.throws(()=>codec.decode({$type:'bigint',value:'01'}),/encoding/);
 assert.throws(()=>codec.decode({$type:'map',entries:[[1,2]]}),/string keys/);
 assert.throws(()=>codec.decode({$type:'bigint',value:'1',extra:true}),/fields/);
});
test('F6B-AR02 archive roundtrip has independent typed state and exact payload',()=>{
 const y=unpack(pack(artifact));assert.equal(canonical(y),canonical(artifact));assert.ok(y.data.result.trajectory.initial_state.entities instanceof Map);
 y.data.result.trajectory.initial_state.entities.values().next().value.energy=999;
 assert.equal(artifact.data.result.trajectory.initial_state.entities.values().next().value.energy,240);
 const typed=structuredClone(artifact);typed.data.config.max_ticks=160n;typed.data.result.trajectory.experiment_config.max_ticks=160n;
 assert.equal(unpack(pack(typed)).data.config.max_ticks,160n);
});
test('F6B-AR03 malformed archive and bad checksums fail explicitly',()=>{
 assert.throws(()=>unpack(Buffer.from('broken')),/compressed JSON/);
 assert.throws(()=>unpack(change(pack(artifact),d=>d.body.data.result.status='other')),/checksum/);
 assert.throws(()=>unpack(change(pack(artifact),d=>d.body.extra=true,true)),/format\/fields/);
});
test('F6B-AR04 recomputed checksum does not excuse invalid state or seed/identity',()=>{
 assert.throws(()=>unpack(change(pack(artifact),d=>d.body.data.result.trajectory.steps[0].world_state.rng_state=0,true)),/WorldState/);
 assert.throws(()=>unpack(change(pack(artifact),d=>d.body.provenance.seeds.agent++,true)),/derived seeds/);
 assert.throws(()=>unpack(change(pack(artifact),d=>d.body.provenance.algorithm.sha256='0'.repeat(64),true)),/source mismatch/);
});
test('F6B-AR05 full replay and WLS1 bytes verify from recovered plain data alone',()=>{
 const restored=unpack(pack(artifact));const proof=verifyArtifact(restored);assert.equal(proof.status,'COMPLETE_MATCH');assert.equal(proof.states_verified,161);
});
test('F6B-AR06 plausible metadata/checksum cannot certify an action not executed',()=>{
 const altered=structuredClone(artifact);altered.data.result.trajectory.steps[0].action.type='UNKNOWN';
 const restored=unpack(pack(altered));assert.throws(()=>verifyArtifact(restored),/replay/);
});
test('F6B-AR07 operational failure remains outside canonical result',()=>{
 const x=structuredClone(artifact);x.operational.operational_status='TIMEOUT';x.operational.exit_code=null;x.operational.signal='SIGKILL';x.operational.diagnostic='episode exceeded operational timeout';x.operational.resources.wall_ms=30001;x.data.result=null;
 const y=unpack(pack(x));assert.equal(y.data.result,null);assert.equal(verifyArtifact(y).status,'OPERATIONAL_FAILURE_RECORDED');
 x.data.result=artifact.data.result;assert.throws(()=>pack(x),/invented result/);
});
