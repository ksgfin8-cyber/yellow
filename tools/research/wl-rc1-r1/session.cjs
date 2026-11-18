'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {store,verify:verifyData}=require('../wl-rc1/storage.cjs'),{destination}=require('../wl-rc1/runner.cjs'),{treeRss,killGroup}=require('../wl-rc1/guardian.cjs');
const {LIMITS,JOURNAL_CAP,ROOT_RESERVE,validate}=require('./plan.cjs'),{inspect}=require('./journal.cjs'),{sha,check}=require('./identity.cjs');
async function run({directory,requests,freeze_id,limits=LIMITS,worker=path.join(__dirname,'worker.cjs'),attachments={},candidate=null,beforeVerify=null}){
 destination(directory);assert.equal(process.platform,'linux');treeRss(process.pid);assert.ok(requests.length<=limits.max_processes);
 const journalReserve=limits.max_processes*JOURNAL_CAP,coreBudget=limits.artifact_bytes-journalReserve-ROOT_RESERVE;assert.ok(coreBudget>limits.reserve_bytes);
 fs.mkdirSync(directory);const data=path.join(directory,'data');fs.mkdirSync(data);const storage=store(data,coreBudget,limits.reserve_bytes);let stopped=null,current=null,verified=null,controllerError=null,sealed=false;const outcomes=[];
 const guard=cp.fork(path.resolve(__dirname,'../wl-rc1/guardian.cjs'),[],{stdio:['ignore','ignore','pipe','ipc'],serialization:'advanced'});
 const ready=new Promise((resolve,reject)=>{guard.on('message',m=>{if(m.type==='READY')resolve();});guard.once('error',reject);guard.once('exit',()=>reject(Error('guardian exited before READY')));});
 guard.send({parent:process.pid,directory,limits});await ready;
 guard.on('message',m=>{if(m.type==='STOP'){stopped=m;killGroup(current?.pid);if(guard.connected)guard.send({type:'ACK'},()=>{});}});
 try{
  for(const [name,file] of Object.entries(attachments))storage.write(name,fs.readFileSync(file));
  for(let index=0;index<requests.length&&!stopped;index++){
   const request={...requests[index],index,data_directory:data};storage.record('attempts.jsonl',{type:'START',index,request,at:new Date().toISOString()});
   const start=process.hrtime.bigint(),child=cp.fork(worker,[],{execArgv:['--max-old-space-size=256'],detached:true,serialization:'advanced',stdio:['ignore','pipe','pipe','ipc']});current=child;guard.send({type:'ACTIVE',pid:child.pid,started_ns:String(start)});
   let failure=null,done=false,headers=0;const chunks={stdout:Buffer.alloc(0),stderr:Buffer.alloc(0)},received={stdout:0,stderr:0};
   function capture(k,b){received[k]+=b.length;const room=65536-chunks[k].length;chunks[k]=Buffer.concat([chunks[k],b.subarray(0,Math.max(0,room))]);if(b.length>room){failure='DIAGNOSTIC_LIMIT';killGroup(child.pid);}}
   child.stdout.on('data',b=>capture('stdout',b));child.stderr.on('data',b=>capture('stderr',b));child.on('error',e=>{failure=String(e);});
   child.on('message',row=>{try{assert.ok(['header','calibration','sample','done','operation_error','fatal'].includes(row?.type),'invalid record');if(row.type==='header'){headers++;assert.equal(row.freeze_id,freeze_id);assert.deepEqual(row.condition,request.condition);}if(row.type==='done'){assert.ok(!done);done=true;}storage.record(`${String(index).padStart(2,'0')}.jsonl`,row);if(['operation_error','fatal'].includes(row.type)){failure=String(row.error);killGroup(child.pid);}}catch(e){failure=String(e);killGroup(child.pid);}});
   const closed=new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));child.send(request,e=>{if(e){failure=String(e);killGroup(child.pid);}});const result=await closed;current=null;if(guard.connected)guard.send({type:'IDLE'});
   for(const k of ['stdout','stderr'])if(chunks[k].length)storage.write(`${index}.${k}.bin`,chunks[k]);
   const row={type:'FINISH',index,...result,status:stopped?.reason??failure??(result.code===0&&done&&headers===1?'COMPLETE':'WORKER_ERROR'),wall_ns:String(process.hrtime.bigint()-start),censored:!!stopped||!!failure||!done||result.code!==0,diagnostic_received_bytes:received,diagnostic_omitted_bytes:{stdout:received.stdout-chunks.stdout.length,stderr:received.stderr-chunks.stderr.length}};outcomes.push(row);storage.record('attempts.jsonl',row);if(row.status!=='COMPLETE')break;
  }
  if(candidate&&!stopped)check(candidate);
  storage.seal({freeze_id,kind:requests[0]?.kind,status:!stopped&&outcomes.length===requests.length&&outcomes.every(x=>x.status==='COMPLETE')?'COMPLETE':'PARTIAL',requests_expected:requests.length,attempts:outcomes,limits,core_budget_bytes:coreBudget,journal_reserved_bytes:journalReserve,stop:stopped});sealed=true;
  if(beforeVerify)beforeVerify(); // Test-only synthetic blocked-controller fault, never exposed by CLI.
  verified=verifyData(data);validateRaw(data,freeze_id);
 }catch(e){controllerError=String(e);killGroup(current?.pid);try{if(!sealed)storage.record('controller-errors.jsonl',{type:'fatal',error:controllerError,censored:true});}catch{}}
 finally{
  if(guard.connected)await new Promise(resolve=>{const end=()=>{guard.off('message',on);resolve();},on=m=>{if(['CLOSED','STOP'].includes(m.type))end();};guard.on('message',on);guard.once('exit',end);guard.send({type:'CLOSE'},e=>{if(e)end();});});
  if(guard.connected)guard.disconnect();
 }
 const journalStates=fs.readdirSync(data).filter(x=>x.endsWith('.stage.jsonl')).map(file=>({file,...inspect(path.join(data,file))}));
 const complete=!stopped&&!controllerError&&verified?.state==='VERIFIED'&&verified.errors===0&&outcomes.length===requests.length&&outcomes.every(x=>x.status==='COMPLETE')&&journalStates.every(x=>x.complete);
 const envelope={format:'WL-RC1-R1-BUNDLE-1',freeze_id,status:complete?'COMPLETE':'PARTIAL',scientific_acceptance:false,limits,stop:stopped,controller_error:controllerError,requests_expected:requests.length,attempts:outcomes,journals:journalStates,data_verification:verified,files:['guardian.jsonl','data/manifest.json'].filter(x=>fs.existsSync(path.join(directory,x))).map(file=>{const b=fs.readFileSync(path.join(directory,file));return {file,bytes:b.length,sha256:sha(b)};})};
 const bytes=Buffer.from(JSON.stringify(envelope,null,2)+'\n');assert.ok(bytes.length+fs.statSync(path.join(directory,'guardian.jsonl')).size<=ROOT_RESERVE);fs.writeFileSync(path.join(directory,'bundle.json'),bytes,{flag:'wx'});return envelope;
}
function verify(directory){
 const bundle=path.join(directory,'bundle.json');if(!fs.existsSync(bundle))return {state:'PARTIAL_UNSEALED',scientific_acceptance:false,reason:'No R1 terminal envelope; preserve data and guardian journal.'};
 const x=JSON.parse(fs.readFileSync(bundle));assert.equal(x.format,'WL-RC1-R1-BUNDLE-1');for(const r of x.files){assert.ok(['guardian.jsonl','data/manifest.json'].includes(r.file));const b=fs.readFileSync(path.join(directory,r.file));assert.equal(b.length,r.bytes);assert.equal(sha(b),r.sha256);}
 const data=verifyData(path.join(directory,'data'));validateRaw(path.join(directory,'data'),x.freeze_id);if(x.status==='COMPLETE')assert.equal(data.state,'VERIFIED');
 const journals=fs.readdirSync(path.join(directory,'data')).filter(f=>f.endsWith('.stage.jsonl')).map(f=>({file:f,...inspect(path.join(directory,'data',f))}));assert.deepEqual(journals,x.journals);
 if(x.status==='COMPLETE')assert.ok(journals.every(j=>j.complete)&&!x.stop&&!x.controller_error&&data.errors===0);
 return {state:data.state==='VERIFIED'?'VERIFIED':'PARTIAL_UNSEALED',package_status:x.status,samples:data.samples??0,errors:data.errors??0,journals:journals.length,open_stages:journals.filter(x=>x.last_open_stage).map(x=>x.last_open_stage),freeze_id:x.freeze_id,scientific_acceptance:false};
}

