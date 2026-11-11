// Append-only acceptance expansion: never load the implementation to compute expectations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {encode,decode}=require('./wire.cjs'),oracle=require('./oracles.cjs');
const base=require('./cases.json'),corpus=require('./corpus.json'),copy=structuredClone;
const out=[],MAX=(1n<<64n)-1n;
function add(id,priority,clauses,sources,preconditions,operation,input,expected,method,{category='NORMATIVE-DERIVED',kind='value',independence='MANUAL / MATHEMATICAL',contrast=null}={}){
 out.push({id,category,priority,clauses,sources,original_reference:null,preconditions,operation,input:encode(input),expected:encode(expected),
  oracle:{kind,method,independence,...(category==='ENGINEERING-REGRESSION'?{policy_reference:'F5-A current API fixture and ACT/DYN/F4C policies in docs/IMPLEMENTATION_STATUS.md at b13d637dd405d363442803ad53821f5a6c6f4a62; not normative authority'}:{})},contrast,evidence_kind:category==='ENGINEERING-REGRESSION'?'IMPLEMENTATION POLICY REGRESSION':'DERIVED OBLIGATION; not historical T or interoperability'});
}
const original=base.find(c=>c.id==='ER-REPLAY-WITH_AGENT'),c0=decode(original.input).context,cfg=copy(c0.world_config);
const state=(time=7n,energy=10,lifecycle='ACTIVE')=>({time,grid:[[{traversal:'FREE',effect:null}]],entities:new Map([['0987898',{id:'0987898',position:{x:0,y:0},energy,lifecycle}]]),rng_state:1});
const configured=s=>({...s,config:copy(cfg)}),tickInput={state:configured(state()),action:{type:'WAIT'},max_ticks:MAX};
// P0: native PRNG arithmetic, exact rejection boundaries, restoration and tick isolation.
const stream=oracle.xorshift(0xffffffff,7),draws=oracle.xorshift(stream.state,3).values;
add('ND5B-RNG-RESTORE','P0',['§10.1','§10.2','§10.3','§10.7'],['S025'],'Nonzero uint32 state, explicit 7-draw checkpoint','f5b:rng_restore',{seed:0xffffffff,advance:7,a:-4,b:5},
 {saved:stream.state,first:[draws[0],draws[1]/4294967296,-4+draws[2]%10],repeated:[draws[0],draws[1]/4294967296,-4+draws[2]%10]},'Independent BigInt shifts and exact division/modulo, not PRNG.next', {contrast:'ND5B-RNG-REJECT'});
add('ND5B-RNG-REJECT','P0',['§10.3'],['S025'],'Instrumented next() stream straddles rejection limit','f5b:rng_rejection',{draws:[4294967295,4294967290,4294967289],a:10,b:19},{value:19,calls:3},'n=10; limit=4294967290; reject equality and larger; 7289 mod10=9');
add('ND5B-RNG-FLOAT','P0',['§10.2'],['S025'],'Single uint32 maximum draw','f5b:rng_float',{draws:[4294967295]},{value:1-2**-32,calls:1},'Exact dyadic binary64 division by 2^32');
add('ND5B-TICK-UNCONFIRMED','P0',['§4.1','§5.1','§32'],['S025'],'Active entity, zero cost, no effects, no temporal confirmation','f5b:execute_tick',tickInput,{order:['action','lifecycle','dynamics'],sync:0,time:7n,rng:1},'Explicit normative sequence; execute_tick cannot advance clock or synchronize');
for(const phase of ['apply_action','resolve_lifecycle','advance_dynamics','sync_rng_state','validate'])add('ND5B-ROLLBACK-'+phase,'P0',['§5.5','§26.5','§10.7'],['S025'],'Valid writable WORLD; injected failure at '+phase,'f5b:kernel_fault',{...tickInput,phase},
 {error:'world transition failed',world_state:state(),rng:1},'Expected state and effective RNG fixed before failure; mutate both or invalidate grid before validation');
