const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {runChild}=require('../tools/p01/supervisor.cjs'),{config}=require('../tools/p01/protocol.cjs');
const worker=path.resolve(__dirname,'../tools/p01/worker.cjs');
test('F6B-EX01 evaluation requests are rejected before generation',()=>{
 assert.throws(()=>config(1001,'wait'),/evaluation seeds are not authorized/);assert.throws(()=>config(1032,'wait'),/evaluation seeds are not authorized/);
 assert.throws(()=>config(0,'wait'),/development seeds/);
});
test('F6B-EX02 hanging child is killed; next episode still completes',async()=>{
 const bad=await runChild(path.resolve(__dirname,'fixtures/p01-hang.cjs'),{}, {timeout_ms:1500,heap_mib:64});
 assert.match(bad.stdout,/entered-blocking-step/);assert.equal(bad.operational_status,'TIMEOUT');assert.equal(bad.result,null);assert.equal(bad.signal,'SIGKILL');
 const good=await runChild(worker,{seed:1,agent:'wait'});assert.equal(good.operational_status,'RETURNED');assert.equal(good.result.status,'COMPLETED');assert.equal(good.result.trajectory.steps.length,160);
 assert.ok(good.resources.max_rss_kib>0);assert.ok(good.resources.cpu_user_us>=0);assert.equal(good.limits.heap_mib,512);
});
test('F6B-EX03 process error does not invent ExperimentResult',async()=>{
 const x=await runChild(path.resolve(__dirname,'fixtures/p01-crash.cjs'),{}, {timeout_ms:2000,heap_mib:64});
 assert.equal(x.operational_status,'WORKER_ERROR');assert.equal(x.result,null);assert.equal(x.exit_code,7);
});
test('F6B-EX04 worker independently rejects evaluation seed with no canonical result',async()=>{
 const x=await runChild(worker,{seed:1001,agent:'wait'});assert.equal(x.operational_status,'WORKER_ERROR');assert.equal(x.result,null);assert.match(x.diagnostic,/not authorized/);
});
test('F6B-EX05 missing executable worker cannot leave controller hanging',async()=>{
 const x=await runChild(path.resolve(__dirname,'fixtures/no-such-worker.cjs'),{}, {timeout_ms:2000,heap_mib:64});
 assert.equal(x.operational_status,'WORKER_ERROR');assert.equal(x.result,null);
});
