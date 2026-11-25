"""Pure artifact verification: no agent, episode or replay execution."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
load = lambda name: json.loads((ROOT / name).read_text())
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
before, summary = load('pre-execution.json'), load('analysis.json')
cp, base = load('checkpoint.json'), load('continuous.json')
for name, digest in before['source_hashes'].items():
    assert sha(ROOT / 'source' / name) == digest, name
for name in ['protocol.json', 'harness.cjs']:
    assert sha(ROOT / name) == before['instrument_hashes'][name], name
assert sha(ROOT / 'analyze-v1.cjs') == before.get('original_analysis_v1_sha256', before['instrument_hashes']['analyze.cjs'])
for mode in ['snapshot', 'feedback_history']:
    arm = load('resumed-' + mode + '.json')
    assert arm['result'] == base['result']
    assert arm['memory_at_cut'] == cp['agent_state']
    assert len(arm['live']) == arm['new_action_calls'] == 16
    for i, step in enumerate(arm['live']):
        reference = base['trace'][i + 8]
        assert step['source'] == 'NEW_AGENT_DECISION'
        assert step['action'] == reference['action']
        assert step['post_memory'] == reference['post_memory']
    assert arm['world_rng_draws_after_restore'] == 0
    assert arm['agent_rng_draws_after_restore'] == 16
for arm in summary['arms'][:2]:
    assert arm['full_result_equal'] and arm['global_events_equal'] and arm['termination_equal']
    assert not any(arm['dimensions_first_divergence'].values())
    assert arm['bytes'] == {'comparisons': 50, 'first_mismatch': None}
negative = summary['arms'][2]
assert negative['dimensions_first_divergence']['action']['step_tick'] == 9
assert not negative['full_result_equal']
assert summary['replay']['agent_step_calls'] == 0
assert summary['replay']['executed'] == 16
assert summary['replay']['bytes'] == {'comparisons': 32, 'first_mismatch': None}
assert summary['prefix_feedback_reconstructed'] == 8
assert load('execution-complete.json')['world_transitions'] == 96
assert len(base['result']['trajectory']['steps']) + len(cp['records']) + sum(
    len(load('resumed-' + mode + '.json')['live']) for mode in ['snapshot', 'feedback_history', 'reset_only']
) + load('replay-control.json')['result']['executed'] == 96
print(json.dumps({'status': 'VERIFIED_SAVED_ARTIFACTS_ONLY', 'source_files': len(before['source_hashes']),
    'positive_suffix_agent_calls_each': 16, 'negative_first_action_difference_tick': 9,
    'equal_wls1_comparisons': 132, 'world_transitions_executed_by_verifier': 0}))
