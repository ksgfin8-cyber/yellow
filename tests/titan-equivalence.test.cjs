'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),crypto=require('node:crypto');
const {DirectPriorityOracle}=require('./oracles/titan-direct-priority.cjs');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'closeout-titan-equivalence-'));
const original=fs.readFileSync('js/agents/titan_mvp_01.js'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('js/agents/agent.js','utf8'),ctx);vm.runInContext(original.toString(),ctx);
const Titan=vm.runInContext('TitanMVP01Agent',ctx);
const classes=['R_NEW','R_CONSUMED','F_NEW','F_VISITED','HAZARD','BLOCKED','OUT_OF_BOUNDS'];
const offset=[[0,-1],[1,0],[0,1],[-1,0]],types=['MOVE_N','MOVE_E','MOVE_S','MOVE_W'];
const report={source_sha256:hash(original),oracle_sha256:hash(fs.readFileSync('tests/oracles/titan-direct-priority.cjs')),analytic:'ANALYTIC_RESULT_UNDER_D4_FROM_UNCHANGED_DOCUMENT',finite:'NOT_EVALUATED',sequential:'NOT_EVALUATED',integration:'NOT_EVALUATED',cases:0,feedback_comparisons:0,divergences:[],evaluation_2001_2012_executed:false};
function save(){fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');}
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
function compare(titan,oracle,f,label){
    try{
        const before=structuredClone(f),a=structuredClone(titan.step(freeze(f))),b=oracle.step(f);
        assert.deepEqual(a,b);assert.deepEqual(f,before);
        const tm=structuredClone(titan.getDiagnostic().state_projected),om=oracle.memory();
        assert.deepEqual([...tm.visited].sort(),[...om.visited].sort());assert.deepEqual([...tm.consumed].sort(),[...om.consumed].sort());
        report.feedback_comparisons++;return a;
    }catch(e){report.divergences.push({first_point:label,feedback:f,error:String(e)});save();throw e;}
}
function fixture(pattern){
    // Select a bounded rectangular geometry realizing every OOB subset, including width/height1.
    const axis=(minus,plus)=>minus?(plus?{p:0,n:1}:{p:0,n:3}):(plus?{p:1,n:2}:{p:1,n:3});
    const ax=axis(pattern[3]==='OUT_OF_BOUNDS',pattern[1]==='OUT_OF_BOUNDS'),ay=axis(pattern[0]==='OUT_OF_BOUNDS',pattern[2]==='OUT_OF_BOUNDS');
    const center={x:ax.p,y:ay.p},grid=Array.from({length:ay.n},()=>Array(ax.n).fill('FREE'));
    pattern.forEach((c,i)=>{if(c!=='OUT_OF_BOUNDS'){const [dx,dy]=offset[i];grid[center.y+dy][center.x+dx]=c.startsWith('R_')?'RESOURCE':c.startsWith('F_')?'FREE':c;}});
    let tick=0,energy=100;const frames=[];
    function frame(position,events=null,delta=0){
        const local_view=Array.from({length:3},(_,y)=>Array.from({length:3},(_,x)=>({representation:grid[position.y+y-1]?.[position.x+x-1]??'OUT_OF_BOUNDS',occupied:false})));
        energy+=delta;return {observation:{tick:tick++,self:{id:'0987898',position:{...position},energy},local_view},has_prior_action:events!==null,last_action_result:events===null?null:{validity:'VALID',reason:'NONE',energy_delta:delta,events}};
    }
    frames.push(frame(center));
    // Observational setup histories, not autonomous policy rollouts: forced legal cardinal tours.
    // No private memory injection. No traversal of blocked/OOB/hazard or unconsumed-resource classes.
    pattern.forEach((c,i)=>{if(!['F_VISITED','R_CONSUMED'].includes(c))return;const [dx,dy]=offset[i],p={x:center.x+dx,y:center.y+dy};
        const events=[{type:'ENTITY_MOVED',entity_id:'0987898',position:{...p}}];
        if(c==='R_CONSUMED')events.push({type:'RESOURCE_CONSUMED',entity_id:'0987898',position:{...p}});
        frames.push(frame(p,events,c==='R_CONSUMED'?7:-1));frames.push(frame(center,[{type:'ENTITY_MOVED',entity_id:'0987898',position:{...center}}],-1));
    });
    return {pattern,frames,center};
}
test('EQ-01 independent direct priorities match2401cardinal class combinations, including physically coherent OOB geometry',()=>{
    for(const a of classes)for(const b of classes)for(const c of classes)for(const d of classes){
        const f=fixture([a,b,c,d]),titan=new Titan(),oracle=new DirectPriorityOracle();
        for(const [i,frame] of f.frames.entries())compare(titan,oracle,frame,{case:report.cases,classes:f.pattern,frame:i});
        const tm=titan.getDiagnostic().state_projected;
        for(let i=0;i<4;i++){const [dx,dy]=offset[i],key=(f.center.x+dx)+','+(f.center.y+dy);assert.equal(tm.visited.includes(key),['F_VISITED','R_CONSUMED'].includes(f.pattern[i]));assert.equal(tm.consumed.includes(key),f.pattern[i]==='R_CONSUMED');}
        report.cases++;
    }
    assert.equal(report.cases,2401);report.finite='FINITE_DIFFERENTIAL_PASS';
    report.finite_domain='All7^4observation/memory classes; memory built via valid observed cardinal tours, not injected. Setup actions are forced test history, not autonomous TITAN rollouts. No claim all patterns reachable by map generator or policy.';save();
});
test('EQ-02 four directional choices/ties, resource dominance and no opportunity preserve exact action shape',()=>{
    const coverage=[];
    for(let i=0;i<4;i++){const p=Array(4).fill('BLOCKED');p[i]='R_NEW';const t=new Titan(),o=new DirectPriorityOracle();const x=fixture(p);assert.equal(compare(t,o,x.frames[0],{direction:i}).type,types[i]);coverage.push(types[i]);}
    for(const p of [['R_NEW','R_NEW','R_NEW','R_NEW'],['F_NEW','F_NEW','F_NEW','F_NEW'],['F_NEW','R_NEW','F_NEW','BLOCKED'],['HAZARD','BLOCKED','OUT_OF_BOUNDS','HAZARD']]){
        const t=new Titan(),o=new DirectPriorityOracle(),f=fixture(p);const a=compare(t,o,f.frames[0],{special:p});assert.deepEqual(Object.keys(a),['type']);
        if(p.every(x=>x==='R_NEW')||p.every(x=>x==='F_NEW'))assert.equal(a.type,'MOVE_N');
        if(p[1]==='R_NEW'&&p[0]==='F_NEW')assert.equal(a.type,'MOVE_E');
        if(p[0]==='HAZARD')assert.equal(a.type,'WAIT');
    }
    report.directional_actions_covered=coverage;save();
});
test('EQ-03 sequential memory updates, no consumption inferred from visibility, no proposed visit, reset',()=>{
    const t=new Titan(),o=new DirectPriorityOracle(),x=fixture(['R_CONSUMED','F_VISITED','R_NEW','BLOCKED']);
    compare(t,o,x.frames[0],{sequence:'initial'});assert.deepEqual(o.memory().consumed,[]);assert.equal(o.memory().visited.length,1);
    for(const [i,f] of x.frames.slice(1).entries())compare(t,o,f,{sequence:i});
    assert.equal(o.memory().consumed.length,1);const after=t.getDiagnostic();
    const movedProposal=after.action.type;assert.ok(types.includes(movedProposal)||movedProposal==='WAIT');
    t.reset();o.reset();assert.equal(t.getDiagnostic(),null);assert.deepEqual(o.memory(),{visited:[],consumed:[]});
    compare(t,o,x.frames[0],{sequence:'after_reset'});assert.equal(o.memory().consumed.length,0);assert.equal(o.memory().visited.length,1);
    report.sequential='SEQUENTIAL_PASS';report.reset='PASS';save();
});
test('EQ-04 brief closed-loop integration: distinct controllers, seed1/config equal, trajectories and WLS1 match',()=>{
    const r=require('../tools/titan-mvp-01/runtime.cjs').loadRuntime(),base=require('../tools/titan-mvp-01/protocol.cjs').config(1,'titan_mvp_01');
    const cfg={...base,max_ticks:12,world_config:{...base.world_config,width:4,height:4}},calls={titan:0,oracle:0};
    const run=(name)=>{
        const c=new r.api.ExperimentConfig(r.realm({...cfg,agent_type:name==='titan'?'titan_mvp_01':'direct_priority_test_oracle'}));
        return r.api.run_experiment(c,()=>{const agent=name==='titan'?new r.api.TitanMVP01Agent():new DirectPriorityOracle();return {reset(){agent.reset();},step(f){calls[name]++;return agent.step(f);}};});
    };
    const a=run('titan'),b=run('oracle');assert.equal(a.status,'COMPLETED');assert.equal(b.status,'COMPLETED');
    assert.ok(r.api.replay_values_equal(a.trajectory.initial_state,b.trajectory.initial_state));assert.ok(r.api.replay_values_equal(a.trajectory.steps,b.trajectory.steps));assert.ok(r.api.replay_values_equal(a.trajectory.events,b.trajectory.events));assert.equal(a.trajectory.termination_reason,b.trajectory.termination_reason);
    assert.equal(calls.titan,12);assert.equal(calls.oracle,12);let bytePairs=0;
    const as=[a.trajectory.initial_state,...a.trajectory.steps.map(x=>x.world_state)],bs=[b.trajectory.initial_state,...b.trajectory.steps.map(x=>x.world_state)];
    for(let i=0;i<as.length;i++)for(const fn of ['canonical_world_state_bytes','canonical_full_state_bytes']){assert.deepEqual(Buffer.from(r.api[fn](as[i])),Buffer.from(r.api[fn](bs[i])));bytePairs++;}
    report.integration={status:'PASS',seed:1,width:4,height:4,max_ticks:12,controllers:['titan_mvp_01','direct_priority_test_oracle'],actions_each:12,states_each:13,WLS1_byte_pairs:bytePairs,config_label_difference:'Only agent_type label differs; physics/seed/horizon equal; world namespace common. Full control metadata deliberately not equated.'};
    fs.writeFileSync(path.join(output,'integration.json'),require('../tools/p01/codec.cjs').canonical({titan:structuredClone(a),oracle:structuredClone(b)})+'\n');save();
});
test('EQ-05 TITAN bytes and sources unchanged; no evaluation and no oracle production registration',()=>{
    assert.deepEqual(fs.readFileSync('js/agents/titan_mvp_01.js'),original);assert.ok(!fs.readFileSync('js/agents/registry.js','utf8').includes('DirectPriorityOracle'));
    report.original_source_unchanged=true;save();console.log(JSON.stringify({evidence_directory:output,...report}));
});
