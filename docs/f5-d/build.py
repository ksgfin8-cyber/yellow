"""Generate analysis-only D1/D2 and Product A from a reviewed semantic catalog.
No import/execution of yellow. Literal fragments remain trace locators, not requirement counts.
"""
from pathlib import Path
import json,hashlib,runpy,re,base64,collections
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent
BASE='a3fb5b823bfdf74a981e9acf9e10bb30cc18b478'
def read(p):return json.loads((ROOT/p).read_text())
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def save(name,value):(HERE/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
C=runpy.run_path(str(HERE/'contracts.py'))['CONTRACTS'];inv=read('conformance/profile/clause-inventory.json');Q=read('conformance/profile/corpus-quality-review.json')
sources=read('conformance/profile/sources-candidate.json')
sources += [{'id':'OWNER','path':'docs/f5-d/owner-clarifications.md','sha256':sha('docs/f5-d/owner-clarifications.md'),'encoding':'utf8','authority':'Owner-attested scoped statements, not independent authentication of a historical manuscript'}, {'id':'ORDER','path':'docs/f5-d/sources/F5D-001-order.b64','sha256':sha('docs/f5-d/sources/F5D-001-order.b64'),'encoding':'base64','original_sha256':hashlib.sha256(base64.b64decode((HERE/'sources/F5D-001-order.b64').read_bytes())).hexdigest(),'authority':'F5D-001 work authorization and external-source lead; not normative amendment'}]
save('sources.json',sources)
# Exact-clause associations are explicit; parent fallback is contextual, never proof.
clause_map=collections.defaultdict(list)
for c in C:
 for cl in c['clauses']:clause_map[cl].append(c['requirement_id'])
fallback={0:'AUTH',1:'SCOPE',2:'BOUNDARIES',3:'TERMS',4:'BOUNDARIES',5:'TIME',6:'CONFIG',7:'STATE',8:'CELL',9:'ENTITY',10:'RNG',11:'INIT',12:'ACTION',13:'ACTION-RESULT',14:'LIFECYCLE',15:'DYNAMICS',16:'OBS',17:'FEEDBACK',18:'EVENT-SCHEMA',19:'EXPERIMENT-CONFIG',20:'RUN',21:'RECORD-INITIAL',22:'RECORD-STEP',23:'TRAJECTORY',24:'HASH',25:'REPLAY-STATUS',26:'ERRORS',27:'NOAGENT',28:'AGENT',29:'RENDERER',30:'METRICS',31:'INVARIANTS',32:'TIME',33:'PSEUDOCODE',34:'WLS1',35:'REPRO',36:'CORPUS',37:'CONFORMANCE',38:'AUTH',39:'NOLEARN'}
trace=[]
for u in inv['units']:
 cl=u['clause']; ids=clause_map.get(cl,[]);rel='CLAUSE_CONTEXT_NOT_SUFFICIENCY'
 if u.get('opaque_reference_id'):ids=['WL-R-INVARIANTS-LEGACY'];rel='UNEXPANDED_IDENTIFIER_ONLY'
 if cl in ['§PREAMBLE','§ANNEX']:ids=['WL-R-AUTH'];rel='METADATA_OR_REPEATED_SUMMARY_NOT_NEW_REQUIREMENT'
 if not ids:
  m=re.match(r'§(\d+)',cl)
  if m:ids=['WL-R-'+fallback[int(m[1])]];rel='PARENT_CONTEXT_ONLY'
 if not ids:raise ValueError(('unmapped',u['id']))
 trace.append({'fragment_id':u['id'],'source_id':u['source_id'],'source_lines':u['source_lines'],'literal_sha256':u['literal_sha256'],'requirement_ids':ids,'relation':rel,'normative_literal':u['mandatory'],'note':'Trace association does not prove semantic entailment, satisfaction, or recovery of absent text.'})
save('fragment-trace.json',{'base':BASE,'all_f5c_units_retained':True,'links':trace})
# Engineering observations are separate from required_behavior. No current code chooses the norm.
observed={
'ACTION-RESULT':'Código produce exactamente validity/reason/energy_delta/events, enums VALID/INVALID/FAILED y NONE/errores; ACT-P01.',
'ACTION-ENERGY':'ACT-P02/03/05: exige energía≥coste antes de efecto, coste primero, entrada MOVE consume recurso/peligro, delta efectivo; WAIT no reentra efecto.',
'DYNAMICS':'DYN-P01: min(1,stock+rate), stock0→1 para rate>0; staging local y retorno undefined.',
'OBS':'OBS-P01–03: self y local_view concretos, celda representation/occupied, ventana completa; guard64MiB lanza RangeError en r512.',
'FEEDBACK':'FB-P01: validity/reason ocultos=null, events=[], energy_delta=+0; F2-I verifica16 flags y nofuga.',
'EVENT-ACTION':'ACT-H01/02: ENTITY_MOVED antes de efecto, se emite HAZARD_TRIGGERED con daño0; registros preparados antes de confirmar.',
'INT':'Acepta extremos Number seguros y cardinalidad≤2^32; rechazo conforme fórmula; diagnósticos locales de dominio.',
'RNG-REF':'Pruebas reproducen tabla con semilla1, calculada también por oráculo; la semilla no está expresada en tabla normativa.',
'CELL':'Cell/efectos cerrados implementados con kind/stock y validación0/1; forma JS no se impone a otro motor.',
'ENTITY':'Código usa position={x,y} enteros no negativos dentro de width/height, también para DEAD; texto completo heredado no recuperado.',
'EXPERIMENT-CONFIG':'F3B-P01: agent_type string Unicode no vacío; clases JS y copias congeladas son representación interna.',
'TICK-TRANSACTION':'F3A-P02/P03 implementan esquemas de tres/seis campos y snapshots; rollback restaura estado y PRNG. No es nueva transacción conjunta con Recorder.',
'RUN':'Código conserva variante failure_details sin seed en error de agente; factory/reset fuera de captura de step; fallo posterior de Recorder es fail-stop.',
'RECORD-INITIAL':'Implementación valida/copia y prepara eventos; contador rechaza próximo valor no seguro antes de adoptar lista. No se reabre INIT-004.',
'RECORD-STEP':'Historial privado F4C-P01; copias, secuencias y bytes/hash preparados antes de append; API pública devuelve copias.',
'TRAJECTORY':'Clase conserva seis campos; metadata y reportes siguen decisiones de ingeniería documentadas.',
'METRICS':'No módulo Metrics independiente localizado. No demuestra incumplimiento de una API no definida ni autoriza una exclusión.',
'REPLAY-INVARIANT':'Motor reproduce transiciones y compara estructura, pero eso no recupera el enunciado completo §25.9.',
'INVARIANTS-LEGACY':'No pueden contrastarse66 contenidos desconocidos contra código por su ID.',
'CORPUS':'Corpus actual114PASS/289BLOCKED; tests locales no adquieren identidad histórica.',
'CONFORMANCE':'Runner informa NOT ESTABLISHED; perfil candidato sigue HOLD y no sustituye §37.'}
policy={'ACTION-RESULT','ACTION-ENERGY','DYNAMICS','OBS','FEEDBACK','EVENT-ACTION','INT','EXPERIMENT-CONFIG','TICK-TRANSACTION','TRAJECTORY','RUN'}
ambiguous={'ACTION-RESULT','ACTION-ENERGY','DYNAMICS','OBS','FEEDBACK','EVENT-ACTION','RUN','EXPERIMENT-CONFIG'}
contrasts={
'AUTH':'FROZEN sin ejecución no puede convertirse en VERIFIED; un test local no adquiere ID T histórico.',
'BOUNDARIES':'WORLD que inspecciona agent.internal_state, o Recorder que escribe WORLD activo, contradice la frontera aun sin import literal.',
'CONFIG':'width=2^20,height=1 frente width=2^20+1,height=1; densidad NaN; campo desconocido: dominios/diagnóstico no deben cambiar al consolidar.',
'ENERGY':'0.1+0.2 debe conservar0.30000000000000004; -0→+0; candidato infinito no confirma estado.',
'STATE':'Cambiar snapshot.entities[id].position no puede cambiar entidad activa; tiempo2^53 debe conservar exactitud.',
'CELL':'BLOCKED con RESOURCE es inválido; FREE con dos efectos no es una Cell admitida.',
'RNG':'Estado0 exige rng zero state sin confirmar; bit alto2^31 comprueba shift lógico, no aritmético.',
'FLOAT':'u=UINT32_MAX produce UINT32_MAX/2^32, no1 ni división por UINT32_MAX.',
'SEED':'Namespace e+acento combinado frente é no se normaliza; surrogate no emparejado no se sustituye silenciosamente.',
'MAP':'Celda bloqueada no puede consumir r2; invertir y/x cambia el mapa y estado RNG para mismo flujo.',
'SPAWN':'Dos candidatos en orden distinto seleccionan posiciones distintas con mismo índice; lista vacía no inventa posición.',
'INIT-EVENTS':'WorldEvent crudo de3 campos coherente no debe exigir metadatos; muerte inicial no se resuelve otra vez en Recorder.',
'ACTION':'{type:UNKNOWN} puede ser estructural y fallar al aplicar; {type:WAIT,extra:1} no es estructura cerrada válida.',
'LIFECYCLE':'ACTIVE con energy==death_threshold muere; DEAD no reemite al llamar otra vez; umbral negativo no cambia comparación.',
'FEEDBACK-CONFIG':'expose_events="false" no es booleano falso; defaults no se obtienen mediante coerción.',
'EVENT-SCHEMA':'Añadir tick/source/sequence a WorldEvent cambia esquema; copiar RecordedEvent de replay no puede reenriquecerlo.',
'TIME':'Observación t frente StepRecord t+1; doble sync o avance durante execute_tick rompe secuencia aun si estado final parece igual.',
'TERMINATION':'DEAD y límite simultáneos devuelve ENTITY_DIED; energía baja sin lifecycle DEAD no basta para inferir muerte.',
'NOAGENT':'WAIT real con coste no equivale a action_result=null ni a omitir transición; no debe invocarse agente.',
'AGENT-FAIL':'Action malformada de step no ejecuta tick extra ni se transforma en WAIT; prefijo confirmado se conserva.',
'INIT-FAIL':'Sin posición inicial no se construye Trajectory vacía con estado ficticio: resultado fallido conserva fallo fuera de trayectoria.',
'SEQUENCE':'Intentar next_counter=MAX_SAFE+1 no puede redondearse ni publicar parcialmente; origen de segmento reinicia contador local, no por cada tick.',
'FNV':'Byte0x80 no puede tratarse como signed negativo ni convertirse primero en texto; empty conserva offset.',
'HASH':'Estados distintos con colisión FNV conocida siguen siendo estructuralmente distintos; RNG solo no debe entrar en WORLD bytes.',
'WLS1':'ID é😀 tiene6 bytes UTF8; longitud en UTF16 da un vector distinto; -0 y+0 serializan igual, mínimo subnormal no se redondea a0.',
'REPLAY-REQUEST':'Mismo snapshot/costesWAIT1 y2 requiere contextos distintos; modo no se deduce de accionesWAIT ni de trayectoria vacía.',
'REPLAY-ORIGIN':'time1,DEAD,events[] es segmento permitido sin nueva muerte; events históricos no vacíos no pueden adoptarse como locales.',
'REPLAY-INVALID':'expected_steps=0 válido y max_ticks=string inválido conserva expected0/maxnull; no convertir ambos a0.',
'TIME-REPR':'MAX_SAFE+1 se emite BigInt, no Number inseguro; BigInt pequeño nuevo tick se normaliza Number, WorldState.time puede conservar representación.',
'RENDERER':'Mutación de objeto recibido por renderer no puede alcanzar WORLD; observar snapshot no consume RNG físico.',
'INVARIANTS':'Hint MAX_TICKS_REACHED con lifecycle DEAD viola I77/D-01 aunque time haya alcanzado el límite.'}
rows=[]
for c in C:
 key=c['requirement_id'][5:];links=[t for t in trace if c['requirement_id'] in t['requirement_ids']]
 c['source']=[{'source_id':u['source_id'],'version':'v0.2.6 D-01' if u['source_id']=='S026' else 'v0.2.5' if u['source_id']=='S025' else 'scoped recovered/owner-attributed fragment','clause':u['clause'],'fragment_id':u['id'],'lines':u['source_lines'],'provenance':'sources.json fixes captured bytes; scope is literal clause context, not whole historic manuscript'} for u in inv['units'] if u['id'] in {x['fragment_id'] for x in links}]
 if not c['source']:raise ValueError(('no source',key))
 classes=sorted(set(u['authority_class'] for u in inv['units'] if u['id'] in {x['fragment_id'] for x in links}))
 if key in {'EVENT-SCHEMA','EVENT-ACTION','FEEDBACK-CONFIG','FEEDBACK','TICK-TRANSACTION'}:
  c['source'].append({'source_id':'OWNER','version':'Owner statements captured in F5-D','clause':'F2-H/F2-I/F3-A as scoped in owner-clarifications.md','fragment_id':None,'lines':None,'provenance':'Visible owner messages, scoped directive/recovered attribution; no complete original manuscript authentication'})
 c['authority_class']={'known_part':'CURRENT_NORM_AND_SCOPED_RECOVERED_NORM','source_index_classes':classes,'unknown_part':'PENDING_SOURCE_OR_DECISION' if c['unknown'] else None,'engineering_behavior_is_not_required_behavior':True}
 c['f5c_fragment_ids']=[x['fragment_id'] for x in links]
 c['verification_status']='NOT_DECLARED_VERIFIED_BY_F5D; existing finite evidence listed separately'
 c['definition_scope']='Status describes this directly stated contract family; dependencies can remain incomplete. No claim of complete historical universe.'
 ids={x['requirement_id'] for x in C};assert set(c['dependencies'])<=ids
 known_tests=[p for p in c['test_files'] if p.startswith('tests/')];c['test_files']=known_tests
 classifications=[]
 if c['status']=='DETERMINED':classifications=['PRESERVED','EQUIVALENT_CONSOLIDATION']
 else:classifications=['UNRESOLVED_REFERENCE']
 if key in ambiguous:classifications.append('AMBIGUOUS_CONTRACT')
 if key in policy:classifications.append('ENGINEERING_POLICY')
 if key=='INIT-EVENTS':classifications=['PRESERVED','EQUIVALENT_CONSOLIDATION']
 evidence=[{'path':p,'sha256':sha(p),'scope':'Existing assertions only; no claim that PASS closes undefined contracts'} for p in known_tests]
 code=[{'path':p,'sha256':sha(p),'scope':'Implementation evidence, never source authority'} for p in c['implementation_paths']]
 c['implementation_refs']=code
 rows.append({'requirement_id':c['requirement_id'],'source_fragments':c['f5c_fragment_ids'],'current_contract':c['required_behavior'],'modifications':'D-01 applies only to explicit aspect; dispositions below retain superseded history','f5c_representation':'Literal/context fragments, not independent semantic obligations','classifications':classifications,'implementation':observed.get(key,'Inspección de los archivos citados para la propiedad conocida; no se infiere contrato de su comportamiento.') if code else observed.get(key,'Propiedad de autoridad/referencia; no se deduce de ejecución productiva.'),'implementation_refs':code,'evidence':evidence,'discrepancy':c['unknown'] or 'No discrepancia funcional demostrada por esta reconciliación; equivalencia documental limitada al enunciado conocido.','equivalence':{'documentary':'Exact restatement of explicitly supported known part; unknown parts are not consolidated as rules','domain':c['domain'],'preconditions':c['preconditions'],'postconditions':c['postconditions'],'ordering':c['ordering'],'errors_and_atomicity':c['failure_behavior'],'observable_effects':c['required_behavior'],'binary':'WLS1 clauses and D-01 temporal outputs when applicable, never JS object identity','demonstration':'Source restatement only; no universal implementation equivalence follows from finite tests','potential_counterexample':contrasts.get(key,'Una fuente histórica aplicable que añada/restrinja la parte desconocida refutaría cualquier cierre global. '+('Ver contraste binary64 independiente DEC-G01.' if key in ['ACTION-ENERGY','ACTION-RESULT'] else 'Revisar entradas de frontera y esquema contra la fuente exacta antes de afirmar equivalencia completa.'))},'decision_ref':('DEC-'+c['gap']) if c['gap'] else None})
# A repeated principle may share underlying requirements but its source remains linked.
save('semantic-requirements.json',{'format':'WORLD-LAB-F5D-SEMANTIC-1','base':BASE,'status':'DRAFT_UNAPPROVED_NON_NORMATIVE','counting_criterion':'One named logical interface/property family per distinct applicability/observable obligation. No paragraph counts; opaque I01–I66 remain one unexpanded reference family plus66 individual placeholders, not reconstructed requirements. Overlapping source context links are not equivalence claims.','direct_definition_counts':dict(collections.Counter(c['status'] for c in C)),'contract_family_count':len(C),'complete_historical_universe_identified':False,'requirements':C})
superseded=[
 ('D01-A','§25.2/25.3 INVALID counters','Unconditional equality with invalid request parameters','Partial counters null iff parameter outside domain; independently valid parameters preserved','Invalid string max_ticks must not be copied into a numeric field.'),
 ('D01-B','§25.1/25.3.3 origins','Initial consistency constrained to time0 for all replay','Replay origin>0 admits empty local initial_events; WORLD initialization unchanged','time1 DEAD+events[] is valid origin, not a new death.'),
 ('D01-C','§25.3.1 continuity signature','(rr,initial_state,actions) lacks physical/feedback context','(rr,request_context) with eight exact keys','Same snapshot wait_cost1 vs2 produces different continuation.'),
 ('D01-D','§25.1/25.7 modes/signatures','Implicit or unavailable observed/unobserved mode','Explicit execution_mode, no defaults/inference','WAIT physical equality does not imply observed StepRecord equality.'),
 ('D01-E','§16/18/22/26.5 temporal outputs','Number-safe tick restrictions inherited where present','uint64 outputs normalized Number/BigInt; sequence/expected stay Number-safe','Tick2^53 cannot be truncated to unsafe Number.'),
 ('INIT-004','§11.1/11.7 raw/enriched split','Reading WORLD initial WorldEvent as if already RecordedEvent','Authorized scoped raw WORLD checks and Recorder enrichment/metadata checks','Raw event with exactly3keys must not be rejected merely for missing Recorder fields.')]
save('contract-reconciliation.json',{'base':BASE,'contract_rows':rows,'dispositions':[{'id':a,'scope':b,'classification':'SUPERSEDED' if a!='INIT-004' else 'EQUIVALENT_CONSOLIDATION','historical_or_replaced_reading':d,'current_requirement':e,'counterexample':f,'authority':'S026' if a!='INIT-004' else 'HINIT','not_new_F5D_approval':True} for a,b,d,e,f in superseded],'new_irreconcilable_current_contradictions_demonstrated':[],'implementation_divergences_proven_against_fully_determined_contract':[],'operational_domain_observations':[{'id':'OBS-CAPACITY','priority':'P1 for full-domain support claim; not evidence of wrong small-radius projection','norm':'observation_radius uint32 valid in WorldConfig; no64MiB normative threshold','code':'RangeError at radius512 under OBS-P03; F2F-17','classification':'ENGINEERING_POLICY','unresolved_question':'Does the approved contract admit a separately declared operational capacity failure? Do not silently shrink WorldConfig.'}]})
# Product A only the known obligations; no policy value is copied from code.
lines=['# WORLD-LAB — Consolidated Specification Candidate (Producto A)','','**DRAFT / UNAPPROVED / NON-NORMATIVE. Sin número de versión nuevo.**',f'Base de análisis: `{BASE}`. No sustituye v0.2.5, D-01 ni §37.','', 'Este candidato expresa únicamente partes sustentadas de contratos; las marcas editoriales identifican lo ausente. No es todavía una especificación autocontenida completa ni una prueba de equivalencia global. Producto B está separado en [NORMATIVE_CHANGE_PROPOSALS.md](NORMATIVE_CHANGE_PROPOSALS.md).','', 'Autoridad: D-01 en sustituciones expresas, v0.2.5 en lo demás, fragmentos recuperados con alcance y atribución preservados. El código nunca completa una laguna normativa. Métodos de verificación y localizadores son anotaciones editoriales, no requisitos nuevos.','', 'Los esquemas se interpretan semánticamente: mapa no obliga a Map/clase JS. No se impone la representación interna actual como condición portable.','', 'Índice:']
for c in C:lines.append(f"- [{c['requirement_id']} — {c['title']}](#{c['requirement_id'].lower()})")
for c in C:
 lines+=['',f"<a id=\"{c['requirement_id'].lower()}\"></a>",f"## {c['requirement_id']} — {c['title']}",'',f"Estado de definición directa: **{c['status']}**. Sujetos: {c['subject']}.",'',f"Precondiciones: {c['preconditions']}.",'',f"Dominio: {c['domain']}.",'',c['required_behavior'],'',f"Orden: {c['ordering']}",'',f"Postcondiciones: {c['postconditions']}",'',f"Fallos: {c['failure_behavior']}",'',f"Invariantes: {c['invariants']}"]
 if c['unknown']:lines+=['',f"**PENDIENTE EDITORIAL — [DEC-{c['gap']}](UNRESOLVED_DECISIONS.md#dec-{c['gap'].lower()}):** {c['unknown']}"]
 lines+=['', 'Fuentes/cláusulas: '+', '.join(sorted(set(s['source_id']+':'+s['clause'] for s in c['source'])))+'. Localizadores exactos y procedencia en [registro semántico](semantic-requirements.json).','', 'Dependencias: '+(', '.join(c['dependencies']) or 'ninguna adicional expresada')+'.']
# Literal procedures are source extracts, not reconstructed historical bodies.
lines+=['','## Pseudocódigo literal disponible','','Extractos de fuente, sin completar alias históricos ni aplicar propuestas nuevas. Las demás sustituciones D-01 se expresan en los contratos anteriores.']
norm=(ROOT/'docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md').read_text()
for start,end in [('### §10.1.','### §10.2.'),('### §11.6.','### §11.7.'),('### §6.4.','## §7'),('### §20.2.','### §20.3.')]:
 excerpt=norm[norm.index(start):norm.index(end)].strip();lines+=['','```text',excerpt,'```']
conditions=norm[norm.index('INVARIANTE GLOBAL: executed == 0'):norm.index('### §25.3.1.')]
conditions=conditions.replace('validate_replay_continuity(rr, initial_state, actions)','validate_replay_continuity(rr, request_context)')
lines+=['','## Condiciones de ReplayResult conservadas con sustitución D-01-C','','Transcripción del bloque S025§25.3; única edición local del bloque: llamadas de continuidad pasan al contexto explícito autorizado por D-01-C. Contadores INVALID se interpretan además según WL-R-REPLAY-INVALID/D-01-AE. No es recuperación del esquema histórico base.','', '```text',conditions.strip(),'```']
for start,end in [('## §31 —','## §32 —'),('### §26.6.','## §27 —')]:
 excerpt=norm[norm.index(start):norm.index(end)].strip()
 lines+=['','## Extracto de invariantes/catálogo vigente con contexto','','Texto literal S025; la referencia I01–I66 sigue sin contenido. D-01-B sustituye el validador inicial de replay para segmentos; D-01 no relaja initialize_world ni los demás invariantes.','', '```text',excerpt,'```']
lines+=['','§11.1 se conserva en WL-R-INIT con la aclaración INIT-004 en WL-R-INIT-EVENTS; no se reproduce sin contexto la frase histórica de metadatos que podría leerse de forma incompatible. §26.5 y §25.9 completos quedan referidos a EXT-024.','', 'La validación de continuidad vigente es contextual según D-01; no insertar el alias antiguo como firma actual. El criterio §37 sigue exigiendo T01–T280: F5-D no aprueba ningún reemplazo.']
# Known recovered procedures/bytes are included literally; gaps stay editorial, never filled by yellow.
inline=(ROOT/'conformance/profile/owner-fragments.md').read_text()
map_excerpt=inline[inline.index('## OWNER-MAP'):inline.index('## OWNER-FEEDBACK')].strip()
recovered=base64.b64decode((ROOT/'conformance/sources/F3-D-2-recovered-order.b64').read_bytes()).decode()
wls_excerpt=recovered[recovered.index('#### §34 — Serialización WLS1'):recovered.index('### 2. Puerta de consistencia')].strip()
run_excerpt=norm[norm.index('### §20.1.'):norm.index('### §20.2.')].strip()
for title,explanation,excerpt in [
 ('Generación recuperada de mapa','HINLINE/OWNER-MAP, atribución del responsable, no manuscrito completo autenticado.',map_excerpt),
 ('WLS1 recuperado y vector V1','H034, fragmento de fuente preservado; V2–V10 siguen pendientes y la semántica de time se conserva bajo D-01.',wls_excerpt),
 ('Pseudocódigo de ejecución con agente','S025§20.1 literal. Las variantes failure_details y los cuerpos históricos ausentes permanecen marcados en WL-R-RUN/DEC-G05; no rellenar los puntos suspensivos.',run_excerpt)]:
 lines+=['','## '+title,'',explanation,'','````text',excerpt,'````']
(HERE/'CONSOLIDATED_SPECIFICATION_CANDIDATE.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'contracts':len(C),'direct_definition_counts':dict(collections.Counter(c['status'] for c in C)),'fragment_links':len(trace),'classification_counts':dict(collections.Counter(x for r in rows for x in r['classifications']))}))
