// Operational transport, not WLS1 or an amendment to canonical Trajectory.
const fs=require('node:fs'),zlib=require('node:zlib');
const {loadRuntime}=require('./runtime.cjs');
const {ENGINE_COMMIT,sha,provenance,parameters,assertSources}=require('./provenance.cjs');
const development=require('./protocol.cjs');
const {AGENTS,LIMITS,PROTOCOL_PATH}=development;
// Explicit operational scope; the default remains development-only.
function archiveFor({assertRequest,config}=development){
const {check,exact,canonical,encode,decode}=require('./codec.cjs');
const FORMAT='WL-P01-ARCHIVE-1',payloadDigest=data=>sha(canonical(data));
function createArtifact(request,execution,capturedProvenance=null){
 assertRequest(request);const operational=structuredClone(execution);delete operational.result;
 const p=capturedProvenance??provenance(request.seed,request.agent);assertSources(p);
 const a={format:FORMAT,provenance:p,operational,
  data:{config:config(request.seed,request.agent),result:structuredClone(execution.result)}};
 return validateArtifact(a);
}
function validateArtifact(a){
 check(exact(a,['format','provenance','operational','data'])&&a.format===FORMAT,'unsupported format/fields');
 const p=a.provenance,o=a.operational,d=a.data;
 check(exact(p,['engine_commit','implementation','algorithm','protocol','seeds','execution_mode','runtime'])&&p.engine_commit===ENGINE_COMMIT,'unsupported provenance/engine');
 check(exact(p.implementation,['commit','working_tree_clean','sources'])&&/^[a-f0-9]{40}$/.test(p.implementation.commit)&&typeof p.implementation.working_tree_clean==='boolean','invalid implementation identity');
 check(p.implementation.sources&&typeof p.implementation.sources==='object'&&Object.values(p.implementation.sources).every(h=>/^[a-f0-9]{64}$/.test(h)),'invalid source hashes');
 check(exact(p.algorithm,['id','version','file','sha256','parameters'])&&AGENTS.includes(p.algorithm.id),'invalid algorithm');
 check(exact(p.protocol,['id','version','path','sha256'])&&p.protocol.id==='P01'&&p.protocol.version==='1.0-proposed'&&p.protocol.path===PROTOCOL_PATH&&/^[a-f0-9]{64}$/.test(p.protocol.sha256),'invalid protocol');
 check(exact(p.seeds,['experiment','world','agent'])&&p.execution_mode==='WITH_AGENT','invalid seed/mode fields');
 check(exact(p.runtime,['node','platform','arch','cpu'])&&Object.values(p.runtime).every(v=>typeof v==='string'),'invalid runtime');
 check(exact(d,['config','result']),'invalid data fields');
 assertRequest({seed:p.seeds.experiment,agent:p.algorithm.id});
 const r=loadRuntime(),c=new r.api.ExperimentConfig(r.realm(d.config));
 const expected=config(p.seeds.experiment,p.algorithm.id);
 check(BigInt(d.config.max_ticks)===BigInt(expected.max_ticks),'max_ticks differs from P01');
 const actual={...d.config,max_ticks:expected.max_ticks};
 check(canonical(actual)===canonical(expected),'configuration differs from P01');
 check(p.seeds.world===r.api.derive_seed(c.experiment_seed,'world')&&p.seeds.agent===r.api.derive_seed(c.experiment_seed,c.agent_type),'inconsistent derived seeds');
 const file=p.algorithm.id==='frontier_memory_v1'?'js/agents/frontier_memory_agent.js':`js/agents/${p.algorithm.id}_agent.js`;
 check(p.algorithm.file===file&&p.algorithm.sha256===p.implementation.sources[file],'algorithm source mismatch');
 check(p.algorithm.version===(p.algorithm.id==='frontier_memory_v1'?'1':'baseline@'+ENGINE_COMMIT)&&canonical(p.algorithm.parameters)===canonical(parameters(p.algorithm.id)),'algorithm version/parameters mismatch');
 check(p.protocol.sha256===p.implementation.sources[p.protocol.path],'protocol source mismatch');
 check(exact(o,['attempt_id','started_at','finished_at','limits','operational_status','exit_code','signal','diagnostic','resources','stdout','stderr','output_truncated']),'invalid operational fields');
 check(typeof o.attempt_id==='string'&&o.attempt_id.length>0&&Number.isFinite(Date.parse(o.started_at))&&Number.isFinite(Date.parse(o.finished_at))&&Date.parse(o.finished_at)>=Date.parse(o.started_at),'invalid host times/identity');
 check(canonical(o.limits)===canonical(LIMITS),'limits differ from authorized pilot');
 check(['RETURNED','TIMEOUT','WORKER_ERROR'].includes(o.operational_status)&&typeof o.stdout==='string'&&typeof o.stderr==='string'&&typeof o.output_truncated==='boolean','invalid status/output');
 check((o.exit_code===null||Number.isInteger(o.exit_code))&&(o.signal===null||typeof o.signal==='string'),'invalid process result');
 check(exact(o.resources,['wall_ms','cpu_user_us','cpu_system_us','max_rss_kib','rss_source'])&&Number.isFinite(o.resources.wall_ms)&&o.resources.wall_ms>=0,'invalid resources');
 for(const k of ['cpu_user_us','cpu_system_us','max_rss_kib'])check(o.resources[k]===null||(Number.isFinite(o.resources[k])&&o.resources[k]>=0),'invalid resource counter');
 check(typeof o.resources.rss_source==='string','invalid resource source');
 if(o.operational_status!=='RETURNED'){
  check(d.result===null&&typeof o.diagnostic==='string'&&o.diagnostic.length>0,'operational failure invented result');
  if(o.operational_status==='TIMEOUT')check(o.signal==='SIGKILL'&&o.exit_code===null&&o.resources.wall_ms>=o.limits.timeout_ms,'inconsistent timeout');
  return a;
 }
 check(o.exit_code===0&&o.signal===null&&o.diagnostic===null,'inconsistent returned process');
 const result=r.realm(d.result);
 check(exact(result,['status','trajectory','failure_reason','failure_details'])&&['COMPLETED','FAILED'].includes(result.status),'invalid ExperimentResult');
 if(result.trajectory===null){
  check(result.status==='FAILED'&&result.failure_reason==='INITIALIZATION_ERROR'&&exact(result.failure_details,['seed','message','config'])&&result.failure_details.seed===p.seeds.world&&canonical(result.failure_details.config)===canonical(c),'invalid initialization failure');return a;
 }
 const t=result.trajectory;
 check(exact(t,['experiment_config','initial_state','steps','events','termination_reason','metadata'])&&r.api.validate_ExperimentConfig(t.experiment_config),'invalid Trajectory');
 check(canonical(t.experiment_config)===canonical(c),'trajectory/config mismatch');
 check(r.api.validate_WorldState(t.initial_state,c.world_config)&&BigInt(t.initial_state.time)===0n&&Array.isArray(t.steps)&&Array.isArray(t.events),'invalid initial state/lists');
 check(t.steps.length<=Number(c.max_ticks),'too many records');
 check(result.status==='COMPLETED'?(result.failure_reason===null&&result.failure_details===null&&['ENTITY_DIED','MAX_TICKS_REACHED'].includes(t.termination_reason)):(result.failure_reason==='AGENT_CONTRACT_ERROR'&&t.termination_reason==='AGENT_CONTRACT_ERROR'),'inconsistent canonical termination');
 check(t.events.every(e=>r.api.validate_RecordedEvent(e)),'invalid global RecordedEvent');
 for(const step of t.steps){
  check(r.api.validate_WorldState(step.world_state,c.world_config),'invalid recorded WorldState');
  let valid=false;try{valid=r.api.replay_record_structure(step,{world_config:c.world_config,feedback_config:c.feedback_config});}catch{}
  check(valid,'invalid StepRecord/context');
 }
 return a;
}
function pack(a){validateArtifact(a);const body=encode(a);return zlib.gzipSync(Buffer.from(JSON.stringify({format:FORMAT,body,sha256:sha(JSON.stringify(body))})),{level:9});}
function unpack(bytes){
 let raw,doc;try{raw=zlib.gunzipSync(bytes,{maxOutputLength:64*1024*1024}).toString('utf8');doc=JSON.parse(raw);}catch{throw Error('archive: invalid compressed JSON or operational size limit');}
 check(exact(doc,['format','body','sha256'])&&doc.format===FORMAT,'invalid framing');
 check(raw===JSON.stringify(doc),'noncanonical JSON framing');
 check(doc.sha256===sha(JSON.stringify(doc.body)),'checksum mismatch');return validateArtifact(decode(doc.body));
}
function writeArchive(file,a){
 const bytes=pack(a),temporary=file+'.partial';let created=false;
 try{const fd=fs.openSync(temporary,'wx');created=true;try{fs.writeFileSync(fd,bytes);}finally{fs.closeSync(fd);}fs.linkSync(temporary,file);}
 finally{if(created)fs.unlinkSync(temporary);}
 return {bytes:bytes.length,sha256:sha(bytes),payload_sha256:payloadDigest(a.data)};
}
function readArchive(file){return unpack(fs.readFileSync(file));}
function verifyArtifact(a){
 validateArtifact(a);assertSources(a.provenance);
 if(a.operational.operational_status!=='RETURNED')return {status:'OPERATIONAL_FAILURE_RECORDED',replay:false};
 const r=loadRuntime(),api=r.api,c=new api.ExperimentConfig(r.realm(a.data.config)),result=r.realm(a.data.result);
 let init;try{init=api.initialize_world(c.world_config,a.provenance.seeds.world);}catch(e){
  check(result.trajectory===null&&result.failure_reason==='INITIALIZATION_ERROR'&&e.reason==='invalid initial_position','initialization failure not reproduced');return {status:'INITIALIZATION_FAILURE_CONFIRMED',replay:false};
 }
 check(result.trajectory!==null,'claimed initialization failure but world initializes');const t=result.trajectory;
 check(api.replay_values_equal(t.initial_state,init.world_state),'initial world not generated by supplied seed');
 const initialHex=Buffer.from(api.canonical_full_state_bytes(t.initial_state)).toString('hex');
 check(initialHex===Buffer.from(api.canonical_full_state_bytes(init.world_state)).toString('hex'),'initial WLS1 bytes differ from generated world');
 const count=t.initial_state.entities.values().next().value.lifecycle==='DEAD'?1:0,events=t.events.slice(0,count),actions=t.steps.map(s=>s.action);
 const replay=api.replay_trajectory(t.initial_state,events,actions,c.world_config,c.feedback_config,t.steps.length,c.max_ticks,'WITH_AGENT');
 check(replay.status==='OK','replay did not complete');
 const context={world_config:c.world_config,feedback_config:c.feedback_config,initial_state:t.initial_state,initial_events:events,actions,expected_steps:t.steps.length,max_ticks:c.max_ticks,execution_mode:'WITH_AGENT'};
 check(api.validate_ReplayResult(replay,context),'invalid ReplayResult');
 const complete=result.status==='COMPLETED';
 if(complete)check(api.validate_replay(t,replay,c.world_config,'WITH_AGENT').status==='MATCH','trajectory replay mismatch');
 else check(api.replay_values_equal(replay.records,t.steps)&&api.replay_values_equal(replay.events,t.events),'agent failure prefix mismatch');
 const before=[t.initial_state,...t.steps.map(s=>s.world_state)],after=[t.initial_state,...replay.records.map(s=>s.world_state)];
 for(let i=0;i<before.length;i++)for(const method of ['canonical_world_state_bytes','canonical_full_state_bytes'])check(Buffer.from(api[method](before[i])).equals(Buffer.from(api[method](after[i]))),'WLS1 byte mismatch');
 return {status:complete?'COMPLETE_MATCH':'PREFIX_MATCH_EXTERNAL_AGENT_CAUSE_UNVERIFIED',replay:true,states_verified:before.length,initial_full_hex:initialHex,payload_sha256:payloadDigest(a.data)};
}
return {FORMAT,canonical,payloadDigest,createArtifact,validateArtifact,pack,unpack,writeArchive,readArchive,verifyArtifact};
}
module.exports={...archiveFor(),archiveFor};
