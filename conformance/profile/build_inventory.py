"""Index all available normative text; opaque historical references stay mandatory.
No yellow code is loaded to define obligations. Lines are source locators, not new rules.
"""
from pathlib import Path
import json,re,hashlib,base64
ROOT=Path(__file__).resolve().parents[2]; HERE=ROOT/'conformance/profile'
def read(p):return (ROOT/p).read_text()
def write(name,x):(HERE/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(b):return hashlib.sha256(b).hexdigest()
SOURCES=json.loads(read('conformance/sources.json'))
SOURCES += [{'id':'HINLINE','path':'conformance/profile/owner-fragments.md','sha256':sha((HERE/'owner-fragments.md').read_bytes()),'encoding':'utf8','authority':'Owner-transmitted recovered fragments; no original-manuscript authentication or historical-test recovery'}]
write('sources-candidate.json',SOURCES)
# Context annotations specify applicability; they do not replace the literal text.
COMP={0:['AUTHORITY','ACCEPTANCE'],1:['WORLD','EXPERIMENT','AGENT'],2:['ALL'],3:['CONTRACTS'],4:['WORLD','AGENT','EXPERIMENT','RECORDER','RENDERER','METRICS'],5:['EXPERIMENT','TICK_KERNEL'],6:['WorldConfig'],7:['WorldState'],8:['Cell','WORLD'],9:['EntityState'],10:['PRNG'],11:['WORLD','INITIALIZATION'],12:['Action'],13:['WORLD.apply_action'],14:['WORLD.resolve_lifecycle'],15:['WORLD.advance_dynamics'],16:['build_observation'],17:['FeedbackConfig','build_feedback'],18:['WORLD','RECORDER'],19:['ExperimentConfig'],20:['EXPERIMENT'],21:['RECORDER'],22:['StepRecord'],23:['Trajectory'],24:['WLS1','FNV'],25:['REPLAY','VALIDATORS'],26:['CONTRACTS','TICK_KERNEL'],27:['EXPERIMENT'],28:['AGENT','EXPERIMENT'],29:['RENDERER'],30:['METRICS'],31:['ALL'],32:['EXPERIMENT','TICK_KERNEL'],33:['PSEUDOCODE ALIASES'],34:['WLS1'],35:['REPRODUCIBILITY'],36:['ACCEPTANCE CORPUS'],37:['ACCEPTANCE AUTHORITY'],38:['NORMATIVE VERSIONING'],39:['AGENT SCOPE']}
CONTEXT={6:'Supplied configuration before WORLD allocation; all stated numeric domains apply',7:'Effective WorldState, exactly one entity; admitted Number/BigInt time',8:'Rectangular validated grid with valid Cell records',9:'Entity in supplied WorldState; ACTIVE implies FREE',10:'Nonzero uint32 state; derive further preconditions from the exact algorithm/domain',11:'Validated config/seed and initialization stages in §11.1 order',13:'Structurally valid Action, current WORLD/config; explicit MOVE precedence',14:'Existing entity and explicit lifecycle',15:'Valid WORLD/config; no action or lifecycle orchestration',16:'Supplied WORLD/entity/radius; finite valid state; capacity remains a separate unresolved policy',17:'Supplied Observation/ActionResult/config with historical details only where recovered',20:'Validated ExperimentConfig and explicit with/without-agent mode',21:'Prepared input data before visible recorder commit; missing historical transaction details remain opaque',25:'Request context; D-01 validation order, mode, effective state and counters',34:'Structurally valid single-entity state; recovered layout, exact finite binary64/uint64'}
units=[];clauses=[]
def add_unit(source,cid,start,end,text,heading,authority='A',kind=None,application='CURRENT'):
 match=re.search(r'§(\d+)',cid);chapter=int(match.group(1)) if match else (25 if source=='S026' else -1)
 lines=text.splitlines(); stripped=text.strip()
 if not stripped:return
 if source=='S025' and cid=='§PREAMBLE':kind='SOURCE_METADATA'
 if kind is None:
  if stripped in ['text','javascript','```text','```','```yaml']:kind='FORMAT_MARKER'
  elif ('Idéntic' in stripped or 'de v0.2.4 más' in stripped or 'lo mismo que v0.2.4' in stripped or ('Términos de v0.2.4' in stripped)):
   kind='INCORPORATION_REFERENCE';authority='C'
  elif re.fullmatch(r'§\d+\.\d+[–-]§\d+\.\d+',stripped):kind='HISTORICAL_RANGE_REFERENCE';authority='C'
  elif stripped.startswith('**Alternativas') or stripped.startswith('**Alternativa'):kind='RATIONALE_NOT_EXECUTION_RULE'
  elif chapter in [0,36,37,38]:kind='AUTHORITY_OR_ACCEPTANCE_CONDITION'
  elif chapter==3:kind='DEFINITION'
  elif chapter==31 and re.match(r'I-\d+',stripped):kind='INVARIANT'
  elif chapter in [10,11,20,25,32] and ('\n    ' in text or 'LOOP:' in text):kind='PROCEDURE_AND_ORDER'
  elif re.search(r'no (?:conoce|importa|accede|modifica|consume|emite)|Ninguna|Nunca|Sin |solo lee',stripped,re.I):kind='PROHIBITION_OR_PURITY_CONSTRAINT'
  elif re.search(r'Precedencia|prevalece|→.*→',stripped):kind='PRECEDENCE'
  elif '\t' in stripped:kind='SCHEMA_OR_DOMAIN_ROW'
  elif chapter in [1,2,4,35,39]:kind='PRINCIPLE_SCOPE_OR_RESTRICTION'
  else:kind='OBSERVABLE_CONTRACT'
 # Known references are resolved by actual available owner fragments, not code.
 resolution=[]
 if authority=='C' and cid=='§34':authority='B';resolution=['H034: recovered §34.1–9 layout; pending reference vectors stay separate']
 if authority=='C' and cid=='§11.2':authority='B';resolution=['HINLINE:OWNER-MAP']
 # D-01 changes only the listed aspect, not the whole inherited section.
 overlays=[]
 if source=='S025':
  if cid in ['§16','§22','§26.5'] and re.search(r'tick|time|entero seguro',stripped,re.I):overlays=['S026:D-01-E temporal output representation only']
  if cid in ['§25.1','§25.3','§25.3.1','§25.3.3']:overlays=['S026:D-01-A/B/C/D/E as applicable; retain other inherited obligations']
  if cid=='§31' and stripped.startswith('I-78'):overlays=['S026:D-01-B uses replay-specific origin validator; initialize_world unchanged']
 if source=='HINLINE' and 'tick: number;' in text:overlays=['S026:D-01-E replaces the historical tick Number field by admitted uint64 representations']
 if cid=='§11.7':resolution+=['HINIT: authorized INIT-004 separates raw WORLD event checks from enriched Recorder temporal checks; do not reopen implementation decision']
 text_only=[x.strip() for x in lines if x.strip() and x.strip() not in ['text','javascript','```']]
 if cid=='§10.5' and kind=='ALIAS_OR_UNEXPANDED_PSEUDOCODE':authority='C'
 if stripped.startswith('El responsable atribuyó') or stripped.startswith('Esta condición fue respaldada'):kind='SOURCE_ATTRIBUTION_NOTE'
 if stripped.startswith('Esta es una aclaración normativa autorizada'):kind='AUTHORITY_OR_ACCEPTANCE_CONDITION'
 if stripped.startswith('Estado histórico:'):kind='PUBLICATION_EVIDENCE_DECLARATION'
 if stripped.startswith('Estado:') or stripped.startswith('Estado actual:') or re.match(r'^(Conformance|Replay|Interoperability|Todos:|T01–T280|Vectores):? .*UNTESTED',stripped):kind='PUBLICATION_EVIDENCE_DECLARATION'
 if cid=='§11.6' and stripped.startswith('Vectores:'):kind='FINITE_REFERENCE_VECTORS'
 if source=='HINLINE' and ('F3C-P02' in text or 'F3C-P01' in text):authority='D';kind='ENGINEERING_POLICY_ATTRIBUTION'
 required=kind not in ['FORMAT_MARKER','TABLE_HEADER','RATIONALE_NOT_EXECUTION_RULE','INFORMATIVE_REPEATED_SUMMARY','CONTAINER','PUBLICATION_EVIDENCE_DECLARATION','ENGINEERING_POLICY_ATTRIBUTION','SOURCE_METADATA','SOURCE_ATTRIBUTION_NOTE']
 evidence=['DYNAMIC EXAMPLES + DOMAIN/NEGATIVE COVERAGE + ADAPTER-BINDING REVIEW']
 if chapter in [0,1,2,3,4,29,30,37,38,39] or kind in ['PRINCIPLE_SCOPE_OR_RESTRICTION','PROHIBITION_OR_PURITY_CONSTRAINT','AUTHORITY_OR_ACCEPTANCE_CONDITION']:evidence+=['STATIC/DATA-FLOW OR AUTHORITY REVIEW; examples alone are insufficient']
 if chapter==35 or (chapter==0 and cid in ['§0.4','§0.5']):evidence+=['INDEPENDENT IMPLEMENTATION for any interoperability claim']
 if authority=='C':evidence=['AUTHENTIC SOURCE OR EXPRESS CONTRACTUAL RESOLUTION BEFORE ACCEPTANCE']
 status='SUFFICIENT_LITERAL_DEFINITION' if authority=='A' else 'RECOVERED_APPLICABLE_FRAGMENT' if authority=='B' else 'ENGINEERING_NOT_NORMATIVE' if authority=='D' else 'INCOMPLETE_HISTORICAL_DEFINITION'
 uid=f'{source}:{cid}:L{start:04d}'
 units.append({'id':uid,'clause':cid,'heading':heading,'source_id':source,'source_lines':[start,end],'literal_text':text,'literal_sha256':sha(text.encode()),'kind':kind,'authority_class':authority,'current_application':application,'overlays':overlays,'historical_resolution':resolution,'mandatory':required,'preconditions':{'explicit_source_lines':[x for x in text_only if re.search(r'REQUIRE|DOMINIO|PRECOND|IF |SI |Si |Para |IN ',x)],'applicability_context':CONTEXT.get(chapter,'Exact applicability in literal text; do not infer unspecified behavior')},'domain':text if kind=='SCHEMA_OR_DOMAIN_ROW' else 'Only the domain expressly fixed in this fragment and its dependencies','postconditions':text_only if required else [],'invariants':[x for x in text_only if re.match(r'I-\d+',x)],'prohibited_behaviors':[x for x in text_only if re.search(r'\bNO\b|\bno\b|Ningun|Nunca|Sin ',x)],'precedences':[x for x in text_only if re.search(r'preced|preval|antes|después|orden',x,re.I)],'responsible_components':COMP.get(chapter,['AUTHORITY/REFERENCE']), 'normative_dependencies':sorted(set(re.findall(r'§\d+(?:\.\d+)?',heading+' '+text))),'required_evidence':evidence,'definition_status':status,'interpretation_limit':'Literal-source indexing is exhaustive for available text; it does not reconstruct the contents of absent incorporated contracts.'})

def index_source(source,raw):
 lines=raw.splitlines();n=len(lines)
 # Historical author summary after §39 is retained but not made into new obligations.
 core_end=next((i for i,x in enumerate(lines) if source=='S025' and x=='Lista final de cambios v0.2.5'),n)
 heads=[]
 for i,x in enumerate(lines[:core_end]):
  m=re.match(r'^#{2,3}\s+(§\d+(?:\.\d+)?)(?=[ .—])',x)
  if source=='S026':m=None
  if m:heads.append((i,m[1],x))
 if source=='S026':
  heads=[(0,'§D01-PREAMBLE','D-01 authority and preserved boundaries')]
  for i,x in enumerate(lines):
   if x.startswith('#### '):heads.append((i,'§D01-'+('AE' if 'A/E' in x else 'B' if x.startswith('#### B ') else 'CD'),x))
   elif x.startswith('### Transversales'):heads.append((i,'§D01-TRANSVERSAL',x))
   elif x.startswith('## Precisión'):heads.append((i,'§D01-E-FINAL',x))
 else:heads=[(0,'§PREAMBLE','Source authority and publication evidence state')]+heads
 for j,(start,cid,title) in enumerate(heads):
  end=heads[j+1][0] if j+1<len(heads) else core_end
  clauses.append({'id':source+':'+cid,'source_id':source,'heading':title,'lines':[start+1,end],'classification_scope':'All body fragments below; mixed clauses retain per-fragment authority','has_body':any(lines[k].strip() for k in range(start+1,end))})
  begin=start if start==0 else start+1
  blocks=[];current=[]
  for k in range(begin,end):
   if lines[k].strip():current.append(k)
   elif current:blocks.append(current);current=[]
  if current:blocks.append(current)
  if not blocks and source=='S025':add_unit(source,cid,start+1,start+1,lines[start],title,kind='CONTAINER' if title.startswith('## ') else 'ALIAS_OR_UNEXPANDED_PSEUDOCODE')
  expanded=[]
  for block in blocks:
   if any(lines[k].startswith('Vectores:') for k in block):
    before=[]
    for k in block:
     if lines[k].startswith('Vectores:'):
      if before:expanded.append(before);before=[]
      expanded.append([k])
     else:before.append(k)
    if before:expanded.append(before)
   else:expanded.append(block)
  for block in expanded:
   # Schema rows and explicit invariants are indexed individually; procedures stay coherent.
   if any('\t' in lines[k] for k in block):
    for k in block:add_unit(source,cid,k+1,k+1,lines[k],title,kind='TABLE_HEADER' if any(lines[k].startswith(h+'\t') for h in ['Campo','Artefacto','Término','ID','It','Grupo','Elemento','Verificación']) else None)
   else:add_unit(source,cid,block[0]+1,block[-1]+1,'\n'.join(lines[k] for k in block),title)
 if core_end<n:add_unit(source,'§ANNEX',core_end+1,n,'\n'.join(lines[core_end:]),'Repeated change/audit summary, not independent requirements',kind='INFORMATIVE_REPEATED_SUMMARY')
 return {'source_id':source,'line_count':n,'core_end':core_end,'indexed_clause_count':len(heads)}
# §D identifiers do not have numeric chapters.
meta=[]
for sid in ['S025','S026']:
 src=next(s for s in SOURCES if s['id']==sid);meta.append(index_source(sid,read(src['path'])))
# Only delimited recovered source, with exact decoded line locators.
for sid in ['H034','HINIT','HINLINE']:
 src=next(s for s in SOURCES if s['id']==sid);data=(ROOT/src['path']).read_bytes();full=(base64.b64decode(data) if src['encoding']=='base64' else data).decode()
 start=full.index('#### §34 — Serialización WLS1') if sid=='H034' else full.index('### 3. Aclaración autorizada INIT-004') if sid=='HINIT' else full.index('## OWNER-MAP')
 end=full.index('### 2. Puerta de consistencia') if sid=='H034' else full.index('### 4. Implementación') if sid=='HINIT' else len(full)
 first=full[:start].count('\n')+1;lines=full[start:end].splitlines();blocks=[];current=[]
 for k,line in enumerate(lines):
  if line.strip():current.append(k)
  elif current:blocks.append(current);current=[]
 if current:blocks.append(current)
 owner='';target='§34' if sid=='H034' else '§11.7'
 for block in blocks:
  text='\n'.join(lines[k] for k in block)
  if sid=='H034' and re.match(r'^\*\*§34\.\d+',text):target=re.search(r'§34\.\d+',text).group(0)
  if text.startswith('## OWNER-'):
   owner=text.splitlines()[0];target='§11.2' if 'OWNER-MAP' in owner else '§17' if 'OWNER-FEEDBACK' in owner else '§18' if 'OWNER-RECORDED' in owner else '§14' if 'OWNER-LIFECYCLE' in owner else '§25.8'
  if sid=='HINLINE' and 'EntityStates' in text:target='§22'
  kind='CONTAINER' if text.startswith('#') or (text.startswith('**§') and len(text.splitlines())==1) else 'FORMAT_MARKER' if text.strip()=='```' else 'RECOVERED_FRAGMENT'
  add_unit(sid,target,first+block[0],first+block[-1],text,owner or 'Recovered owner fragment with attribution',authority='B',kind=kind,application='APPLICABLE ONLY TO QUOTED CONTRACT; owner attribution, no full original manuscript authentication')
# Preserve opaque inherited obligations. Knowing a range of IDs is not knowing its content.
opaque_line=read('docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md').splitlines().index('I-01 a I-66 de v0.2.4 más:')+1
for i in range(1,67):
 add_unit('S025','§31',opaque_line,opaque_line,'I-01 a I-66 de v0.2.4 más:', 'Opaque historical invariant',authority='C',kind='OPAQUE_MANDATORY_REFERENCE')
 units[-1]['id']=f'S025:§31:OPAQUE:I-{i:02d}';units[-1]['opaque_reference_id']=f'I-{i:02d}'
 units[-1]['definition_status']='SOURCE_UNAVAILABLE; range identifies this ID, not its definition'
# Clause-level decisions include source-only/opaque containers; no dynamic-only omission.
known={c['id'] for c in clauses}
for u in units:
 cid=u['source_id']+':'+u['clause']
 if cid not in known:
  clauses.append({'id':cid,'source_id':u['source_id'],'heading':u['heading'],'lines':u['source_lines'],'classification_scope':'Scoped recovered fragment; not the entire historical manuscript','has_body':True});known.add(cid)
for c in clauses:
 own=[u for u in units if u['source_id']==c['source_id'] and u['clause']==c['id'].split(':',1)[1]]
 c.update({'unit_ids':[u['id'] for u in own],'child_clause_ids':[d['id'] for d in clauses if d['source_id']==c['source_id'] and d['id'].startswith(c['id']+'.')],
  'contains_observable_obligation':any(u['kind'] in ['OBSERVABLE_CONTRACT','SCHEMA_OR_DOMAIN_ROW','PROCEDURE_AND_ORDER','INVARIANT','PROHIBITION_OR_PURITY_CONSTRAINT','PRECEDENCE','RECOVERED_FRAGMENT'] for u in own),
  'contains_unresolved_mandatory_reference':any(u['authority_class']=='C' and u['mandatory'] for u in own),
  'classifications':sorted(set(u['authority_class'] for u in own)),'kinds':sorted(set(u['kind'] for u in own)),
  'preconditions_and_domains_ref':[u['id'] for u in own if u['mandatory']],'postconditions_invariants_prohibitions_precedences_ref':[u['id'] for u in own if u['mandatory']],
  'responsible_components':sorted(set(x for u in own for x in u['responsible_components'])),
  'normative_dependencies':sorted(set(x for u in own for x in u['normative_dependencies'])),
  'required_evidence':sorted(set(x for u in own for x in u['required_evidence'])),
  'contractual_definition':'INCOMPLETE_HISTORICAL_REFERENCE' if any(u['authority_class']=='C' for u in own) else 'AVAILABLE_LITERAL_OR_SCOPED_FRAGMENT; subordinate dependencies remain explicit'})
write('clause-inventory.json',{'sources':meta,'clauses':clauses,'units':units,'scope':'Every available S025/S026 clause and literal body block indexed; opaque references retained. Not a claim that absent historical obligations have been fully identified.'})
print(json.dumps({'clauses':len(clauses),'units':len(units),'authority':{k:sum(u['authority_class']==k for u in units) for k in 'ABCDE'}}))
