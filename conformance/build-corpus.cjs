// Reproducible corpus construction from normative text and independently calculated expectations.
// This script does not load the implementation, index.html, or prior test outputs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {encode}=require('./wire.cjs'),oracle=require('./oracles.cjs');
const root=path.resolve(__dirname,'..'),base='14d59dad381c344b7213025c86ffa5e661f16fc2';
const save=(name,x)=>fs.writeFileSync(path.join(__dirname,name),JSON.stringify(x,null,2)+'\n');
const spec=fs.readFileSync(path.join(root,'docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md'),'utf8');
const sources=[
 ['S025','docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md','NORMATIVE v0.2.5, full available transcription'],
 ['S026','docs/WORLD-LAB_v0.2.6_contractual_amendment_D-01.md','NORMATIVE D-01, supersedes explicit clauses only'],
 ['H034','conformance/sources/F3-D-2-recovered-order.b64','Owner-recovered v0.2.4 §34 fragment in F3-D/2 order; not full historical manuscript'],
 ['HINIT','conformance/sources/F2-G-recovered-order.b64','Owner-recovered initialization/events rules and authorized INIT-004 in F2-G order']
].map(([id,p,authority])=>{const b=fs.readFileSync(path.join(root,p));return {id,path:p,sha256:crypto.createHash('sha256').update(b).digest('hex'),encoding:p.endsWith('.b64')?'base64':'utf8',original_sha256:crypto.createHash('sha256').update(p.endsWith('.b64')?Buffer.from(b.toString(),'base64'):b).digest('hex'),authority};});
save('sources.json',sources);
const groups=new Map();
for(const line of spec.split('## §36 — Inventario de tests')[1].split('Todos: UNTESTED.')[0].trim().split('\n').slice(1)){
 const [group,ranges]=line.split('\t');if(!ranges)continue;
 for(const m of ranges.matchAll(/T(\d+)(?:–T(\d+))?/g))for(let i=+m[1];i<=+(m[2]||m[1]);i++){if(!groups.has(i))groups.set(i,[]);groups.get(i).push(group);}
}
const pMap={266:['P0-1','§10.1'],267:['P0-2','§6.1','§6.2','§35.6'],268:['P0-3','§20.2','§22','§27','§32'],269:['P0-3','§20.2','§22','§27','§32'],270:['P0-4','§20.6','§28.5'],271:['P0-5','§25.3.1'],272:['P0-6','§25.3'],273:['P0-7','§11.7','§25.3.3'],274:['P0-8','§25.3.2'],275:['P1-1','§21.5'],276:['P1-2','§11.6'],277:['P1-3','§6.3','§13'],278:['P1-4','§6.4','§34'],279:['P1-5','§37','§36'],280:['AUDIT','§1–§39']};
const tests=Array.from({length:280},(_,k)=>{
 const n=k+1,linked=groups.get(n)||[],mapping=pMap[n]||[];
 return {id:'T'+String(n).padStart(2,'0'),original_version:n>=266?'v0.2.5':n>=256?'v0.2.4':n>=241?'v0.2.3':n>=219?'v0.2.2':'NOT SPECIFIED in available inventory',
  sources:['S025'],source_locator:'§36'+(mapping.length?' / trazabilidad '+mapping[0]:''),clauses:mapping.slice(1),groups:linked,
  input:null,procedure:null,expected:null,
  recovery:linked.length?'PARTIAL REFERENCE; SOURCE UNAVAILABLE for individual input/procedure/expected':'SOURCE UNAVAILABLE; no explicit assignment in §36',
  implementation:'NOT IMPLEMENTED as authenticated historical test',execution:'BLOCKED',executable_case:null,
  evidence:'conformance/results/f5-a.json#'+('T'+String(n).padStart(2,'0')),
  supersession:n===271?'D-01-C replaces public signature/context':n===273?'D-01-B replaces replay-origin event preconditions; initialize_world unchanged':null};
});
const vectors=Array.from({length:10},(_,k)=>({id:'V'+(k+1),original_version:k===0?'v0.2.4 recovered fragment':'v0.2.4 planned; v0.2.5 still pending',sources:['S025','H034'],source_locator:k===0?'§34.9 / F3-D/2 literal 59 bytes':'§34.9 expressly pending',clauses:['§34.9'],input:k===0?'State decoded unambiguously from literal V1 and §34.1–8':null,procedure:k===0?'Serialize FULL and compare exactly 59 bytes':null,expected:k===0?'Literal bytes in CR-WLS1-V1':null,recovery:k===0?'RECOVERED LITERAL VECTOR + unambiguous input reconstruction':'SOURCE UNAVAILABLE; no fixed bytes or reference hashes',implementation:k===0?'CR-WLS1-V1':'NOT IMPLEMENTED',execution:k===0?'See execution report':'BLOCKED',executable_case:k===0?'CR-WLS1-V1':null}));
save('corpus.json',{product_base:base,tests,vectors,notes:['No T definition is manufactured from thematic mappings or local test names.','V-1/V-2 in the v0.2.3 test-group label are not presumed identical to WLS1 V1/V2.','Xorshift §10.6 gives outputs but does not explicitly state the input seed; the seed=1 case is NORMATIVE-DERIVED.']});
const config={width:1,height:1,topology:'BOUNDED',obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:0,wait_cost:0,resource_effect:0,hazard_damage:0,resource_regeneration:0,death_threshold:0,observation_radius:0};
const feedback={expose_validity:true,expose_reason:false,expose_events:false,expose_energy_delta:true};
function state(time=0,energy=10,lifecycle='ACTIVE',id='0987898'){return {time,grid:[[{traversal:'FREE',effect:null}]],entities:new Map([[id,{id,position:{x:0,y:0},energy,lifecycle}]]),rng_state:1};}
const configured=s=>({...s,config:structuredClone(config)}),MAX=(1n<<64n)-1n,SAFE=BigInt(Number.MAX_SAFE_INTEGER);
const canon=x=>BigInt(x)<=SAFE?Number(x):BigInt(x),copy=structuredClone;
const cases=[];
function add(id,category,clauses,src,operation,input,expected,method,original_reference=null,kind='value'){
 cases.push({id,category,clauses,sources:src,original_reference,operation,input:encode(input),expected:encode(expected),oracle:{kind,method},evidence_kind:category==='ENGINEERING-REGRESSION'?'IMPLEMENTATION REGRESSION':'INDEPENDENT EXPECTATION; not interoperability'});
}
const CR=(...args)=>add(args[0],'CANONICAL-RECOVERED',...args.slice(1));
const ND=(...args)=>add(args[0],'NORMATIVE-DERIVED',...args.slice(1));
for(const [name,text,h]of [['EMPTY','',0x811c9dc5],['A','a',0xe40c292c],['FOOBAR','foobar',0xbf9cf968]])CR('CR-FNV-'+name,['§24.5'],['S025'],'fnv',{bytes:Buffer.from(text)},h,'Literal input/output §24.5; ASCII bytes unchanged','§24.5 '+JSON.stringify(text));
for(const [ns,h]of [['world',2448580590],['random_agent',84506387]])CR('CR-SEED-'+ns.toUpperCase(),['§11.6'],['S025'],'derive_seed',{seed:1,namespace:ns},h,'Literal input/output §11.6','§11.6 (1, '+ns+')');
const historical=Buffer.from(fs.readFileSync(path.join(__dirname,'sources/F3-D-2-recovered-order.b64'),'utf8'),'base64').toString('utf8');
const v1text=historical.split('V1 — bytes completos (59):')[1].split('```text')[1].split('```')[0];
const v1=Buffer.from(v1text.replace(/\s/g,''),'hex');if(v1.length!==59)throw Error('invalid recovered V1');
CR('CR-WLS1-V1',['§34.1–9'],['S025','H034'],'wls1',{state:configured(state(0,0))},v1,'Literal 59 FULL bytes; input decoded by fixed recovered layout, no WORLD initialization','V1');
for(const seed of [1,0x80000000,0xffffffff])ND('ND-XOR-'+seed,['§10.1','§31/I-67'],['S025'],'prng',{seed,draws:8},oracle.xorshift(seed,8),'Independent BigInt shifts/mask at each stage; explicit new input');
ND('ND-XOR-ZERO',['§10.4','§31/I-68'],['S025'],'prng',{seed:0,draws:1},{name:'ContractError',message:'rng zero state'},'Zero forbidden explicitly',null,'throws');
ND('ND-SEED-UTF8',['§11.6'],['S025'],'derive_seed',{seed:4294967295,namespace:'é😀'},oracle.fnv(Buffer.from('4294967295:é😀'))||1,'Node UTF-8 and independent BigInt FNV; no normalization');
ND('ND-SEED-SURROGATE',['§11.6'],['S025'],'derive_seed',{seed:1,namespace:'\ud800'},{name:'ContractError'},'Unpaired surrogate prohibited; unspecified diagnostic text is recorded but not asserted',null,'throws');
ND('ND-CONFIG-MAX',['§6.1','§6.2','§31/I-69'],['S025'],'config',{config:{...config,width:1024,height:1024}},{value:{...config,width:1024,height:1024},frozen:true},'Exactly 2^20 cells permitted; closed immutable record, no grid allocation');
for(const [name,patch]of [['OVER',{width:1025,height:1024}],['EXTRA',{extra:1}]])ND('ND-CONFIG-'+name,['§6.1','§6.2','§31/I-70'],['S025'],'config',{config:{...config,...patch}},{name:'ContractError',message:'invalid world_config'},'Normative cell cap and closed schema',null,'throws');
ND('ND-HASH-V1',['§24.2','§34'],['S025','H034'],'hash_state',{state:configured(state(0,0))},{world:oracle.fnv(v1.subarray(0,55)),full:oracle.fnv(v1)},'New independently calculated FNV over recovered literal V1; these hashes are derived, not historical reference values');
for(const energy of [-0,Number.MIN_VALUE,Math.PI])ND('ND-BINARY64-'+(Object.is(energy,-0)?'ZERO':energy===Number.MIN_VALUE?'SUBNORMAL':'PI'),['§6.4','§31/I-81','§34'],['S025','H034'],'wls1',{state:configured(state(MAX,energy,'ACTIVE','é😀'))},oracle.bytes(state(MAX,energy,'ACTIVE','é😀')).full,'Independent Buffer BE/binary64 encoder; only -0 canonicalizes');
const s=state(0),after=state(1);
ND('ND-TICK-ORDER',['§5.1','§32','§26.5'],['S025'],'tick_order',{state:configured(s),action:{type:'WAIT'},max_ticks:2},{order:['action','lifecycle','dynamics','sync'],tick:1,world_state:after,rng:1},'Normative order; manually fixed zero-cost/effect WAIT and unchanged RNG');
ND('ND-ROLLBACK',['§5.5','§26.5','§10.7'],['S025'],'rollback',{state:configured(state(7n)),action:{type:'WAIT'},max_ticks:MAX},{error:'world transition failed',world_state:state(7n),rng:1},'Fault after mutating energy and effective RNG; expected snapshot specified before execution');
ND('ND-DYNAMICS',['§15','§5.2','§10.7'],['S025'],'dynamics',{state:configured(state(7n))},{world_state:state(7n),rng:1,regeneration_calls:1},'Resource-free fixed state; delegates once to regeneration without changing clock/entity/RNG');
for(const lifecycle of ['ACTIVE','DEAD'])ND('ND-TERMINAL-'+lifecycle,['§5.4','§31/I-76'],['S025'],'termination',{state:configured(state(MAX,lifecycle==='DEAD'?0:10,lifecycle)),max_ticks:MAX},lifecycle==='DEAD'?'ENTITY_DIED':'MAX_TICKS_REACHED','Independent terminal truth table, death before time limit');
const raw={type:'ENTITY_DIED',entity_id:'0987898',position:{x:0,y:0}},recorded={...raw,tick:0,source:'lifecycle',sequence:0};
ND('ND-INITIAL-EVENT',['§11.7','§14','§18','§21'],['S025','HINIT'],'initial_events',{state:configured(state(0,0)),experiment_config:{experiment_seed:1,agent_type:'wait',max_ticks:0,world_config:config,feedback_config:feedback}},
 {raw:[raw],recorded:[recorded],sequence:1,world_state:state(0,0,'DEAD')},'Owner-recovered raw-event/lifecycle rules and INIT-004; explicit initial enrichment tick=0/sequence=0');
