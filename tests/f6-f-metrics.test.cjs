const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const {countResources,summary,calculate,recoveredEntries}=require('../tools/evidence/p01-independent-metrics.cjs');
const {snapshot,watch}=require('../tools/evidence/preserve.cjs'),{restore,verify}=require('../tools/evidence/verify.cjs'),io=require('../tools/evidence/io.cjs');
const ORIGINAL=path.resolve(__dirname,'../docs/f6-e/smoke');
function event(x,source='action',type='RESOURCE_CONSUMED'){return {type,source,position:{x,y:0}};}
function manualEntries(frontier=1,random=2){
 // Minimal event/identity fixtures for arithmetic, not newly executed canonical episodes.
 return [1,2,3,4].flatMap(seed=>['wait','random','rule','frontier_memory_v1'].flatMap(agent=>[1,2].map(repetition=>{
  const n=agent==='random'?random:agent==='frontier_memory_v1'?frontier:0;
  return {seed,agent,repetition,kind:'COMPLETE',initial_full_hex:'SYNTHETIC_INITIAL_BYTES',artifact:{operational:{attempt_id:`fixture-${seed}-${agent}-${repetition}`},data:{result:{status:'COMPLETED',trajectory:{initial_state:{time:0,entities:new Map([['fixture',{position:{x:0,y:0},energy:240}]]),grid:[]},events:Array.from({length:n},(_,i)=>event(i+1))}}}}};
 })));
}
test('F6F-M01 independent event counts0,1,multiple; energy/grid and other event types are not consumption',()=>{
 assert.equal(countResources({events:[],grid:Array(100).fill('RESOURCE'),energy:9999}),0);
 assert.equal(countResources({events:[event(1)]}),1);assert.equal(countResources({events:[event(1),event(2),event(3)]}),3);
 assert.equal(countResources({events:[event(1,'lifecycle'),event(2,'action','ENTITY_MOVED'),event(3,'action','HAZARD_TRIGGERED')]}),0);
});
test('F6F-M02 negative difference remains valid; repetitions are not8 independent pairs',()=>{
 const e=manualEntries(1,2),before=structuredClone(e),r=summary(e);assert.equal(r.status,'EVALUABLE');assert.equal(r.eligible_pairs,4);assert.deepEqual(r.distribution,{differences:[-1,-1,-1,-1],sum:-4,mean:-1,median:-1,min:-1,max:-1,wins:0,ties:0,losses:4});assert.deepEqual(e,before);assert.equal(r.final_hypothesis,'NOT_EVALUATED');
});
test('F6F-M03 unequal repetitions invalidate the collection even if counts could be averaged',()=>{
 const e=manualEntries();e[1].artifact.data.result.trajectory.events=[event(8)];const r=summary(e);assert.equal(r.status,'NOT_EVALUABLE');assert.ok(r.errors.some(x=>x.kind==='REPETITION_MISMATCH'));assert.equal(r.distribution,null);
});
test('F6F-M04 absent episode cannot be silently excluded',()=>{
 const e=manualEntries();e.pop();const r=summary(e);assert.equal(r.status,'NOT_EVALUABLE');assert.ok(r.errors.some(x=>x.kind==='MISSING_ENTRY'));
});
test('F6F-M05 common initialization failure excludes only that scenario with no replacement',()=>{
 const e=manualEntries();for(const r of e.filter(x=>x.seed===1)){r.kind='INITIALIZATION_FAILURE';r.artifact.data.result={status:'FAILED',trajectory:null,failure_details:{seed:7,message:'invalid initial_position'}};}
 const r=summary(e);assert.equal(r.status,'EVALUABLE');assert.equal(r.eligible_pairs,3);assert.deepEqual(r.excluded_scenarios,[{seed:1,reason:'COMMON_INITIALIZATION_FAILURE_NO_REPLACEMENT'}]);
});
test('F6F-M06 duplicate attempt IDs and request identities are not double counted',()=>{
 let e=manualEntries();e[1].artifact.operational.attempt_id=e[0].artifact.operational.attempt_id;assert.equal(summary(e).status,'NOT_EVALUABLE');e=manualEntries();e.push(structuredClone(e[0]));assert.ok(summary(e).errors.some(x=>x.kind==='DUPLICATE_REQUEST'));
});
test('F6F-M07 agent/execution/replay failures remain distinct and non-evaluable',()=>{
 for(const kind of ['AGENT_FAILURE','EXECUTION_FAILURE','REPLAY_INVALID','MISSING_EVIDENCE']){const e=manualEntries();e[0].kind=kind;const r=summary(e);assert.equal(r.status,'NOT_EVALUABLE');assert.ok(r.errors.some(x=>x.kind===kind));}
});
test('F6F-M08 different initial worlds or inconsistent initialization origins are rejected',()=>{
 let e=manualEntries();e[0].artifact.data.result.trajectory.initial_state.time=1;assert.ok(summary(e).errors.some(x=>x.kind==='INITIAL_WORLD_MISMATCH'));
 e=manualEntries();for(const r of e.filter(x=>x.seed===1)){r.kind='INITIALIZATION_FAILURE';r.artifact.data.result={status:'FAILED',trajectory:null,failure_details:{seed:r.agent==='wait'?9:8,message:'invalid initial_position'}};}assert.ok(summary(e).errors.some(x=>x.kind==='INITIALIZATION_ORIGIN_MISMATCH'));
});
test('F6F-M09 full distribution, ties and median agree with manually calculated differences',()=>{
 const e=manualEntries(2,2);const desired=[-2,0,1,3];for(const r of e.filter(x=>x.agent==='frontier_memory_v1'))r.artifact.data.result.trajectory.events=Array.from({length:2+desired[r.seed-1]},(_,i)=>event(i+1));
 const d=summary(e).distribution;assert.deepEqual(d,{differences:desired,sum:2,mean:0.5,median:0.5,min:-2,max:3,wins:2,ties:1,losses:1});
});
test('F6F-M10 repeated resource position with regeneration0 is not a valid favorable score',()=>{
 const e=manualEntries();e[0].artifact.data.result.trajectory.events=[event(1),event(1)];const r=summary(e);assert.equal(r.status,'NOT_EVALUABLE');assert.ok(r.errors.some(x=>x.kind==='REPEATED_RESOURCE_CONSUMPTION_WITH_REGEN_ZERO'));
});
test('F6F-M11 progressive smoke preservation, interrupted START, watch, relocation, restoration and three-way comparison',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'f6-f-integration-')),source=path.join(root,'source'),pkg=path.join(root,'package'),moved=path.join(root,'transported'),restored=path.join(root,'restored');fs.mkdirSync(source);
 try{
  const lines=fs.readFileSync(path.join(ORIGINAL,'execution.jsonl'),'utf8').trimEnd().split('\n'),m=JSON.parse(fs.readFileSync(path.join(ORIGINAL,'campaign.json')));
  fs.writeFileSync(path.join(source,'execution.jsonl'),lines[0]+'\n');const first=snapshot(source,pkg);assert.equal(first.start_without_finish,1);assert.equal(first.source_state,'SOURCE_INCOMPLETE');
  fs.copyFileSync(path.join(ORIGINAL,m.entries[0].file),path.join(source,m.entries[0].file));fs.writeFileSync(path.join(source,'execution.jsonl'),lines.slice(0,3).join('\n')+'\n');
  const history=[];await watch(source,pkg,{intervalMs:100,passes:2,onSnapshot:r=>{history.push(r);if(history.length===1){assert.equal(r.finishes,1);assert.equal(r.start_without_finish,1);for(const file of fs.readdirSync(ORIGINAL))if(file!=='execution.jsonl')fs.copyFileSync(path.join(ORIGINAL,file),path.join(source,file));fs.writeFileSync(path.join(source,'execution.jsonl'),lines.join('\n')+'\n');}}});
  assert.equal(history[1].finishes,32);assert.equal(history[1].source_state,'SOURCE_COMPLETE');assert.equal(snapshot(source,pkg).new_index,false);fs.rmSync(source,{recursive:true});fs.renameSync(pkg,moved);
  const v=verify(moved);assert.equal(v.state,'COPY_VERIFIED');assert.equal(v.indexes,3);assert.equal(v.source_complete,true);const r=restore(moved,restored);assert.equal(r.restored_files,35);assert.equal(r.state,'COPY_VERIFIED');const earliest=io.load(restored).snapshots[0].document.body;assert.equal(earliest.start_without_finish.length,1);assert.ok(!io.objectBytes(restored,earliest.files['execution.jsonl'].current).toString().includes('FINISH'));
  for(const file of fs.readdirSync(ORIGINAL))assert.deepEqual(fs.readFileSync(path.join(restored,'files',file)),fs.readFileSync(path.join(ORIGINAL,file)));
  const independent=calculate(restored);assert.equal(independent.status,'EVALUABLE');assert.deepEqual(independent.distribution.differences,[8,12,14,11]);assert.equal(independent.distribution.sum,45);assert.equal(independent.distribution.mean,11.25);assert.equal(independent.distribution.median,11.5);
  // Only AFTER independent calculation, contrast archived aggregates and the old calculator.
  const archived=JSON.parse(fs.readFileSync(path.join(restored,'files','analysis.json'))),input=recoveredEntries(restored),existing=require('../tools/p01/metrics.cjs').compareCampaign(input.entries.map(e=>({seed:e.seed,agent:e.agent,repetition:e.repetition,artifact:e.artifact,verification:JSON.parse(io.objectBytes(restored,io.load(restored).latest.body.files['campaign.json'].current)).entries.find(r=>r.seed===e.seed&&r.agent===e.agent&&r.repetition===e.repetition).verification})));
  assert.deepEqual(independent.distribution,archived.distribution);assert.deepEqual(independent.distribution,existing.distribution);assert.deepEqual(independent.pairs,archived.pairs);assert.deepEqual(independent.descriptive_controls,archived.descriptive_controls);
  const decoded=require('../tools/p01/archive.cjs').readArchive(path.join(restored,'files',m.entries[0].file));assert.ok(decoded.data.result.trajectory.initial_state.entities instanceof Map);
  const guard=`const Module=require('node:module'),orig=Module._load,cp=require('node:child_process');for(const k of ['execFileSync','execSync','spawn','fork','spawnSync'])cp[k]=()=>{throw Error('oracle cannot launch processes')};Module._load=function(id,parent,...rest){const resolved=Module._resolveFilename(id,parent);if(resolved===${JSON.stringify(path.resolve(__dirname,'../tools/p01/metrics.cjs'))})throw Error('old metric import forbidden');const value=orig.call(this,id,parent,...rest);if(resolved===${JSON.stringify(path.resolve(__dirname,'../tools/p01/runtime.cjs'))}){const load=value.loadRuntime;return {...value,loadRuntime(){const r=load();r.run=()=>{throw Error('new episode forbidden')};for(const k of ['initialize_world','run_experiment','create_agent','replay_trajectory'])r.api[k]=()=>{throw Error('new world/agent/replay forbidden')};return r;}};}return value;};const r=require(${JSON.stringify(path.resolve(__dirname,'../tools/evidence/p01-independent-metrics.cjs'))}).calculate(${JSON.stringify(restored)});if(r.status!=='EVALUABLE')throw Error(JSON.stringify(r));console.log('INDEPENDENT_NO_WORLD_NO_AGENT_NO_REPLAY_NO_METRICS_IMPORT');`;
  const child=cp.spawnSync(process.execPath,['-e',guard],{encoding:'utf8'});assert.equal(child.status,0,child.stderr);assert.match(child.stdout,/INDEPENDENT_NO_WORLD/);
  const report={scenario:'F6F-M11',snapshots:3,closed_finishes:32,interrupted_start_preserved:true,objects_verified:v.objects_checked,restored_files:r.restored_files,source_removed_before_restore:true,all35_files_byte_identical:true,independent_distribution:independent.distribution,three_way_match:true,dependency_guard:child.stdout.trim(),evaluation_episodes:0};fs.writeFileSync('/tmp/f6-f-integration-evidence.json',JSON.stringify(report,null,2)+'\n');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('F6F-M12 aggregate file is not the oracle input and is never corrected automatically',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'f6-f-ignore-analysis-')),source=path.join(root,'source'),pkg=path.join(root,'package');fs.cpSync(ORIGINAL,source,{recursive:true});
 try{const wrong=JSON.stringify({distribution:{sum:999},fixture:'deliberately wrong'});fs.writeFileSync(path.join(source,'analysis.json'),wrong);snapshot(source,pkg);const r=calculate(pkg);assert.equal(r.status,'EVALUABLE');assert.equal(r.distribution.sum,45);assert.equal(fs.readFileSync(path.join(source,'analysis.json'),'utf8'),wrong);}finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('F6F-M13 actual missing artifact or invalid archived replay proof is not eligible',()=>{
 for(const which of ['missing','replay','hash']){const root=fs.mkdtempSync(path.join(os.tmpdir(),'f6-f-invalid-input-')),source=path.join(root,'source'),pkg=path.join(root,'package');fs.cpSync(ORIGINAL,source,{recursive:true});
  try{const manifest=JSON.parse(fs.readFileSync(path.join(source,'campaign.json')));if(which==='missing')fs.unlinkSync(path.join(source,manifest.entries[0].file));else if(which==='hash'){const file=path.join(source,manifest.entries[0].file),bytes=fs.readFileSync(file);bytes[0]^=1;fs.writeFileSync(file,bytes);}else{manifest.entries[0].verification.status='INCOMPLETE';fs.writeFileSync(path.join(source,'campaign.json'),JSON.stringify(manifest));const lines=fs.readFileSync(path.join(source,'execution.jsonl'),'utf8').trimEnd().split('\n').map(JSON.parse);lines[1].verification.status='INCOMPLETE';fs.writeFileSync(path.join(source,'execution.jsonl'),lines.map(x=>JSON.stringify(x)).join('\n')+'\n');}snapshot(source,pkg);const r=calculate(pkg);assert.equal(r.status,'NOT_EVALUABLE');assert.equal(r.distribution,null);assert.ok(r.errors.some(e=>e.kind===(which==='missing'?'MISSING_EVIDENCE':which==='hash'?'INVALID_EVIDENCE':'REPLAY_INVALID')));}finally{fs.rmSync(root,{recursive:true,force:true});}
 }
});
