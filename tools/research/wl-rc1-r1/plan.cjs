'use strict';
const assert=require('node:assert/strict');
const {PROFILES,worldConfig}=require('../wl-rc1/conditions.cjs');
const BASE='aab268dde2f20299234c6b407ce6ba9f54438076';
const OPERATIONS=['tick','observation','record_append','replay'];
const LIMITS=Object.freeze({child_ms:30000,total_ms:4500000,heap_mib:256,rss_bytes:1073741824,artifact_bytes:134217728,max_processes:128,sample_ms:25,reserve_bytes:1048576});
const JOURNAL_CAP=262144,ROOT_RESERVE=1048576;
const FIXTURE=Object.freeze({id:'R1_VALIDATION_ONLY',width:2,height:2,radius:1,ticks:2});
function plan(){const out=[];for(let block=1;block<=2;block++){const profiles=block===1?PROFILES:[...PROFILES].reverse(),operations=block===1?OPERATIONS:[...OPERATIONS].reverse(),modes=block===1?['MINIMAL','DETAILED']:['DETAILED','MINIMAL'];for(const profile of profiles)for(const operation of operations)for(const mode of modes)out.push({profile,operation,block,seed:21000+block,mode,warmup:3,samples:5});}return out;}
function validate(c,fixture=false){if(fixture){assert.deepEqual(c,{profile:FIXTURE,operation:c.operation,block:0,seed:21001,mode:c.mode,warmup:1,samples:2});assert.ok(OPERATIONS.includes(c.operation)&&['MINIMAL','DETAILED'].includes(c.mode));}else assert.ok(plan().some(x=>{try{assert.deepEqual(c,x);return true;}catch{return false;}}),'R1 condition not in proposal');return c;}
module.exports={BASE,PROFILES,OPERATIONS,LIMITS,JOURNAL_CAP,ROOT_RESERVE,FIXTURE,worldConfig,plan,validate};
