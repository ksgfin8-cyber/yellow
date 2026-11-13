// Configuration construction is pure; permission to EXECUTE belongs to gate.cjs.
const {plan,AGENTS,LIMITS}=require('../protocol.cjs');
const SEEDS=Object.freeze(Array.from({length:32},(_,i)=>1001+i));
function configuration(seed,agent){
 if(!SEEDS.includes(seed)||!AGENTS.includes(agent))throw Error('P01 evaluation: invalid seed/agent');
 return {...plan(),experiment_seed:seed,agent_type:agent};
}
function assertRequest(request){
 if(!request||Object.keys(request).sort().join(',')!=='agent,seed')throw Error('P01 evaluation: invalid request');
 configuration(request.seed,request.agent);return request;
}
function executionPlan(){return SEEDS.flatMap(seed=>AGENTS.flatMap(agent=>[1,2].map(repetition=>({seed,agent,repetition}))));}
module.exports={SEEDS,AGENTS,LIMITS,config:configuration,assertRequest,executionPlan};
