const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {archiveFor}=require('./tools/p01/archive.cjs');
const archive=archiveFor(require('./tools/p01/evaluation/profile.cjs'));
const root=path.join(process.env.P01_RESTORED,'files');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'campaign.json')));
let failed=0;
for(const row of manifest.entries){
 try{
  const artifact=archive.readArchive(path.join(root,row.file));
  const proof=archive.verifyArtifact(artifact);
  assert.equal(proof.status,'COMPLETE_MATCH');
  assert.equal(proof.replay,true);
  assert.deepEqual(proof,row.verification);
  console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:'MATCH',proof}));
 }catch(error){failed++;console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:'MISMATCH',error:String(error)}));}
}
assert.equal(manifest.entries.length,256);
console.log(JSON.stringify({total:manifest.entries.length,failed}));
if(failed)process.exitCode=1;
