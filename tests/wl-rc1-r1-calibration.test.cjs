'use strict';
const { test } = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process'), crypto = require('node:crypto'), zlib = require('node:zlib');
const p = require('../tools/research/wl-rc1-r1-calibration/plan.cjs');
const id = require('../tools/research/wl-rc1-r1-calibration/identity.cjs');
const { recording, sample } = require('../tools/research/wl-rc1-r1-calibration/worker.cjs');
const { run } = require('../tools/research/wl-rc1-r1-calibration/session.cjs');
const { verify, unit } = require('../tools/research/wl-rc1-r1-calibration/verify.cjs');
const est = require('../tools/research/wl-rc1-r1-calibration/estimators.cjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'r1-cal-preparation-')), candidate = path.join(temp, 'candidate.json');
const rows = file => fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
let pinned; function identity() { if (!pinned) { pinned = id.build(); fs.writeFileSync(candidate, JSON.stringify(pinned)); } return pinned; }
test('CAL-01 plan only: 24 unique ordered cells, modes and checkpoints balanced; unchanged physical profiles', () => {
  const plan = p.plan(); assert.equal(plan.length, 24); assert.equal(new Set(plan.map(x => JSON.stringify(x))).size, 24);
  assert.deepEqual(plan.map(x => x.profile.id).filter((x, i, a) => !i || a[i - 1] !== x), ['P1', 'P3', 'P7']);
  for (const start of [0, 8, 16]) { assert.deepEqual(plan.slice(start, start + 4).map(x => [x.mode, x.journal_policy]), plan.slice(start + 4, start + 8).reverse().map(x => [x.mode, x.journal_policy])); }
  plan.forEach(x => p.validate(x)); assert.throws(() => p.validate({ ...plan[0], samples: 6 }));
  assert.throws(() => p.validate(plan[0], true)); assert.throws(() => p.validate({ ...p.fixture(), journal_policy: true }, true));
  assert.deepEqual(JSON.parse(fs.readFileSync('docs/research/wl-rc1-r1-calibration/conditions.json')).conditions, plan);
  assert.equal(24 * 262144 + 1048576 + 57 * 1048576, p.LIMITS.artifact_bytes);
});
test('CAL-02 new identity checks every baseline file, binds own protocol; R1 candidate remains valid', () => {
  const x = identity(); assert.deepEqual(id.check(candidate), x); assert.notEqual(x.freeze_id, p.PARENT);
  assert.equal(require('../tools/research/wl-rc1-r1/identity.cjs').check('docs/research/wl-rc1-r1/R1-CANDIDATE.json').freeze_id, p.PARENT);
  assert.throws(() => id.check('docs/research/wl-rc1-r1/R1-CANDIDATE.json'));
});
test('CAL-03 ephemeral calibration receipt verifies/preflights without workers; old domains, altered scope/destination and key rejected', () => {
  const x = identity(), keys = crypto.generateKeyPairSync('ed25519'), pub = path.join(temp, 'public.pem'), receipt = path.join(temp, 'receipt.json'), signature = path.join(temp, 'sig');
  fs.writeFileSync(pub, keys.publicKey.export({ type: 'spki', format: 'pem' }));
  const r = { format: 'WL-RC1-R1-CALIBRATION-AUTHORIZATION-1', decision: 'AUTHORIZE_CALIBRATION_24_ONLY', freeze_id: x.freeze_id,
    campaign_id: p.CAMPAIGN, output_directory: p.DESTINATION, owner_reference: 'ephemeral unit test only' };
  const o = { candidate, receipt, signature, public_key: pub, freeze_pin: x.freeze_id, key_pin: id.sha(keys.publicKey.export({ type: 'spki', format: 'der' })) };
  const sign = domain => { const b = Buffer.from(JSON.stringify(r)); fs.writeFileSync(receipt, b); fs.writeFileSync(signature, crypto.sign(null, Buffer.concat([domain, b]), keys.privateKey)); };
  assert.ok(!fs.existsSync(p.DESTINATION)); sign(id.DOMAIN); assert.equal(id.authorize(o).receipt.campaign_id, p.CAMPAIGN);
  const pre = JSON.parse(cp.execFileSync(process.execPath, ['--max-old-space-size=512', 'tools/research/wl-rc1-r1-calibration/cli.cjs', 'preflight', candidate, receipt, signature, pub, o.freeze_pin, o.key_pin], { encoding: 'utf8' }));
  assert.equal(pre.workers_started, 0); assert.ok(!fs.existsSync(p.DESTINATION));
  for (const old of ['../tools/research/wl-rc1/identity.cjs', '../tools/research/wl-rc1-r1/identity.cjs']) { sign(require(old).DOMAIN); assert.throws(() => id.authorize(o)); }
  sign(id.DOMAIN); assert.throws(() => id.authorize({ ...o, key_pin: '0'.repeat(64) }));
  r.output_directory += '-other'; sign(id.DOMAIN); assert.throws(() => id.authorize(o)); r.output_directory = p.DESTINATION;
  r.decision = 'AUTHORIZE_RC1_R1_DIAGNOSTIC_ONLY'; sign(id.DOMAIN); assert.throws(() => id.authorize(o));
});
test('CAL-04 tiny direct operations: both modes/checkpoint policies preserve full R1 structures, WLS1 and RNG', async () => {
  const { load, prepare, codec } = require('../tools/research/wl-rc1/operations.cjs'), api = load();
  for (const operation of ['tick', 'observation', 'record_append', 'replay']) {
    const c = p.fixture('MINIMAL', 'SYNC', operation), f = prepare(api, c, operation);
    const before = f.before(), value = f.invoke(), expected = codec.encode({ before, after: f.after(value) });
    for (const mode of ['MINIMAL', 'DETAILED']) for (const policy of ['SYNC', 'OFF']) {
      const file = path.join(temp, `${operation}-${mode}-${policy}.journal`), j = recording(file, policy); let row;
      await sample(api, p.fixture(mode, policy, operation), j, async x => { row = x; }, 'FIRST_MEASURED', 0); j.close();
      const observed = JSON.parse(zlib.gunzipSync(row.witness_gzip)); assert.deepEqual(observed, expected);
      assert.equal(fs.existsSync(file), policy === 'SYNC');
    }
  }
});
test('CAL-05 four tiny workers, not P1-P8: full witnesses agree; IPC/time balance/recovery and corruption detected', async () => {
  const x = identity(), directory = path.join(temp, 'tiny');
  const conditions = ['MINIMAL', 'DETAILED'].flatMap(mode => ['OFF', 'SYNC'].map(j => p.fixture(mode, j)));
  const result = await run({ directory, candidate, freeze_id: x.freeze_id,
    requests: conditions.map(condition => ({ kind: 'R1_CALIBRATION_FIXTURE', candidate, freeze_id: x.freeze_id, condition })) });
  assert.equal(result.status, 'COMPLETE'); const v = verify(directory); assert.equal(v.samples, 16); assert.equal(v.P1_P8_executed, false);
  let baseline; const balances = [];
  for (let i = 0; i < 4; i++) {
    const list = rows(path.join(directory, 'data', `${String(i).padStart(2, '0')}.jsonl`)), samples = list.filter(x => x.type === 'sample');
    for (const s of samples) { const b = zlib.gunzipSync(fs.readFileSync(path.join(directory, 'data', s.witness_sha256 + '.json.gz'))); if (!baseline) baseline = b; assert.deepEqual(b, baseline); }
    balances.push(est.timeBalance(samples, list.find(x => x.type === 'done'), result.attempts[i].wall_ns));
  }
  const copy = path.join(temp, 'restored'); fs.cpSync(directory, copy, { recursive: true }); assert.deepEqual(verify(copy), v);
  fs.appendFileSync(path.join(copy, 'data', '00.jsonl'), 'corruption'); assert.throws(() => verify(copy));
  console.log(JSON.stringify({ fixture_package: directory, identity: x.freeze_id, samples: 16, kind: 'TINY_ONLY_NOT_CALIBRATION', balances }));
});
test('CAL-06 predefined estimators and no overlapping API/EXECUTE accounting, partials reject primary balance', () => {
  const a = { wall_ns: '100', warm_wrapper_ns: [10, 10, 10, 10, 10] }, b = { wall_ns: '120', warm_wrapper_ns: [12, 12, 12, 12, 12] };
  assert.ok(Math.abs(est.journalEffect(a, b).wall_percent - 20) < 1e-9); assert.equal(est.journalEffect(a, b).isolated_fsync_causal_effect, false);
  assert.throws(() => est.journalEffect({ ...a, warm_wrapper_ns: [1] }, b));
  assert.throws(() => est.timeBalance([{}], null, '100'));
  const row = { api_ns: '2', stage_work_ns: { PREPARE: '3', EXECUTE: '4', INPUT_WITNESS: '1', OUTPUT_WITNESS: '1', ENCODE: '1', SERIALIZE: '1', HASH: '1', COMPRESS: '1' } };
  const t = est.timeBalance([row], { journal: { io_ns: '5' }, process_work_ns: { LOAD: '2' }, ipc_work_ns: [{ ipc_work_ns: '1' }] }, '30');
  assert.equal(t.ns.execution_envelope, '2'); assert.equal(t.ns.residual_unattributed, '9');
  assert.equal(Object.values(t.proportions).reduce((a, b) => a + b, 0), 1);
});
test('CAL-07 historical R1 incomplete-unit validation is late; calibration stops before following unit', async () => {
  const fake = path.resolve('tests/fixtures/wl-rc1-r1/control.cjs');
  const requests = [0, 1].map(() => ({ kind: 'R1_FIXTURE', control: 'ok', freeze_id: 'control', condition: require('../tools/research/wl-rc1-r1/plan.cjs').FIXTURE }));
  // Use a fully shaped tiny condition for the frozen verifier, with a fake worker that emits no samples.
  const oldCondition = { ...p.fixture() }; delete oldCondition.journal_policy; oldCondition.seed = 21001;
  requests.forEach(r => { r.condition = oldCondition; });
  const old = await require('../tools/research/wl-rc1-r1/session.cjs').run({ directory: path.join(temp, 'late-old'), requests, freeze_id: 'control', worker: fake });
  assert.equal(old.attempts.length, 2); assert.equal(old.status, 'PARTIAL');
  const current = await run({ directory: path.join(temp, 'early-new'), freeze_id: 'control', worker: path.resolve('tests/fixtures/wl-rc1-r1-calibration/control.cjs'),
    requests: [0, 1].map(() => ({ kind: 'R1_CALIBRATION_FIXTURE', control: 'ok', freeze_id: 'control', condition: p.fixture() })) });
  assert.equal(current.attempts.length, 1); assert.equal(current.status, 'PARTIAL');
  assert.match(current.attempts[0].status, /incomplete calibration samples/);
});
test('CAL-09 calibration controller preserves timeout/checkpoint and RSS stops without starting the next unit', async () => {
  for (const reason of ['CHILD_TIMEOUT', 'RSS_LIMIT']) {
    const directory = path.join(temp, reason), requests = [0, 1].map(() => ({ kind: 'R1_CALIBRATION_FIXTURE', control: 'hang', condition: p.fixture(), freeze_id: 'control' }));
    const result = await run({ directory, requests, freeze_id: 'control', worker: path.resolve('tests/fixtures/wl-rc1-r1-calibration/control.cjs'),
      limits: { ...p.LIMITS, child_ms: 400, total_ms: 4000, ...(reason === 'RSS_LIMIT' ? { rss_bytes: 1 } : {}) } });
    assert.equal(result.stop.reason, reason); assert.equal(result.attempts.length, 1); assert.equal(result.status, 'PARTIAL');
    assert.equal(verify(directory).package_status, 'PARTIAL');
    if (reason === 'CHILD_TIMEOUT') assert.equal(verify(directory).open_stages[0].stage, 'PREPARE');
  }
});
test('CAL-10 guardian kills a blocked calibration controller during data verification; no success envelope fabricated', async () => {
  const directory = path.join(temp, 'blocked-controller');
  const source = `require('./tools/research/wl-rc1-r1-calibration/session.cjs').run({directory:process.argv[1],requests:[],freeze_id:'control',limits:{...require('./tools/research/wl-rc1-r1-calibration/plan.cjs').LIMITS,total_ms:600},beforeVerify(){while(true){}}})`;
  const child = cp.spawn(process.execPath, ['-e', source, directory], { stdio: 'ignore' });
  const status = await new Promise(resolve => child.once('close', (code, signal) => resolve({ code, signal })));
  assert.equal(status.signal, 'SIGKILL'); assert.equal(verify(directory).state, 'PARTIAL_UNSEALED');
  assert.ok(rows(path.join(directory, 'guardian.jsonl')).some(x => x.reason === 'TOTAL_WATCHDOG'));
});
test('CAL-08 no CLI pilot/final entry; future run without signature refuses before creating a destination', async () => {
  const { main } = require('../tools/research/wl-rc1-r1-calibration/cli.cjs');
  assert.equal((await main(['plan'])).calibration_started, false);
  await assert.rejects(main(['run-pilot'])); await assert.rejects(main(['run-calibration']));
  assert.throws(() => unit([{ type: 'done' }], p.fixture(), true)); assert.ok(!fs.existsSync(p.DESTINATION));
  console.log('Preparation evidence retained: ' + temp);
});
