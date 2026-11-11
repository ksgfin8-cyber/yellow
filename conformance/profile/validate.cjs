// Candidate-profile integrity/sufficiency checks, not a new engine acceptance runner.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const {decode}=require('../wire.cjs'),oracle=require('../oracles.cjs');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function requireThat(value,message){if(!value)throw Error(message);}
function literalSource(source){const bytes=fs.readFileSync(path.join(root,source.path));return (source.encoding==='base64'?Buffer.from(bytes.toString(),'base64'):bytes).toString('utf8');}
function finiteEvidence(unit,row,cases,report){
 let ids=null;
 if(unit.source_id==='S025'&&unit.clause==='§24.5'&&unit.literal_text.includes('foobar'))ids=['CR-FNV-EMPTY','CR-FNV-A','CR-FNV-FOOBAR'];
 if(unit.source_id==='S025'&&unit.clause==='§11.6'&&unit.literal_text.startsWith('Vectores:'))ids=['CR-SEED-WORLD','CR-SEED-RANDOM_AGENT'];
 if(unit.source_id==='H034'&&unit.literal_text.includes('57 4C 53 31')&&unit.literal_text.includes('00 00 00 07'))ids=['CR-WLS1-V1'];
 requireThat(ids&&same(ids,row.evidence_case_ids),'SATISFIED requires exactly the finite literal reference set');
 for(const id of ids){const c=cases.find(c=>c.id===id),r=report.results.find(r=>r.id===id);
  requireThat(c&&c.category==='CANONICAL-RECOVERED'&&c.oracle.kind==='value','finite reference authority missing');
  requireThat(r?.status==='PASS'&&same(r.input,c.input)&&same(r.expected,c.expected)&&same(r.observed,c.expected),'PASS label without matching finite reference evidence');
  if(unit.clause==='§24.5'){
   const published=[...unit.literal_text.matchAll(/"([^"]*)" → (0x[0-9a-f]+)/g)].map(m=>({text:m[1],hash:Number.parseInt(m[2],16)}));
   requireThat(published.some(p=>p.hash===c.expected&&same(c.input,{bytes:{$type:'bytes',hex:Buffer.from(p.text,'ascii').toString('hex')}})),'reference differs from literal FNV vector');
  } else if(unit.source_id==='S025'){
   const published=[...unit.literal_text.matchAll(/\(1, "([^"]+)"\) = (\d+)/g)];
   requireThat(published.some(m=>Number(m[2])===c.expected&&c.input.seed===1&&c.input.namespace===m[1]),'reference differs from literal seed vector');
  } else {
   const hex=unit.literal_text.split('\n').filter(s=>/^[0-9a-f]{2}(?: [0-9a-f]{2})*$/i.test(s)).join('').replaceAll(' ','').toLowerCase();
   requireThat(hex.length===118&&c.expected.$type==='bytes'&&c.expected.hex===hex,'reference differs from literal V1 bytes');
   const s=c.input.state,e=s.entities.entries[0];
   requireThat(s.time===0&&s.rng_state===1&&s.grid.length===1&&s.grid[0].length===1&&s.grid[0][0].traversal==='FREE'&&s.grid[0][0].effect===null&&s.entities.entries.length===1&&e[0]==='0987898'&&e[1].id==='0987898'&&e[1].energy===0&&e[1].lifecycle==='ACTIVE'&&e[1].position.x===0&&e[1].position.y===0,'V1 input must match unambiguous recovered state');
  }
 }
 return true;
}
function validateVectors(set){
 requireThat(set.approval.startsWith('NOT APPROVED')&&set.historical_V2_V10_status==='UNCHANGED BLOCKED','candidate vectors cannot become normative by flag');
 requireThat(set.vectors.length===9&&new Set(set.vectors.map(v=>v.id)).size===9,'nine distinct new proposal identities required');
 for(const v of set.vectors){
  requireThat(/^PV-F5C-/.test(v.id)&&v.historical_id===null&&v.status==='PROPOSED_ONLY_NOT_NORMATIVE','proposal cannot claim historical V2–V10 identity');
  const s=decode(v.input_state),t=BigInt(s.time),e=[...s.entities.values()];
  requireThat(t>=0n&&t<=((1n<<64n)-1n)&&e.length===1&&Number.isFinite(e[0].energy)&&Number.isSafeInteger(s.rng_state)&&s.rng_state>0&&s.rng_state<=0xffffffff,'invalid proposal state domain');
  const bytes=oracle.bytes(s);
  for(const key of ['world','full']){
   requireThat(/^(?:[a-f0-9]{2})+$/.test(v.expected[key+'_hex']),'invalid byte encoding');
   requireThat(bytes[key].toString('hex')===v.expected[key+'_hex']&&bytes[key].length===v.expected[key+'_bytes']&&oracle.fnv(bytes[key])===v.expected[key+'_fnv32'],'candidate vector differs from independent Node oracle');
  }
 }
 return {proposed_vectors_checked:9,historical_vectors_recovered:0,approved_vectors_added:0};
}
function validate(profile=load('conformance/acceptance-profile-candidate.json'),{checkLock=true}={}){
 requireThat(profile.profile_id==='WL-ACCEPT-v026-CAND-1.0.0'&&profile.status==='DRAFT_HOLD_NOT_APPROVED','candidate identity/status cannot imply approval');
 requireThat(profile.approval.approved===false&&profile.approval.modifies_section37===false&&profile.approval.approval_does_not_imply_conformance===true,'approval is not conformance and §37 remains unchanged');
 requireThat(profile.normative_priority[0]==='S026 explicit substitutions only'&&profile.normative_priority[1]==='S025 rest of current norm'&&!profile.normative_priority.some(x=>x.includes('js/')),'code cannot be authority or supersede current norm');
 if(checkLock){const lock=load('conformance/profile/profile-lock.json'),bytes=fs.readFileSync(path.join(root,lock.manifest.path));
  requireThat(lock.approved===false&&digest(bytes)===lock.manifest.sha256,'profile integrity lock mismatch');
  requireThat(same(profile,JSON.parse(bytes)),'object differs from locked candidate');
 }
 for(const r of profile.references)requireThat(digest(fs.readFileSync(path.join(root,r.path)))===r.sha256,'artifact hash mismatch: '+r.path);
 for(const file of ['sources-candidate.json','clause-inventory.json','contract-gaps.json','corpus-quality-review.json','architecture-review.json','vector-candidates.json','sufficiency-matrix.json','authority-breach-register.json'])requireThat(profile.references.some(r=>r.path==='conformance/profile/'+file),'required artifact/hash omitted: '+file);
 const sources=load('conformance/profile/sources-candidate.json');
 for(const s of sources){requireThat(!s.path.startsWith('js/'),'production code cannot become normative authority');const b=fs.readFileSync(path.join(root,s.path));requireThat(digest(b)===s.sha256,'source hash mismatch: '+s.id);if(s.original_sha256)requireThat(digest(s.encoding==='base64'?Buffer.from(b.toString(),'base64'):b)===s.original_sha256,'decoded source mismatch');}
 const inv=load('conformance/profile/clause-inventory.json'),quality=load('conformance/profile/corpus-quality-review.json'),suff=load('conformance/profile/sufficiency-matrix.json'),gaps=load('conformance/profile/contract-gaps.json'),cases=load('conformance/cases-f5-b.json'),report=load('conformance/results/f5-b.json');
 requireThat(new Set(inv.units.map(u=>u.id)).size===inv.units.length,'duplicate source unit');
 for(const u of inv.units){const source=sources.find(s=>s.id===u.source_id);requireThat(source,'source missing');
  const lines=literalSource(source).split(/\r?\n/).slice(u.source_lines[0]-1,u.source_lines[1]).join('\n');
  requireThat(lines===u.literal_text&&digest(Buffer.from(lines))===u.literal_sha256,'literal source locator/hash mismatch: '+u.id);
  if(u.authority_class==='A')requireThat(['S025','S026'].includes(u.source_id),'engineering/owner commentary promoted to current norm');
  if(['FORMAT_MARKER','TABLE_HEADER','SOURCE_METADATA','SOURCE_ATTRIBUTION_NOTE','INFORMATIVE_REPEATED_SUMMARY','RATIONALE_NOT_EXECUTION_RULE'].includes(u.kind))requireThat(!u.mandatory,'context/rationale is not a fabricated obligation');
 }
 for(const id of ['S025','S026']){const text=literalSource(sources.find(s=>s.id===id)).split(/\r?\n/),covered=new Set();
  for(const u of inv.units.filter(u=>u.source_id===id))for(let i=u.source_lines[0];i<=u.source_lines[1];i++)covered.add(i);
  for(const c of inv.clauses.filter(c=>c.source_id===id))covered.add(c.lines[0]);
  requireThat(text.every((s,i)=>!s.trim()||covered.has(i+1)),'unindexed current source line: '+id);
 }
 const mandatory=inv.units.filter(u=>u.mandatory).map(u=>u.id);
 requireThat(same(mandatory,profile.obligations.mandatory_ids),'mandatory clause removed or added without source');
 const opaque=inv.units.filter(u=>u.mandatory&&u.authority_class==='C').map(u=>u.id);
 requireThat(same(opaque,profile.obligations.opaque_mandatory_ids)&&profile.obligations.complete_incorporated_contract_universe_identified===false,'unknown inherited content cannot be waived');
 requireThat(quality.cases.length===114&&cases.length===114,'all original cases must be reviewed/preserved');
 const allowed=[];
 for(const q of quality.cases){const c=cases.find(c=>c.id===q.id);requireThat(c&&q.original_category===c.category&&q.category_unchanged,'case category promoted');
  if(q.profile_use==='MANDATORY_DEFINED_EXAMPLE'){requireThat(c.category!=='ENGINEERING-REGRESSION','engineering case made mandatory norm');allowed.push(q.id);}
 }
 requireThat(same(allowed,profile.mandatory_cases),'mandatory example set differs from reviewed quality');
 const conditional=quality.cases.filter(q=>q.profile_use==='CONDITIONALLY_REQUIRED_AFTER_PRECISION').map(q=>q.id);
 requireThat(same(conditional,profile.conditionally_required_cases.map(c=>c.id)),'conditional criteria cannot be dropped for absent implementation/contract');
 const complementary=quality.cases.filter(q=>q.profile_use.startsWith('COMPLEMENTARY')).map(q=>q.id);
 requireThat(same(complementary,profile.complementary_cases),'complementary authority changed');
 for(const dep of profile.test_dependencies)requireThat(cases.some(c=>c.id===dep.case)&&cases.some(c=>c.id===dep.positive_baseline),'missing positive baseline dependency');
 requireThat(profile.historical_blocks.count===289&&profile.historical_blocks.preserved&&profile.historical_blocks.may_not_count_as_pass,'historical blocks were relabelled');
 requireThat(report.results.filter(r=>r.status==='BLOCKED').length===289,'historical report blocks missing');
 requireThat(new Set(suff.rows.map(r=>r.obligation_id)).size===mandatory.length&&suff.rows.every(r=>mandatory.includes(r.obligation_id)),'sufficiency rows must cover every mandatory source unit');
 for(const row of suff.rows)if(row.decision==='SATISFIED_BY_EVIDENCE')finiteEvidence(inv.units.find(u=>u.id===row.obligation_id),row,cases,report);
 const review=load('conformance/profile/architecture-review.json');
 for(const f of review.source_files)requireThat(digest(fs.readFileSync(path.join(root,f.path)))===f.sha256,'reviewed code revision changed');
 requireThat(profile.non_executable_mandatory_evidence.every(e=>e.required),'static/formal evidence cannot be disabled');
 for(const r of review.reviews)requireThat(profile.non_executable_mandatory_evidence.some(e=>e.id==='EVIDENCE-'+r.id),'required static evidence removed');
 requireThat(profile.required_domain_partitions.length>0&&profile.required_domain_partitions.every(p=>p.required.length&&p.evidence),'domain partitions absent');
 requireThat(same(profile.verified_scope_exclusions,suff.verified_scope_exceptions),'only sourced scope exclusions are permitted');
 requireThat(profile.recommended_decision==='HOLD'&&opaque.length>0&&gaps.gaps.some(g=>g.blocks_candidate_readiness),'PASS count cannot override unresolved mandatory authority');
 const vectors=validateVectors(load('conformance/profile/vector-candidates.json'));
 return {profile_id:profile.profile_id,structure:'VALID_CANDIDATE_ARTIFACT',candidate_readiness:'HOLD',canonical_conformance:'NOT ESTABLISHED',interoperability:'NOT STARTED',historical_blocks:289,source_clauses:inv.clauses.length,source_units:inv.units.length,mandatory_units:mandatory.length,sufficiency_counts:suff.counts,verified_scope_exceptions:suff.verified_scope_exceptions.length,reviewed_cases:quality.cases.length,...vectors};
}
if(require.main===module){try{const r=validate();const text=JSON.stringify(r,null,2)+'\n';if(process.argv[2])fs.writeFileSync(process.argv[2],text);else process.stdout.write(text);}catch(e){process.stderr.write(String(e)+'\n');process.exitCode=1;}}
module.exports={validate,finiteEvidence,validateVectors,load,root};
