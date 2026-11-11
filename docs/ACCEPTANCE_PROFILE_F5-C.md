# WORLD-LAB — perfil candidato F5-C

**F5C-001 — ACCEPTANCE BASIS CANDIDATE PREPARATION**

Clasificación: *Methodological and Normative Acceptance-Governance Decision Preparation*.
Base: `e7fada1a0e78ff711f056b53148e048102fd1c02`, posterior al PR #32.
Perfil: **WL-ACCEPT-v026-CAND-1.0.0**, versión `1.0.0-candidate`.
Estado: **DRAFT / HOLD / NO APROBADO**. La propuesta F5-B continúa PROPOSED ONLY.

## Decisión recomendada

**HOLD**, no APPROVE CANDIDATE ni APPROVE WITH RESOLUTIONS.
El texto disponible puede indexarse íntegramente, pero no permite identificar
semánticamente todo el contenido obligatorio incorporado: I-01–I-66, Replay
Invariant §25.9 y partes heredadas de reproducibilidad, interfaces y alcance.
Cerrar unas políticas familiares no demuestra que no existan otras obligaciones.
La preparación del expediente está completa para que el responsable pueda rechazar
esta base o autorizar su resolución; no se declara completo el universo contractual.

Debe elegirse primero G00: obtener fuente verificable, o aprobar un anexo normativo
**completo** que sustituya expresamente lo ausente. Se recomienda priorizar la fuente
si existe; si no, el anexo completo debe preceder una aprobación normativa única.
No basta aprobar §37, un contador de PASS o estas precisiones acotadas por separado.

## Autoridad e inventario

La prioridad es S026 para sustituciones D-01, S025 para lo demás y fragmentos
históricos incorporados con su alcance/procedencia. Código y F5-A/B son evidencia.
Los hashes están en [sources-candidate.json](../conformance/profile/sources-candidate.json).
H034/HINIT conservan las capturas anteriores. HINLINE archiva fragmentos ya
transmitidos por el responsable en este chat (mapa, Feedback, RecordedEvent,
entity_states, lifecycle y terminación); fija esta transcripción, no autentica un
manuscrito histórico íntegro ni accede a la Biblioteca de ChatGPT.
Las precisiones técnicas de Map y los dominios históricos sustituidos por D-01
no se promueven a norma por estar dentro de una cita recuperada.

[clause-inventory.json](../conformance/profile/clause-inventory.json) contiene
141 fichas de cláusulas/fragmentos, con clasificación, tipos de enunciado,
precondiciones/dominio, postcondiciones, invariantes, prohibiciones, precedencias,
responsables, dependencias y evidencia requerida. Sus 572 unidades son **fragmentos
literales, alias y referencias**, no 572 obligaciones lógicas independientes ni
un objetivo de cantidad. Hay 515 unidades marcadas obligatorias, incluidos 66
marcadores de invariantes cuyo contenido sigue desconocido. La validación cubre
cada línea no vacía de los dos textos vigentes por ficha/fragmento; eso prueba
integridad del índice, no recuperación del contenido ausente.

Las cinco clases se mantienen separadas: A definición vigente explícita; B
fragmento histórico incorporado disponible; C referencia histórica incompleta;
D política de ingeniería; E precisión propuesta pendiente. El índice fuente
contiene 429 fragmentos A, 55 B, 86 C y dos atribuciones técnicas D. El catálogo
separado identifica nueve grupos de políticas D y diez precisiones E; no son
sumas de obligaciones ni normas nuevas. El
[registro de brechas](../conformance/profile/authority-breach-register.json)
expone para cada C/E texto disponible, ausencia, efecto, alternativas, recomendación,
precisión y evidencia necesaria. Las referencias opacas conservan el texto de la
incorporación; no reciben definiciones fabricadas.

## Precisiones recomendadas, sin aplicarlas

El detalle y los textos mínimos están en
[contract-gaps.json](../conformance/profile/contract-gaps.json).

