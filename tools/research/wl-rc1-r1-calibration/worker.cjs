'use strict';
const fs = require('node:fs'), path = require('node:path'), zlib = require('node:zlib'), assert = require('node:assert/strict');
const { validate, plan, DESTINATION } = require('./plan.cjs');
const { check, authorize, runtime, sha, ROOT } = require('./identity.cjs');
const { journal } = require('../wl-rc1-r1/journal.cjs');
const { measure, resolution } = require('../wl-rc1/worker.cjs');
const send = row => new Promise((resolve, reject) => process.send(row, e => e ? reject(e) : resolve()));
function recording(file, policy) {
  if (policy === 'SYNC') return journal(file);
  assert.equal(policy, 'OFF'); // Timing wrappers remain; only checkpoint persistence is removed.
  return { sync(stage, call, fn) { const t = process.hrtime.bigint(), value = fn(); return { value, ns: String(process.hrtime.bigint() - t) }; },
    async asyncStage(stage, call, fn) { const t = process.hrtime.bigint(), value = await fn(); return { value, ns: String(process.hrtime.bigint() - t) }; },
    stats: () => ({ bytes: 0, events: 0, io_ns: '0', checkpoint_persistence: 'OFF' }), close() {} };
}
// Same subject/measure/codec as R1. No production methods are replaced.
async function sample(api, c, j, emit, phase, index, seen = new Set()) {
  const call = `${phase}:${index}`, timing = {};
  const stage = (name, fn) => { const x = j.sync(name, call, fn); timing[name] = x.ns; return x.value; };
  const { prepare, codec } = require('../wl-rc1/operations.cjs');
  const f = stage('PREPARE', () => prepare(api, c, c.operation));
  const before = stage('INPUT_WITNESS', f.before);
  const measured = stage('EXECUTE', () => measure(c.mode, f.invoke));
  const after = stage('OUTPUT_WITNESS', () => f.after(measured.value));
  const encoded = stage('ENCODE', () => codec.encode({ before, after }));
  const json = stage('SERIALIZE', () => JSON.stringify(encoded));
  const hash = stage('HASH', () => sha(json)), fresh = !seen.has(hash);
  const gz = stage('COMPRESS', () => fresh ? zlib.gzipSync(json) : null);
  if (gz && gz.length > 16 * 1024 * 1024) throw Error('witness size limit');
  seen.add(hash);
  const row = { type: 'sample', operation: c.operation, phase, sample: index,
    prep_ns: timing.PREPARE, api_ns: measured.api_ns, wrapper_ns: measured.wrapper_ns,
    cpu_us: measured.cpu_us, memory_before: measured.memory_before, memory_after: measured.memory_after,
    stage_work_ns: timing, witness_sha256: hash, witness_json_bytes: Buffer.byteLength(json), witness_gzip: gz,
    preparation_exposure: f.exposure, compressed_new_witness: fresh };
  const ipc = await j.asyncStage('IPC_SEND_CALLBACK', call, () => emit(row));
  return { call, ipc_work_ns: ipc.ns };
}
async function execute(r) {
  assert.deepEqual(process.execArgv, ['--max-old-space-size=256']);
  const fixtureOnly = r.kind === 'R1_CALIBRATION_FIXTURE';
  assert.ok(fixtureOnly || r.kind === 'R1_CALIBRATION'); const c = validate(r.condition, fixtureOnly);
  assert.ok(Number.isInteger(r.index) && r.index >= 0);
  if (!fixtureOnly) assert.deepEqual(c, plan()[r.index]);
  const data = fs.realpathSync(r.data_directory), rel = path.relative(ROOT, data);
  assert.ok(rel.startsWith('..' + path.sep) || rel === '..'); assert.ok(!data.toLowerCase().includes('p01-'));
  if (!fixtureOnly) assert.equal(data, path.join(DESTINATION, 'data'));
  const j = recording(path.join(data, `${String(r.index).padStart(3, '0')}.stage.jsonl`), c.journal_policy);
  const processWork = {}, sync = (name, fn) => { const x = j.sync(name, 'process', fn); processWork[name] = x.ns; return x.value; };
  const asyncStage = async (name, fn) => { const x = await j.asyncStage(name, 'process', fn); processWork[name] = x.ns; return x.value; };
  try {
    const x = sync('IDENTITY', () => fixtureOnly ? check(r.candidate) : authorize(r.authorization).candidate);
    assert.equal(x.freeze_id, r.freeze_id);
    const { api } = sync('LOAD', () => ({ api: require('../wl-rc1/operations.cjs').load() }));
    const calibration = sync('CALIBRATION', resolution), initialCPU = process.cpuUsage(), seen = new Set(), ipcs = [];
    await asyncStage('HEADER_SEND', () => send({ type: 'header', format: 'WL-RC1-RAW-1', revision: 'R1-CAL-1.0.0', freeze_id: x.freeze_id,
      condition: c, runtime: runtime(), units: { time: 'ns_decimal_string', cpu: 'microseconds', memory: 'bytes' },
      journal_policy: c.journal_policy, gc: 'NOT_OBSERVED; no forced GC' }));
    await asyncStage('CALIBRATION_SEND', () => send({ type: 'calibration', ...calibration }));
    for (let i = 0; i < 1 + c.warmup + c.samples; i++) {
      const phase = i === 0 ? 'FIRST_MEASURED' : i <= c.warmup ? 'WARMUP' : 'WARM';
      const index = i === 0 ? 0 : i <= c.warmup ? i : i - c.warmup;
      ipcs.push(await sample(api, c, j, row => send({ ...row,
        resolution_insufficient: BigInt(row.api_ns) < 10n * BigInt(calibration.clock_median_ns) }), phase, index, seen));
    }
    assert.equal(ipcs.length, 1 + c.warmup + c.samples);
    sync('FINAL_IDENTITY', () => check(r.candidate));
    await send({ type: 'done', cpu_us: process.cpuUsage(initialCPU), resources: process.resourceUsage(),
      journal: j.stats(), process_work_ns: processWork, ipc_work_ns: ipcs });
  } finally { j.close(); }
}
if (require.main === module) process.once('message', r => execute(r).then(() => process.disconnect()).catch(async e => {
  await send({ type: 'fatal', error: String(e), censored: true }).catch(() => {});
  process.exitCode = 1; process.disconnect();
}));
module.exports = { recording, sample, execute };
