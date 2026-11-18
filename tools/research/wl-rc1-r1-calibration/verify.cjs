'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = require('../wl-rc1-r1/session.cjs');
const { validate, plan } = require('./plan.cjs');
const rows = file => fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
function unit(records, c, complete) {
  const headers = records.filter(r => r.type === 'header'), samples = records.filter(r => r.type === 'sample');
  assert.ok(headers.length <= 1); if (headers.length) {
    assert.equal(headers[0].revision, 'R1-CAL-1.0.0'); assert.deepEqual(headers[0].condition, c);
  }
  const phases = Array.from({ length: 1 + c.warmup + c.samples }, (_, i) => ({
    phase: i === 0 ? 'FIRST_MEASURED' : i <= c.warmup ? 'WARMUP' : 'WARM',
    sample: i === 0 ? 0 : i <= c.warmup ? i : i - c.warmup }));
  samples.forEach((r, i) => {
    assert.deepEqual({ phase: r.phase, sample: r.sample }, phases[i]); assert.equal(r.operation, c.operation);
    for (const field of ['PREPARE', 'INPUT_WITNESS', 'EXECUTE', 'OUTPUT_WITNESS', 'ENCODE', 'SERIALIZE', 'HASH', 'COMPRESS'])
      assert.match(r.stage_work_ns?.[field], /^\d+$/);
    assert.ok(BigInt(r.api_ns) <= BigInt(r.wrapper_ns));
    if (c.mode === 'MINIMAL') assert.ok(r.cpu_us === null && r.memory_before === null && r.memory_after === null);
    else assert.ok(r.cpu_us && r.memory_before && r.memory_after);
  });
  if (complete) {
    assert.equal(headers.length, 1); assert.equal(samples.length, phases.length, 'incomplete calibration samples');
    const done = records.filter(r => r.type === 'done'); assert.equal(done.length, 1);
    assert.equal(done[0].ipc_work_ns.length, samples.length);
    for (const [i, ipc] of done[0].ipc_work_ns.entries()) {
      assert.equal(ipc.call, `${phases[i].phase}:${phases[i].sample}`); assert.match(ipc.ipc_work_ns, /^\d+$/);
    }
    assert.equal(records.filter(r => r.type === 'calibration').length, 1);
  }
  return samples.length;
}
function verify(directory) {
  const transport = base.verify(directory); if (transport.state === 'PARTIAL_UNSEALED') return transport;
  const data = path.join(directory, 'data'), manifest = JSON.parse(fs.readFileSync(path.join(data, 'manifest.json')));
  const fixtureOnly = manifest.kind === 'R1_CALIBRATION_FIXTURE';
  assert.ok(fixtureOnly || manifest.kind === 'R1_CALIBRATION');
  const attempts = rows(path.join(data, 'attempts.jsonl')), starts = attempts.filter(r => r.type === 'START');
  let count = 0;
  for (const [index, start] of starts.entries()) {
    assert.equal(start.index, index); const c = validate(start.request.condition, fixtureOnly);
    if (!fixtureOnly) assert.deepEqual(c, plan()[index]);
    const finish = attempts.find(r => r.type === 'FINISH' && r.index === index);
    const file = path.join(data, `${String(index).padStart(2, '0')}.jsonl`);
    const records = fs.existsSync(file) ? rows(file) : [];
    count += unit(records, c, finish?.status === 'COMPLETE');
    const stageFile = path.join(data, `${String(index).padStart(3, '0')}.stage.jsonl`);
    if (c.journal_policy === 'OFF') assert.ok(!fs.existsSync(stageFile), 'OFF must not persist checkpoints');
    else if (finish?.status === 'COMPLETE') assert.ok(fs.existsSync(stageFile));
  }
  if (transport.package_status === 'COMPLETE') {
    assert.equal(starts.length, manifest.requests_expected);
    if (!fixtureOnly) assert.equal(starts.length, 24);
  }
  return { ...transport, calibration_protocol_valid: true, measured_samples: count,
    P1_P8_executed: !fixtureOnly, recommendation_128: 'NOT_ESTABLISHED' };
}
module.exports = { unit, verify };
