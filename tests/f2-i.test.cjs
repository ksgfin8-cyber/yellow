const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const ctx=vm.createContext({});
for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
    vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
    if(src==='js/interface/feedback.js')break;
}
vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
const api=vm.runInContext('({World,WorldConfig,Cell,FeedbackConfig,validate_FeedbackConfig,build_feedback,build_observation,ContractError})',ctx);
const fields=['expose_validity','expose_reason','expose_events','expose_energy_delta'];
const clone=x=>structuredClone(x);
const keys=x=>Array.from(Reflect.ownKeys(x)).sort();
const config=patch=>({expose_validity:true,expose_reason:true,expose_events:true,expose_energy_delta:true,...patch});
function fixture(){
    const w=new api.World(new api.WorldConfig({...api.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:20,move_cost:2,resource_effect:7}));
    w.initialize(1);w.get_experimental_entity().position={x:1,y:1};w.state.grid[1][2]=new api.Cell('FREE',{kind:'RESOURCE',stock:1});
    const observation=api.build_observation(w,w.get_experimental_entity(),1);
    const result=w.apply_action({type:'MOVE_E'});return {w,observation,result};
}
const built=(o,r,c=config())=>api.build_feedback(o,r,c);
const expectedConfig={expose_validity:true,expose_reason:false,expose_events:false,expose_energy_delta:true};
function assertSchema(feedback,prior){
    assert.deepEqual(keys(feedback),['has_prior_action','last_action_result','observation']);
    assert.equal(feedback.has_prior_action,prior);
    if(prior)assert.deepEqual(keys(feedback.last_action_result),['energy_delta','events','reason','validity']);
    else assert.equal(feedback.last_action_result,null);
}
function unchanged(o,r,fn){const beforeO=clone(o),beforeR=clone(r);const value=fn();assert.deepEqual(clone(o),beforeO);assert.deepEqual(clone(r),beforeR);return value;}
const invalid=fn=>assert.throws(fn,{name:'ContractError',message:'world transition failed'});

