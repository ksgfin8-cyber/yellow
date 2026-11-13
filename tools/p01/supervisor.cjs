// Operational process boundary. No simulated clock or WORLD events.
const {fork}=require('node:child_process'),fs=require('node:fs'),crypto=require('node:crypto');
function runChild(worker,request,{timeout_ms=30000,heap_mib=512}={}){
 if(!Number.isInteger(timeout_ms)||timeout_ms<1||!Number.isInteger(heap_mib)||heap_mib<16)throw Error('invalid operational limits');
 return new Promise(resolve=>{
  const attempt_id=crypto.randomUUID(),start=new Date().toISOString(),t=process.hrtime.bigint();
  const child=fork(worker,[],{execArgv:[`--max-old-space-size=${heap_mib}`],serialization:'advanced',stdio:['ignore','pipe','pipe','ipc']});
  let payload=null,timedOut=false,error=null,stdout='',stderr='',sampledRss=0,truncated=false;
  const capture=(target,data)=>{const s=data.toString();if(target.length+s.length>65536)truncated=true;return (target+s).slice(0,65536);};
  child.stdout.on('data',b=>{stdout=capture(stdout,b);});child.stderr.on('data',b=>{stderr=capture(stderr,b);});
  child.on('error',e=>{error=e.message;});
  child.on('message',m=>{if(payload===null)payload=m;else {error='multiple worker responses';child.kill('SIGKILL');}});
  const monitor=setInterval(()=>{try{const text=fs.readFileSync(`/proc/${child.pid}/status`,'utf8');const m=/VmHWM:\s+(\d+)/.exec(text);if(m)sampledRss=Math.max(sampledRss,Number(m[1]));}catch{}},25);
  const deadline=setTimeout(()=>{timedOut=true;child.kill('SIGKILL');},timeout_ms);
  child.once('close',(exit_code,signal)=>{
   clearTimeout(deadline);clearInterval(monitor);
   const operational_status=timedOut?'TIMEOUT':error||exit_code!==0||payload?.kind!=='result'?'WORKER_ERROR':'RETURNED';
   resolve({attempt_id,started_at:start,finished_at:new Date().toISOString(),limits:{timeout_ms,heap_mib},operational_status,
    exit_code,signal,diagnostic:timedOut?'episode exceeded operational timeout':error??payload?.diagnostic??(exit_code!==0?'worker exited unsuccessfully':payload?.kind!=='result'?'missing worker result':null),
    resources:{wall_ms:Number(process.hrtime.bigint()-t)/1e6,cpu_user_us:payload?.resources?.cpu_user_us??null,cpu_system_us:payload?.resources?.cpu_system_us??null,
     max_rss_kib:payload?.resources?.max_rss_kib??(sampledRss||null),rss_source:payload?.resources?'child resourceUsage':'sampled /proc VmHWM; lower bound if killed'},
    stdout,stderr,output_truncated:truncated,result:operational_status==='RETURNED'?payload.result:null});
  });
  child.send(request,error=>{if(error){child.kill('SIGKILL');}});
 });
}
module.exports={runChild};
