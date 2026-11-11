from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2];HERE=ROOT/'conformance/profile'
rows=[]
def gap(id,clauses,available,missing,impact,alternatives,recommendation,text,tests,blocking=True,priority='P1'):
 rows.append({'id':id,'classification':'E','classification_name':'PROPOSED CONTRACTUAL PRECISION','status':'PROPOSED_ONLY_NOT_APPROVED','clauses':clauses,'available_historical_or_current_text':available,'missing_information':missing,'concrete_acceptance_or_interoperability_effect':impact,'technically_valid_alternatives':alternatives,'recommended_choice':recommendation,'minimum_candidate_text':text,'required_tests_or_evidence':tests,'blocks_candidate_readiness':blocking,'priority':priority,'no_current_norm_change':True})
gap('G00-OPAQUE-UNIVERSE',['§1.3','§3','§10.5','§25.5–10','§28.1–4','§31/I-01–66','§35.1–4','§39'],
 'S025: "I-01 a I-66 de v0.2.4 más"; "§25.5–§25.10 Idénticos a v0.2.4"; §35.1–4/§39 remiten al histórico. HINLINE aporta fragmentos, no todo ese cuerpo.',
 'Textos completos de invariantes, Replay Invariant §25.9, alcance heredado de reproducibilidad/agentes y exclusiones. No basta conocer números de IDs.',
 'No se puede demostrar que el conjunto obligatorio esté semánticamente completo. Un cambio aislado de §37 podría certificar omisiones desconocidas.',
 ['Obtener fuentes históricas verificables y reconciliarlas con D-01','Aprobar un anexo normativo completo de reemplazo, con supersesión exhaustiva revisada por el responsable'],
 'HOLD. Priorizar fuente verificable; si no existe, exigir anexo completo antes de una aprobación única. No aprobar con meras precisiones acotadas de políticas conocidas.',
 'Ninguna obligación incorporada cuyo contenido no esté identificado se considera dispensada. La revisión que apruebe un perfil deberá enumerar o sustituir expresamente todas esas obligaciones antes de permitir una declaración de conformidad.',
 ['Revisión de completitud fuente→cláusula→obligación y de fuentes nuevas','Revisión independiente del anexo completo; nuevos casos solo después de fijar reglas'],priority='P0')
gap('G01-ACTION-RESULT',['§12','§13'],
 'S025 §13: IN action, OUT ActionResult; no cambia tiempo/lifecycle/rng; sin ENTITY_DIED; precedencia MOVE explícita; energy_delta binary64. ACT-P01/02/03/05 son decisiones operativas, no recuperación del esquema completo.',
 'Esquema/dominios cerrados de ActionResult, disponibilidad energética y WAIT ante energía negativa/DEAD, orden coste/efecto y significado exacto del delta.',
 'Dos implementaciones compatibles con el texto incompleto pueden producir validity/reason o WAIT diferentes, sin que el corpus pueda decidir autoridad.',
 ['Recuperar el contrato auténtico completo','Adoptar explícitamente las políticas actuales como precisión nueva','Elegir otra política compatible y migrar implementación/tests por orden separada'],
 'Adoptar de forma expresa las políticas actuales coherentes, conservando su origen nuevo, condicionado al cierre de G00.',
 'ActionResult tiene exactamente validity, reason, energy_delta, events. validity es VALID|INVALID|FAILED; reason es NONE|ENTITY_NOT_ACTIVE|OUT_OF_BOUNDS|BLOCKED_CELL|INSUFFICIENT_ENERGY. Una acción ejecutada devuelve VALID/NONE. Inactividad/borde/bloqueo: INVALID con razón correspondiente. Energía insuficiente: FAILED/INSUFFICIENT_ENERGY. Rechazo no muta ni cobra. MOVE/WAIT requieren ACTIVE y energy>=coste; igualdad permite ejecutar y energía negativa no paga coste cero. WAIT cobra wait_cost sin efectos de entrada. MOVE cobra move_cost antes de aplicar recurso disponible o daño de peligro. energy_delta=canonicalize_binary64(energy_final-energy_inicial), con las reglas de finitud de §6.3. Preparar antes de confirmar.',
 ['Cinco tipos, esquema exacto y precedencia combinatoria','WAIT con DEAD/negativos/coste0/igualdad','Orden aritmético, delta efectivo, stock0/1, peligro0/positivo, fallos antes de commit'],priority='P0')
