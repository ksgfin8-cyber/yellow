"""Bounded integrity checks for F5-D analysis. No product tests or semantic oracle."""
from pathlib import Path
import json,hashlib,re,subprocess,base64,collections,urllib.parse
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent
BASE='a3fb5b823bfdf74a981e9acf9e10bb30cc18b478'
def j(p):return json.loads((ROOT/p).read_text())
def check(v,msg):
 if not v:raise ValueError(msg)
def sha(b):return hashlib.sha256(b).hexdigest()
M=j('docs/f5-d/manifest.json');check(M['approved'] is False and M['gate']=='HOLD_INSUFFICIENT_AUTHORITY','No approval/GO inferred')
for x in M['references']:check((ROOT/x['path']).is_file() and sha((ROOT/x['path']).read_bytes())==x['sha256'],'Changed/missing evidence '+x['path'])
sources=j('docs/f5-d/sources.json');sid={s['id']:s for s in sources}
for s in sources:
 b=(ROOT/s['path']).read_bytes();check(sha(b)==s['sha256'],'Source hash mismatch')
 if s.get('encoding')=='base64':check(sha(base64.b64decode(b))==s['original_sha256'],'Decoded source mismatch')
S=j('docs/f5-d/semantic-requirements.json');C=S['requirements'];ids=[r['requirement_id'] for r in C]
check(len(set(ids))==len(ids)==65,'Duplicate/missing reviewed semantic IDs')
check(collections.Counter(r['status'] for r in C)==S['direct_definition_counts'],'Status counts changed')
check(not S['complete_historical_universe_identified'],'Absent universe silently completed')
fields='requirement_id source authority_class subject preconditions domain required_behavior ordering postconditions invariants failure_behavior verification_method status dependencies'.split()
for c in C:
 check(all(k in c for k in fields),'Missing required semantic field '+c['requirement_id'])
 check(c['status'] in ['DETERMINED','PARTIALLY_DETERMINED','INDETERMINATE'],'Unknown status')
 check(not c['unknown'] if c['status']=='DETERMINED' else bool(c['unknown']),'Hidden unknown or inappropriate determined status')
 check(set(c['dependencies'])<=set(ids),'Dangling dependency')
 check(all(s['source_id'] in sid for s in c['source']),'Missing source')
 for p in c['implementation_paths']+c['test_files']:check((ROOT/p).is_file(),'Missing code/test reference '+p)
 # Same wording cannot manufacture duplicate semantic IDs. Scoped overlaps remain editorially explicit.
check(len({(c['subject'],c['preconditions'],c['domain'],c['required_behavior']) for c in C})==len(C),'Duplicate semantic contract')
T=j('docs/f5-d/fragment-trace.json')['links'];old=j('conformance/profile/clause-inventory.json')['units'];oldmap={u['id']:u for u in old}
check(len(T)==len(old)==572 and {x['fragment_id'] for x in T}==set(oldmap),'Missing/duplicate original fragment')
for t in T:
 u=oldmap[t['fragment_id']];check(t['literal_sha256']==u['literal_sha256'] and t['source_lines']==u['source_lines'],'Lost fragment identity')
 check(set(t['requirement_ids'])<=set(ids) and t['requirement_ids'],'Dangling reverse trace')
 for rid in t['requirement_ids']:check(t['fragment_id'] in next(c for c in C if c['requirement_id']==rid)['f5c_fragment_ids'],'Missing reverse fragment link')
 # Literal source is checked directly, not merely against the old JSON label.
 src=sid[t['source_id']];b=(ROOT/src['path']).read_bytes();text=(base64.b64decode(b) if src.get('encoding')=='base64' else b).decode();a,z=u['source_lines'];literal='\n'.join(text.splitlines()[a-1:z])
 check(sha(literal.encode())==u['literal_sha256'],'Literal/locator mismatch '+u['id'])
for c in C:
 check(set(c['f5c_fragment_ids'])=={t['fragment_id'] for t in T if c['requirement_id'] in t['requirement_ids']},'Forward/backward traces differ')
