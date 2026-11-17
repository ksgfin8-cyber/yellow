'use strict';
const {performance}=require('node:perf_hooks'),{validateCondition,OPERATIONS}=require('./conditions.cjs');
const {check,authorize,runtime,sha}=require('./identity.cjs');
const send=x=>new Promise((resolve,reject)=>process.send(x,e=>e?reject(e):resolve()));
function measure(mode,invoke){const total=process.hrtime.bigint();const cpu=mode==='DETAILED'?process.cpuUsage():null,mem=mode==='DETAILED'?process.memoryUsage():null;const t=process.hrtime.bigint();const value=invoke();const end=process.hrtime.bigint(),delta=cpu?process.cpuUsage(cpu):null,after=mem?process.memoryUsage():null;return {value,api_ns:String(end-t),wrapper_ns:String(process.hrtime.bigint()-total),cpu_us:delta,memory_before:mem,memory_after:after};}
function resolution(){const clock=[],empty=[];for(let i=0;i<200;i++){let t=process.hrtime.bigint();clock.push(Number(process.hrtime.bigint()-t));t=process.hrtime.bigint();(()=>{})();empty.push(Number(process.hrtime.bigint()-t));}const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];return {clock_ns:clock,empty_ns:empty,clock_median_ns:median(clock),empty_median_ns:median(empty),interpretation_multiple:10};}
async function execute(request){
 if(process.execArgv.length!==1||process.execArgv[0]!=='--max-old-space-size=256')throw Error('worker heap flag mismatch');
 if(request.kind==='FIXTURE')validateCondition(request.condition,true);else {if(request.kind!=='PILOT')throw Error('unauthorized worker kind');const approved=authorize(request.authorization);if(approved.candidate.freeze_id!==request.freeze_id)throw Error('identity mismatch');validateCondition(request.condition);}
 const pinned=check(request.candidate);if(request.freeze_id!==pinned.freeze_id)throw Error('identity mismatch');
 const c=request.condition;const calibration=resolution(),start=process.hrtime.bigint(),initialCPU=process.cpuUsage();
 const {load,prepare,codec}=require('./operations.cjs'),api=load(),load_ns=String(process.hrtime.bigint()-start),seen=new Set();
 await send({type:'header',format:'WL-RC1-RAW-1',freeze_id:pinned.freeze_id,condition:c,runtime:runtime(),units:{time:'ns_decimal_string',cpu:'microseconds',memory:'bytes'},load_ns,gc:'NOT_OBSERVED; no forced GC; GC may occur inside or outside API windows',environment:{os_release:require('node:os').release(),execArgv:process.execArgv,cpu:require('node:os').cpus()[0]?.model,total_memory_bytes:require('node:os').totalmem(),loadavg:require('node:os').loadavg(),pid:process.pid},time_origin_ms:performance.timeOrigin});
 await send({type:'calibration',...calibration});
 for(const operation of OPERATIONS)for(let i=0;i<1+c.warmup+c.samples;i++){
  const phase=i===0?'FIRST_MEASURED':i<=c.warmup?'WARMUP':'WARM',sample=i===0?0:i<=c.warmup?i:i-c.warmup;let stage='preparation',begin=process.hrtime.bigint();
  try{
   const f=prepare(api,c,operation),before=f.before(),prep_ns=String(process.hrtime.bigint()-begin);stage='execution';begin=process.hrtime.bigint();const m=measure(c.mode,f.invoke);stage='witness';const witness=codec.encode({before,after:f.after(m.value)}),json=JSON.stringify(witness),hash=sha(json);let encoded=null;
   if(!seen.has(hash)){encoded=require('node:zlib').gzipSync(json);if(encoded.length>16*1024*1024)throw Error('witness size limit');seen.add(hash);}
   const row={type:'sample',operation,phase,sample,prep_ns,api_ns:m.api_ns,wrapper_ns:m.wrapper_ns,cpu_us:m.cpu_us,memory_before:m.memory_before,memory_after:m.memory_after,witness_sha256:hash,witness_json_bytes:Buffer.byteLength(json),resolution_insufficient:BigInt(m.api_ns)<10n*BigInt(calibration.clock_median_ns),preparation_exposure:f.exposure};
   await send({...row,witness_gzip:encoded});
  }catch(error){await send({type:'operation_error',operation,phase,sample,stage,error:String(error),elapsed_ns:String(process.hrtime.bigint()-begin),censored:true});}
 }
 await send({type:'done',cpu_us:process.cpuUsage(initialCPU),resources:process.resourceUsage(),note:'Process counters include preparation, witnesses, IPC waits and all operations; not sum of API costs.'});
}
if(require.main===module)process.once('message',r=>execute(r).then(()=>process.disconnect()).catch(async e=>{await send({type:'fatal',error:String(e)}).catch(()=>{});process.exitCode=1;process.disconnect();}));
module.exports={measure,resolution};
