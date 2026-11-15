const fs=require('fs'),path=require('path'),zlib=require('zlib'),assert=require('assert/strict');
const {decode,canonical}=require('/workspace/yellow/tools/p01/codec.cjs');
const {measure}=require('/workspace/yellow/tools/p01/metrics.cjs');
const dir=path.join(process.env.P01_RESTORED,'files'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'campaign.json'))),archived=JSON.parse(fs.readFileSync(path.join(dir,'analysis.json')));
const rows=manifest.entries.map(r=>{const a=decode(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir,r.file)))).body);return {seed:r.seed,agent:r.agent,repetition:r.repetition,operational_status:a.operational.operational_status,metric:measure(a.data.result)};});
assert.equal(canonical(rows),canonical(archived.rows));fs.writeFileSync(path.join(process.env.P01_E4,'controller-recount.json'),JSON.stringify({status:'PASS',rows,comparison:'EXACT_MATCH_ARCHIVED_ROWS; EXISTING_CONTROLLER_MEASURE; SEPARATE_FROM_INDEPENDENT_CALCULATION'},null,2)+'\n',{flag:'wx'});console.log('PASS: 256 controller metric rows recalculated and identical.');