add('ND5B-SNAPSHOT','P0',['§7.2','§26.5'],['S025'],'Confirmed snapshot and active state exist','f5b:snapshot',tickInput,{snapshot_independent:true,world_position_unchanged:true},'Bidirectional perturbation of active WORLD/snapshot; independent-copy invariant');
add('ND5B-TIME-OVERFLOW','P0',['D-01-E'],['S026'],'time=max_ticks=UINT64_MAX, ACTIVE','tick_order',{...tickInput,state:configured(state(MAX)),max_ticks:MAX},{name:'ContractError',message:'world transition failed'},'No legal uint64 successor; reject before transition',{kind:'throws'});
// Full current-schema fixtures are engineering regressions. Negative continuity
// cases derive their rejection from the norm, with the positive fixture dependency explicit.
function prefix(moves=false,energy=10){
 const c=copy(c0);c.initial_state=state(7n,energy);c.max_ticks=100n;c.expected_steps=2;
 c.feedback_config={expose_validity:true,expose_reason:true,expose_events:true,expose_energy_delta:true};
 c.actions=moves?[{type:'MOVE_E'},{type:'MOVE_W'}]:[{type:'WAIT'},{type:'WAIT'}];
 if(moves){c.world_config.width=2;c.initial_state.grid[0].push({traversal:'FREE',effect:null});}
 const records=[],events=[];let previous=null,s=copy(c.initial_state);
 for(let i=0;i<2;i++){
  const e=s.entities.get('0987898'),obs={tick:Number(s.time),self:{id:e.id,position:copy(e.position),energy:e.energy},local_view:[[{representation:'FREE',occupied:false}]]};
  const feedback={observation:copy(obs),has_prior_action:previous!==null,last_action_result:copy(previous)};
  s=copy(s);s.time=BigInt(s.time)+1n;const entity=s.entities.get('0987898');if(moves)entity.position.x=i===0?1:0;
  const raw=moves?[{type:'ENTITY_MOVED',entity_id:entity.id,position:copy(entity.position)}]:[];
  const ar={validity:'VALID',reason:'NONE',energy_delta:0,events:raw};
  const enriched=raw.map(x=>({...copy(x),tick:Number(s.time),source:'action',sequence:events.length}));events.push(...enriched);
  const b=oracle.bytes(s);records.push({tick:Number(s.time),world_state:copy(s),observation:obs,feedback,action:c.actions[i],action_result:ar,
   action_events:enriched,lifecycle_events:[],state_hash_world:oracle.fnv(b.world),state_hash_full:oracle.fnv(b.full),entity_states:copy(s.entities)});previous=copy(ar);
 }
 return {context:c,result:{status:'OK',records,events,final_state:copy(s),executed:2,unused_actions:0,max_ticks_used:100,expected_steps_used:2,unknown_action_index:null,error_message:null,termination_hint:null}};
}
for(const moves of [false,true]){const p=prefix(moves);add('ER5B-PREFIX-'+(moves?'MOVE':'WAIT'),'P0',['§25.3.1','D-01-D'],['S025','S026','H034'],'Explicit current-schema two-step fixture; zero costs, no effects','replay',{context:p.context},p.result,'Manual positions/ticks/events + independent WLS1/FNV; current ActionResult/Feedback policies',{category:'ENGINEERING-REGRESSION'});}
const negative=(id,clauses,mutate,moves=false)=>{
 const p=prefix(moves);mutate(p.context,p.result);
 add('ND5B-REPLAY-'+id,'P0',clauses,['S025','S026','H034'],'Typed perturbation of paired ER5B-PREFIX-'+(moves?'MOVE':'WAIT')+' fixture','validate',p,{continuity:false,complete:false},'Normative structural/temporal rejection; positive fixture is separately executed, no self-generated expected state',{contrast:'ER5B-PREFIX-'+(moves?'MOVE':'WAIT')});
};
negative('STORED-HASH',['§24.3–4','§25.3.1'],(_c,r)=>{r.records[0].world_state.entities.get('0987898').energy=11;});
negative('REHASHED-STATE',['§25.3.1'],(_c,r)=>{const s=r.records[0].world_state;s.entities.get('0987898').energy=11;const b=oracle.bytes(s);r.records[0].state_hash_world=oracle.fnv(b.world);r.records[0].state_hash_full=oracle.fnv(b.full);});
negative('TIME-GAP',['§25.3.1','D-01-E'],(_c,r)=>{r.records[1].tick=10;r.records[1].world_state.time=10n;r.final_state.time=10n;const b=oracle.bytes(r.records[1].world_state);r.records[1].state_hash_world=oracle.fnv(b.world);r.records[1].state_hash_full=oracle.fnv(b.full);});
negative('EVENT-ORDER',['§25.3.1','D-01-B'],(_c,r)=>r.events.reverse(),true);
negative('EVENT-SEQUENCE',['§25.3.1','D-01-B'],(_c,r)=>{r.events[1].sequence=2;r.records[1].action_events[0].sequence=2;},true);
negative('COST-CONTEXT',['§25.3.1','D-01-C'],c=>{c.world_config.wait_cost=1;});
negative('INITIAL-ENERGY',['§25.3.1'],c=>{c.initial_state.entities.get('0987898').energy=11;});
negative('INITIAL-RNG',['§25.3.1','D-01-B'],c=>{c.initial_state.rng_state=2;});
negative('OBSERVATION',['§25.3.1','§16'],(_c,r)=>{r.records[0].observation.self.energy=11;r.records[0].feedback.observation.self.energy=11;});
negative('FEEDBACK',['§25.3.1','§17'],(_c,r)=>{r.records[1].feedback.last_action_result.energy_delta=1;});
negative('FLAGS-CONTEXT',['D-01-C','D-01-D'],c=>{c.feedback_config.expose_reason=false;});
negative('MODE',['D-01-D'],c=>{c.execution_mode='WITHOUT_AGENT';});
negative('METADATA',['D-01-C'],(_c,r)=>{r.unused_actions=-1;});
// Genuine FNV32 collision, found offline without loading yellow. Only the two
// frozen sample indices are evaluated during builds; no search or RNG in WORLD.
const sample=index=>{
 const digest=crypto.createHash('sha256').update('WORLD-LAB-F5B-COLLISION/'+index).digest();
 const bits=0x3ff0000000000000n|(digest.readBigUInt64BE()&0xfffffffffffffn),buf=Buffer.alloc(8);buf.writeBigUInt64BE(bits);
 return {index,bits:bits.toString(16),energy:buf.readDoubleBE()};
};
const collisionA=sample(1491),collisionB=sample(73773),collision=prefix(false,collisionA.energy);
collision.context.expected_steps=1;collision.context.actions.length=1;collision.result.records.length=1;
collision.result.final_state=copy(collision.result.records[0].world_state);collision.result.executed=1;collision.result.expected_steps_used=1;
const wrong=copy(collision);wrong.result.records[0].world_state.entities.get('0987898').energy=collisionB.energy;
wrong.result.records[0].entity_states.get('0987898').energy=collisionB.energy;wrong.result.final_state.entities.get('0987898').energy=collisionB.energy;
const ca=oracle.bytes(collision.result.final_state),cb=oracle.bytes(wrong.result.final_state);
if(collisionA.energy===collisionB.energy||oracle.fnv(ca.world)!==oracle.fnv(cb.world)||oracle.fnv(ca.full)!==oracle.fnv(cb.full))throw Error('collision fixture invalid');
fs.writeFileSync(path.join(__dirname,'collision-f5-b.json'),JSON.stringify({kind:'NEW DERIVED FIXTURE, NOT V2–V10',a:collisionA,b:collisionB,time:'8',world:oracle.fnv(ca.world),full:oracle.fnv(ca.full),method:'Offline bounded 200000-sample deterministic SHA256 mantissa search, exponent 1023, independent Buffer/BigInt FNV. Frozen indices reproduced directly; no product loaded.'},null,2)+'\n');
add('ER5B-COLLISION-ORIGIN','P0',['§24.3–4','§25.3.1'],['S025','H034'],'Manual one-step current-schema positive fixture at collision energy A','replay',{context:collision.context},collision.result,'Explicit one-step WAIT, independent bytes/hash; fixture schema remains engineering policy',{category:'ENGINEERING-REGRESSION'});
add('ND5B-REPLAY-GENUINE-COLLISION','P0',['§24.3–4','§25.3.1'],['S025','H034'],'Energy A/B have equal correct WORLD and FULL FNV hashes at time8, but different states','validate',wrong,{continuity:false,complete:false},'Independent verified true FNV collision; structural transition must reject energy B despite both valid matching hashes',{contrast:'ER5B-COLLISION-ORIGIN'});
const equivalent=prefix();for(const step of equivalent.result.records){step.tick=BigInt(step.tick);step.observation.tick=BigInt(step.observation.tick);step.feedback.observation.tick=BigInt(step.feedback.observation.tick);}
add('ND5B-TIME-EQUIVALENT','P0',['D-01-E'],['S026'],'Only admissible small Number ticks replaced by equal BigInt values','validate',equivalent,{continuity:true,complete:true},'Exact mathematical uint64 equality on admitted representations; not type-identity comparison');
const unsafe=prefix();unsafe.result.records[0].tick=2**53;
add('ND5B-TIME-UNSAFE','P0',['D-01-E'],['S026'],'Unsafe Number is outside uint64 JS representation domain','validate',unsafe,{continuity:false,complete:false},'Number.isSafeInteger bound, no reconstruction of lost precision');
for(const rng_state of [2,0xffffffff]){
 const s=state();s.rng_state=rng_state;const b=oracle.bytes(s);
 add('ND5B-HASH-RNG-'+rng_state,'P0',['§24.2','§34.6–7'],['S025','H034'],'Only effective RNG changes','hash_state',{state:configured(s)},{world:oracle.fnv(b.world),full:oracle.fnv(b.full)},'Independent byte concatenation/FNV; WORLD excludes RNG, FULL includes exact uint32');
}
const cells=state();cells.grid=[[{traversal:'FREE',effect:null},{traversal:'BLOCKED',effect:null},{traversal:'FREE',effect:{kind:'RESOURCE',stock:0}}],[{traversal:'FREE',effect:{kind:'RESOURCE',stock:1}},{traversal:'FREE',effect:{kind:'HAZARD'}},{traversal:'FREE',effect:null}]];
add('ND5B-WLS1-CELL-ORDER','P0',['§8','§34.3–5'],['S025','H034'],'Valid 3x2 grid exercises every fixed cell tag in row-major order','wls1',{state:{...cells,config:{...cfg,width:3,height:2}}},oracle.bytes(cells).full,'Independent Buffer encoder, literal distinct cell ordering and tags');
for(const [name,id,energy]of [['UTF8','é😀',10],['NUL','a\0b',-7.25],['NEGZERO','e\u0301',-0],['MAX','0987898',Number.MAX_VALUE]]){
 const s=state(MAX,energy);const e=s.entities.values().next().value;e.id=id;s.entities=new Map([[id,e]]);
 add('ND5B-WLS1-'+name,'P0',['§6.4','§34.5','§34.8'],['S025','H034'],'Finite binary64 and valid nonempty UTF-8 ID','wls1',{state:configured(s)},oracle.bytes(s).full,'Buffer UTF-8 byte length, BE binary64; -0 alone canonicalizes, no Unicode normalization');
}
// P1: exact domains and observable functional boundaries (not missing historical mechanics).
for(const [name,patch]of [['ZERO',{width:0}],['FRACTION',{height:1.5}],['STRING',{width:'1'}],['NAN',{resource_density:NaN}],['SUM',{resource_density:0.6,hazard_density:0.5}],['TOPOLOGY',{topology:'TOROIDAL'}]])add('ND5B-CONFIG-'+name,'P1',['§6.1','§6.2'],['S025'],'Single out-of-domain field in otherwise valid config','config',{config:{...cfg,...patch}},{name:'ContractError',message:'invalid world_config'},'Explicit closed domains/sum/topology; reject before grid allocation',{kind:'throws'});
const validCfg={...cfg,initial_energy:-7.25,death_threshold:Number.MIN_SAFE_INTEGER,resource_regeneration:0xffffffff};
add('ND5B-CONFIG-NEGATIVE','P1',['§6.1'],['S025'],'Negative finite initial energy, safe negative threshold and uint32 regeneration maximum','config',{config:validCfg},{value:validCfg,frozen:true},'Literal permitted domain endpoints, immutable WorldConfig');
for(const [name,energy,delta,value]of [['LOWER',2**53,1,2**53],['UPPER',2**53+2,1,2**53+4],['ZERO',-0,-0,0]])add('ND5B-ENERGY-'+name,'P1',['§6.3','§6.4'],['S025'],'Finite energy, allowed integer increment, exact tie or negative zero','f5b:energy_round',{state:configured(state()),energy,delta},
 {value,state_unchanged:true,rng:1},'Manual IEEE-754 spacing=2 above 2^53; tie picks even significand; only zero sign canonicalizes');
