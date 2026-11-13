#!/usr/bin/env node
const fs=require('node:fs'),{runEpisode,runSmoke,reloadSmoke}=require('./controller.cjs');
const {readArchive,verifyArtifact}=require('./archive.cjs'),{candidate,assertCandidate}=require('./freeze.cjs');
async function main(args){
 const [command,...rest]=args;
 if(command==='episode'&&rest.length===3){const [seed,agent,file]=rest;if(!/^[1-4]$/.test(seed))throw Error('P01: only development seeds 1–4; evaluation is not authorized');const x=await runEpisode({seed:Number(seed),agent},file);console.log(JSON.stringify({archive:x.archive,verification:x.verification}));return x.verification.status==='COMPLETE_MATCH'?0:1;}
 if(command==='smoke'&&rest.length===1){const x=await runSmoke(rest[0],row=>console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:row.operational_status,verification:row.verification?.status,error:row.error})));console.log(JSON.stringify({technical_status:x.analysis.technical_status,final_hypothesis:x.analysis.final_hypothesis}));return x.analysis.technical_status==='PASS'?0:1;}
 if(command==='verify'&&rest.length===1){console.log(JSON.stringify(verifyArtifact(readArchive(rest[0]))));return 0;}
 if(command==='analyze'&&rest.length===1){const r=reloadSmoke(rest[0]);console.log(JSON.stringify(r,null,2));return r.technical_status==='PASS'?0:1;}
 if(command==='freeze'&&rest.length===2){fs.writeFileSync(rest[1],JSON.stringify(candidate(rest[0]),null,2)+'\n',{flag:'wx'});console.log('Candidate written; evaluation remains blocked');return 0;}
 if(command==='check-freeze'&&rest.length===1){const c=assertCandidate(rest[0]);console.log(JSON.stringify({status:c.status,evaluation_authorized:false}));return 0;}
 throw Error('usage: cli.cjs episode <development-seed> <agent> <new-file> | smoke <empty-dir> | verify <file> | analyze <dir> | freeze <smoke-dir> <new-file> | check-freeze <file>; evaluation is not authorized');
}
if(require.main===module)main(process.argv.slice(2)).then(code=>{process.exitCode=code;}).catch(error=>{console.error(String(error));process.exitCode=1;});
module.exports={main};
