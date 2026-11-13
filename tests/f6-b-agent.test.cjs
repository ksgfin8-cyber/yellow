const {test} = require('node:test'), assert = require('node:assert/strict');
const {loadRuntime} = require('../tools/p01/runtime.cjs');
const {api} = loadRuntime();
function feedback(rows, position = {x: 0, y: 0}, events = []) {
    const names = {'.':'FREE','#':'BLOCKED','R':'RESOURCE','H':'HAZARD','X':'OUT_OF_BOUNDS'};
    return {observation:{tick:0,self:{id:'a',position,energy:240},local_view:rows.map(r=>[...r].map(x=>({representation:names[x],occupied:false})))},
        has_prior_action:events.length>0,last_action_result:events.length?{events}:null};
}
test('F6B-AG01 nearest resources and numeric y,x tie order',()=>{
    const a=new api.FrontierMemoryAgent();assert.equal(a.step(feedback(['.R.','R.R','...'])).type,'MOVE_N');
    a.reset();assert.equal(a.step(feedback(['...','R.R','...'])).type,'MOVE_W');
});
test('F6B-AG02 resources take priority over closer frontiers',()=>{
    const a=new api.FrontierMemoryAgent();a.step(feedback(['...','...','...']));
    a.known.set('3,0',{x:3,y:0,representation:'RESOURCE'});a.known.set('2,0',{x:2,y:0,representation:'FREE'});
    assert.equal(a.step(feedback(['...','...','...'])).type,'MOVE_E');
});
test('F6B-AG03 BFS paths avoid blocked/unknown cells; N,E,S,W path ties',()=>{
    const a=new api.FrontierMemoryAgent();
    assert.equal(a.step(feedback(['.#R','...','...'],{x:1,y:2})).type,'MOVE_E');
    a.reset();assert.equal(a.step(feedback(['R..','...','...'])).type,'MOVE_N');
});
test('F6B-AG04 inaccessible resources are not destinations; unknown cells are not traversed',()=>{
    const a=new api.FrontierMemoryAgent();a.known.set('4,0',{x:4,y:0,representation:'RESOURCE'});
    assert.equal(a.step(feedback(['###','#.#','###'])).type,'WAIT');
});
test('F6B-AG05 consumed resource labels remain observed but are no longer targets',()=>{
    const a=new api.FrontierMemoryAgent();
    assert.equal(a.step(feedback(['XXX','X.R','XXX'])).type,'MOVE_E');
    const event={type:'RESOURCE_CONSUMED',entity_id:'a',position:{x:1,y:0}};
    assert.equal(a.step(feedback(['XXX','.RX','XXX'],{x:1,y:0},[event])).type,'WAIT');
    assert.ok(a.consumed.has('1,0'));
});
test('F6B-AG06 reachable frontiers use distance then y,x; OOB is known',()=>{
    const a=new api.FrontierMemoryAgent();assert.equal(a.step(feedback(['...','...','...'])).type,'MOVE_N');
    a.reset();assert.equal(a.step(feedback(['XXX','X.X','XXX'])).type,'WAIT');
});
test('F6B-AG07 reset clears all episode state and decisions repeat',()=>{
    const a=new api.FrontierMemoryAgent(),f=feedback(['...','..R','...']);const action=a.step(f).type;
    a.consumed.add('1,0');a.reset();assert.equal(a.known.size,0);assert.equal(a.visited.size,0);assert.equal(a.consumed.size,0);
    assert.equal(a.step(f).type,action);
});
test('F6B-AG08 frozen feedback stays untouched and only allowed observations are used',()=>{
    const a=new api.FrontierMemoryAgent(),f=feedback(['...','..R','...']);const before=structuredClone(f);
    function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}}freeze(f);
    assert.equal(a.step(f).type,'MOVE_E');assert.deepEqual(f,before);
});
test('F6B-AG09 new agent participates using existing factory interface and reset',()=>{
    const r=loadRuntime(),c=new r.api.ExperimentConfig({experiment_seed:1,max_ticks:2,agent_type:'frontier_memory_v1',
        world_config:{...r.api.WorldConfig.defaults(),width:3,height:3,obstacle_density:0,resource_density:0,hazard_density:0},feedback_config:r.api.FeedbackConfig.defaults()});
    const a=r.run(c),b=r.run(c);assert.equal(a.status,'COMPLETED');assert.equal(a.trajectory.steps.length,2);assert.deepEqual(a,b);
});
test('F6B-AG10 works without WORLD, Recorder, seeds or RNG globals',()=>{
    const fs=require('node:fs'),vm=require('node:vm'),ctx=vm.createContext({});
    vm.runInContext(fs.readFileSync('js/agents/agent.js','utf8'),ctx);
    vm.runInContext(fs.readFileSync('js/agents/frontier_memory_agent.js','utf8'),ctx);
    vm.runInContext('Math.random=()=>{throw Error("forbidden RNG")}',ctx);
    const a=vm.runInContext('new FrontierMemoryAgent()',ctx);
    assert.equal(a.step(feedback(['...','..R','...'])).type,'MOVE_E');
});