const observationState=state(7n);observationState.grid=[[{traversal:'FREE',effect:null},{traversal:'FREE',effect:{kind:'RESOURCE',stock:0}}],[{traversal:'FREE',effect:{kind:'HAZARD'}},{traversal:'BLOCKED',effect:null}]];
add('ND5B-OBSERVATION','P1',['§16','§4.1','D-01-E'],['S025','S026'],'2x2 map, entity at corner (0,0), Chebyshev radius=1','f5b:observe',{state:{...observationState,config:{...cfg,width:2,height:2,observation_radius:1}},radius:1},
 {keys:['local_view','self','tick'],tick:7,dimensions:[3,3],out_of_bounds:[[true,true,true],[true,false,false],[true,false,false]],occupied_false:true,unchanged:true,rng_unchanged:true},'Literal nine-position boundary mask; purity and RNG invariants, no hidden resource-stock assumption');
for(const [name,patch]of [['COERCE',{expose_validity:1}],['EXTRA',{extra:false}]])add('ND5B-FEEDBACK-'+name,'P1',['§17'],['S025'],'Four known flag names from current context; malformed boolean/extra key','f5b:feedback_config',{config:{...c0.feedback_config,...patch}},{name:'ContractError',message:'invalid feedback_config'},'Closed schema and genuine booleans, no coercion',{kind:'throws'});
const actionState=state();actionState.grid[0].push({traversal:'BLOCKED',effect:null});
for(const type of ['MOVE_N','MOVE_E','WAIT'])add('ND5B-ACTION-'+type,'P1',['§13','§4.1'],['S025'],'Bounded 2x1 map, blocked east neighbor; no effects and zero costs','f5b:world_action',{state:{...actionState,config:{...cfg,width:2}},action:{type}},
 {time:7n,lifecycle:'ACTIVE',rng:1,no_death_events:true,position:{x:0,y:0},cell_domain_valid:true,structural_map:[['FREE','BLOCKED']],before_time:7n},'Bounded geometry, immutable time/lifecycle/RNG; no assertion of unrecovered invalid-action energy policy');