function context(time=7n,mode='WITHOUT_AGENT'){return {world_config:copy(config),feedback_config:copy(feedback),initial_state:state(time),initial_events:[],actions:[{type:'WAIT'}],expected_steps:1,max_ticks:MAX,execution_mode:mode};}
function waitResult(c){
 const next=copy(c.initial_state);next.time=typeof next.time==='bigint'?BigInt(next.time)+1n:canon(BigInt(next.time)+1n);
 const b=oracle.bytes(next),ar={validity:'VALID',reason:'NONE',energy_delta:0,events:[]};
 const obs=c.execution_mode==='WITHOUT_AGENT'?null:{tick:canon(c.initial_state.time),self:{id:'0987898',position:{x:0,y:0},energy:10},local_view:[[{representation:'FREE',occupied:false}]]};
 const step={tick:canon(next.time),world_state:next,observation:obs,feedback:obs===null?null:{observation:copy(obs),has_prior_action:false,last_action_result:null},action:{type:'WAIT'},action_result:ar,action_events:[],lifecycle_events:[],state_hash_world:oracle.fnv(b.world),state_hash_full:oracle.fnv(b.full),entity_states:copy(next.entities)};
 return {status:'OK',records:[step],events:[],final_state:next,executed:1,unused_actions:0,max_ticks_used:canon(c.max_ticks),expected_steps_used:1,unknown_action_index:null,error_message:null,termination_hint:BigInt(next.time)>=BigInt(c.max_ticks)?'MAX_TICKS_REACHED':null};
}
// Full physical projections use explicit recovered/engineering output schemas.
// They are engineering regressions, not an invented historical ActionResult contract.
for(const mode of ['WITH_AGENT','WITHOUT_AGENT']){
 const c=context(7n,mode),r=waitResult(c);
 add('ER-REPLAY-'+mode,'ENGINEERING-REGRESSION',['§16','§17','§20','D-01-B','D-01-D'],['S025','S026','H034'],'replay',{context:c},r,'Manual zero-cost transition, explicit current ActionResult/projection policy plus independent WLS1/FNV');
 ND('ND-MODE-'+mode,['D-01-C','D-01-D'],['S026'],'validate',{context:c,result:r},{continuity:true,complete:true},'Explicit eight-field context and declared mode; complete pre-authored physical fixture');
}
const near=context(MAX-1n),nearResult=waitResult(near);
add('ER-REPLAY-UINT64','ENGINEERING-REGRESSION',['D-01-E','§34'],['S026','H034'],'replay',{context:near},nearResult,'Manual MAX-1→MAX fixture with independent bytes/hash; current output schemas');
ND('ND-UINT64',['D-01-E','D-01-C'],['S026'],'validate',{context:near,result:nearResult},{continuity:true,complete:true},'Exact uint64 terminal fixture, canonical BigInt output');
const c=context(),r=waitResult(c);
add('ER-VALIDATION-WORK','ENGINEERING-REGRESSION',['D-01-C'],['S026'],'validate_work',{context:c,result:r},{continuity:true,complete:true,work:{proofs:2,rebuilds:2,ticks:2}},'Yellow-specific instrumentation: one proof/reconstruction per predicate; not an independent-engine acceptance oracle');
add('ER-METADATA-NO-WORK','ENGINEERING-REGRESSION',['D-01-C'],['S026'],'validate_work',{context:c,result:{...r,status:'BOGUS'}},{continuity:false,complete:false,work:{proofs:0,rebuilds:0,ticks:0}},'Yellow-specific instrumentation: malformed metadata rejected before reconstruction; behavior separately covered by ND');
const altered=copy(r);altered.records[0].world_state.entities.get('0987898').energy=11;
const changedBytes=oracle.bytes(altered.records[0].world_state);altered.records[0].state_hash_world=oracle.fnv(changedBytes.world);altered.records[0].state_hash_full=oracle.fnv(changedBytes.full);
ND('ND-STRUCTURE-HASH',['§25.3.1','§24.3–4','D-01-C'],['S025','S026','H034'],'validate',{context:c,result:altered},{continuity:false,complete:false},'Independently rehashed incorrect physical state must fail structural/transition comparison, not just a hash check');
for(const [key,value]of [['status','BOGUS'],['max_ticks_used',null],['expected_steps_used','1'],['unused_actions',-1],['termination_hint','BOGUS'],['unknown_action_index','bad'],['error_message',{}]])ND('ND-METADATA-'+key,['D-01-C','§25.3'],['S026','S025'],'validate',{context:c,result:{...r,[key]:value}},{continuity:false,complete:false},'Single explicit out-of-domain perturbation must fail before reconstruction; F4F-001');
for(const patch of [{extra:1},{execution_mode:'UNKNOWN'}])ND('ND-CONTEXT-'+Object.keys(patch)[0],['D-01-C','D-01-D'],['S026'],'validate',{context:{...c,...patch},result:r},{continuity:false,complete:false},'Closed context/mode enumeration, no implicit defaults');
for(const [id,expected,max]of [['BOTH',-1,'bad'],['BIGMAX',-1,MAX],['BIGEXPECTED',1n,5n]]){
 const req={...context(),expected_steps:expected,max_ticks:max};
 ND('ND-INVALID-'+id,['D-01-A','D-01-E'],['S026'],'replay',{context:req},{status:'INVALID_REPLAY_INPUT',records:[],events:[],final_state:null,executed:0,unused_actions:1,max_ticks_used:typeof max==='bigint'?canon(max):null,expected_steps_used:null,unknown_action_index:null,error_message:'invalid expected_steps',termination_hint:null},'Independent partial counter domains and fixed validation precedence; zero output prefix');
}
for(const life of ['ACTIVE','DEAD']){
 const req={...context(MAX),initial_state:state(MAX,life==='DEAD'?0:10,life),expected_steps:0};
 const rr={status:'OK',records:[],events:[],final_state:copy(req.initial_state),executed:0,unused_actions:1,max_ticks_used:MAX,expected_steps_used:0,unknown_action_index:null,error_message:null,termination_hint:life==='DEAD'?'ENTITY_DIED':'MAX_TICKS_REACHED'};
 ND('ND-SEGMENT-ZERO-'+life,['D-01-B','D-01-E'],['S026'],'replay',{context:req},rr,'Terminal truth table on explicit positive checkpoint, zero steps unchanged/no fabricated events');
 ND('ND-HINT-NULL-'+life,['§25.3.2','D-01-C'],['S025','S026'],'validate',{context:req,result:{...rr,termination_hint:null}},{continuity:true,complete:true},'Null hint allowed even at terminal checkpoint; proof reconstructs once per predicate with no transitions');
}
save('cases.json',cases);
console.log(JSON.stringify({tests:tests.length,partial:tests.filter(t=>t.groups.length).length,unassigned:tests.filter(t=>!t.groups.length).length,vectors:vectors.length,cases:cases.length,categories:cases.reduce((o,c)=>(o[c.category]=(o[c.category]||0)+1,o),{})}));
