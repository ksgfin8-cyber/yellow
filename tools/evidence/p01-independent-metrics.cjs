// Independent P01 counter. Never imports tools/p01/metrics.cjs; never executes agents or replay.
const io=require('./io.cjs'),{canonical}=require('../p01/codec.cjs');
const AGENTS=['wait','random','rule','frontier_memory_v1'];
function countResources(trajectory){
 io.need(trajectory&&Array.isArray(trajectory.events),'INVALID_TRAJECTORY_EVENTS');
 return trajectory.events.filter(event=>event!==null&&event.type==='RESOURCE_CONSUMED'&&event.source==='action').length;
}
function summary(entries,{phase='development'}={}){
 io.need(['development','final'].includes(phase),'INVALID_ORACLE_PHASE');
 const seeds=phase==='development'?[1,2,3,4]:Array.from({length:32},(_,n)=>n+1001),errors=[],lookup=new Map(),attemptIds=new Set(),episodes=[];
 for(const row of entries){
  const k=`${row.seed}/${row.agent}/${row.repetition}`;
  if(!seeds.includes(row.seed)||!AGENTS.includes(row.agent)||![1,2].includes(row.repetition)){errors.push({key:k,kind:'UNEXPECTED_IDENTITY'});continue;}
  if(lookup.has(k)){errors.push({key:k,kind:'DUPLICATE_REQUEST'});continue;}lookup.set(k,row);
  const id=row.artifact?.operational?.attempt_id;if(id){if(attemptIds.has(id))errors.push({key:k,kind:'DUPLICATE_ATTEMPT'});attemptIds.add(id);}
  if(row.kind!=='COMPLETE'&&row.kind!=='INITIALIZATION_FAILURE')errors.push({key:k,kind:row.kind,detail:row.detail??null});
  if(row.kind==='COMPLETE'){const consumed=row.artifact.data.result.trajectory.events.filter(e=>e.type==='RESOURCE_CONSUMED'&&e.source==='action'),positions=consumed.map(e=>JSON.stringify(e.position));if(new Set(positions).size!==positions.length)errors.push({key:k,kind:'REPEATED_RESOURCE_CONSUMPTION_WITH_REGEN_ZERO'});}
  if(row.kind==='COMPLETE')episodes.push({seed:row.seed,agent:row.agent,repetition:row.repetition,count:countResources(row.artifact.data.result.trajectory)});
 }
 const pairs=[],controls=[],excluded=[];
 for(const seed of seeds){
  const batch=[];
  for(const agent of AGENTS){const a=lookup.get(`${seed}/${agent}/1`),b=lookup.get(`${seed}/${agent}/2`);
   for(const [r,repetition]of [[a,1],[b,2]])if(!r)errors.push({key:`${seed}/${agent}/${repetition}`,kind:'MISSING_ENTRY'});else batch.push(r);
   if(a?.artifact&&b?.artifact&&canonical(a.artifact.data)!==canonical(b.artifact.data))errors.push({key:`${seed}/${agent}`,kind:'REPETITION_MISMATCH'});
  }
  if(batch.length!==8)continue;
  if(batch.every(r=>r.kind==='INITIALIZATION_FAILURE')){
   const origins=batch.map(r=>r.artifact.data.result.failure_details);
   if(origins.some(o=>o.seed!==origins[0].seed||o.message!==origins[0].message))errors.push({seed,kind:'INITIALIZATION_ORIGIN_MISMATCH'});
   else excluded.push({seed,reason:'COMMON_INITIALIZATION_FAILURE_NO_REPLACEMENT'});continue;
  }
  if(batch.some(r=>r.kind==='INITIALIZATION_FAILURE'))errors.push({seed,kind:'INITIALIZATION_INCONSISTENT'});
  if(batch.some(r=>r.kind!=='COMPLETE'))continue;
  const initial=batch[0].artifact.data.result.trajectory.initial_state;
  if(batch.some(r=>canonical(r.artifact.data.result.trajectory.initial_state)!==canonical(initial)||r.initial_full_hex!==batch[0].initial_full_hex))errors.push({seed,kind:'INITIAL_WORLD_MISMATCH'});
  const c=agent=>countResources(lookup.get(`${seed}/${agent}/1`).artifact.data.result.trajectory);
  pairs.push({seed,frontier_memory_v1:c('frontier_memory_v1'),random:c('random'),difference:c('frontier_memory_v1')-c('random')});controls.push({seed,wait:c('wait'),rule:c('rule')});
 }
 let distribution=null;
 if(!errors.length&&pairs.length){
  const frequencies=new Map();let total=0,wins=0,ties=0,losses=0;
  for(const p of pairs){total+=p.difference;frequencies.set(p.difference,(frequencies.get(p.difference)||0)+1);if(p.difference>0)wins++;else if(p.difference<0)losses++;else ties++;}
  const sorted=[];for(const d of [...frequencies.keys()].sort((x,y)=>x-y))for(let i=0;i<frequencies.get(d);i++)sorted.push(d);
  const n=sorted.length;distribution={differences:pairs.map(p=>p.difference),sum:total,mean:total/n,median:(sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2,min:sorted[0],max:sorted[n-1],wins,ties,losses};
 }
 const evaluable=distribution!==null;
 return {format:'WL-P01-INDEPENDENT-METRICS-1',phase,status:evaluable?'EVALUABLE':'NOT_EVALUABLE',planned_attempts:seeds.length*8,observed_attempts:entries.length,eligible_pairs:pairs.length,episodes,pairs,descriptive_controls:controls,excluded_scenarios:excluded,errors,distribution,final_hypothesis:phase==='development'?'NOT_EVALUATED':evaluable?(distribution.sum>0?'H_PLUS_SUPPORTED':'H_PLUS_NOT_SUPPORTED'):'NOT_EVALUABLE'};
}
function recoveredEntries(packageRoot){
 const checked=io.verify(packageRoot);io.need(checked.state==='COPY_VERIFIED','COPY_ERROR');const pkg=checked.package;io.need(!pkg.latest.body.conflicts.some(c=>c.blocking&&c.file!=='analysis.json'),'CONFLICTING_EXPERIMENTAL_EVIDENCE');
 const read=file=>{io.name(file);const f=pkg.latest.body.files[file];io.need(f,'MISSING_EVIDENCE: '+file);return io.objectBytes(pkg.root,f.current);};
 const manifest=JSON.parse(read('campaign.json'));
 const phase=manifest.format==='WL-P01-CAMPAIGN-1'&&manifest.phase==='DEVELOPMENT_SMOKE'?'development':manifest.format==='WL-P01-EVALUATION-CAMPAIGN-1'?'final':null;io.need(phase,'UNKNOWN_CAMPAIGN_SCOPE');
 if(phase==='final')io.need(manifest.freeze_id==='47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d','FREEZE_ID_MISMATCH');
 const log=require('./preserve.cjs').parseLog(read('execution.jsonl'));io.need(!log.issues.length&&!log.tail&&log.attempts.every(a=>a.finish_line!==null),'INCOMPLETE_OPERATIONAL_LOG');
 io.need(Array.isArray(manifest.entries),'INVALID_MANIFEST_ENTRIES');
 const {archiveFor}=require('../p01/archive.cjs'),archive=phase==='development'?archiveFor():archiveFor(require('../p01/evaluation/profile.cjs'));
 const {loadRuntime}=require('../p01/runtime.cjs'),runtime=loadRuntime(),sources=require('../p01/provenance.cjs').snapshot();
 const entries=manifest.entries.map(row=>{
  const out={seed:row.seed,agent:row.agent,repetition:row.repetition,kind:'MISSING_EVIDENCE',artifact:null};
  try{
   out.kind='IDENTITY_INCONSISTENT';const k=`${row.seed}-${row.agent}-${row.repetition}`;io.need(row.file===k+'.wlx.gz','ARCHIVE_FILENAME_MISMATCH');
   const finish=log.attempts.find(a=>a.key===k)?.finish;io.need(finish&&finish.attempt_id===row.attempt_id&&finish.sha256===row.sha256&&finish.payload_sha256===row.payload_sha256,'MANIFEST_FINISH_MISMATCH');
   out.kind='MISSING_EVIDENCE';const bytes=read(row.file);out.kind='INVALID_EVIDENCE';io.need(bytes.length===row.bytes&&io.sha(bytes)===row.sha256,'ARCHIVE_HASH_MISMATCH');
   const a=archive.unpack(bytes);out.artifact=a;out.kind='IDENTITY_INCONSISTENT';io.need(canonical(a.provenance.implementation.sources)===canonical(sources),'FROZEN_SOURCE_PROVENANCE_MISMATCH');
   io.need(a.provenance.seeds.experiment===row.seed&&a.provenance.algorithm.id===row.agent&&a.operational.attempt_id===row.attempt_id&&a.operational.operational_status===row.operational_status&&archive.payloadDigest(a.data)===row.payload_sha256,'IDENTITY_OR_PAYLOAD_MISMATCH');
   if(a.operational.operational_status!=='RETURNED'){out.kind='EXECUTION_FAILURE';return out;}
   const r=a.data.result,proof=row.verification;
   out.kind='REPLAY_INVALID';io.need(canonical(finish.verification)===canonical(proof),'REPLAY_REPORT_MISMATCH');
   if(r.trajectory===null){io.need(r.status==='FAILED'&&r.failure_reason==='INITIALIZATION_ERROR'&&proof?.status==='INITIALIZATION_FAILURE_CONFIRMED','UNVERIFIED_INITIALIZATION_FAILURE');out.kind='INITIALIZATION_FAILURE';return out;}
   if(r.status!=='COMPLETED'){out.kind='AGENT_FAILURE';return out;}
   out.kind='REPLAY_INVALID';io.need(proof?.status==='COMPLETE_MATCH'&&proof.replay===true&&proof.states_verified===r.trajectory.steps.length+1&&proof.payload_sha256===row.payload_sha256,'INCOMPLETE_OR_INVALID_REPLAY_PROOF');
   out.initial_full_hex=Buffer.from(runtime.api.canonical_full_state_bytes(runtime.realm(r.trajectory.initial_state))).toString('hex');io.need(out.initial_full_hex===proof.initial_full_hex,'INITIAL_WLS1_PROOF_MISMATCH');
   out.kind='COMPLETE';
  }catch(e){out.detail=String(e);if(out.kind==='COMPLETE')out.kind='INVALID_EVIDENCE';}
  return out;
 });
 io.need(log.attempts.length===manifest.entries.length,'LOG_MANIFEST_COUNT_MISMATCH');return {phase,entries,read};
}
function calculate(packageRoot){
 try{const input=recoveredEntries(packageRoot),r=summary(input.entries,{phase:input.phase});r.verification_basis='STRUCTURAL_VALIDATION_AND_ARCHIVED_REPLAY_PROOFS_BOUND_TO_FILE_AND_PAYLOAD_HASHES; NO_NEW_REPLAY';return r;}
 catch(e){return {format:'WL-P01-INDEPENDENT-METRICS-1',status:'NOT_EVALUABLE',distribution:null,errors:[{kind:'INVALID_OR_MISSING_EVIDENCE',detail:String(e)}],final_hypothesis:'NOT_EVALUABLE'};}
}
if(require.main===module){const [root]=process.argv.slice(2);const r=calculate(root);console.log(JSON.stringify(r,null,2));if(r.status!=='EVALUABLE')process.exitCode=1;}
module.exports={countResources,summary,recoveredEntries,calculate};