gap('G02-DYNAMICS',['§8','§15','§35.6'],
 'S025 §15: advance_dynamics llama regenerate_resources, sin evento. §35.6 S-1 permite regeneración en el mismo tick cuando resource_regeneration>=1. DYN-P01 usa saturación binaria.',
 'Fórmula histórica completa y contrato de retorno. Delegación explícita no fija inequívocamente todos los detalles de materialización/llamadas internas.',
 'Sin precisión, una prueba del retorno undefined o de un contador interno podría imponer una política de ingeniería como norma.',
 ['Recuperar fórmula auténtica','Precisar transición semántica binaria sin exigir retorno JS ni nombres internos'],
 'Precisar solo transición semántica determinista equivalente a la política actual; dejar retorno/clases como libertad de implementación.',
 'La dinámica regenera únicamente RESOURCE existentes: stock1 permanece1; stock0 permanece0 si resource_regeneration=0 y pasa a1 si es positivo. No crea celdas/recursos, no cambia estructura del mapa, entidad, lifecycle, reloj ni RNG, y no emite eventos. advance_dynamics delega a esa operación; no se exige undefined ni identidad de helpers internos.',
 ['Tasas0/1/UINT32_MAX y stock0/1','Sin recursos, HAZARD/BLOCKED, inmutabilidad y ausencia de RNG/eventos','Validación previa y rechazo sin mutación parcial'])
gap('G03-OBSERVATION-FEEDBACK',['§16','§17'],
 'S025 define tick/self/local_view, Chebyshev, OUT_OF_BOUNDS y occupied=false; HINLINE transmite defaults/campos cerrados de FeedbackConfig y Feedback. FB-P01 y OBS-P01/02 completan subregistros.',
 'Esquemas históricos completos de self/celda y representación de los campos ocultos del ActionResult proyectado.',
 'Diferentes marcadores ocultos o subcampos pueden filtrar información o impedir igualdad estructural sin contradecir el fragmento disponible.',
 ['Recuperar subesquemas/marcadores históricos','Aprobar expresamente el perfil de proyección actual sin alterar el resultado crudo'],
 'Adoptar proyección actual por precisión expresa, mantener Raw ActionResult separado, y verificar las16 combinaciones.',
 'Observation.self={id,position:{x,y},energy}; local_view es matriz cuadrada Chebyshev de registros cerrados {representation,occupied}; representation=FREE|BLOCKED|RESOURCE|HAZARD|OUT_OF_BOUNDS y occupied=false. Feedback tiene observation,has_prior_action,last_action_result; sin acción previa false/null. Si hay resultado previo, proyectar cuatro campos: deshabilitar validity/reason produce null, events produce [], energy_delta produce +0. Ningún campo deshabilitado transmite su valor; las copias no comparten referencias mutables. Estos marcadores no se añaden al ActionResult crudo.',
 ['16 combinaciones, no filtración directa/indirecta','Esquemas y malformed inputs, aliases y pureza','Recurso stock0/1 indistinguible y bordes/radio0'])
gap('G04-OPERATIONAL-EVENTS',['§13','§18','§21','§32'],
 'HINIT transmite WorldEvent cerrado de tres campos; HINLINE transmite RecordedEvent y mapas entity_states. S025 prohíbe muerte en apply_action y fija lifecycle después. ACT-H01/02 precisan movimiento antes de efecto.',
 'Orden operacional completo y criterio exacto de ENTITY_MOVED/efectos con magnitud cero, más el catálogo histórico de todos los eventos.',
 'Mismos estados físicos pueden tener trayectorias con listas de eventos distintas. Campos conocidos no recuperan todo su disparo/orden.',
 ['Recuperar §18 completo','Precisar los eventos operacionales actuales con reglas exhaustivas y dejar los demás históricos bloqueados'],
 'Adoptar explícitamente el orden operacional actual, sin inventar tipos adicionales; cerrar el resto de §18 con G00.',
 'MOVE aceptado emite ENTITY_MOVED primero. Si RESOURCE pasa1→0 emite RESOURCE_CONSUMED después, incluso con efecto0; si entra en HAZARD emite HAZARD_TRIGGERED después, incluso con daño0. WAIT y rechazos no emiten movimiento ni efecto de entrada. apply_action nunca emite ENTITY_DIED. WORLD devuelve solo {type,entity_id,position}; RECORDER añade tick/source/sequence y conserva orden de acción antes de lifecycle.',
 ['Listas exactas con efecto0/positivo y recurso agotado','Orden y secuencia entre ticks, aliases y fallos de preparación','Sin enriquecimiento WORLD ni duplicación de muerte'])