test('F2I-01 recovered §17: four exact defaults, immutable instance and captured boolean values',()=>{
    const d=api.FeedbackConfig.defaults();assert.deepEqual(clone(d),expectedConfig);assert.deepEqual(keys(d),[...fields].sort());assert.ok(Object.isFrozen(d));
    const source=config(),c=new api.FeedbackConfig(source);source.expose_events=false;assert.equal(c.expose_events,true);assert.equal(api.validate_FeedbackConfig(c),true);
});
test('F2I-02: reject coercions on each flag, not truthiness conversion',()=>{
    for(const field of fields)for(const value of [0,1,'true','false','',null,undefined,[],{},new Boolean(true),1n]){
        const c=config({[field]:value});assert.equal(api.validate_FeedbackConfig(c),false);
        assert.throws(()=>new api.FeedbackConfig(c),{name:'ContractError',message:'invalid feedback_config'});
    }
});
test('F2I-03: reject missing, unknown, inherited, symbolic and accessor config fields',()=>{
    for(const field of fields){const c=config();delete c[field];assert.throws(()=>new api.FeedbackConfig(c),api.ContractError);}
    for(const c of [null,undefined,{},[],{...config(),legacy:true},Object.create(config()),{...config(),[Symbol('extra')]:true}])assert.throws(()=>new api.FeedbackConfig(c),api.ContractError);
    const c=config();Object.defineProperty(c,'expose_events',{get(){assert.fail('getter invoked');}});assert.throws(()=>new api.FeedbackConfig(c),api.ContractError);
});
test('F2I-04: validate config first, including when there is no prior action',()=>{
    const {observation}=fixture();
    for(const c of [null,{},config({expose_energy_delta:0})])assert.throws(()=>built(observation,null,c),{name:'ContractError',message:'invalid feedback_config'});
    assert.throws(()=>built(null,false,{}),{name:'ContractError',message:'invalid feedback_config'});
});
test('F2I-05 §17: no action is explicit null, with false has_prior_action and detached observation',()=>{
    const {observation}=fixture(),f=unchanged(observation,null,()=>built(observation,null));assertSchema(f,false);
    assert.deepEqual(clone(f.observation),clone(observation));assert.notEqual(f.observation,observation);assert.notEqual(f.observation.self.position,observation.self.position);
});
test('F2I-06: fully exposed real ActionResult has exact values and fresh event records',()=>{
    const {observation,result}=fixture(),f=unchanged(observation,result,()=>built(observation,result));assertSchema(f,true);
    assert.deepEqual(clone(f.last_action_result),clone(result));assert.equal(f.last_action_result.energy_delta,5);
    assert.deepEqual(Array.from(f.last_action_result.events,e=>e.type),['ENTITY_MOVED','RESOURCE_CONSUMED']);
    assert.notEqual(f.last_action_result.events[0],result.events[0]);assert.notEqual(f.last_action_result.events[0].position,result.events[0].position);
});
test('F2I-07: all 16 flag combinations match independently specified four-field projection',()=>{
    const {observation,result}=fixture();
    for(let mask=0;mask<16;mask++){
        const flags={expose_validity:!!(mask&1),expose_reason:!!(mask&2),expose_events:!!(mask&4),expose_energy_delta:!!(mask&8)};
        const f=built(observation,result,new api.FeedbackConfig(flags));assertSchema(f,true);
        const expected={validity:mask&1?'VALID':null,reason:mask&2?'NONE':null,energy_delta:mask&8?5:0,events:mask&4?clone(result.events):[]};
        assert.deepEqual(clone(f.last_action_result),expected);assert.deepEqual(clone(f.observation),clone(observation));
    }
});
test('F2I-08 policy: hidden labels are null, events empty and delta +0; no fabricated statuses',()=>{
    const {observation,result}=fixture();const f=built(observation,result,config({expose_validity:false,expose_reason:false,expose_events:false,expose_energy_delta:false}));
    assert.deepEqual(clone(f.last_action_result),{validity:null,reason:null,energy_delta:0,events:[]});assert.ok(Object.is(f.last_action_result.energy_delta,+0));
    const text=JSON.stringify(f.last_action_result);for(const value of ['VALID','NONE','ENTITY_MOVED','RESOURCE_CONSUMED'])assert.equal(text.includes(value),false);
});
test('F2I-09 privacy: all masks are invariant under changes solely to disabled valid input fields',()=>{
    const {observation,result}=fixture();
    const alternatives={validity:['INVALID','FAILED'],reason:['OUT_OF_BOUNDS','INSUFFICIENT_ENERGY'],energy_delta:[-9876,-0,Number.MAX_VALUE],events:[[],[{type:'HAZARD_TRIGGERED',entity_id:'different',position:{x:99,y:88}}]]};
    const names=['validity','reason','events','energy_delta'];
    for(let mask=0;mask<16;mask++){
        const flags=Object.fromEntries(fields.map((key,i)=>[key,Boolean(mask&(1<<i))]));const baseline=clone(built(observation,result,flags));
        for(let i=0;i<names.length;i++)if(!(mask&(1<<i)))for(const value of alternatives[names[i]]){
            const changed={...result,[names[i]]:value};assert.deepEqual(clone(built(observation,changed,flags)),baseline);
        }
    }
});
test('F2I-10 privacy: no hidden source retained through extra properties, prototypes or aliases',()=>{
    const {observation,result}=fixture();const f=built(observation,result,config({expose_validity:false,expose_reason:false,expose_events:false,expose_energy_delta:false}));
    assertSchema(f,true);assert.equal(Object.getPrototypeOf(f.last_action_result),vm.runInContext('Object.prototype',ctx));
    result.validity='FAILED';result.reason='INSUFFICIENT_ENERGY';result.energy_delta=-999;result.events[0].position.x=999;
    assert.deepEqual(clone(f.last_action_result),{validity:null,reason:null,energy_delta:0,events:[]});
});
test('F2I-11: observation/result/output/calls are independent in both directions',()=>{
    const {observation,result}=fixture();const f=built(observation,result),g=built(observation,result),beforeO=clone(observation),beforeR=clone(result);
    f.observation.self.position.x=999;f.observation.local_view[0][0].representation='caller';f.last_action_result.events[0].position.x=888;f.last_action_result.events.push({});
    assert.deepEqual(clone(observation),beforeO);assert.deepEqual(clone(result),beforeR);assert.deepEqual(clone(g.observation),beforeO);assert.deepEqual(clone(g.last_action_result),beforeR);
    observation.self.position.y=777;result.events[1].position.y=666;assert.notEqual(g.observation.self.position.y,777);assert.notEqual(g.last_action_result.events[1].position.y,666);
    assert.notEqual(g.last_action_result.events[0].position,g.last_action_result.events[1].position);
});
test('F2I-12: frozen inputs stay pure, deterministic and consume no real RNG',()=>{
    const {w,observation,result}=fixture();const before=clone(w.state),rng=w.rng.get_state();
    function freeze(x){if(x&&typeof x==='object'){for(const key of Object.keys(x))freeze(x[key]);Object.freeze(x);}return x;}
    freeze(observation);freeze(result);const c=freeze(config());
    const a=unchanged(observation,result,()=>built(observation,result,c)),b=built(observation,result,c);
    assert.deepEqual(clone(a),clone(b));assert.deepEqual(clone(w.state),before);assert.equal(w.rng.get_state(),rng);
});
test('F2I-13: uint64 tick and binary64 numbers preserve exact representation when exposed',()=>{
    const {observation,result}=fixture();
    for(const tick of [Number.MAX_SAFE_INTEGER,0n,9007199254740993n,0xffffffffffffffffn])for(const value of [-0,Number.MIN_VALUE,Number.MAX_VALUE]){
        const o=clone(observation);o.tick=tick;o.self.energy=value;const r={...result,energy_delta:value};const f=built(o,r);
        assert.equal(f.observation.tick,tick);assert.ok(Object.is(f.observation.self.energy,value));assert.ok(Object.is(f.last_action_result.energy_delta,value));
    }
});
test('F2I-14 validation: malformed Observation and its closed subrecords rejected',()=>{
    const {observation,result}=fixture();const cases=[null,{}, {...observation,time:0}, {...observation,tick:-1}, {...observation,tick:2n**64n}];
    for(const mutate of [o=>o.self.id='',o=>o.self.energy=Infinity,o=>o.self.position.x=-1,o=>o.self.position.z=0,o=>o.self.lifecycle='ACTIVE',o=>o.local_view=[],o=>o.local_view[0].pop(),o=>o.local_view[0][0].occupied=true,o=>o.local_view[0][0].representation='UNKNOWN',o=>o.local_view[0][0].stock=1]){const o=clone(observation);mutate(o);cases.push(o);}
    for(const o of cases)unchanged(o,result,()=>invalid(()=>built(o,result)));
});
test('F2I-15 validation: malformed ActionResult rejected even when all fields are hidden',()=>{
    const {observation,result}=fixture();const hidden=Object.fromEntries(fields.map(key=>[key,false]));
    const cases=[false,0,'',undefined,{}, {...result,extra:1},{...result,validity:'UNKNOWN'},{...result,reason:'UNKNOWN'}, {...result,energy_delta:NaN},{...result,energy_delta:1n},{...result,events:null}, {...result,events:new Array(1)},
        {...result,events:[{type:'ENTITY_DIED',entity_id:'0987898',position:{x:0,y:0}}]},
        {...result,events:[{...result.events[0],tick:0}]}, {...result,events:[{...result.events[0],position:{x:'2',y:1}}]}];
    for(const r of cases)unchanged(observation,r,()=>invalid(()=>built(observation,r,hidden)));
});
test('F2I-16: input data accessors and sparse arrays rejected without evaluating getters',()=>{
    const {observation,result}=fixture();
    const o={...observation};Object.defineProperty(o,'self',{get(){assert.fail('observation getter');}});invalid(()=>built(o,result));
    const r={...result};Object.defineProperty(r,'energy_delta',{get(){assert.fail('result getter');}});invalid(()=>built(observation,r));
    const events=[];Object.defineProperty(events,'0',{get(){assert.fail('event slot getter');}});invalid(()=>built(observation,{...result,events}));
    const sparse=clone(observation);delete sparse.local_view[1][1];invalid(()=>built(sparse,result));
});
test('F2I-17: real WAIT, rejected move and hazard results integrate structurally',()=>{
    for(const type of ['WAIT','MOVE_E','MOVE_N']){
        const {w}=fixture();w.get_experimental_entity().position={x:0,y:0};w.state.grid[0][1]=new api.Cell('FREE',{kind:'HAZARD'});
        const o=api.build_observation(w,w.get_experimental_entity(),1),r=w.apply_action({type});const f=built(o,r);
        assertSchema(f,true);assert.deepEqual(clone(f.last_action_result),clone(r));assert.deepEqual(clone(f.observation),clone(o));
    }
});
test('F2I-18: presence bit distinguishes null history from an existing fully masked action',()=>{
    const {observation,result}=fixture(),hidden=Object.fromEntries(fields.map(key=>[key,false]));
    const absent=built(observation,null,hidden),prior=built(observation,result,hidden);
    assert.equal(absent.has_prior_action,false);assert.equal(absent.last_action_result,null);assert.equal(prior.has_prior_action,true);assert.notEqual(prior.last_action_result,null);
});