R=j('docs/f5-d/contract-reconciliation.json');check({r['requirement_id'] for r in R['contract_rows']}==set(ids),'Matrix misses contract')
allowed={'PRESERVED','SUPERSEDED','EQUIVALENT_CONSOLIDATION','UNRESOLVED_REFERENCE','AMBIGUOUS_CONTRACT','IMPLEMENTATION_DIVERGENCE','ENGINEERING_POLICY','PROPOSED_CHANGE'}
for r in R['contract_rows']:check(set(r['classifications'])<=allowed,'Invalid reconciliation classification')
check(len(R.get('proposed_changes',[]))==8 and all(p['classification']=='PROPOSED_CHANGE' for p in R['proposed_changes']),'Missing/incorrect proposal classifications')
check(not R['new_irreconcilable_current_contradictions_demonstrated'] and not R['implementation_divergences_proven_against_fully_determined_contract'],'New defect claim needs explicit evidence review')
E=j('docs/f5-d/recovery.json');check(not E['search_exhausted'] and len(E['opaque_references'])==66,'Recovery prematurely closed or references dropped')
check({r['id'] for r in E['opaque_references']}=={f'I-{n:02d}' for n in range(1,67)},'Opaque IDs changed')
for e in E['external_sources']:check(e['status']=='EXTERNAL_SOURCE_REQUIRED' and e['historical_hash'] is None and not e['content_received'],'External original fabricated')
D=j('docs/f5-d/unresolved-decisions.json');check(len(D['decisions'])==10 and not D.get('approved',False),'Unexpected decision/approval')
check(next(d for d in D['decisions'] if d['id']=='DEC-G06')['status']=='RESOLVED_SCOPED_CLARIFICATION','INIT-004 reopened')
A=(HERE/'CONSOLIDATED_SPECIFICATION_CANDIDATE.md').read_text();B=(HERE/'NORMATIVE_CHANGE_PROPOSALS.md').read_text()
check('DRAFT / UNAPPROVED / NON-NORMATIVE' in A and 'DRAFT / UNAPPROVED / NON-NORMATIVE' in B,'Draft label absent')
check('Texto nuevo propuesto:' not in A and 'Texto nuevo propuesto:' in B,'Products A/B fused')
for c in C:
 check(f'id="{c["requirement_id"].lower()}"' in A,'Candidate omits contract')
 if c['unknown']:check(c['unknown'] in A,'Candidate hides unknown')
# Check local Markdown links and explicit anchors. Filenames are not normative clauses.
errors=[];link_count=0
for p in HERE.rglob('*.md'):
 for _,url in re.findall(r'(?<!!)\[([^\]]+)\]\(([^)\n]+)\)',p.read_text()):
  u=urllib.parse.urlsplit(url.strip('<>'))
  if u.scheme:continue
  q=(p.parent/urllib.parse.unquote(u.path)).resolve() if u.path else p;link_count+=1
  if not q.exists():errors.append(str(p)+':'+url);continue
  if u.fragment:
   text=q.read_text();explicit=set(re.findall(r'<a\s+id="([^"]+)"',text));slug=set(re.sub(r'[^\w -]','',h.lower()).replace(' ','-') for h in re.findall(r'^#{1,6}\s+(.+)$',text,re.M))
   if urllib.parse.unquote(u.fragment) not in explicit|slug:errors.append(str(p)+':'+url)
check(not errors,'Broken links '+repr(errors))
# Protect all old files except the permitted operational update.
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=ROOT,text=True).splitlines()
for p in paths:
 if p=='docs/IMPLEMENTATION_STATUS.md':continue
 check((ROOT/p).read_bytes()==subprocess.check_output(['git','show',BASE+':'+p],cwd=ROOT),'Protected baseline modified '+p)
changed=subprocess.check_output(['git','diff',BASE,'--name-only'],cwd=ROOT,text=True).splitlines()
check(all(p.startswith('docs/f5-d/') or p=='docs/IMPLEMENTATION_STATUS.md' for p in changed),'Foreign changed file')
check(not list(HERE.rglob('__pycache__')),'Temporary Python artifacts present')
reg=j('docs/f5-d/regression-results.json');check(reg['summary']=={'files':28,'pass':511,'fail':0},'Regressions changed')
check(all(x['byte_identical'] and x['counts']['BLOCKED']==289 for x in reg['corpora']),'Historical corpus changed')
check(subprocess.run(['git','diff','--check'],cwd=ROOT,capture_output=True).returncode==0,'Whitespace errors')
print(json.dumps({'integrity':'VALID_DOCUMENTARY_CANDIDATE','gate':'HOLD_INSUFFICIENT_AUTHORITY','semantic_families':len(C),'direct_definition_counts':S['direct_definition_counts'],'fragment_trace_links':len(T),'opaque_references_preserved':66,'local_links_checked':link_count,'protected_baseline_files':len(paths)-1,'external_sources_required':len(E['external_sources']),'normative_approval':False,'production_changes':False}))
