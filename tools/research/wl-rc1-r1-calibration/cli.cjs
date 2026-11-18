#!/usr/bin/env node
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const id = require('./identity.cjs'), p = require('./plan.cjs'), { verify } = require('./verify.cjs');
const { treeRss } = require('../wl-rc1/guardian.cjs'), { destination } = require('../wl-rc1/runner.cjs');
async function main(args) {
  const [cmd, ...a] = args;
  if (cmd === 'plan' && !a.length) return { conditions: p.plan(), limits: p.LIMITS, calibration_started: false };
  if (cmd === 'freeze' && a.length === 1) {
    const x = id.build(); fs.writeFileSync(a[0], JSON.stringify(x, null, 2) + '\n', { flag: 'wx' });
    return { freeze_id: x.freeze_id, calibration_started: false };
  }
  if (cmd === 'check' && a.length === 1) return { freeze_id: id.check(a[0]).freeze_id,
    status: 'READY_FOR_R1_CALIBRATION_APPROVAL', calibration_started: false };
  if (cmd === 'verify' && a.length === 1) return verify(a[0]);
  if (['preflight', 'run-calibration'].includes(cmd) && a.length === 6) {
    assert.deepEqual(process.execArgv, ['--max-old-space-size=512']);
    const [candidate, receipt, signature, public_key, freeze_pin, key_pin] = a;
    const options = { candidate: path.resolve(candidate), receipt: path.resolve(receipt),
      signature: path.resolve(signature), public_key: path.resolve(public_key), freeze_pin, key_pin };
    const approved = id.authorize(options), directory = approved.receipt.output_directory;
    destination(directory); assert.ok(!fs.existsSync(directory), 'destination must be new; no resume/retry');
    const disk = fs.statfsSync(path.dirname(directory));
    assert.ok(treeRss(process.pid).rss_bytes < p.LIMITS.rss_bytes && disk.bavail * disk.bsize >= p.LIMITS.artifact_bytes, 'resource HOLD');
    if (cmd === 'preflight') return { signature: 'VALID', freeze_id: approved.candidate.freeze_id,
      output_directory: directory, workers_started: 0, calibration_started: false };
    const result = await require('./session.cjs').run({ directory, limits: p.LIMITS,
      freeze_id: approved.candidate.freeze_id, candidate: options.candidate, worker: path.join(__dirname, 'worker.cjs'),
      attachments: { 'candidate.json': options.candidate, 'authorization.json': options.receipt,
        'authorization.sig': options.signature, 'public.pem': options.public_key },
      requests: p.plan().map(condition => ({ kind: 'R1_CALIBRATION', candidate: options.candidate,
        authorization: options, freeze_id: approved.candidate.freeze_id, condition })) });
    id.check(options.candidate);
    return { status: result.status, verification: verify(directory), recommendation_128: 'NOT_ESTABLISHED' };
  }
  throw Error('calibration: plan | freeze <new> | check <candidate> | verify <bundle> | preflight|run-calibration <candidate> <receipt> <signature> <public-key> <approved-freeze-pin> <approved-key-pin>; no pilot/RC1-E');
}
if (require.main === module) main(process.argv.slice(2)).then(x => {
  console.log(JSON.stringify(x, null, 2)); if (x.status === 'PARTIAL') process.exitCode = 2;
}).catch(e => { console.error(String(e)); process.exitCode = 1; });
module.exports = { main };
