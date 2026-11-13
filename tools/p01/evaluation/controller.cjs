const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const {authorize}=require('./gate.cjs'),profile=require('./profile.cjs');
const {archiveFor}=require('../archive.cjs'),archive=archiveFor(profile);
const {runChild}=require('../supervisor.cjs'),{provenance,sha,git}=require('../provenance.cjs');
const {encode}=require('../codec.cjs'),{compareCampaign}=require('../metrics.cjs');
function json(file,value){fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});}
async function runCampaign(options,onProgress=()=>{}){
 const initial=authorize(options);if(git('status','--porcelain')!=='')throw Error('evaluation requires clean checkout');
 const directory=initial.receipt.output_directory;fs.mkdirSync(directory); // Exclusive, including empty existing directories: no silent rerun/resume.
 const locked={...options};
 for(const [key,name]of [['proposalFile','freeze.json'],['receiptFile','authorization.json'],['signatureFile','authorization.sig'],['keyFile','reviewer-public.pem']]){
  locked[key]=path.join(directory,name);fs.copyFileSync(options[key],locked[key],fs.constants.COPYFILE_EXCL);
 }
 const log=event=>fs.appendFileSync(path.join(directory,'execution.jsonl'),JSON.stringify(event)+'\n');
 const entries=[],objects=[],started_at=new Date().toISOString();let aborted=null;
 for(const request of profile.executionPlan()){
  try{authorize(locked);}catch(error){aborted=String(error);log({event:'AUTHORIZATION_ABORT',diagnostic:aborted,time:new Date().toISOString()});break;}
  const {seed,agent,repetition}=request,key=`${seed}-${agent}-${repetition}`,row={...request,file:key+'.wlx.gz',raw_file:key+'.raw.gz'};
  log({event:'START_REQUEST',...request,time:new Date().toISOString()});let raw=null,rawSaved=false;
  try{
   const source=provenance(seed,agent),execution=await runChild(path.join(__dirname,'worker.cjs'),{seed,agent,authorization:locked},profile.LIMITS);
   // Preserve the actual return BEFORE archive/validation/replay can fail. This is not a canonical result schema.
   raw={format:'WL-P01-RAW-ATTEMPT-1',freeze_id:initial.proposal.freeze_id,request,provenance:source,execution};
   const bytes=zlib.gzipSync(JSON.stringify(encode(raw)));fs.writeFileSync(path.join(directory,row.raw_file),bytes,{flag:'wx'});row.raw_sha256=sha(bytes);rawSaved=true;
   authorize(locked);
   const artifact=archive.createArtifact({seed,agent},execution,source);
   Object.assign(row,archive.writeArchive(path.join(directory,row.file),artifact));
   const restored=archive.readArchive(path.join(directory,row.file)),verification=archive.verifyArtifact(restored);
   Object.assign(row,{attempt_id:execution.attempt_id,operational_status:execution.operational_status,resources:execution.resources,verification});
   objects.push({...request,artifact:restored,verification});
  }catch(error){row.error=String(error);row.operational_status='PREPARATION_OR_VERIFICATION_ERROR';if(raw!==null&&!rawSaved)aborted='raw attempt storage failed: '+String(error);
   if(raw===null)json(path.join(directory,key+'.failure.json'),{format:'WL-P01-ATTEMPT-FAILURE-1',request,error:String(error),result:null});
  }
  entries.push(row);log({event:'FINISH',...row,time:new Date().toISOString()});onProgress(row);if(aborted)break;
 }
 const analysis=aborted||entries.some(e=>e.error)?{phase:'FINAL_EVALUATION',technical_status:'NOT_EVALUABLE',final_hypothesis:'NOT_EVALUABLE',errors:entries.filter(e=>e.error),aborted}:compareCampaign(objects,'FINAL_EVALUATION');
 analysis.evaluation_authorized=true;
 const manifest={format:'WL-P01-EVALUATION-CAMPAIGN-1',freeze_id:initial.proposal.freeze_id,authorization_sha256:sha(fs.readFileSync(locked.receiptFile)),reviewer_key_sha256:options.trustedKeySha256,
  campaign_id:initial.receipt.campaign_id,started_at,finished_at:new Date().toISOString(),scope:initial.proposal.body.scope,aborted,entries};
 json(path.join(directory,'campaign.json'),manifest);json(path.join(directory,'analysis.json'),analysis);
 return {manifest,analysis};
}
module.exports={runCampaign};
