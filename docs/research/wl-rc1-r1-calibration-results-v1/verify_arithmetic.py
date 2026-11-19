"""Read-only, independent arithmetic check; no WORLD/replay imports or invocations."""
from pathlib import Path
import json, statistics, math, sys
source, results = map(Path, sys.argv[1:3])
load = lambda name: json.loads((results/name).read_text())
processes, modes, journals = load('processes.json'), load('modality.json'), load('journal-perturbation.json')
independent, count = [], 0
for i, expected in enumerate(processes):
    records = [json.loads(x) for x in (source/'data'/f'{i:02}.jsonl').read_text().splitlines()]
    samples = [x for x in records if x['type']=='sample']; count += len(samples)
    done = next(x for x in records if x['type']=='done')
    warm = [x for x in samples if x['phase']=='WARM']; assert len(warm)==5
    medians = {k:statistics.median(int(s[k]) for s in warm) for k in ['api_ns','wrapper_ns']}
    for k, value in medians.items(): assert value==expected['latency']['WARM'][k]['median']
    totals = {k:0 for k in expected['time_balance']['ns']}
    for s in samples:
        t=s['stage_work_ns']; totals['preparation']+=int(t['PREPARE']); totals['api']+=int(s['api_ns'])
        totals['execution_envelope']+=int(t['EXECUTE'])-int(s['api_ns'])
        totals['witnesses']+=sum(int(t[k]) for k in ['INPUT_WITNESS','OUTPUT_WITNESS','ENCODE','SERIALIZE','HASH','COMPRESS'])
    totals['ipc']=sum(int(x['ipc_work_ns']) for x in done['ipc_work_ns'])
    totals['process']=sum(int(x) for x in done['process_work_ns'].values())
    totals['journal_io']=int(done['journal']['io_ns'])
    totals['residual_unattributed']=int(expected['wall_ns'])-sum(totals.values())
    assert {k:str(v) for k,v in totals.items()}==expected['time_balance']['ns']
    c=expected['condition']; independent.append({**c,'median':medians,'wall_ns':int(expected['wall_ns'])})
def find(profile,block,mode,journal):
    return next(x for x in independent if (x['profile']['id'],x['block'],x['mode'],x['journal_policy'])==(profile,block,mode,journal))
for x in modes:
    a=find(x['profile'],x['block'],'MINIMAL',x['journal_policy']); b=find(x['profile'],x['block'],'DETAILED',x['journal_policy'])
    for name,k in [('api','api_ns'),('wrapper','wrapper_ns')]:
        assert math.isclose(100*(b['median'][k]/a['median'][k]-1),x[name]['ratio_of_process_medians_percent'],abs_tol=1e-10)
for x in journals:
    a=find(x['profile'],x['block'],x['mode'],'OFF'); b=find(x['profile'],x['block'],x['mode'],'SYNC')
    assert math.isclose(100*(b['wall_ns']/a['wall_ns']-1),x['wall_percent'],abs_tol=1e-10)
    assert math.isclose(100*(b['median']['wrapper_ns']/a['median']['wrapper_ns']-1),x['warm_wrapper_percent'],abs_tol=1e-10)
assert len(independent)==24 and count==216
print(json.dumps({'PASS':True,'workers':len(independent),'samples':count,'balances':24,'modality_pairs':len(modes),'journal_pairs':len(journals),'new_WORLD_or_replay_calls':0},indent=2))
