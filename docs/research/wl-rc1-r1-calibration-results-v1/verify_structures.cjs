'use strict';
// Fresh decompression/decoding per sample: equality never rests on shared object identity.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const [source,repo]=process.argv.slice(2),codec=require(path.join(repo,'tools/p01/codec.cjs'));
const read=file=>fs.readFileSync(file,'utf8').trim().split('\n').map(JSON.parse);
const data=path.join(source,'data'),starts=read(path.join(data,'attempts.jsonl')).filter(x=>x.type==='START');
const groups=new Map();let within=0,cross=0,bytes=0,samples=0;
function equal(a,b){assert.notStrictEqual(a,b);assert.deepEqual(a,b);
 for(const phase of ['before','after'])for(const key of ['WORLD','FULL']){
  assert.notStrictEqual(a[phase][key],b[phase][key]);assert.deepEqual(Buffer.from(a[phase][key]),Buffer.from(b[phase][key]));bytes++;
 }
}
for(const start of starts){const c=start.request.condition,key=[c.profile.id,c.operation,c.block].join('/');
 const records=read(path.join(data,String(start.index).padStart(2,'0')+'.jsonl')).filter(x=>x.type==='sample');
 let first=null;const existing=groups.get(key);
 for(const row of records){const b=zlib.gunzipSync(fs.readFileSync(path.join(data,row.witness_sha256+'.json.gz'))),value=codec.decode(JSON.parse(b));samples++;
  if(first){equal(first,value);within++;}else first=value;
  if(existing){equal(existing,value);cross++;}
 }
 if(!existing)groups.set(key,first);
}
assert.equal(samples,216);assert.equal(groups.size,6);assert.equal(within,192);assert.equal(cross,162);assert.equal(bytes,1416);
console.log(JSON.stringify({PASS:true,fresh_decoded_samples:samples,groups:groups.size,full_structural_within_worker_comparisons:within,full_structural_cross_treatment_comparisons:cross,explicit_WLS1_byte_array_comparisons:bytes,mismatches:0,shared_object_identity_shortcuts:false,archive_deduplication:'6 payload files; every record dereferenced and freshly decoded; no independent external implementation claimed',new_WORLD_or_replay_calls:0},null,2));