| ID | Elección recomendada | Efecto concreto |
|---|---|---|
| G00 | Fuente verificable o anexo de reemplazo exhaustivo; HOLD hasta entonces | Impide que una base incompleta pueda aprobarse por omisión |
| G01 | Adoptar expresamente ACT-P01/02/03/05 compatibles como precisión nueva | Fija ActionResult, WAIT, disponibilidad, orden energético y delta; no los llama historia recuperada |
| G02 | Fijar transición binaria actual sin imponer undefined/helpers internos | Cierra regeneración y efectos observables sin nueva aleatoriedad |
| G03 | Fijar subregistros y proyección oculta actual expresamente | Permite verificar16 flags y no filtración sin inventar ActionResult crudo nullable |
| G04 | Fijar orden MOVE→efecto y disparo con magnitud0 | Hace comparables eventos/trajectorias completos |
| G05 | Fijar esquemas de salida autorizados, mapas semánticos y ABI portable | Evita exigir constructores/clases JS como norma |
| G06 | Consolidar editorialmente INIT-004 ya autorizado | No reabre la decisión de inicialización ni bloquea de nuevo su implementación |
| G07 | Precisar next_int/contexto del vector y capacidad operacional | Mantiene algoritmo/radio válidos; no convierte64MiB en límite normativo |
| G08 | Precisar diagnósticos/consumidores y cerrar el alcance heredado con G00 | No excluye Metrics por falta de código ni impone textos humanos no normativos |
| G09 | Revisar y congelar un conjunto nuevo de vectores por acto posterior | No renombra PV como V2–V10 recuperados |

Nueve precisiones bloquean preparación de aprobación; G06 es consolidación
editorial de una aclaración ya autorizada. La recomendación de adoptar políticas
es un **texto nuevo propuesto**, nunca una conversión automática D→A.
D-01 ya resuelve los dominios temporales de max_ticks/tick/sequence: no se reabren
como si siguieran limitados por políticas históricas sustituidas.

## Revisión de los 114 casos y suficiencia

[corpus-quality-review.json](../conformance/profile/corpus-quality-review.json)
revisa cada caso: obligación relacionada, independencia real, política dependiente,
clase de entrada, negativos, sensibilidad y generalización. Categorías y expectativas
F5-A/B permanecen inalteradas. El perfil propone 58 ejemplos obligatorios definidos,
44 condicionados a precisiones/esquemas y 12 complementarios (11 ER y un ND cuyo
contador interno es más específico que la delegación semántica). Esa selección
no elimina ninguna obligación; los 44 condicionados siguen siendo criterios pendientes.

ND-DYNAMICS conserva su categoría histórica de F5-A, pero exigir regeneration_calls=1
no se toma como criterio universal sin precisión. Los prefijos de esquema actual
siguen siendo positivos de ingeniería, no autoridad para decidir otro esquema.
El enlace caso→cláusula es relación; no certifica una sección completa por tema.

La [matriz de suficiencia](../conformance/profile/sufficiency-matrix.json) exige
condiciones explícitas para cada unidad obligatoria:

| Estado | Unidades obligatorias | Significado |
|---|---:|---|
| SATISFIED_BY_EVIDENCE | 3 | Solo los conjuntos finitos de referencia: tres FNV, dos semillas y V1 literal |
| PARTIAL | 227 | Ejemplos/relaciones, sin cobertura completa o prueba general suficiente |
| BLOCKED_BY_UNRESOLVED_CONTRACT | 97 | Definiciones/dependencias obligatorias ausentes o pendientes |
| BLOCKED_BY_MISSING_TEST | 24 | Definición disponible sin evidencia suficiente vinculada |
| REQUIRES_STATIC_REVIEW | 162 | Revisión completa de efectos/autoridad/alias no aceptada todavía |
| REQUIRES_INDEPENDENT_IMPLEMENTATION | 2 | Cláusulas de interoperabilidad; no ejecución independiente aquí |
| VERIFIED_EXCEPTION | 0 | Ninguna unidad obligatoria dispensada por carencia de evidencia |

No se convierten automáticamente las 35 filas de ejemplos F5-B en suficiencia.
Los tres conjuntos finitos se contrastan contra el **literal de la fuente**, no
solo contra una etiqueta PASS; las pruebas del perfil rechazan un PASS falsificado.
Separadamente hay tres excepciones de alcance expresas: no reclamar cooperación/
hazards dinámicos, procedencia histórica del checkpoint ni causalidad externa del
fallo del agente. No eximen validar estados, secuencias, contexto ni prefijos.
Falta de implementación, pruebas, memoria o contrato no son exclusiones válidas.

