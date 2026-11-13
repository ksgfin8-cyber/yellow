// Preparation tests only. All cryptographic identities and metrics episodes below are synthetic.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),cp=require('node:child_process');
const profile=require('../tools/p01/evaluation/profile.cjs'),{plan,config}=require('../tools/p01/protocol.cjs');
const {verifyReceipt,verifyProposal,DOMAIN}=require('../tools/p01/evaluation/gate.cjs'),{sha}=require('../tools/p01/provenance.cjs');
const {compareCampaign}=require('../tools/p01/metrics.cjs'),{archiveFor,readArchive,pack}=require('../tools/p01/archive.cjs');
function signedFixture(fn){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-synthetic-approval-')),keys=crypto.generateKeyPairSync('ed25519'),id='a'.repeat(64);
 const receipt={format:'WL-P01-AUTHORIZATION-1',decision:'AUTHORIZE_P01_FINAL_EVALUATION',freeze_id:id,reviewer:'SYNTHETIC TEST KEY',approval_reference:'TEST ONLY - NOT PROJECT AUTHORIZATION',campaign_id:'synthetic',output_directory:path.join(dir,'never-executed')};
 const options={receiptFile:path.join(dir,'receipt.json'),signatureFile:path.join(dir,'signature'),keyFile:path.join(dir,'public.pem'),expectedFreezeId:id,trustedKeySha256:sha(keys.publicKey.export({format:'der',type:'spki'}))};
 fs.writeFileSync(options.keyFile,keys.publicKey.export({format:'pem',type:'spki'}));
 const sign=r=>{const b=Buffer.from(JSON.stringify(r));fs.writeFileSync(options.receiptFile,b);fs.writeFileSync(options.signatureFile,crypto.sign(null,Buffer.concat([Buffer.from(DOMAIN),b]),keys.privateKey));};sign(receipt);
 try{fn({dir,id,receipt,options,sign});assert.ok(!fs.existsSync(receipt.output_directory));}finally{fs.rmSync(dir,{recursive:true,force:true});}
}
test('F6E-01 pure plan has exactly256 requests, final seeds only, four agents and two ordered repetitions',()=>{
 const p=profile.executionPlan();assert.equal(p.length,256);assert.deepEqual(p.slice(0,3),[{seed:1001,agent:'wait',repetition:1},{seed:1001,agent:'wait',repetition:2},{seed:1001,agent:'random',repetition:1}]);assert.deepEqual(p.at(-1),{seed:1032,agent:'frontier_memory_v1',repetition:2});assert.equal(new Set(p.map(r=>`${r.seed}/${r.agent}/${r.repetition}`)).size,256);
});
test('F6E-02 final configuration exactly reuses preregistration without world generation',()=>{
 for(const seed of [1001,1032])for(const agent of profile.AGENTS){const c=profile.config(seed,agent);assert.deepEqual(c,{...plan(),experiment_seed:seed,agent_type:agent});c.world_config.move_cost=900;assert.equal(profile.config(seed,agent).world_config.move_cost,1);}
 assert.deepEqual(profile.LIMITS,{timeout_ms:30000,heap_mib:512});
});
test('F6E-03 final seed/type/domain and request overrides are rejected',()=>{
 for(const seed of [0,1,4,1000,1033,1.5,'1001',1001n,NaN])assert.throws(()=>profile.config(seed,'wait'),/invalid seed/);
 assert.throws(()=>profile.config(1001,'custom'),/invalid seed\/agent/);assert.throws(()=>profile.assertRequest({seed:1001,agent:'wait',max_ticks:1}),/invalid request/);
});
test('F6E-04 development entry remains closed to final seeds',()=>{
 for(const seed of [1001,1032])assert.throws(()=>config(seed,'wait'),/not authorized/);
});
test('F6E-05 archive factory preserves the original codec and default guard',()=>{
 const a=readArchive(path.resolve(__dirname,'../docs/f6-b/smoke/1-wait-1.wlx.gz'));
 assert.deepEqual(archiveFor().pack(a),pack(a));const changed=structuredClone(a);changed.provenance.seeds.experiment=1001;
 assert.throws(()=>archiveFor().validateArtifact(changed),/not authorized/);
});
test('F6E-06 explicit matching pins and detached Ed25519 receipt verify without executing',()=>signedFixture(({id,receipt,options})=>assert.deepEqual(verifyReceipt(id,options),receipt)));
test('F6E-07 missing or different freeze pin cannot authorize',()=>signedFixture(({id,options})=>{
 for(const expectedFreezeId of [undefined,'b'.repeat(64)])assert.throws(()=>verifyReceipt(id,{...options,expectedFreezeId}),/freeze pin/);
}));
test('F6E-08 arbitrary public key or absent out-of-band pin cannot authorize',()=>signedFixture(({id,options})=>{
 for(const trustedKeySha256 of [undefined,'b'.repeat(64)])assert.throws(()=>verifyReceipt(id,{...options,trustedKeySha256}),/key pin/);
}));
test('F6E-09 altered receipt or signature fails verification',()=>signedFixture(({id,options,receipt})=>{
 fs.writeFileSync(options.receiptFile,JSON.stringify({...receipt,output_directory:receipt.output_directory+'-changed'}));assert.throws(()=>verifyReceipt(id,options),/signature/);
 fs.writeFileSync(options.receiptFile,JSON.stringify(receipt));fs.writeFileSync(options.signatureFile,Buffer.alloc(64));assert.throws(()=>verifyReceipt(id,options),/signature/);
}));
test('F6E-10 a signed Boolean, unknown field or wrong decision is still invalid',()=>signedFixture(({id,options,receipt,sign})=>{
 for(const r of [{approved:true},{...receipt,approved:true},{...receipt,decision:'APPROVE_DEVELOPMENT'},{...receipt,freeze_id:'b'.repeat(64)}]){sign(r);assert.throws(()=>verifyReceipt(id,options),/receipt/);}
}));
test('F6E-11 output directory must be explicitly bound and absolute',()=>signedFixture(({id,options,receipt,sign})=>{
 for(const output_directory of ['', 'relative/path']){sign({...receipt,output_directory});assert.throws(()=>verifyReceipt(id,options),/absolute output/);}
}));
test('F6E-12 production worker rejects authorization before even importing the runtime',()=>{
 let callback,message,runtimeImports=0;const context={Buffer,process:{execArgv:['--max-old-space-size=512'],once:(_,fn)=>{callback=fn;},resourceUsage:()=>({userCPUTime:0,systemCPUTime:0,maxRSS:0}),send:(m,fn)=>{message=m;fn();},disconnect:()=>{}},require:name=>{
  if(name==='./gate.cjs')return {authorize:()=>{throw Error('specific approval missing');}};
  if(name==='./profile.cjs')return profile;
  runtimeImports++;throw Error('runtime import forbidden in preparation');
 }};
 vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../tools/p01/evaluation/worker.cjs'),'utf8'),context);
 callback({seed:1001,agent:'wait',authorization:{}});assert.equal(runtimeImports,0);assert.equal(message.kind,'error');assert.match(message.diagnostic,/approval missing/);
});
test('F6E-13 unsigned campaign cannot create an output or start a worker',async()=>{
 const {runCampaign}=require('../tools/p01/evaluation/controller.cjs');await assert.rejects(runCampaign({}),/signed authorization required/);
});
test('F6E-14 CLI accepts no Boolean, parameter override or abbreviated run',()=>{
 const cli=path.resolve(__dirname,'../tools/p01/evaluation/cli.cjs');
 for(const args of [['run','--approved','true'],['run','--max-ticks','1']]){const r=cp.spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});assert.equal(r.status,1);assert.match(r.stderr,/no evaluation without specific owner approval/);}
});
test('F6E-15 proposal Boolean cannot replace a content identity',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-invalid-freeze-'));try{const file=path.join(dir,'proposal.json');fs.writeFileSync(file,JSON.stringify({approved:true}));assert.throws(()=>verifyProposal(file),/freeze identity/);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
function toyEntries(){
 // Hand-made arithmetic fixture, no engine, PRNG, world generation or agent invocation.
 const result=count=>{const state=(t)=>({time:t,grid:[[{effect:null},{effect:{kind:'RESOURCE',stock:t&&count?0:1}},{effect:{kind:'RESOURCE',stock:t>1&&count>1?0:1}}]],entities:new Map([['e',{id:'e',position:{x:Math.min(t,count),y:0},energy:240-t+8*Math.min(t,count),lifecycle:'ACTIVE'}]])});return {status:'COMPLETED',failure_reason:null,trajectory:{initial_state:state(0),steps:[1,2].map(t=>({world_state:state(t),action_result:{validity:'VALID',reason:'NONE'}})),events:Array.from({length:count},(_,i)=>({type:'RESOURCE_CONSUMED',source:'action',position:{x:i+1,y:0}})),termination_reason:'MAX_TICKS_REACHED'}};};
 return profile.executionPlan().map(r=>({...r,artifact:{provenance:{seeds:{experiment:r.seed},algorithm:{id:r.agent}},operational:{attempt_id:`synthetic-${r.seed}-${r.agent}-${r.repetition}`,operational_status:'RETURNED'},data:{result:result(r.agent==='random'?2:1)}},verification:{status:'COMPLETE_MATCH',initial_full_hex:'SYNTHETIC_NOT_REPLAY_EVIDENCE'}}));
}
test('F6E-16 synthetic32-pair metrics preserve negative-effect technical acceptance',()=>{
 const a=compareCampaign(toyEntries(),'FINAL_EVALUATION');assert.equal(a.technical_status,'PASS');assert.equal(a.eligible_pairs,32);assert.equal(a.planned_attempts,256);assert.equal(a.distribution.mean,-1);assert.equal(a.final_hypothesis,'H_PLUS_NOT_SUPPORTED');assert.equal(a.evaluation_authorized,false);
});
test('F6E-17 synthetic missing/failed final attempt cannot be excluded to get a mean',()=>{
 const x=toyEntries();x.pop();const a=compareCampaign(x,'FINAL_EVALUATION');assert.equal(a.technical_status,'NOT_EVALUABLE');assert.equal(a.distribution,null);
});
test('F6E-18 unrecognized analysis phase is rejected',()=>assert.throws(()=>compareCampaign([],'custom'),/invalid campaign phase/));
function controllerSimulation({existing=false,drift=false,storageFailure=false,supervisorFailure=false}={}){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'p01-controller-simulation-')),output=path.join(dir,'output'),options={trustedKeySha256:'SYNTHETIC'};
 for(const k of ['proposalFile','receiptFile','signatureFile','keyFile']){options[k]=path.join(dir,k);fs.writeFileSync(options[k],'synthetic fixture');}
 if(existing)fs.mkdirSync(output);let calls=0,checks=0;
 const mockFs={...fs,writeFileSync:(file,...rest)=>{if(storageFailure&&file.endsWith('.raw.gz'))throw Error('SIMULATED_STORAGE_FAILURE');return fs.writeFileSync(file,...rest);}};
 const receipt={output_directory:output,campaign_id:'SYNTHETIC'},proposal={freeze_id:'synthetic',body:{scope:'SYNTHETIC - NO EPISODES'}};
 const fakeArchive={createArtifact:()=>{if(calls===1)throw Error('SIMULATED_ARCHIVE_VALIDATION_ERROR');return {};},writeArchive:()=>({bytes:1,sha256:'synthetic'}),readArchive:()=>({}),verifyArtifact:()=>({status:'COMPLETE_MATCH'})};
 const context={module:{exports:{}},__dirname:path.resolve(__dirname,'../tools/p01/evaluation'),require:name=>{
  if(name==='node:fs')return mockFs;if(name==='./gate.cjs')return {authorize:()=>{checks++;if(drift&&checks>1)throw Error('SIMULATED_AUTHORIZATION_DRIFT');return {proposal,receipt};}};
  if(name==='./profile.cjs')return {LIMITS:profile.LIMITS,executionPlan:()=>[{seed:1,agent:'wait',repetition:1},{seed:1,agent:'wait',repetition:2}]};
  if(name==='../archive.cjs')return {archiveFor:()=>fakeArchive};
  if(name==='../supervisor.cjs')return {runChild:async()=>{calls++;if(supervisorFailure)throw Error('SIMULATED_FORK_FAILURE');return {attempt_id:'synthetic-'+calls,operational_status:'TIMEOUT',result:null};}};
  if(name==='../provenance.cjs')return {provenance:()=>({fixture:true}),sha,git:()=>''};
  if(name==='../metrics.cjs')return {compareCampaign:()=>{throw Error('must not analyze a failed simulation as complete');}};
  if(name==='../codec.cjs')return require('../tools/p01/codec.cjs');return require(name);
 }};
 vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../tools/p01/evaluation/controller.cjs'),'utf8'),context);
 return {dir,output,options,run:()=>context.module.exports.runCampaign(options),calls:()=>calls,clean:()=>fs.rmSync(dir,{recursive:true,force:true})};
}
test('F6E-19 simulated archive failure preserves raw return and does not lose subsequent attempts',async()=>{
 const s=controllerSimulation();try{const r=await s.run();assert.equal(s.calls(),2);assert.equal(r.manifest.entries.length,2);assert.equal(r.analysis.technical_status,'NOT_EVALUABLE');
  const zlib=require('node:zlib'),{decode}=require('../tools/p01/codec.cjs');const raw=decode(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(s.output,'1-wait-1.raw.gz')))));
  assert.equal(raw.format,'WL-P01-RAW-ATTEMPT-1');assert.equal(raw.execution.operational_status,'TIMEOUT');assert.equal(raw.execution.result,null);
 }finally{s.clean();}
});
test('F6E-20 even an empty existing output forbids silent rerun before any worker',async()=>{
 const s=controllerSimulation({existing:true});try{await assert.rejects(s.run(),/EEXIST/);assert.equal(s.calls(),0);}finally{s.clean();}
});
test('F6E-21 authorization drift stops new launches and remains recorded',async()=>{
 const s=controllerSimulation({drift:true});try{const r=await s.run();assert.equal(s.calls(),0);assert.match(r.manifest.aborted,/DRIFT/);assert.equal(r.analysis.technical_status,'NOT_EVALUABLE');}finally{s.clean();}
});
test('F6E-22 raw storage failure stops further launches without manufacturing a result',async()=>{
 const s=controllerSimulation({storageFailure:true});try{const r=await s.run();assert.equal(s.calls(),1);assert.match(r.manifest.aborted,/raw attempt storage failed/);assert.equal(r.analysis.technical_status,'NOT_EVALUABLE');}finally{s.clean();}
});
test('F6E-23 supervisor failure gets its own external diagnostic for each attempt',async()=>{
 const s=controllerSimulation({supervisorFailure:true});try{const r=await s.run();assert.equal(s.calls(),2);const f=JSON.parse(fs.readFileSync(path.join(s.output,'1-wait-1.failure.json')));assert.equal(f.result,null);assert.match(f.error,/FORK_FAILURE/);assert.equal(r.analysis.technical_status,'NOT_EVALUABLE');}finally{s.clean();}
});

test('F6E-24 output inside checkout is rejected even with a valid test signature',()=>signedFixture(({id,options,receipt,sign})=>{
 sign({...receipt,output_directory:path.resolve(__dirname,'../not-created')});assert.throws(()=>verifyReceipt(id,options),/outside repository/);
}));