gap('G05-INTERFACE-SCHEMAS',['§19','§22','§25','§26.5'],
 'S025 enumera campos de ExperimentConfig, StepRecord y Trajectory. D-01 fija dominios temporales/contexto/modos. F3A-P02/03 declara expresamente de ingeniería los esquemas TickResult/ConfirmedTickResult.',
 'Esquemas de salida del kernel y precisiones de tipos/errores de configuración no fijadas por el texto histórico disponible; ABI portable frente a Map/clases JS.',
 'El perfil no puede exigir constructor/instanceof/retornos internos como si fueran autoridad histórica; las interfaces observables sí necesitan un acuerdo.',
 ['Recuperar el contrato auténtico de salidas','Adoptar semántica/esquemas actuales de salida y una codificación portable de registros/mapas'],
 'Adoptar los esquemas autorizados actuales como precisión nueva, conservar D-01 exacto y libertad de estructuras internas.',
 'TickResult cerrado={action_result,action_events,lifecycle_events}, action_events estructuralmente igual a action_result.events. ConfirmedTickResult cerrado={tick,world_state,action_result,action_events,lifecycle_events,termination}; snapshot profundo posterior a confirmación, tick igual numéricamente a world_state.time, termination de determine_termination. Los eventos siguen crudos. Los mapas semánticos se transportan por claves/valores; no se obliga a usar Map ni una clase JavaScript. Los dominios temporales y ocho campos de request_context son los de D-01, sin reducción silenciosa.',
 ['Esquemas, exactitud Number/BigInt, independencia de snapshot','Separación de eventos, rechazo de metadatos crudos/enriquecidos mezclados','Interfaz de adaptador revisada sin oráculos en implementación'])
gap('G06-INIT-EDITORIAL',['§11.1','§11.7','§21'],
 'HINIT contiene la aclaración autorizada INIT-004: WORLD valida eventos crudos, Recorder enriquece y valida metadatos temporales. La implementación ya aplica esa decisión.',
 'El texto consolidado v0.2.5 no incorpora editorialmente esa separación; D-01 declara que §11.7 no cambia.',
 'Un lector sin HINIT puede interpretar que WORLD debe crear campos de Recorder. Esto no reabre la decisión ya autorizada ni declara bloqueo nuevo de initialize_world.',
 ['Mantener referencia explícita a HINIT en el paquete de autoridad','Consolidar editorialmente INIT-004 en la próxima revisión aprobada'],
 'Consolidar la aclaración ya autorizada al publicar un paquete normativo único; no pedir una nueva elección de semántica.',
 'La validación de inicialización en WORLD recibe WorldEvent crudos y comprueba esquema/id/posición/lifecycle. Las condiciones tick=0,source=lifecycle y secuencia inicial se validan sobre RecordedEvent por RECORDER. Ningún paso vuelve a resolver lifecycle.',
 ['Muerte inicial única, ACTIVE sin muerte, campos extra rechazados','Recorder tick0/sequence0 sin doble resolución'],blocking=False)
gap('G07-NUMERIC-CAPACITY',['§10.3','§10.6','§16','§26.6'],
 'S025 fija muestreo por rechazo, tabla Xorshift sin semilla expresamente indicada y radio uint32. D-01 ya resuelve max_ticks/ticks/sequence; OBS-P03 y límites de next_int siguen como políticas documentadas.',
 'Extremos/cardinalidad públicos de next_int, contexto de semilla del vector publicado y taxonomía de capacidad operacional para observaciones muy grandes.',
 'Aceptar un radio no garantiza poder materializar su ventana; rechazarlo como invalid world_config cambiaría el dominio. Un caso que exige el presupuesto exacto64MiB no es un criterio normativo.',
 ['Precisar entradas de next_int y error operacional de capacidad separado','Diseñar observación con otra estrategia de memoria por orden futura; no recortar ventanas'],
 'Formalizar extremos Number seguros y cardinalidad1..2^32 ya aceptados; explicitar semilla1 del vector sin cambiar valores. Conservar dominio uint32 del radio y separar capacidad operacional sin fijar64MiB como norma.',
 'next_int admite extremos Number enteros seguros a<=b con1<=b-a+1<=2^32 y aplica el rechazo de §10.3 sin cambios. La tabla §10.6 corresponde a seed=1. Un fallo de recursos al materializar una observación se informa por una categoría operacional definida por la revisión aprobada, antes de publicar salida parcial, sin modificar WORLD/RNG, sin truncar la ventana ni redefinir el radio como inválido. El umbral de memoria pertenece a la implementación.',
 ['Cardinalidad1/2^32, límites seguros, rechazo en limit','Vector seed1 exacto y restauración','Fallo de capacidad con salida no publicada, dominio intacto y error operacional documentado'])