## Revisión arquitectónica específica

[architecture-review.json](../conformance/profile/architecture-review.json)
contiene nueve áreas, funciones/intervalos, SHA de archivo/extracto y29 fuentes JS
inventariadas. Se revisan separación WORLD/AGENT y dependencias, no aprendizaje,
enriquecimiento exclusivo de RECORDER, orden/tiempo/sync, observación, renderer,
snapshots y frontera EXPERIMENT/replay. Se distingue copiar RecordedEvent de enriquecer
WorldEvent, y el helper de confirmación temporal pertenece a orquestación de
EXPERIMENT aunque esté en otro archivo.

La inspección localiza la escritura explícita world.state.time en el kernel,
los registros crudos de WORLD, el enriquecimiento en Recorder._prepare_events y
las copias profundas/propiedad del historial. EXPERIMENT conserva fail-stop si
falla Recorder tras confirmar WORLD; replay conserva sus checkpoints y restauración.
No se afirma una transacción conjunta nueva. Metrics no se localizó como módulo:
se conserva su restricción de consumidor/no mutación y se pide evidencia o decisión
expresa de alcance, no una exclusión por inexistencia de implementación.

Es revisión **acotada de código nativo y registros ordinarios**, más inventario
léxico reproducible; no análisis formal universal. La búsqueda léxica puede perder
alias y acceso dinámico. Se necesita revisión independiente/data-flow/capacidades
antes de dar por satisfechos esos universales. Se registran cinco notas P2 de
comentarios legacy de agentes que remiten a §14.x, cuando §14 actual es lifecycle.
No se reprodujo una violación conductual P0/P1 ni se corrige producción en F5-C.

## Nueve vectores propuestos, no referencias vigentes

[vector-candidates.json](../conformance/profile/vector-candidates.json) fija
PV-F5C-TIME32/TIME64/CELLS/UTF8/UNNORMALIZED/ZERO/SUBNORMAL/MAXFINITE/DEAD.
Cada uno contiene estado exacto wire, objetivo, bytes WORLD/FULL, hashes,
herramienta, procedimiento y error que detecta. Python struct/UTF-8 estricto y
enteros arbitrarios calculan las expectativas sin cargar yellow. La validación
Node Buffer/BigInt independiente confirma bytes y hashes; eso no es una segunda
implementación de WORLD ni interoperabilidad.
Los estados tienen una entidad; no se pretende ejercitar orden de varias entidades
fuera del dominio actual. Son snapshots efectivos, sin promesa de procedencia.
V2–V10 históricos y los 289 BLOCKED siguen intactos. La congelación como referencia
vigente requiere aprobación explícita antes de comparar implementaciones.

## Texto final candidato para §37 — PROPUESTO, NO APLICADO

El texto parte de F5-B y se refiere inequívocamente a la familia normativa actual
v0.2.6 D-01 sobre v0.2.5 y al perfil candidato WL-ACCEPT-v026-CAND-1.0.0.
Como este candidato está en HOLD, cualquier resolución que cambie su contenido
exige nueva versión/hash y actualizar el acto de aprobación **antes** de adoptarlo.
La referencia exacta de integridad está en profile-lock.json; no es una firma de aprobación.

