"""Bounded, source-anchored architectural review. Lexical scans are evidence, not proof."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[2];HERE=ROOT/'conformance/profile'
BASE='e7fada1a0e78ff711f056b53148e048102fd1c02'
def digest(b):return hashlib.sha256(b).hexdigest()
def cite(path,needle,extent=35):
 b=(ROOT/path).read_bytes();lines=b.decode().splitlines();i=next(k for k,x in enumerate(lines) if needle in x)
 end=min(len(lines),i+extent);excerpt='\n'.join(lines[i:end])
 return {'path':path,'function_or_anchor':needle,'file_sha256':digest(b),'lines':[i+1,end],'excerpt':excerpt,'excerpt_sha256':digest(excerpt.encode())}
rows=[]
def add(id,clauses,refs,observed,limit):
 rows.append({'id':id,'clauses':clauses,'scope':'Closed source revision, ordinary validated records and native bindings; no claim about arbitrary runtime replacement or hostile callbacks','evidence':[cite(*r) for r in refs],'observed':observed,'required_next_evidence':limit,'review_result':'BOUNDED_SOURCE_REVIEW; NOT A UNIVERSAL OR INDEPENDENT FORMAL PROOF'})
add('ARCH-WORLD-AGENT',['§4','§4.1','§4.2'],[('js/world/world.js','class World',24),('js/world/world.js','apply_action(action)',57),('js/agents/random_agent.js','class RandomAgent',30),('js/experiment/experiment.js','function execute_experiment',70)],
 'WORLD stores config/state/RNG and accepts Action; native methods do not receive an agent. Factory receives type/derived seed, step receives Feedback. RandomAgent constructs its own PRNG.',
 'Independent capability/data-flow review of all call paths and adapter trust boundary; metamorphic ND5B-AGENT-ISOLATION only covers declared executions.')
add('ARCH-NO-LEARNING',['§1.4','§4.2'],[('js/world/world_config.js','constructor(params)',20),('js/world/world.js','apply_action(action)',57),('js/world/world.js','regenerate_resources()',29)],
 'Config is copied/frozen; inspected transition code updates position/energy/stock/lifecycle/RNG, without training or policy update from agent internals.',
 'Formal definition/scope from missing historical §39 and full write-set/data-flow review; finite source inspection is not a theorem about learning.')
add('ARCH-RECORDER-EXCLUSIVE',['§4.1','§18','§21'],[('js/world/world.js','static _make_action_event',6),('js/world/world.js','resolve_lifecycle()',20),('js/experiment/recorder.js','_prepare_events(raw',22),('js/experiment/recorder.js','record_initial_lifecycle_from_recorded',12)],
 'WORLD creates raw three-field events; Recorder._prepare_events creates temporal/source/sequence enrichment. Replay-initial recorded events are copied, not enriched again.',
 'Independent full producer/consumer call-graph review distinguishing copying RecordedEvent from enriching WorldEvent; incomplete historical event contract remains separately recorded.')
add('ARCH-TIME-SYNC',['§5.1','§5.2','§32','D-01-E'],[('js/experiment/tick_transaction.js','function execute_tick(world',11),('js/experiment/tick_transaction.js','function execute_tick_transaction',62),('js/experiment/experiment.js','const confirmed = execute_tick_transaction',12)],
 'Kernel delegates action→lifecycle→dynamics; after that sets next_time then synchronizes once, validates and snapshots. Experiment records only confirmed results. This is EXPERIMENT orchestration responsibility, not WORLD method time advance.',
 'Complete call/write-site review plus temporal/fault partitions; code location/class name alone does not establish component ownership.')
add('ARCH-OBSERVATION-PURE',['§16','§4.1'],[('js/interface/observation.js','function build_observation',59)],
 'Projection reads validated state, creates new self/view/position records, emits canonical tick and performs no PRNG draw. It has an explicit 64MiB estimated-output capacity guard.',
 'All-path effect/data-flow review and definition of operational capacity failure separate from valid uint32 radius; OBS-P03 is engineering policy, not a normative radius cap.')
add('ARCH-RENDERER-PURE',['§29','§4.1'],[('js/visualization/renderer.js','render(world)',40),('js/main.js','renderer.render',12)],
 'Renderer reads config/state and writes canvas/context; inspected body assigns no state/grid/entity/RNG field. UI supplies a display wrapper around a snapshot.',
 'Independent effect review including callback/canvas assumptions and consumer API scope; Chromium purity examples are supplementary, not universal static proof.')
add('ARCH-SNAPSHOT-ISOLATION',['§7.2','§21','§26.5'],[('js/world/world_state.js','constructor(time',30),('js/experiment/tick_transaction.js','function tick_snapshot_matches',17),('js/experiment/recorder.js','function commit(',23)],
 'WorldState copies cells/entities/positions. Confirmed result gets a deep snapshot; recorder adopts unexposed owned copies. Snapshot validator checks identity separation and values.',
 'Alias/ownership review across all public getters, retained staging values and checkpoints; F4C policy remains D until formal profile compatibility is resolved.')
add('ARCH-EXPERIMENT-REPLAY-BOUNDARY',['§20','§25.4','§26.5','D-01-B'],[('js/experiment/experiment.js','const confirmed = execute_tick_transaction',12),('js/experiment/replay.js','function replay_tick_transaction',29),('js/experiment/recorder.js','function capture(',16)],
 'Experiment is fail-stop if recording fails after world confirmation; replay snapshots WORLD/RNG and recorder token, and restores them on world/recording failure. Recorder checkpoints restore append-only history lengths/state.',
 'Do not claim a new joint Experiment transaction; reconcile broad §5.5 with exact replay/Experiment scope and authorized decisions in candidate precision pack.')
add('ARCH-METRICS-SCOPE',['§4','§4.1','§30'],[],
 'No js/metrics component was found in the enumerated js source tree. No evidence is supplied for a Metrics consumer or its no-mutation behavior.',
 'Retain the current conditional consumer constraint; provide its interface/implementation/evidence or an express normative scope decision. Absence of code is not an exclusion.')
files=sorted(ROOT.glob('js/**/*.js'));file_rows=[{'path':str(p.relative_to(ROOT)),'sha256':digest(p.read_bytes())} for p in files]
clock=[];rng=[]
for p in files:
 for n,line in enumerate(p.read_text().splitlines(),1):
  code=line.split('//',1)[0]
  if re.search(r'\b(?:world|this)\.state\.time\s*(?:\+\+|--|[+*/-]?=(?!=))',code):clock.append({'path':str(p.relative_to(ROOT)),'line':n,'text':line.strip()})
  if 'sync_rng_state(' in code:rng.append({'path':str(p.relative_to(ROOT)),'line':n,'text':line.strip()})
notes=[]
for p in sorted((ROOT/'js/agents').glob('*.js')):
 for n,line in enumerate(p.read_text().splitlines(),1):
  if 'especificación §14.' in line:notes.append({'id':'ARCH-NOTE-LEGACY-SECTION-'+p.stem,'severity':'P2 DOCUMENTATION','path':str(p.relative_to(ROOT)),'file_sha256':digest(p.read_bytes()),'line':n,'evidence':line.strip(),'current_clause':'S025 §14 is Lifecycle; agent contract is §28','impact':'Stale comment pointer can mislead traceability; no behavioral violation reproduced','recommended_correction':'Update comments in a later authorized maintenance change; do not use them as normative authority'})
result={'review_base':BASE,'method':'Direct reading of cited native function bodies + reproducible lexical write/call-site inventory; no AST/formal verifier claim','source_files':file_rows,'reviews':rows,'lexical_clock_write_sites':clock,'lexical_sync_mentions':rng,'lexical_limit':'Comments stripped only at //; scans may miss indirect aliases/dynamic access. Findings rely on cited source reading, not scan absence.','notes':notes,'reproduced_behavioral_P0_P1_defects':[],'global_properties_proven':False}
(HERE/'architecture-review.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'review_areas':len(rows),'files_hashed':len(files),'P2_comment_notes':len(notes),'behavioral_P0_P1':0}))
