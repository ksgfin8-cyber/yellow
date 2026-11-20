'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os');
const protocol=require('../tools/titan-mvp-01/protocol.cjs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'titan-mvp01-tests-'));
function pure(){const ctx=vm.createContext({});for(const file of ['js/agents/agent.js','js/agents/titan_mvp_01.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);return {ctx,...vm.runInContext('({TitanMVP01Agent,selectTitanMVP01Mechanism})',ctx)};}
const copy=x=>structuredClone(x),ids=['M_N','M_E','M_S','M_W'];
const costs=a=>a.map((x,i)=>[ids[i],x]);
function feedback(representations=['BLOCKED','BLOCKED','BLOCKED','BLOCKED'],position={x:2,y:2},prior=null){
 const view=Array.from({length:3},()=>Array.from({length:3},()=>({representation:'BLOCKED',occupied:false})));view[1][1].representation='FREE';
 for(const [i,[y,x]] of [[0,1],[1,2],[2,1],[1,0]].entries())view[y][x].representation=representations[i];
 return {observation:{tick:0,self:{id:'0987898',position:{...position},energy:240},local_view:view},has_prior_action:prior!==null,last_action_result:prior};
}
const prior=events=>({validity:'VALID',reason:'NONE',energy_delta:-1,events});
function frozen(x){if(x&&typeof x==='object'){Object.values(x).forEach(frozen);Object.freeze(x);}return x;}
function technicalConfig(type='titan_mvp_01'){
 const c=protocol.config(1,type);return {...c,max_ticks:6,world_config:{...c.world_config,width:4,height:4,obstacle_density:0,resource_density:0.12}};
}
test('TITAN-01 pure selector: unique and tied mechanisms; explicit fixed priority independent of pair order',()=>{
 const {selectTitanMVP01Mechanism:s}=pure();const a=copy(s({costs:costs([5,0,3,4]),phi:1,L:2}));assert.equal(a.selected,'M_E');assert.equal(a.cap,0);assert.deepEqual(a.gaps,costs([5,0,3,4]));assert.equal(a.gapGlobal,5);
 const b=copy(s({costs:costs([0,0,4,5]).reverse(),phi:1,L:2}));assert.deepEqual(b.minimizers,['M_N','M_E']);assert.equal(b.selected,'M_N');
});
test('TITAN-02 NULL tie, unique NULL and phi0 membership do not invent a v0.1 threshold',()=>{
 const {selectTitanMVP01Mechanism:s}=pure();assert.deepEqual(copy(s({costs:costs([2,3,4,5]),phi:1,L:2})).minimizers,['M_N','NULL']);
 assert.deepEqual(copy(s({costs:costs([3,3,4,5]),phi:1,L:2})).minimizers,['NULL']);
 const zero=copy(s({costs:costs([0,1,3,5]),phi:0,L:2}));assert.equal(zero.cNull,0);assert.deepEqual(zero.minimizers,['M_N','NULL']);assert.equal(zero.selected,'M_N');
});
test('TITAN-03 selector boundaries: nonfinite/negative/coerced/empty/reserved/duplicates and invalid overflow inputs',()=>{
 const {selectTitanMVP01Mechanism:s}=pure(),valid={costs:costs([0,1,3,5]),phi:1,L:2};
 for(const value of [NaN,Infinity,-Infinity,-1,'0',true,null])assert.throws(()=>s({...valid,costs:costs([value,1,3,5])}));
 for(const phi of [NaN,Infinity,-1,1.1,'1',false])assert.throws(()=>s({...valid,phi}));
 for(const L of [0,-1,Infinity,NaN,'2'])assert.throws(()=>s({...valid,L}));
 assert.throws(()=>s({...valid,costs:[]}));assert.throws(()=>s({...valid,costs:[['NULL',0],...valid.costs.slice(1)]}));
 assert.throws(()=>s({...valid,costs:[['__proto__',0],...valid.costs.slice(1)]}));
 assert.throws(()=>s({...valid,costs:[valid.costs[0],valid.costs[0],...valid.costs.slice(2)]}));
 assert.throws(()=>s({...valid,L:Number.MAX_VALUE,phi:2}));assert.equal(s({...valid,L:Number.MAX_VALUE,phi:1}).cNull,Number.MAX_VALUE);
});
test('TITAN-04 finite-domain exhaustive invariants, gaps and minimizers across1875 inputs',()=>{
 const {selectTitanMVP01Mechanism:s}=pure(),values=[0,1,3,4,5];let checked=0;
 for(const n of values)for(const e of values)for(const south of values)for(const w of values)for(const phi of [0,0.5,1]){
  const c=[n,e,south,w],r=copy(s({costs:costs(c),phi,L:2})),all=[...c,2*phi],minimum=Math.min(...all),expected=[...ids,'NULL'].filter((_,i)=>all[i]===minimum);
  assert.deepEqual(r.minimizers,expected);assert.equal(r.selected,expected[0]);assert.equal(r.cap,Math.min(...c));assert.ok(r.gaps.every((p,i)=>p[1]===c[i]-r.cap&&p[1]>=0));
  if(phi===0)assert.ok(r.minimizers.includes('NULL'));if(r.cNull<r.cap)assert.deepEqual(r.minimizers,['NULL']);checked++;
 }assert.equal(checked,1875);
});
test('TITAN-05 resource N, unvisited FREE E, N/E tie and exact closed actions',()=>{
 const {TitanMVP01Agent:A}=pure();
 for(const [view,expected] of [[['RESOURCE','BLOCKED','BLOCKED','BLOCKED'],'MOVE_N'],[['BLOCKED','FREE','BLOCKED','BLOCKED'],'MOVE_E'],[['RESOURCE','RESOURCE','BLOCKED','BLOCKED'],'MOVE_N'],[['BLOCKED','BLOCKED','FREE','BLOCKED'],'MOVE_S'],[['BLOCKED','BLOCKED','BLOCKED','FREE'],'MOVE_W']]){
  const a=new A(),f=frozen(feedback(view)),before=copy(f),action=a.step(f);assert.deepEqual(copy(action),{type:expected});assert.deepEqual(f,before);assert.equal(a.getDiagnostic().phi_exp,1);
 }
});
test('TITAN-06 no local opportunity: hazard4, blocked/OOB5, NULL maps to WAIT',()=>{
 const a=new (pure().TitanMVP01Agent)();assert.deepEqual(copy(a.step(feedback(['BLOCKED','OUT_OF_BOUNDS','HAZARD','BLOCKED']))),{type:'WAIT'});
 const d=copy(a.getDiagnostic());assert.deepEqual(d.costs,costs([5,5,4,5]));assert.equal(d.cNull,0);assert.equal(d.phi_exp,0);assert.equal(d.selected,'NULL');
});
test('TITAN-07 RESOURCE_CONSUMED memory only from exposed previous events; consumed resource costs3',()=>{
 const a=new (pure().TitanMVP01Agent)();a.step(feedback(['RESOURCE','BLOCKED','BLOCKED','BLOCKED']));
 const event={type:'RESOURCE_CONSUMED',entity_id:'0987898',position:{x:2,y:1}};
 a.step(feedback(['BLOCKED','BLOCKED','FREE','FREE'],{x:2,y:1},prior([event])));
 assert.deepEqual(copy(a.step(feedback(['BLOCKED','RESOURCE','BLOCKED','BLOCKED'],{x:1,y:1},prior([{type:'ENTITY_MOVED',entity_id:'0987898',position:{x:1,y:1}}])))),{type:'WAIT'});
 const d=copy(a.getDiagnostic());assert.equal(d.costs[1][1],3);assert.deepEqual(d.state_projected.consumed,['2,1']);
 a.reset();assert.equal(a.getDiagnostic(),null);assert.equal(a.step(feedback(['BLOCKED','RESOURCE','BLOCKED','BLOCKED'],{x:1,y:1})).type,'MOVE_E');
});
test('TITAN-08 visited only from observed self, failed movement does not mark proposed destination; reset clears visits',()=>{
 const a=new (pure().TitanMVP01Agent)();a.step(feedback(['BLOCKED','FREE','BLOCKED','BLOCKED']));assert.deepEqual(copy(a.getDiagnostic().state_projected.visited),['2,2']);
 const rejected={validity:'INVALID',reason:'BLOCKED_CELL',energy_delta:0,events:[]};a.step(feedback(['BLOCKED','FREE','BLOCKED','BLOCKED'],{x:2,y:2},rejected));assert.deepEqual(copy(a.getDiagnostic().state_projected.visited),['2,2']);
 a.step(feedback(['BLOCKED','BLOCKED','FREE','BLOCKED'],{x:2,y:1}));assert.equal(a.getDiagnostic().costs[2][1],3);assert.equal(a.getDiagnostic().selected,'NULL');
 a.reset();assert.equal(a.step(feedback(['BLOCKED','BLOCKED','FREE','BLOCKED'],{x:2,y:1})).type,'MOVE_S');
});
test('TITAN-09 malformed input fails visibly before memory changes, no hidden-stock fallback or coercion',()=>{
 const a=new (pure().TitanMVP01Agent)();a.step(feedback());const before=copy(a.getDiagnostic());
 const bad=[];let f=feedback();f.observation.self.id='other';bad.push(f);f=feedback();f.observation.local_view=[];bad.push(f);f=feedback();f.observation.self.energy=NaN;bad.push(f);f=feedback();f.has_prior_action=1;bad.push(f);f=feedback();f.observation.local_view[0][1].representation='UNKNOWN';bad.push(f);f=feedback();f.observation.local_view[0][1].stock=1;bad.push(f);f=feedback();f.has_prior_action=true;f.last_action_result={events:[]};bad.push(f);f=feedback();f.observation.self.position.x=-1;bad.push(f);
 for(const x of bad){assert.throws(()=>a.step(x));assert.deepEqual(copy(a.getDiagnostic()),before);}
 const wrong=feedback(undefined,undefined,prior([{type:'RESOURCE_CONSUMED',entity_id:'0987898',position:{x:NaN,y:0}}]));assert.throws(()=>a.step(wrong));
});
test('TITAN-10 detached diagnostics and actions, BigInt tick, no host clock or Math.random in policy',()=>{
 const r=pure();vm.runInContext('Math.random=()=>{throw Error("forbidden random")};Date=class{constructor(){throw Error("forbidden clock")}}',r.ctx);
 const a=new r.TitanMVP01Agent(),f=feedback(['FREE','FREE','FREE','FREE']);f.observation.tick=1n;const action=a.step(f),d=a.getDiagnostic();d.state_projected.visited.push('secret');d.action.type='WAIT';action.type='WAIT';
 assert.equal(a.getDiagnostic().tick,1n);assert.equal(a.getDiagnostic().action.type,'MOVE_N');assert.equal(a.getDiagnostic().state_projected.visited.length,1);
});
test('TITAN-11 external factory uses fixed entity id; default registry remains unchanged',()=>{
 const r=require('../tools/titan-mvp-01/runtime.cjs').loadRuntime();assert.throws(()=>r.api.create_agent('titan_mvp_01',1));
 const a=r.run(technicalConfig());assert.equal(a.result.status,'COMPLETED');assert.deepEqual([...a.result.trajectory.initial_state.entities.keys()],['0987898']);assert.equal(a.config.agent_type,'titan_mvp_01');assert.equal(a.decisions.length,6);assert.equal(a.result.trajectory.steps.length,6);
 assert.ok(a.result.trajectory.steps.every(x=>Object.keys(x.action).join(',')==='type'));assert.equal(require('../tools/titan-mvp-01/verify.cjs').verifyEpisode(a).status,'COMPLETE_MATCH');
});
test('TITAN-12 repeat same seed/reset decisions/states/events/WLS1, diagnostic mode does not perturb semantics',()=>{
 const r=require('../tools/titan-mvp-01/runtime.cjs').loadRuntime(),c=technicalConfig(),a=r.run(c),b=r.run(c),silent=r.run(c,{diagnostics:false});
 assert.deepEqual(a,b);assert.deepEqual(a.result,silent.result);assert.deepEqual(a.wls1,silent.wls1);assert.equal(silent.decisions.length,0);
 assert.equal(require('../tools/titan-mvp-01/verify.cjs').verifyEpisode(silent,false).status,'COMPLETE_MATCH');
});
test('TITAN-13 disconnect: four original controllers use their own factory; same initial world and no TITAN state',()=>{
 const r=require('../tools/titan-mvp-01/runtime.cjs').loadRuntime(),a=r.run(technicalConfig());let creations=0;
 r.api.TitanMVP01Agent=class {constructor(){creations++;throw Error('must not construct TITAN for a control');}};
 for(const agent of ['wait','random','rule','frontier_memory_v1']){const b=r.run(technicalConfig(agent));assert.equal(b.result.status,'COMPLETED');assert.deepEqual(b.result.trajectory.initial_state,a.result.trajectory.initial_state);assert.deepEqual(b.wls1[0],a.wls1[0]);assert.equal(b.decisions.length,0);}assert.equal(creations,0);
});
test('TITAN-14 incompatible feedback/radius rejected before Experiment; development seed guard blocks all evaluation seeds',()=>{
 const r=require('../tools/titan-mvp-01/runtime.cjs').loadRuntime();let called=0;r.api.run_experiment=()=>{called++;};
 let c=technicalConfig();c.feedback_config.expose_events=false;assert.throws(()=>r.run(c));c=technicalConfig();c.world_config.observation_radius=2;assert.throws(()=>r.run(c));assert.equal(called,0);
 for(const seed of [0,5,1001,1032,...Array.from({length:12},(_,i)=>2001+i),'1',true]){assert.throws(()=>protocol.config(seed,'titan_mvp_01'));assert.throws(()=>r.run({...technicalConfig(),experiment_seed:seed}));}assert.equal(called,0);
});
test('TITAN-15 development plan12 and physical configuration match approved referenced protocol; no scientific mode',async()=>{
 const text=fs.readFileSync('docs/F6-A-pilot-protocol.md','utf8'),physical=JSON.parse(/```json\n([\s\S]*?)\n```/.exec(text)[1]);assert.deepEqual(protocol.physicalConfig(),physical);
 const plan=protocol.smokePlan();assert.equal(plan.length,12);plan.forEach(protocol.assertRequest);assert.equal(plan.filter(x=>x.agent==='titan_mvp_01').length,8);
 assert.throws(()=>protocol.assertRequest({...plan[0],evaluation:true}));await assert.rejects(require('../tools/titan-mvp-01/cli.cjs').main(['evaluate']));
});
test('TITAN-16 archive roundtrip preserves Maps/BigInt/binary64; corruption rejected; no overwrite',()=>{
 const archive=require('../tools/titan-mvp-01/archive.cjs'),artifact={m:new Map([['0987898',{x:1}]]),tick:2n,energy:-0,sidecar:{selected:'NULL'}},bytes=archive.pack(artifact);assert.deepEqual(archive.unpack(bytes),artifact);
 const corrupt=Buffer.from(bytes);corrupt[corrupt.length-6]^=1;assert.throws(()=>archive.unpack(corrupt));const file=path.join(temp,'archive.gz');archive.write(file,bytes);assert.throws(()=>archive.write(file,bytes));assert.deepEqual(archive.unpack(fs.readFileSync(file)),artifact);
});
test('TITAN-17 supervisor stops synthetic blocked process and then executes another technical process',async()=>{
 const {runChild}=require('../tools/p01/supervisor.cjs'),file=path.resolve('tools/titan-mvp-01/fixtures/control.cjs');
 const bad=await runChild(file,{mode:'hang'},{timeout_ms:200,heap_mib:64});assert.equal(bad.operational_status,'TIMEOUT');assert.equal(bad.result,null);
 const good=await runChild(file,{mode:'ok'},{timeout_ms:3000,heap_mib:64});assert.equal(good.operational_status,'RETURNED');assert.equal(good.result,'technical fixture only');
});
test('TITAN-18 provenance binds unchanged baseline/seven documents and all new code; output paths stay isolated',()=>{
 const id=require('../tools/titan-mvp-01/identity.cjs'),x=id.build(),file=path.join(temp,'candidate.json');fs.writeFileSync(file,JSON.stringify(x));assert.deepEqual(id.check(file),x);
 const sources=Object.keys(x.body.baseline).filter(f=>f.startsWith('docs/research/titan-mvp-01/'));assert.equal(sources.length,7);assert.equal(x.body.evaluation_120,'HOLD_NO_EXECUTION_ENTRY');
 assert.throws(()=>require('../tools/titan-mvp-01/controller.cjs').destination(path.join(id.ROOT,'unsafe')));
 console.log(JSON.stringify({technical_evidence:temp,baseline_files:Object.keys(x.body.baseline).length,development_candidate:x.freeze_id,scientific_evaluation_executed:false}));
});
