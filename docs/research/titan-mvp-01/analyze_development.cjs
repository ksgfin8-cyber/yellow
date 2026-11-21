'use strict';
// Read-only development evidence analysis. No WORLD execution or agent construction.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const [dir,repo]=process.argv.slice(2),archive=require(path.join(repo,'tools/titan-mvp-01/archive.cjs'));
const {measure}=require(path.join(repo,'tools/titan-mvp-01/metrics.cjs'));
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'))),agentHash=JSON.parse(fs.readFileSync(path.join(dir,'candidate.json'))).body.new_files['js/agents/titan_mvp_01.js'];
assert.equal(manifest.status,'COMPLETE');assert.equal(manifest.entries.length,12);
const artifacts=manifest.entries.map(e=>archive.unpack(fs.readFileSync(path.join(dir,e.file))));
const rows=[];let diagnostics=0,steps=0;
for(const [index,a] of artifacts.entries()){
    assert.equal(a.operational.operational_status,'RETURNED');const d=a.payload.episode,t=d.result.trajectory;
    assert.equal(d.result.status,'COMPLETED');assert.equal(t.steps.length,160);assert.equal(d.wls1.length,161);steps+=160;
    assert.deepEqual(measure(d),a.payload.metrics);
    assert.deepEqual([...t.initial_state.entities.keys()],['0987898']);
    if(d.config.agent_type==='titan_mvp_01'){
        assert.equal(d.decisions.length,160);
        for(const [i,x] of d.decisions.entries()){
            assert.equal(x.entity_id,'0987898');assert.equal(x.experiment_seed,a.request.seed);assert.equal(x.code_sha256,agentHash);
            assert.equal(x.tick,t.steps[i].observation.tick);assert.deepEqual(x.action,t.steps[i].action);
            assert.ok([0,1].includes(x.phi_exp));assert.equal(x.L_exp,2);assert.equal(x.cNull,2*x.phi_exp);
            const cap=Math.min(...x.costs.map(p=>p[1]));assert.equal(x.cap,cap);
            assert.ok(x.costs.every(p=>[0,1,3,4,5].includes(p[1])));
            const all=[...x.costs,['NULL',x.cNull]],min=Math.min(...all.map(p=>p[1])),expected=all.filter(p=>p[1]===min).map(p=>p[0]);
            assert.deepEqual(x.minimizers,expected);assert.equal(x.selected,expected[0]);
            assert.equal(x.action.type==='WAIT',x.selected==='NULL');diagnostics++;
        }
        assert.deepEqual(a.payload.metrics.rejected_actions,{});
    }else assert.equal(d.decisions.length,0);
    rows.push({index,...a.request,...a.payload.metrics,operational_resources:a.operational.resources,
        worker_timing:a.payload.timing,archive_bytes:manifest.entries[index].bytes});
}
let pairs=0;for(const seed of [1,2,3,4]){const p=artifacts.filter(a=>a.request.agent==='titan_mvp_01'&&a.request.seed===seed);assert.equal(p.length,2);assert.deepEqual(p[0].payload.episode,p[1].payload.episode);pairs++;}
const worlds=artifacts.filter(a=>a.request.seed===1).map(a=>a.payload.episode);
for(const d of worlds.slice(1)){assert.deepEqual(d.result.trajectory.initial_state,worlds[0].result.trajectory.initial_state);assert.deepEqual(d.wls1[0],worlds[0].wls1[0]);}
const max=Math.max(...rows.map(x=>x.operational_resources.wall_ms)),peak=Math.max(...rows.map(x=>x.operational_resources.max_rss_kib));
const summary={phase:'G1_DEVELOPMENT_ONLY',status:'READY_FOR_TITAN_MVP_01_REVIEW',freeze_id:manifest.freeze_id,
    planned:12,completed:12,failures:0,retries:0,seeds:[1,2,3,4],actions:steps,titan_diagnostic_decisions:diagnostics,
    titan_repetition_pairs_equal:pairs,seed1_common_initial_world_comparisons:worlds.length-1,
    all_replay_results:'COMPLETE_MATCH',titan_rejected_actions:0,worker_wall_max_ms:max,
    worker_peak_rss_kib:peak,rss_scope:'per-process maximum, not an aggregate bound',
    smoke_controller_wall_ms:manifest.wall_ms,episode_archive_bytes_sum:manifest.entries.reduce((a,b)=>a+b.bytes,0),
    scientific_evaluation_120_executed:false,scientific_hypothesis:'NOT_EVALUATED',global_conformity:'NOT_ESTABLISHED'};
console.log(JSON.stringify({summary,rows},null,2));
