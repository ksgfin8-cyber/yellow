'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'../..'),BASE='38bcb2116a31ecbaf4f401f41243d4adf88e98e3';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stable=x=>JSON.stringify(x&&typeof x==='object'?Array.isArray(x)?x.map(v=>JSON.parse(stable(v))):Object.fromEntries(Object.keys(x).sort().map(k=>[k,JSON.parse(stable(x[k]))])):x);
function build(){
    assert.ok(!process.env.NODE_OPTIONS,'NODE_OPTIONS must be empty for development provenance');
    const entries=cp.execFileSync('git',['ls-tree','-rz',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),baseline={};
    for(const entry of entries){const m=/^\d+ blob ([0-9a-f]+)\t(.+)$/s.exec(entry);assert.ok(m);const [,blob,file]=m,b=fs.readFileSync(path.join(ROOT,file));
        assert.equal(crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex'),blob,'frozen baseline changed: '+file);baseline[file]=sha(b);}
    const own=fs.readdirSync(__dirname).filter(f=>f.endsWith('.cjs')).sort().map(f=>'tools/titan-mvp-01/'+f)
        .concat(['js/agents/titan_mvp_01.js','tests/titan-mvp-01.test.cjs','tools/titan-mvp-01/fixtures/control.cjs','docs/research/titan-mvp-01/DEVELOPMENT_PROTOCOL.md']);
    const protocol=require('./protocol.cjs');
    const body={format:'WL-TITAN-MVP01-DEVELOPMENT-CANDIDATE-1',base:BASE,baseline,
        new_files:Object.fromEntries(own.map(f=>[f,sha(fs.readFileSync(path.join(ROOT,f)))])),
        runtime:{node:process.version,v8:process.versions.v8,platform:process.platform,arch:process.arch,node_sha256:sha(fs.readFileSync(process.execPath))},
        smoke_plan:protocol.smokePlan(),limits:protocol.LIMITS,evaluation_120:'HOLD_NO_EXECUTION_ENTRY'};
    return {freeze_id:sha(stable(body)),body};
}
function check(file){const x=JSON.parse(fs.readFileSync(file));assert.equal(x.freeze_id,sha(stable(x.body)));assert.deepEqual(x,build(),'development identity changed');return x;}
module.exports={ROOT,BASE,sha,stable,build,check};
