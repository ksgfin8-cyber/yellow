'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {ROOT,sha}=require('./identity.cjs'),{LIMITS}=require('./conditions.cjs'),{store,verify}=require('./storage.cjs'),{treeRss,killGroup}=require('./guardian.cjs');
const once=(child,type)=>new Promise((resolve,reject)=>{const on=m=>{if(m.type===type){child.off('message',on);resolve(m);}};child.on('message',on);child.once('error',reject);child.once('exit',()=>{child.off('message',on);reject(Error('guardian exited before '+type));});});
function destination(dir){const absolute=path.resolve(dir),parent=fs.realpathSync(path.dirname(absolute)),rel=path.relative(ROOT,parent);if(!path.isAbsolute(dir)||absolute!==dir||!(rel==='..'||rel.startsWith('..'+path.sep))||parent.toLowerCase().includes('p01-')||path.basename(dir).toLowerCase().includes('p01-'))throw Error('UNSAFE_RC1_DESTINATION');return absolute;}
async function runSessions({directory,requests,freeze_id,limits=LIMITS,worker=path.join(__dirname,'worker.cjs'),attachments={}}){
 destination(directory);if(process.platform!=='linux')throw Error('HOLD: Linux /proc supervision required');treeRss(process.pid);if(requests.length>limits.max_processes)throw Error('PROCESS_LIMIT');
 fs.mkdirSync(directory);const storage=store(directory,limits.artifact_bytes,limits.reserve_bytes),results=[];let stopped=null,current=null;
 const guard=cp.fork(path.join(__dirname,'guardian.cjs'),[],{stdio:['ignore','ignore','pipe','ipc'],serialization:'advanced'});
 const ready=once(guard,'READY');guard.send({parent:process.pid,directory,limits});await ready;
 guard.on('message',m=>{if(m.type==='STOP'){stopped=m;killGroup(current?.pid);if(guard.connected)guard.send({type:'ACK'},()=>{});}});
 try{
  for(const [name,file]of Object.entries(attachments))storage.write(name,fs.readFileSync(file));
  for(let index=0;index<requests.length&&!stopped;index++){
   storage.record('attempts.jsonl',{type:'START',index,request:requests[index],at:new Date().toISOString()});
   const started=process.hrtime.bigint(),child=cp.fork(worker,[],{execArgv:[`--max-old-space-size=${limits.heap_mib}`],serialization:'advanced',detached:true,stdio:['ignore','pipe','pipe','ipc']});current=child;guard.send({type:'ACTIVE',pid:child.pid,started_ns:String(started)});
   let failure=null,done=false,headers=0,stdout=Buffer.alloc(0),stderr=Buffer.alloc(0),received={stdout:0,stderr:0};
   const capture=(field,data)=>{received[field]+=data.length;const value=field==='stdout'?stdout:stderr,room=65536-value.length,next=Buffer.concat([value,data.subarray(0,Math.max(0,room))]);if(field==='stdout')stdout=next;else stderr=next;if(data.length>room){failure='DIAGNOSTIC_LIMIT';killGroup(child.pid);}};
   child.stdout.on('data',b=>capture('stdout',b));child.stderr.on('data',b=>capture('stderr',b));
   child.on('error',e=>{failure=String(e);});
   child.on('message',row=>{try{if(!row||!['header','calibration','sample','operation_error','done','fatal'].includes(row.type))throw Error('INVALID_RECORD_TYPE');if(row.type==='header'){headers++;if(row.freeze_id!==freeze_id)throw Error('HEADER_IDENTITY_MISMATCH');}if(row.type==='fatal')failure=row.error;if(row.type==='operation_error')failure='OPERATION_ERROR';if(row.type==='done'){if(done)throw Error('DUPLICATE_DONE');done=true;}storage.record(`${String(index).padStart(2,'0')}.jsonl`,row);}catch(e){failure=String(e);killGroup(child.pid);}});
   const closed=new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));
   child.send(requests[index],e=>{if(e){failure=String(e);killGroup(child.pid);}});const result=await closed;current=null;if(guard.connected)guard.send({type:'IDLE'});
   if(stdout.length)storage.write(`${index}.stdout.bin`,stdout);if(stderr.length)storage.write(`${index}.stderr.bin`,stderr);const row={type:'FINISH',index,...result,wall_ns:String(process.hrtime.bigint()-started),stdout_bytes:stdout.length,stderr_bytes:stderr.length,diagnostic_received_bytes:received,diagnostic_omitted_bytes:{stdout:received.stdout-stdout.length,stderr:received.stderr-stderr.length},diagnostics_censored:received.stdout>stdout.length||received.stderr>stderr.length,status:stopped?.reason??failure??(result.code===0&&done&&headers===1?'COMPLETE':'WORKER_ERROR'),censored:!!stopped||result.code!==0||!done};results.push(row);storage.record('attempts.jsonl',row);if(row.status!=='COMPLETE')break;
  }
 }catch(e){stopped=stopped??{reason:String(e)};killGroup(current?.pid);try{storage.record('attempts.jsonl',{type:'CONTROLLER_ERROR',error:String(e),censored:true});}catch{}}
 finally {if(guard.connected){await new Promise(resolve=>{const end=()=>{guard.off('message',on);resolve();},on=m=>{if(m.type==='CLOSED'||m.type==='STOP')end();};guard.on('message',on);guard.once('exit',end);guard.send({type:'CLOSE'},error=>{if(error)end();});});}if(guard.connected)guard.disconnect();}
 const manifest=storage.seal({freeze_id,limits,kind:requests[0]?.kind,requests_expected:requests.length,attempts:results,stop:stopped,status:!stopped&&results.length===requests.length&&results.every(x=>x.status==='COMPLETE')?'COMPLETE':'PARTIAL'});return {manifest,verification:verify(directory)};
}
module.exports={runSessions,destination};