add('ND5B-ACTION-UNKNOWN','P1',['§12','§13'],['S025'],'Structurally valid action with unknown enum','f5b:world_action',{state:configured(state()),action:{type:'UNKNOWN'}},{name:'ContractError'},'Unknown enum must raise ContractError, not WAIT',{kind:'throws'});
for(const [name,energy,raise]of [['AT',-5,true],['ABOVE',-4,false]]){
 const s=state(0,energy),died=energy<=-5;
 add('ND5B-LIFECYCLE-'+name,'P1',['§9','§14','§11.7'],['S025','HINIT'],'Initial energy around negative threshold=-5; repeat lifecycle and optionally raise DEAD energy','f5b:lifecycle',{state:{...s,config:{...cfg,initial_energy:energy,death_threshold:-5}},raise_after_first:raise},
  {first:died?[{type:'ENTITY_DIED',entity_id:'0987898',position:{x:0,y:0}}]:[],second:[],lifecycle:died?'DEAD':'ACTIVE',time:0,rng:1},'Recovered initial death <= threshold, raw event schema, no duplicate or resurrection after external energy increase');
}
for(const kind of ['RESOURCE','HAZARD']){
 const s=state();s.grid[0].push({traversal:'FREE',effect:kind==='RESOURCE'?{kind,stock:1}:{kind}});
 const config={...cfg,width:2,move_cost:2,resource_effect:4,hazard_damage:3,resource_regeneration:1};
 const after=copy(s),e=after.entities.get('0987898');e.position.x=1;e.energy=kind==='RESOURCE'?12:5;if(kind==='RESOURCE')after.grid[0][1].effect.stock=0;
 const dynamics=copy(after);if(kind==='RESOURCE')dynamics.grid[0][1].effect.stock=1;
 add('ER5B-EFFECT-'+kind,'P1',['§6.3','§13','§15'],['S025'],'Accepted current energy/entry and binary regeneration policies; missing full historical mechanics','f5b:effect_policy',{state:{...s,config}},
  {after_action:after,after_dynamics:dynamics,rng:1},'Manual integer energy balance and DYN-P01 regeneration; explicit engineering regression, not historical conformance',{category:'ENGINEERING-REGRESSION',independence:'MANUAL ENERGY BALANCE + APPROVED ENGINEERING POLICY'});
}
const ec={experiment_seed:1,agent_type:'probe',max_ticks:2,world_config:copy(cfg),feedback_config:copy(c0.feedback_config)};
add('ND5B-AGENT-ISOLATION','P0',['§4.2','§10.7','§35.5'],['S025'],'Identical WAIT actions; only agent-owned RNG draw count differs 1 versus17','f5b:agent_isolation',{config:ec},{same_world_trajectory:true,status:'COMPLETED'},'Metamorphic WORLD independence from private agent stream; same implementation, not independent interoperability',{independence:'METAMORPHIC WITHIN ONE IMPLEMENTATION'});
for(const behavior of ['throw','malformed'])add('ND5B-AGENT-'+behavior,'P1',['§20.6','§28.5','§31/I-73'],['S025'],'One committed WAIT, then agent exception or structurally invalid action','f5b:experiment',{config:{...ec,max_ticks:3},with_agent:true,behavior},
 {status:'FAILED',failure_reason:'AGENT_CONTRACT_ERROR',termination:'AGENT_CONTRACT_ERROR',ticks:[1],all_wait:true,null_contexts:false,resets:1,calls:2,feedback_keys:['has_prior_action','last_action_result','observation'],seed_args:['probe',oracle.fnv(Buffer.from('1:probe'))||1]},'Normative fail-stop before executing invalid tick, confirmed prefix retained; independent agent seed');