> **§37 — Criterio de conformidad y autoridad del perfil de aceptación**
>
> Una declaración de conformidad identifica la revisión normativa aplicable y un
> perfil de aceptación aprobado mediante acto normativo expreso. Ese acto publica
> exactamente el ID, versión y SHA-256 del manifiesto, su tabla de supersesión y
> sus fuentes. No se permite una referencia flotante a «la última versión».
> Para v0.2.6 D-01 sobre v0.2.5, WL-ACCEPT-v026-CAND-1.0.0 es únicamente una base
> candidata no aprobada; ni su preparación ni sus PASS constituyen conformidad.
>
> Una implementación es conforme al perfil/revisión identificados si y solo si:
> (1) respeta todos los contratos vigentes de §§6–30, invariantes de §31, orden de
> §32 y Replay Invariant §25.9, con las sustituciones expresamente aprobadas;
> (2) el conjunto obligatorio está íntegramente definido, sin referencias cuyo
> contenido permanezca desconocido; (3) se satisfacen las condiciones explícitas
> de suficiencia de cada obligación mediante casos, oráculos y evidencias
> estáticas/formales/experimentales exigidos; (4) no hay FAIL, BLOCKED o UNTESTED
> en criterios obligatorios aplicables, ni P0/P1 bloqueantes u OPEN-CRITICAL;
> y (5) existen revisión de trazabilidad, independencia del oráculo y capacidad
> adversarial de refutar resultados incorrectos. Un PASS aislado o una asociación
> temática no satisface por sí solo una obligación.
>
> El código implementado no es autoridad contractual. Una política de ingeniería
> solo se convierte en regla obligatoria por aprobación normativa expresa de su
> texto y alcance. Restricciones no ejecutables requieren la evidencia alternativa
> fijada en el perfil; inspección informal o ausencia léxica de un nombre no prueba
> una propiedad universal. Una exclusión debe derivar del alcance normativo real;
> no puede fundarse en falta de código, pruebas, contrato o capacidad local.
>
> El manifiesto contiene fuentes/hashes, pre/postcondiciones, particiones del
> dominio, oráculos/métodos, casos obligatorios y complementarios, dependencias,
> contrastes negativos, evidencias no ejecutables, excepciones y límites. Las
> expectativas se fijan y aprueban antes de la comparación; un cambio de fuente,
> obligación, entrada, esperado u oráculo exige revisión versionada y nueva
> referencia de aprobación. No se ajustan expectativas para acomodar un resultado.
>
> Los T01–T280 auténticos conservan identidad, versión y estado. Los no recuperados
> nunca se cuentan como PASS. Reemplazar su exigencia de ejecución requiere que
> el acto normativo apruebe expresamente el corpus sustituto de IDs nuevos y su
> suficiencia, sin fingir recuperación histórica ni dispensar reglas desconocidas.
> Si aparece una fuente histórica posterior, se preserva, se determina su vigencia
> frente a las sustituciones y se revisa el perfil antes de mantener una declaración
> afectada. No se altera silenciosamente un test histórico ni un esperado publicado.
>
> Hito B exige el cumplimiento de este criterio para la revisión/perfil aprobados.
> Hito C exige además replay y resultados estructurales/binarios coincidentes de
> implementaciones independientes sobre las mismas entradas y expectativas
> congeladas, incluidos vectores de referencia aprobados antes del contraste.
> Regresión entre versiones de un motor u oráculos parciales no son interoperabilidad.
>
> Una contradicción reproducible en una obligación, un P0/P1 bloqueante, una fuente
> u oráculo inválidos o la invalidación de evidencia obligatoria suspenden la
> declaración afectada. Deben registrarse alcance, prioridad e impacto, revisar
> la autoridad y cerrar la causa con evidencia y aprobación documentadas antes
> de restaurarla. La preparación o aprobación de un procedimiento no certifica
> su ejecución ni los resultados de WORLD.

Este texto no cambia v0.2.5/v0.2.6 y no aprueba el perfil actual. G00, las precisiones
restantes, las referencias de vectores y el manifiesto resuelto deben formar un
paquete de aprobación único y coherente; no una renuncia implícita a lo ausente.

## Puerta final y continuación recomendada

**HOLD** hasta resolver G00 y sus dependencias de autoridad. La alternativa
APPROVE WITH RESOLUTIONS sería prematura porque el contenido heredado desconocido
impide demostrar que las decisiones conocidas son exhaustivas. Elegir fuente
verificable o anexo completo; después revisar un manifiesto resuelto, fuentes,
suficiencia, precisiones y vectores, actualizar versión/hash y someter todo a una
aprobación normativa expresa. No se inicia todavía interoperabilidad.
La preparación de este expediente no modifica teoría, física, contratos del agente
ni resultados; permite una decisión fundada sobre aceptación del instrumento.