function validateRaw(data,freeze_id){
 const mf=path.join(data,'manifest.json');if(!fs.existsSync(mf))return;const m=JSON.parse(fs.readFileSync(mf));
 if(!['R1_FIXTURE','R1_PILOT'].includes(m.kind))return; // Synthetic control packages are not measurement units.
 const read=file=>fs.readFileSync(file,'utf8').trim().split('\n').map(JSON.parse),attempts=read(path.join(data,'attempts.jsonl'));
 for(const start of attempts.filter(r=>r.type==='START')){
  const c=validate(start.request.condition,m.kind==='R1_FIXTURE'),file=path.join(data,`${String(start.index).padStart(2,'0')}.jsonl`),finish=attempts.find(r=>r.type==='FINISH'&&r.index===start.index);if(!fs.existsSync(file)){assert.notEqual(finish?.status,'COMPLETE','R1 missing raw file');continue;}
  const rows=read(file),headers=rows.filter(r=>r.type==='header'),samples=rows.filter(r=>r.type==='sample');assert.ok(headers.length<=1,'R1 duplicate header');
  if(headers.length){const h=headers[0];assert.equal(h.revision,'R1-1.0.0');assert.equal(h.freeze_id,freeze_id);assert.deepEqual(h.condition,c);}
  const wanted=Array.from({length:1+c.warmup+c.samples},(_,i)=>({phase:i===0?'FIRST_MEASURED':i<=c.warmup?'WARMUP':'WARM',sample:i===0?0:i<=c.warmup?i:i-c.warmup}));
  samples.forEach((r,i)=>{assert.equal(r.operation,c.operation);assert.deepEqual({phase:r.phase,sample:r.sample},wanted[i]);for(const stage of ['PREPARE','INPUT_WITNESS','EXECUTE','OUTPUT_WITNESS','ENCODE','SERIALIZE','HASH','COMPRESS'])assert.ok(/^\d+$/.test(r.stage_work_ns?.[stage]),'R1 stage timing missing');});
  if(finish?.status==='COMPLETE'){assert.equal(headers.length,1);assert.equal(samples.length,wanted.length,'R1 incomplete samples');assert.equal(rows.filter(r=>r.type==='done').length,1);}
 }
}
module.exports={run,verify};
