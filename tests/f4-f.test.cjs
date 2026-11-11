// Independent audit: manual inputs and Buffer/BigInt oracles; not T01–T280.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),MAX=(1n<<64n)-1n,SAFE=BigInt(Number.MAX_SAFE_INTEGER);
const copy=x=>structuredClone(x),canonical=t=>BigInt(t)<=SAFE?Number(t):BigInt(t);
function load(){const ctx=vm.createContext({});for(const [,p] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
 if(p==='js/main.js'||p.includes('/visualization/'))continue;vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),ctx,{filename:p});
 }vm.runInContext('Math.random=()=>{throw Error("forbidden randomness");};',ctx);
 return {ctx,...vm.runInContext('({World,WorldState,WorldConfig,FeedbackConfig,ExperimentConfig,PRNG,Recorder,RecordTransaction,execute_tick_transaction,determine_termination,replay_trajectory,validate_ReplayResult,validate_replay_continuity,validate_replay,canonical_world_state_bytes,canonical_full_state_bytes,STATE_HASH_WORLD,STATE_HASH_FULL,run_experiment,run_without_agent})',ctx)};
}
function fixture(a=load(),time=7,mode='WITHOUT_AGENT',energy=10,lifecycle='ACTIVE'){
 a.ctx.inputTime=time;a.ctx.inputEnergy=energy;a.ctx.inputLife=lifecycle;
 const c=vm.runInContext(`(()=>{
 const world_config=new WorldConfig({width:2,height:1,topology:'BOUNDED',obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:1,wait_cost:1,resource_effect:4,hazard_damage:3,resource_regeneration:0,death_threshold:0,observation_radius:0});
 const feedback_config=new FeedbackConfig({expose_validity:true,expose_reason:false,expose_events:false,expose_energy_delta:true});
 const initial_state=new WorldState(inputTime,[[{traversal:'FREE',effect:null},{traversal:'FREE',effect:null}]],new Map([['é😀',{id:'é😀',position:{x:0,y:0},energy:inputEnergy,lifecycle:inputLife}]]),0x12345678,world_config);
 return {world_config,feedback_config,initial_state,initial_events:[],actions:[{type:'WAIT'}],expected_steps:1,max_ticks:0xffffffffffffffffn};})()`,a.ctx);
 c.execution_mode=mode;return {a,c};
}
function replay({a,c}){return a.replay_trajectory(c.initial_state,c.initial_events,c.actions,c.world_config,c.feedback_config,c.expected_steps,c.max_ticks,c.execution_mode);}
function oracle(state,full){const u32=n=>{const b=Buffer.alloc(4);b.writeUInt32BE(n);return b;},t=Buffer.alloc(8);t.writeBigUInt64BE(BigInt(state.time));
 const parts=[Buffer.from('WLS1'),t,u32(2),u32(1)];
 for(const cell of state.grid[0])parts.push(Buffer.from([cell.traversal==='FREE'?0:1,cell.effect===null?0:cell.effect.kind==='RESOURCE'?1:2,cell.effect?.kind==='RESOURCE'?cell.effect.stock:0]));
 parts.push(u32(1));for(const e of state.entities.values()){const id=Buffer.from(e.id,'utf8'),energy=Buffer.alloc(8);energy.writeDoubleBE(e.energy===0?0:e.energy);parts.push(u32(id.length),id,u32(e.position.x),u32(e.position.y),energy,Buffer.from([e.lifecycle==='ACTIVE'?0:1]));}
 if(full)parts.push(u32(state.rng_state));const bytes=Buffer.concat(parts);let h=2166136261n;for(const b of bytes)h=((h^BigInt(b))*16777619n)&0xffffffffn;return {bytes,hash:Number(h)};
}
function expectedWait(state){const next=copy(state);next.time=typeof state.time==='bigint'?BigInt(state.time)+1n:canonical(BigInt(state.time)+1n);const e=next.entities.values().next().value;e.energy-=1;if(e.energy<=0)e.lifecycle='DEAD';return next;}
function verifyBytes(a,state){for(const [full,name,hash] of [[false,'canonical_world_state_bytes','STATE_HASH_WORLD'],[true,'canonical_full_state_bytes','STATE_HASH_FULL']]){const x=oracle(state,full);assert.deepEqual(Buffer.from(a[name](state)),x.bytes);assert.equal(a[hash](state),x.hash);}}
function watch(a){a.ctx.transitions=0;vm.runInContext('const auditTick=execute_tick_transaction;execute_tick_transaction=(...args)=>{transitions++;return auditTick(...args);};',a.ctx);return()=>a.ctx.transitions;}

