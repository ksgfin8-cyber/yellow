// Infrastructure tests only; these are not canonical acceptance IDs.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {run,runCases,validateCases}=require('../conformance/runner.cjs');
const {encode,decode,compare}=require('../conformance/wire.cjs');
const {createAdapter}=require('../conformance/adapter.cjs');
const root=path.resolve(__dirname,'..');
const sample=(id='INFRA')=>({id,category:'NORMATIVE-DERIVED',clauses:['test-only'],sources:['TEST-SOURCE'],operation:'stub',input:{value:1},expected:1,oracle:{kind:'value',method:'literal infrastructure fixture'}});
test('F5A-INFRA-01 detects wrong response',async()=>{
 const [r]=await runCases([sample()],()=>({execute:()=>2}));assert.equal(r.status,'FAIL');assert.equal(r.observed,2);
});
test('F5A-INFRA-02 unexpected exception and cause are recorded',async()=>{
 const [r]=await runCases([sample()],()=>({execute(){throw new Error('wrong',{cause:new Error('root cause')});}}));
 assert.equal(r.status,'FAIL');assert.equal(r.reason,'UNEXPECTED EXCEPTION');assert.equal(r.exception.cause.message,'root cause');
});
test('F5A-INFRA-03 correct hash with altered structure still fails',async()=>{
 const c={...sample(),expected:{hash:123,state:{energy:10}}};
 const [r]=await runCases([c],()=>({execute:()=>({hash:123,state:{energy:11}})}));assert.equal(r.status,'FAIL');
});
test('F5A-INFRA-04 BLOCKED, FAIL and UNTESTED remain distinct; none is PASS',async()=>{
 const report=await run({select:new Set(['CR-FNV-A'])});
 assert.equal(report.results.filter(r=>r.status==='PASS').length,1);
 assert.equal(report.results.filter(r=>r.status==='UNTESTED').length,49);
 assert.equal(report.results.filter(r=>r.status==='BLOCKED').length,289);
 assert.equal(report.results.find(r=>r.id==='T61').category,null);
 assert.equal(report.canonical_conformance,'NOT ESTABLISHED');
});
test('F5A-INFRA-05 duplicate IDs and missing oracles are rejected before adapters run',()=>{
 assert.throws(()=>validateCases([sample(),sample()]),/duplicate/);
 const c=sample();delete c.oracle;assert.throws(()=>validateCases([c]),/oracle/);
 const d=sample();delete d.expected;assert.throws(()=>validateCases([d]),/oracle/);
});
test('F5A-INFRA-06 preserves source input even if adapter mutates its own copy',async()=>{
 const c=sample(),before=structuredClone(c);
 const [r]=await runCases([c],()=>({execute(_op,x){x.value=9;return 1;}}));
 assert.equal(r.status,'PASS');assert.deepEqual(c,before);assert.deepEqual(r.input,{value:1});
});
test('F5A-INFRA-07 identical executions give byte-identical reports and retain provenance',async()=>{
 const a=await run(),b=await run();assert.equal(JSON.stringify(a),JSON.stringify(b));
 assert.equal(a.results.filter(r=>r.status==='PASS').length,50);
 const v=a.results.find(r=>r.id==='CR-WLS1-V1');assert.deepEqual(v.sources,['S025','H034']);assert.equal(v.original_reference,'V1');
 assert.equal(a.sources.find(s=>s.id==='H034').sha256.length,64);
 assert.equal(a.case_manifest_sha256.length,64);assert.equal(a.corpus_manifest_sha256.length,64);
});
test('F5A-INFRA-08 isolated factory/context per case',async()=>{
 let factories=0;const rows=await runCases([sample('FIRST'),sample('SECOND')],()=>{factories++;let counter=0;return {execute:()=>++counter};});
 assert.equal(factories,2);assert.ok(rows.every(r=>r.status==='PASS'));
});
test('F5A-INFRA-09 wire preserves BigInt, Map, bytes, binary64 and exact structural difference',()=>{
 const x={big:18446744073709551615n,map:new Map([['é',-0]]),bytes:Buffer.from([0,255]),tiny:Number.MIN_VALUE,notANumber:NaN,inf:Infinity,u:undefined};
 compare(decode(JSON.parse(JSON.stringify(encode(x)))),x);
 assert.throws(()=>compare({hash:1,state:{x:0}},{hash:1,state:{x:1}}));
 assert.throws(()=>decode({$type:'bigint',value:'01'}));
});
test('F5A-INFRA-10 rejects altered sources instead of trusting provenance labels',async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'worldlab-f5a-'));
 try{
  fs.mkdirSync(path.join(temp,'conformance'));fs.writeFileSync(path.join(temp,'source.txt'),'altered');
  for(const f of ['cases.json','corpus.json'])fs.copyFileSync(path.join(root,'conformance',f),path.join(temp,'conformance',f));
  fs.writeFileSync(path.join(temp,'conformance/sources.json'),JSON.stringify([{id:'BROKEN',path:'source.txt',sha256:'0'.repeat(64)}]));
  await assert.rejects(run({root:temp}),/source fingerprint mismatch/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('F5A-INFRA-11 expected exception is checked and does not mask unexpected success',async()=>{
 const c={...sample(),expected:{name:'Error',message:'specified'},oracle:{kind:'throws',method:'literal test fixture'}};
 assert.equal((await runCases([c],()=>({execute(){throw Error('specified');}})))[0].status,'PASS');
 assert.equal((await runCases([c],()=>({execute(){return 1;}})))[0].status,'FAIL');
});
test('F5A-INFRA-12 real adapters start with independent VM state and do not parse web scripts',()=>{
 const a=createAdapter({root}),b=createAdapter({root});
 assert.deepEqual(structuredClone(a.execute('prng',{seed:1,draws:1})),{values:[270369],state:270369});
 assert.deepEqual(structuredClone(b.execute('prng',{seed:1,draws:1})),{values:[270369],state:270369});
});
