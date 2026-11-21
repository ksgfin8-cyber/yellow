'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {runChild}=require('../p01/supervisor.cjs'),{check,sha,ROOT}=require('./identity.cjs'),{LIMITS,smokePlan,config}=require('./protocol.cjs'),archive=require('./archive.cjs');
const codec=require('../p01/codec.cjs');
function destination(dir){assert.ok(path.isAbsolute(dir)&&path.resolve(dir)===dir);const parent=fs.realpathSync(path.dirname(dir)),rel=path.relative(ROOT,parent);assert.ok(rel==='..'||rel.startsWith('..'+path.sep),'development output must be outside repository');assert.ok(!/p01-|wl-rc1/i.test(parent+path.basename(dir)),'TITAN must stay separate from P01/RC1');assert.ok(!fs.existsSync(dir),'new destination required; no overwrite/retry');}
async function smoke(candidate,dir){
    const pinned=check(candidate);destination(dir);fs.mkdirSync(dir);const started=new Date().toISOString(),t=process.hrtime.bigint(),plan=smokePlan(),entries=[];
    fs.copyFileSync(candidate,path.join(dir,'candidate.json'),fs.constants.COPYFILE_EXCL);
    let used=fs.statSync(path.join(dir,'candidate.json')).size,stop=null;
    const record=row=>fs.appendFileSync(path.join(dir,'attempts.jsonl'),JSON.stringify(row)+'\n');
    for(const [index,episode] of plan.entries()){
        if(Number(process.hrtime.bigint()-t)/1e6>LIMITS.total_ms){stop='development total time admission limit';break;}
        check(candidate);record({type:'START',index,episode,at:new Date().toISOString()});
        const execution=await runChild(path.join(__dirname,'worker.cjs'),{episode,candidate:path.resolve(candidate),freeze_id:pinned.freeze_id},{timeout_ms:LIMITS.timeout_ms,heap_mib:LIMITS.heap_mib});
        const {result:payload,...operational}=execution;
        const artifact={freeze_id:pinned.freeze_id,request:episode,operational,payload};
        const bytes=archive.pack(artifact);if(used+bytes.length>LIMITS.archive_bytes-1024*1024){stop='development archive quota';record({type:'ARCHIVE_ERROR',index,operational,payload_not_archived:true});break;}
        const file=String(index).padStart(2,'0')+'.json.gz';const saved=archive.write(path.join(dir,file),bytes);used+=bytes.length;
        const restored=archive.unpack(fs.readFileSync(path.join(dir,file)));assert.deepEqual(restored,artifact);
        const row={index,episode,file,...saved,operational_status:operational.operational_status,
            verification:payload?.verification??null,metrics:payload?.metrics??null,timing:payload?.timing??null,resources:operational.resources};
        entries.push(row);record({type:'FINISH',...row});
        if(operational.operational_status!=='RETURNED'||operational.output_truncated||payload?.verification?.status!=='COMPLETE_MATCH'){
            stop=operational.diagnostic??'development episode verification failed';break;
        }
    }
    check(candidate);
    let equality={titan_pairs:0,common_initial_world_comparisons:0};
    if(!stop){
        const artifacts=entries.map(x=>archive.unpack(fs.readFileSync(path.join(dir,x.file))).payload.episode);
        for(const seed of [1,2,3,4]){const pair=artifacts.filter(x=>x.config.experiment_seed===seed&&x.config.agent_type==='titan_mvp_01');assert.equal(pair.length,2);assert.equal(codec.canonical(pair[0]),codec.canonical(pair[1]));equality.titan_pairs++;}
        const common=artifacts.filter(x=>x.config.experiment_seed===1);
        for(const x of common.slice(1)){assert.deepEqual(x.result.trajectory.initial_state,common[0].result.trajectory.initial_state);assert.deepEqual(x.wls1[0],common[0].wls1[0]);equality.common_initial_world_comparisons++;}
    }
    const files=fs.readdirSync(dir).sort().map(file=>{const b=fs.readFileSync(path.join(dir,file));return {file,bytes:b.length,sha256:sha(b)};});
    const manifest={format:'WL-TITAN-MVP01-DEVELOPMENT-SMOKE-1',freeze_id:pinned.freeze_id,
        status:!stop&&entries.length===plan.length?'COMPLETE':'PARTIAL',started_at:started,finished_at:new Date().toISOString(),wall_ms:Number(process.hrtime.bigint()-t)/1e6,
        planned:plan.length,attempts:entries.length,entries,stop,equality,files,limits:LIMITS,
        total_time_scope:'admission check between workers; per-child external timeout; not a controller-independent global watchdog',
        rss_scope:'per-worker Linux resourceUsage maxRSS, not aggregate RSS enforcement',evaluation_120_executed:false};
    fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});return manifest;
}
function verifyDirectory(dir){
    const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));assert.equal(m.format,'WL-TITAN-MVP01-DEVELOPMENT-SMOKE-1');
    assert.equal(check(path.join(dir,'candidate.json')).freeze_id,m.freeze_id);assert.deepEqual(m.limits,LIMITS);
    const plan=smokePlan();assert.equal(m.planned,plan.length);assert.ok(m.entries.length<=plan.length);
    if(m.status==='COMPLETE')assert.equal(m.entries.length,plan.length);
    assert.deepEqual(fs.readdirSync(dir).sort(),[...m.files.map(x=>x.file),'manifest.json'].sort());
    for(const r of m.files){assert.equal(path.basename(r.file),r.file);const b=fs.readFileSync(path.join(dir,r.file));assert.equal(b.length,r.bytes);assert.equal(sha(b),r.sha256);}
    const results=[];
    for(const [index,e] of m.entries.entries()){
        assert.equal(e.index,index);assert.deepEqual(e.episode,plan[index]);
        const a=archive.unpack(fs.readFileSync(path.join(dir,e.file)));assert.equal(a.freeze_id,m.freeze_id);assert.deepEqual(a.request,e.episode);
        if(a.payload){assert.equal(codec.canonical(a.payload.episode.config),codec.canonical(config(e.episode.seed,e.episode.agent)));results.push(require('./verify.cjs').verifyEpisode(a.payload.episode));}
        else assert.notEqual(m.status,'COMPLETE');
    }
    return {status:m.status,files:m.files.length+1,entries:m.entries.length,replay_results:results,evaluation_120_executed:false};
}
module.exports={destination,smoke,verifyDirectory};
