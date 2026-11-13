const fs=require('node:fs'),path=require('node:path');
const {ROOT}=require('./runtime.cjs');
const PROTOCOL_PATH='docs/F6-A-pilot-protocol.md';
const AGENTS=Object.freeze(['wait','random','rule','frontier_memory_v1']);
const DEVELOPMENT_SEEDS=Object.freeze([1,2,3,4]);
const LIMITS=Object.freeze({timeout_ms:30000,heap_mib:512});
function plan(){const text=fs.readFileSync(path.join(ROOT,PROTOCOL_PATH),'utf8');return JSON.parse(/```json\n([\s\S]*?)\n```/.exec(text)[1]);}
function config(seed,agent){assertDevelopmentSeed(seed);if(!AGENTS.includes(agent))throw Error('P01: unsupported agent');return {...plan(),experiment_seed:seed,agent_type:agent};}
function assertDevelopmentSeed(seed){
 if(Number.isInteger(seed)&&seed>=1001&&seed<=1032)throw Error('P01: evaluation seeds are not authorized');
 if(!DEVELOPMENT_SEEDS.includes(seed))throw Error('P01: only development seeds 1–4 are authorized');
}
function assertRequest(request){
 if(!request||Object.keys(request).sort().join(',')!=='agent,seed')throw Error('P01: invalid episode request');
 config(request.seed,request.agent);return request;
}
module.exports={PROTOCOL_PATH,AGENTS,DEVELOPMENT_SEEDS,LIMITS,plan,config,assertDevelopmentSeed,assertRequest};
