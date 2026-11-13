#!/usr/bin/env node
const fs=require('node:fs'),{buildProposal,verifyProposal,authorize}=require('./gate.cjs');
async function main(args){
 const [cmd,...a]=args;
 if(cmd==='prepare'&&a.length===3){const p=buildProposal(a[0],a[1]);fs.writeFileSync(a[2],JSON.stringify(p,null,2)+'\n',{flag:'wx'});verifyProposal(a[2]);console.log(JSON.stringify({freeze_id:p.freeze_id,status:'REVIEW_REQUIRED',evaluation_executed:false}));return;}
 if(cmd==='check'&&a.length===1){const p=verifyProposal(a[0]);console.log(JSON.stringify({freeze_id:p.freeze_id,status:'READY_FOR_AUTHORIZATION',evaluation_executed:false}));return;}
 if(['preflight','run'].includes(cmd)&&a.length===6){
  const [proposalFile,receiptFile,signatureFile,keyFile,expectedFreezeId,trustedKeySha256]=a,options={proposalFile,receiptFile,signatureFile,keyFile,expectedFreezeId,trustedKeySha256};
  const accepted=authorize(options);
  if(cmd==='preflight'){console.log(JSON.stringify({freeze_id:accepted.proposal.freeze_id,signature:'VALID',output_directory:accepted.receipt.output_directory,episodes_started:0}));return;}
  const {runCampaign}=require('./controller.cjs'),r=await runCampaign(options,row=>console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:row.operational_status})));
  console.log(JSON.stringify({technical_status:r.analysis.technical_status,acceptance:'REVIEW_REQUIRED'}));if(r.analysis.technical_status!=='PASS')process.exitCode=1;return;
 }
 throw Error('usage: evaluation/cli.cjs prepare <candidate> <smoke-dir> <new-proposal> | check <proposal> | preflight|run <proposal> <receipt> <signature> <public-key> <approved-freeze-id> <approved-key-sha256>; no evaluation without specific owner approval');
}
if(require.main===module)main(process.argv.slice(2)).catch(e=>{console.error(String(e));process.exitCode=1;});
module.exports={main};
