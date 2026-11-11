const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {run}=require('../conformance/runner.cjs'),{audit}=require('../conformance/mutation-f5-b.cjs');
const {createAdapter}=require('../conformance/adapter.cjs'),{decode}=require('../conformance/wire.cjs');
const root=path.resolve(__dirname,'..'),load=f=>JSON.parse(fs.readFileSync(path.join(root,'conformance',f),'utf8'));
test('F5B-INFRA-01 preserves all fifty F5-A cases, expectations, oracles and full default report',async()=>{
 const old=load('cases.json'),expanded=load('cases-f5-b.json');assert.deepEqual(expanded.slice(0,50),old);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'conformance/cases.json'))).digest('hex'),load('results/f5-a.json').case_manifest_sha256);
 assert.deepEqual(await run(),load('results/f5-a.json'));
});
test('F5B-INFRA-02 expanded report is deterministic and retains every original source block',async()=>{
 const before=fs.readFileSync(path.join(root,'conformance/cases-f5-b.json'),'utf8');
 const a=await run({caseFile:'cases-f5-b.json'}),b=await run({caseFile:'cases-f5-b.json'});
 assert.equal(JSON.stringify(a),JSON.stringify(b));assert.equal(a.results.filter(r=>r.status==='BLOCKED').length,289);
 assert.ok(a.results.filter(r=>r.id.startsWith('T')).every(r=>r.status==='BLOCKED'));
 assert.ok(a.results.filter(r=>/^(ND5B|ER5B)-/.test(r.id)).every(r=>r.status==='PASS'));
 assert.equal(fs.readFileSync(path.join(root,'conformance/cases-f5-b.json'),'utf8'),before);
});
test('F5B-INFRA-03 every new case detects corruption after real execution or suppressed exception',async()=>{
 const r=await audit(root);assert.equal(r.results.length,load('f5-b-manifest.json').added_case_ids.length);
 assert.ok(r.results.every(x=>x.baseline==='PASS'&&x.corrupted_response==='FAIL'&&x.caught));
});
test('F5B-INFRA-04 atomic obligations link existing parents, cases, preconditions and oracles',()=>{
 const rows=load('atomic-obligations-f5-b.json'),cases=load('cases-f5-b.json'),parents=load('obligations.json');
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
 for(const r of rows){assert.ok(r.scope&&r.preconditions.length);assert.equal(r.universal_conformance_claim,false);
  assert.ok(r.parent_ids.every(id=>parents.some(p=>p.id===id)));assert.ok(r.case_ids.every(id=>cases.some(c=>c.id===id)));
  if(r.case_ids.length)assert.equal(r.oracle.length,r.case_ids.length);else assert.ok(r.alternative_evidence);
 }
});
test('F5B-INFRA-05 optional manifest selection does not permit traversal or hide omitted cases',async()=>{
 await assert.rejects(run({caseFile:'../cases.json'}),/invalid case manifest/);
 const r=await run({caseFile:'cases-f5-b.json',select:new Set(['CR-FNV-A'])});
 assert.equal(r.results.filter(x=>x.status==='PASS').length,1);assert.equal(r.results.filter(x=>x.status==='UNTESTED').length,load('cases-f5-b.json').length-1);
 assert.equal(r.results.filter(x=>x.status==='BLOCKED').length,289);
});
test('F5B-INFRA-06 distinct valid states really collide in both production hashes and independent oracle',()=>{
 const cases=load('cases-f5-b.json'),p=decode(cases.find(c=>c.id==='ND5B-REPLAY-GENUINE-COLLISION').input),ref=load('collision-f5-b.json');
 const a=structuredClone(p.result.final_state),b=structuredClone(a);a.entities.get('0987898').energy=ref.a.energy;
 assert.notEqual(ref.a.energy,ref.b.energy);
 const adapter=createAdapter({root}),cfg=p.context.world_config;
 assert.deepEqual(adapter.execute('hash_state',{state:{...a,config:cfg}}),{world:ref.world,full:ref.full});
 assert.deepEqual(adapter.execute('hash_state',{state:{...b,config:cfg}}),{world:ref.world,full:ref.full});
});
