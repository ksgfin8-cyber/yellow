const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const ctx=vm.createContext({});
// Load only configuration dependencies, not agents/registry/Recorder/Experiment.
for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
    vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
    if(src==='js/interface/feedback.js')break;
}
for(const src of ['js/experiment/experiment_config.js','js/experiment/tick_transaction.js'])vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
vm.runInContext('Math.random=()=>{throw new Error("Math.random forbidden");}',ctx);
const api=vm.runInContext('({ExperimentConfig,validate_ExperimentConfig,WorldConfig,FeedbackConfig,ContractError,World,Cell,derive_seed,initialize_world,determine_termination,execute_tick_transaction})',ctx);
const clone=x=>structuredClone(x),keys=x=>Array.from(Reflect.ownKeys(x)).sort();
function input(patch={}){return {experiment_seed:1,max_ticks:5,world_config:api.WorldConfig.defaults(),feedback_config:api.FeedbackConfig.defaults(),agent_type:'wait',...patch};}
const make=p=>new api.ExperimentConfig(p);
const bad=fn=>assert.throws(fn,api.ContractError);
test('F3B-01 §19: exact five-field schema, no absent/unknown/inherited/accessor fields',()=>{
    const c=make(input());assert.deepEqual(keys(c),['agent_type','experiment_seed','feedback_config','max_ticks','world_config']);
    for(const field of keys(c)){const p=input();delete p[field];assert.equal(api.validate_ExperimentConfig(p),false);bad(()=>make(p));}
    for(const p of [null,undefined,{},[],{...input(),extra:0},Object.create(input()),{...input(),[Symbol('extra')]:true}])bad(()=>make(p));
    const p=input();Object.defineProperty(p,'max_ticks',{get(){assert.fail('getter');}});bad(()=>make(p));
});
test('F3B-02: seed accepts exact nonzero uint32 boundaries without truncation',()=>{
    for(const seed of [1,42,0x80000000,0xffffffff]){const c=make(input({experiment_seed:seed}));assert.equal(c.experiment_seed,seed);assert.equal(typeof c.experiment_seed,'number');assert.equal(api.validate_ExperimentConfig(c),true);}
});
test('F3B-03: reject seeds that legacy truncation/coercion would repair',()=>{
    for(const seed of [0,-0,-1,0x100000000,0x100000001,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER,'1',true,1n,null,undefined,{valueOf(){assert.fail('coercion');}}]){
        const p=input({experiment_seed:seed});assert.equal(api.validate_ExperimentConfig(p),false);bad(()=>make(p));
    }
});
test('F3B-04 §19.1/P01: zero/0n valid and usable by F3-A terminal query',()=>{
    const w=new api.World(api.WorldConfig.defaults());w.initialize(1);
    for(const limit of [0,0n]){const c=make(input({max_ticks:limit}));assert.equal(c.max_ticks,limit);assert.equal(api.determine_termination(w,c.max_ticks),'MAX_TICKS_REACHED');}
});
test('F3B-05 P01: Number safe and full uint64 BigInt values retain exact type and bits',()=>{
    for(const limit of [-0,0,1,Number.MAX_SAFE_INTEGER,0n,1n,9007199254740993n,0xffffffffffffffffn]){
        const c=make(input({max_ticks:limit}));assert.ok(Object.is(c.max_ticks,limit));assert.equal(typeof c.max_ticks,typeof limit);
    }
});
test('F3B-06 P01: reject invalid limits with invalid max_ticks, no normalization',()=>{
    for(const limit of [-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,-1n,1n<<64n,'0',true,false,null,undefined,{valueOf(){assert.fail('coercion');}}]){
        const p=input({max_ticks:limit});assert.equal(api.validate_ExperimentConfig(p),false);
        assert.throws(()=>make(p),{name:'ContractError',message:'invalid max_ticks'});
    }
});
test('F3B-07 §6: WORLD config validation unchanged, including closed fields/product/topology',()=>{
    for(const wc of [null,{}, {...api.WorldConfig.defaults(),width:0},{...api.WorldConfig.defaults(),width:1025,height:1024},{...api.WorldConfig.defaults(),topology:'TOROIDAL'},{...api.WorldConfig.defaults(),extra:1}]){
        const p=input({world_config:wc});assert.equal(api.validate_ExperimentConfig(p),false);assert.throws(()=>make(p),{name:'ContractError',message:'invalid world_config'});
    }
});
test('F3B-08 §17: require all four real Feedback booleans, no legacy repair',()=>{
    for(const fc of [null,{}, {...api.FeedbackConfig.defaults(),expose_events:1},{expose_validity:true,expose_reason:false,expose_events:false},{...api.FeedbackConfig.defaults(),extra:true}]){
        const p=input({feedback_config:fc});assert.equal(api.validate_ExperimentConfig(p),false);assert.throws(()=>make(p),{name:'ContractError',message:'invalid feedback_config'});
    }
});
test('F3B-09 policy: valid Unicode identifiers do not require legacy registration or ASCII grammar',()=>{
    assert.equal(vm.runInContext('typeof AGENT_REGISTRY',ctx),'undefined');
    for(const name of ['wait','random','rule','custom-agent','α/😀:v2','world','__proto__','toString',' ','\0']){
        const c=make(input({agent_type:name}));assert.equal(c.agent_type,name);assert.equal(api.validate_ExperimentConfig(c),true);assert.ok(Number.isInteger(api.derive_seed(c.experiment_seed,c.agent_type)));
    }
});
test('F3B-10 policy: identifier rejects empty/nonstring/invalid Unicode without coercion',()=>{
    for(const name of ['',null,undefined,0,true,{},new String('wait'),'\ud800','\udfff']){const p=input({agent_type:name});assert.equal(api.validate_ExperimentConfig(p),false);bad(()=>make(p));}
});
test('F3B-11: outer and nested configs frozen and detached from raw mutable input',()=>{
    const wc={...api.WorldConfig.defaults()},fc={...api.FeedbackConfig.defaults()},p=input({world_config:wc,feedback_config:fc});const c=make(p);
    for(const value of [c,c.world_config,c.feedback_config])assert.ok(Object.isFrozen(value));
    assert.notEqual(c.world_config,wc);assert.notEqual(c.feedback_config,fc);assert.ok(c.world_config instanceof api.WorldConfig);assert.ok(c.feedback_config instanceof api.FeedbackConfig);
    wc.initial_energy=999;fc.expose_events=true;p.experiment_seed=42;p.max_ticks=99;p.agent_type='changed';
    assert.equal(c.world_config.initial_energy,100);assert.equal(c.feedback_config.expose_events,false);assert.equal(c.experiment_seed,1);assert.equal(c.max_ticks,5);assert.equal(c.agent_type,'wait');
    assert.equal(Reflect.set(c,'max_ticks',123),false);assert.equal(Reflect.set(c.world_config,'width',0),false);assert.equal(Reflect.set(c.feedback_config,'expose_events',true),false);
});
test('F3B-12 §11.6: identical input yields reproducible value identity and normative seed vectors',()=>{
    const a=make(input({agent_type:'random_agent'})),b=make(input({agent_type:'random_agent'}));assert.deepEqual(clone(a),clone(b));
    assert.equal(api.derive_seed(a.experiment_seed,'world'),2448580590);assert.equal(api.derive_seed(a.experiment_seed,a.agent_type),84506387);
    assert.equal(api.derive_seed(a.experiment_seed,a.agent_type),api.derive_seed(b.experiment_seed,b.agent_type));
});
test('F3B-13 §11.6: preserve Unicode identity, with no trim or normalization',()=>{
    const names=['é','e\u0301','wait',' wait '];const configs=names.map(agent_type=>make(input({agent_type})));
    configs.forEach((c,i)=>assert.equal(c.agent_type,names[i]));
    assert.notEqual(api.derive_seed(1,configs[0].agent_type),api.derive_seed(1,configs[1].agent_type));
    assert.notEqual(api.derive_seed(1,configs[2].agent_type),api.derive_seed(1,configs[3].agent_type));
});
test('F3B-14: accept valid records/instances by contract, canonicalize only representation objects',()=>{
    const p=input({world_config:{...api.WorldConfig.defaults()},feedback_config:{...api.FeedbackConfig.defaults()}}),before=clone(p),c=make(p);
    assert.deepEqual(clone(p),before);assert.deepEqual(clone(c),before);assert.equal(api.validate_ExperimentConfig(c),true);
    const second=make(c);assert.deepEqual(clone(second),clone(c));assert.notEqual(second.world_config,c.world_config);
});
test('F3B-15 audit: ExperimentConfig and F3-A accept exactly the same temporal domain',()=>{
    const w=new api.World(api.WorldConfig.defaults());w.initialize(1);
    const values=[0,-0,1,Number.MAX_SAFE_INTEGER,0n,9007199254740993n,0xffffffffffffffffn,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,-1n,1n<<64n,'1',true,null];
    for(const max_ticks of values){let configOK=true,kernelOK=true;try{make(input({max_ticks}));}catch(e){assert.equal(e.name,'ContractError');configOK=false;}try{api.determine_termination(w,max_ticks);}catch(e){assert.equal(e.message,'invalid max_ticks');kernelOK=false;}assert.equal(configOK,kernelOK);}
});
test('F3B-16: configured values drive real initialization/tick without running Experiment or Recorder',()=>{
    const wc={...api.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,move_cost:2};
    const c=make(input({world_config:wc,max_ticks:1n,agent_type:'external-factory'}));const seed=api.derive_seed(c.experiment_seed,'world');
    const initial=api.initialize_world(c.world_config,seed),w=new api.World(c.world_config),adapted=w.initialize(seed);assert.deepEqual(clone(adapted),clone(initial));
    w.get_experimental_entity().position={x:1,y:1};const confirmed=api.execute_tick_transaction(w,{type:'MOVE_E'},c.max_ticks);
    assert.equal(confirmed.tick,1);assert.equal(confirmed.termination,'MAX_TICKS_REACHED');assert.equal(confirmed.world_state.entities.get('0987898').energy,8);
    const prior=clone(confirmed);w.get_experimental_entity().energy=999;assert.deepEqual(clone(confirmed),prior);
});
test('F3B-17: no RNG, factory, Recorder or kernel dependency for configuration construction',()=>{
    assert.equal(vm.runInContext('typeof Recorder',ctx),'undefined');assert.equal(vm.runInContext('typeof Experiment',ctx),'undefined');
    const isolated=vm.createContext({});
    for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
        vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),isolated);if(src==='js/interface/feedback.js')break;
    }
    vm.runInContext(fs.readFileSync(path.join(root,'js/experiment/experiment_config.js'),'utf8'),isolated);
    assert.equal(vm.runInContext('typeof determine_termination',isolated),'undefined');
    vm.runInContext('PRNG=class{constructor(){throw new Error("configuration must not create RNG");}};Math.random=()=>{throw new Error("configuration random");};',isolated);
    assert.equal(vm.runInContext('new ExperimentConfig({experiment_seed:1,max_ticks:0n,world_config:WorldConfig.defaults(),feedback_config:FeedbackConfig.defaults(),agent_type:"custom"}).max_ticks',isolated),0n);
});
test('F3B-18: nested numeric representations retain exact input bits, without seed/limit normalization',()=>{
    const wc={...api.WorldConfig.defaults(),initial_energy:-0};const c=make(input({world_config:wc,experiment_seed:0xffffffff,max_ticks:9007199254740993n}));
    assert.ok(Object.is(c.world_config.initial_energy,-0));assert.equal(c.experiment_seed,4294967295);assert.equal(c.max_ticks,9007199254740993n);assert.equal(typeof c.max_ticks,'bigint');
});