gap('G08-COMPARATORS-AND-SCOPE',['§25.7','§25.8','§30','§39'],
 'D-01 fija firmas/modos y comparación exhaustiva; HINLINE transmite derive_termination_reason. El envelope Match/Mismatch y reason son decisiones JS documentadas; §30 solo dice consume Trajectory y §39 remite al histórico.',
 'ABI diagnóstica portable de Match/Mismatch, alcance completo de consumidores/learning-agents y qué evidencia alternativa satisface esas restricciones.',
 'Mensajes humanos o clases JS no deben impedir interoperabilidad por accidente; tampoco puede excluirse METRICS solo porque no haya implementación localizada.',
 ['Recuperar contratos completos','Precisar ABI semántica portable y mantener consumidores/alcances no definidos como bloqueos'],
 'Comparar estado MATCH/MISMATCH y diagnósticos tipados solo cuando sean normativos; preservar incertidumbres de alcance en G00, no dispensarlas.',
 'Los predicados públicos Valid/Invalid usan los booleanos ya fijados por D-01. Match/Mismatch conserva su significado; los textos diagnósticos no normativos no se usan para equivalencia entre motores salvo especificación expresa. METRICS mantiene la restricción de no mutar Trajectory y debe aportar evidencia o una decisión explícita de alcance; la falta de código no es una exclusión.',
 ['Comparación completa y motivo terminal sin inferir agotamiento expected_steps','Revisión de API de consumidores, diagnóstico y archivo de trazabilidad','Cerrar los contenidos históricos de §39/§35/§25.9 con G00'])
gap('G09-VECTOR-FREEZE',['§34.9','§37'],
 'H034/S025 declaran V2–V10 pendientes. F5-C calcula nueve PV-F5C con IDs nuevos, no recupera esos vectores.',
 'Referencia autorizada de bytes/hash para sustituir la lista pendiente y alcance exacto del corpus aprobado.',
 'Las propuestas no pueden decidir conformidad como referencias vigentes ni satisfacer por renombrado los nueve bloqueos históricos.',
 ['Recuperar referencias auténticas si existen','Aprobar expresamente el conjunto nuevo de propuestas, con reemplazo de la referencia pendiente antes de comparar motores'],
 'Revisar y congelar el conjunto nuevo solo junto al paquete normativo aprobado; mantener V2–V10 históricos BLOCKED en esta fase.',
 'La revisión aprobada identifica un conjunto de referencia nuevo por ID, versión y hash, con entradas/bytes/hashes fijados antes de contraste independiente. Su adopción no constituye recuperación de V2–V10. Ninguna expectativa cambia para acomodar una implementación.',
 ['Comparación independiente de cálculos Python/Buffer','Validación de estados, exactitud de bytes, inversión de byte/endianness detectada','Aprobación registrada antes de cualquier comparación independiente de WORLD'])
# D is evidence about implemented policy, not a normative source.
policies=[
 ('ACT-P01/02/03/05','ActionResult/WAIT/energy','G01-ACTION-RESULT'),('ACT-H01/02','Operational ordering and zero-magnitude effects','G04-OPERATIONAL-EVENTS'),('DYN-P01–03','Binary regeneration/staging and undefined return','G02-DYNAMICS'),('OBS-P01/02','Observation subrecords/identity','G03-OBSERVATION-FEEDBACK'),('OBS-P03','64MiB estimated capacity guard','G07-NUMERIC-CAPACITY'),('FB-P01–03','Hidden markers/strict projection','G03-OBSERVATION-FEEDBACK'),('F3A-P02/03','TickResult/ConfirmedTickResult schemas','G05-INTERFACE-SCHEMAS'),('F4C-P01','Private owned recorder history and append implementation','G05-INTERFACE-SCHEMAS'),('F3C-P02','JavaScript Map representation, not semantic map domain','G05-INTERFACE-SCHEMAS')]
BASE_DOCUMENT_SHA='2e1e003018abd7739f607c5bab8120c7a3a64bd9ab22b3abb1eae6a533c4f406' # fixed provenance at the declared Git review base, not the mutable status file
result={'classification_names':{'A':'EXPLICIT CURRENT NORM','B':'INCORPORATED HISTORICAL NORM','C':'INCOMPLETE HISTORICAL REFERENCE','D':'ENGINEERING POLICY','E':'PROPOSED CONTRACTUAL PRECISION'},'priority':'G00 first; other precision choices do not prove completeness of the missing universe','gaps':rows,'engineering_policies':[{'id':p,'classification':'D','behavior':b,'linked_precision':g,'source_path':'docs/IMPLEMENTATION_STATUS.md','source_git_base':'e7fada1a0e78ff711f056b53148e048102fd1c02','doc_sha256_at_review_base':BASE_DOCUMENT_SHA,'authority':'Engineering evidence only. Superseded ACT-P04 is not adopted. Temporal domains expressly replaced by D-01 are A, not unresolved D.'} for p,b,g in policies]}
(HERE/'contract-gaps.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'precision_candidates':len(rows),'blocking':sum(g['blocks_candidate_readiness'] for g in rows),'current_norm_changes':0}))
