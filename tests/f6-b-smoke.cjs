// Acceptance of archived DEVELOPMENT smoke, never launches evaluation episodes.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {assertCandidate}=require('../tools/p01/freeze.cjs'),{readArchive}=require('../tools/p01/archive.cjs');
const [directory,candidateFile]=process.argv.slice(2);if(!directory||!candidateFile)throw Error('usage: node tests/f6-b-smoke.cjs <smoke-dir> <candidate-file>');
const m=JSON.parse(fs.readFileSync(path.join(directory,'campaign.json'))),a=JSON.parse(fs.readFileSync(path.join(directory,'analysis.json')));
assert.equal(m.entries.length,32);assert.equal(a.technical_status,'PASS');assert.equal(a.eligible_pairs,4);assert.equal(a.final_hypothesis,'NOT_EVALUATED');
const expected=[];for(const seed of [1,2,3,4])for(const agent of ['wait','random','rule','frontier_memory_v1'])for(const repetition of [1,2])expected.push([seed,agent,repetition]);
assert.deepEqual(m.entries.map(e=>[e.seed,e.agent,e.repetition]),expected);assert.ok(m.entries.every(e=>e.operational_status==='RETURNED'&&e.verification.status==='COMPLETE_MATCH'&&e.verification.states_verified===161));
console.log('F6B-SM01 32 ordered development episodes; no evaluation; full replay proofs PASS');
const candidate=assertCandidate(candidateFile);assert.equal(candidate.evaluation_authorized,false);console.log('F6B-SM02 freeze source/test hashes and implementation commit PASS');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'p01-freeze-'));
try{
 const file=path.join(temporary,'bad.json');
 for(const [key,value]of [['evaluation_authorized',true],['configuration',{...candidate.configuration,max_ticks:161}]]){
  fs.writeFileSync(file,JSON.stringify({...candidate,[key]:value}));assert.throws(()=>assertCandidate(file),new RegExp('stale freeze candidate: '+key));
 }
 fs.writeFileSync(file,JSON.stringify({...candidate,sources:{...candidate.sources,'js/agents/frontier_memory_agent.js':'0'.repeat(64)}}));assert.throws(()=>assertCandidate(file),/stale freeze candidate: sources/);
 console.log('F6B-SM03 changed evaluation permission/configuration/source candidate rejected PASS');
 const archive=path.join(directory,m.entries[0].file),original=readArchive(archive);assert.equal(original.provenance.implementation.working_tree_clean,true);
 const cli=path.resolve(__dirname,'../tools/p01/cli.cjs'),r=cp.spawnSync(process.execPath,[cli,'verify',archive],{encoding:'utf8',timeout:30000,maxBuffer:1024*1024});
 assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).status,'COMPLETE_MATCH');
 console.log('F6B-SM04 cold-process recovery of actual smoke artifact PASS');
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
