const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const io=require('../tools/evidence/io.cjs'),{snapshot,watch}=require('../tools/evidence/preserve.cjs'),{verify,restore}=require('../tools/evidence/verify.cjs');
function setup(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),'f6-f-copy-')),source=path.join(root,'source'),dest=path.join(root,'package');fs.mkdirSync(source);try{return fn({root,source,dest});}finally{fs.rmSync(root,{recursive:true,force:true});}}
function small(source,{closed=true,terminal=true,bytes=Buffer.from('OPAQUE_OPERATIONAL_FIXTURE_NOT_AN_EPISODE')}={}){
 const a={seed:1,agent:'wait',repetition:1},file='1-wait-1.wlx.gz',start={event:'START_REQUEST',...a},finish={event:'FINISH',...a,file,operational_status:'RETURNED'};
 fs.writeFileSync(path.join(source,'execution.jsonl'),JSON.stringify(start)+'\n'+(closed?JSON.stringify(finish)+'\n':''));
 if(closed)fs.writeFileSync(path.join(source,file),bytes);
 if(terminal){fs.writeFileSync(path.join(source,'campaign.json'),JSON.stringify({format:'OPERATIONAL_TEST_FIXTURE',seeds:[1],agents:['wait'],repetitions:1,entries:closed?[finish]:[]}));fs.writeFileSync(path.join(source,'analysis.json'),'{}');}
 return {file,start,finish};
}
test('F6F-P01 complete byte copy is verified and idempotent; source is untouched',()=>setup(({source,dest})=>{
 small(source);const before=new Map(fs.readdirSync(source).map(f=>[f,fs.readFileSync(path.join(source,f))]));const a=snapshot(source,dest),b=snapshot(source,dest);
 assert.equal(a.copy_state,'COPY_VERIFIED');assert.equal(a.source_state,'SOURCE_COMPLETE');assert.equal(b.new_index,false);assert.equal(b.new_objects,0);assert.equal(verify(dest).state,'COPY_VERIFIED');
 assert.deepEqual(fs.readdirSync(source),[...before.keys()]);for(const [f,v]of before)assert.deepEqual(fs.readFileSync(path.join(source,f)),v);
}));
test('F6F-P02 START alone and missing terminal manifests remain partial',()=>setup(({source,dest})=>{
 small(source,{closed:false,terminal:false});const r=snapshot(source,dest);assert.equal(r.start_without_finish,1);assert.equal(r.finishes,0);assert.equal(r.source_state,'SOURCE_INCOMPLETE');assert.equal(r.copy_state,'COPY_VERIFIED');assert.equal(r.final_manifest_present,false);
}));
test('F6F-P03 advertised missing artifact is not fabricated or accepted',()=>setup(({source,dest})=>{
 const {file}=small(source);fs.unlinkSync(path.join(source,file));const r=snapshot(source,dest);assert.ok(r.missing.includes(file));assert.equal(r.source_state,'SOURCE_INCOMPLETE');assert.equal(io.load(dest).latest.body.files[file],undefined);
}));
test('F6F-P04 operational raw return and failure diagnostic both survive',()=>setup(({source,dest})=>{
 const a={seed:1,agent:'wait',repetition:1},raw=Buffer.from([0,255,10,128]),file='1-wait-1.raw.gz';
 fs.writeFileSync(path.join(source,'execution.jsonl'),JSON.stringify({event:'START_REQUEST',...a})+'\n'+JSON.stringify({event:'FINISH',...a,raw_file:file,operational_status:'WORKER_ERROR'})+'\n');fs.writeFileSync(path.join(source,file),raw);fs.writeFileSync(path.join(source,'1-wait-1.failure.json'),' {"diagnostic":"fixture failure","result":null}\n');
 const r=snapshot(source,dest);assert.equal(r.finishes,1);const target=path.join(path.dirname(source),'restored');const restored=restore(dest,target);assert.equal(restored.restoration,'VERIFIED_PARTIAL_EVIDENCE_NOT_SCIENTIFIC_ACCEPTANCE');assert.deepEqual(fs.readFileSync(path.join(target,'files',file)),raw);assert.ok(fs.readFileSync(path.join(target,'files','1-wait-1.failure.json')).includes('fixture failure'));
}));
test('F6F-P05 source revisions preserve both bytes and declare a blocking conflict',()=>setup(({source,dest})=>{
 const {file}=small(source,{bytes:Buffer.from('first')});snapshot(source,dest);fs.writeFileSync(path.join(source,file),'second');const r=snapshot(source,dest),state=io.load(dest).latest.body;
 assert.equal(r.source_state,'SOURCE_INCOMPLETE');assert.ok(r.conflicts.some(c=>c.file===file&&c.blocking));assert.equal(state.files[file].versions.length,2);assert.equal(io.objectBytes(dest,state.files[file].versions[0]).toString(),'first');assert.equal(io.objectBytes(dest,state.files[file].current).toString(),'second');assert.equal(snapshot(source,dest).new_index,false);
}));
test('F6F-P06 corrupt destination is detected; incoming and corrupt bytes are never overwritten',()=>setup(({source,dest})=>{
 const {file}=small(source);snapshot(source,dest);const v=io.load(dest).latest.body.files[file].current,original=io.objectBytes(dest,v),physical=path.join(dest,v.object);fs.writeFileSync(physical,'CORRUPT');assert.equal(verify(dest).state,'COPY_ERROR');
 const r=snapshot(source,dest);assert.equal(r.copy_state,'COPY_ERROR');assert.equal(fs.readFileSync(physical).toString(),'CORRUPT');const latest=io.load(dest).latest.body.files[file].current;assert.ok(latest.object.startsWith('conflicts/'));assert.deepEqual(io.objectBytes(dest,latest),original);assert.throws(()=>restore(dest,path.join(path.dirname(source),'bad-restore')),/CORRUPT_PACKAGE/);
}));
test('F6F-P07 traversal, absolute references and symlinks are rejected',()=>setup(({root,source,dest})=>{
 const {finish}=small(source);const secret=path.join(root,'outside');fs.writeFileSync(secret,'outside data');fs.unlinkSync(path.join(source,'1-wait-1.wlx.gz'));fs.symlinkSync(secret,path.join(source,'1-wait-1.wlx.gz'));
 let r=snapshot(source,dest);assert.equal(r.copy_state,'COPY_ERROR');assert.ok(r.errors.some(e=>/UNSAFE_SOURCE_FILE/.test(e.error)));
 fs.writeFileSync(path.join(source,'execution.jsonl'),JSON.stringify({event:'START_REQUEST',seed:1,agent:'wait',repetition:1})+'\n'+JSON.stringify({...finish,file:'../outside'})+'\n');r=snapshot(source,dest);assert.equal(r.copy_state,'COPY_ERROR');assert.ok(r.errors.some(e=>/UNSAFE_RELATIVE_PATH/.test(e.error)));assert.equal(fs.readFileSync(secret).toString(),'outside data');
}));
test('F6F-P08 source and destination overlap or directory symlinks are rejected',()=>setup(({root,source,dest})=>{
 small(source);assert.throws(()=>snapshot(source,path.join(source,'nested')),/OVERLAP/);fs.symlinkSync(source,path.join(root,'link'));assert.throws(()=>snapshot(path.join(root,'link'),dest),/UNSAFE_DIRECTORY/);
}));
test('F6F-P09 private keys are excluded; disguised private PEM is rejected',()=>setup(({source,dest})=>{
 small(source);const key='-----BEGIN PRIVATE KEY-----\nSYNTHETIC MARKER ONLY, NOT A KEY\n-----END PRIVATE KEY-----';fs.writeFileSync(path.join(source,'owner-private.pem'),key);fs.writeFileSync(path.join(source,'reviewer-public.pem'),key);
 const r=snapshot(source,dest);assert.equal(r.copy_state,'COPY_ERROR');assert.ok(r.errors.some(e=>e.error.includes('PRIVATE_KEY_MATERIAL')));const files=io.load(dest).latest.body.files;assert.equal(files['owner-private.pem'],undefined);assert.equal(files['reviewer-public.pem'],undefined);assert.equal(verify(dest).state,'COPY_VERIFIED');assert.equal(verify(dest).preservation_state,'COPY_ERROR');
}));
test('F6F-P10 changing source has a bounded retry and is never declared stable',()=>setup(({source})=>{
 const file='changing.json';fs.writeFileSync(path.join(source,file),'first');const original=fs.readSync;let calls=0;
 fs.readSync=function(fd,buffer,offset,...args){const n=original.call(fs,fd,buffer,offset,...args);if(offset===0){calls++;fs.appendFileSync(path.join(source,file),'!');}return n;};
 try{assert.throws(()=>io.stableRead(source,file,{attempts:2}),/SOURCE_CHANGED/);assert.equal(calls,2);}finally{fs.readSync=original;}
}));
test('F6F-P11 partial final JSONL line and malformed record remain incomplete',()=>setup(({source,dest})=>{
 small(source,{terminal:false});fs.appendFileSync(path.join(source,'execution.jsonl'),'{"event":"START');const r=snapshot(source,dest);assert.equal(r.source_state,'SOURCE_INCOMPLETE');assert.ok(io.load(dest).latest.body.source_issues.includes('partial trailing log line'));
}));
test('F6F-P12 interrupted temporary publication and resumed invocation reconcile by hashes',()=>setup(({source,dest})=>{
 small(source);snapshot(source,dest);fs.writeFileSync(path.join(dest,'indexes','.pending-interrupted'),'partial');const before=fs.readdirSync(path.join(dest,'objects')).length,r=snapshot(source,dest);assert.equal(r.new_index,false);assert.equal(r.new_objects,0);assert.equal(fs.readdirSync(path.join(dest,'objects')).length,before);
}));
test('F6F-P13 tampered index chain and materialized restoration are detected',()=>setup(({root,source,dest})=>{
 small(source);snapshot(source,dest);const target=path.join(root,'restored');restore(dest,target);fs.writeFileSync(path.join(target,'files','1-wait-1.wlx.gz'),'bad');assert.equal(verify(target).state,'COPY_ERROR');const index=fs.readdirSync(path.join(dest,'indexes'))[0];fs.appendFileSync(path.join(dest,'indexes',index),' ');assert.throws(()=>verify(dest),/INVALID_INDEX_CHAIN/);
}));
test('F6F-P14 stop watch without touching source or starting any campaign',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'f6-f-watch-stop-')),source=path.join(root,'source');fs.mkdirSync(source);small(source,{closed:false,terminal:false});const before=fs.readFileSync(path.join(source,'execution.jsonl')),ac=new AbortController();
 try{const r=await watch(source,path.join(root,'package'),{intervalMs:100,signal:ac.signal,onSnapshot:()=>ac.abort()});assert.equal(r.passes,1);assert.deepEqual(fs.readFileSync(path.join(source,'execution.jsonl')),before);}finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('F6F-P15 typed binary payload survives recovery byte-for-byte without JSON flattening',()=>setup(({root,source,dest})=>{
 const wire=require('../conformance/wire.cjs'),zlib=require('node:zlib'),value={map:new Map([['entity',1n<<63n]]),negative_zero:-0,subnormal:Number.MIN_VALUE,bytes:Buffer.from([0,128,255])};small(source);const bytes=zlib.gzipSync(JSON.stringify(wire.encode(value)));fs.writeFileSync(path.join(source,'1-wait-1.raw.gz'),bytes);snapshot(source,dest);const target=path.join(root,'restored');restore(dest,target);const saved=fs.readFileSync(path.join(target,'files','1-wait-1.raw.gz'));assert.deepEqual(saved,bytes);const decoded=wire.decode(JSON.parse(zlib.gunzipSync(saved)));assert.deepEqual(decoded.map,value.map);assert.ok(Object.is(decoded.negative_zero,-0));assert.equal(decoded.subnormal,value.subnormal);assert.deepEqual(decoded.bytes,value.bytes);
}));
test('F6F-P16 expected campaign/freeze and source directory prevent mixing evidence packages',()=>setup(({root,source,dest})=>{
 small(source);const m=JSON.parse(fs.readFileSync(path.join(source,'campaign.json')));m.campaign_id='campaign-A';m.freeze_id='identity-A';fs.writeFileSync(path.join(source,'campaign.json'),JSON.stringify(m));assert.throws(()=>snapshot(source,dest,{campaignId:'campaign-B'}),/CAMPAIGN_ID_MISMATCH/);assert.throws(()=>snapshot(source,dest,{identity:'identity-B'}),/FREEZE_ID_MISMATCH/);snapshot(source,dest,{campaignId:'campaign-A',identity:'identity-A'});assert.equal(snapshot(source,dest).new_index,false);const other=path.join(root,'other-source');fs.mkdirSync(other);small(other);assert.throws(()=>snapshot(other,dest),/SOURCE_DIRECTORY_CHANGED/);
}));