add('ND5B-NO-AGENT','P1',['§20.2','§22','§27'],['S025'],'Two zero-cost ticks, no agent factory','f5b:experiment',{config:ec,with_agent:false},
 {status:'COMPLETED',failure_reason:null,termination:'MAX_TICKS_REACHED',ticks:[1,2],all_wait:true,null_contexts:true,resets:0,calls:0,feedback_keys:[],seed_args:null},'Explicit WAIT/non-null result and null observation/feedback at each confirmed step');
add('ND5B-INIT-FAILURE','P1',['§11.3','§20.5'],['S025'],'1x1 map with obstacle_density=1 has no possible FREE candidate','f5b:experiment',{config:{...ec,world_config:{...cfg,obstacle_density:1}},with_agent:false},
 {status:'FAILED',failure_reason:'INITIALIZATION_ERROR',trajectory_null:true},'No candidates possible for every RNG output; InitializationFailure remains outside Trajectory');
add('ER5B-RECORDER-OWNERSHIP','P0',['§21'],['S025'],'Current F4-C owned-history policy, one confirmed no-agent step','f5b:recorder_owned',{state:configured(state(0)),experiment_config:ec},
 {query_independent:true,world_unchanged:true},'Retained query and ConfirmedTickResult perturbations must not change recorder; explicit engineering policy F4C-P01',{category:'ENGINEERING-REGRESSION',independence:'METAMORPHIC OWNERSHIP REGRESSION'});
out.sort((a,b)=>a.priority.localeCompare(b.priority)||a.id.localeCompare(b.id,'en'));
const all=[...base,...out];if(new Set(all.map(c=>c.id)).size!==all.length)throw Error('duplicate expanded case ID');
fs.writeFileSync(path.join(__dirname,'cases-f5-b.json'),JSON.stringify(all,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'f5-b-manifest.json'),JSON.stringify({base:'b13d637dd405d363442803ad53821f5a6c6f4a62',inherited_case_count:base.length,inherited_case_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'cases.json'))).digest('hex'),added_case_ids:out.map(c=>c.id),categories:out.reduce((s,c)=>(s[c.category]=(s[c.category]||0)+1,s),{}),unchanged_blocked_count:corpus.tests.filter(t=>!t.executable_case).length+corpus.vectors.filter(t=>!t.executable_case).length},null,2)+'\n');
console.log(JSON.stringify({inherited:base.length,added:out.length,categories:out.reduce((s,c)=>(s[c.category]=(s[c.category]||0)+1,s),{})}));
