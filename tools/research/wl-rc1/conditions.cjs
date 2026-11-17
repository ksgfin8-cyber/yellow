'use strict';
const assert=require('node:assert/strict');
const SUBJECT='c1e80c5249002fccaf8508ee9d9397d6bbeb1b7c';
const PROFILES=[[8,8,1,4],[16,16,1,4],[32,32,1,4],[16,16,0,4],[16,16,4,4],[16,16,16,4],[16,16,1,16],[4,64,1,4]].map(([width,height,radius,ticks],i)=>({id:`P${i+1}`,width,height,radius,ticks}));
const FIXTURE={id:'VALIDATION_ONLY',width:2,height:2,radius:1,ticks:2};
const MODES=['MINIMAL','DETAILED'];
const OPERATIONS=['validate_state','snapshot','initialize','action','dynamics','observation','feedback','tick','record_append','finalize','history_getter','wls1','replay','validate_replay','transport_roundtrip','metrics'];
const LIMITS=Object.freeze({child_ms:10000,total_ms:720000,heap_mib:256,rss_bytes:1073741824,artifact_bytes:134217728,max_processes:48,sample_ms:25,reserve_bytes:1048576});
function worldConfig(p){return {width:p.width,height:p.height,topology:'BOUNDED',obstacle_density:0,resource_density:0,hazard_density:0,initial_energy:240,move_cost:1,wait_cost:1,resource_effect:8,hazard_damage:0,resource_regeneration:0,death_threshold:0,observation_radius:p.radius};}
function plan(){const out=[];for(let block=0;block<3;block++){const order=block===0?PROFILES:block===1?[...PROFILES].reverse():[...PROFILES.slice(1),PROFILES[0]];for(const profile of order)for(const mode of block===1?[...MODES].reverse():MODES)out.push({profile,block:block+1,seed:20001+block,mode,warmup:3,samples:5});}return out;}
function validateCondition(c,fixture=false){if(fixture){assert.deepEqual(c,{profile:FIXTURE,block:0,seed:20001,mode:c.mode,warmup:1,samples:2});assert.ok(MODES.includes(c.mode));}else assert.ok(plan().some(x=>{try{assert.deepEqual(c,x);return true;}catch{return false;}}),'condition is not in frozen pilot plan');return c;}
module.exports={SUBJECT,PROFILES,FIXTURE,MODES,OPERATIONS,LIMITS,worldConfig,plan,validateCondition};
