"""Candidate fixtures, calculated with Python stdlib only. No yellow imports or execution."""
from pathlib import Path
import struct,hashlib,json,math
HERE=Path(__file__).resolve().parent
MAX=(1<<64)-1

def state(time=0,energy=0.0,id='0987898',rng=1,life='ACTIVE',grid=None):
 return {'time':time,'grid':grid or [[{'traversal':'FREE','effect':None}]],'entities':[(id,{'id':id,'position':{'x':0,'y':0},'energy':energy,'lifecycle':life})],'rng_state':rng}
def fnv(b):
 h=2166136261
 for byte in b:h=((h^byte)*16777619)&0xffffffff
 return h
def wire(s):
 t=s['time'];entities=[]
 for k,e in s['entities']:
  v=dict(e)
  if e['energy']==0 and math.copysign(1,e['energy'])<0:v['energy']={'$type':'binary64','hex':'8000000000000000'}
  entities.append([k,v])
 return {'time':{'$type':'bigint','value':str(t)} if t>(1<<53)-1 else t,'grid':s['grid'],'entities':{'$type':'map','entries':entities},'rng_state':s['rng_state']}
def encode(s):
 b=b'WLS1'+struct.pack('>QII',s['time'],len(s['grid'][0]),len(s['grid']))
 for row in s['grid']:
  for c in row:
   effect=c['effect'];kind=0 if effect is None else 1 if effect['kind']=='RESOURCE' else 2
   b+=bytes([0 if c['traversal']=='FREE' else 1,kind,effect['stock'] if kind==1 else 0])
 b+=struct.pack('>I',len(s['entities']))
 for key,e in sorted(s['entities'],key=lambda x:x[0].encode('utf-8')):
  id=e['id'].encode('utf-8',errors='strict');energy=0.0 if e['energy']==0 else e['energy']
  b+=struct.pack('>I',len(id))+id+struct.pack('>IIdB',e['position']['x'],e['position']['y'],energy,0 if e['lifecycle']=='ACTIVE' else 1)
 return b,b+struct.pack('>I',s['rng_state'])
cells=[[{'traversal':'FREE','effect':None},{'traversal':'BLOCKED','effect':None},{'traversal':'FREE','effect':{'kind':'RESOURCE','stock':0}}],[{'traversal':'FREE','effect':{'kind':'RESOURCE','stock':1}},{'traversal':'FREE','effect':{'kind':'HAZARD'}},{'traversal':'FREE','effect':None}]]
inputs=[
 ('PV-F5C-TIME32',state(time=1<<32),'§34 uint64 crosses uint32 boundary','Truncation/endianness at 2^32'),
 ('PV-F5C-TIME64',state(time=MAX,energy=10,rng=0xffffffff),'D-01-E + §34 exact UINT64_MAX/uint32 RNG','Lossy Number conversion or signed uint32'),
 ('PV-F5C-CELLS',state(time=1,grid=cells,rng=0x12345678),'§8 + §34.3–4 all cell tags, y then x','Column-major traversal, wrong tag/stock'),
 ('PV-F5C-UTF8',state(time=7,id='é😀',energy=1.5),'§9 + §34.5 UTF-8 byte length=6','UTF-16 length, surrogate encoding'),
 ('PV-F5C-UNNORMALIZED',state(id='e\u0301',energy=.1,rng=2),'§34.5 raw UTF-8, no normalization','Unicode normalization or arbitrary rounding'),
 ('PV-F5C-ZERO',state(id='zero',energy=-0.0),'§6.4 + §34.8 -0 canonicalization','Preserved negative-zero sign in bytes'),
 ('PV-F5C-SUBNORMAL',state(time=42,id='subnormal',energy=float.fromhex('0x0.0000000000001p-1022'),rng=0x80000000),'§6.4 + §34 exact subnormal binary64','Flush-to-zero, non-binary64 serialization'),
 ('PV-F5C-MAXFINITE',state(time=1<<53,id='max',energy=float.fromhex('0x1.fffffffffffffp+1023'),rng=0xffffffff),'§6.4 + D-01-E finite binary64 max and BigInt time','Infinity conversion, precision loss'),
 ('PV-F5C-DEAD',state(time=9,id='dead',energy=-7.25,rng=0xdeadbeef,life='DEAD'),'§9 + §34 lifecycle tag and signed finite energy','Omitted lifecycle or unsigned energy')]
rows=[]
for id,s,goal,error in inputs:
 world,full=encode(s)
 rows.append({'id':id,'status':'PROPOSED_ONLY_NOT_NORMATIVE','historical_id':None,'sources':['S025','S026','H034'],'normative_objective':goal,'input_state':wire(s),'preconditions':['Exactly one entity; ACTIVE on FREE; finite energy; uint64 time; nonzero uint32 RNG','Effective snapshot only, no initialize_world or provenance claim'], 'serialization_procedure':'Recovered §34 WORLD: WLS1,u64be time,u32be width/height,cells(y,x),entity_count,UTF8-sorted entity records; FULL appends u32be RNG; -0→+0 only','expected':{'world_bytes':len(world),'full_bytes':len(full),'world_hex':world.hex(),'full_hex':full.hex(),'world_fnv32':fnv(world),'full_fnv32':fnv(full)},'calculation':{'tool':'Python 3 stdlib struct/strict UTF-8/unbounded integer arithmetic','script':'conformance/profile/build_vectors.py','method':'Independent from DataView/Math.imul product and Node Buffer reference; no production module loaded'},'detects':error,'scope_limit':'New proposal fixture, not an authenticated historical V2–V10, no multi-entity dynamics or interoperability'})
(HERE/'vector-candidates.json').write_text(json.dumps({'proposal_id':'WLS1-PV-F5C-1.0.0','approval':'NOT APPROVED; freeze before independent implementation comparison','historical_V2_V10_status':'UNCHANGED BLOCKED','vectors':rows},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'candidate_vectors':len(rows),'approved_reference_vectors_added':0}))
