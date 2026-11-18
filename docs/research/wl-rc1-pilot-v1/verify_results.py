"""Independent read-only recount of existing pilot JSON/wire outputs; no engine/replay."""
from pathlib import Path
import json,sys,gzip,hashlib,statistics,math
source=Path(sys.argv[1]);derived=Path(sys.argv[2])
load=lambda p:json.loads(p.read_text());lines=lambda p:[json.loads(x) for x in p.read_text().splitlines()]
m=load(source/'manifest.json');s=load(derived/'analysis-summary.json');candidate=load(source/'candidate.json');plan=candidate['body']['conditions']
assert len(plan)==48 and m['requests_expected']==48 and m['status']=='PARTIAL'
expected={r['file']:r for r in m['files']};assert set(expected)|{'manifest.json'}=={p.name for p in source.iterdir()}
for name,row in expected.items():
 b=(source/name).read_bytes();assert len(b)==row['bytes'] and hashlib.sha256(b).hexdigest()==row['sha256']
attempts=lines(source/'attempts.jsonl');start=[x for x in attempts if x['type']=='START'];end=[x for x in attempts if x['type']=='FINISH']
assert [x['index'] for x in start]==[0,1,2] and [x['index'] for x in end]==[0,1,2]
assert [x['status'] for x in end]==['COMPLETE','COMPLETE','CHILD_TIMEOUT']
records=[]
for r in start:
 assert r['request']['condition']==plan[r['index']]
 raw=lines(source/f"{r['index']:02}.jsonl");header=next(x for x in raw if x['type']=='header');assert header['condition']==plan[r['index']]
 data=[x for x in raw if x['type']=='sample'];assert len(data)==(144 if r['index']<2 else 97)
 assert not any(x['type'] in ['operation_error','fatal'] for x in raw)
 if r['index']==2:assert not any(x['type']=='done' for x in raw)
 records.append(data)
assert sum(map(len,records))==385 and not any(x['resolution_insufficient'] for data in records for x in data)
wire=lambda h:json.loads(gzip.decompress((source/(h+'.json.gz')).read_bytes()))
for a,b in zip(records[0],records[1]):
 assert (a['operation'],a['phase'],a['sample'])==(b['operation'],b['phase'],b['sample'])
 assert wire(a['witness_sha256'])==wire(b['witness_sha256'])
paired=load(derived/'paired-perturbation.json');flags=[]
for row in paired:
 a=[x for x in records[0] if x['operation']==row['operation'] and x['phase']=='WARM'];b=[x for x in records[1] if x['operation']==row['operation'] and x['phase']=='WARM'];assert len(a)==len(b)==5
 delta=[int(y['wrapper_ns'])-int(x['wrapper_ns']) for x,y in zip(a,b)];base=statistics.median(int(x['wrapper_ns']) for x in a);percent=statistics.median(delta)/base*100
 assert delta==row['paired_wrapper_delta_ns'] and math.isclose(percent,row['paired_wrapper_delta_percent'],abs_tol=1e-9)
 if abs(percent)>10:flags.append(row['operation'])
assert flags==s['operations_above_10_percent_flag'] and len(flags)==11
assert len(load(derived/'condition-coverage.json'))==48 and s['full_structural_mode_pairs']==144
print(json.dumps({'method':'independent Python recount of existing raw JSON/wire; no new engine/agent/replay','manifest_sha_entries_checked':len(expected),'workers_started':3,'complete':2,'timeout_censored':1,'not_executed':45,'samples':385,'wire_structural_pairs_equal':144,'paired_metrics_recounted':16,'diagnostic_flags':11,'result':'PASS'}))
