const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {runEpisode,runSmoke,reloadSmoke}=require('../tools/p01/controller.cjs');
const {readArchive,payloadDigest}=require('../tools/p01/archive.cjs');
const cli=path.resolve(__dirname,'../tools/p01/cli.cjs');
test('F6B-CO01 campaign refuses nonempty directory rather than overwriting evidence',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-existing-'));try{fs.writeFileSync(path.join(dir,'evidence'),'keep');await assert.rejects(runSmoke(dir),/empty/);assert.equal(fs.readFileSync(path.join(dir,'evidence'),'utf8'),'keep');}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('F6B-CO02 public episode rejects final seeds before creating output',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-evaluation-'));try{const file=path.join(dir,'none');await assert.rejects(runEpisode({seed:1001,agent:'wait'},file),/not authorized/);assert.ok(!fs.existsSync(file));
  const r=cp.spawnSync(process.execPath,[cli,'episode','1001','wait',file],{encoding:'utf8'});assert.equal(r.status,1);assert.match(r.stderr,/not authorized/);assert.ok(!fs.existsSync(file));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('F6B-CO03 archived episode verifies in a fresh Node process without original VM',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-recovery-'));try{
  const file=path.join(dir,'episode.wlx.gz'),x=await runEpisode({seed:1,agent:'frontier_memory_v1'},file);
  assert.equal(x.verification.status,'COMPLETE_MATCH');assert.equal(x.archive.payload_sha256,payloadDigest(readArchive(file).data));
  const r=cp.spawnSync(process.execPath,[cli,'verify',file],{encoding:'utf8',timeout:30000,maxBuffer:1024*1024});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).status,'COMPLETE_MATCH');
  await assert.rejects(runEpisode({seed:1,agent:'wait'},file),/EEXIST/);assert.equal(readArchive(file).provenance.algorithm.id,'frontier_memory_v1');assert.ok(!fs.existsSync(file+'.partial'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('F6B-CO04 manifest cannot inject a path or pretend evaluation was authorized',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-manifest-'));try{fs.writeFileSync(path.join(dir,'campaign.json'),JSON.stringify({format:'WL-P01-CAMPAIGN-1',phase:'EVALUATION',evaluation_executed:true}));assert.throws(()=>reloadSmoke(dir),/invalid development/);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
