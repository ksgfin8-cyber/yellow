// Candidate governance checks; not new acceptance tests or normative V2–V10.
const {test}=require('node:test'),assert=require('node:assert/strict');
const {validate,finiteEvidence,validateVectors,load}=require('../conformance/profile/validate.cjs');
const profile=()=>structuredClone(load('conformance/acceptance-profile-candidate.json'));
const check=p=>validate(p,{checkLock:false});
test('F5C-PROFILE-01 valid integrity is HOLD, not approval or conformance',()=>{
 const r=validate();assert.equal(r.structure,'VALID_CANDIDATE_ARTIFACT');assert.equal(r.candidate_readiness,'HOLD');assert.equal(r.canonical_conformance,'NOT ESTABLISHED');assert.equal(r.historical_blocks,289);assert.equal(r.reviewed_cases,114);
});
test('F5C-PROFILE-02 cannot delete unknown criteria or disguise gaps as exclusions',()=>{
 let p=profile();const id=p.obligations.opaque_mandatory_ids[0];p.obligations.mandatory_ids=p.obligations.mandatory_ids.filter(x=>x!==id);p.obligations.opaque_mandatory_ids.shift();assert.throws(()=>check(p),/mandatory clause/);
 p=profile();p.verified_scope_exclusions.push({id:'EX-NO-IMPLEMENTATION',meaning:'omit because code absent'});assert.throws(()=>check(p),/scope exclusions/);
});
test('F5C-PROFILE-03 engineering/conditional cases cannot be silently promoted or dropped',()=>{
 let p=profile();p.mandatory_cases.push('ER5B-PREFIX-WAIT');assert.throws(()=>check(p),/mandatory example set/);
 p=profile();p.conditionally_required_cases.pop();assert.throws(()=>check(p),/conditional criteria/);
});
test('F5C-PROFILE-04 missing/tampered artifact hashes are rejected',()=>{
 let p=profile();p.references[0].sha256='0'.repeat(64);assert.throws(()=>check(p),/artifact hash/);
 p=profile();p.references=p.references.filter(r=>!r.path.endsWith('contract-gaps.json'));assert.throws(()=>check(p),/artifact\/hash omitted/);
});
test('F5C-PROFILE-05 static obligations cannot disappear or become optional',()=>{
 let p=profile();p.non_executable_mandatory_evidence.shift();assert.throws(()=>check(p),/static evidence removed/);
 p=profile();p.non_executable_mandatory_evidence[0].required=false;assert.throws(()=>check(p),/cannot be disabled/);
});
test('F5C-PROFILE-06 approval/GO cannot be inferred from passing examples',()=>{
 let p=profile();p.approval.approved=true;assert.throws(()=>check(p),/approval is not conformance/);
 p=profile();p.recommended_decision='APPROVE CANDIDATE';assert.throws(()=>check(p),/PASS count/);
});
test('F5C-PROFILE-07 PASS label cannot forge finite literal evidence',()=>{
 const inv=load('conformance/profile/clause-inventory.json'),suff=load('conformance/profile/sufficiency-matrix.json'),cases=load('conformance/cases-f5-b.json'),report=load('conformance/results/f5-b.json');
 const row=suff.rows.find(r=>r.decision==='SATISFIED_BY_EVIDENCE'&&r.clause==='§24.5'),unit=inv.units.find(u=>u.id===row.obligation_id);
 assert.equal(finiteEvidence(unit,row,cases,report),true);
 const fake=structuredClone(report);fake.results.find(r=>r.id==='CR-FNV-A').observed=0;assert.throws(()=>finiteEvidence(unit,row,cases,fake),/PASS label/);
 const both=structuredClone(cases),fake2=structuredClone(report);both.find(c=>c.id==='CR-FNV-A').expected=0;const r=fake2.results.find(r=>r.id==='CR-FNV-A');r.expected=0;r.observed=0;assert.throws(()=>finiteEvidence(unit,row,both,fake2),/literal FNV/);
});
test('F5C-PROFILE-08 proposed bytes/hashes match independent Python and Node calculations',()=>{
 const r=validateVectors(load('conformance/profile/vector-candidates.json'));assert.equal(r.proposed_vectors_checked,9);assert.equal(r.approved_vectors_added,0);assert.equal(r.historical_vectors_recovered,0);
});
test('F5C-PROFILE-09 vector corruption or historical identity promotion is rejected',()=>{
 let s=load('conformance/profile/vector-candidates.json');s.vectors[0].expected.full_hex='00'+s.vectors[0].expected.full_hex.slice(2);assert.throws(()=>validateVectors(s),/independent Node oracle/);
 s=load('conformance/profile/vector-candidates.json');s.vectors[0].id='V2';assert.throws(()=>validateVectors(s),/historical V2/);
});
test('F5C-PROFILE-10 production code cannot replace normative source precedence',()=>{
 const p=profile();p.normative_priority.unshift('js/world/world.js is authority');assert.throws(()=>check(p),/code cannot be authority/);
});
test('F5C-PROFILE-11 only finite literal reference fragments are sufficient, not F5-B counts',()=>{
 const s=load('conformance/profile/sufficiency-matrix.json');const complete=s.rows.filter(r=>r.decision==='SATISFIED_BY_EVIDENCE');assert.equal(complete.length,3);assert.ok(complete.every(r=>r.sufficiency_conditions.startsWith('Finite enumerated literal reference only')));assert.ok(s.rows.some(r=>r.decision==='BLOCKED_BY_UNRESOLVED_CONTRACT'));
});
