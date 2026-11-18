'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const {check,authorize,runtime,sha,ROOT}=require('./identity.cjs'),{validate,plan}=require('./plan.cjs'),{journal}=require('./journal.cjs');
const {measure,resolution}=require('../wl-rc1/worker.cjs');
const send=row=>new Promise((resolve,reject)=>process.send(row,e=>e?reject(e):resolve()));
async function execute(request){
 assert.deepEqual(process.execArgv,['--max-old-space-size=256']);const c=validate(request.condition,request.kind==='R1_FIXTURE');
 assert.ok(Number.isInteger(request.index)&&request.index>=0);if(request.kind!=='R1_FIXTURE')assert.deepEqual(c,plan()[request.index]);
 const data=fs.realpathSync(request.data_directory),relative=path.relative(ROOT,data);assert.ok(relative==='..'||relative.startsWith('..'+path.sep));assert.ok(!data.toLowerCase().includes('p01-'));const file=path.join(data,`${String(request.index).padStart(3,'0')}.stage.jsonl`),j=journal(file);let stage='IDENTITY';
 try{
  const identity=j.sync('IDENTITY','process',()=>{if(request.kind==='R1_FIXTURE')return check(request.candidate);assert.equal(request.kind,'R1_PILOT');const x=authorize(request.authorization);assert.equal(path.resolve(x.receipt.output_directory,'data'),data);return x.candidate;}).value;assert.equal(identity.freeze_id,request.freeze_id);
  const loaded=j.sync('LOAD','process',()=>{const mod=require('../wl-rc1/operations.cjs');return {api:mod.load(),...mod};});const {api,prepare,codec}=loaded.value;
  const calibration=j.sync('CALIBRATION','process',resolution).value,seen=new Set(),initialCPU=process.cpuUsage();
  await j.asyncStage('HEADER_SEND','process',()=>send({type:'header',format:'WL-RC1-RAW-1',revision:'R1-1.0.0',freeze_id:identity.freeze_id,condition:c,runtime:runtime(),units:{time:'ns_decimal_string',cpu:'microseconds',memory:'bytes'},load_ns:loaded.ns,gc:'NOT_OBSERVED; no forced GC',environment:{execArgv:process.execArgv,pid:process.pid,os_release:require('node:os').release(),cpu:require('node:os').cpus()[0]?.model,loadavg:require('node:os').loadavg()}}));
  await j.asyncStage('CALIBRATION_SEND','process',()=>send({type:'calibration',...calibration}));
  for(let i=0;i<1+c.warmup+c.samples;i++){
   const phase=i===0?'FIRST_MEASURED':i<=c.warmup?'WARMUP':'WARM',sample=i===0?0:i<=c.warmup?i:i-c.warmup,call=`${phase}:${sample}`,timing={};
   async function ipc(row){return j.asyncStage('IPC_SEND_CALLBACK',call,()=>send(row));}
   try{
    stage='PREPARE';const prep=j.sync(stage,call,()=>prepare(api,c,c.operation));timing.PREPARE=prep.ns;
    stage='INPUT_WITNESS';const before=j.sync(stage,call,prep.value.before);timing.INPUT_WITNESS=before.ns;
    stage='EXECUTE';const measured=j.sync(stage,call,()=>measure(c.mode,prep.value.invoke));timing.EXECUTE=measured.ns;const m=measured.value;
    stage='OUTPUT_WITNESS';const after=j.sync(stage,call,()=>prep.value.after(m.value));timing.OUTPUT_WITNESS=after.ns;
    stage='ENCODE';const encoded=j.sync(stage,call,()=>codec.encode({before:before.value,after:after.value}));timing.ENCODE=encoded.ns;
    stage='SERIALIZE';const serialized=j.sync(stage,call,()=>JSON.stringify(encoded.value));timing.SERIALIZE=serialized.ns;
    stage='HASH';const digest=j.sync(stage,call,()=>sha(serialized.value));timing.HASH=digest.ns;
    const fresh=!seen.has(digest.value);stage='COMPRESS';const compressed=j.sync(stage,call,()=>fresh?zlib.gzipSync(serialized.value):null);timing.COMPRESS=compressed.ns;
    if(compressed.value&&compressed.value.length>16*1024*1024)throw Error('witness size limit');seen.add(digest.value);
    stage='IPC_SEND_CALLBACK';await ipc({type:'sample',operation:c.operation,phase,sample,prep_ns:timing.PREPARE,api_ns:m.api_ns,wrapper_ns:m.wrapper_ns,cpu_us:m.cpu_us,memory_before:m.memory_before,memory_after:m.memory_after,stage_work_ns:timing,witness_sha256:digest.value,witness_json_bytes:Buffer.byteLength(serialized.value),witness_gzip:compressed.value,resolution_insufficient:BigInt(m.api_ns)<10n*BigInt(calibration.clock_median_ns),preparation_exposure:prep.value.exposure,compressed_new_witness:fresh});
   }catch(error){await send({type:'operation_error',operation:c.operation,phase,sample,stage,error:String(error),censored:true});throw error;}
  }
  j.sync('FINAL_IDENTITY','process',()=>check(request.candidate));await send({type:'done',cpu_us:process.cpuUsage(initialCPU),resources:process.resourceUsage(),journal:j.stats(),note:'CPU includes preparation/witnesses/journal and IPC; journal io_ns excludes close and is not a causal overhead estimate.'});
 }finally{j.close();}
}
if(require.main===module)process.once('message',r=>execute(r).then(()=>process.disconnect()).catch(async e=>{await send({type:'fatal',error:String(e)}).catch(()=>{});process.exitCode=1;process.disconnect();}));
module.exports={execute};
