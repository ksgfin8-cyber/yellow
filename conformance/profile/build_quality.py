from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[2];HERE=ROOT/'conformance/profile'
def load(p):return json.loads((ROOT/p).read_text())
cases=load('conformance/cases-f5-b.json');report=load('conformance/results/f5-b.json');inventory=load('conformance/profile/clause-inventory.json');mutants=load('conformance/results/f5-b-mutants.json')
rows=[]
for c in cases:
 expected=c['expected'];op=c['operation'];category=c['category'];method=c['oracle']['method'];deps=[];limits=[]
 if category=='ENGINEERING-REGRESSION':use='COMPLEMENTARY_ENGINEERING';independence='MANUAL OR METAMORPHIC EXPECTATION UNDER ENGINEERING POLICY';deps=['Applicable ACT/FB/OBS/F3A/F4C policy; not historical authority']
 else:
  independence='LITERAL_RECOVERED_VECTOR' if category=='CANONICAL-RECOVERED' else 'INDEPENDENT_MATHEMATICAL_OR_ENCODING_ORACLE'
  if 'METAMORPHIC' in c['oracle'].get('independence','') or op=='f5b:agent_isolation':independence='METAMORPHIC_WITHIN_ONE_IMPLEMENTATION'
  use='MANDATORY_DEFINED_EXAMPLE'
  if op in ['validate','replay','initial_events','tick_order','f5b:world_action','f5b:snapshot','f5b:experiment','f5b:agent_isolation']:
   zero_or_invalid=op=='replay' and isinstance(expected,dict) and (expected.get('status')=='INVALID_REPLAY_INPUT' or expected.get('executed')==0)
   if not zero_or_invalid:
    use='CONDITIONALLY_REQUIRED_AFTER_PRECISION';deps=['G01-ACTION-RESULT','G03-OBSERVATION-FEEDBACK','G05-INTERFACE-SCHEMAS'];independence='CONDITIONAL_SCHEMA_FIXTURE + '+independence
  if op=='dynamics':use='COMPLEMENTARY_PENDING_CALL_COUNT_PRECISION';deps=['G02-DYNAMICS'];limits+=['Expected regeneration_calls=1 is more specific than semantic delegation alone; do not impose as universal architecture criterion']
  if op=='f5b:energy_round':limits+=['Tests current calculation helper, not every energy operation or missing action-cost semantics']
  if op in ['f5b:rng_rejection','f5b:rng_float']:limits+=['Prescribed abstract draw stream requires an adapter binding to the real sampler; not a new product API or proof of complete stream distribution']
 negative=c['oracle']['kind']=='throws' or (isinstance(expected,dict) and (expected.get('continuity') is False or expected.get('status') in ['INVALID_REPLAY_INPUT','FAILED']))
 clauses=c['clauses'];related=[u['id'] for u in inventory['units'] if any(u['clause']==x or (u['clause'].startswith('§') and re.match(r'^§\d+',u['clause']) and re.match(r'^§\d+',x) and re.match(r'^§\d+',u['clause'])[0]==re.match(r'^§\d+',x)[0]) for x in clauses)]
 witness=next((m for m in mutants['results'] if m['id']==c['id']),None)
 limits+=['Finite explicit input/expected only; no full-domain or historical-test identity claim','Same-language reference/fixture is not independent WORLD interoperability']
 rows.append({'id':c['id'],'original_category':category,'category_unchanged':True,'profile_use':use,'clauses':clauses,'related_inventory_units':related,'links_are_relationships_not_sufficiency':True,'oracle':c['oracle'],'oracle_independence_assessment':independence,'engineering_dependencies':deps,'domain_equivalence_class_evidence':{'input_ref':'conformance/cases-f5-b.json / '+c['id']+' / input','expected_ref':'conformance/cases-f5-b.json / '+c['id']+' / expected','class':'NEGATIVE_OR_FAILURE_BOUNDARY' if negative else 'POSITIVE_OR_METAMORPHIC_EXAMPLE','complete_partition_coverage_proven':False},'adversarial_contrast':c.get('contrast'),'response_corruption_witness':witness or {'status':'NO_CASE_SPECIFIC_F5B_WITNESS','alternative':'F5A infrastructure comparator fault tests; finite literal-vector checks in F5-C profile tests'},'limitations':limits,'executed_evidence':next(r for r in report['results'] if r['id']==c['id'])['status']})
(HERE/'corpus-quality-review.json').write_text(json.dumps({'case_count':len(rows),'expectations_modified':False,'cases':rows,'profile_use_counts':{k:sum(r['profile_use']==k for r in rows) for k in sorted(set(r['profile_use'] for r in rows))}},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'reviewed':len(rows),'uses':{k:sum(r['profile_use']==k for r in rows) for k in sorted(set(r['profile_use'] for r in rows))}}))
