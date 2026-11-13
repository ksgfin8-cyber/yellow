const {test}=require('node:test'),assert=require('node:assert/strict');
const {measure,compareCampaign}=require('../tools/p01/metrics.cjs');
function state(x=0,time=0){return {time,grid:[[{effect:{kind:'RESOURCE',stock:1}},{effect:null}]],entities:new Map([['e',{id:'e',position:{x,y:0}}]])};}
// Independent manual fixtures share a world with 3 resources and energy301.
// Three paid actions (count moves then waits, cost100 each, resource8), then rejection.
function result(count=1){
 const makeState=(x,time)=>({time,grid:[Array.from({length:5},(_,i)=>({effect:i>0&&i<=3?{kind:'RESOURCE',stock:i<=x?0:1}:null}))],
  entities:new Map([['e',{id:'e',position:{x,y:0},energy:301-100*Math.min(time,3)+8*x,lifecycle:'ACTIVE'}]])});
 const steps=Array.from({length:3},(_,i)=>({world_state:makeState(Math.min(i+1,count),i+1),action_result:{validity:'VALID',reason:'NONE'}}));
 steps.push({world_state:makeState(count,4),action_result:{validity:'FAILED',reason:'INSUFFICIENT_ENERGY'}});
 return {status:'COMPLETED',failure_reason:null,trajectory:{initial_state:makeState(0,0),steps,
 events:Array.from({length:count},(_,i)=>({source:'action',type:'RESOURCE_CONSUMED',position:{x:i+1,y:0},tick:i+1})),termination_reason:'MAX_TICKS_REACHED'}};
}
function entries(delta=1){return [1,2,3,4].flatMap(seed=>['wait','random','rule','frontier_memory_v1'].flatMap(agent=>[1,2].map(repetition=>({seed,agent,repetition,
 artifact:{provenance:{seeds:{experiment:seed},algorithm:{id:agent}},operational:{attempt_id:`${seed}-${agent}-${repetition}`,operational_status:'RETURNED'},data:{config:{seed,agent},result:result(agent==='frontier_memory_v1'?2+delta:2)}},
 verification:{status:'COMPLETE_MATCH',initial_full_hex:'manual-byte-fixture'}}))));}
test('F6B-ME01 manual counts, unique positions and exact original rejection category',()=>{
 const r=result(),before=structuredClone(r),m=measure(r);assert.equal(m.resources_consumed,1);assert.equal(m.distinct_positions,2);assert.deepEqual(m.rejected_actions,{'FAILED/INSUFFICIENT_ENERGY':1});assert.equal(m.duration_ticks,4);assert.equal(m.initial_resource_count,3);assert.deepEqual(r,before);
});
test('F6B-ME02 duration across BigInt origin and initialization failure are explicit',()=>{
 const r=result();r.trajectory.initial_state.time=9007199254740992n;r.trajectory.steps.forEach((s,i)=>s.world_state.time=9007199254740993n+BigInt(i));assert.equal(measure(r).duration_ticks,4);
 assert.equal(measure({status:'FAILED',failure_reason:'INITIALIZATION_ERROR',trajectory:null}).kind,'INITIALIZATION_FAILURE');
});
test('F6B-ME03 manual paired distribution does not count repeated decisions as extra N',()=>{
 const x=entries(1),before=structuredClone(x),r=compareCampaign(x);assert.equal(r.technical_status,'PASS');assert.equal(r.eligible_pairs,4);assert.equal(r.attempts,32);assert.equal(r.distribution.mean,1);assert.equal(r.distribution.wins,4);assert.equal(r.final_hypothesis,'NOT_EVALUATED');assert.deepEqual(x,before);
});
test('F6B-ME04 negative/zero effect is scientifically valid, not technical failure',()=>{
 for(const d of [-1,0]){const r=compareCampaign(entries(d));assert.equal(r.technical_status,'PASS');assert.equal(r.distribution.mean,d);}
});
test('F6B-ME05 failures and missing scenarios cannot be dropped to obtain a mean',()=>{
 let x=entries();x.pop();assert.equal(compareCampaign(x).technical_status,'NOT_EVALUABLE');
 x=entries();x[0].artifact.operational.operational_status='TIMEOUT';x[0].artifact.data.result=null;x[0].verification={status:'OPERATIONAL_FAILURE_RECORDED'};
 const r=compareCampaign(x);assert.equal(r.technical_status,'NOT_EVALUABLE');assert.equal(r.distribution,null);
});
test('F6B-ME06 all-agent initialization failure excludes scenario without replacement',()=>{
 const x=entries();for(const e of x.filter(e=>e.seed===1)){e.artifact.data.result={status:'FAILED',failure_reason:'INITIALIZATION_ERROR',trajectory:null};e.verification={status:'INITIALIZATION_FAILURE_CONFIRMED'};}
 const r=compareCampaign(x);assert.equal(r.technical_status,'PASS');assert.equal(r.eligible_pairs,3);assert.equal(r.excluded_scenarios.length,1);assert.equal(r.attempts,32);
});
test('F6B-ME07 duplicate attempts, changed origin or repetition are rejected/marked',()=>{
 const duplicate=entries();duplicate[1].artifact.operational.attempt_id=duplicate[0].artifact.operational.attempt_id;assert.throws(()=>compareCampaign(duplicate),/duplicate operational/);
 const x=entries();x[1].artifact.data.result.trajectory.initial_state.time=1;assert.equal(compareCampaign(x).technical_status,'NOT_EVALUABLE');
 const y=entries();y[1].artifact.data.result.trajectory.events=[];assert.equal(compareCampaign(y).technical_status,'NOT_EVALUABLE');
});

test('F6B-ME08 differing repetitions of a common initial failure are not discarded',()=>{
 const x=entries();for(const e of x.filter(e=>e.seed===1)){e.artifact.data.result={status:'FAILED',failure_reason:'INITIALIZATION_ERROR',trajectory:null,failure_details:{message:'same'}};e.verification={status:'INITIALIZATION_FAILURE_CONFIRMED'};}
 x[1].artifact.data.result.failure_details.message='changed';assert.equal(compareCampaign(x).technical_status,'NOT_EVALUABLE');
});
