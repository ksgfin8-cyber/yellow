"""Read-only closeout checks. Does not execute experiments, replay or historical builders."""
from pathlib import Path
import json, hashlib, csv, itertools, subprocess, ast, sys, tarfile
root=Path(__file__).resolve().parents[2];out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
def load(p):return json.loads(Path(p).read_text())
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
report={'scope':'Read-only hashes and historical arithmetic; no new E3/E4/replay executions','publication_checks':[], 'issues':[]}
for p in sorted(root.glob('docs/**/PUBLICATION*SHA256.json')):
 v=load(p);rows=v if isinstance(v,list) else v.get('files',{})
 if isinstance(rows,dict):rows=[dict(x,file=k) for k,x in rows.items()]
 checks=[]
 for row in rows:
  if not isinstance(row,dict) or not ('file' in row and 'sha256' in row):continue
  q=(root/row['file'] if row['file'].startswith(('docs/','js/','tools/','tests/','conformance/')) else p.parent/row['file']);good=q.is_file() and digest(q)==row['sha256'] and (not 'bytes' in row or q.stat().st_size==row['bytes'])
  checks.append({'file':str(q.relative_to(root)), 'match':good})
  if not good:report['issues'].append({'publication':str(p.relative_to(root)),**checks[-1]})
 report['publication_checks'].append({'manifest':str(p.relative_to(root)),'checked':len(checks),'matches':sum(x['match'] for x in checks),'checks':checks})
packages=[('/workspace/shared/world-lab/p01-final-20261113-01-exports/P01-E3-audited-evidence.tar.gz',36085889,'8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7'),('/workspace/shared/world-lab/p01-final-20261113-01-e4-exports/P01-E4-scientific-validation.tar.gz',309971,'47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91')]
report['original_packages']=[]
for name,size,sha in packages:
 p=Path(name);actual=digest(p);assert p.stat().st_size==size and actual==sha
 with tarfile.open(p) as t:
  members=t.getmembers()
  for m in members:
   if m.isfile():t.extractfile(m).read()
 report['original_packages'].append({'path':name,'bytes':size,'sha256':actual,'match':True,'archive_members_read':len(members)})
source=Path('/workspace/shared/world-lab/p01-final-20261113-01');campaign=load(source/'campaign.json');entries=campaign['entries'];expected=list(itertools.product(range(1001,1033),['wait','random','rule','frontier_memory_v1'],[1,2]));observed=[(e['seed'],e['agent'],e['repetition']) for e in entries];assert observed==expected
for e in entries:
 for key,hash_key in [('file','sha256'),('raw_file','raw_sha256')]:assert digest(source/e[key])==e[hash_key]
assert all(e['verification']['status']=='COMPLETE_MATCH' for e in entries)
report['E3']={'combinations':len(observed),'duplicates':len(observed)-len(set(observed)), 'order_matches':True, 'archive_and_raw_hashes_checked':512,'COMPLETE_MATCH':256,'copy_verify_record':load('/workspace/shared/world-lab/p01-final-20261113-01-ops/copy-verify.json'),'note':'Replay proof statuses read from historical records; no replay invoked'}
rr=load(root/'docs/p01-e4/replay-results.json');assert [(e['seed'],e['agent'],e['repetition']) for e in rr['rows']]==expected;assert all(e['status']=='MATCH' and e['proof_status']=='COMPLETE_MATCH' for e in rr['rows'])
rows=list(csv.DictReader((root/'docs/p01-e4/paired-results.csv').open()));assert [int(r['seed']) for r in rows]==list(range(1001,1033));D=[int(r['difference']) for r in rows];assert all(int(r['frontier_memory_v1'])-int(r['random'])==int(r['difference']) for r in rows)
metrics=load(root/'docs/p01-e4/independent-metrics.json');by={(e['seed'],e['agent'],e['repetition']):e['count'] for e in metrics['episodes']};assert len(by)==256
for s,a,_ in expected:assert by[s,a,1]==by[s,a,2]
for r in rows:
 for a in ['frontier_memory_v1','random','rule','wait']:assert int(r[a])==by[int(r['seed']),a,1]
report['E4']={'archived_restored_replays':len(rr['rows']),'MATCH':256,'states_verified':sum(e['states_verified'] for e in rr['rows']), 'seed_pairs':len(D),'sum_D':sum(D),'mean_D':sum(D)/len(D),'wins':sum(d>0 for d in D),'ties':D.count(0),'losses':sum(d<0 for d in D),'metric_episode_counts_reconciled':256,'repetition_pairs_equal':128, 'current_replay_executions':0}
report['syntax']={'javascript':[], 'python':[],'errors':[]}
for name in subprocess.check_output(['git','ls-files'],cwd=root,text=True).splitlines():
 p=root/name
 if p.suffix in ['.js','.cjs']:
  r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True);report['syntax']['javascript'].append(name)
  if r.returncode:report['syntax']['errors'].append({'path':name,'error':r.stderr})
 elif p.suffix=='.py':
  try:ast.parse(p.read_text(),filename=name);report['syntax']['python'].append(name)
  except SyntaxError as e:report['syntax']['errors'].append({'path':name,'error':str(e)})
report['syntax']['status']='PASS' if not report['syntax']['errors'] else 'FAIL'
report['transfer_branch_tip']=subprocess.check_output(['git','rev-parse','origin/transfer/p01-c2-evidence-20261117'],cwd=root,text=True).strip()
report['status']='PASS' if not report['issues'] and report['syntax']['status']=='PASS' else 'REVIEW_REQUIRED'
(out/'evidence-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['publication_checks','syntax']},indent=2));print('publication_files='+str(sum(x['checked'] for x in report['publication_checks'])));print('syntax_js='+str(len(report['syntax']['javascript']))+' python='+str(len(report['syntax']['python'])))
