const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {ROOT}=require('./runtime.cjs'),{snapshot,git,sha,ENGINE_COMMIT,assertEngineUnchanged,parameters}=require('./provenance.cjs');
const {plan,PROTOCOL_PATH,AGENTS,DEVELOPMENT_SEEDS,LIMITS}=require('./protocol.cjs'),{canonical}=require('./codec.cjs');
function fixedFields(){
 const sources=snapshot(),tests=[...fs.readdirSync(path.join(ROOT,'tests')).filter(n=>/^f6-b-.*\.cjs$/.test(n)).map(n=>'tests/'+n),
  ...fs.readdirSync(path.join(ROOT,'tests/fixtures')).filter(n=>n.startsWith('p01-')).map(n=>'tests/fixtures/'+n)].sort();
 return {format:'WL-P01-FREEZE-CANDIDATE-1',status:'CANDIDATE_REVIEW_REQUIRED',approved:false,evaluation_authorized:false,evaluation_executed:false,
  engine_commit:ENGINE_COMMIT,working_tree_clean:true,sources,
  protocol:{id:'P01',version:'1.0-proposed',file:PROTOCOL_PATH,sha256:sources[PROTOCOL_PATH]},configuration:plan(),
  algorithms:AGENTS.map(id=>({id,version:id==='frontier_memory_v1'?'1':'baseline@'+ENGINE_COMMIT,parameters:parameters(id)})),
  development:{seeds:[...DEVELOPMENT_SEEDS],repetitions:2,episodes:32},
  evaluation:{seeds:Array.from({length:32},(_,i)=>1001+i),repetitions:2,execution_order:'seed ascending, wait/random/rule/frontier_memory_v1, repetition1 then2',execution_blocked:true},
  operational_format:'WL-P01-ARCHIVE-1',limits:LIMITS,
  definitions:{primary:'RESOURCE_CONSUMED action events; paired FrontierMemory minus Random; sum differences>0 only after final evaluation authorization',
   repetitions:'determinism checks, not independent samples',inclusion:'exclude common initial-position failures only; no replacement',
   failures:'operational/agent/replay/nonmatching repetitions => NOT_EVALUABLE; do not discard failing cells',
   inference:'finite preregistered battery, no IID claim or p-values; Rule/Wait descriptive',comparison:'full canonical structures and WLS1 bytes; host metadata excluded'},
  acceptance_tests:Object.fromEntries(tests.map(p=>[p,sha(fs.readFileSync(path.join(ROOT,p)))])),
  approvals_needed:['Review F6-B and this candidate before authorizing evaluation 1001–1032'],canonical_conformance:'NOT ESTABLISHED',interoperability:'NOT ESTABLISHED'};
}
function candidate(smokeDirectory){
 assertEngineUnchanged();if(git('status','--porcelain')!=='')throw Error('freeze requires clean implementation checkout; use outputs outside repository');
 const m=JSON.parse(fs.readFileSync(path.join(smokeDirectory,'campaign.json'),'utf8')),a=JSON.parse(fs.readFileSync(path.join(smokeDirectory,'analysis.json'),'utf8'));
 if(m.phase!=='DEVELOPMENT_SMOKE'||m.entries.length!==32||a.technical_status!=='PASS'||m.evaluation_executed!==false)throw Error('freeze requires successful development evidence');
 const fixed=fixedFields();if(canonical(m.source_snapshot)!==canonical(fixed.sources))throw Error('smoke source snapshot changed');
 for(const e of m.entries){
  if(!/^[1-4]-(?:wait|random|rule|frontier_memory_v1)-[12]\.wlx\.gz$/.test(e.file))throw Error('invalid smoke path');
  if(sha(fs.readFileSync(path.join(smokeDirectory,e.file)))!==e.sha256)throw Error('smoke artifact digest mismatch');
 }
 return {...fixed,implementation_commit:git('rev-parse','HEAD'),smoke_evidence:{campaign_sha256:sha(fs.readFileSync(path.join(smokeDirectory,'campaign.json'))),analysis_sha256:sha(fs.readFileSync(path.join(smokeDirectory,'analysis.json'))),technical_status:a.technical_status,final_hypothesis:a.final_hypothesis}};
}
function assertCandidate(file){
 const c=JSON.parse(fs.readFileSync(file,'utf8')),fixed=fixedFields();
 if(Object.keys(c).sort().join(',')!==[...Object.keys(fixed),'implementation_commit','smoke_evidence'].sort().join(','))throw Error('invalid freeze candidate fields');
 for(const [key,value]of Object.entries(fixed))if(canonical(c[key])!==canonical(value))throw Error('invalid or stale freeze candidate: '+key);
 if(!/^[a-f0-9]{40}$/.test(c.implementation_commit)||c.smoke_evidence?.technical_status!=='PASS'||c.smoke_evidence?.final_hypothesis!=='NOT_EVALUATED'||!['campaign_sha256','analysis_sha256'].every(k=>/^[a-f0-9]{64}$/.test(c.smoke_evidence[k])))throw Error('invalid freeze identity/evidence');
 for(const [p,h]of Object.entries({...c.sources,...c.acceptance_tests})){
  const bytes=cp.execFileSync('git',['show',c.implementation_commit+':'+p],{cwd:ROOT});if(sha(bytes)!==h)throw Error('implementation commit does not contain frozen source: '+p);
 }
 return c;
}
module.exports={candidate,assertCandidate};
