'use strict';
const assert = require('node:assert/strict');
const { median, paired, balanced } = require('../wl-rc1-r1/estimators.cjs');
function ns(x) { assert.match(String(x), /^\d+$/); const n = BigInt(x); assert.ok(n <= BigInt(Number.MAX_SAFE_INTEGER)); return n; }
function journalEffect(off, on) {
  const a = Number(ns(off.wall_ns)), b = Number(ns(on.wall_ns)); assert.ok(a > 0 && b > 0);
  const warm = paired(off.warm_wrapper_ns, on.warm_wrapper_ns);
  return { wall_percent: 100 * (b / a - 1), warm_wrapper_percent: warm.ratio_of_process_medians_percent,
    diagnostic_exceeds_10_percent: Math.abs(100 * (b / a - 1)) > 10 || warm.diagnostic_exceeds_10_percent,
    isolated_fsync_causal_effect: false };
}
function timeBalance(samples, done, wall_ns) {
  assert.ok(done && samples.length === done.ipc_work_ns.length, 'partial worker: no complete time balance');
  const totals = { preparation: 0n, api: 0n, execution_envelope: 0n, witnesses: 0n, ipc: 0n, process: 0n, journal_io: ns(done.journal.io_ns) };
  for (const s of samples) {
    const t = s.stage_work_ns, api = ns(s.api_ns), execution = ns(t.EXECUTE); assert.ok(execution >= api);
    totals.preparation += ns(t.PREPARE); totals.api += api; totals.execution_envelope += execution - api;
    for (const k of ['INPUT_WITNESS', 'OUTPUT_WITNESS', 'ENCODE', 'SERIALIZE', 'HASH', 'COMPRESS']) totals.witnesses += ns(t[k]);
  }
  for (const r of done.ipc_work_ns) totals.ipc += ns(r.ipc_work_ns);
  for (const x of Object.values(done.process_work_ns)) totals.process += ns(x);
  const wall = ns(wall_ns); assert.ok(wall > 0n);
  totals.residual_unattributed = wall - Object.values(totals).reduce((a, b) => a + b, 0n);
  return { ns: Object.fromEntries(Object.entries(totals).map(([k, x]) => [k, String(x)])),
    proportions: Object.fromEntries(Object.entries(totals).map(([k, x]) => [k, Number(x) / Number(wall)])),
    inconsistent_negative_residual: totals.residual_unattributed < 0n, causal_decomposition: false };
}
module.exports = { median, paired, balanced, journalEffect, timeBalance };
