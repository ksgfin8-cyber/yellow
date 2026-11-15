const fs=require('fs'),path=require('path'),zlib=require('zlib'),assert=require('assert/strict');
const {decode,canonical}=require('/workspace/yellow/tools/p01/codec.cjs');
const root=path.join(process.env.P01_RESTORED,'files'),out=process.env.P01_E4;
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f))),manifest=read('campaign.json'),archived=read('analysis.json'),oracle=JSON.parse(fs.readFileSync(path.join(out,'independent-metrics.json')));
const rows=[],differences=[],repetitions=[],initialWorlds=[],lookup=new Map(),errors=[];let seed=null,reference=null,prior=new Map();
const need=(v,detail)=>{if(!v)errors.push(detail);};
for(const entry of manifest.entries){
 const frame=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,entry.file))));const a=decode(frame.body),result=a.data.result,t=result?.trajectory;
 need(a.operational.operational_status==='RETURNED'&&result?.status==='COMPLETED'&&t!==null,{...entry,kind:'NON_COMPLETE_ATTEMPT'});
 if(!t)continue;
 const positions=new Set(),byPosition={},rejected={};
 const states=[t.initial_state,...t.steps.map(s=>s.world_state)];
 for(const state of states){const entities=[...state.entities.values()];need(entities.length===1,{seed:entry.seed,kind:'ENTITY_COUNT'});const p=entities[0].position;positions.add(`${p.x},${p.y}`);}
 for(const step of t.steps){const r=step.action_result;if(r.validity!=='VALID'){const k=`${r.validity}/${r.reason}`;rejected[k]=(rejected[k]||0)+1;}}
 let consumed=0;for(const event of t.events)if(event.type==='RESOURCE_CONSUMED'&&event.source==='action'){consumed++;const k=`${event.position.x},${event.position.y}`;byPosition[k]=(byPosition[k]||0)+1;}
 need(Object.values(byPosition).every(n=>n===1),{seed:entry.seed,agent:entry.agent,repetition:entry.repetition,kind:'REPEATED_CONSUMPTION'});
 let initialResources=0;for(const line of t.initial_state.grid)for(const cell of line)if(cell.effect?.kind==='RESOURCE'&&cell.effect.stock===1)initialResources++;
 const duration=BigInt(states.at(-1).time)-BigInt(t.initial_state.time);
 const metric={kind:'EPISODE',experiment_status:result.status,failure_reason:result.failure_reason,resources_consumed:consumed,consumptions_by_position:byPosition,distinct_positions:positions.size,rejected_actions:rejected,steps:t.steps.length,duration_ticks:Number(duration),termination_reason:t.termination_reason,initial_resource_count:initialResources};
 const row={seed:entry.seed,agent:entry.agent,repetition:entry.repetition,operational_status:a.operational.operational_status,metric};rows.push(row);
 const old=archived.rows[rows.length-1];need(canonical(row)===canonical(old),{seed:entry.seed,agent:entry.agent,repetition:entry.repetition,kind:'DESCRIPTOR_MISMATCH',expected:old,observed:row});
 const count=oracle.episodes.find(x=>x.seed===entry.seed&&x.agent===entry.agent&&x.repetition===entry.repetition);need(count?.count===consumed,{seed:entry.seed,kind:'ORACLE_COUNT_MISMATCH'});
 if(seed!==entry.seed){seed=entry.seed;reference=canonical(t.initial_state);prior=new Map();}
 need(canonical(t.initial_state)===reference,{seed,agent:entry.agent,repetition:entry.repetition,kind:'INITIAL_STRUCTURE_MISMATCH'});
 if(entry.repetition===1)prior.set(entry.agent,canonical(a.data));else{const equal=prior.get(entry.agent)===canonical(a.data);repetitions.push({seed,agent:entry.agent,equal});need(equal,{seed,agent:entry.agent,kind:'REPETITION_MISMATCH'});}
 initialWorlds.push({seed,agent:entry.agent,repetition:entry.repetition,structural_match:canonical(t.initial_state)===reference});
 lookup.set(`${entry.seed}/${entry.agent}/${entry.repetition}`,consumed);
}
const pairs=[],controls=[];
for(let seed=1001;seed<=1032;seed++){const f=lookup.get(`${seed}/frontier_memory_v1/1`),r=lookup.get(`${seed}/random/1`);pairs.push({seed,frontier_memory_v1:f,random:r,difference:f-r});controls.push({seed,wait:lookup.get(`${seed}/wait/1`),rule:lookup.get(`${seed}/rule/1`)});}
const ds=pairs.map(p=>p.difference),ordered=[...ds].sort((a,b)=>a-b),sum=ds.reduce((a,b)=>a+b,0);
const distribution={differences:ds,sum,mean:sum/ds.length,median:(ordered[15]+ordered[16])/2,min:ordered[0],max:ordered[31],wins:ds.filter(x=>x>0).length,ties:ds.filter(x=>x===0).length,losses:ds.filter(x=>x<0).length};
for(const [field,actual]of Object.entries({pairs,descriptive_controls:controls,distribution,excluded_scenarios:[]})){need(canonical(actual)===canonical(archived[field]),{field,kind:'ARCHIVED_AGGREGATE_MISMATCH',expected:archived[field],observed:actual});need(canonical(actual)===canonical(oracle[field]),{field,kind:'ORACLE_AGGREGATE_MISMATCH',expected:oracle[field],observed:actual});}
need(rows.length===256&&repetitions.length===128&&initialWorlds.length===256,{kind:'COUNT_MISMATCH'});
const result={status:errors.length?'HOLD':'PASS',calculation:'DIRECT_FROM_RESTORED_TRAJECTORIES; NO_IMPORT_OF_tools/p01/metrics.cjs',rows,repetitions,initial_worlds:initialWorlds,pairs,descriptive_controls:controls,distribution,errors,excluded_scenarios:[],eligible_pairs:pairs.length,final_hypothesis:errors.length?'NOT_EVALUABLE':sum>0?'H_PLUS_SUPPORTED':'H_PLUS_NOT_SUPPORTED',C2:'HOLD_EXTERNAL_BACKUP_PENDING',E5:'NOT_PERFORMED'};
fs.writeFileSync(path.join(out,'independent-descriptors.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(out,'paired-results.csv'),'seed,frontier_memory_v1,random,difference,rule,wait\n'+pairs.map((p,i)=>[p.seed,p.frontier_memory_v1,p.random,p.difference,controls[i].rule,controls[i].wait].join(',')).join('\n')+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,rows:rows.length,repetitions:repetitions.length,eligible_pairs:pairs.length,distribution,errors:errors.length}));if(errors.length)process.exitCode=1;
