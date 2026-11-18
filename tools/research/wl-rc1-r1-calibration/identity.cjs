'use strict';
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const parent = require('../wl-rc1-r1/identity.cjs');
const { BASE, PARENT, DESTINATION, CAMPAIGN, LIMITS, plan } = require('./plan.cjs');
const { ROOT, sha, stable, runtime } = parent;
const DOC = 'docs/research/wl-rc1-r1-calibration';
const DOMAIN = Buffer.from('WL-RC1-R1-CALIBRATION-AUTHORIZATION-1\n');
function build() {
  // Bind every baseline file, including both previous instruments/evidence. No frozen edits.
  const entries = cp.execFileSync('git', ['ls-tree', '-rz', BASE], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean);
  const protected_files = {};
  for (const entry of entries) {
    const match = /^\d+ blob ([0-9a-f]+)\t(.+)$/s.exec(entry); assert.ok(match, 'unsupported baseline entry');
    const [, expectedBlob, file] = match, bytes = fs.readFileSync(path.join(ROOT, file));
    // Compare Git's blob identity in one tree read; approved scientific bindings remain SHA-256.
    const blob = crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
    assert.equal(blob, expectedBlob, `baseline changed: ${file}`); protected_files[file] = sha(bytes);
  }
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.cjs')).sort().map(f => 'tools/research/wl-rc1-r1-calibration/' + f)
    .concat(['tests/wl-rc1-r1-calibration.test.cjs', 'tests/fixtures/wl-rc1-r1-calibration/control.cjs', DOC + '/PROTOCOL.md', DOC + '/conditions.json', DOC + '/authorization.template.json']);
  const instrument_files = Object.fromEntries(files.map(f => [f, sha(fs.readFileSync(path.join(ROOT, f)))]));
  const body = { format: 'WL-RC1-R1-CALIBRATION-CANDIDATE-1', base: BASE, parent_freeze_id: PARENT,
    protected_files, instrument_files, runtime: runtime(), conditions: plan(), limits: LIMITS,
    campaign_id: CAMPAIGN, output_directory: DESTINATION };
  return { freeze_id: sha(stable(body)), body };
}
function check(file) {
  const x = JSON.parse(fs.readFileSync(file));
  assert.equal(x.body?.format, 'WL-RC1-R1-CALIBRATION-CANDIDATE-1');
  assert.equal(x.freeze_id, sha(stable(x.body))); assert.deepEqual(x, build()); return x;
}
function authorize(o) {
  const candidate = check(o.candidate); assert.equal(candidate.freeze_id, o.freeze_pin);
  const key = crypto.createPublicKey(fs.readFileSync(o.public_key)); assert.equal(key.asymmetricKeyType, 'ed25519');
  assert.equal(sha(key.export({ type: 'spki', format: 'der' })), o.key_pin, 'approved calibration key pin required');
  const bytes = fs.readFileSync(o.receipt), r = JSON.parse(bytes);
  assert.deepEqual(Object.keys(r).sort(), ['format', 'decision', 'freeze_id', 'campaign_id', 'output_directory', 'owner_reference'].sort());
  assert.equal(r.format, 'WL-RC1-R1-CALIBRATION-AUTHORIZATION-1');
  assert.equal(r.decision, 'AUTHORIZE_CALIBRATION_24_ONLY'); assert.equal(r.freeze_id, o.freeze_pin);
  assert.equal(r.campaign_id, CAMPAIGN); assert.equal(r.output_directory, DESTINATION);
  assert.ok(typeof r.owner_reference === 'string' && r.owner_reference.trim());
  require('../wl-rc1/runner.cjs').destination(r.output_directory);
  assert.ok(crypto.verify(null, Buffer.concat([DOMAIN, bytes]), key, fs.readFileSync(o.signature)), 'invalid calibration signature');
  return { candidate, receipt: r };
}
module.exports = { ROOT, DOC, DOMAIN, sha, stable, runtime, build, check, authorize };
