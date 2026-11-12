"""Lock analysis artifacts and inspected baseline evidence; never an approval."""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent
refs={}
for p in HERE.rglob('*'):
 if p.is_file() and p.name!='manifest.json' and '__pycache__' not in p.parts:refs[str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
# Source definitions plus code/test citations, not entire arbitrary workspace.
S=json.loads((HERE/'sources.json').read_text());C=json.loads((HERE/'semantic-requirements.json').read_text())['requirements']
paths={x['path'] for x in S}|{'docs/IMPLEMENTATION_STATUS.md','conformance/profile/clause-inventory.json'}
for c in C:paths.update(c['implementation_paths']);paths.update(c['test_files'])
for p in paths:refs[p]=hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
result={'format':'WORLD-LAB-F5D-INTEGRITY-1','base':'a3fb5b823bfdf74a981e9acf9e10bb30cc18b478','approved':False,'gate':'HOLD_INSUFFICIENT_AUTHORITY','references':[{'path':p,'sha256':h} for p,h in sorted(refs.items())],'note':'Captured integrity, not authentication of absent historical originals or normative approval.'}
(HERE/'manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Locked',len(refs),'artifacts/evidence files')
