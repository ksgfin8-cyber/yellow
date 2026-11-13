// Pure P01 calculations. No WORLD access, RNG, host clocks or file I/O.
const {isDeepStrictEqual}=require('node:util');
const {canonical}=require('./codec.cjs');
const AGENTS=['wait','random','rule','frontier_memory_v1'],SEEDS=[1,2,3,4];
function need(x,message){if(!x)throw Error('metrics: '+message);}
function entity(state){need(state?.entities instanceof Map&&state.entities.size===1,'expected one entity');return state.entities.values().next().value;}
function measure(result){
 need(result&&['COMPLETED','FAILED'].includes(result.status),'invalid ExperimentResult');
 if(result.trajectory===null)return {kind:'INITIALIZATION_FAILURE',experiment_status:result.status,failure_reason:result.failure_reason};
 const t=result.trajectory,positions=new Set(),byPosition=new Map(),rejected=new Map();
 const visit=state=>{const p=entity(state).position;positions.add(`${p.x},${p.y}`);};visit(t.initial_state);
 for(const step of t.steps){visit(step.world_state);const r=step.action_result;
  if(r.validity!=='VALID'){const key=`${r.validity}/${r.reason}`;rejected.set(key,(rejected.get(key)||0)+1);}
 }
 let consumed=0;
 for(const event of t.events)if(event.source==='action'&&event.type==='RESOURCE_CONSUMED'){
  consumed++;const p=event.position,key=`${p.x},${p.y}`;byPosition.set(key,(byPosition.get(key)||0)+1);
 }
 const end=t.steps.length?t.steps[t.steps.length-1].world_state:t.initial_state;
 const duration=BigInt(end.time)-BigInt(t.initial_state.time);need(duration>=0n,'negative duration');
 return {kind:'EPISODE',experiment_status:result.status,failure_reason:result.failure_reason,resources_consumed:consumed,
  consumptions_by_position:Object.fromEntries([...byPosition].sort()),distinct_positions:positions.size,
  rejected_actions:Object.fromEntries([...rejected].sort()),steps:t.steps.length,
  duration_ticks:duration<=BigInt(Number.MAX_SAFE_INTEGER)?Number(duration):duration,termination_reason:t.termination_reason,
  initial_resource_count:t.initial_state.grid.flat().filter(c=>c.effect?.kind==='RESOURCE'&&c.effect.stock===1).length};
}
function compareCampaign(entries){
 need(Array.isArray(entries),'expected campaign entries');const errors=[],groups=new Map(),attempts=new Set(),rows=[];
 for(const entry of entries){
  const {seed,agent,repetition,artifact,verification}=entry;
  need(SEEDS.includes(seed)&&AGENTS.includes(agent)&&[1,2].includes(repetition),'only development campaign authorized');
  need(artifact.provenance.seeds.experiment===seed&&artifact.provenance.algorithm.id===agent,'entry/provenance mismatch');
  const key=`${seed}/${agent}/${repetition}`;need(!groups.has(key),'duplicate campaign entry');groups.set(key,entry);
  need(!attempts.has(artifact.operational.attempt_id),'duplicate operational attempt');attempts.add(artifact.operational.attempt_id);
  let metric=null;if(artifact.data.result!==null)metric=measure(artifact.data.result);
  rows.push({seed,agent,repetition,operational_status:artifact.operational.operational_status,metric});
  if(artifact.operational.operational_status!=='RETURNED')errors.push(key+': operational failure');
  if(!verification||!['COMPLETE_MATCH','INITIALIZATION_FAILURE_CONFIRMED'].includes(verification.status))errors.push(key+': incomplete verification');
  if(metric?.kind==='EPISODE'&&(metric.experiment_status!=='COMPLETED'||Object.values(metric.consumptions_by_position).some(n=>n>1)))errors.push(key+': invalid/incomplete P01 episode');
 }
 const excluded=[],pairs=[],controls=[];
 for(const seed of SEEDS){
  const batch=[];for(const agent of AGENTS)for(const repetition of [1,2]){
   const x=groups.get(`${seed}/${agent}/${repetition}`);if(!x)errors.push(`${seed}/${agent}/${repetition}: missing entry`);else batch.push(x);
  }
  if(batch.length!==8)continue;
  for(const agent of AGENTS){
   const a=groups.get(`${seed}/${agent}/1`),b=groups.get(`${seed}/${agent}/2`);
   if(canonical(a.artifact.data)!==canonical(b.artifact.data))errors.push(`${seed}/${agent}: repetition differs`);
  }
  const initialFailures=batch.filter(e=>e.artifact.data.result?.trajectory===null&&e.artifact.data.result?.failure_reason==='INITIALIZATION_ERROR'&&e.verification?.status==='INITIALIZATION_FAILURE_CONFIRMED');
  if(initialFailures.length===8){excluded.push({seed,reason:'common initialization failure; no replacement'});continue;}
  if(initialFailures.length){errors.push(seed+': inconsistent initialization');continue;}
  if(batch.some(e=>e.artifact.operational.operational_status!=='RETURNED'||e.artifact.data.result?.status!=='COMPLETED'||e.verification?.status!=='COMPLETE_MATCH'))continue;
  const reference=batch[0];
  for(const e of batch){
   if(!isDeepStrictEqual(e.artifact.data.result.trajectory.initial_state,reference.artifact.data.result.trajectory.initial_state)||e.verification.initial_full_hex!==reference.verification.initial_full_hex)errors.push(seed+': initial world differs');
  }
  const first=agent=>measure(groups.get(`${seed}/${agent}/1`).artifact.data.result).resources_consumed;
  pairs.push({seed,frontier_memory_v1:first('frontier_memory_v1'),random:first('random'),difference:first('frontier_memory_v1')-first('random')});
  controls.push({seed,wait:first('wait'),rule:first('rule')});
 }
 const differences=pairs.map(p=>p.difference),sum=differences.reduce((a,b)=>a+b,0),ordered=[...differences].sort((a,b)=>a-b),n=ordered.length;
 const technical=errors.length||!n?'NOT_EVALUABLE':'PASS';
 return {phase:'DEVELOPMENT_SMOKE',evaluation_authorized:false,evaluation_executed:false,final_hypothesis:'NOT_EVALUATED',
  technical_status:technical,errors,attempts:entries.length,planned_attempts:32,excluded_scenarios:excluded,eligible_pairs:n,
  rows,pairs,descriptive_controls:controls,distribution:technical==='PASS'?{differences,sum,mean:sum/n,median:n%2?ordered[(n-1)/2]:(ordered[n/2-1]+ordered[n/2])/2,
   min:ordered[0],max:ordered[n-1],wins:differences.filter(x=>x>0).length,ties:differences.filter(x=>x===0).length,losses:differences.filter(x=>x<0).length}:null};
}
module.exports={measure,compareCampaign};
