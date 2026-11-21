'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),os=require('node:os'),path=require('node:path');
const {loadRuntime}=require('../tools/p01/runtime.cjs');
function small(radius){const r=loadRuntime(),cfg={experiment_seed:1,agent_type:'wait',max_ticks:1,world_config:{...r.api.WorldConfig.defaults(),width:1,height:1,obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:10,observation_radius:radius},feedback_config:{expose_validity:true,expose_reason:true,expose_events:true,expose_energy_delta:true}};return {r,cfg};}
test('CLOSE-01 known CC-04: valid radius512 exceeds operational observation capacity before allocating view',()=>{
    const {r,cfg}=small(512);new r.api.ExperimentConfig(cfg);
    assert.throws(()=>r.api.run_experiment(cfg,(t,s)=>r.api.create_agent(t,s)),/observation window exceeds implementation capacity/);
});
test('CLOSE-02 known CC-05: radius0 supported by WAIT but Rule reports a visible agent contract failure',()=>{
    const {r,cfg}=small(0),factory=(t,s)=>r.api.create_agent(t,s);
    assert.equal(r.api.run_experiment(cfg,factory).status,'COMPLETED');
    const rule=r.api.run_experiment({...cfg,agent_type:'rule'},factory);assert.equal(rule.status,'FAILED');assert.equal(rule.failure_reason,'AGENT_CONTRACT_ERROR');assert.equal(rule.trajectory.steps.length,0);
});
test('CLOSE-03 G1 worker verification failure returns diagnostic, not available canonical prefix: G2 debt',()=>{
    let callback,message;const prefix={config:{},result:{status:'FAILED',trajectory:{steps:[]},failure_reason:'AGENT_CONTRACT_ERROR'}};
    const context={process:{once:(_,fn)=>{callback=fn;},resourceUsage:()=>({userCPUTime:1,systemCPUTime:1,maxRSS:1}),hrtime:{bigint:()=>1n},send:(m,fn)=>{message=m;fn();},disconnect(){}},require:identifier=>{
        if(identifier==='./protocol.cjs')return {assertRequest:()=>{},config:()=>({})};
        if(identifier==='./identity.cjs')return {check:()=>({freeze_id:'test'})};
        if(identifier==='./runtime.cjs')return {loadRuntime:()=>({run:()=>prefix})};
        if(identifier==='./verify.cjs')return {verifyEpisode:()=>{throw Error('injected verification rejection of available prefix');}};
        throw Error('unexpected import');
    }};
    vm.runInNewContext(fs.readFileSync('tools/titan-mvp-01/worker.cjs','utf8'),context);callback({episode:{seed:1,agent:'titan_mvp_01',repetition:1},candidate:'unused',freeze_id:'test'});
    assert.equal(message.kind,'error');assert.match(message.diagnostic,/available prefix/);assert.equal(Object.hasOwn(message,'result'),false);
});
test('CLOSE-04 AUD-C01 remains in held128 controller: incomplete done starts next fake unit before batch rejection',async()=>{
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'closeout-audc01-parent-')),target=path.join(dir,'evidence');
    const p=require('../tools/research/wl-rc1-r1/plan.cjs'),condition={profile:p.FIXTURE,operation:'tick',block:0,seed:21001,mode:'MINIMAL',warmup:1,samples:2};
    const requests=[0,1].map(()=>({kind:'R1_FIXTURE',control:'ok',freeze_id:'test',condition}));
    const r=await require('../tools/research/wl-rc1-r1/session.cjs').run({directory:target,requests,freeze_id:'test',worker:path.resolve('tests/fixtures/wl-rc1-r1/control.cjs')});
    assert.equal(r.attempts.length,2);assert.equal(r.status,'PARTIAL');assert.match(r.controller_error,/incomplete samples/);
    console.log('AUD-C01 synthetic evidence retained: '+target);
});
