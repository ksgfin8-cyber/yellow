const fs=require('node:fs'),path=require('node:path');
const all=require('./cases-f5-b.json'),parents=require('./obligations.json');
const rows=[];
function atom(id,priority,clauses,ids,scope,{decision='SATISFIED_WITH_EXECUTED_EXAMPLES',category='OBSERVABLE OBLIGATION',alternative=null}={}){
 const cases=ids.map(id=>{const c=all.find(c=>c.id===id);if(!c)throw Error('unknown case '+id);return c;});
 const parent_ids=[...new Set(clauses.map(c=>c.startsWith('D-01-')?c:(c.match(/^§\d+/)||[])[0]).filter(Boolean))];
 if(parent_ids.some(id=>!parents.some(r=>r.id===id)))throw Error('unknown obligation parent');
 const sources=[...new Set(cases.length?cases.flatMap(c=>c.sources):clauses.map(c=>c.startsWith('D-01-')?'S026':'S025'))];
 rows.push({id,priority,kind:category,parent_ids,clauses,sources,source_locators:clauses,scope,
  preconditions:cases.length?cases.map(c=>({case:c.id,requires:c.preconditions||'Exact F5-A input in cases.json'})):['Requires missing source or alternative evidence'],
  operation:cases.map(c=>({case:c.id,operation:c.operation})),oracle:cases.map(c=>({case:c.id,...c.oracle})),
  postconditions:cases.length?cases.map(c=>({case:c.id,exact_expected_ref:'cases-f5-b.json / '+c.id+' / expected'})):['No runtime postcondition; alternative evidence/authorization remains required'],
  case_ids:ids,domain_coverage:'PARTIAL; finite explicit examples, no universal assertion',decision_if_cases_pass:decision,
  alternative_evidence:alternative,universal_conformance_claim:false});
}
const ids=prefix=>all.filter(c=>c.id.startsWith(prefix)).map(c=>c.id);
atom('OB-RNG-RESTORE','P0',['§10.7'],['ND5B-RNG-RESTORE'],'Checkpoint restores next uint32/float/int outputs');
atom('OB-RNG-REJECTION','P0',['§10.3'],['ND5B-RNG-REJECT'],'Equality/above rejection boundary consumes additional draws');
atom('OB-RNG-FLOAT','P0',['§10.2'],['ND5B-RNG-FLOAT'],'Maximum draw divided exactly by 2^32');
atom('OB-TICK-ORDER','P0',['§5.1','§32'],['ND-TICK-ORDER','ND5B-TICK-UNCONFIRMED'],'Action→lifecycle→dynamics, clock/sync only in confirmation');
atom('OB-TICK-TIME-AND-SYNC','P0',['§4.1','§5.2'],['ND5B-TICK-UNCONFIRMED'],'Unconfirmed tick neither changes time nor synchronizes RNG');
atom('OB-ROLLBACK-STATE','P0',['§5.5','§26.5'],ids('ND5B-ROLLBACK-'),'WORLD restored after action/lifecycle/dynamics/sync/postvalidation fault');
atom('OB-ROLLBACK-RNG','P0',['§10.7','§26.5'],ids('ND5B-ROLLBACK-'),'Effective RNG restored after mutation and transition failure');
atom('OB-SNAPSHOT-ALIAS','P0',['§7.2'],['ND5B-SNAPSHOT'],'Active/confirmed snapshots do not share mutable entity position/energy');
atom('OB-UINT64-OVERFLOW','P0',['D-01-E'],['ND5B-TIME-OVERFLOW'],'No successor beyond UINT64_MAX');
atom('OB-REPLAY-STRUCTURE','P0',['§25.3.1','§24.3–4'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-STORED-HASH','ND5B-REPLAY-REHASHED-STATE','ER5B-COLLISION-ORIGIN','ND5B-REPLAY-GENUINE-COLLISION'],'Reject altered state despite retained, independently recalculated or genuinely colliding correct WORLD/FULL hashes');
atom('OB-REPLAY-TEMPORAL','P0',['§25.3.1','D-01-E'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-TIME-GAP'],'Each record is exactly predecessor time+1');
atom('OB-EVENT-ORDER','P0',['§25.3.1','D-01-B'],['ER5B-PREFIX-MOVE','ND5B-REPLAY-EVENT-ORDER'],'Typed event order is part of full structural continuity');
atom('OB-EVENT-SEQUENCE','P0',['D-01-B'],['ER5B-PREFIX-MOVE','ND5B-REPLAY-EVENT-SEQUENCE'],'Local segment sequence remains globally contiguous across ticks');
atom('OB-CONTEXT-COST','P0',['D-01-C'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-COST-CONTEXT'],'Changing physical costs cannot be silently inferred away');
atom('OB-CONTEXT-FLAGS','P0',['D-01-C','D-01-D'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-FLAGS-CONTEXT'],'Feedback exposure context must match supplied request');
atom('OB-REPLAY-OBSERVATION','P0',['§16','§25.3.1'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-OBSERVATION'],'Observation and feedback observation are compared, not omitted');
atom('OB-REPLAY-FEEDBACK','P0',['§17','§25.3.1'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-FEEDBACK'],'Prior action feedback is compared structurally');
atom('OB-ORIGIN-STATE','P0',['§25.3.1','D-01-B'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-INITIAL-ENERGY','ND5B-REPLAY-INITIAL-RNG'],'Replay restores supplied state/effective RNG, not a guessed seed');
atom('OB-METADATA-DOMAINS','P0',['D-01-C'],[...ids('ND-METADATA-'),'ND5B-REPLAY-METADATA'],'Malformed metadata rejected with valid physical prefix (F4F-001 regression)');
atom('OB-MODE-EXPLICIT','P0',['D-01-D'],['ER5B-PREFIX-WAIT','ND5B-REPLAY-MODE','ND-MODE-WITHOUT_AGENT'],'Observed/non-observed modes are not interchangeable');
atom('OB-TIME-REPRESENTATION','P0',['D-01-E'],['ND5B-TIME-EQUIVALENT','ND5B-TIME-UNSAFE','ND-UINT64'],'Admitted equivalent integers compare by value; unsafe Number rejected');
atom('OB-WLS1-CELLS','P0',['§34'],['CR-WLS1-V1','ND5B-WLS1-CELL-ORDER'],'Fixed tag codes and row-major byte layout');
atom('OB-WLS1-UTF8-BINARY64','P0',['§34','§6.4'],ids('ND5B-WLS1-').filter(id=>id!=='ND5B-WLS1-CELL-ORDER'),'Byte lengths/UTF-8, binary64 exact except -0→+0');
atom('OB-WLS1-RNG-HASH','P0',['§24.2','§34'],ids('ND5B-HASH-RNG-'),'WORLD excludes RNG; FULL hashes exact uint32 RNG suffix');
atom('OB-AGENT-WORLD-SEPARATION','P0',['§4.2','§35.5'],['ND5B-AGENT-ISOLATION'],'Changing only private agent draw count preserves WORLD trajectory',{decision:'PARTIALLY_COVERED',alternative:'Metamorphic example is not a complete data-flow proof or adversarial sandbox proof'});
atom('OB-CONFIG-DOMAINS','P1',['§6.1','§6.2'],ids('ND5B-CONFIG-'),'Explicit numeric domains, cell limit, closed schema and immutability');
atom('OB-ENERGY-BINARY64','P1',['§6.3','§6.4'],ids('ND5B-ENERGY-'),'Observed energy calculation helper uses binary64 ties-to-even and canonical zero without side effects; does not recover missing action-cost policies');
atom('OB-OBSERVATION-BOUNDARY','P1',['§16'],['ND5B-OBSERVATION'],'Literal 3x3 Chebyshev boundary mask and occupied=false');
atom('OB-OBSERVATION-PURITY','P1',['§4.1','§16'],['ND5B-OBSERVATION'],'Observation does not mutate WORLD or consume RNG');
atom('OB-FEEDBACK-CONFIG','P1',['§17'],ids('ND5B-FEEDBACK-'),'Strict boolean fields and no extra key');
atom('OB-ACTION-FRONTIER','P1',['§13'],ids('ND5B-ACTION-').filter(id=>id!=='ND5B-ACTION-UNKNOWN'),'Actions preserve time/lifecycle/RNG and bounded position with blocked neighbor');
atom('OB-ACTION-ENUM','P1',['§12','§13'],['ND5B-ACTION-UNKNOWN'],'Unknown action type raises ContractError');
atom('OB-LIFECYCLE-INITIAL','P1',['§9','§14','§11.7'],ids('ND5B-LIFECYCLE-'),'Recovered initial <= threshold boundary, one raw death, no resurrection');
atom('OB-AGENT-FAILURE','P1',['§20.6','§28.5'],['ND5B-AGENT-throw','ND5B-AGENT-malformed'],'No invalid tick; FAILED AGENT_CONTRACT_ERROR with preserved committed prefix');
atom('OB-NO-AGENT-WAIT','P1',['§20.2','§27'],['ND5B-NO-AGENT'],'WAIT and actual non-null ActionResult, null contexts in both steps');
atom('OB-INITIALIZATION-FAILURE','P1',['§11.3','§20.5'],['ND5B-INIT-FAILURE'],'No FREE candidate returns InitializationFailure outside Trajectory');
atom('OB-RECORDER-OWNERSHIP','P0',['§21'],['ER5B-RECORDER-OWNERSHIP'],'Current owned-history policy only',{decision:'PARTIALLY_COVERED',alternative:'Engineering regression does not recover full historical Recorder contracts'});
atom('OB-RESOURCE-AND-REGEN','P1',['§13','§15'],['ER5B-EFFECT-RESOURCE'],'Current resource entry energy and DYN-P01 binary regeneration',{decision:'PARTIALLY_COVERED',alternative:'Full historical physical action/regeneration clauses still not recovered as independent original text'});
atom('OB-HAZARD','P1',['§13'],['ER5B-EFFECT-HAZARD'],'Current static hazard energy balance',{decision:'PARTIALLY_COVERED',alternative:'Current compatible policy; not a recovered individual historical test'});
atom('OB-RENDERER-READONLY','P2',['§29','§4.1'],[],'Read-only snapshot consumer',{decision:'PARTIALLY_COVERED',alternative:'Existing F4A-16 Chromium integration/purity reexecuted; no new canonical browser oracle'});
atom('OB-OLD-CORPUS','P0',['§36','§37'],[],'Authentic individual T01–T280 definitions and execution',{decision:'DOCUMENTATION_BLOCKED',alternative:'Need original inputs/procedures/expected or an expressly approved acceptance amendment'});
atom('OB-OLD-INVARIANTS','P0',['§31'],[],'I-01–I-66 incorporated by reference without complete literal source',{decision:'DOCUMENTATION_BLOCKED',alternative:'Verified historical file, not reverse engineering from current code'});
atom('OB-HISTORICAL-MECHANICS','P1',['§13','§15','§18'],[],'Complete historical ActionResult/action/regeneration clauses beyond available fragments',{decision:'DOCUMENTATION_BLOCKED',alternative:'Recover source or explicitly decide remaining normative details; engineering policies do not become historical authority'});
atom('OB-PENDING-VECTORS','P0',['§34'],[],'V2–V10 have no fixed reference bytes/hashes',{decision:'DOCUMENTATION_BLOCKED',alternative:'Authorized vector freezing with independent calculation and future cross-implementation comparison'});
atom('OB-ARCHITECTURAL-PROHIBITIONS','P0',['§4.1'],[],'WORLD/AGENT/RECORDER/METRICS separation beyond tested examples',{decision:'NON_EXECUTABLE_ALTERNATIVE_EVIDENCE',alternative:'Static dependency/data-flow review with source hashes and capability boundary review; dynamic tests alone insufficient'});
atom('OB-INDEPENDENT-INTEROPERABILITY','P0',['§35','§37'],[],'Hito C and comparison of independent implementations',{decision:'INDEPENDENT_IMPLEMENTATION_REQUIRED',alternative:'No second implementation authorized or executed in F5-B'});
atom('BOUNDARY-CHECKPOINT-PROVENANCE','P0',['D-01-B'],[],'Checkpoint legitimacy is excluded from replay segment certification',{category:'EXPLICIT EPISTEMIC LIMITATION; NOT A NEW REQUIREMENT',decision:'NON_EXECUTABLE_ALTERNATIVE_EVIDENCE',alternative:'External provenance evidence if a separate claim of historical legitimacy is made; not required for segment continuity'});
atom('GOVERNANCE-ACCEPTANCE-BASIS','P0',['§37'],[],'Whether a derived corpus may replace unavailable historical tests',{category:'DECISION PREPARATION; NO CURRENT RULE CHANGE',decision:'NON_EXECUTABLE_ALTERNATIVE_EVIDENCE',alternative:'Explicit owner approval of a separately versioned normative amendment; proposal only in F5-B'});
fs.writeFileSync(path.join(__dirname,'atomic-obligations-f5-b.json'),JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({atomic_rows:rows.length,executable_case_links:rows.reduce((n,r)=>n+r.case_ids.length,0)}));
