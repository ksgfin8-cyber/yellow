const fs=require('node:fs'),path=require('node:path');
const {runChild}=require('./supervisor.cjs'),{assertRequest,config,AGENTS,DEVELOPMENT_SEEDS,LIMITS,PROTOCOL_PATH}=require('./protocol.cjs');
const {provenance,sha,snapshot,ENGINE_COMMIT}=require('./provenance.cjs');
const {createArtifact,writeArchive,readArchive,verifyArtifact,payloadDigest}=require('./archive.cjs');
const {compareCampaign}=require('./metrics.cjs');
const worker=path.join(__dirname,'worker.cjs');
const artifactName=(seed,agent,repetition)=>`${seed}-${agent}-${repetition}.wlx.gz`;
function saveJSON(file,value){fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});}
async function runEpisode(request,file){
 assertRequest(request);if(fs.existsSync(file))throw Error('EEXIST: archive already exists');
 const endToEndStart=process.hrtime.bigint(),source=provenance(request.seed,request.agent);
 const execution=await runChild(worker,request,LIMITS);
 const archiveStart=process.hrtime.bigint();const artifact=createArtifact(request,execution,source);
 const archive=writeArchive(file,artifact),archive_wall_ms=Number(process.hrtime.bigint()-archiveStart)/1e6;
 const verifyStart=process.hrtime.bigint(),restored=readArchive(file),verification=verifyArtifact(restored);
 return {artifact:restored,archive,verification,archive_wall_ms,verification_wall_ms:Number(process.hrtime.bigint()-verifyStart)/1e6,end_to_end_wall_ms:Number(process.hrtime.bigint()-endToEndStart)/1e6};
}
async function runSmoke(directory,onProgress=()=>{}){
 if(fs.existsSync(directory)&&fs.readdirSync(directory).length)throw Error('campaign output directory must be empty');
 fs.mkdirSync(directory,{recursive:true});
 const started_at=new Date().toISOString(),campaignSources=snapshot(),usageBefore=process.resourceUsage(),campaignStart=process.hrtime.bigint(),entries=[],objects=[],errors=[];
 const log=event=>fs.appendFileSync(path.join(directory,'execution.jsonl'),JSON.stringify(event)+'\n');
 for(const seed of DEVELOPMENT_SEEDS)for(const agent of AGENTS)for(const repetition of [1,2]){
  const file=artifactName(seed,agent,repetition),key={seed,agent,repetition,file};log({event:'START_REQUEST',...key,time:new Date().toISOString()});
  try{
   if(JSON.stringify(snapshot())!==JSON.stringify(campaignSources))throw Error('campaign source changed');
   const x=await runEpisode({seed,agent},path.join(directory,file));
   const row={...key,...x.archive,attempt_id:x.artifact.operational.attempt_id,operational_status:x.artifact.operational.operational_status,
    resources:x.artifact.operational.resources,archive_wall_ms:x.archive_wall_ms,verification_wall_ms:x.verification_wall_ms,end_to_end_wall_ms:x.end_to_end_wall_ms,verification:x.verification};
   entries.push(row);objects.push({...key,artifact:x.artifact,verification:x.verification});log({event:'FINISH',...row,time:new Date().toISOString()});onProgress(row);
  }catch(error){const row={...key,error:String(error),operational_status:'ARCHIVE_OR_VERIFICATION_ERROR'};entries.push(row);errors.push(row);log({event:'FINISH',...row,time:new Date().toISOString()});onProgress(row);}
 }
 const analysis=errors.length?{phase:'DEVELOPMENT_SMOKE',technical_status:'NOT_EVALUABLE',evaluation_executed:false,final_hypothesis:'NOT_EVALUATED',errors}:compareCampaign(objects);
 const manifest={format:'WL-P01-CAMPAIGN-1',phase:'DEVELOPMENT_SMOKE',engine_commit:ENGINE_COMMIT,
  protocol:PROTOCOL_PATH,source_snapshot:campaignSources,seeds:[...DEVELOPMENT_SEEDS],agents:[...AGENTS],repetitions:2,
  evaluation_authorized:false,evaluation_executed:false,started_at,finished_at:new Date().toISOString(),controller_resources:{wall_ms:Number(process.hrtime.bigint()-campaignStart)/1e6,cpu_user_us:process.resourceUsage().userCPUTime-usageBefore.userCPUTime,cpu_system_us:process.resourceUsage().systemCPUTime-usageBefore.systemCPUTime,max_rss_kib:process.resourceUsage().maxRSS},entries};
 saveJSON(path.join(directory,'campaign.json'),manifest);saveJSON(path.join(directory,'analysis.json'),analysis);
 return {manifest,analysis};
}
function reloadSmoke(directory){
 const m=JSON.parse(fs.readFileSync(path.join(directory,'campaign.json'),'utf8'));
 if(m.format!=='WL-P01-CAMPAIGN-1'||m.phase!=='DEVELOPMENT_SMOKE'||m.evaluation_executed!==false||m.evaluation_authorized!==false||m.engine_commit!==ENGINE_COMMIT||JSON.stringify(m.seeds)!==JSON.stringify(DEVELOPMENT_SEEDS)||JSON.stringify(m.agents)!==JSON.stringify(AGENTS)||m.repetitions!==2)throw Error('invalid development campaign manifest');
 if(JSON.stringify(m.source_snapshot)!==JSON.stringify(snapshot()))throw Error('campaign source snapshot mismatch');
 if(!Array.isArray(m.entries))throw Error('invalid campaign entries');
 const seen=new Set(),objects=[];
 for(const e of m.entries){
  assertRequest({seed:e.seed,agent:e.agent});const key=`${e.seed}/${e.agent}/${e.repetition}`;
  if(![1,2].includes(e.repetition)||seen.has(key)||e.file!==artifactName(e.seed,e.agent,e.repetition))throw Error('invalid/duplicate campaign row');seen.add(key);
  if(e.error)throw Error('campaign has archive/verification error: '+e.error);
  const file=path.join(directory,e.file),bytes=fs.readFileSync(file);if(sha(bytes)!==e.sha256||bytes.length!==e.bytes)throw Error('campaign archive digest/length mismatch');
  const artifact=readArchive(file),verification=verifyArtifact(artifact);
  if(artifact.operational.attempt_id!==e.attempt_id||payloadDigest(artifact.data)!==e.payload_sha256||JSON.stringify(verification)!==JSON.stringify(e.verification))throw Error('campaign/archive identity or verification mismatch');
  objects.push({seed:e.seed,agent:e.agent,repetition:e.repetition,artifact,verification});
 }
 return compareCampaign(objects);
}
module.exports={artifactName,runEpisode,runSmoke,reloadSmoke};
