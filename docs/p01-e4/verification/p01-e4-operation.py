from pathlib import Path
import os,subprocess,json,hashlib,datetime,shutil,tarfile
repo=Path('/workspace/yellow');os.chdir(repo);root=Path('/workspace/shared/world-lab');source=root/'p01-final-20261113-01';copy=Path(str(source)+'-evidence');restored=Path(str(source)+'-restored');out=Path(str(source)+'-e4')
assert not out.exists() and not restored.exists(),'HOLD: E4 destinations already exist'
assert not os.environ.get('NODE_OPTIONS'),'HOLD: NODE_OPTIONS'
assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()=='6fcc698681514a90e1dcd28a0f926967b2304884'
assert not subprocess.check_output(['git','status','--porcelain']).strip()
out.mkdir(mode=0o700);os.environ['P01_E4']=str(out);os.environ['P01_RESTORED']=str(restored)
def save(name,obj):
 with (out/name).open('x') as f:json.dump(obj,f,indent=2);f.write('\n')
for name in ['p01-e4-approved-plan.md','p01-e4-independent-descriptors.cjs','p01-e4-controller-recount.cjs','p01-e4-restored-replay.cjs','p01-e4-operation.py']:
 shutil.copyfile(Path('/tmp')/name,out/name)
(a:=out/'integrity-before').mkdir()
check=Path('/tmp/p01-audit-close.cjs').read_text().replace("out=source+'-audit-close'","out="+json.dumps(str(a)))
(out/'p01-e4-integrity-check.cjs').write_text(check)
roots=[source,copy,Path(str(source)+'-ops'),Path(str(source)+'-audit-close'),Path(str(source)+'-exports')]
def inventory():
 result={}
 for d in roots:
  result[str(d)]=[{'file':str(p.relative_to(d)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(d.rglob('*')) if p.is_file()]
 return result
baseline=inventory();save('historical-inputs-before.json',baseline)
archive=roots[-1]/'P01-E3-audited-evidence.tar.gz';assert hashlib.sha256(archive.read_bytes()).hexdigest()=='8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7'
with tarfile.open(archive,'r:gz') as t:
 manifest=json.loads(t.extractfile('CONTENTS-SHA256.json').read())
 for e in manifest:
  b=t.extractfile(e['file']).read();assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256']
save('execution-context.json',{'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'checkout':'6fcc698681514a90e1dcd28a0f926967b2304884','C2':'HOLD_EXTERNAL_BACKUP_PENDING','E4':'OWNER_AUTHORIZED','E5':'NOT_PERFORMED','new_E3_episodes_authorized':False,'export_sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'plan_sha256':hashlib.sha256((out/'p01-e4-approved-plan.md').read_bytes()).hexdigest()})
commands=[]
def stage(name,cmd,stdinfile=None):
 print('START '+name,flush=True);start=datetime.datetime.now(datetime.timezone.utc).isoformat()
 with (out/(name+'.stdout')).open('xb') as stdout,(out/(name+'.stderr')).open('xb') as stderr:
  if stdinfile:
   with stdinfile.open('rb') as inp:r=subprocess.run(cmd,stdin=inp,stdout=stdout,stderr=stderr)
  else:r=subprocess.run(cmd,stdout=stdout,stderr=stderr)
 commands.append({'stage':name,'command':cmd,'stdin_script':str(stdinfile) if stdinfile else None,'started_at':start,'finished_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exit_code':r.returncode})
 with (out/'commands.jsonl').open('a') as log:log.write(json.dumps(commands[-1])+'\n')
 print('END '+name+' exit='+str(r.returncode),flush=True)
 assert r.returncode==0,'HOLD: '+name
 return out/(name+'.stdout')
stage('gate-before',['node','tools/p01/evaluation/cli.cjs','check','docs/f6-e/P01-evaluation-freeze.json'])
stage('integrity-check',['node',str(out/'p01-e4-integrity-check.cjs')])
verify=stage('copy-before',['node','tools/evidence/verify.cjs',str(copy)]);v=json.loads(verify.read_text());assert v['state']=='COPY_VERIFIED' and v['source_complete'] and not v['errors'] and not v['preservation_errors']
print('LOCAL_INTEGRITY_PASS; proceeding to authorized restoration and E4.',flush=True)
r=stage('restore',['node','tools/evidence/verify.cjs',str(copy),'--restore',str(restored)]);rj=json.loads(r.read_text());assert rj['restoration']=='VERIFIED_COMPLETE_EVIDENCE' and rj['restored_files']==519
stage('restored-verify',['node','tools/evidence/verify.cjs',str(restored)])
entries=json.loads((roots[2]/'source-sha256-manifest.json').read_text());assert len(list((restored/'files').iterdir()))==519
for e in entries:
 b=(restored/'files'/e['file']).read_bytes();assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'] and b==(source/e['file']).read_bytes()
save('restoration-byte-comparison.json',{'status':'PASS','files':519,'source_vs_restored':'BYTE_IDENTICAL','hash_manifest':'ALL_MATCH','original_copy':'UNCHANGED','external_backup':'PENDING'})
# These three operations are separate, preserving independent and existing calculations.
oracle=stage('independent-metrics',['node','tools/evidence/p01-independent-metrics.cjs',str(restored)]);(out/'independent-metrics.json').write_bytes(oracle.read_bytes());assert json.loads(oracle.read_text())['status']=='EVALUABLE'
stage('independent-descriptors',['node',str(out/'p01-e4-independent-descriptors.cjs')])
stage('controller-recount',['node',str(out/'p01-e4-controller-recount.cjs')])
# The approved stdin script is used without changing its require resolution.
stage('restored-replay',['node'],out/'p01-e4-restored-replay.cjs')
stage('gate-after',['node','tools/p01/evaluation/cli.cjs','check','docs/f6-e/P01-evaluation-freeze.json'])
stage('copy-after',['node','tools/evidence/verify.cjs',str(copy)])
stage('restored-after',['node','tools/evidence/verify.cjs',str(restored)])
after=inventory();assert after==baseline,'HOLD: historical inputs changed';save('historical-inputs-after.json',after)
assert not subprocess.check_output(['git','status','--porcelain']).strip()
rows=[json.loads(l) for l in (out/'restored-replay.stdout').read_text().splitlines()];assert rows[-1]=={'total':256,'failed':0} and len(rows)==257 and all(x['status']=='MATCH' for x in rows[:-1])
metrics=json.loads((out/'independent-metrics.json').read_text());descriptors=json.loads((out/'independent-descriptors.json').read_text())
save('E4-operational-result.json',{'E4':'PASS','C2':'HOLD_EXTERNAL_BACKUP_PENDING','external_backup':'EXTERNAL_BACKUP_PENDING','E5':'NOT_PERFORMED','replayed':256,'replay_failed':0,'restored_files':519,'repetition_pairs':len(descriptors['repetitions']),'eligible_seed_pairs':metrics['eligible_pairs'],'excluded_scenarios':metrics['excluded_scenarios'],'distribution':metrics['distribution'],'scientific_result':metrics['final_hypothesis'],'independent_descriptor_rows':len(descriptors['rows']),'original_inputs_unchanged':True,'new_E3_episodes':0,'finished_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
print('E4 operations PASS. Original evidence unchanged. E5 not performed.',flush=True)
