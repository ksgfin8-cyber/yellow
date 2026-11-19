'use strict';
// Read recorded files only. Does not load/invoke WORLD, replay or workers.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),zlib=require('node:zlib'),crypto=require('node:crypto');
const [source,out,repo]=process.argv.slice(2);assert.ok(source&&out&&repo);
const est=require(path.join(repo,'tools/research/wl-rc1-r1-calibration/estimators.cjs'));
const codec=require(path.join(repo,'tools/p01/codec.cjs'));
const p=require(path.join(repo,'tools/research/wl-rc1-r1-calibration/plan.cjs'));
const verification=require(path.join(repo,'tools/research/wl-rc1-r1-calibration/verify.cjs')).verify(source);
assert.equal(verification.package_status,'COMPLETE');assert.equal(verification.samples,216);assert.equal(verification.errors,0);
fs.mkdirSync(out,{recursive:true});
const read=file=>JSON.parse(fs.readFileSync(file)),lines=file=>fs.readFileSync(file,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const data=path.join(source,'data'),attempts=lines(path.join(data,'attempts.jsonl')),starts=attempts.filter(x=>x.type==='START'),finishes=attempts.filter(x=>x.type==='FINISH');
const plan=p.plan();assert.equal(starts.length,24);assert.equal(finishes.length,24);
assert.equal(new Set(starts.map(x=>JSON.stringify(x.request.condition))).size,24);
const ns=x=>{assert.ok(/^\d+$/.test(String(x)));const y=Number(x);assert.ok(Number.isSafeInteger(y));return y;};
const stats=a=>({n:a.length,min:Math.min(...a),median:est.median(a),max:Math.max(...a)});
const stages=['PREPARE','INPUT_WITNESS','EXECUTE','OUTPUT_WITNESS','ENCODE','SERIALIZE','HASH','COMPRESS'];
const decoded=new Map(),witness=s=>{if(!decoded.has(s.witness_sha256)){const b=zlib.gunzipSync(fs.readFileSync(path.join(data,s.witness_sha256+'.json.gz')));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),s.witness_sha256);decoded.set(s.witness_sha256,codec.decode(JSON.parse(b)));}return decoded.get(s.witness_sha256);};
let within=0,cross=0,flags=0,sampleCount=0;const processes=[],raw=[];
for(let i=0;i<24;i++){
 const start=starts[i],finish=finishes[i];assert.equal(start.index,i);assert.equal(finish.index,i);assert.deepEqual(start.request.condition,plan[i]);assert.equal(finish.status,'COMPLETE');
 const records=lines(path.join(data,String(i).padStart(2,'0')+'.jsonl')),samples=records.filter(x=>x.type==='sample'),done=records.find(x=>x.type==='done'),cal=records.find(x=>x.type==='calibration');
 assert.equal(samples.length,9);assert.ok(done);assert.ok(!records.some(x=>['operation_error','fatal'].includes(x.type)));
 const base=witness(samples[0]);for(let k=1;k<samples.length;k++){assert.deepEqual(witness(samples[k]),base);within++;}
 const ipc=new Map(done.ipc_work_ns.map(x=>[x.call,ns(x.ipc_work_ns)]));
 for(const s of samples){const f=BigInt(s.api_ns)<10n*BigInt(cal.clock_median_ns);assert.equal(s.resolution_insufficient,f);flags+=Number(f);raw.push({worker:i,condition:plan[i],...s,ipc_callback_ns:ipc.get(`${s.phase}:${s.sample}`)});}
 sampleCount+=samples.length;const warm=samples.filter(x=>x.phase==='WARM');assert.equal(warm.length,5);
 const latency={};for(const phase of ['FIRST_MEASURED','WARMUP','WARM']){const ss=samples.filter(x=>x.phase===phase);latency[phase]={api_ns:stats(ss.map(x=>ns(x.api_ns))),wrapper_ns:stats(ss.map(x=>ns(x.wrapper_ns))),stages_ns:Object.fromEntries(stages.map(k=>[k,stats(ss.map(x=>ns(x.stage_work_ns[k])))])),ipc_callback_ns:stats(ss.map(x=>ipc.get(`${x.phase}:${x.sample}`)))};}
 const balance=est.timeBalance(samples,done,finish.wall_ns);assert.equal(balance.inconsistent_negative_residual,false);
 processes.push({index:i,condition:plan[i],status:finish.status,wall_ns:finish.wall_ns,samples:samples.length,warm_api_ns:warm.map(x=>ns(x.api_ns)),warm_wrapper_ns:warm.map(x=>ns(x.wrapper_ns)),latency,time_balance:balance,process_work_ns:done.process_work_ns,journal:done.journal,cpu_us:done.cpu_us,resources:done.resources,clock_median_ns:cal.clock_median_ns,resolution_flags:samples.filter(x=>x.resolution_insufficient).length,diagnostic_omitted_bytes:finish.diagnostic_omitted_bytes});
}
const groups=new Map();for(let i=0;i<24;i++){const c=plan[i],key=c.profile.id+'/'+c.operation+'/'+c.block;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}
for(const indexes of groups.values()){assert.equal(indexes.length,4);const refs=raw.filter(x=>x.worker===indexes[0]);for(const i of indexes.slice(1)){const other=raw.filter(x=>x.worker===i);for(let j=0;j<9;j++){assert.deepEqual(witness(other[j]),witness(refs[j]));cross++;}}}
const find=(cell,block,mode,j)=>processes.find(x=>x.condition.profile.id===cell.profile.id&&x.condition.operation===cell.operation&&x.condition.block===block&&x.condition.mode===mode&&x.condition.journal_policy===j);
const mode=[],journal=[];
for(const cell of p.CELLS)for(const block of [1,2]){
 for(const j of ['OFF','SYNC']){const a=find(cell,block,'MINIMAL',j),b=find(cell,block,'DETAILED',j);mode.push({profile:cell.profile.id,operation:cell.operation,block,journal_policy:j,order:block===1?'AB':'BA',wrapper:est.paired(a.warm_wrapper_ns,b.warm_wrapper_ns),api:est.paired(a.warm_api_ns,b.warm_api_ns)});}
 for(const m of ['MINIMAL','DETAILED']){const a=find(cell,block,m,'OFF'),b=find(cell,block,m,'SYNC');journal.push({profile:cell.profile.id,operation:cell.operation,block,mode:m,order:block===1?'OFF_SYNC':'SYNC_OFF',...est.journalEffect(a,b)});}
}
const balancedMode=[],balancedJournal=[];
for(const cell of p.CELLS){
 for(const j of ['OFF','SYNC']){const list=mode.filter(x=>x.profile===cell.profile.id&&x.journal_policy===j);balancedMode.push({profile:cell.profile.id,operation:cell.operation,journal_policy:j,blocks:list,...est.balanced(list.map(x=>({order:x.order,estimate:x.wrapper}))),api:est.balanced(list.map(x=>({order:x.order,estimate:x.api})))});}
 for(const m of ['MINIMAL','DETAILED']){const list=journal.filter(x=>x.profile===cell.profile.id&&x.mode===m);balancedJournal.push({profile:cell.profile.id,operation:cell.operation,mode:m,blocks:list,median_wall_percent:est.median(list.map(x=>x.wall_percent)),range_wall_percent:[Math.min(...list.map(x=>x.wall_percent)),Math.max(...list.map(x=>x.wall_percent))],median_warm_wrapper_percent:est.median(list.map(x=>x.warm_wrapper_percent)),range_warm_wrapper_percent:[Math.min(...list.map(x=>x.warm_wrapper_percent)),Math.max(...list.map(x=>x.warm_wrapper_percent))],any_block_diagnostic_exceeds_10_percent:list.some(x=>x.diagnostic_exceeds_10_percent),population_confidence_interval:null,causal_effect_established:false});}
}
const guardian=lines(path.join(source,'guardian.jsonl'));assert.ok(!guardian.some(x=>x.type==='STOP'));const closed=guardian.find(x=>x.type==='CLOSED');assert.ok(closed);
const allFiles=fs.readdirSync(source,{recursive:true}).filter(f=>fs.statSync(path.join(source,f)).isFile());
const bytes=allFiles.reduce((a,f)=>a+fs.statSync(path.join(source,f)).size,0),totalWall=finishes.reduce((a,x)=>a+ns(x.wall_ns),0);
const aggregateBalance={};for(const x of processes)for(const [k,v] of Object.entries(x.time_balance.ns))aggregateBalance[k]=String(BigInt(aggregateBalance[k]||'0')+BigInt(v));
const materialMode=mode.filter(x=>x.wrapper.diagnostic_exceeds_10_percent),materialAPI=mode.filter(x=>x.api.diagnostic_exceeds_10_percent),materialJournal=journal.filter(x=>x.diagnostic_exceeds_10_percent);
const summary={format:'WL-RC1-R1-CALIBRATION-ANALYSIS-1',analysis:'READ_ONLY_RECORDED_DATA_NO_NEW_WORLD',freeze_id:verification.freeze_id,status:'CALIBRATION_COMPLETE',verification,expected_workers:24,started_workers:24,complete_workers:24,failed_workers:0,censored_workers:0,omitted_workers:0,retries:0,expected_samples:216,samples:sampleCount,unique_decoded_witnesses:decoded.size,full_structural_within_worker_comparisons:within,full_structural_cross_treatment_comparisons:cross,WLS1_byte_array_comparisons:(within+cross)*4,structural_mismatches:0,resolution_flags:flags,guardian_stops:0,max_sampled_aggregate_rss_bytes:closed.max_rss_bytes,worker_wall_ns:stats(finishes.map(x=>ns(x.wall_ns))),worker_wall_ns_sum:String(totalWall),aggregate_worker_balance_ns:aggregateBalance,aggregate_worker_balance_proportions:Object.fromEntries(Object.entries(aggregateBalance).map(([k,v])=>[k,Number(v)/totalWall])),file_count:allFiles.length,archive_bytes:bytes,margins:{max_worker_le_15s:Math.max(...finishes.map(x=>ns(x.wall_ns)))<=15e9,peak_rss_le_0_8GiB:closed.max_rss_bytes<=0.8*2**30,archive_le_32MiB:bytes<=32*2**20},modality_wrapper_pairs_flagged_over10:materialMode.length,modality_api_pairs_flagged_over10:materialAPI.length,journal_pairs_flagged_over10:materialJournal.length,per_factor_block_comparisons:12,first_budget_limit_observed:null,coverage:'3 of 32 profile/operation cells; P1/tick,P3/observation,P7/record_append; two process blocks; no population inference',next_R1_gate:'NO_GO_PILOT128_CURRENT_EXECUTOR',reasons:['Material diagnostic perturbation requires review under preregistered protocol; report every sign/order separately.','AUD-C01 still affects the frozen128 executor; correction here does not backport itself.','Unmeasured cells (including replay/radius/aspect extremes) retain budget/measurement uncertainty.'],RC1_E:'HOLD',global_conformity:'NOT_ESTABLISHED'};
for(const [name,value] of Object.entries({'summary.json':summary,'processes.json':processes,'samples.json':raw,'modality.json':mode,'journal-perturbation.json':journal,'balanced-modality.json':balancedMode,'balanced-journal.json':balancedJournal}))fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(summary,null,2));
