// Detached, explicitly pinned reviewer signature. No approval is shipped here.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const {ROOT}=require('../runtime.cjs'),{sha,git}=require('../provenance.cjs');
const {canonical,exact}=require('../codec.cjs'),{assertCandidate}=require('../freeze.cjs');
const {auditSmoke}=require('./audit.cjs'),{SEEDS,AGENTS,LIMITS}=require('./profile.cjs');
const BASE='d5478244465be235c4ee1e8368255e2bb383cb33',DOMAIN='WL-P01-AUTHORIZATION-1\n';
function need(ok,message){if(!ok)throw Error('P01 gate: '+message);}
function relative(file){const p=path.relative(ROOT,path.resolve(file));need(p&&!p.startsWith('..')&&!path.isAbsolute(p),'file must be inside repository');return p;}
function read(file){return fs.readFileSync(path.resolve(ROOT,file));}
function runnerFiles(){return [...fs.readdirSync(__dirname).filter(n=>n.endsWith('.cjs')||n==='README.md').map(n=>'tools/p01/evaluation/'+n),...fs.readdirSync(path.join(ROOT,'tests')).filter(n=>/^f6-e.*\.cjs$/.test(n)).map(n=>'tests/'+n)].sort();}
function hashes(files){return Object.fromEntries(files.map(p=>[p,sha(read(p))]));}
function scope(){return {seeds:[...SEEDS],agents:[...AGENTS],repetitions:2,episodes:256,order:'seed ascending; agent order; repetition1 then2',limits:LIMITS,configuration:'exact P01; no overrides'};}
function runtimeIdentity(){return {node:process.version,platform:process.platform,arch:process.arch,node_binary_sha256:sha(fs.readFileSync(process.execPath))};}
function buildProposal(candidateFile,smokeDirectory){
 const audit=auditSmoke(candidateFile,smokeDirectory),candidate=assertCandidate(candidateFile);
 const body={base_commit:BASE,code_commit:candidate.implementation_commit,engine_commit:candidate.engine_commit,
  candidate:{file:relative(candidateFile),sha256:sha(fs.readFileSync(candidateFile))},
  previous_candidate:{file:'docs/f6-b/P01-freeze-candidate.json',sha256:sha(read('docs/f6-b/P01-freeze-candidate.json'))},
  runner_files:hashes(runnerFiles()),evidence_files:hashes(Object.keys(audit.evidence_hashes).map(n=>relative(path.join(smokeDirectory,n)))),
  scope:scope(),runtime:runtimeIdentity(),authorization_policy:'Ed25519 receipt; freeze ID and reviewer public-key SHA256 pinned out of band by project owner',
  status:'PREPARATION_ONLY',evaluation_executed:false};
 for(const [f,h]of Object.entries(body.runner_files))need(sha(cp.execFileSync('git',['show',body.code_commit+':'+f],{cwd:ROOT}))===h,'uncommitted runner/test: '+f);
 return {format:'WL-P01-EVALUATION-FREEZE-1',freeze_id:sha(canonical(body)),body};
}
function verifyProposal(file){
 const p=JSON.parse(fs.readFileSync(file,'utf8'));
 need(exact(p,['format','freeze_id','body'])&&p.format==='WL-P01-EVALUATION-FREEZE-1'&&p.freeze_id===sha(canonical(p.body)),'invalid freeze identity');
 const b=p.body;need(exact(b,['base_commit','code_commit','engine_commit','candidate','previous_candidate','runner_files','evidence_files','scope','runtime','authorization_policy','status','evaluation_executed']),'invalid freeze fields');
 need(b.base_commit===BASE&&/^[0-9a-f]{40}$/.test(b.code_commit)&&b.status==='PREPARATION_ONLY'&&b.evaluation_executed===false,'invalid freeze state');
 need(canonical(b.scope)===canonical(scope())&&canonical(b.runtime)===canonical(runtimeIdentity()),'scope/runtime changed');
 need(b.authorization_policy==='Ed25519 receipt; freeze ID and reviewer public-key SHA256 pinned out of band by project owner','authorization policy changed');
 for(const item of [b.candidate,b.previous_candidate])need(exact(item,['file','sha256'])&&relative(path.join(ROOT,item.file))===item.file&&sha(read(item.file))===item.sha256,'candidate file changed');
 need(b.previous_candidate.file==='docs/f6-b/P01-freeze-candidate.json'&&b.previous_candidate.sha256==='f503593e47ec59daf607d10c169f99aacfac722612d94f63543b6c093fe6d65a','previous candidate changed');
 const candidate=assertCandidate(path.join(ROOT,b.candidate.file));
 const previous=JSON.parse(read(b.previous_candidate.file));
 for(const field of ['engine_commit','configuration','algorithms','protocol','definitions','limits','development','evaluation','operational_format'])need(canonical(candidate[field])===canonical(previous[field]),'scientific contract changed: '+field);
 need(canonical(Object.keys(candidate.sources))===canonical(Object.keys(previous.sources)),'scientific source set changed');
 for(const [f,h]of Object.entries(previous.sources))if(!['tools/p01/archive.cjs','tools/p01/metrics.cjs'].includes(f))need(candidate.sources[f]===h,'protected scientific source changed: '+f);
 need(candidate.engine_commit===b.engine_commit&&candidate.implementation_commit===b.code_commit,'code/candidate identity mismatch');
 need(canonical(Object.keys(b.runner_files))===canonical(runnerFiles()),'runner/test file set changed');
 const evidenceDirectory=path.dirname(b.candidate.file)+'/smoke';
 const manifest=JSON.parse(read(evidenceDirectory+'/campaign.json'));
 const evidencePaths=['campaign.json','analysis.json','execution.jsonl',...manifest.entries.map(e=>e.file)].map(n=>evidenceDirectory+'/'+n).sort();
 need(canonical(Object.keys(b.evidence_files).sort())===canonical(evidencePaths),'evidence file set changed');
 for(const [f,h]of Object.entries({...b.runner_files,...b.evidence_files}))need(relative(path.join(ROOT,f))===f&&/^[0-9a-f]{64}$/.test(h)&&sha(read(f))===h,'actual frozen file changed: '+f);
 need(sha(read(evidenceDirectory+'/campaign.json'))===candidate.smoke_evidence.campaign_sha256&&sha(read(evidenceDirectory+'/analysis.json'))===candidate.smoke_evidence.analysis_sha256,'candidate smoke binding changed');
 for(const [f,h]of Object.entries(b.runner_files))need(sha(cp.execFileSync('git',['show',b.code_commit+':'+f],{cwd:ROOT}))===h,'runner not in frozen code commit: '+f);
 return p;
}
function verifyReceipt(freezeId,{receiptFile,signatureFile,keyFile,expectedFreezeId,trustedKeySha256}){
 need(/^[0-9a-f]{64}$/.test(expectedFreezeId??'')&&expectedFreezeId===freezeId,'explicit freeze pin required');
 need(/^[0-9a-f]{64}$/.test(trustedKeySha256??''),'explicit reviewer key pin required');
 const key=crypto.createPublicKey(fs.readFileSync(keyFile));need(key.asymmetricKeyType==='ed25519','Ed25519 reviewer key required');
 need(sha(key.export({format:'der',type:'spki'}))===trustedKeySha256,'reviewer key pin mismatch');
 const bytes=fs.readFileSync(receiptFile),receipt=JSON.parse(bytes);
 need(exact(receipt,['format','decision','freeze_id','reviewer','approval_reference','campaign_id','output_directory'])&&receipt.format==='WL-P01-AUTHORIZATION-1'&&receipt.decision==='AUTHORIZE_P01_FINAL_EVALUATION'&&receipt.freeze_id===freezeId,'invalid authorization receipt');
 need(['reviewer','approval_reference','campaign_id'].every(k=>typeof receipt[k]==='string'&&receipt[k].trim().length>0),'missing reviewer/reference/campaign');
 need(typeof receipt.output_directory==='string'&&path.isAbsolute(receipt.output_directory)&&path.resolve(receipt.output_directory)===receipt.output_directory,'authorization must bind an absolute output directory');
 const outputParent=fs.realpathSync(path.dirname(receipt.output_directory)),outside=path.relative(ROOT,outputParent);
 need(outside==='..'||outside.startsWith('..'+path.sep)||path.isAbsolute(outside),'output must be outside repository');
 need(crypto.verify(null,Buffer.concat([Buffer.from(DOMAIN),bytes]),key,fs.readFileSync(signatureFile)),'invalid reviewer signature');
 return receipt;
}
function authorize(options){
 need(options&&typeof options.proposalFile==='string','proposal and explicit signed authorization required');
 const proposal=verifyProposal(options.proposalFile),receipt=verifyReceipt(proposal.freeze_id,options);
 return {proposal,receipt};
}
module.exports={buildProposal,verifyProposal,verifyReceipt,authorize,runnerFiles,DOMAIN};
