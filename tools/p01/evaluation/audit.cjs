// Hash/structure reconciliation of existing DEVELOPMENT evidence; no episode generation.
const fs=require('node:fs'),path=require('node:path');
const {assertCandidate}=require('../freeze.cjs');
const {readArchive,payloadDigest,verifyArtifact}=require('../archive.cjs');
const {compareCampaign}=require('../metrics.cjs');
const {sha,assertSources}=require('../provenance.cjs');
const {canonical}=require('../codec.cjs');
function auditSmoke(candidateFile,directory,{replay=false}={}){
 const candidate=assertCandidate(candidateFile),bytes=name=>fs.readFileSync(path.join(directory,name));
 const manifest=JSON.parse(bytes('campaign.json')),analysis=JSON.parse(bytes('analysis.json'));
 for(const [file,key]of [['campaign.json','campaign_sha256'],['analysis.json','analysis_sha256']])
  if(sha(bytes(file))!==candidate.smoke_evidence[key])throw Error('smoke evidence digest mismatch: '+file);
 if(manifest.phase!=='DEVELOPMENT_SMOKE'||manifest.evaluation_executed!==false||manifest.evaluation_authorized!==false||canonical(manifest.source_snapshot)!==canonical(candidate.sources))throw Error('smoke scope/source mismatch');
 const expected=[];for(const seed of candidate.development.seeds)for(const a of candidate.algorithms)for(const repetition of [1,2])expected.push([seed,a.id,repetition]);
 if(canonical(manifest.entries.map(e=>[e.seed,e.agent,e.repetition]))!==canonical(expected))throw Error('smoke order/count mismatch');
 const objects=[],hashes={'campaign.json':sha(bytes('campaign.json')),'analysis.json':sha(bytes('analysis.json')),'execution.jsonl':sha(bytes('execution.jsonl'))};
 for(const e of manifest.entries){
  if(e.file!==`${e.seed}-${e.agent}-${e.repetition}.wlx.gz`)throw Error('invalid smoke file');
  const b=bytes(e.file);if(sha(b)!==e.sha256||b.length!==e.bytes)throw Error('actual smoke archive hash/length mismatch: '+e.file);
  const a=readArchive(path.join(directory,e.file));assertSources(a.provenance);
  if(a.provenance.implementation.commit!==candidate.implementation_commit||!a.provenance.implementation.working_tree_clean||a.provenance.seeds.experiment!==e.seed||a.provenance.algorithm.id!==e.agent||a.operational.attempt_id!==e.attempt_id||a.operational.operational_status!==e.operational_status||payloadDigest(a.data)!==e.payload_sha256||e.verification.payload_sha256!==e.payload_sha256)throw Error('smoke archive/provenance mismatch: '+e.file);
  const verification=replay?verifyArtifact(a):e.verification;
  if(replay&&canonical(verification)!==canonical(e.verification))throw Error('fresh smoke replay mismatch');
  hashes[e.file]=sha(b);objects.push({seed:e.seed,agent:e.agent,repetition:e.repetition,artifact:a,verification});
 }
 if(canonical(compareCampaign(objects))!==canonical(analysis)||analysis.technical_status!=='PASS')throw Error('recovered smoke metrics differ');
 const log=bytes('execution.jsonl').toString('utf8').trim().split('\n').map(JSON.parse);
 if(log.length!==64||log.some((r,i)=>r.event!==(i%2?'FINISH':'START_REQUEST')||canonical([r.seed,r.agent,r.repetition])!==canonical(expected[Math.floor(i/2)])))throw Error('smoke execution log mismatch');
 return {decision:'FREEZE_READY',scope:'P01 development evidence',candidate_sha256:sha(fs.readFileSync(candidateFile)),implementation_commit:candidate.implementation_commit,source_files:Object.keys(candidate.sources).length,test_files:Object.keys(candidate.acceptance_tests).length,archives_verified:32,recovered_metrics:'EXACT_MATCH',fresh_replays:replay?32:0,replay_evidence:replay?'REEXECUTED':'ARCHIVED_F6_B_PROOFS_BOUND_TO_ACTUAL_FILE_HASHES',evidence_hashes:hashes,evaluation_executed:false};
}
module.exports={auditSmoke};
