'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {store,verify:verifyData}=require('../wl-rc1/storage.cjs'),{destination}=require('../wl-rc1/runner.cjs'),{treeRss,killGroup}=require('../wl-rc1/guardian.cjs');
const {LIMITS}=require('./plan.cjs'),{JOURNAL_CAP,ROOT_RESERVE}=require('../wl-rc1-r1/plan.cjs'),{inspect}=require('../wl-rc1-r1/journal.cjs'),{sha,check}=require('./identity.cjs');
const {unit}=require('./verify.cjs');
// Snapshot of R1 transport, kept separate to preserve frozen R1. Validate units before continuing.
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
   let failure=null,done=false,headers=0;const records=[];const chunks={stdout:Buffer.alloc(0),stderr:Buffer.alloc(0)},received={stdout:0,stderr:0};
   function capture(k,b){received[k]+=b.length;const room=65536-chunks[k].length;chunks[k]=Buffer.concat([chunks[k],b.subarray(0,Math.max(0,room))]);if(b.length>room){failure='DIAGNOSTIC_LIMIT';killGroup(child.pid);}}
   child.stdout.on('data',b=>capture('stdout',b));child.stderr.on('data',b=>capture('stderr',b));child.on('error',e=>{failure=String(e);});
   child.on('message',row=>{try{assert.ok(['header','calibration','sample','done','operation_error','fatal'].includes(row?.type),'invalid record');if(row.type==='header'){headers++;assert.equal(row.freeze_id,freeze_id);assert.deepEqual(row.condition,request.condition);}if(row.type==='done'){assert.ok(!done);done=true;}storage.record(`${String(index).padStart(2,'0')}.jsonl`,row);const {witness_gzip,...metadata}=row;records.push(metadata);unit(records,request.condition,row.type==='done');if(['operation_error','fatal'].includes(row.type)){failure=String(row.error);killGroup(child.pid);}}catch(e){failure=String(e);killGroup(child.pid);}});
   const closed=new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));child.send(request,e=>{if(e){failure=String(e);killGroup(child.pid);}});const result=await closed;current=null;if(guard.connected)guard.send({type:'IDLE'});
   for(const k of ['stdout','stderr'])if(chunks[k].length)storage.write(`${index}.${k}.bin`,chunks[k]);
   if(!failure&&!stopped){try{unit(records,request.condition,true);const stage=path.join(data,`${String(index).padStart(3,'0')}.stage.jsonl`);if(request.condition.journal_policy==='SYNC')assert.ok(inspect(stage).complete,'incomplete checkpoint journal');else assert.ok(!fs.existsSync(stage),'OFF journal persisted');}catch(e){failure=String(e);}}
   const row={type:'FINISH',index,...result,status:stopped?.reason??failure??(result.code===0&&done&&headers===1?'COMPLETE':'WORKER_ERROR'),wall_ns:String(process.hrtime.bigint()-start),censored:!!stopped||!!failure||!done||result.code!==0,diagnostic_received_bytes:received,diagnostic_omitted_bytes:{stdout:received.stdout-chunks.stdout.length,stderr:received.stderr-chunks.stderr.length}};outcomes.push(row);storage.record('attempts.jsonl',row);if(row.status!=='COMPLETE')break;
  }
  if(candidate&&!stopped)check(candidate);
  storage.seal({freeze_id,kind:requests[0]?.kind,status:!stopped&&outcomes.length===requests.length&&outcomes.every(x=>x.status==='COMPLETE')?'COMPLETE':'PARTIAL',requests_expected:requests.length,attempts:outcomes,limits,core_budget_bytes:coreBudget,journal_reserved_bytes:journalReserve,stop:stopped});sealed=true;
  if(beforeVerify)beforeVerify(); // Test-only synthetic blocked-controller fault, never exposed by CLI.
  verified=verifyData(data);
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
module.exports={run};