test('F4F-01 manual WAIT state, context and complete byte/hash oracle near temporal boundaries',()=>{
 for(const start of [0,7n,SAFE-1n,SAFE,SAFE+1n,MAX-2n])for(const mode of ['WITH_AGENT','WITHOUT_AGENT']){
  const f=fixture(load(),start,mode),before=copy(f.c.initial_state);f.c.actions=[{type:'WAIT'},{type:'WAIT'}];f.c.expected_steps=2;
  const r=replay(f);assert.equal(r.status,'OK');let expected=before;
  for(let i=0;i<2;i++){const previous=expected;expected=expectedWait(previous);const step=r.records[i];assert.deepEqual(copy(step.world_state),expected);assert.deepEqual(copy(step.entity_states),expected.entities);assert.equal(step.tick,canonical(BigInt(start)+BigInt(i)+1n));
   assert.deepEqual(copy(step.action_result),{validity:'VALID',reason:'NONE',energy_delta:-1,events:[]});assert.equal(step.state_hash_world,oracle(expected,false).hash);assert.equal(step.state_hash_full,oracle(expected,true).hash);verifyBytes(f.a,step.world_state);
   const observation={tick:canonical(previous.time),self:{id:'é😀',position:{x:0,y:0},energy:previous.entities.get('é😀').energy},local_view:[[{representation:'FREE',occupied:false}]]};
   assert.deepEqual(copy(step.observation),mode==='WITH_AGENT'?observation:null);
   if(mode==='WITH_AGENT'){assert.deepEqual(copy(step.feedback.observation),observation);assert.equal(step.feedback.has_prior_action,i>0);assert.deepEqual(copy(step.feedback.last_action_result),i===0?null:{validity:'VALID',reason:null,energy_delta:-1,events:[]});}
   else assert.equal(step.feedback,null);
  }
  assert.deepEqual(copy(f.c.initial_state),before);assert.equal(f.a.validate_ReplayResult(r,f.c),true);assert.equal(f.a.validate_replay_continuity(r,f.c),true);
 }
});
test('F4F-02 independent terminal table at positive origins, with zero-step invariant',()=>{
 for(const life of ['ACTIVE','DEAD'])for(const limited of [false,true])for(const n of [0,1]){
  const f=fixture(load(),9,'WITHOUT_AGENT',life==='DEAD'?0:10,life);f.c.max_ticks=limited?9:10;f.c.expected_steps=n;const r=replay(f);
  const terminal=life==='DEAD'?'ENTITY_DIED':limited?'MAX_TICKS_REACHED':null;
  assert.equal(r.status,n===0?'OK':terminal==='ENTITY_DIED'?'EARLY_TERMINATION':terminal==='MAX_TICKS_REACHED'?'MAX_TICKS_REACHED':'OK');
  if(n===0||terminal!==null){assert.equal(r.executed,0);assert.deepEqual(copy(r.final_state),copy(f.c.initial_state));assert.deepEqual(copy(r.events),[]);}
  assert.equal(f.a.validate_ReplayResult(r,f.c),true);
 }
});
test('F4F-03 manual resource/hazard oracle and contiguous local event sequence',()=>{
 for(const kind of ['RESOURCE','HAZARD']){const f=fixture(load(),7,'WITH_AGENT');f.c.initial_state.grid[0][1].effect=kind==='RESOURCE'?{kind,stock:1}:{kind};f.c.actions=[{type:'MOVE_E'},{type:'MOVE_W'}];f.c.expected_steps=2;
  const before=copy(f.c.initial_state),r=replay(f);assert.equal(r.status,'OK');
  assert.deepEqual(Array.from(r.events,e=>[e.type,e.tick,e.source,e.sequence]),[['ENTITY_MOVED',8,'action',0],[kind==='RESOURCE'?'RESOURCE_CONSUMED':'HAZARD_TRIGGERED',8,'action',1],['ENTITY_MOVED',9,'action',2]]);
  assert.equal(r.records[0].world_state.entities.get('é😀').energy,kind==='RESOURCE'?13:6);assert.equal(r.final_state.entities.get('é😀').energy,kind==='RESOURCE'?12:5);
  if(kind==='RESOURCE')assert.equal(r.final_state.grid[0][1].effect.stock,0);
  verifyBytes(f.a,r.final_state);assert.deepEqual(copy(f.c.initial_state),before);
  const last=copy(r.final_state);r.records[0].world_state.entities.clear();assert.deepEqual(copy(r.final_state),last);
 }
});
test('F4F-04 binary64 zero/subnormal and historical uint64 serialization oracle',()=>{
 for(const time of [0,1,123456789,SAFE,MAX])for(const energy of [-0,Number.MIN_VALUE,Math.PI]){const f=fixture(load(),time,'WITHOUT_AGENT',energy);verifyBytes(f.a,f.c.initial_state);}
});
test('F4F-05 combinatorial invalid requests, independent counters, precedence and zero transitions',()=>{
 const badExpected=[-1,1.5,NaN,Infinity,'3',null,undefined,true,3n,SAFE+1n,{},Symbol('x')];
 const badMax=[-1,1.5,NaN,Infinity,'3',null,undefined,true,-1n,MAX+1n,Number(SAFE+1n),{}];
 const f=fixture(),calls=watch(f.a);let tested=0;
 for(const e of badExpected)for(const m of badMax){const c={...f.c,expected_steps:e,max_ticks:m};const r=replay({a:f.a,c});assert.equal(r.status,'INVALID_REPLAY_INPUT');assert.equal(r.expected_steps_used,null);assert.equal(r.max_ticks_used,null);assert.equal(r.error_message,'invalid expected_steps');assert.equal(r.unused_actions,1);assert.equal(f.a.validate_ReplayResult(r,c),true);tested++;}
 assert.equal(tested,144);assert.equal(calls(),0);
 for(const m of [0,7n,SAFE+1n,MAX]){const c={...f.c,world_config:{},expected_steps:-1,max_ticks:m};const r=replay({a:f.a,c});assert.equal(r.max_ticks_used,canonical(m));assert.equal(r.error_message,'invalid world_config');assert.equal(f.a.validate_ReplayResult(r,c),true);}
 assert.equal(calls(),0);
});
test('F4F-06 staged multiple-error precedence and malformed/sparse action lists',()=>{
 const f=fixture(),calls=watch(f.a);
 const faults=[['world_config',{},'invalid world_config'],['feedback_config',{},'invalid feedback_config'],['initial_state',{},'invalid initial_state'],['initial_events',[{}],'invalid initial_events'],['actions',[{type:1}],'invalid action structure'],['expected_steps',-1,'invalid expected_steps'],['max_ticks',-1,'invalid max_ticks'],['execution_mode','bad','invalid action structure']];
 for(let i=0;i<faults.length;i++){const c={...f.c};for(let j=i;j<faults.length;j++)c[faults[j][0]]=faults[j][1];const r=replay({a:f.a,c});assert.equal(r.error_message,faults[i][2]);assert.equal(f.a.validate_ReplayResult(r,c),true);}
 for(const actions of [null,{},new Array(2),[{type:'WAIT',extra:1}]]){const r=replay({a:f.a,c:{...f.c,actions}});assert.equal(r.unused_actions,0);assert.equal(r.status,'INVALID_REPLAY_INPUT');}
 assert.equal(calls(),0);
});
test('F4F-07 positive segments unknown/incomplete statuses and rollback after a committed append',()=>{
 const f=fixture();for(const [actions,status] of [[[],'INCOMPLETE_ACTION_SEQUENCE'],[[{type:'UNKNOWN'}],'UNKNOWN_ACTION']]){const c={...f.c,execution_mode:'WITH_AGENT',actions};const r=replay({a:f.a,c});assert.equal(r.status,status);assert.equal(r.executed,0);assert.deepEqual(copy(r.final_state),copy(c.initial_state));}
 f.c.actions=[{type:'WAIT'},{type:'WAIT'}];f.c.expected_steps=2;const old=f.a.Recorder.prototype.record_step;let reached=0;
 f.a.Recorder.prototype.record_step=function(...args){old.apply(this,args);if(++reached===2)throw Error('after commit');};
 const r=replay(f);assert.equal(reached,2);assert.equal(r.status,'EXECUTION_ERROR');assert.equal(r.executed,1);assert.deepEqual(copy(r.final_state),expectedWait(f.c.initial_state));assert.equal(r.records.length,1);
});
test('F4F-08 no hidden generation/lifecycle/sync/RNG, and exact rejection of overflow',()=>{
 const f=fixture(load(),MAX-1n);for(const method of ['initialize','_generate_grid','_choose_initial_position'])f.a.World.prototype[method]=()=>assert.fail(method);
 f.a.PRNG.prototype.next=()=>assert.fail('RNG draw');let sync=0,life=0;for(const key of ['sync_rng_state','resolve_lifecycle']){const old=f.a.World.prototype[key];f.a.World.prototype[key]=function(...args){key==='sync_rng_state'?sync++:life++;return old.apply(this,args);};}
 const r=replay(f);assert.equal(r.final_state.time,MAX);assert.equal(sync,1);assert.equal(life,1);assert.equal(r.final_state.rng_state,0x12345678);
 const w=new f.a.World(f.c.world_config);w.state=r.final_state.copy();w.experimental_entity_id='é😀';w.rng=new f.a.PRNG(0x12345678);const before=copy(w.state);
 assert.throws(()=>f.a.execute_tick_transaction(w,{type:'WAIT'},MAX),{message:'world transition failed'});assert.deepEqual(copy(w.state),before);assert.equal(w.rng.get_state(),0x12345678);
});
test('F4F-09 closed context, declared modes at zero steps, wrong mode and semantic perturbations',()=>{
 const f=fixture(load(),7,'WITH_AGENT'),r=replay(f),before=copy({c:f.c,r});
 assert.equal(f.a.validate_ReplayResult(r,{...f.c,extra:1}),false);assert.equal(f.a.validate_ReplayResult(r,{...f.c,execution_mode:'WITHOUT_AGENT'}),false);
 for(const mode of ['WITH_AGENT','WITHOUT_AGENT']){const c={...f.c,execution_mode:mode,expected_steps:0};assert.equal(f.a.validate_ReplayResult(replay({a:f.a,c}),c),true);}
 assert.equal(replay({a:f.a,c:{...f.c,expected_steps:0,execution_mode:'UNKNOWN'}}).status,'INVALID_REPLAY_INPUT');
 const saved=r.records[0].state_hash_full;r.records[0].world_state.entities.get('é😀').energy++;
 // Recompute a correct hash independently: structural/physical mismatch must still fail.
 r.records[0].state_hash_world=oracle(r.records[0].world_state,false).hash;r.records[0].state_hash_full=oracle(r.records[0].world_state,true).hash;
 assert.equal(f.a.validate_ReplayResult(r,f.c),false);assert.notEqual(r.records[0].state_hash_full,saved);assert.deepEqual(copy(f.c),before.c);
});
const corruptMetadata=[['status','BOGUS'],['max_ticks_used',null],['expected_steps_used','1'],['unused_actions',-1],['termination_hint','BOGUS'],['unknown_action_index','bad'],['error_message',{}]];
test('F4F-10 reproduced P1 F4F-001: continuity accepts malformed ReplayResult metadata',()=>{
 const f=fixture(),r=replay(f),calls=watch(f.a);assert.equal(f.a.validate_replay_continuity(r,f.c),true);assert.equal(calls(),1);
 for(const [key,value] of corruptMetadata){const bad={...r,[key]:value},before=copy(bad);assert.equal(f.a.validate_ReplayResult(bad,f.c),false,key);const n=calls();assert.equal(f.a.validate_replay_continuity(bad,f.c),true,key);assert.equal(calls(),n+1,key+' reaches physical proof');assert.deepEqual(copy(bad),before);}
});
// Intentionally red until an authorized production correction closes F4F-001.
test('F4F-11 desired regression for F4F-001: malformed RR must be Invalid',()=>{
 const f=fixture(),r=replay(f);assert.equal(f.a.validate_replay_continuity({...r,status:'BOGUS'},f.c),false);
});

test('F4F-12 independently predicted death event wins against simultaneous time limit',()=>{
 const f=fixture(load(),7,'WITHOUT_AGENT',1);f.c.max_ticks=8;const r=replay(f);
 assert.equal(r.status,'OK');assert.equal(r.termination_hint,'ENTITY_DIED');assert.equal(r.final_state.entities.get('é😀').lifecycle,'DEAD');assert.equal(r.final_state.entities.get('é😀').energy,0);
 assert.deepEqual(copy(r.events),[{type:'ENTITY_DIED',entity_id:'é😀',position:{x:0,y:0},tick:8,source:'lifecycle',sequence:0}]);assert.equal(f.a.validate_ReplayResult(r,f.c),true);
});
