'use strict';
const assert = require('node:assert/strict');
const { PROFILES, FIXTURE } = require('../wl-rc1-r1/plan.cjs');
const BASE = '89865a7a56ccb9d507a669ffcb900abebadf3e95';
const PARENT = 'e42a86ff8adcac7a05ccd5c41878b4775d06040aaa5056021ddd8a026efa3721';
const DESTINATION = '/workspace/shared/world-lab/wl-rc1/calibration-r1-v1';
const CAMPAIGN = 'WL-RC1-R1-CALIBRATION-1';
const LIMITS = Object.freeze({ child_ms: 30000, total_ms: 900000, heap_mib: 256,
  rss_bytes: 1073741824, artifact_bytes: 67108864, max_processes: 24,
  sample_ms: 25, reserve_bytes: 1048576 });
const CELLS = Object.freeze([
  { profile: PROFILES[0], operation: 'tick', rationale: 'low-cost reference' },
  { profile: PROFILES[2], operation: 'observation', rationale: 'spatial growth' },
  { profile: PROFILES[6], operation: 'record_append', rationale: 'long horizon and registration' }
]);
function plan() {
  const result = [];
  for (const cell of CELLS) for (let block = 1; block <= 2; block++) {
    const treatments = [ ['MINIMAL', 'OFF'], ['MINIMAL', 'SYNC'], ['DETAILED', 'OFF'], ['DETAILED', 'SYNC'] ];
    if (block === 2) treatments.reverse();
    for (const [mode, journal_policy] of treatments) result.push({ profile: cell.profile,
      operation: cell.operation, block, seed: 22000 + block, mode, journal_policy,
      warmup: 3, samples: 5 });
  }
  return result;
}
function fixture(mode = 'MINIMAL', journal_policy = 'SYNC', operation = 'tick') {
  return { profile: FIXTURE, operation, block: 0, seed: 22001, mode, journal_policy, warmup: 1, samples: 2 };
}
function validate(c, fixtureOnly = false) {
  assert.ok(['MINIMAL', 'DETAILED'].includes(c.mode));
  assert.ok(['SYNC', 'OFF'].includes(c.journal_policy));
  if (fixtureOnly) {
    assert.ok(['tick', 'observation', 'record_append', 'replay'].includes(c.operation));
    assert.deepEqual(c, fixture(c.mode, c.journal_policy, c.operation));
  } else assert.ok(plan().some(x => { try { assert.deepEqual(x, c); return true; } catch { return false; } }), 'calibration condition not approved');
  return c;
}
module.exports = { BASE, PARENT, DESTINATION, CAMPAIGN, LIMITS, CELLS, plan, fixture, validate };
