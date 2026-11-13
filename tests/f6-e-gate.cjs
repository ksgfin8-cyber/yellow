// Acceptance of a REAL preparation proposal, no campaign execution or final world generation.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {verifyProposal,authorize}=require('../tools/p01/evaluation/gate.cjs'),{canonical}=require('../tools/p01/codec.cjs'),{sha}=require('../tools/p01/provenance.cjs');
const [file]=process.argv.slice(2);if(!file)throw Error('usage: node tests/f6-e-gate.cjs <proposal>');
const proposal=verifyProposal(file);assert.equal(proposal.body.evaluation_executed,false);assert.equal(proposal.body.scope.episodes,256);
console.log('F6E-G01 actual frozen code, tests, Node binary, candidate and all smoke files match PASS');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-gate-rejections-'));
try{
 const f=path.join(dir,'altered.json');
 for(const change of [p=>{p.body.scope.limits.timeout_ms=31000;},p=>{p.body.scope.seeds[0]=1000;},p=>{p.body.scope.agents.reverse();},p=>{p.body.scope.repetitions=1;},p=>{p.body.evaluation_executed=true;},p=>{p.body.runtime.node_binary_sha256='0'.repeat(64);}]){
  const p=structuredClone(proposal);change(p);p.freeze_id=sha(canonical(p.body));fs.writeFileSync(f,JSON.stringify(p));assert.throws(()=>verifyProposal(f));
 }
 console.log('F6E-G02 rehashed budget/seed/order/repetition/runtime/Boolean changes rejected PASS');
 for(const section of ['runner_files','evidence_files']){
  const p=structuredClone(proposal);p.body[section][Object.keys(p.body[section])[0]]='0'.repeat(64);p.freeze_id=sha(canonical(p.body));fs.writeFileSync(f,JSON.stringify(p));assert.throws(()=>verifyProposal(f),/actual frozen file changed/);
 }
 console.log('F6E-G03 claimed code/evidence hashes checked against actual bytes PASS');
 assert.throws(()=>authorize({proposalFile:file}),/explicit freeze pin/);
 console.log('F6E-G04 intact proposal is insufficient without explicit pins and signed owner approval PASS');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
